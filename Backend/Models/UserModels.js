

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

const userSchema = new mongoose.Schema(
  {
    // 🧍‍♂️ Basic Information
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },

    // 🏫 Department & Position
    departments: [{ type: String }], // e.g., ["Computer Science", "IT"]
    positions: [{ type: String }],   // e.g., ["Teacher", "HOD"]

    // 📅 Joining Date
    joinDate: { type: Date, required: true },

    // 🔒 Authentication
    password: { type: String, required: true },

    // 🚫 Account Control
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite errors in Next.js / hot reload
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
