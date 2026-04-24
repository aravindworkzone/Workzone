// ai.js
const { GoogleGenAI } = require("@google/genai");
const { SUGGESTION_AI } = require('./contents');

const AI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function AICall(promptKey, message) {
  try {
    const res = await AI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a productivity assistant. ${SUGGESTION_AI[promptKey]} ${message}`,
    });

    const cleaned = res.text.replace(/```json|```/g, "").trim();

    try {
      return { data: JSON.parse(cleaned) };
    } catch {
      return { error: { status: 500, message: "AI returned malformed response." } };
    }

  } catch (error) {
    if (error.status === 429) {
      return { error: { status: 429, message: "AI service busy. Try again later." } };
    }
    console.error("[AICall Error]", error);
    return { error: { status: 500, message: "AI service unavailable." } };
  }
}

module.exports = { AICall };