import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

/**
 * Referencia congelada do site antes do CMS. `index.html` foi movido para
 * `src/index.template.html`, entao HEAD ja nao serve mais: o ultimo commit que
 * ainda tinha o arquivo original e 57b27e9.
 */
const REF = '57b27e9';

let original;
try {
  original = execSync(`git show ${REF}:index.html`, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
} catch {
  console.error(`Nao foi possivel ler a referencia ${REF}:index.html do git.`);
  process.exit(1);
}
const built = readFileSync('dist/index.html', 'utf8');

/** Texto visivel: sem comentarios, script/style e sem espacos repetidos. */
function visibleText(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

const a = visibleText(original);
const b = visibleText(built);

console.log(`caracteres de texto: original ${a.length}   gerado ${b.length}\n`);

if (a === b) {
  console.log('OK: texto visivel identico ao original');
  process.exit(0);
}

/** Primeira posicao em que os textos divergem, com contexto. */
let i = 0;
while (i < a.length && a[i] === b[i]) i += 1;

const from = Math.max(0, i - 70);
console.log(`divergem na posicao ${i} de ${a.length}`);
console.log(`\n  original: …${a.slice(from, i + 90)}`);
console.log(`\n  gerado:   …${b.slice(from, i + 90)}`);