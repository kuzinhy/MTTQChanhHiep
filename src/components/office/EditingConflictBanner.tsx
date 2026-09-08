import React, { useEffect, useState } from 'react';
import { ShieldAlert, Users, RefreshCw, Eye, ArrowRight, Save } from 'lucide-react';
import { adminCollaborationService } from '../../lib/adminCollaborationService';
import { StaffUser, EntityEditingPresence } from '../../types';

interface EditingConflictBannerProps {
  currentAdmin: StaffUser | null;
  entityType: string;
  entityId: string;
  entityTitle: string;
  onReloadLatestVersion?: () => void;
  onContinueMyVersion?: () => void;
}

export const EditingConflictBanner: React.FC<EditingConflictBannerProps> = ({
  currentAdmin,
  entityType,
  entityId,
  entityTitle,
  onReloadLatestVersion,
  onContinueMyVersion
}) => {
  const [editingPresence, setEditingPresence] = useState<EntityEditingPresence | null>(null);
  const [hasServerConflict, setHasServerConflict] = useState(false);
  const [conflictEditorName, setConflictEditorName] = useState<string>('');

  useEffect(() => {
    if (!currentAdmin?.id || !entityId) return;

    // 1. Register editing presence
    adminCollaborationService.registerEditingEntity({
      admin: currentAdmin,
      entityType,
      entityId,
      entityTitle
    });

    // 2. Heartbeat registration every 30 seconds
    const interval = setInterval(() => {
      adminCollaborationService.registerEditingEntity({
        admin: currentAdmin,
        entityType,
        entityId,
        entityTitle
      });
    }, 30000);

    // 3. Subscribe to editing presence
    const unsubscribePresence = adminCollaborationService.subscribeToEditingPresence(
      entityType,
      entityId,
      (presence) => {
        setEditingPresence(presence);
      }
    );

    // 4. Subscribe to realtime notifications to catch when another admin saves this entity!
    const unsubscribeNotif = adminCollaborationService.subscribeToAdminNotifications(
      currentAdmin.id,
      (notifications) => {
        if (!notifications || notifications.length === 0) return;
        const latest = notifications[0];
        if (
          latest &&
          latest.actorAdminId !== currentAdmin.id &&
          latest.entityType === entityType &&
          latest.entityId === entityId &&
          (Date.now() - new Date(latest.createdAt).getTime()) < 60000
        ) {
          setHasServerConflict(true);
          setConflictEditorName(latest.actorName);
        }
      }
    );

    return () => {
      clearInterval(interval);
      unsubscribePresence();
      unsubscribeNotif();
      adminCollaborationService.unregisterEditingEntity({
        adminId: currentAdmin.id,
        entityType,
        entityId
      });
    };
  }, [currentAdmin, entityType, entityId, entityTitle]);

  // Other active editors excluding current admin
  const otherEditors = (editingPresence?.editors || []).filter(
    (e) => e.adminId !== currentAdmin?.id
  );

  if (otherEditors.length === 0 && !hasServerConflict) return null;

  return (
    <div className="flex flex-col gap-2 mb-4">
      {/* 1. SOFT EDIT LOCK WARNING: Another admin is currently in edit mode */}
      {otherEditors.length > 0 && (
        <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-4 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-sm shrink-0">
              <Users className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <span>Cảnh báo đồng thời chỉnh sửa</span>
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
              </p>
              <p className="text-sm font-bold text-amber-950 mt-0.5">
                ⚠ {otherEditors.map((e) => e.adminName).join(', ')} cũng đang mở và chỉnh sửa nội dung này.
              </p>
            </div>
          </div>
          <span className="text-xs font-medium text-amber-800 bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 shrink-0">
            Hãy chú ý trao đổi để tránh lưu đè dữ liệu lên nhau.
          </span>
        </div>
      )}

      {/* 2. SERVER CONFLICT WARNING: Another admin just saved changes to this exact item while you are editing */}
      {hasServerConflict && (
        <div className="bg-rose-500/15 border-2 border-rose-500/50 rounded-2xl p-4 text-rose-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg animate-bounce-once">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-md shrink-0">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                <span>Dữ liệu trên máy chủ vừa thay đổi</span>
              </p>
              <p className="text-sm font-bold text-rose-950 mt-0.5">
                {conflictEditorName || 'Quản trị viên khác'} vừa lưu phiên bản mới của bài viết/nội dung này trên hệ thống!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onReloadLatestVersion && (
              <button
                type="button"
                onClick={() => {
                  setHasServerConflict(false);
                  onReloadLatestVersion();
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Tải phiên bản mới</span>
              </button>
            )}
            {onContinueMyVersion && (
              <button
                type="button"
                onClick={() => {
                  setHasServerConflict(false);
                  onContinueMyVersion();
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-rose-300 text-rose-900 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                <span>Giữ bản của tôi</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
