import { readFile, writeFile } from './github.js';
import { schema, findFile } from './schema.js';

const MAX_STRING = 20000;
const MAX_SHORT_STRING = 400;
const MAX_ITEMS = 60;
const MAX_DEPTH = 8;

export { schema, findFile };

export class ValidationError extends Error {}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function fail(path, message) {
  throw new ValidationError(`${path}: ${message}`);
}

/** Imagens e videos viram src/href no HTML final: so aceitamos caminhos internos. */
function isSafeAssetPath(value) {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= 300 &&
    !value.startsWith('/') &&
    !value.includes('..') &&
    !value.includes('\\') &&
    !/^[a-z][a-z0-9+.-]*:/i.test(value) &&
    !/[\u0000-\u001f]/.test(value)
  );
}

function checkString(value, path, max = MAX_STRING) {
  if (typeof value !== 'string') fail(path, 'esperava texto');
  if (value.length > max) fail(path, `excede ${max} caracteres`);
  if (/\u0000/.test(value)) fail(path, 'caractere invalido');
  return value;
}

function checkAsset(value, path) {
  if (typeof value !== 'string') fail(path, 'esperava caminho de arquivo');
  if (value === '') return value;
  if (!isSafeAssetPath(value)) fail(path, 'caminho de midia invalido');
  return value;
}

function checkScalar(value, widget, path) {
  if (widget === 'number') {
    if (typeof value !== 'number' || !Number.isFinite(value)) fail(path, 'esperava numero');
    return value;
  }
  if (widget === 'boolean') {
    if (typeof value !== 'boolean') fail(path, 'esperava verdadeiro ou falso');
    return value;
  }
  if (widget === 'image' || widget === 'file') return checkAsset(value, path);
  return checkString(value, path);
}

/**
 * Percorre dados e schema em paralelo e rejeita qualquer chave desconhecida,
 * tipo errado ou lista grande demais. E o que impede o painel de gravar
 * campos arbitrarios no conteudo.
 */
function walk(value, fields, path, depth) {
  if (depth > MAX_DEPTH) fail(path, 'estrutura profunda demais');

  if (fields.widget === 'group' || fields.widget === 'object') {
    if (!isPlainObject(value)) fail(path, 'esperava um bloco');
    const known = new Map(fields.fields.map((field) => [field.name, field]));
    for (const key of Object.keys(value)) {
      if (!known.has(key)) fail(path ? `${path}.${key}` : key, 'campo nao permitido');
    }
    for (const field of fields.fields) {
      const fieldPath = path ? `${path}.${field.name}` : field.name;
      if (!(field.name in value)) continue;
      value[field.name] = walkField(value[field.name], field, fieldPath, depth + 1);
    }
    return value;
  }

  return value;
}

function walkField(value, field, path, depth) {
  switch (field.widget) {
    case 'group':
    case 'object':
      return walk(value, field, path, depth);

    case 'list': {
      if (!Array.isArray(value)) fail(path, 'esperava uma lista');
      if (value.length > MAX_ITEMS) fail(path, `no maximo ${MAX_ITEMS} itens`);
      const sub = field.field;
      if (sub && (sub.widget === 'object' || sub.widget === 'group')) {
        return value.map((item, index) => walk(item, sub, `${path}[${index}]`, depth + 1));
      }
      if (sub && sub.widget === 'list') {
        return value.map((item, index) => walkField(item, sub, `${path}[${index}]`, depth + 1));
      }
      if (Array.isArray(field.fields)) {
        const asObject = { widget: 'object', fields: field.fields };
        return value.map((item, index) => walk(item, asObject, `${path}[${index}]`, depth + 1));
      }
      if (sub) {
        if (sub.widget === 'image' || sub.widget === 'file') {
          return value.map((item, index) => checkAsset(item, `${path}[${index}]`));
        }
        return value.map((item, index) => checkScalar(item, sub.widget, `${path}[${index}]`));
      }
      return value;
    }

    case 'number':
    case 'boolean':
    case 'image':
    case 'file':
      return checkScalar(value, field.widget, path);

    case 'select': {
      const allowed = (field.options ?? []).map((option) => option.value);
      const current = checkString(value, path, MAX_SHORT_STRING);
      if (!allowed.includes(current)) fail(path, `valor nao permitido (use: ${allowed.join(', ')})`);
      return current;
    }

    default:
      return checkString(value, path);
  }
}

export function validateDocument(fileId, data) {
  const file = findFile(fileId);
  if (!file) throw new ValidationError('documento desconhecido');
  if (!isPlainObject(data)) throw new ValidationError('esperava um objeto');
  const known = new Set(file.fields.map((field) => field.name));
  for (const key of Object.keys(data)) {
    if (!known.has(key)) fail(key, 'campo nao permitido');
  }
  for (const field of file.fields) {
    if (field.name in data) data[field.name] = walkField(data[field.name], field, field.name, 0);
  }
  return data;
}

export async function readDocument(fileId) {
  const file = findFile(fileId);
  if (!file) throw new ValidationError('documento desconhecido');
  const { sha, text } = await readFile(file.path);
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`${file.path} no repositorio nao e um JSON valido`);
  }
  validateDocument(fileId, data);
  return { fileId, sha, data };
}

export async function saveDocument(fileId, data, message) {
  const file = findFile(fileId);
  if (!file) throw new ValidationError('documento desconhecido');
  const { sha } = await readFile(file.path);
  validateDocument(fileId, data);
  const text = `${JSON.stringify(data, null, 2)}\n`;
  await writeFile(file.path, text, sha, message);
  return { path: file.path, bytes: text.length };
}

export { schema as SCHEMA };