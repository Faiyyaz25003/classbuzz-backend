
import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    leaveType: { type: String, required: true },
    approver: { type: String, required: true },
    reason: { type: String, required: true },
    attachment: { type: String },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

const Leave = mongoose.model("Leave", leaveSchema);
export default Leave;
