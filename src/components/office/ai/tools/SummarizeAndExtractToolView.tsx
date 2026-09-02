import React, { useState } from 'react';
import { 
  AlignLeft, 
  CheckSquare, 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  FileDown, 
  Upload, 
  Clock, 
  Users, 
  FileText,
  Plus
} from 'lucide-react';
import { aiWorkspaceService } from '../../../../lib/aiWorkspaceService';
import { AiDocument } from '../../../../types';

interface SummarizeAndExtractToolViewProps {
  mode: 'summarize' | 'extract_tasks';
  onSaveDocument: (doc: AiDocument) => void;
}

export const SummarizeAndExtractToolView: React.FC<SummarizeAndExtractToolViewProps> = ({
  mode,
  onSaveDocument
}) => {
  const [docTitle, setDocTitle] = useState('Nghị quyết liên tịch và Kế hoạch công tác');
  const [docContent, setDocContent] = useState(`ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM VÀ ỦY BAN NHÂN DÂN PHƯỜNG CHÁNH HIỆP
KẾ HOẠCH LIÊN TỊCH
Về phối hợp thực hiện Cuộc vận động "Toàn dân đoàn kết xây dựng nông thôn mới, đô thị văn minh" năm 2026

I. MỤC ĐÍCH YÊU CẦU:
Nâng cao chất lượng cuộc sống người dân, giữ vững an ninh trật tự, xây dựng phường Chánh Hiệp văn minh, hiện đại.

II. NỘI DUNG VÀ TRÁCH NHIỆM THỰC HIỆN:
1. Ban Thường trực Ủy ban MTTQ Việt Nam Phường:
- Chủ trì hướng dẫn 21 Ban Công tác Mặt trận khu phố tổ chức Ngày hội Đại đoàn kết toàn dân tộc trước ngày 18/11/2026.
- Phối hợp với Công an phường vận động nhân dân lắp đặt camera an ninh tuyến hẻm, hoàn thành trong Quý III/2026.
- Phối hợp Hội Liên hiệp Phụ nữ xây dựng mô hình "Gia đình 5 không, 3 sạch".

2. Ủy ban nhân dân Phường:
- Chỉ đạo Bộ phận Địa chính - Xây dựng kiểm tra xử lý lấn chiếm lòng lề đường trước ngày 30/09/2026.
- Bố trí kinh phí khen thưởng các tập thể, cá nhân tiêu biểu trong ngày hội đại đoàn kết.`);

  // For Summarize
  const [summaryMode, setSummaryMode] = useState<'30s' | 'leader' | 'staff' | 'meeting'>('leader');
  const [summaryResult, setSummaryResult] = useState('');

  // For Extract Tasks
  const [extractedTasks, setExtractedTasks] = useState<any[]>([]);
  const [createdTasks, setCreatedTasks] = useState<Record<string, boolean>>({});

  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) setDocContent(text);
    };
    reader.readAsText(file);
  };

  const handleRun = async () => {
    if (!docContent.trim()) return;
    setIsLoading(true);

    try {
      if (mode === 'summarize') {
        const res = await aiWorkspaceService.callAiTool('summarize', {
          documentText: docContent,
          mode: summaryMode
        });
        if (res && res.result) {
          setSummaryResult(res.result);
        }
      } else {
        const res = await aiWorkspaceService.callAiTool('extract-tasks', {
          documentTitle: docTitle,
          documentText: docContent
        });
        if (res && res.data && res.data.tasks) {
          setExtractedTasks(res.data.tasks);
        }
      }

      // Audit log
      aiWorkspaceService.logAction({
        userId: 'usr_staff',
        userName: 'Cán bộ MTTQ',
        toolId: mode,
        toolName: mode === 'summarize' ? 'Tóm tắt văn bản' : 'Trích xuất nhiệm vụ',
        documentTitle: docTitle,
        action: 'ANALYZE',
        status: 'SUCCESS'
      });
    } catch (err: any) {
      alert(`Lỗi xử lý: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTaskItem = (task: any) => {
    setCreatedTasks(prev => ({ ...prev, [task.id || task.taskName]: true }));
    aiWorkspaceService.logAction({
      userId: 'usr_staff',
      userName: 'Cán bộ MTTQ',
      toolId: 'extract_tasks',
      toolName: 'Trích xuất nhiệm vụ',
      documentTitle: task.taskName,
      action: 'CREATE_TASK',
      status: 'SUCCESS',
      details: `Đơn vị: ${task.assignee}, Hạn: ${task.deadline}`
    });
    alert(`Đã lưu nhiệm vụ: "${task.taskName}" vào sổ theo dõi!`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 p-4 md:p-6 overflow-y-auto space-y-5">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
            mode === 'summarize' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
          }`}>
            {mode === 'summarize' ? <AlignLeft className="w-5 h-5" /> : <CheckSquare className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>{mode === 'summarize' ? 'Tóm Tắt Văn Bản Thông Minh' : 'Đọc Văn Bản → Trích Xuất Nhiệm Vụ'}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                mode === 'summarize' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
              }`}>
                {mode === 'summarize' ? '4 Chế Độ Tóm Tắt' : 'Bảng Đầu Việc'}
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              {mode === 'summarize'
                ? 'Tóm tắt siêu tốc 30 giây, bản Lãnh đạo, cán bộ tham mưu hoặc tài liệu báo cáo cuộc họp.'
                : 'Tự động bóc tách từng đầu việc, người thực hiện, đơn vị phối hợp, hạn và sản phẩm bàn giao.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Tải văn bản (.txt, .doc)</span>
            <input type="file" accept=".txt,.doc,.docx" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={handleRun}
            disabled={isLoading || !docContent.trim()}
            className={`inline-flex items-center gap-2 px-5 py-2 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition-colors ${
              mode === 'summarize' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{mode === 'summarize' ? 'Bắt Đầu Tóm Tắt' : 'Bóc Tách Nhiệm Vụ'}</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher for Summarize */}
      {mode === 'summarize' && (
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-700 px-2">Chế độ tóm tắt:</span>
          {[
            { id: '30s', label: 'Tóm tắt 30 giây (5 điểm cốt lõi)' },
            { id: 'leader', label: 'Bản cho Lãnh đạo (Mấu chốt & Quyết định)' },
            { id: 'staff', label: 'Bản cho Cán bộ (Nhiệm vụ & Căn cứ)' },
            { id: 'meeting', label: 'Báo cáo Cuộc họp (Thuyết trình)' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setSummaryMode(m.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                summaryMode === m.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* Input Content */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
        <div>
          <label className="font-bold text-slate-700 mb-1 block">Tên văn bản:</label>
          <input
            type="text"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-slate-400 focus:bg-white"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 mb-1 block">Nội dung văn bản:</label>
          <textarea
            rows={7}
            value={docContent}
            onChange={(e) => setDocContent(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-sans outline-hidden focus:border-slate-400 focus:bg-white"
          />
        </div>
      </div>

      {/* Summary Output */}
      {mode === 'summarize' && summaryResult && (
        <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Kết quả Tóm Tắt ({summaryMode.toUpperCase()})</span>
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(summaryResult);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed bg-amber-50/40 p-4 rounded-xl border border-amber-100 font-sans">
            {summaryResult}
          </div>
        </div>
      )}

      {/* Extract Tasks Table Output */}
      {mode === 'extract_tasks' && extractedTasks.length > 0 && (
        <div className="bg-white rounded-2xl border border-indigo-200 p-5 shadow-xs space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              <span>Bảng Nhiệm Vụ Đã Trích Xuất ({extractedTasks.length} đầu việc)</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 text-center w-12">STT</th>
                  <th className="p-2.5">Nội dung nhiệm vụ</th>
                  <th className="p-2.5">Người / Đơn vị thực hiện</th>
                  <th className="p-2.5">Đơn vị phối hợp</th>
                  <th className="p-2.5">Thời hạn</th>
                  <th className="p-2.5">Sản phẩm đầu ra</th>
                  <th className="p-2.5 text-center">Lưu việc</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {extractedTasks.map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2.5 text-center font-bold">{idx + 1}</td>
                    <td className="p-2.5 font-semibold text-slate-900">{t.taskName}</td>
                    <td className="p-2.5 text-indigo-700 font-medium">{t.assignee}</td>
                    <td className="p-2.5 text-slate-600">{t.coordinator || '—'}</td>
                    <td className="p-2.5 text-slate-800 font-medium">{t.deadline || 'Chưa rõ'}</td>
                    <td className="p-2.5 text-slate-600">{t.outputDoc || 'Báo cáo'}</td>
                    <td className="p-2.5 text-center">
                      {createdTasks[t.id || t.taskName] ? (
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                          ✓ Đã lưu
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCreateTaskItem(t)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 text-[11px] font-bold rounded-md transition-colors border border-indigo-200"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Tạo việc</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
