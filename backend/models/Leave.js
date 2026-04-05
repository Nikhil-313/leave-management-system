const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  fromDate: Date,
  toDate: Date,
  days: Number,
  reason: String,
  status: {
    type: String,
    default: "Pending"
  },
  leaveType: {
    type: String,
    enum: ["CL", "SL", "EL"],
    default: "CL"
  }
});

module.exports = mongoose.model("Leave", leaveSchema);