import React, { useState, useMemo } from 'react';
import { 
  OfficialDocument, 
  DocType, 
  DocumentDirection, 
  DocumentUrgency, 
  DocumentStatus,
  StaffUser
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
  Clock, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  Send, 
  ArrowDownLeft, 
  ArrowUpRight, 
  FileCode, 
  Layers, 
  Calendar, 
  UserCheck, 
  Building2, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Loader2, 
  ChevronRight, 
  Flame, 
  FileCheck, 
  Paperclip, 
  Link2, 
  RefreshCw, 
  Share2, 
  Printer, 
  Briefcase, 
  ListOrdered
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { exportDocumentsToCsv } from '../../lib/exportUtils';
import { getGoogleDriveViewUrl, getGoogleDriveDirectDownloadUrl } from '../../lib/googleDriveService';
import { callGeminiPrompt } from '../../lib/geminiClient';
import { ChanhHiepDriveFolderBar } from './ChanhHiepDriveFolderBar';
import { SmartMediaDriveUploader } from './SmartMediaDriveUploader';

const DOC_TYPES: DocType[] = [
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
  'Quy định',
  'Quy chế',
  'Điều lệ',
  // Văn bản Hành chính & Chỉ đạo Điều hành
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

const FIELDS = [
  'Tổ chức - Tuyên giáo',
  'Dân chủ - Pháp luật',
  'Phong trào - Thi đua',
  'An sinh xã hội',
  'Dân tộc - Tôn giáo',
  'Xây dựng chính quyền',
  'Chuyển đổi số - Ứng dụng công nghệ'
];

const DEPARTMENTS = [
  'Ban Thường trực UBMTTQ',
  'Ban Tổ chức - Tuyên giáo',
  'Ban Dân chủ - Pháp luật',
  'Ban Phong trào - Thi đua',
  'Ban Thanh tra nhân dân',
  'Ban Giám sát đầu tư cộng đồng',
  'Tổ nòng cốt Chuyển đổi số'
];

const STAFF_LIST = [
  'Trần Thị Hoa (Chủ tịch)',
  'Nguyễn Văn Hải (Phó Chủ tịch)',
  'Lê Văn Minh (Ủy viên TT)',
  'Phạm Thị Lan (Cán bộ Tuyên giáo)',
  'Đặng Hoàng Long (Cán bộ Phong trào)',
  'Vũ Thị Mai (Kế toán - Thủ quỹ)',
  'Ngô Thanh Tùng (Chuyên viên Số hóa)'
];

interface DocumentsAdminViewProps {
  documents: OfficialDocument[];
  onAddDocument: (doc: OfficialDocument) => void;
  onUpdateDocument: (doc: OfficialDocument) => void;
  onDeleteDocument: (id: string) => void;
  onRequestDocApproval?: (doc: OfficialDocument) => void;
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const DocumentsAdminView: React.FC<DocumentsAdminViewProps> = ({
  documents,
  onAddDocument,
  onUpdateDocument,
  onDeleteDocument,
  onRequestDocApproval,
  onShowToast
}) => {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<'ALL' | 'INCOMING' | 'OUTGOING' | 'INTERNAL' | 'URGENT'>('ALL');
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterField, setFilterField] = useState<string>('ALL');
  const [filterUrgency, setFilterUrgency] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<OfficialDocument | null>(null);
  const [previewDoc, setPreviewDoc] = useState<OfficialDocument | null>(null);
  const [docToDelete, setDocToDelete] = useState<OfficialDocument | null>(null);
  const [signingDoc, setSigningDoc] = useState<OfficialDocument | null>(null);
  const [delegatingDoc, setDelegatingDoc] = useState<OfficialDocument | null>(null);
  const [aiAnalyzingDoc, setAiAnalyzingDoc] = useState<OfficialDocument | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Form Fields
  const [direction, setDirection] = useState<DocumentDirection>('OUTGOING');
  const [codeNumber, setCodeNumber] = useState('');
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<DocType>('Kế hoạch');
  const [field, setField] = useState('Tổ chức - Tuyên giáo');
  const [issuer, setIssuer] = useState('Ủy ban MTTQ Việt Nam phường Chánh Hiệp');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().substring(0, 10));
  const [signer, setSigner] = useState('Trần Thị Hoa');
  const [signerPosition, setSignerPosition] = useState('Chủ tịch Ủy ban MTTQ');
  const [summary, setSummary] = useState('');
  const [urgency, setUrgency] = useState<DocumentUrgency>('NORMAL');
  const [status, setStatus] = useState<DocumentStatus>('ISSUED');
  const [isPublic, setIsPublic] = useState(true);
  
  // Incoming Doc Specific Fields
  const [incomingNumber, setIncomingNumber] = useState('');
  const [incomingDate, setIncomingDate] = useState(new Date().toISOString().substring(0, 10));
  const [assignedDepartment, setAssignedDepartment] = useState('Ban Thường trực UBMTTQ');
  const [assignedStaff, setAssignedStaff] = useState('Trần Thị Hoa (Chủ tịch)');
  const [deadline, setDeadline] = useState('');
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [processingNotes, setProcessingNotes] = useState('');
  const [recipientOrg, setRecipientOrg] = useState('');

  // Attachments & Google Drive
  const [attachMode, setAttachMode] = useState<'file' | 'drive'>('file');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExtractingAi, setIsExtractingAi] = useState(false);

  // KPI Calculations
  const stats = useMemo(() => {
    const total = documents.length;
    const incoming = documents.filter(d => d.direction === 'INCOMING').length;
    const outgoing = documents.filter(d => d.direction === 'OUTGOING' || !d.direction).length;
    const internal = documents.filter(d => d.direction === 'INTERNAL').length;
    const urgent = documents.filter(d => d.urgency === 'URGENT' || d.urgency === 'VERY_URGENT' || d.urgency === 'HOA_TOC').length;
    const pending = documents.filter(d => d.status === 'PROCESSING' || d.status === 'PENDING_APPROVAL').length;
    const completed = documents.filter(d => d.status === 'COMPLETED' || d.status === 'ISSUED').length;
    const publicDocs = documents.filter(d => d.isPublic).length;

    return {
      total,
      incoming,
      outgoing,
      internal,
      urgent,
      pending,
      completed,
      publicDocs
    };
  }, [documents]);

  // Filtered Documents
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      // Tab filter
      if (activeTab === 'INCOMING' && doc.direction !== 'INCOMING') return false;
      if (activeTab === 'OUTGOING' && doc.direction !== 'OUTGOING' && doc.direction !== undefined) return false;
      if (activeTab === 'INTERNAL' && doc.direction !== 'INTERNAL') return false;
      if (activeTab === 'URGENT' && !(doc.urgency === 'URGENT' || doc.urgency === 'VERY_URGENT' || doc.urgency === 'HOA_TOC')) return false;

      // Type filter
      if (filterType !== 'ALL' && doc.docType !== filterType) return false;

      // Field filter
      if (filterField !== 'ALL' && doc.field !== filterField) return false;

      // Urgency filter
      if (filterUrgency !== 'ALL' && (doc.urgency || 'NORMAL') !== filterUrgency) return false;

      // Status filter
      if (filterStatus !== 'ALL' && (doc.status || 'ISSUED') !== filterStatus) return false;

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchCode = doc.codeNumber?.toLowerCase().includes(query);
        const matchTitle = doc.title?.toLowerCase().includes(query);
        const matchSigner = doc.signer?.toLowerCase().includes(query);
        const matchIssuer = doc.issuer?.toLowerCase().includes(query);
        const matchStaff = doc.assignedStaff?.toLowerCase().includes(query);
        const matchIncomingNo = doc.incomingNumber?.toLowerCase().includes(query);
        const matchSummary = doc.summary?.toLowerCase().includes(query);

        if (!matchCode && !matchTitle && !matchSigner && !matchIssuer && !matchStaff && !matchIncomingNo && !matchSummary) {
          return false;
        }
      }

      return true;
    });
  }, [documents, activeTab, filterType, filterField, filterUrgency, filterStatus, searchTerm]);

  const notify = (msg: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    if (onShowToast) {
      onShowToast(msg, type);
    }
  };

  // Reset form
  const resetForm = () => {
    setEditingDoc(null);
    setDirection('OUTGOING');
    setCodeNumber('');
    setTitle('');
    setDocType('Kế hoạch');
    setField('Tổ chức - Tuyên giáo');
    setIssuer('Ủy ban MTTQ Việt Nam phường Chánh Hiệp');
    setIssueDate(new Date().toISOString().substring(0, 10));
    setSigner('Trần Thị Hoa');
    setSignerPosition('Chủ tịch Ủy ban MTTQ');
    setSummary('');
    setUrgency('NORMAL');
    setStatus('ISSUED');
    setIsPublic(true);
    setIncomingNumber('');
    setIncomingDate(new Date().toISOString().substring(0, 10));
    setAssignedDepartment('Ban Thường trực UBMTTQ');
    setAssignedStaff('Trần Thị Hoa (Chủ tịch)');
    setDeadline('');
    setProcessingProgress(0);
    setProcessingNotes('');
    setRecipientOrg('Các ban ngành, đoàn thể & 21 Khu phố');
    setAttachMode('file');
    setFileName('');
    setFileSize('');
    setFileUrl('');
    setDriveUrl('');
    setSelectedFile(null);
    setIsExtractingAi(false);
  };

  // Open Add Modal with specific preset
  const handleOpenAddModal = (presetDirection: DocumentDirection = 'OUTGOING') => {
    resetForm();
    setDirection(presetDirection);
    if (presetDirection === 'INCOMING') {
      setIssuer('Ủy ban nhân dân thành phố Thủ Dầu Một');
      setSigner('Lãnh đạo UBND');
      setSignerPosition('Lãnh đạo');
      setStatus('PROCESSING');
      setIncomingNumber(`Đ-${Math.floor(100 + Math.random() * 900)}/2026`);
      setDeadline(new Date(Date.now() + 15 * 86400000).toISOString().substring(0, 10));
      setProcessingProgress(10);
    } else if (presetDirection === 'INTERNAL') {
      setCodeNumber(`DT-${Math.floor(10 + Math.random() * 90)}/MTTQ`);
      setStatus('PENDING_APPROVAL');
      setIsPublic(false);
      setSigner('Lê Văn Minh');
      setSignerPosition('Ủy viên Thường trực');
    } else {
      setCodeNumber(`${Math.floor(10 + Math.random() * 90)}/KH-MTTQ-BTT`);
      setIssuer('Ủy ban MTTQ Việt Nam phường Chánh Hiệp');
      setStatus('ISSUED');
    }
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (doc: OfficialDocument) => {
    setEditingDoc(doc);
    setDirection(doc.direction || 'OUTGOING');
    setCodeNumber(doc.codeNumber);
    setTitle(doc.title);
    setDocType(doc.docType);
    setField(doc.field || 'Tổ chức - Tuyên giáo');
    setIssuer(doc.issuer || 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp');
    setIssueDate(doc.issueDate || new Date().toISOString().substring(0, 10));
    setSigner(doc.signer || 'Trần Thị Hoa');
    setSignerPosition(doc.signerPosition || 'Chủ tịch Ủy ban MTTQ');
    setSummary(doc.summary || '');
    setUrgency(doc.urgency || 'NORMAL');
    setStatus(doc.status || 'ISSUED');
    setIsPublic(doc.isPublic ?? true);
    setIncomingNumber(doc.incomingNumber || '');
    setIncomingDate(doc.incomingDate || doc.issueDate);
    setAssignedDepartment(doc.assignedDepartment || 'Ban Thường trực UBMTTQ');
    setAssignedStaff(doc.assignedStaff || 'Trần Thị Hoa (Chủ tịch)');
    setDeadline(doc.deadline || '');
    setProcessingProgress(doc.processingProgress ?? (doc.status === 'COMPLETED' ? 100 : 0));
    setProcessingNotes(doc.processingNotes || '');
    setRecipientOrg(doc.recipientOrg || '');
    setFileName(doc.fileName || '');
    setFileSize(doc.fileSize || '');
    setFileUrl(doc.fileUrl || '');
    setDriveUrl(doc.driveUrl || '');
    setAttachMode(doc.driveUrl ? 'drive' : 'file');
    setIsModalOpen(true);
  };

  // AI Extraction from File
  const extractMetaFromDocFile = async (file: File) => {
    setIsExtractingAi(true);
    try {
      const prompt = `Phân tích tên tệp văn bản và định dạng văn thư Việt Nam sau: "${file.name}".
Hãy trích xuất thông tin dưới dạng JSON chuẩn:
{
  "codeNumber": "Số ký hiệu văn bản (ví dụ: 75/2015/QH13, 15/2020/NĐ-CP, 08/2021/TT-BNV, 18/KH-MTTQ-BTT, 42/CV-UBND...)",
  "docType": "Một trong các loại: Luật, Bộ luật, Pháp lệnh, Nghị quyết, Nghị định, Quyết định, Chỉ thị, Thông tư, Thông tư liên tịch, Quy định, Quy chế, Điều lệ, Hướng dẫn, Kế hoạch, Chương trình, Công văn, Thông báo, Báo cáo, Tờ trình, Kết luận, Biên bản",
  "issuer": "Cơ quan ban hành (Ví dụ: Quốc hội, Chính phủ, Thủ tướng Chính phủ, Ủy ban Trung ương MTTQ Việt Nam, Bộ Nội vụ, UBND phường Chánh Hiệp...)",
  "title": "Tên trích yếu nội dung văn bản hoàn chỉnh, trang trọng",
  "field": "Lĩnh vực phù hợp nhất: Tổ chức - Tuyên giáo, Dân chủ - Pháp luật, Phong trào - Thi đua, An sinh xã hội, Dân tộc - Tôn giáo, Xây dựng chính quyền",
  "summary": "Tóm tắt ngắn gọn 2-3 câu về mục đích và nội dung chính của văn bản"
}`;
      const response = await callGeminiPrompt(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.codeNumber && !codeNumber) setCodeNumber(parsed.codeNumber);
        if (parsed.title && !title) setTitle(parsed.title);
        if (parsed.docType && DOC_TYPES.includes(parsed.docType)) setDocType(parsed.docType);
        if (parsed.issuer && !issuer) setIssuer(parsed.issuer);
        if (parsed.field && FIELDS.includes(parsed.field)) setField(parsed.field);
        if (parsed.summary && !summary) setSummary(parsed.summary);
        notify('🤖 AI Gemini đã bóc tách thông tin văn bản tự động thành công!', 'success');
      }
    } catch (err) {
      console.warn('AI extraction fallback:', err);
    } finally {
      setIsExtractingAi(false);
    }
  };

  // Handle File Input
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setFileSize(sizeMb === '0.00' ? `${(file.size / 1024).toFixed(1)} KB` : `${sizeMb} MB`);

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFileUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);

      extractMetaFromDocFile(file);
    }
  };

  // Save Document
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
      signer: signer.trim(),
      signerPosition: signerPosition.trim(),
      summary: summary.trim(),
      direction,
      urgency,
      status,
      isPublic,
      incomingNumber: direction === 'INCOMING' ? incomingNumber.trim() : undefined,
      incomingDate: direction === 'INCOMING' ? incomingDate : undefined,
      assignedDepartment: direction === 'INCOMING' ? assignedDepartment : undefined,
      assignedStaff: assignedStaff.trim() || undefined,
      deadline: deadline || undefined,
      processingProgress,
      processingNotes: processingNotes.trim() || undefined,
      recipientOrg: recipientOrg.trim() || undefined,
      fileName: fileName || (editingDoc ? editingDoc.fileName : undefined),
      fileSize: fileSize || (editingDoc ? editingDoc.fileSize : undefined),
      fileUrl: fileUrl || (editingDoc ? editingDoc.fileUrl : undefined),
      driveUrl: driveUrl.trim() || (editingDoc ? editingDoc.driveUrl : undefined),
      isDigitalSigned: editingDoc ? editingDoc.isDigitalSigned : (direction === 'OUTGOING'),
      signedAt: editingDoc ? editingDoc.signedAt : new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    if (editingDoc) {
      onUpdateDocument(docPayload);
      notify(`Đã cập nhật văn bản "${docPayload.codeNumber}" thành công!`, 'success');
    } else {
      onAddDocument(docPayload);
      notify(`Đã tiếp nhận / ban hành văn bản "${docPayload.codeNumber}" thành công!`, 'success');
    }

    setIsModalOpen(false);
    resetForm();
  };

  // Quick Action: Digital Sign
  const handleConfirmDigitalSign = () => {
    if (!signingDoc) return;
    const updated: OfficialDocument = {
      ...signingDoc,
      isDigitalSigned: true,
      signedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'ISSUED'
    };
    onUpdateDocument(updated);
    notify(`Đã ký số điện tử thành công cho văn bản "${signingDoc.codeNumber}"!`, 'success');
    setSigningDoc(null);
  };

  // Quick Action: Delegate Task
  const handleConfirmDelegation = () => {
    if (!delegatingDoc) return;
    const updated: OfficialDocument = {
      ...delegatingDoc,
      assignedStaff,
      assignedDepartment,
      deadline,
      status: 'PROCESSING',
      processingNotes: processingNotes ? `${delegatingDoc.processingNotes ? delegatingDoc.processingNotes + '\n' : ''}[${new Date().toLocaleDateString('vi-VN')}]: Giao đ/c ${assignedStaff} chủ trì xử lý: ${processingNotes}` : delegatingDoc.processingNotes
    };
    onUpdateDocument(updated);
    notify(`Đã chuyển tiếp và giao việc cho cán bộ ${assignedStaff}!`, 'success');
    setDelegatingDoc(null);
  };

  // AI Deep Analysis
  const handleAnalyzeWithAi = async (doc: OfficialDocument) => {
    setAiAnalyzingDoc(doc);
    setIsAiLoading(true);
    setAiAnalysisResult(null);

    try {
      const prompt = `Bạn là Trợ lý Pháp lý & Quản lý Văn thư cao cấp của Ủy ban Mặt trận Tổ quốc Việt Nam phường Chánh Hiệp.
Hãy đọc và phân tích văn bản hành chính sau đây:
- Số ký hiệu: ${doc.codeNumber}
- Trích yếu: ${doc.title}
- Loại văn bản: ${doc.docType}
- Cơ quan ban hành: ${doc.issuer}
- Ngày ban hành: ${doc.issueDate}
- Người ký: ${doc.signer} (${doc.signerPosition || 'Lãnh đạo'})
- Lĩnh vực: ${doc.field}
- Tóm tắt sơ bộ: ${doc.summary || 'Không có'}
- Ý kiến chỉ đạo/ghi chú: ${doc.processingNotes || 'Không có'}

Hãy trả về kết quả phân tích chuẩn nghiệp vụ Mặt trận theo cấu trúc Markdown:
### 1. 📌 Tóm Tắt Trọng Tâm Nội Dung (Executive Summary)
(Tóm tắt 3-4 ý chính súc tích nhất)

### 2. 🎯 Nhiệm Vụ & Trách Nhiệm Thực Hiện (Key Action Items)
(Danh sách các đầu việc cụ thể MTTQ phường và 21 Ban CTMT khu phố cần làm)

### 3. ⏱️ Thời Hạn & Tiến Độ Khuyến Nghị
(Đề xuất lộ trình và các mốc thời gian kiểm tra)

### 4. 📝 Gợi Ý Dự Thảo Văn Bản Phúc Đáp / Triển Khai Nhanh
(Đoạn mẫu triển khai nhanh cho cán bộ phụ trách)`;

      const res = await callGeminiPrompt(prompt);
      setAiAnalysisResult(res);
    } catch (err: any) {
      setAiAnalysisResult(`Không thể hoàn thành phân tích AI: ${err?.message || 'Lỗi mạng'}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Render Urgency Badge
  const renderUrgencyBadge = (u?: DocumentUrgency) => {
    switch (u) {
      case 'HOA_TOC':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white animate-pulse shadow-xs">
            <Flame className="w-3 h-3" /> HỎA TỐC
          </span>
        );
      case 'VERY_URGENT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
            <AlertTriangle className="w-3 h-3 text-rose-600" /> THƯỢNG KHẨN
          </span>
        );
      case 'URGENT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" /> KHẨN
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            Thường
          </span>
        );
    }
  };

  // Render Status Badge
  const renderStatusBadge = (s?: DocumentStatus) => {
    switch (s) {
      case 'ISSUED':
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ĐÃ BAN HÀNH
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-300">
            <Loader2 className="w-3 h-3 text-blue-600 animate-spin" /> ĐANG THỤ LÝ
          </span>
        );
      case 'PENDING_APPROVAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" /> CHỜ PHÊ DUYỆT
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
            <AlertTriangle className="w-3 h-3 text-rose-600" /> QUÁ HẠN
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            DỰ THẢO
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. TOP HEADER & WORKSPACE BANNER */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-blue-800/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full shadow-xs flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> CHUẨN VĂN THƯ NGHỊ ĐỊNH 30/2020/NĐ-CP
              </span>
              <span className="px-3 py-1 bg-blue-800/80 text-blue-200 font-bold text-xs rounded-full border border-blue-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" /> AI Gemini OCR &amp; Trích Xuất
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <FileText className="w-8 h-8 text-amber-400" />
              <span>QUẢN LÝ VĂN BẢN &amp; ĐIỀU HÀNH CHỈ ĐẠO</span>
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-3xl leading-relaxed">
              Hệ thống điều hành văn thư điện tử Ủy ban MTTQ Việt Nam phường Chánh Hiệp: Phân luồng Sổ Văn bản Đến, Sổ Văn bản Đi, Dự thảo phê duyệt, Ký số chứng thực, Chuyển tiếp nhiệm vụ cán bộ &amp; Liên kết lưu trữ Google Drive.
            </p>
          </div>

          {/* Quick Action Group */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={() => handleOpenAddModal('INCOMING')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <ArrowDownLeft className="w-4 h-4 text-emerald-200" />
              <span>+ Tiếp nhận VB Đến</span>
            </button>

            <button
              onClick={() => handleOpenAddModal('OUTGOING')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <ArrowUpRight className="w-4 h-4 text-amber-300" />
              <span>+ Ban hành VB Đi</span>
            </button>

            <button
              onClick={() => handleOpenAddModal('INTERNAL')}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Edit3 className="w-4 h-4 text-blue-300" />
              <span>+ Dự thảo</span>
            </button>

            <button
              onClick={() => exportDocumentsToCsv(filteredDocuments, activeTab === 'INCOMING' ? 'INCOMING' : activeTab === 'OUTGOING' ? 'OUTGOING' : 'ALL')}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              title="Xuất sổ đăng ký văn bản chuẩn Excel / CSV"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Xuất Sổ Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS & KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div 
          onClick={() => { setActiveTab('ALL'); }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'ALL' 
              ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-300' 
              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-80">Tổng kho văn bản</span>
            <Layers className="w-4 h-4 text-blue-300" />
          </div>
          <p className="text-2xl font-black mt-2">{stats.total}</p>
          <span className="text-[10px] opacity-75 font-medium">Toàn bộ hồ sơ</span>
        </div>

        <div 
          onClick={() => { setActiveTab('INCOMING'); }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'INCOMING' 
              ? 'bg-emerald-700 text-white border-emerald-800 shadow-md ring-2 ring-emerald-300' 
              : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-80">Văn bản Đến</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black mt-2 text-emerald-600 dark:text-white">{stats.incoming}</p>
          <span className="text-[10px] opacity-75 font-medium">Tiếp nhận &amp; Xử lý</span>
        </div>

        <div 
          onClick={() => { setActiveTab('OUTGOING'); }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'OUTGOING' 
              ? 'bg-indigo-700 text-white border-indigo-800 shadow-md ring-2 ring-indigo-300' 
              : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-80">Văn bản Ban hành</span>
            <ArrowUpRight className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black mt-2 text-indigo-600 dark:text-white">{stats.outgoing}</p>
          <span className="text-[10px] opacity-75 font-medium">Đã phát hành</span>
        </div>

        <div 
          onClick={() => { setActiveTab('INTERNAL'); }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'INTERNAL' 
              ? 'bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-300' 
              : 'bg-white text-slate-800 border-slate-200 hover:border-amber-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-80">Dự thảo &amp; Trình duyệt</span>
            <Clock className="w-4 h-4 text-amber-300" />
          </div>
          <p className="text-2xl font-black mt-2 text-amber-600 dark:text-white">{stats.internal}</p>
          <span className="text-[10px] opacity-75 font-medium">Chờ ký duyệt</span>
        </div>

        <div 
          onClick={() => { setActiveTab('URGENT'); }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'URGENT' 
              ? 'bg-rose-700 text-white border-rose-800 shadow-md ring-2 ring-rose-300' 
              : 'bg-white text-slate-800 border-slate-200 hover:border-rose-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-80">Khẩn / Hỏa tốc</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black mt-2 text-rose-600 dark:text-white">{stats.urgent}</p>
          <span className="text-[10px] opacity-75 font-medium">Cần xử lý ngay</span>
        </div>

        <div className="p-4 rounded-2xl bg-white text-slate-800 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Công khai Dân tra cứu</span>
            <Share2 className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black mt-2 text-teal-600">{stats.publicDocs}</p>
          <span className="text-[10px] text-slate-400 font-medium">Trên Cổng thông tin</span>
        </div>
      </div>

      {/* Google Drive Chanh Hiep 7 Folders Direct Storage Navigator */}
      <ChanhHiepDriveFolderBar />

      {/* 3. SEARCH & ADVANCED FILTER TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        {/* Row 1: Search & Quick Tab Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo Số ký hiệu, trích yếu, người ký, nơi gửi, cán bộ thụ lý..."
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

          {/* Quick Tab Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'ALL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tất cả ({documents.length})
            </button>
            <button
              onClick={() => setActiveTab('INCOMING')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'INCOMING'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              VB Đến ({stats.incoming})
            </button>
            <button
              onClick={() => setActiveTab('OUTGOING')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'OUTGOING'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              VB Đi ({stats.outgoing})
            </button>
            <button
              onClick={() => setActiveTab('INTERNAL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'INTERNAL'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Dự thảo ({stats.internal})
            </button>
            <button
              onClick={() => setActiveTab('URGENT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'URGENT'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Hỏa tốc &amp; Khẩn ({stats.urgent})
            </button>
          </div>
        </div>

        {/* Row 2: Secondary Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 outline-hidden"
            >
              <option value="ALL">Tất cả loại văn bản</option>
              {DOC_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 outline-hidden"
            >
              <option value="ALL">Tất cả lĩnh vực</option>
              {FIELDS.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 outline-hidden"
            >
              <option value="ALL">Tất cả mức độ khẩn</option>
              <option value="NORMAL">Thường</option>
              <option value="URGENT">Khẩn</option>
              <option value="VERY_URGENT">Thượng khẩn</option>
              <option value="HOA_TOC">Hỏa tốc</option>
            </select>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 outline-hidden"
            >
              <option value="ALL">Tất cả trạng thái xử lý</option>
              <option value="ISSUED">Đã ban hành</option>
              <option value="PROCESSING">Đang thụ lý</option>
              <option value="PENDING_APPROVAL">Chờ phê duyệt</option>
              <option value="COMPLETED">Đã hoàn thành</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. DOCUMENTS DATA TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-bold">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>
              Danh sách kết quả: <strong className="text-slate-900">{filteredDocuments.length}</strong> văn bản
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Sắp xếp: Ngày mới nhất trước</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-800 uppercase font-black text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">STT</th>
                <th className="px-4 py-3.5">Số / Ký hiệu</th>
                <th className="px-5 py-3.5">Trích yếu nội dung văn bản</th>
                <th className="px-4 py-3.5">Loại &amp; Lĩnh vực</th>
                <th className="px-4 py-3.5">Cơ quan &amp; Người ký</th>
                <th className="px-4 py-3.5">Thụ lý / Hạn xử lý</th>
                <th className="px-4 py-3.5 text-center">Trạng thái</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-slate-400 text-xs">
                    <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="font-bold text-slate-700 text-sm">Không tìm thấy văn bản phù hợp tiêu chí lọc.</p>
                    <p className="text-slate-400 text-xs mt-1">Thử thay đổi từ khóa tìm kiếm hoặc bấm "Tất cả" để xem toàn bộ danh mục.</p>
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc, idx) => (
                  <tr key={doc.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-4 py-3.5 text-center font-bold text-slate-400">
                      {idx + 1}
                    </td>

                    {/* Code & Direction */}
                    <td className="px-4 py-3.5 shrink-0">
                      <div className="space-y-1">
                        <span className="font-black text-blue-800 font-mono text-xs block">
                          {doc.codeNumber}
                        </span>
                        <div className="flex items-center gap-1 flex-wrap">
                          {doc.direction === 'INCOMING' ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-800">
                              ĐẾN {doc.incomingNumber ? `(${doc.incomingNumber})` : ''}
                            </span>
                          ) : doc.direction === 'INTERNAL' ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-800">
                              DỰ THẢO
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-indigo-100 text-indigo-800">
                              BAN HÀNH
                            </span>
                          )}
                          {renderUrgencyBadge(doc.urgency)}
                        </div>
                      </div>
                    </td>

                    {/* Title & Summary */}
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
                              <FileCheck className="w-3 h-3 text-blue-600" />
                              {doc.fileName} ({doc.fileSize || 'PDF'})
                            </span>
                          )}
                          {doc.driveUrl && (
                            <a
                              href={doc.driveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 hover:bg-emerald-100"
                              title="Xem trên Google Drive"
                            >
                              <HardDrive className="w-3 h-3 text-emerald-600" />
                              Drive
                            </a>
                          )}
                          {doc.isDigitalSigned && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200" title="Đã xác thực Ký số điện tử">
                              <ShieldCheck className="w-3 h-3 text-teal-600" />
                              Ký số
                            </span>
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
                        {doc.field || 'Tổ chức - Tuyên giáo'}
                      </span>
                    </td>

                    {/* Issuer & Signer */}
                    <td className="px-4 py-3.5 text-slate-600 text-[11px]">
                      <p className="font-bold text-slate-900">{doc.signer || 'Trần Thị Hoa'}</p>
                      <p className="text-slate-500 text-[10px]">{doc.signerPosition || 'Chủ tịch MTTQ'}</p>
                      <p className="text-slate-400 text-[10px] mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {doc.issueDate}
                      </p>
                    </td>

                    {/* Assignment & Deadline (for Incoming/Internal) */}
                    <td className="px-4 py-3.5 text-[11px]">
                      {doc.assignedStaff ? (
                        <div className="space-y-1">
                          <p className="font-bold text-blue-900 flex items-center gap-1">
                            <UserCheck className="w-3 h-3 text-blue-600" />
                            {doc.assignedStaff}
                          </p>
                          {doc.deadline && (
                            <p className="text-[10px] text-rose-700 font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Hạn: {doc.deadline}
                            </p>
                          )}
                          {doc.processingProgress !== undefined && (
                            <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-blue-600 h-full rounded-full transition-all" 
                                style={{ width: `${doc.processingProgress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px] italic">Lưu trữ chung</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 text-center">
                      {renderStatusBadge(doc.status)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right relative z-20">
                      <div className="flex items-center justify-end gap-1.5 relative z-30">
                        <button
                          onClick={() => handleAnalyzeWithAi(doc)}
                          className="p-2 bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-700 rounded-xl transition-all cursor-pointer"
                          title="Trợ lý AI phân tích & tóm tắt nhanh"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
                          title="Xem chi tiết & Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDelegatingDoc(doc)}
                          className="p-2 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 rounded-xl transition-all cursor-pointer"
                          title="Phân công thụ lý & giao việc"
                        >
                          <Briefcase className="w-3.5 h-3.5" />
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

      {/* ========================================================================= */}
      {/* 5. CREATE / EDIT DOCUMENT MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white w-full max-w-5xl rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 text-slate-900 max-h-[94vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-sm">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900">
                      {editingDoc 
                        ? `Chỉnh sửa văn bản: ${editingDoc.codeNumber}` 
                        : direction === 'INCOMING' 
                          ? 'Tiếp nhận Văn bản Đến mới' 
                          : direction === 'INTERNAL'
                            ? 'Tạo Dự thảo văn bản phê duyệt'
                            : 'Ban hành Văn bản Chỉ đạo mới'}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Nhập thông tin theo chuẩn thể thức văn thư hành chính và tích hợp AI bóc tách dữ liệu
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
                {/* 1. Classification & Direction Selector */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-black text-slate-700">Phân luồng luân chuyển:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setDirection('OUTGOING')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                          direction === 'OUTGOING'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Văn bản Đi / Ban hành
                      </button>
                      <button
                        type="button"
                        onClick={() => setDirection('INCOMING')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                          direction === 'INCOMING'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Văn bản Đến
                      </button>
                      <button
                        type="button"
                        onClick={() => setDirection('INTERNAL')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                          direction === 'INTERNAL'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Nội bộ / Dự thảo
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. File Upload & Google Drive Storage Section */}
                <div className="space-y-2">
                  <SmartMediaDriveUploader
                    label="Tệp đính kèm & Lưu trữ Google Drive (7 Thư mục Chánh Hiệp)"
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
                      <span>AI Gemini đang đọc nội dung tệp &amp; tự động trích xuất các thông số...</span>
                    </div>
                  )}
                </div>

                {/* 3. Core Metadata Fields */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Số / Ký hiệu văn bản: *</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: 18/KH-MTTQ-BTT hoặc 118/UBND-VP"
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
                      <optgroup label="📋 Văn bản Chỉ đạo, Điều hành & Nghiệp vụ">
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

                  <div className="md:col-span-4 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Lĩnh vực chuyên môn:</label>
                    <select
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600 font-medium"
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
                      placeholder="Nhập đầy đủ trích yếu nội dung văn bản..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600 font-medium"
                    />
                  </div>

                  <div className="md:col-span-6 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Cơ quan ban hành / Nơi gửi:</label>
                    <input
                      type="text"
                      list="doc-admin-issuers-list"
                      value={issuer}
                      onChange={(e) => setIssuer(e.target.value)}
                      placeholder="VD: Quốc hội, Chính phủ, Ủy ban Trung ương MTTQ Việt Nam..."
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                    <datalist id="doc-admin-issuers-list">
                      <option value="Quốc hội nước CHXHCN Việt Nam" />
                      <option value="Ủy ban Thường vụ Quốc hội" />
                      <option value="Chính phủ nước CHXHCN Việt Nam" />
                      <option value="Thủ tướng Chính phủ" />
                      <option value="Ủy ban Trung ương Mặt trận Tổ quốc Việt Nam" />
                      <option value="Đoàn Chủ tịch UBTƯ MTTQ Việt Nam" />
                      <option value="Ban Thường trực UBTƯ MTTQ Việt Nam" />
                      <option value="Ban Chấp hành Trung ương Đảng" />
                      <option value="Bộ Nội vụ" />
                      <option value="Bộ Tư pháp" />
                      <option value="Bộ Thông tin và Truyền thông" />
                      <option value="Tỉnh ủy - HĐND - UBND Tỉnh Bình Dương" />
                      <option value="Ủy ban MTTQ Việt Nam Tỉnh Bình Dương" />
                      <option value="Thành ủy - HĐND - UBND Thành phố Thủ Dầu Một" />
                      <option value="Ủy ban MTTQ Việt Nam Thành phố Thủ Dầu Một" />
                      <option value="Đảng ủy - HĐND - UBND phường Chánh Hiệp" />
                      <option value="Ủy ban MTTQ Việt Nam phường Chánh Hiệp" />
                    </datalist>
                  </div>

                  <div className="md:col-span-3 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Ngày ban hành:</label>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="md:col-span-3 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Độ khẩn:</label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as DocumentUrgency)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                    >
                      <option value="NORMAL">Thường</option>
                      <option value="URGENT">Khẩn</option>
                      <option value="VERY_URGENT">Thượng khẩn</option>
                      <option value="HOA_TOC">Hỏa tốc</option>
                    </select>
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

                {/* 4. Incoming Doc Specialized Dispatch Section */}
                {direction === 'INCOMING' && (
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                    <h4 className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-emerald-700" /> Phân công thụ lý &amp; Đặt hạn giải quyết:
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Số đến trong Sổ:</label>
                        <input
                          type="text"
                          value={incomingNumber}
                          onChange={(e) => setIncomingNumber(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold"
                          placeholder="VD: Đ-142/2026"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Cán bộ thụ lý chính:</label>
                        <select
                          value={assignedStaff}
                          onChange={(e) => setAssignedStaff(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                        >
                          {STAFF_LIST.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Hạn giải quyết (Deadline):</label>
                        <input
                          type="date"
                          value={deadline}
                          onChange={(e) => setDeadline(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-rose-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Ý kiến chỉ đạo của Lãnh đạo MTTQ:</label>
                      <textarea
                        rows={2}
                        placeholder="Ý kiến bút phê chỉ đạo phân công..."
                        value={processingNotes}
                        onChange={(e) => setProcessingNotes(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>
                )}

                {/* 5. Summary & Public Toggle */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Tóm tắt nội dung chính:</label>
                    <textarea
                      rows={2}
                      placeholder="Tóm tắt ngắn gọn các điểm chính của văn bản..."
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 block">Công khai trên Cổng thông tin</span>
                      <span className="text-[11px] text-slate-500">Cho phép người dân tra cứu và tải tài liệu</span>
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
                    {editingDoc ? 'Lưu cập nhật' : 'Hoàn tất & Lưu vào Sổ'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. PREVIEW & QUICK VIEW MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white w-full max-w-4xl rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 text-slate-900 max-h-[92vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-900 font-mono font-black text-xs rounded-lg">
                    {previewDoc.codeNumber}
                  </span>
                  {renderUrgencyBadge(previewDoc.urgency)}
                  {renderStatusBadge(previewDoc.status)}
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
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Loại văn bản</span>
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
                      <FileText className="w-4 h-4 text-blue-600" /> Trích yếu &amp; Tóm tắt:
                    </h4>
                    <p className="text-slate-700 leading-relaxed font-normal">{previewDoc.summary}</p>
                  </div>
                )}

                {previewDoc.processingNotes && (
                  <div className="space-y-1.5 p-4 bg-amber-50/80 rounded-2xl border border-amber-200">
                    <h4 className="font-black text-amber-950 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600" /> Ý kiến chỉ đạo &amp; Bút phê:
                    </h4>
                    <p className="text-amber-900 leading-relaxed font-mono text-[11px] whitespace-pre-wrap">{previewDoc.processingNotes}</p>
                  </div>
                )}

                {/* Action Buttons in Preview */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setPreviewDoc(null);
                        handleAnalyzeWithAi(previewDoc);
                      }}
                      className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      Phân tích AI
                    </button>
                    {!previewDoc.isDigitalSigned && (
                      <button
                        onClick={() => {
                          setSigningDoc(previewDoc);
                          setPreviewDoc(null);
                        }}
                        className="px-3.5 py-2 bg-teal-600 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Ký số điện tử
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {previewDoc.driveUrl && (
                      <a
                        href={previewDoc.driveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                      >
                        <HardDrive className="w-3.5 h-3.5" />
                        Mở Google Drive
                      </a>
                    )}
                    {previewDoc.fileUrl && (
                      <a
                        href={previewDoc.fileUrl}
                        download={previewDoc.fileName || 'van-ban.pdf'}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Tải tệp về máy
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 7. AI DEEP ANALYSIS MODAL */}
      {/* ========================================================================= */}
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
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-2xl shadow-sm">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900">
                      Trợ lý AI Phân tích Văn bản: {aiAnalyzingDoc.codeNumber}
                    </h3>
                    <p className="text-xs text-slate-500">Mô hình Gemini 2.5 Flash xử lý nghiệp vụ Mặt trận</p>
                  </div>
                </div>
                <button
                  onClick={() => setAiAnalyzingDoc(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
                {isAiLoading ? (
                  <div className="py-16 text-center space-y-3">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                    <p className="font-bold text-slate-700">Đang phân tích điều khoản, nhiệm vụ và đề xuất lộ trình...</p>
                    <p className="text-[11px] text-slate-400">Vui lòng chờ trong giây lát</p>
                  </div>
                ) : (
                  <div className="prose prose-xs max-w-none text-slate-800 space-y-3 leading-relaxed whitespace-pre-wrap font-sans">
                    {aiAnalysisResult}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 shrink-0">
                <button
                  onClick={() => {
                    if (aiAnalysisResult) {
                      navigator.clipboard.writeText(aiAnalysisResult);
                      notify('Đã sao chép nội dung phân tích AI vào bộ nhớ tạm!', 'success');
                    }
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Sao chép kết quả
                </button>
                <button
                  onClick={() => setAiAnalyzingDoc(null)}
                  className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 8. DIGITAL SIGNING MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {signingDoc && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-teal-100 text-teal-700 rounded-2xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Ký số điện tử &amp; Ban hành</h3>
                  <p className="text-xs text-slate-500">Chứng thực điện tử lãnh đạo Ủy ban MTTQ</p>
                </div>
              </div>

              <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 space-y-2 text-xs">
                <p className="font-bold text-teal-950">Văn bản: {signingDoc.codeNumber}</p>
                <p className="text-slate-600 font-normal line-clamp-2">{signingDoc.title}</p>
                <div className="pt-2 border-t border-teal-200/60 text-[11px] text-teal-900">
                  <p><strong>Người ký:</strong> {signingDoc.signer} ({signingDoc.signerPosition || 'Chủ tịch'})</p>
                  <p><strong>Đơn vị:</strong> Ban Thường trực UBMTTQ VN phường Chánh Hiệp</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setSigningDoc(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmDigitalSign}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Xác nhận Ký số
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 9. DELEGATE TASK / DISPATCH MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {delegatingDoc && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Phân công cán bộ thụ lý</h3>
                  <p className="text-xs text-slate-500">Chuyển tiếp văn bản thành nhiệm vụ giao ban</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-mono font-black text-blue-700">{delegatingDoc.codeNumber}</span>
                <p className="font-bold text-slate-800 line-clamp-1 mt-0.5">{delegatingDoc.title}</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Bộ phận chuyên môn phụ trách:</label>
                  <select
                    value={assignedDepartment}
                    onChange={(e) => setAssignedDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Cán bộ thụ lý chính:</label>
                  <select
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    {STAFF_LIST.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Thời hạn hoàn thành (Deadline):</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-rose-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Ý kiến chỉ đạo / Yêu cầu công việc:</label>
                  <textarea
                    rows={3}
                    placeholder="Nhập nội dung chỉ đạo chi tiết..."
                    value={processingNotes}
                    onChange={(e) => setProcessingNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDelegatingDoc(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmDelegation}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Giao việc &amp; Cập nhật Sổ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 10. DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {docToDelete && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-100 text-rose-700 rounded-2xl">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Xác nhận xóa văn bản</h3>
                  <p className="text-xs text-slate-500">Hành động này không thể hoàn tác</p>
                </div>
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs">
                <p className="font-bold text-rose-950">{docToDelete.codeNumber}</p>
                <p className="text-slate-600 line-clamp-2 mt-0.5">{docToDelete.title}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDocToDelete(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    onDeleteDocument(docToDelete.id);
                    notify(`Đã xóa văn bản "${docToDelete.codeNumber}" khỏi hệ thống!`, 'info');
                    setDocToDelete(null);
                  }}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Xác nhận xóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
