import React, { useState } from "react";
import icon from "../assets/icon.png";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {setUser, setAccessToken} = useAuth();
  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  async function handleSubmit(e){
    e.preventDefault();
    console.log('clicked')
    try{
      setLoading(true);
      setMessage("");
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        setMessage("Invalid email format");
        return;
      }
      if(password.length < 8){
        setMessage("Password length must be atleast 8 characters");
        return;
      }
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "login failed");
        return;
      }
      setUser(data.user);
      setAccessToken(data.accessToken);
      navigate('/user');
    } catch(error){
      console.log(error);
      setMessage(error.message || 'something went wrong');
    } finally{
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-emerald-50 relative flex flex-col gap-2.5 items-center justify-center px-6">

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

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
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
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-medium transition 
              ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
              }`}
            >
            {loading ? "Logging..." : "Login"}
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
      <p className="text-center text-red-600">{message}</p>
    </div>
  );
};

export default Login;

