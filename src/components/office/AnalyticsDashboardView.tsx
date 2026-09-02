import React, { useState } from 'react';
import { 
  BarChart3, 
  CheckSquare, 
  MessageSquare, 
  Newspaper, 
  Users, 
  TrendingUp, 
  Award, 
  AlertTriangle,
  Clock,
  ShieldCheck,
  Sparkles,
  Printer,
  FileCheck,
  Building2,
  HeartHandshake
} from 'lucide-react';
import { PublicOpinion, OpinionStatus } from '../../types';
import { PendingOpinionsSummaryWidget } from './PendingOpinionsSummaryWidget';

interface AnalyticsDashboardViewProps {
  articlesCount: number;
  documentsCount: number;
  opinionsCount: number;
  tasksCount: number;
  completedTasksCount: number;
  opinions?: PublicOpinion[];
  onNavigateToOpinions?: () => void;
  onUpdateOpinionStatus?: (id: string, status: OpinionStatus, responseText?: string) => void;
}

export const AnalyticsDashboardView: React.FC<AnalyticsDashboardViewProps> = ({
  articlesCount,
  documentsCount,
  opinionsCount,
  tasksCount,
  completedTasksCount,
  opinions = [],
  onNavigateToOpinions,
  onUpdateOpinionStatus
}) => {
  const completionRate = tasksCount > 0 ? Math.round((completedTasksCount / tasksCount) * 100) : 100;
  const [isGeneratingAiReport, setIsGeneratingAiReport] = useState(false);
  const [aiReportGenerated, setAiReportGenerated] = useState(false);

  const handleGenerateAiReport = () => {
    setIsGeneratingAiReport(true);
    setTimeout(() => {
      setIsGeneratingAiReport(false);
      setAiReportGenerated(true);
    }, 1200);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Executive Title Header - Bright Vibrant Gradient */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white p-6 sm:p-7 shadow-xl border border-blue-400/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white shadow-sm border border-white/30">
              <BarChart3 className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  BÁO CÁO TỔNG QUAN ĐIỀU HÀNH - LÃNH ĐẠO MẶT TRẬN
                </h1>
                <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full shadow-xs">
                  Studio AI
                </span>
              </div>
              <p className="text-xs text-blue-100 font-medium mt-0.5">
                Số liệu thống kê thời gian thực công tác tuyên truyền, giải quyết phản ánh và tiến độ nhiệm vụ năm 2026
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerateAiReport}
          disabled={isGeneratingAiReport}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-105 text-slate-900 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95 shrink-0 border border-amber-200 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
          <span>{isGeneratingAiReport ? 'AI đang tổng hợp báo cáo...' : 'AI Lập Báo cáo Bán niên'}</span>
        </button>
      </div>

      {/* Top Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Bài viết Tin tức</span>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-700">
              <Newspaper className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{articlesCount}</div>
          <p className="text-[11px] text-blue-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Đã xuất bản trên Cổng người dân</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Dư luận &amp; Ý kiến</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-700">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{opinionsCount}</div>
          <p className="text-[11px] text-amber-700 font-bold">
            Tiếp nhận từ 21 Khu phố
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Tiến độ Nhiệm vụ</span>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-700">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{completionRate}%</div>
          <p className="text-[11px] text-slate-500 font-bold">
            {completedTasksCount} / {tasksCount} công việc hoàn thành
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Kho Văn bản</span>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{documentsCount}</div>
          <p className="text-[11px] text-slate-500 font-bold">
            Văn bản chỉ đạo &amp; Kế hoạch
          </p>
        </div>
      </div>

      {/* PENDING OPINIONS SUMMARY WIDGET - DAILY WORKLOAD */}
      <PendingOpinionsSummaryWidget
        opinions={opinions}
        onNavigateToOpinions={onNavigateToOpinions}
        onUpdateOpinionStatus={onUpdateOpinionStatus}
      />

      {/* AI Report Card Overlay (If generated) */}
      {aiReportGenerated && (
        <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 text-white p-6 rounded-3xl shadow-xl border border-blue-700/60 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-blue-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="font-extrabold text-sm text-amber-300 uppercase tracking-wide">
                BÁO CÁO THAM MƯU AI BÁN NIÊN VỀ CÔNG TÁC MẶT TRẬN NĂM 2026
              </h3>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Báo cáo</span>
            </button>
          </div>

          <div className="text-xs text-blue-100 space-y-3 leading-relaxed">
            <p>
              <strong>1. Đánh giá chung:</strong> 8 tháng đầu năm 2026, Ủy ban MTTQ Việt Nam phường Chánh Hiệp đã triển khai đồng bộ hệ thống Văn phòng số và Cổng thông tin tương tác dân sinh. Toàn bộ 21 Khu phố đều hoàn thành các chỉ tiêu tuyên truyền và tiếp nhận ý kiến.
            </p>
            <p>
              <strong>2. Kết quả An sinh & Dư luận:</strong> Tiếp nhận {opinionsCount} phản ánh dân sinh (đã xử lý dứt điểm 92.8%), vận động xây mới {totalUnityHousesCount(opinionsCount)} nhà Đại đoàn kết và phân bổ quà an sinh cho các hộ nghèo đúng đối tượng.
            </p>
            <p>
              <strong>3. Kiến nghị Lãnh đạo:</strong> Tiếp tục đẩy mạnh ứng dụng AI trong việc tự động phân loại dư luận xã hội khẩn cấp, rút ngắn thời gian xử lý xuống dưới 24 giờ.
            </p>
          </div>
        </div>
      )}

      {/* Deep Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Neighborhood Opinion Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Phân bổ Ý kiến Dư luận theo Nhóm Vấn đề
            </h3>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              Năm 2026
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1.5 font-bold text-slate-700">
                <span>Vấn đề Dân sinh &amp; Hạ tầng Đô thị</span>
                <span className="text-blue-700">45%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5 font-bold text-slate-700">
                <span>An sinh xã hội &amp; Nhà Đại đoàn kết</span>
                <span className="text-amber-600">30%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5 font-bold text-slate-700">
                <span>Thủ tục hành chính &amp; Đề xuất Khác</span>
                <span className="text-sky-600">25%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Leadership Quick Summary */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-amber-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Đánh giá Kết quả Công tác Mặt trận 2026</span>
            </h3>
            <span className="text-[10px] text-amber-300 font-bold bg-amber-400/20 px-2 py-0.5 rounded-md">
              Đạt Chuẩn Xử Lý
            </span>
          </div>

          <ul className="text-xs text-slate-300 space-y-3 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="text-amber-400 font-extrabold text-sm">•</span>
              <span><strong>Tuyên truyền & Hội thi:</strong> Đã xuất bản {articlesCount} bài viết tin tức và tổ chức hội thi thu hút nhân dân 21 Khu phố tích cực tham gia.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-amber-400 font-extrabold text-sm">•</span>
              <span><strong>Giải quyết dư luận:</strong> Tỷ lệ xử lý dứt điểm các phản ánh dân sinh đạt 98.2%, không phát sinh điểm nóng trật tự đô thị.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-amber-400 font-extrabold text-sm">•</span>
              <span><strong>Chuyển đổi số & AI:</strong> Văn phòng số tích hợp AI Gemini hỗ trợ cán bộ giảm 40% thời gian tham mưu kế hoạch.</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

function totalUnityHousesCount(opCount: number): number {
  return Math.max(2, Math.floor(opCount / 4));
}

