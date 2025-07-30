import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/utils/db";
import Order from "@/utils/models/Order";
import PaymentLog from "@/utils/models/PaymentLog";

export async function POST(req) {
  console.log(`Webhook request received from razorpay`);
  try {
    // Read raw body for signature verification
    const rawBody = await req.text();
    // console.log(` Raw body:`, rawBody);
    const signature = req.headers.get("x-razorpay-signature");
    // console.log(` Signature:`, signature);

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!signature || !webhookSecret) {
      // console.log(` Missing signature or secret`);
      await logEvent(null, "error", {
        message: "Missing webhook signature or secret",
        signature,
      });
      return NextResponse.json(
        { message: "Missing webhook signature or secret" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      // console.log(`Invalid webhook signature`);
      await logEvent(null, "error", {
        message: "Invalid webhook signature",
        signature,
        expectedSignature,
      });
      return NextResponse.json(
        { message: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    // Parse body
    const payload = JSON.parse(rawBody);
    // console.log("parsed reqBody")
    // console.log(` Payload:`, JSON.stringify(payload, null, 2));

    const event = payload.event;
    const payment = payload.payload?.payment?.entity || {};

    // Connect to MongoDB
    await connectToDatabase();
    // console.log(` Connected to MongoDB`);

    // Log webhook receipt
    await logEvent(payment.email || null, "webhook_received", { event, payload });
    // console.log(` Logged webhook_received event:`, event);

    // Handle specific events
    switch (event) {
      case "payment.captured":
        // console.log(` Processing payment.captured for order:`, payment.order_id);
        const order = await Order.findOne({ razorpayOrderId: payment.order_id });
        // console.log(` Order found:`, order ? order : "Not found");
        if (order && order.status !== "paid") {
          await Order.findOneAndUpdate(
            { razorpayOrderId: payment.order_id },
            {
              razorpayPaymentId: payment.id,
              status: "paid",
            }
          );
          await logEvent(payment.email || null, "payment_captured", {
            order_id: payment.order_id,
            payment_id: payment.id,
            amount: payment.amount / 100,
          });
          // console.log(` Order updated to paid:`, payment.order_id);
        } else if (!order) {
          await logEvent(payment.email || null, "error", {
            message: "Order not found for webhook",
            order_id: payment.order_id,
          });
          // console.log(` Order not found:`, payment.order_id);
        } else {
          // console.log(` Order already paid:`, payment.order_id);
        }
        break;

      case "payment.failed":
        // console.log(` Processing payment.failed for order:`, payment.order_id);
        await Order.findOneAndUpdate(
          { razorpayOrderId: payment.order_id },
          { status: "failed" }
        );
        await logEvent(payment.email || null, "payment_failed", {
          order_id: payment.order_id,
          payment_id: payment.id,
          error_code: payment.error_code,
          error_description: payment.error_description,
        });
        // console.log(` Order updated to failed:`, payment.order_id);
        break;

      default:
        // console.log(` Unhandled webhook event:`, event);
        await logEvent(null, "webhook_received", { event, payload });
        break;
    }

    // console.log(` Webhook processed successfully`);
    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error(` Webhook error:`, error.message, error.stack);
    await logEvent(null, "error", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { message: "Webhook processing failed", error: true },
      { status: 500 }
    );
  }
}

// Helper function to log events
async function logEvent(userEmail, eventType, details) {
  try {
    await connectToDatabase();
    await PaymentLog.create({
      userEmail: userEmail || "unknown",
      eventType,
      details,
    });
    console.log(` Logged event:`, { userEmail, eventType, details });
  } catch (error) {
    console.error(` Failed to log event:`, error);
  }
}