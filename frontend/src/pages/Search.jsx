import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${BACKEND_URL}/user/search?q=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await res.json();

        if (data.success) {
          setUsers(data.users);   // ✅ IMPORTANT FIX
        } else {
          setUsers([]);
        }

      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    // debounce
    const timeoutId = setTimeout(fetchUsers, 400);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl">

        <h1 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
          Search Users
        </h1>

        <input
          type="text"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-emerald-200
                     focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {query && (
          <div className="mt-4 bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">

            {loading && (
              <p className="px-4 py-3 text-sm text-gray-500 text-center">
                Searching...
              </p>
            )}

            {!loading && error && (
              <p className="px-4 py-3 text-sm text-red-500 text-center">
                {error}
              </p>
            )}

            {!loading && !error && users.length > 0 && (
               users.map(user => (
                <UserRow
                  key={user._id}
                  username={user.username}
                  avatar={user.avatar}
                  onClick={() =>
                    navigate(`/user/people/${user.username}`)
                  }
                />
                ))
            )}


            {!loading && !error && users.length === 0 && (
              <p className="px-4 py-3 text-sm text-gray-500 text-center">
                No users found
              </p>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

const UserRow = ({ username, avatar, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="px-4 py-3 cursor-pointer hover:bg-emerald-50
                 flex items-center gap-3 transition"
    >
      {avatar ? (
        <img
          src={avatar}
          alt={username}
          className="w-9 h-9 rounded-full object-cover"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-emerald-200
                        flex items-center justify-center
                        text-emerald-700 font-semibold">
          {username[0].toUpperCase()}
        </div>
      )}

      <p className="font-medium text-gray-800">
        {username}
      </p>
    </div>
  );
};


export default SearchPage;


