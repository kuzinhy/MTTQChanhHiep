import React, { useState } from 'react';
import { 
  FileSearch, 
  Upload, 
  Sparkles, 
  FileText, 
  CheckSquare, 
  Send, 
  Download, 
  Save, 
  History, 
  CheckCircle2, 
  Copy,
  Plus,
  Clock,
  Building2,
  AlertCircle
} from 'lucide-react';
import { SecurityNoticeBanner } from '../SecurityNoticeBanner';
import { AiDocument, WorkspaceContextData } from '../../../../types';
import { aiWorkspaceService } from '../../../../lib/aiWorkspaceService';

interface ReadProcessDocToolViewProps {
  onSaveDocument: (doc: AiDocument) => void;
  workspaceContext?: WorkspaceContextData;
  onOpenHistory?: () => void;
  onNavigateToTask?: () => void;
  initialPrompt?: string;
  shouldRestoreDraft?: boolean;
}

export const ReadProcessDocToolView: React.FC<ReadProcessDocToolViewProps> = ({
  onSaveDocument,
  workspaceContext,
  onOpenHistory,
  onNavigateToTask,
  initialPrompt,
  shouldRestoreDraft
}) => {
  const [inputText, setInputText] = useState('');
  const [docName, setDocName] = useState('Công văn số 128/UBND-VX ngày 25/08/2026');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'tasks' | 'submission'>('summary');
  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load initial draft or prompt
  React.useEffect(() => {
    if (initialPrompt) {
      setDocName(initialPrompt);
    }
    const savedDraft = aiWorkspaceService.getToolDraft('read_process_doc');
    if (savedDraft && savedDraft.data && (shouldRestoreDraft || !initialPrompt)) {
      if (savedDraft.data.docName) setDocName(savedDraft.data.docName);
      if (savedDraft.data.inputText) setInputText(savedDraft.data.inputText);
      if (savedDraft.data.analysisResult) setAnalysisResult(savedDraft.data.analysisResult);
    }
  }, [initialPrompt, shouldRestoreDraft]);

  // Real-time Auto-save Draft
  React.useEffect(() => {
    if (docName || inputText || analysisResult) {
      aiWorkspaceService.saveToolDraft('read_process_doc', 'Đọc & Xử lý văn bản', {
        docName,
        inputText,
        analysisResult
      });
    }
  }, [docName, inputText, analysisResult]);

  const handleAnalyze = () => {
    if (!inputText.trim() && !docName) {
      alert('Vui lòng nhập nội dung hoặc tên văn bản cần đọc xử lý.');
      return;
    }

    setIsAnalyzing(true);
    setIsSaved(false);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        metadata: {
          docNumber: '128/UBND-VX',
          issueDate: '25/08/2026',
          issuer: 'Ủy ban nhân dân Phường Chánh Hiệp',
          title: 'Về việc phối hợp triển khai Tháng cao điểm "Vì người nghèo" và chăm lo An sinh xã hội cuối năm 2026',
          docType: 'Công văn chỉ đạo phối hợp liên ngành'
        },
        summaries: {
          sec30: 'Chỉ đạo MTTQ và các đoàn thể phối hợp UBND Phường tổ chức Tháng cao điểm "Vì người nghèo" từ 17/10 đến 18/11/2026, phấn đấu vận động 500 triệu đồng Quỹ An sinh.',
          leadership: 'Công văn yêu cầu Ủy ban MTTQ Phường làm Thường trực Ban vận động: (1) Trình Kế hoạch liên ngành trước 15/09; (2) Rà soát 120 hộ khó khăn; (3) Phối hợp 21 Khu phố tổ chức Ngày hội Đại đoàn kết.',
          detailed: 'I. MỤC TIÊU: Huy động sức mạnh toàn dân chăm lo người nghèo, hộ khó khăn trên địa bàn.\nII. CHỈ TIÊU: Vận động Quỹ "Vì người nghèo" đạt 500 triệu đồng; Xây/sửa 05 nhà Đại đoàn kết; Tặng 300 phần quà Tết.\nIII. PHÂN CÔNG: MTTQ chủ trì vận động; UBND hỗ trợ trích ngân sách đối ứng; Các đoàn thể phụ trách phụ trách từng chỉ tiêu cụ thể.\nIV. TIẾN ĐỘ: Gửi báo cáo kết quả trước ngày 25/11/2026.'
        },
        tasks: [
          {
            id: 't1',
            title: 'Soạn thảo Kế hoạch liên ngành phối hợp tổ chức Tháng cao điểm',
            assignedTo: 'Ban Thường trực MTTQ & UBND Phường',
            dueDate: '2026-09-15',
            priority: 'Cao'
          },
          {
            id: 't2',
            title: 'Rà soát danh sách 120 hộ nghèo, cận nghèo, hoàn cảnh đặc biệt khó khăn',
            assignedTo: '21 Ban Công tác Mặt trận Khu phố',
            dueDate: '2026-09-20',
            priority: 'Cao'
          },
          {
            id: 't3',
            title: 'Phát động thư ngỏ kêu gọi doanh nghiệp, nhà hào tâm ủng hộ Quỹ',
            assignedTo: 'Ban Vận động Quỹ Vì người nghèo',
            dueDate: '2026-10-01',
            priority: 'Trung bình'
          }
        ],
        submissionDraft: `PHIẾU TRÌNH XỬ LÝ VĂN BẢN
Kính trình: Ban Thường trực Ủy ban MTTQ Việt Nam Phường Chánh Hiệp.

1. TRÍCH YẾU VĂN BẢN:
Công văn số 128/UBND-VX ngày 25/08/2026 của UBND Phường về phối hợp triển khai Tháng cao điểm "Vì người nghèo" năm 2026.

2. Ý KIẾN THAM MƯU DỰ THẢO:
- Thống nhất chủ trương phối hợp với UBND Phường triển khai Tháng cao điểm từ 17/10 - 18/11/2026.
- Giao Văn phòng MTTQ chủ trì soạn Kế hoạch phối hợp trình Chủ tịch ký ban hành trước ngày 12/09/2026.
- Đề nghị phân công đồng chí Phó Chủ tịch phụ trách chỉ đạo 21 Khu phố rà soát đúng đối tượng thụ hưởng.`
      });
    }, 1200);
  };

  const handleSaveDoc = () => {
    if (!analysisResult) return;
    const fullContent = `TRÍCH YẾU: ${analysisResult.metadata.title}\n\nTÓM TẮT CỐT LÕI:\n${analysisResult.summaries.sec30}\n\nPHIẾU TRÌNH:\n${analysisResult.submissionDraft}`;
    const doc: AiDocument = {
      id: `doc_${Date.now()}`,
      title: `Hồ sơ xử lý: ${analysisResult.metadata.title}`,
      toolId: 'read_process_doc',
      group: 'group1_docs_dossier',
      content: fullContent,
      ownerId: 'usr_01',
      ownerName: 'Cán bộ MTTQ',
      status: 'completed',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSaveDocument(doc);
    setIsSaved(true);
    setSaveMessage('Đã lưu hồ sơ phân tích vào kho tài liệu!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleExportWord = () => {
    if (!analysisResult) return;
    aiWorkspaceService.exportToWord(
      `HỒ SƠ PHÂN TÍCH - ${analysisResult.metadata.docNumber}`,
      `# HỒ SƠ PHÂN TÍCH VĂN BẢN\n\n## I. THÔNG TIN VĂN BẢN\n- **Số/Ký hiệu:** ${analysisResult.metadata.docNumber}\n- **Cơ quan ban hành:** ${analysisResult.metadata.issuer}\n- **Trích yếu:** ${analysisResult.metadata.title}\n\n## II. TÓM TẮT DÀNH CHO LÃNH ĐẠO\n${analysisResult.summaries.leadership}\n\n## III. PHIẾU TRÌNH LÃNH ĐẠO\n${analysisResult.submissionDraft}`
    );
  };

  const handleCreateTasksBatch = () => {
    if (!analysisResult?.tasks) return;
    analysisResult.tasks.forEach((t: any) => {
      aiWorkspaceService.saveTask({
        id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        title: t.title,
        description: `Bóc tách từ ${analysisResult.metadata.docNumber}: ${analysisResult.metadata.title}`,
        sourceDoc: analysisResult.metadata.docNumber,
        assignedTo: t.assignedTo,
        dueDate: t.dueDate,
        priority: t.priority === 'Cao' ? 'high' : 'medium',
        status: 'pending',
        progress: 0,
        createdAt: new Date().toISOString()
      });
    });
    alert('Đã chuyển toàn bộ 3 nhiệm vụ trích xuất vào Bảng theo dõi tiến độ công việc!');
    if (onNavigateToTask) onNavigateToTask();
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-5 overflow-y-auto h-full pb-20">
      <SecurityNoticeBanner />

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <FileSearch className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">1. Đọc & Xử lý văn bản (Document Dossier)</h2>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                LÕI NHÓM 01
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tải file hoặc dán văn bản để AI tạo trọn gói: Tóm tắt 3 mức, Trích nhiệm vụ & Dự thảo Phiếu trình.
            </p>
          </div>
        </div>

        {onOpenHistory && (
          <button
            onClick={onOpenHistory}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <History className="w-4 h-4 text-blue-600" />
            <span>Lịch sử hồ sơ</span>
          </button>
        )}
      </div>

      {/* Input Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Tên / Số hiệu văn bản đầu vào:</label>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="Ví dụ: Kế hoạch 45/KH-UBND ngày 12/08/2026..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Hoặc tải file tài liệu đính kèm:</label>
            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-dashed border-blue-300 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span>Chọn file Word / PDF</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setDocName(e.target.files[0].name);
                      setInputText(`[Nội dung trích xuất tự động từ file ${e.target.files[0].name}]: Kế hoạch phối hợp triển khai các hoạt động an sinh xã hội...`);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 mb-1.5 block">Nội dung văn bản (hoặc trích đoạn quan trọng):</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            placeholder="Dán toàn bộ hoặc trích đoạn nội dung văn bản chỉ đạo của cấp trên vào đây..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white font-sans leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-400">
            Dữ liệu bối cảnh: <strong className="text-slate-600">{workspaceContext?.eventName || 'Mặt trận Phường'}</strong>
          </span>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Đang phân tích & xử lý hồ sơ...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Đọc & Xử Lý Văn Bản Ngay</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Output Section */}
      {analysisResult && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden space-y-0">
          {/* Header Bar */}
          <div className="p-4 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-500/20 text-cyan-300 rounded border border-cyan-400/30">
                  {analysisResult.metadata.docType}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {analysisResult.metadata.docNumber} • {analysisResult.metadata.issueDate}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1">
                {analysisResult.metadata.title}
              </h3>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSaveDoc}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaved ? 'Đã Lưu' : 'Lưu Hồ Sơ'}</span>
              </button>
              <button
                onClick={handleExportWord}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất Word (.docx)</span>
              </button>
            </div>
          </div>

          {saveMessage && (
            <div className="bg-emerald-50 text-emerald-800 px-4 py-2 text-xs font-bold border-b border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{saveMessage}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
                activeTab === 'summary'
                  ? 'bg-white text-blue-700 border-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 border-transparent'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Tóm Tắt 3 Mức</span>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
                activeTab === 'tasks'
                  ? 'bg-white text-blue-700 border-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 border-transparent'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Bóc Tách Nhiệm Vụ ({analysisResult.tasks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('submission')}
              className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
                activeTab === 'submission'
                  ? 'bg-white text-blue-700 border-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 border-transparent'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Dự Thảo Phiếu Trình</span>
            </button>
          </div>

          {/* Tab 1: Summaries */}
          {activeTab === 'summary' && (
            <div className="p-5 space-y-4">
              <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>1. Tóm Tắt Nhanh 30 Giây:</span>
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {analysisResult.summaries.sec30}
                </p>
              </div>

              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>2. Báo Cáo Cho Lãnh Đạo (Bản Trình Báo Cáo):</span>
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed whitespace-pre-line">
                  {analysisResult.summaries.leadership}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                  <span>3. Tóm Tắt Chi Tiết Các Phần Cốt Lõi:</span>
                </div>
                <p className="text-xs text-slate-700 font-mono leading-relaxed whitespace-pre-line">
                  {analysisResult.summaries.detailed}
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Tasks */}
          {activeTab === 'tasks' && (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Danh sách đầu việc đã tự động bóc tách từ văn bản:
                </h4>
                <button
                  onClick={handleCreateTasksBatch}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Chuyển cả 3 việc vào Bảng Tiến Độ</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">STT</th>
                      <th className="p-3">Nội dung nhiệm vụ</th>
                      <th className="p-3">Đơn vị / Cán bộ phụ trách</th>
                      <th className="p-3">Thời hạn</th>
                      <th className="p-3 text-center">Ưu tiên</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {analysisResult.tasks.map((t: any, idx: number) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-semibold text-slate-900">{t.title}</td>
                        <td className="p-3 text-blue-700 font-medium">{t.assignedTo}</td>
                        <td className="p-3 font-mono text-slate-600">{t.dueDate}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.priority === 'Cao' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {t.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Submission Draft */}
          {activeTab === 'submission' && (
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Dự thảo Phiếu trình Lãnh đạo xử lý văn bản:
                </h4>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(analysisResult.submissionDraft);
                    alert('Đã sao chép nội dung Phiếu trình!');
                  }}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép</span>
                </button>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 font-serif text-sm text-slate-900 whitespace-pre-line leading-relaxed shadow-inner">
                {analysisResult.submissionDraft}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
