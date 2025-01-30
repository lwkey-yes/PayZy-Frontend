import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white p-4 shadow-lg">
      <div>
        <NavLink 
          to="/dashboard" 
          className="text-xl font-bold tracking-wide hover:text-gray-300 transition"
        >
          Dashboard
        </NavLink>
      </div>
      <div className="flex space-x-6">
        <NavLink 
          to="/transactions" 
          className={({ isActive }) => isActive ? "text-blue-400 font-semibold" : "hover:text-gray-300"}
        >
          Transaction History
        </NavLink>
        <NavLink 
          to="/wallet" 
          className={({ isActive }) => isActive ? "text-blue-400 font-semibold" : "hover:text-gray-300"}
        >
          Wallet
        </NavLink>
        <NavLink 
          to="/profile" 
          className={({ isActive }) => isActive ? "text-blue-400 font-semibold" : "hover:text-gray-300"}
        >
          My Profile
        </NavLink>
        <button 
          onClick={handleLogout} 
          className="bg-red-600 px-4 py-1 rounded-md hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
