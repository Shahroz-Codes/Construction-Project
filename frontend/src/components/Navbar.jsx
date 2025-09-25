// src/components/Navbar.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-stone-800 text-white">
      <div className="font-bold text-lg">🏗️ ConstructionApp</div>
      <div className="flex items-center gap-4">
        <span>Hi, {user?.name || "Guest"}</span>
        <button 
          onClick={logout} 
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
