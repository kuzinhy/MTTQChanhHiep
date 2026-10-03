import React from 'react';
import { 
  Heart, Baby, Home, Users, Building, 
  Sparkles, ArrowRight, CheckCircle2, ChevronRight 
} from 'lucide-react';

interface LifeEventBundle {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge: string;
  accent: string;
  description: string;
  procedureIds: string[];
  procedureNames: string[];
}

export const LIFE_EVENT_BUNDLES: LifeEventBundle[] = [
  {
    id: 'bundle-birth',
    title: 'Chào đón Thành viên mới',
    subtitle: 'Khai sinh & Quyền lợi cho bé',
    icon: Baby,
    badge: 'GÓI LIÊN THÔNG',
    accent: 'from-pink-500 to-rose-500',
    description: 'Dịch vụ liên thông 3 trong 1: Khai sinh, Đăng ký thường trú và Cấp thẻ BHYT cho trẻ dưới 6 tuổi.',
    procedureIds: ['proc-03', 'proc-05'],
    procedureNames: ['Đăng ký khai sinh', 'Cấp thẻ BHYT trẻ em', 'Đăng ký thường trú']
  },
  {
    id: 'bundle-marriage',
    title: 'Xây dựng Tổ ấm & Hôn nhân',
    subtitle: 'Độc thân & Đăng ký kết hôn',
    icon: Heart,
    badge: 'HÔN NHÂN & GIA ĐÌNH',
    accent: 'from-rose-500 to-amber-500',
    description: 'Xác nhận tình trạng độc thân phục vụ đăng ký kết hôn hoặc giao dịch tài sản cá nhân.',
    procedureIds: ['proc-02'],
    procedureNames: ['Cấp Giấy xác nhận tình trạng hôn nhân', 'Đăng ký kết hôn']
  },
  {
    id: 'bundle-property',
    title: 'Nhà đất & Giao dịch Pháp lý',
    subtitle: 'Sao y & Chứng thực giấy tờ',
    icon: Home,
    badge: 'CHỨNG THỰC & ĐẤT ĐAI',
    accent: 'from-blue-500 to-cyan-500',
    description: 'Chứng thực bản sao giấy tờ nhà đất, hợp đồng chuyển nhượng và trích lục hồ sơ địa chính.',
    procedureIds: ['proc-01', 'proc-05'],
    procedureNames: ['Chứng thực bản sao từ bản chính', 'Cấp trích lục hồ sơ', 'Xác nhận cư trú']
  },
  {
    id: 'bundle-elderly',
    title: 'An sinh & Người cao tuổi',
    subtitle: 'Trợ cấp & Chế độ hưu trí',
    icon: Users,
    badge: 'CHÍNH SÁCH XÃ HỘI',
    accent: 'from-emerald-500 to-teal-500',
    description: 'Thủ tục hưởng trợ cấp xã hội hàng tháng, cấp thẻ BHYT miễn phí và mừng thọ người cao tuổi.',
    procedureIds: ['proc-04'],
    procedureNames: ['Hưởng trợ cấp người cao tuổi', 'Cấp thẻ BHYT đối tượng bảo trợ', 'Mai táng phí']
  }
];

interface LifeEventBundlesWidgetProps {
  onSelectProcedure?: (procedureId: string) => void;
  onOpenProcedureModal?: () => void;
}

export const LifeEventBundlesWidget: React.FC<LifeEventBundlesWidgetProps> = ({
  onSelectProcedure,
  onOpenProcedureModal
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4 font-sans select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600">
              GỢI Ý THEO TÌNH HUỐNG ĐỜI SỐNG
            </span>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Bạn đang chuẩn bị thực hiện việc gì?
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenProcedureModal}
          className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 self-start sm:self-center cursor-pointer"
        >
          <span>Xem tất cả thủ tục</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Bundles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {LIFE_EVENT_BUNDLES.map(bundle => {
          const Icon = bundle.icon;
          return (
            <div
              key={bundle.id}
              onClick={onOpenProcedureModal}
              className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 group shadow-2xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${bundle.accent} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                    {bundle.badge}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                    {bundle.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {bundle.description}
                  </p>
                </div>
              </div>

              {/* Package Procedure Tags */}
              <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Gồm các thủ tục:</span>
                <div className="flex flex-wrap gap-1">
                  {bundle.procedureNames.map((p, i) => (
                    <span key={i} className="text-[10px] bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium truncate max-w-full">
                      • {p}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
