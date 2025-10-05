import { connectToDatabase } from "@/utils/db";
import React from "react";
import PaymentPage from "./pricingUI";

const planNamesObj = {
  free: "Starter",
  pro: "Pro",
  singleEvent: "Single Event",
};

export async function fetchPlans() {
  await connectToDatabase();
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/plans`);
    if (!res.ok) {
      throw new Error("Failed to fetch plans");
    }
    const { plans } = await res.json();
    const mappedPlans = plans.map((plan) => ({
      id: plan.planId,
      name: planNamesObj[plan.planId],
      billingPeriod: plan?.subscriptDuration,
      amount: plan?.amount,
      description: plan?.description,
      features: plan?.features,
      popular: plan?.popular || false,
      isOneTimePayment: plan?.isOneTimePayment || false,
    }));
    return mappedPlans;
  } catch (err) {
    console.log(err);
    return [];
  }
}

const pricingUI = async () => {
  const plans = await fetchPlans();
  return <PaymentPage plans={plans} />;
};

export default pricingUI;
