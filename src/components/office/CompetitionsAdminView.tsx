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
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Settings,
  HelpCircle,
  Globe,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CompetitionsAdminViewProps {
  competitions: Competition[];
  submissions: CompetitionSubmission[];
  onAddCompetition?: (comp: Competition) => void;
  onUpdateCompetition?: (comp: Competition) => void;
  onDeleteCompetition?: (id: string) => void;
  onGradeSubmission?: (id: string, score: number, comment: string) => void;
  onSelectCompetitionDetail: (id: string) => void;
  onRestoreDefaultBanners?: () => void;
}

export const CompetitionsAdminView: React.FC<CompetitionsAdminViewProps> = ({
  competitions,
  submissions,
  onAddCompetition,
  onUpdateCompetition,
  onDeleteCompetition,
  onGradeSubmission,
  onSelectCompetitionDetail,
  onRestoreDefaultBanners
}) => {
  const [activeTab, setActiveTab] = useState<'LIST' | 'SUBMISSIONS'>('LIST');
  
  // 6-Step Creation Wizard State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // Wizard Form Fields
  const [wTitle, setWTitle] = useState('');
  const [wType, setWType] = useState<'TRIVIA' | 'WRITING' | 'MIXED'>('TRIVIA');
  const [wDesc, setWDesc] = useState('');
  const [wBanner, setWBanner] = useState('https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1200');
  const [wStartDate, setWStartDate] = useState(new Date().toISOString().substring(0, 10));
  const [wEndDate, setWEndDate] = useState('2026-12-31');
  const [wRules, setWRules] = useState('1. Đối tượng tham gia: Toàn thể cán bộ, công chức, đoàn viên hội viên và nhân dân trên địa bàn phường Chánh Hiệp.\n2. Nội dung: Tìm hiểu kiến thức lịch sử, nghị quyết và các phong trào thi đua yêu nước.');
  const [wAccessMode, setWAccessMode] = useState<'PUBLIC' | 'LOGIN_REQUIRED' | 'ACCESS_CODE'>('PUBLIC');
  const [wTimeLimit, setWTimeLimit] = useState(15);
  const [wTotalQuestions, setWTotalQuestions] = useState(10);
  const [wStatus, setWStatus] = useState<'DRAFT' | 'SCHEDULED' | 'OPEN' | 'PUBLISHED'>('OPEN');

  // Grading modal state
  const [selectedSub, setSelectedSub] = useState<CompetitionSubmission | null>(null);
  const [scoreInput, setScoreInput] = useState<number>(85);
  const [commentInput, setCommentInput] = useState('Bài viết sâu sắc, nêu bật vai trò công tác Mặt trận khu phố.');

  // Delete confirmation
  const [compToDelete, setCompToDelete] = useState<Competition | null>(null);

  const handleResetWizard = () => {
    setWizardStep(1);
    setWTitle('');
    setWType('TRIVIA');
    setWDesc('');
    setWStartDate(new Date().toISOString().substring(0, 10));
    setWEndDate('2026-12-31');
    setWRules('1. Đối tượng tham gia: Toàn thể cán bộ, nhân dân phường Chánh Hiệp.');
    setWAccessMode('PUBLIC');
    setWTimeLimit(15);
    setWTotalQuestions(10);
    setWStatus('OPEN');
  };

  const handleFinishWizard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wTitle.trim()) return;

    const newComp: Competition = {
      id: 'comp-' + Date.now(),
      title: wTitle.trim(),
      type: wType,
      description: wDesc.trim() || 'Hội thi trực tuyến tìm hiểu kiến thức pháp luật và phong trào MTTQ phường Chánh Hiệp.',
      bannerUrl: wBanner,
      startDate: wStartDate,
      endDate: wEndDate,
      status: wStatus as any,
      rules: wRules,
      timeLimitMinutes: wTimeLimit,
      totalQuestions: wTotalQuestions
    };

    if (onAddCompetition) onAddCompetition(newComp);
    setIsWizardOpen(false);
    handleResetWizard();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto text-slate-900 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4 text-blue-600" />
            <span>QUẢN TRỊ HỘI THI &amp; KHẢO SÁT CHUYÊN NGHIỆP</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1">Hệ Thống Quản Lý Hội Thi (Competition Management System)</h1>
          <p className="text-xs text-slate-500 mt-0.5">Quản trị toàn diện đề thi, ngân hàng câu hỏi, chấm điểm tự động và xếp hạng trực tuyến</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('LIST')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'LIST' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Danh sách Cuộc thi ({competitions.length})
            </button>
            <button
              onClick={() => setActiveTab('SUBMISSIONS')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'SUBMISSIONS' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả Bài dự thi ({submissions.length})
            </button>
          </div>

          {onRestoreDefaultBanners && (
            <button
              onClick={onRestoreDefaultBanners}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-98 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
              type="button"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Khôi phục 4 Banner Mặc định</span>
            </button>
          )}

          <button
            onClick={() => { handleResetWizard(); setIsWizardOpen(true); }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Cuộc Thi Mới</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'LIST' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitions.map((comp) => (
            <div key={comp.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="relative h-48 w-full bg-slate-900">
                  <img
                    src={comp.bannerUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'}
                    alt={comp.title}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md text-white shadow-xs ${
                      comp.status === 'OPEN' || comp.status === 'ONGOING' ? 'bg-emerald-600' :
                      comp.status === 'DRAFT' ? 'bg-amber-600' : 'bg-slate-700'
                    }`}>
                      {comp.status === 'OPEN' || comp.status === 'ONGOING' ? 'Đang diễn ra' :
                       comp.status === 'DRAFT' ? 'Bản nháp' : 'Đã kết thúc'}
                    </span>
                    <span className="bg-slate-900/95 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-700">
                      {comp.type === 'TRIVIA' ? 'Trắc nghiệm' : comp.type === 'WRITING' ? 'Bài viết' : 'Hỗn hợp'}
                    </span>
                  </div>

                  <span className="absolute bottom-3 right-3 bg-blue-900/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                    {comp.totalQuestions || 10} câu hỏi &bull; {comp.timeLimitMinutes || 15} phút
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-black text-slate-900 text-base leading-snug">{comp.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{comp.description}</p>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-medium border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      Thời gian: {comp.startDate} &rarr; {comp.endDate}
                    </span>
                    <span className="font-bold text-slate-800">
                      {submissions.filter(s => s.competitionId === comp.id).length} lượt thi
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Quản lý hội thi */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectCompetitionDetail(comp.id)}
                  className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  <span>Quản lý hội thi</span>
                </button>
                <a
                  href={`#/hoi-thi/${comp.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>Xem trang</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'SUBMISSIONS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-900 text-base">Toàn Bộ Bài Dự Thi Trực Tuyến</h3>
            <p className="text-xs text-slate-500">Danh sách các bài làm và chấm điểm của tất cả các cuộc thi</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-700">
                  <th className="p-3">Thí sinh</th>
                  <th className="p-3">Khu phố</th>
                  <th className="p-3">Số điện thoại</th>
                  <th className="p-3">Thời gian nộp</th>
                  <th className="p-3 text-center">Điểm số</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">Chưa có bài thi nào được nộp.</td>
                  </tr>
                ) : (
                  submissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="p-3 font-black text-slate-900">{sub.participantName}</td>
                      <td className="p-3 text-slate-600">{sub.neighborhood}</td>
                      <td className="p-3 font-mono text-slate-600">{sub.phone}</td>
                      <td className="p-3 font-mono text-slate-500">{sub.submittedAt}</td>
                      <td className="p-3 text-center font-black text-blue-700">{sub.score || 0} đ</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedSub(sub);
                            setScoreInput(sub.score || 85);
                            setCommentInput(sub.adminComment || 'Bài làm đạt yêu cầu.');
                          }}
                          className="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200 hover:bg-blue-100 cursor-pointer"
                        >
                          Chấm điểm
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6-Step Creation Wizard Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Wizard Header & Stepper */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Trình tạo cuộc thi chuyên nghiệp</span>
                <h3 className="text-lg font-black text-slate-900">Tạo Cuộc Thi Mới (Bước {wizardStep} / 6)</h3>
              </div>
              <button 
                onClick={() => setIsWizardOpen(false)}
                className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper indicator */}
            <div className="grid grid-cols-6 gap-1.5">
              {[
                { step: 1, label: 'Thông tin' },
                { step: 2, label: 'Thể lệ' },
                { step: 3, label: 'Đối tượng' },
                { step: 4, label: 'Ngân hàng' },
                { step: 5, label: 'Cấu hình đề' },
                { step: 6, label: 'Xuất bản' }
              ].map(s => (
                <div key={s.step} className={`p-2 rounded-xl text-center text-[10px] font-black ${
                  wizardStep === s.step ? 'bg-blue-600 text-white' :
                  wizardStep > s.step ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {s.step}. {s.label}
                </div>
              ))}
            </div>

            <form onSubmit={handleFinishWizard} className="space-y-6 pt-2">
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <h4 className="font-black text-slate-800 text-sm">1. Thông tin chung cuộc thi</h4>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 uppercase">Tên cuộc thi</label>
                    <input
                      type="text"
                      value={wTitle}
                      onChange={(e) => setWTitle(e.target.value)}
                      placeholder="VD: Hội thi tìm hiểu Lịch sử MTTQ Việt Nam năm 2026..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-700 uppercase">Hình thức</label>
                      <select
                        value={wType}
                        onChange={(e) => setWType(e.target.value as any)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                      >
                        <option value="TRIVIA">Trắc nghiệm trực tuyến</option>
                        <option value="WRITING">Cuộc thi viết cảm nhận</option>
                        <option value="MIXED">Trắc nghiệm + Bài viết</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-700 uppercase">Trạng thái ban đầu</label>
                      <select
                        value={wStatus}
                        onChange={(e) => setWStatus(e.target.value as any)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                      >
                        <option value="DRAFT">Bản nháp (DRAFT)</option>
                        <option value="SCHEDULED">Sắp diễn ra (SCHEDULED)</option>
                        <option value="OPEN">Đang mở (OPEN)</option>
                        <option value="PUBLISHED">Công bố (PUBLISHED)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-700 uppercase">Ngày bắt đầu</label>
                      <input
                        type="date"
                        value={wStartDate}
                        onChange={(e) => setWStartDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-700 uppercase">Ngày kết thúc</label>
                      <input
                        type="date"
                        value={wEndDate}
                        onChange={(e) => setWEndDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 uppercase">Mô tả chi tiết</label>
                    <textarea
                      rows={3}
                      value={wDesc}
                      onChange={(e) => setWDesc(e.target.value)}
                      placeholder="Nhập giới thiệu ngắn gọn..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900"
                    />
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <h4 className="font-black text-slate-800 text-sm">2. Thể lệ & Quy chế cuộc thi</h4>
                  <textarea
                    rows={8}
                    value={wRules}
                    onChange={(e) => setWRules(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                  />
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4">
                  <h4 className="font-black text-slate-800 text-sm">3. Đối tượng & Điều kiện dự thi</h4>
                  <div className="space-y-3">
                    <label className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3 cursor-pointer">
                      <input type="radio" name="wAccess" defaultChecked className="mt-1" />
                      <div>
                        <span className="font-black text-slate-900 text-sm block">Công khai cho toàn thể nhân dân (Public)</span>
                        <span className="text-xs text-slate-600">Không yêu cầu đăng nhập tài khoản hệ thống nội bộ.</span>
                      </div>
                    </label>
                    <label className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3 cursor-pointer">
                      <input type="radio" name="wAccess" className="mt-1" />
                      <div>
                        <span className="font-black text-slate-900 text-sm block">Chỉ dành cho cán bộ & đoàn viên</span>
                        <span className="text-xs text-slate-600">Yêu cầu đăng nhập tài khoản cán bộ phường / khu phố.</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-4">
                  <h4 className="font-black text-slate-800 text-sm">4. Ngân hàng câu hỏi khởi tạo</h4>
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-1">
                    <p className="font-black">Hệ thống sẽ tự động khởi tạo 10 câu hỏi mẫu chuẩn về Mặt trận Tổ quốc và địa bàn phường Chánh Hiệp.</p>
                    <p>Bạn có thể tiếp tục thêm, sửa hoặc import Excel ngay sau khi tạo cuộc thi.</p>
                  </div>
                </div>
              )}

              {wizardStep === 5 && (
                <div className="space-y-4">
                  <h4 className="font-black text-slate-800 text-sm">5. Cấu hình thời gian & đề thi</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Thời gian làm bài (Phút)</label>
                      <input
                        type="number"
                        value={wTimeLimit}
                        onChange={(e) => setWTimeLimit(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border rounded-xl text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Số câu hỏi mỗi đề</label>
                      <input
                        type="number"
                        value={wTotalQuestions}
                        onChange={(e) => setWTotalQuestions(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border rounded-xl text-sm font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 6 && (
                <div className="space-y-4 text-center py-6">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900">Sẵn sàng xuất bản cuộc thi!</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Cuộc thi "{wTitle}" sẽ được tạo mới và tự động sinh trang public độc lập tại `/hoi-thi/...`.
                  </p>
                </div>
              )}

              {/* Wizard navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                {wizardStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep(wizardStep - 1)}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Quay lại</span>
                  </button>
                ) : <div></div>}

                {wizardStep < 6 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep(wizardStep + 1)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Tiếp theo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Hoàn tất & Tạo Cuộc Thi</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
