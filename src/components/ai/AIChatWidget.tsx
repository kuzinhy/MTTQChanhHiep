import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, Loader2, RefreshCcw, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { AIMessage, ChatMessageItem } from './AIMessage';
import { AISuggestionChips } from './AISuggestionChips';
import { IntentRouter } from '../../lib/ai/intentRouter';
import { SourceRouter } from '../../lib/ai/sourceRouter';
import { MemoryService } from '../../lib/ai/memoryService';
import { WebsiteConnector } from '../../lib/ai/websiteConnector';
import { DriveConnector } from '../../lib/ai/driveConnector';
import { getApiUrl } from '../../lib/api';
import { OfficialDocument, Article, PublicOpinion } from '../../types';

interface AIChatWidgetProps {
  onNavigateRoute: (route: string, type?: string) => void;
  documents?: OfficialDocument[];
  articles?: Article[];
  opinions?: PublicOpinion[];
  neighborhoodNames?: string[];
}

export const AIChatWidget: React.FC<AIChatWidgetProps> = ({ 
  onNavigateRoute,
  documents = [],
  articles = [],
  opinions = [],
  neighborhoodNames = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Đang tra cứu...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [session, setSession] = useState(() => MemoryService.getSession());
  const [messages, setMessages] = useState<ChatMessageItem[]>(() => {
    const s = MemoryService.getSession();
    if (s.messages.length > 0) {
      return s.messages.map((m, idx) => ({
        id: 'msg-' + idx,
        sender: m.role,
        text: m.content,
        timestamp: m.timestamp || new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        sources: m.sources,
        actions: m.actions
      }));
    }
    return [
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'Trợ lý AI Phường Chánh Hiệp xin chào bạn 👋 Bạn cần tôi hỗ trợ gì?',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        actions: [
          { type: 'OPEN_ROUTE', label: 'Gửi phản ánh', route: '/phan-anh' },
          { type: 'OPEN_ROUTE', label: 'Tra cứu văn bản', route: '/van-ban' },
          { type: 'OPEN_ROUTE', label: 'Bản đồ 21 khu phố', route: '/ban-do' }
        ]
      }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessageItem = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);
    setErrorMessage(null);

    // 1. INTENT CLASSIFIER (Micro-rules / 0ms)
    const intentResult = IntentRouter.classify(query, session);

    // If Direct response is available (Greeting / Thanks / Goodbye / Casual / Direct Lookup)
    if (intentResult.directResponse) {
      setTimeout(() => {
        const isOfficialInfo = intentResult.intent === 'LOCAL_INFO' || intentResult.intent === 'PUBLIC_SERVICE' || intentResult.intent === 'SOCIAL_SUPPORT';
        const assistantMsg: ChatMessageItem = {
          id: 'ast-' + Date.now(),
          sender: 'assistant',
          text: intentResult.directResponse!.answer,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          sources: isOfficialInfo ? [{ name: 'Cổng thông tin & Mặt trận Phường Chánh Hiệp', url: '/gioi-thieu', official: true }] : [],
          actions: intentResult.directResponse!.actions || []
        };
        const finalMsgs = [...updatedMessages, assistantMsg];
        setMessages(finalMsgs);
        setIsLoading(false);

        // Update memory
        MemoryService.addMessage(session, 'user', query, { intent: intentResult.intent, entities: intentResult.extractedEntities });
        MemoryService.addMessage(session, 'assistant', assistantMsg.text, {
          intent: intentResult.intent,
          sources: assistantMsg.sources,
          actions: assistantMsg.actions
        });
      }, 100);
      return;
    }

    // 2. SOURCE ROUTING & DATA PACKAGING
    const routingPlan = SourceRouter.plan(intentResult.intent);
    if (routingPlan.primaryLayer === 'INTERNET') {
      setLoadingText('Đang tra cứu dữ liệu mới nhất...');
    } else if (routingPlan.primaryLayer === 'GOOGLE_DRIVE') {
      setLoadingText('Đang rà quét tài liệu Drive...');
    } else {
      setLoadingText('Đang tra cứu cơ sở dữ liệu...');
    }

    try {
      // Normalize website items
      const normalizedWebItems = WebsiteConnector.normalizeAll({
        documents,
        articles,
        opinions,
        neighborhoodNames
      });

      // Read indexed drive files
      const driveFiles = DriveConnector.getIndexedFiles();

      // Read Knowledge Base from localStorage
      let customKnowledge: any[] = [];
      try {
        const raw = localStorage.getItem('chanh_hiep_ai_knowledge_docs_v2');
        if (raw) customKnowledge = JSON.parse(raw);
      } catch (e) {
        console.warn('Error reading custom knowledge:', e);
      }

      // API Call to /api/ai/chat
      const response = await fetch(getApiUrl('/api/ai/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          sessionId: session.sessionId,
          intent: intentResult.intent,
          entities: intentResult.extractedEntities,
          history: session.messages,
          routingPlan,
          websiteItems: normalizedWebItems,
          driveFiles,
          knowledgeItems: customKnowledge
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const assistantText = data.answer || data.result || 'Hệ thống đang bận, xin vui lòng thử lại sau.';
      const sources = data.sources || [];
      const actions = (data.actions && data.actions.length > 0) ? data.actions : routingPlan.targetActions;

      const assistantMsg: ChatMessageItem = {
        id: 'ast-' + Date.now(),
        sender: 'assistant',
        text: assistantText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        sources,
        actions,
        chainOfThought: data.chainOfThought || {
          searchKnowledge: 'Đã rà quét Kho tri thức, Văn bản chỉ đạo & Thư mục Google Drive [1Vw365JIFDuUFT1AwF-MoJD8kKkvhiLH_]',
          synthesizeContext: 'Đã tổng hợp căn cứ pháp lý và dữ liệu chính thức',
          draftResponse: 'Đã hoàn thiện văn bản trả lời chuẩn mực'
        }
      };

      const finalMsgs = [...updatedMessages, assistantMsg];
      setMessages(finalMsgs);

      // Save to memory
      MemoryService.addMessage(session, 'user', query, {
        intent: intentResult.intent,
        entities: intentResult.extractedEntities
      });
      MemoryService.addMessage(session, 'assistant', assistantText, {
        intent: intentResult.intent,
        topic: intentResult.extractedEntities.realtimeSubject || intentResult.extractedEntities.neighborhood,
        sources,
        actions
      });

    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage('Trợ lý đang tạm thời chưa lấy được dữ liệu. Bạn thử lại sau nhé.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    const freshSession = MemoryService.clearSession();
    setSession(freshSession);
    const welcomeMsg: ChatMessageItem = {
      id: 'welcome-' + Date.now(),
      sender: 'assistant',
      text: 'Trợ lý AI Phường Chánh Hiệp xin chào bạn 👋 Bạn cần tôi hỗ trợ gì?',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      actions: [
        { type: 'OPEN_ROUTE', label: 'Gửi phản ánh', route: '/phan-anh' },
        { type: 'OPEN_ROUTE', label: 'Tra cứu văn bản', route: '/van-ban' },
        { type: 'OPEN_ROUTE', label: 'Bản đồ 21 khu phố', route: '/ban-do' }
      ]
    };
    setMessages([welcomeMsg]);
  };

  const handleFeedback = async (messageId: string, feedback: 'like' | 'dislike', reason?: string) => {
    try {
      await fetch(getApiUrl('/api/ai/feedback'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          sessionId: session.sessionId,
          feedback,
          reason,
          timestamp: new Date().toISOString()
        })
      });
    } catch (e) {
      console.warn('Feedback log error:', e);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 pl-3 pr-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/80"
        >
          <div className="w-9 h-9 rounded-full bg-white text-blue-600 flex items-center justify-center shrink-0 shadow-md">
            <Bot className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left pr-1">
            <div className="font-black text-xs text-white leading-tight flex items-center gap-1.5">
              <span>Trợ lý AI Phường Chánh Hiệp</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-[10px] text-blue-100 font-medium leading-tight">Hỏi đáp • Tra cứu • Hỗ trợ người dân</div>
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Expanded Chat Dialog */}
      {isOpen && (
        <div
          className={`bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden text-slate-900 animate-in fade-in slide-in-from-bottom-5 duration-300 transition-all ${
            isExpanded
              ? 'w-[96vw] sm:w-[680px] h-[86vh] max-h-[780px]'
              : 'w-[92vw] sm:w-[420px] h-[580px]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-3.5 flex items-center justify-between border-b border-indigo-950/40">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-amber-300 rounded-2xl shadow-sm border border-blue-400/30">
                <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div>
                <h3 className="font-black text-xs text-white flex items-center gap-1.5">
                  <span>Trợ lý AI Phường Chánh Hiệp</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500 text-white text-[9px] font-bold rounded-md">Online</span>
                </h3>
                <p className="text-[10px] text-indigo-200 font-medium">
                  Hỏi đáp • Tra cứu • Hỗ trợ người dân
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Làm mới cuộc trò chuyện"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Thu gọn' : 'Toàn màn hình'}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Đóng cửa sổ"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <AISuggestionChips onSelectChip={(chip) => handleSendMessage(chip)} />

          {/* Message Stream Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gradient-to-b from-slate-50/50 to-white text-xs">
            {messages.map((msg) => (
              <AIMessage
                key={msg.id}
                message={msg}
                onActionClick={(route, type) => {
                  if (type === 'OPEN_EXTERNAL' || route.startsWith('http')) {
                    window.open(route, '_blank');
                  } else {
                    onNavigateRoute(route, type);
                  }
                }}
                onFeedback={handleFeedback}
              />
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-blue-700 font-bold p-3 bg-blue-50/90 rounded-2xl border border-blue-200 w-max my-2 shadow-xs animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>{loadingText}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs space-y-2 my-2">
                <p>{errorMessage}</p>
                <button
                  onClick={() => handleSendMessage(messages[messages.length - 2]?.text || 'xin chào')}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-bold shadow-xs transition-all cursor-pointer"
                >
                  <RefreshCcw className="w-3 h-3" />
                  <span>Thử lại</span>
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2 shadow-lg"
          >
            <input
              type="text"
              placeholder="Hỏi Trợ lý AI Phường Chánh Hiệp..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-medium"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-2xl transition-all shadow-md cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
