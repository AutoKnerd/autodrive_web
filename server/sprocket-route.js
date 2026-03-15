import { Router } from 'express';
import { SPROCKET_KNOWLEDGE } from './sprocket-knowledge.js';
import { detectSensitiveQuery } from './sprocket-security.js';

const router = Router();

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const FALLBACK_REPLY = 'Sprocket had a gear slip. Try again in a moment.';
const SCHEDULING_LINK = 'https://calendar.app.google/2gZsELsJfGXFUYDq5';

const FIRST_GUARDED_REPLY =
  'Great question. That portion of AutoDriveCX is part of the internal operating framework we deploy with dealerships. I can walk through what the system accomplishes operationally, but the internal mechanics are covered during implementation discussions.';

// Simple in-memory session store
const sessions = {};

const DISCOVERY_QUESTIONS = [
  {
    id: 1,
    text: "Quick question — are you mainly trying to stabilize the sales floor, the service lane, or both?",
    focus: 'userFocus'
  },
  {
    id: 2,
    text: "Is your biggest challenge process consistency or manager coaching visibility?"
  },
  {
    id: 3,
    text: "Are you evaluating solutions for one store or multiple rooftops?",
    focus: 'storeType'
  }
];

function getClientKey(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = Array.isArray(forwarded)
    ? forwarded[0]
    : (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.ip || 'unknown-ip');
  const userAgent = req.headers['user-agent'] || 'unknown-agent';
  return `${ip}::${userAgent}`;
}

function getSession(clientKey) {
  if (!sessions[clientKey]) {
    sessions[clientKey] = {
      conversationHistory: [],
      questionsAsked: [],
      userFocus: 'unknown',
      storeType: 'unknown'
    };
  }
  return sessions[clientKey];
}

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
 * Upgraded BDC assistant with session memory and discovery triggers.
 */
router.post('/sprocket-chat', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const userMessage = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

  if (!userMessage) {
    return res.status(400).json({ reply: 'Please send a message so Sprocket can help.' });
  }

  const clientKey = getClientKey(req);
  const session = getSession(clientKey);

  // STEP 6 — RESPECT IP PROTECTION
  if (detectSensitiveQuery(userMessage)) {
    return res.json({ reply: FIRST_GUARDED_REPLY });
  }

  if (!apiKey) {
    console.error('Missing GEMINI_API_KEY in environment');
    return res.status(500).json({ reply: FALLBACK_REPLY });
  }

  const lowerMsg = userMessage.toLowerCase();
  let explicitResponse = '';
  let pendingDiscoveryQuestion = null;

  // STEP 3 — CONTEXT TRIGGERS
  
  // Implementation Questions
  if (
    lowerMsg.includes('how long does implementation take') ||
    lowerMsg.includes('how hard is install') ||
    lowerMsg.includes('how fast can this be deployed')
  ) {
    explicitResponse = "Many dealerships can begin implementation the same day since the system installs inside normal operations.";
    // Then ask discovery question 3
    if (!session.questionsAsked.includes(3)) {
      pendingDiscoveryQuestion = DISCOVERY_QUESTIONS.find(q => q.id === 3);
    }
  }

  // Results Questions
  const isResultsQuery = [
    "how does this help",
    "what does this improve",
    "will this help csi",
    "why would we need this"
  ].some(q => lowerMsg.includes(q.toLowerCase()));

  // Buying Intent Questions
  const isBuyingIntentQuery = [
    "can we see this",
    "how do we start",
    "how do we try this",
    "can we implement this"
  ].some(q => lowerMsg.includes(q.toLowerCase()));

  // Construct Prompt with Memory
  const historyText = session.conversationHistory
    .map(m => `${m.role === 'user' ? 'User' : 'Sprocket'}: ${m.text}`)
    .join('\n');

  const prompt = `
You are Sprocket, the AutoDriveCX assistant. 
You sound like someone who understands dealership operations.
Helpful, operational, and slightly conversational. Not overly salesy.

Example tone: "Dealerships usually don't struggle because teams lack knowledge. Execution simply drifts under pressure. AutoDriveCX prevents that drift."

Use the knowledge below to answer questions.

${SPROCKET_KNOWLEDGE}

Conversation history:
${historyText}

User question:
${userMessage}

Response rules:
• Be clear and operationally helpful
• Avoid aggressive sales language
• Keep responses concise
• Do not reveal proprietary internal mechanics
`;

  try {
    let finalReply = '';

    if (explicitResponse) {
      finalReply = explicitResponse;
    } else {
      const response = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 250 }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      finalReply = extractGeminiReply(data) || FALLBACK_REPLY;
    }

    // Append context-based additions
    if (isBuyingIntentQuery) {
      finalReply += `\n\nThe easiest way to see how AutoDriveCX works is walking through how the system would install inside a dealership like yours.\n\nImplementation call link: ${SCHEDULING_LINK}`;
    } else if (isResultsQuery && !session.questionsAsked.includes(1)) {
      pendingDiscoveryQuestion = DISCOVERY_QUESTIONS.find(q => q.id === 1);
    } else if (explicitResponse && pendingDiscoveryQuestion) {
      // already set
    } else if (!explicitResponse && !isBuyingIntentQuery && !isResultsQuery) {
      // Natural discovery if no specific trigger happened and we haven't asked everything
      const nextQ = DISCOVERY_QUESTIONS.find(q => !session.questionsAsked.includes(q.id));
      if (nextQ && Math.random() > 0.5) { // Occasional discovery
        pendingDiscoveryQuestion = nextQ;
      }
    }

    if (pendingDiscoveryQuestion) {
      finalReply += `\n\n${pendingDiscoveryQuestion.text}`;
      session.questionsAsked.push(pendingDiscoveryQuestion.id);
    }

    // Update session memory
    session.conversationHistory.push({ role: 'user', text: userMessage });
    session.conversationHistory.push({ role: 'model', text: finalReply });

    // Limit history to 6 messages
    if (session.conversationHistory.length > 6) {
      session.conversationHistory = session.conversationHistory.slice(-6);
    }

    // Attempt to extract focus/storeType from user message if they just answered a question
    if (lowerMsg.includes('sales') && lowerMsg.includes('service')) session.userFocus = 'both';
    else if (lowerMsg.includes('sales')) session.userFocus = 'sales';
    else if (lowerMsg.includes('service')) session.userFocus = 'service';

    if (lowerMsg.includes('single') || lowerMsg.includes('one store')) session.storeType = 'single store';
    else if (lowerMsg.includes('multi') || lowerMsg.includes('rooftop')) session.storeType = 'multi rooftop';

    return res.json({ reply: finalReply });

  } catch (error) {
    console.error('Sprocket route failed:', error);
    return res.status(500).json({ reply: FALLBACK_REPLY });
  }
});

export default router;
