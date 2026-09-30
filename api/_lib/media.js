export const MEDIA_FOLDER = 'media';

export const MAX_UPLOAD_BYTES = 90 * 1024 * 1024;

export const ALLOWED_EXTENSIONS = /\.(jpe?g|png|webp|gif|avif|mp4|webm|mov)$/i;

/**
 * Normaliza o nome do arquivo enviado: tira acento e espaco, reduz a
 * caracteres seguros e mantem a extensao. O hash entra no build para que dois
 * uploads com o mesmo nome nao sobrescrevam um ao outro.
 */
export function safeFileName(name, hash) {
  const cut = name.lastIndexOf('.');
  // So aceite extensao de verdade: sem isso, "../../etc/passwd" produziria uma
  // extensao "./etc/passwd" e o caminho sairia com barras.
  const extension = cut > 0 && /^\.[a-z0-9]{2,5}$/i.test(name.slice(cut)) ? name.slice(cut).toLowerCase() : '';
  const base = extension === '' ? name : name.slice(0, cut);
  const slug = base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .toLowerCase();
  const safe = slug === '' ? 'arquivo' : slug;
  return hash ? `${safe}-${hash}${extension}` : `${safe}${extension}`;
}