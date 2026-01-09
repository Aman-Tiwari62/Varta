import React from "react";
import icon from "../../assets/icon.png";

const VerifyOtp = () => {
  return (
    <div className="min-h-screen bg-emerald-50 relative flex items-center justify-center px-6">

      {/* Logo */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <img src={icon} alt="Varta logo" className="w-10 h-10" />
        <span className="text-xl font-bold text-emerald-700">Varta</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-emerald-700 mb-4">
          Verify your email
        </h1>

        <p className="text-gray-600 mb-6">
          We’ve sent a 6-digit code to your email
        </p>

        <form className="space-y-5">
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full text-center tracking-widest px-4 py-3 border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition">
            Verify OTP
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 cursor-pointer hover:underline">
          Resend OTP
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;

