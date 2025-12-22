import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Edit, Trash2, Users, DollarSign, PlusCircle, BookOpen, AlertTriangle } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

function InstructorCourses({ listOfCourses, setListOfCourses }) {
  const navigate = useNavigate();
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);

  // Handle delete course
  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/instructor/course/delete/${courseId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Course deleted successfully!");
        // Optimistically update list or reload
        // Better to update state if possible to avoid reload, but reload ensures clean state
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(result.message || "Failed to delete course.");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Courses</h2>
          <p className="text-gray-500 mt-1">Manage and update your curriculum</p>
        </div>
        <Button
          onClick={() => {
            setCurrentEditedCourseId(null);
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate("/instructor/create-new-course");
          }}
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-6 shadow-blue-200 shadow-xl transition-all hover:scale-105 flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Create New Course
        </Button>
      </div>

      {listOfCourses && listOfCourses.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {listOfCourses.map((course) => (
            <motion.div variants={item} key={course._id}>
              <Card className="group h-full flex flex-col border-none shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden bg-white">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course?.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"}
                    alt={course?.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white text-sm font-medium bg-blue-600 px-3 py-1 rounded-full">
                      {course?.category || "General"}
                    </span>
                  </div>
                </div>

                <CardContent className="flex-1 p-5">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {course?.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span>{course?.students?.length} Students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span>Rs. {course?.pricing}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 bg-gray-50/50 border-t border-gray-100 flex gap-3">
                  <Button
                    onClick={() => navigate(`/instructor/edit-course/${course?._id}`)}
                    variant="outline"
                    className="flex-1 bg-white hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200 transition-colors border-gray-200"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors border-gray-200"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="w-5 h-5" />
                          Are you sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the course "{course?.title}" and remove all associated data. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCourse(course._id)} className="bg-red-600 hover:bg-red-700 text-white">
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 text-center bg-white border-2 border-dashed border-gray-200 rounded-2xl">
          <div className="bg-blue-50 p-4 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Courses Yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm">
            It looks like you haven't created any courses yet. Start sharing your knowledge today!
          </p>
          <Button
            onClick={() => {
              setCurrentEditedCourseId(null);
              setCourseLandingFormData(courseLandingInitialFormData);
              setCourseCurriculumFormData(courseCurriculumInitialFormData);
              navigate("/instructor/create-new-course");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-3 shadow-lg"
          >
            Create Your First Course
          </Button>
        </Card>
      )}
    </div>
  );
}

export default InstructorCourses;
