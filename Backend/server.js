

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import initializeWebSocket from "./socket/index.js";

// ============= Routes =============
import userRoutes from "./Routes/userRoutes.js"
import messageRoutes from "./Routes/messageRoutes.js";
import leaveRoutes from "./routes/LeaveRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import documentRoutes from "./Routes/documentRoutes.js"; // ✅ Document Upload
import feeRoutes from "./routes/feeRoutes.js";
import taskRoutes from "./Routes/taskRoutes.js";
import eventRoutes from "./Routes/eventRoutes.js";
import meetingRoutes from "./Routes/meetingRoutes.js";
import certificateRoutes from "./Routes/certificateRoutes.js";
import resultRoutes from "./Routes/resultRoutes.js";
import courseRoutes from "./Routes/courseRoutes.js";
import scheduleRoutes from "./Routes/scheduleRoutes.js";
import lectureRoutes from "./Routes/lectureRoutes.js";

dotenv.config();

// ============= App & Middleware =============
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman/same-origin
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: This origin is not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============= Static Folder (for uploads) =============
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // ✅ KYC / Documents Folder

// ============= MongoDB Connection =============
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/school_documents";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ============= All API Routes =============
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/documents", documentRoutes); // ✅ Student Document Upload API
app.use("/api/fees", feeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/result", resultRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/lectures", lectureRoutes);

// ============= Default Route =============
app.get("/", (req, res) =>
  res.send("✅ School Management Server running successfully...")
);

// ============= WebSocket + Server =============
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = initializeWebSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server running with WebSocket on port ${PORT}`);
});

export { io };
