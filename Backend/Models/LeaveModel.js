

// import mongoose from "mongoose";

// const leaveSchema = new mongoose.Schema(
//   {
//     userName: { type: String, required: true }, // Added userName
//     fromDate: { type: Date, required: true },
//     toDate: { type: Date, required: true },
//     leaveType: { type: String, required: true },
//     approver: { type: String, required: true },
//     reason: { type: String, required: true },
//     attachment: { type: String }, // file path or URL
//     status: { type: String, default: "Pending" }, // Pending / Approved / Rejected
//   },
//   { timestamps: true }
// );

// const Leave = mongoose.model("Leave", leaveSchema);
// export default Leave;


import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true }, // User's name
    email: { type: String, required: true },    // Added email
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    leaveType: { type: String, required: true },
    approver: { type: String, required: true },
    reason: { type: String, required: true },
    attachment: { type: String }, // file path or URL
    status: { type: String, default: "Pending" }, // Pending / Approved / Rejected
  },
  { timestamps: true }
);

const Leave = mongoose.model("Leave", leaveSchema);
export default Leave;
