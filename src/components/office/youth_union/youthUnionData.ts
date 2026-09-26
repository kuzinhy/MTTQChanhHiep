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
  deputySecretary?: string;
  executiveMembers?: string[];
  term?: string; // Nhiệm kỳ, ví dụ: 2025 - 2027
  partyMembersInBranch?: number; // Số đảng viên tham gia sinh hoạt Đoàn
  youthGatheringRate?: number; // Tỷ lệ tập hợp thanh niên trên địa bàn (%)
  meetingDay?: string; // Lịch sinh hoạt định kỳ (vd: "Ngày 15 hàng tháng")
  threeInitiativesRating?: 'XUẤT SẮC' | 'ĐẠT CHUẨN' | 'CẦN CỐ GẮNG'; // Chi đoàn mạnh 3 chủ động
  address?: string;
  establishedDate?: string;
  membersCount: number;
  selfScore: number;
  officialScore: number;
  submittedCount: number;
  approvedCount: number;
  status?: 'ACTIVE' | 'LOCKED';
  updatedAt?: string;
}

export interface BranchMeetingMinute {
  id: string;
  branchId: string;
  branchName: string;
  month: string; // VD: "Tháng 09/2026"
  meetingDate: string; // "15/09/2026"
  topic: string; // Chủ đề sinh hoạt
  hostName: string; // Chủ trì
  secretaryName: string; // Thư ký cuộc họp
  attendeesCount: number;
  totalMembers: number;
  absentCount: number;
  absentReasons?: string;
  contentsSummary: string; // Tóm tắt nội dung sinh hoạt
  resolutions: string; // Nghị quyết / Kết luận cuộc họp
  votesPercent: number; // Tỷ lệ biểu quyết thống nhất (%)
  status: 'COMPLETED' | 'SCHEDULED';
  createdAt?: string;
}

export interface BranchYouthProject {
  id: string;
  branchId: string;
  branchName: string;
  title: string;
  category: 'BẢO VỆ MÔI TRƯỜNG' | 'CHUYỂN ĐỔI SỐ' | 'AN SINH XÃ HỘI' | 'VĂN HÓA VĂN NGHỆ' | 'KHỞI NGHIỆP';
  description: string;
  location: string;
  budgetVND: number;
  completionPercent: number; // 0 - 100
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED';
  startDate: string;
  endDate: string;
  leaderName: string;
  volunteerCount: number;
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

export interface TrainingHistoryItem {
  year: number;
  period: string; // VD: 'Năm 2024', 'Năm 2025', 'Năm 2026'
  score: number; // 0 - 100
  ranking: 'XUẤT SẮC' | 'KHÁ' | 'TRUNG BÌNH' | 'CHƯA XẾP LOẠI';
  evaluation: string;
  reviewer: string;
  reviewedAt: string;
}

export interface EmulationAwardItem {
  id: string;
  title: string; // Tên danh hiệu / Bằng khen / Giấy khen
  awardedBy: string; // Cấp khen thưởng (VD: BCH Đoàn Phường Chánh Hiệp, BCH Thành Đoàn TDM)
  level: 'CẤP PHƯỜNG' | 'CẤP THÀNH PHỐ' | 'CẤP TỈNH' | 'TRUNG ƯƠNG';
  decisionNumber: string; // Số QĐ: QĐ-12/QĐ-ĐTN
  awardedDate: string; // Ngày ký / khen thưởng
  category: 'DANH HIỆU' | 'GIẤY KHEN' | 'BẰNG KHEN' | 'KỶ NIỆM CHƯƠNG';
  note?: string;
}

export interface YouthMember {
  id: string;
  memberCode: string; // Mã số đoàn viên / Số thẻ đoàn
  fullName: string;
  gender: 'Nam' | 'Nữ';
  birthDate: string;
  branchId: string;
  branchName: string;
  position: 'Đoàn viên' | 'Bí thư Chi đoàn' | 'Phó Bí thư Chi đoàn' | 'Ủy viên BCH Chi đoàn' | 'Tổ trưởng Tổ thanh niên';
  joinedDate: string; // Ngày vào Đoàn
  joinedPlace: string; // Nơi kết nạp
  unionResolutionNumber?: string; // Số Nghị quyết kết nạp Đoàn
  recommender?: string; // Người giới thiệu vào Đoàn
  phone: string;
  email: string;
  address: string;
  educationLevel: string; // 12/12, Đại học, Cao đẳng, Thạc sĩ, Trung cấp
  profession: string; // Nghề nghiệp / Học vấn / Nơi công tác
  ethnic: string; // Dân tộc
  religion: string; // Tôn giáo
  status: 'ACTIVE' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'DEFERRED' | 'COMMENDED';
  unionDuesStatus: 'PAID' | 'UNPAID' | 'EXEMPT';
  unionBookStatus: 'DIGITAL_VERIFIED' | 'PENDING';
  avatarUrl?: string;
  skills: string[];
  emulationRanking: 'XUẤT SẮC' | 'KHÁ' | 'TRUNG BÌNH' | 'CHƯA XẾP LOẠI';
  partyTarget: boolean; // Cảm tình Đảng / Giới thiệu kết nạp Đảng
  partyTargetDate?: string; // Ngày được công nhận cảm tình Đảng
  partyStatus?: 'CHƯA' | 'CẢM TÌNH ĐẢNG' | 'ĐẢNG VIÊN DỰ BỊ' | 'ĐẢNG VIÊN CHÍNH THỨC';
  workGroupId?: string; // Nhóm công tác phụ trách
  workGroupName?: string; // Tên nhóm công tác
  workGroupRole?: 'TRƯỞNG NHÓM' | 'PHÓ NHÓM' | 'THÀNH VIÊN';
  trainingScore?: number; // Điểm rèn luyện đoàn viên (0 - 100)
  volunteerDays?: number; // Số ngày tình nguyện tham gia
  meetingAttendance?: number; // Số buổi sinh hoạt chi đoàn tham gia (trên 12)
  trainingHistory?: TrainingHistoryItem[]; // Lịch sử rèn luyện qua các năm
  emulationAwards?: EmulationAwardItem[]; // Danh hiệu thi đua và khen thưởng theo thời gian thực
  transferNotes?: string;
  notes?: string;
  updatedAt?: string;
}

export interface YouthWorkGroupTask {
  id: string;
  title: string;
  assignedDate: string;
  deadline: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  assignedMemberNames: string[];
  points: number; // Điểm cộng thi đua
  resultNote?: string;
}

export interface YouthWorkGroup {
  id: string;
  branchId: string; // Thuộc Chi đoàn nào (hoặc ALL)
  name: string;
  code: string;
  description: string;
  leaderId: string;
  leaderName: string;
  leaderPhone?: string;
  memberIds: string[];
  colorTheme: 'blue' | 'emerald' | 'purple' | 'amber' | 'indigo' | 'rose';
  targetTasksCount: number;
  completedTasksCount: number;
  emulationScore: number; // 0 - 100
  ranking: 'XUẤT SẮC' | 'TỐT' | 'KHÁ' | 'TRUNG BÌNH';
  tasks: YouthWorkGroupTask[];
  quarter: string;
  evaluationNotes?: string;
}

export interface YouthMemberTrainingRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberCode: string;
  branchId: string;
  year: number;
  workGroupId?: string;
  workGroupName?: string;
  // 5 Tiêu chí rèn luyện trọng tâm (Thang điểm 20/tiêu chí -> Tổng 100 điểm)
  ideologyScore: number; // 1. Lý tưởng cách mạng, nhận thức chính trị & học tập theo Bác (max 20)
  ethicsScore: number; // 2. Đạo đức, lối sống, tác phong & tính gương mẫu (max 20)
  studyLaborScore: number; // 3. Chuyên môn nghiệp vụ, học tập, lao động sáng tạo & Kỹ năng số (max 20)
  physicalSkillScore: number; // 4. Thể chất, văn hóa nghệ thuật & kỹ năng thực hành xã hội (max 20)
  disciplineVolunteerScore: number; // 5. Kỷ luật, sinh hoạt chi đoàn & hoạt động tình nguyện (max 20)
  totalScore: number; // 0 - 100
  // Chỉ số tham gia sinh hoạt & tình nguyện
  meetingAttendance: number; // Số buổi tham gia sinh hoạt chi đoàn (trên 12 buổi)
  monthlyAttendance: boolean[]; // 12 tháng [T1, T2, ..., T12]
  volunteerActivitiesCount: number; // Số lượt tham gia phong trào tình nguyện (Chủ nhật xanh, Tiếp sức mùa thi...)
  digitalSkillsCompleted: boolean; // Hoàn thành cài đặt VNeID / Công dân số / App Thanh niên Việt Nam
  trainingStatus: 'XUẤT SẮC' | 'KHÁ' | 'TRUNG BÌNH' | 'CHƯA ĐẠT';
  selfEvaluationComment: string; // Đoàn viên tự đánh giá
  branchEvaluationComment: string; // Chi đoàn nhận xét, thẩm định
  verifiedDate: string;
  verifiedBy: string; // Bí thư chi đoàn xác nhận
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
  {
    id: 'kp1',
    name: 'Chi đoàn Tương Bình Hiệp 1',
    type: 'DÂN CƯ',
    secretary: 'Nguyễn Bình Hiệp Một',
    phone: '0913.222.001',
    deputySecretary: 'Lý Kim Yến',
    executiveMembers: ['Trương Mỹ Linh'],
    term: '2025 - 2027',
    partyMembersInBranch: 3,
    youthGatheringRate: 83,
    meetingDay: 'Ngày 11 hàng tháng',
    threeInitiativesRating: 'XUẤT SẮC',
    address: 'Văn phòng BĐH KP Tương Bình Hiệp 1',
    establishedDate: '12/03/2014',
    membersCount: 31,
    selfScore: 70.0,
    officialScore: 68.0,
    submittedCount: 6,
    approvedCount: 5,
    status: 'ACTIVE'
  },
  {
    id: 'kp2',
    name: 'Chi đoàn Tương Bình Hiệp 2',
    type: 'DÂN CƯ',
    secretary: 'Lê Bình Hiệp Hai',
    phone: '0913.222.002',
    deputySecretary: 'Vũ Thu Trang',
    executiveMembers: ['Nguyễn Thành Trung'],
    term: '2025 - 2027',
    partyMembersInBranch: 2,
    youthGatheringRate: 74,
    meetingDay: 'Ngày 13 hàng tháng',
    threeInitiativesRating: 'ĐẠT CHUẨN',
    address: 'Văn phòng BĐH KP Tương Bình Hiệp 2',
    establishedDate: '12/03/2014',
    membersCount: 25,
    selfScore: 52.0,
    officialScore: 50.0,
    submittedCount: 4,
    approvedCount: 3,
    status: 'ACTIVE'
  },
  {
    id: 'kp3',
    name: 'Chi đoàn Tương Bình Hiệp 3',
    type: 'DÂN CƯ',
    secretary: 'Trần Bình Hiệp Ba',
    phone: '0913.222.003',
    deputySecretary: 'Đoàn Văn Chiến',
    executiveMembers: ['Lê Văn Quyết'],
    term: '2025 - 2027',
    partyMembersInBranch: 4,
    youthGatheringRate: 88,
    meetingDay: 'Ngày 16 hàng tháng',
    threeInitiativesRating: 'XUẤT SẮC',
    address: 'Văn phòng BĐH KP Tương Bình Hiệp 3',
    establishedDate: '12/03/2014',
    membersCount: 41,
    selfScore: 85.0,
    officialScore: 85.0,
    submittedCount: 9,
    approvedCount: 9,
    status: 'ACTIVE'
  },
  {
    id: 'kp4',
    name: 'Chi đoàn Tương Bình Hiệp 4',
    type: 'DÂN CƯ',
    secretary: 'Phạm Bình Hiệp Bốn',
    phone: '0913.222.004',
    deputySecretary: 'Đặng Mai Phương',
    executiveMembers: ['Lý Quốc Bảo'],
    term: '2025 - 2027',
    partyMembersInBranch: 2,
    youthGatheringRate: 69,
    meetingDay: 'Ngày 17 hàng tháng',
    threeInitiativesRating: 'ĐẠT CHUẨN',
    address: 'Văn phòng BĐH KP Tương Bình Hiệp 4',
    establishedDate: '12/03/2014',
    membersCount: 21,
    selfScore: 58.0,
    officialScore: 55.0,
    submittedCount: 5,
    approvedCount: 4,
    status: 'ACTIVE'
  },
  {
    id: 'kp5',
    name: 'Chi đoàn Tương Bình Hiệp 5',
    type: 'DÂN CƯ',
    secretary: 'Hoàng Bình Hiệp Năm',
    phone: '0913.222.005',
    deputySecretary: 'Bùi Thị Hà',
    executiveMembers: ['Phạm Quốc Cường'],
    term: '2025 - 2027',
    partyMembersInBranch: 1,
    youthGatheringRate: 60,
    meetingDay: 'Ngày 19 hàng tháng',
    threeInitiativesRating: 'CẦN CỐ GẮNG',
    address: 'Văn phòng BĐH KP Tương Bình Hiệp 5',
    establishedDate: '12/03/2014',
    membersCount: 18,
    selfScore: 42.0,
    officialScore: 40.0,
    submittedCount: 4,
    approvedCount: 3,
    status: 'ACTIVE'
  },
  {
    id: 'kp6',
    name: 'Chi đoàn Tương Bình Hiệp 6',
    type: 'DÂN CƯ',
    secretary: 'Ngô Bình Hiệp Sáu',
    phone: '0913.222.006',
    deputySecretary: 'Lê Thị Mai',
    executiveMembers: ['Vũ Đức Thành'],
    term: '2025 - 2027',
    partyMembersInBranch: 3,
    youthGatheringRate: 79,
    meetingDay: 'Ngày 21 hàng tháng',
    threeInitiativesRating: 'ĐẠT CHUẨN',
    address: 'Văn phòng BĐH KP Tương Bình Hiệp 6',
    establishedDate: '12/03/2014',
    membersCount: 29,
    selfScore: 62.0,
    officialScore: 60.0,
    submittedCount: 6,
    approvedCount: 5,
    status: 'ACTIVE'
  },
  {
    id: 'kp7',
    name: 'Chi đoàn Tương Bình Hiệp 7',
    type: 'DÂN CƯ',
    secretary: 'Đỗ Bình Hiệp Bảy',
    phone: '0913.222.007',
    deputySecretary: 'Trần Thị Thu Thảo',
    executiveMembers: ['Nguyễn Văn Tài'],
    term: '2025 - 2027',
    partyMembersInBranch: 4,
    youthGatheringRate: 81,
    meetingDay: 'Ngày 23 hàng tháng',
    threeInitiativesRating: 'XUẤT SẮC',
    address: 'Văn phòng BĐH KP Tương Bình Hiệp 7',
    establishedDate: '12/03/2014',
    membersCount: 33,
    selfScore: 74.0,
    officialScore: 72.0,
    submittedCount: 7,
    approvedCount: 6,
    status: 'ACTIVE'
  },
  {
    id: 'kp8',
    name: 'Chi đoàn Hiệp An 7',
    type: 'DÂN CƯ',
    secretary: 'Vũ Hiệp An Bảy',
    phone: '0914.333.007',
    deputySecretary: 'Phan Thị Thủy',
    executiveMembers: ['Võ Thanh Tùng'],
    term: '2025 - 2027',
    partyMembersInBranch: 2,
    youthGatheringRate: 72,
    meetingDay: 'Ngày 24 hàng tháng',
    threeInitiativesRating: 'ĐẠT CHUẨN',
    address: 'Văn phòng BĐH KP Hiệp An 7',
    establishedDate: '10/11/2015',
    membersCount: 24,
    selfScore: 56.0,
    officialScore: 54.0,
    submittedCount: 5,
    approvedCount: 4,
    status: 'ACTIVE'
  },
  {
    id: 'kp9',
    name: 'Chi đoàn Hiệp An 8',
    type: 'DÂN CƯ',
    secretary: 'Trịnh Hiệp An Tám',
    phone: '0914.333.008',
    deputySecretary: 'Trần Văn Kiên',
    executiveMembers: ['Nguyễn Thị Hồng'],
    term: '2025 - 2027',
    partyMembersInBranch: 3,
    youthGatheringRate: 78,
    meetingDay: 'Ngày 26 hàng tháng',
    threeInitiativesRating: 'ĐẠT CHUẨN',
    address: 'Văn phòng BĐH KP Hiệp An 8',
    establishedDate: '10/11/2015',
    membersCount: 27,
    selfScore: 61.0,
    officialScore: 60.0,
    submittedCount: 6,
    approvedCount: 5,
    status: 'ACTIVE'
  },
  {
    id: 'kp10',
    name: 'Chi đoàn Hiệp An 9',
    type: 'DÂN CƯ',
    secretary: 'Bùi Hiệp An Chín',
    phone: '0914.333.009',
    deputySecretary: 'Trần Thị Lan',
    executiveMembers: ['Bùi Quốc Huy'],
    term: '2025 - 2027',
    partyMembersInBranch: 4,
    youthGatheringRate: 84,
    meetingDay: 'Ngày 27 hàng tháng',
    threeInitiativesRating: 'XUẤT SẮC',
    address: 'Văn phòng BĐH KP Hiệp An 9',
    establishedDate: '10/11/2015',
    membersCount: 31,
    selfScore: 79.0,
    officialScore: 78.0,
    submittedCount: 7,
    approvedCount: 7,
    status: 'ACTIVE'
  },
  {
    id: 'kp11',
    name: 'Chi đoàn Định Hòa 1',
    type: 'DÂN CƯ',
    secretary: 'Trần Định Hòa Một',
    phone: '0912.111.001',
    deputySecretary: 'Nguyễn Văn Định',
    executiveMembers: ['Trần Thu Trang'],
    term: '2025 - 2027',
    partyMembersInBranch: 3,
    youthGatheringRate: 78,
    meetingDay: 'Ngày 12 hàng tháng',
    threeInitiativesRating: 'XUẤT SẮC',
    address: 'Văn phòng BĐH KP Định Hòa 1',
    establishedDate: '15/01/2012',
    membersCount: 28,
    selfScore: 65.0,
    officialScore: 65.0,
    submittedCount: 2,
    approvedCount: 2,
    status: 'ACTIVE'
  },
  {
    id: 'kp12',
    name: 'Chi đoàn Định Hòa 2',
    type: 'DÂN CƯ',
    secretary: 'Nguyễn Định Hòa Hai',
    phone: '0912.111.002',
    deputySecretary: 'Phạm Thanh Thảo',
    executiveMembers: ['Lê Văn Tài'],
    term: '2025 - 2027',
    partyMembersInBranch: 2,
    youthGatheringRate: 75,
    meetingDay: 'Ngày 15 hàng tháng',
    threeInitiativesRating: 'ĐẠT CHUẨN',
    address: 'Văn phòng BĐH KP Định Hòa 2',
    establishedDate: '15/01/2012',
    membersCount: 22,
    selfScore: 48.0,
    officialScore: 45.0,
    submittedCount: 3,
    approvedCount: 2,
    status: 'ACTIVE'
  },
  {
    id: 'kp13',
    name: 'Chi đoàn Định Hòa 3',
    type: 'DÂN CƯ',
    secretary: 'Lê Định Hòa Ba',
    phone: '0912.111.003',
    deputySecretary: 'Đặng Kim Oanh',
    executiveMembers: ['Ngô Chí Thành'],
    term: '2025 - 2027',
    partyMembersInBranch: 2,
    youthGatheringRate: 70,
    meetingDay: 'Ngày 10 hàng tháng',
    threeInitiativesRating: 'ĐẠT CHUẨN',
    address: 'Văn phòng BĐH KP Định Hòa 3',
    establishedDate: '15/01/2012',
    membersCount: 19,
    selfScore: 50.0,
    officialScore: 50.0,
    submittedCount: 4,
    approvedCount: 4,
    status: 'ACTIVE'
  },
  {
    id: 'kp14',
    name: 'Chi đoàn Định Hòa 4',
    type: 'DÂN CƯ',
    secretary: 'Phạm Định Hòa Bốn',
    phone: '0912.111.004',
    deputySecretary: 'Trịnh Quốc Bảo',
    executiveMembers: ['Bùi Thu Hương'],
    term: '2025 - 2027',
    partyMembersInBranch: 4,
    youthGatheringRate: 85,
    meetingDay: 'Ngày 14 hàng tháng',
    threeInitiativesRating: 'XUẤT SẮC',
    address: 'Văn phòng BĐH KP Định Hòa 4',
    establishedDate: '15/01/2012',
    membersCount: 35,
    selfScore: 82.0,
    officialScore: 80.0,
    submittedCount: 8,
    approvedCount: 7,
    status: 'ACTIVE'
  },
  {
    id: 'kp15',
    name: 'Chi đoàn Định Hòa 5',
    type: 'DÂN CƯ',
    secretary: 'Hoàng Định Hòa Năm',
    phone: '0912.111.005',
    deputySecretary: 'Lê Hải Đăng',
    executiveMembers: ['Trần Hoàng Long'],
    term: '2025 - 2027',
    partyMembersInBranch: 3,
    youthGatheringRate: 72,
    meetingDay: 'Ngày 18 hàng tháng',
    threeInitiativesRating: 'ĐẠT CHUẨN',
    address: 'Văn phòng BĐH KP Định Hòa 5',
    establishedDate: '15/01/2012',
    membersCount: 24,
    selfScore: 55.0,
    officialScore: 52.0,
    submittedCount: 5,
    approvedCount: 4,
    status: 'ACTIVE'
  },
  {
    id: 'kp16',
    name: 'Chi đoàn Định Hòa 6',
    type: 'DÂN CƯ',
    secretary: 'Ngô Định Hòa Sáu',
    phone: '0912.111.006',
    deputySecretary: 'Vũ Minh Thư',
    executiveMembers: ['Phạm Tuấn Anh'],
    term: '2025 - 2027',
    partyMembersInBranch: 1,
    youthGatheringRate: 65,
    meetingDay: 'Ngày 20 hàng tháng',
    threeInitiativesRating: 'CẦN CỐ GẮNG',
    address: 'Văn phòng BĐH KP Định Hòa 6',
    establishedDate: '15/01/2012',
    membersCount: 15,
    selfScore: 38.0,
    officialScore: 35.0,
    submittedCount: 3,
    approvedCount: 2,
    status: 'ACTIVE'
  },
  {
    id: 'kp17',
    name: 'Chi đoàn Định Hòa 7',
    type: 'DÂN CƯ',
    secretary: 'Vũ Định Hòa Bảy',
    phone: '0912.111.007',
    deputySecretary: 'Hoàng Văn Khải',
    executiveMembers: ['Võ Hoài Nam'],
    term: '2025 - 2027',
    partyMembersInBranch: 3,
    youthGatheringRate: 76,
    meetingDay: 'Ngày 22 hàng tháng',
    threeInitiativesRating: 'ĐẠT CHUẨN',
    address: 'Văn phòng BĐH KP Định Hòa 7',
    establishedDate: '15/01/2012',
    membersCount: 26,
    selfScore: 60.0,
    officialScore: 58.0,
    submittedCount: 6,
    approvedCount: 5,
    status: 'ACTIVE'
  },
  {
    id: 'kp18',
    name: 'Chi đoàn Định Hòa 8',
    type: 'DÂN CƯ',
    secretary: 'Trịnh Định Hòa Tám',
    phone: '0912.111.008',
    deputySecretary: 'Đỗ Tiến Dũng',
    executiveMembers: ['Trương Ngọc Ánh'],
    term: '2025 - 2027',
    partyMembersInBranch: 2,
    youthGatheringRate: 80,
    meetingDay: 'Ngày 08 hàng tháng',
    threeInitiativesRating: 'XUẤT SẮC',
    address: 'Văn phòng BĐH KP Định Hòa 8',
    establishedDate: '15/01/2012',
    membersCount: 30,
    selfScore: 78.0,
    officialScore: 78.0,
    submittedCount: 7,
    approvedCount: 7,
    status: 'ACTIVE'
  },
  {
    id: 'kp19',
    name: 'Chi đoàn Mỹ Hảo',
    type: 'DÂN CƯ',
    secretary: 'Đặng Mỹ Hảo',
    phone: '0916.555.001',
    deputySecretary: 'Trần Thu Hương',
    executiveMembers: ['Võ Hoài Nam'],
    term: '2025 - 2027',
    partyMembersInBranch: 2,
    youthGatheringRate: 71,
    meetingDay: 'Ngày 19 hàng tháng',
    threeInitiativesRating: 'ĐẠT CHUẨN',
    address: 'Văn phòng khu phố Mỹ Hảo',
    establishedDate: '26/03/2016',
    membersCount: 20,
    selfScore: 54.0,
    officialScore: 52.0,
    submittedCount: 4,
    approvedCount: 3,
    status: 'ACTIVE'
  },
  {
    id: 'kp20',
    name: 'Chi đoàn Chánh Mỹ 1',
    type: 'DÂN CƯ',
    secretary: 'Phan Chánh Mỹ Một',
    phone: '0915.444.001',
    deputySecretary: 'Nguyễn Bích Ngọc',
    executiveMembers: ['Phan Anh Vũ'],
    term: '2025 - 2027',
    partyMembersInBranch: 2,
    youthGatheringRate: 73,
    meetingDay: 'Ngày 15 hàng tháng',
    threeInitiativesRating: 'ĐẠT CHUẨN',
    address: 'Văn phòng BĐH KP Chánh Mỹ 1',
    establishedDate: '01/06/2013',
    membersCount: 23,
    selfScore: 58.0,
    officialScore: 58.0,
    submittedCount: 5,
    approvedCount: 5,
    status: 'ACTIVE'
  },
  {
    id: 'kp21',
    name: 'Chi đoàn Chánh Mỹ 2',
    type: 'DÂN CƯ',
    secretary: 'Võ Chánh Mỹ Hai',
    phone: '0915.444.002',
    deputySecretary: 'Đặng Mai Phương',
    executiveMembers: ['Lý Quốc Bảo'],
    term: '2025 - 2027',
    partyMembersInBranch: 3,
    youthGatheringRate: 80,
    meetingDay: 'Ngày 17 hàng tháng',
    threeInitiativesRating: 'XUẤT SẮC',
    address: 'Văn phòng BĐH KP Chánh Mỹ 2',
    establishedDate: '01/06/2013',
    membersCount: 28,
    selfScore: 72.0,
    officialScore: 70.0,
    submittedCount: 6,
    approvedCount: 5,
    status: 'ACTIVE'
  }
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
  { id: 'acc_kp1', branchId: 'kp1', branchName: 'Chi đoàn Tương Bình Hiệp 1', username: 'cd_tuongbinhhiep1', passwordMasked: '••••••••', fullName: 'Nguyễn Bình Hiệp Một', position: 'Bí thư Chi đoàn', phone: '0913.222.001', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '23/09/2026 18:45' },
  { id: 'acc_kp2', branchId: 'kp2', branchName: 'Chi đoàn Tương Bình Hiệp 2', username: 'cd_tuongbinhhiep2', passwordMasked: '••••••••', fullName: 'Lê Bình Hiệp Hai', position: 'Bí thư Chi đoàn', phone: '0913.222.002', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '23/09/2026 18:45' },
  { id: 'acc_kp3', branchId: 'kp3', branchName: 'Chi đoàn Tương Bình Hiệp 3', username: 'cd_tuongbinhhiep3', passwordMasked: '••••••••', fullName: 'Trần Bình Hiệp Ba', position: 'Bí thư Chi đoàn', phone: '0913.222.003', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '23/09/2026 18:45' },
  { id: 'acc_kp4', branchId: 'kp4', branchName: 'Chi đoàn Tương Bình Hiệp 4', username: 'cd_tuongbinhhiep4', passwordMasked: '••••••••', fullName: 'Phạm Bình Hiệp Bốn', position: 'Bí thư Chi đoàn', phone: '0913.222.004', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '23/09/2026 18:45' },
  { id: 'acc_kp5', branchId: 'kp5', branchName: 'Chi đoàn Tương Bình Hiệp 5', username: 'cd_tuongbinhhiep5', passwordMasked: '••••••••', fullName: 'Hoàng Bình Hiệp Năm', position: 'Bí thư Chi đoàn', phone: '0913.222.005', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '23/09/2026 18:45' },
  { id: 'acc_kp6', branchId: 'kp6', branchName: 'Chi đoàn Tương Bình Hiệp 6', username: 'cd_tuongbinhhiep6', passwordMasked: '••••••••', fullName: 'Ngô Bình Hiệp Sáu', position: 'Bí thư Chi đoàn', phone: '0913.222.006', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '23/09/2026 18:45' },
  { id: 'acc_kp7', branchId: 'kp7', branchName: 'Chi đoàn Tương Bình Hiệp 7', username: 'cd_tuongbinhhiep7', passwordMasked: '••••••••', fullName: 'Đỗ Bình Hiệp Bảy', position: 'Bí thư Chi đoàn', phone: '0913.222.007', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '23/09/2026 18:45' },
  { id: 'acc_kp8', branchId: 'kp8', branchName: 'Chi đoàn Hiệp An 7', username: 'cd_hiepan7', passwordMasked: '••••••••', fullName: 'Vũ Hiệp An Bảy', position: 'Bí thư Chi đoàn', phone: '0914.333.007', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '23/09/2026 18:45' },
  { id: 'acc_kp9', branchId: 'kp9', branchName: 'Chi đoàn Hiệp An 8', username: 'cd_hiepan8', passwordMasked: '••••••••', fullName: 'Trịnh Hiệp An Tám', position: 'Bí thư Chi đoàn', phone: '0914.333.008', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '23/09/2026 18:45' },
  { id: 'acc_kp10', branchId: 'kp10', branchName: 'Chi đoàn Hiệp An 9', username: 'cd_hiepan9', passwordMasked: '••••••••', fullName: 'Bùi Hiệp An Chín', position: 'Bí thư Chi đoàn', phone: '0914.333.009', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '23/09/2026 18:45' },
  { id: 'acc_kp11', branchId: 'kp11', branchName: 'Chi đoàn Định Hòa 1', username: 'cd_dinhhoa1', passwordMasked: '••••••••', fullName: 'Trần Định Hòa Một', position: 'Bí thư Chi đoàn', phone: '0912.111.001', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '23/09/2026 18:45' },
  { id: 'acc_kp12', branchId: 'kp12', branchName: 'Chi đoàn Định Hòa 2', username: 'cd_dinhhoa2', passwordMasked: '••••••••', fullName: 'Nguyễn Định Hòa Hai', position: 'Bí thư Chi đoàn', phone: '0912.111.002', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '23/09/2026 18:45' },
  { id: 'acc_kp13', branchId: 'kp13', branchName: 'Chi đoàn Định Hòa 3', username: 'cd_dinhhoa3', passwordMasked: '••••••••', fullName: 'Lê Định Hòa Ba', position: 'Bí thư Chi đoàn', phone: '0912.111.003', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '23/09/2026 18:45' },
  { id: 'acc_kp14', branchId: 'kp14', branchName: 'Chi đoàn Định Hòa 4', username: 'cd_dinhhoa4', passwordMasked: '••••••••', fullName: 'Phạm Định Hòa Bốn', position: 'Bí thư Chi đoàn', phone: '0912.111.004', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '23/09/2026 18:45' },
  { id: 'acc_kp15', branchId: 'kp15', branchName: 'Chi đoàn Định Hòa 5', username: 'cd_dinhhoa5', passwordMasked: '••••••••', fullName: 'Hoàng Định Hòa Năm', position: 'Bí thư Chi đoàn', phone: '0912.111.005', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '23/09/2026 18:45' },
  { id: 'acc_kp16', branchId: 'kp16', branchName: 'Chi đoàn Định Hòa 6', username: 'cd_dinhhoa6', passwordMasked: '••••••••', fullName: 'Ngô Định Hòa Sáu', position: 'Bí thư Chi đoàn', phone: '0912.111.006', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '23/09/2026 18:45' },
  { id: 'acc_kp17', branchId: 'kp17', branchName: 'Chi đoàn Định Hòa 7', username: 'cd_dinhhoa7', passwordMasked: '••••••••', fullName: 'Vũ Định Hòa Bảy', position: 'Bí thư Chi đoàn', phone: '0912.111.007', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '23/09/2026 18:45' },
  { id: 'acc_kp18', branchId: 'kp18', branchName: 'Chi đoàn Định Hòa 8', username: 'cd_dinhhoa8', passwordMasked: '••••••••', fullName: 'Trịnh Định Hòa Tám', position: 'Bí thư Chi đoàn', phone: '0912.111.008', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '23/09/2026 18:45' },
  { id: 'acc_kp19', branchId: 'kp19', branchName: 'Chi đoàn Mỹ Hảo', username: 'cd_myhao', passwordMasked: '••••••••', fullName: 'Đặng Mỹ Hảo', position: 'Bí thư Chi đoàn', phone: '0916.555.001', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '23/09/2026 18:45' },
  { id: 'acc_kp20', branchId: 'kp20', branchName: 'Chi đoàn Chánh Mỹ 1', username: 'cd_chanhmy1', passwordMasked: '••••••••', fullName: 'Phan Chánh Mỹ Một', position: 'Bí thư Chi đoàn', phone: '0915.444.001', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '23/09/2026 18:45' },
  { id: 'acc_kp21', branchId: 'kp21', branchName: 'Chi đoàn Chánh Mỹ 2', username: 'cd_chanhmy2', passwordMasked: '••••••••', fullName: 'Võ Chánh Mỹ Hai', position: 'Bí thư Chi đoàn', phone: '0915.444.002', status: 'ACTIVE', createdAt: '01/01/2026', lastLogin: '23/09/2026 18:45' }
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
const KEY_MEETING_MINUTES = 'youth_union_meeting_minutes';
const KEY_YOUTH_PROJECTS = 'youth_union_youth_projects';

const EVENT_UPDATE = 'youth_union_data_updated';

export const INITIAL_MEETING_MINUTES: BranchMeetingMinute[] = [
  {
    id: 'mm_001',
    branchId: 'kp1',
    branchName: 'Chi đoàn Khu phố 1',
    month: 'Tháng 09/2026',
    meetingDate: '12/09/2026',
    topic: 'Sinh hoạt Chi đoàn chủ điểm: "Tuổi trẻ Chánh Hiệp tự hào tiến bước dưới cờ Đảng"',
    hostName: 'Trần Thị Bích',
    secretaryName: 'Phạm Thu Trang',
    attendeesCount: 36,
    totalMembers: 38,
    absentCount: 2,
    absentReasons: '02 ĐV đi học ca tối có đơn xin phép',
    contentsSummary: '1. Thông tin thời sự trong nước và tình hình địa phương tháng 9/2026.\n2. Đánh giá kết quả tham gia Chiến dịch Mùa Hè Xanh và hoạt động chăm lo Trung thu cho thiếu nhi.\n3. Triển khai kế hoạch ra quân Ngày Chủ Nhật Xanh và dọn dẹp vệ sinh tuyến hẻm văn minh.\n4. Bình xét 02 đoàn viên ưu tú giới thiệu học lớp Cảm tình Đảng đợt 2/2026.',
    resolutions: '100% đoàn viên biểu quyết thông qua nghị quyết công tác tháng 10/2026. Phân công đồng chí Tâm phụ trách tổ chức ngày hội thiếu nhi.',
    votesPercent: 100,
    status: 'COMPLETED',
    createdAt: '12/09/2026 21:00'
  },
  {
    id: 'mm_002',
    branchId: 'kp2',
    branchName: 'Chi đoàn Khu phố 2',
    month: 'Tháng 09/2026',
    meetingDate: '15/09/2026',
    topic: 'Chuyên đề: Nâng cao kỹ năng số và ứng dụng VNeID trong đời sống cộng đồng',
    hostName: 'Lê Văn Nam',
    secretaryName: 'Trịnh Kim Oanh',
    attendeesCount: 40,
    totalMembers: 42,
    absentCount: 2,
    absentReasons: '02 ĐV tăng ca đột xuất',
    contentsSummary: '1. Quán triệt công tác rà soát dữ liệu đoàn viên trên App Thanh niên Việt Nam.\n2. Phân công 10 ĐV tham gia hỗ trợ người dân kích hoạt tài khoản định danh điện tử.\n3. Thu nộp đoàn phí Quý III/2026 đạt 100%.',
    resolutions: 'Thống nhất đảm nhận tuyến đường chuyển đổi số không dùng tiền mặt tại khu phố 2.',
    votesPercent: 98,
    status: 'COMPLETED',
    createdAt: '15/09/2026 20:30'
  },
  {
    id: 'mm_003',
    branchId: 'thcs',
    branchName: 'Chi đoàn Trường THCS Chánh Hiệp',
    month: 'Tháng 09/2026',
    meetingDate: '10/09/2026',
    topic: 'Triển khai nhiệm vụ công tác Đoàn - Đội năm học mới 2026 - 2027',
    hostName: 'Nguyễn Thị Thu Hà',
    secretaryName: 'Trần Văn Kiên',
    attendeesCount: 45,
    totalMembers: 45,
    absentCount: 0,
    absentReasons: 'Không vắng',
    contentsSummary: '1. Phân công giáo viên trẻ phụ trách các Chi đội và phong trào Đội TNTP Hồ Chí Minh.\n2. Phát động phong trào "Tiết kiệm nuôi heo đất giúp bạn đến trường".\n3. Lên lịch tập huấn công tác phòng chống tai nạn thương tích và bạo lực học đường.',
    resolutions: 'Đăng ký 100% đoàn viên giáo viên đạt danh hiệu Đoàn viên xuất sắc và Chi đoàn vững mạnh tiêu biểu.',
    votesPercent: 100,
    status: 'COMPLETED',
    createdAt: '10/09/2026 17:30'
  }
];

export const INITIAL_YOUTH_PROJECTS: BranchYouthProject[] = [
  {
    id: 'yp_001',
    branchId: 'kp1',
    branchName: 'Chi đoàn Khu phố 1',
    title: 'Công trình bích họa "Tuyến hẻm văn minh không rác thải"',
    category: 'BẢO VỆ MÔI TRƯỜNG',
    description: 'Vẽ tranh bích họa tuyên truyền bảo vệ môi trường, lắp đặt 15 thùng rác phân loại và hệ thống chiếu sáng năng lượng mặt trời dài 150m.',
    location: 'Tổ 3, Khu phố 1, Phường Chánh Hiệp',
    budgetVND: 18500000,
    completionPercent: 100,
    status: 'COMPLETED',
    startDate: '01/06/2026',
    endDate: '15/08/2026',
    leaderName: 'Trần Thị Bích',
    volunteerCount: 25
  },
  {
    id: 'yp_002',
    branchId: 'kp6',
    branchName: 'Chi đoàn Khu phố 6',
    title: 'Tổ tư vấn pháp luật & Số hóa thủ tục hành chính miễn phí cho thanh niên công nhân',
    category: 'CHUYỂN ĐỔI SỐ',
    description: 'Tổ chức định kỳ thứ 7 hàng tuần hỗ trợ thanh niên công nhân tại các khu nhà trọ khai báo tạm trú, làm CCCD gắn chip và hỗ trợ bảo hiểm y tế.',
    location: 'Nhà văn hóa Khu phố 6, Phường Chánh Hiệp',
    budgetVND: 8000000,
    completionPercent: 85,
    status: 'IN_PROGRESS',
    startDate: '10/03/2026',
    endDate: '30/11/2026',
    leaderName: 'Đặng Mai Phương',
    volunteerCount: 18
  },
  {
    id: 'yp_003',
    branchId: 'thcs',
    branchName: 'Chi đoàn Trường THCS Chánh Hiệp',
    title: 'Thư viện số xanh và Góc đọc sách thông minh cho học sinh',
    category: 'CHUYỂN ĐỔI SỐ',
    description: 'Trang bị 5 máy tính bảng tra cứu sách trực tuyến, mã QR kho sách thiếu nhi và không gian đọc sách thân thiện ngoài trời.',
    location: 'Khuôn viên Trường THCS Chánh Hiệp',
    budgetVND: 22000000,
    completionPercent: 90,
    status: 'IN_PROGRESS',
    startDate: '01/07/2026',
    endDate: '20/10/2026',
    leaderName: 'Nguyễn Thị Thu Hà',
    volunteerCount: 30
  },
  {
    id: 'yp_004',
    branchId: 'ca',
    branchName: 'Chi đoàn Công an Phường Chánh Hiệp',
    title: 'Mô hình "Camera an ninh & Mã QR tố giác tội phạm tại khu dân cư"',
    category: 'CHUYỂN ĐỔI SỐ',
    description: 'Lắp đặt 10 điểm tiếp nhận thông tin phản ánh qua mã QR và hỗ trợ số hóa hệ thống camera an ninh các tuyến đường trọng điểm.',
    location: '10 Khu phố trên địa bàn Phường Chánh Hiệp',
    budgetVND: 35000000,
    completionPercent: 100,
    status: 'COMPLETED',
    startDate: '01/01/2026',
    endDate: '19/08/2026',
    leaderName: 'Nguyễn Minh Hải',
    volunteerCount: 22
  }
];

export const loadStoredMeetingMinutes = (): BranchMeetingMinute[] => {
  try {
    const raw = localStorage.getItem(KEY_MEETING_MINUTES);
    if (!raw) return INITIAL_MEETING_MINUTES;
    return JSON.parse(raw);
  } catch {
    return INITIAL_MEETING_MINUTES;
  }
};

export const saveStoredMeetingMinutes = (items: BranchMeetingMinute[]) => {
  localStorage.setItem(KEY_MEETING_MINUTES, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT_UPDATE, { detail: { type: 'meeting_minutes' } }));
};

export const loadStoredYouthProjects = (): BranchYouthProject[] => {
  try {
    const raw = localStorage.getItem(KEY_YOUTH_PROJECTS);
    if (!raw) return INITIAL_YOUTH_PROJECTS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_YOUTH_PROJECTS;
  }
};

export const saveStoredYouthProjects = (items: BranchYouthProject[]) => {
  localStorage.setItem(KEY_YOUTH_PROJECTS, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT_UPDATE, { detail: { type: 'youth_projects' } }));
};

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

export const getOfficialBranchName = (oldName: string): string => {
  return oldName.trim();
};

export const loadStoredBranches = (): BranchInfo[] => {
  try {
    const raw = localStorage.getItem(KEY_BRANCHES);
    let branches = INITIAL_BRANCHES;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === 21) {
        // If cached branches contain legacy IDs or legacy names, clear cache to restore clean standard names and IDs
        const hasLegacyIdsOrNames = parsed.some(b => b.id === 'dh1' || b.id === 'tbh1' || b.id === 'ha7' || b.name.includes('Khu phố 11') || b.name.includes('Định Hòa 1 (Chánh Hiệp)'));
        if (hasLegacyIdsOrNames) {
          localStorage.setItem(KEY_BRANCHES, JSON.stringify(INITIAL_BRANCHES));
          return INITIAL_BRANCHES;
        }
        branches = parsed;
      } else {
        localStorage.setItem(KEY_BRANCHES, JSON.stringify(INITIAL_BRANCHES));
        return INITIAL_BRANCHES;
      }
    } else {
      localStorage.setItem(KEY_BRANCHES, JSON.stringify(INITIAL_BRANCHES));
    }
    
    return branches.map((b: BranchInfo) => ({
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
    let accounts = INITIAL_ACCOUNTS;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === 21) {
        // If cached accounts contain legacy branch IDs or legacy names, clear cache to restore clean standard names and IDs
        const hasLegacyIdsOrNames = parsed.some(a => a.branchId === 'dh1' || a.branchId === 'tbh1' || a.branchId === 'ha7' || a.branchName.includes('Khu phố 11') || a.branchName.includes('Định Hòa 1 (Chánh Hiệp)'));
        if (hasLegacyIdsOrNames) {
          localStorage.setItem(KEY_ACCOUNTS, JSON.stringify(INITIAL_ACCOUNTS));
          return INITIAL_ACCOUNTS;
        }
        accounts = parsed;
      } else {
        localStorage.setItem(KEY_ACCOUNTS, JSON.stringify(INITIAL_ACCOUNTS));
        return INITIAL_ACCOUNTS;
      }
    } else {
      localStorage.setItem(KEY_ACCOUNTS, JSON.stringify(INITIAL_ACCOUNTS));
    }
    
    return accounts.map((a: BranchAccount) => ({
      ...a,
      branchName: a.branchName.replace(/Phú Lợi/g, 'Chánh Hiệp')
    }));
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

export const KEY_YOUTH_MEMBERS = 'youth_union_members_v2026';
export const KEY_WORK_GROUPS = 'youth_union_work_groups_v1';
export const KEY_TRAINING_RECORDS = 'youth_union_training_records_v1';

export const INITIAL_WORK_GROUPS: YouthWorkGroup[] = [
  {
    id: 'wg_001',
    branchId: 'kp1',
    name: 'Tổ Công nghệ số cộng đồng & Dịch vụ công',
    code: 'TỔ-CNS-01',
    description: 'Hướng dẫn người dân kích hoạt VNeID mức 2, chữ ký số cá nhân, nộp hồ sơ dịch vụ công trực tuyến và thanh toán không tiền mặt.',
    leaderId: 'ym_002',
    leaderName: 'Nguyễn Thành Nam',
    leaderPhone: '0938.112.445',
    memberIds: ['ym_002', 'ym_001', 'ym_013', 'ym_014'],
    colorTheme: 'blue',
    targetTasksCount: 6,
    completedTasksCount: 5,
    emulationScore: 96,
    ranking: 'XUẤT SẮC',
    quarter: 'Quý III/2026',
    tasks: [
      { id: 'ts_1', title: 'Ra quân hỗ trợ cấp chữ ký số công dân tại Văn phòng BĐH KP1', assignedDate: '05/09/2026', deadline: '10/09/2026', status: 'COMPLETED', assignedMemberNames: ['Nguyễn Thành Nam', 'Trần Thị Bích'], points: 20, resultNote: 'Cấp thành công 125 chữ ký số cá nhân cho thanh niên và người dân.' },
      { id: 'ts_2', title: 'Tạo mã QR tra cứu thông tin thủ tục hành chính khu phố', assignedDate: '12/09/2026', deadline: '18/09/2026', status: 'COMPLETED', assignedMemberNames: ['Nguyễn Thành Nam'], points: 15, resultNote: 'Đặt 4 điểm bảng quét mã QR tại các nhà sinh hoạt cộng đồng.' },
      { id: 'ts_3', title: 'Hướng dẫn tiểu thương chợ Chánh Hiệp cài đặt mã QR thanh toán', assignedDate: '20/09/2026', deadline: '28/09/2026', status: 'IN_PROGRESS', assignedMemberNames: ['Nguyễn Thành Nam', 'Phạm Thu Trang'], points: 25 },
      { id: 'ts_4', title: 'Tập huấn kỹ năng an toàn thông tin & phòng chống lừa đảo mạng', assignedDate: '15/08/2026', deadline: '22/08/2026', status: 'COMPLETED', assignedMemberNames: ['Nguyễn Thành Nam', 'Lê Hữu Đạt'], points: 20, resultNote: 'Có 45 đoàn viên thanh niên tham gia tập huấn.' }
    ],
    evaluationNotes: 'Hoạt động nổi bật, dẫn đầu khối thi đua chuyển đổi số cấp chi đoàn.'
  },
  {
    id: 'wg_002',
    branchId: 'kp1',
    name: 'Đội Tình nguyện Xung kích Môi trường & Đô thị văn minh',
    code: 'ĐỘI-TNMT-02',
    description: 'Ra quân Ngày Chủ nhật xanh, xóa bảng quảng cáo sai quy định, phân loại rác tại nguồn và duy trì tuyến hẻm thanh niên tự quản.',
    leaderId: 'ym_013',
    leaderName: 'Phạm Thu Trang',
    leaderPhone: '0979.223.344',
    memberIds: ['ym_013', 'ym_016', 'ym_017'],
    colorTheme: 'emerald',
    targetTasksCount: 5,
    completedTasksCount: 4,
    emulationScore: 92,
    ranking: 'XUẤT SẮC',
    quarter: 'Quý III/2026',
    tasks: [
      { id: 'ts_5', title: 'Ra quân Ngày Chủ nhật xanh lần 3 dọn vệ sinh tuyến kênh rạch KP1', assignedDate: '01/09/2026', deadline: '06/09/2026', status: 'COMPLETED', assignedMemberNames: ['Phạm Thu Trang', 'Đặng Quốc Bảo'], points: 25, resultNote: 'Thu gom hơn 350kg rác thải nhựa và khơi thông dòng chảy.' },
      { id: 'ts_6', title: 'Bóc xóa 150 biển quảng cáo rao vặt trái phép trên cột điện', assignedDate: '10/09/2026', deadline: '14/09/2026', status: 'COMPLETED', assignedMemberNames: ['Phạm Thu Trang', 'Hoàng Kim Ngân'], points: 20, resultNote: 'Chỉnh trang sạch sẽ 3 tuyến hẻm chính.' },
      { id: 'ts_7', title: 'Trồng và chăm sóc 50 cây hoàng yến tạo cảnh quan tuyến hẻm 42', assignedDate: '18/09/2026', deadline: '30/09/2026', status: 'IN_PROGRESS', assignedMemberNames: ['Phạm Thu Trang'], points: 25 }
    ],
    evaluationNotes: 'Lực lượng nòng cốt trong các phong trào xung kích vì môi trường của địa bàn.'
  },
  {
    id: 'wg_003',
    branchId: 'kp1',
    name: 'Tổ An sinh Xã hội & Đền ơn đáp nghĩa',
    code: 'TỔ-ASXH-03',
    description: 'Thăm hỏi gia đình chính sách, người có công, chăm lo học bổng cho thiếu nhi có hoàn cảnh khó khăn và tham gia ngày hội hiến máu tình nguyện.',
    leaderId: 'ym_014',
    leaderName: 'Lê Hữu Đạt',
    leaderPhone: '0918.776.889',
    memberIds: ['ym_014', 'ym_017', 'ym_001'],
    colorTheme: 'rose',
    targetTasksCount: 4,
    completedTasksCount: 4,
    emulationScore: 95,
    ranking: 'XUẤT SẮC',
    quarter: 'Quý III/2026',
    tasks: [
      { id: 'ts_8', title: 'Thăm và tặng quà 5 gia đình chính sách nhân dịp lễ kỷ niệm', assignedDate: '25/08/2026', deadline: '01/09/2026', status: 'COMPLETED', assignedMemberNames: ['Lê Hữu Đạt', 'Trần Thị Bích'], points: 25, resultNote: 'Trao 5 phần quà trị giá 2.500.000đ từ nguồn vận động.' },
      { id: 'ts_9', title: 'Tổ chức vận động đoàn viên tham gia Ngày hội Giọt hồng Chánh Hiệp', assignedDate: '08/09/2026', deadline: '15/09/2026', status: 'COMPLETED', assignedMemberNames: ['Lê Hữu Đạt'], points: 30, resultNote: 'Có 14 đoàn viên tham gia hiến máu thành công.' }
    ],
    evaluationNotes: 'Gắn kết chặt chẽ với công tác an sinh xã hội địa phương, tinh thần tương thân tương ái cao.'
  },
  {
    id: 'wg_004',
    branchId: 'kp1',
    name: 'Tổ Tuyên truyền, Văn nghệ - Thể thao & Dư luận',
    code: 'TỔ-VNTT-04',
    description: 'Biên tập bản tin thanh niên, vận hành Fanpage Chi đoàn, tổ chức các giải giao lưu thể thao và nắm bắt dư luận xã hội trong thanh niên.',
    leaderId: 'ym_015',
    leaderName: 'Võ Hoàng Quân',
    leaderPhone: '0908.445.667',
    memberIds: ['ym_015', 'ym_016'],
    colorTheme: 'purple',
    targetTasksCount: 4,
    completedTasksCount: 3,
    emulationScore: 89,
    ranking: 'TỐT',
    quarter: 'Quý III/2026',
    tasks: [
      { id: 'ts_10', title: 'Thiết kế infographic tuyên truyền Luật Nghĩa vụ Quân sự năm 2026', assignedDate: '02/09/2026', deadline: '08/09/2026', status: 'COMPLETED', assignedMemberNames: ['Võ Hoàng Quân'], points: 20, resultNote: 'Đạt hơn 1.200 lượt xem và tương tác trên mạng xã hội.' },
      { id: 'ts_11', title: 'Tổ chức Giải bóng đá mini Tứ hùng thanh niên các khu phố', assignedDate: '15/09/2026', deadline: '22/09/2026', status: 'IN_PROGRESS', assignedMemberNames: ['Võ Hoàng Quân', 'Đặng Quốc Bảo'], points: 30 }
    ],
    evaluationNotes: 'Kênh truyền thông sinh động, tích cực thu hút thanh thiếu nhi tham gia sinh hoạt.'
  },
  {
    id: 'wg_005',
    branchId: 'kp1',
    name: 'Tổ Nòng cốt Bồi dưỡng Phát triển Đảng & Cán bộ nguồn',
    code: 'TỔ-NCPTĐ-05',
    description: 'Theo dõi, rèn luyện đoàn viên ưu tú, hướng dẫn hồ sơ xin vào Đảng, bồi dưỡng nhận thức về Đảng và tạo nguồn cán bộ kế cận.',
    leaderId: 'ym_001',
    leaderName: 'Trần Thị Bích',
    leaderPhone: '0912.345.678',
    memberIds: ['ym_001', 'ym_002', 'ym_013'],
    colorTheme: 'amber',
    targetTasksCount: 3,
    completedTasksCount: 3,
    emulationScore: 98,
    ranking: 'XUẤT SẮC',
    quarter: 'Quý III/2026',
    tasks: [
      { id: 'ts_12', title: 'Tổ chức Tọa đàm: "Đoàn viên thanh niên phấn đấu trở thành Đảng viên"', assignedDate: '18/08/2026', deadline: '25/08/2026', status: 'COMPLETED', assignedMemberNames: ['Trần Thị Bích', 'Nguyễn Thành Nam'], points: 30, resultNote: '100% đoàn viên ưu tú tham gia viết thu hoạch chính trị.' },
      { id: 'ts_13', title: 'Hoàn thiện hồ sơ giới thiệu 2 đoàn viên ưu tú cho Chi bộ xem xét kết nạp', assignedDate: '01/09/2026', deadline: '15/09/2026', status: 'COMPLETED', assignedMemberNames: ['Trần Thị Bích'], points: 40, resultNote: 'Chi bộ đã tiếp nhận và lập danh sách thẩm tra lý lịch.' }
    ],
    evaluationNotes: 'Đảm bảo công tác phát triển Đảng viên trẻ đạt và vượt chỉ tiêu Đoàn cấp trên giao.'
  }
];

export const INITIAL_TRAINING_RECORDS: YouthMemberTrainingRecord[] = [
  {
    id: 'tr_001',
    memberId: 'ym_001',
    memberName: 'Trần Thị Bích',
    memberCode: 'ĐV-CH-2026-001',
    branchId: 'kp1',
    year: 2026,
    workGroupId: 'wg_005',
    workGroupName: 'Tổ Nòng cốt Phát triển Đảng',
    ideologyScore: 20,
    ethicsScore: 20,
    studyLaborScore: 19,
    physicalSkillScore: 19,
    disciplineVolunteerScore: 20,
    totalScore: 98,
    meetingAttendance: 12,
    monthlyAttendance: [true, true, true, true, true, true, true, true, true, true, true, true],
    volunteerActivitiesCount: 16,
    digitalSkillsCompleted: true,
    trainingStatus: 'XUẤT SẮC',
    selfEvaluationComment: 'Luôn gương mẫu đi đầu trong mọi phong trào của Chi đoàn, hoàn thành xuất sắc nhiệm vụ Bí thư Chi đoàn và bồi dưỡng đoàn viên ưu tú.',
    branchEvaluationComment: 'Cán bộ Đoàn gương mẫu, uy tín cao trong thanh niên, đóng góp tích cực cho công tác tập hợp và phát triển Đảng viên mới.',
    verifiedDate: '15/09/2026',
    verifiedBy: 'BCH Đoàn Phường Chánh Hiệp'
  },
  {
    id: 'tr_002',
    memberId: 'ym_002',
    memberName: 'Nguyễn Thành Nam',
    memberCode: 'ĐV-CH-2026-002',
    branchId: 'kp1',
    year: 2026,
    workGroupId: 'wg_001',
    workGroupName: 'Tổ Công nghệ số cộng đồng',
    ideologyScore: 19,
    ethicsScore: 20,
    studyLaborScore: 20,
    physicalSkillScore: 18,
    disciplineVolunteerScore: 19,
    totalScore: 96,
    meetingAttendance: 11,
    monthlyAttendance: [true, true, true, true, true, true, true, true, true, true, true, false],
    volunteerActivitiesCount: 14,
    digitalSkillsCompleted: true,
    trainingStatus: 'XUẤT SẮC',
    selfEvaluationComment: 'Chủ động nghiên cứu và triển khai nhiều mô hình số hóa cho Chi đoàn và hỗ trợ người dân khu phố sử dụng dịch vụ công trực tuyến.',
    branchEvaluationComment: 'Đoàn viên ưu tú, nhiệt huyết, có nhiều sáng kiến công nghệ nổi bật được Đoàn phường tuyên dương.',
    verifiedDate: '15/09/2026',
    verifiedBy: 'Trần Thị Bích (Bí thư Chi đoàn)'
  },
  {
    id: 'tr_013',
    memberId: 'ym_013',
    memberName: 'Phạm Thu Trang',
    memberCode: 'ĐV-CH-2026-013',
    branchId: 'kp1',
    year: 2026,
    workGroupId: 'wg_002',
    workGroupName: 'Đội Tình nguyện Môi trường',
    ideologyScore: 18,
    ethicsScore: 19,
    studyLaborScore: 18,
    physicalSkillScore: 19,
    disciplineVolunteerScore: 19,
    totalScore: 93,
    meetingAttendance: 10,
    monthlyAttendance: [true, true, true, true, false, true, true, true, true, true, false, true],
    volunteerActivitiesCount: 12,
    digitalSkillsCompleted: true,
    trainingStatus: 'XUẤT SẮC',
    selfEvaluationComment: 'Tích cực huy động lực lượng tham gia các hoạt động Ngày Chủ nhật xanh và bảo vệ môi trường khu phố.',
    branchEvaluationComment: 'Hoàn thành tốt nhiệm vụ phụ trách công tác môi trường, tinh thần trách nhiệm cao.',
    verifiedDate: '15/09/2026',
    verifiedBy: 'Trần Thị Bích (Bí thư Chi đoàn)'
  },
  {
    id: 'tr_014',
    memberId: 'ym_014',
    memberName: 'Lê Hữu Đạt',
    memberCode: 'ĐV-CH-2026-014',
    branchId: 'kp1',
    year: 2026,
    workGroupId: 'wg_003',
    workGroupName: 'Tổ An sinh Xã hội',
    ideologyScore: 18,
    ethicsScore: 19,
    studyLaborScore: 18,
    physicalSkillScore: 18,
    disciplineVolunteerScore: 19,
    totalScore: 92,
    meetingAttendance: 10,
    monthlyAttendance: [true, true, true, true, true, true, false, true, true, true, false, true],
    volunteerActivitiesCount: 11,
    digitalSkillsCompleted: true,
    trainingStatus: 'XUẤT SẮC',
    selfEvaluationComment: 'Luôn nhiệt tình trong công tác chăm lo gia đình chính sách và tham gia hiến máu tình nguyện đầy đủ.',
    branchEvaluationComment: 'Tích cực tham gia các phong trào thiện nguyện, lối sống trong sạch, hòa đồng.',
    verifiedDate: '15/09/2026',
    verifiedBy: 'Trần Thị Bích (Bí thư Chi đoàn)'
  },
  {
    id: 'tr_015',
    memberId: 'ym_015',
    memberName: 'Võ Hoàng Quân',
    memberCode: 'ĐV-CH-2026-015',
    branchId: 'kp1',
    year: 2026,
    workGroupId: 'wg_004',
    workGroupName: 'Tổ Tuyên truyền & Thể thao',
    ideologyScore: 17,
    ethicsScore: 18,
    studyLaborScore: 17,
    physicalSkillScore: 19,
    disciplineVolunteerScore: 17,
    totalScore: 88,
    meetingAttendance: 9,
    monthlyAttendance: [true, true, false, true, true, true, false, true, true, false, true, true],
    volunteerActivitiesCount: 8,
    digitalSkillsCompleted: true,
    trainingStatus: 'XUẤT SẮC',
    selfEvaluationComment: 'Phụ trách tốt đội bóng đá thanh niên và hỗ trợ thiết kế poster sinh hoạt chi đoàn.',
    branchEvaluationComment: 'Năng nổ, nhiệt tình trong các hoạt động văn hóa văn nghệ thể dục thể thao.',
    verifiedDate: '15/09/2026',
    verifiedBy: 'Trần Thị Bích (Bí thư Chi đoàn)'
  },
  {
    id: 'tr_016',
    memberId: 'ym_016',
    memberName: 'Đặng Quốc Bảo',
    memberCode: 'ĐV-CH-2026-016',
    branchId: 'kp1',
    year: 2026,
    workGroupId: 'wg_002',
    workGroupName: 'Đội Tình nguyện Môi trường',
    ideologyScore: 16,
    ethicsScore: 17,
    studyLaborScore: 16,
    physicalSkillScore: 17,
    disciplineVolunteerScore: 16,
    totalScore: 82,
    meetingAttendance: 8,
    monthlyAttendance: [true, true, false, true, false, true, true, false, true, true, false, true],
    volunteerActivitiesCount: 6,
    digitalSkillsCompleted: true,
    trainingStatus: 'KHÁ',
    selfEvaluationComment: 'Tham gia các buổi sinh hoạt chi đoàn và dọn vệ sinh môi trường, tiếp tục cố gắng trong năm tới.',
    branchEvaluationComment: 'Đoàn viên chấp hành tốt kỷ luật chi đoàn, cần nâng cao tỷ lệ tham gia sinh hoạt định kỳ.',
    verifiedDate: '15/09/2026',
    verifiedBy: 'Trần Thị Bích (Bí thư Chi đoàn)'
  },
  {
    id: 'tr_017',
    memberId: 'ym_017',
    memberName: 'Hoàng Kim Ngân',
    memberCode: 'ĐV-CH-2026-017',
    branchId: 'kp1',
    year: 2026,
    workGroupId: 'wg_003',
    workGroupName: 'Tổ An sinh Xã hội',
    ideologyScore: 16,
    ethicsScore: 17,
    studyLaborScore: 17,
    physicalSkillScore: 16,
    disciplineVolunteerScore: 15,
    totalScore: 81,
    meetingAttendance: 8,
    monthlyAttendance: [true, false, true, true, false, true, false, true, true, false, true, true],
    volunteerActivitiesCount: 5,
    digitalSkillsCompleted: true,
    trainingStatus: 'KHÁ',
    selfEvaluationComment: 'Tích cực tham gia phụ trách các gian hàng trò chơi dân gian cho thiếu nhi khu phố.',
    branchEvaluationComment: 'Đoàn viên sinh hoạt đều đặn, đoàn kết với tập thể.',
    verifiedDate: '15/09/2026',
    verifiedBy: 'Trần Thị Bích (Bí thư Chi đoàn)'
  }
];

export const loadStoredWorkGroups = (): YouthWorkGroup[] => {
  try {
    const raw = localStorage.getItem(KEY_WORK_GROUPS);
    if (!raw) return INITIAL_WORK_GROUPS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_WORK_GROUPS;
  }
};

export const saveStoredWorkGroups = (groups: YouthWorkGroup[]) => {
  localStorage.setItem(KEY_WORK_GROUPS, JSON.stringify(groups));
  window.dispatchEvent(new CustomEvent(EVENT_UPDATE, { detail: { type: 'work_groups' } }));
};

export const loadStoredTrainingRecords = (): YouthMemberTrainingRecord[] => {
  try {
    const raw = localStorage.getItem(KEY_TRAINING_RECORDS);
    if (!raw) return INITIAL_TRAINING_RECORDS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_TRAINING_RECORDS;
  }
};

export const saveStoredTrainingRecords = (records: YouthMemberTrainingRecord[]) => {
  localStorage.setItem(KEY_TRAINING_RECORDS, JSON.stringify(records));
  window.dispatchEvent(new CustomEvent(EVENT_UPDATE, { detail: { type: 'training_records' } }));
};

export const INITIAL_YOUTH_MEMBERS: YouthMember[] = [
  {
    id: 'ym_001',
    memberCode: 'ĐV-CH-2026-001',
    fullName: 'Trần Thị Bích',
    gender: 'Nữ',
    birthDate: '12/04/2001',
    branchId: 'kp1',
    branchName: 'Chi đoàn Khu phố 1',
    position: 'Bí thư Chi đoàn',
    joinedDate: '26/03/2016',
    joinedPlace: 'Đoàn trường THPT Võ Minh Đức',
    phone: '0912.345.678',
    email: 'bich.tranthi@chanhhiep.org.vn',
    address: 'Số 12, Tổ 1, Khu phố 1, P. Chánh Hiệp',
    educationLevel: 'Đại học',
    profession: 'Chuyên viên Hành chính / Cán bộ Đoàn',
    ethnic: 'Kinh',
    religion: 'Không',
    status: 'COMMENDED',
    unionDuesStatus: 'PAID',
    unionBookStatus: 'DIGITAL_VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    skills: ['MC / Dẫn chương trình', 'Tổ chức sự kiện', 'Kỹ năng làm việc nhóm', 'Truyền thông mạng xã hội'],
    emulationRanking: 'XUẤT SẮC',
    partyTarget: true,
    notes: 'Đoàn viên ưu tú đã hoàn thành lớp bồi dưỡng nhận thức về Đảng năm 2025.'
  },
  {
    id: 'ym_002',
    memberCode: 'ĐV-CH-2026-002',
    fullName: 'Nguyễn Thành Nam',
    gender: 'Nam',
    birthDate: '18/09/2003',
    branchId: 'kp1',
    branchName: 'Chi đoàn Khu phố 1',
    position: 'Phó Bí thư Chi đoàn',
    joinedDate: '26/03/2018',
    joinedPlace: 'Đoàn trường THCS Chánh Hiệp',
    phone: '0938.112.445',
    email: 'nam.nguyenthanh@gmail.com',
    address: 'Số 45/2, Tổ 3, Khu phố 1, P. Chánh Hiệp',
    educationLevel: 'Đại học (Năm 4)',
    profession: 'Sinh viên ĐH Thủ Dầu Một - Khoa CNTT',
    ethnic: 'Kinh',
    religion: 'Không',
    status: 'ACTIVE',
    unionDuesStatus: 'PAID',
    unionBookStatus: 'DIGITAL_VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    skills: ['Chuyển đổi số - IT', 'Thiết kế đồ họa Canva', 'Tổ chức sinh hoạt hè'],
    emulationRanking: 'XUẤT SẮC',
    partyTarget: true,
    notes: 'Trưởng nhóm Tổ công nghệ số cộng đồng Khu phố 1.'
  },
  {
    id: 'ym_003',
    memberCode: 'ĐV-CH-2026-003',
    fullName: 'Lê Văn Nam',
    gender: 'Nam',
    birthDate: '05/11/1999',
    branchId: 'kp2',
    branchName: 'Chi đoàn Khu phố 2',
    position: 'Bí thư Chi đoàn',
    joinedDate: '19/05/2015',
    joinedPlace: 'Đoàn trường THCS Chánh Hiệp',
    phone: '0903.112.233',
    email: 'nam.levan@gmail.com',
    address: 'Số 88 đường Lê Chí Dân, KP2, P. Chánh Hiệp',
    educationLevel: 'Đại học',
    profession: 'Kỹ sư Xây dựng đô thị',
    ethnic: 'Kinh',
    religion: 'Không',
    status: 'ACTIVE',
    unionDuesStatus: 'PAID',
    unionBookStatus: 'DIGITAL_VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    skills: ['Thể thao - Bóng đá', 'Kỹ thuật xung kích', 'Cứu hộ phòng cháy'],
    emulationRanking: 'XUẤT SẮC',
    partyTarget: false,
    notes: 'Tích cực phụ trách các công trình thanh niên sáng - xanh - sạch - đẹp.'
  },
  {
    id: 'ym_004',
    memberCode: 'ĐV-CH-2026-004',
    fullName: 'Võ Thị Thanh Thảo',
    gender: 'Nữ',
    birthDate: '22/07/2004',
    branchId: 'kp2',
    branchName: 'Chi đoàn Khu phố 2',
    position: 'Ủy viên BCH Chi đoàn',
    joinedDate: '26/03/2019',
    joinedPlace: 'Đoàn trường THPT An Mỹ',
    phone: '0984.776.554',
    email: 'thao.vothanh@gmail.com',
    address: 'Số 31, Tổ 2, Khu phố 2, P. Chánh Hiệp',
    educationLevel: 'Cao đẳng',
    profession: 'Dược sĩ / Nhân viên y tế',
    ethnic: 'Kinh',
    religion: 'Không',
    status: 'ACTIVE',
    unionDuesStatus: 'PAID',
    unionBookStatus: 'DIGITAL_VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    skills: ['Cứu hộ - Sơ cấp cứu', 'Tuyên truyền phòng dịch', 'Văn nghệ'],
    emulationRanking: 'KHÁ',
    partyTarget: false,
    notes: 'Đội trưởng đội sơ cấp cứu tình nguyện thanh niên.'
  },
  {
    id: 'ym_005',
    memberCode: 'ĐV-CH-2026-005',
    fullName: 'Nguyễn Văn Minh',
    gender: 'Nam',
    birthDate: '10/02/2000',
    branchId: 'kp3',
    branchName: 'Chi đoàn Khu phố 3',
    position: 'Bí thư Chi đoàn',
    joinedDate: '26/03/2016',
    joinedPlace: 'Đoàn trường THCS Chánh Hiệp',
    phone: '0988.776.655',
    email: 'minh.nguyenvan@chanhhiep.org.vn',
    address: 'Số 19, Tổ 4, Khu phố 3, P. Chánh Hiệp',
    educationLevel: 'Đại học',
    profession: 'Kinh doanh tự do / Cán bộ Đoàn',
    ethnic: 'Kinh',
    religion: 'Không',
    status: 'COMMENDED',
    unionDuesStatus: 'PAID',
    unionBookStatus: 'DIGITAL_VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    skills: ['Tập hợp thanh niên', 'Khởi nghiệp đổi mới sáng tạo', 'Nhiếp ảnh'],
    emulationRanking: 'XUẤT SẮC',
    partyTarget: true,
    notes: 'Đã hoàn thành hồ sơ lý lịch người xin vào Đảng tháng 01/2026.'
  },
  {
    id: 'ym_006',
    memberCode: 'ĐV-CH-2026-006',
    fullName: 'Phạm Hồng Nhung',
    gender: 'Nữ',
    birthDate: '14/08/2002',
    branchId: 'kp4',
    branchName: 'Chi đoàn Khu phố 4',
    position: 'Bí thư Chi đoàn',
    joinedDate: '19/05/2017',
    joinedPlace: 'Đoàn trường THPT Trịnh Hoài Đức',
    phone: '0977.889.900',
    email: 'nhung.phamhong@gmail.com',
    address: 'Số 62 đường Nguyễn Văn Cừ, KP4, P. Chánh Hiệp',
    educationLevel: 'Cử nhân Sư phạm',
    profession: 'Giáo viên tiếng Anh',
    ethnic: 'Kinh',
    religion: 'Không',
    status: 'COMMENDED',
    unionDuesStatus: 'PAID',
    unionBookStatus: 'DIGITAL_VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    skills: ['Ngoại ngữ - Tiếng Anh', 'Dạy học tình nguyện', 'MC song ngữ'],
    emulationRanking: 'XUẤT SẮC',
    partyTarget: true,
    notes: 'Chủ nhiệm CLB Tiếng Anh miễn phí cho trẻ em nghèo khu phố.'
  },
  {
    id: 'ym_007',
    memberCode: 'ĐV-CH-2026-007',
    fullName: 'Nguyễn Thị Thu Hà',
    gender: 'Nữ',
    birthDate: '03/03/1998',
    branchId: 'thcs',
    branchName: 'Chi đoàn Trường THCS Chánh Hiệp',
    position: 'Bí thư Chi đoàn',
    joinedDate: '26/03/2014',
    joinedPlace: 'Đoàn trường ĐH Thủ Dầu Một',
    phone: '0908.667.788',
    email: 'ha.nguyenthithu@thcschanhhiep.edu.vn',
    address: 'Số 104, Đường 30/4, P. Chánh Hiệp',
    educationLevel: 'Thạc sĩ Giáo dục',
    profession: 'Giáo viên Ngữ văn / Tổng phụ trách Đội',
    ethnic: 'Kinh',
    religion: 'Không',
    status: 'COMMENDED',
    unionDuesStatus: 'PAID',
    unionBookStatus: 'DIGITAL_VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    skills: ['Công tác Đội TNTP', 'Soạn thảo văn bản', 'Thuyết trình truyền cảm'],
    emulationRanking: 'XUẤT SẮC',
    partyTarget: true,
    notes: 'Đảng viên dự bị / Bí thư Chi đoàn trường học tiêu biểu năm 2025.'
  },
  {
    id: 'ym_008',
    memberCode: 'ĐV-CH-2026-008',
    fullName: 'Trịnh Hoài Nam',
    gender: 'Nam',
    birthDate: '15/12/2001',
    branchId: 'qs',
    branchName: 'Chi đoàn Quân sự Phường Chánh Hiệp',
    position: 'Bí thư Chi đoàn',
    joinedDate: '22/12/2017',
    joinedPlace: 'Ban CHQS Phường Chánh Hiệp',
    phone: '0972.334.455',
    email: 'nam.trinhhoai@quansu.chanhhiep.gov.vn',
    address: 'Trụ sở Ban CHQS Phường Chánh Hiệp',
    educationLevel: 'Đại học Quân sự',
    profession: 'Sĩ quan / Cán bộ Ban Chỉ huy Quân sự Phường',
    ethnic: 'Kinh',
    religion: 'Không',
    status: 'COMMENDED',
    unionDuesStatus: 'PAID',
    unionBookStatus: 'DIGITAL_VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    skills: ['Huấn luyện quân sự', 'Thể lực - Võ thuật', 'Phòng chống lụt bão'],
    emulationRanking: 'XUẤT SẮC',
    partyTarget: true,
    notes: 'Đảng viên chính thức / Chỉ huy trưởng hoạt động xung kích cứu hộ.'
  },
  {
    id: 'ym_009',
    memberCode: 'ĐV-CH-2026-009',
    fullName: 'Nguyễn Minh Hải',
    gender: 'Nam',
    birthDate: '28/06/2000',
    branchId: 'ca',
    branchName: 'Chi đoàn Công an Phường Chánh Hiệp',
    position: 'Bí thư Chi đoàn',
    joinedDate: '19/08/2016',
    joinedPlace: 'Đoàn Công an TP Thủ Dầu Một',
    phone: '0913.445.566',
    email: 'hai.nguyenminh@congan.chanhhiep.gov.vn',
    address: 'Trụ sở Công an Phường Chánh Hiệp',
    educationLevel: 'Đại học Cảnh sát',
    profession: 'Cán bộ Công an Phường Chánh Hiệp',
    ethnic: 'Kinh',
    religion: 'Không',
    status: 'COMMENDED',
    unionDuesStatus: 'PAID',
    unionBookStatus: 'DIGITAL_VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    skills: ['Tuyên truyền pháp luật', 'Hỗ trợ VNeID / Dịch vụ công', 'An ninh trật tự'],
    emulationRanking: 'XUẤT SẮC',
    partyTarget: true,
    notes: 'Đảng viên chính thức / Đi đầu trong đề án 06 Chuyển đổi số dân cư.'
  },
  {
    id: 'ym_010',
    memberCode: 'ĐV-CH-2026-010',
    fullName: 'Đoàn Gia Bảo',
    gender: 'Nam',
    birthDate: '09/09/2002',
    branchId: 'dn',
    branchName: 'Chi đoàn Doanh nghiệp Ngoài nhà nước',
    position: 'Bí thư Chi đoàn',
    joinedDate: '26/03/2018',
    joinedPlace: 'Đoàn khối Doanh nghiệp',
    phone: '0909.887.766',
    email: 'bao.doangia@enterprise.com',
    address: 'Khu thương mại dịch vụ Chánh Hiệp',
    educationLevel: 'Đại học Kinh tế',
    profession: 'Trưởng phòng Marketing Doanh nghiệp',
    ethnic: 'Kinh',
    religion: 'Không',
    status: 'ACTIVE',
    unionDuesStatus: 'PAID',
    unionBookStatus: 'DIGITAL_VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    skills: ['Kinh tế - Tài chính', 'Kết nối tài trợ thiện nguyện', 'Thiết kế media'],
    emulationRanking: 'KHÁ',
    partyTarget: false,
    notes: 'Vận động nguồn lực doanh nghiệp hỗ trợ quỹ học bổng thanh thiếu nhi.'
  },
  {
    id: 'ym_011',
    memberCode: 'ĐV-CH-2026-011',
    fullName: 'Trương Ngọc Ánh',
    gender: 'Nữ',
    birthDate: '19/01/2005',
    branchId: 'kp10',
    branchName: 'Chi đoàn Khu phố 10',
    position: 'Bí thư Chi đoàn',
    joinedDate: '26/03/2021',
    joinedPlace: 'Đoàn trường THPT Chuyên Hùng Vương',
    phone: '0981.234.567',
    email: 'anh.truongngoc@gmail.com',
    address: 'Số 112, KP10, P. Chánh Hiệp',
    educationLevel: 'Đại học (Năm 2)',
    profession: 'Sinh viên ĐH Quốc tế Miền Đông',
    ethnic: 'Kinh',
    religion: 'Không',
    status: 'ACTIVE',
    unionDuesStatus: 'PAID',
    unionBookStatus: 'DIGITAL_VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    skills: ['Ngoại ngữ', 'Hoạt náo viên', 'Văn nghệ - Guitar'],
    emulationRanking: 'KHÁ',
    partyTarget: false,
    notes: 'Tích cực tổ chức các sân chơi cuối tuần cho thiếu nhi khu phố.'
  },
  {
    id: 'ym_012',
    memberCode: 'ĐV-CH-2026-012',
    fullName: 'Đặng Mai Phương',
    gender: 'Nữ',
    birthDate: '30/10/2001',
    branchId: 'kp6',
    branchName: 'Chi đoàn Khu phố 6',
    position: 'Bí thư Chi đoàn',
    joinedDate: '19/05/2017',
    joinedPlace: 'Đoàn trường THCS Chánh Hiệp',
    phone: '0944.556.677',
    email: 'phuong.dangmai@gmail.com',
    address: 'Số 74, Tổ 5, KP6, P. Chánh Hiệp',
    educationLevel: 'Đại học Luật',
    profession: 'Chuyên viên pháp lý',
    ethnic: 'Kinh',
    religion: 'Không',
    status: 'COMMENDED',
    unionDuesStatus: 'PAID',
    unionBookStatus: 'DIGITAL_VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    skills: ['Tư vấn pháp luật', 'Hòa giải cơ sở', 'Tranh biện'],
    emulationRanking: 'XUẤT SẮC',
    partyTarget: true,
    notes: 'Tham gia tổ tư vấn pháp lý miễn phí cho thanh niên công nhân.'
  }
];

export const getDefaultTrainingHistory = (member: Partial<YouthMember>): TrainingHistoryItem[] => {
  const baseScore = member.trainingScore ?? 88;
  return [
    {
      year: 2024,
      period: 'Năm 2024',
      score: Math.max(70, baseScore - 6),
      ranking: 'XUẤT SẮC',
      evaluation: 'Chấp hành nghiêm chỉnh Điều lệ Đoàn, nhiệt tình tham gia hoạt động tình nguyện cơ sở.',
      reviewer: 'BCH Chi đoàn',
      reviewedAt: '15/12/2024'
    },
    {
      year: 2025,
      period: 'Năm 2025',
      score: Math.max(75, baseScore - 2),
      ranking: 'XUẤT SẮC',
      evaluation: 'Gương mẫu trong các phong trào xung kích, hoàn thành xuất sắc nhiệm vụ được phân công.',
      reviewer: 'BCH Chi đoàn',
      reviewedAt: '20/12/2025'
    },
    {
      year: 2026,
      period: 'Năm 2026 (Đang rèn luyện)',
      score: baseScore,
      ranking: member.emulationRanking || 'XUẤT SẮC',
      evaluation: 'Tiên phong trong chuyển đổi số cơ sở, tích cực tham gia sinh hoạt chi đoàn và nhóm công tác.',
      reviewer: 'BCH Chi đoàn & Đoàn phường',
      reviewedAt: '15/03/2026'
    }
  ];
};

export const getDefaultEmulationAwards = (member: Partial<YouthMember>): EmulationAwardItem[] => {
  const memberId = member.id || 'ym_new';
  const awards: EmulationAwardItem[] = [
    {
      id: `award_${memberId}_1`,
      title: 'Đoàn viên Xuất sắc tiêu biểu cấp cơ sở',
      awardedBy: 'BCH Đoàn Phường Chánh Hiệp',
      level: 'CẤP PHƯỜNG',
      decisionNumber: 'QĐ-08/QĐ-ĐTN',
      awardedDate: '26/03/2025',
      category: 'DANH HIỆU',
      note: 'Thành tích xuất sắc trong công tác Đoàn và phong trào thanh thiếu nhi'
    },
    {
      id: `award_${memberId}_2`,
      title: 'Giấy khen Chiến sĩ Tình nguyện Xuất sắc Chiến dịch Hè',
      awardedBy: 'BCH Đoàn Phường Chánh Hiệp',
      level: 'CẤP PHƯỜNG',
      decisionNumber: 'QĐ-34/QĐ-ĐTN',
      awardedDate: '15/08/2025',
      category: 'GIẤY KHEN',
      note: 'Đóng góp tích cực trong chiến dịch tình nguyện Mùa Hè Xanh và Ngày Chủ Nhật Xanh'
    }
  ];

  if (member.partyTarget || (member.position && member.position.includes('Bí thư'))) {
    awards.push({
      id: `award_${memberId}_3`,
      title: 'Thanh niên tiên tiến làm theo lời Bác',
      awardedBy: 'BCH Thành Đoàn Thủ Dầu Một',
      level: 'CẤP THÀNH PHỐ',
      decisionNumber: 'QĐ-112/QĐ-TĐ',
      awardedDate: '19/05/2025',
      category: 'DANH HIỆU',
      note: 'Gương mặt trẻ điển hình tiên tiến học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh'
    });
  }

  return awards;
};

export const loadStoredYouthMembers = (): YouthMember[] => {
  try {
    const raw = localStorage.getItem(KEY_YOUTH_MEMBERS);
    if (!raw) {
      return INITIAL_YOUTH_MEMBERS.map(m => ({
        ...m,
        unionResolutionNumber: m.unionResolutionNumber || `NQ-KN/2020-0${m.id.replace(/\D/g, '') || '1'}`,
        recommender: m.recommender || 'Ban Chấp hành Chi đoàn',
        partyStatus: m.partyTarget ? 'CẢM TÌNH ĐẢNG' : 'CHƯA',
        trainingHistory: m.trainingHistory || getDefaultTrainingHistory(m),
        emulationAwards: m.emulationAwards || getDefaultEmulationAwards(m)
      }));
    }
    const parsed: YouthMember[] = JSON.parse(raw);
    const initialMap = new Map(INITIAL_YOUTH_MEMBERS.map(m => [m.id, m]));
    return parsed.map(m => {
      const init = initialMap.get(m.id);
      return {
        ...m,
        unionResolutionNumber: m.unionResolutionNumber || init?.unionResolutionNumber || `NQ-KN/2020-0${m.id.replace(/\D/g, '') || '1'}`,
        recommender: m.recommender || init?.recommender || 'Ban Chấp hành Chi đoàn',
        partyStatus: m.partyStatus || (m.partyTarget ? 'CẢM TÌNH ĐẢNG' : 'CHƯA'),
        workGroupId: m.workGroupId || init?.workGroupId || 'wg_001',
        workGroupName: m.workGroupName || init?.workGroupName || 'Tổ Công nghệ số cộng đồng',
        workGroupRole: m.workGroupRole || init?.workGroupRole || 'THÀNH VIÊN',
        trainingScore: m.trainingScore !== undefined ? m.trainingScore : (init?.trainingScore ?? 85),
        volunteerDays: m.volunteerDays !== undefined ? m.volunteerDays : (init?.volunteerDays ?? 6),
        meetingAttendance: m.meetingAttendance !== undefined ? m.meetingAttendance : (init?.meetingAttendance ?? 10),
        trainingHistory: (m.trainingHistory && m.trainingHistory.length > 0) ? m.trainingHistory : getDefaultTrainingHistory(m),
        emulationAwards: (m.emulationAwards && m.emulationAwards.length > 0) ? m.emulationAwards : getDefaultEmulationAwards(m)
      };
    });
  } catch {
    return INITIAL_YOUTH_MEMBERS.map(m => ({
      ...m,
      unionResolutionNumber: `NQ-KN/2020-0${m.id.replace(/\D/g, '') || '1'}`,
      recommender: 'Ban Chấp hành Chi đoàn',
      partyStatus: m.partyTarget ? 'CẢM TÌNH ĐẢNG' : 'CHƯA',
      trainingHistory: getDefaultTrainingHistory(m),
      emulationAwards: getDefaultEmulationAwards(m)
    }));
  }
};

export const saveStoredYouthMembers = (members: YouthMember[]) => {
  localStorage.setItem(KEY_YOUTH_MEMBERS, JSON.stringify(members));
  window.dispatchEvent(new CustomEvent(EVENT_UPDATE, { detail: { type: 'youth_members' } }));
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
