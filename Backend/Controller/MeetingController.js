import Meeting from "../Models/meetingModels.js";


// Create a new meeting
export const createMeeting = async (req, res) => {
  try {
    const newMeeting = new Meeting(req.body);
    await newMeeting.save();
    res.status(201).json(newMeeting);
  } catch (error) {
    res.status(500).json({ error: "Failed to save meeting" });
  }
};

// Get all meetings
export const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch meetings" });
  }
};

// ✅ Delete Meeting
export const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMeeting = await Meeting.findByIdAndDelete(id);
    if (!deletedMeeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    res.status(200).json({ message: "Meeting deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete meeting" });
  }
};

// Update/Edit a meeting by ID
export const updateMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedMeeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    res.status(200).json(updatedMeeting);
  } catch (error) {
    res.status(500).json({ error: "Failed to update meeting" });
  }
};

