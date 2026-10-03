import React, { useState, useMemo } from 'react';
import { 
  Users, Clock, Activity, Calendar, AlertCircle, 
  CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Building2
} from 'lucide-react';

export const OneStopQueueEstimatorWidget: React.FC<{ onOpenWayfinding?: () => void }> = ({ onOpenWayfinding }) => {
  const currentHour = new Date().getHours();
  const currentDay = new Date().getDay(); // 0 = Sun, 1 = Mon...
  
  // Realtime density calculation logic
  const isWorkingHours = currentHour >= 7 && currentHour < 17 && currentDay >= 1 && currentDay <= 5;
  
  const densityStatus = useMemo(() => {
    if (!isWorkingHours) return { label: 'Ngoài giờ tiếp nhận', color: 'slate', waitMin: 0, level: 'OFF' };
    if ((currentHour >= 8 && currentHour <= 10) || (currentHour >= 13 && currentHour <= 15)) {
      return { label: 'Bình thường (Đang phục vụ tốt)', color: 'emerald', waitMin: '5 - 10 phút', level: 'NORMAL' };
    }
    if (currentHour === 10 || currentHour === 11 || currentHour === 15) {
      return { label: 'Mật độ đông (Nhiều lượt hồ sơ)', color: 'amber', waitMin: '15 - 25 phút', level: 'BUSY' };
    }
    return { label: 'Vắng (Tiếp nhận ngay)', color: 'sky', waitMin: '2 - 5 phút', level: 'LOW' };
  }, [currentHour, isWorkingHours]);

  // Live counter queue simulation
  const counters = [
    { id: 1, name: 'Quầy 1: Chứng thực & Sao y', currentTicket: 'CT-108', waitingCount: 2, status: 'SERVING' },
    { id: 2, name: 'Quầy 2: Hộ tịch & Dân số', currentTicket: 'HT-042', waitingCount: 3, status: 'SERVING' },
    { id: 3, name: 'Quầy 3: Địa chính & Đô thị', currentTicket: 'DC-019', waitingCount: 1, status: 'SERVING' },
    { id: 4, name: 'Quầy 4: An sinh & Chính sách', currentTicket: 'AS-015', waitingCount: 0, status: 'READY' }
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4 font-sans select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-mono font-bold uppercase">
                RADAR MẬT ĐỘ THỜI GIAN THỰC
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <h3 className="text-base font-black text-slate-900 tracking-tight mt-0.5">
              Dự báo Mật độ &amp; Thời gian chờ tại Bộ phận Một cửa
            </h3>
          </div>
        </div>

        {onOpenWayfinding && (
          <button
            type="button"
            onClick={onOpenWayfinding}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Sơ đồ quầy tiếp nhận</span>
          </button>
        )}
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Card 1: Status */}
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 block">Tình trạng tiếp nhận hiện tại:</span>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${densityStatus.color === 'emerald' ? 'bg-emerald-500' : densityStatus.color === 'amber' ? 'bg-amber-500' : 'bg-blue-500'}`} />
            <strong className="text-xs sm:text-sm font-black text-slate-900">
              {densityStatus.label}
            </strong>
          </div>
        </div>

        {/* Card 2: Wait Time */}
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 block">Thời gian ước tính chờ đến lượt:</span>
          <div className="flex items-center gap-2 text-blue-700">
            <Clock className="w-4 h-4" />
            <strong className="text-xs sm:text-sm font-black text-blue-900">
              {densityStatus.waitMin}
            </strong>
          </div>
        </div>

        {/* Card 3: Best Time */}
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 block">Khung giờ lý tưởng hôm nay:</span>
          <div className="flex items-center gap-2 text-emerald-700">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <strong className="text-xs sm:text-sm font-black text-emerald-900">
              08:30 – 10:00 &amp; 13:30 – 14:30
            </strong>
          </div>
        </div>

      </div>

      {/* Live Counter Tracking */}
      <div className="pt-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Theo dõi số thứ tự đang phục vụ tại các quầy:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {counters.map(c => (
            <div key={c.id} className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-500 truncate block">{c.name}</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-black font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {c.currentTicket}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {c.waitingCount > 0 ? `Chờ: ${c.waitingCount}` : 'Sẵn sàng'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
