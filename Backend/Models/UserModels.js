
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePic: { type: String, default: "" },
    status: { type: String, default: "Offline" },
    chatCode: { type: String, default: "" },
    about: { type: String, default: "" },
    phone: { type: String, required: true },

    gender: { type: String, required: true },

    departments: {
      type: [String],
      default: [],
    },

    positions: {
      type: [String],
      default: [],
    },

    joinDate: { type: Date, required: true },

    password: { type: String, required: true },

    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User =
  mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
