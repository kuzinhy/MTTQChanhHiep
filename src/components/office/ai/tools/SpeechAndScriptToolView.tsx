import React, { useState } from 'react';
import { 
  Mic, 
  Sparkles, 
  Download, 
  Save, 
  History, 
  Copy, 
  Clock, 
  User, 
  CheckCircle2, 
  FileText
} from 'lucide-react';
import { SecurityNoticeBanner } from '../SecurityNoticeBanner';
import { AiDocument, WorkspaceContextData } from '../../../../types';
import { aiWorkspaceService } from '../../../../lib/aiWorkspaceService';

interface SpeechAndScriptToolViewProps {
  onSaveDocument: (doc: AiDocument) => void;
  workspaceContext?: WorkspaceContextData;
  onOpenHistory?: () => void;
}

export const SpeechAndScriptToolView: React.FC<SpeechAndScriptToolViewProps> = ({
  onSaveDocument,
  workspaceContext,
  onOpenHistory
}) => {
  const [speechType, setSpeechType] = useState<'3min' | '5min' | '7min' | 'outline' | 'mc'>('5min');
  const [role, setRole] = useState('Chủ tịch Ủy ban MTTQ Phường');
  const [eventContext, setEventContext] = useState(workspaceContext?.eventName || 'Ngày hội Đại đoàn kết toàn dân tộc năm 2026');
  const [keyTheme, setKeyTheme] = useState('Phát huy sức mạnh đại đoàn kết toàn dân, chăm lo an sinh xã hội và xây dựng đô thị văn minh.');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [speechContent, setSpeechContent] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setIsSaved(false);

    setTimeout(() => {
      setIsGenerating(false);

      if (speechType === 'outline') {
        setSpeechContent(`DÀN Ý NÓI NHANH (KHÔNG ĐỌC VĂN BẢN) - DÀNH CHO LÃNH ĐẠO
Người nói: ${role}
Sự kiện: ${eventContext}

1. LỜI CHÀO & MỞ ĐẦU (1 phút):
- Gửi lời chào trân trọng đến quý đại biểu, bà con nhân dân 21 Khu phố.
- Khẳng định ý nghĩa đặc biệt của sự kiện hôm nay.

2. BA ĐIỂM ĐẤN LỚN (3 phút):
- Điểm 1: Biểu dương tinh thần đoàn kết của nhân dân Phường Chánh Hiệp trong hưởng ứng các cuộc vận động.
- Điểm 2: Kết quả chăm lo Quỹ "Vì người nghèo" - đã trao tặng học bổng, xây nhà Đại đoàn kết.
- Điểm 3: Cảm ơn sự đồng hành của cộng đồng doanh nghiệp và các nhà hào tâm.

3. KẾT LUẬN & LỜI CHÚC (1 phút):
- Kêu gọi toàn thể nhân dân tiếp tục hưởng ứng phong trảo xây dựng không gian văn hóa Bác Hồ.
- Chúc quý đại biểu sức khỏe, gia đình an khang thịnh vượng.`);
        return;
      }

      if (speechType === 'mc') {
        setSpeechContent(`KỊCH BẢN MC ĐIỀU HÀNH TRANG TRỌNG
Sự kiện: ${eventContext}

1. ỔN ĐỊNH TỔ CHỨC (07:45 - 08:00):
MC: "Kính thưa quý vị đại biểu, chỉ còn ít phút nữa chương trình sẽ chính thức bắt đầu. Xin trân trọng kính mời quý vị đại biểu cùng toàn thể bà con tiến vào hội trường..."

2. CHÀO CỜ & TUYÊN BỐ LÝ DO (08:00):
MC: "Đã đến giờ làm việc, xin trân trọng kính mời quý vị đại biểu đứng dậy làm lễ Chào cờ! Nghiêm!..."

3. GIỚI THIỆU ĐẠI BIỂU:
MC: "Về phía Lãnh đạo Thành phố/Quận, xin trân trọng giới thiệu... Về phía Lãnh đạo Phường Chánh Hiệp, xin trân trọng giới thiệu..."

4. MỜI PHÁT BIỂU:
MC: "Kế tiếp chương trình, xin trân trọng kính mời ${role} lên phát biểu khai mạc..."`);
        return;
      }

      const wordCount = speechType === '3min' ? '500' : speechType === '5min' ? '900' : '1400';
      setSpeechContent(`BÀI PHÁT BIỂU (${speechType === '3min' ? '3 PHÚT - NGẮN GỌN' : speechType === '5min' ? '5 PHÚT - CHUẨN' : '7 PHÚT - CHI TIẾT'} ~ ${wordCount} TỪ)
Người phát biểu: ${role}
Dịp phát biểu: ${eventContext}

Kính thưa các đồng chí Lãnh đạo!
Kính thưa quý vị đại biểu cùng toàn thể bà con nhân dân!

Hôm nay, trong không khí vui tươi, phấn khởi của ${eventContext}, tôi rất hân hạnh thay mặt Ban Thường trực Ủy ban MTTQ Phường Chánh Hiệp gửi đến quý vị đại biểu, khách quý cùng toàn thể bà con lời chào trân trọng và lời chúc mừng tốt đẹp nhất.

Kính thưa quý vị,
Nhìn lại chặng đường vừa qua, công tác Mặt trận Phường Chánh Hiệp đã đạt được nhiều kết quả rất đáng tự hào. Nhờ tinh thần đại đoàn kết và sự ủng hộ mạnh mẽ của nhân dân 21 Khu phố, chúng ta đã triển khai hiệu quả các cuộc vận động lớn:
- Vận động Quỹ "Vì người nghèo" đạt và vượt chỉ tiêu đề ra.
- Xây dựng và bàn giao nhiều căn nhà Đại đoàn kết ấm áp tình nghĩa.
- Duy trì và phát triển các tuyến đường hoa, không gian văn hóa Bác Hồ gắn kết tình làng nghĩa xóm.

Có được những thành quả ấy là nhờ sự lãnh đạo sát sao của Cấp ủy Đảng, sự phối hợp chặt chẽ của UBND và các đoàn thể, cùng sự đồng lòng tận tụy của 21 Ban Công tác Mặt trận Khu phố.

Thay mặt Ủy ban MTTQ Phường, tôi xin trân trọng cảm ơn và nhiệt liệt biểu dương những đóng góp quý báu của toàn thể bà con nhân dân.

Kính thưa quý vị đại biểu,
Bước sang giai đoạn mới, tôi mong muốn toàn thể cán bộ và nhân dân Phường tiếp tục phát huy truyền thống đoàn kết, chung tay chăm lo cho hộ khó khăn, giữ gìn an ninh trật tự, quyết tâm xây dựng Phường Chánh Hiệp ngày càng giàu đẹp, văn minh.

Một lần nữa, xin chúc các đồng chí Lãnh đạo, quý vị đại biểu cùng toàn thể bà con sức khỏe, hạnh phúc và thành công!
Xin trân trọng cảm ơn!`);
    }, 900);
  };

  const handleSaveDoc = () => {
    if (!speechContent) return;
    const doc: AiDocument = {
      id: `doc_${Date.now()}`,
      title: `Bài phát biểu / Kịch bản: ${eventContext}`,
      toolId: 'speech_script',
      group: 'group3_meeting_event',
      content: speechContent,
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
    if (!speechContent) return;
    aiWorkspaceService.exportToWord(`BaiPhatBieu_${role}`, speechContent);
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-5 overflow-y-auto h-full pb-20">
      <SecurityNoticeBanner />

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">6. Bài phát biểu – Kịch bản MC (Speech & Script)</h2>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full border border-purple-200">
                LÕI NHÓM 03
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Soạn bài phát biểu chuẩn thời lượng (3', 5', 7'), dàn ý nói nhanh hoặc kịch bản MC điều hành sự kiện.
            </p>
          </div>
        </div>

        {onOpenHistory && (
          <button
            onClick={onOpenHistory}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <History className="w-4 h-4 text-purple-600" />
            <span>Bài đã lưu</span>
          </button>
        )}
      </div>

      {/* Form Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Chọn định dạng & Thời lượng:</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSpeechType('3min')}
                className={`p-2 rounded-xl border font-bold text-center ${speechType === '3min' ? 'bg-purple-50 border-purple-500 text-purple-900' : 'bg-slate-50 border-slate-200'}`}
              >
                3 Phút (~500 từ)
              </button>
              <button
                type="button"
                onClick={() => setSpeechType('5min')}
                className={`p-2 rounded-xl border font-bold text-center ${speechType === '5min' ? 'bg-purple-50 border-purple-500 text-purple-900' : 'bg-slate-50 border-slate-200'}`}
              >
                5 Phút (~900 từ)
              </button>
              <button
                type="button"
                onClick={() => setSpeechType('7min')}
                className={`p-2 rounded-xl border font-bold text-center ${speechType === '7min' ? 'bg-purple-50 border-purple-500 text-purple-900' : 'bg-slate-50 border-slate-200'}`}
              >
                7 Phút (~1400 từ)
              </button>
              <button
                type="button"
                onClick={() => setSpeechType('outline')}
                className={`p-2 rounded-xl border font-bold text-center ${speechType === 'outline' ? 'bg-purple-50 border-purple-500 text-purple-900' : 'bg-slate-50 border-slate-200'}`}
              >
                Dàn Ý Nói Nhanh
              </button>
            </div>
            <button
              type="button"
              onClick={() => setSpeechType('mc')}
              className={`w-full mt-2 p-2 rounded-xl border font-bold text-center text-xs ${speechType === 'mc' ? 'bg-purple-50 border-purple-500 text-purple-900' : 'bg-slate-50 border-slate-200'}`}
            >
              Kịch Bản MC Điều Hành Trang Trọng
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">Vai trò người phát biểu:</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:border-purple-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">Sự kiện / Dịp hội họp:</label>
            <input
              type="text"
              value={eventContext}
              onChange={(e) => setEventContext(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:border-purple-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">Thông điệp chính / Chủ đề cốt lõi:</label>
            <textarea
              value={keyTheme}
              onChange={(e) => setKeyTheme(e.target.value)}
              rows={3}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:border-purple-500 focus:bg-white"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Đang tạo phát biểu...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Sinh Bài Phát Biểu Ngay</span>
              </>
            )}
          </button>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>Nội dung bài phát biểu / kịch bản</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveDoc}
                disabled={!speechContent}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold disabled:opacity-40"
              >
                <Save className="w-3.5 h-3.5 inline mr-1" />
                <span>{isSaved ? 'Đã Lưu' : 'Lưu'}</span>
              </button>
              <button
                onClick={handleExportWord}
                disabled={!speechContent}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5 inline mr-1" />
                <span>Xuất Word</span>
              </button>
            </div>
          </div>

          <textarea
            value={speechContent}
            onChange={(e) => setSpeechContent(e.target.value)}
            placeholder="Nội dung bài phát biểu sẽ xuất hiện ở đây..."
            rows={16}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif text-slate-900 leading-relaxed outline-hidden focus:border-purple-500 focus:bg-white resize-none"
          />
        </div>
      </div>
    </div>
  );
};
