import Lecture from "../Models/lectureModels.js";

export const addLecture = async (req, res) => {
  try {
    const lecture = await Lecture.create(req.body);
    res.status(201).json(lecture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find();
    res.json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
