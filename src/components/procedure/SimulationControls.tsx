import React from 'react';
import { Play, Pause, RotateCcw, ArrowLeft, ArrowRight, Gauge, CheckCircle2 } from 'lucide-react';

interface SimulationControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  currentIndex: number;
  totalSteps: number;
  isCompleted: boolean;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onReset,
  onNextStep,
  onPrevStep,
  currentIndex,
  totalSteps,
  isCompleted
}) => {
  const progressPercent = Math.round(((currentIndex + 1) / totalSteps) * 100);

  return (
    <div className="bg-[#08111F]/90 rounded-2xl border border-slate-800 p-3.5 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 select-none">
      
      {/* Control Buttons Cluster */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onTogglePlay}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-md ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isPlaying ? 'Tạm dừng' : 'Bắt đầu mô phỏng'}</span>
        </button>

        <button
          type="button"
          onClick={onPrevStep}
          disabled={currentIndex === 0}
          className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 rounded-xl transition cursor-pointer"
          title="Bước trước"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onNextStep}
          disabled={currentIndex === totalSteps - 1}
          className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 rounded-xl transition cursor-pointer"
          title="Bước tiếp theo"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onReset}
          className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
          title="Chạy lại từ đầu"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar & Counter */}
      <div className="flex-1 max-w-md w-full space-y-1.5 font-mono">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-bold">
            TIẾN ĐỘ: BƯỚC 0{currentIndex + 1} / 0{totalSteps}
          </span>
          <span className="text-cyan-400 font-extrabold">{progressPercent}%</span>
        </div>

        <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/40">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* State Badge */}
      <div className="flex items-center gap-2">
        {isCompleted ? (
          <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hoàn tất quy trình</span>
          </span>
        ) : (
          <span className="px-3 py-1 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700 text-xs font-mono font-medium flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tự động: 2.5s / bước</span>
          </span>
        )}
      </div>

    </div>
  );
};
