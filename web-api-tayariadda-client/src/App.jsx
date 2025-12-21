import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth";
import RouteGuard from "./components/route-guard";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import InstructorDashboardpage from "./pages/instructor";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import StudentHomePage from "./pages/student/home";
import NotFoundPage from "./pages/not-found";
import AddNewCoursePage from "./pages/instructor/add-new-course";
import StudentViewCoursesPage from "./pages/student/courses";
import StudentViewCourseDetailsPage from "./pages/student/course-details";
import PaypalPaymentReturnPage from "./pages/student/payment-return/paypal";
import PaymentReturnPage from "./pages/student/payment-return";
import StudentCoursesPage from "./pages/student/student-courses";
import StudentViewCourseProgressPage from "./pages/student/course-progress";
import QuizList from "./components/student-view/Quiz";
import QuizPlay from "./components/student-view/Quiz-Play";
import AdminQuizPanel from "./components/instructor-view/dashboard/admin-quiz-panel";
import LandingPage from "./pages/landing";
import ForgotPasswordPage from "./pages/forgot-password";
import StudentProfilePage from "./pages/student/profile";
function App() {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      {/* Landing Page - Default for non-authenticated users */}
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/auth"
        element={
          <RouteGuard
            element={<AuthPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      {/* Forgot Password Page */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/instructor"
        element={
          <RouteGuard
            element={<InstructorDashboardpage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/create-quiz"
        element={
          <RouteGuard
            element={<AdminQuizPanel />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/create-new-course"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/edit-course/:courseId"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      <Route
        path="/student"
        element={
          <RouteGuard
            element={<StudentViewCommonLayout />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      >
        <Route path="" element={<StudentHomePage />} />
        <Route path="home" element={<StudentHomePage />} />

        <Route path="courses" element={<StudentViewCoursesPage />} />
        <Route
          path="course/details/:id"
          element={<StudentViewCourseDetailsPage />}
        />

        <Route path="payment-return" element={<PaymentReturnPage />} />
        <Route path="paypal-return" element={<PaypalPaymentReturnPage />} />
        <Route path="student-courses" element={<StudentCoursesPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
        <Route path="quiz" element={<QuizList />} />
        <Route path="quiz/:quizSetId" element={<QuizPlay />} />
        <Route
          path="course-progress/:id"
          element={<StudentViewCourseProgressPage />}
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
