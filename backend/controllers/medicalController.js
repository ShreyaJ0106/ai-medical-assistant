const axios = require("axios");


// =====================================================
// GENERATE MEDICAL REPORT
// =====================================================

exports.generateReport = async (req, res) => {
  try {
    // ===================================================
    // GET PATIENT DATA
    // ===================================================

    const {
      name,
      age,
      gender,
      symptoms,
    } = req.body;


    // ===================================================
    // VALIDATION
    // ===================================================

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        error: "Patient name is required.",
      });
    }


    if (age === undefined || age === null || age === "") {
      return res.status(400).json({
        success: false,
        error: "Patient age is required.",
      });
    }


    const numericAge = Number(age);

    if (
      Number.isNaN(numericAge) ||
      numericAge < 1 ||
      numericAge > 120
    ) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid age between 1 and 120.",
      });
    }


    if (!gender || !String(gender).trim()) {
      return res.status(400).json({
        success: false,
        error: "Gender is required.",
      });
    }


    if (!symptoms || !String(symptoms).trim()) {
      return res.status(400).json({
        success: false,
        error: "Please describe the patient's symptoms.",
      });
    }


    // ===================================================
    // CHECK N8N WEBHOOK
    // ===================================================

    if (!process.env.N8N_WEBHOOK) {
      console.error(
        "N8N_WEBHOOK is not configured in .env"
      );

      return res.status(500).json({
        success: false,
        error:
          "Medical workflow is not configured.",
      });
    }


    // ===================================================
    // CLEAN PATIENT DATA
    // ===================================================

    const patientData = {
      name: String(name).trim(),

      age: String(age).trim(),

      gender: String(gender).trim(),

      symptoms: String(symptoms).trim(),
    };


    console.log(
      "Medical report request received for:",
      patientData.name
    );


    // ===================================================
    // SEND DATA TO N8N
    // ===================================================

    const response = await axios.post(
      process.env.N8N_WEBHOOK,
      patientData,
      {
        headers: {
          "Content-Type": "application/json",
        },

        timeout: 60000,
      }
    );


    // ===================================================
    // CHECK N8N RESPONSE
    // ===================================================

    if (!response.data) {
      console.error(
        "Empty response received from n8n."
      );

      return res.status(502).json({
        success: false,
        error:
          "The medical workflow returned an empty response.",
      });
    }


    // ===================================================
    // N8N RESPONSE
    // ===================================================

    let workflowData = response.data;


    /*
      In case n8n returns an array such as:

      [
        {
          patient_name: "...",
          possible_disease: "..."
        }
      ]

      take the first item.
    */

    if (Array.isArray(workflowData)) {
      workflowData =
        workflowData[0] || {};
    }


    // ===================================================
    // NORMALIZE RESPONSE
    // ===================================================

    const report = {
      success: true,

      // Patient information
      patient_name:
        workflowData.patient_name ||
        workflowData.name ||
        patientData.name,

      age:
        workflowData.age ||
        patientData.age,

      gender:
        workflowData.gender ||
        patientData.gender,

      symptoms:
        workflowData.symptoms ||
        patientData.symptoms,


      // Disease information
      possible_disease:
        workflowData.possible_disease ||
        workflowData.matchedDisease ||
        "Not specified",


      // Severity
      severity:
        workflowData.severity ||
        "Not specified",


      // Treatment
      treatment:
        workflowData.treatment ||
        "Please consult a qualified healthcare professional.",


      // AI-generated report
      ai_report:
        workflowData.ai_report ||
        workflowData.aiReport ||
        "No detailed AI report was generated.",
    };


    // ===================================================
    // PRESERVE MATCHING INFORMATION
    // ===================================================

    if (workflowData.matchedSymptoms) {
      report.matchedSymptoms =
        workflowData.matchedSymptoms;
    }


    if (
      workflowData.matchScore !== undefined
    ) {
      report.matchScore =
        workflowData.matchScore;
    }


    if (workflowData.matchedDisease) {
      report.matchedDisease =
        workflowData.matchedDisease;
    }


    // ===================================================
    // SUCCESS
    // ===================================================

    console.log(
      "Medical report generated successfully for:",
      patientData.name
    );

    console.log(
      "Possible disease:",
      report.possible_disease
    );

    console.log(
      "Severity:",
      report.severity
    );


    return res.status(200).json(report);


  } catch (error) {

    // ===================================================
    // N8N / AXIOS ERROR
    // ===================================================

    if (error.response) {

      console.error(
        "n8n returned an error:",
        error.response.status
      );


      // -----------------------------------------------
      // RATE LIMIT
      // -----------------------------------------------

      if (error.response.status === 429) {

        return res.status(429).json({
          success: false,
          error:
            "The AI service is currently receiving too many requests. Please wait a moment and try again.",
        });
      }


      // -----------------------------------------------
      // OTHER N8N ERRORS
      // -----------------------------------------------

      return res.status(502).json({
        success: false,
        error:
          "The medical workflow could not process the request.",
      });
    }


    // ===================================================
    // TIMEOUT
    // ===================================================

    if (
      error.code === "ECONNABORTED" ||
      error.code === "ETIMEDOUT"
    ) {

      console.error(
        "Medical workflow request timed out."
      );


      return res.status(504).json({
        success: false,
        error:
          "The medical analysis took too long. Please try again.",
      });
    }


    // ===================================================
    // CONNECTION ERROR
    // ===================================================

    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ENOTFOUND"
    ) {

      console.error(
        "Unable to connect to n8n."
      );


      return res.status(503).json({
        success: false,
        error:
          "Unable to connect to the medical workflow. Please make sure n8n is running.",
      });
    }


    // ===================================================
    // UNKNOWN ERROR
    // ===================================================

    console.error(
      "Medical report generation error:",
      error.message
    );


    return res.status(500).json({
      success: false,
      error:
        "Unable to generate the medical report. Please try again.",
    });
  }
};