// api/generate.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyD72YArWl0qg8habc2gAru75lkc4yVOEpI");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { ticket, project } = req.body;

  if (!ticket || !project) {
    return res.status(400).json({ error: "Missing ticket or project" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are a helpful IT support assistant for a project called "${project}".
A user submitted this ticket:

"${ticket}"

Please generate a professional and empathetic response to reassure them and explain the next steps.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return res.status(200).json({ response });
  } catch (error) {
    console.error("Gemini API error:", error);
    return res.status(500).json({ error: "Gemini failed to generate content." });
  }
}
