import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  createPaymentService,
  fetchStudentViewCourseDetailsService,
} from "@/services";
import { CheckCircle, Globe, Lock, PlayCircle, Users, Calendar, Award, Clock, Wallet } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

import { courseAssetMap } from "@/config/course-assets";

function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");
  const { id } = useParams();
  const location = useLocation();

  async function fetchStudentViewCourseDetails() {
    const response = await fetchStudentViewCourseDetailsService(
      currentCourseDetailsId
    );

    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }
  }

  function handleSetFreePreview(getCurrentVideoInfo) {
    // Check if we have a custom video URL for the entire course
    const currentCourseConfig = courseAssetMap[studentViewCourseDetails?.title] || {};
    const overrideVideoUrl = currentCourseConfig.videoUrl;

    if (overrideVideoUrl) {
      setDisplayCurrentVideoFreePreview(overrideVideoUrl);
    } else {
      setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
    }
  }

  async function handleCreatePayment() {
    const paymentPayload = {
      userId: auth?.user?._id,
      fName: auth?.user?.fName,
      email: auth?.user?.email,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?._id,
      coursePricing: studentViewCourseDetails?.pricing,
    };

    const response = await createPaymentService(paymentPayload);

    if (response.success) {
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(response?.data?.orderId)
      );
      setApprovalUrl(response?.data?.approveUrl);
    }
  }

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  useEffect(() => {
    if (!location.pathname.includes("course/details")) {
      setStudentViewCourseDetails(null);
      setCurrentCourseDetailsId(null);
    }
  }, [location.pathname]);

  if (loadingState) return <div className="p-10 container mx-auto"><Skeleton className="h-[400px] w-full rounded-xl" /></div>;

  if (approvalUrl !== "") {
    window.location.href = approvalUrl;
    return null;
  }

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
        (item) => item.freePreview
      )
      : -1;

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const currentCourseConfig = courseAssetMap[studentViewCourseDetails?.title] || {};
  const customHeroImage = currentCourseConfig.heroImage || null;
  const defaultVideoUrl = currentCourseConfig.videoUrl ||
    (getIndexOfFreePreviewUrl !== -1 ? studentViewCourseDetails?.curriculum[getIndexOfFreePreviewUrl].videoUrl : "");
  const customDescription = currentCourseConfig.description || studentViewCourseDetails?.description;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* 1. Hero Section */}
      <div
        className="bg-gray-900 text-white relative overflow-hidden"
        style={customHeroImage ? {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${customHeroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        {/* Abstract Background Shapes (only if no custom image) */}
        {!customHeroImage && (
          <>
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
          </>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
          <div className="max-w-4xl">
            {/* Breadcrumb / Category */}
            <div className="flex items-center gap-2 text-blue-200 text-sm font-medium mb-4 uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>{studentViewCourseDetails?.category || "Development"}</span>
              <span>•</span>
              <span>{studentViewCourseDetails?.level || "Beginner"}</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {studentViewCourseDetails?.title}
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-2xl">
              {studentViewCourseDetails?.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs shadow-sm">
                  {studentViewCourseDetails?.instructorName?.charAt(0) || "I"}
                </div>
                <span>Created by <span className="text-white hover:underline cursor-pointer">{studentViewCourseDetails?.instructorName}</span></span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Last updated {formatDate(studentViewCourseDetails?.date)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>{studentViewCourseDetails?.primaryLanguage}</span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>{studentViewCourseDetails?.students?.length || 0} enrolled</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* Left Column: Course Info */}
          <main className="lg:col-span-2 space-y-10">

            {/* What you'll learn */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll learn</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentViewCourseDetails?.objectives?.split(";").map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm leading-relaxed">{objective.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Curriculum */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
                <span className="text-sm text-gray-500 font-medium">
                  {studentViewCourseDetails?.curriculum?.length} Lessons • {
                    studentViewCourseDetails?.curriculum?.reduce((acc, item) => acc + (item.duration || 10), 0)
                  } mins total length
                </span>
              </div>

              <div className="space-y-3">
                {studentViewCourseDetails?.curriculum?.map((curriculumItem, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${curriculumItem?.freePreview
                      ? "bg-blue-50/50 border-blue-100 hover:bg-blue-50 cursor-pointer"
                      : "bg-gray-50 border-gray-100 opacity-70 cursor-not-allowed"
                      }`}
                    onClick={
                      curriculumItem?.freePreview
                        ? () => handleSetFreePreview(curriculumItem)
                        : null
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${curriculumItem?.freePreview ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-500"
                        }`}>
                        {curriculumItem?.freePreview ? <PlayCircle className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className={`font-semibold text-sm ${curriculumItem?.freePreview ? "text-gray-900" : "text-gray-600"}`}>{curriculumItem?.title}</h4>
                        <span className="text-xs text-gray-500">{curriculumItem?.duration || "10 mins"}</span>
                      </div>
                    </div>

                    {curriculumItem?.freePreview && (
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wide bg-blue-100 px-2 py-1 rounded">
                        Preview
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
              <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                {customDescription}
              </div>
            </div>

          </main>

          {/* Right Column: Sticky Sidebar (Video + Checkout) */}
          <aside className="relative">
            <div className="sticky top-24 space-y-6">

              {/* Preview Card */}
              <Card className="overflow-hidden border-0 shadow-xl rounded-2xl ring-1 ring-gray-200">
                {/* Video Header */}
                <div className="relative aspect-video bg-gray-900">
                  <VideoPlayer
                    url={
                      displayCurrentVideoFreePreview || defaultVideoUrl
                    }
                    width="100%"
                    height="100%"
                  />
                  {/* Overlay text if no video is actively playing initially or just logic */}
                </div>

                <CardContent className="p-6">
                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-end gap-3 mb-2">
                      <span className="text-4xl font-extrabold text-gray-900">Rs. {studentViewCourseDetails?.pricing}</span>
                      <span className="text-lg text-gray-400 line-through mb-1.5">Rs. {(Number(studentViewCourseDetails?.pricing) * 1.5).toFixed(0)}</span>
                    </div>
                    <span className="inline-block bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                      33% OFF • Limited time only
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {/* Khalti */}
                    <button
                      onClick={async () => {
                        const paymentPayload = {
                          userId: auth?.user?._id,
                          fName: auth?.user?.fName,
                          email: auth?.user?.email,
                          phone: "9800000001",
                          orderStatus: "pending",
                          paymentMethod: "khalti",
                          paymentStatus: "initiated",
                          orderDate: new Date().toISOString(),
                          paymentId: "",
                          payerId: "",
                          instructorId: studentViewCourseDetails?.instructorId,
                          instructorName: studentViewCourseDetails?.instructorName,
                          courseImage: studentViewCourseDetails?.image,
                          courseTitle: studentViewCourseDetails?.title,
                          courseId: studentViewCourseDetails?._id,
                          coursePricing: studentViewCourseDetails?.pricing,
                        };

                        try {
                          const response = await axios.post(
                            "http://localhost:5000/student/order/create-khalti",
                            paymentPayload
                          );
                          if (response.data.success) {
                            window.location.href = response.data.payment_url;
                          } else {
                            alert("Payment initiation failed.");
                          }
                        } catch (error) {
                          console.error(error);
                          alert("An error occurred while processing payment.");
                        }
                      }}
                      className="w-full bg-[#5D2E8E] hover:bg-[#4a2472] text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                    >
                      <Wallet className="w-6 h-6 text-white" />
                      <span className="text-white font-bold text-lg">Pay with Khalti</span>
                      <span className="sr-only">Khalti</span>
                    </button>

                    {/* PayPal */}
                    <button
                      onClick={handleCreatePayment}
                      className="w-full bg-[#003087] hover:bg-[#00256b] text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>Pay with PayPal</span>
                    </button>

                    <p className="text-xs text-center text-gray-500 mt-4">
                      30-Day Money-Back Guarantee
                    </p>
                  </div>

                  {/* Course Includes */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-4 text-sm">This course includes:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <PlayCircle className="w-4 h-4 text-gray-400" />
                        <span>{studentViewCourseDetails?.curriculum?.length} video lessons</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>Lifetime access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span>Access on mobile and TV</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-gray-400" />
                        <span>Certificate of completion</span>
                      </li>
                    </ul>
                  </div>

                </CardContent>
              </Card>

              {/* Sidebar Footer (Optional) */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
                <p className="text-sm font-semibold text-gray-900">Training 5 or more people?</p>
                <p className="text-xs text-gray-500 mt-1">Get your team access to 100+ top courses</p>
                <Button variant="outline" className="w-full mt-3 text-xs font-bold">Get Team Access</Button>
              </div>

            </div>
          </aside>

        </div>
      </div>

      {/* Video Preview Dialog */}
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }}
      >
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-gray-800">
          <DialogHeader className="sr-only">
            <DialogTitle>Video Preview</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              width="100%"
              height="100%"
            />
          </div>
          <div className="p-6 bg-gray-900 text-white">
            <h3 className="text-lg font-bold mb-2">Free Preview Lessons</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {studentViewCourseDetails?.curriculum
                ?.filter((item) => item.freePreview)
                .map((filteredItem, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSetFreePreview(filteredItem)}
                    className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${displayCurrentVideoFreePreview === filteredItem?.videoUrl ? "bg-blue-900/50 text-blue-300" : "hover:bg-gray-800 text-gray-400"
                      }`}
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{filteredItem?.title}</span>
                  </div>
                ))}
            </div>
            <div className="mt-6 flex justify-end">
              <DialogClose asChild>
                <Button variant="secondary" className="bg-gray-700 hover:bg-gray-600 text-white border-0">
                  Close Preview
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseDetailsPage;

