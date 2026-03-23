import jwt from "jsonwebtoken";
import Admin from "../Models/adminModel.js";

export const protectAdmin = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    token = token.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({
        message: "Admin not found",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
      error: error.message,
    });
  }
};