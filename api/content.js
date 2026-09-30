import { readCookie, verifySession } from './_lib/auth.js';
import { json, methodNotAllowed, sameOrigin } from './_lib/http.js';
import { findFile, readDocument, saveDocument, ValidationError } from './_lib/data.js';

export default async function handler(req, res) {
  const authed = verifySession(readCookie(req, 'sheldon_admin'));
  if (!authed) return json(res, 401, { error: 'nao autenticado' });

  if (req.method === 'GET') {
    const id = req.query.id;
    const file = findFile(String(id ?? ''));
    if (!file) return json(res, 404, { error: 'documento desconhecido' });
    try {
      const { data } = await readDocument(file.id);
      return json(res, 200, { id: file.id, label: file.label, path: file.path, fields: file.fields, data });
    } catch (error) {
      return json(res, 502, { error: error.message });
    }
  }

  if (req.method === 'PUT') {
    if (!sameOrigin(req, res)) return;
    const { id, data, message } = req.body ?? {};
    const file = findFile(String(id ?? ''));
    if (!file) return json(res, 404, { error: 'documento desconhecido' });
    if (!data || typeof data !== 'object') return json(res, 400, { error: 'conteudo invalido' });

    const summary =
      typeof message === 'string' && message.trim()
        ? message.trim().slice(0, 120)
        : `Atualiza ${file.path}`;

    try {
      const saved = await saveDocument(file.id, data, summary);
      return json(res, 200, { ok: true, ...saved });
    } catch (error) {
      if (error instanceof ValidationError) return json(res, 400, { error: error.message });
      return json(res, 502, { error: error.message });
    }
  }

  return methodNotAllowed(res, 'GET, PUT');
}