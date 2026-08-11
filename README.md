# 🏥 AI Medical Assistant

An AI-powered web application that analyzes patient symptoms, matches possible diseases, and generates a preliminary AI-assisted medical report using **React, Node.js, n8n, and Google Gemini AI**.

## 🚀 Features

- 🩺 Patient symptom analysis
- 🧠 Disease matching
- ⚠️ Severity assessment
- 💊 Treatment recommendations
- 🤖 AI-generated medical report
- 🔄 n8n workflow automation
- 📄 Multi-page PDF export
- 🖨️ Print report
- 📱 Responsive UI
- 🔔 Error/toast notifications

## 🛠️ Tech Stack

**Frontend:** React, Vite, Axios, Framer Motion, React Markdown, jsPDF, html2canvas

**Backend:** Node.js, Express.js, Axios, CORS, dotenv

**AI & Automation:** n8n, Google Gemini AI

## 🏗️ Architecture

```text
Patient
   ↓
React Frontend
   ↓
Express Backend
   ↓
n8n Webhook
   ↓
Medical Database
   ↓
Disease Matching
   ↓
Google Gemini AI
   ↓
Medical Report
   ↓
React UI
   ↓
PDF / Print
📂 Project Structure
ai-medical-assistant/
├── backend/
├── frontend/
├── medical-data/
├── n8n/
├── workflows/
├── screenshots/
└── README.md
⚙️ Installation
Backend
cd backend
npm install
node server.js
Frontend
cd frontend
npm install
npm run dev
Environment Variables

Create backend/.env:

PORT=5000
N8N_WEBHOOK=http://localhost:5678/webhook/patient-intake
🔌 API
POST /api/report

Example:

{
  "name": "Test Patient",
  "age": "22",
  "gender": "Female",
  "symptoms": "vomiting, diarrhea, stomach pain"
}

Example result:

Disease: Food Poisoning
Severity: Medium
Match Score: 3
🔄 n8n Workflow

The n8n workflow receives patient information through a webhook, performs disease matching, sends the relevant information to Google Gemini AI, and returns the final medical report to the backend.

⚠️ Medical Disclaimer

This application provides an AI-generated preliminary assessment for informational purposes only. It is not a substitute for professional medical diagnosis, advice, or treatment. Users should consult a qualified healthcare professional.

👩‍💻 Author

Shreya Jaiswal
MCA Student | AI & Web Technology Enthusiast

📌 Status

Completed and tested locally.


Then run:

```bash
git add README.md
git commit -m "Update README"
git push origin main
