import admin from 'firebase-admin';

const SESSION_COLLECTION = 'sprocket_sessions';
const EVENTS_COLLECTION = 'sprocket_events';
const LEADS_COLLECTION = 'sprocket_leads';

let firestoreDb = null;
let firestoreReady = false;
let firestoreInitError = null;

function normalizePrivateKey(value) {
  if (!value) {
    return null;
  }

  return String(value).replace(/\\n/g, '\n');
}

function buildCredentialFromEnv() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      return admin.credential.cert(parsed);
    } catch (error) {
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON');
    }
  }

  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PROJECT_ID) {
    return admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)
    });
  }

  return null;
}

export function initSprocketFirestore() {
  if (firestoreDb || firestoreInitError) {
    return firestoreDb;
  }

  try {
    const credential = buildCredentialFromEnv();

    if (!credential) {
      firestoreReady = false;
      return null;
    }

    if (!admin.apps.length) {
      admin.initializeApp({ credential });
    }

    firestoreDb = admin.firestore();
    firestoreReady = true;
    return firestoreDb;
  } catch (error) {
    firestoreInitError = error;
    firestoreReady = false;
    console.error('Failed to initialize Firestore for Sprocket:', error.message);
    return null;
  }
}

export function isSprocketFirestoreEnabled() {
  return Boolean(initSprocketFirestore() && firestoreReady);
}

export async function upsertSprocketSession(sessionId, payload) {
  const db = initSprocketFirestore();
  if (!db) {
    return;
  }

  await db.collection(SESSION_COLLECTION).doc(sessionId).set(payload, { merge: true });
}

export async function logSprocketMessage(sessionId, messagePayload) {
  const db = initSprocketFirestore();
  if (!db) {
    return;
  }

  await db
    .collection(SESSION_COLLECTION)
    .doc(sessionId)
    .collection('messages')
    .add(messagePayload);
}

export async function logSprocketEvent(eventPayload) {
  const db = initSprocketFirestore();
  if (!db) {
    return;
  }

  await db.collection(EVENTS_COLLECTION).add(eventPayload);
}

export async function upsertSprocketLead(leadId, payload) {
  const db = initSprocketFirestore();
  if (!db) {
    return;
  }

  await db.collection(LEADS_COLLECTION).doc(leadId).set(payload, { merge: true });
}

export function getSprocketCollections() {
  return {
    SESSION_COLLECTION,
    EVENTS_COLLECTION,
    LEADS_COLLECTION
  };
}
