import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  MessageSquare, 
  BookOpen, 
  CheckCircle2, 
  Copy, 
  Download, 
  AlertTriangle, 
  Loader2, 
  Send, 
  Search, 
  RefreshCw,
  FileCheck,
  Zap,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  Compass,
  Filter
} from 'lucide-react';

interface AiAssistantViewProps {
  documentsContext?: string;
  opinionsContext?: any[];
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  documentsContext = '',
  opinionsContext = []
}) => {
  const [activeTool, setActiveTool] = useState<
    'plan' | 'speech' | 'report' | 'summarize' | 'spelling' | 'search' | 'opinion'
  >('plan');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [activeChipCategory, setActiveChipCategory] = useState<'all' | 'search' | 'opinion' | 'draft'>('all');

  // Form States
  // Plan
  const [planTopic, setPlanTopic] = useState('Kế hoạch Chăm lo Tết Ất Tỵ cho các hộ khó khăn năm 2026');
  const [planPurpose, setPlanPurpose] = useState('Đảm bảo 100% hộ nghèo, cận nghèo, hoàn cảnh đặc biệt khó khăn đều có Tết');
  const [planRequirement, setPlanRequirement] = useState('Nhanh chóng, chính xác, không trùng lặp, hỗ trợ đúng đối tượng');
  const [planTimeLocation, setPlanTimeLocation] = useState('Từ 15/12/2026 đến 25/01/2027 tại UBND và 12 Khu phố');

  // Speech
  const [speechEvent, setSpeechEvent] = useState('Lễ Kỷ niệm 96 năm Ngày truyền thống Mặt trận Dân tộc Thống nhất Việt Nam');
  const [speechSpeaker, setSpeechSpeaker] = useState('Đ/c Trần Thị Hoa - Chủ tịch Ủy ban MTTQ Việt Nam Phường Chánh Hiệp');
  const [speechKeyMsg, setSpeechKeyMsg] = useState('Phát huy sức mạnh khối đại đoàn kết toàn dân tộc, chung tay xây dựng đô thị văn minh');

  // Report
  const [reportTitle, setReportTitle] = useState('Báo cáo Kết quả công tác Mặt trận 8 tháng đầu năm 2026');
  const [reportPeriod, setReportPeriod] = useState('Tháng 01 - Tháng 08/2026');
  const [reportAchievements, setReportAchievements] = useState('Vận động Quỹ Vì người nghèo đạt 120% chỉ tiêu; trao 120 phần quà; giải quyết 95% ý kiến phản ánh dân sinh');

  // Summarize
  const [summarizeText, setSummarizeText] = useState('');

  // Spelling
  const [spellingText, setSpellingText] = useState('Uỷ ban Mặt trận Tổ quốc Phường Chánh Hiệp thông báo kế hoach ra quân giọn dẹp vệ sinh môi trường trên tuyên đường Chánh Hiệp 15 vào sáng thứ 7 tuần nầy.');

  // Search
  const [searchQuery, setSearchQuery] = useState('Các chỉ tiêu cơ bản trong kế hoạch chăm lo Tết năm 2026 là gì?');

  const tools = [
    { id: 'plan', label: '1. Soạn Kế Hoạch', desc: 'Dự thảo kế hoạch hoạt động chuẩn thể thức' },
    { id: 'speech', label: '2. Soạn Bài Phát Biểu', desc: 'Bài phát biểu sự kiện, lễ kỷ niệm truyền cảm hứng' },
    { id: 'report', label: '3. Soạn Báo Cáo', desc: 'Báo cáo công tác Mặt trận tháng, quý, năm' },
    { id: 'summarize', label: '4. Tóm Tắt Văn Bản', desc: 'Trích xuất nội dung chính & chỉ đạo trọng tâm' },
    { id: 'spelling', label: '5. Kiểm Tra Chính Tả & Văn Phong', desc: 'Phát hiện lỗi sai và chuẩn hóa hành chính' },
    { id: 'search', label: '6. Tra Cứu Kho Tài Liệu', desc: 'Hỏi đáp AI trong kho văn bản nội bộ' },
    { id: 'opinion', label: '7. Tóm Tắt Dư Luận Xã Hội', desc: 'Phân tích xu hướng phản ánh của người dân' },
  ];

  const handleGeneratePlan = async (customTopic?: string, customPurpose?: string) => {
    const topic = customTopic || planTopic;
    const purpose = customPurpose || planPurpose;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          purpose,
          requirement: planRequirement,
          timeLocation: planTimeLocation
        })
      });
      const data = await res.json();
      setResult(data.result || data.error);
    } catch (err: any) {
      setResult('Lỗi kết nối API AI: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSpeech = async (customEvent?: string) => {
    const eventName = customEvent || speechEvent;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName,
          speaker: speechSpeaker,
          keyMessages: speechKeyMsg
        })
      });
      const data = await res.json();
      setResult(data.result || data.error);
    } catch (err: any) {
      setResult('Lỗi kết nối API AI: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (customTitle?: string) => {
    const title = customTitle || reportTitle;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportTitle: title,
          period: reportPeriod,
          keyAchievements: reportAchievements
        })
      });
      const data = await res.json();
      setResult(data.result || data.error);
    } catch (err: any) {
      setResult('Lỗi kết nối API AI: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!summarizeText.trim()) {
      alert('Vui lòng dán nội dung văn bản cần tóm tắt!');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentText: summarizeText })
      });
      const data = await res.json();
      setResult(data.result || data.error);
    } catch (err: any) {
      setResult('Lỗi kết nối API AI: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckSpelling = async () => {
    if (!spellingText.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai/spelling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftText: spellingText })
      });
      const data = await res.json();
      setResult(data.result || data.error);
    } catch (err: any) {
      setResult('Lỗi kết nối API AI: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchKnowledge = async (queryOverride?: string) => {
    const q = queryOverride || searchQuery;
    if (!q.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai/knowledge-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, documentsContext })
      });
      const data = await res.json();
      setResult(data.result || data.error);
    } catch (err: any) {
      setResult('Lỗi kết nối API AI: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpinionSummary = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai/opinion-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opinionsList: opinionsContext })
      });
      const data = await res.json();
      setResult(data.result || data.error);
    } catch (err: any) {
      setResult('Lỗi kết nối API AI: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    alert('Đã sao chép nội dung vào khay nhớ tạm!');
  };

  // Preset Prompt Chips Definitions
  const promptChips = [
    {
      id: 'chip-search-1',
      category: 'search' as const,
      icon: Search,
      label: 'Chỉ tiêu Mặt trận Phường 2026',
      desc: 'Tra cứu các chỉ tiêu nhiệm vụ năm 2026',
      badge: 'Kho Văn bản',
      action: () => {
        const q = 'Chỉ tiêu cơ bản trong kế hoạch công tác Mặt trận Phường Chánh Hiệp năm 2026 là gì?';
        setSearchQuery(q);
        setActiveTool('search');
        handleSearchKnowledge(q);
      }
    },
    {
      id: 'chip-search-2',
      category: 'search' as const,
      icon: Search,
      label: 'Quy trình Quỹ Vì người nghèo',
      desc: 'Tra cứu quy định vận động & tiếp nhận Quỹ',
      badge: 'Văn bản PG',
      action: () => {
        const q = 'Quy trình vận động, quản lý và sử dụng Quỹ Vì người nghèo cấp phường năm 2026';
        setSearchQuery(q);
        setActiveTool('search');
        handleSearchKnowledge(q);
      }
    },
    {
      id: 'chip-search-3',
      category: 'search' as const,
      icon: Search,
      label: 'Mức phụ cấp Trưởng ban CTMT 12 Khu phố',
      desc: 'Tra cứu chính sách cán bộ Mặt trận cơ sở',
      badge: 'Chế độ CB',
      action: () => {
        const q = 'Mức hỗ trợ và phụ cấp hàng tháng cho Trưởng ban Công tác Mặt trận 12 Khu phố';
        setSearchQuery(q);
        setActiveTool('search');
        handleSearchKnowledge(q);
      }
    },
    {
      id: 'chip-opinion-1',
      category: 'opinion' as const,
      icon: MessageSquare,
      label: 'Tổng hợp phản ánh dân sinh 12 Khu phố',
      desc: 'Phân tích dư luận xã hội theo khu vực',
      badge: 'Dư luận XH',
      action: () => {
        setActiveTool('opinion');
        handleOpinionSummary();
      }
    },
    {
      id: 'chip-opinion-2',
      category: 'opinion' as const,
      icon: TrendingUp,
      label: 'Vấn đề bức xúc Hạ tầng & Môi trường',
      desc: 'Tóm tắt các phản ánh về môi trường, rác thải, thoát nước',
      badge: 'Trọng tâm',
      action: () => {
        setActiveTool('opinion');
        handleOpinionSummary();
      }
    },
    {
      id: 'chip-draft-1',
      category: 'draft' as const,
      icon: FileText,
      label: 'Lập Kế hoạch Chăm lo Tết 2026',
      desc: 'Soạn dự thảo kế hoạch tặng quà Tết hộ nghèo',
      badge: 'Dự thảo KH',
      action: () => {
        const topic = 'Kế hoạch Chăm lo Tết Ất Tỵ cho các hộ nghèo, cận nghèo năm 2026';
        const purpose = 'Đảm bảo 100% đối tượng chính sách và hộ khó khăn đều được nhận quà Tết';
        setPlanTopic(topic);
        setPlanPurpose(purpose);
        setActiveTool('plan');
        handleGeneratePlan(topic, purpose);
      }
    },
    {
      id: 'chip-draft-2',
      category: 'draft' as const,
      icon: BookOpen,
      label: 'Bài phát biểu Ngày hội Đại đoàn kết',
      desc: 'Soạn bài phát biểu Lễ kỷ niệm truyền thống MTTQ',
      badge: 'Bài phát biểu',
      action: () => {
        const evt = 'Lễ Kỷ niệm 96 năm Ngày truyền thống Mặt trận Dân tộc Thống nhất Việt Nam tại 12 Khu phố';
        setSpeechEvent(evt);
        setActiveTool('speech');
        handleGenerateSpeech(evt);
      }
    },
    {
      id: 'chip-draft-3',
      category: 'draft' as const,
      icon: CheckCircle2,
      label: 'Báo cáo Sơ kết 6 tháng Mặt trận',
      desc: 'Soạn báo cáo công tác tham mưu lãnh đạo',
      badge: 'Báo cáo',
      action: () => {
        const title = 'Báo cáo Kết quả Công tác Mặt trận và Cuộc vận động Đô thị văn minh 6 tháng đầu năm 2026';
        setReportTitle(title);
        setActiveTool('report');
        handleGenerateReport(title);
      }
    }
  ];

  const filteredChips = promptChips.filter(c => {
    if (activeChipCategory === 'all') return true;
    return c.category === activeChipCategory;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner - Bright Vibrant Blue Indigo Gradient */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white p-6 sm:p-7 shadow-xl border border-blue-400/30 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white shadow-sm border border-white/30">
              <Sparkles className="w-6 h-6 text-amber-300 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">TRỢ LÝ MẶT TRẬN AI - VĂN PHÒNG SỐ</h1>
                <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full shadow-xs">
                  Gemini Studio
                </span>
              </div>
              <p className="text-xs text-blue-100 font-medium mt-0.5">
                Hỗ trợ cán bộ tham mưu, dự thảo kế hoạch, báo cáo, bài phát biểu và tóm tắt văn bản bằng công nghệ Gemini AI
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200 text-slate-800 text-xs flex items-center gap-2.5 shadow-2xs">
        <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0" />
        <span className="font-semibold text-blue-950">
          Nội dung do AI hỗ trợ tham mưu. Cán bộ cần kiểm tra kỹ trước khi sử dụng hoặc ban hành chính thức.
        </span>
      </div>

      {/* PROMPT CHIPS SECTION - QUICK COMMAND SUGGESTIONS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 rounded-lg shadow-2xs">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span>GỢI Ý CÂU LỆNH NHANH (PROMPT CHIPS)</span>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Bấm để thực hiện ngay
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">Các mẫu câu lệnh mẫu giúp cán bộ nhanh chóng tra cứu văn bản và tóm tắt ý kiến dân sinh</p>
            </div>
          </div>

          {/* Chip Category Filters */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
            <button
              onClick={() => setActiveChipCategory('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeChipCategory === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tất cả ({promptChips.length})
            </button>
            <button
              onClick={() => setActiveChipCategory('search')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeChipCategory === 'search' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tra cứu Kho VB
            </button>
            <button
              onClick={() => setActiveChipCategory('opinion')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeChipCategory === 'opinion' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tóm tắt Dư luận
            </button>
            <button
              onClick={() => setActiveChipCategory('draft')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeChipCategory === 'draft' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Soạn Văn bản
            </button>
          </div>
        </div>

        {/* Prompt Chips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredChips.map((chip) => {
            const IconComp = chip.icon;
            return (
              <button
                key={chip.id}
                onClick={chip.action}
                disabled={loading}
                className="group relative text-left p-3.5 bg-slate-50 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50/50 rounded-xl border border-slate-200/80 hover:border-blue-300 transition-all shadow-2xs hover:shadow-md active:scale-98 disabled:opacity-50 flex flex-col justify-between space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-blue-700 font-extrabold text-xs">
                    <IconComp className="w-3.5 h-3.5 shrink-0 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span className="line-clamp-1">{chip.label}</span>
                  </div>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                    {chip.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                  {chip.desc}
                </p>
                <div className="pt-1 flex items-center justify-end text-[10px] font-bold text-blue-600 group-hover:text-blue-800 gap-1 opacity-80 group-hover:opacity-100">
                  <span>Chạy AI</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Tool Selector List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 space-y-2">
          <h3 className="px-2 text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
            Danh mục Công cụ AI
          </h3>
          {tools.map((t) => {
            const isSelected = activeTool === t.id;
            
            if (isSelected) {
              return (
                <div key={t.id} className="p-[1px] rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-sm">
                  <button
                    onClick={() => {
                      setActiveTool(t.id as any);
                      setResult(null);
                    }}
                    className="w-full text-left p-3 rounded-[11px] bg-slate-900 text-white transition-all"
                  >
                    <div className="font-extrabold text-xs text-amber-300 flex items-center justify-between">
                      <span>{t.label}</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    </div>
                    <div className="text-[11px] mt-0.5 line-clamp-1 text-slate-300">
                      {t.desc}
                    </div>
                  </button>
                </div>
              );
            }

            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTool(t.id as any);
                  setResult(null);
                }}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100/80 text-slate-800 transition-all"
              >
                <div className="font-bold text-xs text-slate-900">
                  {t.label}
                </div>
                <div className="text-[11px] mt-0.5 line-clamp-1 text-slate-500">
                  {t.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Active Tool Form & Results (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
            
            {/* TOOL 1: PLAN */}
            {activeTool === 'plan' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span>Soạn thảo Dự thảo Kế hoạch Công tác</span>
                  <span className="text-xs text-blue-600 font-semibold">Gemini Plan Assistant</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Chủ đề Kế hoạch (*)</label>
                    <input
                      type="text"
                      value={planTopic}
                      onChange={(e) => setPlanTopic(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mục đích Kế hoạch</label>
                    <input
                      type="text"
                      value={planPurpose}
                      onChange={(e) => setPlanPurpose(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Yêu cầu &amp; Thời gian - Địa điểm</label>
                    <input
                      type="text"
                      value={planTimeLocation}
                      onChange={(e) => setPlanTimeLocation(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleGeneratePlan()}
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin text-amber-300" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                  <span>Tạo Dự Thảo Kế Hoạch Bằng AI</span>
                </button>
              </div>
            )}

            {/* TOOL 2: SPEECH */}
            {activeTool === 'speech' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span>Soạn thảo Bài Phát Biểu Sự Kiện</span>
                  <span className="text-xs text-blue-600 font-semibold">Gemini Speech Generator</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tên Sự kiện / Lễ kỷ niệm (*)</label>
                    <input
                      type="text"
                      value={speechEvent}
                      onChange={(e) => setSpeechEvent(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Người phát biểu</label>
                    <input
                      type="text"
                      value={speechSpeaker}
                      onChange={(e) => setSpeechSpeaker(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Thông điệp cốt lõi</label>
                    <textarea
                      rows={3}
                      value={speechKeyMsg}
                      onChange={(e) => setSpeechKeyMsg(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleGenerateSpeech()}
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin text-amber-300" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                  <span>Tạo Bài Phát Biểu Bằng AI</span>
                </button>
              </div>
            )}

            {/* TOOL 3: REPORT */}
            {activeTool === 'report' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span>Soạn thảo Báo Cáo Công Tác</span>
                  <span className="text-xs text-blue-600 font-semibold">Gemini Report Writer</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tiêu đề Báo cáo (*)</label>
                    <input
                      type="text"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kết quả nổi bật</label>
                    <textarea
                      rows={3}
                      value={reportAchievements}
                      onChange={(e) => setReportAchievements(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleGenerateReport()}
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin text-amber-300" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                  <span>Soạn Báo Cáo Bằng AI</span>
                </button>
              </div>
            )}

            {/* TOOL 4: SUMMARIZE */}
            {activeTool === 'summarize' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span>Tóm Tắt &amp; Trích Xuất Nhiệm Vụ Văn Bản</span>
                  <span className="text-xs text-blue-600 font-semibold">Gemini Summarizer</span>
                </h3>
                <textarea
                  rows={6}
                  placeholder="Dán toàn văn bản chỉ đạo, nghị quyết hoặc công văn vào đây..."
                  value={summarizeText}
                  onChange={(e) => setSummarizeText(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden leading-relaxed font-medium"
                />
                <button
                  onClick={handleSummarize}
                  disabled={loading}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin text-amber-300" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                  <span>Phân Tích &amp; Tóm Tắt Văn Bản</span>
                </button>
              </div>
            )}

            {/* TOOL 5: SPELLING */}
            {activeTool === 'spelling' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span>Kiểm Tra Chính Tả &amp; Văn Phong Hành Chính</span>
                  <span className="text-xs text-blue-600 font-semibold">Gemini Proofreader</span>
                </h3>
                <textarea
                  rows={5}
                  value={spellingText}
                  onChange={(e) => setSpellingText(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden leading-relaxed font-medium"
                />
                <button
                  onClick={handleCheckSpelling}
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin text-amber-300" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                  <span>Kiểm Tra Lỗi &amp; Chuẩn Hóa Văn Phong</span>
                </button>
              </div>
            )}

            {/* TOOL 6: SEARCH */}
            {activeTool === 'search' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span>Tra Cứu Thông Tin Trong Kho Dữ Liệu Nội Bộ</span>
                  <span className="text-xs text-blue-600 font-semibold">Knowledge Graph RAG</span>
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nhập câu hỏi tra cứu..."
                    className="flex-1 text-xs px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                  />
                  <button
                    onClick={() => handleSearchKnowledge()}
                    disabled={loading}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-all shrink-0 shadow-xs active:scale-95 flex items-center gap-1.5"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" /> : <Search className="w-3.5 h-3.5" />}
                    <span>Tra cứu</span>
                  </button>
                </div>
              </div>
            )}

            {/* TOOL 7: OPINION SUMMARY */}
            {activeTool === 'opinion' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span>Tổng Hợp &amp; Báo Cáo Nhanh Dư Luận Xã Hội</span>
                  <span className="text-xs text-purple-600 font-semibold">Opinion AI Synthesizer</span>
                </h3>
                <p className="text-xs text-slate-600">
                  Hệ thống sẽ tự động quét danh sách phản ánh gần đây của nhân dân ({opinionsContext.length} ý kiến) để tổng hợp báo cáo tham mưu Lãnh đạo.
                </p>
                <button
                  onClick={handleOpinionSummary}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-105 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 border border-amber-300"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <Sparkles className="w-4 h-4 text-slate-950" />}
                  <span>Tạo Báo Cáo Nhanh Dư Luận Bằng AI</span>
                </button>
              </div>
            )}

          </div>

          {/* AI Output Area */}
          {result && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    Kết quả AI Tham mưu
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-mono overflow-x-auto shadow-inner">
                {result}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

