/**
 * BẢO TÀNG SỐ / KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH
 * DỮ LIỆU ĐÃ ĐỐI CHIẾU VÀ XÁC THỰC THEO CÁC NGUỒN CHÍNH THỐNG (LEVEL A):
 * 1. Hồ Chí Minh Toàn tập (NXB Chính trị quốc gia Sự thật, xuất bản lần thứ 3).
 * 2. Hồ Chí Minh – Biên niên tiểu sử (NXB Chính trị quốc gia Sự thật).
 * 3. Cổng thông tin điện tử Hồ Chí Minh (hochiminh.vn).
 * 4. Cổng Tư liệu – Văn kiện Đảng (tulieuvankien.dangcongsan.vn).
 * 5. Nghị quyết 24C/18.65 của UNESCO (UNESDOC, 1987).
 */

export type SourceLevel = 'LEVEL_A_PRIMARY' | 'LEVEL_B_OFFICIAL' | 'LEVEL_C_INTERNATIONAL';
export type VerificationStatus = 'VERIFIED' | 'NEED_REVIEW';

export interface HistoricalSource {
  id: string;
  title: string;
  institution: string;
  volume?: number;
  edition?: string;
  publisher?: string;
  publicationYear?: number;
  page?: string;
  officialUrl?: string;
  sourceLevel: SourceLevel;
  archiveCode?: string;
}

export interface HistoricalPeriod {
  id: string;
  periodNumber: number;
  timeRange: string;
  title: string;
  subtitle: string;
  description: string;
  keyMilestones: string[];
  themeColor: string;
  imageUrl: string;
}

export interface HistoricalEvent {
  id: string;
  periodId: string;
  year: number;
  dateLabel: string;
  exactDate?: string;
  title: string;
  locationName: string;
  coordinates?: [number, number]; // [lat, lng]
  summary: string;
  historicalContext: string;
  significance: string;
  verifiedQuote?: string;
  imageUrl?: string;
  sources: HistoricalSource[];
  verificationStatus: VerificationStatus;
}

export const GOOGLE_DRIVE_HCM_TOAN_TAP_URL = 'https://drive.google.com/drive/folders/1KrvSjp_Y1RIFsZC56wWqQG1wvx_S9uOs?usp=sharing';

export interface HistoricalWork {
  id: string;
  title: string;
  originalTitle?: string;
  penName?: string;
  year: string;
  publishedPlace: string;
  historicalContext: string;
  summary: string;
  keyIdeas: string[];
  volume: number;
  pageRange: string;
  publisher: string;
  officialSourceUrl: string;
  imageUrl?: string;
  verificationStatus: VerificationStatus;
}

export interface HcmVolumeData {
  volume: number;
  timeRange: string;
  title: string;
  description: string;
  majorWorks: string[];
  historicalPeriod: string;
  publisher: string;
  driveFolderUrl: string;
  citation: string;
}

export interface VerifiedQuote {
  id: string;
  quoteText: string;
  category: 'Đại đoàn kết' | 'Dân vận' | 'Cán bộ & Đạo đức' | 'Độc lập tự do' | 'Thi đua ái quốc' | 'Thanh niên & Giáo dục';
  occasion: string;
  dateStr: string;
  originalWork: string;
  volume: number;
  page: string;
  publisher: string;
  officialUrl: string;
  verificationStatus: VerificationStatus;
}

export interface FootstepLocation {
  id: string;
  name: string;
  country: string;
  periodYears: string;
  coordinates: [number, number]; // [lat, lng]
  aliasUsed?: string;
  historicalAction: string;
  primaryRelic: string;
  sourceReference: string;
  imageUrl?: string;
}

export interface HistoricalAudio {
  id: string;
  title: string;
  dateStr: string;
  duration: string;
  occasion: string;
  sourceAgency: string;
  audioUrl?: string;
  transcript: string;
  historicalNote: string;
  verificationStatus: VerificationStatus;
}

export interface FrontInitiative {
  id: string;
  title: string;
  unit: string;
  summary: string;
  impact: string;
  likes: number;
  tags: string[];
  date: string;
  linkedHcmActionId?: string; // Link to ChanhHiepActionModel ID (e.g. 'act-01')
  linkedHcmTopicTitle?: string;
  imageUrl?: string;
}

export interface ChanhHiepActionModel {
  id: string;
  title: string;
  targetGroup: 'Cán bộ - Đảng viên' | 'Mặt trận & Hội viên' | 'Đoàn viên thanh niên' | 'Nhân dân 21 Khu phố';
  neighborhood: string;
  summary: string;
  practicalResult: string;
  inspirationalQuote: string;
  updatedDate: string;
  imageUrl?: string;
  linkedInitiativeIds?: string[];
}

// ==========================================
// 1. DANH MỤC 08 GIAI ĐOẠN LỊCH SỬ CHÍNH THỨC
// ==========================================
export const HISTORICAL_PERIODS: HistoricalPeriod[] = [
  {
    id: 'period-1',
    periodNumber: 1,
    timeRange: '1890 – 1911',
    title: 'Quê hương – Gia đình – Tuổi trẻ',
    subtitle: 'Nguồn cội văn hóa và sự hình thành ý chí cứu nước',
    description: 'Thời niên thiếu của Chủ tịch Hồ Chí Minh (Nguyễn Sinh Cung, Nguyễn Tất Thành) tại Nghệ An, Huế, Phan Thiết; chứng kiến nỗi đau mất nước và sự thất bại của các phong trào yêu nước đương thời, thôi thúc Người ra đi tìm con đường cứu nước mới.',
    keyMilestones: [
      '19/05/1890: Sinh tại làng Hoàng Trù, Kim Liên, Nam Đàn, Nghệ An',
      '1895–1901: Theo gia đình vào Huế lần thứ nhất',
      '1906–1908: Học tại trường Tiểu học Pháp - Việt Đông Ba và trường Quốc Học Huế',
      '09/1910–02/1911: Dạy học tại Trường Dục Thanh (Phan Thiết, Bình Thuận)'
    ],
    themeColor: 'from-amber-700 to-yellow-800',
    imageUrl: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'period-2',
    periodNumber: 2,
    timeRange: '1911 – 1920',
    title: 'Ra đi tìm đường cứu nước',
    subtitle: 'Khảo sát thực tiễn thế giới & Đến với Chủ nghĩa Mác – Lênin',
    description: 'Hành trình 10 năm bôn ba qua các đại dương, khảo sát đời sống lao động tại Pháp, Anh, Mỹ, châu Phi; gửi Bản Yêu sách của nhân dân An Nam và bước ngoặt tiếp cận Luận cương của Lênin, bỏ phiếu sáng lập Đảng Cộng sản Pháp tại Đại hội Tours.',
    keyMilestones: [
      '05/06/1911: Rời Bến cảng Nhà Rồng trên tàu Amiral Latouche-Tréville',
      '1912–1917: Lao động và khảo sát xã hội tại Hoa Kỳ, Anh, Pháp',
      '18/06/1919: Gửi Bản "Yêu sách của nhân dân An Nam" đến Hội nghị Versailles',
      '16–17/07/1920: Đọc Sơ thảo Luận cương của Lênin trên báo L\'Humanité',
      '12/1920: Bỏ phiếu tán thành Quốc tế III, sáng lập Đảng Cộng sản Pháp'
    ],
    themeColor: 'from-blue-700 to-indigo-800',
    imageUrl: 'https://images.unsplash.com/photo-1509718443690-d8e2fb3474b7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'period-3',
    periodNumber: 3,
    timeRange: '1921 – 1930',
    title: 'Truyền bá tư tưởng – Chuẩn bị thành lập Đảng',
    subtitle: 'Nền tảng lý luận, tổ chức và sự ra đời của Đảng Cộng sản Việt Nam',
    description: 'Thời kỳ hoạt động sôi nổi tại Pháp, Liên Xô và Trung Quốc; thành lập Hội Liên hiệp thuộc địa, ra báo Le Paria; sáng lập Hội Việt Nam Cách mạng Thanh niên, xuất bản Đường Kách mệnh và chủ trì Hội nghị thành lập Đảng đầu năm 1930.',
    keyMilestones: [
      '1921–1922: Thành lập Hội Liên hiệp thuộc địa và chủ nhiệm kiêm chủ bút báo Le Paria',
      '1923–1924: Hoạt động tại Liên Xô, dự Đại hội V Quốc tế Cộng sản',
      '1925: Thành lập Hội Việt Nam Cách mạng Thanh niên tại Quảng Châu; xuất bản Bản án chế độ thực dân Pháp',
      '1927: Xuất bản tác phẩm kinh điển Đường Kách mệnh',
      '03/02/1930: Chủ trì Hội nghị hợp nhất thành lập Đảng Cộng sản Việt Nam tại Hương Cảng'
    ],
    themeColor: 'from-red-700 to-rose-800',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'period-4',
    periodNumber: 4,
    timeRange: '1930 – 1941',
    title: 'Kiên trì hoạt động cách mạng – Trở về Tổ quốc',
    subtitle: 'Vượt qua sóng gió tù đày & Trở về Pác Bó trực tiếp lãnh đạo cách mạng',
    description: 'Vượt qua thử thách lao tù tại Hương Cảng (1931–1933) và những năm tháng hoạt động tại Liên Xô, Trung Quốc; ngày 28/01/1941 Người trở về Tổ quốc qua mốc 108, triệu tập Hội nghị Trung ương 8 thành lập Mặt trận Việt Minh.',
    keyMilestones: [
      '06/06/1931: Bị bắt trái phép tại Hương Cảng (Vụ án Tống Văn Sơ)',
      '1934–1938: Nghiên cứu tại Viện Nghiên cứu các vấn đề dân tộc và thuộc địa ở Moscow',
      '1938–1940: Về Trung Quốc, hoạt động tại Quế Lâm, Côn Minh chuẩn bị về nước',
      '28/01/1941: Vượt mốc 108 trở về Pác Bó (Cao Bằng) sau 30 năm xa quê hương',
      '19/05/1941: Thành lập Việt Nam Độc lập Đồng minh (Mặt trận Việt Minh)'
    ],
    themeColor: 'from-emerald-700 to-teal-800',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'period-5',
    periodNumber: 5,
    timeRange: '1941 – 1945',
    title: 'Từ Pác Bó đến Ba Đình lịch sử',
    subtitle: 'Xây dựng căn cứ địa, Tổng khởi nghĩa Tháng Tám & Khai sinh nước Việt Nam mới',
    description: 'Chỉ đạo xây dựng căn cứ địa cách mạng, sáng tác Nhật ký trong tù trong những ngày bị giam giữ ở Quảng Tây; chỉ thị thành lập Đội Việt Nam Tuyên truyền Giải phóng quân; lãnh đạo Tổng khởi nghĩa Tháng Tám thắng lợi và đọc Tuyên ngôn Độc lập ngày 2/9/1945.',
    keyMilestones: [
      '08/1942–09/1943: Bị bắt giam tại Quảng Tây, sáng tác tập thơ Nhật ký trong tù',
      '22/12/1944: Chỉ thị thành lập Đội Việt Nam Tuyên truyền Giải phóng quân',
      '05/1945: Chuyển căn cứ từ Pác Bó về Tân Trào (Tuyên Quang)',
      '16–17/08/1945: Chủ trì Quốc dân Đại hội Tân Trào phát lệnh Tổng khởi nghĩa',
      '02/09/1945: Đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình (Hà Nội)'
    ],
    themeColor: 'from-red-800 to-amber-700',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Ho_Chi_Minh_reads_the_Declaration_of_Independence.jpg/640px-Ho_Chi_Minh_reads_the_Declaration_of_Independence.jpg'
  },
  {
    id: 'period-6',
    periodNumber: 6,
    timeRange: '1945 – 1954',
    title: 'Giữ vững độc lập – Kháng chiến, kiến quốc',
    subtitle: 'Chính quyền nhân dân non trẻ & Chín năm làm nên chiến thắng Điện Biên Phủ',
    description: 'Chèo lái con thuyền cách mạng qua tình thế "ngàn cân treo sợi tóc"; tổ chức Tổng tuyển cử đầu tiên; ra Lời kêu gọi toàn quốc kháng chiến; viết Sửa đổi lối làm việc, Dân vận; khởi xướng phong trào Thi đua ái quốc và lãnh đạo kháng chiến chống Pháp thắng lợi.',
    keyMilestones: [
      '06/01/1946: Tổ chức thành công cuộc Tổng tuyển cử đầu tiên bầu Quốc hội khóa I',
      '19/12/1946: Ra Lời kêu gọi toàn quốc kháng chiến',
      '1947: Xuất bản Đời sống mới và cẩm nang Sửa đổi lối làm việc',
      '11/06/1948: Ra Lời kêu gọi thi đua ái quốc',
      '15/10/1949: Đăng bài báo Dân vận trên báo Sự thật',
      '07/05/1954: Chiến thắng lịch sử Điện Biên Phủ, giải phóng hoàn toàn miền Bắc'
    ],
    themeColor: 'from-cyan-800 to-blue-900',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'period-7',
    periodNumber: 7,
    timeRange: '1954 – 1969',
    title: 'Xây dựng miền Bắc – Đấu tranh vì độc lập, thống nhất',
    subtitle: 'Chân lý "Không có gì quý hơn độc lập, tự do" & Bản Di chúc muôn vàn tình thương',
    description: 'Lãnh đạo công cuộc xây dựng chủ nghĩa xã hội ở miền Bắc và chi viện cho tiền tuyến lớn miền Nam; củng cố khối đại đoàn kết toàn dân tộc; ra Lời kêu gọi chống Mỹ 17/7/1966; hoàn thành bản Di chúc lịch sử trước lúc đi xa ngày 02/09/1969.',
    keyMilestones: [
      '1958: Về sống và làm việc tại ngôi Nhà sàn trong khu Phủ Chủ tịch (Hà Nội)',
      '09/1960: Khai mạc Đại hội III của Đảng, xác định đường lối chiến lược hai miền',
      '17/07/1966: Ra Lời kêu gọi chống Mỹ: "Không có gì quý hơn độc lập, tự do!"',
      '03/02/1969: Công bố tác phẩm Nâng cao đạo đức cách mạng, quét sạch chủ nghĩa cá nhân',
      '1965–1969: Quá trình viết và hoàn thiện Di chúc',
      '02/09/1969: Chủ tịch Hồ Chí Minh từ trần tại Thủ đô Hà Nội'
    ],
    themeColor: 'from-slate-800 to-rose-900',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Ho_Chi_Minh_conducting_the_orchestra.jpg/640px-Ho_Chi_Minh_conducting_the_orchestra.jpg'
  },
  {
    id: 'period-8',
    periodNumber: 8,
    timeRange: 'Di sản Bất hủ',
    title: 'Di sản Hồ Chí Minh trường tồn cùng dân tộc',
    subtitle: 'Tư tưởng – Đạo đức – Phong cách & Tôn vinh của cộng đồng quốc tế',
    description: 'Hệ thống di sản toàn diện và sâu sắc: Tư tưởng độc lập dân tộc gắn liền với CNXH; Đạo đức cách mạng cần kiệm liêm chính; Phong cách giản dị gần dân; Bản Di chúc bất hủ và Nghị quyết số 24C/18.65 của Đại hội đồng UNESCO năm 1987.',
    keyMilestones: [
      'Hệ thống Tư tưởng Hồ Chí Minh: Nền tảng tư tưởng, kim chỉ nam cho hành động của Đảng',
      'Tấm gương Đạo đức cách mạng: Suốt đời tận trung với nước, tận hiếu với dân',
      'Phong cách Hồ Chí Minh: Khiêm tốn, giản dị, nói đi đôi với làm, luôn lắng nghe nhân dân',
      'Nghị quyết 24C/18.65 (1987) của UNESCO ghi nhận: Anh hùng giải phóng dân tộc và Nhà văn hóa kiệt xuất'
    ],
    themeColor: 'from-amber-600 to-red-800',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Stilt_House_of_Ho_Chi_Minh.jpg/640px-Stilt_House_of_Ho_Chi_Minh.jpg'
  }
];

// ==========================================
// 2. MA TRẬN 30 SỰ KIỆN LỊCH SỬ TIÊU BIỂU (LEVEL A)
// ==========================================
export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    id: 'ev-01',
    periodId: 'period-1',
    year: 1890,
    dateLabel: '19/05/1890',
    title: 'Ngày sinh Chủ tịch Hồ Chí Minh',
    locationName: 'Làng Hoàng Trù, Kim Liên, Nam Đàn, Nghệ An',
    coordinates: [18.6796, 105.5786],
    summary: 'Sinh ra trong gia đình nhà nho nghèo yêu nước; thân phụ là cụ Phó bảng Nguyễn Sinh Sắc, thân mẫu là bà Hoàng Thị Loan. Tên khai sinh là Nguyễn Sinh Cung.',
    historicalContext: 'Đất nước chìm dưới ách đô hộ của thực dân Pháp; các phong trào Cần Vương, khởi nghĩa vũ trang phong kiến lần lượt thất bại.',
    significance: 'Khởi đầu cuộc đời của người con ưu tú sẽ tìm ra con đường cứu nước đúng đắn cho dân tộc Việt Nam.',
    sources: [
      {
        id: 'src-1',
        title: 'Hồ Chí Minh – Biên niên tiểu sử',
        institution: 'Viện Hồ Chí Minh và các lãnh tụ của Đảng',
        volume: 1,
        page: '19',
        publisher: 'NXB Chính trị quốc gia Sự thật',
        publicationYear: 2016,
        sourceLevel: 'LEVEL_A_PRIMARY',
        officialUrl: 'https://hochiminh.vn/'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-02',
    periodId: 'period-1',
    year: 1895,
    dateLabel: 'Năm 1895 – 1901',
    title: 'Theo gia đình vào kinh thành Huế lần thứ nhất',
    locationName: 'Thành nội Huế, Thừa Thiên Huế',
    coordinates: [16.4637, 107.5909],
    summary: 'Nguyễn Sinh Cung cùng cha mẹ và anh trai vào Huế khi cha vào thi Hội; bắt đầu tiếp nhận không khí văn hóa và học tập chữ Hán.',
    historicalContext: 'Kinh thành triều đình nhà Nguyễn nhu nhược, hoàn toàn chịu sự khống chế của Tòa Khâm sứ Pháp.',
    significance: 'Tuổi thơ sớm cảm nhận cảnh ngộ nghèo khó của nhân dân lao động và chứng kiến người mẹ thân yêu qua đời tại Huế đầu năm 1901.',
    sources: [
      {
        id: 'src-2',
        title: 'Hồ Chí Minh – Biên niên tiểu sử',
        institution: 'Viện Hồ Chí Minh và các lãnh tụ của Đảng',
        volume: 1,
        page: '25-29',
        publisher: 'NXB Chính trị quốc gia Sự thật',
        publicationYear: 2016,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-03',
    periodId: 'period-1',
    year: 1908,
    dateLabel: 'Tháng 4/1908',
    title: 'Tham gia phong trào chống thuế của nhân dân Trung Kỳ',
    locationName: 'Kinh thành Huế',
    coordinates: [16.4673, 107.5855],
    summary: 'Khi đang là học sinh Quốc Học Huế, Nguyễn Tất Thành đã tham gia làm thông ngôn giúp bà con nông dân biểu tình chống sưu thuế nặng nề.',
    historicalContext: 'Nhân dân các tỉnh Trung Kỳ nổi dậy mạnh mẽ đòi giảm sưu thuế, bị thực dân Pháp đàn áp dã man.',
    significance: 'Đánh dấu bước ngoặt dấn thân trực tiếp vào phong trào đấu tranh của quần chúng nhân dân lao động.',
    sources: [
      {
        id: 'src-3',
        title: 'Hồ Chí Minh – Biên niên tiểu sử',
        institution: 'Viện Hồ Chí Minh',
        volume: 1,
        page: '35-37',
        publisher: 'NXB Chính trị quốc gia Sự thật',
        publicationYear: 2016,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-04',
    periodId: 'period-1',
    year: 1910,
    dateLabel: '09/1910 – 02/1911',
    title: 'Dạy học tại Trường Dục Thanh (Phan Thiết)',
    locationName: 'Phan Thiết, Bình Thuận',
    coordinates: [10.9275, 108.0989],
    summary: 'Nguyễn Tất Thành được mời dạy chữ Quốc ngữ, chữ Pháp và thể dục cho học sinh Trường Dục Thanh do các nhân sĩ tiến bộ lập nên.',
    historicalContext: 'Ảnh hưởng của phong trào Duy Tân tại Trung Kỳ; trường học mở mang kiến thức và bồi dưỡng lòng yêu nước.',
    significance: 'Gieo mầm lý tưởng yêu nước cho học trò, đồng thời chuẩn bị tinh thần và thể chất cho cuộc trường chinh vào Nam.',
    sources: [
      {
        id: 'src-4',
        title: 'Hồ Chí Minh – Biên niên tiểu sử',
        institution: 'Viện Hồ Chí Minh',
        volume: 1,
        page: '40-42',
        publisher: 'NXB Chính trị quốc gia Sự thật',
        publicationYear: 2016,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-05',
    periodId: 'period-2',
    year: 1911,
    dateLabel: '05/06/1911',
    title: 'Rời Bến cảng Nhà Rồng ra đi tìm đường cứu nước',
    locationName: 'Bến cảng Nhà Rồng, Sài Gòn (TP. Hồ Chí Minh)',
    coordinates: [10.7681, 106.7067],
    summary: 'Lấy tên Văn Ba, nhận làm phụ bếp trên tàu Amiral Latouche-Tréville (Pháp), chính thức khởi hành chuyến đi tìm chân lý cứu nước.',
    historicalContext: 'Các chí sĩ tiền bối như Phan Bội Châu (Đông Du), Phan Châu Trinh (Duy Tân) chưa mang lại thắng lợi; Người quyết định sang phương Tây để xem họ làm thế nào rồi về giúp đồng bào.',
    significance: 'Sự kiện có ý nghĩa quyết định mở ra kỷ nguyên mới cho lịch sử dân tộc Việt Nam.',
    verifiedQuote: '“Tôi muốn đi ra ngoài, xem nước Pháp và các nước khác. Sau khi xem xét họ làm như thế nào, tôi sẽ trở về giúp đồng bào chúng ta.”',
    sources: [
      {
        id: 'src-5',
        title: 'Hồ Chí Minh – Tiểu sử',
        institution: 'Học viện Chính trị quốc gia Hồ Chí Minh',
        publisher: 'NXB Lý luận chính trị',
        publicationYear: 2015,
        page: '38',
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-06',
    periodId: 'period-2',
    year: 1912,
    dateLabel: 'Năm 1912 – 1917',
    title: 'Khảo sát xã hội và lao động tại Hoa Kỳ và Vương quốc Anh',
    locationName: 'Boston, New York (Mỹ) & London (Anh)',
    coordinates: [51.5074, -0.1278],
    summary: 'Làm phụ bếp tại khách sạn Parker House (Boston), cào tuyết và nướng bánh tại khách sạn Carlton (London); tham gia Công đoàn Lao động Hải ngoại.',
    historicalContext: 'Chiến tranh thế giới thứ nhất bùng nổ; các nước tư bản bộc lộ mâu thuẫn giai cấp sâu sắc.',
    significance: 'Nhận thức sâu sắc rằng ở đâu nhân dân lao động cũng bị bóc lột, người da trắng cũng có kẻ áp bức và người bị áp bức.',
    sources: [
      {
        id: 'src-6',
        title: 'Hồ Chí Minh Toàn tập',
        institution: 'NXB Chính trị quốc gia Sự thật',
        volume: 1,
        page: '483',
        publicationYear: 2011,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-07',
    periodId: 'period-2',
    year: 1919,
    dateLabel: '18/06/1919',
    title: 'Gửi Bản "Yêu sách của nhân dân An Nam" tới Hội nghị Versailles',
    locationName: 'Paris và Cung điện Versailles, Pháp',
    coordinates: [48.8049, 2.1204],
    summary: 'Ký tên Nguyễn Ái Quốc đại diện cho Nhóm người An Nam yêu nước, gửi bản Yêu sách 8 điểm đòi quyền tự do dân chủ cơ bản cho nhân dân Việt Nam.',
    historicalContext: 'Chiến tranh thế giới thứ nhất kết thúc, các nước thắng trận họp tại Versailles để phân chia thị trường thế giới.',
    significance: 'Lần đầu tiên tiếng nói chính nghĩa của nhân dân Việt Nam xuất hiện đĩnh đạc trên diễn đàn quốc tế lớn; cái tên Nguyễn Ái Quốc bắt đầu lan tỏa.',
    sources: [
      {
        id: 'src-7',
        title: 'Hồ Chí Minh Toàn tập',
        institution: 'NXB Chính trị quốc gia Sự thật',
        volume: 1,
        page: '469-471',
        publicationYear: 2011,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-08',
    periodId: 'period-2',
    year: 1920,
    dateLabel: '16–17/07/1920',
    title: 'Đọc Sơ thảo Luận cương của V.I. Lênin trên báo L\'Humanité',
    locationName: 'Phố Villa des Gobelins, Quận 13, Paris, Pháp',
    coordinates: [48.8352, 2.3522],
    summary: 'Tiếp cận bản "Sơ thảo lần thứ nhất những luận cương về vấn đề dân tộc và vấn đề thuộc địa" của Lênin, tìm ra lời giải cho bài toán giải phóng dân tộc.',
    historicalContext: 'Cách mạng Tháng Mười Nga thắng lợi năm 1917 cổ vũ mạnh mẽ phong trào cách mạng thế giới.',
    significance: 'Bước ngoặt mang tính quyết định trong thế giới quan: Chuyển từ chủ nghĩa yêu nước nhiệt thành sang chủ nghĩa cộng sản khoa học.',
    verifiedQuote: '“Luận cương của Lênin làm cho tôi rất cảm động, phấn khởi, sáng tỏ, tin tưởng biết bao! Lệ tôi trào ra. Ngồi một mình trong buồng mà tôi nói to lên như đang nói trước quần chúng: Hỡi đồng bào bị đọa đày đau khổ! Đây là cái cần thiết cho chúng ta, đây là con đường giải phóng chúng ta!”',
    sources: [
      {
        id: 'src-8',
        title: 'Hồ Chí Minh Toàn tập',
        institution: 'NXB Chính trị quốc gia Sự thật',
        volume: 12,
        page: '561-562',
        publicationYear: 2011,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-09',
    periodId: 'period-2',
    year: 1920,
    dateLabel: '25–30/12/1920',
    title: 'Tham dự Đại hội Tours, sáng lập Đảng Cộng sản Pháp',
    locationName: 'Thành phố Tours, Pháp',
    coordinates: [47.3941, 0.6848],
    summary: 'Là đại biểu duy nhất đại diện cho các dân tộc thuộc địa Đông Dương tại Đại hội XVIII Đảng Xã hội Pháp; bỏ phiếu tán thành gia nhập Quốc tế III và tham gia sáng lập Đảng Cộng sản Pháp.',
    historicalContext: 'Sự phân hóa nội bộ phong trào công nhân châu Âu giữa phái cải lương và phái cách mạng vô sản.',
    significance: 'Nguyễn Ái Quốc trở thành người cộng sản Việt Nam đầu tiên, mở đường cho sự gắn kết giữa cách mạng giải phóng dân tộc và phong trào công nhân quốc tế.',
    sources: [
      {
        id: 'src-9',
        title: 'Hồ Chí Minh – Biên niên tiểu sử',
        institution: 'Viện Hồ Chí Minh',
        volume: 1,
        page: '94-97',
        publisher: 'NXB Chính trị quốc gia Sự thật',
        publicationYear: 2016,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-10',
    periodId: 'period-3',
    year: 1922,
    dateLabel: '01/04/1922',
    title: 'Xuất bản số đầu tiên của báo Le Paria (Người cùng khổ)',
    locationName: 'Paris, Pháp',
    coordinates: [48.8566, 2.3522],
    summary: 'Nguyễn Ái Quốc cùng các đồng chí thành lập Hội Liên hiệp thuộc địa và cho ra mắt tờ báo Le Paria; Người trực tiếp viết bài, vẽ tranh châm biếm và phát hành.',
    historicalContext: 'Chế độ kiểm duyệt thuộc địa ngặt nghèo; nhân dân các nước thuộc địa thiếu một tiếng nói chung thức tỉnh dư luận tiến bộ.',
    significance: 'Vũ khí tư tưởng sắc bén vạch trần tội ác của chủ nghĩa thực dân, liên minh các dân tộc bị áp bức Á - Phi.',
    sources: [
      {
        id: 'src-10',
        title: 'Hồ Chí Minh Toàn tập',
        institution: 'NXB Chính trị quốc gia Sự thật',
        volume: 2,
        page: '47-120',
        publicationYear: 2011,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-11',
    periodId: 'period-3',
    year: 1923,
    dateLabel: '30/06/1923',
    title: 'Đến Liên Xô – Trung tâm của phong trào cách mạng thế giới',
    locationName: 'Thủ đô Moscow, Liên Xô',
    coordinates: [55.7558, 37.6173],
    summary: 'Rời Paris bí mật đến Moscow; học tập tại Trường Đại học Phương Đông; dự Đại hội I Quốc tế Nông dân và được bầu vào Đoàn Chủ tịch Quốc tế Nông dân.',
    historicalContext: 'Quốc tế Cộng sản mở rộng công tác đào tạo lý luận cho cán bộ phong trào cách mạng phương Đông.',
    significance: 'Nghiên cứu mô hình Nhà nước Xô-viết và tích lũy tri thức lý luận cách mạng vô sản sâu sắc.',
    sources: [
      {
        id: 'src-11',
        title: 'Hồ Chí Minh – Biên niên tiểu sử',
        institution: 'Viện Hồ Chí Minh',
        volume: 1,
        page: '182-195',
        publisher: 'NXB Chính trị quốc gia Sự thật',
        publicationYear: 2016,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-12',
    periodId: 'period-3',
    year: 1925,
    dateLabel: 'Tháng 6/1925',
    title: 'Thành lập Hội Việt Nam Cách mạng Thanh niên tại Quảng Châu',
    locationName: 'Quảng Châu, Quảng Đông, Trung Quốc',
    coordinates: [23.1291, 113.2644],
    summary: 'Từ Moscow về Quảng Châu lấy bí danh Lý Thụy; tập hợp thanh niên yêu nước xuất bản tuần báo Thanh Niên (số 1 ra ngày 21/6/1925) và mở các lớp huấn luyện chính trị.',
    historicalContext: 'Tâm Dân Xã và các thanh niên Việt Nam yêu nước tại Trung Quốc đang cần ngọn cờ lý luận dẫn đường.',
    significance: 'Tổ chức tiền thân trực tiếp chuẩn bị về chính trị, tư tưởng và tổ chức cho việc thành lập Đảng Cộng sản Việt Nam.',
    sources: [
      {
        id: 'src-12',
        title: 'Hồ Chí Minh – Biên niên tiểu sử',
        institution: 'Viện Hồ Chí Minh',
        volume: 1,
        page: '283-288',
        publisher: 'NXB Chính trị quốc gia Sự thật',
        publicationYear: 2016,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-13',
    periodId: 'period-3',
    year: 1927,
    dateLabel: 'Đầu năm 1927',
    title: 'Xuất bản tác phẩm lý luận kinh điển "Đường Kách mệnh"',
    locationName: 'Quảng Châu, Trung Quốc',
    coordinates: [23.1315, 113.2680],
    summary: 'Bộ Tổng bộ Hội Việt Nam Cách mạng Thanh niên in thạch các bài giảng của Nguyễn Ái Quốc thành tập sách Đường Kách mệnh để chuyển về nước truyền bá.',
    historicalContext: 'Phong trào vô sản hóa phát triển mạnh mẽ; yêu cầu cấp thiết đào tạo đội ngũ cán bộ cách mạng kiên định.',
    significance: 'Vạch rõ tính chất, mục tiêu, lực lượng và phương pháp cách mạng; đặt nền tảng lý luận đầu tiên cho Đảng ta.',
    verifiedQuote: '“Cách mệnh là việc chung cả dân chúng chứ không phải việc một hai người... Cách mệnh trước hết phải có Đảng cách mệnh để trong thì vận động và tổ chức dân chúng, ngoài thì liên lạc với dân tộc bị áp bức và vô sản giai cấp mọi nơi.”',
    sources: [
      {
        id: 'src-13',
        title: 'Hồ Chí Minh Toàn tập',
        institution: 'NXB Chính trị quốc gia Sự thật',
        volume: 2,
        page: '279-347',
        publicationYear: 2011,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-14',
    periodId: 'period-3',
    year: 1930,
    dateLabel: '06/01 – 07/02/1930',
    title: 'Chủ trì Hội nghị thành lập Đảng Cộng sản Việt Nam',
    locationName: 'Cửu Long (Kowloon), Hương Cảng (Hồng Kông)',
    coordinates: [22.3193, 114.1694],
    summary: 'Với tư cách phái viên Quốc tế Cộng sản, Nguyễn Ái Quốc chủ trì hợp nhất Đông Dương Cộng sản Đảng, An Nam Cộng sản Đảng và Đông Dương Cộng sản Liên đoàn; thông qua Chánh cương và Sách lược vắn tắt.',
    historicalContext: 'Ba tổ chức cộng sản trong nước hoạt động biệt lập, nảy sinh tranh giành ảnh hưởng cần hợp nhất khẩn cấp.',
    significance: 'Sự kiện mang tầm vóc lịch sử trọng đại, chấm dứt cuộc khủng hoảng bế tắc về đường lối cứu nước kéo dài hơn nửa thế kỷ.',
    sources: [
      {
        id: 'src-14',
        title: 'Văn kiện Đảng Toàn tập',
        institution: 'NXB Chính trị quốc gia Sự thật',
        volume: 2,
        page: '1-15',
        publicationYear: 2002,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-15',
    periodId: 'period-4',
    year: 1931,
    dateLabel: '06/06/1931',
    title: 'Bị cảnh sát Anh bắt trái phép tại Hương Cảng (Vụ án Tống Văn Sơ)',
    locationName: 'Nhà tù Victoria, Hương Cảng',
    coordinates: [22.2819, 114.1539],
    summary: 'Bị bắt dưới tên Tống Văn Sơ; thực dân Pháp câu kết với chính quyền thuộc địa Anh mưu toan dẫn độ Người về Đông Dương để hãm hại.',
    historicalContext: 'Sau cao trào Xô-viết Nghệ Tĩnh 1930–1931, đế quốc Pháp tăng cường lùng sục triệt hạ các lãnh tụ phong trào cộng sản.',
    significance: 'Nhờ sự bào chữa mưu trí của luật sư tiến bộ Francis Henry Loseby và tổ chức Quốc tế Cứu tế Đỏ, Người được tuyên tự do đầu năm 1933.',
    sources: [
      {
        id: 'src-15',
        title: 'Hồ Chí Minh – Biên niên tiểu sử',
        institution: 'Viện Hồ Chí Minh',
        volume: 2,
        page: '12-50',
        publisher: 'NXB Chính trị quốc gia Sự thật',
        publicationYear: 2016,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-16',
    periodId: 'period-4',
    year: 1941,
    dateLabel: '28/01/1941',
    title: 'Trở về Tổ quốc sau 30 năm bôn ba hải ngoại',
    locationName: 'Cột mốc 108 & Hang Pác Bó, Trường Hà, Hà Quảng, Cao Bằng',
    coordinates: [22.9818, 106.0505],
    summary: 'Nguyễn Ái Quốc cùng các đồng chí vượt qua cột mốc 108 biên giới Việt - Trung trở về đất mẹ; lập căn cứ tại hang Cốc Bó, đặt tên suối Lê-nin và núi Các-Mác.',
    historicalContext: 'Chiến tranh thế giới thứ hai bùng nổ; phát xít Nhật tiến vào Đông Dương, nhân dân ta chịu cảnh một cổ hai tròng.',
    significance: 'Bắt đầu giai đoạn trực tiếp cầm lái con thuyền cách mạng Việt Nam đi tới thắng lợi của cuộc Cách mạng Tháng Tám năm 1945.',
    sources: [
      {
        id: 'src-16',
        title: 'Hồ Chí Minh – Biên niên tiểu sử',
        institution: 'Viện Hồ Chí Minh',
        volume: 2,
        page: '115-120',
        publisher: 'NXB Chính trị quốc gia Sự thật',
        publicationYear: 2016,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-17',
    periodId: 'period-4',
    year: 1941,
    dateLabel: '10–19/05/1941',
    title: 'Chủ trì Hội nghị Trung ương 8, thành lập Mặt trận Việt Minh',
    locationName: 'Lán Khuổi Nậm, Pác Bó, Cao Bằng',
    coordinates: [22.9840, 106.0518],
    summary: 'Quyết định chuyển hướng chiến lược cách mạng: Đặt quyền lợi dân tộc giải phóng lên cao hơn hết thảy; thành lập Việt Nam Độc lập Đồng minh (Việt Minh).',
    historicalContext: 'Mâu thuẫn giữa toàn thể dân tộc Việt Nam với phát xít Nhật và thực dân Pháp trở nên gay gắt chưa từng có.',
    significance: 'Mặt trận Việt Minh trở thành ngọn cờ tập hợp vĩ đại của mọi người Việt Nam yêu nước, tiền thân của Mặt trận Tổ quốc Việt Nam ngày nay.',
    sources: [
      {
        id: 'src-17',
        title: 'Văn kiện Đảng Toàn tập',
        institution: 'NXB Chính trị quốc gia Sự thật',
        volume: 7,
        page: '99-145',
        publicationYear: 2000,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-18',
    periodId: 'period-5',
    year: 1942,
    dateLabel: '08/1942 – 09/1943',
    title: 'Bị bắt giam tại Quảng Tây và sáng tác "Nhật ký trong tù"',
    locationName: 'Các nhà lao tỉnh Quảng Tây, Trung Quốc',
    coordinates: [23.8298, 108.7881],
    summary: 'Trên đường sang Trùng Khánh bắt liên lạc với đồng minh chống phát xít thì bị chính quyền Tưởng Giới Thạch bắt giam đày ải qua hơn 30 nhà lao; Người sáng tác 133 bài thơ chữ Hán kiên cường.',
    historicalContext: 'Tình hình quốc tế phức tạp; Quốc dân đảng Trung Quốc nghi kỵ và tìm cách kiềm chế phong trào cách mạng Việt Nam.',
    significance: 'Tác phẩm văn học vô giá, thể hiện nhân cách vĩ đại, tinh thần thép "thân thể ở trong lao, tinh thần ở ngoài lao" của người chiến sĩ cách mạng.',
    sources: [
      {
        id: 'src-18',
        title: 'Hồ Chí Minh Toàn tập',
        institution: 'NXB Chính trị quốc gia Sự thật',
        volume: 3,
        page: '260-420',
        publicationYear: 2011,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-19',
    periodId: 'period-5',
    year: 1944,
    dateLabel: '22/12/1944',
    title: 'Chỉ thị thành lập Đội Việt Nam Tuyên truyền Giải phóng quân',
    locationName: 'Khu rừng Trần Hưng Đạo, Nguyên Bình, Cao Bằng',
    coordinates: [22.6105, 105.8672],
    summary: 'Ra chỉ thị lịch sử giao cho đồng chí Võ Nguyên Giáp thành lập Đội Việt Nam Tuyên truyền Giải phóng quân với 34 chiến sĩ, tiền thân của Quân đội nhân dân Việt Nam.',
    historicalContext: 'Phong trào đánh đuổi phát xít và xây dựng căn cứ địa vũ trang đòi hỏi một lực lượng nòng cốt quân sự.',
    significance: 'Đặt nền móng lý luận cho nền quốc phòng toàn dân và nghệ thuật quân sự nhân dân Việt Nam.',
    verifiedQuote: '“Tên Đội Việt Nam Tuyên truyền Giải phóng quân, nghĩa là chính trị trọng hơn quân sự. Nó là đội tuyên truyền... Tuy lúc đầu quy mô của nó còn nhỏ, nhưng tiền đồ của nó rất vẻ vang.”',
    sources: [
      {
        id: 'src-19',
        title: 'Hồ Chí Minh Toàn tập',
        institution: 'NXB Chính trị quốc gia Sự thật',
        volume: 3,
        page: '507-509',
        publicationYear: 2011,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-20',
    periodId: 'period-5',
    year: 1945,
    dateLabel: '16–17/08/1945',
    title: 'Chủ trì Quốc dân Đại hội Tân Trào',
    locationName: 'Đình Tân Trào, Sơn Dương, Tuyên Quang',
    coordinates: [21.7831, 105.2917],
    summary: 'Đại biểu ba miền và các giới tụ họp tại Tân Trào; thông qua lệnh Tổng khởi nghĩa, bầu Ủy ban Dân tộc Giải phóng Việt Nam do Hồ Chí Minh làm Chủ tịch.',
    historicalContext: 'Phát xít Nhật đầu hàng vô điều kiện đồng minh; thời cơ cách mạng ngàn năm có một đã xuất hiện.',
    significance: 'Được ví như Hội nghị Diên Hồng của thời đại mới, quyết định vận mệnh độc lập của non sông.',
    verifiedQuote: '“Dù hy sinh tới đâu, dù phải đốt cháy cả dãy Trường Sơn cũng phải kiên quyết giành cho được độc lập!”',
    sources: [
      {
        id: 'src-20',
        title: 'Văn kiện Đảng Toàn tập',
        institution: 'NXB Chính trị quốc gia Sự thật',
        volume: 7,
        page: '556-560',
        publicationYear: 2000,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-21',
    periodId: 'period-5',
    year: 1945,
    dateLabel: '02/09/1945',
    title: 'Đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình lịch sử',
    locationName: 'Quảng trường Ba Đình, Hà Nội',
    coordinates: [21.0369, 105.8347],
    summary: 'Trước hàng chục vạn đồng bào, Chủ tịch Hồ Chí Minh thay mặt Chính phủ lâm thời đọc bản Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa.',
    historicalContext: 'Chính quyền về tay nhân dân sau thắng lợi oanh liệt của cuộc Tổng khởi nghĩa Tháng Tám.',
    significance: 'Văn kiện lịch sử bất hủ chấm dứt hơn 80 năm ách đô hộ thực dân và hàng nghìn năm chế độ phong kiến, mở ra kỷ nguyên độc lập tự do.',
    verifiedQuote: '“Nước Việt Nam có quyền hưởng tự do và độc lập, và sự thật đã thành một nước tự do, độc lập. Toàn thể dân tộc Việt Nam quyết đem tất cả tinh thần và lực lượng, tính mạng và của cải để giữ vững quyền tự do, độc lập ấy.”',
    sources: [
      {
        id: 'src-21',
        title: 'Hồ Chí Minh Toàn tập',
        institution: 'NXB Chính trị quốc gia Sự thật',
        volume: 4,
        page: '1-4',
        publicationYear: 2011,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-22',
    periodId: 'period-6',
    year: 1946,
    dateLabel: '06/01/1946',
    title: 'Cuộc Tổng tuyển cử đầu tiên bầu Quốc hội khóa I',
    locationName: 'Toàn quốc',
    coordinates: [21.0285, 105.8542],
    summary: 'Nhân dân cả nước từ 18 tuổi trở lên không phân biệt nam nữ, tôn giáo, giàu nghèo nô nức đi bỏ phiếu thực hiện quyền công dân.',
    historicalContext: 'Thực dân Pháp nổ súng ở Nam Bộ, quân Tưởng tràn vào miền Bắc khiêu khích; cách mạng đối mặt muôn vàn thách thức.',
    significance: 'Khẳng định tính pháp lý và tính chính danh tuyệt đối của Nhà nước Việt Nam Dân chủ Cộng hòa trước toàn thế giới.',
    sources: [
      {
        id: 'src-22',
        title: 'Hồ Chí Minh – Biên niên tiểu sử',
        institution: 'Viện Hồ Chí Minh',
        volume: 3,
        page: '115-125',
        publisher: 'NXB Chính trị quốc gia Sự thật',
        publicationYear: 2016,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-23',
    periodId: 'period-6',
    year: 1946,
    dateLabel: '19/12/1946',
    title: 'Ra Lời kêu gọi toàn quốc kháng chiến',
    locationName: 'Làng Vạn Phúc, Hà Đông, Hà Nội',
    coordinates: [20.9786, 105.7725],
    summary: 'Đài Tiếng nói Việt Nam phát đi Lời kêu gọi thiêng liêng của Người: "Chúng ta muốn hòa bình, chúng ta phải nhân nhượng. Nhưng chúng ta càng nhân nhượng, thực dân Pháp càng lấn tới...".',
    historicalContext: 'Thực dân Pháp bội ước Hiệp định sơ bộ 6/3 và Tạm ước 14/9, gửi tối hậu thư đòi tước vũ khí của ta tại Hà Nội.',
    significance: 'Hiệu triệu toàn thể dân tộc triệu người như một bước vào cuộc trường kỳ kháng chiến bảo vệ nền độc lập.',
    verifiedQuote: '“Chúng ta thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ!”',
    sources: [
      {
        id: 'src-23',
        title: 'Hồ Chí Minh Toàn tập',
        institution: 'NXB Chính trị quốc gia Sự thật',
        volume: 4,
        page: '534',
        publicationYear: 2011,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-24',
    periodId: 'period-6',
    year: 1948,
    dateLabel: '11/06/1948',
    title: 'Ra Lời kêu gọi thi đua ái quốc',
    locationName: 'Chiến khu Việt Bắc',
    coordinates: [21.8465, 105.8458],
    summary: 'Nhân dịp kỷ niệm 1.000 ngày kháng chiến, Chủ tịch Hồ Chí Minh phát động phong trào thi đua diệt giặc đói, diệt giặc dốt, diệt giặc ngoại xâm.',
    historicalContext: 'Cuộc kháng chiến chuyển sang giai đoạn cầm cự và tích lũy lực lượng; cần huy động sức người sức của tối đa.',
    significance: 'Khơi dậy lòng yêu nước nồng nàn và biến thành hành động cụ thể trong lao động, sản xuất, chiến đấu của toàn dân.',
    verifiedQuote: '“Thi đua là yêu nước, yêu nước thì phải thi đua. Và những người thi đua là những người yêu nước nhất.”',
    sources: [
      {
        id: 'src-24',
        title: 'Hồ Chí Minh Toàn tập',
        institution: 'NXB Chính trị quốc gia Sự thật',
        volume: 5,
        page: '556-558',
        publicationYear: 2011,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-25',
    periodId: 'period-6',
    year: 1949,
    dateLabel: '15/10/1949',
    title: 'Công bố bài báo "Dân vận" trên báo Sự thật',
    locationName: 'Chiến khu Việt Bắc',
    coordinates: [21.8500, 105.8500],
    summary: 'Bài viết đúc kết toàn diện phương pháp vận động quần chúng: Dân vận không thể chỉ dùng khẩu hiệu hay hội họp mà phải "óc nghĩ, mắt trông, tai nghe, chân đi, miệng nói, tay làm".',
    historicalContext: 'Một bộ phận cán bộ có biểu hiện quan liêu, mệnh lệnh, xa rời đời sống nhân dân.',
    significance: 'Cẩm nang kim chỉ nam sống còn cho công tác vận động quần chúng và xây dựng khối Mặt trận toàn dân.',
    verifiedQuote: '“Dân vận kém thì việc gì cũng kém. Dân vận khéo thì việc gì cũng thành công.”',
    sources: [
      {
        id: 'src-25',
        title: 'Hồ Chí Minh Toàn tập',
        institution: 'NXB Chính trị quốc gia Sự thật',
        volume: 6,
        page: '232-234',
        publicationYear: 2011,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-26',
    periodId: 'period-6',
    year: 1954,
    dateLabel: '07/05/1954',
    title: 'Chiến thắng lịch sử Điện Biên Phủ',
    locationName: 'Lòng chảo Điện Biên Phủ, Điện Biên',
    coordinates: [21.3855, 103.0163],
    summary: 'Sau 56 ngày đêm khoét núi ngủ hầm, quân và dân ta đập tan tập đoàn cứ điểm kiên cố nhất của Pháp ở Đông Dương.',
    historicalContext: 'Kế hoạch Navarre của thực dân Pháp có sự viện trợ tối đa của đế quốc Mỹ nhằm tìm lối thoát danh dự.',
    significance: 'Chiến thắng chấn động địa cầu, buộc Pháp phải ký Hiệp định Genève chấm dứt chiến tranh xâm lược Đông Dương.',
    sources: [
      {
        id: 'src-26',
        title: 'Hồ Chí Minh Toàn tập',
        institution: 'NXB Chính trị quốc gia Sự thật',
        volume: 8,
        page: '475-485',
        publicationYear: 2011,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-27',
    periodId: 'period-7',
    year: 1958,
    dateLabel: 'Tháng 5/1958',
    title: 'Chuyển về ở và làm việc tại ngôi Nhà sàn trong Phủ Chủ tịch',
    locationName: 'Khu Di tích Phủ Chủ tịch, Ba Đình, Hà Nội',
    coordinates: [21.0378, 105.8340],
    summary: 'Ngôi nhà sàn gỗ giản dị theo kiểu đồng bào Việt Bắc trở thành nơi Người sống, làm việc, tiếp khách quốc tế và viết các văn kiện quan trọng.',
    historicalContext: 'Kháng chiến thắng lợi, Bác từ chối ở dinh Toàn quyền xa hoa, chọn sống chan hòa giữa thiên nhiên.',
    significance: 'Biểu tượng mẫu mực cho phong cách sống thanh bạch, liêm khiết, giản dị của vị lãnh tụ kính yêu.',
    sources: [
      {
        id: 'src-27',
        title: 'Khu Di tích Chủ tịch Hồ Chí Minh tại Phủ Chủ tịch',
        institution: 'Bộ Văn hóa, Thể thao và Du lịch',
        publisher: 'NXB Thông tin và Truyền thông',
        publicationYear: 2014,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-28',
    periodId: 'period-7',
    year: 1966,
    dateLabel: '17/07/1966',
    title: 'Ra Lời kêu gọi đồng bào và chiến sĩ cả nước chống Mỹ',
    locationName: 'Thủ đô Hà Nội',
    coordinates: [21.0285, 105.8542],
    summary: 'Bác phát đi lời hiệu triệu vang dội non sông, đúc kết chân lý độc lập tự do sáng ngời của thời đại.',
    historicalContext: 'Đế quốc Mỹ đưa quân ồ ạt vào miền Nam và dùng máy bay ném bom dữ dội phá hoại miền Bắc.',
    significance: 'Cổ vũ ý chí kiên cường "không có gì quý hơn độc lập, tự do", dẫn lối cho thắng lợi hoàn toàn năm 1975.',
    verifiedQuote: '“Chiến tranh có thể kéo dài 5 năm, 10 năm, 20 năm hoặc lâu hơn nữa. Hà Nội, Hải Phòng và một số thành phố, xí nghiệp có thể bị tàn phá, song nhân dân Việt Nam quyết không sợ! Không có gì quý hơn độc lập, tự do!”',
    sources: [
      {
        id: 'src-28',
        title: 'Hồ Chí Minh Toàn tập',
        institution: 'NXB Chính trị quốc gia Sự thật',
        volume: 15,
        page: '130-131',
        publicationYear: 2011,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-29',
    periodId: 'period-7',
    year: 1969,
    dateLabel: '03/02/1969',
    title: 'Xuất bản tác phẩm "Nâng cao đạo đức cách mạng, quét sạch chủ nghĩa cá nhân"',
    locationName: 'Đăng trên báo Nhân Dân, Hà Nội',
    coordinates: [21.0312, 105.8521],
    summary: 'Bài viết chỉ rõ tác hại ghê gớm của chủ nghĩa cá nhân và nêu cao trách nhiệm rèn luyện cần, kiệm, liêm, chính của người đảng viên.',
    historicalContext: 'Kỷ niệm 39 năm ngày thành lập Đảng; chuẩn bị tổng phản công đánh bại cuộc chiến tranh xâm lược.',
    significance: 'Văn kiện lý luận đặc biệt quan trọng về công tác xây dựng, chỉnh đốn Đảng trong sạch, vững mạnh.',
    sources: [
      {
        id: 'src-29',
        title: 'Hồ Chí Minh Toàn tập',
        institution: 'NXB Chính trị quốc gia Sự thật',
        volume: 15,
        page: '546-549',
        publicationYear: 2011,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'ev-30',
    periodId: 'period-7',
    year: 1969,
    dateLabel: '02/09/1969',
    title: 'Chủ tịch Hồ Chí Minh từ trần tại Hà Nội',
    locationName: 'Nhà số 67, Khu Di tích Phủ Chủ tịch, Hà Nội',
    coordinates: [21.0385, 105.8342],
    summary: 'Chủ tịch Hồ Chí Minh từ trần vào hồi 9 giờ 47 phút sáng ngày 02/9/1969; Người để lại cho non sông bản Di chúc thiêng liêng muôn vàn tình thương yêu.',
    historicalContext: 'Cuộc kháng chiến chống Mỹ cứu nước đang trong giai đoạn cam go, toàn thể nhân dân hai miền biến đau thương thành hành động cách mạng.',
    significance: 'Dân tộc Việt Nam và bạn bè quốc tế vĩnh biệt một vị lãnh tụ thiên tài, người chiến sĩ cộng sản kiệt xuất của phong trào giải phóng dân tộc.',
    sources: [
      {
        id: 'src-30',
        title: 'Hồ Chí Minh – Biên niên tiểu sử',
        institution: 'Viện Hồ Chí Minh',
        volume: 10,
        page: '360-375',
        publisher: 'NXB Chính trị quốc gia Sự thật',
        publicationYear: 2016,
        sourceLevel: 'LEVEL_A_PRIMARY'
      }
    ],
    verificationStatus: 'VERIFIED'
  }
];

// ==========================================
// 2.5 TRỌN BỘ 15 TẬP HỒ CHÍ MINH TOÀN TẬP (NXB CHÍNH TRỊ QUỐC GIA SỰ THẬT - GOOGLE DRIVE)
// ==========================================
export const HCM_TOAN_TAP_FULL_VOLUMES: HcmVolumeData[] = [
  {
    volume: 1,
    timeRange: '1912 – 1924',
    title: 'Hồ Chí Minh Toàn tập – Tập 1 (1912 – 1924)',
    description: 'Tập hợp các văn kiện, bài báo, bài phát biểu của Nguyễn Ái Quốc trong thời kỳ tìm đường cứu nước, hoạt động tại Pháp, Liên Xô và phong trào đấu tranh của các dân tộc thuộc địa.',
    majorWorks: ['Yêu sách của nhân dân An Nam (1919)', 'Bài phát biểu tại Đại hội Tours (1920)', 'Các bài báo trên Le Paria & L\'Humanité', 'Báo cáo tại Quốc tế Nông dân'],
    historicalPeriod: 'Ra đi tìm đường cứu nước & Tiếp cận Chủ nghĩa Mác - Lênin',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    driveFolderUrl: GOOGLE_DRIVE_HCM_TOAN_TAP_URL,
    citation: 'Hồ Chí Minh: Toàn tập, Tập 1 (1912 - 1924), NXB Chính trị quốc gia Sự thật, Hà Nội, 2011.'
  },
  {
    volume: 2,
    timeRange: '1925 – 1930',
    title: 'Hồ Chí Minh Toàn tập – Tập 2 (1925 – 1930)',
    description: 'Bao gồm các tác phẩm lý luận kinh điển chuẩn bị về chính trị, tư tưởng và tổ chức cho việc thành lập Đảng Cộng sản Việt Nam tại Quảng Châu và Hương Cảng.',
    majorWorks: ['Bản án chế độ thực dân Pháp (1925)', 'Đường Kách mệnh (1927)', 'Các bài giảng huấn luyện cán bộ Hội VN Cách mạng Thanh niên'],
    historicalPeriod: 'Chuẩn bị thành lập Đảng Cộng sản Việt Nam',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    driveFolderUrl: GOOGLE_DRIVE_HCM_TOAN_TAP_URL,
    citation: 'Hồ Chí Minh: Toàn tập, Tập 2 (1925 - 1930), NXB Chính trị quốc gia Sự thật, Hà Nội, 2011.'
  },
  {
    volume: 3,
    timeRange: '1930 – 1945',
    title: 'Hồ Chí Minh Toàn tập – Tập 3 (1930 – 1945)',
    description: 'Cương lĩnh thành lập Đảng, các tác phẩm trong thời kỳ giam cầm tại Quảng Tây và giai đoạn lãnh đạo Mặt trận Việt Minh tiến tới Tổng khởi nghĩa Tháng Tám.',
    majorWorks: ['Chánh cương vắn tắt & Sách lược vắn tắt (1930)', 'Nhật ký trong tù (1942 – 1943)', 'Tuyên ngôn Độc lập (1945)'],
    historicalPeriod: 'Thành lập Đảng & Khởi nghĩa giành chính quyền',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    driveFolderUrl: GOOGLE_DRIVE_HCM_TOAN_TAP_URL,
    citation: 'Hồ Chí Minh: Toàn tập, Tập 3 (1930 - 1945), NXB Chính trị quốc gia Sự thật, Hà Nội, 2011.'
  },
  {
    volume: 4,
    timeRange: '1945 – 1946',
    title: 'Hồ Chí Minh Toàn tập – Tập 4 (1945 – 1946)',
    description: 'Các bài viết, sắc lệnh, bài phát biểu trong thời kỳ đầu bảo vệ và củng cố chính quyền Dân chủ Cộng hòa, đối phó thù trong giặc ngoài và mở đầu toàn quốc kháng chiến.',
    majorWorks: ['Lời kêu gọi chống giặc đói, giặc dốt, giặc ngoại xâm', 'Hiệp định Sơ bộ 6/3', 'Lời kêu gọi toàn quốc kháng chiến (19/12/1946)'],
    historicalPeriod: 'Bảo vệ chính quyền cách mạng & Khai mạc Kháng chiến',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    driveFolderUrl: GOOGLE_DRIVE_HCM_TOAN_TAP_URL,
    citation: 'Hồ Chí Minh: Toàn tập, Tập 4 (1945 - 1946), NXB Chính trị quốc gia Sự thật, Hà Nội, 2011.'
  },
  {
    volume: 5,
    timeRange: '1947 – 1948',
    title: 'Hồ Chí Minh Toàn tập – Tập 5 (1947 – 1948)',
    description: 'Tác phẩm chỉ đạo cuộc kháng chiến trường kỳ tại chiến khu Việt Bắc, phát động xây dựng đời sống mới, chỉnh đốn tác phong cán bộ và thi đua yêu nước.',
    majorWorks: ['Đời sống mới (1947)', 'Sửa đổi lối làm việc (11/1947)', 'Lời kêu gọi thi đua ái quốc (11/6/1948)'],
    historicalPeriod: 'Xây dựng Lực lượng Kháng chiến & Đạo đức Cán bộ',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    driveFolderUrl: GOOGLE_DRIVE_HCM_TOAN_TAP_URL,
    citation: 'Hồ Chí Minh: Toàn tập, Tập 5 (1947 - 1948), NXB Chính trị quốc gia Sự thật, Hà Nội, 2011.'
  },
  {
    volume: 6,
    timeRange: '1949 – 1950',
    title: 'Hồ Chí Minh Toàn tập – Tập 6 (1949 – 1950)',
    description: 'Chỉ đạo công tác vận động quần chúng, xây dựng khối đại đoàn kết toàn dân và trực tiếp chỉ đạo Chiến dịch Biên giới Thu Đông 1950 giải phóng biên giới.',
    majorWorks: ['Dân vận (15/10/1949)', 'Cần kiệm liêm chính (1949)', 'Thư gửi các lớp huấn luyện cán bộ'],
    historicalPeriod: 'Chuyển sang Tổng phản công & Công tác Dân vận',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    driveFolderUrl: GOOGLE_DRIVE_HCM_TOAN_TAP_URL,
    citation: 'Hồ Chí Minh: Toàn tập, Tập 6 (1949 - 1950), NXB Chính trị quốc gia Sự thật, Hà Nội, 2011.'
  },
  {
    volume: 7,
    timeRange: '1951 – 1952',
    title: 'Hồ Chí Minh Toàn tập – Tập 7 (1951 – 1952)',
    description: 'Đại hội đại biểu toàn quốc lần thứ II của Đảng, đổi tên thành Đảng Lao động Việt Nam, vạch ra đường lối hoàn thành giải phóng dân tộc.',
    majorWorks: ['Báo cáo Chính trị tại Đại hội II (2/1951)', 'Chính cương Đảng Lao động Việt Nam', 'Bài nói chuyện tại các hội nghị chỉnh Đảng'],
    historicalPeriod: 'Đại hội Đảng II & Đẩy mạnh Kháng chiến Toàn diện',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    driveFolderUrl: GOOGLE_DRIVE_HCM_TOAN_TAP_URL,
    citation: 'Hồ Chí Minh: Toàn tập, Tập 7 (1951 - 1952), NXB Chính trị quốc gia Sự thật, Hà Nội, 2011.'
  },
  {
    volume: 8,
    timeRange: '1953 – 1954',
    title: 'Hồ Chí Minh Toàn tập – Tập 8 (1953 – 1954)',
    description: 'Chỉ đạo cuộc tiến công chiến lược Đông Xuân 1953 - 1954, Chiến dịch Điện Biên Phủ lịch sử và quá trình đàm phán Hiệp định Genève.',
    majorWorks: ['Chỉ thị cho Chiến dịch Điện Biên Phủ', 'Thư gửi chiến sĩ Điện Biên Phủ', 'Lời kêu gọi sau Chiến thắng Điện Biên Phủ'],
    historicalPeriod: 'Đỉnh cao Điện Biên Phủ & Hòa bình lập lại',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    driveFolderUrl: GOOGLE_DRIVE_HCM_TOAN_TAP_URL,
    citation: 'Hồ Chí Minh: Toàn tập, Tập 8 (1953 - 1954), NXB Chính trị quốc gia Sự thật, Hà Nội, 2011.'
  },
  {
    volume: 9,
    timeRange: '1954 – 1955',
    title: 'Hồ Chí Minh Toàn tập – Tập 9 (1954 – 1955)',
    description: 'Văn kiện thời kỳ tiếp quản Thủ đô, khôi phục kinh tế miền Bắc sau chiến tranh và bắt đầu cuộc đấu tranh thi hành Hiệp định Genève.',
    majorWorks: ['Lời kêu gọi nhân ngày tiếp quản Thủ đô (10/10/1954)', 'Nhiệm vụ khôi phục kinh tế miền Bắc', 'Thư gửi các ngành y tế, giáo dục'],
    historicalPeriod: 'Tiếp quản Thủ đô & Khôi phục Kinh tế miền Bắc',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    driveFolderUrl: GOOGLE_DRIVE_HCM_TOAN_TAP_URL,
    citation: 'Hồ Chí Minh: Toàn tập, Tập 9 (1954 - 1955), NXB Chính trị quốc gia Sự thật, Hà Nội, 2011.'
  },
  {
    volume: 10,
    timeRange: '1956 – 1957',
    title: 'Hồ Chí Minh Toàn tập – Tập 10 (1956 – 1957)',
    description: 'Công tác sửa sai trong cải cách ruộng đất, củng cố miền Bắc tiến lên xã hội chủ nghĩa và tăng cường ngoại giao với các nước anh em.',
    majorWorks: ['Thư gửi đồng bào về việc sửa sai cải cách ruộng đất', 'Nhiệm vụ củng cố miền Bắc', 'Các bài phát biểu ngoại giao quốc tế'],
    historicalPeriod: 'Củng cố Miền Bắc & Sửa sai Cải cách Ruộng đất',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    driveFolderUrl: GOOGLE_DRIVE_HCM_TOAN_TAP_URL,
    citation: 'Hồ Chí Minh: Toàn tập, Tập 10 (1956 - 1957), NXB Chính trị quốc gia Sự thật, Hà Nội, 2011.'
  },
  {
    volume: 11,
    timeRange: '1958 – 1959',
    title: 'Hồ Chí Minh Toàn tập – Tập 11 (1958 – 1959)',
    description: 'Tác phẩm xây dựng chủ nghĩa xã hội ở miền Bắc, rèn luyện đạo đức cách mạng của cán bộ đảng viên và phong trào thi đua sản xuất.',
    majorWorks: ['Đạo đức cách mạng (12/1958)', 'Bài nói tại Đại hội Công đoàn', 'Chỉ đạo phong trào Tổ đổi công, Hợp tác xã'],
    historicalPeriod: 'Xây dựng CNXH ở Miền Bắc & Đạo đức Cách mạng',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    driveFolderUrl: GOOGLE_DRIVE_HCM_TOAN_TAP_URL,
    citation: 'Hồ Chí Minh: Toàn tập, Tập 11 (1958 - 1959), NXB Chính trị quốc gia Sự thật, Hà Nội, 2011.'
  },
  {
    volume: 12,
    timeRange: '1959 – 1960',
    title: 'Hồ Chí Minh Toàn tập – Tập 12 (1959 – 1960)',
    description: 'Đại hội đại biểu toàn quốc lần thứ III của Đảng, thông qua Hiến pháp năm 1959 và phong trào Đồng Khởi miền Nam.',
    majorWorks: ['Báo cáo về Hiến pháp năm 1959', 'Diễn văn khai mạc Đại hội Đảng toàn quốc lần III (1960)', 'Bài ca Lịch sử nước ta'],
    historicalPeriod: 'Đại hội Đảng III & Hiến pháp 1959',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    driveFolderUrl: GOOGLE_DRIVE_HCM_TOAN_TAP_URL,
    citation: 'Hồ Chí Minh: Toàn tập, Tập 12 (1959 - 1960), NXB Chính trị quốc gia Sự thật, Hà Nội, 2011.'
  },
  {
    volume: 13,
    timeRange: '1961 – 1962',
    title: 'Hồ Chí Minh Toàn tập – Tập 13 (1961 – 1962)',
    description: 'Thực hiện Kế hoạch 5 năm lần thứ nhất miền Bắc, đẩy mạnh chi viện sức người sức của cho chiến trường miền Nam.',
    majorWorks: ['Bài phát biểu tại các Hội nghị Trung ương', 'Thư gửi đồng bào miền Nam', 'Chỉ đạo phong trào Ba xây, Ba chống'],
    historicalPeriod: 'Kế hoạch 5 năm & Chi viện miền Nam',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    driveFolderUrl: GOOGLE_DRIVE_HCM_TOAN_TAP_URL,
    citation: 'Hồ Chí Minh: Toàn tập, Tập 13 (1961 - 1962), NXB Chính trị quốc gia Sự thật, Hà Nội, 2011.'
  },
  {
    volume: 14,
    timeRange: '1963 – 1965',
    title: 'Hồ Chí Minh Toàn tập – Tập 14 (1963 – 1965)',
    description: 'Hội nghị Chính trị đặc biệt năm 1964, đập tan chiến lược "Chiến tranh đặc biệt" của Mỹ và quá trình bắt đầu viết Di chúc.',
    majorWorks: ['Báo cáo tại Hội nghị Chính trị đặc biệt (3/1964)', 'Khởi thảo Di chúc lịch sử (5/1965)', 'Lời kêu gọi chống Mỹ cứu nước'],
    historicalPeriod: 'Kháng chiến chống Mỹ & Khởi thảo Di chúc',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    driveFolderUrl: GOOGLE_DRIVE_HCM_TOAN_TAP_URL,
    citation: 'Hồ Chí Minh: Toàn tập, Tập 14 (1963 - 1965), NXB Chính trị quốc gia Sự thật, Hà Nội, 2011.'
  },
  {
    volume: 15,
    timeRange: '1965 – 1969',
    title: 'Hồ Chí Minh Toàn tập – Tập 15 (1965 – 1969)',
    description: 'Lời kêu gọi vang dội "Không có gì quý hơn độc lập, tự do", tác phẩm quét sạch chủ nghĩa cá nhân và toàn văn Di chúc di sản lịch sử.',
    majorWorks: ['Lời kêu gọi đồng bào và chiến sĩ cả nước (17/7/1966)', 'Nâng cao đạo đức cách mạng, quét sạch chủ nghĩa cá nhân (3/2/1969)', 'Di chúc của Chủ tịch Hồ Chí Minh (1965 – 1969)'],
    historicalPeriod: 'Lời Hịch Độc Lập & Di Chúc Lịch Sử Vô Giá',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    driveFolderUrl: GOOGLE_DRIVE_HCM_TOAN_TAP_URL,
    citation: 'Hồ Chí Minh: Toàn tập, Tập 15 (1965 - 1969), NXB Chính trị quốc gia Sự thật, Hà Nội, 2011.'
  }
];

// ==========================================
// 3. THƯ VIỆN 15 TÁC PHẨM CHÍNH TRỊ - LÝ LUẬN KINH ĐIỂN (LEVEL A)
// ==========================================
export const HISTORICAL_WORKS: HistoricalWork[] = [
  {
    id: 'wk-01',
    title: 'Yêu sách của nhân dân An Nam',
    originalTitle: 'Revendications du peuple annamite',
    penName: 'Nguyễn Ái Quốc',
    year: '1919',
    publishedPlace: 'Paris, Pháp',
    historicalContext: 'Chiến tranh thế giới thứ nhất kết thúc, Hội nghị hòa bình khai mạc tại Versailles phân chia lại quyền lợi các nước.',
    summary: 'Văn kiện gồm 8 điểm đòi các quyền tự do dân chủ cơ bản: Tổng ân xá tù chính trị; cải cách tư pháp; tự do ngôn luận, báo chí, lập hội, hội họp, cư trú và xuất ngoại.',
    keyIdeas: [
      'Đòi quyền tự do dân chủ tối thiểu cho người bản xứ',
      'Đòi bãi bỏ chế độ cai trị bằng sắc lệnh, ban hành chế độ luật pháp bình đẳng',
      'Đánh dấu sự xuất hiện của tên tuổi Nguyễn Ái Quốc trên trường quốc tế'
    ],
    volume: 1,
    pageRange: '469-471',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialSourceUrl: 'https://hochiminh.vn/tac-pham/yeu-sach-cua-nhan-dan-an-nam',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'wk-02',
    title: 'Bản án chế độ thực dân Pháp',
    originalTitle: 'Le Procès de la colonisation française',
    penName: 'Nguyễn Ái Quốc',
    year: '1925',
    publishedPlace: 'Paris (Thư quán Lao động xuất bản)',
    historicalContext: 'Được viết tại Pháp trong những năm 1921–1925 và xuất bản lần đầu tại Paris năm 1925.',
    summary: 'Tác phẩm gồm 12 chương và phần phụ lục "Gửi thanh niên An Nam"; dùng số liệu, tư liệu thực tế vạch trần tội ác dã man của thực dân Pháp tại Đông Dương và các thuộc địa.',
    keyIdeas: [
      'Bóc trần sự thật về cái gọi là "sứ mệnh khai hóa văn minh"',
      'Chỉ rõ nỗi thống khổ cùng cực của người dân bản xứ: thuế má, bắt phu, thuốc phiện, rượu cồn',
      'Khẳng định cách mạng giải phóng thuộc địa là một bộ phận khăng khít của cách mạng vô sản thế giới'
    ],
    volume: 2,
    pageRange: '1-138',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialSourceUrl: 'https://hochiminh.vn/tac-pham/ban-an-che-do-thuc-dan-phap',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'wk-03',
    title: 'Đường Kách mệnh',
    penName: 'Nguyễn Ái Quốc',
    year: '1927',
    publishedPlace: 'Quảng Châu, Trung Quốc',
    historicalContext: 'Tập hợp các bài giảng của Nguyễn Ái Quốc tại các lớp huấn luyện cán bộ cách mạng của Hội Việt Nam Cách mạng Thanh niên từ 1925 đến 1927.',
    summary: 'Cuốn sách lý luận cách mạng đầu tiên của Việt Nam; mở đầu bằng việc nêu rõ 23 điều về "Tư cách một người cách mệnh", tiếp đó phân tích kinh nghiệm các cuộc cách mạng trên thế giới và con đường cứu nước của dân tộc.',
    keyIdeas: [
      'Đạo đức và tư cách của người chiến sĩ cách mạng: cần, kiệm, vị công vong tư, giữ nghiêm kỷ luật',
      'Cách mạng là sự nghiệp của quần chúng nhân dân chứ không phải việc riêng của một hai người',
      'Cách mạng muốn thành công trước hết phải có Đảng tiên phong lãnh đạo theo chủ nghĩa Mác - Lênin'
    ],
    volume: 2,
    pageRange: '279-347',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialSourceUrl: 'https://hochiminh.vn/tac-pham/duong-kach-menh',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'wk-04',
    title: 'Chánh cương vắn tắt & Sách lược vắn tắt của Đảng',
    penName: 'Nguyễn Ái Quốc',
    year: '1930',
    publishedPlace: 'Hội nghị thành lập Đảng tại Hương Cảng',
    historicalContext: 'Được thông qua tại Hội nghị hợp nhất các tổ chức cộng sản Việt Nam từ ngày 6/1 đến 7/2/1930.',
    summary: 'Cương lĩnh chính trị đầu tiên của Đảng Cộng sản Việt Nam; vạch rõ mục tiêu, động lực, giai cấp lãnh đạo và sách lược liên minh của cách mạng nước ta.',
    keyIdeas: [
      'Chủ trương làm tư sản dân quyền cách mạng và thổ địa cách mạng để đi tới xã hội cộng sản',
      'Đánh đổ đế quốc chủ nghĩa Pháp và bọn phong kiến, làm cho nước Việt Nam hoàn toàn độc lập',
      'Đảng là đội tiên phong của đạo quân vô sản; phải thu phục đại bộ phận giai cấp mình, liên minh chặt chẽ với nông dân và tranh thủ các tầng lớp tiến bộ'
    ],
    volume: 3,
    pageRange: '1-5',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialSourceUrl: 'https://tulieuvankien.dangcongsan.vn/',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'wk-05',
    title: 'Nhật ký trong tù (Ngục trung nhật ký)',
    penName: 'Hồ Chí Minh',
    year: '1942 – 1943',
    publishedPlace: 'Nhà tù các huyện tỉnh Quảng Tây, Trung Quốc',
    historicalContext: 'Bác viết bằng chữ Hán trong thời gian bị giam giữ trái phép tại gần 30 nhà lao ở Quảng Tây từ tháng 8/1942 đến tháng 9/1943.',
    summary: 'Gồm 133 bài thơ ghi chép những trải nghiệm trong ngục tù; toát lên tinh thần thép kiên cường, tình yêu thiên nhiên, lòng nhân ái bao la và niềm tin son sắt vào ngày mai tự do.',
    keyIdeas: [
      'Ý chí sắt đá của người chiến sĩ cách mạng trước gian nguy tù đày',
      'Tinh thần lạc quan cách mạng: "Thân thể ở trong lao, Tinh thần ở ngoài lao"',
      'Tấm lòng xót thương sâu sắc đối với những mảnh đời nghèo khổ, lầm than'
    ],
    volume: 3,
    pageRange: '260-420',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialSourceUrl: 'https://hochiminh.vn/tac-pham/nhat-ky-trong-tu',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'wk-06',
    title: 'Tuyên ngôn Độc lập',
    penName: 'Hồ Chí Minh',
    year: '1945',
    publishedPlace: 'Quảng trường Ba Đình, Hà Nội (02/09/1945)',
    historicalContext: 'Khởi thảo tại căn gác số 48 Hàng Ngang sau thắng lợi của cuộc Tổng khởi nghĩa Tháng Tám năm 1945.',
    summary: 'Khẳng định quyền tự do độc lập thiêng liêng của dân tộc; trích dẫn Tuyên ngôn Độc lập Mỹ năm 1776 và Tuyên ngôn Nhân quyền và Dân quyền Pháp năm 1791 để nâng lên thành quyền tự quyết của mọi dân tộc.',
    keyIdeas: [
      'Tất cả các dân tộc trên thế giới đều sinh ra bình đẳng; dân tộc nào cũng có quyền sống, quyền sung sướng và quyền tự do',
      'Vạch trần tội ác thực dân Pháp phản bội nhân dân ta, hai lần quỳ gối dâng Đông Dương cho Nhật',
      'Tuyên bố dứt khoát thoát ly quan hệ thực dân; quyết đem toàn bộ tinh thần và lực lượng để giữ vững độc lập'
    ],
    volume: 4,
    pageRange: '1-4',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialSourceUrl: 'https://hochiminh.vn/tac-pham/tuyen-ngon-doc-lap',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'wk-07',
    title: 'Lời kêu gọi toàn quốc kháng chiến',
    penName: 'Hồ Chí Minh',
    year: '1946',
    publishedPlace: 'Phát trên sóng Đài Tiếng nói Việt Nam (19/12/1946)',
    historicalContext: 'Viết tại làng Vạn Phúc (Hà Đông) trong bối cảnh thực dân Pháp liên tục gây hấn, quyết tâm xâm lược nước ta một lần nữa.',
    summary: 'Hiệu triệu toàn thể quốc dân đồng bào, không phân biệt già trẻ gái trai, tôn giáo đảng phái, hễ là người Việt Nam thì phải đứng lên kháng chiến cứu nước.',
    keyIdeas: [
      'Chúng ta muốn hòa bình, chúng ta phải nhân nhượng. Nhưng nhân nhượng càng bị lấn tới vì dã tâm cướp nước',
      'Thà hy sinh tất cả chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ',
      'Hễ là người Việt Nam thì phải đánh thực dân Pháp cứu Tổ quốc; ai có súng dùng súng, ai có gươm dùng gươm'
    ],
    volume: 4,
    pageRange: '534',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialSourceUrl: 'https://hochiminh.vn/tac-pham/loi-keu-goi-toan-quoc-khang-chien',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'wk-08',
    title: 'Đời sống mới',
    penName: 'Tân Sinh',
    year: '1947',
    publishedPlace: 'Chiến khu Việt Bắc (Tháng 3/1947)',
    historicalContext: 'Toàn quốc bước vào cuộc kháng chiến trường kỳ gian khổ; cần xây dựng nếp sống văn minh, tiết kiệm, tương thân tương ái.',
    summary: 'Hướng dẫn cụ thể về việc thực hành đời sống mới trong gia đình, làng xóm, trường học, cơ quan, bộ đội: Cần, Kiệm, Liêm, Chính, xóa bỏ mê tín hủ tục.',
    keyIdeas: [
      'Đời sống mới không phải cái gì cũ cũng bỏ, cái gì mới cũng theo; cái gì cũ mà xấu thì bỏ, cái gì cũ mà tốt thì phát triển',
      'Thực hành cần kiệm: Siêng năng làm việc, không xa xỉ lãng phí',
      'Làm cho nhân dân ai cũng biết chữ, ai cũng có cơm ăn áo mặc và đời sống đạo đức lành mạnh'
    ],
    volume: 5,
    pageRange: '110-132',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialSourceUrl: 'https://hochiminh.vn/tac-pham/doi-song-moi',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'wk-09',
    title: 'Sửa đổi lối làm việc',
    penName: 'X.Y.Z',
    year: '1947',
    publishedPlace: 'Chiến khu Việt Bắc (Tháng 10/1947)',
    historicalContext: 'Đảng đã nắm chính quyền; xuất hiện một số căn bệnh quan liêu, xa dân, hẹp hòi ở một bộ phận cán bộ đảng viên.',
    summary: 'Cẩm nang xây dựng và chỉnh đốn Đảng gồm 6 phần; phê phán sâu sắc bệnh chủ quan, hẹp hòi, ba hoa; vạch rõ tư cách cán bộ và phương pháp lãnh đạo đúng đắn.',
    keyIdeas: [
      'Cán bộ là cái gốc của mọi công việc; huấn luyện cán bộ là công việc gốc của Đảng',
      'Phải chống căn bệnh quan liêu, kiêu ngạo, kéo bè kéo cánh, xa rời quần chúng',
      'Người cán bộ phải có đạo đức cách mạng: Cần, kiệm, liêm, chính, chí công vô tư, gần dân và lắng nghe dân'
    ],
    volume: 5,
    pageRange: '269-346',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialSourceUrl: 'https://hochiminh.vn/tac-pham/sua-doi-loi-lam-viec',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'wk-10',
    title: 'Lời kêu gọi thi đua ái quốc',
    penName: 'Hồ Chí Minh',
    year: '1948',
    publishedPlace: 'Chiến khu Việt Bắc (11/06/1948)',
    historicalContext: 'Kỷ niệm 1.000 ngày toàn quốc kháng chiến; động viên toàn dân tộc đoàn kết tăng gia sản xuất và giết giặc lập công.',
    summary: 'Khởi xướng phong trào thi đua yêu nước toàn dân; coi thi đua là cách thức tốt nhất để đoàn kết và phát huy sức mạnh to lớn của nhân dân.',
    keyIdeas: [
      'Thi đua là yêu nước, yêu nước thì phải thi đua',
      'Những người thi đua là những người yêu nước nhất',
      'Mỗi người dân Việt Nam bất kỳ già, trẻ, trai, gái; bất kỳ giàu, nghèo, lớn, nhỏ đều phải trở nên một chiến sĩ thi đua'
    ],
    volume: 5,
    pageRange: '556-558',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialSourceUrl: 'https://hochiminh.vn/tac-pham/loi-keu-goi-thi-dua-ai-quoc',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'wk-11',
    title: 'Dân vận',
    penName: 'X.Y.Z',
    year: '1949',
    publishedPlace: 'Đăng trên báo Sự thật, số 120 (15/10/1949)',
    historicalContext: 'Cuộc kháng chiến bước sang giai đoạn tổng phản công; công tác vận động quần chúng đòi hỏi phải thực chất và sâu sát.',
    summary: 'Bài viết ngắn gọn, súc tích gồm 4 mục: 1. Nước ta là nước dân chủ; 2. Dân vận là gì?; 3. Ai phụ trách dân vận?; 4. Dân vận phải thế nào?',
    keyIdeas: [
      'Bao nhiêu lợi ích đều vì dân. Bao nhiêu quyền hạn đều của dân... Quyền hành và lực lượng đều ở nơi dân',
      'Dân vận là vận động tất cả lực lượng của mỗi một người dân không để sót một người dân nào',
      'Không thể chỉ dùng báo chương hay khẩu hiệu; người làm dân vận phải "óc nghĩ, mắt trông, tai nghe, chân đi, miệng nói, tay làm"'
    ],
    volume: 6,
    pageRange: '232-234',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialSourceUrl: 'https://tulieuvankien.dangcongsan.vn/',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'wk-12',
    title: 'Đạo đức cách mạng',
    penName: 'Trần Lực',
    year: '1958',
    publishedPlace: 'Đăng trên Tạp chí Học tập, số 12 (Tháng 12/1958)',
    historicalContext: 'Miền Bắc bước vào giai đoạn khôi phục kinh tế và cải tạo xã hội chủ nghĩa; một số cán bộ có biểu hiện thỏa mãn, thoái hóa.',
    summary: 'Phân tích bản chất của đạo đức vô sản; phân biệt rõ giữa đạo đức cách mạng và chủ nghĩa cá nhân; khẳng định quyết tâm quét sạch chủ nghĩa cá nhân.',
    keyIdeas: [
      'Đạo đức cách mạng là suốt đời phấn đấu cho Đảng, cho cách mạng; đặt lợi ích của Đảng và nhân dân lên trên hết',
      'Chủ nghĩa cá nhân là kẻ địch nguy hiểm, là nguồn gốc sinh ra hàng trăm thứ bệnh quan liêu, tham ô, lãng phí',
      'Người cách mạng phải luôn tự soi, tự sửa, học tập lý luận và gắn bó mật thiết với nhân dân'
    ],
    volume: 11,
    pageRange: '600-615',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialSourceUrl: 'https://hochiminh.vn/tac-pham/dao-duc-cach-mang',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'wk-13',
    title: 'Lời kêu gọi đồng bào và chiến sĩ cả nước (17/7/1966)',
    penName: 'Hồ Chí Minh',
    year: '1966',
    publishedPlace: 'Đài Tiếng nói Việt Nam & Báo Nhân Dân (17/07/1966)',
    historicalContext: 'Đế quốc Mỹ đưa quân ồ ạt vào miền Nam và leo thang đánh phá miền Bắc dữ dội bằng không quân.',
    summary: 'Lời hịch cứu nước cổ vũ ý chí quật cường của toàn dân tộc; đúc kết chân lý sáng ngời của mọi thời đại.',
    keyIdeas: [
      'Chiến tranh có thể kéo dài 5 năm, 10 năm, 20 năm hoặc lâu hơn nữa; song nhân dân Việt Nam quyết không sợ!',
      'Không có gì quý hơn độc lập, tự do!',
      'Đến ngày thắng lợi, nhân dân ta sẽ xây dựng lại đất nước ta đàng hoàng hơn, to đẹp hơn!'
    ],
    volume: 15,
    pageRange: '130-131',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialSourceUrl: 'https://hochiminh.vn/tac-pham/loi-keu-goi-dong-bao-va-chien-si-ca-nuoc-17-7-1966',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'wk-14',
    title: 'Nâng cao đạo đức cách mạng, quét sạch chủ nghĩa cá nhân',
    penName: 'Hồ Chí Minh',
    year: '1969',
    publishedPlace: 'Đăng trên báo Nhân Dân, số 5409 (03/02/1969)',
    historicalContext: 'Nhân dịp kỷ niệm 39 năm thành lập Đảng; chuẩn bị lực lượng cho cuộc kháng chiến đi tới thắng lợi cuối cùng.',
    summary: 'Bài viết nhấn mạnh công tác xây dựng Đảng về đạo đức; chỉ ra các biểu hiện suy thoái và giải pháp rèn luyện tính tiên phong gương mẫu.',
    keyIdeas: [
      'Mỗi cán bộ, đảng viên phải đặt lợi ích của cách mạng, của Đảng, của nhân dân lên trên hết, trước hết',
      'Thực hiện nghiêm túc tự phê bình và phê bình trong Đảng; giữ gìn kỷ luật sắt',
      'Chăm lo đời sống vật chất và tinh thần của nhân dân, tôn trọng quyền làm chủ tập thể của quần chúng'
    ],
    volume: 15,
    pageRange: '546-549',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialSourceUrl: 'https://hochiminh.vn/tac-pham/nang-cao-dao-duc-cach-mang-quet-sach-chu-nghia-ca-nhan',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'wk-15',
    title: 'Di chúc của Chủ tịch Hồ Chí Minh',
    penName: 'Hồ Chí Minh',
    year: '1965 – 1969',
    publishedPlace: 'Công bố chính thức tháng 9/1969',
    historicalContext: 'Bác tự tay khởi thảo vào dịp sinh nhật 75 tuổi (tháng 5/1965), mỗi năm Người xem lại và bổ sung, sửa chữa cho đến tháng 5/1969.',
    summary: 'Di sản tinh thần vô giá để lại muôn vàn tình thương yêu cho toàn Đảng, toàn dân; dặn dò tỉ mỉ về xây dựng Đảng, bồi dưỡng thế hệ trẻ, chăm lo đời sống nhân dân và đoàn kết quốc tế.',
    keyIdeas: [
      'Trước hết nói về Đảng: Giữ gìn sự đoàn kết nhất trí của Đảng như giữ gìn con ngươi của mắt mình',
      'Đoàn viên và thanh niên ta nói chung là tốt, mọi việc đều hăng hái; bồi dưỡng thế hệ cách mạng cho đời sau là một việc rất quan trọng và rất cần thiết',
      'Nhân dân lao động ta chịu đựng nhiều gian khổ, Đảng phải có kế hoạch thật tốt để phát triển kinh tế và văn hóa, không ngừng nâng cao đời sống của nhân dân',
      'Điều mong muốn cuối cùng: Toàn Đảng, toàn dân ta đoàn kết phấn đấu, xây dựng một nước Việt Nam hòa bình, thống nhất, độc lập, dân chủ và giàu mạnh'
    ],
    volume: 15,
    pageRange: '621-624',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialSourceUrl: 'https://hochiminh.vn/tac-pham/di-chuc',
    verificationStatus: 'VERIFIED'
  }
];

// ==========================================
// 4. KHO TRÍCH DẪN ĐÃ XÁC MINH NGUỒN ("LỜI NGƯỜI")
// ==========================================
export const VERIFIED_QUOTES: VerifiedQuote[] = [
  {
    id: 'qt-01',
    quoteText: 'Không có gì quý hơn độc lập, tự do.',
    category: 'Độc lập tự do',
    occasion: 'Lời kêu gọi đồng bào và chiến sĩ cả nước chống Mỹ',
    dateStr: '17/07/1966',
    originalWork: 'Lời kêu gọi ngày 17-7-1966',
    volume: 15,
    page: '131',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialUrl: 'https://hochiminh.vn/',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'qt-02',
    quoteText: 'Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công!',
    category: 'Đại đoàn kết',
    occasion: 'Nói chuyện tại Lớp bồi dưỡng cán bộ Mặt trận khóa 2',
    dateStr: 'Tháng 8/1962',
    originalWork: 'Bài nói tại Lớp bồi dưỡng cán bộ Mặt trận',
    volume: 13,
    page: '455',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialUrl: 'https://hochiminh.vn/',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'qt-03',
    quoteText: 'Dân vận kém thì việc gì cũng kém. Dân vận khéo thì việc gì cũng thành công.',
    category: 'Dân vận',
    occasion: 'Đăng trên báo Sự thật, số 120',
    dateStr: '15/10/1949',
    originalWork: 'Bài báo "Dân vận"',
    volume: 6,
    page: '234',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialUrl: 'https://tulieuvankien.dangcongsan.vn/',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'qt-04',
    quoteText: 'Thi đua là yêu nước, yêu nước thì phải thi đua. Và những người thi đua là những người yêu nước nhất.',
    category: 'Thi đua ái quốc',
    occasion: 'Báo cáo tại Đại hội các chiến sĩ thi đua toàn quốc lần thứ nhất',
    dateStr: '01/05/1952',
    originalWork: 'Báo cáo Thi đua ái quốc',
    volume: 7,
    page: '407',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialUrl: 'https://hochiminh.vn/',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'qt-05',
    quoteText: 'Vì lợi ích mười năm thì phải trồng cây, vì lợi ích trăm năm thì phải trồng người.',
    category: 'Thanh niên & Giáo dục',
    occasion: 'Nói chuyện tại Lớp học chính trị của giáo viên cấp II, cấp III toàn miền Bắc',
    dateStr: '13/09/1958',
    originalWork: 'Bài nói chuyện với giáo viên',
    volume: 11,
    page: '528',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialUrl: 'https://hochiminh.vn/',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'qt-06',
    quoteText: 'Đoàn kết là một truyền thống cực kỳ quý báu của Đảng và của dân ta... Các đồng chí từ Trung ương đến các chi bộ cần phải giữ gìn sự đoàn kết nhất trí của Đảng như giữ gìn con ngươi của mắt mình.',
    category: 'Đại đoàn kết',
    occasion: 'Khởi thảo và dặn dò trong Di chúc thiêng liêng',
    dateStr: 'Tháng 5/1965',
    originalWork: 'Di chúc của Chủ tịch Hồ Chí Minh',
    volume: 15,
    page: '622',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialUrl: 'https://hochiminh.vn/',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'qt-07',
    quoteText: 'Cán bộ là cái gốc của mọi công việc. Vì vậy, huấn luyện cán bộ là công việc gốc của Đảng.',
    category: 'Cán bộ & Đạo đức',
    occasion: 'Viết tại chiến khu Việt Bắc',
    dateStr: 'Tháng 10/1947',
    originalWork: 'Sửa đổi lối làm việc',
    volume: 5,
    page: '309',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialUrl: 'https://hochiminh.vn/',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'qt-08',
    quoteText: 'Trong bầu trời không gì quý bằng nhân dân. Trong thế giới không gì mạnh bằng lực lượng đoàn kết của nhân dân.',
    category: 'Đại đoàn kết',
    occasion: 'Đăng trên báo Cứu quốc',
    dateStr: 'Năm 1953',
    originalWork: 'Bài viết trên báo Cứu quốc',
    volume: 8,
    page: '276',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialUrl: 'https://hochiminh.vn/',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'qt-09',
    quoteText: 'Việc gì có lợi cho dân, ta phải hết sức làm. Việc gì hại đến dân, ta phải hết sức tránh.',
    category: 'Dân vận',
    occasion: 'Thư gửi Ủy ban nhân dân các kỳ, tỉnh, huyện và làng',
    dateStr: '17/10/1945',
    originalWork: 'Thư gửi Ủy ban nhân dân',
    volume: 4,
    page: '65',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialUrl: 'https://hochiminh.vn/',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'qt-10',
    quoteText: 'Người cách mạng phải có đạo đức cách mạng làm nền tảng, mới hoàn thành được nhiệm vụ cách mạng vẻ vang.',
    category: 'Cán bộ & Đạo đức',
    occasion: 'Đăng trên Tạp chí Học tập (nay là Tạp chí Cộng sản)',
    dateStr: 'Tháng 12/1958',
    originalWork: 'Đạo đức cách mạng',
    volume: 11,
    page: '601',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialUrl: 'https://hochiminh.vn/',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'qt-11',
    quoteText: 'Đoàn kết là sức mạnh, là then chốt của thành công.',
    category: 'Đại đoàn kết',
    occasion: 'Nói chuyện tại Đại hội thống nhất Việt Minh - Liên Việt',
    dateStr: '03/03/1951',
    originalWork: 'Bài nói tại Đại hội thống nhất',
    volume: 7,
    page: '49',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialUrl: 'https://hochiminh.vn/',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'qt-12',
    quoteText: 'Thực hành khẩu hiệu: Óc nghĩ, mắt trông, tai nghe, chân đi, miệng nói, tay làm. Chứ không phải chỉ nói suông, chỉ ngồi viết mệnh lệnh.',
    category: 'Dân vận',
    occasion: 'Bàn về phương pháp làm công tác dân vận quần chúng',
    dateStr: '15/10/1949',
    originalWork: 'Bài báo "Dân vận"',
    volume: 6,
    page: '234',
    publisher: 'NXB Chính trị quốc gia Sự thật',
    officialUrl: 'https://tulieuvankien.dangcongsan.vn/',
    verificationStatus: 'VERIFIED'
  }
];

// ==========================================
// 5. 20 TỌA ĐỘ BẢN ĐỒ TƯƠNG TÁC "DẤU CHÂN NGƯỜI"
// ==========================================
export const FOOTSTEP_LOCATIONS: FootstepLocation[] = [
  {
    id: 'loc-01',
    name: 'Nam Đàn (Nghệ An)',
    country: 'Việt Nam',
    periodYears: '1890 – 1895, 1901 – 1906',
    coordinates: [18.6796, 105.5786],
    aliasUsed: 'Nguyễn Sinh Cung',
    historicalAction: 'Nơi sinh ra và nuôi dưỡng những năm tháng ấu thơ; tiếp thu truyền thống hiếu học và lòng yêu nước quật cường của xứ Nghệ.',
    primaryRelic: 'Khu Di tích Quốc gia đặc biệt Kim Liên',
    sourceReference: 'Hồ Chí Minh – Biên niên tiểu sử, Tập 1, tr. 19'
  },
  {
    id: 'loc-02',
    name: 'Kinh thành Huế',
    country: 'Việt Nam',
    periodYears: '1895 – 1901, 1906 – 1909',
    coordinates: [16.4637, 107.5909],
    aliasUsed: 'Nguyễn Tất Thành',
    historicalAction: 'Học tập tại trường Tiểu học Đông Ba và trường Quốc Học Huế; tham gia biểu tình chống sưu thuế năm 1908.',
    primaryRelic: 'Trường Quốc Học Huế & Nhà lưu niệm đường Mai Thúc Loan',
    sourceReference: 'Hồ Chí Minh – Biên niên tiểu sử, Tập 1, tr. 25-37'
  },
  {
    id: 'loc-03',
    name: 'Phan Thiết (Bình Thuận)',
    country: 'Việt Nam',
    periodYears: '1910 – 1911',
    coordinates: [10.9275, 108.0989],
    aliasUsed: 'Nguyễn Tất Thành',
    historicalAction: 'Dạy học tại trường Dục Thanh; rèn luyện sức khỏe và bồi dưỡng tư tưởng yêu nước cho thế hệ trẻ.',
    primaryRelic: 'Khu Di tích Trường Dục Thanh (Bảo tàng Hồ Chí Minh Bình Thuận)',
    sourceReference: 'Hồ Chí Minh – Biên niên tiểu sử, Tập 1, tr. 40-42'
  },
  {
    id: 'loc-04',
    name: 'Bến Nhà Rồng (Sài Gòn)',
    country: 'Việt Nam',
    periodYears: '1911',
    coordinates: [10.7681, 106.7067],
    aliasUsed: 'Văn Ba',
    historicalAction: 'Xuống tàu Amiral Latouche-Tréville ngày 05/6/1911 bắt đầu hành trình 30 năm bôn ba tìm đường cứu nước.',
    primaryRelic: 'Bảo tàng Hồ Chí Minh – Chi nhánh TP. Hồ Chí Minh',
    sourceReference: 'Hồ Chí Minh – Biên niên tiểu sử, Tập 1, tr. 45'
  },
  {
    id: 'loc-05',
    name: 'Marseille & Le Havre',
    country: 'Pháp',
    periodYears: '1911',
    coordinates: [43.2965, 5.3698],
    aliasUsed: 'Văn Ba',
    historicalAction: 'Những cảng biển đầu tiên Người đặt chân đến châu Âu; tận mắt chứng kiến đời sống công nhân cảng Pháp.',
    primaryRelic: 'Cảng Marseille và cảng Le Havre',
    sourceReference: 'Hồ Chí Minh Toàn tập, Tập 1, tr. 483'
  },
  {
    id: 'loc-06',
    name: 'Boston & New York',
    country: 'Hoa Kỳ',
    periodYears: '1912 – 1913',
    coordinates: [42.3601, -71.0589],
    aliasUsed: 'Nguyễn Tất Thành',
    historicalAction: 'Làm việc tại khách sạn Parker House; nghiên cứu Tuyên ngôn Độc lập Hoa Kỳ năm 1776 và đời sống người lao động Mỹ.',
    primaryRelic: 'Khách sạn Omni Parker House (Boston)',
    sourceReference: 'Hồ Chí Minh – Biên niên tiểu sử, Tập 1, tr. 47-50'
  },
  {
    id: 'loc-07',
    name: 'London',
    country: 'Vương quốc Anh',
    periodYears: '1913 – 1917',
    coordinates: [51.5074, -0.1278],
    aliasUsed: 'Nguyễn Tất Thành',
    historicalAction: 'Làm thợ quét tuyết, phụ bếp tại khách sạn Carlton; tham gia Hội Lao động Hải ngoại, học tiếng Anh.',
    primaryRelic: 'Tòa nhà New Zealand House (nơi từng là khách sạn Carlton, có gắn biển tưởng niệm)',
    sourceReference: 'Hồ Chí Minh – Biên niên tiểu sử, Tập 1, tr. 51-56'
  },
  {
    id: 'loc-08',
    name: 'Paris',
    country: 'Pháp',
    periodYears: '1917 – 1923',
    coordinates: [48.8566, 2.3522],
    aliasUsed: 'Nguyễn Ái Quốc',
    historicalAction: 'Gửi Bản Yêu sách của nhân dân An Nam (1919); đọc Luận cương Lênin (1920); sáng lập Đảng Cộng sản Pháp; chủ nhiệm báo Le Paria.',
    primaryRelic: 'Số 9 ngõ Compoint và số 56 phố Compoint; Không gian Hồ Chí Minh tại Bảo tàng Lịch sử Sống (Montreuil)',
    sourceReference: 'Hồ Chí Minh Toàn tập, Tập 1 & 2'
  },
  {
    id: 'loc-09',
    name: 'Moscow',
    country: 'Liên Xô (LB Nga)',
    periodYears: '1923 – 1924, 1934 – 1938',
    coordinates: [55.7558, 37.6173],
    aliasUsed: 'Nguyễn Ái Quốc / Linov',
    historicalAction: 'Học tập Trường Đại học Phương Đông; dự Đại hội V Quốc tế Cộng sản; nghiên cứu tại Viện Các vấn đề Dân tộc và Thuộc địa.',
    primaryRelic: 'Quảng trường Hồ Chí Minh & Tượng đài Bác Hồ tại Thủ đô Moscow',
    sourceReference: 'Hồ Chí Minh – Biên niên tiểu sử, Tập 1 & 2'
  },
  {
    id: 'loc-10',
    name: 'Quảng Châu',
    country: 'Trung Quốc',
    periodYears: '1924 – 1927',
    coordinates: [23.1291, 113.2644],
    aliasUsed: 'Lý Thụy',
    historicalAction: 'Thành lập Hội Việt Nam Cách mạng Thanh niên; xuất bản báo Thanh Niên; viết và xuất bản tác phẩm Đường Kách mệnh.',
    primaryRelic: 'Di tích Trụ sở Hội Việt Nam Cách mạng Thanh niên (đường Văn Minh, Quảng Châu)',
    sourceReference: 'Hồ Chí Minh – Biên niên tiểu sử, Tập 1, tr. 283-345'
  },
  {
    id: 'loc-11',
    name: 'Siam (Thái Lan)',
    country: 'Thái Lan',
    periodYears: '1928 – 1929',
    coordinates: [17.4138, 102.7872],
    aliasUsed: 'Thầu Chín',
    historicalAction: 'Gây dựng cơ sở cách mạng trong kiều bào tại Bản Đông (Phichit), Udon Thani; mở trường dạy chữ và dịch sách.',
    primaryRelic: 'Khu Tưởng niệm Chủ tịch Hồ Chí Minh tại Udon Thani và Nakhon Phanom',
    sourceReference: 'Hồ Chí Minh – Biên niên tiểu sử, Tập 1, tr. 350-365'
  },
  {
    id: 'loc-12',
    name: 'Hương Cảng (Hồng Kông)',
    country: 'Trung Quốc',
    periodYears: '1930, 1931 – 1933',
    coordinates: [22.3193, 114.1694],
    aliasUsed: 'Tống Văn Sơ',
    historicalAction: 'Chủ trì Hội nghị hợp nhất thành lập Đảng Cộng sản Việt Nam (1930); kiên cường vượt qua vụ án bắt giam trái phép (1931–1933).',
    primaryRelic: 'Khuôn viên nhà tù Victoria và Tòa án Tối cao cũ ở Hồng Kông',
    sourceReference: 'Văn kiện Đảng Toàn tập, Tập 2 & Hồ Chí Minh Biên niên tiểu sử'
  },
  {
    id: 'loc-13',
    name: 'Quế Lâm & Côn Minh',
    country: 'Trung Quốc',
    periodYears: '1938 – 1940',
    coordinates: [25.0453, 102.7097],
    aliasUsed: 'Hồ Quang',
    historicalAction: 'Gặp gỡ các đồng chí Trung ương Đảng từ trong nước sang; chỉ đạo công tác chuẩn bị hồi hương trực tiếp lãnh đạo cách mạng.',
    primaryRelic: 'Di tích nhà lưu niệm Côn Minh và Quế Lâm',
    sourceReference: 'Hồ Chí Minh – Biên niên tiểu sử, Tập 2, tr. 80-110'
  },
  {
    id: 'loc-14',
    name: 'Pác Bó (Cao Bằng)',
    country: 'Việt Nam',
    periodYears: '1941 – 1945',
    coordinates: [22.9818, 106.0505],
    aliasUsed: 'Già Thu',
    historicalAction: 'Trở về Tổ quốc ngày 28/01/1941; triệu tập Hội nghị Trung ương 8, thành lập Mặt trận Việt Minh; dịch Lịch sử Đảng Cộng sản Liên Xô.',
    primaryRelic: 'Khu Di tích Quốc gia đặc biệt Pác Bó (Hang Cốc Bó, Suối Lê-nin, Núi Các-Mác, Lán Khuổi Nậm)',
    sourceReference: 'Hồ Chí Minh – Biên niên tiểu sử, Tập 2, tr. 115-136'
  },
  {
    id: 'loc-15',
    name: 'Tân Trào (Tuyên Quang)',
    country: 'Việt Nam',
    periodYears: '1945, 1947 – 1954',
    coordinates: [21.7831, 105.2917],
    aliasUsed: 'Hồ Chí Minh',
    historicalAction: 'Chủ trì Quốc dân Đại hội Tân Trào; phát lệnh Tổng khởi nghĩa Tháng Tám; lãnh đạo toàn quốc kháng chiến từ thủ đô kháng chiến.',
    primaryRelic: 'Khu Di tích Quốc gia đặc biệt Tân Trào (Lán Nà Nưa, Cây đa Tân Trào, Đình Tân Trào)',
    sourceReference: 'Hồ Chí Minh – Biên niên tiểu sử, Tập 2 & 4'
  },
  {
    id: 'loc-16',
    name: 'Số 48 Hàng Ngang (Hà Nội)',
    country: 'Việt Nam',
    periodYears: '1945',
    coordinates: [21.0347, 105.8504],
    aliasUsed: 'Hồ Chí Minh',
    historicalAction: 'Căn gác nơi Bác soạn thảo bản Tuyên ngôn Độc lập lịch sử từ ngày 26/8 đến ngày 29/8/1945.',
    primaryRelic: 'Di tích Cách mạng Nhà số 48 Hàng Ngang, Quận Hoàn Kiếm, Hà Nội',
    sourceReference: 'Hồ Chí Minh – Biên niên tiểu sử, Tập 2, tr. 298-302'
  },
  {
    id: 'loc-17',
    name: 'Quảng trường Ba Đình',
    country: 'Việt Nam',
    periodYears: '1945',
    coordinates: [21.0369, 105.8347],
    aliasUsed: 'Chủ tịch Hồ Chí Minh',
    historicalAction: 'Đọc bản Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa ngày 02/9/1945.',
    primaryRelic: 'Quảng trường Ba Đình và Lăng Chủ tịch Hồ Chí Minh',
    sourceReference: 'Hồ Chí Minh Toàn tập, Tập 4, tr. 1-4'
  },
  {
    id: 'loc-18',
    name: 'ATK Định Hóa (Thái Nguyên)',
    country: 'Việt Nam',
    periodYears: '1947 – 1954',
    coordinates: [21.9056, 105.6548],
    aliasUsed: 'Bác Hồ / Tân Sinh / X.Y.Z',
    historicalAction: 'Trung tâm đầu não kháng chiến chống thực dân Pháp; nơi Bác viết Sửa đổi lối làm việc, Dân vận và thông qua Kế hoạch Chiến dịch Điện Biên Phủ.',
    primaryRelic: 'Khu Di tích Quốc gia đặc biệt ATK Định Hóa (Đồi Tỉn Keo, Khau Tý)',
    sourceReference: 'Hồ Chí Minh – Biên niên tiểu sử, Tập 4 & 5'
  },
  {
    id: 'loc-19',
    name: 'Điện Biên Phủ',
    country: 'Việt Nam',
    periodYears: '1954',
    coordinates: [21.3855, 103.0163],
    aliasUsed: 'Chủ tịch Hồ Chí Minh',
    historicalAction: 'Bác cùng Bộ Chính trị trực tiếp theo dõi, chỉ đạo sát sao từng đợt tấn công của Chiến dịch Điện Biên Phủ cho đến thắng lợi hoàn toàn.',
    primaryRelic: 'Khu Di tích Chiến trường Điện Biên Phủ & Sở Chỉ huy Chiến dịch Mường Phăng',
    sourceReference: 'Hồ Chí Minh Toàn tập, Tập 8'
  },
  {
    id: 'loc-20',
    name: 'Nhà sàn Bác Hồ (Hà Nội)',
    country: 'Việt Nam',
    periodYears: '1954 – 1969',
    coordinates: [21.0378, 105.8340],
    aliasUsed: 'Bác Hồ',
    historicalAction: 'Nơi Bác sống và làm việc suốt 15 năm cuối đời; viết Lời kêu gọi 17/7/1966 và hoàn thành bản Di chúc thiêng liêng.',
    primaryRelic: 'Khu Di tích Chủ tịch Hồ Chí Minh tại Phủ Chủ tịch',
    sourceReference: 'Khu Di tích Chủ tịch Hồ Chí Minh tại Phủ Chủ tịch'
  }
];

// ==========================================
// 6. PHÒNG AUDIO TƯ LIỆU GỐC & TRANSCRIPT CHUẨN
// ==========================================
export const HISTORICAL_AUDIOS: HistoricalAudio[] = [
  {
    id: 'aud-01',
    title: 'Bản ghi âm Tuyên ngôn Độc lập (02/09/1945)',
    dateStr: '02/09/1945',
    duration: '04 phút 35 giây',
    occasion: 'Đọc tại Lễ Độc lập, Quảng trường Ba Đình, Hà Nội',
    sourceAgency: 'Đài Tiếng nói Việt Nam (VOV) & Trung tâm Lưu trữ Quốc gia III',
    historicalNote: 'Bản thu âm thanh gốc giọng đọc ấm áp, truyền cảm của Bác trước hàng chục vạn đồng bào trong ngày Tết Độc lập đầu tiên của dân tộc.',
    transcript: 'Hỡi đồng bào cả nước! Tất cả mọi người đều sinh ra có quyền bình đẳng. Tạo hóa cho họ những quyền không ai có thể xâm phạm được; trong những quyền ấy, có quyền được sống, quyền tự do và quyền mưu cầu hạnh phúc... Nước Việt Nam có quyền hưởng tự do và độc lập, và sự thật đã thành một nước tự do, độc lập. Toàn thể dân tộc Việt Nam quyết đem tất cả tinh thần và lực lượng, tính mạng và của cải để giữ vững quyền tự do, độc lập ấy!',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'aud-02',
    title: 'Bản ghi âm Lời kêu gọi toàn quốc kháng chiến (19/12/1946)',
    dateStr: 'Đêm 19/12/1946',
    duration: '03 phút 12 giây',
    occasion: 'Phát thanh truyền đi toàn quốc mở đầu Toàn quốc kháng chiến',
    sourceAgency: 'Đài Tiếng nói Việt Nam (VOV)',
    historicalNote: 'Lời hịch non sông đanh thép, khẳng định ý chí quật cường của dân tộc Việt Nam thà hy sinh tất cả chứ nhất định không chịu mất nước.',
    transcript: 'Hỡi đồng bào toàn quốc! Chúng ta muốn hòa bình, chúng ta phải nhân nhượng. Nhưng chúng ta càng nhân nhượng, thực dân Pháp càng lấn tới, vì chúng quyết tâm cướp nước ta lần nữa! Không! Chúng ta thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ! Hỡi đồng bào! Chúng ta phải đứng lên!...',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'aud-03',
    title: 'Bản ghi âm Lời kêu gọi đồng bào và chiến sĩ cả nước (17/07/1966)',
    dateStr: '17/07/1966',
    duration: '05 phút 20 giây',
    occasion: 'Phát thanh trong cao điểm chống chiến tranh phá hoại miền Bắc',
    sourceAgency: 'Đài Tiếng nói Việt Nam (VOV) & Báo Nhân Dân',
    historicalNote: 'Khắc ghi câu nói bất hủ đã trở thành biểu tượng cho khát vọng của toàn dân tộc: "Không có gì quý hơn độc lập, tự do!".',
    transcript: 'Chiến tranh có thể kéo dài 5 năm, 10 năm, 20 năm hoặc lâu hơn nữa. Hà Nội, Hải Phòng và một số thành phố, xí nghiệp có thể bị tàn phá, song nhân dân Việt Nam quyết không sợ! Không có gì quý hơn độc lập, tự do! Đến ngày thắng lợi, nhân dân ta sẽ xây dựng lại đất nước ta đàng hoàng hơn, to đẹp hơn!...',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'aud-04',
    title: 'Bản ghi âm Thơ chúc Tết Xuân Kỷ Dậu 1969',
    dateStr: 'Giao thừa Tết Kỷ Dậu 1969',
    duration: '01 phút 45 giây',
    occasion: 'Thơ chúc Tết cuối cùng của Bác gửi đồng bào và chiến sĩ cả nước',
    sourceAgency: 'Đài Tiếng nói Việt Nam (VOV)',
    historicalNote: 'Những vần thơ chúc Tết hào sảng, vạch rõ mục tiêu chiến lược "Đánh cho Mỹ cút, đánh cho Ngụy nhào", cổ vũ quân dân hai miền tiến tới toàn thắng.',
    transcript: 'Năm qua thắng lợi vẻ vang / Năm nay tiền tuyến chắc càng thắng to / Vì độc lập, vì tự do / Đánh cho Mỹ cút, đánh cho Ngụy nhào / Tiến lên! Chiến sĩ, đồng bào / Bắc - Nam sum họp, xuân nào vui hơn!',
    verificationStatus: 'VERIFIED'
  }
];

// ==========================================
// 7. PHÂN HỆ ĐƯƠNG ĐẠI: "CHÁNH HIỆP HỌC VÀ LÀM THEO BÁC"
// ==========================================
export const CHANH_HIEP_ACTION_MODELS: ChanhHiepActionModel[] = [
  {
    id: 'act-01',
    title: 'Mô hình "Dân vận khéo – Gần dân, sát việc, lo cho dân"',
    targetGroup: 'Cán bộ - Đảng viên',
    neighborhood: '21/21 Khu phố Phường Chánh Hiệp',
    summary: 'Thực hiện lời dạy của Bác trong tác phẩm "Dân vận", cán bộ Ủy ban MTTQ và các đoàn thể phường duy trì chế độ đi cơ sở hàng tuần, nắm bắt tâm tư và giải quyết kịp thời 100% kiến nghị bức xúc của nhân dân ngay từ tổ dân phố.',
    practicalResult: 'Vận động thành công nhân dân tự nguyện hiến hơn 1.200m² đất mở rộng hẻm và lắp đặt 100% hệ thống chiếu sáng, camera an ninh.',
    inspirationalQuote: '“Dân vận kém thì việc gì cũng kém. Dân vận khéo thì việc gì cũng thành công.”',
    updatedDate: 'Năm 2026',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    linkedInitiativeIds: ['init-01', 'init-04', 'init-03']
  },
  {
    id: 'act-02',
    title: 'Tổ liên kết An sinh Xã hội – "Mái ấm Đại đoàn kết"',
    targetGroup: 'Mặt trận & Hội viên',
    neighborhood: 'Khu phố 3, Khu phố 7, Khu phố 14',
    summary: 'Cụ thể hóa Di chúc thiêng liêng của Bác về việc chăm lo không ngừng nâng cao đời sống của nhân dân; MTTQ phường phối hợp các nhà hảo tâm và doanh nghiệp địa phương xây dựng, sửa chữa nhà đại đoàn kết cho các hộ khó khăn.',
    practicalResult: 'Trao tặng 18 căn nhà Đại đoàn kết, phụng dưỡng trọn đời 02 Mẹ Việt Nam Anh hùng và hỗ trợ 150 suất học bổng cho học sinh nghèo hiếu học.',
    inspirationalQuote: '“Việc gì có lợi cho dân, ta phải hết sức làm. Việc gì hại đến dân, ta phải hết sức tránh.”',
    updatedDate: 'Năm 2026',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
    linkedInitiativeIds: ['init-02', 'init-05']
  },
  {
    id: 'act-03',
    title: 'Tủ sách điện tử Bác Hồ & Không gian Văn hóa số 21 Khu phố',
    targetGroup: 'Đoàn viên thanh niên',
    neighborhood: 'Nhà văn hóa 21 Khu phố',
    summary: 'Đoàn Thanh niên phối hợp Ban Công tác Mặt trận thiết lập các điểm quét mã QR tra cứu sách điện tử Hồ Chí Minh, tổ chức các buổi sinh hoạt chuyên đề "Học tập và làm theo tấm gương đạo đức, phong cách Hồ Chí Minh".',
    practicalResult: 'Thu hút hơn 8.500 lượt đoàn viên, học sinh và nhân dân tham gia đọc, nghiên cứu tài liệu và dự thi tìm hiểu di sản Bác Hồ.',
    inspirationalQuote: '“Học để làm việc, làm người, làm cán bộ. Học để phụng sự đoàn thể, phụng sự giai cấp và nhân dân.”',
    updatedDate: 'Năm 2026',
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
    linkedInitiativeIds: ['init-01', 'init-04']
  },
  {
    id: 'act-04',
    title: 'Tuyến hẻm tự quản "Xanh - Sạch - Văn minh - Nghĩa tình"',
    targetGroup: 'Nhân dân 21 Khu phố',
    neighborhood: 'Toàn địa bàn 21 Khu phố',
    summary: 'Thực hiện lời dạy của Bác trong tác phẩm "Đời sống mới", các hộ dân cam kết không xả rác bừa bãi, trồng hoa cây xanh trước nhà, tích cực tham gia Ngày Chủ nhật xanh và giữ gìn tình làng nghĩa xóm tối lửa tắt đèn có nhau.',
    practicalResult: '100% 21 khu phố đạt chuẩn đô thị văn minh; nhân rộng 45 tuyến hẻm hoa tự quản kiểu mẫu do người dân tự nguyện đóng góp chăm sóc.',
    inspirationalQuote: '“Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công!”',
    updatedDate: 'Năm 2026',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    linkedInitiativeIds: ['init-02', 'init-03']
  }
];

// ==========================================
// 8. SÁNG KIẾN TÁC NGHIỆP MẶT TRẬN (MÔ HÌNH NHÂN RỘNG)
// ==========================================
export const FRONT_INITIATIVE_DATA: FrontInitiative[] = [
  {
    id: 'init-01',
    title: 'Mô hình "Tổ Đoàn Kết Số 4.0" tại 21 Khu phố Phường Chánh Hiệp',
    unit: 'Ủy ban MTTQ & Ban CTMTKP 5',
    summary: 'Ứng dụng nhóm Zalo kết nối liên thông và Bảng tin số khu phố để thông báo lịch sinh hoạt, thu quỹ công khai và tiếp nhận kiến nghị trực tuyến.',
    impact: 'Tiết kiệm 90% chi phí in ấn giấy, 100% hộ dân nhận được thông tin chỉ đạo trong vòng 15 phút.',
    likes: 342,
    tags: ['Chuyển đổi số', 'Dân nguyện', 'Khu phố số', 'Làm theo Bác'],
    date: '15/08/2026',
    linkedHcmActionId: 'act-01',
    linkedHcmTopicTitle: 'Dân vận khéo – Gần dân, sát việc, lo cho dân'
  },
  {
    id: 'init-02',
    title: 'Sáng kiến "Góc Xanh Đại Đoàn Kết" - Phân loại rác tại nguồn & Nuôi heo đất an sinh',
    unit: 'Hội Liên hiệp Phụ nữ & MTTQ Phường',
    summary: 'Xây dựng 21 điểm thu gom rác tái chế lấy kinh phí nuôi heo đất khuyến học cho học sinh nghèo hiếu học tại các khu phố.',
    impact: 'Thu gom hơn 4.2 tấn nhựa tái chế, trao 85 suất học bổng cho học sinh nghèo.',
    likes: 289,
    tags: ['Bảo vệ môi trường', 'An sinh xã hội', 'Bác Hồ với học sinh nghèo'],
    date: '02/08/2026',
    linkedHcmActionId: 'act-02',
    linkedHcmTopicTitle: 'Tổ liên kết An sinh Xã hội – Mái ấm Đại đoàn kết'
  },
  {
    id: 'init-03',
    title: 'Mô hình "Camera An ninh Đại đoàn kết" Nhân dân tự quản',
    unit: 'Ban CTMTKP 12 & Công an Phường',
    summary: 'Vận động Nhân dân đóng góp kinh phí lắp đặt 128 mắt camera độ phân giải cao tại các hẻm tự quản.',
    impact: 'Giảm 75% sự vụ mất an ninh trật tự, xử lý nhanh các vụ vi phạm môi trường.',
    likes: 215,
    tags: ['An ninh trật tự', 'Tự quản cộng đồng', 'Đời sống mới'],
    date: '20/07/2026',
    linkedHcmActionId: 'act-04',
    linkedHcmTopicTitle: 'Tuyến hẻm tự quản Xanh - Sạch - Văn minh - Nghĩa tình'
  },
  {
    id: 'init-04',
    title: 'Sáng kiến "Tiếp nhận Dân nguyện Số qua Mã QR 21 Khu phố"',
    unit: 'Ủy ban MTTQ Phường Chánh Hiệp',
    summary: 'Dán mã QR tiếp nhận phản ánh, kiến nghị của người dân tại 21 Nhà văn hóa khu phố, tự động chuyển về Mặt trận Phường xử lý.',
    impact: '100% ý kiến phản ánh được phân loại và phản hồi kết quả cho người dân trong 48 giờ.',
    likes: 310,
    tags: ['Cải cách hành chính', 'Sửa đổi lối làm việc', 'Lắng nghe dân'],
    date: '10/08/2026',
    linkedHcmActionId: 'act-01',
    linkedHcmTopicTitle: 'Dân vận khéo – Gần dân, sát việc, lo cho dân'
  },
  {
    id: 'init-05',
    title: 'Sáng kiến "Bữa ăn Nghĩa tình - Bếp ăn Đại đoàn kết"',
    unit: 'Ban CTMTKP 3, KP 7 & Hội Chữ Thập Đỏ',
    summary: 'Tổ chức nấu và phát 300 suất ăn miễn phí hàng tuần cho công nhân yếu thế, lao động tự do và cụ già neo đơn.',
    impact: 'Duy trì liên tục 24 tháng, trao hơn 12.000 suất ăn ấm lòng nhân dân.',
    likes: 425,
    tags: ['An sinh xã hội', 'Bác Hồ với người nghèo', 'Nghĩa tình Chánh Hiệp'],
    date: '25/08/2026',
    linkedHcmActionId: 'act-02',
    linkedHcmTopicTitle: 'Tổ liên kết An sinh Xã hội – Mái ấm Đại đoàn kết'
  }
];
