import { 
  INITIAL_ARTICLES, 
  INITIAL_DOCUMENTS, 
  INITIAL_COMPETITIONS, 
  INITIAL_TRIVIA_QUESTIONS, 
  INITIAL_PUBLIC_OPINIONS, 
  INITIAL_TASKS, 
  INITIAL_EVENTS, 
  INITIAL_NOTES, 
  INITIAL_TEMPLATES, 
  INITIAL_DRIVE_FILES, 
  INITIAL_STAFF_USERS, 
  INITIAL_AUDIT_LOGS 
} from '../data/seedData';
import { 
  Article, 
  OfficialDocument, 
  Competition, 
  CompetitionSubmission, 
  PublicOpinion, 
  Task, 
  WorkEvent, 
  Note, 
  TemplateDoc, 
  DriveFileItem, 
  StaffUser, 
  AuditLog 
} from '../types';
import {
  sortArticlesNewestFirst,
  sortDocumentsNewestFirst,
  sortCompetitionsNewestFirst,
  sortOpinionsNewestFirst,
  sortEventsNewestFirst
} from './dateUtils';

const STORAGE_KEYS = {
  ARTICLES: 'mttq_chanhhiep_articles_v2',
  DOCUMENTS: 'mttq_chanhhiep_documents_v2',
  COMPETITIONS: 'mttq_chanhhiep_competitions_v2',
  OPINIONS: 'mttq_chanhhiep_opinions_v2',
  TASKS: 'mttq_chanhhiep_tasks_v2',
  EVENTS: 'mttq_chanhhiep_events_v2',
  NOTES: 'mttq_chanhhiep_notes_v2',
  TEMPLATES: 'mttq_chanhhiep_templates_v2',
  SUBMISSIONS: 'mttq_chanhhiep_submissions_v2',
  DRIVE_FILES: 'mttq_chanhhiep_drive_v2',
  STAFF_USERS: 'mttq_chanhhiep_staff_users_v2',
  AUDIT_LOGS: 'mttq_chanhhiep_audit_logs_v2',
  CURRENT_USER: 'mttq_chanhhiep_current_user_v2',
  LAST_BACKUP_TIME: 'mttq_chanhhiep_last_backup_time'
};

// In-Memory Storage Cache to prevent redundant serialization & disk writes
const memoryCache = new Map<string, string>();

export function loadInitialData<T>(key: string, fallback: T): T {
  try {
    const cached = memoryCache.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    memoryCache.set(key, item);
    const parsed = JSON.parse(item);
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    return parsed;
  } catch (err) {
    console.warn(`[StorageEngine] Failed to load key "${key}", falling back:`, err);
    return fallback;
  }
}

function sanitizeForLocalStorage<T>(data: T): T {
  if (!data) return data;
  try {
    const str = JSON.stringify(data, (_key, value) => {
      if (typeof value === 'string' && value.startsWith('data:') && value.length > 30000) {
        return value.substring(0, 100) + '...[file_stored_in_google_drive]';
      }
      return value;
    });
    return JSON.parse(str);
  } catch {
    return data;
  }
}

export function saveStorageData<T>(key: string, data: T): void {
  try {
    const jsonStr = JSON.stringify(data);
    if (memoryCache.get(key) === jsonStr) {
      // Data unchanged, skip expensive localStorage writing
      return;
    }
    memoryCache.set(key, jsonStr);
    localStorage.setItem(key, jsonStr);
    localStorage.setItem(STORAGE_KEYS.LAST_BACKUP_TIME, new Date().toISOString());
  } catch (err) {
    console.warn(`[StorageEngine] Quota limit exceeded for key "${key}". Sanitizing large payloads...`, err);
    try {
      const sanitized = sanitizeForLocalStorage(data);
      const sanitizedStr = JSON.stringify(sanitized);
      memoryCache.set(key, sanitizedStr);
      localStorage.setItem(key, sanitizedStr);
      localStorage.setItem(STORAGE_KEYS.LAST_BACKUP_TIME, new Date().toISOString());
      console.log(`[StorageEngine] Saved sanitized payload for key "${key}" successfully.`);
    } catch (fallbackErr) {
      console.warn(`[StorageEngine] Secondary quota error for key "${key}". Clearing audit logs cache...`, fallbackErr);
      try {
        localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
        const sanitized = sanitizeForLocalStorage(data);
        const sanitizedStr = JSON.stringify(sanitized);
        memoryCache.set(key, sanitizedStr);
        localStorage.setItem(key, sanitizedStr);
      } catch (finalErr) {
        console.error(`[StorageEngine] Critical storage quota error for key "${key}":`, finalErr);
      }
    }
  }
}

export const AppStorageEngine = {
  KEYS: STORAGE_KEYS,

  getArticles: (): Article[] => {
    const raw = loadInitialData(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);
    const demoIds = new Set(['art-1', 'art-2', 'art-3', 'art-4', 'art-5', 'art-6', 'art-7', 'art-8']);
    const filtered = (raw || []).filter(a => a && a.id && !demoIds.has(a.id) && !a.slug?.startsWith('khu-pho-8-ban-giao-nha') && !a.title?.includes('Khu phố 8 bàn giao nhà Đại đoàn kết'));
    return sortArticlesNewestFirst(filtered);
  },
  saveArticles: (articles: Article[]) => {
    const demoIds = new Set(['art-1', 'art-2', 'art-3', 'art-4', 'art-5', 'art-6', 'art-7', 'art-8']);
    const filtered = (articles || []).filter(a => a && a.id && !demoIds.has(a.id) && !a.slug?.startsWith('khu-pho-8-ban-giao-nha') && !a.title?.includes('Khu phố 8 bàn giao nhà Đại đoàn kết'));
    saveStorageData(STORAGE_KEYS.ARTICLES, sortArticlesNewestFirst(filtered));
  },

  getDocuments: (): OfficialDocument[] => {
    const raw = loadInitialData(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    const demoIds = new Set(['doc-1', 'doc-2', 'doc-3', 'doc-4']);
    const filtered = (raw || []).filter(d => d && d.id && !demoIds.has(d.id));
    return sortDocumentsNewestFirst(filtered);
  },
  saveDocuments: (documents: OfficialDocument[]) => {
    const demoIds = new Set(['doc-1', 'doc-2', 'doc-3', 'doc-4']);
    const filtered = (documents || []).filter(d => d && d.id && !demoIds.has(d.id));
    saveStorageData(STORAGE_KEYS.DOCUMENTS, sortDocumentsNewestFirst(filtered));
  },

  getCompetitions: (): Competition[] => {
    const raw = loadInitialData(STORAGE_KEYS.COMPETITIONS, INITIAL_COMPETITIONS);
    // Ensure all INITIAL_COMPETITIONS are present
    const compMap = new Map<string, Competition>();
    INITIAL_COMPETITIONS.forEach(c => {
      if (c && c.id) compMap.set(c.id, c);
    });
    (raw || []).forEach(c => {
      if (c && c.id) {
        if (!compMap.has(c.id)) {
          compMap.set(c.id, c);
        } else {
          // Update with latest seed content if questions or rules are updated
          const existing = compMap.get(c.id)!;
          compMap.set(c.id, {
            ...existing,
            ...c,
            questions: c.questions && c.questions.length > 0 ? c.questions : existing.questions,
            rules: c.rules || existing.rules
          });
        }
      }
    });
    return sortCompetitionsNewestFirst(Array.from(compMap.values()));
  },
  saveCompetitions: (competitions: Competition[]) => {
    const filtered = (competitions || []).filter(c => c && c.id);
    saveStorageData(STORAGE_KEYS.COMPETITIONS, sortCompetitionsNewestFirst(filtered));
  },

  getOpinions: (): PublicOpinion[] => {
    const raw = loadInitialData(STORAGE_KEYS.OPINIONS, INITIAL_PUBLIC_OPINIONS);
    const filtered = (raw || []).filter(o => o && o.id);
    return sortOpinionsNewestFirst(filtered);
  },
  saveOpinions: (opinions: PublicOpinion[]) => {
    const filtered = (opinions || []).filter(o => o && o.id);
    saveStorageData(STORAGE_KEYS.OPINIONS, sortOpinionsNewestFirst(filtered));
  },

  getTasks: (): Task[] => {
    const raw = loadInitialData(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    return (raw || []).filter(t => t && t.id);
  },
  saveTasks: (tasks: Task[]) => {
    const filtered = (tasks || []).filter(t => t && t.id);
    saveStorageData(STORAGE_KEYS.TASKS, filtered);
  },

  getEvents: (): WorkEvent[] => {
    const raw = loadInitialData(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    const filtered = (raw || []).filter(e => e && e.id);
    return sortEventsNewestFirst(filtered);
  },
  saveEvents: (events: WorkEvent[]) => {
    const filtered = (events || []).filter(e => e && e.id);
    saveStorageData(STORAGE_KEYS.EVENTS, filtered);
  },

  getNotes: (): Note[] => {
    const raw = loadInitialData(STORAGE_KEYS.NOTES, INITIAL_NOTES);
    return (raw || []).filter(n => n && n.id);
  },
  saveNotes: (notes: Note[]) => {
    const filtered = (notes || []).filter(n => n && n.id);
    saveStorageData(STORAGE_KEYS.NOTES, filtered);
  },

  getTemplates: (): TemplateDoc[] => {
    const raw = loadInitialData(STORAGE_KEYS.TEMPLATES, INITIAL_TEMPLATES);
    return (raw || []).filter(t => t && t.id);
  },
  saveTemplates: (templates: TemplateDoc[]) => {
    const filtered = (templates || []).filter(t => t && t.id);
    saveStorageData(STORAGE_KEYS.TEMPLATES, filtered);
  },

  getSubmissions: (): CompetitionSubmission[] => {
    const raw = loadInitialData(STORAGE_KEYS.SUBMISSIONS, []);
    return (raw || []).filter(s => s && s.id);
  },
  saveSubmissions: (submissions: CompetitionSubmission[]) => {
    const filtered = (submissions || []).filter(s => s && s.id);
    saveStorageData(STORAGE_KEYS.SUBMISSIONS, filtered);
  },

  getDriveFiles: (): DriveFileItem[] => {
    const raw = loadInitialData(STORAGE_KEYS.DRIVE_FILES, INITIAL_DRIVE_FILES);
    return (raw || []).filter(f => f && f.id);
  },
  saveDriveFiles: (files: DriveFileItem[]) => {
    const filtered = (files || []).filter(f => f && f.id);
    saveStorageData(STORAGE_KEYS.DRIVE_FILES, filtered);
  },

  getStaffUsers: (): StaffUser[] => {
    const raw = loadInitialData(STORAGE_KEYS.STAFF_USERS, INITIAL_STAFF_USERS);
    return (raw || []).filter(u => u && u.id);
  },
  saveStaffUsers: (users: StaffUser[]) => {
    const filtered = (users || []).filter(u => u && u.id);
    saveStorageData(STORAGE_KEYS.STAFF_USERS, filtered);
  },

  getAuditLogs: (): AuditLog[] => {
    const raw = loadInitialData(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    return (raw || []).filter(l => l && l.id);
  },
  saveAuditLogs: (logs: AuditLog[]) => {
    const filtered = (logs || []).filter(l => l && l.id);
    saveStorageData(STORAGE_KEYS.AUDIT_LOGS, filtered);
  },

  getCurrentUser: (): StaffUser | null => {
    try {
      return loadInitialData<StaffUser | null>(STORAGE_KEYS.CURRENT_USER, null);
    } catch {
      return null;
    }
  },
  saveCurrentUser: (user: StaffUser | null) => saveStorageData(STORAGE_KEYS.CURRENT_USER, user),

  getLastBackupTime: (): string => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_BACKUP_TIME) || new Date().toISOString();
    } catch {
      return new Date().toISOString();
    }
  },

  // Export all application data as a JSON file backup
  exportFullDatabase: () => {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      source: 'MTTQ Phường Chánh Hiệp - Văn phòng số & Cổng thông tin',
      data: {
        articles: AppStorageEngine.getArticles(),
        documents: AppStorageEngine.getDocuments(),
        competitions: AppStorageEngine.getCompetitions(),
        opinions: AppStorageEngine.getOpinions(),
        tasks: AppStorageEngine.getTasks(),
        events: AppStorageEngine.getEvents(),
        notes: AppStorageEngine.getNotes(),
        templates: AppStorageEngine.getTemplates(),
        submissions: AppStorageEngine.getSubmissions(),
        driveFiles: AppStorageEngine.getDriveFiles(),
        staffUsers: AppStorageEngine.getStaffUsers(),
        auditLogs: AppStorageEngine.getAuditLogs(),
        currentUser: AppStorageEngine.getCurrentUser()
      }
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_mttq_chanhhiep_${new Date().toISOString().substring(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Import application data from JSON
  importDatabaseFromJson: (jsonText: string): boolean => {
    try {
      const parsed = JSON.parse(jsonText);
      const data = parsed.data || parsed;

      if (data.articles) AppStorageEngine.saveArticles(data.articles);
      if (data.documents) AppStorageEngine.saveDocuments(data.documents);
      if (data.competitions) AppStorageEngine.saveCompetitions(data.competitions);
      if (data.opinions) AppStorageEngine.saveOpinions(data.opinions);
      if (data.tasks) AppStorageEngine.saveTasks(data.tasks);
      if (data.events) AppStorageEngine.saveEvents(data.events);
      if (data.notes) AppStorageEngine.saveNotes(data.notes);
      if (data.templates) AppStorageEngine.saveTemplates(data.templates);
      if (data.submissions) AppStorageEngine.saveSubmissions(data.submissions);
      if (data.driveFiles) AppStorageEngine.saveDriveFiles(data.driveFiles);
      if (data.staffUsers) AppStorageEngine.saveStaffUsers(data.staffUsers);
      if (data.auditLogs) AppStorageEngine.saveAuditLogs(data.auditLogs);
      if (data.currentUser) AppStorageEngine.saveCurrentUser(data.currentUser);

      return true;
    } catch (err) {
      console.error('[StorageEngine] Error importing JSON backup:', err);
      return false;
    }
  },

  resetAllToDefaults: () => {
    localStorage.clear();
  }
};
