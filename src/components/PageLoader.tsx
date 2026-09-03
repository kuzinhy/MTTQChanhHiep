import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Sparkles, Building2 } from 'lucide-react';

interface PageLoaderProps {
  onLoaded?: () => void;
  minDurationMs?: number;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onLoaded, minDurationMs = 1400 }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Đang khởi tạo kết nối an toàn...');

  useEffect(() => {
    const startTime = Date.now();
    
    // Smooth progress animation ticks
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawPct = Math.min(100, Math.floor((elapsed / minDurationMs) * 100));
      
      setProgress(rawPct);

      if (rawPct < 30) {
        setStatusText('Đang khởi tạo hệ thống...');
      } else if (rawPct < 60) {
        setStatusText('Đồng bộ dữ liệu Cổng thông tin & Văn bản...');
      } else if (rawPct < 90) {
        setStatusText('Tải dữ liệu Bản đồ số & Tiện ích dân nguyện...');
      } else {
        setStatusText('Hoàn tất đồng bộ. Sẵn sàng phục vụ!');
      }

      if (elapsed >= minDurationMs) {
        clearInterval(interval);
        if (onLoaded) {
          setTimeout(onLoaded, 200);
        }
      }
    }, 40);

    return () => clearInterval(interval);
  }, [minDurationMs, onLoaded]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.4, ease: 'easeOut' } }}
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-red-950 via-red-900 to-rose-950 text-white flex flex-col items-center justify-center p-6 select-none overflow-hidden"
    >
      {/* Background Decorative Radial Auras */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        {/* Emblem & Lotus Icon Container with Glowing Rings */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          {/* Outer Pulsing Rings */}
          <div className="absolute inset-0 rounded-full border-2 border-amber-400/30 animate-ping opacity-30" />
          <div className="absolute -inset-2 rounded-full border border-amber-300/20 animate-spin" style={{ animationDuration: '12s' }} />
          
          <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-2xl shadow-amber-500/20">
            <div className="w-full h-full rounded-[22px] bg-red-900/90 backdrop-blur-md flex items-center justify-center p-4 border border-amber-300/40">
              <svg viewBox="0 0 240 240" fill="none" className="w-full h-full drop-shadow-md">
                <circle cx="120" cy="120" r="100" fill="#991b1b" stroke="#f59e0b" strokeWidth="8" />
                <path d="M120 30 C80 60 40 100 40 140 C40 180 80 200 120 200 C160 200 200 180 200 140 C200 100 160 60 120 30 Z" fill="#dc2626" />
                <path d="M120 50 C90 75 60 110 60 140 C60 170 90 185 120 185 C150 185 180 170 180 140 C180 110 150 75 120 50 Z" fill="#facc15" opacity="0.85" />
                <circle cx="120" cy="125" r="28" fill="#991b1b" stroke="#fef08a" strokeWidth="4" />
                <path d="M120 105 L125 118 L139 119 L128 128 L132 142 L120 133 L108 142 L112 128 L101 119 L115 118 Z" fill="#fef08a" />
              </svg>
            </div>
          </div>
        </div>

        {/* Heading & Subtitles */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-[10px] font-black tracking-widest uppercase shadow-xs">
            <Building2 className="w-3 h-3 text-amber-400" />
            <span>Phường Chánh Hiệp • TP. Thủ Dầu Một</span>
          </div>

          <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase leading-snug drop-shadow-md">
            Ủy Ban Mặt Trận Tổ Quốc Việt Nam
          </h1>
          <p className="text-xs sm:text-sm font-bold text-amber-300/90 uppercase tracking-wide">
            Phường Chánh Hiệp
          </p>
          <p className="text-[11px] text-red-200/80 font-medium">
            Cổng Thông Tin Điện Tử & Văn Phòng Số
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="space-y-2.5 pt-2">
          <div className="relative w-full h-2.5 rounded-full bg-red-950/80 border border-amber-500/30 overflow-hidden shadow-inner p-0.5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 shadow-sm"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.1 }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-amber-200/90 px-1">
            <span className="flex items-center gap-1.5 text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              {statusText}
            </span>
            <span className="font-mono font-black text-amber-300">{progress}%</span>
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="pt-4 border-t border-red-800/60 flex items-center justify-center gap-2 text-[10px] text-red-200/70 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Hệ thống dữ liệu đã kiểm duyệt & bảo mật HTTPS</span>
        </div>
      </div>
    </motion.div>
  );
};
