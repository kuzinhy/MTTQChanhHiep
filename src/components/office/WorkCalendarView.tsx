import React, { useState } from 'react';
import { WorkEvent } from '../../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  X,
  Users
} from 'lucide-react';

interface WorkCalendarViewProps {
  events: WorkEvent[];
  onAddEvent: (event: WorkEvent) => void;
  onUpdateEvent?: (event: WorkEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
}

export const WorkCalendarView: React.FC<WorkCalendarViewProps> = ({ 
  events, 
  onAddEvent, 
  onUpdateEvent, 
  onDeleteEvent 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT'>('ADD');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Delete Confirmation State
  const [deleteConfirmEvent, setDeleteConfirmEvent] = useState<WorkEvent | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('2026-09-02');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('10:30');
  const [location, setLocation] = useState('Hội trường MTTQ Phường Chánh Hiệp');
  const [chair, setChair] = useState('Đ/c Trần Thị Hoa - Chủ tịch MTTQ');
  const [participants, setParticipants] = useState('Ban Thường trực, Trưởng Ban CTMT 21 Khu phố');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Giao ban');

  // Helper to open Add Modal
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

  // Helper to open Edit Modal
  const handleOpenEditModal = (ev: WorkEvent) => {
    setModalMode('EDIT');
    setEditingEventId(ev.id);
    setTitle(ev.title);

    // Extract Date & Times
    const startParts = (ev.startTime || '').replace('T', ' ').split(' ');
    const endParts = (ev.endTime || '').replace('T', ' ').split(' ');

    setEventDate(startParts[0] || '2026-09-02');
    setStartTime(startParts[1] || '08:00');
    setEndTime(endParts[1] || '10:30');
    setLocation(ev.location || '');
    setChair(ev.chair || '');
    setParticipants(ev.participants || '');
    setContent(ev.content || '');
    setCategory(ev.category || 'Giao ban');

    setIsModalOpen(true);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const fullStartTime = `${eventDate} ${startTime}`;
    const fullEndTime = `${eventDate} ${endTime}`;

    if (modalMode === 'EDIT' && editingEventId && onUpdateEvent) {
      const updated: WorkEvent = {
        id: editingEventId,
        title,
        startTime: fullStartTime,
        endTime: fullEndTime,
        location,
        chair,
        participants,
        content,
        category
      };
      onUpdateEvent(updated);
    } else {
      const newEv: WorkEvent = {
        id: 'ev-' + Date.now(),
        title,
        startTime: fullStartTime,
        endTime: fullEndTime,
        location,
        chair,
        participants,
        content,
        category
      };
      onAddEvent(newEv);
    }

    setIsModalOpen(false);
  };

  // Delete Confirm Action
  const handleConfirmDelete = () => {
    if (deleteConfirmEvent && onDeleteEvent) {
      onDeleteEvent(deleteConfirmEvent.id);
      setDeleteConfirmEvent(null);
    }
  };

  // Filter & Search Logic
  const filteredEvents = events.filter(e => {
    if (!e) return false;
    if (filterCategory !== 'ALL' && e.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = e.title?.toLowerCase().includes(q);
      const matchLocation = e.location?.toLowerCase().includes(q);
      const matchChair = e.chair?.toLowerCase().includes(q);
      const matchContent = e.content?.toLowerCase().includes(q);
      if (!matchTitle && !matchLocation && !matchChair && !matchContent) return false;
    }
    return true;
  });

  const categories = ['ALL', 'Giao ban', 'Đi cơ sở', 'Hội nghị', 'Giám sát', 'Tiếp dân', 'Tiếp xúc cử tri'];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 rounded-3xl text-white shadow-md border border-blue-800/50">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            <CalendarIcon className="w-4 h-4 text-amber-400" />
            <span>QUẢN LÝ LỊCH CÔNG TÁC BAN THƯỜNG TRỰC</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-1 tracking-tight">
            Lịch Làm Việc &amp; Sự Kiện Mặt Trận
          </h1>
          <p className="text-xs text-blue-200 mt-1 max-w-2xl">
            Hệ thống đăng ký, cập nhật và công khai lịch giao ban, hội nghị, tiếp dân, khảo sát thực địa của Ủy ban MTTQ Việt Nam Phường Chánh Hiệp
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Đăng ký Lịch mới</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Search box */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên sự kiện, chủ trì, địa điểm..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterCategory === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
              }`}
            >
              {cat === 'ALL' ? 'Tất cả lịch' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-slate-300 text-slate-500 space-y-3">
            <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <p className="font-bold text-sm text-slate-800">Không tìm thấy lịch công tác phù hợp</p>
              <p className="text-xs text-slate-500">Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác, hoặc thêm lịch mới.</p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              Đăng ký Lịch mới ngay
            </button>
          </div>
        ) : (
          filteredEvents.map((ev) => {
            const timePartsStart = (ev.startTime || '').replace('T', ' ').split(' ');
            const timePartsEnd = (ev.endTime || '').replace('T', ' ').split(' ');

            const dateStr = timePartsStart[0] || '';
            const startTimeStr = timePartsStart[1] || '';
            const endTimeStr = timePartsEnd[1] || '';

            return (
              <div
                key={ev.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row gap-5 items-start justify-between group"
              >
                {/* Date / Category Badge */}
                <div className="md:w-52 shrink-0 bg-blue-50/80 p-4 rounded-xl border border-blue-200/70 text-center space-y-1.5 w-full md:w-auto">
                  <span className="inline-block px-3 py-0.5 bg-blue-800 text-amber-200 text-[10px] font-extrabold rounded-md uppercase tracking-wide">
                    {ev.category || 'Lịch công tác'}
                  </span>
                  <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-slate-900">
                    <Clock className="w-3.5 h-3.5 text-blue-700" />
                    <span>{startTimeStr} - {endTimeStr}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-600 bg-white/80 py-1 px-2 rounded-md border border-blue-100">
                    {dateStr}
                  </div>
                </div>

                {/* Event Details */}
                <div className="flex-1 space-y-2.5">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-700 transition-colors">
                      {ev.title}
                    </h3>
                    {ev.content && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                        "{ev.content}"
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span className="truncate"><strong className="text-slate-900">Địa điểm:</strong> {ev.location || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate"><strong className="text-slate-900">Chủ trì:</strong> {ev.chair || 'Ban Thường trực'}</span>
                    </div>
                  </div>

                  {ev.participants && (
                    <div className="flex items-start gap-2 text-xs text-slate-600 pt-0.5">
                      <Users className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800">Thành phần tham dự: </strong>
                        <span>{ev.participants}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons (Sửa & Xóa) */}
                <div className="flex items-center md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 w-full md:w-auto justify-end">
                  <button
                    onClick={() => handleOpenEditModal(ev)}
                    className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-blue-700 font-bold text-xs rounded-xl border border-slate-200 hover:border-blue-300 transition-all cursor-pointer"
                    title="Chỉnh sửa lịch"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Sửa lịch</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmEvent(ev)}
                    className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200/80 transition-all cursor-pointer"
                    title="Xóa lịch"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4 border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 text-blue-800 rounded-xl">
                  {modalMode === 'EDIT' ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {modalMode === 'EDIT' ? 'Cập Nhật Lịch Công Tác' : 'Đăng Ký Lịch Công Tác Mới'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {modalMode === 'EDIT' ? 'Chỉnh sửa chi tiết buổi làm việc hoặc hội nghị' : 'Nhập thông tin sự kiện lịch làm việc mới'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Tên buổi làm việc / Hội nghị / Sự kiện <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Giao ban Thường trực Mặt trận Tổ quốc Phường Chánh Hiệp..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all font-semibold"
                />
              </div>

              {/* Date & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <label className="block font-bold text-slate-800 mb-1">Phân loại hình thức</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-semibold"
                  >
                    <option value="Giao ban">Giao ban</option>
                    <option value="Đi cơ sở">Đi cơ sở</option>
                    <option value="Hội nghị">Hội nghị</option>
                    <option value="Giám sát">Giám sát</option>
                    <option value="Tiếp dân">Tiếp dân</option>
                    <option value="Tiếp xúc cử tri">Tiếp xúc cử tri</option>
                  </select>
                </div>
              </div>

              {/* Start & End Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Giờ Bắt đầu</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Giờ Kết thúc</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Location & Chair */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Địa điểm</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Phòng họp B - Ủy ban MTTQ Phường..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Cán bộ Chủ trì</label>
                  <input
                    type="text"
                    value={chair}
                    onChange={(e) => setChair(e.target.value)}
                    placeholder="Đ/c Chủ tịch Ủy ban MTTQ Phường..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Participants */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Thành phần tham dự</label>
                <input
                  type="text"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  placeholder="Thường trực Mặt trận, Trưởng Ban CTMT 21 khu phố..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                />
              </div>

              {/* Content / Notes */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Nội dung công việc / Ghi chú</label>
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tóm tắt nội dung trọng tâm của cuộc họp hoặc chuyến công tác..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-medium resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-extrabold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  {modalMode === 'EDIT' ? 'Cập nhật Lịch' : 'Đăng ký & Xuất bản Lịch'}
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
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Xác Nhận Xóa Lịch Công Tác</h3>
                <p className="text-xs text-slate-500 font-medium">Hành động này không thể hoàn tác.</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-700 space-y-1">
              <p className="font-bold text-slate-900">{deleteConfirmEvent.title}</p>
              <p className="text-slate-500">Thời gian: {deleteConfirmEvent.startTime}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmEvent(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Xác nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
