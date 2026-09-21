import { createContext, useEffect, useState } from "react";


import { toast } from "react-toastify";
import axios from "axios";
export const AppContext = createContext();
import { useUser,  useAuth } from "@clerk/clerk-react";

const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL ;
  const {user}=useUser();
  const {getToken}=useAuth();
  
  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [companyToken, setCompanyToken] = useState(null); 
  const [companyData, setCompanyData] = useState(null);

  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);
  //Function to fetch jobs based on search filter can be added here
  const fetchJobs = async () => {
    try{
      const {data}= await axios.get(backendUrl+"/api/jobs");
      if(data.success){
        setJobs(data.jobs);
        console.log(data.jobs);
      }else{
        toast.error(data.message);
      }
    }catch(err){
      toast.error(err.message);
    }
  };
  //Function to fetch company data if token exists
  const fetchCompanyData = async () => {
    try{
      const {data}=await axios.get(backendUrl+"/api/company/company",{headers:{token:companyToken}});
      if(data.success){
        setCompanyData(data.company);
        console.log(data);
      }
      else{
        toast.error(data.message);
      }

    }catch(err){
      toast.error(err.message);
    }
  }
  //Function to fetch user data and applications can be added here
  const fetchUserData = async () => {
    try{
      const token = await getToken();
      const {data}=await axios.get(backendUrl+"/api/users/user",
        {headers:{Authorization:`Bearer ${token}`}});
        if(data.success){
          setUserData(data.user);
          console.log(data.user);
        }
        else{
          toast.error(data.message);
        }
    }
    catch(err){
      toast.error(err.message);
    }
  }
  //Funtion to fetch users applied aplications data
  const fetchUserApplications = async () => {
    try{
      const token = await getToken();
      const {data}=await axios.get(backendUrl+"/api/users/applications",
        {headers:{Authorization:`Bearer ${token}`}});
        if(data.success){
          setUserApplications(data.applications);

        }
        else{
          toast.error(data.message);
        }
    } catch(err){
    toast.error(err.message);
  } 
  }
 

  useEffect(() => {
    fetchJobs();
    const storedCompanyToken = localStorage.getItem("companyToken");
    if(storedCompanyToken){
      setCompanyToken(storedCompanyToken);
    }
  }, []);

  useEffect(() => {
if(companyToken){
  fetchCompanyData();
}
  },[companyToken]);

  useEffect(() => {
    if(user){
      fetchUserData();
      fetchUserApplications();
    }
  },[user]);
  
  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    fetchJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    backendUrl,
    userData,
    setUserData,
    userApplications,
    setUserApplications,
    fetchUserData,
    fetchUserApplications,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
