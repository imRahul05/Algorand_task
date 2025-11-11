# 🚀 Algo-Sender Frontend

A modern UI for sending and tracking **Algorand TestNet** transactions. Built with **React + Vite + TypeScript + Tailwind**, designed for speed & simplicity.

---

## 🌟 Features

<p>
  <img src="https://img.shields.io/badge/Dark%20%2F%20Light%20Mode-000000?logo=windows-terminal&logoColor=white" />
  <img src="https://img.shields.io/badge/Send%20ALGO-4B89FF?logo=algorand&logoColor=white" />
  <img src="https://img.shields.io/badge/Real--Time%20Transaction%20Tracking-4ade80" />
  <img src="https://img.shields.io/badge/Client--Side%20Validation-9333EA" />
  <img src="https://img.shields.io/badge/Toast%20Notifications-FCD34D" />
  <img src="https://img.shields.io/badge/Responsive%20Design-14B8A6" />
</p>

- ✅ Clean & responsive UI  
- 🌙 Dark & light modes  
- ⚡ Fast interaction with instant feedback  
- ⏳ Auto-polling pending transactions  
- 🧠 Client-side mnemonic & address validation  
- 🔗 Explorer links for every transaction  

---

## 🧠 Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=fff" />
  <img src="https://img.shields.io/badge/Algorand%20SDK-000000?logo=algorand&logoColor=fff" />
</p>

---

## 📦 Prerequisites

- Node.js ≥ 18
- npm or yarn
- Running backend server (Algo-Sender API)

---



## ⚙️ Setup & Install

Follow these steps to get the frontend development server running on your local machine.

### 1. Installation

Clone the repository and navigate to the project's root directory. Then, install the required npm packages:

```bash
npm install
```

### 2. Configuration

The frontend is configured to communicate with the backend API at `http://localhost:5001`. If your backend is running on a different URL, you must update the `API_BASE_URL` constant in `src/services/apiService.ts`.

### 3. Running the Development Server

Once the dependencies are installed and the backend is running, start the Vite development server:

```bash
npm run dev
```

The application will be available at **`http://localhost:5173`** (or the next available port).

## Project Structure

```
.
├── public/              # Static assets
└── src/
    ├── components/      # Reusable React components (UI, Forms, etc.)
    ├── hooks/           # Custom React hooks (useTheme, useToast)
    ├── services/        # Service for communicating with the backend API (apiService.ts)
    ├── types/           # Centralized TypeScript type definitions
    ├── App.tsx          # Main application component and layout
    └── index.tsx        # Application entry point
```
