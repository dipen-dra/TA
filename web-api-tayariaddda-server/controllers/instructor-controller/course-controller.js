const Course = require("../../models/Course");
const User = require("../../models/User"); // Make sure to import the User model
const Order = require("../../models/Order");

const addNewCourse = async (req, res) => {
  try {
    const courseData = req.body;

    // Find the instructor using the provided instructorId
    const instructor = await User.findById(courseData.instructorId);
    if (instructor) {
      // Set the instructorName to the user's fName
      courseData.instructorName = instructor.fName;
    } else {
      // Optionally handle the case where the instructor is not found
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    const newlyCreatedCourse = new Course(courseData);
    const savedCourse = await newlyCreatedCourse.save();

    res.status(201).json({
      success: true,
      message: "Course saved successfully",
      data: savedCourse,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};
const getAllCourses = async (req, res) => {
  try {
    const coursesList = await Course.find({});

    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};


const updateCourseByID = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourseData = req.body;

    // If an instructorId is provided, update the instructorName
    if (updatedCourseData.instructorId) {
      const instructor = await User.findById(updatedCourseData.instructorId);
      if (instructor) {
        updatedCourseData.instructorName = instructor.fName;
      } else {
        return res.status(404).json({
          success: false,
          message: "Instructor not found",
        });
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updatedCourseData,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getCourseDetailsByID = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const deleteCourseByID = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: deletedCourse,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getInstructorDashboardAnalytics = async (req, res) => {
  try {
    const instructorId = req.params.instructorId;

    // 0. Total Courses
    const totalCourses = await Course.countDocuments({ instructorId });

    // 1. Total Stats (All time)
    const totalStats = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $toDouble: "$coursePricing" } },
          uniqueStudents: { $addToSet: "$userId" }, // Collect unique user IDs
          totalOrders: { $sum: 1 }
        },
      },
      {
        $project: {
          totalRevenue: 1,
          totalStudents: { $size: "$uniqueStudents" }, // Count unique students
          totalOrders: 1
        }
      }
    ]);

    // 2. Trend Calculations (This Month vs Last Month)
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12

    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthYear = lastMonthDate.getFullYear();
    const lastMonth = lastMonthDate.getMonth() + 1;

    const currentMonthStats = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          $expr: {
            $and: [
              { $eq: [{ $year: "$orderDate" }, currentYear] },
              { $eq: [{ $month: "$orderDate" }, currentMonth] }
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: { $toDouble: "$coursePricing" } },
          students: { $addToSet: "$userId" }
        }
      }
    ]);

    const lastMonthStats = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          $expr: {
            $and: [
              { $eq: [{ $year: "$orderDate" }, lastMonthYear] },
              { $eq: [{ $month: "$orderDate" }, lastMonth] }
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: { $toDouble: "$coursePricing" } },
          students: { $addToSet: "$userId" }
        }
      }
    ]);

    const curRevenue = currentMonthStats[0]?.revenue || 0;
    const lastRevenue = lastMonthStats[0]?.revenue || 0;
    const curStudents = currentMonthStats[0]?.students?.length || 0;
    const lastStudents = lastMonthStats[0]?.students?.length || 0;

    const revenueGrowth = lastRevenue === 0 ? 100 : ((curRevenue - lastRevenue) / lastRevenue) * 100;
    const studentGrowth = lastStudents === 0 ? 100 : ((curStudents - lastStudents) / lastStudents) * 100;

    // Course Growth Calculation
    const currentMonthCourses = await Course.countDocuments({
      instructorId,
      date: {
        $gte: new Date(currentYear, currentMonth - 1, 1),
        $lt: new Date(currentYear, currentMonth, 1)
      }
    });

    const lastMonthCourses = await Course.countDocuments({
      instructorId,
      date: {
        $gte: new Date(lastMonthYear, lastMonth - 1, 1),
        $lt: new Date(lastMonthYear, lastMonth, 1)
      }
    });

    const courseGrowth = lastMonthCourses === 0 ? (currentMonthCourses > 0 ? 100 : 0) : ((currentMonthCourses - lastMonthCourses) / lastMonthCourses) * 100;


    // 3. Monthly Revenue Aggregation (Historical for Chart)
    const monthlyRevenueStats = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" },
          },
          revenue: { $sum: { $toDouble: "$coursePricing" } },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Format Monthly Data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedMonthlyRevenue = new Array(12).fill(0).map((_, index) => ({
      name: months[index],
      revenue: 0,
    }));

    monthlyRevenueStats.forEach(stat => {
      if (stat._id.month >= 1 && stat._id.month <= 12) {
        formattedMonthlyRevenue[stat._id.month - 1].revenue = stat.revenue;
      }
    });

    // 4. Course Distribution Stats (Unique Students per Course)
    const courseDistributionStats = await Order.aggregate([
      {
        $match: { paymentStatus: 'paid' }
      },
      {
        $group: {
          _id: "$courseTitle",
          uniqueStudents: { $addToSet: "$userId" } // Collect unique users per course
        }
      },
      {
        $project: {
          name: "$_id",
          students: { $size: "$uniqueStudents" }, // Count them
          _id: 0
        }
      }
    ]);

    // 5. Recent Enrollments (Deduplicated with User Image)
    const recentEnrollments = await Order.aggregate([
      {
        $match: { paymentStatus: "paid" }
      },
      {
        $sort: { orderDate: -1 }
      },
      {
        $group: {
          _id: { email: "$email", courseTitle: "$courseTitle" }, // Group by User+Course
          fName: { $first: "$fName" },
          courseTitle: { $first: "$courseTitle" },
          email: { $first: "$email" },
          orderDate: { $first: "$orderDate" },
          userId: { $first: "$userId" } // Keep userId for lookup
        }
      },
      {
        $lookup: {
          from: "users",
          let: { user_id: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$user_id" }] // Convert string ID to ObjectId for match
                }
              }
            },
            { $project: { image: 1 } }
          ],
          as: "userDetails"
        }
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true // Keep order even if user deleted
        }
      },
      {
        $sort: { orderDate: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const studentList = recentEnrollments.map(order => ({
      studentName: order.fName,
      studentEmail: order.email,
      studentImage: order.userDetails?.image || null, // Include image
      courseTitle: order.courseTitle,
      date: order.orderDate
    }));

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: totalStats[0]?.totalRevenue || 0,
        totalStudents: totalStats[0]?.totalStudents || 0, // Now uses unique count
        totalCourses, // Added totalCourses
        revenueGrowth: Math.round(revenueGrowth),
        studentGrowth: Math.round(studentGrowth),
        courseGrowth: Math.round(courseGrowth),
        monthlyRevenue: formattedMonthlyRevenue,
        studentList,
        courseDistribution: courseDistributionStats
      },
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  addNewCourse,
  getAllCourses,
  updateCourseByID,
  getCourseDetailsByID,
  deleteCourseByID,
  getInstructorDashboardAnalytics,
};
