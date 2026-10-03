import React from 'react';
import { Building2, MapPin, X, ArrowRight, CheckCircle2, ShieldCheck, Layers, Navigation } from 'lucide-react';

interface IndoorWayfindingModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCounter?: string;
}

export const IndoorWayfindingModal: React.FC<IndoorWayfindingModalProps> = ({ isOpen, onClose, targetCounter }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 font-sans select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900">Sơ đồ Quầy Tiếp nhận Một cửa (Tầng trệt)</h3>
              <p className="text-[11px] text-slate-500 font-medium">Trụ sở UBND Phường Chánh Hiệp</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Floorplan Canvas */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          
          {/* Entrance */}
          <div className="p-2.5 bg-blue-600 text-white rounded-xl text-center text-xs font-bold shadow-xs">
            🚪 CỬA CHÍNH VÀO BỘ PHẬN TIẾP NHẬN &amp; TRẢ KẾT QUẢ
          </div>

          {/* Kiosk */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs text-amber-900 font-bold">
            📍 KIOSK TỰ ĐỘNG BỐC SỐ THỨ TỰ &amp; TRA CỨU HỒ SƠ
          </div>

          {/* Counters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className={`p-3 rounded-xl border text-center space-y-1 ${targetCounter?.includes('1') ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-400' : 'bg-white border-slate-200 text-slate-800'}`}>
              <span className="text-[10px] font-mono block">QUẦY SỐ 1</span>
              <strong className="text-xs block">Chứng thực &amp; Sao y</strong>
            </div>

            <div className={`p-3 rounded-xl border text-center space-y-1 ${targetCounter?.includes('2') ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-400' : 'bg-white border-slate-200 text-slate-800'}`}>
              <span className="text-[10px] font-mono block">QUẦY SỐ 2</span>
              <strong className="text-xs block">Hộ tịch &amp; Dân số</strong>
            </div>

            <div className={`p-3 rounded-xl border text-center space-y-1 ${targetCounter?.includes('3') ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-400' : 'bg-white border-slate-200 text-slate-800'}`}>
              <span className="text-[10px] font-mono block">QUẦY SỐ 3</span>
              <strong className="text-xs block">Địa chính &amp; Đô thị</strong>
            </div>

            <div className={`p-3 rounded-xl border text-center space-y-1 ${targetCounter?.includes('4') ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-400' : 'bg-white border-slate-200 text-slate-800'}`}>
              <span className="text-[10px] font-mono block">QUẦY SỐ 4</span>
              <strong className="text-xs block">An sinh &amp; Trả kết quả</strong>
            </div>
          </div>

          {/* Waiting Lobby */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-900 font-bold">
            🪑 KHU VỰC GHẾ NGỒI CHỜ, NƯỚC UỐNG &amp; WIFI MIỄN PHÍ
          </div>
        </div>

        {/* Footer Notes */}
        <div className="text-[11px] text-slate-500 font-medium space-y-1">
          <p>• Người cao tuổi, phụ nữ mang thai và người khuyết tật được ưu tiên phục vụ tại Quầy số 1 mà không cần chờ số thứ tự.</p>
          <p>• Có cán bộ hỗ trợ công dân nộp hồ sơ trực tuyến tại bàn hướng dẫn số hóa.</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
        >
          Đã rõ &amp; Đóng
        </button>

      </div>
    </div>
  );
};
