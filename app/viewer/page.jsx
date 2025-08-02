import { Suspense } from 'react';
import ViewerPageContent from './ViewerPageContent';
import PlanLoadingGate from '../components/PlanLoadingGate';

export default function ViewerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlanLoadingGate>
        <ViewerPageContent />
      </PlanLoadingGate>
    </Suspense>
  );
}