import Result from "../Models/resultModels.js";

// @desc Create new student result
export const addResult = async (req, res) => {
  try {
    const { rollNo, name, className, semester, subjects } = req.body;

    if (!rollNo || !name || !className || !subjects) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0);
    const totalMax = subjects.reduce((sum, s) => sum + s.maxMarks, 0);
    const percentage = totalMax ? (totalMarks / totalMax) * 100 : 0;

    const newResult = await Result.create({
      rollNo,
      name,
      className,
      semester,
      subjects,
      percentage,
    });

    res.status(201).json(newResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc Get all student results
export const getAllResults = async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch results" });
  }
};

// @desc Get single student result by rollNo
export const getResultByRollNo = async (req, res) => {
  try {
    const result = await Result.findOne({ rollNo: req.params.rollNo });
    if (!result) return res.status(404).json({ message: "Result not found" });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching result" });
  }
};

// @desc Delete student result
export const deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Result not found" });
    res.json({ message: "Result deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting result" });
  }
};
