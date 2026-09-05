import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  Clock, 
  Trash2, 
  ChevronRight, 
  Sparkles, 
  AlertTriangle,
  FileText,
  X
} from 'lucide-react';
import { aiWorkspaceService, AI_TOOLS_CATALOG } from '../../../lib/aiWorkspaceService';
import { AiToolId } from '../../../types';

interface AiDraftRecoveryBannerProps {
  onOpenToolWithDraft: (toolId: AiToolId) => void;
  onRefresh?: () => void;
}

export const AiDraftRecoveryBanner: React.FC<AiDraftRecoveryBannerProps> = ({
  onOpenToolWithDraft,
  onRefresh
}) => {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [isDismissed, setIsDismissed] = useState(false);

  const loadDrafts = () => {
    const list = aiWorkspaceService.getAllToolDrafts();
    setDrafts(list);
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  if (isDismissed || drafts.length === 0) return null;

  const handleClearDraft = (toolId: string) => {
    aiWorkspaceService.clearToolDraft(toolId);
    loadDrafts();
    if (onRefresh) onRefresh();
  };

  const handleClearAll = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ bản nháp dở dang không?')) {
      drafts.forEach(d => aiWorkspaceService.clearToolDraft(d.toolId));
      loadDrafts();
      if (onRefresh) onRefresh();
    }
  };

  const latestDraft = drafts[0];
  const toolInfo = AI_TOOLS_CATALOG.find(t => t.id === latestDraft.toolId);

  const formatTimeAgo = (isoString?: string) => {
    if (!isoString) return '';
    const diff = Math.floor((new Date().getTime() - new Date(isoString).getTime()) / 1000);
    if (diff < 60) return 'vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 p-4 rounded-2xl border border-amber-300 shadow-sm space-y-3 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black uppercase text-amber-950 tracking-wider">
                Khôi Phục Tiến Độ Dở Dang ({drafts.length} bản nháp)
              </h3>
              <span className="px-2 py-0.2 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-full">
                Tự động sao lưu
              </span>
            </div>
            <p className="text-xs text-amber-900/90 font-medium">
              Phát hiện công việc dở dang gần đây. Bạn có thể khôi phục ngay để tiếp tục xử lý.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 text-amber-700 hover:text-amber-900 rounded-lg hover:bg-amber-200/50 transition-colors"
          title="Ẩn thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {drafts.slice(0, 2).map((draft) => {
          const tCatalog = AI_TOOLS_CATALOG.find(t => t.id === draft.toolId);
          return (
            <div
              key={draft.toolId}
              className="p-3 bg-white/95 rounded-xl border border-amber-200/90 shadow-2xs flex items-center justify-between gap-3 group hover:border-amber-400 transition-all"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] font-bold text-amber-900 truncate">
                    {tCatalog?.name || draft.toolName}
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    {formatTimeAgo(draft.updatedAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium truncate italic">
                  "{draft.data?.title || draft.data?.docTitle || draft.data?.inputText?.substring(0, 50) || 'Tiến độ chưa lưu'}"
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onOpenToolWithDraft(draft.toolId as AiToolId)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>Khôi phục</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleClearDraft(draft.toolId)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Xóa bản nháp này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
