# 🏥 AI Medical Assistant

An AI-powered Medical Assistant that predicts diseases based on symptoms and generates AI-powered medical reports using Google Gemini AI and n8n.

---

## Features

- Disease Prediction
- AI Generated Medical Report
- Google Gemini AI
- n8n Automation
- React Frontend
- Express Backend
- Downloadable Report
- Responsive UI

---

## Tech Stack

- React
- Vite
- Express.js
- Node.js
- n8n
- Google Gemini AI
- Axios

---

## Project Structure

```
backend/
frontend/
n8n/
```

---

## Installation

### Backend

```bash
cd backend
npm install
node server.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### n8n

Start n8n.

Import

```
n8n/AI-Medical-Assistant-Workflow.json
```

Configure Gemini credentials.

Publish the workflow.

---

## Backend Environment Variables

```
PORT=5000

N8N_WEBHOOK=http://localhost:5678/webhook/patient-intake
```

---

## Author

Shreya Jaiswal
