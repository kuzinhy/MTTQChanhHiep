import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileCheck, 
  Calendar, 
  Eye, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  Download,
  Users,
  Building2,
  Scale
} from 'lucide-react';
import { motion } from 'motion/react';

interface SupervisionPlan {
  id: string;
  code: string;
  title: string;
  targetUnit: string;
  field: string;
  timeframe: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED';
  leader: string;
  recommendationsCount: number;
  resultsSummary: string;
  issuedDate: string;
}

const SAMPLE_PLANS: SupervisionPlan[] = [
  {
    id: 'sp-1',
    code: 'KH-04/KH-MTTQ',
    title: 'Giám sát việc thực hiện các chính sách an sinh xã hội và trợ cấp người có công năm 2026',
    targetUnit: 'Bộ phận Lao động - Thương binh & Xã hội UBND Phường Chánh Hiệp',
    field: 'An sinh xã hội',
    timeframe: 'Quý II/2026',
    status: 'COMPLETED',
    leader: 'Đ/c Trần Thị Hoa - Chủ tịch MTTQ',
    recommendationsCount: 4,
    resultsSummary: 'Đã hoàn tất giám sát trực tiếp tại 21 khu phố. Phát hiện 100% hồ sơ chi trả đúng đối tượng, kiến nghị rút ngắn thời gian giải quyết hỗ trợ đột xuất xuống còn 3 ngày làm việc.',
    issuedDate: '2026-05-15'
  },
  {
    id: 'sp-2',
    code: 'KH-07/KH-MTTQ',
    title: 'Giám sát công tác tiếp công dân và giải quyết thủ tục hành chính tại bộ phận Một cửa',
    targetUnit: 'Bộ phận Tiếp nhận & Trả kết quả UBND Phường Chánh Hiệp',
    field: 'Cải cách hành chính',
    timeframe: 'Tháng 8/2026',
    status: 'IN_PROGRESS',
    leader: 'Đ/c Nguyễn Văn Hùng - Phó Chủ tịch MTTQ',
    recommendationsCount: 2,
    resultsSummary: 'Đang triển khai lấy ý kiến đánh giá trực tiếp của 300 lượt công dân đến giao dịch. Đã ghi nhận 95.8% mức độ hài lòng.',
    issuedDate: '2026-08-01'
  },
  {
    id: 'sp-3',
    code: 'KH-11/KH-MTTQ',
    title: 'Giám sát tiến độ và chất lượng công trình nâng cấp hạ tầng thoát nước đường Chánh Hiệp 05',
    targetUnit: 'Ban Quản lý Dự án Đầu tư Xây dựng & Đơn vị Thi công',
    field: 'Đầu tư công cộng đồng',
    timeframe: 'Quý III - IV/2026',
    status: 'PLANNED',
    leader: 'Ban Thanh tra Nhân dân & Ban Giám sát ĐTCĐ',
    recommendationsCount: 0,
    resultsSummary: 'Kế hoạch đã ban hành và phân công Ban Giám sát Đầu tư của cộng đồng khu phố 3 và khu phố 4 cùng giám sát hiện trường.',
    issuedDate: '2026-08-20'
  }
];

export const SupervisionSection: React.FC<{
  onOpenOpinionForm?: () => void;
  onSelectDocument?: (doc: any) => void;
}> = ({ onOpenOpinionForm, onSelectDocument }) => {
  const [selectedField, setSelectedField] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<SupervisionPlan | null>(SAMPLE_PLANS[0]);

  const filteredPlans = SAMPLE_PLANS.filter(plan => {
    const matchesField = selectedField === 'ALL' || plan.field === selectedField;
    const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          plan.targetUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          plan.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesField && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner - Blue Tech Theme */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-300/30 text-xs font-black uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-cyan-300" />
            <span>Phát huy quyền làm chủ của Nhân dân</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Giám sát &amp; Phản biện Xã hội
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm font-medium leading-relaxed">
            Công khai, minh bạch các chương trình giám sát cán bộ, công chức, các công trình đầu tư công và chính sách an sinh xã hội trên địa bàn Phường Chánh Hiệp theo Luật MTTQ Việt Nam và Luật Thực hiện dân chủ ở cơ sở.
          </p>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">08</div>
            <div className="text-xs font-bold text-slate-500">Chương trình giám sát 2026</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-black">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">100%</div>
            <div className="text-xs font-bold text-slate-500">Kiến nghị được tiếp thu</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">21/21</div>
            <div className="text-xs font-bold text-slate-500">Ban TTND Khu phố phối hợp</div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: List of Plans */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Tìm nội dung giám sát..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            </div>
            <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto">
              {['ALL', 'An sinh xã hội', 'Cải cách hành chính', 'Đầu tư công cộng đồng'].map(field => (
                <button
                  key={field}
                  onClick={() => setSelectedField(field)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                    selectedField === field 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {field === 'ALL' ? 'Tất cả' : field}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredPlans.map(plan => {
              const isSelected = selectedPlan?.id === plan.id;
              return (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -1 }}
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-blue-50/60 border-blue-500 shadow-md ring-1 ring-blue-500/20' 
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                      {plan.code}
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      plan.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                      plan.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {plan.status === 'COMPLETED' ? 'Đã hoàn tất' :
                       plan.status === 'IN_PROGRESS' ? 'Đang thực hiện' : 'Theo kế hoạch'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm mb-2 leading-snug hover:text-blue-700 transition-colors">
                    {plan.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {plan.targetUnit}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {plan.timeframe}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right: Plan Detail Showcase */}
        <div className="lg:col-span-5">
          {selectedPlan ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-5 sticky top-24">
              <div className="border-b border-slate-100 pb-4">
                <div className="text-[10px] font-black uppercase tracking-wider text-blue-700 mb-1">
                  Chi tiết Kế hoạch Giám sát
                </div>
                <h4 className="text-base font-black text-slate-900 leading-snug">
                  {selectedPlan.title}
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Số văn bản ban hành:</span>
                  <span className="font-bold text-slate-900">{selectedPlan.code}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Đơn vị chịu sự giám sát:</span>
                  <span className="font-bold text-slate-900 text-right max-w-[200px]">{selectedPlan.targetUnit}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Trưởng đoàn giám sát:</span>
                  <span className="font-bold text-slate-900">{selectedPlan.leader}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Thời gian thực hiện:</span>
                  <span className="font-bold text-slate-900">{selectedPlan.timeframe}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200/80 space-y-2">
                <div className="font-black text-xs text-cyan-900 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-cyan-700" />
                  <span>Kết quả &amp; Kiến nghị sau giám sát:</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedPlan.resultsSummary}
                </p>
              </div>

              {onOpenOpinionForm && (
                <button
                  onClick={onOpenOpinionForm}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Gửi phản ánh liên quan đến nội dung này</span>
                </button>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              Chọn một kế hoạch giám sát để xem chi tiết
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
