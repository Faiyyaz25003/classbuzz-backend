import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Book name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    file: {
      type: String,
      required: [true, "File is required"],
    },
    color: {
      type: String,
      default: "#6366f1",
    },
    bg: {
      type: String,
      default: "#eef2ff",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Book", bookSchema);