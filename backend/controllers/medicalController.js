const axios = require("axios");

exports.generateReport = async (req, res) => {
  try {
    console.log("========== Incoming Request ==========");
    console.log(req.body);
    
    console.log("Webhook URL:", process.env.N8N_WEBHOOK);

    const response = await axios.post(
      process.env.N8N_WEBHOOK,
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: () => true,
      }
    );

    console.log("========== AXIOS RESPONSE ==========");
    console.log("Status:", response.status);
    console.log("Headers:", response.headers);
    console.log("Data:");
    console.dir(response.data, { depth: null });
    console.log("====================================");

    return res.status(response.status).json(response.data);

  } catch (error) {
    console.log("========== ERROR ==========");

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    } else {
      console.log(error.message);
    }

    console.log("===========================");

    return res.status(500).json({
      success: false,
      error: "Unable to connect to AI Workflow",
    });
  }
};