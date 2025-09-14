import Link from "next/link";

export const metadata = {
  title: "Service Delivery Policy | shareMyTimer",
  description: "Service Delivery Policy for shareMyTimer's services.",
};

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Service Delivery Policy</h1>
        <p className="text-gray-600 mb-4">Last updated: September 15, 2025</p>
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold">1. Service Access</h2>
            <p>
              shareMyTimer, provides digital services accessible immediately upon successful payment confirmation via Razorpay or PayPal.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">2. Delivery Timeline</h2>
            <p>
              Access to our platform is granted instantly after payment.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">3. Access Issues</h2>
            <p>
              If you experience delays or issues accessing the service, contact us at{" "}
              <Link href="mailto:sharemytimer0@gmail.com" className="text-blue-600 hover:underline">
                sharemytimer0@gmail.com
              </Link>. We aim to resolve issues within 08 hours.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">4. Service Availability</h2>
            <p>
              Our services are available 24/7, subject to scheduled maintenance or unforeseen outages, which will be communicated in advance.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}