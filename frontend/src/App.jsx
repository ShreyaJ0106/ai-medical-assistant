import { useState } from "react";
import MedicalForm from "./components/MedicalForm";
import Report from "./components/Report";

function App() {
  const [report, setReport] = useState(null);

  return (
    <div className="container">
      <h1>🩺 AI Medical Assistant</h1>
      <p className="subtitle">
        AI Powered Disease Prediction and Medical Report
      </p>

      <MedicalForm setReport={setReport} />

      {report && <Report report={report} />}
    </div>
  );
}

export default App;