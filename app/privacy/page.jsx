import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | shareMyTimer",
  description: "Privacy Policy for shareMyTimer's services.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-4">Last updated: September 15, 2025</p>
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold">1. Information We Collect</h2>
            <p>
              We collect personal information such as your email address, user ID, and payment details to provide and improve our services. Trust us, we do not sell it to anyone.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
            <p>
              Your data is used to process payments, manage subscriptions, provide customer support, and comply with legal obligations.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">3. Data Sharing</h2>
            <p>
              We share data with third-party processors like Razorpay and PayPal for payment processing. We do not sell your data to third parties.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">4. Your Rights</h2>
            <p>
              You may request access, correction, or deletion of your data by contacting us.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">5. Data Security</h2>
            <p>
              We use industry-standard measures to protect your data but cannot guarantee absolute security.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">6. Contact Us</h2>
            <p>
              For privacy concerns, reach out at{" "}
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