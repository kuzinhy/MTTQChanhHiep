import React, { useState } from 'react';
import { 
  FileCheck, 
  Search, 
  Clock, 
  DollarSign, 
  Building, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Download, 
  HelpCircle, 
  Layers, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FolderOpen
} from 'lucide-react';

export interface ProcedureStep {
  stepNumber: number;
  title: string;
  description: string;
  responsible: string;
  duration?: string;
  notes?: string;
}

export interface AdministrativeProcedure {
  id: string;
  code: string;
  title: string;
  category: 'Hộ tịch' | 'Chứng thực' | 'An sinh - Bảo trợ' | 'Đất đai - Xây dựng' | 'Mặt trận - Đoàn thể';
  processingTime: string;
  fee: string;
  receivingAuthority: string;
  returnAuthority: string;
  portalLink?: string;
  driveFolderUrl?: string;
  description: string;
  requiredDocuments: string[];
  steps: ProcedureStep[];
}

export const ADMINISTRATIVE_PROCEDURES: AdministrativeProcedure[] = [
  {
    id: 'tthc-01',
    code: 'TTHC-CH-01',
    title: 'Đăng ký kết hôn (trong nước)',
    category: 'Hộ tịch',
    processingTime: 'Trong ngày làm việc (ngay sau khi nhận đủ hồ sơ hợp lệ)',
    fee: 'Miễn lệ phí đăng ký kết hôn cho công dân cư trú trên địa bàn',
    receivingAuthority: 'Bộ phận Tiếp nhận và Trả kết quả (Một cửa) UBND Phường Chánh Hiệp',
    returnAuthority: 'Ủy ban nhân dân Phường Chánh Hiệp',
    portalLink: 'https://dichvucong.binhduong.gov.vn',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1TNEc-8JYkF17R44igkinTIZAmFEjSmOL',
    description: 'Quy trình giải quyết thủ tục đăng ký kết hôn giữa công dân Việt Nam cư trú tại phường Chánh Hiệp theo Luật Hộ tịch.',
    requiredDocuments: [
      'Tờ khai đăng ký kết hôn (theo mẫu quy định, có chữ ký của hai bên nam nữ).',
      'Căn cước công dân / Hộ chiếu còn giá trị sử dụng của hai bên.',
      'Giấy xác nhận tình trạng hôn nhân do UBND nơi thường trú cấp (nếu cư trú khác địa bàn phường).',
      'Trích lục bản án/quyết định ly hôn đã có hiệu lực pháp luật (nếu đã từng kết hôn và ly hôn).'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Nộp hồ sơ trực tiếp hoặc trực tuyến',
        description: 'Hai bên nam, nữ nộp hồ sơ tại Bộ phận Một cửa UBND Phường hoặc nộp qua Cổng Dịch vụ công Quốc gia/Bình Dương.',
        responsible: 'Công dân nam & nữ',
        duration: '15 - 30 phút'
      },
      {
        stepNumber: 2,
        title: 'Tiếp nhận & Kiểm tra tính pháp lý hồ sơ',
        description: 'Công chức Tư pháp - Hộ tịch kiểm tra giấy tờ, đối chiếu cơ sở dữ liệu quốc gia về dân cư và điều kiện kết hôn.',
        responsible: 'Công chức Tư pháp - Hộ tịch',
        duration: 'Trong ngày làm việc'
      },
      {
        stepNumber: 3,
        title: 'Trình Lãnh đạo UBND Phường phê duyệt',
        description: 'Lãnh đạo UBND Phường ký Giấy chứng nhận kết hôn và ghi vào Sổ đăng ký kết hôn.',
        responsible: 'Chủ tịch / Phó Chủ tịch UBND Phường',
        duration: 'Trong ngày làm việc'
      },
      {
        stepNumber: 4,
        title: 'Trao Giấy chứng nhận kết hôn trang trọng',
        description: 'Tổ chức trao Giấy chứng nhận kết hôn cho hai bên nam, nữ cùng ký tên vào Sổ hộ tịch và Giấy chứng nhận.',
        responsible: 'UBND Phường & Công dân',
        duration: '15 phút'
      }
    ]
  },
  {
    id: 'tthc-02',
    code: 'TTHC-CH-02',
    title: 'Chứng thực bản sao từ bản chính các loại giấy tờ',
    category: 'Chứng thực',
    processingTime: 'Giải quyết ngay trong ngày tiếp nhận hồ sơ',
    fee: '2.000 VNĐ / trang (từ trang thứ 3 trở đi 1.000 VNĐ/trang, tối đa 200.000 VNĐ/bản)',
    receivingAuthority: 'Bộ phận Tiếp nhận và Trả kết quả UBND Phường Chánh Hiệp',
    returnAuthority: 'Ủy ban nhân dân Phường Chánh Hiệp',
    portalLink: 'https://dichvucong.binhduong.gov.vn',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1TNEc-8JYkF17R44igkinTIZAmFEjSmOL',
    description: 'Thủ tục công chứng, chứng thực bản sao hợp lệ các văn bằng, chứng chỉ, giấy tờ tùy thân của người dân và tổ chức.',
    requiredDocuments: [
      'Bản chính giấy tờ, văn bản cần chứng thực bản sao (còn nguyên vẹn, có đầy đủ con dấu, chữ ký).',
      'Bản sao cần chứng thực (nếu tự photocopy trước, hoặc nhân viên một cửa hỗ trợ).'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Tiếp nhận bản chính & bản sao',
        description: 'Người yêu cầu nộp bản chính và bản sao tại quầy Chứng thực - Một cửa UBND Phường.',
        responsible: 'Công dân',
        duration: '5 - 10 phút'
      },
      {
        stepNumber: 2,
        title: 'Đối chiếu và thẩm định nội dung',
        description: 'Công chức Tư pháp đối chiếu bản sao khớp đúng từng chi tiết với bản chính hợp pháp.',
        responsible: 'Công chức Tư pháp',
        duration: '10 - 20 phút'
      },
      {
        stepNumber: 3,
        title: 'Đóng dấu chứng thực & Ký xác nhận',
        description: 'Lãnh đạo UBND hoặc người được ủy quyền ký chứng thực và đóng dấu của UBND Phường.',
        responsible: 'Lãnh đạo UBND / Tư pháp',
        duration: '15 - 30 phút'
      },
      {
        stepNumber: 4,
        title: 'Thu phí & Trả kết quả',
        description: 'Thu lệ phí theo biên lai điện tử và trao trả kết quả cho công dân.',
        responsible: 'Bộ phận Một cửa',
        duration: '5 phút'
      }
    ]
  },
  {
    id: 'tthc-03',
    code: 'TTHC-CH-03',
    title: 'Xác nhận tình trạng hôn nhân (Giấy độc thân)',
    category: 'Hộ tịch',
    processingTime: 'Trong 03 ngày làm việc (không quá 01 ngày nếu hồ sơ thông tin rõ ràng)',
    fee: 'Miễn phí hoặc theo quy định HĐND tỉnh Bình Dương',
    receivingAuthority: 'Bộ phận Một cửa UBND Phường Chánh Hiệp',
    returnAuthority: 'Ủy ban nhân dân Phường Chánh Hiệp',
    portalLink: 'https://dichvucong.binhduong.gov.vn',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1TNEc-8JYkF17R44igkinTIZAmFEjSmOL',
    description: 'Cấp Giấy xác nhận tình trạng hôn nhân phục vụ mục đích đăng ký kết hôn, giao dịch bất động sản, vay vốn ngân hàng.',
    requiredDocuments: [
      'Tờ khai cấp Giấy xác nhận tình trạng hôn nhân (theo mẫu).',
      'Căn cước công dân gắn chip / tài khoản VNeID mức 2.',
      'Giấy tờ chứng minh đã ly hôn hoặc vợ/chồng đã mất (nếu có).'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Nộp tờ khai & giấy tờ kèm theo',
        description: 'Nộp trực tiếp tại quầy Hộ tịch hoặc đăng ký trực tuyến qua VNeID / Cổng DVC.',
        responsible: 'Công dân',
        duration: '10 phút'
      },
      {
        stepNumber: 2,
        title: 'Xác minh thông tin hộ tịch & cơ sở dữ liệu',
        description: 'Công chức Tư pháp tra cứu cơ sở dữ liệu hộ tịch điện tử toàn quốc và hồ sơ lưu trữ tại địa phương.',
        responsible: 'Công chức Tư pháp - Hộ tịch',
        duration: '1 - 2 ngày'
      },
      {
        stepNumber: 3,
        title: 'Ký duyệt Giấy xác nhận',
        description: 'Chủ tịch hoặc Phó Chủ tịch UBND Phường ký duyệt Giấy xác nhận tình trạng hôn nhân.',
        responsible: 'Lãnh đạo UBND Phường',
        duration: '0.5 ngày'
      },
      {
        stepNumber: 4,
        title: 'Bàn giao giấy xác nhận cho công dân',
        description: 'Trả kết quả bản giấy hoặc bản điện tử có chữ ký số theo yêu cầu.',
        responsible: 'Bộ phận Một cửa',
        duration: '5 phút'
      }
    ]
  },
  {
    id: 'tthc-04',
    code: 'TTHC-CH-04',
    title: 'Hỗ trợ trợ cấp bảo trợ xã hội hàng tháng cho người cao tuổi / người khuyết tật',
    category: 'An sinh - Bảo trợ',
    processingTime: 'Trong 07 đến 15 ngày làm việc theo quy định Nghị định 20/2021/NĐ-CP',
    fee: 'Không thu phí (Miễn phí 100%)',
    receivingAuthority: 'Bộ phận Văn hóa - Xã hội & Một cửa UBND Phường Chánh Hiệp',
    returnAuthority: 'Phòng Lao động - TB&XH TP. Thủ Dầu Một / UBND Phường',
    portalLink: 'https://dichvucong.binhduong.gov.vn',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1TNEc-8JYkF17R44igkinTIZAmFEjSmOL',
    description: 'Quy trình tiếp nhận, thẩm định và chi trả chế độ trợ cấp thường xuyên cho người cao tuổi từ đủ 75/80 tuổi, người khuyết tật nặng.',
    requiredDocuments: [
      'Tờ khai thông tin đề nghị trợ cấp xã hội (theo mẫu).',
      'Bản sao Căn cước công dân / Sổ hộ khẩu điện tử.',
      'Giấy xác nhận mức độ khuyết tật (đối với người khuyết tật).',
      'Giấy tờ xác nhận hoàn cảnh khó khăn hoặc đơn thân (nếu có).'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Nộp hồ sơ đề nghị trợ cấp',
        description: 'Người dân hoặc người đại diện nộp hồ sơ tại Bộ phận Lao động - Thương binh & Xã hội phường.',
        responsible: 'Người dân / Người giám hộ',
        duration: '15 phút'
      },
      {
        stepNumber: 2,
        title: 'Hội đồng xét duyệt phường họp thẩm định',
        description: 'Hội đồng xác định mức độ khuyết tật / Hội đồng xét duyệt trợ cấp xã hội họp xét duyệt và niêm yết công khai.',
        responsible: 'Hội đồng Xét duyệt Phường & MTTQ',
        duration: '05 ngày làm việc'
      },
      {
        stepNumber: 3,
        title: 'Chuyển Phòng LĐ-TB&XH Thành phố thẩm định',
        description: 'Hoàn thiện hồ sơ gửi Phòng Lao động - Thương binh & Xã hội TP. Thủ Dầu Một ra quyết định chi trả.',
        responsible: 'Công chức LĐ-TB&XH Phường',
        duration: '05 ngày làm việc'
      },
      {
        stepNumber: 4,
        title: 'Bàn giao quyết định và chi trả hàng tháng',
        description: 'Chi trả trợ cấp qua tài khoản an sinh xã hội (thẻ ATM) hoặc nhận trực tiếp tại điểm chi trả Bưu điện/UBND.',
        responsible: 'UBND Phường & Bưu điện',
        duration: 'Hàng tháng'
      }
    ]
  },
  {
    id: 'tthc-05',
    code: 'TTHC-CH-05',
    title: 'Quy trình tiếp nhận và xử lý Phản ánh - Kiến nghị của Nhân dân (MTTQ & UBND)',
    category: 'Mặt trận - Đoàn thể',
    processingTime: 'Từ 03 đến 07 ngày làm việc (Phản ánh khẩn xử lý trong 24h)',
    fee: 'Miễn phí 100%',
    receivingAuthority: 'Ban Thường trực Ủy ban MTTQ Việt Nam & UBND Phường Chánh Hiệp',
    returnAuthority: 'Ủy ban MTTQ Việt Nam & UBND Phường Chánh Hiệp',
    portalLink: '#',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1TNEc-8JYkF17R44igkinTIZAmFEjSmOL',
    description: 'Quy trình giải quyết các phản ánh, kiến nghị về trật tự đô thị, vệ sinh môi trường, an ninh trật tự, giám sát công trình dân sinh tại 21 khu phố.',
    requiredDocuments: [
      'Nội dung phản ánh (qua Cổng thông tin điện tử, mã QR khu phố, đơn thư hoặc trực tiếp).',
      'Hình ảnh, video, định vị vị trí hoặc tài liệu chứng minh sự việc (nếu có).'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Tiếp nhận phản ánh đa kênh',
        description: 'Người dân gửi phản ánh qua mục "Lắng nghe Nhân dân" trên website hoặc gửi trực tiếp cho Ban Công tác Mặt trận Khu phố.',
        responsible: 'Người dân / Ban CTMT Khu phố',
        duration: 'Ngay tức thì'
      },
      {
        stepNumber: 2,
        title: 'Phân loại & Chuyển cơ quan chuyên môn',
        description: 'Ban Thường trực Mặt trận và Cán bộ chuyên môn kiểm tra nội dung, lập phiếu xử lý chuyển bộ phận liên quan.',
        responsible: 'Cán bộ Mặt trận / Văn phòng UBND',
        duration: '24 giờ'
      },
      {
        stepNumber: 3,
        title: 'Khảo sát thực địa & Xử lý dứt điểm',
        description: 'Tổ công tác phối hợp Trưởng Ban Điều hành Khu phố kiểm tra hiện trường, lập biên bản và giải quyết dứt điểm.',
        responsible: 'Bộ phận chuyên môn & Khu phố',
        duration: '2 - 5 ngày'
      },
      {
        stepNumber: 4,
        title: 'Thông báo kết quả công khai cho người dân',
        description: 'Cập nhật trạng thái xử lý trên Cổng thông tin, gửi thông báo trực tiếp đến người phản ánh và công khai kết quả giám sát.',
        responsible: 'Ban TT MTTQ & UBND Phường',
        duration: '1 ngày'
      }
    ]
  }
];

export const AdministrativeProceduresTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>('tthc-01');

  const categories = ['ALL', 'Hộ tịch', 'Chứng thực', 'An sinh - Bảo trợ', 'Mặt trận - Đoàn thể'];

  const filteredProcedures = ADMINISTRATIVE_PROCEDURES.filter(proc => {
    const matchesCategory = selectedCategory === 'ALL' || proc.category === selectedCategory;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || 
      proc.title.toLowerCase().includes(q) ||
      proc.code.toLowerCase().includes(q) ||
      proc.description.toLowerCase().includes(q) ||
      proc.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Banner & Introduction */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-400/30 rounded-full text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Sơ đồ Quy trình Trực quan • Dân biết - Dân bàn - Dân làm
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              SƠ ĐỒ QUY TRÌNH THỦ TỤC HÀNH CHÍNH
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
              Hướng dẫn trực quan từng bước các quy trình giải quyết thủ tục hành chính, dịch vụ công, an sinh xã hội và tiếp nhận phản ánh dân sinh tại UBND &amp; Ủy ban MTTQ Việt Nam Phường Chánh Hiệp.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href="https://drive.google.com/drive/folders/1TNEc-8JYkF17R44igkinTIZAmFEjSmOL"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/20 text-xs font-bold transition-all shadow-sm hover:scale-102 active:scale-98"
            >
              <FolderOpen className="w-4 h-4 text-amber-300" />
              <span>Kho Biểu mẫu Drive (1TNEc...)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <a
              href="https://dichvucong.binhduong.gov.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-2xl font-black text-xs transition-all shadow-md hover:scale-102 active:scale-98"
            >
              <span>Nộp hồ sơ DVC Trực tuyến</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm tên thủ tục, mã quy trình..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-medium"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'Tất cả lĩnh vực' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Procedures List */}
      <div className="space-y-4">
        {filteredProcedures.map((proc) => {
          const isExpanded = expandedId === proc.id;

          return (
            <div
              key={proc.id}
              className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-xs ${
                isExpanded ? 'border-blue-500 ring-2 ring-blue-500/10 shadow-md' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header Accordion Bar */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : proc.id)}
                className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none hover:bg-slate-50/50"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200 font-bold mt-0.5">
                    <FileCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="px-2.5 py-0.5 bg-blue-100/80 text-blue-800 rounded-md font-mono text-[11px] font-bold">
                        {proc.code}
                      </span>
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-bold">
                        {proc.category}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                      {proc.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      {proc.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <span className="text-xs font-bold text-blue-600 hidden sm:inline">
                    {isExpanded ? 'Thu gọn sơ đồ' : 'Xem sơ đồ chi tiết'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Detailed Expanded Content */}
              {isExpanded && (
                <div className="px-5 pb-6 sm:px-6 sm:pb-8 pt-2 border-t border-slate-100 space-y-6 animate-in fade-in duration-200">
                  {/* Summary Metric Chips */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        Thời hạn giải quyết:
                      </div>
                      <div className="text-xs font-black text-slate-800">{proc.processingTime}</div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        Lệ phí quy định:
                      </div>
                      <div className="text-xs font-black text-emerald-800">{proc.fee}</div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
                        <Building className="w-3.5 h-3.5 text-indigo-600" />
                        Cơ quan giải quyết:
                      </div>
                      <div className="text-xs font-black text-slate-800">{proc.receivingAuthority}</div>
                    </div>
                  </div>

                  {/* Required Documents Section */}
                  <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 space-y-2.5">
                    <h4 className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      Hồ sơ, giấy tờ cần chuẩn bị
                    </h4>
                    <ul className="space-y-1.5">
                      {proc.requiredDocuments.map((doc, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual Step-by-Step Flowchart */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      Sơ đồ các bước thực hiện trực quan
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
                      {proc.steps.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="relative p-4 rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-200/90 shadow-2xs space-y-2 flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                                {step.stepNumber}
                              </span>
                              {step.duration && (
                                <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                                  {step.duration}
                                </span>
                              )}
                            </div>

                            <h5 className="text-xs font-black text-slate-900 leading-tight">
                              {step.title}
                            </h5>

                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              {step.description}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 text-[10px] text-indigo-800 font-bold flex items-center gap-1">
                            <span>Chủ trì:</span>
                            <span className="text-slate-700 font-medium">{step.responsible}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Link Footer */}
                  <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      <span>Bà con cần hỗ trợ thêm có thể hỏi ngay Trợ lý AI hoặc liên hệ Bộ phận Một cửa.</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {proc.driveFolderUrl && (
                        <a
                          href={proc.driveFolderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-600" />
                          <span>Tải biểu mẫu (Drive)</span>
                        </a>
                      )}
                      {proc.portalLink && proc.portalLink !== '#' && (
                        <a
                          href={proc.portalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                        >
                          <span>Nộp hồ sơ trực tuyến</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
