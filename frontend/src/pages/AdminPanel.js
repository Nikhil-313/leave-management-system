import React, { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

function AdminPanel() {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState("");

  const fetchLeaves = async () => {
    try {
      const data = await apiRequest("/api/leave/all");
      setLeaves(data);
    } catch (err) {
      setError("Failed to load leaves ❌");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await apiRequest(`/api/leave/status/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status })
      });

      fetchLeaves(); // Refresh after update
    } catch (err) {
      alert("Error updating status ❌");
    }
  };

  return (
    <div className="card">
      <h1>Admin Panel</h1>

      {error && <p className="message">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>From</th>
            <th>To</th>
            <th>Days</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id}>
              <td>{leave.userId?.name}</td>
              <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
              <td>{new Date(leave.toDate).toLocaleDateString()}</td>
              <td>{leave.days}</td>
              <td>{leave.reason}</td>
              <td>
                <span className={`status ${leave.status.toLowerCase()}`}>
                  {leave.status}
                </span>
              </td>
              <td>
                {leave.status === "Pending" && (
                  <>
                    <button
                      onClick={() =>
                        updateStatus(leave._id, "Approved")
                      }
                    >
                      Approve
                    </button>

                    <button
                      style={{ marginLeft: "5px", background: "red" }}
                      onClick={() =>
                        updateStatus(leave._id, "Rejected")
                      }
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;