import AttendanceRecord from "../Models/attendancerecordModel.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

// ─────────────────────────────────
// STUDENT SUBJECT RECORD
// ─────────────────────────────────
export const getStudentSubjectRecords = async (req, res) => {
  try {
    const { userId, subjectId } = req.query;
    if (!userId || !subjectId) {
      return res.status(400).json({ message: "userId and subjectId required." });
    }

    const records = await AttendanceRecord.find({ userId, subjectId })
      .sort({ date: -1, createdAt: -1 })
      .lean();

    const present = records.filter((r) => r.status === "Present").length;
    const total = records.length;
    const absent = total - present;
    const percentage = total ? Math.round((present / total) * 100) : 0;

    res.status(200).json({
      data: records,
      summary: { total, present, absent, percentage },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────
// TEACHER DAILY RECORD
// ─────────────────────────────────
export const getTeacherDayRecords = async (req, res) => {
  try {
    const { subjectId, date } = req.query;
    if (!subjectId) {
      return res.status(400).json({ message: "subjectId required." });
    }

    const query = { subjectId };
    if (date) query.date = date;

    const records = await AttendanceRecord.find(query)
      .sort({ date: -1, createdAt: -1 })
      .lean();

    res.status(200).json({ data: records });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────
// CHECK TODAY ATTENDANCE
// ─────────────────────────────────
export const checkTodayAttendance = async (req, res) => {
  try {
    const { userId, subjectId, date } = req.query;
    if (!userId || !subjectId) {
      return res.status(400).json({ message: "userId and subjectId required." });
    }
    const record = await AttendanceRecord.findOne({ userId, subjectId, date }).lean();
    res.status(200).json({ alreadyMarked: !!record, record: record || null });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────
// WEEKLY ATTENDANCE REPORT
// ─────────────────────────────────
export const getWeeklyReport = async (req, res) => {
  try {
    const { courseId, semester, subjectId } = req.query;
    if (!courseId || !semester || !subjectId) {
      return res.status(400).json({ message: "courseId, semester, subjectId required." });
    }

    const today = new Date();
    const last7DaysStr = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      last7DaysStr.push(d.toISOString().slice(0, 10));
    }

    const records = await AttendanceRecord.find({ courseId, semester, subjectId }).lean();

    const report = {};
    last7DaysStr.forEach((dateStr) => {
      report[dateStr] = { present: 0, absent: 0 };
    });

    records.forEach((r) => {
      const dateStr =
        typeof r.date === "string"
          ? r.date.slice(0, 10)
          : new Date(r.date).toISOString().slice(0, 10);

      if (report[dateStr] !== undefined) {
        if (r.status === "Present") report[dateStr].present++;
        else report[dateStr].absent++;
      }
    });

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────
// SUBJECT WISE PERCENTAGE
// ─────────────────────────────────
export const subjectPercentage = async (req, res) => {
  try {
    const { courseId, semester } = req.query;
    if (!courseId || !semester) {
      return res.status(400).json({ message: "courseId and semester required." });
    }

    const records = await AttendanceRecord.find({ courseId, semester }).lean();
    const result = {};

    records.forEach((r) => {
      const key = r.subjectName || r.subjectId || "Unknown";
      if (!result[key]) result[key] = { present: 0, total: 0 };
      result[key].total++;
      if (r.status === "Present") result[key].present++;
    });

    const final = Object.keys(result).map((sub) => ({
      subject: sub,
      percentage: result[sub].total
        ? Math.round((result[sub].present / result[sub].total) * 100)
        : 0,
    }));

    res.json(final);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────
// EXPORT EXCEL
// ─────────────────────────────────
export const exportExcel = async (req, res) => {
  try {
    const records = await AttendanceRecord.find().lean();
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Attendance");

    sheet.columns = [
      { header: "Student", key: "userName", width: 25 },
      { header: "Subject", key: "subjectName", width: 25 },
      { header: "Date", key: "date", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "Code Used", key: "codeUsed", width: 15 },
    ];

    records.forEach((r) => {
      sheet.addRow({
        userName: r.userName || "",
        subjectName: r.subjectName || r.subjectId || "",
        date: typeof r.date === "string" ? r.date : new Date(r.date).toISOString().slice(0, 10),
        status: r.status,
        codeUsed: r.codeUsed || "—",
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=attendance.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────
// EXPORT PDF
// ─────────────────────────────────
export const exportPDF = async (req, res) => {
  try {
    const records = await AttendanceRecord.find().lean();
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=attendance.pdf");
    doc.pipe(res);

    doc.fontSize(20).text("Attendance Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(11).font("Helvetica-Bold")
      .text("Student  |  Subject  |  Date  |  Status", { underline: true });
    doc.moveDown(0.5);

    records.forEach((r) => {
      const dateStr = typeof r.date === "string" ? r.date : new Date(r.date).toISOString().slice(0, 10);
      doc.font("Helvetica").fontSize(10).text(
        `${r.userName || "N/A"}  |  ${r.subjectName || r.subjectId || "N/A"}  |  ${dateStr}  |  ${r.status}`
      );
    });

    doc.end();
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
};