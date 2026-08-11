require("dotenv").config();

const express = require("express");
const cors = require("cors");

const medicalRoutes = require("./routes/medical");

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("✅ AI Medical Assistant Backend is Running");
});

// API routes
app.use("/api", medicalRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});