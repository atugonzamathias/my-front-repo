import React from 'react';
import { useNavigate } from "react-router-dom";
import API from "../API"; 

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/api/logout/", {});

      // Clear stored data
      localStorage.clear();
      sessionStorage.clear();

      // Redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
      Logout
    </button>
  );
}

export default LogoutButton;
