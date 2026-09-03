import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Megaphone, 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  FileText, 
  Share2, 
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { aiWorkspaceService } from '../../../../lib/aiWorkspaceService';
import { AiContextualEditor } from '../AiContextualEditor';
import { AiDocument } from '../../../../types';

interface MttqSpecializedToolViewProps {
  toolId: 'supervision' | 'public_opinion' | 'propaganda';
  onSaveDocument: (doc: AiDocument) => void;
  onOpenHistory?: () => void;
}

export const MttqSpecializedToolView: React.FC<MttqSpecializedToolViewProps> = ({
  toolId,
  onSaveDocument,
  onOpenHistory
}) => {
  // Supervision states
  const [supSubject, setSupSubject] = useState('Giám sát công tác cấp phát tiền hỗ trợ đối tượng bảo trợ xã hội và hộ cận nghèo');
  const [supTarget, setSupTarget] = useState('Bộ phận Lao động - Thương binh & Xã hội và Trưởng Ban điều hành 21 Khu phố');
  const [supLegalBasis, setSupLegalBasis] = useState('Luật Mặt trận Tổ quốc Việt Nam số 75/2015/QH13, Nghị định số 20/2021/NĐ-CP');
  const [supConcerns, setSupConcerns] = useState('Người dân phản ánh tiền chi trả chậm, danh sách niêm yết chưa công khai rõ ràng');

  // Public Opinion states
  const [opinionPeriod, setOpinionPeriod] = useState('Tháng 08/2026');
  const [rawOpinions, setRawOpinions] = useState(`- Tương Bình Hiệp 3: Tình trạng ngập nước tuyến đường ĐX 04 khi mưa lớn, rác ứ đọng miệng cống.
- Tương Bình Hiệp 7: Đơn xin cấp số nhà xử lý chậm, người dân phải đi lại nhiều lần.
- Định Hòa 2: Đánh giá cao việc tổ chức tiêm chủng mở rộng tại trạm y tế.
- Định Hòa 8: Kiến nghị lắp đèn chiếu sáng ban đêm tại hẻm 45 đường Lê Chí Dân để phòng chống trộm cắp.
- Chánh Mỹ 2: Ô nhiễm tiếng ồn từ quán karaoke di động vào đêm khuya.`);

  // Propaganda states
  const [propTopic, setPropTopic] = useState('Tuyên truyền Cuộc vận động "Toàn dân đoàn kết xây dựng nông thôn mới, đô thị văn minh" và giữ gìn trật tự đô thị');
  const [propTargetAudience, setPropTargetAudience] = useState('Bà con nhân dân, các hộ kinh doanh buôn bán mặt tiền đường');
  const [propCoreMessage, setPropCoreMessage] = useState('Không lấn chiếm lòng lề đường, phân loại rác tại nguồn, chung tay giữ gìn tuyến phố hoa sáng - xanh - sạch - đẹp');
  const [propChannel, setPropChannel] = useState<'all' | 'fb' | 'zalo' | 'radio' | 'faq'>('all');
  const [propagandaResult, setPropagandaResult] = useState<any>(null);

  // Common Results
  const [generatedText, setGeneratedText] = useState('');
  const [opinionAnalysis, setOpinionAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = async () => {
    setIsLoading(true);
    try {
      if (toolId === 'supervision') {
        const res = await aiWorkspaceService.callAiTool('supervision', {
          subject: supSubject,
          targetUnit: supTarget,
          legalBasis: supLegalBasis,
          concerns: supConcerns
        });
        if (res && res.result) {
          setGeneratedText(res.result);
        }
      } else if (toolId === 'public_opinion') {
        const res = await aiWorkspaceService.callAiTool('public-opinion', {
          period: opinionPeriod,
          rawOpinions
        });
        if (res && res.data) {
          setOpinionAnalysis(res.data);
          setGeneratedText(res.data.summaryReport || '');
        }
      } else if (toolId === 'propaganda') {
        const res = await aiWorkspaceService.callAiTool('propaganda', {
          topic: propTopic,
          targetAudience: propTargetAudience,
          coreMessage: propCoreMessage,
          channel: propChannel
        });
        if (res && res.data) {
          setPropagandaResult(res.data);
          setGeneratedText(res.data.facebookPost || res.data.zaloBroadcast || '');
        }
      }

      // Audit Log
      aiWorkspaceService.logAction({
        userId: 'usr_staff',
        userName: 'Cán bộ MTTQ',
        toolId,
        toolName: toolId === 'supervision' ? 'Trợ lý giám sát & phản biện' : toolId === 'public_opinion' ? 'Trợ lý nắm bắt ý kiến nhân dân' : 'Trợ lý tuyên truyền',
        documentTitle: toolId === 'supervision' ? supSubject : toolId === 'public_opinion' ? `Báo cáo dư luận ${opinionPeriod}` : propTopic,
        action: 'ANALYZE',
        status: 'SUCCESS'
      });
    } catch (err: any) {
      alert(`Lỗi xử lý: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    const title = toolId === 'supervision' ? `Đề cương Giám sát - ${supSubject}` : toolId === 'public_opinion' ? `Báo cáo Dư luận Nhân dân ${opinionPeriod}` : `Tài liệu Tuyên truyền - ${propTopic}`;
    const newDoc: AiDocument = {
      id: `doc_${Date.now()}`,
      title,
      toolId,
      group: 'group4_mttq_specialized',
      content: generatedText,
      ownerId: 'usr_staff',
      ownerName: 'Cán bộ MTTQ',
      status: 'draft',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSaveDocument(newDoc);
    alert('Đã lưu tài liệu thành công!');
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 p-4 md:p-6 overflow-y-auto space-y-5">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
            {toolId === 'supervision' && <ShieldAlert className="w-5 h-5" />}
            {toolId === 'public_opinion' && <Users className="w-5 h-5" />}
            {toolId === 'propaganda' && <Megaphone className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>
                {toolId === 'supervision' && 'Trợ Lý Giám Sát & Phản Biện Xã Hội'}
                {toolId === 'public_opinion' && 'Trợ Lý Nắm Bắt Ý Kiến & Dư Luận Nhân Dân (10 Nhóm)'}
                {toolId === 'propaganda' && 'Trợ Lý Tuyên Truyền Đa Kênh (Facebook, Zalo, Loa)'}
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              {toolId === 'supervision' && 'Xây dựng kế hoạch giám sát, bộ câu hỏi chất vấn, chỉ ra mâu thuẫn pháp lý.'}
              {toolId === 'public_opinion' && 'Phân loại 10 nhóm lĩnh vực, phát hiện điểm nóng bức xúc và đề xuất cơ quan giải quyết.'}
              {toolId === 'propaganda' && 'Sinh đồng loạt bài viết Facebook, Zalo, Infographic text, Hỏi - Đáp FAQ và Kịch bản loa phát thanh.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleRun}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{toolId === 'supervision' ? 'Lập Kế Hoạch Giám Sát' : toolId === 'public_opinion' ? 'Tổng Hợp Ý Kiến Nhân Dân' : 'Soạn Nội Dung Tuyên Truyền'}</span>
        </button>
      </div>

      {/* Inputs - Supervision */}
      {toolId === 'supervision' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="md:col-span-2">
            <label className="font-bold text-slate-700 mb-1 block">Nội dung / Chuyên đề cần giám sát:</label>
            <input
              type="text"
              value={supSubject}
              onChange={(e) => setSupSubject(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-red-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 mb-1 block">Đối tượng được giám sát:</label>
            <input
              type="text"
              value={supTarget}
              onChange={(e) => setSupTarget(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-red-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 mb-1 block">Căn cứ pháp lý áp dụng:</label>
            <input
              type="text"
              value={supLegalBasis}
              onChange={(e) => setSupLegalBasis(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-red-500 focus:bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="font-bold text-slate-700 mb-1 block">Các vấn đề nhân dân phản ánh / Nghi vấn cần làm rõ:</label>
            <textarea
              rows={3}
              value={supConcerns}
              onChange={(e) => setSupConcerns(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-red-500 focus:bg-white text-xs"
            />
          </div>
        </div>
      )}

      {/* Inputs - Public Opinion */}
      {toolId === 'public_opinion' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="w-64">
            <label className="font-bold text-slate-700 mb-1 block">Kỳ tổng hợp:</label>
            <input
              type="text"
              value={opinionPeriod}
              onChange={(e) => setOpinionPeriod(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-red-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 mb-1 block">Danh sách ý kiến thô từ 21 Ban Công tác Mặt trận khu phố:</label>
            <textarea
              rows={7}
              value={rawOpinions}
              onChange={(e) => setRawOpinions(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-red-500 focus:bg-white font-sans"
            />
          </div>
        </div>
      )}

      {/* Inputs - Propaganda */}
      {toolId === 'propaganda' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="md:col-span-2">
            <label className="font-bold text-slate-700 mb-1 block">Chủ đề cuộc vận động / Tuyên truyền:</label>
            <input
              type="text"
              value={propTopic}
              onChange={(e) => setPropTopic(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-red-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 mb-1 block">Đối tượng hướng tới:</label>
            <input
              type="text"
              value={propTargetAudience}
              onChange={(e) => setPropTargetAudience(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-red-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 mb-1 block">Thông điệp cốt lõi:</label>
            <input
              type="text"
              value={propCoreMessage}
              onChange={(e) => setPropCoreMessage(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-red-500 focus:bg-white"
            />
          </div>
        </div>
      )}

      {/* Propaganda Channel Tabs */}
      {toolId === 'propaganda' && propagandaResult && (
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-2 text-xs">
          <span className="font-bold text-slate-700 px-2 py-1">Kênh phát hành:</span>
          {[
            { id: 'facebookPost', label: '📱 Bài đăng Facebook / Fanpage' },
            { id: 'zaloBroadcast', label: '💬 Bản tin Zalo OA Nhóm Dân cư' },
            { id: 'radioScript', label: '📻 Kịch bản Loa Truyền thanh (3-5p)' },
            { id: 'infographicBullets', label: '📊 Tóm tắt Infographic (4 Điểm)' },
            { id: 'faqList', label: '❓ Hỏi - Đáp Thường gặp (FAQ)' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setGeneratedText(propagandaResult[item.id] || '')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-red-100 hover:text-red-800 text-slate-700 font-semibold rounded-lg transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Public Opinion Categorization Dashboard */}
      {toolId === 'public_opinion' && opinionAnalysis && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-red-600" />
              <span>Phân Loại Ý Kiến Theo 10 Nhóm Lĩnh Vực ({opinionAnalysis.totalCount} ý kiến)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {opinionAnalysis.categorized?.map((cat: any, idx: number) => (
              <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{cat.category}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                    {cat.items?.length || 0} ý kiến
                  </span>
                </div>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  {cat.items?.map((item: string, i: number) => (
                    <li key={i} className="line-clamp-2">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Output Editor */}
      {generatedText && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-red-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
                Văn Bản Tham Mưu MTTQ
              </span>
              <h3 className="text-sm font-bold mt-1 text-white">
                {toolId === 'supervision' ? supSubject : toolId === 'public_opinion' ? `Báo cáo Dư luận ${opinionPeriod}` : propTopic}
              </h3>
            </div>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Lưu Vào Hồ Sơ
            </button>
          </div>

          <div className="min-h-[500px]">
            <AiContextualEditor
              title={toolId === 'supervision' ? supSubject : toolId === 'public_opinion' ? `Báo cáo Dư luận ${opinionPeriod}` : propTopic}
              onTitleChange={() => {}}
              content={generatedText}
              onContentChange={setGeneratedText}
              status="draft"
              version={1}
              onOpenHistory={onOpenHistory}
              onExportWord={() => aiWorkspaceService.exportToWord('VanBanMTTQ', generatedText)}
              onPrint={() => aiWorkspaceService.printDocument('VanBanMTTQ', generatedText)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
