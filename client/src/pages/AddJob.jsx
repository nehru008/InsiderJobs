
import { useState } from 'react';   
import RichTextEditor from '../components/RichTextEditor.jsx';
import { JobCategories, JobLocations } from '../assets/assets.js';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRef } from 'react';

const AddJob = () => {
    const [title, setTitle] =useState('');
    const [location, setLocation] =useState('Bangalore');
    const [category, setCategory] =useState('Programming');
    const [level, setLevel] =useState('Beginner-Level');
    const [salary, setSalary] =useState();
    const [description, setDescription] =useState('');

    const {backendUrl, companyToken}=useContext(AppContext);
    const quillref=useRef();

 const onSubmitHandler = async (e) => {
  e.preventDefault();

  try {
    const { data } = await axios.post(
      backendUrl + "/api/company/post-job",
      { title, location, category, level, salary, description },
      { headers: { token: companyToken } }
    );

    if (data.success) {
      toast.success("Job added successfully");
      setTitle('');
      setSalary('');
      setDescription('');
    } else {
      toast.error(data.message);
    }
  } catch (err) {
    toast.error(err.message);
  }
};

  return (
    <form className='container p-4 flex flex-col w-full items-start gap-3' onSubmit={onSubmitHandler}>
        <div className='w-full'>
            <p className="mb-2">Job Title</p>

            <input type="text" value={title} placeholder='Type job title'
             onChange={(e) => setTitle(e.target.value)} required
             className='w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded' />
        </div>

        <div className='w-full max-w-lg'>
            <p className="my-2">Job Description</p>
            <div>
                <RichTextEditor value={description} onChange={setDescription} />
            </div>
        </div>
         <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
            <div >
            <p className='mb-2'>Job Category</p>
            <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' value={category} onChange={(e) => setCategory(e.target.value)}>
                {JobCategories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                ))}
            </select>
            </div>
         

           <div>
            <p className='mb-2'>Job Location</p>
            <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' value={location} onChange={(e) => setLocation(e.target.value)}>
                {JobLocations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                ))}
            </select>
         </div>

           <div>
            <p className='mb-2'>Job Level</p>
            <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="Beginner-Level">Beginner-Level</option>
                <option value="Intermediate-Level">Intermediate-Level</option>
                <option value="Expert-Level">Expert-Level</option>
            </select>
         </div>
</div>
         <div>
            <p className='mb-2'>Salary</p>
            <input className='w-full px-3 py-2 border-2 border-gray-300 rounded' min="0" type="Number" placeholder='25000' value={salary} onChange={(e) => setSalary(e.target.value)} />
         </div>

         <button className='w-28 py-3 mt-4 bg-black text-white rounded'>ADD</button>

    </form>
  )
}

export default AddJob
