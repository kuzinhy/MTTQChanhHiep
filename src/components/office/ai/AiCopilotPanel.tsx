import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  RefreshCw, 
  FileCheck, 
  HelpCircle, 
  ShieldAlert, 
  ListChecks, 
  Loader2,
  Copy,
  Check
} from 'lucide-react';
import { aiWorkspaceService } from '../../../lib/aiWorkspaceService';

interface AiCopilotPanelProps {
  documentTitle: string;
  documentContent: string;
  onApplyToDocument?: (textToAppendOrReplace: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiCopilotPanel: React.FC<AiCopilotPanelProps> = ({
  documentTitle,
  documentContent,
  onApplyToDocument,
  isOpen,
  onToggle
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Xin chào đồng chí! Tôi là **Trợ lý Copilot MTTQ**. Tôi có thể hỗ trợ rà soát văn bản "${documentTitle || 'hiện tại'}", giải thích quy định, gợi ý căn cứ pháp lý hoặc đề xuất chỉnh sửa trực tiếp.`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const quickPrompts = [
    'Rà soát lỗi thể thức theo NĐ 30',
    'Tóm tắt 3 ý chính của văn bản',
    'Gợi ý nơi nhận và đơn vị phối hợp',
    'Kiểm tra tính khả thi của tiến độ'
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await aiWorkspaceService.callAiTool('qa-document', {
        documentText: documentContent || 'Chưa có nội dung văn bản.',
        docName: documentTitle || 'Văn bản đang mở',
        question: textToSend
      });

      const assistantMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: res.answer || 'Không thể tạo phản hồi.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: `Đã xảy ra lỗi: ${err.message || 'Không thể kết nối máy chủ AI'}.`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-gradient-to-b from-blue-600 to-indigo-700 text-white p-2.5 rounded-l-2xl shadow-xl shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-600 transition-all flex flex-col items-center gap-1.5 border-l border-t border-b border-cyan-400/40 cursor-pointer"
        title="Mở Trợ lý Copilot"
      >
        <Sparkles className="w-5 h-5 animate-pulse text-cyan-300" />
        <span className="text-[11px] font-bold tracking-wider [writing-mode:vertical-lr] rotate-180 uppercase text-cyan-100">
          AI Copilot
        </span>
        <ChevronLeft className="w-4 h-4 text-cyan-200" />
      </button>
    );
  }

  return (
    <div className="w-80 md:w-96 bg-white border-l border-blue-100 flex flex-col h-full shadow-2xl z-30 animate-fadeIn shrink-0">
      {/* Copilot Header */}
      <div className="p-3.5 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white flex items-center justify-between border-b border-blue-900/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold flex items-center gap-1.5 text-white">
              <span>Trợ lý Copilot MTTQ</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </h4>
            <p className="text-[11px] text-blue-200/80">Trợ lý tham mưu trực tiếp</p>
          </div>
        </div>

        <button
          onClick={onToggle}
          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
          title="Thu gọn"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompts Chips */}
      <div className="p-2.5 bg-blue-50/50 border-b border-blue-100">
        <p className="text-[11px] font-semibold text-blue-900 uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-blue-600" /> Gợi ý nhanh:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="text-xs bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-all text-left shadow-2xs cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-xl p-3 text-xs leading-relaxed shadow-2xs ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-blue-500/20'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>

              {m.sender === 'assistant' && (
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{m.timestamp}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyText(m.id, m.text)}
                      className="p-1 hover:text-slate-700 transition-colors"
                      title="Sao chép"
                    >
                      {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                    {onApplyToDocument && (
                      <button
                        onClick={() => onApplyToDocument(m.text)}
                        className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-xs hover:bg-blue-100 font-medium"
                      >
                        Chèn vào bài
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-blue-100 text-xs text-blue-600 max-w-[80%] shadow-2xs">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span>AI đang tra cứu và xử lý...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-2.5 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            placeholder="Hỏi AI về văn bản hoặc quy định..."
            className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-hidden focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
