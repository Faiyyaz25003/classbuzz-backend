import Task from "../Models/taskModels.js";
import nodemailer from "nodemailer";



// Create a new task
export const createTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();

    // Send email to participants
    if (newTask.participants && newTask.participants.length > 0) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // or your SMTP provider
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER, // your email
          pass: process.env.EMAIL_PASS, // app password
        },
      });

      for (const participantEmail of newTask.participants) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: participantEmail,
          subject: `New Task Assigned: ${newTask.title}`,
          text: `
Hello,

A new task has been assigned to you.

Title: ${newTask.title}
Date: ${newTask.date}
Time: ${newTask.time || "N/A"}
Category: ${newTask.category || "N/A"}
Description: ${newTask.description || "No description"}

Please complete it on time.
          `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
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

