import { Check, Users, Rocket, Star, Info } from "lucide-react";
import { useState } from "react";
import PaymentButton from "./PaymentButton";

const featureTooltips = {
  // Common tooltips that can be used across plans
  "Basic support": "Email support with 48-hour response time during business hours",
  "Email support": "Priority email support with 24-hour response time",
  "Priority support": "Dedicated support with 4-hour response time and phone access",
  "24/7 support": "Round-the-clock support via email, chat, and phone",
  "Custom integrations": "Tailored API integrations and custom development services",
  "Advanced analytics": "Detailed insights, custom reports, and data visualization tools",
  "Team collaboration": "Multi-user access with role-based permissions and shared workspaces",
  "API access": "Full REST API access for custom integrations and automation",
  "White-label solution": "Remove our branding and customize the interface with your brand",
  "Dedicated account manager": "Personal account manager for strategic guidance and support",
  "SLA guarantee": "99.9% uptime guarantee with service level agreement",
  "Custom training": "Personalized onboarding and training sessions for your team"
};

const planIcons = {
  "Starter": Users,
  "Pro": Rocket,
  "Single Event": Star
};

export default function PricingCard({
  id,
  name,
  amount,
  description,
  features,
  popular = false,
  billingPeriod = "free",
  setShowModal,
  setPaymentStatus,
}) {
  const IconComponent = planIcons[name] || Users;

  return (
    <div className="relative group">
      {/* Popular badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-current" />
              Most Popular
            </div>
          </div>
        </div>
      )}

      <div
        className={`relative h-full bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
          popular
            ? "border-blue-200 shadow-lg ring-1 ring-blue-100"
            : "border-gray-100 hover:border-gray-200"
        }`}
      >
        {/* Gradient overlay for popular plan */}
        {popular && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl"></div>
        )}

        <div className="relative p-8">
          {/* Plan header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
              popular 
                ? "bg-gradient-to-br from-blue-100 to-purple-100" 
                : "bg-gray-50"
            }`}>
              <IconComponent className={`w-8 h-8 ${
                popular ? "text-blue-600" : "text-gray-600"
              }`} />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
            
            <div className="mb-4">
              <div className="flex items-baseline justify-center gap-1">
                <span className={`text-5xl font-bold tracking-tight ${
                  popular ? "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" : "text-gray-900"
                }`}>
                  {amount ? "₹" + amount.toLocaleString() : "FREE"}
                </span>
                {(billingPeriod && !["free","singleEvent"]?.includes(billingPeriod)) && (
                  <span className="text-gray-500 text-lg font-medium">/{billingPeriod}</span>
                )}
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>

          {/* Features list */}
          <div className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="relative flex items-start gap-3 group/feature"
                // onMouseEnter={() => setHoveredFeature(index)}
                // onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                  popular 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500" 
                    : "bg-green-500"
                }`}>
                  <Check className="w-3 h-3 text-white stroke-2" />
                </div>
                
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-gray-700 leading-relaxed">{feature}</span>
                  <Info className="w-4 h-4 text-gray-400 opacity-0 group-hover/feature:opacity-100 transition-opacity cursor-help" />
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <PaymentButton
            amount={amount}
            planName={name}
            setShowModal={setShowModal}
            setPaymentStatus={setPaymentStatus}
            subscriptionPlan={id}
            subscriptDuration={billingPeriod}
            popular={popular}
          />
        </div>
      </div>
    </div>
  );
}