import React, { useState } from 'react';
import { WorkEvent } from '../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  Edit3, 
  Trash2, 
  X,
  Users,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface WorkCalendarSectionProps {
  events?: WorkEvent[];
  onAddEvent?: (event: WorkEvent) => void;
  onUpdateEvent?: (event: WorkEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
}

const DEFAULT_EVENTS: WorkEvent[] = [
  {
    id: 'evt-1',
    title: 'Họp Thường trực Mặt trận Tổ quốc Phường giao ban đầu tuần',
    startTime: '2026-09-01T07:30',
    endTime: '2026-09-01T09:00',
    location: 'Phòng họp B - Ủy ban MTTQ Phường Chánh Hiệp',
    chair: 'Đ/c Chủ tịch Ủy ban MTTQ Phường',
    participants: 'Thường trực Mặt trận, Trưởng các Ban công tác Mặt trận 21 Khu phố',
    content: 'Đánh giá công tác dân vận, an sinh xã hội tháng 8 và triển khai Kế hoạch Kỷ niệm Ngày Quốc khánh 2/9.',
    category: 'Giao ban'
  },
  {
    id: 'evt-2',
    title: 'Tiếp công dân & Lắng nghe Ý kiến Dân sinh định kỳ',
    startTime: '2026-09-02T08:00',
    endTime: '2026-09-02T11:30',
    location: 'Phòng Tiếp dân - Văn phòng Số MTTQ Phường',
    chair: 'Đ/c Phó Chủ tịch Ủy ban MTTQ Phường',
    participants: 'Cán bộ trực tiếp dân & Đại diện Nhân dân Tương Bình Hiệp 3, Tương Bình Hiệp 4',
    content: 'Tiếp nhận phản ánh của nhân dân về chính sách trợ cấp xã hội, vệ sinh môi trường đô thị.',
    category: 'Tiếp dân'
  },
  {
    id: 'evt-3',
    title: 'Khảo sát tiến độ xây dựng Nhà Đại đoàn kết cho hộ khó khăn',
    startTime: '2026-09-03T14:00',
    endTime: '2026-09-03T16:30',
    location: 'Tổ 5, Khu phố Hiệp An 7, Phường Chánh Hiệp',
    chair: 'Đ/c Trưởng Ban Công tác Mặt trận Hiệp An 7',
    participants: 'Đoàn khảo sát MTTQ Phường, Đơn vị tài trợ',
    content: 'Kiểm tra thực tế nghiệm thu công trình nhà tình thương cho gia đình chính sách.',
    category: 'Giám sát'
  },
  {
    id: 'evt-4',
    title: 'Hội nghị Tập huấn Công tác Dân vận khéo & Số hóa Mặt trận',
    startTime: '2026-09-04T08:00',
    endTime: '2026-09-04T11:00',
    location: 'Hội trường Lớn - UBND Phường Chánh Hiệp',
    chair: 'Báo cáo viên Thành ủy TP. Hồ Chí Minh',
    participants: 'Toàn thể Cán bộ Mặt trận, Đoàn thể Phường & 21 Khu phố',
    content: 'Tập huấn kỹ năng khai thác Cổng thông tin điện tử & phần mềm quản lý văn bản số.',
    category: 'Hội nghị'
  }
];

export const WorkCalendarSection: React.FC<WorkCalendarSectionProps> = ({ 
  events = DEFAULT_EVENTS,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('Tất cả');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT'>('ADD');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [deleteConfirmEvent, setDeleteConfirmEvent] = useState<WorkEvent | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('2026-09-02');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('10:30');
  const [location, setLocation] = useState('Hội trường MTTQ Phường Chánh Hiệp');
  const [chair, setChair] = useState('Đ/c Trần Thị Hoa - Chủ tịch MTTQ');
  const [participants, setParticipants] = useState('Ban Thường trực & Trưởng Ban CTMT 21 Khu phố');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Giao ban');

  const categories = ['Tất cả', 'Giao ban', 'Tiếp dân', 'Giám sát', 'Hội nghị', 'Đi cơ sở'];

  const safeEvents = Array.isArray(events) && events.length > 0 ? events : DEFAULT_EVENTS;

  const filteredEvents = selectedFilter === 'Tất cả'
    ? safeEvents
    : safeEvents.filter(e => e && e.category === selectedFilter);

  const handleOpenAddModal = () => {
    setModalMode('ADD');
    setEditingEventId(null);
    setTitle('');
    setEventDate(new Date().toISOString().split('T')[0] || '2026-09-02');
    setStartTime('08:00');
    setEndTime('10:30');
    setLocation('Phòng họp A - Ủy ban MTTQ Phường Chánh Hiệp');
    setChair('Đ/c Trần Thị Hoa - Chủ tịch MTTQ');
    setParticipants('Thường trực MTTQ Phường & Trưởng Ban CTMT 21 Khu phố');
    setContent('');
    setCategory('Giao ban');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (evt: WorkEvent) => {
    setModalMode('EDIT');
    setEditingEventId(evt.id);
    setTitle(evt.title);

    const startParts = (evt.startTime || '').replace('T', ' ').split(' ');
    const endParts = (evt.endTime || '').replace('T', ' ').split(' ');

    setEventDate(startParts[0] || '2026-09-02');
    setStartTime(startParts[1] || '08:00');
    setEndTime(endParts[1] || '10:30');
    setLocation(evt.location || '');
    setChair(evt.chair || '');
    setParticipants(evt.participants || '');
    setContent(evt.content || '');
    setCategory(evt.category || 'Giao ban');

    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const fullStartTime = `${eventDate} ${startTime}`;
    const fullEndTime = `${eventDate} ${endTime}`;

    if (modalMode === 'EDIT' && editingEventId && onUpdateEvent) {
      onUpdateEvent({
        id: editingEventId,
        title,
        startTime: fullStartTime,
        endTime: fullEndTime,
        location,
        chair,
        participants,
        content,
        category
      });
    } else if (onAddEvent) {
      onAddEvent({
        id: 'ev-' + Date.now(),
        title,
        startTime: fullStartTime,
        endTime: fullEndTime,
        location,
        chair,
        participants,
        content,
        category
      });
    }

    setIsModalOpen(false);
  };

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-blue-200/90 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-800 rounded-2xl shadow-xs shrink-0">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
                Lịch Công Tác Thường Trực Mặt Trận
              </h2>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full border border-emerald-300">
                Công khai
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Lịch làm việc, tiếp công dân &amp; khảo sát thực địa của Ủy ban MTTQ Việt Nam Phường Chánh Hiệp
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-extrabold text-xs rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Đăng ký Lịch mới</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedFilter === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((evt) => {
          const startParts = (evt.startTime || '').replace('T', ' ').split(' ');
          const endParts = (evt.endTime || '').replace('T', ' ').split(' ');

          const dateStr = startParts[0] || '';
          const startTimeStr = startParts[1] || '';
          const endTimeStr = endParts[1] || '';

          return (
            <div
              key={evt.id}
              className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-blue-200/90 hover:border-blue-500 shadow-xs hover:shadow-md transition-all space-y-3 group flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Event Badge & Date */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-900 font-black text-[10px] uppercase rounded-lg tracking-wider">
                    {evt.category || 'Công tác'}
                  </span>
                  <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-md">
                    <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                    {dateStr}
                  </span>
                </div>

                {/* Title & Content */}
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                    {evt.title}
                  </h3>
                  {evt.content && (
                    <p className="text-xs text-slate-600 font-medium line-clamp-2">
                      {evt.content}
                    </p>
                  )}
                </div>

                {/* Details List */}
                <div className="pt-1 space-y-1.5 text-[11px] font-medium text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-800">{startTimeStr} - {endTimeStr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate font-semibold text-slate-800">Chủ trì: {evt.chair}</span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar if handlers exist */}
              {(onUpdateEvent || onDeleteEvent) && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  {onUpdateEvent && (
                    <button
                      onClick={() => handleOpenEditModal(evt)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-blue-700 font-bold text-[11px] rounded-lg border border-slate-200 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Sửa</span>
                    </button>
                  )}
                  {onDeleteEvent && (
                    <button
                      onClick={() => setDeleteConfirmEvent(evt)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] rounded-lg border border-rose-200 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Xóa</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-800 rounded-xl">
                  {modalMode === 'EDIT' ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {modalMode === 'EDIT' ? 'Sửa Lịch Công Tác' : 'Đăng Ký Lịch Công Tác Mới'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Tên buổi làm việc / Hội nghị *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Họp Thường trực Mặt trận Tổ quốc Phường..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Ngày diễn ra</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Loại hình</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-semibold"
                  >
                    <option value="Giao ban">Giao ban</option>
                    <option value="Tiếp dân">Tiếp dân</option>
                    <option value="Giám sát">Giám sát</option>
                    <option value="Hội nghị">Hội nghị</option>
                    <option value="Đi cơ sở">Đi cơ sở</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Giờ bắt đầu</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Giờ kết thúc</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Địa điểm</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Chủ trì</label>
                  <input
                    type="text"
                    value={chair}
                    onChange={(e) => setChair(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Thành phần tham dự</label>
                <input
                  type="text"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Ghi chú / Nội dung chính</label>
                <textarea
                  rows={2}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-medium resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 text-white font-extrabold rounded-xl hover:bg-blue-800 shadow-xs"
                >
                  {modalMode === 'EDIT' ? 'Cập nhật Lịch' : 'Lưu & Đăng ký Lịch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteConfirmEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-rose-600 border-b border-rose-100 pb-3">
              <div className="p-2.5 bg-rose-100 rounded-2xl">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Xác nhận xóa Lịch công tác</h3>
                <p className="text-xs text-slate-500 font-medium">Hành động này sẽ loại bỏ sự kiện khỏi hệ thống</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="font-black text-slate-800">{deleteConfirmEvent.title}</div>
              <div className="text-slate-500 font-semibold">{deleteConfirmEvent.startTime} | {deleteConfirmEvent.location}</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmEvent(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 text-xs cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteEvent && deleteConfirmEvent) {
                    onDeleteEvent(deleteConfirmEvent.id);
                  }
                  setDeleteConfirmEvent(null);
                }}
                className="px-5 py-2 bg-rose-600 text-white font-extrabold rounded-xl hover:bg-rose-700 shadow-xs text-xs cursor-pointer"
              >
                Xác nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
