import React, { useState } from 'react';
import { TemplateDoc } from '../../types';
import { FileCheck, Search, Copy, Download, Sparkles, Check, Filter, ExternalLink, FileText, DownloadCloud } from 'lucide-react';

interface DocumentTemplatesViewProps {
  templates: TemplateDoc[];
  onOpenAiPlanner?: () => void;
}

export const DocumentTemplatesView: React.FC<DocumentTemplatesViewProps> = ({
  templates,
  onOpenAiPlanner
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDoc | null>(null);

  const filteredTemplates = templates.filter(t => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== 'ALL' && t.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleCopyContent = (t: TemplateDoc) => {
    navigator.clipboard.writeText(t.content);
    setCopiedId(t.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadDoc = (t: TemplateDoc) => {
    const blob = new Blob(['\uFEFF' + t.content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanTitle = t.title.replace(/[^a-zA-Z0-9_\u00C0-\u1EF9]/g, '_').substring(0, 40);
    link.download = `Mau_${cleanTitle}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-blue-800 font-extrabold text-xs uppercase tracking-wider">
            <FileCheck className="w-4 h-4 text-blue-600" />
            <span>KHO MẪU VĂN BẢN CHUẨN MẶT TRẬN</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1">Sổ Tay Mẫu Văn Bản, Tờ Trình &amp; Biên Bản</h1>
          <p className="text-xs text-slate-500 mt-0.5">Biểu mẫu chuẩn thể thức hành chính công tác Mặt trận Phường Chánh Hiệp và 21 Ban Công tác Mặt trận Khu phố</p>
        </div>

        {onOpenAiPlanner && (
          <button
            onClick={onOpenAiPlanner}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-xs font-black rounded-xl shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Soạn theo Mẫu bằng AI</span>
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm kiếm mẫu Kế hoạch, Báo cáo, Tờ trình, Biên bản..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="font-bold text-slate-600 shrink-0">Thể loại:</span>
          {['ALL', 'Kế hoạch', 'Báo cáo', 'Biên bản', 'Tờ trình', 'Quyết định', 'Thông báo'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat === 'ALL' ? `Tất cả (${templates.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 border border-blue-200 text-[10px] font-extrabold rounded-md uppercase">
                  {template.category}
                </span>
                <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>

              <h3 className="font-bold text-sm text-slate-900 line-clamp-2">{template.title}</h3>
              <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                {template.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setPreviewTemplate(template)}
                className="text-xs font-bold text-slate-700 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Xem trước</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleDownloadDoc(template)}
                  title="Tải văn bản mẫu (.txt)"
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleCopyContent(template)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {copiedId === template.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 shrink-0">
              <div>
                <span className="text-[10px] font-black text-blue-800 bg-blue-100 px-2 py-0.5 rounded uppercase">
                  {previewTemplate.category}
                </span>
                <h3 className="font-black text-base text-slate-900 mt-1">{previewTemplate.title}</h3>
                <p className="text-xs text-slate-500">{previewTemplate.description}</p>
              </div>
              <button onClick={() => setPreviewTemplate(null)} className="text-slate-400 font-bold hover:text-slate-700 cursor-pointer p-1">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed select-all">
              {previewTemplate.content}
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200 shrink-0">
              <span className="text-[11px] text-slate-400 font-medium">
                * Thể thức chuẩn hóa theo Nghị định 30/2020/NĐ-CP &amp; QĐ 207/QĐ-MTTW-BTT
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadDoc(previewTemplate)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải tệp mẫu</span>
                </button>
                <button
                  onClick={() => handleCopyContent(previewTemplate)}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>Sao chép Khung mẫu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
