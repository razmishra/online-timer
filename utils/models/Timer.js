import mongoose from "mongoose";

const timerSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ownerId: {
      type: String,
      required: true,
      index: true,
    },
    name: { type: String, default: "" },
    duration: { type: Number, required: true },
    originalDuration: { type: Number, required: true },
    maxConnectionsAllowed: { type: Number, required: true },
    maxTimersAllowed: { type: Number, required: true },
    message: { type: String, default: "" },
    joiningCode: { type: String, default: "" },
    backgroundColor: { type: String, default: "#1f2937" },
    textColor: { type: String, default: "#ffffff" },
    fontSize: { type: String, default: "text-6xl" },
    timerView: { type: String, default: "normal" },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Timer || mongoose.model("Timer", timerSchema);
