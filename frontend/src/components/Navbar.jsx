// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-stone-800 text-white">
      {/* Logo / Brand */}
      <div className="font-bold text-lg">
        <Link to="/">🏗️ ConstructionApp</Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span>
              Hi, {user.name} <span className="text-amber-300">({user.role})</span>
            </span>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-stone-600 px-3 py-1 rounded hover:bg-stone-700 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-amber-500 px-3 py-1 rounded hover:bg-amber-600 transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
