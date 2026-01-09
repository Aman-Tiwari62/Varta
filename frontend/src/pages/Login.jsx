import React from "react";
import icon from "../assets/icon.png";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen bg-emerald-50 relative flex items-center justify-center px-6">

      {/* Top-left logo */}
      <div className="absolute top-6 left-6 flex items-center gap-2 cursor-pointer">
        <img src={icon} alt="Varta logo" className="w-10 h-10" />
        <span className="text-xl font-bold text-emerald-700">Varta</span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-emerald-700 mb-6">
          Login
        </h1>

        <form className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link 
          to={'/register/email'}
          className="text-emerald-600 font-medium cursor-pointer hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

