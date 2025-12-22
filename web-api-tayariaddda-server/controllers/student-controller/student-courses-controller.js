const StudentCourses = require("../../models/StudentCourses");
const CourseProgress = require("../../models/CourseProgress");
const Course = require("../../models/Course");
const User = require("../../models/User");

const getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentBoughtCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    // Check if student has any courses
    if (!studentBoughtCourses) {
      console.log("Student course record not found!");
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const studentCoursesList = studentBoughtCourses.courses;

    // Deduplicate courses based on courseId
    const uniqueCourses = Array.from(
      new Map(studentCoursesList.map(item => [item.courseId, item])).values()
    );

    const courseListWithProgress = await Promise.all(
      uniqueCourses.map(async (item) => {
        const progress = await CourseProgress.findOne({
          userId: studentId,
          courseId: item.courseId,
        });

        // 1. Fetch total curriculum length from Course model to be accurate
        //    (Optimally, we could store 'totalLectures' in StudentCourses on enrollment, 
        //     but fetching ensures data freshness if course updates)
        const courseDetails = await Course.findById(item.courseId);
        const totalLectures = courseDetails?.curriculum?.length || 0;

        const completedLectures = progress?.lecturesProgress?.filter(
          (lecture) => lecture.viewed
        ).length || 0;

        const progressPercentage =
          totalLectures > 0
            ? (completedLectures / totalLectures) * 100
            : 0;

        return {
          ...item.toObject(),
          progress: progressPercentage,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: courseListWithProgress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const enrollStudentInCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({ message: "Student ID and Course ID are required." });
    }

    // Fetch student details from User model
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Fetch course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Define course details for the student record
    const courseDetails = {
      courseId,
      title: course.title,
      instructorId: course.instructorId,
      instructorName: course.instructorName,
      dateOfPurchase: new Date(),
      courseImage: course.image,
    };

    // Check if the student already has a record in StudentCourses
    let studentCourses = await StudentCourses.findOne({ userId: studentId });

    if (studentCourses) {
      // Check if the course is already added
      const courseExists = studentCourses.courses.some((c) => c.courseId === courseId);
      if (!courseExists) {
        studentCourses.courses.push(courseDetails);
        await studentCourses.save();
      }
    } else {
      // If studentCourses record does not exist, create a new one
      studentCourses = new StudentCourses({
        userId: studentId,
        courses: [courseDetails],
      });
      await studentCourses.save();
    }

    console.log("Student course record updated successfully!");

    // Check if the student is already enrolled in the course
    const studentExistsInCourse = course.students.some((s) => s.studentId === studentId);

    if (!studentExistsInCourse) {
      course.students.push({
        studentId,
        studentName: student.fName, // Fetching name from User model
        studentEmail: student.email, // Fetching email from User model
        paidAmount: course.pricing ? course.pricing.toString() : "0",
      });

      await course.save();
      console.log("Student added to the course successfully!");
    } else {
      console.log("Student already enrolled in the course.");
    }

    return res.status(200).json({ message: "Student successfully enrolled in the course." });

  } catch (error) {
    console.error("Error enrolling student:", error);
    return res.status(500).json({ message: "Error enrolling student in course." });
  }
};

const getStudentWeeklyActivity = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Get the start of the last 7 days
    const today = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      last7Days.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        hours: 0
      });
    }

    // Fetch all course progress for the student
    const allProgress = await CourseProgress.find({ userId: studentId });

    // Iterate through all progress records
    allProgress.forEach(courseProgress => {
      if (courseProgress.lecturesProgress) {
        courseProgress.lecturesProgress.forEach(lecture => {
          if (lecture.viewed && lecture.dateViewed) {
            const viewDate = lecture.dateViewed.toISOString().split('T')[0];
            const dayEntry = last7Days.find(d => d.date === viewDate);
            if (dayEntry) {
              // Assume 30 mins (0.5 hrs) per lecture
              dayEntry.hours += 0.5;
            }
          }
        });
      }
    });

    res.status(200).json({
      success: true,
      data: last7Days.map(d => ({ day: d.day, hours: d.hours }))
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const QuizResult = require("../../models/QuizResult");

const getStudentStats = async (req, res) => {
  try {
    const { studentId } = req.params;

    // 1. Calculate Streak
    //    Get unique dates from all lecture views
    const allProgress = await CourseProgress.find({ userId: studentId });
    const uniqueDates = new Set();
    allProgress.forEach(cp => {
      cp.lecturesProgress?.forEach(lp => {
        if (lp.viewed && lp.dateViewed) {
          uniqueDates.add(lp.dateViewed.toISOString().split('T')[0]);
        }
      });
    });

    // Sort dates descending
    const sortedDates = Array.from(uniqueDates).sort().reverse();
    let streaks = 0;
    let currentDate = new Date();
    // Check if activity exists today or yesterday to proceed
    // (Simple logic: just count backwards from latest activity)

    // If we have dates, let's count consecutive days
    if (sortedDates.length > 0) {
      // Start from the most recent date in history
      // If the gap between dates is > 1 day, streak breaks
      streaks = 1;
      for (let i = 0; i < sortedDates.length - 1; i++) {
        const d1 = new Date(sortedDates[i]);
        const d2 = new Date(sortedDates[i + 1]);
        const diffTime = Math.abs(d1 - d2);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          streaks++;
        } else {
          break;
        }
      }
    }

    // 2. Quiz Achievements
    const pastQuizzes = await QuizResult.find({ userId: studentId, status: "pass" });
    const passedCount = pastQuizzes.length;

    // 3. Course Achievements
    const completedCoursesCount = allProgress.filter(p => p.completed).length;

    const achievements = [];
    if (streaks >= 3) {
      achievements.push({ title: `${streaks} Day Streak`, icon: "Zap", color: "text-yellow-500", bg: "bg-yellow-50" });
    }
    if (passedCount >= 1) {
      achievements.push({ title: "Quiz Master", icon: "Trophy", color: "text-purple-500", bg: "bg-purple-50" });
    }
    if (completedCoursesCount >= 1) {
      achievements.push({ title: "Fast Learner", icon: "Target", color: "text-blue-500", bg: "bg-blue-50" });
    }

    // Fallback if empty
    if (achievements.length === 0) {
      achievements.push({ title: "Just Started", icon: "Star", color: "text-gray-500", bg: "bg-gray-50" });
    }

    // 4. Upcoming Exam (Mocked from Backend for now)
    const upcomingExam = {
      title: "Loksewa Officer Exam",
      date: "2025-01-15",
      daysLeft: 24
    };

    res.status(200).json({
      success: true,
      data: {
        achievements,
        upcomingExam
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};


module.exports = { getCoursesByStudentId, enrollStudentInCourse, getStudentWeeklyActivity, getStudentStats };
