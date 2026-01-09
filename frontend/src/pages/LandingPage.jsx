import React from "react";
import icon from "../assets/icon.png";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col">

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        
        {/* Logo */}
        <img
          src={icon}
          alt="Varta logo"
          className="w-24 h-24 mb-6"
        />

        {/* App Name */}
        <h1 className="text-5xl font-bold text-emerald-700 mb-4">
          Varta
        </h1>

        {/* Tagline */}
        <p className="max-w-xl text-lg text-gray-700 mb-10">
          A fast, secure, and real-time chat application to connect with
          people instantly — anytime, anywhere.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-6">
          <Link 
          to={'/login'}
          className="px-8 py-4 bg-emerald-600 text-white rounded-full text-lg font-medium hover:bg-emerald-700 transition">
            Login
          </Link>

          <Link 
          to={'/register/email'}
          className="px-8 py-4 border-2 border-emerald-600 text-emerald-700 rounded-full text-lg font-medium hover:bg-emerald-100 transition">
            Register
          </Link>
        </div>
      </main>

      {/* Footer / Subtle Info */}
      <footer className="py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Varta • Real-time conversations
      </footer>
    </div>
  );
};

export default LandingPage;


