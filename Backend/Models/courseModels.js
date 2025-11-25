import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  // Keep a numeric `id` field for compatibility with your frontend (which used Date.now())
  id: { type: Number, required: true, unique: false },
  name: { type: String, required: true },
  credits: { type: Number, required: true }
}, { _id: true }); // keep mongoose _id too

const SemesterSchema = new mongoose.Schema({
  semester: { type: Number, required: true },
  subjects: { type: [SubjectSchema], default: [] }
});

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  semesters: { type: [SemesterSchema], default: [] }
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
