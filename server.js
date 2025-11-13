import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// --- Gemini AI Setup ---
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("Gemini API key not found. Please set the API_KEY environment variable in a .env file.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- In-Memory Database ---
// Stores data per wallet address
const db = {};

const initializeUser = (walletAddress) => {
  if (!db[walletAddress]) {
    db[walletAddress] = {
      documents: [
        { id: 'doc-1', name: 'Passport.pdf', ipfsHash: 'QmXoW8..A4o', encrypted: true, type: 'pdf' },
        { id: 'doc-2', name: 'DriversLicense.jpg', ipfsHash: 'QmYp4o..B7i', encrypted: true, type: 'image' },
      ],
      credentials: [
        { id: 'cred-1', docId: 'doc-1', issuer: '0xGov...', owner: walletAddress, fields: { name: 'Alice', dob: '1990-01-01', country: 'USA' } },
        { id: 'cred-2', docId: 'doc-2', issuer: '0xDMV...', owner: walletAddress, fields: { name: 'Alice', licenseNo: 'D12345', state: 'CA' } },
      ],
      heirs: [
        { id: 'heir-1', name: 'Bob', address: '0xabc...def', triggerCondition: 'Inactive for 180 days' }
      ],
    };
  }
};

// --- API Routes ---

app.post('/api/login', (req, res) => {
  const mockAddress = `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  initializeUser(mockAddress);
  res.json({
    walletAddress: mockAddress,
    ...db[mockAddress]
  });
});

app.post('/api/documents', (req, res) => {
  const { walletAddress, name, type } = req.body;
  if (!walletAddress || !db[walletAddress]) {
    return res.status(404).json({ error: 'User not found' });
  }
  const newDoc = {
    id: `doc-${Date.now()}`,
    name,
    ipfsHash: `QmServer...${Math.random().toString(36).substring(2, 8)}`,
    encrypted: true,
    type,
  };
  db[walletAddress].documents.push(newDoc);
  res.status(201).json(newDoc);
});

app.post('/api/heirs', (req, res) => {
  const { walletAddress, name, address, triggerCondition } = req.body;
  if (!walletAddress || !db[walletAddress]) {
    return res.status(404).json({ error: 'User not found' });
  }
  const newHeir = { id: `heir-${Date.now()}`, name, address, triggerCondition };
  db[walletAddress].heirs.push(newHeir);
  res.status(201).json(newHeir);
});

app.post('/api/audit', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required.' });
  }

  const model = "gemini-2.5-flash";
  const prompt = `
    You are a world-class blockchain and cybersecurity expert. Your task is to analyze user-provided descriptions of digital identity credentials, transactions, or communications for potential security risks.
    Analyze the following user input for any signs of:
    - Phishing attempts
    - Social engineering tactics
    - Privacy leaks (sharing too much information)
    - Potential for fraud or identity theft
    - Unsecure practices
    Provide a clear, concise, and easy-to-understand analysis. Structure your response with:
    1.  **Risk Level:** (e.g., CRITICAL, HIGH, MEDIUM, LOW, NONE)
    2.  **Summary:** A brief one-sentence summary of the situation.
    3.  **Analysis:** A bulleted list of potential risks and why they are concerning.
    4.  **Recommendation:** A clear, actionable recommendation for the user.
    User Input: "${query}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    res.json({ analysis: response.text });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Failed to communicate with the Gemini API." });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
