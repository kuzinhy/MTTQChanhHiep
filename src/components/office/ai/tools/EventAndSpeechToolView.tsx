import React, { useState } from 'react';
import { 
  Mic, 
  CalendarCheck, 
  FileText, 
  Sparkles, 
  Loader2, 
  Clock, 
  Users, 
  MapPin, 
  Check, 
  Copy, 
  FileDown, 
  Layers,
  ListTodo
} from 'lucide-react';
import { aiWorkspaceService } from '../../../../lib/aiWorkspaceService';
import { AiContextualEditor } from '../AiContextualEditor';
import { AiDocument, WorkspaceContextData } from '../../../../types';

interface EventAndSpeechToolViewProps {
  toolId: 'speech' | 'conference' | 'meeting_minutes';
  workspaceContext: WorkspaceContextData;
  onSaveDocument: (doc: AiDocument) => void;
  onOpenHistory?: () => void;
}

export const EventAndSpeechToolView: React.FC<EventAndSpeechToolViewProps> = ({
  toolId,
  workspaceContext,
  onSaveDocument,
  onOpenHistory
}) => {
  // Speech States
  const [topic, setTopic] = useState('Phát biểu khai mạc Ngày hội Đại đoàn kết toàn dân tộc năm 2026');
  const [speakerRole, setSpeakerRole] = useState('Chủ tịch Ủy ban MTTQ Phường Chánh Hiệp');
  const [audience, setAudience] = useState('Lãnh đạo thành phố, cấp ủy, chính quyền địa phương và toàn thể nhân dân khu phố');
  const [tone, setTone] = useState('Trang trọng, ấm áp, truyền cảm hứng và khơi dậy tinh thần đại đoàn kết');
  const [durationMinutes, setDurationMinutes] = useState('5');
  const [speechContext, setSpeechContext] = useState('Kỷ niệm 96 năm Ngày thành lập Mặt trận Dân tộc Thống nhất Việt Nam (18/11/1930 - 18/11/2026)');

  // Conference States
  const [eventTitle, setEventTitle] = useState('Hội nghị Tổng kết Công tác Mặt trận năm 2026');
  const [eventScale, setEventScale] = useState('Cấp Phường (150 đại biểu)');
  const [eventTimeLocation, setEventTimeLocation] = useState('Tháng 12/2026 tại Hội trường UBND Phường Chánh Hiệp');
  const [packageResult, setPackageResult] = useState<any>(null);

  // Meeting Minutes States
  const [meetingTitle, setMeetingTitle] = useState('Cuộc họp Ban Thường trực MTTQ Phường tháng 08/2026');
  const [chairperson, setChairperson] = useState('Chủ tịch Ủy ban MTTQ Phường');
  const [attendees, setAttendees] = useState('Phó Chủ tịch, các Ủy viên Thường trực, 21 Trưởng ban CTMT Khu phố');
  const [rawDiscussion, setRawDiscussion] = useState(`- Chủ tịch khai mạc, nêu mục đích họp triển khai Tháng cao điểm Vì người nghèo.
- Đ/c Phó Chủ tịch báo cáo dự thảo kế hoạch vận động, chỉ tiêu 500 triệu.
- Trưởng Ban CTMT Tương Bình Hiệp 1 phát biểu: Đề xuất hỗ trợ thêm kinh phí văn nghệ ngày hội.
- Trưởng Ban CTMT Tương Bình Hiệp 5 phát biểu: Cần rà soát kỹ đối tượng tặng quà tránh trùng lặp.
- Chủ tịch kết luận: Thống nhất kế hoạch; giao Phó Chủ tịch hoàn chỉnh tờ trình kinh phí trước ngày 25/8; 21 khu phố nộp danh sách hộ nghèo trước 30/8.`);

  // Common Generated Content
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      if (toolId === 'speech') {
        const res = await aiWorkspaceService.callAiTool('speech', {
          topic,
          speakerRole,
          audience,
          tone,
          durationMinutes: `${durationMinutes} phút`,
          context: speechContext
        });
        if (res && res.speechContent) {
          setGeneratedText(res.speechContent);
        }
      } else if (toolId === 'conference') {
        const res = await aiWorkspaceService.callAiTool('conference', {
          title: eventTitle,
          scale: eventScale,
          timeLocation: eventTimeLocation,
          context: workspaceContext
        });
        if (res && res.package) {
          setPackageResult(res.package);
          setGeneratedText(res.package.plan || '');
        }
      } else if (toolId === 'meeting_minutes') {
        const res = await aiWorkspaceService.callAiTool('meeting-minutes', {
          title: meetingTitle,
          chairperson,
          attendees,
          rawDiscussion
        });
        if (res && res.minutesContent) {
          setGeneratedText(res.minutesContent);
        }
      }

      // Log Audit
      aiWorkspaceService.logAction({
        userId: 'usr_staff',
        userName: 'Cán bộ MTTQ',
        toolId,
        toolName: toolId === 'speech' ? 'Trợ lý soạn bài phát biểu' : toolId === 'conference' ? 'Trợ lý hội nghị - sự kiện' : 'Trợ lý biên bản cuộc họp',
        documentTitle: toolId === 'speech' ? topic : toolId === 'conference' ? eventTitle : meetingTitle,
        action: 'GENERATE',
        status: 'SUCCESS'
      });
    } catch (err: any) {
      alert(`Lỗi xử lý: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    const title = toolId === 'speech' ? topic : toolId === 'conference' ? eventTitle : meetingTitle;
    const newDoc: AiDocument = {
      id: `doc_${Date.now()}`,
      title,
      toolId,
      group: 'group3_conference_event',
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
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
            {toolId === 'speech' && <Mic className="w-5 h-5" />}
            {toolId === 'conference' && <CalendarCheck className="w-5 h-5" />}
            {toolId === 'meeting_minutes' && <FileText className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>
                {toolId === 'speech' && 'Trợ Lý Soạn Bài Phát Biểu (Theo Mốc Thời Lượng)'}
                {toolId === 'conference' && 'Trợ Lý Hội Nghị & Sự Kiện (Trọn Bộ 7 Văn Bản)'}
                {toolId === 'meeting_minutes' && 'Trợ Lý Biên Bản Cuộc Họp & Kết Luận'}
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              {toolId === 'speech' && 'Tự động căn chỉnh độ dài từ 3p, 5p, 7p đến 15p, chuẩn văn phong phát biểu MTTQ.'}
              {toolId === 'conference' && 'Sinh trọn gói Kế hoạch, Timeline, Kịch bản MC, Thư mời, Checklist, Phát biểu, Tin bài.'}
              {toolId === 'meeting_minutes' && 'Ghi nhận chi tiết diễn biến thảo luận và tách bạch phần KẾT LUẬN CHỈ ĐẠO.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Sinh Nội Dung Tự Động</span>
        </button>
      </div>

      {/* Input Section - Speech */}
      {toolId === 'speech' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="md:col-span-2">
            <label className="font-bold text-slate-700 mb-1 block">Chủ đề bài phát biểu:</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-orange-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 mb-1 block">Người phát biểu (Vai trò / Chức vụ):</label>
            <input
              type="text"
              value={speakerRole}
              onChange={(e) => setSpeakerRole(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-orange-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 mb-1 block">Thời lượng phát biểu:</label>
            <div className="grid grid-cols-5 gap-1.5">
              {['3', '5', '7', '10', '15'].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  className={`py-2 rounded-lg font-bold text-xs transition-all ${
                    durationMinutes === mins
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {mins} phút
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 mb-1 block">Đối tượng người nghe (Thành phần tham dự):</label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-orange-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 mb-1 block">Phong thái & Giọng điệu:</label>
            <input
              type="text"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-orange-500 focus:bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-bold text-slate-700 mb-1 block">Bối cảnh sự kiện / Điểm nhấn nội dung:</label>
            <textarea
              rows={3}
              value={speechContext}
              onChange={(e) => setSpeechContext(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-orange-500 focus:bg-white text-xs"
            />
          </div>
        </div>
      )}

      {/* Input Section - Conference */}
      {toolId === 'conference' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="md:col-span-3">
            <label className="font-bold text-slate-700 mb-1 block">Tên sự kiện / Hội nghị:</label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-orange-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 mb-1 block">Quy mô sự kiện:</label>
            <input
              type="text"
              value={eventScale}
              onChange={(e) => setEventScale(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-orange-500 focus:bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="font-bold text-slate-700 mb-1 block">Thời gian & Địa điểm:</label>
            <input
              type="text"
              value={eventTimeLocation}
              onChange={(e) => setEventTimeLocation(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-orange-500 focus:bg-white"
            />
          </div>
        </div>
      )}

      {/* Input Section - Meeting Minutes */}
      {toolId === 'meeting_minutes' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 mb-1 block">Tên cuộc họp:</label>
              <input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 mb-1 block">Chủ trì:</label>
              <input
                type="text"
                value={chairperson}
                onChange={(e) => setChairperson(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 mb-1 block">Thành phần tham dự:</label>
              <input
                type="text"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 mb-1 block">Diễn biến thảo luận thô & Kết luận cuộc họp:</label>
            <textarea
              rows={6}
              value={rawDiscussion}
              onChange={(e) => setRawDiscussion(e.target.value)}
              placeholder="Gõ nhanh ghi chú các ý kiến phát biểu và kết luận của chủ tọa..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500 focus:bg-white font-sans"
            />
          </div>
        </div>
      )}

      {/* Package Tabs for Conference (Trọn bộ 7 văn bản) */}
      {toolId === 'conference' && packageResult && (
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-2 text-xs">
          <span className="font-bold text-slate-700 px-2 py-1">Trọn bộ hồ sơ:</span>
          {[
            { id: 'plan', label: '1. Kế hoạch tổ chức' },
            { id: 'timeline', label: '2. Chương trình chi tiết' },
            { id: 'mcScript', label: '3. Kịch bản MC' },
            { id: 'invitation', label: '4. Giấy mời đại biểu' },
            { id: 'checklist', label: '5. Checklist chuẩn bị' },
            { id: 'speech', label: '6. Bài phát biểu khai mạc' },
            { id: 'pressArticle', label: '7. Tin bài tuyên truyền' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setGeneratedText(packageResult[item.id] || '')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-orange-100 hover:text-orange-800 text-slate-700 font-semibold rounded-lg transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Output Editor */}
      {generatedText && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-orange-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white">
                Văn Bản Hoàn Chỉnh
              </span>
              <h3 className="text-sm font-bold mt-1 text-white">
                {toolId === 'speech' ? topic : toolId === 'conference' ? eventTitle : meetingTitle}
              </h3>
            </div>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Lưu Vào Hồ Sơ
            </button>
          </div>

          <div className="min-h-[500px]">
            <AiContextualEditor
              title={toolId === 'speech' ? topic : toolId === 'conference' ? eventTitle : meetingTitle}
              onTitleChange={() => {}}
              content={generatedText}
              onContentChange={setGeneratedText}
              status="draft"
              version={1}
              onOpenHistory={onOpenHistory}
              onExportWord={() => aiWorkspaceService.exportToWord('VanBan', generatedText)}
              onPrint={() => aiWorkspaceService.printDocument('VanBan', generatedText)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
