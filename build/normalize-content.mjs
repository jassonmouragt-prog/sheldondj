/**
 * Normaliza os quatro JSONs de conteudo para a saida do formatJson do painel.
 * Rodar de novo nao deve mudar nada.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { formatJson } from '../api/_lib/data.js';

const FILES = ['global', 'sections-top', 'sections-mid', 'sections-bottom'];
let changed = 0;

for (const id of FILES) {
  const path = `content/${id}.json`;
  const before = readFileSync(path, 'utf8');
  const after = `${formatJson(JSON.parse(before))}\n`;
  if (before === after) {
    console.log(`  ${id}.json ja estava no formato`);
    continue;
  }
  writeFileSync(path, after, 'utf8');
  changed += 1;
  console.log(`  ${id}.json normalizado (${before.length} -> ${after.length} bytes)`);
}

console.log(`\n${changed === 0 ? 'nada a fazer' : `${changed} arquivo(s) normalizado(s)`}`);
