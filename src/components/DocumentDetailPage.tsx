import React, { useState, useEffect, useMemo } from 'react';
import { OfficialDocument } from '../types';
import { 
  getGoogleDrivePreviewEmbedUrl, 
  getGoogleDriveViewUrl, 
  getGoogleDriveDirectDownloadUrl,
  extractGoogleDriveFileId
} from '../lib/googleDriveService';
import { SecurePdfViewer } from './SecurePdfViewer';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Building, 
  UserCheck, 
  Calendar, 
  CheckCircle, 
  ChevronRight, 
  Eye, 
  Share2, 
  Printer, 
  Check, 
  FileCheck,
  ShieldCheck,
  Search,
  ExternalLink,
  Maximize2,
  Minimize2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  HardDrive,
  Layers,
  Sparkles,
  Info,
  BookOpen,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DocumentDetailPageProps {
  document: OfficialDocument;
  allDocuments?: OfficialDocument[];
  onSelectDocument?: (doc: OfficialDocument) => void;
  onBack: () => void;
  onDownload?: (doc: OfficialDocument) => void;
}

export const DocumentDetailPage: React.FC<DocumentDetailPageProps> = ({
  document,
  allDocuments = [],
  onSelectDocument,
  onBack,
  onDownload
}) => {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'VIEWER' | 'DIGITAL_TEXT' | 'METADATA'>('VIEWER');
  const [isExpandedView, setIsExpandedView] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [document.id]);

  const safeDocs = Array.isArray(allDocuments) ? allDocuments : [];
  const relatedDocs = safeDocs
    .filter(d => d && d.id !== document.id && (d.docType === document.docType || d.field === document.field))
    .slice(0, 5);

  const rawDocumentUrl = document.driveUrl || document.fileUrl || '';
  const driveFileId = extractGoogleDriveFileId(rawDocumentUrl);

  const viewUrl = useMemo(() => {
    return getGoogleDriveViewUrl(rawDocumentUrl) || rawDocumentUrl;
  }, [rawDocumentUrl]);

  const downloadUrl = useMemo(() => {
    return getGoogleDriveDirectDownloadUrl(rawDocumentUrl) || rawDocumentUrl;
  }, [rawDocumentUrl]);

  const handleDownload = () => {
    if (onDownload) {
      onDownload(document);
    }
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  const handleOpenGoogleDrive = () => {
    if (viewUrl) {
      window.open(viewUrl, '_blank');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 ${
        isExpandedView ? 'max-w-[1600px]' : 'max-w-7xl'
      }`}
    >
      {/* 1. TOP COMMAND & NAVIGATION TOOLBAR */}
      <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 sticky top-2 z-20">
        {/* Left: Breadcrumbs & Badges */}
        <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap min-w-0">
          <button 
            onClick={onBack}
            className="text-blue-700 hover:text-blue-900 font-black flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kho Văn bản</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="font-extrabold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
            {document.codeNumber}
          </span>
          <span className="bg-emerald-50 text-emerald-800 font-black text-[11px] px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1 shrink-0">
            <CheckCircle className="w-3 h-3 text-emerald-600" /> Còn hiệu lực
          </span>
        </div>

        {/* Right: Action Buttons Group */}
        <div className="flex items-center gap-1.5 flex-wrap self-end md:self-auto">
          {/* Toggle Sidebar (Desktop) */}
          <button
            type="button"
            onClick={() => setShowSidebar(!showSidebar)}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
            title={showSidebar ? 'Ẩn cột thông tin bên phải' : 'Hiện cột thông tin bên phải'}
          >
            {showSidebar ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
            <span>{showSidebar ? 'Gọn trang' : 'Bảng tin'}</span>
          </button>

          {/* Toggle Expanded Mode */}
          <button
            type="button"
            onClick={() => setIsExpandedView(!isExpandedView)}
            className="px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200 flex items-center gap-1"
            title={isExpandedView ? 'Thu nhỏ khung' : 'Mở rộng khung xem'}
          >
            {isExpandedView ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isExpandedView ? 'Thu gọn' : 'Mở rộng'}</span>
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200 flex items-center gap-1"
            title="In văn bản"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">In</span>
          </button>

          {/* Share / Copy link */}
          <button
            type="button"
            onClick={handleShare}
            className="px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200 flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã sao chép' : 'Chia sẻ'}</span>
          </button>

          {/* Google Drive Link */}
          {rawDocumentUrl && (
            <button
              type="button"
              onClick={handleOpenGoogleDrive}
              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Mở toàn văn trên Google Drive"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
              <span>Drive</span>
            </button>
          )}

          {/* Primary Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-black text-xs rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Tải PDF</span>
          </button>
        </div>
      </div>

      {/* 2. COMPACT OFFICIAL DOCUMENT HEADER & METADATA BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 sm:p-5 space-y-3">
        {/* Title */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-blue-700 text-white font-black text-xs px-2.5 py-0.5 rounded-md shadow-2xs">
              {document.docType}
            </span>
            <span className="text-xs font-bold text-slate-500">
              Số: <strong className="text-slate-900">{document.codeNumber}</strong>
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-600 font-semibold">
              Lĩnh vực: <strong className="text-slate-800">{document.field}</strong>
            </span>
          </div>

          <h1 className="text-base sm:text-xl font-black text-slate-900 leading-snug tracking-tight">
            {document.title}
          </h1>
        </div>

        {/* Compact Horizontal Metadata Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 p-2 bg-slate-50/90 rounded-xl border border-slate-100">
            <Building className="w-4 h-4 text-blue-700 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-500 font-bold block leading-none">Cơ quan ban hành</span>
              <span className="font-extrabold text-slate-800 truncate block mt-0.5">{document.issuer}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-slate-50/90 rounded-xl border border-slate-100">
            <UserCheck className="w-4 h-4 text-blue-700 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-500 font-bold block leading-none">Người ký</span>
              <span className="font-extrabold text-slate-800 truncate block mt-0.5">{document.signer}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-slate-50/90 rounded-xl border border-slate-100">
            <Calendar className="w-4 h-4 text-blue-700 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-500 font-bold block leading-none">Ngày ban hành</span>
              <span className="font-bold text-slate-800 truncate block mt-0.5">{document.issueDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-slate-50/90 rounded-xl border border-slate-100">
            <FileCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-500 font-bold block leading-none">Hiệu lực thi hành</span>
              <span className="font-bold text-slate-800 truncate block mt-0.5">{document.effectiveDate || document.issueDate}</span>
            </div>
          </div>
        </div>

        {/* Collapsible Document Summary */}
        {document.summary && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowSummary(!showSummary)}
              className="flex items-center justify-between w-full p-2 bg-blue-50/70 hover:bg-blue-50 text-blue-900 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-blue-100"
            >
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-700" />
                <span>Trích yếu tóm tắt nội dung văn bản</span>
              </span>
              {showSummary ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <AnimatePresence>
              {showSummary && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 mt-1.5 bg-slate-50 rounded-xl border border-blue-200/80 text-xs text-slate-800 leading-relaxed font-medium">
                    {document.summary}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 3. MAIN WORKSPACE: HIGH-FOCUS VIEWER CANVAS (8.5/12 or 12/12) + SIDEBAR (3.5/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left / Center Document Canvas */}
        <div className={`${showSidebar ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'} space-y-3 transition-all`}>
          
          {/* Tab Selector & Reading Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTab('VIEWER')}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'VIEWER'
                    ? 'bg-blue-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Toàn văn PDF / Google Drive</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('DIGITAL_TEXT')}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'DIGITAL_TEXT'
                    ? 'bg-blue-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Thể thức số hóa</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('METADATA')}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'METADATA'
                    ? 'bg-blue-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Thông số văn thư</span>
              </button>
            </div>

            {/* Quick Status Pill */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 pr-2">
              <span className="flex items-center gap-1 text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Chữ ký số hợp lệ</span>
              </span>
            </div>
          </div>

          {/* TAB 1: IMMERSIVE PDF & DRIVE VIEWER */}
          {activeTab === 'VIEWER' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <SecurePdfViewer
                fileUrl={document.fileUrl}
                driveUrl={document.driveUrl}
                title={document.title}
                height={isExpandedView ? '840px' : '760px'}
              />
            </div>
          )}

          {/* TAB 2: DIGITAL FORMATTED TEXT */}
          {activeTab === 'DIGITAL_TEXT' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 sm:p-8 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-line space-y-4">
              <div className="text-center space-y-1 not-italic border-b border-slate-200 pb-4">
                <p className="font-extrabold text-slate-900 uppercase tracking-wide">ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM</p>
                <p className="font-bold text-blue-700">Số: {document.codeNumber}</p>
                <p className="text-xs text-slate-500 italic">
                  Ngày {document.issueDate.split('-')[2] || '01'} tháng {document.issueDate.split('-')[1] || '01'} năm {document.issueDate.split('-')[0] || '2025'}
                </p>
              </div>

              <div className="font-black text-center text-slate-900 uppercase py-2 text-sm sm:text-base tracking-tight">
                {document.docType}: {document.title}
              </div>

              <div className="text-xs space-y-3 leading-relaxed text-slate-700">
                <p className="font-semibold text-slate-800">
                  Căn cứ Luật Mặt trận Tổ quốc Việt Nam số 75/2015/QH13 và các văn bản hướng dẫn thi hành;
                </p>
                <p className="font-semibold text-slate-800">
                  Căn cứ Nghị định số 30/2020/NĐ-CP của Chính phủ về công tác văn thư và lưu trữ văn bản điện tử;
                </p>
                <p className="font-semibold text-slate-800">
                  Căn cứ Quy chế làm việc và Chương trình công tác trọng tâm của Ủy ban Mặt trận Tổ quốc;
                </p>
                <p className="font-bold text-slate-900 pt-2">
                  Ban Thường trực Ủy ban Mặt trận Tổ quốc Việt Nam ban hành:
                </p>
                <p>
                  <strong>Điều 1. Nội dung chỉ đạo:</strong> {document.summary || document.title}
                </p>
                <p>
                  <strong>Điều 2. Tổ chức thực hiện:</strong> Các ban, ngành, đoàn thể trực thuộc và Ban Công tác Mặt trận các khu phố căn cứ chức năng, nhiệm vụ triển khai thực hiện nghiêm túc.
                </p>
                <p>
                  <strong>Điều 3. Hiệu lực thi hành:</strong> Văn bản có hiệu lực kể từ ngày ký.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200 flex justify-between items-end">
                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <p className="font-bold">Nơi nhận:</p>
                  <p>- Ban Thường trực UB MTTQ;</p>
                  <p>- Các ban ngành, đoàn thể, khu phố;</p>
                  <p>- Lưu: VT, VP.</p>
                </div>
                <div className="text-center font-bold text-slate-900">
                  <p className="uppercase text-xs font-black">TM. BAN THƯỜNG TRỰC</p>
                  <p className="text-xs text-blue-800 font-extrabold">{document.signer}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold pt-1 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Chữ ký số đã xác thực
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMPLETE METADATA SHEET */}
          {activeTab === 'METADATA' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
              <h3 className="font-black text-slate-900 text-sm border-b border-slate-100 pb-2">
                Thông số hành chính và pháp lý của văn bản
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-500 font-bold block text-[11px]">Số / Ký hiệu văn bản:</span>
                  <span className="font-black text-blue-900 text-sm">{document.codeNumber}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-500 font-bold block text-[11px]">Loại văn bản:</span>
                  <span className="font-black text-slate-900">{document.docType}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-500 font-bold block text-[11px]">Lĩnh vực chuyên môn:</span>
                  <span className="font-black text-slate-900">{document.field}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-500 font-bold block text-[11px]">Cơ quan ban hành:</span>
                  <span className="font-black text-slate-900">{document.issuer}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-500 font-bold block text-[11px]">Người ký duyệt:</span>
                  <span className="font-black text-slate-900">{document.signer}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-500 font-bold block text-[11px]">Ngày ban hành chính thức:</span>
                  <span className="font-black text-slate-900">{document.issueDate}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-500 font-bold block text-[11px]">Ngày bắt đầu hiệu lực:</span>
                  <span className="font-black text-emerald-800">{document.effectiveDate || document.issueDate}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-500 font-bold block text-[11px]">Tình trạng văn bản:</span>
                  <span className="font-black text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Đang có hiệu lực thi hành
                  </span>
                </div>
              </div>

              {rawDocumentUrl && (
                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] text-blue-800 font-bold block">Liên kết Google Drive:</span>
                    <span className="font-mono text-slate-800 truncate block text-[11px]">{rawDocumentUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenGoogleDrive}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-xs shrink-0 cursor-pointer"
                  >
                    Mở
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Companion Sidebar (3.5/12) */}
        {showSidebar && (
          <div className="lg:col-span-4 xl:col-span-3 space-y-4">
            
            {/* Download & File Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 space-y-3">
              <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-2">
                <span>Tệp đính kèm gốc</span>
                <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">PDF</span>
              </h3>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5">
                <div className="p-2 bg-red-100 text-red-700 rounded-lg font-black text-xs shrink-0">
                  PDF
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs text-slate-900 truncate">
                    {document.fileName || `${document.codeNumber.replace(/[\/\\]/g, '_')}.pdf`}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {document.fileSize || (driveFileId ? 'Lưu trữ Google Drive' : 'Văn bản điện tử')}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-white" />
                  <span>Tải bản lưu đầy đủ (.pdf)</span>
                </button>

                {rawDocumentUrl && (
                  <button
                    type="button"
                    onClick={handleOpenGoogleDrive}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-300"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Mở trong Google Drive</span>
                  </button>
                )}
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Văn bản chính thức được số hóa và lưu trữ an toàn.</span>
              </div>
            </div>

            {/* Related Documents */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 space-y-3">
              <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                <span>Văn bản cùng loại & liên quan</span>
              </h3>

              <div className="space-y-2">
                {relatedDocs.length > 0 ? (
                  relatedDocs.map((rd) => (
                    <div
                      key={rd.id}
                      onClick={() => onSelectDocument && onSelectDocument(rd)}
                      className="p-2.5 bg-slate-50 hover:bg-blue-50/80 rounded-xl border border-slate-200 hover:border-blue-300 transition-all cursor-pointer group space-y-1"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-black text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded">
                          {rd.codeNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">{rd.issueDate}</span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-700 line-clamp-2 leading-snug">
                        {rd.title}
                      </h4>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-1">Không có văn bản cùng loại khác.</p>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </motion.div>
  );
};

