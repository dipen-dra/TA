
import React, { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";

const PaymentReturnPage = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pidx = params.get("pidx");
    const status = params.get("status");

    console.log("Payment callback parameters:", params);

    setLoading(true);
    setError(null);

    if (status === "Completed") {
      setPaymentStatus("Payment was successful. Verifying...");
      verifyPayment(pidx);
    } else if (status === "User canceled") {
      setPaymentStatus("Payment was canceled by the user");
      setLoading(false);
    } else if (status === "Pending") {
      setPaymentStatus("Payment is pending...");
      setLoading(false);
    } else {
      setPaymentStatus("Unknown payment status");
      setLoading(false);
    }
  }, []);

  const verifyPayment = async (pidx) => {
    try {
      const response = await axiosInstance.post(
        "/student/order/verify-payment",
        {
          pidx: pidx,
        }
      );

      if (response.data.success) {
        setPaymentStatus("Payment verified successfully! Redirecting to your courses...");
        setTimeout(() => {
          window.location.href = "/student/student-courses";
        }, 2000);
      } else {
        setPaymentStatus("Payment verification failed. Please contact support.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during payment verification:", error);
      setError(
        error.response?.data?.message ||
        "An error occurred while verifying payment"
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Payment Status</h1>

        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Processing payment details...</p>
          </div>
        ) : error ? (
          <div className="text-red-600 bg-red-50 p-4 rounded-xl">
            <p className="font-semibold">Verification Failed</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : (
          <div className="text-green-600 bg-green-50 p-4 rounded-xl">
            <p className="font-semibold">{paymentStatus}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentReturnPage;
