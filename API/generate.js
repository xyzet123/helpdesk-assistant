import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client with your API key
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
You are a helpful IT support assistant for a company working on a project called "${project}".
A user submitted the following ticket:

"${ticket}"

Please generate a professional and empathetic response addressing the issue and assuring them help is on the way.
Include a closing line from the "${project} Support Team".
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return res.status(200).json({ response });
  } catch (err) {
    console.error("Gemini API error:", err);
    return res.status(500).json({ error: "Failed to generate response." });
  }
}
