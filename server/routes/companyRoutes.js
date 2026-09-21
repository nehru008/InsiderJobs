import express from "express";
import {
  registerCompany,
  loginCompany,
  getCompanyData,
  postJob,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  ChangeJobApplicantStatus,
  changeVisibility
} from "../controllers/companyController.js";
import upload from "../config/multer.js";
import { protectCompany } from "../middleware/authMiddleWare.js";

const router = express.Router();

// Register a company
router.post("/register", upload.single("image"), registerCompany);

// Company login
router.post("/login", loginCompany);

// Get company data
router.get("/company",protectCompany, getCompanyData);

// Post a job
router.post("/post-job",protectCompany, postJob);

// Get applicants data
router.get("/applicants",protectCompany, getCompanyJobApplicants);

// Get posted jobs
router.get("/list-jobs", protectCompany, getCompanyPostedJobs);

// Change application status
router.post("/change-status", protectCompany, ChangeJobApplicantStatus);

// Change application visibility
router.post("/change-visibility", protectCompany, changeVisibility);

export default router;
