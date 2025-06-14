```javascript
     const { GoogleGenerativeAI } = require("@google/generative-ai");

     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

     module.exports = async function handler(req, res) {
       if (req.method !== 'POST') {
         return res.status(405).json({ error: 'Method not allowed' });
       }

       try {
         const { ticket, project } = req.body;
         
         if (!ticket || !project) {
            return res.status(400).json({ error: 'Missing required fields' });
         }

         // Generate a response (this is a simple example, you might want to use the actual Gemini API)
         const response = `Thank you for your ticket regarding ${project}.
