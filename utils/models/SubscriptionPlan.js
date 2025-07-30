import mongoose from "mongoose";

const SubscriptionPlanSchema = new mongoose.Schema({
  planId: {
    type: String,
    required: [true, "planId is required"],
    trim: true,
    enum: ["free", "pro", "singleEvent"], // Matches pricingConfig and PaymentPage
  },
  subscriptDuration: {
    type: String,
    required: [true, "Subscription duration is required"],
    trim: true,
    enum: ["free", "monthly", "singleEvent"], // Removed "annually" to match pricingConfig
    default: "free",
  },
  version: {
    type: Number,
    required: [true, "Version is required"],
    default: 1,
  },
  amount: {
    type: Number,
    required: [true, "Plan amount is required"],
  },
  description: {
    type: String,
    required: [true, "Plan description is required"],
  },
  features: {
    type: [String],
    required: [true, "Plan features are required"],
  },
  maxConnectionsAllowed: {
    type: Number,
    required: [true, "Max connections allowed is required"],
  },
  maxTimersAllowed: {
    type: Number,
    required: [true, "Max timers allowed is required"],
  },
  customLogoAndTitleEnabled: {
    type: Boolean,
    required: [true, "Custom logo and title enabled is required"],
  },
  customBgEnabled: {
    type: Boolean,
    required: [true, "Custom background enabled is required"],
  },
  popular: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Ensure unique planId and version combination
SubscriptionPlanSchema.index({ planId: 1, version: 1 }, { unique: true });

export default mongoose.models.SubscriptionPlan || mongoose.model("SubscriptionPlan", SubscriptionPlanSchema);