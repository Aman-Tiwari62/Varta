import React, { useState } from "react";
import icon from "../../assets/icon.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const RegisterEmail = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleClick = async (e) =>{

    e.preventDefault();

    try{

      setLoading(true);
      setMessage("");

      if (!email.trim()) {
        setMessage("*Email is required");
        return;
      }
    
      // basic format check
      if (!/\S+@\S+\.\S+/.test(email)) {
        console.log("invalid format");
        setMessage("*Invalid email format");
        return;
      }

      console.log("email format pass");
      
      const res = await fetch(`${BACKEND_URL}/auth/registerEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      console.log("request made to backend");
      const data = await res.json();
      if (!res.ok) {
        setMessage(`*${data.message || "Server error! Try again"}`);
        return;
      }
      setMessage(`${data.message}`);
      sessionStorage.setItem("registerEmail", email);
      sessionStorage.setItem("resendAvailableAt", data.resendAvailableAt.toString());

      navigate('/register/otp')

    } catch(error){
      console.log(error);
      setMessage("Some error occured. Try after sometime");
    } finally{
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-emerald-50 relative flex gap-2.5 flex-col items-center justify-center px-6">

      {/* Top-left logo */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <img src={icon} alt="Varta logo" className="w-10 h-10" />
        <span className="text-xl font-bold text-emerald-700">Varta</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-emerald-700 mb-4">
          Create your account
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Enter your email to get started
        </p>

        <form className="space-y-5 ">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <p className="text-red-600">{message}</p>

          <button
            disabled={loading}
            onClick={handleClick}
            className={`w-full py-3 rounded-xl font-medium transition cursor-pointer ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
          >
              {loading ? "Sending OTP..." : "Send OTP"}
          </button>

        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link 
          to={'/login'}
          className="text-emerald-600 font-medium cursor-pointer hover:underline">
            Login
          </Link>
        </p>
      </div>
      
    </div>
  );
};

export default RegisterEmail;
