import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema(
  {
    teacher: { type: String },
    department: { type: String },

    className: {
      type: String,
      required: true,
    },

    docName: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Folder", FolderSchema);