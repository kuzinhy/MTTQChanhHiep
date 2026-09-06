import React from 'react';
import { ShieldAlert, Wrench, Lock, ArrowRight, ExternalLink, Clock, Building2, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Admin Preview Top Banner */}
      {isAdminPreview && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-black flex items-center justify-between shadow-lg mb-6 rounded-xl border border-amber-300 animate-pulse">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>ĐANG TRONG CHẾ ĐỘ XEM TRƯỚC BẢO TRÌ (ADMIN PREVIEW MODE)</span>
          </div>
          {onExitPreview && (
            <button
              onClick={onExitPreview}
              className="bg-slate-900 text-white hover:bg-slate-800 px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all"
            >
              Quay lại Bảng Quản trị
            </button>
          )}
        </div>
      )}

      {/* Main Content Card */}
      <div className="max-w-2xl w-full mx-auto my-auto bg-white/95 backdrop-blur-md text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200/80 relative z-10 text-center">
        {/* Top Gradient Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-amber-500 to-blue-600 rounded-t-3xl" />

        {/* Logo Header */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-2.5 shadow-md border border-amber-300 flex items-center justify-center">
            <OptimizedImage
              src="https://www.mattrancantho.vn/files/images/Logo%20-%20Icon/Logo%20MTTQ.png"
              alt="Logo MTTQ"
              variant="thumbnail"
              priority={true}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Organization Title */}
        <div className="text-xs font-black text-blue-900 uppercase tracking-wider mb-1">
          ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP
        </div>
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-6">
          CỔNG THÔNG TIN ĐIỆN TỬ & HỆ THỐNG VĂN PHÒNG SỐ
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 border border-amber-300 font-extrabold text-xs px-4 py-1.5 rounded-full mb-6 shadow-xs">
          <Wrench className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '4s' }} />
          <span>THÔNG BÁO BẢO TRÌ NÂNG CẤP HỆ THỐNG</span>
        </div>

        {/* Maintenance Main Title */}
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-4 leading-tight">
          {settings.maintenanceTitle || 'Website đang tạm dừng để bảo trì định kỳ'}
        </h1>

        {/* Maintenance Message */}
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 max-w-xl mx-auto">
          {settings.maintenanceMessage || 'Hệ thống đang được thực hiện nâng cấp hạ tầng và cập nhật tính năng mới để nâng cao chất lượng phục vụ Quý nhân dân. Xin chân thành cảm ơn sự đồng hành và thông cảm của Quý vị!'}
        </p>

        {/* Scheduled Time Box (If enabled) */}
        {settings.showScheduledTime && (formattedStart || formattedEnd) && (
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 mb-6 text-left text-xs sm:text-sm text-amber-900 space-y-2">
            <div className="font-extrabold text-amber-950 flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Thời gian bảo trì dự kiến:</span>
            </div>
            {formattedStart && (
              <div className="flex items-start gap-2 text-amber-800">
                <span className="font-semibold text-slate-500">Bắt đầu:</span>
                <span className="font-bold">{formattedStart}</span>
              </div>
            )}
            {formattedEnd && (
              <div className="flex items-start gap-2 text-amber-800">
                <span className="font-semibold text-slate-500">Dự kiến hoàn thành:</span>
                <span className="font-bold text-emerald-800">{formattedEnd}</span>
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-slate-200 my-6" />

        {/* Footer Actions / Admin Portal Access */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Phường Chánh Hiệp - TP. Thủ Dầu Một</span>
          </div>

          <button
            onClick={() => {
              if (onGoToAdmin) {
                onGoToAdmin();
              } else {
                window.location.href = '#/admin';
                window.location.reload();
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <Lock className="w-4 h-4 text-amber-300" />
            <span>Đăng nhập Cán bộ (/admin)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-center text-xs text-slate-400 py-4 relative z-10 font-medium">
        © {new Date().getFullYear()} MTTQ Việt Nam Phường Chánh Hiệp. Tất cả quyền được bảo lưu.
      </div>
    </div>
  );
};
