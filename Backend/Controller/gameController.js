
import Game from "../Models/gameModels.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import axios from "axios";

// ✅ FIXED Transporter - env variables use karta hai
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // TLS
    auth: {
      user: process.env.GMAIL_USER || "khanfaiyyaz25003@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD || "jsyl zpyj qvxz uhoe",
    },
    tls: {
      rejectUnauthorized: false, // ✅ SSL errors avoid karta hai
    },
  });
};

// Generate random 6-char password
const generateAccessPassword = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
};

// ✅ FIXED: Send game access email
const sendGameAccessEmail = async (userEmail, userName, gameTitle, password) => {
  const transporter = createTransporter();

  // ✅ Pehle verify karo connection
  await new Promise((resolve, reject) => {
    transporter.verify((error, success) => {
      if (error) {
        console.error("❌ Transporter verify failed:", error.message);
        reject(error);
      } else {
        console.log("✅ Gmail connection verified!");
        resolve(success);
      }
    });
  });

  const mailOptions = {
    from: `"Game Portal Admin" <${process.env.GMAIL_USER || "khanfaiyyaz25003@gmail.com"}>`,
    to: userEmail,
    subject: `🎮 You've been invited to play: ${gameTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f1a; color: #fff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6c3bff, #00c6ff); padding: 40px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">🎮 GAME PORTAL</h1>
          <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">You have a new game invitation!</p>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #a78bfa; margin-top: 0;">Hello, ${userName}! 👋</h2>
          <p style="color: #cbd5e1; line-height: 1.6;">
            Admin has assigned you a new game: <strong style="color: #00c6ff;">${gameTitle}</strong>
          </p>
          <div style="background: #1e1e3a; border: 1px solid #6c3bff; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
            <p style="margin: 0 0 8px; color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Your Access Password</p>
            <div style="background: #6c3bff; color: #fff; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px 32px; border-radius: 8px; display: inline-block; font-family: monospace;">
              ${password}
            </div>
          </div>
          <p style="color: #94a3b8; font-size: 13px; line-height: 1.6;">
            ⚠️ <strong>Important:</strong> Enter this password on the User Game Portal to access your assigned game.
            This password is unique to you and this game.
          </p>
          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #2d2d50; text-align: center;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              This is an automated message from Game Portal. Do not share your password.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent! MessageId: ${info.messageId}`);
  return info;
};

// ✅ CREATE GAME (Admin)
export const createGame = async (req, res) => {
  try {
    const { title, description, category, gameType, imageUrl, assignedUserIds } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Title, description, and category are required" });
    }

    // Fetch users from API
    let usersData = [];
    if (assignedUserIds && assignedUserIds.length > 0) {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        usersData = response.data;
        console.log(`✅ Total users fetched: ${usersData.length}`);
      } catch (err) {
        console.error("❌ Users fetch error:", err.message);
        return res.status(500).json({
          message: "Users fetch nahi hue",
          error: err.message,
        });
      }
    }

    // Build assignedUsers array
    const assignedUsers = [];
    for (const userId of assignedUserIds || []) {
      const user = usersData.find(
        (u) => u._id === userId || u._id?.toString() === userId
      );
      if (user) {
        const accessPassword = generateAccessPassword();
        assignedUsers.push({
          userId,
          email: user.email,
          name: user.name,
          accessPassword,
          hasAccessed: false,
        });
        console.log(`✅ User added: ${user.name} → ${user.email} → Password: ${accessPassword}`);
      } else {
        console.warn(`⚠️ User ID not found: ${userId}`);
      }
    }

    // Save game
    const game = new Game({
      title,
      description,
      category,
      gameType: gameType || "other",
      imageUrl: imageUrl || "",
      assignedUsers,
    });

    await game.save();
    console.log(`✅ Game saved to DB: ${game._id}`);

    // Send emails
    const emailResults = [];
    for (const assignedUser of assignedUsers) {
      try {
        await sendGameAccessEmail(
          assignedUser.email,
          assignedUser.name,
          title,
          assignedUser.accessPassword
        );
        emailResults.push({ email: assignedUser.email, status: "✅ sent" });
      } catch (emailErr) {
        console.error(`❌ Email failed for ${assignedUser.email}:`, emailErr.message);
        emailResults.push({
          email: assignedUser.email,
          status: "❌ failed",
          error: emailErr.message,
        });
      }
    }

    console.log("📊 Email Results:", emailResults);

    res.status(201).json({
      message: "Game created successfully!",
      game,
      emailResults,
    });
  } catch (error) {
    console.error("❌ createGame error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET ALL GAMES (Admin)
export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET GAME BY ID
export const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE GAME
export const updateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.status(200).json({ message: "Game updated successfully", game });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE GAME
export const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.status(200).json({ message: "Game deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// VERIFY USER ACCESS PASSWORD
export const verifyGameAccess = async (req, res) => {
  try {
    const { gameId, password } = req.body;

    if (!gameId || !password) {
      return res.status(400).json({ message: "Game ID and password required" });
    }

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const assignedUser = game.assignedUsers.find(
      (u) => u.accessPassword === password.toUpperCase()
    );

    if (!assignedUser) {
      return res.status(401).json({ message: "Invalid access password" });
    }

    assignedUser.hasAccessed = true;
    await game.save();

    res.status(200).json({
      message: "Access granted!",
      game: {
        _id: game._id,
        title: game.title,
        description: game.description,
        category: game.category,
        gameType: game.gameType,
        imageUrl: game.imageUrl,
      },
      user: {
        name: assignedUser.name,
        email: assignedUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET GAMES FOR USER (by email)
export const getGamesForUser = async (req, res) => {
  try {
    const { email } = req.params;
    const games = await Game.find({
      "assignedUsers.email": email,
      isActive: true,
    }).select("title description category gameType imageUrl createdAt assignedUsers");

    const safeGames = games.map((g) => ({
      _id: g._id,
      title: g.title,
      description: g.description,
      category: g.category,
      gameType: g.gameType,
      imageUrl: g.imageUrl,
      createdAt: g.createdAt,
    }));

    res.status(200).json(safeGames);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ASSIGN USERS TO EXISTING GAME
export const assignUsersToGame = async (req, res) => {
  try {
    const { gameId, userIds } = req.body;

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found" });

    let usersData = [];
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      usersData = response.data;
    } catch (err) {
      console.error("❌ Users fetch error:", err.message);
      return res.status(500).json({ message: "Users fetch nahi hue", error: err.message });
    }

    const emailResults = [];
    for (const userId of userIds) {
      const alreadyAssigned = game.assignedUsers.find(
        (u) => u.userId?.toString() === userId
      );
      if (alreadyAssigned) {
        console.log(`⚠️ Already assigned: ${userId}`);
        continue;
      }

      const user = usersData.find((u) => u._id?.toString() === userId);
      if (user) {
        const accessPassword = generateAccessPassword();
        game.assignedUsers.push({
          userId,
          email: user.email,
          name: user.name,
          accessPassword,
          hasAccessed: false,
        });

        try {
          await sendGameAccessEmail(user.email, user.name, game.title, accessPassword);
          console.log(`📧 Email sent to ${user.email}`);
          emailResults.push({ email: user.email, status: "✅ sent" });
        } catch (emailErr) {
          console.error(`❌ Email failed for ${user.email}:`, emailErr.message);
          emailResults.push({
            email: user.email,
            status: "❌ failed",
            error: emailErr.message,
          });
        }
      } else {
        console.warn(`⚠️ User not found: ${userId}`);
      }
    }

    await game.save();
    res.status(200).json({
      message: "Users assigned!",
      game,
      emailResults,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};