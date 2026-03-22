import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    lectureTitle: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    youtubeUrl: {
      type: String,
      default: "",
      trim: true,
    },
    videoFile: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lecture", lectureSchema);