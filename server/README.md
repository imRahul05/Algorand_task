# Algo-Sender Backend

This directory contains the Express.js backend for the Algorand TestNet Transaction Sender application. It provides a RESTful API to securely interact with the Algorand blockchain and persists transaction data in a MongoDB database.

## Features

-   **RESTful API**: A clear and predictable API for sending, listing, and checking the status of transactions.
-   **Secure**: Handles sensitive data like mnemonics on the server-side only for the duration of a transaction request. Mnemonics are never stored.
-   **Persistent Storage**: Uses MongoDB to store a history of all sent transactions.
-   **Status Tracking**: Endpoints to check the on-chain confirmation status of a transaction.
-   **Environment-Based Configuration**: All sensitive keys and configuration details are managed securely via environment variables.

## Technology Stack

-   **Node.js**: A JavaScript runtime for building the server.
-   **Express.js**: A fast and minimalist web framework for Node.js.
-   **TypeScript**: For robust, type-safe backend code.
-   **MongoDB**: A NoSQL database for storing transaction data.
-   **Mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js.
-   **Algorand JS SDK**: For creating, signing, and broadcasting transactions to the Algorand network.
-   **Dotenv**: For loading environment variables from a `.env` file.

## Setup and Running

### 1. Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or newer)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A [MongoDB](https://www.mongodb.com/) instance (either local or from a cloud provider like MongoDB Atlas).

### 2. Installation

Navigate into this directory and install the required npm packages.

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory by copying the example file.

```bash
cp .env.example .env
```

Now, open the `.env` file and fill in the values:

-   `PORT`: The port for the backend server. Defaults to `5001`.
-   `MONGODB_URI`: Your MongoDB connection string.
-   `ALGOD_SERVER`: The URL of the Algorand node. For the TestNet, a reliable public option is `https://testnet-api.algonode.cloud`.
-   `ALGOD_TOKEN`: The API token for the Algorand node. For public nodes like AlgoNode, this can often be left blank.
-   `ALGOD_PORT`: The port for the Algorand node. If the port is part of the `ALGOD_SERVER` URL, this can be left blank.

### 4. Run the Server

#### For Development

To run the server in development mode with automatic reloading (using `nodemon`), use:

```bash
npm run dev
```

The API will be available at **`http://localhost:5001`**.

#### For Production

To build the TypeScript code and run the compiled JavaScript, use:

```bash
# 1. Build the project
npm run build

# 2. Start the server
npm start
```

## API Endpoints

The base URL for all endpoints is `/api/algorand`.

---

### 1. Send a Transaction

-   **Endpoint**: `POST /send`
-   **Description**: Creates a new transaction, signs it, submits it to the Algorand TestNet, and saves a record to the database.
-   **Request Body**:

    ```json
    {
      "mnemonic": "your 25 word testnet mnemonic phrase here...",
      "recipient": "RECIPIENT_ALGORAND_ADDRESS",
      "amount": 100000,
      "note": "Optional transaction note"
    }
    ```
    *Note: `amount` is in **microAlgos**. 1 ALGO = 1,000,000 microAlgos.*

-   **Success Response (201 Created)**:

    ```json
    {
        "_id": "65a8e6f1c4d7e8a9b3c1d2e3",
        "txId": "K6XU4YV5Z2N...7EIVWGLGT3B6H74A",
        "from": "SENDER_ALGORAND_ADDRESS",
        "to": "RECIPIENT_ALGORAND_ADDRESS",
        "amount": 100000,
        "note": "Optional transaction note",
        "status": "pending",
        "createdAt": "2024-01-18T10:15:13.916Z",
        "__v": 0
    }
    ```

---

### 2. Get All Transactions

-   **Endpoint**: `GET /transactions`
-   **Description**: Retrieves a list of all transactions from the database, sorted by creation date in descending order.
-   **Success Response (200 OK)**:

    ```json
    [
      {
        "_id": "65a8e6f1c4d7e8a9b3c1d2e3",
        "txId": "K6XU4YV5Z2N...7EIVWGLGT3B6H74A",
        "from": "...",
        "to": "...",
        "amount": 100000,
        "note": "Test transfer",
        "status": "confirmed",
        "createdAt": "2024-01-18T10:15:13.916Z",
        "confirmedRound": 34510250
      },
      {
        "_id": "65a8e5a0c4d7e8a9b3c1d2d9",
        "txId": "L9ABCDE...",
        "from": "...",
        "to": "...",
        "amount": 500000,
        "note": "Another test",
        "status": "confirmed",
        "createdAt": "2024-01-18T10:09:36.111Z",
        "confirmedRound": 34510192
      }
    ]
    ```

---

### 3. Get Transaction Status

-   **Endpoint**: `GET /status/:txId`
-   **Description**: Checks the on-chain status of a specific transaction. If the transaction is confirmed, its status in the database is updated.
-   **URL Parameters**:
    -   `txId` (string): The transaction ID to check.
-   **Success Response (200 OK)**:
    -   Returns the transaction object from the database. The `status` field will be updated to `confirmed` if confirmation is found on the blockchain.

    ```json
    {
        "_id": "65a8e6f1c4d7e8a9b3c1d2e3",
        "txId": "K6XU4YV5Z2N...7EIVWGLGT3B6H74A",
        "from": "...",
        "to": "...",
        "amount": 100000,
        "note": "Test transfer",
        "status": "confirmed",
        "createdAt": "2024-01-18T10:15:13.916Z",
        "confirmedRound": 34510250
    }
    ```

## Database Schema (Mongoose)

The `Transaction` schema defines the structure of documents stored in the `transactions` collection.

-   **txId**: `String` (unique, indexed) - The Algorand transaction ID.
-   **from**: `String` - The sender's address.
-   **to**: `String` - The recipient's address.
-   **amount**: `Number` - The amount transferred, in microAlgos.
-   **note**: `String` - An optional note.
-   **status**: `String` (enum: `pending`, `confirmed`, `failed`) - The current status of the transaction.
-   **createdAt**: `Date` - Timestamp of when the transaction was submitted.
-   **confirmedRound**: `Number` (optional) - The blockchain round in which the transaction was confirmed.
