/**
 * O serializador do painel precisa devolver o arquivo exatamente como ele
 * estava, para que salvar sem mudar nada gere um diff vazio no GitHub.
 */
import { readFileSync } from 'node:fs';
import { formatJson } from '../api/_lib/data.js';

let failed = 0;
let passed = 0;
const ok = (cond, name, detail = '') => {
  if (cond) {
    passed += 1;
    console.log(`  ok    ${name}`);
  } else {
    failed += 1;
    console.log(`  FALHOU  ${name}${detail ? ` -> ${detail}` : ''}`);
  }
};

const FILES = ['global', 'sections-top', 'sections-mid', 'sections-bottom'];

console.log('\nida a volta sem mexer em nada');
for (const id of FILES) {
  const original = readFileSync(`content/${id}.json`, 'utf8');
  const rebuilt = `${formatJson(JSON.parse(original))}\n`;
  ok(rebuilt === original, `${id}.json: salvar sem mudar nada nao altera o arquivo`, `${original.length} -> ${rebuilt.length} bytes`);
}

console.log('\nestilo das linhas');
const original = readFileSync('content/sections-top.json', 'utf8');
const lines = original.split('\n');
const inlineNav = lines.find((l) => l.trim().startsWith('{ "label": "Início"'));
ok(Boolean(inlineNav), 'objetos curtos ficam em uma linha');
ok(!original.includes('{\n        "label": "Início"'), 'nada foi expandido sem necessidade');

console.log('\nestabilidade');
for (const id of FILES) {
  const once = `${formatJson(JSON.parse(readFileSync(`content/${id}.json`, 'utf8')))}\n`;
  const twice = `${formatJson(JSON.parse(once))}\n`;
  ok(once === twice, `${id}.json: formatar duas vezes da o mesmo resultado`);
}

console.log('\ncasos limite');
ok(formatJson({}) === '{}', 'objeto vazio');
ok(formatJson([]) === '[]', 'lista vazia');
ok(formatJson('texto') === '"texto"', 'string simples');
ok(formatJson(0) === '0', 'zero');
ok(formatJson(false) === 'false', 'falso');
ok(formatJson(null) === 'null', 'nulo');
ok(formatJson({ a: 1 }) === '{ "a": 1 }', 'objeto curto em linha', formatJson({ a: 1 }));
ok(
  formatJson({ texto: 'x'.repeat(200) }).includes('\n'),
  'objeto com texto longo vai para varias linhas'
);
ok(!formatJson({ 'chave com "aspas"': 'a\\b' }).includes('\n'), 'escapes preservados', formatJson({ 'chave com "aspas"': 'a\\b' }));

const tricky = { a: [1, 2], b: { c: [{ d: 1 }] } };
ok(
  JSON.stringify(JSON.parse(formatJson(tricky))) === JSON.stringify(tricky),
  'estrutura aninhada continua valida'
);

const deep = JSON.parse(formatJson(tricky, 0));
ok(Array.isArray(deep.a) && deep.b.c[0].d === 1, 'nao perde dado');

console.log('\nunicode');
const accents = { texto: 'Seções · Rodapé · Vídeos' };
ok(JSON.parse(formatJson(accents)).texto === accents.texto, 'acentos sobrevivem a ida e volta');

console.log(`\n${passed} passaram, ${failed} falharam`);
process.exit(failed === 0 ? 0 : 1);
