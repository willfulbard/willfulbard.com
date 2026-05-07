export type VideoPlatform = 'youtube' | 'instagram' | 'other';

export interface ParsedVideo {
  url: string;
  platform: VideoPlatform;
  thumbnailUrl?: string;
}

const YOUTUBE_RE =
  /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/;
const INSTAGRAM_RE = /(?:^|[^.])instagram\.com\//;

/**
 * Parse a video URL and return platform info plus an auto-generated thumbnail
 * URL when possible (YouTube only — Instagram requires a manual thumbnail).
 */
export function parseVideo(url: string): ParsedVideo {
  const yt = url.match(YOUTUBE_RE);
  if (yt) {
    const id = yt[1];
    return {
      url,
      platform: 'youtube',
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }
  if (INSTAGRAM_RE.test(url)) {
    return { url, platform: 'instagram' };
  }
  return { url, platform: 'other' };
}

export function platformLabel(platform: VideoPlatform): string {
  switch (platform) {
    case 'youtube':
      return 'YouTube';
    case 'instagram':
      return 'Instagram';
    default:
      return 'Watch';
  }
}
