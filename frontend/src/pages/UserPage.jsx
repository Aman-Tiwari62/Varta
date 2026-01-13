import { NavLink, Outlet } from "react-router-dom";
import {
  Search,
  Bell,
  MessageCircle,
  User
} from "lucide-react";
import icon from "../assets/icon.png";

const UserPage = () => {
  return (
    <div className="min-h-screen flex bg-emerald-50">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-emerald-100 flex flex-col">

        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-emerald-100">
          <img src={icon} alt="Varta logo" className="w-9 h-9" />
          <span className="text-xl font-bold text-emerald-700">
            Varta
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavItem
            to="search"
            icon={Search}
            label="Search"
          />        

          <NavItem
            to="notifications"
            icon={Bell}
            label="Notifications"
          />
          <NavItem
            to="chat"
            icon={MessageCircle}
            label="Chat"
          />
          <NavItem
            to="profile"
            icon={User}
            label="Profile"
          />
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-emerald-100 text-sm text-gray-500">
          © 2026 Varta
        </div>

      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};

const NavItem = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition
        ${
          isActive
            ? "bg-emerald-100 text-emerald-700"
            : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
        }`
      }
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </NavLink>
  );
};

export default UserPage;



