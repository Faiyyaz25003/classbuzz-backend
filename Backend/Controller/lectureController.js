import Lecture from "../Models/lectureModels.js";

export const addLecture = async (req, res) => {
  try {
    const {
      department,
      semester,
      subject,
      lectureTitle,
      date,
      youtubeUrl,
      summary,
    } = req.body;

    const lecture = await Lecture.create({
      department,
      semester,
      subject,
      lectureTitle,
      date,
      youtubeUrl,
      summary,
      videoFile: req.file ? req.file.path : "",
    });

    res.status(201).json({
      success: true,
      message: "Lecture added successfully",
      lecture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      lectures,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteLecture = async (req, res) => {
  try {
    const { id } = req.params;

    const lecture = await Lecture.findById(id);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    await Lecture.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};