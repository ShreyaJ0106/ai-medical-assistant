import ReactMarkdown from "react-markdown";

function Report({ report }) {
  if (!report) return null;

  return (
    <div className="report">
      <h2>Medical Report</h2>

      <p><strong>Patient Name:</strong> {report.patient_name}</p>

      <p><strong>Possible Disease:</strong> {report.possible_disease}</p>

      <p><strong>Severity:</strong> {report.severity}</p>

      <p><strong>Treatment:</strong> {report.treatment}</p>

      <hr />

      <h3>AI Medical Report</h3>

      <ReactMarkdown>
        {report.ai_report}
      </ReactMarkdown>
    </div>
  );
}

export default Report;