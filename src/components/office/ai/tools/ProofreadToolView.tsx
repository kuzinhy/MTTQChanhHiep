import React, { useState } from 'react';
import { 
  FileCheck2, 
  Sparkles, 
  Loader2, 
  Check, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  FileDown, 
  Printer, 
  RotateCcw, 
  Layers, 
  Wand2,
  FileText,
  Upload,
  ArrowRight
} from 'lucide-react';
import { aiWorkspaceService } from '../../../../lib/aiWorkspaceService';
import { AiContextualEditor } from '../AiContextualEditor';
import { AiDocument } from '../../../../types';

interface ProofreadToolViewProps {
  onSaveDocument: (doc: AiDocument) => void;
  onOpenHistory?: () => void;
}

export const ProofreadToolView: React.FC<ProofreadToolViewProps> = ({
  onSaveDocument,
  onOpenHistory
}) => {
  const [docTitle, setDocTitle] = useState('Dự thảo Kế hoạch Hoạt động');
  const [inputContent, setInputContent] = useState(`ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM
PHƯỜNG CHÁNH HIỆP
Số:   /KH-MTTQ

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc

Chánh Hiệp, ngày    tháng    năm 2026

KẾ HOẠCH
Tổ chức Ngày hội Đại đoàn kết toàn dân tộc năm 2026

Thực hiện hướng dẫn của cấp trên về việc tổ chức ngày hội đại đoàn kết.
Nay Ban thường trực xây dựng kế hoạch triển khai cho 21 khu phố.

I. MỤC ĐÍCH YÊU CẦU
1. Tuyên truyền sâu rộng trong bà con nhân dân về truyền thống vẽ vang của Mặt trận.
2. Động viên nhân dân tham gia các phong trào thi đua yêu nước, giúp nhau phát triển kinh tế xóa đói giảm nghèo.
3. Tổ chức ngày hội đảm bảo vui tươi, tiết kiệm và an toàn.

II. NỘI DUNG VÀ THỜI GIAN
- Thời gian: Dự kiến trong tháng 11/2026.
- Địa điểm: Tại các văn phòng khu phố.
- Thành phần: Mời đại biểu cấp trên, lãnh đạo địa phương và toàn thể nhân dân.`);

  const [activeTab, setActiveTab] = useState<'input' | 'results' | 'editor'>('input');
  const [activeLayer, setActiveLayer] = useState<'layer1' | 'layer2' | 'layer3'>('layer1');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [currentText, setCurrentText] = useState('');
  const [acceptedChanges, setAcceptedChanges] = useState<Record<string, boolean>>({});

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        setInputContent(text);
        setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsText(file);
  };

  const handleRunProofread = async () => {
    if (!inputContent.trim()) return;
    setIsLoading(true);

    try {
      const res = await aiWorkspaceService.callAiTool('proofread', {
        title: docTitle,
        content: inputContent
      });

      if (res && res.data) {
        setAnalysisResult(res.data);
        setCurrentText(res.data.correctedFullText || inputContent);
        setActiveTab('results');

        // Log audit
        aiWorkspaceService.logAction({
          userId: 'usr_staff',
          userName: 'Cán bộ MTTQ',
          toolId: 'proofread',
          toolName: 'Kiểm tra & Hoàn thiện văn bản',
          documentTitle: docTitle,
          action: 'PROOFREAD',
          status: 'SUCCESS'
        });
      }
    } catch (err: any) {
      alert(`Lỗi kiểm tra văn bản: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptAll = () => {
    if (analysisResult?.correctedFullText) {
      setCurrentText(analysisResult.correctedFullText);
      setActiveTab('editor');
    }
  };

  const handleSave = () => {
    const newDoc: AiDocument = {
      id: `doc_${Date.now()}`,
      title: docTitle,
      toolId: 'proofread',
      group: 'group1_draft_proofread',
      content: currentText || inputContent,
      originalContent: inputContent,
      ownerId: 'usr_staff',
      ownerName: 'Cán bộ MTTQ',
      status: 'refining',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSaveDocument(newDoc);
    alert('Đã lưu văn bản vào Kho Tài Liệu Tham Mưu thành công!');
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 p-4 md:p-6 overflow-y-auto space-y-5">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>Kiểm Tra & Hoàn Thiện Văn Bản</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase">
                3 Lớp Kiểm Định
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Kiểm tra Chính tả • Văn phong Hành chính • Thể thức 15 tiêu chí (Nghị định 30/2020/NĐ-CP)
            </p>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('input')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'input' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Văn bản gốc
          </button>
          <button
            onClick={() => setActiveTab('results')}
            disabled={!analysisResult}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'results' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-400 disabled:opacity-50'
            }`}
          >
            Kết quả 3 Lớp {analysisResult && `(${analysisResult.overallScore}/100)`}
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'editor' ? 'bg-white text-red-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Trình soạn thảo & Sửa
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'input' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[280px]">
              <label className="text-xs font-bold text-slate-700 mb-1 block">Tên văn bản / Trích yếu:</label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Nhập tên văn bản..."
                className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Tải tệp (.txt, .doc)</span>
                <input type="file" accept=".txt,.doc,.docx" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                onClick={handleRunProofread}
                disabled={isLoading || !inputContent.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Bắt đầu kiểm tra 3 Lớp</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">Dán nội dung văn bản cần kiểm tra:</label>
            <textarea
              rows={16}
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Dán nội dung văn bản tại đây..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans leading-relaxed outline-hidden focus:border-emerald-500 focus:bg-white"
            />
          </div>
        </div>
      )}

      {activeTab === 'results' && analysisResult && (
        <div className="space-y-4">
          {/* Summary & Score Banner */}
          <div className="bg-emerald-900 text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white">
                  Điểm Thể Thức: {analysisResult.overallScore}/100
                </span>
                <span className="text-xs text-emerald-200">Đã kiểm tra toàn diện 3 lớp</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed max-w-2xl">
                {analysisResult.summary}
              </p>
              {analysisResult.legalWarning && (
                <div className="text-[11px] text-amber-300 font-medium flex items-center gap-1.5 mt-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{analysisResult.legalWarning}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleAcceptAll}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Chấp nhận tất cả & Mở Soạn thảo</span>
              </button>
            </div>
          </div>

          {/* 3 Layer Navigation Tabs */}
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveLayer('layer1')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeLayer === 'layer1'
                  ? 'bg-red-100 text-red-800 shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Lớp 1: Chính tả & Ngữ pháp ({analysisResult.layer1_spelling?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveLayer('layer2')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeLayer === 'layer2'
                  ? 'bg-amber-100 text-amber-800 shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Lớp 2: Văn phong Hành chính ({analysisResult.layer2_admin_tone?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveLayer('layer3')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeLayer === 'layer3'
                  ? 'bg-blue-100 text-blue-800 shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Lớp 3: Thể thức 15 Tiêu chí NĐ 30 ({analysisResult.layer3_checklist?.length || 0})</span>
            </button>
          </div>

          {/* Layer 1: Spelling & Grammar Issues */}
          {activeLayer === 'layer1' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Phát hiện lỗi chính tả, dấu câu, viết hoa, lặp từ
              </h3>

              <div className="space-y-2.5">
                {analysisResult.layer1_spelling?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-red-50/50 border border-red-100 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded-sm bg-red-200 text-red-800 font-bold text-[10px] uppercase">
                          {item.type || 'Lỗi'}
                        </span>
                        <span className="text-slate-500">{item.reason}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="line-through text-red-600 bg-red-100 px-2 py-0.5 rounded-sm font-medium">
                          {item.original}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm font-bold">
                          {item.proposed}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {(!analysisResult.layer1_spelling || analysisResult.layer1_spelling.length === 0) && (
                  <div className="p-6 text-center text-xs text-slate-500">
                    Không phát hiện lỗi chính tả hay dấu câu cơ bản nào.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Layer 2: Admin Tone Proposals */}
          {activeLayer === 'layer2' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Đề xuất chuẩn hóa văn phong hành chính nhà nước
              </h3>

              <div className="space-y-2.5">
                {analysisResult.layer2_admin_tone?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl flex flex-col gap-2 text-xs"
                  >
                    <div className="text-[11px] font-semibold text-amber-800">
                      Lý do: {item.reason}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-600">
                        <span className="text-[10px] text-slate-400 font-bold block mb-1">CÂU GỐC:</span>
                        "{item.original}"
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-emerald-200 text-emerald-800 font-medium">
                        <span className="text-[10px] text-emerald-600 font-bold block mb-1">ĐỀ XUẤT VIẾT LẠI:</span>
                        "{item.proposed}"
                      </div>
                    </div>
                  </div>
                ))}

                {(!analysisResult.layer2_admin_tone || analysisResult.layer2_admin_tone.length === 0) && (
                  <div className="p-6 text-center text-xs text-slate-500">
                    Văn phong hành chính đã rất chuẩn mực và trang trọng.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Layer 3: Form Checklist */}
          {activeLayer === 'layer3' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Bảng kiểm tra 15 tiêu chí thể thức văn bản (Nghị định 30/2020/NĐ-CP)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysisResult.layer3_checklist?.map((item: any, idx: number) => {
                  const isPass = item.status === 'pass';
                  const isWarn = item.status === 'warning';
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                        isPass 
                          ? 'bg-emerald-50/60 border-emerald-200' 
                          : isWarn 
                            ? 'bg-amber-50/60 border-amber-200' 
                            : 'bg-red-50/60 border-red-200'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-800 mb-0.5">{item.item}</div>
                        <p className="text-[11px] text-slate-600">{item.note}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                        isPass 
                          ? 'bg-emerald-600 text-white' 
                          : isWarn 
                            ? 'bg-amber-500 text-white' 
                            : 'bg-red-600 text-white'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'editor' && (
        <div className="flex-1 min-h-[500px]">
          <AiContextualEditor
            title={docTitle}
            onTitleChange={setDocTitle}
            content={currentText || inputContent}
            onContentChange={setCurrentText}
            status="refining"
            version={2}
            onOpenHistory={onOpenHistory}
            onExportWord={() => aiWorkspaceService.exportToWord(docTitle, currentText || inputContent)}
            onPrint={() => aiWorkspaceService.printDocument(docTitle, currentText || inputContent)}
          />

          <div className="mt-3 flex items-center justify-end space-x-2">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Lưu Vào Kho Tài Liệu Tham Mưu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
