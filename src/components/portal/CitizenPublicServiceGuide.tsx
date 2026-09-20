import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Phone, 
  ShieldCheck, 
  HelpCircle, 
  ExternalLink,
  ChevronRight,
  ChevronDown,
  UserCheck,
  HeartHandshake,
  Smartphone,
  Scale,
  Building,
  Sparkles,
  AlertCircle,
  Download,
  Copy,
  Check,
  Star,
  Printer,
  RefreshCw,
  Share2,
  Users,
  MapPin,
  Flame,
  Activity,
  Award,
  Filter,
  Eye,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PublicOpinion } from '../../types';
import { OFFICIAL_21_NEIGHBORHOODS } from '../../data/neighborhoodsList';

export interface PublicProcedure {
  id: string;
  code: string;
  title: string;
  category: 'AN_SINH' | 'DAN_NGUYEN' | 'CHUYEN_DOI_SO' | 'PHAP_LUAT' | 'TINH_NGUYEN' | 'GIAM_SAT' | 'VAN_HOA';
  categoryLabel: string;
  badgeColor: string;
  processingTime: string;
  authority: string;
  summary: string;
  steps: { title: string; desc: string }[];
  requiredDocs: string[];
  sampleFormName?: string;
  sampleFormUrl?: string;
  actionLabel?: string;
  actionTab?: string;
}

export const PROCEDURES_DATA: PublicProcedure[] = [
  {
    id: 'proc-1',
    code: 'TTHC-MTTQ-01',
    title: 'Tiếp nhận & Xử lý Ý kiến cử tri, Phản ánh an sinh xã hội và trật tự đô thị',
    category: 'DAN_NGUYEN',
    categoryLabel: 'Dân nguyện - Phản ánh',
    badgeColor: 'bg-orange-600 text-white',
    processingTime: '03 - 05 ngày làm việc',
    authority: 'Ban Thường trực Ủy ban MTTQ & UBND Phường Chánh Hiệp',
    summary: 'Quy trình tiếp nhận trực tuyến các ý kiến đóng góp, kiến nghị, phản ánh về môi trường, an ninh trật tự, an sinh xã hội từ nhân dân 21 khu phố.',
    steps: [
      { title: 'Bước 1: Tiếp nhận phản ánh', desc: 'Công dân gửi phản ánh qua Cổng trực tuyến, Zalo Mini App hoặc trực tiếp tại 21 Ban Công tác Mặt trận khu phố.' },
      { title: 'Bước 2: Phân loại & Xác minh', desc: 'Thường trực MTTQ thẩm tra thông tin và phân loại theo thẩm quyền trong vòng 24 giờ kể từ khi tiếp nhận.' },
      { title: 'Bước 3: Chuyển xử lý', desc: 'Chuyển UBND phường, Công an phường hoặc Ban Giám sát đầu tư của cộng đồng để xử lý dứt điểm.' },
      { title: 'Bước 4: Phản hồi công khai', desc: 'Công khai kết quả giải quyết trên Cổng thông tin và gửi tin nhắn thông báo trực tiếp đến công dân.' }
    ],
    requiredDocs: [
      'Nội dung phản ánh rõ ràng, địa điểm cụ thể tại phường Chánh Hiệp',
      'Hình ảnh hoặc video minh chứng kèm theo (nếu có)',
      'Họ tên và số điện thoại liên hệ của người gửi (hoặc gửi ẩn danh)'
    ],
    sampleFormName: 'Phiếu tiếp nhận ý kiến cử tri và nhân dân (Mẫu 01/DN)',
    actionLabel: 'Gửi phản ánh trực tuyến ngay',
    actionTab: 'opinion'
  },
  {
    id: 'proc-2',
    code: 'TTHC-MTTQ-02',
    title: 'Đăng ký tham gia Tình nguyện viên & Tổ Công nghệ số cộng đồng 21 Khu phố',
    category: 'TINH_NGUYEN',
    categoryLabel: 'Tình nguyện - Số hóa',
    badgeColor: 'bg-emerald-600 text-white',
    processingTime: 'Tiếp nhận & Cấp mã thẻ số tức thì',
    authority: 'Ủy ban MTTQ & Đoàn Thanh niên Phường Chánh Hiệp',
    summary: 'Đăng ký tham gia lực lượng xung kích hỗ trợ người cao tuổi cài đặt VNeID, hỗ trợ Ngày Chủ nhật xanh, đền ơn đáp nghĩa và an sinh xã hội.',
    steps: [
      { title: 'Bước 1: Kê khai trực tuyến', desc: 'Điền thông tin trực tuyến gồm họ tên, khu phố cư trú, chuyên môn/thời gian rảnh.' },
      { title: 'Bước 2: Cấp thẻ số', desc: 'Hệ thống tự động phê duyệt và cấp Mã định danh Tình nguyện viên số Chánh Hiệp.' },
      { title: 'Bước 3: Điều phối hoạt động', desc: 'Ban chỉ đạo liên hệ và phân bổ vào Tổ Công nghệ số hoặc Đội hình thanh niên tình nguyện 21 khu phố.' }
    ],
    requiredDocs: [
      'Thông tin cá nhân cơ bản và số điện thoại liên lạc',
      'Lựa chọn khu phố cư trú và lĩnh vực mong muốn đóng góp sức trẻ'
    ],
    sampleFormName: 'Đơn đăng ký Tình nguyện viên vì cộng đồng (Mẫu 02/TNV)',
    actionLabel: 'Đăng ký Tình nguyện viên',
    actionTab: 'volunteer'
  },
  {
    id: 'proc-3',
    code: 'TTHC-MTTQ-03',
    title: 'Ủng hộ Quỹ "Vì người nghèo" & Các chương trình cứu trợ an sinh xã hội',
    category: 'AN_SINH',
    categoryLabel: 'An sinh xã hội',
    badgeColor: 'bg-rose-600 text-white',
    processingTime: 'Ghi nhận và cấp biên lai điện tử tức thì',
    authority: 'Ban Vận động Quỹ Vì người nghèo Phường Chánh Hiệp',
    summary: 'Đóng góp nguồn lực ủng hộ xây tặng Nhà Đại đoàn kết, trao học bổng cho học sinh nghèo hiếu học và trợ cấp đột xuất hộ có hoàn cảnh khó khăn.',
    steps: [
      { title: 'Bước 1: Lựa chọn hình thức', desc: 'Chuyển khoản qua tài khoản Kho bạc/Ngân hàng chính thức của MTTQ hoặc đóng góp trực tiếp.' },
      { title: 'Bước 2: Cập nhật minh bạch', desc: 'Hệ thống tự động ghi nhận vào Bảng vinh danh tấm lòng vàng số công khai, minh bạch.' },
      { title: 'Bước 3: Trao tận tay đối tượng', desc: 'Ban Vận động phối hợp 21 Ban CTMT tổ chức trao hỗ trợ đúng đối tượng, có sự giám sát của nhân dân.' }
    ],
    requiredDocs: [
      'Thông tin tổ chức / cá nhân ủng hộ',
      'Nội dung chuyển khoản ghi rõ: [Tên] + Ung ho Quy Vi nguoi ngheo Chanh Hiep'
    ],
    sampleFormName: 'Thư ngỏ & Biên nhận ủng hộ Quỹ Vì người nghèo (Mẫu 03/AS)',
    actionLabel: 'Xem chi tiết các chương trình An sinh',
    actionTab: 'initiatives'
  },
  {
    id: 'proc-4',
    code: 'TTHC-MTTQ-04',
    title: 'Hướng dẫn Kích hoạt VNeID Mức 2 & Nộp hồ sơ Dịch vụ công Quốc gia',
    category: 'CHUYEN_DOI_SO',
    categoryLabel: 'Chuyển đổi số',
    badgeColor: 'bg-blue-600 text-white',
    processingTime: 'Hỗ trợ trực tiếp tại 21 Nhà Văn hóa Khu phố',
    authority: 'Tổ Đề án 06 & Ban Công tác Mặt trận 21 Khu phố',
    summary: 'Hướng dẫn nhân dân thực hiện các thủ tục hành chính không giấy tờ, tra cứu BHYT điện tử, đăng ký tạm trú, cấp bản sao hộ tịch trực tuyến 24/7.',
    steps: [
      { title: 'Bước 1: Thu nhận định danh', desc: 'Đến Công an Phường Chánh Hiệp hoặc các điểm lưu động để thu nhận định danh Mức 2.' },
      { title: 'Bước 2: Kích hoạt ứng dụng', desc: 'Kích hoạt tài khoản trên ứng dụng VNeID bằng mã OTP gửi về số điện thoại chính chủ.' },
      { title: 'Bước 3: Nộp hồ sơ DVC', desc: 'Đăng nhập Cổng Dịch vụ công Quốc gia để nộp hồ sơ trực tuyến thuận tiện, tiết kiệm thời gian.' }
    ],
    requiredDocs: [
      'Thẻ Căn cước công dân gắn chip',
      'Số điện thoại di động chính chủ đã đăng ký với nhà mạng bằng CCCD'
    ],
    sampleFormName: 'Cẩm nang Hướng dẫn sử dụng VNeID & Dịch vụ công số',
    actionLabel: 'Truy cập Cổng Dịch vụ công Quốc gia',
    actionTab: 'https://dichvucong.gov.vn'
  },
  {
    id: 'proc-5',
    code: 'TTHC-MTTQ-05',
    title: 'Tư vấn pháp luật miễn phí & Hòa giải tranh chấp cơ sở tại 21 Khu phố',
    category: 'PHAP_LUAT',
    categoryLabel: 'Tư vấn & Hòa giải',
    badgeColor: 'bg-purple-600 text-white',
    processingTime: 'Trong vòng 07 ngày kể từ khi tiếp nhận yêu cầu',
    authority: 'Tổ Hòa giải cơ sở 21 Khu phố & Hội đồng tư vấn Dân chủ - Pháp luật',
    summary: 'Hỗ trợ giải quyết hòa giải các mâu thuẫn dân sự, tranh chấp ranh giới đất đai, hôn nhân gia đình, giữ gìn tình làng nghĩa xóm bình yên.',
    steps: [
      { title: 'Bước 1: Tiếp nhận yêu cầu', desc: 'Gửi phiếu yêu cầu hòa giải đến Ban Công tác Mặt trận hoặc Tổ trưởng Tổ dân phố.' },
      { title: 'Bước 2: Tìm hiểu nguyên nhân', desc: 'Tổ hòa giải gặp gỡ các bên, xác minh nguồn cơn tranh chấp và các căn cứ pháp lý.' },
      { title: 'Bước 3: Tổ chức phiên hòa giải', desc: 'Tổ chức buổi hòa giải trên tinh thần thấu tình đạt lý, tôn trọng pháp luật và quy ước khu phố.' }
    ],
    requiredDocs: [
      'Đơn yêu cầu hòa giải cơ sở (theo mẫu quy định)',
      'Các giấy tờ, tài liệu liên quan đến vụ việc tranh chấp (nếu có)'
    ],
    sampleFormName: 'Đơn yêu cầu hòa giải tranh chấp tại khu dân cư (Mẫu 05/HG)',
    actionLabel: 'Gửi yêu cầu tư vấn pháp luật',
    actionTab: 'opinion'
  },
  {
    id: 'proc-6',
    code: 'TTHC-MTTQ-06',
    title: 'Đăng ký xét tặng danh hiệu "Gia đình Văn hóa" & "Khu phố Văn hóa"',
    category: 'VAN_HOA',
    categoryLabel: 'Văn hóa - Đời sống',
    badgeColor: 'bg-teal-600 text-white',
    processingTime: 'Định kỳ bình xét vào dịp Ngày hội Đại đoàn kết 18/11 hàng năm',
    authority: 'Ban Vận động Toàn dân đoàn kết xây dựng đời sống văn hóa Phường',
    summary: 'Quy trình đăng ký, bình xét và tôn vinh các hộ gia đình gương mẫu chấp hành tốt chủ trương, chính sách và tích cực tham gia các phong trào địa phương.',
    steps: [
      { title: 'Bước 1: Đăng ký đầu năm', desc: 'Hộ gia đình ký cam kết thực hiện các tiêu chí Gia đình văn hóa với Tổ dân phố.' },
      { title: 'Bước 2: Tự đánh giá & Bình xét', desc: 'Ban CTMT tổ chức họp bình xét dân chủ, công khai tại Nhà văn hóa khu phố.' },
      { title: 'Bước 3: Quyết định & Tôn vinh', desc: 'UBND Phường ban hành quyết định công nhận và trao giấy khen trong Ngày hội Đại đoàn kết 18/11.' }
    ],
    requiredDocs: [
      'Bản đăng ký xây dựng Gia đình văn hóa theo tiêu chuẩn mới',
      'Phiếu tự chấm điểm các tiêu chí của hộ gia đình'
    ],
    sampleFormName: 'Bản cam kết & Tiêu chuẩn Gia đình văn hóa',
    actionLabel: 'Xem hướng dẫn phong trào Văn hóa',
    actionTab: 'about'
  },
  {
    id: 'proc-7',
    code: 'TTHC-MTTQ-07',
    title: 'Giám sát Đầu tư của Cộng đồng đối với các công trình dân sinh trên địa bàn',
    category: 'GIAM_SAT',
    categoryLabel: 'Giám sát cộng đồng',
    badgeColor: 'bg-amber-600 text-white',
    processingTime: 'Theo suốt quá trình thi công và nghiệm thu công trình',
    authority: 'Ban Giám sát đầu tư của cộng đồng Phường Chánh Hiệp',
    summary: 'Nhân dân tham gia giám sát chất lượng thi công, tiến độ, an toàn lao động và bảo vệ môi trường đối với các dự án nâng cấp đường, hẻm, cống thoát nước.',
    steps: [
      { title: 'Bước 1: Công khai thông tin', desc: 'Chủ đầu tư công khai biển báo thông tin dự án, quy mô và đơn vị thi công tại khu dân cư.' },
      { title: 'Bước 2: Giám sát tại hiện trường', desc: 'Ban Giám sát cộng đồng và nhân dân theo dõi quá trình đào đắp, rải đá, đổ bê tông.' },
      { title: 'Bước 3: Lập biên bản kiến nghị', desc: 'Nếu phát hiện sai phạm hoặc vật tư kém chất lượng, lập biên bản yêu cầu dừng thi công để khắc phục.' }
    ],
    requiredDocs: [
      'Phiếu ghi nhận ý kiến giám sát của công dân',
      'Hình ảnh hoặc video hiện trường phản ánh sai phạm kỹ thuật'
    ],
    sampleFormName: 'Phiếu kiến nghị của Ban Giám sát đầu tư của cộng đồng',
    actionLabel: 'Gửi phản ánh giám sát công trình',
    actionTab: 'supervision'
  }
];

// Curated FAQs for citizens
interface CitizenFaq {
  q: string;
  a: string;
  category: string;
}

const CITIZEN_FAQS: CitizenFaq[] = [
  {
    category: 'Dân nguyện',
    q: 'Tôi gửi ý kiến phản ánh về tình trạng ngập nước thì bao lâu có kết quả?',
    a: 'Theo Quy chế tiếp nhận phản ánh của Ủy ban MTTQ Phường Chánh Hiệp, trong vòng 24 giờ ý kiến sẽ được xác minh và chuyển đến cơ quan chuyên môn (UBND phường hoặc Đội quản lý trật tự đô thị). Thời gian xử lý và phản hồi dứt điểm cho cử tri từ 03 đến 05 ngày làm việc.'
  },
  {
    category: 'VNeID & DVC',
    q: 'Làm thế nào để kích hoạt định danh điện tử VNeID Mức 2 khi chưa có thời gian lên phường?',
    a: 'Bà con có thể liên hệ Tổ Công nghệ số cộng đồng tại khu phố mình đang cư trú hoặc theo dõi lịch cấp lưu động vào các buổi tối/cuối tuần tại Nhà văn hóa 21 khu phố. Lực lượng tình nguyện viên sẽ hỗ trợ tận nhà đối với người cao tuổi, người khuyết tật.'
  },
  {
    category: 'An sinh xã hội',
    q: 'Tiêu chuẩn xét tặng Nhà Đại đoàn kết tại Phường Chánh Hiệp như thế nào?',
    a: 'Đối tượng được xét tặng là hộ nghèo, hộ cận nghèo có đất ở hợp pháp nhưng nhà ở bị hư hỏng dột nát nghiêm trọng, không có khả năng tự xây sửa. Hồ sơ được Ban CTMT khu phố đề xuất, họp bình xét công khai và Thường trực MTTQ thẩm định thực tế.'
  },
  {
    category: 'Tình nguyện',
    q: 'Tham gia Tình nguyện viên MTTQ Phường có được cấp giấy chứng nhận không?',
    a: 'Có. Mọi thành viên tham gia tích cực các chiến dịch (Ngày Chủ nhật xanh, hỗ trợ VNeID, hỗ trợ Ngày hội Đại đoàn kết) đều được cấp Thẻ số hóa và Giấy chứng nhận công nhận đóng góp vì cộng đồng từ Ủy ban MTTQ Phường.'
  }
];

// Fallback sample petitions for tracker demo if opinions state is empty
const DEMO_PETITIONS: PublicOpinion[] = [
  {
    id: 'demo-1',
    receiptCode: 'PA-2026-CH01',
    topic: 'Vấn đề dân sinh',
    content: 'Kiến nghị nâng cấp hệ thống cống thoát nước và đèn chiếu sáng hẻm 45 đường ĐX-034',
    neighborhood: 'Khu phố 4',
    fullname: 'Lê Minh Tuấn',
    phone: '0918.234.567',
    isAnonymous: false,
    status: 'RESOLVED',
    priority: 'NORMAL',
    assignedTo: 'UBND Phường & Ban Giám sát ĐTCCĐ',
    adminResponse: 'Đã hoàn thành nạo vét cống thoát nước ngày 18/09/2026. Lắp mới 03 bóng đèn LED chiếu sáng tiết kiệm điện.',
    createdAt: '2026-09-12 08:30',
    updatedAt: '2026-09-18 16:45'
  },
  {
    id: 'demo-2',
    receiptCode: 'PA-2026-CH02',
    topic: 'Trật tự an toàn',
    content: 'Đề xuất gắn thêm camera an ninh tại giao lộ đường ĐX-034 kết nối đường Nguyễn Đức Thuận',
    neighborhood: 'Khu phố 9',
    fullname: 'Đại diện nhân dân Tổ 12',
    phone: '0903.889.112',
    isAnonymous: false,
    status: 'PROCESSING',
    priority: 'HIGH',
    assignedTo: 'Công an Phường & Ban CTMT Khu phố 9',
    adminResponse: 'Đã đưa vào danh mục lắp đặt camera an ninh xã hội hóa quý IV/2026. Dự kiến thi công trước ngày 15/10/2026.',
    createdAt: '2026-09-15 14:10',
    updatedAt: '2026-09-17 09:20'
  },
  {
    id: 'demo-3',
    receiptCode: 'PA-2026-CH03',
    topic: 'Môi trường & Đô thị',
    content: 'Phản ánh điểm tập kết rác thải tự phát gây mất vệ sinh môi trường góc đường Bùi Ngọc Thu',
    neighborhood: 'Khu phố 14',
    fullname: 'Nguyễn Thị Thu',
    phone: '0989.123.456',
    isAnonymous: false,
    status: 'RESOLVED',
    priority: 'URGENT',
    assignedTo: 'Đoàn Thanh niên & MTTQ Khu phố 14',
    adminResponse: 'Ra quân Ngày Chủ nhật xanh thu gom 1.2 tấn rác, trồng bồn hoa xóa điểm đen rác và bàn giao tổ dân phố tự quản.',
    createdAt: '2026-09-18 07:15',
    updatedAt: '2026-09-19 11:30'
  }
];

interface CitizenPublicServiceGuideProps {
  opinions?: PublicOpinion[];
  onSelectTab: (tab: string) => void;
  onOpenVolunteerModal: () => void;
  onOpenDirectory?: () => void;
}

export const CitizenPublicServiceGuide: React.FC<CitizenPublicServiceGuideProps> = ({
  opinions = [],
  onSelectTab,
  onOpenVolunteerModal,
  onOpenDirectory
}) => {
  // Tabs & Filters
  const [activeMainTab, setActiveMainTab] = useState<'PROCEDURES' | 'TRACKER' | 'HOTLINE' | 'FAQ'>('PROCEDURES');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeProcId, setActiveProcId] = useState<string>('proc-1');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Tracker State
  const [searchTrackingCode, setSearchTrackingCode] = useState<string>('');
  const [selectedNeighborhoodFilter, setSelectedNeighborhoodFilter] = useState<string>('ALL');
  const [searchedOpinion, setSearchedOpinion] = useState<PublicOpinion | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [feedbackRating, setFeedbackRating] = useState<Record<string, number>>({});

  // Hotline Search
  const [hotlineSearch, setHotlineSearch] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Combine dynamic opinions with demo seed data for realistic search
  const allTrackingOpinions = useMemo(() => {
    const combined = [...opinions];
    DEMO_PETITIONS.forEach(demo => {
      if (!combined.some(o => o.receiptCode === demo.receiptCode)) {
        combined.push(demo);
      }
    });
    return combined;
  }, [opinions]);

  const filteredProcedures = useMemo(() => {
    return PROCEDURES_DATA.filter((p) => {
      return selectedCategory === 'ALL' || p.category === selectedCategory;
    });
  }, [selectedCategory]);

  const activeProcedure = PROCEDURES_DATA.find((p) => p.id === activeProcId) || PROCEDURES_DATA[0];

  // Search handler for Opinion Tracker
  const handleSearchPetition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTrackingCode.trim()) return;
    setHasSearched(true);
    const query = searchTrackingCode.trim().toLowerCase();
    
    const found = allTrackingOpinions.find((item) => {
      const codeMatch = item.receiptCode.toLowerCase().includes(query);
      const nameMatch = item.fullname ? item.fullname.toLowerCase().includes(query) : false;
      const neighborhoodMatch = item.neighborhood.toLowerCase().includes(query);
      const contentMatch = item.content.toLowerCase().includes(query);
      return codeMatch || nameMatch || neighborhoodMatch || contentMatch;
    });

    setSearchedOpinion(found || null);
  };

  const handleActionClick = (tabOrUrl?: string) => {
    if (!tabOrUrl) return;
    if (tabOrUrl === 'volunteer') {
      onOpenVolunteerModal();
    } else if (tabOrUrl.startsWith('http')) {
      window.open(tabOrUrl, '_blank', 'noopener,noreferrer');
    } else {
      onSelectTab(tabOrUrl);
    }
  };

  const handleCopy = (text: string, codeKey: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCode(codeKey);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const handleRate = (code: string, star: number) => {
    setFeedbackRating(prev => ({ ...prev, [code]: star }));
  };

  // Filter 21 neighborhoods for hotline
  const filteredNeighborhoods = useMemo(() => {
    if (!hotlineSearch.trim()) return OFFICIAL_21_NEIGHBORHOODS;
    const q = hotlineSearch.toLowerCase().trim();
    return OFFICIAL_21_NEIGHBORHOODS.filter(n => 
      n.name.toLowerCase().includes(q) ||
      n.leaderName.toLowerCase().includes(q) ||
      n.leaderPosition.toLowerCase().includes(q) ||
      n.phone.includes(q)
    );
  }, [hotlineSearch]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return { label: 'Đã hoàn thành & Phản hồi', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', step: 4 };
      case 'FORWARDED':
      case 'PROCESSING':
        return { label: 'Đang phối hợp xử lý', color: 'bg-blue-100 text-blue-800 border-blue-300', step: 3 };
      case 'NEW':
      default:
        return { label: 'Đã tiếp nhận & Thẩm tra', color: 'bg-amber-100 text-amber-800 border-amber-300', step: 2 };
    }
  };

  return (
    <section id="citizen-services-suite" className="space-y-6 pt-4">
      
      {/* 1. Header Section */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-[#0068ff] rounded-xs shrink-0" />
              <span className="text-[11px] font-black uppercase text-[#0068ff] tracking-wider">
                TRUNG TÂM PHỤC VỤ HÀNH CHÍNH &amp; DÂN NGUYỆN SỐ
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Cẩm nang Dịch vụ Công, Tra cứu Dân nguyện &amp; Đường dây nóng 24/7
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-3xl">
              Hệ thống hướng dẫn quy trình TTHC Mặt trận chuẩn hóa, theo dõi minh bạch tiến độ giải quyết ý kiến cử tri và liên lạc nhanh các lực lượng cơ sở 21 khu phố phường Chánh Hiệp.
            </p>
          </div>

          {/* Quick Direct Emergency Trigger */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <a
              href="tel:02743822123"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Đường dây nóng MTTQ: 0274.3822.123</span>
            </a>
          </div>
        </div>

        {/* 4 Key Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveMainTab('PROCEDURES')}
            className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-3 border ${
              activeMainTab === 'PROCEDURES'
                ? 'bg-blue-50/80 border-blue-200 text-[#0068ff] shadow-2xs font-bold'
                : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/60 text-slate-700 font-medium'
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 ${activeMainTab === 'PROCEDURES' ? 'bg-[#0068ff] text-white' : 'bg-slate-200 text-slate-600'}`}>
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Mục 2</span>
              <span className="text-xs font-black truncate block">Cẩm nang TTHC Số</span>
            </div>
          </button>

          <button
            onClick={() => setActiveMainTab('TRACKER')}
            className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-3 border ${
              activeMainTab === 'TRACKER'
                ? 'bg-orange-50/80 border-orange-200 text-orange-700 shadow-2xs font-bold'
                : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/60 text-slate-700 font-medium'
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 ${activeMainTab === 'TRACKER' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              <Search className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Mục 3</span>
              <span className="text-xs font-black truncate block">Tra cứu Ý kiến Cử tri</span>
            </div>
          </button>

          <button
            onClick={() => setActiveMainTab('HOTLINE')}
            className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-3 border ${
              activeMainTab === 'HOTLINE'
                ? 'bg-rose-50/80 border-rose-200 text-rose-700 shadow-2xs font-bold'
                : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/60 text-slate-700 font-medium'
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 ${activeMainTab === 'HOTLINE' ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              <Phone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Mục 4</span>
              <span className="text-xs font-black truncate block">Đường dây nóng 24/7</span>
            </div>
          </button>

          <button
            onClick={() => setActiveMainTab('FAQ')}
            className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-3 border ${
              activeMainTab === 'FAQ'
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-700 shadow-2xs font-bold'
                : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/60 text-slate-700 font-medium'
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 ${activeMainTab === 'FAQ' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Hỏi đáp</span>
              <span className="text-xs font-black truncate block">Hỏi đáp Nhân dân</span>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAB 1: CẨM NANG DỊCH VỤ CÔNG & HƯỚNG DẪN TTHC SỐ */}
      {/* ========================================================================= */}
      {activeMainTab === 'PROCEDURES' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* Left: Procedure List & Filter (4.5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'ALL', label: 'Tất cả (7)' },
                { id: 'DAN_NGUYEN', label: 'Dân nguyện' },
                { id: 'TINH_NGUYEN', label: 'Tình nguyện' },
                { id: 'AN_SINH', label: 'An sinh' },
                { id: 'CHUYEN_DOI_SO', label: 'VNeID & DVC' },
                { id: 'PHAP_LUAT', label: 'Hòa giải' },
                { id: 'GIAM_SAT', label: 'Giám sát' },
                { id: 'VAN_HOA', label: 'Văn hóa' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === tab.id
                      ? 'bg-[#0068ff] text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* List of Procedures */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredProcedures.map((proc) => {
                const isActive = proc.id === activeProcedure.id;
                return (
                  <button
                    key={proc.id}
                    onClick={() => setActiveProcId(proc.id)}
                    className={`w-full p-3.5 rounded-2xl text-left transition-all cursor-pointer border flex items-start justify-between gap-3 ${
                      isActive
                        ? 'bg-blue-50/90 border-blue-300 text-blue-950 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {proc.code}
                        </span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${proc.badgeColor}`}>
                          {proc.categoryLabel}
                        </span>
                      </div>
                      <h4 className="text-xs font-black leading-snug line-clamp-2">
                        {proc.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{proc.processingTime}</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 mt-2 transition-transform ${isActive ? 'text-[#0068ff] translate-x-0.5' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Full Procedure Details (7.5 cols) */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide ${activeProcedure.badgeColor}`}>
                  {activeProcedure.categoryLabel}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Mã TTHC: <strong className="text-slate-800 font-mono">{activeProcedure.code}</strong>
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-black text-slate-900 leading-snug">
                {activeProcedure.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2 font-medium">
                {activeProcedure.summary}
              </p>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400 font-bold text-[10px] uppercase">Thời gian giải quyết:</span>
                <span className="font-black text-blue-900 flex items-center gap-1.5 text-xs">
                  <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  {activeProcedure.processingTime}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-400 font-bold text-[10px] uppercase">Cơ quan chủ trì:</span>
                <span className="font-black text-blue-900 flex items-center gap-1.5 text-xs">
                  <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  {activeProcedure.authority}
                </span>
              </div>
            </div>

            {/* Step-by-Step Flow */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Quy trình 4 bước thực hiện chuẩn hóa:</span>
              </h4>
              <div className="space-y-2.5">
                {activeProcedure.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black flex items-center justify-center shrink-0 text-xs shadow-2xs mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-black text-slate-900">{step.title}</h5>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Documents Checklist */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Thành phần hồ sơ &amp; Giấy tờ cần chuẩn bị:
              </h4>
              <div className="space-y-2">
                {activeProcedure.requiredDocs.map((doc, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Downloadable Sample Form */}
            {activeProcedure.sampleFormName && (
              <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <span className="font-black text-amber-900 block">{activeProcedure.sampleFormName}</span>
                    <span className="text-[11px] text-amber-700">Mẫu biểu chuẩn do Ủy ban MTTQ ban hành</span>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Đã tải về biểu mẫu: ${activeProcedure.sampleFormName}`)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs inline-flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải mẫu biểu</span>
                </button>
              </div>
            )}

            {/* Action Trigger */}
            {activeProcedure.actionLabel && (
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => handleActionClick(activeProcedure.actionTab)}
                  className="px-5 py-2.5 rounded-xl bg-[#0068ff] hover:bg-blue-700 text-white text-xs font-black transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>{activeProcedure.actionLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB 2: HỆ THỐNG TRA CỨU TIẾN ĐỘ Ý KIẾN CỬ TRI THỜI GIAN THỰC */}
      {/* ========================================================================= */}
      {activeMainTab === 'TRACKER' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Top Search Bar & Controls */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Tra cứu Tiến độ Tiếp nhận &amp; Xử lý Ý kiến Cử tri
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Nhập mã biên nhận điện tử (<strong className="text-orange-700 font-mono">PA-2026-CH01</strong>, <strong className="text-orange-700 font-mono">DN-2026-XXXX</strong>) hoặc tên cử tri / số điện thoại để tra cứu tiến độ giải quyết.
                </p>
              </div>

              {/* Quick Filter by Neighborhood */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedNeighborhoodFilter}
                  onChange={(e) => setSelectedNeighborhoodFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 outline-none focus:border-blue-500"
                >
                  <option value="ALL">Tất cả 21 Khu phố</option>
                  {OFFICIAL_21_NEIGHBORHOODS.map(n => (
                    <option key={n.index} value={`Khu phố ${n.name}`}>Khu phố {n.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input Search Form */}
            <form onSubmit={handleSearchPetition} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Nhập mã PA-2026-CH01, tên người gửi, số điện thoại hoặc nội dung kiến nghị..."
                  value={searchTrackingCode}
                  onChange={(e) => setSearchTrackingCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs rounded-xl transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Tra cứu</span>
              </button>
            </form>

            {/* Quick Sample Code Badges */}
            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <span className="font-bold text-slate-400">Mã tra cứu mẫu:</span>
              {['PA-2026-CH01', 'PA-2026-CH02', 'PA-2026-CH03'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setSearchTrackingCode(code);
                    const found = allTrackingOpinions.find(i => i.receiptCode === code);
                    setSearchedOpinion(found || null);
                    setHasSearched(true);
                  }}
                  className="text-[11px] font-mono font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 px-2 py-0.5 rounded-md border border-orange-200 cursor-pointer"
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* Searched Single Opinion Result Highlight */}
          {hasSearched && (
            <div className="animate-fade-in">
              {searchedOpinion ? (
                <div className="bg-white p-6 rounded-3xl border border-blue-200 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-black text-orange-800 bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-200">
                        MÃ HỒ SƠ: {searchedOpinion.receiptCode}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${getStatusBadge(searchedOpinion.status).color}`}>
                        {getStatusBadge(searchedOpinion.status).label}
                      </span>
                    </div>

                    {/* Actions: Copy Code & Rate */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(searchedOpinion.receiptCode, searchedOpinion.receiptCode)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        title="Sao chép mã"
                      >
                        {copiedCode === searchedOpinion.receiptCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Sao chép</span>
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        title="In phiếu tiếp nhận"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>In phiếu</span>
                      </button>
                    </div>
                  </div>

                  {/* Petition Title & Citizen Info */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                      <span>Lĩnh vực: {searchedOpinion.topic}</span>
                      <span>•</span>
                      <span>{searchedOpinion.neighborhood}</span>
                      <span>•</span>
                      <span>Ngày gửi: {searchedOpinion.createdAt}</span>
                    </div>
                    <h4 className="text-base font-black text-slate-900 leading-snug">
                      {searchedOpinion.content}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Người gửi: <strong>{searchedOpinion.isAnonymous ? 'Cử tri ẩn danh' : searchedOpinion.fullname || 'Cử tri nhân dân'}</strong>
                      {searchedOpinion.phone && ` • SĐT: ${searchedOpinion.phone.substring(0, 4)}***${searchedOpinion.phone.substring(7)}`}
                    </p>
                  </div>

                  {/* Visual 4-Step Pipeline */}
                  <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span className="text-blue-700">1. Đã tiếp nhận</span>
                      <span className={getStatusBadge(searchedOpinion.status).step >= 2 ? 'text-blue-700' : 'text-slate-400'}>2. Thẩm tra cơ sở</span>
                      <span className={getStatusBadge(searchedOpinion.status).step >= 3 ? 'text-blue-700' : 'text-slate-400'}>3. Cơ quan xử lý</span>
                      <span className={getStatusBadge(searchedOpinion.status).step === 4 ? 'text-emerald-700 font-black' : 'text-slate-400'}>4. Hoàn thành &amp; Phản hồi</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
                        style={{ width: `${(getStatusBadge(searchedOpinion.status).step / 4) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Response & Resolver Box */}
                  <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-blue-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Kết quả giải quyết &amp; Trả lời cử tri ({searchedOpinion.assignedTo || 'Thường trực MTTQ & UBND Phường'})</span>
                      </span>
                      {searchedOpinion.updatedAt && (
                        <span className="text-[10px] text-slate-400 font-bold">Cập nhật: {searchedOpinion.updatedAt}</span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                      {searchedOpinion.adminResponse || 'Hồ sơ đang trong quá trình phối hợp cùng lực lượng chức năng khảo sát và xử lý tại hiện trường. Kết quả sẽ được cập nhật công khai sớm nhất.'}
                    </p>
                  </div>

                  {/* Citizen Satisfaction Rating */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-xs font-black text-slate-900 block">Đánh giá mức độ hài lòng về kết quả xử lý:</span>
                      <span className="text-[11px] text-slate-500">Ý kiến của bà con giúp Mặt trận nâng cao chất lượng phục vụ nhân dân</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRate(searchedOpinion.receiptCode, star)}
                          className={`p-1.5 rounded-lg transition-transform hover:scale-110 cursor-pointer ${
                            (feedbackRating[searchedOpinion.receiptCode] || 0) >= star
                              ? 'text-amber-500'
                              : 'text-slate-300 hover:text-amber-400'
                          }`}
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                      {feedbackRating[searchedOpinion.receiptCode] && (
                        <span className="text-xs font-black text-emerald-700 ml-2">Cảm ơn đánh giá!</span>
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-amber-50 border border-amber-200 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                  <h4 className="text-sm font-black text-amber-900">Không tìm thấy mã phản ánh phù hợp</h4>
                  <p className="text-xs text-amber-700 max-w-md mx-auto">
                    Vui lòng kiểm tra lại mã hồ sơ hoặc liên hệ Thường trực MTTQ Phường Chánh Hiệp theo số <strong>0274.3822.123</strong> để được tra cứu trực tiếp.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Public Transparency Feed of Recent Petitions */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  Ý kiến &amp; Phản ánh dân nguyện công khai gần đây
                </h3>
              </div>
              <button
                onClick={() => onSelectTab('opinion')}
                className="text-xs font-bold text-[#0068ff] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Gửi phản ánh mới</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {allTrackingOpinions.slice(0, 6).map((item) => {
                const badge = getStatusBadge(item.status);
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-2.5 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono font-bold text-orange-700 bg-orange-100/80 px-1.5 py-0.5 rounded">
                          {item.receiptCode}
                        </span>
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-slate-900 line-clamp-2 leading-snug">
                        {item.content}
                      </h4>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{item.neighborhood}</span>
                      <button
                        onClick={() => {
                          setSearchTrackingCode(item.receiptCode);
                          setSearchedOpinion(item);
                          setHasSearched(true);
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        className="text-[11px] font-bold text-[#0068ff] hover:underline cursor-pointer"
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB 3: HỆ THỐNG ĐƯỜNG DÂY NÓNG DÂN SINH TRỰC BAN 24/7 */}
      {/* ========================================================================= */}
      {activeMainTab === 'HOTLINE' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Emergency Direct One-Tap Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* 1. MTTQ Phường */}
            <div className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-5 rounded-3xl shadow-sm space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-xs">
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  TRỰC BAN MTTQ
                </span>
              </div>
              <div>
                <h4 className="font-black text-sm">Thường trực Ủy ban MTTQ</h4>
                <p className="text-xs text-blue-200 mt-0.5">Tiếp nhận phản ánh dân nguyện &amp; an sinh</p>
              </div>
              <a
                href="tel:02743822123"
                className="w-full py-2.5 bg-white text-blue-900 hover:bg-blue-50 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi ngay: 0274.3822.123</span>
              </a>
            </div>

            {/* 2. Công an Phường */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-5 rounded-3xl shadow-sm space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-xs">
                  <ShieldCheck className="w-5 h-5 text-red-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-full">
                  AN NINH TRẬT TỰ
                </span>
              </div>
              <div>
                <h4 className="font-black text-sm">Trực ban Công an Phường</h4>
                <p className="text-xs text-slate-300 mt-0.5">An ninh trật tự, PCCC &amp; trật tự đô thị</p>
              </div>
              <a
                href="tel:02743822456"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi ngay: 0274.3822.456</span>
              </a>
            </div>

            {/* 3. Trạm Y tế Phường */}
            <div className="bg-gradient-to-br from-emerald-800 to-teal-950 text-white p-5 rounded-3xl shadow-sm space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-xs">
                  <Activity className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-full">
                  CẤP CỨU Y TẾ
                </span>
              </div>
              <div>
                <h4 className="font-black text-sm">Trạm Y tế Phường Chánh Hiệp</h4>
                <p className="text-xs text-emerald-200 mt-0.5">Sơ cấp cứu, dịch bệnh &amp; chăm sóc sức khỏe</p>
              </div>
              <a
                href="tel:02743833789"
                className="w-full py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi ngay: 0274.3833.789</span>
              </a>
            </div>

          </div>

          {/* 21 Neighborhoods Leadership Directory Grid */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-xs" />
                  <h3 className="text-base font-black text-slate-900">
                    Danh bạ Ban Công tác Mặt trận 21 Khu phố
                  </h3>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Liên lạc trực tiếp Trưởng Ban Công tác Mặt trận phụ trách địa bàn nơi bạn sinh sống
                </p>
              </div>

              {/* Search Bar for 21 Neighborhoods */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Tìm khu phố, tên cán bộ..."
                  value={hotlineSearch}
                  onChange={(e) => setHotlineSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 bg-slate-50"
                />
              </div>
            </div>

            {/* 21 Neighborhood Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredNeighborhoods.map((n) => (
                <div
                  key={n.index}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 hover:bg-white hover:shadow-xs transition-all space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md">
                        KHU PHỐ {n.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">Số thứ tự: #{n.index}</span>
                    </div>
                    <h4 className="text-xs font-black text-slate-900 mt-1.5">
                      {n.leaderName}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {n.leaderPosition}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-700">{n.phone}</span>
                    <a
                      href={`tel:${n.phone.replace(/[^0-9]/g, '')}`}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Gọi</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 4: HỎI ĐÁP DÂN SINH & QUY ĐỊNH PHÁP LUẬT (FAQ) */}
      {/* ========================================================================= */}
      {activeMainTab === 'FAQ' && (
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Câu hỏi thường gặp &amp; Giải đáp Dân sinh
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Các thắc mắc phổ biến của bà con nhân dân về dịch vụ công, an sinh xã hội và đời sống tại khu dân cư
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {CITIZEN_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded shrink-0">
                        {faq.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                        {faq.q}
                      </h4>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="p-4 bg-white border-t border-slate-100 text-xs text-slate-700 font-medium leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Prompt to send opinion if question not listed */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-black text-blue-950 block">Bạn có câu hỏi hoặc vướng mắc khác?</span>
              <span className="text-slate-500 font-medium">Gửi trực tiếp câu hỏi đến Thường trực Ủy ban MTTQ để nhận câu trả lời trong 24 giờ.</span>
            </div>
            <button
              onClick={() => onSelectTab('opinion')}
              className="px-4 py-2 bg-[#0068ff] hover:bg-blue-700 text-white font-bold rounded-xl text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Đặt câu hỏi ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
