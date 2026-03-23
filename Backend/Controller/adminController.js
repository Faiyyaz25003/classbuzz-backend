import Admin from "../Models/adminModel.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ===================== Get All Admins =====================
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
      .select("-password -confirmPassword")
      .sort({ createdAt: -1 });

    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching admins",
      error: error.message,
    });
  }
};

// ===================== Register Admin =====================
export const registerAdmin = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      username,
      role,
      address,
      department,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !username ||
      !address ||
      !department
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const existingAdminByEmail = await Admin.findOne({ email });
    if (existingAdminByEmail) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const existingAdminByUsername = await Admin.findOne({ username });
    if (existingAdminByUsername) {
      return res.status(409).json({
        message: "Username already taken",
      });
    }

    // Auto-generate password
    const generatedPassword = Math.random().toString(36).slice(-8) + "@A1";

    // Hash password
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // Profile image
    let profileImage = "";
    if (req.file) {
      profileImage = `uploads/${req.file.filename}`;
    }

    // Create admin
    const admin = new Admin({
      fullName,
      email,
      phoneNumber,
      username,
      password: hashedPassword,
      confirmPassword: generatedPassword, // optional, but better not to store plain text
      role: role || "admin",
      profileImage,
      address,
      department,
    });

    await admin.save();

    // Email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    const mailOptions = {
      from: `"ClassBuzz Admin Panel" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Admin Account Created Successfully - ClassBuzz",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hello ${fullName},</h2>
          <p>Your admin account has been created successfully.</p>

          <h3>Login Details:</h3>
          <p><b>Email:</b> ${email}</p>
          <p><b>Username:</b> ${username}</p>
          <p><b>Password:</b> ${generatedPassword}</p>

          <br />
          <p>Please login and change your password after first login.</p>
          <p>Thank you,<br/>ClassBuzz Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully and password sent to email",
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        username: admin.username,
        role: admin.role,
        profileImage: admin.profileImage,
        address: admin.address,
        department: admin.department,
      },
    });
  } catch (error) {
    console.error("Register Admin Error:", error);
    res.status(500).json({
      message: "Server error during admin registration",
      error: error.message,
    });
  }
};

// ===================== Login Admin =====================
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.isBlocked) {
      return res.status(403).json({
        message: "Your admin account has been blocked",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        username: admin.username,
        role: admin.role,
        profileImage: admin.profileImage,
        address: admin.address,
        department: admin.department,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Admin login failed",
      error: error.message,
    });
  }
};

// ===================== Get Logged-in Admin =====================
export const getMeAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select(
      "-password -confirmPassword"
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching admin profile",
      error: error.message,
    });
  }
};