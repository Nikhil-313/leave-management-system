import React, { useState } from "react";
import { apiRequest } from "../utils/api";

function ApplyLeave() {
  const [form, setForm] = useState({
    fromDate: "",
    toDate: "",
    reason: ""
  });

  const [message, setMessage] = useState("");

  const applyLeave = async (e) => {
    e.preventDefault();

    try {
      const data = await apiRequest("/api/leave/apply", {
        method: "POST",
        body: JSON.stringify(form)
      });

      if (data.message === "Leave applied successfully") {
        setMessage("Leave Applied Successfully ✅");
        setForm({ fromDate: "", toDate: "", reason: "" });
      } else {
        setMessage(data.message || "Error ❌");
      }

    } catch {
      setMessage("Something went wrong ❌");
    }
  };

  return (
    <div className="card">
      <h1>Apply Leave</h1>
      <form className="form" onSubmit={applyLeave}>
        <input
          type="date"
          value={form.fromDate}
          onChange={(e) =>
            setForm({ ...form, fromDate: e.target.value })
          }
          required
        />

        <input
          type="date"
          value={form.toDate}
          onChange={(e) =>
            setForm({ ...form, toDate: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Reason"
          value={form.reason}
          onChange={(e) =>
            setForm({ ...form, reason: e.target.value })
          }
          required
        />

        <button type="submit">Apply Leave</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default ApplyLeave;