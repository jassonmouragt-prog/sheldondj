/**
 * Testes das rotas: sessao, bloqueio de origem e os caminhos que nao chegam
 * a tocar o GitHub. Roda offline.
 */
process.env.ADMIN_EMAIL = 'teste@exemplo.com';
process.env.SESSION_SECRET = 'segredo-de-teste-com-tamanho-razoavel';
const { generatePasswordHash } = await import('../api/_lib/auth.js');
process.env.ADMIN_PASSWORD_HASH = generatePasswordHash('senha-correta-123');

const login = (await import('../api/login.js')).default;
const logout = (await import('../api/logout.js')).default;
const session = (await import('../api/session.js')).default;
const content = (await import('../api/content.js')).default;
const upload = (await import('../api/upload.js')).default;

let failed = 0;
let passed = 0;

function call(handler, { method = 'GET', query = {}, body = {}, cookie, origin, host = 'exemplo.com' } = {}) {
  const headers = { host, 'x-forwarded-host': host, 'x-forwarded-for': '203.0.113.9' };
  if (cookie) headers.cookie = cookie;
  if (origin) headers.origin = origin;

  const res = {
    statusCode: 200,
    payload: null,
    headers: {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(value) {
      this.payload = value;
      return this;
    },
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    }
  };

  return Promise.resolve(handler({ method, query, body, headers }, res)).then(() => res);
}

function ok(condition, name, detail) {
  if (condition) {
    passed += 1;
    console.log(`  ok    ${name}`);
  } else {
    failed += 1;
    console.log(`  FALHOU  ${name}${detail ? ` -> ${detail}` : ''}`);
  }
}

async function main() {
  console.log('\nlogin');

  let res = await call(login, { method: 'GET' });
  ok(res.statusCode === 405, 'recusa GET em login', `recebeu ${res.statusCode}`);
  ok(res.headers.allow === 'POST', 'anuncia Allow: POST');

  res = await call(login, { method: 'POST', origin: 'https://outro.site', body: { email: 'teste@exemplo.com', password: 'senha-correta-123' } });
  ok(res.statusCode === 403, 'recusa origem de outro site', `recebeu ${res.statusCode}`);

  res = await call(login, { method: 'POST', body: {} });
  ok(res.statusCode === 400, 'recusa corpo sem e-mail e senha');

  res = await call(login, { method: 'POST', body: { email: 'teste@exemplo.com', password: 'errada' } });
  ok(res.statusCode === 401, 'recusa senha errada');

  res = await call(login, { method: 'POST', body: { email: 'intruso@exemplo.com', password: 'senha-correta-123' } });
  ok(res.statusCode === 401, 'recusa e-mail errado com senha certa');

  res = await call(login, { method: 'POST', body: { email: 'teste@exemplo.com', password: 'senha-correta-123' } });
  ok(res.statusCode === 200, 'aceita credenciais corretas', JSON.stringify(res.payload));

  const cookie = (res.headers['set-cookie'] ?? '').split(';')[0];
  ok(res.headers['set-cookie']?.includes('HttpOnly'), 'cookie e HttpOnly');
  ok(res.headers['set-cookie']?.includes('Secure'), 'cookie e Secure');
  ok(res.headers['set-cookie']?.includes('SameSite=Strict'), 'cookie e SameSite=Strict');
  ok(res.headers['set-cookie']?.includes('Path=/'), 'cookie vale para o site inteiro');

  console.log('\nbloqueio de tentativas');
  let blocked = false;
  for (let i = 0; i < 7; i += 1) {
    const attempt = await call(login, { method: 'POST', body: { email: 'teste@exemplo.com', password: 'errada' } });
    if (attempt.statusCode === 429) blocked = true;
  }
  ok(blocked, 'bloqueia o IP apos varias tentativas');
  const locked = await call(login, { method: 'POST', body: { email: 'teste@exemplo.com', password: 'senha-correta-123' } });
  ok(locked.statusCode === 429, 'senha correta tambem fica bloqueada durante a espera');

  console.log('\nsessao e rotas protegidas');
  res = await call(session);
  ok(res.statusCode === 401, 'session exige login');
  res = await call(session, { cookie: 'sheldon_admin=admin.9999999999999.fake' });
  ok(res.statusCode === 401, 'session recusa cookie forjado');
  res = await call(session, { cookie });
  ok(res.statusCode === 200, 'session aceita cookie valido');
  ok(res.payload?.files?.length === 4, 'session lista os quatro documentos');

  res = await call(content, { query: { id: 'sections-top' } });
  ok(res.statusCode === 401, 'content exige login');
  res = await call(content, { cookie, query: { id: 'nao-existe' } });
  ok(res.statusCode === 404, 'content recusa documento desconhecido');
  res = await call(upload, {});
  ok(res.statusCode === 401, 'upload exige login');
  res = await call(upload, { cookie, method: 'POST', body: { name: 'x.exe', dataBase64: 'AAAA' } });
  ok(res.statusCode === 400, 'upload recusa extensao nao permitida');
  res = await call(upload, { cookie, method: 'POST', body: { name: 'a.png' } });
  ok(res.statusCode === 400, 'upload recusa arquivo sem conteudo');
  res = await call(upload, { cookie, method: 'POST', origin: 'https://outro.site', body: { name: 'a.png', dataBase64: 'AAAA' } });
  ok(res.statusCode === 403, 'upload recusa origem de outro site');

  res = await call(content, { cookie, method: 'PUT', origin: 'https://outro.site', body: { id: 'global', data: {} } });
  ok(res.statusCode === 403, 'content recusa gravacao vinda de outro site');

  res = await call(logout, { method: 'GET' });
  ok(res.statusCode === 405, 'logout so aceita POST');
  res = await call(logout, { method: 'POST' });
  ok(res.statusCode === 200, 'logout responde ok');
  ok(res.headers['set-cookie']?.includes('Max-Age=0'), 'logout apaga o cookie');

  console.log('\nresultado');
  console.log(`  ${passed} passaram, ${failed} falharam`);
  process.exit(failed === 0 ? 0 : 1);
}

main();