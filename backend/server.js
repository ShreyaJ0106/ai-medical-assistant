require("dotenv").config();

const express = require("express");
const cors = require("cors");

const medicalRoutes = require("./routes/medical");

const app = express();

// Enable CORS for React frontend
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// API Routes
app.use("/api", medicalRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("AI Medical Assistant Backend is Running 🚀");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});