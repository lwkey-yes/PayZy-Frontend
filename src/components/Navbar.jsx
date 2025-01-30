import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink
              to="/dashboard"
              className="text-2xl font-bold tracking-wide hover:text-gray-300 transition"
            >
              PayZy
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                isActive ? "text-blue-400" : "hover:text-gray-300"
              }
            >
              Transactions
            </NavLink>
            <NavLink
              to="/wallet"
              className={({ isActive }) =>
                isActive ? "text-blue-400" : "hover:text-gray-300"
              }
            >
              Wallet
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "text-blue-400" : "hover:text-gray-300"
              }
            >
              Profile
            </NavLink>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-1 rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900">
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `block px-4 py-2 ${
                isActive ? "bg-blue-700 text-white" : "hover:bg-gray-700"
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            Transactions
          </NavLink>
          <NavLink
            to="/wallet"
            className={({ isActive }) =>
              `block px-4 py-2 ${
                isActive ? "bg-blue-700 text-white" : "hover:bg-gray-700"
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            Wallet
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `block px-4 py-2 ${
                isActive ? "bg-blue-700 text-white" : "hover:bg-gray-700"
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </NavLink>
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="block w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
