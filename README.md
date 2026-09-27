![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)

![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql)

![Groq](https://img.shields.io/badge/Groq-GPT--OSS--20B-orange)

![JWT](https://img.shields.io/badge/Auth-JWT-purple)

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

### 📅 Monthly Financial Summary

Generates a financial summary using the user's income, expenses, savings rate, category-wise spending, and previous financial data.

### 💡 Personalized Saving Tips

Analyzes recent financial activity and generates practical saving suggestions based on the user's spending patterns.

### 🚨 Budget Alerts

Analyzes current spending against category budgets and generates budget-related alerts.

### 💬 Financial Assistant

Allows users to ask natural-language questions about their personal financial activity.

Example questions:

```text
Why am I spending so much?

Where am I spending the most?

How can I save money?

What changed since last month?
```

The backend retrieves the relevant financial data from PostgreSQL before sending structured context to the LLM.

The AI is responsible for interpreting and explaining the financial data, while PostgreSQL remains the source of truth for the underlying financial records.

---

## 📄 License

MIT License