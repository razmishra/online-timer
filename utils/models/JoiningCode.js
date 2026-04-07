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
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.JoiningCode ||
  mongoose.model("JoiningCode", JoiningCodeSchema);
