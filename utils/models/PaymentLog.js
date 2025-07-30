import mongoose from "mongoose";

const PaymentLogSchema = new mongoose.Schema(
  {
    userID:{
      type:String,
      default:null
    },
    userEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    eventType: {
      type: String,
      enum: [
        "order_created",
        "payment_captured",
        "payment_failed",
        "webhook_received",
        "error",
        "order_history_viewed"
      ],
    },
    details: {
      type: mongoose.Schema.Types.Mixed, // Flexible field for event data
      required: [true, "Details are required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PaymentLog ||
  mongoose.model("PaymentLog", PaymentLogSchema);
