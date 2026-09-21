import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Trash2, 
  Filter, 
  ExternalLink, 
  Calendar, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Check,
  Megaphone,
  BookOpen,
  Sparkles,
  Eye,
  Cloud
} from 'lucide-react';
import { NotificationItem } from '../types';
import { notificationMasterService } from '../lib/notificationMasterService';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  userRoles?: string[];
  onSelectItem?: (item: NotificationItem) => void;
  onNavigate?: (v: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  userId,
  userRoles,
  onSelectItem,
  onNavigate
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'news' | 'event' | 'system'>('all');
  const [readIds, setReadIds] = useState<string[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  // Cross-device synchronization target identifier
  const targetId = useMemo(() => notificationMasterService.getTargetReadId(userId), [userId]);

  useEffect(() => {
    if (!isOpen) return;

    // 1. Subscribe to Firebase Firestore cross-device read status
    const unsubscribeRead = notificationMasterService.subscribeToReadStatus(
      targetId,
      (syncedIds) => {
        setReadIds(syncedIds);
      }
    );

    // 2. Subscribe to notification items
    const unsubscribeList = notificationMasterService.subscribeToNotifications(
      (list) => {
        setNotifications(list);
      },
      userId,
      userRoles
    );

    return () => {
      unsubscribeRead();
      unsubscribeList();
    };
  }, [isOpen, targetId, userId, userRoles]);

  const markAsRead = async (id: string) => {
    await notificationMasterService.markAsRead(id, targetId);
  };

  const markAsUnread = async (id: string) => {
    await notificationMasterService.markAsUnread(id, targetId);
  };

  const markAllAsRead = async () => {
    const allIds = notifications.map(n => n.id);
    await notificationMasterService.markAllAsRead(allIds, targetId);
  };

  const filteredNotifications = notifications.filter(n => {
    const isUnread = !readIds.includes(n.id);
    if (activeFilter === 'unread' && !isUnread) return false;
    if (activeFilter === 'news' && n.category !== 'news') return false;
    if (activeFilter === 'event' && n.category !== 'event') return false;
    if (activeFilter === 'system' && n.category !== 'system') return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !readIds.includes(n.id)).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex justify-end bg-slate-950/50 backdrop-blur-xs select-none">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 min-w-0"
        >
          {/* Drawer Header - Flexbox layout */}
          <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between border-b border-blue-600 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-white/15 backdrop-blur-md shrink-0">
                <Bell className="w-5 h-5 text-cyan-200 animate-bounce" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-black uppercase tracking-tight flex items-center gap-2 truncate">
                  <span>Trung Tâm Thông Báo</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shrink-0">
                      {unreadCount} mới
                    </span>
                  )}
                </h2>
                <p className="text-[11px] text-blue-100 font-medium truncate">
                  Cập nhật thông tin, tin tức &amp; sự kiện trực tuyến
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer shrink-0 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Bar & Mark All Read - Flexbox layout */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
            <div className="flex items-center gap-1.5 shrink-0">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'unread', label: 'Chưa đọc' },
                { id: 'news', label: 'Tin tức' },
                { id: 'event', label: 'Sự kiện' },
                { id: 'system', label: 'Hệ thống' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeFilter === f.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 shrink-0 px-2 py-1 rounded-lg hover:bg-blue-50 transition cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Đọc tất cả
              </button>
            )}
          </div>

          {/* Notifications List - Flexbox with overflow-y-auto */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-100/60 min-w-0">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                  <Megaphone className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Không có thông báo nào</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Bạn đã xem hết các thông báo mới từ hệ thống hoặc không có bản tin trong mục này.
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const isUnread = !readIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition-all relative group min-w-0 w-full ${
                      isUnread
                        ? 'bg-white border-blue-300 shadow-md ring-1 ring-blue-400/20'
                        : 'bg-white/90 border-slate-200 hover:bg-white shadow-2xs'
                    }`}
                  >
                    {isUnread && (
                      <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full bg-blue-600 shadow-xs" title="Chưa đọc" />
                    )}

                    {/* Content layout using CSS Grid */}
                    <div className="grid grid-cols-[auto_1fr] gap-3 items-start min-w-0 w-full">
                      <div className={`p-2.5 rounded-xl shrink-0 ${
                        item.priority === 'CRITICAL' || item.priority === 'URGENT'
                          ? 'bg-rose-100 text-rose-600'
                          : item.category === 'news'
                          ? 'bg-blue-100 text-blue-600'
                          : item.category === 'event'
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {item.category === 'news' ? <BookOpen className="w-4 h-4" /> : <Megaphone className="w-4 h-4" />}
                      </div>

                      {/* Content block with flexbox and break-words */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase shrink-0 ${
                            item.priority === 'CRITICAL'
                              ? 'bg-rose-600 text-white'
                              : item.priority === 'URGENT'
                              ? 'bg-amber-500 text-white'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.priority}
                          </span>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            isUnread 
                              ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {isUnread ? '● Chưa đọc' : '✓ Đã đọc'}
                          </span>

                          <span className="text-[10px] text-slate-400 font-medium">
                            {item.created_at && !isNaN(Date.parse(item.created_at))
                              ? new Date(item.created_at).toLocaleString('vi-VN')
                              : 'Vừa xong'}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug break-words">
                          {item.title}
                        </h4>

                        {/* Scrollable body for long content with break-words & overflow-y-auto */}
                        <div className="text-xs text-slate-700 leading-relaxed break-words whitespace-pre-wrap max-h-48 overflow-y-auto pr-1 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                          {item.body}
                        </div>

                        {/* Action buttons with flexbox */}
                        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Explicit Mark as Read / Unread toggle */}
                            {isUnread ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(item.id);
                                }}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition cursor-pointer"
                                title="Đánh dấu thông báo này là đã đọc"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Đánh dấu đã đọc</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsUnread(item.id);
                                }}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-2.5 py-1 rounded-lg transition cursor-pointer"
                                title="Bấm để đánh dấu là chưa đọc"
                              >
                                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Đã đọc (hoàn tác)</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                markAsRead(item.id);
                                setSelectedNotification(item);
                                if (onSelectItem) onSelectItem(item);
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-blue-700 hover:bg-slate-100 px-2.5 py-1 rounded-lg transition cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-600" />
                              <span>Chi tiết</span>
                            </button>
                          </div>

                          {item.action_url && (
                            <a
                              href={item.action_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => markAsRead(item.id)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline px-2 py-1"
                            >
                              <span>Đi tới liên kết</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer - Flexbox layout */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-medium shrink-0 px-4">
            <span>MTTQ VN Phường Chánh Hiệp</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Đồng bộ Firebase thời gian thực
            </span>
          </div>
        </motion.div>
      </div>

      {/* FULL RESPONSIVE DETAIL VIEW MODAL (GRID / FLEXBOX, OVERFLOW-Y-AUTO, BREAK-WORDS) */}
      {selectedNotification && (
        <div className="fixed inset-0 z-[10000] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 min-w-0">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 min-w-0">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-md shrink-0">
                  <Bell className="w-5 h-5 text-cyan-200" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-sm sm:text-base text-white truncate">
                    Nội Dung Thông Báo Chi Tiết
                  </h3>
                  <p className="text-[11px] text-blue-100 font-mono truncate">
                    Mã: {selectedNotification.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer shrink-0 ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body with overflow-y-auto */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-w-0">
              {/* Title */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tiêu đề thông báo</span>
                  {readIds.includes(selectedNotification.id) ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Đã đọc (Firebase Synced)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                      ● Chưa đọc
                    </span>
                  )}
                </div>
                <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug break-words">
                  {selectedNotification.title}
                </h4>
              </div>

              {/* Full Body with break-words and scroll if extra-long */}
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Nội dung chi tiết</span>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap break-words max-h-72 overflow-y-auto font-medium">
                  {selectedNotification.body}
                </div>
              </div>

              {/* URL */}
              {selectedNotification.action_url && (
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Đường dẫn liên kết đính kèm</span>
                  <div>
                    <a
                      href={selectedNotification.action_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200 hover:bg-blue-100 transition break-all"
                    >
                      <span className="break-all">{selectedNotification.action_url}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                </div>
              )}

              {/* Metadata Grid layout */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Danh mục</span>
                  <span className="font-bold text-slate-800 capitalize">{selectedNotification.category}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Mức độ ưu tiên</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black ${
                    selectedNotification.priority === 'CRITICAL' ? 'bg-rose-600 text-white' :
                    selectedNotification.priority === 'URGENT' ? 'bg-amber-500 text-white' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedNotification.priority}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời gian phát hành</span>
                  <span className="font-bold text-slate-800 font-mono text-[11px]">
                    {selectedNotification.created_at ? new Date(selectedNotification.created_at).toLocaleString('vi-VN') : 'Vừa xong'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0 flex-wrap">
              <div className="flex items-center gap-2">
                {readIds.includes(selectedNotification.id) ? (
                  <button
                    onClick={() => markAsUnread(selectedNotification.id)}
                    className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>Đánh dấu là chưa đọc</span>
                  </button>
                ) : (
                  <button
                    onClick={() => markAsRead(selectedNotification.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>Đánh dấu đã đọc</span>
                  </button>
                )}

                {selectedNotification.action_url && (
                  <a
                    href={selectedNotification.action_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Truy cập nội dung liên quan</span>
                  </a>
                )}
              </div>

              <button
                onClick={() => setSelectedNotification(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer ml-auto"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
