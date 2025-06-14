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
         res.status(200).json({ response });
       } catch (error) {
         console.error('Error in API function:', error);
         res.status(500).json({ error: 'Internal server error' });
       }
     };
