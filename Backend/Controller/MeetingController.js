import Meeting from "../Models/meetingModels.js";
import nodemailer from "nodemailer";
import cron from "node-cron";

// Create a new meeting
export const createMeeting = async (req, res) => {
  try {
    const newMeeting = new Meeting(req.body);
    await newMeeting.save();

    // Email transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send immediate invitation email
    const sendInvitation = async () => {
      for (const participantEmail of newMeeting.participants) {
        await transporter.sendMail({
          from: `"Meeting Scheduler" <${process.env.EMAIL_USER}>`,
          to: participantEmail,
          subject: `📅 New Meeting: ${newMeeting.title}`,
          html: `<h2>You're invited to a meeting!</h2>
                 <p>Title: ${newMeeting.title}</p>
                 <p>Date: ${newMeeting.date}</p>
                 <p>Time: ${newMeeting.startTime || "N/A"}</p>
                 <p>Description: ${newMeeting.description || "No description"}</p>`,
        });
      }
    };

    sendInvitation();

    // Schedule reminder email 15 minutes before meeting
    const meetingDateTime = new Date(`${newMeeting.date}T${newMeeting.startTime}`);
    const reminderTime = new Date(meetingDateTime.getTime() - 15 * 60 * 1000); // 15 mins before

    const cronTime = `${reminderTime.getMinutes()} ${reminderTime.getHours()} ${reminderTime.getDate()} ${reminderTime.getMonth() + 1} *`;

    cron.schedule(cronTime, async () => {
      for (const participantEmail of newMeeting.participants) {
        await transporter.sendMail({
          from: `"Meeting Scheduler" <${process.env.EMAIL_USER}>`,
          to: participantEmail,
          subject: `⏰ Reminder: ${newMeeting.title} in 15 minutes`,
          html: `<h2>Reminder!</h2>
                 <p>Your meeting "${newMeeting.title}" starts at ${newMeeting.startTime}.</p>
                 <p>Description: ${newMeeting.description || "No description"}</p>`,
        });
      }
    });

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

