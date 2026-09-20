import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Article } from '../types';
import { Calendar, Eye, ArrowRight, ExternalLink, ChevronLeft, ChevronRight, Move, Check, RotateCcw, X, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sortArticlesNewestFirst } from '../lib/dateUtils';
import { OptimizedImage } from './common/OptimizedImage';

interface HeroCarouselProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onUpdateArticle?: (article: Article) => void;
}

// Helper to convert ALL CAPS titles into natural Sentence Case (e.g. "PHƯỜNG CHÁNH HIỆP..." -> "Phường Chánh Hiệp...")
function formatTitleCase(title: string): string {
  if (!title) return '';
  const letters = title.replace(/[^a-zA-ZÀ-ỹ]/g, '');
  if (letters.length === 0) return title;
  const upperCount = (letters.match(/[A-ZÀ-Ỹ]/g) || []).length;
  if (upperCount / letters.length > 0.65) {
    const lower = title.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }
  return title;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ articles = [], onSelectArticle, onUpdateArticle }) => {
  const featured = useMemo(() => {
    const safeArticles = Array.isArray(articles) ? articles : [];
    const pub = safeArticles.filter(a => a && (a.isFeatured || a.status === 'Published'));
    return sortArticlesNewestFirst(pub);
  }, [articles]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev
  const [isHovered, setIsHovered] = useState(false);

  // Reposition / Cover Drag State (Facebook style)
  const [isRepositioning, setIsRepositioning] = useState(false);
  const [tempPositionY, setTempPositionY] = useState<number>(35);
  const [tempPositionX, setTempPositionX] = useState<number>(50);
  const [isDragging, setIsDragging] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number }>({ x: 0, y: 0, posX: 50, posY: 35 });

  useEffect(() => {
    if (featured.length <= 1 || isHovered || isRepositioning) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [featured.length, isHovered, isRepositioning]);

  // Window level listeners for smooth dragging anywhere on the screen
  useEffect(() => {
    if (!isRepositioning) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      e.preventDefault();
      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      // Sensitivity factor: 1.0 means 100px drag = 100% / height shift
      // Moving mouse DOWN (positive deltaY) pulls image down -> focal point Y decreases
      const nextY = Math.max(0, Math.min(100, dragStartRef.current.posY - (deltaY / rect.height) * 100));
      const nextX = Math.max(0, Math.min(100, dragStartRef.current.posX - (deltaX / rect.width) * 100));

      setTempPositionY(nextY);
      setTempPositionX(nextX);
    };

    const handleWindowTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !containerRef.current || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = touch.clientX - dragStartRef.current.x;
      const deltaY = touch.clientY - dragStartRef.current.y;

      const nextY = Math.max(0, Math.min(100, dragStartRef.current.posY - (deltaY / rect.height) * 100));
      const nextX = Math.max(0, Math.min(100, dragStartRef.current.posX - (deltaX / rect.width) * 100));

      setTempPositionY(nextY);
      setTempPositionX(nextX);
    };

    const handleWindowUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
      }
    };

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: false });
    window.addEventListener('mouseup', handleWindowUp);
    window.addEventListener('touchmove', handleWindowTouchMove, { passive: false });
    window.addEventListener('touchend', handleWindowUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowUp);
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('touchend', handleWindowUp);
    };
  }, [isRepositioning]);

  if (!featured || featured.length === 0) return null;

  const validIndex = currentIndex < featured.length ? currentIndex : 0;
  const current = featured[validIndex];

  // Helper to parse "center 35%" or "50% 25%" into numeric X and Y percentages
  const parseObjectPosition = (art: Article) => {
    const raw = art.objectPosition || art.imageFocalPoint || '50% 35%';
    const parts = raw.trim().split(/\s+/);
    
    let posX = 50;
    let posY = 35;

    if (parts.length >= 1) {
      if (parts[0] === 'left') posX = 0;
      else if (parts[0] === 'center') posX = 50;
      else if (parts[0] === 'right') posX = 100;
      else if (parts[0].includes('%')) posX = parseFloat(parts[0]) || 50;
    }

    if (parts.length >= 2) {
      if (parts[1] === 'top') posY = 0;
      else if (parts[1] === 'center') posY = 50;
      else if (parts[1] === 'bottom') posY = 100;
      else if (parts[1].includes('%')) posY = parseFloat(parts[1]) || 35;
    }

    return { posX, posY };
  };

  const getObjectPosition = (art: Article) => {
    if (isRepositioning) {
      return `${Math.round(tempPositionX)}% ${Math.round(tempPositionY)}%`;
    }
    if (art.objectPosition) return art.objectPosition;
    if (art.imageFocalPoint) return art.imageFocalPoint;
    if (art.imagePositionX || art.imagePositionY) {
      return `${art.imagePositionX || 'center'} ${art.imagePositionY || '35%'}`;
    }
    return 'center 35%'; // Optimal focal point for administrative and event photos
  };

  // Start Reposition Mode
  const handleStartReposition = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { posX, posY } = parseObjectPosition(current);
    setTempPositionX(posX);
    setTempPositionY(posY);
    setIsRepositioning(true);
  };

  // Drag logic - Mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isRepositioning) return;
    // Don't start drag if clicking on buttons/sliders inside top command bar
    if ((e.target as HTMLElement).closest('button, input, a')) return;
    e.preventDefault();
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: tempPositionX,
      posY: tempPositionY
    };
    setIsDragging(true);
  };

  // Drag logic - Touch for Mobile/Tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isRepositioning || e.touches.length === 0) return;
    if ((e.target as HTMLElement).closest('button, input, a')) return;
    const touch = e.touches[0];
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      posX: tempPositionX,
      posY: tempPositionY
    };
    setIsDragging(true);
  };

  // Save Repositioned Cover Image
  const handleSavePosition = (e: React.MouseEvent) => {
    e.stopPropagation();
    const formatted = `${Math.round(tempPositionX)}% ${Math.round(tempPositionY)}%`;
    const updatedArticle: Article = {
      ...current,
      objectPosition: formatted,
      imageFocalPoint: formatted,
      imagePositionX: `${Math.round(tempPositionX)}%`,
      imagePositionY: `${Math.round(tempPositionY)}%`
    };

    if (onUpdateArticle) {
      onUpdateArticle(updatedArticle);
    } else {
      // Direct Local Storage Fallback if handler not supplied
      try {
        const stored = localStorage.getItem('mttq_chanhhiep_articles_v2');
        if (stored) {
          const list: Article[] = JSON.parse(stored);
          const next = list.map(a => a.id === updatedArticle.id ? updatedArticle : a);
          localStorage.setItem('mttq_chanhhiep_articles_v2', JSON.stringify(next));
        }
      } catch (err) {
        console.error('Error saving article objectPosition:', err);
      }
    }

    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      setIsRepositioning(false);
    }, 800);
  };

  const handleResetPosition = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempPositionX(50);
    setTempPositionY(35);
  };

  const handleCancelReposition = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRepositioning(false);
  };

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'Học tập và làm theo Bác':
      case 'Học tập làm theo Bác':
        return 'bg-rose-600 text-white';
      case 'An sinh xã hội':
        return 'bg-amber-600 text-white';
      case 'Đại đoàn kết':
        return 'bg-red-600 text-white';
      case 'Hoạt động khu phố':
        return 'bg-emerald-600 text-white';
      case 'Giám sát - Phản biện':
        return 'bg-purple-600 text-white';
      case 'Dân vận':
        return 'bg-cyan-600 text-white';
      case 'Phong trào thi đua':
        return 'bg-amber-500 text-slate-900 font-bold';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  const handleNext = () => {
    if (isRepositioning) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  const handlePrev = () => {
    if (isRepositioning) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  const handleSelectDot = (index: number) => {
    if (isRepositioning) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 15 : -15,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 350, damping: 32 },
        opacity: { duration: 0.3 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 15 : -15,
      opacity: 0,
      transition: {
        x: { type: 'spring' as const, stiffness: 350, damping: 32 },
        opacity: { duration: 0.25 },
      },
    }),
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.05 } },
    exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
  };

  const formattedTitle = formatTitleCase(current.title);

  return (
    <div 
      className={`relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-slate-950 border border-slate-200/60 my-4 sm:my-6 group select-none ${
        isRepositioning ? 'ring-4 ring-blue-500 shadow-2xl' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Editorial Aspect Ratio Container */}
      <div 
        ref={containerRef}
        className={`relative h-[260px] sm:h-[360px] md:h-[420px] lg:h-[460px] w-full overflow-hidden ${
          isRepositioning 
            ? isDragging ? 'cursor-grabbing' : 'cursor-grab' 
            : ''
        }`}
      >
        
        {/* Animated Slide Image Layer */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current.id || currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <OptimizedImage
              src={current.featuredImage}
              alt={formattedTitle}
              variant="hero"
              fallbackCategory={current.category}
              priority={true}
              style={{ 
                objectPosition: getObjectPosition(current), 
                imageRendering: 'auto',
                transition: isDragging ? 'none' : 'object-position 0.15s ease-out'
              }}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Reposition Mode Rule of Thirds Grid Overlay & Floating Bar */}
        {isRepositioning && (
          <div 
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className={`absolute inset-0 z-40 bg-black/20 ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            } flex flex-col justify-between p-3 sm:p-5 select-none`}
          >
            {/* Rule of Thirds Guidelines */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 border border-white/20 pointer-events-none">
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-b border-white/15" />
              <div className="border-r border-white/15" />
              <div className="border-r border-white/15" />
              <div className="" />
            </div>

            {/* Top Command Bar for Repositioning with Drag + Sliders */}
            <div className="relative z-50 pointer-events-auto mx-auto max-w-2xl w-full bg-slate-900/95 backdrop-blur-md border border-white/25 rounded-2xl p-2.5 sm:p-3.5 shadow-2xl space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-white text-xs sm:text-sm font-extrabold">
                  <Move className="w-4 h-4 text-cyan-400 animate-bounce shrink-0" />
                  <span>Kéo di chuyển ảnh hoặc dùng thanh trượt</span>
                  <span className="text-[10px] bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 px-2 py-0.5 rounded-full font-mono shrink-0">
                    {Math.round(tempPositionX)}% X • {Math.round(tempPositionY)}% Y
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleResetPosition}
                    title="Đặt lại góc mặc định (50% 35%)"
                    className="h-8 px-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 text-xs font-semibold rounded-xl transition-all border border-slate-600 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Đặt lại</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelReposition}
                    title="Hủy bỏ"
                    className="h-8 px-2.5 bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs font-semibold rounded-xl transition-all border border-rose-700/60 flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Hủy</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSavePosition}
                    title="Lưu vị trí góc ảnh mới"
                    className="h-8 px-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md border border-blue-400/40 flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>Lưu vị trí</span>
                  </button>
                </div>
              </div>

              {/* Slider Fine-Tuning Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-[11px] font-bold text-cyan-300 w-12 shrink-0">Trục dọc:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={tempPositionY}
                    onChange={(e) => setTempPositionY(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                  />
                  <span className="text-[11px] font-mono text-cyan-200 w-8 text-right shrink-0">{Math.round(tempPositionY)}%</span>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-[11px] font-bold text-cyan-300 w-12 shrink-0">Trục ngang:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={tempPositionX}
                    onChange={(e) => setTempPositionX(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                  />
                  <span className="text-[11px] font-mono text-cyan-200 w-8 text-right shrink-0">{Math.round(tempPositionX)}%</span>
                </div>
              </div>
            </div>

            {/* Bottom Hint */}
            <div className="relative z-50 pointer-events-none text-center">
              <span className="inline-block bg-black/75 text-cyan-300 text-[11px] font-bold px-3 py-1 rounded-full border border-cyan-400/30 backdrop-blur-md shadow-lg">
                👆 Giữ &amp; kéo chuột/ngón tay trên ảnh HOẶC kéo 2 thanh trượt trên để chỉnh vị trí hiển thị chuẩn nhất
              </span>
            </div>
          </div>
        )}

        {/* Save Toast Feedback */}
        <AnimatePresence>
          {saveToast && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs"
            >
              <div className="bg-emerald-600 text-white font-extrabold text-sm sm:text-base px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-emerald-300">
                <Check className="w-5 h-5" />
                <span>Đã lưu vị trí hiển thị ảnh bìa mới thành công!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Left Trigger Button for Repositioning Cover Photo (Visible on Hover or Touch) */}
        {!isRepositioning && (
          <div className="absolute top-3 left-3 z-30 opacity-90 hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handleStartReposition}
              title="Nhấp để kéo, di chuyển vị trí ảnh nền hiển thị (giống đổi ảnh bìa Facebook)"
              className="h-8 px-2.5 sm:px-3 bg-black/60 hover:bg-blue-600 text-white border border-white/20 backdrop-blur-md text-[11px] font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Move className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden xs:inline">Chỉnh vị trí ảnh</span>
            </button>
          </div>
        )}

        {/* Bottom Soft Gradient Overlay (35%-42% height only) */}
        <div 
          className="absolute inset-x-0 bottom-0 pointer-events-none z-10"
          style={{
            height: '42%',
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.50) 50%, rgba(0, 0, 0, 0) 100%)'
          }}
        />

        {/* Side Carousel Navigation Arrow Buttons (Desktop & Tablet) */}
        {featured.length > 1 && !isRepositioning && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Bài trước"
              title="Bài trước"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all shadow-lg active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Bài kế tiếp"
              title="Bài kế tiếp"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all shadow-lg active:scale-90 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Top Right Dots Indicator */}
        {featured.length > 1 && !isRepositioning && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-5 z-30 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-md">
            {featured.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectDot(idx)}
                aria-label={`Chuyển đến bài ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-4 bg-white shadow-xs'
                    : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
                title={`Bài ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Bottom Overlay Content */}
        {!isRepositioning && (
          <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-7 right-3 sm:right-7 z-20 pointer-events-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id || currentIndex}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col md:flex-row md:items-end justify-between gap-2.5 sm:gap-4"
              >
                {/* Left Column: Meta + Title + Summary */}
                <div className="space-y-1.5 max-w-3xl flex-1">
                  {/* Meta Row (Tag, Date, Views) */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 sm:py-1 rounded-md shadow-xs shrink-0 ${getCategoryBadgeStyle(current.category)}`}>
                      {current.category}
                    </span>

                    <div className="flex items-center gap-2.5 text-slate-200 text-[11px] sm:text-xs font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                        <span>{current.publishDate}</span>
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                        <span>{current.views} lượt xem</span>
                      </span>
                    </div>
                  </div>

                  {/* Title (1 line desktop, max 2 lines mobile - Natural Sentence Case) */}
                  <h2 
                    onClick={() => onSelectArticle(current)}
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}
                    className="text-base sm:text-xl md:text-2xl lg:text-[23px] font-bold tracking-tight text-white hover:text-blue-200 cursor-pointer transition-colors leading-snug sm:leading-tight line-clamp-2 md:line-clamp-1"
                  >
                    {formattedTitle}
                  </h2>

                  {/* Summary (Max 1-2 lines, clean font) */}
                  {current.summary && (
                    <p 
                      style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
                      className="text-slate-200 text-xs sm:text-sm line-clamp-1 sm:line-clamp-2 leading-relaxed max-w-2xl font-normal"
                    >
                      {current.summary}
                    </p>
                  )}
                </div>

                {/* Right Column: Prominent "Xem chi tiết →" Button */}
                <div className="shrink-0 flex items-center gap-2 self-start md:self-end pt-1 md:pt-0">
                  <button
                    onClick={() => onSelectArticle(current)}
                    className="inline-flex items-center gap-1.5 h-8 sm:h-9 px-3.5 sm:px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer border border-blue-400/40 shrink-0"
                  >
                    <span>Xem chi tiết</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {current.originalUrl && (
                    <a
                      href={current.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 h-8 sm:h-9 px-3 bg-black/40 hover:bg-black/60 text-slate-200 hover:text-white border border-white/20 backdrop-blur-md font-semibold text-xs rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
                      title="Xem bài đăng gốc trên Facebook"
                    >
                      <span>FB</span>
                      <ExternalLink className="w-3 h-3 text-blue-300" />
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroCarousel;
