import { GoogleGenerativeAI } from '@google/generative-ai';

// Your API key from Google AI Studio (https://makersuite.google.com/app/apikey)
const API_KEY = 'YOUR_API_KEY';
const genAI = new GoogleGenerativeAI(API_KEY);

export async function getAIResponse(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI API Error:', error);
    throw new Error('Failed to get AI response');
  }
}