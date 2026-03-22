/**
 * autoAbsentJob.js
 * Path: Backend/Jobs/autoAbsentJob.js
 */

import cron from "node-cron";
import AttendanceCode from "../Models/attendancecodeModel.js";
import AttendanceRecord from "../Models/attendancerecordModel.js";
import User from "../Models/UserModels.js";

const todayDate = () => new Date().toISOString().split("T")[0];

// Enrolled students fetch karo — pure JS filter
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

      const inSem =
        String(user.semester ?? "").trim() === String(semester ?? "").trim();

      return isStudent && inDept && inSem;
    });

    console.log(`[AutoAbsent] Students found: ${filtered.length} | course: "${courseName}" | sem: "${semester}"`);
    return filtered;
  } catch (err) {
    console.error("[AutoAbsent] getEnrolledStudents error:", err.message);
    return [];
  }
}

// Ek expired code process karo
async function processExpiredCode(expiredCode) {
  const date = todayDate();
  const codeId = String(expiredCode._id);

  console.log(`[AutoAbsent] ═══ Processing: ${expiredCode.code} ═══`);
  console.log(`[AutoAbsent] Subject   : ${expiredCode.subjectName}`);
  console.log(`[AutoAbsent] CourseName: ${expiredCode.courseName}`);
  console.log(`[AutoAbsent] Semester  : ${expiredCode.semester}`);
  console.log(`[AutoAbsent] CodeId    : ${codeId}`);
  console.log(`[AutoAbsent] UsedBy    : ${expiredCode.usedBy?.length || 0} students`);

  // courseName missing — purana code skip
  if (!expiredCode.courseName) {
    console.log(`[AutoAbsent] courseName missing — skip`);
    await AttendanceCode.findByIdAndUpdate(expiredCode._id, {
      autoAbsentProcessed: true,
      isActive: false,
    });
    return;
  }

  // Present students ki Set
  const presentUserIds = new Set(
    (expiredCode.usedBy || []).map((u) => String(u.userId))
  );
  console.log(`[AutoAbsent] Present: [${[...presentUserIds].join(", ") || "koi nahi"}]`);

  // Enrolled students fetch
  const enrolledStudents = await getEnrolledStudents(
    expiredCode.courseName,
    expiredCode.semester
  );

  if (enrolledStudents.length === 0) {
    console.log(`[AutoAbsent] No students found — processed mark kar rahe hain`);
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

    // Present tha — skip
    if (presentUserIds.has(userId)) {
      console.log(`[AutoAbsent] ${userName} → Present tha, skip`);
      presentSkipped++;
      continue;
    }

    // Is codeId ke liye record already hai?
    const exists = await AttendanceRecord.findOne({ userId, subjectId: expiredCode.subjectId, codeId });
    if (exists) {
      console.log(`[AutoAbsent] ${userName} → Already exists (${exists.status}), skip`);
      alreadyExists++;
      continue;
    }

    // Absent mark karo
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
        codeId,
      });
      absentMarked++;
      console.log(`[AutoAbsent] ${userName} → ❌ ABSENT marked`);
    } catch (err) {
      if (err.code === 11000) {
        console.log(`[AutoAbsent] ${userName} → Duplicate (11000), skip`);
        alreadyExists++;
      } else {
        console.error(`[AutoAbsent] ${userName} → ERROR: ${err.message}`);
      }
    }
  }

  // Code processed mark karo
  await AttendanceCode.findByIdAndUpdate(expiredCode._id, {
    autoAbsentProcessed: true,
    isActive: false,
  });

  console.log(`[AutoAbsent] ─── Result ───────────────────────────`);
  console.log(`[AutoAbsent] Absent marked : ${absentMarked}`);
  console.log(`[AutoAbsent] Present skip  : ${presentSkipped}`);
  console.log(`[AutoAbsent] Already exists: ${alreadyExists}`);
  console.log(`[AutoAbsent] ───────────────────────────────────────`);
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

      console.log(`\n[AutoAbsent] ══════════════════════════════════════`);
      console.log(`[AutoAbsent] ${expiredCodes.length} expired code(s) at ${now.toLocaleTimeString()}`);
      console.log(`[AutoAbsent] ══════════════════════════════════════`);

      for (const code of expiredCodes) {
        await processExpiredCode(code);
      }
    } catch (err) {
      console.error("[AutoAbsent] Cron error:", err.message);
    }
  });

  console.log("[AutoAbsent] Cron job started — har minute check hoga");
}