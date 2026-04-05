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

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    apiRequest("/api/leave/user/stats")
      .then(data => setStats(data))
      .catch(() => console.log("Error loading stats"));

    apiRequest("/api/leave/balance")
      .then(data => setBalance(data.remainingCL))
      .catch(() => console.log("Error loading balance"));
  }, []);

  const chartData = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        data: [stats.pending, stats.approved, stats.rejected],
        backgroundColor: ["orange", "green", "red"]
      }
    ]
  };

  return (
  <div>
    <h1 style={{ marginBottom: "20px" }}>Dashboard</h1>

    <div className="stats-grid">

      <div className="stat-box">
        <h3>Total Applied</h3>
        <p style={{ color: "#2563eb", fontSize: "28px" }}>
          {stats.total}
        </p>
      </div>

      <div className="stat-box">
        <h3>Remaining Leaves</h3>
        <p style={{ color: "#2563eb" }}>{balance}</p>
      </div>

      <div className="stat-box">
        <h3>Approved</h3>
        <p style={{ color: "green" }}>{stats.approved}</p>
      </div>

      <div className="stat-box">
        <h3>Pending</h3>
        <p style={{ color: "orange" }}>{stats.pending}</p>
      </div>

      <div className="stat-box">
        <h3>Rejected</h3>
        <p style={{ color: "red" }}>{stats.rejected}</p>
      </div>

    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "40px"
      }}
    >
      <div style={{ width: "350px" }}>
        <Pie data={chartData} />
      </div>
    </div>
  </div>
);
}

export default Dashboard;