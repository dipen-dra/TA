import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/auth-context";
import Lottie from "lottie-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CommonForm from "@/components/common-form";
import { signInFormControls, signUpFormControls } from "@/config";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const [animationData, setAnimationData] = useState(null);
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  useEffect(() => {
    // Load Lottie animation
    fetch("/Online Learning.json")
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error("Error loading animation:", error));
  }, []);

  function handleTabChange(value) {
    setActiveTab(value);
  }

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-md">
        <div className="px-6 py-3">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity w-fit">
            <img
              src="/tayari-adda-logo.png"
              alt="Tayari Adda"
              className="h-16 w-auto"
            />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">

          {/* Left Side - Lottie Animation Only */}
          <div className="hidden md:flex items-center justify-center">
            {animationData && (
              <Lottie
                animationData={animationData}
                loop={true}
                className="w-full h-auto max-w-lg"
              />
            )}
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-full">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <Tabs
                value={activeTab}
                defaultValue="signin"
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl mb-8">
                  <TabsTrigger
                    value="signin"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200 font-medium"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200 font-medium"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Welcome Back
                    </h2>
                    <p className="text-gray-600">
                      Sign in to continue your learning
                    </p>
                  </div>

                  <CommonForm
                    formControls={signInFormControls}
                    buttonText={
                      <span className="flex items-center justify-center gap-2">
                        Sign In
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    }
                    formData={signInFormData}
                    setFormData={setSignInFormData}
                    isButtonDisabled={!checkIfSignInFormIsValid()}
                    handleSubmit={handleLoginUser}
                  />

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Remember me</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <div className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                      onClick={() => setActiveTab("signup")}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Sign up
                    </button>
                  </div>
                </TabsContent>

                <TabsContent value="signup" className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Create Account
                    </h2>
                    <p className="text-gray-600">
                      Join thousands of learners today
                    </p>
                  </div>

                  <CommonForm
                    formControls={signUpFormControls}
                    buttonText={
                      <span className="flex items-center justify-center gap-2">
                        Create Account
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    }
                    formData={signUpFormData}
                    setFormData={setSignUpFormData}
                    isButtonDisabled={!checkIfSignUpFormIsValid()}
                    handleSubmit={handleRegisterUser}
                  />

                  <div className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      onClick={() => setActiveTab("signin")}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Sign in
                    </button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Trust Badge */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                🔒 Your data is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;