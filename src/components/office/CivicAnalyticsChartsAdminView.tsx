import React, { useState } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { 
  BarChart3, TrendingUp, Calendar, Filter, Download, 
  CheckCircle2, Clock, AlertTriangle, FileText, MessageSquare, 
  Sparkles, RefreshCw, ShieldCheck 
} from 'lucide-react';

export const CivicAnalyticsChartsAdminView: React.FC<{ onTriggerToast: (title: string, msg?: string) => void }> = ({
  onTriggerToast
}) => {
  const [selectedYear, setSelectedYear] = useState<'2026' | '2025'>('2026');
  const [timeRange, setTimeRange] = useState<'12_MONTHS' | '6_MONTHS' | 'Q3'>('12_MONTHS');

  // 1. Monthly Citizen Opinions & Feedback Data
  const monthlyOpinionsData = [
    { month: 'Tháng 1', tiepNhan: 45, daGiaiQuyet: 43, dangXuLy: 2, haiLong: 98 },
    { month: 'Tháng 2', tiepNhan: 38, daGiaiQuyet: 37, dangXuLy: 1, haiLong: 99 },
    { month: 'Tháng 3', tiepNhan: 52, daGiaiQuyet: 50, dangXuLy: 2, haiLong: 97 },
    { month: 'Tháng 4', tiepNhan: 64, daGiaiQuyet: 61, dangXuLy: 3, haiLong: 98 },
    { month: 'Tháng 5', tiepNhan: 59, daGiaiQuyet: 58, dangXuLy: 1, haiLong: 99 },
    { month: 'Tháng 6', tiepNhan: 72, daGiaiQuyet: 69, dangXuLy: 3, haiLong: 97 },
    { month: 'Tháng 7', tiepNhan: 68, daGiaiQuyet: 66, dangXuLy: 2, haiLong: 98 },
    { month: 'Tháng 8', tiepNhan: 81, daGiaiQuyet: 78, dangXuLy: 3, haiLong: 99 },
    { month: 'Tháng 9', tiepNhan: 76, daGiaiQuyet: 74, dangXuLy: 2, haiLong: 98 },
    { month: 'Tháng 10', tiepNhan: 85, daGiaiQuyet: 82, dangXuLy: 3, haiLong: 99 },
    { month: 'Tháng 11', tiepNhan: 62, daGiaiQuyet: 60, dangXuLy: 2, haiLong: 98 },
    { month: 'Tháng 12', tiepNhan: 55, daGiaiQuyet: 54, dangXuLy: 1, haiLong: 99 }
  ];

  // 2. Monthly Official Documents Processing Progress Data
  const monthlyDocumentsData = [
    { month: 'Tháng 1', truocHan: 180, dungHan: 95, quaHan: 2, tyLeDungHan: 99.3 },
    { month: 'Tháng 2', truocHan: 165, dungHan: 88, quaHan: 1, tyLeDungHan: 99.6 },
    { month: 'Tháng 3', truocHan: 210, dungHan: 115, quaHan: 2, tyLeDungHan: 99.4 },
    { month: 'Tháng 4', truocHan: 195, dungHan: 105, quaHan: 3, tyLeDungHan: 99.0 },
    { month: 'Tháng 5', truocHan: 225, dungHan: 120, quaHan: 1, tyLeDungHan: 99.7 },
    { month: 'Tháng 6', truocHan: 240, dungHan: 130, quaHan: 2, tyLeDungHan: 99.5 },
    { month: 'Tháng 7', truocHan: 230, dungHan: 125, quaHan: 2, tyLeDungHan: 99.4 },
    { month: 'Tháng 8', truocHan: 260, dungHan: 140, quaHan: 1, tyLeDungHan: 99.8 },
    { month: 'Tháng 9', truocHan: 245, dungHan: 135, quaHan: 2, tyLeDungHan: 99.5 },
    { month: 'Tháng 10', truocHan: 275, dungHan: 148, quaHan: 1, tyLeDungHan: 99.8 },
    { month: 'Tháng 11', truocHan: 210, dungHan: 110, quaHan: 2, tyLeDungHan: 99.4 },
    { month: 'Tháng 12', truocHan: 190, dungHan: 98, quaHan: 1, tyLeDungHan: 99.7 }
  ];

  // 3. Category Breakdown Data
  const categoryPieData = [
    { name: 'Hạ tầng & Đô thị', value: 320, color: '#2563eb' },
    { name: 'Môi trường & Rác thải', value: 210, color: '#10b981' },
    { name: 'An ninh & Trật tự', value: 145, color: '#f59e0b' },
    { name: 'Thủ tục hành chính', value: 112, color: '#8b5cf6' },
    { name: 'An sinh & Chính sách', value: 95, color: '#06b6d4' }
  ];

  const handleExportData = () => {
    onTriggerToast('Xuất dữ liệu thành công', 'File Excel số liệu thống kê lưu lượng phản ánh và tiến độ văn bản đã sẵn sàng.');
  };

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* ================= HEADER BAR ================= */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shadow-xs">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-black uppercase">
                RECHARTS ANALYTICS ENGINE
              </span>
              <span className="text-xs text-slate-500 font-bold">Thống kê Dữ liệu Số Phường Chánh Hiệp</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">
              Thống kê Lưu lượng Phản ánh Dân nguyện &amp; Tiến độ Xử lý Văn bản
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value as any)}
            className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
          >
            <option value="2026">Năm 2026</option>
            <option value="2025">Năm 2025</option>
          </select>

          <button
            type="button"
            onClick={handleExportData}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Xuất báo cáo Excel</span>
          </button>
        </div>
      </div>

      {/* ================= TOP 4 KPI CARDS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Tổng phản ánh tiếp nhận</span>
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </div>
          <strong className="text-xl font-black text-slate-900 font-mono block">757 vụ việc</strong>
          <span className="text-[10px] text-emerald-600 font-bold">Đã giải quyết 97.4%</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Tổng văn bản xử lý</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <strong className="text-xl font-black text-slate-900 font-mono block">3.784 văn bản</strong>
          <span className="text-[10px] text-emerald-600 font-bold">Đúng &amp; Trước hạn 99.5%</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Chỉ số hài lòng trung bình</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <strong className="text-xl font-black text-amber-600 font-mono block">98.5%</strong>
          <span className="text-[10px] text-slate-500 font-medium">Tăng 1.2% so với 2025</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Tỷ lệ quá hạn xử lý</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <strong className="text-xl font-black text-emerald-700 font-mono block">0.5%</strong>
          <span className="text-[10px] text-emerald-700 font-bold">Dưới mức cho phép (&lt; 2%)</span>
        </div>
      </div>

      {/* ================= CHART 1: MONTHLY CITIZEN OPINIONS / FEEDBACK VOLUME ================= */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <h3 className="font-black text-sm sm:text-base text-slate-900">
                Lưu lượng Phản ánh của Người dân theo Từng tháng ({selectedYear})
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              So sánh số lượng ý kiến tiếp nhận, đã giải quyết xong và tỷ lệ hài lòng cử tri
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="flex items-center gap-1 text-blue-600">
              <span className="w-3 h-3 rounded bg-blue-600 inline-block" /> Tiếp nhận
            </span>
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Đã giải quyết
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyOpinionsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTiepNhan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorDaGiaiQuyet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="tiepNhan" name="Tiếp nhận" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTiepNhan)" />
              <Area type="monotone" dataKey="daGiaiQuyet" name="Đã giải quyết" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDaGiaiQuyet)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= 2-COLUMN SECTION: DOCUMENT PROCESSING & TOPIC BREAKDOWN ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CHART 2: MONTHLY OFFICIAL DOCUMENT PROCESSING PROGRESS (8/12) */}
        <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <h3 className="font-black text-sm sm:text-base text-slate-900">
                  Tiến độ Xử lý Văn bản Hành chính theo Từng tháng
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Phân tích tỷ lệ văn bản xử lý Trước hạn, Đúng hạn và Quá hạn
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyDocumentsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="truocHan" name="Trước hạn" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="dungHan" name="Đúng hạn" fill="#3b82f6" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="quaHan" name="Quá hạn" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: TOPIC / CATEGORY DISTRIBUTION (4/12) */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-black text-sm sm:text-base text-slate-900">
              Cơ cấu Lĩnh vực Phản ánh
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Phân loại theo nhóm vấn đề cử tri quan tâm
            </p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {categoryPieData.map(c => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span>{c.name}</span>
                </span>
                <strong className="text-slate-900 font-mono">{c.value} ({Math.round((c.value / 882) * 100)}%)</strong>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
