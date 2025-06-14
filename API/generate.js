export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ticket, project } = req.body;

  if (!ticket || !project) {
    return res.status(400).json({ error: 'Missing ticket or project' });
  }

  // --- Replace this with your actual AI logic (e.g., calling Gemini/OpenAI) ---
  const aiDraft = `
    Thank you for your ticket regarding ${project}.

    I understand that you're experiencing: "${ticket.substring(0, 100)}${ticket.length > 100 ? '...' : ''}"

    Our team is looking into this issue and will get back to you shortly.

    Please check your email or this ticket for updates. If you have any urgent concerns, please reply to this message.

    Best regards,
    ${project} Support Team
  `;

  return res.status(200).json({ response: aiDraft.trim() });
}
