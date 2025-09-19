import mongoose from "mongoose";

const subscriptionLogSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: [true, "User ID is required"],
  },
  primaryEmail: {
    type: String,
    required: [true, "Email is required"],
  },
  planId: {
    type: String,
    required: [true, "Plan ID is required in subscriptionLog schema"],
    enum: ["free", "pro", "singleEvent"],
  },
  planVersion: {
    type: Number,
    required: [true, "Plan version is required in subscriptionLog schema"],
  },
  subscriptDuration: {
    type: String,
    default: "free"
  },
  amount: {
    type: Number,
    required: [true, "Plan amount is required in subscriptionLog schema"],
  },
  description: {
    type: String,
    required: [true, "Plan description is required in subscriptionLog schema"],
  },
  features: {
    type: [String],
    required: [true, "Plan features are required in subscriptionLog schema"],
  },
  maxConnectionsAllowed: {
    type: Number,
    required: [true, "Max connections allowed is required in subscriptionLog schema"],
  },
  maxTimersAllowed: {
    type: Number,
    required: [true, "Max timers allowed is required in subscriptionLog schema"],
  },
  customLogoAndTitleEnabled: {
    type: Boolean,
    required: [true, "Custom logo and title enabled is required in subscriptionLog schema"],
  },
  customBgEnabled: {
    type: Boolean,
    required: [true, "Custom background enabled is required in subscriptionLog schema"],
  },
  popular: {
    type: Boolean,
    default: false,
  },
  planActivatedAt: {
    type: Date,
    required: [true, "Plan activation date is required in subscriptionLog schema"],
  },
  planExpiresAt: {
    type: Date,
    required: [true, "Plan expiration date is required in subscriptionLog schema"],
  },
}, { timestamps: true });

export default mongoose.models.SubscriptionLog || mongoose.model("SubscriptionLog", subscriptionLogSchema);