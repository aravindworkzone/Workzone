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
                "routine": ["Unrealistic Goal"]
                }

                Yearly goal:
                `
}

async function AICall(model,message) {
  try {
    const res = await AI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a productivity assistant. ${task[model]} ${message}`,
    });

    console.log(res.text);
    return JSON.parse(res.text);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { AICall };