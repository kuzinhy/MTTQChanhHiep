import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, Loader2, RefreshCcw, Maximize2, Minimize2, RotateCcw, Mail, User, Phone, HelpCircle, CheckCircle2 } from 'lucide-react';
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
  const [loadingText, setLoadingText] = useState('Đang hiểu yêu cầu...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      setLoadingText('Đang hiểu yêu cầu...');
      return;
    }
    const SAFE_STATUSES = [
      'Đang hiểu yêu cầu...',
      'Đang tra cứu dữ liệu Phường Chánh Hiệp...',
      'Đang kiểm tra văn bản liên quan...',
      'Đang đối chiếu nguồn...',
      'Đang tổng hợp câu trả lời...'
    ];
    let idx = 0;
    setLoadingText(SAFE_STATUSES[0]);
    const timer = setInterval(() => {
      idx = (idx + 1) % SAFE_STATUSES.length;
      setLoadingText(SAFE_STATUSES[idx]);
    }, 1100);
    return () => clearInterval(timer);
  }, [isLoading]);

  // Forward Question to Admin State
  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
  const [forwardCitizenName, setForwardCitizenName] = useState('');
  const [forwardCitizenPhone, setForwardCitizenPhone] = useState('');
  const [forwardQuestionText, setForwardQuestionText] = useState('');
  const [isSubmittingForward, setIsSubmittingForward] = useState(false);
  const [forwardSuccess, setForwardSuccess] = useState(false);

  const handleOpenForwardModal = (customQuery?: string) => {
    setForwardQuestionText(customQuery || inputQuery || 'Cần Cán bộ Phường giải đáp trực tiếp thủ tục / chính sách');
    setForwardSuccess(false);
    setIsForwardModalOpen(true);
  };

  const handleSubmitForwardQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forwardQuestionText.trim()) return;

    setIsSubmittingForward(true);
    try {
      const res = await fetch(getApiUrl('/api/ai/unanswered'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: forwardQuestionText.trim(),
          citizenName: forwardCitizenName.trim() || 'Bà con Phường Chánh Hiệp',
          citizenPhone: forwardCitizenPhone.trim(),
          context: 'Gửi từ cửa sổ Chatbot Trợ lý AI Phường Chánh Hiệp'
        })
      });

      if (res.ok) {
        setForwardSuccess(true);
        const confirmMsg: ChatMessageItem = {
          id: 'forward-' + Date.now(),
          sender: 'assistant',
          text: `Dạ, Cán bộ Phường đã ghi nhận câu hỏi của bác/anh/chị: "${forwardQuestionText}".\n\nSĐT nhận phản hồi: **${forwardCitizenPhone || 'Chưa cung cấp'}**.\nCán bộ Thường trực Phường Chánh Hiệp sẽ chủ động kiểm tra và liên hệ giải đáp sớm nhất!`,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          actions: [{ type: 'OPEN_ROUTE', label: 'Xem tin tức Phường', route: '/tin-tuc' }]
        };
        setMessages(prev => [...prev, confirmMsg]);
        setTimeout(() => {
          setIsForwardModalOpen(false);
          setForwardSuccess(false);
        }, 1800);
      }
    } catch (err) {
      console.error('Forward error:', err);
    } finally {
      setIsSubmittingForward(false);
    }
  };

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
        text: 'Cán bộ Số hỗ trợ người dân Phường Chánh Hiệp xin kính chào bác/anh/chị! 👋 Tôi có thể hỗ trợ bác/anh/chị tư vấn thủ tục hành chính, tra cứu văn bản hay hướng dẫn dịch vụ nào hôm nay?',
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
        actions
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
      text: 'Cán bộ Số hỗ trợ người dân Phường Chánh Hiệp xin kính chào bác/anh/chị! 👋 Tôi có thể hỗ trợ bác/anh/chị tư vấn thủ tục hành chính, tra cứu văn bản hay hướng dẫn dịch vụ nào hôm nay?',
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
              <span>CÁN BỘ SỐ HỖ TRỢ NGƯỜI DÂN</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-[10px] text-blue-100 font-medium leading-tight">Dịch vụ công • Tra cứu • Dân nguyện 21 Khu phố</div>
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
                  <span>CÁN BỘ SỐ HỖ TRỢ NGƯỜI DÂN</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500 text-white text-[9px] font-bold rounded-md">Phường Chánh Hiệp</span>
                </h3>
                <p className="text-[10px] text-indigo-200 font-medium">
                  Tận tụy • Tra cứu • Hướng dẫn dịch vụ công
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleOpenForwardModal()}
                title="Gửi câu hỏi chưa rõ cho Cán bộ Phường trả lời"
                className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[10.5px] rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-xs mr-1 active:scale-95"
              >
                <Mail className="w-3.5 h-3.5 text-slate-950" />
                <span>Gửi Cán bộ</span>
              </button>

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
              placeholder="Hỏi Cán bộ Số Phường Chánh Hiệp..."
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

      {/* FORWARD QUESTION TO ADMIN MODAL */}
      {isForwardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5 text-indigo-700 font-black text-sm">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <Mail className="w-5 h-5 text-indigo-600" />
                </div>
                <span>Gửi Câu Hỏi Cho Cán Bộ Phường Giải Đáp</span>
              </div>
              <button
                type="button"
                onClick={() => setIsForwardModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forwardSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="font-bold text-xs text-emerald-900">Đã gửi câu hỏi về Admin thành công!</h4>
                <p className="text-[11px] text-emerald-700">Cán bộ Thường trực Phường Chánh Hiệp sẽ liên hệ trả lời bạn sớm nhất.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitForwardQuestion} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nội dung câu hỏi / thắc mắc (*):</label>
                  <textarea
                    rows={3}
                    value={forwardQuestionText}
                    onChange={(e) => setForwardQuestionText(e.target.value)}
                    required
                    placeholder="Nhập nội dung quy trình, thủ tục hoặc ý kiến cần cán bộ phường giải đáp..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Họ và tên người gửi:</label>
                    <input
                      type="text"
                      value={forwardCitizenName}
                      onChange={(e) => setForwardCitizenName(e.target.value)}
                      placeholder="Bà con Phường Chánh Hiệp..."
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Số điện thoại Zalo/LH (*):</label>
                    <input
                      type="tel"
                      value={forwardCitizenPhone}
                      onChange={(e) => setForwardCitizenPhone(e.target.value)}
                      required
                      placeholder="0989xxx..."
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Câu hỏi của bác/anh/chị sẽ tự động được gửi về trang **Quản trị Admin Phường**. Khi cán bộ duyệt câu hỏi, AI sẽ tự động học câu trả lời cho cả cộng đồng!
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsForwardModalOpen(false)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingForward}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingForward ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Gửi Cán Bộ Phường</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
