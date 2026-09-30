import { readCookie, verifySession } from './_lib/auth.js';
import { json, methodNotAllowed } from './_lib/http.js';
import { schema } from './_lib/schema.js';

export default function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET');
  const authed = verifySession(readCookie(req, 'sheldon_admin'));
  if (!authed) return json(res, 401, { error: 'nao autenticado' });
  return json(res, 200, { ok: true, files: schema.map(({ id, label }) => ({ id, label })) });
}