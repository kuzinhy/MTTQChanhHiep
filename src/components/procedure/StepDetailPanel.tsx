import React from 'react';
import { WorkflowNode, WorkflowProcedure } from '../../types/workflow';
import { 
  Building2, MapPin, CheckSquare, Square, ExternalLink, Download, 
  Sparkles, Navigation, Clock, FileCheck, ShieldCheck, ArrowRight
} from 'lucide-react';

interface StepDetailPanelProps {
  procedure: WorkflowProcedure;
  currentNode: WorkflowNode;
  nodeIndex: number;
  totalNodes: number;
  checklistState: Record<string, boolean>;
  onToggleChecklist: (docId: string) => void;
  onAskAi: (question: string) => void;
}

export const StepDetailPanel: React.FC<StepDetailPanelProps> = ({
  procedure,
  currentNode,
  nodeIndex,
  totalNodes,
  checklistState,
  onToggleChecklist,
  onAskAi
}) => {
  const docs = currentNode.requiredDocuments || procedure.nodes.flatMap(n => n.requiredDocuments || []).filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
  const checkedCount = docs.filter(d => checklistState[d.id]).length;

  return (
    <div className="bg-[#08111F]/95 rounded-3xl border border-slate-800 p-5 shadow-md space-y-5 h-full overflow-y-auto select-none font-sans scrollbar-thin">
      
      {/* Header Info */}
      <div className="space-y-1.5 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-extrabold uppercase">
            BƯỚC 0{nodeIndex + 1} / 0{totalNodes}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {currentNode.type}
          </span>
        </div>
        
        <h3 className="text-base font-black text-white tracking-tight">
          {currentNode.title}
        </h3>
        
        {currentNode.subtitle && (
          <p className="text-xs text-cyan-400/90 font-medium">
            {currentNode.subtitle}
          </p>
        )}
      </div>

      {/* Action Instruction */}
      <div className="space-y-1.5">
        <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Bạn cần làm gì ở giai đoạn này?</span>
        </h4>
        <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-medium">
          {currentNode.instruction || currentNode.description}
        </div>
      </div>

      {/* Location & Counter Card */}
      {(currentNode.counter || currentNode.location || procedure.counter) && (
        <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <Building2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-500 block text-[10px] font-bold">Nơi thực hiện / Quầy:</span>
              <strong className="text-slate-200 font-bold">
                {currentNode.counter || procedure.counter}
              </strong>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-500 block text-[10px] font-bold">Địa chỉ:</span>
              <span className="text-slate-300">
                {currentNode.location || 'Trụ sở UBND Phường Chánh Hiệp'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* REQUIRED DOCUMENTS CHECKLIST */}
      {docs && docs.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hồ sơ cần chuẩn bị</span>
            </h4>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800">
              {checkedCount}/{docs.length} đã chuẩn bị
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
            {docs.map((doc) => {
              const isChecked = !!checklistState[doc.id];
              return (
                <div
                  key={doc.id}
                  onClick={() => onToggleChecklist(doc.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 text-xs select-none ${
                    isChecked
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={isChecked ? 'line-through text-slate-400' : 'font-semibold text-slate-200'}>
                      {doc.name}
                    </span>
                    {doc.quantity && (
                      <span className="text-[10px] text-slate-500 block">Số lượng: {doc.quantity}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* QUICK ACTIONS ROW */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        {procedure.onlineAvailable && procedure.onlineUrl && (
          <a
            href={procedure.onlineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-cyan-950/50"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Nộp hồ sơ trực tuyến</span>
          </a>
        )}

        <button
          type="button"
          onClick={() => onAskAi(`Hướng dẫn chi tiết cho tôi về thủ tục "${procedure.name}" ở Bước ${nodeIndex + 1}: "${currentNode.title}"`)}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Hỏi Trợ lý AI về bước này</span>
        </button>
      </div>

    </div>
  );
};
