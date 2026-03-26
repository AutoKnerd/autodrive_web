const DEALER_TERMS = [
  'dealer',
  'dealership',
  'dealer principal',
  'general manager',
  'gm',
  'fixed ops',
  'service manager',
  'sales manager',
  'managing my store',
  'my store',
  'rooftop',
  'multi-store',
  'group'
];

const INDIVIDUAL_TERMS = [
  'consultant',
  'service advisor',
  'advisor',
  'individual',
  'personally',
  'my career',
  'self improvement',
  'single user',
  'just me'
];

const IMPLEMENTATION_TERMS = [
  'implementation',
  'install',
  'rollout',
  'onboard',
  'setup',
  'start'
];

const PRICING_TERMS = ['price', 'pricing', 'cost', 'subscription', 'fee', 'monthly'];

const FEATURE_TERMS = [
  'feature',
  'how does',
  'what does',
  'sales floor',
  'service lane',
  'bdc',
  'coaching',
  'drift',
  'consistency'
];

const HESITANT_TERMS = [
  'not ready',
  'maybe later',
  'not sure',
  'just curious',
  'need to think',
  'soft question',
  'i am hesitant',
  'hesitant'
];

const EMAIL_PREF_TERMS = ['email', 'follow up', 'follow-up', 'reach out', 'send info'];

function hasAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

export function inferLeadType(history = [], message = '') {
  const combined = `${history.map((h) => h?.text || '').join(' ')} ${message}`.toLowerCase();

  if (hasAny(combined, DEALER_TERMS)) {
    return 'dealer';
  }

  if (hasAny(combined, INDIVIDUAL_TERMS)) {
    return 'individual';
  }

  return 'unknown';
}

export function classifyIntent(message = '', options = {}) {
  const text = String(message || '').toLowerCase();
  const sensitive = Boolean(options.sensitive);

  if (sensitive) {
    return 'sensitive_probe';
  }

  if (hasAny(text, EMAIL_PREF_TERMS)) {
    return 'email_preference';
  }

  if (hasAny(text, HESITANT_TERMS)) {
    return 'hesitant_user';
  }

  if (hasAny(text, IMPLEMENTATION_TERMS)) {
    return 'implementation_question';
  }

  if (hasAny(text, PRICING_TERMS)) {
    return 'pricing_question';
  }

  if (hasAny(text, FEATURE_TERMS)) {
    return 'feature_question';
  }

  if (hasAny(text, DEALER_TERMS)) {
    return 'dealer_interest';
  }

  if (hasAny(text, INDIVIDUAL_TERMS)) {
    return 'individual_interest';
  }

  return 'general_question';
}

export function extractEmail(message = '') {
  const match = String(message || '').match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0].toLowerCase() : null;
}

export function extractName(message = '') {
  const raw = String(message || '').trim();
  const direct = raw.match(/(?:my name is|i am|i'm)\s+([a-z][a-z\s'-]{1,40})/i);
  if (direct) {
    return direct[1].trim();
  }

  if (/^[a-z][a-z\s'-]{1,40}$/i.test(raw) && !raw.includes('@')) {
    return raw;
  }

  return null;
}

export function extractRoleOrDealership(message = '') {
  const raw = String(message || '').trim();
  if (!raw) {
    return null;
  }

  const withoutEmails = raw.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, ' ').trim();
  const roleMatch = withoutEmails.match(/(?:i am|i'm|role is|at)\s+([a-z0-9&\s'-]{3,80})/i);
  if (roleMatch) {
    return roleMatch[1].trim();
  }

  if (/(dealer|dealership|manager|advisor|consultant|service|sales|bdc|fixed ops)/i.test(withoutEmails) && withoutEmails.length <= 90) {
    return withoutEmails;
  }

  return null;
}

export function extractRoleAndCompany(message = '') {
  const raw = String(message || '').trim();
  if (!raw) {
    return { role: null, companyOrDealership: null };
  }

  const withoutEmails = raw.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, ' ').trim();
  const atMatch = withoutEmails.match(/(?:at)\s+([a-z0-9&\s'-]{2,80})/i);
  const companyOrDealership = atMatch ? atMatch[1].trim() : null;

  const roleMatch = withoutEmails.match(
    /\b(dealer principal|general manager|gm|sales manager|service manager|fixed ops manager|manager|service advisor|advisor|consultant|bdc manager|bdc)\b/i
  );
  const role = roleMatch ? roleMatch[1].trim() : null;

  return {
    role,
    companyOrDealership
  };
}
