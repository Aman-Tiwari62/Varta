import { useState } from "react";

const mockUsers = [
  { id: 1, username: "aman" },
  { id: 2, username: "arjun" },
  { id: 3, username: "rohit" },
  { id: 4, username: "ankita" },
  { id: 5, username: "neha" },
];

const SearchPage = () => {
  const [query, setQuery] = useState("");

  const filteredUsers = mockUsers.filter(user =>
    user.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    /* Center container */
    <div className="flex justify-center">

      {/* Content width */}
      <div className="w-full max-w-xl">

        {/* Heading */}
        <h1 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
          Search Users
        </h1>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-emerald-200
                     focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {/* Suggestions */}
        {query && (
          <div className="mt-4 bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <UserRow key={user.id} username={user.username} />
              ))
            ) : (
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

const UserRow = ({ username }) => {
  return (
    <div className="px-4 py-3 cursor-pointer hover:bg-emerald-50 flex items-center gap-3">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 font-semibold">
        {username[0].toUpperCase()}
      </div>

      {/* Username */}
      <p className="font-medium text-gray-800">
        {username}
      </p>
    </div>
  );
};

export default SearchPage;
