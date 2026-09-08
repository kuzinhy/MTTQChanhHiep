import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { NotificationItem, NotificationRecipient, NotificationPreference, PushSubscriptionRecord } from '../types';

const NOTIFICATIONS_COLLECTION = 'notifications';
const SUBSCRIPTIONS_COLLECTION = 'push_subscriptions';
const RECIPIENTS_COLLECTION = 'notification_recipients';
const PREFERENCES_COLLECTION = 'notification_preferences';
const LOGS_COLLECTION = 'notification_logs';

// BroadcastChannel for multi-tab sync
const notificationChannel = new BroadcastChannel('mttq_chanh_hiep_notifications');

// Helper to remove undefined fields for Firestore
const cleanUndefined = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined);
  }
  const cleaned: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val !== undefined) {
      cleaned[key] = cleanUndefined(val);
    }
  }
  return cleaned;
};

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-seed-1',
    title: 'Phát động Phong trào Thi đua Chuyển đổi số MTTQ Phường Chánh Hiệp 2026',
    body: 'Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp phát động phong trào ứng dụng Số hóa văn bản và Nâng cao hiệu quả lắng nghe ý kiến Dân sinh.',
    summary: 'Phát động phong trào Chuyển đổi số MTTQ Phường Chánh Hiệp năm 2026.',
    type: 'ADMIN_BROADCAST',
    category: 'news',
    priority: 'URGENT',
    visibility: 'PUBLIC',
    target_type: 'ALL',
    channels: ['IN_APP', 'WEB_PUSH'],
    status: 'SENT',
    created_by: 'Bí thư / Chủ tịch MTTQ',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'notif-seed-2',
    title: 'Khảo sát Ý kiến Nhân dân về Nâng cấp Hạ tầng Giao thông 21 Khu phố',
    body: 'Mời toàn thể nhân dân 21 Khu phố tham gia đóng góp ý kiến về dự án chỉnh trang đô thị, nâng cấp hẻm và hệ thống chiếu sáng năm 2026.',
    summary: 'Khảo sát ý kiến nhân dân nâng cấp hạ tầng 21 Khu phố.',
    type: 'CIVIL_OPINION',
    category: 'event',
    priority: 'NORMAL',
    visibility: 'PUBLIC',
    target_type: 'ALL',
    channels: ['IN_APP'],
    status: 'SENT',
    created_by: 'Ban Thường trực MTTQ',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'notif-seed-3',
    title: 'Mở Cổng Đăng ký Tình nguyện viên Mới với Hiệu ứng Máy bay giấy 3D',
    body: 'Người dân có thể đăng ký trực tuyến làm Tình nguyện viên Mặt trận Tổ quốc và trải nghiệm gửi thông tin với hiệu ứng máy bay giấy độc đáo.',
    summary: 'Mở cổng đăng ký Tình nguyện viên MTTQ.',
    type: 'ADMIN_BROADCAST',
    category: 'system',
    priority: 'URGENT',
    visibility: 'PUBLIC',
    target_type: 'ALL',
    channels: ['IN_APP', 'WEB_PUSH'],
    status: 'SENT',
    created_by: 'Ban Tổ chức Tình nguyện',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

export const notificationMasterService = {
  // Subscribe to real-time notifications for current user/device
  subscribeToNotifications(
    callback: (notifications: NotificationItem[]) => void, 
    userId?: string, 
    userRoles?: string[]
  ): (() => void) {
    try {
      const q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        orderBy('created_at', 'desc'),
        limit(50)
      );

      return onSnapshot(q, (snapshot) => {
        const list: NotificationItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as NotificationItem;
          // Filter status
          if (data.status && data.status !== 'SENT' && data.status !== 'SENDING') {
            return;
          }

          const targetType = data.target_type || 'ALL';
          const isAll = targetType === 'ALL' || targetType === 'GUEST_PUBLIC';
          const isAuthenticated = !!userId && targetType === 'AUTHENTICATED';
          const isUserMatch = !!userId && targetType === 'USER' && (data.target_user_ids || []).includes(userId);
          const isRoleMatch = !!userRoles && targetType === 'ROLE' && (data.target_roles || []).some(r => userRoles.includes(r));

          if (isAll || isAuthenticated || isUserMatch || isRoleMatch || !userId) {
            list.push({ ...data, id: docSnap.id });
          }
        });
        callback(list.length > 0 ? list : SEED_NOTIFICATIONS);
      }, (err) => {
        console.error('[NotificationService] Snapshot error:', err);
        callback(SEED_NOTIFICATIONS);
      });
    } catch (e) {
      console.error('[NotificationService] Failed to subscribe:', e);
      callback(SEED_NOTIFICATIONS);
      return () => {};
    }
  },

  // Broadcast event across tabs
  broadcastNewNotification(notification: NotificationItem) {
    try {
      notificationChannel.postMessage({ type: 'NEW_NOTIFICATION', notification });
    } catch (e) {
      console.error(e);
    }
  },

  onBroadcastMessage(callback: (notification: NotificationItem) => void) {
    const handler = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NEW_NOTIFICATION') {
        callback(event.data.notification);
      }
    };
    notificationChannel.addEventListener('message', handler);
    return () => notificationChannel.removeEventListener('message', handler);
  },

  // Create notification in Admin
  async createNotification(payload: Omit<NotificationItem, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const sanitized = cleanUndefined({
      ...payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    const docRef = await addDoc(collection(db, NOTIFICATIONS_COLLECTION), sanitized);

    // If status is SENT, dispatch immediately
    if (payload.status === 'SENT') {
      await this.dispatchNotification(docRef.id);
    }

    return docRef.id;
  },

  async dispatchNotification(notificationId: string) {
    const docRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return;

    const notification = { ...snap.data(), id: snap.id } as NotificationItem;
    
    // Update status to SENT
    await updateDoc(docRef, {
      status: 'SENT',
      sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // Broadcast
    this.broadcastNewNotification(notification);
  },

  // Fetch all notifications for admin dashboard
  async getAllNotifications(): Promise<NotificationItem[]> {
    try {
      const q = query(collection(db, NOTIFICATIONS_COLLECTION), orderBy('created_at', 'desc'));
      const snap = await getDocs(q);
      const docs = snap.docs.map(d => ({ ...d.data(), id: d.id } as NotificationItem));
      return docs.length > 0 ? docs : SEED_NOTIFICATIONS;
    } catch (e) {
      console.warn('[NotificationService] getAllNotifications error:', e);
      return SEED_NOTIFICATIONS;
    }
  },

  // Device & Push Subscription registration
  async registerSubscription(sub: Omit<PushSubscriptionRecord, 'created_at' | 'last_seen_at' | 'failed_count'>) {
    const subId = `${sub.device_id}_${sub.provider}`;
    const docRef = doc(db, SUBSCRIPTIONS_COLLECTION, subId);
    await setDoc(docRef, {
      ...sub,
      enabled: true,
      created_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
      failed_count: 0
    }, { merge: true });
    return subId;
  },

  async unregisterSubscription(device_id: string) {
    const docRef = doc(db, SUBSCRIPTIONS_COLLECTION, `${device_id}_WEB_PUSH`);
    await updateDoc(docRef, { enabled: false, user_id: null });
  },

  // Professional Cleanup / Deletion methods
  async deleteNotification(notificationId: string): Promise<void> {
    const docRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
    await deleteDoc(docRef);
  },

  async bulkDeleteNotifications(notificationIds: string[]): Promise<void> {
    for (const id of notificationIds) {
      await deleteDoc(doc(db, NOTIFICATIONS_COLLECTION, id));
    }
  },

  async cleanupOldNotifications(daysOlder: number = 30): Promise<number> {
    const q = query(collection(db, NOTIFICATIONS_COLLECTION));
    const snap = await getDocs(q);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOlder);

    let deletedCount = 0;
    for (const docSnap of snap.docs) {
      const data = docSnap.data() as NotificationItem;
      const createdAt = new Date(data.created_at || Date.now());
      if (createdAt < cutoffDate) {
        await deleteDoc(doc(db, NOTIFICATIONS_COLLECTION, docSnap.id));
        deletedCount++;
      }
    }
    return deletedCount;
  },

  async archiveAllReadOrExpired(): Promise<number> {
    const q = query(collection(db, NOTIFICATIONS_COLLECTION));
    const snap = await getDocs(q);
    let count = 0;
    for (const docSnap of snap.docs) {
      const data = docSnap.data() as NotificationItem;
      const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
      if (expiresAt && expiresAt < new Date()) {
        await deleteDoc(doc(db, NOTIFICATIONS_COLLECTION, docSnap.id));
        count++;
      }
    }
    return count;
  }
};
