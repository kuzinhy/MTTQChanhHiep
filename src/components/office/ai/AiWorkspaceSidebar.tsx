import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  PenTool, 
  FileBarChart2, 
  Compass, 
  AlignLeft, 
  CheckSquare, 
  Mic, 
  CalendarCheck, 
  FileText, 
  ShieldAlert, 
  Users, 
  Megaphone, 
  GitCompare, 
  HelpCircle, 
  TableProperties, 
  ListChecks, 
  FolderKanban, 
  BookTemplate, 
  History, 
  ChevronDown, 
  ChevronRight, 
  Sparkles,
  Search,
  Layers,
  Star,
  ArrowLeft,
  Shield
} from 'lucide-react';
import { AiToolId, AiToolGroup, WorkspaceContextData } from '../../../types';
import { AI_TOOLS_CATALOG } from '../../../lib/aiWorkspaceService';

export type WorkspaceMainView = 
  | 'dashboard' 
  | 'tool' 
  | 'my_documents' 
  | 'dossiers' 
  | 'templates' 
  | 'audit_logs';

interface AiWorkspaceSidebarProps {
  currentView: WorkspaceMainView;
  currentToolId: AiToolId | null;
  onSelectView: (view: WorkspaceMainView) => void;
  onSelectTool: (toolId: AiToolId) => void;
  favorites: AiToolId[];
  onToggleFavorite: (toolId: AiToolId) => void;
  workspaceContext: WorkspaceContextData;
  onOpenContextSettings?: () => void;
  onBackToOffice?: () => void;
}

const getToolIcon = (iconName: string, active: boolean) => {
  const cls = `w-4 h-4 ${active ? 'text-cyan-300' : 'text-slate-400 group-hover:text-blue-400'}`;
  switch (iconName) {
    case 'FileCheck2': return <FileCheck2 className={cls} />;
    case 'PenTool': return <PenTool className={cls} />;
    case 'FileBarChart2': return <FileBarChart2 className={cls} />;
    case 'Compass': return <Compass className={cls} />;
    case 'AlignLeft': return <AlignLeft className={cls} />;
    case 'CheckSquare': return <CheckSquare className={cls} />;
    case 'Mic': return <Mic className={cls} />;
    case 'CalendarCheck': return <CalendarCheck className={cls} />;
    case 'FileText': return <FileText className={cls} />;
    case 'ShieldAlert': return <ShieldAlert className={cls} />;
    case 'Users': return <Users className={cls} />;
    case 'Megaphone': return <Megaphone className={cls} />;
    case 'GitCompare': return <GitCompare className={cls} />;
    case 'HelpCircle': return <HelpCircle className={cls} />;
    case 'TableProperties': return <TableProperties className={cls} />;
    case 'ListChecks': return <ListChecks className={cls} />;
    default: return <Sparkles className={cls} />;
  }
};

export const AiWorkspaceSidebar: React.FC<AiWorkspaceSidebarProps> = ({
  currentView,
  currentToolId,
  onSelectView,
  onSelectTool,
  favorites,
  onToggleFavorite,
  workspaceContext,
  onOpenContextSettings,
  onBackToOffice
}) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [filterQuery, setFilterQuery] = useState('');

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const groupsConfig: { id: AiToolGroup; title: string; badge: string }[] = [
    { id: 'group1_draft_proofread', title: '01. Soạn Thảo & Kiểm Tra', badge: '2 công cụ' },
    { id: 'group2_report_advisory', title: '02. Báo Cáo & Tham Mưu', badge: '4 công cụ' },
    { id: 'group3_conference_event', title: '03. Sự Kiện & Phát Biểu', badge: '3 công cụ' },
    { id: 'group4_mttq_specialized', title: '04. Nghiệp Vụ MTTQ', badge: '3 công cụ' },
    { id: 'group5_smart_utilities', title: '05. Tiện Ích Thông Minh', badge: '4 công cụ' }
  ];

  return (
    <aside className="w-64 md:w-72 bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 text-slate-200 border-r border-slate-800/80 flex flex-col h-full shrink-0 select-none shadow-xl">
      {/* Brand Header */}
      <div className="p-4 border-b border-blue-900/40 bg-slate-950/70">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-500 p-0.5 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950/30 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-white truncate">
                  AI WORKSPACE
                </h3>
                <span className="text-[9px] bg-cyan-500/20 text-cyan-300 font-bold px-1.5 py-0.2 rounded-full border border-cyan-400/30">
                  MTTQ
                </span>
              </div>
              <p className="text-[10px] text-blue-200/70 font-medium truncate">Trợ Lý Tham Mưu Nghiệp Vụ</p>
            </div>
          </div>

          {onBackToOffice && (
            <button
              onClick={onBackToOffice}
              className="p-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 text-blue-300 hover:text-white border border-blue-800/60 transition-colors shadow-2xs shrink-0 flex items-center gap-1 text-[11px] font-semibold"
              title="Quay lại Trang Quản trị"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Filter Search */}
        <div className="mt-3 relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-blue-400/60" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Tìm nhanh 16 công cụ..."
            className="w-full bg-slate-900/90 border border-blue-900/50 text-xs rounded-xl pl-8 pr-2.5 py-1.5 text-slate-200 placeholder:text-slate-500 outline-hidden focus:border-blue-400 focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      {/* Navigation Links Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin">
        {/* Main Dashboard Link */}
        <div>
          <button
            onClick={() => onSelectView('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              currentView === 'dashboard'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-blue-600/30 border border-blue-400/40'
                : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-cyan-300" />
            <span>Trung Tâm Trợ Lý AI</span>
          </button>
        </div>

        {/* 5 Tool Groups */}
        <div className="space-y-3">
          {groupsConfig.map((group) => {
            const groupTools = AI_TOOLS_CATALOG.filter(t => 
              t.group === group.id && 
              (filterQuery ? (t.name.toLowerCase().includes(filterQuery.toLowerCase()) || t.tags.some(tag => tag.toLowerCase().includes(filterQuery.toLowerCase()))) : true)
            );

            if (groupTools.length === 0) return null;

            const isCollapsed = collapsedGroups[group.id];

            return (
              <div key={group.id} className="space-y-1">
                {/* Group Section Header */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-blue-300/80 hover:text-cyan-300 transition-colors uppercase tracking-wider"
                >
                  <span className="flex items-center gap-1.5">
                    {isCollapsed ? <ChevronRight className="w-3 h-3 text-blue-400" /> : <ChevronDown className="w-3 h-3 text-blue-400" />}
                    <span className="truncate">{group.title}</span>
                  </span>
                  <span className="text-[9px] text-slate-500 font-normal shrink-0">{group.badge}</span>
                </button>

                {/* Tool Items in Group */}
                {!isCollapsed && (
                  <div className="space-y-0.5 pl-1">
                    {groupTools.map((tool) => {
                      const isActive = currentView === 'tool' && currentToolId === tool.id;
                      const isFav = favorites.includes(tool.id);

                      return (
                        <div
                          key={tool.id}
                          className={`group flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs transition-all cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20 border border-blue-400/50'
                              : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                          }`}
                          onClick={() => onSelectTool(tool.id)}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {getToolIcon(tool.iconName, isActive)}
                            <span className="truncate text-[12px]">{tool.name}</span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            {tool.badge && !isActive && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-blue-950 text-cyan-300 font-semibold border border-blue-800/60">
                                {tool.badge}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite(tool.id);
                              }}
                              className={`p-0.5 rounded-sm hover:text-amber-300 transition-colors ${
                                isFav ? 'text-amber-400' : 'text-slate-600 opacity-0 group-hover:opacity-100'
                              }`}
                              title={isFav ? 'Bỏ yêu thích' : 'Yêu thích'}
                            >
                              <Star className={`w-3 h-3 ${isFav ? 'fill-amber-400' : ''}`} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Management Section (Dossiers, Templates, History) */}
        <div className="pt-2 border-t border-blue-900/40 space-y-1">
          <div className="px-2 py-1 text-[11px] font-bold text-blue-300/80 uppercase tracking-wider">
            Quản Lý & Hồ Sơ
          </div>

          <button
            onClick={() => onSelectView('my_documents')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentView === 'my_documents'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-cyan-300" />
            <span>Tài Liệu Đã Lưu</span>
          </button>

          <button
            onClick={() => onSelectView('dossiers')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentView === 'dossiers'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <FolderKanban className="w-4 h-4 text-cyan-300" />
            <span>Hồ Sơ Công Việc</span>
          </button>

          <button
            onClick={() => onSelectView('templates')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentView === 'templates'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <BookTemplate className="w-4 h-4 text-cyan-300" />
            <span>Thư Viện Mẫu (Dạy AI)</span>
          </button>

          <button
            onClick={() => onSelectView('audit_logs')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentView === 'audit_logs'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <History className="w-4 h-4 text-cyan-300" />
            <span>Nhật Ký Tham Mưu</span>
          </button>
        </div>
      </div>

      {/* Bottom Workspace Context Summary */}
      <div className="p-3 border-t border-blue-900/50 bg-slate-950/80">
        <div 
          onClick={onOpenContextSettings}
          className="bg-slate-900/90 hover:bg-slate-850 rounded-xl p-2.5 border border-blue-900/60 hover:border-blue-700 text-xs cursor-pointer transition-all shadow-inner"
        >
          <div className="flex items-center justify-between text-[11px] text-cyan-300 font-bold mb-1">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Bối Cảnh Công Tác:</span>
            </span>
            <span className="text-[10px] text-blue-300 bg-blue-950 px-1.5 py-0.2 rounded-md border border-blue-800">Sửa</span>
          </div>
          <p className="text-slate-200 font-semibold truncate text-[11px]">
            {workspaceContext.eventName || 'Công tác thường xuyên'}
          </p>
          <p className="text-[10px] text-blue-200/70 truncate mt-0.5">
            {workspaceContext.eventTime || 'Năm 2026'} • {workspaceContext.scope || 'Phường Chánh Hiệp'}
          </p>
        </div>
      </div>
    </aside>
  );
};

