import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import User from "@/utils/models/User";
import { connectToDatabase } from "@/utils/db";
import { dodoClient } from "@/app/lib/dodoPayments";

export async function POST(request) {
  const { userId, isAuthenticated } = await auth();
  const currentUserInfo = await currentUser();
  const userEmail = currentUserInfo?.primaryEmailAddress?.emailAddress ?? null;

  try {
    if (!userId || !isAuthenticated) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in", error: true },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const userDetails = await User.findOne({ userID: userId }).select("planExpiresAt");
    const planExpiresAt = new Date(userDetails?.planExpiresAt);
    const currentDate = new Date();

    const subscriptionHasExpired = planExpiresAt <= currentDate;
    if (!subscriptionHasExpired) {
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

    const { amount, planId, userCountry, user, subscriptionPlan, subscriptDuration } = await request.json();
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { message: "Amount must be a positive number", error: true },
        { status: 400 }
      );
    }

    // Fetch and match product
    const productList = await dodoClient.products.list();
    const selectedPlan = productList?.items?.find(
      (plan) => plan?.name?.toString()?.toLowerCase() === planId?.toString()?.toLowerCase()
    );

    if (!selectedPlan) {
      return NextResponse.json(
        { message: "Invalid planId", error: true },
        { status: 400 }
      );
    }

    const { product_id } = selectedPlan;

    const defaultBilling = {
      IN: {
        city: "Mumbai",
        country: "IN",
        state: "Maharashtra",
        street: "123, Main Street",
        zipcode: "400001",
      },
      US: {
        city: "New York",
        country: "US",
        state: "New York",
        street: "123, Main Street",
        zipcode: "10001",
      },
    };

    const country = userCountry === "IN" ? "IN" : "US";
    const billing = defaultBilling[country];

    // ✅ New: using unified checkout sessions API (one-time payment — no subscription_data)
    const checkoutSession = await dodoClient.checkoutSessions.create({
      product_cart: [
        {
          product_id: product_id,
          quantity: 1,
        },
      ],
      customer: {
        email: user.email,
        name: user.name,
      },
      // billing_address: billing,
      metadata: {
        userId: userId,
        planId: subscriptionPlan,
        subscriptDuration: subscriptDuration,
      },
      return_url: process.env.DODO_PAYMENTS_RETURN_URL,
    });

    return NextResponse.json(
      {
        message: "success",
        checkoutUrl: checkoutSession.checkout_url,  // ✅ was: payment_link
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/dodopayment/oneTime:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: true },
      { status: 500 }
    );
  }
}