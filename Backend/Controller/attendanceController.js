import Attendance from "../Models/attendanceModels.js";

// ✅ Save Punch In / Out
export const savePunch = async (req, res) => {
  try {
    const { type, time, location, photo } = req.body;

    if (!type || !time || !photo) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const newPunch = new Attendance({
      type,
      time,
      location,
      photo,
    });

    await newPunch.save();
    res.status(201).json({
      success: true,
      message: `${type === "in" ? "Punch In" : "Punch Out"} saved successfully`,
      punch: newPunch,
    });
  } catch (error) {
    console.error("Error saving punch:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get Punch History
export const getPunchHistory = async (req, res) => {
  try {
    const punches = await Attendance.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, punches });
  } catch (error) {
    console.error("Error fetching punch history:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
