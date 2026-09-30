import { readFileSync } from 'node:fs';
import { findFile, schema } from '../api/_lib/schema.js';
import { validateDocument } from '../api/_lib/data.js';

function leafPaths(data, prefix = '') {
  const out = [];
  for (const [key, value] of Object.entries(data)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(value)) {
      // Uma lista tem um unico formato definido no schema, entao o primeiro
      // elemento basta para descobrir os campos dentro dela.
      const first = value.find((item) => item !== null && item !== undefined);
      if (first === undefined) out.push(`${path}[]`);
      else if (typeof first === 'object') out.push(...leafPaths(first, path));
      else out.push(`${path}[]`);
      continue;
    }
    if (value && typeof value === 'object') {
      out.push(...leafPaths(value, path));
      continue;
    }
    out.push(path);
  }
  return out;
}

function schemaLeaves(fields, prefix = '') {
  const out = [];
  for (const field of fields) {
    const path = prefix ? `${prefix}.${field.name}` : field.name;
    if (field.widget === 'list') {
      const sub = field.fields ?? field.field?.fields ?? [];
      if (sub.length === 0) out.push(`${path}[]`);
      else out.push(...schemaLeaves(sub, path));
      continue;
    }
    if (field.widget === 'group' || field.widget === 'object') {
      out.push(...schemaLeaves(field.fields ?? [], path));
      continue;
    }
    out.push(path);
  }
  return out;
}

let problems = 0;
let schemaTotal = 0;
for (const id of ['global', 'sections-top', 'sections-mid', 'sections-bottom']) {
  const data = JSON.parse(readFileSync(`content/${id}.json`, 'utf8'));
  const fields = findFile(id).fields;
  const dataLeaves = [...new Set(leafPaths(data))].sort();
  const known = new Set(schemaLeaves(fields));
  const missing = dataLeaves.filter((p) => !known.has(p));
  const extra = [...known].filter((p) => !dataLeaves.includes(p));
  schemaTotal += known.size;

  console.log(`\n${id}`);
  console.log(`  folhas no JSON   : ${dataLeaves.length}`);
  console.log(`  campos no schema : ${known.size}`);

  // A mesma validacao que a API roda antes de gravar. Se passar, salvar nunca
  // vai ser rejeitado por campo desconhecido.
  let valid = true;
  try {
    validateDocument(id, data);
  } catch (error) {
    valid = false;
    problems += 1;
    console.log(`      REJEITADO ao salvar: ${error.message}`);
  }

  console.log(`  validacao de salvamento: ${valid ? 'ok' : 'falhou'}`);
  console.log(`  sem campo no schema: ${missing.length}`);
  for (const p of missing.slice(0, 12)) console.log(`      FALTA ${p}`);
  console.log(`  no schema mas ausente do JSON: ${extra.length}`);
  for (const p of extra.slice(0, 12)) console.log(`      EXTRA ${p}`);
  problems += missing.length;
}

console.log(`\ntotal de campos no schema: ${schemaTotal}`);
console.log(problems === 0 ? 'cobertura completa: salvar nunca vai falhar' : `${problems} problemas`);
