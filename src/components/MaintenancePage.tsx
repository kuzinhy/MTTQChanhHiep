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
    <div className="fixed inset-0 z-[9999] bg-gradient-to-b from-[#f0f7ff] via-[#e8f2fe] to-[#dbeafe] text-slate-800 flex flex-col items-center justify-between p-3 sm:p-5 select-none overflow-y-auto antialiased font-sans">
      {/* High-Tech Radar HUD Background Layers (White & Sky Blue Theme) */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-85">
        {/* Central Radial Luminescence */}
        <div className="absolute w-[35rem] h-[35rem] sm:w-[50rem] sm:h-[50rem] bg-sky-400/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute w-[20rem] h-[20rem] bg-blue-300/25 rounded-full blur-[80px]" />

        {/* Concentric Radar Ring 1 (Dashed Outer) */}
        <div 
          className="absolute w-[38rem] h-[38rem] sm:w-[54rem] sm:h-[54rem] rounded-full border border-blue-300/40 border-dashed animate-spin" 
          style={{ animationDuration: '60s' }} 
        />

        {/* Concentric Radar Ring 2 (Glowing HUD Circle) */}
        <div 
          className="absolute w-[32rem] h-[32rem] sm:w-[44rem] sm:h-[44rem] rounded-full border-2 border-sky-400/40 shadow-[0_0_35px_rgba(56,189,248,0.25)] animate-spin" 
          style={{ animationDirection: 'reverse', animationDuration: '40s' }} 
        />

        {/* Concentric Radar Ring 3 (Dot Matrix Ring) */}
        <div 
          className="absolute w-[26rem] h-[26rem] sm:w-[34rem] sm:h-[34rem] rounded-full border border-dotted border-blue-300/60 animate-spin" 
          style={{ animationDuration: '25s' }} 
        />

        {/* Concentric Radar Ring 4 (Inner High-Precision Ring) */}
        <div className="absolute w-[20rem] h-[20rem] sm:w-[25rem] sm:h-[25rem] rounded-full border border-sky-300/50" />

        {/* Concentric Radar Ring 5 (Core Command Ring) */}
        <div className="absolute w-[14rem] h-[14rem] sm:w-[17rem] sm:h-[17rem] rounded-full border-2 border-blue-300/70 bg-sky-200/25 backdrop-blur-xs shadow-[0_0_20px_rgba(56,189,248,0.2)]" />

        {/* Scanning Laser Beam Line */}
        <div 
          className="absolute w-[32rem] h-[32rem] sm:w-[44rem] sm:h-[44rem] rounded-full animate-spin pointer-events-none opacity-30" 
          style={{ animationDuration: '8s' }}
        >
          <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-gradient-to-b from-transparent via-sky-400 to-blue-600 shadow-[0_0_15px_#38bdf8]" />
        </div>

        {/* Glowing Particle Flares on HUD Rings */}
        <div className="absolute w-[32rem] h-[32rem] sm:w-[44rem] sm:h-[44rem] animate-spin" style={{ animationDuration: '30s' }}>
          <div className="absolute top-4 left-1/4 w-3.5 h-3.5 bg-sky-400 rounded-full shadow-[0_0_20px_#38bdf8]" />
          <div className="absolute bottom-6 right-1/4 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_15px_#60a5fa]" />
          <div className="absolute right-8 top-1/3 w-2.5 h-2.5 bg-sky-300 rounded-full shadow-[0_0_12px_#38bdf8]" />
        </div>
      </div>

      {/* Admin Preview Top Banner (if active) */}
      {isAdminPreview && (
        <div className="relative z-30 w-full max-w-lg mx-auto mb-2">
          <div className="bg-amber-500/15 backdrop-blur-md text-amber-900 px-4 py-2 text-xs font-black flex items-center justify-between rounded-2xl border border-amber-400/50 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>CHẾ ĐỘ XEM TRƯỚC BẢO TRÌ (ADMIN PREVIEW)</span>
            </div>
            {onExitPreview && (
              <button
                onClick={onExitPreview}
                className="bg-amber-500 text-white hover:bg-amber-600 px-3 py-1 rounded-xl text-[11px] font-black cursor-pointer transition-all shadow-xs"
              >
                Thoát Xem Trước
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Streamlined Command Center Card (White & Blue Theme) */}
      <div className="relative z-20 max-w-lg w-full mx-auto my-auto bg-white/95 backdrop-blur-xl border border-blue-200/90 rounded-3xl p-5 sm:p-6 text-center space-y-3.5 shadow-[0_20px_60px_-15px_rgba(28,57,143,0.12),0_0_25px_rgba(56,189,248,0.08)]">
        
        {/* Top Floating Organization Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/90 text-blue-800 text-[9.5px] sm:text-[10px] font-black tracking-wider uppercase shadow-xs mx-auto whitespace-nowrap flex-nowrap shrink-0">
          <div className="w-3.5 h-3.5 rounded-full bg-red-600 flex items-center justify-center border border-yellow-300 shadow-xs shrink-0">
            <span className="text-[9px] text-yellow-300 font-black leading-none">★</span>
          </div>
          <span className="text-center whitespace-nowrap font-black">
            CỔNG THÔNG TIN SỐ • ỦY BAN MTTQ VIỆT NAM PHƯỜNG&nbsp;CHÁNH&nbsp;HIỆP
          </span>
        </div>

        {/* MTTQ Emblem Logo Right in the Center with Soft Glow */}
        <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mt-0.5">
          {/* Pulsing ring aura */}
          <div className="absolute inset-0 rounded-full bg-sky-400/25 blur-lg animate-pulse" />
          
          <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-blue-600 via-sky-400 to-indigo-600 p-0.5 shadow-md">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-2 border-2 border-blue-100 overflow-hidden shadow-inner">
              <OptimizedImage 
                src="https://www.mattrancantho.vn/files/images/Logo%20-%20Icon/Logo%20MTTQ.png" 
                alt="Logo MTTQ Việt Nam" 
                variant="thumbnail"
                priority={true}
                className="w-full h-full object-contain drop-shadow-sm rounded-full"
              />
            </div>
          </div>
        </div>

        {/* System Titles */}
        <div className="space-y-0.5 w-full">
          <h1 className="text-sm sm:text-base font-black tracking-tight text-slate-900 uppercase leading-tight drop-shadow-xs whitespace-nowrap">
            Ủy Ban Mặt Trận Tổ Quốc Việt Nam
          </h1>
          <p className="text-xs sm:text-[13px] font-extrabold text-blue-700 uppercase tracking-wider drop-shadow-xs whitespace-nowrap">
            Phường&nbsp;Chánh&nbsp;Hiệp • TP.&nbsp;Hồ&nbsp;Chí&nbsp;Minh
          </p>
        </div>

        {/* Maintenance Mode Notice Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300/80 text-amber-900 text-[11px] font-black uppercase tracking-wider shadow-xs">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <Wrench className="w-3 h-3 text-amber-600 shrink-0" />
          <span>HỆ THỐNG ĐANG BẢO TRÌ NÂNG CẤP</span>
        </div>

        {/* Maintenance Dynamic Heading & Description */}
        <div className="space-y-1.5 max-w-md mx-auto">
          <h2 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
            {settings.maintenanceTitle || 'Website đang bảo trì hệ thống'}
          </h2>
          <p className="text-xs sm:text-[12.5px] text-slate-600 leading-relaxed font-medium">
            {settings.maintenanceMessage || 'Cổng thông tin & Văn phòng số MTTQ Việt Nam Phường Chánh Hiệp đang thực hiện nâng cấp, bảo trì định kỳ để phục vụ Quý nhân dân tốt hơn. Vui lòng quay lại sau.'}
          </p>
        </div>

        {/* System Health / Maintenance Components HUD */}
        <div className="grid grid-cols-3 gap-2 pt-0.5">
          <div className="p-2 rounded-xl border border-blue-200 bg-blue-50/70 text-blue-900 text-[10px] font-bold flex flex-col items-center gap-1 shadow-xs">
            <Server className="w-3.5 h-3.5 text-blue-600" />
            <span>Nâng Cấp Lõi</span>
          </div>
          <div className="p-2 rounded-xl border border-blue-200 bg-blue-50/70 text-blue-900 text-[10px] font-bold flex flex-col items-center gap-1 shadow-xs">
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>Tối Ưu CSDL</span>
          </div>
          <div className="p-2 rounded-xl border border-emerald-200 bg-emerald-50/70 text-emerald-900 text-[10px] font-bold flex flex-col items-center gap-1 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bảo Mật SSL</span>
          </div>
        </div>

        {/* Scheduled Time Box (if enabled) */}
        {settings.showScheduledTime && (formattedStart || formattedEnd) && (
          <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-3 text-left text-xs text-slate-700 space-y-1.5">
            <div className="font-extrabold text-blue-900 flex items-center gap-1.5 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Thời gian bảo trì dự kiến:</span>
            </div>
            {formattedStart && (
              <div className="flex items-center justify-between text-slate-700 bg-white p-2 rounded-xl border border-blue-200/60 text-[11px]">
                <span className="text-slate-500 font-medium">Bắt đầu:</span>
                <span className="font-bold text-slate-900">{formattedStart}</span>
              </div>
            )}
            {formattedEnd && (
              <div className="flex items-center justify-between text-slate-700 bg-white p-2 rounded-xl border border-blue-200/60 text-[11px]">
                <span className="text-slate-500 font-medium">Dự kiến hoàn thành:</span>
                <span className="font-bold text-emerald-700">{formattedEnd}</span>
              </div>
            )}
          </div>
        )}

        {/* Live Status Progress Indicator (Fixed 70% - Non-looping) */}
        <div className="space-y-1.5 pt-0.5">
          <div className="relative w-full h-2.5 sm:h-3 rounded-full bg-blue-100/90 border border-blue-200/90 overflow-hidden shadow-inner p-0.5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 shadow-xs"
              initial={{ width: '0%' }}
              animate={{ width: '70%' }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-semibold px-1">
            <span className="flex items-center gap-1.5 text-blue-950 text-[11px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-xs" />
              <span>Đang thực hiện quy trình bảo dưỡng kỹ thuật</span>
            </span>
            <span className="font-mono font-bold text-blue-700 text-[11px] bg-blue-100/80 px-2 py-0.5 rounded-md border border-blue-200">
              70%
            </span>
          </div>
        </div>

        {/* Check Status Feedback Message */}
        {checkStatusText && (
          <div className="py-2 px-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 animate-fadeIn font-semibold">
            {checkStatusText}
          </div>
        )}

        {/* Action Buttons: Status Check & Admin Login */}
        <div className="pt-2.5 border-t border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
          <button
            onClick={handleCheckStatus}
            disabled={isChecking}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-800 font-bold px-3.5 py-2 rounded-xl transition-all border border-blue-200 shadow-xs cursor-pointer text-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Đang kiểm tra...' : 'Kiểm tra trạng thái'}</span>
          </button>

          <button
            onClick={() => {
              if (onGoToAdmin) {
                onGoToAdmin();
              } else {
                window.location.href = '/admin';
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-4 py-2 rounded-xl transition-all border border-red-500 shadow-sm cursor-pointer text-xs"
          >
            <Lock className="w-3.5 h-3.5 text-yellow-300" />
            <span>Đăng nhập Cán bộ (/admin)</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {/* Footer Security Badge */}
        <div className="pt-1 flex items-center justify-center gap-1.5 text-[10.5px] text-blue-700 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Hệ thống bảo vệ an ninh đa tầng • Chứng chỉ SSL 256-bit</span>
        </div>
      </div>

      {/* Bottom Legal Branding */}
      <div className="relative z-20 text-center text-[10.5px] text-slate-500 py-1.5 font-medium tracking-wide">
        © {new Date().getFullYear()} ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP • TP. HỒ CHÍ MINH
      </div>
    </div>
  );
};
