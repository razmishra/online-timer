import { Suspense } from 'react';
import PlanLoadingGate from '../components/PlanLoadingGate';
import ControllerPageContent from './ControllerPageContent';

export default function ControllerPage() {
  return (
    <Suspense fallback={<PlanLoadingGate />}>
      <ControllerPageContent />
    </Suspense>
  );
}