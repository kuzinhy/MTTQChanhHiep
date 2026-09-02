import React, { useState } from 'react';
import { Trophy, Flag, Cpu, Leaf, Heart, Sparkles, Award, Star, ShieldCheck } from 'lucide-react';

export interface BannerTheme {
  id: string;
  name: string;
  gradient: string;
  borderColor: string;
  accentBg: string;
  textColor: string;
  badgeBg: string;
  badgeText: string;
  icon: React.ElementType;
  patternSvg?: string;
  description: string;
}

export interface BannerImagePreset {
  id: string;
  name: string;
  url: string;
  description: string;
}

export const BANNER_IMAGE_PRESETS: BannerImagePreset[] = [
  {
    id: 'img-preset-1',
    name: 'Banner 1 - Lịch sử Mặt trận & Đoàn thể (Đỏ Vàng)',
    url: 'https://sv2.anhsieuviet.com/2026/09/02/862c92e8-1336-4885-8787-1a6702c3a178ad174eb779884713.png',
    description: 'Ảnh bìa hội thi Lịch sử Mặt trận, Tuyên truyền Đảng & Pháp luật'
  },
  {
    id: 'img-preset-2',
    name: 'Banner 2 - Gương sáng Mặt trận & An sinh (Vàng Nâu)',
    url: 'https://sv2.anhsieuviet.com/2026/09/02/b94eb55d-1061-4c4f-9278-a46ce8de408a9067fc5c33d6b0a2.png',
    description: 'Ảnh bìa cuộc thi viết cảm nhận, gương người tốt việc tốt'
  },
  {
    id: 'img-preset-3',
    name: 'Banner 3 - Chuyển đổi số & Dịch vụ công (Xanh Dương)',
    url: 'https://sv2.anhsieuviet.com/2026/09/02/775fbdb9-40fc-4b75-979f-7ebf40ecd00fb813d9fe5f77bf4c.png',
    description: 'Ảnh bìa hội thi Chuyển đổi số, Công nghệ & Kỹ năng số'
  },
  {
    id: 'img-preset-4',
    name: 'Banner 4 - Đoàn Thanh niên & Môi trường Xanh (Xanh Tím)',
    url: 'https://sv2.anhsieuviet.com/2026/09/02/8758f2ac-9342-47db-8f7f-7a3bcd434c32b7535a4487543751.png',
    description: 'Ảnh bìa hội thi Đoàn thanh niên, khu phố xanh - sạch - đẹp'
  }
];

export const BANNER_PRESET_THEMES: BannerTheme[] = [
  {
    id: 'theme:red-flag',
    name: 'Mặt trận & Đảng (Đỏ Vàng Truyền Thống)',
    gradient: 'from-red-900 via-red-800 to-amber-900',
    borderColor: 'border-amber-500/40',
    accentBg: 'bg-amber-500/20',
    textColor: 'text-amber-300',
    badgeBg: 'bg-amber-500 text-red-950 font-black',
    badgeText: 'Mặt trận Tổ quốc',
    icon: Flag,
    description: 'Dành cho hội thi lịch sử Mặt trận, Đảng, Đoàn thể, Luật pháp'
  },
  {
    id: 'theme:digital-blue',
    name: 'Chuyển đổi số & Công nghệ (Xanh Dương)',
    gradient: 'from-slate-950 via-blue-950 to-indigo-900',
    borderColor: 'border-sky-500/40',
    accentBg: 'bg-sky-500/20',
    textColor: 'text-sky-300',
    badgeBg: 'bg-sky-500 text-slate-950 font-black',
    badgeText: 'Chuyển đổi số',
    icon: Cpu,
    description: 'Dành cho hội thi công nghệ số, dịch vụ công, kỹ năng số'
  },
  {
    id: 'theme:eco-green',
    name: 'Môi trường & Khu phố Xanh (Xanh Lá)',
    gradient: 'from-emerald-950 via-teal-900 to-emerald-800',
    borderColor: 'border-emerald-400/40',
    accentBg: 'bg-emerald-400/20',
    textColor: 'text-emerald-300',
    badgeBg: 'bg-emerald-400 text-emerald-950 font-black',
    badgeText: 'Đô thị Văn minh',
    icon: Leaf,
    description: 'Dành cho hội thi môi trường, khu phố xanh - sạch - đẹp'
  },
  {
    id: 'theme:culture-gold',
    name: 'Văn hóa - An sinh - Vì cộng đồng (Vàng Kim)',
    gradient: 'from-amber-950 via-stone-900 to-yellow-900',
    borderColor: 'border-amber-400/40',
    accentBg: 'bg-amber-400/20',
    textColor: 'text-amber-200',
    badgeBg: 'bg-amber-400 text-stone-950 font-black',
    badgeText: 'Gương sáng An sinh',
    icon: Heart,
    description: 'Dành cho cuộc thi viết, gương người tốt việc tốt, an sinh'
  },
  {
    id: 'theme:youth-violet',
    name: 'Tuổi trẻ & Sáng tạo (Tím Hồng Năng Động)',
    gradient: 'from-purple-950 via-indigo-950 to-pink-900',
    borderColor: 'border-purple-400/40',
    accentBg: 'bg-purple-400/20',
    textColor: 'text-purple-300',
    badgeBg: 'bg-purple-400 text-purple-950 font-black',
    badgeText: 'Đoàn Thanh Niên',
    icon: Sparkles,
    description: 'Dành cho hội thi đoàn viên thanh niên, sinh viên, học sinh'
  }
];

interface CompetitionBannerProps {
  bannerUrl?: string;
  title: string;
  type?: string;
  status?: string;
  isYouthCompetition?: boolean;
  className?: string;
  showOverlayBadges?: boolean;
}

export const CompetitionBanner: React.FC<CompetitionBannerProps> = ({
  bannerUrl,
  title,
  type,
  status,
  isYouthCompetition,
  className = 'h-48',
  showOverlayBadges = true
}) => {
  const [imageError, setImageError] = useState(false);

  // Determine theme matching title or predefined theme id
  const getTheme = (): BannerTheme => {
    if (bannerUrl && bannerUrl.startsWith('theme:')) {
      const found = BANNER_PRESET_THEMES.find(t => t.id === bannerUrl);
      if (found) return found;
    }

    const lowerTitle = (title || '').toLowerCase();
    if (isYouthCompetition || lowerTitle.includes('thanh niên') || lowerTitle.includes('đoàn')) {
      return BANNER_PRESET_THEMES[4]; // Youth
    }
    if (lowerTitle.includes('môi trường') || lowerTitle.includes('xanh') || lowerTitle.includes('sạch')) {
      return BANNER_PRESET_THEMES[2]; // Eco
    }
    if (lowerTitle.includes('chuyển đổi số') || lowerTitle.includes('công nghệ') || lowerTitle.includes('thông minh')) {
      return BANNER_PRESET_THEMES[1]; // Digital
    }
    if (lowerTitle.includes('gương') || lowerTitle.includes('viết') || lowerTitle.includes('an sinh') || lowerTitle.includes('cộng đồng')) {
      return BANNER_PRESET_THEMES[3]; // Culture
    }
    return BANNER_PRESET_THEMES[0]; // Red Flag default
  };

  const theme = getTheme();
  const IconComponent = theme.icon;

  // Check if we should display an actual image file/URL
  const isCustomImage = bannerUrl && !bannerUrl.startsWith('theme:') && !imageError;

  return (
    <div className={`relative w-full overflow-hidden bg-slate-900 select-none ${className}`}>
      {isCustomImage ? (
        <img
          src={bannerUrl}
          alt={title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover opacity-90 transition-opacity duration-300"
        />
      ) : (
        /* Fallback Vector & Gradient Aesthetic Banner */
        <div className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex flex-col justify-between p-5 text-white relative border-b ${theme.borderColor}`}>
          {/* Subtle geometric pattern overlay */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none transform rotate-12 scale-150">
            <IconComponent className="w-56 h-56 text-white" />
          </div>

          {/* Top header line */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl backdrop-blur-md ${theme.accentBg} border ${theme.borderColor}`}>
                <IconComponent className={`w-5 h-5 ${theme.textColor}`} />
              </div>
              <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg backdrop-blur-md border ${theme.borderColor} ${theme.textColor}`}>
                UBND - MTTQ PHƯỜNG CHÁNH HIỆP
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-md shadow-xs ${theme.badgeBg}`}>
                {theme.badgeText}
              </span>
            </div>
          </div>

          {/* Middle Title Display */}
          <div className="relative z-10 my-auto py-2">
            <h4 className="text-base sm:text-lg font-black leading-snug drop-shadow-md text-white line-clamp-2">
              {title}
            </h4>
          </div>
        </div>
      )}

      {/* Overlay badges if enabled */}
      {showOverlayBadges && (
        <>
          {status && (
            <span className={`absolute top-3 left-3 text-[10px] font-black uppercase px-2.5 py-1 rounded-md text-white shadow-md z-20 ${
              status === 'ONGOING' || status === 'OPEN' ? 'bg-emerald-600 border border-emerald-400/40' :
              status === 'DRAFT' ? 'bg-amber-600 border border-amber-400/40' : 'bg-slate-700 border border-slate-500/40'
            }`}>
              {status === 'ONGOING' || status === 'OPEN' ? '● Đang diễn ra' :
               status === 'DRAFT' ? '○ Bản nháp' : '✓ Đã kết thúc'}
            </span>
          )}

          {type && (
            <span className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md text-blue-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-700 shadow-md z-20 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>{type === 'TRIVIA' ? 'Trắc nghiệm trực tuyến' : type === 'WRITING' ? 'Cuộc thi viết' : 'Hỗn hợp'}</span>
            </span>
          )}
        </>
      )}
    </div>
  );
};
