# Digital Identity Vault

This project is a decentralized digital identity management system that allows users to own and control their identity documents using a simulated blockchain, IPFS storage, and AI-powered security analysis.

It is composed of a React frontend and a Node.js backend.

## Prerequisites

- Node.js (v18 or later recommended)
- A Google Gemini API Key

## Setup & Running the Application

You will need to run two separate processes in two different terminals: the backend server and the frontend development server.

### 1. Backend Setup

The backend is a Node.js server that handles data and securely communicates with the Gemini API.

**a. Install Dependencies:**
Navigate to the project's root directory in your terminal and install the required packages.
```bash
npm install
```

**b. Set Up Environment Variables:**
Create a new file named `.env` in the root of the project directory. Add your Gemini API key to this file:
```
API_KEY=YOUR_GEMINI_API_KEY_HERE
```
Replace `YOUR_GEMINI_API_KEY_HERE` with your actual key.

**c. Run the Backend Server:**
Start the server with the following command:
```bash
npm start
```
You should see a message indicating that the server is running on `http://localhost:3001`. Keep this terminal window open.

### 2. Frontend Setup

The frontend is a React application that the user interacts with in their browser.

**a. Open a New Terminal:**
Open a second terminal window and navigate to the same project directory.

**b. Run the Frontend:**
The frontend is served directly from the `index.html` file and uses a local development server to do so. If you have a preferred local server tool (like `serve` or Python's `http.server`), you can use that.

A simple way to run it is using the `serve` package:
```bash
# If you don't have 'serve' installed globally
npx serve

# Or if you have it installed
serve
```
This will start a local server, typically on a port like `3000` or `5000`. Open the URL provided in your browser to access the application.

## How It Works

- **Frontend:** The React app in your browser makes API calls to the backend server at `http://localhost:3001`.
- **Backend:** The Express server receives these requests, manages user data (in memory for this demo), and makes secure calls to the Google Gemini API for the AI Security Audit feature. Your API key is never exposed to the browser.
