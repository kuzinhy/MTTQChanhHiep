import React, { useState, useEffect, useMemo } from 'react';
import { Article } from '../types';
import { Calendar, ChevronLeft, ChevronRight, Eye, ArrowRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sortArticlesNewestFirst } from '../lib/dateUtils';
import { getGoogleDriveDirectImageUrl } from '../lib/googleDriveService';
import { ARTICLE_BANNERS } from '../utils/officialImages';

interface HeroCarouselProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
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
    }, 6000);
    return () => clearInterval(interval);
  }, [featured.length, isHovered]);

  if (!featured || featured.length === 0) return null;

  const validIndex = currentIndex < featured.length ? currentIndex : 0;
  const current = featured[validIndex];

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'Học tập và làm theo Bác':
      case 'Học tập làm theo Bác':
        return 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-rose-500/30';
      case 'An sinh xã hội':
        return 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-500/30';
      case 'Đại đoàn kết':
        return 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-red-500/30';
      case 'Hoạt động khu phố':
        return 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/30';
      case 'Giám sát - Phản biện':
        return 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/30';
      case 'Dân vận':
        return 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-500/30';
      case 'Phong trào thi đua':
        return 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-yellow-500/30 font-black';
      default:
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30';
    }
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
      x: dir > 0 ? '3%' : '-3%',
      opacity: 0,
      scale: 1.02,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? '3%' : '-3%',
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    }),
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.15 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <div 
      className="relative rounded-3xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-800 via-indigo-700 to-sky-800 border border-sky-400/30 text-white my-6 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-80 sm:h-96 md:h-[420px] w-full overflow-hidden">
        {/* Animated Background & Slide Image */}
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
            <img
              src={getGoogleDriveDirectImageUrl(current.featuredImage) || ARTICLE_BANNERS.default}
              alt={current.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Bottom-only Deep Blue Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-36 sm:h-44 bg-gradient-to-t from-blue-900/95 via-blue-900/70 via-blue-800/25 to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Content Box with motion */}
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 max-w-4xl z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id || currentIndex}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                <span className={`text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm ${getCategoryBadgeStyle(current.category)}`}>
                  {current.category}
                </span>
                <span className="text-slate-100 text-xs flex items-center gap-1 font-semibold bg-blue-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-blue-400/30">
                  <Calendar className="w-3.5 h-3.5 text-blue-300" />
                  {current.publishDate}
                </span>
                <span className="text-slate-100 text-xs flex items-center gap-1 font-semibold bg-blue-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-blue-400/30">
                  <Eye className="w-3.5 h-3.5 text-blue-300" />
                  {current.views} lượt xem
                </span>
              </div>

              <h2 
                onClick={() => onSelectArticle(current)}
                className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-white hover:text-blue-300 cursor-pointer transition-colors leading-snug line-clamp-2 drop-shadow-md"
              >
                {current.title}
              </h2>

              <p className="text-slate-100 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed max-w-3xl opacity-90">
                {current.summary}
              </p>

              {current.originalUrl && (
                <div className="mt-4 flex items-center gap-3 flex-wrap">
                  <a
                    href={current.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-900/80 hover:bg-blue-800/90 text-blue-100 hover:text-white border border-blue-400/40 backdrop-blur-md font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <span>Xem trên Facebook</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        {featured.length > 1 && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-blue-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-blue-400/30 shadow-md">
            <button
              onClick={handlePrev}
              title="Bài trước"
              className="p-1.5 hover:bg-blue-800/80 rounded-xl text-blue-200 hover:text-white transition-colors active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {/* Dots indicator */}
            <div className="flex items-center gap-1 px-1">
              {featured.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectDot(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-5 bg-blue-500'
                      : 'w-2 bg-slate-700 hover:bg-slate-600'
                  }`}
                  title={`Bài ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              title="Bài kế tiếp"
              className="p-1.5 hover:bg-blue-800/80 rounded-xl text-blue-200 hover:text-white transition-colors active:scale-90 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

