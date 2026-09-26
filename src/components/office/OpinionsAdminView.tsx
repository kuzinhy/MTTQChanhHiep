import React, { useState } from 'react';
import { PublicOpinion, OpinionStatus } from '../../types';
import { MessageSquare, Sparkles, Search, CheckCircle2, Send, Clock, UserCheck, ShieldAlert, FileText, AlertCircle, Download, Trash2, AlertTriangle } from 'lucide-react';
import { exportPublicOpinionsToCsv } from '../../lib/exportUtils';

interface OpinionsAdminViewProps {
  opinions: PublicOpinion[];
  onUpdateOpinionStatus: (id: string, status: OpinionStatus, responseText?: string) => void;
  onDeleteOpinion?: (id: string) => void;
  onOpenAiSummary: () => void;
}

export const OpinionsAdminView: React.FC<OpinionsAdminViewProps> = ({
  opinions,
  onUpdateOpinionStatus,
  onDeleteOpinion,
  onOpenAiSummary
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedOpinion, setSelectedOpinion] = useState<PublicOpinion | null>(null);
  const [opinionToDelete, setOpinionToDelete] = useState<PublicOpinion | null>(null);
  const [responseText, setResponseText] = useState('');

  const filteredOpinions = opinions.filter(op => filterStatus === 'ALL' || op.status === filterStatus);

  const handleSaveResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpinion) return;
    onUpdateOpinionStatus(selectedOpinion.id, 'RESOLVED', responseText);
    setSelectedOpinion(null);
    setResponseText('');
  };

  const handleConfirmDelete = () => {
    if (!opinionToDelete) return;
    if (onDeleteOpinion) {
      onDeleteOpinion(opinionToDelete.id);
    }
    if (selectedOpinion?.id === opinionToDelete.id) {
      setSelectedOpinion(null);
    }
    setOpinionToDelete(null);
  };

  const getStatusBadge = (s: OpinionStatus) => {
    switch (s) {
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300/80 font-black text-[11px] rounded-lg shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>HOÀN THÀNH</span>
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-300/80 font-black text-[11px] rounded-lg shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>ĐANG XỬ LÝ</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-300/80 font-black text-[11px] rounded-lg shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>MỚI GỬI</span>
          </span>
        );
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportPublicOpinionsToCsv(filteredOpinions)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 transition-all border border-slate-300"
            title="Xuất file Excel/CSV chuẩn UTF-8"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Xuất Excel / CSV</span>
          </button>

          <button
            onClick={onOpenAiSummary}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Tạo Báo cáo AI Dư luận</span>
          </button>
        </div>
      </div>

      {/* Filter and Stats Bar with Status Summary Badges */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-black text-slate-700 mr-1">Bộ lọc:</span>
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filterStatus === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất cả ({opinions.length})
          </button>
          <button
            onClick={() => setFilterStatus('NEW')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'NEW'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Mới ({opinions.filter(o => o.status === 'NEW' || !o.status).length})</span>
          </button>
          <button
            onClick={() => setFilterStatus('PROCESSING')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'PROCESSING'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Đang xử lý ({opinions.filter(o => o.status === 'PROCESSING').length})</span>
          </button>
          <button
            onClick={() => setFilterStatus('RESOLVED')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'RESOLVED'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Hoàn thành ({opinions.filter(o => o.status === 'RESOLVED').length})</span>
          </button>
        </div>

        <div className="text-slate-500 font-bold self-end lg:self-center">
          Hiển thị <span className="text-blue-700 font-black">{filteredOpinions.length}</span> phản ánh
        </div>
      </div>

      {/* Opinions List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredOpinions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-bold">Không có ý kiến nào trong danh mục lọc này.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredOpinions.map((op) => (
              <div 
                key={op.id} 
                className={`p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs ${
                  op.status === 'NEW' || !op.status 
                    ? 'bg-rose-50/20 hover:bg-rose-50/40 border-l-4 border-l-rose-500' 
                    : op.status === 'PROCESSING' 
                    ? 'bg-amber-50/20 hover:bg-amber-50/40 border-l-4 border-l-amber-500' 
                    : 'hover:bg-slate-50 border-l-4 border-l-emerald-500'
                }`}
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      {op.receiptCode || op.id}
                    </span>
                    {getStatusBadge(op.status)}
                    <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-md text-[10px] border border-slate-200">
                      {op.topic}
                    </span>
                    <span className="text-slate-500 font-semibold">• {op.neighborhood}</span>
                  </div>

                  <p className="font-bold text-slate-900 leading-relaxed text-sm">{op.content}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-[11px] pt-1">
                    <span>Người gửi: <strong className="text-slate-800">{op.isAnonymous ? 'Ẩn danh' : op.fullname || 'Người dân'}</strong></span>
                    {op.phone && <span>SĐT: <strong className="text-slate-800">{op.phone}</strong></span>}
                    {op.address && <span>Địa chỉ: <strong className="text-slate-800">{op.address}</strong></span>}
                    <span>Thời gian: {op.createdAt}</span>
                  </div>

                  {op.adminResponse && (
                    <div className="mt-2 p-3 bg-emerald-50/90 text-emerald-950 rounded-xl border border-emerald-300 text-xs shadow-2xs">
                      <div className="flex items-center gap-1.5 font-black text-emerald-900 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kết quả phản hồi của Ban Thường trực MTTQ:</span>
                      </div>
                      <p className="leading-relaxed">{op.adminResponse}</p>
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedOpinion(op);
                      setResponseText(op.adminResponse || '');
                    }}
                    className="px-4 py-2 bg-[#0052cc] hover:bg-[#0043aa] text-white font-black text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Xử lý &amp; Phản hồi</span>
                  </button>

                  {onDeleteOpinion && (
                    <button
                      type="button"
                      onClick={() => setOpinionToDelete(op)}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                      title="Xóa phản ánh dư luận này"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Xóa</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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

                <div className="flex items-center justify-between pt-2">
                  {onDeleteOpinion ? (
                    <button
                      type="button"
                      onClick={() => setOpinionToDelete(selectedOpinion)}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Xóa phản ánh này</span>
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-2">
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
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {opinionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-rose-200">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-extrabold text-stone-900 text-base">Xác nhận xóa phản ánh</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa phản ánh mã số <strong className="text-rose-700">{opinionToDelete.receiptCode || opinionToDelete.id}</strong> không?
            </p>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 italic">
              "{opinionToDelete.topic} - {opinionToDelete.content.substring(0, 80)}{opinionToDelete.content.length > 80 ? '...' : ''}"
            </div>
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-800 font-semibold">
              ⚠️ Lưu ý: Thao tác này sẽ xóa vĩnh viễn dữ liệu phản ánh khỏi hệ thống và không thể phục hồi.
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setOpinionToDelete(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl shadow-xs text-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xác nhận Xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

