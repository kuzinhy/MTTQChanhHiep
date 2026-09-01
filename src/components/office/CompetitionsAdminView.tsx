import React, { useState } from 'react';
import { Competition, CompetitionSubmission } from '../../types';
import { 
  Award, 
  Users, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  MessageSquare,
  Edit3,
  Trash2,
  X,
  Check,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CompetitionsAdminViewProps {
  competitions: Competition[];
  submissions: CompetitionSubmission[];
  onAddCompetition?: (comp: Competition) => void;
  onUpdateCompetition?: (comp: Competition) => void;
  onDeleteCompetition?: (id: string) => void;
  onGradeSubmission?: (id: string, score: number, comment: string) => void;
}

export const CompetitionsAdminView: React.FC<CompetitionsAdminViewProps> = ({
  competitions,
  submissions,
  onAddCompetition,
  onUpdateCompetition,
  onDeleteCompetition,
  onGradeSubmission
}) => {
  const [activeTab, setActiveTab] = useState<'SUBMISSIONS' | 'LIST'>('SUBMISSIONS');
  
  // Grading Modal State
  const [selectedSub, setSelectedSub] = useState<CompetitionSubmission | null>(null);
  const [scoreInput, setScoreInput] = useState<number>(85);
  const [commentInput, setCommentInput] = useState('Bài viết sâu sắc, nêu bật vai trò công tác Mặt trận khu phố.');

  // Competition CRUD Modal State
  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [editingComp, setEditingComp] = useState<Competition | null>(null);
  const [compToDelete, setCompToDelete] = useState<Competition | null>(null);

  // Form fields
  const [compTitle, setCompTitle] = useState('');
  const [compType, setCompType] = useState<'TRIVIA' | 'WRITING'>('TRIVIA');
  const [compDesc, setCompDesc] = useState('');
  const [compRules, setCompRules] = useState('Dự thi trực tuyến cá nhân, trả lời đầy đủ các câu hỏi theo quy định.');
  const [compStartDate, setCompStartDate] = useState(new Date().toISOString().substring(0, 10));
  const [compEndDate, setCompEndDate] = useState('31/12/2026');
  const [compStatus, setCompStatus] = useState<'ONGOING' | 'UPCOMING' | 'ENDED'>('ONGOING');
  const [compTotalQuestions, setCompTotalQuestions] = useState(10);

  const resetForm = () => {
    setEditingComp(null);
    setCompTitle('');
    setCompType('TRIVIA');
    setCompDesc('');
    setCompRules('Dự thi trực tuyến cá nhân, trả lời đầy đủ các câu hỏi theo quy định.');
    setCompStartDate(new Date().toISOString().substring(0, 10));
    setCompEndDate('31/12/2026');
    setCompStatus('ONGOING');
    setCompTotalQuestions(10);
  };

  const handleOpenEdit = (comp: Competition) => {
    setEditingComp(comp);
    setCompTitle(comp.title);
    setCompType(comp.type);
    setCompDesc(comp.description || '');
    setCompRules(comp.rules || '');
    setCompStartDate(comp.startDate || new Date().toISOString().substring(0, 10));
    setCompEndDate(comp.endDate || '31/12/2026');
    setCompStatus(comp.status);
    setCompTotalQuestions(comp.totalQuestions || 10);
    setIsCompModalOpen(true);
  };

  const handleSaveCompetition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compTitle.trim()) return;

    if (editingComp) {
      const updated: Competition = {
        ...editingComp,
        title: compTitle.trim(),
        type: compType,
        description: compDesc.trim(),
        rules: compRules.trim(),
        startDate: compStartDate,
        endDate: compEndDate,
        status: compStatus,
        totalQuestions: compTotalQuestions
      };
      if (onUpdateCompetition) onUpdateCompetition(updated);
    } else {
      const newComp: Competition = {
        id: 'comp-' + Date.now(),
        title: compTitle.trim(),
        type: compType,
        description: compDesc.trim() || 'Hội thi trực tuyến chào mừng kỷ niệm thành lập Mặt trận.',
        rules: compRules.trim(),
        startDate: compStartDate,
        endDate: compEndDate,
        status: compStatus,
        totalQuestions: compTotalQuestions
      };
      if (onAddCompetition) onAddCompetition(newComp);
    }

    setIsCompModalOpen(false);
    resetForm();
  };

  const handleConfirmDelete = () => {
    if (!compToDelete) return;
    if (onDeleteCompetition) onDeleteCompetition(compToDelete.id);
    setCompToDelete(null);
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    if (onGradeSubmission) {
      onGradeSubmission(selectedSub.id, scoreInput, commentInput);
    }
    setSelectedSub(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-900 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4 text-blue-600" />
            <span>QUẢN TRỊ HỘI THI &amp; BÀI DỰ THI DÂN VẬN</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1">Quản Lý Hội Thi &amp; Chấm Điểm Trực Tuyến</h1>
          <p className="text-xs text-slate-500 mt-0.5">Tổng hợp kết quả cuộc thi Trắc nghiệm &amp; Bài viết cảm nhận của nhân dân 12 khu phố</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('SUBMISSIONS')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'SUBMISSIONS' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bài dự thi ({submissions.length})
            </button>
            <button
              onClick={() => setActiveTab('LIST')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'LIST' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Danh sách Cuộc thi ({competitions.length})
            </button>
          </div>

          <button
            onClick={() => { resetForm(); setIsCompModalOpen(true); }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Cuộc Thi Mới</span>
          </button>
        </div>
      </div>

      {/* Content Tabs */}
      {activeTab === 'SUBMISSIONS' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700 flex justify-between items-center">
              <span className="font-black text-slate-800 uppercase text-[11px] tracking-wider">
                DANH SÁCH BÀI DỰ THI CỦA CÁN BỘ &amp; BÀ CON NHÂN DÂN
              </span>
              <span className="text-blue-700 font-semibold text-[11px]">Đánh giá theo thang điểm 100 &amp; Nhận xét của Ban Giám khảo</span>
            </div>

            {submissions.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Award className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-sm text-slate-700">Chưa có bài nộp nào từ cổng người dân</p>
                <p className="text-xs text-slate-400 mt-1">Khi bà con làm bài thi trực tuyến, kết quả sẽ tự động đồng bộ về đây.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {submissions.map((sub) => (
                  <div key={sub.id} className="p-5 hover:bg-slate-50/90 transition-colors flex flex-col md:flex-row justify-between gap-4 items-start">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">{sub.participantName}</span>
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 font-bold text-[10px] rounded-md border border-blue-200">
                          {sub.neighborhood}
                        </span>
                        <span className="text-xs text-slate-400">• SĐT: {sub.phone}</span>
                      </div>

                      {sub.essayText && (
                        <p className="text-xs text-slate-700 line-clamp-2 italic bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          "{sub.essayText}"
                        </p>
                      )}

                      {sub.adminComment && (
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                          <strong>Nhận xét BGK:</strong> {sub.adminComment}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                        <span>Nộp lúc: {sub.submittedAt}</span>
                        {sub.score !== undefined && (
                          <span className="font-black text-emerald-700">Điểm số: {sub.score}/100</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedSub(sub);
                        if (sub.score !== undefined) setScoreInput(sub.score);
                        if (sub.adminComment) setCommentInput(sub.adminComment);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer"
                    >
                      {sub.score !== undefined ? 'Sửa Điểm & Nhận Xét' : 'Chấm Điểm Bài Thi'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'LIST' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {competitions.map((comp) => (
            <div key={comp.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 font-black text-[10px] rounded-full uppercase ${
                    comp.status === 'ONGOING' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {comp.status === 'ONGOING' ? 'Đang diễn ra' : comp.status === 'UPCOMING' ? 'Sắp diễn ra' : 'Đã kết thúc'}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{comp.startDate} - {comp.endDate}</span>
                </div>

                <h3 className="font-black text-base text-slate-900">{comp.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{comp.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-blue-700">
                  {comp.type === 'TRIVIA' ? 'Trắc nghiệm trực tuyến' : 'Bài viết cảm nhận'}
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(comp)}
                    className="p-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-xl transition-all cursor-pointer"
                    title="Chỉnh sửa cuộc thi"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCompToDelete(comp)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 rounded-xl transition-all cursor-pointer"
                    title="Xóa cuộc thi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Grade */}
      <AnimatePresence>
        {selectedSub && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-slate-900"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                <h3 className="font-black text-base text-slate-900">
                  Chấm điểm Bài dự thi - {selectedSub.participantName}
                </h3>
                <button onClick={() => setSelectedSub(null)} className="text-slate-400 font-bold hover:text-slate-700 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleGradeSubmit} className="space-y-3.5 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                  <p className="font-black text-slate-900">Thí sinh: {selectedSub.participantName} ({selectedSub.neighborhood})</p>
                  <p className="text-slate-700 italic leading-relaxed">"{selectedSub.essayText}"</p>
                </div>

                <div>
                  <label className="block font-black text-slate-800 mb-1">Điểm số (0 - 100) (*)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={scoreInput}
                    onChange={(e) => setScoreInput(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-black text-lg text-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-800 mb-1">Nhận xét của Ban Giám khảo (*)</label>
                  <textarea
                    rows={3}
                    required
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedSub(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-md cursor-pointer"
                  >
                    Lưu Kết Quả Chấm
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Add / Edit Competition */}
      <AnimatePresence>
        {isCompModalOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-slate-900 max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                <h3 className="font-black text-base text-slate-900">
                  {editingComp ? 'Chỉnh sửa cuộc thi' : 'Khởi tạo cuộc thi trực tuyến mới'}
                </h3>
                <button onClick={() => setIsCompModalOpen(false)} className="text-slate-400 font-bold hover:text-slate-700 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCompetition} className="space-y-3 text-xs">
                <div>
                  <label className="block font-black text-slate-800 mb-1">Tên cuộc thi (*)</label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập tên hội thi, cuộc khảo sát..."
                    value={compTitle}
                    onChange={(e) => setCompTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-bold outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-black text-slate-800 mb-1">Hình thức</label>
                    <select
                      value={compType}
                      onChange={(e) => setCompType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-bold bg-white cursor-pointer"
                    >
                      <option value="TRIVIA">Trắc nghiệm trực tuyến</option>
                      <option value="WRITING">Bài viết cảm nhận</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-black text-slate-800 mb-1">Trạng thái</label>
                    <select
                      value={compStatus}
                      onChange={(e) => setCompStatus(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-bold bg-white cursor-pointer"
                    >
                      <option value="ONGOING">Đang diễn ra</option>
                      <option value="UPCOMING">Sắp diễn ra</option>
                      <option value="ENDED">Đã kết thúc</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-black text-slate-800 mb-1">Mô tả tóm tắt</label>
                  <textarea
                    rows={2}
                    value={compDesc}
                    onChange={(e) => setCompDesc(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-800 mb-1">Thể lệ cuộc thi</label>
                  <textarea
                    rows={3}
                    value={compRules}
                    onChange={(e) => setCompRules(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl font-medium"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCompModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-md cursor-pointer"
                  >
                    Lưu Cuộc Thi
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {compToDelete && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-slate-900"
            >
              <div className="flex items-center gap-3 text-rose-600">
                <div className="p-3 bg-rose-100 rounded-2xl">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Xóa cuộc thi</h3>
                  <p className="text-xs text-slate-500">Bạn có chắc chắn muốn xóa cuộc thi này?</p>
                </div>
              </div>

              <p className="text-xs font-bold text-slate-800 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                {compToDelete.title}
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setCompToDelete(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Xác nhận xóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
