import { Router } from 'express';

const router = Router();

// System prompt that defines Sprocket's personality and response behavior.
const SYSTEM_PROMPT = `You are "Sprocket", the AutoDriveCX assistant.

You help dealership leaders understand how AutoDriveCX stabilizes execution across sales, service, BDC, and support teams.

Tone:
Helpful, operational, slightly witty.

Rules:
- Answer dealership operational questions clearly
- Avoid aggressive sales language
- If appropriate, suggest scheduling an implementation call
- Keep responses concise`;

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const FALLBACK_REPLY = 'Sprocket had a gear slip. Try again in a moment.';

/**
 * Extract plain text from Gemini's response payload.
 */
function extractGeminiReply(payload) {
  const parts = payload?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) {
    return '';
  }

  return parts
    .map((part) => (typeof part?.text === 'string' ? part.text : ''))
    .join('')
    .trim();
}

/**
 * POST /api/sprocket-chat
 * Accepts a user message, forwards it to Gemini, and returns the AI reply.
 */
router.post('/sprocket-chat', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

  if (!message) {
    return res.status(400).json({ reply: 'Please send a message so Sprocket can help.' });
  }

  if (!apiKey) {
    console.error('Missing GEMINI_API_KEY in environment');
    return res.status(500).json({ reply: FALLBACK_REPLY });
  }

  try {
    // Gemini REST call with system instructions + current user message.
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: message }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 250
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return res.status(502).json({ reply: FALLBACK_REPLY });
    }

    const data = await response.json();
    const reply = extractGeminiReply(data);

    if (!reply) {
      console.error('Gemini returned an empty reply:', JSON.stringify(data));
      return res.status(502).json({ reply: FALLBACK_REPLY });
    }

    return res.json({ reply });
  } catch (error) {
    console.error('Sprocket route failed:', error);
    return res.status(500).json({ reply: FALLBACK_REPLY });
  }
});

export default router;
