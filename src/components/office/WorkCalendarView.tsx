import React, { useState } from 'react';
import { WorkEvent } from '../../types';
import { Calendar as CalendarIcon, Clock, MapPin, User, Plus, Search, Filter, ChevronLeft, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';

interface WorkCalendarViewProps {
  events: WorkEvent[];
  onAddEvent: (event: WorkEvent) => void;
}

export const WorkCalendarView: React.FC<WorkCalendarViewProps> = ({ events, onAddEvent }) => {
  const [selectedWeek, setSelectedWeek] = useState('Tuần 35 (25/08 - 31/08/2026)');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('2026-08-31 08:00');
  const [endTime, setEndTime] = useState('2026-08-31 10:30');
  const [location, setLocation] = useState('Hội trường MTTQ Phường Chánh Hiệp');
  const [chair, setChair] = useState('Đ/c Trần Thị Hoa - Chủ tịch MTTQ');
  const [participants, setParticipants] = useState('Ban Thường trực, Trưởng Ban CTMT 21 khu phố');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Giao ban');

  const filteredEvents = events.filter(e => {
    if (filterCategory !== 'ALL' && e.category !== filterCategory) return false;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEv: WorkEvent = {
      id: 'ev-' + Date.now(),
      title,
      startTime,
      endTime,
      location,
      chair,
      participants,
      content,
      category
    };

    onAddEvent(newEv);
    setIsAddModalOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-blue-800 font-extrabold text-xs uppercase tracking-wider">
            <CalendarIcon className="w-4 h-4 text-blue-600" />
            <span>LỊCH CÔNG TÁC BAN THƯỜNG TRỰC</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1">Lịch Làm Việc &amp; Sự Kiện Mặt Trận</h1>
          <p className="text-xs text-slate-500 mt-0.5">Theo dõi, đăng ký và phân công lịch họp, đi cơ sở của Lãnh đạo MTTQ Ward</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Đăng ký Lịch mới</span>
          </button>
        </div>
      </div>

      {/* Week Navigation & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
        <div className="flex items-center gap-2">
          <button className="p-1.5 bg-white border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-100">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-stone-800 text-sm px-3 py-1 bg-white border border-stone-300 rounded-lg shadow-2xs">
            {selectedWeek}
          </span>
          <button className="p-1.5 bg-white border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-100">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-stone-500" />
          <span className="font-semibold text-stone-600">Lọc loại hình:</span>
          {['ALL', 'Giao ban', 'Đi cơ sở', 'Hội nghị', 'Giám sát'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterCategory === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {cat === 'ALL' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-500">
            <CalendarIcon className="w-12 h-12 text-stone-300 mx-auto mb-2" />
            <p className="font-bold text-sm text-stone-700">Chưa có lịch công tác nào trong tuần này</p>
            <p className="text-xs text-stone-400 mt-1">Bấm nút "Đăng ký Lịch mới" để thêm lịch họp hoặc lịch làm việc mới.</p>
          </div>
        ) : (
          filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-red-300 shadow-2xs transition-all flex flex-col md:flex-row gap-5 items-start"
            >
              {/* Date/Time badge */}
              <div className="md:w-48 shrink-0 bg-amber-50/80 p-3.5 rounded-xl border border-amber-200/60 text-center">
                <span className="inline-block px-2 py-0.5 bg-red-800 text-amber-200 text-[10px] font-extrabold rounded-md uppercase mb-2">
                  {ev.category || 'Sự kiện'}
                </span>
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-stone-800">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>{ev.startTime.split(' ')[1]} - {ev.endTime.split(' ')[1]}</span>
                </div>
                <div className="text-[11px] text-stone-500 font-medium mt-1">
                  {ev.startTime.split(' ')[0]}
                </div>
              </div>

              {/* Event Content */}
              <div className="flex-1 space-y-2">
                <h3 className="font-bold text-base text-stone-900">{ev.title}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-red-700 shrink-0" />
                    <span className="truncate"><strong className="text-stone-800">Địa điểm:</strong> {ev.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span className="truncate"><strong className="text-stone-800">Chủ trì:</strong> {ev.chair}</span>
                  </div>
                </div>

                <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                  <span className="font-semibold text-stone-800">Thành phần: </span>
                  {ev.participants}
                </div>

                {ev.content && (
                  <p className="text-xs text-stone-500 italic pt-1">
                    "{ev.content}"
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between border-b pb-3 border-stone-200">
              <h3 className="font-bold text-base text-stone-900">Đăng ký Lịch công tác Mặt trận</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Tên buổi làm việc / Hội nghị *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Giao ban định kỳ Ban Thường trực tháng 9..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Thời gian Bắt đầu</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Thời gian Kết thúc</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Phân loại</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-800 outline-none"
                  >
                    <option value="Giao ban">Giao ban</option>
                    <option value="Đi cơ sở">Đi cơ sở</option>
                    <option value="Hội nghị">Hội nghị</option>
                    <option value="Giám sát">Giám sát</option>
                    <option value="Tiếp dân">Tiếp dân</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Địa điểm</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Người Chủ trì</label>
                <input
                  type="text"
                  value={chair}
                  onChange={(e) => setChair(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Thành phần tham dự</label>
                <input
                  type="text"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Ghi chú / Nội dung chính</label>
                <textarea
                  rows={2}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-800 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-stone-200 text-stone-700 font-bold rounded-xl hover:bg-stone-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-800 text-amber-200 font-bold rounded-xl hover:bg-red-900 shadow-xs"
                >
                  Lưu &amp; Xuất bản Lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
