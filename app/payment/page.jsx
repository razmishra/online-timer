"use client";

import { useState, useEffect } from "react";
import PricingCard from "../components/PricingCard";
import Navbar from "../components/Navbar";
import PaymentStatusModal from "../components/PaymentStatusModal";

function PaymentPage() {
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("failed"); // 'success' or 'failed'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const planNamesObj = {
    "free": "Starter",
    "pro":"Pro",
    "singleEvent": "Single Event"
  }

  useEffect(() => {
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
        }));
        setPlans(mappedPlans);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPlans();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Header */}
        <Navbar />
        <section className="relative py-20 md:py-28 max-w-7xl mx-auto overflow-hidden">
          <div className="pt-16 pb-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                Simple, transparent pricing
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Choose the perfect plan for your needs. No hidden fees, no surprises.
              </p>
            </div>
          </div>
        </section>
        
        <section className="relative max-w-7xl mx-auto overflow-hidden">
          <div className="pt-16 pb-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed underline">
               Note: We are under verification, we'll update the LIVE API keys soon
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {isLoading ? (
            <div className="text-center text-gray-600">Loading plans...</div>
          ) : error ? (
            <div className="text-center text-red-600">
              Error: {error}
              <button
                onClick={() => fetchPlans()}
                className="ml-4 text-blue-600 underline"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <p className="text-gray-500 text-sm">
              Need help choosing?{" "}
              <span className="text-gray-900 font-medium">Contact our team</span>{" "}
              for personalized recommendations.
            </p>
          </div>
        </div>
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