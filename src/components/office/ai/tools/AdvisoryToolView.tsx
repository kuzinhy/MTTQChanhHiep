import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Loader2, 
  FileText, 
  CheckSquare, 
  Clock, 
  Users, 
  ShieldAlert, 
  Send, 
  Copy, 
  Check, 
  FileDown, 
  Plus, 
  Upload,
  AlertCircle
} from 'lucide-react';
import { aiWorkspaceService } from '../../../../lib/aiWorkspaceService';
import { AiDocument } from '../../../../types';

interface AdvisoryToolViewProps {
  onSaveDocument: (doc: AiDocument) => void;
  onOpenHistory?: () => void;
}

export const AdvisoryToolView: React.FC<AdvisoryToolViewProps> = ({
  onSaveDocument
}) => {
  const [docTitle, setDocTitle] = useState('Kế hoạch số 45/KH-UBND về Chỉnh trang đô thị và Giảm nghèo bền vững');
  const [issuer, setIssuer] = useState('Ủy ban nhân dân Phường Chánh Hiệp');
  const [docText, setDocText] = useState(`ỦY BAN NHÂN DÂN PHƯỜNG CHÁNH HIỆP
Số: 45/KH-UBND
Chánh Hiệp, ngày 15 tháng 08 năm 2026

KẾ HOẠCH
Triển khai Tháng cao điểm "Vì người nghèo" và Chỉnh trang mỹ quan đô thị 21 Khu phố năm 2026

Thực hiện chỉ đạo của Quận ủy - UBND thành phố về công tác an sinh xã hội;
UBND Phường ban hành Kế hoạch với các nội dung trọng tâm sau:

1. Mục tiêu:
- Vận động Quỹ "Vì người nghèo" đạt chỉ tiêu tối thiểu 500 triệu đồng.
- Xóa 100% điểm đen về rác thải, xây dựng tuyến đường hoa kiểu mẫu tại 21 khu phố.
- Trao tặng 50 suất học bổng cho học sinh nghèo hiếu học trước ngày 05/09/2026.

2. Phân công trách nhiệm:
- Đề nghị Ủy ban Mặt trận Tổ quốc Việt Nam Phường chủ trì phối hợp với các tổ chức chính trị - xã hội:
  + Phát động Tháng cao điểm Vì người nghèo từ ngày 17/10/2026 đến 18/11/2026.
  + Hướng dẫn 21 Ban Công tác Mặt trận rà soát chính xác các hộ có hoàn cảnh đặc biệt khó khăn.
  + Giám sát việc bình xét, trao học bổng và xây dựng Nhà Đại đoàn kết đảm bảo công khai, minh bạch.
- Bộ phận Địa chính - Xây dựng: Lập phương án thu gom rác, phối hợp Mặt trận dọn dẹp các điểm tồn đọng rác.
- Thời hạn hoàn thành báo cáo tiến độ đợt 1 về UBND phường trước ngày 20/10/2026.`);

  const [isLoading, setIsLoading] = useState(false);
  const [advisoryResult, setAdvisoryResult] = useState<any>(null);
  const [createdTaskIds, setCreatedTaskIds] = useState<Record<number, boolean>>({});
  const [copiedDraft, setCopiedDraft] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) setDocText(text);
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!docText.trim()) return;
    setIsLoading(true);

    try {
      const res = await aiWorkspaceService.callAiTool('advisory', {
        documentTitle: docTitle,
        issuer,
        documentText: docText
      });

      if (res && res.data) {
        setAdvisoryResult(res.data);

        // Audit log
        aiWorkspaceService.logAction({
          userId: 'usr_staff',
          userName: 'Cán bộ MTTQ',
          toolId: 'advisory',
          toolName: 'Trợ lý tham mưu',
          documentTitle: docTitle,
          action: 'ANALYZE',
          status: 'SUCCESS'
        });
      }
    } catch (err: any) {
      alert(`Lỗi phân tích tham mưu: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = (stt: number, task: any) => {
    setCreatedTaskIds(prev => ({ ...prev, [stt]: true }));
    aiWorkspaceService.logAction({
      userId: 'usr_staff',
      userName: 'Cán bộ MTTQ',
      toolId: 'advisory',
      toolName: 'Trợ lý tham mưu',
      documentTitle: task.taskName,
      action: 'CREATE_TASK',
      status: 'SUCCESS',
      details: `Đã tạo nhiệm vụ cho: ${task.leadingUnit}, Hạn: ${task.deadline}`
    });
    alert(`Đã ghi nhận nhiệm vụ: "${task.taskName}" vào Sổ theo dõi nhiệm vụ!`);
  };

  const handleSaveFullAdvisory = () => {
    if (!advisoryResult) return;
    const fullAdvisoryText = `PHIẾU THAM MƯU XỬ LÝ VĂN BẢN CHỈ ĐẠO
Kính trình: Ban Thường trực Ủy ban MTTQ Việt Nam Phường Chánh Hiệp
Văn bản: ${docTitle} (${issuer})

I. TÓM TẮT NỘI DUNG CHỈ ĐẠO:
${advisoryResult.summary}

II. NHỮNG VẤN ĐỀ CẦN QUAN TÂM:
${advisoryResult.keyConcerns?.map((c: string) => `- ${c}`).join('\n')}

III. NHIỆM VỤ MTTQ CẦN THỰC HIỆN:
${advisoryResult.mttqActions?.map((a: string) => `- ${a}`).join('\n')}

IV. ĐƠN VỊ PHỐI HỢP:
${advisoryResult.coordinatingUnits?.map((u: string) => `- ${u}`).join('\n')}

V. THỜI HẠN HOÀN THÀNH:
${advisoryResult.deadline}

VI. HỒ SƠ / SẢN PHẨM ĐẦU RA:
${advisoryResult.deliverables?.map((d: string) => `- ${d}`).join('\n')}

VII. ĐỀ XUẤT HƯỚNG XỬ LÝ:
${advisoryResult.recommendedAction}

VIII. DỰ THẢO Ý KIẾN THAM MƯU:
${advisoryResult.draftAdvisoryStatement}`;

    const newDoc: AiDocument = {
      id: `doc_${Date.now()}`,
      title: `Phiếu Tham Mưu - ${docTitle}`,
      toolId: 'advisory',
      group: 'group2_report_advisory',
      content: fullAdvisoryText,
      ownerId: 'usr_staff',
      ownerName: 'Cán bộ MTTQ',
      status: 'completed',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveDocument(newDoc);
    alert('Đã lưu Phiếu Tham Mưu vào Kho Hồ Sơ làm việc!');
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 p-4 md:p-6 overflow-y-auto space-y-5">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>Trợ Lý Tham Mưu Văn Bản Chỉ Đạo</span>
              <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold uppercase">
                9 Phần Tham Mưu
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Đọc công văn/kế hoạch cấp trên → Phân tích trách nhiệm MTTQ, đề xuất hướng xử lý và lập bảng nhiệm vụ.
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
            onClick={handleAnalyze}
            disabled={isLoading || !docText.trim()}
            className="inline-flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Lập Phiếu Tham Mưu</span>
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 mb-1 block">Tên / Số hiệu văn bản chỉ đạo:</label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="Nhập tên văn bản..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-rose-500 focus:bg-white text-xs"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 mb-1 block">Cơ quan ban hành:</label>
            <input
              type="text"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="UBND Phường, Đảng ủy, MTTQ TDM..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-rose-500 focus:bg-white text-xs"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-700 mb-1 block text-xs">Nội dung văn bản chỉ đạo:</label>
          <textarea
            rows={6}
            value={docText}
            onChange={(e) => setDocText(e.target.value)}
            placeholder="Dán toàn bộ nội dung văn bản chỉ đạo cần tham mưu tại đây..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans outline-hidden focus:border-rose-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Analysis 9-Part Results */}
      {advisoryResult && (
        <div className="space-y-4 animate-fadeIn">
          {/* Top Summary Banner */}
          <div className="bg-rose-900 text-white p-5 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white uppercase">
                Kết Quả Tham Mưu Hoàn Chỉnh
              </span>
              <h3 className="text-base font-bold mt-1 text-white">{docTitle}</h3>
              <p className="text-xs text-rose-200 mt-0.5">Thời hạn: {advisoryResult.deadline}</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveFullAdvisory}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Lưu Phiếu Tham Mưu
              </button>
            </div>
          </div>

          {/* 9-Point Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* 1. Tóm tắt */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] text-rose-700 flex items-center gap-1.5">
                <span>1. Tóm tắt nội dung chính</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{advisoryResult.summary}</p>
            </div>

            {/* 2. Vấn đề quan tâm */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] text-amber-700 flex items-center gap-1.5">
                <span>2. Những vấn đề cần đặc biệt lưu ý</span>
              </div>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                {advisoryResult.keyConcerns?.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* 3. MTTQ cần làm gì */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5 md:col-span-2 bg-red-50/40 border-red-200">
              <div className="font-bold text-red-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span>3. Trách nhiệm cụ thể của Ủy ban MTTQ Phường</span>
              </div>
              <ul className="list-disc list-inside text-slate-700 space-y-1 font-medium">
                {advisoryResult.mttqActions?.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* 4. Đơn vị phối hợp */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] text-blue-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>4. Đơn vị phối hợp thực hiện</span>
              </div>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                {advisoryResult.coordinatingUnits?.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* 5 & 6. Thời hạn & Hồ sơ sản phẩm */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div>
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] text-purple-700 flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>5. Thời hạn & Tiến độ</span>
                </div>
                <p className="text-slate-700 font-semibold">{advisoryResult.deadline}</p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] text-emerald-700 flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>6. Hồ sơ / Sản phẩm đầu ra cần có</span>
                </div>
                <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                  {advisoryResult.deliverables?.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 7. Đề xuất hướng xử lý */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] text-indigo-700 flex items-center gap-1.5">
                <span>7. Đề xuất hướng xử lý tham mưu</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {advisoryResult.recommendedAction}
              </p>
            </div>

            {/* 8. Dự thảo ý kiến tham mưu */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] text-rose-700 flex items-center justify-between">
                <span>8. Dự thảo ý kiến trình Lãnh đạo</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(advisoryResult.draftAdvisoryStatement);
                    setCopiedDraft(true);
                    setTimeout(() => setCopiedDraft(false), 2000);
                  }}
                  className="text-[10px] font-semibold text-rose-700 hover:underline flex items-center gap-1"
                >
                  {copiedDraft ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedDraft ? 'Đã sao chép' : 'Sao chép đoạn này'}</span>
                </button>
              </div>
              <p className="text-slate-700 leading-relaxed italic bg-rose-50/50 p-2.5 rounded-lg border border-rose-100">
                "{advisoryResult.draftAdvisoryStatement}"
              </p>
            </div>
          </div>

          {/* 9. Bảng Phân Công Nhiệm Vụ Cụ Thể (Interactive Task Table) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-rose-600" />
                <span>9. Bảng Phân Công Nhiệm Vụ Tham Mưu</span>
              </h4>
              <span className="text-[11px] text-slate-500">
                Nhấn "Tạo nhiệm vụ" để lưu vào Sổ Công Việc
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 text-center w-12">STT</th>
                    <th className="p-2.5">Nội dung nhiệm vụ</th>
                    <th className="p-2.5">Đơn vị chủ trì</th>
                    <th className="p-2.5">Đơn vị phối hợp</th>
                    <th className="p-2.5">Thời hạn</th>
                    <th className="p-2.5 text-center">Mức độ</th>
                    <th className="p-2.5 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {advisoryResult.tasks?.map((t: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2.5 text-center font-bold">{t.stt || idx + 1}</td>
                      <td className="p-2.5 font-semibold text-slate-900">{t.taskName}</td>
                      <td className="p-2.5 text-red-700 font-medium">{t.leadingUnit}</td>
                      <td className="p-2.5 text-slate-600">{t.coordinatingUnit || '—'}</td>
                      <td className="p-2.5 text-slate-800 font-medium">{t.deadline}</td>
                      <td className="p-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.priority === 'Khẩn' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {t.priority || 'Cao'}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        {createdTaskIds[t.stt || idx + 1] ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                            <Check className="w-3 h-3" /> Đã tạo
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCreateTask(t.stt || idx + 1, t)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 text-[11px] font-bold rounded-md transition-colors border border-rose-200"
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
        </div>
      )}
    </div>
  );
};
