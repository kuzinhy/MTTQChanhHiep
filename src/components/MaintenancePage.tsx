import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Wrench, 
  Lock, 
  ArrowRight, 
  Clock, 
  Building2, 
  ShieldCheck, 
  RefreshCw, 
  Server, 
  Database, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { SystemSettings } from '../types';
import { OptimizedImage } from './common/OptimizedImage';

interface MaintenancePageProps {
  settings: SystemSettings;
  onGoToAdmin?: () => void;
  isAdminPreview?: boolean;
  onExitPreview?: () => void;
}

export const MaintenancePage: React.FC<MaintenancePageProps> = ({
  settings,
  onGoToAdmin,
  isAdminPreview,
  onExitPreview
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [checkStatusText, setCheckStatusText] = useState<string | null>(null);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    setCheckStatusText(null);
    try {
      const res = await fetch('/api/system/status', {
        headers: { 'Cache-Control': 'no-cache, no-store' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.settings && !data.settings.maintenanceMode) {
          window.location.reload();
          return;
        }
      }
      setCheckStatusText('Hệ thống vẫn đang trong quá trình bảo trì định kỳ.');
      setTimeout(() => setCheckStatusText(null), 4000);
    } catch {
      setCheckStatusText('Chưa kết nối được máy chủ, vui lòng thử lại sau.');
      setTimeout(() => setCheckStatusText(null), 4000);
    } finally {
      setIsChecking(false);
    }
  };

  const formattedStart = settings.maintenanceStartAt
    ? new Date(settings.maintenanceStartAt).toLocaleString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  const formattedEnd = settings.maintenanceEndAt
    ? new Date(settings.maintenanceEndAt).toLocaleString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-b from-[#0a45d1] via-[#072db5] to-[#031568] text-white flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-y-auto antialiased font-sans">
      {/* High-Tech Radar HUD Background Layers (Identical to PageLoader) */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-90">
        {/* Central Radial Luminescence */}
        <div className="absolute w-[35rem] h-[35rem] sm:w-[50rem] sm:h-[50rem] bg-cyan-400/25 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute w-[20rem] h-[20rem] bg-blue-500/30 rounded-full blur-[70px]" />

        {/* Concentric Radar Ring 1 (Dashed Outer) */}
        <div 
          className="absolute w-[38rem] h-[38rem] sm:w-[56rem] sm:h-[56rem] rounded-full border border-cyan-300/30 border-dashed animate-spin" 
          style={{ animationDuration: '60s' }} 
        />

        {/* Concentric Radar Ring 2 (Glowing HUD Circle) */}
        <div 
          className="absolute w-[32rem] h-[32rem] sm:w-[46rem] sm:h-[46rem] rounded-full border-2 border-cyan-400/40 shadow-[0_0_40px_rgba(34,211,238,0.4)] animate-spin" 
          style={{ animationDirection: 'reverse', animationDuration: '40s' }} 
        />

        {/* Concentric Radar Ring 3 (Dot Matrix Ring) */}
        <div 
          className="absolute w-[26rem] h-[26rem] sm:w-[36rem] sm:h-[36rem] rounded-full border border-dotted border-cyan-200/70 animate-spin" 
          style={{ animationDuration: '25s' }} 
        />

        {/* Concentric Radar Ring 4 (Inner High-Precision Ring) */}
        <div className="absolute w-[20rem] h-[20rem] sm:w-[26rem] sm:h-[26rem] rounded-full border border-cyan-300/50" />

        {/* Concentric Radar Ring 5 (Core Command Ring) */}
        <div className="absolute w-[14rem] h-[14rem] sm:w-[18rem] sm:h-[18rem] rounded-full border-2 border-cyan-200/80 bg-cyan-500/15 backdrop-blur-xs shadow-[0_0_25px_rgba(34,211,238,0.5)]" />

        {/* Scanning Laser Beam Line */}
        <div 
          className="absolute w-[32rem] h-[32rem] sm:w-[46rem] sm:h-[46rem] rounded-full animate-spin pointer-events-none opacity-40" 
          style={{ animationDuration: '8s' }}
        >
          <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-gradient-to-b from-transparent via-cyan-300 to-white shadow-[0_0_15px_#22d3ee]" />
        </div>

        {/* Glowing Particle Flares on HUD Rings */}
        <div className="absolute w-[32rem] h-[32rem] sm:w-[46rem] sm:h-[46rem] animate-spin" style={{ animationDuration: '30s' }}>
          <div className="absolute top-4 left-1/4 w-4 h-4 bg-white rounded-full shadow-[0_0_25px_#fff,0_0_40px_#22d3ee]" />
          <div className="absolute bottom-6 right-1/4 w-3.5 h-3.5 bg-cyan-200 rounded-full shadow-[0_0_20px_#fff]" />
          <div className="absolute right-8 top-1/3 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_#22d3ee]" />
        </div>
      </div>

      {/* Admin Preview Top Banner (if active) */}
      {isAdminPreview && (
        <div className="relative z-30 w-full max-w-xl mx-auto mb-2">
          <div className="bg-amber-500/20 backdrop-blur-md text-amber-200 px-4 py-2.5 text-xs font-black flex items-center justify-between rounded-2xl border border-amber-400/50 shadow-lg">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-300 shrink-0" />
              <span>CHẾ ĐỘ XEM TRƯỚC BẢO TRÌ (ADMIN PREVIEW)</span>
            </div>
            {onExitPreview && (
              <button
                onClick={onExitPreview}
                className="bg-amber-400 text-slate-950 hover:bg-amber-300 px-3 py-1 rounded-xl text-[11px] font-black cursor-pointer transition-all shadow-xs"
              >
                Thoát Xem Trước
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Transparent Command Center Card (Exact styling from PageLoader) */}
      <div className="relative z-20 max-w-xl w-full mx-auto my-auto bg-slate-950/40 backdrop-blur-md border border-cyan-400/30 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-[0_0_50px_rgba(3,21,104,0.8)]">
        
        {/* Top Floating Organization Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-cyan-500/20 border border-cyan-300/40 text-cyan-200 text-[9px] sm:text-[10.5px] font-black tracking-wider uppercase shadow-md mx-auto whitespace-nowrap flex-nowrap shrink-0">
          <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center border border-yellow-300 shadow-xs shrink-0">
            <span className="text-[10px] text-yellow-300 font-black leading-none">★</span>
          </div>
          <span className="text-center whitespace-nowrap font-black">
            CỔNG THÔNG TIN SỐ • ỦY BAN MTTQ VIỆT NAM PHƯỜNG&nbsp;CHÁNH&nbsp;HIỆP
          </span>
        </div>

        {/* MTTQ Emblem Logo Right in the Center with Pulsing Glow */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mt-1">
          {/* Pulsing ring aura */}
          <div className="absolute inset-0 rounded-full bg-cyan-400/40 blur-xl animate-pulse" />
          
          <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 p-1 shadow-[0_0_40px_rgba(34,211,238,0.7)]">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center p-3 border-2 border-cyan-300/80 overflow-hidden shadow-inner">
              <OptimizedImage 
                src="https://www.mattrancantho.vn/files/images/Logo%20-%20Icon/Logo%20MTTQ.png" 
                alt="Logo MTTQ Việt Nam" 
                variant="thumbnail"
                priority={true}
                className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.95)] rounded-full"
              />
            </div>
          </div>
        </div>

        {/* System Titles */}
        <div className="space-y-1 w-full">
          <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white uppercase leading-tight drop-shadow-md whitespace-nowrap">
            Ủy Ban Mặt Trận Tổ Quốc Việt Nam
          </h1>
          <p className="text-xs sm:text-sm font-black text-cyan-300 uppercase tracking-widest drop-shadow whitespace-nowrap">
            Phường&nbsp;Chánh&nbsp;Hiệp • TP.&nbsp;Hồ&nbsp;Chí&nbsp;Minh
          </p>
        </div>

        {/* Maintenance Mode Notice Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.3)]">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <Wrench className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>HỆ THỐNG ĐANG BẢO TRÌ NÂNG CẤP</span>
        </div>

        {/* Maintenance Dynamic Heading & Description */}
        <div className="space-y-2 max-w-lg mx-auto">
          <h2 className="text-base sm:text-xl font-black text-white leading-snug drop-shadow-sm">
            {settings.maintenanceTitle || 'Website đang bảo trì hệ thống'}
          </h2>
          <p className="text-xs sm:text-[13px] text-blue-100/90 leading-relaxed font-medium">
            {settings.maintenanceMessage || 'Cổng thông tin & Văn phòng số MTTQ Việt Nam Phường Chánh Hiệp đang thực hiện nâng cấp, bảo trì định kỳ để phục vụ Quý nhân dân tốt hơn. Vui lòng quay lại sau.'}
          </p>
        </div>

        {/* System Health / Maintenance Components HUD */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="p-2.5 rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-200 text-[10px] font-bold flex flex-col items-center gap-1 backdrop-blur-xs">
            <Server className="w-4 h-4 text-cyan-300" />
            <span>Nâng Cấp Lõi</span>
          </div>
          <div className="p-2.5 rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-200 text-[10px] font-bold flex flex-col items-center gap-1 backdrop-blur-xs">
            <Database className="w-4 h-4 text-cyan-300" />
            <span>Tối Ưu CSDL</span>
          </div>
          <div className="p-2.5 rounded-xl border border-emerald-400/40 bg-emerald-500/10 text-emerald-200 text-[10px] font-bold flex flex-col items-center gap-1 backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Bảo Mật SSL</span>
          </div>
        </div>

        {/* Scheduled Time Box (if enabled) */}
        {settings.showScheduledTime && (formattedStart || formattedEnd) && (
          <div className="bg-slate-900/80 border border-cyan-400/40 rounded-2xl p-3.5 text-left text-xs text-slate-200 space-y-2 backdrop-blur-sm">
            <div className="font-extrabold text-amber-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Thời gian bảo trì dự kiến:</span>
            </div>
            {formattedStart && (
              <div className="flex items-center justify-between text-blue-100 bg-slate-950/60 p-2 rounded-xl border border-cyan-500/20 text-[11px]">
                <span className="text-slate-400 font-medium">Bắt đầu:</span>
                <span className="font-bold text-white">{formattedStart}</span>
              </div>
            )}
            {formattedEnd && (
              <div className="flex items-center justify-between text-blue-100 bg-slate-950/60 p-2 rounded-xl border border-cyan-500/20 text-[11px]">
                <span className="text-slate-400 font-medium">Dự kiến hoàn thành:</span>
                <span className="font-bold text-emerald-300">{formattedEnd}</span>
              </div>
            )}
          </div>
        )}

        {/* Live Status Laser Progress Indicator */}
        <div className="space-y-2 pt-1">
          <div className="relative w-full h-2.5 rounded-full bg-slate-950/80 border border-cyan-400/50 overflow-hidden shadow-inner p-0.5 backdrop-blur-md">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(34,211,238,0.9)]"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: 'easeInOut'
              }}
              style={{ width: '60%' }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-blue-100 px-1">
            <span className="flex items-center gap-2 text-cyan-200 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
              <span>Đang thực hiện quy trình bảo dưỡng kỹ thuật</span>
            </span>
            <span className="font-mono font-bold text-cyan-300 text-[11px]">MAINTENANCE</span>
          </div>
        </div>

        {/* Check Status Feedback Message */}
        {checkStatusText && (
          <div className="py-2 px-3 rounded-xl bg-slate-900/90 border border-cyan-400/50 text-xs text-amber-300 animate-fadeIn font-semibold">
            {checkStatusText}
          </div>
        )}

        {/* Action Buttons: Status Check & Admin Login */}
        <div className="pt-3 border-t border-cyan-400/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <button
            onClick={handleCheckStatus}
            disabled={isChecking}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-cyan-200 hover:text-white font-bold px-4 py-2.5 rounded-xl transition-all border border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.2)] cursor-pointer text-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-300 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Đang kiểm tra...' : 'Kiểm tra trạng thái'}</span>
          </button>

          <button
            onClick={() => {
              if (onGoToAdmin) {
                onGoToAdmin();
              } else {
                window.location.hash = '#/admin';
                window.location.reload();
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-4 py-2.5 rounded-xl transition-all border border-red-400/50 shadow-[0_0_20px_rgba(220,38,38,0.5)] cursor-pointer text-xs"
          >
            <Lock className="w-3.5 h-3.5 text-yellow-300" />
            <span>Đăng nhập Cán bộ (/admin)</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {/* Footer Security Badge */}
        <div className="pt-2 flex items-center justify-center gap-2 text-[10.5px] text-cyan-300 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Hệ thống bảo vệ đa tầng • Chứng chỉ SSL 256-bit</span>
        </div>
      </div>

      {/* Bottom Legal Branding */}
      <div className="relative z-20 text-center text-[10.5px] text-blue-200/70 py-2 font-medium tracking-wide">
        © {new Date().getFullYear()} ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP • TP. HỒ CHÍ MINH
      </div>
    </div>
  );
};
