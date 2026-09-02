import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Check, X } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'compact', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-bold ${className}`}>
        <Check className="w-3.5 h-3.5" />
        <span>Đã cài ứng dụng</span>
      </span>
    );
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer border border-blue-400/30 ${className}`}
        title="Cài đặt Cổng MTTQ Chánh Hiệp làm ứng dụng trên thiết bị"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{variant === 'full' ? 'Cài ứng dụng PWA' : 'Cài App'}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-xl border border-blue-200 transition-all cursor-pointer ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{variant === 'full' ? 'Cài ứng dụng trên iOS' : 'Cài iOS'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-black text-slate-900 uppercase">Cài đặt trên iPhone/iPad</h3>
                </div>
                <button 
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-100 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black flex items-center justify-center shrink-0 text-[10px]">1</span>
                  <p>Mở trình duyệt <strong>Safari</strong> và nhấn vào biểu tượng <strong>Chia sẻ (Share)</strong> ở thanh dưới cùng.</p>
                </div>
                <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-100 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black flex items-center justify-center shrink-0 text-[10px]">2</span>
                  <p>Cuộn xuống danh sách tùy chọn và chọn <strong>"Thêm vào Màn hình chính" (Add to Home Screen)</strong>.</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-2.5 text-emerald-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center shrink-0 text-[10px]">3</span>
                  <p>Nhấn <strong>Thêm (Add)</strong> ở góc phải trên. Ứng dụng MTTQ Chánh Hiệp sẽ xuất hiện ngay trên màn hình chính của bạn!</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback demo button for preview environments where beforeinstallprompt isn't fired yet
  return (
    <button
      onClick={() => {
        alert('Ứng dụng đã sẵn sàng hỗ trợ PWA! Bạn có thể chọn "Thêm vào Màn hình chính" (Add to Home Screen) từ menu trình duyệt.');
      }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-xl border border-blue-200/80 transition-all cursor-pointer ${className}`}
      title="Cài đặt Cổng MTTQ Chánh Hiệp làm ứng dụng"
    >
      <Download className="w-3.5 h-3.5 text-blue-600" />
      <span>App PWA</span>
    </button>
  );
};
