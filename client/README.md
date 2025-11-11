# Algo-Sender Frontend

This is the frontend for the Algo-Sender application, a modern and responsive web interface for sending and tracking transactions on the Algorand TestNet. It is built with React, Vite, and TypeScript, and styled with Tailwind CSS.

## Features

-   **Modern User Interface**: A clean, responsive, and intuitive UI that works seamlessly on all devices.
-   **Dark & Light Modes**: Switch between themes for your viewing comfort.
-   **Send Transactions**: An easy-to-use form to create and send ALGO transactions on the TestNet.
-   **Real-time Tracking**: A transaction list that automatically polls the backend to update the confirmation status of pending transactions.
-   **Instant Feedback**: Toast notifications provide immediate feedback on transaction submissions and confirmations.
-   **Client-Side Validation**: The form validates addresses and mnemonics instantly in the browser before submission.
-   **Direct Explorer Links**: Each transaction ID links directly to the `allo.info` block explorer for detailed verification.

## Technology Stack

-   **React 19**: A modern JavaScript library for building user interfaces.
-   **Vite**: A next-generation frontend tooling for a blazing-fast development experience.
-   **TypeScript**: For static type-checking, leading to more robust and maintainable code.
-   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
-   **Algorand JS SDK**: Loaded via CDN to perform client-side address and mnemonic validation.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or newer)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A running instance of the [Algo-Sender Backend](../server/README.md).

## Getting Started

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
