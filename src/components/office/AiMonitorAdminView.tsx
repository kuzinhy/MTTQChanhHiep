import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle, 
  Sparkles, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  PlusCircle, 
  RefreshCw,
  Clock,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { UnansweredQuery, AIMonitorLog } from '../../lib/ai/types';

const UNANSWERED_STORAGE_KEY = 'chanh_hiep_ai_unanswered_queries_v2';
const MONITOR_LOGS_KEY = 'chanh_hiep_ai_monitor_logs_v2';

const INITIAL_UNANSWERED_QUERIES: UnansweredQuery[] = [
  {
    id: 'unans-01',
    query: 'Lịch tiêm phòng vắc-xin cho trẻ em tháng 10 tại Trạm y tế Chánh Hiệp?',
    intent: 'PUBLIC_SERVICE',
    searchedSources: ['WEBSITE', 'KNOWLEDGE_BASE'],
    timestamp: '2026-09-30 08:15',
    resolved: false
  },
  {
    id: 'unans-02',
    query: 'Quy định hỗ trợ học nghề cho thanh niên hoàn thành nghĩa vụ quân sự năm 2026?',
    intent: 'DOCUMENT_LOOKUP',
    searchedSources: ['WEBSITE', 'DRIVE'],
    timestamp: '2026-09-29 16:40',
    resolved: false
  }
];

export const AiMonitorAdminView: React.FC = () => {
  const [unanswered, setUnanswered] = useState<UnansweredQuery[]>(() => {
    try {
      const raw = localStorage.getItem(UNANSWERED_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return INITIAL_UNANSWERED_QUERIES;
  });

  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [resolvedAnswerText, setResolvedAnswerText] = useState('');

  const stats = {
    totalQueries: 142,
    ragSuccessRate: 96.4,
    realtimeSearches: 28,
    feedbackThumbsUp: 98,
    feedbackThumbsDown: 4,
    unansweredCount: unanswered.filter(u => !u.resolved).length
  };

  const handleResolve = (id: string) => {
    if (!resolvedAnswerText.trim()) return;

    // Add to knowledge base directly
    try {
      const rawKb = localStorage.getItem('chanh_hiep_ai_knowledge_docs_v2');
      const kbDocs = rawKb ? JSON.parse(rawKb) : [];
      const itemToResolve = unanswered.find(u => u.id === id);
      if (itemToResolve) {
        kbDocs.unshift({
          id: 'kb-' + Date.now(),
          title: `FAQ: ${itemToResolve.query}`,
          type: 'TEXT',
          category: 'THU_TUC',
          content: resolvedAnswerText.trim(),
          sourceName: 'Cán bộ Mặt trận duyệt câu trả lời',
          official: true,
          tags: ['faq', 'giải đáp', 'học tập ai'],
          rolesAllowed: ['PUBLIC', 'STAFF'],
          updatedAt: new Date().toISOString().split('T')[0],
          isActive: true
        });
        localStorage.setItem('chanh_hiep_ai_knowledge_docs_v2', JSON.stringify(kbDocs));
      }
    } catch (e) {}

    const updated = unanswered.map(u => u.id === id ? { ...u, resolved: true, resolvedAnswer: resolvedAnswerText } : u);
    setUnanswered(updated);
    try {
      localStorage.setItem(UNANSWERED_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}

    setAnsweringId(null);
    setResolvedAnswerText('');
    alert('Đã bổ sung câu trả lời vào Kho Tri thức đã duyệt! Lần tới AI sẽ trả lời câu hỏi này chính xác.');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-900/50">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-xs font-bold">
            <Activity className="w-3.5 h-3.5" />
            Giám sát Hiệu năng &amp; Học tập Tri thức (AI Monitor)
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
            GIÁM SÁT TRỢ LÝ AI &amp; HỌC TẬP TỰ ĐỘNG
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Theo dõi số lượt tra cứu, độ hài lòng của nhân dân, phân phối Intent và bổ sung câu trả lời cho các câu hỏi AI chưa giải đáp được.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 bg-white/10 rounded-2xl border border-white/20 text-center">
            <span className="text-[11px] text-slate-300 block">Độ hài lòng</span>
            <span className="text-xl font-black text-emerald-400">96.1%</span>
          </div>
          <div className="p-4 bg-white/10 rounded-2xl border border-white/20 text-center">
            <span className="text-[11px] text-slate-300 block">Tổng câu hỏi</span>
            <span className="text-xl font-black text-white">{stats.totalQueries}</span>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">RAG Retrieval Success</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.ragSuccessRate}%</div>
          <p className="text-[11px] text-slate-500 font-medium">Tỷ lệ truy xuất đúng văn bản &amp; thủ tục nội bộ</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">Tra cứu Real-time Web</span>
            <Globe className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-600">{stats.realtimeSearches} lượt</div>
          <p className="text-[11px] text-slate-500 font-medium">Số lần kích hoạt DuckDuckGo &amp; Google Search</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">Đánh giá của Người dân</span>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-emerald-600 font-bold">👍 {stats.feedbackThumbsUp}</span>
              <span className="text-slate-300">|</span>
              <span className="text-rose-600 font-bold">👎 {stats.feedbackThumbsDown}</span>
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">+{stats.feedbackThumbsUp - stats.feedbackThumbsDown} Net</div>
          <p className="text-[11px] text-slate-500 font-medium">Tỷ lệ phản hồi tích cực áp đảo</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">Cần Bổ sung Tri thức</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{stats.unansweredCount} câu hỏi</div>
          <p className="text-[11px] text-slate-500 font-medium">Các câu hỏi người dân hỏi chưa có trong data</p>
        </div>
      </div>

      {/* CRITICAL FEATURE: UNANSWERED QUESTIONS & LEARNING LOOP */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-500" />
              Câu hỏi Người dân cần Bổ sung Tri thức (Learning Loop)
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Khi cán bộ cung cấp câu trả lời chuẩn xác tại đây, hệ thống sẽ tự động re-index để AI trả lời tự động cho mọi người dân trong những lần sau.
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-black">
            {stats.unansweredCount} câu chưa xử lý
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {unanswered.map((item) => (
            <div key={item.id} className="py-4 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-[10.5px] font-bold">
                      {item.intent}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.timestamp}
                    </span>
                    {item.resolved && (
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Đã bổ sung tri thức
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-slate-900">
                    "{item.query}"
                  </h4>
                </div>

                {!item.resolved && (
                  <button
                    onClick={() => {
                      setAnsweringId(answeringId === item.id ? null : item.id);
                      setResolvedAnswerText('');
                    }}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-black shadow-xs hover:from-blue-700 hover:to-indigo-700 cursor-pointer shrink-0 transition-all"
                  >
                    {answeringId === item.id ? 'Đóng' : 'Bổ sung câu trả lời'}
                  </button>
                )}
              </div>

              {item.resolved && item.resolvedAnswer && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs text-emerald-950 font-medium">
                  <span className="font-black text-emerald-900 block mb-1">Câu trả lời chuẩn đã duyệt:</span>
                  {item.resolvedAnswer}
                </div>
              )}

              {/* Answering Form Box */}
              {answeringId === item.id && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in duration-150">
                  <label className="font-bold text-xs text-slate-900 block">
                    Nhập câu trả lời chuẩn xác của Cán bộ Mặt trận:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ví dụ: Lịch tiêm phòng vắc-xin tại Trạm Y tế Chánh Hiệp diễn ra vào ngày 15 và 25 hàng tháng. Người dân vui lòng mang theo Sổ tiêm chủng..."
                    value={resolvedAnswerText}
                    onChange={(e) => setResolvedAnswerText(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-medium outline-hidden focus:ring-2 focus:ring-blue-600 leading-relaxed"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setAnsweringId(null)}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => handleResolve(item.id)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Duyệt &amp; Nạp vào Bộ não AI
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
