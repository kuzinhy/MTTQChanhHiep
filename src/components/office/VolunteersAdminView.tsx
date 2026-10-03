import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Award, 
  Trash2, 
  Send, 
  Download, 
  RefreshCw, 
  UserCheck, 
  Sparkles,
  Phone,
  Check,
  Building2,
  ExternalLink,
  Share2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { VolunteerRegistration } from '../../types';
import { AppStorageEngine } from '../../lib/storage';
import { NotificationService } from '../../services/notificationService';
import { OFFICIAL_NEIGHBORHOOD_NAMES } from '../../data/neighborhoodsList';

interface VolunteersAdminViewProps {
  onTriggerToast: (title: string, message: string) => void;
}

export const VolunteersAdminView: React.FC<VolunteersAdminViewProps> = ({ onTriggerToast }) => {
  const [volunteers, setVolunteers] = useState<VolunteerRegistration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('ALL');
  const [selectedTeam, setSelectedTeam] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    loadVolunteers();
  }, []);

  const loadVolunteers = () => {
    try {
      const list = AppStorageEngine.getVolunteers() || [];
      setVolunteers(list);

      // Auto mark viewed by admin when entering page
      let hasUnviewed = false;
      const updatedList = list.map((v: VolunteerRegistration) => {
        if (!v.viewedByAdmin || v.isNew) {
          hasUnviewed = true;
          return { ...v, viewedByAdmin: true, isNew: false };
        }
        return v;
      });

      if (hasUnviewed) {
        // Save back to storage so badge clears
        localStorage.setItem('mttq_chanhhiep_volunteers_v1', JSON.stringify(updatedList));
        localStorage.setItem('mttq_volunteers_last_viewed_ts', Date.now().toString());
        // Notify other components via storage event
        window.dispatchEvent(new Event('storage'));
      }
    } catch (e) {
      console.error('[VolunteersAdminView] Failed loading volunteers:', e);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: 'APPROVED' | 'CONTACTED' | 'PENDING') => {
    try {
      const updated = volunteers.map(v => v.id === id ? { ...v, status: newStatus } : v);
      setVolunteers(updated);
      AppStorageEngine.saveVolunteers(updated);
      window.dispatchEvent(new Event('storage'));
      
      const statusText = newStatus === 'APPROVED' ? 'Đã phê duyệt' : newStatus === 'CONTACTED' ? 'Đã liên hệ' : 'Chờ xử lý';
      onTriggerToast('Cập nhật trạng thái', `Đã chuyển hồ sơ sang "${statusText}".`);
    } catch (e) {
      onTriggerToast('Lỗi', 'Không thể cập nhật trạng thái.');
    }
  };

  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    const { id, name } = deleteConfirm;
    try {
      const list = AppStorageEngine.getVolunteers() || [];
      const updated = list.filter((v: any) => v.id !== id);
      
      AppStorageEngine.saveVolunteers(updated);
      setVolunteers(updated);
      
      window.dispatchEvent(new Event('storage'));
      onTriggerToast('Đã xóa', `Đã xóa hồ sơ ${name}.`);
    } catch (e) {
      onTriggerToast('Lỗi', 'Không thể xóa hồ sơ.');
    }
    setDeleteConfirm(null);
  };

  const handleDeleteSingle = (id: string, name: string) => {
    setDeleteConfirm({ id, name });
  };

  const handleResendEmail = async (vol: VolunteerRegistration) => {
    if (!vol.email || !vol.email.includes('@')) {
      onTriggerToast('Thiếu Email', `Tình nguyện viên ${vol.fullName} chưa cung cấp địa chỉ Email.`);
      return;
    }
    try {
      onTriggerToast('Gửi Email', `Đang gửi lại thư chúc mừng tới ${vol.email}...`);
      await NotificationService.notifyVolunteerRegistered(vol);
      onTriggerToast('Thành công', `Đã gửi lại thư chúc mừng tới ${vol.email}!`);
    } catch (e) {
      onTriggerToast('Lỗi', 'Không thể gửi Email chúc mừng.');
    }
  };

  const handleExportCSV = () => {
    if (filteredVolunteers.length === 0) {
      onTriggerToast('Thông báo', 'Không có dữ liệu để xuất.');
      return;
    }
    const headers = ['Mã TNV', 'Họ và tên', 'Số điện thoại', 'Email', 'Khu phố', 'Đội hình tham gia', 'Thời gian gửi', 'Trạng thái'];
    const rows = filteredVolunteers.map(v => [
      v.code,
      `"${v.fullName}"`,
      `"${v.phone}"`,
      `"${v.email || ''}"`,
      `"${v.neighborhood}"`,
      `"${v.teams ? v.teams.join('; ') : ''}"`,
      `"${v.submittedAt}"`,
      v.status === 'APPROVED' ? 'Đã duyệt' : v.status === 'CONTACTED' ? 'Đã liên hệ' : 'Chờ duyệt'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `danh_sach_tinh_nguyen_vien_mttq_chanhhiep_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onTriggerToast('Xuất tệp thành công', 'Đã tải xuống danh sách Tình nguyện viên dưới dạng CSV Excel.');
  };

  const filteredVolunteers = volunteers.filter(v => {
    const matchesSearch = 
      (v.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.phone || '').includes(searchQuery) ||
      (v.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.code || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesNeighborhood = selectedNeighborhood === 'ALL' || v.neighborhood === selectedNeighborhood;
    const matchesTeam = selectedTeam === 'ALL' || (v.teams || []).includes(selectedTeam);
    const matchesStatus = selectedStatus === 'ALL' || v.status === selectedStatus;

    return matchesSearch && matchesNeighborhood && matchesTeam && matchesStatus;
  });

  const pendingCount = volunteers.filter(v => v.status === 'PENDING').length;
  const approvedCount = volunteers.filter(v => v.status === 'APPROVED').length;
  const contactedCount = volunteers.filter(v => v.status === 'CONTACTED').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 text-xs font-black uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4 text-rose-400" />
              <span>Quản Lý Lực Lượng Tình Nguyện Viên</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Đội Hình Tình Nguyện Viên An Sinh &amp; Chuyển Đổi Số Phường Chánh Hiệp
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Tiếp nhận, phân loại và quản lý lực lượng nhân dân, đoàn viên đăng ký tham gia các hoạt động an sinh xã hội, vệ sinh môi trường &amp; hỗ trợ 21 Khu phố.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={loadVolunteers}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2 border border-slate-700 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span>Làm mới</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-lg hover:brightness-110 transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Danh Sách Excel</span>
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-white text-blue-900 text-xs font-bold shadow-lg hover:bg-slate-50 transition flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Chia sẻ QR</span>
            </button>
          </div>
        </div>

        {/* Stats Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 mt-6 relative z-10">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Tổng đăng ký</p>
              <p className="text-lg font-black text-white">{volunteers.length} hồ sơ</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Mới / Mới tiếp nhận</p>
              <p className="text-lg font-black text-amber-300">{pendingCount} hồ sơ</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Đã duyệt chính thức</p>
              <p className="text-lg font-black text-emerald-300">{approvedCount} người</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Đã liên hệ</p>
              <p className="text-lg font-black text-purple-300">{contactedCount} người</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Tìm theo Tên, SĐT, Email, Mã TNV..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
            />
          </div>

          {/* Neighborhood Filter */}
          <div>
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
            >
              <option value="ALL">Tất cả Khu phố (21 Khu phố)</option>
              {OFFICIAL_NEIGHBORHOOD_NAMES.map(kp => (
                <option key={kp} value={kp}>{kp}</option>
              ))}
            </select>
          </div>

          {/* Team Filter */}
          <div>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
            >
              <option value="ALL">Tất cả Đội hình tham gia</option>
              <option value="An sinh & Cứu trợ">An sinh &amp; Cứu trợ</option>
              <option value="Bảo vệ Môi trường & Xanh hóa">Bảo vệ Môi trường &amp; Xanh hóa</option>
              <option value="Tổ Công nghệ số Cộng đồng">Tổ Công nghệ số Cộng đồng</option>
              <option value="Đội Phản ứng nhanh MTTQ">Đội Phản ứng nhanh MTTQ</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">Chờ duyệt / Mới</option>
              <option value="APPROVED">Đã phê duyệt chính thức</option>
              <option value="CONTACTED">Đã liên hệ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                <th className="p-4">Mã TNV</th>
                <th className="p-4">Tình nguyện viên</th>
                <th className="p-4">Khu phố</th>
                <th className="p-4">Đội hình tham gia</th>
                <th className="p-4">Thời gian đăng ký</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredVolunteers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 font-medium">
                    <HeartHandshake className="w-12 h-12 text-slate-300 mx-auto mb-3 stroke-1" />
                    <p className="text-sm font-bold text-slate-600">Chưa tìm thấy hồ sơ Tình nguyện viên nào</p>
                    <p className="text-xs text-slate-400 pt-1">Hãy thử đổi từ khóa tìm kiếm hoặc lọc trạng thái khác</p>
                  </td>
                </tr>
              ) : (
                filteredVolunteers.map((vol) => (
                  <tr key={vol.id} className="hover:bg-blue-50/40 transition">
                    {/* Code & New Indicator */}
                    <td className="p-4 font-mono font-black text-blue-700">
                      <div className="flex items-center gap-2">
                        <span>{vol.code}</span>
                        {vol.isNew && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black uppercase animate-pulse">
                            MỚI
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Name, Phone & Email */}
                    <td className="p-4">
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">{vol.fullName}</p>
                        <div className="flex items-center gap-3 text-slate-500 text-[11px] pt-0.5">
                          <a href={`tel:${vol.phone}`} className="hover:text-blue-600 font-semibold flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {vol.phone}
                          </a>
                          {vol.email && (
                            <a href={`mailto:${vol.email}`} className="hover:text-blue-600 truncate max-w-[180px] flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {vol.email}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Neighborhood */}
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-[11px]">
                        <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                        {vol.neighborhood}
                      </span>
                    </td>

                    {/* Teams */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[240px]">
                        {(vol.teams || []).map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Registration Time */}
                    <td className="p-4 text-slate-500 font-medium text-[11px]">
                      {vol.submittedAt}
                    </td>

                    {/* Status Pill */}
                    <td className="p-4">
                      {vol.status === 'APPROVED' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Đã duyệt
                        </span>
                      ) : vol.status === 'CONTACTED' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-extrabold">
                          <PhoneCall className="w-3.5 h-3.5 text-purple-600" />
                          Đã liên hệ
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-extrabold">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Chờ xử lý
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right relative z-50">
                      <div className="flex items-center justify-end gap-1.5 pointer-events-auto">
                        {vol.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleUpdateStatus(vol.id, 'APPROVED')}
                            title="Phê duyệt Tình nguyện viên chính thức"
                            className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold transition cursor-pointer"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}

                        {vol.status !== 'CONTACTED' && (
                          <button
                            onClick={() => handleUpdateStatus(vol.id, 'CONTACTED')}
                            title="Đánh dấu đã liên hệ"
                            className="p-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold transition cursor-pointer"
                          >
                            <PhoneCall className="w-4 h-4" />
                          </button>
                        )}

                        {vol.email && (
                          <button
                            onClick={() => handleResendEmail(vol)}
                            title="Gửi lại Email chúc mừng"
                            className="p-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition cursor-pointer"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteSingle(vol.id, vol.fullName); }}
                          title="Xóa hồ sơ"
                          className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full space-y-4">
            <h3 className="font-bold text-lg">Xác nhận xóa</h3>
            <p className="text-sm text-slate-600">Bạn có chắc chắn muốn xóa hồ sơ Tình nguyện viên <span className="font-bold">{deleteConfirm.name}</span>?</p>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Hủy</button>
              <button onClick={handleConfirmDelete} className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl">Xóa hồ sơ</button>
            </div>
          </div>
        </div>
      )}
      {/* Share QR Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-xs w-full space-y-4 text-center">
            <h3 className="font-black text-lg text-slate-900">Chia sẻ Link Đăng ký</h3>
            <div className="bg-white p-2 border border-slate-200 rounded-xl inline-block">
              <QRCodeSVG value={`${window.location.origin}${window.location.pathname}#/dang-ky-tinh-nguyen`} size={200} />
            </div>
            <p className="text-[11px] text-slate-500 break-all">{window.location.origin}{window.location.pathname}#/dang-ky-tinh-nguyen</p>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#/dang-ky-tinh-nguyen`);
                onTriggerToast('Đã copy', 'Đã sao chép link vào bộ nhớ tạm');
              }}
              className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition"
            >
              Copy Link
            </button>
            <button onClick={() => setShowShareModal(false)} className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-900">Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};
