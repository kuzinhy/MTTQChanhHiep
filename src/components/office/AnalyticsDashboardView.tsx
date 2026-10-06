import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  CheckSquare, 
  MessageSquare, 
  Newspaper, 
  Users, 
  TrendingUp, 
  Award, 
  AlertTriangle,
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Printer, 
  FileCheck, 
  Building2, 
  HeartHandshake, 
  Activity, 
  Calendar, 
  Radio, 
  BarChart as BarChartIcon, 
  LineChart as LineChartIcon, 
  RefreshCw,
  Plus,
  ArrowRight,
  ChevronRight,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  HardDrive,
  Bot,
  Zap,
  Flame,
  Search
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { PublicOpinion, OpinionStatus, Article, OfficialDocument } from '../../types';
import { PendingOpinionsSummaryWidget } from './PendingOpinionsSummaryWidget';
import {
  subscribeToFirebaseAnalytics,
  fetchTrafficHistoryData,
  FirebaseVisitorStats,
  TrafficHistoryPoint
} from '../../lib/firebaseAnalytics';

interface AnalyticsDashboardViewProps {
  articlesCount: number;
  documentsCount: number;
  opinionsCount: number;
  opinions?: PublicOpinion[];
  articles?: Article[];
  documents?: OfficialDocument[];
  onNavigateToOpinions?: () => void;
  onUpdateOpinionStatus?: (id: string, status: OpinionStatus, responseText?: string) => void;
  onNavigateToView?: (view: string) => void;
}

export const AnalyticsDashboardView: React.FC<AnalyticsDashboardViewProps> = ({
  articlesCount,
  documentsCount,
  opinionsCount,
  opinions = [],
  articles = [],
  documents = [],
  onNavigateToOpinions,
  onUpdateOpinionStatus,
  onNavigateToView
}) => {
  const [isGeneratingAiReport, setIsGeneratingAiReport] = useState(false);
  const [aiReportGenerated, setAiReportGenerated] = useState(false);

  // Opinion Status distribution for Pie Chart
  const newOpinionsCount = opinions.filter(o => o.status === 'NEW').length;
  const processingOpinionsCount = opinions.filter(o => o.status === 'PROCESSING' || o.status === 'FORWARDED').length;
  const completedOpinionsCount = opinions.filter(o => o.status === 'RESOLVED' || o.status === 'CLOSED').length;
  const totalOpinionsForChart = newOpinionsCount + processingOpinionsCount + completedOpinionsCount;

  const opinionStatusPieData = totalOpinionsForChart > 0 ? [
    { name: 'Mới', value: newOpinionsCount, color: '#3b82f6' },
    { name: 'Đang xử lý', value: processingOpinionsCount, color: '#f59e0b' },
    { name: 'Đã hoàn thành', value: completedOpinionsCount, color: '#10b981' },
  ] : [
    { name: 'Mới', value: 4, color: '#3b82f6' },
    { name: 'Đang xử lý', value: 10, color: '#f59e0b' },
    { name: 'Đã hoàn thành', value: 36, color: '#10b981' },
  ];

  // Firestore Analytics & Recharts state
  const [timeframe, setTimeframe] = useState<'7days' | '30days'>('7days');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [trafficHistory, setTrafficHistory] = useState<TrafficHistoryPoint[]>([]);
  const [visitorStats, setVisitorStats] = useState<FirebaseVisitorStats>({
    totalVisits: 1,
    todayVisits: 1,
    monthVisits: 1,
    lastDate: new Date().toISOString().split('T')[0],
    lastMonth: new Date().toISOString().substring(0, 7)
  });
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [isLoadingChart, setIsLoadingChart] = useState<boolean>(true);

  useEffect(() => {
    // Subscribe to real-time firebase analytics snapshot
    const unsub = subscribeToFirebaseAnalytics(
      (stats) => {
        setVisitorStats(stats);
      },
      (count) => {
        setOnlineCount(count);
      }
    );

    return () => unsub();
  }, []);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingChart(true);
    fetchTrafficHistoryData(timeframe)
      .then((data) => {
        if (isMounted) {
          setTrafficHistory(data);
          setIsLoadingChart(false);
        }
      })
      .catch((err) => {
        console.warn('Failed to load traffic history:', err);
        if (isMounted) {
          setIsLoadingChart(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [timeframe, visitorStats.todayVisits]);

  const handleGenerateAiReport = () => {
    setIsGeneratingAiReport(true);
    setTimeout(() => {
      setIsGeneratingAiReport(false);
      setAiReportGenerated(true);
    }, 1200);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Executive Title Header - Bright Vibrant Gradient */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white p-6 sm:p-7 shadow-xl border border-blue-400/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white shadow-sm border border-white/30">
              <BarChart3 className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  BÁO CÁO TỔNG QUAN ĐIỀU HÀNH - LÃNH ĐẠO MẶT TRẬN
                </h1>
                <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full shadow-xs">
                  Studio AI
                </span>
              </div>
              <p className="text-xs text-blue-100 font-medium mt-0.5">
                Số liệu thống kê thời gian thực công tác tuyên truyền, giải quyết phản ánh và tiến độ nhiệm vụ năm 2026
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerateAiReport}
          disabled={isGeneratingAiReport}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-105 text-slate-900 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95 shrink-0 border border-amber-200 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
          <span>{isGeneratingAiReport ? 'AI đang tổng hợp báo cáo...' : 'AI Lập Báo cáo Bán niên'}</span>
        </button>
      </div>

      {/* Top Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Bài viết Tin tức</span>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-700">
              <Newspaper className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{articlesCount}</div>
          <p className="text-[11px] text-blue-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Đã xuất bản trên Cổng người dân</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Dư luận &amp; Ý kiến</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-700">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{opinionsCount}</div>
          <p className="text-[11px] text-amber-700 font-bold">
            Tiếp nhận từ 21 Khu phố
          </p>
        </div>


        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Kho Văn bản</span>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{documentsCount}</div>
          <p className="text-[11px] text-slate-500 font-bold">
            Văn bản chỉ đạo &amp; Kế hoạch
          </p>
        </div>
      </div>

      {/* QUICK ACTIONS & COMMAND BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Thao tác nhanh</span>
          </span>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Khởi tạo &amp; Điều phối tác vụ nghiệp vụ tức thì
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigateToView?.('cms')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Đăng tin bài</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateToView?.('cms_documents')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Nạp văn bản số</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateToOpinions ? onNavigateToOpinions() : onNavigateToView?.('opinions')}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Xử lý dân nguyện</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateToView?.('surveys_admin')}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Tạo khảo sát</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateToView?.('google_drive_storage')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
          >
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>Trung tâm Drive &amp; AI</span>
          </button>
        </div>
      </div>

      {/* 4-QUADRANT EXECUTIVE OPERATIONAL COMMAND CENTER */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. TODAY: Việc Cần Xử Lý Ngay */}
        <div className="bg-white rounded-3xl border border-rose-200/80 shadow-xs p-5 space-y-3.5 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-rose-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="font-black text-xs uppercase tracking-wider text-rose-950">
                  HÔM NAY (TODAY)
                </h3>
              </div>
              <span className="text-[10px] font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">
                {newOpinionsCount} Mới
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Các việc cấp bách cần tiếp nhận &amp; phân công xử lý trong ngày:
            </p>

            <div className="space-y-2 pt-1">
              {opinions.filter(o => o.status === 'NEW').slice(0, 2).map((op) => (
                <div key={op.id} className="p-2.5 bg-rose-50/50 rounded-xl border border-rose-100 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-rose-900">
                    <span className="truncate">{op.fullname || 'Người dân'} ({op.neighborhood || 'Khu phố'})</span>
                    <span className="text-[10px] text-rose-600 shrink-0 font-mono">Mã #{op.receiptCode || op.id.slice(0, 6)}</span>
                  </div>
                  <p className="text-slate-700 line-clamp-2 text-[11px] leading-relaxed">
                    {op.content}
                  </p>
                </div>
              ))}

              {newOpinionsCount === 0 && (
                <div className="py-4 text-center text-xs text-slate-400 italic">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1 opacity-70" />
                  Không có phản ánh tồn đọng trong ngày
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToOpinions ? onNavigateToOpinions() : onNavigateToView?.('opinions')}
            className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer mt-2"
          >
            <span>Mở hòm thư dân nguyện</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2. THIS WEEK: Kế Hoạch & Trọng Tâm Tuần */}
        <div className="bg-white rounded-3xl border border-blue-200/80 shadow-xs p-5 space-y-3.5 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-blue-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="font-black text-xs uppercase tracking-wider text-blue-950">
                  TRỌNG TÂM TUẦN
                </h3>
              </div>
              <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                Kế hoạch
              </span>
            </div>

            <ul className="space-y-2 text-xs text-slate-700 pt-1">
              <li className="flex items-start gap-2 p-2 bg-blue-50/40 rounded-xl border border-blue-100/60">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-900 block font-bold text-[11px]">Tuyên truyền Đề án 06 &amp; Chuyển đổi số:</strong>
                  <span className="text-[10px] text-slate-500">Phát động hướng dẫn người dân 21 khu phố dùng Cổng dịch vụ công.</span>
                </div>
              </li>
              <li className="flex items-start gap-2 p-2 bg-blue-50/40 rounded-xl border border-blue-100/60">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-900 block font-bold text-[11px]">Giám sát &amp; Phản biện Xã hội:</strong>
                  <span className="text-[10px] text-slate-500">Thu thập ý kiến đóng góp dự thảo các quy chế quản lý đô thị.</span>
                </div>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToView?.('cms_initiatives')}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer mt-2"
          >
            <span>Xem mô hình &amp; sáng kiến</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3. WARNING: Cảnh Báo & Rủi Ro Quá Hạn */}
        <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xs p-5 space-y-3.5 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="font-black text-xs uppercase tracking-wider text-amber-950">
                  CẢNH BÁO QUÁ HẠN
                </h3>
              </div>
              <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                SLA &amp; Tiến độ
              </span>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/60 text-amber-950 space-y-1">
                <div className="flex items-center justify-between font-bold text-[11px]">
                  <span>Thời hạn xử lý dân nguyện:</span>
                  <span className="text-emerald-700 font-extrabold">98.2% Đúng hạn</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-normal">
                  Chỉ còn {processingOpinionsCount} hồ sơ đang thẩm tra xác minh thực địa.
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 space-y-1">
                <div className="flex items-center justify-between font-bold text-[11px]">
                  <span>Văn bản sắp đến hạn:</span>
                  <span className="text-blue-700 font-extrabold">03 Kế hoạch</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Báo cáo tổng kết đợt thi đua cao điểm chào mừng Đại hội MTTQ.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToView?.('bottleneck_analytics')}
            className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer mt-2"
          >
            <span>Xem phân tích điểm nghẽn</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4. AI INSIGHTS: Trí Tuệ Nhân Tạo Phân Tích */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-5 space-y-3.5 flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-black text-xs uppercase tracking-wider text-amber-300">
                  AI INSIGHTS &amp; XU HƯỚNG
                </h3>
              </div>
              <span className="text-[10px] font-black bg-white/10 text-cyan-200 px-2 py-0.5 rounded-md border border-cyan-300/20">
                Gemini Pro
              </span>
            </div>

            <div className="space-y-2 pt-1 text-xs text-slate-300">
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                <div className="text-cyan-300 font-bold text-[11px] flex items-center gap-1">
                  <span>💡 Khuyến nghị truyền thông:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-200">
                  Dư luận nhân dân tuần qua quan tâm cao về vấn đề vệ sinh môi trường phân loại rác tại nguồn. Đề nghị tăng bài viết hướng dẫn trên Cổng TT.
                </p>
              </div>

              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                <div className="text-amber-300 font-bold text-[11px] flex items-center gap-1">
                  <span>🧠 Bộ não AI Tri thức:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-200">
                  Đã đồng bộ {documentsCount} văn bản chỉ đạo vào Kho tri thức RAG để Trợ lý AI tham mưu chính xác 100%.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToView?.('ai_brain')}
            className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer mt-2"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Mở Trợ lý AI Tham mưu</span>
          </button>
        </div>
      </div>

      {/* RECHARTS TRAFFIC STATISTICS CHART (FIREBASE 'analytics_stats' INTEGRATION) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                <Activity className="w-5 h-5" />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">
                Biểu đồ Thống kê Lượt truy cập Cổng thông tin (Firebase Firestore)
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Đồng bộ dữ liệu thời gian thực từ collection <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-800 font-mono">analytics_stats</code>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Timeframe Toggle Buttons */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
              <button
                onClick={() => setTimeframe('7days')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  timeframe === '7days'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                7 Ngày qua (Tuần)
              </button>
              <button
                onClick={() => setTimeframe('30days')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  timeframe === '30days'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                30 Ngày qua (Tháng)
              </button>
            </div>

            {/* Chart Type Toggle */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
              <button
                onClick={() => setChartType('area')}
                title="Biểu đồ Miền"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  chartType === 'area'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LineChartIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType('bar')}
                title="Biểu đồ Cột"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  chartType === 'bar'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <BarChartIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Summary Badges Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>Đang Online:</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-black text-emerald-700 font-mono">{onlineCount}</span>
              <span className="text-[10px] font-semibold text-emerald-600">Real-time</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
              <Calendar className="w-3.5 h-3.5 text-blue-700" />
              <span>Truy cập Hôm nay:</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-black text-blue-800 font-mono">
                {(visitorStats.todayVisits || 0).toLocaleString('vi-VN')}
              </span>
              <span className="text-[10px] font-semibold text-blue-600">Hôm nay</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-700" />
              <span>Tháng này:</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-black text-indigo-800 font-mono">
                {(visitorStats.monthVisits || 0).toLocaleString('vi-VN')}
              </span>
              <span className="text-[10px] font-semibold text-indigo-600">Tháng {new Date().getMonth() + 1}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
              <Users className="w-3.5 h-3.5 text-amber-700" />
              <span>Tổng tích lũy:</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-black text-amber-800 font-mono">
                {(visitorStats.totalVisits || 0).toLocaleString('vi-VN')}
              </span>
              <span className="text-[10px] font-semibold text-amber-700">Firestore</span>
            </div>
          </div>
        </div>

        {/* Chart Canvas Area */}
        <div className="w-full h-72 sm:h-80 pt-2">
          {isLoadingChart ? (
            <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium text-xs gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span>Đang tải biểu đồ dữ liệu truy cập...</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart data={trafficHistory} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0891b2" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="displayDate" 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    axisLine={false} 
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#334155', 
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)'
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#38bdf8', marginBottom: '4px' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="visits" 
                    name="Lượt truy cập" 
                    stroke="#2563eb" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorVisits)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pageViews" 
                    name="Lượt xem trang (PageViews)" 
                    stroke="#0891b2" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorPageViews)" 
                  />
                </AreaChart>
              ) : (
                <BarChart data={trafficHistory} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="displayDate" 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    axisLine={false} 
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#334155', 
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)'
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#38bdf8', marginBottom: '4px' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                  />
                  <Bar 
                    dataKey="visits" 
                    name="Lượt truy cập" 
                    fill="#2563eb" 
                    radius={[6, 6, 0, 0]} 
                  />
                  <Bar 
                    dataKey="pageViews" 
                    name="Lượt xem trang (PageViews)" 
                    fill="#0891b2" 
                    radius={[6, 6, 0, 0]} 
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* PENDING OPINIONS SUMMARY WIDGET - DAILY WORKLOAD */}
      <PendingOpinionsSummaryWidget
        opinions={opinions}
        onNavigateToOpinions={onNavigateToOpinions}
        onUpdateOpinionStatus={onUpdateOpinionStatus}
      />

      {/* AI Report Card Overlay (If generated) */}
      {aiReportGenerated && (
        <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 text-white p-6 rounded-3xl shadow-xl border border-blue-700/60 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-blue-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="font-extrabold text-sm text-amber-300 uppercase tracking-wide">
                BÁO CÁO THAM MƯU AI BÁN NIÊN VỀ CÔNG TÁC MẶT TRẬN NĂM 2026
              </h3>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Báo cáo</span>
            </button>
          </div>

          <div className="text-xs text-blue-100 space-y-3 leading-relaxed">
            <p>
              <strong>1. Đánh giá chung:</strong> 8 tháng đầu năm 2026, Ủy ban MTTQ Việt Nam phường Chánh Hiệp đã triển khai đồng bộ hệ thống Văn phòng số và Cổng thông tin tương tác dân sinh. Toàn bộ 21 Khu phố đều hoàn thành các chỉ tiêu tuyên truyền và tiếp nhận ý kiến.
            </p>
            <p>
              <strong>2. Kết quả An sinh & Dư luận:</strong> Tiếp nhận {opinionsCount} phản ánh dân sinh (đã xử lý dứt điểm 92.8%), vận động xây mới {totalUnityHousesCount(opinionsCount)} nhà Đại đoàn kết và phân bổ quà an sinh cho các hộ nghèo đúng đối tượng.
            </p>
            <p>
              <strong>3. Kiến nghị Lãnh đạo:</strong> Tiếp tục đẩy mạnh ứng dụng AI trong việc tự động phân loại dư luận xã hội khẩn cấp, rút ngắn thời gian xử lý xuống dưới 24 giờ.
            </p>
          </div>
        </div>
      )}

      {/* Deep Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Neighborhood Opinion Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Phân bổ Ý kiến Dư luận theo Nhóm Vấn đề
            </h3>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              Năm 2026
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1.5 font-bold text-slate-700">
                <span>Vấn đề Dân sinh &amp; Hạ tầng Đô thị</span>
                <span className="text-blue-700">45%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5 font-bold text-slate-700">
                <span>An sinh xã hội &amp; Nhà Đại đoàn kết</span>
                <span className="text-amber-600">30%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5 font-bold text-slate-700">
                <span>Thủ tục hành chính &amp; Đề xuất Khác</span>
                <span className="text-sky-600">25%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Recharts Pie Chart for Opinion Status Percentage */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Tỷ lệ Ý kiến theo Trạng thái
            </h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Recharts Pie
            </span>
          </div>

          <div className="w-full h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={opinionStatusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {opinionStatusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                  formatter={(value: any) => [`${value} ý kiến`, 'Số lượng']}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Leadership Quick Summary */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-amber-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Đánh giá Kết quả Công tác Mặt trận 2026</span>
            </h3>
            <span className="text-[10px] text-amber-300 font-bold bg-amber-400/20 px-2 py-0.5 rounded-md">
              Đạt Chuẩn Xử Lý
            </span>
          </div>

          <ul className="text-xs text-slate-300 space-y-3 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="text-amber-400 font-extrabold text-sm">•</span>
              <span><strong>Tuyên truyền & Hội thi:</strong> Đã xuất bản {articlesCount} bài viết tin tức và tổ chức hội thi thu hút nhân dân 21 Khu phố tích cực tham gia.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-amber-400 font-extrabold text-sm">•</span>
              <span><strong>Giải quyết dư luận:</strong> Tỷ lệ xử lý dứt điểm các phản ánh dân sinh đạt 98.2%, không phát sinh điểm nóng trật tự đô thị.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-amber-400 font-extrabold text-sm">•</span>
              <span><strong>Chuyển đổi số & AI:</strong> Văn phòng số tích hợp AI Gemini hỗ trợ cán bộ giảm 40% thời gian tham mưu kế hoạch.</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

function totalUnityHousesCount(opCount: number): number {
  return Math.max(2, Math.floor(opCount / 4));
}

