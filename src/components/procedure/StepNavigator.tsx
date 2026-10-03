import React from 'react';
import { WorkflowProcedure, WorkflowNode } from '../../types/workflow';
import { Check, Clock, ChevronRight } from 'lucide-react';

interface StepNavigatorProps {
  procedure: WorkflowProcedure;
  activeNodeIndex: number;
  onSelectNode: (index: number) => void;
}

export const StepNavigator: React.FC<StepNavigatorProps> = ({
  procedure,
  activeNodeIndex,
  onSelectNode
}) => {
  return (
    <div className="bg-[#08111F]/95 rounded-3xl border border-slate-800 p-4 shadow-md space-y-3 h-full flex flex-col justify-between select-none">
      
      {/* Title */}
      <div className="pb-3 border-b border-slate-800/80">
        <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center justify-between">
          <span>Hành trình dịch vụ</span>
          <span className="text-[10px] text-cyan-400 font-mono font-bold">
            {activeNodeIndex + 1}/{procedure.nodes.length}
          </span>
        </h3>
      </div>

      {/* Step items list */}
      <div className="space-y-2 overflow-y-auto max-h-[480px] pr-1 scrollbar-thin">
        {procedure.nodes.map((node, idx) => {
          const isActive = activeNodeIndex === idx;
          const isCompleted = activeNodeIndex > idx;

          return (
            <button
              key={node.id}
              type="button"
              onClick={() => onSelectNode(idx)}
              className={`w-full text-left p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                isActive
                  ? 'bg-cyan-950/40 border-cyan-500/80 text-white shadow-sm ring-1 ring-cyan-400/30'
                  : isCompleted
                    ? 'bg-slate-900/60 border-emerald-900/40 text-slate-300 hover:border-slate-700'
                    : 'bg-slate-900/20 border-slate-800/60 text-slate-400 hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Node Number / Check Icon */}
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                  isActive
                    ? 'bg-cyan-400 text-slate-950'
                    : isCompleted
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-500'
                }`}>
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : `0${idx + 1}`}
                </div>

                <div className="min-w-0 space-y-0.5">
                  <h4 className={`text-xs font-bold truncate ${isActive ? 'text-cyan-300' : 'text-slate-300'}`}>
                    {node.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 truncate">
                    {node.subtitle || node.type}
                  </p>
                </div>
              </div>

              <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                isActive ? 'text-cyan-400 translate-x-0.5' : 'text-slate-700 group-hover:text-slate-500'
              }`} />
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between font-mono">
        <span>Tiến độ hành trình</span>
        <span className="font-bold text-cyan-400">
          {Math.round(((activeNodeIndex + 1) / procedure.nodes.length) * 100)}%
        </span>
      </div>

    </div>
  );
};
