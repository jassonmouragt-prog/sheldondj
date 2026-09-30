import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const original = execSync('git show HEAD:index.html', { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const built = readFileSync('dist/index.html', 'utf8');

const srcs = (html) => [...html.matchAll(/\ssrc="([^"]+)"/g)].map((m) => m[1]);
const a = srcs(original);
const b = srcs(built);

console.log(`imagens/videos: original ${a.length}   gerado ${b.length}`);

let diffs = 0;
const max = Math.max(a.length, b.length);
for (let i = 0; i < max; i += 1) {
  if (a[i] === b[i]) continue;
  diffs += 1;
  console.log(`\n  pos ${i + 1}`);
  console.log(`    original: ${a[i] ?? '(ausente)'}`);
  console.log(`    gerado:   ${b[i] ?? '(ausente)'}`);
}
console.log(diffs === 0 ? '\nOK: ordem e caminhos de midia identicos' : `\n${diffs} divergencias`);