import User from "../models/User.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";   
import {v2 as cloudinary} from "cloudinary";
import { clerkClient } from "@clerk/express";

//Get user data
export const getUserData = async(req, res) => {
    const userId=req.auth().userId;
    try{
        let user= await User.findById(userId);

        // If user not found in DB (webhook may not have fired), auto-create from Clerk data
        if(!user){
            try{
                const clerkUser = await clerkClient.users.getUser(userId);
                user = await User.create({
                    _id: userId,
                    name: (clerkUser.firstName || "") + " " + (clerkUser.lastName || ""),
                    email: clerkUser.emailAddresses[0].emailAddress,
                    image: clerkUser.imageUrl,
                    resume: ""
                });
            }catch(clerkErr){
                console.log("Error fetching user from Clerk:", clerkErr.message);
                return res.json({success:false, message:"User not found"});
            }
        }
        res.json({success:true,user});
    }
    catch(err){
        return res.json({success:false,message:err.message});   
        }
}

//Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.auth().userId;

    const isAlreadyApplied = await JobApplication.findOne({
      jobId,
      userId,
    });

    if (isAlreadyApplied) {
      return res.json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const jobData = await Job.findById(jobId);
    if (!jobData) {
      return res.json({
        success: false,
        message: "Job not found",
      });
    }

    await JobApplication.create({
      userId,
      companyId: jobData.companyId,
      jobId,
      date: Date.now(),
    });

    return res.json({
      success: true,
      message: "Job application submitted successfully",
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err.message,
    });
  }
};


//Get user applied applications
export const getUserJobApplications = async(req, res) => {
    try{
        const userId=req.auth().userId;
        const applications=await JobApplication.find({userId})
        .populate('companyId','name email image')
        .populate('jobId','title description level category location salary')
        .exec();
        
        if(!applications){
            return res.json({success:false,message:"No applications found from this user"});
        }
        res.json({success:true,applications});


    }
    catch(err){
        return res.json({success:false,message:err.message});
    }
}

//update user profile resume
export const updateUserResume = async(req, res) => {
    // In form data, resume file is sent with key 'resume'
    try{
        const userId=req.auth().userId;
        const resumeFile=req.file;

        const userData=await User.findById(userId);

        if(resumeFile){
            //upload resume to cloudinary
            const resumeUpload=await cloudinary.uploader.upload(resumeFile.path);
            userData.resume=resumeUpload.secure_url;
        }
        await userData.save();
        return res.json({success:true,message:"Resume updated successfully"});
    }
    catch(err){
        return res.json({success:false,message:err.message});
    }
}