import { OFFICIAL_21_NEIGHBORHOODS } from './neighborhoodsList';

export interface NeighborhoodHousehold {
  id: string;
  neighborhoodId: string;
  neighborhoodName: string;
  groupNumber: string; // e.g. Tổ 1, Tổ 2, Tổ 3...
  headOfHousehold: string;
  cccd: string;
  phone: string;
  address: string;
  memberCount: number;
  householdType: 'STANDARD' | 'POLICY' | 'POOR' | 'NEAR_POOR' | 'BUSINESS' | 'TEMPORARY';
  hasZalo: boolean;
  culturalFamilyStatus: 'REGISTERED' | 'ACHIEVED' | 'CONSIDERING';
  notes?: string;
  updatedAt: string;
}

export interface NeighborhoodBroadcast {
  id: string;
  title: string;
  content: string;
  targetNeighborhoodIds: string[]; // ['ALL'] or specific IDs like ['area-kp-1', 'area-kp-2']
  targetNeighborhoodNames: string[];
  priority: 'URGENT' | 'HIGH' | 'NORMAL';
  category: 'AN_NINH' | 'MOI_TRUONG' | 'AN_SINH' | 'SINH_HOAT' | 'THI_DUA';
  channels: ('ZALO' | 'SMS' | 'LOA_SO' | 'BANG_TIN')[];
  senderName: string;
  sentAt: string;
  readCount: number;
  totalTargetCount: number;
  attachmentName?: string;
  status: 'SENT' | 'SCHEDULED' | 'DRAFT';
}

export interface NeighborhoodPetition {
  id: string;
  code: string;
  residentName: string;
  residentPhone: string;
  residentAddress: string;
  neighborhoodId: string;
  neighborhoodName: string;
  groupNumber: string;
  field: 'MOI_TRUONG' | 'TRAT_TU' | 'AN_NINH' | 'CHIEU_SANG' | 'HOA_GIAI' | 'AN_SINH';
  title: string;
  content: string;
  imageUrl?: string;
  submittedAt: string;
  status: 'RECEIVED' | 'VERIFYING' | 'RESOLVING' | 'RESOLVED' | 'REJECTED' | 'ESCALATED_TO_WARD';
  assignedOfficer: string;
  resolutionNote?: string;
  resolutionDate?: string;
  resolutionImage?: string;
  escalationNote?: string;
}

export interface NeighborhoodRegistration {
  id: string;
  code: string;
  formType: 
    | 'GIA_DINH_VAN_HOA' 
    | 'TRO_CAP_AN_SINH' 
    | 'CAP_THUNG_RAC' 
    | 'TAM_TRU_TAM_VANG' 
    | 'HOA_GIAI_TRANH_CHAP' 
    | 'HIEN_DAT_DONG_GOP';
  title: string;
  residentName: string;
  residentPhone: string;
  residentCccd: string;
  address: string;
  neighborhoodId: string;
  neighborhoodName: string;
  groupNumber: string;
  details: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'SUPPLEMENTARY' | 'REJECTED';
  scheduledDate?: string;
  adminNote?: string;
  approvedBy?: string;
}

export interface NeighborhoodCadre {
  id: string;
  neighborhoodId: string;
  neighborhoodName: string;
  position: 'TRUONG_BAN_CTMT' | 'TRUONG_KHU_PHO' | 'BI_THU_CHI_BO' | 'CANH_SAT_KHU_VUC';
  positionLabel: string;
  fullName: string;
  phone: string;
  email?: string;
  term: string; // e.g. 2024-2027
  isPartyMember: boolean;
}

export interface NeighborhoodMonthlyReport {
  id: string;
  neighborhoodId: string;
  neighborhoodName: string;
  submittedBy: string;
  period: string; // e.g. "Tháng 09/2026"
  submittedAt: string;
  totalHouseholds: number;
  reviewedHouseholds: number;
  resolvedPetitionsCount: number;
  pendingPetitionsCount: number;
  culturalFamilyEligibleCount: number;
  status: 'SUBMITTED' | 'ACKNOWLEDGED' | 'REVIEWED';
  keyHighlights: string;
  wardFeedback?: string;
}

export const INITIAL_MONTHLY_REPORTS: NeighborhoodMonthlyReport[] = [
  {
    id: 'rep-01',
    neighborhoodId: 'area-kp-1',
    neighborhoodName: 'Tương Bình Hiệp 1',
    submittedBy: 'Đoàn Thị Bích Vân (Trưởng Ban CTMT)',
    period: 'Tháng 09/2026',
    submittedAt: '2026-09-24 16:30',
    totalHouseholds: 615,
    reviewedHouseholds: 610,
    resolvedPetitionsCount: 8,
    pendingPetitionsCount: 1,
    culturalFamilyEligibleCount: 588,
    status: 'REVIEWED',
    keyHighlights: 'Đã hoàn thành rà soát danh sách tặng quà gia đình chính sách dịp 2/9; xử lý 8/9 phản ánh môi trường; vận động 15 triệu đồng Quỹ Khuyến học khu phố.',
    wardFeedback: 'MTTQ Phường đánh giá cao tinh thần trách nhiệm của Ban công tác Mặt trận KP Tương Bình Hiệp 1. Biểu dương kết quả vận động quỹ.'
  },
  {
    id: 'rep-02',
    neighborhoodId: 'area-kp-2',
    neighborhoodName: 'Tương Bình Hiệp 2',
    submittedBy: 'Lê Thị Thanh Loan (Trưởng Ban CTMT)',
    period: 'Tháng 09/2026',
    submittedAt: '2026-09-23 11:20',
    totalHouseholds: 590,
    reviewedHouseholds: 585,
    resolvedPetitionsCount: 6,
    pendingPetitionsCount: 0,
    culturalFamilyEligibleCount: 570,
    status: 'ACKNOWLEDGED',
    keyHighlights: 'Vận động thành công hộ ông Lê Hoàng Long hiến 12m2 đất thổ cư mở rộng tuyến hẻm DX-075. Toàn bộ kiến nghị chiếu sáng đã giải quyết xong.'
  }
];

// Initial Sample Households across Chánh Hiệp
export const INITIAL_HOUSEHOLDS: NeighborhoodHousehold[] = [
  {
    id: 'hh-01',
    neighborhoodId: 'area-kp-1',
    neighborhoodName: 'Tương Bình Hiệp 1',
    groupNumber: 'Tổ 2',
    headOfHousehold: 'Nguyễn Văn Minh',
    cccd: '074082001123',
    phone: '0918.234.567',
    address: 'Số 42/3 đường DX-071, KP Tương Bình Hiệp 1',
    memberCount: 4,
    householdType: 'STANDARD',
    hasZalo: true,
    culturalFamilyStatus: 'ACHIEVED',
    notes: 'Hộ nhiệt tình tham gia dọn dẹp vệ sinh ngày Chủ nhật xanh',
    updatedAt: '2026-09-20'
  },
  {
    id: 'hh-02',
    neighborhoodId: 'area-kp-1',
    neighborhoodName: 'Tương Bình Hiệp 1',
    groupNumber: 'Tổ 1',
    headOfHousehold: 'Trần Thị Mai',
    cccd: '074175003421',
    phone: '0903.882.119',
    address: 'Số 15 đường DX-072, KP Tương Bình Hiệp 1',
    memberCount: 3,
    householdType: 'POLICY',
    hasZalo: true,
    culturalFamilyStatus: 'ACHIEVED',
    notes: 'Gia đình thương binh 3/4, mẹ liệt sĩ',
    updatedAt: '2026-09-18'
  },
  {
    id: 'hh-03',
    neighborhoodId: 'area-kp-2',
    neighborhoodName: 'Tương Bình Hiệp 2',
    groupNumber: 'Tổ 3',
    headOfHousehold: 'Lê Hoàng Long',
    cccd: '074089004523',
    phone: '0937.445.678',
    address: 'Số 88/12 đường DX-075, KP Tương Bình Hiệp 2',
    memberCount: 5,
    householdType: 'BUSINESS',
    hasZalo: true,
    culturalFamilyStatus: 'ACHIEVED',
    notes: 'Cơ sở sản xuất gốm mỹ nghệ truyền thống Tương Bình Hiệp',
    updatedAt: '2026-09-19'
  },
  {
    id: 'hh-04',
    neighborhoodId: 'area-kp-3',
    neighborhoodName: 'Tương Bình Hiệp 3',
    groupNumber: 'Tổ 1',
    headOfHousehold: 'Phạm Đức Cường',
    cccd: '074091002341',
    phone: '0972.113.442',
    address: 'Số 120 đường Nguyễn Chí Thanh, KP Tương Bình Hiệp 3',
    memberCount: 2,
    householdType: 'NEAR_POOR',
    hasZalo: false,
    culturalFamilyStatus: 'REGISTERED',
    notes: 'Hộ người cao tuổi sống neo đơn, cần được quan tâm an sinh',
    updatedAt: '2026-09-15'
  },
  {
    id: 'hh-05',
    neighborhoodId: 'area-kp-7',
    neighborhoodName: 'Tương Bình Hiệp 7',
    groupNumber: 'Tổ 4',
    headOfHousehold: 'Vũ Thị Hạnh',
    cccd: '074188009876',
    phone: '0988.665.231',
    address: 'Số 09 đường DX-080, KP Tương Bình Hiệp 7',
    memberCount: 4,
    householdType: 'STANDARD',
    hasZalo: true,
    culturalFamilyStatus: 'ACHIEVED',
    notes: 'Đã đóng góp kinh phí lắp camera an ninh ngõ xóm',
    updatedAt: '2026-09-22'
  },
  {
    id: 'hh-06',
    neighborhoodId: 'area-kp-8',
    neighborhoodName: 'Hiệp An 7',
    groupNumber: 'Tổ 2',
    headOfHousehold: 'Đoàn Hữu Phước',
    cccd: '074079008765',
    phone: '0913.998.712',
    address: 'Số 54 đường DX-084, KP Hiệp An 7',
    memberCount: 6,
    householdType: 'BUSINESS',
    hasZalo: true,
    culturalFamilyStatus: 'ACHIEVED',
    notes: 'Doanh nghiệp chế biến gỗ gia dụng, chấp hành tốt PCCC',
    updatedAt: '2026-09-21'
  },
  {
    id: 'hh-07',
    neighborhoodId: 'area-kp-11',
    neighborhoodName: 'Định Hòa 1',
    groupNumber: 'Tổ 1',
    headOfHousehold: 'Bùi Thanh Tùng',
    cccd: '074085006543',
    phone: '0908.332.190',
    address: 'Số 203 đường Trần Ngọc Lên, KP Định Hòa 1',
    memberCount: 4,
    householdType: 'STANDARD',
    hasZalo: true,
    culturalFamilyStatus: 'ACHIEVED',
    notes: 'Thành viên Tổ tự quản bảo vệ an ninh trật tự',
    updatedAt: '2026-09-23'
  },
  {
    id: 'hh-08',
    neighborhoodId: 'area-kp-14',
    neighborhoodName: 'Định Hòa 4',
    groupNumber: 'Tổ 3',
    headOfHousehold: 'Ngô Tấn Tài',
    cccd: '074092004321',
    phone: '0944.551.229',
    address: 'Số 76/4 đường DX-092, KP Định Hòa 4',
    memberCount: 3,
    householdType: 'TEMPORARY',
    hasZalo: true,
    culturalFamilyStatus: 'REGISTERED',
    notes: 'Hộ công nhân tạm trú tại khu nhà trọ công đoàn',
    updatedAt: '2026-09-17'
  },
  {
    id: 'hh-09',
    neighborhoodId: 'area-kp-19',
    neighborhoodName: 'Mỹ Hảo',
    groupNumber: 'Tổ 2',
    headOfHousehold: 'Dương Văn Hải',
    cccd: '074081005678',
    phone: '0979.882.341',
    address: 'Số 11 đường DX-096, KP Mỹ Hảo',
    memberCount: 5,
    householdType: 'POLICY',
    hasZalo: true,
    culturalFamilyStatus: 'ACHIEVED',
    notes: 'Gia đình người có công cách mạng, tích cực công tác Mặt trận',
    updatedAt: '2026-09-24'
  },
  {
    id: 'hh-10',
    neighborhoodId: 'area-kp-20',
    neighborhoodName: 'Chánh Mỹ 1',
    groupNumber: 'Tổ 1',
    headOfHousehold: 'Huỳnh Kim Oanh',
    cccd: '074186001234',
    phone: '0938.990.112',
    address: 'Số 33 đường Nguyễn Văn Lộng, KP Chánh Mỹ 1',
    memberCount: 4,
    householdType: 'STANDARD',
    hasZalo: true,
    culturalFamilyStatus: 'ACHIEVED',
    notes: 'Gia đình hiến đất mở rộng hẻm bê tông năm 2025',
    updatedAt: '2026-09-23'
  },
  {
    id: 'hh-11',
    neighborhoodId: 'area-kp-21',
    neighborhoodName: 'Chánh Mỹ 2',
    groupNumber: 'Tổ 2',
    headOfHousehold: 'Võ Minh Trí',
    cccd: '074093007890',
    phone: '0922.334.556',
    address: 'Số 62 đường DX-102, KP Chánh Mỹ 2',
    memberCount: 3,
    householdType: 'STANDARD',
    hasZalo: true,
    culturalFamilyStatus: 'ACHIEVED',
    notes: 'Gia đình văn hóa tiêu biểu 5 năm liên tục',
    updatedAt: '2026-09-24'
  }
];

// Initial Sample Broadcasts
export const INITIAL_BROADCASTS: NeighborhoodBroadcast[] = [
  {
    id: 'bc-01',
    title: 'Thông báo ứng phó triều cường và mưa lớn chiều tối 25/09/2026',
    content: 'Theo dự báo Đài Khí tượng Thủy văn, triều cường vùng hạ lưu sông Sài Gòn dâng cao kết hợp mưa to. Đề nghị các hộ dân ven sông và trục rạch Bà Lụa thuộc các khu phố chủ động kê cao đồ đạc, kiểm tra an toàn điện sinh hoạt.',
    targetNeighborhoodIds: ['ALL'],
    targetNeighborhoodNames: ['Toàn bộ 21 Khu phố Chánh Hiệp'],
    priority: 'URGENT',
    category: 'AN_NINH',
    channels: ['ZALO', 'SMS', 'LOA_SO', 'BANG_TIN'],
    senderName: 'Ban Thường trực MTTQ Phường',
    sentAt: '2026-09-25 08:30',
    readCount: 10420,
    totalTargetCount: 12850,
    attachmentName: 'Cong-van-phong-chong-trieu-cuong-2026.pdf',
    status: 'SENT'
  },
  {
    id: 'bc-02',
    title: 'Lịch tiêm phòng dại và phòng chống dịch sốt xuất huyết tháng 10/2026',
    content: 'Trạm Y tế phối hợp Ban điều hành 21 khu phố tổ chức ra quân diệt lăng quăng, vệ sinh dụng cụ chứa nước và phát thuốc phòng chống sốt xuất huyết miễn phí vào sáng thứ Bảy hàng tuần.',
    targetNeighborhoodIds: ['area-kp-1', 'area-kp-2', 'area-kp-3', 'area-kp-4', 'area-kp-5'],
    targetNeighborhoodNames: ['KP Tương Bình Hiệp 1, 2, 3, 4, 5'],
    priority: 'NORMAL',
    category: 'MOI_TRUONG',
    channels: ['ZALO', 'BANG_TIN'],
    senderName: 'Ban Chỉ đạo Chăm sóc Sức khỏe Phường',
    sentAt: '2026-09-24 14:15',
    readCount: 3120,
    totalTargetCount: 3450,
    status: 'SENT'
  },
  {
    id: 'bc-03',
    title: 'Vận động ủng hộ Quỹ "Vì người nghèo" và học bổng khuyến học Chánh Hiệp',
    content: 'Hưởng ứng Tháng cao điểm vì người nghèo năm 2026, Ủy ban MTTQ Việt Nam phường Chánh Hiệp kêu gọi các tầng lớp nhân dân, hộ kinh doanh chung tay đóng góp hỗ trợ thẻ BHYT và học bổng cho học sinh nghèo hiếu học.',
    targetNeighborhoodIds: ['ALL'],
    targetNeighborhoodNames: ['Toàn bộ 21 Khu phố Chánh Hiệp'],
    priority: 'HIGH',
    category: 'AN_SINH',
    channels: ['ZALO', 'SMS', 'BANG_TIN'],
    senderName: 'Ủy ban MTTQ Việt Nam Phường',
    sentAt: '2026-09-22 09:00',
    readCount: 8960,
    totalTargetCount: 12850,
    attachmentName: 'Thu-keu-goi-vi-nguoi-ngheo-2026.pdf',
    status: 'SENT'
  },
  {
    id: 'bc-04',
    title: 'Lịch sinh hoạt Chi bộ & Tổ nhân dân tự quản định kỳ Quý IV/2026',
    content: 'Kính mời đại diện các hộ gia đình tham gia buổi sinh hoạt Tổ dân phố để nghe thông tin tình hình kinh tế - an ninh trật tự địa phương và đóng góp ý kiến xây dựng khu dân cư văn minh đô thị.',
    targetNeighborhoodIds: ['area-kp-11', 'area-kp-12', 'area-kp-13', 'area-kp-14'],
    targetNeighborhoodNames: ['KP Định Hòa 1, 2, 3, 4'],
    priority: 'NORMAL',
    category: 'SINH_HOAT',
    channels: ['ZALO', 'BANG_TIN'],
    senderName: 'Ban Điều hành Cụm Định Hòa',
    sentAt: '2026-09-21 16:40',
    readCount: 2210,
    totalTargetCount: 2500,
    status: 'SENT'
  }
];

// Initial Petitions
export const INITIAL_PETITIONS: NeighborhoodPetition[] = [
  {
    id: 'pet-01',
    code: 'PA-2026-081',
    residentName: 'Nguyễn Văn Minh',
    residentPhone: '0918.234.567',
    residentAddress: 'Số 42/3 đường DX-071, KP Tương Bình Hiệp 1',
    neighborhoodId: 'area-kp-1',
    neighborhoodName: 'Tương Bình Hiệp 1',
    groupNumber: 'Tổ 2',
    field: 'MOI_TRUONG',
    title: 'Tồn đọng nước mưa hố ga thoát nước đầu ngõ 42 đường DX-071',
    content: 'Sau cơn mưa lớn chiều qua, hố ga cống trước ngõ 42 có dấu hiệu bị tắc rác làm nước thoát chậm, gây mùi hôi. Kính đề nghị Ban cán sự khu phố cho kiểm tra và nạo vét khơi thông dòng chảy.',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?w=600&auto=format&fit=crop&q=80',
    submittedAt: '2026-09-24 16:30',
    status: 'RESOLVING',
    assignedOfficer: 'Đoàn Thị Bích Vân (Trưởng Ban CTMT KP1)',
    resolutionNote: 'Đã khảo sát thực tế sáng 25/09. Đã liên hệ đội môi trường đô thị bố trí xe hút bùn xử lý trong ngày.',
    resolutionDate: '2026-09-25 09:15'
  },
  {
    id: 'pet-02',
    code: 'PA-2026-082',
    residentName: 'Trần Văn Hòa',
    residentPhone: '0933.112.445',
    residentAddress: 'Hẻm 10 đường DX-075, KP Tương Bình Hiệp 2',
    neighborhoodId: 'area-kp-2',
    neighborhoodName: 'Tương Bình Hiệp 2',
    groupNumber: 'Tổ 3',
    field: 'CHIEU_SANG',
    title: 'Đèn chiếu sáng công cộng tại ngã ba hẻm 10 bị chập chờn',
    content: 'Bóng đèn đường chiếu sáng ngõ hẻm tại ngã ba đã chập chờn 3 đêm nay, gây khó khăn cho việc đi lại của người cao tuổi và tiềm ẩn nguy cơ an ninh trật tự.',
    submittedAt: '2026-09-23 20:10',
    status: 'RESOLVED',
    assignedOfficer: 'Lê Thị Thanh Loan (Trưởng Ban CTMT KP2)',
    resolutionNote: 'Ban điều hành khu phố cùng thợ điện đã thay thế bóng đèn LED 50W mới, hiện đèn đã hoạt động bình thường.',
    resolutionDate: '2026-09-24 10:00'
  },
  {
    id: 'pet-03',
    code: 'PA-2026-083',
    residentName: 'Lê Thị Thảo',
    residentPhone: '0977.890.123',
    residentAddress: 'Khu vực giáp ranh Tổ 1 & 2, KP Định Hòa 1',
    neighborhoodId: 'area-kp-11',
    neighborhoodName: 'Định Hòa 1',
    groupNumber: 'Tổ 1',
    field: 'TRAT_TU',
    title: 'Đề nghị nhắc nhở việc đổ vật liệu xây dựng lấn chiếm lối đi chung',
    content: 'Công trình xây dựng nhà số 18 tập kết gạch cát tràn ra ngõ hẹp làm các cháu học sinh đi xe đạp qua lại rất khó khăn.',
    submittedAt: '2026-09-24 08:20',
    status: 'VERIFYING',
    assignedOfficer: 'Nguyễn Thanh Vân (Trưởng Ban CTMT KP Định Hòa 1)',
    resolutionNote: 'Đang phối hợp Tổ quản lý trật tự đô thị đến nhắc nhở chủ hộ thu dọn gọn gàng trong 24 giờ.'
  },
  {
    id: 'pet-04',
    code: 'PA-2026-084',
    residentName: 'Phạm Đức Cường',
    residentPhone: '0972.113.442',
    residentAddress: 'Số 120 đường Nguyễn Chí Thanh, KP Tương Bình Hiệp 3',
    neighborhoodId: 'area-kp-3',
    neighborhoodName: 'Tương Bình Hiệp 3',
    groupNumber: 'Tổ 1',
    field: 'AN_SINH',
    title: 'Hỏi về việc cấp đổi thẻ BHYT diện đối tượng được trợ cấp an sinh',
    content: 'Tôi là người cao tuổi neo đơn, thẻ BHYT hết hạn cuối tháng 9, kính nhờ Ban điều hành khu phố hướng dẫn để không bị gián đoạn khám chữa bệnh.',
    submittedAt: '2026-09-25 07:45',
    status: 'RECEIVED',
    assignedOfficer: 'Nguyễn Văn An (Trưởng Ban CTMT KP3)',
    resolutionNote: 'Đã chuyển thông tin tới cán bộ Lao động - TB&XH phường để hỗ trợ gia hạn ngay.'
  }
];

// Initial Registrations (Cho người dân đăng ký)
export const INITIAL_REGISTRATIONS: NeighborhoodRegistration[] = [
  {
    id: 'reg-01',
    code: 'DK-2026-101',
    formType: 'GIA_DINH_VAN_HOA',
    title: 'Đăng ký xét tặng danh hiệu Gia đình văn hóa tiêu biểu 2026',
    residentName: 'Huỳnh Kim Oanh',
    residentPhone: '0938.990.112',
    residentCccd: '074186001234',
    address: 'Số 33 đường Nguyễn Văn Lộng, KP Chánh Mỹ 1',
    neighborhoodId: 'area-kp-20',
    neighborhoodName: 'Chánh Mỹ 1',
    groupNumber: 'Tổ 1',
    details: 'Gia đình chấp hành tốt chủ trương chính sách, con em chăm ngoan học giỏi, tự nguyện đóng góp quỹ an sinh.',
    submittedAt: '2026-09-22 10:15',
    status: 'APPROVED',
    scheduledDate: '2026-11-18 (Ngày hội Đại đoàn kết)',
    adminNote: 'Đạt đầy đủ 5 tiêu chuẩn theo quy chế xét duyệt của phường.',
    approvedBy: 'Đặng Mỹ Dung (Trưởng Ban CTMT)'
  },
  {
    id: 'reg-02',
    code: 'DK-2026-102',
    formType: 'HIEN_DAT_DONG_GOP',
    title: 'Đăng ký hiến 12m2 đất thổ cư để mở rộng tuyến hẻm bê tông DX-075',
    residentName: 'Lê Hoàng Long',
    residentPhone: '0937.445.678',
    residentCccd: '074089004523',
    address: 'Số 88/12 đường DX-075, KP Tương Bình Hiệp 2',
    neighborhoodId: 'area-kp-2',
    neighborhoodName: 'Tương Bình Hiệp 2',
    groupNumber: 'Tổ 3',
    details: 'Tự nguyện lùi hàng rào 1.2m theo chiều dài mặt tiền 10m để nâng cấp tuyến hẻm từ 3m lên 4.5m khang trang sạch đẹp.',
    submittedAt: '2026-09-23 15:40',
    status: 'APPROVED',
    scheduledDate: '2026-10-05 (Bắt đầu thi công)',
    adminNote: 'Hoan nghênh tinh thần vì cộng đồng. Đã lập biên bản bàn giao mặt bằng và đề xuất khen thưởng.',
    approvedBy: 'Lê Thị Thanh Loan (Trưởng Ban CTMT)'
  },
  {
    id: 'reg-03',
    code: 'DK-2026-103',
    formType: 'CAP_THUNG_RAC',
    title: 'Đăng ký cấp mới thùng rác nắp kín 240L phục vụ phân loại rác',
    residentName: 'Bùi Thanh Tùng',
    residentPhone: '0908.332.190',
    residentCccd: '074085006543',
    address: 'Số 203 đường Trần Ngọc Lên, KP Định Hòa 1',
    neighborhoodId: 'area-kp-11',
    neighborhoodName: 'Định Hòa 1',
    groupNumber: 'Tổ 1',
    details: 'Đăng ký nhận thùng rác mẫu xanh lá theo chương trình phân loại rác thải tại nguồn của phường.',
    submittedAt: '2026-09-24 09:30',
    status: 'PENDING',
    adminNote: 'Đang tổng hợp đợt 2 cùng 15 hộ khác để đơn vị môi trường giao tận nhà.'
  },
  {
    id: 'reg-04',
    code: 'DK-2026-104',
    formType: 'TAM_TRU_TAM_VANG',
    title: 'Khai báo tạm trú cho 3 lao động thuê trọ tại cơ sở sơn mài',
    residentName: 'Trần Thị Mai',
    residentPhone: '0903.882.119',
    residentCccd: '074175003421',
    address: 'Số 15 đường DX-072, KP Tương Bình Hiệp 1',
    neighborhoodId: 'area-kp-1',
    neighborhoodName: 'Tương Bình Hiệp 1',
    groupNumber: 'Tổ 1',
    details: 'Khai báo thông tin 3 công nhân thời vụ làm việc tại cơ sở thủ công mỹ nghệ.',
    submittedAt: '2026-09-25 08:10',
    status: 'PENDING',
    adminNote: 'Đã chuyển thông tin tới Cảnh sát khu vực để kiểm tra cư trú theo quy định.'
  }
];

// 21 Neighborhood Cadres
export const INITIAL_CADRES: NeighborhoodCadre[] = OFFICIAL_21_NEIGHBORHOODS.map(n => ({
  id: `cadre-${n.id}`,
  neighborhoodId: n.id,
  neighborhoodName: n.name,
  position: 'TRUONG_BAN_CTMT',
  positionLabel: n.leaderPosition || 'Trưởng Ban Công tác Mặt trận',
  fullName: n.leaderName,
  phone: n.phone,
  term: 'Khóa 2024 - 2029',
  isPartyMember: true
}));
