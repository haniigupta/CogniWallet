![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-API-5A29E4?logo=axios&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-REST_API-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-PostgreSQL-00E599?logo=postgresql&logoColor=black)
![JWT](https://img.shields.io/badge/Auth-JWT-purple)
![Groq](https://img.shields.io/badge/Groq-GPT--OSS--20B-orange)
![Vitest](https://img.shields.io/badge/Test-Vitest-6E9F18?logo=vitest&logoColor=white)
![Supertest](https://img.shields.io/badge/Test-Supertest-FF6C37)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue)


# 💰 CogniWallet

CogniWallet is a full-stack AI-powered personal finance and expense management application built using React, Node.js, Express.js, and PostgreSQL.

The platform allows users to track income and expenses, manage categories and budgets, analyze spending patterns, and receive AI-powered financial insights using Groq's GPT-OSS-20B model.

---

## ✨ Features

- 🔐 JWT Authentication
- 💰 Income & Expense Tracking
- 🏷️ Category-based Transactions
- 📊 Financial Dashboard
- 💳 Weekly & Monthly Budgets
- 📈 Spending Analytics
- 🤖 AI-powered Financial Insights
- 💡 Personalized Saving Tips
- 🚨 Budget Alerts
- 📅 Monthly Financial Summaries
- 💬 AI Financial Assistant
- 📱 Responsive UI

---

## 🏗️ System Architecture

<p align="center">
  <img src="./docs/CogniWallet System Architecture.svg" alt="CogniWallet System Architecture" width="1000"/>
</p>

### 🤖 AI Financial Assistant

CogniWallet uses a data-grounded AI approach for its Financial Assistant.

The LLM does not directly access the PostgreSQL database. Instead, the backend retrieves the authenticated user's financial data, prepares structured context, and sends it to Groq for generating natural-language financial insights.

```text
User Question
      ↓
React Frontend
      ↓
Node.js + Express
      ↓
PostgreSQL
      ↓
User Financial Data
      ↓
Structured Financial Context
      ↓
Groq — GPT-OSS-20B
      ↓
AI Answer + Suggestions
      ↓
React Frontend
```

---

## 🛠️ Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- Axios
- Lucide React

### Backend

- Node.js
- Express.js
- REST APIs
- JWT Authentication
- bcryptjs

### Database

- PostgreSQL
- Neon PostgreSQL
- SQL-based financial analytics

### AI Stack

- Groq API
- GPT-OSS-20B
- Data-Grounded LLM
- AI Financial Assistant

### Testing

- Vitest
- Supertest

### Deployment

- Vercel
- Render
- Neon PostgreSQL
- Groq API

---

## 🚀 Live Demo

[https://cogni-wallet.vercel.app/login](https://cogni-wallet.vercel.app/login)

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/haniigupta/CogniWallet.git
cd CogniWallet
```

## Backend

```bash
cd backend
npm install
npm run dev
```

## Frontend

Open a new terminal:

```bash
cd frontend/Expense-tracker
npm install
npm run dev
```

---

## 🌐 Deployment

CogniWallet is deployed using:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Neon PostgreSQL
- **AI:** Groq API

---

## 📄 License

MIT License