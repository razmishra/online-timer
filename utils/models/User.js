import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: [true, "UserID is required"],
      trim: true,
      unique: true,
    },
    firstName: {
      type: String,
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      lowercase: true,
      trim: true,
    },
    primaryEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    planId: {
      type: String,
      required: [true, "Plan ID is required in userShema"],
      trim: true,
      default: "free",
    },
    planVersion: {
      type: Number,
      required: [true, "Plan version is required"],
      default: 1,
    },
    planActivatedAt: {
      type: Date,
      default: null,
    },
    planExpiresAt: {
      type: Date,
      default: null,
    },
    subscriptionId:{
      type: String,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
