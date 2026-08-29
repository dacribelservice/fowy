/**
 * Expresión regular robusta para URLs de Instagram (Reels y Posts)
 */
export const INSTAGRAM_REEL_REGEX = /(?:instagram\.com\/(?:reel|reels|p)\/|instagr\.am\/(?:reel|reels|p)\/)([A-Za-z0-9_-]+)/i;

/**
 * Extrae el código corto único de 11 caracteres de Instagram
 */
export function extractInstagramShortcode(url: string): string | null {
  if (!url) return null;
  const match = url.match(INSTAGRAM_REEL_REGEX);
  return match ? match[1] : null;
}

/**
 * Normaliza cualquier enlace de Instagram a su formato canónico limpio
 */
export function sanitizeInstagramUrl(rawUrl: string): string {
  const shortcode = extractInstagramShortcode(rawUrl);
  if (!shortcode) throw new Error("URL de Instagram inválida. Debe ser un Reel o Publicación.");
  return `https://www.instagram.com/reel/${shortcode}/`;
}

/**
 * Genera la URL optimizada para renderizar en el Iframe seguro
 */
export function getInstagramEmbedUrl(rawOrCleanUrl: string): string {
  const shortcode = extractInstagramShortcode(rawOrCleanUrl);
  if (!shortcode) return "";
  return `https://www.instagram.com/reel/${shortcode}/embed/`;
}
