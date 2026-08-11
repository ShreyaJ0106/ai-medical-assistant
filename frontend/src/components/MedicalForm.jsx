import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import "../styles/Form.css";

function MedicalForm({ setReport }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    symptoms: "",
  });

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // SUBMIT FORM
  // ==========================================

  const submitHandler = async (e) => {
    e.preventDefault();

    // ========================================
    // VALIDATION
    // ========================================

    if (!formData.name.trim()) {
      toast.error("Please enter patient name.");
      return;
    }

    if (!formData.age) {
      toast.error("Please enter patient age.");
      return;
    }

    if (
      Number(formData.age) <= 0 ||
      Number(formData.age) > 120
    ) {
      toast.error(
        "Please enter a valid age between 1 and 120."
      );
      return;
    }

    if (!formData.gender) {
      toast.error("Please select gender.");
      return;
    }

    if (!formData.symptoms.trim()) {
      toast.error("Please describe the symptoms.");
      return;
    }

    // ========================================
    // START LOADING
    // ========================================

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/report",
        formData
      );

      console.log(
        "Medical report response:",
        res.data
      );

      if (!res.data) {
        throw new Error(
          "Empty response received from server."
        );
      }

      if (res.data.success === false) {
        throw new Error(
          res.data.error ||
            "Unable to generate medical report."
        );
      }

      // ======================================
      // SAVE REPORT
      // ======================================

      setReport(res.data);

      toast.success(
        "Medical report generated successfully!"
      );

      // ======================================
      // SCROLL TO REPORT
      // ======================================

      setTimeout(() => {
        const reportElement =
          document.getElementById(
            "medical-report"
          );

        if (reportElement) {
          reportElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 300);

    } catch (err) {
      console.error(
        "Medical report error:",
        err
      );

      // ======================================
      // SERVER ERROR
      // ======================================

      if (err.response) {
        toast.error(
          err.response.data?.error ||
            "Server error while generating the medical report."
        );
      }

      // ======================================
      // CONNECTION ERROR
      // ======================================

      else if (err.request) {
        toast.error(
          "Unable to connect to the backend. Please make sure the server is running."
        );
      }

      // ======================================
      // OTHER ERROR
      // ======================================

      else {
        toast.error(
          err.message ||
            "Unable to generate medical report. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORM ANIMATION
  // ==========================================

  const formVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.08,
      },
    },
  };

  // ==========================================
  // FIELD ANIMATION
  // ==========================================

  const fieldVariants = {
    hidden: {
      opacity: 0,
      y: 15,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.35,
        ease: "easeOut",
      },
    },
  };

  // ==========================================
  // INPUT FOCUS ANIMATION
  // ==========================================

  const focusAnimation = {
    scale: 1.01,
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <motion.form
      className="medical-form"
      onSubmit={submitHandler}
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >

      {/* =====================================
          PATIENT NAME
      ===================================== */}

      <motion.div
        className="form-group"
        variants={fieldVariants}
      >
        <label htmlFor="name">
          👤 Patient Name
        </label>

        <motion.input
          id="name"
          type="text"
          name="name"
          placeholder="Enter patient's full name"
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
          required
          whileFocus={focusAnimation}
          transition={{ duration: 0.15 }}
        />
      </motion.div>


      {/* =====================================
          AGE
      ===================================== */}

      <motion.div
        className="form-group"
        variants={fieldVariants}
      >
        <label htmlFor="age">
          🎂 Age
        </label>

        <motion.input
          id="age"
          type="number"
          name="age"
          placeholder="Enter patient's age"
          value={formData.age}
          onChange={handleChange}
          min="1"
          max="120"
          disabled={loading}
          required
          whileFocus={focusAnimation}
          transition={{ duration: 0.15 }}
        />
      </motion.div>


      {/* =====================================
          GENDER
      ===================================== */}

      <motion.div
        className="form-group"
        variants={fieldVariants}
      >
        <label htmlFor="gender">
          ⚧️ Gender
        </label>

        <motion.select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          disabled={loading}
          required
          whileFocus={focusAnimation}
          transition={{ duration: 0.15 }}
        >
          <option value="Male">
            Male
          </option>

          <option value="Female">
            Female
          </option>

          <option value="Other">
            Other
          </option>
        </motion.select>
      </motion.div>


      {/* =====================================
          SYMPTOMS
      ===================================== */}

      <motion.div
        className="form-group"
        variants={fieldVariants}
      >
        <label htmlFor="symptoms">
          🤒 Symptoms
        </label>

        <motion.textarea
          id="symptoms"
          name="symptoms"
          placeholder="Describe your symptoms, e.g. fever, headache, cough..."
          rows="5"
          value={formData.symptoms}
          onChange={handleChange}
          disabled={loading}
          required
          whileFocus={focusAnimation}
          transition={{ duration: 0.15 }}
        />
      </motion.div>


      {/* =====================================
          GENERATE BUTTON
      ===================================== */}

      <motion.button
        type="submit"
        disabled={loading}
        className={
          loading
            ? "generate-btn loading-button"
            : "generate-btn"
        }
        variants={fieldVariants}
        whileHover={
          !loading
            ? {
                scale: 1.03,
                y: -2,
              }
            : {}
        }
        whileTap={
          !loading
            ? {
                scale: 0.97,
              }
            : {}
        }
        transition={{
          duration: 0.15,
        }}
      >
        {loading ? (
          <span className="loading-content">
            <span className="spinner"></span>

            <span>
              Generating AI Medical Report...
            </span>
          </span>
        ) : (
          "🩺 Generate Medical Report"
        )}
      </motion.button>

    </motion.form>
  );
}

export default MedicalForm;