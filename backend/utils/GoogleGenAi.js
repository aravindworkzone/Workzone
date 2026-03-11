const { GoogleGenAI } = require("@google/genai");
const { SUGGESTION_AI } = require('./contents');

const AI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function AICall(model,message) {
  try {
    const res = await AI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a productivity assistant. ${SUGGESTION_AI[model]} ${message}`,
    });

    const cleaned = res.text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    if (error.status === 429) {
      return {
        error: "AI service busy. Try again later for suggestions."
      };
    }
    console.error(error);
  }
}

module.exports = { AICall };