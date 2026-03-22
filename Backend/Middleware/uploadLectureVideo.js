import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/lectures";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed"), false);
  }
};

const uploadLectureVideo = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
});

export default uploadLectureVideo;