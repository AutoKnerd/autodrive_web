import { Router } from 'express';
import { SPROCKET_KNOWLEDGE } from './sprocket-knowledge.js';
import { detectSensitiveQuery } from './sprocket-security.js';
import {
  classifyIntent,
  inferLeadType,
  extractEmail,
  extractName,
  extractRoleOrDealership,
  extractRoleAndCompany
} from './sprocket-intent.js';
import {
  getSession,
  saveSession,
  logConversationEvent,
  storeLead,
  buildConversationSummary,
  initStore
} from './sprocket-store.js';
import {
  isSprocketFirestoreEnabled,
  upsertSprocketSession,
  logSprocketMessage,
  logSprocketEvent,
  upsertSprocketLead
} from './sprocket-firestore.js';

const router = Router();

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const FALLBACK_REPLY = 'Sprocket had a gear slip. Try again in a moment.';
const SCHEDULE_LINK = 'https://calendar.app.google/2gZsELsJfGXFUYDq5';
const TRIAL_LINK = 'https://app.autodrivecx.com/signup';

const FIRST_GUARDED_REPLY =
  'Great question. That portion of AutoDriveCX is part of the internal operating framework we deploy with dealerships. I can walk through what the system accomplishes operationally, but the internal mechanics are covered during implementation discussions.';

const REPEAT_GUARDED_REPLY =
  'I can definitely walk through how the system improves execution across sales and service. The detailed mechanics of the reinforcement framework are something we typically cover during implementation calls.';

const EMAIL_CAPTURE_FALLBACK =
  'I can keep this high level here, or if you\'d rather, I can have the team follow up by email. If email is easiest, drop your best address and we\'ll take it from there.';

const ALLOWED_EVENTS = new Set([
  'conversation_started',
  'conversation_ended',
  'user_message',
  'bot_reply',
  'dealer_interest',
  'individual_interest',
  'sensitive_probe',
  'schedule_call_cta_shown',
  'start_trial_cta_shown',
  'email_followup_cta_shown',
  'schedule_call_clicked',
  'start_trial_clicked',
  'email_submitted'
]);

initStore();

function nowIso() {
  return new Date().toISOString();
}

function normalizeSessionId(rawSessionId) {
  if (typeof rawSessionId !== 'string') {
    return null;
  }

  const cleaned = rawSessionId.trim();
  if (!cleaned) {
    return null;
  }

  return cleaned.slice(0, 120);
}

function makeSessionId(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = Array.isArray(forwarded)
    ? forwarded[0]
    : (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.ip || 'unknown-ip');
  const userAgent = req.headers['user-agent'] || 'unknown-agent';
  return `fallback-${Buffer.from(`${ip}|${userAgent}`).toString('base64').slice(0, 24)}`;
}

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

function polishReply(reply) {
  let text = String(reply || '').trim();
  if (!text) {
    return '';
  }

  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  if (lines.length > 1) {
    const lastLine = lines[lines.length - 1];
    if (lastLine.length < 24 && !/[.!?]$/.test(lastLine)) {
      lines.pop();
      text = lines.join('\n\n');
    }
  }

  const incompleteEnding = /\b(to|and|for|with|the|a|an|of|in|on|into|from|across)\s*$/i.test(text);
  if (incompleteEnding) {
    return `${text} improve execution consistency.`;
  }

  if (!/[.!?]"?$/.test(text)) {
    return `${text}.`;
  }

  return text;
}

function isLowQualityReply(reply) {
  const text = String(reply || '').trim();
  if (!text) {
    return true;
  }

  if (text.length < 40) {
    return true;
  }

  const brokenEnding = /\b(to|and|for|with|the|a|an|of|in|on|into|from|across)\.?$/i.test(text);
  if (brokenEnding) {
    return true;
  }

  if (/\b(your|their|our|its|this|that)\.$/i.test(text)) {
    return true;
  }

  if (!/[.!?]"?$/.test(text)) {
    return true;
  }

  return false;
}

function isHighIntentMessage(message) {
  const text = String(message || '').toLowerCase();
  const terms = [
    'how do we start',
    'how do i start',
    'next step',
    'book',
    'schedule',
    'walkthrough',
    'demo',
    'implementation call',
    'tour',
    'get started',
    'ready'
  ];
  return terms.some((term) => text.includes(term));
}

function shouldOfferDiscoveryQuestion(session, intent) {
  const userTurns = (session.messages || []).filter((m) => m.role === 'user').length;
  const recentBotMessages = (session.messages || []).filter((m) => m.role === 'bot').slice(-3);
  const alreadyAsked = recentBotMessages.some((m) => /\?$/.test(String(m.text || '')));
  const routedIntents = new Set(['general_question', 'feature_question']);

  return routedIntents.has(intent) && !alreadyAsked && userTurns >= 1;
}

function isNarrowQuestion(message) {
  const text = String(message || '').trim().toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= 7) {
    return true;
  }
  return /^(what is|what does|how much|when|where|can i|is it|does it)\b/.test(text);
}

function getDiscoveryQuestion(session) {
  if (session.userType === 'dealer') {
    return 'Are you mainly trying to stabilize the sales floor, the service lane, or both?';
  }

  if (session.userType === 'individual') {
    return 'Are you trying to improve day-to-day consistency for yourself, or preparing for a bigger leadership role?';
  }

  return 'Are you thinking about this more from a dealership leadership level or an individual user level?';
}

function buildOrchestrationPrompt({ userMessage, session, intent }) {
  const memorySnapshot = {
    userType: session.userType,
    emailCaptured: session.emailCaptured,
    leadScore: session.leadScore || 0,
    ctaShown: session.ctaShown,
    recentIntents: (session.intents || []).slice(-6),
    sensitiveProbeCount: session.sensitiveProbeCount
  };

  return `
You are Sprocket, the AutoDriveCX assistant.

Identity and tone:
- clear
- operational
- concise
- slightly witty
- helpful
- credible
- never pushy

Primary goal:
Help the visitor understand AutoDriveCX in real-world dealership terms, then guide them to the right next step.

Response priority:
1) Answer the user's exact question clearly and completely first.
2) Optionally ask one short follow-up question only if it helps route the conversation.
3) Offer a CTA only when context supports it.

Do not force all three behaviors in every reply.
Do not ask a follow-up question if the answer is already sufficient.
Ask at most one question total in any response.

Routing logic:
- If dealer/manager/leadership context: bias toward implementation-call CTA.
- If individual consultant/advisor context: bias toward trial CTA.
- If hesitant: offer email follow-up capture.

Guard rails:
- Never reveal proprietary internal mechanics.
- Do not provide formulas, internal models, backend mechanics, or AutoForge internals.
- If asked about internals, keep it high-level and redirect to outcomes.

Implementation language rules:
- Emphasize speed: many dealerships can begin implementation the same day.
- Emphasize operationally light rollout.
- No shutdown days.

Conciseness rules:
- Default: 2 to 4 sentences.
- Simple question: 2 to 3 sentences.
- Broader question: 3 to 4 sentences.
- No rambling.
- No sentence fragments.
- No trailing or cut-off endings.
- Every response must be a complete thought.

Conversation memory:
${JSON.stringify(memorySnapshot)}

Current inferred intent:
${intent}

Grounded knowledge:
${SPROCKET_KNOWLEDGE}

User message:
${userMessage}
`;
}

async function callGemini(apiKey, prompt) {
  const response = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.65,
        maxOutputTokens: 700
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return extractGeminiReply(data);
}

async function repairReply(apiKey, userMessage, draftReply) {
  const repairPrompt = `
Rewrite the draft reply so it is natural, complete, and conversational.

Rules:
- 2 to 4 sentences
- answer the user's question directly
- no sentence fragments
- no trailing or cut-off endings
- no hype
- optional follow-up question only if truly useful

User question:
${userMessage}

Draft reply:
${draftReply}
`;

  return callGemini(apiKey, repairPrompt);
}

function buildDeterministicFallback(intent, userType) {
  if (intent === 'implementation_question' || userType === 'dealer') {
    return 'AutoDriveCX implementation is designed to be fast and operationally light. Many dealerships can begin the same day because it installs inside normal store operations with no shutdown day. The goal is to improve execution consistency while your team keeps working.';
  }

  if (userType === 'individual') {
    return 'For an individual advisor or consultant, AutoDriveCX helps build stronger daily execution habits that translate to more consistent performance. It is practical in day-to-day dealership work and keeps your process tight under pressure. If you want hands-on access quickly, starting a trial is usually the cleanest next step.';
  }

  if (intent === 'hesitant_user' || intent === 'email_preference') {
    return 'Totally fair. You do not need to commit to a call right away. If email is easier, share your best address and the team can follow up with the right details for your situation.';
  }

  return 'AutoDriveCX helps dealerships solve execution drift by reinforcing consistent behaviors across sales, service, and BDC. Managers get earlier visibility into where coaching is needed, so corrections happen before performance slips. The result is more stable execution without disrupting normal operations.';
}

function buildIntentTemplateReply(intent, userType, userMessage) {
  const highIntent = isHighIntentMessage(userMessage);

  if (intent === 'implementation_question') {
    if (userType === 'individual') {
      return 'Great question. For an individual advisor or consultant, the fastest next step is getting hands-on in the system so you can build stronger daily execution habits immediately. AutoDriveCX is designed to improve consistency under real dealership pressure, not just in training. If you are ready to move, starting a trial is the cleanest path.';
    }

    return 'Great question. Many dealerships can begin implementation the same day because AutoDriveCX installs inside normal operations without a shutdown day. The rollout is operationally light, so your team keeps working while execution consistency improves. The fastest way to pressure-test fit is a short implementation walkthrough.';
  }

  if (highIntent && userType === 'dealer') {
    return 'It sounds like you are evaluating this at the store level. AutoDriveCX is built to stabilize execution across sales, service, and BDC without disrupting daily operations. A short walkthrough is usually the fastest way to map it to your specific store conditions.';
  }

  if (highIntent && userType === 'individual') {
    return 'If your goal is personal consistency and stronger day-to-day performance, getting into the platform directly is the smartest move. AutoDriveCX helps reinforce execution habits in live dealership work, not just in theory. Starting a trial gives you the fastest way to see that impact for yourself.';
  }

  return '';
}

function buildCtasForIntent(intent, userType, session, userMessage) {
  const ctas = [];
  const highIntent = isHighIntentMessage(userMessage);
  const mentionsStore = /(store|dealership|rooftop|dealer principal|gm|general manager)/i.test(String(userMessage || ''));

  if (highIntent && userType === 'individual' && !mentionsStore) {
    ctas.push({ type: 'trial', label: 'Start Trial', url: TRIAL_LINK });
    session.ctaShown.trial = true;
    session.ctaLastShown = 'start_trial';
  } else if (
    intent === 'implementation_question' ||
    (highIntent && (userType === 'dealer' || intent === 'dealer_interest' || mentionsStore))
  ) {
    ctas.push({ type: 'schedule', label: 'Schedule Implementation Call', url: SCHEDULE_LINK });
    session.ctaShown.schedule = true;
    session.ctaLastShown = 'schedule_call';
  } else if (highIntent && (userType === 'individual' || intent === 'individual_interest')) {
    ctas.push({ type: 'trial', label: 'Start Trial', url: TRIAL_LINK });
    session.ctaShown.trial = true;
    session.ctaLastShown = 'start_trial';
  }

  if (intent === 'hesitant_user' || intent === 'email_preference') {
    ctas.push({ type: 'email', label: 'Share Email for Follow-Up', action: 'capture_email' });
    session.ctaShown.email = true;
    session.ctaLastShown = 'email_followup';
  }

  return ctas;
}

function scoreDeltaForIntent(intent, userMessage) {
  const text = String(userMessage || '').toLowerCase();
  if (intent === 'sensitive_probe') {
    return 0;
  }

  let delta = 0;
  if (intent === 'implementation_question') delta += 10;
  if (intent === 'dealer_interest') delta += 10;
  if (intent === 'individual_interest') delta += 8;
  if (intent === 'email_preference') delta += 5;
  if (text.includes('trial')) delta += 8;
  if (text.includes('store') || text.includes('dealership')) delta += 10;

  return delta;
}

function scoreDeltaForEvent(eventType) {
  if (eventType === 'schedule_call_clicked') return 25;
  if (eventType === 'start_trial_clicked') return 25;
  if (eventType === 'email_submitted') return 20;
  return 0;
}

function getRecommendedFollowup(session, intent) {
  if (session.userType === 'dealer' || intent === 'implementation_question' || intent === 'dealer_interest') {
    return 'schedule_call';
  }
  if (session.userType === 'individual' || intent === 'individual_interest') {
    return 'start_trial';
  }
  return 'manual_email_followup';
}

async function persistSessionToFirestore(session) {
  await upsertSprocketSession(session.sessionId, {
    session_id: session.sessionId,
    created_at: session.createdAt,
    updated_at: session.updatedAt || nowIso(),
    source: 'website',
    page_url: session.pageUrl || null,
    user_agent: session.userAgent || null,
    lead_type: session.userType || 'unknown',
    lead_score: session.leadScore || 0,
    email_captured: Boolean(session.emailCaptured),
    email_address: session.lead?.email || null,
    name: session.lead?.name || null,
    company_or_dealership: session.lead?.companyOrDealership || null,
    role: session.lead?.role || null,
    latest_intent: session.latestIntent || null,
    transcript_summary: session.summary || '',
    cta_last_shown: session.ctaLastShown || null
  });
}

async function logMessageEverywhere(sessionId, payload) {
  logConversationEvent({ sessionId, event: `${payload.role}_message`, ...payload });

  await logSprocketMessage(sessionId, {
    role: payload.role,
    message: payload.message,
    timestamp: payload.timestamp,
    intent_at_time: payload.intentAtTime || null,
    contains_email: Boolean(payload.containsEmail),
    sensitive_probe: Boolean(payload.sensitiveProbe)
  });
}

async function logEventEverywhere(sessionId, eventType, metadata = {}) {
  logConversationEvent({ sessionId, event: eventType, ...metadata });
  await logSprocketEvent({
    session_id: sessionId,
    timestamp: nowIso(),
    event_type: eventType,
    metadata
  });
}

router.post('/sprocket-event', async (req, res) => {
  const rawSessionId = normalizeSessionId(req.body?.sessionId) || makeSessionId(req);
  const eventType = String(req.body?.eventType || '').trim();
  const metadata = req.body?.metadata && typeof req.body.metadata === 'object' ? req.body.metadata : {};

  if (!ALLOWED_EVENTS.has(eventType)) {
    return res.status(400).json({ ok: false, error: 'Invalid event_type' });
  }

  const session = getSession(rawSessionId);
  session.pageUrl = req.body?.pageUrl || session.pageUrl || null;
  session.userAgent = req.headers['user-agent'] || session.userAgent || null;

  const scoreDelta = scoreDeltaForEvent(eventType);
  if (scoreDelta > 0) {
    session.leadScore = (session.leadScore || 0) + scoreDelta;
  }

  if (eventType === 'schedule_call_clicked') session.ctaLastShown = 'schedule_call';
  if (eventType === 'start_trial_clicked') session.ctaLastShown = 'start_trial';
  if (eventType === 'email_followup_cta_shown') session.ctaLastShown = 'email_followup';

  if (eventType === 'conversation_started' && !session.conversationStartedLogged) {
    session.conversationStartedLogged = true;
  }

  session.summary = buildConversationSummary(session);
  saveSession(session);

  try {
    await persistSessionToFirestore(session);
    await logEventEverywhere(rawSessionId, eventType, {
      ...metadata,
      lead_score: session.leadScore || 0,
      firestore_enabled: isSprocketFirestoreEnabled()
    });

    if (eventType === 'schedule_call_clicked' || eventType === 'start_trial_clicked') {
      await upsertSprocketLead(rawSessionId, {
        session_id: rawSessionId,
        created_at: session.createdAt,
        updated_at: nowIso(),
        name: session.lead?.name || null,
        email: session.lead?.email || null,
        company_or_dealership: session.lead?.companyOrDealership || null,
        role: session.lead?.role || null,
        inferred_lead_type: session.userType || 'unknown',
        inferred_interest: session.latestIntent || 'general_question',
        lead_score: session.leadScore || 0,
        source: 'sprocket_web',
        transcript_summary: session.summary || '',
        last_user_message: (session.messages || []).filter((m) => m.role === 'user').slice(-1)[0]?.text || '',
        recommended_followup: eventType === 'start_trial_clicked' ? 'start_trial' : 'schedule_call'
      });
    }
  } catch (error) {
    console.error('Sprocket event logging failed:', error.message);
  }

  return res.json({ ok: true, sessionId: rawSessionId });
});

router.post('/sprocket-chat', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const userMessage = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  const incomingHistory = Array.isArray(req.body?.history) ? req.body.history : [];
  const normalizedSessionId = normalizeSessionId(req.body?.sessionId) || makeSessionId(req);
  const pageUrl = typeof req.body?.pageUrl === 'string' ? req.body.pageUrl : null;

  if (!userMessage) {
    return res.status(400).json({ reply: 'Please send a message so Sprocket can help.' });
  }

  const session = getSession(normalizedSessionId);
  session.pageUrl = pageUrl || session.pageUrl || null;
  session.userAgent = req.headers['user-agent'] || session.userAgent || null;

  if (!session.conversationStartedLogged) {
    session.conversationStartedLogged = true;
    try {
      await logEventEverywhere(normalizedSessionId, 'conversation_started', {
        source: 'website',
        page_url: session.pageUrl || null
      });
    } catch (error) {
      console.error('Failed to log conversation_started:', error.message);
    }
  }

  const mergedHistory = [
    ...(session.messages || []),
    ...incomingHistory.filter((entry) => entry && (entry.role === 'user' || entry.role === 'bot') && typeof entry.text === 'string')
  ].slice(-20);

  session.messages = mergedHistory;

  const sensitive = detectSensitiveQuery(userMessage);
  const intent = classifyIntent(userMessage, { sensitive });
  session.latestIntent = intent;
  session.intents.push(intent);
  session.userType = inferLeadType(session.messages, userMessage);
  session.leadScore = (session.leadScore || 0) + scoreDeltaForIntent(intent, userMessage);

  const userMessageEvent = {
    role: 'user',
    text: userMessage,
    ts: nowIso(),
    intent
  };
  session.messages.push(userMessageEvent);

  const containsEmail = Boolean(extractEmail(userMessage));

  try {
    await logMessageEverywhere(normalizedSessionId, {
      role: 'user',
      message: userMessage,
      timestamp: userMessageEvent.ts,
      intentAtTime: intent,
      containsEmail,
      sensitiveProbe: sensitive
    });
    await logEventEverywhere(normalizedSessionId, 'user_message', {
      intent,
      lead_type: session.userType,
      sensitive_probe: sensitive
    });
  } catch (error) {
    console.error('Failed to log user message:', error.message);
  }

  if (intent === 'dealer_interest') {
    await logEventEverywhere(normalizedSessionId, 'dealer_interest', { message: userMessage }).catch(() => {});
  }

  if (intent === 'individual_interest') {
    await logEventEverywhere(normalizedSessionId, 'individual_interest', { message: userMessage }).catch(() => {});
  }

  if (sensitive) {
    session.sensitiveProbeCount += 1;
    await logEventEverywhere(normalizedSessionId, 'sensitive_probe', {
      count: session.sensitiveProbeCount
    }).catch(() => {});

    const guardedReply = session.sensitiveProbeCount > 1
      ? `${REPEAT_GUARDED_REPLY}\n\nImplementation call link:\n${SCHEDULE_LINK}`
      : FIRST_GUARDED_REPLY;

    const ctas = [{ type: 'schedule', label: 'Schedule Implementation Call', url: SCHEDULE_LINK }];
    session.ctaShown.schedule = true;
    session.ctaLastShown = 'schedule_call';

    session.messages.push({ role: 'bot', text: guardedReply, ts: nowIso() });
    session.summary = buildConversationSummary(session);
    saveSession(session);

    await persistSessionToFirestore(session).catch(() => {});
    await logMessageEverywhere(normalizedSessionId, {
      role: 'bot',
      message: guardedReply,
      timestamp: nowIso(),
      intentAtTime: intent,
      containsEmail: false,
      sensitiveProbe: true
    }).catch(() => {});

    await logEventEverywhere(normalizedSessionId, 'schedule_call_cta_shown', {
      source: 'guardrail'
    }).catch(() => {});

    return res.json({ reply: guardedReply, sessionId: normalizedSessionId, ctas });
  }

  const foundEmail = extractEmail(userMessage);
  const foundName = extractName(userMessage);
  const foundRoleOrDealership = extractRoleOrDealership(userMessage);
  const parsedRoleCompany = extractRoleAndCompany(userMessage);

  // If we already have an email and are waiting on a name, capture it and finalize lead state.
  if (!foundEmail && session.awaitingName && foundName) {
    session.awaitingName = false;
    session.leadCaptured = true;
    session.lead = {
      ...(session.lead || {}),
      name: foundName
    };

    const reply = `Perfect, thanks ${foundName}. I have what I need for follow-up. If you'd like the fastest path, you can also book an implementation call now.`;
    const ctas = [{ type: 'schedule', label: 'Schedule Implementation Call', url: SCHEDULE_LINK }];
    session.ctaShown.schedule = true;
    session.ctaLastShown = 'schedule_call';

    session.messages.push({ role: 'bot', text: reply, ts: nowIso() });
    session.summary = buildConversationSummary(session);
    saveSession(session);

    try {
      await persistSessionToFirestore(session);
      await upsertSprocketLead(normalizedSessionId, {
        session_id: normalizedSessionId,
        created_at: session.createdAt,
        updated_at: nowIso(),
        name: session.lead?.name || null,
        email: session.lead?.email || null,
        company_or_dealership: session.lead?.companyOrDealership || null,
        role: session.lead?.role || null,
        inferred_lead_type: session.userType || 'unknown',
        inferred_interest: intent,
        lead_score: session.leadScore || 0,
        source: 'sprocket_web',
        transcript_summary: session.summary || '',
        last_user_message: userMessage,
        recommended_followup: getRecommendedFollowup(session, intent)
      });
    } catch (error) {
      console.error('Failed to finalize lead after name capture:', error.message);
    }

    return res.json({ reply, sessionId: normalizedSessionId, ctas });
  }

  if (foundEmail) {
    session.emailCaptured = true;
    session.leadScore = (session.leadScore || 0) + 20;
    session.awaitingName = !foundName && !session.lead?.name;
    session.leadCaptured = !session.awaitingName;
    session.lead = {
      ...(session.lead || {}),
      email: foundEmail,
      name: foundName || session.lead?.name || null,
      role: parsedRoleCompany.role || session.lead?.role || null,
      companyOrDealership: parsedRoleCompany.companyOrDealership || session.lead?.companyOrDealership || foundRoleOrDealership || null,
      roleOrDealership: foundRoleOrDealership || session.lead?.roleOrDealership || null,
      leadType: session.userType,
      capturedAt: nowIso()
    };

    const summary = buildConversationSummary(session);
    session.summary = summary;

    storeLead({
      timestamp: nowIso(),
      sessionId: normalizedSessionId,
      name: session.lead.name,
      email: session.lead.email,
      dealershipOrRole: session.lead.roleOrDealership,
      inferredLeadType: session.userType,
      conversationTranscript: session.messages,
      summary,
      ctaShown: session.ctaShown,
      acceptedNextStep: null
    });

    const reply = session.awaitingName
      ? 'Thanks, I got your email. What name should I put on this follow-up?'
      : 'Perfect, thanks. I\'ve got your details and the team can follow up. If you want the fastest path, you can also book directly here.';
    const ctas = session.awaitingName
      ? [{ type: 'email', label: 'Share Name', action: 'capture_email' }]
      : [{ type: 'schedule', label: 'Schedule Implementation Call', url: SCHEDULE_LINK }];
    if (!session.awaitingName) {
      session.ctaShown.schedule = true;
      session.ctaLastShown = 'schedule_call';
    } else {
      session.ctaShown.email = true;
      session.ctaLastShown = 'email_followup';
    }

    session.messages.push({ role: 'bot', text: reply, ts: nowIso() });
    session.summary = buildConversationSummary(session);
    saveSession(session);

    try {
      await persistSessionToFirestore(session);
      await logEventEverywhere(normalizedSessionId, 'email_submitted', {
        email: foundEmail,
        lead_type: session.userType
      });

      await upsertSprocketLead(normalizedSessionId, {
        session_id: normalizedSessionId,
        created_at: session.createdAt,
        updated_at: nowIso(),
        name: session.lead.name || null,
        email: session.lead.email || null,
        company_or_dealership: session.lead.companyOrDealership || null,
        role: session.lead.role || null,
        inferred_lead_type: session.userType || 'unknown',
        inferred_interest: intent,
        lead_score: session.leadScore || 0,
        source: 'sprocket_web',
        transcript_summary: session.summary || '',
        last_user_message: userMessage,
        recommended_followup: getRecommendedFollowup(session, intent)
      });

      await logMessageEverywhere(normalizedSessionId, {
        role: 'bot',
        message: reply,
        timestamp: nowIso(),
        intentAtTime: intent,
        containsEmail: false,
        sensitiveProbe: false
      });

      if (!session.awaitingName) {
        await logEventEverywhere(normalizedSessionId, 'schedule_call_cta_shown', {
          source: 'email_capture_flow'
        });
      } else {
        await logEventEverywhere(normalizedSessionId, 'email_followup_cta_shown', {
          source: 'name_capture_flow'
        });
      }
    } catch (error) {
      console.error('Failed to persist lead capture to Firestore:', error.message);
    }

    return res.json({ reply, sessionId: normalizedSessionId, ctas });
  }

  if (!apiKey) {
    saveSession(session);
    await persistSessionToFirestore(session).catch(() => {});
    return res.status(500).json({ reply: FALLBACK_REPLY, sessionId: normalizedSessionId });
  }

  try {
    const ctas = buildCtasForIntent(intent, session.userType, session, userMessage);
    let reply = buildIntentTemplateReply(intent, session.userType, userMessage);

    if (!reply) {
      const prompt = buildOrchestrationPrompt({ userMessage, session, intent });
      reply = await callGemini(apiKey, prompt);

      reply = polishReply(reply);

      if (isLowQualityReply(reply)) {
        reply = polishReply(await repairReply(apiKey, userMessage, reply));
      }

      if (isLowQualityReply(reply)) {
        reply = buildDeterministicFallback(intent, session.userType);
      }
    }

    if (!isNarrowQuestion(userMessage) && ctas.length === 0 && shouldOfferDiscoveryQuestion(session, intent) && !reply.includes('?')) {
      reply = `${reply}\n\n${getDiscoveryQuestion(session)}`;
    }

    if ((intent === 'hesitant_user' || intent === 'email_preference') && !session.emailCaptured && ctas.length > 0) {
      reply = `${reply}\n\nIf you'd rather not book anything yet, I can have the team follow up by email. Drop your name and best email, and if you want, your role or dealership.`;
    }

    if (!reply || reply.length < 5) {
      reply = EMAIL_CAPTURE_FALLBACK;
    }

    session.messages.push({ role: 'bot', text: reply, ts: nowIso() });
    session.summary = buildConversationSummary(session);
    saveSession(session);

    try {
      await persistSessionToFirestore(session);

      await logMessageEverywhere(normalizedSessionId, {
        role: 'bot',
        message: reply,
        timestamp: nowIso(),
        intentAtTime: intent,
        containsEmail: false,
        sensitiveProbe: false
      });

      await logEventEverywhere(normalizedSessionId, 'bot_reply', {
        intent,
        user_type: session.userType,
        lead_captured: session.leadCaptured,
        cta_last_shown: session.ctaLastShown || null
      });

      for (const cta of ctas) {
        if (cta.type === 'schedule') {
          await logEventEverywhere(normalizedSessionId, 'schedule_call_cta_shown', { intent });
        }
        if (cta.type === 'trial') {
          await logEventEverywhere(normalizedSessionId, 'start_trial_cta_shown', { intent });
        }
        if (cta.type === 'email') {
          await logEventEverywhere(normalizedSessionId, 'email_followup_cta_shown', { intent });
        }
      }

      const highIntentLead = isHighIntentMessage(userMessage) || intent === 'implementation_question';
      if (highIntentLead || session.emailCaptured) {
        await upsertSprocketLead(normalizedSessionId, {
          session_id: normalizedSessionId,
          created_at: session.createdAt,
          updated_at: nowIso(),
          name: session.lead?.name || null,
          email: session.lead?.email || null,
          company_or_dealership: session.lead?.companyOrDealership || null,
          role: session.lead?.role || null,
          inferred_lead_type: session.userType || 'unknown',
          inferred_interest: intent,
          lead_score: session.leadScore || 0,
          source: 'sprocket_web',
          transcript_summary: session.summary || '',
          last_user_message: userMessage,
          recommended_followup: getRecommendedFollowup(session, intent)
        });
      }
    } catch (error) {
      console.error('Failed Firestore persistence for chat turn:', error.message);
    }

    return res.json({
      reply,
      sessionId: normalizedSessionId,
      intent,
      userType: session.userType,
      ctas
    });
  } catch (error) {
    console.error('Sprocket route failed:', error);
    saveSession(session);
    await persistSessionToFirestore(session).catch(() => {});
    return res.status(500).json({ reply: FALLBACK_REPLY, sessionId: normalizedSessionId });
  }
});

export default router;
