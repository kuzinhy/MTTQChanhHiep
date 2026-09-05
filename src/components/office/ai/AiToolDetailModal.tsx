import React from 'react';
import { 
  X, 
  Sparkles, 
  ChevronRight, 
  Clock, 
  RotateCcw, 
  Play, 
  FileSearch,
  BookTemplate,
  FileCheck2, 
  PenTool, 
  FileBarChart2, 
  Compass, 
  Mic, 
  CalendarCheck, 
  CheckSquare, 
  ShieldAlert,
  ArrowRight,
  FileText
} from 'lucide-react';
import { AiToolId, AiToolMetadata, WorkspaceContextData } from '../../../types';
import { aiWorkspaceService } from '../../../lib/aiWorkspaceService';

interface AiToolDetailModalProps {
  tool: AiToolMetadata | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunchTool: (toolId: AiToolId, scenarioPrompt?: string, restoreDraft?: boolean) => void;
  workspaceContext?: WorkspaceContextData;
}

const getModalIcon = (iconName: string) => {
  const cls = "w-6 h-6 text-cyan-300";
  switch (iconName) {
    case 'FileSearch': return <FileSearch className={cls} />;
    case 'BookTemplate': return <BookTemplate className={cls} />;
    case 'FileCheck2': return <FileCheck2 className={cls} />;
    case 'PenTool': return <PenTool className={cls} />;
    case 'FileBarChart2': return <FileBarChart2 className={cls} />;
    case 'Compass': return <Compass className={cls} />;
    case 'Mic': return <Mic className={cls} />;
    case 'CalendarCheck': return <CalendarCheck className={cls} />;
    case 'CheckSquare': return <CheckSquare className={cls} />;
    default: return <Sparkles className={cls} />;
  }
};

export const AiToolDetailModal: React.FC<AiToolDetailModalProps> = ({
  tool,
  isOpen,
  onClose,
  onLaunchTool,
  workspaceContext
}) => {
  if (!isOpen || !tool) return null;

  // Check if there is an active draft for this tool
  const existingDraft = aiWorkspaceService.getToolDraft(tool.id);

  const formatTimeAgo = (isoString?: string) => {
    if (!isoString) return '';
    const diff = Math.floor((new Date().getTime() - new Date(isoString).getTime()) / 1000);
    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner - Rich Blue Tech */}
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 p-6 text-white relative border-b border-blue-900/60">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4 pr-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/30 shrink-0">
              <div className="w-full h-full bg-slate-950/50 rounded-[14px] flex items-center justify-center">
                {getModalIcon(tool.iconName)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  {tool.badge || 'CÔNG CỤ NGHIỆP VỤ'}
                </span>
                <span className="text-[10px] text-blue-300/80 font-medium">Chuẩn Thể Thức Mặt Trận</span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">{tool.name}</h2>
              <p className="text-xs text-blue-100/90 leading-relaxed font-medium">
                {tool.shortDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Active Draft Warning & Restore Notice */}
          {existingDraft && existingDraft.data && (
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-900 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-200/80 text-amber-800">
                    <Clock className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950">
                      Phát Hiện Bản Nháp Chưa Hoàn Thành
                    </h4>
                    <p className="text-[11px] text-amber-800 font-medium">
                      Lưu gần nhất: {formatTimeAgo(existingDraft.updatedAt)} ({new Date(existingDraft.updatedAt).toLocaleTimeString('vi-VN')})
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-amber-200 text-amber-900 font-bold rounded-full text-[10px]">
                  Bản nháp tự động
                </span>
              </div>

              <div className="p-3 bg-white/90 rounded-xl border border-amber-200 text-xs font-medium text-slate-800 line-clamp-2 italic font-serif">
                "{existingDraft.data.title || existingDraft.data.docTitle || existingDraft.data.inputText?.substring(0, 100) || 'Dữ liệu thao tác dở dang...'}"
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    onLaunchTool(tool.id, undefined, true);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khôi phục & Tiếp tục thao tác</span>
                </button>

                <button
                  onClick={() => {
                    aiWorkspaceService.clearToolDraft(tool.id);
                    onLaunchTool(tool.id, undefined, false);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-amber-100/50 text-amber-800 text-xs font-semibold rounded-xl border border-amber-300 transition-colors cursor-pointer"
                >
                  Bỏ qua nháp & Tạo mới
                </button>
              </div>
            </div>
          )}

          {/* Preset Suggested Prompts / Scenario Options */}
          {tool.suggestedPrompts && tool.suggestedPrompts.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Kịch Bản Thao Tác Nhanh (Gợi Ý Đề Xuất)</span>
              </h3>

              <div className="space-y-2">
                {tool.suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onLaunchTool(tool.id, prompt, false);
                      onClose();
                    }}
                    className="w-full p-3 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 text-left text-xs text-slate-800 font-semibold transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                  >
                    <span className="group-hover:text-blue-700 transition-colors pr-2">
                      {idx + 1}. {prompt}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags & Security Guarantee */}
          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-slate-600 font-medium">An toàn dữ liệu nội bộ & Tự động sao lưu liên tục.</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {tool.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-white text-slate-600 rounded-md text-[10px] font-bold border border-slate-200">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 text-xs font-bold rounded-xl transition-all"
          >
            Đóng Modal
          </button>

          <button
            onClick={() => {
              onLaunchTool(tool.id, undefined, false);
              onClose();
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Vào Không Gian Thao Tác</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
