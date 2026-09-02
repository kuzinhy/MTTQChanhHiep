import React, { useState } from 'react';
import { WorkEvent } from '../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  Building2,
  Sparkles,
  Users,
  CheckCircle2
} from 'lucide-react';

interface WorkCalendarSectionProps {
  events?: WorkEvent[];
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
    participants: 'Cán bộ trực tiếp dân & Đại diện Nhân dân Khu phố 3, Khu phố 4',
    content: 'Tiếp nhận phản ánh của nhân dân về chính sách trợ cấp xã hội, vệ sinh môi trường đô thị.',
    category: 'Tiếp dân'
  },
  {
    id: 'evt-3',
    title: 'Khảo sát tiến độ xây dựng Nhà Đại đoàn kết cho hộ khó khăn',
    startTime: '2026-09-03T14:00',
    endTime: '2026-09-03T16:30',
    location: 'Tổ 5, Khu phố 8, Phường Chánh Hiệp',
    chair: 'Đ/c Trưởng Ban Công tác Mặt trận Khu phố 8',
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

export const WorkCalendarSection: React.FC<WorkCalendarSectionProps> = ({ events = DEFAULT_EVENTS }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('Tất cả');

  const categories = ['Tất cả', 'Giao ban', 'Tiếp dân', 'Giám sát', 'Hội nghị'];

  const safeEvents = Array.isArray(events) && events.length > 0 ? events : DEFAULT_EVENTS;

  const filteredEvents = selectedFilter === 'Tất cả'
    ? safeEvents
    : safeEvents.filter(e => e && e.category === selectedFilter);

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-blue-200/90 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-800 rounded-2xl shadow-xs">
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
              Lịch làm việc, tiếp công dân & khảo sát thực địa của Ủy ban MTTQ Việt Nam Phường Chánh Hiệp
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedFilter === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
          const startDate = new Date(evt.startTime);
          const formattedDate = startDate.toLocaleDateString('vi-VN', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
          const formattedTime = `${startDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${new Date(evt.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;

          return (
            <div
              key={evt.id}
              className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-blue-200 hover:border-blue-500 shadow-xs hover:shadow-md transition-all space-y-3 group"
            >
              {/* Event Badge & Date */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-900 font-black text-[10px] uppercase rounded-lg tracking-wider">
                  {evt.category || 'Công tác'}
                </span>
                <span className="text-xs font-bold text-slate-700 capitalize flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                  {formattedDate}
                </span>
              </div>

              {/* Title & Content */}
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                  {evt.title}
                </h3>
                <p className="text-xs text-slate-600 font-medium line-clamp-2">
                  {evt.content}
                </p>
              </div>

              {/* Details List */}
              <div className="pt-1 space-y-1.5 text-[11px] font-medium text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-bold text-slate-800">{formattedTime}</span>
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
          );
        })}
      </div>
    </section>
  );
};
