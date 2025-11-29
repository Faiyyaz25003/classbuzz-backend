
import Result from "../Models/resultModels.js";

// POST - Create Result
export const createResult = async (req, res) => {
  try {
    const { courseId, semester, userId, rollNumber, marks } = req.body;

    const existing = await Result.findOne({ rollNumber, semester, courseId });
    if (existing) {
      return res.status(400).json({ message: "Result already exists!" });
    }

    const newResult = await Result.create({
      courseId,
      semester,
      userId,
      rollNumber,
      marks,
    });

    res.status(201).json(newResult);
  } catch (error) {
    res.status(500).json({ message: "Error creating result", error });
  }
};

// GET Result by Roll Number
export const getResultByRoll = async (req, res) => {
  try {
    const result = await Result.findOne({ rollNumber: req.params.roll })
      .populate("userId", "name email phone")
      .populate("courseId", "name");

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching result", error });
  }
};

// GET ALL Results (Optional)
export const getAllResults = async (req, res) => {
  try {
    const results = await Result.find().populate("userId courseId");
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching results" });
  }
};
