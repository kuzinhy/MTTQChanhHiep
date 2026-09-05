import React from 'react';

// Biểu tượng Trống Đồng Đông Sơn (Dong Son Bronze Drum Motif)
export const DongSonDrumIcon: React.FC<{ className?: string; size?: number; color?: string }> = ({
  className = 'w-6 h-6',
  size = 24,
  color = 'currentColor'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Vòng ngoài cùng */}
    <circle cx="50" cy="50" r="48" stroke={color} strokeWidth="2" opacity="0.9" />
    <circle cx="50" cy="50" r="44" stroke={color} strokeWidth="1" strokeDasharray="2 2" opacity="0.8" />
    
    {/* Vòng chim hạc / hoa văn răng cưa */}
    <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="1.5" opacity="0.85" />
    <circle cx="50" cy="50" r="32" stroke={color} strokeWidth="1" strokeDasharray="3 2" opacity="0.75" />
    
    {/* Vòng chấm nhỏ & vạch hướng tâm */}
    <circle cx="50" cy="50" r="24" stroke={color} strokeWidth="1.5" opacity="0.9" />
    <circle cx="50" cy="50" r="16" stroke={color} strokeWidth="1" opacity="0.8" />
    
    {/* Ngôi sao 12 cánh trung tâm Trống Đồng */}
    <path
      d="M50 30 L53 43 L64 36 L57 47 L70 50 L57 53 L64 64 L53 57 L50 70 L47 57 L36 64 L43 53 L30 50 L43 47 L36 36 L47 43 Z"
      fill={color}
      opacity="0.95"
    />
  </svg>
);

// Biểu tượng Chim Hạc Đông Sơn (Dong Son Soaring Egret / Crane Motif)
export const ChimHacIcon: React.FC<{ className?: string; size?: number; color?: string }> = ({
  className = 'w-6 h-6',
  size = 24,
  color = 'currentColor'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Chim hạc sải cánh bay */}
    <path
      d="M10 65 Q35 25 60 15 Q75 10 90 20 Q80 30 65 35 Q50 40 35 60 Z"
      fill={color}
      opacity="0.9"
    />
    <path
      d="M25 55 Q50 35 75 40 Q85 45 95 35 Q85 55 60 60 Z"
      fill={color}
      opacity="0.7"
    />
    <circle cx="82" cy="18" r="3" fill={color} />
  </svg>
);

// Biểu tượng Hoa Sen Hồng (Lotus Blossom Motif)
export const HoaSenIcon: React.FC<{ className?: string; size?: number; color?: string }> = ({
  className = 'w-6 h-6',
  size = 24,
  color = 'currentColor'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Cánh sen trung tâm */}
    <path d="M50 15 C58 35 62 55 50 85 C38 55 42 35 50 15 Z" fill={color} opacity="0.9" />
    {/* Cánh sen bên trái */}
    <path d="M50 25 C30 35 15 55 30 80 C42 75 48 60 50 25 Z" fill={color} opacity="0.75" />
    <path d="M50 35 C20 50 10 68 20 85 C35 80 44 70 50 35 Z" fill={color} opacity="0.6" />
    {/* Cánh sen bên phải */}
    <path d="M50 25 C70 35 85 55 70 80 C58 75 52 60 50 25 Z" fill={color} opacity="0.75" />
    <path d="M50 35 C80 50 90 68 80 85 C65 80 56 70 50 35 Z" fill={color} opacity="0.6" />
    {/* Bệ đài sen */}
    <path d="M25 82 Q50 95 75 82 Q50 88 25 82 Z" fill={color} opacity="0.85" />
  </svg>
);

// Khung trang trí viền Trống Đồng & Chim Hạc (Decorative Border Bar)
export const TraditionalBorderPattern: React.FC<{ className?: string }> = ({ className = 'h-3' }) => (
  <div className={`w-full bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 flex items-center justify-around overflow-hidden ${className}`}>
    <div className="flex items-center gap-6 opacity-80 text-amber-100 text-[10px] font-bold tracking-widest whitespace-nowrap">
      <span>★ ❖ ★ ❖ ★ ❖ ★ ❖ ★</span>
      <span>KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH</span>
      <span>★ ❖ ★ ❖ ★ ❖ ★ ❖ ★</span>
    </div>
  </div>
);
