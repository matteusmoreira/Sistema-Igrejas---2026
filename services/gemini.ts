import { GoogleGenAI } from "@google/genai";
import { FinancialRecord } from "../types";

// In a real app, use a proxy backend or ensure API key is restricted.
// For this demo, we assume process.env.API_KEY is available.

export const getFinancialInsight = async (data: FinancialRecord[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "AI Configuration missing. Please set API_KEY.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Calculate simple stats to send less token data
    const recentData = data.slice(-3); 
    const prompt = `
      Analyze the following church financial data (last 3 months):
      ${JSON.stringify(recentData)}
      
      Provide a 2-sentence strategic insight about the trend in tithes vs offerings. 
      Be encouraging but analytical. Use "Tithes" and "Offerings" terminology.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No insight generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate AI insight at this moment.";
  }
};