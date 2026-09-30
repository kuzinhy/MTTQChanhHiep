import React from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';

interface AISuggestionChipsProps {
  onSelectChip: (chipText: string) => void;
  chips?: string[];
}

export const AISuggestionChips: React.FC<AISuggestionChipsProps> = ({ 
  onSelectChip,
  chips = [
    'Gửi phản ánh',
    'Tra cứu văn bản',
    'Điểm an sinh',
    'Bản đồ khu phố',
    'Tin mới',
    'Sơ đồ thủ tục'
  ]
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-slate-50 p-2 border-b border-blue-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] font-bold">
      <span className="text-blue-900 shrink-0 font-black flex items-center gap-1 pl-1">
        <Sparkles className="w-3 h-3 text-amber-500" />
        Gợi ý:
      </span>
      {chips.map((chip, idx) => (
        <button
          key={idx}
          onClick={() => onSelectChip(chip)}
          className="px-2.5 py-1 bg-white hover:bg-blue-600 hover:text-white text-slate-700 rounded-xl border border-blue-200/80 transition-all shrink-0 cursor-pointer shadow-2xs font-medium active:scale-95"
        >
          {chip}
        </button>
      ))}
    </div>
  );
};
