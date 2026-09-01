import React, { useMemo } from 'react';
import { Competition } from '../types';
import { sortCompetitionsNewestFirst } from '../lib/dateUtils';
import { Award, Timer, FileEdit, HelpCircle, Trophy } from 'lucide-react';

interface CompetitionsSectionProps {
  competitions: Competition[];
  onSelectCompetition: (comp: Competition) => void;
}

export const CompetitionsSection: React.FC<CompetitionsSectionProps> = ({
  competitions,
  onSelectCompetition
}) => {
  const sortedComps = useMemo(() => sortCompetitionsNewestFirst(competitions), [competitions]);

  return (
    <section className="space-y-6">
      <div className="bg-white/90 backdrop-blur-md text-slate-900 p-6 rounded-2xl shadow-2xs border border-blue-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900">HỘI THI TRỰC TUYẾN MẶT TRẬN &amp; AN SINH PHƯỜNG CHÁNH HIỆP</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Sân chơi tìm hiểu pháp luật, lịch sử Mặt trận, phong trào "An sinh xã hội - Vì người nghèo" &amp; Cuộc thi viết gương sáng cộng đồng
          </p>
        </div>
      </div>

      {/* Competitions Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedComps.map((comp) => (
          <div key={comp.id} className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="relative h-44 w-full bg-slate-900">
                <img
                  src={comp.bannerUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'}
                  alt={comp.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <span className={`absolute top-3 left-3 text-[10px] font-black uppercase px-2.5 py-1 rounded-md text-white ${
                  comp.status === 'ONGOING' ? 'bg-emerald-600' : 'bg-slate-600'
                }`}>
                  {comp.status === 'ONGOING' ? 'Đang diễn ra' : 'Đã kết thúc'}
                </span>
                <span className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-xs text-blue-400 text-[11px] font-bold px-2.5 py-1 rounded-md border border-slate-700">
                  {comp.type === 'TRIVIA' ? 'Trắc nghiệm trực tuyến' : 'Cuộc thi viết'}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {comp.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {comp.description}
                </p>

                <div className="pt-2 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5 text-blue-600" />
                    <span>Thời gian: {comp.startDate} &rarr; {comp.endDate}</span>
                  </div>
                  {comp.timeLimitMinutes && (
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                      <span>Thời gian làm bài: {comp.timeLimitMinutes} phút ({comp.totalQuestions} câu hỏi)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              {comp.type === 'TRIVIA' ? (
                <button
                  onClick={() => onSelectCompetition(comp)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Award className="w-4 h-4 text-white" />
                  <span>Tham gia Thi Trắc Nghiệm</span>
                </button>
              ) : (
                <button
                  onClick={() => onSelectCompetition(comp)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <FileEdit className="w-4 h-4 text-blue-400" />
                  <span>Nộp Bài Dự Thi Viết</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
