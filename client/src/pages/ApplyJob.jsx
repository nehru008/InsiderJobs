import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import kconvert from "k-convert";
import moment from "moment";
import Jobcard from "../components/Jobcard";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";


const ApplyJob = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [JobData, setJobData] = useState(null);
  const [isAlreadyApplied, setsApplied] = useState(false);
  const { jobs, backendUrl, userData, userApplications, fetchUserApplications } = useContext(AppContext);

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(backendUrl + `/api/jobs/${id}`);
      if (data.success) {
        setJobData(data.job);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }
  //function to apply
  const applyHandler = async () => {
    try {
      if (!userData) {
        return toast.error("Please login to apply for the job");
      }
      if (!userData.resume) {
        navigate('/applications');
        return toast.error("Upload your resume before applying ");
      }
      const token = await getToken();
      const { data } = await axios.post(backendUrl + "/api/users/apply-job",
        { jobId: JobData._id }, { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) {
        toast.success(data.message);
        fetchUserApplications();
      } else {
        toast.error(data.message);
      }

    } catch (err) {
      toast.error(err.message);
    }
  }

  const checkAlreadyApplied = () => {
    const hasApplied = userApplications.some(
      item => item.jobId && item.jobId._id === JobData._id
    );
    setsApplied(hasApplied);
  };


  useEffect(() => {
    if (jobs.length > 0) {
      fetchJob();
    }
  }, [id, jobs]);

  useEffect(() => {
    if (JobData && userApplications.length > 0) {
      checkAlreadyApplied();
    }
  }, [JobData, userApplications, id])

  return JobData ? (
    <>
      <Navbar></Navbar>
      <div className="min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border-sky-400 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <img className="h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border" src={JobData.companyId.image} alt="" />
              <div className="text-center md:text-left text-natural-700">
                <h1 className="text-2xl sm:text-4xl font-medium">{JobData.title}</h1>
                <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="" />
                    {JobData.companyId.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} alt="" />
                    {JobData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="" />
                    {JobData.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="" />
                    CTC: {kconvert.convertTo(JobData.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center ">
              <button className="bg-blue-600 p-2.5 px-10 text-white rounded cursor-pointer" onClick={applyHandler} >{isAlreadyApplied ? "Already Applied" : "Apply Now"}</button>
              <p className="mt-1 text-gray-600">Posted {moment(JobData.date).fromNow()}</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start">
            <div className="w-full lg:w-3/5">
              <h2 className="font-bold text-2xl mb-4">Job Description</h2>
              <div className="rich-text" dangerouslySetInnerHTML={{ __html: JobData.description }}></div>
              <button className="bg-blue-600 p-2.5 px-10 text-white rounded cursor-pointer" onClick={applyHandler}>{isAlreadyApplied ? "Already Applied" : "Apply Now"}</button>
            </div>
            {/* SideBar More Jobs */}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2>More Jobs from {JobData.companyId.name}</h2>
              {jobs
                .filter(
                  (job) =>
                    job.companyId._id === JobData.companyId._id &&
                    job._id !== JobData._id
                )
                .filter((job) => {
                  // Set of applied jobs (SAFE)
                  const appliedJobsIds = new Set(
                    userApplications.map(
                      app => app.jobId && app.jobId._id
                    )
                  );

                  // Return true for jobs which are not applied by user
                  return !appliedJobsIds.has(job._id);
                })
                .slice(0, 4)
                .map((job, index) => (
                  <Jobcard key={index} job={job} />
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  )
    : (
      <Loading></Loading>
    )
}

export default ApplyJob
