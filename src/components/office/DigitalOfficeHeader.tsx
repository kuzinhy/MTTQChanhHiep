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
  Database,
  PieChart,
  Settings,
  Mail,
  HardDrive,
  Brain,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getRoleBadgeStyle, getRoleLabel, canAccessView } from '../../lib/rbac';
import { OptimizedImage } from '../common/OptimizedImage';
import { UserRole, StaffUser, AdminNotification, AdminPresence } from '../../types';
import { browserNotificationService } from '../../lib/browserNotifications';
import { adminCollaborationService } from '../../lib/adminCollaborationService';
import { AdminPresenceDrawer } from './AdminPresenceDrawer';
import { NotificationCenterDrawer } from './NotificationCenterDrawer';
import { OfflineSyncStatusWidget } from '../common/OfflineSyncStatusWidget';
import { AnimatedIcon } from '../common/AnimatedIcon';
import { NotificationBell074 } from '../common/NotificationBell074';

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

          {/* div:nth-of-type(2) - Notification Bell Dropdown (074, Alerts & Feedback) */}
          <NotificationBell074
            variant="office-header"
            currentUser={currentUser}
            onOpenFullCenter={() => setNotifDrawerOpen(true)}
            onSelectNotification={(item) => {
              if (onNavigateToEntity && item.source_type) {
                onNavigateToEntity(item.source_type, item.source_id);
              } else {
                setNotifDrawerOpen(true);
              }
            }}
          />

          {/* div:nth-of-type(3) - AI & Profile */}
          <div className="flex items-center gap-2 border-l border-slate-200 pl-2">
            <div className="p-[1px] rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-xs hover:shadow-md transition-all">
              <button
                onClick={onOpenAi}
                className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-[10px] rounded-[7px] transition-all active:scale-95 cursor-pointer shadow-2xs group"
              >
                <AnimatedIcon name="ai_brain" size={14} colorScheme="white" trigger="hover" />
                <span className="text-white font-bold hidden sm:inline">Trợ lý AI</span>
              </button>
            </div>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-2 p-1 sm:pr-2.5 rounded-xl transition-all cursor-pointer text-left border ${
                  userMenuOpen 
                    ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-100 shadow-xs' 
                    : 'hover:bg-slate-50 border-slate-200 hover:border-blue-300 bg-white shadow-2xs'
                }`}
                title="Tài khoản & Menu Hệ thống"
              >
                <div className="relative">
                  <div className="w-7.5 h-7.5 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-600 text-white font-black flex items-center justify-center text-[11px] shadow-xs overflow-hidden border border-white">
                    {staffAvatar ? (
                      <OptimizedImage src={staffAvatar} alt={staffName} variant="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{staffName ? staffName.charAt(0) : 'CB'}</span>
                    )}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1">
                    <p className="text-[11px] font-black text-slate-900 leading-tight max-w-[125px] truncate">{staffName}</p>
                    <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${userMenuOpen ? 'rotate-180 text-blue-600' : ''}`} />
                  </div>
                  <p className="text-[9px] font-bold text-slate-500 truncate leading-tight mt-0.5">{getRoleLabel(role)}</p>
                </div>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    className="absolute right-0 mt-1.5 w-72 sm:w-80 max-h-[84vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 z-[9999] space-y-2 text-xs"
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

                    {/* Personal & Work Group */}
                    <div className="space-y-0.5">
                      <div className="px-2 pt-1 pb-0.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                        Cá nhân & Công tác
                      </div>
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

                    <div className="border-t border-slate-100 my-1"></div>

                    {/* AI Hub & Tools Group */}
                    <div className="space-y-0.5">
                      <div className="px-2 pt-0.5 pb-0.5 text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>Tiện ích & Cấu hình AI</span>
                        <span className="text-[8px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-1.5 py-0.2 rounded font-black">AI & TOOLS</span>
                      </div>

                      {canAccessView(currentUser || role, 'google_drive_storage') && (
                        <button onClick={() => handleUserMenuAction('google_drive_storage')} className="w-full flex items-center justify-between px-2.5 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-bold transition-colors cursor-pointer text-left">
                          <div className="flex items-center gap-2 min-w-0">
                            <HardDrive className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="text-[11px] truncate">Kết nối Google Drive & AI</span>
                          </div>
                          <span className="text-[8px] font-black bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded shrink-0">DRIVE HUB</span>
                        </button>
                      )}

                      {canAccessView(currentUser || role, 'ai_brain') && (
                        <button onClick={() => handleUserMenuAction('ai_brain')} className="w-full flex items-center justify-between px-2.5 py-1.5 text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg font-bold transition-colors cursor-pointer text-left">
                          <div className="flex items-center gap-2 min-w-0">
                            <Brain className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span className="text-[11px] truncate">Kho Tri thức & Sổ tay AI</span>
                          </div>
                          <span className="text-[8px] font-black bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded shrink-0">TRI THỨC</span>
                        </button>
                      )}

                      {canAccessView(currentUser || role, 'ai_settings') && (
                        <button onClick={() => handleUserMenuAction('ai_settings')} className="w-full flex items-center justify-between px-2.5 py-1.5 text-slate-700 hover:text-sky-700 hover:bg-sky-50 rounded-lg font-bold transition-colors cursor-pointer text-left">
                          <div className="flex items-center gap-2 min-w-0">
                            <Bot className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span className="text-[11px] truncate">Cài đặt Trợ lý AI</span>
                          </div>
                          <span className="text-[8px] font-black bg-sky-100 text-sky-700 px-1.5 py-0.2 rounded shrink-0">CÀI ĐẶT</span>
                        </button>
                      )}

                      {canAccessView(currentUser || role, 'animated_icons_lab') && (
                        <button onClick={() => handleUserMenuAction('animated_icons_lab')} className="w-full flex items-center justify-between px-2.5 py-1.5 text-slate-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg font-bold transition-colors cursor-pointer text-left">
                          <div className="flex items-center gap-2 min-w-0">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="text-[11px] truncate">Phòng Thử nghiệm Icon Động</span>
                          </div>
                          <span className="text-[8px] font-black bg-amber-100 text-amber-700 px-1.5 py-0.2 rounded shrink-0">LIVELY</span>
                        </button>
                      )}
                    </div>

                    <div className="border-t border-slate-100 my-1"></div>

                    {/* System & Administration Group */}
                    <div className="space-y-0.5">
                      <div className="px-2 pt-0.5 pb-0.5 text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>Hệ thống & Quản trị</span>
                        <span className="text-[8px] bg-slate-100 text-slate-600 px-1 py-0.2 rounded font-bold">Admin</span>
                      </div>

                      {canAccessView(currentUser || role, 'users') && (
                        <button onClick={() => handleUserMenuAction('users')} className="w-full flex items-center justify-between px-2.5 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-bold transition-colors cursor-pointer text-left">
                          <div className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="text-[11px]">Quản lý Tài khoản Cán bộ</span>
                          </div>
                          <span className="text-[8px] font-black bg-blue-100 text-blue-700 px-1 py-0.2 rounded">CÁN BỘ</span>
                        </button>
                      )}

                      {canAccessView(currentUser || role, 'analytics') && (
                        <button onClick={() => handleUserMenuAction('analytics')} className="w-full flex items-center justify-between px-2.5 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-bold transition-colors cursor-pointer text-left">
                          <div className="flex items-center gap-2">
                            <PieChart className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="text-[11px]">Thống kê & Báo cáo</span>
                          </div>
                          <span className="text-[8px] font-black bg-emerald-100 text-emerald-700 px-1 py-0.2 rounded">THỐNG KÊ</span>
                        </button>
                      )}

                      {canAccessView(currentUser || role, 'system_backup') && (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleUserMenuAction('system_backup')} className="flex-1 flex items-center justify-between px-2.5 py-1.5 text-slate-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg font-bold transition-colors cursor-pointer text-left group">
                            <div className="flex items-center gap-2">
                              <Database className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="text-[11px]">Sao lưu & Khôi phục Web</span>
                            </div>
                            <span className="text-[8px] font-black bg-amber-100 text-amber-700 px-1 py-0.2 rounded">BACKUP 3.0</span>
                          </button>
                          {onOpenBackupModal && (
                            <button
                              onClick={() => { setUserMenuOpen(false); onOpenBackupModal(); }}
                              title="Mở nhanh hộp thoại Sao lưu"
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Database className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}

                      {canAccessView(currentUser || role, 'audit_logs') && (
                        <button onClick={() => handleUserMenuAction('audit_logs')} className="w-full flex items-center justify-between px-2.5 py-1.5 text-slate-700 hover:text-purple-700 hover:bg-purple-50 rounded-lg font-bold transition-colors cursor-pointer text-left">
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span className="text-[11px]">Nhật ký Hoạt động (Audit)</span>
                          </div>
                          <span className="text-[8px] font-black bg-purple-100 text-purple-700 px-1 py-0.2 rounded">AUDIT</span>
                        </button>
                      )}

                      {canAccessView(currentUser || role, 'notifications') && (
                        <button onClick={() => handleUserMenuAction('notifications')} className="w-full flex items-center justify-between px-2.5 py-1.5 text-slate-700 hover:text-sky-700 hover:bg-sky-50 rounded-lg font-bold transition-colors cursor-pointer text-left">
                          <div className="flex items-center gap-2">
                            <Bell className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                            <span className="text-[11px]">Trung tâm Thông báo</span>
                          </div>
                          <span className="text-[8px] font-black bg-sky-100 text-sky-700 px-1 py-0.2 rounded">REALTIME</span>
                        </button>
                      )}

                      {canAccessView(currentUser || role, 'email_settings') && (
                        <button onClick={() => handleUserMenuAction('email_settings')} className="w-full flex items-center justify-between px-2.5 py-1.5 text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg font-bold transition-colors cursor-pointer text-left">
                          <div className="flex items-center gap-2">
                            <Settings className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span className="text-[11px]">Cấu hình Email Tự động</span>
                          </div>
                          <span className="text-[8px] font-black bg-indigo-100 text-indigo-700 px-1 py-0.2 rounded">EMAIL</span>
                        </button>
                      )}

                      {canAccessView(currentUser || role, 'system_health') && (
                        <button onClick={() => handleUserMenuAction('system_health')} className="w-full flex items-center justify-between px-2.5 py-1.5 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg font-bold transition-colors cursor-pointer text-left">
                          <div className="flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="text-[11px]">Sức khỏe & Trạng thái Hệ thống</span>
                          </div>
                          <span className="text-[8px] font-black bg-emerald-100 text-emerald-700 px-1 py-0.2 rounded">ONLINE</span>
                        </button>
                      )}
                    </div>

                    <div className="border-t border-slate-100 my-1"></div>

                    <div className="space-y-0.5">
                      <button onClick={() => { setUserMenuOpen(false); onLogout(); }} className="w-full flex items-center gap-2 px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg font-bold transition-colors cursor-pointer text-left">
                        <LogOut className="w-3.5 h-3.5 text-red-500 shrink-0" />
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
