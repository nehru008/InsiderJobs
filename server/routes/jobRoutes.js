import express from "express";
import { getJobs, getJobById } from "../controllers/jobController.js";

const router = express.Router();

// get all jobs
router.get("/", getJobs);

// get job by id
router.get("/:id", getJobById);

export default router;
