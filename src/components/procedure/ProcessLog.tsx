import React, { useRef, useEffect } from 'react';
import { ProcessLogEntry } from '../../types/workflow';
import { Terminal, Activity, CheckCircle2, Clock } from 'lucide-react';

interface ProcessLogProps {
  logs: ProcessLogEntry[];
}

export const ProcessLog: React.FC<ProcessLogProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-[#050B14] rounded-2xl border border-slate-800/90 p-3 shadow-inner font-mono text-[11px] select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-xs text-slate-200">NHẬT KÝ QUY TRÌNH (PROCESS LOG)</span>
        </div>
        <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          REALTIME ENGINE
        </span>
      </div>

      {/* Logs Scroll Window */}
      <div 
        ref={scrollRef}
        className="space-y-1.5 max-h-24 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800"
      >
        {logs.map((log) => (
          <div 
            key={log.id}
            className="flex items-start gap-2.5 py-0.5 text-slate-300 leading-tight"
          >
            <span className="text-slate-500 shrink-0 font-medium">[{log.timestamp}]</span>
            <span className={`px-1.5 py-0.2 rounded font-black text-[9px] uppercase tracking-wider shrink-0 ${
              log.status === 'RUNNING' 
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' 
                : log.status === 'DONE' 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                  : 'bg-slate-800 text-slate-400'
            }`}>
              {log.nodeType}
            </span>
            <span className="font-bold text-slate-200 shrink-0">{log.title}:</span>
            <span className="text-slate-400 truncate">{log.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
};
