const { GoogleGenAI } = require("@google/genai");

const AI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const task = {
    routine: `Convert the yearly goal into a daily routine.
                Rules:
                - Respond ONLY in valid JSON.
                - Do not include explanation.
                - Output format must be:
                ["task1", "task2", "task3"]
                - Each routine item must be maximum 40 characters.
                - Keep tasks short and clear.
                - if task is unrealistic. respone
                {
                "error": [why you unable to generate suggestions (max 100 characters)]
                }
                - respone should not contanin '-'

                Yearly goal:
                `
}

async function AICall(model,message) {
  try {
    const res = await AI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a productivity assistant. ${task[model]} ${message}`,
    });

    const cleaned = res.text.replace(/```json|```/g, "").trim();

    console.log(cleaned);
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