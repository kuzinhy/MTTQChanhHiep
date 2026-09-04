import React, { useState, useEffect } from 'react';
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
  Megaphone,
  BookOpen,
  Sparkles
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
  onSelectItem
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'news' | 'event' | 'system'>('all');
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    // Load read ids from localStorage
    try {
      const saved = localStorage.getItem('mttq_read_notifications');
      if (saved) setReadIds(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }

    const unsubscribe = notificationMasterService.subscribeToNotifications(
      (list) => {
        setNotifications(list);
      },
      userId,
      userRoles
    );

    return () => {
      unsubscribe();
    };
  }, [isOpen, userId, userRoles]);

  const markAsRead = (id: string) => {
    if (readIds.includes(id)) return;
    const next = [...readIds, id];
    setReadIds(next);
    try {
      localStorage.setItem('mttq_read_notifications', JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadIds(allIds);
    try {
      localStorage.setItem('mttq_read_notifications', JSON.stringify(allIds));
    } catch (e) {
      console.error(e);
    }
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
          className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200"
        >
          {/* Drawer Header */}
          <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between border-b border-blue-600">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/15 backdrop-blur-md">
                <Bell className="w-5 h-5 text-cyan-200 animate-bounce" />
              </div>
              <div>
                <h2 className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                  Trung Tâm Thông Báo
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                      {unreadCount} mới
                    </span>
                  )}
                </h2>
                <p className="text-[11px] text-blue-100 font-medium">
                  Cập nhật thông tin, tin tức &amp; sự kiện trực tuyến
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Bar & Mark All Read */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
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

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-100/60">
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
                    onClick={() => {
                      markAsRead(item.id);
                      if (onSelectItem) onSelectItem(item);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                      isUnread
                        ? 'bg-white border-blue-300 shadow-md ring-1 ring-blue-400/20'
                        : 'bg-white/80 border-slate-200 hover:bg-white'
                    }`}
                  >
                    {isUnread && (
                      <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full bg-blue-600" />
                    )}

                    <div className="flex items-start gap-3">
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

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                            item.priority === 'CRITICAL'
                              ? 'bg-rose-600 text-white'
                              : item.priority === 'URGENT'
                              ? 'bg-amber-500 text-white'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.priority}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(item.created_at).toLocaleString('vi-VN')}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                          {item.title}
                        </h4>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {item.body}
                        </p>

                        {item.action_url && (
                          <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-blue-600 group-hover:underline">
                            <span>Xem chi tiết</span>
                            <ExternalLink className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-3 bg-white border-t border-slate-200 text-center text-[11px] text-slate-500 font-medium">
            Ủy ban MTTQ Việt Nam Phường Chánh Hiệp • Trung tâm Thông báo Realtime
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
