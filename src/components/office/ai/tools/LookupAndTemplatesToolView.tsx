import React, { useState } from 'react';
import { 
  BookTemplate, 
  Search, 
  Sparkles, 
  FileText, 
  Copy, 
  ExternalLink, 
  Filter, 
  CheckCircle2, 
  Download,
  BookOpen,
  Scale
} from 'lucide-react';
import { SecurityNoticeBanner } from '../SecurityNoticeBanner';

interface LookupAndTemplatesToolViewProps {
  onSelectTemplateToDraft?: (templateTitle: string, templateType: string) => void;
}

const TEMPLATE_LIBRARY = [
  {
    id: 'm1',
    category: 'Kế hoạch',
    title: 'Mẫu Kế hoạch triển khai Tháng cao điểm "Vì người nghèo"',
    desc: 'Bản chuẩn định dạng Nghị định 30/2020/NĐ-CP dùng cho Ủy ban MTTQ Việt Nam cấp Phường/Xã.',
    content: `ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP
Ban Thường trực
Số: .../KH-MTTQ

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
--------------------
Chánh Hiệp, ngày ... tháng ... năm 2026

KẾ HOẠCH
Về việc triển khai Tháng cao điểm "Vì người nghèo" năm 2026

Thực hiện Hướng dẫn của Ủy ban MTTQ Việt Nam cấp trên và Thường trực Đảng ủy Phường;
Ban Thường trực Ủy ban MTTQ Việt Nam Phường Chánh Hiệp xây dựng Kế hoạch triển khai thực hiện như sau:

I. MỤC ĐÍCH, YÊU CẦU...
II. NỘI DUNG VÀ CHỈ TIÊU TRỌNG TÂM...
III. THỜI GIAN VÀ ĐỊA ĐIỂM THỰC HIỆN...
IV. TỔ CHỨC THỰC HIỆN...`
  },
  {
    id: 'm2',
    category: 'Tờ trình',
    title: 'Mẫu Tờ trình xin ý kiến Thường trực Đảng ủy về chủ trương tổ chức Ngày hội',
    desc: 'Dùng trình Cấp ủy phê duyệt chủ trương và kinh phí hỗ trợ công tác Mặt trận.',
    content: `ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP
Số: .../TTr-MTTQ

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc

TỜ TRÌNH
Về việc xin chủ trương tổ chức Ngày hội Đại đoàn kết toàn dân tộc năm 2026

Kính gửi: Thường trực Đảng ủy Phường Chánh Hiệp.

Căn cứ Hướng dẫn số ... của Ban Thường trực Ủy ban MTTQ cấp trên;
Nhằm phát huy sức mạnh khối đại đoàn kết toàn dân tộc tại 21 Khu phố...`
  },
  {
    id: 'm3',
    category: 'Công văn',
    title: 'Mẫu Công văn hướng dẫn 21 Ban CTMT rà soát hộ nghèo',
    desc: 'Công văn phối hợp điều tra, bình xét danh sách đối tượng trợ cấp an sinh xã hội.',
    content: `ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP
Số: .../CV-MTTQ

V/v rà soát, bình xét danh sách hộ nghèo nhận quà An sinh xã hội

Kính gửi: Ban Công tác Mặt trận 21 Khu phố Phường Chánh Hiệp.`
  },
  {
    id: 'm4',
    category: 'Nghiệp vụ',
    title: 'Sổ tay Nghiệp vụ Trưởng Ban Công tác Mặt trận Khu phố',
    desc: 'Tổng hợp 10 quy trình cốt lõi trong tiếp xúc cử tri, hòa giải ở cơ sở và giám sát phản biện.',
    content: `CẨM NANG NGHIỆP VỤ BAN CÔNG TÁC MẶT TRẬN KHU PHỐ
1. Quy trình chuẩn bị tiếp xúc cử tri đại biểu HĐND các cấp.
2. Quy trình hòa giải 05 bước tại địa bàn dân cư.
3. Quy trình rà soát, lập danh sách bình xét hộ nghèo công khai.`
  }
];

export const LookupAndTemplatesToolView: React.FC<LookupAndTemplatesToolViewProps> = ({
  onSelectTemplateToDraft
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [activeTemplate, setActiveTemplate] = useState<any>(TEMPLATE_LIBRARY[0]);

  const categories = ['Tất cả', 'Kế hoạch', 'Tờ trình', 'Công văn', 'Nghiệp vụ'];

  const filteredTemplates = TEMPLATE_LIBRARY.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-5 overflow-y-auto h-full pb-20">
      <SecurityNoticeBanner />

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <BookTemplate className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">8. Tra cứu nghiệp vụ & Mẫu biểu (Library & Templates)</h2>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                LÕI NHÓM 04
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kho mẫu biểu chuẩn Nghị định 30, cẩm nang nghiệp vụ Mặt trận & quy trình công tác cơ sở.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm mẫu biểu Kế hoạch, Tờ trình, Công văn, Cẩm nang..."
            className="bg-transparent outline-hidden w-full text-slate-800"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                selectedCategory === c ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Template List vs Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Template Cards List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredTemplates.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveTemplate(item)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                activeTemplate?.id === item.id 
                  ? 'bg-indigo-50/80 border-indigo-500 shadow-md ring-1 ring-indigo-500/30' 
                  : 'bg-white border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded">
                  {item.category}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">{item.title}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Selected Template Viewer */}
        {activeTemplate && (
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded">
                  {activeTemplate.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{activeTemplate.title}</h3>
              </div>

              {onSelectTemplateToDraft && (
                <button
                  onClick={() => onSelectTemplateToDraft(activeTemplate.title, activeTemplate.category)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Dùng mẫu này soạn thảo</span>
                </button>
              )}
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif text-slate-900 whitespace-pre-line leading-relaxed h-[420px] overflow-y-auto">
              {activeTemplate.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
