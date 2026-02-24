import React, { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

function Dashboard() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    apiRequest("/api/leave/balance")
      .then(data => setBalance(data.remainingCL))
      .catch(() => console.log("Error loading balance"));
  }, []);

  return (
    <div className="card">
      <h1>Dashboard</h1>
      <div className="balance-box">
        <h2>Remaining Casual Leave</h2>
        <p className="balance-number">{balance}</p>
      </div>
    </div>
  );
}

export default Dashboard;