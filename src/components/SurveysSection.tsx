import React, { useState } from 'react';
import { 
  ClipboardList, 
  CheckCircle2, 
  Calendar, 
  Send, 
  Star, 
  BarChart3, 
  Users,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { PublicSurvey } from '../types';
import { INITIAL_SURVEYS } from '../data/seedData';

export const SurveysSection: React.FC<{
  surveys?: PublicSurvey[];
  onSurveySubmitted?: () => void;
}> = ({ 
  surveys = INITIAL_SURVEYS,
  onSurveySubmitted 
}) => {
  const [selectedSurvey, setSelectedSurvey] = useState<PublicSurvey>(surveys[0] || INITIAL_SURVEYS[0]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (questionId: string, rating: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: rating }));
  };

  const handleOptionChange = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleTextChange = (questionId: string, text: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: text }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      if (onSurveySubmitted) onSurveySubmitted();
    }, 700);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-300/30 text-xs font-black uppercase tracking-wider">
            <ClipboardList className="w-3.5 h-3.5 text-cyan-300" />
            <span>Thăm dò Dư luận &amp; Sự hài lòng</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Khảo Sát &amp; Lấy Ý Kiến Nhân Dân
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm font-medium leading-relaxed">
            Ý kiến đánh giá và đóng góp quý báu của Nhân dân là cơ sở quan trọng để Mặt trận Tổ quốc và Chính quyền Phường Chánh Hiệp không ngừng nâng cao chất lượng phục vụ và điều hành kinh tế - xã hội.
          </p>
        </div>
      </div>

      {/* Main Survey Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
        {submitted ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Cảm ơn Ông/Bà đã hoàn thành phiếu khảo sát!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Toàn bộ ý kiến đóng góp của Ông/Bà đã được hệ thống ghi nhận ẩn danh an toàn và tổng hợp vào báo cáo giám sát định kỳ của Ban Thường trực MTTQ Phường Chánh Hiệp.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setAnswers({});
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Gửi thêm phản hồi khác
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
            <div className="border-b border-slate-200 pb-6 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  Đang diễn ra
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  Hạn chót: {selectedSurvey.endDate}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {selectedSurvey.title}
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {selectedSurvey.description}
              </p>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {selectedSurvey.questions.map((q, idx) => (
                <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <label className="font-extrabold text-sm text-slate-900 leading-snug">
                      {q.questionText} {q.required && <span className="text-blue-600">*</span>}
                    </label>
                  </div>

                  {/* Rating Stars */}
                  {q.type === 'RATING' && (
                    <div className="flex items-center gap-3 pt-2">
                      {[1, 2, 3, 4, 5].map(star => {
                        const isSelected = (answers[q.id] || 0) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(q.id, star)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                              isSelected 
                                ? 'bg-amber-50 border-amber-400 text-amber-500 scale-105' 
                                : 'bg-white border-slate-200 text-slate-300 hover:text-amber-400'
                            }`}
                          >
                            <Star className={`w-6 h-6 ${isSelected ? 'fill-amber-400 text-amber-400' : ''}`} />
                            <span className="text-[10px] font-black text-slate-600">
                              {star === 5 ? 'Rất hài lòng' : star === 4 ? 'Hài lòng' : star === 3 ? 'Bình thường' : star === 2 ? 'Chưa hài lòng' : 'Không hài lòng'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Single Choice Options */}
                  {q.type === 'SINGLE' && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      {q.options.map((opt) => {
                        const isChecked = answers[q.id] === opt;
                        return (
                          <label
                            key={opt}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                              isChecked 
                                ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-xs' 
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              value={opt}
                              checked={isChecked}
                              onChange={() => handleOptionChange(q.id, opt)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                              required={q.required}
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Text Input */}
                  {q.type === 'TEXT' && (
                    <textarea
                      rows={3}
                      value={answers[q.id] || ''}
                      onChange={(e) => handleTextChange(q.id, e.target.value)}
                      placeholder="Nhập ý kiến đóng góp cụ thể của Ông/Bà tại đây..."
                      className="w-full text-xs p-3.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Privacy Assurance Banner */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 font-medium">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Phiếu khảo sát được bảo vệ quyền riêng tư theo Nghị định 13/2023/NĐ-CP. Thông tin phản hồi hoàn toàn ẩn danh.
              </span>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Đang gửi phiếu...' : 'Gửi Phiếu Khảo Sát'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
