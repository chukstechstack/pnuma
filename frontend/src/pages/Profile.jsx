import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js"; // Your configured Axios instance

 const  ProfilePageLog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // 1. Tell backend to destroy the session cookie across origins
      await api.post("/auth/logout", {}, { withCredentials: true });
      
      // 2. Clear any lingering user cache from the browser
      localStorage.clear(); 
      
      // 3. Force redirect and clear the history stack
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error:", err?.response?.data?.error || err.message);
      
      // Fallback: If network drops, force them to login page anyway
      localStorage.clear();
      navigate("/login", { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={isLoading}
      style={{
        padding: "8px 16px",
        background: "#dc2626",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: isLoading ? "not-allowed" : "pointer",
        fontWeight: "500",
        transition: "background 0.2s"
      }}
    >
      {isLoading ? "Logging out..." : "Log Out"}
    </button>
  );
}
export default ProfilePageLog;