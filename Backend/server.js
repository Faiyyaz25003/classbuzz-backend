import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";  // Agar aapne DB connection config file banaya
import userRoutes from "./Routes/userRoutes.js"  // Example

dotenv.config();
connectDB();  // Connect MongoDB

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
