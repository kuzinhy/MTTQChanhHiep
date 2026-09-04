import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  Calendar, 
  Plus, 
  Users, 
  ShieldCheck, 
  Megaphone, 
  CheckCircle, 
  AlertTriangle, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  BarChart3,
  Smartphone,
  Globe,
  Eraser,
  Clock,
  CheckCheck
} from 'lucide-react';
import { NotificationItem, NotificationPriority, NotificationCategory, NotificationEventType } from '../../types';
import { notificationMasterService } from '../../lib/notificationMasterService';

interface NotificationAdminViewProps {
  currentUserId: string;
  onTriggerToast: (title: string, message: string) => void;
}

export const NotificationAdminView: React.FC<NotificationAdminViewProps> = ({
  currentUserId,
  onTriggerToast
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'devices' | 'stats' | 'cleanup'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCleaning, setIsCleaning] = useState(false);
  
  // Form states
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<NotificationCategory>('system');
  const [priority, setPriority] = useState<NotificationPriority>('NORMAL');
  const [targetType, setTargetType] = useState<'ALL' | 'GUEST_PUBLIC' | 'AUTHENTICATED' | 'ROLE' | 'USER'>('ALL');
  const [selectedRole, setSelectedRole] = useState('BÍ THƯ');
  const [actionUrl, setActionUrl] = useState('');
  const [channels, setChannels] = useState<('IN_APP' | 'WEB_PUSH' | 'PWA_PUSH')[]>(['IN_APP', 'WEB_PUSH']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const list = await notificationMasterService.getAllNotifications();
      setNotifications(list);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      onTriggerToast('Thiếu thông tin', 'Vui lòng nhập đầy đủ tiêu đề và nội dung thông báo!');
      return;
    }

    setIsSubmitting(true);
    try {
      await notificationMasterService.createNotification({
        title,
        body,
        category,
        priority,
        type: 'ADMIN_BROADCAST',
        visibility: 'PUBLIC',
        target_type: targetType,
        target_roles: targetType === 'ROLE' ? [selectedRole] : undefined,
        channels,
        status: 'SENT',
        action_url: actionUrl || undefined,
        created_by: currentUserId
      });

      onTriggerToast('Thành công', 'Đã phát hành thông báo mới đến hệ thống và realtime thành công!');
      setTitle('');
      setBody('');
      setActionUrl('');
      setActiveTab('list');
      loadNotifications();
    } catch (err: any) {
      onTriggerToast('Lỗi', err?.message || 'Không thể tạo thông báo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSingle = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thông báo này khỏi hệ thống?')) return;
    try {
      await notificationMasterService.deleteNotification(id);
      onTriggerToast('Đã xóa', 'Thông báo đã được xóa thành công.');
      loadNotifications();
    } catch (e) {
      onTriggerToast('Lỗi', 'Không thể xóa thông báo.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} thông báo đã chọn?`)) return;
    try {
      await notificationMasterService.bulkDeleteNotifications(selectedIds);
      onTriggerToast('Đã xóa hàng loạt', `Đã xóa thành công ${selectedIds.length} thông báo.`);
      setSelectedIds([]);
      loadNotifications();
    } catch (e) {
      onTriggerToast('Lỗi', 'Không thể hoàn tất xóa hàng loạt.');
    }
  };

  const handleCleanupOlderThan = async (days: number) => {
    if (!window.confirm(`Bạn có chắc chắn muốn dọn dẹp toàn bộ thông báo cũ hơn ${days} ngày?`)) return;
    setIsCleaning(true);
    try {
      const count = await notificationMasterService.cleanupOldNotifications(days);
      onTriggerToast('Dọn dẹp thành công', `Đã tự động xóa ${count} thông báo cũ hơn ${days} ngày.`);
      loadNotifications();
    } catch (e) {
      onTriggerToast('Lỗi', 'Không thể dọn dẹp thông báo.');
    } finally {
      setIsCleaning(false);
    }
  };

  const filteredList = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || n.category === filterCategory;
    const matchesPriority = filterPriority === 'ALL' || n.priority === filterPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 text-xs font-black uppercase tracking-wider">
              <Megaphone className="w-3.5 h-3.5" />
              <span>Trung Tâm Quản Trị Thông Báo Realtime</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Hệ Thống Phối Hợp &amp; Phát Sóng Thông Báo 4.0
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Quản lý và gửi thông báo trực tiếp đến website, PWA và thiết bị của cán bộ, hội viên và nhân dân Phường Chánh Hiệp.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('create')}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-black uppercase tracking-wider shadow-lg hover:brightness-110 transition flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Tạo Thông Báo Mới
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'list', label: 'Tất cả thông báo', icon: Bell, count: notifications.length },
          { id: 'create', label: 'Soạn & Gửi mới', icon: Send },
          { id: 'cleanup', label: 'Dọn dẹp & Tối ưu', icon: Eraser },
          { id: 'devices', label: 'Quản lý thiết bị Push', icon: Smartphone },
          { id: 'stats', label: 'Thống kê & Nhật ký', icon: BarChart3 }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.id ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: List */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1">
              <div className="relative flex-1 w-full sm:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm nội dung thông báo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">📁 Tất cả danh mục</option>
                <option value="system">Hệ thống</option>
                <option value="announcement">Thông báo chung</option>
                <option value="urgent">Khẩn cấp</option>
                <option value="civil">Dân sinh</option>
                <option value="supervision">Giám sát</option>
                <option value="competition">Cuộc thi</option>
              </select>

              {/* Priority Filter */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">⚡ Tất cả mức độ</option>
                <option value="NORMAL">Bình thường</option>
                <option value="URGENT">Khẩn</option>
                <option value="CRITICAL">Hỏa tốc / Quan trọng</option>
              </select>
            </div>
            
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
              {selectedIds.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa đã chọn ({selectedIds.length})</span>
                </button>
              )}
              <div className="text-xs text-slate-500 font-semibold">
                Tổng số: <span className="font-black text-slate-800">{filteredList.length}</span> / {notifications.length} thông báo
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                    <th className="py-3 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredList.length && filteredList.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(filteredList.map(n => n.id));
                          } else {
                            setSelectedIds([]);
                          }
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="py-3 px-4">Tiêu đề &amp; Nội dung</th>
                    <th className="py-3 px-4">Phân loại</th>
                    <th className="py-3 px-4">Mức độ</th>
                    <th className="py-3 px-4">Đối tượng</th>
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400">
                        Chưa có bản ghi thông báo nào trong hệ thống.
                      </td>
                    </tr>
                  ) : (
                    filteredList.map(item => {
                      const isSelected = selectedIds.includes(item.id);
                      return (
                        <tr key={item.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}>
                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedIds([...selectedIds, item.id]);
                                } else {
                                  setSelectedIds(selectedIds.filter(id => id !== item.id));
                                }
                              }}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="font-bold text-slate-900 truncate">{item.title}</div>
                            <div className="text-slate-500 text-[11px] truncate">{item.body}</div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold capitalize text-slate-700">
                            {item.category}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              item.priority === 'CRITICAL' ? 'bg-rose-600 text-white' :
                              item.priority === 'URGENT' ? 'bg-amber-500 text-white' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {item.priority}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-700">
                            {item.target_type === 'ALL' ? 'Tất cả mọi người' :
                             item.target_type === 'AUTHENTICATED' ? 'Thành viên đăng nhập' :
                             item.target_type === 'ROLE' ? `Vai trò: ${item.target_roles?.join(', ')}` : item.target_type}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                            {new Date(item.created_at).toLocaleString('vi-VN')}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleDeleteSingle(item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              title="Xóa thông báo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Cleanup & Optimization */}
      {activeTab === 'cleanup' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-700">
                <Eraser className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 uppercase">Công Cụ Dọn Dẹp &amp; Tối Ưu Thông Báo</h2>
                <p className="text-xs text-slate-500">Quản lý vòng đời dữ liệu tin nhắn, tự động dọn dẹp các thông báo cũ để tối ưu hóa bộ nhớ Firestore.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase mb-1">Dọn dẹp &gt; 7 ngày</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Xóa tất cả thông báo cũ hơn 1 tuần không còn cần thiết.</p>
                </div>
                <button
                  disabled={isCleaning}
                  onClick={() => handleCleanupOlderThan(7)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition cursor-pointer"
                >
                  Dọn dẹp (&gt; 7 ngày)
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase mb-1">Dọn dẹp &gt; 30 ngày</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Xóa các thông báo định kỳ hoặc lịch sử cũ hơn 1 tháng.</p>
                </div>
                <button
                  disabled={isCleaning}
                  onClick={() => handleCleanupOlderThan(30)}
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
                >
                  Dọn dẹp (&gt; 30 ngày)
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase mb-1">Dọn dẹp &gt; 90 ngày</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Giải phóng dung lượng lớn bằng cách xóa tin từ quý trước.</p>
                </div>
                <button
                  disabled={isCleaning}
                  onClick={() => handleCleanupOlderThan(90)}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer"
                >
                  Dọn dẹp (&gt; 90 ngày)
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 space-y-1">
                <span className="font-bold block">Khuyến nghị vận hành hệ thống thông báo 4.0:</span>
                <p>Việc dọn dẹp thường xuyên giúp giữ cho cơ sở dữ liệu Firestore gọn gàng, giảm thời gian phản hồi thời gian thực trên các thiết bị của cán bộ và nhân dân.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Create */}
      {activeTab === 'create' && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-black text-slate-900 uppercase">Tạo Thông Báo Mới</h2>
            <p className="text-xs text-slate-500">Soạn thảo và phát sóng thông báo trực tiếp qua Realtime và Web Push.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase mb-1.5">Tiêu đề thông báo *</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Lịch họp giao ban công tác Mặt trận tháng 9/2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase mb-1.5">Nội dung chi tiết *</label>
              <textarea
                required
                rows={4}
                placeholder="Nhập nội dung đầy đủ của thông báo..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase mb-1.5">Phân loại</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="system">Hệ thống / Chung</option>
                  <option value="news">Tin tức</option>
                  <option value="event">Sự kiện &amp; Lịch họp</option>
                  <option value="document">Văn bản pháp luật</option>
                  <option value="member">Công tác Thành viên</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase mb-1.5">Mức độ ưu tiên</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="NORMAL">Thông thường (Normal)</option>
                  <option value="IMPORTANT">Quan trọng (Important)</option>
                  <option value="URGENT">Khẩn (Urgent)</option>
                  <option value="CRITICAL">Cực kỳ khẩn (Critical)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase mb-1.5">Đối tượng nhận</label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="ALL">Tất cả mọi người (Công khai)</option>
                  <option value="AUTHENTICATED">Tất cả thành viên đăng nhập</option>
                  <option value="ROLE">Theo Vai trò (Role)</option>
                </select>
              </div>

              {targetType === 'ROLE' && (
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1.5">Chọn Vai trò</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-bold text-blue-700"
                  >
                    <option value="BÍ THƯ">Bí thư khu phố</option>
                    <option value="TRƯỞNG KHU PHỐ">Trưởng khu phố</option>
                    <option value="HỘI VIÊN">Hội viên</option>
                    <option value="CÁN BỘ">Cán bộ / Chuyên viên</option>
                    <option value="ADMIN">Quản trị viên (Admin)</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase mb-1.5">Đường dẫn liên kết khi click (Tùy chọn)</label>
              <input
                type="text"
                placeholder="Ví dụ: /news/su-kien-dai-doan-ket hoặc https://..."
                value={actionUrl}
                onChange={(e) => setActionUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider shadow-md transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang gửi...' : 'Phát Hành Ngay'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Devices */}
      {activeTab === 'devices' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
          <Smartphone className="w-12 h-12 text-blue-600 mx-auto" />
          <h3 className="text-base font-black text-slate-800">Quản lý Thiết bị &amp; Web Push Subscriptions</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Hệ thống tự động ghi nhận các thiết bị trình duyệt và PWA đã cho phép nhận thông báo đẩy an toàn.
          </p>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold inline-block">
            Trạng thái: 0 thiết bị đang kích hoạt Web Push trực tuyến
          </div>
        </div>
      )}

      {/* Tab 4: Stats */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase">Tổng thông báo đã gửi</div>
            <div className="text-3xl font-black text-blue-600">{notifications.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase">Tỷ lệ mở xem (Open Rate)</div>
            <div className="text-3xl font-black text-emerald-600">94.5%</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase">Thiết bị nhận Web Push</div>
            <div className="text-3xl font-black text-indigo-600">128</div>
          </div>
        </div>
      )}
    </div>
  );
};
