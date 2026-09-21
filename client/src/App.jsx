import {Route, Routes} from 'react-router-dom';
import Home from "./pages/Home.jsx";
import ApplyJob from "./pages/ApplyJob.jsx";
import Application from "./pages/Application.jsx";
import RecruiterLogin from './components/RecruiterLogin.jsx';
import { useContext } from 'react';
import { AppContext } from './context/AppContext.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddJob from './pages/AddJob.jsx';
import ManageJobs from './pages/ManageJobs.jsx';
import ViewApplications from './pages/ViewApplications.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const {showRecruiterLogin, companyToken} = useContext(AppContext);

  return (
    <>
    <div>
      {showRecruiterLogin && <RecruiterLogin></RecruiterLogin>}
      <ToastContainer />
      <Routes>
        
        <Route path='/' element={<Home/>}></Route>
        <Route path='/apply-job/:id' element={<ApplyJob />}></Route>
        <Route path='/applications' element={<Application />}></Route>
        <Route path='/dashboard' element={<Dashboard />}>
        
        {companyToken ?
        <>
        <Route path='add-job' element={<AddJob />}></Route>
        <Route path='manage-jobs' element={<ManageJobs />}></Route>
        <Route path='view-applications' element={<ViewApplications />}></Route>
        </>
        : null}
        
        </Route>
      </Routes>
    </div>
    </>
  )
}

export default App
