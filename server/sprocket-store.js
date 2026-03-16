import fs from 'fs';
import path from 'path';

const dataDir = path.resolve(process.cwd(), 'server', 'data');
const sessionsPath = path.join(dataDir, 'sprocket-sessions.json');
const conversationsPath = path.join(dataDir, 'sprocket-conversations.jsonl');
const leadsPath = path.join(dataDir, 'sprocket-leads.jsonl');

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function safeReadJson(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }

    const raw = fs.readFileSync(filePath, 'utf8');
    if (!raw.trim()) {
      return fallback;
    }

    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
}

function appendJsonLine(filePath, value) {
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, 'utf8');
}

function truncateMessages(messages = [], max = 30) {
  return messages.slice(-max).map((item) => ({
    role: item.role,
    text: String(item.text || ''),
    ts: item.ts || new Date().toISOString()
  }));
}

export function initStore() {
  ensureDataDir();
  if (!fs.existsSync(sessionsPath)) {
    writeJson(sessionsPath, {});
  }
  if (!fs.existsSync(conversationsPath)) {
    fs.writeFileSync(conversationsPath, '', 'utf8');
  }
  if (!fs.existsSync(leadsPath)) {
    fs.writeFileSync(leadsPath, '', 'utf8');
  }
}

export function getSession(sessionId) {
  initStore();
  const allSessions = safeReadJson(sessionsPath, {});
  if (!allSessions[sessionId]) {
    allSessions[sessionId] = {
      sessionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'website',
      pageUrl: null,
      userAgent: null,
      userType: 'unknown',
      leadScore: 0,
      emailCaptured: false,
      leadCaptured: false,
      latestIntent: null,
      ctaLastShown: null,
      conversationStartedLogged: false,
      ctaShown: {
        schedule: false,
        trial: false,
        email: false
      },
      sensitiveProbeCount: 0,
      intents: [],
      messages: [],
      lead: null,
      summary: ''
    };
    writeJson(sessionsPath, allSessions);
  }

  return allSessions[sessionId];
}

export function saveSession(session) {
  initStore();
  const allSessions = safeReadJson(sessionsPath, {});
  const next = {
    ...session,
    updatedAt: new Date().toISOString(),
    messages: truncateMessages(session.messages || []),
    intents: (session.intents || []).slice(-20)
  };

  allSessions[next.sessionId] = next;
  writeJson(sessionsPath, allSessions);
}

export function logConversationEvent(event) {
  initStore();
  appendJsonLine(conversationsPath, {
    ts: new Date().toISOString(),
    ...event
  });
}

export function storeLead(leadRecord) {
  initStore();
  appendJsonLine(leadsPath, {
    ts: new Date().toISOString(),
    ...leadRecord
  });
}

export function buildConversationSummary(session) {
  const latestIntents = (session.intents || []).slice(-6);
  const leadType = session.userType || 'unknown';
  const sensitive = session.sensitiveProbeCount > 0 ? 'yes' : 'no';
  const leadCaptured = session.leadCaptured ? 'yes' : 'no';
  const ctas = [];
  if (session.ctaShown?.schedule) ctas.push('schedule');
  if (session.ctaShown?.trial) ctas.push('trial');
  if (session.ctaShown?.email) ctas.push('email');

  return `${leadType} lead; intents: ${latestIntents.join(', ') || 'none'}; sensitive_probe: ${sensitive}; lead_captured: ${leadCaptured}; cta_shown: ${ctas.join('/') || 'none'}`;
}

export function getStorePaths() {
  return {
    dataDir,
    sessionsPath,
    conversationsPath,
    leadsPath
  };
}
