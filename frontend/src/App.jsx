import React, { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import RegisterEmail from './pages/Register/RegisterEmail';
import VerifyOtp from './pages/Register/VerifyOtp';
import RegisterDetails from './pages/Register/RegisterDetails';
import ProtectedRoute from './pages/ProtectedRoute';
import PublicRoute from './pages/PublicRoute';
import UserPage from './pages/UserPage';
import LandingPage from './pages/LandingPage';

const App = () => {

  return (
    <div>

      <Routes>

        <Route element={<PublicRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/email" element={<RegisterEmail />} />
          <Route path="/register/otp" element={<VerifyOtp />} />
          <Route path="/register/details" element={<RegisterDetails />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/user" element={<UserPage/>} />
        </Route>

      </Routes>

    </div>
  )
}

export default App

