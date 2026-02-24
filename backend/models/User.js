const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  role: {
    type: String,
    default: "User"   // Admin will be set manually
  },
  totalCL: {
    type: Number,
    default: 12
  },
  remainingCL: {
    type: Number,
    default: 12
  }
});

module.exports = mongoose.model("User", userSchema);