import mongoose, { type CallbackError, Schema } from "mongoose";

import { hash } from "~/shared/lib/scrypt";

export const UserEntitySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserEntitySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await hash(this.password);
    return next();
  } catch (e) {
    return next(e as CallbackError);
  }
});

export const User = mongoose.model("User", UserEntitySchema);
