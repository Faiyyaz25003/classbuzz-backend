

// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import http from "http";
// import path from "path";
// import mongoose from "mongoose";
// import { fileURLToPath } from "url";
// import initializeWebSocket from "./socket/index.js";

// // ================== Routes ==================
// import userRoutes from "./Routes/userRoutes.js";
// import messageRoutes from "./Routes/messageRoutes.js";
// import leaveRoutes from "./routes/LeaveRoutes.js";
// import attendanceRoutes from "./routes/attendanceRoutes.js";
// import documentRoutes from "./Routes/documentRoutes.js"; // ✅ KYC Upload
// import feeRoutes from "./routes/feeRoutes.js";
// import taskRoutes from "./Routes/taskRoutes.js";
// import eventRoutes from "./Routes/eventRoutes.js";
// import meetingRoutes from "./Routes/meetingRoutes.js";

// dotenv.config();

// // ================== Express App ==================
// const app = express();

// // ================== Middleware ==================
// const allowedOrigins = [
//   "http://localhost:3000",
//   "http://localhost:3001",
//   "http://localhost:3002",
//   "http://localhost:3003",
//   process.env.CLIENT_URL,
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true); // Allow Postman or same-origin requests
//       if (allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("CORS policy: This origin is not allowed"));
//       }
//     },
//     credentials: true,
//   })
// );

// app.use(express.json());

// // ================== Static Folder for Uploads ==================
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // ✅ For KYC documents

// // ================== MongoDB Connection ==================
// const MONGO_URI =
//   process.env.MONGO_URI || "mongodb://127.0.0.1:27017/kyc-system";

// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("❌ MongoDB Error:", err));

// // ================== Routes ==================
// app.use("/api/users", userRoutes);
// app.use("/api/messages", messageRoutes);
// app.use("/api/leave", leaveRoutes);
// app.use("/api/attendance", attendanceRoutes);
// app.use("/api/documents", documentRoutes); // ✅ Added KYC document API
// app.use("/api/fees", feeRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/events", eventRoutes);
// app.use("/api/meetings", meetingRoutes);

// app.get("/", (req, res) => res.send("✅ Server running successfully..."));

// // ================== Server & WebSocket Setup ==================
// const PORT = process.env.PORT || 5000;
// const server = http.createServer(app);
// const io = initializeWebSocket(server);

// // ================== Start Server ==================
// server.listen(PORT, () =>
//   console.log(`🚀 Server running with WebSocket on port ${PORT}`)
// );

// // Export io for use in other files
// export { io };


// ================== Imports ==================
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import initializeWebSocket from "./socket/index.js";

// ================== Routes ==================
import userRoutes from "./Routes/userRoutes.js";
import messageRoutes from "./Routes/messageRoutes.js";
import leaveRoutes from "./routes/LeaveRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import documentRoutes from "./Routes/documentRoutes.js"; // ✅ KYC Upload
import feeRoutes from "./routes/feeRoutes.js";
import taskRoutes from "./Routes/taskRoutes.js";
import eventRoutes from "./Routes/eventRoutes.js";
import meetingRoutes from "./Routes/meetingRoutes.js";

// ================== Config ==================
dotenv.config();
const app = express();

// ================== Middleware ==================
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
      if (!origin) return callback(null, true); // Allow Postman or same-origin
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

// ================== Static Folder for Uploads ==================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // ✅ Serve uploaded files

// ================== MongoDB Connection ==================
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/kyc-system";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ================== Routes ==================
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/documents", documentRoutes); // ✅ KYC Document API
app.use("/api/fees", feeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/meetings", meetingRoutes);

// Default route
app.get("/", (req, res) => res.send("✅ Server running successfully..."));

// ================== Error Handling ==================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

// ================== Server & WebSocket Setup ==================
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = initializeWebSocket(server);

server.listen(PORT, () =>
  console.log(`🚀 Server running with WebSocket on port ${PORT}`)
);

// Export io for use elsewhere
export { io };
