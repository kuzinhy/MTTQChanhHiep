import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Article } from '../types';
import { sortArticlesNewestFirst } from '../lib/dateUtils';
import { getGoogleDriveDirectImageUrl } from '../lib/googleDriveService';
import { 
  Calendar, 
  Eye, 
  Search, 
  FileText, 
  X, 
  Tag, 
  Share2, 
  Flame, 
  TrendingUp, 
  Award, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Clock,
  User,
  MessageSquare,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

// Custom Lotus Flower SVG Component matching the exact artistic botanical composition (Three lotus flowers, stems, and wavy leaf)
const LotusFlowerIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g filter="url(#lotus-exact-shadow)">
      {/* Back Outermost Petals (Cánh lớn ngoài cùng) */}
      <path d="M120 18 C85 35 30 75 15 110 C25 145 65 170 120 185 C175 170 215 145 225 110 C210 75 155 35 120 18 Z" fill="url(#lotus-p-back)" />
      
      {/* Mid Layer Left & Right Wings (Cánh tầng giữa hai bên) */}
      <path d="M120 30 C75 50 25 90 45 135 C65 160 95 175 120 180 C105 150 95 115 100 80 C105 55 112 40 120 30 Z" fill="url(#lotus-p-mid-l)" />
      <path d="M120 30 C165 50 215 90 195 135 C175 160 145 175 120 180 C135 150 145 115 140 80 C135 55 128 40 120 30 Z" fill="url(#lotus-p-mid-r)" />

      {/* Prominent Back-Center Petals (Cánh dựng đứng phía sau tâm) */}
      <path d="M120 22 C95 45 75 85 95 135 C105 150 115 160 120 165 C125 160 135 150 145 135 C165 85 145 45 120 22 Z" fill="url(#lotus-p-high)" />

      {/* Front Lower Drooping Petal (Cánh rủ phía trước chân bông hoa) */}
      <path d="M120 130 C95 135 75 155 85 195 C100 215 115 225 120 230 C125 225 140 215 155 195 C165 155 145 135 120 130 Z" fill="url(#lotus-p-front)" />

      {/* Inner Central Curved Petals (Cánh ôm bầu nhụy trung tâm) */}
      <path d="M120 65 C95 80 85 115 105 140 C112 148 118 152 120 155 C122 152 128 148 135 140 C155 115 145 80 120 65 Z" fill="url(#lotus-p-center)" />
      
      {/* Soft White Inner Highlights */}
      <path d="M120 75 C105 90 98 115 110 132 C115 138 120 142 120 145 C120 142 125 138 130 132 C142 115 135 90 120 75 Z" fill="#ffffff" opacity="0.65" />

      {/* Central Golden Receptacle (Đài nhụy hoa sen vàng hạt gạo) */}
      <ellipse cx="120" cy="115" rx="16" ry="10" fill="url(#lotus-exact-receptacle)" />
      {/* Stamens / Anthers (Các hạt nhụy vàng nổi bật) */}
      <circle cx="120" cy="111" r="3" fill="#fde047" />
      <circle cx="112" cy="114" r="2.2" fill="#fef08a" />
      <circle cx="128" cy="114" r="2.2" fill="#fef08a" />
      <circle cx="116" cy="118" r="2" fill="#facc15" />
      <circle cx="124" cy="118" r="2" fill="#facc15" />
      <circle cx="120" cy="121" r="1.8" fill="#eab308" />
    </g>

    <defs>
      <filter id="lotus-exact-shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#881337" floodOpacity="0.18" />
      </filter>

      <linearGradient id="lotus-p-back" x1="120" y1="18" x2="120" y2="185" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fecdd3" />
        <stop offset="0.4" stopColor="#fb7185" />
        <stop offset="0.8" stopColor="#e11d48" />
        <stop offset="1" stopColor="#881337" />
      </linearGradient>

      <linearGradient id="lotus-p-mid-l" x1="45" y1="30" x2="120" y2="180" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffe4e6" />
        <stop offset="0.35" stopColor="#fb7185" />
        <stop offset="0.75" stopColor="#be123c" />
        <stop offset="1" stopColor="#500724" />
      </linearGradient>

      <linearGradient id="lotus-p-mid-r" x1="195" y1="30" x2="120" y2="180" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffe4e6" />
        <stop offset="0.35" stopColor="#fb7185" />
        <stop offset="0.75" stopColor="#be123c" />
        <stop offset="1" stopColor="#500724" />
      </linearGradient>

      <linearGradient id="lotus-p-high" x1="120" y1="22" x2="120" y2="165" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" />
        <stop offset="0.3" stopColor="#fda4af" />
        <stop offset="0.7" stopColor="#f43f5e" />
        <stop offset="1" stopColor="#9f1239" />
      </linearGradient>

      <linearGradient id="lotus-p-front" x1="120" y1="130" x2="120" y2="230" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fff1f2" />
        <stop offset="0.3" stopColor="#fb7185" />
        <stop offset="0.7" stopColor="#e11d48" />
        <stop offset="1" stopColor="#831843" />
      </linearGradient>

      <linearGradient id="lotus-p-center" x1="120" y1="65" x2="120" y2="155" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" />
        <stop offset="0.4" stopColor="#fbcfe8" />
        <stop offset="0.8" stopColor="#f43f5e" />
        <stop offset="1" stopColor="#be123c" />
      </linearGradient>

      <radialGradient id="lotus-exact-receptacle" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="65%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#ca8a04" />
      </radialGradient>
    </defs>
  </svg>
);

interface NewsSectionProps {
  articles: Article[];
  searchQuery: string;
  onSelectArticle: (article: Article) => void;
  onGoToOpinion?: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ articles, searchQuery, onSelectArticle, onGoToOpinion }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories: { id: string; label: string }[] = [
    { id: 'ALL', label: 'Tất cả tin bài' },
    { id: 'Học tập và làm theo Bác', label: '🌸 Học tập & Làm theo Bác' },
    { id: 'Hoạt động Mặt trận', label: 'Hoạt động Mặt trận' },
    { id: 'Hoạt động khu phố', label: 'Hoạt động khu phố' },
    { id: 'An sinh xã hội', label: 'An sinh xã hội' },
    { id: 'Đại đoàn kết', label: 'Đại đoàn kết' },
    { id: 'Dân vận', label: 'Dân vận' },
    { id: 'Giám sát - Phản biện', label: 'Giám sát - Phản biện' },
    { id: 'Tuyên truyền', label: 'Tuyên truyền' },
    { id: 'Phong trào thi đua', label: 'Phong trào thi đua' },
  ];

  // Helper to determine if an article strictly belongs to Uncle Ho's Ideology
  const isUncleHoArticle = (art: Article): boolean => {
    if (!art) return false;
    const catLower = (art.category || '').toLowerCase().trim();
    if (
      catLower === 'học tập và làm theo bác' ||
      catLower === 'học tập làm theo bác' ||
      (catLower.includes('học tập') && (catLower.includes('bác') || catLower.includes('hồ chí minh')))
    ) {
      return true;
    }
    const tagsLower = (art.tags || []).map(t => (t || '').toLowerCase().trim());
    if (
      tagsLower.some(t => 
        t === 'học tập làm theo bác' || 
        t === 'học tập và làm theo bác' || 
        t.includes('bác hồ') || 
        t.includes('hồ chí minh') ||
        t.includes('không gian văn hóa hồ chí minh')
      )
    ) {
      return true;
    }
    const titleLower = (art.title || '').toLowerCase();
    if (
      titleLower.includes('học tập và làm theo bác') ||
      titleLower.includes('học tập làm theo bác') ||
      titleLower.includes('bác hồ') ||
      titleLower.includes('hồ chí minh') ||
      titleLower.includes('lời bác dạy') ||
      titleLower.includes('không gian văn hóa hồ chí minh')
    ) {
      return true;
    }
    return false;
  };

  // Ensure all incoming articles are sorted newest first
  const sortedAllArticles = useMemo(() => sortArticlesNewestFirst(articles), [articles]);

  // Filter articles based on category & search query (always maintaining newest first order)
  const filteredArticles = useMemo(() => {
    return sortedAllArticles.filter(art => {
      let matchesCat = selectedCategory === 'ALL';
      if (selectedCategory === 'Học tập và làm theo Bác' || selectedCategory === 'Học tập làm theo Bác') {
        matchesCat = isUncleHoArticle(art);
      } else if (selectedCategory !== 'ALL') {
        matchesCat = art.category === selectedCategory;
      }

      const matchesSearch = !searchQuery || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (art.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [sortedAllArticles, selectedCategory, searchQuery]);

  // Main featured article (Pick the newest featured article, or the newest article overall)
  const mainHero = filteredArticles.find(a => a.isFeatured) || filteredArticles[0];
  
  // Secondary hero articles (All remaining articles for the infinite vertical loop)
  const secondaryNewsList = useMemo(() => {
    const list = filteredArticles.filter(a => a.id !== mainHero?.id);
    if (list.length >= 4) return list;
    const extra = sortedAllArticles.filter(a => a.id !== mainHero?.id && !list.some(l => l.id === a.id));
    return [...list, ...extra];
  }, [filteredArticles, sortedAllArticles, mainHero]);

  // Duplicated list to create 100% seamless infinite scroll from bottom to top
  const loopingSecondaryNews = useMemo(() => {
    if (secondaryNewsList.length === 0) return [];
    return [...secondaryNewsList, ...secondaryNewsList];
  }, [secondaryNewsList]);

  // Remaining articles for sub-grid
  const remainingArticles = filteredArticles.filter(a => a.id !== mainHero?.id);

  // Special Category: Strictly Uncle Ho Ideology articles only (newest first)
  const hcmIdeologyArticles = useMemo(() => sortedAllArticles.filter(isUncleHoArticle), [sortedAllArticles]);

  // Special Category: 12 Neighborhoods (newest first)
  const neighborhoodArticles = useMemo(() => sortedAllArticles.filter(a => 
    a.category === 'Hoạt động khu phố' || (a.tags || []).some(t => t.toLowerCase().includes('khu phố'))
  ), [sortedAllArticles]);

  // Current formatted date
  const todayDateStr = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'Học tập và làm theo Bác':
      case 'Học tập làm theo Bác':
        return 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-rose-500/20';
      case 'An sinh xã hội':
        return 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-500/20';
      case 'Đại đoàn kết':
        return 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-red-500/20';
      case 'Hoạt động khu phố':
        return 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/20';
      case 'Giám sát - Phản biện':
        return 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/20';
      case 'Dân vận':
        return 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-500/20';
      case 'Phong trào thi đua':
        return 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-yellow-500/20 font-black';
      default:
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/20';
    }
  };

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* 1. FRESH FLAT BLUE BLUR TICKER & DATE BAR */}
      <div className="bg-white/90 backdrop-blur-md text-slate-900 rounded-2xl p-3 px-4 shadow-2xs border border-blue-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center gap-3 overflow-hidden relative z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 text-white font-black text-[11px] rounded-xl shrink-0 uppercase tracking-wider shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-white animate-bounce" />
            <span>TIN NỔI BẬT AN SINH XÃ HỘI</span>
          </div>
          {mainHero && (
            <div 
              onClick={() => onSelectArticle(mainHero)}
              className="text-slate-800 hover:text-blue-600 transition-colors cursor-pointer font-bold truncate flex items-center gap-2"
            >
              <span className="text-blue-600 font-extrabold hidden sm:inline">[{mainHero.category}]</span>
              <span className="truncate">{mainHero.title}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-slate-500 font-medium shrink-0 self-end md:self-auto text-[11px] relative z-10">
          <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span className="capitalize">{todayDateStr}</span>
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="bg-blue-50 text-blue-700 border border-blue-200/80 px-2 py-0.5 rounded-lg font-mono text-[10px] tracking-widest uppercase font-bold">
            ● CỔNG AN SINH SỐ
          </span>
        </div>
      </div>

      {/* 2. MAIN HERO NEWS MATRIX (FLAT BLUE MATRIX) */}
      {!searchQuery && selectedCategory === 'ALL' && mainHero && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-blue-600 rounded-sm shadow-xs" />
              <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <span>TIN TỨC ĐỊA PHƯƠNG TIÊU ĐIỂM</span>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-extrabold px-2 py-0.5 rounded-full border border-blue-200">VÌ NGƯỜI NGHÈO</span>
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider hidden sm:inline">
              Trang tin MTTQ &amp; An sinh Phường Chánh Hiệp
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
            {/* Left Main Hero (7 cols) - Clear Image Focus with motion effect */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.025, y: -4 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              onClick={() => onSelectArticle(mainHero)}
              className="lg:col-span-7 group cursor-pointer space-y-3 flex flex-col justify-between hover:shadow-lg p-2.5 rounded-2xl transition-all duration-300 bg-white"
            >
              <div className="relative h-64 sm:h-80 md:h-[360px] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs">
                <img
                  src={getGoogleDriveDirectImageUrl(mainHero.featuredImage) || 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80&w=1200'}
                  alt={mainHero.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* LOW DEEP BLUE OVERLAY GRADIENT */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-blue-950/95 via-blue-900/50 to-transparent pointer-events-none" />
                
                <span className={`absolute top-3 left-3 text-[10px] font-black uppercase px-3 py-1 rounded-xl shadow-xs ${getCategoryBadgeStyle(mainHero.category)}`}>
                  {mainHero.category}
                </span>

                <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs font-medium text-slate-200">
                  <span className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    {mainHero.authorName}
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    {mainHero.publishDate}
                  </span>
                </div>
              </div>

              {/* Text content clearly separated beneath the image */}
              <div className="space-y-2 pt-1">
                <h1 className="text-lg sm:text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {mainHero.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {mainHero.summary}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-extrabold text-blue-600">
                <span className="flex items-center gap-1 text-slate-500 font-normal">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  {mainHero.views} lượt xem
                </span>
                <span className="group-hover:translate-x-1.5 transition-transform flex items-center gap-1.5 text-blue-700 font-bold">
                  Xem toàn văn tin bài <ArrowRight className="w-4 h-4 text-blue-600" />
                </span>
              </div>
            </motion.div>

            {/* Right Secondary Stack (5 cols) - Infinite Vertical Scrolling Loop */}
            <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 overflow-hidden">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 shrink-0">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>TIN CHĂM LO AN SINH KHÁC</span>
                </h3>
                <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-bold border border-blue-200/60 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  Tự động cuộn
                </span>
              </div>

              {/* Vertical Infinite Scrolling Container (Continuous Loop from Bottom to Top) */}
              <div className="relative h-[330px] sm:h-[350px] md:h-[370px] overflow-hidden my-2 rounded-2xl bg-slate-50/60 border border-slate-200/70 group/scroll">
                {/* Top & Bottom gradient fades for smooth infinite loop entry/exit */}
                <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-slate-50 via-slate-50/80 to-transparent pointer-events-none z-10" />
                <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent pointer-events-none z-10" />

                {/* Looping Track */}
                <div className="animate-vertical-loop flex flex-col space-y-2.5 p-2.5">
                  {loopingSecondaryNews.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      onClick={() => onSelectArticle(item)}
                      className="p-2.5 bg-white hover:bg-blue-50/60 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:shadow-md cursor-pointer flex gap-3 items-center transition-all duration-200 group/item shrink-0 shadow-2xs"
                    >
                      <div className="w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80 relative shadow-2xs">
                        <img
                          src={getGoogleDriveDirectImageUrl(item.featuredImage) || 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=400'}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <span className="inline-block text-[9px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                          {item.category}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 group-hover/item:text-blue-600 transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-blue-600" />
                            {item.publishDate}
                          </span>
                          <span>•</span>
                          <span>{item.views} lượt xem</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Banner Hotline / Direct Portal Link - Flat Blue Banner */}
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-3.5 rounded-2xl flex items-center justify-between border border-blue-400/30 shadow-xs shrink-0">
                <div>
                  <div className="text-[10px] uppercase font-black text-blue-300 tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    <span>GÓC DÂN SINH &amp; CỨU TRỢ 24/7</span>
                  </div>
                  <div className="text-xs font-black text-white mt-0.5">Gửi Ý kiến &amp; Phản ánh Số</div>
                </div>
                <button 
                  onClick={() => onGoToOpinion && onGoToOpinion()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-[11px] rounded-xl transition-all shrink-0 active:scale-95 shadow-2xs cursor-pointer"
                >
                  Gửi ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CATEGORY FILTER PILLS BAR */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-blue-600 rounded-xs shadow-xs" />
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">
              TIN TỨC ĐỊA PHƯƠNG THEO CHUYÊN MỤC
            </h2>
          </div>
          
          <div className="text-xs text-slate-500 font-medium">
            Hiển thị <span className="font-bold text-blue-600">{filteredArticles.length}</span> bài viết
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. ARTICLES MAIN GRID (FLAT BLUE CARDS) */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 shadow-2xs">
          <FileText className="w-10 h-10 mx-auto text-blue-600 mb-2" />
          <p className="font-bold text-sm text-slate-800">Không tìm thấy tin bài nào phù hợp.</p>
          <p className="text-xs text-slate-500 mt-1">Vui lòng thử chọn chuyên mục khác hoặc từ khóa tìm kiếm.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <motion.article
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.035, y: -6 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer group"
            >
              {/* CLEAR IMAGE CONTAINER */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-900 border-b border-slate-100">
                <img
                  src={getGoogleDriveDirectImageUrl(article.featuredImage) || 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80&w=800'}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-3 left-3 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg shadow-xs ${getCategoryBadgeStyle(article.category)}`}>
                  {article.category}
                </span>
                {article.originalUrl && (
                  <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-blue-300 border border-blue-400/30 text-[9.5px] font-extrabold px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                    <ExternalLink className="w-2.5 h-2.5 text-blue-400" />
                    <span>Facebook</span>
                  </span>
                )}
              </div>

              {/* UNCOVERED TEXT CONTAINER */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      {article.publishDate}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      {article.views} lượt xem
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium truncate max-w-[180px]">
                    {article.authorName}
                  </span>
                  <span className="text-blue-600 font-extrabold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Đọc tiếp &rarr;
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* 5. SPECIAL SECTION: HỌC TẬP VÀ LÀM THEO BÁC (SOFT PINK & WHITE THEME) */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-rose-50/90 via-pink-50/60 to-white rounded-3xl text-slate-900 shadow-xs border border-rose-200/80 space-y-6 relative overflow-hidden backdrop-blur-md">

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-rose-200/80 pb-5 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-gradient-to-br from-rose-600 to-pink-600 text-white rounded-2xl shadow-md border border-rose-300 shrink-0">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="text-[11px] font-black uppercase text-rose-800 bg-rose-100/90 border border-rose-200/80 px-3 py-0.5 rounded-full w-max flex items-center gap-1.5 shadow-2xs">
                <span>🌸 CHUYÊN ĐỀ DÂN VẬN &amp; TƯ TƯỞNG BÁC</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-rose-950 tracking-tight flex items-center gap-2">
                HỌC TẬP VÀ LÀM THEO TƯ TƯỞNG, ĐẠO ĐỨC, PHONG CÁCH HỒ CHÍ MINH
              </h2>
            </div>
          </div>

          <div className="bg-rose-100/60 border border-rose-200/90 p-3.5 rounded-2xl text-rose-950 text-xs italic font-medium max-w-lg space-y-1 shadow-2xs">
            <div className="text-rose-800 font-extrabold not-italic text-[11px] flex items-center gap-1">
              <span>★ Không gian văn hóa Hồ Chí Minh Số tại 21 Khu phố</span>
            </div>
            <p className="text-rose-900/90 leading-relaxed">
              "Tháp Mười đẹp nhất bông sen - Việt Nam đẹp nhất có tên Bác Hồ" — Lan tỏa nếp sống văn minh, mô hình "Dân vận khéo" số hóa tại phường Chánh Hiệp.
            </p>
          </div>
        </div>

        {hcmIdeologyArticles.length === 0 ? (
          <div className="bg-white/80 rounded-2xl p-6 text-center border border-rose-200 text-rose-900 text-xs font-semibold relative z-10 shadow-2xs">
            <p className="font-bold text-rose-950">Chưa có tin bài thuộc chuyên mục "Học tập và làm theo Bác".</p>
            <p className="text-[11px] text-rose-700 mt-1">Cán bộ phụ trách có thể đăng tin bài mới và chọn thể loại "Học tập và làm theo Bác" trong Văn phòng số.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
            {hcmIdeologyArticles.slice(0, 3).map((item, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.025, y: -4 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                key={item.id}
                onClick={() => onSelectArticle(item)}
                className="bg-white hover:bg-rose-50/50 border border-rose-200/80 hover:border-rose-300 p-4 rounded-2xl cursor-pointer transition-all duration-300 space-y-3 group shadow-2xs hover:shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-36 rounded-xl overflow-hidden bg-rose-100 border border-rose-200 relative">
                    <img
                      src={getGoogleDriveDirectImageUrl(item.featuredImage) || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-rose-600 text-white font-black text-[9.5px] px-2.5 py-0.5 rounded-md uppercase shadow-xs flex items-center gap-1 border border-rose-400">
                      <LotusFlowerIcon className="w-3 h-3 text-white" />
                      <span>Không gian Bác Hồ</span>
                    </div>
                    {item.originalUrl && (
                      <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-blue-200 border border-blue-400/30 text-[9px] font-extrabold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                        <ExternalLink className="w-2.5 h-2.5 text-blue-300" />
                        <span>Facebook</span>
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-extrabold text-xs text-slate-900 group-hover:text-rose-700 line-clamp-2 leading-snug transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                
                <div className="text-[10px] text-rose-700 font-bold flex items-center justify-between pt-2 border-t border-rose-100">
                  <span>{item.publishDate}</span>
                  <span className="text-rose-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-extrabold">
                    Xem bài viết <ChevronRight className="w-3.5 h-3.5 text-rose-600" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 6. NEIGHBORHOOD 21 STREAM (HOẠT ĐỘNG 21 KHU PHỐ) */}
      <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-blue-100 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">
              TIN HOẠT ĐỘNG TẠI 21 KHU PHỐ DÂN CƯ
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Chánh Hiệp, TP. Hồ Chí Minh
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {neighborhoodArticles.map((art, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -2 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              key={art.id}
              onClick={() => onSelectArticle(art)}
              className="p-4 bg-slate-50 hover:bg-blue-50/70 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex gap-3.5 items-center group"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-200 border border-slate-200">
                <img
                  src={getGoogleDriveDirectImageUrl(art.featuredImage)}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                  {art.category}
                </span>
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 line-clamp-2 leading-snug">
                  {art.title}
                </h4>
                <div className="text-[10px] text-slate-500">
                  {art.publishDate} • {art.authorName}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
