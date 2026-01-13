import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-emerald-700 mb-6">
        Profile
      </h1>

      <div className="bg-white rounded-2xl p-6 border border-emerald-100 space-y-4">
        <ProfileItem label="Name" value={user.name} />
        <ProfileItem label="Username" value={user.username} />
        <ProfileItem label="Email" value={user.email} />
      </div>
    </div>
  );
};

const ProfileItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

export default Profile;
