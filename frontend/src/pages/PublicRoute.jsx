import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from '../store/authStore';

const PublicRoute = () => {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const isAuthenticated = !!user;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/user/chat" replace /> : <Outlet />;
};

export default PublicRoute;
