"use client";

import useUserPlanStore from "@/stores/userPlanStore";
import { useRouter } from "next/navigation";

export default function LimitExceededPopup() {
  const router = useRouter();
  const currentActivePlan = useUserPlanStore(store => store)
  const { popup, closePopup } = currentActivePlan;

  if (!popup.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 rounded-2xl p-6 sm:p-8 border border-slate-700/60 shadow-2xl max-w-sm w-full mx-4">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Plan Limit Reached</h3>
        <p className="text-slate-400 text-sm sm:text-base mb-6">{popup.message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={closePopup}
            className="bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 font-semibold py-2 px-4 rounded-lg transition-all duration-200 border border-slate-600/50 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              closePopup();
              router.push("/payment");
            }}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm"
          >
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );
}