import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  UserCheck, 
  BookOpen, 
  Search, 
  Filter, 
  AlertTriangle,
  ArrowRight,
  Database,
  Sparkles
} from 'lucide-react';
import { UnansweredQuery } from '../../lib/ai/types';
import { ContactService } from '../../lib/ai/contactService';

const UNANSWERED_STORAGE_KEY = 'chanh_hiep_ai_unanswered_queries_v3';

const INITIAL_UNANSWERED: UnansweredQuery[] = [
  {
    id: 'unans-01',
    question: 'Lịch tiêm phòng vắc-xin cho trẻ em tháng 10 tại Trạm y tế Chánh Hiệp?',
    intent: 'PUBLIC_SERVICE',
    context: 'Người dân hỏi về lịch tiêm chủng định kỳ',
    sourcesSearched: ['WEBSITE', 'KNOWLEDGE_BASE'],
    createdAt: '2026-09-30 08:15',
    status: 'PENDING'
  },
  {
    id: 'unans-02',
    question: 'Chính sách hỗ trợ thanh niên xuất ngũ lập nghiệp năm 2026 của phường?',
    intent: 'VOLUNTEER',
    context: 'Hỏi về vốn vay khởi nghiệp Đoàn thanh niên',
    sourcesSearched: ['WEBSITE', 'DRIVE'],
    createdAt: '2026-09-29 16:40',
    status: 'PENDING'
  },
  {
    id: 'unans-03',
    question: 'Địa chỉ nộp hồ sơ xin cấp đổi số nhà tại Khu phố Mỹ Hảo 3?',
    intent: 'MAP_QUERY',
    context: 'Người dân cần cấp biển số nhà mới',
    sourcesSearched: ['WEBSITE', 'MAP'],
    createdAt: '2026-09-28 11:20',
    status: 'PENDING'
  }
];

export const AiUnansweredAdminView: React.FC = () => {
  const [queries, setQueries] = useState<UnansweredQuery[]>(() => {
    try {
      const raw = localStorage.getItem(UNANSWERED_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return INITIAL_UNANSWERED;
  });

  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'RESOLVED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [resolvedText, setResolvedText] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<string>('ct-huy-doan');

  const contacts = ContactService.getAllContacts();

  useEffect(() => {
    try {
      localStorage.setItem(UNANSWERED_STORAGE_KEY, JSON.stringify(queries));
    } catch (e) {}
  }, [queries]);

  const handleResolveAsAnswer = (id: string) => {
    if (!resolvedText.trim()) return;

    // Inject into Knowledge base directly
    try {
      const rawKb = localStorage.getItem('chanh_hiep_ai_knowledge_docs_v2');
      const kbDocs = rawKb ? JSON.parse(rawKb) : [];
      const item = queries.find(q => q.id === id);
      if (item) {
        kbDocs.unshift({
          id: 'kb-' + Date.now(),
          title: `FAQ: ${item.question}`,
          type: 'TEXT',
          category: 'THU_TUC',
          content: resolvedText.trim(),
          sourceName: 'Cán bộ Mặt trận Phường Chánh Hiệp đã duyệt',
          official: true,
          tags: ['faq', 'giải đáp', 'học tập tri thức'],
          rolesAllowed: ['PUBLIC', 'STAFF'],
          updatedAt: new Date().toISOString().split('T')[0],
          isActive: true
        });
        localStorage.setItem('chanh_hiep_ai_knowledge_docs_v2', JSON.stringify(kbDocs));
      }
    } catch (e) {}

    const updated = queries.map(q => q.id === id ? { ...q, status: 'RESOLVED' as const, resolvedAnswer: resolvedText.trim() } : q);
    setQueries(updated);
    setAnsweringId(null);
    setResolvedText('');
    alert('Đã bổ sung câu trả lời vào Bộ não AI thành công! Trợ lý sẽ tự động trả lời câu hỏi này cho mọi người dân trong những lần sau.');
  };

  const handleAssignContact = (id: string) => {
    const updated = queries.map(q => q.id === id ? { ...q, assignedContactId: selectedContactId } : q);
    setQueries(updated);
    alert('Đã phân công cán bộ phụ trách tiếp nhận câu hỏi này.');
  };

  const filtered = queries.filter(q => {
    const matchesTab = activeTab === 'ALL' || (activeTab === 'PENDING' && q.status === 'PENDING') || (activeTab === 'RESOLVED' && q.status === 'RESOLVED');
    const matchesSearch = !searchTerm || q.question.toLowerCase().includes(searchTerm.toLowerCase()) || (q.context && q.context.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const pendingCount = queries.filter(q => q.status === 'PENDING').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-900/50">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-300 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            Vòng lặp Học tập Tri thức (Learning Loop)
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
            CÂU HỎI CHƯA CÓ TRONG BỘ NÃO AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Quản lý các câu hỏi người dân hỏi nhưng chưa có trong cơ sở dữ liệu. Cán bộ chỉ cần duyệt câu trả lời một lần, AI sẽ tự động học và trả lời cho toàn thể người dân.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 bg-amber-500/20 rounded-2xl border border-amber-400/30 text-center">
            <span className="text-[11px] text-amber-200 block">Cần bổ sung</span>
            <span className="text-2xl font-black text-amber-300">{pendingCount} câu</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm câu hỏi người dân..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL', label: 'Tất cả câu hỏi' },
            { id: 'PENDING', label: `Chưa xử lý (${pendingCount})` },
            { id: 'RESOLVED', label: 'Đã bổ sung tri thức' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Queries List */}
      <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
            <p className="text-xs font-medium">Không có câu hỏi nào cần xử lý trong mục này.</p>
          </div>
        ) : (
          filtered.map((q) => (
            <div key={q.id} className="p-5 space-y-3 hover:bg-slate-50/50 transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[10.5px] font-bold">
                      {q.intent}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {q.createdAt}
                    </span>
                    {q.status === 'RESOLVED' ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Đã nạp vào Bộ não AI
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Cần cán bộ duyệt
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-black text-slate-900 leading-snug">
                    "{q.question}"
                  </h3>
                  {q.context && (
                    <p className="text-xs text-slate-500 font-medium">Ngữ cảnh: {q.context}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {q.status === 'PENDING' && (
                    <button
                      onClick={() => {
                        setAnsweringId(answeringId === q.id ? null : q.id);
                        setResolvedText('');
                      }}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-black shadow-xs hover:from-blue-700 hover:to-indigo-700 cursor-pointer transition-all"
                    >
                      {answeringId === q.id ? 'Đóng' : 'Bổ sung câu trả lời'}
                    </button>
                  )}
                </div>
              </div>

              {q.status === 'RESOLVED' && q.resolvedAnswer && (
                <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-950 font-medium">
                  <span className="font-black text-emerald-900 block mb-1">Câu trả lời chuẩn đã duyệt &amp; lập chỉ mục:</span>
                  {q.resolvedAnswer}
                </div>
              )}

              {/* Answering Form Box */}
              {answeringId === q.id && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-xs text-slate-900">
                      Nhập câu trả lời chuẩn xác của Cán bộ Phường:
                    </label>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500">Cán bộ duyệt:</span>
                      <select
                        value={selectedContactId}
                        onChange={(e) => setSelectedContactId(e.target.value)}
                        className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                      >
                        {contacts.map((c) => (
                          <option key={c.id} value={c.id}>{c.name} ({c.title})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Ví dụ: Lịch tiêm phòng vắc-xin định kỳ tại Trạm Y tế Phường Chánh Hiệp diễn ra vào các ngày 10 và 20 hàng tháng..."
                    value={resolvedText}
                    onChange={(e) => setResolvedText(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-medium outline-hidden focus:ring-2 focus:ring-blue-600 leading-relaxed"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setAnsweringId(null)}
                      className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => handleResolveAsAnswer(q.id)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Duyệt &amp; Nạp vào Bộ não AI</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
