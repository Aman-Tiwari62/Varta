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
import Search from './pages/Search';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import PeopleProfile from './pages/People';

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
          <Route path="/user" element={<UserPage/>} >
            <Route path="search" element={<Search />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="chat/*" element={<Chat />} />
            <Route path="people/:username" element = {<PeopleProfile/>}/>
          </Route>
        </Route>

      </Routes>

    </div>
  )
}

export default App

