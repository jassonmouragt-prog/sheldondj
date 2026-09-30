const API = '/api';

const state = {
  files: [],
  activeId: null,
  doc: null,
  dirty: false
};

/* --------------------------------- rede --------------------------------- */

async function api(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    credentials: 'same-origin',
    headers: options.body ? { 'Content-Type': 'application/json' } : {},
    ...options
  });

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (response.status === 401) {
    showLogin();
    throw new Error(body?.error ?? 'nao autenticado');
  }
  if (!response.ok) throw new Error(body?.error ?? `erro ${response.status}`);
  return body;
}

const get = (path) => api(path);
const post = (path, body) => api(path, { method: 'POST', body: JSON.stringify(body) });
const put = (path, body) => api(path, { method: 'PUT', body: JSON.stringify(body) });

/* --------------------------------- avisos -------------------------------- */

let toastTimer = null;

function toast(message, isError = false) {
  document.querySelector('.toast')?.remove();
  const node = document.createElement('div');
  node.className = `toast${isError ? ' error' : ''}`;
  node.textContent = message;
  document.body.appendChild(node);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.remove(), isError ? 6000 : 3000);
}

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

function markDirty() {
  state.dirty = true;
  renderStatus();
}

function renderStatus() {
  const node = document.querySelector('#state');
  if (!node) return;
  node.textContent = state.dirty ? 'alteracoes nao salvas' : 'salvo';
  node.classList.toggle('dirty', state.dirty);
}

/* --------------------------------- login --------------------------------- */

function showLogin() {
  state.files = [];
  state.doc = null;
  state.dirty = false;
  document.querySelector('#login').classList.remove('hidden');
  document.querySelector('#panel').classList.add('hidden');
}

async function submitLogin(event) {
  event.preventDefault();
  const errorBox = document.querySelector('#login-error');
  errorBox.textContent = '';
  const button = document.querySelector('#login button');
  button.disabled = true;
  button.textContent = 'Entrando...';
  try {
    await post('/login', {
      email: document.querySelector('#email').value,
      password: document.querySelector('#password').value
    });
    document.querySelector('#password').value = '';
    await start();
  } catch (error) {
    errorBox.textContent = error.message;
  } finally {
    button.disabled = false;
    button.textContent = 'Entrar';
  }
}

async function logout() {
  if (state.dirty && !confirm('Ha alteracoes nao salvas. Sair mesmo assim?')) return;
  await post('/logout');
  showLogin();
}

async function start() {
  const session = await get('/session');
  state.files = session.files;
  document.querySelector('#login').classList.add('hidden');
  document.querySelector('#panel').classList.remove('hidden');

  const nav = document.querySelector('#nav');
  nav.replaceChildren();
  for (const file of state.files) {
    const button = el('button', '', file.label);
    button.addEventListener('click', () => selectFile(file.id));
    nav.appendChild(button);
  }
  await selectFile(state.files[0].id);
}

/* ------------------------------ formularios ------------------------------ */

function readFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = () => reject(new Error('falha ao ler o arquivo'));
    reader.readAsDataURL(file);
  });
}

function assetUrl(path) {
  return `/${String(path)
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`;
}

function renderMedia(path, kind, onChange) {
  const frame = el('div', 'media');

  const preview = kind === 'file' ? el('video', 'media-preview') : el('img', 'media-preview');
  preview.alt = '';
  preview.muted = true;
  if (path) preview.src = assetUrl(path);
  frame.appendChild(preview);

  const side = el('div', 'media-side');

  const text = el('input');
  text.type = 'text';
  text.value = path ?? '';
  text.placeholder = 'caminho dentro de media/';
  text.addEventListener('input', () => {
    if (text.value) preview.src = assetUrl(text.value);
    onChange(text.value);
  });
  side.appendChild(text);

  const choose = el('input');
  choose.type = 'file';
  choose.accept = kind === 'file' ? 'video/*' : 'image/*';
  choose.addEventListener('change', async () => {
    const file = choose.files?.[0];
    if (!file) return;
    choose.disabled = true;
    try {
      const result = await post('/upload', {
        name: file.name,
        dataBase64: await readFileToBase64(file)
      });
      text.value = result.path;
      preview.src = assetUrl(result.path);
      onChange(result.path);
      toast('Arquivo enviado');
    } catch (error) {
      toast(error.message, true);
    } finally {
      choose.disabled = false;
      choose.value = '';
    }
  });

  const browse = el('button', 'btn btn-sm', 'Ver arquivos');
  browse.type = 'button';
  browse.addEventListener('click', () => {
    openLibrary(kind, (chosen) => {
      text.value = chosen;
      preview.src = assetUrl(chosen);
      onChange(chosen);
    });
  });

  const actions = el('div', 'media-actions');
  actions.append(browse, choose);
  side.appendChild(actions);
  frame.appendChild(side);
  return frame;
}

function renderField(field, value, onChange) {
  const wrap = el('div', 'field');

  if (field.widget === 'list') return renderList(field, value, onChange);

  if (field.widget === 'image' || field.widget === 'file') {
    wrap.appendChild(el('label', null, field.label));
    wrap.appendChild(
      renderMedia(value ?? '', field.widget, (next) => {
        onChange(next);
        markDirty();
      })
    );
    if (field.hint) wrap.appendChild(el('div', 'hint', field.hint));
    return wrap;
  }

  if (field.widget === 'boolean') {
    const line = el('div', 'checkline');
    const input = el('input');
    input.type = 'checkbox';
    input.checked = Boolean(value);
    input.addEventListener('change', () => {
      onChange(input.checked);
      markDirty();
    });
    line.append(input, el('label', null, field.label));
    wrap.appendChild(line);
    return wrap;
  }

  if (field.widget === 'select') {
    wrap.appendChild(el('label', null, field.label));
    const select = el('select');
    for (const option of field.options ?? []) {
      const node = el('option', null, option.label);
      node.value = option.value;
      if (option.value === value) node.selected = true;
      select.appendChild(node);
    }
    select.addEventListener('change', () => {
      onChange(select.value);
      markDirty();
    });
    wrap.appendChild(select);
    return wrap;
  }

  wrap.appendChild(el('label', null, field.label));

  if (field.widget === 'text') {
    const area = el('textarea');
    area.value = value ?? '';
    area.addEventListener('input', () => {
      onChange(area.value);
      markDirty();
    });
    wrap.appendChild(area);
  } else if (field.widget === 'number') {
    const input = el('input');
    input.type = 'number';
    input.value = value ?? 0;
    input.addEventListener('input', () => {
      onChange(input.value === '' ? 0 : Number(input.value));
      markDirty();
    });
    wrap.appendChild(input);
  } else {
    const input = el('input');
    input.type = 'text';
    input.value = value ?? '';
    input.addEventListener('input', () => {
      onChange(input.value);
      markDirty();
    });
    wrap.appendChild(input);
  }

  if (field.hint) wrap.appendChild(el('div', 'hint', field.hint));
  return wrap;
}

function renderList(field, value, onChange) {
  const wrap = el('fieldset');
  wrap.appendChild(el('legend', null, field.label));

  const items = Array.isArray(value) ? value : [];
  const scalar = field.field && field.field.widget !== 'object' && field.field.widget !== 'group';
  const holder = el('div');

  const emit = () => {
    onChange(holder.__items);
    markDirty();
  };

  const addItem = () => {
    if (scalar) return items.push('');
    const template = field.fields ?? field.field?.fields ?? [];
    return items.push(buildObject(template));
  };

  const buildObject = (fields) => {
    const item = {};
    for (const sub of fields) {
      if (sub.widget === 'list') item[sub.name] = [];
      else if (sub.widget === 'group' || sub.widget === 'object') item[sub.name] = buildObject(sub.fields ?? []);
      else if (sub.widget === 'boolean') item[sub.name] = false;
      else if (sub.widget === 'number') item[sub.name] = 0;
      else item[sub.name] = '';
    }
    return item;
  };

  const draw = () => {
    holder.replaceChildren();
    holder.__items = items;

    items.forEach((item, index) => {
      if (scalar) {
        const row = el('div', 'scalar-row');
        const input = el('input');
        input.type = 'text';
        input.value = item ?? '';
        input.addEventListener('input', () => {
          items[index] = input.value;
          emit();
        });
        row.appendChild(input, removeButton(index));
        holder.appendChild(row);
        return;
      }

      const box = el('div', 'item');
      const head = el('div', 'item-head');
      head.append(el('span', 'index', String(index + 1).padStart(2, '0')), el('span', 'spacer'), removeButton(index));
      box.appendChild(head);

      const fields = field.fields ?? field.field?.fields ?? [];
      for (const sub of fields) {
        // Campos ocultos continuam no JSON: apenas nao viram controle. Como o
        // envio leva o documento inteiro, o valor deles e preservado.
        if (sub.hidden) continue;
        box.appendChild(
          renderField(sub, item[sub.name], (next) => {
            item[sub.name] = next;
            markDirty();
          })
        );
      }
      holder.appendChild(box);
    });

    const add = el('button', 'btn btn-sm', 'Adicionar');
    add.type = 'button';
    add.addEventListener('click', () => {
      addItem();
      draw();
      emit();
    });
    holder.appendChild(add);

    if (field.hint) wrap.appendChild(el('div', 'hint', field.hint));
  };

  const removeButton = (index) => {
    const button = el('button', 'btn btn-icon', 'Remover');
    button.type = 'button';
    button.addEventListener('click', () => {
      items.splice(index, 1);
      draw();
      emit();
    });
    return button;
  };

  draw();
  wrap.appendChild(holder);
  return wrap;
}

function renderDoc(doc) {
  const root = document.querySelector('#doc');
  root.replaceChildren();
  root.appendChild(el('h2', null, doc.label));
  root.appendChild(el('p', 'pathname', doc.path));

  const errorBox = el('div', 'note note-error hidden');
  root.appendChild(errorBox);

  for (const field of doc.fields) {
    if (field.hidden) continue;
    if (field.widget === 'group' || field.widget === 'object') {
      const section = el('fieldset');
      section.appendChild(el('legend', null, field.label));
      for (const sub of field.fields ?? []) {
        if (sub.hidden) continue;
        section.appendChild(
          renderField(sub, doc.data[field.name]?.[sub.name], (next) => {
            doc.data[field.name] = doc.data[field.name] ?? {};
            doc.data[field.name][sub.name] = next;
          })
        );
      }
      root.appendChild(section);
    } else {
      root.appendChild(
        renderField(field, doc.data[field.name], (next) => {
          doc.data[field.name] = next;
        })
      );
    }
  }

  const actions = el('div', 'actions');
  const save = el('button', 'btn btn-primary', 'Salvar e publicar');
  save.addEventListener('click', () => saveDoc(save, errorBox));
  actions.append(save);
  root.appendChild(actions);
}

/* ------------------------------ biblioteca ------------------------------ */

async function openLibrary(kind, onPick) {
  const modal = el('div', 'modal');
  const card = el('div', 'modal-card');
  const head = el('div', 'modal-head');
  head.append(el('h3', null, 'Arquivos em media/'), el('span', 'spacer'));

  const close = el('button', 'btn btn-sm', 'Fechar');
  close.addEventListener('click', () => modal.remove());
  head.appendChild(close);
  card.appendChild(head);

  const gallery = el('div', 'gallery');
  card.appendChild(gallery);
  modal.appendChild(card);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.remove();
  });
  document.body.appendChild(modal);

  let files = [];
  try {
    files = (await get('/upload')).files;
  } catch (error) {
    gallery.appendChild(el('div', 'empty', error.message));
    return;
  }

  if (files.length === 0) {
    gallery.appendChild(el('div', 'empty', 'Nenhum arquivo ainda. Envie um pelo campo.'));
    return;
  }

  for (const file of files) {
    const isVideo = /\.(mp4|webm|mov)$/i.test(file.path);
    if (kind === 'file' && !isVideo) continue;
    if (kind === 'image' && isVideo) continue;

    const button = el('button');
    if (isVideo) {
      const video = el('video');
      video.src = assetUrl(file.path);
      video.muted = true;
      button.appendChild(video);
    } else {
      const img = el('img');
      img.src = url;
      img.alt = '';
      button.appendChild(img);
    }
    button.appendChild(el('div', 'name', file.name));
    button.addEventListener('click', () => {
      modal.remove();
      onPick(file.path);
    });
    gallery.appendChild(button);
  }

  if (!gallery.children.length) gallery.appendChild(el('div', 'empty', 'Nenhum arquivo deste tipo.'));
}

/* --------------------------------- acoes --------------------------------- */

async function selectFile(id) {
  if (state.dirty && !confirm('Ha alteracoes nao salvas. Trocar de secao?')) return;
  for (const button of document.querySelectorAll('#nav button')) {
    button.classList.toggle('active', button.textContent === state.files.find((f) => f.id === id)?.label);
  }
  const doc = await get(`/content?id=${encodeURIComponent(id)}`);
  state.activeId = id;
  state.doc = doc;
  state.dirty = false;
  renderDoc(doc);
  renderStatus();
  window.scrollTo({ top: 0 });
}

async function saveDoc(button, errorBox) {
  errorBox.classList.add('hidden');
  button.disabled = true;
  button.textContent = 'Salvando...';
  try {
    await put('/content', { id: state.activeId, data: state.doc.data });
    state.dirty = false;
    renderStatus();
    toast('Salvo. O site atualiza em cerca de um minuto.');
  } catch (error) {
    errorBox.textContent = error.message;
    errorBox.classList.remove('hidden');
    errorBox.scrollIntoView({ block: 'center' });
  } finally {
    button.disabled = false;
    button.textContent = 'Salvar e publicar';
  }
}

/* --------------------------------- inicio -------------------------------- */

document.querySelector('#login-form').addEventListener('submit', submitLogin);
document.querySelector('#logout').addEventListener('click', logout);

window.addEventListener('beforeunload', (event) => {
  if (!state.dirty) return;
  event.preventDefault();
  event.returnValue = '';
});

start().catch(() => showLogin());