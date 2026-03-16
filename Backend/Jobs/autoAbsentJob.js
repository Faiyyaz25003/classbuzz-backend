/**
 * autoAbsentJob.js
 * Path: Backend/Jobs/autoAbsentJob.js
 */

import cron from "node-cron";
import AttendanceCode from "../Models/attendancecodeModel.js";
import AttendanceRecord from "../Models/attendancerecordModel.js";
import User from "../Models/UserModels.js";

const todayDate = () => new Date().toISOString().split("T")[0];

async function getEnrolledStudents(courseName, semester) {
  try {
    const allUsers = await User.find({}).lean();

    console.log(`[AutoAbsent] Total users in DB: ${allUsers.length}`);

    const filtered = allUsers.filter((user) => {

      // Position check
      const isStudent =
        Array.isArray(user.positions) &&
        user.positions.some(
          (p) => typeof p === "string" && p.toLowerCase() === "student"
        );

      // Department check — courseName se match
      const inDept =
        Array.isArray(user.departments) &&
        user.departments.some(
          (d) =>
            typeof d === "string" &&
            d.toLowerCase() === String(courseName).toLowerCase()
        );

      // Semester check — Number aur String dono handle karo
      const userSem = String(user.semester ?? "").trim();
      const codeSem = String(semester ?? "").trim();
      const inSem = userSem === codeSem;

      // Debug har user ke liye
      console.log(
        `[AutoAbsent] User: ${user.name} | isStudent: ${isStudent} | inDept: ${inDept} | userSem: "${userSem}" | codeSem: "${codeSem}" | inSem: ${inSem} | depts: ${JSON.stringify(user.departments)} | positions: ${JSON.stringify(user.positions)}`
      );

      return isStudent && inDept && inSem;
    });

    console.log(
      `[AutoAbsent] Enrolled students found: ${filtered.length} | courseName: "${courseName}" | semester: "${semester}"`
    );

    return filtered;
  } catch (err) {
    console.error("[AutoAbsent] DB fetch error:", err.message);
    return [];
  }
}

async function processExpiredCode(expiredCode) {
  const date = todayDate();

  console.log(`[AutoAbsent] ═══════════════════════════════════════`);
  console.log(`[AutoAbsent] Subject    : ${expiredCode.subjectName}`);
  console.log(`[AutoAbsent] SubjectId  : ${expiredCode.subjectId}`);
  console.log(`[AutoAbsent] CourseName : ${expiredCode.courseName}`);
  console.log(`[AutoAbsent] CourseId   : ${expiredCode.courseId}`);
  console.log(`[AutoAbsent] Semester   : ${expiredCode.semester}`);
  console.log(`[AutoAbsent] Date       : ${date}`);
  console.log(`[AutoAbsent] UsedBy     : ${JSON.stringify(expiredCode.usedBy)}`);
  console.log(`[AutoAbsent] ═══════════════════════════════════════`);

  // Agar courseName nahi hai toh process nahi kar sakte
  if (!expiredCode.courseName) {
    console.log(`[AutoAbsent] ⚠️  courseName missing — yeh purana code hai, skip kar rahe hain`);
    await AttendanceCode.findByIdAndUpdate(expiredCode._id, {
      autoAbsentProcessed: true,
      isActive: false,
    });
    return;
  }

  const presentUserIds = new Set(
    (expiredCode.usedBy || []).map((u) => String(u.userId))
  );
  console.log(`[AutoAbsent] Present users: ${[...presentUserIds].join(", ") || "none"}`);

  const enrolledStudents = await getEnrolledStudents(
    expiredCode.courseName,
    expiredCode.semester
  );

  if (enrolledStudents.length === 0) {
    console.log(`[AutoAbsent] ⚠️  No students found — processed mark kar rahe hain`);
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

    if (presentUserIds.has(userId)) {
      console.log(`[AutoAbsent] ${userName} → Already Present, skip`);
      presentSkipped++;
      continue;
    }

    const exists = await AttendanceRecord.findOne({
      userId,
      subjectId: expiredCode.subjectId,
      date,
    });

    if (exists) {
      console.log(`[AutoAbsent] ${userName} → Record exists (${exists.status}), skip`);
      alreadyExists++;
      continue;
    }

    try {
      await AttendanceRecord.create({
        userId,
        userName,
        subjectId: expiredCode.subjectId,
        subjectName: expiredCode.subjectName,
        courseId: expiredCode.courseId,
        // semester Number mein save karo (AttendanceRecord model Number expect karta hai)
        semester: Number(expiredCode.semester),
        date,
        status: "Absent",
        codeUsed: "auto-absent",
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

  await AttendanceCode.findByIdAndUpdate(expiredCode._id, {
    autoAbsentProcessed: true,
    isActive: false,
  });

  console.log(`[AutoAbsent] ── Result ────────────────────────────`);
  console.log(`[AutoAbsent] Absent marked  : ${absentMarked}`);
  console.log(`[AutoAbsent] Present skipped: ${presentSkipped}`);
  console.log(`[AutoAbsent] Already existed: ${alreadyExists}`);
  console.log(`[AutoAbsent] ─────────────────────────────────────`);
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

      console.log(
        `[AutoAbsent] ✅ ${expiredCodes.length} expired code(s) found at ${now.toLocaleTimeString()}`
      );

      for (const code of expiredCodes) {
        await processExpiredCode(code);
      }
    } catch (err) {
      console.error("[AutoAbsent] Cron error:", err.message);
    }
  });

  console.log("[AutoAbsent] ✅ Cron job started — har minute check hoga");
}