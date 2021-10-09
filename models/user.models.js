import { Schema } from "mongoose";
import { hashSync, compareSync } from "bcrypt-nodejs";
import { v4 as uuidv4 } from "uuid";

const UserSchema = new Schema(
  {
    email: { 
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: { 
    type:String,
    required: true,
    trim: true
  },
  role:{ 
    type: String,
    required: true,
    enum:["client","admin"]
  }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let User = db.model("User", UserSchema);
