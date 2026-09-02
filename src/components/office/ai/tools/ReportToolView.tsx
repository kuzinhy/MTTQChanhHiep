import React, { useState } from 'react';
import { 
  FileBarChart2, 
  Sparkles, 
  Loader2, 
  FileText, 
  AlertTriangle, 
  Upload, 
  Check, 
  Copy, 
  FileDown, 
  RotateCcw 
} from 'lucide-react';
import { aiWorkspaceService } from '../../../../lib/aiWorkspaceService';
import { AiContextualEditor } from '../AiContextualEditor';
import { AiDocument } from '../../../../types';

interface ReportToolViewProps {
  onSaveDocument: (doc: AiDocument) => void;
  onOpenHistory?: () => void;
}

const REPORT_TYPES = [
  'Báo cáo Công tác Mặt trận Tháng',
  'Báo cáo Sơ kết Quý',
  'Báo cáo Sơ kết 6 Tháng đầu năm',
  'Báo cáo Tổng kết Năm',
  'Báo cáo Chuyên đề (Giám sát - Phản biện)',
  'Báo cáo Cuộc vận động Quỹ Vì người nghèo',
  'Báo cáo Nhanh Tình hình Dư luận Nhân dân'
];

export const ReportToolView: React.FC<ReportToolViewProps> = ({
  onSaveDocument,
  onOpenHistory
}) => {
  const [reportType, setReportType] = useState('Báo cáo Công tác Mặt trận Tháng');
  const [period, setPeriod] = useState('Tháng 08/2026');
  const [reportTitle, setReportTitle] = useState('Báo cáo Kết quả công tác Mặt trận Tháng 08/2026');
  const [rawNotes, setRawNotes] = useState(`- Đã tổ chức 21 cuộc tiếp xúc cử tri tại 21 khu phố, ghi nhận 45 ý kiến.
- Vận động Quỹ Vì người nghèo được 120 triệu đồng.
- Bàn giao 01 căn nhà Đại đoàn kết cho hộ bà Nguyễn Thị Lan (Khu phố 4).
- Phối hợp UBND dọn dẹp vệ sinh môi trường tuyến rạch Chánh Hiệp.
- Giám sát việc thực hiện chế độ trợ cấp xã hội cho 85 đối tượng bảo trợ.`);
  const [outlineText, setOutlineText] = useState(`I. KẾT QUẢ ĐẠT ĐƯỢC
1. Công tác tuyên truyền, vận động khối đại đoàn kết
2. Phong trào thi đua và an sinh xã hội
3. Công tác giám sát, phản biện xã hội và tiếp công dân
II. ĐÁNH GIÁ CHUNG VÀ TỒN TẠI
III. NHIỆM VỤ TRỌNG TÂM THỜI GIAN TỚI`);
  
  const [isLoading, setIsLoading] = useState(false);
  const [generatedReport, setGeneratedReport] = useState('');

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      const res = await aiWorkspaceService.callAiTool('report', {
        reportType,
        period,
        title: reportTitle,
        rawNotes,
        outlineText
      });

      if (res && res.reportContent) {
        setGeneratedReport(res.reportContent);

        aiWorkspaceService.logAction({
          userId: 'usr_staff',
          userName: 'Cán bộ MTTQ',
          toolId: 'report',
          toolName: 'Trợ lý soạn báo cáo',
          documentTitle: reportTitle,
          action: 'GENERATE',
          status: 'SUCCESS'
        });
      }
    } catch (err: any) {
      alert(`Lỗi soạn báo cáo: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveReport = () => {
    const newDoc: AiDocument = {
      id: `doc_${Date.now()}`,
      title: reportTitle,
      toolId: 'report',
      group: 'group2_report_advisory',
      content: generatedReport,
      ownerId: 'usr_staff',
      ownerName: 'Cán bộ MTTQ',
      status: 'draft',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSaveDocument(newDoc);
    alert('Đã lưu báo cáo vào Kho Tài Liệu Tham Mưu!');
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 p-4 md:p-6 overflow-y-auto space-y-5">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <FileBarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>Trợ Lý Soạn Thảo Báo Cáo</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold uppercase">
                Phát Hiện Thiếu Dữ Liệu
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Tổng hợp từ ghi chú thô, số liệu hoạt động và bám sát đề cương; tự động đánh dấu [THIẾU DỮ LIỆU].
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={isLoading || !rawNotes.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Soạn Báo Cáo Hoàn Chỉnh</span>
        </button>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-600" />
            <span>1. Khai báo thông tin báo cáo</span>
          </h3>

          <div>
            <label className="font-bold text-slate-700 mb-1 block">Loại báo cáo:</label>
            <select
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                setReportTitle(`${e.target.value} ${period}`);
              }}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-purple-500 focus:bg-white"
            >
              {REPORT_TYPES.map((t, idx) => (
                <option key={idx} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 mb-1 block">Kỳ báo cáo:</label>
              <input
                type="text"
                value={period}
                onChange={(e) => {
                  setPeriod(e.target.value);
                  setReportTitle(`${reportType} ${e.target.value}`);
                }}
                placeholder="Tháng 08/2026..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-purple-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 mb-1 block">Tiêu đề báo cáo:</label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-purple-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 mb-1 block">Đề cương báo cáo yêu cầu (Bố cục):</label>
            <textarea
              rows={5}
              value={outlineText}
              onChange={(e) => setOutlineText(e.target.value)}
              placeholder="Dán đề cương các phần I, II, III..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs outline-hidden focus:border-purple-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>2. Ý kiến thô, số liệu & ghi chú hoạt động</span>
            </h3>
            <p className="text-slate-500 text-[11px]">
              Dán các gạch đầu dòng ghi chú kết quả đạt được, số tiền vận động, sự kiện đã làm. AI sẽ tự động hành chính hóa và sắp xếp vào đúng mục.
            </p>
            <textarea
              rows={11}
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              placeholder="Nhập ghi chú thô, số liệu..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans outline-hidden focus:border-purple-500 focus:bg-white"
            />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Mục nào trong đề cương chưa có dữ liệu sẽ được AI đánh dấu <strong>[THIẾU DỮ LIỆU – CẦN BỔ SUNG]</strong>.</span>
          </div>
        </div>
      </div>

      {/* Generated Report Editor */}
      {generatedReport && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-purple-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500 text-white">
                Báo Cáo Đã Soạn Thảo
              </span>
              <h3 className="text-sm font-bold mt-1 text-white">{reportTitle}</h3>
            </div>
            <button
              onClick={handleSaveReport}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Lưu vào Kho Báo Cáo
            </button>
          </div>

          <div className="min-h-[500px]">
            <AiContextualEditor
              title={reportTitle}
              onTitleChange={setReportTitle}
              content={generatedReport}
              onContentChange={setGeneratedReport}
              status="draft"
              version={1}
              onOpenHistory={onOpenHistory}
              onExportWord={() => aiWorkspaceService.exportToWord(reportTitle, generatedReport)}
              onPrint={() => aiWorkspaceService.printDocument(reportTitle, generatedReport)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
