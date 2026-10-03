/**
 * Hybrid Reranker for AI Civic Assistant
 * Scores and re-ranks retrieved chunks based on exact entity match, official authority, semantic relevance, and freshness.
 */

import { AISource } from './types';

export interface ScoredSource {
  source: AISource;
  score: number; // 0 to 100
  breakdown: {
    entityMatch: number;
    officialAuthority: number;
    relevance: number;
    freshness: number;
  };
}

export class Reranker {
  public static rerank(sources: AISource[], query: string, entities: string[] = []): AISource[] {
    if (!sources || sources.length === 0) return [];

    const lowerQuery = (query || '').toLowerCase().trim();
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2);

    const scored = sources.map(src => {
      let entityScore = 0;
      let authorityScore = src.official ? 100 : 50;
      let relevanceScore = 0;
      let freshnessScore = 80;

      const titleLower = (src.name || '').toLowerCase();
      const snippetLower = (src.snippet || '').toLowerCase();

      // Entity Match
      entities.forEach(ent => {
        const entLower = ent.toLowerCase();
        if (titleLower.includes(entLower)) entityScore += 50;
        if (snippetLower.includes(entLower)) entityScore += 25;
      });
      entityScore = Math.min(100, entityScore);

      // Word Relevance
      queryWords.forEach(w => {
        if (titleLower.includes(w)) relevanceScore += 20;
        if (snippetLower.includes(w)) relevanceScore += 10;
      });
      relevanceScore = Math.min(100, relevanceScore);

      // Total Score
      const totalScore = (entityScore * 0.35) + (authorityScore * 0.35) + (relevanceScore * 0.20) + (freshnessScore * 0.10);

      return {
        source: src,
        score: totalScore,
        breakdown: {
          entityMatch: entityScore,
          officialAuthority: authorityScore,
          relevance: relevanceScore,
          freshness: freshnessScore
        }
      };
    });

    // Sort descending by total score
    scored.sort((a, b) => b.score - a.score);

    // Return deduplicated sources
    const seenUrls = new Set<string>();
    const deduplicated: AISource[] = [];

    for (const item of scored) {
      const key = item.source.url || item.source.name;
      if (!seenUrls.has(key)) {
        seenUrls.add(key);
        deduplicated.push(item.source);
      }
    }

    return deduplicated;
  }
}
