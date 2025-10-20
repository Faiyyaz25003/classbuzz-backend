import Fee from "../Models/feeModel.js";
import User from "../Models/UserModels.js";
import nodemailer from "nodemailer";

// ✅ Add Fee Record
export const addFee = async (req, res) => {
  try {
    const { userId, amount, installment, paymentMethod, paymentName } = req.body;

    if (!userId || !amount || !installment || !paymentMethod) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Save Fee record
    const newFee = new Fee({
      userId,
      amount,
      installment,
      paymentMethod,
      paymentName,
      feeDate: new Date(),
    });
    await newFee.save();

    // Update user's fee summary fields
    user.feeAmount = (user.feeAmount || 0) + parseFloat(amount);
    user.installment = parseInt(installment);
    user.feesPaid = true;
    user.feeDate = new Date();
    await user.save();

    // ---- Nodemailer setup ----
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
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
              <p>Hello <strong>${user.name}</strong>,</p>
              <p>We have successfully received your fee payment. Here are the details:</p>
              <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border: 1px solid #e5e7eb;">Amount</td>
                  <td style="padding: 10px; border: 1px solid #e5e7eb;">₹${amount}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #e5e7eb;">Installment</td>
                  <td style="padding: 10px; border: 1px solid #e5e7eb;">${installment}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #e5e7eb;">Payment Method</td>
                  <td style="padding: 10px; border: 1px solid #e5e7eb;">${paymentMethod}</td>
                </tr>
                ${paymentName ? `<tr>
                  <td style="padding: 10px; border: 1px solid #e5e7eb;">Transaction / Cheque ID</td>
                  <td style="padding: 10px; border: 1px solid #e5e7eb;">${paymentName}</td>
                </tr>` : ''}
              </table>
              <p style="margin-top: 20px;">Thank you for your prompt payment.</p>
            </div>
            <div style="background-color: #f3f4f6; text-align: center; padding: 15px; color: #6b7280; font-size: 12px;">
              &copy; 2025 Your Company. All rights reserved.
            </div>
          </div>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error("Email sending error:", err);
      else console.log("Email sent:", info.response);
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
export const getFeesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const fees = await Fee.find({ userId }).sort({ createdAt: -1 }); // latest first
    res.status(200).json(fees);
  } catch (error) {
    console.error("Error fetching fees:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all fees of a specific user
// Get all fees of a specific user
export const getUserFees = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch all fees for this user
    const fees = await Fee.find({ userId }).sort({ createdAt: -1 }); // latest first

    res.status(200).json(fees);
  } catch (error) {
    console.error("Error fetching user fees:", error);
    res.status(500).json({ message: "Failed to fetch fees", error: error.message });
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
