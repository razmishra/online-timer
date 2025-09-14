import Link from "next/link";

export const metadata = {
  title: "Terms and Conditions | shareMyTimer",
  description: "Terms and Conditions for using shareMyTimer's services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
        <p className="text-gray-600 mb-4">Last updated: September 15, 2025</p>
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p>
              Welcome to shareMyTimer. By accessing or using our services, you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree, please do not use our platform.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">2. Services</h2>
            <p>
              shareMyTimer provides subscription-based software services. Access is granted upon successful payment and is subject to renewal as per your subscription plan.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">3. Payments and Subscriptions</h2>
            <p>
              Subscriptions are billed in INR for Indian users and USD for international users. Payments are processed via Razorpay or PayPal.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">4. User Responsibilities</h2>
            <p>
              You agree to provide accurate information, maintain account security, and use the service for lawful purposes only.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">5. Termination</h2>
            <p>
              We may suspend or terminate your account for violation of these Terms or non-payment. You may cancel your subscription via your account dashboard.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">6. Governing Law</h2>
            <p>
              These Terms are governed by the laws of India. Any disputes will be resolved in the courts of UP, India.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">7. Contact Us</h2>
            <p>
              For questions, contact us at{" "}
              <Link href="mailto:sharemytimer0@gmail.com" className="text-blue-600 hover:underline">
                sharemytimer0@gmail.com
              </Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}