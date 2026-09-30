import React from 'react';
import { ExternalLink, ShieldCheck, FileText, Globe, HardDrive, BookOpen } from 'lucide-react';
import { AISource } from '../../lib/ai/types';

interface AISourceBadgeProps {
  sources: AISource[];
}

export const AISourceBadge: React.FC<AISourceBadgeProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  const getSourceIcon = (type?: string) => {
    switch (type) {
      case 'GOOGLE_DRIVE':
        return <HardDrive className="w-3 h-3 text-amber-500" />;
      case 'INTERNET':
        return <Globe className="w-3 h-3 text-emerald-500" />;
      case 'KNOWLEDGE_BASE':
        return <BookOpen className="w-3 h-3 text-purple-500" />;
      case 'DOCUMENT':
      case 'WEBSITE':
      default:
        return <FileText className="w-3 h-3 text-blue-500" />;
    }
  };

  return (
    <div className="mt-2.5 pt-2 border-t border-slate-100/90 space-y-1.5">
      <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
        <span>Nguồn tham chiếu:</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {sources.map((src, idx) => (
          <a
            key={idx}
            href={src.url || '#'}
            target={src.url && src.url.startsWith('http') ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg border border-slate-200/80 text-[10.5px] font-medium transition-all group shadow-2xs cursor-pointer"
          >
            {getSourceIcon(src.type)}
            <span className="truncate max-w-[200px]">{src.name}</span>
            {src.official && (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1 py-0.2 rounded-xs">
                <ShieldCheck className="w-2.5 h-2.5" />
                Chính thức
              </span>
            )}
            <ExternalLink className="w-2.5 h-2.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
};
