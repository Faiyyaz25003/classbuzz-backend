import Event from "../Models/eventModels.js";
import cron from "node-cron";
import nodemailer from "nodemailer";
// Create a new event
export const createEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();

    if (newEvent.participants && newEvent.participants.length > 0) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Function to send email
      const sendEmail = async (subject, htmlContent) => {
        for (const participantEmail of newEvent.participants) {
          await transporter.sendMail({
            from: `"ClassBuzz" <${process.env.EMAIL_USER}>`,
            to: participantEmail,
            subject,
            html: htmlContent,
          });
        }
      };

      // 1️⃣ Send immediate invitation email
      const invitationHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #FF6F61;">You're Invited to an Event!</h2>
          <p>Hello,</p>
          <p>You've been invited to the following event:</p>
          
          <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
            <tr>
              <td style="padding: 8px; font-weight: bold; background-color: #f2f2f2;">Title:</td>
              <td style="padding: 8px;">${newEvent.title}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9;">Date:</td>
              <td style="padding: 8px;">${newEvent.date}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; background-color: #f2f2f2;">Time:</td>
              <td style="padding: 8px;">${newEvent.time || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9;">Participants:</td>
              <td style="padding: 8px;">${newEvent.participants.join(", ")}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; background-color: #f2f2f2;">Description:</td>
              <td style="padding: 8px;">${newEvent.description || "No description"}</td>
            </tr>
          </table>

          <p style="margin-top: 20px;">Looking forward to seeing you there!</p>
          <p style="color: #888; font-size: 12px;">This is an automated notification from the Event Manager system.</p>
        </div>
      `;

      await sendEmail(`🎉 You're Invited: ${newEvent.title}`, invitationHtml);

      // 2️⃣ Schedule 15-minute reminder
      if (newEvent.time) {
        const eventDateTime = new Date(`${newEvent.date}T${newEvent.time}`);
        const reminderTime = new Date(eventDateTime.getTime() - 15 * 60 * 1000); // 15 mins before

        const cronTime = `${reminderTime.getMinutes()} ${reminderTime.getHours()} ${reminderTime.getDate()} ${reminderTime.getMonth() + 1} *`;

        cron.schedule(cronTime, async () => {
          const reminderHtml = `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <h2 style="color: #FF9800;">Event Reminder!</h2>
              <p>Hello,</p>
              <p>This is a reminder that your event <strong>${newEvent.title}</strong> starts in 15 minutes.</p>
              
              <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
                <tr>
                  <td style="padding: 8px; font-weight: bold; background-color: #f2f2f2;">Title:</td>
                  <td style="padding: 8px;">${newEvent.title}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9;">Date:</td>
                  <td style="padding: 8px;">${newEvent.date}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; background-color: #f2f2f2;">Time:</td>
                  <td style="padding: 8px;">${newEvent.time}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9;">Participants:</td>
                  <td style="padding: 8px;">${newEvent.participants.join(", ")}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; background-color: #f2f2f2;">Description:</td>
                  <td style="padding: 8px;">${newEvent.description || "No description"}</td>
                </tr>
              </table>

              <p style="margin-top: 20px;">Looking forward to seeing you there!</p>
            </div>
          `;
          await sendEmail(`⏰ Reminder: ${newEvent.title} in 15 minutes`, reminderHtml);
        });
      }
    }

    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save event" });
  }
};

// Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
};


// ✅ Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
};

// ✅ Update/Edit Event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: "Failed to update event" });
  }
};
