import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useAuth } from "../context/AuthContext";

const PeopleProfile = () => {
  const { username } = useParams();          // ✅ ROUTE PARAM
  const navigate = useNavigate();
  const {accessToken, setAccessToken, setUser, logout} = useAuth();

  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!username) {
      setError("Invalid profile");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${BACKEND_URL}/user/people/${username}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error("User not found");
        }

        const data = await res.json();

        if (data.success) {
          setPerson(data.user);
        } else {
          setError("User not found");
        }

      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();

    return () => controller.abort();
  }, [username]);

  // handle message button click:
  const handleMessageClick = async () => {
    try {
      const res = await fetchWithAuth({
        url: "/chat/conversation",
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: person._id, // receiver
          }),
        },
        accessToken,
        setAccessToken,
        setUser,
        logout,
      });

      if (!res.ok) {
        throw new Error("Failed to start conversation");
      }

      const data = await res.json();

      const conversationId = data.conversation._id;

      // ✅ Navigate ONLY after we have conversationId
      navigate(`/user/chat/${conversationId}`);
    } catch (err) {
      console.error(err);
      alert("Could not open chat. Please try again.");
    }
  };

  // ---------------- UI STATES ----------------

  if (loading) {
    return (
      <div className="flex justify-center mt-20 text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center mt-20 text-red-500">
        {error}
      </div>
    );
  }

  if (!person) return null;

  // ---------------- MAIN UI ----------------

  return (
    <div className="flex justify-center mt-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border p-6">

        {/* Avatar */}
        <div className="flex justify-center">
          {person.avatar ? (
            <img
              src={person.avatar}
              alt={person.username}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full bg-emerald-200
                         flex items-center justify-center
                         text-emerald-700 text-3xl font-bold"
            >
              {person.username[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Name & Username */}
        <div className="text-center mt-4">
          {person.name && (
            <h2 className="text-xl font-semibold text-gray-800">
              {person.name}
            </h2>
          )}
          <p className="text-gray-500">
            @{person.username}
          </p>
        </div>

        {/* Message Button */}
        <button
          onClick={handleMessageClick}
          className="mt-6 w-full py-3 rounded-xl
                     bg-emerald-600 text-white font-medium
                     hover:bg-emerald-700 transition
                     cursor-pointer"
        >
          Message
        </button>
      </div>
      <p className="text-red-500">{error}</p>
    </div>
  );
};

export default PeopleProfile;

