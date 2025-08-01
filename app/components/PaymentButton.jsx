"use client";

import { memo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { BRAND_NAME } from "../constants";
import Script from "next/script";
import { useRouter } from "next/navigation";
import useUserPlanStore from "@/stores/userPlanStore";

const PaymentButton = ({
  amount,
  setShowModal = false,
  setPaymentStatus = false,
  subscriptionPlan = "free",
  subscriptDuration = "free",
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const setPlan = useUserPlanStore((state) => state.setPlan);

  const router = useRouter();
  const makePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Validate amount
      if (!amount || amount <= 0) {
        router.push("/controller")
      }

      // Create order
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();
      if (data.error || !response.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      // Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: { BRAND_NAME },
        description: "Payment for your order",
        order_id: data.order.id,
        options: {
          checkout: {
            name: {BRAND_NAME},
          },
        },
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                subscriptionPlan: subscriptionPlan,
                subscriptDuration: subscriptDuration,
              }),
            });
            const verifyData = await verifyResponse.json();

            if (verifyData.error || !verifyResponse.ok) {
              throw new Error(
                verifyData.message || "Payment verification failed"
              );
            }
            // console.log(verifyData.plan," --verifyData.plan")
            setPlan(verifyData.plan)
            // Show success modal
            setPaymentStatus("success");
            // alert("Payment successful!");
          } catch (verifyError) {
            setError(verifyError.message || "Payment verification failed");
            setPaymentStatus("failed");
          } finally {
            setShowModal(true);
          }
        },
        prefill: {
          name: user.fullName || "",
          email: user.primaryEmailAddress.emailAddress || "",
          contact: user.phoneNumbers?.[0]?.phoneNumber || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setError(response.error.description || "Payment failed");
        setPaymentStatus("failed");
      });
      rzp.open();
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-3">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      <button
        onClick={makePayment}
        disabled={loading}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Get Started ${amount > 0 ? " -" + amount.toLocaleString() : ""}`
        )}
      </button>
    </div>
  );
};
export default memo(PaymentButton);
// // Overview of the Payment FlowBefore diving into the specifics,
// //  here’s a high-level overview of how Razorpay payments work in your Next.js application:Order
// // Creation: The client (frontend) sends a request to your server’s /api/order endpoint with the payment amount. The server uses the Razorpay Node.js SDK to create an order and returns an order_id along with other details.
// // Payment Initiation: The frontend uses the order_id and Razorpay’s JavaScript checkout script to display a payment modal where the user enters payment details (e.g., card, UPI).
// // Payment Completion: After the user completes the payment, Razorpay sends a response to the frontend with razorpay_order_id, razorpay_payment_id, and razorpay_signature.
// // Payment Verification: The frontend sends these details to your server’s /api/verify endpoint, which verifies the payment’s authenticity using a cryptographic signature. If verified, you can update your database or perform other actions (e.g., mark the order as paid).
// // User Feedback: The user is notified of the payment’s success or failure.

// // This flow ensures secure, server-side order creation and payment verification, protecting against tampering.
