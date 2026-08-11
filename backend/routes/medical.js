const express = require("express");
const router = express.Router();

const { generateReport } = require("../controllers/medicalController");

router.post("/report", generateReport);

module.exports = router;