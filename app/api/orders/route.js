import { NextResponse } from "next/server";
import Order from "@/utils/models/Order";
import PaymentLog from "@/utils/models/PaymentLog";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/utils/db";

export async function GET() {
  const { userId, isAuthenticated } = await auth();
  const currentUserInfo = await currentUser();
  const userEmail =
    currentUserInfo?.primaryEmailAddress?.emailAddress ?? null;
  
    try {
    // Check authentication
    if (!userId || !isAuthenticated) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in", error: true },
        { status: 401 }
      );
    }
    // if (!userEmail) {
    //   return NextResponse.json(
    //     { message: "Can not find email Id", error: true },
    //     { status: 401 }
    //   );
    // }
    // Fetch orders
    await connectToDatabase();
    const orders = await Order.find({ userID: userId }).sort({ createdAt: -1 });

    // Log event
    await logEvent(userId, userEmail, "order_history_viewed", {
      orderCount: orders.length,
    });

    return NextResponse.json({ orders, error: false });
  } catch (error) {
    console.error("Error fetching orders:", error);
    await logEvent(userId, userEmail, "error", {
      message: "Failed to fetch orders",
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { message: "Error fetching orders", error: true },
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