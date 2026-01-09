import React, { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import RegisterEmail from './pages/Register/RegisterEmail';
import VerifyOtp from './pages/Register/VerifyOtp';
import RegisterDetails from './pages/Register/RegisterDetails';

const App = () => {
  // states:
  const [status, setStatus] = useState("Checking");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(BACKEND_URL);

        if (!res.ok) {
          throw new Error('Server error');
        }

        setStatus('connected to the server');

      } catch (error) {
        console.log(error);
        setStatus('not-connected to the server');
      }
    };

    checkBackend();
  }, []);

  console.log(`Connecting to the server: ${status}`)

  function handleClick(){
    
  }

  return (
    <div>
      <div className='bg-amber-200'>
        <p>{status}</p>
      </div>
      <Routes>
        <Route path='/' element = {<LandingPage />} />
        <Route path='/login' element = {<Login />} />
        <Route path='/register/email' element = {<RegisterEmail />} />
        <Route path='/register/otp' element = {<VerifyOtp />} />
        <Route path='/register/details' element = {<RegisterDetails />} />
      </Routes>
    </div>
  )
}

export default App

