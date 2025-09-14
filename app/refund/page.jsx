import Link from "next/link";

export const metadata = {
  title: "Refund and Cancellation Policy | shareMyTimer",
  description: "Refund and Cancellation Policy for shareMyTimer's services.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Refund and Cancellation Policy</h1>
        <p className="text-gray-600 mb-4">Last updated: September 15, 2025</p>
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold">1. Refund Eligibility</h2>
            <p>
              Refunds are available within 7 days of initial subscription purchase, provided no significant usage of the service has occurred.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">2. Non-Refundable Cases</h2>
            <p>
              No refunds are issued for auto-renewed subscriptions after the billing date or for services accessed beyond the refund period.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">3. Cancellation</h2>
            <p>
              You may cancel your subscription at any time via your account dashboard. Cancellation takes effect at the end of the current billing cycle.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">4. Refund Process</h2>
            <p>
              To request a refund, contact us at{" "}
              <Link href="mailto:sharemytimer0@gmail.com" className="text-blue-600 hover:underline">
                sharemytimer0@gmail.com
              </Link>. Refunds are processed within 5-7 business days to the original payment method.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">5. Disputes</h2>
            <p>
              For payment disputes, contact us first. We work with Razorpay and PayPal to resolve issues promptly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}