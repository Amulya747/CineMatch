import { GoogleGenAI, Type } from "@google/genai";
import { Movie } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const movieSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "The title of the movie" },
      year: { type: Type.STRING, description: "Release year" },
      genre: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of genres" },
      description: { type: Type.STRING, description: "Short plot summary" },
      rating: { type: Type.STRING, description: "IMDb or similar rating" },
      language: { type: Type.STRING, description: "Original language" },
      country: { type: Type.STRING, description: "Country of origin" },
      streamingPlatforms: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING }, 
        description: "List of major OTT platforms where the movie is likely available (e.g., Netflix, Disney+, Amazon Prime, etc.)" 
      }
    },
    required: ["title", "year", "genre", "description", "rating", "language", "country", "streamingPlatforms"]
  }
};

export async function getRecommendations(prompt: string): Promise<Movie[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: movieSchema,
        systemInstruction: "You are a movie recommendation expert. Provide high-quality, diverse movie recommendations from all languages and countries. For each movie, include a list of major OTT platforms where it is commonly available. Ensure the output is strictly valid JSON matching the requested schema."
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
}

export async function saveToHistory(type: string, query: string, results: Movie[]) {
  try {
    await fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, query, results })
    });
  } catch (error) {
    console.error("Failed to save history:", error);
  }
}

export async function fetchHistory() {
  try {
    const response = await fetch("/api/history");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return [];
  }
}
