import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  FileSearch,
  Command, 
  Bot, 
  Clock, 
  FileText, 
  FolderKanban, 
  BookTemplate, 
  History, 
  Star, 
  ArrowRight, 
  ArrowLeft,
  Layers, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  PenTool,
  FileBarChart2,
  Compass,
  AlignLeft,
  CheckSquare,
  Mic,
  CalendarCheck,
  Users,
  Megaphone,
  GitCompare,
  HelpCircle,
  TableProperties,
  ListChecks,
  Plus,
  SlidersHorizontal,
  X,
  LayoutDashboard,
  Building2,
  Menu
} from 'lucide-react';
import { 
  AiDocument, 
  AiToolId, 
  AiToolGroup, 
  WorkspaceContextData, 
  AiAuditLog 
} from '../../../types';
import { 
  aiWorkspaceService, 
  AI_TOOLS_CATALOG 
} from '../../../lib/aiWorkspaceService';

import { AiWorkspaceSidebar, WorkspaceMainView } from './AiWorkspaceSidebar';
import { AiCopilotPanel } from './AiCopilotPanel';
import { AiCommandPalette } from './AiCommandPalette';
import { AiDocumentHistoryModal } from './AiDocumentHistoryModal';
import { AiDossierManager } from './AiDossierManager';
import { AiTemplateManager } from './AiTemplateManager';
import { AiToolDetailModal } from './AiToolDetailModal';
import { AiDraftRecoveryBanner } from './AiDraftRecoveryBanner';

// Individual Tool Views
import { ReadProcessDocToolView } from './tools/ReadProcessDocToolView';
import { DraftAndProofreadDocToolView } from './tools/DraftAndProofreadDocToolView';
import { AdvisoryToolView } from './tools/AdvisoryToolView';
import { ReportAndPlanToolView } from './tools/ReportAndPlanToolView';
import { EventWorkspaceToolView } from './tools/EventWorkspaceToolView';
import { SpeechAndScriptToolView } from './tools/SpeechAndScriptToolView';
import { TaskTrackingToolView } from './tools/TaskTrackingToolView';
import { LookupAndTemplatesToolView } from './tools/LookupAndTemplatesToolView';

interface AiWorkspaceDashboardProps {
  onBackToOffice?: () => void;
}

const getIcon = (iconName: string) => {
  const cls = "w-5 h-5";
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

export const AiWorkspaceDashboard: React.FC<AiWorkspaceDashboardProps> = ({
  onBackToOffice
}) => {
  const [currentView, setCurrentView] = useState<WorkspaceMainView>('dashboard');
  const [currentToolId, setCurrentToolId] = useState<AiToolId | null>(null);

  // Data states
  const [documents, setDocuments] = useState<AiDocument[]>([]);
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AiAuditLog[]>([]);
  const [favorites, setFavorites] = useState<AiToolId[]>(['read_process_doc', 'draft_proofread_doc', 'advisory', 'task_tracking']);
  const [workspaceContext, setWorkspaceContext] = useState<WorkspaceContextData>(aiWorkspaceService.getWorkspaceContext());

  // UI States
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<AiDocument | null>(null);
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Tool Detail Popup Modal & Launch States
  const [modalTool, setModalTool] = useState<any | null>(null);
  const [scenarioPrompt, setScenarioPrompt] = useState<string | undefined>(undefined);
  const [shouldRestoreDraft, setShouldRestoreDraft] = useState<boolean>(false);

  // Load initial data
  const refreshData = () => {
    setDocuments(aiWorkspaceService.getSavedDocuments());
    setDossiers(aiWorkspaceService.getDossiers());
    setTemplates(aiWorkspaceService.getTemplates());
    setAuditLogs(aiWorkspaceService.getAuditLogs());
    setFavorites(aiWorkspaceService.getFavoriteToolIds());
    setWorkspaceContext(aiWorkspaceService.getWorkspaceContext());
  };

  useEffect(() => {
    refreshData();

    // Global keyboard listener for Ctrl+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // When clicking any tool card or menu item: open Popup Detail Modal first!
  const handleOpenToolModal = (toolId: AiToolId) => {
    const tool = AI_TOOLS_CATALOG.find(t => t.id === toolId) || {
      id: toolId,
      name: toolId === 'draft_doc' ? 'Dự Thảo Văn Bản' : toolId === 'proofread' ? 'Rà Soát Thể Thức' : 'Công Cụ Tham Mưu AI',
      shortDesc: 'Trợ lý thông minh hỗ trợ xử lý công việc Mặt trận Trận.',
      group: 'group1_docs_dossier' as AiToolGroup,
      iconName: 'PenTool',
      badge: 'CHUẨN THỂ THỨC',
      tags: ['Mặt trận', 'Tự động'],
      suggestedPrompts: [
        'Soạn Kế hoạch Ngày hội Đại đoàn kết',
        'Soạn Tờ trình xin chủ trương kinh phí',
        'Rà soát lỗi thể thức Nghị định 30'
      ]
    };
    setModalTool(tool);
  };

  const handleLaunchToolDirectly = (toolId: AiToolId, prompt?: string, restoreDraft: boolean = false) => {
    setCurrentToolId(toolId);
    setScenarioPrompt(prompt);
    setShouldRestoreDraft(restoreDraft);
    setCurrentView('tool');
  };

  const handleSelectTool = (toolId: AiToolId) => {
    handleOpenToolModal(toolId);
  };

  const handleToggleFavorite = (toolId: AiToolId) => {
    const updated = aiWorkspaceService.toggleFavoriteTool(toolId);
    setFavorites(updated);
  };

  const handleSaveDocument = (doc: AiDocument) => {
    aiWorkspaceService.saveDocument(doc);
    refreshData();
    setSelectedDocument(doc);
  };

  const handleUpdateContext = (newCtx: WorkspaceContextData) => {
    aiWorkspaceService.updateWorkspaceContext(newCtx);
    setWorkspaceContext(newCtx);
    setIsContextModalOpen(false);
  };

  // Group definitions
  const toolGroups: { id: AiToolGroup; title: string; desc: string; badge: string }[] = [
    {
      id: 'group1_docs_dossier',
      title: 'NHÓM 01 – VĂN BẢN & HỒ SƠ',
      desc: 'Tự động tóm tắt 3 mức, bóc tách nhiệm vụ, dự thảo phiếu trình và kiểm tra thể thức Nghị định 30/2020/NĐ-CP.',
      badge: '2 Công cụ cốt lõi'
    },
    {
      id: 'group2_advisory_report',
      title: 'NHÓM 02 – THAM MƯU & TỔNG HỢP',
      desc: 'Lập phiếu tham mưu 10 bước xử lý văn bản cấp trên và tạo báo cáo định kỳ/kế hoạch tối đa 3 bước.',
      badge: '2 Công cụ cốt lõi'
    },
    {
      id: 'group3_meeting_event',
      title: 'NHÓM 03 – HỌP, SỰ KIỆN & PHÁT BIỂU',
      desc: 'Quản lý trọn gói 1 sự kiện qua 3 giai đoạn (trước, trong, sau) và soạn bài phát biểu/kịch bản MC.',
      badge: '2 Công cụ cốt lõi'
    },
    {
      id: 'group4_task_operational',
      title: 'NHÓM 04 – CÔNG VIỆC & ĐIỀU HÀNH',
      desc: 'Theo dõi tiến độ nhiệm vụ 21 Khu phố và tra cứu thư viện mẫu biểu chuẩn Nghị định 30.',
      badge: '2 Công cụ cốt lõi'
    }
  ];

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden text-slate-800 font-sans">
      {/* 1. Left Vertical Navigation Sidebar */}
      <AiWorkspaceSidebar
        currentView={currentView}
        currentToolId={currentToolId}
        onSelectView={(v) => {
          setCurrentView(v);
          if (v !== 'tool') setCurrentToolId(null);
        }}
        onSelectTool={handleSelectTool}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        workspaceContext={workspaceContext}
        onOpenContextSettings={() => setIsContextModalOpen(true)}
        onBackToOffice={onBackToOffice}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Workspace Center */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Title & Quick Action Bar */}
        <header className="h-11 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shrink-0 shadow-2xs z-10">
          <div className="flex items-center gap-2 min-w-0">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-slate-100 md:hidden transition-colors mr-1"
              title="Mở Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {currentView !== 'dashboard' && (
              <button
                onClick={() => {
                  setCurrentView('dashboard');
                  setCurrentToolId(null);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-blue-700 flex items-center gap-1 transition-colors shrink-0"
              >
                <span>Tổng quan</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}

            <h1 className="text-xs md:text-sm font-extrabold text-slate-900 truncate">
              {currentView === 'dashboard' && 'TRUNG TÂM TRỢ LÝ THAM MƯU AI'}
              {currentView === 'tool' && currentToolId && AI_TOOLS_CATALOG.find(t => t.id === currentToolId)?.name}
              {currentView === 'dossiers' && 'Hồ Sơ Công Việc Tham Mưu'}
              {currentView === 'templates' && 'Thư Viện Mẫu & Học Từ Mẫu'}
              {currentView === 'my_documents' && 'Kho Tài Liệu Đã Soạn'}
              {currentView === 'audit_logs' && 'Nhật Ký Thao Tác Tham Mưu'}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            {/* Quick Command Palette Launcher */}
            <button
              onClick={() => setIsPaletteOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-all border border-slate-200"
            >
              <Search className="w-3.5 h-3.5 text-blue-500" />
              <span>Tìm kiếm công cụ...</span>
              <kbd className="px-1.5 py-0.2 bg-white rounded-md text-[10px] text-slate-400 border border-slate-200 font-mono">
                Ctrl+K
              </kbd>
            </button>

            {/* Copilot Toggle Button */}
            <button
              onClick={() => setIsCopilotOpen(prev => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                isCopilotOpen
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Trợ Lý Copilot</span>
            </button>
          </div>
        </header>

        {/* Dynamic Workspace Content */}
        <div className="flex-1 overflow-hidden relative">
          {/* DASHBOARD VIEW */}
          {currentView === 'dashboard' && (
            <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6">
              {/* Draft Recovery Banner */}
              <AiDraftRecoveryBanner
                onOpenToolWithDraft={(toolId) => {
                  handleLaunchToolDirectly(toolId, undefined, true);
                }}
                onRefresh={refreshData}
              />

              {/* Official Hero Banner - Modern Tech Blue */}
              <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 md:p-7 shadow-xl relative overflow-hidden border border-blue-900/60">
                <div className="relative z-10 max-w-3xl space-y-2.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-wider shadow-inner">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                    <span>HỆ THỐNG CÔNG CỤ NGHIỆP VỤ THAM MƯU MTTQ</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    <span>TRUNG TÂM TRỢ LÝ THAM MƯU AI</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                      Blue Tech 2.0
                    </span>
                  </h2>
                  <p className="text-xs md:text-sm text-blue-100/90 leading-relaxed font-medium">
                    Hỗ trợ cán bộ MTTQ phân tích, tham mưu, soạn thảo và xử lý công việc nhanh chóng, chính xác và có hệ thống.
                  </p>
                </div>

                {/* Subtle Background Badge */}
                <div className="absolute right-4 -bottom-6 opacity-10 text-cyan-400 font-black text-9xl select-none pointer-events-none">
                  MTTQ
                </div>
              </div>

              {/* Quick Favorites Bar */}
              {favorites.length > 0 && (
                <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>Công Cụ Thường Dùng (Yêu Thích)</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {favorites.map((favId) => {
                      const tool = AI_TOOLS_CATALOG.find(t => t.id === favId);
                      if (!tool) return null;
                      return (
                        <button
                          key={tool.id}
                          onClick={() => handleSelectTool(tool.id)}
                          className="p-3 bg-slate-50/80 hover:bg-blue-50/80 rounded-xl border border-slate-200 hover:border-blue-300 transition-all text-left flex items-start gap-2.5 group cursor-pointer shadow-2xs"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white group-hover:bg-blue-600 group-hover:text-white text-blue-600 flex items-center justify-center font-bold shadow-2xs shrink-0 transition-colors border border-slate-100 group-hover:border-blue-500">
                            {getIcon(tool.iconName)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs text-slate-800 group-hover:text-blue-700 transition-colors truncate">
                              {tool.name}
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-1">{tool.shortDesc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 5 Tool Groups (16 Total Specialized Tools) */}
              <div className="space-y-6">
                {toolGroups.map((group) => {
                  const toolsInGroup = AI_TOOLS_CATALOG.filter(t => t.group === group.id);
                  return (
                    <div key={group.id} className="space-y-3">
                      {/* Group Header */}
                      <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <span>{group.title}</span>
                            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                              {group.badge}
                            </span>
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">{group.desc}</p>
                        </div>
                      </div>

                      {/* Tool Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {toolsInGroup.map((tool) => {
                          const isFav = favorites.includes(tool.id);
                          return (
                            <div
                              key={tool.id}
                              onClick={() => handleSelectTool(tool.id)}
                              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer flex flex-col justify-between group"
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center font-bold shadow-2xs transition-colors shrink-0 border border-blue-100 group-hover:border-blue-500">
                                    {getIcon(tool.iconName)}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleFavorite(tool.id);
                                    }}
                                    className={`p-1 rounded-md hover:bg-slate-100 transition-colors ${
                                      isFav ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400'
                                    }`}
                                  >
                                    <Star className={`w-4 h-4 ${isFav ? 'fill-amber-500' : ''}`} />
                                  </button>
                                </div>

                                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-1.5 line-clamp-1">
                                  {tool.name}
                                </h4>
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                                  {tool.shortDesc}
                                </p>
                              </div>

                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                                <span>Mở công cụ</span>
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TOOL VIEWS ROUTING */}
          {currentView === 'tool' && currentToolId && (
            <div className="h-full">
              {(currentToolId === 'read_process_doc' || currentToolId === 'summarize' || currentToolId === 'extract_tasks' || currentToolId === 'qa_document') && (
                <ReadProcessDocToolView
                  onSaveDocument={handleSaveDocument}
                  workspaceContext={workspaceContext}
                  onOpenHistory={() => setIsHistoryOpen(true)}
                  initialPrompt={scenarioPrompt}
                  shouldRestoreDraft={shouldRestoreDraft}
                  onNavigateToTask={() => {
                    setCurrentToolId('task_tracking');
                  }}
                />
              )}

              {(currentToolId === 'draft_proofread_doc' || currentToolId === 'draft_doc' || currentToolId === 'proofread' || currentToolId === 'compare_docs') && (
                <DraftAndProofreadDocToolView
                  onSaveDocument={handleSaveDocument}
                  workspaceContext={workspaceContext}
                  onOpenHistory={() => setIsHistoryOpen(true)}
                  initialPrompt={scenarioPrompt}
                  shouldRestoreDraft={shouldRestoreDraft}
                />
              )}

              {currentToolId === 'advisory' && (
                <AdvisoryToolView
                  onSaveDocument={handleSaveDocument}
                  onOpenHistory={() => setIsHistoryOpen(true)}
                />
              )}

              {(currentToolId === 'report_plan' || currentToolId === 'report' || currentToolId === 'work_plan') && (
                <ReportAndPlanToolView
                  onSaveDocument={handleSaveDocument}
                  workspaceContext={workspaceContext}
                  onOpenHistory={() => setIsHistoryOpen(true)}
                />
              )}

              {(currentToolId === 'event_workspace' || currentToolId === 'conference' || currentToolId === 'meeting_minutes') && (
                <EventWorkspaceToolView
                  onSaveDocument={handleSaveDocument}
                  workspaceContext={workspaceContext}
                  onOpenHistory={() => setIsHistoryOpen(true)}
                />
              )}

              {(currentToolId === 'speech_script' || currentToolId === 'speech') && (
                <SpeechAndScriptToolView
                  onSaveDocument={handleSaveDocument}
                  workspaceContext={workspaceContext}
                  onOpenHistory={() => setIsHistoryOpen(true)}
                />
              )}

              {(currentToolId === 'task_tracking' || currentToolId === 'checklist') && (
                <TaskTrackingToolView />
              )}

              {(currentToolId === 'lookup_templates' || currentToolId === 'supervision' || currentToolId === 'supervision_critique' || currentToolId === 'public_opinion' || currentToolId === 'propaganda') && (
                <LookupAndTemplatesToolView
                  onSelectTemplateToDraft={(templateTitle) => {
                    handleLaunchToolDirectly('draft_proofread_doc', templateTitle, false);
                  }}
                />
              )}
            </div>
          )}

          {/* DOSSIERS VIEW */}
          {currentView === 'dossiers' && (
            <AiDossierManager
              dossiers={dossiers}
              documents={documents}
              onSelectDossier={(d) => {
                alert(`Mở hồ sơ: ${d.title}`);
              }}
              onRefresh={refreshData}
            />
          )}

          {/* TEMPLATES VIEW */}
          {currentView === 'templates' && (
            <AiTemplateManager
              templates={templates}
              onUseTemplate={(t) => {
                setCurrentToolId('draft_doc');
                setCurrentView('tool');
              }}
              onRefresh={refreshData}
            />
          )}

          {/* MY DOCUMENTS VIEW */}
          {currentView === 'my_documents' && (
            <div className="p-6 max-w-6xl mx-auto space-y-5 overflow-y-auto h-full">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Kho Tài Liệu Đã Soạn Thảo</h2>
                  <p className="text-xs text-slate-500">Toàn bộ văn bản, kế hoạch và phiếu tham mưu đã lưu trữ.</p>
                </div>
                <button
                  onClick={() => {
                    setCurrentToolId('draft_doc');
                    setCurrentView('tool');
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Soạn thảo mới
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-red-300 shadow-2xs space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-bold text-red-700 uppercase">{doc.toolId}</span>
                        <span>{new Date(doc.updatedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{doc.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 italic font-serif mt-1">
                        "{doc.content.substring(0, 100)}..."
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        Phiên bản V{doc.version || 1}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedDocument(doc);
                          setIsHistoryOpen(true);
                        }}
                        className="text-red-700 font-bold hover:underline"
                      >
                        Lịch sử
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AUDIT LOG VIEW */}
          {currentView === 'audit_logs' && (
            <div className="p-6 max-w-5xl mx-auto space-y-5 overflow-y-auto h-full">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h2 className="text-lg font-bold text-slate-800">Nhật Ký Thao Tác Tham Mưu (Audit Log)</h2>
                <p className="text-xs text-slate-500">Minh bạch hóa toàn bộ quá trình sử dụng AI của cán bộ theo đúng quy định.</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Thời gian</th>
                      <th className="p-3">Cán bộ</th>
                      <th className="p-3">Công cụ</th>
                      <th className="p-3">Văn bản / Thao tác</th>
                      <th className="p-3 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-500">{new Date(log.timestamp).toLocaleString('vi-VN')}</td>
                        <td className="p-3 font-medium text-slate-900">{log.userName}</td>
                        <td className="p-3 font-semibold text-red-700">{log.toolName}</td>
                        <td className="p-3 text-slate-600 line-clamp-1">{log.documentTitle || log.action}</td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Global AI Copilot Side Panel */}
      <AiCopilotPanel
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        activeDocumentContent={selectedDocument?.content || ''}
        activeDocumentTitle={selectedDocument?.title || 'Văn bản đang xử lý'}
        workspaceContext={workspaceContext}
        onApplyToDocument={(text) => {
          alert('Nội dung đã được chuẩn bị để cán bộ dán vào trình soạn thảo.');
        }}
      />

      {/* 4. Global Command Palette Modal (Ctrl+K) */}
      <AiCommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onSelectTool={handleSelectTool}
        favorites={favorites}
      />

      {/* 5. Document History Modal */}
      <AiDocumentHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        document={selectedDocument}
        onRestoreVersion={(ver) => {
          if (selectedDocument) {
            const updated = {
              ...selectedDocument,
              content: ver.content,
              version: (selectedDocument.version || 1) + 1,
              updatedAt: new Date().toISOString()
            };
            handleSaveDocument(updated);
          }
        }}
      />

      {/* 6. Workspace Context Settings Modal */}
      {isContextModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Cài Đặt Bối Cảnh Công Tác (Workspace Context)</h3>
              </div>
              <button onClick={() => setIsContextModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 mb-1 block">Tên sự kiện / Chiến dịch hiện tại:</label>
                <input
                  type="text"
                  value={workspaceContext.eventName || ''}
                  onChange={(e) => setWorkspaceContext({ ...workspaceContext, eventName: e.target.value })}
                  placeholder="Ví dụ: Ngày hội Đại đoàn kết 2026..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Thời gian thực hiện:</label>
                  <input
                    type="text"
                    value={workspaceContext.eventTime || ''}
                    onChange={(e) => setWorkspaceContext({ ...workspaceContext, eventTime: e.target.value })}
                    placeholder="Tháng 11/2026..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Địa điểm / Địa bàn:</label>
                  <input
                    type="text"
                    value={workspaceContext.eventLocation || ''}
                    onChange={(e) => setWorkspaceContext({ ...workspaceContext, eventLocation: e.target.value })}
                    placeholder="21 Nhà Văn hóa Khu phố..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Đơn vị phối hợp chủ yếu:</label>
                <input
                  type="text"
                  value={workspaceContext.unitCoordinating || ''}
                  onChange={(e) => setWorkspaceContext({ ...workspaceContext, unitCoordinating: e.target.value })}
                  placeholder="UBND Phường, 21 Ban Công tác Mặt trận, Đoàn Thanh niên..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsContextModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleUpdateContext(workspaceContext)}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                Lưu Bối Cảnh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tool Detail Interactive Popup Modal */}
      <AiToolDetailModal
        tool={modalTool}
        isOpen={!!modalTool}
        onClose={() => setModalTool(null)}
        onLaunchTool={(toolId, prompt, restoreDraft) => {
          handleLaunchToolDirectly(toolId, prompt, restoreDraft);
        }}
        workspaceContext={workspaceContext}
      />
    </div>
  );
};
