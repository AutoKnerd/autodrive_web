const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const FALLBACK_REPLY = 'Sprocket had a gear slip. Try again in a moment.';

const SYSTEM_PROMPT = `You are "Sprocket", the AutoDriveCX assistant.

You help dealership leaders understand how AutoDriveCX stabilizes execution across sales, service, BDC, and support teams.

Tone:
Helpful, operational, slightly witty.

Rules:
- Answer dealership operational questions clearly
- Avoid aggressive sales language
- If appropriate, suggest scheduling an implementation call
- Keep responses concise`;

type Req = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
  on?: (event: string, callback: (chunk: Buffer | string) => void) => void;
};

type Res = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => { json: (body: unknown) => void; end: (body?: string) => void };
};

function applyCors(res: Res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function extractGeminiReply(payload: any) {
  const parts = payload?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) {
    return '';
  }

  return parts
    .map((part) => (typeof part?.text === 'string' ? part.text : ''))
    .join('')
    .trim();
}

async function readRawBody(req: Req): Promise<string> {
  if (typeof req.body === 'string') {
    return req.body;
  }

  if (req.body && typeof req.body === 'object') {
    return JSON.stringify(req.body);
  }

  if (!req.on) {
    return '';
  }

  return await new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on?.('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    req.on?.('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });
    req.on?.('error', reject);
  });
}

export default async function handler(req: Req, res: Res) {
  applyCors(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ reply: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Missing GEMINI_API_KEY');
    res.status(500).json({ reply: FALLBACK_REPLY });
    return;
  }

  try {
    const raw = await readRawBody(req);
    let body: { message?: string } = {};

    if (raw) {
      body = JSON.parse(raw);
    }

    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!message) {
      res.status(400).json({ reply: 'Please send a message so Sprocket can help.' });
      return;
    }

    const geminiRes = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
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

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, errorText);
      res.status(502).json({ reply: FALLBACK_REPLY });
      return;
    }

    const data = await geminiRes.json();
    const reply = extractGeminiReply(data);

    if (!reply) {
      console.error('Gemini returned empty reply:', JSON.stringify(data));
      res.status(502).json({ reply: FALLBACK_REPLY });
      return;
    }

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Sprocket endpoint failed:', error);
    res.status(500).json({ reply: FALLBACK_REPLY });
  }
}
