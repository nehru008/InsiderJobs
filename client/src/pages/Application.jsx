
import { assets, jobsApplied } from "../assets/assets";
import Navbar from "../components/Navbar"
import { useState } from "react";
import moment from "moment";
import Footer from "../components/Footer";
import { useContext } from "react";
import { AppContext } from "../context/AppContext"; 
import { useUser,  useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

const Application = () => {
  const {user}=useUser();
  const {getToken}=useAuth();

  const [isEdit, setIsEdit] = useState(false);
  const [Resume,setResume]=useState(null);
  const {userData,userApplications,backendUrl,fetchUserData,fetchUserApplications}=useContext(AppContext);

  const updateResume= async ()=>{
    try{
      const formData=new FormData();
      const token = await getToken();
      formData.append("resume",Resume);
      const {data}= await axios.post(backendUrl+"/api/users/update-resume",
        formData,{headers:{Authorization:`Bearer ${token}`}});
        if(data.success){
          toast.success(data.message);
           await fetchUserData();
        }else{
          toast.error(data.message);
        }
    }
    catch(err){
      toast.error(err.message);
    }
    setIsEdit(false);
    setResume(null);
  }
  useEffect(()=>{
    if(user){
      fetchUserApplications();
    } 
  },[user]);
  return (
    <> 
    <Navbar></Navbar>
    <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
      <h2 className="text-xl font-semibold">Your Resume</h2>
      <div className="flex gap-2 mb-6 mt-3">
        {
          isEdit || (userData && !userData.resume)
          ?<>
            <label className="flex items-center" htmlFor="resumeUpload">
            <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2">{Resume ? Resume.name :"Select Resume"}</p>
            <input type="file" id="resumeUpload" accept="application/pdf" className="hidden" onChange={(e)=>setResume(e.target.files[0])} />
            <img src={assets.profile_upload_icon} alt="" />
            </label>
            <button onClick={updateResume} className="bg-green-100 border border-green-400 rounded-lg px-4 py-2 cursor-pointer">Save</button>
            
          </>
          :
          <div className="flex gap-2">
            <a href={userData.resume} target="_blank" rel="noopener noreferrer" className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg" >
              Resume
            </a>
            <button className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2 cursor-pointer" onClick={()=>setIsEdit(true)}>
              Edit
            </button>
          </div>
        }
      </div>
      <h2 className="text-xl font-semibold mb-4">Applied Jobs</h2>
      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr>
            <th className="py-3 px-4 border-b text-left">Company</th>
            <th className="py-3 px-4 border-b text-left">Job Title</th>
            <th className="py-3 px-4 border-b text-left max-sm:hidden">Location</th>
            <th className="py-3 px-4 border-b text-left max-sm:hidden">Date</th>
            <th className="py-3 px-4 border-b text-left">Status</th>
          </tr>
        </thead>
        <tbody>
  {userApplications.map((job, index) =>
    job.companyId && job.jobId ? (
      <tr key={index}>
        <td className="py-3 px-4 border-b flex items-center gap-2">
          <img
            className="w-8 h-8"
            src={job.companyId.image}
            alt=""
          />
          {job.companyId.name}
        </td>

        <td className="py-2 px-4 border-b">{job.jobId.title}</td>
        <td className="py-2 px-4 border-b max-sm:hidden">{job.jobId.location}</td>
        <td className="py-2 px-4 border-b max-sm:hidden">
          {moment(job.date).format("ll")}
        </td>

        <td className="py-2 px-4 border-b">
          <span
            className={`${
              job.status === "Accepted"
                ? "bg-green-100 text-green-600"
                : job.status === "Pending"
                ? "bg-blue-100"
                : "bg-red-100"
            } px-3 py-1 rounded-full text-sm`}
          >
            {job.status}
          </span>
        </td>
      </tr>
    ) : null
  )}
</tbody>


      </table>
    </div>
    <Footer></Footer>
    </>
  )
}

export default Application
