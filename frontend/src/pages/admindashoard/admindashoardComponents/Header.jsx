// src/components/Header.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = ({ user, companyInfo, onLogout, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await axios.post("http://localhost:5000/api/auth/logout");

      // Clear session storage
      sessionStorage.clear();

      // Execute any additional logout logic provided by the parent component
      if (onLogout) {
        onLogout();
      }

      // Redirect to the home page
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white shadow-md px-6 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-md text-[#5F656F] hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-[#02245B]">
              Admin <span className="text-[#FF5E14]">Dashboard</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <span className="text-gray-700 text-sm">{user?.email || "No email"}</span>

          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
