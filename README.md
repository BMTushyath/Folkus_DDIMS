# Digital Identity Vault

This project is a decentralized digital identity management system that allows users to own and control their identity documents using a simulated blockchain, IPFS storage, and AI-powered security analysis.

It is structured as a monorepo with a React frontend and a Node.js backend running as a Netlify serverless function.

## Prerequisites

- Node.js (v18 or later recommended)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/): `npm install netlify-cli -g`
- A Google Gemini API Key

## Setup & Running Locally

### 1. Initial Setup

**a. Clone the repository and navigate to the project root.**

**b. Install Dependencies:**
From the project's root directory, install all the necessary dependencies for both the frontend and the serverless function.
```bash
npm install
```

**c. Set Up Environment Variables:**
Create a new file named `.env` in the root of the project directory. Add your Gemini API key to this file. The Netlify CLI will automatically make this available to your serverless function during local development.
```
API_KEY=YOUR_GEMINI_API_KEY_HERE
```
Replace `YOUR_GEMINI_API_KEY_HERE` with your actual key.

### 2. Run the Development Server

Use the Netlify CLI to run the entire application (frontend and functions) locally.
```bash
netlify dev
```
This command will:
- Start the Vite development server for the React frontend.
- Start the serverless function for the backend.
- Open a new browser window with the application running, typically on a port like `8888`.

The local development experience will accurately mimic the production environment on Netlify, including API request proxying.

## Deployment to Netlify

1.  **Push to a Git Provider:** Push your project code to a GitHub, GitLab, or Bitbucket repository.
2.  **Connect to Netlify:** Log in to your Netlify account and select "Add new site" -> "Import an existing project".
3.  **Authorize and Select Repo:** Connect to your Git provider and choose the repository for this project.
4.  **Configure Build Settings:** Netlify will automatically detect and apply the settings from the `netlify.toml` file.
5.  **Add Environment Variable:** In the site's settings, go to "Build & deploy" -> "Environment" and add your `API_KEY` with its value. This is crucial for your AI features to work in production.
6.  **Deploy:** Click "Deploy site". Netlify will build your frontend and deploy your serverless function.

## How It Works

- **Frontend (`frontend`):** The React app runs in the browser. It makes API calls to relative paths like `/api/audit`.
- **Backend (`netlify/functions`):** In production, Netlify routes requests from `/api/*` to the `api.js` serverless function. The function securely communicates with the Google Gemini API using the server-side API key.
- **Local Development:** The `netlify dev` command simulates this environment, proxying requests from the Vite server to the local function server.
