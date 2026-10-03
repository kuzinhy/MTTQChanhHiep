import React from 'react';
import { WorkflowNode, WorkflowNodeType, WorkflowNodeStatus } from '../../types/workflow';
import { 
  Play, FileText, MapPin, Building2, CheckCircle2, AlertCircle, 
  Clock, Check, Sparkles, HelpCircle, Layers, ArrowRight, CornerDownRight, CreditCard
} from 'lucide-react';

interface WorkflowNodeProps {
  node: WorkflowNode;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
  index: number;
}

const getNodeIcon = (type: WorkflowNodeType) => {
  switch (type) {
    case 'START': return Play;
    case 'DOCUMENT': return FileText;
    case 'FORM': return FileText;
    case 'LOCATION': return MapPin;
    case 'COUNTER': return Building2;
    case 'VERIFY': return AlertCircle;
    case 'DECISION': return CornerDownRight;
    case 'PROCESS': return Layers;
    case 'PAYMENT': return CreditCard;
    case 'RESULT': return CheckCircle2;
    case 'END': return Sparkles;
    default: return CheckCircle2;
  }
};

export const WorkflowNodeComponent: React.FC<WorkflowNodeProps> = ({
  node,
  isActive,
  isCompleted,
  onClick,
  index
}) => {
  const Icon = getNodeIcon(node.type);

  // Status computation
  const status: WorkflowNodeStatus = isActive ? 'RUNNING' : isCompleted ? 'DONE' : 'WAITING';

  return (
    <div
      onClick={onClick}
      className={`relative group rounded-2xl p-4 transition-all duration-300 cursor-pointer border select-none ${
        isActive
          ? 'bg-slate-900 text-white border-cyan-400 ring-4 ring-cyan-500/20 shadow-[0_0_25px_rgba(86,204,242,0.35)] scale-[1.02] z-20'
          : isCompleted
            ? 'bg-slate-900/90 text-slate-200 border-emerald-500/80 shadow-md shadow-emerald-950/40 hover:border-emerald-400 z-10'
            : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
      }`}
      style={{ minWidth: '240px', maxWidth: '300px' }}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${
            isActive
              ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/50'
              : isCompleted
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-400'
          }`}>
            {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : `0${index + 1}`}
          </div>
          
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-400">
            {node.type}
          </span>
        </div>

        {/* Status Badge */}
        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
          status === 'RUNNING'
            ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/60 animate-pulse'
            : status === 'DONE'
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60'
              : 'bg-slate-800/80 text-slate-400 border-slate-700'
        }`}>
          {status}
        </span>
      </div>

      {/* Title & Subtitle */}
      <div className="space-y-0.5">
        <h4 className={`text-xs sm:text-sm font-black tracking-tight line-clamp-1 transition-colors ${
          isActive ? 'text-cyan-300' : isCompleted ? 'text-white' : 'text-slate-300'
        }`}>
          {node.title}
        </h4>
        {node.subtitle && (
          <p className="text-[11px] text-slate-400 font-medium line-clamp-1">
            {node.subtitle}
          </p>
        )}
      </div>

      {/* Description Snippet */}
      <p className="text-[11px] text-slate-400/90 line-clamp-2 mt-2 leading-relaxed">
        {node.description}
      </p>

      {/* Card Footer Metadata */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-medium">
        {node.duration && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{node.duration}</span>
          </span>
        )}
        {node.counter && (
          <span className="flex items-center gap-1 text-blue-300">
            <Building2 className="w-3 h-3" />
            <span className="truncate max-w-[120px]">{node.counter}</span>
          </span>
        )}
      </div>

      {/* Glowing Edge Indicator when Active */}
      {isActive && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
        </span>
      )}
    </div>
  );
};
