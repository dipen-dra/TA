import { Mail, Lock, ArrowLeft, KeyRound, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    forgotPasswordService,
    verifyOtpService,
    resetPasswordService
} from "@/services";
import { useToast } from "@/hooks/use-toast";

function ForgotPasswordPage() {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await forgotPasswordService(email);
            if (response.success) {
                toast({ title: "OTP Sent", description: "Check your email for the verification code." });
                setStep(2);
            } else {
                toast({ title: "Error", description: response.message, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Something went wrong sending OTP.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await verifyOtpService(email, otp);
            if (response.success) {
                toast({ title: "Verified", description: "OTP verified successfully." });
                setStep(3);
            } else {
                toast({ title: "Error", description: response.message, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Invalid OTP.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            const response = await resetPasswordService(email, otp, newPassword);
            if (response.success) {
                toast({ title: "Success", description: "Password reset successfully. Please login." });
                navigate("/auth");
            } else {
                toast({ title: "Error", description: response.message, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to reset password.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

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
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">

                        {/* Step 1: Email */}
                        {step === 1 && (
                            <>
                                <div className="text-center space-y-2 mb-8">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Mail className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
                                    <p className="text-gray-600">Enter your email to receive a reset code.</p>
                                </div>
                                <form onSubmit={handleSendOtp} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="pl-10 h-12"
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" disabled={!email || loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                                        {loading ? "Sending..." : "Send OTP"}
                                    </Button>
                                </form>
                            </>
                        )}

                        {/* Step 2: OTP */}
                        {step === 2 && (
                            <>
                                <div className="text-center space-y-2 mb-8">
                                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <KeyRound className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Verify OTP</h2>
                                    <p className="text-gray-600">Enter the 6-digit code sent to <span className="font-semibold">{email}</span></p>
                                </div>
                                <form onSubmit={handleVerifyOtp} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="otp">One-Time Password</Label>
                                        <Input
                                            id="otp"
                                            type="text"
                                            placeholder="123456"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                            maxLength={6}
                                            className="h-12 text-center text-2xl tracking-widest"
                                        />
                                    </div>
                                    <Button type="submit" disabled={!otp || loading} className="w-full h-12 bg-purple-600 hover:bg-purple-700">
                                        {loading ? "Verifying..." : "Verify OTP"}
                                    </Button>
                                    <div className="text-center mt-4">
                                        <button type="button" onClick={() => setStep(1)} className="text-sm text-blue-600 hover:underline">
                                            Change Email
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}

                        {/* Step 3: New Password */}
                        {step === 3 && (
                            <>
                                <div className="text-center space-y-2 mb-8">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
                                    <p className="text-gray-600">Create a new, strong password.</p>
                                </div>
                                <form onSubmit={handleResetPassword} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                id="newPassword"
                                                type={showNewPassword ? "text" : "password"}
                                                placeholder="Enter new password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                                className="pl-10 pr-10 h-12"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm new password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                className="pl-10 pr-10 h-12"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <Button type="submit" disabled={!newPassword || !confirmPassword || loading} className="w-full h-12 bg-green-600 hover:bg-green-700">
                                        {loading ? "Resetting..." : "Reset Password"}
                                    </Button>
                                </form>
                            </>
                        )}

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
