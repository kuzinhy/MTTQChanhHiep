import React, { useState, useMemo } from 'react';
import { OfficialDocument, DocType } from '../types';
import { sortDocumentsNewestFirst } from '../lib/dateUtils';
import { getGoogleDriveDirectDownloadUrl } from '../lib/googleDriveService';
import { 
  FileText, 
  Search, 
  Download, 
  Calendar, 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  Filter, 
  Eye, 
  Tag, 
  Layers, 
  Sparkles,
  Flame,
  Clock,
  HardDrive
} from 'lucide-react';

interface DocumentsSectionProps {
  documents: OfficialDocument[];
  onSelectDocument: (doc: OfficialDocument) => void;
  isLoading?: boolean;
}

export const DocumentCardMobileSkeleton: React.FC = () => {
  return (
    <div className="p-4 space-y-3 animate-pulse border-b border-slate-100">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 bg-slate-200 rounded" />
        <div className="h-4 w-16 bg-slate-200 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-slate-300 rounded" />
        <div className="h-3 w-5/6 bg-slate-200 rounded" />
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="h-3 w-20 bg-slate-200 rounded" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-slate-200 rounded-lg" />
          <div className="h-6 w-16 bg-slate-300 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const DocumentRowSkeleton: React.FC = () => {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      <td className="p-4">
        <div className="h-4 w-24 bg-slate-200 rounded" />
      </td>
      <td className="p-4 space-y-2">
        <div className="h-4 w-full bg-slate-300 rounded" />
        <div className="h-3 w-3/4 bg-slate-200 rounded" />
      </td>
      <td className="p-4 space-y-1">
        <div className="h-4 w-20 bg-slate-200 rounded" />
        <div className="h-3 w-28 bg-slate-200 rounded" />
      </td>
      <td className="p-4">
        <div className="h-4 w-20 bg-slate-200 rounded" />
      </td>
      <td className="p-4 space-y-1">
        <div className="h-4 w-28 bg-slate-200 rounded" />
        <div className="h-3 w-20 bg-slate-200 rounded" />
      </td>
      <td className="p-4 text-right">
        <div className="inline-flex gap-2">
          <div className="h-7 w-20 bg-slate-200 rounded-xl" />
          <div className="h-7 w-16 bg-slate-300 rounded-xl" />
        </div>
      </td>
    </tr>
  );
};

const FIELDS = [
  'ALL',
  'Tổ chức - Tuyên giáo',
  'Dân chủ - Pháp luật',
  'Phong trào - Thi đua',
  'An sinh xã hội',
  'Dân tộc - Tôn giáo',
  'Xây dựng chính quyền'
];

const getDocTypeBadgeStyle = (type: string) => {
  switch (type) {
    case 'Luật':
    case 'Bộ luật':
    case 'Pháp lệnh':
      return 'bg-red-100 text-red-800 border-red-300 font-black';
    case 'Nghị định':
    case 'Thông tư':
    case 'Thông tư liên tịch':
      return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
    case 'Nghị quyết':
      return 'bg-purple-100 text-purple-800 border-purple-300 font-bold';
    case 'Quyết định':
    case 'Chỉ thị':
      return 'bg-indigo-100 text-indigo-800 border-indigo-300 font-bold';
    case 'Kế hoạch':
    case 'Chương trình':
      return 'bg-blue-100 text-blue-800 border-blue-300 font-bold';
    case 'Hướng dẫn':
    case 'Quy định':
    case 'Quy chế':
    case 'Điều lệ':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
    case 'Công văn':
    case 'Thông báo':
    case 'Tờ trình':
      return 'bg-sky-100 text-sky-800 border-sky-300 font-bold';
    case 'Báo cáo':
    case 'Kết luận':
    case 'Biên bản':
      return 'bg-teal-100 text-teal-800 border-teal-300 font-bold';
    case 'Chính sách':
    case 'Tài liệu tuyên truyền':
      return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300 font-bold';
  }
};

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({ 
  documents, 
  onSelectDocument,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedField, setSelectedField] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');

  const docTypes: string[] = [
    'ALL',
    // Văn bản Quy phạm pháp luật & Trung ương
    'Luật',
    'Bộ luật',
    'Pháp lệnh',
    'Nghị quyết',
    'Nghị định',
    'Quyết định',
    'Chỉ thị',
    'Thông tư',
    'Thông tư liên tịch',
    'Điều lệ',
    // Văn bản Hành chính, Chỉ đạo & Điều hành
    'Quy định',
    'Quy chế',
    'Hướng dẫn',
    'Kế hoạch',
    'Chương trình',
    'Công văn',
    'Thông báo',
    'Báo cáo',
    'Tờ trình',
    'Kết luận',
    'Biên bản',
    'Chính sách',
    'Tài liệu tuyên truyền'
  ];

  const sortedAllDocs = useMemo(() => sortDocumentsNewestFirst(documents), [documents]);

  const years = useMemo(() => {
    const set = new Set<string>();
    documents.forEach(d => {
      if (d.issueDate && d.issueDate.length >= 4) {
        set.add(d.issueDate.substring(0, 4));
      }
    });
    return ['ALL', ...Array.from(set).sort().reverse()];
  }, [documents]);

  const filteredDocs = useMemo(() => {
    return sortedAllDocs.filter(doc => {
      const isPublic = doc.isPublic ?? true;
      if (!isPublic) return false;

      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q || 
        doc.title.toLowerCase().includes(q) ||
        doc.codeNumber.toLowerCase().includes(q) ||
        doc.signer.toLowerCase().includes(q) ||
        (doc.issuer && doc.issuer.toLowerCase().includes(q)) ||
        (doc.summary && doc.summary.toLowerCase().includes(q)) ||
        (doc.tags && doc.tags.some(t => t.toLowerCase().includes(q)));

      const matchesType = selectedType === 'ALL' || doc.docType === selectedType;
      const matchesField = selectedField === 'ALL' || doc.field === selectedField;
      const matchesYear = selectedYear === 'ALL' || (doc.issueDate && doc.issueDate.startsWith(selectedYear));

      return matchesSearch && matchesType && matchesField && matchesYear;
    });
  }, [sortedAllDocs, searchTerm, selectedType, selectedField, selectedYear]);

  const handleDownload = (doc: OfficialDocument) => {
    const targetUrl = doc.driveUrl || doc.fileUrl;
    if (targetUrl) {
      const directUrl = getGoogleDriveDirectDownloadUrl(targetUrl);
      window.open(directUrl || targetUrl, '_blank');
    }
  };

  return (
    <section className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl text-slate-900 shadow-sm border border-blue-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-md font-black">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                KHO VĂN BẢN &amp; CHÍNH SÁCH MẶT TRẬN
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Cổng tra cứu công khai văn bản chỉ đạo, nghị quyết, kế hoạch công tác và tài liệu chính sách an sinh xã hội
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Công khai: {filteredDocs.length} văn bản
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search box */}
          <div className="relative lg:col-span-1">
            <input
              type="text"
              placeholder="Nhập số ký hiệu, trích yếu, người ký..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-blue-600" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Doc Type Dropdown */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-semibold cursor-pointer"
            >
              <option value="ALL">Tất cả loại văn bản</option>
              <optgroup label="🏛️ Văn bản Quy phạm pháp luật & Trung ương">
                <option value="Luật">Luật (Quốc hội)</option>
                <option value="Bộ luật">Bộ luật</option>
                <option value="Pháp lệnh">Pháp lệnh (UBTVQH)</option>
                <option value="Nghị định">Nghị định (Chính phủ)</option>
                <option value="Nghị quyết">Nghị quyết</option>
                <option value="Quyết định">Quyết định</option>
                <option value="Chỉ thị">Chỉ thị</option>
                <option value="Thông tư">Thông tư (Bộ / Ngành)</option>
                <option value="Thông tư liên tịch">Thông tư liên tịch</option>
                <option value="Điều lệ">Điều lệ</option>
              </optgroup>
              <optgroup label="📋 Văn bản Chỉ đạo & Nghiệp vụ">
                <option value="Quy định">Quy định</option>
                <option value="Quy chế">Quy chế</option>
                <option value="Hướng dẫn">Hướng dẫn</option>
                <option value="Kế hoạch">Kế hoạch</option>
                <option value="Chương trình">Chương trình</option>
                <option value="Công văn">Công văn</option>
                <option value="Thông báo">Thông báo</option>
                <option value="Kết luận">Kết luận</option>
                <option value="Tờ trình">Tờ trình</option>
                <option value="Báo cáo">Báo cáo</option>
                <option value="Biên bản">Biên bản</option>
                <option value="Chính sách">Chính sách</option>
                <option value="Tài liệu tuyên truyền">Tài liệu tuyên truyền</option>
              </optgroup>
            </select>
          </div>

          {/* Field Dropdown */}
          <div>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
            >
              {FIELDS.map(f => (
                <option key={f} value={f}>
                  {f === 'ALL' ? 'Tất cả lĩnh vực' : f}
                </option>
              ))}
            </select>
          </div>

          {/* Year Dropdown */}
          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
            >
              {years.map(y => (
                <option key={y} value={y}>
                  {y === 'ALL' ? 'Tất cả năm ban hành' : `Năm ${y}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Documents List: Mobile Cards + Desktop Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Mobile Cards View (< md) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <DocumentCardMobileSkeleton key={`doc-mobile-skel-${idx}`} />
            ))
          ) : filteredDocs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-slate-700">Không tìm thấy văn bản phù hợp.</p>
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <div key={doc.id} className="p-4 space-y-2.5 hover:bg-blue-50/40 transition-colors">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-900 font-mono font-black text-xs rounded-lg border border-blue-200">
                    {doc.codeNumber}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 font-bold rounded-lg text-[10px] border ${getDocTypeBadgeStyle(doc.docType)}`}>
                      {doc.docType}
                    </span>
                    {doc.isDigitalSigned && (
                      <span className="px-2 py-0.5 bg-teal-50 text-teal-700 font-bold rounded-lg text-[10px] border border-teal-200">
                        Ký số
                      </span>
                    )}
                  </div>
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
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs border border-blue-200 cursor-pointer"
                    >
                      Xem chi tiết
                    </button>
                    {(doc.fileUrl || doc.driveUrl) && (
                      <button
                        onClick={() => handleDownload(doc)}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs inline-flex items-center gap-1 cursor-pointer shadow-2xs"
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
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-black text-slate-700 tracking-wider">
                <th className="p-4">Số Ký Hiệu</th>
                <th className="p-4">Trích Yếu Nội Dung</th>
                <th className="p-4">Loại &amp; Lĩnh Vực</th>
                <th className="p-4">Ngày Ban Hành</th>
                <th className="p-4">Cơ Quan / Người Ký</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <DocumentRowSkeleton key={`doc-row-skel-${idx}`} />
                ))
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700 text-sm">Không tìm thấy văn bản phù hợp.</p>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 font-black text-blue-800 whitespace-nowrap font-mono">
                      {doc.codeNumber}
                      {doc.isDigitalSigned && (
                        <span className="block text-[10px] text-teal-600 font-bold mt-0.5 flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" /> Đã ký số
                        </span>
                      )}
                    </td>
                    <td className="p-4 max-w-md">
                      <p 
                        className="line-clamp-2 hover:text-blue-600 cursor-pointer font-bold text-slate-900 leading-snug" 
                        onClick={() => onSelectDocument(doc)}
                      >
                        {doc.title}
                      </p>
                      {doc.summary && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 font-normal">
                          {doc.summary}
                        </p>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 font-bold rounded-lg text-[10px] border block w-fit ${getDocTypeBadgeStyle(doc.docType)}`}>
                        {doc.docType}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        {doc.field || 'Tổ chức - Tuyên giáo'}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>{doc.issueDate}</span>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap text-slate-600">
                      <p className="font-bold text-slate-900">{doc.issuer}</p>
                      <p className="text-[11px] text-slate-500">{doc.signer} ({doc.signerPosition || 'Chủ tịch'})</p>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => onSelectDocument(doc)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs cursor-pointer border border-blue-200 transition-colors"
                      >
                        Xem chi tiết
                      </button>
                      {(doc.fileUrl || doc.driveUrl) && (
                        <button
                          onClick={() => handleDownload(doc)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
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
