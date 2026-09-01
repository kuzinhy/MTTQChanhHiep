import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, ExternalLink, ShieldCheck, Globe, Zap, Users, Activity } from 'lucide-react';
import { VisitorTrackerEngine, VisitorStats } from '../lib/visitorTracker';

export const Footer: React.FC = () => {
  const [onlineCount, setOnlineCount] = useState<number>(() => VisitorTrackerEngine.getOnlineCount());
  const [stats, setStats] = useState<VisitorStats>(() => VisitorTrackerEngine.getStats());

  useEffect(() => {
    // Khởi tạo theo dõi thực
    VisitorTrackerEngine.init();

    // Lắng nghe biến động số người trực tuyến thời gian thực
    const unsubscribeOnline = VisitorTrackerEngine.subscribeOnlineCount((count) => {
      setOnlineCount(count);
    });

    // Lắng nghe biến động tổng lượt truy cập thực tế
    const unsubscribeStats = VisitorTrackerEngine.subscribeStats((newStats) => {
      setStats(newStats);
    });

    return () => {
      unsubscribeOnline();
      unsubscribeStats();
    };
  }, []);
  return (
    <footer className="bg-gradient-to-br from-blue-800 via-indigo-800 to-blue-900 text-white relative overflow-hidden text-xs border-t border-blue-600 shadow-xl">
      {/* Top Gold & Blue Accent Line */}
      <div className="h-[4px] w-full bg-gradient-to-r from-amber-400 via-sky-300 to-amber-400" />

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 relative z-10">
        
        {/* Col 1: Agency Title */}
        <div className="space-y-3.5 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shrink-0 shadow-md border border-white/40">
              <img
                src="https://www.mattrancantho.vn/files/images/Logo%20-%20Icon/Logo%20MTTQ.png"
                alt="Logo MTTQ"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-black text-white uppercase tracking-wide text-xs">
                ỦY BAN MTTQ VIỆT NAM
              </h3>
              <p className="text-amber-300 font-black text-xs">PHƯỜNG CHÁNH HIỆP - CỔNG THÔNG TIN ĐIỆN TỬ VÀ VĂN PHÒNG SỐ</p>
            </div>
          </div>
          <p className="text-blue-100/90 leading-relaxed text-[11px] font-medium">
            Cổng thông tin điện tử &amp; Hệ thống Văn phòng số phục vụ công tác chỉ đạo, tuyên truyền, tiếp nhận ý kiến dân sinh và điều hành công việc.
          </p>
        </div>

        {/* Col 2: Contact Info */}
        <div className="space-y-2.5">
          <h4 className="font-black text-amber-300 uppercase text-[11px] tracking-wider border-b border-blue-600/80 pb-1.5 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Thông tin liên hệ &amp; Đường dây nóng</span>
          </h4>
          <div className="space-y-2 text-blue-100">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span>Số 1240, đường Đại Lộ Bình Dương, khu phố Định Hòa 5, phường Chánh Hiệp, Thành phố Hồ Chí Minh</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Hotline Văn phòng: <strong>0989614614</strong> (Đồng chí Nguyễn Xuân Kiều)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-300 shrink-0" />
              <span>mttqvietnamphuongchanhhiep@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Col 3: Quick Links */}
        <div className="space-y-2.5">
          <h4 className="font-black text-amber-300 uppercase text-[11px] tracking-wider border-b border-blue-600/80 pb-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span>Liên kết nhanh</span>
          </h4>
          <ul className="space-y-2 text-blue-100">
            <li>
              <a href="https://mattran.org.vn" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1.5 transition-colors font-medium">
                <span>Ủy ban TW MTTQ Việt Nam</span>
                <ExternalLink className="w-3 h-3 text-blue-300" />
              </a>
            </li>
            <li>
              <a href="https://dichvucong.gov.vn" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1.5 transition-colors font-medium">
                <span>Cổng Dịch vụ công Quốc gia</span>
                <ExternalLink className="w-3 h-3 text-blue-300" />
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Digital Commitment & Visitor Counter Badge */}
        <div className="space-y-3">
          <h4 className="font-black text-amber-300 uppercase text-[11px] tracking-wider border-b border-blue-600/80 pb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>An sinh &amp; Số hóa Mặt trận</span>
          </h4>
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-[11px] text-blue-50 space-y-1.5 shadow-sm">
            <div className="flex items-center gap-1.5 font-extrabold text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>CÔNG KHAI - MINH BẠCH - AN TOÀN</span>
            </div>
            <p className="text-blue-100 leading-relaxed font-medium">
              Ứng dụng công nghệ số hóa chăm lo an sinh xã hội, hỗ trợ khẩn cấp, tiếp nhận quỹ vì người nghèo công khai, minh bạch.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-[10px] text-blue-100 shadow-sm">
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Trực tuyến: <strong className="text-white font-black text-xs">{onlineCount}</strong></span>
            </span>
            <span className="font-semibold flex items-center gap-1">
              <Activity className="w-3 h-3 text-amber-300" />
              <span>Lượt truy cập: <strong className="text-amber-300 font-black text-xs">{stats.totalVisits.toLocaleString('vi-VN')}</strong></span>
              <span className="text-[9px] text-blue-200 ml-1">(Hôm nay: <strong className="text-white">{stats.todayVisits.toLocaleString('vi-VN')}</strong>)</span>
            </span>
          </div>
        </div>

      </div>

      <div className="bg-blue-950/70 py-3.5 px-4 border-t border-blue-700/60 text-center text-[11px] text-blue-200 font-semibold">
        &copy; 2026 Bản quyền thuộc về Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp, TP. Hồ Chí Minh.
      </div>
    </footer>
  );
};

