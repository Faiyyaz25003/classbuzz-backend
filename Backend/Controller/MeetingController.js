import Meeting from "../Models/meetingModels.js";
import nodemailer from "nodemailer";

// Create a new meeting
export const createMeeting = async (req, res) => {
  try {
    const newMeeting = new Meeting(req.body);
    await newMeeting.save();

    // Send email to participants
    if (newMeeting.participants && newMeeting.participants.length > 0) {
      // Configure transporter
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // or your email provider
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER, // your email
          pass: process.env.EMAIL_PASS, // app password or email password
        },
      });

      // Loop through participants and send email
      for (const participantEmail of newMeeting.participants) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: participantEmail,
          subject: `New Meeting Scheduled: ${newMeeting.title}`,
          text: `
            Hello,

            You have been invited to a meeting.

            Title: ${newMeeting.title}
            Date: ${newMeeting.date}
            Time: ${newMeeting.startTime || "N/A"}
            Description: ${newMeeting.description || "No description"}

            Please join on time.
          `,
        };

        await transporter.sendMail(mailOptions);
      }
    }

    res.status(201).json(newMeeting);
  } catch (error) {
    console.error(error);
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

