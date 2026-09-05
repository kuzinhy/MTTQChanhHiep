import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  FileSearch,
  BookTemplate,
  FileText, 
  PenTool, 
  FileCheck2, 
  FileBarChart2, 
  Compass, 
  Mic, 
  CalendarCheck, 
  ShieldAlert, 
  Users, 
  Megaphone, 
  GitCompare, 
  HelpCircle, 
  TableProperties, 
  ListChecks, 
  CheckSquare, 
  AlignLeft,
  X,
  ArrowRight
} from 'lucide-react';
import { AI_TOOLS_CATALOG } from '../../../lib/aiWorkspaceService';
import { AiToolId } from '../../../types';

interface AiCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: AiToolId) => void;
  favorites?: AiToolId[];
  onOpenDossiers?: () => void;
  onOpenTemplates?: () => void;
}

const getToolIcon = (iconName: string) => {
  switch (iconName) {
    case 'FileSearch': return <FileSearch className="w-4 h-4 text-blue-600" />;
    case 'BookTemplate': return <BookTemplate className="w-4 h-4 text-indigo-600" />;
    case 'FileCheck2': return <FileCheck2 className="w-4 h-4 text-emerald-600" />;
    case 'PenTool': return <PenTool className="w-4 h-4 text-blue-600" />;
    case 'FileBarChart2': return <FileBarChart2 className="w-4 h-4 text-purple-600" />;
    case 'Compass': return <Compass className="w-4 h-4 text-rose-600" />;
    case 'AlignLeft': return <AlignLeft className="w-4 h-4 text-amber-600" />;
    case 'CheckSquare': return <CheckSquare className="w-4 h-4 text-indigo-600" />;
    case 'Mic': return <Mic className="w-4 h-4 text-red-600" />;
    case 'CalendarCheck': return <CalendarCheck className="w-4 h-4 text-cyan-600" />;
    case 'FileText': return <FileText className="w-4 h-4 text-slate-600" />;
    case 'ShieldAlert': return <ShieldAlert className="w-4 h-4 text-amber-700" />;
    case 'Users': return <Users className="w-4 h-4 text-blue-700" />;
    case 'Megaphone': return <Megaphone className="w-4 h-4 text-pink-600" />;
    case 'GitCompare': return <GitCompare className="w-4 h-4 text-teal-600" />;
    case 'HelpCircle': return <HelpCircle className="w-4 h-4 text-orange-600" />;
    case 'TableProperties': return <TableProperties className="w-4 h-4 text-emerald-700" />;
    case 'ListChecks': return <ListChecks className="w-4 h-4 text-violet-600" />;
    default: return <Sparkles className="w-4 h-4 text-red-600" />;
  }
};

export const AiCommandPalette: React.FC<AiCommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTool,
  onOpenDossiers,
  onOpenTemplates
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Handle Ctrl+K shortcut globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTools = AI_TOOLS_CATALOG.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4 animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm nhanh công cụ, mẫu biểu, nhiệm vụ (Ctrl+K)..."
            autoFocus
            className="flex-1 bg-transparent text-slate-800 text-sm font-medium outline-hidden placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-1.5 flex-1">
          <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            16 Công cụ Tham mưu Nghiệp vụ
          </div>

          {filteredTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                onSelectTool(tool.id);
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/80 group transition-all text-left border border-transparent hover:border-blue-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-xs transition-colors">
                  {getToolIcon(tool.iconName)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 flex items-center gap-2">
                    <span>{tool.name}</span>
                    {tool.badge && (
                      <span className="text-[10px] font-medium bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-sm">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-1">
                    {tool.shortDesc}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors shrink-0" />
            </button>
          ))}

          {filteredTools.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm">
              Không tìm thấy công cụ phù hợp với từ khóa "{searchTerm}".
            </div>
          )}
        </div>

        {/* Palette Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-mono">ESC</span>
            <span>để đóng</span>
          </div>
          <div className="flex items-center space-x-3">
            {onOpenDossiers && (
              <button
                onClick={() => { onOpenDossiers(); onClose(); }}
                className="text-blue-700 hover:underline font-medium cursor-pointer"
              >
                Hồ sơ công việc
              </button>
            )}
            {onOpenTemplates && (
              <button
                onClick={() => { onOpenTemplates(); onClose(); }}
                className="text-blue-700 hover:underline font-medium cursor-pointer"
              >
                Thư viện mẫu
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
