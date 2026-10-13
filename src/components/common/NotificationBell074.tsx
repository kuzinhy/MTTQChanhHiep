// Lucian UX/UI Prompt #074 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#074
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Newspaper, 
  Calendar, 
  FileText, 
  AlertCircle, 
  MessageSquare,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { NotificationItem } from '../../types';
import { notificationMasterService } from '../../lib/notificationMasterService';

export interface NotificationBell074Props {
  userId?: string;
  userRoles?: string[];
  currentUser?: any;
  onOpenFullCenter?: () => void;
  onSelectNotification?: (item: NotificationItem) => void;
  variant?: 'portal-banner' | 'office-header' | 'default';
  align?: 'left' | 'right';
  className?: string;
  title?: string;
}

export const NotificationBell074: React.FC<NotificationBell074Props> = ({
  userId,
  userRoles,
  currentUser,
  onOpenFullCenter,
  onSelectNotification,
  variant = 'default',
  align = 'right',
  className = '',
  title = 'Thông báo'
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [isRinging, setIsRinging] = useState<boolean>(false);
  const [isPopping, setIsPopping] = useState<boolean>(false);
  const [pushedRowId, setPushedRowId] = useState<string | null>(null);
  const [clearingIds, setClearingIds] = useState<Set<string>>(new Set());

  const containerRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const firstLoadRef = useRef<boolean>(true);

  // Cross-device sync target identifier
  const targetId = useMemo(
    () => notificationMasterService.getTargetReadId(userId || currentUser?.id),
    [userId, currentUser]
  );

  // 1. Subscribe to Firebase Firestore cross-device read status & notifications
  useEffect(() => {
    const unsubRead = notificationMasterService.subscribeToReadStatus(
      targetId,
      (syncedIds) => {
        setReadIds(syncedIds);
      }
    );

    const unsubList = notificationMasterService.subscribeToNotifications(
      (list) => {
        setNotifications((prev) => {
          // If this is a real-time update with new notification
          if (!firstLoadRef.current && list.length > 0) {
            const prevFirstId = prev[0]?.id;
            const newFirstId = list[0]?.id;

            if (newFirstId && newFirstId !== prevFirstId) {
              // Trigger bell shake and badge pop
              setIsRinging(true);
              setIsPopping(true);
              setPushedRowId(newFirstId);

              // Auto-clear row push tag after animation
              setTimeout(() => {
                setPushedRowId(null);
              }, 1200);
            }
          }
          firstLoadRef.current = false;
          return list;
        });
      },
      userId || currentUser?.id,
      userRoles || (currentUser?.role ? [currentUser.role] : undefined)
    );

    // Also listen to broadcast events for instant live shake
    const unsubBroadcast = notificationMasterService.onBroadcastMessage((newItem) => {
      setIsRinging(true);
      setIsPopping(true);
      setPushedRowId(newItem.id);
      setTimeout(() => setPushedRowId(null), 1200);
    });

    return () => {
      unsubRead();
      unsubList();
      unsubBroadcast();
    };
  }, [targetId, userId, userRoles, currentUser]);

  // Click outside to close & Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        bellRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Remove animation classes when ended
  const handleBellAnimationEnd = () => {
    setIsRinging(false);
  };

  const handleBadgeAnimationEnd = () => {
    setIsPopping(false);
  };

  // Toggle fold in / out
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Mark single item as read
  const handleItemClick = async (item: NotificationItem) => {
    if (!readIds.includes(item.id)) {
      // Mark as clearing dot
      setClearingIds((prev) => new Set(prev).add(item.id));
      await notificationMasterService.markAsRead(item.id, targetId);
    }

    if (onSelectNotification) {
      onSelectNotification(item);
      setIsOpen(false);
    }
  };

  // Mark all read with staggered clearing of dots
  const handleMarkAllRead = async () => {
    const unreadItems = notifications.filter(
      (n) => !readIds.includes(n.id) && !clearingIds.has(n.id)
    );
    if (unreadItems.length === 0) return;

    // Stagger clear dots one by one
    unreadItems.forEach((item, index) => {
      setTimeout(() => {
        setClearingIds((prev) => {
          const next = new Set(prev);
          next.add(item.id);
          return next;
        });
      }, index * 75);
    });

    // Commit to Firestore sync after dots start clearing
    setTimeout(async () => {
      const allIds = unreadItems.map((n) => n.id);
      await notificationMasterService.markAllAsRead(allIds, targetId);
    }, unreadItems.length * 75 + 100);
  };

  const effectiveUnreadCount = notifications.filter(
    (n) => !readIds.includes(n.id) && !clearingIds.has(n.id)
  ).length;

  const displayCount = effectiveUnreadCount > 99 ? '99+' : effectiveUnreadCount;

  // Format relative timestamp
  const formatTime = (isoString?: string) => {
    if (!isoString) return 'Gần đây';
    try {
      const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diffSec < 60) return 'Vừa xong';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin} phút trước`;
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour} giờ trước`;
      const diffDay = Math.floor(diffHour / 24);
      if (diffDay < 7) return `${diffDay} ngày trước`;
      return new Date(isoString).toLocaleDateString('vi-VN');
    } catch {
      return 'Gần đây';
    }
  };

  const getItemIcon = (category?: string, priority?: string) => {
    if (priority === 'URGENT') {
      return <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />;
    }
    switch (category) {
      case 'news':
        return <Newspaper className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'document':
        return <FileText className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'opinion':
        return <MessageSquare className="w-4 h-4 text-purple-500 shrink-0" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />;
    }
  };

  // Determine button styling variant
  let btnClasses = 'u074-bell-btn';
  if (variant === 'portal-banner') {
    btnClasses += ' u074-variant-portal';
  } else if (variant === 'office-header') {
    btnClasses += ' u074-variant-office';
  } else {
    btnClasses += ' u074-variant-default';
  }

  return (
    <div className={`u074-wrap ${className}`} ref={containerRef}>
      <style>{`
        /* Lucian UX/UI Prompt #074 Scoped Theming */
        .u074-wrap {
          position: relative;
          display: inline-block;
          font-family: inherit;
        }

        :root {
          color-scheme: light;
          --ux-page: #F4F2EE;
          --ux-surface: #FFFFFF;
          --ux-surface-2: #F5F3EF;
          --ux-surface-3: #EAE7E1;
          --ux-ink: #16151B;
          --ux-ink-2: #57535F;
          --ux-ink-3: #8E8A97;
          --ux-line: rgba(22, 21, 27, 0.09);
          --ux-line-2: rgba(22, 21, 27, 0.17);
          --ux-accent: #6A57F2;
          --ux-accent-2: #2F8FE0;
          --ux-accent-soft: rgba(106, 87, 242, 0.12);
          --ux-accent-ink: #FFFFFF;
          --ux-mint: #119C72;
          --ux-warn: #D6731E;
          --ux-danger: #D93A55;
          --ux-glass: rgba(255, 255, 255, 0.95);
          --ux-glass-line: rgba(255, 255, 255, 0.85);
          --ux-shadow: rgba(40, 30, 80, 0.14);
          --ux-shadow-strong: rgba(40, 30, 80, 0.28);
          --ux-ease: cubic-bezier(.2, .8, .2, 1);
          --ux-spring: cubic-bezier(.34, 1.45, .64, 1);
        }

        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .u074-wrap {
            color-scheme: dark;
            --ux-page: #07080D;
            --ux-surface: #13141C;
            --ux-surface-2: #1A1B25;
            --ux-surface-3: #252632;
            --ux-ink: #F4F0E8;
            --ux-ink-2: rgba(244, 240, 232, 0.68);
            --ux-ink-3: rgba(244, 240, 232, 0.42);
            --ux-line: rgba(255, 255, 255, 0.08);
            --ux-line-2: rgba(255, 255, 255, 0.16);
            --ux-accent: #B7A4FF;
            --ux-accent-2: #7DB4FF;
            --ux-accent-soft: rgba(183, 164, 255, 0.15);
            --ux-accent-ink: #0B0C12;
            --ux-mint: #7EE8C0;
            --ux-warn: #FFB26B;
            --ux-danger: #FF7D8C;
            --ux-glass: rgba(19, 20, 28, 0.95);
            --ux-glass-line: rgba(255, 255, 255, 0.14);
            --ux-shadow: rgba(0, 0, 0, 0.45);
            --ux-shadow-strong: rgba(0, 0, 0, 0.72);
          }
        }

        :root[data-theme="dark"] .u074-wrap,
        .dark .u074-wrap {
          color-scheme: dark;
          --ux-page: #07080D;
          --ux-surface: #13141C;
          --ux-surface-2: #1A1B25;
          --ux-surface-3: #252632;
          --ux-ink: #F4F0E8;
          --ux-ink-2: rgba(244, 240, 232, 0.68);
          --ux-ink-3: rgba(244, 240, 232, 0.42);
          --ux-line: rgba(255, 255, 255, 0.08);
          --ux-line-2: rgba(255, 255, 255, 0.16);
          --ux-accent: #B7A4FF;
          --ux-accent-2: #7DB4FF;
          --ux-accent-soft: rgba(183, 164, 255, 0.15);
          --ux-accent-ink: #0B0C12;
          --ux-mint: #7EE8C0;
          --ux-warn: #FFB26B;
          --ux-danger: #FF7D8C;
          --ux-glass: rgba(19, 20, 28, 0.95);
          --ux-glass-line: rgba(255, 255, 255, 0.14);
          --ux-shadow: rgba(0, 0, 0, 0.45);
          --ux-shadow-strong: rgba(0, 0, 0, 0.72);
        }

        /* Bell Trigger Button */
        .u074-bell-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          cursor: pointer;
          transition: transform 0.18s var(--ux-ease), background-color 0.18s ease, border-color 0.18s ease;
          border: 1px solid transparent;
          outline: none;
          user-select: none;
        }

        .u074-bell-btn:focus-visible {
          box-shadow: 0 0 0 2px var(--ux-accent);
        }

        /* Variant: Portal banner (white on gradient blue) */
        .u074-variant-portal {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.22);
        }
        .u074-variant-portal:hover {
          background: rgba(255, 255, 255, 0.26);
          border-color: rgba(255, 255, 255, 0.38);
        }

        /* Variant: Office Header */
        .u074-variant-office {
          width: 34px;
          height: 34px;
          background: var(--ux-surface-2);
          color: var(--ux-ink);
          border-color: var(--ux-line);
        }
        .u074-variant-office:hover {
          background: var(--ux-surface-3);
          color: var(--ux-accent);
          border-color: var(--ux-line-2);
        }

        /* Variant: Default */
        .u074-variant-default {
          width: 36px;
          height: 36px;
          background: var(--ux-surface);
          color: var(--ux-ink);
          border-color: var(--ux-line);
          box-shadow: 0 1px 3px var(--ux-shadow);
        }
        .u074-variant-default:hover {
          background: var(--ux-surface-2);
        }

        /* Bell shake animation */
        .u074-bell-icon {
          transform-origin: top center;
          transition: transform 0.2s var(--ux-spring);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .u074-bell-btn.ring .u074-bell-icon {
          animation: u074-shake 0.65s var(--ux-spring);
        }

        @keyframes u074-shake {
          0% { transform: rotate(0deg); }
          15% { transform: rotate(14deg); }
          30% { transform: rotate(-12deg); }
          45% { transform: rotate(10deg); }
          60% { transform: rotate(-8deg); }
          75% { transform: rotate(4deg); }
          90% { transform: rotate(-2deg); }
          100% { transform: rotate(0deg); }
        }

        /* Badge count and pop */
        .u074-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          min-width: 18px;
          height: 18px;
          padding: 0 4px;
          border-radius: 9999px;
          background: var(--ux-danger);
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          line-height: 18px;
          text-align: center;
          border: 2px solid var(--ux-surface);
          box-shadow: 0 1px 4px rgba(217, 58, 85, 0.4);
          transform-origin: center center;
          transition: transform 0.25s var(--ux-spring), opacity 0.2s ease;
        }

        .u074-badge.pop {
          animation: u074-badge-pop 0.38s var(--ux-spring);
        }

        @keyframes u074-badge-pop {
          0% { transform: scale(1); }
          40% { transform: scale(1.42); }
          100% { transform: scale(1); }
        }

        /* Fold-in / Fold-out Dropdown */
        .u074-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          ${align === 'left' ? 'left: 0;' : 'right: 0;'}
          width: 350px;
          max-width: calc(100vw - 20px);
          background: var(--ux-glass);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid var(--ux-line-2);
          border-radius: 18px;
          box-shadow: 0 12px 36px var(--ux-shadow-strong), 0 2px 10px var(--ux-shadow);
          overflow: hidden;
          z-index: 100;
          color: var(--ux-ink);
          transform-origin: ${align === 'left' ? 'top left' : 'top right'};
          transition: transform 0.28s var(--ux-spring), opacity 0.2s var(--ux-ease);
        }

        .u074-dropdown[data-open="false"] {
          opacity: 0;
          transform: scale(0.88) translateY(-10px);
          pointer-events: none;
        }

        .u074-dropdown[data-open="true"] {
          opacity: 1;
          transform: scale(1) translateY(0);
          pointer-events: auto;
        }

        /* Header */
        .u074-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px 10px;
          border-bottom: 1px solid var(--ux-line);
          background: var(--ux-surface-2);
        }

        .u074-title-row {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .u074-title {
          font-size: 13px;
          font-weight: 800;
          color: var(--ux-ink);
          letter-spacing: -0.01em;
        }

        .u074-count-pill {
          font-size: 10px;
          font-weight: 700;
          padding: 1px 7px;
          border-radius: 9999px;
          background: var(--ux-accent-soft);
          color: var(--ux-accent);
        }

        .u074-mark-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          color: var(--ux-accent);
          background: transparent;
          border: none;
          padding: 4px 6px;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.15s ease, opacity 0.15s ease;
        }
        .u074-mark-btn:hover {
          background: var(--ux-accent-soft);
        }
        .u074-mark-btn:disabled {
          opacity: 0.4;
          cursor: default;
        }

        /* List container */
        .u074-list {
          max-height: 360px;
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .u074-list::-webkit-scrollbar {
          width: 5px;
        }
        .u074-list::-webkit-scrollbar-track {
          background: transparent;
        }
        .u074-list::-webkit-scrollbar-thumb {
          background: var(--ux-line-2);
          border-radius: 4px;
        }

        /* Row item */
        .u074-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 9px 10px;
          border-radius: 12px;
          background: var(--ux-surface);
          border: 1px solid var(--ux-line);
          cursor: pointer;
          text-align: left;
          transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.15s var(--ux-ease);
          position: relative;
        }

        .u074-row:hover {
          background: var(--ux-surface-2);
          border-color: var(--ux-line-2);
          transform: translateY(-1px);
        }

        .u074-row:focus-visible {
          outline: 2px solid var(--ux-accent);
          outline-offset: -1px;
        }

        .u074-row.unread {
          background: var(--ux-surface);
          border-left: 3px solid var(--ux-accent);
        }

        /* New row pushed in */
        .u074-row.push-in {
          animation: u074-row-push 0.42s var(--ux-spring);
        }

        @keyframes u074-row-push {
          0% {
            opacity: 0;
            transform: translateY(-14px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .u074-icon-box {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: var(--ux-surface-2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .u074-content {
          flex: 1;
          min-width: 0;
        }

        .u074-item-title {
          font-size: 12px;
          font-weight: 700;
          color: var(--ux-ink);
          line-height: 1.35;
          margin-bottom: 2px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .u074-item-desc {
          font-size: 11px;
          color: var(--ux-ink-2);
          line-height: 1.3;
          margin-bottom: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .u074-item-time {
          font-size: 10px;
          font-weight: 600;
          color: var(--ux-ink-3);
        }

        /* Unread Dot */
        .u074-dot {
          width: 7px;
          height: 7px;
          border-radius: 9999px;
          background: var(--ux-accent);
          box-shadow: 0 0 6px var(--ux-accent);
          flex-shrink: 0;
          margin-top: 6px;
          transform: scale(1);
          opacity: 1;
          transition: transform 0.28s var(--ux-spring), opacity 0.22s ease;
        }

        .u074-dot.cleared {
          transform: scale(0);
          opacity: 0;
        }

        /* Empty state */
        .u074-empty {
          padding: 30px 16px;
          text-align: center;
          color: var(--ux-ink-3);
          font-size: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        /* Footer */
        .u074-footer {
          padding: 8px 12px;
          background: var(--ux-surface-2);
          border-top: 1px solid var(--ux-line);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .u074-footer-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          color: var(--ux-accent);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: background-color 0.15s ease;
        }

        .u074-footer-btn:hover {
          background: var(--ux-accent-soft);
        }

        /* Accessibility: Prefers Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .u074-bell-btn.ring .u074-bell-icon {
            animation: none !important;
          }
          .u074-badge.pop {
            animation: none !important;
          }
          .u074-dropdown {
            transition: opacity 0.1s ease !important;
            transform: none !important;
          }
          .u074-row.push-in {
            animation: none !important;
          }
          .u074-dot {
            transition: none !important;
          }
        }
      `}</style>

      {/* Bell Trigger */}
      <button
        ref={bellRef}
        type="button"
        className={`${btnClasses} ${isRinging ? 'ring' : ''}`}
        onClick={toggleDropdown}
        onAnimationEnd={handleBellAnimationEnd}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`${title} (${effectiveUnreadCount} chưa đọc)`}
        title={title}
      >
        <span className="u074-bell-icon">
          <Bell className="w-4 h-4 sm:w-[17px] sm:h-[17px]" />
        </span>

        {effectiveUnreadCount > 0 && (
          <span
            className={`u074-badge ${isPopping ? 'pop' : ''}`}
            onAnimationEnd={handleBadgeAnimationEnd}
          >
            {displayCount}
          </span>
        )}
      </button>

      {/* Dropdown fold in / out */}
      <div 
        className="u074-dropdown" 
        data-open={isOpen ? 'true' : 'false'}
        role="region"
        aria-label="Danh sách thông báo"
      >
        {/* Dropdown Header */}
        <div className="u074-header">
          <div className="u074-title-row">
            <span className="u074-title">{title}</span>
            {effectiveUnreadCount > 0 && (
              <span className="u074-count-pill">{effectiveUnreadCount} mới</span>
            )}
          </div>

          <button
            type="button"
            className="u074-mark-btn"
            onClick={handleMarkAllRead}
            disabled={effectiveUnreadCount === 0}
            title="Đánh dấu tất cả đã đọc"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Đã đọc hết</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="u074-list">
          {notifications.length === 0 ? (
            <div className="u074-empty">
              <Bell className="w-6 h-6 opacity-30" />
              <span>Chưa có thông báo nào</span>
            </div>
          ) : (
            notifications.slice(0, 7).map((item) => {
              const isUnread = !readIds.includes(item.id);
              const isClearing = clearingIds.has(item.id);
              const isPushed = pushedRowId === item.id;

              return (
                <div
                  key={item.id}
                  className={`u074-row ${isUnread && !isClearing ? 'unread' : ''} ${
                    isPushed ? 'push-in' : ''
                  }`}
                  onClick={() => handleItemClick(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleItemClick(item);
                    }
                  }}
                >
                  <div className="u074-icon-box">
                    {getItemIcon(item.category, item.priority)}
                  </div>

                  <div className="u074-content">
                    <div className="u074-item-title">{item.title}</div>
                    {(item.summary || item.body) && (
                      <div className="u074-item-desc">{item.summary || item.body}</div>
                    )}
                    <div className="u074-item-time">{formatTime(item.created_at)}</div>
                  </div>

                  {/* Dot with staggered clearing transition */}
                  <span
                    className={`u074-dot ${
                      !isUnread || isClearing ? 'cleared' : ''
                    }`}
                    aria-hidden="true"
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Dropdown Footer */}
        {onOpenFullCenter && (
          <div className="u074-footer">
            <button
              type="button"
              className="u074-footer-btn"
              onClick={() => {
                setIsOpen(false);
                onOpenFullCenter();
              }}
            >
              <span>Xem tất cả thông báo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
