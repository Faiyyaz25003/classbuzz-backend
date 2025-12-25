import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    className: String,
    title: String,
    subject: String,
    date: String,
    videoUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("Lecture", lectureSchema);
