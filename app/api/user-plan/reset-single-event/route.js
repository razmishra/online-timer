import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import User from "@/utils/models/User";
import PlanResetLog from "@/utils/models/PlanResetLog";
import { connectToDatabase } from "@/utils/db";
import { FREE_CONNECTIONS_ALLOWED, FREE_TIMERS_ALLOWED } from "@/app/constants";

/** Reason codes for plan reset — use these when querying logs for support */
export const PLAN_RESET_REASONS = {
  SINGLE_EVENT_VIEWER_LIMIT: "single_event_viewer_limit_exceeded",
  MANUAL: "manual",
  OTHER: "other",
};

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findOne({ userID: userId });
    if (!user) {
      return NextResponse.json({ ok: true, message: "User not found; no-op" });
    }

    if (user.planId === "free") {
      return NextResponse.json({ ok: true, message: "Already on free plan" });
    }

    let body = {};
    try {
      body = await req.json();
    } catch {
      // No body or invalid JSON — use default reason
    }
    const reason = body?.reason ?? PLAN_RESET_REASONS?.SINGLE_EVENT_VIEWER_LIMIT;
    const timerId = body?.timerId ?? null;

    await PlanResetLog.create({
      userID: userId,
      reason,
      timerId: timerId ?? null,
      previousPlanId: user?.planId,
      previousPlanExpiresAt: user?.planExpiresAt ?? null,
      previousPlanVersion: user?.planVersion ?? null,
      metadata: body?.metadata ?? null,
    });

    await User.updateOne(
      { userID: userId },
      {
        planId: "free",
        planExpiresAt: null,
      }
    );

    return NextResponse.json({
      ok: true,
      plan: {
        planId: "free",
        planVersion: 1,
        maxConnectionsAllowed: FREE_CONNECTIONS_ALLOWED,
        maxTimersAllowed: FREE_TIMERS_ALLOWED,
        customLogoAndTitleEnabled: false,
        customBgEnabled: false,
        subscriptDuration: "free",
      },
    });
  } catch (error) {
    console.error("Error resetting single-event plan:", error);
    return NextResponse.json(
      { error: "Failed to reset plan" },
      { status: 500 }
    );
  }
}
