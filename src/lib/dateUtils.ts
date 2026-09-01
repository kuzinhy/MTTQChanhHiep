import { 
  Article, 
  OfficialDocument, 
  Competition, 
  PublicOpinion, 
  Task, 
  WorkEvent 
} from '../types';

/**
 * Parse any date string format (ISO, YYYY-MM-DD, DD/MM/YYYY, etc.) or fallback ID timestamp to epoch ms.
 */
export function parseDateToTimestamp(dateStr?: string, fallbackId?: string): number {
  if (!dateStr && !fallbackId) return 0;
  
  if (dateStr) {
    const trimmed = dateStr.trim();
    
    // Format: DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
    const dmyMatch = trimmed.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
    if (dmyMatch) {
      const day = parseInt(dmyMatch[1], 10);
      const month = parseInt(dmyMatch[2], 10) - 1;
      const year = parseInt(dmyMatch[3], 10);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) return d.getTime();
    }

    // Standard ISO 8601 or YYYY-MM-DD
    const parsed = new Date(trimmed).getTime();
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }

  // Fallback: extract unix timestamp from ID (e.g. art-1740998372...)
  if (fallbackId) {
    const numMatch = fallbackId.match(/(\d{10,14})/);
    if (numMatch) {
      const ts = parseInt(numMatch[1], 10);
      if (ts > 1000000000) return ts;
    }
  }

  return 0;
}

/**
 * Sort articles strictly in descending order (newest publishDate / createdAt at the top).
 */
export function sortArticlesNewestFirst(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => {
    const tsA = Math.max(
      parseDateToTimestamp(a.publishDate, a.id),
      parseDateToTimestamp(a.createdAt, a.id)
    );
    const tsB = Math.max(
      parseDateToTimestamp(b.publishDate, b.id),
      parseDateToTimestamp(b.createdAt, b.id)
    );
    return tsB - tsA;
  });
}

/**
 * Sort official documents strictly by issue date newest first.
 */
export function sortDocumentsNewestFirst(docs: OfficialDocument[]): OfficialDocument[] {
  return [...docs].sort((a, b) => {
    const tsA = parseDateToTimestamp(a.issueDate, a.id);
    const tsB = parseDateToTimestamp(b.issueDate, b.id);
    return tsB - tsA;
  });
}

/**
 * Sort competitions with active / newest first.
 */
export function sortCompetitionsNewestFirst(comps: Competition[]): Competition[] {
  return [...comps].sort((a, b) => {
    // If one is ONGOING and another ENDED, ONGOING comes first
    if (a.status === 'ONGOING' && b.status !== 'ONGOING') return -1;
    if (a.status !== 'ONGOING' && b.status === 'ONGOING') return 1;

    const tsA = parseDateToTimestamp(a.startDate, a.id);
    const tsB = parseDateToTimestamp(b.startDate, b.id);
    return tsB - tsA;
  });
}

/**
 * Sort public opinions with newest at the top.
 */
export function sortOpinionsNewestFirst(opinions: PublicOpinion[]): PublicOpinion[] {
  return [...opinions].sort((a, b) => {
    const tsA = parseDateToTimestamp(a.createdAt, a.id);
    const tsB = parseDateToTimestamp(b.createdAt, b.id);
    return tsB - tsA;
  });
}

/**
 * Sort work events with upcoming / newest at the top.
 */
export function sortEventsNewestFirst(events: WorkEvent[]): WorkEvent[] {
  return [...events].sort((a, b) => {
    const tsA = parseDateToTimestamp(a.startTime, a.id);
    const tsB = parseDateToTimestamp(b.startTime, b.id);
    return tsB - tsA;
  });
}
