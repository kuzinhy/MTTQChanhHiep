import React, { useState } from 'react';
import { 
  FileBarChart2, 
  Sparkles, 
  Download, 
  Save, 
  History, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Calendar,
  Layers,
  Database,
  ArrowRight,
  Check
} from 'lucide-react';
import { SecurityNoticeBanner } from '../SecurityNoticeBanner';
import { AiDocument, WorkspaceContextData } from '../../../../types';
import { aiWorkspaceService } from '../../../../lib/aiWorkspaceService';

interface ReportAndPlanToolViewProps {
  onSaveDocument: (doc: AiDocument) => void;
  workspaceContext?: WorkspaceContextData;
  onOpenHistory?: () => void;
}

export const ReportAndPlanToolView: React.FC<ReportAndPlanToolViewProps> = ({
  onSaveDocument,
  workspaceContext,
  onOpenHistory
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [reportCategory, setReportCategory] = useState<'report' | 'plan' | 'program'>('report');
  const [reportType, setReportType] = useState('Báo cáo Tháng');
  const [reportTitle, setReportTitle] = useState('Báo cáo Kết quả công tác Mặt trận Tháng 08/2026');
  const [period, setPeriod] = useState('Tháng 08/2026');
  
  // Data sources options
  const [includeSystemTasks, setIncludeSystemTasks] = useState(true);
  const [includeContextEvents, setIncludeContextEvents] = useState(true);
  const [rawNotes, setRawNotes] = useState(`- Vận động Quỹ "Vì người nghèo" đạt 120 triệu đồng.
- Đã tổ chức 21 cuộc tiếp xúc cử tri tại 21 khu phố, ghi nhận 45 ý kiến.
- Bàn giao 01 căn nhà Đại đoàn kết tại Khu phố 4.
- Phối hợp dọn dẹp vệ sinh môi trường tuyến rạch Chánh Hiệp.`);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setIsSaved(false);

    setTimeout(() => {
      setIsGenerating(false);
      setStep(3);

      const header = `ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP\nBan Thường trực\n----------------\nSố: .../BC-MTTQ`;
      const sampleText = `${header}\n\n${reportTitle.toUpperCase()}\n\nI. KẾT QUẢ CÔNG TÁC ĐẠT ĐƯỢC IN ${period.toUpperCase()}\n1. Công tác tuyên truyền, vận động khối đại đoàn kết toàn dân:\n- Tuyên truyền chủ trương của Cấp ủy và Chỉ đạo của Mặt trận cấp trên tới 21 Khu phố.\n- Đã tổ chức 21 cuộc tiếp xúc cử tri, tổng hợp 45 ý kiến kiến nghị về hạ tầng và dân sinh.\n\n2. Kết quả thực hiện các cuộc vận động & An sinh xã hội:\n- Kết quả vận động Quỹ "Vì người nghèo": Đã thu [ĐÃ XÁC NHẬN: 120.000.000 VNĐ / Chỉ tiêu 500.000.000 VNĐ].\n- Công trình Đại đoàn kết: Đã bàn giao 01 căn nhà tại Khu phố 4.\n- [CHƯA CÓ SỐ LIỆU - CẦN BỔ SUNG]: Số lượng quà tặng hộ nghèo dịp Lễ vừa qua.\n\n3. Công tác Giám sát & Phản biện xã hội:\n- Phối hợp bộ phận Địa chính dọn dẹp vệ sinh môi trường tuyến rạch Chánh Hiệp.\n- [CHƯA CÓ SỐ LIỆU - CẦN BỔ SUNG]: Số lượng đơn thư tiếp nhận và kết quả chuyển xử lý.\n\nII. TỒN TẠI, HẠN CHẾ VÀ NGUYÊN NHÂN\n1. Hạn chế: Việc gửi báo cáo tiến độ của một số Ban CTMT Khu phố còn chậm so với quy định.\n2. Nguyên nhân: Cán bộ khu phố chủ yếu kiêm nhiệm, khối lượng công việc phát sinh nhiều.\n\nIII. NHIỆM VỤ TRỌNG TÂM THỜI GIAN TỚI\n1. Chuẩn bị tốt các điều kiện tổ chức Tháng cao điểm "Vì người nghèo" và Ngày hội Đại đoàn kết toàn dân tộc.\n2. Tiếp tục rà soát danh sách các hộ nghèo, hộ cận nghèo cần hỗ trợ sửa chữa nhà ở.\n3. Đôn đốc 21 Ban CTMT Khu phố thực hiện nghiêm chế độ báo cáo định kỳ.`;

      setGeneratedContent(sampleText);
    }, 1100);
  };

  const handleSave = () => {
    if (!generatedContent) return;
    const doc: AiDocument = {
      id: `doc_${Date.now()}`,
      title: reportTitle,
      toolId: 'report_plan',
      group: 'group2_advisory_report',
      content: generatedContent,
      ownerId: 'usr_01',
      ownerName: 'Cán bộ MTTQ',
      status: 'completed',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSaveDocument(doc);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExportWord = () => {
    if (!generatedContent) return;
    aiWorkspaceService.exportToWord(reportTitle, generatedContent);
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-5 overflow-y-auto h-full pb-20">
      <SecurityNoticeBanner />

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <FileBarChart2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">4. Báo cáo – Kế hoạch – Chương trình (Max 3 bước)</h2>
              <span className="text-[10px] bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded-full border border-cyan-200">
                LÕI NHÓM 02
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tạo lập báo cáo định kỳ/chuyên đề tối đa 3 bước, tự động kết nối dữ liệu nhiệm vụ & gắn nhãn số liệu rõ ràng.
            </p>
          </div>
        </div>

        {onOpenHistory && (
          <button
            onClick={onOpenHistory}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <History className="w-4 h-4 text-cyan-600" />
            <span>Lịch sử báo cáo</span>
          </button>
        )}
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-2 text-xs font-bold">
        <button
          onClick={() => setStep(1)}
          className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
            step === 1 ? 'bg-cyan-600 text-white shadow-xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
          <span>Bước 1: Chọn loại & Tiêu đề</span>
        </button>

        <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />

        <button
          onClick={() => setStep(2)}
          className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
            step === 2 ? 'bg-cyan-600 text-white shadow-xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
          <span>Bước 2: Kết nối dữ liệu</span>
        </button>

        <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />

        <button
          onClick={() => { if (generatedContent) setStep(3); }}
          disabled={!generatedContent}
          className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
            step === 3 ? 'bg-cyan-600 text-white shadow-xs' : 'bg-slate-50 text-slate-400 opacity-60'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
          <span>Bước 3: Xem & Xuất báo cáo</span>
        </button>
      </div>

      {/* Step 1: Form selection */}
      {step === 1 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 max-w-3xl mx-auto">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Bước 1: Chọn thể loại và thông tin chung
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => { setReportCategory('report'); setReportType('Báo cáo Tháng'); }}
              className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                reportCategory === 'report' ? 'border-cyan-500 bg-cyan-50 text-cyan-900 shadow-xs' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              Báo Cáo Định Kỳ
            </button>
            <button
              type="button"
              onClick={() => { setReportCategory('plan'); setReportType('Kế hoạch Tháng'); }}
              className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                reportCategory === 'plan' ? 'border-cyan-500 bg-cyan-50 text-cyan-900 shadow-xs' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              Kế Hoạch Công Tác
            </button>
            <button
              type="button"
              onClick={() => { setReportCategory('program'); setReportType('Chương trình Quý'); }}
              className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                reportCategory === 'program' ? 'border-cyan-500 bg-cyan-50 text-cyan-900 shadow-xs' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              Chương Trình Hành Động
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Kỳ báo cáo / Thời gian:</label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="Ví dụ: Tháng 08/2026, Quý III/2026..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-hidden focus:border-cyan-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Tên / Tiêu đề chính thức:</label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-hidden focus:border-cyan-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <span>Chuyển sang Bước 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Connect Data */}
      {step === 2 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 max-w-3xl mx-auto">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Bước 2: Nguồn dữ liệu & Ghi chú bổ sung
          </h3>

          <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-cyan-600" />
              <span>Tự động kết nối dữ liệu từ hệ thống:</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSystemTasks}
                onChange={(e) => setIncludeSystemTasks(e.target.checked)}
                className="rounded text-cyan-600 focus:ring-cyan-500"
              />
              <span className="text-slate-700">Lấy danh sách nhiệm vụ đã hoàn thành trong Bảng Task ({aiWorkspaceService.getTasks().length} công việc)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeContextEvents}
                onChange={(e) => setIncludeContextEvents(e.target.checked)}
                className="rounded text-cyan-600 focus:ring-cyan-500"
              />
              <span className="text-slate-700">Lấy thông tin bối cảnh công tác: "{workspaceContext?.eventName || 'Chiến dịch an sinh'}"</span>
            </label>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Ý thô & Số liệu hoạt động bổ sung:</label>
            <textarea
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              rows={5}
              placeholder="Nhập các số liệu, vụ việc, kết quả nổi bật trong tháng..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed outline-hidden focus:border-cyan-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Quay lại Bước 1
            </button>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Đang tổng hợp báo cáo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Sinh Báo Cáo Ngay (Bước 3)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Result View */}
      {step === 3 && generatedContent && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded">
                Báo cáo hoàn chỉnh
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-1">{reportTitle}</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaved ? 'Đã Lưu' : 'Lưu Báo Cáo'}</span>
              </button>
              <button
                onClick={handleExportWord}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất Word (.docx)</span>
              </button>
            </div>
          </div>

          <textarea
            value={generatedContent}
            onChange={(e) => setGeneratedContent(e.target.value)}
            rows={16}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif text-slate-900 leading-relaxed outline-hidden focus:border-cyan-500 focus:bg-white resize-none"
          />

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-medium">
            💡 <strong>Mẹo kiểm soát dữ liệu:</strong> Các vị trí có nhãn <code>[CHƯA CÓ SỐ LIỆU - CẦN BỔ SUNG]</code> giúp cán bộ nhận biết nhanh các số liệu chưa rõ để bổ sung trước khi trình Lãnh đạo ký.
          </div>
        </div>
      )}
    </div>
  );
};
