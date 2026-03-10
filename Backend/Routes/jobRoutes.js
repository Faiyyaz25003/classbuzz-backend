import express from "express";

import {
    createJob,
    getJobs,
    getSingleJob,
    updateJob,
    deleteJob,
} from "../Controller/jobController.js";

const router = express.Router();

router.post("/create", createJob);

router.get("/all", getJobs);

router.get("/:id", getSingleJob);

router.put("/update/:id", updateJob);

router.delete("/delete/:id", deleteJob);

export default router;