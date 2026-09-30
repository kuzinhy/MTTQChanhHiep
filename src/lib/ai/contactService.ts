import { ContactItem } from './types';

const CONTACTS_STORAGE_KEY = 'chanh_hiep_ai_contacts_v3';

export const INITIAL_OFFICIAL_CONTACTS: ContactItem[] = [
  {
    id: 'ct-huy-doan',
    name: 'Bùi Văn Huy',
    title: 'Bí thư Đoàn Thanh niên',
    department: 'Đoàn TNCS Hồ Chí Minh & Ban Thường trực MTTQ Phường',
    responsibility: 'Phụ trách phong trào thanh thiếu nhi, các hoạt động tình nguyện, an sinh xã hội, hiến máu và chuyển đổi số cộng đồng tại 21 khu phố.',
    phone: '0989614614',
    email: 'doanthanhnien.chanhhiep@gmail.com',
    address: 'Số 1240 Đại Lộ Bình Dương, KP Định Hòa 5, Phường Chánh Hiệp',
    topics: ['tinh_nguyen', 'doan_the', 'chuyen_doi_so', 'an_sinh'],
    public: true,
    active: true,
    avatarUrl: 'https://sv2.anhsieuviet.com/2026/09/05/z6603328537006_3f47e44b82f6fd1bef15706923268e61.jpg'
  },
  {
    id: 'ct-ly-mat-tran',
    name: 'Nguyễn Công Lý',
    title: 'Chủ tịch Ủy ban MTTQ Việt Nam phường',
    department: 'Ủy ban MTTQ Việt Nam Phường Chánh Hiệp',
    responsibility: 'Lãnh đạo toàn diện công tác Mặt trận, tập hợp khối đại đoàn kết toàn dân tộc, giám sát - phản biện xã hội và dân nguyện cử tri.',
    phone: '0989614614',
    email: 'mttqvietnamphuongchanhhiep@gmail.com',
    address: 'Số 1240 Đại Lộ Bình Dương, KP Định Hòa 5, Phường Chánh Hiệp',
    topics: ['van_ban', 'tiepdanso', 'phan_anh', 'an_sinh'],
    public: true,
    active: true,
    avatarUrl: 'https://sv2.anhsieuviet.com/2026/09/05/656671184_1329639585864840_6808310529982809241_n.jpg'
  },
  {
    id: 'ct-phong-ccb',
    name: 'Trần Văn Phong',
    title: 'Phó Chủ tịch MTTQ kiêm Chủ tịch Hội Cựu chiến binh',
    department: 'Hội Cựu chiến binh & Ban Thường trực MTTQ Phường',
    responsibility: 'Phụ trách công tác cựu chiến binh, phong trào đền ơn đáp nghĩa, gương sáng Cựu chiến binh gương mẫu tại 21 khu phố.',
    phone: '0989614614',
    email: 'hoiccb.chanhhiep@gmail.com',
    address: 'Số 1240 Đại Lộ Bình Dương, KP Định Hòa 5, Phường Chánh Hiệp',
    topics: ['doan_the', 'an_sinh', 'tiepdanso'],
    public: true,
    active: true,
    avatarUrl: 'https://sv2.anhsieuviet.com/2026/09/05/Thiet-ke-chua-co-ten-4.png'
  },
  {
    id: 'ct-chi-cong-doan',
    name: 'Nguyễn Thị Trúc Chi',
    title: 'Phó Chủ tịch MTTQ kiêm Chủ tịch Công đoàn',
    department: 'Công đoàn Phường & Ban Thường trực MTTQ Phường',
    responsibility: 'Phụ trách công tác công đoàn, phong trào công nhân viên chức - người lao động và bảo trợ xã hội.',
    phone: '0989614614',
    email: 'congdoan.chanhhiep@gmail.com',
    address: 'Số 1240 Đại Lộ Bình Dương, KP Định Hòa 5, Phường Chánh Hiệp',
    topics: ['an_sinh', 'doan_the'],
    public: true,
    active: true,
    avatarUrl: 'https://sv2.anhsieuviet.com/2026/09/05/1756517483138_183541955972247973_5059442926877888287_b65946a2e662f6b0f24f3db7157aae0b40b2e854dc5dde7a.jpg'
  },
  {
    id: 'ct-que-phu-nu',
    name: 'Phạm Thị Hồng Quế',
    title: 'Phó Chủ tịch MTTQ kiêm Chủ tịch Hội Phụ nữ',
    department: 'Hội Liên hiệp Phụ nữ & Ban Thường trực MTTQ Phường',
    responsibility: 'Phụ trách phong trào phụ nữ, bình đẳng giới, xây dựng gia đình hạnh phúc và chăm lo trẻ em có hoàn cảnh khó khăn.',
    phone: '0989614614',
    email: 'hoiphunu.chanhhiep@gmail.com',
    address: 'Số 1240 Đại Lộ Bình Dương, KP Định Hòa 5, Phường Chánh Hiệp',
    topics: ['an_sinh', 'doan_the', 'phan_anh'],
    public: true,
    active: true,
    avatarUrl: 'https://sv2.anhsieuviet.com/2026/09/05/1759245766573_183541955972247973_6357347805632093712_1fdacd72fbda014a852213fac3db646cd8965914de8f9168.jpg'
  },
  {
    id: 'ct-huy-van-phong',
    name: 'Nguyễn Huy',
    title: 'Cán bộ Thường trực Mặt trận / Công nghệ số',
    department: 'Văn phòng Thường trực Ủy ban MTTQ Phường',
    responsibility: 'Phụ trách tham mưu công nghệ thông tin, quản trị cổng thông tin điện tử và tiếp nhận phản ánh dân sinh trực tuyến.',
    phone: '0989614614',
    email: 'nguyenhuy.thudaumot@gmail.com',
    address: 'Số 1240 Đại Lộ Bình Dương, KP Định Hòa 5, Phường Chánh Hiệp',
    topics: ['phan_anh', 'chuyen_doi_so', 'van_ban', 'ban_do'],
    public: true,
    active: true
  }
];

export class ContactService {
  public static getAll(): ContactItem[] {
    return ContactService.getAllContacts();
  }

  public static getAllContacts(): ContactItem[] {
    try {
      const raw = localStorage.getItem(CONTACTS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Error loading contacts, using defaults:', e);
    }
    return INITIAL_OFFICIAL_CONTACTS;
  }

  public static saveContacts(contacts: ContactItem[]): void {
    try {
      localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
    } catch (e) {
      console.warn('Error saving contacts:', e);
    }
  }

  public static findContactByTopic(topic?: string): ContactItem | undefined {
    const contacts = ContactService.getAllContacts().filter(c => c.active && c.public);
    if (!topic) return contacts.find(c => c.id === 'ct-ly-mat-tran') || contacts[0];

    const t = topic.toLowerCase();
    if (t.includes('tinh_nguyen') || t.includes('tình nguyện') || t.includes('đoàn') || t.includes('thanh niên')) {
      return contacts.find(c => c.topics.includes('tinh_nguyen')) || contacts.find(c => c.name.includes('Bùi Văn Huy'));
    }
    if (t.includes('an_sinh') || t.includes('bảo trợ') || t.includes('hộ nghèo') || t.includes('bữa cơm')) {
      return contacts.find(c => c.topics.includes('an_sinh'));
    }
    if (t.includes('phan_anh') || t.includes('phản ánh') || t.includes('kiến nghị') || t.includes('rác') || t.includes('trật tự')) {
      return contacts.find(c => c.topics.includes('phan_anh'));
    }
    if (t.includes('van_ban') || t.includes('văn bản') || t.includes('thủ tục')) {
      return contacts.find(c => c.topics.includes('van_ban'));
    }

    return contacts[0];
  }

  public static searchContacts(keyword: string): ContactItem[] {
    const k = keyword.toLowerCase().trim();
    if (!k) return ContactService.getAllContacts();
    return ContactService.getAllContacts().filter(c => 
      c.active && c.public && (
        c.name.toLowerCase().includes(k) ||
        c.title.toLowerCase().includes(k) ||
        c.department.toLowerCase().includes(k) ||
        c.responsibility.toLowerCase().includes(k) ||
        c.topics.some(tp => tp.toLowerCase().includes(k))
      )
    );
  }
}
