import { Suspense } from 'react';
import ViewerPageContent from './ViewerPageContent';

export default function ViewerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewerPageContent />
    </Suspense>
  );
}