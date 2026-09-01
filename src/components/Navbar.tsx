import React, { useState } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  FileText, 
  Award, 
  MessageSquareHeart, 
  Home, 
  BookOpen, 
  ShieldCheck,
  LogIn,
  HeartHandshake,
  Gift,
  Star
} from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLoginModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isStaffLoggedIn: boolean;
  onGoToOffice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenLoginModal,
  searchQuery,
  setSearchQuery,
  isStaffLoggedIn,
  onGoToOffice
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'news', label: 'Tin tức địa phương', icon: BookOpen },
    { id: 'documents', label: 'Văn bản - Chính sách', icon: FileText },
    { id: 'competitions', label: 'Hội thi trực tuyến', icon: Award },
    { id: 'opinion', label: 'Gửi ý kiến & Phản ánh', icon: MessageSquareHeart },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner Header - Flat Blue Blur & Light Blue Styling */}
      <div className="bg-white/95 backdrop-blur-md text-slate-900 px-4 py-2.5 border-b border-slate-200/80 relative overflow-hidden">
        {/* Subtle Light Blue Glow */}
        <div className="absolute -top-10 -left-10 w-44 h-44 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 right-1/4 w-44 h-44 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 relative z-10">
          
          {/* Logo & Agency Title */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
            <div className="w-11 h-11 rounded-2xl bg-white p-1 flex items-center justify-center shrink-0 shadow-md shadow-slate-300/50 border border-amber-400 transition-all duration-300 group-hover:scale-105">
              <img
                src="https://www.mattrancantho.vn/files/images/Logo%20-%20Icon/Logo%20MTTQ.png"
                alt="Logo Ủy ban Mặt trận Tổ quốc Việt Nam"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 style={{ color: '#f2a41d' }} className="text-xs sm:text-sm font-black tracking-tight uppercase leading-tight drop-shadow-xs">
                  ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP
                </h1>
                <span className="hidden xl:inline-flex items-center gap-1 text-[9.5px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
                  <Star className="w-2.5 h-2.5 text-blue-600 fill-blue-600" /> CỔNG THÔNG TIN ĐIỆN TỬ
                </span>
              </div>
              <p className="text-[11px] text-blue-600 font-bold hidden sm:block tracking-wide">
                CỔNG THÔNG TIN ĐIỆN TỬ VÀ VĂN PHÒNG SỐ
              </p>
            </div>
          </div>

          {/* Quick Search & Actions */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
            {/* Quick Relief Registration Action Button */}
            <button
              onClick={() => setActiveTab('opinion')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-white" />
              <span>Đăng ký hỗ trợ</span>
            </button>

            {/* Quick Search */}
            <div className="relative flex-1 md:w-56">
              <input
                type="text"
                placeholder="Tìm tin tức, chính sách, trợ cấp..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-100/90 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
            </div>

            {/* Login / Digital Office Button */}
            {isStaffLoggedIn ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onGoToOffice}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs shrink-0 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-white animate-pulse" />
                <span>Văn phòng số</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 font-bold text-xs rounded-xl shadow-2xs shrink-0 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-600" />
                <span>Đăng nhập Cán bộ</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Flat Blue Blur & Clean White Canvas */}
      <div className="bg-slate-50/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <nav className="hidden lg:flex items-center gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-2 text-xs text-blue-700 font-extrabold bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              <span>Cổng Thông tin Điện tử &amp; Văn phòng Số</span>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center justify-between w-full py-1">
              <span className="text-xs font-black text-blue-700 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                <span>{navItems.find((n) => n.id === activeTab)?.label || 'Trang chủ'}</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-3 border-t border-slate-200 space-y-1.5 animate-fadeIn">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                      isActive ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


