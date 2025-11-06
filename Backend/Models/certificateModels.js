import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    studentName: { type: String, required: true },
    class: { type: String },
    rollNo: { type: String },
    issuedBy: { type: String },
    date: { type: String },
    remarks: { type: String },
    signature: { type: String },
    medalColor: { type: String, default: "gold" },
  },
  { timestamps: true }
);

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;
