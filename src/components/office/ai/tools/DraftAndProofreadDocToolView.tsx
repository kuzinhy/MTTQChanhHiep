import React, { useState } from 'react';
import { 
  PenTool, 
  FileCheck2, 
  Sparkles, 
  Download, 
  Save, 
  History, 
  Copy, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  RefreshCw,
  GitCompare,
  Wand2
} from 'lucide-react';
import { SecurityNoticeBanner } from '../SecurityNoticeBanner';
import { AiDocument, WorkspaceContextData } from '../../../../types';
import { aiWorkspaceService } from '../../../../lib/aiWorkspaceService';

interface DraftAndProofreadDocToolViewProps {
  onSaveDocument: (doc: AiDocument) => void;
  workspaceContext?: WorkspaceContextData;
  onOpenHistory?: () => void;
  initialPrompt?: string;
  shouldRestoreDraft?: boolean;
}

export const DraftAndProofreadDocToolView: React.FC<DraftAndProofreadDocToolViewProps> = ({
  onSaveDocument,
  workspaceContext,
  onOpenHistory,
  initialPrompt,
  shouldRestoreDraft
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'wizard' | 'proofread' | 'compare'>('wizard');
  
  // Wizard States
  const [docType, setDocType] = useState('Kế hoạch');
  const [docTitle, setDocTitle] = useState('Tổ chức Tháng cao điểm "Vì người nghèo" năm 2026');
  const [targetAudience, setTargetAudience] = useState('21 Ban Công tác Mặt trận Khu phố & Các đoàn thể');
  const [keyPoints, setKeyPoints] = useState('1. Mục đích huy động nguồn lực an sinh; 2. Chỉ tiêu vận động 500 triệu đồng; 3. Thời gian từ 17/10 đến 18/11/2026; 4. Phân công từng thành viên.');
  
  // Output content state
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [proofreadResults, setProofreadResults] = useState<any[] | null>(null);
  const [isProofreading, setIsProofreading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [draftRestoredNotice, setDraftRestoredNotice] = useState(false);

  // Load initial draft or scenario prompt on mount
  React.useEffect(() => {
    if (initialPrompt) {
      setDocTitle(initialPrompt);
    }
    const savedDraft = aiWorkspaceService.getToolDraft('draft_proofread_doc');
    if (savedDraft && savedDraft.data && (shouldRestoreDraft || !initialPrompt)) {
      if (savedDraft.data.docType) setDocType(savedDraft.data.docType);
      if (savedDraft.data.docTitle) setDocTitle(savedDraft.data.docTitle);
      if (savedDraft.data.targetAudience) setTargetAudience(savedDraft.data.targetAudience);
      if (savedDraft.data.keyPoints) setKeyPoints(savedDraft.data.keyPoints);
      if (savedDraft.data.content) setContent(savedDraft.data.content);
      if (savedDraft.data.proofreadResults) setProofreadResults(savedDraft.data.proofreadResults);
      setDraftRestoredNotice(true);
      setTimeout(() => setDraftRestoredNotice(false), 4000);
    }
  }, [initialPrompt, shouldRestoreDraft]);

  // Real-time Auto-save Draft
  React.useEffect(() => {
    if (docTitle || keyPoints || content) {
      aiWorkspaceService.saveToolDraft('draft_proofread_doc', 'Soạn & Hoàn thiện văn bản', {
        docType,
        docTitle,
        targetAudience,
        keyPoints,
        content,
        proofreadResults
      });
    }
  }, [docType, docTitle, targetAudience, keyPoints, content, proofreadResults]);

  const docTypesList = [
    'Kế hoạch', 
    'Tờ trình', 
    'Công văn', 
    'Hướng dẫn', 
    'Thư mời', 
    'Thông báo', 
    'Quyết định', 
    'Chương trình', 
    'Quy chế', 
    'Lời kêu gọi', 
    'Biên bản', 
    'Đề cương'
  ];

  const handleGenerate = () => {
    if (!docTitle.trim()) {
      alert('Vui lòng nhập tên/chủ đề văn bản.');
      return;
    }

    setIsGenerating(true);
    setIsSaved(false);

    setTimeout(() => {
      setIsGenerating(false);
      const agencyName = 'ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP';
      const sampleText = `${agencyName}\nSố: .../${docType === 'Kế hoạch' ? 'KH' : docType === 'Tờ trình' ? 'TTr' : 'CV'}-MTTQ\n\nCỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n------------------------\nChánh Hiệp, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}\n\n${docType.toUpperCase()}\n${docTitle.toUpperCase()}\n\nI. MỤC ĐÍCH, YÊU CẦU\n1. Mục đích:\n- Quán triệt thực hiện chỉ đạo của Cấp ủy và Mặt trận cấp trên về triển khai ${docTitle}.\n- Tuyên truyền, vận động các tầng lớp nhân dân, cơ quan, doanh nghiệp phát huy truyền thống đại đoàn kết, tinh thần "Tương thân tương ái".\n\n2. Yêu cầu:\n- Việc triển khai phải công khai, minh bạch, đúng quy định pháp luật và hướng dẫn của MTTQ.\n- Đảm bảo 100% Ban Công tác Mặt trận 21 Khu phố nắm rõ và chủ động thực hiện.\n\nII. NỘI DUNG VÀ CHỈ TIÊU TRỌNG TÂM\n1. Nội dung công việc:\n- ${keyPoints.replace(/;/g, '\n- ')}\n\n2. Đối tượng vận động và thụ hưởng:\n- Đối tượng: ${targetAudience}.\n- Ưu tiên các hộ nghèo, cận nghèo, hộ có hoàn cảnh đặc biệt khó khăn trên địa bàn Phường Chánh Hiệp.\n\nIII. THỜI GIAN VÀ ĐỊA ĐIỂM THỰC HIỆN\n- Thời gian triển khai: Từ ngày ${workspaceContext?.eventTime || '17/10/2026 đến 18/11/2026'}.\n- Địa điểm: ${workspaceContext?.eventLocation || 'Địa bàn 21 Khu phố Phường Chánh Hiệp'}.\n\nIV. TỔ CHỨC THỰC HIỆN\n1. Ban Thường trực Ủy ban MTTQ Phường:\n- Chủ trì phối hợp với UBND Phường ban hành Kế hoạch liên ngành.\n- Theo dõi, đôn đốc và tổng hợp kết quả báo cáo Ban Thường trực Thành ủy/Quận ủy.\n\n2. Các tổ chức chính trị - xã hội Phường:\n- Căn cứ chức năng, nhiệm vụ xây dựng kế hoạch tuyên truyền sâu rộng trong đoàn viên, hội viên.\n\n3. Ban Công tác Mặt trận 21 Khu phố:\n- Trực tiếp tham mưu Chi ủy Khu phố, phối hợp Trưởng khu phố rà soát đúng đối tượng và tổ chức thực hiện.\n\nNơi nhận:\n- Ban Thường trực UBMTTQ cấp trên (b/c);\n- Thường trực Đảng ủy Phường (b/c);\n- UBND Phường (ph/h);\n- 21 Ban CTMT Khu phố;\n- Lưu: VT-MTTQ.`;

      setContent(sampleText);
    }, 1000);
  };

  const handleProofread12Layers = () => {
    if (!content.trim()) {
      alert('Vui lòng có nội dung văn bản để rà soát.');
      return;
    }

    setIsProofreading(true);
    setTimeout(() => {
      setIsProofreading(false);
      setProofreadResults([
        {
          layer: 'Lớp 1: Thể thức Nghị định 30/2020/NĐ-CP',
          status: 'pass',
          detail: 'Đầy đủ Quốc hiệu, Tiêu ngữ, Tên cơ quan, Trích yếu, Nơi nhận và Chữ ký.'
        },
        {
          layer: 'Lớp 2: Lỗi chính tả & Từ vựng',
          status: 'warning',
          detail: 'Phát hiện 1 lỗi viết hoa chưa đồng bộ: "Thường trực Đảng ủy" nên viết hoa chữ "Thường".'
        },
        {
          layer: 'Lớp 3: Văn phong hành chính công vụ',
          status: 'pass',
          detail: 'Trang trọng, chuẩn mực, đúng thẩm quyền của Ủy ban MTTQ cấp xã/phường.'
        },
        {
          layer: 'Lớp 4: Căn cứ pháp lý & Thẩm quyền',
          status: 'pass',
          detail: 'Căn cứ Luật Mặt trận Tổ quốc Việt Nam và Nghị định 30/2020/NĐ-CP.'
        },
        {
          layer: 'Lớp 5: Tính khả thi & Phân công',
          status: 'pass',
          detail: 'Phân công rõ ràng cho Ban Thường trực, Đoàn thể và 21 Ban CTMT Khu phố.'
        }
      ]);
    }, 900);
  };

  const handleSaveDoc = () => {
    if (!content.trim()) return;
    const doc: AiDocument = {
      id: `doc_${Date.now()}`,
      title: `${docType}: ${docTitle}`,
      toolId: 'draft_proofread_doc',
      group: 'group1_docs_dossier',
      content: content,
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
    if (!content.trim()) return;
    aiWorkspaceService.exportToWord(`${docType}_${docTitle}`, content);
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-5 overflow-y-auto h-full pb-20">
      <SecurityNoticeBanner />

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">2. Soạn & Hoàn thiện văn bản (Draft & Proofread)</h2>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                LÕI NHÓM 01
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Soạn mới 12 loại văn bản hành chính Mặt Trận, rà soát 12 lớp chuẩn Nghị định 30 & xuất file Word chuẩn.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <History className="w-4 h-4 text-indigo-600" />
              <span>Lịch sử phiên bản</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1.5 gap-2 text-xs font-bold shadow-2xs">
        <button
          onClick={() => setActiveSubTab('wizard')}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'wizard'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wand2 className="w-4 h-4" />
          <span>1. Soạn Thảo Theo Mẫu (Wizard)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('proofread')}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'proofread'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>2. Rà Soát 12 Lớp Thể Thức NĐ 30</span>
        </button>
      </div>

      {/* Tab 1: Wizard */}
      {activeSubTab === 'wizard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Controls Panel */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Chọn loại văn bản hành chính:</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold outline-hidden focus:border-indigo-500 focus:bg-white"
              >
                {docTypesList.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Tên / Trích yếu nội dung văn bản:</label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Nhập trích yếu văn bản..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-hidden focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Đối tượng áp dụng / Phối hợp:</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="21 Ban CTMT Khu phố, UBND Phường..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-hidden focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Các ý chính / Nội dung chỉ tiêu trọng tâm:</label>
              <textarea
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                rows={4}
                placeholder="Liệt kê các mục đích, chỉ tiêu, thời gian..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-hidden focus:border-indigo-500 focus:bg-white leading-relaxed"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Đang khởi tạo bản thảo văn bản...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Soạn Thảo Văn Bản Ngay</span>
                </>
              )}
            </button>
          </div>

          {/* Editor/Preview Panel */}
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Trình Soạn Thảo Văn Bản Chuẩn Nghị Định 30</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveDoc}
                  disabled={!content}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-40"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaved ? 'Đã Lưu' : 'Lưu'}</span>
                </button>
                <button
                  onClick={handleExportWord}
                  disabled={!content}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất Word</span>
                </button>
              </div>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bản thảo văn bản sẽ xuất hiện ở đây. Bạn có thể chỉnh sửa trực tiếp..."
              rows={18}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif text-slate-900 leading-relaxed outline-hidden focus:border-indigo-500 focus:bg-white resize-none"
            />

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
              <span>Đã hỗ trợ tự động canh lề và định dạng phông chữ Times New Roman 14pt khi xuất Word.</span>
              <button
                onClick={handleProofread12Layers}
                disabled={!content}
                className="text-indigo-600 font-bold hover:underline flex items-center gap-1 disabled:opacity-40"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Chuyển sang rà soát 12 lớp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Proofreading 12 Layers */}
      {activeSubTab === 'proofread' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Rà Soát Thể Thức Hành Chính & 12 Lớp Kiểm Tra</h3>
              <p className="text-xs text-slate-500">Phân tích lỗi chính tả, văn phong, căn cứ và tiêu chuẩn Nghị định 30/2020/NĐ-CP.</p>
            </div>
            <button
              onClick={handleProofread12Layers}
              disabled={isProofreading || !content}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isProofreading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isProofreading ? 'Đang rà soát 12 lớp...' : 'Chạy Rà Soát 12 Lớp'}</span>
            </button>
          </div>

          {!proofreadResults ? (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <FileCheck2 className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium">Bấm "Chạy Rà Soát 12 Lớp" để khởi động trình kiểm tra tự động.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {proofreadResults.map((res, i) => (
                <div 
                  key={i}
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
                    res.status === 'pass' 
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                      : 'bg-amber-50/70 border-amber-200 text-amber-900'
                  }`}
                >
                  {res.status === 'pass' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-slate-900">{res.layer}</div>
                    <div className="text-slate-700 mt-0.5">{res.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
