import React, { useMemo } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../styles/Report.css";

function Report({ report }) {
  // =========================================================
  // SAFETY CHECK
  // =========================================================

  if (!report) {
    return null;
  }

  // =========================================================
  // GET REPORT DATA
  // Supports both your n8n response and possible variations
  // =========================================================

  const patientName =
    report.patient_name ||
    report.name ||
    "Not Available";

  const age =
    report.age ||
    "Not Available";

  const gender =
    report.gender ||
    "Not Available";

  const symptoms =
    report.symptoms ||
    "Not Available";

  const possibleDisease =
    report.possible_disease ||
    report.matchedDisease ||
    "Not specified";

  const severity =
    report.severity ||
    "Not specified";

  const treatment =
    report.treatment ||
    "Please consult a qualified healthcare professional.";

  const aiReport =
    report.ai_report ||
    report.output ||
    "No AI analysis available.";

  // =========================================================
  // DATE & TIME
  // =========================================================

  const generatedDate = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, []);

  const generatedTime = useMemo(() => {
    return new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

  // =========================================================
  // SEVERITY CLASS
  // =========================================================

  const getSeverityClass = () => {
    const value = String(severity).toLowerCase();

    if (value.includes("high") || value.includes("severe")) {
      return "severity-high";
    }

    if (value.includes("medium") || value.includes("moderate")) {
      return "severity-medium";
    }

    if (value.includes("low") || value.includes("mild")) {
      return "severity-low";
    }

    return "severity-default";
  };

  // =========================================================
  // FILE NAME
  // =========================================================

  const getFileName = () => {
    const safeName = String(patientName)
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return safeName || "Patient";
  };

  // =========================================================
  // DOWNLOAD PDF
  // =========================================================

  const downloadPDF = async () => {
    const reportElement =
      document.getElementById("medical-report");

    if (!reportElement) {
      alert("Medical report not found.");
      return;
    }

    try {
      // -----------------------------------------------
      // Prepare report for PDF
      // -----------------------------------------------

      reportElement.classList.add("pdf-mode");

      // Wait for browser to finish rendering
      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      // -----------------------------------------------
      // Capture COMPLETE report
      // -----------------------------------------------

      const canvas = await html2canvas(
        reportElement,
        {
          scale: 2,

          useCORS: true,

          allowTaint: true,

          backgroundColor: "#ffffff",

          logging: false,

          scrollX: 0,

          scrollY: 0,

          width: reportElement.scrollWidth,

          height: reportElement.scrollHeight,

          windowWidth:
            reportElement.scrollWidth,

          windowHeight:
            reportElement.scrollHeight,
        }
      );

      // -----------------------------------------------
      // Convert canvas to image
      // -----------------------------------------------

      const imgData =
        canvas.toDataURL(
          "image/jpeg",
          0.95
        );

      // -----------------------------------------------
      // Create A4 PDF
      // -----------------------------------------------

      const pdf = new jsPDF({
        orientation: "portrait",

        unit: "mm",

        format: "a4",

        compress: true,
      });

      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      // Small safe margins
      const margin = 8;

      const usableWidth =
        pageWidth - margin * 2;

      const usableHeight =
        pageHeight - margin * 2;

      // -----------------------------------------------
      // Calculate image dimensions
      // -----------------------------------------------

      const imageWidth =
        usableWidth;

      const imageHeight =
        (canvas.height * imageWidth) /
        canvas.width;

      let heightLeft =
        imageHeight;

      // -----------------------------------------------
      // First page
      // -----------------------------------------------

      let position = margin;

      pdf.addImage(
        imgData,
        "JPEG",
        margin,
        position,
        imageWidth,
        imageHeight,
        undefined,
        "FAST"
      );

      heightLeft -= usableHeight;

      // -----------------------------------------------
      // Additional pages
      // -----------------------------------------------

      while (heightLeft > 0) {
        pdf.addPage();

        position =
          margin -
          (imageHeight - heightLeft);

        pdf.addImage(
          imgData,
          "JPEG",
          margin,
          position,
          imageWidth,
          imageHeight,
          undefined,
          "FAST"
        );

        heightLeft -= usableHeight;
      }

      // -----------------------------------------------
      // Save
      // -----------------------------------------------

      pdf.save(
        `${getFileName()}-Medical-Report.pdf`
      );

      // -----------------------------------------------
      // Remove PDF mode
      // -----------------------------------------------

      reportElement.classList.remove(
        "pdf-mode"
      );
    } catch (error) {
      console.error(
        "PDF generation error:",
        error
      );

      reportElement.classList.remove(
        "pdf-mode"
      );

      alert(
        "Unable to generate PDF. Please try again."
      );
    }
  };

  // =========================================================
  // PRINT REPORT
  // =========================================================

  const printReport = () => {
    const reportElement =
      document.getElementById("medical-report");

    if (!reportElement) {
      alert("Medical report not found.");
      return;
    }

    const printWindow =
      window.open(
        "",
        "_blank",
        "width=1000,height=800"
      );

    if (!printWindow) {
      alert(
        "Please allow pop-ups to print the report."
      );

      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>

      <html>

      <head>

        <title>
          ${getFileName()} - Medical Report
        </title>

        <style>

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            font-family:
              Arial,
              Helvetica,
              sans-serif;
          }

          body {
            padding: 20px;
          }

          .print-wrapper {
            width: 100%;
            max-width: 900px;
            margin: 0 auto;
          }

          .report-container {
            width: 100%;
          }

          .report-header {
            border: 1px solid #dbe5f1;
            border-radius: 18px;
            padding: 25px;
            margin-bottom: 22px;
          }

          .report-title-row {
            display: flex;
            align-items: center;
            gap: 18px;
          }

          .report-logo {
            width: 58px;
            height: 58px;
            border-radius: 14px;
            background: linear-gradient(
              135deg,
              #2563eb,
              #0f766e
            );
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
          }

          .report-header h1 {
            margin: 0;
            color: #1557c0;
            font-size: 30px;
          }

          .report-subtitle {
            margin: 5px 0 0;
            color: #64748b;
            font-size: 15px;
          }

          .report-date {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
          }

          .report-date strong {
            color: #1557c0;
          }

          .report-summary {
            display: grid;
            grid-template-columns:
              repeat(3, 1fr);
            gap: 18px;
            margin-bottom: 22px;
          }

          .summary-card {
            border: 1px solid #dbe5f1;
            border-radius: 16px;
            padding: 20px;
            background: #ffffff;
          }

          .summary-label {
            color: #64748b;
            font-weight: 600;
            margin-bottom: 12px;
          }

          .summary-value {
            font-size: 20px;
            font-weight: 700;
            color: #111827;
          }

          .severity-badge {
            display: inline-block;
            padding: 8px 18px;
            border-radius: 999px;
            font-size: 14px;
            color: white;
          }

          .severity-low {
            background: #16a34a;
          }

          .severity-medium {
            background: #f59e0b;
          }

          .severity-high {
            background: #dc2626;
          }

          .severity-default {
            background: #64748b;
          }

          .analysis-card,
          .treatment-card,
          .doctor-card,
          .disclaimer-card {
            border: 1px solid #dbe5f1;
            border-radius: 16px;
            padding: 25px;
            margin-bottom: 22px;
            background: #ffffff;
          }

          .analysis-card h2,
          .treatment-card h2,
          .doctor-card h2,
          .disclaimer-card h2 {
            color: #1557c0;
            margin-top: 0;
          }

          .analysis-content {
            color: #26364a;
            line-height: 1.7;
          }

          .analysis-content h1,
          .analysis-content h2,
          .analysis-content h3 {
            color: #1557c0;
          }

          .analysis-content ul,
          .analysis-content ol {
            padding-left: 25px;
          }

          .treatment-card {
            border-left: 5px solid #2563eb;
            background: #f8fbff;
          }

          .doctor-card {
            border-left: 5px solid #2563eb;
            background: #eff6ff;
          }

          .disclaimer-card {
            border-left: 5px solid #f97316;
            background: #fff7ed;
          }

          .disclaimer-card h2 {
            color: #c2410c;
          }

          p {
            line-height: 1.7;
          }

          strong {
            color: #17395f;
          }

          @media print {

            body {
              padding: 0;
            }

            .print-wrapper {
              max-width: none;
            }

            .report-header,
            .summary-card,
            .analysis-card,
            .treatment-card,
            .doctor-card,
            .disclaimer-card {
              break-inside: avoid;
            }

          }

        </style>

      </head>

      <body>

        <div class="print-wrapper">

          ${reportElement.innerHTML}

        </div>

      </body>

      </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 700);
  };

  // =========================================================
  // FRAMER MOTION
  // =========================================================

  const containerVariants = {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,

      transition: {
        duration: 0.5,

        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <motion.div
      className="report-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >

      {/* =====================================================
          COMPLETE PDF CONTENT
          IMPORTANT: EVERYTHING INSIDE THIS DIV IS EXPORTED
      ===================================================== */}

      <div id="medical-report">

        {/* ===================================================
            HEADER
        =================================================== */}

        <motion.div
          className="report-header"
          variants={itemVariants}
        >

          <div className="report-title-row">

            <div className="report-logo">
              🩺
            </div>

            <div>

              <h1>
                AI Medical Report
              </h1>

              <p className="report-subtitle">
                AI Generated Preliminary Health Assessment
              </p>

            </div>

          </div>

          <div className="report-date">

            <strong>
              Generated On:
            </strong>{" "}

            {generatedDate}

            {"  |  "}

            <strong>
              Time:
            </strong>{" "}

            {generatedTime}

          </div>

        </motion.div>


        {/* ===================================================
            SUMMARY CARDS
        =================================================== */}

        <motion.div
          className="report-summary"
          variants={itemVariants}
        >

          {/* PATIENT */}

          <motion.div
            className="summary-card"
            variants={itemVariants}
          >

            <div className="summary-label">
              👤 Patient Name
            </div>

            <div className="summary-value">
              {patientName}
            </div>

          </motion.div>


          {/* DISEASE */}

          <motion.div
            className="summary-card"
            variants={itemVariants}
          >

            <div className="summary-label">
              🦠 Possible Disease
            </div>

            <div className="summary-value">
              {possibleDisease}
            </div>

          </motion.div>


          {/* SEVERITY */}

          <motion.div
            className="summary-card"
            variants={itemVariants}
          >

            <div className="summary-label">
              ⚠️ Severity
            </div>

            <div className="summary-value">

              <span
                className={`severity-badge ${getSeverityClass()}`}
              >
                {severity}
              </span>

            </div>

          </motion.div>

        </motion.div>


        {/* ===================================================
            PATIENT INFORMATION
        =================================================== */}

        <motion.div
          className="analysis-card"
          variants={itemVariants}
        >

          <h2>
            👤 Patient Information
          </h2>

          <div className="analysis-content">

            <p>
              <strong>
                Patient Name:
              </strong>{" "}
              {patientName}
            </p>

            <p>
              <strong>
                Age:
              </strong>{" "}
              {age} years
            </p>

            <p>
              <strong>
                Gender:
              </strong>{" "}
              {gender}
            </p>

            <p>
              <strong>
                Presenting Symptoms:
              </strong>{" "}
              {symptoms}
            </p>

          </div>

        </motion.div>


        {/* ===================================================
            TREATMENT
        =================================================== */}

        <motion.div
          className="treatment-card"
          variants={itemVariants}
        >

          <h2>
            💊 Treatment / General Care
          </h2>

          <p>
            {treatment}
          </p>

        </motion.div>


        {/* ===================================================
            AI ANALYSIS
        =================================================== */}

        <motion.div
          className="analysis-card"
          variants={itemVariants}
        >

          <h2>
            🤖 AI Medical Analysis
          </h2>

          <div className="analysis-content">

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
            >
              {aiReport}
            </ReactMarkdown>

          </div>

        </motion.div>


        {/* ===================================================
            DOCTOR RECOMMENDATION
        =================================================== */}

        <motion.div
          className="doctor-card"
          variants={itemVariants}
        >

          <h2>
            👨‍⚕️ Doctor Recommendation
          </h2>

          <p>
            This AI-generated assessment is
            preliminary and should not be considered
            a confirmed medical diagnosis.
          </p>

          <p>
            Consult a qualified healthcare professional
            for confirmation, diagnosis and personalized
            treatment.
          </p>

          <ul>

            <li>
              Seek medical attention if symptoms
              worsen or persist.
            </li>

            <li>
              Seek urgent medical care for severe
              or unusual symptoms.
            </li>

            <li>
              Do not use this report as a substitute
              for professional medical advice.
            </li>

          </ul>

        </motion.div>


        {/* ===================================================
            DISCLAIMER
        =================================================== */}

        <motion.div
          className="disclaimer-card"
          variants={itemVariants}
        >

          <h2>
            ⚠️ Disclaimer
          </h2>

          <p>
            This report is generated using artificial
            intelligence and is intended for informational
            and educational purposes only.
          </p>

          <p>
            It is not a substitute for professional
            medical diagnosis, advice, or treatment.
          </p>

          <p>
            Always consult a qualified healthcare
            professional regarding health concerns,
            diagnosis, medication, or treatment decisions.
          </p>

        </motion.div>

      </div>


      {/* =====================================================
          BUTTONS
          THESE ARE NOT INCLUDED IN THE PDF
      ===================================================== */}

      <motion.div
        className="report-actions"
        variants={itemVariants}
      >

        <motion.button
          type="button"
          className="download-btn"
          onClick={downloadPDF}
          whileHover={{
            scale: 1.03,
            y: -2,
          }}
          whileTap={{
            scale: 0.97,
          }}
        >
          📄 Download PDF
        </motion.button>


        <motion.button
          type="button"
          className="print-btn"
          onClick={printReport}
          whileHover={{
            scale: 1.03,
            y: -2,
          }}
          whileTap={{
            scale: 0.97,
          }}
        >
          🖨️ Print Report
        </motion.button>

      </motion.div>

    </motion.div>
  );
}

export default Report;