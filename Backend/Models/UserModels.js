

// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     phone: { type: String, required: true },
//     gender: { type: String, required: true },

//     // ✅ Support multiple departments and positions
//     departments: [{ type: String }],
//     positions: [{ type: String }],

//     joinDate: { type: Date, required: true },
//     password: { type: String, required: true },
//    isBlocked: { type: Boolean, default: false }, // ✅ for blocking user
//   },
//   { timestamps: true }
// );

// const User = mongoose.models.User || mongoose.model("User", userSchema);
// export default User;



import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // From first schema
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePic: { type: String },
    status: { type: String, default: "Offline" },
    chatCode: { type: String },
    about: { type: String },
    phone: { type: String, required: true },
    
    // From second schema
    gender: { type: String, required: true },
    departments: [{ type: String }],
    positions: [{ type: String }],
    joinDate: { type: Date, required: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
