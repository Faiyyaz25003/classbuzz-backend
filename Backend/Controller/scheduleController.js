
// import Schedule from "../Models/scheduleModels.js";

// // Create / Add new schedule
// export const addSchedule = async (req, res) => {
//   try {
//     const { courseId, semester, startTime, endTime, slotDuration, subjects, timetable } = req.body;

//     const newSchedule = new Schedule({
//       courseId,
//       semester,
//       startTime,
//       endTime,
//       slotDuration,
//       subjects,
//       timetable,
//     });

//     const savedSchedule = await newSchedule.save();
//     res.status(201).json(savedSchedule);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating schedule", error });
//   }
// };

// // Get all schedules
// export const getAllSchedules = async (req, res) => {
//   try {
//     const schedules = await Schedule.find().populate("courseId", "name");
//     res.status(200).json(schedules);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching schedules", error });
//   }
// };

// // Get schedule by ID
// export const getScheduleById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const schedule = await Schedule.findById(id).populate("courseId", "name");
//     if (!schedule) return res.status(404).json({ message: "Schedule not found" });
//     res.status(200).json(schedule);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching schedule", error });
//   }
// };



import Schedule from "../Models/scheduleModels.js";

// Create or Update Schedule
export const addSchedule = async (req, res) => {
  try {
    const { courseId, semester, startTime, endTime, slotDuration, subjects, timetable } = req.body;

    const updatedSchedule = await Schedule.findOneAndUpdate(
      { courseId, semester }, // check same course & semester
      { startTime, endTime, slotDuration, subjects, timetable }, // update fields
      { new: true, upsert: true } // upsert = create if not exists
    );

    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ message: "Error creating/updating schedule", error });
  }
};

export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate("courseId", "name");
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schedules", error });
  }
};

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
