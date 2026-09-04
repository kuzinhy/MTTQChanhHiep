import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  HardDrive, 
  Newspaper, 
  Award, 
  MessageSquare, 
  Sparkles, 
  FileCheck, 
  BarChart3, 
  Users, 
  ShieldAlert, 
  Building2, 
  Lock, 
  ChevronDown, 
  FileText, 
  Layers,
  Bell, 
  LucideIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { canAccessView } from '../../lib/rbac';
import { UserRole } from '../../types';

interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

interface DigitalOfficeSidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onGoToPortal?: () => void;
  onLogout?: () => void;
  staffName?: string;
  staffRole?: string;
  staffAvatar?: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const DigitalOfficeSidebar: React.FC<DigitalOfficeSidebarProps> = ({
  currentView,
  setCurrentView,
  staffRole = 'STAFF',
  isMobileOpen = false,
  onCloseMobile
}) => {
  const userRole = (staffRole as UserRole) || 'STAFF';

  // 1. NHÓM TỔNG QUAN & ĐIỀU HÀNH
  const overviewItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Trang Tổng quan', icon: LayoutDashboard },
    { id: 'neighborhood_map', label: 'Bản đồ 21 Khu phố', icon: Building2, badge: '21 KP' },
    { id: 'tasks', label: 'Quản lý Công việc', icon: CheckSquare },
    { id: 'calendar', label: 'Lịch công tác Phường', icon: Calendar },
    { id: 'notifications', label: 'Trung tâm Thông báo', icon: Bell, badge: 'REALTIME' },
    { id: 'ai_assistant', label: 'Trợ lý tham mưu MTTQ', icon: Sparkles, badge: 'AI' },
  ];

  // 2. NHÓM QUẢN TRỊ NỘI DUNG & NGHIỆP VỤ (CMS & Nghiệp vụ Mặt trận)
  const webMenuItems: SidebarItem[] = [
    { id: 'cms', label: 'Tin tức & Bài viết', icon: Newspaper, badge: 'TIN BÀI' },
    { id: 'cms_documents', label: 'Văn bản & Chỉ đạo', icon: FileText, badge: 'VĂN BẢN' },
    { id: 'competitions_admin', label: 'Hội thi & Ngân hàng đề', icon: Award, badge: 'HỘI THI' },
    { id: 'opinions', label: 'Xử lý Dân nguyện', icon: MessageSquare, badge: 'DÂN NGUYỆN' },
    { id: 'surveys_admin', label: 'Khảo sát & Dư luận', icon: BarChart3, badge: 'KHẢO SÁT' },
    { id: 'member_orgs_admin', label: 'Tổ chức Thành viên', icon: Users, badge: 'THÀNH VIÊN' },
    { id: 'cultural_space_admin', label: 'Không gian Văn hóa 3D', icon: Building2, badge: '3D VIRTUAL' },
  ];

  const webViewIds = ['cms', 'cms_articles', 'cms_documents', 'competitions_admin', 'question_banks', 'surveys_admin', 'opinions', 'member_orgs_admin', 'cultural_space_admin'];
  const isCurrentViewWeb = webViewIds.includes(currentView);

  // Accordion state for "Quản trị web"
  const [isWebMenuOpen, setIsWebMenuOpen] = useState<boolean>(true);

  // Auto-expand if the active view is inside web group
  useEffect(() => {
    if (isCurrentViewWeb) {
      setIsWebMenuOpen(true);
    }
  }, [currentView, isCurrentViewWeb]);

  const hasAnyWebAccess = webMenuItems.some(item => canAccessView(userRole, item.id));

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-68 xl:w-72 bg-white text-slate-800 flex flex-col h-screen shrink-0 border-r border-slate-200 select-none shadow-md
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
      <div className="p-4 border-b border-blue-500/30 bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-md border border-amber-300">
            <img
              src="https://www.mattrancantho.vn/files/images/Logo%20-%20Icon/Logo%20MTTQ.png"
              alt="Logo MTTQ"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-black text-amber-300 tracking-wider uppercase">VĂN PHÒNG SỐ</h2>
              <span className="text-[8px] bg-white/20 backdrop-blur-xs text-white font-black px-1.5 py-0.2 rounded-full border border-white/30">V2.0</span>
            </div>
            <p className="text-[10px] text-blue-100 font-semibold mt-0.5">MTTQ Phường Chánh Hiệp</p>
          </div>
        </div>
      </div>

      {/* Navigation Links - Clean Streamlined 3 Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3.5 text-xs scrollbar-thin">
        
        {/* NHÓM 1: TỔNG QUAN & ĐIỀU HÀNH */}
        <div className="space-y-1">
          <h3 className="px-3 text-[10px] font-extrabold text-blue-900 uppercase tracking-wider">
            TỔNG QUAN &amp; ĐIỀU HÀNH
          </h3>
          
          {overviewItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const isAllowed = canAccessView(userRole, item.id);

            return (
              <motion.button
                key={item.id}
                whileHover={{ x: isAllowed ? 3 : 0 }}
                whileTap={{ scale: isAllowed ? 0.98 : 1 }}
                onClick={() => {
                  if (isAllowed) setCurrentView(item.id);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer relative ${
                  isActive 
                    ? 'text-white font-extrabold shadow-md' 
                    : isAllowed 
                      ? 'text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold' 
                      : 'text-slate-400 hover:bg-slate-100/50 cursor-not-allowed opacity-60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-main-tab-indicator"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-xl border border-blue-400 shadow-md"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <div className="flex items-center gap-2.5 relative z-10">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : isAllowed ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className={isActive ? 'text-white font-black' : ''}>{item.label}</span>
                </div>
                
                <div className="flex items-center gap-1 relative z-10">
                  {!isAllowed && <Lock className="w-3 h-3 text-slate-400" />}
                  {item.badge && isAllowed && (
                    <span className={`font-black text-[9px] px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-amber-300 text-slate-900 shadow-2xs' : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* NHÓM 2: QUẢN TRỊ NỘI DUNG & NGHIỆP VỤ */}
        <div className="space-y-1">
          <h3 className="px-3 text-[10px] font-extrabold text-blue-900 uppercase tracking-wider flex items-center justify-between">
            <span>NGHIỆP VỤ &amp; CỔNG TT</span>
            <span className="text-[8px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded-full">MTTQ</span>
          </h3>

          <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-b from-blue-50/40 to-indigo-50/30 p-1 shadow-2xs">
            <button
              onClick={() => {
                if (hasAnyWebAccess) {
                  setIsWebMenuOpen(!isWebMenuOpen);
                  if (!isWebMenuOpen && !isCurrentViewWeb) {
                    setCurrentView('cms');
                  }
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                isCurrentViewWeb
                  ? 'bg-blue-600 text-white font-black shadow-sm'
                  : 'text-slate-800 hover:bg-white/80 font-bold'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg ${isCurrentViewWeb ? 'bg-white/20 text-white' : 'bg-blue-600 text-white shadow-2xs'}`}>
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black tracking-tight leading-none">Nghiệp vụ Mặt trận</div>
                  <div className={`text-[9px] mt-0.5 ${isCurrentViewWeb ? 'text-blue-100' : 'text-blue-700 font-medium'}`}>
                    7 chuyên mục tác nghiệp
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                  isCurrentViewWeb ? 'bg-amber-400 text-slate-950 font-black' : 'bg-blue-200/80 text-blue-900'
                }`}>
                  7 MỤC
                </span>
                <motion.div
                  animate={{ rotate: isWebMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className={`w-4 h-4 ${isCurrentViewWeb ? 'text-white' : 'text-blue-700'}`} />
                </motion.div>
              </div>
            </button>

            {/* Submenu Accordion Items */}
            <AnimatePresence initial={false}>
              {isWebMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="pt-1.5 pb-1 px-1 space-y-1 border-t border-blue-200/60 mt-1">
                    {webMenuItems.map((subItem) => {
                      const Icon = subItem.icon;
                      const isActive = currentView === subItem.id || (subItem.id === 'cms' && currentView === 'cms_articles');
                      const isAllowed = canAccessView(userRole, subItem.id);

                      return (
                        <motion.button
                          key={subItem.id}
                          whileHover={{ x: isAllowed ? 3 : 0 }}
                          whileTap={{ scale: isAllowed ? 0.98 : 1 }}
                          onClick={() => {
                            if (isAllowed) {
                              setCurrentView(subItem.id);
                            }
                          }}
                          className={`w-full flex items-center justify-between pl-3 pr-2.5 py-2 rounded-xl transition-all cursor-pointer text-left text-xs relative ${
                            isActive
                              ? 'text-white font-black shadow-sm'
                              : isAllowed
                                ? 'text-slate-700 hover:bg-white hover:text-blue-700 font-semibold'
                                : 'text-slate-400 hover:bg-slate-100/50 cursor-not-allowed opacity-60'
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="active-submenu-tab-indicator"
                              className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-xl ring-1 ring-blue-400"
                              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                          )}
                          <div className="flex items-center gap-2 min-w-0 flex-1 relative z-10">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-amber-300 ring-2 ring-amber-300/40' : 'bg-blue-400'}`} />
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : isAllowed ? 'text-blue-600' : 'text-slate-400'}`} />
                            <span className={`truncate whitespace-nowrap ${isActive ? 'text-white font-black' : ''}`}>{subItem.label}</span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 relative z-10">
                            {!isAllowed && <Lock className="w-3 h-3 text-slate-400" />}
                            {subItem.badge && isAllowed && (
                              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap ${
                                isActive ? 'bg-amber-300 text-slate-900 shadow-2xs' : 'bg-white/90 text-blue-800 border border-blue-200'
                              }`}>
                                {subItem.badge}
                              </span>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </aside>
    </>
  );
};
