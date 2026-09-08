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
  Phone
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
}

export const DigitalOfficeHeader: React.FC<DigitalOfficeHeaderProps> = ({
  staffName,
  staffPosition,
  staffAvatar,
  staffRole = 'STAFF',
  staffEmail,
  staffDepartment,
  currentUser,
  onNavigate,
  onNavigateToEntity,
  onOpenProfile,
  onOpenAi,
  onGoToPortal,
  onLogout,
  onTriggerSimulatedOpinion,
  onTriggerSimulatedDocApproval,
  onForceCloudSync,
  onToggleMobileSidebar,
  onOpenDigitalDirectory
}) => {
  const [presenceDrawerOpen, setPresenceDrawerOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [activeAdminsCount, setActiveAdminsCount] = useState<number>(1);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);

  const userMenuRef = useRef<HTMLDivElement>(null);

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

  const notifications = [
    { id: 1, title: 'Phản ánh mới từ Tương Bình Hiệp 3 (PA-2026-8812)', time: '5 phút trước', type: 'OPINION' },
    { id: 2, title: 'Yêu cầu phê duyệt Kế hoạch 08/KH-MTTQ', time: '20 phút trước', type: 'DOC' },
    { id: 3, title: 'Bài viết Ngày hội ĐĐK đã xuất bản', time: 'Hôm qua', type: 'NEWS' }
  ];

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
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-4 py-1.5 sticky top-0 z-30 flex items-center justify-between shadow-2xs">
      {/* Title & Status */}
      <div className="flex items-center gap-2">
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
            src="https://www.mattrancantho.vn/files/images/Logo%20-%20Icon/Logo%20MTTQ.png"
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

      {/* Right Header Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Smart Offline Storage Sync Widget */}
        <OfflineSyncStatusWidget />

        {/* Admin Presence Button */}
        <button
          onClick={() => setPresenceDrawerOpen(true)}
          className="flex items-center gap-1 px-2 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 font-bold text-[10px] rounded-lg transition-all active:scale-95 cursor-pointer shadow-2xs"
          title="Xem danh sách Quản trị viên đang online"
        >
          <Users className="w-3 h-3 text-indigo-600 animate-pulse" />
          <span className="hidden sm:inline">👥 {activeAdminsCount} online</span>
          <span className="sm:hidden">👥 {activeAdminsCount}</span>
        </button>

        {/* Firebase Cloud Sync Button */}
        {onForceCloudSync && (
          <button
            onClick={onForceCloudSync}
            className="flex items-center gap-1 px-2 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-[10px] rounded-lg transition-all active:scale-95 cursor-pointer shadow-2xs"
            title="Đồng bộ cơ sở dữ liệu lên Cloud"
          >
            <Cloud className="w-3 h-3 text-emerald-600 animate-pulse" />
            <span className="hidden sm:inline">Đồng bộ Cloud</span>
            <span className="sm:hidden">Sync</span>
          </button>
        )}

        {/* Quick AI Trigger */}
        <div className="p-[1px] rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-xs hover:shadow-md transition-all">
          <button
            onClick={onOpenAi}
            className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-[10px] rounded-[7px] transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3 h-3 text-amber-300 animate-spin-slow" />
            <span className="text-white font-bold hidden sm:inline">Trợ lý AI</span>
            <span className="text-white font-bold sm:hidden">AI</span>
          </button>
        </div>

        {/* Notifications Drawer Trigger Bell */}
        <div className="relative">
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

        {/* UNIFIED USER DROPDOWN MENU */}
        <div className="relative pl-1.5 border-l border-slate-200" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`flex items-center gap-1.5 p-0.5 sm:pr-2 rounded-xl transition-all cursor-pointer text-left border ${
              userMenuOpen 
                ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-100' 
                : 'hover:bg-slate-50 border-transparent hover:border-slate-200'
            }`}
            title="Tài khoản Cán bộ & Chức năng Cá nhân"
          >
            <div className="relative">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-[10px] shadow-xs overflow-hidden border border-white">
                {staffAvatar ? (
                  <OptimizedImage src={staffAvatar} alt={staffName} variant="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{staffName ? staffName.charAt(0) : 'CB'}</span>
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white" title="Trực tuyến" />
            </div>

            <div className="hidden lg:block">
              <div className="flex items-center gap-1">
                <p className="text-[11px] font-black text-slate-900 leading-tight max-w-[120px] truncate">{staffName || 'Cán bộ Mặt trận'}</p>
                <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${userMenuOpen ? 'rotate-180 text-blue-600' : ''}`} />
              </div>
              <p className="text-[9px] text-blue-700 font-bold leading-none mt-0.5 truncate max-w-[120px]">{staffPosition || 'Phường Chánh Hiệp'}</p>
            </div>
          </button>

          {/* User Menu Dropdown Panel */}
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 mt-1.5 w-64 max-h-[82vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 space-y-1.5 text-xs"
              >
                {/* User Identity Card Banner */}
                <div className="p-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white rounded-xl shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/20 p-0.5 overflow-hidden border border-white/50 shrink-0">
                      {staffAvatar ? (
                        <OptimizedImage src={staffAvatar} alt={staffName} variant="avatar" className="w-full h-full object-cover rounded-md" />
                      ) : (
                        <div className="w-full h-full bg-white text-blue-700 font-black flex items-center justify-center rounded-md text-xs">
                          {staffName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <h4 className="font-black text-xs text-white truncate">{staffName}</h4>
                      <p className="text-[9px] text-blue-100 font-medium truncate">{staffEmail || 'cambo@chanhhiep.gov.vn'}</p>
                      <div className="mt-0.5 flex items-center gap-1">
                        <span className={`inline-block px-1.5 py-0.1 rounded text-[8px] font-black ${getRoleBadgeStyle(role)}`}>
                          {getRoleLabel(role)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 1: CHỨC NĂNG CÁ NHÂN */}
                <div className="px-1.5 pt-0.5">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Chức năng Cá nhân
                  </span>
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => handleUserMenuAction('profile')}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-bold transition-colors cursor-pointer text-left"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] truncate">Hồ sơ Cán bộ &amp; Chức danh</div>
                      <div className="text-[9px] text-slate-400 font-normal truncate">Xem thông tin cá nhân &amp; avatar</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleUserMenuAction('notes')}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-bold transition-colors cursor-pointer text-left"
                  >
                    <StickyNote className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] truncate">Sổ tay Ghi chú Cá nhân</div>
                      <div className="text-[9px] text-slate-400 font-normal truncate">Ghi chú riêng tư, nhắc việc cá nhân</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleUserMenuAction('calendar')}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-bold transition-colors cursor-pointer text-left"
                  >
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] truncate">Lịch Công tác của tôi</div>
                      <div className="text-[9px] text-slate-400 font-normal truncate">Lịch hội nghị, đi cơ sở, tiếp dân</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleUserMenuAction('profile')}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-bold transition-colors cursor-pointer text-left"
                  >
                    <Key className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] truncate">Đổi Mật khẩu &amp; Bảo mật</div>
                      <div className="text-[9px] text-slate-400 font-normal truncate">Bảo vệ tài khoản công vụ</div>
                    </div>
                  </button>
                </div>

                <div className="border-t border-slate-100 my-0.5"></div>

                {/* Section 2: QUẢN TRỊ CÁN BỘ & HỆ THỐNG */}
                <div className="px-1.5 pt-0.5">
                  <span className="text-[9px] font-extrabold text-blue-800 uppercase tracking-wider">
                    Quản trị Cán bộ &amp; Nhật ký
                  </span>
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => handleUserMenuAction('users')}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-bold transition-colors cursor-pointer text-left group"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="p-1 rounded bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                        <Users className="w-3 h-3" />
                      </div>
                      <div className="truncate">
                        <div className="text-[11px] font-black text-slate-800 group-hover:text-blue-700 truncate">Quản lý Cán bộ &amp; Thành viên</div>
                        <div className="text-[9px] text-slate-400 font-normal truncate">Tài khoản &amp; cơ cấu 21 khu phố</div>
                      </div>
                    </div>
                    <span className="text-[8px] bg-blue-100 text-blue-800 font-black px-1 py-0.2 rounded shrink-0 ml-1">
                      QUẢN TRỊ
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      if (onOpenDigitalDirectory) onOpenDigitalDirectory();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg font-bold transition-colors cursor-pointer text-left group"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="p-1 rounded bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                        <Phone className="w-3 h-3" />
                      </div>
                      <div className="truncate">
                        <div className="text-[11px] font-black text-slate-800 group-hover:text-emerald-700 truncate">Danh bạ số Cán bộ &amp; 21 Khu phố</div>
                        <div className="text-[9px] text-slate-400 font-normal truncate">Tra cứu SĐT Thường trực</div>
                      </div>
                    </div>
                    <span className="text-[8px] bg-emerald-100 text-emerald-800 font-black px-1 py-0.2 rounded shrink-0 ml-1">
                      DANH BẠ
                    </span>
                  </button>

                  <button
                    onClick={() => handleUserMenuAction('audit_logs')}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-bold transition-colors cursor-pointer text-left group"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="p-1 rounded bg-indigo-100 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                        <ShieldAlert className="w-3 h-3" />
                      </div>
                      <div className="truncate">
                        <div className="text-[11px] font-black text-slate-800 group-hover:text-indigo-700 truncate">Nhật ký Hệ thống (Audit Logs)</div>
                        <div className="text-[9px] text-slate-400 font-normal truncate">Lịch sử thao tác &amp; an toàn dữ liệu</div>
                      </div>
                    </div>
                    <span className="text-[8px] bg-slate-100 text-slate-700 font-black px-1 py-0.2 rounded shrink-0 ml-1">
                      LOGS
                    </span>
                  </button>
                </div>

                <div className="border-t border-slate-100 my-0.5"></div>

                {/* Section 3: ĐIỀU HƯỚNG & HỆ THỐNG */}
                <div className="space-y-0.5">
                  {onGoToPortal && (
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onGoToPortal();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-blue-700 hover:bg-blue-50 rounded-lg font-bold transition-colors cursor-pointer text-left"
                    >
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-[11px]">Về Cổng Người dân</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg font-bold transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span className="text-[11px]">Đăng xuất an toàn</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Admin Presence & Notification Center Drawers */}
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
    </header>
  );
};
