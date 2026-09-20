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
import { CitizenAccessibilityToolbar } from './common/CitizenAccessibilityToolbar';

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
    { id: 'about', label: 'Giới thiệu', icon: Info },
    { id: 'news', label: 'Tin tức', icon: BookOpen },
    { id: 'map', label: 'Mặt trận số', icon: MapPin },
    { id: 'supervision', label: 'Giám sát – Phản biện', icon: Scale },
    { id: 'initiatives', label: 'An sinh', icon: HeartHandshake },
    { id: 'documents', label: 'Văn bản', icon: FileText },
    { id: 'opinion', label: 'Góp ý – Dân nguyện', icon: MessageSquareHeart },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Accessibility Toolbar for Citizens */}
      <CitizenAccessibilityToolbar 
        onOpenDirectory={onOpenDigitalDirectory} 
      />

      {/* Top Banner Header - City Skyline Gradient Branding */}
      <div className="bg-gradient-to-r from-[#0052cc] via-[#0068ff] to-[#007bfd] text-white px-3 sm:px-4 py-2 border-b border-blue-400/30 relative overflow-hidden shadow-sm">
        {/* Subtle City Skyline & Ambient Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-cyan-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 relative z-10">
          
          {/* Logo & Agency Title */}
          <div className="flex items-center gap-3 cursor-pointer group shrink-0" onClick={() => setActiveTab('home')}>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white p-1 flex items-center justify-center shrink-0 shadow-md border-2 border-amber-400 transition-all duration-300 group-hover:scale-105">
              <OptimizedImage
                src="https://res.cloudinary.com/idt08wyp/image/upload/v1789907080/Logo-Mat-Tran-To-Quoc-Viet-Nam.png"
                alt="Logo Ủy ban Mặt trận Tổ quốc Việt Nam"
                variant="thumbnail"
                priority={true}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm md:text-[15px] font-black tracking-tight uppercase leading-tight text-white drop-shadow-xs">
                ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP
              </h1>
              <p className="text-[11px] sm:text-xs text-amber-200 font-extrabold uppercase tracking-wide leading-tight mt-0.5">
                THÀNH PHỐ HỒ CHÍ MINH
              </p>
              <p className="text-[10px] sm:text-[11px] text-blue-100 italic font-medium leading-tight">
                Đoàn kết - Dân chủ - Đồng thuận - Phát triển
              </p>
            </div>
          </div>

          {/* Center: Search Capsule Bar */}
          <div className="hidden md:flex items-center bg-white rounded-full pl-4 pr-1.5 py-1 shadow-sm max-w-sm w-full mx-2 border border-blue-200/60">
            <input
              type="text"
              placeholder="Tìm kiếm tin tức, văn bản, thủ tục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs text-slate-800 placeholder-slate-400 bg-transparent outline-none font-medium"
            />
            <button 
              type="button"
              className="w-7 h-7 rounded-full bg-[#0068ff] hover:bg-blue-700 text-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
              title="Tìm kiếm"
            >
              <Search className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Right Actions: Notifications, Văn phòng số, Staff Profile, Red Banner */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Notification Bell */}
            <button
              onClick={onOpenNotificationCenter}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center relative transition cursor-pointer border border-white/20 shrink-0"
              title="Thông báo"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                3
              </span>
            </button>

            {/* Văn phòng số Pill Button */}
            <button
              onClick={onGoToOffice}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0052cc] hover:bg-[#0043aa] text-white font-bold text-xs rounded-full border border-blue-300/40 shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Văn phòng số</span>
            </button>

            {/* Staff User Chip */}
            <div 
              onClick={isStaffLoggedIn ? onGoToOffice : onOpenLoginModal}
              className="flex items-center gap-2 px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded-full border border-white/20 text-white cursor-pointer transition-colors shrink-0"
            >
              <div className="w-6 h-6 rounded-full bg-white text-blue-700 flex items-center justify-center text-[10px] font-black overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Avatar cán bộ"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left leading-none hidden sm:block">
                <div className="font-bold text-[11px] text-white leading-tight">
                  {isStaffLoggedIn ? 'Nguyễn Văn A' : 'Cán bộ'}
                </div>
                <div className="text-[9px] text-blue-200 font-medium leading-tight">
                  {isStaffLoggedIn ? 'Cán bộ' : 'Đăng nhập'}
                </div>
              </div>
            </div>

            {/* Red Flag Slogan Banner */}
            <div className="hidden xl:flex flex-col items-center justify-center bg-gradient-to-r from-red-600 to-rose-600 text-white px-2.5 py-1 rounded-l-xl shadow-md border-l-2 border-y-2 border-amber-300 relative text-center shrink-0">
              <div className="text-[7.5px] font-black uppercase tracking-wider text-amber-200 leading-tight">VÌ NHÂN DÂN</div>
              <div className="text-[7.5px] font-black uppercase tracking-wider text-amber-200 leading-tight">VÌ CỘNG ĐỒNG</div>
              <div className="text-[7.5px] font-black uppercase tracking-wider text-amber-200 leading-tight">VÌ CHÁNH HIỆP</div>
              <div className="text-[7.5px] font-black uppercase tracking-wider text-white leading-tight">PHÁT TRIỂN BỀN VỮNG</div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white border-b border-slate-200 shadow-2xs">
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
                    className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#0068ff] text-white shadow-xs font-black'
                        : 'text-slate-700 hover:bg-blue-50/90 hover:text-[#0068ff] font-bold'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
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


