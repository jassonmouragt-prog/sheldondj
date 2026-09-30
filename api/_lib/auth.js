import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 12;
const MAX_FAILURES = 5;

function env(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Variavel de ambiente ausente: ${name}`);
  return value;
}

/** Compara strings sem vazar tempo de execucao. */
function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) {
    timingSafeEqual(ba, ba);
    return false;
  }
  return timingSafeEqual(ba, bb);
}

export function verifyEmail(email) {
  return safeEqual(String(email).trim().toLowerCase(), env('ADMIN_EMAIL').trim().toLowerCase());
}

export function verifyPassword(password) {
  const parts = env('ADMIN_PASSWORD_HASH').split('$');
  const [, saltHex, hashHex] = parts;
  if (parts[0] !== 'scrypt' || !saltHex || !hashHex) {
    throw new Error('ADMIN_PASSWORD_HASH invalido: esperado scrypt$<salt>$<hash>');
  }
  const expected = Buffer.from(hashHex, 'hex');
  if (expected.length === 0) throw new Error('ADMIN_PASSWORD_HASH invalido');
  const actual = scryptSync(String(password), saltHex, expected.length);
  return timingSafeEqual(expected, actual);
}

function sign(payload) {
  return createHmac('sha256', env('SESSION_SECRET')).update(payload).digest('base64url');
}

export function createSession() {
  const expires = Date.now() + SESSION_MAX_AGE_MS;
  const payload = `admin.${expires}`;
  return {
    value: `${payload}.${sign(payload)}`,
    maxAgeSeconds: Math.floor(SESSION_MAX_AGE_MS / 1000)
  };
}

export function verifySession(value) {
  if (!value) return false;
  const parts = String(value).split('.');
  if (parts.length !== 3) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  if (!safeEqual(parts[2], sign(payload))) return false;
  return Number(parts[1]) > Date.now();
}

export function readCookie(req, name) {
  const header = req.headers.cookie;
  if (!header) return null;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return decodeURIComponent(part.slice(eq + 1).trim());
  }
  return null;
}

export function sessionCookie(value, maxAgeSeconds) {
  return `sheldon_admin=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; HttpOnly; Secure; SameSite=Strict`;
}

export function clearCookie() {
  return 'sheldon_admin=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict';
}

/**
 * Bloqueio por tentativas falhas. Vive na memoria da instancia, entao e uma
 * camada best-effort: protege contra forca bruta simples, nao contra um
 * atacante distribuido. Para algo mais forte seria preciso um armazenamento
 * compartilhado (Vercel KV).
 */
const failures = new Map();

export function loginLocked(key) {
  const record = failures.get(key);
  if (!record) return 0;
  if (Date.now() > record.until) {
    failures.delete(key);
    return 0;
  }
  return Math.ceil((record.until - Date.now()) / 1000);
}

export function recordFailure(key) {
  const record = failures.get(key) ?? { count: 0, until: 0 };
  record.count += 1;
  if (record.count >= MAX_FAILURES) {
    const minutes = Math.min(30, 2 ** (record.count - MAX_FAILURES + 1));
    record.until = Date.now() + minutes * 60 * 1000;
  }
  failures.set(key, record);
}

export function clearFailures(key) {
  failures.delete(key);
}

export function generatePasswordHash(password, saltHex = randomBytes(16).toString('hex')) {
  const derived = scryptSync(String(password), saltHex, 64).toString('hex');
  return `scrypt$${saltHex}$${derived}`;
}