import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Bot, 
  Clock, 
  FileText, 
  BookTemplate, 
  History, 
  Star, 
  ChevronRight,
  FileCheck2,
  PenTool,
  Wand2,
  Plus,
  Menu,
  CheckCircle2,
  Download,
  Copy,
  ArrowRight,
  Calendar,
  Layers,
  HeartHandshake,
  ShieldCheck
} from 'lucide-react';
import { 
  AiDocument, 
  AiToolId, 
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
import { AiTemplateManager } from './AiTemplateManager';
import { AiDraftRecoveryBanner } from './AiDraftRecoveryBanner';

// Tool Views
import { DraftAndProofreadDocToolView } from './tools/DraftAndProofreadDocToolView';
import { AiSentenceRewriterToolView } from './tools/AiSentenceRewriterToolView';
import { SpeechAndScriptToolView } from './tools/SpeechAndScriptToolView';
import { ProofreadToolView } from './tools/ProofreadToolView';

interface AiWorkspaceDashboardProps {
  onBackToOffice?: () => void;
}

export const AiWorkspaceDashboard: React.FC<AiWorkspaceDashboardProps> = ({
  onBackToOffice
}) => {
  const [currentView, setCurrentView] = useState<WorkspaceMainView>('dashboard');
  const [currentToolId, setCurrentToolId] = useState<AiToolId | null>(null);

  // Data states
  const [documents, setDocuments] = useState<AiDocument[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AiAuditLog[]>([]);
  const [favorites, setFavorites] = useState<AiToolId[]>(['draft_proofread_doc', 'proofread', 'speech_script']);
  const [workspaceContext, setWorkspaceContext] = useState<WorkspaceContextData>(aiWorkspaceService.getWorkspaceContext());

  // UI States
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [scenarioPrompt, setScenarioPrompt] = useState<string | undefined>(undefined);
  const [shouldRestoreDraft, setShouldRestoreDraft] = useState<boolean>(false);

  // Load initial data
  const refreshData = () => {
    setDocuments(aiWorkspaceService.getSavedDocuments());
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

  const handleLaunchToolDirectly = (toolId: AiToolId, prompt?: string, restoreDraft: boolean = false) => {
    setCurrentToolId(toolId);
    setScenarioPrompt(prompt);
    setShouldRestoreDraft(restoreDraft);
    setCurrentView('tool');
  };

  const handleSelectTool = (toolId: AiToolId) => {
    handleLaunchToolDirectly(toolId);
  };

  const handleToggleFavorite = (toolId: AiToolId) => {
    const updated = aiWorkspaceService.toggleFavoriteTool(toolId);
    setFavorites(updated);
  };

  const handleSaveDocument = (doc: AiDocument) => {
    aiWorkspaceService.saveDocument(doc);
    refreshData();
  };

  // Quick Action Scenarios for Top Section
  const quickScenarios = [
    {
      title: 'Kế hoạch Tháng "Vì người nghèo"',
      category: 'Kế hoạch',
      toolId: 'draft_proofread_doc' as AiToolId,
      prompt: 'Kế hoạch triển khai Tháng cao điểm "Vì người nghèo" năm 2026'
    },
    {
      title: 'Công văn phối hợp liên ngành',
      category: 'Công văn',
      toolId: 'draft_proofread_doc' as AiToolId,
      prompt: 'Công văn phối hợp thực hiện công tác an sinh xã hội địa bàn 21 khu phố'
    },
    {
      title: 'Tờ trình xin kinh phí sửa nhà ĐĐK',
      category: 'Tờ trình',
      toolId: 'draft_proofread_doc' as AiToolId,
      prompt: 'Tờ trình đề nghị hỗ trợ kinh phí sửa chữa Nhà Đại đoàn kết cho hộ nghèo'
    },
    {
      title: 'Bài phát biểu Ngày hội ĐĐK',
      category: 'Phát biểu',
      toolId: 'draft_proofread_doc' as AiToolId,
      prompt: 'Bài phát biểu của Lãnh đạo Mặt trận tại Ngày hội Đại đoàn kết 21 Khu phố'
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
        onBackToOffice={onBackToOffice}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Workspace Center */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header */}
        <header className="h-12 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shrink-0 shadow-2xs z-10">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-slate-100 md:hidden transition-colors mr-1 cursor-pointer"
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
                className="text-xs font-bold text-slate-500 hover:text-blue-700 flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
              >
                <span>Bàn làm việc</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}

            <h1 className="text-xs md:text-sm font-black text-slate-900 truncate">
              {currentView === 'dashboard' && 'TRUNG TÂM TRỢ LÝ THAM MƯU AI'}
              {currentView === 'tool' && currentToolId === 'draft_proofread_doc' && 'Tạo Văn Bản Hành Chính (Kế hoạch, Công văn, Phát biểu...)'}
              {currentView === 'tool' && currentToolId === 'proofread' && 'Sửa Lỗi Văn Bản & Rà Soát Thể Thức NĐ 30'}
              {currentView === 'tool' && (currentToolId === 'speech_script' || currentToolId === 'speech') && 'Gợi Ý Viết Lại Câu & Văn Phong MTTQ'}
              {currentView === 'templates' && 'Thư Viện Mẫu Văn Bản Chuẩn'}
              {currentView === 'my_documents' && 'Kho Văn Bản Đã Soạn'}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPaletteOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-all border border-slate-200 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-blue-500" />
              <span>Tìm mẫu nhanh...</span>
              <kbd className="px-1.5 py-0.2 bg-white rounded-md text-[10px] text-slate-400 border border-slate-200 font-mono">
                Ctrl+K
              </kbd>
            </button>

            <button
              onClick={() => setIsCopilotOpen(prev => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                isCopilotOpen
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Trợ Lý AI</span>
            </button>
          </div>
        </header>

        {/* Dynamic Workspace Content */}
        <div className="flex-1 overflow-hidden relative">
          
          {/* ========================================================================= */}
          {/* DASHBOARD VIEW - REFACTORED & STREAMLINED */}
          {/* ========================================================================= */}
          {currentView === 'dashboard' && (
            <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6">
              
              {/* Draft Recovery Banner */}
              <AiDraftRecoveryBanner
                onOpenToolWithDraft={(toolId) => {
                  handleLaunchToolDirectly(toolId, undefined, true);
                }}
                onRefresh={refreshData}
              />

              {/* Official Hero Banner - Tech Blue MTTQ */}
              <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden border border-blue-900/60">
                <div className="relative z-10 max-w-3xl space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[11px] font-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
                    <span>TRUNG TÂM TRỢ LÝ THAM MƯU &amp; SOẠN THẢO VĂN BẢN</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    <span>Trợ Lý Soạn Thảo Văn Bản Mặt Trận Tổ Quốc</span>
                  </h2>
                  <p className="text-xs md:text-sm text-blue-100/90 font-medium">
                    Tập trung chuyên sâu: Khởi tạo nhanh Kế hoạch, Công văn, Tờ trình, Bài phát biểu; Sửa lỗi văn bản theo Nghị định 30/2020/NĐ-CP và Gợi ý viết lại câu mượt mà, chuẩn xác.
                  </p>
                </div>
              </div>

              {/* 3 CORE PILLARS (NẰM Ở VỊ TRÍ TRUNG TÂM NỔI BẬT) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>3 CHỨC NĂNG NGHIỆP VỤ CỐT LÕI</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Card 1: Tạo Văn Bản */}
                  <div 
                    onClick={() => handleLaunchToolDirectly('draft_proofread_doc')}
                    className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center font-bold shadow-xs transition-colors border border-blue-100 group-hover:border-blue-500">
                        <PenTool className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            Soạn thảo mới
                          </span>
                        </div>
                        <h4 className="text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                          Tạo Văn Bản Hành Chính
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1">
                          Tự động sinh Kế hoạch, Công văn, Tờ trình, Bài phát biểu &amp; Báo cáo chuẩn thể thức MTTQ và Nghị định 30.
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                      <span>Mở trình soạn thảo</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Card 2: Sửa Lỗi & Rà Soát Thể Thức */}
                  <div 
                    onClick={() => handleLaunchToolDirectly('proofread')}
                    className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center font-bold shadow-xs transition-colors border border-emerald-100 group-hover:border-emerald-500">
                        <FileCheck2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            Chuẩn Nghị Định 30
                          </span>
                        </div>
                        <h4 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                          Sửa Lỗi &amp; Soát Thể Thức
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1">
                          Quét lỗi chính tả, ngữ pháp, 9 thành phần thể thức bắt buộc, căn cứ pháp lý và tính nhất quán văn bản.
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-bold group-hover:translate-x-1 transition-transform">
                      <span>Rà soát lỗi ngay</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Card 3: Gợi Ý Viết Lại Câu */}
                  <div 
                    onClick={() => handleLaunchToolDirectly('speech_script')}
                    className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center font-bold shadow-xs transition-colors border border-purple-100 group-hover:border-purple-500">
                        <Wand2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                            Tinh chỉnh văn phong
                          </span>
                        </div>
                        <h4 className="text-base font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                          Gợi Ý Viết Lại Câu
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1">
                          Chuyển đổi câu văn thành phong cách trang trọng hành chính, truyền cảm hứng đại đoàn kết hoặc danh sách nhiệm vụ cô đọng.
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-purple-600 font-bold group-hover:translate-x-1 transition-transform">
                      <span>Viết lại câu &amp; Tinh chỉnh</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                </div>
              </div>

              {/* QUICK SCENARIOS & SAMPLE TEMPLATES */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>MẪU VĂN BẢN MẶT TRẬN KHỞI TẠO NHANH</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {quickScenarios.map((sc, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLaunchToolDirectly(sc.toolId, sc.prompt)}
                      className="p-3 bg-slate-50 hover:bg-blue-50/80 rounded-xl border border-slate-200 hover:border-blue-300 transition-all text-left group cursor-pointer space-y-1.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-white border border-slate-200 text-slate-600 group-hover:text-blue-700">
                          {sc.category}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {sc.title}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* SAVED DOCUMENTS SUMMARY */}
              {documents.length > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>VĂN BẢN ĐÃ SOẠN GẦN ĐÂY ({documents.length})</span>
                    </h3>
                    <button
                      onClick={() => setCurrentView('my_documents')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Xem tất cả</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {documents.slice(0, 3).map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                            <span className="font-bold text-blue-700 uppercase">Văn bản MTTQ</span>
                            <span>{new Date(doc.updatedAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{doc.title}</h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2 italic font-serif mt-1">
                            "{doc.content.substring(0, 90)}..."
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                          <span className="text-[10px] font-bold bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                            V{doc.version || 1}
                          </span>
                          <button
                            onClick={() => aiWorkspaceService.exportToWord(doc.title, doc.content)}
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            <span>Tải Word</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NOTICE ABOUT FUTURE FEATURES */}
              <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>
                    Các chức năng nâng cao như <strong>Ma trận tham mưu 10 bước</strong>, <strong>Điều hành sự kiện</strong> và <strong>Bóc tách nhiệm vụ 21 khu phố</strong> sẽ được phát triển hoàn thiện ở giai đoạn sau.
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TOOL VIEWS ROUTING */}
          {/* ========================================================================= */}
          {currentView === 'tool' && (
            <div className="h-full">
              {/* Core Drafting & Proofreading Tool View */}
              {(currentToolId === 'draft_proofread_doc' || currentToolId === 'draft_doc' || !currentToolId) && (
                <DraftAndProofreadDocToolView
                  onSaveDocument={handleSaveDocument}
                  workspaceContext={workspaceContext}
                  onOpenHistory={() => setIsHistoryOpen(true)}
                  initialPrompt={scenarioPrompt}
                  shouldRestoreDraft={shouldRestoreDraft}
                />
              )}

              {/* Proofreading Tool View */}
              {currentToolId === 'proofread' && (
                <ProofreadToolView
                  onSaveDocument={handleSaveDocument}
                  onOpenHistory={() => setIsHistoryOpen(true)}
                />
              )}

              {/* Rephrase & Sentence Rewriter Tool View */}
              {(currentToolId === 'speech_script' || currentToolId === 'speech') && (
                <AiSentenceRewriterToolView />
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TEMPLATES VIEW */}
          {/* ========================================================================= */}
          {currentView === 'templates' && (
            <AiTemplateManager
              templates={templates}
              onUseTemplate={(t) => {
                handleLaunchToolDirectly('draft_proofread_doc', t.name);
              }}
              onRefresh={refreshData}
            />
          )}

          {/* ========================================================================= */}
          {/* MY DOCUMENTS VIEW */}
          {/* ========================================================================= */}
          {currentView === 'my_documents' && (
            <div className="p-6 max-w-6xl mx-auto space-y-5 overflow-y-auto h-full">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-800">Kho Văn Bản Đã Soạn Thảo</h2>
                  <p className="text-xs text-slate-500">Toàn bộ văn bản, kế hoạch, công văn và bài phát biểu đã lưu trữ.</p>
                </div>
                <button
                  onClick={() => handleLaunchToolDirectly('draft_proofread_doc')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Soạn thảo mới
                </button>
              </div>

              {documents.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 space-y-2">
                  <FileText className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold text-slate-600">Chưa có văn bản nào được lưu trong phiên làm việc.</p>
                  <button
                    onClick={() => handleLaunchToolDirectly('draft_proofread_doc')}
                    className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Bắt đầu soạn thảo văn bản mới ngay
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-400 shadow-2xs space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span className="font-bold text-blue-700 uppercase">Văn bản MTTQ</span>
                          <span>{new Date(doc.updatedAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{doc.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-3 italic font-serif mt-1">
                          "{doc.content.substring(0, 120)}..."
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          Phiên bản V{doc.version || 1}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(doc.content);
                              alert('Đã sao chép văn bản vào bộ nhớ tạm!');
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                            title="Sao chép"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => aiWorkspaceService.exportToWord(doc.title, doc.content)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            <span>Tải Word</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Slide-out Copilot Panel */}
      <AiCopilotPanel
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        activeDocumentTitle="Văn Bản Mặt Trận Tổ Quốc"
        workspaceContext={workspaceContext}
        onApplyToDocument={(act) => {
          handleLaunchToolDirectly('draft_proofread_doc', act);
        }}
      />

      {/* Global Command Palette */}
      <AiCommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onSelectTool={(toolId) => {
          handleLaunchToolDirectly(toolId);
        }}
      />

      {/* History Modal */}
      <AiDocumentHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        document={documents[0] || null}
        onRestoreVersion={() => {
          setIsHistoryOpen(false);
        }}
      />

    </div>
  );
};
