import React, { useState } from "react";
import icon from "../../assets/icon.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const RegisterDetails = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();
  const { setUser, setAccessToken } = useAuth();

  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      setLoading(true);
      setMessage("");

      const res = await fetch(`${BACKEND_URL}/auth/fillDetails`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }
      setUser(data.user);
      setAccessToken(data.accessToken);
      navigate('/user');
    } catch(error){
        setMessage(error.message || "Something went wrong")

    } finally{
      setLoading(false);
    }
  }

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
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"    
          />

          <button
          disabled={loading}
          onClick={handleSubmit} 
          className={`w-full py-3 rounded-xl font-medium transition 
            ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
            }`}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
      <p className="text-center text-red-600">{message}</p>
    </div>
  );
};

export default RegisterDetails;
