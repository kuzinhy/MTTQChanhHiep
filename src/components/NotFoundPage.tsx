import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  Award, 
  MessageSquareHeart, 
  ShieldCheck, 
  Phone, 
  Mail, 
  AlertTriangle, 
  Compass, 
  RefreshCw,
  Building2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';

interface NotFoundPageProps {
  attemptedPath?: string;
  errorMessage?: string;
  onGoHome: () => void;
  onNavigateTab: (tab: string) => void;
  onSearch?: (query: string) => void;
  onGoToOffice?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  attemptedPath,
  errorMessage,
  onGoHome,
  onNavigateTab,
  onSearch,
  onGoToOffice
}) => {
  const [localSearch, setLocalSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      if (onSearch) {
        onSearch(localSearch.trim());
      }
      onNavigateTab('news');
    }
  };

  const quickLinks = [
    { id: 'home', label: 'Trang chủ Cổng TT', desc: 'Trở về trang chính Cổng thông tin Mặt trận', icon: Home, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
    { id: 'news', label: 'Tin tức & Tuyên truyền', desc: 'Xem bài viết, phóng sự, hoạt động các khu phố', icon: BookOpen, color: 'text-amber-600 bg-amber-50 hover:bg-amber-100' },
    { id: 'documents', label: 'Văn bản & Chỉ đạo', desc: 'Tra cứu kế hoạch, thông tri, nghị quyết', icon: FileText, color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' },
    { id: 'supervision', label: 'Giám sát & Phản biện', desc: 'Ban TTND & Giám sát đầu tư cộng đồng', icon: ShieldCheck, color: 'text-purple-600 bg-purple-50 hover:bg-purple-100' },
    { id: 'competitions', label: 'Hội thi Trực tuyến', desc: 'Thi trắc nghiệm, tìm hiểu pháp luật & Nghị quyết', icon: Award, color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' },
    { id: 'opinion', label: 'Góp ý Dân nguyện', desc: 'Gửi kiến nghị dân sinh, phản ánh khu phố', icon: MessageSquareHeart, color: 'text-rose-600 bg-rose-50 hover:bg-rose-100' },
  ];

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-slate-50 via-white to-blue-50/40 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full space-y-8">
        {/* Top Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl" />

            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 border border-white/25 text-amber-300 text-xs font-black tracking-widest uppercase shadow-xs">
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                <span>MÃ LỖI ĐIỀU HƯỚNG 404 - KHÔNG TÌM THẤY TRANG</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-xs">
                Nội dung Yêu cầu Không Tồn tại
              </h1>

              <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed font-medium">
                {errorMessage || 'Địa chỉ liên kết bạn đang truy cập có thể đã được cập nhật số hóa, thay đổi mã định danh hoặc tạm thời không khả dụng.'}
              </p>

              {attemptedPath && (
                <div className="inline-block mt-2 px-3 py-1 rounded-lg bg-blue-950/60 border border-blue-400/30 text-cyan-200 font-mono text-[11px]">
                  Đường dẫn: <strong>{attemptedPath}</strong>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Search Box */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Tìm kiếm nội dung bạn đang cần trên Cổng thông tin:
              </label>
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Nhập từ khóa bài viết, số hiệu văn bản, tên hội thi..."
                    className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 shrink-0 cursor-pointer"
                >
                  Tìm kiếm
                </button>
              </form>
            </div>

            {/* Quick Links Grid */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Các Chuyên mục Chính thường dùng:</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigateTab(item.id)}
                      className={`p-3.5 rounded-2xl border border-slate-200/80 transition-all flex items-start gap-3 text-left cursor-pointer group hover:shadow-md hover:border-blue-300 bg-slate-50/60 hover:bg-white`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${item.color} transition-colors group-hover:scale-105`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-slate-900 group-hover:text-blue-700 flex items-center justify-between">
                          <span>{item.label}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => window.history.length > 1 ? window.history.back() : onGoHome()}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-600" />
                  <span>Quay lại trang trước</span>
                </button>

                <button
                  onClick={onGoHome}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Home className="w-4 h-4 text-white" />
                  <span>Về Trang chủ</span>
                </button>
              </div>

              {onGoToOffice && (
                <button
                  onClick={onGoToOffice}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>Văn phòng số (Cán bộ)</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Agency Contact Footer Info */}
        <div className="text-center space-y-2 text-xs text-slate-500">
          <p className="font-semibold text-slate-700">
            ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>Đường dây nóng: <strong>0989614614</strong> (Đ/c Nguyễn Xuân Kiều)</span>
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>mttqvietnamphuongchanhhiep@gmail.com</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
