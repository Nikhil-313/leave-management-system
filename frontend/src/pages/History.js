import React, { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

function History() {
  const [history, setHistory] = useState([]);

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

  return (
    <div className="card">
      <h1>Leave History</h1>

      <div className="export-buttons">
        <button onClick={exportExcel}>Export Excel</button>
        <button onClick={exportPDF}>Export PDF</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Days</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((leave) => (
            <tr key={leave._id}>
              <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
              <td>{new Date(leave.toDate).toLocaleDateString()}</td>
              <td>{leave.days}</td>
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
  );
}

export default History;