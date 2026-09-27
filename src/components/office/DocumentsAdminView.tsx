import React, { useState, useMemo } from 'react';
import { 
  OfficialDocument, 
  DocType
} from '../../types';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload, 
  HardDrive, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Calendar, 
  X, 
  Loader2, 
  ChevronRight, 
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { exportDocumentsToCsv } from '../../lib/exportUtils';
import { getGoogleDriveDirectDownloadUrl } from '../../lib/googleDriveService';
import { callGeminiPrompt } from '../../lib/geminiClient';
import { SmartMediaDriveUploader } from './SmartMediaDriveUploader';

const DOC_TYPES: DocType[] = [
  'Luật',
  'Bộ luật',
  'Pháp lệnh',
  'Nghị quyết',
  'Nghị định',
  'Quyết định',
  'Chỉ thị',
  'Thông tư',
  'Thông tư liên tịch',
  'Quy định',
  'Quy chế',
  'Điều lệ',
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

export const getDocTypeBadgeStyle = (type: string) => {
  switch (type) {
    case 'Luật':
    case 'Bộ luật':
    case 'Pháp lệnh':
      return 'bg-rose-50 text-rose-800 border-rose-200 font-black';
    case 'Nghị định':
    case 'Thông tư':
    case 'Thông tư liên tịch':
      return 'bg-amber-50 text-amber-900 border-amber-200 font-bold';
    case 'Nghị quyết':
      return 'bg-purple-50 text-purple-800 border-purple-200 font-bold';
    case 'Quyết định':
    case 'Chỉ thị':
      return 'bg-indigo-50 text-indigo-800 border-indigo-200 font-bold';
    case 'Kế hoạch':
    case 'Chương trình':
      return 'bg-blue-50 text-blue-800 border-blue-200 font-bold';
    case 'Hướng dẫn':
    case 'Quy định':
    case 'Quy chế':
    case 'Điều lệ':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold';
    case 'Công văn':
    case 'Thông báo':
    case 'Tờ trình':
      return 'bg-sky-50 text-sky-800 border-sky-200 font-bold';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200 font-bold';
  }
};

const FIELDS = [
  'MTTQ',
  'Tổ chức - Tuyên giáo',
  'Dân chủ - Pháp luật',
  'Phong trào - Thi đua',
  'An sinh xã hội',
  'Dân tộc - Tôn giáo',
  'Xây dựng chính quyền'
];

interface DocumentsAdminViewProps {
  documents: OfficialDocument[];
  onAddDocument: (doc: OfficialDocument) => void;
  onUpdateDocument: (doc: OfficialDocument) => void;
  onDeleteDocument: (id: string) => void;
  onRequestDocApproval?: (doc: any) => void;
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const DocumentsAdminView: React.FC<DocumentsAdminViewProps> = ({
  documents,
  onAddDocument,
  onUpdateDocument,
  onDeleteDocument,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'PUBLIC' | 'PRIVATE'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterField, setFilterField] = useState<string>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<OfficialDocument | null>(null);
  const [previewDoc, setPreviewDoc] = useState<OfficialDocument | null>(null);
  const [docToDelete, setDocToDelete] = useState<OfficialDocument | null>(null);
  
  const [aiAnalyzingDoc, setAiAnalyzingDoc] = useState<OfficialDocument | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Form Fields
  const [codeNumber, setCodeNumber] = useState('');
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<DocType>('Kế hoạch');
  const [field, setField] = useState('MTTQ');
  const [issuer, setIssuer] = useState('Ủy ban MTTQ Việt Nam phường Chánh Hiệp');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().substring(0, 10));
  const [signer, setSigner] = useState('Trần Thị Hoa');
  const [signerPosition, setSignerPosition] = useState('Chủ tịch Ủy ban MTTQ');
  const [summary, setSummary] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // Attachments
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [isExtractingAi, setIsExtractingAi] = useState(false);

  const stats = useMemo(() => {
    const total = documents.length;
    const publicDocs = documents.filter(d => d.isPublic ?? true).length;
    const privateDocs = documents.filter(d => !(d.isPublic ?? true)).length;

    return { total, publicDocs, privateDocs };
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      if (activeTab === 'PUBLIC' && !(doc.isPublic ?? true)) return false;
      if (activeTab === 'PRIVATE' && (doc.isPublic ?? true)) return false;

      if (filterType !== 'ALL' && doc.docType !== filterType) return false;
      if (filterField !== 'ALL' && doc.field !== filterField) return false;

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchCode = doc.codeNumber?.toLowerCase().includes(query);
        const matchTitle = doc.title?.toLowerCase().includes(query);
        const matchSigner = doc.signer?.toLowerCase().includes(query);
        const matchIssuer = doc.issuer?.toLowerCase().includes(query);
        const matchSummary = doc.summary?.toLowerCase().includes(query);

        if (!matchCode && !matchTitle && !matchSigner && !matchIssuer && !matchSummary) {
          return false;
        }
      }

      return true;
    });
  }, [documents, activeTab, filterType, filterField, searchTerm]);

  const notify = (msg: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    onShowToast?.(msg, type);
  };

  const resetForm = () => {
    setEditingDoc(null);
    setCodeNumber('');
    setTitle('');
    setDocType('Kế hoạch');
    setField('MTTQ');
    setIssuer('Ủy ban MTTQ Việt Nam phường Chánh Hiệp');
    setIssueDate(new Date().toISOString().substring(0, 10));
    setSigner('Trần Thị Hoa');
    setSignerPosition('Chủ tịch Ủy ban MTTQ');
    setSummary('');
    setIsPublic(true);
    setFileName('');
    setFileSize('');
    setFileUrl('');
    setDriveUrl('');
    setIsExtractingAi(false);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (doc: OfficialDocument) => {
    setEditingDoc(doc);
    setCodeNumber(doc.codeNumber);
    setTitle(doc.title);
    setDocType(doc.docType);
    setField(doc.field || 'MTTQ');
    setIssuer(doc.issuer || 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp');
    setIssueDate(doc.issueDate || new Date().toISOString().substring(0, 10));
    setSigner(doc.signer || 'Trần Thị Hoa');
    setSignerPosition(doc.signerPosition || 'Chủ tịch Ủy ban MTTQ');
    setSummary(doc.summary || '');
    setIsPublic(doc.isPublic ?? true);
    setFileName(doc.fileName || '');
    setFileSize(doc.fileSize || '');
    setFileUrl(doc.fileUrl || '');
    setDriveUrl(doc.driveUrl || '');
    setIsModalOpen(true);
  };

  const extractMetaFromDocFile = async (name: string) => {
    setIsExtractingAi(true);
    try {
      const prompt = `Phân tích tên tệp văn bản sau: "${name}".
Hãy trích xuất thông tin dưới dạng JSON chuẩn:
{
  "codeNumber": "Số ký hiệu văn bản (ví dụ: 18/KH-MTTQ-BTT, 207/QĐ-MTTW-BTT...)",
  "docType": "Một trong các loại: Quyết định, Hướng dẫn, Kế hoạch, Chương trình, Công văn, Thông báo, Báo cáo, Tờ trình, Nghị quyết, Tài liệu tuyên truyền",
  "title": "Tên trích yếu nội dung văn bản hoàn chỉnh, trang trọng",
  "field": "Lĩnh vực phù hợp nhất: MTTQ, Tổ chức - Tuyên giáo, Dân chủ - Pháp luật, Phong trào - Thi đua, An sinh xã hội, Dân tộc - Tôn giáo",
  "summary": "Tóm tắt ngắn gọn 1-2 câu về mục đích văn bản"
}`;
      const response = await callGeminiPrompt(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.codeNumber) setCodeNumber(parsed.codeNumber);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.docType && DOC_TYPES.includes(parsed.docType)) setDocType(parsed.docType);
        if (parsed.field && FIELDS.includes(parsed.field)) setField(parsed.field);
        if (parsed.summary) setSummary(parsed.summary);
        notify('🤖 AI Gemini đã bóc tách thông tin văn bản thành công!', 'success');
      }
    } catch (err) {
      console.warn('AI extraction fallback:', err);
    } finally {
      setIsExtractingAi(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !codeNumber.trim()) {
      notify('Vui lòng nhập đầy đủ Số/Ký hiệu và Trích yếu văn bản!', 'warning');
      return;
    }

    const docPayload: OfficialDocument = {
      id: editingDoc ? editingDoc.id : `doc-${Date.now()}`,
      codeNumber: codeNumber.trim(),
      title: title.trim(),
      docType,
      field,
      issuer: issuer.trim() || 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
      issueDate,
      signer: signer.trim() || 'Trần Thị Hoa',
      signerPosition: signerPosition.trim() || 'Chủ tịch Ủy ban MTTQ',
      summary: summary.trim(),
      isPublic,
      fileName,
      fileSize,
      fileUrl,
      driveUrl: driveUrl || fileUrl,
      direction: 'OUTGOING',
      urgency: 'NORMAL',
      status: 'ISSUED'
    };

    if (editingDoc) {
      onUpdateDocument(docPayload);
      notify(`Đã lưu cập nhật văn bản số ${codeNumber}!`, 'success');
    } else {
      onAddDocument(docPayload);
      notify(`Đã đăng tải thành công văn bản số ${codeNumber}!`, 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (docToDelete) {
      onDeleteDocument(docToDelete.id);
      notify(`Đã xóa văn bản "${docToDelete.title}" khỏi hệ thống!`, 'success');
      setDocToDelete(null);
    }
  };

  const handleAnalyzeWithAi = async (doc: OfficialDocument) => {
    setAiAnalyzingDoc(doc);
    setIsAiLoading(true);
    setAiAnalysisResult(null);

    try {
      const prompt = `Bạn là Trợ lý Pháp lý & Quản lý Văn thư cao cấp của Ủy ban Mặt trận Tổ quốc Việt Nam phường Chánh Hiệp.
Hãy phân tích và tóm tắt văn bản hành chính sau:
- Số ký hiệu: ${doc.codeNumber}
- Trích yếu: ${doc.title}
- Loại văn bản: ${doc.docType}
- Cơ quan ban hành: ${doc.issuer}
- Ngày ban hành: ${doc.issueDate}
- Người ký: ${doc.signer} (${doc.signerPosition})
- Lĩnh vực: ${doc.field}
- Tóm tắt: ${doc.summary || 'Chưa có'}

Hãy trả về kết quả phân tích theo cấu trúc Markdown:
### 1. 📌 Tóm Tắt Trọng Tâm Nội Dung
### 2. 🎯 Nhiệm Vụ & Trách Nhiệm Thực Hiện (Khuyến nghị cho phường Chánh Hiệp)
### 3. 📝 Gợi Ý Triển Khai Cho Tổ Tuyên Truyền`;

      const res = await callGeminiPrompt(prompt);
      setAiAnalysisResult(res);
    } catch (err: any) {
      setAiAnalysisResult(`Không thể hoàn thành phân tích AI: ${err?.message || 'Lỗi mạng'}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. HEADER & WORKSPACE BANNER */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-blue-800/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-[10px] rounded-full shadow-xs inline-flex items-center gap-1 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Công cụ đăng tải Văn bản Công khai
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <FileText className="w-8 h-8 text-amber-400" />
              <span>CỔNG ĐĂNG TẢI &amp; QUẢN LÝ VĂN BẢN</span>
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-3xl leading-relaxed">
              Tải lên các văn bản chỉ đạo, nghị quyết, hướng dẫn nghiệp vụ và tài liệu tuyên truyền của Ủy ban MTTQ Việt Nam phường Chánh Hiệp lên website để nhân dân &amp; cán bộ tra cứu trực tuyến.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Đăng tải văn bản mới</span>
            </button>

            <button
              onClick={() => exportDocumentsToCsv(filteredDocuments, 'ALL')}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Xuất Sổ Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & ADVANCED FILTER TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo Số ký hiệu, trích yếu, người ký, cơ quan ban hành..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Simplified Public/Private Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'ALL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tất cả ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab('PUBLIC')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'PUBLIC'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Công khai trên Web ({stats.publicDocs})
            </button>
            <button
              onClick={() => setActiveTab('PRIVATE')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'PRIVATE'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Nháp / Ẩn ({stats.privateDocs})
            </button>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold shrink-0">Loại văn bản:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-700 outline-hidden"
            >
              <option value="ALL">Tất cả thể loại</option>
              {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold shrink-0">Lĩnh vực:</span>
            <select
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-700 outline-hidden"
            >
              <option value="ALL">Tất cả lĩnh vực</option>
              {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* 3. DOCUMENTS DATA TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-800 uppercase font-black text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">STT</th>
                <th className="px-4 py-3.5">Số / Ký hiệu</th>
                <th className="px-5 py-3.5">Trích yếu nội dung văn bản công khai</th>
                <th className="px-4 py-3.5">Thể loại &amp; Lĩnh vực</th>
                <th className="px-4 py-3.5">Ngày ban hành &amp; Người ký</th>
                <th className="px-4 py-3.5 text-center">Trạng thái Web</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-400 text-xs">
                    <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="font-bold text-slate-700 text-sm">Không tìm thấy văn bản phù hợp tiêu chí lọc.</p>
                    <p className="text-slate-400 text-xs mt-1">Bấm "Tất cả" hoặc thử đổi từ khóa để xem toàn bộ.</p>
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc, idx) => (
                  <tr key={doc.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-4 py-3.5 text-center font-bold text-slate-400">
                      {idx + 1}
                    </td>

                    {/* Code Number */}
                    <td className="px-4 py-3.5 shrink-0">
                      <span className="font-black text-blue-800 font-mono text-xs block">
                        {doc.codeNumber}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="px-5 py-3.5 max-w-md">
                      <div className="space-y-1.5">
                        <p 
                          onClick={() => setPreviewDoc(doc)}
                          className="font-bold text-slate-900 leading-snug hover:text-blue-600 transition-colors cursor-pointer line-clamp-2"
                        >
                          {doc.title}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                          {doc.fileName && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                              <FileText className="w-3 h-3 text-blue-600" />
                              {doc.fileName} ({doc.fileSize || 'PDF'})
                            </span>
                          )}
                          {doc.driveUrl && (
                            <a
                              href={doc.driveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 hover:bg-emerald-100"
                            >
                              <HardDrive className="w-3 h-3 text-emerald-600" />
                              Xem tệp đính kèm
                            </a>
                          )}
                          {doc.summary && (
                            <p className="text-[11px] text-slate-500 font-normal line-clamp-1">
                              {doc.summary}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Type & Field */}
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] border block w-fit ${getDocTypeBadgeStyle(doc.docType)}`}>
                        {doc.docType}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium mt-1 block">
                        Lĩnh vực: {doc.field || 'MTTQ'}
                      </span>
                    </td>

                    {/* Signer */}
                    <td className="px-4 py-3.5 text-slate-600 text-[11px]">
                      <p className="font-bold text-slate-900">{doc.signer || 'Trần Thị Hoa'}</p>
                      <p className="text-slate-500 text-[10px]">{doc.signerPosition || 'Chủ tịch MTTQ'}</p>
                      <p className="text-slate-400 text-[10px] mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Ban hành: {doc.issueDate}
                      </p>
                    </td>

                    {/* Public status */}
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => {
                          const updated = { ...doc, isPublic: !(doc.isPublic ?? true) };
                          onUpdateDocument(updated);
                          notify(updated.isPublic ? 'Đã hiển thị văn bản công khai trên website!' : 'Đã ẩn văn bản khỏi website!', 'info');
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border transition-all cursor-pointer ${
                          doc.isPublic ?? true
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
                        }`}
                        title="Bấm để Thay đổi trạng thái hiển thị công khai"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {(doc.isPublic ?? true) ? 'CÔNG KHAI' : 'ẨN / NHÁP'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right relative z-20">
                      <div className="flex items-center justify-end gap-1.5 relative z-30">
                        <button
                          onClick={() => handleAnalyzeWithAi(doc)}
                          className="p-2 bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-700 rounded-xl transition-all cursor-pointer"
                          title="Trợ lý AI phân tích nhanh"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(doc)}
                          className="p-2 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-xl transition-all cursor-pointer"
                          title="Sửa văn bản"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDocToDelete(doc)}
                          className="p-2 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 rounded-xl transition-all cursor-pointer"
                          title="Xóa văn bản"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. CREATE / EDIT DOCUMENT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white w-full max-w-4xl rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 text-slate-900 max-h-[94vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-sm">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900">
                      {editingDoc ? `Chỉnh sửa văn bản: ${editingDoc.codeNumber}` : 'Đăng tải văn bản mới'}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Nhập các trường thông tin chuẩn để xuất bản công khai văn bản lên cổng thông tin
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-5 pr-1">
                {/* File Uploader */}
                <div className="space-y-2">
                  <SmartMediaDriveUploader
                    label="Tải tệp văn bản (.pdf, .doc, .docx) & đồng bộ lên Google Drive"
                    currentValue={fileUrl || driveUrl}
                    currentName={fileName}
                    currentSize={fileSize}
                    modeType="document"
                    defaultFolderCode="van-ban-mttq"
                    onMediaSelected={(res) => {
                      setFileUrl(res.url);
                      if (res.isDrive) setDriveUrl(res.url);
                      if (res.name) {
                        setFileName(res.name);
                        if (!title) setTitle(res.name.replace(/\.[^/.]+$/, ''));
                        extractMetaFromDocFile(res.name);
                      }
                      if (res.size) setFileSize(res.size);
                    }}
                    onClear={() => {
                      setFileUrl('');
                      setDriveUrl('');
                      setFileName('');
                      setFileSize('');
                    }}
                  />

                  {isExtractingAi && (
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-300 flex items-center gap-2 text-xs font-bold text-emerald-900">
                      <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                      <span>Trợ lý AI Gemini đang phân tích tên tệp để tự điền thông số...</span>
                    </div>
                  )}
                </div>

                {/* Core Metadata Fields */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Số / Ký hiệu văn bản: *</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: 207/QĐ-MTTW-BTT, 18/KH-MTTQ..."
                      value={codeNumber}
                      onChange={(e) => setCodeNumber(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600 font-mono font-bold"
                    />
                  </div>

                  <div className="md:col-span-4 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Loại văn bản: *</label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value as DocType)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                    >
                      {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="md:col-span-4 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Lĩnh vực chuyên môn: *</label>
                    <select
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600 font-semibold"
                    >
                      {FIELDS.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-12 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Trích yếu tên văn bản: *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Trích yếu nội dung chính của quyết định, kế hoạch, nghị quyết..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                    />
                  </div>

                  <div className="md:col-span-6 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Cơ quan ban hành:</label>
                    <input
                      type="text"
                      value={issuer}
                      onChange={(e) => setIssuer(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="md:col-span-6 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Ngày ban hành:</label>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600 font-semibold"
                    />
                  </div>

                  <div className="md:col-span-6 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Người ký:</label>
                    <input
                      type="text"
                      value={signer}
                      onChange={(e) => setSigner(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="md:col-span-6 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Chức vụ người ký:</label>
                    <input
                      type="text"
                      value={signerPosition}
                      onChange={(e) => setSignerPosition(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Tóm tắt ngắn gọn:</label>
                    <textarea
                      rows={2}
                      placeholder="Ghi chú tóm tắt nội dung chính hoặc ý kiến chỉ đạo (không bắt buộc)..."
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 block">Công khai ngay lên Cổng thông tin Mặt trận</span>
                      <span className="text-[11px] text-slate-500 font-medium">Bật để người dân tra cứu và tự tải tài liệu về máy</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                    />
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    {editingDoc ? 'Lưu cập nhật' : 'Hoàn tất &amp; Đăng tải'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. PREVIEW & QUICK VIEW MODAL */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white w-full max-w-3xl rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 text-slate-900 max-h-[92vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-900 font-mono font-black text-xs rounded-lg">
                    Số: {previewDoc.codeNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${previewDoc.isPublic ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                    {previewDoc.isPublic ? 'CÔNG KHAI' : 'BẢN ẨN'}
                  </span>
                </div>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {previewDoc.title}
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Thể loại</span>
                    <span className="font-black text-slate-800">{previewDoc.docType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Cơ quan ban hành</span>
                    <span className="font-bold text-slate-800">{previewDoc.issuer}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Người ký</span>
                    <span className="font-bold text-slate-800">{previewDoc.signer}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Ngày ban hành</span>
                    <span className="font-bold text-slate-800">{previewDoc.issueDate}</span>
                  </div>
                </div>

                {previewDoc.summary && (
                  <div className="space-y-1.5 p-4 bg-blue-50/60 rounded-2xl border border-blue-200">
                    <h4 className="font-black text-blue-950 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-blue-600" /> Nội dung ghi chú / Tóm tắt:
                    </h4>
                    <p className="text-slate-700 leading-relaxed font-normal">{previewDoc.summary}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200 flex-wrap">
                  <button
                    onClick={() => {
                      setPreviewDoc(null);
                      handleAnalyzeWithAi(previewDoc);
                    }}
                    className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Trợ lý AI Tóm tắt
                  </button>

                  <div className="flex items-center gap-2">
                    {previewDoc.driveUrl && (
                      <a
                        href={previewDoc.driveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                      >
                        <HardDrive className="w-3.5 h-3.5" />
                        Mở tệp đính kèm
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI ANALYSIS RESULT MODAL */}
      <AnimatePresence>
        {aiAnalyzingDoc && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white w-full max-w-3xl rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 text-slate-900 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="font-black text-base text-slate-900">
                    Phân tích AI Văn bản: {aiAnalyzingDoc.codeNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setAiAnalyzingDoc(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs leading-relaxed">
                {isAiLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-3">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="font-bold text-slate-600">Trợ lý AI Gemini đang phân tích nội dung văn bản hành chính...</p>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 prose max-w-none text-slate-800">
                    <div className="whitespace-pre-wrap font-medium">{aiAnalysisResult}</div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-slate-200 shrink-0">
                <button
                  onClick={() => setAiAnalyzingDoc(null)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Đóng lại
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {docToDelete && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-slate-950"
            >
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                ⚠️ Xác nhận xóa văn bản?
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Bạn đang thực hiện xóa văn bản số <strong className="text-rose-600">{docToDelete.codeNumber}</strong>: "{docToDelete.title}". Hành động này không thể hoàn tác.
              </p>

              <div className="flex items-center justify-end gap-2.5 mt-5">
                <button
                  onClick={() => setDocToDelete(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleDelete}
                  className="px-5 py-2 bg-rose-600 text-white font-black text-xs rounded-xl shadow-md cursor-pointer hover:bg-rose-500"
                >
                  Xác nhận Xóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
