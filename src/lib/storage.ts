import { doc, setDoc, collection, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
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
import { INITIAL_MAP_LOCATIONS } from '../data/mapSeedData';
import { MapLocation } from '../data/mapSchema';
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
  OrganizationNode,
  NeighborhoodMigrationResult,
  CulturalMedia,
  ArticleSubmission,
  FeedbackItem,
  EmailNotification,
  SupervisionPlan,
  SupervisionOverviewStats,
  SupervisionCategory,
  LaunchPopupConfig
} from '../types';
import { DEFAULT_LAUNCH_POPUP_CONFIG } from '../data/launchPopupSeed';
import {
  INITIAL_HOUSEHOLDS,
  INITIAL_BROADCASTS,
  INITIAL_PETITIONS,
  INITIAL_REGISTRATIONS,
  NeighborhoodHousehold,
  NeighborhoodBroadcast,
  NeighborhoodPetition,
  NeighborhoodRegistration
} from '../data/neighborhoodManagementData';
import {
  sortArticlesNewestFirst,
  sortDocumentsNewestFirst,
  sortCompetitionsNewestFirst,
  sortOpinionsNewestFirst,
  sortEventsNewestFirst
} from './dateUtils';
import { getBannerForCategory } from '../utils/officialImages';
import { isFacebookCdnUrl } from './imageOptimization';

// ==========================================
// OFFLINE STORAGE & SMART CLOUD SYNC ENGINE
// ==========================================

export interface PendingSyncOperation {
  id: string;
  key: string;
  entityName: string;
  data: any;
  timestamp: string;
  retryCount: number;
  status: 'PENDING' | 'SYNCING' | 'FAILED' | 'COMPLETED';
}

export interface StorageSyncStatus {
  isOnline: boolean;
  pendingCount: number;
  syncState: 'IDLE' | 'SYNCING' | 'OFFLINE' | 'SYNC_ERROR' | 'SUCCESS';
  lastSyncedTime: string | null;
  lastError?: string;
  pendingSummary: { entityName: string; count: number }[];
}

export const STORAGE_KEYS = {
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
  MAP_LOCATIONS: 'mttq_chanhhiep_map_locations_v2',
  MEMBER_ORGANIZATIONS: 'mttq_chanhhiep_member_orgs_v5',
  AREAS: 'mttq_chanhhiep_areas_v3',
  ORGANIZATIONS: 'mttq_chanhhiep_organizations_v4',
  NEIGHBORHOODS_MIGRATION_V3: 'mttq_chanhhiep_migration_ward_only_v7',
  CULTURAL_MEDIA: 'mttq_chanhhiep_cultural_media_v1',
  VOLUNTEERS: 'mttq_chanhhiep_volunteers_v1',
  OFFLINE_QUEUE: 'mttq_chanhhiep_offline_queue_v1',
  ARTICLE_SUBMISSIONS: 'mttq_chanhhiep_article_submissions_v1',
  FEEDBACK: 'mttq_chanhhiep_feedback_v1',
  NOTIFICATIONS: 'mttq_chanhhiep_notifications_v1',
  EMAIL_LOGS: 'mttq_chanhhiep_email_logs_v1',
  NEIGHBORHOOD_HOUSEHOLDS: 'mttq_chanhhiep_households_v1',
  NEIGHBORHOOD_BROADCASTS: 'mttq_chanhhiep_broadcasts_v1',
  NEIGHBORHOOD_PETITIONS: 'mttq_chanhhiep_petitions_v1',
  NEIGHBORHOOD_REGISTRATIONS: 'mttq_chanhhiep_registrations_v1',
  URGENT_AID_REQUESTS: 'mttq_chanhhiep_urgent_aid_v1',
  DONATIONS: 'mttq_chanhhiep_donations_v1',
  SOLIDARITY_ASSESSMENTS: 'mttq_chanhhiep_solidarity_v1',
  SUPERVISION_PLANS: 'mttq_chanhhiep_supervision_plans_v2',
  SUPERVISION_STATS: 'mttq_chanhhiep_supervision_stats_v2',
  SUPERVISION_CATEGORIES: 'mttq_chanhhiep_supervision_categories_v2',
  LAUNCH_POPUP_CONFIG: 'mttq_chanhhiep_launch_popup_config_v1',
  LAUNCH_POPUP_DISMISSED: 'mttq_chanhhiep_launch_popup_dismissed_until',
  LAUNCH_POPUP_USER_CONGRATULATED: 'mttq_chanhhiep_launch_popup_user_congratulated'
};

const KEY_ENTITY_NAME_MAP: Record<string, string> = {
  [STORAGE_KEYS.ARTICLES]: 'Bài viết & Tin tức',
  [STORAGE_KEYS.DOCUMENTS]: 'Văn bản & Chỉ thị',
  [STORAGE_KEYS.COMPETITIONS]: 'Hội thi & Cuộc thi',
  [STORAGE_KEYS.OPINIONS]: 'Ý kiến Phản ánh Dân sinh',
  [STORAGE_KEYS.TASKS]: 'Công việc & Lịch trình',
  [STORAGE_KEYS.EVENTS]: 'Sự kiện & Lịch công tác',
  [STORAGE_KEYS.NOTES]: 'Ghi chú văn phòng',
  [STORAGE_KEYS.SUBMISSIONS]: 'Bài dự thi hội thi',
  [STORAGE_KEYS.DRIVE_FILES]: 'Tài liệu Google Drive',
  [STORAGE_KEYS.STAFF_USERS]: 'Cán bộ & Nhân sự',
  [STORAGE_KEYS.AUDIT_LOGS]: 'Nhật ký hệ thống',
  [STORAGE_KEYS.VOLUNTEERS]: 'Đăng ký Tình nguyện viên',
  [STORAGE_KEYS.CULTURAL_MEDIA]: 'Tư liệu Văn hóa',
  [STORAGE_KEYS.MEMBER_ORGANIZATIONS]: 'Tổ chức Thành viên',
  [STORAGE_KEYS.AREAS]: 'Khu phố (21 KP)',
  [STORAGE_KEYS.ORGANIZATIONS]: 'Tổ chức Chính trị',
  [STORAGE_KEYS.ARTICLE_SUBMISSIONS]: 'Tác phẩm cộng tác',
  [STORAGE_KEYS.FEEDBACK]: 'Ý kiến phản ánh dân nguyện',
  [STORAGE_KEYS.NEIGHBORHOOD_HOUSEHOLDS]: 'Hộ dân 21 Khu phố',
  [STORAGE_KEYS.NEIGHBORHOOD_BROADCASTS]: 'Phát thanh & Thông báo số khu phố',
  [STORAGE_KEYS.NEIGHBORHOOD_PETITIONS]: 'Phản ánh cấp khu phố',
  [STORAGE_KEYS.NEIGHBORHOOD_REGISTRATIONS]: 'Đăng ký cư dân khu phố',
  [STORAGE_KEYS.URGENT_AID_REQUESTS]: 'Yêu cầu Cứu trợ An sinh Khẩn cấp',
  [STORAGE_KEYS.DONATIONS]: 'Ủng hộ Quỹ An sinh Xã hội',
  [STORAGE_KEYS.SOLIDARITY_ASSESSMENTS]: 'Tự đánh giá Gia đình Đại đoàn kết',
  [STORAGE_KEYS.SUPERVISION_PLANS]: 'Kế hoạch Giám sát - Phản biện Xã hội',
  [STORAGE_KEYS.SUPERVISION_STATS]: 'Chỉ số Giám sát Xã hội',
  [STORAGE_KEYS.SUPERVISION_CATEGORIES]: 'Chuyên mục Giám sát - Phản biện',
  [STORAGE_KEYS.LAUNCH_POPUP_CONFIG]: 'Cấu hình Popup Chào Mừng Ra Mắt'
};

const FIRESTORE_COLLECTION_MAP: Record<string, string> = {
  [STORAGE_KEYS.ARTICLES]: 'articles',
  [STORAGE_KEYS.DOCUMENTS]: 'official_documents',
  [STORAGE_KEYS.COMPETITIONS]: 'competitions',
  [STORAGE_KEYS.OPINIONS]: 'public_opinions',
  [STORAGE_KEYS.TASKS]: 'tasks',
  [STORAGE_KEYS.LAUNCH_POPUP_CONFIG]: 'settings',
  [STORAGE_KEYS.SUPERVISION_PLANS]: 'supervision_plans',
  [STORAGE_KEYS.SUPERVISION_CATEGORIES]: 'supervision_categories',
  [STORAGE_KEYS.NEIGHBORHOOD_HOUSEHOLDS]: 'neighborhood_households',
  [STORAGE_KEYS.NEIGHBORHOOD_BROADCASTS]: 'neighborhood_broadcasts',
  [STORAGE_KEYS.NEIGHBORHOOD_PETITIONS]: 'neighborhood_petitions',
  [STORAGE_KEYS.NEIGHBORHOOD_REGISTRATIONS]: 'neighborhood_registrations',
  [STORAGE_KEYS.EVENTS]: 'work_events',
  [STORAGE_KEYS.NOTES]: 'notes',
  [STORAGE_KEYS.SUBMISSIONS]: 'competition_submissions',
  [STORAGE_KEYS.VOLUNTEERS]: 'volunteers',
  [STORAGE_KEYS.ARTICLE_SUBMISSIONS]: 'article_submissions',
  [STORAGE_KEYS.FEEDBACK]: 'feedback',
  [STORAGE_KEYS.CULTURAL_MEDIA]: 'cultural_media'
};

// Internal Sync Listeners & State
const syncListeners = new Set<(status: StorageSyncStatus) => void>();
let currentSyncState: 'IDLE' | 'SYNCING' | 'OFFLINE' | 'SYNC_ERROR' | 'SUCCESS' = typeof navigator !== 'undefined' && !navigator.onLine ? 'OFFLINE' : 'IDLE';
let lastSyncedTimestamp: string | null = null;
try {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    lastSyncedTimestamp = localStorage.getItem('mttq_chanhhiep_last_sync_time');
  }
} catch {
  lastSyncedTimestamp = null;
}
let lastSyncError: string | undefined = undefined;
let debouncedSyncTimeout: any = null;
let isEngineInitialized = false;

function getOfflineQueueFromStorage(): PendingSyncOperation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveOfflineQueueToStorage(queue: PendingSyncOperation[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
    notifySyncListeners();
  } catch (e) {
    console.warn('[StorageEngine] Failed to save offline queue:', e);
  }
}

function notifySyncListeners(): void {
  const queue = getOfflineQueueFromStorage();
  const pendingCount = queue.filter(op => op.status !== 'COMPLETED').length;
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  const countsMap = new Map<string, number>();
  queue.forEach(op => {
    if (op.status !== 'COMPLETED') {
      countsMap.set(op.entityName, (countsMap.get(op.entityName) || 0) + 1);
    }
  });

  const pendingSummary = Array.from(countsMap.entries()).map(([entityName, count]) => ({
    entityName,
    count
  }));

  const status: StorageSyncStatus = {
    isOnline,
    pendingCount,
    syncState: isOnline ? (pendingCount > 0 && currentSyncState === 'SYNCING' ? 'SYNCING' : currentSyncState) : 'OFFLINE',
    lastSyncedTime: lastSyncedTimestamp,
    lastError: lastSyncError,
    pendingSummary
  };

  syncListeners.forEach(listener => {
    try {
      listener(status);
    } catch (e) {
      console.error('[StorageEngine] Error in sync listener:', e);
    }
  });
}

function enqueueOfflineOperation(key: string, data: any): void {
  if (key === STORAGE_KEYS.CURRENT_USER || key === STORAGE_KEYS.LAST_BACKUP_TIME || key === STORAGE_KEYS.OFFLINE_QUEUE) {
    return;
  }

  const queue = getOfflineQueueFromStorage();
  const entityName = KEY_ENTITY_NAME_MAP[key] || key;

  const existingIdx = queue.findIndex(op => op.key === key && op.status !== 'SYNCING');
  const op: PendingSyncOperation = {
    id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    key,
    entityName,
    data,
    timestamp: new Date().toISOString(),
    retryCount: 0,
    status: 'PENDING'
  };

  if (existingIdx >= 0) {
    queue[existingIdx] = op;
  } else {
    queue.push(op);
  }

  saveOfflineQueueToStorage(queue);

  if (typeof navigator !== 'undefined' && navigator.onLine) {
    triggerDebouncedCloudPush();
  } else {
    currentSyncState = 'OFFLINE';
    notifySyncListeners();
  }
}

function triggerDebouncedCloudPush(): void {
  if (debouncedSyncTimeout) clearTimeout(debouncedSyncTimeout);
  debouncedSyncTimeout = setTimeout(() => {
    AppStorageEngine.processPendingQueue();
  }, 1000);
}

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

export function saveStorageData<T>(key: string, data: T, syncOffline = false): void {
  try {
    const jsonStr = JSON.stringify(data);
    if (memoryCache.get(key) === jsonStr) {
      return;
    }
    memoryCache.set(key, jsonStr);
    localStorage.setItem(key, jsonStr);
    localStorage.setItem(STORAGE_KEYS.LAST_BACKUP_TIME, new Date().toISOString());
    if (syncOffline) {
      enqueueOfflineOperation(key, data);
    }
  } catch (err) {
    console.warn(`[StorageEngine] Quota limit exceeded for key "${key}". Sanitizing large payloads...`, err);
    try {
      const sanitized = sanitizeForLocalStorage(data);
      const sanitizedStr = JSON.stringify(sanitized);
      memoryCache.set(key, sanitizedStr);
      localStorage.setItem(key, sanitizedStr);
      localStorage.setItem(STORAGE_KEYS.LAST_BACKUP_TIME, new Date().toISOString());
      if (syncOffline) {
        enqueueOfflineOperation(key, sanitized);
      }
      console.log(`[StorageEngine] Saved sanitized payload for key "${key}" successfully.`);
    } catch (fallbackErr) {
      console.warn(`[StorageEngine] Secondary quota error for key "${key}". Clearing audit logs cache...`, fallbackErr);
      try {
        localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
        const sanitized = sanitizeForLocalStorage(data);
        const sanitizedStr = JSON.stringify(sanitized);
        memoryCache.set(key, sanitizedStr);
        localStorage.setItem(key, sanitizedStr);
        if (syncOffline) {
          enqueueOfflineOperation(key, sanitized);
        }
      } catch (finalErr) {
        console.error(`[StorageEngine] Critical storage quota error for key "${key}":`, finalErr);
      }
    }
  }
}

// ==========================================
// CANONICAL CADRE / STAFF USER DEDUPLICATION & PRIVACY ENGINE
// ==========================================

export const isUserNguyenMinhHuy = (u?: StaffUser | null): boolean => {
  if (!u) return false;
  const email = (u.email || '').toLowerCase().trim();
  const name = (u.fullname || '').toLowerCase().trim();
  if (email === 'nguyenhuy.thudaumot@gmail.com' || email.includes('nguyenhuy.thudaumot')) return true;
  if (name.includes('nguyễn') && (name.includes('minh huy') || name.includes('huy'))) return true;
  return false;
};

export const isViewerBuiVanHuy = (viewer?: StaffUser | null): boolean => {
  if (!viewer) return false;
  const email = (viewer.email || '').toLowerCase().trim();
  const name = (viewer.fullname || '').toLowerCase().trim();
  if (email === 'buivanhuy0705@gmail.com' || email.includes('buivanhuy')) return true;
  if (name.includes('bùi') && name.includes('huy')) return true;
  return false;
};

export const canViewStaffUserInfo = (targetUser?: StaffUser | null, currentViewer?: StaffUser | null): boolean => {
  if (!targetUser) return false;
  // If target is NOT Nguyễn Minh Huy, anyone with access can view
  if (!isUserNguyenMinhHuy(targetUser)) return true;

  // Target IS Nguyễn Minh Huy:
  // 1. Only Bùi Văn Huy can view
  if (isViewerBuiVanHuy(currentViewer)) return true;

  // 2. Nguyễn Minh Huy himself can view his own account
  if (currentViewer && (currentViewer.id === targetUser.id || (currentViewer.email && currentViewer.email.toLowerCase() === targetUser.email.toLowerCase()))) {
    return true;
  }

  // Everyone else: HIDE!
  return false;
};

export const deduplicateStaffUsers = (users: StaffUser[]): StaffUser[] => {
  if (!Array.isArray(users)) return [];

  // 1. Remove accounts without valid email or empty email
  const withValidEmail = users.filter(u => {
    if (!u || !u.id) return false;
    const em = (u.email || '').trim().toLowerCase();
    return em.length > 3 && em.includes('@');
  });

  // 2. Group by email (01 email = exactly 01 user account)
  const map = new Map<string, StaffUser>();
  const roleWeights: Record<string, number> = {
    'SUPER_ADMIN': 100,
    'MTTQ_ADMIN': 90,
    'ADMIN': 80,
    'MANAGER': 70,
    'LEADER': 60,
    'EDITOR': 50,
    'STAFF': 40,
    'NEIGHBORHOOD_LEADER': 30
  };

  withValidEmail.forEach(u => {
    const emailKey = u.email.trim().toLowerCase();
    if (!map.has(emailKey)) {
      map.set(emailKey, u);
    } else {
      const existing = map.get(emailKey)!;
      const existingWeight = roleWeights[existing.role] || 0;
      const currentWeight = roleWeights[u.role] || 0;

      const isCanonicalId = u.id === 'staff-1' || u.id === 'staff-2' || u.id.startsWith('staff-kp-');
      const existingIsCanonical = existing.id === 'staff-1' || existing.id === 'staff-2' || existing.id.startsWith('staff-kp-');

      // Keep higher role or canonical ID, and merge profile attributes to keep the most complete data
      if (currentWeight > existingWeight || (isCanonicalId && !existingIsCanonical)) {
        map.set(emailKey, {
          ...existing,
          ...u,
          avatar: u.avatar || existing.avatar,
          fullname: u.fullname || existing.fullname,
          phone: u.phone || existing.phone,
          department: u.department || existing.department,
          position: u.position || existing.position,
          role: currentWeight >= existingWeight ? u.role : existing.role,
          active: u.active !== false && existing.active !== false
        });
      } else {
        // Keep existing but merge missing fields from u
        map.set(emailKey, {
          ...u,
          ...existing,
          avatar: existing.avatar || u.avatar,
          phone: existing.phone || u.phone,
          bio: existing.bio || u.bio
        });
      }
    }
  });

  return Array.from(map.values());
};

export const INITIAL_SUPERVISION_PLANS: SupervisionPlan[] = [
  {
    id: 'sp-1',
    code: 'KH-04/KH-MTTQ',
    title: 'Giám sát việc thực hiện các chính sách an sinh xã hội và trợ cấp người có công năm 2026',
    targetUnit: 'Bộ phận Lao động - Thương binh & Xã hội UBND Phường Chánh Hiệp',
    field: 'An sinh xã hội',
    timeframe: 'Quý II/2026',
    status: 'COMPLETED',
    leader: 'Đ/c Trần Thị Hoa - Chủ tịch MTTQ',
    recommendationsCount: 4,
    resultsSummary: 'Đã hoàn tất giám sát trực tiếp tại 21 khu phố. Phát hiện 100% hồ sơ chi trả đúng đối tượng, kiến nghị rút ngắn thời gian giải quyết hỗ trợ đột xuất xuống còn 3 ngày làm việc.',
    issuedDate: '2026-05-15',
    completedDate: '2026-06-25',
    participatingUnits: 'Ban Thanh tra Nhân dân & Trưởng Ban CTMT 21 Khu phố',
    feedbackResolutionRate: 100,
    createdAt: '2026-05-15T08:00:00Z',
    updatedAt: '2026-06-25T16:30:00Z'
  },
  {
    id: 'sp-2',
    code: 'KH-07/KH-MTTQ',
    title: 'Giám sát công tác tiếp công dân và giải quyết thủ tục hành chính tại bộ phận Một cửa',
    targetUnit: 'Bộ phận Tiếp nhận & Trả kết quả UBND Phường Chánh Hiệp',
    field: 'Cải cách hành chính',
    timeframe: 'Tháng 8/2026',
    status: 'IN_PROGRESS',
    leader: 'Đ/c Nguyễn Văn Hùng - Phó Chủ tịch MTTQ',
    recommendationsCount: 2,
    resultsSummary: 'Đang triển khai lấy ý kiến đánh giá trực tiếp của 300 lượt công dân đến giao dịch. Đã ghi nhận 95.8% mức độ hài lòng.',
    issuedDate: '2026-08-01',
    participatingUnits: 'Thành viên Ban Thường trực MTTQ & Ban TTND Phường',
    feedbackResolutionRate: 95,
    createdAt: '2026-08-01T08:30:00Z',
    updatedAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'sp-3',
    code: 'KH-11/KH-MTTQ',
    title: 'Giám sát tiến độ và chất lượng công trình nâng cấp hạ tầng thoát nước đường Chánh Hiệp 05',
    targetUnit: 'Ban Quản lý Dự án Đầu tư Xây dựng & Đơn vị Thi công',
    field: 'Đầu tư công cộng đồng',
    timeframe: 'Quý III - IV/2026',
    status: 'PLANNED',
    leader: 'Ban Thanh tra Nhân dân & Ban Giám sát ĐTCĐ',
    recommendationsCount: 0,
    resultsSummary: 'Kế hoạch đã ban hành và phân công Ban Giám sát Đầu tư của cộng đồng khu phố 3 và khu phố 4 cùng giám sát hiện trường.',
    issuedDate: '2026-08-20',
    participatingUnits: 'Ban Giám sát đầu tư của cộng đồng KP.3, KP.4',
    feedbackResolutionRate: 100,
    createdAt: '2026-08-20T09:00:00Z',
    updatedAt: '2026-08-20T09:00:00Z'
  }
];

export const INITIAL_SUPERVISION_STATS: SupervisionOverviewStats = {
  totalProgramsYear: 8,
  acceptanceRate: 100,
  cooperatingInspectorates: '21/21'
};

export const INITIAL_SUPERVISION_CATEGORIES: SupervisionCategory[] = [
  {
    id: 'cat-ansinh',
    name: 'An sinh xã hội & Chính sách',
    code: 'CM-ANSINH',
    description: 'Giám sát việc chi trả trợ cấp, chính sách người có công, bảo trợ xã hội và chăm lo hộ nghèo, khó khăn tại 21 khu phố.',
    responsibleUnit: 'Ban Thường trực MTTQ & Ban CTMT 21 Khu phố',
    iconName: 'heart',
    color: 'rose',
    active: true,
    order: 1
  },
  {
    id: 'cat-cchc',
    name: 'Cải cách hành chính & Một cửa',
    code: 'CM-CCHC',
    description: 'Giám sát công tác tiếp công dân, tinh thần trách nhiệm phục vụ và thời gian giải quyết thủ tục hành chính tại UBND Phường.',
    responsibleUnit: 'Ban Thường trực MTTQ & Ban Thanh tra Nhân dân',
    iconName: 'file-text',
    color: 'blue',
    active: true,
    order: 2
  },
  {
    id: 'cat-dtc',
    name: 'Đầu tư công & Hạ tầng đô thị',
    code: 'CM-DTC',
    description: 'Giám sát chất lượng, tiến độ và minh bạch tài chính các công trình nâng cấp hạ tầng, đường hẻm, thoát nước do nhân dân và nhà nước cùng làm.',
    responsibleUnit: 'Ban Giám sát Đầu tư của Cộng đồng & Ban TTND',
    iconName: 'building',
    color: 'emerald',
    active: true,
    order: 3
  },
  {
    id: 'cat-datdai',
    name: 'Quản lý đất đai & Trật tự xây dựng',
    code: 'CM-DATDAI',
    description: 'Giám sát việc cấp phép xây dựng, quản lý hành lang kênh rạch, công viên cây xanh và vệ sinh môi trường đô thị.',
    responsibleUnit: 'Ban Thường trực MTTQ & 21 Ban CTMT',
    iconName: 'map-pin',
    color: 'amber',
    active: true,
    order: 4
  },
  {
    id: 'cat-congvu',
    name: 'Đạo đức công vụ & Phòng chống tham nhũng',
    code: 'CM-CONGVU',
    description: 'Giám sát việc tu dưỡng, rèn luyện đạo đức lối sống của cán bộ, đảng viên, công chức tại nơi cư trú theo Quy định 124-QĐ/TW.',
    responsibleUnit: 'Ban Thường trực MTTQ & Cấp ủy chi bộ 21 Khu phố',
    iconName: 'shield',
    color: 'purple',
    active: true,
    order: 5
  },
  {
    id: 'cat-bttnd',
    name: 'Thanh tra Nhân dân cấp cơ sở',
    code: 'CM-BTTND',
    description: 'Giám sát việc thực hiện chính sách pháp luật, giải quyết khiếu nại tố cáo, quy chế dân chủ cơ sở theo Luật Thực hiện dân chủ ở cơ sở.',
    responsibleUnit: 'Ban Thanh tra Nhân dân Phường Chánh Hiệp',
    iconName: 'scale',
    color: 'indigo',
    active: true,
    order: 6
  },
  {
    id: 'cat-ytegdd',
    name: 'Giáo dục & Y tế cơ sở',
    code: 'CM-YTE-GD',
    description: 'Giám sát điều kiện cơ sở vật chất, an toàn thực phẩm trường học và chất lượng khám chữa bệnh tại Trạm Y tế Phường.',
    responsibleUnit: 'Ban Thường trực MTTQ & Ban TTND',
    iconName: 'sparkles',
    color: 'cyan',
    active: true,
    order: 7
  }
];

export const AppStorageEngine = {
  KEYS: STORAGE_KEYS,

  // ==========================================
  // SUPERVISION & SOCIAL CRITIQUE (GIÁM SÁT & PHẢN BIỆN)
  // ==========================================
  getSupervisionPlans: (): SupervisionPlan[] => {
    return loadInitialData<SupervisionPlan[]>(STORAGE_KEYS.SUPERVISION_PLANS, INITIAL_SUPERVISION_PLANS);
  },
  saveSupervisionPlans: (plans: SupervisionPlan[]) => {
    saveStorageData(STORAGE_KEYS.SUPERVISION_PLANS, plans);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mttq_supervision_updated', { detail: plans }));
    }
  },
  addSupervisionPlan: (plan: SupervisionPlan): SupervisionPlan => {
    const list = AppStorageEngine.getSupervisionPlans();
    const created: SupervisionPlan = {
      ...plan,
      id: plan.id || ('sp-' + Date.now()),
      createdAt: plan.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const nextList = [created, ...list];
    AppStorageEngine.saveSupervisionPlans(nextList);
    return created;
  },
  updateSupervisionPlan: (plan: SupervisionPlan): SupervisionPlan | null => {
    const list = AppStorageEngine.getSupervisionPlans();
    const idx = list.findIndex(p => p.id === plan.id);
    if (idx === -1) return null;
    const updated: SupervisionPlan = {
      ...list[idx],
      ...plan,
      updatedAt: new Date().toISOString()
    };
    list[idx] = updated;
    AppStorageEngine.saveSupervisionPlans([...list]);
    return updated;
  },
  deleteSupervisionPlan: (id: string): boolean => {
    const list = AppStorageEngine.getSupervisionPlans();
    const filtered = list.filter(p => p.id !== id);
    if (filtered.length === list.length) return false;
    AppStorageEngine.saveSupervisionPlans(filtered);
    return true;
  },
  getSupervisionStats: (): SupervisionOverviewStats => {
    return loadInitialData<SupervisionOverviewStats>(STORAGE_KEYS.SUPERVISION_STATS, INITIAL_SUPERVISION_STATS);
  },
  saveSupervisionStats: (stats: SupervisionOverviewStats) => {
    saveStorageData(STORAGE_KEYS.SUPERVISION_STATS, stats);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mttq_supervision_stats_updated', { detail: stats }));
    }
  },

  // SUPERVISION CATEGORIES (CHUYÊN MỤC GIÁM SÁT - PHẢN BIỆN)
  getSupervisionCategories: (): SupervisionCategory[] => {
    return loadInitialData<SupervisionCategory[]>(STORAGE_KEYS.SUPERVISION_CATEGORIES, INITIAL_SUPERVISION_CATEGORIES);
  },
  saveSupervisionCategories: (categories: SupervisionCategory[]) => {
    saveStorageData(STORAGE_KEYS.SUPERVISION_CATEGORIES, categories);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mttq_supervision_categories_updated', { detail: categories }));
    }
  },
  addSupervisionCategory: (category: SupervisionCategory): SupervisionCategory => {
    const list = AppStorageEngine.getSupervisionCategories();
    const created: SupervisionCategory = {
      ...category,
      id: category.id || ('cat-' + Date.now()),
      createdAt: category.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const nextList = [...list, created].sort((a, b) => (a.order || 0) - (b.order || 0));
    AppStorageEngine.saveSupervisionCategories(nextList);
    return created;
  },
  updateSupervisionCategory: (category: SupervisionCategory): SupervisionCategory | null => {
    const list = AppStorageEngine.getSupervisionCategories();
    const idx = list.findIndex(c => c.id === category.id);
    if (idx === -1) return null;
    const updated: SupervisionCategory = {
      ...list[idx],
      ...category,
      updatedAt: new Date().toISOString()
    };
    list[idx] = updated;
    const sorted = [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
    AppStorageEngine.saveSupervisionCategories(sorted);
    return updated;
  },
  deleteSupervisionCategory: (id: string): boolean => {
    const list = AppStorageEngine.getSupervisionCategories();
    const filtered = list.filter(c => c.id !== id);
    if (filtered.length === list.length) return false;
    AppStorageEngine.saveSupervisionCategories(filtered);
    return true;
  },

  getArticles: (): Article[] => {
    const raw = loadInitialData<Article[]>(STORAGE_KEYS.ARTICLES, []);
    const demoIds = new Set(['art-1', 'art-2', 'art-3', 'art-4', 'art-5', 'art-6', 'art-7', 'art-8']);
    const filtered = (raw || []).filter(a => a && a.id && !demoIds.has(a.id) && !a.id.startsWith('demo-') && !(a as any).isSample);
    const sanitized = filtered.map(a => {
      const imgStr = typeof a.featuredImage === 'string' ? a.featuredImage : a.featuredImage?.secureUrl || a.featuredImage?.url || '';
      if (!imgStr) {
        return {
          ...a,
          featuredImage: getBannerForCategory(a.category, a.title)
        };
      }
      return a;
    });
    return sortArticlesNewestFirst(sanitized);
  },
  saveArticles: (articles: Article[]) => {
    const demoIds = new Set(['art-1', 'art-2', 'art-3', 'art-4', 'art-5', 'art-6', 'art-7', 'art-8']);
    const filtered = (articles || []).filter(a => a && a.id && !demoIds.has(a.id) && !a.id.startsWith('demo-') && !(a as any).isSample);
    const sanitized = filtered.map(a => {
      const imgStr = typeof a.featuredImage === 'string' ? a.featuredImage : a.featuredImage?.secureUrl || a.featuredImage?.url || '';
      if (!imgStr) {
        return {
          ...a,
          featuredImage: getBannerForCategory(a.category, a.title)
        };
      }
      return a;
    });
    saveStorageData(STORAGE_KEYS.ARTICLES, sortArticlesNewestFirst(sanitized));
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
    const raw = loadInitialData<OfficialDocument[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    const deletedIds = AppStorageEngine.getDeletedDocIds();

    const filtered = (raw || []).filter(d => d && d.id && !deletedIds.has(d.id));
    return sortDocumentsNewestFirst(filtered);
  },
  saveDocuments: (documents: OfficialDocument[]) => {
    const deletedIds = AppStorageEngine.getDeletedDocIds();
    const filtered = (documents || []).filter(d => d && d.id && !deletedIds.has(d.id));
    saveStorageData(STORAGE_KEYS.DOCUMENTS, sortDocumentsNewestFirst(filtered));
  },

  getCompetitions: (): Competition[] => {
    const raw = loadInitialData<Competition[]>(STORAGE_KEYS.COMPETITIONS, []);
    const demoIds = new Set(['comp-1', 'comp-2', 'comp-3', 'comp-4']);
    const deletedIds = AppStorageEngine.getDeletedCompIds();
    const filtered = (raw || []).filter(c => c && c.id && !demoIds.has(c.id) && !deletedIds.has(c.id) && !c.id.startsWith('demo-'));
    return sortCompetitionsNewestFirst(filtered);
  },
  restoreDefaultCompetitions: (): Competition[] => {
    return [];
  },
  saveCompetitions: (competitions: Competition[]) => {
    const demoIds = new Set(['comp-1', 'comp-2', 'comp-3', 'comp-4']);
    const deletedIds = AppStorageEngine.getDeletedCompIds();
    const currentComps = loadInitialData<Competition[]>(STORAGE_KEYS.COMPETITIONS, []);
    const newCompIds = new Set((competitions || []).map(c => c?.id).filter(Boolean));
    (currentComps || []).forEach(c => {
      if (c && c.id && !newCompIds.has(c.id)) {
        AppStorageEngine.recordDeletedCompId(c.id);
      }
    });

    const filtered = (competitions || []).filter(c => c && c.id && !demoIds.has(c.id) && !deletedIds.has(c.id));
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
    const deduped = deduplicateStaffUsers(raw);
    if (deduped.length !== (raw || []).length) {
      try {
        saveStorageData(STORAGE_KEYS.STAFF_USERS, deduped);
      } catch {}
    }
    return deduped;
  },
  saveStaffUsers: (users: StaffUser[]) => {
    const deduped = deduplicateStaffUsers(users);
    saveStorageData(STORAGE_KEYS.STAFF_USERS, deduped);
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

  getCulturalMedia: (): CulturalMedia[] => {
    const raw = loadInitialData(STORAGE_KEYS.CULTURAL_MEDIA, []);
    return (raw || []).filter(m => m && m.id);
  },
  saveCulturalMedia: (media: CulturalMedia[]) => {
    const filtered = (media || []).filter(m => m && m.id);
    saveStorageData(STORAGE_KEYS.CULTURAL_MEDIA, filtered);
  },

  getArticleSubmissions: (): ArticleSubmission[] => {
    const raw = loadInitialData(STORAGE_KEYS.ARTICLE_SUBMISSIONS, []);
    return (raw || []).filter(s => s && s.id);
  },
  saveArticleSubmissions: (subs: ArticleSubmission[]) => {
    const filtered = (subs || []).filter(s => s && s.id);
    saveStorageData(STORAGE_KEYS.ARTICLE_SUBMISSIONS, filtered);
  },

  getFeedback: (): FeedbackItem[] => {
    const raw = loadInitialData(STORAGE_KEYS.FEEDBACK, []);
    return (raw || []).filter(f => f && f.id);
  },
  saveFeedback: (items: FeedbackItem[]) => {
    const filtered = (items || []).filter(f => f && f.id);
    saveStorageData(STORAGE_KEYS.FEEDBACK, filtered);
  },

  getMapLocations: (): MapLocation[] => {
    const stored = loadInitialData<MapLocation[]>(STORAGE_KEYS.MAP_LOCATIONS, []);
    if (!stored || stored.length === 0 || !stored.some(l => l.id.startsWith('LOC-'))) {
      saveStorageData(STORAGE_KEYS.MAP_LOCATIONS, INITIAL_MAP_LOCATIONS);
      return INITIAL_MAP_LOCATIONS;
    }
    // Update official LOC-001 through LOC-021 and merge missing official locations
    const officialMap = new Map(INITIAL_MAP_LOCATIONS.map(l => [l.id, l]));
    const updated = stored.map(loc => {
      if (loc.id >= 'LOC-001' && loc.id <= 'LOC-021') {
        const official = officialMap.get(loc.id);
        if (official) return { ...loc, ...official };
      }
      return loc;
    });
    const storedIds = new Set(updated.map(l => l.id));
    const missingOfficial = INITIAL_MAP_LOCATIONS.filter(l => !storedIds.has(l.id));
    const merged = [...updated, ...missingOfficial];
    saveStorageData(STORAGE_KEYS.MAP_LOCATIONS, merged);
    return merged;
  },
  saveMapLocations: (locations: MapLocation[]) => {
    saveStorageData(STORAGE_KEYS.MAP_LOCATIONS, locations || []);
  },
  resetMapLocationsToSeed: (): MapLocation[] => {
    saveStorageData(STORAGE_KEYS.MAP_LOCATIONS, INITIAL_MAP_LOCATIONS);
    return INITIAL_MAP_LOCATIONS;
  },

  // Generic Helpers
  getItem: <T>(key: string, defaultValue: T): T => {
    return loadInitialData<T>(key, defaultValue);
  },
  setItem: <T>(key: string, value: T, _description?: string) => {
    saveStorageData(key, value);
  },

  // Welfare & Citizen Hub Helpers
  getUrgentAidRequests: (): any[] => {
    return loadInitialData(STORAGE_KEYS.URGENT_AID_REQUESTS, []);
  },
  saveUrgentAidRequests: (reqs: any[]) => {
    saveStorageData(STORAGE_KEYS.URGENT_AID_REQUESTS, reqs || []);
  },
  getDonations: (): any[] => {
    return loadInitialData(STORAGE_KEYS.DONATIONS, []);
  },
  saveDonations: (donations: any[]) => {
    saveStorageData(STORAGE_KEYS.DONATIONS, donations || []);
  },
  getSolidarityAssessments: (): any[] => {
    return loadInitialData(STORAGE_KEYS.SOLIDARITY_ASSESSMENTS, []);
  },
  saveSolidarityAssessments: (assessments: any[]) => {
    saveStorageData(STORAGE_KEYS.SOLIDARITY_ASSESSMENTS, assessments || []);
  },

  // ==========================================
  // SCRIPT XỬ LÝ DỮ LIỆU & DI TRÚ 21 KHU PHỐ
  // ==========================================
  /**
   * Script chuyên dụng xử lý dữ liệu và di trú cấu trúc hành chính:
   * 1. Cập nhật danh sách 21 khu phố mới của Phường Chánh Hiệp (KP-01 đến KP-21 + area-chanh-hiep).
   * 2. Loại bỏ triệt để 12 mã cũ hoặc các bản ghi địa bàn lỗi thời không thuộc quy hoạch 21 khu phố mới.
   * 3. Đảm bảo tính toàn vẹn dữ liệu (Foreign Key Integrity) khi liên kết với MemberOrganizations:
   *    - Tự động phát hiện và re-link các tổ chức có areaId cũ/sai lệch sang đúng khu phố 1..21 tương ứng.
   *    - Đồng bộ tên địa bàn (areaName) chuẩn theo 21 khu phố mới.
   *    - Đảm bảo 100% tất cả 21 khu phố đều có đủ 4 tổ chức nòng cốt: Ban CTMT, Chi đoàn TNCS, Chi hội Phụ nữ, Chi hội CCB.
   *    - Cập nhật số liệu độ phủ 21 khu phố cho các tổ chức đoàn thể cấp phường.
   * 4. Đồng bộ tương tự với bảng Organizations (Hệ thống chính trị / 21 BCTMT).
   */
  migrateChanhHiep21Neighborhoods: (options?: { forceReset?: boolean }): NeighborhoodMigrationResult => {
    const details: string[] = [];
    const timestamp = new Date().toISOString();

    // 1. Dọn dẹp các storage key phiên bản cũ (v1, v2)
    if (typeof window !== 'undefined') {
      const legacyStorageKeys = [
        'mttq_chanhhiep_areas_v1',
        'mttq_chanhhiep_areas_v2',
        'mttq_areas_v1',
        'mttq_chanhhiep_member_orgs_v1',
        'mttq_chanhhiep_member_orgs_v2',
        'mttq_member_orgs_v1',
        'mttq_chanhhiep_organizations_v1',
        'mttq_chanhhiep_organizations_v2',
        'mttq_organizations_v1'
      ];
      legacyStorageKeys.forEach(k => {
        try {
          localStorage.removeItem(k);
        } catch {
          // ignore
        }
      });
    }

    // 2. TẬP HỢP DANH SÁCH 21 KHU PHỐ CHUẨN + CẤP PHƯỜNG
    const officialAreaIds = new Set(INITIAL_AREAS.map(a => a.id));
    const officialAreaMap = new Map<string, Area>();
    INITIAL_AREAS.forEach(a => officialAreaMap.set(a.id, { ...a }));

    // Đọc danh sách hiện tại nếu không forceReset
    let currentRawAreas: Area[] = [];
    try {
      currentRawAreas = loadInitialData(STORAGE_KEYS.AREAS, INITIAL_AREAS);
    } catch {
      currentRawAreas = INITIAL_AREAS;
    }

    let legacyAreasRemoved = 0;

    if (!options?.forceReset && Array.isArray(currentRawAreas)) {
      currentRawAreas.forEach(a => {
        if (!a || !a.id) return;
        // Kiểm tra xem ID có nằm trong danh sách 21 khu phố mới + cấp phường hay không
        if (!officialAreaIds.has(a.id)) {
          legacyAreasRemoved++;
          details.push(`Đã loại bỏ mã/địa bàn cũ: ${a.name || a.id} (Mã: ${a.code || 'không rõ'})`);
        } else {
          // Giữ lại các trường thông tin tùy biến hợp lệ nếu người dùng đã cập nhật (SĐT, dân số, v.v.)
          const canonical = officialAreaMap.get(a.id);
          if (canonical) {
            officialAreaMap.set(a.id, {
              ...canonical,
              ...a,
              id: canonical.id,
              code: canonical.code,
              name: canonical.name,
              description: canonical.description,
              type: canonical.type,
              parentId: canonical.parentId,
              order: canonical.order
            });
          }
        }
      });
    } else if (options?.forceReset) {
      details.push('Thiết lập lại danh mục chuẩn 21 Khu phố mới của Phường Chánh Hiệp từ cấu hình gốc.');
    }

    const finalAreas: Area[] = Array.from(officialAreaMap.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
    saveStorageData(STORAGE_KEYS.AREAS, finalAreas);
    details.push(`Chuẩn hóa hoàn tất danh mục ${finalAreas.length} địa bàn hành chính (Phường Chánh Hiệp và 21 Khu phố từ KP-01 đến KP-21).`);

    // Bảng tra cứu Area theo ID & theo số KP (1..21)
    const areaById = new Map<string, Area>();
    const areaByNumber = new Map<number, Area>();
    finalAreas.forEach(a => {
      areaById.set(a.id, a);
      const numMatch = a.id.match(/^area-kp-(\d+)$/);
      if (numMatch) {
        areaByNumber.set(parseInt(numMatch[1], 10), a);
      }
    });

    // Helper trích xuất số khu phố (1..21) từ chuỗi bất kỳ
    const extractKpNumber = (text: string | undefined | null): number | null => {
      if (!text) return null;
      const patterns = [
        /(?:chánh\s*hiệp|khu\s*ph[oố]|kp|chi\s*đoàn\s*kp|chi\s*hội\s*.*?kp|bctmt.*?kp)[-_.\s]*0?(\d{1,2})\b/i,
        /(?:area-kp-|kp-)[-_.\s]*0?(\d{1,2})\b/i,
        /\b(?:kp|khu\s*phố|chánh\s*hiệp)[-_.\s]*0?(\d{1,2})\b/i
      ];
      for (const p of patterns) {
        const match = text.match(p);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num >= 1 && num <= 21) return num;
        }
      }
      return null;
    };

    // 3. XỬ LÝ TOÀN VẸN DỮ LIỆU MEMBER ORGANIZATIONS (TỔ CHỨC CẤP PHƯỜNG)
    let currentOrgs: MemberOrganization[] = [];
    try {
      currentOrgs = loadInitialData(STORAGE_KEYS.MEMBER_ORGANIZATIONS, []);
    } catch {
      currentOrgs = [];
    }

    const AI_SEEDS = new Set([
      'org-dtn', 'org-lhph', 'org-ccb', 'org-congdoan', 'org-nct', 'org-hkh', 'org-tnxp', 'org-luat-gia',
      'mem-org-1', 'mem-org-2', 'mem-org-3', 'mem-org-4'
    ]);

    let memberOrgsUpdated = 0;
    let orphanedMemberOrgsResolved = 0;
    const processedOrgMap = new Map<string, MemberOrganization>();

    // Áp dụng dữ liệu người dùng đã lưu (loại bỏ các tổ chức AI tạo sẵn)
    (currentOrgs || []).forEach(org => {
      if (!org || !org.id || AI_SEEDS.has(org.id)) return;
      // Bỏ qua nếu là cấp khu phố cũ
      if (org.id.startsWith('org-bctmt-kp') || org.id.startsWith('org-branch-') || org.level === 'NEIGHBORHOOD') {
        return;
      }
      processedOrgMap.set(org.id, { ...org });
    });

    // Rà soát từng tổ chức để đảm bảo ràng buộc
    const updatedMemberOrgs: MemberOrganization[] = Array.from(processedOrgMap.values()).map(org => {
      let changed = false;
      if (org.areaId !== 'area-chanh-hiep') {
        org.areaId = 'area-chanh-hiep';
        org.areaName = 'Phường Chánh Hiệp';
        changed = true;
      }
      if (org.level !== 'WARD') {
        org.level = 'WARD';
        changed = true;
      }

      if (changed) {
        memberOrgsUpdated++;
      }
      return org;
    });

    updatedMemberOrgs.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
    saveStorageData(STORAGE_KEYS.MEMBER_ORGANIZATIONS, updatedMemberOrgs);
    details.push(`Đảm bảo tính toàn vẹn cho ${updatedMemberOrgs.length} đoàn thể/tổ chức cấp phường.`);

    // 4. XỬ LÝ TOÀN VẸN DỮ LIỆU BẢNG HỆ THỐNG CHÍNH TRỊ (ORGANIZATIONS CẤP PHƯỜNG)
    let currentPoliticalOrgs: Organization[] = [];
    try {
      currentPoliticalOrgs = loadInitialData(STORAGE_KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS);
    } catch {
      currentPoliticalOrgs = INITIAL_ORGANIZATIONS;
    }

    let organizationsUpdated = 0;
    const politicalMap = new Map<string, Organization>();
    INITIAL_ORGANIZATIONS.forEach(po => politicalMap.set(po.id, { ...po }));
    (currentPoliticalOrgs || []).forEach(po => {
      if (po && po.id) {
        // Bỏ qua nếu là cấp khu phố cũ
        if (po.id.startsWith('org-bctmt-kp') || po.level === 'NEIGHBORHOOD') {
          return;
        }
        const existing = politicalMap.get(po.id) || po;
        politicalMap.set(po.id, { ...existing, ...po });
      }
    });

    const updatedPoliticalOrgs: Organization[] = Array.from(politicalMap.values()).map(po => {
      let changed = false;
      if (po.areaId !== 'area-chanh-hiep') {
        po.areaId = 'area-chanh-hiep';
        po.areaName = 'Phường Chánh Hiệp';
        changed = true;
      }
      if (po.level !== 'WARD') {
        po.level = 'WARD';
        changed = true;
      }
      if (po.id === 'org-cong-an' && po.phone !== '02743.882.113') {
        po.phone = '02743.882.113';
        changed = true;
      }
      if (changed) organizationsUpdated++;
      return po;
    });

    updatedPoliticalOrgs.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
    saveStorageData(STORAGE_KEYS.ORGANIZATIONS, updatedPoliticalOrgs);
    details.push(`Đồng bộ ${updatedPoliticalOrgs.length} cơ quan/tổ chức hệ thống chính trị cấp phường.`);

    // Ghi nhận hoàn thành migration
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.NEIGHBORHOODS_MIGRATION_V3, 'completed');
      } catch {
        // ignore
      }
    }

    return {
      success: true,
      timestamp,
      areasProcessed: finalAreas.length,
      legacyAreasRemoved,
      memberOrgsUpdated,
      orphanedMemberOrgsResolved,
      organizationsUpdated,
      areas: finalAreas,
      memberOrganizations: updatedMemberOrgs,
      politicalOrganizations: updatedPoliticalOrgs,
      details
    };
  },

  // ==========================================
  // 1. QUẢN LÝ ĐỊA BÀN HÀNH CHÍNH (AREAS)
  // ==========================================
  getAreas: (): Area[] => {
    // Tự động kích hoạt migration nếu chưa hoàn thành
    if (typeof window !== 'undefined') {
      try {
        if (localStorage.getItem(STORAGE_KEYS.NEIGHBORHOODS_MIGRATION_V3) !== 'completed') {
          AppStorageEngine.migrateChanhHiep21Neighborhoods();
        }
      } catch {
        // ignore
      }
    }

    const raw = loadInitialData(STORAGE_KEYS.AREAS, INITIAL_AREAS);
    // Explicit set of valid 21 new khu phố + ward IDs
    const validAreaIds = new Set(INITIAL_AREAS.map(a => a.id));
    const areaMap = new Map<string, Area>();
    INITIAL_AREAS.forEach(a => {
      if (a && a.id) areaMap.set(a.id, a);
    });
    (raw || []).forEach(a => {
      // Strictly ignore any legacy old 12 khu phố data
      if (a && a.id && validAreaIds.has(a.id)) {
        const canonical = areaMap.get(a.id);
        areaMap.set(a.id, { 
          ...(canonical || {}), 
          ...a,
          name: canonical?.name || a.name,
          description: canonical?.description || a.description
        });
      }
    });
    return Array.from(areaMap.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  resetToOfficial21Areas: (): Area[] => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEYS.AREAS);
        localStorage.removeItem('mttq_chanhhiep_areas_v2');
        localStorage.removeItem('mttq_chanhhiep_areas_v1');
        localStorage.removeItem('mttq_areas_v1');
        memoryCache.delete(STORAGE_KEYS.AREAS);
      } catch {
        // ignore
      }
    }
    const result = AppStorageEngine.migrateChanhHiep21Neighborhoods({ forceReset: true });
    return result.areas;
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
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('mttq_chanhhiep_organizations_v2');
        localStorage.removeItem('mttq_organizations_v1');
      } catch {
        // ignore
      }
    }
    const raw = loadInitialData(STORAGE_KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS);
    const validAreaIds = new Set(INITIAL_AREAS.map(a => a.id));
    const orgMap = new Map<string, Organization>();
    INITIAL_ORGANIZATIONS.forEach(o => {
      if (o && o.id) orgMap.set(o.id, o);
    });
    (raw || []).forEach(o => {
      if (o && o.id) {
        if (!o.areaId || validAreaIds.has(o.areaId)) {
          const canonical = orgMap.get(o.id);
          const merged = { 
            ...(canonical || {}), 
            ...o,
            name: canonical?.name || o.name,
            shortName: canonical?.shortName || o.shortName,
            areaName: canonical?.areaName || o.areaName
          };
          if (canonical && canonical.id === 'org-doan-tn') {
            merged.branchesCount = 21;
          }
          if (canonical && canonical.id === 'org-cong-an') {
            merged.phone = '02743.882.113';
          }
          orgMap.set(o.id, merged);
        }
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
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('mttq_chanhhiep_member_orgs_v4');
        localStorage.removeItem('mttq_chanhhiep_member_orgs_v3');
        localStorage.removeItem('mttq_chanhhiep_member_orgs_v2');
        localStorage.removeItem('mttq_chanhhiep_member_orgs_v1');
      } catch {
        // ignore
      }
    }
    const AI_SEEDS = new Set([
      'org-dtn', 'org-lhph', 'org-ccb', 'org-congdoan', 'org-nct', 'org-hkh', 'org-tnxp', 'org-luat-gia',
      'mem-org-1', 'mem-org-2', 'mem-org-3', 'mem-org-4'
    ]);
    const raw = loadInitialData(STORAGE_KEYS.MEMBER_ORGANIZATIONS, []);
    const validAreaIds = new Set(INITIAL_AREAS.map(a => a.id));
    const cleanList = (raw || []).filter(o => o && o.id && !AI_SEEDS.has(o.id) && (!o.areaId || validAreaIds.has(o.areaId)));
    return cleanList.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
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

  getVolunteers: (): any[] => {
    return loadInitialData<any[]>(STORAGE_KEYS.VOLUNTEERS, []);
  },
  saveVolunteer: (vol: any) => {
    const current = AppStorageEngine.getVolunteers();
    const updated = [vol, ...current.filter(v => v.id !== vol.id)];
    saveStorageData(STORAGE_KEYS.VOLUNTEERS, updated);
  },
  saveVolunteers: (vols: any[]) => {
    saveStorageData(STORAGE_KEYS.VOLUNTEERS, vols);
  },

  getLastBackupTime: (): string => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_BACKUP_TIME) || new Date().toISOString();
    } catch {
      return new Date().toISOString();
    }
  },

  getNeighborhoodHouseholds: (): NeighborhoodHousehold[] => {
    return loadInitialData<NeighborhoodHousehold[]>(STORAGE_KEYS.NEIGHBORHOOD_HOUSEHOLDS, INITIAL_HOUSEHOLDS);
  },
  saveNeighborhoodHouseholds: (households: NeighborhoodHousehold[]) => {
    saveStorageData(STORAGE_KEYS.NEIGHBORHOOD_HOUSEHOLDS, households || []);
  },

  getNeighborhoodBroadcasts: (): NeighborhoodBroadcast[] => {
    return loadInitialData<NeighborhoodBroadcast[]>(STORAGE_KEYS.NEIGHBORHOOD_BROADCASTS, INITIAL_BROADCASTS);
  },
  saveNeighborhoodBroadcasts: (broadcasts: NeighborhoodBroadcast[]) => {
    saveStorageData(STORAGE_KEYS.NEIGHBORHOOD_BROADCASTS, broadcasts || []);
  },

  getNeighborhoodPetitions: (): NeighborhoodPetition[] => {
    return loadInitialData<NeighborhoodPetition[]>(STORAGE_KEYS.NEIGHBORHOOD_PETITIONS, INITIAL_PETITIONS);
  },
  saveNeighborhoodPetitions: (petitions: NeighborhoodPetition[]) => {
    saveStorageData(STORAGE_KEYS.NEIGHBORHOOD_PETITIONS, petitions || []);
  },

  getNeighborhoodRegistrations: (): NeighborhoodRegistration[] => {
    return loadInitialData<NeighborhoodRegistration[]>(STORAGE_KEYS.NEIGHBORHOOD_REGISTRATIONS, INITIAL_REGISTRATIONS);
  },
  saveNeighborhoodRegistrations: (registrations: NeighborhoodRegistration[]) => {
    saveStorageData(STORAGE_KEYS.NEIGHBORHOOD_REGISTRATIONS, registrations || []);
  },

  // Launch Popup Configuration & Interactivity
  getLaunchPopupConfig: (): LaunchPopupConfig => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LAUNCH_POPUP_CONFIG);
      if (stored) {
        return { ...DEFAULT_LAUNCH_POPUP_CONFIG, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Error reading launch popup config from storage:', e);
    }
    return DEFAULT_LAUNCH_POPUP_CONFIG;
  },

  saveLaunchPopupConfig: (config: LaunchPopupConfig): void => {
    try {
      const cleaned: LaunchPopupConfig = {
        ...config,
        updatedAt: new Date().toISOString()
      };
      saveStorageData(STORAGE_KEYS.LAUNCH_POPUP_CONFIG, cleaned);
    } catch (e) {
      console.error('Error saving launch popup config to storage:', e);
    }
  },

  incrementLaunchCongratulations: (): number => {
    try {
      const current = AppStorageEngine.getLaunchPopupConfig();
      const newCount = (current.congratulationsCount || 0) + 1;
      const updated = { ...current, congratulationsCount: newCount };
      saveStorageData(STORAGE_KEYS.LAUNCH_POPUP_CONFIG, updated);
      return newCount;
    } catch {
      return 1;
    }
  },

  hasDismissedLaunchPopup: (): boolean => {
    try {
      const dismissedUntil = localStorage.getItem(STORAGE_KEYS.LAUNCH_POPUP_DISMISSED);
      if (dismissedUntil) {
        const timestamp = parseInt(dismissedUntil, 10);
        if (Date.now() < timestamp) return true;
      }
    } catch {
      // ignore
    }
    return false;
  },

  setDismissLaunchPopup: (dismissForHours: number = 24): void => {
    try {
      const expireTime = Date.now() + dismissForHours * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEYS.LAUNCH_POPUP_DISMISSED, expireTime.toString());
    } catch {
      // ignore
    }
  },

  clearDismissLaunchPopup: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.LAUNCH_POPUP_DISMISSED);
    } catch {
      // ignore
    }
  },

  hasUserCongratulatedLaunch: (): boolean => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAUNCH_POPUP_USER_CONGRATULATED) === 'true';
    } catch {
      return false;
    }
  },

  setUserCongratulatedLaunch: (): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.LAUNCH_POPUP_USER_CONGRATULATED, 'true');
    } catch {
      // ignore
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
        currentUser: AppStorageEngine.getCurrentUser(),
        articleSubmissions: AppStorageEngine.getArticleSubmissions(),
        feedback: AppStorageEngine.getFeedback()
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
      if (data.articleSubmissions) AppStorageEngine.saveArticleSubmissions(data.articleSubmissions);
      if (data.feedback) AppStorageEngine.saveFeedback(data.feedback);

      return true;
    } catch (err) {
      console.error('[StorageEngine] Error importing JSON backup:', err);
      return false;
    }
  },

  resetAllToDefaults: () => {
    localStorage.clear();
  },

  // ==========================================
  // SMART OFFLINE SYNC API
  // ==========================================

  getOfflineQueue: (): PendingSyncOperation[] => getOfflineQueueFromStorage(),

  clearOfflineQueue: () => {
    saveOfflineQueueToStorage([]);
    currentSyncState = 'IDLE';
    notifySyncListeners();
  },

  isOnline: (): boolean => typeof navigator !== 'undefined' ? navigator.onLine : true,

  getSyncStatus: (): StorageSyncStatus => {
    const queue = getOfflineQueueFromStorage();
    const pendingCount = queue.filter(op => op.status !== 'COMPLETED').length;
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    const countsMap = new Map<string, number>();
    queue.forEach(op => {
      if (op.status !== 'COMPLETED') {
        countsMap.set(op.entityName, (countsMap.get(op.entityName) || 0) + 1);
      }
    });

    return {
      isOnline,
      pendingCount,
      syncState: isOnline ? (pendingCount > 0 && currentSyncState === 'SYNCING' ? 'SYNCING' : currentSyncState) : 'OFFLINE',
      lastSyncedTime: lastSyncedTimestamp,
      lastError: lastSyncError,
      pendingSummary: Array.from(countsMap.entries()).map(([entityName, count]) => ({ entityName, count }))
    };
  },

  subscribeToSyncStatus: (callback: (status: StorageSyncStatus) => void): (() => void) => {
    syncListeners.add(callback);
    callback(AppStorageEngine.getSyncStatus());
    return () => syncListeners.delete(callback);
  },

  initOfflineSyncEngine: (): (() => void) => {
    if (isEngineInitialized || typeof window === 'undefined') return () => {};
    isEngineInitialized = true;

    const handleOnline = () => {
      console.info('[AppStorageEngine] 🌐 Connection restored! Auto-pushing pending offline data...');
      currentSyncState = 'SYNCING';
      notifySyncListeners();
      AppStorageEngine.processPendingQueue();
    };

    const handleOffline = () => {
      console.warn('[AppStorageEngine] 📡 Network disconnected. Entering offline storage mode.');
      currentSyncState = 'OFFLINE';
      notifySyncListeners();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.onLine && getOfflineQueueFromStorage().length > 0) {
      AppStorageEngine.processPendingQueue();
    } else {
      notifySyncListeners();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  },

  processPendingQueue: async (): Promise<boolean> => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      currentSyncState = 'OFFLINE';
      notifySyncListeners();
      return false;
    }

    const queue = getOfflineQueueFromStorage();
    const pendingOps = queue.filter(op => op.status !== 'COMPLETED');

    if (pendingOps.length === 0) {
      currentSyncState = 'IDLE';
      notifySyncListeners();
      return true;
    }

    currentSyncState = 'SYNCING';
    notifySyncListeners();

    try {
      const remainingQueue: PendingSyncOperation[] = [];

      for (const op of pendingOps) {
        op.status = 'SYNCING';
        saveOfflineQueueToStorage([...remainingQueue, ...pendingOps]);

        const colName = FIRESTORE_COLLECTION_MAP[op.key];
        let syncSuccess = false;

        if (colName && db) {
          try {
            if (Array.isArray(op.data)) {
              const items = op.data.slice(0, 30);
              const batch = writeBatch(db);
              let writeCount = 0;
              for (const item of items) {
                if (item && item.id) {
                  const docRef = doc(db, colName, String(item.id));
                  batch.set(docRef, JSON.parse(JSON.stringify(item)), { merge: true });
                  writeCount++;
                }
              }
              if (writeCount > 0) {
                await batch.commit();
              }
            } else if (op.data && op.data.id) {
              const docRef = doc(db, colName, String(op.data.id));
              await setDoc(docRef, JSON.parse(JSON.stringify(op.data)), { merge: true });
            }
            syncSuccess = true;
          } catch (cloudErr: any) {
            console.warn(`[StorageEngine] Cloud sync failed for key ${op.key}:`, cloudErr);
            op.retryCount += 1;
            op.status = 'FAILED';
            lastSyncError = cloudErr?.message || 'Lỗi kết nối Firestore';
            if (cloudErr?.code === 'resource-exhausted' || (cloudErr?.message && cloudErr.message.includes('resource-exhausted'))) {
              op.retryCount = 5; // Do not repeatedly requeue exhausted writes
              break;
            }
          }
        } else {
          syncSuccess = true;
        }

        if (syncSuccess) {
          op.status = 'COMPLETED';
        } else if (op.retryCount < 5) {
          remainingQueue.push(op);
        }
      }

      const updatedQueue = getOfflineQueueFromStorage().filter(op => op.status !== 'COMPLETED' && remainingQueue.some(r => r.id === op.id));
      saveOfflineQueueToStorage(updatedQueue);

      lastSyncedTimestamp = new Date().toISOString();
      localStorage.setItem('mttq_chanhhiep_last_sync_time', lastSyncedTimestamp);
      currentSyncState = updatedQueue.length === 0 ? 'SUCCESS' : 'SYNC_ERROR';
      notifySyncListeners();

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('app_storage_synced', { detail: { timestamp: lastSyncedTimestamp } }));
      }

      return updatedQueue.length === 0;
    } catch (err: any) {
      console.error('[StorageEngine] Error processing pending queue:', err);
      currentSyncState = 'SYNC_ERROR';
      lastSyncError = err?.message || 'Không thể đồng bộ dữ liệu';
      notifySyncListeners();
      return false;
    }
  }
};

export const migrateChanhHiep21Neighborhoods = AppStorageEngine.migrateChanhHiep21Neighborhoods;
