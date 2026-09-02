import React, { useState } from 'react';
import { Bell, CheckCircle2, FileText, Calendar, Award, MessageSquare, ShieldAlert, X, CheckCheck } from 'lucide-react';
import { browserNotificationService } from '../lib/browserNotifications';

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  category: 'CALENDAR' | 'OPINION' | 'SURVEY' | 'COMPETITION' | 'SYSTEM';
  isRead: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Phản ánh Dân nguyện về "Sửa chữa hệ thống thoát nước Hẻm 45" đã có kết quả phản hồi từ UBND Phường.',
    time: '10 phút trước',
    category: 'OPINION',
    isRead: false
  },
  {
    id: 'n2',
    title: 'Lịch họp Ban Thường trực MTTQ mở rộng tuần này đã được cập nhật.',
    time: '1 giờ trước',
    category: 'CALENDAR',
    isRead: false
  },
  {
    id: 'n3',
    title: 'Mở đợt Khảo sát Trực tuyến: "Lấy ý kiến Nhân dân về chỉnh trang đô thị Chánh Hiệp 2026".',
    time: '3 giờ trước',
    category: 'SURVEY',
    isRead: false
  },
  {
    id: 'n4',
    title: 'Hội thi Trực tuyến "Tìm hiểu Nghị quyết Đại hội MTTQ" đã ghi nhận hơn 1.200 bài dự thi.',
    time: '1 ngày trước',
    category: 'COMPETITION',
    isRead: true
  }
];

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (view: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleTestBrowserPush = async () => {
    const granted = await browserNotificationService.requestPermission();
    if (granted) {
      browserNotificationService.sendNotification({
        title: 'MTTQ Phường Chánh Hiệp',
        body: 'Cảm ơn bạn đã bật Thông báo Trực tuyến! Bạn sẽ nhận được các thông tin chỉ đạo & xử lý dân nguyện tức thì.'
      });
    } else {
      alert('Vui lòng cho phép quyền thông báo trên trình duyệt của bạn.');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto p-6 space-y-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-2xl border border-blue-200 relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 border-2 border-white" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Trung Tâm Thông Báo</h3>
              <p className="text-[11px] text-slate-500 font-medium">Cập nhật tin tức &amp; trạng thái xử lý 24/7</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action controls */}
        <div className="flex items-center justify-between text-xs pt-1">
          <button
            onClick={markAllRead}
            className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Đánh dấu tất cả đã đọc</span>
          </button>

          <button
            onClick={handleTestBrowserPush}
            className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold border border-blue-200 hover:bg-blue-100 transition cursor-pointer text-[11px]"
          >
            Bật Push Notification
          </button>
        </div>

        {/* Notification items */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition flex items-start gap-3 ${
                item.isRead 
                  ? 'bg-slate-50/60 border-slate-200/80 text-slate-600' 
                  : 'bg-blue-50/70 border-blue-200 text-slate-900 shadow-2xs'
              }`}
            >
              <div className="p-2 rounded-xl bg-white border border-slate-200 text-blue-700 shrink-0 mt-0.5">
                {item.category === 'CALENDAR' && <Calendar className="w-4 h-4 text-blue-600" />}
                {item.category === 'OPINION' && <MessageSquare className="w-4 h-4 text-emerald-600" />}
                {item.category === 'SURVEY' && <FileText className="w-4 h-4 text-indigo-600" />}
                {item.category === 'COMPETITION' && <Award className="w-4 h-4 text-amber-600" />}
                {item.category === 'SYSTEM' && <ShieldAlert className="w-4 h-4 text-slate-600" />}
              </div>

              <div className="flex-1 space-y-1">
                <p className={`text-xs leading-snug ${item.isRead ? 'font-medium' : 'font-black'}`}>
                  {item.title}
                </p>
                <span className="text-[10px] text-slate-400 font-semibold block">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
