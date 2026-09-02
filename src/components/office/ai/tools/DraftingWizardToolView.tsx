import React, { useState } from 'react';
import { 
  PenTool, 
  Sparkles, 
  Loader2, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  ShieldAlert, 
  Upload, 
  FileText, 
  FileCheck,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { aiWorkspaceService } from '../../../../lib/aiWorkspaceService';
import { AiContextualEditor } from '../AiContextualEditor';
import { AiDocument, WorkspaceContextData } from '../../../../types';

interface DraftingWizardToolViewProps {
  onSaveDocument: (doc: AiDocument) => void;
  workspaceContext: WorkspaceContextData;
  onOpenHistory?: () => void;
}

const DOCUMENT_TYPES = [
  { id: 'Kế hoạch', name: 'Kế hoạch', desc: 'Kế hoạch hành động, tổ chức ngày hội, phong trào thi đua' },
  { id: 'Báo cáo', name: 'Báo cáo', desc: 'Báo cáo định kỳ tuần, tháng, quý, năm, chuyên đề' },
  { id: 'Tờ trình', name: 'Tờ trình', desc: 'Tờ trình xin chủ trương, kinh phí, phê duyệt đề án' },
  { id: 'Công văn', name: 'Công văn', desc: 'Công văn trao đổi, phối hợp công tác với ban ngành' },
  { id: 'Thông báo', name: 'Thông báo', desc: 'Thông báo kết luận, phân công, lịch làm việc' },
  { id: 'Hướng dẫn', name: 'Hướng dẫn', desc: 'Hướng dẫn nghiệp vụ cho 21 Ban CTMT Khu phố' },
  { id: 'Quyết định', name: 'Quyết định', desc: 'Quyết định thành lập đoàn kiểm tra, khen thưởng' },
  { id: 'Chương trình', name: 'Chương trình', desc: 'Chương trình phối hợp thống nhất hành động' },
  { id: 'Thư mời', name: 'Thư mời / Giấy mời', desc: 'Giấy mời hội nghị, tiếp xúc cử tri, họp mặt' },
  { id: 'Thư ngỏ', name: 'Thư ngỏ vận động', desc: 'Thư ngỏ vận động ủng hộ Quỹ Vì người nghèo' },
  { id: 'Biên bản', name: 'Biên bản cuộc họp', desc: 'Biên bản ghi nhận diễn biến và kết luận họp' },
  { id: 'Quy chế', name: 'Quy chế hoạt động', desc: 'Quy chế làm việc, phối hợp liên ngành' }
];

const STYLES = [
  { id: 'Hành chính chuẩn', name: 'Hành chính chuẩn mực (Nghị định 30)', desc: 'Ngôn từ chuẩn xác, đúng khuôn phép thể thức nhà nước' },
  { id: 'Chỉ đạo điều hành', name: 'Chỉ đạo & Điều hành quyết liệt', desc: 'Nhấn mạnh trách nhiệm, thời hạn và sản phẩm đầu ra' },
  { id: 'Vận động quần chúng', name: 'Vận động quần chúng gần gũi', desc: 'Đầm ấm, gần gũi với nhân dân, khơi dậy tinh thần đại đoàn kết' },
  { id: 'Trang trọng ngoại giao', name: 'Trang trọng & Nghi lễ', desc: 'Dành cho thư mời, phát biểu đại biểu cấp cao' },
  { id: 'Tóm lược súc tích', name: 'Tóm lược & Ngắn gọn', desc: 'Dành cho thông báo nhanh, phiếu giao việc' },
  { id: 'Phản biện sắc sảo', name: 'Phản biện & Đóng góp ý kiến', desc: 'Lập luận chặt chẽ, dẫn chứng rõ ràng, mang tính xây dựng' },
  { id: 'Tổng kết thi đua', name: 'Biểu dương & Thi đua', desc: 'Khích lệ, tôn vinh các gương sáng và mô hình tiêu biểu' },
  { id: 'Tuyên truyền cơ sở', name: 'Truyền thông đại chúng', desc: 'Dễ nhớ, dễ hiểu, phù hợp phổ biến cho bà con khu phố' }
];

export const DraftingWizardToolView: React.FC<DraftingWizardToolViewProps> = ({
  onSaveDocument,
  workspaceContext,
  onOpenHistory
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedDocType, setSelectedDocType] = useState<string>('Kế hoạch');
  const [selectedStyle, setSelectedStyle] = useState<string>('Hành chính chuẩn');

  // Dynamic Form Fields
  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState('');
  const [contentItems, setContentItems] = useState('');
  const [timeLocation, setTimeLocation] = useState('');
  const [assignments, setAssignments] = useState('');
  const [budgetNotes, setBudgetNotes] = useState('');
  const [customNotes, setCustomNotes] = useState('');

  // Reference Document text
  const [referenceText, setReferenceText] = useState('');
  const [referenceFileName, setReferenceFileName] = useState('');

  // Generated Draft
  const [draftContent, setDraftContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReferenceFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) setReferenceText(text);
    };
    reader.readAsText(file);
  };

  const handleGenerateDraft = async () => {
    setIsLoading(true);
    try {
      const res = await aiWorkspaceService.callAiTool('draft', {
        docType: selectedDocType,
        style: selectedStyle,
        fields: {
          title: title || `Dự thảo ${selectedDocType}`,
          purpose,
          contentItems,
          timeLocation: timeLocation || workspaceContext.eventTime,
          assignments: assignments || workspaceContext.unitCoordinating,
          budgetNotes,
          customNotes
        },
        referenceDocText: referenceText,
        customPrompt: customNotes,
        workspaceContext
      });

      if (res && res.draftContent) {
        setDraftContent(res.draftContent);
        setCurrentStep(5);

        // Audit Log
        aiWorkspaceService.logAction({
          userId: 'usr_staff',
          userName: 'Cán bộ MTTQ',
          toolId: 'draft_doc',
          toolName: 'Trợ lý soạn thảo văn bản',
          documentTitle: title || `Dự thảo ${selectedDocType}`,
          action: 'GENERATE',
          status: 'SUCCESS'
        });
      }
    } catch (err: any) {
      alert(`Lỗi tạo dự thảo: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = () => {
    const newDoc: AiDocument = {
      id: `doc_${Date.now()}`,
      title: title || `Dự thảo ${selectedDocType}`,
      toolId: 'draft_doc',
      group: 'group1_draft_proofread',
      content: draftContent,
      ownerId: 'usr_staff',
      ownerName: 'Cán bộ MTTQ',
      status: 'draft',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSaveDocument(newDoc);
    alert('Đã lưu dự thảo vào Kho Tài Liệu Tham Mưu!');
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 p-4 md:p-6 overflow-y-auto space-y-5">
      {/* Top Header & Step Indicator */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>Trợ Lý Soạn Thảo Văn Bản (Wizard 5 Bước)</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold uppercase">
                  Bước {currentStep}/5
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Quy trình chuẩn hóa từ chọn loại văn bản, nhập thông số, chọn phong cách đến sinh DỰ THẢO LẦN 1.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((step) => (
              <button
                key={step}
                onClick={() => (step < currentStep || draftContent) && setCurrentStep(step)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  currentStep === step
                    ? 'bg-blue-600 text-white shadow-xs'
                    : currentStep > step
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-400'
                }`}
              >
                {currentStep > step ? '✓' : step}
              </button>
            ))}
          </div>
        </div>

        {/* Anti-hallucination banner note */}
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Nguyên tắc chống bịa đặt:</strong> AI sẽ không tự tạo số liệu hay ngày tháng khống. Các phần thiếu sẽ được đánh dấu rõ bằng <code className="bg-white px-1.5 py-0.5 rounded-sm font-bold text-red-600">[CẦN BỔ SUNG]</code> để cán bộ kiểm duyệt.
          </span>
        </div>
      </div>

      {/* Step 1: Choose Document Type */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Bước 1: Chọn loại văn bản cần soạn thảo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {DOCUMENT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedDocType(type.id)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedDocType === type.id
                    ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-sm text-slate-800 mb-1">{type.name}</div>
                <div className="text-xs text-slate-500">{type.desc}</div>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              <span>Tiếp tục Bước 2 (Nhập thông số)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Dynamic Form Fields */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Bước 2: Khai báo thông số cho {selectedDocType}
            </h3>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
              Loại: {selectedDocType}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 mb-1 block">Tên / Trích yếu văn bản *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`Ví dụ: Kế hoạch Tổ chức Ngày hội Đại đoàn kết toàn dân tộc năm 2026...`}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-blue-500 focus:bg-white text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 mb-1 block">Mục đích & Yêu cầu trọng tâm</label>
              <textarea
                rows={2}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Nêu mục tiêu cụ thể, phát huy sức mạnh khối đại đoàn kết, tạo không khí phấn khởi..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-blue-500 focus:bg-white text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 mb-1 block">Nội dung / Hoạt động chính cần triển khai</label>
              <textarea
                rows={3}
                value={contentItems}
                onChange={(e) => setContentItems(e.target.value)}
                placeholder="1. Tuyên truyền truyền thống Mặt trận; 2. Phần Lễ và Phần Hội; 3. Khen thưởng gia đình văn hóa tiêu biểu; 4. Thăm tặng quà hộ nghèo..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-blue-500 focus:bg-white text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 mb-1 block">Thời gian & Địa điểm thực hiện</label>
              <input
                type="text"
                value={timeLocation}
                onChange={(e) => setTimeLocation(e.target.value)}
                placeholder="Ví dụ: Tháng 11/2026 tại 21 Nhà Văn hóa Khu phố..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-blue-500 focus:bg-white text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 mb-1 block">Phân công phối hợp & Thực hiện</label>
              <input
                type="text"
                value={assignments}
                onChange={(e) => setAssignments(e.target.value)}
                placeholder="UBND Phường, 21 Ban Công tác Mặt trận, Đoàn thanh niên..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-blue-500 focus:bg-white text-xs"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <span>Tiếp tục Bước 3 (Chọn phong cách)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Choose Style */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Bước 3: Chọn phong cách diễn đạt văn bản
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {STYLES.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStyle(st.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedStyle === st.id
                    ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-sm text-slate-800 mb-1">{st.name}</div>
                <div className="text-xs text-slate-500">{st.desc}</div>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <span>Tiếp tục Bước 4 (Tài liệu tham chiếu)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Reference Documents & Anti-hallucination Safeguard */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Bước 4: Cung cấp tài liệu tham chiếu & Căn cứ cấp trên (Tùy chọn)
          </h3>

          <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center space-y-2">
            <Upload className="w-8 h-8 mx-auto text-slate-400" />
            <div className="text-xs text-slate-600 font-medium">
              {referenceFileName ? `Tệp đã chọn: ${referenceFileName}` : 'Tải lên văn bản chỉ đạo của Quận/Thành phố hoặc văn bản năm trước'}
            </div>
            <label className="inline-block cursor-pointer px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100">
              Chọn tệp (.txt, .doc)
              <input type="file" accept=".txt,.doc,.docx" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">Hoặc dán căn cứ pháp lý / nội dung tài liệu tham chiếu:</label>
            <textarea
              rows={5}
              value={referenceText}
              onChange={(e) => setReferenceText(e.target.value)}
              placeholder="Dán nội dung hướng dẫn cấp trên, số văn bản, các mốc thời gian quy định..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:border-blue-500 focus:bg-white font-sans"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">Ghi chú yêu cầu bổ sung cho AI:</label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Ví dụ: Bổ sung thêm mục trách nhiệm của Trưởng Ban Công tác Mặt trận..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-hidden focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <button
              onClick={handleGenerateDraft}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Bước 5: Sinh Dự Thảo Lần 1</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Draft Result & Contextual Editor */}
      {currentStep === 5 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-emerald-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white">
                  Dự Thảo Lần 1
                </span>
                <span className="text-xs text-emerald-200">Đã áp dụng phong cách: {selectedStyle}</span>
              </div>
              <p className="text-xs text-slate-200">
                Bạn có thể trực tiếp gõ chỉnh sửa, bôi đen văn bản để gọi menu ✨ AI, hoặc yêu cầu Copilot hoàn thiện.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-lg transition-colors"
              >
                Cấu hình lại
              </button>
              <button
                onClick={handleSaveDraft}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                Lưu vào Hồ Sơ
              </button>
            </div>
          </div>

          <div className="min-h-[550px]">
            <AiContextualEditor
              title={title || `Dự thảo ${selectedDocType}`}
              onTitleChange={setTitle}
              content={draftContent}
              onContentChange={setDraftContent}
              status="draft"
              version={1}
              onOpenHistory={onOpenHistory}
              onExportWord={() => aiWorkspaceService.exportToWord(title || 'DuThao', draftContent)}
              onPrint={() => aiWorkspaceService.printDocument(title || 'DuThao', draftContent)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
