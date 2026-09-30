import { clearCookie } from './_lib/auth.js';
import { json, methodNotAllowed } from './_lib/http.js';

export default function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');
  res.setHeader('Set-Cookie', clearCookie());
  return json(res, 200, { ok: true });
}