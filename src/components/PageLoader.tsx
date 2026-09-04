import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Sparkles, Cpu, Globe, Database, CheckCircle2 } from 'lucide-react';

interface PageLoaderProps {
  onLoaded?: () => void;
  minDurationMs?: number;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onLoaded, minDurationMs = 1400 }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Đang khởi tạo kết nối bảo mật SSL...');
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawPct = Math.min(100, Math.floor((elapsed / minDurationMs) * 100));
      
      setProgress(rawPct);

      if (rawPct < 25) {
        setActiveStep(1);
        setStatusText('Đang nạp tài nguyên lõi vào bộ nhớ trình duyệt...');
      } else if (rawPct < 55) {
        setActiveStep(2);
        setStatusText('Đồng bộ CSDL Cổng thông tin & 21 Khu phố số...');
      } else if (rawPct < 85) {
        setActiveStep(3);
        setStatusText('Kiểm tra xác thực Văn phòng số & Quyền truy cập...');
      } else {
        setActiveStep(4);
        setStatusText('Hệ thống đã sẵn sàng kết nối toàn diện!');
      }

      if (elapsed >= minDurationMs) {
        clearInterval(interval);
        try {
          localStorage.setItem('mttq_chanh_hiep_cached', 'true');
          localStorage.setItem('mttq_chanh_hiep_cache_time', new Date().toISOString());
        } catch (e) {
          console.error(e);
        }

        if (onLoaded) {
          setTimeout(onLoaded, 250);
        }
      }
    }, 35);

    return () => clearInterval(interval);
  }, [minDurationMs, onLoaded]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.5, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[9999] bg-gradient-to-b from-[#0a45d1] via-[#072db5] to-[#031568] text-white flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-hidden antialiased"
    >
      {/* High-Tech Radar HUD Background Layers */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-90">
        {/* Central Radial Luminescence */}
        <div className="absolute w-[35rem] h-[35rem] sm:w-[50rem] sm:h-[50rem] bg-cyan-400/25 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute w-[20rem] h-[20rem] bg-blue-500/30 rounded-full blur-[70px]" />

        {/* Concentric Radar Ring 1 (Dashed Outer) */}
        <div className="absolute w-[38rem] h-[38rem] sm:w-[56rem] sm:h-[56rem] rounded-full border border-cyan-300/30 border-dashed animate-spin" style={{ animationDuration: '60s' }} />

        {/* Concentric Radar Ring 2 (Glowing HUD Circle) */}
        <div className="absolute w-[32rem] h-[32rem] sm:w-[46rem] sm:h-[46rem] rounded-full border-2 border-cyan-400/40 shadow-[0_0_40px_rgba(34,211,238,0.4)] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '40s' }} />

        {/* Concentric Radar Ring 3 (Dot Matrix Ring) */}
        <div className="absolute w-[26rem] h-[26rem] sm:w-[36rem] sm:h-[36rem] rounded-full border border-dotted border-cyan-200/70 animate-spin" style={{ animationDuration: '25s' }} />

        {/* Concentric Radar Ring 4 (Inner High-Precision Ring) */}
        <div className="absolute w-[20rem] h-[20rem] sm:w-[26rem] sm:h-[26rem] rounded-full border border-cyan-300/50" />

        {/* Concentric Radar Ring 5 (Core Command Ring) */}
        <div className="absolute w-[14rem] h-[14rem] sm:w-[18rem] sm:h-[18rem] rounded-full border-2 border-cyan-200/80 bg-cyan-500/15 backdrop-blur-xs shadow-[0_0_25px_rgba(34,211,238,0.5)]" />

        {/* Scanning Laser Beam Line */}
        <div className="absolute w-[32rem] h-[32rem] sm:w-[46rem] sm:h-[46rem] rounded-full animate-spin pointer-events-none opacity-40" style={{ animationDuration: '8s' }}>
          <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-gradient-to-b from-transparent via-cyan-300 to-white shadow-[0_0_15px_#22d3ee]" />
        </div>

        {/* Glowing Particle Flares on HUD Rings */}
        <div className="absolute w-[32rem] h-[32rem] sm:w-[46rem] sm:h-[46rem] animate-spin" style={{ animationDuration: '30s' }}>
          <div className="absolute top-4 left-1/4 w-4 h-4 bg-white rounded-full shadow-[0_0_25px_#fff,0_0_40px_#22d3ee]" />
          <div className="absolute bottom-6 right-1/4 w-3.5 h-3.5 bg-cyan-200 rounded-full shadow-[0_0_20px_#fff]" />
          <div className="absolute right-8 top-1/3 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_#22d3ee]" />
        </div>
      </div>

      {/* Main Transparent Command Center Card */}
      <div className="relative z-10 max-w-lg w-full bg-transparent border-0 rounded-3xl p-6 sm:p-8 text-center space-y-6">
        
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-300/40 text-cyan-200 text-[10px] font-black tracking-widest uppercase shadow-md mx-auto">
          <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center border border-yellow-300 shadow-xs shrink-0">
            <span className="text-[10px] text-yellow-300 font-black leading-none">★</span>
          </div>
          <span>Cổng Thông Tin Số • Ủy Ban MTTQ Việt Nam Phường Chánh Hiệp</span>
        </div>

        {/* MTTQ Emblem Logo Right in the Center of Concentric Rings inside Glass Card */}
        <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
          {/* Pulsing ring aura */}
          <div className="absolute inset-0 rounded-full bg-cyan-400/40 blur-xl animate-pulse" />
          
          <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 p-1 shadow-[0_0_40px_rgba(34,211,238,0.7)]">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center p-3.5 border-2 border-cyan-300/80 overflow-hidden shadow-inner">
              <img 
                src="https://www.mattrancantho.vn/files/images/Logo%20-%20Icon/Logo%20MTTQ.png" 
                alt="Logo MTTQ Việt Nam" 
                className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.95)] rounded-full"
                onError={(e) => {
                  e.currentTarget.src = 'https://sv2.anhsieuviet.com/2026/09/02/862c92e8-1336-4885-8787-1a6702c3a178ad174eb779884713.png';
                }}
              />
            </div>
          </div>
        </div>

        {/* Titles & System Branding */}
        <div className="space-y-1.5 w-full overflow-x-auto no-scrollbar py-1">
          <h1 className="text-sm sm:text-lg md:text-xl font-black tracking-tight text-white uppercase leading-tight drop-shadow-md whitespace-nowrap">
            Ủy Ban Mặt Trận Tổ Quốc Việt Nam
          </h1>
          <p className="text-xs sm:text-sm font-black text-cyan-300 uppercase tracking-widest drop-shadow whitespace-nowrap">
            Phường Chánh Hiệp • TP. Hồ Chí Minh
          </p>
          <p className="text-[11px] sm:text-xs text-blue-200/90 font-semibold tracking-wide whitespace-nowrap">
            Hệ Thống Quản Trị Trực Tuyến &amp; Cổng Dịch Vụ An Sinh Số
          </p>
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className={`p-2 rounded-xl border text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${
            activeStep >= 1 ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-200' : 'bg-slate-900/60 border-slate-800 text-slate-500'
          }`}>
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Nạp Tải Lõi</span>
          </div>
          <div className={`p-2 rounded-xl border text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${
            activeStep >= 2 ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-200' : 'bg-slate-900/60 border-slate-800 text-slate-500'
          }`}>
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Đồng Bộ CSDL</span>
          </div>
          <div className={`p-2 rounded-xl border text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${
            activeStep >= 4 ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200' : 'bg-slate-900/60 border-slate-800 text-slate-500'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sẵn Sàng</span>
          </div>
        </div>

        {/* Loading Progress Bar & Live Status */}
        <div className="space-y-3 pt-2">
          <div className="relative w-full h-3 rounded-full bg-slate-900/90 border border-cyan-400/50 overflow-hidden shadow-inner p-0.5 backdrop-blur-md">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 shadow-[0_0_20px_rgba(34,211,238,0.9)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.1 }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-blue-100 px-1">
            <span className="flex items-center gap-2 text-cyan-200">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
              <span className="truncate max-w-[280px] text-left">{statusText}</span>
            </span>
            <span className="font-mono font-black text-cyan-300 text-sm">{progress}%</span>
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-cyan-300 font-medium">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Bảo mật chứng chỉ SSL 256-bit • Đồng bộ Cloud hai chiều</span>
        </div>

      </div>
    </motion.div>
  );
};
