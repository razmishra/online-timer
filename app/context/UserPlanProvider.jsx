"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import useUserPlanStore from "@/stores/userPlanStore";
import { FREE_CONNECTIONS_ALLOWED, FREE_TIMERS_ALLOWED } from "../constants";

export default function UserPlanProvider({ children }) {
  const { userId, isLoaded } = useAuth();
  const setPlan = useUserPlanStore((state) => state.setPlan);

  useEffect(() => {
    async function fetchPlan() {
      // console.log("Fetching plan for userId:", userId);
      try {
        const res = await fetch(`/api/user-plan?userId=${userId}`);
        if (!res.ok) throw new Error(`Failed to fetch plan: ${res.status}`);
        const { plan } = await res.json();
        // console.log("Plan fetched:", plan);
        setPlan(plan);
      } catch (error) {
        console.error("Error fetching plan in UserPlanProvider:", error.message);
        setPlan({
          planId: "free",
          planVersion: 1,
          maxConnectionsAllowed: FREE_CONNECTIONS_ALLOWED,
          maxTimersAllowed: FREE_TIMERS_ALLOWED,
          customLogoAndTitleEnabled: false,
          customBgEnabled: false,
          subscriptDuration: "free",
        });
      }
    }

    if (isLoaded) {
      if (userId) {
        fetchPlan();
      } else {
        console.log("Setting default free plan: no user logged in");
        setPlan({
          planId: "free",
          planVersion: 1,
          maxConnectionsAllowed: FREE_CONNECTIONS_ALLOWED,
          maxTimersAllowed: FREE_TIMERS_ALLOWED,
          customLogoAndTitleEnabled: false,
          customBgEnabled: false,
          subscriptDuration: "free",
        });
      }
    }
  }, [isLoaded, userId, setPlan]);

  return <>{children}</>;
}