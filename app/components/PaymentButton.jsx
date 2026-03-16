"use client";

import { memo, useEffect, useRef, useState } from "react";
import { CreditCard, Crown, Loader2, Zap } from "lucide-react";
import { useUser, SignInButton } from "@clerk/nextjs"; // Import SignInButton
import { BRAND_NAME } from "../constants";
import Script from "next/script";
import { useRouter } from "next/navigation";
import useUserPlanStore from "@/stores/userPlanStore";
import { getUserCountry } from "../utils/geolocation";

const PaymentButton = ({
  amount,
  setShowModal = false,
  setPaymentStatus = false,
  subscriptionPlan = "free",
  subscriptDuration = "free",
  popular = false,
  isOneTimePayment = false,
  planId = null,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const setPlan = useUserPlanStore((state) => state.setPlan);
  const userCountryRef = useRef("US")

  useEffect(()=>{
    const fetchUserCountry = async () =>{
      const countryFromLocalStorage = localStorage.getItem("userCountry")
      let country = "US"; // default country
      if(!countryFromLocalStorage){
        country = await getUserCountry();
        localStorage.setItem("userCountry", country)
      }
      userCountryRef.current = country;
    }
    fetchUserCountry();
  },[])

  const router = useRouter();
  const makePayment = async () => {
    if (!user && amount>0) { 
      return; // SignInButton will handle the sign-in flow
    }

    setLoading(true);
    setError(null);

    try {
      // Validate amount
      if (!amount || amount <= 0) {
        router.push("/controller");
        return;
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
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
          contact: user?.phoneNumbers?.[0]?.phoneNumber || "",
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

  const openPaymentWindowAndMakePayment = () => {
    // console.log(userCountryRef.current, ' --userCountryRef');
    // if (userCountryRef.current == 'IN') {
    //   makePayment();
    // } else {
    // }
    if (!amount || amount <= 0) {
      router.push("/controller");
      return;
    }
    dodoPayments();
  };

  async function dodoPayments(){
    if (!user && amount>0) { 
      return; // SignInButton will handle the sign-in flow
    }

    setLoading(true);
    setError(null);

    try {
      // Validate amount
      if (!amount || amount <= 0) {
        router.push("/controller");
        return;
      }
      
      const checkoutEndPoint = (isOneTimePayment==="true") ? "/api/dodopayment/oneTime" : "/api/dodopayment/subscription"

      // create order
      const response = await fetch(checkoutEndPoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          planId,
          userCountry: userCountryRef.current,
          user: {
            name: user?.fullName || "",
            email: user?.primaryEmailAddress?.emailAddress || "",
          },
          subscriptionPlan: subscriptionPlan,
          subscriptDuration: subscriptDuration,
        }),
      });

      const data = await response.json();
      if (data.error || !response.ok) {
        throw new Error(data.message || "Failed to create order");
      }
      // console.log(data," --data")
      if(!data.checkoutUrl){
        throw new Error(data.message || "Error creating payment link, please try again.");
      }
      router.push(data.checkoutUrl)
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const getButtonContent = () => {
    if (loading) {
      return (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing...</span>
        </>
      );
    }

    if (!amount || amount === 0) {
      return (
        <>
          <Zap className="w-5 h-5" />
          <span>Get Started Free</span>
        </>
      );
    }

    return (
      <>
        <CreditCard className="w-5 h-5" />
        <span>Subscribe for ${amount.toLocaleString()}</span>
        {popular && <Crown className="w-4 h-4 ml-1 fill-current" />}
      </>
    );
  };

  const getButtonStyles = () => {
    const baseStyles =
      "group relative w-full font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg";

    if (!amount || amount === 0) {
      return `${baseStyles} bg-gray-900 hover:bg-gray-800 text-white border-2 border-gray-900 hover:border-gray-800`;
    }

    if (popular) {
      return `${baseStyles} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-2 border-transparent relative overflow-hidden`;
    }

    return `${baseStyles} bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300`;
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
      {(user || amount <= 0) ? (
        <button
          onClick={openPaymentWindowAndMakePayment}
          disabled={loading}
          className={getButtonStyles()}
        >
          {popular && !loading && (
            <div className="absolute inset-0 -top-[2px] -bottom-[2px] -left-[2px] -right-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer rounded-xl"></div>
          )}
          <div className="relative flex items-center gap-3">
            {getButtonContent()}
          </div>
        </button>
      ) : (
        <SignInButton
          mode="modal"
          // afterSignInUrl={window.location.pathname}
        >
          <button
            disabled={loading}
            className={getButtonStyles()}
          >
            {popular && !loading && (
              <div className="absolute inset-0 -top-[2px] -bottom-[2px] -left-[2px] -right-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer rounded-xl"></div>
            )}
            <div className="relative flex items-center gap-3">
              {getButtonContent()}
            </div>
          </button>
        </SignInButton>
      )}
    </div>
  );
};
export default memo(PaymentButton);
// Overview of the Payment Flow Before diving into the specifics,
// here’s a high-level overview of how Razorpay payments work in your Next.js application:Order
// Creation: The client (frontend) sends a request to your server’s /api/order endpoint with the payment amount. The server uses the Razorpay Node.js SDK to create an order and returns an order_id along with other details.
// Payment Initiation: The frontend uses the order_id and Razorpay’s JavaScript checkout script to display a payment modal where the user enters payment details (e.g., card, UPI).
// Payment Completion: After the user completes the payment, Razorpay sends a response to the frontend with razorpay_order_id, razorpay_payment_id, and razorpay_signature.
// Payment Verification: The frontend sends these details to your server’s /api/verify endpoint, which verifies the payment’s authenticity using a cryptographic signature. If verified, you can update your database or perform other actions (e.g., mark the order as paid).
// User Feedback: The user is notified of the payment’s success or failure.

// This flow ensures secure, server-side order creation and payment verification, protecting against tampering.
