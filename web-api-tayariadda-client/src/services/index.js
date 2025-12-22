import axiosInstance from "@/api/axiosInstance";

export async function registerService(formData) {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });

  return data;
}

export async function loginService(formData) {
  const { data } = await axiosInstance.post("/auth/login", formData);

  return data;
}

export async function checkAuthService() {
  const { data } = await axiosInstance.get("/auth/check-auth");

  return data;
}

export async function forgotPasswordService(email) {
  const { data } = await axiosInstance.post("/auth/forgot-password", { email });
  return data;
}

export async function verifyOtpService(email, otp) {
  const { data } = await axiosInstance.post("/auth/verify-otp", { email, otp });
  return data;
}

export async function resetPasswordService(email, otp, newPassword) {
  const { data } = await axiosInstance.post("/auth/reset-password", {
    email,
    otp,
    newPassword,
  });
  return data;
}

export async function mediaUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

export async function mediaDeleteService(id) {
  const { data } = await axiosInstance.delete(`/media/delete/${id}`);

  return data;
}

export async function fetchInstructorCourseListService() {
  const { data } = await axiosInstance.get(`/instructor/course/get`);

  return data;
}

export async function fetchInstructorDashboardAnalyticsService(instructorId) {
  const { data } = await axiosInstance.get(
    `/instructor/course/get-instructor-dashboard-analytics/${instructorId}`
  );

  return data;
}

export async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post(`/instructor/course/add`, formData);

  return data;
}

export async function fetchInstructorCourseDetailsService(id) {
  const { data } = await axiosInstance.get(
    `/instructor/course/get/details/${id}`
  );

  return data;
}

export async function updateCourseByIdService(id, formData) {
  const { data } = await axiosInstance.put(
    `/instructor/course/update/${id}`,
    formData
  );

  return data;
}

export async function mediaBulkUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

export async function fetchStudentViewCourseListService(query) {
  const { data } = await axiosInstance.get(`/student/course/get?${query}`);

  return data;
}

export async function fetchStudentViewCourseDetailsService(courseId) {
  const { data } = await axiosInstance.get(
    `/student/course/get/details/${courseId}`
  );

  return data;
}

export async function checkCoursePurchaseInfoService(courseId, studentId) {
  const { data } = await axiosInstance.get(
    `/student/course/purchase-info/${courseId}/${studentId}`
  );

  return data;
}

export async function createPaymentService(formData) {
  const { data } = await axiosInstance.post(`/student/order/create`, formData);

  return data;
}

export async function captureAndFinalizePaymentService(
  paymentId,
  payerId,
  orderId
) {
  const { data } = await axiosInstance.post(`/student/order/capture`, {
    paymentId,
    payerId,
    orderId,
  });

  return data;
}

export async function fetchStudentBoughtCoursesService(studentId) {
  const { data } = await axiosInstance.get(
    `/student/courses-bought/get/${studentId}`
  );

  return data;
}

export async function getCurrentCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.get(
    `/student/course-progress/get/${userId}/${courseId}`
  );

  return data;
}

export async function markLectureAsViewedService(userId, courseId, lectureId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/mark-lecture-viewed`,
    {
      userId,
      courseId,
      lectureId,
    }
  );

  return data;
}

export async function resetCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/reset-progress`,
    {
      userId,
      courseId,
    }
  );

  return data;
}

export async function updateUserProfileService(formData) {
  const { data } = await axiosInstance.put("/auth/update", formData);

  return data;
}

export async function fetchStudentQuizResultsService(userId) {
  const { data } = await axiosInstance.get(`/student/quiz/results/${userId}`);

  return data;
}

export async function fetchStudentWeeklyActivityService(userId) {
  const { data } = await axiosInstance.get(`/student/courses-bought/activity/${userId}`);

  return data;
}

export async function fetchStudentStatsService(userId) {
  const { data } = await axiosInstance.get(`/student/courses-bought/stats/${userId}`);

  return data;
}

// Admin Quiz Management Services
export async function fetchQuizSetByIdService(id) {
  const { data } = await axiosInstance.get(`/instructor/quiz/get/${id}`);
  return data;
}

export async function updateQuizSetService(id, formData) {
  const { data } = await axiosInstance.put(`/instructor/quiz/update/${id}`, formData);
  return data;
}

export async function deleteQuizSetService(id) {
  const { data } = await axiosInstance.delete(`/instructor/quiz/delete/${id}`);
  return data;
}

export async function fetchAllQuizSetsService() {
  const { data } = await axiosInstance.get(`/instructor/quiz/`);
  return data;
}

// Student Quiz Services
export async function fetchStudentQuizByIdService(id) {
  const { data } = await axiosInstance.get(`/student/quiz/get/${id}`);
  return data;
}

