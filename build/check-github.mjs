/**
 * Testes da camada do GitHub com a rede substituida por um stub: cobre leitura,
 * gravacao com e sem sha (edicao concorrente), binarios e listagem de pasta.
 */
process.env.GITHUB_TOKEN = 'token-de-teste';
process.env.GITHUB_REPO = 'dono/repo';
process.env.GITHUB_BRANCH = 'main';

const github = await import('../api/_lib/github.js');
const { safeFileName, MEDIA_FOLDER, MAX_UPLOAD_BYTES, ALLOWED_EXTENSIONS } = await import('../api/_lib/media.js');

let failed = 0;
let passed = 0;

const calls = [];
let responder = () => ({ status: 200, body: {} });

const realFetch = globalThis.fetch;
globalThis.fetch = async (url, init = {}) => {
  const body = init.body ? JSON.parse(init.body) : null;
  calls.push({ url, method: init.method ?? 'GET', body, headers: init.headers });
  const answer = responder({ url, method: init.method ?? 'GET', body });
  return {
    ok: answer.status < 400,
    status: answer.status,
    text: async () => (typeof answer.body === 'string' ? answer.body : JSON.stringify(answer.body))
  };
};

function ok(condition, name, detail) {
  if (condition) {
    passed += 1;
    console.log(`  ok    ${name}`);
  } else {
    failed += 1;
    console.log(`  FALHOU  ${name}${detail ? ` -> ${detail}` : ''}`);
  }
}

const b64 = (text) => Buffer.from(text, 'utf8').toString('base64');

async function main() {
  console.log('\nleitura');
  responder = () => ({ status: 200, body: { sha: 'abc123', content: b64('{"a":1}') } });
  let file = await github.readFile('content/global.json');
  ok(file.sha === 'abc123', 'devolve o sha');
  ok(file.text === '{"a":1}', 'decodifica o base64');
  ok(calls[0].url.endsWith('/repos/dono/repo/contents/content/global.json?ref=main'), 'monta a URL com repo e branch', calls[0].url);
  ok(calls[0].headers.Authorization === 'Bearer token-de-teste', 'manda o token no cabecalho');

  console.log('\ngravacao');
  calls.length = 0;
  responder = () => ({ status: 200, body: { commit: { sha: 'novo' } } });
  await github.writeFile('content/global.json', '{"a":2}', 'sha-antigo', 'atualiza conteudo');
  ok(calls[0].body.sha === 'sha-antigo', 'inclui o sha para proteger edicao concorrente');
  ok(calls[0].body.branch === 'main', 'grava na branch configurada');
  ok(calls[0].body.content === b64('{"a":2}'), 'codifica o conteudo em base64');
  ok(calls[0].body.message === 'atualiza conteudo', 'manda a mensagem do commit');

  calls.length = 0;
  await github.writeFile('media/nova.png', 'conteudo', null, 'cria arquivo');
  ok(!('sha' in calls[0].body), 'omite o sha ao criar arquivo novo');

  console.log('\nbinario');
  calls.length = 0;
  await github.commitBinary('media/logo.png', 'BASE64JAH', 'envia midia');
  ok(calls[0].body.content === 'BASE64JAH', 'manda o binario sem recompor');
  ok(!('sha' in calls[0].body), 'binario novo nao leva sha');

  console.log('\nerros do GitHub');
  responder = () => ({ status: 401, body: { message: 'Bad credentials' } });
  let error = null;
  try {
    await github.readFile('content/global.json');
  } catch (caught) {
    error = caught;
  }
  ok(error?.message.includes('Bad credentials'), 'traduz 401 do GitHub', error?.message);

  responder = () => ({ status: 200, body: 'nao e json' });
  error = null;
  try {
    await github.readFile('content/global.json');
  } catch (caught) {
    error = caught;
  }
  ok(error?.message.includes('inesperada'), 'avisa quando a resposta nao e JSON valido', error?.message);

  console.log('\nlistagem de midia');
  responder = () => ({
    status: 200,
    body: [
      { type: 'file', name: 'logo.png' },
      { type: 'file', name: '.gitkeep' },
      { type: 'dir', name: 'subpasta' },
      { type: 'file', name: 'reel.mp4' }
    ]
  });
  let files = await github.listFolder(MEDIA_FOLDER);
  ok(files.length === 2, 'ignora .gitkeep e subpastas', JSON.stringify(files));
  ok(files[0].path === 'media/logo.png', 'monta o caminho completo');
  ok(files[0].name === 'logo.png', 'mantem o nome do arquivo');

  responder = () => ({ status: 404, body: { message: 'Not Found' } });
  files = await github.listFolder(MEDIA_FOLDER);
  ok(Array.isArray(files) && files.length === 0, 'devolve lista vazia quando a pasta nao existe');

  console.log('\nnome e limite de upload');
  ok(safeFileName('Logo Grande.PNG') === 'logo-grande.png', 'normaliza maiusculas e espacos', safeFileName('Logo Grande.PNG'));
  ok(safeFileName('acentuação.jpg', 'ab12') === 'acentuacao-ab12.jpg', 'tira acento e junta o hash', safeFileName('acentuação.jpg', 'ab12'));
  ok(!safeFileName('../../etc/passwd').includes('/'), 'tira barras do caminho', safeFileName('../../etc/passwd'));
  ok(safeFileName('../../etc/passwd') === 'etc-passwd', 'sem extensao valida vira slug', safeFileName('../../etc/passwd'));
  ok(safeFileName('').length > 0, 'nome vazio ainda gera arquivo utilizavel', safeFileName(''));
  ok(safeFileName('a'.repeat(300)).length <= 70, 'limita o tamanho do nome');
  ok(ALLOWED_EXTENSIONS.test('foto.JPEG') && ALLOWED_EXTENSIONS.test('clip.MP4'), 'aceita as extensoes permitidas');
  ok(!ALLOWED_EXTENSIONS.test('pagina.exe') && !ALLOWED_EXTENSIONS.test('script.php'), 'recusa executavel');
  ok(MAX_UPLOAD_BYTES < 100 * 1024 * 1024, 'limite fica abaixo do teto do GitHub', MAX_UPLOAD_BYTES);

  globalThis.fetch = realFetch;
  console.log('\nresultado');
  console.log(`  ${passed} passaram, ${failed} falharam`);
  process.exit(failed === 0 ? 0 : 1);
}

main();