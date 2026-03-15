const SENSITIVE_PATTERNS = [
  'algorithm',
  'formula',
  'calculation',
  'model',
  'scoring',
  'score',
  'data model',
  'architecture',
  'internal framework',
  'reinforcement framework',
  'drift detection logic',
  'behavior tracking model',
  'dataset',
  'training data',
  'ai model details',
  'analytics engine',
  'rep structure',
  'autoforge tools',
  'backend logic',
  'system architecture',
  'how exactly does it work',
  'technical architecture',
  'internal process'
];

/**
 * Detects whether a user message appears to probe internal mechanics.
 * Returns true for potentially sensitive/reverse-engineering questions.
 */
export function detectSensitiveQuery(userMessage) {
  if (typeof userMessage !== 'string') {
    return false;
  }

  const normalized = userMessage.toLowerCase();
  return SENSITIVE_PATTERNS.some((pattern) => normalized.includes(pattern));
}
