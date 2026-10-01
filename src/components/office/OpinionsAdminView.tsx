import React, { useState, useMemo, useEffect } from 'react';
import { PublicOpinion, OpinionStatus } from '../../types';
import { 
  MessageSquare, Sparkles, Search, CheckCircle2, Send, Clock, 
  UserCheck, ShieldAlert, FileText, AlertCircle, Download, Trash2, 
  AlertTriangle, Phone, MapPin, Eye, Filter, User, Tag, Calendar,
  ArrowRight, ShieldCheck, Check, X
} from 'lucide-react';
import { exportPublicOpinionsToCsv } from '../../lib/exportUtils';
import { ContactService } from '../../lib/ai/contactService';

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
  const [filterSla, setFilterSla] = useState<'ALL' | 'OVERDUE' | 'NEAR_DUE' | 'ON_TIME'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOpinion, setSelectedOpinion] = useState<PublicOpinion | null>(null);
  const [opinionToDelete, setOpinionToDelete] = useState<PublicOpinion | null>(null);
  const [responseText, setResponseText] = useState('');
  const [assignedOfficer, setAssignedOfficer] = useState('Đ/c Nguyễn Huy (Thường trực)');
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Automated Toast Notification State for Immediate Admin Visual Feedback
  const [toastNotification, setToastNotification] = useState<{
    id: string;
    title: string;
    message: string;
    type: 'success' | 'info' | 'error';
    statusTag?: string;
  } | null>(null);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success', statusTag?: string) => {
    setToastNotification({ id: 'toast-' + Date.now(), title, message, type, statusTag });
  };

  useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => {
        setToastNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastNotification]);

  // Automated Status Update Wrapper with Immediate Toast Feedback
  const handleStatusUpdate = (id: string, newStatus: OpinionStatus, response?: string) => {
    onUpdateOpinionStatus(id, newStatus, response);

    const statusMap: Record<OpinionStatus, string> = {
      NEW: 'Mới tiếp nhận',
      PROCESSING: 'Đang xử lý',
      FORWARDED: 'Đã chuyển đơn vị xử lý',
      RESOLVED: 'Hoàn thành / Đã phản hồi',
      CLOSED: 'Đã đóng / Kết thúc'
    };

    const targetOp = opinions.find(o => o.id === id);
    const citizenName = targetOp?.fullname || (targetOp as any)?.authorName || 'Công dân';
    const statusLabel = statusMap[newStatus] || newStatus;

    showToast(
      'Cập nhật trạng thái thành công!',
      `Phản ánh #${id.slice(-6).toUpperCase()} (${citizenName}) đã chuyển sang trạng thái: "${statusLabel}".`,
      'success',
      statusLabel
    );

    if (selectedOpinion && selectedOpinion.id === id) {
      setSelectedOpinion(prev => prev ? { ...prev, status: newStatus, adminResponse: response || prev.adminResponse } : null);
    }
  };

  const cadres = useMemo(() => ContactService.getAllContacts(), []);

  // Calculate SLA status (48-hour default SLA)
  const calculateSLA = (createdAtStr: string, status: OpinionStatus) => {
    if (status === 'RESOLVED') {
      return { status: 'RESOLVED', label: 'Đã hoàn thành', color: 'emerald', hoursLeft: 0 };
    }
    const created = new Date(createdAtStr).getTime();
    if (isNaN(created)) {
      return { status: 'ON_TIME', label: 'Trong hạn (48h)', color: 'blue', hoursLeft: 36 };
    }
    const now = Date.now();
    const elapsedHours = (now - created) / (1000 * 60 * 60);
    const hoursLeft = Math.round(48 - elapsedHours);

    if (hoursLeft < 0) {
      return { status: 'OVERDUE', label: `Quá hạn ${Math.abs(hoursLeft)}h`, color: 'rose', hoursLeft };
    }
    if (hoursLeft <= 12) {
      return { status: 'NEAR_DUE', label: `Sắp hết hạn (${hoursLeft}h)`, color: 'amber', hoursLeft };
    }
    return { status: 'ON_TIME', label: `Còn ${hoursLeft}h`, color: 'blue', hoursLeft };
  };

  const filteredOpinions = useMemo(() => {
    return opinions.filter(op => {
      const matchesStatus = filterStatus === 'ALL' || op.status === filterStatus;
      
      const q = searchTerm.toLowerCase().trim();
      const author = op.fullname || (op as any).authorName || '';
      const phoneNum = op.phone || (op as any).authorPhone || '';
      const matchesSearch = !q || 
        op.content.toLowerCase().includes(q) ||
        author.toLowerCase().includes(q) ||
        phoneNum.includes(q) ||
        (op.neighborhood && op.neighborhood.toLowerCase().includes(q)) ||
        (op.id && op.id.toLowerCase().includes(q));

      const sla = calculateSLA(op.createdAt, op.status);
      const matchesSla = filterSla === 'ALL' || sla.status === filterSla;

      return matchesStatus && matchesSearch && matchesSla;
    });
  }, [opinions, filterStatus, filterSla, searchTerm]);

  const overdueCount = useMemo(() => {
    return opinions.filter(op => op.status !== 'RESOLVED' && calculateSLA(op.createdAt, op.status).status === 'OVERDUE').length;
  }, [opinions]);

  const handleSaveResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpinion) return;
    handleStatusUpdate(selectedOpinion.id, 'RESOLVED', responseText);
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
      setSelectedOpinion(null);
      setResponseText('');
    }, 1500);
  };

  const handleConfirmDelete = () => {
    if (!opinionToDelete) return;
    if (onDeleteOpinion) {
      onDeleteOpinion(opinionToDelete.id);
      showToast('Đã xóa phản ánh', `Đã xóa bản ghi phản ánh #${opinionToDelete.id.slice(-6).toUpperCase()} khỏi hệ thống!`, 'info');
    }
    if (selectedOpinion?.id === opinionToDelete.id) {
      setSelectedOpinion(null);
    }
    setOpinionToDelete(null);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn relative">
      
      {/* AUTOMATED TOAST NOTIFICATION CARD */}
      {toastNotification && (
        <div className="fixed top-5 right-5 z-50 max-w-md w-full animate-in slide-in-from-top-5 duration-300">
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 flex items-start gap-3 relative overflow-hidden">
            {/* Accent bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
              toastNotification.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'
            }`} />
            
            <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
              toastNotification.type === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-extrabold text-xs text-white">{toastNotification.title}</h4>
                {toastNotification.statusTag && (
                  <span className="px-2 py-0.2 bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded text-[9.5px] font-black uppercase">
                    {toastNotification.statusTag}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 leading-snug mt-1 font-medium">
                {toastNotification.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setToastNotification(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-md font-bold text-[10px]">
              QUẢN LÝ DÂN NGUYỆN (SLA 48H)
            </span>
            {overdueCount > 0 && (
              <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-md font-extrabold text-[10px] animate-pulse">
                {overdueCount} Phản ánh quá hạn
              </span>
            )}
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2 mt-1">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <span>Hòm Thư Dân Nguyện & Nắm Bắt Dư Luận 21 Khu Phố</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Tiếp nhận, thẩm tra, phân công và phản hồi kết quả trực tiếp cho nhân dân</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportPublicOpinionsToCsv(filteredOpinions)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition border border-slate-200"
            title="Xuất file Excel/CSV"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={onOpenAiSummary}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Tổng Hợp Dư Luận</span>
          </button>
        </div>
      </div>

      {/* SLA & Status Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo Mã phản ánh, Tên người gửi, SĐT hoặc Nội dung..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'NEW', label: 'Mới gửi' },
              { id: 'PROCESSING', label: 'Đang xử lý' },
              { id: 'RESOLVED', label: 'Hoàn thành' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                  filterStatus === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* SLA Filter */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs shrink-0">
            <span className="text-[11px] font-semibold text-slate-500 px-2">SLA:</span>
            <button
              onClick={() => setFilterSla('ALL')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${filterSla === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterSla('OVERDUE')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${filterSla === 'OVERDUE' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-600'}`}
            >
              Quá hạn
            </button>
            <button
              onClick={() => setFilterSla('NEAR_DUE')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${filterSla === 'NEAR_DUE' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-700'}`}
            >
              Sắp hạn
            </button>
          </div>
        </div>
      </div>

      {/* Main List & Details Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: List of Opinions */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
          {filteredOpinions.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Không tìm thấy phản ánh nào</p>
              <p className="text-xs text-slate-400">Thử thay đổi bộ lọc trạng thái hoặc từ khóa tìm kiếm</p>
            </div>
          ) : (
            filteredOpinions.map(op => {
              const sla = calculateSLA(op.createdAt, op.status);
              const isSelected = selectedOpinion?.id === op.id;

              return (
                <div
                  key={op.id}
                  onClick={() => {
                    setSelectedOpinion(op);
                    setResponseText(op.adminResponse || (op as any).responseText || '');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-blue-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        #{op.id.slice(-6).toUpperCase()}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {op.fullname || (op as any).authorName || 'Người dân ẩn danh'}
                      </span>
                    </div>

                    {/* SLA Badge */}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      sla.color === 'rose'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                        : sla.color === 'amber'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : sla.color === 'emerald'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {sla.label}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed font-medium">
                    {op.content}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {op.neighborhood || 'Chánh Hiệp'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {op.createdAt ? op.createdAt.split('T')[0] : 'Vừa xong'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected Opinion Detail & Response Form */}
        <div className="lg:col-span-7">
          {selectedOpinion ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-fadeIn">
              {/* Detail Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg">
                      MÃ: {selectedOpinion.id}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">
                      Gửi lúc: {selectedOpinion.createdAt || 'Mới đây'}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-1 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    {selectedOpinion.fullname || (selectedOpinion as any).authorName || 'Người dân ẩn danh'}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedOpinion.status !== 'PROCESSING' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedOpinion.id, 'PROCESSING')}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-200 transition cursor-pointer active:scale-95"
                    >
                      Chuyển Đang xử lý
                    </button>
                  )}
                  {selectedOpinion.status !== 'FORWARDED' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedOpinion.id, 'FORWARDED')}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold rounded-xl border border-blue-200 transition cursor-pointer active:scale-95"
                    >
                      Chuyển Đơn vị xử lý
                    </button>
                  )}
                  {selectedOpinion.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedOpinion.id, 'RESOLVED')}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl border border-emerald-200 transition cursor-pointer active:scale-95"
                    >
                      Đánh dấu Hoàn thành
                    </button>
                  )}
                  {selectedOpinion.status !== 'CLOSED' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedOpinion.id, 'CLOSED')}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition cursor-pointer active:scale-95"
                    >
                      Đóng đơn
                    </button>
                  )}
                  <button
                    onClick={() => setOpinionToDelete(selectedOpinion)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Xóa phản ánh"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Citizen Contact Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl text-xs border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Số điện thoại:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-blue-600" />
                    {selectedOpinion.phone || (selectedOpinion as any).authorPhone || 'Không cung cấp'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Địa bàn / Khu phố:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    {selectedOpinion.neighborhood || 'Toàn phường'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Trạng thái xử lý:</span>
                  <span className="font-bold text-blue-700 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {selectedOpinion.status === 'RESOLVED' ? 'Đã phản hồi' : 'Đang xử lý'}
                  </span>
                </div>
              </div>

              {/* Content Box */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700">Nội dung phản ánh của nhân dân:</span>
                <div className="p-4 bg-slate-50/90 rounded-xl border border-slate-200 text-slate-800 text-xs leading-relaxed font-medium whitespace-pre-wrap">
                  {selectedOpinion.content}
                </div>
              </div>

              {/* Response Form */}
              <form onSubmit={handleSaveResponse} className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Phản hồi chính thức của Ban Thường trực MTTQ / UBND:
                  </label>
                  <span className="text-[10px] text-slate-400">Hiển thị cho công dân tra cứu</span>
                </div>

                <textarea
                  rows={4}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Nhập nội dung giải trình, tiến độ xử lý hoặc kết quả giải quyết kiến nghị của bà con..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Cán bộ phụ trách:</span>
                    <select
                      value={assignedOfficer}
                      onChange={(e) => setAssignedOfficer(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2 py-1 font-bold text-xs focus:outline-none"
                    >
                      {cadres.map(c => (
                        <option key={c.id} value={`${c.name} (${c.title})`}>{c.name} - {c.title}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    {isSavedToast ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                    <span>{isSavedToast ? 'Đã lưu phản hồi!' : 'Lưu & Trả lời Công dân'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Chọn một phản ánh để xem chi tiết</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Nhấp vào danh sách phản ánh bên trái để xem nội dung đầy đủ, đối chiếu thông tin người gửi và soạn câu trả lời chính thức.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {opinionToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h4 className="font-bold text-base text-slate-900">Xác nhận xóa phản ánh?</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa phản ánh mã <strong className="text-slate-900">#{opinionToDelete.id.slice(-6).toUpperCase()}</strong> của công dân <strong className="text-slate-900">{opinionToDelete.fullname || (opinionToDelete as any).authorName || 'Ẩn danh'}</strong> không? Thao tác này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setOpinionToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
