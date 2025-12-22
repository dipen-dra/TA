import React, { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { CheckCircle, XCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PaymentReturnPage = () => {
  const [paymentStatus, setPaymentStatus] = useState("processing"); // processing, success, failed
  const [loading, setLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState("");
  const [gateway, setGateway] = useState(""); // 'esewa' or 'khalti'

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pidx = params.get("pidx"); // Khalti
    const encodedData = params.get("data"); // eSewa

    console.log("Payment callback parameters:", params.toString());

    if (encodedData) {
      setGateway("esewa");
      verifyEsewaPayment(encodedData);
    } else if (pidx) {
      setGateway("khalti");
      verifyKhaltiPayment(pidx);
    } else {
      setPaymentStatus("failed");
      setErrorDetails("Invalid payment parameters received.");
      setLoading(false);
    }
  }, []);

  const verifyEsewaPayment = async (encodedData) => {
    try {
      const response = await axiosInstance.post("/student/order/verify-esewa", {
        encodedData,
      });

      if (response.data.success) {
        setPaymentStatus("success");
      } else {
        setPaymentStatus("failed");
        setErrorDetails(response.data.message || "Payment verification failed.");
      }
    } catch (error) {
      console.error("eSewa Verification Error:", error);
      setPaymentStatus("failed");
      setErrorDetails(error.response?.data?.message || "An error occurred verifying eSewa payment.");
    } finally {
      setLoading(false);
    }
  };

  const verifyKhaltiPayment = async (pidx) => {
    try {
      const response = await axiosInstance.post("/student/order/verify-payment", {
        pidx,
      });

      if (response.data.success) {
        setPaymentStatus("success");
      } else {
        setPaymentStatus("failed");
        setErrorDetails("Khalti payment verification failed.");
      }
    } catch (error) {
      console.error("Khalti Verification Error:", error);
      setPaymentStatus("failed");
      setErrorDetails(error.response?.data?.message || "An error occurred verifying Khalti payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 font-sans">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border-0 overflow-hidden">
        <CardHeader className={`text-center py-12 ${paymentStatus === 'success' ? 'bg-green-50' :
            paymentStatus === 'failed' ? 'bg-red-50' : 'bg-blue-50'
          }`}>
          <div className="flex justify-center mb-4">
            {loading ? (
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            ) : paymentStatus === 'success' ? (
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center shadow-inner">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className={`text-2xl font-bold ${paymentStatus === 'success' ? 'text-green-800' :
              paymentStatus === 'failed' ? 'text-red-800' : 'text-blue-800'
            }`}>
            {loading ? "Processing Payment..." :
              paymentStatus === 'success' ? "Payment Successful!" : "Payment Failed"}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-8 py-10 text-center space-y-6">
          {loading ? (
            <p className="text-gray-500">
              Please wait while we verify your secure transaction. <br /> Do not close this window.
            </p>
          ) : paymentStatus === 'success' ? (
            <>
              <p className="text-gray-600">
                Thank you for your purchase! Your course has been added to your dashboard.
              </p>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
                onClick={() => window.location.href = "/student/student-courses"}
              >
                Go to My Courses <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </>
          ) : (
            <>
              <p className="text-gray-600">
                We couldn't process your payment. <br />
                <span className="text-sm text-red-600 font-medium bg-red-50 px-2 py-1 rounded mt-2 inline-block">
                  {errorDetails}
                </span>
              </p>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-6"
                  onClick={() => window.location.href = "/"}
                >
                  Go Home
                </Button>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 shadow-md"
                  onClick={() => window.history.back()}
                >
                  Try Again
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Footer / Trust Badge */}
      <div className="mt-8 text-center text-gray-400 text-sm flex items-center gap-2">
        <Lock className="w-3 h-3" />
        <span>Secure Payment Processing</span>
      </div>
    </div>
  );
};

// Start adding missing import for specific icon used in footer
import { Lock } from "lucide-react";

export default PaymentReturnPage;
