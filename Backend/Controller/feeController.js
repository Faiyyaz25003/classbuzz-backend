import Fee from "../Models/feeModel.js";
import User from "../Models/UserModels.js";

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

    res.status(201).json({
      message: "Fee record added successfully",
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
