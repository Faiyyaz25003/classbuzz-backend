import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  marks: { type: Number, required: true },
  maxMarks: { type: Number, default: 100 },
});

const resultSchema = new mongoose.Schema(
  {
    rollNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    className: { type: String, required: true },
    semester: { type: String },
    subjects: [subjectSchema],
    percentage: { type: Number },
  },
  { timestamps: true }
);

const Result = mongoose.model("Result", resultSchema);
export default Result;
