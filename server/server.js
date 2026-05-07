const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const appointment = require("./models/appointment");

mongoose.connect("mongodb+srv://admin:admin123@cluster0.ec3topf.mongodb.net/?appName=Cluster0")
.then(() => console.log("MongoDB Atlas connected"))
.catch(err => console.log(err));

app.use(cors());
app.use(express.json());
let sessions = {};

// 🤖 SMART HOSPITAL CHATBOT (FREE VERSION)
app.get("/chat", async (req, res) => {
  const msg = (req.query.message || "").toLowerCase();
  const userId = "user1"; // simple single user for now

  if (!sessions[userId]) {
    sessions[userId] = { step: 0, data: {} };
  }

  let session = sessions[userId];
  let reply = "";

  // STEP 1: Start appointment
  if (msg.includes("appointment")) {
    session.step = 1;
    reply = "Great 👍 What is your name?";
  }

  // STEP 2: Get name
  else if (session.step === 1) {
    session.data.name = msg;
    session.step = 2;
    reply = "Which department do you need? (Dental, Eye, General)";
  }

  // STEP 3: Get department
  else if (session.step === 2) {
    session.data.department = msg;

    // save to database
    const Appointment = require("./models/appointment");

    await Appointment.create({
      name: session.data.name,
      department: session.data.department
    });

    reply = `✅ Appointment booked for ${session.data.name} in ${session.data.department}`;

    // reset session
    session.step = 0;
    session.data = {};
  }

  else {
    reply = "Say 'appointment' to start booking.";
  }

  res.send(reply);
});// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});