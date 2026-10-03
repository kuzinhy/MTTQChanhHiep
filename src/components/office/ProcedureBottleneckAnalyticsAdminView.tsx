import React, { useState } from 'react';
import { 
  BarChart3, AlertTriangle, TrendingUp, Sparkles, CheckCircle2, 
  Clock, Users, ArrowRight, ShieldCheck, Download, FileText, RefreshCw 
} from 'lucide-react';

export const ProcedureBottleneckAnalyticsAdminView: React.FC<{ onTriggerToast: (title: string, msg?: string) => void }> = ({
  onTriggerToast
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'WEEK' | 'MONTH' | 'QUARTER'>('MONTH');

  // Simulated AI Bottleneck analytics data
  const bottlenecks = [
    {
      id: 'b1',
      procedureCode: 'T-HT-02',
      procedureName: 'Cấp Giấy xác nhận tình trạng hôn nhân',
      problemStep: 'Bước 2: Chuẩn bị giấy tờ minh chứng',
      dropOffRate: '42.5%',
      cause: 'Công dân từng ly hôn thường quên mang Bản án ly hôn có hiệu lực hoặc Giấy chứng tử của vợ/chồng cũ.',
      aiSuggestion: 'Tự động gửi tin nhắn SMS/Zalo nhắc nhở thành phần hồ sơ đặc thù khi công dân chọn tình trạng "Đã từng kết hôn".',
      severity: 'HIGH'
    },
    {
      id: 'b2',
      procedureCode: 'T-CT-01',
      procedureName: 'Chứng thực bản sao từ bản chính',
      problemStep: 'Bước 3: Lấy số và nộp tại Quầy số 1',
      dropOffRate: '28.1%',
      cause: 'Khung giờ 10:00 - 11:00 mật độ cao, số lượng trang chứng thực nhiều dẫn đến kéo dài thời gian ký duyệt.',
      aiSuggestion: 'Khuyến khích công dân tải file PDF lên Cổng DVC trực tuyến trước để cán bộ in sẵn và chỉ cần đối chiếu bản gốc.',
      severity: 'MEDIUM'
    },
    {
      id: 'b3',
      procedureCode: 'T-HT-03',
      procedureName: 'Đăng ký khai sinh',
      problemStep: 'Bước 4: Đồng bộ CSDL và cấp Số định danh',
      dropOffRate: '14.2%',
      cause: 'Đường truyền kết nối liên thông Bộ Công an có thời điểm bị nghẽn trong khung giờ cao điểm toàn quốc.',
      aiSuggestion: 'Hệ thống tự động xếp hàng nền (Background Queue) và thông báo kết quả trả qua VNeID khi hoàn tất.',
      severity: 'LOW'
    }
  ];

  const handleExportReport = () => {
    onTriggerToast('Đã xuất báo cáo', 'File Báo cáo Cải cách Hành chính (CCHC) định dạng Excel đã được tải xuống.');
  };

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono text-[10px] font-black">
                AI BOTTLENECK ENGINE
              </span>
              <span className="text-xs text-slate-500 font-bold">Thuật toán Phân tích Điểm nghẽn Một cửa</span>
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
              Phân tích Tải lượng &amp; Điểm nghẽn Quy trình Hành chính
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportReport}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Báo cáo CCHC mẫu Bộ Nội vụ</span>
          </button>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Tỷ lệ hoàn thành đúng hạn</span>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-black text-emerald-600 font-mono">99.4%</strong>
            <span className="text-[11px] text-emerald-700 font-bold">+0.8% so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Tỷ lệ hồ sơ trực tuyến</span>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-black text-blue-600 font-mono">84.2%</strong>
            <span className="text-[11px] text-blue-700 font-bold">Vượt chỉ tiêu 14.2%</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Chỉ số hài lòng công dân</span>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-black text-amber-600 font-mono">98.9%</strong>
            <span className="text-[11px] text-slate-500 font-medium">Trên 1.420 phiếu đánh giá</span>
          </div>
        </div>
      </div>

      {/* AI Bottleneck Analysis Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Các điểm nghẽn hành chính được AI phát hiện &amp; Khuyến nghị giải pháp</span>
          </h3>
          <span className="text-xs font-mono text-slate-400 font-bold">3 điểm nghẽn đang giám sát</span>
        </div>

        <div className="space-y-3">
          {bottlenecks.map(b => (
            <div key={b.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-xs font-black">
                    {b.procedureCode}
                  </span>
                  <strong className="text-xs sm:text-sm font-black text-slate-900">{b.procedureName}</strong>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  b.severity === 'HIGH' ? 'bg-rose-100 text-rose-800' : b.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  Tỷ lệ phát sinh vướng mắc: {b.dropOffRate}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-rose-700 block">⚠️ Vị trí &amp; Nguyên nhân nghẽn:</span>
                  <p className="text-slate-700 font-medium"><strong>{b.problemStep}:</strong> {b.cause}</p>
                </div>

                <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Giải pháp AI đề xuất:</span>
                  </span>
                  <p className="text-emerald-900 font-medium">{b.aiSuggestion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
