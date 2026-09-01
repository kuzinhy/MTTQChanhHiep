import { 
  Article, 
  OfficialDocument, 
  Competition, 
  TriviaQuestion, 
  PublicOpinion, 
  Task, 
  WorkEvent, 
  Note, 
  TemplateDoc, 
  DriveFileItem, 
  StaffUser,
  AuditLog
} from '../types';

export const INITIAL_ARTICLES: Article[] = [];

export const INITIAL_DOCUMENTS: OfficialDocument[] = [];

export const INITIAL_COMPETITIONS: Competition[] = [
  {
    id: 'comp-1',
    title: 'Hội thi trực tuyến "Tìm hiểu Lịch sử Mặt trận Dân tộc Thống nhất Việt Nam & Luật MTTQ"',
    description: 'Hội thi trắc nghiệm trực tuyến dành cho toàn thể đoàn viên, hội viên và nhân dân trên địa bàn phường Chánh Hiệp chào mừng các ngày lễ lớn trong năm.',
    bannerUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
    type: 'TRIVIA',
    startDate: '2026-08-01',
    endDate: '2026-09-30',
    status: 'ONGOING',
    timeLimitMinutes: 15,
    totalQuestions: 10,
    rules: 'Mỗi thí sinh có tối đa 2 lượt thi. Điểm số cao nhất và thời gian hoàn thành ngắn nhất sẽ được ghi nhận vào Bảng xếp hạng.'
  },
  {
    id: 'comp-2',
    title: 'Cuộc thi viết "Gương sáng Mặt trận - Hành động vì cộng đồng Phường Chánh Hiệp"',
    description: 'Cuộc thi viết cảm nhận, tuyên dương các mô hình hay, gương cán bộ Mặt trận, Trưởng Ban công tác Mặt trận khu phố tận tụy phục vụ nhân dân.',
    bannerUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200',
    type: 'WRITING',
    startDate: '2026-08-15',
    endDate: '2026-10-15',
    status: 'ONGOING',
    rules: 'Bài dự thi viết tay hoặc đánh máy từ 800 - 2000 từ, gửi trực tiếp qua file DOCX/PDF hoặc nhập trực tuyến.'
  }
];

export const INITIAL_TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: 'q-1',
    competitionId: 'comp-1',
    question: 'Ngày truyền thống của Mặt trận Dân tộc Thống nhất Việt Nam là ngày tháng năm nào?',
    options: [
      '18/11/1930',
      '03/02/1930',
      '19/05/1941',
      '02/09/1945'
    ],
    correctAnswerIndex: 0,
    explanation: 'Ngày 18/11/1930, Ban Thường vụ Trung ương Đảng Cộng sản Đông Dương ra Chỉ thị thành lập Hội Phản đế Đồng minh - hình thức tổ chức đầu tiên của Mặt trận Dân tộc Thống nhất Việt Nam.',
    topic: 'Lịch sử Mặt trận'
  },
  {
    id: 'q-2',
    competitionId: 'comp-1',
    question: 'Theo Luật Mặt trận Tổ quốc Việt Nam 2015, Mặt trận Tổ quốc Việt Nam là gì?',
    options: [
      'Là bộ phận cấu thành của hệ thống chính trị nước Cộng hòa XHCN Việt Nam',
      'Là tổ chức liên minh chính trị, liên minh tự nguyện của các tổ chức chính trị, chính trị - xã hội',
      'Là cơ sở chính trị của chính quyền nhân dân',
      'Tất cả các phương án trên'
    ],
    correctAnswerIndex: 3,
    explanation: 'Điều 1 Luật MTTQ Việt Nam quy định đầy đủ vị trí, vai trò, tính chất của Mặt trận Tổ quốc Việt Nam.',
    topic: 'Luật MTTQ'
  },
  {
    id: 'q-3',
    competitionId: 'comp-1',
    question: 'Mục tiêu chính của Cuộc vận động "Toàn dân đoàn kết xây dựng nông thôn mới, đô thị văn minh" là gì?',
    options: [
      'Phát triển kinh tế, nâng cao đời sống vật chất và tinh thần của nhân dân',
      'Xây dựng môi trường cảnh quan xanh - sạch - đẹp, đảm bảo an ninh trật tự',
      'Phát huy tinh thần tự quản của nhân dân ở khu dân cư',
      'Cả 3 phương án trên'
    ],
    correctAnswerIndex: 3,
    explanation: 'Cuộc vận động hướng tới nâng cao toàn diện chất lượng sống tại các khu dân cư.',
    topic: 'Phong trào thi đua'
  }
];

export const INITIAL_PUBLIC_OPINIONS: PublicOpinion[] = [
  {
    id: 'op-1',
    receiptCode: 'PA-2026-0801',
    topic: 'Môi trường & Đô thị',
    content: 'Tuyến đường Chánh Hiệp 08 gần trường tiểu học xuất hiện điểm tập kết rác tự phát gây mất mỹ quan và hôi hám trong giờ tan học. Đề nghị Mặt trận phường vận động khu phố dọn dẹp và gắn biển cấm đổ rác.',
    neighborhood: 'Khu phố 3',
    fullname: 'Nguyễn Thanh Tùng',
    phone: '0908123456',
    email: 'tung.nguyen@gmail.com',
    isAnonymous: false,
    status: 'PROCESSING',
    priority: 'HIGH',
    assignedTo: 'Lê Văn Bình (Phó Chủ tịch)',
    adminResponse: 'Ban Thường trực MTTQ phường đã tiếp nhận và chuyển phản ánh đến UBND phường cùng Ban CTMT Khu phố 3 tổ chức ra quân dọn dẹp trong cuối tuần này.',
    createdAt: '2026-08-28 09:30',
    tags: ['Rác thải', 'Đô thị văn minh', 'Trường học']
  },
  {
    id: 'op-2',
    receiptCode: 'PA-2026-0802',
    topic: 'An sinh xã hội',
    content: 'Gia đình bà Lê Thị Bích ở hẻm 45 Khu phố 7 thuộc diện người già đơn thân, căn nhà bị dột nặng sau các trận mưa vừa qua. Đề nghị xem xét hỗ trợ kinh phí sửa chữa Nhà Đại đoàn kết.',
    neighborhood: 'Khu phố 7',
    fullname: '',
    phone: '',
    email: '',
    isAnonymous: true,
    status: 'NEW',
    priority: 'URGENT',
    assignedTo: 'Trần Thị Hoa (Chủ tịch)',
    createdAt: '2026-08-29 14:15',
    tags: ['Nhà Đại đoàn kết', 'Hộ khó khăn', 'An sinh']
  },
  {
    id: 'op-3',
    receiptCode: 'PA-2026-0803',
    topic: 'Vấn đề dân sinh',
    content: 'Hệ thống đèn chiếu sáng công cộng tại đường Chánh Hiệp 22 bị hư hỏng 3 bóng liên tiếp hơn một tuần nay gây nguy hiểm cho người tham gia giao thông ban đêm.',
    neighborhood: 'Khu phố 5',
    fullname: 'Phạm Minh Hoàng',
    phone: '0912345678',
    isAnonymous: false,
    status: 'RESOLVED',
    priority: 'NORMAL',
    assignedTo: 'Ban CTMT Khu phố 5',
    adminResponse: 'Đã phối hợp Bộ phận Đô thị UBND phường khắc phục thay mới các bóng đèn hỏng ngày 27/08/2026.',
    createdAt: '2026-08-24 16:45',
    tags: ['Đèn chiếu sáng', 'An toàn giao thông']
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Rà soát danh sách hộ khó khăn nhận quà Tết Ất Tỵ',
    description: 'Phối hợp với 12 Trưởng Ban công tác Mặt trận khu phố lập danh sách, xác minh thông tin từng hoàn cảnh để thẩm định xét duyệt.',
    assigneeId: 'staff-2',
    assigneeName: 'Lê Văn Bình',
    assignerName: 'Trần Thị Hoa',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    deadline: '2026-09-10',
    createdAt: '2026-08-26'
  },
  {
    id: 'task-2',
    title: 'Soạn thảo Báo cáo sơ kết 5 năm thực hiện Nghị quyết giám sát phản biện',
    description: 'Tổng hợp số liệu từ các đoàn giám sát, các buổi tiếp xúc cử tri và đánh giá việc giải quyết kiến nghị của UBND.',
    assigneeId: 'staff-3',
    assigneeName: 'Trần Văn Nam',
    assignerName: 'Trần Thị Hoa',
    priority: 'NORMAL',
    status: 'TODO',
    deadline: '2026-09-15',
    createdAt: '2026-08-28'
  },
  {
    id: 'task-3',
    title: 'Tổng hợp bài dự thi cuộc thi viết "Gương sáng Mặt trận"',
    description: 'Phân loại bài dự thi gửi về qua cổng trực tuyến và bản giấy, lập danh sách chuyển Hội đồng chấm thi.',
    assigneeId: 'staff-4',
    assigneeName: 'Lê Thị Thu Thảo',
    assignerName: 'Lê Văn Bình',
    priority: 'NORMAL',
    status: 'IN_PROGRESS',
    deadline: '2026-10-20',
    createdAt: '2026-08-20'
  }
];

export const INITIAL_EVENTS: WorkEvent[] = [
  {
    id: 'evt-1',
    title: 'Họp Giao ban Ban Thường trực MTTQ phường tháng 9',
    startTime: '2026-09-02T08:00',
    endTime: '2026-09-02T10:30',
    location: 'Phòng họp số 2 - UBND phường Chánh Hiệp',
    chair: 'Đ/c Trần Thị Hoa - Chủ tịch MTTQ phường',
    participants: 'BTT MTTQ phường, Đại diện các đoàn thể chính trị - xã hội',
    content: 'Đánh giá công tác tháng 8 và triển khai kế hoạch trọng tâm tháng 9/2026.',
    category: 'Giao ban'
  },
  {
    id: 'evt-2',
    title: 'Tiếp xúc cử tri chuyên đề về Công tác Quản lý Đô thị',
    startTime: '2026-09-05T14:00',
    endTime: '2026-09-05T17:00',
    location: 'Hội trường Văn hóa Khu phố 4',
    chair: 'Thường trực HĐND - MTTQ phường',
    participants: 'Đại biểu HĐND phường, Nhân dân Khu phố 3, 4, 5',
    content: 'Lắng nghe ý kiến và kiến nghị nhân dân liên quan đến quy hoạch và thoát nước.',
    category: 'Tiếp xúc cử tri'
  }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    userId: 'user-admin',
    title: 'Chuẩn bị nội dung làm việc với Ban CTMT Khu phố 12',
    content: `- Kiểm tra tiến độ vận động Quỹ "Vì người nghèo" tại khu phố.
- Nhắc nhở khu phố đẩy mạnh tuyên truyền Cuộc thi trắc nghiệm trực tuyến.
- Ghi nhận ý kiến về đợt phát quà trung thu cho trẻ em em nghèo.`,
    color: '#fef3c7',
    isPinned: true,
    tags: ['Khu phố 12', 'Công tác', 'Nhắc việc'],
    updatedAt: '2026-08-29 10:20'
  },
  {
    id: 'note-2',
    userId: 'user-admin',
    title: 'Số điện thoại liên hệ khẩn cấp lực lượng an sinh khu phố',
    content: `KP1: A. Tuấn 0903xxx
KP2: C. Mai 0918xxx
KP3: A. Dũng 0989xxx`,
    color: '#e0f2fe',
    isPinned: false,
    tags: ['Danh bạ', 'Liên hệ'],
    updatedAt: '2026-08-25 15:40'
  }
];

export const INITIAL_TEMPLATES: TemplateDoc[] = [
  {
    id: 'tpl-1',
    title: 'Mẫu Kế hoạch tổ chức Hoạt động phong trào Mặt trận',
    category: 'Kế hoạch',
    description: 'Khung chuẩn kế hoạch ban hành bởi Ban Thường trực MTTQ phường Chánh Hiệp',
    content: `ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP
BAN THƯỜNG TRỰC
Số:   /KH-MTTQ-CH

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
Chánh Hiệp, ngày   tháng   năm 2026

KẾ HOẠCH
Về việc [TÊN HOẠT ĐỘNG / PHONG TRÀO]

I. MỤC ĐÍCH, YÊU CẦU
1. Mục đích:
2. Yêu cầu:

II. NỘI DUNG VÀ HÌNH THỨC THỰC HIỆN
1. Nội dung:
2. Hình thức:

III. THỜI GIAN VÀ ĐỊA ĐIỂM
1. Thời gian:
2. Địa điểm:

IV. TỔ CHỨC THỰC HIỆN
1. Ban Thường trực MTTQ phường:
2. Các tổ chức thành viên:
3. Ban công tác Mặt trận các khu phố:

TM. BAN THƯỜNG TRỰC
CHỦ TỊCH`
  },
  {
    id: 'tpl-2',
    title: 'Mẫu Báo cáo Kết quả công tác Mặt trận tháng / quý',
    category: 'Báo cáo',
    description: 'Mẫu báo cáo định kỳ đầy đủ các mảng công tác chính',
    content: `ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP
BAN THƯỜNG TRỰC
Số:   /BC-MTTQ-CH

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc

BÁO CÁO
Kết quả công tác Mặt trận [THÁNG/QUÝ] năm 2026
Phương hướng nhiệm vụ trọng tâm thời gian tới

I. KẾT QUẢ ĐẠT ĐƯỢC
1. Công tác tuyên truyền, vận động, tập hợp các tầng lớp nhân dân
2. Thực hiện các cuộc vận động, các phong trào thi đua yêu nước
3. Công tác giám sát, phản biện xã hội, tham gia xây dựng Đảng, chính quyền
4. Củng cố tổ chức, nâng cao năng lực hoạt động của hệ thống Mặt trận

II. ĐÁNH GIÁ CHUNG, TỒN TẠI VÀ NGUYÊN NHÂN
1. Ưu điểm:
2. Hạn chế, tồn tại:

III. NHIỆM VỤ TRỌNG TÂM THỜI GIAN TỚI`
  }
];

export const INITIAL_DRIVE_FILES: DriveFileItem[] = [
  {
    id: 'df-1',
    fileId: 'drive-101',
    name: 'Danh_sach_Ho_ngheo_Nhan_Qua_Tet_2026.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    webViewLink: 'https://docs.google.com/spreadsheets',
    folderName: 'An sinh xã hội & Tết 2026',
    owner: 'Trần Thị Hoa',
    modifiedTime: '2026-08-28 11:30',
    sizeFormatted: '1.2 MB'
  },
  {
    id: 'df-2',
    fileId: 'drive-102',
    name: 'Ke_hoach_Ngay_hoi_Dai_doan_ket_2026_Final.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    webViewLink: 'https://docs.google.com/document',
    folderName: 'Kế hoạch & Văn bản 2026',
    owner: 'Lê Văn Bình',
    modifiedTime: '2026-08-20 09:15',
    sizeFormatted: '450 KB'
  },
  {
    id: 'df-3',
    fileId: 'drive-103',
    name: 'Hinh_anh_Ngay_hoi_Dai_doan_ket_KP4.zip',
    mimeType: 'application/zip',
    webViewLink: 'https://drive.google.com',
    folderName: 'Hình ảnh Hoạt động',
    owner: 'Lê Thị Thu Thảo',
    modifiedTime: '2026-08-28 17:00',
    sizeFormatted: '28.4 MB'
  }
];

export const INITIAL_STAFF_USERS: StaffUser[] = [
  {
    id: 'staff-1',
    email: 'nguyenhuy.thudaumot@gmail.com',
    fullname: 'Nguyễn Huy',
    position: 'Trưởng Ban Thường trực MTTQ',
    department: 'Ban Thường trực',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
    phone: '0908.681.988',
    bio: 'Chủ tịch / Trưởng Ban Thường trực Ủy ban Mặt trận Tổ quốc Việt Nam phường Chánh Hiệp - Chỉ đạo điều hành toàn bộ công tác Mặt trận và Văn phòng số.',
    role: 'SUPER_ADMIN',
    permissions: ['all'],
    active: true,
    createdAt: '2026-01-01'
  },
  {
    id: 'staff-2',
    email: 'buivanhuy0705@gmail.com',
    fullname: 'Bùi Văn Huy',
    position: 'Phó Chủ tịch MTTQ',
    department: 'Ban Thường trực',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    phone: '0907.123.456',
    bio: 'Phó Chủ tịch Ủy ban MTTQ Việt Nam Phường Chánh Hiệp.',
    role: 'ADMIN',
    permissions: ['all'],
    active: true,
    createdAt: '2026-01-01'
  },
  {
    id: 'staff-3',
    email: 'vannam.mttq@chanhhiep.gov.vn',
    fullname: 'Trần Văn Nam',
    position: 'Ủy viên Thường trực',
    department: 'Bộ phận Văn phòng - Giám sát',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    role: 'MANAGER',
    permissions: ['manage_tasks', 'manage_cms', 'manage_opinions'],
    active: true,
    createdAt: '2026-01-01'
  },
  {
    id: 'staff-4',
    email: 'thuthao.mttq@chanhhiep.gov.vn',
    fullname: 'Lê Thị Thu Thảo',
    position: 'Cán bộ Tuyên giáo - Thi đua',
    department: 'Bộ phận Tuyên giáo',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    role: 'EDITOR',
    permissions: ['write_articles', 'manage_competitions'],
    active: true,
    createdAt: '2026-01-01'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'staff-1',
    userName: 'Trần Thị Hoa',
    action: 'ĐĂNG NHẬP',
    entity: 'Xác thực Hệ thống',
    details: 'Cán bộ đăng nhập vào Văn phòng số qua Google OAuth',
    timestamp: '2026-08-30 19:35'
  },
  {
    id: 'log-2',
    userId: 'staff-4',
    userName: 'Lê Thị Thu Thảo',
    action: 'DUYỆT BÀI VIẾT',
    entity: 'Tin tức',
    details: 'Đã xuất bản bài viết: Phường Chánh Hiệp tổ chức Ngày hội Đại đoàn kết',
    timestamp: '2026-08-28 10:12'
  }
];
