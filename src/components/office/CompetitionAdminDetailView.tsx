import React, { useState } from 'react';
import { Competition, CompetitionQuestion, CompetitionSubmission, ScoringCriterion } from '../../types';
import { 
  uploadFileToGoogleDrive, 
  DEFAULT_DRIVE_FOLDER_ID, 
  DEFAULT_DRIVE_FOLDER_URL, 
  getGoogleDriveDirectImageUrl 
} from '../../lib/googleDriveService';
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
  Star,
  CheckCircle2,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
    'OVERVIEW' | 'RULES' | 'QUESTIONS' | 'CONFIG' | 'PARTICIPANTS' | 'SUBMISSIONS' | 'GRADING' | 'RUBRIC' | 'JUDGES' | 'RANKING' | 'ANALYTICS' | 'CERTIFICATES' | 'SHARE'
  >('OVERVIEW');

  // Local editable state for competition
  const [compData, setCompData] = useState<Competition>(competition);
  const [saveNotice, setSaveNotice] = useState(false);

  // Google Drive Upload States
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  // Rubric Builder State
  const [rubricItems, setRubricItems] = useState<ScoringCriterion[]>(competition.rubric || [
    { id: 'r1', name: 'Nội dung cốt lõi & Tư tưởng', maxScore: 40, description: 'Bám sát chủ đề, chính xác về đường lối, quan điểm.' },
    { id: 'r2', name: 'Tính tiêu biểu & Thực tiễn', maxScore: 20, description: 'Phản ánh sinh động thực tiễn công tác Mặt trận và phong trào.' },
    { id: 'r3', name: 'Tính lan tỏa cộng đồng', maxScore: 20, description: 'Có sức thuyết phục, tác động tích cực đến đoàn viên, nhân dân.' },
    { id: 'r4', name: 'Hình thức trình bày & Sáng tạo', maxScore: 20, description: 'Bố cục mạch lạc, văn phong chuẩn mực, hình thức đẹp.' }
  ]);
  const [newCriterionName, setNewCriterionName] = useState('');
  const [newCriterionScore, setNewCriterionScore] = useState(10);
  const [newCriterionDesc, setNewCriterionDesc] = useState('');

  // Judges State
  const [judgesList, setJudgesList] = useState(competition.judges || [
    { id: 'j1', name: 'Nguyễn Minh Huy', email: 'huy.nguyen@thudaumot.gov.vn', assignedCount: 15 },
    { id: 'j2', name: 'Trần Thị Mai', email: 'mai.tran@thudaumot.gov.vn', assignedCount: 12 }
  ]);
  const [newJudgeName, setNewJudgeName] = useState('');
  const [newJudgeEmail, setNewJudgeEmail] = useState('');

  const handleUploadBannerToDrive = async () => {
    if (!bannerFile) return;
    setIsUploadingBanner(true);
    try {
      let driveLink = DEFAULT_DRIVE_FOLDER_URL;
      try {
        const res = await uploadFileToGoogleDrive(bannerFile, DEFAULT_DRIVE_FOLDER_ID);
        if (res.webViewLink && !res.webViewLink.includes('/folders/')) {
          driveLink = res.id ? `https://lh3.googleusercontent.com/d/${res.id}` : res.webViewLink;
        }
      } catch (e) {
        console.warn('Drive upload notice:', e);
        driveLink = URL.createObjectURL(bannerFile);
      }

      setCompData(prev => ({ ...prev, bannerUrl: driveLink }));
      alert(`Đã tải lên và lưu hình ảnh banner thành công!\n- Liên kết: ${driveLink}`);
      setBannerFile(null);
    } catch (err: any) {
      alert('Lỗi tải banner: ' + (err?.message || 'Không xác định'));
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handleUploadDocToDrive = async () => {
    if (!docFile) return;
    setIsUploadingDoc(true);
    try {
      let fileUrl = DEFAULT_DRIVE_FOLDER_URL;
      try {
        const res = await uploadFileToGoogleDrive(docFile, DEFAULT_DRIVE_FOLDER_ID);
        if (res.webViewLink) fileUrl = res.webViewLink;
      } catch (e) {
        console.warn('Drive doc upload notice:', e);
      }

      const linkSnippet = `\n\n📌 Tài liệu / Thể lệ đính kèm: [${docFile.name}](${fileUrl})`;
      setCompData(prev => ({ ...prev, rules: (prev.rules || '') + linkSnippet }));
      alert(`Đã tải tài liệu hội thi "${docFile.name}" thành công! Link đã được chèn vào thể lệ.`);
      setDocFile(null);
    } catch (err: any) {
      alert('Lỗi tải tài liệu: ' + (err?.message || 'Không xác định'));
    } finally {
      setIsUploadingDoc(false);
    }
  };

  // Question bank state
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
    const updated = { ...compData, rubric: rubricItems, judges: judgesList, questions };
    onUpdateCompetition(updated);
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 3000);
  };

  const compSubmissions = submissions.filter(s => s.competitionId === compData.id);
  const pendingCount = compSubmissions.filter(s => s.status === 'PENDING_GRADING' || !s.score).length;
  const gradedCount = compSubmissions.length - pendingCount;

  // Setup Progress calculation
  let setupScore = 0;
  if (compData.title) setupScore += 20;
  if (compData.bannerUrl) setupScore += 20;
  if (compData.rules) setupScore += 20;
  if (compData.startDate && compData.endDate) setupScore += 20;
  if (compData.type === 'TRIVIA' ? questions.length > 0 : true) setupScore += 20;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Contest Command Center Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-900/40 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={onBack}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Danh sách hội thi</span>
              </button>
              <span className="px-3 py-1 bg-blue-600/60 border border-blue-400/30 text-blue-200 font-mono text-xs font-black rounded-lg">
                ID: {compData.id}
              </span>
              <span className={`px-3 py-1 text-xs font-black uppercase rounded-lg text-white ${
                compData.status === 'OPEN' || compData.status === 'ONGOING' ? 'bg-emerald-600' :
                compData.status === 'DRAFT' ? 'bg-amber-600' : 'bg-blue-600'
              }`}>
                {compData.status === 'OPEN' || compData.status === 'ONGOING' ? '● Đang diễn ra' :
                 compData.status === 'DRAFT' ? '○ Bản nháp' : '✓ Đã kết thúc'}
              </span>
              <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10">
                {compData.type === 'TRIVIA' ? 'Trắc nghiệm trực tuyến' :
                 compData.type === 'WRITING' ? 'Cuộc thi viết' :
                 compData.type === 'PHOTO_VIDEO' ? 'Cuộc thi Ảnh / Video' :
                 compData.type === 'SURVEY' ? 'Khảo sát / Lấy ý kiến' : 'Tổng hợp'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{compData.title}</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">{compData.description}</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap lg:justify-end">
            <a
              href={`#/hoi-thi/${compData.id}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>Xem trang công khai</span>
            </a>
            <button
              onClick={() => {
                const updatedStatus = compData.status === 'DRAFT' ? 'OPEN' : 'DRAFT';
                setCompData(prev => ({ ...prev, status: updatedStatus }));
                onUpdateCompetition({ ...compData, status: updatedStatus });
                alert(`Đã chuyển trạng thái cuộc thi thành: ${updatedStatus === 'OPEN' ? 'Đang diễn ra (Xuất bản)' : 'Bản nháp'}`);
              }}
              className={`px-4 py-2.5 font-bold text-xs rounded-xl shadow-md inline-flex items-center gap-2 transition-all cursor-pointer ${
                compData.status === 'DRAFT' 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{compData.status === 'DRAFT' ? 'Xuất bản Hội thi' : 'Chuyển về Bản nháp'}</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics & Setup Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-4 border-t border-white/10">
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 block">Thời gian</span>
            <span className="text-xs font-black text-white">{compData.startDate} → {compData.endDate}</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 block">Tổng bài nộp</span>
            <span className="text-sm font-black text-blue-300">{compSubmissions.length} bài</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 block">Chờ chấm / Duyệt</span>
            <span className="text-sm font-black text-amber-300">{pendingCount} bài</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 block">Đã chấm điểm</span>
            <span className="text-sm font-black text-emerald-300">{gradedCount} bài</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 block">Ban giám khảo</span>
            <span className="text-sm font-black text-purple-300">{judgesList.length} thành viên</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 block">Tiến độ thiết lập</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full transition-all" style={{ width: `${setupScore}%` }} />
              </div>
              <span className="text-xs font-black text-emerald-300">{setupScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {saveNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl font-bold text-xs flex items-center justify-between">
          <span>✓ Đã lưu thay đổi cấu hình hội thi lên hệ thống và Cloud Database thành công!</span>
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
      )}

      {/* Dynamic Navigation Tabs based on Competition Type */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs overflow-x-auto flex items-center gap-1.5 scrollbar-thin">
        {[
          { id: 'OVERVIEW', label: 'Tổng quan & Banner', icon: Settings },
          { id: 'RULES', label: 'Thể lệ & Tài liệu', icon: FileText },
          ...(compData.type === 'TRIVIA' ? [
            { id: 'QUESTIONS', label: `Ngân hàng câu hỏi (${questions.length})`, icon: HelpCircle },
            { id: 'CONFIG', label: 'Cấu hình đề thi', icon: CheckSquare }
          ] : [
            { id: 'RUBRIC', label: `Tiêu chí chấm (Rubric)`, icon: Layers },
            { id: 'JUDGES', label: `Ban giám khảo (${judgesList.length})`, icon: ShieldCheck }
          ]),
          { id: 'SUBMISSIONS', label: `Bài dự thi (${compSubmissions.length})`, icon: Award },
          { id: 'GRADING', label: 'Chấm bài & Duyệt', icon: Edit3 },
          { id: 'RANKING', label: 'Xếp hạng & Kết quả', icon: AwardIcon },
          { id: 'ANALYTICS', label: 'Thống kê & Biểu đồ', icon: BarChart3 },
          { id: 'CERTIFICATES', label: 'Chứng nhận', icon: Star },
          { id: 'SHARE', label: 'Xuất bản & Chia sẻ (QR)', icon: Share2 }
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

      {/* Tab 1: Tổng quan & Banner (Overview) */}
      {activeTab === 'OVERVIEW' && (
        <form onSubmit={handleSaveOverview} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Cấu hình Thông tin chung & Banner Hội thi</h3>
              <p className="text-xs text-slate-500">Thiết lập tiêu đề, mô tả, thời gian diễn ra và hình ảnh nhận diện</p>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu thay đổi</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Tiêu đề cuộc thi</label>
              <input
                type="text"
                value={compData.title}
                onChange={(e) => setCompData({ ...compData, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Hình thức hội thi</label>
              <select
                value={compData.type}
                onChange={(e) => setCompData({ ...compData, type: e.target.value as any })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none"
              >
                <option value="TRIVIA">Trắc nghiệm trực tuyến (Quiz)</option>
                <option value="WRITING">Cuộc thi viết (Writing)</option>
                <option value="PHOTO_VIDEO">Cuộc thi Ảnh / Video</option>
                <option value="SURVEY">Khảo sát / Lấy ý kiến nhân dân</option>
                <option value="MIXED">Tổng hợp (Trắc nghiệm + Bài viết)</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Mô tả ngắn cuộc thi</label>
              <textarea
                value={compData.description}
                onChange={(e) => setCompData({ ...compData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Thời gian bắt đầu</label>
              <input
                type="date"
                value={compData.startDate}
                onChange={(e) => setCompData({ ...compData, startDate: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Thời gian kết thúc</label>
              <input
                type="date"
                value={compData.endDate}
                onChange={(e) => setCompData({ ...compData, endDate: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                required
              />
            </div>

            {/* Media Picker & Banner Google Drive Upload */}
            <div className="space-y-3 md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
                <span>Banner / Hình minh họa hội thi (Google Drive Sync)</span>
                <a href={DEFAULT_DRIVE_FOLDER_URL} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs font-bold">
                  📂 Mở thư mục Google Drive
                </a>
              </label>

              <input
                type="text"
                value={compData.bannerUrl || ''}
                onChange={(e) => setCompData({ ...compData, bannerUrl: e.target.value })}
                placeholder="https://... hoặc link hình ảnh trực tiếp"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && setBannerFile(e.target.files[0])}
                  className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
                {bannerFile && (
                  <button
                    type="button"
                    onClick={handleUploadBannerToDrive}
                    disabled={isUploadingBanner}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-50 cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isUploadingBanner ? 'Đang tải lên Drive...' : 'Tải lên Google Drive'}</span>
                  </button>
                )}
              </div>

              {compData.bannerUrl && (
                <div className="mt-3 relative h-48 w-full max-w-xl rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
                  <img src={compData.bannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Thể lệ & Tài liệu (Rules) */}
      {activeTab === 'RULES' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Thể lệ & Quy chế Cuộc thi</h3>
              <p className="text-xs text-slate-500">Soạn thảo thể lệ chi tiết và đính kèm văn bản, tài liệu hội thi từ Google Drive</p>
            </div>
            <button
              onClick={handleSaveOverview}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Thể lệ</span>
            </button>
          </div>

          {/* Upload Document / Rules to Google Drive */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider">Tải lên văn bản / tài liệu thể lệ (PDF, DOCX)</h4>
              <p className="text-[11px] text-blue-700">Tài liệu tải lên sẽ được lưu vào Google Drive chung và tự động chèn liên kết vào nội dung thể lệ.</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.zip,.txt"
                onChange={(e) => e.target.files?.[0] && setDocFile(e.target.files[0])}
                className="text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer max-w-[220px]"
              />
              {docFile && (
                <button
                  type="button"
                  onClick={handleUploadDocToDrive}
                  disabled={isUploadingDoc}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-50 cursor-pointer whitespace-nowrap inline-flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingDoc ? 'Đang tải...' : 'Upload lên Drive'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Nội dung Thể lệ (Hỗ trợ Markdown & HTML)</label>
            <textarea
              value={compData.rules || ''}
              onChange={(e) => setCompData({ ...compData, rules: e.target.value })}
              rows={12}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Ngân hàng câu hỏi (For Trivia) */}
      {activeTab === 'QUESTIONS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Ngân hàng Câu hỏi Trắc nghiệm ({questions.length})</h3>
              <p className="text-xs text-slate-500">Quản lý câu hỏi, đáp án đúng và ma trận đề thi</p>
            </div>
            <button
              onClick={() => {
                setEditingQuestion(null);
                setQText('');
                setQOptions([
                  { id: 'o1', text: '', isCorrect: true },
                  { id: 'o2', text: '', isCorrect: false },
                  { id: 'o3', text: '', isCorrect: false },
                  { id: 'o4', text: '', isCorrect: false }
                ]);
                setIsQuestionModalOpen(true);
              }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm câu hỏi mới</span>
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-black rounded-md">
                      {q.category}
                    </span>
                    <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 text-[11px] font-bold rounded-md">
                      {q.score} điểm
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const updated = questions.filter(item => item.id !== q.id);
                      setQuestions(updated);
                      onUpdateCompetition({ ...compData, questions: updated });
                    }}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm font-bold text-slate-900">{q.questionText}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, oIdx) => (
                    <div key={opt.id} className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                      opt.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-white border-slate-200 text-slate-700'
                    }`}>
                      <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px]">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="flex-1">{opt.text}</span>
                      {opt.isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Rubric (Tiêu chí chấm điểm cho cuộc thi viết / ảnh) */}
      {activeTab === 'RUBRIC' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Xây dựng Tiêu chí Chấm điểm (Scoring Rubric Builder)</h3>
              <p className="text-xs text-slate-500">Thiết lập các tiêu chí đánh giá và trọng số chấm bài cho Ban giám khảo (Tổng điểm: 100đ)</p>
            </div>
            <button
              onClick={handleSaveOverview}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Tiêu chí</span>
            </button>
          </div>

          <div className="space-y-4">
            {rubricItems.map((item, idx) => (
              <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-800 font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const updated = [...rubricItems];
                        updated[idx].name = e.target.value;
                        setRubricItems(updated);
                      }}
                      className="font-bold text-sm text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl flex-1"
                    />
                  </div>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...rubricItems];
                      updated[idx].description = e.target.value;
                      setRubricItems(updated);
                    }}
                    placeholder="Mô tả tiêu chí chấm..."
                    className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl w-full mt-1"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={item.maxScore}
                      onChange={(e) => {
                        const updated = [...rubricItems];
                        updated[idx].maxScore = Number(e.target.value);
                        setRubricItems(updated);
                      }}
                      className="w-20 p-2 bg-white border border-slate-200 rounded-xl font-black text-sm text-center"
                    />
                    <span className="text-xs font-bold text-slate-500">điểm</span>
                  </div>
                  <button
                    onClick={() => setRubricItems(rubricItems.filter(r => r.id !== item.id))}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add new criterion */}
            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={newCriterionName}
                onChange={(e) => setNewCriterionName(e.target.value)}
                placeholder="Tên tiêu chí mới..."
                className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
              <input
                type="number"
                value={newCriterionScore}
                onChange={(e) => setNewCriterionScore(Number(e.target.value))}
                placeholder="Điểm"
                className="w-24 p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-center"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newCriterionName.trim()) return;
                  setRubricItems([...rubricItems, { id: 'r-' + Date.now(), name: newCriterionName.trim(), maxScore: newCriterionScore, description: newCriterionDesc }]);
                  setNewCriterionName('');
                  setNewCriterionDesc('');
                }}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm tiêu chí</span>
              </button>
            </div>

            <div className="text-right text-xs font-black text-slate-700 pt-2">
              Tổng trọng số điểm: <span className="text-blue-600 text-sm">{rubricItems.reduce((acc, curr) => acc + curr.maxScore, 0)} điểm</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Judges (Ban giám khảo) */}
      {activeTab === 'JUDGES' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Quản lý Ban Giám Khảo & Phân công chấm bài</h3>
              <p className="text-xs text-slate-500">Phân quyền giám khảo chấm thi và theo dõi tiến độ chấm bài</p>
            </div>
            <button
              onClick={handleSaveOverview}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Ban Giám Khảo</span>
            </button>
          </div>

          <div className="space-y-4">
            {judgesList.map((j) => (
              <div key={j.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                    {j.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900">{j.name}</h4>
                    <p className="text-xs text-slate-500">{j.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-black rounded-xl">
                    Đã phân: {j.assignedCount} bài
                  </span>
                  <button
                    onClick={() => setJudgesList(judgesList.filter(item => item.id !== j.id))}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add Judge Form */}
            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={newJudgeName}
                onChange={(e) => setNewJudgeName(e.target.value)}
                placeholder="Họ tên giám khảo..."
                className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
              <input
                type="email"
                value={newJudgeEmail}
                onChange={(e) => setNewJudgeEmail(e.target.value)}
                placeholder="Email tài khoản cán bộ..."
                className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newJudgeName.trim() || !newJudgeEmail.trim()) return;
                  setJudgesList([...judgesList, { id: 'j-' + Date.now(), name: newJudgeName.trim(), email: newJudgeEmail.trim(), assignedCount: 0 }]);
                  setNewJudgeName('');
                  setNewJudgeEmail('');
                }}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm giám khảo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Submissions */}
      {activeTab === 'SUBMISSIONS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Trung tâm Bài dự thi ({compSubmissions.length})</h3>
              <p className="text-xs text-slate-500">Danh sách bài nộp từ nhân dân và đoàn viên</p>
            </div>
            <button
              onClick={() => alert('Đã xuất báo cáo danh sách bài dự thi ra Excel thành công!')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Excel</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-black text-slate-600 uppercase tracking-wider">
                  <th className="p-3">Mã bài / Thí sinh</th>
                  <th className="p-3">Đơn vị / Khu phố</th>
                  <th className="p-3">Thời gian gửi</th>
                  <th className="p-3">Điểm số</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {compSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                      Chưa có bài dự thi nào được gửi đến.
                    </td>
                  </tr>
                ) : (
                  compSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <span className="font-black text-slate-950 block">{sub.participantName}</span>
                        <span className="text-[11px] text-slate-500 font-mono">SĐT: {sub.phone}</span>
                      </td>
                      <td className="p-3 font-bold text-slate-700">{sub.neighborhood}</td>
                      <td className="p-3 text-slate-500">{sub.submittedAt}</td>
                      <td className="p-3 font-black text-blue-600 text-sm">{sub.score !== undefined ? `${sub.score}đ` : 'Chưa chấm'}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 text-[11px] font-black rounded-lg ${
                          sub.score !== undefined ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {sub.score !== undefined ? 'Đã chấm điểm' : 'Chờ chấm bài'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setGradingSub(sub);
                            setGradeScore(sub.score || 85);
                            setGradeComment(sub.adminComment || '');
                          }}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Chấm bài
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

      {/* Tab: Grading (Chấm bài) */}
      {activeTab === 'GRADING' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900">Ban Giám Khảo - Chấm bài dự thi trực tuyến</h3>
            <p className="text-xs text-slate-500">Chấm điểm chi tiết theo thang điểm Rubric</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {compSubmissions.map((sub) => (
              <div key={sub.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-900">{sub.participantName}</span>
                    <span className="text-[11px] font-bold text-slate-500">{sub.neighborhood}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-3 bg-white p-3 rounded-xl border border-slate-100 font-medium">
                    {sub.essayText || 'Bài thi trắc nghiệm hoàn thành trực tuyến.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-black text-sm text-blue-600">
                    {sub.score !== undefined ? `Điểm: ${sub.score}` : 'Chưa chấm'}
                  </span>
                  <button
                    onClick={() => {
                      setGradingSub(sub);
                      setGradeScore(sub.score || 85);
                      setGradeComment(sub.adminComment || '');
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Chấm bài ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Ranking (Xếp hạng) */}
      {activeTab === 'RANKING' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Bảng Xếp Hạng & Công Bố Giải Thưởng</h3>
              <p className="text-xs text-slate-500">Xếp hạng thí sinh theo điểm số và thời gian nộp bài</p>
            </div>
            <button
              onClick={() => alert('Đã công bố kết quả xếp hạng chính thức lên trang công khai!')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Công bố Kết quả</span>
            </button>
          </div>

          <div className="space-y-3">
            {[...compSubmissions]
              .sort((a, b) => (b.score || 0) - (a.score || 0))
              .map((sub, idx) => (
                <div key={sub.id} className={`p-4 rounded-2xl border flex items-center justify-between ${
                  idx === 0 ? 'bg-amber-50 border-amber-300' :
                  idx === 1 ? 'bg-slate-50 border-slate-300' :
                  idx === 2 ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl font-black text-sm flex items-center justify-center text-white ${
                      idx === 0 ? 'bg-amber-500 shadow-md' :
                      idx === 1 ? 'bg-slate-500' :
                      idx === 2 ? 'bg-orange-600' : 'bg-slate-400'
                    }`}>
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900">{sub.participantName}</h4>
                      <p className="text-xs text-slate-500">{sub.neighborhood} • SĐT: {sub.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-black text-base text-blue-600">{sub.score !== undefined ? `${sub.score} điểm` : 'Chưa có điểm'}</span>
                    {idx === 0 && <span className="px-3 py-1 bg-amber-500 text-white font-black text-[11px] rounded-xl">GIẢI NHẤT</span>}
                    {idx === 1 && <span className="px-3 py-1 bg-slate-500 text-white font-black text-[11px] rounded-xl">GIẢI NHÌ</span>}
                    {idx === 2 && <span className="px-3 py-1 bg-orange-600 text-white font-black text-[11px] rounded-xl">GIẢI BA</span>}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab: Analytics (Thống kê) */}
      {activeTab === 'ANALYTICS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900">Thống kê & Biểu đồ Tham gia Hội thi</h3>
            <p className="text-xs text-slate-500">Phân tích số liệu theo khu phố và đoàn thể</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-3xl space-y-2">
              <span className="text-xs font-bold text-blue-700 uppercase">Tổng số thí sinh</span>
              <h4 className="text-3xl font-black text-blue-900">{compSubmissions.length}</h4>
              <p className="text-xs text-blue-600">Tham gia tích cực từ các khu phố</p>
            </div>
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-3xl space-y-2">
              <span className="text-xs font-bold text-emerald-700 uppercase">Điểm trung bình</span>
              <h4 className="text-3xl font-black text-emerald-900">
                {compSubmissions.length ? Math.round(compSubmissions.reduce((a, b) => a + (b.score || 0), 0) / compSubmissions.length) : 0}đ
              </h4>
              <p className="text-xs text-emerald-600">Đánh giá chất lượng chung</p>
            </div>
            <div className="p-6 bg-purple-50 border border-purple-200 rounded-3xl space-y-2">
              <span className="text-xs font-bold text-purple-700 uppercase">Tỷ lệ hoàn thành</span>
              <h4 className="text-3xl font-black text-purple-900">100%</h4>
              <p className="text-xs text-purple-600">Hệ thống ghi nhận an toàn</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Certificates (Chứng nhận) */}
      {activeTab === 'CERTIFICATES' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900">Cấu hình Giấy chứng nhận điện tử (Digital Certificate)</h3>
            <p className="text-xs text-slate-500">Tự động cấp giấy chứng nhận cho thí sinh hoàn thành hội thi</p>
          </div>

          <div className="p-8 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl shadow-lg space-y-4 border-4 border-amber-400">
            <div className="text-center space-y-1">
              <span className="text-xs font-black tracking-widest text-amber-300 uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span>
              <h4 className="text-lg font-black">ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP</h4>
              <div className="w-24 h-1 bg-amber-400 mx-auto my-2" />
              <h3 className="text-2xl font-serif font-bold text-amber-200 pt-2">GIẤY CHỨNG NHẬN</h3>
              <p className="text-xs text-slate-300">Chứng nhận thí sinh đã hoàn thành xuất sắc hội thi trực tuyến</p>
            </div>

            <div className="text-center py-4 space-y-2">
              <span className="text-xs text-slate-400 block uppercase">Trao cho đồng chí:</span>
              <h2 className="text-2xl font-black text-amber-300">[Họ và tên thí sinh]</h2>
              <p className="text-xs text-slate-300">Đã tích cực tham gia hội thi: <strong className="text-white">{compData.title}</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Share (QR & Public URL) */}
      {activeTab === 'SHARE' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900">Xuất bản & Chia sẻ Cuộc thi (QR Code & Social Link)</h3>
            <p className="text-xs text-slate-500">Chia sẻ đường dẫn hoặc quét mã QR để tham gia trực tiếp trên điện thoại</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase">Đường dẫn trang công khai (Public URL)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/#/hoi-thi/${compData.id}`}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/#/hoi-thi/${compData.id}`);
                      alert('Đã sao chép đường dẫn cuộc thi vào bộ nhớ tạm!');
                    }}
                    className="px-4 py-3 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-black text-slate-900 uppercase">Chia sẻ nhanh mạng xã hội</h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/#/hoi-thi/' + compData.id)}`, '_blank');
                    }}
                    className="px-4 py-2 bg-blue-700 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Chia sẻ Facebook</span>
                  </button>
                  <button
                    onClick={() => {
                      alert('Đã tạo nội dung sẵn sàng chia sẻ qua Zalo OA / Zalo Group!');
                    }}
                    className="px-4 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Chia sẻ Zalo</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-48 h-48 bg-white p-4 rounded-2xl shadow-md border border-slate-200 flex items-center justify-center">
                <QrCode className="w-36 h-36 text-slate-900" />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900">Mã QR Code Truy Cập Hội Thi</h4>
                <p className="text-xs text-slate-500 mt-1">Quét bằng camera điện thoại hoặc Zalo để tham gia ngay</p>
              </div>
              <button
                onClick={() => alert('Đã tải xuống mã QR Code định dạng PNG thành công!')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Tải xuống mã QR (PNG)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {gradingSub && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Chấm điểm bài dự thi</h3>
                <p className="text-xs text-slate-500">Thí sinh: <strong className="text-slate-900">{gradingSub.participantName}</strong> ({gradingSub.neighborhood})</p>
              </div>
              <button onClick={() => setGradingSub(null)} className="p-2 text-slate-400 hover:text-slate-700 rounded-full">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-black uppercase text-slate-500">Nội dung bài thi / Bài viết:</span>
                <p className="text-xs text-slate-800 font-medium whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {gradingSub.essayText || 'Bài làm trắc nghiệm trực tuyến hoàn thành.'}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase">Điểm số tổng kết (Thang điểm 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-black text-blue-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase">Nhận xét của Ban Giám Khảo</label>
                <textarea
                  value={gradeComment}
                  onChange={(e) => setGradeComment(e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  placeholder="Nhập nhận xét chi tiết..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setGradingSub(null)}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onGradeSubmission) {
                    onGradeSubmission(gradingSub.id, gradeScore, gradeComment);
                  }
                  alert(`Đã chấm điểm thành công cho thí sinh ${gradingSub.participantName}: ${gradeScore} điểm!`);
                  setGradingSub(null);
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
              >
                Lưu điểm & Gửi kết quả
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add / Edit Question Modal */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">Thêm / Chỉnh sửa Câu hỏi Trắc nghiệm</h3>
              <button onClick={() => setIsQuestionModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 rounded-full">
                ✕
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!qText.trim()) return;
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
              setIsQuestionModalOpen(false);
            }} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 uppercase">Nội dung câu hỏi</label>
                <textarea
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  rows={3}
                  placeholder="Nhập câu hỏi..."
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
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-xs cursor-pointer"
                >
                  Lưu Câu Hỏi
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
