import {
  clearFailures,
  createSession,
  loginLocked,
  readCookie,
  recordFailure,
  sessionCookie,
  verifyEmail,
  verifyPassword,
  verifySession
} from './_lib/auth.js';
import { clientKey, json, methodNotAllowed, sameOrigin } from './_lib/http.js';

export default function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');
  if (!sameOrigin(req, res)) return;

  const key = clientKey(req);
  const wait = loginLocked(key);
  if (wait > 0) {
    return json(res, 429, { error: `Muitas tentativas. Tente de novo em ${wait} segundos.` });
  }

  const { email, password } = req.body ?? {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    return json(res, 400, { error: 'informe e-mail e senha' });
  }

  let ok = false;
  try {
    ok = verifyEmail(email) && verifyPassword(password);
  } catch (error) {
    return json(res, 500, { error: error.message });
  }

  if (!ok) {
    recordFailure(key);
    return json(res, 401, { error: 'e-mail ou senha invalidos' });
  }

  clearFailures(key);
  const session = createSession();
  res.setHeader('Set-Cookie', sessionCookie(session.value, session.maxAgeSeconds));
  return json(res, 200, { ok: true });
}