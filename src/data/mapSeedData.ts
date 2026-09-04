import { MapCategory, NeighborhoodGIS, MapLocation } from './mapSchema';
import { ARTICLE_BANNERS } from '../utils/officialImages';

export const INITIAL_MAP_CATEGORIES: MapCategory[] = [
  {
    id: 'cat-dia-chi-do',
    name: 'Địa chỉ đỏ & Di tích Lịch sử',
    code: 'DIA_CHI_DO',
    icon: 'Landmark',
    color: '#DC2626', // Red
    bgBadgeColor: 'bg-red-50 border-red-200',
    textBadgeColor: 'text-red-700',
    description: 'Di tích lịch sử cách mạng, nhà truyền thống, địa điểm lưu niệm sự kiện lịch sử tại địa phương',
    sort_order: 1,
    is_active: true
  },
  {
    id: 'cat-lang-nghe',
    name: 'Làng nghề Truyền thống & Văn hóa',
    code: 'LANG_NGHE',
    icon: 'Palette',
    color: '#D97706', // Amber
    bgBadgeColor: 'bg-amber-50 border-amber-200',
    textBadgeColor: 'text-amber-700',
    description: 'Làng nghề mộc truyền thống, gốm sứ thủ công, cơ sở di sản văn hóa phi vật thể tại địa phương',
    sort_order: 2,
    is_active: true
  },
  {
    id: 'cat-co-quan',
    name: 'Cơ quan Hành chính & Hệ thống Chính trị',
    code: 'CO_QUAN',
    icon: 'Building2',
    color: '#2563EB', // Blue
    bgBadgeColor: 'bg-blue-50 border-blue-200',
    textBadgeColor: 'text-blue-700',
    description: 'Trụ sở Đảng ủy, HĐND, UBND, Ủy ban MTTQ, Công an, Quân sự phường',
    sort_order: 3,
    is_active: true
  },
  {
    id: 'cat-an-sinh',
    name: 'Điểm Hỗ Trợ An Sinh & Thiện Nguyện',
    code: 'AN_SINH',
    icon: 'HeartHandshake',
    color: '#EA580C', // Orange
    bgBadgeColor: 'bg-orange-50 border-orange-200',
    textBadgeColor: 'text-orange-700',
    description: 'Bếp ăn nghĩa tình, điểm phát quà trợ cấp, nhà Đại đoàn kết, điểm tiếp nhận nhu yếu phẩm',
    sort_order: 4,
    is_active: true
  },
  {
    id: 'cat-y-te',
    name: 'Y tế & Chăm sóc Sức khỏe',
    code: 'Y_TE',
    icon: 'Stethoscope',
    color: '#059669', // Emerald
    bgBadgeColor: 'bg-emerald-50 border-emerald-200',
    textBadgeColor: 'text-emerald-700',
    description: 'Trạm Y tế phường, cơ sở khám chữa bệnh nhân đạo, điểm tiêm chủng',
    sort_order: 5,
    is_active: true
  },
  {
    id: 'cat-giao-duc',
    name: 'Giáo dục & Đào tạo',
    code: 'GIAO_DUC',
    icon: 'GraduationCap',
    color: '#4F46E5', // Indigo
    bgBadgeColor: 'bg-indigo-50 border-indigo-200',
    textBadgeColor: 'text-indigo-700',
    description: 'Trường Mầm non, Tiểu học, Trung học cơ sở trên địa bàn',
    sort_order: 6,
    is_active: true
  },
  {
    id: 'cat-ton-giao',
    name: 'Cơ sở Tôn giáo & Tín ngưỡng',
    code: 'TON_GIAO',
    icon: 'Church',
    color: '#7C3AED', // Purple
    bgBadgeColor: 'bg-purple-50 border-purple-200',
    textBadgeColor: 'text-purple-700',
    description: 'Chùa, Nhà thờ, đình miếu đồng hành cùng phong trào thi đua yêu nước',
    sort_order: 7,
    is_active: true
  }
];

export const INITIAL_NEIGHBORHOODS_GIS: NeighborhoodGIS[] = [];

export const INITIAL_MAP_LOCATIONS: MapLocation[] = [
  // 1. ĐỊA CHỈ ĐỎ & DI TÍCH LỊCH SỬ
  {
    id: 'loc-dia-chi-do-1',
    name: 'Nhà Truyền Thống Cách Mạng & Căn Cứ Kháng Chiến Phường Chánh Hiệp',
    slug: 'nha-truyen-thong-cach-mang-chanh-hiep',
    category_id: 'cat-dia-chi-do',
    category_code: 'DIA_CHI_DO',
    address: 'Đường Nguyễn Chí Thanh, Phường Chánh Hiệp, TP. Thủ Dầu Một, Bình Dương',
    latitude: 11.015200,
    longitude: 106.653100,
    description: 'Địa chỉ đỏ giáo dục truyền thống cách mạng, trưng bày hiện vật, tư liệu lịch sử hào hùng của Đảng bộ, quân và dân Chánh Hiệp qua các thời kỳ kháng chiến.',
    phone: '0274.3822.111',
    opening_hours: 'Thứ 2 - Thứ 6: 07:30 - 17:00 (Mở cửa đón khách tham quan)',
    image_url: ARTICLE_BANNERS.hoctapbac,
    directions_url: 'https://maps.google.com/?q=11.015200,106.653100',
    is_featured: true,
    is_public: true,
    status: 'ACTIVE'
  },
  {
    id: 'loc-dia-chi-do-2',
    name: 'Đình Thần Chánh Hiệp - Di Tích Kiến Trúc Nghệ Thuật Truyền Thống',
    slug: 'dinh-than-chanh-hiep',
    category_id: 'cat-dia-chi-do',
    category_code: 'DIA_CHI_DO',
    address: 'Đường Lê Chí Dân, Phường Chánh Hiệp, TP. Thủ Dầu Một, Bình Dương',
    latitude: 11.019400,
    longitude: 106.648200,
    description: 'Ngôi đình cổ mang đậm dấu ấn kiến trúc truyền thống Nam Bộ, nơi diễn ra các lễ hội kỳ yên truyền thống và gắn liền với các hoạt động sinh hoạt tín ngưỡng cộng đồng lâu đời.',
    phone: '0274.3822.122',
    opening_hours: 'Hàng ngày: 06:00 - 18:00',
    image_url: ARTICLE_BANNERS.thidua,
    directions_url: 'https://maps.google.com/?q=11.019400,106.648200',
    is_featured: true,
    is_public: true,
    status: 'ACTIVE'
  },
  
  // 2. LÀNG NGHỀ TRUYỀN THỐNG & VĂN HÓA
  {
    id: 'loc-lang-nghe-1',
    name: 'Làng Nghề Mộc Mỹ Nghệ Truyền Thống Chánh Hiệp',
    slug: 'lang-nghe-moc-my-nghe-chanh-hiep',
    category_id: 'cat-lang-nghe',
    category_code: 'LANG_NGHE',
    address: 'Khu vực tuyến đường nghề truyền thống, Phường Chánh Hiệp',
    latitude: 11.023100,
    longitude: 106.641500,
    description: 'Làng nghề mộc mỹ nghệ truyền thống lâu đời với các nghệ nhân tài hoa chuyên chạm trổ, điêu khắc gỗ tinh xảo, góp phần bảo tồn và phát huy di sản thủ công mỹ nghệ địa phương.',
    phone: '0908.111.222',
    opening_hours: 'Thứ 2 - Chủ Nhật: 08:00 - 17:30',
    image_url: ARTICLE_BANNERS.thidua,
    directions_url: 'https://maps.google.com/?q=11.023100,106.641500',
    is_featured: true,
    is_public: true,
    status: 'ACTIVE'
  },
  {
    id: 'loc-lang-nghe-2',
    name: 'Cơ Sở Gốm Sứ Thủ Công Truyền Thống Chánh Hiệp',
    slug: 'co-so-gom-su-thu-cong-chanh-hiep',
    category_id: 'cat-lang-nghe',
    category_code: 'LANG_NGHE',
    address: 'Đường Bùi Văn Bình, Phường Chánh Hiệp',
    latitude: 11.012300,
    longitude: 106.659400,
    description: 'Nơi lưu giữ kỹ thuật làm gốm thủ công mỹ nghệ truyền thống của đất Thủ - Bình Dương, trưng bày các sản phẩm gốm nung tinh xảo.',
    phone: '0913.333.444',
    opening_hours: 'Hàng ngày: 08:00 - 18:00',
    image_url: ARTICLE_BANNERS.thidua,
    directions_url: 'https://maps.google.com/?q=11.012300,106.659400',
    is_featured: true,
    is_public: true,
    status: 'ACTIVE'
  },

  // 3. CƠ QUAN HÀNH CHÍNH & HỆ THỐNG CHÍNH TRỊ
  {
    id: 'loc-ubnd',
    name: 'Trụ sở Đảng ủy - HĐND - UBND - Ủy ban MTTQ Việt Nam Phường Chánh Hiệp',
    slug: 'ubnd-phuong-chanh-hiep',
    category_id: 'cat-co-quan',
    category_code: 'CO_QUAN',
    address: 'Số 120 Đường Nguyễn Chí Thanh, Phường Chánh Hiệp, TP. Thủ Dầu Một, Bình Dương',
    latitude: 11.014520,
    longitude: 106.652180,
    description: 'Trung tâm hành chính - chính trị của Phường Chánh Hiệp. Nơi đặt trụ sở Đảng ủy, HĐND, UBND và Ủy ban MTTQ Việt Nam phường.',
    phone: '0274.3822.111',
    email: 'ubnd.chanhhiep@binhduong.gov.vn',
    website: 'https://chanhhiep.thudaumot.binhduong.gov.vn',
    opening_hours: 'Thứ 2 - Thứ 6: 07:00 - 11:30 & 13:30 - 17:00',
    image_url: ARTICLE_BANNERS.default,
    directions_url: 'https://maps.google.com/?q=11.014520,106.652180',
    is_featured: true,
    is_public: true,
    status: 'ACTIVE'
  },
  {
    id: 'loc-cong-an',
    name: 'Công an Phường Chánh Hiệp',
    slug: 'cong-an-phuong-chanh-hiep',
    category_id: 'cat-co-quan',
    category_code: 'CO_QUAN',
    address: 'Đường Lê Chí Dân, Phường Chánh Hiệp',
    latitude: 11.018210,
    longitude: 106.649850,
    description: 'Trụ sở Công an Phường Chánh Hiệp, trực ban 24/24 tiếp nhận tin báo tố giác tội phạm, đảm bảo an ninh trật tự.',
    phone: '0274.3822.113',
    opening_hours: 'Trực ban 24/7',
    image_url: ARTICLE_BANNERS.giamsat,
    directions_url: 'https://maps.google.com/?q=11.018210,106.649850',
    is_featured: false,
    is_public: true,
    status: 'ACTIVE'
  },

  // 4. Y TẾ & CHĂM SÓC SỨC KHỎE
  {
    id: 'loc-tram-y-te',
    name: 'Trạm Y tế Phường Chánh Hiệp',
    slug: 'tram-y-te-phuong-chanh-hiep',
    category_id: 'cat-y-te',
    category_code: 'Y_TE',
    address: 'Số 45 Đường Bùi Văn Bình, Phường Chánh Hiệp',
    latitude: 11.011800,
    longitude: 106.658200,
    description: 'Cơ sở y tế ban đầu, khám chữa bệnh BHYT, tiêm chủng mở rộng và chăm sóc sức khỏe nhân dân.',
    phone: '0274.3822.115',
    opening_hours: 'Thứ 2 - Thứ 7: 07:30 - 16:30 (Trực cấp cứu 24/24)',
    image_url: ARTICLE_BANNERS.ansinh,
    directions_url: 'https://maps.google.com/?q=11.011800,106.658200',
    is_featured: true,
    is_public: true,
    status: 'ACTIVE'
  },

  // 5. ĐIỂM AN SINH & THIỆN NGUYỆN
  {
    id: 'loc-bep-an',
    name: 'Bếp Ăn Nghĩa Tình & Điểm Cơm 0 Đồng Chánh Hiệp',
    slug: 'bep-an-nghia-tinh-0-dong-chanh-hiep',
    category_id: 'cat-an-sinh',
    category_code: 'AN_SINH',
    address: 'Đường ĐX 071, Phường Chánh Hiệp',
    latitude: 11.019500,
    longitude: 106.654200,
    description: 'Mô hình Dân vận khéo của Ủy ban MTTQ và các đoàn thể phường, phát những phần ăn miễn phí hỗ trợ người lao động nghèo.',
    phone: '0908.456.789',
    opening_hours: 'Thứ 2, Thứ 4, Thứ 6: 10:30 - 12:30',
    image_url: ARTICLE_BANNERS.ansinh,
    directions_url: 'https://maps.google.com/?q=11.019500,106.654200',
    is_featured: true,
    is_public: true,
    welfare_type: 'COMMUNITY_KITCHEN',
    status: 'ACTIVE'
  },

  // 6. GIÁO DỤC & ĐÀO TẠO
  {
    id: 'loc-thcs',
    name: 'Trường Trung học Cơ sở Chánh Hiệp',
    slug: 'truong-thcs-chanh-hiep',
    category_id: 'cat-giao-duc',
    category_code: 'GIAO_DUC',
    address: 'Đường Bùi Văn Bình, Phường Chánh Hiệp',
    latitude: 11.013500,
    longitude: 106.660500,
    description: 'Trường THCS đạt chuẩn quốc gia, môi trường giáo dục chất lượng cao.',
    phone: '0274.3822.116',
    image_url: ARTICLE_BANNERS.thidua,
    directions_url: 'https://maps.google.com/?q=11.013500,106.660500',
    is_featured: false,
    is_public: true,
    status: 'ACTIVE'
  },

  // 7. CƠ SỞ TÔN GIÁO & TÍN NGƯỠNG
  {
    id: 'loc-chua',
    name: 'Chùa Tây Thiên - Điểm Tôn Giáo Gương Mẫu Vì Cộng Đồng',
    slug: 'chua-tay-thien-chanh-hiep',
    category_id: 'cat-ton-giao',
    category_code: 'TON_GIAO',
    address: 'Đường Lê Chí Dân, Phường Chánh Hiệp',
    latitude: 11.028900,
    longitude: 106.641200,
    description: 'Cơ sở Phật giáo tiêu biểu tích cực tham gia các phong trào từ thiện nhân đạo, an sinh xã hội.',
    phone: '0274.3822.119',
    opening_hours: 'Hàng ngày: 06:00 - 21:00',
    image_url: ARTICLE_BANNERS.hoctapbac,
    directions_url: 'https://maps.google.com/?q=11.028900,106.641200',
    is_featured: false,
    is_public: true,
    status: 'ACTIVE'
  }
];
