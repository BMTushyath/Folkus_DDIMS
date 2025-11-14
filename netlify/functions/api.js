const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const serverless = require('serverless-http');
require('dotenv/config');

const app = express();

app.use(cors());
app.use(express.json());

// --- Gemini AI Setup ---
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // This won't throw an error during build but will cause runtime errors if the key isn't set.
  // Netlify's build process sets env vars, but for safety, we log an error.
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });


// --- API Routes ---
// The /api prefix is handled by Netlify's rewrite rule.
// A request to /api/audit is routed to this function, and Express sees the path as /audit.
app.post('/audit', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required.' });
  }
  if (!API_KEY) {
    return res.status(500).json({ error: 'Server is not configured with an API key.' });
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

app.post('/translate', async (req, res) => {
  const { text, language } = req.body;
  if (!text || !language) {
    return res.status(400).json({ error: 'Text and language are required.' });
  }
   if (!API_KEY) {
    return res.status(500).json({ error: 'Server is not configured with an API key.' });
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


module.exports.handler = serverless(app);
