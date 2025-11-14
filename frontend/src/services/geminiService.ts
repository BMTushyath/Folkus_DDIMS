const API_BASE_URL = '/api';

export async function analyzeWithGemini(userInput: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/audit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: userInput }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API request failed');
    }

    const data = await response.json();
    return data.analysis;
  } catch (error) {
    console.error("Error calling backend for analysis:", error);
    throw new Error("Failed to communicate with the backend service.");
  }
}

export async function translateText(text: string, language: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, language }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API request failed');
    }

    const data = await response.json();
    return data.translation;
  } catch (error) {
    console.error("Error calling backend for translation:", error);
    throw new Error("Failed to communicate with the backend service for translation.");
  }
}
