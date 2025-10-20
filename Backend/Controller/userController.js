
import User from "../Models/UserModels.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ===================== Register User =====================
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

// const mailOptions = {
//   from: `"ClassBuzz" <${process.env.EMAIL_USER}>`,
//   to: email,
//   subject: "🎉 Welcome to ClassBuzz! Your Account is Ready",
//   html: `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <style>
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//         }

//         body {
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
//           background: linear-gradient(135deg, #f1f5f9 0%, #faf5ff 50%, #eff6ff 100%);
//           padding: 32px 16px;
//         }

//         .container {
//           max-width: 672px;
//           margin: 0 auto;
//         }

//         .main-card {
//           background: white;
//           border-radius: 24px;
//           box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
//           overflow: hidden;
//           border: 1px solid #e9d5ff;
//         }

//         /* Header Section */
//         .header {
//           position: relative;
//           background: linear-gradient(135deg, #9333ea 0%, #4f46e5 50%, #2563eb 100%);
//           padding: 48px 32px;
//           text-align: center;
//           overflow: hidden;
//         }

//         .header-circle-1 {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 256px;
//           height: 256px;
//           background: white;
//           opacity: 0.05;
//           border-radius: 50%;
//           transform: translate(-128px, -128px);
//         }

//         .header-circle-2 {
//           position: absolute;
//           bottom: 0;
//           right: 0;
//           width: 320px;
//           height: 320px;
//           background: white;
//           opacity: 0.05;
//           border-radius: 50%;
//           transform: translate(160px, 160px);
//         }

//         .header-content {
//           position: relative;
//           z-index: 10;
//         }

//         .header-badge {
//           display: inline-block;
//           background: rgba(255, 255, 255, 0.2);
//           backdrop-filter: blur(8px);
//           border-radius: 16px;
//           padding: 12px 24px;
//           margin-bottom: 16px;
//           animation: float 3s ease-in-out infinite;
//         }

//         .header-emoji {
//           font-size: 48px;
//         }

//         .header-title {
//           font-size: 36px;
//           font-weight: 800;
//           color: white;
//           margin-bottom: 12px;
//           letter-spacing: -0.025em;
//         }

//         .header-subtitle {
//           color: #e9d5ff;
//           font-size: 18px;
//           font-weight: 500;
//         }

//         .header-status {
//           display: inline-block;
//           margin-top: 16px;
//           background: rgba(255, 255, 255, 0.1);
//           backdrop-filter: blur(8px);
//           border-radius: 9999px;
//           padding: 4px 16px;
//         }

//         .header-status-text {
//           color: rgba(255, 255, 255, 0.9);
//           font-size: 14px;
//         }

//         /* Content Section */
//         .content {
//           padding: 40px 32px;
//         }

//         /* Name Greeting */
//         .name-greeting {
//           margin-bottom: 40px;
//           text-align: center;
//         }

//         .name-spotlight {
//           position: relative;
//           display: inline-block;
//         }

//         .name-glow {
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(90deg, #c084fc, #f472b6, #60a5fa);
//           border-radius: 24px;
//           filter: blur(24px);
//           opacity: 0.6;
//         }

//         .name-box {
//           position: relative;
//           background: linear-gradient(135deg, #9333ea, #4f46e5, #2563eb);
//           border-radius: 24px;
//           padding: 24px 40px;
//           box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
//           animation: pulse-glow 2s ease-in-out infinite;
//         }

//         .name-shimmer {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           border-radius: 24px;
//           animation: shimmer 3s infinite;
//           background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
//           background-size: 1000px 100%;
//         }

//         .name-text {
//           position: relative;
//           z-index: 10;
//           font-size: 36px;
//           font-weight: 900;
//           color: white;
//           text-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//           letter-spacing: 0.025em;
//         }

//         .name-divider {
//           margin-top: 8px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 8px;
//         }

//         .divider-line {
//           height: 4px;
//           width: 32px;
//           background: #fde047;
//           border-radius: 9999px;
//         }

//         .divider-star {
//           color: #fde047;
//           font-size: 14px;
//         }

//         /* Welcome Message */
//         .welcome-message {
//           margin-bottom: 40px;
//           text-align: center;
//         }

//         .welcome-text {
//           color: #4b5563;
//           font-size: 16px;
//           line-height: 1.625;
//           max-width: 576px;
//           margin: 0 auto;
//         }

//         /* Credentials Section */
//         .credentials {
//           margin-bottom: 40px;
//         }

//         .credential-card {
//           position: relative;
//           border-radius: 24px;
//           padding: 1px;
//           margin-bottom: 24px;
//           box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
//           transition: all 0.5s;
//         }

//         .credential-card:hover {
//           transform: scale(1.02);
//           box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
//         }

//         .email-card {
//           background: linear-gradient(135deg, #3b82f6, #06b6d4, #14b8a6);
//         }

//         .password-card {
//           background: linear-gradient(135deg, #a855f7, #ec4899, #f43f5e);
//         }

//         .department-card {
//           background: linear-gradient(135deg, #10b981, #22c55e, #14b8a6);
//         }

//         .position-card {
//           background: linear-gradient(135deg, #f97316, #f59e0b, #eab308);
//         }

//         .card-inner {
//           background: white;
//           border-radius: 24px;
//           padding: 24px;
//           height: 100%;
//         }

//         .card-header {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           margin-bottom: 16px;
//         }

//         .card-icon-wrapper {
//           display: flex;
//           align-items: center;
//         }

//         .card-icon-container {
//           position: relative;
//         }

//         .card-icon-glow {
//           position: absolute;
//           inset: 0;
//           border-radius: 16px;
//           filter: blur(4px);
//           opacity: 0.5;
//         }

//         .email-icon-glow {
//           background: linear-gradient(90deg, #3b82f6, #06b6d4);
//         }

//         .password-icon-glow {
//           background: linear-gradient(90deg, #a855f7, #ec4899);
//         }

//         .department-icon-glow {
//           background: linear-gradient(90deg, #10b981, #22c55e);
//         }

//         .position-icon-glow {
//           background: linear-gradient(90deg, #f97316, #f59e0b);
//         }

//         .card-icon-box {
//           position: relative;
//           border-radius: 16px;
//           padding: 12px;
//           box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
//         }

//         .email-icon-box {
//           background: linear-gradient(135deg, #3b82f6, #06b6d4);
//         }

//         .password-icon-box {
//           background: linear-gradient(135deg, #a855f7, #ec4899);
//         }

//         .department-icon-box {
//           background: linear-gradient(135deg, #10b981, #22c55e);
//         }

//         .position-icon-box {
//           background: linear-gradient(135deg, #f97316, #f59e0b);
//         }

//         .card-icon {
//           font-size: 28px;
//         }

//         .card-label-wrapper {
//           margin-left: 16px;
//         }

//         .card-label {
//           font-size: 11px;
//           font-weight: 900;
//           color: #9ca3af;
//           text-transform: uppercase;
//           letter-spacing: 0.2em;
//         }

//         .label-underline {
//           height: 2px;
//           width: 64px;
//           border-radius: 9999px;
//           margin-top: 4px;
//         }

//         .email-underline {
//           background: linear-gradient(90deg, #3b82f6, transparent);
//         }

//         .password-underline {
//           background: linear-gradient(90deg, #a855f7, transparent);
//         }

//         .department-underline {
//           background: linear-gradient(90deg, #10b981, transparent);
//         }

//         .position-underline {
//           background: linear-gradient(90deg, #f97316, transparent);
//         }

//         .card-badge {
//           border-radius: 9999px;
//           padding: 4px 12px;
//         }

//         .email-badge {
//           background: #dbeafe;
//         }

//         .password-badge {
//           background: #fae8ff;
//         }

//         .badge-text {
//           font-size: 12px;
//           font-weight: 700;
//         }

//         .email-badge-text {
//           color: #2563eb;
//         }

//         .password-badge-text {
//           color: #9333ea;
//         }

//         .card-value-box {
//           border-radius: 16px;
//           padding: 20px;
//         }

//         .email-value-box {
//           background: linear-gradient(90deg, #dbeafe, #cffafe);
//           border: 2px solid #bfdbfe;
//         }

//         .email-value {
//           font-size: 20px;
//           font-weight: 700;
//           color: #1d4ed8;
//           word-break: break-all;
//           letter-spacing: 0.025em;
//         }

//         .password-value-container {
//           position: relative;
//         }

//         .password-value-glow {
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(90deg, #e9d5ff, #fbcfe8, #fecdd3);
//           border-radius: 16px;
//           filter: blur(4px);
//         }

//         .password-value-box {
//           position: relative;
//           background: linear-gradient(135deg, #faf5ff, #fdf4ff, #fff1f2);
//           border-radius: 16px;
//           padding: 24px;
//           border: 4px dashed #c084fc;
//           box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
//         }

//         .password-value {
//           text-align: center;
//           font-size: 28px;
//           font-weight: 900;
//           font-family: 'Courier New', monospace;
//           background: linear-gradient(90deg, #9333ea, #db2777, #e11d48);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//           letter-spacing: 0.3em;
//           filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
//         }

//         .password-divider {
//           margin-top: 12px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 8px;
//         }

//         .password-divider-line {
//           height: 4px;
//           width: 48px;
//           border-radius: 9999px;
//         }

//         .password-divider-line-left {
//           background: linear-gradient(90deg, #c084fc, #f472b6);
//         }

//         .password-divider-line-right {
//           background: linear-gradient(270deg, #c084fc, #f472b6);
//         }

//         .password-divider-icon {
//           color: #c084fc;
//           font-size: 12px;
//         }

//         .two-column-grid {
//           display: grid;
//           grid-template-columns: 1fr;
//           gap: 24px;
//         }

//         @media (min-width: 768px) {
//           .two-column-grid {
//             grid-template-columns: repeat(2, 1fr);
//           }
//         }

//         .department-value-box,
//         .position-value-box {
//           border-radius: 16px;
//           padding: 20px;
//         }

//         .department-value-box {
//           background: linear-gradient(135deg, #d1fae5, #d9f99d);
//           border: 2px solid #6ee7b7;
//         }

//         .position-value-box {
//           background: linear-gradient(135deg, #fed7aa, #fef3c7);
//           border: 2px solid #fdba74;
//         }

//         .department-value,
//         .position-value {
//           font-size: 24px;
//           font-weight: 900;
//         }

//         .department-value {
//           background: linear-gradient(90deg, #059669, #16a34a);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//         }

//         .position-value {
//           background: linear-gradient(90deg, #ea580c, #f59e0b);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//         }

//         /* Warning Alert */
//         .warning-alert {
//           position: relative;
//           background: linear-gradient(90deg, #fffbeb, #ffedd5);
//           border-left: 4px solid #f59e0b;
//           border-radius: 16px;
//           padding: 24px;
//           margin-bottom: 32px;
//           box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
//         }

//         .warning-watermark {
//           position: absolute;
//           top: 0;
//           right: 0;
//           font-size: 64px;
//           opacity: 0.05;
//         }

//         .warning-content {
//           display: flex;
//           align-items: flex-start;
//           position: relative;
//           z-index: 10;
//         }

//         .warning-icon-box {
//           background: #fbbf24;
//           border-radius: 12px;
//           padding: 8px;
//           margin-right: 12px;
//           box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
//         }

//         .warning-icon {
//           font-size: 20px;
//         }

//         .warning-title {
//           color: #78350f;
//           font-weight: 700;
//           font-size: 14px;
//           margin-bottom: 4px;
//         }

//         .warning-text {
//           color: #92400e;
//           font-size: 14px;
//           line-height: 1.5;
//         }

//         /* Support Box */
//         .support-box {
//           background: linear-gradient(90deg, #f8fafc, #f9fafb);
//           border-radius: 16px;
//           padding: 24px;
//           margin-bottom: 32px;
//           border: 1px solid #e5e7eb;
//         }

//         .support-content {
//           display: flex;
//           align-items: flex-start;
//         }

//         .support-icon-box {
//           background: linear-gradient(135deg, #a855f7, #4f46e5);
//           border-radius: 12px;
//           padding: 8px;
//           margin-right: 12px;
//           box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
//         }

//         .support-icon {
//           font-size: 20px;
//         }

//         .support-title {
//           color: #1f2937;
//           font-weight: 600;
//           font-size: 14px;
//           margin-bottom: 4px;
//         }

//         .support-text {
//           color: #4b5563;
//           font-size: 14px;
//           line-height: 1.5;
//         }

//         /* CTA Button */
//         .cta-container {
//           text-align: center;
//         }

//         .cta-button {
//           display: inline-block;
//           position: relative;
//           overflow: hidden;
//           background: linear-gradient(90deg, #9333ea, #4f46e5, #2563eb);
//           color: white;
//           font-weight: 700;
//           font-size: 18px;
//           padding: 20px 48px;
//           border-radius: 16px;
//           text-decoration: none;
//           box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
//           transition: all 0.3s;
//         }

//         .cta-button:hover {
//           box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
//           transform: scale(1.05);
//         }

//         .cta-text {
//           position: relative;
//           z-index: 10;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .cta-arrow {
//           margin-left: 8px;
//           transition: transform 0.3s;
//         }

//         .cta-button:hover .cta-arrow {
//           transform: translateX(4px);
//         }

//         .cta-overlay {
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(90deg, #7e22ce, #3730a3, #1e40af);
//           opacity: 0;
//           transition: opacity 0.3s;
//         }

//         .cta-button:hover .cta-overlay {
//           opacity: 1;
//         }

//         .cta-hint {
//           color: #9ca3af;
//           font-size: 12px;
//           margin-top: 16px;
//         }

//         /* Footer */
//         .footer {
//           position: relative;
//           background: linear-gradient(90deg, #f9fafb, #f1f5f9, #f9fafb);
//           border-top: 2px solid #e5e7eb;
//           padding: 32px;
//           text-align: center;
//         }

//         .footer-badge {
//           display: inline-block;
//           background: linear-gradient(90deg, #9333ea, #4f46e5);
//           border-radius: 12px;
//           padding: 4px 16px;
//           margin-bottom: 12px;
//         }

//         .footer-badge-text {
//           color: white;
//           font-weight: 700;
//           font-size: 14px;
//         }

//         .footer-text {
//           color: #6b7280;
//           font-size: 14px;
//           margin-bottom: 8px;
//           font-weight: 500;
//         }

//         .footer-divider {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 8px;
//           margin-bottom: 12px;
//         }

//         .footer-divider-line {
//           height: 1px;
//           width: 48px;
//         }

//         .footer-divider-line-left {
//           background: linear-gradient(90deg, transparent, #d1d5db);
//         }

//         .footer-divider-line-right {
//           background: linear-gradient(270deg, transparent, #d1d5db);
//         }

//         .footer-divider-icon {
//           color: #9ca3af;
//           font-size: 12px;
//         }

//         .footer-copyright {
//           color: #9ca3af;
//           font-size: 12px;
//         }

//         /* Animations */
//         @keyframes shimmer {
//           0% { background-position: -1000px 0; }
//           100% { background-position: 1000px 0; }
//         }

//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-10px); }
//         }

//         @keyframes pulse-glow {
//           0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.3); }
//           50% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.6); }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="main-card">
          
//           <!-- Header -->
//           <div class="header">
//             <div class="header-circle-1"></div>
//             <div class="header-circle-2"></div>
            
//             <div class="header-content">
//               <div class="header-badge">
//                 <span class="header-emoji">🎉</span>
//               </div>
//               <h1 class="header-title">Welcome to ClassBuzz!</h1>
//               <p class="header-subtitle">Your journey begins here</p>
//               <div class="header-status">
//                 <p class="header-status-text">✨ Account successfully created</p>
//               </div>
//             </div>
//           </div>

//           <!-- Content -->
//           <div class="content">
            
//             <!-- Name Greeting -->
//             <div class="name-greeting">
//               <div class="name-spotlight">
//                 <div class="name-glow"></div>
//                 <div class="name-box">
//                   <div class="name-shimmer"></div>
//                   <p class="name-text">👋 Hello, ${name}!</p>
//                   <div class="name-divider">
//                     <div class="divider-line"></div>
//                     <span class="divider-star">★</span>
//                     <div class="divider-line"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <!-- Welcome Message -->
//             <div class="welcome-message">
//               <p class="welcome-text">
//                 We're thrilled to have you on board! Your ClassBuzz account is now active and ready to explore.
//                 Here are your login credentials to get started on your journey.
//               </p>
//             </div>

//             <!-- Credentials -->
//             <div class="credentials">
              
//               <!-- Email Card -->
//               <div class="credential-card email-card">
//                 <div class="card-inner">
//                   <div class="card-header">
//                     <div class="card-icon-wrapper">
//                       <div class="card-icon-container">
//                         <div class="card-icon-glow email-icon-glow"></div>
//                         <div class="card-icon-box email-icon-box">
//                           <span class="card-icon">📧</span>
//                         </div>
//                       </div>
//                       <div class="card-label-wrapper">
//                         <span class="card-label">Email Address</span>
//                         <div class="label-underline email-underline"></div>
//                       </div>
//                     </div>
//                     <div class="card-badge email-badge">
//                       <span class="badge-text email-badge-text">✓ Verified</span>
//                     </div>
//                   </div>
//                   <div class="card-value-box email-value-box">
//                     <p class="email-value">${email}</p>
//                   </div>
//                 </div>
//               </div>

//               <!-- Password Card -->
//               <div class="credential-card password-card">
//                 <div class="card-inner">
//                   <div class="card-header">
//                     <div class="card-icon-wrapper">
//                       <div class="card-icon-container">
//                         <div class="card-icon-glow password-icon-glow"></div>
//                         <div class="card-icon-box password-icon-box">
//                           <span class="card-icon">🔑</span>
//                         </div>
//                       </div>
//                       <div class="card-label-wrapper">
//                         <span class="card-label">Temporary Password</span>
//                         <div class="label-underline password-underline"></div>
//                       </div>
//                     </div>
//                     <div class="card-badge password-badge">
//                       <span class="badge-text password-badge-text">🛡️ Secure</span>
//                     </div>
//                   </div>
//                   <div class="password-value-container">
//                     <div class="password-value-glow"></div>
//                     <div class="password-value-box">
//                       <p class="password-value">${generatedPassword}</p>
//                       <div class="password-divider">
//                         <div class="password-divider-line password-divider-line-left"></div>
//                         <span class="password-divider-icon">🔒</span>
//                         <div class="password-divider-line password-divider-line-right"></div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <!-- Department & Position Cards -->
//               <div class="two-column-grid">
                
//                 <!-- Department Card -->
//                 <div class="credential-card department-card">
//                   <div class="card-inner">
//                     <div class="card-header">
//                       <div class="card-icon-wrapper">
//                         <div class="card-icon-container">
//                           <div class="card-icon-glow department-icon-glow"></div>
//                           <div class="card-icon-box department-icon-box">
//                             <span class="card-icon">🏢</span>
//                           </div>
//                         </div>
//                         <div class="card-label-wrapper">
//                           <span class="card-label">Department</span>
//                           <div class="label-underline department-underline"></div>
//                         </div>
//                       </div>
//                     </div>
//                     <div class="department-value-box">
//                       <p class="department-value">${departments}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <!-- Position Card -->
//                 <div class="credential-card position-card">
//                   <div class="card-inner">
//                     <div class="card-header">
//                       <div class="card-icon-wrapper">
//                         <div class="card-icon-container">
//                           <div class="card-icon-glow position-icon-glow"></div>
//                           <div class="card-icon-box position-icon-box">
//                             <span class="card-icon">💼</span>
//                           </div>
//                         </div>
//                         <div class="card-label-wrapper">
//                           <span class="card-label">Position</span>
//                           <div class="label-underline position-underline"></div>
//                         </div>
//                       </div>
//                     </div>
//                     <div class="position-value-box">
//                       <p class="position-value">${positions}</p>
//                     </div>
//                   </div>
//                 </div>

//               </div>
//             </div>

//             <!-- Warning Alert -->
//             <div class="warning-alert">
//               <div class="warning-watermark">⚠️</div>
//               <div class="warning-content">
//                 <div class="warning-icon-box">
//                   <span class="warning-icon">⚠️</span>
//                 </div>
//                 <div>
//                   <p class="warning-title">Security Notice</p>
//                   <p class="warning-text">
//                     Please change your temporary password immediately after your first login to ensure your account security.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <!-- Support Box -->
//             <div class="support-box">
//               <div class="support-content">
//                 <div class="support-icon-box">
//                   <span class="support-icon">💬</span>
//                 </div>
//                 <div>
//                   <p class="support-title">Need Help?</p>
//                   <p class="support-text">
//                     Our support team is always ready to assist you. Feel free to reach out anytime!
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <!-- CTA Button -->
//             <div class="cta-container">
//               <a href="#" class="cta-button">
//                 <span class="cta-text">
//                   Login to Your Account
//                   <span class="cta-arrow">→</span>
//                 </span>
//                 <div class="cta-overlay"></div>
//               </a>
//               <p class="cta-hint">Click above to access your dashboard</p>
//             </div>

//           </div>

//           <!-- Footer -->
//           <div class="footer">
//             <div class="footer-badge">
//               <p class="footer-badge-text">ClassBuzz Team</p>
//             </div>
//             <p class="footer-text">This is an automated message, please do not reply.</p>
//             <div class="footer-divider">
//               <div class="footer-divider-line footer-divider-line-left"></div>
//               <span class="footer-divider-icon">✨</span>
//               <div class="footer-divider-line footer-divider-line-right"></div>
//             </div>
//             <p class="footer-copyright">© ${new Date().getFullYear()} ClassBuzz. All rights reserved.</p>
//           </div>

//         </div>
//       </div>
//     </body>
//     </html>
//   `,
// };
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

// ✅ REGISTER USER CONTROLLER
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

// 🔹 User login (prevent blocked users)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Check if blocked
    if (user.isBlocked) {
      return res
        .status(403)
        .json({ message: "Your account has been blocked by admin" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        positions: user.positions,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

// ===================== Get Current User =====================

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// 🔹 Edit user details
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

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

// 🔹 Block or Unblock user
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