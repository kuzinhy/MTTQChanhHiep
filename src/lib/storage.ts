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
  INITIAL_AUDIT_LOGS,
  INITIAL_MEMBER_ORGANIZATIONS,
  INITIAL_AREAS,
  INITIAL_ORGANIZATIONS
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
  AuditLog,
  AiChatLog,
  KnowledgeNote,
  MemberOrganization,
  MemberOrganizationNode,
  Area,
  AreaNode,
  Organization,
  OrganizationNode
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
  DELETED_DOCS: 'mttq_chanhhiep_deleted_docs_v2',
  COMPETITIONS: 'mttq_chanhhiep_competitions_v2',
  DELETED_COMPS: 'mttq_chanhhiep_deleted_comps_v2',
  OPINIONS: 'mttq_chanhhiep_opinions_v2',
  TASKS: 'mttq_chanhhiep_tasks_v2',
  EVENTS: 'mttq_chanhhiep_events_v2',
  DELETED_EVENTS: 'mttq_chanhhiep_deleted_events_v2',
  NOTES: 'mttq_chanhhiep_notes_v2',
  TEMPLATES: 'mttq_chanhhiep_templates_v2',
  SUBMISSIONS: 'mttq_chanhhiep_submissions_v2',
  DRIVE_FILES: 'mttq_chanhhiep_drive_v2',
  STAFF_USERS: 'mttq_chanhhiep_staff_users_v2',
  AUDIT_LOGS: 'mttq_chanhhiep_audit_logs_v2',
  CURRENT_USER: 'mttq_chanhhiep_current_user_v2',
  LAST_BACKUP_TIME: 'mttq_chanhhiep_last_backup_time',
  AI_CHATS: 'mttq_chanhhiep_ai_chats_v2',
  KNOWLEDGE_NOTES: 'mttq_chanhhiep_knowledge_notes_v2',
  MEMBER_ORGANIZATIONS: 'mttq_chanhhiep_member_orgs_v2',
  AREAS: 'mttq_chanhhiep_areas_v2',
  ORGANIZATIONS: 'mttq_chanhhiep_organizations_v2'
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

  getDeletedDocIds: (): Set<string> => {
    const raw = loadInitialData<string[]>(STORAGE_KEYS.DELETED_DOCS, []);
    return new Set(raw || []);
  },
  recordDeletedDocId: (id: string) => {
    if (!id) return;
    const current = AppStorageEngine.getDeletedDocIds();
    current.add(id);
    saveStorageData(STORAGE_KEYS.DELETED_DOCS, Array.from(current));
  },

  getDeletedCompIds: (): Set<string> => {
    const raw = loadInitialData<string[]>(STORAGE_KEYS.DELETED_COMPS, []);
    return new Set(raw || []);
  },
  recordDeletedCompId: (id: string) => {
    if (!id) return;
    const current = AppStorageEngine.getDeletedCompIds();
    current.add(id);
    saveStorageData(STORAGE_KEYS.DELETED_COMPS, Array.from(current));
  },

  getDocuments: (): OfficialDocument[] => {
    const raw = loadInitialData(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    const demoIds = new Set(['doc-1', 'doc-2', 'doc-3', 'doc-4']);
    const deletedIds = AppStorageEngine.getDeletedDocIds();

    const docMap = new Map<string, OfficialDocument>();
    INITIAL_DOCUMENTS.forEach(d => {
      if (d && d.id && !deletedIds.has(d.id)) {
        docMap.set(d.id, d);
      }
    });
    (raw || []).forEach(d => {
      if (d && d.id && !demoIds.has(d.id) && !deletedIds.has(d.id)) {
        docMap.set(d.id, { ...(docMap.get(d.id) || {}), ...d });
      }
    });
    return sortDocumentsNewestFirst(Array.from(docMap.values()));
  },
  saveDocuments: (documents: OfficialDocument[]) => {
    const demoIds = new Set(['doc-1', 'doc-2', 'doc-3', 'doc-4']);
    const deletedIds = AppStorageEngine.getDeletedDocIds();
    
    // Check if any existing documents were omitted (deleted)
    const currentDocs = loadInitialData<OfficialDocument[]>(STORAGE_KEYS.DOCUMENTS, []);
    const newDocIds = new Set((documents || []).map(d => d?.id).filter(Boolean));
    (currentDocs || []).forEach(d => {
      if (d && d.id && !newDocIds.has(d.id)) {
        AppStorageEngine.recordDeletedDocId(d.id);
      }
    });

    const filtered = (documents || []).filter(d => d && d.id && !demoIds.has(d.id) && !deletedIds.has(d.id));
    saveStorageData(STORAGE_KEYS.DOCUMENTS, sortDocumentsNewestFirst(filtered));
  },

  getCompetitions: (): Competition[] => {
    const raw = loadInitialData(STORAGE_KEYS.COMPETITIONS, INITIAL_COMPETITIONS);
    const deletedIds = AppStorageEngine.getDeletedCompIds();
    const compMap = new Map<string, Competition>();
    INITIAL_COMPETITIONS.forEach(c => {
      if (c && c.id && !deletedIds.has(c.id)) compMap.set(c.id, c);
    });
    (raw || []).forEach(c => {
      if (c && c.id && !deletedIds.has(c.id)) {
        if (!compMap.has(c.id)) {
          compMap.set(c.id, c);
        } else {
          const existing = compMap.get(c.id)!;
          compMap.set(c.id, {
            ...existing,
            ...c,
            bannerUrl: c.bannerUrl && c.bannerUrl.trim() !== '' ? c.bannerUrl : existing.bannerUrl,
            questions: c.questions && c.questions.length > 0 ? c.questions : existing.questions,
            rules: c.rules || existing.rules
          });
        }
      }
    });
    return sortCompetitionsNewestFirst(Array.from(compMap.values()));
  },
  saveCompetitions: (competitions: Competition[]) => {
    const deletedIds = AppStorageEngine.getDeletedCompIds();
    const currentComps = loadInitialData<Competition[]>(STORAGE_KEYS.COMPETITIONS, []);
    const newCompIds = new Set((competitions || []).map(c => c?.id).filter(Boolean));
    (currentComps || []).forEach(c => {
      if (c && c.id && !newCompIds.has(c.id)) {
        AppStorageEngine.recordDeletedCompId(c.id);
      }
    });

    const filtered = (competitions || []).filter(c => c && c.id && !deletedIds.has(c.id));
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

  getDeletedEventIds: (): Set<string> => {
    const raw = loadInitialData<string[]>(STORAGE_KEYS.DELETED_EVENTS, []);
    return new Set(raw || []);
  },
  recordDeletedEventId: (id: string) => {
    if (!id) return;
    const current = AppStorageEngine.getDeletedEventIds();
    current.add(id);
    saveStorageData(STORAGE_KEYS.DELETED_EVENTS, Array.from(current));
  },

  getEvents: (): WorkEvent[] => {
    const raw = loadInitialData(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    const deletedIds = AppStorageEngine.getDeletedEventIds();
    const eventMap = new Map<string, WorkEvent>();
    INITIAL_EVENTS.forEach(e => {
      if (e && e.id && !deletedIds.has(e.id)) {
        eventMap.set(e.id, e);
      }
    });
    (raw || []).forEach(e => {
      if (e && e.id && !deletedIds.has(e.id)) {
        eventMap.set(e.id, { ...(eventMap.get(e.id) || {}), ...e });
      }
    });
    return sortEventsNewestFirst(Array.from(eventMap.values()));
  },
  saveEvents: (events: WorkEvent[]) => {
    const deletedIds = AppStorageEngine.getDeletedEventIds();
    const currentEvs = loadInitialData<WorkEvent[]>(STORAGE_KEYS.EVENTS, []);
    const newEvIds = new Set((events || []).map(e => e?.id).filter(Boolean));
    (currentEvs || []).forEach(e => {
      if (e && e.id && !newEvIds.has(e.id)) {
        AppStorageEngine.recordDeletedEventId(e.id);
      }
    });

    const filtered = (events || []).filter(e => e && e.id && !deletedIds.has(e.id));
    saveStorageData(STORAGE_KEYS.EVENTS, sortEventsNewestFirst(filtered));
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

  getAiChats: (): AiChatLog[] => {
    return loadInitialData(STORAGE_KEYS.AI_CHATS, []);
  },
  saveAiChats: (chats: AiChatLog[]) => {
    saveStorageData(STORAGE_KEYS.AI_CHATS, chats || []);
  },

  getKnowledgeNotes: (): KnowledgeNote[] => {
    return loadInitialData(STORAGE_KEYS.KNOWLEDGE_NOTES, []);
  },
  saveKnowledgeNotes: (notes: KnowledgeNote[]) => {
    saveStorageData(STORAGE_KEYS.KNOWLEDGE_NOTES, notes || []);
  },

  // ==========================================
  // 1. QUẢN LÝ ĐỊA BÀN HÀNH CHÍNH (AREAS)
  // ==========================================
  getAreas: (): Area[] => {
    const raw = loadInitialData(STORAGE_KEYS.AREAS, INITIAL_AREAS);
    const areaMap = new Map<string, Area>();
    INITIAL_AREAS.forEach(a => {
      if (a && a.id) areaMap.set(a.id, a);
    });
    (raw || []).forEach(a => {
      if (a && a.id) {
        areaMap.set(a.id, { ...(areaMap.get(a.id) || {}), ...a });
      }
    });
    return Array.from(areaMap.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  saveAreas: (areas: Area[]) => {
    const filtered = (areas || []).filter(a => a && a.id);
    saveStorageData(STORAGE_KEYS.AREAS, filtered);
  },

  getAreaById: (id: string): Area | null => {
    const list = AppStorageEngine.getAreas();
    return list.find(a => a.id === id) || null;
  },

  addArea: (areaData: Omit<Area, 'id' | 'createdAt'> & Partial<Pick<Area, 'id' | 'createdAt'>>): Area => {
    const areas = AppStorageEngine.getAreas();
    const newArea: Area = {
      ...areaData,
      id: areaData.id || `area-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: areaData.createdAt || new Date().toISOString()
    };
    const updated = [...areas, newArea];
    AppStorageEngine.saveAreas(updated);
    return newArea;
  },

  updateArea: (id: string, updates: Partial<Area>): Area | null => {
    const areas = AppStorageEngine.getAreas();
    let updatedArea: Area | null = null;
    const nextList = areas.map(item => {
      if (item.id === id) {
        updatedArea = { ...item, ...updates, updatedAt: new Date().toISOString() };
        return updatedArea;
      }
      return item;
    });
    if (updatedArea) {
      AppStorageEngine.saveAreas(nextList);
    }
    return updatedArea;
  },

  deleteArea: (id: string, cascade: boolean = false): boolean => {
    const areas = AppStorageEngine.getAreas();
    const target = areas.find(a => a.id === id);
    if (!target) return false;

    if (cascade) {
      // Find all descendant IDs recursively
      const getDescendantIds = (parentId: string): string[] => {
        const children = areas.filter(a => a.parentId === parentId);
        return children.reduce<string[]>((acc, child) => {
          return [...acc, child.id, ...getDescendantIds(child.id)];
        }, []);
      };
      const idsToDelete = new Set([id, ...getDescendantIds(id)]);
      const nextList = areas.filter(a => !idsToDelete.has(a.id));
      AppStorageEngine.saveAreas(nextList);
    } else {
      // Re-parent direct children to null or target's parent
      const nextList = areas
        .filter(a => a.id !== id)
        .map(a => a.parentId === id ? { ...a, parentId: target.parentId || null } : a);
      AppStorageEngine.saveAreas(nextList);
    }
    return true;
  },

  getChildAreas: (parentId: string | null): Area[] => {
    const areas = AppStorageEngine.getAreas();
    return areas.filter(a => (parentId === null || parentId === undefined) ? !a.parentId : a.parentId === parentId);
  },

  getAreaTree: (): AreaNode[] => {
    const areas = AppStorageEngine.getAreas();
    const areaMap = new Map<string, AreaNode>();
    
    areas.forEach(a => {
      areaMap.set(a.id, { ...a, children: [] });
    });

    const roots: AreaNode[] = [];
    areas.forEach(a => {
      const node = areaMap.get(a.id);
      if (node) {
        if (a.parentId && areaMap.has(a.parentId)) {
          areaMap.get(a.parentId)!.children.push(node);
        } else {
          roots.push(node);
        }
      }
    });

    return roots;
  },

  // ==========================================
  // 2. QUẢN LÝ CÂY TỔ CHỨC CHÍNH TRỊ (ORGANIZATIONS)
  // ==========================================
  getOrganizations: (): Organization[] => {
    const raw = loadInitialData(STORAGE_KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS);
    const orgMap = new Map<string, Organization>();
    INITIAL_ORGANIZATIONS.forEach(o => {
      if (o && o.id) orgMap.set(o.id, o);
    });
    (raw || []).forEach(o => {
      if (o && o.id) {
        orgMap.set(o.id, { ...(orgMap.get(o.id) || {}), ...o });
      }
    });
    return Array.from(orgMap.values()).sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
  },

  saveOrganizations: (orgs: Organization[]) => {
    const filtered = (orgs || []).filter(o => o && o.id);
    saveStorageData(STORAGE_KEYS.ORGANIZATIONS, filtered);
  },

  getOrganizationById: (id: string): Organization | null => {
    const list = AppStorageEngine.getOrganizations();
    return list.find(o => o.id === id) || null;
  },

  addOrganization: (orgData: Omit<Organization, 'id' | 'createdAt'> & Partial<Pick<Organization, 'id' | 'createdAt'>>): Organization => {
    const orgs = AppStorageEngine.getOrganizations();
    
    // Resolve areaName if areaId provided
    let areaName = orgData.areaName;
    if (orgData.areaId && !areaName) {
      const area = AppStorageEngine.getAreaById(orgData.areaId);
      if (area) areaName = area.name;
    }

    const newOrg: Organization = {
      ...orgData,
      areaName,
      id: orgData.id || `org-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: orgData.createdAt || new Date().toISOString()
    };
    const updated = [...orgs, newOrg];
    AppStorageEngine.saveOrganizations(updated);
    return newOrg;
  },

  updateOrganization: (id: string, updates: Partial<Organization>): Organization | null => {
    const orgs = AppStorageEngine.getOrganizations();
    let updatedOrg: Organization | null = null;

    // Resolve areaName if areaId updated
    let areaName = updates.areaName;
    if (updates.areaId && !areaName) {
      const area = AppStorageEngine.getAreaById(updates.areaId);
      if (area) areaName = area.name;
    }

    const nextList = orgs.map(item => {
      if (item.id === id) {
        updatedOrg = { 
          ...item, 
          ...updates, 
          ...(areaName ? { areaName } : {}),
          updatedAt: new Date().toISOString() 
        };
        return updatedOrg;
      }
      return item;
    });

    if (updatedOrg) {
      AppStorageEngine.saveOrganizations(nextList);
    }
    return updatedOrg;
  },

  deleteOrganization: (id: string, cascade: boolean = false): boolean => {
    const orgs = AppStorageEngine.getOrganizations();
    const target = orgs.find(o => o.id === id);
    if (!target) return false;

    if (cascade) {
      const getDescendantIds = (parentId: string): string[] => {
        const children = orgs.filter(o => o.parentId === parentId);
        return children.reduce<string[]>((acc, child) => {
          return [...acc, child.id, ...getDescendantIds(child.id)];
        }, []);
      };
      const idsToDelete = new Set([id, ...getDescendantIds(id)]);
      const nextList = orgs.filter(o => !idsToDelete.has(o.id));
      AppStorageEngine.saveOrganizations(nextList);
    } else {
      const nextList = orgs
        .filter(o => o.id !== id)
        .map(o => o.parentId === id ? { ...o, parentId: target.parentId || null } : o);
      AppStorageEngine.saveOrganizations(nextList);
    }
    return true;
  },

  getOrganizationsByParent: (parentId: string | null): Organization[] => {
    const orgs = AppStorageEngine.getOrganizations();
    return orgs.filter(o => (parentId === null || parentId === undefined) ? !o.parentId : o.parentId === parentId);
  },

  getOrganizationsByArea: (areaId: string): Organization[] => {
    const orgs = AppStorageEngine.getOrganizations();
    return orgs.filter(o => o.areaId === areaId);
  },

  getOrganizationTree: (rootParentId: string | null = null): OrganizationNode[] => {
    const orgs = AppStorageEngine.getOrganizations();
    const areas = AppStorageEngine.getAreas();
    const areaMap = new Map<string, Area>(areas.map(a => [a.id, a]));

    const nodeMap = new Map<string, OrganizationNode>();
    orgs.forEach(o => {
      nodeMap.set(o.id, { 
        ...o, 
        children: [],
        area: o.areaId ? areaMap.get(o.areaId) : undefined 
      });
    });

    // Populate parent references & hierarchy
    const roots: OrganizationNode[] = [];
    orgs.forEach(o => {
      const node = nodeMap.get(o.id);
      if (node) {
        if (o.parentId && nodeMap.has(o.parentId)) {
          const parentNode = nodeMap.get(o.parentId)!;
          node.parent = parentNode;
          parentNode.children.push(node);
        } else if (rootParentId === null || o.parentId === rootParentId) {
          roots.push(node);
        }
      }
    });

    return roots;
  },

  getOrganizationBreadcrumb: (orgId: string): Organization[] => {
    const orgs = AppStorageEngine.getOrganizations();
    const orgMap = new Map<string, Organization>(orgs.map(o => [o.id, o]));
    const breadcrumb: Organization[] = [];
    let curr: Organization | undefined = orgMap.get(orgId);
    
    while (curr) {
      breadcrumb.unshift(curr);
      curr = curr.parentId ? orgMap.get(curr.parentId) : undefined;
    }
    return breadcrumb;
  },

  moveOrganization: (orgId: string, newParentId: string | null): boolean => {
    // Prevent self or circular parenting
    if (orgId === newParentId) return false;
    const orgs = AppStorageEngine.getOrganizations();
    
    // Check circular
    if (newParentId) {
      let checkCurr: Organization | undefined = orgs.find(o => o.id === newParentId);
      while (checkCurr) {
        if (checkCurr.id === orgId) return false; // Circular loop detected!
        checkCurr = checkCurr.parentId ? orgs.find(o => o.id === checkCurr!.parentId) : undefined;
      }
    }

    return AppStorageEngine.updateOrganization(orgId, { parentId: newParentId }) !== null;
  },

  // ==========================================
  // 3. QUẢN LÝ CÂY TỔ CHỨC THÀNH VIÊN (MEMBER ORGANIZATIONS)
  // ==========================================
  getMemberOrganizations: (): MemberOrganization[] => {
    const raw = loadInitialData(STORAGE_KEYS.MEMBER_ORGANIZATIONS, INITIAL_MEMBER_ORGANIZATIONS);
    const orgMap = new Map<string, MemberOrganization>();
    INITIAL_MEMBER_ORGANIZATIONS.forEach(o => {
      if (o && o.id) orgMap.set(o.id, o);
    });
    (raw || []).forEach(o => {
      if (o && o.id) {
        orgMap.set(o.id, { ...(orgMap.get(o.id) || {}), ...o });
      }
    });
    return Array.from(orgMap.values()).sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
  },

  saveMemberOrganizations: (orgs: MemberOrganization[]) => {
    const filtered = (orgs || []).filter(o => o && o.id);
    saveStorageData(STORAGE_KEYS.MEMBER_ORGANIZATIONS, filtered);
  },

  getMemberOrganizationById: (id: string): MemberOrganization | null => {
    const list = AppStorageEngine.getMemberOrganizations();
    return list.find(o => o.id === id) || null;
  },

  addMemberOrganization: (orgData: Omit<MemberOrganization, 'id' | 'createdAt'> & Partial<Pick<MemberOrganization, 'id' | 'createdAt'>>): MemberOrganization => {
    const orgs = AppStorageEngine.getMemberOrganizations();
    
    // Auto populate areaName
    let areaName = orgData.areaName;
    if (orgData.areaId && !areaName) {
      const area = AppStorageEngine.getAreaById(orgData.areaId);
      if (area) areaName = area.name;
    }

    const newOrg: MemberOrganization = {
      ...orgData,
      areaName,
      id: orgData.id || `mem-org-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: orgData.createdAt || new Date().toISOString()
    };
    const updated = [...orgs, newOrg];
    AppStorageEngine.saveMemberOrganizations(updated);
    return newOrg;
  },

  updateMemberOrganization: (id: string, updates: Partial<MemberOrganization>): MemberOrganization | null => {
    const orgs = AppStorageEngine.getMemberOrganizations();
    let updatedOrg: MemberOrganization | null = null;

    let areaName = updates.areaName;
    if (updates.areaId && !areaName) {
      const area = AppStorageEngine.getAreaById(updates.areaId);
      if (area) areaName = area.name;
    }

    const nextList = orgs.map(item => {
      if (item.id === id) {
        updatedOrg = { 
          ...item, 
          ...updates, 
          ...(areaName ? { areaName } : {}),
          updatedAt: new Date().toISOString() 
        };
        return updatedOrg;
      }
      return item;
    });

    if (updatedOrg) {
      AppStorageEngine.saveMemberOrganizations(nextList);
    }
    return updatedOrg;
  },

  deleteMemberOrganization: (id: string, cascade: boolean = false): boolean => {
    const orgs = AppStorageEngine.getMemberOrganizations();
    const target = orgs.find(o => o.id === id);
    if (!target) return false;

    if (cascade) {
      const getDescendantIds = (parentId: string): string[] => {
        const children = orgs.filter(o => o.parentId === parentId);
        return children.reduce<string[]>((acc, child) => {
          return [...acc, child.id, ...getDescendantIds(child.id)];
        }, []);
      };
      const idsToDelete = new Set([id, ...getDescendantIds(id)]);
      const nextList = orgs.filter(o => !idsToDelete.has(o.id));
      AppStorageEngine.saveMemberOrganizations(nextList);
    } else {
      const nextList = orgs
        .filter(o => o.id !== id)
        .map(o => o.parentId === id ? { ...o, parentId: target.parentId || null } : o);
      AppStorageEngine.saveMemberOrganizations(nextList);
    }
    return true;
  },

  getMemberOrganizationsByParent: (parentId: string | null): MemberOrganization[] => {
    const orgs = AppStorageEngine.getMemberOrganizations();
    return orgs.filter(o => (parentId === null || parentId === undefined) ? !o.parentId : o.parentId === parentId);
  },

  getMemberOrganizationsByArea: (areaId: string): MemberOrganization[] => {
    const orgs = AppStorageEngine.getMemberOrganizations();
    return orgs.filter(o => o.areaId === areaId);
  },

  getMemberOrganizationTree: (rootParentId: string | null = null): MemberOrganizationNode[] => {
    const orgs = AppStorageEngine.getMemberOrganizations();
    const areas = AppStorageEngine.getAreas();
    const areaMap = new Map<string, Area>(areas.map(a => [a.id, a]));

    const nodeMap = new Map<string, MemberOrganizationNode>();
    orgs.forEach(o => {
      nodeMap.set(o.id, { 
        ...o, 
        children: [],
        area: o.areaId ? areaMap.get(o.areaId) : undefined
      });
    });

    const roots: MemberOrganizationNode[] = [];
    orgs.forEach(o => {
      const node = nodeMap.get(o.id);
      if (node) {
        if (o.parentId && nodeMap.has(o.parentId)) {
          const parentNode = nodeMap.get(o.parentId)!;
          node.parent = parentNode;
          parentNode.children.push(node);
        } else if (rootParentId === null || o.parentId === rootParentId) {
          roots.push(node);
        }
      }
    });

    return roots;
  },

  getMemberOrganizationBreadcrumb: (orgId: string): MemberOrganization[] => {
    const orgs = AppStorageEngine.getMemberOrganizations();
    const orgMap = new Map<string, MemberOrganization>(orgs.map(o => [o.id, o]));
    const breadcrumb: MemberOrganization[] = [];
    let curr: MemberOrganization | undefined = orgMap.get(orgId);
    
    while (curr) {
      breadcrumb.unshift(curr);
      curr = curr.parentId ? orgMap.get(curr.parentId) : undefined;
    }
    return breadcrumb;
  },

  moveMemberOrganization: (orgId: string, newParentId: string | null): boolean => {
    if (orgId === newParentId) return false;
    const orgs = AppStorageEngine.getMemberOrganizations();
    if (newParentId) {
      let checkCurr: MemberOrganization | undefined = orgs.find(o => o.id === newParentId);
      while (checkCurr) {
        if (checkCurr.id === orgId) return false;
        checkCurr = checkCurr.parentId ? orgs.find(o => o.id === checkCurr!.parentId) : undefined;
      }
    }
    return AppStorageEngine.updateMemberOrganization(orgId, { parentId: newParentId }) !== null;
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
        memberOrganizations: AppStorageEngine.getMemberOrganizations(),
        areas: AppStorageEngine.getAreas(),
        organizations: AppStorageEngine.getOrganizations(),
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
      if (data.memberOrganizations) AppStorageEngine.saveMemberOrganizations(data.memberOrganizations);
      if (data.areas) AppStorageEngine.saveAreas(data.areas);
      if (data.organizations) AppStorageEngine.saveOrganizations(data.organizations);
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
