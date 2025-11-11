

import User from "../Models/UserModels.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ===================== Basic User Operations =====================

// 🔹 Get all users (simple)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-__v");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Create user (simple)
export const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===================== Advanced User Management =====================

// 🔹 Register new user with auto-generated password + email notification
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, gender, departments, positions, joinDate } = req.body;

    // 1️⃣ Validate Input
    if (!name || !email || !phone || !gender || !joinDate) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    // 2️⃣ Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "This email is already registered." });
    }

    // 3️⃣ Generate and hash password
    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // 4️⃣ Create new user in database
    const user = new User({
      name,
      email,
      phone,
      gender,
      departments,
      positions,
      joinDate,
      password: hashedPassword,
    });

    await user.save();

    // 5️⃣ Setup Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your gmail address
        pass: process.env.EMAIL_PASS, // your app password
      },
    });

    // 6️⃣ Email Template (HTML)
    const mailOptions = {
      from: `"ClassBuzz" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Welcome to ClassBuzz - Your Account Credentials",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 3px 6px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #4f46e5, #6366f1); color: white; padding: 20px; text-align: center;">
              <h1>Welcome to ClassBuzz 🎓</h1>
              <p>Your account has been successfully created!</p>
            </div>
            <div style="padding: 20px;">
              <h2>Hello, ${name} 👋</h2>
              <p>Here are your login credentials:</p>
              <ul style="list-style: none; padding-left: 0; font-size: 16px;">
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Password:</strong> ${generatedPassword}</li>
                <li><strong>Departments:</strong> ${departments?.join(", ") || "N/A"}</li>
                <li><strong>Positions:</strong> ${positions?.join(", ") || "N/A"}</li>
              </ul>
              <p style="margin-top: 15px;">🔒 Please change your password after logging in for better security.</p>
              <p style="margin-top: 20px;">Thank you for joining <b>ClassBuzz</b>!</p>
            </div>
          </div>
        </div>
      `,
    };

    // 7️⃣ Send Email
    await transporter.sendMail(mailOptions);

    // 8️⃣ Respond to frontend
    res.status(201).json({
      message: `✅ User registered successfully. Credentials sent to ${email}.`,
      user,
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({
      message: "Server error during registration.",
      error: error.message,
    });
  }
};

// 🔹 Get all users (detailed version with sorting)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};



// 🔹 User login with JWT token generation
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ Check if blocked
    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked by admin" });
    }

    // 3️⃣ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    // 4️⃣ Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: "user" }, // payload
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // token valid for 7 days
    );

    // 5️⃣ Send success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token, // send token to frontend
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        positions: user.positions,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};


// 🔹 Get current logged-in user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Update user details
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// 🔹 Block or Unblock a user
export const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked; // Toggle block/unblock
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBlocked
        ? "User has been blocked"
        : "User has been unblocked",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling user block", error });
  }
};


// ✅ Get current user using token
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};