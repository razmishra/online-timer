import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import SubscriptionPageContent from './SubscriptionPageContent';

export const metadata = {
  title: 'Subscription - ShareMyTimer',
  description: 'Manage your ShareMyTimer subscription and billing',
};

export default async function SubscriptionPage() {
  // Check authentication on server side
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading subscription details...</p>
        </div>
      </div>
    }>
      <SubscriptionPageContent />
    </Suspense>
  );
}

