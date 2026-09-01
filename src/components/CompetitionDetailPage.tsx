import React, { useState, useEffect } from 'react';
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
  Sparkles
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
  
  // Quiz states
  const [quizStarted, setQuizStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: number }>({});
  const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState((competition.timeLimitMinutes || 15) * 60);

  // Essay states
  const [essayText, setEssayText] = useState('');
  const [essaySubmitted, setEssaySubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [competition.id]);

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

  const triviaQuestions = [
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
      options: ['TP. Thủ Dầu Một', 'TP. Dĩ An', 'TP. Thuận An', 'TP. Bến Cát'],
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
      options: ['Cấp Khu phố / Ấp / Dân cư', 'Cấp Tỉnh / Thành phố', 'Cấp Trung ương', 'Cấp Bộ'],
      correctAnswer: 0
    }
  ];

  const handleConfirmStartQuiz = () => {
    if (!participantName.trim() || !phone.trim()) {
      alert('Vui lòng nhập đầy đủ Họ tên và Số điện thoại thi sinh!');
      return;
    }
    setQuizStarted(true);
  };

  const handleAutoSubmitQuiz = () => {
    handleSubmitQuiz();
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    triviaQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        score += 20;
      }
    });

    setQuizResult({ score, total: 100 });

    const newSub: CompetitionSubmission = {
      id: 'sub-' + Date.now(),
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
    if (!participantName.trim() || !phone.trim() || !essayText.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin tác giả và nội dung bài viết!');
      return;
    }

    const newSub: CompetitionSubmission = {
      id: 'sub-' + Date.now(),
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-6xl mx-auto px-4 py-6 space-y-8"
    >
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 flex-wrap">
          <button 
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            Trang chủ
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button 
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 hover:underline font-bold cursor-pointer"
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
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-md">
        <div className="relative h-48 sm:h-64 w-full">
          <img
            src={competition.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200'}
            alt={competition.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 space-y-2">
            <span className="px-3 py-1 bg-blue-600 text-white font-black text-xs rounded-xl uppercase tracking-wider inline-block">
              {competition.type === 'TRIVIA' ? 'Hội thi Trắc nghiệm Trực tuyến' : 'Cuộc thi Viết Cảm nhận'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {competition.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200/90 max-w-3xl leading-relaxed">
              {competition.description}
            </p>
          </div>
        </div>
      </div>

      {/* TRIVIA WORKSPACE */}
      {competition.type === 'TRIVIA' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-8">
          
          {/* STEP 1: Candidate Entry Form before quiz */}
          {!quizStarted && !quizResult && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-5 bg-blue-50/80 rounded-2xl border border-blue-200 text-slate-800 text-xs space-y-2">
                <p className="font-extrabold text-blue-900 text-sm flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-blue-600" />
                  <span>Thể lệ &amp; Hướng dẫn dự thi:</span>
                </p>
                <p className="leading-relaxed text-slate-700">{competition.rules}</p>
                <div className="pt-2 flex items-center gap-4 text-blue-800 font-bold border-t border-blue-200">
                  <span>Thời gian làm bài: {competition.timeLimitMinutes || 15} phút</span>
                  <span>•</span>
                  <span>Tổng số câu hỏi: {competition.totalQuestions || 5} câu</span>
                </div>
              </div>

              <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Thông tin thí sinh tham gia</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Họ và tên thí sinh (*)</label>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={participantName}
                      onChange={(e) => setParticipantName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Số điện thoại (*)</label>
                    <input
                      type="text"
                      placeholder="0908xxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
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
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-xs transition-all mt-4 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-5 h-5 text-white" />
                  <span>Sẵn sàng &amp; Bắt đầu làm bài thi</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ACTIVE QUIZ QUESTIONS WORKSPACE */}
          {quizStarted && !quizResult && (
            <div className="space-y-8">
              {/* Sticky Top Status Bar */}
              <div className="sticky top-16 z-30 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-xs text-blue-400">Thí sinh: {participantName}</p>
                  <p className="text-[11px] text-slate-300">{neighborhood}</p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-extrabold text-sm rounded-xl shadow-xs animate-pulse">
                  <Timer className="w-5 h-5 text-white" />
                  <span>{formatTimer(timeLeftSeconds)}</span>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {triviaQuestions.map((q, idx) => (
                  <div key={q.id} className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4">
                    <p className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                      <span className="text-blue-600 font-black mr-2">Câu {idx + 1}:</span>
                      {q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAnswers[q.id] === optIdx;
                        return (
                          <label
                            key={optIdx}
                            onClick={() => setUserAnswers({ ...userAnswers, [q.id]: optIdx })}
                            className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer transition-all flex items-center gap-3 ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 font-bold text-xs ${
                              isSelected ? 'bg-white text-blue-600 border-white' : 'border-slate-300 text-slate-500'
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

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={handleSubmitQuiz}
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>Nộp bài thi ngay</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: RESULT SCREEN */}
          {quizResult && (
            <div className="max-w-lg mx-auto text-center py-10 space-y-6 bg-slate-50 p-8 rounded-3xl border border-slate-200">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-xs border border-blue-200">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">Kết quả bài thi trắc nghiệm</h3>
                <p className="text-xs text-slate-500">Chúc mừng bạn đã hoàn thành bài thi tìm hiểu trực tuyến!</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 inline-block px-8 shadow-2xs">
                <span className="text-4xl font-black text-blue-600">{quizResult.score}</span>
                <span className="text-sm font-bold text-slate-400"> / 100 Điểm</span>
              </div>

              <p className="text-xs text-slate-600">
                Thí sinh: <strong className="text-slate-900">{participantName}</strong> • {neighborhood}
              </p>

              <button
                onClick={onBack}
                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
              >
                Trở về danh sách Hội thi
              </button>
            </div>
          )}

        </div>
      )}

      {/* ESSAY COMPETITION WORKSPACE */}
      {competition.type === 'WRITING' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-6">
          {!essaySubmitted ? (
            <form onSubmit={handleSubmitEssay} className="max-w-3xl mx-auto space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FileEdit className="w-5 h-5 text-blue-600" />
                  <span>Soạn thảo bài dự thi viết</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">Bài viết dự thi sẽ được Ban giám khảo MTTQ phường chấm điểm và trao giải.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Họ tên tác giả (*)</label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Số điện thoại (*)</label>
                  <input
                    type="text"
                    placeholder="0908xxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Khu phố (*)</label>
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
                  placeholder="Nhập nội dung bài viết cảm nhận, câu chuyện gương sáng cộng đồng, kỷ niệm công tác Mặt trận..."
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  className="w-full text-xs sm:text-sm p-4 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-hidden leading-relaxed font-normal"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Nộp bài dự thi viết</span>
              </button>
            </form>
          ) : (
            <div className="max-w-md mx-auto text-center py-10 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-extrabold text-slate-900">Gửi bài dự thi viết thành công!</h3>
              <p className="text-xs text-slate-600">
                Bài viết của tác giả <strong className="text-slate-900">{participantName}</strong> ({neighborhood}) đã được tiếp nhận thành công.
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
