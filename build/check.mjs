import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const original = execSync('git show HEAD:index.html', { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const built = readFileSync('dist/index.html', 'utf8');

/**
 * Normaliza para comparacao: remove comentarios, coloca as tags em linhas
 * proprias (assim nos de texto viram tokens independentes) e colapsa whitespace.
 */
function normalize(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/>\s*</g, '>\n<')
    .split('\n')
    .map((t) => t.replace(/\s+/g, ' ').trim())
    .filter((t) => t !== '');
}

/** Diff por sequencia comum mais longa: evita cascata quando insere/remove tokens. */
function diff(a, b) {
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push(['-', a[i]]);
      i += 1;
    } else {
      out.push(['+', b[j]]);
      j += 1;
    }
  }
  while (i < n) out.push(['-', a[i++]]);
  while (j < m) out.push(['+', b[j++]]);
  return out;
}

const a = normalize(original);
const b = normalize(built);
const changes = diff(a, b).filter(([op]) => op !== ' ');

console.log(`tokens: original ${a.length}   gerado ${b.length}`);
console.log(`linhas alteradas: ${changes.length}\n`);

for (const [op, token] of changes) {
  console.log(`${op} ${token.slice(0, 135)}`);
}