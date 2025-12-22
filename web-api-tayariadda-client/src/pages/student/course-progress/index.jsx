import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import { Check, ChevronLeft, ChevronRight, Play, RotateCcw, Menu, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";
import { courseAssetMap } from "@/config/course-assets";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const { id } = useParams();

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);

          return;
        }

        if (response?.data?.progress?.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        } else {
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1
          );

          setCurrentLecture(
            response?.data?.courseDetails?.curriculum[
            lastIndexOfViewedAsTrue + 1
            ]
          );
        }
      }
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id
      );

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    }
  }

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );

    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 15000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Calculate Progress Percentage for Sidebar
  const totalLectures = studentCurrentCourseProgress?.courseDetails?.curriculum?.length || 0;
  const completedLectures = studentCurrentCourseProgress?.progress?.filter(p => p.viewed).length || 0;
  const progressPercentage = totalLectures === 0 ? 0 : Math.round((completedLectures / totalLectures) * 100);

  // Helper to get valid video URL (ignoring sample/placeholder videos)
  const currentVideoUrl = currentLecture?.videoUrl?.includes("sample-videos.com")
    ? courseAssetMap[studentCurrentCourseProgress?.courseDetails?.title]?.videoUrl
    : (currentLecture?.videoUrl || courseAssetMap[studentCurrentCourseProgress?.courseDetails?.title]?.videoUrl);

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student/student-courses")}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to My Courses
          </Button>
          <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
          <h1 className="text-lg font-bold text-gray-800 hidden md:block truncate max-w-xl">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden" // Only show toggle on mobile/tablet if needed, or keeping it for sidebar toggle logic
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
        >
          {isSideBarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Content (Video) */}
        <div className={`flex-1 transition-all duration-300 ease-in-out flex flex-col ${isSideBarOpen ? "pr-[380px]" : ""}`}>
          <ScrollArea className="flex-1 w-full bg-gray-100">
            <div className="max-w-5xl mx-auto p-4 md:p-8">
              {/* Video Player Container */}
              <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video w-full mb-6 relative">
                <VideoPlayer
                  width="100%"
                  height="100%"
                  url={currentVideoUrl}
                  onProgressUpdate={setCurrentLecture}
                  progressData={currentLecture}
                />
              </div>

              {/* Lecture Details and Navigation */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{currentLecture?.title}</h2>
                  {/* Placeholder for Next/Prev buttons if needed here, or can be below */}
                </div>

                {/* Description Area (if needed, or just leave scalable space) */}
                <div className="prose prose-blue max-w-none text-gray-600">
                  <p>Watch the video fully to mark this lecture as completed.</p>
                </div>


              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed top-[73px] right-0 bottom-0 w-[380px] bg-white border-l border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out z-20 ${isSideBarOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex flex-col h-full">
            {/* Progress Section */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Course Progress</span>
                <span className="text-sm font-bold text-blue-600">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="w-full justify-start rounded-none border-b border-gray-200 bg-white p-0 h-12">
                <TabsTrigger
                  value="content"
                  className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 text-gray-500 font-medium"
                >
                  Curriculum
                </TabsTrigger>
                <TabsTrigger
                  value="overview"
                  className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 text-gray-500 font-medium"
                >
                  Overview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="flex-1 overflow-hidden p-0 m-0">
                <ScrollArea className="h-full">
                  <div className="divide-y divide-gray-100">
                    {studentCurrentCourseProgress?.courseDetails?.curriculum.map((item, index) => {
                      const isViewed = studentCurrentCourseProgress?.progress?.find(p => p.lectureId === item._id)?.viewed;
                      const isActive = currentLecture?._id === item._id;

                      return (
                        <div
                          key={item._id}
                          onClick={() => setCurrentLecture(item)}
                          className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-start gap-3 ${isActive ? "bg-blue-50 border-l-4 border-blue-600" : "border-l-4 border-transparent"
                            }`}
                        >
                          <div className={`mt-0.5 rounded-full p-1 ${isViewed ? "bg-green-100 text-green-600" :
                            isActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                            }`}>
                            {isViewed ? <Check className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          </div>
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${isActive ? "text-blue-900" : "text-gray-700"}`}>
                              {index + 1}. {item.title}
                            </h4>
                            <span className="text-xs text-gray-400 mt-1 block">Video Lecture</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="overview" className="flex-1 overflow-auto p-6 m-0">
                <h3 className="text-lg font-bold text-gray-900 mb-3">About this course</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {studentCurrentCourseProgress?.courseDetails?.description}
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Floating Sidebar Toggle (Desktop) */}
        {!isSideBarOpen && (
          <Button
            onClick={() => setIsSideBarOpen(true)}
            className="absolute top-4 right-4 z-30 shadow-lg bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-full w-10 h-10 p-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        {isSideBarOpen && (
          <Button
            onClick={() => setIsSideBarOpen(false)}
            className="absolute top-[85px] right-[390px] z-30 shadow-md bg-white text-gray-500 hover:text-gray-800 border border-gray-200 rounded-full w-8 h-8 p-0 hidden lg:flex"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}

      </div>

      {/* Locked Course Dialog */}
      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-500 flex items-center gap-2">
              <span className="text-2xl">🔒</span> Access Denied
            </DialogTitle>
            <DialogDescription className="pt-4 text-gray-600">
              Please purchase this course to unlock all lectures and materials.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Course Completion Dialog */}
      <Dialog open={showCourseCompleteDialog}>
        <DialogContent
          className="sm:w-[425px] bg-white border border-gray-100 shadow-2xl rounded-2xl"
        >
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              Course Completed!
            </DialogTitle>
            <DialogDescription className="text-gray-500 mb-6">
              Congratulations on finishing the course. You've mastered new skills!
            </DialogDescription>
            <div className="flex flex-col gap-3 w-full">
              <Button
                onClick={() => navigate("/student/student-courses")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 font-semibold"
              >
                Back to My Courses
              </Button>
              <Button
                onClick={handleRewatchCourse}
                variant="outline"
                className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl py-6 font-semibold"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Rewatch Course
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;
