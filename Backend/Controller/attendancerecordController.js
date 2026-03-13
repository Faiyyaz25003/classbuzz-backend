// import AttendanceRecord from "../Models/attendancerecordModel.js";

// /**
//  * GET /api/attendance-record/student?userId=&subjectId=
//  * Student apna ek subject ka poora record dekhe.
//  */
// export const getStudentSubjectRecords = async (req, res) => {
//   try {
//     const { userId, subjectId } = req.query;

//     if (!userId || !subjectId) {
//       return res.status(400).json({ message: "userId and subjectId required." });
//     }

//     const records = await AttendanceRecord.find({ userId, subjectId })
//       .sort({ date: -1 })
//       .lean();

//     const present = records.filter((r) => r.status === "Present").length;
//     const total = records.length;
//     const percentage = total ? Math.round((present / total) * 100) : 0;

//     return res.status(200).json({
//       data: records,
//       summary: { total, present, absent: total - present, percentage },
//     });
//   } catch (err) {
//     console.error("getStudentSubjectRecords error:", err);
//     return res.status(500).json({ message: "Server error.", error: err.message });
//   }
// };

// /**
//  * GET /api/attendance-record/teacher?subjectId=&date=
//  * Teacher ek subject ka ek din ka attendance sheet dekhe.
//  */
// export const getTeacherDayRecords = async (req, res) => {
//   try {
//     const { subjectId, date } = req.query;

//     if (!subjectId) {
//       return res.status(400).json({ message: "subjectId required." });
//     }

//     const query = { subjectId };
//     if (date) query.date = date;

//     const records = await AttendanceRecord.find(query)
//       .sort({ date: -1, markedAt: 1 })
//       .lean();

//     return res.status(200).json({ data: records });
//   } catch (err) {
//     console.error("getTeacherDayRecords error:", err);
//     return res.status(500).json({ message: "Server error.", error: err.message });
//   }
// };

// /**
//  * GET /api/attendance-record/check?userId=&subjectId=&date=
//  * Check karo ki student ne aaj attendance lagai hai ya nahi.
//  */
// export const checkTodayAttendance = async (req, res) => {
//   try {
//     const { userId, subjectId, date } = req.query;

//     const record = await AttendanceRecord.findOne({ userId, subjectId, date }).lean();

//     return res.status(200).json({
//       alreadyMarked: !!record,
//       record: record || null,
//     });
//   } catch (err) {
//     console.error("checkTodayAttendance error:", err);
//     return res.status(500).json({ message: "Server error.", error: err.message });
//   }
// };



import AttendanceRecord from "../Models/attendancerecordModel.js";

/**
 * GET /api/attendance-record/student?userId=&subjectId=
 * Student apna ek subject ka poora record dekhe.
 */
export const getStudentSubjectRecords = async (req, res) => {
  try {
    const { userId, subjectId } = req.query;

    if (!userId || !subjectId) {
      return res.status(400).json({ message: "userId and subjectId required." });
    }

    const records = await AttendanceRecord.find({ userId, subjectId })
      .sort({ date: -1 })
      .lean();

    const present = records.filter((r) => r.status === "Present").length;
    const total = records.length;
    const absent = total - present;
    const percentage = total ? Math.round((present / total) * 100) : 0;

    return res.status(200).json({
      data: records,
      summary: { total, present, absent, percentage },
    });
  } catch (err) {
    console.error("getStudentSubjectRecords error:", err);
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};

/**
 * GET /api/attendance-record/teacher?subjectId=&date=
 * Teacher ek subject ka ek din ka attendance sheet dekhe.
 */
export const getTeacherDayRecords = async (req, res) => {
  try {
    const { subjectId, date } = req.query;

    if (!subjectId) {
      return res.status(400).json({ message: "subjectId required." });
    }

    const query = { subjectId };
    if (date) query.date = date;

    const records = await AttendanceRecord.find(query)
      .sort({ date: -1, markedAt: 1 })
      .lean();

    return res.status(200).json({ data: records });
  } catch (err) {
    console.error("getTeacherDayRecords error:", err);
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};

/**
 * GET /api/attendance-record/check?userId=&subjectId=&date=
 * Check karo ki student ne aaj attendance lagai hai ya nahi.
 */
export const checkTodayAttendance = async (req, res) => {
  try {
    const { userId, subjectId, date } = req.query;

    if (!userId || !subjectId) {
      return res.status(400).json({ message: "userId and subjectId required." });
    }

    const record = await AttendanceRecord.findOne({ userId, subjectId, date }).lean();

    return res.status(200).json({
      alreadyMarked: !!record,
      record: record || null,
    });
  } catch (err) {
    console.error("checkTodayAttendance error:", err);
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};