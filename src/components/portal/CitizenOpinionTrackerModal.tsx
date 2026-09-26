import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  MessageSquare, 
  ArrowRight, 
  Building2, 
  Calendar, 
  Star, 
  Send, 
  AlertCircle, 
  Share2, 
  Check, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Award
} from 'lucide-react';
import { PublicOpinion, OpinionStatus } from '../../types';
import { AppStorageEngine, STORAGE_KEYS } from '../../lib/storage';

interface CitizenOpinionTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  opinions?: PublicOpinion[];
  onOpenNewOpinionForm?: () => void;
}

export const CitizenOpinionTrackerModal: React.FC<CitizenOpinionTrackerModalProps> = ({
  isOpen,
  onClose,
  opinions = [],
  onOpenNewOpinionForm
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOpinion, setSelectedOpinion] = useState<PublicOpinion | null>(null);
  const [satisfactionRating, setSatisfactionRating] = useState<'VERY_SATISFIED' | 'SATISFIED' | 'NEEDS_IMPROVEMENT' | null>(null);
  const [citizenFeedbackText, setCitizenFeedbackText] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Load all opinions from storage if empty
  const allOpinions = useMemo(() => {
    if (opinions && opinions.length > 0) return opinions;
    return AppStorageEngine.getItem<PublicOpinion[]>(STORAGE_KEYS.OPINIONS, []);
  }, [opinions]);

  // Search logic
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allOpinions.filter(item => {
      const code = (item.receiptCode || item.id || '').toLowerCase();
      const phone = (item.phone || '').toLowerCase();
      const name = (item.fullname || '').toLowerCase();
      const content = (item.content || '').toLowerCase();
      return code.includes(q) || phone.includes(q) || name.includes(q) || content.includes(q);
    });
  }, [allOpinions, searchQuery]);

  // Handle submit rating & feedback
  const handleRatingSubmit = () => {
    if (!selectedOpinion || !satisfactionRating) return;
    setIsSubmittingFeedback(true);

    try {
      const updatedOpinions = allOpinions.map(op => {
        if (op.id === selectedOpinion.id) {
          return {
            ...op,
            citizenSatisfaction: satisfactionRating,
            citizenFeedback: citizenFeedbackText.trim(),
            satisfactionSubmittedAt: new Date().toISOString()
          };
        }
        return op;
      });

      AppStorageEngine.setItem(STORAGE_KEYS.OPINIONS, updatedOpinions, 'Cập nhật đánh giá mức độ hài lòng');
      setSelectedOpinion(prev => prev ? {
        ...prev,
        citizenSatisfaction: satisfactionRating,
        citizenFeedback: citizenFeedbackText.trim(),
        satisfactionSubmittedAt: new Date().toISOString()
      } : null);

      setFeedbackSubmitted(true);
      setTimeout(() => setFeedbackSubmitted(false), 3000);
    } catch (err) {
      console.error('Error saving satisfaction:', err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const getStatusBadge = (status: OpinionStatus) => {
    switch (status) {
      case 'RESOLVED':
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Đã xử lý &amp; Trả lời
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-full border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            Đang thẩm tra &amp; Xử lý
          </span>
        );
      case 'FORWARDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 font-bold text-xs rounded-full border border-amber-200">
            <Building2 className="w-3.5 h-3.5 text-amber-600" />
            Đã chuyển cơ quan chuyên môn
          </span>
        );
      case 'NEW':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 font-bold text-xs rounded-full border border-purple-200">
            <Clock className="w-3.5 h-3.5 text-purple-600" />
            Đã tiếp nhận hồ sơ
          </span>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Search className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">TRA CỨU TIẾN ĐỘ DÂN NGUYỆN &amp; Ý KIẾN</h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-200 text-[10px] font-black border border-cyan-300/30">
                  REALTIME
                </span>
              </div>
              <p className="text-xs text-blue-100">Theo dõi quy trình tiếp nhận, xử lý phản ánh của Mặt trận Tổ quốc Phường Chánh Hiệp</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Search Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-blue-600" />
              Nhập Mã hồ sơ (VD: DN-2026-CH01) hoặc Số điện thoại người gửi:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Nhập mã biên nhận hoặc số điện thoại..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedOpinion(null); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Suggestions / Recent Submissions */}
            {!searchQuery && allOpinions.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Hồ sơ gần đây để tra cứu nhanh:</p>
                <div className="flex flex-wrap gap-2">
                  {allOpinions.slice(0, 4).map(op => (
                    <button
                      key={op.id}
                      onClick={() => {
                        setSearchQuery(op.receiptCode || op.id);
                        setSelectedOpinion(op);
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3 h-3 text-blue-500" />
                      <span>{op.receiptCode || `Hồ sơ #${op.id.slice(0, 6)}`}</span>
                      <span className="text-[10px] text-slate-400">({op.neighborhood})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Results List if multiple */}
          {searchQuery && !selectedOpinion && searchResults.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-700">Tìm thấy {searchResults.length} hồ sơ phù hợp:</p>
              <div className="space-y-2">
                {searchResults.map(item => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedOpinion(item)}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                          {item.receiptCode || item.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">{item.neighborhood}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.content}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      {getStatusBadge(item.status)}
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {searchQuery && searchResults.length === 0 && (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Không tìm thấy hồ sơ dân nguyện nào với từ khóa "{searchQuery}"</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Vui lòng kiểm tra lại Mã biên nhận được cấp khi gửi hoặc Số điện thoại đã khai báo.</p>
              {onOpenNewOpinionForm && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenNewOpinionForm();
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Gửi phản ánh dân nguyện mới
                </button>
              )}
            </div>
          )}

          {/* Selected Opinion Details & Live Timeline Tracking */}
          {selectedOpinion && (
            <div className="space-y-6">
              
              {/* Back to search if there were multiple */}
              {searchResults.length > 1 && (
                <button
                  onClick={() => setSelectedOpinion(null)}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  ← Quay lại danh sách kết quả ({searchResults.length})
                </button>
              )}

              {/* Header Box of Selected Dossier */}
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-5 rounded-2xl border border-blue-900 shadow-md space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-cyan-300 font-bold">MÃ HỒ SƠ:</span>
                    <span className="font-mono text-sm sm:text-base font-black text-white bg-blue-800/80 px-2.5 py-0.5 rounded-lg border border-cyan-400/40">
                      {selectedOpinion.receiptCode || selectedOpinion.id.slice(0, 8).toUpperCase()}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedOpinion.receiptCode || selectedOpinion.id);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-cyan-200 transition-colors cursor-pointer text-xs"
                      title="Sao chép mã"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div>
                    {getStatusBadge(selectedOpinion.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-blue-800/60 text-xs">
                  <div>
                    <span className="text-slate-400">Lĩnh vực:</span>
                    <p className="font-bold text-cyan-200">{selectedOpinion.topic}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Địa bàn:</span>
                    <p className="font-bold text-white">{selectedOpinion.neighborhood}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Ngày tiếp nhận:</span>
                    <p className="font-bold text-white">{new Date(selectedOpinion.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                </div>
              </div>

              {/* Content of the Citizen's Opinion */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-600 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Nội dung phản ánh / kiến nghị của công dân:
                </h4>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium bg-white p-3.5 rounded-xl border border-slate-200">
                  {selectedOpinion.content}
                </p>
                {selectedOpinion.fullname && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Người gửi: <strong>{selectedOpinion.fullname}</strong> {selectedOpinion.phone ? `(${selectedOpinion.phone.slice(0, 4)}***${selectedOpinion.phone.slice(-3)})` : ''}</span>
                  </div>
                )}
              </div>

              {/* 4-Step Visual Timeline Progress */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Tiến độ xử lý thời gian thực (4 Bước):
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  
                  {/* Step 1: Tiếp nhận */}
                  <div className="relative">
                    <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black ring-4 ring-white shadow-xs">
                      ✓
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-black text-slate-900">Bước 1: Ban Thường trực MTTQ tiếp nhận hồ sơ</h5>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(selectedOpinion.createdAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Hồ sơ đã được số hóa, cấp mã định danh <strong>{selectedOpinion.receiptCode || selectedOpinion.id.slice(0, 8)}</strong> và chuyển vào hệ thống quản lý dân nguyện.
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Phân công & Thẩm tra */}
                  <div className="relative">
                    <div className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ring-4 ring-white shadow-xs ${
                      selectedOpinion.status !== 'NEW' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white animate-pulse'
                    }`}>
                      {selectedOpinion.status !== 'NEW' ? '✓' : '2'}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-black text-slate-900">
                          Bước 2: Chuyển Ban Công tác Mặt trận {selectedOpinion.neighborhood} &amp; UBND thẩm tra
                        </h5>
                        {selectedOpinion.status !== 'NEW' && (
                          <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-bold">Đã phân công</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">
                        Cán bộ phụ trách địa bàn tiến hành xác minh thực tế, phối hợp tổ trưởng dân phố và cơ quan chuyên môn để khảo sát hiện trường.
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Xử lý & Giải quyết */}
                  <div className="relative">
                    <div className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ring-4 ring-white shadow-xs ${
                      selectedOpinion.status === 'RESOLVED' || selectedOpinion.status === 'CLOSED'
                        ? 'bg-emerald-500 text-white'
                        : selectedOpinion.status === 'PROCESSING' || selectedOpinion.status === 'FORWARDED'
                          ? 'bg-amber-500 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-500'
                    }`}>
                      {selectedOpinion.status === 'RESOLVED' || selectedOpinion.status === 'CLOSED' ? '✓' : '3'}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-black text-slate-900">Bước 3: Lập phương án &amp; Tổ chức xử lý hiện trường</h5>
                      </div>
                      <p className="text-xs text-slate-600">
                        {selectedOpinion.status === 'RESOLVED' || selectedOpinion.status === 'CLOSED'
                          ? 'Đã hoàn thành các biện pháp khắc phục, kiểm tra nghiệm thu hiện trường.'
                          : 'Đang triển khai các biện pháp giải quyết, nhắc nhở hoặc lập biên bản xử lý theo thẩm quyền.'}
                      </p>
                    </div>
                  </div>

                  {/* Step 4: Trả lời công dân */}
                  <div className="relative">
                    <div className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ring-4 ring-white shadow-xs ${
                      selectedOpinion.status === 'RESOLVED' || selectedOpinion.status === 'CLOSED'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {selectedOpinion.status === 'RESOLVED' || selectedOpinion.status === 'CLOSED' ? '✓' : '4'}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-black text-slate-900">Bước 4: Thông báo kết quả chính thức &amp; Tiếp nhận đánh giá</h5>
                      </div>
                      <p className="text-xs text-slate-600">
                        Ban Thường trực MTTQ Phường ban hành văn bản/thông báo trả lời chính thức đến công dân và công khai kết quả xử lý.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Official Response Box if available */}
              {selectedOpinion.adminResponse && (
                <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Ý kiến phản hồi chính thức từ Ban Thường trực MTTQ Phường:</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                      ĐÃ PHÊ DUYỆT
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-emerald-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-serif">
                    {selectedOpinion.adminResponse}
                  </div>
                </div>
              )}

              {/* Citizen Satisfaction Feedback Survey (Interactive) */}
              <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 p-5 rounded-2xl border border-indigo-100 space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Đánh giá mức độ hài lòng của công dân đối với kết quả xử lý:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => setSatisfactionRating('VERY_SATISFIED')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      satisfactionRating === 'VERY_SATISFIED' || selectedOpinion.citizenSatisfaction === 'VERY_SATISFIED'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <span>🌟 Rất hài lòng</span>
                  </button>

                  <button
                    onClick={() => setSatisfactionRating('SATISFIED')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      satisfactionRating === 'SATISFIED' || selectedOpinion.citizenSatisfaction === 'SATISFIED'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <span>👍 Hài lòng</span>
                  </button>

                  <button
                    onClick={() => setSatisfactionRating('NEEDS_IMPROVEMENT')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      satisfactionRating === 'NEEDS_IMPROVEMENT' || selectedOpinion.citizenSatisfaction === 'NEEDS_IMPROVEMENT'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300'
                    }`}
                  >
                    <span>⚠️ Chưa hài lòng / Cần xử lý lại</span>
                  </button>
                </div>

                {satisfactionRating && !selectedOpinion.citizenSatisfaction && (
                  <div className="space-y-2 pt-2 animate-fadeIn">
                    <input
                      type="text"
                      placeholder="Ý kiến góp ý thêm của ông/bà (tùy chọn)..."
                      value={citizenFeedbackText}
                      onChange={(e) => setCitizenFeedbackText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleRatingSubmit}
                        disabled={isSubmittingFeedback}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {isSubmittingFeedback ? 'Đang gửi...' : 'Gửi đánh giá phục vụ'}
                      </button>
                    </div>
                  </div>
                )}

                {feedbackSubmitted && (
                  <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold text-center animate-fadeIn">
                    ✓ Cảm ơn ông/bà đã gửi đánh giá! Ý kiến của ông/bà giúp nâng cao chất lượng phục vụ của MTTQ Phường Chánh Hiệp.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Hệ thống Mặt trận số Chánh Hiệp – Bảo mật thông tin dân nguyện</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-300 transition cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>

      </div>
    </div>
  );
};
