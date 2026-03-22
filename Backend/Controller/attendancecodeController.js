import AttendanceCode from "../Models/attendancecodeModel.js";
import AttendanceRecord from "../Models/attendancerecordModel.js";

const CODE_VALIDITY_MINUTES = 5;
const generateRandomCode = () => String(Math.floor(100000 + Math.random() * 900000));
const todayDate = () => new Date().toISOString().split("T")[0];

/**
 * POST /api/attendance-code/generate
 * Body: { subjectId, subjectName, courseId, courseName, semester }
 */
export const generateCode = async (req, res) => {
  try {
    const { subjectId, subjectName, courseId, courseName, semester } = req.body;

    if (!subjectId || !subjectName || !courseId || !courseName || semester === undefined) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Purane active codes sirf isActive false karo
    // autoAbsentProcessed false rahega — cron job unhe process karega
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
      courseName,
      semester: Number(semester),
      code,
      expiresAt,
      isActive: true,
      autoAbsentProcessed: false,
    });

    console.log(`[GenerateCode] New code created | subject: ${subjectName} | course: ${courseName} | sem: ${semester} | codeId: ${newCode._id}`);

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
 * Body: { enteredCode, subjectId, subjectName, courseId, semester, userId, userName }
 */
export const verifyCodeAndMarkAttendance = async (req, res) => {
  try {
    const {
      enteredCode, subjectId, subjectName,
      courseId, semester, userId, userName,
    } = req.body;

    if (!enteredCode || !subjectId || !userId || !userName) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const date = todayDate();

    // Active code dhundho
    const activeCode = await AttendanceCode.findOne({
      subjectId,
      courseId,
      semester: Number(semester),
      isActive: true,
    });

    const now = new Date();
    const isValid =
      activeCode &&
      activeCode.code === enteredCode.trim() &&
      now < new Date(activeCode.expiresAt);

    // CodeId: valid code ka _id, warna fallback unique string
    const codeId = activeCode
      ? String(activeCode._id)
      : `invalid_${date}_${userId}_${Date.now()}`;

    // Is codeId ke liye pehle se record hai?
    const alreadyMarked = await AttendanceRecord.findOne({
      userId,
      subjectId,
      codeId,
    });

    if (alreadyMarked) {
      return res.status(409).json({
        message: `Is session ki attendance already ${alreadyMarked.status} hai.`,
        status: alreadyMarked.status,
      });
    }

    if (!isValid) {
      const reason = !activeCode
        ? "No active code found."
        : activeCode.code !== enteredCode.trim()
        ? "Entered code is incorrect."
        : "Code has expired.";

      await AttendanceRecord.create({
        userId, userName, subjectId, subjectName, courseId,
        semester: Number(semester),
        date, status: "Absent",
        codeUsed: "—",
        codeId,
      });

      return res.status(400).json({
        message: `❌ Attendance marked as Absent. ${reason}`,
        status: "Absent",
        reason,
      });
    }

    // Present mark karo
    const record = await AttendanceRecord.create({
      userId, userName, subjectId, subjectName, courseId,
      semester: Number(semester),
      date, status: "Present",
      codeUsed: enteredCode.trim(),
      codeId: String(activeCode._id),
    });

    activeCode.usedBy.push({ userId, userName, markedAt: now });
    await activeCode.save();

    return res.status(200).json({
      message: "✅ Attendance marked as Present!",
      status: "Present",
      data: record,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Attendance already marked for this session." });
    }
    console.error("verifyCode error:", err);
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};

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
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const deactivateCode = async (req, res) => {
  try {
    const updated = await AttendanceCode.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Code not found." });
    return res.status(200).json({ message: "Code deactivated.", data: updated });
  } catch (err) {
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};