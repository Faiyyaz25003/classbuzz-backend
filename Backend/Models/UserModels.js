

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },

    // ✅ Support multiple departments and positions
    departments: [{ type: String }],
    positions: [{ type: String }],

    joinDate: { type: Date, required: true },
    password: { type: String, required: true },
   isBlocked: { type: Boolean, default: false }, // ✅ for blocking user
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

