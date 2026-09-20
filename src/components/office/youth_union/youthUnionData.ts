export interface CriterionItem {
  id: string;
  code: string;
  title: string;
  description: string;
  maxPoints: number;
  category: 'I' | 'II' | 'III' | 'IV';
  requiredEvidence?: boolean;
}

export interface CriterionSubmissionState {
  selfPoints: number;
  officialPoints?: number;
  notes: string;
  status: 'PENDING' | 'APPROVED' | 'DRAFT';
  evidenceFiles: {
    id: string;
    name: string;
    size?: string;
    type: 'pdf' | 'image' | 'drive';
    url: string;
  }[];
  reviewedAt?: string;
  reviewerFeedback?: string;
}

export interface BranchInfo {
  id: string;
  name: string;
  type: 'DÂN CƯ' | 'TRƯỜNG HỌC' | 'LỰC LƯỢNG VŨ TRANG' | 'DOANH NGHIỆP';
  secretary: string;
  phone: string;
  membersCount: number;
  selfScore: number;
  officialScore: number;
  submittedCount: number;
  approvedCount: number;
  status?: 'ACTIVE' | 'LOCKED';
  updatedAt?: string;
}

export interface BranchAccount {
  id: string;
  branchId: string;
  branchName: string;
  username: string;
  passwordMasked: string;
  fullName: string;
  position: 'Bí thư Chi đoàn' | 'Phó Bí thư' | 'Ủy viên BCH';
  phone: string;
  status: 'ACTIVE' | 'LOCKED';
  createdAt: string;
  lastLogin?: string;
}

export interface EmulationCategory {
  id: 'I' | 'II' | 'III' | 'IV';
  code: string;
  title: string;
  maxPoints: number;
  description: string;
}

export interface EmulationSettings {
  year: number;
  isOpenSubmission: boolean;
  isRankingPublished: boolean;
  submissionDeadline: string;
  excellentThreshold: number; // default 85
  goodThreshold: number;      // default 70
  fairThreshold: number;      // default 50
  noticeTitle: string;
  noticeDescription?: string;
  allowSelfScoring?: boolean;
}

export const INITIAL_BRANCHES: BranchInfo[] = [
  { id: 'kp1', name: 'Chi đoàn Khu phố 1 (Chi đoàn Địa bàn Dân cư)', type: 'DÂN CƯ', secretary: 'Trần Thị Bích', phone: '0912.345.678', membersCount: 38, selfScore: 23.0, officialScore: 23.0, submittedCount: 2, approvedCount: 2, status: 'ACTIVE' },
  { id: 'kp2', name: 'Chi đoàn Khu phố 2 (Chi đoàn Địa bàn Dân cư)', type: 'DÂN CƯ', secretary: 'Lê Văn Nam', phone: '0903.112.233', membersCount: 42, selfScore: 68.5, officialScore: 65.0, submittedCount: 8, approvedCount: 6, status: 'ACTIVE' },
  { id: 'kp3', name: 'Chi đoàn Khu phố 3 (Chi đoàn Địa bàn Dân cư)', type: 'DÂN CƯ', secretary: 'Nguyễn Văn Minh', phone: '0988.776.655', membersCount: 35, selfScore: 54.0, officialScore: 50.0, submittedCount: 6, approvedCount: 5, status: 'ACTIVE' },
  { id: 'kp4', name: 'Chi đoàn Khu phố 4 (Chi đoàn Địa bàn Dân cư)', type: 'DÂN CƯ', secretary: 'Phạm Hồng Nhung', phone: '0977.889.900', membersCount: 29, selfScore: 72.0, officialScore: 70.0, submittedCount: 9, approvedCount: 8, status: 'ACTIVE' },
  { id: 'kp5', name: 'Chi đoàn Khu phố 5 (Chi đoàn Địa bàn Dân cư)', type: 'DÂN CƯ', secretary: 'Hoàng Quốc Tuấn', phone: '0933.445.566', membersCount: 31, selfScore: 45.0, officialScore: 40.0, submittedCount: 5, approvedCount: 4, status: 'ACTIVE' },
  { id: 'kp6', name: 'Chi đoàn Khu phố 6 (Chi đoàn Địa bàn Dân cư)', type: 'DÂN CƯ', secretary: 'Đặng Mai Phương', phone: '0944.556.677', membersCount: 40, selfScore: 82.0, officialScore: 80.0, submittedCount: 10, approvedCount: 9, status: 'ACTIVE' },
  { id: 'kp7', name: 'Chi đoàn Khu phố 7 (Chi đoàn Địa bàn Dân cư)', type: 'DÂN CƯ', secretary: 'Vũ Đức Thành', phone: '0966.778.899', membersCount: 33, selfScore: 60.0, officialScore: 58.0, submittedCount: 7, approvedCount: 6, status: 'ACTIVE' },
  { id: 'kp8', name: 'Chi đoàn Khu phố 8 (Chi đoàn Địa bàn Dân cư)', type: 'DÂN CƯ', secretary: 'Bùi Thị Hà', phone: '0918.223.344', membersCount: 27, selfScore: 35.0, officialScore: 35.0, submittedCount: 4, approvedCount: 3, status: 'ACTIVE' },
  { id: 'kp9', name: 'Chi đoàn Khu phố 9 (Chi đoàn Địa bàn Dân cư)', type: 'DÂN CƯ', secretary: 'Đỗ Tiến Dũng', phone: '0922.334.455', membersCount: 36, selfScore: 55.0, officialScore: 52.0, submittedCount: 6, approvedCount: 5, status: 'ACTIVE' },
  { id: 'kp10', name: 'Chi đoàn Khu phố 10 (Chi đoàn Địa bàn Dân cư)', type: 'DÂN CƯ', secretary: 'Trương Ngọc Ánh', phone: '0981.234.567', membersCount: 30, selfScore: 48.0, officialScore: 45.0, submittedCount: 5, approvedCount: 4, status: 'ACTIVE' },
  { id: 'thcs', name: 'Chi đoàn Trường THCS Chánh Hiệp (Khối Trường học)', type: 'TRƯỜNG HỌC', secretary: 'Nguyễn Thị Thu Hà', phone: '0908.667.788', membersCount: 45, selfScore: 88.0, officialScore: 88.0, submittedCount: 11, approvedCount: 10, status: 'ACTIVE' },
  { id: 'th_pl', name: 'Chi đoàn Trường Tiểu học Chánh Hiệp', type: 'TRƯỜNG HỌC', secretary: 'Võ Thanh Tùng', phone: '0938.990.011', membersCount: 32, selfScore: 76.0, officialScore: 74.0, submittedCount: 9, approvedCount: 8, status: 'ACTIVE' },
  { id: 'mn_pl', name: 'Chi đoàn Mầm non Hoa Mai Chánh Hiệp', type: 'TRƯỜNG HỌC', secretary: 'Lý Kim Yến', phone: '0949.123.456', membersCount: 25, selfScore: 65.0, officialScore: 65.0, submittedCount: 7, approvedCount: 7, status: 'ACTIVE' },
  { id: 'qs', name: 'Chi đoàn Quân sự Phường Chánh Hiệp', type: 'LỰC LƯỢNG VŨ TRANG', secretary: 'Trịnh Hoài Nam', phone: '0972.334.455', membersCount: 22, selfScore: 92.0, officialScore: 90.0, submittedCount: 11, approvedCount: 10, status: 'ACTIVE' },
  { id: 'ca', name: 'Chi đoàn Công an Phường Chánh Hiệp', type: 'LỰC LƯỢNG VŨ TRANG', secretary: 'Nguyễn Minh Hải', phone: '0913.445.566', membersCount: 28, selfScore: 90.0, officialScore: 90.0, submittedCount: 11, approvedCount: 11, status: 'ACTIVE' },
  { id: 'dn', name: 'Chi đoàn Doanh nghiệp Ngoài nhà nước', type: 'DOANH NGHIỆP', secretary: 'Đoàn Gia Bảo', phone: '0909.887.766', membersCount: 20, selfScore: 50.0, officialScore: 48.0, submittedCount: 5, approvedCount: 4, status: 'ACTIVE' },
];

export const INITIAL_CATEGORIES: EmulationCategory[] = [
  { id: 'I', code: 'Nhóm I', title: 'Công tác Tuyên giáo - Giáo dục Truyền thống', maxPoints: 25, description: 'Đánh giá công tác học tập Nghị quyết, tuyên truyền mạng xã hội và hành trình về nguồn.' },
  { id: 'II', code: 'Nhóm II', title: 'Các Phong trào Hành động Cách mạng & Tình nguyện', maxPoints: 35, description: 'Đánh giá Ngày Thứ Bảy Tình Nguyện, Chủ Nhật Xanh, Công trình thanh niên và an sinh xã hội.' },
  { id: 'III', code: 'Nhóm III', title: 'Công tác Xây dựng Đoàn - Hội - Đội Vững mạnh', maxPoints: 20, description: 'Đánh giá quản lý dữ liệu số App Thanh niên Việt Nam và chất lượng sinh hoạt Chi đoàn.' },
  { id: 'IV', code: 'Nhóm IV', title: 'Chuyển đổi số & Sáng kiến Tiêu biểu', maxPoints: 20, description: 'Đánh giá Tổ công nghệ số cộng đồng, hỗ trợ dịch vụ công trực tuyến và sáng kiến giải pháp.' },
];

export const INITIAL_CRITERIA_LIST: CriterionItem[] = [
  // Nhóm I (25 điểm)
  {
    id: 'tc1_1',
    code: 'TC 1.1',
    category: 'I',
    title: 'Tổ chức học tập Nghị quyết Đảng, Đoàn và chuyên đề học tập Bác Hồ 2026',
    description: 'Tối thiểu 95% đoàn viên tham gia học tập trực tuyến hoặc trực tiếp; có danh sách điểm danh và ảnh hoạt động.',
    maxPoints: 10,
    requiredEvidence: true
  },
  {
    id: 'tc1_2',
    code: 'TC 1.2',
    category: 'I',
    title: 'Tuyên truyền trên mạng xã hội và kênh thông tin cơ sở',
    description: 'Chia sẻ tối thiểu 02 tin/tuần từ trang Thành đoàn và Đoàn phường; xây dựng ấn phẩm tuyên truyền trực quan.',
    maxPoints: 8,
    requiredEvidence: true
  },
  {
    id: 'tc1_3',
    code: 'TC 1.3',
    category: 'I',
    title: 'Giáo dục truyền thống cách mạng, địa chỉ đỏ và đền ơn đáp nghĩa',
    description: 'Tổ chức ít nhất 01 hành trình về nguồn và thăm tặng quà Mẹ VNAH/Gia đình chính sách trong năm.',
    maxPoints: 7,
    requiredEvidence: true
  },

  // Nhóm II (35 điểm)
  {
    id: 'tc2_1',
    code: 'TC 2.1',
    category: 'II',
    title: 'Thực hiện Ngày Thứ Bảy Tình Nguyện & Ngày Chủ Nhật Xanh',
    description: 'Định kỳ ra quân dọn dẹp vệ sinh, xóa điểm đen rác thải, trồng và chăm sóc cây xanh tuyến đường thanh niên.',
    maxPoints: 12,
    requiredEvidence: true
  },
  {
    id: 'tc2_2',
    code: 'TC 2.2',
    category: 'II',
    title: 'Đảm nhận và hoàn thành Công trình thanh niên năm 2026',
    description: 'Có công trình thanh niên gắn với văn minh đô thị hoặc chuyển đổi số cơ sở, có biên bản nghiệm thu.',
    maxPoints: 13,
    requiredEvidence: true
  },
  {
    id: 'tc2_3',
    code: 'TC 2.3',
    category: 'II',
    title: 'Tham gia các hoạt động hiến máu tình nguyện và an sinh xã hội',
    description: 'Vận động đạt hoặc vượt chỉ tiêu hiến máu nhân đạo; chăm lo thiếu nhi có hoàn cảnh khó khăn trên địa bàn.',
    maxPoints: 10,
    requiredEvidence: true
  },

  // Nhóm III (20 điểm)
  {
    id: 'tc3_1',
    code: 'TC 3.1',
    category: 'III',
    title: 'Công tác phát triển đoàn viên mới và quản lý dữ liệu số hóa',
    description: '100% đoàn viên được quản lý đầy đủ trên phần mềm quản lý đoàn viên quốc gia (App Thanh niên Việt Nam).',
    maxPoints: 10,
    requiredEvidence: true
  },
  {
    id: 'tc3_2',
    code: 'TC 3.2',
    category: 'III',
    title: 'Chất lượng sinh hoạt Chi đoàn định kỳ và sinh hoạt chuyên đề',
    description: 'Tổ chức sinh hoạt lệ định kỳ hàng tháng đầy đủ biên bản họp, sinh hoạt chuyên đề đổi mới hình thức.',
    maxPoints: 10,
    requiredEvidence: true
  },

  // Nhóm IV (20 điểm)
  {
    id: 'tc4_1',
    code: 'TC 4.1',
    category: 'IV',
    title: 'Tổ công nghệ số cộng đồng và hướng dẫn dịch vụ công trực tuyến',
    description: 'Đội hình thanh niên tình nguyện hỗ trợ người dân thực hiện dịch vụ công, định danh điện tử VNeID.',
    maxPoints: 10,
    requiredEvidence: true
  },
  {
    id: 'tc4_2',
    code: 'TC 4.2',
    category: 'IV',
    title: 'Sáng kiến, mô hình giải pháp thanh niên chuyển đổi số tiêu biểu',
    description: 'Có ít nhất 01 sáng kiến/giải pháp được Hội đồng cấp phường công nhận và nhân rộng.',
    maxPoints: 10,
    requiredEvidence: true
  }
];

export const CRITERIA_LIST = INITIAL_CRITERIA_LIST;

export const INITIAL_ACCOUNTS: BranchAccount[] = [
  { id: 'acc_kp1', branchId: 'kp1', branchName: 'Chi đoàn Khu phố 1', username: 'chidoan_kp1', passwordMasked: '••••••••', fullName: 'Trần Thị Bích', position: 'Bí thư Chi đoàn', phone: '0912.345.678', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '19/09/2026 18:20' },
  { id: 'acc_kp2', branchId: 'kp2', branchName: 'Chi đoàn Khu phố 2', username: 'chidoan_kp2', passwordMasked: '••••••••', fullName: 'Lê Văn Nam', position: 'Bí thư Chi đoàn', phone: '0903.112.233', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '18/09/2026 14:15' },
  { id: 'acc_kp3', branchId: 'kp3', branchName: 'Chi đoàn Khu phố 3', username: 'chidoan_kp3', passwordMasked: '••••••••', fullName: 'Nguyễn Văn Minh', position: 'Bí thư Chi đoàn', phone: '0988.776.655', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '17/09/2026 09:30' },
  { id: 'acc_kp4', branchId: 'kp4', branchName: 'Chi đoàn Khu phố 4', username: 'chidoan_kp4', passwordMasked: '••••••••', fullName: 'Phạm Hồng Nhung', position: 'Bí thư Chi đoàn', phone: '0977.889.900', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '19/09/2026 11:45' },
  { id: 'acc_kp5', branchId: 'kp5', branchName: 'Chi đoàn Khu phố 5', username: 'chidoan_kp5', passwordMasked: '••••••••', fullName: 'Hoàng Quốc Tuấn', position: 'Bí thư Chi đoàn', phone: '0933.445.566', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '16/09/2026 15:10' },
  { id: 'acc_thcs', branchId: 'thcs', branchName: 'Chi đoàn Trường THCS Chánh Hiệp', username: 'chidoan_thcs', passwordMasked: '••••••••', fullName: 'Nguyễn Thị Thu Hà', position: 'Bí thư Chi đoàn', phone: '0908.667.788', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '19/09/2026 16:00' },
  { id: 'acc_qs', branchId: 'qs', branchName: 'Chi đoàn Quân sự Phường Chánh Hiệp', username: 'chidoan_quansu', passwordMasked: '••••••••', fullName: 'Trịnh Hoài Nam', position: 'Bí thư Chi đoàn', phone: '0972.334.455', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '19/09/2026 08:30' },
  { id: 'acc_ca', branchId: 'ca', branchName: 'Chi đoàn Công an Phường Chánh Hiệp', username: 'chidoan_congan', passwordMasked: '••••••••', fullName: 'Nguyễn Minh Hải', position: 'Bí thư Chi đoàn', phone: '0913.445.566', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '19/09/2026 17:15' },
];

export const INITIAL_EMULATION_SETTINGS: EmulationSettings = {
  year: 2026,
  isOpenSubmission: true,
  isRankingPublished: true,
  submissionDeadline: '30/11/2026',
  excellentThreshold: 85,
  goodThreshold: 70,
  fairThreshold: 50,
  noticeTitle: 'Thực hiện đánh giá, phân loại và bình xét thi đua các Chi đoàn năm công tác 2026',
  noticeDescription: 'Đề nghị Bí thư các Chi đoàn chủ động tự rà soát, chấm điểm và đính kèm đầy đủ hồ sơ minh chứng (file biên bản, ảnh hoạt động) trước thời hạn quy định.',
  allowSelfScoring: true
};

export const INITIAL_SUBMISSIONS: Record<string, Record<string, CriterionSubmissionState>> = {
  kp1: {
    tc1_1: {
      selfPoints: 10,
      officialPoints: 10,
      notes: 'Đã tổ chức 02 buổi sinh hoạt chuyên đề tại Hội trường KP1, 100% đoàn viên tham gia có danh sách chữ ký.',
      status: 'APPROVED',
      evidenceFiles: [
        { id: 'f1', name: 'Nghi_quyet_hoc_tap_chuyen_de_KP1.pdf', size: '1.4 MB', type: 'pdf', url: '#' },
        { id: 'f2', name: 'Hinh_anh_sinh_hoat_chuyen_de.jpg', size: '2.8 MB', type: 'image', url: '#' }
      ]
    },
    tc2_2: {
      selfPoints: 13,
      officialPoints: 13,
      notes: 'Hoàn thành công trình bích họa "Tuyến hẻm văn minh không rác" chiều dài 120m, có ảnh trước và sau thực hiện.',
      status: 'APPROVED',
      evidenceFiles: [
        { id: 'f3', name: 'Bien_ban_nghiem_thu_cong_trinh_bich_hoa.pdf', size: '2.1 MB', type: 'pdf', url: '#' },
        { id: 'f4', name: 'Album_anh_khanh_thanh_cong_trinh.jpg', size: '4.5 MB', type: 'image', url: '#' }
      ]
    }
  }
};

export interface YouthEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  status: 'Sắp diễn ra' | 'Đang diễn ra' | 'Đã kết thúc';
  description?: string;
  quota?: number;
}

export interface YouthCompetition {
  id: string;
  title: string;
  participants: number;
  status: 'Đang diễn ra' | 'Đã hoàn thành';
  description?: string;
  deadline?: string;
}

export interface YouthDocument {
  id: string;
  code: string;
  title: string;
  date: string;
  type: string;
  downloadUrl?: string;
  description?: string;
  url?: string;
}

export interface YouthInitiative {
  id: string;
  title: string;
  author: string;
  branch: string;
  date: string;
  status: 'Chờ thẩm định' | 'Đã thẩm định';
  noveltyScore?: number;
  applicabilityScore?: number;
  digitalScore?: number;
  totalScore?: number;
}

export interface YouthArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  views: number;
  status: string;
  image: string;
  summary?: string;
}

export interface AuditLog {
  id: string;
  user: string;
  time: string;
  action: string;
  badge: string;
}

export const INITIAL_EVENTS: YouthEvent[] = [
  { id: 'ev1', title: 'Lễ ra quân Chiến dịch Tình nguyện Mùa Hè Xanh 2026', date: '2026-09-25', location: 'Công viên Trung tâm Phường Chánh Hiệp', status: 'Sắp diễn ra', description: 'Chiến dịch tình nguyện trọng điểm hè 2026 với chuỗi hoạt động cải tạo cảnh quan đô thị, bảo vệ môi trường và chăm lo an sinh xã hội.', quota: 45 },
  { id: 'ev2', title: 'Hội nghị sơ kết công tác Đoàn và phong trào TTN Quý III', date: '2026-09-30', location: 'Hội trường UBND Phường Chánh Hiệp', status: 'Sắp diễn ra', description: 'Đánh giá chỉ tiêu thi đua Quý III, triển khai đợt hoạt động cao điểm thi đua chào mừng kỷ niệm các ngày lễ lớn cuối năm.', quota: 20 },
  { id: 'ev3', title: 'Tập huấn kỹ năng chuyển đổi số cho Đội hình Công nghệ số cộng đồng', date: '2026-10-05', location: 'Trường THCS Chánh Hiệp', status: 'Sắp diễn ra', description: 'Tập huấn triển khai chữ ký số cá nhân, hướng dẫn dịch vụ công trực tuyến và cài đặt ứng dụng công dân số Chánh Hiệp.', quota: 30 },
];

export const INITIAL_COMPETITIONS: YouthCompetition[] = [
  { id: 'cp1', title: 'Tìm hiểu Nghị quyết Đại hội Đảng và Đại hội Đoàn', participants: 645, status: 'Đang diễn ra', description: 'Hội thi tìm hiểu lịch sử hào hùng của Đảng Cộng sản Việt Nam, Nghị quyết Đại hội Đoàn các cấp và lý luận chính trị cơ bản cho đoàn viên.', deadline: '15/10/2026' },
  { id: 'cp2', title: 'Thanh niên Chánh Hiệp với Chuyển đổi số cộng đồng', participants: 412, status: 'Đang diễn ra', description: 'Tìm hiểu kiến thức về an toàn thông tin mạng, kỹ năng khai thác dịch vụ công trực tuyến và các giải pháp xây dựng đô thị thông minh.', deadline: '20/10/2026' },
  { id: 'cp3', title: 'Rung chuông vàng Lịch sử Đảng bộ Phường Chánh Hiệp', participants: 193, status: 'Đã hoàn thành', description: 'Hội thi trực tiếp kết hợp ứng dụng trắc nghiệm số tìm hiểu về lịch sử hình thành và phát triển Đảng bộ Phường Chánh Hiệp.', deadline: '10/09/2026' },
];

export const INITIAL_DOCUMENTS: YouthDocument[] = [
  { id: 'doc1', code: '01-KH/ĐTN', title: 'Kế hoạch tổ chức các hoạt động Tháng Thanh niên năm 2026', date: '2026-01-10', type: 'Kế hoạch', url: '#', description: 'Kế hoạch tổng thể triển khai đợt hoạt động Tháng Thanh niên với chủ đề Tuổi trẻ Chánh Hiệp tiên phong chuyển đổi số.' },
  { id: 'doc2', code: '15-HD/ĐTN', title: 'Hướng dẫn đánh giá, phân loại đoàn viên và tổ chức cơ sở Đoàn năm 2026', date: '2026-02-15', type: 'Hướng dẫn', url: '#', description: 'Hướng dẫn quy trình tự chấm điểm thi đua chi đoàn, thẩm định minh chứng và đánh giá xếp loại đoàn viên cuối năm.' },
  { id: 'doc3', code: '22-TB/ĐTN', title: 'Thông báo triệu tập đại biểu tham dự Hội nghị BCH mở rộng', date: '2026-03-01', type: 'Thông báo', url: '#', description: 'Thông báo thời gian, địa điểm và nội dung chuẩn bị cho Hội nghị Ban Chấp hành Đoàn Phường Chánh Hiệp mở rộng Quý III.' },
];

export const INITIAL_INITIATIVES: YouthInitiative[] = [
  {
    id: 'init1',
    title: 'Xây dựng Thư viện số và Mã QR giới thiệu di tích lịch sử địa chỉ đỏ Phường Chánh Hiệp',
    author: 'Nguyễn Văn An',
    branch: 'Chi đoàn Khu phố 1 (Chi đoàn Địa bàn Dân cư)',
    date: '2026-09-15',
    status: 'Chờ thẩm định'
  }
];

export const INITIAL_ARTICLES: YouthArticle[] = [
  {
    id: 'art1',
    title: 'CHÁNH HIỆP (TP.HCM): GIAO BAN NHCSXH ĐỊNH KỲ THÁNG 9/2026',
    category: 'Hoạt động Đoàn',
    date: '16/09/2026',
    views: 2450,
    status: 'Đã đăng',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400&auto=format&fit=crop&q=80',
    summary: 'Ban Thường vụ Đoàn Phường Chánh Hiệp phối hợp tổ chức buổi họp giao ban định kỳ tháng 9 năm 2026 nhằm rà soát và tháo gỡ khó khăn về các nguồn vốn vay ưu đãi Ngân hàng Chính sách Xã hội cho thanh niên cơ sở.'
  },
  {
    id: 'art2',
    title: 'CHÁNH HIỆP (TP.HCM): 100% LIÊN ĐỘI PHƯỜNG CHÁNH HIỆP ĐỒNG LOẠT KHAI GIẢNG NĂM HỌC MỚI',
    category: 'Công tác Đội',
    date: '15/09/2026',
    views: 890,
    status: 'Đã đăng',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
    summary: 'Đồng hành cùng ngày hội toàn dân đưa trẻ đến trường, 100% các Liên đội Tiểu học, THCS trên địa bàn Phường Chánh Hiệp đã rộn ràng tổ chức lễ khai giảng năm học mới 2026 - 2027 đầy phấn khởi.'
  },
  {
    id: 'art3',
    title: 'CHÁNH HIỆP (TP.HCM): CHUNG TAY CHĂM LO, MANG NIỀM VUI ĐẾN THIẾU NHI KHÓ KHĂN',
    category: 'Công tác Đội',
    date: '14/09/2026',
    views: 1200,
    status: 'Đã đăng',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&auto=format&fit=crop&q=80',
    summary: 'Nhằm thiết thực chăm lo đời sống tinh thần cho các em thiếu nhi có hoàn cảnh khó khăn trên địa bàn phường, Đoàn Phường đã trao tặng hơn 100 suất quà, học bổng nghĩa tình cùng lồng đèn nhân dịp Trung thu.'
  },
  {
    id: 'art4',
    title: 'TUỔI TRẺ CHÁNH HIỆP RA QUÂN HỖ TRỢ NHẬP LIỆU KẾT QUẢ ĐỊNH DANH ĐIỆN TỬ VNeID',
    category: 'Chuyển đổi số',
    date: '12/09/2026',
    views: 740,
    status: 'Đã đăng',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&auto=format&fit=crop&q=80',
    summary: 'Phát huy tinh thần xung kích tình nguyện của tuổi trẻ trong công cuộc chuyển đổi số quốc gia, Đoàn Phường đã huy động 50 đoàn viên đồng loạt hỗ trợ công an phường hướng dẫn người dân kích hoạt VNeID mức độ 2.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log1',
    user: 'Nguyễn Văn An (BTV Đoàn Phường)',
    time: '16/09/2026 14:30:22',
    action: 'Chi đoàn KP1: Phê duyệt TC 2.2 - Công trình thanh niên (13/13 điểm)',
    badge: 'Phê duyệt điểm'
  },
  {
    id: 'log2',
    user: 'Trần Thị Bích',
    time: '16/09/2026 10:15:05',
    action: 'Chi đoàn KP1: Nộp Biên bản nghiệm thu công trình bích họa',
    badge: 'Nộp minh chứng'
  },
  {
    id: 'log3',
    user: 'Nguyễn Văn An (BTV Đoàn Phường)',
    time: '15/09/2026 16:40:12',
    action: 'Sáng kiến: Tiếp nhận đề án "Xây dựng Thư viện số và Mã QR"',
    badge: 'Sáng kiến'
  },
  {
    id: 'log4',
    user: 'Nguyễn Văn Minh',
    time: '15/09/2026 09:20:44',
    action: 'Chi đoàn KP3: Cập nhật Báo cáo Tổ công nghệ số cộng đồng',
    badge: 'Báo cáo'
  }
];

// Fallbacks for compatibility
export const RECENT_ARTICLES = INITIAL_ARTICLES;
export const AUDIT_LOGS_MOCK = INITIAL_AUDIT_LOGS;

// Storage keys
const KEY_BRANCHES = 'youth_union_branches';
const KEY_CRITERIA = 'youth_union_criteria';
const KEY_ACCOUNTS = 'youth_union_accounts';
const KEY_SUBMISSIONS = 'youth_union_submissions';
const KEY_SETTINGS = 'youth_union_settings';
const KEY_EVENTS = 'youth_union_events';
const KEY_COMPETITIONS = 'youth_union_competitions';
const KEY_DOCUMENTS = 'youth_union_documents';
const KEY_INITIATIVES = 'youth_union_initiatives';
const KEY_ARTICLES = 'youth_union_articles';
const KEY_AUDIT_LOGS = 'youth_union_audit_logs';

const EVENT_UPDATE = 'youth_union_data_updated';

// Storage helper functions
export const loadStoredArticles = (): YouthArticle[] => {
  try {
    const raw = localStorage.getItem(KEY_ARTICLES);
    return raw ? JSON.parse(raw) : INITIAL_ARTICLES;
  } catch {
    return INITIAL_ARTICLES;
  }
};

export const saveStoredArticles = (items: YouthArticle[]) => {
  localStorage.setItem(KEY_ARTICLES, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT_UPDATE, { detail: { type: 'articles' } }));
};

export const loadStoredEvents = (): YouthEvent[] => {
  try {
    const raw = localStorage.getItem(KEY_EVENTS);
    return raw ? JSON.parse(raw) : INITIAL_EVENTS;
  } catch {
    return INITIAL_EVENTS;
  }
};

export const saveStoredEvents = (items: YouthEvent[]) => {
  localStorage.setItem(KEY_EVENTS, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT_UPDATE, { detail: { type: 'events' } }));
};

export const loadStoredCompetitions = (): YouthCompetition[] => {
  try {
    const raw = localStorage.getItem(KEY_COMPETITIONS);
    return raw ? JSON.parse(raw) : INITIAL_COMPETITIONS;
  } catch {
    return INITIAL_COMPETITIONS;
  }
};

export const saveStoredCompetitions = (items: YouthCompetition[]) => {
  localStorage.setItem(KEY_COMPETITIONS, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT_UPDATE, { detail: { type: 'competitions' } }));
};

export const loadStoredDocuments = (): YouthDocument[] => {
  try {
    const raw = localStorage.getItem(KEY_DOCUMENTS);
    return raw ? JSON.parse(raw) : INITIAL_DOCUMENTS;
  } catch {
    return INITIAL_DOCUMENTS;
  }
};

export const saveStoredDocuments = (items: YouthDocument[]) => {
  localStorage.setItem(KEY_DOCUMENTS, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT_UPDATE, { detail: { type: 'documents' } }));
};

export const loadStoredInitiatives = (): YouthInitiative[] => {
  try {
    const raw = localStorage.getItem(KEY_INITIATIVES);
    return raw ? JSON.parse(raw) : INITIAL_INITIATIVES;
  } catch {
    return INITIAL_INITIATIVES;
  }
};

export const saveStoredInitiatives = (items: YouthInitiative[]) => {
  localStorage.setItem(KEY_INITIATIVES, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT_UPDATE, { detail: { type: 'initiatives' } }));
};

export const loadStoredAuditLogs = (): AuditLog[] => {
  try {
    const raw = localStorage.getItem(KEY_AUDIT_LOGS);
    return raw ? JSON.parse(raw) : INITIAL_AUDIT_LOGS;
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
};

export const saveStoredAuditLogs = (items: AuditLog[]) => {
  localStorage.setItem(KEY_AUDIT_LOGS, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT_UPDATE, { detail: { type: 'audit_logs' } }));
};

export const loadStoredBranches = (): BranchInfo[] => {
  try {
    const raw = localStorage.getItem(KEY_BRANCHES);
    if (!raw) return INITIAL_BRANCHES;
    const parsed = JSON.parse(raw);
    // Replace old Phu Loi names if stored in cache
    return parsed.map((b: BranchInfo) => ({
      ...b,
      name: b.name.replace(/Phú Lợi/g, 'Chánh Hiệp')
    }));
  } catch {
    return INITIAL_BRANCHES;
  }
};

export const saveStoredBranches = (branches: BranchInfo[]) => {
  localStorage.setItem(KEY_BRANCHES, JSON.stringify(branches));
  window.dispatchEvent(new CustomEvent(EVENT_UPDATE, { detail: { type: 'branches' } }));
};

export const loadStoredCriteria = (): CriterionItem[] => {
  try {
    const raw = localStorage.getItem(KEY_CRITERIA);
    return raw ? JSON.parse(raw) : INITIAL_CRITERIA_LIST;
  } catch {
    return INITIAL_CRITERIA_LIST;
  }
};

export const saveStoredCriteria = (criteria: CriterionItem[]) => {
  localStorage.setItem(KEY_CRITERIA, JSON.stringify(criteria));
  window.dispatchEvent(new CustomEvent(EVENT_UPDATE, { detail: { type: 'criteria' } }));
};

export const loadStoredAccounts = (): BranchAccount[] => {
  try {
    const raw = localStorage.getItem(KEY_ACCOUNTS);
    return raw ? JSON.parse(raw) : INITIAL_ACCOUNTS;
  } catch {
    return INITIAL_ACCOUNTS;
  }
};

export const saveStoredAccounts = (accounts: BranchAccount[]) => {
  localStorage.setItem(KEY_ACCOUNTS, JSON.stringify(accounts));
  window.dispatchEvent(new CustomEvent(EVENT_UPDATE, { detail: { type: 'accounts' } }));
};

export const loadStoredSettings = (): EmulationSettings => {
  try {
    const raw = localStorage.getItem(KEY_SETTINGS);
    return raw ? JSON.parse(raw) : INITIAL_EMULATION_SETTINGS;
  } catch {
    return INITIAL_EMULATION_SETTINGS;
  }
};

export const saveStoredSettings = (settings: EmulationSettings) => {
  localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent(EVENT_UPDATE, { detail: { type: 'settings' } }));
};

export const loadStoredSubmissions = (): Record<string, Record<string, CriterionSubmissionState>> => {
  try {
    const raw = localStorage.getItem(KEY_SUBMISSIONS);
    return raw ? JSON.parse(raw) : INITIAL_SUBMISSIONS;
  } catch {
    return INITIAL_SUBMISSIONS;
  }
};

export const saveStoredSubmissions = (subs: Record<string, Record<string, CriterionSubmissionState>>) => {
  localStorage.setItem(KEY_SUBMISSIONS, JSON.stringify(subs));
  window.dispatchEvent(new CustomEvent(EVENT_UPDATE, { detail: { type: 'submissions' } }));
};
