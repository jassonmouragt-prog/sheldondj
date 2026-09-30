export function json(res, status, body, headers = {}) {
  res.status(status).json(body);
}

export function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed);
  json(res, 405, { error: 'metodo nao permitido' });
}

/**
 * Barra chamadas vindas de outra origem. Junto com o cookie
 * SameSite=Strict e o token do GitHub ficar so no servidor, e o que impede
 * que um site terceiro faca o navegador do cliente salvar conteudo.
 */
export function sameOrigin(req, res) {
  const origin = req.headers.origin;
  if (!origin) return true;
  const host = req.headers['x-forwarded-host'] ?? req.headers.host;
  if (!host) {
    json(res, 403, { error: 'origem nao permitida' });
    return false;
  }
  let originHost;
  try {
    originHost = new URL(origin).host;
  } catch {
    json(res, 403, { error: 'origem nao permitida' });
    return false;
  }
  if (originHost !== host) {
    json(res, 403, { error: 'origem nao permitida' });
    return false;
  }
  return true;
}

/** IP do cliente, usado como chave do bloqueio de tentativas. */
export function clientKey(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress ?? 'desconhecido';
}