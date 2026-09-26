import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  PenTool, 
  Sparkles,
  Star,
  ArrowLeft,
  Settings,
  X,
  Layers,
  Wand2,
  FileText,
  BookTemplate,
  ChevronDown,
  Clock,
  Mic,
  CalendarCheck,
  CheckSquare,
  FileSearch,
  Compass,
  Scale,
  BarChart3,
  Palette
} from 'lucide-react';
import { AiToolId, WorkspaceContextData } from '../../../types';

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

export const AiWorkspaceSidebar: React.FC<AiWorkspaceSidebarProps> = ({
  currentView,
  currentToolId,
  onSelectView,
  onSelectTool,
  workspaceContext,
  onOpenContextSettings,
  onBackToOffice,
  isOpenMobile,
  onCloseMobile
}) => {
  const [showUpcoming, setShowUpcoming] = useState(false);

  // Core 3 pillars requested by user
  const coreTools = [
    {
      id: 'draft_proofread_doc' as AiToolId,
      name: 'Tạo Văn Bản Hành Chính',
      shortDesc: 'Kế hoạch, Công văn, Tờ trình, Bài phát biểu',
      icon: <PenTool className="w-4 h-4 text-cyan-400" />,
      badge: 'Trọng tâm'
    },
    {
      id: 'proofread' as AiToolId,
      name: 'Sửa Lỗi & Soát Thể Thức NĐ 30',
      shortDesc: 'Rà soát 12 lớp, lỗi chính tả, căn cứ pháp lý',
      icon: <FileCheck2 className="w-4 h-4 text-emerald-400" />,
      badge: 'Chuẩn NĐ 30'
    },
    {
      id: 'speech_script' as AiToolId,
      name: 'Gợi Ý Viết Lại Câu & Văn Phong',
      shortDesc: 'Trang trọng, truyền cảm hứng, rút gọn',
      icon: <Wand2 className="w-4 h-4 text-purple-400" />,
      badge: 'Thông minh'
    }
  ];

  // Secondary tools planned for later phases
  const upcomingFeatures = [
    { name: 'Ma trận tham mưu 10 bước', icon: <Compass className="w-3.5 h-3.5 text-slate-500" /> },
    { name: 'Bóc tách nhiệm vụ & Cảnh báo hạn 21 KP', icon: <CheckSquare className="w-3.5 h-3.5 text-slate-500" /> },
    { name: 'Điều hành sự kiện & Workspace Hội nghị', icon: <CalendarCheck className="w-3.5 h-3.5 text-slate-500" /> },
    { name: 'Tự động tóm tắt & Trích xuất hồ sơ số', icon: <FileSearch className="w-3.5 h-3.5 text-slate-500" /> }
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
              <p className="text-[10px] text-blue-200/70 font-medium">Trợ Lý Soạn Thảo &amp; Tham Mưu</p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button 
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden cursor-pointer"
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
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30 border border-cyan-400/30'
                  : 'hover:bg-slate-800/80 text-slate-300 hover:text-white border border-transparent'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-300 shrink-0" />
              <span className="truncate">Bàn Làm Việc AI</span>
            </button>
          </div>

          {/* CORE TOOLS (3 FOCUS AREAS) */}
          <div className="space-y-2">
            <div className="px-2 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-cyan-400" />
                <span>CHỨC NĂNG TRỌNG TÂM</span>
              </span>
              <span className="text-[9px] bg-cyan-900/40 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-700/50 font-bold">
                Ưu tiên
              </span>
            </div>

            <div className="space-y-1">
              {coreTools.map((tool) => {
                const isActive = currentView === 'tool' && currentToolId === tool.id;

                return (
                  <div
                    key={tool.id}
                    onClick={() => {
                      onSelectTool(tool.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20 border border-blue-400/50'
                        : 'hover:bg-slate-800/80 text-slate-300 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="p-1 rounded-lg bg-slate-950/60 border border-slate-800 shrink-0">
                        {tool.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-xs font-bold text-white">{tool.name}</p>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate group-hover:text-slate-300 font-normal">
                          {tool.shortDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* NEXT-GEN AI TOOLS (PILLAR 3) */}
          <div className="space-y-2 pt-2 border-t border-blue-900/40">
            <div className="px-2 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>AI THAM MƯU THẾ HỆ MỚI</span>
              </span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/40 font-black">
                TRỤ CỘT 3
              </span>
            </div>

            <div className="space-y-1">
              {[
                {
                  id: 'legal_mediator' as AiToolId,
                  name: 'AI Pháp Lý & Hòa Giải 21 KP',
                  shortDesc: 'Cố vấn pháp luật & Biên bản hòa giải',
                  icon: <Scale className="w-4 h-4 text-amber-400" />,
                  badge: 'Hòa giải'
                },
                {
                  id: 'social_opinion_report' as AiToolId,
                  name: 'AI Báo Cáo Dư Luận Xã Hội',
                  shortDesc: 'Phân tích điểm nóng & Tham mưu',
                  icon: <BarChart3 className="w-4 h-4 text-purple-400" />,
                  badge: 'Dư luận'
                },
                {
                  id: 'visual_infographic' as AiToolId,
                  name: 'AI Infographic & Loa Phường',
                  shortDesc: 'Visual card, Zalo OA & Loa phường',
                  icon: <Palette className="w-4 h-4 text-pink-400" />,
                  badge: 'Đa kênh'
                }
              ].map((tool) => {
                const isActive = currentView === 'tool' && currentToolId === tool.id;

                return (
                  <div
                    key={tool.id}
                    onClick={() => {
                      onSelectTool(tool.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 text-white font-bold shadow-md shadow-amber-500/20 border border-amber-400/50'
                        : 'hover:bg-slate-800/80 text-slate-300 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="p-1 rounded-lg bg-slate-950/60 border border-slate-800 shrink-0">
                        {tool.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-xs font-bold text-white">{tool.name}</p>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate group-hover:text-slate-300 font-normal">
                          {tool.shortDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STORAGE & UTILITIES */}
          <div className="space-y-1 pt-2 border-t border-blue-900/40">
            <div className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-blue-300/80">
              <span>KHO LƯU TRỮ</span>
            </div>

            <button
              onClick={() => {
                onSelectView('my_documents');
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'my_documents'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md'
                  : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-cyan-300 shrink-0" />
              <span className="truncate">Văn Bản Đã Soạn</span>
            </button>

            <button
              onClick={() => {
                onSelectView('templates');
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'templates'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md'
                  : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              <BookTemplate className="w-4 h-4 text-cyan-300 shrink-0" />
              <span className="truncate">Thư Viện Mẫu Chuẩn</span>
            </button>
          </div>

          {/* UPCOMING FEATURES (COLLAPSIBLE / GIAI ĐOẠN SAU) */}
          <div className="space-y-1.5 pt-2 border-t border-blue-900/40">
            <button
              onClick={() => setShowUpcoming(prev => !prev)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-200 transition cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>PHÁT TRIỂN GIAI ĐOẠN SAU</span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${showUpcoming ? 'rotate-180' : ''}`} />
            </button>

            {showUpcoming && (
              <div className="space-y-1 pl-1 text-[11px] text-slate-400">
                {upcomingFeatures.map((feat, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/40 border border-slate-800/50 text-slate-400 text-[11px]"
                  >
                    {feat.icon}
                    <span className="truncate">{feat.name}</span>
                    <span className="ml-auto text-[9px] text-slate-500 font-medium shrink-0">Sau</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Bottom Footer: Unit Context & Back Button */}
        <div className="p-3 border-t border-blue-900/60 bg-slate-950/80 space-y-2 shrink-0">
          <div className="p-2 rounded-xl bg-blue-950/60 border border-blue-800/50 text-xs flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider truncate">ĐƠN VỊ THAO TÁC</p>
              <p className="text-xs text-white font-bold truncate">{workspaceContext.unitLeading || 'MTTQ Phường Chánh Hiệp'}</p>
            </div>

            {onOpenContextSettings && (
              <button
                onClick={onOpenContextSettings}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white transition-colors shrink-0 cursor-pointer"
                title="Cấu hình bối cảnh đơn vị"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>

          {onBackToOffice && (
            <button
              onClick={onBackToOffice}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
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
