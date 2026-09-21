import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary";
import generateToken from "../utils/generateTokens.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
//Register new company
export const registerCompany = async(req, res) => {
const {name,email,password}=req.body;
const imagefile=req.file;
if(!name || !email || !password || !imagefile){
    return res.json({success:false,message:"All fields are required"});
}
//company exists
try{
    const companyExists=await Company.findOne({email});
    if(companyExists){
        return res.json({success:false,message:"Company already registered"});
    }
    //hash password
    const salt=await bcrypt.genSalt(10);
    const hashPassword=await bcrypt.hash(password,salt);

    //Image upload to cloudinary
    const imageUplaod=await cloudinary.uploader.upload(imagefile.path);
    //create company
    const company = await Company.create({
        name,
        email,
        password:hashPassword,
        image:imageUplaod.secure_url
    });
    res.json({
        success:true,
        company:{
            _id:company._id,
            name:company.name,
            email:company.email,
            image:company.image
        },
        //Now tokens will be generated to add company authentication in future requests
        token: generateToken(company._id)
    })

}catch(err){
    return res.json({success:false,message:"Something went wrong"});
}

}
//Company login
export const loginCompany = async(req, res) => {
    const {email,password}=req.body;
    try{
        const company=await Company.findOne({email});
        const isMatch = await bcrypt.compare(password, company.password);
        if(isMatch){
            return res.json({
                success:true,
                company:{
                    _id:company._id,
                    name:company.name,
                    email:company.email,
                    image:company.image
                },
                token:generateToken(company._id)
            });
        }
        else {
            res.json({success:false, message:"Invalid email or password"});
        }
    }
    catch(err){
        return res.json({success:false,message:err.message});
    }
}
//Get company data
export const getCompanyData = async(req, res) => {
    try{
        const company=req.company;
        res.json({success:true,company});
    }
    catch(err){
        return res.json({success:false,message:err.message});
    }

}
//Post new job
export const postJob =  async(req, res) => {
    const {title,description,level,category,location,salary}=req.body;
    const companyId=req.company._id;
    try{
        const newJob=new Job({
            title,
            description,
            level,
            category,
            location,
            salary,
            companyId,
    });
    await newJob.save();
    res.json({success:true,newJob});
    }catch(err){
        return res.json({success:false,message:err.message});
}
}
//Get company job applicants
export const getCompanyJobApplicants = async(req, res) => {
    try{
        const companyId=req.company._id;

        //Find job appliations for the user and populate job and user data
        const applications=await JobApplication.find({companyId})
        .populate('userId','name image resume')
        .populate('jobId','title description level category location salary')
        .exec();
        
        return res.json({success:true,applications});
    }
    catch(err){
        return res.json({success:false,message:err.message});
    }
}

//Get company posted jobs
export const getCompanyPostedJobs = async(req, res) => {
    try{
        const companyId=req.company._id;
        const jobs=await Job.find({companyId});
        // adding no of applicants info in data
        const jobsData=await Promise.all(jobs.map(async(job)=>{
            const applicants=await JobApplication.find({jobId:job._id});
            return {...job.toObject(),applicants:applicants.length};
        }));
        res.json({success:true,jobsData});
    }
    catch(err){
        return res.json({success:false,message:err.message});
    }
}

//Change job Appilicant status : Accepted/Rejected
export const ChangeJobApplicantStatus = async(req, res) => {
    try{
        const {id,status} = req.body;
        //Find the application and update status
        await JobApplication.findByIdAndUpdate({_id:id},{status});

        res.json({success:true,message:"Status updated successfully"});
    }
    catch(err){
        return res.json({success:false,message:err.message});
    }
}

//Change job visibility 
export const changeVisibility = async(req, res) => {
    try{
        const {id} = req.body;
        const companyId=req.company._id;

        const job=await Job.findById(id);
        if(companyId.toString()===job.companyId.toString()){
            job.visible = !job.visible;
        }
        await job.save();
        res.json({success:true,job});

    }
    catch(err){
        return res.json({success:false,message:err.message});
    }
}