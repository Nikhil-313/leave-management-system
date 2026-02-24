import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <h2>LMS</h2>

      {/* Not Logged In */}
      {!token && (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}

      {/* Logged In as Normal User */}
      {token && role === "User" && (
        <>
          <Link to="/">Dashboard</Link>
          <Link to="/apply">Apply Leave</Link>
          <Link to="/history">Leave History</Link>

          <button onClick={handleLogout}>
            Logout
          </button>
        </>
      )}

      {/* Logged In as Admin */}
      {token && role === "Admin" && (
        <>
          <Link to="/admin-dashboard">Admin Dashboard</Link>
          <Link to="/admin">Manage Leaves</Link>

          <button onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default Sidebar;