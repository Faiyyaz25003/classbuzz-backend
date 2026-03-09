import mongoose from "mongoose";

const issuedBookSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    bookName: String,
    category: String,
    color: String,
    bg: String,
    file: String,

    studentName: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    issueDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "expiring", "expired", "returned"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("IssuedBook", issuedBookSchema);