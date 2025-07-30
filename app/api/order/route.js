import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { v4 as uuid } from "uuid";
import Order from "@/utils/models/Order";
import PaymentLog from "@/utils/models/PaymentLog";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/utils/db";
import User from "@/utils/models/User";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  // Check authentication
  const { userId, isAuthenticated } = await auth();
  const currentUserInfo = await currentUser();
  const userEmail =
  currentUserInfo?.primaryEmailAddress?.emailAddress ?? null;
  
  try {
    if (!userId || !isAuthenticated) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in", error: true },
        { status: 401 }
      );
    }

    const userDetails = await User.findOne({userID: userId}).select('planExpiresAt');
    // console.log(userDetails," --userDetails")
    const planExpiresAt = new Date(userDetails?.planExpiresAt);
    const currentDate = new Date();

    // Check if the subscription has expired
    const subscriptionExpired = planExpiresAt <= currentDate;

    if(!subscriptionExpired){
      return NextResponse.json(
        { message: "You already have an ongoing subscription", error: true },
        { status: 400 }
      );
    }

    if (!userEmail) {
      return NextResponse.json(
        { message: "Can not find email Id", error: true },
        { status: 401 }
      );
    }
    // const userEmail = user.primaryEmailAddress.emailAddress;
    // const userEmail = "hello@gmail.com";

    // Validate input
    const { amount } = await request.json();
    if (!amount || typeof amount !== "number" || amount <= 0) {
      await logEvent(userId, userEmail, "error", {
        message: "Invalid amount",
        amount,
      });
      return NextResponse.json(
        { message: "Amount must be a positive number", error: true },
        { status: 400 }
      );
    }

    // Create order
    const options = {
      amount: amount * 100, // Convert to paisa
      currency: "INR",
      receipt: uuid(),
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    // Save to MongoDB
    await connectToDatabase();
    await Order.create({
      userID: userId,
      userEmail,
      razorpayOrderId: order.id,
      amount: amount,
      currency: order.currency,
      receipt: options.receipt,
      status: "created",
    });

    // Log event
    await logEvent(userId, userEmail, "order_created", {
      order_id: order.id,
      amount: amount,
      receipt: options.receipt,
    });

    return NextResponse.json({
      message: "success",
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    await logEvent(userId, userEmail, "error", {
      message: "Failed to create order",
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { message: "Error creating order", error: true },
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
