
// import User from "../Models/UserModels.js"
// import nodemailer from "nodemailer";
// import bcrypt from "bcryptjs";

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

//     // Send email with enhanced design
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
//       subject: "🎉 Welcome , Your Account is Ready For Login !",
//       html: `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Welcome Email</title>
//         </head>
//         <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
//           <table role="presentation" style="width: 100%; border-collapse: collapse;">
//             <tr>
//               <td align="center" style="padding: 40px 0;">
//                 <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                  
//                   <!-- Header -->
//                   <tr>
//                     <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
//                       <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
//                         🎉 Welcome Aboard!
//                       </h1>
//                       <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">
//                         Your account has been successfully created
//                       </p>
//                     </td>
//                   </tr>
                  
//                   <!-- Body -->
//                   <tr>
//                     <td style="padding: 40px 30px;">
//                       <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
//                         Hello ${name},
//                       </p>
                      
//                       <p style="margin: 0 0 25px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
//                         We're excited to have you on our team! Your account has been set up and is ready to use. Below are your login credentials to access the system.
//                       </p>
                      
//                       <!-- Credentials Box -->
//                       <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
//                         <tr>
//                           <td style="background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%); border-radius: 10px; padding: 30px; border-left: 5px solid #667eea;">
//                             <table role="presentation" style="width: 100%; border-collapse: collapse;">
//                               <tr>
//                                 <td style="padding: 10px 0;">
//                                   <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
//                                     Username (Email)
//                                   </p>
//                                   <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600; font-family: 'Courier New', monospace;">
//                                     ${email}
//                                   </p>
//                                 </td>
//                               </tr>
//                               <tr>
//                                 <td style="padding: 20px 0 10px 0;">
//                                   <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
//                                     Temporary Password
//                                   </p>
//                                   <p style="margin: 0; color: #1f2937; font-size: 18px; font-weight: 700; font-family: 'Courier New', monospace; background-color: #ffffff; padding: 12px 15px; border-radius: 6px; display: inline-block; border: 2px dashed #667eea;">
//                                     ${generatedPassword}
//                                   </p>
//                                 </td>
//                               </tr>
//                             </table>
//                           </td>
//                         </tr>
//                       </table>
                      
//                       <!-- Security Notice -->
//                       <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 25px 0;">
//                         <tr>
//                           <td style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; border-radius: 8px;">
//                             <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
//                               <strong>🔒 Security Tip:</strong> Please change your password after your first login to ensure your account security.
//                             </p>
//                           </td>
//                         </tr>
//                       </table>
                      
//                       <!-- Account Details -->
//                       <div style="margin: 30px 0; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
//                         <p style="margin: 0 0 15px 0; color: #1f2937; font-size: 15px; font-weight: 600;">
//                           📋 Account Details:
//                         </p>
//                         <table role="presentation" style="width: 100%; border-collapse: collapse;">
//                           <tr>
//                             <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Full Name:</td>
//                             <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${name}</td>
//                           </tr>
//                           <tr>
//                             <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Email:</td>
//                             <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${email}</td>
//                           </tr>
//                           <tr>
//                             <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Phone:</td>
//                             <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${phone}</td>
//                           </tr>
//                           <tr>
//                             <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Gender:</td>
//                             <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${gender}</td>
//                           </tr>
//                           <tr>
//                             <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Department:</td>
//                             <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${departments || 'Not Assigned'}</td>
//                           </tr>
//                           <tr>
//                             <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Position:</td>
//                             <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${positions || 'Not Assigned'}</td>
//                           </tr>
//                           <tr>
//                             <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Join Date:</td>
//                             <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${new Date(joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
//                           </tr>
//                         </table>
//                       </div>
                      
//                       <!-- CTA Button -->
//                       <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 35px 0 25px 0;">
//                         <tr>
//                           <td align="center">
//                             <a href="${process.env.APP_URL || '#'}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
//                               Login to Your Account
//                             </a>
//                           </td>
//                         </tr>
//                       </table>
                      
//                       <p style="margin: 25px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
//                         If you have any questions or need assistance, feel free to reach out to our support team.
//                       </p>
                      
//                       <p style="margin: 20px 0 0 0; color: #1f2937; font-size: 15px; font-weight: 600;">
//                         Best regards,<br>
//                         <span style="color: #667eea;">The Admin Team</span>
//                       </p>
//                     </td>
//                   </tr>
                  
//                   <!-- Footer -->
//                   <tr>
//                     <td style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
//                       <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
//                         This is an automated message. Please do not reply to this email.
//                       </p>
//                       <p style="margin: 0; color: #9ca3af; font-size: 12px;">
//                         © ${new Date().getFullYear()} Your Company. All rights reserved.
//                       </p>
//                     </td>
//                   </tr>
                  
//                 </table>
//               </td>
//             </tr>
//           </table>
//         </body>
//         </html>
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

// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().sort({ createdAt: -1 });
//     res.status(200).json(users);
//   } catch (error) {
//     console.error("Fetch Users Error:", error);
//     res.status(500).json({ message: "Error fetching users", error: error.message });
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
      departments,
      positions,
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
        departments: user.departments,
        positions: user.positions,
        joinDate: user.joinDate,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
