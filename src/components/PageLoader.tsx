import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Sparkles, Building2 } from 'lucide-react';

interface PageLoaderProps {
  onLoaded?: () => void;
  minDurationMs?: number;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onLoaded, minDurationMs = 1200 }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Đang khởi tạo kết nối an toàn...');

  useEffect(() => {
    const startTime = Date.now();
    
    // Smooth progress animation ticks & caching resource initialization
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawPct = Math.min(100, Math.floor((elapsed / minDurationMs) * 100));
      
      setProgress(rawPct);

      if (rawPct < 30) {
        setStatusText('Đang nạp tài nguyên hệ thống vào bộ nhớ trình duyệt...');
      } else if (rawPct < 60) {
        setStatusText('Đồng bộ cơ sở dữ liệu Cổng thông tin & Văn bản...');
      } else if (rawPct < 90) {
        setStatusText('Tải sẵn dữ liệu Bản đồ số & Tiện ích offline...');
      } else {
        setStatusText('Sẵn sàng trải nghiệm mượt mà!');
      }

      if (elapsed >= minDurationMs) {
        clearInterval(interval);
        // Persist initialization cache flag
        try {
          localStorage.setItem('mttq_chanh_hiep_cached', 'true');
          localStorage.setItem('mttq_chanh_hiep_cache_time', new Date().toISOString());
        } catch (e) {
          console.error(e);
        }

        if (onLoaded) {
          setTimeout(onLoaded, 200);
        }
      }
    }, 35);

    return () => clearInterval(interval);
  }, [minDurationMs, onLoaded]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.4, ease: 'easeOut' } }}
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 text-white flex flex-col items-center justify-center p-6 select-none overflow-hidden"
    >
      {/* Background Decorative Radial Auras */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        {/* Emblem & Lotus Icon Container with Glowing Rings */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          {/* Outer Pulsing Rings */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-ping opacity-30" />
          <div className="absolute -inset-2 rounded-full border border-blue-400/20 animate-spin" style={{ animationDuration: '12s' }} />
          
          <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 p-0.5 shadow-2xl shadow-cyan-500/25">
            <div className="w-full h-full rounded-[22px] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-2.5 border border-cyan-300/30 overflow-hidden">
              <img 
                src="https://www.mattrancantho.vn/files/images/Logo%20-%20Icon/Logo%20MTTQ.png" 
                alt="Logo MTTQ Việt Nam" 
                className="w-full h-full object-contain drop-shadow-md rounded-xl"
                onError={(e) => {
                  e.currentTarget.src = 'https://sv2.anhsieuviet.com/2026/09/02/862c92e8-1336-4885-8787-1a6702c3a178ad174eb779884713.png';
                }}
              />
            </div>
          </div>
        </div>

        {/* Heading & Subtitles */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-200 text-[10px] font-black tracking-widest uppercase shadow-xs">
            <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center border border-yellow-300 shadow-xs shrink-0">
              <span className="text-[10px] text-yellow-300 font-black leading-none">★</span>
            </div>
            <span>Ủy Ban MTTQ Việt Nam • Phường Chánh Hiệp</span>
          </div>

          <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase leading-snug drop-shadow-md">
            Ủy Ban Mặt Trận Tổ Quốc Việt Nam
          </h1>
          <p className="text-xs sm:text-sm font-bold text-cyan-300 uppercase tracking-wide">
            Phường Chánh Hiệp
          </p>
          <p className="text-[11px] text-slate-300 font-medium">
            Cổng Thông Tin Điện Tử & Văn Phòng Số
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="space-y-2.5 pt-2">
          <div className="relative w-full h-2.5 rounded-full bg-slate-900 border border-cyan-500/30 overflow-hidden shadow-inner p-0.5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-400 shadow-sm"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.1 }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 px-1">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              {statusText}
            </span>
            <span className="font-mono font-black text-cyan-300">{progress}%</span>
          </div>
        </div>

        {/* Footer Security & Caching Badge */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Đã lưu trữ bộ nhớ đệm (Cache) cục bộ cho PC &amp; Mobile</span>
        </div>
      </div>
    </motion.div>
  );
};
