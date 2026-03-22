import fs from "fs";
import Lecture from "../Models/lectureModels.js";
import {
  extractAudioFromVideo,
  transcribeAudio,
  generateSummaryFromTranscript,
} from "../Services/aiSummaryService.js";

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

    console.log("BODY DATA:", req.body);
    console.log("FILE DATA:", req.file);

    let videoFilePath = req.file ? req.file.path : "";
    let finalSummary = summary || "";
    let transcript = "";
    let summaryGeneratedByAI = false;

    if (videoFilePath && process.env.OPENAI_API_KEY) {
      try {
        console.log("Step 1: Extracting audio from video...");
        const audioPath = await extractAudioFromVideo(videoFilePath);
        console.log("Audio extracted:", audioPath);

        console.log("Step 2: Transcribing audio...");
        transcript = await transcribeAudio(audioPath);
        console.log("Transcript:", transcript);

        if (transcript && transcript.trim()) {
          console.log("Step 3: Generating summary...");
          finalSummary = await generateSummaryFromTranscript(
            transcript,
            lectureTitle,
            subject
          );
          summaryGeneratedByAI = true;
          console.log("Generated Summary:", finalSummary);
        } else {
          console.log("Transcript empty mila");
        }

        if (fs.existsSync(audioPath)) {
          fs.unlinkSync(audioPath);
        }
      } catch (aiError) {
        console.error("AI processing error:", aiError);
      }
    } else {
      console.log("AI skipped: No video or OPENAI_API_KEY missing");
    }

    const lecture = await Lecture.create({
      department,
      semester,
      subject,
      lectureTitle,
      date,
      youtubeUrl,
      videoFile: videoFilePath,
      summary: finalSummary,
      transcript,
      summaryGeneratedByAI,
    });

    console.log("Saved Lecture:", lecture);

    res.status(201).json({
      success: true,
      message: "Lecture added successfully",
      lecture,
    });
  } catch (error) {
    console.error("Add lecture error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
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
    console.error("Get lectures error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
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

    if (lecture.videoFile && fs.existsSync(lecture.videoFile)) {
      fs.unlinkSync(lecture.videoFile);
    }

    await Lecture.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    console.error("Delete lecture error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};