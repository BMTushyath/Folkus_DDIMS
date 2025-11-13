import { GoogleGenAI } from "@google/genai";

// The platform provides process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function analyzeWithGemini(userInput: string): Promise<string> {
  try {
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
      User Input: "${userInput}"
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
}