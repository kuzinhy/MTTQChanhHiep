import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { AppStorageEngine } from './storage';
import {
  AuditLog,
  AdminNotification,
  AdminPresence,
  EntityEditingPresence,
  EntityEditingEditor,
  AdminNotificationPreferences,
  StaffUser
} from '../types';

// Firestore Collection Names
const AUDIT_LOGS_COLLECTION = 'auditLogs';
const ADMIN_NOTIFICATIONS_COLLECTION = 'admin_notifications';
const ADMIN_PRESENCE_COLLECTION = 'admin_presence';
const EDITING_PRESENCE_COLLECTION = 'entity_editing_presence';
const NOTIFICATION_PREFS_COLLECTION = 'admin_notification_preferences';

// BroadcastChannel for instant multi-tab & local cross-window sync
const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('mttq_admin_collaboration_channel')
  : null;

// Helper to sanitize undefined values before writing to Firestore
const sanitizeForFirestore = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore);
  }
  const cleaned: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val !== undefined) {
      cleaned[key] = sanitizeForFirestore(val);
    }
  }
  return cleaned;
};

// Default Admin Notification Preferences
export const DEFAULT_NOTIFICATION_PREFERENCES: AdminNotificationPreferences = {
  adminId: 'default',
  notifyActivity: true,
  notifyArticles: true,
  notifyDocuments: true,
  notifyMedia: true,
  notifySystem: true,
  notifyAdminOnline: true,
  notifyAdminOffline: false,
  soundEnabled: false,
  desktopPushEnabled: false,
};

const DEFAULT_SEED_ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'seed-notif-1',
    type: 'DOCUMENT',
    actorAdminId: 'staff-1',
    actorName: 'Nguyễn Văn Hùng (Chủ tịch)',
    title: 'Phê duyệt Kế hoạch 08/KH-MTTQ',
    message: 'Chủ tịch Nguyễn Văn Hùng đã ký duyệt Kế hoạch Tổ chức Ngày hội Đại đoàn kết năm 2026.',
    entityType: 'document',
    entityId: 'doc-08',
    action: 'APPROVE',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    isRead: false
  },
  {
    id: 'seed-notif-2',
    type: 'ARTICLE',
    actorAdminId: 'staff-2',
    actorName: 'Trần Thị Mai (Phó Chủ tịch)',
    title: 'Xuất bản Bài viết Tin tức mới',
    message: 'Phó Chủ tịch Trần Thị Mai đã hoàn tất phê duyệt bài viết tuyên truyền Chuyển đổi số.',
    entityType: 'article',
    entityId: 'art-102',
    action: 'PUBLISH',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isRead: false
  },
  {
    id: 'seed-notif-3',
    type: 'ACTIVITY',
    actorAdminId: 'public-user',
    actorName: 'Nguyễn Văn A (Tình nguyện viên)',
    title: 'Gửi Đăng ký Tình nguyện viên',
    message: 'Gửi đăng ký Tình nguyện viên hỗ trợ Đội Phản ứng nhanh An sinh Xã hội với hiệu ứng Máy bay giấy 3D.',
    entityType: 'volunteer',
    entityId: 'vol-101',
    action: 'CREATE',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    isRead: false
  },
  {
    id: 'seed-notif-4',
    type: 'MEDIA',
    actorAdminId: 'staff-3',
    actorName: 'Lê Văn Nam (Ủy viên MTTQ)',
    title: 'Cập nhật Không gian Văn hóa Hồ Chí Minh',
    message: 'Cán bộ Lê Văn Nam vừa tải lên tư liệu lịch sử hình ảnh mới.',
    entityType: 'cultural_media',
    entityId: 'media-55',
    action: 'UPLOAD',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    isRead: true
  }
];

export const adminCollaborationService = {
  // ==========================================
  // 1. AUDIT LOG & ACTIVITY EVENT PUBLISHING
  // ==========================================

  /**
   * Publish an admin activity event after successful database operation.
   * MUST be called strictly after DB operation succeeds.
   */
  async publishActivityEvent(params: {
    actor: { id: string; name: string; avatar?: string };
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'APPROVE' | 'RESTORE' | 'UPLOAD' | string;
    entity: string; // 'article', 'document', 'cultural_media', 'competition', 'user'
    entityId?: string;
    entityTitle?: string;
    details: string;
    route?: string;
  }): Promise<{ auditLog: AuditLog; notification: AdminNotification }> {
    const nowIso = new Date().toISOString();
    const logId = 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    const notifId = 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);

    const auditLog: AuditLog = {
      id: logId,
      userId: params.actor.id,
      userName: params.actor.name,
      userAvatar: params.actor.avatar,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      entityTitle: params.entityTitle,
      details: params.details,
      route: params.route,
      timestamp: nowIso
    };

    // Save Audit Log to local storage engine
    try {
      const existingLogs = AppStorageEngine.getAuditLogs();
      AppStorageEngine.saveAuditLogs([auditLog, ...existingLogs.slice(0, 499)]);
    } catch (e) {
      console.warn('[AdminCollaboration] Failed to save audit log locally:', e);
    }

    // Determine category type
    let notifType: AdminNotification['type'] = 'ACTIVITY';
    if (params.entity === 'article') notifType = 'ARTICLE';
    else if (params.entity === 'document') notifType = 'DOCUMENT';
    else if (params.entity === 'cultural_media') notifType = 'MEDIA';
    else if (params.entity === 'system' || params.entity === 'setting') notifType = 'SYSTEM';

    const notification: AdminNotification = {
      id: notifId,
      recipientAdminId: 'ALL',
      activityLogId: logId,
      type: notifType,
      title: `${params.actor.name} ${getActionVerb(params.action)} ${getEntityLabel(params.entity)}`,
      message: params.entityTitle ? `“${params.entityTitle}”` : params.details,
      entityType: params.entity,
      entityId: params.entityId,
      entityTitle: params.entityTitle,
      actorAdminId: params.actor.id,
      actorName: params.actor.name,
      actorAvatar: params.actor.avatar,
      action: params.action,
      isRead: false,
      createdAt: nowIso,
      route: params.route
    };

    // 1. Write Audit Log to Firestore
    try {
      await setDoc(doc(db, AUDIT_LOGS_COLLECTION, logId), sanitizeForFirestore(auditLog));
    } catch (e) {
      console.warn('[AdminCollaboration] Firestore AuditLog write fallback:', e);
    }

    // 2. Write Admin Notification to Firestore
    try {
      await setDoc(doc(db, ADMIN_NOTIFICATIONS_COLLECTION, notifId), sanitizeForFirestore(notification));
    } catch (e) {
      console.warn('[AdminCollaboration] Firestore AdminNotification write fallback:', e);
    }

    // 3. Post to BroadcastChannel for instant local tab dispatch
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({
          type: 'REALTIME_ACTIVITY_EVENT',
          auditLog,
          notification
        });
      } catch (e) {
        console.warn('[AdminCollaboration] BroadcastChannel error:', e);
      }
    }

    return { auditLog, notification };
  },

  // ==========================================
  // 2. REALTIME NOTIFICATION SUBSCRIBER
  // ==========================================

  subscribeToAdminNotifications(
    currentAdminId: string,
    callback: (notifications: AdminNotification[]) => void
  ): () => void {
    let unreadsMap = new Map<string, AdminNotification>();

    // Subscribe to Firestore collection
    let unsubFirestore: (() => void) | null = null;
    try {
      const q = query(
        collection(db, ADMIN_NOTIFICATIONS_COLLECTION),
        orderBy('createdAt', 'desc'),
        limit(100)
      );

      unsubFirestore = onSnapshot(q, (snapshot) => {
        const list: AdminNotification[] = [];
        snapshot.forEach((docSnap) => {
          const item = docSnap.data() as AdminNotification;
          // Filter recipient
          if (
            !item.recipientAdminId ||
            item.recipientAdminId === 'ALL' ||
            item.recipientAdminId === currentAdminId
          ) {
            list.push({ ...item, id: docSnap.id });
          }
        });
        callback(list.length > 0 ? list : DEFAULT_SEED_ADMIN_NOTIFICATIONS);
      }, (err) => {
        console.warn('[AdminCollaboration] Notification snapshot fallback:', err);
        callback(DEFAULT_SEED_ADMIN_NOTIFICATIONS);
      });
    } catch (e) {
      console.warn('[AdminCollaboration] Firestore subscribe error:', e);
      callback(DEFAULT_SEED_ADMIN_NOTIFICATIONS);
    }

    // Listen to BroadcastChannel for local cross-tab sync
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === 'REALTIME_ACTIVITY_EVENT' && event.data.notification) {
        const notif = event.data.notification as AdminNotification;
        if (
          !notif.recipientAdminId ||
          notif.recipientAdminId === 'ALL' ||
          notif.recipientAdminId === currentAdminId
        ) {
          // Trigger instant refresh
          if (!unsubFirestore) {
            unreadsMap.set(notif.id, notif);
            callback(Array.from(unreadsMap.values()));
          }
        }
      }
    };

    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', handleBroadcast);
    }

    return () => {
      if (unsubFirestore) unsubFirestore();
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleBroadcast);
      }
    };
  },

  async markNotificationAsRead(notifId: string): Promise<void> {
    try {
      await updateDoc(doc(db, ADMIN_NOTIFICATIONS_COLLECTION, notifId), {
        isRead: true,
        readAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('[AdminCollaboration] Mark read fallback:', e);
    }
  },

  async markAllNotificationsAsRead(adminId: string): Promise<void> {
    try {
      const q = query(collection(db, ADMIN_NOTIFICATIONS_COLLECTION), limit(100));
      const snap = await getDocs(q);
      const batch = writeBatch(db);
      let count = 0;
      snap.forEach((d) => {
        const data = d.data() as AdminNotification;
        if (!data.isRead && (data.recipientAdminId === 'ALL' || data.recipientAdminId === adminId)) {
          batch.update(d.ref, { isRead: true, readAt: new Date().toISOString() });
          count++;
        }
      });
      if (count > 0) {
        await batch.commit();
      }
    } catch (e) {
      console.warn('[AdminCollaboration] Mark all read fallback:', e);
    }
  },

  // ==========================================
  // 3. ADMIN ONLINE PRESENCE ENGINE
  // ==========================================

  async updateAdminPresence(params: {
    admin: StaffUser;
    status: 'online' | 'idle' | 'offline';
    currentRoute: string;
    currentEntityType?: string;
    currentEntityId?: string;
    currentEntityTitle?: string;
    deviceCountDelta?: number; // +1 on load, -1 on unload
  }): Promise<void> {
    if (!params.admin?.id) return;

    const docRef = doc(db, ADMIN_PRESENCE_COLLECTION, params.admin.id);
    const nowIso = new Date().toISOString();

    try {
      const snap = await getDoc(docRef);
      let deviceCount = 1;
      if (snap.exists()) {
        const existing = snap.data() as AdminPresence;
        deviceCount = Math.max(1, (existing.deviceCount || 1) + (params.deviceCountDelta || 0));
      }

      const presenceData: AdminPresence = {
        adminId: params.admin.id,
        email: params.admin.email,
        name: params.admin.fullname,
        role: params.admin.role,
        avatar: params.admin.avatar,
        status: params.status,
        currentRoute: params.currentRoute,
        currentEntityType: params.currentEntityType,
        currentEntityId: params.currentEntityId,
        currentEntityTitle: params.currentEntityTitle,
        deviceCount,
        lastSeenAt: nowIso,
        updatedAt: nowIso
      };

      await setDoc(docRef, sanitizeForFirestore(presenceData), { merge: true });

      if (broadcastChannel) {
        broadcastChannel.postMessage({
          type: 'PRESENCE_CHANGE',
          presence: presenceData
        });
      }
    } catch (e) {
      console.warn('[AdminCollaboration] Presence update error:', e);
    }
  },

  subscribeToAdminPresence(callback: (presenceList: AdminPresence[]) => void): () => void {
    let unsub: (() => void) | null = null;
    try {
      const q = query(collection(db, ADMIN_PRESENCE_COLLECTION));
      unsub = onSnapshot(q, (snapshot) => {
        const list: AdminPresence[] = [];
        const nowTime = Date.now();

        snapshot.forEach((docSnap) => {
          const item = docSnap.data() as AdminPresence;
          if (item && item.adminId) {
            // Check lastSeenAt grace period (2 minutes)
            const lastSeenTime = new Date(item.lastSeenAt || item.updatedAt || 0).getTime();
            const elapsed = nowTime - lastSeenTime;

            let finalStatus = item.status;
            if (elapsed > 2 * 60 * 1000) {
              finalStatus = 'offline';
            } else if (elapsed > 5 * 60 * 1000 && item.status === 'online') {
              finalStatus = 'idle';
            }

            list.push({ ...item, status: finalStatus });
          }
        });
        callback(list);
      }, (err) => {
        console.warn('[AdminCollaboration] Presence snapshot error:', err);
      });
    } catch (e) {
      console.warn('[AdminCollaboration] Presence subscribe error:', e);
    }

    return () => {
      if (unsub) unsub();
    };
  },

  // ==========================================
  // 4. SOFT EDIT LOCK & EDITING PRESENCE
  // ==========================================

  async registerEditingEntity(params: {
    admin: StaffUser;
    entityType: string;
    entityId: string;
    entityTitle: string;
  }): Promise<void> {
    if (!params.admin?.id || !params.entityId) return;

    const docId = `${params.entityType}_${params.entityId}`;
    const docRef = doc(db, EDITING_PRESENCE_COLLECTION, docId);
    const nowIso = new Date().toISOString();

    try {
      const snap = await getDoc(docRef);
      let editors: EntityEditingEditor[] = [];
      if (snap.exists()) {
        const data = snap.data() as EntityEditingPresence;
        editors = (data.editors || []).filter(
          (e) => e.adminId !== params.admin.id && (Date.now() - new Date(e.lastSeenAt).getTime()) < 3 * 60 * 1000
        );
      }

      editors.push({
        adminId: params.admin.id,
        adminName: params.admin.fullname,
        adminAvatar: params.admin.avatar,
        startedAt: nowIso,
        lastSeenAt: nowIso
      });

      const data: EntityEditingPresence = {
        id: docId,
        entityType: params.entityType,
        entityId: params.entityId,
        entityTitle: params.entityTitle,
        editors,
        updatedAt: nowIso
      };

      await setDoc(docRef, sanitizeForFirestore(data));
    } catch (e) {
      console.warn('[AdminCollaboration] Register editing error:', e);
    }
  },

  async unregisterEditingEntity(params: {
    adminId: string;
    entityType: string;
    entityId: string;
  }): Promise<void> {
    if (!params.adminId || !params.entityId) return;

    const docId = `${params.entityType}_${params.entityId}`;
    const docRef = doc(db, EDITING_PRESENCE_COLLECTION, docId);

    try {
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as EntityEditingPresence;
        const remaining = (data.editors || []).filter((e) => e.adminId !== params.adminId);
        if (remaining.length === 0) {
          await deleteDoc(docRef);
        } else {
          await updateDoc(docRef, { editors: remaining, updatedAt: new Date().toISOString() });
        }
      }
    } catch (e) {
      console.warn('[AdminCollaboration] Unregister editing error:', e);
    }
  },

  subscribeToEditingPresence(
    entityType: string,
    entityId: string,
    callback: (editingPresence: EntityEditingPresence | null) => void
  ): () => void {
    if (!entityType || !entityId) return () => {};

    const docId = `${entityType}_${entityId}`;
    let unsub: (() => void) | null = null;

    try {
      unsub = onSnapshot(doc(db, EDITING_PRESENCE_COLLECTION, docId), (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data() as EntityEditingPresence);
        } else {
          callback(null);
        }
      }, (err) => {
        console.warn('[AdminCollaboration] Editing presence error:', err);
      });
    } catch (e) {
      console.warn('[AdminCollaboration] Editing presence subscribe error:', e);
    }

    return () => {
      if (unsub) unsub();
    };
  },

  // ==========================================
  // 5. NOTIFICATION PREFERENCES
  // ==========================================

  getNotificationPreferences(adminId: string): AdminNotificationPreferences {
    try {
      const stored = localStorage.getItem(`admin_notif_prefs_${adminId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('[AdminCollaboration] Local prefs read error:', e);
    }
    return { ...DEFAULT_NOTIFICATION_PREFERENCES, adminId };
  },

  async saveNotificationPreferences(prefs: AdminNotificationPreferences): Promise<void> {
    try {
      localStorage.setItem(`admin_notif_prefs_${prefs.adminId}`, JSON.stringify(prefs));
      await setDoc(doc(db, NOTIFICATION_PREFS_COLLECTION, prefs.adminId), sanitizeForFirestore(prefs));
    } catch (e) {
      console.warn('[AdminCollaboration] Save notification prefs error:', e);
    }
  }
};

// Helper Verb Translator
function getActionVerb(action: string): string {
  switch (action) {
    case 'CREATE': return 'vừa tạo mới';
    case 'UPDATE': return 'vừa cập nhật';
    case 'DELETE': return 'vừa xóa';
    case 'PUBLISH': return 'vừa xuất bản';
    case 'UNPUBLISH': return 'vừa gỡ xuất bản';
    case 'APPROVE': return 'vừa phê duyệt';
    case 'RESTORE': return 'vừa khôi phục';
    case 'UPLOAD': return 'vừa tải lên';
    default: return 'vừa thực hiện thao tác trên';
  }
}

// Helper Entity Label Translator
function getEntityLabel(entity: string): string {
  switch (entity) {
    case 'article': return 'bài viết';
    case 'document': return 'văn bản chỉ đạo';
    case 'cultural_media': return 'tư liệu Không gian VH HCM';
    case 'competition': return 'cuộc thi trực tuyến';
    case 'opinion': return 'ý kiến nhân dân';
    case 'task': return 'nhiệm vụ công tác';
    case 'user': return 'tài khoản quản trị';
    case 'setting': return 'cấu hình hệ thống';
    default: return 'nội dung';
  }
}
