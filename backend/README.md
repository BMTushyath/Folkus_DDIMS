
# Digital Identity Vault

This project is a decentralized digital identity management system that allows users to own and control their identity documents using a simulated blockchain, IPFS storage, and AI-powered security analysis.

It is composed of a React frontend and a Node.js backend.

## Prerequisites

- Node.js (v18 or later recommended)
- A Google Gemini API Key

## Setup & Running the Application

You will need to run two separate processes in two different terminals: the backend server and the frontend development server.

### 1. Backend Setup

The backend is a Node.js server that handles data and securely communicates with the Gemini API. It is located in the `backend` directory.

**a. Navigate to the Backend Directory:**
```bash
cd backend
```

**b. Install Dependencies:**
```bash
npm install
```

**c. Set Up Environment Variables:**
Create a new file named `.env` in the `backend` directory. Add your Gemini API key to this file:
```
API_KEY=YOUR_GEMINI_API_KEY_HERE
```
Replace `YOUR_GEMINI_API_KEY_HERE` with your actual key.

**d. Run the Backend Server:**
Start the server with the following command:
```bash
npm start
```
You should see a message indicating that the server is running on `http://localhost:3001`. Keep this terminal window open.

### 2. Frontend Setup

The frontend is a React application that the user interacts with in their browser. It is located in the `frontend` directory.

**a. Open a New Terminal:**
Open a second terminal window and navigate to the **root** of the project directory (the one containing `frontend` and `backend`).

**b. Run the Frontend:**
The frontend is served directly from the `index.html` file and uses a local development server to do so. A simple way to run it is using the `serve` package:
```bash
# This command serves the contents of the 'frontend' directory
npx serve frontend
```
This will start a local server, typically on a port like `3000` or `5000`. Open the URL provided in your browser to access the application.

## How It Works

- **Frontend:** The React app in `frontend` runs in your browser and makes API calls to the backend server at `http://localhost:3001`.
- **Backend:** The Express server in `backend` receives these requests, manages user data (in memory for this demo), and makes secure calls to the Google Gemini API for the AI Security Audit feature. Your API key is never exposed to the browser.