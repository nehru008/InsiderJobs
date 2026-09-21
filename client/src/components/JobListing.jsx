import { useContext,useEffect,useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import Jobcard from "./Jobcard";
const JobListing = () => {
    const { isSearched, searchFilter, setSearchFilter,jobs } = useContext(AppContext);
    const [showFilters, setShowFilters] = useState(true);
    const [currPage, setCurrPage] = useState(1);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);

    const [filteredJobs, setFilteredJobs] = useState(jobs);
    
    const handleCategoryChange = (category) => {
        setSelectedCategories(
            (prev) => prev.includes(category)
                ? prev.filter((cat) => cat !== category)
                : [...prev, category]
        );
    }
     const handleLocationChange = (location) => {
        setSelectedLocations(
            (prev) => prev.includes(location)
                ? prev.filter((loc) => loc !== location)
                : [...prev, location]
        );
    }
    useEffect(() => {
        const matchCategory = (job) => selectedCategories.length === 0 || selectedCategories.includes(job.category);
        const matchLocation = (job) => selectedLocations.length === 0 || selectedLocations.includes(job.location);
        const matchesTitle = (job) => searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase());
        const matchesLocationSearch = (job) => searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase());
        const newFilteredJobs= jobs.slice().reverse().filter((job) =>
            matchCategory(job) &&
            matchLocation(job) &&
            matchesTitle(job) &&
            matchesLocationSearch(job)
        );
        setFilteredJobs(newFilteredJobs);
        setCurrPage(1);
    }, [jobs, selectedCategories, selectedLocations, searchFilter]);
           

    return (
        <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
            {/* SideBar*/}
            <div className="w-full lg:w-1/4 bg-white px-4">

                {/* Search Filter From hero Component */}
                {
                    isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
                        <>
                            <h3 className="font-medium text-lg mb-4">Current Search </h3>
                            <div className="mb-4 text-gray-600">
                                {
                                    searchFilter.title && (
                                        <span className="inline-flex items-center gap-2.5 bg-blue-50 border-blue-200 px-4 py-1.5 rounded"> {searchFilter.title}
                                            <img onClick={(e) => setSearchFilter({ ...searchFilter, title: "" })} className="cursor-pointer" src={assets.cross_icon} /></span>
                                    )}
                                {
                                    searchFilter.location && (
                                        <span className="ml-2 inline-flex items-center gap-2.5 bg-red-50 border-red-200 px-4 py-1.5 rounded"> {searchFilter.location}
                                            <img onClick={(e) => setSearchFilter({ ...searchFilter, location: "" })} className="cursor-pointer" src={assets.cross_icon} /></span>
                                    )}

                            </div>

                        </>
                    )
                }
                <button onClick={(e)=>setShowFilters(prev=>!prev)} className="px-6 py-1.5 rouded border border-gray-400 lg:hidden">
                    {showFilters ? "Close": "Filters"}
                </button>
                {/* Category Filter */}
                <div className={showFilters ? " " : "hidden max-lg:hidden"}>
                    <h4 className="font-medium text-lg py-4">Search by Categories</h4>
                    <ul>
                        {
                            JobCategories.map((category, index) => (
                                <li className="flex gap-3 items-center" key={index} >
                                    <input className="scale-125"
                                    type="checkbox"
                                      onChange={() => handleCategoryChange(category)}
                                      checked={selectedCategories.includes(category)} />
                                    {category}
                                </li>
                            ))
                        }
                    </ul>
                </div>
                {/* Location filter */}
                <div className={showFilters ? " " : "hidden max-lg:hidden"}>
                    <h4 className="font-medium text-lg py-4 pt-14">Search by Locations</h4>
                    <ul>
                        {
                            JobLocations.map((location, index) => (
                                <li className="flex gap-3 items-center" key={index} >
                                    <input className="scale-125" type="checkbox"
                                     onChange={() => handleLocationChange(location)} 
                                     checked={selectedLocations.includes(location)} />
                                    {location}
                                </li>
                            ))
                        }
                    </ul>
                </div>

            </div>
            {/* Job Listings */}
            <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-4">
                <h3 className="font-medium text-3xl py-2" id='job-list'>Latest Jobs</h3>
                <p className="mb-8">Get Your Desired Job from top companies</p>
                <div className="grid grid-col-6 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {/* Job Card Component */}
                   {filteredJobs.slice((currPage-1)*6, currPage*6).map((job,index)=>(
                    <Jobcard key={index} job={job} />
                   ))}
                </div>
                {/* Pagination can be added here */}
                {filteredJobs.length>0 && (
                   <div className="flex items-center justify-center space-x-2 mt-10">
                    <a href="#job-list">
                        <img onClick={()=>setCurrPage(Math.max(currPage-1),1)} src={assets.left_arrow_icon} alt="" />
                    </a>
                    {Array.from({length:Math.ceil(filteredJobs.length/6)},(_,index)=>(
                        <a href="#job-list" key={index}>
                            <button onClick={() => setCurrPage(index+1)} className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${currPage===index+1 ? "bg-blue-100 text-blue-500" : "text-gray-500"}`} >{index+1}</button>
                        </a>
                    ))}
                    <a href="#job-list">
                        <img onClick={()=>setCurrPage(Math.min(currPage+1, Math.ceil(filteredJobs.length/6)))} src={assets.right_arrow_icon} alt="" />
                    </a>
                   </div>
                )}
            </section>
        </div>
    )
}

export default JobListing
