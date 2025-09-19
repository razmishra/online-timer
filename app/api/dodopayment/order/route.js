import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/utils/db";
import User from "@/utils/models/User";
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
    const subscriptionExpired = planExpiresAt <= currentDate;

    if (!subscriptionExpired) {
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
    const { amount, planId } = await request.json();
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
    // console.log(productList.items, "--productList");
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

    const checkoutSessionResponse = await dodoClient.checkoutSessions.create({
      product_cart: [{ product_id: product_id, quantity: 1 }],
    });
    // console.log(checkoutSessionResponse, " --checkoutSessionResponse");
    const {checkout_url} = checkoutSessionResponse;
    return NextResponse.json({
      message: "success",
      checkoutUrl: checkout_url
    },{
      status: 200
    });
    
  } catch (error) {}
}
