import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PeopleProfile = () => {
  const { username } = useParams();          // ✅ ROUTE PARAM
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
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
          setUser(data.user);
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

  if (!user) return null;

  // ---------------- MAIN UI ----------------

  return (
    <div className="flex justify-center mt-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border p-6">

        {/* Avatar */}
        <div className="flex justify-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full bg-emerald-200
                         flex items-center justify-center
                         text-emerald-700 text-3xl font-bold"
            >
              {user.username[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Name & Username */}
        <div className="text-center mt-4">
          {user.name && (
            <h2 className="text-xl font-semibold text-gray-800">
              {user.name}
            </h2>
          )}
          <p className="text-gray-500">
            @{user.username}
          </p>
        </div>

        {/* Message Button */}
        <button
          onClick={() => navigate(`/chat/${user._id}`)}
          className="mt-6 w-full py-3 rounded-xl
                     bg-emerald-600 text-white font-medium
                     hover:bg-emerald-700 transition
                     cursor-pointer"
        >
          Message
        </button>
      </div>
    </div>
  );
};

export default PeopleProfile;

