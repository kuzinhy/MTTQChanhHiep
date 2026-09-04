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
  Users,
  Scale,
  ClipboardList,
  Info,
  Star,
  Bell,
  Phone,
  Lightbulb,
  MapPin
} from 'lucide-react';
import { motion } from 'motion/react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLoginModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isStaffLoggedIn: boolean;
  onGoToOffice: () => void;
  onOpenNotificationCenter?: () => void;
  onOpenDigitalDirectory?: () => void;
  onOpenVolunteerModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenLoginModal,
  searchQuery,
  setSearchQuery,
  isStaffLoggedIn,
  onGoToOffice,
  onOpenNotificationCenter,
  onOpenDigitalDirectory,
  onOpenVolunteerModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'map', label: 'Bản đồ số', icon: MapPin },
    { id: 'about', label: 'Giới thiệu', icon: Info },
    { id: 'organizations', label: 'Tổ chức thành viên', icon: Users },
    { id: 'news', label: 'Tin tức - Sự kiện', icon: BookOpen },
    { id: 'supervision', label: 'Giám sát & Phản biện', icon: Scale },
    { id: 'initiatives', label: 'Mô hình hay', icon: Lightbulb },
    { id: 'surveys', label: 'Khảo sát ý kiến', icon: ClipboardList },
    { id: 'opinion', label: 'Góp ý dân nguyện', icon: MessageSquareHeart },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner Header - Zalo Electric Blue Tech Government Branding */}
      <div className="bg-gradient-to-r from-[#0052cc] via-[#0068ff] to-[#0088ff] text-white px-4 py-2.5 border-b border-blue-400/30 relative overflow-hidden shadow-sm">
        {/* Subtle Blue/Cyan Ambient Glow */}
        <div className="absolute -top-10 -left-10 w-44 h-44 bg-cyan-300/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 right-1/4 w-44 h-44 bg-sky-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 relative z-10">
          
          {/* Logo & Agency Title */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
            <div className="w-11 h-11 rounded-2xl bg-white p-1 flex items-center justify-center shrink-0 shadow-md border-2 border-amber-400 transition-all duration-300 group-hover:scale-105">
              <img
                src="https://www.mattrancantho.vn/files/images/Logo%20-%20Icon/Logo%20MTTQ.png"
                alt="Logo Ủy ban Mặt trận Tổ quốc Việt Nam"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xs sm:text-sm font-black tracking-tight uppercase leading-tight text-white drop-shadow-xs">
                  ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#f5a623] text-slate-950 shadow-xs">
                  <Star className="w-2.5 h-2.5 fill-slate-950" /> SỐ HÓA 4.0
                </span>
              </div>
              <p className="text-[11px] text-blue-100 font-bold hidden sm:block tracking-wide">
                THÀNH PHỐ HỒ CHÍ MINH
              </p>
            </div>
          </div>

          {/* Quick Search & Actions */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Notification Bell */}
            <button
              onClick={onOpenNotificationCenter}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white relative transition cursor-pointer border border-white/20"
              title="Trung tâm Thông báo"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white animate-pulse" />
            </button>


            {/* Volunteer Signup */}
            <button
              onClick={onOpenVolunteerModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-slate-950" />
              <span>Đăng ký TNV</span>
            </button>

            {/* Quick Search */}
            <div className="relative flex-1 md:w-48">
              <input
                type="text"
                placeholder="Tìm tin tức, văn bản..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-blue-900/60 border border-blue-400/40 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:bg-blue-950 focus:border-cyan-300 transition-all font-medium"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-blue-200" />
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
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/80 hover:bg-blue-800 text-blue-100 border border-blue-400/30 font-bold text-xs rounded-xl shadow-2xs shrink-0 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-300" />
                <span>Cán bộ</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-11">
            <nav className="hidden lg:flex items-center justify-between w-full gap-0.5 xl:gap-1 py-0.5 overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex items-center justify-center gap-1 xl:gap-1.5 px-2 xl:px-2.5 py-1.5 text-[11px] xl:text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center justify-between w-full py-1">
              <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{navItems.find((n) => n.id === activeTab)?.label || 'Trang chủ'}</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-3 border-t border-slate-200 space-y-1 animate-fadeIn">
              <div className="flex items-center gap-2 px-2 pb-2 border-b border-slate-100">
                <button
                  onClick={() => { onOpenDigitalDirectory?.(); setMobileMenuOpen(false); }}
                  className="flex-1 py-2 bg-blue-50 text-blue-800 text-xs font-bold rounded-xl border border-blue-200 text-center"
                >
                  Danh bạ số
                </button>
                <button
                  onClick={() => { onOpenVolunteerModal?.(); setMobileMenuOpen(false); }}
                  className="flex-1 py-2 bg-amber-400 text-slate-950 text-xs font-black rounded-xl text-center"
                >
                  Đăng ký TNV
                </button>
              </div>
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
                      isActive ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
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


