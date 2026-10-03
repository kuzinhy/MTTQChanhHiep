import React, { useRef, useEffect } from 'react';
import { WorkflowProcedure, WorkflowNode } from '../../types/workflow';
import { WorkflowNodeComponent } from './WorkflowNode';
import { WorkflowEdgeComponent } from './WorkflowEdge';
import { ArrowDown, Sparkles } from 'lucide-react';

interface WorkflowCanvasProps {
  procedure: WorkflowProcedure;
  activeNodeIndex: number;
  onSelectNode: (index: number) => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  procedure,
  activeNodeIndex,
  onSelectNode
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll active node into view
  useEffect(() => {
    const activeEl = containerRef.current?.querySelector(`[data-node-index="${activeNodeIndex}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeNodeIndex]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full min-h-[460px] max-h-[620px] overflow-auto p-6 bg-[#08111F] rounded-3xl border border-slate-800 shadow-inner flex flex-col items-center select-none"
    >
      {/* Background Matrix Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Banner Ticker */}
      <div className="relative z-10 mb-6 px-4 py-1.5 bg-slate-900/90 border border-slate-700/60 rounded-full text-xs text-slate-300 font-mono flex items-center gap-2 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="font-bold text-cyan-300">WORKFLOW ENGINE:</span>
        <span className="text-slate-400">Node {activeNodeIndex + 1}/{procedure.nodes.length} ({procedure.nodes[activeNodeIndex]?.type})</span>
      </div>

      {/* VERTICAL / FLOW NODE SEQUENCE */}
      <div className="relative z-10 flex flex-col items-center space-y-6 w-full max-w-md pb-8">
        {procedure.nodes.map((node, idx) => {
          const isActive = activeNodeIndex === idx;
          const isCompleted = activeNodeIndex > idx;

          return (
            <React.Fragment key={node.id}>
              {/* Connector line between nodes */}
              {idx > 0 && (
                <div className="flex flex-col items-center py-1">
                  <div className={`w-0.5 h-7 transition-all duration-300 ${
                    idx <= activeNodeIndex ? 'bg-gradient-to-b from-cyan-400 to-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'bg-slate-800'
                  }`} />
                  <ArrowDown className={`w-3.5 h-3.5 -mt-1 ${
                    idx <= activeNodeIndex ? 'text-cyan-400 animate-bounce' : 'text-slate-700'
                  }`} />
                </div>
              )}

              {/* Node Card */}
              <div data-node-index={idx} className="w-full flex justify-center">
                <WorkflowNodeComponent
                  node={node}
                  isActive={isActive}
                  isCompleted={isCompleted}
                  index={idx}
                  onClick={() => onSelectNode(idx)}
                />
              </div>
            </React.Fragment>
          );
        })}
      </div>

    </div>
  );
};
