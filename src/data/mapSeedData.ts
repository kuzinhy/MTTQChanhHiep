import { MapCategory, NeighborhoodGIS, MapLocation } from './mapSchema';
import { ARTICLE_BANNERS } from '../utils/officialImages';

export const INITIAL_MAP_CATEGORIES: MapCategory[] = [
  {
    id: 'cat-co-quan',
    name: 'Cơ quan Hành chính & Hệ thống Chính trị',
    code: 'CO_QUAN',
    icon: 'Building2',
    color: '#DC2626', // Red
    bgBadgeColor: 'bg-red-50 border-red-200',
    textBadgeColor: 'text-red-700',
    description: 'Trụ sở Đảng ủy, HĐND, UBND, Ủy ban MTTQ, Công an, Quân sự phường',
    sort_order: 1,
    is_active: true
  },
  {
    id: 'cat-to-chuc',
    name: 'Khối MTTQ & Đoàn thể Chính trị - Xã hội',
    code: 'TO_CHUC',
    icon: 'Users',
    color: '#D97706', // Amber
    bgBadgeColor: 'bg-amber-50 border-amber-200',
    textBadgeColor: 'text-amber-700',
    description: 'Đoàn Thanh niên, Hội Phụ nữ, Hội Cựu chiến binh, Công đoàn, 21 Ban Công tác Mặt trận',
    sort_order: 2,
    is_active: true
  },
  {
    id: 'cat-an-sinh',
    name: 'Điểm Hỗ Trợ An Sinh & Nhân Đạo',
    code: 'AN_SINH',
    icon: 'HeartHandshake',
    color: '#EA580C', // Orange
    bgBadgeColor: 'bg-orange-50 border-orange-200',
    textBadgeColor: 'text-orange-700',
    description: 'Điểm tiếp nhận nhu yếu phẩm, điểm phát quà trợ cấp, bếp ăn tình thương, nhà Đại đoàn kết',
    sort_order: 3,
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
    description: 'Trạm Y tế phường, cơ sở khám chữa bệnh, điểm tiêm chủng, nhà thuốc cộng đồng',
    sort_order: 4,
    is_active: true
  },
  {
    id: 'cat-giao-duc',
    name: 'Giáo dục & Đào tạo',
    code: 'GIAO_DUC',
    icon: 'GraduationCap',
    color: '#2563EB', // Blue
    bgBadgeColor: 'bg-blue-50 border-blue-200',
    textBadgeColor: 'text-blue-700',
    description: 'Trường Mầm non, Tiểu học, Trung học cơ sở, cơ sở giáo dục trên địa bàn',
    sort_order: 5,
    is_active: true
  },
  {
    id: 'cat-cong-dong',
    name: 'Thiết chế Văn hóa & Văn phòng Khu phố',
    code: 'CONG_DONG',
    icon: 'Home',
    color: '#7C3AED', // Purple
    bgBadgeColor: 'bg-purple-50 border-purple-200',
    textBadgeColor: 'text-purple-700',
    description: 'Nhà văn hóa, Văn phòng 21 khu phố, Điểm sinh hoạt cộng đồng, công viên cây xanh',
    sort_order: 6,
    is_active: true
  },
  {
    id: 'cat-ton-giao',
    name: 'Cơ sở Tôn giáo & Tín ngưỡng Hợp pháp',
    code: 'TON_GIAO',
    icon: 'Church',
    color: '#4F46E5', // Indigo
    bgBadgeColor: 'bg-indigo-50 border-indigo-200',
    textBadgeColor: 'text-indigo-700',
    description: 'Chùa, Nhà thờ, cơ sở tín ngưỡng đồng hành cùng Mặt trận trong các phong trào thiện nguyện',
    sort_order: 7,
    is_active: true
  },
  {
    id: 'cat-dich-vu-cong',
    name: 'Dịch vụ Công & Tiện ích Số',
    code: 'DICH_VU_CONG',
    icon: 'ShieldCheck',
    color: '#0D9488', // Teal
    bgBadgeColor: 'bg-teal-50 border-teal-200',
    textBadgeColor: 'text-teal-700',
    description: 'Bộ phận Tiếp nhận & Trả kết quả (Một cửa), Bưu cục, Điểm hướng dẫn Dịch vụ công trực tuyến',
    sort_order: 8,
    is_active: true
  }
];

export const INITIAL_NEIGHBORHOODS_GIS: NeighborhoodGIS[] = Array.from({ length: 21 }, (_, index) => {
  const num = index + 1;
  const numStr = num < 10 ? `0${num}` : `${num}`;
  const id = `kp-${num}`;
  const code = `KP${numStr}`;
  const name = `Khu phố ${numStr}`;
  const slug = `khu-pho-${numStr}`;

  // Center coordinates distributed around Chanh Hiep area: lat ~ 11.000 to 11.035, lng ~ 106.635 to 106.675
  const baseLat = 11.005 + (Math.sin(num * 1.3) * 0.015) + (index * 0.001);
  const baseLng = 106.645 + (Math.cos(num * 1.1) * 0.018) + (index * 0.001);

  // Representative names for 21 neighborhoods
  const frontWorkHeads = [
    'Nguyễn Văn Thành', 'Lê Thị Thu', 'Trần Đình Trọng', 'Phạm Hoàng Nam', 'Võ Thị Mai',
    'Đặng Quốc Bảo', 'Hoàng Minh Tuấn', 'Bùi Văn Hùng', 'Đỗ Thị Lan', 'Ngô Quang Khải',
    'Dương Văn Phúc', 'Vũ Thị Hạnh', 'Lý Tấn Phát', 'Trịnh Xuân Hinh', 'Mai Văn Thắng',
    'Phan Thị Kim Chi', 'Lâm Hoài An', 'Hà Huy Giáp', 'Tạ Minh Tâm', 'Cao Bá Quát', 'Lưu Hữu Phước'
  ];

  const phones = [
    '0908.123.401', '0913.456.702', '0979.888.703', '0983.222.704', '0903.666.705',
    '0918.777.706', '0977.333.707', '0988.444.708', '0909.555.709', '0919.666.710',
    '0978.111.711', '0987.222.712', '0902.333.713', '0912.444.714', '0976.555.715',
    '0986.666.716', '0906.777.717', '0916.888.718', '0975.999.719', '0985.111.720', '0905.222.721'
  ];

  return {
    id,
    code,
    name,
    slug,
    center_lat: Number(baseLat.toFixed(6)),
    center_lng: Number(baseLng.toFixed(6)),
    population: 1850 + (num * 65),
    households: 420 + (num * 18),
    leader_name: `Trưởng KP ${numStr}`,
    leader_position: 'Trưởng Ban điều hành Khu phố',
    phone: phones[index],
    party_cell_secretary: `Bí thư Chi bộ KP ${numStr}`,
    front_work_head: frontWorkHeads[index],
    youth_union_secretary: `Bí thư Chi đoàn KP ${numStr}`,
    address: `Văn phòng Khu phố ${numStr}, Đường Chánh Hiệp ${num}, Phường Chánh Hiệp`,
    description: `Khu phố ${numStr} là đơn vị hành chính cơ sở trực thuộc Phường Chánh Hiệp. Nhân dân chấp hành tốt chủ trương chính sách, đoàn kết xây dựng đời sống văn hóa khu dân cư, tích cực tham gia các phong trào Vì Người Nghèo và Dân vận khéo.`,
    image_url: ARTICLE_BANNERS.thidua,
    status: 'ACTIVE',
    sort_order: num,
    stats: {
      total_locations: 3 + (num % 4),
      welfare_points_count: 1 + (num % 2),
      administrative_points_count: 1,
      medical_points_count: (num % 3 === 0) ? 1 : 0,
      education_points_count: (num % 4 === 0) ? 1 : 0
    }
  };
});

export const INITIAL_MAP_LOCATIONS: MapLocation[] = [
  // =========================================================================
  // 1. CƠ QUAN HÀNH CHÍNH & HỆ THỐNG CHÍNH TRỊ PHƯỜNG
  // =========================================================================
  {
    id: 'loc-ubnd',
    name: 'Trụ sở Đảng ủy - HĐND - UBND Phường Chánh Hiệp',
    slug: 'ubnd-phuong-chanh-hiep',
    category_id: 'cat-co-quan',
    category_code: 'CO_QUAN',
    neighborhood_id: 'kp-1',
    neighborhood_name: 'Khu phố 01',
    neighborhood_code: 'KP01',
    address: 'Số 120 Đường Nguyễn Chí Thanh, Phường Chánh Hiệp, TP. Thủ Dầu Một, Bình Dương',
    latitude: 11.014520,
    longitude: 106.652180,
    description: 'Trung tâm hành chính - chính trị của Phường Chánh Hiệp. Nơi đặt phòng làm việc của Thường trực Đảng ủy, HĐND, UBND và Bộ phận Một cửa phục vụ nhân dân.',
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
    id: 'loc-mttq',
    name: 'Cơ quan Ủy ban MTTQ Việt Nam & Khối Đoàn thể Phường Chánh Hiệp',
    slug: 'mttq-phuong-chanh-hiep',
    category_id: 'cat-to-chuc',
    category_code: 'TO_CHUC',
    neighborhood_id: 'kp-1',
    neighborhood_name: 'Khu phố 01',
    neighborhood_code: 'KP01',
    address: 'Khuôn viên Khối Đoàn thể, Đường Nguyễn Chí Thanh, Phường Chánh Hiệp, TP. Thủ Dầu Một',
    latitude: 11.014850,
    longitude: 106.652390,
    description: 'Trụ sở làm việc của Ban Thường trực Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp cùng các tổ chức chính trị - xã hội: Đoàn TNCS, Hội LH Phụ nữ, Hội CCB, Công đoàn phường.',
    phone: '0274.3822.112',
    email: 'mttq.chanhhiep@gmail.com',
    opening_hours: 'Thứ 2 - Thứ 6: 07:30 - 11:30 & 13:30 - 17:00',
    image_url: ARTICLE_BANNERS.default,
    directions_url: 'https://maps.google.com/?q=11.014850,106.652390',
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
    neighborhood_id: 'kp-2',
    neighborhood_name: 'Khu phố 02',
    neighborhood_code: 'KP02',
    address: 'Đường Lê Chí Dân, Khu phố 02, Phường Chánh Hiệp',
    latitude: 11.018210,
    longitude: 106.649850,
    description: 'Trụ sở Công an Phường Chánh Hiệp, trực ban 24/24 tiếp nhận tin báo tố giác tội phạm, đảm bảo an ninh chính trị và trật tự an toàn xã hội trên địa bàn 21 khu phố.',
    phone: '0274.3822.113',
    opening_hours: 'Trực ban 24/7',
    image_url: ARTICLE_BANNERS.giamsat,
    directions_url: 'https://maps.google.com/?q=11.018210,106.649850',
    is_featured: true,
    is_public: true,
    status: 'ACTIVE'
  },
  {
    id: 'loc-quan-su',
    name: 'Ban Chỉ huy Quân sự Phường Chánh Hiệp',
    slug: 'ban-chi-huy-quan-su-chanh-hiep',
    category_id: 'cat-co-quan',
    category_code: 'CO_QUAN',
    neighborhood_id: 'kp-2',
    neighborhood_name: 'Khu phố 02',
    neighborhood_code: 'KP02',
    address: 'Đường Nguyễn Chí Thanh, Phường Chánh Hiệp',
    latitude: 11.016300,
    longitude: 106.651100,
    description: 'Cơ quan quân sự địa phương, quản lý lực lượng dân quân tự vệ, công tác tuyển chọn và gọi công dân nhập ngũ.',
    phone: '0274.3822.114',
    opening_hours: 'Thứ 2 - Thứ 6: 07:00 - 17:00 (Trực SSCĐ 24/7)',
    image_url: ARTICLE_BANNERS.giamsat,
    directions_url: 'https://maps.google.com/?q=11.016300,106.651100',
    is_featured: false,
    is_public: true,
    status: 'ACTIVE'
  },

  // =========================================================================
  // 2. Y TẾ & CHĂM SÓC SỨC KHỎE
  // =========================================================================
  {
    id: 'loc-tram-y-te',
    name: 'Trạm Y tế Phường Chánh Hiệp',
    slug: 'tram-y-te-phuong-chanh-hiep',
    category_id: 'cat-y-te',
    category_code: 'Y_TE',
    neighborhood_id: 'kp-3',
    neighborhood_name: 'Khu phố 03',
    neighborhood_code: 'KP03',
    address: 'Số 45 Đường Bùi Văn Bình, Khu phố 03, Phường Chánh Hiệp',
    latitude: 11.011800,
    longitude: 106.658200,
    description: 'Cơ sở y tế ban đầu, khám chữa bệnh BHYT, chương trình tiêm chủng mở rộng quốc gia, phòng chống dịch bệnh và chăm sóc sức khỏe người cao tuổi, bà mẹ trẻ em.',
    phone: '0274.3822.115',
    opening_hours: 'Thứ 2 - Thứ 7: 07:30 - 16:30 (Trực cấp cứu 24/24)',
    image_url: ARTICLE_BANNERS.ansinh,
    directions_url: 'https://maps.google.com/?q=11.011800,106.658200',
    is_featured: true,
    is_public: true,
    status: 'ACTIVE'
  },
  {
    id: 'loc-phong-kham-nhan-dao',
    name: 'Điểm Khám Bệnh & Cấp Thuốc Miễn Phí Chữ Thập Đỏ',
    slug: 'diem-kham-benh-nhan-dao-chanh-hiep',
    category_id: 'cat-y-te',
    category_code: 'Y_TE',
    neighborhood_id: 'kp-5',
    neighborhood_name: 'Khu phố 05',
    neighborhood_code: 'KP05',
    address: 'Nhà Văn hóa Khu phố 05, Phường Chánh Hiệp',
    latitude: 11.021100,
    longitude: 106.662400,
    description: 'Điểm khám bệnh nhân đạo do Hội Chữ thập đỏ phường phối hợp Đoàn Y bác sĩ tình nguyện tổ chức định kỳ vào sáng Chủ nhật hàng tuần cho người cao tuổi, gia đình chính sách.',
    phone: '0274.3822.112',
    opening_hours: 'Chủ nhật: 07:30 - 11:00 (Định kỳ hàng tháng)',
    image_url: ARTICLE_BANNERS.ansinh,
    directions_url: 'https://maps.google.com/?q=11.021100,106.662400',
    is_featured: true,
    is_public: true,
    welfare_type: 'FREE_CLINIC',
    status: 'ACTIVE'
  },

  // =========================================================================
  // 3. ĐIỂM HỖ TRỢ AN SINH XÃ HỘI & THIỆN NGUYỆN
  // =========================================================================
  {
    id: 'loc-an-sinh-bep-an',
    name: 'Bếp Ăn Nghĩa Tình & Điểm Cơm 0 Đồng Chánh Hiệp',
    slug: 'bep-an-nghia-tinh-0-dong-chanh-hiep',
    category_id: 'cat-an-sinh',
    category_code: 'AN_SINH',
    neighborhood_id: 'kp-4',
    neighborhood_name: 'Khu phố 04',
    neighborhood_code: 'KP04',
    address: 'Đường ĐX 071, Khu phố 04, Phường Chánh Hiệp',
    latitude: 11.019500,
    longitude: 106.654200,
    description: 'Mô hình Dân vận khéo của Ủy ban MTTQ và Hội Chữ thập đỏ phường, phát cơm trưa miễn phí cho người lao động nghèo, công nhân khó khăn, người bán vé số.',
    phone: '0908.456.789',
    opening_hours: 'Thứ 2, Thứ 4, Thứ 6: 10:30 - 12:30',
    image_url: ARTICLE_BANNERS.ansinh,
    directions_url: 'https://maps.google.com/?q=11.019500,106.654200',
    is_featured: true,
    is_public: true,
    welfare_type: 'COMMUNITY_KITCHEN',
    status: 'ACTIVE'
  },
  {
    id: 'loc-tiep-nhan-cuu-tro',
    name: 'Điểm Tiếp Nhận & Phân Phối Hàng Cứu Trợ Quỹ Vì Người Nghèo',
    slug: 'diem-tiep-nhan-cuu-tro-quy-vi-ngheo',
    category_id: 'cat-an-sinh',
    category_code: 'AN_SINH',
    neighborhood_id: 'kp-1',
    neighborhood_name: 'Khu phố 01',
    neighborhood_code: 'KP01',
    address: 'Sảnh Khối Mặt trận - Đoàn thể, Đường Nguyễn Chí Thanh',
    latitude: 11.014900,
    longitude: 106.652500,
    description: 'Điểm tập kết nhu yếu phẩm, gạo, sữa, học bổng từ các tổ chức tôn giáo, doanh nghiệp và nhà hảo tâm để điều phối đến 21 khu phố.',
    phone: '0274.3822.112',
    opening_hours: 'Thứ 2 - Thứ 7: 08:00 - 17:00',
    image_url: ARTICLE_BANNERS.ansinh,
    directions_url: 'https://maps.google.com/?q=11.014900,106.652500',
    is_featured: true,
    is_public: true,
    welfare_type: 'RECEIVING_POINT',
    status: 'ACTIVE'
  },
  {
    id: 'loc-an-sinh-gian-hang',
    name: 'Gian Hàng 0 Đồng - Đổi Rác Thải Nhựa Lấy Quà Tặng',
    slug: 'gian-hang-0-dong-khu-pho-07',
    category_id: 'cat-an-sinh',
    category_code: 'AN_SINH',
    neighborhood_id: 'kp-7',
    neighborhood_name: 'Khu phố 07',
    neighborhood_code: 'KP07',
    address: 'Khu vực Hoa viên Khu phố 07, Phường Chánh Hiệp',
    latitude: 11.025400,
    longitude: 106.643200,
    description: 'Chương trình bảo vệ môi trường kết hợp an sinh xã hội do Đoàn Thanh niên và Hội LH Phụ nữ phối hợp thực hiện định kỳ hàng tháng.',
    phone: '0913.789.123',
    opening_hours: 'Thứ 7 tuần thứ 2 hàng tháng: 07:30 - 11:30',
    image_url: ARTICLE_BANNERS.thidua,
    directions_url: 'https://maps.google.com/?q=11.025400,106.643200',
    is_featured: false,
    is_public: true,
    welfare_type: 'GIFT_DISTRIBUTION',
    status: 'ACTIVE'
  },

  // =========================================================================
  // 4. GIÁO DỤC & TRƯỜNG HỌC
  // =========================================================================
  {
    id: 'loc-thcs-chanh-hiep',
    name: 'Trường Trung học Cơ sở Chánh Hiệp',
    slug: 'truong-thcs-chanh-hiep',
    category_id: 'cat-giao-duc',
    category_code: 'GIAO_DUC',
    neighborhood_id: 'kp-6',
    neighborhood_name: 'Khu phố 06',
    neighborhood_code: 'KP06',
    address: 'Đường Bùi Văn Bình, Khu phố 06, Phường Chánh Hiệp',
    latitude: 11.013500,
    longitude: 106.660500,
    description: 'Trường THCS chuẩn quốc gia, nơi có Chi đoàn, Chi hội Khuyến học và Chi hội Chữ thập đỏ trường học hoạt động tích cực.',
    phone: '0274.3822.116',
    image_url: ARTICLE_BANNERS.thidua,
    directions_url: 'https://maps.google.com/?q=11.013500,106.660500',
    is_featured: true,
    is_public: true,
    status: 'ACTIVE'
  },
  {
    id: 'loc-tieu-hoc-chanh-hiep',
    name: 'Trường Tiểu học Chánh Hiệp',
    slug: 'truong-tieu-hoc-chanh-hiep',
    category_id: 'cat-giao-duc',
    category_code: 'GIAO_DUC',
    neighborhood_id: 'kp-8',
    neighborhood_name: 'Khu phố 08',
    neighborhood_code: 'KP08',
    address: 'Đường Nguyễn Chí Thanh, Khu phố 08, Phường Chánh Hiệp',
    latitude: 11.022800,
    longitude: 106.648900,
    description: 'Trường Tiểu học Chánh Hiệp, đơn vị đạt chuẩn phong trào thi đua "Xây dựng trường học thân thiện, học sinh tích cực".',
    phone: '0274.3822.117',
    image_url: ARTICLE_BANNERS.thidua,
    directions_url: 'https://maps.google.com/?q=11.022800,106.648900',
    is_featured: false,
    is_public: true,
    status: 'ACTIVE'
  },
  {
    id: 'loc-mam-non-hoa-cuc',
    name: 'Trường Mầm non Hoa Cúc Chánh Hiệp',
    slug: 'truong-mam-non-hoa-cuc-chanh-hiep',
    category_id: 'cat-giao-duc',
    category_code: 'GIAO_DUC',
    neighborhood_id: 'kp-3',
    neighborhood_name: 'Khu phố 03',
    neighborhood_code: 'KP03',
    address: 'Khu dân cư Chánh Hiệp, Khu phố 03',
    latitude: 11.010500,
    longitude: 106.657100,
    description: 'Trường mầm non công lập chăm sóc và nuôi dạy trẻ từ 18 tháng đến 5 tuổi trên địa bàn.',
    phone: '0274.3822.118',
    image_url: ARTICLE_BANNERS.thidua,
    directions_url: 'https://maps.google.com/?q=11.010500,106.657100',
    is_featured: false,
    is_public: true,
    status: 'ACTIVE'
  },

  // =========================================================================
  // 5. CƠ SỞ TÔN GIÁO & TÍN NGƯỠNG ĐỒNG HÀNH
  // =========================================================================
  {
    id: 'loc-chua-to',
    name: 'Chùa Tây Thiên - Điểm Tôn Giáo Gương Mẫu Vì Cộng Đồng',
    slug: 'chua-tay-thien-chanh-hiep',
    category_id: 'cat-ton-giao',
    category_code: 'TON_GIAO',
    neighborhood_id: 'kp-9',
    neighborhood_name: 'Khu phố 09',
    neighborhood_code: 'KP09',
    address: 'Đường Lê Chí Dân, Khu phố 09, Phường Chánh Hiệp',
    latitude: 11.028900,
    longitude: 106.641200,
    description: 'Cơ sở Phật giáo tiêu biểu luôn tích cực đồng hành cùng MTTQ phường trong công tác từ thiện, hỗ trợ hàng trăm phần quà tết và học bổng cho học sinh nghèo hiếu học.',
    phone: '0274.3822.119',
    opening_hours: 'Hàng ngày: 06:00 - 21:00',
    image_url: ARTICLE_BANNERS.hoctapbac,
    directions_url: 'https://maps.google.com/?q=11.028900,106.641200',
    is_featured: true,
    is_public: true,
    status: 'ACTIVE'
  },
  {
    id: 'loc-nha-tho',
    name: 'Giáo xứ Chánh Hiệp',
    slug: 'giao-xu-chanh-hiep',
    category_id: 'cat-ton-giao',
    category_code: 'TON_GIAO',
    neighborhood_id: 'kp-10',
    neighborhood_name: 'Khu phố 10',
    neighborhood_code: 'KP10',
    address: 'Đường ĐX 082, Khu phố 10, Phường Chánh Hiệp',
    latitude: 11.017500,
    longitude: 106.666800,
    description: 'Cộng đồng giáo dân sống "Tốt đời - Đẹp đạo", hăng hái tham gia phong trào Toàn dân đoàn kết xây dựng đời sống văn hóa ở khu dân cư.',
    phone: '0274.3822.120',
    opening_hours: 'Hàng ngày: 05:00 - 20:00',
    image_url: ARTICLE_BANNERS.hoctapbac,
    directions_url: 'https://maps.google.com/?q=11.017500,106.666800',
    is_featured: false,
    is_public: true,
    status: 'ACTIVE'
  },

  // =========================================================================
  // 6. THIẾT CHẾ VĂN HÓA & VĂN PHÒNG 21 KHU PHỐ
  // =========================================================================
  ...Array.from({ length: 21 }, (_, idx) => {
    const num = idx + 1;
    const numStr = num < 10 ? `0${num}` : `${num}`;
    const lat = 11.006 + (Math.sin(num * 1.3) * 0.015) + (idx * 0.001);
    const lng = 106.646 + (Math.cos(num * 1.1) * 0.018) + (idx * 0.001);

    return {
      id: `loc-vpkp-${num}`,
      name: `Văn phòng & Nhà Văn hóa Khu phố ${numStr}`,
      slug: `van-phong-nha-van-hoa-khu-pho-${numStr}`,
      category_id: 'cat-cong-dong',
      category_code: 'CONG_DONG',
      neighborhood_id: `kp-${num}`,
      neighborhood_name: `Khu phố ${numStr}`,
      neighborhood_code: `KP${numStr}`,
      address: `Văn phòng Khu phố ${numStr}, Phường Chánh Hiệp`,
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
      description: `Trụ sở làm việc của Ban Điều hành và Ban Công tác Mặt trận Khu phố ${numStr}. Nơi hội họp, tiếp công dân và tổ chức các hoạt động sinh hoạt văn hóa, thể thao, ngày hội Đại đoàn kết toàn dân tộc (18/11) hàng năm.`,
      phone: `0908.${numStr}1.234`,
      opening_hours: 'Thứ 2 - Thứ 7: 07:30 - 17:00 & Các buổi tối sinh hoạt chi bộ',
      image_url: ARTICLE_BANNERS.default,
      directions_url: `https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`,
      is_featured: num <= 3,
      is_public: true,
      status: 'ACTIVE' as const
    };
  })
];
