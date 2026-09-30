import { createHash } from 'node:crypto';
import { readCookie, verifySession } from './_lib/auth.js';
import { json, methodNotAllowed, sameOrigin } from './_lib/http.js';
import { commitBinary, listFolder } from './_lib/github.js';
import { ALLOWED_EXTENSIONS, MAX_UPLOAD_BYTES, MEDIA_FOLDER, safeFileName } from './_lib/media.js';

export default async function handler(req, res) {
  if (!verifySession(readCookie(req, 'sheldon_admin'))) {
    return json(res, 401, { error: 'nao autenticado' });
  }

  if (req.method === 'GET') {
    try {
      return json(res, 200, { files: await listFolder(MEDIA_FOLDER) });
    } catch (error) {
      return json(res, 502, { error: error.message });
    }
  }

  if (req.method === 'POST') {
    if (!sameOrigin(req, res)) return;
    const { name, dataBase64 } = req.body ?? {};
    if (typeof name !== 'string' || typeof dataBase64 !== 'string') {
      return json(res, 400, { error: 'informe nome e arquivo' });
    }
    if (!ALLOWED_EXTENSIONS.test(name)) {
      return json(res, 400, { error: 'tipo nao aceito (use imagem ou video)' });
    }

    const buffer = Buffer.from(dataBase64, 'base64');
    if (buffer.length === 0) return json(res, 400, { error: 'arquivo vazio' });
    if (buffer.length > MAX_UPLOAD_BYTES) {
      return json(res, 413, { error: `arquivo maior que ${MAX_UPLOAD_BYTES / 1024 / 1024} MB` });
    }

    const hash = createHash('sha1').update(buffer).digest('hex').slice(0, 7);
    const fileName = safeFileName(name, hash);
    const path = `${MEDIA_FOLDER}/${fileName}`;

    try {
      await commitBinary(path, dataBase64, `Adiciona midia ${fileName}`);
      return json(res, 200, { ok: true, path });
    } catch (error) {
      return json(res, 502, { error: error.message });
    }
  }

  return methodNotAllowed(res, 'GET, POST');
}