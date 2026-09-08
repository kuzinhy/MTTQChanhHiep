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
  MapPin,
  Clock,
  Landmark
} from 'lucide-react';
import { motion } from 'motion/react';
import { PWAInstallButton } from './PWAInstallButton';
import { OptimizedImage } from './common/OptimizedImage';

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
  onOpenHcmSpaceModal?: () => void;
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
  onOpenVolunteerModal,
  onOpenHcmSpaceModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'map', label: 'Bản đồ số', icon: MapPin },
    { id: 'about', label: 'Giới thiệu', icon: Info },
    { id: 'organizations', label: 'Tổ chức thành viên', icon: Users },
    { id: 'news', label: 'Tin tức - Sự kiện', icon: BookOpen },
    { id: 'supervision', label: 'Giám sát & Phản biện', icon: Scale },
    { id: 'initiatives', label: 'Mô hình tiêu biểu', icon: Lightbulb },
    { id: 'surveys', label: 'Khảo sát ý kiến', icon: ClipboardList },
    { id: 'opinion', label: 'Góp ý dân nguyện', icon: MessageSquareHeart },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner Header - Zalo Electric Blue Tech Government Branding */}
      <div className="bg-gradient-to-r from-[#0052cc] via-[#0068ff] to-[#0088ff] text-white px-3 sm:px-4 py-1.5 sm:py-2 border-b border-blue-400/30 relative overflow-hidden shadow-sm">
        {/* Subtle Blue/Cyan Ambient Glow */}
        <div className="absolute -top-10 -left-10 w-44 h-44 bg-cyan-300/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 right-1/4 w-44 h-44 bg-sky-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3 relative z-10 flex-wrap md:flex-nowrap">
          
          {/* Logo & Agency Title */}
          <div className="flex items-center gap-2.5 cursor-pointer group shrink-0" onClick={() => setActiveTab('home')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-xs border-2 border-amber-400 transition-all duration-300 group-hover:scale-105">
              <OptimizedImage
                src="/assets/logos/logo-mttq.svg"
                alt="Logo Ủy ban Mặt trận Tổ quốc Việt Nam"
                variant="thumbnail"
                priority={true}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 shrink-0">
              <div className="flex items-center gap-1.5 flex-nowrap whitespace-nowrap">
                <h1 className="text-[11px] sm:text-xs md:text-sm font-black tracking-tight uppercase leading-tight text-white drop-shadow-xs whitespace-nowrap inline-block shrink-0">
                  ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG&nbsp;CHÁNH&nbsp;HIỆP
                </h1>
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md bg-[#f5a623] text-slate-950 shadow-2xs whitespace-nowrap shrink-0">
                  <Star className="w-2.5 h-2.5 fill-slate-950 shrink-0" /> SỐ HÓA 4.0
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-nowrap whitespace-nowrap">
                <p className="text-[10px] sm:text-[11px] text-blue-100 font-bold tracking-wide whitespace-nowrap shrink-0">
                  THÀNH PHỐ HỒ CHÍ MINH
                </p>
                <span className="text-blue-300 hidden sm:inline shrink-0">•</span>
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-blue-100 font-semibold whitespace-nowrap shrink-0">
                  <Clock className="w-3 h-3 text-cyan-200 shrink-0" />
                  <span className="capitalize whitespace-nowrap">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Search & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full md:w-auto justify-end flex-nowrap shrink-0">
            {/* Quick Search */}
            <div className="relative flex-1 md:w-48 shrink-0">
              <input
                type="text"
                placeholder="Tìm tin tức, văn bản..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-7 pr-2.5 py-1.5 bg-blue-900/70 border border-blue-400/40 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:bg-blue-950 focus:border-cyan-300 transition-all font-medium"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-blue-200" />
            </div>

            {/* Không gian VH Hồ Chí Minh Quick Button */}
            <button
              onClick={onOpenHcmSpaceModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs rounded-xl shadow-xs border border-amber-300/40 transition-all active:scale-95 shrink-0 cursor-pointer whitespace-nowrap"
              title="Khám phá Không gian Văn hóa Hồ Chí Minh 3D"
            >
              <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse shrink-0" />
              <span className="whitespace-nowrap">Không gian VH Hồ Chí Minh</span>
            </button>

            {/* Volunteer Signup */}
            <button
              onClick={onOpenVolunteerModal}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-2xs transition-all active:scale-95 shrink-0 cursor-pointer whitespace-nowrap"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span className="whitespace-nowrap">Đăng ký TNV</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotificationCenter}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white relative transition cursor-pointer border border-white/20 shrink-0"
              title="Trung tâm Thông báo"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full border border-white animate-pulse" />
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton />
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-12">
            <nav className="hidden lg:flex items-center justify-between w-full gap-1 py-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs font-black'
                        : 'text-slate-700 hover:bg-blue-50/90 hover:text-blue-700 font-bold'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center justify-between w-full py-1">
              <span className="text-xs font-black text-blue-900 flex items-center gap-1.5 whitespace-nowrap truncate min-w-0">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                <span className="whitespace-nowrap truncate">{navItems.find((n) => n.id === activeTab)?.label || 'Trang chủ'}</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-3 border-t border-slate-200 space-y-1.5 animate-fadeIn">
              <div className="flex items-center gap-2 px-1 pb-2 border-b border-slate-100">
                <button
                  onClick={() => { onOpenDigitalDirectory?.(); setMobileMenuOpen(false); }}
                  className="flex-1 py-2.5 bg-blue-50 text-blue-800 text-xs font-bold rounded-xl border border-blue-200 text-center"
                >
                  Danh bạ số
                </button>
                <button
                  onClick={() => { onOpenVolunteerModal?.(); setMobileMenuOpen(false); }}
                  className="flex-1 py-2.5 bg-amber-400 text-slate-950 text-xs font-black rounded-xl text-center"
                >
                  Đăng ký TNV
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
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
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs font-black'
                          : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


