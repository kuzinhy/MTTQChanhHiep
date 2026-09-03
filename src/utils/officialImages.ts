// Official SVG Assets & Placeholders for MTTQ Việt Nam - Phường Chánh Hiệp

// Helper to wrap SVG in data URI
function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// 1. Article Banners by Category
export const ARTICLE_BANNERS = {
  thidua: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="100%" height="100%">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#b91c1c"/>
          <stop offset="50%" stop-color="#991b1b"/>
          <stop offset="100%" stop-color="#450a0a"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#fef08a" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#991b1b" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <circle cx="600" cy="280" r="350" fill="url(#glow)"/>
      
      <!-- Decorative Borders -->
      <rect x="20" y="20" width="1160" height="590" rx="16" fill="none" stroke="#f59e0b" stroke-width="4" stroke-dasharray="12 6" opacity="0.6"/>
      <rect x="35" y="35" width="1130" height="560" rx="12" fill="none" stroke="#fef08a" stroke-width="2" opacity="0.4"/>

      <!-- Center MTTQ Emblem Badge -->
      <g transform="translate(600, 220)">
        <circle cx="0" cy="0" r="90" fill="#dc2626" stroke="#f59e0b" stroke-width="8"/>
        <!-- Lotus petals -->
        <path d="M0 -75 C-30 -45 -60 -10 -60 30 C-60 70 -30 85 0 85 C30 85 60 70 60 30 C60 -10 30 -45 0 -75 Z" fill="#b91c1c" opacity="0.9"/>
        <path d="M0 -60 C-22 -35 -45 -5 -45 28 C-45 58 -22 70 0 70 C22 70 45 58 45 28 C45 -5 22 -35 0 -60 Z" fill="#facc15" opacity="0.9"/>
        <circle cx="0" cy="15" r="28" fill="#991b1b" stroke="#fef08a" stroke-width="4"/>
        <!-- Star -->
        <path d="M0 -3 L4 8 L15 9 L6 16 L9 27 L0 20 L-9 27 L-6 16 L-15 9 L-4 8 Z" fill="#fef08a"/>
      </g>

      <!-- Banner Text -->
      <text x="600" y="380" text-anchor="middle" fill="#fef08a" font-family="system-ui, sans-serif" font-weight="900" font-size="32" letter-spacing="2">
        ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP
      </text>
      <text x="600" y="440" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="42" letter-spacing="1">
        PHONG TRÀO THI ĐỦA "TOÀN DÂN ĐOÀN KẾT XÂY DỰNG ĐÔ THỊ VĂN MINH"
      </text>
      <text x="600" y="490" text-anchor="middle" fill="#fcd34d" font-family="system-ui, sans-serif" font-weight="700" font-size="24">
        SÁNG - XANH - SẠCH - ĐẸP - AN TOÀN • PHƯỜNG CHÁNH HIỆP
      </text>

      <!-- Bottom Ribbon Accent -->
      <rect x="300" y="530" width="600" height="40" rx="20" fill="#f59e0b"/>
      <text x="600" y="556" text-anchor="middle" fill="#450a0a" font-family="system-ui, sans-serif" font-weight="900" font-size="20">
        ★ PHONG TRÀO THI ĐỦA YÊU NƯỚC ★
      </text>
    </svg>
  `),

  hoctapbac: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="100%" height="100%">
      <defs>
        <linearGradient id="bgBac" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#991b1b"/>
          <stop offset="60%" stop-color="#881337"/>
          <stop offset="100%" stop-color="#4c0519"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bgBac)"/>
      <rect x="25" y="25" width="1150" height="580" rx="16" fill="none" stroke="#facc15" stroke-width="4"/>

      <!-- Lotus Motif -->
      <g transform="translate(600, 210)" opacity="0.95">
        <path d="M0 -110 C-50 -50 -100 20 -100 80 C-100 130 -50 150 0 150 C50 150 100 130 100 80 C100 20 50 -50 0 -110 Z" fill="#be123c"/>
        <path d="M0 -85 C-38 -38 -75 15 -75 62 C-75 102 -38 118 0 118 C38 118 75 102 75 62 C75 15 38 -38 0 -85 Z" fill="#fbbf24"/>
        <path d="M0 -60 C-25 -25 -50 10 -50 45 C-50 75 -25 85 0 85 C25 85 50 75 50 45 C50 10 25 -25 0 -60 Z" fill="#881337"/>
        <circle cx="0" cy="30" r="22" fill="#fef08a"/>
        <path d="M0 16 L3 25 L12 25 L5 30 L8 39 L0 33 L-8 39 L-5 30 L-12 25 L-3 25 Z" fill="#991b1b"/>
      </g>

      <text x="600" y="390" text-anchor="middle" fill="#fef08a" font-family="system-ui, sans-serif" font-weight="900" font-size="34">
        KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH
      </text>
      <text x="600" y="445" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="36">
        HỌC TẬP VÀ LÀM THEO TƯ TƯỞNG, ĐẠO ĐỨC, PHONG CÁCH HỒ CHÍ MINH
      </text>
      <text x="600" y="495" text-anchor="middle" fill="#fcd34d" font-family="system-ui, sans-serif" font-weight="700" font-size="22">
        ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP
      </text>
    </svg>
  `),

  ansinh: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="100%" height="100%">
      <defs>
        <linearGradient id="bgAnsinh" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#9a3412"/>
          <stop offset="50%" stop-color="#c2410c"/>
          <stop offset="100%" stop-color="#7c2d12"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bgAnsinh)"/>
      <rect x="25" y="25" width="1150" height="580" rx="16" fill="none" stroke="#fdba74" stroke-width="4"/>

      <!-- House / Heart Icon -->
      <g transform="translate(600, 200)">
        <path d="M-80 30 L0 -50 L80 30 L60 30 L60 90 L-60 90 L-60 30 Z" fill="#f97316" stroke="#fef08a" stroke-width="6"/>
        <path d="M0 0 C-20 -20 -40 0 0 35 C40 0 20 -20 0 0 Z" fill="#fef08a"/>
      </g>

      <text x="600" y="370" text-anchor="middle" fill="#fef08a" font-family="system-ui, sans-serif" font-weight="900" font-size="36">
        MÁY ẤM ĐẠI ĐOÀN KẾT - AN SINH XÃ HỘI
      </text>
      <text x="600" y="430" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="40">
        TRAO NHÀ ĐẠI ĐOÀN KẾT & CHĂM LO HỘ KHÓ KHĂN
      </text>
      <text x="600" y="485" text-anchor="middle" fill="#fed7aa" font-family="system-ui, sans-serif" font-weight="700" font-size="24">
        ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP • VÌ NGƯỜI NGHÈO
      </text>
    </svg>
  `),

  giamsat: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="100%" height="100%">
      <defs>
        <linearGradient id="bgGiamsat" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e3a8a"/>
          <stop offset="50%" stop-color="#1e40af"/>
          <stop offset="100%" stop-color="#172554"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bgGiamsat)"/>
      <rect x="25" y="25" width="1150" height="580" rx="16" fill="none" stroke="#60a5fa" stroke-width="4"/>

      <!-- Scales of justice icon -->
      <g transform="translate(600, 200)">
        <rect x="-6" y="-70" width="12" height="120" fill="#fef08a" rx="4"/>
        <rect x="-80" y="-70" width="160" height="10" fill="#fef08a" rx="4"/>
        <!-- Left scale -->
        <path d="M-70 -60 L-100 0 L-40 0 Z" fill="#3b82f6" stroke="#fef08a" stroke-width="3"/>
        <!-- Right scale -->
        <path d="M70 -60 L40 0 L100 0 Z" fill="#3b82f6" stroke="#fef08a" stroke-width="3"/>
      </g>

      <text x="600" y="380" text-anchor="middle" fill="#fef08a" font-family="system-ui, sans-serif" font-weight="900" font-size="36">
        CÔNG TÁC GIÁM SÁT VÀ PHẢN BIỆN XÃ HỘI
      </text>
      <text x="600" y="440" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="38">
        PHÁT HUY QUYỀN LÀM CHỦ CỦA NHÂN DÂN TẠI CƠ SỞ
      </text>
      <text x="600" y="495" text-anchor="middle" fill="#93c5fd" font-family="system-ui, sans-serif" font-weight="700" font-size="24">
        ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP
      </text>
    </svg>
  `),

  default: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="100%" height="100%">
      <rect width="1200" height="630" fill="#991b1b"/>
      <rect x="20" y="20" width="1160" height="590" rx="16" fill="none" stroke="#f59e0b" stroke-width="4"/>
      <g transform="translate(600, 220)">
        <circle cx="0" cy="0" r="80" fill="#dc2626" stroke="#f59e0b" stroke-width="6"/>
        <path d="M0 -60 L10 -20 L50 -20 L20 10 L30 50 L0 25 L-30 50 L-20 10 L-50 -20 L-10 -20 Z" fill="#fef08a"/>
      </g>
      <text x="600" y="380" text-anchor="middle" fill="#fef08a" font-family="system-ui, sans-serif" font-weight="900" font-size="32">
        ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP
      </text>
      <text x="600" y="440" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="38">
        CỔNG THÔNG TIN ĐIỆN TỬ & VĂN PHÒNG SỐ
      </text>
      <text x="600" y="490" text-anchor="middle" fill="#fcd34d" font-family="system-ui, sans-serif" font-weight="700" font-size="22">
        THÀNH PHỐ THỦ DẦU MỘT • TỈNH BÌNH DƯƠNG
      </text>
    </svg>
  `)
};

// 2. Cadre Official Avatar SVG Generator
export function getOfficialCadreAvatarSvg(name: string, role: string): string {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'CB';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">
      <defs>
        <linearGradient id="avatarBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e3a8a"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <rect width="300" height="300" rx="150" fill="url(#avatarBg)"/>
      <circle cx="150" cy="150" r="142" fill="none" stroke="#f59e0b" stroke-width="6"/>

      <!-- Cadre Silhouette -->
      <g transform="translate(150, 200)">
        <path d="M-60 80 C-60 30 -40 20 0 20 C40 20 60 30 60 80 Z" fill="#334155"/>
        <path d="M-20 20 L0 45 L20 20 Z" fill="#ffffff"/>
        <path d="M-6 20 L0 35 L6 20 Z" fill="#dc2626"/>
      </g>
      <circle cx="150" cy="120" r="45" fill="#f8fafc"/>

      <!-- Initials Overlay -->
      <text x="150" y="132" text-anchor="middle" fill="#1e293b" font-family="system-ui, sans-serif" font-weight="900" font-size="36">
        ${initials}
      </text>

      <!-- Badge Top Right -->
      <g transform="translate(220, 60)">
        <circle cx="0" cy="0" r="24" fill="#dc2626" stroke="#fef08a" stroke-width="3"/>
        <path d="M0 -12 L3 -4 L11 -4 L5 1 L7 9 L0 4 L-7 9 L-5 1 L-11 -4 L-3 -4 Z" fill="#fef08a"/>
      </g>
    </svg>
  `;
  return svgToDataUri(svg);
}

// Helper to get Banner by category
export function getBannerForCategory(category: string): string {
  if (!category) return ARTICLE_BANNERS.default;
  const lower = category.toLowerCase();
  if (lower.includes('thi đua') || lower.includes('phong trào')) return ARTICLE_BANNERS.thidua;
  if (lower.includes('bác') || lower.includes('hồ chí minh') || lower.includes('văn hóa')) return ARTICLE_BANNERS.hoctapbac;
  if (lower.includes('an sinh') || lower.includes('nghèo') || lower.includes('đại đoàn kết')) return ARTICLE_BANNERS.ansinh;
  if (lower.includes('giám sát') || lower.includes('phản biện') || lower.includes('pháp luật')) return ARTICLE_BANNERS.giamsat;
  return ARTICLE_BANNERS.default;
}
