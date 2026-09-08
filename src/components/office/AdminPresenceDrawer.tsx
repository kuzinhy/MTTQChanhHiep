import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, X, Activity, ShieldCheck, Laptop, Clock, Edit3, Eye } from 'lucide-react';
import { AdminPresence, StaffUser } from '../../types';
import { adminCollaborationService } from '../../lib/adminCollaborationService';

interface AdminPresenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentAdmin: StaffUser | null;
}

export const AdminPresenceDrawer: React.FC<AdminPresenceDrawerProps> = ({
  isOpen,
  onClose,
  currentAdmin
}) => {
  const [presenceList, setPresenceList] = useState<AdminPresence[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = adminCollaborationService.subscribeToAdminPresence((list) => {
      setPresenceList(list);
    });

    return () => {
      unsubscribe();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter online / idle / offline
  const onlineAdmins = presenceList.filter((p) => p.status === 'online');
  const idleAdmins = presenceList.filter((p) => p.status === 'idle');
  const offlineAdmins = presenceList.filter((p) => p.status === 'offline');

  const totalActiveCount = onlineAdmins.length + idleAdmins.length;

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
          <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <span>Quản trị viên đang hoạt động</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-500 text-white shadow-xs">
                    {totalActiveCount} online
                  </span>
                </h2>
                <p className="text-xs text-indigo-200/80 mt-0.5">
                  Hợp tác quản trị thời gian thực &amp; theo dõi sự hiện diện
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of admins */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Active section */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                <span>Đang hoạt động ({totalActiveCount})</span>
                <span className="flex items-center gap-1 text-emerald-600 font-extrabold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Realtime
                </span>
              </div>

              {totalActiveCount === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Chưa có quản trị viên nào khác online.
                </div>
              ) : (
                <div className="space-y-3">
                  {[...onlineAdmins, ...idleAdmins].map((item) => {
                    const isSelf = item.adminId === currentAdmin?.id;
                    const isIdle = item.status === 'idle';

                    return (
                      <div
                        key={item.adminId}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isSelf
                            ? 'bg-indigo-50/60 border-indigo-200 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center border-2 border-white shadow-2xs">
                                {item.avatar ? (
                                  <img src={item.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                  (item.name || 'A').charAt(0).toUpperCase()
                                )}
                              </div>
                              <span
                                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                  isIdle ? 'bg-amber-400' : 'bg-emerald-500'
                                }`}
                                title={isIdle ? 'Đang tạm nghỉ (Idle)' : 'Đang hoạt động (Online)'}
                              />
                            </div>

                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-black text-slate-900">
                                  {item.name}
                                </span>
                                {isSelf && (
                                  <span className="px-1.5 py-0.2 rounded-md bg-indigo-100 text-indigo-700 text-[9px] font-black uppercase">
                                    Tôi
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 font-medium">{item.email}</p>
                            </div>
                          </div>

                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-200 text-slate-700 uppercase">
                            {item.role || 'ADMIN'}
                          </span>
                        </div>

                        {/* Route / Activity context */}
                        <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-col gap-1 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            <span className="font-semibold text-slate-800">Đang truy cập:</span>
                            <span className="text-blue-700 font-extrabold truncate">
                              {getRouteLabel(item.currentRoute)}
                            </span>
                          </div>

                          {item.currentEntityTitle && (
                            <div className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 mt-1">
                              <Edit3 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span className="font-extrabold text-[11px] truncate">
                                Đang chỉnh sửa: “{item.currentEntityTitle}”
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Laptop className="w-3 h-3 text-slate-400" />
                              {item.deviceCount || 1} thiết bị/tab
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {getTimeAgoText(item.lastSeenAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Offline section */}
            {offlineAdmins.length > 0 && (
              <div className="pt-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Ngoại tuyến gần đây ({offlineAdmins.length})
                </div>
                <div className="space-y-2 opacity-60">
                  {offlineAdmins.map((item) => (
                    <div key={item.adminId} className="p-3 bg-slate-100 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                        <span className="font-bold text-slate-700">{item.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{getTimeAgoText(item.lastSeenAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer info */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 text-center">
            Trạng thái hiện diện được cập nhật tự động thời gian thực qua Firestore Presence.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

function getRouteLabel(route?: string): string {
  if (!route) return 'Dashboard Quan Trị';
  if (route.includes('news') || route.includes('cms')) return 'Tin tức & Hoạt động';
  if (route.includes('documents')) return 'Văn bản & Chỉ đạo';
  if (route.includes('cultural')) return 'Không gian văn hóa HCM';
  if (route.includes('competitions')) return 'Cuộc thi trực tuyến';
  if (route.includes('media')) return 'Thư viện Đa phương tiện';
  if (route.includes('staff')) return 'Quản lý Tài khoản';
  if (route.includes('analytics')) return 'Thống kê & Báo cáo';
  return route;
}

function getTimeAgoText(isoString?: string): string {
  if (!isoString) return 'Vừa xong';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Đang hoạt động';
  if (mins < 60) return `Hoạt động ${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  return `Hoạt động ${hours} giờ trước`;
}
