import cron from "node-cron";
import AttendanceCode from "../Models/attendancecodeModel.js"
import AttendanceRecord from "../Models/attendancerecordModel.js"
import User from "../Models/UserModels.js" // apna User model ka path adjust karo

/**
 * AUTO-ABSENT JOB
 * ─────────────────────────────────────────────────────────────────
 * Ye job har 1 minute mein chalti hai.
 * Logic:
 *  1. Saare aise codes dhundho jo:
 *     - isActive: true  (abhi active hain)
 *     - expiresAt <= now  (5-min window expire ho gayi)
 *     - autoAbsentProcessed: false  (pehle process nahi hua)
 *  2. Us subject ke saare enrolled students dhundho
 *  3. Jo students ne aaj attendance nahi di → unhe Absent mark karo
 *  4. Code ko autoAbsentProcessed: true aur isActive: false kar do
 * ─────────────────────────────────────────────────────────────────
 */

const todayDate = () => new Date().toISOString().split("T")[0];

export const startAutoAbsentJob = () => {
  // Har 1 minute pe check karo
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const date = todayDate();

      // Step 1: Expired but unprocessed codes dhundho
      const expiredCodes = await AttendanceCode.find({
        isActive: true,
        expiresAt: { $lte: now },
        autoAbsentProcessed: { $ne: true },
      });

      if (expiredCodes.length === 0) return;

      console.log(`[AutoAbsent] ${expiredCodes.length} expired code(s) found. Processing...`);

      for (const code of expiredCodes) {
        const { subjectId, subjectName, courseId, semester } = code;

        // Step 2: Is course+semester ke saare students dhundho
        const students = await User.find({
          courseId,
          semester,
          role: "student",
        }).lean();

        let absentCount = 0;

        for (const student of students) {
          // Step 3: Check karo kya aaj attendance already mark hai
          const alreadyMarked = await AttendanceRecord.findOne({
            userId: student._id,
            subjectId,
            date,
          });

          if (!alreadyMarked) {
            // Auto absent mark karo
            await AttendanceRecord.create({
              userId: student._id,
              userName: student.name,
              subjectId,
              subjectName,
              courseId,
              semester,
              date,
              status: "Absent",
              codeUsed: "AUTO-ABSENT",
              markedAt: now,
            });
            absentCount++;
          }
        }

        // Step 4: Code ko processed mark karo
        await AttendanceCode.findByIdAndUpdate(code._id, {
          isActive: false,
          autoAbsentProcessed: true,
        });

        console.log(
          `[AutoAbsent] Subject: "${subjectName}" | ${absentCount} student(s) marked Absent automatically.`
        );
      }
    } catch (err) {
      console.error("[AutoAbsent] Cron job error:", err.message);
    }
  });

  console.log("[AutoAbsent] Auto-absent cron job started (runs every 1 min).");
};