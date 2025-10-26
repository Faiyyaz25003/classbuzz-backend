import Task from "../Models/taskModels.js";
import nodemailer from "nodemailer";


// Create a new task
export const createTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();

    if (newTask.participants && newTask.participants.length > 0) {
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
        for (const participantEmail of newTask.participants) {
          await transporter.sendMail({
            from: `"ClassBuzz" <${process.env.EMAIL_USER}>`,
            to: participantEmail,
            subject,
            html: htmlContent,
          });
        }
      };

      // 1️⃣ Send immediate email
      const assignmentHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #4CAF50;">You Have a New Task!</h2>
          <p>Hello,</p>
          <p>A new task has been assigned to you. Here are the details:</p>
          <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
            <tr><td style="padding: 8px; font-weight: bold; background-color: #f2f2f2;">Title:</td><td style="padding: 8px;">${newTask.title}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; background-color: #f9f9f9;">Date:</td><td style="padding: 8px;">${newTask.date}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; background-color: #f2f2f2;">Time:</td><td style="padding: 8px;">${newTask.time || "N/A"}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; background-color: #f9f9f9;">Description:</td><td style="padding: 8px;">${newTask.description || "No description"}</td></tr>
          </table>
          <p style="margin-top: 20px;">Please make sure to complete it on time.</p>
        </div>
      `;
      await sendEmail(`📝 New Task Assigned: ${newTask.title}`, assignmentHtml);

      // 2️⃣ Schedule 15-minute reminder
      if (newTask.time) {
        const taskDateTime = new Date(`${newTask.date}T${newTask.time}`);
        const now = new Date();
        const delay = taskDateTime.getTime() - now.getTime() - 15 * 60 * 1000; // 15 mins before

        if (delay > 0) {
          setTimeout(async () => {
            const reminderHtml = `
              <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <h2 style="color: #FF9800;">Task Reminder!</h2>
                <p>Hello,</p>
                <p>This is a reminder that your task <strong>${newTask.title}</strong> starts in 15 minutes.</p>
                <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
                  <tr><td style="padding: 8px; font-weight: bold; background-color: #f2f2f2;">Title:</td><td style="padding: 8px;">${newTask.title}</td></tr>
                  <tr><td style="padding: 8px; font-weight: bold; background-color: #f9f9f9;">Date:</td><td style="padding: 8px;">${newTask.date}</td></tr>
                  <tr><td style="padding: 8px; font-weight: bold; background-color: #f2f2f2;">Time:</td><td style="padding: 8px;">${newTask.time}</td></tr>
                  <tr><td style="padding: 8px; font-weight: bold; background-color: #f9f9f9;">Description:</td><td style="padding: 8px;">${newTask.description || "No description"}</td></tr>
                </table>
              </div>
            `;
            await sendEmail(`⏰ Reminder: ${newTask.title} in 15 minutes`, reminderHtml);
          }, delay);
        }
      }
    }

    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save task" });
  }
};

// Get all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};


// ✅ Delete Task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};

// Update/Edit a task by ID
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedTask) return res.status(404).json({ error: "Task not found" });
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

