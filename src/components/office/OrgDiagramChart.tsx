import React, { useState, useRef } from 'react';
import { 
  MemberOrganization, 
  Area 
} from '../../types';
import { 
  Users, 
  User, 
  Building2, 
  Sparkles, 
  ChevronRight, 
  Edit3, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Printer, 
  Download, 
  CheckCircle2, 
  HeartHandshake, 
  Award, 
  Layers, 
  MapPin, 
  X
} from 'lucide-react';

interface OrgDiagramChartProps {
  organizations: MemberOrganization[];
  areas: Area[];
  onOpenEditModal: (org: MemberOrganization) => void;
  onShowToast?: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

interface PillarConfig {
  id: string;
  name: string;
  shortName: string;
  colorScheme: {
    primary: string;
    border: string;
    bgHeader: string;
    bgLight: string;
    badgeBg: string;
    badgeText: string;
    accentGlow: string;
  };
  motto: string;
  baseBranches: {
    title: string;
    subtext?: string;
  }[];
  logoBadge: React.ReactNode;
}

export const OrgDiagramChart: React.FC<OrgDiagramChartProps> = ({
  organizations,
  areas,
  onOpenEditModal,
  onShowToast
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedPillarOrg, setSelectedPillarOrg] = useState<MemberOrganization | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const mttqOrg = organizations.find(o => o.id === 'org-mttq' || o.code === 'MTTQ-CH') || organizations[0];

  // 6 Pillar organizations configurations matching the requested diagram exactly
  const pillars: PillarConfig[] = [
    {
      id: 'org-dtn',
      name: 'ĐOÀN TNCS HỒ CHÍ MINH',
      shortName: 'Đoàn TNCS Hồ Chí Minh',
      colorScheme: {
        primary: '#D97706',
        border: 'border-amber-400',
        bgHeader: 'bg-gradient-to-r from-amber-500 to-amber-600',
        bgLight: 'bg-amber-50/70',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-800',
        accentGlow: 'shadow-amber-500/20'
      },
      motto: 'Đoàn kết, tập hợp thanh niên, xung kích, sáng tạo, phát triển quê hương, đất nước.',
      baseBranches: [
        { title: 'Chi đoàn khu phố', subtext: '21 Chi đoàn trực thuộc 21 Khu phố' },
        { title: 'Chi đoàn trường học', subtext: 'Các trường THCS & Tiểu học' },
        { title: 'Chi đoàn cơ quan, doanh nghiệp', subtext: 'Khối cơ quan UBND & Doanh nghiệp' }
      ],
      logoBadge: (
        <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center p-1 shadow-md border-2 border-white">
          <img 
            src="https://sv2.anhsieuviet.com/2026/09/02/8758f2ac-9342-47db-8f7f-7a3bcd434c32b7535a4487543751.png"
            alt="Huy hiệu Đoàn"
            className="w-full h-full object-contain rounded-full"
            onError={(e) => {
              // Fallback SVG icon if URL fails
              e.currentTarget.style.display = 'none';
            }}
          />
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      )
    },
    {
      id: 'org-lhtn',
      name: 'HỘI LIÊN HIỆP THANH NIÊN VIỆT NAM',
      shortName: 'Hội LHTN Việt Nam',
      colorScheme: {
        primary: '#0284C7',
        border: 'border-sky-400',
        bgHeader: 'bg-gradient-to-r from-sky-600 to-cyan-700',
        bgLight: 'bg-sky-50/70',
        badgeBg: 'bg-sky-100',
        badgeText: 'text-sky-800',
        accentGlow: 'shadow-sky-500/20'
      },
      motto: 'Đoàn kết, tập hợp thanh niên, xây dựng lối sống đẹp, phát triển kinh tế - xã hội.',
      baseBranches: [
        { title: 'Chi hội khu phố', subtext: '21 Chi hội LHTN tại 21 Khu phố' },
        { title: 'Chi hội trường học', subtext: 'Khối trường học và CLB kỹ năng' },
        { title: 'Chi hội cơ quan, doanh nghiệp', subtext: 'Doanh nghiệp và tổ chức thành viên' }
      ],
      logoBadge: (
        <div className="w-12 h-12 rounded-full bg-sky-600 flex items-center justify-center p-1 shadow-md border-2 border-white">
          <HeartHandshake className="w-7 h-7 text-white" />
        </div>
      )
    },
    {
      id: 'org-ctd',
      name: 'HỘI CHỮ THẬP ĐỎ PHƯỜNG',
      shortName: 'Hội Chữ thập đỏ',
      colorScheme: {
        primary: '#DC2626',
        border: 'border-red-400',
        bgHeader: 'bg-gradient-to-r from-red-600 to-rose-700',
        bgLight: 'bg-red-50/70',
        badgeBg: 'bg-red-100',
        badgeText: 'text-red-800',
        accentGlow: 'shadow-red-500/20'
      },
      motto: 'Hoạt động nhân đạo, từ thiện, hỗ trợ người nghèo, người có hoàn cảnh khó khăn.',
      baseBranches: [
        { title: 'Chi hội khu phố', subtext: '21 Chi hội Chữ thập đỏ 21 Khu phố' },
        { title: 'Chi hội trường học', subtext: 'Khối trường học và thanh thiếu niên CTĐ' },
        { title: 'Chi hội cơ quan, doanh nghiệp', subtext: 'Các tổ chức thiện nguyện và DN' }
      ],
      logoBadge: (
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-1 shadow-md border-2 border-red-500">
          <div className="w-7 h-7 relative flex items-center justify-center">
            <div className="w-6 h-2 bg-red-600 rounded-xs absolute" />
            <div className="w-2 h-6 bg-red-600 rounded-xs absolute" />
          </div>
        </div>
      )
    },
    {
      id: 'org-ccb',
      name: 'HỘI CỰU CHIẾN BINH PHƯỜNG',
      shortName: 'Hội Cựu chiến binh',
      colorScheme: {
        primary: '#7E22CE',
        border: 'border-purple-400',
        bgHeader: 'bg-gradient-to-r from-purple-700 to-fuchsia-800',
        bgLight: 'bg-purple-50/70',
        badgeBg: 'bg-purple-100',
        badgeText: 'text-purple-800',
        accentGlow: 'shadow-purple-500/20'
      },
      motto: 'Phát huy bản chất “Bộ đội Cụ Hồ”, đoàn kết, gương mẫu, tham gia xây dựng và bảo vệ Tổ quốc.',
      baseBranches: [
        { title: 'Chi hội khu phố', subtext: '21 Chi hội CCB tại 21 Khu phố' },
        { title: 'Chi hội cơ quan, doanh nghiệp', subtext: 'Ban liên lạc và CCB khối cơ quan' }
      ],
      logoBadge: (
        <div className="w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center p-1 shadow-md border-2 border-white">
          <Award className="w-7 h-7 text-amber-300" />
        </div>
      )
    },
    {
      id: 'org-lhph',
      name: 'HỘI LIÊN HIỆP PHỤ NỮ PHƯỜNG',
      shortName: 'Hội Phụ nữ',
      colorScheme: {
        primary: '#0284C7',
        border: 'border-blue-400',
        bgHeader: 'bg-gradient-to-r from-blue-600 to-indigo-700',
        bgLight: 'bg-blue-50/70',
        badgeBg: 'bg-blue-100',
        badgeText: 'text-blue-800',
        accentGlow: 'shadow-blue-500/20'
      },
      motto: 'Đoàn kết, hỗ trợ phụ nữ phát triển toàn diện, xây dựng gia đình hạnh phúc, bình đẳng, tiến bộ.',
      baseBranches: [
        { title: 'Chi hội phụ nữ khu phố', subtext: '21 Chi hội phụ nữ tại 21 Khu phố' },
        { title: 'Tổ phụ nữ', subtext: 'Các tổ phụ nữ nòng cốt theo từng cụm' }
      ],
      logoBadge: (
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center p-1 shadow-md border-2 border-white">
          <Users className="w-7 h-7 text-pink-200" />
        </div>
      )
    },
    {
      id: 'org-congdoan',
      name: 'CÔNG ĐOÀN PHƯỜNG',
      shortName: 'Công đoàn Phường',
      colorScheme: {
        primary: '#0F766E',
        border: 'border-teal-400',
        bgHeader: 'bg-gradient-to-r from-teal-700 to-emerald-800',
        bgLight: 'bg-teal-50/70',
        badgeBg: 'bg-teal-100',
        badgeText: 'text-teal-800',
        accentGlow: 'shadow-teal-500/20'
      },
      motto: 'Đại diện, bảo vệ quyền và lợi ích hợp pháp, chính đáng của đoàn viên, người lao động; xây dựng quan hệ lao động hài hòa, ổn định, tiến bộ.',
      baseBranches: [
        { title: 'Công đoàn cơ sở cơ quan, đơn vị', subtext: 'Khối cơ quan hành chính phường' },
        { title: 'Công đoàn cơ sở doanh nghiệp', subtext: 'Doanh nghiệp ngoài nhà nước trên địa bàn' }
      ],
      logoBadge: (
        <div className="w-12 h-12 rounded-full bg-teal-700 flex items-center justify-center p-1 shadow-md border-2 border-white">
          <Building2 className="w-7 h-7 text-yellow-300" />
        </div>
      )
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(Math.max(0.6, Number((prev + delta).toFixed(2))), 1.6));
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-100 p-6 overflow-auto' : ''}`}>
      {/* Chart Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <span>Sơ Đồ Tổ Chức MTTQ & Đoàn Thể Chính Trị Phường Chánh Hiệp</span>
          </h3>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100">
            Khối 6 Trụ Cột Cơ Sở
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-0.5">
            <button
              onClick={() => handleZoom(-0.1)}
              className="p-1.5 hover:bg-white text-slate-700 rounded-lg transition-colors"
              title="Thu nhỏ sơ đồ"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-bold text-slate-700 min-w-[48px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => handleZoom(0.1)}
              className="p-1.5 hover:bg-white text-slate-700 rounded-lg transition-colors"
              title="Phóng to sơ đồ"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={resetZoom}
              className="p-1.5 hover:bg-white text-slate-700 rounded-lg transition-colors"
              title="Đặt lại kích thước chuẩn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-bold text-xs flex items-center gap-1"
            title="In sơ đồ chuẩn khổ ngang A4/A3"
          >
            <Printer className="w-4 h-4 text-blue-600" />
            <span className="hidden md:inline">In Sơ Đồ</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-bold text-xs flex items-center gap-1"
            title={isFullscreen ? 'Thoát toàn màn hình' : 'Xem toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-amber-600" /> : <Maximize2 className="w-4 h-4 text-blue-600" />}
            <span className="hidden md:inline">{isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
          </button>
        </div>
      </div>

      {/* Main Diagram Area with dynamic zoom */}
      <div 
        ref={containerRef}
        className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-8 shadow-xs overflow-x-auto min-h-[700px] flex flex-col items-center select-none"
      >
        <div 
          style={{ 
            transform: `scale(${zoomLevel})`, 
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out'
          }}
          className="w-full max-w-[1360px] min-w-[1150px] flex flex-col items-center space-y-6 pt-2 pb-8"
        >
          {/* ========================================================================= */}
          {/* LEVEL 1: TOP HEADER - MTTQ PHƯỜNG CHÁNH HIỆP */}
          {/* ========================================================================= */}
          <div className="flex flex-col items-center w-full max-w-2xl">
            {/* Main Upper Box: MTTQ PHUONG */}
            <div 
              onClick={() => onOpenEditModal(mttqOrg)}
              className="w-full bg-gradient-to-r from-red-700 via-red-600 to-amber-600 rounded-2xl p-4 text-white shadow-xl shadow-red-700/20 border-2 border-amber-300 text-center relative cursor-pointer hover:brightness-105 transition-all group"
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center gap-1 text-[11px] font-bold backdrop-blur-xs">
                  <Edit3 className="w-3.5 h-3.5" /> Sửa
                </span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white p-1 shadow-md border-2 border-amber-300 shrink-0">
                  <img 
                    src="https://sv2.anhsieuviet.com/2026/09/02/862c92e8-1336-4885-8787-1a6702c3a178ad174eb779884713.png" 
                    alt="Logo MTTQ"
                    className="w-full h-full object-contain" 
                  />
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-bold text-amber-200 uppercase tracking-wider">CƠ QUAN CHỦ TRÌ KHỐI ĐẠI ĐOÀN KẾT</div>
                  <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white drop-shadow-xs">
                    ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG
                  </h2>
                </div>
              </div>
            </div>

            {/* Vertical Line from MTTQ Box to President Node */}
            <div className="w-0.5 h-6 bg-slate-400" />

            {/* Sub-Node: CHỦ TỊCH ỦY BAN MTTQ PHƯỜNG */}
            <div 
              onClick={() => onOpenEditModal(mttqOrg)}
              className="bg-white border-2 border-red-500 rounded-xl px-6 py-2.5 shadow-md flex items-center gap-3 hover:border-red-600 transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Thường trực điều hành</div>
                <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>Chủ tịch Ủy ban MTTQ phường</span>
                  <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md">
                    {mttqOrg?.leaderName || 'Trần Thị Hoa'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* LEVEL 2: TREE CONNECTOR SVG (Hierarchical Branching System) */}
          {/* ========================================================================= */}
          <div className="w-full relative h-12 flex items-center justify-center">
            {/* Center Vertical Down Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-400" />
            
            {/* Horizontal Bus Line spanning 6 columns */}
            <div className="absolute top-6 left-[8.33%] right-[8.33%] h-0.5 bg-slate-400" />

            {/* 6 Down Connectors to each pillar */}
            <div className="w-full grid grid-cols-6 h-full relative">
              {[0, 1, 2, 3, 4, 5].map(idx => (
                <div key={idx} className="relative flex justify-center">
                  <div className="absolute top-6 bottom-0 w-0.5 bg-slate-400" />
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* LEVEL 3: 6 COLUMNS - THE 6 FOUNDATIONAL PILLARS OF THE SYSTEM */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-6 gap-3.5 w-full items-start">
            {pillars.map((pillar) => {
              const matchedOrg = organizations.find(o => o.id === pillar.id || o.slug?.includes(pillar.id.replace('org-', '')) || o.shortName.toLowerCase().includes(pillar.shortName.toLowerCase()));

              return (
                <div 
                  key={pillar.id}
                  className={`flex flex-col bg-white rounded-2xl border-2 ${pillar.colorScheme.border} shadow-sm hover:shadow-md transition-all relative overflow-hidden group`}
                >
                  {/* Card Header with Organization Title */}
                  <div className={`${pillar.colorScheme.bgHeader} p-3 text-white text-center relative flex flex-col items-center gap-2 min-h-[95px] justify-center`}>
                    {/* Floating Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (matchedOrg) onOpenEditModal(matchedOrg);
                      }}
                      className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/20 hover:bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Chỉnh sửa thông tin & số liệu"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>

                    {/* Logo Emblem Badge */}
                    <div className="shrink-0 -mt-6">
                      {pillar.logoBadge}
                    </div>

                    <h4 className="font-black text-[12px] leading-snug uppercase tracking-tight text-white px-1">
                      {pillar.name}
                    </h4>
                  </div>

                  {/* Motto / Role Section */}
                  <div className={`p-2.5 ${pillar.colorScheme.bgLight} border-b ${pillar.colorScheme.border} text-center min-h-[85px] flex items-center justify-center`}>
                    <p className="text-[11px] text-slate-700 italic font-medium leading-relaxed">
                      "{matchedOrg?.description || pillar.motto}"
                    </p>
                  </div>

                  {/* Metric Summary Badges */}
                  <div className="p-2 bg-slate-50 border-b border-slate-200/80 flex items-center justify-around text-[10px] font-bold">
                    <div className="text-center">
                      <span className="text-slate-400 block text-[9px] uppercase">Lực lượng</span>
                      <span className={`font-black ${pillar.colorScheme.badgeText}`}>
                        {(matchedOrg?.activeMembersCount || 0).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <div className="h-4 w-px bg-slate-200" />
                    <div className="text-center">
                      <span className="text-slate-400 block text-[9px] uppercase">Đảng viên</span>
                      <span className="font-black text-red-600">
                        {matchedOrg?.partyMembersCount || 0}
                      </span>
                    </div>
                  </div>

                  {/* Base Organizations List (TỔ CHỨC CƠ SỞ) */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-3 bg-white">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 text-center">
                        {pillar.id === 'org-congdoan' ? 'CÔNG ĐOÀN PHƯỜNG' : 'TỔ CHỨC CƠ SỞ'}
                      </div>

                      <div className="space-y-1.5">
                        {pillar.baseBranches.map((branch, bIdx) => (
                          <div 
                            key={bIdx}
                            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition-colors"
                          >
                            <div className="font-bold text-[11px] text-slate-900 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                              <span>{branch.title}</span>
                            </div>
                            {branch.subtext && (
                              <div className="text-[10px] text-slate-500 font-medium pl-3 mt-0.5">
                                {branch.subtext}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Profile Button */}
                    <button
                      onClick={() => {
                        if (matchedOrg) {
                          setSelectedPillarOrg(matchedOrg);
                        } else {
                          onShowToast?.(`Đang mở chi tiết của ${pillar.shortName}`, 'info');
                        }
                      }}
                      className={`w-full py-1.5 rounded-xl ${pillar.colorScheme.badgeBg} ${pillar.colorScheme.badgeText} text-[11px] font-extrabold flex items-center justify-center gap-1 hover:brightness-95 transition-all`}
                    >
                      <span>Xem chi tiết 21 KP</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* LEVEL 4: BOTTOM BANNER - NHIỆM VỤ CHUNG */}
          {/* ========================================================================= */}
          <div className="w-full bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 rounded-2xl p-4 sm:p-5 text-white shadow-lg border border-blue-800/80 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Users className="w-6 h-6 text-amber-300" />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-amber-400 text-blue-950 text-[10px] font-black uppercase tracking-wider">
                  MỤC TIÊU VÀ SỨ MỆNH TRỌNG TÂM
                </div>
                <h4 className="font-black text-sm text-white uppercase tracking-wide">
                  NHIỆM VỤ CHUNG
                </h4>
                <p className="text-xs text-blue-100 font-medium leading-relaxed max-w-5xl">
                  "Phát huy sức mạnh khối đại đoàn kết toàn dân tộc, vận động Nhân dân thực hiện chủ trương, đường lối của Đảng, chính sách, pháp luật của Nhà nước; tham gia xây dựng Đảng, chính quyền vững mạnh; xây dựng phường văn minh, giàu đẹp, nghĩa tình."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal for Selected Organization */}
      {selectedPillarOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-800 to-indigo-800 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedPillarOrg.avatarUrl || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=300'} 
                  alt={selectedPillarOrg.name} 
                  className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0"
                />
                <div>
                  <h3 className="font-black text-base">{selectedPillarOrg.name}</h3>
                  <p className="text-xs text-blue-200">Đại diện: {selectedPillarOrg.leaderPosition} - <strong>{selectedPillarOrg.leaderName}</strong></p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPillarOrg(null)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Chi hội / Chi đoàn</span>
                  <span className="font-black text-blue-700 text-base">{selectedPillarOrg.branchesCount || 21}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Đoàn/Hội viên</span>
                  <span className="font-black text-emerald-700 text-base">{(selectedPillarOrg.activeMembersCount || 0).toLocaleString('vi-VN')}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Hội viên Nữ</span>
                  <span className="font-black text-purple-700 text-base">{selectedPillarOrg.femaleMembersCount || 0}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Đảng viên nòng cốt</span>
                  <span className="font-black text-red-700 text-base">{selectedPillarOrg.partyMembersCount || 0}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Mạng lưới bao phủ tại 21 Khu phố Phường Chánh Hiệp:</span>
                </h4>
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900 flex items-center justify-between">
                  <span className="font-bold">Đã thành lập và duy trì hoạt động 100% tại 21 Khu phố:</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black text-[11px]">
                    21 / 21 Khu phố
                  </span>
                </div>
              </div>

              {selectedPillarOrg.featuredAchievements && selectedPillarOrg.featuredAchievements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Mô hình, phong trào thi đua "Dân vận khéo":</span>
                  </h4>
                  <div className="space-y-1.5">
                    {selectedPillarOrg.featuredAchievements.map((ach, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-400">Liên hệ: {selectedPillarOrg.phone || '0274.3822.111'}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPillarOrg(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-white"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    const org = selectedPillarOrg;
                    setSelectedPillarOrg(null);
                    onOpenEditModal(org);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-black text-xs hover:bg-blue-500 flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa Số Liệu & Thông Tin</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
