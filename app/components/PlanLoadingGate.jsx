"use client"
import useUserPlanStore from "@/stores/userPlanStore";

export default function PlanLoadingGate({ children }) {
  const isLoading = useUserPlanStore(state => state.isLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h1 className="text-white text-xl font-bold mb-2">Connecting you...</h1>
          <p className="text-white/70">Please wait while we fetch your settings.</p>
        </div>
      </div>
    );
  }

  return children;
}