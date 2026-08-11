import { useState } from "react";
import Header from "./components/Header";
import MedicalForm from "./components/MedicalForm";
import Report from "./components/Report";
import "./styles/App.css";

function App() {
  const [report, setReport] = useState(null);

  return (
    <div className="app">

      <Header />

      <main className="main-container">

        <section className="form-card">
          <MedicalForm setReport={setReport} />
        </section>

        {report && (
          <section className="report-section">
            <Report report={report} />
          </section>
        )}

      </main>

    </div>
  );
}

export default App;