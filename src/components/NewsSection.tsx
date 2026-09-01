import React, { useState, useMemo } from 'react';
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

// Custom Lotus Flower SVG Component for Uncle Ho's Learning Space (Tone màu hồng hoa sen)
const LotusFlowerIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g opacity="0.98">
      {/* Outer Lotus Petals */}
      <path d="M50 12 C30 32 15 52 25 74 C35 84 50 82 50 82 C50 82 65 84 75 74 C85 52 70 32 50 12 Z" fill="url(#lotus-pink-grad-outer)" />
      {/* Left Petals */}
      <path d="M50 28 C20 42 8 68 28 80 C42 86 50 82 50 82 C50 82 35 62 50 28 Z" fill="url(#lotus-pink-grad-left)" opacity="0.92" />
      {/* Right Petals */}
      <path d="M50 28 C80 42 92 68 72 80 C58 86 50 82 50 82 C50 82 65 62 50 28 Z" fill="url(#lotus-pink-grad-right)" opacity="0.92" />
      {/* Center Main Petal */}
      <path d="M50 18 C38 38 32 62 50 78 C68 62 62 38 50 18 Z" fill="url(#lotus-pink-grad-center)" />
      {/* Inner Petal Glow */}
      <path d="M50 32 C42 48 40 66 50 76 C60 66 58 48 50 32 Z" fill="url(#lotus-gold-core)" opacity="0.88" />
      {/* Lotus Stamen Core */}
      <circle cx="50" cy="70" r="4.5" fill="#fef08a" />
      <circle cx="45" cy="68" r="1.5" fill="#fde047" />
      <circle cx="55" cy="68" r="1.5" fill="#fde047" />
      <circle cx="50" cy="65" r="1.5" fill="#fde047" />
    </g>
    <defs>
      <linearGradient id="lotus-pink-grad-outer" x1="50" y1="12" x2="50" y2="84" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f472b6" />
        <stop offset="0.5" stopColor="#e11d48" />
        <stop offset="1" stopColor="#881337" />
      </linearGradient>
      <linearGradient id="lotus-pink-grad-center" x1="50" y1="18" x2="50" y2="78" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fbcfe8" />
        <stop offset="0.6" stopColor="#f43f5e" />
        <stop offset="1" stopColor="#9f1239" />
      </linearGradient>
      <linearGradient id="lotus-pink-grad-left" x1="8" y1="42" x2="50" y2="82" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fb7185" />
        <stop offset="1" stopColor="#be123c" />
      </linearGradient>
      <linearGradient id="lotus-pink-grad-right" x1="92" y1="42" x2="50" y2="82" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fb7185" />
        <stop offset="1" stopColor="#be123c" />
      </linearGradient>
      <linearGradient id="lotus-gold-core" x1="50" y1="32" x2="50" y2="76" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fff1f2" />
        <stop offset="0.7" stopColor="#f472b6" />
        <stop offset="1" stopColor="#fde047" />
      </linearGradient>
    </defs>
  </svg>
);

interface NewsSectionProps {
  articles: Article[];
  searchQuery: string;
  onSelectArticle: (article: Article) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ articles, searchQuery, onSelectArticle }) => {
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
  
  // Secondary hero articles (Next 3-4 newest articles)
  const secondaryHeroes = filteredArticles.filter(a => a.id !== mainHero?.id).slice(0, 4);

  // Remaining articles for sub-grid
  const remainingArticles = filteredArticles.filter(a => a.id !== mainHero?.id && !secondaryHeroes.some(s => s.id === a.id));

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
                <span>TIN TIÊU ĐIỂM &amp; CHĂM LO AN SINH</span>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-extrabold px-2 py-0.5 rounded-full border border-blue-200">VÌ NGƯỜI NGHÈO</span>
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider hidden sm:inline">
              Trang tin MTTQ &amp; An sinh Phường Chánh Hiệp
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
            {/* Left Main Hero (7 cols) - Clear Image Focus */}
            <div 
              onClick={() => onSelectArticle(mainHero)}
              className="lg:col-span-7 group cursor-pointer space-y-3 flex flex-col justify-between"
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
            </div>

            {/* Right Secondary Stack (5 cols) */}
            <div className="lg:col-span-5 space-y-3 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>TIN CHĂM LO AN SINH KHÁC</span>
              </h3>

              <div className="space-y-3 flex-1 divide-y divide-slate-100">
                {secondaryHeroes.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectArticle(item)}
                    className="pt-3 first:pt-0 group cursor-pointer flex gap-3.5 items-center"
                  >
                    <div className="w-24 h-20 sm:w-28 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative shadow-2xs">
                      <img
                        src={getGoogleDriveDirectImageUrl(item.featuredImage) || 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=400'}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="space-y-1 flex-1">
                      <span className="inline-block text-[9px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/80">
                        {item.category}
                      </span>
                      <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5 font-medium">
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

              {/* Banner Hotline / Direct Portal Link - Flat Blue Banner */}
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-4 rounded-2xl flex items-center justify-between border border-blue-400/30 shadow-xs">
                <div>
                  <div className="text-[10px] uppercase font-black text-blue-300 tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    <span>GÓC DÂN SINH &amp; CỨU TRỢ 24/7</span>
                  </div>
                  <div className="text-xs font-black text-white mt-0.5">Gửi Ý kiến &amp; Phản ánh Số</div>
                </div>
                <button 
                  onClick={() => alert('Vui lòng chọn tab "Gửi ý kiến dân sinh" trên thanh menu chính')}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-[11px] rounded-xl transition-all shrink-0 active:scale-95 shadow-2xs cursor-pointer"
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
              TIN BÀI THEO CHUYÊN MỤC AN SINH XÃ HỘI &amp; MẶT TRẬN SỐ
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
            <article
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-lg hover:border-blue-400 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer group"
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
            </article>
          ))}
        </div>
      )}

      {/* 5. SPECIAL SECTION: HỌC TẬP VÀ LÀM THEO BÁC (SOFT PINK & WHITE THEME) */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-rose-50/90 via-pink-50/60 to-white rounded-3xl text-slate-900 shadow-xs border border-rose-200/80 space-y-6 relative overflow-hidden backdrop-blur-md">
        {/* Background Decorative Lotus Watermark */}
        <div className="absolute -right-12 -bottom-12 opacity-15 pointer-events-none transform rotate-12 scale-150 text-rose-300">
          <LotusFlowerIcon className="w-80 h-80 text-rose-300" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-rose-200/80 pb-5 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-gradient-to-br from-rose-600 to-pink-600 text-white rounded-2xl shadow-md border border-rose-300 shrink-0">
              <LotusFlowerIcon className="w-8 h-8" />
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
              <span>★ Không gian văn hóa Hồ Chí Minh Số tại 12 Khu phố</span>
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
            {hcmIdeologyArticles.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectArticle(item)}
                className="bg-white hover:bg-rose-50/50 border border-rose-200/80 hover:border-rose-300 p-4 rounded-2xl cursor-pointer transition-all duration-300 space-y-3 group shadow-2xs hover:shadow-md flex flex-col justify-between"
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. NEIGHBORHOOD 12 STREAM (HOẠT ĐỘNG 12 KHU PHỐ) */}
      <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-blue-100 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">
              TIN HOẠT ĐỘNG TẠI 12 KHU PHỐ DÂN CƯ
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Chánh Hiệp, TP. Thủ Dầu Một
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {neighborhoodArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => onSelectArticle(art)}
              className="p-4 bg-slate-50 hover:bg-blue-50/70 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all cursor-pointer flex gap-3.5 items-center group"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
