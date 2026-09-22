import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard,
  BarChart3, 
  Newspaper, 
  Users, 
  Bell, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Clock, 
  Settings, 
  FileText, 
  FolderCheck,
  MessageSquare, 
  Layers, 
  Building2, 
  CalendarDays,
  ArrowRight,
  Sparkles,
  Home,
  Info,
  Lightbulb,
  Award,
  ShieldAlert,
  Search,
  Maximize2,
  Minimize2,
  PieChart,
  SlidersHorizontal,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  FileCheck
} from 'lucide-react';
import { Article, OfficialDocument, PublicOpinion, StaffUser } from '../types';
import { VisitorTrackerEngine, VisitorStats } from '../lib/visitorTracker';
import { VisitorStatsModal } from './VisitorStatsModal';

interface DashboardInterfaceProps {
  currentStaffUser?: StaffUser | null;
  articles?: Article[];
  documents?: OfficialDocument[];
  opinions?: PublicOpinion[];
  onNavigatePortalTab?: (tab: string) => void;
  onGoToOffice?: (view?: string) => void;
  onOpenStaffLogin?: () => void;
}

interface ActionItem {
  id: string;
  title: string;
  desc?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeType?: 'blue' | 'gray' | 'green' | 'amber' | 'purple' | 'red';
  action: () => void;
}

export const DashboardInterface: React.FC<DashboardInterfaceProps> = ({
  currentStaffUser,
  articles = [],
  documents = [],
  opinions = [],
  onNavigatePortalTab,
  onGoToOffice,
  onOpenStaffLogin,
}) => {
  const displayName = currentStaffUser?.fullname || "Nguyễn Minh Huy";
  const userRole = currentStaffUser?.role === 'SUPER_ADMIN' 
    ? "Quản trị hệ thống" 
    : currentStaffUser?.role === 'ADMIN' 
    ? "Ban Thường trực MTTQ" 
    : "Quản trị hệ thống";

  // Clock state
  const [currentTime, setCurrentTime] = useState({
    time: '09:25',
    date: 'Thứ Hai, 21/09/2026'
  });

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // State to track if each card is expanded to show hidden extra items
  const [expandedCards, setExpandedCards] = useState<{
    overview: boolean;
    cms: boolean;
    admin: boolean;
  }>({
    overview: false,
    cms: false,
    admin: false,
  });

  // Modal for visitor stats
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [onlineCount] = useState<number>(() => VisitorTrackerEngine.getOnlineCount());
  const [stats] = useState<VisitorStats>(() => VisitorTrackerEngine.getStats());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      
      const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = days[now.getDay()];
      const dateStr = `${dayName}, ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      
      setCurrentTime({
        time: timeStr,
        date: dateStr
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  const publishedArticlesCount = articles.length > 0 ? articles.length : 13;
  const pendingOpinionsCount = opinions.length > 0 
    ? opinions.filter(o => o.status === 'NEW' || o.status === 'PROCESSING').length || 4 
    : 4;

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  const toggleExpandCard = (groupKey: 'overview' | 'cms' | 'admin') => {
    setExpandedCards(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const areAllExpanded = expandedCards.overview && expandedCards.cms && expandedCards.admin;

  const toggleAllExpanded = () => {
    const nextState = !areAllExpanded;
    setExpandedCards({
      overview: nextState,
      cms: nextState,
      admin: nextState,
    });
  };

  // 1. NHÓM 1: TỔNG QUAN & ĐIỀU HÀNH (6 CHỨC NĂNG - Đúng hình 1)
  const overviewItems: ActionItem[] = [
    {
      id: 'dashboard',
      title: 'Trang Tổng quan',
      desc: 'Bảng điều khiển chỉ số KPI và tiến độ công tác',
      icon: LayoutDashboard,
      action: () => onGoToOffice && onGoToOffice('dashboard')
    },
    {
      id: 'youth_union_admin',
      title: 'Quản trị Đoàn',
      desc: 'Cơ cấu tổ chức Đoàn thanh niên & quản trị cơ sở',
      icon: Users,
      badge: 'ADMIN',
      badgeType: 'gray',
      action: () => onGoToOffice && onGoToOffice('youth_union_admin')
    },
    {
      id: 'youth_union_workspace',
      title: 'Workspace Chi đoàn',
      desc: 'Không gian số tác nghiệp 21 Chi đoàn khu phố',
      icon: Sparkles,
      badge: 'WS',
      badgeType: 'gray',
      action: () => onGoToOffice && onGoToOffice('youth_union_workspace')
    },
    {
      id: 'neighborhood_map',
      title: 'Bản đồ 21 Khu phố',
      desc: 'Bản đồ số an sinh xã hội, hộ nghèo và địa bàn',
      icon: Building2,
      badge: '21 KP',
      badgeType: 'gray',
      action: () => onNavigatePortalTab ? onNavigatePortalTab('map') : onGoToOffice && onGoToOffice('neighborhood_map')
    },
    {
      id: 'ai_assistant',
      title: 'Trợ lý AI Tổng hợp',
      desc: 'Tra cứu, soạn thảo văn bản và tóm tắt nghiệp vụ',
      icon: Sparkles,
      badge: 'WORKSPACE',
      badgeType: 'gray',
      action: () => onGoToOffice && onGoToOffice('ai_assistant')
    },
    {
      id: 'home',
      title: 'Về trang chủ',
      desc: 'Chuyển về Cổng thông tin Mặt trận Phường Chánh Hiệp',
      icon: Building2,
      action: () => onNavigatePortalTab && onNavigatePortalTab('home')
    },
  ];

  // 2. NHÓM 2: NGHIỆP VỤ & CỔNG TT (9 CHỨC NĂNG - Đúng hình 2)
  const cmsItems: ActionItem[] = [
    {
      id: 'cms',
      title: 'Tin tức & Bài viết',
      desc: 'Biên tập, duyệt bài và xuất bản tin tức MTTQ',
      icon: Newspaper,
      badge: 'TIN BÀI',
      badgeType: 'gray',
      action: () => onNavigatePortalTab ? onNavigatePortalTab('news') : onGoToOffice && onGoToOffice('cms')
    },
    {
      id: 'cms_initiatives',
      title: 'Mô hình & Sáng kiến',
      desc: 'Kho sáng kiến, mô hình dân vận khéo tiêu biểu',
      icon: Lightbulb,
      badge: 'MÔ HÌNH',
      badgeType: 'gray',
      action: () => onNavigatePortalTab ? onNavigatePortalTab('initiatives') : onGoToOffice && onGoToOffice('cms_initiatives')
    },
    {
      id: 'cms_documents',
      title: 'Văn bản & Chỉ đạo',
      desc: 'Lưu trữ chỉ đạo, công văn và hướng dẫn nghiệp vụ',
      icon: FileText,
      badge: 'VĂN BẢN',
      badgeType: 'gray',
      action: () => onNavigatePortalTab ? onNavigatePortalTab('documents') : onGoToOffice && onGoToOffice('cms_documents')
    },
    {
      id: 'cms_about',
      title: 'Giới thiệu MTTQ',
      desc: 'Lịch sử hình thành, điều lệ và bộ máy tổ chức',
      icon: Info,
      badge: 'GIỚI THIỆU',
      badgeType: 'gray',
      action: () => onNavigatePortalTab ? onNavigatePortalTab('about') : onGoToOffice && onGoToOffice('cms_about')
    },
    {
      id: 'opinions',
      title: 'Xử lý Dân nguyện',
      desc: `Tiếp nhận phản ánh, kiến nghị của người dân (${pendingOpinionsCount} chờ duyệt)`,
      icon: MessageSquare,
      badge: 'DÂN NGUYỆN',
      badgeType: 'gray',
      action: () => onNavigatePortalTab ? onNavigatePortalTab('opinion') : onGoToOffice && onGoToOffice('opinions')
    },
    {
      id: 'surveys_admin',
      title: 'Khảo sát & Dư luận',
      desc: 'Thăm dò dư luận xã hội, lấy phiếu ý kiến cử tri',
      icon: BarChart3,
      badge: 'KHẢO SÁT',
      badgeType: 'gray',
      action: () => onNavigatePortalTab ? onNavigatePortalTab('surveys') : onGoToOffice && onGoToOffice('surveys_admin')
    },
    {
      id: 'competitions_admin',
      title: 'Hội thi & Ngân hàng đề',
      desc: 'Tổ chức hội thi trực tuyến, trắc nghiệm pháp luật',
      icon: Award,
      badge: 'HỘI THI',
      badgeType: 'gray',
      action: () => onNavigatePortalTab ? onNavigatePortalTab('competitions') : onGoToOffice && onGoToOffice('competitions_admin')
    },
    {
      id: 'member_orgs_admin',
      title: 'Tổ chức Thành viên',
      desc: 'Quản trị các tổ chức đoàn thể chính trị - xã hội',
      icon: Users,
      badge: 'THÀNH VIÊN',
      badgeType: 'gray',
      action: () => onNavigatePortalTab ? onNavigatePortalTab('organizations') : onGoToOffice && onGoToOffice('member_orgs_admin')
    },
    {
      id: 'cultural_space_admin',
      title: 'Không gian Văn hóa 3D',
      desc: 'Bảo tàng ảo, hiện vật số hóa Hồ Chí Minh',
      icon: Building2,
      badge: '3D VIRTUAL',
      badgeType: 'gray',
      action: () => onNavigatePortalTab ? onNavigatePortalTab('cultural_space') : onGoToOffice && onGoToOffice('cultural_space_admin')
    },
  ];

  // 3. NHÓM 3: QUẢN TRỊ HỆ THỐNG (5 CHỨC NĂNG - Đúng hình 3)
  const adminItems: ActionItem[] = [
    {
      id: 'notifications',
      title: 'Trung tâm Thông báo',
      desc: 'Phát thanh số, cảnh báo và chỉ đạo điều hành tức thì',
      icon: Bell,
      badge: 'REALTIME',
      badgeType: 'gray',
      action: () => onGoToOffice && onGoToOffice('notifications')
    },
    {
      id: 'users',
      title: 'Quản lý Tài khoản Cán bộ',
      desc: 'Phân quyền, cấp phát tài khoản và danh sách cán bộ',
      icon: Users,
      badge: 'CÁN BỘ',
      badgeType: 'gray',
      action: () => onGoToOffice && onGoToOffice('users')
    },
    {
      id: 'analytics',
      title: 'Thống kê & Báo cáo',
      desc: 'Tổng hợp số liệu nghiệp vụ, báo cáo định kỳ',
      icon: PieChart,
      badge: 'THỐNG KÊ',
      badgeType: 'gray',
      action: () => onGoToOffice && onGoToOffice('analytics')
    },
    {
      id: 'audit_logs',
      title: 'Nhật ký Hoạt động (Audit)',
      desc: 'Giám sát an toàn dữ liệu, truy vết thao tác hệ thống',
      icon: ShieldAlert,
      badge: 'AUDIT',
      badgeType: 'gray',
      action: () => onGoToOffice && onGoToOffice('audit_logs')
    },
    {
      id: 'email_settings',
      title: 'Cấu hình Email Tự động',
      desc: 'Cài đặt SMTP và mẫu thư thông báo tự động',
      icon: Settings,
      badge: 'EMAIL',
      badgeType: 'gray',
      action: () => onGoToOffice && onGoToOffice('email_settings')
    },
  ];

  // Search filter
  const filterItems = (items: ActionItem[]) => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(i => 
      i.title.toLowerCase().includes(q) || 
      (i.desc && i.desc.toLowerCase().includes(q)) ||
      (i.badge && i.badge.toLowerCase().includes(q))
    );
  };

  return (
    <div className="h-screen font-sans text-[#071753] flex flex-col overflow-hidden selection:bg-blue-200">
      
      {/* Toast Notification */}
      {notificationToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#071753] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-blue-400/30 animate-in fade-in slide-in-from-top-4">
          <Info className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="text-sm font-medium">{notificationToast}</span>
        </div>
      )}

      {/* TOP HEADER - 74px height with Glassmorphism */}
      <header className="h-[74px] bg-white/95 backdrop-blur-md border-b border-[#D8E5F4] px-4 sm:px-8 lg:px-12 flex items-center justify-between shadow-xs sticky top-0 z-30 transition-all">
        
        {/* Agency Logo & Title */}
        <div 
          onClick={() => onNavigatePortalTab && onNavigatePortalTab('home')}
          className="flex items-center gap-3.5 cursor-pointer group"
          title="Trở về Cổng thông tin Mặt trận"
        >
          <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center p-0.5 bg-white border border-red-200 shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <img 
              src="https://res.cloudinary.com/idt08wyp/image/upload/v1789907080/Logo-Mat-Tran-To-Quoc-Viet-Nam.png" 
              alt="Logo Mặt Trận Tổ Quốc" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-black text-[15px] sm:text-[16px] text-[#071753] uppercase tracking-tight leading-tight group-hover:text-blue-700 transition-colors">
              VĂN PHÒNG SỐ MTTQ PHƯỜNG CHÁNH HIỆP
            </h1>
            <p className="text-[11px] text-[#536A95] font-medium mt-0.5">
              Hệ thống quản trị điều hành hành chính điện tử
            </p>
          </div>
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-3 sm:gap-5">
          
          {/* Quick Search */}
          <div className="hidden lg:flex items-center bg-slate-50 border border-slate-200/90 rounded-full px-3 py-1.5 w-60 focus-within:w-72 focus-within:bg-white focus-within:border-blue-500 transition-all shadow-2xs">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Tìm nhanh chức năng quản trị..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-[#071753] focus:outline-none w-full placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 text-xs">
                ✕
              </button>
            )}
          </div>

          {/* Quick Portal Switch */}
          <button 
            onClick={() => onNavigatePortalTab && onNavigatePortalTab('home')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Quay lại Cổng thông tin công dân"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Cổng thông tin</span>
          </button>

          {/* Notification Bell */}
          <div 
            onClick={() => showToast('Bạn có 4 thông báo văn bản và phản ánh mới cần xử lý.')}
            className="relative cursor-pointer p-2 rounded-full hover:bg-slate-100 transition-colors text-[#536A95] hover:text-[#071753]"
            title="Thông báo hệ thống (4 mới)"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
              4
            </span>
          </div>

          {/* Clock */}
          <div className="hidden sm:flex items-center gap-2.5 text-[#536A95]">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-[13px] font-black text-[#071753] leading-none">
                {currentTime.time}
              </p>
              <p className="text-[11px] text-[#536A95] font-medium mt-0.5 leading-none">
                {currentTime.date}
              </p>
            </div>
          </div>

          {/* User profile */}
          <div className="relative">
            <div 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 pl-3 border-l border-[#D8E5F4] cursor-pointer hover:opacity-90 transition-opacity"
            >
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs border-2 border-blue-200 shrink-0 shadow-xs">
                {displayName.split(' ').pop()?.slice(0, 2).toUpperCase() || 'H'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-[13px] font-bold text-[#071753] leading-tight">
                  {displayName}
                </p>
                <p className="text-[10px] text-[#536A95] font-medium leading-tight">
                  {userRole}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#536A95] hidden md:block" />
            </div>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tài khoản cán bộ</p>
                  <p className="text-sm font-bold text-[#071753]">{displayName}</p>
                  <p className="text-xs text-slate-500">{userRole}</p>
                </div>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onGoToOffice && onGoToOffice('dashboard');
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Văn phòng số nội bộ</span>
                </button>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onNavigatePortalTab && onNavigatePortalTab('home');
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Về Cổng thông tin</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-6">
        
        {/* TOOLBAR CONTROLS: Expand/Collapse All - Redesigned to be Impressive & Prominent */}
        <motion.div 
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative overflow-hidden flex flex-wrap sm:flex-nowrap items-center justify-between mb-5 px-4 py-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-blue-200/90 shadow-[0_10px_30px_-8px_rgba(37,99,235,0.18)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.25)] transition-all duration-300 group/toolbar"
        >
          {/* Subtle Google Studio multi-color top glowing beam */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 via-indigo-500 via-pink-500 via-amber-400 to-emerald-500 animate-[studioGradientMove_6s_linear_infinite]" />
          
          <div className="flex items-center gap-3 min-w-0">
            {/* Animated glowing pill icon */}
            <div className="relative flex items-center justify-center">
              <span className="absolute w-4 h-4 rounded-full bg-blue-500/40 animate-ping" />
              <span className="relative w-3 h-3 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-sm" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xs sm:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-[#071753] via-blue-900 to-indigo-900 uppercase tracking-wider">
                  3 NHÓM CHỨC NĂNG QUẢN TRỊ VĂN PHÒNG SỐ
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-2xs">
                  GOOGLE STUDIO MESH
                </span>
              </div>
              <p className="text-[11px] text-[#536A95] font-medium hidden sm:block mt-0.5">
                Bảng điều khiển tác nghiệp hành chính thông minh • 20 phân hệ nghiệp vụ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 sm:mt-0 shrink-0">
            <button
              onClick={toggleAllExpanded}
              className="relative overflow-hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-bold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group/btn"
            >
              {/* Shimmer sweep on button hover */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out" />
              
              {areAllExpanded ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-blue-200 group-hover/btn:rotate-90 transition-transform" />
                  <span className="relative">Thu gọn tất cả (kích thước ban đầu)</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-blue-200 group-hover/btn:scale-110 transition-transform" />
                  <span className="relative">Mở rộng tất cả (20 chức năng)</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* 3 WORKSPACE CARDS MATCHING EXACT USER SCREENSHOTS - Google AI Studio Styled with Radiant Gradient Borders */}
        <div className="w-full max-w-[75%] mx-auto mb-6">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            
            {/* ========================================================================= */}
            {/* NHÓM 1: TỔNG QUAN & ĐIỀU HÀNH (6 CHỨC NĂNG - THEO ẢNH 1) */}
            {/* ========================================================================= */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
              whileHover={{ y: -4 }}
              className="studio-card-blue p-3.5 sm:p-4.5 flex flex-col justify-between h-full group"
            >
              <div>
                {/* Thẻ Header có Icon Minh họa Nhóm */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-blue-100/60">
                  <div className="flex items-center gap-2.5">
                    {/* 01 Icon minh họa đi kèm thẻ */}
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all shrink-0">
                      <LayoutDashboard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-black text-xs sm:text-[13px] text-[#071753] tracking-tight leading-tight uppercase">
                          TỔNG QUAN & ĐIỀU HÀNH
                        </h3>
                        <span className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                          6
                        </span>
                      </div>
                      <p className="text-[10px] text-[#536A95] font-medium leading-tight mt-0.5">
                        Quản trị điều hành, Đoàn & an sinh
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleExpandCard('overview')}
                    className="w-7 h-7 rounded-full bg-blue-50/80 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-all cursor-pointer shrink-0 hover:scale-110 shadow-2xs"
                    title={expandedCards.overview ? "Thu gọn về ban đầu" : "Mở rộng xem thêm chức năng"}
                  >
                    {expandedCards.overview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Danh sách chức năng (Mặc định 4 mục để 3 thẻ dài bằng nhau) */}
                <div className="space-y-1.5 animate-in fade-in duration-200">
                  {filterItems(expandedCards.overview ? overviewItems : overviewItems.slice(0, 4)).map((item) => {
                    const IconComp = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={item.action}
                        className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-slate-50/80 hover:bg-blue-50/90 border border-slate-100 hover:border-blue-200 shadow-2xs hover:shadow-xs hover:translate-x-0.5 transition-all cursor-pointer group/row"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <IconComp className="w-3.5 h-3.5 text-blue-600 shrink-0 group-hover/row:scale-120 group-hover/row:text-indigo-600 transition-transform" />
                          <div className="min-w-0">
                            <span className="text-[11px] font-bold text-[#071753] truncate block group-hover/row:text-blue-700 transition-colors">
                              {item.title}
                            </span>
                            <span className="text-[9px] text-slate-500 truncate block">
                              {item.desc}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                          {item.badge && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-blue-100/70 text-blue-700 border border-blue-200/80 uppercase tracking-wider">
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/row:text-blue-600 group-hover/row:translate-x-1 transition-all" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Nút bấm mở rộng nếu đang giấu chức năng */}
                {overviewItems.length > 4 && (
                  <button
                    onClick={() => toggleExpandCard('overview')}
                    className="w-full mt-2 py-1.5 px-2 text-[10px] font-extrabold text-blue-600 hover:text-blue-800 hover:bg-blue-50/90 rounded-xl transition-all flex items-center justify-center gap-1 border border-dashed border-blue-300/80 cursor-pointer shadow-2xs hover:border-blue-400"
                  >
                    {expandedCards.overview ? (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        <span>Thu gọn chức năng</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        <span>Mở rộng thêm +2 chức năng</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Chân thẻ mở lối tắt văn phòng */}
              <div className="pt-2.5 mt-3 border-t border-blue-100/60 flex items-center justify-between text-[10px]">
                <span className="text-[#536A95] font-semibold">6 chức năng</span>
                <button 
                  onClick={() => onGoToOffice && onGoToOffice('dashboard')}
                  className="font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer flex items-center gap-1 hover:gap-1.5"
                >
                  <span>Vào Tổng quan</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>

            </motion.div>

            {/* ========================================================================= */}
            {/* NHÓM 2: NGHIỆP VỤ & CỔNG TT (9 CHỨC NĂNG - THEO ẢNH 2) */}
            {/* ========================================================================= */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2, ease: 'easeOut' }}
              whileHover={{ y: -4 }}
              className="studio-card-green p-3.5 sm:p-4.5 flex flex-col justify-between h-full group"
            >
              <div>
                {/* Thẻ Header có Icon Minh họa Nhóm */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-100/60">
                  <div className="flex items-center gap-2.5">
                    {/* 01 Icon minh họa đi kèm thẻ */}
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all shrink-0">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-black text-xs sm:text-[13px] text-[#071753] tracking-tight leading-tight uppercase">
                          NGHIỆP VỤ & CỔNG TT
                        </h3>
                        <span className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                          9
                        </span>
                      </div>
                      <p className="text-[10px] text-[#536A95] font-medium leading-tight mt-0.5">
                        Tin bài, văn bản, khảo sát & dân nguyện
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleExpandCard('cms')}
                    className="w-7 h-7 rounded-full bg-emerald-50/80 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-all cursor-pointer shrink-0 hover:scale-110 shadow-2xs"
                    title={expandedCards.cms ? "Thu gọn về ban đầu" : "Mở rộng xem thêm chức năng"}
                  >
                    {expandedCards.cms ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Danh sách chức năng (Mặc định 4 mục để 3 thẻ dài bằng nhau) */}
                <div className="space-y-1.5 animate-in fade-in duration-200">
                  {filterItems(expandedCards.cms ? cmsItems : cmsItems.slice(0, 4)).map((item) => {
                    const IconComp = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={item.action}
                        className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-slate-50/80 hover:bg-emerald-50/90 border border-slate-100 hover:border-emerald-200 shadow-2xs hover:shadow-xs hover:translate-x-0.5 transition-all cursor-pointer group/row"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <IconComp className="w-3.5 h-3.5 text-emerald-600 shrink-0 group-hover/row:scale-120 group-hover/row:text-teal-600 transition-transform" />
                          <div className="min-w-0">
                            <span className="text-[11px] font-bold text-[#071753] truncate block group-hover/row:text-emerald-700 transition-colors">
                              {item.title}
                            </span>
                            <span className="text-[9px] text-slate-500 truncate block">
                              {item.desc}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                          {item.badge && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-emerald-100/70 text-emerald-700 border border-emerald-200/80 uppercase tracking-wider">
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/row:text-emerald-600 group-hover/row:translate-x-1 transition-all" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Nút bấm mở rộng nếu đang giấu chức năng */}
                {cmsItems.length > 4 && (
                  <button
                    onClick={() => toggleExpandCard('cms')}
                    className="w-full mt-2 py-1.5 px-2 text-[10px] font-extrabold text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50/90 rounded-xl transition-all flex items-center justify-center gap-1 border border-dashed border-emerald-300/80 cursor-pointer shadow-2xs hover:border-emerald-400"
                  >
                    {expandedCards.cms ? (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        <span>Thu gọn chức năng</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        <span>Mở rộng thêm +5 chức năng</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Chân thẻ mở chuyên trang Cổng thông tin */}
              <div className="pt-2.5 mt-3 border-t border-emerald-100/60 flex items-center justify-between text-[10px]">
                <span className="text-[#536A95] font-semibold">9 phân hệ</span>
                <button 
                  onClick={() => onNavigatePortalTab && onNavigatePortalTab('news')}
                  className="font-bold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer flex items-center gap-1 hover:gap-1.5"
                >
                  <span>Xem Tin tức</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>

            </motion.div>

            {/* ========================================================================= */}
            {/* NHÓM 3: QUẢN TRỊ HỆ THỐNG (5 CHỨC NĂNG - THEO ẢNH 3) */}
            {/* ========================================================================= */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3, ease: 'easeOut' }}
              whileHover={{ y: -4 }}
              className="studio-card-purple p-3.5 sm:p-4.5 flex flex-col justify-between h-full group"
            >
              <div>
                {/* Thẻ Header có Icon Minh họa Nhóm */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-indigo-100/60">
                  <div className="flex items-center gap-2.5">
                    {/* 01 Icon minh họa đi kèm thẻ */}
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all shrink-0">
                      <Settings className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-black text-xs sm:text-[13px] text-[#071753] tracking-tight leading-tight uppercase">
                          QUẢN TRỊ HỆ THỐNG
                        </h3>
                        <span className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                          5
                        </span>
                      </div>
                      <p className="text-[10px] text-[#536A95] font-medium leading-tight mt-0.5">
                        Thông báo, cán bộ, audit logs & email
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleExpandCard('admin')}
                    className="w-7 h-7 rounded-full bg-purple-50/80 hover:bg-purple-100 text-purple-700 flex items-center justify-center transition-all cursor-pointer shrink-0 hover:scale-110 shadow-2xs"
                    title={expandedCards.admin ? "Thu gọn về ban đầu" : "Mở rộng xem thêm chức năng"}
                  >
                    {expandedCards.admin ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Danh sách chức năng (Mặc định 4 mục để 3 thẻ dài bằng nhau) */}
                <div className="space-y-1.5 animate-in fade-in duration-200">
                  {filterItems(expandedCards.admin ? adminItems : adminItems.slice(0, 4)).map((item) => {
                    const IconComp = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={item.action}
                        className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-slate-50/80 hover:bg-purple-50/90 border border-slate-100 hover:border-purple-200 shadow-2xs hover:shadow-xs hover:translate-x-0.5 transition-all cursor-pointer group/row"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <IconComp className="w-3.5 h-3.5 text-purple-600 shrink-0 group-hover/row:scale-120 group-hover/row:text-pink-600 transition-transform" />
                          <div className="min-w-0">
                            <span className="text-[11px] font-bold text-[#071753] truncate block group-hover/row:text-purple-700 transition-colors">
                              {item.title}
                            </span>
                            <span className="text-[9px] text-slate-500 truncate block">
                              {item.desc}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                          {item.badge && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-purple-100/70 text-purple-700 border border-purple-200/80 uppercase tracking-wider">
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/row:text-purple-600 group-hover/row:translate-x-1 transition-all" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Nút bấm mở rộng nếu đang giấu chức năng */}
                {adminItems.length > 4 && (
                  <button
                    onClick={() => toggleExpandCard('admin')}
                    className="w-full mt-2 py-1.5 px-2 text-[10px] font-extrabold text-purple-700 hover:text-purple-900 hover:bg-purple-50/90 rounded-xl transition-all flex items-center justify-center gap-1 border border-dashed border-purple-300/80 cursor-pointer shadow-2xs hover:border-purple-400"
                  >
                    {expandedCards.admin ? (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        <span>Thu gọn chức năng</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        <span>Mở rộng thêm +1 chức năng</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Chân thẻ mở quản trị tài khoản */}
              <div className="pt-2.5 mt-3 border-t border-purple-100/60 flex items-center justify-between text-[10px]">
                <span className="text-[#536A95] font-semibold">5 module</span>
                <button 
                  onClick={() => onGoToOffice && onGoToOffice('users')}
                  className="font-bold text-purple-700 hover:text-purple-900 transition-colors cursor-pointer flex items-center gap-1 hover:gap-1.5"
                >
                  <span>Cán bộ</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>

            </motion.div>

          </section>
        </div>

        {/* QUICK STATS BAR - 5 Columns, Compact, Flat & Fully Clickable */}
        <div className="bg-white/95 backdrop-blur-md rounded-[20px] border border-[#DCE8F5] shadow-[0_8px_20px_rgba(20,50,90,0.06)] p-3 sm:p-4 flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 lg:gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[#E5EDF6] mb-3">
          
          {/* Item 1: Đang online */}
          <div 
            onClick={() => setIsStatsModalOpen(true)}
            className="flex items-center gap-3 flex-1 min-w-[160px] justify-center px-3 py-1 cursor-pointer hover:bg-slate-50/60 rounded-xl transition-colors group/stat"
            title="Bấm để xem chi tiết lưu lượng"
          >
            <div className="relative w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover/stat:scale-105 transition-transform">
              <Users className="w-5 h-5" />
              <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold text-emerald-600">Đang online</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-[#071753]">{onlineCount || 1}</span>
                <span className="text-[11px] text-[#536A95] font-medium">người</span>
              </div>
            </div>
          </div>

          {/* Item 2: Bài viết đã xuất bản */}
          <div 
            onClick={() => onNavigatePortalTab && onNavigatePortalTab('news')}
            className="flex items-center gap-3 flex-1 min-w-[160px] justify-center px-3 py-1 cursor-pointer hover:bg-slate-50/60 rounded-xl transition-colors group/stat"
            title="Xem danh mục tin bài"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover/stat:scale-105 transition-transform">
              <Newspaper className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-medium text-[#536A95]">Bài viết đã xuất bản</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-[#071753]">{publishedArticlesCount}</span>
                <span className="text-[11px] text-[#536A95] font-medium">bài</span>
              </div>
            </div>
          </div>

          {/* Item 3: Phản ánh chờ xử lý */}
          <div 
            onClick={() => onNavigatePortalTab && onNavigatePortalTab('opinion')}
            className="flex items-center gap-3 flex-1 min-w-[160px] justify-center px-3 py-1 cursor-pointer hover:bg-slate-50/60 rounded-xl transition-colors group/stat"
            title="Xem phản ánh chờ duyệt"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover/stat:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-medium text-[#536A95]">Phản ánh chờ xử lý</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-[#071753]">{pendingOpinionsCount}</span>
                <span className="text-[11px] text-[#536A95] font-medium">phiếu</span>
              </div>
            </div>
          </div>

          {/* Item 4: Đơn vị trực thuộc */}
          <div 
            onClick={() => onNavigatePortalTab ? onNavigatePortalTab('map') : onGoToOffice && onGoToOffice('neighborhood_map')}
            className="flex items-center gap-3 flex-1 min-w-[160px] justify-center px-3 py-1 cursor-pointer hover:bg-slate-50/60 rounded-xl transition-colors group/stat"
            title="Xem bản đồ 21 khu phố"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover/stat:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-medium text-[#536A95]">Đơn vị trực thuộc</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-[#071753]">21</span>
                <span className="text-[11px] text-[#536A95] font-medium">khu phố/đơn vị</span>
              </div>
            </div>
          </div>

          {/* Item 5: Lịch công tác hôm nay */}
          <div 
            onClick={() => showToast('Hôm nay phường có 3 hoạt động công tác, hội họp và tuyên truyền.')}
            className="flex items-center justify-between flex-1 min-w-[180px] px-3 py-1 cursor-pointer hover:bg-slate-50/60 rounded-xl transition-colors group/item5"
            title="Xem lịch hoạt động"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover/item5:scale-105 transition-transform">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-medium text-[#536A95]">Lịch công tác hôm nay</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-[#071753]">3</span>
                  <span className="text-[11px] text-[#536A95] font-medium">hoạt động</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#536A95] group-hover/item5:text-blue-600 group-hover/item5:translate-x-1 transition-all" />
          </div>

        </div>

        {/* BOTTOM FOOTER */}
        <footer className="mt-2 py-3 border-t border-[#D8E5F4]/80 flex flex-col sm:flex-row items-center sm:items-start justify-start text-xs text-[#536A95] font-medium gap-3 sm:gap-8 text-left">
          <p className="text-left shrink-0">© 2026 Uỷ ban MTTQ Việt Nam Phường Chánh Hiệp - Phiên bản Văn phòng số 2.0</p>
          <div className="flex items-center justify-start flex-wrap gap-4 text-xs font-semibold">
            <button 
              onClick={() => showToast('Đang tải cẩm nang hướng dẫn sử dụng')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Hướng dẫn sử dụng
            </button>
            <span>•</span>
            <button 
              onClick={() => showToast('Hệ thống đạt tiêu chuẩn an toàn an ninh mạng')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              An toàn & Bảo mật
            </button>
            <span>•</span>
            <button 
              onClick={() => showToast('Tổng đài hỗ trợ kỹ thuật: 0274.3822.xxx')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Hỗ trợ kỹ thuật
            </button>
          </div>
        </footer>

      </div>

      {/* Visitor Stats Modal */}
      <VisitorStatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        onlineCount={onlineCount || 1}
        stats={stats}
      />

    </div>
  );
};
