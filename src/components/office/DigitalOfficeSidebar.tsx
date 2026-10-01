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
  HardDrive,
  MapPin,
  HeartHandshake,
  Brain,
  Activity,
  Database,
  HelpCircle,
  Bot,
  Eye,
  LucideIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppStorageEngine } from '../../lib/storage';
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
  onGoToPortal,
  staffRole = 'STAFF',
  isMobileOpen = false,
  onCloseMobile
}) => {
  const userRole = (staffRole as UserRole) || 'STAFF';

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  const [unviewedVolunteersCount, setUnviewedVolunteersCount] = useState<number>(0);

  useEffect(() => {
    const checkVolunteers = () => {
      try {
        const vols = AppStorageEngine.getVolunteers() || [];
        const count = vols.filter((v: any) => v.isNew || !v.viewedByAdmin || v.status === 'PENDING').length;
        setUnviewedVolunteersCount(count);
      } catch {
        setUnviewedVolunteersCount(0);
      }
    };

    checkVolunteers();
    window.addEventListener('storage', checkVolunteers);
    const interval = setInterval(checkVolunteers, 3000);
    return () => {
      window.removeEventListener('storage', checkVolunteers);
      clearInterval(interval);
    };
  }, []);

  // Defined Sidebar Groups
  const groups: SidebarGroup[] = useMemo(() => [
    {
      id: 'group_ai',
      title: 'TRUNG TÂM THAM MƯU AI',
      icon: Sparkles,
      badgeText: 'SMART',
      accentColor: 'blue',
      items: [
        { id: 'dashboard', label: 'Trang Tổng quan', icon: LayoutDashboard },
        { id: 'ai_settings', label: 'Cài đặt trợ lý', icon: Bot, badge: 'CÀI ĐẶT' },
        { id: 'youth_union_admin', label: 'Quản trị Đoàn', icon: Users, badge: 'ADMIN' },
        { id: 'youth_union_workspace', label: 'Workspace Chi đoàn', icon: Sparkles, badge: 'WS' },
      ]
    },
    {
      id: 'group_neighborhood',
      title: 'QUẢN LÝ 21 KHU PHỐ',
      icon: Building2,
      badgeText: '21 KP',
      accentColor: 'amber',
      items: [
        { id: 'neighborhood_management', label: 'Quản lý Khu phố Số', icon: Building2, badge: 'ĐỊA BÀN' },
        { id: 'neighborhood_map', label: 'Bản đồ 21 Khu phố', icon: MapPin, badge: 'GIS' },
        { id: 'neighborhood_emulation', label: 'Thi đua 21 Khu phố', icon: Award, badge: 'THI ĐUA' },
      ]
    },
    {
      id: 'group_cms',
      title: 'NGHIỆP VỤ & CỔNG TT',
      icon: Layers,
      badgeText: 'MTTQ',
      accentColor: 'blue',
      items: [
        { id: 'cms', label: 'Tin tức & Bài viết', icon: Newspaper, badge: 'TIN BÀI' },
        { id: 'cms_initiatives', label: 'Mô hình & Sáng kiến', icon: Lightbulb, badge: 'MÔ HÌNH' },
        { id: 'cms_about', label: 'Giới thiệu MTTQ', icon: Info, badge: 'GIỚI THIỆU' },
        { id: 'cms_documents', label: 'Văn bản triển khai', icon: FileText, badge: 'VĂN BẢN' },
        { id: 'opinions', label: 'Xử lý Dân nguyện', icon: MessageSquare, badge: 'DÂN NGUYỆN' },
        { id: 'surveys_admin', label: 'Khảo sát & Dư luận', icon: BarChart3, badge: 'KHẢO SÁT' },
        { id: 'competitions_admin', label: 'Hội thi & Ngân hàng đề', icon: Award, badge: 'HỘI THI' },
        { id: 'member_orgs_admin', label: 'Tổ chức Thành viên', icon: Users, badge: 'THÀNH VIÊN' },
        { 
          id: 'volunteers_admin', 
          label: 'Quản lý Tình nguyện viên', 
          icon: HeartHandshake, 
          badge: unviewedVolunteersCount > 0 ? `+${unviewedVolunteersCount} MỚI` : 'TÌNH NGUYỆN',
          isNewHighlight: unviewedVolunteersCount > 0 
        },
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
        { id: 'google_drive_storage', label: 'Cơ chế lưu trữ Google Drive', icon: HardDrive, badge: 'DRIVE' },
        { id: 'notifications', label: 'Trung tâm Thông báo', icon: Bell, badge: 'REALTIME' },
        { id: 'users', label: 'Quản lý Tài khoản Cán bộ', icon: Users, badge: 'CÁN BỘ' },
        { id: 'analytics', label: 'Thống kê & Báo cáo', icon: PieChart, badge: 'THỐNG KÊ' },
        { id: 'audit_logs', label: 'Nhật ký Hoạt động (Audit)', icon: ShieldAlert, badge: 'AUDIT' },
        { id: 'email_settings', label: 'Cấu hình Email Tự động', icon: Settings, badge: 'EMAIL' },
      ]
    }
  ], []);

  // Track expanded groups state
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    group_ai: true,
    group_neighborhood: true,
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

  // Admin Menu Default 4 Items Limit State
  const INITIAL_CORE_ITEMS_LIMIT = 4;
  const [showAllMenuItems, setShowAllMenuItems] = useState<boolean>(() => {
    return localStorage.getItem('chanh_hiep_admin_menu_show_all') === 'true';
  });
  const [expandedGroupItems, setExpandedGroupItems] = useState<Record<string, boolean>>({});

  const handleToggleShowAllMenuItems = () => {
    const nextState = !showAllMenuItems;
    setShowAllMenuItems(nextState);
    localStorage.setItem('chanh_hiep_admin_menu_show_all', String(nextState));
  };

  const toggleGroupShowMore = (groupId: string) => {
    setExpandedGroupItems(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleExpandAll = () => {
    setShowAllMenuItems(true);
    localStorage.setItem('chanh_hiep_admin_menu_show_all', 'true');
    setExpandedGroups({
      group_ai: true,
      group_neighborhood: true,
      group_cms: true,
      group_admin: true
    });
  };

  const handleCollapseAll = () => {
    setShowAllMenuItems(false);
    localStorage.setItem('chanh_hiep_admin_menu_show_all', 'false');
    setExpandedGroupItems({});
    setExpandedGroups({
      group_ai: false,
      group_neighborhood: false,
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
        w-68 xl:w-72 bg-blue-800 text-blue-50 flex flex-col h-screen shrink-0 border-r border-blue-900 select-none shadow-xl
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-3.5 border-b border-amber-300/30 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-900 text-white shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-md border-2 border-amber-400">
              <OptimizedImage
                src="https://res.cloudinary.com/idt08wyp/image/upload/v1789907080/Logo-Mat-Tran-To-Quoc-Viet-Nam.png"
                alt="Logo MTTQ"
                variant="thumbnail"
                priority={true}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-black text-amber-300 tracking-wider uppercase truncate">VĂN PHÒNG SỐ</h2>
                <span className="text-[8px] bg-amber-400 text-blue-900 font-black px-1.5 py-0.2 rounded-full border border-amber-200 shrink-0 shadow-xs">V2.0</span>
              </div>
              <p className="text-[10px] text-blue-50 font-medium truncate mt-0.5">MTTQ Phường Chánh Hiệp</p>
            </div>
          </div>
        </div>

        {/* Search Bar & Compact Controls */}
        <div className="px-3 pt-2.5 pb-1 border-b border-blue-700/50 bg-blue-900/40 shrink-0 space-y-1.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-blue-300 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm nhanh chức năng..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-blue-800/40 border border-blue-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 text-white placeholder:text-blue-300 font-medium transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-blue-300 hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] text-blue-300/80 font-semibold px-0.5 pt-0.5">
            <button
              type="button"
              onClick={handleToggleShowAllMenuItems}
              className="px-2 py-0.5 rounded-md bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-blue-950 font-black text-[9.5px] transition-all flex items-center gap-1 cursor-pointer border border-amber-300/30 shadow-2xs"
              title="Cấu hình hiển thị: 4 mục ban đầu hoặc hiện tất cả"
            >
              <Eye className="w-3 h-3 shrink-0" />
              <span>{showAllMenuItems ? 'Hiện 4 mục chính' : 'Hiện tất cả'}</span>
            </button>

            <div className="flex items-center gap-1.5 text-[10px]">
              <button
                onClick={handleExpandAll}
                className="hover:text-amber-300 cursor-pointer transition-colors"
                title="Mở tất cả chức năng"
              >
                Hiện hết
              </button>
              <span className="text-blue-700">•</span>
              <button
                onClick={handleCollapseAll}
                className="hover:text-amber-300 cursor-pointer transition-colors"
                title="Hiện 4 mục ban đầu"
              >
                Ẩn bớt
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Groups List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-2.5 space-y-2 text-xs scrollbar-thin scrollbar-thumb-blue-700 hover:scrollbar-thumb-blue-600">
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
                (i) => i.id === currentView || 
                (i.id === 'cms' && currentView === 'cms_articles')
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
                      ? 'border-blue-500/50 bg-blue-800/40 shadow-inner' 
                      : 'border-blue-700/40 bg-blue-900/20 hover:border-blue-600'
                  }`}
                >
                  {/* Group Header Toggle Button */}
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className="flex-1 flex items-center justify-between px-2.5 py-2 text-left rounded-xl transition-colors cursor-pointer group focus:outline-none"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`p-1 rounded-md shrink-0 transition-colors ${
                          hasActiveItem ? 'bg-amber-400 text-blue-900 shadow-sm' : 'bg-blue-700/50 text-blue-200 group-hover:bg-blue-600 group-hover:text-white'
                        }`}>
                          <GroupIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className={`text-[11px] font-black tracking-tight uppercase truncate ${
                          hasActiveItem ? 'text-amber-300' : 'text-blue-100'
                        }`}>
                          {group.title}
                        </span>
                      </div>
                    </button>
                    
                    {group.id === 'group_ai' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentView('ai_assistant');
                        }}
                        className="mr-2 p-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-blue-950 hover:from-amber-300 hover:to-amber-400 transition-all shadow-sm active:scale-90 cursor-pointer"
                        title="Trợ lý AI Tham mưu"
                      >
                        <Sparkles className="w-3 h-3" />
                      </button>
                    )}

                    <button
                      onClick={() => toggleGroup(group.id)}
                      className="pr-2 py-2 flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full ${
                        hasActiveItem ? 'bg-amber-400 text-blue-950' : 'bg-blue-800 text-blue-300'
                      }`}>
                        {group.items.length}
                      </span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.12 }}
                      >
                        <ChevronDown className="w-3.5 h-3.5 text-blue-400" />
                      </motion.div>
                    </button>
                  </div>

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
                        <div className="px-1 pb-1 pt-0.5 space-y-0.5 border-t border-blue-700/30">
                          {(() => {
                            const isCustomExpandedGroup = expandedGroupItems[group.id];
                            const activeIndex = group.items.findIndex(i => i.id === currentView || (i.id === 'cms' && currentView === 'cms_articles'));
                            const isSelectedHidden = activeIndex >= INITIAL_CORE_ITEMS_LIMIT;
                            const shouldShowAllForGroup = searchQuery !== '' || showAllMenuItems || isCustomExpandedGroup || isSelectedHidden;

                            const itemsToDisplay = shouldShowAllForGroup ? group.items : group.items.slice(0, INITIAL_CORE_ITEMS_LIMIT);
                            const hiddenCount = group.items.length - INITIAL_CORE_ITEMS_LIMIT;

                            return (
                              <>
                                {itemsToDisplay.map((item) => {
                                  const ItemIcon = item.icon;
                                  const isActive = currentView === item.id || 
                                    (item.id === 'cms' && currentView === 'cms_articles');
                                  const isAllowed = canAccessView(userRole, item.id);

                                  return (
                                    <motion.button
                                      key={item.id}
                                      whileHover={{ x: isAllowed ? 2 : 0 }}
                                      whileTap={{ scale: isAllowed ? 0.98 : 1 }}
                                      onClick={() => {
                                        if (item.id === 'home') {
                                          if (onGoToPortal) onGoToPortal();
                                          if (onCloseMobile) onCloseMobile();
                                          return;
                                        }
                                        if (isAllowed) {
                                          setCurrentView(item.id);
                                          if (onCloseMobile) onCloseMobile();
                                        }
                                      }}
                                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left text-xs relative cursor-pointer ${
                                        isActive
                                          ? 'text-blue-950 font-black shadow-md'
                                          : isAllowed
                                            ? 'text-blue-50 hover:bg-white/10 hover:text-amber-300 font-medium'
                                            : 'text-blue-400/60 hover:bg-white/5 cursor-not-allowed opacity-60'
                                      }`}
                                    >
                                      {isActive && (
                                        <motion.div
                                          layoutId="active-sidebar-pill"
                                          className="absolute inset-0 bg-amber-400 rounded-lg shadow-sm border border-amber-300/50"
                                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                                        />
                                      )}

                                      <div className="flex items-center gap-2 min-w-0 flex-1 relative z-10">
                                        <ItemIcon className={`w-3.5 h-3.5 shrink-0 ${
                                          isActive ? 'text-blue-900' : isAllowed ? 'text-amber-400/80' : 'text-blue-500'
                                        }`} />
                                        <span className={`truncate text-[11px] ${isActive ? 'text-blue-900 font-black' : ''}`}>
                                          {item.label}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-1 shrink-0 relative z-10">
                                        {!isAllowed && <Lock className="w-3 h-3 text-slate-400" />}
                                        {item.badge && isAllowed && (
                                          <span className={`text-[8px] font-black px-1.5 py-0.2 rounded shrink-0 whitespace-nowrap ${
                                            (item as any).isNewHighlight
                                              ? 'bg-rose-600 text-white font-black shadow-xs border border-rose-300'
                                              : isActive 
                                                ? 'bg-blue-900/20 text-blue-950 font-black border border-blue-900/10' 
                                                : 'bg-blue-800 text-blue-100 border border-blue-600/50'
                                          }`}>
                                            {item.badge}
                                          </span>
                                        )}
                                      </div>
                                    </motion.button>
                                  );
                                })}

                                {hiddenCount > 0 && !shouldShowAllForGroup && (
                                  <button
                                    type="button"
                                    onClick={() => toggleGroupShowMore(group.id)}
                                    className="w-full mt-1 px-2 py-1 bg-blue-900/60 hover:bg-amber-400 hover:text-blue-950 text-amber-300 font-extrabold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer border border-blue-700/50 shadow-2xs"
                                  >
                                    <ChevronDown className="w-3 h-3 text-amber-400" />
                                    <span>Xem thêm {hiddenCount} nội dung...</span>
                                  </button>
                                )}

                                {hiddenCount > 0 && isCustomExpandedGroup && !showAllMenuItems && !searchQuery && (
                                  <button
                                    type="button"
                                    onClick={() => toggleGroupShowMore(group.id)}
                                    className="w-full mt-1 px-2 py-1 bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white font-bold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer border border-blue-700/50"
                                  >
                                    <span>▲ Thu gọn 4 nội dung ban đầu</span>
                                  </button>
                                )}
                              </>
                            );
                          })()}
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
