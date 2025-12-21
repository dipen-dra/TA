import { Mail, Lock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement forgot password logic
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="px-6 py-4">
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity w-fit">
                        <img
                            src="/tayari-adda-logo.png"
                            alt="Tayari Adda"
                            className="h-12 w-auto"
                        />
                        <span className="text-2xl font-semibold text-gray-900">Tayari Adda</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                        {!isSubmitted ? (
                            <>
                                {/* Header */}
                                <div className="text-center space-y-2 mb-8">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Lock className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Forgot Password?
                                    </h2>
                                    <p className="text-gray-600">
                                        No worries! Enter your email and we'll send you reset instructions.
                                    </p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-700 font-medium">
                                            Email Address
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={!email}
                                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                                    >
                                        Send Reset Link
                                    </Button>
                                </form>

                                {/* Back to Sign In */}
                                <div className="mt-6 text-center">
                                    <Link
                                        to="/auth"
                                        className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Sign In
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Success Message */}
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                        <svg
                                            className="w-8 h-8 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Check Your Email
                                    </h2>
                                    <p className="text-gray-600">
                                        We've sent password reset instructions to:
                                    </p>
                                    <p className="font-semibold text-gray-900">{email}</p>
                                    <p className="text-sm text-gray-500">
                                        Didn't receive the email? Check your spam folder or{" "}
                                        <button
                                            onClick={() => setIsSubmitted(false)}
                                            className="text-blue-600 font-medium hover:underline"
                                        >
                                            try again
                                        </button>
                                    </p>
                                </div>

                                {/* Back to Sign In */}
                                <div className="mt-8 text-center">
                                    <Link
                                        to="/auth"
                                        className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Sign In
                                    </Link>
                                </div>
                            </>
                        )}
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
    );
}

export default ForgotPasswordPage;
