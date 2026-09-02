import React, { useState } from 'react';
import { 
  BookTemplate, 
  Plus, 
  FileText, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowRight,
  Bookmark,
  GraduationCap
} from 'lucide-react';
import { AiTemplate } from '../../../types';
import { aiWorkspaceService } from '../../../lib/aiWorkspaceService';

interface AiTemplateManagerProps {
  templates: AiTemplate[];
  onUseTemplate: (template: AiTemplate) => void;
  onRefresh: () => void;
}

export const AiTemplateManager: React.FC<AiTemplateManagerProps> = ({
  templates = [],
  onUseTemplate,
  onRefresh
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Template form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Kế hoạch');
  const [docType, setDocType] = useState('Kế hoạch');
  const [description, setDescription] = useState('');
  const [structure, setStructure] = useState('');
  const [defaultPrompt, setDefaultPrompt] = useState('');

  const categories = ['all', 'Kế hoạch', 'Báo cáo', 'Bài phát biểu', 'Công văn', 'Tờ trình'];

  const safeTemplates = Array.isArray(templates) ? templates : [];

  const filteredTemplates = selectedCategory === 'all' 
    ? safeTemplates 
    : safeTemplates.filter(t => t && (t.category === selectedCategory || t.documentType === selectedCategory));

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !structure.trim()) return;

    const newTpl: AiTemplate = {
      id: `tpl_${Date.now()}`,
      name,
      category,
      documentType: docType,
      description,
      structure,
      defaultPrompt: defaultPrompt || 'Soạn thảo văn bản theo cấu trúc mẫu.',
      isActive: true,
      createdBy: 'Cán bộ MTTQ',
      createdAt: new Date().toISOString()
    };

    aiWorkspaceService.saveTemplate(newTpl);
    setShowAddModal(false);
    setName('');
    setDescription('');
    setStructure('');
    setDefaultPrompt('');
    onRefresh();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
            <BookTemplate className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Thư Viện Mẫu Văn Bản MTTQ</h2>
            <p className="text-xs text-slate-500">
              Tập hợp các mẫu chuẩn Nghị định 30/2020/NĐ-CP & cơ chế "Học từ mẫu" giúp AI viết đúng phong cách cơ quan.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Thêm Mẫu Mới (Dạy AI)</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat === 'all' ? 'Tất cả loại mẫu' : cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-purple-200 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
                  {tpl.documentType || tpl.category}
                </span>
                {tpl.isDefault && (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Mẫu Chuẩn MTTQ
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-800 group-hover:text-purple-700 transition-colors mb-2 line-clamp-1">
                {tpl.name}
              </h3>

              <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                {tpl.description}
              </p>

              {/* Sample Structure Preview */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] font-mono text-slate-600 line-clamp-4 mb-4 whitespace-pre-line">
                {tpl.structure}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleCopy(tpl.id, tpl.structure)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                {copiedId === tpl.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === tpl.id ? 'Đã sao chép' : 'Sao chép'}</span>
              </button>

              <button
                onClick={() => onUseTemplate(tpl)}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Soạn theo mẫu này</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Teach AI Template Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Thêm Mẫu Văn Bản Mới (Dạy AI)</h3>
                <p className="text-xs text-slate-500">Cung cấp bộ khung chuẩn để AI tự động noi theo cấu trúc và văn phong này.</p>
              </div>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 mb-1 block">Tên mẫu biểu *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Kế hoạch giám sát chuyên đề 2026..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-purple-600 focus:bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 mb-1 block">Loại văn bản</label>
                  <select
                    value={docType}
                    onChange={(e) => {
                      setDocType(e.target.value);
                      setCategory(e.target.value);
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-purple-600 focus:bg-white text-xs"
                  >
                    <option value="Kế hoạch">Kế hoạch</option>
                    <option value="Báo cáo">Báo cáo</option>
                    <option value="Bài phát biểu">Bài phát biểu</option>
                    <option value="Công văn">Công văn</option>
                    <option value="Tờ trình">Tờ trình</option>
                    <option value="Thông báo">Thông báo</option>
                    <option value="Hướng dẫn">Hướng dẫn</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Mô tả mục đích sử dụng</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Dùng khi lập kế hoạch kiểm tra, giám sát ban ngành..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-purple-600 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Cấu trúc khung mẫu văn bản (Bố cục I, II, III...) *</label>
                <textarea
                  rows={6}
                  required
                  value={structure}
                  onChange={(e) => setStructure(e.target.value)}
                  placeholder="Dán toàn bộ khung thể thức chuẩn vào đây..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-purple-600 focus:bg-white font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold"
                >
                  Lưu & Áp Dụng Mẫu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
