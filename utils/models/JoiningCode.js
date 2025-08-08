import mongoose from "mongoose";

const JoiningCodeSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    timerId: { type: String, required: true },
    expiresAt: {
      type: Date,
      expires: "7d",
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.JoiningCode ||
  mongoose.model("JoiningCode", JoiningCodeSchema);
