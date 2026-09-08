import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Newspaper, 
  Award, 
  MessageSquare, 
  Sparkles, 
  FileCheck, 
  BarChart3, 
  Users, 
  Building2, 
  Lock, 
  ChevronDown, 
  FileText, 
  Layers,
  Bell, 
  Lightbulb,
  Info,
  Search,
  X,
  Settings,
  ShieldAlert,
  PieChart,
  FolderTree,
  LucideIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OptimizedImage } from '../common/OptimizedImage';
import { canAccessView } from '../../lib/rbac';
import { UserRole } from '../../types';

interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeStyle?: string;
}

interface SidebarGroup {
  id: string;
  title: string;
  icon: LucideIcon;
  badgeText?: string;
  accentColor: 'blue' | 'indigo' | 'amber' | 'emerald';
  items: SidebarItem[];
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

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Defined Sidebar Groups
  const groups: SidebarGroup[] = useMemo(() => [
    {
      id: 'group_overview',
      title: 'TỔNG QUAN & ĐIỀU HÀNH',
      icon: LayoutDashboard,
      badgeText: 'ĐIỀU HÀNH',
      accentColor: 'blue',
      items: [
        { id: 'dashboard', label: 'Trang Tổng quan', icon: LayoutDashboard },
        { id: 'neighborhood_map', label: 'Bản đồ 21 Khu phố', icon: Building2, badge: '21 KP' },
        { id: 'tasks', label: 'Quản lý Công việc', icon: CheckSquare },
        { id: 'calendar', label: 'Lịch công tác Phường', icon: Calendar },
        { id: 'neighborhood_emulation', label: 'Thi đua 21 Khu phố', icon: Award, badge: 'BẢNG VÀNG' },
        { id: 'notifications', label: 'Trung tâm Thông báo', icon: Bell, badge: 'REALTIME' },
      ]
    },
    {
      id: 'group_ai',
      title: 'THAM MƯU & TRỢ LÝ AI',
      icon: Sparkles,
      badgeText: 'AI 2.0',
      accentColor: 'indigo',
      items: [
        { id: 'ai_assistant', label: 'Trợ lý Tham mưu AI', icon: Sparkles, badge: 'WORKSPACE' },
        { id: 'document_ai_plan_generator', label: 'AI Lập Kế hoạch 2.0', icon: FileText, badge: 'AI 2.0' },
        { id: 'administrative_report_exporter', label: 'Xuất Báo cáo Thể thức', icon: FileCheck, badge: 'NĐ 30' },
      ]
    },
    {
      id: 'group_cms',
      title: 'NGHIỆP VỤ & CỔNG TT',
      icon: Layers,
      badgeText: 'MTTQ',
      accentColor: 'amber',
      items: [
        { id: 'cms', label: 'Tin tức & Bài viết', icon: Newspaper, badge: 'TIN BÀI' },
        { id: 'cms_initiatives', label: 'Mô hình & Sáng kiến', icon: Lightbulb, badge: 'MÔ HÌNH' },
        { id: 'cms_documents', label: 'Văn bản & Chỉ đạo', icon: FileText, badge: 'VĂN BẢN' },
        { id: 'cms_about', label: 'Giới thiệu MTTQ', icon: Info, badge: 'GIỚI THIỆU' },
        { id: 'opinions', label: 'Xử lý Dân nguyện', icon: MessageSquare, badge: 'DÂN NGUYỆN' },
        { id: 'surveys_admin', label: 'Khảo sát & Dư luận', icon: BarChart3, badge: 'KHẢO SÁT' },
        { id: 'competitions_admin', label: 'Hội thi & Ngân hàng đề', icon: Award, badge: 'HỘI THI' },
        { id: 'member_orgs_admin', label: 'Tổ chức Thành viên', icon: Users, badge: 'THÀNH VIÊN' },
        { id: 'cultural_space_admin', label: 'Không gian Văn hóa 3D', icon: Building2, badge: '3D VIRTUAL' },
      ]
    },
    {
      id: 'group_admin',
      title: 'QUẢN TRỊ HỆ THỐNG',
      icon: Settings,
      badgeText: 'HỆ THỐNG',
      accentColor: 'emerald',
      items: [
        { id: 'users', label: 'Quản lý Tài khoản Cán bộ', icon: Users, badge: 'CÁN BỘ' },
        { id: 'analytics', label: 'Thống kê & Báo cáo', icon: PieChart, badge: 'THỐNG KÊ' },
        { id: 'templates', label: 'Kho Mẫu Văn bản', icon: FolderTree, badge: 'MẪU VB' },
        { id: 'audit_logs', label: 'Nhật ký Hệ thống', icon: ShieldAlert, badge: 'AUDIT' },
      ]
    }
  ], []);

  // Track expanded groups state
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    group_overview: true,
    group_ai: true,
    group_cms: true,
    group_admin: true
  });

  // Auto expand group containing the current view
  useEffect(() => {
    groups.forEach((group) => {
      const hasActive = group.items.some(
        (item) => item.id === currentView || (item.id === 'cms' && currentView === 'cms_articles')
      );
      if (hasActive) {
        setExpandedGroups((prev) => ({ ...prev, [group.id]: true }));
      }
    });
  }, [currentView, groups]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleExpandAll = () => {
    setExpandedGroups({
      group_overview: true,
      group_ai: true,
      group_cms: true,
      group_admin: true
    });
  };

  const handleCollapseAll = () => {
    setExpandedGroups({
      group_overview: false,
      group_ai: false,
      group_cms: false,
      group_admin: false
    });
  };

  // Filter items based on search query and permissions
  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return groups.map((group) => {
      // Filter items that user has permission to see (or display with lock) AND match search query
      const visibleItems = group.items.filter((item) => {
        const matchesQuery = query === '' || item.label.toLowerCase().includes(query) || (item.badge && item.badge.toLowerCase().includes(query));
        return matchesQuery;
      });

      return {
        ...group,
        items: visibleItems
      };
    }).filter((group) => group.items.length > 0);
  }, [groups, searchQuery]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
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
        <div className="p-3.5 border-b border-blue-500/30 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-md border border-amber-300">
              <OptimizedImage
                src="/assets/logos/logo-mttq.svg"
                alt="Logo MTTQ"
                variant="thumbnail"
                priority={true}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-black text-amber-300 tracking-wider uppercase truncate">VĂN PHÒNG SỐ</h2>
                <span className="text-[8px] bg-white/20 backdrop-blur-xs text-white font-black px-1.5 py-0.2 rounded-full border border-white/30 shrink-0">V2.0</span>
              </div>
              <p className="text-[10px] text-blue-100 font-medium truncate mt-0.5">MTTQ Phường Chánh Hiệp</p>
            </div>
          </div>
        </div>

        {/* Search Bar & Compact Controls */}
        <div className="px-3 pt-2.5 pb-1 border-b border-slate-100 bg-slate-50/70 shrink-0 space-y-1.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm nhanh chức năng..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-slate-800 placeholder:text-slate-400 font-medium transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold px-0.5">
            <span>{searchQuery ? `Tìm thấy ${filteredGroups.reduce((acc, g) => acc + g.items.length, 0)} mục` : 'Danh mục quản trị'}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExpandAll}
                className="hover:text-blue-600 cursor-pointer transition-colors"
                title="Mở rộng tất cả nhóm"
              >
                Mở tất cả
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={handleCollapseAll}
                className="hover:text-blue-600 cursor-pointer transition-colors"
                title="Thu gọn tất cả nhóm"
              >
                Thu gọn
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Groups List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-2.5 space-y-2 text-xs scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
          {filteredGroups.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>Không tìm thấy chức năng phù hợp</p>
            </div>
          ) : (
            filteredGroups.map((group) => {
              const GroupIcon = group.icon;
              const isExpanded = searchQuery !== '' ? true : !!expandedGroups[group.id];
              const hasActiveItem = group.items.some(
                (i) => i.id === currentView || (i.id === 'cms' && currentView === 'cms_articles')
              );

              // Filter out items user strictly cannot access if needed, or show with lock
              const accessibleItemsCount = group.items.filter(i => canAccessView(userRole, i.id)).length;

              if (accessibleItemsCount === 0 && !searchQuery) {
                return null; // Skip groups with zero accessible items for this role
              }

              return (
                <div 
                  key={group.id} 
                  className={`rounded-xl border transition-all ${
                    hasActiveItem 
                      ? 'border-blue-200 bg-gradient-to-b from-blue-50/30 to-slate-50/50 shadow-2xs' 
                      : 'border-slate-200/80 bg-slate-50/40 hover:border-slate-300'
                  }`}
                >
                  {/* Group Header Toggle Button */}
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-left rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`p-1 rounded-md shrink-0 transition-colors ${
                        hasActiveItem ? 'bg-blue-600 text-white' : 'bg-slate-200/80 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700'
                      }`}>
                        <GroupIcon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-black text-slate-800 tracking-tight uppercase truncate">
                        {group.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full ${
                        hasActiveItem ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {group.items.length}
                      </span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                      </motion.div>
                    </div>
                  </button>

                  {/* Group Submenu Items */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-1 pb-1 pt-0.5 space-y-0.5 border-t border-slate-100">
                          {group.items.map((item) => {
                            const ItemIcon = item.icon;
                            const isActive = currentView === item.id || (item.id === 'cms' && currentView === 'cms_articles');
                            const isAllowed = canAccessView(userRole, item.id);

                            return (
                              <motion.button
                                key={item.id}
                                whileHover={{ x: isAllowed ? 2 : 0 }}
                                whileTap={{ scale: isAllowed ? 0.98 : 1 }}
                                onClick={() => {
                                  if (isAllowed) {
                                    setCurrentView(item.id);
                                    if (onCloseMobile) onCloseMobile();
                                  }
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left text-xs relative cursor-pointer ${
                                  isActive
                                    ? 'text-white font-black shadow-xs'
                                    : isAllowed
                                      ? 'text-slate-700 hover:bg-white hover:text-blue-700 font-medium'
                                      : 'text-slate-400 hover:bg-slate-100/50 cursor-not-allowed opacity-60'
                                }`}
                              >
                                {isActive && (
                                  <motion.div
                                    layoutId="active-sidebar-pill"
                                    className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-lg shadow-xs border border-blue-400/40"
                                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                                  />
                                )}

                                <div className="flex items-center gap-2 min-w-0 flex-1 relative z-10">
                                  <ItemIcon className={`w-3.5 h-3.5 shrink-0 ${
                                    isActive ? 'text-white' : isAllowed ? 'text-blue-600' : 'text-slate-400'
                                  }`} />
                                  <span className={`truncate text-[11px] ${isActive ? 'text-white font-extrabold' : ''}`}>
                                    {item.label}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1 shrink-0 relative z-10">
                                  {!isAllowed && <Lock className="w-3 h-3 text-slate-400" />}
                                  {item.badge && isAllowed && (
                                    <span className={`text-[8px] font-black px-1.5 py-0.2 rounded shrink-0 whitespace-nowrap ${
                                      isActive 
                                        ? 'bg-amber-300 text-slate-950 shadow-2xs' 
                                        : 'bg-slate-100 text-slate-600 border border-slate-200/80'
                                    }`}>
                                      {item.badge}
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
              );
            })
          )}
        </div>
      </aside>
    </>
  );
};

export default DigitalOfficeSidebar;
