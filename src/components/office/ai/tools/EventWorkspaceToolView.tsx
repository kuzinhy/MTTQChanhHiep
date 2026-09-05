import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Sparkles, 
  Download, 
  Save, 
  History, 
  FileText, 
  CheckSquare, 
  Clock, 
  Users, 
  Copy,
  Plus,
  Layers,
  Send,
  Calendar,
  MapPin,
  ListTodo
} from 'lucide-react';
import { SecurityNoticeBanner } from '../SecurityNoticeBanner';
import { AiDocument, WorkspaceContextData } from '../../../../types';
import { aiWorkspaceService } from '../../../../lib/aiWorkspaceService';

interface EventWorkspaceToolViewProps {
  onSaveDocument: (doc: AiDocument) => void;
  workspaceContext?: WorkspaceContextData;
  onOpenHistory?: () => void;
}

export const EventWorkspaceToolView: React.FC<EventWorkspaceToolViewProps> = ({
  onSaveDocument,
  workspaceContext,
  onOpenHistory
}) => {
  const [phase, setPhase] = useState<'before' | 'during' | 'after'>('before');
  const [eventName, setEventName] = useState(workspaceContext?.eventName || 'Ngày hội Đại đoàn kết toàn dân tộc năm 2026');
  const [eventTime, setEventTime] = useState(workspaceContext?.eventTime || '08:00 ngày 18/11/2026');
  const [eventLocation, setEventLocation] = useState(workspaceContext?.eventLocation || 'Hội trường UBND Phường Chánh Hiệp');
  const [chairPerson, setChairPerson] = useState('Đồng chí Chủ tịch Ủy ban MTTQ Phường');

  const [isGenerating, setIsGenerating] = useState(false);
  const [eventDocs, setEventDocs] = useState<any | null>(null);

  const handleInitWorkspace = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setEventDocs({
        invitation: `GIẤY MỜI DỰ SỰ KIỆN / HỘI NGHỊ\nKính gửi: Ông/Bà Trưởng Ban CTMT Khu phố\n\nBan Thường trực Ủy ban MTTQ Phường Chánh Hiệp trân trọng kính mời ông/bà tham dự:\n${eventName.toUpperCase()}\n- Thời gian: ${eventTime}\n- Địa điểm: ${eventLocation}\n- Chủ trì: ${chairPerson}\n\nRất mong các đại biểu tham dự đầy đủ, đúng giờ.`,
        checklist: [
          { stt: 1, task: 'In ấn Giấy mời và gửi 21 Khu phố', status: 'Done', pic: 'Văn phòng MTTQ' },
          { stt: 2, task: 'Chuẩn bị phông nền ma-két và ma trận âm thanh', status: 'Pending', pic: 'Bộ phận Văn hóa' },
          { stt: 3, task: 'Chuẩn bị 10 suất quà trao tặng hộ khó khăn', status: 'In progress', pic: 'Ban An sinh' },
          { stt: 4, task: 'Xác nhận danh sách đại biểu khách mời Thành phố', status: 'Pending', pic: 'Chuyên viên VP' }
        ],
        agenda: [
          { time: '08:00 - 08:15', content: 'Đón tiếp đại biểu và văn nghệ chào mừng', pic: 'Đoàn Thanh niên' },
          { time: '08:15 - 08:30', content: 'Chào cờ, tuyên bố lý do, giới thiệu đại biểu', pic: 'MC Chương trình' },
          { time: '08:30 - 09:15', content: 'Báo cáo kết quả Cuộc vận động & Phát biểu Lãnh đạo', pic: 'Chủ trì' },
          { time: '09:15 - 09:45', content: 'Trao khen thưởng & Quà an sinh xã hội', pic: 'Ban Tổ chức' },
          { time: '09:45 - 10:00', content: 'Đáp từ và Bế mạc', pic: 'Chủ tịch MTTQ' }
        ],
        minutesDraft: `BIÊN BẢN VÀ THÔNG BÁO KẾT LUẬN SỰ KIỆN\nHôm nay, ngày ${eventTime}, tại ${eventLocation} đã diễn ra ${eventName}.\n\nI. THÀNH PHẦN THAM DỰ:\n- Chủ trì: ${chairPerson}\n- Đại biểu 21 Khu phố và các đoàn thể chính trị - xã hội.\n\nII. KẾT LUẬN CHỈ ĐẠO:\n1. Biểu dương kết quả 21 Ban CTMT Khu phố đã đạt chỉ tiêu vận động Quỹ.\n2. Yêu cầu Văn phòng MTTQ hoàn thành việc trao tặng 10 suất quà an sinh trước ngày 20/11.\n3. Giao Ban CTMT 21 Khu phố tiếp tục nhân rộng mô hình "Tuyến đường cờ Tổ quốc".`,
      });
    }, 1000);
  };

  const handleSaveWorkspaceDoc = (title: string, text: string) => {
    const doc: AiDocument = {
      id: `doc_${Date.now()}`,
      title: `${eventName} - ${title}`,
      toolId: 'event_workspace',
      group: 'group3_meeting_event',
      content: text,
      ownerId: 'usr_01',
      ownerName: 'Cán bộ MTTQ',
      status: 'completed',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSaveDocument(doc);
    alert(`Đã lưu "${title}" vào kho hồ sơ tài liệu!`);
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-5 overflow-y-auto h-full pb-20">
      <SecurityNoticeBanner />

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">5. Trợ lý Hội họp & Sự kiện (Event Workspace)</h2>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                LÕI NHÓM 03
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Quản lý trọn gói 1 Sự kiện/Cuộc họp qua 3 giai đoạn: Trước sự kiện, Trong sự kiện và Sau sự kiện.
            </p>
          </div>
        </div>

        {onOpenHistory && (
          <button
            onClick={onOpenHistory}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <History className="w-4 h-4 text-amber-600" />
            <span>Sự kiện đã lưu</span>
          </button>
        )}
      </div>

      {/* Workspace Setup Form */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 mb-1 block">Tên sự kiện / Cuộc họp:</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-amber-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 mb-1 block">Thời gian:</label>
            <input
              type="text"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-amber-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 mb-1 block">Địa điểm:</label>
            <input
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-amber-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 mb-1 block">Chủ trì:</label>
            <input
              type="text"
              value={chairPerson}
              onChange={(e) => setChairPerson(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-amber-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={handleInitWorkspace}
            disabled={isGenerating}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Đang khởi tạo Workspace Sự Kiện...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Khởi Tạo Event Workspace Trọn Gói</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Event Phases Navigation */}
      {eventDocs && (
        <div className="space-y-4">
          <div className="flex border-b border-slate-200 bg-white rounded-xl p-1.5 gap-2 text-xs font-bold shadow-2xs">
            <button
              onClick={() => setPhase('before')}
              className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
                phase === 'before' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>1. TRƯỚC SỰ KIỆN (Thư mời, Checklist)</span>
            </button>
            <button
              onClick={() => setPhase('during')}
              className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
                phase === 'during' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>2. TRONG SỰ KIỆN (Timeline Agenda)</span>
            </button>
            <button
              onClick={() => setPhase('after')}
              className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
                phase === 'after' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>3. SAU SỰ KIỆN (Biên bản & Kết luận)</span>
            </button>
          </div>

          {/* Phase 1: Before Event */}
          {phase === 'before' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Mẫu Giấy mời phát hành:</h4>
                  <button
                    onClick={() => handleSaveWorkspaceDoc('Giấy mời', eventDocs.invitation)}
                    className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold"
                  >
                    Lưu Giấy mời
                  </button>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif whitespace-pre-line leading-relaxed text-slate-800">
                  {eventDocs.invitation}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Checklist chuẩn bị hậu cần:</h4>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    {eventDocs.checklist.length} mục
                  </span>
                </div>
                <div className="space-y-2">
                  {eventDocs.checklist.map((c: any) => (
                    <div key={c.stt} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked={c.status === 'Done'} className="rounded text-amber-600" />
                        <span className="font-semibold text-slate-800">{c.task}</span>
                      </div>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                        {c.pic}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Phase 2: During Event */}
          {phase === 'during' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Kịch bản điều hành chi tiết (Timeline Agenda):</h4>
                <button
                  onClick={() => handleSaveWorkspaceDoc('Agenda điều hành', JSON.stringify(eventDocs.agenda))}
                  className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold"
                >
                  Lưu Kịch bản
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Khung giờ</th>
                      <th className="p-3">Nội dung thực hiện</th>
                      <th className="p-3">Người/Đơn vị phụ trách</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {eventDocs.agenda.map((a: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-amber-700">{a.time}</td>
                        <td className="p-3 font-semibold text-slate-800">{a.content}</td>
                        <td className="p-3 text-slate-600">{a.pic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Phase 3: After Event */}
          {phase === 'after' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Dự thảo Biên bản họp & Thông báo Kết luận chỉ đạo:</h4>
                <button
                  onClick={() => handleSaveWorkspaceDoc('Kết luận sự kiện', eventDocs.minutesDraft)}
                  className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold"
                >
                  Lưu Biên bản
                </button>
              </div>

              <textarea
                value={eventDocs.minutesDraft}
                onChange={(e) => setEventDocs({ ...eventDocs, minutesDraft: e.target.value })}
                rows={12}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif text-slate-900 leading-relaxed outline-hidden focus:border-amber-500 focus:bg-white"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
