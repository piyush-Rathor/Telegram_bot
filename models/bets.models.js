import mongoose from "mongoose";
import { betPrice } from "../configs/constants.js";

const Schema = mongoose.Schema;

const usersBetSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    matches: [
      {
        matchId: {
          type: String,
          required: true,
          trim: true,
          index: true,
        },
        dateandTime: {
          type: Date,
          required: true,
          trim: true,
        },
        betPrice: {
          type: Number,
          enum: betPrice,
        },
        status: {
          type: String,
          enum: ["INICIATE"],
          default: "INICIATE",
        },
        opponentId: {
          type: Schema.Types.ObjectId,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const UserBets = mongoose.model("usersBet", usersBetSchema);
