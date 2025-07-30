import { NextResponse } from "next/server";
import SubscriptionPlan from "@/utils/models/SubscriptionPlan";
import { connectToDatabase } from "@/utils/db";

// this function return all the available subscription plans
export async function GET() {
  try {
    await connectToDatabase();
    const plans = await SubscriptionPlan.aggregate([
      {
        $group: {
          _id: "$planId",
          maxVersion: { $max: "$version" },
          doc: { $last: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$doc" },
      },
      {
        $sort: { planId: 1 },
      },
    ]);
    return NextResponse.json({ plans }, { status: 200 });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}