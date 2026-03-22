import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import OpenAI from "openai";

ffmpeg.setFfmpegPath(ffmpegPath);

const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

export const extractAudioFromVideo = (videoPath) => {
  return new Promise((resolve, reject) => {
    const audioPath = videoPath.replace(path.extname(videoPath), ".mp3");

    ffmpeg(videoPath)
      .noVideo()
      .audioCodec("libmp3lame")
      .save(audioPath)
      .on("end", () => resolve(audioPath))
      .on("error", (err) => reject(err));
  });
};

export const transcribeAudio = async (audioPath) => {
  const client = getOpenAIClient();
  if (!client) throw new Error("OPENAI_API_KEY is missing in .env");

  const transcription = await client.audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model: "whisper-1",  // ✅ fixed
  });

  return transcription.text || "";
};

export const generateSummaryFromTranscript = async (transcript, lectureTitle, subject) => {
  const client = getOpenAIClient();
  if (!client) throw new Error("OPENAI_API_KEY is missing in .env");

  const prompt = `...`; // same as before

  const response = await client.chat.completions.create({  // ✅ fixed
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0]?.message?.content || "";
};