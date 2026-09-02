import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Scissors, 
  Maximize2, 
  ShieldCheck, 
  Smile, 
  ListOrdered, 
  Table, 
  HelpCircle, 
  Lightbulb, 
  Check, 
  Copy, 
  FileDown, 
  Printer, 
  History, 
  RotateCcw,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { aiWorkspaceService } from '../../../lib/aiWorkspaceService';

interface AiContextualEditorProps {
  title: string;
  onTitleChange?: (newTitle: string) => void;
  content: string;
  onContentChange: (newContent: string) => void;
  status?: string;
  version?: number;
  onOpenHistory?: () => void;
  onExportWord?: () => void;
  onPrint?: () => void;
  readOnly?: boolean;
}

export const AiContextualEditor: React.FC<AiContextualEditorProps> = ({
  title,
  onTitleChange,
  content,
  onContentChange,
  status = 'draft',
  version = 1,
  onOpenHistory,
  onExportWord,
  onPrint,
  readOnly = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>(new Date().toLocaleTimeString('vi-VN'));

  // Word count and reading time calculation
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 180));

  // Handle selection detection on textarea
  const handleSelect = () => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;

    if (start !== end && end - start > 3) {
      const text = content.substring(start, end);
      setSelectedText(text);
      setSelectionRange({ start, end });

      // Calculate approximate position for the floating toolbar
      const textarea = textareaRef.current;
      const rect = textarea.getBoundingClientRect();
      // Position near top center of selection area or top of textarea
      setPopupPos({
        top: Math.max(20, 40),
        left: Math.min(rect.width - 250, Math.max(20, rect.width / 2 - 120))
      });
    } else {
      setSelectedText('');
      setSelectionRange(null);
      setPopupPos(null);
    }
  };

  const executeContextAction = async (action: string, actionLabel: string) => {
    if (!selectedText || !selectionRange) return;
    setIsProcessingAction(true);
    setActionMessage(`Đang ${actionLabel}...`);

    try {
      const res = await aiWorkspaceService.callAiTool('context-action', {
        selectedText,
        action,
        documentContext: content
      });

      if (res && res.resultText) {
        // Replace selection in content
        const before = content.substring(0, selectionRange.start);
        const after = content.substring(selectionRange.end);
        const newContent = before + res.resultText + after;
        
        onContentChange(newContent);
        setSelectedText('');
        setSelectionRange(null);
        setPopupPos(null);
        setActionMessage(`Đã hoàn tất: ${actionLabel}`);
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err: any) {
      setActionMessage(`Lỗi: ${err.message || 'Không thể xử lý'}`);
      setTimeout(() => setActionMessage(null), 4000);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Update last saved indicator periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setLastSavedTime(new Date().toLocaleTimeString('vi-VN'));
    }, 15000);
    return () => clearInterval(timer);
  }, [content]);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Editor Top Toolbar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange && onTitleChange(e.target.value)}
            disabled={readOnly}
            placeholder="Tiêu đề văn bản..."
            className="text-base font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:bg-white px-2 py-1 rounded-sm outline-hidden w-full transition-all"
          />
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            V{version}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            {status === 'completed' ? 'Đã hoàn tất' : status === 'refining' ? 'Đang tinh chỉnh' : 'Dự thảo'}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-1.5 text-xs text-slate-600">
          <span className="text-slate-400 hidden sm:inline mr-2">
            Đã lưu: {lastSavedTime}
          </span>

          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              title="Lịch sử phiên bản"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Lịch sử</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
          </button>

          {onExportWord && (
            <button
              onClick={onExportWord}
              title="Xuất tệp Word (.doc)"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 text-blue-700 font-medium transition-colors cursor-pointer shadow-2xs"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Xuất Word</span>
            </button>
          )}

          {onPrint && (
            <button
              onClick={onPrint}
              title="In văn bản"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">In</span>
            </button>
          )}
        </div>
      </div>

      {/* Action status message notification bar */}
      {actionMessage && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-200 text-xs text-blue-800 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            {isProcessingAction ? <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> : <Sparkles className="w-4 h-4 text-blue-600" />}
            <span className="font-medium">{actionMessage}</span>
          </div>
        </div>
      )}

      {/* Editor Body with Floating Contextual Toolbar */}
      <div className="relative flex-1 p-4 bg-slate-50/50 flex flex-col min-h-[420px]">
        {/* Floating Contextual AI Menu when text is selected */}
        {popupPos && selectedText && !isProcessingAction && (
          <div 
            className="absolute z-30 bg-slate-950 text-white rounded-xl shadow-2xl p-2 border border-blue-800/80 flex flex-wrap items-center gap-1.5 max-w-xl animate-fadeIn shadow-blue-500/10"
            style={{ top: `${popupPos.top}px`, left: `${popupPos.left}px` }}
          >
            <div className="flex items-center gap-1 px-2 text-xs font-semibold text-cyan-300 border-r border-slate-800 mr-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI</span>
            </div>

            <button
              onClick={() => executeContextAction('rewrite', 'viết lại mượt hơn')}
              className="px-2 py-1 text-xs bg-slate-800 hover:bg-blue-600 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Wand2 className="w-3 h-3" /> Viết lại
            </button>

            <button
              onClick={() => executeContextAction('formalize', 'trang trọng hóa')}
              className="px-2 py-1 text-xs bg-slate-800 hover:bg-blue-600 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3" /> Trang trọng
            </button>

            <button
              onClick={() => executeContextAction('shorten', 'rút gọn')}
              className="px-2 py-1 text-xs bg-slate-800 hover:bg-blue-600 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Scissors className="w-3 h-3" /> Rút gọn
            </button>

            <button
              onClick={() => executeContextAction('expand', 'mở rộng ý')}
              className="px-2 py-1 text-xs bg-slate-800 hover:bg-blue-600 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Maximize2 className="w-3 h-3" /> Mở rộng
            </button>

            <button
              onClick={() => executeContextAction('check_spelling', 'sửa chính tả')}
              className="px-2 py-1 text-xs bg-slate-800 hover:bg-blue-600 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3 h-3" /> Chính tả
            </button>

            <button
              onClick={() => executeContextAction('bulletize', 'chuyển thành bullet')}
              className="px-2 py-1 text-xs bg-slate-800 hover:bg-blue-600 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ListOrdered className="w-3 h-3" /> Bullet
            </button>

            <button
              onClick={() => executeContextAction('tabularize', 'chuyển thành bảng')}
              className="px-2 py-1 text-xs bg-slate-800 hover:bg-blue-600 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Table className="w-3 h-3" /> Bảng
            </button>

            <button
              onClick={() => executeContextAction('explain', 'giải thích thuật ngữ')}
              className="px-2 py-1 text-xs bg-slate-800 hover:bg-blue-600 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3 h-3" /> Giải thích
            </button>
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          onSelect={handleSelect}
          onMouseUp={handleSelect}
          onKeyUp={handleSelect}
          disabled={readOnly}
          placeholder="Nội dung văn bản sẽ xuất hiện tại đây. Bạn có thể tự do gõ, chỉnh sửa hoặc bôi đen văn bản để gọi menu ✨ AI..."
          className="w-full flex-1 p-4 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm leading-relaxed font-sans focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all shadow-inner"
        />
      </div>

      {/* Editor Footer Status Bar */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-4">
          <span><strong>{wordCount}</strong> từ</span>
          <span><strong>{content.length}</strong> ký tự</span>
          <span>Ước tính đọc: <strong>~{readingTime}</strong> phút</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Mẹo: Bôi đen một đoạn văn bản để sử dụng công cụ AI nhanh</span>
        </div>
      </div>
    </div>
  );
};
