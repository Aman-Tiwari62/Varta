import React from "react";
import icon from "../../assets/icon.png";

const RegisterDetails = () => {
  return (
    <div className="min-h-screen bg-emerald-50 relative flex items-center justify-center flex-col px-6">

      {/* Logo */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <img src={icon} alt="Varta logo" className="w-10 h-10" />
        <span className="text-xl font-bold text-emerald-700">Varta</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-emerald-700 mb-6">
          Complete your profile
        </h1>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition">
            Create Account
          </button>
        </form>
      </div>
      {/* <p className="text-center">Password rule: IMPLEMENT LATER</p> */}
    </div>
  );
};

export default RegisterDetails;
