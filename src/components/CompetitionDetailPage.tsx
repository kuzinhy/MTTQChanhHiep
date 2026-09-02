import React, { useState, useEffect, useRef } from 'react';
import { Competition, CompetitionSubmission } from '../types';
import { 
  ArrowLeft, 
  Trophy, 
  Award, 
  Timer, 
  FileEdit, 
  Send, 
  CheckCircle2, 
  ChevronRight, 
  User, 
  MapPin, 
  ShieldCheck, 
  HelpCircle,
  Clock,
  Sparkles,
  Download,
  Share2,
  QrCode,
  RotateCcw,
  AlertTriangle,
  BookmarkCheck
} from 'lucide-react';
import { motion } from 'motion/react';

interface CompetitionDetailPageProps {
  competition: Competition;
  neighborhoods?: string[];
  triviaQuestions?: any[];
  onAddSubmission?: (sub: CompetitionSubmission) => void;
  onBack: () => void;
}

export const CompetitionDetailPage: React.FC<CompetitionDetailPageProps> = ({
  competition,
  neighborhoods = [
    'Tương Bình Hiệp 1', 'Tương Bình Hiệp 2', 'Tương Bình Hiệp 3', 'Tương Bình Hiệp 4', 'Tương Bình Hiệp 5', 'Tương Bình Hiệp 6', 'Tương Bình Hiệp 7',
    'Hiệp An 7', 'Hiệp An 8', 'Hiệp An 9',
    'Định Hòa 1', 'Định Hòa 2', 'Định Hòa 3', 'Định Hòa 4', 'Định Hòa 5', 'Định Hòa 6', 'Định Hòa 7', 'Định Hòa 8',
    'Mỹ Hảo',
    'Chánh Mỹ 1', 'Chánh Mỹ 2'
  ],
  onAddSubmission,
  onBack,
}) => {
  // Candidate form states
  const [participantName, setParticipantName] = useState('');
  const [phone, setPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState(neighborhoods[0] || 'Khu phố 1');
  const [submissionId, setSubmissionId] = useState('');
  
  // Quiz states
  const [quizStarted, setQuizStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: number }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<{ [key: string]: boolean }>({});
  const [quizResult, setQuizResult] = useState<{ score: number; total: number; correctCount: number; completionTime: string } | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState((competition.timeLimitMinutes || 15) * 60);
  const [showCertificate, setShowCertificate] = useState(false);

  // Essay states
  const [essayText, setEssayText] = useState('');
  const [essaySubmitted, setEssaySubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [competition.id]);

  // Anti-cheat / warn on unload if test is ongoing
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (quizStarted && !quizResult) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [quizStarted, quizResult]);

  // Timer effect for quiz
  useEffect(() => {
    if (!quizStarted || quizResult) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [quizStarted, quizResult]);

  const defaultTriviaQuestions = [
    {
      id: 'q1',
      question: 'Ngày truyền thống Mặt trận Tổ quốc Việt Nam là ngày tháng năm nào?',
      options: ['18/11/1930', '02/09/1945', '19/05/1890', '03/02/1930'],
      correctAnswer: 0
    },
    {
      id: 'q2',
      question: 'Cuộc vận động toàn dân đoàn kết xây dựng nông thôn mới, đô thị văn minh do cơ quan nào chủ trì phát động?',
      options: ['Ủy ban Mặt trận Tổ quốc Việt Nam', 'Hội Liên hiệp Phụ nữ', 'Đoàn Thanh niên Cộng sản', 'Công đoàn Việt Nam'],
      correctAnswer: 0
    },
    {
      id: 'q3',
      question: 'Đơn vị hành chính Phường Chánh Hiệp trực thuộc thành phố nào?',
      options: ['Thành phố Hồ Chí Minh', 'TP. Hà Nội', 'TP. Đà Nẵng', 'TP. Cần Thơ'],
      correctAnswer: 0
    },
    {
      id: 'q4',
      question: 'Quỹ "Vì người nghèo" do MTTQ phát động nhằm mục đích chính là gì?',
      options: [
        'Hỗ trợ xây nhà đại đoàn kết, trao học bổng, chăm lo Tết & trợ cấp khó khăn',
        'Chi phí đầu tư cơ sở hạ tầng thương mại',
        'Kinh doanh tạo lợi nhuận',
        'Tất cả các ý trên'
      ],
      correctAnswer: 0
    },
    {
      id: 'q5',
      question: 'Ban Công tác Mặt trận được thành lập ở cấp nào ở địa phương?',
      options: ['Cấp Khu phố / Ấp / Tổ dân phố', 'Cấp Tỉnh / Thành phố', 'Cấp Trung ương', 'Cấp Bộ'],
      correctAnswer: 0
    }
  ];

  const activeQuestions = defaultTriviaQuestions;

  const handleConfirmStartQuiz = () => {
    setFormError(null);
    if (!participantName.trim() || !phone.trim()) {
      setFormError('Vui lòng nhập đầy đủ Họ tên và Số điện thoại thí sinh để tiếp tục!');
      return;
    }
    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      setFormError('Số điện thoại không hợp lệ. Vui lòng nhập từ 9-11 số!');
      return;
    }
    setSubmissionId('MTTQ-CH-' + Math.floor(100000 + Math.random() * 900000));
    setQuizStarted(true);
  };

  const handleAutoSubmitQuiz = () => {
    handleSubmitQuiz();
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    activeQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / activeQuestions.length) * 100);
    const timeSpentSec = (competition.timeLimitMinutes || 15) * 60 - timeLeftSeconds;
    const completionTime = `${Math.floor(timeSpentSec / 60)} phút ${timeSpentSec % 60} giây`;

    setQuizResult({ 
      score, 
      total: 100, 
      correctCount, 
      completionTime 
    });

    const subId = submissionId || 'MTTQ-CH-' + Date.now().toString().slice(-6);
    const newSub: CompetitionSubmission = {
      id: subId,
      competitionId: competition.id,
      participantName,
      phone,
      neighborhood,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      score,
      status: 'GRADED'
    };
    if (onAddSubmission) {
      onAddSubmission(newSub);
    }
  };

  const handleSubmitEssay = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!participantName.trim() || !phone.trim() || !essayText.trim()) {
      setFormError('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Nội dung bài thi cảm nhận!');
      return;
    }

    const subId = 'MTTQ-CH-ESSAY-' + Math.floor(100000 + Math.random() * 900000);
    setSubmissionId(subId);

    const newSub: CompetitionSubmission = {
      id: subId,
      competitionId: competition.id,
      participantName,
      phone,
      neighborhood,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      essayText,
      status: 'PENDING_GRADING'
    };
    if (onAddSubmission) {
      onAddSubmission(newSub);
    }
    setEssaySubmitted(true);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const toggleFlag = (qId: string) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-6xl mx-auto px-4 py-6 space-y-8"
    >
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 flex-wrap">
          <button 
            onClick={onBack}
            className="text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            Trang chủ
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button 
            onClick={onBack}
            className="text-blue-700 hover:text-blue-900 hover:underline font-bold cursor-pointer"
          >
            Hội thi trực tuyến
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-extrabold truncate max-w-xs sm:max-w-md">
            {competition.title}
          </span>
        </div>

        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4 text-slate-700" />
          <span>Quay lại danh sách Hội thi</span>
        </button>
      </div>

      {/* Banner Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 border border-blue-800 text-white shadow-md">
        <div className="relative h-48 sm:h-64 w-full">
          <img
            src={competition.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200'}
            alt={competition.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/70 to-transparent" />
          
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 space-y-2">
            <span className="px-3 py-1 bg-cyan-400 text-blue-950 font-black text-xs rounded-xl uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              {competition.type === 'TRIVIA' ? 'Hội thi Trắc nghiệm Trực tuyến' : 'Cuộc thi Viết Cảm nhận'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {competition.title}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-3xl leading-relaxed font-medium">
              {competition.description}
            </p>
          </div>
        </div>
      </div>

      {/* TRIVIA WORKSPACE */}
      {competition.type === 'TRIVIA' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
          
          {/* STEP 1: Candidate Entry Form before quiz */}
          {!quizStarted && !quizResult && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-5 bg-blue-50/80 rounded-2xl border border-blue-200 text-slate-800 text-xs space-y-2">
                <p className="font-extrabold text-blue-900 text-sm flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-cyan-600" />
                  <span>Thể lệ &amp; Quy chế hội thi trực tuyến:</span>
                </p>
                <p className="leading-relaxed text-slate-700">{competition.rules}</p>
                <div className="pt-2 flex items-center gap-4 text-blue-800 font-bold border-t border-blue-200">
                  <span>⏱ Thời gian làm bài: {competition.timeLimitMinutes || 15} phút</span>
                  <span>•</span>
                  <span>📝 Tổng số câu hỏi: {activeQuestions.length} câu</span>
                  <span>•</span>
                  <span>🎖 Đạt từ 80 điểm trở lên được cấp Chứng nhận điện tử</span>
                </div>
              </div>

              <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Thông tin thí sinh tham gia</span>
                </h3>

                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-semibold">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Họ và tên thí sinh (*)</label>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={participantName}
                      onChange={(e) => {
                        setParticipantName(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Số điện thoại (*)</label>
                    <input
                      type="text"
                      placeholder="0908xxxxxx"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Khu phố cư trú (*)</label>
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                  >
                    {neighborhoods.map(kp => (
                      <option key={kp} value={kp}>{kp}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleConfirmStartQuiz}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-all mt-4 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-5 h-5 text-cyan-300" />
                  <span>Sẵn sàng &amp; Bắt đầu làm bài thi</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ACTIVE QUIZ QUESTIONS WORKSPACE */}
          {quizStarted && !quizResult && (
            <div className="space-y-8">
              {/* Sticky Top Status Bar */}
              <div className="sticky top-16 z-30 bg-gradient-to-r from-slate-900 to-blue-950 text-white p-4 rounded-2xl border border-blue-900 shadow-lg flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="font-extrabold text-xs text-cyan-300">Thí sinh: {participantName}</p>
                  <p className="text-[11px] text-slate-300">{neighborhood} • Mã thi: {submissionId}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                    <span>Đã làm: <strong>{answeredCount}/{activeQuestions.length}</strong> câu</span>
                  </div>

                  <div className={`flex items-center gap-2 px-4 py-2 text-white font-extrabold text-sm rounded-xl shadow-xs ${
                    timeLeftSeconds < 120 ? 'bg-red-600 animate-pulse' : 'bg-blue-600'
                  }`}>
                    <Timer className="w-5 h-5 text-cyan-300" />
                    <span>{formatTimer(timeLeftSeconds)}</span>
                  </div>
                </div>
              </div>

              {/* Progress Tracker Bar */}
              <div className="flex items-center gap-2 flex-wrap bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-600 mr-2">Tiến độ câu hỏi:</span>
                {activeQuestions.map((q, idx) => {
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isFlagged = flaggedQuestions[q.id];
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        const el = document.getElementById(`question-${q.id}`);
                        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center relative cursor-pointer ${
                        isAnswered
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-700 hover:border-blue-400'
                      }`}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-white" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {activeQuestions.map((q, idx) => (
                  <div 
                    key={q.id} 
                    id={`question-${q.id}`}
                    className="p-6 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-4 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug flex-1">
                        <span className="text-blue-700 font-black mr-2">Câu {idx + 1}:</span>
                        {q.question}
                      </p>
                      <button
                        type="button"
                        onClick={() => toggleFlag(q.id)}
                        className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                          flaggedQuestions[q.id]
                            ? 'bg-cyan-100 text-cyan-800 border-cyan-300'
                            : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800'
                        }`}
                        title="Đánh dấu xem lại sau"
                      >
                        <BookmarkCheck className="w-4 h-4 text-cyan-600" />
                        <span className="hidden sm:inline text-[11px]">Đánh dấu</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAnswers[q.id] === optIdx;
                        return (
                          <label
                            key={optIdx}
                            onClick={() => setUserAnswers({ ...userAnswers, [q.id]: optIdx })}
                            className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer transition-all flex items-center gap-3 ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 font-bold text-xs ${
                              isSelected ? 'bg-white text-blue-700 border-white' : 'border-slate-300 text-slate-500'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-4">
                <div className="text-xs text-slate-600 font-medium">
                  Đã trả lời <strong className="text-blue-700">{answeredCount}</strong> / {activeQuestions.length} câu hỏi
                </div>
                <button
                  onClick={handleSubmitQuiz}
                  className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>Nộp bài thi ngay</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: RESULT SCREEN & CERTIFICATE */}
          {quizResult && (
            <div className="max-w-2xl mx-auto text-center py-6 space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl border border-blue-200 space-y-6 shadow-sm">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-md border-2 border-blue-400">
                  <Trophy className="w-10 h-10 text-cyan-300" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">KẾT QUẢ BÀI THI TRỰC TUYẾN</h3>
                  <p className="text-xs text-slate-600">Ủy ban MTTQ Việt Nam Phường Chánh Hiệp ghi nhận kết quả bài thi</p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-blue-200 inline-block px-10 shadow-sm">
                  <span className="text-4xl font-black text-blue-700">{quizResult.score}</span>
                  <span className="text-sm font-bold text-slate-400"> / 100 Điểm</span>
                  <div className="text-xs text-emerald-700 font-bold mt-1">
                    Đúng {quizResult.correctCount}/{activeQuestions.length} câu • Thời gian: {quizResult.completionTime}
                  </div>
                </div>

                <div className="text-xs text-slate-700 space-y-1 bg-white/80 p-4 rounded-xl border border-blue-200/60">
                  <p>Thí sinh: <strong className="text-slate-900">{participantName}</strong></p>
                  <p>Số điện thoại: <strong>{phone}</strong> • {neighborhood}</p>
                  <p className="text-slate-500 text-[11px]">Mã tra cứu kết quả: <code className="font-mono font-bold text-blue-700">{submissionId}</code></p>
                </div>

                {/* Certificate Section */}
                {quizResult.score >= 60 && (
                  <div className="space-y-4 pt-4 border-t border-blue-200">
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-500" />
                      <span>Chúc mừng bạn đã đạt tiêu chuẩn cấp Giấy chứng nhận điện tử!</span>
                    </div>

                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <button
                        onClick={() => setShowCertificate(!showCertificate)}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
                      >
                        <Award className="w-4 h-4 text-cyan-300" />
                        <span>{showCertificate ? 'Thu gọn Giấy chứng nhận' : 'Xem Giấy chứng nhận'}</span>
                      </button>
                    </div>

                    {showCertificate && (
                      <div 
                        ref={certRef}
                        className="bg-gradient-to-b from-blue-50 via-white to-blue-50 p-8 rounded-3xl border-4 border-blue-400 text-slate-900 space-y-6 shadow-xl relative overflow-hidden"
                      >
                        <div className="text-center space-y-1">
                          <p className="text-[10px] uppercase font-bold text-blue-900 tracking-wider">ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP</p>
                          <h4 className="text-xl font-black text-blue-700 uppercase tracking-wide">GIẤY CHỨNG NHẬN</h4>
                          <p className="text-xs text-slate-500 italic">Chứng nhận hoàn thành tốt Hội thi tìm hiểu trực tuyến</p>
                        </div>

                        <div className="py-4 border-y-2 border-blue-200/80 space-y-2">
                          <p className="text-xs text-slate-600">Trân trọng trao tặng Ông/Bà:</p>
                          <h2 className="text-2xl font-black text-blue-800">{participantName}</h2>
                          <p className="text-xs text-slate-600">{neighborhood}</p>
                          <p className="text-xs text-slate-700 font-medium pt-2">
                            Đã tích cực tham gia và đạt thành tích xuất sắc trong:
                          </p>
                          <p className="text-sm font-bold text-slate-900">{competition.title}</p>
                          <p className="text-xs text-blue-700 font-extrabold">Điểm số: {quizResult.score}/100 Điểm</p>
                        </div>

                        <div className="flex items-center justify-between text-left text-[11px] text-slate-600 pt-2">
                          <div className="space-y-1">
                            <p>Mã chứng nhận: <strong className="font-mono">{submissionId}</strong></p>
                            <p>Ngày cấp: {new Date().toLocaleDateString('vi-VN')}</p>
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                              <ShieldCheck className="w-3 h-3" /> Xác thực điện tử
                            </span>
                          </div>

                          <div className="text-center space-y-1">
                            <p className="font-bold text-blue-900">TM. BAN THƯỜNG TRỰC</p>
                            <p className="text-[10px] text-slate-500">CHỦ TỊCH ỦY BAN MTTQ</p>
                            <div className="w-20 h-10 mx-auto flex items-center justify-center">
                              <span className="text-blue-700 font-serif italic text-xs font-bold">(Đã ký số)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4">
                  <button
                    onClick={onBack}
                    className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                  >
                    Trở về danh sách Hội thi
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ESSAY COMPETITION WORKSPACE */}
      {competition.type === 'WRITING' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
          {!essaySubmitted ? (
            <form onSubmit={handleSubmitEssay} className="max-w-3xl mx-auto space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FileEdit className="w-5 h-5 text-blue-600" />
                  <span>Soạn thảo bài dự thi viết cảm nhận</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">Bài viết dự thi sẽ được Ban giám khảo MTTQ phường thẩm định, chấm điểm và trao giải.</p>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Họ tên tác giả (*)</label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={participantName}
                    onChange={(e) => {
                      setParticipantName(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Số điện thoại (*)</label>
                  <input
                    type="text"
                    placeholder="0908xxxxxx"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Khu phố cư trú (*)</label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                >
                  {neighborhoods.map(kp => (
                    <option key={kp} value={kp}>{kp}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nội dung bài viết dự thi (*)</label>
                <textarea
                  rows={12}
                  placeholder="Nhập nội dung bài viết cảm nhận, câu chuyện gương sáng cộng đồng, kỷ niệm công tác Mặt trận, hiến kế xây dựng phường Chánh Hiệp văn minh, hiện đại..."
                  value={essayText}
                  onChange={(e) => {
                    setEssayText(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  className="w-full text-xs sm:text-sm p-4 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-hidden leading-relaxed font-normal"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Nộp bài dự thi viết</span>
              </button>
            </form>
          ) : (
            <div className="max-w-md mx-auto text-center py-10 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-extrabold text-slate-900">Gửi bài dự thi viết thành công!</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bài viết của tác giả <strong className="text-slate-900">{participantName}</strong> ({neighborhood}) đã được ghi nhận trên hệ thống với mã tra cứu: <code className="font-mono font-bold text-blue-700">{submissionId}</code>.
              </p>
              <button
                onClick={onBack}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Trở về danh sách Hội thi
              </button>
            </div>
          )}
        </div>
      )}

    </motion.div>
  );
};

