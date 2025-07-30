import { NextResponse } from "next/server";
import User from "@/utils/models/User";
import SubscriptionPlan from "@/utils/models/SubscriptionPlan";
import { connectToDatabase } from "@/utils/db";
import { FREE_CONNECTIONS_ALLOWED, FREE_TIMERS_ALLOWED } from "@/app/constants";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json(
      {
        plan: {
          planId: "free",
          planVersion: 1,
          maxConnectionsAllowed: FREE_CONNECTIONS_ALLOWED,
          maxTimersAllowed: FREE_TIMERS_ALLOWED,
          customLogoAndTitleEnabled: false,
          customBgEnabled: false,
          subscriptDuration: "free",
        },
      },
      { status: 200 }
    );
  }
  try {
    await connectToDatabase();
    const user = await User.findOne({ userID: userId });
    if (!user) {
      return NextResponse.json(
        {
          plan: {
            planId: "free",
            planVersion: 1,
            maxConnectionsAllowed: FREE_CONNECTIONS_ALLOWED,
            maxTimersAllowed: FREE_TIMERS_ALLOWED,
            customLogoAndTitleEnabled: false,
            customBgEnabled: false,
            subscriptDuration: "free",
          },
        },
        { status: 200 }
      );
    }
    const plan = await SubscriptionPlan.findOne({
      planId: user.planId,
      version: user.planVersion,
    });
    // console.log(plan," user plan")
    const planExpiresAt = new Date(user.planExpiresAt);
    const currentDate = new Date();
    const subscriptionExpired = planExpiresAt <= currentDate;
    console.log(subscriptionExpired," --subscriptionExpired")
    if ( subscriptionExpired ) {
      await User.updateOne(
        { userID: userId },
        {
          planId: "free",
          planVersion: 1,
          subscriptDuration: "free",
          planExpiresAt: null,
        }
      );
      return NextResponse.json(
        {
          plan: {
            planId: "free",
            planVersion: 1,
            maxConnectionsAllowed: FREE_CONNECTIONS_ALLOWED,
            maxTimersAllowed: FREE_TIMERS_ALLOWED,
            customLogoAndTitleEnabled: false,
            customBgEnabled: false,
            subscriptDuration: "free",
          },
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        plan: plan
          ? {
              planId: plan.planId,
              planVersion: user.planVersion,
              maxConnectionsAllowed: plan.maxConnectionsAllowed,
              maxTimersAllowed: plan.maxTimersAllowed,
              customLogoAndTitleEnabled: plan.customLogoAndTitleEnabled,
              customBgEnabled: plan.customBgEnabled,
              subscriptDuration: plan.subscriptDuration,
            }
          : {
              planId: "free",
              planVersion: 1,
              maxConnectionsAllowed: FREE_CONNECTIONS_ALLOWED,
              maxTimersAllowed: FREE_TIMERS_ALLOWED,
              customLogoAndTitleEnabled: false,
              customBgEnabled: false,
              subscriptDuration: "free",
            },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return NextResponse.json({ error: "Failed to fetch plan" }, { status: 500 });
  }
}