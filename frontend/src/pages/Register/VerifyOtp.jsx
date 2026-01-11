import React, {useState, useEffect} from "react";
import icon from "../../assets/icon.png";
import { useNavigate } from "react-router-dom";


const VerifyOtp = () => {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const email = sessionStorage.getItem("registerEmail");
  const resendAvailableAt = Number (sessionStorage.getItem("resendAvailableAt"));

  const [secondsLeft, setSecondsLeft] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [otp, setOtp] = useState("");

  // countdown
  useEffect(() => {
    if (!resendAvailableAt) return;
  
    const update = () => {
      const diff = Math.floor(
        (resendAvailableAt - Date.now()) / 1000
      );
      setSecondsLeft(diff > 0 ? diff : 0);
    };
  
    update(); // run immediately
    const interval = setInterval(update, 1000);
  
    return () => clearInterval(interval);
  }, [resendAvailableAt]);
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      setLoading(true);
      setVerifyLoading(true);
      setSuccessMessage("");
      setErrorMessage("");
      
      const res = await fetch(`${BACKEND_URL}/auth/verifyOtp`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message);
        return;
      }
      setSuccessMessage(data.message);

      navigate('/register/details')

    } catch(error){
      console.log(error);
      setErrorMessage("Some error occured")

    } finally{
      setLoading(false);
      setVerifyLoading(false);
    }
  }

  const handleResend = async () => {
    try {

      setLoading(true);
      setResendLoading(true);
      setSuccessMessage("");
      setErrorMessage("");

      const res = await fetch(`${BACKEND_URL}/auth/registerEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message);
        return;
      }
  
      sessionStorage.setItem("resendAvailableAt", data.resendAvailableAt.toString());
  
      setSecondsLeft(
        Math.floor(
          (new Date(data.resendAvailableAt).getTime() - Date.now()) / 1000
        )
      );
      setSuccessMessage("OTP sent successfully.")
    } catch (err) {
      setErrorMessage("Failed to resend OTP");
    } finally{
      setLoading(false);
      setResendLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-emerald-50 relative flex flex-col gap-3.5 items-center justify-center px-6">

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
          We’ve sent a 6-digit code to your email: {email} 
        </p>

        <form className="space-y-5">
          <input
            type="text"
            placeholder="Enter OTP"
            onChange={(e)=>setOtp(e.target.value)}
            className="w-full text-center tracking-widest px-4 py-3 border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button 
          onClick={handleSubmit}
          disabled = {loading}
          className={`w-full py-3 rounded-xl font-medium transition 
            ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
            }`}
          >
            {verifyLoading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={secondsLeft > 0 || loading}
          className={`w-full my-2 py-3 rounded-xl font-medium transition 
            ${
              (secondsLeft > 0 || loading)
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
            }`}
          >
         {resendLoading ? "Resending OTP..." : "Resend OTP"}
        </button>

        {secondsLeft > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Resend OTP in{" "}
            <b>
              {Math.floor(secondsLeft / 60)}:
              {(secondsLeft % 60).toString().padStart(2, "0")}
            </b>
          </p>
        )}


      </div>
      <p className="text-red-500  font-bold">{errorMessage}</p>
      <p className="text-green-500  font-bold">{successMessage}</p>
    </div>
  );
};

export default VerifyOtp;

