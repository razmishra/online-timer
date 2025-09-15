
import { NextResponse } from "next/server";
import crypto from "crypto";
import Order from "@/utils/models/Order";
import PaymentLog from "@/utils/models/PaymentLog";
import SubscriptionPlan from "@/utils/models/SubscriptionPlan";
import User from "@/utils/models/User";
import SubscriptionLog from "@/utils/models/SubscriptionLog";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/utils/db";
import { calculateExpirationDate } from "@/helper/dateHelper";

export async function POST(req) {
  const { userId, isAuthenticated } = await auth();
  const currentUserInfo = await currentUser();
  const userEmail = currentUserInfo?.primaryEmailAddress?.emailAddress ?? null;

  try {
    if (!userId || !isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized: Please log in", error: true }, { status: 401 });
    }

    if (!userEmail) {
      return NextResponse.json({ message: "Can not find email Id", error: true }, { status: 401 });
    }

    await connectToDatabase();
    const userDetails = await User.findOne({ userID: userId }).select("planExpiresAt");
    if (!userDetails) {
      return NextResponse.json(
        { message: "Can not find your details, Please login again", error: true },
        { status: 400 }
      );
    }

    // Check if the subscription has expired
    const planExpiresAt = new Date(userDetails.planExpiresAt);
    const currentDate = new Date();
    const subscriptionExpired = planExpiresAt <= currentDate;

    if (!subscriptionExpired) {
      return NextResponse.json(
        { message: "You have a valid subscription", error: true },
        { status: 400 }
      );
    }

    // Validate input
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, subscriptionPlan, subscriptDuration } = await req.json();
    
    // console.log(subscriptDuration," --duration in api")
    // console.log(subscriptionPlan," --plan in api")
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      await logEvent(userId, userEmail, "error", {
        message: "Missing required payment details",
        razorpayOrderId,
        razorpayPaymentId,
      });
      return NextResponse.json(
        { message: "Missing required payment details", error: true },
        { status: 400 }
      );
    }

    // Verify signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      await logEvent(userId, userEmail, "error", {
        message: "Invalid payment signature",
        razorpayOrderId,
        razorpayPaymentId,
      });
      return NextResponse.json(
        { message: "Invalid payment signature", error: true },
        { status: 400 }
      );
    }

    // Update order in MongoDB
    await connectToDatabase();
    const order = await Order.findOneAndUpdate(
      { razorpayOrderId },
      { razorpayPaymentId, status: "paid" },
      { new: true }
    );

    if (!order) {
      await logEvent(userId, userEmail, "error", {
        message: "Order not found or does not belong to user",
        razorpayOrderId,
      });
      return NextResponse.json(
        { message: "Order not found or unauthorized", error: true },
        { status: 404 }
      );
    }

    // Fetch the plan details from SubscriptionPlan
    const plan = await SubscriptionPlan.findOne({ planId: subscriptionPlan, subscriptDuration }).sort({ version: -1 });
    if (!plan) {
      await logEvent(userId, userEmail, "error", {
        message: "Plan not found",
        subscriptionPlan,
        subscriptDuration,
      });
      return NextResponse.json(
        { message: "Plan not found", error: true },
        { status: 404 }
      );
    }

    // Calculate expiration date
    const planExpiresAtDate = calculateExpirationDate({ subscriptDuration });

    // Update user with minimal plan details
    await User.findOneAndUpdate(
      { userID: userId },
      {
        planId: subscriptionPlan,
        planVersion: plan?.version,
        subscriptDuration,
        planActivatedAt: new Date(),
        planExpiresAt: planExpiresAtDate,
      },
      { new: true }
    );

    // Log full plan details in SubscriptionLog
    await SubscriptionLog.create({
      userID: userId,
      primaryEmail: userEmail,
      planId: subscriptionPlan,
      planVersion: plan?.version,
      subscriptDuration,
      amount: plan?.amount,
      description: plan?.description,
      features: plan?.features,
      maxConnectionsAllowed: plan?.maxConnectionsAllowed,
      maxTimersAllowed: plan?.maxTimersAllowed,
      customLogoAndTitleEnabled: plan?.customLogoAndTitleEnabled,
      customBgEnabled: plan?.customBgEnabled,
      popular: plan?.popular,
      planActivatedAt: new Date(),
      planExpiresAt: planExpiresAtDate,
    });

    // Log success
    await logEvent(userId, userEmail, "payment_captured", {
      order_id: razorpayOrderId,
      payment_id: razorpayPaymentId,
      amount: order.amount,
      subscriptionPlan,
      subscriptDuration,
    });

    return NextResponse.json(
      {
        message: "Payment verified successfully",
        error: false,
        plan: {
          planId: subscriptionPlan,
          planVersion: plan.version,
          maxConnectionsAllowed: plan.maxConnectionsAllowed,
          maxTimersAllowed: plan.maxTimersAllowed,
          customLogoAndTitleEnabled: plan.customLogoAndTitleEnabled,
          customBgEnabled: plan.customBgEnabled,
          subscriptDuration,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    await logEvent(userId, userEmail, "error", {
      message: "Failed to verify payment",
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { message: "Error verifying payment", error: true },
      { status: 500 }
    );
  }
}

// Helper function to log events
async function logEvent(userId, userEmail, eventType, details) {
  try {
    await connectToDatabase();
    await PaymentLog.create({
      userID: userId || "unknown",
      userEmail: userEmail || "unknown",
      eventType,
      details,
    });
  } catch (error) {
    console.error("Failed to log event:", error);
  }
}