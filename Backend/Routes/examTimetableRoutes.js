import express from "express";

import {
    createTimetable,
    getAllTimetables,
    updateRow,
    deleteRow,
    deleteTimetable,
} from "../Controller/examTimetableController.js";

const router = express.Router();


// CREATE
router.post("/", createTimetable);


// GET ALL
router.get("/", getAllTimetables);


// UPDATE PARTICULAR ROW
router.put("/:timetableId/row/:rowIndex", updateRow);


// DELETE PARTICULAR ROW
router.delete("/:timetableId/row/:rowIndex", deleteRow);


// DELETE COMPLETE TIMETABLE
router.delete("/:id", deleteTimetable);

export default router;