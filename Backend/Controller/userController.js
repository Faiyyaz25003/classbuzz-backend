
// // controllers/userController.js
// import User from "../Models/UserModels.js";
// import nodemailer from "nodemailer";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// // ===================== Register User =====================
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, phone, gender, departments, positions, joinDate } = req.body;

//     if (!name || !email || !phone || !gender || !joinDate) {
//       return res.status(400).json({ message: "Please fill all required fields" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ message: "Email already registered" });
//     }

//     // Generate random password
//     const generatedPassword = Math.random().toString(36).slice(-8);
//     const hashedPassword = await bcrypt.hash(generatedPassword, 10);

//     const user = await User.create({
//       name,
//       email,
//       phone,
//       gender,
//       departments,
//       positions,
//       joinDate,
//       password: hashedPassword,
//     });

//     // Send email with credentials
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"Admin" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "🎉 Welcome! Your Account is Ready",
//       html: `
//         <p>Hello ${name},</p>
//         <p>Your account has been created successfully.</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Temporary Password:</strong> ${generatedPassword}</p>
//         <p>Please change your password after first login.</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(201).json({
//       message: "User registered successfully. Credentials sent via email.",
//       user,
//     });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     res.status(500).json({ message: "Error registering user", error: error.message });
//   }
// };

// // ===================== Get All Users =====================
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().sort({ createdAt: -1 });
//     res.status(200).json(users);
//   } catch (error) {
//     console.error("Fetch Users Error:", error);
//     res.status(500).json({ message: "Error fetching users", error: error.message });
//   }
// };

// // ===================== Login User =====================
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Basic validation
//     if (!email || !password) {
//       return res.status(400).json({ message: "Please enter both email and password" });
//     }

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id, email: user.email, name: user.name },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         gender: user.gender,
//         departments: user.departments,
//         positions: user.positions,
//         joinDate: user.joinDate,
//       },
//       token,
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


// // ===================== Get Current User =====================
// export const getCurrentUser = async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     console.error("Get Current User Error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };




// controllers/userController.js
import User from "../Models/UserModels.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ===================== Register User =====================
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, gender, departments, positions, joinDate } = req.body;

    if (!name || !email || !phone || !gender || !joinDate) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Generate random password
    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const user = await User.create({
      name,
      email,
      phone,
      gender,
      department,
      position,
      joinDate,
      password: hashedPassword,
    });

    // Send email with credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Welcome! Your Account is Ready",
      html: `
        <p>Hello ${name},</p>
        <p>Your account has been created successfully.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${generatedPassword}</p>
        <p>Please change your password after first login.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "User registered successfully. Credentials sent via email.",
      user,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

// ===================== Get All Users =====================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// ===================== Login User =====================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter both email and password" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        department: user.department,
        position: user.position,
        joinDate: user.joinDate,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ===================== Get Current User =====================
export const getCurrentUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get Current User Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
