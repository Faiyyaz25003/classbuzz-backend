import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true }, 
    name: { type: String, required: true },
    credits: { type: Number, required: true },
  },
  { _id: false }
);

const SemesterSchema = new mongoose.Schema({
  semester: { type: Number, required: true },
  subjects: { type: [SubjectSchema], default: [] },
});

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    semesters: { type: [SemesterSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
