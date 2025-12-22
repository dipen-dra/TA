import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, Save, UploadCloud, ChevronRight, Check } from "lucide-react";
import { motion } from "framer-motion";

function AddNewCoursePage() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();
  const [activeTab, setActiveTab] = useState("course-landing-page");

  function isEmpty(value) {
    return Array.isArray(value)
      ? value.length === 0
      : value === "" || value === null || value === undefined;
  }

  function validateFormData() {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) return false;
    }

    let hasFreePreview = false;
    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      )
        return false;
      if (item.freePreview) hasFreePreview = true;
    }

    return hasFreePreview;
  }

  async function handleCreateCourse() {
    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      curriculum: courseCurriculumFormData,
      isPublished: true,
    };

    // Only initialize students array for new courses so we don't overwrite existing students on update
    if (currentEditedCourseId === null) {
      courseFinalFormData.students = [];
    }

    const response =
      currentEditedCourseId !== null
        ? await updateCourseByIdService(
          currentEditedCourseId,
          courseFinalFormData
        )
        : await addNewCourseService(courseFinalFormData);

    if (response?.success) {
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
      toast.success("Course published successfully! 🚀", {
        position: "top-right",
      });

      setTimeout(() => {
        navigate(-1);
        setCurrentEditedCourseId(null);
      }, 2000);

      setCurrentEditedCourseId(null);
    }
  }

  async function fetchCurrentCourseDetails() {
    const response = await fetchInstructorCourseDetailsService(
      currentEditedCourseId
    );

    if (response?.success) {
      const setCourseFormData = Object.keys(
        courseLandingInitialFormData
      ).reduce((acc, key) => {
        acc[key] = response?.data[key] || courseLandingInitialFormData[key];
        return acc;
      }, {});

      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(response?.data?.curriculum);
    }
  }

  useEffect(() => {
    if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
  }, [currentEditedCourseId]);

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
  }, [params?.courseId]);

  const steps = [
    {
      value: "course-landing-page",
      label: "Course Details",
      icon: 1
    },
    {
      value: "curriculum",
      label: "Curriculum",
      icon: 2
    },
    {
      value: "settings",
      label: "Settings",
      icon: 3
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
      <ToastContainer />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {currentEditedCourseId ? "Edit Course" : "Create New Course"}
              </h1>
              <p className="text-sm text-gray-500 hidden md:block">
                {currentEditedCourseId ? "Update your course content" : "Fill in the details to publish your course"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex border-gray-300 text-gray-700 hover:bg-gray-50">
              Save Draft
            </Button>
            <Button
              disabled={!validateFormData()}
              className="bg-black hover:bg-gray-900 text-white shadow-lg shadow-gray-200 px-6 font-semibold"
              onClick={handleCreateCourse}
            >
              <UploadCloud className="w-4 h-4 mr-2" />
              {currentEditedCourseId ? "Update Course" : "Publish Course"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Custom Tab Navigation */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
          {steps.map((step, index) => {
            const isActive = activeTab === step.value;
            const isCompleted = steps.indexOf(steps.find(s => s.value === activeTab)) > index;

            return (
              <button
                key={step.value}
                onClick={() => setActiveTab(step.value)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all border-2 bg-white ${isActive
                  ? "border-blue-600 text-blue-600 shadow-md transform scale-105"
                  : isCompleted
                    ? "border-green-500 text-green-600"
                    : "border-gray-200 text-gray-400 hover:border-gray-300"
                  }`}
              >
                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${isActive ? "bg-blue-600 text-white" : isCompleted ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                  {isCompleted ? <Check className="w-3 h-3" /> : step.icon}
                </span>
                <span className="font-semibold text-sm">{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white border-none shadow-xl rounded-2xl overflow-hidden min-h-[500px]">
            <CardContent className="p-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="course-landing-page" className="mt-0 focus:outline-none">
                  <CourseLanding />
                </TabsContent>
                <TabsContent value="curriculum" className="mt-0 focus:outline-none">
                  <CourseCurriculum />
                </TabsContent>
                <TabsContent value="settings" className="mt-0 focus:outline-none">
                  <CourseSettings />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default AddNewCoursePage;
