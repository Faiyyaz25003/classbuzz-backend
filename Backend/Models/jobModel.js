import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    location: String,
    mode: String,
    type: String,
    salary: String,
    skills: String,
    courses: String,
    cgpa: String,
    openings: Number,
    deadline: String,
    selection: String,
    email: String,
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);