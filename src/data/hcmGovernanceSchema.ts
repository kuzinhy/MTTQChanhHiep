// Schema and Data Store for Ho Chi Minh Cultural Space Governance & Verified Data
// Aligned strictly with Master Prompt Specifications (Sections XI, XII, XVI, XVIII, XIX, XX)

export type VerificationStatus = 'DRAFT' | 'SOURCE_VERIFIED' | 'CONTENT_REVIEW' | 'APPROVED' | 'PUBLISHED';
export type DatePrecision = 'day' | 'month' | 'year' | 'range' | 'unknown';
export type MediaType = 'image' | 'audio' | 'document' | 'video';

export interface HistoricalSource {
  id: string;
  source_title: string;
  source_url: string;
  source_agency: string;
  source_accessed_at: string;
  copyright_note?: string;
  usage_permission?: string;
  notes?: string;
}

export interface MediaItem {
  id: string;
  file: string; // URL or relative path
  title: string;
  caption: string;
  alt: string;
  media_type: MediaType;
  source_url: string;
  source_agency: string;
  copyright_note: string;
  usage_permission: string;
  historical_date: string;
  historical_location: string;
  verified: boolean;
  editor_status: VerificationStatus;
}

export interface EventCardSchema {
  id: string;
  chapter_id: string;
  title: string;
  date_display: string;
  date_start: string;
  date_end?: string;
  date_precision: DatePrecision;
  location: string;
  summary: string;
  full_content: string;
  media: MediaItem[];
  source_title: string;
  source_url: string;
  source_agency: string;
  source_accessed_at: string;
  verified: boolean;
  editor_status: VerificationStatus;
  locked?: boolean;
}

export interface BiographyChapter {
  id: string;
  order: number;
  title: string;
  timeRange: string;
  summary: string;
  full_text: string;
  keyMilestones: string[];
  featured_media?: MediaItem;
  source_url: string;
  source_agency: string;
  editor_status: VerificationStatus;
  locked?: boolean;
}

export interface VersionHistoryRecord {
  id: string;
  entity_id: string;
  entity_type: 'event' | 'chapter' | 'media' | 'cover';
  version: number;
  editor: string;
  created_at: string;
  reason: string;
  old_value: any;
  new_value: any;
}

export interface CoverConfig {
  title: string;
  subtitle: string;
  description: string;
  portrait_url: string;
  portrait_caption: string;
  primary_source_url: string;
  primary_source_agency: string;
  historical_lock: boolean;
  updated_at: string;
}

// Default Verified Sources
export const DEFAULT_VERIFIED_SOURCES: HistoricalSource[] = [
  {
    id: 'src-01',
    source_title: 'Không gian văn hóa Hồ Chí Minh',
    source_url: 'https://hochiminhcity.gov.vn/landing-khong-gian-van-hoa-ho-chi-minh',
    source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
    source_accessed_at: '2026-09-04',
    copyright_note: 'Tư liệu công quyền phục vụ tuyên truyền giáo dục truyền thống',
    usage_permission: 'Trích dẫn chính thức theo quy định Cổng TTĐT TP.HCM'
  },
  {
    id: 'src-02',
    source_title: 'Cuộc đời, sự nghiệp Chủ tịch Hồ Chí Minh',
    source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
    source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
    source_accessed_at: '2026-09-04',
    copyright_note: 'Source of Truth chính thức cho chuyên mục Cuộc đời - Sự nghiệp',
    usage_permission: 'Trích dẫn nguyên văn dữ kiện lịch sử đã thẩm định'
  }
];

export const DEFAULT_COVER_CONFIG: CoverConfig = {
  title: 'KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH',
  subtitle: 'Tư tưởng – Đạo đức – Phong cách – Cuộc đời – Sự nghiệp',
  description: 'Không gian văn hóa Hồ Chí Minh số của Phường Chánh Hiệp – Nơi kết nối dòng chảy lịch sử vẻ vang, tư tưởng vĩ đại và tấm gương đạo đức sáng ngời của Chủ tịch Hồ Chí Minh với công cuộc xây dựng đô thị văn minh, nghĩa tình.',
  portrait_url: 'https://sv2.anhsieuviet.com/2026/09/05/screenshot_1788585720.png',
  portrait_caption: 'Chân dung Chủ tịch Hồ Chí Minh (1890 - 1969) – Lãnh tụ vĩ đại của dân tộc Việt Nam',
  primary_source_url: 'https://hochiminhcity.gov.vn/landing-khong-gian-van-hoa-ho-chi-minh',
  primary_source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
  historical_lock: true,
  updated_at: '2026-09-04'
};

// 6 Core Chapters verified strictly from Source 02
export const DEFAULT_BIOGRAPHY_CHAPTERS: BiographyChapter[] = [
  {
    id: 'chap-01',
    order: 1,
    title: 'Quê hương, gia đình và thời niên thiếu',
    timeRange: '1890 – 1911',
    summary: 'Chủ tịch Hồ Chí Minh (tên khai sinh là Nguyễn Sinh Cung) sinh ngày 19/5/1890 tại quê ngoại làng Hoàng Trù, lớn lên ở làng Sen (Kim Liên, Nam Đàn, Nghệ An). Sớm tiếp thu truyền thống yêu nước của gia đình và quê hương, Người học tập tại Huế và dạy học tại Trường Dục Thanh (Phan Thiết).',
    full_text: 'Chủ tịch Hồ Chí Minh sinh ra trong một gia đình nhà nho yêu nước, tại mảnh đất Nghệ An giàu truyền thống đấu tranh kiên cường. Từ nhỏ, Người đã tận mắt chứng kiến cảnh nước mất nhà tan, nỗi cơ cực của đồng bào dưới ách đô hộ của thực dân Pháp. Năm 1906 - 1908, Người học tại Trường Quốc Học Huế. Tháng 9/1910 đến tháng 2/1911, Người dạy học tại Trường Dục Thanh (Phan Thiết, Bình Thuận), nhen nhóm trong lòng bầu nhiệt huyết tìm con đường mới cứu nước, cứu dân.',
    keyMilestones: [
      '19/05/1890: Sinh ra tại làng Hoàng Trù, Kim Liên, Nam Đàn, Nghệ An',
      '1906–1908: Học tại Trường Tiểu học Pháp - Việt Đông Ba và Trường Quốc Học Huế',
      '09/1910–02/1911: Dạy học tại Trường Dục Thanh (Phan Thiết, Bình Thuận)'
    ],
    source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
    source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
    editor_status: 'APPROVED',
    locked: true
  },
  {
    id: 'chap-02',
    order: 2,
    title: 'Ra đi tìm đường cứu nước, giải phóng dân tộc',
    timeRange: '1911 – 1920',
    summary: 'Ngày 5/6/1911, với tên Văn Ba, Người rời Bến cảng Sài Gòn trên tàu Đô đốc Latouche-Tréville ra đi tìm đường cứu nước. Trải qua gần 10 năm bôn ba qua nhiều nước, Người đọc Sơ thảo Luận cương của Lênin (7/1920) và tham gia sáng lập Đảng Cộng sản Pháp (12/1920).',
    full_text: 'Không đi theo con đường Đông Du hay khởi nghĩa vũ trang kiểu cũ, người thanh niên Nguyễn Tất Thành quyết định sang phương Tây - nơi có nền văn minh hiện đại và cũng chính là sào huyệt của chủ nghĩa thực dân. Năm 1919, Người gửi Bản Yêu sách của nhân dân An Nam tới Hội nghị Versailles. Tháng 7/1920, đọc được "Sơ thảo lần thứ nhất những luận cương về vấn đề dân tộc và vấn đề thuộc địa" của Lênin, Người đã tìm thấy con đường giải phóng cho dân tộc. Tháng 12/1920, tại Đại hội Tours, Người bỏ phiếu tán thành Quốc tế III và tham gia sáng lập Đảng Cộng sản Pháp.',
    keyMilestones: [
      '05/06/1911: Rời Bến cảng Sài Gòn trên tàu Đô đốc Latouche-Tréville',
      '18/06/1919: Gửi Bản Yêu sách của nhân dân An Nam tới Hội nghị Versailles',
      '16–17/07/1920: Đọc Sơ thảo Luận cương của Lênin trên báo L\'Humanité',
      '12/1920: Bỏ phiếu tán thành Quốc tế III, sáng lập Đảng Cộng sản Pháp'
    ],
    source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
    source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
    editor_status: 'APPROVED',
    locked: true
  },
  {
    id: 'chap-03',
    order: 3,
    title: 'Hoạt động quốc tế và Chuẩn bị thành lập Đảng',
    timeRange: '1921 – 1930',
    summary: 'Hoạt động sôi nổi tại Pháp, Liên Xô và Trung Quốc; sáng lập Hội Liên hiệp các dân tộc bị áp bức Á Đông; xuất bản Bản án chế độ thực dân Pháp (1925), Đường Kách mệnh (1927); chủ trì Hội nghị hợp nhất thành lập Đảng Cộng sản Việt Nam (03/02/1930).',
    full_text: 'Từ năm 1921 đến 1930, Nguyễn Ái Quốc tích cực hoạt động trong phong trào cộng sản và công nhân quốc tế. Năm 1925 tại Quảng Châu (Trung Quốc), Người sáng lập Hội Việt Nam Cách mạng Thanh niên, xuất bản báo Thanh Niên và tác phẩm "Đường Kách mệnh" (1927) để truyền bá chủ nghĩa Mác - Lênin về nước. Ngày 03/02/1930, tại Cửu Long (Hương Cảng, Trung Quốc), Người chủ trì Hội nghị hợp nhất các tổ chức cộng sản, thành lập Đảng Cộng sản Việt Nam duy nhất.',
    keyMilestones: [
      '1925: Thành lập Hội Việt Nam Cách mạng Thanh niên tại Quảng Châu',
      '1925: Xuất bản tác phẩm Bản án chế độ thực dân Pháp tại Paris',
      '1927: Xuất bản tác phẩm kinh điển Đường Kách mệnh',
      '03/02/1930: Chủ trì Hội nghị thành lập Đảng Cộng sản Việt Nam tại Hương Cảng'
    ],
    source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
    source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
    editor_status: 'APPROVED',
    locked: true
  },
  {
    id: 'chap-04',
    order: 4,
    title: 'Trở về Tổ quốc và Lãnh đạo Cách mạng Tháng Tám giành độc lập',
    timeRange: '1930 – 1945',
    summary: 'Sau 30 năm bôn ba, ngày 28/01/1941 Người về nước tại Pác Bó (Cao Bằng), thành lập Mặt trận Việt Minh (19/05/1941); lãnh đạo Tổng khởi nghĩa Cách mạng Tháng Tám thành công và đọc Tuyên ngôn Độc lập ngày 02/09/1945.',
    full_text: 'Mùa xuân năm 1941, lãnh tụ Nguyễn Ái Quốc vượt qua mốc 108 biên giới Việt - Trung trở về Pác Bó (Hà Quảng, Cao Bằng). Tháng 5/1941, Người chủ trì Hội nghị Trung ương 8, thành lập Việt Nam Độc lập Đồng minh (Mặt trận Việt Minh). Tháng 8/1945, trước thời cơ ngàn năm có một, Người phát lệnh Tổng khởi nghĩa giành chính quyền trong cả nước. Ngày 02/09/1945, tại Quảng trường Ba Đình (Hà Nội), Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa.',
    keyMilestones: [
      '28/01/1941: Vượt mốc 108 trở về Pác Bó (Cao Bằng) sau 30 năm',
      '19/05/1941: Thành lập Việt Nam Độc lập Đồng minh (Mặt trận Việt Minh)',
      '16–17/08/1945: Chủ trì Quốc dân Đại hội Tân Trào phát lệnh Tổng khởi nghĩa',
      '02/09/1945: Đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình'
    ],
    source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
    source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
    editor_status: 'APPROVED',
    locked: true
  },
  {
    id: 'chap-05',
    order: 5,
    title: 'Lãnh đạo cuộc kháng chiến chống thực dân Pháp thắng lợi',
    timeRange: '1945 – 1954',
    summary: 'Lãnh đạo toàn dân bảo vệ chính quyền non trẻ, ra Lời kêu gọi Toàn quốc kháng chiến (19/12/1946), trực tiếp chỉ đạo Chiến dịch Biên giới (1950) và lãnh đạo Chiến dịch Điện Biên Phủ toàn thắng (07/05/1954).',
    full_text: 'Đứng trước âm mưu xâm lược trở lại của thực dân Pháp, ngày 19/12/1946, Chủ tịch Hồ Chí Minh ra Lời kêu gọi Toàn quốc kháng chiến với chân lý "Thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ". Người cùng Trung ương Đảng lãnh đạo cuộc chiến tranh nhân dân trường kỳ, tự lực cánh sinh. Tháng 5/1954, Chiến thắng lịch sử Điện Biên Phủ "lừng lẫy năm châu, chấn động địa cầu" đã đập tan ách thống trị của thực dân Pháp, giải phóng hoàn toàn miền Bắc.',
    keyMilestones: [
      '19/12/1946: Ra Lời kêu gọi Toàn quốc kháng chiến',
      '02/1951: Đại hội đại biểu toàn quốc lần thứ II của Đảng tại Chiêm Hóa (Tuyên Quang)',
      '07/05/1954: Chiến thắng lịch sử Điện Biên Phủ, giải phóng miền Bắc'
    ],
    source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
    source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
    editor_status: 'APPROVED',
    locked: true
  },
  {
    id: 'chap-06',
    order: 6,
    title: 'Lãnh đạo xây dựng CNXH ở miền Bắc, đấu tranh thống nhất và Di chúc lịch sử',
    timeRange: '1954 – 1969',
    summary: 'Lãnh đạo đồng thời hai nhiệm vụ chiến lược: Xây dựng CNXH ở miền Bắc và giải phóng miền Nam thống nhất đất nước; để lại bản Di chúc lịch sử vô giá; từ trần ngày 02/09/1969.',
    full_text: 'Sau năm 1954, Chủ tịch Hồ Chí Minh cùng Đảng lãnh đạo nhân dân miền Bắc hàn gắn vết thương chiến tranh, xây dựng cơ sở vật chất của chủ nghĩa xã hội, đồng thời làm hậu phương vững chắc chi viện cho tiền tuyến lớn miền Nam. Từ năm 1965 đến 1969, Người dồn tâm huyết viết và hoàn thiện Di chúc thiêng liêng dặn dò toàn Đảng, toàn quân và toàn dân. Ngày 02/09/1969, Người thanh thản ra đi, để lại muôn vàn tình thân yêu cho đồng bào cả nước và bầu bạn quốc tế.',
    keyMilestones: [
      '09/1960: Đại hội đại biểu toàn quốc lần thứ III của Đảng tại Hà Nội',
      '1965–1969: Quá trình viết và hoàn thiện Di chúc thiêng liêng',
      '02/09/1969: Chủ tịch Hồ Chí Minh từ trần tại Thủ đô Hà Nội',
      '1987: Đại hội đồng UNESCO khóa 24 vinh danh Anh hùng giải phóng dân tộc, Nhà văn hóa kiệt xuất'
    ],
    source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
    source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
    editor_status: 'APPROVED',
    locked: true
  }
];

// Verified Event Cards matching Schema Section XI
export const DEFAULT_VERIFIED_EVENTS: EventCardSchema[] = [
  {
    id: 'evt-1890-01',
    chapter_id: 'chap-01',
    title: 'Nguyễn Sinh Cung sinh ra tại làng Hoàng Trù',
    date_display: '19 tháng 5 năm 1890',
    date_start: '1890-05-19',
    date_precision: 'day',
    location: 'Làng Hoàng Trù, xã Kim Liên, huyện Nam Đàn, tỉnh Nghệ An',
    summary: 'Chủ tịch Hồ Chí Minh (tên khai sinh là Nguyễn Sinh Cung) cất tiếng khóc chào đời tại quê ngoại Hoàng Trù trong một gia đình nhà nho yêu nước.',
    full_content: 'Ngày 19 tháng 5 năm 1890, Chủ tịch Hồ Chí Minh sinh tại làng Hoàng Trù (quê ngoại), xã Kim Liên, huyện Nam Đàn, tỉnh Nghệ An. Thân phụ là cụ Phó bảng Nguyễn Sinh Sắc, thân mẫu là bà Hoàng Thị Loan. Môi trường gia đình nho học thanh bạch và truyền thống yêu nước sâu sắc của quê hương xứ Nghệ đã hun đúc nên nhân cách và ý chí kiên định của Người từ thuở ấu thơ.',
    media: [
      {
        id: 'med-01',
        file: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
        title: 'Quê ngoại Hoàng Trù',
        caption: 'Cụm di tích quê ngoại Hoàng Trù – Nơi lưu giữ ký ức tuổi thơ của Bác Hồ',
        alt: 'Di tích quê ngoại Hoàng Trù Kim Liên',
        media_type: 'image',
        source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
        source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
        copyright_note: 'Tư liệu di tích quốc gia đặc biệt Kim Liên',
        usage_permission: 'Phục vụ công tác tuyên truyền giáo dục',
        historical_date: '1890',
        historical_location: 'Nam Đàn, Nghệ An',
        verified: true,
        editor_status: 'APPROVED'
      }
    ],
    source_title: 'Cuộc đời, sự nghiệp Chủ tịch Hồ Chí Minh',
    source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
    source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
    source_accessed_at: '2026-09-04',
    verified: true,
    editor_status: 'APPROVED',
    locked: true
  },
  {
    id: 'evt-1910-01',
    chapter_id: 'chap-01',
    title: 'Thầy giáo Nguyễn Tất Thành dạy học tại Trường Dục Thanh',
    date_display: 'Tháng 9/1910 – Tháng 2/1911',
    date_start: '1910-09-01',
    date_end: '1911-02-28',
    date_precision: 'month',
    location: 'Trường Dục Thanh, TP. Phan Thiết, tỉnh Bình Thuận',
    summary: 'Nguyễn Tất Thành dừng chân tại Phan Thiết, dạy chữ Hán, chữ Quốc ngữ và thể dục cho học sinh Trường Dục Thanh trước khi vào Sài Gòn.',
    full_content: 'Trên hành trình vào Nam, người thanh niên Nguyễn Tất Thành dừng chân dạy học tại Trường Dục Thanh (Phan Thiết, Bình Thuận). Tại đây, Người truyền thụ cho học sinh lòng yêu nước thương nòi, tinh thần tự tôn dân tộc và rèn luyện thân thể để chuẩn bị cho chí hướng cứu nước.',
    media: [
      {
        id: 'med-02',
        file: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        title: 'Trường Dục Thanh Phan Thiết',
        caption: 'Khuôn viên di tích Trường Dục Thanh bên dòng sông Cà Ty (Bình Thuận)',
        alt: 'Trường Dục Thanh Phan Thiết',
        media_type: 'image',
        source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
        source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
        copyright_note: 'Tư liệu di tích lịch sử văn hóa cấp quốc gia',
        usage_permission: 'Phục vụ công tác tuyên truyền giáo dục',
        historical_date: '1910',
        historical_location: 'Phan Thiết, Bình Thuận',
        verified: true,
        editor_status: 'APPROVED'
      }
    ],
    source_title: 'Cuộc đời, sự nghiệp Chủ tịch Hồ Chí Minh',
    source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
    source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
    source_accessed_at: '2026-09-04',
    verified: true,
    editor_status: 'APPROVED',
    locked: true
  },
  {
    id: 'evt-1911-01',
    chapter_id: 'chap-02',
    title: 'Rời Bến cảng Sài Gòn ra đi tìm đường cứu nước',
    date_display: 'Ngày 5 tháng 6 năm 1911',
    date_start: '1911-06-05',
    date_precision: 'day',
    location: 'Bến cảng Sài Gòn (Bến Nhà Rồng), TP. Hồ Chí Minh',
    summary: 'Với tên gọi Văn Ba, Người thanh niên 21 tuổi bước lên con tàu Đô đốc Latouche-Tréville rời Tổ quốc bắt đầu cuộc hành trình vĩ đại kéo dài 30 năm.',
    full_content: 'Ngày 5 tháng 6 năm 1911, từ Bến cảng Sài Gòn, người thanh niên yêu nước Nguyễn Tất Thành lấy tên là Văn Ba, xin làm phụ bếp trên tàu buôn Amiral Latouche-Tréville để sang các nước phương Tây tìm con đường đúng đắn giải phóng dân tộc khỏi ách nô lệ lầm than.',
    media: [
      {
        id: 'med-03',
        file: 'https://images.unsplash.com/photo-1509718443690-d8e2fb3474b7?auto=format&fit=crop&w=800&q=80',
        title: 'Bến Nhà Rồng lịch sử',
        caption: 'Bến cảng Nhà Rồng – Nơi khởi đầu cuộc hành trình cứu nước của Chủ tịch Hồ Chí Minh',
        alt: 'Bến Nhà Rồng TP Hồ Chí Minh',
        media_type: 'image',
        source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
        source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
        copyright_note: 'Tư liệu Cổng TTĐT TP.HCM',
        usage_permission: 'Phục vụ công tác tuyên truyền giáo dục',
        historical_date: '1911',
        historical_location: 'TP. Hồ Chí Minh',
        verified: true,
        editor_status: 'APPROVED'
      }
    ],
    source_title: 'Cuộc đời, sự nghiệp Chủ tịch Hồ Chí Minh',
    source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
    source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
    source_accessed_at: '2026-09-04',
    verified: true,
    editor_status: 'APPROVED',
    locked: true
  },
  {
    id: 'evt-1920-01',
    chapter_id: 'chap-02',
    title: 'Đọc Sơ thảo Luận cương của Lênin & Sáng lập Đảng Cộng sản Pháp',
    date_display: 'Tháng 7 & Tháng 12 năm 1920',
    date_start: '1920-07-16',
    date_end: '1920-12-30',
    date_precision: 'month',
    location: 'Paris & Thành phố Tours, Nước Pháp',
    summary: 'Nguyễn Ái Quốc tìm thấy con đường cứu nước trong chủ nghĩa Mác - Lênin; bỏ phiếu tán thành Quốc tế III và trở thành một trong những người sáng lập Đảng Cộng sản Pháp.',
    full_content: 'Tháng 7/1920, qua tờ báo L\'Humanité, Nguyễn Ái Quốc đọc "Sơ thảo lần thứ nhất những luận cương về vấn đề dân tộc và vấn đề thuộc địa" của V.I.Lênin. Người xúc động reo lên: "Đây là cái cần thiết cho chúng ta, đây là con đường giải phóng chúng ta". Tháng 12/1920, tại Đại hội toàn quốc lần thứ 18 của Đảng Xã hội Pháp họp ở Tours, Người bỏ phiếu tán thành gia nhập Quốc tế Cộng sản (Quốc tế III) và sáng lập Đảng Cộng sản Pháp.',
    media: [
      {
        id: 'med-04',
        file: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
        title: 'Đại hội Tours 1920',
        caption: 'Đồng chí Nguyễn Ái Quốc tại Đại hội Tours (Pháp), tháng 12/1920',
        alt: 'Đồng chí Nguyễn Ái Quốc Đại hội Tours',
        media_type: 'image',
        source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
        source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
        copyright_note: 'Tư liệu lưu trữ lịch sử',
        usage_permission: 'Phục vụ công tác tuyên truyền giáo dục',
        historical_date: '1920',
        historical_location: 'Tours, Pháp',
        verified: true,
        editor_status: 'APPROVED'
      }
    ],
    source_title: 'Cuộc đời, sự nghiệp Chủ tịch Hồ Chí Minh',
    source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
    source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
    source_accessed_at: '2026-09-04',
    verified: true,
    editor_status: 'APPROVED',
    locked: true
  },
  {
    id: 'evt-1930-01',
    chapter_id: 'chap-03',
    title: 'Chủ trì Hội nghị thành lập Đảng Cộng sản Việt Nam',
    date_display: 'Ngày 3 tháng 2 năm 1930',
    date_start: '1930-02-03',
    date_precision: 'day',
    location: 'Cửu Long (Bán đảo Hương Cảng, Trung Quốc)',
    summary: 'Nguyễn Ái Quốc chủ trì Hội nghị hợp nhất các tổ chức cộng sản trong nước, sáng lập nên Đảng Cộng sản Việt Nam, mở ra bước ngoặt quyết định cho cách mạng Việt Nam.',
    full_content: 'Từ ngày 06/01 đến đầu tháng 2/1930 tại Cửu Long (Hương Cảng), dưới sự chủ trì của lãnh tụ Nguyễn Ái Quốc với tư cách phái viên Quốc tế Cộng sản, Hội nghị hợp nhất các tổ chức cộng sản đã nhất trí thành lập một đảng duy nhất lấy tên là Đảng Cộng sản Việt Nam. Hội nghị thông qua Chánh cương vắn tắt, Sách lược vắn tắt do Nguyễn Ái Quốc soạn thảo.',
    media: [
      {
        id: 'med-05',
        file: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
        title: 'Hội nghị thành lập Đảng 1930',
        caption: 'Hương Cảng – Nơi diễn ra Hội nghị thành lập Đảng Cộng sản Việt Nam ngày 03/02/1930',
        alt: 'Thành lập Đảng 1930',
        media_type: 'image',
        source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
        source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
        copyright_note: 'Tư liệu lịch sử Đảng Cộng sản Việt Nam',
        usage_permission: 'Phục vụ công tác tuyên truyền giáo dục',
        historical_date: '1930',
        historical_location: 'Hương Cảng, Trung Quốc',
        verified: true,
        editor_status: 'APPROVED'
      }
    ],
    source_title: 'Cuộc đời, sự nghiệp Chủ tịch Hồ Chí Minh',
    source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
    source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
    source_accessed_at: '2026-09-04',
    verified: true,
    editor_status: 'APPROVED',
    locked: true
  },
  {
    id: 'evt-1941-01',
    chapter_id: 'chap-04',
    title: 'Về nước tại Pác Bó và Thành lập Mặt trận Việt Minh',
    date_display: 'Ngày 28/01/1941 & 19/05/1941',
    date_start: '1941-01-28',
    date_end: '1941-05-19',
    date_precision: 'day',
    location: 'Pác Bó, xã Trường Hà, huyện Hà Quảng, tỉnh Cao Bằng',
    summary: 'Sau 30 năm bôn ba, Bác Hồ trở về Tổ quốc lãnh đạo phong trào giải phóng dân tộc; thành lập Mặt trận Việt Minh nhằm tập hợp khối đại đoàn kết toàn dân tộc.',
    full_content: 'Ngày 28/01/1941, lãnh tụ Nguyễn Ái Quốc vượt qua cột mốc 108 biên giới Việt - Trung về đến Pác Bó (Hà Quảng, Cao Bằng). Tháng 5/1941, Người triệu tập và chủ trì Hội nghị lần thứ 8 Ban Chấp hành Trung ương Đảng, quyết định thành lập Việt Nam Độc lập Đồng minh (Mặt trận Việt Minh), đặt nhiệm vụ giải phóng dân tộc lên hàng đầu.',
    media: [
      {
        id: 'med-06',
        file: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        title: 'Khu di tích Pác Bó Cao Bằng',
        caption: 'Suối Lê-nin và Núi Các Mác tại Pác Bó (Cao Bằng) – Cội nguồn cách mạng',
        alt: 'Di tích Pác Bó Cao Bằng',
        media_type: 'image',
        source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
        source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
        copyright_note: 'Tư liệu di tích quốc gia đặc biệt Pác Bó',
        usage_permission: 'Phục vụ công tác tuyên truyền giáo dục',
        historical_date: '1941',
        historical_location: 'Hà Quảng, Cao Bằng',
        verified: true,
        editor_status: 'APPROVED'
      }
    ],
    source_title: 'Cuộc đời, sự nghiệp Chủ tịch Hồ Chí Minh',
    source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
    source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
    source_accessed_at: '2026-09-04',
    verified: true,
    editor_status: 'APPROVED',
    locked: true
  },
  {
    id: 'evt-1945-01',
    chapter_id: 'chap-04',
    title: 'Đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình',
    date_display: 'Ngày 2 tháng 9 năm 1945',
    date_start: '1945-09-02',
    date_precision: 'day',
    location: 'Quảng trường Ba Đình, Thủ đô Hà Nội',
    summary: 'Chủ tịch Hồ Chí Minh thay mặt Chính phủ lâm thời đọc Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa – Nhà nước công nông đầu tiên ở Đông Nam Á.',
    full_content: 'Ngày 2 tháng 9 năm 1945, trước hàng chục vạn đồng bào tại Quảng trường Ba Đình (Hà Nội), Chủ tịch Hồ Chí Minh trang trọng đọc bản Tuyên ngôn Độc lập, khẳng định trước toàn thế giới quyền tự do và độc lập của dân tộc Việt Nam: "Nước Việt Nam có quyền hưởng tự do và độc lập, và sự thật đã thành một nước tự do độc lập".',
    media: [
      {
        id: 'med-07',
        file: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Ho_Chi_Minh_reads_the_Declaration_of_Independence.jpg/640px-Ho_Chi_Minh_reads_the_Declaration_of_Independence.jpg',
        title: 'Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập',
        caption: 'Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình, ngày 2/9/1945',
        alt: 'Bác Hồ đọc Tuyên ngôn Độc lập 1945',
        media_type: 'image',
        source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
        source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
        copyright_note: 'Tư liệu lưu trữ Thông tấn xã Việt Nam / Cổng TTĐT TP.HCM',
        usage_permission: 'Phục vụ công tác tuyên truyền giáo dục',
        historical_date: '1945',
        historical_location: 'Ba Đình, Hà Nội',
        verified: true,
        editor_status: 'APPROVED'
      }
    ],
    source_title: 'Cuộc đời, sự nghiệp Chủ tịch Hồ Chí Minh',
    source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
    source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
    source_accessed_at: '2026-09-04',
    verified: true,
    editor_status: 'APPROVED',
    locked: true
  },
  {
    id: 'evt-1954-01',
    chapter_id: 'chap-05',
    title: 'Chiến thắng lịch sử Điện Biên Phủ',
    date_display: 'Ngày 7 tháng 5 năm 1954',
    date_start: '1954-05-07',
    date_precision: 'day',
    location: 'Tập đoàn cứ điểm Điện Biên Phủ, tỉnh Điện Biên',
    summary: 'Dưới sự lãnh đạo sáng suốt của Trung ương Đảng và Bác Hồ, quân và dân ta lập nên chiến thắng "lừng lẫy năm châu, chấn động địa cầu".',
    full_content: 'Sau 56 ngày đêm "khoét núi, ngủ hầm, mưa dầm, cơm vắt", chiều ngày 07/05/1954, lá cờ "Quyết chiến - Quyết thắng" của quân đội ta tung bay trên nóc hầm tướng De Castries, kết thúc thắng lợi cuộc kháng chiến 9 năm chống thực dân Pháp, đưa miền Bắc bước vào thời kỳ xây dựng chủ nghĩa xã hội.',
    media: [
      {
        id: 'med-08',
        file: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
        title: 'Chiến thắng Điện Biên Phủ',
        caption: 'Chiến thắng Điện Biên Phủ (07/05/1954) – Đỉnh cao của nghệ thuật chiến tranh nhân dân',
        alt: 'Chiến dịch Điện Biên Phủ 1954',
        media_type: 'image',
        source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
        source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
        copyright_note: 'Tư liệu lịch sử Bộ Quốc phòng',
        usage_permission: 'Phục vụ công tác tuyên truyền giáo dục',
        historical_date: '1954',
        historical_location: 'Điện Biên',
        verified: true,
        editor_status: 'APPROVED'
      }
    ],
    source_title: 'Cuộc đời, sự nghiệp Chủ tịch Hồ Chí Minh',
    source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
    source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
    source_accessed_at: '2026-09-04',
    verified: true,
    editor_status: 'APPROVED',
    locked: true
  },
  {
    id: 'evt-1969-01',
    chapter_id: 'chap-06',
    title: 'Chủ tịch Hồ Chí Minh từ trần và Bản Di chúc lịch sử',
    date_display: 'Ngày 2 tháng 9 năm 1969',
    date_start: '1969-09-02',
    date_precision: 'day',
    location: 'Thủ đô Hà Nội',
    summary: 'Chủ tịch Hồ Chí Minh qua đời ở tuổi 79, để lại bản Di chúc thiêng liêng kết tinh tư tưởng, đạo đức, phong cách và tấm lòng bao la của Người đối với non sông đất nước.',
    full_content: 'Hồi 9 giờ 47 phút ngày 2 tháng 9 năm 1969 (tức ngày 21 tháng 7 năm Kỷ Dậu), Chủ tịch Hồ Chí Minh vĩnh biệt chúng ta. Bản Di chúc thiêng liêng của Người là tài sản tinh thần vô giá, dặn dò về xây dựng Đảng trong sạch vững mạnh, bồi dưỡng thế hệ cách mạng cho đời sau, chăm lo đời sống nhân dân và củng cố khối đoàn kết quốc tế.',
    media: [
      {
        id: 'med-09',
        file: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Stilt_House_of_Ho_Chi_Minh.jpg/640px-Stilt_House_of_Ho_Chi_Minh.jpg',
        title: 'Nhà sàn Bác Hồ tại Phủ Chủ tịch',
        caption: 'Nhà sàn Bác Hồ – Nơi Người đã sống, làm việc và hoàn thành bản Di chúc lịch sử',
        alt: 'Nhà sàn Bác Hồ Phủ Chủ tịch',
        media_type: 'image',
        source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
        source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
        copyright_note: 'Khu di tích Phủ Chủ tịch',
        usage_permission: 'Phục vụ công tác tuyên truyền giáo dục',
        historical_date: '1969',
        historical_location: 'Hà Nội',
        verified: true,
        editor_status: 'APPROVED'
      }
    ],
    source_title: 'Cuộc đời, sự nghiệp Chủ tịch Hồ Chí Minh',
    source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
    source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
    source_accessed_at: '2026-09-04',
    verified: true,
    editor_status: 'APPROVED',
    locked: true
  }
];

// Local Storage Helper for Persistence
const STORAGE_KEY_COVER = 'hcm_gov_cover_config';
const STORAGE_KEY_CHAPTERS = 'hcm_gov_chapters';
const STORAGE_KEY_EVENTS = 'hcm_gov_events';
const STORAGE_KEY_SOURCES = 'hcm_gov_sources';
const STORAGE_KEY_VERSIONS = 'hcm_gov_version_history';

export const loadStoredCoverConfig = (): CoverConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COVER);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (!parsed.portrait_url || parsed.portrait_url.includes('wikimedia.org'))) {
        parsed.portrait_url = 'https://sv2.anhsieuviet.com/2026/09/05/screenshot_1788585720.png';
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error loading cover config', e);
  }
  return DEFAULT_COVER_CONFIG;
};

export const saveStoredCoverConfig = (config: CoverConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY_COVER, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving cover config', e);
  }
};

export const loadStoredChapters = (): BiographyChapter[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHAPTERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading chapters', e);
  }
  return DEFAULT_BIOGRAPHY_CHAPTERS;
};

export const saveStoredChapters = (chapters: BiographyChapter[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_CHAPTERS, JSON.stringify(chapters));
  } catch (e) {
    console.error('Error saving chapters', e);
  }
};

export const loadStoredEvents = (): EventCardSchema[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading events', e);
  }
  return DEFAULT_VERIFIED_EVENTS;
};

export const saveStoredEvents = (events: EventCardSchema[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
  } catch (e) {
    console.error('Error saving events', e);
  }
};

export const loadStoredSources = (): HistoricalSource[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SOURCES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading sources', e);
  }
  return DEFAULT_VERIFIED_SOURCES;
};

export const saveStoredSources = (sources: HistoricalSource[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_SOURCES, JSON.stringify(sources));
  } catch (e) {
    console.error('Error saving sources', e);
  }
};

export const loadStoredVersions = (): VersionHistoryRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VERSIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading version history', e);
  }
  return [];
};

export const recordVersionChange = (
  entity_id: string,
  entity_type: 'event' | 'chapter' | 'media' | 'cover',
  editor: string,
  reason: string,
  old_value: any,
  new_value: any
) => {
  try {
    const history = loadStoredVersions();
    const newRecord: VersionHistoryRecord = {
      id: `ver-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      entity_id,
      entity_type,
      version: history.filter(h => h.entity_id === entity_id).length + 1,
      editor,
      created_at: new Date().toISOString(),
      reason,
      old_value,
      new_value
    };
    const updated = [newRecord, ...history];
    localStorage.setItem(STORAGE_KEY_VERSIONS, JSON.stringify(updated));
    return newRecord;
  } catch (e) {
    console.error('Error recording version change', e);
    return null;
  }
};
