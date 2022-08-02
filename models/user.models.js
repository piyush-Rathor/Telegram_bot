import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    telegramId: {
      type: Number,
      required: true,
      trim: true,
      index: true,
    },
    isConsent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = mongoose.model("user", userSchema);
