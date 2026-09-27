import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, Search, Filter, Download, ExternalLink, 
  Calendar, ChevronRight, File, ArrowRight
} from 'lucide-react';
import { NewDocument } from '../../types';
import { documentService } from '../../services/documentService';

export const DocumentsPublicView: React.FC = () => {
  const [documents, setDocuments] = useState<NewDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await documentService.getDocuments();
      // Only show published documents to public (or those without status which default to public)
      setDocuments(docs.filter(d => d.status === 'Published' || !d.status));
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           doc.codeNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'ALL' || doc.docType === selectedType;
      return matchesSearch && matchesType;
    });
  }, [documents, searchTerm, selectedType]);

  const docTypes = useMemo(() => {
    const types = new Set(documents.map(d => d.docType));
    return ['ALL', ...Array.from(types)];
  }, [documents]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-slate-500 font-medium">Đang tải danh mục văn bản...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-[2rem] p-8 sm:p-12 text-white mb-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <FileText size={14} />
            Công khai & Minh bạch
          </div>
          <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight leading-tight">
            Văn bản Triển khai & <br />Hành chính MTTQ
          </h1>
          <p className="text-blue-100/80 max-w-2xl text-base sm:text-lg font-medium leading-relaxed">
            Tra cứu các nghị quyết, kế hoạch, quyết định và văn bản chỉ đạo điều hành của Ủy ban Mặt trận Tổ quốc Việt Nam phường Chánh Hiệp.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 shrink-0 space-y-6">
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Tìm kiếm nhanh</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Số hiệu, trích yếu..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Loại văn bản</h3>
            <div className="flex flex-col gap-2">
              {docTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    selectedType === type 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100 shadow-sm'
                  }`}
                >
                  <span>{type === 'ALL' ? 'Tất cả văn bản' : type}</span>
                  <ChevronRight size={16} className={selectedType === type ? 'opacity-100' : 'opacity-30'} />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm font-bold text-slate-500">
              Tìm thấy <span className="text-blue-600">{filteredDocs.length}</span> văn bản
            </div>
          </div>

          <div className="grid gap-4">
            {filteredDocs.length > 0 ? filteredDocs.map((doc) => (
              <div 
                key={doc.id} 
                className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <File size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded border border-slate-200">
                        {doc.docType}
                      </span>
                      <span className="text-blue-600 text-sm font-black tracking-tight">
                        {doc.codeNumber}
                      </span>
                    </div>
                    <h2 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors leading-tight mb-3">
                      {doc.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>Ban hành: {doc.issueDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileText size={14} />
                        <span>{doc.fileName || 'Tệp đính kèm'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 sm:items-end">
                    <a 
                      href={doc.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 font-black rounded-xl hover:bg-blue-600 hover:text-white transition-all text-sm whitespace-nowrap"
                    >
                      <span>Xem chi tiết</span>
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                <FileText className="w-16 h-16 mx-auto text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-400">Không tìm thấy kết quả nào</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">Vui lòng thử lại với từ khóa khác</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
