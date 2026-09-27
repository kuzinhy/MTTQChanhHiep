import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Globe, 
  Database, 
  CheckCircle2, 
  ArrowRight,
  Wifi,
  Layers,
  Lock,
  MapPin,
  Newspaper,
  Zap
} from 'lucide-react';
import { OptimizedImage } from './common/OptimizedImage';
import { bootstrapManager, BootstrapState } from '../lib/AppBootstrapManager';

interface PageLoaderProps {
  onLoaded?: () => void;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onLoaded }) => {
  const [state, setState] = useState<BootstrapState>(() => ({
    status: 'idle',
    progress: 15,
    currentTask: 'Khởi tạo hệ thống Cổng thông tin...',
    ready: false,
    error: null,
  }));

  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let safetyTimer: NodeJS.Timeout;

    // Safety fallback: Never keep user waiting longer than 2.0 seconds
    safetyTimer = setTimeout(() => {
      setIsFinishing(true);
      setTimeout(() => {
        if (onLoaded) onLoaded();
      }, 300);
    }, 2000);

    const unsubscribe = bootstrapManager.subscribe((newState) => {
      setState(newState);
      if (newState.ready || newState.progress >= 100) {
        setIsFinishing(true);
        timer = setTimeout(() => {
          if (onLoaded) onLoaded();
        }, 350);
      }
    });

    bootstrapManager.runBootstrap();

    return () => {
      unsubscribe();
      if (timer) clearTimeout(timer);
      if (safetyTimer) clearTimeout(safetyTimer);
    };
  }, [onLoaded]);

  const handleSkip = () => {
    setIsFinishing(true);
    if (onLoaded) onLoaded();
  };

  const { progress, currentTask, statusText = currentTask, loadedDetails } = state;

  // 4 Core Preloading Milestones
  const steps = [
    { id: 1, label: 'Lõi PWA & Cache', min: 20, icon: Cpu },
    { id: 2, label: 'CSDL Cloud', min: 50, icon: Database },
    { id: 3, label: 'Bản đồ 21 Khu phố', min: 78, icon: MapPin },
    { id: 4, label: 'Trang chủ sẵn sàng', min: 95, icon: Sparkles }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ 
          opacity: 0, 
          scale: 1.02, 
          filter: 'blur(12px)', 
          transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
        }}
        className="fixed inset-0 z-[99999] bg-gradient-to-br from-slate-50 via-blue-50/70 to-cyan-50 text-slate-800 flex flex-col items-center justify-between p-4 sm:p-8 select-none overflow-hidden antialiased"
      >
        {/* Luminous Background Ambient Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle Radial Sunburst Gradients */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[45rem] bg-gradient-to-tr from-blue-200/40 via-cyan-100/50 to-amber-100/40 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/60 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/60 rounded-full blur-[120px]" />

          {/* Clean Dot Matrix Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(37, 99, 235, 0.12) 1.2px, transparent 0)`,
              backgroundSize: '28px 28px'
            }}
          />

          {/* Orbital Ambient Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full border border-blue-200/50 animate-spin" style={{ animationDuration: '80s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[26rem] h-[26rem] rounded-full border border-dashed border-cyan-300/60 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '50s' }} />
        </div>

        {/* Top Header Badge Bar */}
        <header className="relative z-10 w-full max-w-4xl flex items-center justify-between gap-4 pt-2">
          {/* Government Unit Title */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/90 border border-slate-200/90 shadow-sm backdrop-blur-md">
            <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center border border-yellow-300 shadow-xs shrink-0">
              <span className="text-[11px] text-yellow-300 font-black leading-none">★</span>
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-tight">
              Ủy ban MTTQ VN Phường Chánh Hiệp
            </span>
          </div>

          {/* Realtime & Cache Status Tag */}
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-2xl backdrop-blur-md shadow-xs">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span className="hidden sm:inline">Cache Trình Duyệt Tải Nhanh</span>
            <span className="sm:hidden">Tải Cực Nhanh</span>
          </div>
        </header>

        {/* Central Luminous Card */}
        <main className="relative z-10 max-w-lg w-full flex flex-col items-center text-center space-y-6 sm:space-y-7 my-auto py-6 px-6 sm:px-8 bg-white/80 border border-white/90 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] backdrop-blur-xl">
          
          {/* Glowing Emblem Container */}
          <div className="relative group">
            {/* Pulsing Red/Gold Aura */}
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-red-500/20 via-yellow-400/30 to-blue-500/20 blur-xl animate-pulse" />
            
            <motion.div 
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 bg-gradient-to-br from-yellow-400 via-red-500 to-blue-600 shadow-[0_10px_35px_rgba(37,99,235,0.25)]"
            >
              <div className="w-full h-full rounded-full bg-white border-2 border-yellow-400 flex items-center justify-center p-2.5 overflow-hidden shadow-inner">
                <OptimizedImage 
                  src="https://res.cloudinary.com/idt08wyp/image/upload/v1789907080/Logo-Mat-Tran-To-Quoc-Viet-Nam.png" 
                  alt="Biểu trưng Mặt trận Tổ quốc Việt Nam" 
                  variant="thumbnail"
                  priority={true}
                  className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                />
              </div>
            </motion.div>
          </div>

          {/* Titles & Typography */}
          <div className="space-y-1.5">
            <h1 className="text-base sm:text-xl font-black uppercase tracking-tight text-slate-900 leading-tight">
              Ủy Ban Mặt Trận Tổ Quốc Việt Nam
            </h1>
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-blue-700">
              Phường Chánh Hiệp • Cổng Thông Tin Điện Tử
            </p>
            <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto leading-relaxed pt-1">
              Hệ thống số hóa chuyển đổi số an sinh, tiếp nhận ý kiến nhân dân &amp; thông tin 21 Khu phố
            </p>
          </div>

          {/* Preloading Step Milestones */}
          <div className="grid grid-cols-4 gap-2 w-full">
            {steps.map((s) => {
              const isDone = progress >= s.min;
              const isCurrent = progress >= s.min - 25 && progress < s.min;
              const IconComp = s.icon;
              return (
                <div 
                  key={s.id}
                  className={`p-2.5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-1.5 ${
                    isDone 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-xs' 
                      : isCurrent
                      ? 'bg-blue-50 border-blue-400/80 text-blue-900 shadow-[0_0_12px_rgba(37,99,235,0.15)]'
                      : 'bg-slate-50 border-slate-200/80 text-slate-400'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isDone ? 'text-emerald-600' : isCurrent ? 'text-blue-600 animate-bounce' : 'text-slate-400'}`} />
                  <span className="text-[10px] font-bold truncate max-w-full">{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* High-Tech Bright Progress Bar & Readout */}
          <div className="w-full space-y-2.5">
            <div className="relative w-full h-3 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shadow-inner p-0.5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 shadow-[0_0_12px_rgba(34,211,238,0.6)] relative"
                initial={{ width: '15%' }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
              >
                {/* Glowing Leading Edge */}
                <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white rounded-full shadow-[0_0_8px_#fff]" />
              </motion.div>
            </div>

            {/* Live Progress Status & Readout */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
              <div className="flex items-center gap-2 text-blue-800 truncate pr-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping shrink-0" />
                <span className="truncate text-left font-semibold text-[11px] sm:text-xs">{statusText}</span>
              </div>
              <span className="font-mono font-black text-blue-700 text-sm shrink-0">
                {Math.min(progress, 100)}%
              </span>
            </div>
          </div>

          {/* Fast Action Skip Button */}
          <div className="pt-1">
            <button
              onClick={handleSkip}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Vào trang chủ ngay</span>
              <ArrowRight className="w-4 h-4 text-cyan-200" />
            </button>
          </div>

        </main>

        {/* Footer Security & Speed Badges */}
        <footer className="relative z-10 w-full max-w-4xl border-t border-slate-200/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>Hành chính công 4.0 • Bảo mật kết nối SSL 256-Bit</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Lưu Cache Trình Duyệt Tự Động
            </span>
            <span className="flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              Đồng Bộ Realtime Cloud
            </span>
          </div>
        </footer>

      </motion.div>
    </AnimatePresence>
  );
};
