/**
 * Testes da camada de servidor do painel: senha, sessao, validacao do
 * conteudo contra o schema e saneamento de nome de arquivo. Roda sem rede e
 * sem GitHub, usando variaveis de ambiente ficticias.
 */
process.env.ADMIN_EMAIL = 'teste@exemplo.com';
process.env.SESSION_SECRET = 'segredo-de-teste-com-tamanho-razoavel';
process.env.ADMIN_PASSWORD_HASH = 'scrypt$0badc0de0badc0de0badc0de0badc0de0badc0de0badc0de0badc0de0badc0de0badc0de0badc0de0badc0de0badc0de0badc0de$';

import { readFileSync } from 'node:fs';

const { generatePasswordHash, verifyPassword, verifyEmail, createSession, verifySession, readCookie } =
  await import('../api/_lib/auth.js');
const { validateDocument, ValidationError } = await import('../api/_lib/data.js');
const { safeFileName } = await import('../api/_lib/media.js');

let failed = 0;
let passed = 0;

function ok(condition, name, detail) {
  if (condition) {
    passed += 1;
    console.log(`  ok    ${name}`);
  } else {
    failed += 1;
    console.log(`  FALHOU  ${name}${detail ? ` -> ${detail}` : ''}`);
  }
}

function bloqueado(name, fn) {
  try {
    fn();
    failed += 1;
    console.log(`  FALHOU  ${name} (nao bloqueou)`);
  } catch (error) {
    if (error instanceof ValidationError) {
      passed += 1;
      console.log(`  ok    ${name}`);
    } else {
      failed += 1;
      console.log(`  FALHOU  ${name} (erro inesperado: ${error.message})`);
    }
  }
}

function aceita(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`  ok    ${name}`);
  } catch (error) {
    failed += 1;
    console.log(`  FALHOU  ${name} -> ${error.message}`);
  }
}

console.log('\nsenha');
const hash = generatePasswordHash('senha-correta-123');
process.env.ADMIN_PASSWORD_HASH = hash;
ok(verifyPassword('senha-correta-123'), 'aceita a senha correta');
ok(!verifyPassword('senha-correta-124'), 'recusa senha parecida');
ok(!verifyPassword(''), 'recusa senha vazia');
ok(!verifyPassword('a'.repeat(5000)), 'recusa senha enorme');
ok(verifyEmail('teste@exemplo.com'), 'aceita o e-mail configurado');
ok(verifyEmail('TESTE@Exemplo.COM '), 'ignora caixa e espaco no e-mail');
ok(!verifyEmail('outro@exemplo.com'), 'recusa outro e-mail');
ok(!verifyEmail('teste@exemplo.co'), 'recusa e-mail parecido');

console.log('\nsessao');
const session = createSession();
ok(verifySession(session.value), 'sessao recem-criada e valida');
ok(!verifySession(`${session.value}x`), 'recusa sessao adulterada');
ok(!verifySession(`${session.value.split('.').slice(0, 2).join('.')}.outra`), 'recusa assinatura errada');
ok(!verifySession('admin.1.abc'), 'recusa sessao expirada');
ok(!verifySession(''), 'recusa sessao vazia');
ok(!verifySession(null), 'recusa sessao ausente');
ok(
  readCookie({ headers: { cookie: `outro=1; sheldon_admin=${session.value}; fim=2` } }, 'sheldon_admin') ===
    session.value,
  'le o cookie no meio da lista'
);
ok(readCookie({ headers: {} }, 'sheldon_admin') === null, 'devolve null sem cookie');
ok(readCookie({ headers: { cookie: 'sem_igual' } }, 'sheldon_admin') === null, 'ignora cookie malformado');

console.log('\nnome de arquivo');
ok(safeFileName('Foto do DJ.jpg', 'abc1234') === 'foto-do-dj-abc1234.jpg', 'normaliza acento e espaco');
ok(safeFileName('../../etc/passwd', 'h1') === 'etc-passwd-h1', 'remove caminho relativo');
ok(safeFileName('meu video.MP4', 'h2') === 'meu-video-h2.mp4', 'rebaixa extensao');
ok(safeFileName('----.png', 'h3') === 'arquivo-h3.png', 'evita nome vazio');
ok(safeFileName('x'.repeat(200) + '.png', 'h4').length <= 70, 'limita tamanho do nome');
ok(!safeFileName('a b;rm -rf/.png', 'h5').includes('/'), 'remove barra');
ok(!safeFileName('a b;rm -rf/.png', 'h6').includes(';'), 'remove ponto e virgula');

console.log('\nvalidacao de conteudo');
const load = (path) => JSON.parse(readFileSync(path, 'utf8'));
const top = () => load('content/sections-top.json');
const mid = () => load('content/sections-mid.json');
const bot = () => load('content/sections-bottom.json');

aceita('conteudo real de global', () => validateDocument('global', load('content/global.json')));
aceita('conteudo real de sections-top', () => validateDocument('sections-top', top()));
aceita('conteudo real de sections-mid', () => validateDocument('sections-mid', mid()));
aceita('conteudo real de sections-bottom', () => validateDocument('sections-bottom', bot()));
aceita('grupo vazio e permitido', () => {
  const d = top();
  d.concept.body = '';
  validateDocument('sections-top', d);
});
aceita('imagem vazia e permitida', () => {
  const d = top();
  d.finalCtaDummy = undefined;
  delete d.finalCtaDummy;
  d.hero.image = '';
  validateDocument('sections-top', d);
});

bloqueado('chave nova na raiz', () => {
  const d = top();
  d.novoBloco = {};
  validateDocument('sections-top', d);
});
bloqueado('chave nova dentro de grupo', () => {
  const d = top();
  d.hero.script = 'alert(1)';
  validateDocument('sections-top', d);
});
bloqueado('chave nova dentro de item de lista', () => {
  const d = top();
  d.hero.titleLines[0].script = 'alert(1)';
  validateDocument('sections-top', d);
});
bloqueado('chave nova em servico', () => {
  const d = mid();
  d.services.items[0].hack = 1;
  validateDocument('sections-mid', d);
});
bloqueado('chave nova em video', () => {
  const d = mid();
  d.services.videos[0].hack = 1;
  validateDocument('sections-mid', d);
});
bloqueado('chave nova em depoimento', () => {
  const d = bot();
  d.testimonials.items[0].hack = 1;
  validateDocument('sections-bottom', d);
});
bloqueado('texto no lugar de numero', () => {
  const d = top();
  d.authority.items[0].count = '2011';
  validateDocument('sections-top', d);
});
bloqueado('null no lugar de numero', () => {
  const d = top();
  d.authority.items[0].count = null;
  validateDocument('sections-top', d);
});
bloqueado('texto acima do limite', () => {
  const d = top();
  d.hero.sub = 'x'.repeat(50000);
  validateDocument('sections-top', d);
});
bloqueado('texto grande dentro de item', () => {
  const d = top();
  d.hero.titleLines[0].text = 'x'.repeat(30000);
  validateDocument('sections-top', d);
});
bloqueado('lista acima do limite', () => {
  const d = top();
  d.hero.titleLines = Array.from({ length: 500 }, (_, i) => ({ text: `l${i}` }));
  validateDocument('sections-top', d);
});
bloqueado('objeto onde era lista de texto', () => {
  const d = top();
  d.concept.titleLines = [{ text: 'a' }, { text: 'b' }];
  validateDocument('sections-top', d);
});
bloqueado('texto onde era lista', () => {
  const d = top();
  d.hero.titleLines = 'MAIS QUE';
  validateDocument('sections-top', d);
});
bloqueado('string onde era objeto', () => {
  const d = mid();
  d.services.items[0] = 'texto';
  validateDocument('sections-mid', d);
});
bloqueado('imagem com javascript:', () => {
  const d = top();
  d.hero.image = 'javascript:alert(1)';
  validateDocument('sections-top', d);
});
bloqueado('imagem com data:', () => {
  const d = top();
  d.hero.image = 'data:text/html,<script>alert(1)</script>';
  validateDocument('sections-top', d);
});
bloqueado('imagem com caminho relativo', () => {
  const d = top();
  d.hero.image = '../../etc/passwd';
  validateDocument('sections-top', d);
});
bloqueado('imagem absoluta', () => {
  const d = top();
  d.hero.image = '/etc/passwd';
  validateDocument('sections-top', d);
});
bloqueado('poster com protocolo', () => {
  const d = mid();
  d.services.videos[0].poster = 'http://exemplo.com/a.jpg';
  validateDocument('sections-mid', d);
});
bloqueado('select com valor inventado', () => {
  const d = mid();
  d.services.items[0].variant = 'hacker';
  validateDocument('sections-mid', d);
});
bloqueado('estilo de botao inventado', () => {
  const d = bot();
  d.packages.items[0].ctaStyle = 'btn hacker';
  validateDocument('sections-bottom', d);
});
bloqueado('documento desconhecido', () => validateDocument('nao-existe', {}));

console.log('\nresultado');
console.log(`  ${passed} passaram, ${failed} falharam`);
process.exit(failed === 0 ? 0 : 1);