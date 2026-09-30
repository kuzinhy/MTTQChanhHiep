import React, { useState } from 'react';
import { Bot, User, ThumbsUp, ThumbsDown, Copy, Check, MessageSquareWarning, Volume2, VolumeX } from 'lucide-react';
import { AISourceCard } from './AISourceCard';
import { AIActionButton } from './AIActionButton';
import { AISource, AIAction } from '../../lib/ai/types';

export interface ChatMessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: AISource[];
  actions?: AIAction[];
  feedback?: 'like' | 'dislike';
  feedbackReason?: string;
}

interface AIMessageProps {
  message: ChatMessageItem;
  onActionClick: (route: string, type?: string) => void;
  onFeedback: (messageId: string, feedback: 'like' | 'dislike', reason?: string) => void;
}

export const AIMessage: React.FC<AIMessageProps> = ({ message, onActionClick, onFeedback }) => {
  const isUser = message.sender === 'user';
  const [feedbackGiven, setFeedbackGiven] = useState<'like' | 'dislike' | null>(message.feedback || null);
  const [showDislikeModal, setShowDislikeModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown bold symbols and brackets for speech
    const cleanSpeechText = message.text.replace(/[*_#`[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectDislikeReason = (reason: string) => {
    setFeedbackGiven('dislike');
    setShowDislikeModal(false);
    onFeedback(message.id, 'dislike', reason);
  };

  return (
    <div className={`flex gap-2.5 my-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-800 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 border border-white/20">
          <Bot className="w-4 h-4 text-amber-300" />
        </div>
      )}

      <div className={`max-w-[86%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-xs transition-all ${
            isUser
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs font-bold shadow-blue-500/10'
              : 'bg-white border border-slate-200/90 text-slate-900 rounded-tl-xs shadow-2xs hover:border-blue-200'
          }`}
        >
          <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>

          {!isUser && (
            <>
              <AISourceCard sources={message.sources || []} />
              <AIActionButton actions={message.actions || []} onActionClick={onActionClick} />

              {/* Footer: Copy, Speech & Feedback */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer font-medium px-1.5 py-0.5 rounded-md bg-slate-50 hover:bg-blue-50"
                    title="Sao chép nội dung"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                  </button>

                  <button
                    onClick={handleSpeak}
                    className={`inline-flex items-center gap-1 transition-colors cursor-pointer font-medium px-1.5 py-0.5 rounded-md ${
                      isSpeaking ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600'
                    }`}
                    title={isSpeaking ? 'Dừng đọc' : 'Đọc câu trả lời'}
                  >
                    {isSpeaking ? <VolumeX className="w-3 h-3 text-amber-600" /> : <Volume2 className="w-3 h-3" />}
                    <span>{isSpeaking ? 'Dừng' : 'Đọc'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 relative">
                  <span className="text-[9px]">Hài lòng?</span>
                  <button
                    onClick={() => {
                      setFeedbackGiven('like');
                      onFeedback(message.id, 'like');
                    }}
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      feedbackGiven === 'like' ? 'text-emerald-600 font-bold bg-emerald-50 border border-emerald-200' : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title="Hài lòng"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setShowDislikeModal(!showDislikeModal)}
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      feedbackGiven === 'dislike' ? 'text-rose-600 font-bold bg-rose-50 border border-rose-200' : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title="Chưa hài lòng"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Dislike Reason Dropdown Modal */}
                  {showDislikeModal && (
                    <div className="absolute right-0 bottom-6 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 w-48 z-30 space-y-1.5 text-left text-[11px] animate-in fade-in duration-150">
                      <div className="font-bold text-slate-700 flex items-center gap-1 text-[10px] pb-1 border-b border-slate-100">
                        <MessageSquareWarning className="w-3 h-3 text-rose-500" />
                        Lý do chưa hài lòng:
                      </div>
                      {['Sai thông tin', 'Thiếu nội dung', 'Không đúng câu hỏi', 'Nguồn chưa đúng', 'Quá dài dòng'].map((reason, rIdx) => (
                        <button
                          key={rIdx}
                          onClick={() => handleSelectDislikeReason(reason)}
                          className="w-full text-left px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-700 font-medium transition-colors"
                        >
                          • {reason}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <span className="text-[9px] text-slate-400 font-mono px-1 block">
          {message.timestamp}
        </span>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 border border-white/20">
          <User className="w-4 h-4 text-amber-300" />
        </div>
      )}
    </div>
  );
};
