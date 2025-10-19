import Fee from "../Models/feeModel.js";
import User from "../Models/UserModels.js";
import nodemailer from "nodemailer";

// ✅ Add Fee Record
export const addFee = async (req, res) => {
  try {
    const { userId, amount, installment } = req.body;

    if (!userId || !amount || !installment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Save Fee record
    const newFee = new Fee({ userId, amount, installment });
    await newFee.save();

    // ---- Nodemailer setup ----
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or any other email provider
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your email password or app password
      },
    });

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: user.email,
  subject: "Fee Payment Confirmation",
  html: `
    <div style="font-family: 'Helvetica', Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Fee Payment Received</h1>
        </div>
        <div style="padding: 20px; color: #111827;">
          <p style="font-size: 16px;">Hello <strong>${user.name}</strong>,</p>
          <p style="font-size: 16px;">We have successfully received your fee payment. Here are the details:</p>
          <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">Amount</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${amount}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">Installment</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${installment}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; font-size: 16px;">Thank you for your prompt payment. If you have any questions, feel free to contact us.</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="#" style="background-color: #4f46e5; color: white; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-weight: bold;">View Your Account</a>
          </div>
        </div>
        <div style="background-color: #f3f4f6; text-align: center; padding: 15px; color: #6b7280; font-size: 12px;">
          &copy; 2025 Your Company. All rights reserved.
        </div>
      </div>
    </div>
  `,
};


    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email sending error:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(201).json({
      message: "Fee record added successfully and email sent",
      fee: newFee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding fee", error: error.message });
  }
};

// ✅ Get All Fee Records
export const getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find()
      .populate("userId", "name email phone departments positions")
      .sort({ createdAt: -1 });
    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching fees", error: error.message });
  }
};

// ✅ Get Fee by User
export const getFeeByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const fees = await Fee.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user fees", error: error.message });
  }
};

// ✅ Update Fee Record
export const updateFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, installment, status } = req.body;

    const updatedFee = await Fee.findByIdAndUpdate(
      id,
      { amount, installment, status },
      { new: true }
    );

    if (!updatedFee) return res.status(404).json({ message: "Fee not found" });
    res.status(200).json({ message: "Fee updated successfully", fee: updatedFee });
  } catch (error) {
    res.status(500).json({ message: "Error updating fee", error: error.message });
  }
};

// ✅ Delete Fee
export const deleteFee = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFee = await Fee.findByIdAndDelete(id);
    if (!deletedFee) return res.status(404).json({ message: "Fee not found" });

    res.status(200).json({ message: "Fee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting fee", error: error.message });
  }
};
