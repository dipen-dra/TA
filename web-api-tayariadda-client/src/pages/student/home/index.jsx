import { useContext, useEffect, useState } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentBoughtCoursesService,
  fetchStudentViewCourseListService,
  fetchStudentWeeklyActivityService,
  fetchStudentStatsService
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock, Award, TrendingUp, BookOpen, ArrowRight, Calendar, Zap, Trophy, Target, Star } from "lucide-react";

// Icon mapping for dynamic backend response
const iconMap = {
  Zap: Zap,
  Trophy: Trophy,
  Target: Target,
  Star: Star,
  Award: Award
};

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList, studentBoughtCoursesList, setStudentBoughtCoursesList } = useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [studentStats, setStudentStats] = useState({
    achievements: [],
    upcomingExam: null
  });
  const navigate = useNavigate();

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  async function fetchStudentBoughtCourses() {
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
    if (response?.success) setStudentBoughtCoursesList(response?.data);
  }

  async function fetchWeeklyActivity() {
    const response = await fetchStudentWeeklyActivityService(auth?.user?._id);
    if (response?.success) setWeeklyActivity(response?.data);
  }

  async function fetchStats() {
    const response = await fetchStudentStatsService(auth?.user?._id);
    if (response?.success) setStudentStats(response?.data);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/student/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/student/course/details/${getCurrentCourseId}`);
      }
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
    fetchStudentBoughtCourses();
    fetchWeeklyActivity();
    fetchStats();
  }, []);

  // --- Derived Data & Mock Data ---
  const lastActiveCourse = studentBoughtCoursesList?.find(course => course.progress < 100)
    || (studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? studentBoughtCoursesList[0] : null);
  const featuredCourse = studentViewCoursesList && studentViewCoursesList.length > 0 ? studentViewCoursesList[0] : null;
  const heroCourse = lastActiveCourse || featuredCourse;
  const isContinueLearning = !!lastActiveCourse;

  const activityData = weeklyActivity.length > 0 ? weeklyActivity : [
    { day: "Mon", hours: 0 },
    { day: "Tue", hours: 0 },
    { day: "Wed", hours: 0 },
    { day: "Thu", hours: 0 },
    { day: "Fri", hours: 0 },
    { day: "Sat", hours: 0 },
    { day: "Sun", hours: 0 },
  ];
  const maxHours = Math.max(...activityData.map(d => d.hours));

  const upcomingExam = studentStats.upcomingExam || {
    title: "No Upcoming Exam",
    date: "",
    daysLeft: 0
  };

  const achievements = studentStats.achievements || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* 1. Welcome Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm/50 backdrop-blur-md bg-white/80">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Welcome back, <span className="text-blue-600">{auth?.user?.fName || auth?.user?.userName || "Student"}</span>! 👋
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                {/* Goal 1: Lessons */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex items-center gap-3 min-w-[240px]">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-700">Daily Lessons</span>
                      <span className="text-blue-600">
                        {Math.floor((activityData.find(d => d.day === new Date().toLocaleDateString('en-US', { weekday: 'short' }))?.hours || 0) / 0.5)}/2
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(((activityData.find(d => d.day === new Date().toLocaleDateString('en-US', { weekday: 'short' }))?.hours || 0) / 0.5 / 2) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Goal 2: Quiz */}
                <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-3 flex items-center gap-3 min-w-[240px]">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-700">Daily Quiz</span>
                      <span className="text-purple-600">0/1</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full transition-all duration-500"
                        style={{ width: "0%" }} // Placeholder: Backend support needed for 'Quiz Taken Today'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate('/student/quiz')} className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/20 transition-all">
                Daily Quiz Challenge
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN (Main Content) */}
          <div className="lg:col-span-2 space-y-10">

            {/* 2. Continue Learning Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:blur-2xl transition-all duration-700"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 opacity-10 rounded-full -ml-10 -mb-10 blur-3xl"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-white/10">
                    {isContinueLearning ? "Continue Learning" : "Featured Course"}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-end">
                  <div className="flex-1 space-y-4">
                    <h2 className="text-3xl font-bold leading-tight">
                      {heroCourse ? heroCourse.title : "Start your learning journey today!"}
                    </h2>
                    <p className="text-blue-100 opacity-90">
                      {isContinueLearning
                        ? "You're making great progress. Jump back in where you left off."
                        : "Explore our catalog of premium courses designed for success."}
                    </p>

                    {isContinueLearning && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-blue-100">
                          <span>Progress</span>
                          <span>{heroCourse?.progress !== undefined ? Math.round(heroCourse?.progress) : 0}%</span>
                        </div>
                        <div className="w-full bg-blue-900/30 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-300 h-full rounded-full shadow-[0_0_15px_rgba(147,197,253,0.6)]"
                            style={{ width: `${heroCourse?.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => heroCourse ? handleCourseNavigate(heroCourse.courseId || heroCourse._id) : navigate('/student/courses')}
                    className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 h-auto text-lg rounded-xl font-bold shadow-xl transition-all transform hover:scale-105 hover:rotate-1 whitespace-nowrap"
                  >
                    {isContinueLearning ? (
                      <span className="flex items-center gap-2"><PlayCircle className="w-5 h-5 fill-current" /> Resume</span>
                    ) : "Get Started"}
                  </Button>
                </div>
              </div>
            </div>

            {/* 3. Recommended Courses */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
                  <p className="text-gray-500">Handpicked courses based on your interests</p>
                </div>
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 font-medium p-0 hover:bg-transparent" onClick={() => navigate('/student/courses')}>
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                  studentViewCoursesList.slice(0, 4).map((course) => (
                    <div
                      key={course._id}
                      onClick={() => handleCourseNavigate(course._id)}
                      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer flex flex-col h-full"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-blue-600 shadow-sm border border-gray-100">
                          Rs. {course.pricing}
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                            {course.instructorName.charAt(0)}
                          </div>
                          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{course.instructorName}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                          {course.title}
                        </h3>
                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-4 text-xs text-gray-500 font-medium">
                          <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-gray-400" /> 12 Lessons</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-400" /> 6h 30m</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-12 text-center bg-gray-50 rounded-2xl border-dashed border-2 border-gray-200">
                    <p className="text-gray-500">No courses available right now.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <div className="space-y-8">

            {/* 4. Weekly Activity Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Weekly Activity
                </h3>
                <span className="text-xs text-gray-400 font-medium">Last 7 Days</span>
              </div>

              <div className="space-y-2">
                {/* Chart Area */}
                <div className="h-40 flex items-end justify-between gap-2">
                  {activityData.map((data, index) => {
                    const heightPercentage = Math.max((data.hours / maxHours) * 100, 5);
                    const isToday = data.day === new Date().toLocaleDateString('en-US', { weekday: 'short' });
                    return (
                      <div key={index} className="w-full h-full flex items-end justify-center group relative cursor-pointer">
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                          {data.hours} hrs
                        </div>
                        {/* Bar */}
                        <div
                          className={`w-full max-w-[24px] rounded-t-lg transition-all duration-500 ${isToday ? 'bg-blue-600' : 'bg-blue-100 group-hover:bg-blue-300'}`}
                          style={{ height: `${heightPercentage}%` }}
                        ></div>
                      </div>
                    );
                  })}
                </div>

                {/* Labels Area */}
                <div className="flex justify-between gap-2 border-t border-gray-50 pt-2">
                  {activityData.map((data, index) => {
                    const isToday = data.day === new Date().toLocaleDateString('en-US', { weekday: 'short' });
                    return (
                      <div key={index} className="w-full flex justify-center">
                        <span className={`text-[10px] font-semibold ${isToday ? 'text-blue-600' : 'text-gray-400'}`}>
                          {data.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 5. Exam Countdown */}
            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 p-6 rounded-2xl shadow-lg run border border-indigo-700/50 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-xl"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 opacity-80">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Upcoming Exam</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{upcomingExam.title}</h3>
                <p className="text-indigo-200 text-sm mb-6">{upcomingExam.date}</p>

                <div className="flex gap-3">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 flex-1 text-center">
                    <span className="block text-2xl font-bold">{upcomingExam.daysLeft}</span>
                    <span className="text-[10px] text-indigo-200 uppercase tracking-wider">Days</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 flex-1 text-center">
                    <span className="block text-2xl font-bold">14</span>
                    <span className="text-[10px] text-indigo-200 uppercase tracking-wider">Hours</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 flex-1 text-center">
                    <span className="block text-2xl font-bold">32</span>
                    <span className="text-[10px] text-indigo-200 uppercase tracking-wider">Mins</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Recent Achievements */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Achievements
                </h3>
              </div>
              <div className="space-y-4">
                {achievements.map((item, index) => {
                  const IconComponent = iconMap[item.icon] || Award; // Fallback icon
                  return (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center ${item.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-500">Earned recently</p>
                      </div>
                    </div>
                  );
                })}

                <Button variant="outline" className="w-full text-xs h-9 mt-2">
                  View All Badges
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentHomePage;
