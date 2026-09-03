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
import { UserRole } from '../../types';
import { browserNotificationService } from '../../lib/browserNotifications';

interface DigitalOfficeHeaderProps {
  staffName: string;
  staffPosition: string;
  staffAvatar?: string;
  staffRole?: string;
  staffEmail?: string;
  staffDepartment?: string;
  onNavigate?: (view: string) => void;
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
  onNavigate,
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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
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
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-2.5 sticky top-0 z-30 flex items-center justify-between shadow-2xs">
      {/* Title & Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onToggleMobileSidebar && (
          <button 
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors mr-1 shrink-0 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="hidden xs:flex w-8 h-8 rounded-lg bg-white p-0.5 items-center justify-center shrink-0 border border-slate-200 shadow-2xs">
          <img
            src="https://www.mattrancantho.vn/files/images/Logo%20-%20Icon/Logo%20MTTQ.png"
            alt="Logo MTTQ"
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight line-clamp-1">
              HỆ THỐNG VĂN PHÒNG SỐ MTTQ PHƯỜNG CHÁNH HIỆP
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-full">
              Studio Admin
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden xs:block">
            Môi trường làm việc số &amp; Quản trị nghiệp vụ hành chính toàn phường
          </p>
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Firebase Cloud Sync Button */}
        {onForceCloudSync && (
          <button
            onClick={onForceCloudSync}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-extrabold text-[11px] rounded-xl transition-all active:scale-95 cursor-pointer shadow-2xs"
            title="Đồng bộ toàn bộ cơ sở dữ liệu lên Firebase Cloud"
          >
            <Cloud className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span className="hidden sm:inline">Đồng bộ Cloud</span>
            <span className="sm:hidden">Đồng bộ</span>
          </button>
        )}

        {/* Quick AI Trigger */}
        <div className="p-[1px] rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-xs hover:shadow-md transition-all">
          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-[11px] transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
            <span className="text-white font-black hidden sm:inline">Trợ lý AI Mặt trận</span>
            <span className="text-white font-black sm:hidden">AI</span>
          </button>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 hover:bg-blue-50 rounded-xl relative text-slate-600 hover:text-blue-700 transition-colors cursor-pointer"
            title="Thông báo hệ thống"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white animate-ping"></span>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white"></span>
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-blue-600" />
                    <span>Thông báo trực tuyến</span>
                  </span>
                  <span className="text-[10px] text-blue-700 font-semibold cursor-pointer hover:underline">
                    Đánh dấu đã đọc
                  </span>
                </div>

                {/* Web Notification Permission Control Widget */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                      <BellRing className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-slate-800 flex items-center gap-1">
                        <span>Thông báo đẩy Web</span>
                        {browserNotificationService.getPermissionStatus() === 'granted' ? (
                          <span className="inline-flex items-center text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-xs border border-emerald-200">
                            <Check className="w-2.5 h-2.5 mr-0.5" /> Đã bật
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded-xs border border-amber-200">
                            Chưa bật
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] text-slate-500">
                        Nhận báo động khi có ý kiến &amp; văn bản ngoài tab
                      </p>
                    </div>
                  </div>

                  {browserNotificationService.getPermissionStatus() !== 'granted' && (
                    <button
                      onClick={async () => {
                        await browserNotificationService.requestPermission();
                        // Force update state
                        setNotificationsOpen(false);
                        setTimeout(() => setNotificationsOpen(true), 100);
                      }}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      Bật ngay
                    </button>
                  )}
                </div>

                {/* Simulation Quick Trigger Buttons */}
                <div className="p-2.5 bg-blue-50/70 border border-blue-200/60 rounded-xl space-y-1.5">
                  <p className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider">
                    Thử nghiệm phát Toast Notification
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      onClick={() => {
                        if (onTriggerSimulatedOpinion) onTriggerSimulatedOpinion();
                        setNotificationsOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] rounded-lg transition-colors flex items-center justify-between shadow-2xs cursor-pointer"
                    >
                      <span>+ Giả lập Ý kiến dân sinh mới</span>
                      <span className="text-[9px] bg-slate-900 text-amber-300 px-1 rounded-xs">PA-NEW</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onTriggerSimulatedDocApproval) onTriggerSimulatedDocApproval();
                        setNotificationsOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center justify-between shadow-2xs cursor-pointer"
                    >
                      <span>+ Giả lập Phê duyệt văn bản</span>
                      <span className="text-[9px] bg-white text-blue-800 px-1 rounded-xs">DOC-NEW</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 divide-y divide-slate-100 pt-1">
                  {notifications.map((n) => (
                    <div key={n.id} className="pt-2 first:pt-0 space-y-0.5">
                      <p className="font-semibold text-slate-800">{n.title}</p>
                      <p className="text-[10px] text-slate-400">{n.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* UNIFIED USER DROPDOWN MENU (GOM GỌN TẤT CẢ CHỨC NĂNG CÁ NHÂN VÀO USER MENU) */}
        <div className="relative pl-2.5 border-l border-slate-200" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`flex items-center gap-2.5 p-1 sm:pr-2.5 rounded-2xl transition-all cursor-pointer text-left border ${
              userMenuOpen 
                ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-100' 
                : 'hover:bg-slate-50 border-transparent hover:border-slate-200'
            }`}
            title="Tài khoản Cán bộ & Chức năng Cá nhân"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-xs shadow-xs overflow-hidden border border-white">
                {staffAvatar ? (
                  <img src={staffAvatar} alt={staffName} className="w-full h-full object-cover" />
                ) : (
                  <span>{staffName ? staffName.charAt(0) : 'CB'}</span>
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" title="Trực tuyến" />
            </div>

            <div className="hidden md:block">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-black text-slate-900 leading-tight max-w-[140px] truncate">{staffName || 'Cán bộ Mặt trận'}</p>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${userMenuOpen ? 'rotate-180 text-blue-600' : ''}`} />
              </div>
              <p className="text-[10px] text-blue-700 font-bold leading-none mt-0.5 truncate max-w-[140px]">{staffPosition || 'Phường Chánh Hiệp'}</p>
            </div>
          </button>

          {/* User Menu Dropdown Panel */}
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-slate-200 p-2.5 z-50 space-y-2 text-xs"
              >
                {/* User Identity Card Banner */}
                <div className="p-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white rounded-2xl shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 p-0.5 overflow-hidden border border-white/50 shrink-0">
                      {staffAvatar ? (
                        <img src={staffAvatar} alt={staffName} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="w-full h-full bg-white text-blue-700 font-black flex items-center justify-center rounded-lg">
                          {staffName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <h4 className="font-black text-xs text-white truncate">{staffName}</h4>
                      <p className="text-[10px] text-blue-100 font-medium truncate">{staffEmail || 'cambo@chanhhiep.gov.vn'}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className={`inline-block px-2 py-0.2 rounded-md text-[9px] font-black ${getRoleBadgeStyle(role)}`}>
                          {getRoleLabel(role)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 1: CHỨC NĂNG CÁ NHÂN */}
                <div className="px-2 pt-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Chức năng Cá nhân
                  </span>
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => handleUserMenuAction('profile')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl font-bold transition-colors cursor-pointer text-left"
                  >
                    <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs truncate">Hồ sơ Cán bộ &amp; Chức danh</div>
                      <div className="text-[10px] text-slate-400 font-normal truncate">Xem thông tin cá nhân &amp; avatar</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleUserMenuAction('notes')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl font-bold transition-colors cursor-pointer text-left"
                  >
                    <StickyNote className="w-4 h-4 text-amber-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs truncate">Sổ tay Ghi chú Cá nhân</div>
                      <div className="text-[10px] text-slate-400 font-normal truncate">Ghi chú riêng tư, nhắc việc cá nhân</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleUserMenuAction('calendar')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl font-bold transition-colors cursor-pointer text-left"
                  >
                    <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs truncate">Lịch Công tác của tôi</div>
                      <div className="text-[10px] text-slate-400 font-normal truncate">Lịch hội nghị, đi cơ sở, tiếp dân</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleUserMenuAction('profile')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl font-bold transition-colors cursor-pointer text-left"
                  >
                    <Key className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs truncate">Đổi Mật khẩu &amp; Bảo mật</div>
                      <div className="text-[10px] text-slate-400 font-normal truncate">Bảo vệ tài khoản công vụ 256-bit</div>
                    </div>
                  </button>
                </div>

                <div className="border-t border-slate-100 my-1"></div>

                {/* Section 2: QUẢN TRỊ CÁN BỘ & HỆ THỐNG */}
                <div className="px-2 pt-0.5">
                  <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider">
                    Quản trị Cán bộ &amp; Nhật ký
                  </span>
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => handleUserMenuAction('users')}
                    className="w-full flex items-center justify-between px-3 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl font-bold transition-colors cursor-pointer text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-black text-slate-800 group-hover:text-blue-700 truncate">Quản lý Cán bộ &amp; Thành viên</div>
                        <div className="text-[10px] text-slate-400 font-normal truncate">Tài khoản &amp; cơ cấu 21 khu phố</div>
                      </div>
                    </div>
                    <span className="text-[9px] bg-blue-100 text-blue-800 font-black px-1.5 py-0.5 rounded-md shrink-0 ml-1">
                      QUẢN TRỊ
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      if (onOpenDigitalDirectory) onOpenDigitalDirectory();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl font-bold transition-colors cursor-pointer text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-black text-slate-800 group-hover:text-emerald-700 truncate">Danh bạ số Cán bộ &amp; 21 Khu phố</div>
                        <div className="text-[10px] text-slate-400 font-normal truncate">Tra cứu SĐT Thường trực &amp; Trưởng Ban CTMT</div>
                      </div>
                    </div>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded-md shrink-0 ml-1">
                      DANH BẠ
                    </span>
                  </button>

                  <button
                    onClick={() => handleUserMenuAction('audit_logs')}
                    className="w-full flex items-center justify-between px-3 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl font-bold transition-colors cursor-pointer text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                        <ShieldAlert className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-black text-slate-800 group-hover:text-indigo-700 truncate">Nhật ký Hệ thống (Audit Logs)</div>
                        <div className="text-[10px] text-slate-400 font-normal truncate">Lịch sử thao tác &amp; an toàn dữ liệu</div>
                      </div>
                    </div>
                    <span className="text-[9px] bg-slate-100 text-slate-700 font-black px-1.5 py-0.5 rounded-md shrink-0 ml-1">
                      LOGS
                    </span>
                  </button>
                </div>

                <div className="border-t border-slate-100 my-1"></div>

                {/* Section 3: ĐIỀU HƯỚNG & HỆ THỐNG */}
                <div className="space-y-0.5">
                  {onGoToPortal && (
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onGoToPortal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-blue-700 hover:bg-blue-50 rounded-xl font-bold transition-colors cursor-pointer text-left"
                    >
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span className="text-xs">Về Cổng Người dân</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span className="text-xs">Đăng xuất an toàn</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
