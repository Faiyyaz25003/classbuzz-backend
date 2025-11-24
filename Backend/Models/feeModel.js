
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
    paymentMethod: {
      type: String,
      enum: ["Cash", "Online", "Cheque"],
      required: true,
    },
    paymentName: {
     type: String,
     validate: {
    validator: function (val) {
      if (["Online", "Cheque"].includes(this.paymentMethod)) {
        return !!val; // must be present
      }
      return true;
    },
    message: "Transaction / Cheque ID is required for this payment method",
  },
},
    feeDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Fee", feeSchema);
