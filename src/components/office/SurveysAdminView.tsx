import React, { useState } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Calendar, 
  CheckCircle2, 
  BarChart3, 
  PieChart as PieChartIcon,
  Eye, 
  Star, 
  Users, 
  Download, 
  FileSpreadsheet,
  TrendingUp,
  Award,
  Layers
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { PublicSurvey } from '../../types';
import { INITIAL_SURVEYS } from '../../data/seedData';

// Chart Color Palette
const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

export const SurveysAdminView: React.FC<{
  surveys?: PublicSurvey[];
  onTriggerToast?: (title: string, message: string) => void;
}> = ({
  surveys = INITIAL_SURVEYS,
  onTriggerToast
}) => {
  const [surveyList] = useState<PublicSurvey[]>(surveys);
  const [selectedSurvey, setSelectedSurvey] = useState<PublicSurvey>(surveys[0] || INITIAL_SURVEYS[0]);
  const [chartViewMode, setChartViewMode] = useState<'PIE' | 'BAR' | 'BOTH'>('BOTH');

  // Prepared data for Pie Chart (Mức độ hài lòng chung)
  const satisfactionPieData = [
    { name: 'Rất hài lòng (5★)', value: 78, count: 195 },
    { name: 'Hài lòng (4★)', value: 16, count: 40 },
    { name: 'Bình thường (3★)', value: 4, count: 10 },
    { name: 'Chưa hài lòng (1-2★)', value: 2, count: 5 }
  ];

  // Prepared data for Bar Chart (Đánh giá theo 6 cụm Khu phố & Tiêu chí)
  const neighborhoodEvaluationData = [
    { name: 'KP Định Hòa 1-3', 'Rất hài lòng': 85, 'Hài lòng': 12, 'Bình thường': 3 },
    { name: 'KP Định Hòa 4-6', 'Rất hài lòng': 80, 'Hài lòng': 16, 'Bình thường': 4 },
    { name: 'KP Mỹ Hảo 1-3', 'Rất hài lòng': 75, 'Hài lòng': 20, 'Bình thường': 5 },
    { name: 'KP Mỹ Hảo 4-6', 'Rất hài lòng': 78, 'Hài lòng': 18, 'Bình thường': 4 },
    { name: 'KP Tương Bình 1-3', 'Rất hài lòng': 82, 'Hài lòng': 15, 'Bình thường': 3 },
    { name: 'KP Tương Bình 4-6', 'Rất hài lòng': 74, 'Hài lòng': 21, 'Bình thường': 5 }
  ];

  const handleExportResults = () => {
    if (onTriggerToast) {
      onTriggerToast('Xuất báo cáo khảo sát', `Đã xuất ${selectedSurvey.totalResponses} kết quả khảo sát ra bảng biểu thống kê.`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
            <ClipboardList className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-black text-slate-900">Quản Trị Khảo Sát &amp; Phân Tích Dư Luận Dân Sinh</h2>
            <p className="text-xs text-slate-500 font-medium">Trực quan hóa mức độ hài lòng của công dân bằng biểu đồ Recharts thời gian thực</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Chart View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setChartViewMode('BOTH')}
              className={`px-3 py-1 rounded-lg font-bold transition ${chartViewMode === 'BOTH' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}
            >
              Cả hai
            </button>
            <button
              onClick={() => setChartViewMode('PIE')}
              className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 ${chartViewMode === 'PIE' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}
            >
              <PieChartIcon className="w-3.5 h-3.5" />
              <span>Biểu đồ tròn</span>
            </button>
            <button
              onClick={() => setChartViewMode('BAR')}
              className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 ${chartViewMode === 'BAR' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Biểu đồ cột</span>
            </button>
          </div>

          <button
            onClick={handleExportResults}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <FileSpreadsheet className="w-4 h-4 text-white" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* Survey Details & Results Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Surveys list */}
        <div className="lg:col-span-4 space-y-3">
          <div className="font-bold text-xs uppercase tracking-wider text-slate-500 px-1 flex items-center justify-between">
            <span>Các đợt khảo sát dân sinh</span>
            <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-extrabold">{surveyList.length} đợt</span>
          </div>
          {surveyList.map(s => (
            <div
              key={s.id}
              onClick={() => setSelectedSurvey(s)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedSurvey.id === s.id 
                  ? 'bg-blue-50/70 border-blue-500 shadow-md ring-2 ring-blue-500/20' 
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

        {/* Right: Detailed Visual Analytics with Recharts */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-blue-700 mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                Báo cáo Thống kê &amp; Trực quan hóa Dữ liệu (Recharts)
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
                <div className="text-[10px] text-emerald-700 font-bold mt-0.5">✓ 100% người dân xác thực</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Điểm hài lòng trung bình</div>
                <div className="text-2xl font-black text-amber-600 mt-1">4.8 / 5.0</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">94% Hài lòng &amp; Rất hài lòng</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Đóng góp ý kiến mới</div>
                <div className="text-2xl font-black text-blue-700 mt-1">42</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">Kiến nghị đã chuyển xử lý</div>
              </div>
            </div>

            {/* RECHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {/* 1. PIE CHART: Mức độ hài lòng */}
              {(chartViewMode === 'PIE' || chartViewMode === 'BOTH') && (
                <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 ${chartViewMode === 'PIE' ? 'lg:col-span-2' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <PieChartIcon className="w-4 h-4 text-emerald-600" />
                      Tỷ lệ Hài lòng Chung của Người dân
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">Mẫu: 250 người</span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={satisfactionPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {satisfactionPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any, name: any, item: any) => [`${value}% (${item.payload.count} phiếu)`, name]}
                          contentStyle={{ borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36} 
                          iconType="circle"
                          wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* 2. BAR CHART: Đánh giá theo cụm Khu phố */}
              {(chartViewMode === 'BAR' || chartViewMode === 'BOTH') && (
                <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 ${chartViewMode === 'BAR' ? 'lg:col-span-2' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      Phân bổ Hài lòng theo Cụm Khu phố (%)
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">21 Khu phố</span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={neighborhoodEvaluationData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} />
                        <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                        <Tooltip 
                          formatter={(value: any) => [`${value}%`, '']}
                          contentStyle={{ borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                        />
                        <Bar dataKey="Rất hài lòng" fill="#10B981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Hài lòng" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Bình thường" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {/* Question Breakdown Details */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Chi tiết tỷ lệ đánh giá theo từng câu hỏi khảo sát
              </h4>

              {selectedSurvey.questions.map((q, qIndex) => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <div className="font-bold text-xs text-slate-900 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                      {qIndex + 1}
                    </span>
                    <span>{q.questionText}</span>
                  </div>

                  {q.type === 'RATING' && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-28 text-[11px] font-bold text-slate-600">5 Sao (Rất hài lòng)</span>
                        <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <span className="font-black text-slate-800 text-[11px]">78%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-28 text-[11px] font-bold text-slate-600">4 Sao (Hài lòng)</span>
                        <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: '16%' }}></div>
                        </div>
                        <span className="font-black text-slate-800 text-[11px]">16%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-28 text-[11px] font-bold text-slate-600">3 Sao (Bình thường)</span>
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
