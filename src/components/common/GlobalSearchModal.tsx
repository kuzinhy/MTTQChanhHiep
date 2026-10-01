import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, FileText, Newspaper, MapPin, Users, HeartHandshake, 
  MessageSquare, Sparkles, ArrowRight, X, Clock, ExternalLink, 
  Command, ShieldCheck, CheckCircle2, CornerDownLeft
} from 'lucide-react';
import { OfficialDocument, Article, PublicOpinion } from '../../types';
import { ContactService } from '../../lib/ai/contactService';
import { OFFICIAL_NEIGHBORHOOD_NAMES } from '../../data/neighborhoodsList';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents?: OfficialDocument[];
  articles?: Article[];
  opinions?: PublicOpinion[];
  onNavigate: (route: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  documents = [],
  articles = [],
  opinions = [],
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'DOCS' | 'NEWS' | 'MAP' | 'CONTACTS' | 'WELFARE'>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const contacts = useMemo(() => ContactService.getAllContacts(), []);

  // Filter items across all collections
  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: 'DOCS' | 'NEWS' | 'MAP' | 'CONTACTS' | 'WELFARE';
      categoryLabel: string;
      route: string;
      badge?: string;
      icon: any;
    }> = [];

    // 1. Documents & Procedures
    if (activeCategory === 'ALL' || activeCategory === 'DOCS') {
      documents.forEach(doc => {
        const codeNum = doc.codeNumber || (doc as any).documentNumber || '';
        const fieldName = doc.field || (doc as any).category || 'Mặt trận';
        if (
          doc.title.toLowerCase().includes(q) ||
          codeNum.toLowerCase().includes(q) ||
          (doc.summary && doc.summary.toLowerCase().includes(q))
        ) {
          results.push({
            id: 'doc-' + doc.id,
            title: doc.title,
            subtitle: `Số hiệu: ${codeNum} • Lĩnh vực: ${fieldName}`,
            category: 'DOCS',
            categoryLabel: 'Văn bản & Thủ tục',
            route: `/van-ban/${doc.id}`,
            badge: fieldName,
            icon: FileText
          });
        }
      });
    }

    // 2. Articles & News
    if (activeCategory === 'ALL' || activeCategory === 'NEWS') {
      articles.forEach(art => {
        const authorName = art.authorName || (art as any).author || 'Ban Biên tập';
        if (
          art.title.toLowerCase().includes(q) ||
          (art.summary && art.summary.toLowerCase().includes(q))
        ) {
          results.push({
            id: 'art-' + art.id,
            title: art.title,
            subtitle: `Ngày đăng: ${art.publishedAt || art.publishDate || 'Mới nhất'} • Tác giả: ${authorName}`,
            category: 'NEWS',
            categoryLabel: 'Tin tức & Hoạt động',
            route: `/tin-tuc/${art.id}`,
            badge: art.category,
            icon: Newspaper
          });
        }
      });
    }

    // 3. 21 Neighborhoods
    if (activeCategory === 'ALL' || activeCategory === 'MAP') {
      OFFICIAL_NEIGHBORHOOD_NAMES.forEach(nb => {
        if (nb.toLowerCase().includes(q) || `khu phố ${nb.toLowerCase()}`.includes(q)) {
          results.push({
            id: 'nb-' + nb,
            title: `Khu phố ${nb}`,
            subtitle: `Văn phòng Ban Điều hành & Ban Công tác Mặt trận Khu phố ${nb}, Phường Chánh Hiệp`,
            category: 'MAP',
            categoryLabel: 'Địa bàn & Khu phố',
            route: '/ban-do',
            badge: '21 KP',
            icon: MapPin
          });
        }
      });
    }

    // 4. Cadres & Contacts
    if (activeCategory === 'ALL' || activeCategory === 'CONTACTS') {
      contacts.forEach(ct => {
        if (
          ct.name.toLowerCase().includes(q) ||
          ct.title.toLowerCase().includes(q) ||
          ct.department.toLowerCase().includes(q) ||
          (ct.responsibility && ct.responsibility.toLowerCase().includes(q))
        ) {
          results.push({
            id: 'ct-' + ct.id,
            title: `${ct.name} - ${ct.title}`,
            subtitle: `${ct.department} • Hotline: ${ct.phone}`,
            category: 'CONTACTS',
            categoryLabel: 'Cán bộ & Đầu mối',
            route: '/gioi-thieu',
            badge: 'Cán bộ',
            icon: Users
          });
        }
      });
    }

    // 5. Welfare & Social Programs
    if (activeCategory === 'ALL' || activeCategory === 'WELFARE') {
      const welfareKeywords = [
        { name: 'Chương trình Bữa cơm nghĩa tình', desc: 'Phát suất ăn miễn phí cho người già neo đơn, lao động khó khăn', route: '/an-sinh' },
        { name: 'Quỹ Vì người nghèo Phường Chánh Hiệp', desc: 'Hỗ trợ xây mới, sửa chữa nhà Đại đoàn kết và trợ cấp đột xuất', route: '/an-sinh' },
        { name: 'Không gian Văn hóa Hồ Chí Minh', desc: 'Tầng 2 Trụ sở Phường - Lưu giữ tư liệu hiện vật về Bác Hồ', route: '/gioi-thieu' },
        { name: 'Gửi Phản ánh - Kiến nghị Dân sinh', desc: 'Tiếp nhận xử lý ý kiến rác thải, trật tự đô thị trong 24-48h', route: '/phan-anh' },
        { name: 'Đăng ký Tình nguyện viên Thanh niên', desc: 'Đội hình chuyển đổi số, hiến máu nhân đạo, Ngày chủ nhật xanh', route: '/tinh-nguyen' }
      ];

      welfareKeywords.forEach(wf => {
        if (wf.name.toLowerCase().includes(q) || wf.desc.toLowerCase().includes(q)) {
          results.push({
            id: 'wf-' + wf.name,
            title: wf.name,
            subtitle: wf.desc,
            category: 'WELFARE',
            categoryLabel: 'An sinh & Tiện ích',
            route: wf.route,
            badge: 'Dân sinh',
            icon: HeartHandshake
          });
        }
      });
    }

    return results.slice(0, 15);
  }, [query, activeCategory, documents, articles, contacts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-16 md:pt-24 p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/70">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
            <Search className="w-5 h-5" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm văn bản, tin tức, thủ tục, 21 khu phố, cán bộ, an sinh..."
            className="flex-1 bg-transparent text-slate-800 text-sm md:text-base font-medium placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 bg-slate-200/80 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
          >
            ESC
          </button>
        </div>

        {/* Filter Categories Chips */}
        <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs bg-white scrollbar-none">
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'DOCS', label: 'Văn bản & Thủ tục' },
            { id: 'NEWS', label: 'Tin tức' },
            { id: 'MAP', label: '21 Khu phố' },
            { id: 'CONTACTS', label: 'Cán bộ' },
            { id: 'WELFARE', label: 'An sinh & Tiện ích' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 divide-y divide-slate-100/60">
          {!query.trim() ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Command className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Tìm kiếm Toàn năng Phường Chánh Hiệp</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Nhập từ khóa để tra cứu tức thì văn bản chỉ đạo, sơ đồ thủ tục, tin tức, cán bộ trực ban, hoặc vị trí 21 khu phố.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                <span className="text-[11px] text-slate-400 font-semibold">Gợi ý tìm nhanh:</span>
                {['Thủ tục kết hôn', 'Bùi Văn Huy', 'Bữa cơm nghĩa tình', 'Khu phố Định Hòa 5', 'Hotline phường'].map((sug, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => setQuery(sug)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-lg text-xs font-medium transition"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700">Không tìm thấy kết quả phù hợp với "{query}"</p>
              <p className="text-xs text-slate-500">Hãy thử từ khóa ngắn hơn hoặc chuyển sang danh mục khác.</p>
            </div>
          ) : (
            searchResults.map(item => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.route);
                    onClose();
                  }}
                  className="p-3 rounded-xl hover:bg-blue-50/70 transition flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-600 rounded-xl transition shrink-0 mt-0.5">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="px-2 py-0.5 bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-800 text-slate-600 text-[10px] font-bold rounded-md shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition shrink-0" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-semibold text-blue-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              Cổng Thông tin Phường Chánh Hiệp
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Dùng phím <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">ESC</kbd> để đóng</span>
          </div>
        </div>
      </div>
    </div>
  );
};
