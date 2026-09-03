# CogniWallet

> AI-powered personal finance and expense management application.

CogniWallet helps users track income and expenses, manage budgets, and get AI-powered insights into their spending.

## 🚀 Live Demo

https://cogni-wallet.vercel.app/login

## ✨ Features

* JWT-based authentication
* Income and expense tracking
* Category-based transactions
* Weekly and monthly budgets
* Financial dashboard and spending insights
* AI-powered budget analysis and spending alerts
* Personalized saving tips
* Responsive UI

## 🛠️ Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Axios, Lucide React

**Backend:** Node.js, Express.js, PostgreSQL, JWT

**AI:** Groq API, `openai/gpt-oss-20b`

**Deployment:** Vercel, Render, Neon PostgreSQL

## ⚙️ Local Setup

### Backend

```bash
git clone https://github.com/haniigupta/CogniWallet.git
cd CogniWallet/backend
npm install
npm start
```

Create `backend/.env`:

```env
PORT=8000
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

### Frontend

```bash
cd frontend/Expense-tracker
npm install
npm run dev
```

Create `frontend/Expense-tracker/.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

## 👨‍💻 Author

**Hani Gupta**

[GitHub](https://github.com/haniigupta)
