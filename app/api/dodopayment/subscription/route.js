import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { v4 as uuid } from "uuid";
import Order from "@/utils/models/Order";
import PaymentLog from "@/utils/models/PaymentLog";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/utils/db";
import User from "@/utils/models/User";
import DodoPayments from 'dodopayments';
import { dodoClient } from "@/app/lib/dodoPayments";

export async function POST(request) {
  // check auth
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

    const userDetails = await User.findOne({ userID: userId }).select(
      "planExpiresAt"
    );
    // console.log(userDetails," --userDetails")
    const planExpiresAt = new Date(userDetails?.planExpiresAt);
    const currentDate = new Date();

    // Check if the subscription has expired
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
    // const userEmail = user.primaryEmailAddress.emailAddress;
    // const userEmail = "hello@gmail.com";

    // Validate input
    const { amount, planId, userCountry, user, subscriptionPlan, subscriptDuration } = await request.json();
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

    let productList = await dodoClient.products.list()
    console.log(productList.items, "--productList");
    const selectedPlan = productList?.items?.find(
      (plan) => plan?.name?.toString()?.toLocaleLowerCase() === planId?.toString()?.toLocaleLowerCase()
    );
    // console.log(selectedPlan, "--selectedPlan");
    const { product_id } = selectedPlan;
    if (!selectedPlan) {
      await logEvent(userId, userEmail, "error", {
        message: "Invalid planId",
        planId,
      });
      return NextResponse.json(
        { message: "Invalid planId", error: true },
        { status: 400 }
      );
    }

    const defaultBilling = {
        IN:{
            city: 'Mumbai',
            country: 'IN',
            state: 'Maharashtra',
            street: '123, Main Street',
            zipcode: '400001',
        },
        US: {
            city: 'New York',
            country: 'US',
            state: 'New York',
            street: '123, Main Street',
            zipcode: '10001',
        },
    };

    const country = userCountry==="IN" ? "IN" : 'US';
    const billing = defaultBilling[country];
    const checkoutSessionResponse = await dodoClient.subscriptions.create({
      billing,
      customer: {
        name: user.name,
        email: user.email,
      },
      payment_link: true,
      product_id: product_id,
      quantity:1,
      metadata: {
        userId: userId,
        planId: subscriptionPlan, // this is the planId in the subscriptionplans collection
        subscriptDuration: subscriptDuration, // this is the susubscriptDuration in the subscriptionplans collection
      },
      return_url: process.env.DODO_PAYMENTS_RETURN_URL,
    });
    // console.log(checkoutSessionResponse, " --checkoutSessionResponse");

    return NextResponse.json({
      message: "success",
      checkoutUrl: checkoutSessionResponse.payment_link
    },{
      status: 200
    });
  } catch (error) {
    console.error("Error in /api/dodopayment/oneTime:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: true },
      { status: 500 }
    );
  }
}
