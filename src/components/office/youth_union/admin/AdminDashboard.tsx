import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Newspaper, 
  Calendar, 
  Award, 
  FileText, 
  Building2, 
  CheckSquare, 
  Lightbulb, 
  Users, 
  Bell, 
  History, 
  Settings, 
  Plus, 
  CheckCircle2, 
  Search, 
  ShieldCheck, 
  FolderOpen,
  X,
  Sliders,
  Sparkles,
  Key,
  Layers,
  Trophy,
  ExternalLink
} from 'lucide-react';
import { 
  BranchInfo,
  loadStoredBranches,
  loadStoredCriteria,
  loadStoredAccounts,
  loadStoredYouthMembers,
  loadStoredArticles,
  saveStoredArticles,
  loadStoredEvents,
  saveStoredEvents,
  loadStoredCompetitions,
  saveStoredCompetitions,
  loadStoredDocuments,
  saveStoredDocuments,
  loadStoredInitiatives,
  saveStoredInitiatives,
  loadStoredAuditLogs,
  saveStoredAuditLogs,
  YouthEvent,
  YouthCompetition,
  YouthDocument,
  YouthInitiative,
  YouthArticle,
  AuditLog
} from '../youthUnionData';

// Import newly designed Workspace Configuration & Emulation Tabs
import { WorkspaceConfigTab } from './WorkspaceConfigTab';
import { BranchesManagementTab } from './BranchesManagementTab';
import { BranchAccountsTab } from './BranchAccountsTab';
import { CriteriaConfigTab } from './CriteriaConfigTab';
import { EmulationRankingTab } from './EmulationRankingTab';
import { YouthMembersRosterTab } from './YouthMembersRosterTab';

interface Props {
  currentUserName?: string;
}

export const AdminDashboard: React.FC<Props> = ({ currentUserName = 'Huy Nguyễn Minh' }) => {
  // Navigation tab state inside Youth Union Admin
  const [currentTab, setCurrentTab] = useState<string>('workspace_config');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [showNewArticleModal, setShowNewArticleModal] = useState(false);
  const [showScoringModal, setShowScoringModal] = useState(false);

  // Dynamic datasets with local persistence
  const [articles, setArticles] = useState<YouthArticle[]>(() => loadStoredArticles());
  const [events, setEvents] = useState<YouthEvent[]>(() => loadStoredEvents());
  const [competitions, setCompetitions] = useState<YouthCompetition[]>(() => loadStoredCompetitions());
  const [documents, setDocuments] = useState<YouthDocument[]>(() => loadStoredDocuments());
  const [initiatives, setInitiatives] = useState<YouthInitiative[]>(() => loadStoredInitiatives());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadStoredAuditLogs());

  // Input states for creation
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleCategory, setNewArticleCategory] = useState('Hoạt động Đoàn');

  const [selectedInitiative, setSelectedInitiative] = useState<YouthInitiative | null>(null);
  const [noveltyScore, setNoveltyScore] = useState(18);
  const [applicabilityScore, setApplicabilityScore] = useState(23);
  const [digitalScore, setDigitalScore] = useState(28);

  // Dynamic counts for sidebar badges
  const [branchesCount, setBranchesCount] = useState<number>(() => loadStoredBranches().length);
  const [criteriaCount, setCriteriaCount] = useState<number>(() => loadStoredCriteria().length);
  const [accountsCount, setAccountsCount] = useState<number>(() => loadStoredAccounts().length);
  const [membersCount, setMembersCount] = useState<number>(() => loadStoredYouthMembers().length);

  // Toast feedback
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Log audit helper
  const logAction = (actionText: string, badgeText: string) => {
    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      user: 'Huy Nguyễn Minh (BTV Đoàn Phường)',
      time: new Date().toLocaleString('vi-VN'),
      action: actionText,
      badge: badgeText
    };
    const nextLogs = [newLog, ...auditLogs];
    setAuditLogs(nextLogs);
    saveStoredAuditLogs(nextLogs);
  };

  // Sync counts when storage updates
  useEffect(() => {
    const handleUpdate = () => {
      setBranchesCount(loadStoredBranches().length);
      setCriteriaCount(loadStoredCriteria().length);
      setAccountsCount(loadStoredAccounts().length);
      setMembersCount(loadStoredYouthMembers().length);
      setArticles(loadStoredArticles());
      setEvents(loadStoredEvents());
      setCompetitions(loadStoredCompetitions());
      setDocuments(loadStoredDocuments());
      setInitiatives(loadStoredInitiatives());
      setAuditLogs(loadStoredAuditLogs());
    };
    window.addEventListener('youth_union_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('youth_union_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [auditLogs]);

  const handleCreateArticle = () => {
    if (!newArticleTitle.trim()) return;
    const newArt: YouthArticle = {
      id: 'art_' + Date.now(),
      title: newArticleTitle.trim(),
      category: newArticleCategory,
      date: new Date().toLocaleDateString('vi-VN'),
      views: 1,
      status: 'Đã đăng',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&auto=format&fit=crop&q=80'
    };
    const nextArticles = [newArt, ...articles];
    setArticles(nextArticles);
    saveStoredArticles(nextArticles);
    setNewArticleTitle('');
    setShowNewArticleModal(false);
    logAction(`Đã đăng bài viết mới: "${newArt.title}"`, 'Bài viết');
    showToast('Đã đăng bài viết mới thành công lên Cổng thông tin!');
  };

  const handleScoreInitiative = () => {
    if (!selectedInitiative) return;
    const total = noveltyScore + applicabilityScore + digitalScore;
    const updated = initiatives.map(init => {
      if (init.id === selectedInitiative.id) {
        return {
          ...init,
          status: 'Đã thẩm định' as const,
          noveltyScore,
          applicabilityScore,
          digitalScore,
          totalScore: total
        };
      }
      return init;
    });
    setInitiatives(updated);
    saveStoredInitiatives(updated);
    setShowScoringModal(false);
    logAction(`Hội đồng đã thẩm định sáng kiến "${selectedInitiative.title}" (${total}đ)`, 'Thẩm định');
    showToast('Đã hoàn tất thẩm định và ghi nhận điểm số sáng kiến!');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-emerald-400 px-5 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-3 animate-fade-in text-sm font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Modern Top Horizontal Menu & Controller Bar */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">HỆ THỐNG ĐIỀU HÀNH</p>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">Quản Trị Đoàn Phường</h3>
            </div>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-black rounded-md border border-blue-200 ml-1">
              Chánh Hiệp 2026
            </span>
          </div>

          {/* Horizontal scrollable navigation track */}
          <div className="flex-1 overflow-x-auto scrollbar-none flex items-center gap-2 pb-1 lg:pb-0 justify-start lg:justify-end">
            {[
              { id: 'workspace_config', label: 'Cài Đặt Workspace', icon: Sliders, badge: 'Cấu hình' },
              { id: 'youth_members', label: 'Sổ Đoàn & Hồ Sơ Đoàn Viên', icon: Users, count: membersCount, badge: 'Số Hóa' },
              { id: 'branches_management', label: 'Cài Đặt Số Lượng & Chi Đoàn', icon: Building2, count: branchesCount },
              { id: 'branch_accounts', label: 'Tạo & Cấp Tài Khoản', icon: Key, count: accountsCount },
              { id: 'criteria_config', label: 'Nội Dung & Điểm Thi Đua', icon: Layers, count: criteriaCount },
              { id: 'emulation_ranking', label: 'Bảng Xếp Hạng Thi Đua', icon: Trophy, badge: 'Live' },
              { id: 'cms_overview', label: 'Bảng Điều Khiển CMS', icon: LayoutDashboard, badge: 'Live' },
              { id: 'initiatives', label: 'Thẩm Định Sáng Kiến', icon: Lightbulb, count: 1 },
              { id: 'audit_logs', label: 'Nhật Ký Audit Logs', icon: History },
            ].map(item => {
              const ItemIcon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border transition-all text-xs font-bold whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/30'
                  }`}
                >
                  <ItemIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.count}
                    </span>
                  )}
                  {item.badge && (
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md shrink-0 uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Welcome Blue Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-xs rounded-full text-xs font-semibold mb-3 border border-white/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>HỆ THỐNG QUẢN TRỊ CMS • PHƯỜNG CHÁNH HIỆP</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Xin chào, {currentUserName}!
                </h1>
                <p className="text-xs sm:text-sm text-blue-100 mt-1 font-medium max-w-2xl">
                  Vai trò: Quản trị viên Cấp cao / Bí thư Đoàn Phường Chánh Hiệp • Trung tâm điều phối & cài đặt Workspace Chi đoàn.
                </p>
              </div>

              {/* Action Buttons in Banner */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setCurrentTab('branches_management')}
                  className="px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Cài đặt Chi đoàn</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab('criteria_config')}
                  className="px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Nội dung thi đua</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab('emulation_ranking')}
                  className="px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Bảng xếp hạng</span>
                </button>
              </div>
            </div>
          </div>

          {/* TAB 1: WORKSPACE CONFIGURATION */}
          {currentTab === 'workspace_config' && (
            <WorkspaceConfigTab onNotify={showToast} />
          )}

          {/* TAB: SỔ ĐOÀN ĐIỆN TỬ & HỒ SƠ ĐOÀN VIÊN */}
          {currentTab === 'youth_members' && (
            <YouthMembersRosterTab onNotify={showToast} />
          )}

          {/* TAB 2: BRANCHES & QUANTITY CONFIGURATION */}
          {currentTab === 'branches_management' && (
            <BranchesManagementTab onNotify={showToast} />
          )}

          {/* TAB 3: BRANCH ACCOUNTS MANAGEMENT */}
          {currentTab === 'branch_accounts' && (
            <BranchAccountsTab onNotify={showToast} />
          )}

          {/* TAB 4: CRITERIA & POINTS CONFIGURATION */}
          {currentTab === 'criteria_config' && (
            <CriteriaConfigTab onNotify={showToast} />
          )}

          {/* TAB 5: EMULATION RANKING & REVIEW */}
          {currentTab === 'emulation_ranking' && (
            <EmulationRankingTab onNotify={showToast} />
          )}

          {/* TAB 6: CMS OVERVIEW */}
          {currentTab === 'cms_overview' && (
            <div className="space-y-6">
              {/* 6 Metric Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* 1. Tổng số Bài viết */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                      <Newspaper className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      0 nháp
                    </span>
                  </div>
                  <p className="text-3xl font-black text-slate-900">{articles.length}</p>
                  <p className="text-xs font-black text-slate-800 mt-1">Tổng số Bài viết</p>
                  <p className="text-xs text-slate-400 mt-0.5">{articles.length} đã xuất bản • 0 chờ duyệt</p>
                </div>

                {/* 2. Sự kiện & Lịch Đoàn */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      Thời gian thực
                    </span>
                  </div>
                  <p className="text-3xl font-black text-slate-900">4</p>
                  <p className="text-xs font-black text-slate-800 mt-1">Sự kiện & Lịch Đoàn</p>
                  <p className="text-xs text-slate-400 mt-0.5">4 sự kiện sắp tới</p>
                </div>

                {/* 3. Văn bản Ban hành */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      PDF / Word
                    </span>
                  </div>
                  <p className="text-3xl font-black text-slate-900">3</p>
                  <p className="text-xs font-black text-slate-800 mt-1">Văn bản Ban hành</p>
                  <p className="text-xs text-slate-400 mt-0.5">Kho văn bản số hóa 2026</p>
                </div>

                {/* 4. Hội thi trực tuyến */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700">
                      Đang diễn ra
                    </span>
                  </div>
                  <p className="text-3xl font-black text-slate-900">3</p>
                  <p className="text-xs font-black text-slate-800 mt-1">Hội thi Trực tuyến</p>
                  <p className="text-xs text-slate-400 mt-0.5">1.250 lượt thi tuần này</p>
                </div>

                {/* 5. Chi đoàn trực thuộc */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700">
                      Cơ cấu tổ chức
                    </span>
                  </div>
                  <p className="text-3xl font-black text-slate-900">{branchesCount}</p>
                  <p className="text-xs font-black text-slate-800 mt-1">Chi Đoàn Trực Thuộc</p>
                  <p className="text-xs text-slate-400 mt-0.5">100% đã thiết lập Workspace</p>
                </div>

                {/* 6. Tiêu chí thi đua */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-sky-50 text-sky-600 rounded-2xl">
                      <CheckSquare className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700">
                      Năm 2026
                    </span>
                  </div>
                  <p className="text-3xl font-black text-slate-900">{criteriaCount}</p>
                  <p className="text-xs font-black text-slate-800 mt-1">Tiêu Chí Thi Đua</p>
                  <p className="text-xs text-slate-400 mt-0.5">Bộ tiêu chuẩn 100 điểm</p>
                </div>
              </div>

              {/* Recent Articles list */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-black text-slate-900">Tin tức & Hoạt động xuất bản gần đây</h3>
                  <button
                    onClick={() => setShowNewArticleModal(true)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    + Đăng tin mới
                  </button>
                </div>
                <div className="space-y-3">
                  {articles.slice(0, 4).map(art => (
                    <div key={art.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={art.image} alt={art.title} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <p className="text-xs font-black text-slate-900 line-clamp-1">{art.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{art.category} • {art.date}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {art.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SÁNG KIẾN */}
          {currentTab === 'initiatives' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-900">Thẩm Định Sáng Kiến & Hiến Kế Thanh Niên</h2>
                <p className="text-xs text-slate-500 mt-0.5">Hội đồng thẩm định, ghi nhận và xếp loại các sáng kiến số hóa từ cơ sở</p>
              </div>
              <div className="space-y-4">
                {initiatives.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">Chưa có đề án hiến kế nào được nộp.</p>
                ) : (
                  initiatives.map(init => (
                    <div key={init.id} className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${init.status === 'Chờ thẩm định' ? 'bg-amber-50/70 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                      <div>
                        <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full ${init.status === 'Chờ thẩm định' ? 'bg-amber-200 text-amber-950' : 'bg-emerald-100 text-emerald-800'}`}>
                          {init.status}
                        </span>
                        <h3 className="text-sm font-black text-slate-900 mt-2">
                          {init.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1">
                          Đoàn viên hiến kế: <strong className="text-slate-800">{init.author}</strong> • {init.branch} • Ngày nộp: {init.date}
                        </p>
                        {init.status === 'Đã thẩm định' && (
                          <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold">
                            <span className="bg-slate-200/80 px-2.5 py-1 rounded-md text-slate-700">Tính mới: {init.noveltyScore}đ</span>
                            <span className="bg-slate-200/80 px-2.5 py-1 rounded-md text-slate-700">Khả thi: {init.applicabilityScore}đ</span>
                            <span className="bg-slate-200/80 px-2.5 py-1 rounded-md text-slate-700">Chuyển đổi số: {init.digitalScore}đ</span>
                            <span className="bg-emerald-100 px-2.5 py-1 rounded-md text-emerald-700">Tổng điểm: {init.totalScore}đ / 75đ</span>
                          </div>
                        )}
                      </div>
                      {init.status === 'Chờ thẩm định' ? (
                        <button
                          onClick={() => { setSelectedInitiative(init); setShowScoringModal(true); }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
                        >
                          Chấm điểm đề án
                        </button>
                      ) : (
                        <div className="text-xs font-bold text-emerald-600 shrink-0 self-start sm:self-center bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                          ✓ Đã duyệt đề án
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: AUDIT LOGS */}
          {currentTab === 'audit_logs' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-900">Nhật Ký Hoạt Động Hệ Thống (Audit Logs)</h2>
                <p className="text-xs text-slate-500 mt-0.5">Ghi nhận thời gian thực các thay đổi hệ thống và tương tác của đoàn cơ sở</p>
              </div>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-xs">{log.user}</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-md">{log.badge}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{log.action}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Đăng bài viết mới */}
      {showNewArticleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">+ Đăng bài viết mới lên Cổng thông tin</h3>
              <button onClick={() => setShowNewArticleModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề bài viết</label>
                <input
                  type="text"
                  value={newArticleTitle}
                  onChange={(e) => setNewArticleTitle(e.target.value)}
                  placeholder="Nhập tiêu đề tin tức, hoạt động Đoàn..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chuyên mục</label>
                <select
                  value={newArticleCategory}
                  onChange={(e) => setNewArticleCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                >
                  <option value="Hoạt động Đoàn">Hoạt động Đoàn</option>
                  <option value="Công tác Đội">Công tác Đội</option>
                  <option value="Chuyển đổi số">Chuyển đổi số</option>
                  <option value="Thanh niên khởi nghiệp">Thanh niên khởi nghiệp</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowNewArticleModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateArticle}
                disabled={!newArticleTitle.trim()}
                className="px-5 py-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl cursor-pointer"
              >
                Xuất bản ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Chấm điểm sáng kiến */}
      {showScoringModal && selectedInitiative && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Hội đồng thẩm định sáng kiến số</h3>
              <button onClick={() => { setShowScoringModal(false); setSelectedInitiative(null); }} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100">
                <p className="text-xs font-black text-slate-900">Đề án: {selectedInitiative.title}</p>
                <p className="text-[11px] text-slate-500 mt-1">Đề xuất bởi: {selectedInitiative.author} • {selectedInitiative.branch}</p>
              </div>
              <div className="space-y-3.5 text-xs pt-2">
                <div>
                  <label className="flex items-center justify-between font-bold text-slate-700 mb-1">
                    <span>1. Tính mới & Sáng tạo (Tối đa 20đ):</span>
                    <span className="text-blue-600">{noveltyScore}đ</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={noveltyScore}
                    onChange={(e) => setNoveltyScore(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="flex items-center justify-between font-bold text-slate-700 mb-1">
                    <span>2. Khả năng áp dụng thực tiễn (Tối đa 25đ):</span>
                    <span className="text-blue-600">{applicabilityScore}đ</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={applicabilityScore}
                    onChange={(e) => setApplicabilityScore(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="flex items-center justify-between font-bold text-slate-700 mb-1">
                    <span>3. Hiệu quả chuyển đổi số (Tối đa 30đ):</span>
                    <span className="text-blue-600">{digitalScore}đ</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={digitalScore}
                    onChange={(e) => setDigitalScore(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between font-black text-slate-900 border border-slate-100">
                  <span>Tổng điểm tích lũy:</span>
                  <span className="text-sm text-emerald-600">{noveltyScore + applicabilityScore + digitalScore}đ / 75đ</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => { setShowScoringModal(false); setSelectedInitiative(null); }}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={handleScoreInitiative}
                className="px-5 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
              >
                Phê duyệt & Lưu điểm số
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
