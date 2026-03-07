import ExamTimetable from "../Models/examTimetableModel.js";


// CREATE TIME TABLE

export const createTimetable = async (req, res) => {
  try {
    const { course, semester, timetable } = req.body;

    const newTable = new ExamTimetable({
      course,
      semester,
      timetable,
    });

    await newTable.save();

    res.json({
      success: true,
      message: "Time Table Created",
      data: newTable,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// GET ALL TIME TABLES

export const getAllTimetables = async (req, res) => {
  try {
    const tables = await ExamTimetable.find().populate("course");

    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// UPDATE PARTICULAR ROW

export const updateRow = async (req, res) => {
  try {
    const { timetableId, rowIndex } = req.params;

    const { date, time, room } = req.body;

    const table = await ExamTimetable.findById(timetableId);

    if (!table) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    table.timetable[rowIndex].date = date;
    table.timetable[rowIndex].time = time;
    table.timetable[rowIndex].room = room;

    await table.save();

    res.json({
      message: "Row Updated",
      data: table,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// DELETE PARTICULAR ROW

export const deleteRow = async (req, res) => {
  try {
    const { timetableId, rowIndex } = req.params;

    const table = await ExamTimetable.findById(timetableId);

    if (!table) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    table.timetable.splice(rowIndex, 1);

    await table.save();

    res.json({
      message: "Row Deleted",
      data: table,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// DELETE COMPLETE TIMETABLE

export const deleteTimetable = async (req, res) => {
  try {
    const { id } = req.params;

    await ExamTimetable.findByIdAndDelete(id);

    res.json({
      message: "Timetable Deleted",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};