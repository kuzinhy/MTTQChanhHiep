import React from 'react';
import { 
  ArrowRight, 
  MapPin, 
  FileText, 
  Send, 
  Navigation, 
  ExternalLink, 
  HeartHandshake, 
  Sparkles,
  Download,
  FolderOpen
} from 'lucide-react';
import { AIAction } from '../../lib/ai/types';

interface AIActionCardProps {
  actions: AIAction[];
  onActionClick: (route: string, type?: string) => void;
}

export const AIActionCard: React.FC<AIActionCardProps> = ({ actions, onActionClick }) => {
  if (!actions || actions.length === 0) return null;

  const getActionIcon = (type: string, label: string) => {
    const l = label.toLowerCase();
    if (type === 'OPEN_MAP' || l.includes('bản đồ')) return <MapPin className="w-3.5 h-3.5 text-rose-500" />;
    if (type === 'DIRECTIONS' || l.includes('chỉ đường')) return <Navigation className="w-3.5 h-3.5 text-blue-500" />;
    if (type === 'OPEN_FEEDBACK' || l.includes('phản ánh')) return <Send className="w-3.5 h-3.5 text-amber-500" />;
    if (type === 'OPEN_VOLUNTEER' || l.includes('tình nguyện') || l.includes('an sinh')) return <HeartHandshake className="w-3.5 h-3.5 text-emerald-500" />;
    if (type === 'DOWNLOAD_FILE' || l.includes('tải')) return <Download className="w-3.5 h-3.5 text-indigo-500" />;
    if (l.includes('drive')) return <FolderOpen className="w-3.5 h-3.5 text-amber-600" />;
    return <FileText className="w-3.5 h-3.5 text-blue-600" />;
  };

  return (
    <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-2">
      {actions.map((act, idx) => (
        <button
          key={idx}
          onClick={() => onActionClick(act.route, act.type)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-600 hover:to-indigo-600 text-blue-800 hover:text-white rounded-xl border border-blue-200/90 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer group"
        >
          <span className="group-hover:text-white transition-colors">
            {getActionIcon(act.type, act.label)}
          </span>
          <span>{act.label}</span>
          <ArrowRight className="w-3 h-3 text-blue-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </button>
      ))}
    </div>
  );
};
