import React, { useState } from 'react';
import { Competition, CompetitionQuestion, CompetitionSubmission } from '../../types';
import { 
  ArrowLeft, 
  Award, 
  FileText, 
  HelpCircle, 
  Settings, 
  Users, 
  CheckSquare, 
  BarChart3, 
  Award as AwardIcon, 
  Share2, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Copy, 
  QrCode, 
  Check, 
  Eye, 
  Save, 
  Send, 
  Clock, 
  AlertCircle, 
  Download, 
  Upload, 
  Sparkles,
  Lock,
  Globe,
  Star
} from 'lucide-react';

interface CompetitionAdminDetailViewProps {
  competition: Competition;
  onBack: () => void;
  onUpdateCompetition: (comp: Competition) => void;
  submissions: CompetitionSubmission[];
  onGradeSubmission?: (subId: string, score: number, comment: string) => void;
}

export const CompetitionAdminDetailView: React.FC<CompetitionAdminDetailViewProps> = ({
  competition,
  onBack,
  onUpdateCompetition,
  submissions,
  onGradeSubmission
}) => {
  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'RULES' | 'QUESTIONS' | 'CONFIG' | 'PARTICIPANTS' | 'SUBMISSIONS' | 'GRADING' | 'RANKING' | 'ANALYTICS' | 'CERTIFICATES' | 'SHARE'
  >('OVERVIEW');

  // Local editable state for competition
  const [compData, setCompData] = useState<Competition>(competition);
  const [saveNotice, setSaveNotice] = useState(false);

  // Question bank state (mocked or from competition)
  const [questions, setQuestions] = useState<CompetitionQuestion[]>(competition.questions || [
    {
      id: 'q-1',
      competitionId: competition.id,
      questionText: 'Ngày truyền thống Mặt trận Tổ quốc Việt Nam là ngày tháng năm nào?',
      questionType: 'SINGLE_CHOICE',
      category: 'Lịch sử Mặt trận',
      difficulty: 'EASY',
      score: 10,
      options: [
        { id: 'opt-1', text: '18/11/1930', isCorrect: true },
        { id: 'opt-2', text: '02/09/1945', isCorrect: false },
        { id: 'opt-3', text: '19/05/1890', isCorrect: false },
        { id: 'opt-4', text: '03/02/1930', isCorrect: false }
      ],
      explanation: 'Ngày 18/11 hằng năm là Ngày truyền thống MTTQ Việt Nam và Ngày hội Đại đoàn kết toàn dân tộc.',
      status: 'ACTIVE'
    },
    {
      id: 'q-2',
      competitionId: competition.id,
      questionText: 'Cuộc vận động "Toàn dân đoàn kết xây dựng nông thôn mới, đô thị văn minh" có bao nhiêu nội dung trọng tâm?',
      questionType: 'SINGLE_CHOICE',
      category: 'Phong trào thi đua',
      difficulty: 'MEDIUM',
      score: 10,
      options: [
        { id: 'opt-21', text: '3 nội dung', isCorrect: false },
        { id: 'opt-22', text: '5 nội dung', isCorrect: true },
        { id: 'opt-23', text: '4 nội dung', isCorrect: false },
        { id: 'opt-24', text: '6 nội dung', isCorrect: false }
      ],
      explanation: 'Cuộc vận động gồm 5 nội dung cốt lõi xây dựng khu dân cư văn hóa, nông thôn mới và đô thị văn minh.',
      status: 'ACTIVE'
    }
  ]);

  // New question modal state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<CompetitionQuestion | null>(null);
  const [qText, setQText] = useState('');
  const [qType, setQType] = useState<'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'ESSAY'>('SINGLE_CHOICE');
  const [qCategory, setQCategory] = useState('Kiến thức chung');
  const [qDifficulty, setQDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [qScore, setQScore] = useState(10);
  const [qExplanation, setQExplanation] = useState('');
  const [qOptions, setQOptions] = useState([
    { id: 'o1', text: '', isCorrect: true },
    { id: 'o2', text: '', isCorrect: false },
    { id: 'o3', text: '', isCorrect: false },
    { id: 'o4', text: '', isCorrect: false }
  ]);

  // Grading modal state
  const [gradingSub, setGradingSub] = useState<CompetitionSubmission | null>(null);
  const [gradeScore, setGradeScore] = useState(85);
  const [gradeComment, setGradeComment] = useState('Bài viết chất lượng, bố cục rõ ràng, nêu bật vai trò MTTQ.');

  const handleSaveOverview = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompetition(compData);
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 3000);
  };

  const handleOpenAddQuestion = () => {
    setEditingQuestion(null);
    setQText('');
    setQType('SINGLE_CHOICE');
    setQCategory('Kiến thức chung');
    setQDifficulty('MEDIUM');
    setQScore(10);
    setQExplanation('');
    setQOptions([
      { id: 'o1', text: '', isCorrect: true },
      { id: 'o2', text: '', isCorrect: false },
      { id: 'o3', text: '', isCorrect: false },
      { id: 'o4', text: '', isCorrect: false }
    ]);
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim()) return;

    if (editingQuestion) {
      const updated = questions.map(q => q.id === editingQuestion.id ? {
        ...q,
        questionText: qText,
        questionType: qType,
        category: qCategory,
        difficulty: qDifficulty,
        score: qScore,
        explanation: qExplanation,
        options: qOptions
      } : q);
      setQuestions(updated);
      onUpdateCompetition({ ...compData, questions: updated });
    } else {
      const newQ: CompetitionQuestion = {
        id: 'q-' + Date.now(),
        competitionId: compData.id,
        questionText: qText,
        questionType: qType,
        category: qCategory,
        difficulty: qDifficulty,
        score: qScore,
        options: qOptions,
        explanation: qExplanation,
        status: 'ACTIVE'
      };
      const updated = [...questions, newQ];
      setQuestions(updated);
      onUpdateCompetition({ ...compData, questions: updated });
    }
    setIsQuestionModalOpen(false);
  };

  const handleDeleteQuestion = (id: string) => {
    const updated = questions.filter(q => q.id !== id);
    setQuestions(updated);
    onUpdateCompetition({ ...compData, questions: updated });
  };

  // Filtered submissions for this competition
  const compSubmissions = submissions.filter(s => s.competitionId === compData.id);

  // Ranking calculation
  const rankedSubmissions = [...compSubmissions].sort((a, b) => {
    const scoreA = a.score || 0;
    const scoreB = b.score || 0;
    if (scoreB !== scoreA) return scoreB - scoreA;
    const timeA = a.timeSpentSeconds || 9999;
    const timeB = b.timeSpentSeconds || 9999;
    return timeA - timeB;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-start gap-4">
          <button
            onClick={onBack}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-mono text-[11px] font-black rounded-md">
                ID: {compData.id}
              </span>
              <span className={`px-2.5 py-0.5 text-[11px] font-black uppercase rounded-md text-white ${
                compData.status === 'OPEN' || compData.status === 'ONGOING' ? 'bg-emerald-600' :
                compData.status === 'DRAFT' ? 'bg-amber-600' : 'bg-slate-600'
              }`}>
                {compData.status === 'OPEN' || compData.status === 'ONGOING' ? 'Đang diễn ra' :
                 compData.status === 'DRAFT' ? 'Bản nháp' : 'Đã kết thúc'}
              </span>
              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-md">
                {compData.type === 'TRIVIA' ? 'Trắc nghiệm trực tuyến' : compData.type === 'WRITING' ? 'Cuộc thi viết' : 'Trắc nghiệm + Bài viết'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{compData.title}</h1>
            <p className="text-xs text-slate-500 mt-0.5">Quản trị chi tiết nội dung, ngân hàng câu hỏi, đề thi và chấm điểm trực tuyến</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={`#/hoi-thi/${compData.id}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl inline-flex items-center gap-2 transition-colors"
          >
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Xem trang Public</span>
          </a>
          {saveNotice && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-pulse">
              Đã lưu thành công!
            </span>
          )}
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs overflow-x-auto flex items-center gap-1.5 scrollbar-thin">
        {[
          { id: 'OVERVIEW', label: 'Tổng quan', icon: Settings },
          { id: 'RULES', label: 'Thể lệ', icon: FileText },
          { id: 'QUESTIONS', label: `Ngân hàng câu hỏi (${questions.length})`, icon: HelpCircle },
          { id: 'CONFIG', label: 'Cấu hình đề', icon: CheckSquare },
          { id: 'PARTICIPANTS', label: 'Đối tượng dự thi', icon: Users },
          { id: 'SUBMISSIONS', label: `Bài thi (${compSubmissions.length})`, icon: Award },
          { id: 'GRADING', label: 'Chấm điểm', icon: Edit3 },
          { id: 'RANKING', label: 'Xếp hạng', icon: AwardIcon },
          { id: 'ANALYTICS', label: 'Thống kê', icon: BarChart3 },
          { id: 'CERTIFICATES', label: 'Chứng nhận', icon: Star },
          { id: 'SHARE', label: 'Xuất bản & Chia sẻ', icon: Share2 }
        ].map(tab => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap inline-flex items-center gap-2 cursor-pointer ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Tổng quan (Overview) */}
      {activeTab === 'OVERVIEW' && (
        <form onSubmit={handleSaveOverview} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900">Thông tin chung cuộc thi</h3>
            <p className="text-xs text-slate-500">Cập nhật tiêu đề, mô tả, thời gian diễn ra và hình thức tổ chức</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Tiêu đề cuộc thi</label>
              <input
                type="text"
                value={compData.title}
                onChange={(e) => setCompData({ ...compData, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Hình thức cuộc thi</label>
              <select
                value={compData.type}
                onChange={(e) => setCompData({ ...compData, type: e.target.value as any })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TRIVIA">Trắc nghiệm trực tuyến</option>
                <option value="WRITING">Cuộc thi viết cảm nhận</option>
                <option value="MIXED">Trắc nghiệm + Bài viết</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Trạng thái workflow</label>
              <select
                value={compData.status}
                onChange={(e) => setCompData({ ...compData, status: e.target.value as any })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DRAFT">Bản nháp (DRAFT)</option>
                <option value="SCHEDULED">Sắp diễn ra (SCHEDULED)</option>
                <option value="OPEN">Đang mở / Đang diễn ra (OPEN)</option>
                <option value="CLOSED">Đã kết thúc (CLOSED)</option>
                <option value="GRADING">Đang chấm điểm (GRADING)</option>
                <option value="PUBLISHED">Đã công bố kết quả (PUBLISHED)</option>
                <option value="ARCHIVED">Lưu trữ (ARCHIVED)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Thời gian bắt đầu</label>
              <input
                type="date"
                value={compData.startDate}
                onChange={(e) => setCompData({ ...compData, startDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Thời gian kết thúc</label>
              <input
                type="date"
                value={compData.endDate}
                onChange={(e) => setCompData({ ...compData, endDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Link Banner / Hình minh họa</label>
              <input
                type="text"
                value={compData.bannerUrl || ''}
                onChange={(e) => setCompData({ ...compData, bannerUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Giới thiệu ngắn gọn</label>
              <textarea
                rows={3}
                value={compData.description}
                onChange={(e) => setCompData({ ...compData, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl inline-flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu thay đổi tổng quan</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Thể lệ (Rules) */}
      {activeTab === 'RULES' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Soạn thảo Thể lệ Cuộc thi (Rich Text Editor)</h3>
              <p className="text-xs text-slate-500">Hỗ trợ định dạng tiêu đề, danh mục đối tượng, cơ cấu giải thưởng và quy chế thi</p>
            </div>
            <button
              onClick={() => {
                onUpdateCompetition(compData);
                setSaveNotice(true);
                setTimeout(() => setSaveNotice(false), 3000);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Thể lệ</span>
            </button>
          </div>

          {/* Formatting Toolbar Simulation */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-2 rounded-xl border border-slate-200 flex-wrap">
            <button type="button" className="px-2.5 py-1.5 bg-white text-slate-800 font-black text-xs rounded-lg shadow-2xs hover:bg-slate-50">B</button>
            <button type="button" className="px-2.5 py-1.5 bg-white text-slate-800 font-italic text-xs rounded-lg shadow-2xs hover:bg-slate-50">I</button>
            <button type="button" className="px-2.5 py-1.5 bg-white text-slate-800 font-bold text-xs rounded-lg shadow-2xs hover:bg-slate-50">U</button>
            <div className="w-px h-5 bg-slate-300 mx-1"></div>
            <button type="button" className="px-2.5 py-1.5 bg-white text-slate-800 font-bold text-xs rounded-lg shadow-2xs hover:bg-slate-50">H1</button>
            <button type="button" className="px-2.5 py-1.5 bg-white text-slate-800 font-bold text-xs rounded-lg shadow-2xs hover:bg-slate-50">H2</button>
            <button type="button" className="px-2.5 py-1.5 bg-white text-slate-800 font-bold text-xs rounded-lg shadow-2xs hover:bg-slate-50">Danh sách</button>
            <button type="button" className="px-2.5 py-1.5 bg-white text-slate-800 font-bold text-xs rounded-lg shadow-2xs hover:bg-slate-50">Bảng</button>
            <button type="button" className="px-2.5 py-1.5 bg-white text-slate-800 font-bold text-xs rounded-lg shadow-2xs hover:bg-slate-50">Chèn Ảnh / PDF</button>
          </div>

          <textarea
            rows={12}
            value={compData.rules || ''}
            onChange={(e) => setCompData({ ...compData, rules: e.target.value })}
            placeholder="Nhập thể lệ chi tiết cuộc thi..."
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-normal text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-mono"
          />
        </div>
      )}

      {/* Tab 3: Ngân hàng câu hỏi (Question Bank) */}
      {activeTab === 'QUESTIONS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Ngân Hàng Câu Hỏi Trắc Nghiệm</h3>
              <p className="text-xs text-slate-500">Quản lý câu hỏi, phân loại mức độ, điểm số và đáp án chuẩn</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenAddQuestion}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Câu Hỏi</span>
              </button>
              <button
                onClick={() => alert('Đã import 50 câu hỏi từ file Excel chuẩn!')}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Import Excel</span>
              </button>
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 hover:border-blue-300 transition-all">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-mono font-black text-xs rounded-lg">
                      Câu {idx + 1}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 font-bold text-[10px] rounded-md">
                      {q.category}
                    </span>
                    <span className={`px-2 py-0.5 font-bold text-[10px] rounded-md text-white ${
                      q.difficulty === 'EASY' ? 'bg-emerald-600' : q.difficulty === 'MEDIUM' ? 'bg-amber-600' : 'bg-red-600'
                    }`}>
                      {q.difficulty === 'EASY' ? 'Dễ' : q.difficulty === 'MEDIUM' ? 'Trung bình' : 'Khó'}
                    </span>
                    <span className="text-xs font-extrabold text-blue-600">{q.score} điểm</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingQuestion(q);
                        setQText(q.questionText);
                        setQType(q.questionType);
                        setQCategory(q.category);
                        setQDifficulty(q.difficulty);
                        setQScore(q.score);
                        setQExplanation(q.explanation || '');
                        setQOptions(q.options);
                        setIsQuestionModalOpen(true);
                      }}
                      className="p-1.5 bg-white text-slate-700 rounded-lg hover:bg-slate-200 border border-slate-200 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-1.5 bg-white text-red-600 rounded-lg hover:bg-red-50 border border-slate-200 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="font-black text-slate-900 text-sm leading-snug">{q.questionText}</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, oIdx) => (
                    <div key={opt.id} className={`p-2.5 rounded-xl text-xs font-medium border flex items-center gap-2 ${
                      opt.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-700'
                    }`}>
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-[10px]">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="flex-1">{opt.text}</span>
                      {opt.isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </div>
                  ))}
                </div>

                {q.explanation && (
                  <p className="text-[11px] text-slate-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-200/50">
                    <strong className="font-bold text-amber-800">Giải thích:</strong> {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Cấu hình đề thi (Exam Config) */}
      {activeTab === 'CONFIG' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900">Cấu hình Đề thi & Thuật toán sinh đề ngẫu nhiên</h3>
            <p className="text-xs text-slate-500">Thiết lập thời gian làm bài, số lượng câu hỏi, trộn đề và phương án tính điểm</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Thời gian làm bài (Phút)</label>
              <input
                type="number"
                value={compData.timeLimitMinutes || 15}
                onChange={(e) => setCompData({ ...compData, timeLimitMinutes: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Tổng số câu trong một đề</label>
              <input
                type="number"
                value={compData.totalQuestions || questions.length}
                onChange={(e) => setCompData({ ...compData, totalQuestions: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Số lần dự thi tối đa cho phép</label>
              <input
                type="number"
                defaultValue={3}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Phương án lấy điểm kết quả</label>
              <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900">
                <option value="HIGHEST">Lấy điểm cao nhất trong các lần thi</option>
                <option value="FIRST">Lấy kết quả lần thi đầu tiên</option>
                <option value="LAST">Lấy kết quả lần thi gần nhất</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-3 pt-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Tùy chọn trộn đề & đáp án</label>
              <div className="flex flex-col gap-2.5">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">Trộn ngẫu nhiên thứ tự câu hỏi cho từng thí sinh</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">Trộn ngẫu nhiên các đáp án A, B, C, D</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">Lưu snapshot đề thi (ngăn chặn chỉnh sửa ngân hàng câu hỏi ảnh hưởng bài thi đang diễn ra)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                onUpdateCompetition(compData);
                setSaveNotice(true);
                setTimeout(() => setSaveNotice(false), 3000);
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl inline-flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Cấu hình Đề thi</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Đối tượng dự thi (Participants) */}
      {activeTab === 'PARTICIPANTS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900">Phân quyền & Cấu hình đối tượng dự thi</h3>
            <p className="text-xs text-slate-500">Quy định quyền truy cập cuộc thi và các trường thông tin bắt buộc khi đăng ký</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Hình thức truy cập</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="p-4 rounded-2xl border-2 border-blue-600 bg-blue-50/50 flex items-start gap-3 cursor-pointer">
                  <input type="radio" name="accessMode" defaultChecked className="mt-1" />
                  <div>
                    <span className="font-black text-slate-900 text-sm block">Công khai (Public)</span>
                    <span className="text-xs text-slate-600">Mọi công dân đều có thể truy cập link tham gia làm bài ngay.</span>
                  </div>
                </label>
                <label className="p-4 rounded-2xl border-2 border-slate-200 bg-white flex items-start gap-3 cursor-pointer hover:border-slate-300">
                  <input type="radio" name="accessMode" className="mt-1" />
                  <div>
                    <span className="font-black text-slate-900 text-sm block">Yêu cầu đăng nhập tài khoản</span>
                    <span className="text-xs text-slate-600">Thí sinh phải đăng nhập hệ thống mới được thi.</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Các trường thông tin thí sinh bắt buộc nhập (Required Fields)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'f1', label: 'Họ và tên', required: true },
                  { id: 'f2', label: 'Số điện thoại', required: true },
                  { id: 'f3', label: 'Khu phố / Đơn vị', required: true },
                  { id: 'f4', label: 'Email liên hệ', required: false },
                  { id: 'f5', label: 'Ngày tháng năm sinh', required: false },
                  { id: 'f6', label: 'Đơn vị công tác', required: false }
                ].map(f => (
                  <label key={f.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800 cursor-pointer">
                    <span>{f.label}</span>
                    <input type="checkbox" defaultChecked={f.required} className="w-4 h-4 rounded text-blue-600" />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Bài dự thi (Submissions) */}
      {activeTab === 'SUBMISSIONS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Danh Sách Bài Thi & Thí Sinh Tham Gia</h3>
              <p className="text-xs text-slate-500">Tổng hợp tất cả các lượt nộp bài, thời gian và kết quả đạt được</p>
            </div>
            <button 
              onClick={() => alert('Đã xuất danh sách bài thi ra file Excel thành công!')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Excel Bài Thi</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-700 tracking-wider">
                  <th className="p-3">Thí sinh</th>
                  <th className="p-3">Khu phố</th>
                  <th className="p-3">Số điện thoại</th>
                  <th className="p-3">Thời gian nộp</th>
                  <th className="p-3 text-center">Điểm số</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {compSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      Chưa có thí sinh nộp bài thi nào trong cuộc thi này.
                    </td>
                  </tr>
                ) : (
                  compSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-black text-slate-900">{sub.participantName}</td>
                      <td className="p-3 font-medium text-slate-600">{sub.neighborhood}</td>
                      <td className="p-3 font-mono text-slate-600">{sub.phone}</td>
                      <td className="p-3 font-mono text-slate-500">{sub.submittedAt}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-1 rounded-lg font-black text-xs ${
                          (sub.score || 0) >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {sub.score !== undefined ? `${sub.score} đ` : 'Chờ chấm'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setGradingSub(sub);
                            setGradeScore(sub.score || 85);
                            setGradeComment(sub.adminComment || 'Bài thi đạt yêu cầu.');
                          }}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200 hover:bg-blue-100 cursor-pointer"
                        >
                          Chấm điểm / Chi tiết
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

      {/* Tab 7: Chấm điểm (Grading) */}
      {activeTab === 'GRADING' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900">Hệ Thống Chấm Điểm Tự Luận & Bài Viết Cảm Nhận</h3>
            <p className="text-xs text-slate-500">Chấm điểm chi tiết, đưa ra nhận xét và lưu trữ lịch sử chấm điểm bảo mật</p>
          </div>

          {gradingSub ? (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h4 className="font-black text-slate-900 text-base">{gradingSub.participantName}</h4>
                  <p className="text-xs text-slate-500">{gradingSub.neighborhood} - SĐT: {gradingSub.phone}</p>
                </div>
                <button
                  onClick={() => setGradingSub(null)}
                  className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Đóng
                </button>
              </div>

              {gradingSub.essayText && (
                <div className="space-y-1.5">
                  <span className="text-xs font-black text-slate-700 uppercase">Nội dung bài viết dự thi:</span>
                  <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm text-slate-800 leading-relaxed whitespace-pre-line font-mono">
                    {gradingSub.essayText}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase">Điểm số (0 - 100)</label>
                  <input
                    type="number"
                    value={gradeScore}
                    onChange={(e) => setGradeScore(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase">Nhận xét của Ban Giám Khảo</label>
                <textarea
                  rows={3}
                  value={gradeComment}
                  onChange={(e) => setGradeComment(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-normal text-slate-900"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    if (onGradeSubmission) {
                      onGradeSubmission(gradingSub.id, gradeScore, gradeComment);
                    }
                    setGradingSub(null);
                  }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Lưu Điểm & Hoàn Tất Chấm
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Vui lòng chọn bài thi từ danh sách Bài thi hoặc tab Bài thi để thực hiện chấm điểm.
            </div>
          )}
        </div>
      )}

      {/* Tab 8: Xếp hạng (Ranking) */}
      {activeTab === 'RANKING' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900">Bảng Xếp Hạng Cuộc Thi (Top 10 & Toàn Bộ)</h3>
            <p className="text-xs text-slate-500">Xếp hạng tự động theo tiêu chí: Điểm cao nhất → Thời gian làm bài ngắn nhất</p>
          </div>

          <div className="space-y-3">
            {rankedSubmissions.map((sub, idx) => (
              <div key={sub.id} className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                idx === 0 ? 'bg-amber-50/70 border-amber-300 shadow-xs' :
                idx === 1 ? 'bg-slate-100 border-slate-300' :
                idx === 2 ? 'bg-amber-100/40 border-amber-200' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${
                    idx === 0 ? 'bg-amber-500 text-white shadow-sm' :
                    idx === 1 ? 'bg-slate-500 text-white' :
                    idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{sub.participantName}</h4>
                    <p className="text-xs text-slate-500">{sub.neighborhood} &bull; SĐT: {sub.phone}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-blue-700">{sub.score || 0} điểm</span>
                  <p className="text-[10px] text-slate-500 font-mono">Nộp: {sub.submittedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 9: Thống kê (Analytics) */}
      {activeTab === 'ANALYTICS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900">Thống kê Tổng quan Cuộc thi</h3>
            <p className="text-xs text-slate-500">Phân tích tỷ lệ tham gia, phổ điểm và số liệu các khu phố</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 text-center space-y-1">
              <span className="text-xs font-bold text-blue-700 uppercase">Tổng lượt thi</span>
              <h4 className="text-2xl font-black text-blue-900">{compSubmissions.length}</h4>
            </div>
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-center space-y-1">
              <span className="text-xs font-bold text-emerald-700 uppercase">Điểm trung bình</span>
              <h4 className="text-2xl font-black text-emerald-900">
                {compSubmissions.length > 0 ? Math.round(compSubmissions.reduce((acc, s) => acc + (s.score || 0), 0) / compSubmissions.length) : 0} đ
              </h4>
            </div>
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 text-center space-y-1">
              <span className="text-xs font-bold text-amber-700 uppercase">Điểm cao nhất</span>
              <h4 className="text-2xl font-black text-amber-900">
                {compSubmissions.length > 0 ? Math.max(...compSubmissions.map(s => s.score || 0)) : 0} đ
              </h4>
            </div>
            <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 text-center space-y-1">
              <span className="text-xs font-bold text-purple-700 uppercase">Tỷ lệ hoàn thành</span>
              <h4 className="text-2xl font-black text-purple-900">100%</h4>
            </div>
          </div>
        </div>
      )}

      {/* Tab 10: Chứng nhận (Certificates) */}
      {activeTab === 'CERTIFICATES' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900">Cấu hình Chứng nhận Điện tử (E-Certificate)</h3>
            <p className="text-xs text-slate-500">Tự động cấp giấy chứng nhận / thư cảm ơn cho thí sinh đạt từ 80 điểm trở lên</p>
          </div>

          <div className="p-8 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl shadow-lg relative overflow-hidden space-y-4 border-4 border-amber-300">
            <div className="absolute top-4 right-4 text-amber-300 font-black text-xl opacity-80">★ MTTQ CHÁNH HIỆP</div>
            <span className="text-xs uppercase font-bold text-amber-300 tracking-widest">GIẤY CHỨNG NHẬN THAM GIA TRỰC TUYẾN</span>
            <h3 className="text-2xl font-black">Chứng nhận hoàn thành xuất sắc hội thi</h3>
            <p className="text-xs text-slate-200 max-w-lg leading-relaxed">
              Ủy ban MTTQ Việt Nam phường Chánh Hiệp chứng nhận Ông/Bà <strong className="text-amber-300">[Tên Thí Sinh]</strong> đã tích cực tham gia và đạt thành tích xuất sắc trong cuộc thi "{compData.title}".
            </p>
            <div className="pt-4 flex items-center justify-between text-xs text-slate-300 border-t border-blue-800">
              <span>Mã xác thực: VERIFIED-{Math.floor(Math.random() * 899999 + 100000)}</span>
              <span className="font-bold text-amber-300">CHỦ TỊCH ỦY BAN MTTQ PHƯỜNG</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 11: Xuất bản & Chia sẻ (Share) */}
      {activeTab === 'SHARE' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900">Xuất bản & Kênh Chia Sẻ Độc Lập</h3>
            <p className="text-xs text-slate-500">Chia sẻ đường dẫn QR Code, Facebook, Zalo cho nhân dân tham gia dự thi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-black text-slate-700 uppercase">Đường dẫn Public Trang Cuộc Thi</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://ais-dev-eokzuo3lbp4ijcdgdnvif3.run.app/#/hoi-thi/${compData.id}`}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700"
                />
                <button
                  onClick={() => alert('Đã sao chép đường dẫn cuộc thi vào clipboard!')}
                  className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shrink-0 cursor-pointer hover:bg-blue-700"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-xl border border-slate-300 flex items-center justify-center p-2 shadow-xs shrink-0">
                <QrCode className="w-full h-full text-slate-800" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-slate-900 text-xs">Mã QR Code Truy Nhanh</h4>
                <p className="text-[11px] text-slate-500">Quét mã QR bằng camera điện thoại hoặc Zalo để mở trực tiếp trang thi.</p>
                <button 
                  onClick={() => alert('Đã tải xuống hình ảnh QR Code cuộc thi!')}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold text-[11px] rounded-lg shadow-2xs hover:bg-slate-50 cursor-pointer"
                >
                  Tải xuống QR Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add/Edit Question */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">
                {editingQuestion ? 'Chỉnh Sửa Câu Hỏi' : 'Thêm Câu Hỏi Mới vào Ngân Hàng'}
              </h3>
              <button 
                onClick={() => setIsQuestionModalOpen(false)}
                className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 uppercase">Nội dung câu hỏi</label>
                <textarea
                  rows={2}
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="Nhập nội dung câu hỏi..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 uppercase">Danh mục</label>
                  <input
                    type="text"
                    value={qCategory}
                    onChange={(e) => setQCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 uppercase">Mức độ</label>
                  <select
                    value={qDifficulty}
                    onChange={(e) => setQDifficulty(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  >
                    <option value="EASY">Dễ</option>
                    <option value="MEDIUM">Trung bình</option>
                    <option value="HARD">Khó</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 uppercase">Điểm số</label>
                  <input
                    type="number"
                    value={qScore}
                    onChange={(e) => setQScore(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase">Các đáp án (Chọn đáp án đúng)</label>
                {qOptions.map((opt, oIdx) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={opt.isCorrect}
                      onChange={() => {
                        const updated = qOptions.map((o, idx) => ({ ...o, isCorrect: idx === oIdx }));
                        setQOptions(updated);
                      }}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-bold text-xs text-slate-700 w-6">ĐAP {String.fromCharCode(65 + oIdx)}:</span>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => {
                        const updated = [...qOptions];
                        updated[oIdx].text = e.target.value;
                        setQOptions(updated);
                      }}
                      placeholder={`Nhập đáp án ${String.fromCharCode(65 + oIdx)}...`}
                      className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 uppercase">Giải thích đáp án đúng</label>
                <input
                  type="text"
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  placeholder="Nhập giải thích..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-xs"
                >
                  Lưu Câu Hỏi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
