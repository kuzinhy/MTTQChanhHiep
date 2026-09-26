import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Globe, 
  ShieldCheck, 
  HeartHandshake, 
  FileText, 
  MessageSquareHeart, 
  BookOpen, 
  Users, 
  BarChart3, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
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

  const handleNav = (tabId: string) => {
    if (onSelectTab) {
      onSelectTab(tabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white relative overflow-hidden text-xs border-t border-blue-500/40 shadow-2xl">
      {/* Top Blue-Cyan Accent Line */}
      <div className="h-[4px] w-full bg-gradient-to-r from-amber-400 via-red-500 to-blue-500" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Agency Brand & Mission */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white p-1 shrink-0 shadow-md border-2 border-amber-400">
                <img
                  src="https://res.cloudinary.com/idt08wyp/image/upload/v1789907080/Logo-Mat-Tran-To-Quoc-Viet-Nam.png"
                  alt="Logo Ủy ban Mặt trận Tổ quốc Việt Nam"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-amber-300 leading-tight">
                  ỦY BAN MTTQ VIỆT NAM
                </h3>
                <h4 className="text-[13px] font-black uppercase text-white leading-tight">
                  PHƯỜNG CHÁNH HIỆP
                </h4>
                <p className="text-[10px] text-blue-300 font-bold uppercase">
                  THÀNH PHỐ HỒ CHÍ MINH
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              Cổng thông tin & Văn phòng số phục vụ chuyển đổi số toàn diện công tác Mặt trận, kết nối 21 khu phố, tiếp nhận dân nguyện và chăm lo an sinh xã hội.
            </p>

            <div className="pt-1 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-[10px] font-bold text-blue-200">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Hệ thống số hóa chính thức
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-700/60 text-[10px] font-bold text-amber-300">
                <Sparkles className="w-3 h-3 text-amber-400" />
                21 Khu phố số
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5 border-b border-blue-800/80 pb-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              Chuyên mục chính
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button 
                  onClick={() => handleNav('home')} 
                  className="text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Trang chủ & Cổng thông tin Mặt trận
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('about')} 
                  className="text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Giới thiệu & Cơ cấu tổ chức Thường trực
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('news')} 
                  className="text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Tin tức & Hoạt động phong trào
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('map')} 
                  className="text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Bản đồ số 21 Ban Công tác Mặt trận
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('supervision')} 
                  className="text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Giám sát – Phản biện xã hội & Thanh tra ND
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('initiatives')} 
                  className="text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Chăm lo An sinh & Quỹ Vì Người Nghèo
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Dân nguyện & Tiện ích phục vụ nhân dân */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5 border-b border-blue-800/80 pb-2">
              <MessageSquareHeart className="w-3.5 h-3.5 text-amber-400" />
              Tiện ích Dân nguyện & An sinh
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button 
                  onClick={() => handleNav('opinion')} 
                  className="text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Gửi ý kiến, phản ánh dân nguyện trực tuyến
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('documents')} 
                  className="text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Tra cứu văn bản chỉ đạo & Nghị quyết
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('surveys')} 
                  className="text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Khảo sát lấy ý kiến sự hài lòng của nhân dân
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('privacy')} 
                  className="text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Chính sách bảo mật & Quyền riêng tư công dân
                </button>
              </li>
            </ul>

            {/* Quick Live Stats Trigger */}
            <div className="pt-2">
              <button
                onClick={() => setIsStatsModalOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-900/40 hover:bg-blue-800/50 border border-blue-700/50 transition-all cursor-pointer text-left group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-[10px] text-blue-200 font-bold">Đang trực tuyến:</span>
                  <span className="text-xs font-black text-amber-300">{onlineCount}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-blue-300 group-hover:text-amber-300 font-semibold">
                  <BarChart3 className="w-3 h-3" />
                  <span>Chi tiết</span>
                </div>
              </button>
            </div>
          </div>

          {/* Column 4: Liên hệ cơ quan & Trực hành chính */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5 border-b border-blue-800/80 pb-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Thông tin liên hệ chính thức
            </h4>
            <div className="space-y-2.5 text-[11px] text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <span>Trụ sở UBND - MTTQ Phường Chánh Hiệp, TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Hotline Dân nguyện: <strong className="text-white">(028) 38.xxx.xxx</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Email: <strong className="text-white">mttq.chanhhiep@tphcm.gov.vn</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">Giờ làm việc hành chính:</div>
                  <div className="text-[10px] text-slate-400">Thứ 2 – Thứ 6: 07:30 - 11:30 | 13:00 - 17:00</div>
                  <div className="text-[10px] text-slate-400">Tiếp nhận ý kiến trực tuyến: 24/7</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-slate-950 py-3.5 px-6 border-t border-blue-900/60 text-center sm:text-left text-[11px] text-slate-400 font-medium max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          &copy; 2026 Bản quyền thuộc về <strong className="text-slate-200">Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp</strong>, Thành phố Hồ Chí Minh.
        </div>
        <div className="flex items-center gap-4 text-[10px] text-slate-400">
          <button onClick={() => handleNav('privacy')} className="hover:text-amber-300 transition cursor-pointer">Chính sách bảo mật</button>
          <span>•</span>
          <button onClick={() => handleNav('opinion')} className="hover:text-amber-300 transition cursor-pointer">Dân nguyện 24/7</button>
          <span>•</span>
          <button onClick={() => setIsStatsModalOpen(true)} className="hover:text-amber-300 transition cursor-pointer flex items-center gap-1">
            <BarChart3 className="w-3 h-3 text-cyan-400" />
            Lượt truy cập: {stats.totalVisits.toLocaleString('vi-VN')}
          </button>
        </div>
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


