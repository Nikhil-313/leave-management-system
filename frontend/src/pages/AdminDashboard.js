import React, { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    apiRequest("/api/leave/admin/stats")
      .then(data => setStats(data))
      .catch(() => console.log("Error loading stats"));
  }, []);

  const chartData = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        data: [stats.pending, stats.approved, stats.rejected],
        backgroundColor: [
          "#f59e0b",
          "#22c55e",
          "#ef4444"
        ]
      }
    ]
  };

  return (
    <div className="card">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-box">
          <h3>Total Requests</h3>
          <p>{stats.total}</p>
        </div>

        <div className="stat-box">
          <h3>Pending</h3>
          <p>{stats.pending}</p>
        </div>

        <div className="stat-box">
          <h3>Approved</h3>
          <p>{stats.approved}</p>
        </div>

        <div className="stat-box">
          <h3>Rejected</h3>
          <p>{stats.rejected}</p>
        </div>
      </div>

      <div style={{ maxWidth: "400px", margin: "30px auto" }}>
        <Pie data={chartData} />
      </div>
    </div>
  );
}

export default AdminDashboard;