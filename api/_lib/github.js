const API = 'https://api.github.com';

function env(name, fallback) {
  const value = process.env[name];
  if (!value) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Variavel de ambiente ausente: ${name}`);
  }
  return value;
}

export const REPO = env('GITHUB_REPO', 'jassonmouragt-prog/sheldondj');
export const BRANCH = env('GITHUB_BRANCH', 'main');

function headers() {
  return {
    Authorization: `Bearer ${env('GITHUB_TOKEN')}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
    'User-Agent': 'sheldon-admin'
  };
}

async function request(path, init) {
  const response = await fetch(`${API}${path}`, { ...init, headers: headers() });
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`Resposta inesperada do GitHub (${response.status}): ${text.slice(0, 200)}`);
  }
  if (!response.ok) {
    const reason = body?.message ?? `HTTP ${response.status}`;
    throw new Error(`GitHub: ${reason}`);
  }
  return body;
}

export async function readFile(path) {
  const body = await request(`/repos/${REPO}/contents/${path}?ref=${BRANCH}`);
  return {
    sha: body.sha,
    text: Buffer.from(body.content ?? '', 'base64').toString('utf8')
  };
}

/**
 * Grava um arquivo criando um commit. `sha` e obrigatorio em atualizacoes:
 * e ele que garante que ninguem sobrescreveu uma edicao concorrente.
 */
export async function writeFile(path, text, sha, message) {
  return request(`/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: Buffer.from(text, 'utf8').toString('base64'),
      branch: BRANCH,
      ...(sha ? { sha } : {})
    })
  });
}

export async function commitBinary(path, base64, message) {
  return request(`/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify({ message, content: base64, branch: BRANCH })
  });
}

export async function listFolder(path) {
  try {
    const body = await request(`/repos/${REPO}/contents/${path}?ref=${BRANCH}`);
    if (!Array.isArray(body)) return [];
    return body
      .filter((entry) => entry.type === 'file' && entry.name !== '.gitkeep')
      .map((entry) => ({ path: `${path}/${entry.name}`, name: entry.name }));
  } catch {
    return [];
  }
}