/**
 * autoAbsentJob.js
 * Path: Backend/Jobs/autoAbsentJob.js
 *
 * Har expired code ke liye separately process karta hai.
 * Ek din mein multiple codes = multiple records per student.
 */

import cron from "node-cron";
import AttendanceCode from "../Models/attendancecodeModel.js";
import AttendanceRecord from "../Models/attendancerecordModel.js";
import User from "../Models/UserModels.js";

const todayDate = () => new Date().toISOString().split("T")[0];

async function getEnrolledStudents(courseName, semester) {
  try {
    const allUsers = await User.find({}).lean();

    const filtered = allUsers.filter((user) => {
      const isStudent =
        Array.isArray(user.positions) &&
        user.positions.some((p) => typeof p === "string" && p.toLowerCase() === "student");

      const inDept =
        Array.isArray(user.departments) &&
        user.departments.some(
          (d) => typeof d === "string" &&
            d.toLowerCase() === String(courseName).toLowerCase()
        );

      const userSem = String(user.semester ?? "").trim();
      const codeSem = String(semester ?? "").trim();
      const inSem = userSem === codeSem;

      return isStudent && inDept && inSem;
    });

    console.log(`[AutoAbsent] Students found: ${filtered.length} | course: "${courseName}" | sem: "${semester}"`);
    return filtered;
  } catch (err) {
    console.error("[AutoAbsent] DB fetch error:", err.message);
    return [];
  }
}

async function processExpiredCode(expiredCode) {
  const date = todayDate();
  const codeId = String(expiredCode._id);

  console.log(`[AutoAbsent] ── Processing code: ${expiredCode.code} ──────────`);
  console.log(`[AutoAbsent] Subject   : ${expiredCode.subjectName}`);
  console.log(`[AutoAbsent] CourseName: ${expiredCode.courseName}`);
  console.log(`[AutoAbsent] Semester  : ${expiredCode.semester}`);
  console.log(`[AutoAbsent] CodeId    : ${codeId}`);
  console.log(`[AutoAbsent] UsedBy    : ${JSON.stringify(expiredCode.usedBy)}`);

  // Agar courseName nahi hai — purana code, skip
  if (!expiredCode.courseName) {
    console.log(`[AutoAbsent] courseName missing — purana code, skip`);
    await AttendanceCode.findByIdAndUpdate(expiredCode._id, {
      autoAbsentProcessed: true,
      isActive: false,
    });
    return;
  }

  // Jo students ne is specific code se present mark kiya
  const presentUserIds = new Set(
    (expiredCode.usedBy || []).map((u) => String(u.userId))
  );

  const enrolledStudents = await getEnrolledStudents(
    expiredCode.courseName,
    expiredCode.semester
  );

  if (enrolledStudents.length === 0) {
    console.log(`[AutoAbsent] No students found — marking processed`);
    await AttendanceCode.findByIdAndUpdate(expiredCode._id, {
      autoAbsentProcessed: true,
      isActive: false,
    });
    return;
  }

  let absentMarked = 0;
  let presentSkipped = 0;
  let alreadyExists = 0;

  for (const student of enrolledStudents) {
    const userId = String(student._id);
    const userName = student.name || student.email || "Student";

    // Is student ne is code se present kiya?
    if (presentUserIds.has(userId)) {
      console.log(`[AutoAbsent] ${userName} → Present tha, skip`);
      presentSkipped++;
      continue;
    }

    // Is codeId ke liye pehle se record hai? (double processing se bachao)
    const exists = await AttendanceRecord.findOne({ userId, subjectId: expiredCode.subjectId, codeId });

    if (exists) {
      console.log(`[AutoAbsent] ${userName} → Record already exists (${exists.status}), skip`);
      alreadyExists++;
      continue;
    }

    // Absent mark karo is code ke liye
    try {
      await AttendanceRecord.create({
        userId,
        userName,
        subjectId: expiredCode.subjectId,
        subjectName: expiredCode.subjectName,
        courseId: expiredCode.courseId,
        semester: Number(expiredCode.semester),
        date,
        status: "Absent",
        codeUsed: "auto-absent",
        codeId,   // ← is code ka ID — alag session ka alag record
      });
      absentMarked++;
      console.log(`[AutoAbsent] ${userName} → ❌ ABSENT marked`);
    } catch (err) {
      if (err.code === 11000) {
        console.log(`[AutoAbsent] ${userName} → Duplicate, skip`);
      } else {
        console.error(`[AutoAbsent] ${userName} → Error: ${err.message}`);
      }
    }
  }

  // Code processed mark karo
  await AttendanceCode.findByIdAndUpdate(expiredCode._id, {
    autoAbsentProcessed: true,
    isActive: false,
  });

  console.log(`[AutoAbsent] ── Result: Absent: ${absentMarked} | Present skip: ${presentSkipped} | Already had: ${alreadyExists}`);
}

export function startAutoAbsentJob() {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const expiredCodes = await AttendanceCode.find({
        expiresAt: { $lt: now },
        autoAbsentProcessed: false,
      });

      if (expiredCodes.length === 0) return;

      console.log(`[AutoAbsent] ${expiredCodes.length} expired code(s) at ${now.toLocaleTimeString()}`);

      for (const code of expiredCodes) {
        await processExpiredCode(code);
      }
    } catch (err) {
      console.error("[AutoAbsent] Cron error:", err.message);
    }
  });

  console.log("[AutoAbsent] Cron job started — har minute check hoga");
}