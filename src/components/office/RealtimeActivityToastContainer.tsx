import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, ExternalLink, RefreshCw, FileText, Newspaper, Image, ShieldAlert, Sparkles } from 'lucide-react';
import { AdminNotification, StaffUser, AdminNotificationPreferences } from '../../types';
import { adminCollaborationService } from '../../lib/adminCollaborationService';

interface RealtimeActivityToastContainerProps {
  currentAdmin: StaffUser | null;
  onNavigateToEntity?: (entityType: string, entityId?: string, route?: string) => void;
}

interface ToastItem {
  id: string;
  notification: AdminNotification;
  count: number;
  timestamp: Date;
}

export const RealtimeActivityToastContainer: React.FC<RealtimeActivityToastContainerProps> = ({
  currentAdmin,
  onNavigateToEntity
}) => {
  const [activeToasts, setActiveToasts] = useState<ToastItem[]>([]);
  const processedNotifIds = useRef<Set<string>>(new Set());
  const soundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!currentAdmin?.id) return;

    const prefs = adminCollaborationService.getNotificationPreferences(currentAdmin.id);

    const unsubscribe = adminCollaborationService.subscribeToAdminNotifications(
      currentAdmin.id,
      (notifications) => {
        if (!notifications || notifications.length === 0) return;

        // Take latest notification
        const latestNotif = notifications[0];
        if (!latestNotif || !latestNotif.id) return;

        // 1. RULE 40: Do NOT notify the actor themselves!
        if (latestNotif.actorAdminId === currentAdmin.id) return;

        // 2. Deduplication check
        if (processedNotifIds.current.has(latestNotif.id)) return;
        processedNotifIds.current.add(latestNotif.id);

        // Ignore notifications older than 2 minutes on initial connection
        const createdTime = Date.parse(latestNotif.createdAt || '') || Date.now();
        const createdAge = Date.now() - createdTime;
        if (createdAge > 2 * 60 * 1000) return;

        // 3. User Notification Preferences Check
        if (!prefs.notifyActivity) return;
        if (latestNotif.type === 'ARTICLE' && !prefs.notifyArticles) return;
        if (latestNotif.type === 'DOCUMENT' && !prefs.notifyDocuments) return;
        if (latestNotif.type === 'MEDIA' && !prefs.notifyMedia) return;
        if (latestNotif.type === 'SYSTEM' && !prefs.notifySystem) return;

        // 4. RULE 42: Debounce & Aggregation
        setActiveToasts((prev) => {
          // Check if there is an existing recent toast for the same actor & same entity
          const key = `${latestNotif.actorAdminId}_${latestNotif.entityType}_${latestNotif.entityId || ''}`;
          const existingIndex = prev.findIndex((t) => {
            const tKey = `${t.notification.actorAdminId}_${t.notification.entityType}_${t.notification.entityId || ''}`;
            const isRecent = (Date.now() - t.timestamp.getTime()) < 2 * 60 * 1000;
            return tKey === key && isRecent;
          });

          if (existingIndex >= 0) {
            // Aggregate!
            const updated = [...prev];
            const item = updated[existingIndex];
            const actorNameStr = latestNotif.actorName || 'Quản trị viên';
            updated[existingIndex] = {
              ...item,
              count: item.count + 1,
              timestamp: new Date(),
              notification: {
                ...latestNotif,
                message: `${actorNameStr} đã cập nhật ${getEntityLabel(latestNotif.entityType || '')} ${item.count + 1} lần trong vài phút vừa qua.`
              }
            };
            return updated;
          } else {
            // New Toast
            const newToast: ToastItem = {
              id: latestNotif.id,
              notification: latestNotif,
              count: 1,
              timestamp: new Date()
            };
            // Play optional sound if enabled
            if (prefs.soundEnabled) {
              playChimeSound();
            }
            return [newToast, ...prev].slice(0, 4); // Max 4 toasts simultaneously
          }
        });
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentAdmin]);

  const playChimeSound = () => {
    try {
      if (!soundRef.current) {
        soundRef.current = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
      }
      soundRef.current.play().catch(() => {});
    } catch (e) {
      // Ignore audio autoplay restrictions
    }
  };

  const removeToast = (id: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {activeToasts.map((toast) => {
          const { notification, count } = toast;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="pointer-events-auto bg-slate-900/95 backdrop-blur-md text-white border border-indigo-500/40 rounded-2xl p-4 shadow-2xl shadow-indigo-950/50 flex flex-col gap-2 relative overflow-hidden group"
            >
              {/* Accent top gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400" />

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold tracking-wider uppercase">
                  {getCategoryIcon(notification.entityType)}
                  <span>{getCategoryBadge(notification.entityType)}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 font-normal lowercase">vừa xong</span>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-3 items-center">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-400/30 shadow-inner">
                  {notification.actorAvatar ? (
                    <img src={notification.actorAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    (notification.actorName || 'Q').charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-200 line-clamp-1">
                    {notification.actorName || 'Quản trị viên'} {getActionVerbText(notification.action)}
                  </p>
                  <p className="text-sm font-bold text-white line-clamp-2 mt-0.5">
                    {notification.message}
                  </p>
                  {count > 1 && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Gộp {count} lượt chỉnh sửa gần đây
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {onNavigateToEntity && notification.entityType && (
                <div className="flex justify-end mt-1 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      removeToast(toast.id);
                      onNavigateToEntity(notification.entityType!, notification.entityId, notification.route);
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-500/30 transition-all cursor-pointer"
                  >
                    <span>Xem nội dung</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

function getCategoryIcon(type?: string) {
  switch (type) {
    case 'article': return <Newspaper className="w-3.5 h-3.5 text-blue-400" />;
    case 'document': return <FileText className="w-3.5 h-3.5 text-amber-400" />;
    case 'cultural_media': return <Image className="w-3.5 h-3.5 text-emerald-400" />;
    case 'system': return <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />;
    default: return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
  }
}

function getCategoryBadge(type?: string) {
  switch (type) {
    case 'article': return 'Tin tức';
    case 'document': return 'Văn bản';
    case 'cultural_media': return 'Không gian VH HCM';
    case 'competition': return 'Cuộc thi';
    case 'system': return 'Hệ thống';
    default: return 'Hoạt động';
  }
}

function getEntityLabel(type?: string) {
  switch (type) {
    case 'article': return 'bài viết';
    case 'document': return 'văn bản';
    case 'cultural_media': return 'tư liệu văn hóa';
    default: return 'nội dung';
  }
}

function getActionVerbText(action: string): string {
  switch (action) {
    case 'CREATE': return 'vừa thêm mới';
    case 'UPDATE': return 'vừa cập nhật';
    case 'DELETE': return 'vừa xóa';
    case 'PUBLISH': return 'vừa xuất bản';
    case 'UNPUBLISH': return 'vừa gỡ xuất bản';
    case 'APPROVE': return 'vừa phê duyệt';
    case 'UPLOAD': return 'vừa tải lên';
    default: return 'vừa chỉnh sửa';
  }
}
