/**
 * Build do site Sheldon Mais que DJ.
 *
 * Junta o layout fixo (src/index.template.html) com o conteudo editavel
 * pelo cliente (content/*.json) e gera o site estatico em dist/.
 *
 * Sem dependencias externas. Roda em Node 18+.
 */

import { readFile, writeFile, rm, mkdir, readdir, copyFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATE = join(ROOT, 'src', 'index.template.html');
const CONTENT_DIR = join(ROOT, 'content');
const DIST = join(ROOT, 'dist');

/** Pastas e arquivos estaticos copiados sem alteracao para dist/. */
const STATIC_ITEMS = ['css', 'js', 'assets', 'imagens baixadas', 'Imagens serviços', 'media', 'admin'];

/** protocolos liberados em atributos href editaveis pelo cliente */
const HREF_PROTOCOLS = ['http://', 'https://', 'mailto:', 'tel:', 'wa.me/', '#', '/'];

/** ponto decorativo dourado usado nos headings do design */
const DOT = '<span class="dot">.</span>';

/**
 * Resolve data-c-dot no span do ponto decorativo. O atributo guarda apenas o
 * caractere ("." ou "?"), nunca HTML: assim nenhum atributo precisa conter
 * um ">" que enganaria o localizador de fim de tag.
 */
function resolveDot(value) {
  if (value === null || value === '') return DOT;
  return `<span class="dot">${escapeHtml(value)}</span>`;
}

const warnings = [];

/* ------------------------------------------------------------------ *
 * 1. Conteudo
 * ------------------------------------------------------------------ */

async function loadContent() {
  const entries = await readdir(CONTENT_DIR, { withFileTypes: true });
  const data = {};

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
    const raw = await readFile(join(CONTENT_DIR, entry.name), 'utf8');
    try {
      Object.assign(data, JSON.parse(raw));
    } catch (err) {
      throw new Error(`content/${entry.name} nao e um JSON valido: ${err.message}`);
    }
  }

  return data;
}

/** Le "a.b.0.c" em um objeto, devolvendo undefined se algum nivel faltar. */
function lookup(data, path) {
  let node = data;
  for (const key of path.split('.')) {
    if (node === null || typeof node !== 'object') return undefined;
    node = node[key];
  }
  return node;
}

/* ------------------------------------------------------------------ *
 * 2. Utilitarios de HTML
 * ------------------------------------------------------------------ */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, '&quot;');
}

/**
 * Mantem apenas tokens de classe seguras. Usado em atributos class= vindos do
 * JSON, para que um valor com aspas ou colchetes nao consiga montar outra tag.
 *
 * O espaco separador e responsabilidade do template: use
 * `class="feature {{value.invert|class}}"`, nunca `class="feature{{...}}"`.
 */
function sanitizeClassTokens(value) {
  return String(value)
    .split(/\s+/)
    .filter((token) => /^[A-Za-z][\w-]*$/.test(token))
    .join(' ');
}

/** Formas SVG aceitas nos icones de redes sociais. */
const SVG_SHAPES = new Set(['rect', 'circle', 'ellipse', 'line', 'path', 'polygon', 'polyline']);

/** Atributos SVG aceitos: apenas geometria e pintura, nunca script ou href. */
const SVG_ATTRS = new Set([
  'x', 'y', 'width', 'height', 'rx', 'ry', 'cx', 'cy', 'r', 'r1', 'r2',
  'x1', 'y1', 'x2', 'y2', 'd', 'points',
  'fill', 'fill-rule', 'stroke', 'stroke-width', 'stroke-linecap',
  'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset', 'opacity',
]);

function sanitizeSvgAttrs(raw) {
  const kept = [];
  for (const m of raw.matchAll(/([a-zA-Z][\w:-]*)\s*=\s*"([^"]*)"/g)) {
    const name = m[1].toLowerCase();
    const value = m[2];
    if (!SVG_ATTRS.has(name)) {
      warnings.push(`svg: atributo "${name}" descartado`);
      continue;
    }
    if (!/^[-0-9.,\s%a-zA-Z]*$/.test(value)) {
      warnings.push(`svg: valor invalido em "${name}"`);
      continue;
    }
    kept.push(`${name}="${value}"`);
  }
  return kept.length ? ` ${kept.join(' ')}` : '';
}

/**
 * Reconstroi um icone SVG a partir de um allowlist de formas.
 *
 * O JSON traz o desenho do icone como marcacao. Em vez de inserir isso cru no
 * HTML (o que permitiria injetar qualquer elemento), o trecho e lido elemento a
 * elemento: o que nao for uma forma conhecida e descartado com um aviso.
 */
function sanitizeSvgMarkup(value) {
  const text = String(value).trim();
  const out = [];
  let i = 0;

  while (i < text.length) {
    if (/\s/.test(text[i])) {
      i += 1;
      continue;
    }
    if (text[i] !== '<') {
      warnings.push('svg: trecho fora de elemento descartado');
      break;
    }

    const head = /^<\s*([a-zA-Z][\w:-]*)/.exec(text.slice(i));
    if (!head) break;

    const name = head[1].toLowerCase();
    if (!SVG_SHAPES.has(name)) {
      warnings.push(`svg: elemento "${name}" nao permitido`);
      break;
    }

    const end = findTagEnd(text, i);
    if (end === -1) break;

    out.push(`<${name}${sanitizeSvgAttrs(text.slice(i + head[0].length, end))} />`);
    i = end + 1;
  }

  return out.join('');
}

/**
 * Codifica para URL apenas o que e invalido em caminho de arquivo.
 * Mantem / : ? & = # % intactos para nao quebrar URLs ja montadas pelo cliente.
 */
function encodeUrlPath(value) {
  return String(value).replace(/[^\x21-\x7E]|["'<>\\^`{|}\s]/g, (char) => encodeURIComponent(char));
}

function getAttr(openTag, name) {
  const m = new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, 'i').exec(openTag);
  if (!m) return null;
  return m[1] !== undefined ? m[1] : m[2];
}

function removeAttr(openTag, name) {
  return openTag.replace(new RegExp(`\\s${name}=(?:"[^"]*"|'[^']*')`, 'i'), '');
}

/** Substitui um atributo preservando os demais da tag e o estilo de aspa. */
function setAttribute(openTag, name, value) {
  const re = new RegExp(`(\\s${name}=)("[^"]*"|'[^']*')`, 'i');
  if (re.test(openTag)) {
    return openTag.replace(re, (_m, head, quoted) =>
      `${head}${quoted.startsWith("'") ? "'" : '"'}${escapeAttr(value)}${quoted.startsWith("'") ? "'" : '"'}`);
  }
  return openTag.replace(/^<\s*[a-zA-Z][\w:-]*/, (head) => `${head} ${name}="${escapeAttr(value)}"`);
}

/**
 * Localiza o `>` que fecha uma tag pulando valores de atributo entre aspas,
 * para tolerar caracteres como `>` dentro do conteudo de um atributo.
 */
function findTagEnd(html, start) {
  let quote = null;
  for (let i = start; i < html.length; i += 1) {
    const char = html[i];
    if (quote) {
      if (char === quote) quote = null;
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '>') {
      return i;
    }
  }
  return -1;
}

/**
 * Localiza o elemento aberto em `start`, respeitando aninhamento de tags
 * de mesmo nome. Devolve os limites da tag e do conteudo interno.
 */
function readElement(html, start) {
  const tagEnd = findTagEnd(html, start);
  if (tagEnd === -1) return null;

  const openTag = html.slice(start, tagEnd + 1);
  const tagName = (/^<\s*([a-zA-Z][\w:-]*)/.exec(openTag) || [])[1];
  if (!tagName) return null;

  const lower = tagName.toLowerCase();
  const scanner = new RegExp(`<(/?)${lower}\\b[^>]*>`, 'gi');
  scanner.lastIndex = start;

  let depth = 0;
  let match;
  while ((match = scanner.exec(html)) !== null) {
    const isClosing = match[1] === '/';
    const selfClosing = /\/>$/.test(match[0]);

    if (!isClosing && !selfClosing) depth += 1;
    else if (isClosing) {
      depth -= 1;
      if (depth === 0) {
        return {
          openTag,
          tagName,
          innerStart: tagEnd + 1,
          innerEnd: match.index,
          inner: html.slice(tagEnd + 1, match.index),
        };
      }
    }
  }

  return null;
}

/* ------------------------------------------------------------------ *
 * 3. Travamento de URLs
 * ------------------------------------------------------------------ */

/**
 * O cliente edita hrefs por um painel admin, entao URLs sao tratadas como
 * entrada nao confiavel: bloqueia javascript:, data: e afins.
 */
function sanitizeHref(value) {
  const trimmed = String(value).trim();
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed) && !HREF_PROTOCOLS.some((p) => trimmed.toLowerCase().startsWith(p))) {
    warnings.push(`href bloqueado (protocolo nao permitido): "${trimmed}"`);
    return '#';
  }
  return trimmed;
}

/* ------------------------------------------------------------------ *
 * 4. Passes de renderizacao
 * ------------------------------------------------------------------ */

/** Aplica transform() na tag de abertura de todo elemento com o atributo. */
function replaceAllTags(html, attrName, transform) {
  const re = new RegExp(`<[a-zA-Z][\\w:-]*[^>]*\\s${attrName}="[^"]*"[^>]*>`, 'g');
  return html.replace(re, (tag) => transform(tag, getAttr(tag, attrName)));
}

/**
 * Aplica transform() em todo elemento (tag + inner) que tenha o atributo.
 * Percorre da esquerda para a direita; apos cada substituicao o cursor
 * pula para o fim do elemento, entao elementos pais nao processam filhos.
 */
function replaceAllElements(html, attrName, transform) {
  const re = new RegExp(`<[a-zA-Z][\\w:-]*[^>]*\\s${attrName}="`, 'g');
  let out = '';
  let cursor = 0;

  while (cursor < html.length) {
    re.lastIndex = cursor;
    const match = re.exec(html);
    if (!match) {
      out += html.slice(cursor);
      break;
    }

    const el = readElement(html, match.index);
    if (!el) {
      out += html.slice(cursor, match.index + 1);
      cursor = match.index + 1;
      continue;
    }

    out += html.slice(cursor, match.index);
    const res = transform(el) || {};
    out += res.openTag ?? el.openTag;
    out += res.inner ?? el.inner;
    cursor = el.innerEnd;
  }

  return out;
}

/**
 * Localiza o <template data-c-item> de um container de lista, contando
 * aninhamento para nao parar no </template> de um template filho.
 *
 * Devolve o template completo, o corpo interno e os trechos vizinhos, que
 * sao preservados (eles podem conter elementos marcados com data-c-keep).
 */
function extractItemTemplate(inner) {
  const start = inner.indexOf('<template');
  if (start === -1) return null;

  const scanner = /<(\/?)template\b[^>]*>/gi;
  scanner.lastIndex = start;

  let depth = 0;
  let openTagEnd = -1;
  let match;

  while ((match = scanner.exec(inner)) !== null) {
    if (match[1] === '/') {
      depth -= 1;
      if (depth === 0) {
        return {
          before: inner.slice(0, start),
          body: inner.slice(openTagEnd, match.index),
          after: inner.slice(match.index + match[0].length),
        };
      }
    } else {
      if (depth === 0) openTagEnd = match.index + match[0].length;
      depth += 1;
    }
  }

  return null;
}

/** Resolve "a.b" em um objeto, devolvendo string vazia se faltar. */
function readField(source, path) {
  let node = source;
  for (const key of path.split('.')) {
    if (node === null || typeof node !== 'object') return '';
    node = node[key];
  }
  return node === null || node === undefined ? '' : node;
}

/**
 * Substitui um placeholder dentro do corpo de um template de item.
 *
 * Aceita:
 *   {{value}}          item inteiro (texto)
 *   {{value.campo}}    campo do item
 *   {{count}}          <span data-count="N">0</span> a partir de value.count,
 *                      ou string vazia se o item nao definir count
 *   {{dot}}            ponto decorativo dourado do design
 *   {{dotIf}}          ponto do item, usando value.dot ("," ou ".").
 *                      Aceita tambem value.dot: true, que vira "."
 *   {{index}} / {{index0}}   posicao (1-based / 0-based)
 *   {{index2}}         posicao 1-based com zero a esquerda ("01", "02", …)
 *   {{suffix}}         value.suffix; usa <i> quando value.suffixItalic e true
 *   {{suffixDot}}      sufixo do container em qualquer item (data-c-dot)
 *   {{dotLast}}        sufixo do container apenas no ultimo item: e onde o
 *                      ponto dourado fecha um titulo de varias linhas
 *
 * Modificadores apos o pipe:
 *   |esc   escapa o valor como texto (& < >)
 *   |br    quebra linhas do texto em <br /> (aceita \n e |)
 *   |url   codifica o valor como caminho de arquivo
 *   |class mantem apenas tokens de classe seguros
 *   |svg    reconstroi o icone a partir de formas SVG permitidas
 *   |raw   insere o valor sem escapar
 *
 * Sem modificador o valor e escapado para HTML, inclusive as aspas: e o padrao
 * seguro para texto e para valores colocados dentro de atributos.
 *
 * Blocos <template> aninhados sao devolvidos intactos: eles pertencem a uma
 * lista filha e sao renderizados na chamada recursiva de renderLists.
 */
function renderItemTemplate(tpl, value, index, suffix, total) {
  return tpl
    .split(/(<template[\s\S]*?<\/template>)/g)
    .map((part, i) => (i % 2 === 1 ? part : substitutePlaceholders(part, value, index, suffix, total)))
    .join('');
}

function substitutePlaceholders(text, value, index, suffix, total) {
  return text.replace(
    /\{\{\s*(value(?:\.[\w.]+)?|index0|index2|index|suffixDot|dotLast|suffix|count|dot|dotIf)\s*(?:\|\s*(esc(?:aped)?|br|url|class|svg|raw)\s*)?\}\}/g,
    (_match, key, modifier) => {
      if (key === 'dot') return DOT;
      if (key === 'dotIf') {
        const mark = readField(value, 'dot');
        return mark ? resolveDot(mark === true ? '.' : mark) : '';
      }
      if (key === 'dotLast') return index === total - 1 ? suffix : '';

      let raw;
      if (key === 'index') raw = index + 1;
      else if (key === 'index2') raw = String(index + 1).padStart(2, '0');
      else if (key === 'index0') raw = index;
      else if (key === 'suffixDot') raw = suffix || '';
      else if (key === 'suffix') {
        const symbol = readField(value, 'suffix');
        if (!symbol) return '';
        return readField(value, 'suffixItalic') ? `<i>${escapeAttr(symbol)}</i>` : escapeAttr(symbol);
      } else if (key === 'count') {
        const n = Number(readField(value, 'count'));
        return Number.isFinite(n) && n > 0 ? `<span data-count="${n}">0</span>` : '';
      } else if (key === 'value') raw = typeof value === 'object' ? JSON.stringify(value) : value;
      else raw = readField(value, key.slice(6));

      if (modifier === 'raw') return String(raw);
      if (modifier === 'class') return sanitizeClassTokens(raw);
      if (modifier === 'svg') return sanitizeSvgMarkup(raw);
      if (modifier === 'url') return encodeUrlPath(raw);
      if (modifier === 'br') {
        const lines = String(raw).split(/[\r\n|]+/).filter((line) => line.trim() !== '');
        return lines.map(escapeHtml).join('<br />');
      }
      if (modifier === 'esc' || modifier === 'escaped') return escapeHtml(raw);
      return escapeAttr(raw);
    });
}

function renderImages(html, data) {
  return replaceAllTags(html, 'data-c-img', (openTag, path) => {
    const src = lookup(data, path);
    if (typeof src !== 'string' || !src) {
      warnings.push(`imagem "${path}" ausente ou vazia`);
      return openTag;
    }
    let tag = setAttribute(openTag, 'src', encodeUrlPath(src));
    const alt = lookup(data, `${path}Alt`);
    if (typeof alt === 'string') tag = setAttribute(tag, 'alt', alt);
    return tag;
  });
}

function renderVideos(html, data) {
  let out = replaceAllTags(html, 'data-c-video', (openTag, path) => {
    const src = lookup(data, path);
    if (typeof src !== 'string' || !src) {
      warnings.push(`video "${path}" ausente ou vazio`);
      return openTag;
    }
    return setAttribute(openTag, 'src', encodeUrlPath(src));
  });

  out = replaceAllTags(out, 'data-c-poster', (openTag, path) => {
    const src = lookup(data, path);
    return typeof src === 'string' && src ? setAttribute(openTag, 'poster', encodeUrlPath(src)) : openTag;
  });

  return out;
}

/** data-c-attr="href" + data-c="caminho" em qualquer elemento. */
function renderAttributes(html, data) {
  return replaceAllTags(html, 'data-c-attr', (openTag) => {
    const attrName = getAttr(openTag, 'data-c-attr');
    const path = getAttr(openTag, 'data-c');
    if (!attrName || !path) return openTag;

    const value = lookup(data, path);
    if (typeof value !== 'string' || !value) {
      warnings.push(`link "${path}" ausente ou vazio`);
      return removeAttr(removeAttr(openTag, 'data-c-attr'), 'data-c');
    }

    const safe = attrName.toLowerCase() === 'href' ? sanitizeHref(value) : value;
    let tag = setAttribute(openTag, attrName, safe);
    tag = removeAttr(tag, 'data-c-attr');
    return removeAttr(tag, 'data-c');
  });
}

/**
 * Listas: <ul data-c-repeat="caminho"><template data-c-item>…</template></ul>
 *
 * Todo o conteudo estatico do container e substituido pelos itens gerados.
 * Elementos marcados com data-c-keep sao preservados, o que permite repetir
 * apenas os filhos de uma lista sem perder um titulo ao lado.
 *
 * Caminhos podem ser absolutos (a.b.c) ou relativos ao item pai, o que
 * permite aninhar listas como a de inclusoes de cada pacote.
 */
function renderLists(html, data, prefix = '') {
  return replaceAllElements(html, 'data-c-repeat', (el) => {
    const raw = getAttr(el.openTag, 'data-c-repeat');
    const path = prefix ? `${prefix}.${raw}` : raw;
    const items = lookup(data, path);

    if (!Array.isArray(items)) {
      warnings.push(`lista "${path}" ausente ou nao e uma lista`);
      return { openTag: removeAttr(el.openTag, 'data-c-repeat'), inner: '' };
    }

    const tpl = extractItemTemplate(el.inner);
    if (!tpl) {
      warnings.push(`lista "${path}" sem <template data-c-item>`);
      return { openTag: removeAttr(el.openTag, 'data-c-repeat'), inner: '' };
    }

    const dot = getAttr(el.openTag, 'data-c-dot');
    const suffix = dot === null ? '' : resolveDot(dot);
    const join = getAttr(el.openTag, 'data-c-join') === 'br' ? '<br />' : '';

    const parts = items.map((item, i) => {
      const body = renderItemTemplate(tpl.body, item, i, suffix, items.length);
      return renderLists(body, data, `${path}.${i}`);
    });

    const rendered = parts.join(join);
    const keep = (chunk) => chunk.replace(/\sdata-c-keep(="")?/g, '');

    let openTag = removeAttr(el.openTag, 'data-c-repeat');
    openTag = removeAttr(openTag, 'data-c-dot');
    openTag = removeAttr(openTag, 'data-c-join');
    openTag = removeAttr(openTag, 'data-c-item');

    return { openTag, inner: keep(tpl.before) + rendered + keep(tpl.after) };
  });
}

/** Texto simples: <h2 data-c="secao.titulo" data-c-dot=".">…</h2> */
function renderText(html, data) {
  return replaceAllElements(html, 'data-c', (el) => {
    const path = getAttr(el.openTag, 'data-c');
    const value = lookup(data, path);

    if (/<[a-zA-Z][\w:-]*[^>]*\sdata-c(?:-[a-z]+)?="/.test(el.inner)) {
      warnings.push(`texto "${path}" contem outros campos editaveis; o pai foi ignorado`);
      return el;
    }

    if (typeof value !== 'string') {
      if (value !== undefined) warnings.push(`texto "${path}" nao e um texto simples`);
      return { openTag: removeAttr(el.openTag, 'data-c'), inner: value === undefined || value === null ? el.inner : escapeHtml(value) };
    }

    const dot = getAttr(el.openTag, 'data-c-dot');
    let openTag = removeAttr(el.openTag, 'data-c');
    openTag = removeAttr(openTag, 'data-c-dot');

    return { openTag, inner: escapeHtml(value) + (dot === null ? '' : resolveDot(dot)) };
  });
}

function renderHtml(template, data) {
  let html = template;
  html = renderImages(html, data);
  html = renderVideos(html, data);
  html = renderAttributes(html, data);
  html = renderLists(html, data);
  html = renderText(html, data);
  return html;
}

/**
 * Remove os atributos de controle que sobraram no HTML final.
 *
 * O padrao aceita apenas `data-c` e `data-c-nome`: e preciso delimitar com o
 * hifen ou o fim do nome, senao `data-count` (dos contadores animados) seria
 * removido junto.
 */
function stripControlTags(html) {
  return html.replace(/\sdata-c(?:-[a-z]+)?=(?:"[^"]*"|'[^']*')/g, '');
}

/* ------------------------------------------------------------------ *
 * 5. Copia dos estaticos
 * ------------------------------------------------------------------ */

async function copyDir(from, to) {
  await mkdir(to, { recursive: true });
  const entries = await readdir(from, { withFileTypes: true });
  for (const entry of entries) {
    const src = join(from, entry.name);
    const dest = join(to, entry.name);
    if (entry.isDirectory()) await copyDir(src, dest);
    else await copyFile(src, dest);
  }
}

async function copyStatic() {
  for (const item of STATIC_ITEMS) {
    const from = join(ROOT, item);
    if (!existsSync(from)) continue;
    const info = await stat(from);
    if (info.isDirectory()) await copyDir(from, join(DIST, item));
    else await copyFile(from, join(DIST, item));
  }
}

/* ------------------------------------------------------------------ *
 * 6. Main
 * ------------------------------------------------------------------ */

async function main() {
  const data = await loadContent();
  const template = await readFile(TEMPLATE, 'utf8');
  const html = stripControlTags(renderHtml(template, data));

  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  await writeFile(join(DIST, 'index.html'), html, 'utf8');
  await copyStatic();

  if (warnings.length) {
    console.log(`\n  Avisos (${warnings.length}):`);
    for (const w of warnings) console.log(`   - ${w}`);
  }

  console.log(`\n  dist/index.html gerado (${(html.length / 1024).toFixed(1)} KB)\n`);
}

main().catch((err) => {
  console.error('\n  Erro no build:', err.message, '\n');
  process.exit(1);
});
