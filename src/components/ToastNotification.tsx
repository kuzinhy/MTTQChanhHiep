import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquareHeart, 
  FileCheck, 
  CheckCircle2, 
  Bell, 
  X, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  ExternalLink 
} from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  onNavigateToView?: (view: string, id?: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
  onNavigateToView
}) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm sm:max-w-md w-full px-4 pointer-events-none select-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
            onNavigateToView={onNavigateToView}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
  onNavigateToView?: (view: string, id?: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss, onNavigateToView }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const duration = 7000; // 7 seconds

  useEffect(() => {
    if (isPaused) return;

    const startTime = Date.now();
    const intervalTime = 50;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPercent = Math.max(0, 100 - (elapsed / duration) * 100);
      
      if (remainingPercent <= 0) {
        clearInterval(timer);
        setProgress(0);
        onDismiss(toast.id);
      } else {
        setProgress(remainingPercent);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, toast.id, onDismiss, duration]);

  // Audio effect (soft web audio chime)
  useEffect(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        // Gentle double-beep sequence
        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(toast.type === 'OPINION' ? 660 : 880, now);
        osc.frequency.setValueAtTime(toast.type === 'OPINION' ? 880 : 1100, now + 0.08);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      // Audio playback quiet fail if audio context blocked by browser policy
    }
  }, [toast.id, toast.type]);

  const handleActionClick = () => {
    if (toast.onAction) {
      toast.onAction();
    } else if (onNavigateToView && toast.meta?.targetView) {
      onNavigateToView(toast.meta.targetView, toast.code);
    }
    onDismiss(toast.id);
  };

  // Type styling configurations
  const isOpinion = toast.type === 'OPINION';
  const isDocApproval = toast.type === 'DOCUMENT_APPROVAL';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9, transition: { duration: 0.2 } }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`pointer-events-auto relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-slate-200/90 text-slate-800 p-4 transition-all hover:shadow-blue-500/10 ${
        isOpinion
          ? 'border-l-4 border-l-amber-500'
          : isDocApproval
          ? 'border-l-4 border-l-blue-600'
          : 'border-l-4 border-l-sky-500'
      }`}
    >
      {/* Background soft glow */}
      <div 
        className={`absolute -right-8 -bottom-8 w-28 h-28 rounded-full blur-2xl opacity-15 pointer-events-none ${
          isOpinion ? 'bg-amber-500' : isDocApproval ? 'bg-blue-600' : 'bg-sky-500'
        }`}
      />

      {/* Header Info Bar */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Icon Badge */}
          <div className={`p-2.5 rounded-xl shrink-0 flex items-center justify-center shadow-xs ${
            isOpinion 
              ? 'bg-amber-100 text-amber-800 border border-amber-300/60 ring-2 ring-amber-400/20' 
              : isDocApproval
              ? 'bg-blue-100 text-blue-800 border border-blue-300/60 ring-2 ring-blue-500/20'
              : 'bg-sky-100 text-sky-800 border border-sky-300/60'
          }`}>
            {isOpinion && <MessageSquareHeart className="w-5 h-5 text-amber-700 animate-bounce" />}
            {isDocApproval && <FileCheck className="w-5 h-5 text-blue-700" />}
            {!isOpinion && !isDocApproval && <Bell className="w-5 h-5 text-sky-700" />}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] uppercase tracking-wider ${
                isOpinion 
                  ? 'bg-amber-400 text-slate-950 shadow-2xs'
                  : isDocApproval
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-sky-600 text-white'
              }`}>
                {isOpinion ? 'Ý KIẾN DÂN SINH MỚI' : isDocApproval ? 'CẦN PHÊ DUYỆT VĂN BẢN' : 'THÔNG BÁO HỆ THỐNG'}
              </span>

              {toast.code && (
                <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded-md">
                  {toast.code}
                </span>
              )}
            </div>

            <h4 className="text-xs font-extrabold text-slate-900 mt-1 line-clamp-1">
              {toast.title}
            </h4>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => onDismiss(toast.id)}
          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
          title="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message Body */}
      <div className="mt-2.5 text-xs text-slate-600 space-y-1.5 pl-1 border-l-2 border-slate-100 ml-3">
        <p className="line-clamp-2 leading-relaxed font-medium">
          {toast.message}
        </p>

        {/* Extra Metadata Chips */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <div className="flex items-center gap-3">
            {toast.meta?.neighborhood && (
              <span className="flex items-center gap-1 font-semibold text-blue-900">
                <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                {toast.meta.neighborhood}
              </span>
            )}
            {toast.meta?.sender && (
              <span className="truncate max-w-[140px] font-medium text-slate-600">
                Từ: {toast.meta.sender}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <Clock className="w-3 h-3" />
            {toast.timestamp}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[10px] text-slate-400 font-medium italic">
          {isPaused ? 'Đã tạm dừng tự đóng' : 'Click để xem chi tiết'}
        </span>

        <button
          onClick={handleActionClick}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 ${
            isOpinion
              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500/30'
              : isDocApproval
              ? 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-500/30'
              : 'bg-sky-600 hover:bg-sky-700 text-white'
          }`}
        >
          <span>{toast.actionLabel || (isOpinion ? 'Xử lý ý kiến' : isDocApproval ? 'Phê duyệt ngay' : 'Xem chi tiết')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Animated Timer Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
        <div
          className={`h-full transition-all duration-75 ${
            isOpinion ? 'bg-amber-500' : isDocApproval ? 'bg-blue-600' : 'bg-sky-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};
