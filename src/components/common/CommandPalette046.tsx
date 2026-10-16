// Lucian UX/UI Prompt #046 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#046
import React, { useState, useEffect, useRef, useId } from 'react';
import { 
  Search, 
  FileText, 
  BookOpen, 
  MessageSquareHeart, 
  MapPin, 
  Landmark, 
  HeartHandshake, 
  UserCheck, 
  BarChart3, 
  Monitor, 
  Scale, 
  Info,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';

export interface CommandItem {
  id: string;
  g: string; // Group / Category
  n: string; // Name / Title
  description?: string;
  icon?: any;
  gradient?: string;
  k?: string; // Keyboard shortcut string
  action: () => void;
}

interface CommandPalette046Props {
  onSelectTab?: (tab: string) => void;
  onOpenHcmSpaceModal?: () => void;
  onOpenVolunteerModal?: () => void;
  onOpenDirectory?: () => void;
  onGoToOffice?: (view?: string) => void;
  onOpenGlobalSearch?: () => void;
  className?: string;
}

export const CommandPalette046: React.FC<CommandPalette046Props> = ({
  onSelectTab,
  onOpenHcmSpaceModal,
  onOpenVolunteerModal,
  onOpenDirectory,
  onGoToOffice,
  onOpenGlobalSearch,
  className = ''
}) => {
  const [isClosed, setIsClosed] = useState<boolean>(true);
  const [query, setQuery] = useState<string>('');
  const [actIndex, setActIndex] = useState<number>(0);
  const [runMessage, setRunMessage] = useState<string | null>(null);
  const [isMac, setIsMac] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const doneTimerRef = useRef<NodeJS.Timeout | null>(null);

  const uid = useId();

  // Detect Mac platform safely
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator) {
      setIsMac(/Mac|iPhone|iPad/i.test(navigator.platform || ''));
    }
  }, []);

  // Real project commands data
  const COMMAND_DATA: CommandItem[] = [
    {
      id: 'cmd-news',
      g: 'Tin Tức & Hoạt Động',
      n: 'Đại hội MTTQ & Hoạt động khu phố',
      description: 'Cập nhật tin tức đại đoàn kết, dân vận khéo',
      icon: BookOpen,
      gradient: 'linear-gradient(140deg,#0068ff,#0052cc)',
      k: isMac ? '⌘1' : 'Ctrl 1',
      action: () => onSelectTab && onSelectTab('news')
    },
    {
      id: 'cmd-docs',
      g: 'Tin Tức & Hoạt Động',
      n: 'Kho Văn bản & Kế hoạch triển khai',
      description: 'Tra cứu kế hoạch, biểu mẫu chính thức',
      icon: FileText,
      gradient: 'linear-gradient(140deg,#119C72,#0E805D)',
      k: isMac ? '⌘2' : 'Ctrl 2',
      action: () => onSelectTab && onSelectTab('documents')
    },
    {
      id: 'cmd-hcm',
      g: 'Không Gian Văn Hóa',
      n: 'Không gian Văn hóa Hồ Chí Minh',
      description: 'Bảo tàng tư liệu 3D, sự kiện & tác phẩm',
      icon: Landmark,
      gradient: 'linear-gradient(140deg,#FF7A45,#D6731E)',
      k: isMac ? '⌘H' : 'Ctrl H',
      action: () => onOpenHcmSpaceModal && onOpenHcmSpaceModal()
    },
    {
      id: 'cmd-opinion',
      g: 'Dịch Vụ Dân Nguyện',
      n: 'Lắng nghe Nhân dân & Phản ánh',
      description: 'Gửi ý kiến, đề xuất, kiến nghị dân sinh',
      icon: MessageSquareHeart,
      gradient: 'linear-gradient(140deg,#D93A55,#B82840)',
      k: isMac ? '⌘O' : 'Ctrl O',
      action: () => onSelectTab && onSelectTab('opinion')
    },
    {
      id: 'cmd-map',
      g: 'Dịch Vụ Dân Nguyện',
      n: 'Bản đồ số Cộng đồng 21 Khu phố',
      description: 'Địa điểm an sinh, tổ dân phố, hạ tầng',
      icon: MapPin,
      gradient: 'linear-gradient(140deg,#2F8FE0,#1A6FB3)',
      action: () => onSelectTab && onSelectTab('map')
    },
    {
      id: 'cmd-volunteer',
      g: 'Dịch Vụ Dân Nguyện',
      n: 'Đăng ký Tình nguyện viên Cộng đồng',
      description: 'Tham gia các phong trào vì xã hội',
      icon: UserCheck,
      gradient: 'linear-gradient(140deg,#119C72,#0B6E50)',
      action: () => onOpenVolunteerModal && onOpenVolunteerModal()
    },
    {
      id: 'cmd-surveys',
      g: 'Dịch Vụ Dân Nguyện',
      n: 'Khảo sát ý kiến Nhân dân',
      description: 'Đánh giá sự hài lòng & ý kiến quy hoạch',
      icon: BarChart3,
      gradient: 'linear-gradient(140deg,#8B6CFF,#5B8CFF)',
      action: () => onSelectTab && onSelectTab('surveys')
    },
    {
      id: 'cmd-office',
      g: 'Hệ Thống Nội Bộ',
      n: 'Văn phòng số (Cán bộ Quản trị)',
      description: 'Bàn làm việc số, phân việc & chỉ đạo',
      icon: Monitor,
      gradient: 'linear-gradient(140deg,#0052cc,#003399)',
      k: isMac ? '⌘W' : 'Ctrl W',
      action: () => onGoToOffice && onGoToOffice('dashboard')
    }
  ];

  // Filter commands by text query
  const q = query.trim().toLowerCase();
  const filteredData = COMMAND_DATA.filter((d) => {
    if (!q) return true;
    return (
      d.n.toLowerCase().includes(q) ||
      d.g.toLowerCase().includes(q) ||
      (d.description && d.description.toLowerCase().includes(q))
    );
  });

  // Keep active index in bounds
  useEffect(() => {
    setActIndex(0);
  }, [query]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        const activeElem = document.activeElement;
        // If focus is inside input or container, toggle, else toggle unless typing in external text area
        if (
          activeElem &&
          activeElem.tagName !== 'INPUT' &&
          activeElem.tagName !== 'TEXTAREA' &&
          !(activeElem as HTMLElement).isContentEditable
        ) {
          e.preventDefault();
          toggleClosed();
        } else if (containerRef.current?.contains(activeElem)) {
          e.preventDefault();
          toggleClosed();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isClosed]);

  // Click outside listener to fold palette
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        !isClosed
      ) {
        setIsClosed(true);
        if (inputRef.current) inputRef.current.blur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isClosed]);

  const toggleClosed = () => {
    if (isClosed) {
      setIsClosed(false);
      setRunMessage(null);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    } else {
      setIsClosed(true);
      setQuery('');
      if (inputRef.current) inputRef.current.blur();
    }
  };

  const handleRun = (item: CommandItem) => {
    setRunMessage(`Đã thực hiện: "${item.n}"`);
    item.action();

    if (doneTimerRef.current) clearTimeout(doneTimerRef.current);
    doneTimerRef.current = setTimeout(() => {
      setIsClosed(true);
      setQuery('');
      setRunMessage(null);
    }, 450);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (isClosed) {
        setIsClosed(false);
      } else if (filteredData.length > 0) {
        setActIndex((prev) => (prev + 1) % filteredData.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isClosed) {
        setIsClosed(false);
      } else if (filteredData.length > 0) {
        setActIndex((prev) => (prev - 1 + filteredData.length) % filteredData.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isClosed) {
        setIsClosed(false);
      } else if (filteredData[actIndex]) {
        handleRun(filteredData[actIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      setIsClosed(true);
      setQuery('');
      if (inputRef.current) inputRef.current.blur();
    }
  };

  // Highlight matching letters with <mark>
  const renderHighlightedText = (text: string, searchQ: string) => {
    if (!searchQ) return text;
    const idx = text.toLowerCase().indexOf(searchQ);
    if (idx < 0) return text;

    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + searchQ.length);
    const after = text.slice(idx + searchQ.length);

    return (
      <>
        {before}
        <mark className="bg-transparent text-[#0068ff] font-black underline decoration-[#0068ff]/40 decoration-2">
          {match}
        </mark>
        {after}
      </>
    );
  };

  // Calculate highlight position
  const activeTop = actIndex * 52 + 10;

  return (
    <div
      ref={containerRef}
      className={`ux u046-wrapper relative max-w-sm w-full font-sans text-slate-900 ${
        isClosed ? 'is-closed' : 'is-open'
      } ${className}`}
      style={{
        ['--ux-surface' as any]: '#ffffff',
        ['--ux-surface-2' as any]: '#f8fafc',
        ['--ux-ink' as any]: '#0f172a',
        ['--ux-ink-2' as any]: '#334155',
        ['--ux-ink-3' as any]: '#64748b',
        ['--ux-line' as any]: 'rgba(226, 232, 240, 0.9)',
        ['--ux-line-2' as any]: 'rgba(203, 213, 225, 0.8)',
        ['--ux-accent' as any]: '#0068ff',
        ['--ux-accent-soft' as any]: 'rgba(0, 104, 255, 0.10)',
        ['--ux-mint' as any]: '#059669',
        ['--ux-shadow-strong' as any]: 'rgba(0, 50, 150, 0.22)',
        ['--ux-ease' as any]: 'cubic-bezier(.2, .8, .2, 1)',
        ['--ux-spring' as any]: 'cubic-bezier(.34, 1.45, .64, 1)'
      }}
    >
      <style>{`
        .u046-wrapper {
          position: relative;
          height: 40px;
          z-index: 30;
        }
        .u046-wrapper.is-open {
          z-index: 100;
        }
        .u046-pal {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          border-radius: 20px;
          background: #ffffff;
          box-shadow: 0 0 0 1px rgba(0, 104, 255, 0.3), 0 28px 56px -12px rgba(0, 30, 100, 0.45);
          clip-path: inset(0 0 0 0 round 20px);
          transition: clip-path 0.55s var(--ux-ease), box-shadow 0.4s ease, height 0.55s var(--ux-ease);
          height: 410px;
          z-index: 100;
        }
        .u046-wrapper.is-closed .u046-pal {
          height: 40px;
          clip-path: inset(0 0 0 0 round 20px);
          box-shadow: 0 0 0 1px rgba(226, 232, 240, 0.9), 0 4px 12px -4px rgba(0, 40, 120, 0.12);
        }
        .u046-field {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          height: 40px;
          flex: none;
          padding: 0 10px 0 14px;
          border-bottom: 1px solid var(--ux-line);
          cursor: pointer;
          transition: border-color 0.3s;
        }
        .u046-wrapper.is-closed .u046-field {
          border-color: transparent;
        }
        .u046-in {
          flex: 1;
          min-width: 0;
          height: 100%;
          border: 0;
          padding: 0;
          background: transparent;
          font-size: 12.5px;
          font-weight: 600;
          color: #0f172a;
          outline: none;
        }
        .u046-in::placeholder {
          color: #64748b;
        }
        .u046-kbd {
          display: inline-flex;
          align-items: center;
          height: 22px;
          padding: 0 6px;
          border-radius: 6px;
          background: #f1f5f9;
          box-shadow: inset 0 -1px 0 rgba(203, 213, 225, 0.8);
          font-size: 10.5px;
          font-weight: 700;
          color: #475569;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          white-space: nowrap;
        }
        .u046-body {
          position: relative;
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          scrollbar-width: none;
          overscroll-behavior: contain;
          padding: 6px 8px;
          transition: opacity 0.3s;
        }
        .u046-body::-webkit-scrollbar {
          display: none;
        }
        .u046-wrapper.is-closed .u046-body,
        .u046-wrapper.is-closed .u046-foot {
          opacity: 0;
          pointer-events: none;
        }
        .u046-hl {
          position: absolute;
          left: 8px;
          right: 8px;
          top: 0;
          height: 48px;
          border-radius: 14px;
          background: rgba(0, 104, 255, 0.08);
          box-shadow: inset 3px 0 0 #0068ff;
          transform: translateY(var(--y, 0px));
          transition: transform 0.35s var(--ux-spring), opacity 0.2s;
          pointer-events: none;
        }
        .u046-list {
          position: relative;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .u046-g {
          padding: 10px 10px 4px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #0068ff;
        }
        .u046-op {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 48px;
          padding: 0 10px;
          border-radius: 12px;
          font-size: 12.5px;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: color 0.15s;
        }
        .u046-op[aria-selected="true"] {
          color: #0f172a;
        }
        .u046-ic {
          width: 28px;
          height: 28px;
          flex: none;
          border-radius: 8px;
          display: grid;
          place-items: center;
          background: var(--c, #0068ff);
          color: #ffffff;
          box-shadow: 0 2px 6px -1px rgba(0, 0, 0, 0.15);
        }
        .u046-ic svg {
          width: 14px;
          height: 14px;
        }
        .u046-foot {
          display: flex;
          align-items: center;
          gap: 12px;
          height: 38px;
          flex: none;
          padding: 0 14px;
          border-top: 1px solid rgba(226, 232, 240, 0.8);
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          background: #f8fafc;
          border-bottom-left-radius: 20px;
          border-bottom-right-radius: 20px;
          transition: opacity 0.3s;
        }
        .u046-foot .u046-kbd {
          height: 18px;
          padding: 0 4px;
          margin-right: 3px;
          font-size: 10px;
        }
        .u046-done {
          margin-left: auto;
          color: #059669;
          font-weight: 700;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.3s, transform 0.4s var(--ux-spring);
        }
        .u046-done.show {
          opacity: 1;
          transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .u046-pal, .u046-hl, .u046-done {
            transition-duration: 0.001ms !important;
            animation-duration: 0.001ms !important;
          }
        }
      `}</style>

      <div className="u046-pal">
        {/* Input Field / Trigger Pill Header */}
        <div
          className="u046-field"
          onClick={() => {
            if (isClosed) toggleClosed();
          }}
        >
          <Search className="w-4 h-4 text-[#0068ff] shrink-0" />
          <input
            ref={inputRef}
            className="u046-in"
            type="text"
            role="combobox"
            aria-expanded={!isClosed}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (isClosed) setIsClosed(false);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder={isClosed ? "Tìm kiếm nhanh toàn hệ thống..." : "Nhập câu lệnh hoặc tên dịch vụ..."}
            aria-label="Tìm kiếm nhanh toàn hệ thống"
          />
          <kbd className="u046-kbd u046-key">
            {isClosed ? (isMac ? '⌘K' : 'Ctrl K') : 'esc'}
          </kbd>
        </div>

        {/* Scrollable Results Body */}
        <div ref={bodyRef} className="u046-body">
          {filteredData.length > 0 && (
            <span
              className="u046-hl"
              aria-hidden="true"
              style={{
                opacity: filteredData.length > 0 ? 1 : 0,
                transform: `translateY(${activeTop}px)`
              }}
            />
          )}

          <ul className="u046-list" role="listbox" aria-label="Commands">
            {filteredData.length === 0 ? (
              <li className="p-8 text-center text-xs text-slate-500 font-medium">
                <b className="block font-bold text-sm text-slate-800 mb-1">
                  Không tìm thấy kết quả cho "{query}"
                </b>
                Thử tìm kiếm với từ khóa khác (ví dụ: Tin tức, Thủ tục, Dân nguyện)
              </li>
            ) : (
              (() => {
                let currentGroup = '';
                let itemIndex = -1;

                return filteredData.map((item) => {
                  itemIndex++;
                  const isSelected = itemIndex === actIndex;
                  const showGroup = item.g !== currentGroup;
                  if (showGroup) currentGroup = item.g;

                  const IconComp = item.icon || FileText;
                  const currentIndex = itemIndex;

                  return (
                    <React.Fragment key={item.id}>
                      {showGroup && (
                        <li className="u046-g" role="presentation">
                          {item.g}
                        </li>
                      )}
                      <li
                        className="u046-op"
                        role="option"
                        id={`${uid}-${currentIndex}`}
                        data-n={item.n}
                        aria-selected={isSelected}
                        onPointerMove={() => {
                          if (actIndex !== currentIndex) setActIndex(currentIndex);
                        }}
                        onClick={() => handleRun(item)}
                      >
                        <span
                          className="u046-ic"
                          style={{ ['--c' as any]: item.gradient || '#0068ff' }}
                          aria-hidden="true"
                        >
                          <IconComp className="w-3.5 h-3.5 text-white" />
                        </span>
                        <div className="flex-1 min-w-0 leading-tight">
                          <div className="font-bold text-slate-900 truncate">
                            {renderHighlightedText(item.n, q)}
                          </div>
                          {item.description && (
                            <div className="text-[10.5px] text-slate-500 truncate mt-0.5">
                              {item.description}
                            </div>
                          )}
                        </div>
                        {item.k && <kbd className="u046-kbd">{item.k}</kbd>}
                      </li>
                    </React.Fragment>
                  );
                });
              })()
            )}
          </ul>
        </div>

        {/* Footer Actions & Run Notice */}
        <div className="u046-foot" aria-hidden="true">
          <span>
            <kbd className="u046-kbd">↑↓</kbd>Di chuyển
          </span>
          <span>
            <kbd className="u046-kbd">↵</kbd>Thực hiện
          </span>
          <span className={`u046-done ${runMessage ? 'show' : ''}`}>
            {runMessage}
          </span>
        </div>
      </div>
    </div>
  );
};
