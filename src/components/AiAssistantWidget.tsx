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
  ChevronDown
} from 'lucide-react';

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

    try {
      const response = await fetch('/api/ai/knowledge-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() })
      });

      if (!response.ok) {
        throw new Error('Không thể kết nối với dịch vụ Trợ lý AI.');
      }

      const data = await response.json();
      const aiReply = data.answer || 'Tôi đã tiếp nhận câu hỏi của bạn. Hệ thống đang đồng bộ dữ liệu với Kho văn bản Mặt trận Phường Chánh Hiệp.';

      setMessages(prev => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: 'ai-err-' + Date.now(),
          sender: 'ai',
          text: 'Rất tiếc, đã có sự cố kết nối với Trợ lý AI. Vui lòng thử lại sau giây lát hoặc gửi Ý kiến Dân sinh trực tiếp.',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
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
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
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
