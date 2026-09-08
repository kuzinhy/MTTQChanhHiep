import React, { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import { speechSynthesisService } from './speechSynthesisService';
import { Mic, MicOff, Square, RotateCcw, Volume2, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

interface VoiceInputControlProps {
  value: string;
  onChange: (newValue: string) => void;
  maxLength?: number;
  disabled?: boolean;
}

export const VoiceInputControl: React.FC<VoiceInputControlProps> = ({
  value,
  onChange,
  maxLength = 2000,
  disabled = false
}) => {
  const {
    isSupported,
    state,
    isListening,
    finalTranscript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscripts
  } = useSpeechRecognition();

  // State to support Undo ("Hoàn tác phần vừa đọc")
  const [textBeforeVoice, setTextBeforeVoice] = useState<string | null>(null);
  const [showGuideTip, setShowGuideTip] = useState(false);
  const [guideTipDismissed, setGuideTipDismissed] = useState(() => {
    try {
      return localStorage.getItem('mttq_voice_tip_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const processedTranscriptRef = useRef('');

  // Handle new incoming final transcript items
  useEffect(() => {
    if (finalTranscript && finalTranscript !== processedTranscriptRef.current) {
      const newPart = finalTranscript.replace(processedTranscriptRef.current, '').trim();
      if (newPart) {
        onChangeTextWithSpeech(newPart);
      }
      processedTranscriptRef.current = finalTranscript;
    }
  }, [finalTranscript]);

  const onChangeTextWithSpeech = (newTextPart: string) => {
    // Save previous text for Undo functionality if not already saved in this session
    if (textBeforeVoice === null) {
      setTextBeforeVoice(value);
    }

    const trimmedOld = value.trim();
    const trimmedNew = newTextPart.trim();

    let combined = '';
    if (!trimmedOld) {
      combined = trimmedNew;
    } else {
      // Add sentence punctuation spacing if needed
      const lastChar = trimmedOld.slice(-1);
      if (['.', '!', '?', ';', ':'].includes(lastChar)) {
        combined = `${trimmedOld} ${trimmedNew}`;
      } else {
        combined = `${trimmedOld}. ${trimmedNew}`;
      }
    }

    // Respect maxLength
    if (combined.length > maxLength) {
      combined = combined.substring(0, maxLength);
    }

    onChange(combined);
  };

  const handleStartListening = () => {
    if (disabled) return;

    // Save initial state for Undo
    setTextBeforeVoice(value);
    processedTranscriptRef.current = '';

    // First time tip check
    if (!guideTipDismissed && !showGuideTip) {
      setShowGuideTip(true);
    }

    startListening();
  };

  const handleStopListening = () => {
    stopListening();
  };

  const handleUndoVoiceInput = () => {
    if (textBeforeVoice !== null) {
      onChange(textBeforeVoice);
      setTextBeforeVoice(null);
      resetTranscripts();
    }
  };

  const handleReadGuide = () => {
    speechSynthesisService.speakText(
      "Hướng dẫn: Bạn bấm nút Nói ý kiến, sau đó nói chậm và rõ bằng tiếng Việt. Khi nói xong, bấm nút Dừng. Nội dung sẽ tự động chuyển thành chữ để bạn kiểm tra và sửa đổi trước khi bấm Gửi."
    );
  };

  const dismissGuideTip = () => {
    setShowGuideTip(false);
    setGuideTipDismissed(true);
    try {
      localStorage.setItem('mttq_voice_tip_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  if (!isSupported) {
    return (
      <div className="mt-2 p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MicOff className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Trình duyệt này chưa hỗ trợ nhận dạng giọng nói. Bạn vẫn có thể nhập ý kiến bằng bàn phím.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2.5 space-y-3">
      {/* First-Time Guide Tip Banner */}
      {showGuideTip && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900 text-xs flex items-start justify-between gap-3 shadow-xs animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-slate-900">Hướng dẫn dành cho Ông/Bà &amp; Cử tri:</p>
              <p className="text-slate-700 leading-relaxed">
                Khi bấm <strong>"Nói ý kiến"</strong>, trình duyệt sẽ xin quyền dùng micro. Hãy bấm <strong>"Cho phép" (Allow)</strong>, sau đó đọc chậm và rõ. Lời nói sẽ tự động chuyển thành chữ. Ông/Bà có thể sửa bằng bàn phím trước khi gửi.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={dismissGuideTip}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 underline shrink-0 cursor-pointer p-1"
          >
            Đã hiểu
          </button>
        </div>
      )}

      {/* Control Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          {!isListening ? (
            <button
              type="button"
              onClick={handleStartListening}
              disabled={disabled}
              aria-label="Nhập nội dung ý kiến bằng giọng nói tiếng Việt"
              title="Nhấn để nói nội dung phản ánh bằng tiếng Việt"
              className="min-h-[44px] min-w-[44px] px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Mic className="w-5 h-5 text-white animate-bounce" />
              <span>🎙 Nói ý kiến</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStopListening}
              aria-label="Dừng nhận dạng giọng nói"
              title="Nhấn để dừng ghi âm"
              className="min-h-[44px] min-w-[44px] px-4 py-2.5 bg-slate-900 hover:bg-slate-950 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer ring-2 ring-red-500"
            >
              <Square className="w-4 h-4 text-red-400 fill-current" />
              <span>⏹ Dừng</span>
            </button>
          )}

          {/* Undo button */}
          {textBeforeVoice !== null && !isListening && (
            <button
              type="button"
              onClick={handleUndoVoiceInput}
              aria-label="Hoàn tác phần ý kiến vừa đọc bằng giọng nói"
              title="Khôi phục lại nội dung văn bản trước khi nói"
              className="min-h-[44px] px-3.5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-amber-300"
            >
              <RotateCcw className="w-4 h-4 text-amber-800" />
              <span>↶ Hoàn tác phần vừa đọc</span>
            </button>
          )}

          {/* Read Audio Guide button for elderly */}
          <button
            type="button"
            onClick={handleReadGuide}
            aria-label="Nghe hướng dẫn sử dụng giọng nói bằng âm thanh"
            title="Đọc hướng dẫn cách đọc ý kiến"
            className="min-h-[44px] px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-300 shadow-2xs"
          >
            <Volume2 className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">🔊 Nghe hướng dẫn</span>
          </button>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2">
          {isListening && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 border border-red-300 rounded-xl text-red-900 font-black text-xs animate-pulse">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
              <span>🔴 Đang nghe...</span>
            </div>
          )}

          {state === 'success' && !isListening && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã chuyển thành chữ</span>
            </div>
          )}
        </div>
      </div>

      {/* Interim Listening Display Box */}
      {isListening && (
        <div className="p-3 bg-slate-900 text-white rounded-xl border border-red-500/50 space-y-1 shadow-inner">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>● Đang chuyển giọng nói thành văn bản...</span>
            <span className="text-amber-400">Hãy nói chậm và rõ tiếng Việt</span>
          </div>
          <p className="text-xs text-amber-200 italic font-medium min-h-[20px] leading-relaxed">
            {interimTranscript || 'Đang lắng nghe lời nói của bạn...'}
          </p>
        </div>
      )}

      {/* Error Banner */}
      {error && state === 'error' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-start gap-2 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">Thông báo lỗi micro:</span>
            <span>{error.messageVi}</span>
          </div>
        </div>
      )}

      {/* Privacy Note */}
      <p className="text-[11px] text-slate-500 italic">
        🔒 <strong>Bảo mật:</strong> Website chỉ mở micro khi bấm nút "Nói ý kiến". Giọng nói được chuyển ngay thành văn bản để bạn kiểm tra và sửa trước khi bấm Gửi. Không lưu file âm thanh.
      </p>
    </div>
  );
};
