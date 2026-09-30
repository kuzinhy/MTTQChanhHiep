import { AISource } from './types';

export class SourceValidator {
  public static validateSources(sources: AISource[]): AISource[] {
    if (!sources || !Array.isArray(sources)) return [];

    const validated: AISource[] = [];
    const seenUrls = new Set<string>();

    for (const src of sources) {
      if (!src || !src.name) continue;
      const url = (src.url || '').trim();

      // Avoid duplicate URLs
      if (url && seenUrls.has(url)) continue;
      if (url) seenUrls.add(url);

      // Check if official source
      const isOfficial = src.official ?? (
        url.startsWith('/') ||
        url.includes('chanhhiep') ||
        url.includes('binhduong.gov.vn') ||
        url.includes('sjc.com.vn') ||
        url.includes('drive.google.com/drive/folders/1TNEc-8JYkF17R44igkinTIZAmFEjSmOL')
      );

      validated.push({
        name: src.name.trim(),
        url: url || '#',
        type: src.type || 'WEBSITE',
        official: isOfficial,
        updatedAt: src.updatedAt || new Date().toISOString().split('T')[0],
        snippet: src.snippet
      });
    }

    return validated;
  }
}
