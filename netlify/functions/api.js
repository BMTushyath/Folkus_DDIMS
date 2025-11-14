const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const serverless = require('serverless-http');

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

// --- Gemini AI Setup ---
const API_KEY = process.env.API_KEY;

// We create the AI instance inside the handler to ensure it uses the most recent API_KEY,
// especially in a serverless environment where environment variables can be updated.
let ai;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.error("Gemini API key not found. Please set the API_KEY environment variable in your Netlify settings.");
}


// --- API Routes ---
// Note: The base path is `/api/` which is configured in netlify.toml and handled by serverless-http.
// So, a request to /api/audit will be handled by router.post('/audit', ...).

router.post('/audit', async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: 'The AI service is not configured on the server.' });
  }

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

router.post('/translate', async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: 'The AI service is not configured on the server.' });
  }

  const { text, language } = req.body;
  if (!text || !language) {
    return res.status(400).json({ error: 'Text and language are required.' });
  }

  const model = "gemini-2.5-flash";
  const prompt = `
    Translate the following security analysis report into ${language}.
    It is critical that you PRESERVE THE ORIGINAL STRUCTURE AND EXACT ENGLISH LABELS ("Risk Level:", "Summary:", "Analysis:", "Recommendation:").
    Only translate the content that follows these labels.

    Report to translate:
    ---
    ${text}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    res.json({ translation: response.text });
  } catch (error)    {
    console.error("Error calling Gemini API for translation:", error);
    res.status(500).json({ error: "Failed to communicate with the Gemini API for translation." });
  }
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);