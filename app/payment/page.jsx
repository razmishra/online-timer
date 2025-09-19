"use client";

import { useState, useEffect } from "react";
import PricingCard from "../components/PricingCard";
import Navbar from "../components/Navbar";
import PaymentStatusModal from "../components/PaymentStatusModal";
import { useRouter } from "next/navigation";
import { Sparkles, Shield, Zap } from "lucide-react";

function PaymentPage() {
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("failed"); // 'success' or 'failed'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const planNamesObj = {
    "free": "Starter",
    "pro":"Pro",
    "singleEvent": "Single Event"
  }

  async function fetchPlans() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/plans");
      if (!res.ok) {
        throw new Error("Failed to fetch plans");
      }
      const { plans } = await res.json();
      const mappedPlans = plans.map((plan) => ({
        id: plan.planId,
        name: planNamesObj[plan.planId],
        billingPeriod: plan?.subscriptDuration,
        amount: plan?.amount,
        description: plan?.description,
        features: plan?.features,
        popular: plan?.popular || false,
        isOneTimePayment: plan?.isOneTimePayment || false
      }));
      setPlans(mappedPlans);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchPlans();
  }, []);

  const handleEmailClick = () => {
    window.location.href = 'mailto:sharemytimer0@gmail.com?subject=Inquiry about Custom Plans';
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-32 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-100">
                <Sparkles className="w-4 h-4" />
                Transparent Pricing
              </div>
              
              {/* Main Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
                Choose your
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> perfect </span>
                plan
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                Scale with confidence. No hidden fees, no surprises. 
                <br className="hidden sm:block" />
                Just transparent pricing that grows with you.
              </p>
              
              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mb-12">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>30-day money back</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span>Instant activation</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="relative pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-4 text-gray-600 text-lg">Loading plans...</span>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
                  <p className="text-red-600 mb-4">Error: {error}</p>
                  <button
                    onClick={() => fetchPlans()}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Fetch Plans
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan) => (
                  <PricingCard
                    key={`${plan.id}-${plan.billingPeriod}`}
                    id={plan.id}
                    name={plan.name}
                    amount={plan.amount}
                    description={plan.description}
                    features={plan.features}
                    popular={plan.popular}
                    billingPeriod={plan.billingPeriod}
                    setShowModal={setShowModal}
                    setPaymentStatus={setPaymentStatus}
                    isOneTimePayment={plan?.isOneTimePayment ?? false}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative py-16 bg-white/50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Still have questions or looking for custom plans?
        </h2>
        <p className="text-gray-600 mb-8">
          Our team is here to help you find the perfect plan for your needs.
        </p>
        
        {/* Email Contact Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-md mx-auto mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Email Me Directly
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Send your message to:</p>
            <p className="font-mono text-blue-600 font-medium break-all cursor-pointer" onClick={handleEmailClick}>
              sharemytimer0@gmail.com
            </p>
          </div>
          
          <button
            onClick={handleEmailClick}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Get in Touch
            <span className="text-blue-200">→</span>
          </button>
        </div>
        
        {/* Quick Info */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Usually responds within 24 hours</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure & confidential</span>
          </div>
        </div>
      </div>
    </section>
  );
      </div>
      
      <PaymentStatusModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        status={paymentStatus}
      />
    </>
  );
}

export default PaymentPage;