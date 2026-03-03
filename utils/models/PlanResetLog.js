import mongoose from "mongoose";

const planResetLogSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    /** Timer for which the reset was triggered (e.g. viewer limit exceeded on this timer) */
    timerId: {
      type: String,
      default: null,
      index: true,
    },
    timerName: {
      type: String,
      default: null,
    },
    previousPlanId: {
      type: String,
      default: null,
    },
    previousPlanExpiresAt: {
      type: Date,
      default: null,
    },
    previousPlanVersion: {
      type: Number,
      default: null,
    },
    /** Free-form object for future use (e.g. roomSize, source, campaign) */
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.PlanResetLog || mongoose.model("PlanResetLog", planResetLogSchema);
