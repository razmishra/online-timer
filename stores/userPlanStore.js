import { FREE_CONNECTIONS_ALLOWED, FREE_TIMERS_ALLOWED } from "@/app/constants";
import { create } from "zustand";

const useUserPlanStore = create((set) => ({
  plan: {
    planId: "free",
    planVersion: 1,
    maxConnectionsAllowed: FREE_CONNECTIONS_ALLOWED,
    maxTimersAllowed: FREE_TIMERS_ALLOWED,
    customLogoAndTitleEnabled: false,
    customBgEnabled: false,
    subscriptDuration: "free",
  },
  popup: { isOpen: false, type: null, message: null },
  setPlan: (newPlan) =>
    set((state) => ({
      plan: { ...state.plan, ...newPlan },
    })),
  showPopup: (type, message) =>
    set({ popup: { isOpen: true, type, message } }),
  closePopup: () => set({ popup: { isOpen: false, type: null, message: null } }),
}));

export default useUserPlanStore;