import mongoose from "mongoose";

const subscriptionLogSchema = new mongoose.Schema({
  // Core identification
  userID: {
    type: String,
  },
  primaryEmail: {
    type: String,
  },  
  // Plan information
  planId: {
    type: String,
  },
  planVersion: {
    type: Number,
    default: 1
  },
  subscriptDuration: {
    type: String,
    required: [true, "Subscription duration is required"],
  },
  amount: {
    type: Number,
    required: [true, "Plan amount is required"],
    min: 0
  },
  // Subscription lifecycle
  planActivatedAt: {
    type: Date,
    required: [true, "Plan activation date is required"],
    index: true
  },
  planExpiresAt: {
    type: Date,
    required: [true, "Plan expiration date is required"],
    index: true
  },
  planCancelledAt:{
    type: Date,
    default: null
  },
  // Dodo Payments specific fields
  dodoSubscriptionId: {
    type: String,
    required: [true, "Dodo subscription ID is required"],
  },
  dodoStatus: {
    type: String,
    required: [true, "Dodo status is required"],
  },
  productId: {
    type: String,
    required: true
  },
  dodoCustomerId: {
    type: String,
    required: [true, "Dodo customer ID is required"]
  },
  
  // Status tracking if the subscription got successfully activated or not
  status: {
    type: String,
    enum: ['active', 'cancelled', 'failed', 'on_hold', 'expired'],
    default: 'active'
  },
  failureReason: {
    type: String,
    default: null
  },
  
  // Metadata for debugging
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
}, { 
  timestamps: true,
});

// Static method to get user's current subscription
subscriptionLogSchema.statics.getCurrentSubscription = async function(userID) {
  return this.findOne({
    userID,
    planExpiresAt: { $gt: new Date() },
    status: 'active'
  }).sort({ planActivatedAt: -1 });
};

// Static method to get subscription history
subscriptionLogSchema.statics.getSubscriptionHistory = async function(userID, limit = 10) {
  return this.find({ userID })
    .sort({ planActivatedAt: -1 })
    .limit(limit);
};

export default mongoose.models.DodoSubscriptionLog || 
  mongoose.model("DodoSubscriptionLog", subscriptionLogSchema);