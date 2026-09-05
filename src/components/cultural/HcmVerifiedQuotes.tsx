import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Quote,
  Search,
  Filter,
  Copy,
  Check,
  ShieldCheck,
  BookOpen,
  Calendar,
  Sparkles,
  Users,
  Award,
  Edit3
} from 'lucide-react';
import { VERIFIED_QUOTES, VerifiedQuote } from '../../data/hcmVerifiedMuseumData';
import { loadStoredQuotes, saveStoredQuotes } from '../../lib/hcmDataStore';
import { DongSonDrumIcon, ChimHacIcon, HoaSenIcon } from './TraditionalMotifs';
import { UniversalHcmEditorModal } from './UniversalHcmEditorModal';

interface HcmVerifiedQuotesProps {
  isResearchMode: boolean;
  isAdmin?: boolean;
}

export const HcmVerifiedQuotes: React.FC<HcmVerifiedQuotesProps> = ({ isResearchMode, isAdmin = false }) => {
  const [quotesList, setQuotesList] = useState<VerifiedQuote[]>(() => loadStoredQuotes());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null);

  // Admin Direct Editing state
  const [editingQuote, setEditingQuote] = useState<VerifiedQuote | null>(null);

  useEffect(() => {
    setQuotesList(loadStoredQuotes());
  }, []);

  const handleSaveQuote = (updated: VerifiedQuote) => {
    const updatedList = quotesList.map((q) => (q.id === updated.id ? updated : q));
    setQuotesList(updatedList);
    saveStoredQuotes(updatedList);
    setEditingQuote(null);
  };

  const categories = [
    'ALL',
    'Đại đoàn kết',
    'Dân vận',
    'Cán bộ & Đạo đức',
    'Độc lập tự do',
    'Thi đua ái quốc',
    'Thanh niên & Giáo dục'
  ];

  const filteredQuotes = useMemo(() => {
    return quotesList.filter((item) => {
      const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.quoteText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.occasion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.originalWork.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [quotesList, selectedCategory, searchQuery]);

  const handleCopyQuote = (quote: VerifiedQuote) => {
    const textToCopy = `"${quote.quoteText}"\n— Chủ tịch Hồ Chí Minh (${quote.dateStr}, trong "${quote.originalWork}", Hồ Chí Minh Toàn tập, Tập ${quote.volume}, tr. ${quote.page}, NXB Chính trị quốc gia Sự thật).`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedQuoteId(quote.id);
    setTimeout(() => setCopiedQuoteId(null), 2500);
  };

  return (
    <div className="space-y-6 py-2">
      {/* Universal Direct Editor Modal for Admin Editing Quotes */}
      {editingQuote && (
        <UniversalHcmEditorModal
          isOpen={!!editingQuote}
          onClose={() => setEditingQuote(null)}
          itemType="quote"
          itemData={editingQuote}
          onSave={handleSaveQuote}
        />
      )}

      {/* Header Giới thiệu - Tone Hồng Cánh Sen */}
      <div className="bg-gradient-to-br from-white via-rose-50/60 to-amber-50/40 p-5 sm:p-6 rounded-3xl border-2 border-rose-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-rose-950 flex items-center gap-2">
              <Quote className="w-5 h-5 text-rose-700" />
              <span>Kho Trích Dẫn "Lời Người" Đã Kiểm Định Nguồn (Level A)</span>
            </h2>
            <p className="text-xs text-rose-800/80 mt-1">
              Tuyệt đối không lưu truyền các câu nói vô căn cứ; 100% trích dẫn gắn liền xuất xứ, thời điểm và vị trí lưu trữ trong *Hồ Chí Minh Toàn tập*.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-700" />
            <input
              type="text"
              placeholder="Tìm theo nội dung, bối cảnh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-rose-950 font-medium"
            />
          </div>
        </div>

        {/* Thanh Chọn Chuyên Đề */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-rose-700 via-pink-600 to-rose-800 text-white shadow-xs'
                  : 'bg-rose-100 text-rose-900 border border-rose-200 hover:bg-rose-200'
              }`}
            >
              {cat === 'ALL' ? 'Tất cả chuyên đề' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* LƯỚI DANH SÁCH TRÍCH DẪN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuotes.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-gradient-to-br from-white via-rose-50/50 to-amber-50/30 border-2 border-rose-200 shadow-xs hover:border-rose-400 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 font-bold text-[11px] border border-rose-200">
                  {item.category}
                </span>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      onClick={() => setEditingQuote(item)}
                      className="px-2.5 py-1 rounded-lg bg-amber-300 text-rose-950 font-extrabold text-[11px] flex items-center gap-1 hover:bg-amber-200 transition shadow-xs cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Sửa</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleCopyQuote(item)}
                    className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-800 transition cursor-pointer"
                    title="Sao chép trích dẫn học thuật"
                  >
                    {copiedQuoteId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <blockquote className="text-sm sm:text-base font-serif font-bold text-rose-950 leading-relaxed italic border-l-4 border-rose-600 pl-3.5">
                “{item.quoteText}”
              </blockquote>
            </div>

            <div className="pt-3 border-t border-rose-200/80 space-y-1.5 text-xs text-rose-900/80">
              <p className="font-semibold text-rose-950">
                <span className="text-rose-700">Hoàn cảnh / Bối cảnh:</span> {item.occasion} ({item.dateStr})
              </p>

              <p className="font-mono text-[11px] text-rose-800">
                <span>Xuất xứ: "{item.originalWork}"</span> • <span>Tập {item.volume}, Trang {item.page}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
