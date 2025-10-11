// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import userRoutes from "./Routes/userRoutes.js";


// dotenv.config();
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/users", userRoutes);

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.error("MongoDB connection error:", err));

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import userRoutes from "./Routes/userRoutes.js";
import leaveRoutes from "./Routes/LeaveRoutes.js";

// Import middlewares
import { errorHandler, notFound } from "./Middleware/errorHandler.js";

dotenv.config();
const app = express();

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== Connect MongoDB ======
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ====== Middleware ======
app.use(helmet());
app.use(cors());
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(morgan("dev")); // Log requests

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ====== Routes ======
app.use("/api/users", userRoutes);
app.use("/api/leave", leaveRoutes);

// ====== Health Check ======
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", time: new Date() })
);

// ====== Error Handling ======
app.use(notFound);
app.use(errorHandler);

// ====== Start Server ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
