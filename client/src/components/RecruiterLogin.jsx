import React, { use, useState } from 'react'
import { AppContext } from '../context/AppContext.jsx';
import { useContext, } from 'react';
import { useEffect } from 'react';
import { assets } from '../assets/assets.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 

const RecruiterLogin = () => {
    const navigate = useNavigate();

    const [state, setState] = useState('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [image, setImage] = useState(false);

    const[isNextDataSubmitted,setIsNextDataSubmitted]=useState(false);
    const{setShowRecruiterLogin,backendUrl,setCompanyToken,setCompanyData}=useContext(AppContext);
    
    const handleSubmit= async(e) =>{
        e.preventDefault();
        //handle login or signup logic here
        if(state==='signup' && !isNextDataSubmitted){
            return setIsNextDataSubmitted(true);
        }
          try{
            if(state==='login'){
                const {data}=await axios.post(backendUrl+"/api/company/login",{email,password});
                if(data.success){
                 
                    setCompanyToken(data.token);
                    setCompanyData(data.company);
                    localStorage.setItem("companyToken",data.token);
                    setShowRecruiterLogin(false);
                    navigate("/dashboard");

                }else{
                    toast.error(data.message);
                }
            }else{

                //signup logic
                const formData=new FormData();
                formData.append("name",name);
                formData.append("email",email);
                formData.append("password",password);
                formData.append("image",image);

                const {data}=await axios.post(backendUrl+"/api/company/register",formData);

                if(data.success){
                    
                    setCompanyToken(data.token);
                    setCompanyData(data.company);
                    localStorage.setItem("companyToken",data.token);
                    setShowRecruiterLogin(false);
                    navigate("/dashboard");
                }else{
                    toast.error(data.message);
                }
            }
        }catch(err){
            toast.error(err.message);
        }
    }
    useEffect(() => {
        //No scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };  
    }, []);

  return (
    <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
      <form onSubmit={handleSubmit} className='relative bg-white p-10 rounded-xl text-slate-500'>
        <h1 className='text-center text-2xl text-natural-700 font-medium'>Recruiter {state}</h1>
        <p className='text-sm'>Welcome back! Please login to your account.</p>
        {state==='signup' && isNextDataSubmitted 
        ? <>
        <div className='flex items-center gap-4 my-10'>
            <label htmlFor="image">
                <img className="w-16 rounded-full" src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                <input onChange={e=>setImage(e.target.files[0])} type="file" id="image" />
            </label>
            <p>Upload Company <br /> Logo</p>
        </div>
        </>
        :
        <>
        {state!=='login' && (
             <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
            <img src={assets.person_icon} alt="" />
            <input className='outline-none text-sm' type="text" placeholder='Company Name' value={name} onChange={e => setName(e.target.value)} />
        </div>
        )}
       
         <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
            <img src={assets.email_icon} alt="" />
            <input className='outline-none text-sm' type="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
        </div>
         <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
            <img src={assets.lock_icon} alt="" />
            <input className='outline-none text-sm' type="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        
        </>

}   
        {state==='login' && <p className='text-sm text-blue-600 mt-4 cursor-pointer'>Forgot Password?</p>}
        
        <button type="submit" className='bg-blue-600 w-full text-white py-2 mt-3 rounded-full cursor-pointer'>{state === 'login' ? 
        'Login' :isNextDataSubmitted ? 'Create Account' : 'Next'}</button>
        {state==='login' ?
        <p className='mt-5 text-center'>Don't have an account <span className='text-blue-600 cursor-pointer' onClick={() => setState('signup')}>Sign Up</span></p>:
        <p className='mt-5 text-center'>Already have an Account <span className='text-blue-600 cursor-pointer' onClick={() => setState('login')}>Login</span></p>
        }
        
        <img className="w-3 absolute top-5 right-5 cursor-pointer" src={assets.cross_icon} alt="" onClick={() => setShowRecruiterLogin(false)} />
      </form>
    </div>
  )
}

export default RecruiterLogin
