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
  isLoading: true,
  popup: { isOpen: false, type: null, message: null },
  
  setPlan: (newPlan) => set(() => ({ 
    plan: newPlan, 
    isLoading: false // Set to false when plan is updated
  })),
  
  setLoading: (loading) => set({ isLoading: loading }), // Add this
    
  showPopup: (type, message) =>
    set({ popup: { isOpen: true, type, message } }),
  closePopup: () => set({ popup: { isOpen: false, type: null, message: null } }),
}));

export default useUserPlanStore;