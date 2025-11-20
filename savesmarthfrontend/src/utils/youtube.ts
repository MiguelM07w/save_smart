/**
 * Extrae el ID de YouTube de una URL o devuelve el ID si ya está limpio
 * @param input - URL de YouTube o ID directo
 * @returns ID limpio de YouTube (11 caracteres)
 */
export const extractYoutubeId = (input: string): string => {
  if (!input) return '';

  // Remove whitespace
  const trimmed = input.trim();

  // If it's already just an ID (11 characters, alphanumeric with dash/underscore)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Try to extract from various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // If no pattern matches, return the trimmed input
  return trimmed;
};

/**
 * Genera la URL del thumbnail de un video de YouTube
 * @param youtubeId - ID del video o URL completa
 * @param quality - Calidad del thumbnail (default, mqdefault, hqdefault, sddefault, maxresdefault)
 * @returns URL del thumbnail
 */
export const getYoutubeThumbnail = (youtubeId: string, quality: 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault' = 'maxresdefault'): string => {
  const cleanId = extractYoutubeId(youtubeId);
  return `https://img.youtube.com/vi/${cleanId}/${quality}.jpg`;
};

/**
 * Genera la URL de embed de YouTube
 * @param youtubeId - ID del video o URL completa
 * @param autoplay - Si el video debe reproducirse automáticamente
 * @returns URL de embed
 */
export const getYoutubeEmbedUrl = (youtubeId: string, autoplay: boolean = false): string => {
  const cleanId = extractYoutubeId(youtubeId);
  return `https://www.youtube.com/embed/${cleanId}${autoplay ? '?autoplay=1' : ''}`;
};
