import { Suspense } from 'react';
import PlanLoadingGate from '../components/PlanLoadingGate';
import ControllerPageContent from './ControllerPageContent';

export default function ControllerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlanLoadingGate>
        <ControllerPageContent />
      </PlanLoadingGate>
    </Suspense>
  );
}