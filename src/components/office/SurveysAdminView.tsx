import React, { useState } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Calendar, 
  CheckCircle2, 
  BarChart3, 
  Eye, 
  Star, 
  Users,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { motion } from 'motion/react';
import { PublicSurvey } from '../../types';
import { INITIAL_SURVEYS } from '../../data/seedData';

export const SurveysAdminView: React.FC<{
  surveys?: PublicSurvey[];
  onTriggerToast?: (title: string, message: string) => void;
}> = ({
  surveys = INITIAL_SURVEYS,
  onTriggerToast
}) => {
  const [surveyList] = useState<PublicSurvey[]>(surveys);
  const [selectedSurvey, setSelectedSurvey] = useState<PublicSurvey>(surveys[0] || INITIAL_SURVEYS[0]);

  const handleExportResults = () => {
    if (onTriggerToast) {
      onTriggerToast('Xuất báo cáo khảo sát', `Đã xuất ${selectedSurvey.totalResponses} kết quả khảo sát ra bảng biểu thống kê.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
            <ClipboardList className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-black text-slate-900">Quản Trị Khảo Sát &amp; Thăm Dò Dư Luận</h2>
            <p className="text-xs text-slate-500 font-medium">Theo dõi mức độ hài lòng của công dân và phân tích số liệu thống kê</p>
          </div>
        </div>

        <button
          onClick={handleExportResults}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-white" />
          <span>Xuất báo cáo kết quả</span>
        </button>
      </div>

      {/* Survey Details & Results Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Surveys list */}
        <div className="lg:col-span-4 space-y-3">
          <div className="font-black text-xs uppercase tracking-wider text-slate-500 px-1">
            Các đợt khảo sát
          </div>
          {surveyList.map(s => (
            <div
              key={s.id}
              onClick={() => setSelectedSurvey(s)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedSurvey.id === s.id 
                  ? 'bg-blue-50/70 border-blue-500 shadow-md ring-1 ring-blue-500/20' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {s.status === 'OPEN' ? 'Đang diễn ra' : 'Đã kết thúc'}
                </span>
                <span className="text-xs font-black text-slate-700">
                  {s.totalResponses} phản hồi
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                {s.title}
              </h4>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Hạn chót: {s.endDate}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Detailed Analytics */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-blue-700 mb-1">
                Báo cáo Thống kê Kết quả Khảo sát
              </div>
              <h3 className="text-base font-black text-slate-900">
                {selectedSurvey.title}
              </h3>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Tổng lượt phản hồi</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{selectedSurvey.totalResponses}</div>
                <div className="text-[10px] text-emerald-700 font-bold">100% người dân xác thực</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Điểm hài lòng trung bình</div>
                <div className="text-2xl font-black text-amber-600 mt-1">4.8 / 5.0</div>
                <div className="text-[10px] text-slate-500 font-medium">96% Hài lòng và Rất hài lòng</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Đóng góp ý kiến mới</div>
                <div className="text-2xl font-black text-blue-700 mt-1">42</div>
                <div className="text-[10px] text-slate-500 font-medium">Kiến nghị cụ thể</div>
              </div>
            </div>

            {/* Question Breakdown */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Chi tiết tỷ lệ đánh giá theo câu hỏi
              </h4>

              {selectedSurvey.questions.map((q, qIndex) => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <div className="font-extrabold text-xs text-slate-900 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                      {qIndex + 1}
                    </span>
                    <span>{q.questionText}</span>
                  </div>

                  {q.type === 'RATING' && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-24 text-[11px] font-bold text-slate-600">5 Sao (Rất hài lòng)</span>
                        <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <span className="font-black text-slate-800 text-[11px]">78%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-24 text-[11px] font-bold text-slate-600">4 Sao (Hài lòng)</span>
                        <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: '18%' }}></div>
                        </div>
                        <span className="font-black text-slate-800 text-[11px]">18%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-24 text-[11px] font-bold text-slate-600">3 Sao (Bình thường)</span>
                        <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: '4%' }}></div>
                        </div>
                        <span className="font-black text-slate-800 text-[11px]">4%</span>
                      </div>
                    </div>
                  )}

                  {q.type === 'SINGLE' && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-28 text-[11px] font-bold text-slate-600">Đúng hẹn</span>
                        <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: '84%' }}></div>
                        </div>
                        <span className="font-black text-slate-800 text-[11px]">84%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-28 text-[11px] font-bold text-slate-600">Trước hẹn</span>
                        <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: '14%' }}></div>
                        </div>
                        <span className="font-black text-slate-800 text-[11px]">14%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-28 text-[11px] font-bold text-slate-600">Trễ có thông báo</span>
                        <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: '2%' }}></div>
                        </div>
                        <span className="font-black text-slate-800 text-[11px]">2%</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
