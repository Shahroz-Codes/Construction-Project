// src/components/AppLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AppLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar always visible */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar only if user is logged in */}
        {user?.role && <Sidebar role={user.role} />}

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
