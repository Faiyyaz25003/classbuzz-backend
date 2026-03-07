import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      default: "",
    },

    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
    },

    fileUrl: {
      type: String,
    },

    status: {
      type: String,
      default: "Pending",
    },

    rejectReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", AssignmentSchema);