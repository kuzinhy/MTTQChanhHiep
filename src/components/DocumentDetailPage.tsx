import React, { useState, useEffect } from 'react';
import { OfficialDocument } from '../types';
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
  Search
} from 'lucide-react';
import { motion } from 'motion/react';

interface DocumentDetailPageProps {
  document: OfficialDocument;
  allDocuments: OfficialDocument[];
  onSelectDocument: (doc: OfficialDocument) => void;
  onBack: () => void;
}

export const DocumentDetailPage: React.FC<DocumentDetailPageProps> = ({
  document,
  allDocuments,
  onSelectDocument,
  onBack,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [document.id]);

  const relatedDocs = allDocuments
    .filter(d => d.id !== document.id && (d.docType === document.docType || d.field === document.field))
    .slice(0, 4);

  const handleDownload = () => {
    const targetUrl = document.fileUrl || document.driveUrl;
    if (targetUrl) {
      window.open(targetUrl, '_blank');
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-7xl mx-auto px-4 py-6 space-y-8"
    >
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 flex-wrap">
          <button 
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            Trang chủ
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button 
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 hover:underline font-bold cursor-pointer"
          >
            Văn bản - Chính sách
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-extrabold truncate max-w-xs sm:max-w-md">
            {document.codeNumber}
          </span>
        </div>

        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4 text-slate-700" />
          <span>Quay lại Kho Văn bản</span>
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Document View (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-8">
          
          {/* Document Official Badge Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-blue-600 text-white font-black text-xs px-3 py-1 rounded-xl shadow-2xs">
                  {document.codeNumber}
                </span>
                <span className="bg-blue-50 text-blue-800 font-bold text-xs px-3 py-1 rounded-xl border border-blue-200">
                  {document.docType}
                </span>
                <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[11px] px-2.5 py-0.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" /> Còn hiệu lực
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Lĩnh vực: <strong className="text-slate-800">{document.field}</strong></p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="px-3 py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Đã chép' : 'Chia sẻ'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                title="In văn bản"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4 text-white" />
                <span>{downloading ? 'Đang tải...' : 'Tải PDF'}</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {document.title}
            </h1>
          </div>

          {/* Official Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <Building className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-500 block">Cơ quan ban hành:</span>
                <span className="font-extrabold text-slate-900">{document.issuer}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <UserCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-500 block">Người ký duyệt:</span>
                <span className="font-extrabold text-slate-900">{document.signer}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-500 block">Ngày ban hành:</span>
                <span className="font-bold text-slate-800">{document.issueDate}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FileCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-500 block">Ngày bắt đầu hiệu lực:</span>
                <span className="font-bold text-slate-800">{document.effectiveDate || document.issueDate}</span>
              </div>
            </div>
          </div>

          {/* Document Summary Box */}
          {document.summary && (
            <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 text-slate-900 text-xs sm:text-sm font-medium leading-relaxed space-y-2">
              <span className="font-extrabold text-blue-900 block uppercase tracking-wide text-xs">Mô tả tóm tắt nội dung văn bản:</span>
              <p>{document.summary}</p>
            </div>
          )}

          {/* Official Document Text Viewer Simulation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Nội dung chi tiết văn bản chỉ đạo</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-semibold">Định dạng số hóa chính thức</span>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-mono whitespace-pre-line space-y-4">
              <div className="text-center space-y-1 font-sans not-italic border-b border-slate-200 pb-4">
                <p className="font-extrabold text-slate-900 uppercase">ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP</p>
                <p className="font-bold text-blue-700">Số: {document.codeNumber}</p>
                <p className="text-xs text-slate-500 italic">Chánh Hiệp, ngày {document.issueDate.split('-')[2] || '15'} tháng {document.issueDate.split('-')[1] || '08'} năm {document.issueDate.split('-')[0] || '2026'}</p>
              </div>

              <div className="font-sans font-bold text-center text-slate-900 uppercase py-2">
                {document.docType}: {document.title}
              </div>

              <div className="font-sans text-xs space-y-3 leading-relaxed text-slate-700">
                <p>Căn cứ Nghị quyết Đại hội Đại biểu Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp;</p>
                <p>Căn cứ chương trình phối hợp thống nhất hành động năm 2026 về công tác an sinh xã hội, cứu trợ khẩn cấp và công khai ngân sách chăm lo người nghèo trên địa bàn 12 khu phố;</p>
                <p className="font-bold text-slate-900 pt-2">Ban Thường trực Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp ban hành Kế hoạch thực hiện cụ thể như sau:</p>
                <p><strong>Điều 1.</strong> Triển khai quy trình số hóa công khai, tiếp nhận đóng góp Quỹ Vì người nghèo và phản ánh dân sinh trực tiếp qua Cổng An sinh Số.</p>
                <p><strong>Điều 2.</strong> Giao các Trưởng Ban Công tác Mặt trận tại 12 khu phố chịu trách nhiệm hướng dẫn nhân dân tra cứu, đăng ký danh sách nhận hỗ trợ và tổ chức triển khai thực hiện.</p>
                <p><strong>Điều 3.</strong> Văn bản này có hiệu lực kể từ ngày ký.</p>
              </div>

              <div className="pt-6 border-t border-slate-200 flex justify-between items-end font-sans">
                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <p className="font-bold">Nơi nhận:</p>
                  <p>- Ban Thường trực MTTQ TP;</p>
                  <p>- Đảng ủy, HĐND, UBND Phường;</p>
                  <p>- 12 Ban Công tác Mặt trận KP;</p>
                  <p>- Lưu: VT.</p>
                </div>
                <div className="text-center font-bold text-slate-900">
                  <p className="uppercase text-xs font-black">TM. BAN THƯỜNG TRỰC</p>
                  <p className="text-xs text-blue-700 font-extrabold">{document.signer}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold pt-1 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Chữ ký số đã xác thực
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Download Box */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
              Tải file đính kèm chính thức
            </h3>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-100 text-red-700 rounded-xl font-black text-xs">
                  PDF
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900 truncate max-w-[150px]">{document.codeNumber}.pdf</p>
                  <span className="text-[10px] text-slate-400">Dung lượng: 1.2 MB</span>
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors cursor-pointer"
                title="Tải văn bản"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Tải bản lưu đầy đủ</span>
            </button>
          </div>

          {/* Related Documents */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-blue-600" />
              <span>Văn bản liên quan</span>
            </h3>

            <div className="space-y-3">
              {relatedDocs.length > 0 ? (
                relatedDocs.map((rd) => (
                  <div
                    key={rd.id}
                    onClick={() => onSelectDocument(rd)}
                    className="p-3 bg-slate-50 hover:bg-blue-50/70 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all cursor-pointer group space-y-1"
                  >
                    <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {rd.codeNumber}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 line-clamp-2 leading-snug">
                      {rd.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 block">
                      {rd.issueDate} • {rd.issuer}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">Không có văn bản cùng loại khác.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
};
