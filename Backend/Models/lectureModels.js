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
    transcript: {
      type: String,
      default: "",
    },
    summaryGeneratedByAI: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Lecture =
  mongoose.models.Lecture || mongoose.model("Lecture", lectureSchema);

export default Lecture;