import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  User, 
  LogOut, 
  CheckCircle,
  StickyNote,
  Calendar,
  Key,
  Globe,
  ChevronDown,
  UserCheck,
  Building2,
  Lock,
  Layers,
  Activity,
  Users,
  ShieldAlert,
  Cloud,
  RefreshCw,
  Menu,
  BellRing,
  Check,
  Phone,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getRoleBadgeStyle, getRoleLabel } from '../../lib/rbac';
import { OptimizedImage } from '../common/OptimizedImage';
import { UserRole, StaffUser, AdminNotification, AdminPresence } from '../../types';
import { browserNotificationService } from '../../lib/browserNotifications';
import { adminCollaborationService } from '../../lib/adminCollaborationService';
import { AdminPresenceDrawer } from './AdminPresenceDrawer';
import { NotificationCenterDrawer } from './NotificationCenterDrawer';
import { OfflineSyncStatusWidget } from '../common/OfflineSyncStatusWidget';

interface DigitalOfficeHeaderProps {
  staffName: string;
  staffPosition: string;
  staffAvatar?: string;
  staffRole?: string;
  staffEmail?: string;
  staffDepartment?: string;
  currentUser?: StaffUser | null;
  onNavigate?: (view: string) => void;
  onNavigateToEntity?: (entityType: string, entityId?: string, route?: string) => void;
  onOpenProfile?: () => void;
  onOpenAi: () => void;
  onGoToPortal?: () => void;
  onLogout: () => void;
  onTriggerSimulatedOpinion?: () => void;
  onTriggerSimulatedDocApproval?: () => void;
  onForceCloudSync?: () => void;
  onToggleMobileSidebar?: () => void;
  onOpenDigitalDirectory?: () => void;
  onOpenBackupModal?: () => void;
  onOpenGlobalSearch?: () => void;
}



export const DigitalOfficeHeader: React.FC<DigitalOfficeHeaderProps> = (props) => {
  const [presenceDrawerOpen, setPresenceDrawerOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [activeAdminsCount, setActiveAdminsCount] = useState<number>(1);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);

  const userMenuRef = useRef<HTMLDivElement>(null);

  const {
    staffName,
    staffPosition,
    staffAvatar,
    staffRole = 'STAFF',
    staffEmail,
    currentUser,
    onNavigate,
    onNavigateToEntity,
    onOpenProfile,
    onOpenAi,
    onGoToPortal,
    onLogout,
    onToggleMobileSidebar,
    onOpenDigitalDirectory,
    onOpenBackupModal,
  } = props;

  // Subscribe to realtime presence count & notifications
  useEffect(() => {
    const unsubPresence = adminCollaborationService.subscribeToAdminPresence((list) => {
      const active = list.filter((p) => p.status === 'online' || p.status === 'idle');
      setActiveAdminsCount(Math.max(1, active.length));
    });

    let unsubNotif: (() => void) | null = null;
    if (currentUser?.id) {
      unsubNotif = adminCollaborationService.subscribeToAdminNotifications(
        currentUser.id,
        (notifications) => {
          const unread = notifications.filter((n) => !n.isRead).length;
          setUnreadNotifCount(unread);
        }
      );
    }

    return () => {
      unsubPresence();
      if (unsubNotif) unsubNotif();
    };
  }, [currentUser]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserMenuAction = (viewName: string) => {
    setUserMenuOpen(false);
    if (onNavigate) {
      onNavigate(viewName);
    } else if (viewName === 'profile' && onOpenProfile) {
      onOpenProfile();
    }
  };

  const role = (staffRole as UserRole) || 'STAFF';

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-4 py-1.5 sticky top-0 z-50 flex items-center justify-between shadow-2xs">
        {/* div:nth-of-type(1) - Title & Status */}
        <div className="flex items-center gap-2 flex-1">
          {onToggleMobileSidebar && (
            <button 
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-1 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors mr-0.5 shrink-0 cursor-pointer"
              title="Mở menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}
          <div className="hidden xs:flex w-7 h-7 rounded-lg bg-white p-0.5 items-center justify-center shrink-0 border border-slate-200 shadow-2xs">
            <OptimizedImage
              src="https://res.cloudinary.com/idt08wyp/image/upload/v1789907080/Logo-Mat-Tran-To-Quoc-Viet-Nam.png"
              alt="Logo MTTQ"
              variant="thumbnail"
              priority={true}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0 shrink-0">
            <div className="flex items-center gap-1.5 flex-nowrap whitespace-nowrap">
              <h1 className="text-xs font-black text-slate-900 tracking-tight whitespace-nowrap inline-block shrink-0">
                VĂN PHÒNG SỐ MTTQ PHƯỜNG CHÁNH HIỆP
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.2 text-[8px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-md shrink-0">
                Admin
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium hidden md:block">
              Quản trị nghiệp vụ hành chính toàn phường
            </p>
          </div>
        </div>

        {/* div:nth-of-type(2) - Center Spacer/Toolbox */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="flex items-center gap-3">
             <OfflineSyncStatusWidget />
          </div>
        </div>

        {/* div:nth-of-type(3) - Right Header Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-end">
          {/* div:nth-of-type(1) - Portal Link */}
          <div className="shrink-0">
            {onGoToPortal && (
              <button
                onClick={onGoToPortal}
                className="flex items-center gap-1 px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-[10px] rounded-lg transition-all active:scale-95 cursor-pointer shadow-2xs"
                title="Về trang chủ"
              >
                <Building2 className="w-3 h-3 text-slate-600" />
                <span className="hidden sm:inline">Trang chủ</span>
              </button>
            )}
          </div>

          {/* div:nth-of-type(2) - Notifications Bell Container */}
          <div className="relative">
            {/* div:nth-of-type(1) - Notification Bell Trigger */}
            <div className="relative z-10">
              <button
                onClick={() => setNotifDrawerOpen(true)}
                className="p-1.5 hover:bg-blue-50 rounded-lg relative text-slate-600 hover:text-blue-700 transition-colors cursor-pointer"
                title="Trung tâm Thông báo Quản trị"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifCount > 0 && (
                  <>
                    <span className="absolute -top-0.5 -right-0.5 px-1 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[8px] ring-2 ring-white animate-ping" />
                    <span className="absolute -top-0.5 -right-0.5 px-1 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[8px] ring-2 ring-white">
                      {unreadNotifCount}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* div:nth-of-type(3) - AI & Profile */}
          <div className="flex items-center gap-2 border-l border-slate-200 pl-2">
            <div className="p-[1px] rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-xs hover:shadow-md transition-all">
              <button
                onClick={onOpenAi}
                className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-[10px] rounded-[7px] transition-all active:scale-95 cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-3 h-3 text-amber-300 animate-spin-slow" />
                <span className="text-white font-bold hidden sm:inline">Trợ lý AI</span>
              </button>
            </div>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-1.5 p-0.5 sm:pr-2 rounded-xl transition-all cursor-pointer text-left border ${
                  userMenuOpen 
                    ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-100' 
                    : 'hover:bg-slate-50 border-transparent hover:border-slate-200'
                }`}
              >
                <div className="relative">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-[10px] shadow-xs overflow-hidden border border-white">
                    {staffAvatar ? (
                      <OptimizedImage src={staffAvatar} alt={staffName} variant="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{staffName ? staffName.charAt(0) : 'CB'}</span>
                    )}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
                </div>
                <div className="hidden lg:block">
                  <div className="flex items-center gap-1">
                    <p className="text-[11px] font-black text-slate-900 leading-tight max-w-[120px] truncate">{staffName}</p>
                    <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${userMenuOpen ? 'rotate-180 text-blue-600' : ''}`} />
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    className="absolute right-0 mt-1.5 w-64 max-h-[82vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-[9999] space-y-1.5 text-xs"
                  >
                    <div className="p-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white rounded-xl shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white/20 p-0.5 overflow-hidden border border-white/50 shrink-0">
                          {staffAvatar ? (
                            <OptimizedImage src={staffAvatar} alt={staffName} variant="avatar" className="w-full h-full object-cover rounded-md" />
                          ) : (
                            <div className="w-full h-full bg-white text-blue-700 font-black flex items-center justify-center rounded-md text-xs">{staffName.charAt(0)}</div>
                          )}
                        </div>
                        <div className="overflow-hidden flex-1">
                          <h4 className="font-black text-xs text-white truncate">{staffName}</h4>
                          <p className="text-[9px] text-blue-100 font-medium truncate">{staffEmail || 'cambo@chanhhiep.gov.vn'}</p>
                          <div className="mt-0.5">
                            <span className={`inline-block px-1.5 py-0.1 rounded text-[8px] font-black ${getRoleBadgeStyle(role)}`}>
                              {getRoleLabel(role)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <button onClick={() => handleUserMenuAction('profile')} className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-bold transition-colors cursor-pointer text-left">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="text-[11px]">Hồ sơ Cán bộ</span>
                      </button>
                      <button onClick={() => handleUserMenuAction('notes')} className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-bold transition-colors cursor-pointer text-left">
                        <StickyNote className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="text-[11px]">Ghi chú cá nhân</span>
                      </button>
                      <button onClick={() => handleUserMenuAction('calendar')} className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-bold transition-colors cursor-pointer text-left">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="text-[11px]">Lịch công tác</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 my-0.5"></div>

                    <div className="space-y-0.5">
                      <button onClick={() => { setUserMenuOpen(false); if (onOpenBackupModal) onOpenBackupModal(); }} className="w-full flex items-center justify-between px-2.5 py-1.5 text-slate-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg font-bold transition-colors cursor-pointer text-left group">
                        <div className="flex items-center gap-2">
                          <Database className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-[11px]">Sao lưu dữ liệu</span>
                        </div>
                      </button>
                      <button onClick={() => { setUserMenuOpen(false); onLogout(); }} className="w-full flex items-center gap-2 px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg font-bold transition-colors cursor-pointer text-left">
                        <LogOut className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-[11px]">Đăng xuất</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Presence & Notification Center Drawers - Rendered OUTSIDE <header> to avoid parent clipping/stacking issues */}
      <AdminPresenceDrawer
        isOpen={presenceDrawerOpen}
        onClose={() => setPresenceDrawerOpen(false)}
        currentAdmin={currentUser || null}
      />

      <NotificationCenterDrawer
        isOpen={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
        currentAdmin={currentUser || null}
        onNavigateToEntity={onNavigateToEntity}
      />
    </>
  );
};
