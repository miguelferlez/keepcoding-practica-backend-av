import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: String,
    email: { type: String, trim: true, lowercase: true, unique: true },
    password: String,
  },
  {
    collection: "users",
  }
);

/**
 * Model methods
 */

userSchema.statics.hashPassword = (clearPassword) => {
  return bcrypt.hash(clearPassword, 7);
};

/**
 * User instance methods
 */

userSchema.methods.comparePassword = function (clearPassword) {
  return bcrypt.compare(clearPassword, this.password);
};

const User = model("User", userSchema);

export default User;
