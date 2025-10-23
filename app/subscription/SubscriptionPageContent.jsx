"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Crown,
  AlertCircle,
  Users,
  Timer,
  Palette,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { themeAnimations, themes } from "@/utils/themes";

export default function SubscriptionPageContent() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
      return;
    }

    if (isLoaded && isSignedIn) {
      fetchSubscriptionData();
    }
  }, [isLoaded, isSignedIn]);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/subscription");
      const result = await response.json();

      if (result.error) {
        setError(result.message);
      } else {
        setSubscriptionData(result.data);
      }
    } catch (err) {
      console.error("Error fetching subscription:", err);
      setError("Failed to load subscription details");
    } finally {
      setLoading(false);
    }
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
  //         <p className="text-gray-600 font-medium">Loading subscription details...</p>
  //       </div>
  //     </div>
  //   );
  // }

  const theme = themes["default"] || themes.calm;
  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          background: theme.gradient,
          fontFamily: theme.fontFamily,
          color: theme.textColorPrimary,
        }}
      >
        <style>{themeAnimations}</style>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current mx-auto mb-6" />
          <h1 className="text-2xl font-semibold mb-2">Loading Payment Transactions...</h1>
          <p>Please wait while we fetch your plan details.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/controller")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { currentPlan, subscription, paymentHistory, user } = subscriptionData;

  // Plan badge color
  const getPlanBadgeColor = () => {
    if (currentPlan.planId === "free") return "bg-gray-100 text-gray-800";
    if (subscription.isExpired) return "bg-red-100 text-red-800";
    return "bg-gradient-to-r from-blue-600 to-purple-600 text-white";
  };

  // Status badge
  const getStatusBadge = () => {
    if (currentPlan.planId === "free") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
          <CheckCircle2 className="w-4 h-4 mr-1.5" />
          Free Plan
        </span>
      );
    }
    
    if (subscription.isExpired) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <AlertCircle className="w-4 h-4 mr-1.5" />
          Expired
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <CheckCircle2 className="w-4 h-4 mr-1.5" />
        Active
      </span>
    );
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount, currency = "INR") => {
    if (currency === "USD") {
      return `$${amount.toFixed(2)}`;
    }
    return `₹${amount.toFixed(2)}`;
  };

  // Get payment status badge
  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      completed: "bg-green-100 text-green-800",
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      created: "bg-blue-100 text-blue-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusMap[status] || "bg-gray-100 text-gray-800"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/controller")}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Subscription</h1>
          <p className="text-gray-600">Manage your plan and billing information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current Plan Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-2xl font-bold text-gray-900 capitalize">
                    {currentPlan.planName} Plan
                  </h2>
                  {currentPlan.planId !== "free" && (
                    <Crown className="w-6 h-6 text-yellow-500" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge()}
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPlanBadgeColor()}`}>
                    {currentPlan.planId.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Days Remaining */}
            {currentPlan.planId !== "free" && subscription.expiresAt && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {subscription.isExpired ? "Expired" : "Days Remaining"}
                    </p>
                    <p className="text-4xl font-bold text-gray-900">
                      {subscription.isExpired ? "0" : subscription.daysRemaining}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Clock className="w-10 h-10 text-blue-600" />
                  </div>
                </div>
              </div>
            )}

            {/* Plan Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {(currentPlan.planId !== "free" && subscription.activatedAt) && (
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Activated</p>
                    <p className="font-semibold text-gray-900">{formatDate(subscription.activatedAt)}</p>
                  </div>
                </div>
              )}
              
              {currentPlan.planId !== "free" && subscription.expiresAt ? (
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {subscription.planType === "subscription" ? "Renews" : "Expires"}
                    </p>
                    <p className="font-semibold text-gray-900">{formatDate(subscription.expiresAt)}</p>
                  </div>
                </div>
              ) : (subscription.expiresAt && (
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {"Expired At"}
                    </p>
                    <p className="font-semibold text-gray-900">{formatDate(subscription.expiresAt)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Timer className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Max Timers</p>
                    <p className="font-semibold text-gray-900">
                      {currentPlan.maxTimersAllowed === -1 ? "Unlimited" : currentPlan.maxTimersAllowed}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Max Connections</p>
                    <p className="font-semibold text-gray-900">
                      {currentPlan.maxConnectionsAllowed === -1 ? "Unlimited" : currentPlan.maxConnectionsAllowed-1}
                    </p>
                  </div>
                </div>

                {/* <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Palette className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Custom Logo & Title</p>
                    <p className="font-semibold text-gray-900">
                      {currentPlan.customLogoAndTitleEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div> */}

                {/* <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Custom Background</p>
                    <p className="font-semibold text-gray-900">
                      {currentPlan.customBgEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div> */}
              </div>

              {currentPlan.features && currentPlan.features.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Additional Features</h4>
                  <ul className="space-y-2">
                    {currentPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Action Cards */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {(currentPlan.planId === "free" || subscription.isExpired) && (
                  <Link
                    href="/payment"
                    className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-center"
                  >
                    {currentPlan.planId === "free" ? "Upgrade Plan" : "Renew Plan"}
                  </Link>
                )}

                {currentPlan.planId !== "free" && !subscription.isExpired && (
                  <Link
                    href="/payment"
                    className="block w-full bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 text-gray-700 hover:text-gray-900 font-semibold py-3 px-4 rounded-xl transition-all duration-300 border border-gray-200 hover:border-blue-200 text-center"
                  >
                    Change Plan
                  </Link>
                )}

                <Link
                  href="/controller"
                  className="block w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors text-center"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>

            {/* Plan Summary */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Plan Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Plan Type</span>
                  <span className="font-semibold capitalize">{subscription.planType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Duration</span>
                  <span className="font-semibold capitalize">
                    {currentPlan.subscriptDuration}
                  </span>
                </div>
                {currentPlan.amount > 0 && (
                  <div className="flex justify-between items-center pt-3 border-t border-white/20">
                    <span className="text-blue-100">Amount</span>
                    <span className="font-bold text-xl">{formatCurrency(currentPlan.amount)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
            </div>
          </div>

          {paymentHistory && paymentHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Plan</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Method</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment, index) => (
                    <tr key={payment.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === 0 ? 'bg-blue-50/30' : ''}`}>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {formatDate(payment.date)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900 capitalize">
                        {payment.planName}
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                        {formatCurrency(payment.amount, payment.currency)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 capitalize">
                        {payment.method}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {getPaymentStatusBadge(payment.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No payment history</p>
              <p className="text-gray-400 text-sm mt-2">Your payment transactions will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

