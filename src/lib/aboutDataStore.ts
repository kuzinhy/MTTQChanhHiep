export interface AboutPillar {
  id: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface StandingCommitteeMember {
  id: string;
  stt: number;
  unit: string;
  name: string;
  position: string;
  secondaryPosition?: string;
  avatarUrl?: string;
  isMainLeader?: boolean;
}

export interface AboutPageData {
  headerTitle: string;
  headerSubtitle: string;
  motto: string;
  termTitle: string;
  termSubtitle: string;
  address: string;
  hotline: string;
  email: string;
  pillars: AboutPillar[];
  members: StandingCommitteeMember[];
}

export const DEFAULT_ABOUT_DATA: AboutPageData = {
  headerTitle: 'Ủy Ban Mặt Trận Tổ Quốc Việt Nam Phường Chánh Hiệp',
  headerSubtitle: 'Cơ quan đại diện cho khối đại đoàn kết toàn dân tộc tại địa bàn Phường Chánh Hiệp, Thành phố Hồ Chí Minh; cầu nối vững chắc giữa Đảng, Chính quyền với các tầng lớp Nhân dân trên 21 khu phố.',
  motto: 'Đoàn Kết – Dân Chủ – Đồng Thuận – Phát Triển',
  termTitle: 'Ban Thường Trực Ủy Ban MTTQ Phường Khóa 1 (Nhiệm kỳ 2025 - 2030)',
  termSubtitle: 'ĐƠN VỊ CÔNG TÁC THƯỜNG TRỰC',
  address: 'Số 1240, đường Đại Lộ Bình Dương, Khu phố Định Hòa 5, phường Chánh Hiệp, Thành phố Hồ Chí Minh',
  hotline: '0989614614 (Đồng chí Nguyễn Xuân Kiều)',
  email: 'mttqvietnamphuongchanhhiep@gmail.com',
  pillars: [
    {
      id: 'pillar-1',
      title: 'Tập hợp Khối Đại Đoàn Kết',
      description: 'Tuyên truyền, vận động các tầng lớp nhân dân thực hiện chủ trương của Đảng, chính sách pháp luật của Nhà nước và các phong trào thi đua yêu nước tại cơ sở.',
      iconName: 'Users'
    },
    {
      id: 'pillar-2',
      title: 'Giám Sát & Phản Biện Xã Hội',
      description: 'Thực hiện quyền làm chủ của nhân dân, giám sát hoạt động của cơ quan nhà nước, cán bộ, đảng viên; tham gia đóng góp xây dựng Đảng và chính quyền trong sạch, vững mạnh.',
      iconName: 'ShieldCheck'
    },
    {
      id: 'pillar-3',
      title: 'Chăm Lo An Sinh Xã Hội',
      description: 'Vận động xây dựng Quỹ "Vì người nghèo", cứu trợ thiên tai, trao tặng nhà Đại đoàn kết và chăm lo các đối tượng yếu thế trên địa bàn 21 khu phố.',
      iconName: 'HeartHandshake'
    }
  ],
  members: [
    {
      id: 'member-1',
      stt: 1,
      unit: 'Ủy ban MTTQ VN phường',
      name: 'Nguyễn Công Lý',
      position: 'Chủ tịch UB MTTQ VN phường',
      isMainLeader: true
    },
    {
      id: 'member-2',
      stt: 2,
      unit: 'Ủy ban MTTQ VN phường',
      name: 'Trần Văn Phong',
      position: 'Phó Chủ tịch UB MTTQ VN phường',
      secondaryPosition: 'Chủ tịch Hội CCB phường'
    },
    {
      id: 'member-3',
      stt: 3,
      unit: 'Ủy ban MTTQ VN phường',
      name: 'Nguyễn Thị Trúc Chi',
      position: 'Phó Chủ tịch UB MTTQ VN phường',
      secondaryPosition: 'Chủ tịch công đoàn phường'
    },
    {
      id: 'member-4',
      stt: 4,
      unit: 'Ủy ban MTTQ VN phường',
      name: 'Phạm Thị Hồng Quế',
      position: 'Phó Chủ tịch UBMTTQ VN phường',
      secondaryPosition: 'Chủ tịch Hội LHPN phường'
    },
    {
      id: 'member-5',
      stt: 5,
      unit: 'Ủy ban MTTQ VN phường',
      name: 'Bùi Văn Huy',
      position: 'Bí thư Đoàn Thanh niên phường'
    }
  ]
};

const KEY_ABOUT_DATA = 'mttq_chanhhiep_about_data_v1';

export function loadStoredAboutData(): AboutPageData {
  if (typeof window === 'undefined') return DEFAULT_ABOUT_DATA;
  try {
    const raw = localStorage.getItem(KEY_ABOUT_DATA);
    if (!raw) return DEFAULT_ABOUT_DATA;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_ABOUT_DATA,
      ...parsed,
      pillars: Array.isArray(parsed.pillars) ? parsed.pillars : DEFAULT_ABOUT_DATA.pillars,
      members: Array.isArray(parsed.members) ? parsed.members : DEFAULT_ABOUT_DATA.members
    };
  } catch (err) {
    console.error('Error loading about page data:', err);
    return DEFAULT_ABOUT_DATA;
  }
}

export function saveStoredAboutData(data: AboutPageData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_ABOUT_DATA, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('mttq_about_data_updated', { detail: data }));
  } catch (err) {
    console.error('Error saving about page data:', err);
  }
}
