import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: [true, "userId is required in order"],
      trim: true,
      index: true, // Index for faster queries by userId
    },
    userEmail: {
      type: String,
      required: [true, "User email is required"],
      lowercase: true,
      trim: true,
      index: true, // Index for faster queries by email
    },
    razorpayOrderId: {
      type: String,
      required: [true, "Razorpay order ID is required"],
      unique: true,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      default: "INR",
    },
    receipt: {
      type: String,
      required: [true, "Receipt is required"],
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
