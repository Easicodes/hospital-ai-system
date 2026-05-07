const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  name: String,
  department: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Appointment", appointmentSchema);