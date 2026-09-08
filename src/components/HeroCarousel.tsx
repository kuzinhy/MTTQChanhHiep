import React, { useState, useEffect, useMemo } from 'react';
import { Article } from '../types';
import { Calendar, Eye, ArrowRight, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sortArticlesNewestFirst } from '../lib/dateUtils';
import { OptimizedImage } from './common/OptimizedImage';

interface HeroCarouselProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
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

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ articles = [], onSelectArticle }) => {
  const featured = useMemo(() => {
    const safeArticles = Array.isArray(articles) ? articles : [];
    const pub = safeArticles.filter(a => a && (a.isFeatured || a.status === 'Published'));
    return sortArticlesNewestFirst(pub);
  }, [articles]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (featured.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [featured.length, isHovered]);

  if (!featured || featured.length === 0) return null;

  const validIndex = currentIndex < featured.length ? currentIndex : 0;
  const current = featured[validIndex];

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

  const getObjectPosition = (art: Article) => {
    if (art.objectPosition) return art.objectPosition;
    if (art.imageFocalPoint) return art.imageFocalPoint;
    if (art.imagePositionX || art.imagePositionY) {
      return `${art.imagePositionX || 'center'} ${art.imagePositionY || 'center'}`;
    }
    return 'center 35%'; // Optimal focal point for administrative and event photos
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  const handleSelectDot = (index: number) => {
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
      className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-slate-950 border border-slate-200/60 my-4 sm:my-6 group select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Editorial Aspect Ratio Container */}
      <div className="relative h-[260px] sm:h-[360px] md:h-[420px] lg:h-[460px] w-full overflow-hidden">
        
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
              style={{ objectPosition: getObjectPosition(current), imageRendering: 'auto' }}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Bottom Soft Gradient Overlay (35%-42% height only) */}
        <div 
          className="absolute inset-x-0 bottom-0 pointer-events-none z-10"
          style={{
            height: '42%',
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.50) 50%, rgba(0, 0, 0, 0) 100%)'
          }}
        />

        {/* Side Carousel Navigation Arrow Buttons (Desktop & Tablet) */}
        {featured.length > 1 && (
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
        {featured.length > 1 && (
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
      </div>
    </div>
  );
};

export default HeroCarousel;
