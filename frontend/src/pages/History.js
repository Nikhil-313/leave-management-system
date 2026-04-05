import React, { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

function History() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    apiRequest("/api/leave/history")
      .then(data => setHistory(data))
      .catch(() => console.log("Error loading history"));
  }, []);

  // ✅ Secure Excel Export
  const exportExcel = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/leave/export/excel",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "leaves.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();

    } catch (error) {
      console.log("Excel export failed ❌");
    }
  };

  // ✅ Secure PDF Export
  const exportPDF = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/leave/export/pdf",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "leaves.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

    } catch (error) {
      console.log("PDF export failed ❌");
    }
  };

  const token = localStorage.getItem("token");

    useEffect(() => {
      if (!token) return;

      apiRequest("/api/leave/history")
        .then(data => setHistory(data))
        .catch(() => console.log("Error loading history"));
    }, [token]);

    const filteredHistory = history.filter((leave) => {
    const matchesSearch =
    leave.reason?.toLowerCase().includes(search.toLowerCase()) ||
    new Date(leave.fromDate).toLocaleDateString().includes(search);

    const matchesStatus =
    statusFilter === "" || leave.status === statusFilter;

  return matchesSearch && matchesStatus;
});

return (
  <div className="card">
    <h1>Leave History</h1>

    <div className="export-buttons">
      <button onClick={exportExcel}>Export Excel</button>
      <button onClick={exportPDF}>Export PDF</button>
    </div>

    <div className="export-buttons" style={{ flexWrap: "wrap" }}>
  
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>

    </div>

    {/* ✅ ADD THIS WRAPPER */}
    <div style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Days</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredHistory.map((leave) => (
            <tr key={leave._id}>
              <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
              <td>{new Date(leave.toDate).toLocaleDateString()}</td>
              <td>{leave.days}</td>
              <td>{leave.leaveType}</td>
              <td>
                <span className={`status ${leave.status.toLowerCase()}`}>
                  {leave.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {/* ✅ END WRAPPER */}

  </div>
);
}
export default History;