import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  Loader2, 
  MessageSquare, 
  FileText, 
  HelpCircle,
  Building2,
  ChevronDown,
  Activity,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import { AppStorageEngine } from '../lib/storage';
import { CloudDatabase } from '../lib/firestoreService';
import { getApiUrl } from '../lib/api';
import { queryGeminiWithFallback, SearchTraceLog } from '../lib/geminiClient';
import { AiChatLog } from '../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastTraces, setLastTraces] = useState<SearchTraceLog[]>([]);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ lý AI Thông minh của Ủy ban MTTQ Việt Nam Phường Chánh Hiệp. Tôi có thể hỗ trợ bạn tra cứu văn bản chỉ đạo, thủ tục an sinh xã hội, đăng ký hỗ trợ dân sinh hoặc quy định tiếp dân.',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    // Gather RAG context from local storage cache
    const docs = AppStorageEngine.getDocuments() || [];
    const docContext = docs
      .map(d => `${d.codeNumber}: ${d.title} [Người ký: ${d.signer || 'Không rõ'}, Lĩnh vực: ${d.field || 'Không rõ'}]`)
      .join('\n');

    const notes = AppStorageEngine.getKnowledgeNotes() || [];
    const notesString = notes
      .filter(n => n.status === 'APPROVED')
      .map(n => `HỎI: ${n.question}\nĐÁP: ${n.answer}`)
      .join('\n\n');

    try {
      console.log('[AI Assistant Widget] Querying integrated Gemini SDK system with fallback layers...');
      const { text: aiReply, logs } = await queryGeminiWithFallback(query.trim(), docContext, notesString);
      setLastTraces(logs);

      setMessages(prev => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      const wasOffline = logs.some(l => l.methodTried === 'OFFLINE_RAG' && l.status === 'SUCCESS');

      // Save to chat log database
      const currentStaffUser = AppStorageEngine.getCurrentUser();
      const newLog: AiChatLog = {
        id: (wasOffline ? 'chat-offline-' : 'chat-') + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        query: query.trim(),
        response: aiReply,
        timestamp: new Date().toISOString(),
        userId: currentStaffUser?.id,
        userName: currentStaffUser?.fullname || 'Người dân Phường Chánh Hiệp' + (wasOffline ? ' (Ngoại tuyến)' : ''),
        isStaff: !!currentStaffUser,
        category: wasOffline ? 'Hỏi đáp nhân dân (Ngoại tuyến)' : 'Hỏi đáp nhân dân'
      };

      // Sync locally and trigger cloud save
      const currentChats = AppStorageEngine.getAiChats() || [];
      AppStorageEngine.saveAiChats([newLog, ...currentChats]);
      CloudDatabase.saveAiChat(newLog).catch(e => console.warn('Background sync error:', e));

    } catch (err: any) {
      console.error('[AI Assistant Widget] Critical execution boundary error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Quy trình gửi ý kiến trợ cấp dân sinh',
    'Xem văn bản Mặt trận mới nhất',
    'Thời gian tiếp công dân của Mặt trận',
    'Tiêu chuẩn xây dựng Nhà Đại đoàn kết'
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-blue-400/40"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white animate-ping" />
          </div>
          <span className="font-extrabold text-xs tracking-tight">Trợ lý AI Mặt trận</span>
        </button>
      )}

      {/* Expanded Chat Dialog */}
      {isOpen && (
        <div className="bg-white w-[92vw] sm:w-[380px] h-[520px] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-900 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-3.5 flex items-center justify-between border-b border-blue-900">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-600 text-amber-300 rounded-xl shadow-xs border border-blue-400/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-xs text-white flex items-center gap-1.5">
                  <span>Trợ lý AI Mặt trận Chánh Hiệp</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500 text-white text-[9px] font-bold rounded-md">Online</span>
                </h3>
                <p className="text-[10px] text-blue-200 font-medium">
                  Giải đáp thủ tục dân sinh & tra cứu văn bản
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                title="Chẩn đoán kết nối AI"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  showDiagnostics ? 'text-amber-400 bg-white/15' : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Terminal className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-blue-50/70 p-2 border-b border-blue-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px] font-bold">
            <span className="text-blue-900 shrink-0 font-black flex items-center gap-1 pl-1">
              <HelpCircle className="w-3 h-3 text-blue-600" />
              Gợi ý:
            </span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-2 py-1 bg-white hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg border border-blue-200/80 transition-all shrink-0 cursor-pointer shadow-2xs font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Diagnostics Panel */}
          {showDiagnostics && (
            <div className="bg-slate-950 text-emerald-400 font-mono p-3 text-[10px] space-y-2 border-b border-slate-800 max-h-[220px] overflow-y-auto shrink-0 select-text">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5 mb-1.5">
                <span className="font-bold flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  NHẬT KÝ KẾT NỐI SẢN XUẤT (VERCEL)
                </span>
                <button 
                  onClick={() => setLastTraces([])}
                  className="text-[9px] hover:text-white underline cursor-pointer"
                >
                  Xóa log
                </button>
              </div>

              {lastTraces.length === 0 ? (
                <div className="text-slate-500 italic py-2">
                  Chưa có cuộc gọi AI nào được kích hoạt trong phiên này. Hãy gửi một câu hỏi để xem chi tiết chẩn đoán kết nối.
                </div>
              ) : (
                <div className="space-y-2">
                  {lastTraces.map((trace, idx) => (
                    <div key={idx} className="border-b border-slate-900 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center gap-1.5 font-bold">
                        {trace.status === 'SUCCESS' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                        )}
                        <span className="text-amber-300">[{trace.methodTried}]</span>
                        <span className={trace.status === 'SUCCESS' ? 'text-emerald-400' : 'text-red-400'}>
                          {trace.status} ({trace.durationMs}ms)
                        </span>
                      </div>
                      <div className="text-slate-400 mt-0.5">
                        <span className="text-slate-500">Thời gian:</span> {new Date(trace.timestamp).toLocaleTimeString()} | 
                        <span className="text-slate-500"> Mạng:</span> {trace.networkOnline ? 'ONLINE' : 'OFFLINE'}
                      </div>
                      <div className="text-slate-300 mt-1 pl-2 border-l border-slate-800 break-words font-sans text-[11px]">
                        <span className="font-mono text-[9px] text-slate-500 block">Nội dung hỏi:</span>
                        "{trace.query}"
                      </div>
                      {trace.errorDetails && (
                        <div className="text-red-400 mt-1.5 bg-red-950/40 p-1.5 rounded-lg border border-red-900/30 font-sans text-[9px] whitespace-pre-wrap break-all select-all">
                          <span className="font-mono font-bold text-red-300 block">CHI TIẾT LỖI PRODUCTION:</span>
                          {trace.errorDetails}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-[9px] text-slate-500 border-t border-slate-900 pt-1.5 flex flex-col gap-0.5">
                <div>• Đường dẫn API: <span className="text-slate-400 break-all">{getApiUrl('/api/ai/knowledge-search')}</span></div>
                <div>• Client SDK Support: <span className="text-amber-500 font-bold">{(import.meta as any).env?.VITE_GEMINI_API_KEY ? 'YES' : 'NO (Sử dụng API Server)'}</span></div>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/60 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <Bot className="w-4 h-4 text-amber-300" />
                  </div>
                )}
                <div className={`max-w-[80%] space-y-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-xs font-bold'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono px-1 block">
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <User className="w-4 h-4 text-amber-300" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-blue-700 font-bold p-2 bg-blue-50/80 rounded-xl border border-blue-200 w-max">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Trợ lý AI đang tra cứu dữ liệu...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Hỏi AI về thủ tục, văn bản..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-medium"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
