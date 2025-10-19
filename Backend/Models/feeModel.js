import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    installment: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Paid",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Fee", feeSchema);
