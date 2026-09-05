import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileSearch,
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
  Star,
  ArrowLeft,
  Settings,
  X,
  Layers
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
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const getToolIcon = (iconName: string, active: boolean) => {
  const cls = `w-4 h-4 shrink-0 transition-colors ${active ? 'text-cyan-300' : 'text-slate-400 group-hover:text-blue-300'}`;
  switch (iconName) {
    case 'FileSearch': return <FileSearch className={cls} />;
    case 'BookTemplate': return <BookTemplate className={cls} />;
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
  onBackToOffice,
  isOpenMobile,
  onCloseMobile
}) => {
  // State to toggle groups collapse/expand
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    group1_docs_dossier: true,
    group2_advisory_report: true,
    group3_meeting_event: true,
    group4_task_operational: true,
    management: true
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const groupsConfig: { id: AiToolGroup; label: string; badge: string }[] = [
    { id: 'group1_docs_dossier', label: '01. Văn Bản & Hồ Sơ', badge: 'Chủ lực' },
    { id: 'group2_advisory_report', label: '02. Tham Mưu & Tổng Hợp', badge: 'Chuẩn 10 bước' },
    { id: 'group3_meeting_event', label: '03. Họp & Sự Kiện', badge: 'Trọn gói' },
    { id: 'group4_task_operational', label: '04. Điều Hành & Tác Nghiệp', badge: 'Mặt trận' }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 lg:w-72 bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 text-slate-100 
        flex flex-col h-full border-r border-blue-900/60 shrink-0 shadow-2xl transition-transform duration-300 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header / Brand */}
        <div className="p-4 border-b border-blue-900/60 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div 
            onClick={() => {
              onSelectView('dashboard');
              if (onCloseMobile) onCloseMobile();
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-500 p-0.5 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30 shrink-0">
              <div className="w-full h-full bg-slate-950/50 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-white">AI WORKSPACE</span>
                <span className="text-[9px] bg-cyan-500/20 text-cyan-300 font-extrabold px-1.5 py-0.2 rounded-full border border-cyan-400/30">MTTQ</span>
              </div>
              <p className="text-[10px] text-blue-200/70 font-medium">Trợ Lý Tham Mưu Nghiệp Vụ</p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button 
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-blue-900/50">
          
          {/* Main Dashboard Navigation Item */}
          <div>
            <button
              onClick={() => {
                onSelectView('dashboard');
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30 border border-cyan-400/30'
                  : 'hover:bg-slate-800/80 text-slate-300 hover:text-white border border-transparent'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-300 shrink-0" />
              <span className="truncate">Tổng Quan Trung Tâm</span>
            </button>
          </div>

          {/* AI TOOL GROUPS */}
          <div className="space-y-4">
            <div className="px-2 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-300/80 flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-cyan-400" />
                <span>CÔNG CỤ THAM MƯU AI</span>
              </span>
            </div>

            {groupsConfig.map((group) => {
              const groupTools = AI_TOOLS_CATALOG.filter(t => t.group === group.id);
              const isGroupExpanded = expandedGroups[group.id] !== false;
              const hasActiveTool = currentView === 'tool' && groupTools.some(t => t.id === currentToolId);

              return (
                <div key={group.id} className="space-y-1">
                  {/* Group Header Button */}
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-colors ${
                      hasActiveTool ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{group.label}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[9px] bg-blue-950/80 text-blue-300 font-bold px-1.5 py-0.2 rounded border border-blue-800/80 lowercase">
                        {group.badge}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isGroupExpanded ? '' : '-rotate-90'}`} />
                    </div>
                  </button>

                  {/* Group Tools List */}
                  {isGroupExpanded && (
                    <div className="space-y-1 pl-1">
                      {groupTools.map((tool) => {
                        const isActive = currentView === 'tool' && currentToolId === tool.id;
                        const isFav = favorites.includes(tool.id);

                        return (
                          <div
                            key={tool.id}
                            onClick={() => {
                              onSelectTool(tool.id);
                              if (onCloseMobile) onCloseMobile();
                            }}
                            className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-all cursor-pointer ${
                              isActive
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20 border border-blue-400/50'
                                : 'hover:bg-slate-800/80 text-slate-300 hover:text-white border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              {getToolIcon(tool.iconName, isActive)}
                              <div className="min-w-0">
                                <p className="truncate text-[11.5px] font-bold">{tool.name}</p>
                                <p className="text-[10px] text-slate-400 truncate group-hover:text-slate-300 font-normal">
                                  {tool.shortDesc}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite(tool.id);
                              }}
                              className={`p-1 rounded hover:text-amber-300 transition-colors shrink-0 ml-1 ${
                                isFav ? 'text-amber-400' : 'text-slate-600 opacity-0 group-hover:opacity-100'
                              }`}
                              title={isFav ? 'Bỏ yêu thích' : 'Yêu thích'}
                            >
                              <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* MANAGEMENT & RECORDS SECTION */}
          <div className="space-y-2 pt-2 border-t border-blue-900/40">
            <button
              onClick={() => toggleGroup('management')}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-blue-300/80"
            >
              <span>QUẢN LÝ & HỒ SƠ</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedGroups['management'] !== false ? '' : '-rotate-90'}`} />
            </button>

            {expandedGroups['management'] !== false && (
              <div className="space-y-1 pl-1">
                <button
                  onClick={() => {
                    onSelectView('my_documents');
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentView === 'my_documents'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md'
                      : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4 text-cyan-300 shrink-0" />
                  <span className="truncate">Tài Liệu Đã Lưu</span>
                </button>

                <button
                  onClick={() => {
                    onSelectView('dossiers');
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentView === 'dossiers'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md'
                      : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                  }`}
                >
                  <FolderKanban className="w-4 h-4 text-cyan-300 shrink-0" />
                  <span className="truncate">Hồ Sơ Công Việc</span>
                </button>

                <button
                  onClick={() => {
                    onSelectView('templates');
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentView === 'templates'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md'
                      : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                  }`}
                >
                  <BookTemplate className="w-4 h-4 text-cyan-300 shrink-0" />
                  <span className="truncate">Thư Viện Mẫu (Dạy AI)</span>
                </button>

                <button
                  onClick={() => {
                    onSelectView('audit_logs');
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentView === 'audit_logs'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md'
                      : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                  }`}
                >
                  <History className="w-4 h-4 text-cyan-300 shrink-0" />
                  <span className="truncate">Nhật Ký Tham Mưu</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Bottom Footer: Unit Context & Back Button */}
        <div className="p-3 border-t border-blue-900/60 bg-slate-950/80 space-y-2 shrink-0">
          <div className="p-2 rounded-xl bg-blue-950/60 border border-blue-800/50 text-xs flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider truncate">ĐƠN VỊ THAO TÁC</p>
              <p className="text-xs text-white font-bold truncate">{workspaceContext.orgName || 'MTTQ Phường Chánh Hiệp'}</p>
            </div>

            {onOpenContextSettings && (
              <button
                onClick={onOpenContextSettings}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white transition-colors shrink-0"
                title="Cấu hình bối cảnh đơn vị"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>

          {onBackToOffice && (
            <button
              onClick={onBackToOffice}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-300" />
              <span>Quay lại Trang Quản trị</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
