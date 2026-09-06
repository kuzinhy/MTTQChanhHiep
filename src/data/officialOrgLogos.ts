export interface OfficialOrgLogo {
  id: string;
  name: string;
  shortName: string;
  category: 'CHINH_TRI_XA_HOI' | 'DOAN_THANH_NIEN_THIEU_NHI' | 'XA_HOI_NGHE_NGHIEP' | 'BIEU_TRUNG_NHA_NUOC';
  categoryLabel: string;
  url: string;
  defaultName?: string;
  defaultPosition?: string;
  color?: string;
}

export const OFFICIAL_ORG_LOGOS: OfficialOrgLogo[] = [
  {
    id: 'logo-dtn',
    name: 'Đoàn TNCS Hồ Chí Minh',
    shortName: 'Đoàn Thanh niên',
    category: 'DOAN_THANH_NIEN_THIEU_NHI',
    categoryLabel: 'Đoàn - Đội - Thanh thiếu nhi',
    url: 'https://sv2.anhsieuviet.com/2026/09/04/snapedit_1706697500696.png',
    defaultName: 'Đoàn TNCS Hồ Chí Minh phường Chánh Hiệp',
    defaultPosition: 'Bí thư Đoàn phường',
    color: 'emerald'
  },
  {
    id: 'logo-phunu',
    name: 'Hội Liên hiệp Phụ nữ Việt Nam',
    shortName: 'Hội Phụ nữ',
    category: 'CHINH_TRI_XA_HOI',
    categoryLabel: 'Chính trị - Xã hội nòng cốt',
    url: 'https://sv2.anhsieuviet.com/2026/09/04/phu-nu.png',
    defaultName: 'Hội Liên hiệp Phụ nữ phường Chánh Hiệp',
    defaultPosition: 'Chủ tịch Hội Phụ nữ',
    color: 'pink'
  },
  {
    id: 'logo-ccb',
    name: 'Hội Cựu chiến binh Việt Nam',
    shortName: 'Hội Cựu chiến binh',
    category: 'CHINH_TRI_XA_HOI',
    categoryLabel: 'Chính trị - Xã hội nòng cốt',
    url: 'https://sv2.anhsieuviet.com/2026/09/04/Logo-Cu-Chien-Binh-Viet-Nam-Mu-1.png',
    defaultName: 'Hội Cựu chiến binh phường Chánh Hiệp',
    defaultPosition: 'Chủ tịch Hội Cựu chiến binh',
    color: 'purple'
  },
  {
    id: 'logo-congdoan',
    name: 'Công đoàn Việt Nam',
    shortName: 'Công đoàn cơ quan',
    category: 'CHINH_TRI_XA_HOI',
    categoryLabel: 'Chính trị - Xã hội nòng cốt',
    url: 'https://sv2.anhsieuviet.com/2026/09/04/congdoan.png',
    defaultName: 'Công đoàn Cơ quan phường Chánh Hiệp',
    defaultPosition: 'Chủ tịch Công đoàn',
    color: 'blue'
  },
  {
    id: 'logo-lhtn',
    name: 'Hội Liên hiệp Thanh niên Việt Nam',
    shortName: 'Hội LHTN',
    category: 'DOAN_THANH_NIEN_THIEU_NHI',
    categoryLabel: 'Đoàn - Đội - Thanh thiếu nhi',
    url: 'https://sv2.anhsieuviet.com/2026/09/04/logo-hoi-lien-hiep-thanh-nien-viet-nam-1392x1392.png',
    defaultName: 'Hội Liên hiệp Thanh niên phường Chánh Hiệp',
    defaultPosition: 'Chủ tịch Hội LHTN',
    color: 'sky'
  },
  {
    id: 'logo-mttq',
    name: 'Ủy ban Mặt trận Tổ quốc Việt Nam',
    shortName: 'Ủy ban MTTQ',
    category: 'CHINH_TRI_XA_HOI',
    categoryLabel: 'Chính trị - Xã hội nòng cốt',
    url: 'https://sv2.anhsieuviet.com/2026/09/04/logo-mt-tran---Copy.png',
    defaultName: 'Ủy ban Mặt trận Tổ quốc Việt Nam phường Chánh Hiệp',
    defaultPosition: 'Chủ tịch Ủy ban MTTQ',
    color: 'red'
  },
  {
    id: 'logo-tntp',
    name: 'Đội Thiếu niên Tiền phong Hồ Chí Minh',
    shortName: 'Đội TNTP',
    category: 'DOAN_THANH_NIEN_THIEU_NHI',
    categoryLabel: 'Đoàn - Đội - Thanh thiếu nhi',
    url: 'https://sv2.anhsieuviet.com/2026/09/04/Logo-Doi-Thieu-nien-Tien-phong-Ho-Chi-Minh.png',
    defaultName: 'Hội đồng Đội phường Chánh Hiệp',
    defaultPosition: 'Chủ tịch Hội đồng Đội',
    color: 'amber'
  },
  {
    id: 'logo-ctd',
    name: 'Hội Chữ thập đỏ Việt Nam',
    shortName: 'Hội Chữ thập đỏ',
    category: 'XA_HOI_NGHE_NGHIEP',
    categoryLabel: 'Tổ chức Xã hội - Nhân đạo',
    url: 'https://sv2.anhsieuviet.com/2026/09/04/logo-chu-thap-do.png',
    defaultName: 'Hội Chữ thập đỏ phường Chánh Hiệp',
    defaultPosition: 'Chủ tịch Hội Chữ thập đỏ',
    color: 'rose'
  },
  {
    id: 'logo-nct',
    name: 'Hội Người cao tuổi Việt Nam',
    shortName: 'Hội Người cao tuổi',
    category: 'XA_HOI_NGHE_NGHIEP',
    categoryLabel: 'Tổ chức Xã hội - Nhân đạo',
    url: 'https://sv2.anhsieuviet.com/2026/09/04/nguoicaotuoi.png',
    defaultName: 'Hội Người cao tuổi phường Chánh Hiệp',
    defaultPosition: 'Trưởng ban Đại diện Hội NCT',
    color: 'emerald'
  },
  {
    id: 'logo-nongdan',
    name: 'Hội Nông dân Việt Nam',
    shortName: 'Hội Nông dân',
    category: 'CHINH_TRI_XA_HOI',
    categoryLabel: 'Chính trị - Xã hội nòng cốt',
    url: 'https://sv2.anhsieuviet.com/2026/09/04/hoi-nong-dan.png',
    defaultName: 'Hội Nông dân phường Chánh Hiệp',
    defaultPosition: 'Chủ tịch Hội Nông dân',
    color: 'emerald'
  },
  {
    id: 'logo-svvn',
    name: 'Hội Sinh viên Việt Nam',
    shortName: 'Hội Sinh viên',
    category: 'DOAN_THANH_NIEN_THIEU_NHI',
    categoryLabel: 'Đoàn - Đội - Thanh thiếu nhi',
    url: 'https://sv2.anhsieuviet.com/2026/09/04/400px-Huy_hieu_Hoi_SVVN.svg.png',
    defaultName: 'Chi hội Sinh viên / Câu lạc bộ Sinh viên',
    defaultPosition: 'Chi hội trưởng',
    color: 'sky'
  },
  {
    id: 'logo-quochuy',
    name: 'Quốc huy Nước CHXHCN Việt Nam',
    shortName: 'Quốc huy',
    category: 'BIEU_TRUNG_NHA_NUOC',
    categoryLabel: 'Biểu trưng Nhà nước & Pháp luật',
    url: 'https://sv2.anhsieuviet.com/2026/09/04/quc-huy.png',
    defaultName: 'Ủy ban Nhân dân phường Chánh Hiệp',
    defaultPosition: 'Chủ tịch UBND phường',
    color: 'red'
  },
  {
    id: 'logo-toaan',
    name: 'Tòa án / Ngành Tư pháp & Pháp luật',
    shortName: 'Pháp luật / Hòa giải',
    category: 'BIEU_TRUNG_NHA_NUOC',
    categoryLabel: 'Biểu trưng Nhà nước & Pháp luật',
    url: 'https://sv2.anhsieuviet.com/2026/09/04/logo-toa-an-inkythuatso-01.png',
    defaultName: 'Hội Luật gia / Tổ Hòa giải cơ sở',
    defaultPosition: 'Tổ trưởng Tổ Hòa giải',
    color: 'amber'
  },
  {
    id: 'logo-csgt',
    name: 'Công an & Cảnh sát Giao thông',
    shortName: 'Công an / An ninh',
    category: 'BIEU_TRUNG_NHA_NUOC',
    categoryLabel: 'Biểu trưng Nhà nước & Pháp luật',
    url: 'https://sv2.anhsieuviet.com/2026/09/04/Phu_hieu_canh_sat_giao_thong.png',
    defaultName: 'Công an phường Chánh Hiệp',
    defaultPosition: 'Trưởng Công an phường',
    color: 'yellow'
  },
  {
    id: 'logo-muahexanh',
    name: 'Chiến dịch Mùa Hè Xanh',
    shortName: 'Mùa Hè Xanh',
    category: 'DOAN_THANH_NIEN_THIEU_NHI',
    categoryLabel: 'Phong trào & Chiến dịch Tình nguyện',
    url: 'https://sv2.anhsieuviet.com/2026/09/04/Logo-Chien-Dich-Mua-He-Xanh.webp',
    defaultName: 'Ban Chỉ huy Chiến dịch Mùa Hè Xanh',
    defaultPosition: 'Chỉ huy trưởng',
    color: 'blue'
  },
  {
    id: 'logo-hoaphuongdo',
    name: 'Chiến dịch Hoa Phượng Đỏ',
    shortName: 'Hoa Phượng Đỏ',
    category: 'DOAN_THANH_NIEN_THIEU_NHI',
    categoryLabel: 'Phong trào & Chiến dịch Tình nguyện',
    url: 'https://sv2.anhsieuviet.com/2026/09/04/Logo-Chien-Dich-Hoa-Phuong-Do.webp',
    defaultName: 'Ban Chỉ huy Chiến dịch Hoa Phượng Đỏ',
    defaultPosition: 'Chỉ huy trưởng',
    color: 'red'
  },
  {
    id: 'logo-xuantinhnguyen',
    name: 'Chiến dịch Xuân Tình Nguyện',
    shortName: 'Xuân Tình Nguyện',
    category: 'DOAN_THANH_NIEN_THIEU_NHI',
    categoryLabel: 'Phong trào & Chiến dịch Tình nguyện',
    url: 'https://sv2.anhsieuviet.com/2026/09/04/Logo-Chien-Dich-Xuan-Tinh-Nguyen.png',
    defaultName: 'Ban Chỉ huy Chiến dịch Xuân Tình Nguyện',
    defaultPosition: 'Chỉ huy trưởng',
    color: 'amber'
  },
  {
    id: 'logo-doanvien',
    name: 'Huy hiệu Đoàn viên / Biểu trưng Thanh niên',
    shortName: 'Thanh niên số',
    category: 'DOAN_THANH_NIEN_THIEU_NHI',
    categoryLabel: 'Phong trào & Chiến dịch Tình nguyện',
    url: 'https://sv2.anhsieuviet.com/2026/09/04/zyro-image-1.png',
    defaultName: 'Câu lạc bộ Thanh niên xung kích Chánh Hiệp',
    defaultPosition: 'Chủ nhiệm CLB',
    color: 'sky'
  }
];
