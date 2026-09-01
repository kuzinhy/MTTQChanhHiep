import React, { useState, useMemo } from 'react';
import { OfficialDocument, DocType } from '../types';
import { sortDocumentsNewestFirst } from '../lib/dateUtils';
import { FileText, Search, Download, Calendar, Building2, UserCheck, ShieldCheck, Filter, FileSpreadsheet } from 'lucide-react';

interface DocumentsSectionProps {
  documents: OfficialDocument[];
  onSelectDocument: (doc: OfficialDocument) => void;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents, onSelectDocument }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedField, setSelectedField] = useState<string>('ALL');

  const docTypes: string[] = [
    'ALL',
    'Nghị quyết',
    'Kế hoạch',
    'Công văn',
    'Thông báo',
    'Hướng dẫn',
    'Quyết định',
    'Chương trình',
    'Báo cáo'
  ];

  const sortedAllDocs = useMemo(() => sortDocumentsNewestFirst(documents), [documents]);

  const filteredDocs = useMemo(() => {
    return sortedAllDocs.filter(doc => {
      const matchesSearch = !searchTerm || 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.codeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.signer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'ALL' || doc.docType === selectedType;
      return matchesSearch && matchesType && doc.isPublic;
    });
  }, [sortedAllDocs, searchTerm, selectedType]);

  const handleDownload = (doc: OfficialDocument) => {
    const targetUrl = doc.fileUrl || doc.driveUrl;
    if (targetUrl) {
      window.open(targetUrl, '_blank');
    }
  };

  return (
    <section className="space-y-6">
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl text-slate-900 shadow-2xs border border-blue-200/80">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-2xs font-black">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">KHO VĂN BẢN &amp; CHÍNH SÁCH MẶT TRẬN - AN SINH XÃ HỘI</h2>
            <p className="text-xs text-slate-500 font-medium">Tra cứu công khai văn bản chỉ đạo, kế hoạch công tác, văn bản an sinh xã hội &amp; chính sách pháp luật</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập số ký hiệu, trích yếu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-blue-600" />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-500"
          >
            {docTypes.map(t => (
              <option key={t} value={t}>
                {t === 'ALL' ? 'Tất cả loại văn bản' : t}
              </option>
            ))}
          </select>

          <div className="text-xs text-blue-600 flex items-center justify-end px-2 font-bold">
            Hiển thị {filteredDocs.length} / {documents.length} văn bản
          </div>
        </div>
      </div>

      {/* Documents List: Mobile Cards + Desktop Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Mobile Cards View (< md) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredDocs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Không tìm thấy văn bản phù hợp.
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <div key={doc.id} className="p-4 space-y-2.5 hover:bg-blue-50/40 transition-colors">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-mono font-black text-xs rounded-lg border border-blue-200">
                    {doc.codeNumber}
                  </span>
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded-lg text-[10px] border border-slate-200">
                    {doc.docType}
                  </span>
                </div>

                <h4 
                  onClick={() => onSelectDocument(doc)}
                  className="font-black text-slate-900 text-sm leading-snug cursor-pointer hover:text-blue-600 transition-colors"
                >
                  {doc.title}
                </h4>

                {doc.summary && (
                  <p className="text-xs text-slate-500 line-clamp-2 font-normal">
                    {doc.summary}
                  </p>
                )}

                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 font-medium pt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{doc.issueDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectDocument(doc)}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg text-xs border border-blue-200 cursor-pointer"
                    >
                      Xem chi tiết
                    </button>
                    {(doc.fileUrl || doc.driveUrl) && (
                      <button
                        onClick={() => handleDownload(doc)}
                        className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded-lg text-xs inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Tải về
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View (md+) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-700 tracking-wider">
                <th className="p-3.5">Số Ký Hiệu</th>
                <th className="p-3.5">Trích Yếu Nội Dung</th>
                <th className="p-3.5">Loại Văn Bản</th>
                <th className="p-3.5">Ngày Ban Hành</th>
                <th className="p-3.5">Cơ Quan / Người Ký</th>
                <th className="p-3.5 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Không tìm thấy văn bản phù hợp.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-3.5 font-bold text-blue-700 whitespace-nowrap">
                      {doc.codeNumber}
                    </td>
                    <td className="p-3.5 font-medium max-w-md">
                      <p className="line-clamp-2 hover:text-blue-600 cursor-pointer font-bold" onClick={() => onSelectDocument(doc)}>
                        {doc.title}
                      </p>
                      {doc.summary && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {doc.summary}
                        </p>
                      )}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg text-[11px]">
                        {doc.docType}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap text-slate-600">
                      {doc.issueDate}
                    </td>
                    <td className="p-3.5 whitespace-nowrap text-slate-600">
                      <p className="font-semibold text-slate-800">{doc.issuer}</p>
                      <p className="text-[11px] text-slate-500">{doc.signer}</p>
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => onSelectDocument(doc)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-[11px] cursor-pointer border border-blue-200"
                      >
                        Xem chi tiết
                      </button>
                      {(doc.fileUrl || doc.driveUrl) && (
                        <button
                          onClick={() => handleDownload(doc)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-[11px] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          Tải về
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
