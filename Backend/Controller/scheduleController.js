// import Schedule from "../Models/scheduleModels.js";

// // CREATE & UPDATE timetable
// export const saveSchedule = async (req, res) => {
//   try {
//     const { courseId, semester, timetable, subjects } = req.body;

//     // Check if already exists
//     const existing = await Schedule.findOne({ courseId, semester });

//     if (existing) {
//       existing.timetable = timetable;
//       existing.subjects = subjects;
//       await existing.save();
//       return res.status(200).json({ message: "Schedule Updated", schedule: existing });
//     }

//     const newSchedule = await Schedule.create({
//       courseId,
//       semester,
//       timetable,
//       subjects,
//     });

//     res.status(201).json({ message: "Schedule Created", schedule: newSchedule });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

// // GET timetable by course & semester
// export const getSchedule = async (req, res) => {
//   try {
//     const { courseId, semester } = req.params;

//     const schedule = await Schedule.findOne({ courseId, semester }).populate("courseId");

//     if (!schedule) return res.status(404).json({ message: "No schedule found" });

//     res.status(200).json(schedule);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

// // GET all saved schedules
// export const getAllSchedules = async (req, res) => {
//   try {
//     const schedules = await Schedule.find().populate("courseId");
//     res.status(200).json(schedules);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };


import Schedule from "../Models/scheduleModels.js";

// Create / Add new schedule
export const addSchedule = async (req, res) => {
  try {
    const { courseId, semester, startTime, endTime, slotDuration, subjects, timetable } = req.body;

    const newSchedule = new Schedule({
      courseId,
      semester,
      startTime,
      endTime,
      slotDuration,
      subjects,
      timetable,
    });

    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    res.status(500).json({ message: "Error creating schedule", error });
  }
};

// Get all schedules
export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate("courseId", "name");
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schedules", error });
  }
};

// Get schedule by ID
export const getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findById(id).populate("courseId", "name");
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schedule", error });
  }
};
