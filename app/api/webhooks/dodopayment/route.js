import { Webhook } from "standardwebhooks";
import { headers } from "next/headers";

import DodopaymentLog from "@/utils/models/DodoPaymentLog";
import DodosubscriptionLog from "@/utils/models/DodosubscriptionLog";
import User from "@/utils/models/User";
import { calculateExpirationDate } from "@/helper/dateHelper";
import { connectToDatabase } from "@/utils/db";
import DodoPayments from "dodopayments";


const dodoClient = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY, // This is the default and can be omitted
  environment: process.env.DODO_PAYMENTS_ENVIRONMENT, // defaults to 'live_mode'
});

const webhook = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_KEY);

export async function POST(request) {
  const headersList = await headers();

  try {
    const rawBody = await request.text();
    const webhookHeaders = {
      "webhook-id": headersList.get("webhook-id") || "",
      "webhook-signature": headersList.get("webhook-signature") || "",
      "webhook-timestamp": headersList.get("webhook-timestamp") || "",
    };

    await webhook.verify(rawBody, webhookHeaders);
    const payload = JSON.parse(rawBody);

    const { payload_type } = payload.data;

    // ----------- SUBSCRIPTION HANDLING -----------
    if (payload_type === "Subscription") {
      
      const subscriptionData = payload.data; // Use the webhook payload data for consistency
      const subscriptionId = subscriptionData.subscription_id;
      const eventType = payload.type;

      const subscription = await dodoClient.subscriptions.retrieve(subscriptionId);

      // Extract user info from metadata
      const metadata = subscriptionData.metadata || {};
      const userId = metadata.userId;
      const planId = metadata.planId;
      const subscriptDuration = metadata.subscriptDuration;
      const customerEmail = subscriptionData.customer.email;

      const subscriptionLog = {
        userID: userId,
        primaryEmail: customerEmail,
        planId: planId,
        planVersion: 1,
        subscriptDuration: subscriptDuration,
        amount: subscriptionData.recurring_pre_tax_amount,
        planActivatedAt: new Date(subscriptionData.previous_billing_date || subscriptionData.created_at),
        planExpiresAt: new Date(subscriptionData.next_billing_date),
        // Dodo-specific fields for reference
        dodoSubscriptionId: subscriptionId,
        dodoStatus: subscriptionData.status,
        productId: subscriptionData.product_id,
        dodoCustomerId: subscriptionData.customer.customer_id,
        metadata: subscriptionData.metadata
      };

      await connectToDatabase();

      switch (eventType) {
        case "subscription.active":
          
          // Create subscription log
          await DodosubscriptionLog.create(subscriptionLog);
          
          // Update user subscription status
          const updates = {
            planId: planId,
            status: 'active',
            activatedAt: new Date(subscriptionData.created_at),
            expiresAt: new Date(subscriptionData.next_billing_date),
            subscriptionId: subscriptionId
          }
          await User.findOneAndUpdate(
            { userID: userId },
            {
              $set: {
                planId: planId,
                planActivatedAt: updates.activatedAt,
                planExpiresAt: updates.expiresAt,
                subscriptionId: updates.subscriptionId
              }
            },
            { new: true,  upsert: true }
          );

          break;

        case "subscription.renewed":
          
          // Create subscription log
          await DodosubscriptionLog.create(subscriptionLog);
          
          // Update user subscription status
          const newUpdates = {
            planId: planId,
            status: 'active',
            activatedAt: new Date(subscriptionData.created_at),
            expiresAt: new Date(subscriptionData.next_billing_date),
          }

          // update the user's planActivatedAt and planExpiresAt
          await User.findOneAndUpdate(
            { userID: userId, subscriptionId: subscriptionId },
            {
              $set: {
                planActivatedAt: newUpdates.activatedAt,
                planExpiresAt: newUpdates.expiresAt,
              }
            },
            { new: true,  upsert: true }
          );

          break;

        case "subscription.failed":
          console.log("📕 subscription.failed received");
          
          // Log the failure
          await DodosubscriptionLog.create({
            ...subscriptionLog,
            status: 'failed',
            failureReason: subscriptionData.error_message || 'Payment failed'
          });
          
          break;

        case "subscription.cancelled":
          console.log("📙 subscription.cancelled received");
          
          // Update subscription log
          await DodosubscriptionLog.findOneAndUpdate(
            { userID: userId, dodoSubscriptionId: subscriptionId },
            {
              $set: {
                planCancelledAt: new Date(subscriptionData.cancelled_at || new Date()),
                status: 'cancelled'
              }
            }
          );
          
          await User.findOneAndUpdate(
            { userID: userId, subscriptionId: subscriptionId },
            {
              $set: {
                planId:"free",
                planActivatedAt: null,
                planExpiresAt: null,
              }
            },
          );
          
          break;

        case "subscription.on_hold":
          console.log("📒 subscription.on_hold received");
          
          await DodosubscriptionLog.create({
            ...subscriptionLog,
            status: 'on_hold'
          });
          
          break;

        default:
          console.log("⚠️ Unhandled subscription event:", eventType);
          break;
      }
    }

    // ----------- PAYMENT HANDLING -----------
    if (payload_type === "Payment") {
      const paymentId = payload.data.payment_id;
      const eventType = payload.type;

      const paymentData = await dodoClient.payments.retrieve(paymentId);

      const paymentLog = {
        payment_id: paymentData.payment_id,
        business_id: paymentData.business_id,
        status: paymentData.status,
        total_amount: paymentData.total_amount,
        currency: paymentData.currency,
        payment_method: paymentData.payment_method,
        customer: {
            customer_id: paymentData.customer.customer_id,
          name: paymentData.customer.name,
          email: paymentData.customer.email,
        },
        product_cart: paymentData.product_cart,
        payment_link: paymentData.payment_link,
        tax: paymentData.tax,
        settlement_amount: paymentData.settlement_amount,
        settlement_tax: paymentData.settlement_tax,
        settlement_currency: paymentData.settlement_currency,
        billing: paymentData.billing,
        card_last_four: paymentData.card_last_four,
        card_issuing_country: paymentData.card_issuing_country,
        card_type: paymentData.card_type,
        card_network: paymentData.card_network,
        digital_products_delivered: paymentData.digital_products_delivered,
        error_message: paymentData.error_message,
        error_code: paymentData.error_code,
        subscription_id: paymentData.subscription_id,
        discount_id: paymentData.discount_id,
        metadata: paymentData.metadata || {},
        created_at: new Date(paymentData.created_at),
      };

      switch (eventType) {
        case "payment.succeeded":
          await DodopaymentLog.create({ ...paymentLog, status: "succeeded" });
          
          // Extract user info from payment data
          const metadata = paymentData.metadata || {};
          const planId = metadata.planId || 'free';
          const subscriptDuration = metadata.subscriptDuration || 'free';
          const userId = metadata.userId || 'free';
          const planExpiresAtDate = calculateExpirationDate({ subscriptDuration });

          // Update user in database
          await User.findOneAndUpdate(
            { userID: userId },
            {
              $set: {
                planId: planId,
                planActivatedAt: new Date(),
                planExpiresAt: planExpiresAtDate
              }
            },
            { new: true, upsert: true } // upsert creates user if doesn't exist
          );

          break;

        case "payment.failed":
          await DodopaymentLog.create({ ...paymentLog, status: "failed" });
          break;

        case "payment.cancelled":
          await DodopaymentLog.create({ ...paymentLog, status: "cancelled" });
          break;

        case "payment.processing":
          await DodopaymentLog.create({ ...paymentLog, status: "processing" });
          break;

        default:
          console.log(`⚠️ Unhandled payment type: ${eventType}`);
          break;
      }
    }

    return Response.json({ message: "Webhook processed successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Webhook verification failed:", error);
    return Response.json({ message: "Webhook verification failed" }, { status: 200 });
  }
}
