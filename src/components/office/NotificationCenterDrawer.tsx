import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, CheckCheck, Newspaper, FileText, Image, Sparkles, ShieldAlert, Check, ExternalLink, Filter } from 'lucide-react';
import { AdminNotification, StaffUser } from '../../types';
import { adminCollaborationService } from '../../lib/adminCollaborationService';

interface NotificationCenterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentAdmin: StaffUser | null;
  onNavigateToEntity?: (entityType: string, entityId?: string, route?: string) => void;
}

export const NotificationCenterDrawer: React.FC<NotificationCenterDrawerProps> = ({
  isOpen,
  onClose,
  currentAdmin,
  onNavigateToEntity
}) => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  useEffect(() => {
    if (!isOpen || !currentAdmin?.id) return;

    const unsubscribe = adminCollaborationService.subscribeToAdminNotifications(
      currentAdmin.id,
      (list) => {
        setNotifications(list);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [isOpen, currentAdmin]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredList = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.isRead;
    return true;
  });

  const handleMarkAllRead = async () => {
    if (!currentAdmin?.id) return;
    await adminCollaborationService.markAllNotificationsAsRead(currentAdmin.id);
  };

  const handleItemClick = async (notif: AdminNotification) => {
    if (!notif.isRead) {
      await adminCollaborationService.markNotificationAsRead(notif.id);
    }
    if (onNavigateToEntity && notif.entityType) {
      onClose();
      onNavigateToEntity(notif.entityType, notif.entityId, notif.route);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Drawer panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Bell className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <span>Thông báo Hoạt động</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-500 text-slate-950 shadow-xs">
                      {unreadCount} chưa đọc
                    </span>
                  )}
                </h2>
                <p className="text-xs text-blue-200/80 mt-0.5">
                  Nhật ký thông báo hoạt động từ các Quản trị viên
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subheader Controls */}
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 text-xs">
            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-xl">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  filter === 'ALL'
                    ? 'bg-white text-indigo-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('UNREAD')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  filter === 'UNREAD'
                    ? 'bg-white text-indigo-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Chưa đọc ({unreadCount})
              </button>
            </div>

            {/* Mark all as read */}
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-200 transition-all cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Đánh dấu tất cả đã đọc</span>
              </button>
            )}
          </div>

          {/* List of notifications */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {filteredList.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                {filter === 'UNREAD'
                  ? 'Bạn đã đọc toàn bộ thông báo!'
                  : 'Chưa có thông báo hoạt động nào.'}
              </div>
            ) : (
              filteredList.map((notif) => {
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleItemClick(notif)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${
                      !notif.isRead
                        ? 'bg-blue-50/70 border-blue-200 shadow-2xs hover:bg-blue-100/80'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {!notif.isRead && (
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-blue-600" />
                    )}

                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0 border border-slate-700 shadow-2xs">
                        {notif.actorAvatar ? (
                          <img src={notif.actorAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          (notif.actorName || 'A').charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                            {getTimeAgoText(notif.createdAt)}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {notif.message}
                        </p>

                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                          <span className="inline-flex items-center gap-1 font-bold text-slate-600 uppercase">
                            {getCategoryIcon(notif.entityType)}
                            <span>{getCategoryBadge(notif.entityType)}</span>
                          </span>

                          <span className="text-blue-600 font-extrabold flex items-center gap-0.5 group-hover:underline">
                            <span>Chi tiết</span>
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer info */}
          <div className="p-3.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 text-center">
            Trung tâm thông báo đồng bộ Firestore realtime &amp; BroadcastChannel.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

function getCategoryIcon(type?: string) {
  switch (type) {
    case 'article': return <Newspaper className="w-3 h-3 text-blue-600" />;
    case 'document': return <FileText className="w-3 h-3 text-amber-600" />;
    case 'cultural_media': return <Image className="w-3 h-3 text-emerald-600" />;
    case 'system': return <ShieldAlert className="w-3 h-3 text-purple-600" />;
    default: return <Sparkles className="w-3 h-3 text-indigo-600" />;
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

function getTimeAgoText(isoString?: string): string {
  if (!isoString) return 'Vừa xong';
  const timestamp = Date.parse(isoString);
  if (isNaN(timestamp)) return 'Vừa xong';
  const diff = Date.now() - timestamp;
  if (diff < 0) return 'Vừa xong';
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}
