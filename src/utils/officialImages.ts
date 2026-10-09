// Official SVG Assets & Placeholders for MTTQ Việt Nam - Phường Chánh Hiệp

// Helper to wrap SVG in data URI
function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

// 1. Article Banners by Category and Theme
export const ARTICLE_BANNERS = {
  // Lễ chào cờ & sinh hoạt chính trị
  chao_co: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
      <defs>
        <linearGradient id="bgChaoCo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#b91c1c"/>
          <stop offset="50%" stop-color="#881337"/>
          <stop offset="100%" stop-color="#450a0a"/>
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stop-color="#fef08a" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#991b1b" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bgChaoCo)"/>
      <circle cx="600" cy="240" r="320" fill="url(#sunGlow)"/>
      <rect x="25" y="25" width="1150" height="580" rx="16" fill="none" stroke="#f59e0b" stroke-width="4" stroke-dasharray="14 8" opacity="0.7"/>
      <rect x="40" y="40" width="1120" height="550" rx="12" fill="none" stroke="#fef08a" stroke-width="2" opacity="0.4"/>

      <!-- Center Flag & Emblem Motif -->
      <g transform="translate(600, 210)">
        <circle cx="0" cy="0" r="95" fill="#dc2626" stroke="#f59e0b" stroke-width="8"/>
        <!-- Star Motif -->
        <polygon points="0,-70 20,-18 75,-18 30,16 48,70 0,36 -48,70 -30,16 -75,-18 -20,-18" fill="#facc15" stroke="#fef08a" stroke-width="2"/>
        <circle cx="0" cy="0" r="22" fill="#b91c1c" stroke="#fef08a" stroke-width="3"/>
      </g>

      <text x="600" y="380" text-anchor="middle" fill="#fef08a" font-family="system-ui, sans-serif" font-weight="900" font-size="34" letter-spacing="2">
        ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP
      </text>
      <text x="600" y="440" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="40" letter-spacing="1">
        LỄ CHÀO CỜ &amp; SINH HOẠT CHÍNH TRỊ DƯỚI CỜ
      </text>
      <text x="600" y="492" text-anchor="middle" fill="#fde047" font-family="system-ui, sans-serif" font-weight="700" font-size="24">
        TIÊN PHONG - GƯƠNG MẪU - ĐẠI ĐOÀN KẾT TOÀN DÂN
      </text>
      <rect x="350" y="528" width="500" height="42" rx="21" fill="#f59e0b"/>
      <text x="600" y="555" text-anchor="middle" fill="#450a0a" font-family="system-ui, sans-serif" font-weight="900" font-size="20">
        ★ ĐẢNG BỘ - CHÍNH QUYỀN - MẶT TRẬN TỔ QUỐC ★
      </text>
    </svg>
  `),

  // Thi đua yêu nước & Hoạt động Mặt trận
  thidua: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
      <defs>
        <linearGradient id="bgThiDua" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#b91c1c"/>
          <stop offset="50%" stop-color="#991b1b"/>
          <stop offset="100%" stop-color="#450a0a"/>
        </linearGradient>
        <radialGradient id="glowThiDua" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#fef08a" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#991b1b" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bgThiDua)"/>
      <circle cx="600" cy="280" r="350" fill="url(#glowThiDua)"/>
      <rect x="20" y="20" width="1160" height="590" rx="16" fill="none" stroke="#f59e0b" stroke-width="4" stroke-dasharray="12 6" opacity="0.6"/>
      <rect x="35" y="35" width="1130" height="560" rx="12" fill="none" stroke="#fef08a" stroke-width="2" opacity="0.4"/>

      <!-- Center MTTQ Emblem Badge -->
      <g transform="translate(600, 220)">
        <circle cx="0" cy="0" r="90" fill="#dc2626" stroke="#f59e0b" stroke-width="8"/>
        <path d="M0 -75 C-30 -45 -60 -10 -60 30 C-60 70 -30 85 0 85 C30 85 60 70 60 30 C60 -10 30 -45 0 -75 Z" fill="#b91c1c" opacity="0.9"/>
        <path d="M0 -60 C-22 -35 -45 -5 -45 28 C-45 58 -22 70 0 70 C22 70 45 58 45 28 C45 -5 22 -35 0 -60 Z" fill="#facc15" opacity="0.9"/>
        <circle cx="0" cy="15" r="28" fill="#991b1b" stroke="#fef08a" stroke-width="4"/>
        <polygon points="0,2 3,11 12,11 5,16 8,25 0,20 -8,25 -5,16 -12,11 -3,11" fill="#fef08a"/>
      </g>

      <text x="600" y="380" text-anchor="middle" fill="#fef08a" font-family="system-ui, sans-serif" font-weight="900" font-size="32" letter-spacing="2">
        ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP
      </text>
      <text x="600" y="440" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="42" letter-spacing="1">
        PHONG TRÀO THI ĐUA "TOÀN DÂN ĐOÀN KẾT XÂY DỰNG ĐÔ THỊ VĂN MINH"
      </text>
      <text x="600" y="490" text-anchor="middle" fill="#fcd34d" font-family="system-ui, sans-serif" font-weight="700" font-size="24">
        SÁNG - XANH - SẠCH - ĐẸP - AN TOÀN • PHƯỜNG CHÁNH HIỆP
      </text>
      <rect x="300" y="530" width="600" height="40" rx="20" fill="#f59e0b"/>
      <text x="600" y="556" text-anchor="middle" fill="#450a0a" font-family="system-ui, sans-serif" font-weight="900" font-size="20">
        ★ PHONG TRÀO THI ĐUA YÊU NƯỚC ★
      </text>
    </svg>
  `),

  // Học tập Bác Hồ & Không gian văn hóa
  hoctapbac: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
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
        <polygon points="0,17 4,26 13,26 6,31 9,40 0,35 -9,40 -6,31 -13,26 -4,26" fill="#991b1b"/>
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

  // An sinh xã hội & Chăm lo sức khỏe
  ansinh: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
      <defs>
        <linearGradient id="bgAnsinh" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#9a3412"/>
          <stop offset="50%" stop-color="#c2410c"/>
          <stop offset="100%" stop-color="#7c2d12"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bgAnsinh)"/>
      <rect x="25" y="25" width="1150" height="580" rx="16" fill="none" stroke="#fdba74" stroke-width="4"/>

      <!-- Heart / House / Care Motif -->
      <g transform="translate(600, 200)">
        <circle cx="0" cy="15" r="90" fill="#ea580c" stroke="#fef08a" stroke-width="6"/>
        <path d="M-60 35 L0 -30 L60 35 L45 35 L45 80 L-45 80 L-45 35 Z" fill="#f97316" stroke="#fef08a" stroke-width="4"/>
        <path d="M0 0 C-18 -18 -36 0 0 32 C36 0 18 -18 0 0 Z" fill="#fef08a"/>
      </g>

      <text x="600" y="370" text-anchor="middle" fill="#fef08a" font-family="system-ui, sans-serif" font-weight="900" font-size="36">
        MÁI ẤM ĐẠI ĐOÀN KẾT - AN SINH XÃ HỘI
      </text>
      <text x="600" y="430" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="40">
        CHĂM LO AN SINH, SỨC KHỎE &amp; ĐỜI SỐNG NHÂN DÂN
      </text>
      <text x="600" y="485" text-anchor="middle" fill="#fed7aa" font-family="system-ui, sans-serif" font-weight="700" font-size="24">
        ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP • VÌ NGƯỜI NGHÈO
      </text>
    </svg>
  `),

  // Giám sát & Phản biện xã hội
  giamsat: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
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
        <path d="M-70 -60 L-100 0 L-40 0 Z" fill="#3b82f6" stroke="#fef08a" stroke-width="3"/>
        <path d="M70 -60 L40 0 L100 0 Z" fill="#3b82f6" stroke="#fef08a" stroke-width="3"/>
        <circle cx="0" cy="-65" r="14" fill="#f59e0b"/>
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

  // Tuổi trẻ & Đoàn thanh niên & Youth Fest
  thanhnien: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
      <defs>
        <linearGradient id="bgYouth" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0369a1"/>
          <stop offset="50%" stop-color="#0284c7"/>
          <stop offset="100%" stop-color="#064e3b"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bgYouth)"/>
      <rect x="25" y="25" width="1150" height="580" rx="16" fill="none" stroke="#38bdf8" stroke-width="4"/>

      <!-- Youth Torch / Star Motif -->
      <g transform="translate(600, 205)">
        <circle cx="0" cy="0" r="90" fill="#0284c7" stroke="#fef08a" stroke-width="7"/>
        <polygon points="0,-65 18,-18 70,-18 28,15 45,65 0,32 -45,65 -28,15 -70,-18 -18,-18" fill="#facc15"/>
        <circle cx="0" cy="2" r="18" fill="#dc2626"/>
      </g>

      <text x="600" y="380" text-anchor="middle" fill="#fef08a" font-family="system-ui, sans-serif" font-weight="900" font-size="34">
        ĐOÀN TNCS HỒ CHÍ MINH - TUỔI TRẺ CHÁNH HIỆP
      </text>
      <text x="600" y="440" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="42">
        YOUTH FEST • THANH NIÊN TIÊN PHONG - SÁNG TẠO
      </text>
      <text x="600" y="495" text-anchor="middle" fill="#7dd3fc" font-family="system-ui, sans-serif" font-weight="700" font-size="24">
        XUNG KÍCH CHUYỂN ĐỔI SỐ &amp; XÂY DỰNG ĐÔ THỊ VĂN MINH
      </text>
    </svg>
  `),

  // Hội Liên hiệp Phụ nữ
  phunu: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
      <defs>
        <linearGradient id="bgPhuNu" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#9d174d"/>
          <stop offset="50%" stop-color="#be185d"/>
          <stop offset="100%" stop-color="#831843"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bgPhuNu)"/>
      <rect x="25" y="25" width="1150" height="580" rx="16" fill="none" stroke="#f472b6" stroke-width="4"/>

      <!-- Lotus Petal & Peace Dove Symbol -->
      <g transform="translate(600, 205)">
        <circle cx="0" cy="0" r="90" fill="#9d174d" stroke="#fef08a" stroke-width="7"/>
        <path d="M0 -60 C-30 -20 -40 20 0 50 C40 20 30 -20 0 -60 Z" fill="#fbcfe8"/>
        <circle cx="0" cy="0" r="22" fill="#f43f5e" stroke="#fef08a" stroke-width="3"/>
      </g>

      <text x="600" y="380" text-anchor="middle" fill="#fef08a" font-family="system-ui, sans-serif" font-weight="900" font-size="34">
        HỘI LIÊN HIỆP PHỤ NỮ PHƯỜNG CHÁNH HIỆP
      </text>
      <text x="600" y="440" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="40">
        TỰ TIN - TỰ TRỌNG - TRUNG HẬU - ĐẢM ĐANG
      </text>
      <text x="600" y="495" text-anchor="middle" fill="#fbcfe8" font-family="system-ui, sans-serif" font-weight="700" font-size="24">
        CHĂM LO GIA ĐÌNH HẠNH PHÚC &amp; VÌ SỰ TIẾN BỘ CỦA PHỤ NỮ
      </text>
    </svg>
  `),

  // 21 Khu phố & Đại hội dân cư
  khupho: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
      <defs>
        <linearGradient id="bgKhuPho" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#047857"/>
          <stop offset="50%" stop-color="#065f46"/>
          <stop offset="100%" stop-color="#064e3b"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bgKhuPho)"/>
      <rect x="25" y="25" width="1150" height="580" rx="16" fill="none" stroke="#34d399" stroke-width="4"/>

      <!-- 21 Stars / Community Badge -->
      <g transform="translate(600, 205)">
        <circle cx="0" cy="0" r="90" fill="#047857" stroke="#fef08a" stroke-width="7"/>
        <polygon points="0,-60 18,-15 65,-15 25,15 40,60 0,30 -40,60 -25,15 -65,-15 -18,-15" fill="#facc15"/>
        <circle cx="0" cy="2" r="18" fill="#065f46"/>
      </g>

      <text x="600" y="380" text-anchor="middle" fill="#fef08a" font-family="system-ui, sans-serif" font-weight="900" font-size="34">
        21/21 KHU PHỐ PHƯỜNG CHÁNH HIỆP
      </text>
      <text x="600" y="440" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="40">
        XÂY DỰNG KHU PHỐ ĐẠI ĐOÀN KẾT - AN TOÀN - VĂN MINH
      </text>
      <text x="600" y="495" text-anchor="middle" fill="#a7f3d0" font-family="system-ui, sans-serif" font-weight="700" font-size="24">
        PHÁT HUY DÂN CHỦ CƠ SỞ • DÂN BIẾT - DÂN BÀN - DÂN LÀM - DÂN KIỂM TRA
      </text>
    </svg>
  `),

  // Tết Trung thu & Chăm lo thiếu nhi
  trungthu: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
      <defs>
        <linearGradient id="bgTrungThu" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#312e81"/>
          <stop offset="50%" stop-color="#4338ca"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bgTrungThu)"/>
      <rect x="25" y="25" width="1150" height="580" rx="16" fill="none" stroke="#fbbf24" stroke-width="4"/>

      <!-- Full Moon & Lantern -->
      <g transform="translate(600, 205)">
        <circle cx="0" cy="0" r="90" fill="#fef08a" stroke="#f59e0b" stroke-width="6"/>
        <!-- Star inside lantern -->
        <polygon points="0,-50 14,-15 50,-15 20,10 32,45 0,22 -32,45 -20,10 -50,-15 -14,-15" fill="#dc2626"/>
      </g>

      <text x="600" y="380" text-anchor="middle" fill="#fef08a" font-family="system-ui, sans-serif" font-weight="900" font-size="36">
        ĐÊM HỘI TRĂNG RẰM - TẾT TRUNG THU
      </text>
      <text x="600" y="440" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="42">
        CHĂM LO &amp; TRAO TẶNG QUÀ CHO THIẾU NHI CHÁNH HIỆP
      </text>
      <text x="600" y="495" text-anchor="middle" fill="#fde68a" font-family="system-ui, sans-serif" font-weight="700" font-size="24">
        TẤT CẢ VÌ ĐÀN EM THÂN YÊU • PHƯỜNG CHÁNH HIỆP
      </text>
    </svg>
  `),

  // Biểu trưng / Logo chính thức Phường Chánh Hiệp
  logo_chanh_hiep: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
      <defs>
        <linearGradient id="bgLogo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#b91c1c"/>
          <stop offset="50%" stop-color="#991b1b"/>
          <stop offset="100%" stop-color="#7f1d1d"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bgLogo)"/>
      <rect x="25" y="25" width="1150" height="580" rx="16" fill="none" stroke="#f59e0b" stroke-width="5"/>

      <!-- Official Logo Emblem Seal -->
      <g transform="translate(600, 215)">
        <circle cx="0" cy="0" r="105" fill="#dc2626" stroke="#f59e0b" stroke-width="9"/>
        <circle cx="0" cy="0" r="85" fill="#b91c1c" stroke="#fef08a" stroke-width="3"/>
        <polygon points="0,-65 18,-18 70,-18 28,15 45,65 0,32 -45,65 -28,15 -70,-18 -18,-18" fill="#facc15"/>
        <circle cx="0" cy="0" r="20" fill="#991b1b" stroke="#fef08a" stroke-width="3"/>
      </g>

      <text x="600" y="390" text-anchor="middle" fill="#fef08a" font-family="system-ui, sans-serif" font-weight="900" font-size="36" letter-spacing="2">
        BIỂU TRƯNG CHÍNH THỨC PHƯỜNG CHÁNH HIỆP
      </text>
      <text x="600" y="448" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="40">
        ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP
      </text>
      <text x="600" y="500" text-anchor="middle" fill="#fcd34d" font-family="system-ui, sans-serif" font-weight="700" font-size="24">
        THÀNH PHỐ THỦ DẦU MỘT • TỈNH BÌNH DƯƠNG
      </text>
    </svg>
  `),

  // Banner mặc định chính thức
  default: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
      <defs>
        <linearGradient id="bgDefault" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#991b1b"/>
          <stop offset="50%" stop-color="#b91c1c"/>
          <stop offset="100%" stop-color="#7f1d1d"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bgDefault)"/>
      <rect x="20" y="20" width="1160" height="590" rx="16" fill="none" stroke="#f59e0b" stroke-width="4"/>
      <g transform="translate(600, 215)">
        <circle cx="0" cy="0" r="88" fill="#dc2626" stroke="#f59e0b" stroke-width="7"/>
        <polygon points="0,-55 15,-15 55,-15 22,12 35,52 0,27 -35,52 -22,12 -55,-15 -15,-15" fill="#fef08a"/>
      </g>
      <text x="600" y="380" text-anchor="middle" fill="#fef08a" font-family="system-ui, sans-serif" font-weight="900" font-size="34">
        ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP
      </text>
      <text x="600" y="440" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="40">
        CỔNG THÔNG TIN ĐIỆN TỬ &amp; VĂN PHÒNG SỐ
      </text>
      <text x="600" y="495" text-anchor="middle" fill="#fcd34d" font-family="system-ui, sans-serif" font-weight="700" font-size="24">
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
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

// 3. Smart Category and Article Title Banner Resolver
export function getBannerForCategory(category?: string, title?: string): string {
  const t = (title || '').toLowerCase();
  const c = (category || '').toLowerCase();

  // Match title first (highest precision)
  if (t.includes('chào cờ') || t.includes('sinh hoạt chính trị')) {
    return ARTICLE_BANNERS.chao_co;
  }
  if (t.includes('logo') || t.includes('biểu trưng')) {
    return ARTICLE_BANNERS.logo_chanh_hiep;
  }
  if (t.includes('youth') || t.includes('thanh niên') || t.includes('tuổi trẻ') || t.includes('đoàn thanh niên') || t.includes('kết nạp')) {
    return ARTICLE_BANNERS.thanhnien;
  }
  if (t.includes('phụ nữ') || t.includes('lhpn')) {
    return ARTICLE_BANNERS.phunu;
  }
  if (t.includes('trung thu') || t.includes('thiếu nhi') || t.includes('trẻ em') || t.includes('quà trung thu')) {
    return ARTICLE_BANNERS.trungthu;
  }
  if (t.includes('khám sức khỏe') || t.includes('sức khỏe') || t.includes('y tế')) {
    return ARTICLE_BANNERS.ansinh;
  }
  if (t.includes('khu phố') || t.includes('bầu cử') || t.includes('bầu thành viên')) {
    return ARTICLE_BANNERS.khupho;
  }
  if (t.includes('bác') || t.includes('hồ chí minh')) {
    return ARTICLE_BANNERS.hoctapbac;
  }
  if (t.includes('giám sát') || t.includes('phản biện')) {
    return ARTICLE_BANNERS.giamsat;
  }
  if (t.includes('an sinh') || t.includes('nghèo') || t.includes('nhà tình nghĩa') || t.includes('mái ấm')) {
    return ARTICLE_BANNERS.ansinh;
  }
  if (t.includes('thi đua') || t.includes('khen thưởng') || t.includes('hội nghị') || t.includes('tập huấn') || t.includes('kỹ năng')) {
    return ARTICLE_BANNERS.thidua;
  }

  // Fallback to Category
  if (c.includes('thi đua') || c.includes('phong trào') || c.includes('mặt trận')) {
    return ARTICLE_BANNERS.thidua;
  }
  if (c.includes('bác') || c.includes('hồ chí minh') || c.includes('văn hóa')) {
    return ARTICLE_BANNERS.hoctapbac;
  }
  if (c.includes('an sinh') || c.includes('nghèo') || c.includes('đại đoàn kết')) {
    return ARTICLE_BANNERS.ansinh;
  }
  if (c.includes('giám sát') || c.includes('phản biện') || c.includes('pháp luật')) {
    return ARTICLE_BANNERS.giamsat;
  }
  if (c.includes('khu phố')) {
    return ARTICLE_BANNERS.khupho;
  }
  if (c.includes('thanh niên') || c.includes('tuổi trẻ')) {
    return ARTICLE_BANNERS.thanhnien;
  }

  return ARTICLE_BANNERS.default;
}
