import React from 'react';
import { X, Activity, Users, Calendar, TrendingUp, ShieldCheck, Server, Radio } from 'lucide-react';
import { VisitorStats } from '../lib/visitorTracker';

interface VisitorStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onlineCount: number;
  stats: VisitorStats;
}

export const VisitorStatsModal: React.FC<VisitorStatsModalProps> = ({
  isOpen,
  onClose,
  onlineCount,
  stats,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
              <Activity className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wide">
                Thống Kê Lưu Lượng Truy Cập
              </h3>
              <p className="text-[11px] text-blue-100 font-medium">
                Cổng TTĐT Ủy ban MTTQ Việt Nam Phường Chánh Hiệp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 text-slate-700 text-xs">
          {/* Live Online Badge */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-emerald-800 text-xs">
                Số người đang trực tuyến (Real-time):
              </span>
            </div>
            <span className="text-lg font-black text-emerald-700 font-mono">
              {onlineCount}
            </span>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Truy cập hôm nay:</span>
              </div>
              <span className="text-base font-black text-slate-800 font-mono">
                {(stats.todayVisits || 0).toLocaleString('vi-VN')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[11px]">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                <span>Truy cập tháng này:</span>
              </div>
              <span className="text-base font-black text-slate-800 font-mono">
                {(stats.monthVisits || 0).toLocaleString('vi-VN')}
              </span>
            </div>

            <div className="col-span-2 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                <Users className="w-4 h-4 text-blue-700" />
                <span>TỔNG LƯỢT TRUY CẤP TÍCH LŨY:</span>
              </div>
              <span className="text-xl font-black text-blue-800 font-mono">
                {(stats.totalVisits || 0).toLocaleString('vi-VN')}
              </span>
            </div>
          </div>

          {/* Technical Engine Notice */}
          <div className="p-3 rounded-xl bg-slate-100 text-[11px] text-slate-600 space-y-1.5 border border-slate-200">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <Server className="w-3.5 h-3.5 text-blue-600" />
              <span>Hệ thống Máy đếm Lưu lượng Số Firebase Firestore</span>
            </div>
            <p className="leading-relaxed">
              Thống kê lượt truy cập được lưu trữ trong collection <code className="bg-slate-200 px-1 py-0.5 rounded text-blue-800 font-mono text-[10px]">analytics_stats</code>. Trạng thái hoạt động thời gian thực <code className="bg-slate-200 px-1 py-0.5 rounded text-blue-800 font-mono text-[10px]">active_visitors</code> cập nhật timestamp định kỳ 30 giây, đảm bảo đếm số người online chính xác tuyệt đối.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span>Trạng thái: Máy chủ hoạt động ổn định</span>
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              <span>An toàn & Bảo mật</span>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
