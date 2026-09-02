import React, { useState } from 'react';
import { PublicOpinion, OpinionStatus } from '../../types';
import { MessageSquare, Sparkles, Search, CheckCircle2, Send, Clock, UserCheck, ShieldAlert, FileText, AlertCircle } from 'lucide-react';

interface OpinionsAdminViewProps {
  opinions: PublicOpinion[];
  onUpdateOpinionStatus: (id: string, status: OpinionStatus, responseText?: string) => void;
  onOpenAiSummary: () => void;
}

export const OpinionsAdminView: React.FC<OpinionsAdminViewProps> = ({
  opinions,
  onUpdateOpinionStatus,
  onOpenAiSummary
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedOpinion, setSelectedOpinion] = useState<PublicOpinion | null>(null);
  const [responseText, setResponseText] = useState('');

  const filteredOpinions = opinions.filter(op => filterStatus === 'ALL' || op.status === filterStatus);

  const handleSaveResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpinion) return;
    onUpdateOpinionStatus(selectedOpinion.id, 'RESOLVED', responseText);
    setSelectedOpinion(null);
    setResponseText('');
  };

  const getStatusBadge = (s: OpinionStatus) => {
    switch (s) {
      case 'RESOLVED': return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-md">ĐÃ GIẢI QUYẾT</span>;
      case 'PROCESSING': return <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded-md">ĐANG XỬ LÝ</span>;
      default: return <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold text-[10px] rounded-md">MỚI TẠO</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <span>HÒM THƯ NẮM BẮT DƯ LUẬN XÃ HỘI</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Tiếp nhận, xử lý và phản hồi ý kiến phản ánh của nhân dân 21 Khu phố</p>
        </div>

        <button
          onClick={onOpenAiSummary}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Tạo Báo cáo AI Dư luận</span>
        </button>
      </div>

      {/* Filter and Stats Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Lọc theo trạng thái:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">Tất cả ({opinions.length})</option>
            <option value="NEW">Mới gửi</option>
            <option value="PROCESSING">Đang xử lý</option>
            <option value="RESOLVED">Đã giải quyết</option>
          </select>
        </div>

        <div className="text-slate-500 font-bold">
          Hiển thị {filteredOpinions.length} phản ánh
        </div>
      </div>

      {/* Opinions List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredOpinions.map((op) => (
            <div key={op.id} className="p-5 hover:bg-blue-50/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-blue-900">{op.receiptCode}</span>
                  {getStatusBadge(op.status)}
                  <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md text-[10px]">
                    {op.topic}
                  </span>
                  <span className="text-slate-400 font-medium">• {op.neighborhood}</span>
                </div>

                <p className="font-medium text-slate-800 leading-relaxed text-sm">{op.content}</p>

                <div className="flex items-center gap-4 text-slate-400 text-[11px] pt-1">
                  <span>Người gửi: <strong className="text-slate-700">{op.isAnonymous ? 'Ẩn danh' : op.fullname || 'Người dân'}</strong></span>
                  <span>Thời gian: {op.createdAt}</span>
                </div>

                {op.adminResponse && (
                  <div className="mt-2 p-3 bg-emerald-50 text-emerald-950 rounded-xl border border-emerald-200 text-xs">
                    <span className="font-bold block text-emerald-900 mb-0.5">Kết quả phản hồi cán bộ:</span>
                    <p>{op.adminResponse}</p>
                  </div>
                )}
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedOpinion(op);
                    setResponseText(op.adminResponse || '');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  Xử lý &amp; Phản hồi
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RESPONSE MODAL */}
      {selectedOpinion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">
                Cập nhật Kết quả Xử lý: {selectedOpinion.receiptCode}
              </h3>
              <button onClick={() => setSelectedOpinion(null)} className="text-stone-400 hover:text-stone-700">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <p className="font-bold text-stone-800 mb-1">{selectedOpinion.topic} - {selectedOpinion.neighborhood}</p>
                <p className="text-stone-600">{selectedOpinion.content}</p>
              </div>

              <form onSubmit={handleSaveResponse} className="space-y-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Nội dung kết quả xử lý / Phản hồi gửi người dân (*)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Nhập nội dung giải quyết của MTTQ và UBND phường..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-800 outline-hidden leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOpinion(null)}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs"
                  >
                    Lưu kết quả &amp; Đóng hồ sơ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
