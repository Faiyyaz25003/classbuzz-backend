import AttendanceCode from "../Models/attendancecodeModel.js";
import AttendanceRecord from "../Models/attendancerecordModel.js";

const CODE_VALIDITY_MINUTES = 5;

// ── Helper: 6-digit random code ─────────────────────────────────────────────
const generateRandomCode = () =>
  String(Math.floor(100000 + Math.random() * 900000));

// ── Helper: Today's date as YYYY-MM-DD ──────────────────────────────────────
const todayDate = () => new Date().toISOString().split("T")[0];

/**
 * POST /api/attendance-code/generate
 * Teacher iss route se code generate karta hai.
 * Body: { subjectId, subjectName, courseId, semester }
 */
export const generateCode = async (req, res) => {
  try {
    const { subjectId, subjectName, courseId, semester } = req.body;

    if (!subjectId || !subjectName || !courseId || semester === undefined) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Purane active codes ko band karo usi subject ke liye
    await AttendanceCode.updateMany(
      { subjectId, courseId, semester, isActive: true },
      { isActive: false }
    );

    const code = generateRandomCode();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + CODE_VALIDITY_MINUTES * 60 * 1000);

    const newCode = await AttendanceCode.create({
      subjectId,
      subjectName,
      courseId,
      semester,
      code,
      expiresAt,
      isActive: true,
    });

    return res.status(201).json({
      message: "Code generated successfully.",
      data: {
        _id: newCode._id,
        code: newCode.code,
        subjectName: newCode.subjectName,
        expiresAt: newCode.expiresAt,
        validForMinutes: CODE_VALIDITY_MINUTES,
      },
    });
  } catch (err) {
    console.error("generateCode error:", err);
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};

/**
 * POST /api/attendance-code/verify
 * Student iss route se code verify karke attendance lagata hai.
 * Body: { enteredCode, subjectId, subjectName, courseId, semester, userId, userName }
 */
export const verifyCodeAndMarkAttendance = async (req, res) => {
  try {
    const {
      enteredCode,
      subjectId,
      subjectName,
      courseId,
      semester,
      userId,
      userName,
    } = req.body;

    if (!enteredCode || !subjectId || !userId || !userName) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const date = todayDate();

    // Check: Student ne aaj pehle se attendance lagai hai?
    const alreadyMarked = await AttendanceRecord.findOne({
      userId,
      subjectId,
      date,
    });

    if (alreadyMarked) {
      return res.status(409).json({
        message: `Attendance already marked as ${alreadyMarked.status} for today.`,
        status: alreadyMarked.status,
      });
    }

    // Active code dhundho
    const activeCode = await AttendanceCode.findOne({
      subjectId,
      courseId,
      semester,
      isActive: true,
    });

    const now = new Date();

    // Validate code
    const isValid =
      activeCode &&
      activeCode.code === enteredCode.trim() &&
      now < new Date(activeCode.expiresAt);

    if (!isValid) {
      // Mark absent
      await AttendanceRecord.create({
        userId,
        userName,
        subjectId,
        subjectName,
        courseId,
        semester,
        date,
        status: "Absent",
        codeUsed: "—",
      });

      const reason =
        !activeCode
          ? "No active code found for this subject."
          : activeCode.code !== enteredCode.trim()
          ? "Entered code is incorrect."
          : "Code has expired (5 minute window passed).";

      return res.status(400).json({
        message: `❌ Attendance marked as Absent. ${reason}`,
        status: "Absent",
        reason,
      });
    }

    // Mark present
    const record = await AttendanceRecord.create({
      userId,
      userName,
      subjectId,
      subjectName,
      courseId,
      semester,
      date,
      status: "Present",
      codeUsed: enteredCode.trim(),
    });

    // Track who used this code
    activeCode.usedBy.push({ userId, userName, markedAt: now });
    await activeCode.save();

    return res.status(200).json({
      message: "✅ Attendance marked as Present!",
      status: "Present",
      data: record,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Attendance already marked for today.",
      });
    }
    console.error("verifyCode error:", err);
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};

/**
 * GET /api/attendance-code/active?subjectId=&courseId=&semester=
 * Teacher current active code dekh sakta hai.
 */
export const getActiveCode = async (req, res) => {
  try {
    const { subjectId, courseId, semester } = req.query;

    const activeCode = await AttendanceCode.findOne({
      subjectId,
      courseId,
      semester: Number(semester),
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (!activeCode) {
      return res.status(404).json({ message: "No active code found.", data: null });
    }

    return res.status(200).json({
      data: {
        _id: activeCode._id,
        code: activeCode.code,
        expiresAt: activeCode.expiresAt,
        usedByCount: activeCode.usedBy.length,
      },
    });
  } catch (err) {
    console.error("getActiveCode error:", err);
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};

/**
 * PATCH /api/attendance-code/deactivate/:id
 * Teacher manually code band kar sakta hai.
 */
export const deactivateCode = async (req, res) => {
  try {
    const updated = await AttendanceCode.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Code not found." });
    }

    return res.status(200).json({ message: "Code deactivated.", data: updated });
  } catch (err) {
    console.error("deactivateCode error:", err);
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};