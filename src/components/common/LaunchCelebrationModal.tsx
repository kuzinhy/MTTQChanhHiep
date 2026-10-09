import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Heart, 
  Sparkles, 
  PartyPopper, 
  CheckCircle2, 
  Compass, 
  BookOpen, 
  Newspaper,
  Volume2,
  VolumeX,
  Share2,
  Check
} from 'lucide-react';
import { LaunchPopupConfig } from '../../types';

interface LaunchCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LaunchPopupConfig;
  onCongratulate: () => void;
  hasCongratulated: boolean;
  onDismissToday?: () => void;
  onNavigateAction?: (action: 'EXPLORE' | 'OPEN_ABOUT' | 'SCROLL_NEWS') => void;
}

export const LaunchCelebrationModal: React.FC<LaunchCelebrationModalProps> = ({
  isOpen,
  onClose,
  config,
  onCongratulate,
  hasCongratulated,
  onDismissToday,
  onNavigateAction
}) => {
  const [dontShowToday, setDontShowToday] = useState(false);
  const [localHeartAnim, setLocalHeartAnim] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Play gentle celebratory chime
  const playCelebrationChime = () => {
    if (soundMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Note chords: C5, E5, G5, C6 (Bright festive chime)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.95);
      });
    } catch {
      // Audio context might be restricted before user interaction
    }
  };

  // Launch Confetti animation loop
  useEffect(() => {
    if (!isOpen || !config.showConfetti) return;

    // Small delay to ensure render
    const timer = setTimeout(() => {
      playCelebrationChime();
      startConfettiBurst();
    }, 150);

    return () => clearTimeout(timer);
  }, [isOpen, config.showConfetti]);

  const startConfettiBurst = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#dc2626', '#f59e0b', '#fbbf24', '#2563eb', '#10b981', '#ec4899', '#ffffff'];
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      shape: 'rect' | 'circle';
    }> = [];

    // Create 70 particles
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 300,
        y: canvas.height * 0.25 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 1) * 10 - 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }

    let animationFrameId: number;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravity
        p.vx *= 0.98; // air resistance
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, p.opacity - 0.007);

        if (p.opacity > 0 && p.y < canvas.height + 50) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      });

      if (alive && frame < 200) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    render();
  };

  const handleHeartClick = () => {
    onCongratulate();
    setLocalHeartAnim(true);
    setTimeout(() => setLocalHeartAnim(false), 1200);
    startConfettiBurst();
  };

  const handlePrimaryAction = () => {
    if (dontShowToday && onDismissToday) {
      onDismissToday();
    }
    onClose();
    if (onNavigateAction) {
      onNavigateAction(config.primaryButtonAction || 'EXPLORE');
    }
  };

  const handleClose = () => {
    if (dontShowToday && onDismissToday) {
      onDismissToday();
    }
    onClose();
  };

  const handleShare = () => {
    const url = window.location.origin + window.location.pathname;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop with soft blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
        />

        {/* Confetti Overlay Canvas */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none fixed inset-0 z-55"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="relative z-60 w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-amber-300/80 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Top Decorative Header - Red & Gold Festive Imperial Palette */}
          <div className="relative bg-gradient-to-r from-red-700 via-rose-700 to-amber-600 text-white px-6 pt-7 pb-6 overflow-hidden shrink-0 border-b-2 border-amber-400/60">
            {/* Background Ornament Watermark */}
            <div className="absolute -right-8 -bottom-10 opacity-15 pointer-events-none select-none">
              <div className="w-56 h-56 rounded-full border-8 border-dashed border-amber-200 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border-4 border-amber-200" />
              </div>
            </div>

            {/* Top Bar Controls */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/25 border border-amber-300/40 text-amber-200 text-[11px] font-black uppercase tracking-wider shadow-xs backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>{config.badgeText || 'CHÍNH THỨC VẬN HÀNH • PHỤC VỤ NHÂN DÂN'}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSoundMuted(!soundMuted)}
                  title={soundMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
                >
                  {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                  title="Đóng popup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Emblem and Title Banner */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-xl border-2 border-amber-300 flex items-center justify-center ring-4 ring-amber-400/30">
                  <img
                    src={config.bannerImageUrl || 'https://res.cloudinary.com/idt08wyp/image/upload/v1789907080/Logo-Mat-Tran-To-Quoc-Viet-Nam.png'}
                    alt="Logo Mặt trận Tổ quốc Việt Nam"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] sm:text-xs font-black tracking-widest uppercase text-amber-200 drop-shadow-xs">
                  {config.subtitle || 'ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP'}
                </p>
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-snug drop-shadow-md mt-0.5">
                  {config.title || 'THƯ CHÀO MỪNG RA MẮT CỔNG THÔNG TIN ĐIỆN TỬ'}
                </h2>
                {config.slogan && (
                  <div className="mt-1.5 inline-block text-[11px] font-bold text-amber-100 bg-black/20 px-2.5 py-0.5 rounded-md border border-amber-300/30">
                    ★ {config.slogan} ★
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Letter Body - Scrollable content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 text-slate-800 text-xs sm:text-sm leading-relaxed scrollbar-thin">
            
            {/* Highlight Box: Date and Significance */}
            <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 border border-amber-200/90 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <PartyPopper className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-amber-900 font-bold uppercase tracking-wider">Thời khắc ra mắt</p>
                  <p className="text-xs sm:text-sm font-black text-slate-900">{config.launchDate || 'Tháng 10/2026'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  title="Sao chép liên kết chia sẻ"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-blue-600" />}
                  <span>{copiedLink ? 'Đã sao chép!' : 'Chia sẻ'}</span>
                </button>
              </div>
            </div>

            {/* Letter Content formatted nicely */}
            <div className="space-y-3.5 font-serif sm:text-[13.5px] leading-relaxed text-slate-800 bg-amber-50/20 p-4 sm:p-5 rounded-2xl border border-amber-100/70">
              {config.messageHtml.split('\n\n').map((paragraph, idx) => {
                const lines = paragraph.split('\n');
                return (
                  <div key={idx} className="space-y-1.5">
                    {lines.map((line, lIdx) => {
                      const trimmed = line.trim();
                      if (!trimmed) return null;

                      // Bullet point check
                      if (/^\d+\.|\-|\*/.test(trimmed)) {
                        return (
                          <div key={lIdx} className="flex items-start gap-2 pl-2 text-slate-900 font-sans text-xs sm:text-[13px]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{trimmed.replace(/^(\d+\.|\-|\*)\s*/, '')}</span>
                          </div>
                        );
                      }

                      // Header / Salutation
                      if (trimmed.startsWith('Kính gửi') || trimmed.startsWith('Thưa')) {
                        return (
                          <p key={lIdx} className="font-bold text-red-900 italic font-serif">
                            {trimmed}
                          </p>
                        );
                      }

                      return (
                        <p key={lIdx} className="text-justify font-sans text-xs sm:text-[13px] text-slate-700">
                          {trimmed}
                        </p>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Signature Block */}
            <div className="flex flex-col sm:flex-row items-end justify-between pt-3 border-t border-slate-100 gap-4">
              <div className="text-[11px] text-slate-500 italic">
                * Cổng thông tin tương thích hoàn toàn trên máy tính, máy tính bảng và điện thoại di động.
              </div>

              <div className="text-right sm:pr-4">
                <p className="text-[11px] font-black uppercase text-red-800 tracking-wider">
                  {config.senderTitle || 'TM. BAN THƯỜNG TRỰC ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP'}
                </p>
                <div className="my-2 inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-red-600/30 bg-red-50 text-red-700 shadow-inner">
                  <span className="text-[9px] font-black uppercase text-center leading-tight">DẤU ĐỎ<br />MTTQ</span>
                </div>
                <p className="text-xs font-bold text-slate-800">
                  {config.senderName || 'Chủ tịch Ủy ban MTTQ Việt Nam Phường'}
                </p>
              </div>
            </div>

            {/* Interactive "Send Congratulations & Warm Hearts" Section */}
            <div className="bg-gradient-to-r from-red-50 via-amber-50 to-pink-50 rounded-2xl p-4 border border-rose-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md">
                    <Heart className={`w-6 h-6 fill-white ${localHeartAnim ? 'scale-125 transition-transform' : ''}`} />
                  </div>
                  {localHeartAnim && (
                    <motion.div
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 0, y: -24 }}
                      className="absolute -top-3 left-1/2 -translate-x-1/2 text-rose-600 font-black text-xs"
                    >
                      +1 ❤️
                    </motion.div>
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Gửi Lời Chúc Mừng & Đồng Hành
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Đã có <span className="font-black text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded-sm">{config.congratulationsCount || 0}</span> người dân gửi lời chúc mừng & đồng hành!
                  </p>
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleHeartClick}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className={`w-4 h-4 fill-white ${localHeartAnim ? 'animate-ping' : ''}`} />
                <span>{hasCongratulated ? 'Thả Tim Tiếp Chúc Mừng!' : '❤️ Chúc Mừng & Đồng Hành'}</span>
              </motion.button>
            </div>

          </div>

          {/* Modal Footer Controls */}
          <div className="bg-slate-50 px-5 sm:px-7 py-4 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            {/* Don't show again today checkbox */}
            <label className="flex items-center gap-2 text-xs text-slate-600 select-none cursor-pointer w-full sm:w-auto justify-center sm:justify-start">
              <input
                type="checkbox"
                checked={dontShowToday}
                onChange={(e) => setDontShowToday(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
              />
              <span>Không hiển thị lại trong ngày hôm nay</span>
            </label>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Đã hiểu, đóng lại
              </button>

              <button
                type="button"
                onClick={handlePrimaryAction}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ring-2 ring-amber-300/60"
              >
                {config.primaryButtonAction === 'OPEN_ABOUT' ? (
                  <BookOpen className="w-4 h-4" />
                ) : config.primaryButtonAction === 'SCROLL_NEWS' ? (
                  <Newspaper className="w-4 h-4" />
                ) : (
                  <Compass className="w-4 h-4" />
                )}
                <span>{config.primaryButtonText || 'Khám Phá Cổng Thông Tin Ngay'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
