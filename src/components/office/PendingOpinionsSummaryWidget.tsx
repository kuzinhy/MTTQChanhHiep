import React, { useState } from 'react';
import { 
  PublicOpinion, 
  OpinionStatus, 
  PriorityLevel 
} from '../../types';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Filter, 
  MapPin, 
  MessageSquare, 
  Phone, 
  Send, 
  Sparkles, 
  User, 
  Zap, 
  AlertTriangle,
  ArrowUpRight,
  CheckCircle,
  FileText,
  X
} from 'lucide-react';

interface PendingOpinionsSummaryWidgetProps {
  opinions: PublicOpinion[];
  onNavigateToOpinions?: () => void;
  onUpdateOpinionStatus?: (id: string, status: OpinionStatus, responseText?: string) => void;
}

export const PendingOpinionsSummaryWidget: React.FC<PendingOpinionsSummaryWidgetProps> = ({
  opinions = [],
  onNavigateToOpinions,
  onUpdateOpinionStatus
}) => {
  const [filterType, setFilterType] = useState<'ALL_PENDING' | 'URGENT' | 'NEW' | 'PROCESSING'>('ALL_PENDING');
  const [selectedOpinionForQuickResponse, setSelectedOpinionForQuickResponse] = useState<PublicOpinion | null>(null);
  const [quickResponseText, setQuickResponseText] = useState('');
  const [quickResponseStatus, setQuickResponseStatus] = useState<OpinionStatus>('RESOLVED');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeOpinions = Array.isArray(opinions) ? opinions : [];

  // Filter pending opinions (NEW or PROCESSING or FORWARDED)
  const pendingOpinions = safeOpinions.filter(
    op => op && (op.status === 'NEW' || op.status === 'PROCESSING' || op.status === 'FORWARDED')
  );

  const resolvedOpinions = safeOpinions.filter(op => op && (op.status === 'RESOLVED' || op.status === 'CLOSED'));
  const totalCount = safeOpinions.length;

  // Breakdown metrics
  const newCount = safeOpinions.filter(op => op && op.status === 'NEW').length;
  const processingCount = safeOpinions.filter(op => op && (op.status === 'PROCESSING' || op.status === 'FORWARDED')).length;
  const urgentCount = pendingOpinions.filter(
    op => op && (op.priority === 'URGENT' || op.priority === 'HIGH')
  ).length;

  const resolutionRate = totalCount > 0 
    ? Math.round((resolvedOpinions.length / totalCount) * 100) 
    : 100;

  // Filter list based on selected tab
  const displayedOpinions = pendingOpinions.filter(op => {
    if (filterType === 'URGENT') return op.priority === 'URGENT' || op.priority === 'HIGH';
    if (filterType === 'NEW') return op.status === 'NEW';
    if (filterType === 'PROCESSING') return op.status === 'PROCESSING' || op.status === 'FORWARDED';
    return true; // ALL_PENDING
  }).sort((a, b) => {
    // Sort urgent first, then newest
    const priorityWeight: Record<PriorityLevel, number> = {
      'URGENT': 4,
      'HIGH': 3,
      'NORMAL': 2,
      'LOW': 1
    };
    const pA = priorityWeight[a.priority || 'NORMAL'] || 2;
    const pB = priorityWeight[b.priority || 'NORMAL'] || 2;
    if (pB !== pA) return pB - pA;
    return (b.createdAt || '').localeCompare(a.createdAt || '');
  });

  // Calculate top neighborhoods with pending opinions
  const neighborhoodCounts: Record<string, number> = {};
  pendingOpinions.forEach(op => {
    const nh = op.neighborhood || 'Khu phố khác';
    neighborhoodCounts[nh] = (neighborhoodCounts[nh] || 0) + 1;
  });
  const topNeighborhoods = Object.entries(neighborhoodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const handleOpenQuickResponse = (op: PublicOpinion) => {
    setSelectedOpinionForQuickResponse(op);
    setQuickResponseText(op.adminResponse || '');
    setQuickResponseStatus('RESOLVED');
  };

  const handleSaveQuickResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpinionForQuickResponse || !onUpdateOpinionStatus) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onUpdateOpinionStatus(
        selectedOpinionForQuickResponse.id,
        quickResponseStatus,
        quickResponseText.trim() ? quickResponseText.trim() : 'Ủy ban MTTQ Phường Chánh Hiệp đã tiếp nhận, chỉ đạo cơ sở kiểm tra và giải quyết dứt điểm theo quy định.'
      );
      setIsSubmitting(false);
      setSelectedOpinionForQuickResponse(null);
      setQuickResponseText('');
    }, 400);
  };

  const handleQuickMarkProcessing = (op: PublicOpinion) => {
    if (!onUpdateOpinionStatus) return;
    onUpdateOpinionStatus(op.id, 'PROCESSING', op.adminResponse);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header section with energetic gradient accent */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-700 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  KHỐI LƯỢNG CÔNG VIỆC DÂN SINH CẦN HOÀN THÀNH TRONG NGÀY
                </h3>
                {pendingOpinions.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white animate-pulse">
                    {pendingOpinions.length} Tồn đọng
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 font-normal mt-0.5">
                Tổng hợp ý kiến, phản ánh dân sinh từ 21 Khu phố đang chờ cán bộ xử lý &amp; phản hồi dứt điểm
              </p>
            </div>
          </div>
        </div>

        {/* Action button to full opinions view */}
        {onNavigateToOpinions && (
          <button
            onClick={onNavigateToOpinions}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-300/30 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all self-start md:self-auto cursor-pointer"
          >
            <span>Quản trị Hòm thư Đầy đủ</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Workload Quick Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 border-b border-slate-100 bg-slate-50/50">
        <div className="p-4 sm:p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-black">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
              {pendingOpinions.length}
            </div>
            <div className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
              Tổng chờ xử lý
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 font-black">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-rose-600 leading-none">
              {urgentCount}
            </div>
            <div className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
              Cần xử lý khẩn cấp
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-black">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-blue-700 leading-none">
              {newCount}
            </div>
            <div className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
              Ý kiến mới nhận
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-black">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 leading-none">
              {resolutionRate}%
            </div>
            <div className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
              Tỷ lệ giải quyết ({resolvedOpinions.length}/{totalCount})
            </div>
          </div>
        </div>
      </div>

      {/* Top neighborhood distribution badge strip */}
      {topNeighborhoods.length > 0 && (
        <div className="px-5 py-3 bg-slate-100/70 border-b border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 font-bold">
            <MapPin className="w-3.5 h-3.5 text-rose-600" />
            <span>Địa bàn có nhiều ý kiến tồn đọng:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {topNeighborhoods.map(([nh, count]) => (
              <span 
                key={nh}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-[11px] font-bold shadow-2xs"
              >
                <span>{nh}</span>
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-black">
                  {count}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Content: Filter Tabs & Pending List */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterType('ALL_PENDING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterType === 'ALL_PENDING' 
                  ? 'bg-white text-slate-900 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({pendingOpinions.length})
            </button>
            <button
              onClick={() => setFilterType('URGENT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                filterType === 'URGENT' 
                  ? 'bg-rose-600 text-white shadow-2xs' 
                  : 'text-rose-700 hover:text-rose-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
              <span>Khẩn cấp ({urgentCount})</span>
            </button>
            <button
              onClick={() => setFilterType('NEW')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterType === 'NEW' 
                  ? 'bg-blue-600 text-white shadow-2xs' 
                  : 'text-blue-700 hover:text-blue-900'
              }`}
            >
              Mới tiếp nhận ({newCount})
            </button>
            <button
              onClick={() => setFilterType('PROCESSING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterType === 'PROCESSING' 
                  ? 'bg-amber-600 text-white shadow-2xs' 
                  : 'text-amber-700 hover:text-amber-900'
              }`}
            >
              Đang phối hợp ({processingCount})
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Hiển thị <strong>{displayedOpinions.length}</strong> công việc ưu tiên
          </div>
        </div>

        {/* Pending Opinions Card List */}
        {displayedOpinions.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">Không có ý kiến tồn đọng trong danh mục này!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Tất cả các phản ánh dân sinh đã được cán bộ xử lý hoặc chuyển đến các đơn vị chuyên môn.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedOpinions.map((op) => {
              const isUrgent = op.priority === 'URGENT' || op.priority === 'HIGH';
              const isNew = op.status === 'NEW';

              return (
                <div
                  key={op.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isUrgent 
                      ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300 hover:shadow-xs' 
                      : 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    {/* Header info badges */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md font-mono text-[11px]">
                        {op.receiptCode || `#${op.id.substring(0, 8)}`}
                      </span>

                      {/* Priority Badge */}
                      {isUrgent ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-600 text-white font-black text-[10px] tracking-wide uppercase shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                          Khẩn cấp
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                          Bình thường
                        </span>
                      )}

                      {/* Status Badge */}
                      {isNew ? (
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-black text-[10px]">
                          MỚI GỬI
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-black text-[10px]">
                          ĐANG XỬ LÝ
                        </span>
                      )}

                      {/* Topic Badge */}
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                        {op.topic}
                      </span>

                      {/* Neighborhood */}
                      <span className="inline-flex items-center gap-1 text-slate-500 font-semibold text-[11px]">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        {op.neighborhood || 'Toàn phường'}
                      </span>
                    </div>

                    {/* Content text */}
                    <p className="text-slate-800 text-xs sm:text-sm font-medium leading-relaxed line-clamp-2">
                      {op.content}
                    </p>

                    {/* Submitter Details & Time */}
                    <div className="flex flex-wrap items-center gap-4 text-slate-500 text-[11px]">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <strong className="text-slate-700 font-semibold">
                          {op.isAnonymous ? 'Người dân (Ẩn danh)' : op.fullname || 'Người dân Chánh Hiệp'}
                        </strong>
                      </span>
                      {op.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span className="font-mono">{op.phone}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{op.createdAt || 'Hôm nay'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Quick Action buttons */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {op.status === 'NEW' && onUpdateOpinionStatus && (
                      <button
                        onClick={() => handleQuickMarkProcessing(op)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                        title="Đánh dấu đang thụ lý giải quyết"
                      >
                        Tiếp nhận
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenQuickResponse(op)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Xử lý &amp; Phản hồi</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QUICK RESPONSE MODAL DIALOG */}
      {selectedOpinionForQuickResponse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">
                    Xử lý &amp; Phản hồi Ý kiến Dân sinh
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Mã hồ sơ: <strong className="text-blue-700 font-mono">{selectedOpinionForQuickResponse.receiptCode}</strong> - {selectedOpinionForQuickResponse.neighborhood}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOpinionForQuickResponse(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Opinion content preview */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-500 font-semibold text-[11px]">
                <span>Người gửi: <strong>{selectedOpinionForQuickResponse.fullname || 'Người dân'}</strong></span>
                <span>Chủ đề: <strong className="text-indigo-700">{selectedOpinionForQuickResponse.topic}</strong></span>
              </div>
              <p className="text-slate-800 font-medium leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100">
                "{selectedOpinionForQuickResponse.content}"
              </p>
            </div>

            {/* Response Form */}
            <form onSubmit={handleSaveQuickResponse} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Cập nhật Trạng thái xử lý:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickResponseStatus('RESOLVED')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      quickResponseStatus === 'RESOLVED'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Đã giải quyết dứt điểm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuickResponseStatus('PROCESSING')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      quickResponseStatus === 'PROCESSING'
                        ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Đang phối hợp xử lý</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Nội dung phản hồi chính thức cho người dân:</span>
                  <span className="text-[10px] text-slate-400 font-normal">Sẽ được lưu vào hồ sơ công khai</span>
                </label>
                <textarea
                  rows={4}
                  value={quickResponseText}
                  onChange={(e) => setQuickResponseText(e.target.value)}
                  placeholder="Nhập nội dung giải đáp, biện pháp xử lý hoặc hướng dẫn cụ thể của Ủy ban Mặt trận..."
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedOpinionForQuickResponse(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Đang lưu trữ...' : 'Lưu & Hoàn tất'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
