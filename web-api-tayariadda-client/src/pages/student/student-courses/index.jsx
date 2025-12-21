import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import { Watch, PlayCircle, BarChart } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { courseAssetMap } from "@/config/course-assets";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Seed data for demonstration
  const seedCourses = [
    {
      id: "1",
      courseId: "seed-1",
      title: "Complete Web Development Bootcamp",
      instructorName: "Dr. Rajesh Kumar",
      courseImage: "/banner-img.png",
      progress: 75,
    },
    {
      id: "2",
      courseId: "seed-2",
      title: "Data Science with Python",
      instructorName: "Nepal Medical Institute",
      courseImage: "/banner-img.png",
      progress: 45,
    },
    {
      id: "3",
      courseId: "seed-3",
      title: "UI/UX Design Masterclass",
      instructorName: "Edusoft Academy",
      courseImage: "/banner-img.png",
      progress: 20,
    },
    {
      id: "4",
      courseId: "seed-4",
      title: "Mobile App Development with React Native",
      instructorName: "Professional Training Center",
      courseImage: "/banner-img.png",
      progress: 90,
    },
  ];

  async function fetchStudentBoughtCourses() {
    try {
      const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
      if (response?.success && response?.data?.length > 0) {
        setStudentBoughtCoursesList(response?.data.map(course => ({
          ...course,
          progress: course.progress || Math.floor(Math.random() * 100) // Mock progress if missing
        })));
      } else {
        // Use seed data if no courses found
        setStudentBoughtCoursesList(seedCourses);
      }
    } catch (error) {
      console.error(error);
      setStudentBoughtCoursesList(seedCourses);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            My Learning
          </h1>
          <p className="text-blue-100 text-base max-w-2xl">
            Track your progress, pick up where you left off, and master new skills.
          </p>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentBoughtCoursesList.map((course) => {
              // Resolve visuals from map or fallback
              const customAssets = courseAssetMap[course.title];
              const displayImage = customAssets?.heroImage || course.courseImage;

              return (
                <Card
                  key={course.id}
                  className="flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border-0 bg-white group"
                >
                  <CardContent className="p-0 flex-grow relative">
                    {/* Course Image */}
                    <div className="relative w-full h-52 overflow-hidden bg-gray-200">
                      <img
                        src={displayImage}
                        alt={course?.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1 line-clamp-2 leading-tight">
                          {course?.title}
                        </h3>
                        <p className="text-sm text-gray-300 line-clamp-1">
                          {course?.instructorName}
                        </p>
                      </div>

                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white border border-white/30">
                        <PlayCircle className="w-5 h-5 fill-white" />
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Progress Bar */}
                      <div className="w-full mb-4">
                        <div className="flex justify-between text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
                          <span className="flex items-center gap-1"><BarChart className="w-3 h-3" /> Progress</span>
                          <span className={course.progress >= 100 ? "text-green-600" : "text-blue-600"}>{course.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${course.progress >= 100 ? "bg-green-500" : "bg-blue-600"
                              }`}
                            style={{ width: `${course.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  {/* Footer with Start Watching Button */}
                  <CardFooter className="p-6 pt-0 bg-white border-none">
                    <Button
                      onClick={() =>
                        navigate(`/student/course-progress/${course?.courseId}`)
                      }
                      className="w-full flex items-center justify-center bg-gray-900 text-white hover:bg-blue-600 hover:text-white transition-colors duration-300 py-6 rounded-xl text-md font-semibold shadow-lg hover:shadow-blue-200"
                    >
                      <Watch className="mr-2 h-5 w-5" />
                      {course.progress > 0 ? "Continue Learning" : "Start Course"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 text-center p-8">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Watch className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Courses Enrolled
            </h2>
            <p className="text-gray-500 mb-8 max-w-md">
              You haven't purchased any courses yet. Explore our catalog to find your next skill.
            </p>
            <Button
              onClick={() => navigate("/courses")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg shadow-xl shadow-blue-200"
            >
              Browse Courses
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentCoursesPage;
