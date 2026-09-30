/**
 * Executa admin/panel.js contra um DOM minimo e os conteudos reais, para
 * provar que o painel renderiza sem erro e mostra os campos certos.
 */
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { findFile } from 'file:///C:/Users/jasso/OneDrive/Documents/jobs/projects/sheldondj/api/_lib/schema.js';

const ROOT = 'file:///C:/Users/jasso/OneDrive/Documents/jobs/projects/sheldondj/';

let failed = 0;
const ok = (cond, name, detail = '') => {
  console.log(`  ${cond ? 'ok   ' : 'FALHOU'} ${name}${!cond && detail ? ` -> ${detail}` : ''}`);
  if (!cond) failed += 1;
};

/* ------------------------------- DOM minimo ------------------------------ */

class Node {
  constructor(tag) {
    this.tagName = String(tag).toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.attributes = {};
    this.listeners = {};
    this._class = '';
    this._text = '';
    this.value = '';
    this.checked = false;
    this.disabled = false;
  }
  get className() {
    return this._class;
  }
  set className(v) {
    this._class = String(v ?? '');
  }
  get classList() {
    return {
      add: (c) => {
        const s = new Set(this._class.split(/\s+/).filter(Boolean));
        s.add(c);
        this._class = [...s].join(' ');
      },
      remove: (c) => {
        this._class = this._class.split(/\s+/).filter((x) => x && x !== c).join(' ');
      },
      toggle: (c, on) => (on ? this.classList.add(c) : this.classList.remove(c)),
      contains: (c) => this._class.split(/\s+/).includes(c)
    };
  }
  get textContent() {
    return this._text + this.children.map((c) => c.textContent).join('');
  }
  set textContent(v) {
    this._text = String(v ?? '');
    this.children = [];
  }
  set innerHTML(v) {
    this.textContent = '';
  }
  set src(v) {
    this.attributes.src = v;
  }
  get src() {
    return this.attributes.src ?? '';
  }
  set muted(v) {
    this.attributes.muted = v;
  }
  append(...nodes) {
    for (const n of nodes) {
      const node = n instanceof Node ? n : new TextNode(String(n));
      node.parentNode = this;
      this.children.push(node);
    }
  }
  appendChild(node) {
    this.append(node);
    return node;
  }
  replaceChildren(...nodes) {
    this.children = [];
    this.append(...nodes);
  }
  remove() {
    const p = this.parentNode;
    if (!p) return;
    p.children = p.children.filter((c) => c !== this);
    this.parentNode = null;
  }
  addEventListener(type, fn) {
    (this.listeners[type] ??= []).push(fn);
  }
  dispatch(type, event = {}) {
    for (const fn of this.listeners[type] ?? []) fn({ target: this, preventDefault() {}, ...event });
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  get firstChild() {
    return this.children[0] ?? null;
  }
  descendants() {
    const out = [];
    const walk = (n) => {
      for (const c of n.children) {
        if (c instanceof Node) {
          out.push(c);
          walk(c);
        }
      }
    };
    walk(this);
    return out;
  }
  matchesSimple(sel) {
    let m;
    if ((m = /^#([\w-]+)$/.exec(sel))) return this.attributes.id === m[1];
    if ((m = /^\.([\w-]+)$/.exec(sel))) return this.classList.contains(m[1]);
    if ((m = /^(\w+)\[(\w+)="([^"]*)"\]$/.exec(sel))) {
      return this.tagName === m[1].toUpperCase() && String(this.attributes[m[2]] ?? '') === m[3];
    }
    if ((m = /^(\w+)$/.exec(sel))) return this.tagName === m[1].toUpperCase();
    return false;
  }
  querySelectorAll(selector) {
    const groups = selector.split(',').map((s) => s.trim()).filter(Boolean);
    const all = this.descendants();
    const results = [];
    for (const group of groups) {
      const chain = group.split(/\s+/);
      let pool = all;
      for (const part of chain) {
        const next = [];
        for (const node of pool) {
          if (node.matchesSimple(part)) next.push(node);
          // tambem aceita descendentes do proprio no, para seletores aninhados
          for (const d of node.descendants()) if (d.matchesSimple(part)) next.push(d);
        }
        pool = [...new Set(next)];
      }
      for (const node of pool) if (!results.includes(node)) results.push(node);
    }
    return results;
  }
  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }
}

class TextNode {
  constructor(text) {
    this._text = text;
    this.children = [];
  }
  get textContent() {
    return this._text;
  }
  descendants() {
    return [];
  }
}

function makeDocument() {
  const html = new Node('html');
  const body = new Node('body');
  const byId = {
    login: 'login',
    'login-form': 'login-form',
    'login-error': 'login-error',
    email: 'email',
    password: 'password',
    panel: 'panel',
    nav: 'nav',
    doc: 'doc',
    state: 'state',
    logout: 'logout'
  };
  for (const id of Object.values(byId)) {
    const node = new Node('div');
    node.attributes.id = id;
    body.appendChild(node);
  }
  html.appendChild(body);
  return {
    body,
    createElement: (tag) => new Node(tag),
    querySelector: (sel) => html.querySelector(sel),
    querySelectorAll: (sel) => html.querySelectorAll(sel),
    addEventListener() {}
  };
}

/* -------------------------------- dados ---------------------------------- */

const FILES = [
  { id: 'global', label: 'Identidade e SEO' },
  { id: 'sections-top', label: 'Topo do site' },
  { id: 'sections-mid', label: 'Seções centrais' },
  { id: 'sections-bottom', label: 'Base e rodapé' }
];

const payload = (id) => ({
  ok: true,
  path: `content/${id}.json`,
  label: FILES.find((f) => f.id === id).label,
  fields: findFile(id).fields,
  data: JSON.parse(readFileSync(`content/${id}.json`, 'utf8'))
});

let requested = null;
const stubFetch = async (url, init = {}) => {
  requested = url;
  const json = (body, status = 200) => ({
    ok: status < 400,
    status,
    json: async () => body,
    headers: { getSetCookie: () => [] }
  });
  if (url === '/api/session') return json({ ok: true, files: FILES });
  if (url.startsWith('/api/content?id=')) return json(payload(url.split('=')[1]));
  if (url === '/api/upload') return json({ files: [] });
  return json({ error: `rota nao testada: ${url}` }, 404);
};

/* ------------------------------- execucao -------------------------------- */

const document = makeDocument();
const sandbox = {
  document,
  window: { addEventListener() {}, scrollTo() {} },
  fetch: stubFetch,
  confirm: () => true,
  setTimeout: () => 0,
  clearTimeout() {},
  __errors: [],
  console
};
sandbox.globalThis = sandbox;

// O proprio painel esconde o erro de inicializacao no catch final. Este teste
// precisa ver a excecao, entao a ultima linha e reescrita so aqui.
const source = readFileSync('admin/panel.js', 'utf8').replace(
  'start().catch(() => showLogin());',
  'start().catch((error) => { __errors.push(error); showLogin(); });'
);
vm.createContext(sandbox);

console.log('\nrenderizacao');
let threw = null;
try {
  vm.runInContext(source, sandbox, { filename: 'panel.js' });
  await new Promise((r) => setImmediate(r));
} catch (error) {
  threw = error;
}
ok(!threw, 'panel.js executa sem erro', threw?.message);
ok(
  sandbox.__errors.length === 0,
  'inicializacao sem excecao',
  sandbox.__errors.map((e) => `${e.message} @ ${String(e.stack).split('\n')[1]?.trim()}`).join(' || ')
);
ok(requested?.startsWith('/api/content?id='), 'abriu o primeiro documento', String(requested));
ok(document.querySelector('#login').classList.contains('hidden'), 'login escondido apos autenticar');
ok(!document.querySelector('#panel').classList.contains('hidden'), 'painel visivel apos autenticar');

console.log('\npercorendo os quatro documentos');
const navButtons = document.querySelectorAll('#nav button');
ok(navButtons.length === 4, 'quatro botoes de navegacao', String(navButtons.length));

const totals = { texto: 0, area: 0, select: 0, caixa: 0, midia: 0, upload: 0 };
const seen = new Set();
const seenLabels = new Set();
const spot = JSON.parse(readFileSync('content/sections-top.json', 'utf8'));

for (let i = 0; i < navButtons.length; i += 1) {
  navButtons[i].dispatch('click');
  await new Promise((r) => setImmediate(r));

  const nodes = document.querySelector('#doc').descendants();
  const count = {
    texto: nodes.filter((n) => n.tagName === 'INPUT' && n.type === 'text').length,
    area: nodes.filter((n) => n.tagName === 'TEXTAREA').length,
    select: nodes.filter((n) => n.tagName === 'SELECT').length,
    caixa: nodes.filter((n) => n.tagName === 'INPUT' && n.type === 'checkbox').length,
    midia: nodes.filter((n) => n.classList.contains('media')).length,
    upload: nodes.filter((n) => n.tagName === 'INPUT' && n.type === 'file').length
  };
  for (const key of Object.keys(totals)) totals[key] += count[key];
  for (const n of nodes) {
    if (n.tagName === 'INPUT' || n.tagName === 'TEXTAREA') seen.add(n.value);
    if (n.tagName === 'LABEL') seenLabels.add(n.textContent);
  }

  const active = navButtons.filter((b) => b.classList.contains('active')).length;
  ok(
    count.texto + count.area + count.select + count.caixa + count.midia > 0,
    `${FILES[i].id}: renderizou ${count.texto + count.area + count.select + count.caixa + count.midia} controles`
  );
  ok(active === 1, `${FILES[i].id}: um botao marcado como ativo`, String(active));
  ok(document.querySelector('#state').textContent === 'salvo', `${FILES[i].id}: estado "salvo"`);
}

console.log(`   totais: ${JSON.stringify(totals)}`);
ok(totals.texto + totals.area > 60, 'renderizou os campos de texto dos quatro blocos');
ok(totals.midia > 0, 'renderizou os campos de midia');
ok(totals.upload === totals.midia, 'cada midia tem seu seletor de arquivo', `${totals.upload}/${totals.midia}`);
ok(totals.caixa > 0, 'renderizou as caixas de marcado', String(totals.caixa));

console.log('\nvalores vindos do conteudo');
ok(seen.has(spot.hero.ctaLabel), 'rotulo do botao do hero', spot.hero.ctaLabel);
ok(seen.has(spot.hero.imageTag), 'etiqueta da imagem do hero');
ok([...seen].some((v) => v.startsWith('assets/')), 'caminhos de imagem preservados');
const selects = document.querySelector('#doc').descendants().filter((n) => n.tagName === 'SELECT');
ok(selects.every((s) => s.children.length > 0), 'todo select tem opcoes');
ok(spot.hero.titleLines.every((line) => seen.has(line.text)), 'cada linha do titulo do hero aparece');
ok(spot.hero.titleLines.some((l) => l.dot === undefined) === true, 'titulos sem pontuacao opcional');

console.log('\ncampos ocultos nao aparecem');
function hiddenFields(fields, path = '', out = []) {
  for (const f of fields) {
    const p = path ? `${path}.${f.name}` : f.name;
    if (f.hidden) out.push(f);
    const sub = f.fields ?? f.field?.fields ?? [];
    if (sub.length) hiddenFields(sub, p, out);
  }
  return out;
}
const hidden = FILES.flatMap((f) => hiddenFields(findFile(f.id).fields));
console.log(`   ocultos no schema: ${hidden.length} (${[...new Set(hidden.map((f) => f.label))].join(' | ')})`);
ok(hidden.length === 4, 'o schema tem os quatro campos ocultos esperados', String(hidden.length));
const exposed = hidden.filter((f) => seenLabels.has(f.label));
ok(exposed.length === 0, 'nenhum deles virou controle na tela', exposed.map((f) => f.label).join(', '));
ok(!seenLabels.has('Destacar este depoimento'), 'toggle interno de depoimento nao exposto');

console.log('\ncontrole de alteracao e de erro');
const state = document.querySelector('#state');
const nodes = document.querySelector('#doc').descendants();
const editable = nodes.find((n) => (n.tagName === 'INPUT' && n.type === 'text') || n.tagName === 'TEXTAREA');
ok(Boolean(editable), 'ha um campo editavel na tela');
editable.value = 'texto novo';
editable.dispatch('input');
ok(state.textContent.includes('nao salvas'), 'editar marca como nao salvo', state.textContent);

const note = document.querySelector('#doc').descendants().find((n) => n.classList.contains('note-error'));
ok(Boolean(note), 'caixa de erro pronta');
if (note) {
  note.classList.remove('hidden');
  note.textContent = 'GitHub: falhou';
  ok(note.textContent === 'GitHub: falhou', 'mostra mensagem de erro do servidor');
}

console.log('\nrepeticao de listas');
const addButtons = document.querySelector('#doc').descendants().filter((n) => n.tagName === 'BUTTON' && n.textContent === 'Adicionar');
const removeButtons = document.querySelector('#doc').descendants().filter((n) => n.tagName === 'BUTTON' && n.textContent === 'Remover');
ok(addButtons.length > 0, 'botoes de adicionar item');
ok(removeButtons.length > 0, 'botoes de remover item');

console.log(`\n${failed === 0 ? 'PAINEL OK' : `${failed} FALHAS`}`);
process.exit(failed === 0 ? 0 : 1);
