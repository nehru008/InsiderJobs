import express from "express";
import { requireAuth } from "@clerk/express";

import { getUserData,applyForJob,updateUserResume, getUserJobApplications } from "../controllers/userController.js";
import upload from "../config/multer.js";

const router = express.Router(); 
//get user data
router.get("/user", requireAuth(), getUserData);

//apply for a job
router.post("/apply-job", requireAuth(), applyForJob);

//get user applied applications
router.get("/applications", requireAuth(), getUserJobApplications);

//update user profile resume
router.post("/update-resume", requireAuth(), upload.single('resume'), updateUserResume);

export default router;
