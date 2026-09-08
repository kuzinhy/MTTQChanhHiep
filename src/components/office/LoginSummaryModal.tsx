import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, Clock, User, Newspaper, FileText, Image, ShieldCheck, ArrowRight } from 'lucide-react';
import { AdminNotification, StaffUser, AuditLog } from '../../types';
import { adminCollaborationService } from '../../lib/adminCollaborationService';
import { AppStorageEngine } from '../../lib/storage';

interface LoginSummaryModalProps {
  currentAdmin: StaffUser | null;
  onNavigateToEntity?: (entityType: string, entityId?: string, route?: string) => void;
}

export const LoginSummaryModal: React.FC<LoginSummaryModalProps> = ({
  currentAdmin,
  onNavigateToEntity
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentChanges, setRecentChanges] = useState<AuditLog[]>([]);

  useEffect(() => {
    if (!currentAdmin?.id) return;

    // Check if popup was already shown in this browser session
    const shownKey = `admin_login_summary_shown_${currentAdmin.id}`;
    const alreadyShown = sessionStorage.getItem(shownKey);
    if (alreadyShown) return;

    // Retrieve last login time from storage or default to 24 hours ago
    const lastLoginKey = `admin_last_login_time_${currentAdmin.id}`;
    const lastLoginIso = localStorage.getItem(lastLoginKey) || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Fetch audit logs created by OTHER admins since last login
    const allLogs = AppStorageEngine.getAuditLogs();
    const otherAdminLogs = allLogs.filter((log) => {
      const isOther = log.userId !== currentAdmin.id;
      const isAfterLastLogin = new Date(log.timestamp).getTime() > new Date(lastLoginIso).getTime();
      return isOther && isAfterLastLogin;
    });

    if (otherAdminLogs.length > 0) {
      setRecentChanges(otherAdminLogs.slice(0, 5));
      setIsOpen(true);
    }

    // Mark current login time & mark summary as shown for this session
    localStorage.setItem(lastLoginKey, new Date().toISOString());
    sessionStorage.setItem(shownKey, 'true');
  }, [currentAdmin]);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-indigo-200 overflow-hidden z-10 flex flex-col"
        >
          {/* Header Banner */}
          <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 text-white relative">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/30 rounded-2xl border border-indigo-400/30 text-amber-300">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                  Tổng hợp phiên đăng nhập
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Xin chào, {currentAdmin?.fullname}!
                </h3>
                <p className="text-xs text-indigo-200/90 mt-0.5">
                  Dưới đây là các thay đổi nổi bật do Quản trị viên khác thực hiện kể từ lần làm việc trước của bạn.
                </p>
              </div>
            </div>
          </div>

          {/* List of changes */}
          <div className="p-6 max-h-[340px] overflow-y-auto space-y-3 bg-slate-50">
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              Các cập nhật mới nhất ({recentChanges.length})
            </p>

            {recentChanges.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs flex items-start gap-3 hover:border-indigo-300 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-900 text-white font-black text-xs flex items-center justify-center shrink-0 border border-indigo-700">
                  {log.userName.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-slate-900">
                      {log.userName}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {getTimeAgoText(log.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium mt-0.5 line-clamp-1">
                    {log.details || `${getActionVerbText(log.action)} ${log.entity}`}
                  </p>

                  {log.entityTitle && (
                    <p className="text-xs font-bold text-indigo-700 mt-1 line-clamp-1">
                      “{log.entityTitle}”
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Action */}
          <div className="p-5 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500 font-medium">
              Popup chỉ xuất hiện 01 lần duy nhất trong phiên làm việc này.
            </span>

            <button
              onClick={handleClose}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 hover:from-blue-800 hover:to-purple-900 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Đã hiểu &amp; Bắt đầu làm việc</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

function getActionVerbText(action: string): string {
  switch (action) {
    case 'CREATE': return 'Đã tạo mới';
    case 'UPDATE': return 'Đã cập nhật';
    case 'DELETE': return 'Đã xóa';
    case 'PUBLISH': return 'Đã xuất bản';
    case 'UNPUBLISH': return 'Đã gỡ xuất bản';
    case 'APPROVE': return 'Đã phê duyệt';
    default: return 'Đã thực hiện thao tác trên';
  }
}

function getTimeAgoText(isoString?: string): string {
  if (!isoString) return 'Gần đây';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}
