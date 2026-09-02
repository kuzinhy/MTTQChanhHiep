import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, ExternalLink, ShieldCheck, Globe, Zap, Users, Activity, Scale, Info, BarChart2 } from 'lucide-react';
import { VisitorTrackerEngine, VisitorStats } from '../lib/visitorTracker';
import { VisitorStatsModal } from './VisitorStatsModal';

export const Footer: React.FC<{
  onSelectTab?: (tab: string) => void;
}> = ({ onSelectTab }) => {
  const [onlineCount, setOnlineCount] = useState<number>(() => VisitorTrackerEngine.getOnlineCount());
  const [stats, setStats] = useState<VisitorStats>(() => VisitorTrackerEngine.getStats());
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  useEffect(() => {
    VisitorTrackerEngine.init();

    const unsubscribeOnline = VisitorTrackerEngine.subscribeOnlineCount((count) => {
      setOnlineCount(count);
    });

    const unsubscribeStats = VisitorTrackerEngine.subscribeStats((newStats) => {
      setStats(newStats);
    });

    return () => {
      unsubscribeOnline();
      unsubscribeStats();
    };
  }, []);

  return (
    <footer className="bg-gradient-to-br from-blue-800 via-indigo-700 to-blue-900 text-white relative overflow-hidden text-xs border-t border-blue-500/40 shadow-xl">
      {/* Top Blue-Cyan Accent Line */}
      <div className="h-[4px] w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 relative z-10">
        
        {/* Col 1: Agency Title */}
        <div className="space-y-3.5 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shrink-0 shadow-md border-2 border-amber-400">
              <img
                src="https://www.mattrancantho.vn/files/images/Logo%20-%20Icon/Logo%20MTTQ.png"
                alt="Logo MTTQ"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-black text-cyan-300 uppercase tracking-wide text-xs">
                ỦY BAN MTTQ VIỆT NAM
              </h3>
              <p className="text-white font-black text-xs">PHƯỜNG CHÁNH HIỆP - CỔNG THÔNG TIN ĐIỆN TỬ VÀ VĂN PHÒNG SỐ</p>
            </div>
          </div>
          <p className="text-blue-100/90 leading-relaxed text-[11px] font-medium">
            Cổng thông tin điện tử &amp; Hệ thống Văn phòng số phục vụ công tác chỉ đạo, tuyên truyền, tiếp nhận ý kiến dân sinh và điều hành công việc.
          </p>
        </div>

        {/* Col 2: Contact Info */}
        <div className="space-y-2.5">
          <h4 className="font-black text-cyan-300 uppercase text-[11px] tracking-wider border-b border-blue-800 pb-1.5 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Thông tin liên hệ &amp; Đường dây nóng</span>
          </h4>
          <div className="space-y-2 text-blue-100">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
              <span>Số 1240, đường Đại Lộ Bình Dương, khu phố Định Hòa 5, phường Chánh Hiệp, Thành phố Hồ Chí Minh</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-300 shrink-0" />
              <span>Hotline Văn phòng: <strong>0989614614</strong> (Đồng chí Nguyễn Xuân Kiều)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-300 shrink-0" />
              <span>mttqvietnamphuongchanhhiep@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Col 3: Quick Links */}
        <div className="space-y-2.5">
          <h4 className="font-black text-cyan-300 uppercase text-[11px] tracking-wider border-b border-blue-800 pb-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-cyan-300" />
            <span>Chuyên mục &amp; Liên kết</span>
          </h4>
          <ul className="space-y-2 text-blue-100">
            <li>
              <button 
                onClick={() => onSelectTab && onSelectTab('about')}
                className="hover:text-cyan-300 flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>Giới thiệu Cơ cấu tổ chức MTTQ</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectTab && onSelectTab('supervision')}
                className="hover:text-cyan-300 flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-cyan-400" />
                <span>Giám sát &amp; Phản biện xã hội</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectTab && onSelectTab('organizations')}
                className="hover:text-cyan-300 flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Các Tổ chức Thành viên</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectTab && onSelectTab('privacy')}
                className="hover:text-cyan-300 flex items-center gap-1.5 transition-colors font-medium cursor-pointer text-cyan-200"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>Chính sách Bảo vệ Dữ liệu (NĐ 13/2023)</span>
              </button>
            </li>
            <li>
              <a href="https://mattran.org.vn" target="_blank" rel="noreferrer" className="hover:text-cyan-300 flex items-center gap-1.5 transition-colors font-medium">
                <span>Ủy ban TW MTTQ Việt Nam</span>
                <ExternalLink className="w-3 h-3 text-cyan-300" />
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Digital Commitment & Visitor Counter Badge */}
        <div className="space-y-3">
          <h4 className="font-black text-cyan-300 uppercase text-[11px] tracking-wider border-b border-blue-800 pb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
            <span>An sinh &amp; Dân chủ số</span>
          </h4>
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-[11px] text-blue-50 space-y-1.5 shadow-sm">
            <div className="flex items-center gap-1.5 font-extrabold text-cyan-300">
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
              <span>CÔNG KHAI - DÂN CHỦ - MINH BẠCH</span>
            </div>
            <p className="text-blue-100 leading-relaxed font-medium">
              Ứng dụng công nghệ số hóa phục vụ nhân dân, tiếp nhận góp ý xây dựng Đảng và chính quyền vững mạnh.
            </p>
          </div>

          <button
            onClick={() => setIsStatsModalOpen(true)}
            title="Bấm để xem báo cáo thống kê lưu lượng chi tiết"
            className="w-full group flex flex-col sm:flex-row items-center justify-between gap-2 p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-cyan-400/50 text-[10px] text-blue-100 shadow-sm transition-all cursor-pointer text-left"
          >
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Trực tuyến: <strong className="text-white font-black text-xs">{onlineCount}</strong></span>
            </span>
            <span className="font-semibold flex items-center gap-1 group-hover:text-cyan-300 transition-colors">
              <Activity className="w-3 h-3 text-cyan-300" />
              <span>Lượt truy cập: <strong className="text-cyan-300 font-black text-xs">{stats.totalVisits.toLocaleString('vi-VN')}</strong></span>
              <BarChart2 className="w-3 h-3 text-cyan-400 opacity-75 group-hover:opacity-100 ml-0.5" />
            </span>
          </button>
        </div>

      </div>

      <div className="bg-slate-950 py-3.5 px-4 border-t border-blue-900 text-center text-[11px] text-blue-200 font-semibold">
        &copy; 2026 Bản quyền thuộc về Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp, Thành phố Hồ Chí Minh.
      </div>

      {/* Visitor Analytics Modal */}
      <VisitorStatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        onlineCount={onlineCount}
        stats={stats}
      />
    </footer>
  );
};

