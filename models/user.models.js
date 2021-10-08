import { Schema } from "mongoose";
import { hashSync, compareSync } from "bcrypt-nodejs";
import { v4 as uuidv4 } from "uuid";

const UserSchema = new Schema(
  {},
  {
    timestamps: true,
    versionKey: false,
  }
);

let User = db.model("User", UserSchema);
