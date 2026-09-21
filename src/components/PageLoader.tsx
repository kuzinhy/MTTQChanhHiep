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
  Lock
} from 'lucide-react';
import { OptimizedImage } from './common/OptimizedImage';
import { bootstrapManager, BootstrapState } from '../lib/AppBootstrapManager';

interface PageLoaderProps {
  onLoaded?: () => void;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onLoaded }) => {
  const [state, setState] = useState<BootstrapState>(() => ({
    status: 'idle',
    progress: 10,
    currentTask: 'Khởi tạo hệ thống quản trị MTTQ...',
    ready: false,
    error: null,
  }));

  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let safetyTimer: NodeJS.Timeout;

    // Safety fallback: Never keep user waiting longer than 2.5 seconds
    safetyTimer = setTimeout(() => {
      setIsFinishing(true);
      setTimeout(() => {
        if (onLoaded) onLoaded();
      }, 350);
    }, 2500);

    const unsubscribe = bootstrapManager.subscribe((newState) => {
      setState(newState);
      if (newState.ready || newState.progress >= 100) {
        setIsFinishing(true);
        timer = setTimeout(() => {
          if (onLoaded) onLoaded();
        }, 400);
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

  const { progress, currentTask, statusText = currentTask } = state;

  // Milestone check logic
  const steps = [
    { id: 1, label: 'Lõi PWA', min: 15, icon: Cpu },
    { id: 2, label: 'CSDL Cloud', min: 45, icon: Database },
    { id: 3, label: 'Dữ liệu Tin tức', min: 75, icon: Globe },
    { id: 4, label: 'Sẵn sàng', min: 95, icon: CheckCircle2 }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ 
          opacity: 0, 
          scale: 1.03, 
          filter: 'blur(10px)', 
          transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } 
        }}
        className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-[10px] text-white flex flex-col items-center justify-between p-4 sm:p-8 select-none overflow-hidden antialiased"
        style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
      >
        {/* Background Ambient Glow & Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle Radial Gradients */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] sm:w-[55rem] sm:h-[55rem] bg-gradient-to-tr from-blue-700/20 via-cyan-500/15 to-indigo-700/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />

          {/* Precision Dot/Grid Matrix Background */}
          <div 
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }}
          />

          {/* Elegant Circular Rings for subtle depth */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] sm:w-[42rem] sm:h-[42rem] rounded-full border border-blue-500/15 animate-spin" style={{ animationDuration: '90s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[24rem] h-[24rem] sm:w-[32rem] sm:h-[32rem] rounded-full border border-dashed border-cyan-400/20 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '60s' }} />
        </div>

        {/* Top Header Bar */}
        <header className="relative z-10 w-full max-w-4xl flex items-center justify-between gap-4 pt-2">
          {/* Organization Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-md shadow-lg">
            <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center border border-yellow-400/70 shadow-xs shrink-0">
              <span className="text-[11px] text-yellow-300 font-black leading-none">★</span>
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-200 tracking-wide">
              Ủy ban MTTQ Việt Nam Phường Chánh Hiệp
            </span>
          </div>

          {/* Realtime Live Status Tag */}
          <div className="flex items-center gap-2 text-[11px] text-cyan-300/90 font-mono bg-cyan-950/40 border border-cyan-800/50 px-3 py-1 rounded-full backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="hidden sm:inline">Hệ Thống Trực Tuyến</span>
            <span className="sm:hidden">Realtime</span>
          </div>
        </header>

        {/* Central Core Content Card */}
        <main className="relative z-10 max-w-xl w-full flex flex-col items-center text-center space-y-6 sm:space-y-8 my-auto py-4">
          
          {/* MTTQ Emblem Emblem with Glowing Halo */}
          <div className="relative group">
            {/* Pulsing Aura Rings */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-red-600/30 via-yellow-500/20 to-blue-600/30 blur-xl animate-pulse" />
            
            <motion.div 
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1.5 bg-gradient-to-br from-yellow-400 via-red-500 to-blue-600 shadow-[0_0_50px_rgba(37,99,235,0.4)]"
            >
              <div className="w-full h-full rounded-full bg-slate-950 border-2 border-yellow-400/80 flex items-center justify-center p-3 overflow-hidden shadow-inner backdrop-blur-md">
                <OptimizedImage 
                  src="https://res.cloudinary.com/idt08wyp/image/upload/v1789907080/Logo-Mat-Tran-To-Quoc-Viet-Nam.png" 
                  alt="Biểu trưng Mặt trận Tổ quốc Việt Nam" 
                  variant="thumbnail"
                  priority={true}
                  className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.85)]"
                />
              </div>
            </motion.div>
          </div>

          {/* Titles & Typography */}
          <div className="space-y-2 max-w-lg">
            <h1 className="text-base sm:text-xl md:text-2xl font-black uppercase tracking-tight text-white leading-tight drop-shadow-md">
              Ủy Ban Mặt Trận Tổ Quốc Việt Nam
            </h1>
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-cyan-300 drop-shadow-sm">
              Phường Chánh Hiệp • Cổng Thông Tin &amp; An Sinh Số
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium max-w-md mx-auto leading-relaxed pt-1">
              Nền tảng số hóa quản trị đại đoàn kết, tiếp nhận ý kiến nhân dân và dịch vụ an sinh xã hội trực tuyến
            </p>
          </div>

          {/* Pipeline Milestone Grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-md">
            {steps.map((s) => {
              const isDone = progress >= s.min;
              const isCurrent = progress >= s.min - 25 && progress < s.min;
              const IconComp = s.icon;
              return (
                <div 
                  key={s.id}
                  className={`p-2.5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-1.5 ${
                    isDone 
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-xs' 
                      : isCurrent
                      ? 'bg-blue-900/40 border-cyan-400/60 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isDone ? 'text-emerald-400' : isCurrent ? 'text-cyan-300 animate-bounce' : 'text-slate-600'}`} />
                  <span className="text-[10px] font-bold truncate max-w-full">{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* High-Tech Progress Bar & Readout */}
          <div className="w-full max-w-md space-y-3">
            <div className="relative w-full h-3 rounded-full bg-slate-900 border border-slate-700/80 overflow-hidden shadow-inner p-0.5 backdrop-blur-md">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 shadow-[0_0_20px_rgba(34,211,238,0.7)] relative"
                initial={{ width: '5%' }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
              >
                {/* Glowing Leading Head */}
                <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white rounded-full shadow-[0_0_10px_#fff]" />
              </motion.div>
            </div>

            {/* Live Progress Data & Current Step */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 px-1">
              <div className="flex items-center gap-2 text-cyan-200 truncate pr-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                <span className="truncate text-left font-medium text-[11px] sm:text-xs">{statusText}</span>
              </div>
              <span className="font-mono font-black text-cyan-300 text-sm shrink-0">
                {Math.min(progress, 100)}%
              </span>
            </div>
          </div>

          {/* Fast Skip Button */}
          <div className="pt-2">
            <button
              onClick={handleSkip}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-bold transition-all cursor-pointer shadow-md hover:border-slate-500"
            >
              <span>Vào trang chủ ngay</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>

        </main>

        {/* Footer Info & Security Protocols */}
        <footer className="relative z-10 w-full max-w-4xl border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mã hóa SSL 256-bit • Chứng nhận số Hành chính công 4.0</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              PWA Offline Ready
            </span>
            <span className="flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              Đồng bộ Firebase Cloud
            </span>
          </div>
        </footer>

      </motion.div>
    </AnimatePresence>
  );
};
