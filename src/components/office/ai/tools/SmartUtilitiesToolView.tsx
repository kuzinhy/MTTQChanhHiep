import React, { useState } from 'react';
import { 
  GitCompare, 
  HelpCircle, 
  TableProperties, 
  ListChecks, 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  Upload, 
  Search, 
  BookOpen, 
  ShieldAlert, 
  CheckSquare, 
  Square,
  FileDown
} from 'lucide-react';
import { aiWorkspaceService } from '../../../../lib/aiWorkspaceService';
import { AiContextualEditor } from '../AiContextualEditor';
import { AiDocument } from '../../../../types';

interface SmartUtilitiesToolViewProps {
  toolId: 'compare_docs' | 'qa_document' | 'work_plan' | 'checklist';
  onSaveDocument: (doc: AiDocument) => void;
  onOpenHistory?: () => void;
}

export const SmartUtilitiesToolView: React.FC<SmartUtilitiesToolViewProps> = ({
  toolId,
  onSaveDocument,
  onOpenHistory
}) => {
  // Compare Docs States
  const [docA, setDocA] = useState(`KẾ HOẠCH NĂM 2025
1. Vận động Quỹ Vì người nghèo đạt 300 triệu.
2. Xây dựng 01 nhà Đại đoàn kết.
3. Tổ chức ngày hội tại 15 khu phố.`);
  const [docB, setDocB] = useState(`KẾ HOẠCH NĂM 2026
1. Vận động Quỹ Vì người nghèo đạt 500 triệu đồng.
2. Xây dựng 02 nhà Đại đoàn kết và sửa chữa 03 nhà tình thương.
3. Tổ chức ngày hội tại 21 khu phố.
4. Bổ sung mô hình phân loại rác thải tại nguồn.`);

  // QA on Doc States
  const [docContext, setDocContext] = useState(`QUY CHẾ HOẠT ĐỘNG CỦA ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP
Điều 5. Chế độ hội họp
1. Ban Thường trực họp thường kỳ mỗi tháng một lần vào tuần đầu tiên của tháng.
2. Ủy ban MTTQ phường họp định kỳ 6 tháng một lần.
3. Hội nghị bất thường triệu tập khi có ít nhất 1/3 tổng số Ủy viên yêu cầu hoặc theo quyết định của Ban Thường trực.

Điều 8. Quản lý Quỹ Vì người nghèo
- Mọi khoản thu chi từ Quỹ phải có phê duyệt bằng văn bản của Trưởng ban vận động Quỹ.
- Định kỳ hằng quý phải công khai thu chi trên bảng tin điện tử phường.`);
  const [question, setQuestion] = useState('Ban Thường trực họp thường kỳ vào thời gian nào và điều kiện để triệu tập họp bất thường là gì?');

  // Work Plan States
  const [planPeriod, setPlanPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [keyObjectives, setKeyObjectives] = useState(`- Phát động Tháng cao điểm Vì người nghèo 2026
- Giám sát việc chi trả trợ cấp người có công
- Hoàn thành tổ chức Ngày hội Đại đoàn kết ở 21 khu phố
- Chuẩn bị báo cáo tổng kết năm 2026`);

  // Checklist States
  const [taskName, setTaskName] = useState('Tổ chức Hội nghị Tiếp xúc Cử tri trước Kỳ họp HĐND');
  const [checklistItems, setChecklistItems] = useState<Array<{ id: number; title: string; category: string; checked: boolean }>>([
    { id: 1, title: 'Ban hành Kế hoạch và Giấy mời đại biểu', category: 'Trước sự kiện', checked: true },
    { id: 2, title: 'Chuẩn bị Maquette, âm thanh, ánh sáng hội trường', category: 'Trước sự kiện', checked: false },
    { id: 3, title: 'Phân công thư ký tổng hợp ý kiến cử tri', category: 'Trước sự kiện', checked: false },
    { id: 4, title: 'Đón tiếp đại biểu và cử tri 21 khu phố', category: 'Trong sự kiện', checked: false },
    { id: 5, title: 'Chủ trì điều hành phần chất vấn và trả lời', category: 'Trong sự kiện', checked: false },
    { id: 6, title: 'Lập biên bản tổng hợp ý kiến gửi HĐND trong 48h', category: 'Sau sự kiện', checked: false }
  ]);

  // Common States
  const [generatedText, setGeneratedText] = useState('');
  const [qaAnswer, setQaAnswer] = useState<any>(null);
  const [compareResult, setCompareResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = async () => {
    setIsLoading(true);
    try {
      if (toolId === 'compare_docs') {
        const res = await aiWorkspaceService.callAiTool('compare-docs', {
          docA,
          docB
        });
        if (res && res.data) {
          setCompareResult(res.data);
          setGeneratedText(res.data.detailedComparison || '');
        }
      } else if (toolId === 'qa_document') {
        const res = await aiWorkspaceService.callAiTool('qa-doc', {
          documentText: docContext,
          question
        });
        if (res && res.data) {
          setQaAnswer(res.data);
          setGeneratedText(res.data.answer || '');
        }
      } else if (toolId === 'work_plan') {
        const res = await aiWorkspaceService.callAiTool('work-plan', {
          period: planPeriod,
          keyObjectives
        });
        if (res && res.planContent) {
          setGeneratedText(res.planContent);
        }
      } else if (toolId === 'checklist') {
        const res = await aiWorkspaceService.callAiTool('checklist', {
          taskName,
          scope: 'Cấp Phường & 21 Khu phố'
        });
        if (res && res.data && res.data.items) {
          const items = res.data.items.map((it: any, idx: number) => ({
            id: idx + 1,
            title: typeof it === 'string' ? it : it.task || it.title,
            category: it.phase || 'Nhiệm vụ',
            checked: false
          }));
          setChecklistItems(items);
        }
      }

      // Log Audit
      aiWorkspaceService.logAction({
        userId: 'usr_staff',
        userName: 'Cán bộ MTTQ',
        toolId,
        toolName: toolId === 'compare_docs' ? 'So sánh 2 văn bản' : toolId === 'qa_document' ? 'Hỏi đáp trên tài liệu' : toolId === 'work_plan' ? 'Lập kế hoạch công tác' : 'Checklist công việc',
        documentTitle: toolId === 'compare_docs' ? 'So sánh văn bản A & B' : toolId === 'qa_document' ? question : toolId === 'work_plan' ? `Kế hoạch ${planPeriod}` : taskName,
        action: 'ANALYZE',
        status: 'SUCCESS'
      });
    } catch (err: any) {
      alert(`Lỗi xử lý: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChecklistItem = (id: number) => {
    setChecklistItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 p-4 md:p-6 overflow-y-auto space-y-5">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            {toolId === 'compare_docs' && <GitCompare className="w-5 h-5" />}
            {toolId === 'qa_document' && <HelpCircle className="w-5 h-5" />}
            {toolId === 'work_plan' && <TableProperties className="w-5 h-5" />}
            {toolId === 'checklist' && <ListChecks className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>
                {toolId === 'compare_docs' && 'So Sánh & Đối Chiếu Hai Văn Bản (Doc A vs Doc B)'}
                {toolId === 'qa_document' && 'Hỏi – Đáp Chính Xác Trên Tài Liệu (Có Trích Dẫn Căn Cứ)'}
                {toolId === 'work_plan' && 'Trợ Lý Lập Ma Trận Kế Hoạch Công Tác (Tuần / Tháng / Năm)'}
                {toolId === 'checklist' && 'Trợ Lý Checklist & Bảng Kiểm Công Việc Chuyên Nghiệp'}
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              {toolId === 'compare_docs' && 'Chỉ rõ nội dung bổ sung mới, điều khoản bị lược bỏ và thay đổi số liệu.'}
              {toolId === 'qa_document' && 'Tuyệt đối chống bịa đặt: Chỉ trả lời dựa trên căn cứ văn bản và trích dẫn điều khoản chính xác.'}
              {toolId === 'work_plan' && 'Lập ma trận phân công 5W1H (Việc gì, ai làm, phối hợp cùng ai, hạn nào, kết quả gì).'}
              {toolId === 'checklist' && 'Bảng kiểm tương tác theo 3 giai đoạn: Trước, Trong và Sau sự kiện.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleRun}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Thực Hiện Nghiệp Vụ</span>
        </button>
      </div>

      {/* Compare Docs Inputs */}
      {toolId === 'compare_docs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <label className="font-bold text-slate-700 block">VĂN BẢN GỐC A (Bản cũ / Cấp trên):</label>
            <textarea
              rows={8}
              value={docA}
              onChange={(e) => setDocA(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-sans outline-hidden focus:border-teal-500 focus:bg-white"
            />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <label className="font-bold text-slate-700 block">VĂN BẢN MỚI B (Dự thảo mới / Cấp dưới):</label>
            <textarea
              rows={8}
              value={docB}
              onChange={(e) => setDocB(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-sans outline-hidden focus:border-teal-500 focus:bg-white"
            />
          </div>
        </div>
      )}

      {/* QA Document Inputs */}
      {toolId === 'qa_document' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 mb-1 block">Tài liệu làm căn cứ (Quy chế, Nghị quyết, Kế hoạch...):</label>
            <textarea
              rows={6}
              value={docContext}
              onChange={(e) => setDocContext(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-sans outline-hidden focus:border-teal-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 mb-1 block">Câu hỏi của cán bộ:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Nhập câu hỏi cần tra cứu..."
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-teal-500 focus:bg-white"
              />
              <button
                onClick={handleRun}
                disabled={isLoading}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" /> Tra cứu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Work Plan Inputs */}
      {toolId === 'work_plan' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Kỳ kế hoạch:</span>
            {[
              { id: 'week', label: 'Lịch tuần' },
              { id: 'month', label: 'Kế hoạch tháng' },
              { id: 'quarter', label: 'Kế hoạch quý' },
              { id: 'year', label: 'Kế hoạch năm' }
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlanPeriod(p.id as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  planPeriod === p.id ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div>
            <label className="font-bold text-slate-700 mb-1 block">Các mục tiêu / sự kiện trọng tâm trong kỳ:</label>
            <textarea
              rows={4}
              value={keyObjectives}
              onChange={(e) => setKeyObjectives(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-sans outline-hidden focus:border-teal-500 focus:bg-white"
            />
          </div>
        </div>
      )}

      {/* Checklist Inputs */}
      {toolId === 'checklist' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 mb-1 block">Tên sự kiện / Chiến dịch cần lập Checklist:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-teal-500 focus:bg-white"
              />
              <button
                onClick={handleRun}
                disabled={isLoading}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> AI Tạo Checklist
              </button>
            </div>
          </div>

          {/* Interactive Checkbox List */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">
                Danh mục kiểm tra ({checklistItems.filter(i => i.checked).length}/{checklistItems.length} hoàn thành)
              </h3>
            </div>

            <div className="space-y-1.5">
              {checklistItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    item.checked
                      ? 'bg-emerald-50/70 border-emerald-200 text-slate-500'
                      : 'bg-white border-slate-200 hover:border-teal-300 text-slate-800 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.checked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className={`text-xs font-medium ${item.checked ? 'line-through text-slate-400' : ''}`}>
                      {item.title}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QA Answer Output */}
      {toolId === 'qa_document' && qaAnswer && (
        <div className="bg-white rounded-2xl border border-teal-200 p-5 shadow-xs space-y-3 animate-fadeIn text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Câu Trả Lời Được Căn Cứ Hóa</span>
            </h3>
            {qaAnswer.confidence && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                Độ chuẩn xác: {qaAnswer.confidence}
              </span>
            )}
          </div>

          <div className="bg-teal-50/60 p-4 rounded-xl border border-teal-100 text-slate-800 font-sans leading-relaxed">
            {qaAnswer.answer}
          </div>

          {qaAnswer.citation && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600">
              <span className="font-bold text-slate-700 block mb-0.5">Trích dẫn căn cứ văn bản:</span>
              <p className="italic font-serif">"{qaAnswer.citation}"</p>
            </div>
          )}
        </div>
      )}

      {/* Work Plan or Compare Output Editor */}
      {generatedText && toolId !== 'qa_document' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-teal-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500 text-white">
                Kết Quả Xử Lý Nghiệp Vụ
              </span>
              <h3 className="text-sm font-bold mt-1 text-white">
                {toolId === 'compare_docs' ? 'Kết quả So sánh đối chiếu' : `Ma trận Kế hoạch ${planPeriod}`}
              </h3>
            </div>
          </div>

          <div className="min-h-[480px]">
            <AiContextualEditor
              title="KetQuaXuLy"
              onTitleChange={() => {}}
              content={generatedText}
              onContentChange={setGeneratedText}
              status="completed"
              version={1}
              onOpenHistory={onOpenHistory}
              onExportWord={() => aiWorkspaceService.exportToWord('KetQua', generatedText)}
              onPrint={() => aiWorkspaceService.printDocument('KetQua', generatedText)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
