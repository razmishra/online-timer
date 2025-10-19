import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/utils/db";
import User from "@/utils/models/User";
import SubscriptionPlan from "@/utils/models/SubscriptionPlan";
import SubscriptionLog from "@/utils/models/SubscriptionLog";
import DodoPaymentLog from "@/utils/models/DodoPaymentLog";
import Order from "@/utils/models/Order";

export async function GET() {
  try {
    // Check authentication
    const { userId, isAuthenticated } = await auth();
    
    if (!userId || !isAuthenticated) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in", error: true },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Fetch user details
    const user = await User.findOne({ userID: userId });
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found", error: true },
        { status: 404 }
      );
    }

    // Fetch current plan details
    const plan = await SubscriptionPlan.findOne({
      planId: user.planId,
      version: user.planVersion,
    });

    // Calculate days remaining
    let daysRemaining = null;
    let isExpired = false;
    let status = "active";

    if (user.planExpiresAt) {
      const expirationDate = new Date(user.planExpiresAt);
      const currentDate = new Date();
      const timeDiff = expirationDate - currentDate;
      daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      
      if (daysRemaining <= 0) {
        isExpired = true;
        status = "expired";
        daysRemaining = 0;
      }
    }

    // Determine plan type
    let planType = "free";
    if (user.planId === "singleEvent") {
      planType = "one-time";
    } else if (user.planId === "pro") {
      planType = "subscription";
    }

    // Fetch payment history from multiple sources
    const [subscriptionLogs, dodoPaymentLogs, razorpayOrders] = await Promise.all([
      SubscriptionLog.find({ userID: userId }).sort({ createdAt: -1 }).limit(20),
      DodoPaymentLog.find({ "customer.email": user.primaryEmail }).sort({ created_at: -1 }).limit(20),
      Order.find({ userID: userId }).sort({ createdAt: -1 }).limit(20),
    ]);

    // console.log(subscriptionLogs," --subscriptionLogs")
    // console.log(dodoPaymentLogs," --dodoPaymentLogs")
    // console.log(razorpayOrders," --razorpayOrders")
    // Combine and format payment history
    const paymentHistory = [];

    // Add subscription logs
    // subscriptionLogs.forEach((log) => {
    //   paymentHistory.push({
    //     id: log._id,
    //     date: log.planActivatedAt,
    //     amount: log.amount,
    //     currency: "INR",
    //     planName: `${log.planId} - ${log.subscriptDuration}`,
    //     status: "completed",
    //     method: "subscription",
    //     source: "razorpay",
    //   });
    // });

    // Add Dodo payment logs
    dodoPaymentLogs.forEach((log) => {
      paymentHistory.push({
        id: log._id,
        date: log.created_at,
        amount: log.total_amount,
        currency: log.currency || "USD",
        planName: "Payment",
        status: log.status || "pending",
        method: log.payment_method || "unknown",
        source: "dodoPayments",
      });
    });

    // Add Razorpay orders
    // razorpayOrders.forEach((order) => {
    //   paymentHistory.push({
    //     id: order._id,
    //     date: order.createdAt,
    //     amount: order.amount / 100, // Razorpay stores in paise
    //     currency: order.currency,
    //     planName: "Order",
    //     status: order.status,
    //     method: "razorpay",
    //     source: "razorPay",
    //   });
    // });

    // Sort payment history by date (most recent first)
    paymentHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Prepare response
    const subscriptionData = {
      currentPlan: {
        planId: user.planId,
        planName: plan?.planId || user.planId,
        planVersion: user.planVersion,
        description: plan?.description || "",
        features: plan?.features || [],
        maxTimersAllowed: plan?.maxTimersAllowed || 0,
        maxConnectionsAllowed: plan?.maxConnectionsAllowed || 0,
        customLogoAndTitleEnabled: plan?.customLogoAndTitleEnabled || false,
        customBgEnabled: plan?.customBgEnabled || false,
        subscriptDuration: plan?.subscriptDuration || "free",
        amount: plan?.amount || 0,
      },
      subscription: {
        planType,
        status,
        isExpired,
        daysRemaining,
        activatedAt: user.planActivatedAt,
        expiresAt: user.planExpiresAt,
        subscriptionId: user.subscriptionId,
        isActive: user.isActive,
      },
      paymentHistory,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.primaryEmail,
      },
    };

    return NextResponse.json(
      { data: subscriptionData, error: false },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching subscription details:", error);
    return NextResponse.json(
      { message: "Failed to fetch subscription details", error: true },
      { status: 500 }
    );
  }
}

