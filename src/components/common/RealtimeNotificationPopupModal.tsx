import React, { useState, useEffect, useRef } from 'react';
import { 
  Megaphone, 
  X, 
  CheckCircle, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Volume2, 
  Sparkles, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { NotificationItem } from '../../types';
import { notificationMasterService } from '../../lib/notificationMasterService';

interface RealtimeNotificationPopupModalProps {
  currentSpace?: 'PORTAL' | 'OFFICE';
  userId?: string;
  userRoles?: string[];
  onNavigateRoute?: (route: string) => void;
}

const SHOWN_POPUPS_STORAGE_KEY = 'mttq_shown_broadcast_popups_v2';

export const RealtimeNotificationPopupModal: React.FC<RealtimeNotificationPopupModalProps> = ({
  currentSpace = 'PORTAL',
  userId,
  userRoles,
  onNavigateRoute
}) => {
  const [activePopupItem, setActivePopupItem] = useState<NotificationItem | null>(null);
  const inMemoryShownRef = useRef<Set<string>>(new Set());
  const [shownPopupIds, setShownPopupIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(SHOWN_POPUPS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const initialSet = new Set<string>(parsed);
          parsed.forEach(id => inMemoryShownRef.current.add(id));
          return initialSet;
        }
      }
    } catch (e) {
      console.warn('[PopupModal] Error loading shown popup IDs:', e);
    }
    return new Set<string>();
  });

  const targetReadId = notificationMasterService.getTargetReadId(userId);
  const isInitialLoadRef = useRef(true);

  // Play gentle web audio chime sound on popup
  const playAlertChime = () => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const now = ctx.currentTime;
      // Dual tone pleasant chime (C5 -> G5)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5

      osc2.frequency.setValueAtTime(659.25, now + 0.15); // E5
      osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.35); // C6

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.3);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.warn('[PopupModal] Web Audio chime error:', e);
    }
  };

  // Helper to trigger popup for a notification if not previously shown (strictly 1 time)
  const triggerPopupForNotification = (item: NotificationItem) => {
    if (!item || !item.id) return;

    // Filter sent/active status
    if (item.status && item.status !== 'SENT' && item.status !== 'SENDING') return;

    // Synchronous immediate deduplication prevents parallel double execution
    if (inMemoryShownRef.current.has(item.id)) return;
    inMemoryShownRef.current.add(item.id);

    setShownPopupIds(prev => {
      const updated = new Set(prev).add(item.id);
      try {
        localStorage.setItem(SHOWN_POPUPS_STORAGE_KEY, JSON.stringify(Array.from(updated)));
      } catch (e) {
        console.warn('Failed saving shown popup IDs:', e);
      }
      return updated;
    });

    // Show popup & play sound chime exactly once
    setActivePopupItem(item);
    playAlertChime();
  };

  useEffect(() => {
    // 1. Subscribe to Firebase Firestore real-time notification updates
    const unsubscribeList = notificationMasterService.subscribeToNotifications(
      (list) => {
        if (!list || list.length === 0) return;

        // On first subscription callback, trigger popup for the latest unshown URGENT/BROADCAST item if created recently (< 2 hours)
        const latestItems = [...list].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

        if (isInitialLoadRef.current) {
          isInitialLoadRef.current = false;
          // Check if any top notification was created in last 2 hours and not shown
          const now = Date.now();
          const recentBroadcast = latestItems.find(item => {
            const ageMs = now - new Date(item.created_at || 0).getTime();
            return ageMs < 7200000; // 2 hours
          });
          if (recentBroadcast) {
            triggerPopupForNotification(recentBroadcast);
          }
        } else {
          // Real-time new notification arrived
          if (latestItems[0]) {
            triggerPopupForNotification(latestItems[0]);
          }
        }
      },
      userId,
      userRoles
    );

    // 2. Listen to cross-tab BroadcastChannel for immediate instant broadcast popup
    const unsubscribeBroadcast = notificationMasterService.onBroadcastMessage((item) => {
      if (item) {
        triggerPopupForNotification(item);
      }
    });

    return () => {
      unsubscribeList();
      unsubscribeBroadcast();
    };
  }, [userId, userRoles]);

  const handleCloseModal = () => {
    if (activePopupItem) {
      // Mark as read in Firestore and local storage
      notificationMasterService.markAsRead(activePopupItem.id, targetReadId);
    }
    setActivePopupItem(null);
  };

  const handleActionClick = () => {
    if (!activePopupItem) return;

    notificationMasterService.markAsRead(activePopupItem.id, targetReadId);
    
    const targetUrl = activePopupItem.action_url || (activePopupItem as any).url;
    if (targetUrl) {
      if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
        window.open(targetUrl, '_blank');
      } else if (onNavigateRoute) {
        onNavigateRoute(targetUrl);
      } else {
        window.location.hash = targetUrl.startsWith('#') ? targetUrl : `#${targetUrl}`;
      }
    } else if (onNavigateRoute) {
      // Default navigation based on category
      if (activePopupItem.category === 'news') onNavigateRoute('/tin-tuc');
      else if (activePopupItem.category === 'event') onNavigateRoute('/van-ban');
      else onNavigateRoute('/trang-chu');
    }

    setActivePopupItem(null);
  };

  // Only display popup on the public Portal / Home page, NEVER inside Admin / Digital Office
  if (currentSpace !== 'PORTAL' || !activePopupItem) return null;

  const isUrgent = activePopupItem.priority === 'URGENT' || (activePopupItem.type as string) === 'EMERGENCY_ALERT';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-lg w-full overflow-hidden flex flex-col relative text-slate-900 shadow-rose-950/20">
        
        {/* Top Announcement Banner */}
        <div className={`p-4 text-white flex items-center justify-between border-b ${
          isUrgent 
            ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 border-red-700 shadow-inner' 
            : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 border-blue-700'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-2xl shadow-xs shrink-0 animate-bounce">
              {isUrgent ? <ShieldAlert className="w-5 h-5 text-amber-200" /> : <Megaphone className="w-5 h-5 text-amber-300" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-white/90">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{isUrgent ? 'THÔNG BÁO KHẨN CẤP CAP NHẬT REALTIME' : 'THÔNG BÁO TỪ UỶ BAN MTTQ PHƯỜNG'}</span>
              </div>
              <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
                Phường Chánh Hiệp • TP. Thủ Dầu Một
              </h4>
            </div>
          </div>

          <button
            onClick={handleCloseModal}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all cursor-pointer"
            title="Đóng thông báo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black mb-2 uppercase tracking-wide ${
              isUrgent ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
            }`}>
              {activePopupItem.category === 'news' ? '📰 Tin tức - Sự kiện' : activePopupItem.category === 'event' ? '🗓️ Hoạt động Dân sinh' : '🏛️ Thông báo Hành chính'}
            </span>

            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
              {activePopupItem.title}
            </h3>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-line shadow-2xs">
            {activePopupItem.body}
          </div>

          {/* Issuer Meta Info */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-semibold border-t border-slate-100 pt-3 gap-2">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{activePopupItem.created_at ? new Date(activePopupItem.created_at).toLocaleString('vi-VN') : 'Mới phát hành'}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
              <span>Đơn vị phát: {activePopupItem.created_by || 'Ban Thường trực MTTQ Phường'}</span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleCloseModal}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-2xl font-bold text-xs transition-all cursor-pointer active:scale-95"
          >
            Đã hiểu & Đóng
          </button>

          {(activePopupItem.action_url || (activePopupItem as any).url || activePopupItem.category) && (
            <button
              type="button"
              onClick={handleActionClick}
              className={`px-5 py-2 text-white font-black text-xs rounded-2xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                isUrgent 
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-500/20' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20'
              }`}
            >
              <span>Xem chi tiết nội dung</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
