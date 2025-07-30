import { Check, Star } from "lucide-react";
import PaymentButton from "./PaymentButton";

export default function PricingCard({
  id,
  name,
  amount,
  description,
  features,
  popular = false,
  billingPeriod = "free",
  setShowModal = false,
  setPaymentStatus = false,
}) {
  return (
    <div className="relative">
      <div
        className={`relative bg-white rounded-xl border transition-all duration-200 hover:shadow-lg ${
          popular
            ? "border-blue-200 shadow-md ring-1 ring-blue-100"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        {popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              Most Popular
            </span>
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
            <div className="mb-3">
              <span className={`text-3xl font-bold ${popular ? 'text-blue-600' : 'text-gray-900'}`}>
                {amount ? "₹" + amount.toLocaleString() : "FREE"}
              </span>
              {(billingPeriod && !["free","singleEvent"]?.includes(billingPeriod)) && (
                <span className="text-gray-500 text-base ml-1">/{billingPeriod}</span>
              )}
            </div>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-2.5 h-2.5 text-white stroke-2" />
                </div>
                <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>

          {/* Button */}
          <PaymentButton
            amount={amount}
            planName={name}
            setShowModal={setShowModal}
            setPaymentStatus={setPaymentStatus}
            subscriptionPlan={id}
            subscriptDuration={billingPeriod}
          />
        </div>
      </div>
    </div>
  );
}