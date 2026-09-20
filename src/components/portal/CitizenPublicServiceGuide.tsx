import React, { useState } from 'react';
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
  UserCheck,
  HeartHandshake,
  Smartphone,
  Scale,
  Building,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PublicProcedure {
  id: string;
  code: string;
  title: string;
  category: 'AN_SINH' | 'DAN_NGUYEN' | 'CHUYEN_DOI_SO' | 'PHAP_LUAT' | 'TINH_NGUYEN';
  categoryLabel: string;
  badgeColor: string;
  processingTime: string;
  authority: string;
  summary: string;
  steps: string[];
  requiredDocs: string[];
  actionLabel?: string;
  actionTab?: string;
}

const PROCEDURES_DATA: PublicProcedure[] = [
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
      'Công dân gửi phản ánh qua cổng trực tuyến hoặc trực tiếp tại 21 Ban Công tác Mặt trận.',
      'Thường trực MTTQ tiếp nhận, xác minh thông tin trong vòng 24 giờ.',
      'Chuyển cơ quan có thẩm quyền (UBND phường, Công an, Đội trật tự) xử lý.',
      'Công khai kết quả giải quyết và phản hồi trực tiếp đến công dân qua tin nhắn/cổng thông tin.'
    ],
    requiredDocs: [
      'Nội dung phản ánh rõ ràng, địa điểm cụ thể tại phường Chánh Hiệp',
      'Hình ảnh hoặc video minh chứng (nếu có)',
      'Họ tên và số điện thoại liên hệ của người gửi'
    ],
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
    processingTime: 'Tiếp nhận & Phân nhóm tức thì',
    authority: 'Ủy ban MTTQ & Đoàn Thanh niên Phường Chánh Hiệp',
    summary: 'Đăng ký tham gia lực lượng tình nguyện hỗ trợ người cao tuổi cài đặt VNeID, hỗ trợ Ngày Chủ nhật xanh, chăm sóc gia đình chính sách.',
    steps: [
      'Điền thông tin đăng ký trực tuyến (Họ tên, khu phố, kỹ năng/thời gian rảnh).',
      'Hệ thống tự động cấp Mã thẻ Tình nguyện viên số.',
      'Ban chỉ đạo liên hệ và phân bổ vào Tổ Công nghệ số khu phố tương ứng.'
    ],
    requiredDocs: [
      'Thông tin cá nhân cơ bản và số điện thoại liên lạc',
      'Lựa chọn khu phố cư trú và lĩnh vực mong muốn đóng góp'
    ],
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
    summary: 'Đóng góp nguồn lực hỗ trợ xây tặng Nhà Đại đoàn kết, trao học bổng cho học sinh nghèo hiếu học và trợ cấp đột xuất hộ có hoàn cảnh khó khăn.',
    steps: [
      'Chuyển khoản qua tài khoản Kho bạc/Ngân hàng chính thức của MTTQ Phường hoặc đóng góp trực tiếp.',
      'Hệ thống công khai danh sách ủng hộ trên bảng vinh danh số minh bạch.',
      'Cấp Giấy chứng nhận tấm lòng vàng số gửi đến nhà hảo tâm.'
    ],
    requiredDocs: [
      'Thông tin tổ chức / cá nhân ủng hộ',
      'Nội dung chuyển khoản ghi rõ: [Tên] + Ung ho Quy Vi nguoi ngheo Chanh Hiep'
    ],
    actionLabel: 'Xem chi tiết vận động An sinh',
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
    summary: 'Hướng dẫn nhân dân thực hiện các thủ tục hành chính không giấy tờ, tra cứu bảo hiểm y tế điện tử, đăng ký tạm trú, cấp bản sao hộ tịch trực tuyến.',
    steps: [
      'Đến Công an Phường Chánh Hiệp hoặc các điểm lưu động để thu nhận định danh Mức 2.',
      'Kích hoạt tài khoản trên ứng dụng VNeID bằng mã OTP gửi về số điện thoại chính chủ.',
      'Đăng nhập Cổng Dịch vụ công Quốc gia để nộp hồ sơ trực tuyến thuận tiện 24/7.'
    ],
    requiredDocs: [
      'Thẻ Căn cước công dân gắn chip',
      'Số điện thoại di động đăng ký chính chủ bằng CCCD'
    ],
    actionLabel: 'Truy cập Cổng Dịch vụ công',
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
      'Gửi phiếu yêu cầu hòa giải đến Ban Công tác Mặt trận / Tổ trưởng Tổ dân phố.',
      'Tổ hòa giải gặp gỡ, lắng nghe tâm tư nguyện vọng của các bên.',
      'Tổ chức buổi hòa giải trên tinh thần tôn trọng pháp luật và đạo lý cộng đồng.'
    ],
    requiredDocs: [
      'Đơn yêu cầu hòa giải cơ sở (theo mẫu quy định)',
      'Các giấy tờ, tài liệu liên quan đến vụ việc tranh chấp (nếu có)'
    ],
    actionLabel: 'Gửi yêu cầu tư vấn',
    actionTab: 'opinion'
  }
];

// Sample live tracking data for public petitions
interface PetitionTrackRecord {
  code: string;
  title: string;
  sender: string;
  neighborhood: string;
  submittedDate: string;
  status: 'RECEIVED' | 'PROCESSING' | 'RESOLVED';
  statusLabel: string;
  stepIndex: number;
  resolver: string;
  responseSummary: string;
}

const SAMPLE_TRACKING_DATA: PetitionTrackRecord[] = [
  {
    code: 'PA-2026-CH01',
    title: 'Kiến nghị nâng cấp hệ thống cống thoát nước và đèn chiếu sáng hẻm 45',
    sender: 'Cử tri Lê Minh Tuấn',
    neighborhood: 'Khu phố 4',
    submittedDate: '12/09/2026',
    status: 'RESOLVED',
    statusLabel: 'Đã hoàn thành & Phản hồi cử tri',
    stepIndex: 4,
    resolver: 'UBND Phường & Ban Giám sát ĐTCCĐ',
    responseSummary: 'Đã khảo sát và hoàn thành nạo vét cống thoát nước ngày 18/09/2026. Thay mới 03 bóng đèn LED chiếu sáng tiết kiệm điện.'
  },
  {
    code: 'PA-2026-CH02',
    title: 'Đề xuất gắn thêm camera an ninh tại giao lộ đường ĐX-034',
    sender: 'Đại diện nhân dân Tổ 12',
    neighborhood: 'Khu phố 9',
    submittedDate: '15/09/2026',
    status: 'PROCESSING',
    statusLabel: 'Đang phối hợp lực lượng chức năng xử lý',
    stepIndex: 3,
    resolver: 'Công an Phường & Ban CTMT Khu phố 9',
    responseSummary: 'Đã đưa vào danh mục lắp đặt camera an ninh xã hội hóa quý IV/2026. Dự kiến thi công trước ngày 15/10/2026.'
  },
  {
    code: 'PA-2026-CH03',
    title: 'Phản ánh điểm tập kết rác thải tự phát gây mất vệ sinh môi trường',
    sender: 'Cử tri Nguyễn Thị Thu',
    neighborhood: 'Khu phố 14',
    submittedDate: '18/09/2026',
    status: 'RESOLVED',
    statusLabel: 'Đã dọn dẹp và cắm biển cấm đổ rác',
    stepIndex: 4,
    resolver: 'Đoàn Thanh niên & MTTQ Khu phố 14',
    responseSummary: 'Ra quân Ngày Chủ nhật xanh thu gom 1.2 tấn rác, trồng bồn hoa xóa điểm đen rác và bàn giao tổ dân phố tự quản.'
  }
];

interface CitizenPublicServiceGuideProps {
  onSelectTab: (tab: string) => void;
  onOpenVolunteerModal: () => void;
}

export const CitizenPublicServiceGuide: React.FC<CitizenPublicServiceGuideProps> = ({
  onSelectTab,
  onOpenVolunteerModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeProcId, setActiveProcId] = useState<string>('proc-1');
  const [searchTrackingCode, setSearchTrackingCode] = useState<string>('');
  const [searchResult, setSearchResult] = useState<PetitionTrackRecord | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const filteredProcedures = PROCEDURES_DATA.filter((p) => {
    return selectedCategory === 'ALL' || p.category === selectedCategory;
  });

  const activeProcedure = PROCEDURES_DATA.find((p) => p.id === activeProcId) || PROCEDURES_DATA[0];

  const handleSearchPetition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTrackingCode.trim()) return;
    setHasSearched(true);
    const query = searchTrackingCode.trim().toLowerCase();
    const found = SAMPLE_TRACKING_DATA.find(
      (item) =>
        item.code.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.neighborhood.toLowerCase().includes(query) ||
        item.sender.toLowerCase().includes(query)
    );
    setSearchResult(found || null);
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

  return (
    <section className="space-y-6">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-[#0068ff] rounded-xs shrink-0" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Cẩm nang Dịch vụ công &amp; Quy trình TTHC Số
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Hướng dẫn chi tiết quy trình tiếp nhận, giải quyết thủ tục và tra cứu tiến độ phản ánh của nhân dân
          </p>
        </div>

        {/* Quick Hotline Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="tel:02743822123"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold border border-blue-200 transition-colors shadow-2xs"
            title="Gọi Thường trực MTTQ Phường"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>Đường dây nóng MTTQ: 0274.3822.123</span>
          </a>
        </div>
      </div>

      {/* 2. Interactive 2-Column Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Procedures Navigation & Detail View (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'ALL', label: 'Tất cả thủ tục' },
              { id: 'DAN_NGUYEN', label: 'Dân nguyện - Ý kiến' },
              { id: 'TINH_NGUYEN', label: 'Tình nguyện viên' },
              { id: 'AN_SINH', label: 'An sinh xã hội' },
              { id: 'CHUYEN_DOI_SO', label: 'Chuyển đổi số & VNeID' },
              { id: 'PHAP_LUAT', label: 'Tư vấn pháp luật' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-[#0068ff] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Procedure Detail Accordion Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            {/* Procedure Selector List */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredProcedures.map((proc) => {
                const isActive = proc.id === activeProcedure.id;
                return (
                  <button
                    key={proc.id}
                    onClick={() => setActiveProcId(proc.id)}
                    className={`p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isActive
                        ? 'bg-white text-[#0068ff] shadow-xs border border-blue-200 font-black'
                        : 'bg-transparent text-slate-700 hover:bg-white/80 border border-transparent font-medium'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono font-bold text-slate-400">
                          {proc.code}
                        </span>
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded ${proc.badgeColor}`}>
                          {proc.categoryLabel}
                        </span>
                      </div>
                      <div className="text-xs truncate font-bold mt-0.5">
                        {proc.title}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-[#0068ff] translate-x-0.5' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Selected Procedure Deep Details */}
            <div className="p-5 sm:p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide ${activeProcedure.badgeColor}`}>
                    {activeProcedure.categoryLabel}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Mã TTHC: <strong className="text-slate-800 font-mono">{activeProcedure.code}</strong>
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {activeProcedure.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {activeProcedure.summary}
                </p>
              </div>

              {/* Meta Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block text-[11px]">Thời gian giải quyết:</span>
                  <span className="font-bold text-blue-900 mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    {activeProcedure.processingTime}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block text-[11px]">Cơ quan chủ trì:</span>
                  <span className="font-bold text-blue-900 mt-0.5 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    {activeProcedure.authority}
                  </span>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Quy trình các bước thực hiện:
                </h4>
                <div className="space-y-2">
                  {activeProcedure.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-black flex items-center justify-center shrink-0 text-[10px] shadow-2xs mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="leading-relaxed flex-1 font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Documents */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Thành phần hồ sơ / Yêu cầu chuẩn bị:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {activeProcedure.requiredDocs.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              {activeProcedure.actionLabel && (
                <div className="pt-2">
                  <button
                    onClick={() => handleActionClick(activeProcedure.actionTab)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0068ff] hover:bg-blue-700 text-white text-xs font-black transition-all shadow-xs inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{activeProcedure.actionLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Citizen Opinion Progress Tracker & Public Transparency (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          
          {/* Tracking Search Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 bg-orange-100 text-orange-700 rounded-2xl border border-orange-200">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900">
                  Tra cứu tiến độ Ý kiến &amp; Phản ánh cử tri
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Nhập mã phản ánh (Ví dụ: <strong className="text-orange-700 font-mono">PA-2026-CH01</strong>) hoặc tên khu phố
                </p>
              </div>
            </div>

            {/* Search Input Form */}
            <form onSubmit={handleSearchPetition} className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nhập mã PA-2026-CH01, tên người gửi hoặc khu phố..."
                  value={searchTrackingCode}
                  onChange={(e) => setSearchTrackingCode(e.target.value)}
                  className="w-full pl-3.5 pr-20 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium bg-slate-50/50"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-[#0068ff] hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Tra cứu
                </button>
              </div>

              {/* Sample Code Badges */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 flex-wrap">
                <span>Mã tra cứu mẫu:</span>
                {['PA-2026-CH01', 'PA-2026-CH02', 'PA-2026-CH03'].map((code) => (
                  <button
                    type="button"
                    key={code}
                    onClick={() => {
                      setSearchTrackingCode(code);
                      const found = SAMPLE_TRACKING_DATA.find(i => i.code === code);
                      setSearchResult(found || null);
                      setHasSearched(true);
                    }}
                    className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded cursor-pointer"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </form>

            {/* Search Result Display */}
            {hasSearched && (
              <div className="mt-3">
                {searchResult ? (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-black text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                        {searchResult.code}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        searchResult.status === 'RESOLVED' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {searchResult.statusLabel}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-snug">
                        {searchResult.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Cử tri: <strong>{searchResult.sender}</strong> ({searchResult.neighborhood}) • Ngày gửi: {searchResult.submittedDate}
                      </p>
                    </div>

                    {/* Progress 4-step bar */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                        <span>Tiếp nhận</span>
                        <span>Xác minh</span>
                        <span>Xử lý</span>
                        <span className="text-emerald-700">Hoàn thành</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 rounded-full"
                          style={{ width: `${(searchResult.stepIndex / 4) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Response Summary */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Kết quả giải quyết từ {searchResult.resolver}:
                      </span>
                      <p className="font-medium text-slate-800 leading-relaxed">
                        {searchResult.responseSummary}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
                    <AlertCircle className="w-5 h-5 text-amber-600 mx-auto" />
                    <p className="text-xs font-bold text-amber-900">Không tìm thấy mã phản ánh phù hợp</p>
                    <p className="text-[11px] text-amber-700">Vui lòng kiểm tra lại mã hoặc liên hệ Thường trực MTTQ để được trợ giúp.</p>
                  </div>
                )}
              </div>
            )}

            {/* Quick Send Opinion Trigger */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Bạn có ý kiến cần gửi?</span>
              <button
                onClick={() => onSelectTab('opinion')}
                className="text-xs font-bold text-[#0068ff] hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Gửi phản ánh mới</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Emergency & Ward Public Directory Card */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-md space-y-3 relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-amber-300">
                  Đường dây nóng phục vụ nhân dân 24/7
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Khi cần hỗ trợ khẩn cấp về an ninh trật tự, y tế hoặc thủ tục an sinh trên địa bàn phường Chánh Hiệp:
              </p>
              
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="tel:02743822456"
                  className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block font-medium">Công an Phường:</span>
                    <span className="text-xs font-bold text-white">0274.3822.456</span>
                  </div>
                </a>

                <a
                  href="tel:02743833789"
                  className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block font-medium">Trạm Y tế:</span>
                    <span className="text-xs font-bold text-white">0274.3833.789</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
