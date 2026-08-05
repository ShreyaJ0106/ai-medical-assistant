import { useState } from "react";
import api from "../services/api";

function MedicalForm({ setReport }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    symptoms: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await api.post("/medical-report", form);

      setReport(res.data);
    } catch (err) {
      console.log(err);
      alert("Unable to connect to AI Workflow");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Patient Name"
        onChange={handleChange}
      />

      <input
        name="age"
        type="number"
        placeholder="Age"
        onChange={handleChange}
      />

      <select
        name="gender"
        onChange={handleChange}
      >
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>

      <textarea
        name="symptoms"
        rows="5"
        placeholder="Symptoms"
        onChange={handleChange}
      />

      <button>
        {loading ? "Generating..." : "Generate Medical Report"}
      </button>
    </form>
  );
}

export default MedicalForm;