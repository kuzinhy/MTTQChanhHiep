import React, { useState } from 'react';
import { MemberOrganization } from '../../types';
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  Building2, 
  Sparkles, 
  Award, 
  ExternalLink,
  ChevronRight,
  Info,
  X,
  Save,
  Image as ImageIcon
} from 'lucide-react';
import { uploadFileToGoogleDrive, DEFAULT_DRIVE_FOLDER_URL } from '../../lib/googleDriveService';
import { INITIAL_MEMBER_ORGANIZATIONS } from '../../data/seedData';

interface MemberOrganizationsAdminViewProps {
  organizations: MemberOrganization[];
  onSaveOrganizations: (orgs: MemberOrganization[]) => void;
  onShowToast?: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const MemberOrganizationsAdminView: React.FC<MemberOrganizationsAdminViewProps> = ({
  organizations,
  onSaveOrganizations,
  onShowToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<MemberOrganization | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Form State
  const [formData, setFormData] = useState<Partial<MemberOrganization>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  // Filter organizations by search term
  const filteredOrgs = organizations.filter(org => {
    const term = searchTerm.toLowerCase();
    return (
      org.name.toLowerCase().includes(term) ||
      org.shortName.toLowerCase().includes(term) ||
      org.leaderName.toLowerCase().includes(term) ||
      org.description.toLowerCase().includes(term)
    );
  });

  const totalMembers = organizations.reduce((acc, curr) => acc + (curr.activeMembersCount || 0), 0);
  const totalPrograms = organizations.reduce((acc, curr) => acc + (curr.programsCount || 0), 0);

  const handleOpenCreateModal = () => {
    setFormData({
      id: `org-${Date.now()}`,
      slug: `to-chuc-${Date.now()}`,
      name: '',
      shortName: '',
      description: '',
      leaderName: '',
      leaderPosition: '',
      phone: '',
      email: '',
      avatarUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=300',
      bannerUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1200',
      activeMembersCount: 100,
      programsCount: 5,
      createdAt: new Date().toISOString().split('T')[0]
    });
    setAvatarFile(null);
    setBannerFile(null);
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleOpenEditModal = (org: MemberOrganization) => {
    setFormData({ ...org });
    setAvatarFile(null);
    setBannerFile(null);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleDeleteOrg = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tổ chức thành viên "${name}" khỏi hệ thống?`)) {
      const updated = organizations.filter(o => o.id !== id);
      onSaveOrganizations(updated);
      if (selectedOrg?.id === id) setSelectedOrg(null);
      if (onShowToast) onShowToast(`Đã xóa tổ chức thành viên "${name}"`, 'success');
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Khôi phục danh sách tổ chức thành viên về dữ liệu mặc định? Các thay đổi tùy chỉnh sẽ bị cập nhật lại.')) {
      onSaveOrganizations(INITIAL_MEMBER_ORGANIZATIONS);
      if (onShowToast) onShowToast('Đã khôi phục danh sách tổ chức thành viên mặc định!', 'success');
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    setIsUploadingAvatar(true);
    try {
      const result = await uploadFileToGoogleDrive(avatarFile);
      const url = result.webViewLink || result.webContentLink || '';
      if (url) {
        setFormData(prev => ({ ...prev, avatarUrl: url }));
        if (onShowToast) onShowToast('Tải logo/avatar lên Google Drive thành công!', 'success');
      } else {
        throw new Error('Tải ảnh lên thất bại');
      }
    } catch (err: any) {
      // Fallback to Data URL if offline / server proxy fail
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
          if (onShowToast) onShowToast('Đã lưu ảnh đại diện cục bộ!', 'info');
        }
      };
      reader.readAsDataURL(avatarFile);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleUploadBanner = async () => {
    if (!bannerFile) return;
    setIsUploadingBanner(true);
    try {
      const result = await uploadFileToGoogleDrive(bannerFile);
      const url = result.webViewLink || result.webContentLink || '';
      if (url) {
        setFormData(prev => ({ ...prev, bannerUrl: url }));
        if (onShowToast) onShowToast('Tải banner lên Google Drive thành công!', 'success');
      } else {
        throw new Error('Tải ảnh lên thất bại');
      }
    } catch (err: any) {
      // Fallback to Data URL if offline / server proxy fail
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, bannerUrl: reader.result as string }));
          if (onShowToast) onShowToast('Đã lưu banner cục bộ!', 'info');
        }
      };
      reader.readAsDataURL(bannerFile);
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.shortName) {
      if (onShowToast) onShowToast('Vui lòng nhập đầy đủ Tên tổ chức và Tên viết tắt!', 'warning');
      return;
    }

    const newOrg: MemberOrganization = {
      id: formData.id || `org-${Date.now()}`,
      slug: formData.slug || formData.shortName.toLowerCase().replace(/\s+/g, '-'),
      name: formData.name,
      shortName: formData.shortName,
      description: formData.description || '',
      leaderName: formData.leaderName || 'Đang cập nhật',
      leaderPosition: formData.leaderPosition || 'Đại diện',
      phone: formData.phone || '0274.3822.111',
      email: formData.email || 'mttq.chanhhiep@gmail.com',
      avatarUrl: formData.avatarUrl || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=300',
      bannerUrl: formData.bannerUrl || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1200',
      activeMembersCount: Number(formData.activeMembersCount) || 0,
      programsCount: Number(formData.programsCount) || 0,
      createdAt: formData.createdAt || new Date().toISOString().split('T')[0]
    };

    let updatedList: MemberOrganization[];
    if (isEditing) {
      updatedList = organizations.map(o => o.id === newOrg.id ? newOrg : o);
      if (onShowToast) onShowToast(`Đã cập nhật thông tin tổ chức "${newOrg.shortName}"!`, 'success');
    } else {
      updatedList = [newOrg, ...organizations];
      if (onShowToast) onShowToast(`Thêm mới tổ chức thành viên "${newOrg.shortName}" thành công!`, 'success');
    }

    onSaveOrganizations(updatedList);
    setIsEditing(false);
    setIsCreating(false);
    setFormData({});
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 select-none">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden border border-blue-800">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-black uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-amber-300" />
              <span>Quản trị Nghiệp vụ Mặt trận</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Quản lý Các Tổ chức Thành viên MTTQ
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm font-medium leading-relaxed">
              Cập nhật thông tin đại diện lãnh đạo, số lượng đoàn viên/hội viên, đầu mối liên hệ và giới thiệu hoạt động của các tổ chức thành viên Khối Đại Đoàn Kết Phường Chánh Hiệp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Tổ chức Mới</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 backdrop-blur-md transition-all cursor-pointer inline-flex items-center gap-1.5"
              title="Khôi phục danh sách mặc định"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Khôi phục mặc định</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200">Tổng số Tổ chức Thành viên</div>
            <div className="text-xl font-black text-amber-300 mt-0.5">{organizations.length} tổ chức</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200">Tổng lực lượng Đoàn viên / Hội viên</div>
            <div className="text-xl font-black text-emerald-300 mt-0.5">{totalMembers.toLocaleString('vi-VN')} người</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200">Chương trình &amp; Phong trào chính</div>
            <div className="text-xl font-black text-sky-300 mt-0.5">{totalPrograms} chương trình</div>
          </div>
        </div>
      </div>

      {/* Control Bar & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm tổ chức, tên đại diện, số điện thoại..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 self-end sm:self-auto">
          <span>Đang hiển thị {filteredOrgs.length} / {organizations.length} tổ chức</span>
        </div>
      </div>

      {/* Grid Display of Member Organizations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOrgs.map((org) => (
          <div
            key={org.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Banner Top Header */}
              <div className="relative h-32 w-full bg-slate-900 overflow-hidden">
                <img
                  src={org.bannerUrl || org.avatarUrl || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1200'}
                  alt={org.name}
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                <span className="absolute top-3 left-3 bg-blue-600 text-white font-black text-[10px] uppercase px-2.5 py-0.5 rounded-md shadow-xs border border-blue-400/40">
                  {org.shortName}
                </span>

                <div className="absolute -bottom-4 left-5 w-14 h-14 rounded-2xl overflow-hidden bg-white border-2 border-white shadow-md">
                  <img
                    src={org.avatarUrl || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=300'}
                    alt={org.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Body Info */}
              <div className="p-5 pt-7 space-y-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-2">
                    {org.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1">
                    {org.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold text-[11px]">Đại diện lãnh đạo:</span>
                    <span className="font-black text-slate-800">{org.leaderName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold text-[11px]">Chức danh:</span>
                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">{org.leaderPosition}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold text-[11px]">Đoàn/Hội viên:</span>
                    <span className="font-black text-emerald-700">{org.activeMembersCount?.toLocaleString('vi-VN')} người</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold text-[11px]">Đường dây nóng:</span>
                    <span className="font-bold text-slate-700">{org.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedOrg(org)}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <span>Chi tiết</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEditModal(org)}
                  className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl transition-all cursor-pointer"
                  title="Chỉnh sửa thông tin"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteOrg(org.id, org.shortName)}
                  className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-xl transition-all cursor-pointer"
                  title="Xóa tổ chức này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrgs.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-extrabold text-slate-800">Không tìm thấy tổ chức thành viên nào</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Thử thay đổi từ khóa tìm kiếm hoặc nhấn nút bên dưới để thêm mới tổ chức thành viên.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Tổ chức Mới</span>
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrg && !isEditing && !isCreating && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="relative h-44 bg-slate-900">
              <img
                src={selectedOrg.bannerUrl || selectedOrg.avatarUrl || ''}
                alt={selectedOrg.name}
                className="w-full h-full object-cover opacity-85"
              />
              <button
                onClick={() => setSelectedOrg(null)}
                className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute -bottom-6 left-6 w-20 h-20 rounded-2xl overflow-hidden bg-white border-4 border-white shadow-lg">
                <img
                  src={selectedOrg.avatarUrl || ''}
                  alt={selectedOrg.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="p-6 pt-9 space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-md">
                  {selectedOrg.shortName}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">{selectedOrg.name}</h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{selectedOrg.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Đại diện Lãnh đạo</div>
                  <div className="font-black text-slate-900 text-xs mt-0.5">{selectedOrg.leaderName}</div>
                  <div className="text-[10px] text-blue-700 font-bold">{selectedOrg.leaderPosition}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Lực lượng Quản lý</div>
                  <div className="font-black text-slate-900 text-xs mt-0.5">{selectedOrg.activeMembersCount?.toLocaleString('vi-VN')} đoàn viên/hội viên</div>
                  <div className="text-[10px] text-emerald-700 font-bold">{selectedOrg.programsCount} chương trình tác nghiệp</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Điện thoại Liên hệ</div>
                  <div className="font-black text-slate-900 text-xs mt-0.5">{selectedOrg.phone}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Hòm thư Điện tử</div>
                  <div className="font-black text-slate-900 text-xs mt-0.5 truncate">{selectedOrg.email}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    handleOpenEditModal(selectedOrg);
                    setSelectedOrg(null);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Chỉnh sửa Tổ chức</span>
                </button>
                <button
                  onClick={() => setSelectedOrg(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Form Create or Edit */}
      {(isCreating || isEditing) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fadeIn my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 rounded-xl text-blue-700">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    {isCreating ? 'Thêm Tổ chức Thành viên Mới' : 'Cập nhật Thông tin Tổ chức'}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Nhập chi tiết về tổ chức thành viên trong Khối Đại Đoàn Kết MTTQ Phường
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setIsEditing(false);
                }}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-extrabold text-slate-800 uppercase text-[11px]">Tên tổ chức đầy đủ *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Đoàn TNCS Hồ Chí Minh Phường Chánh Hiệp"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-800 uppercase text-[11px]">Tên viết tắt / Tên gọi ngắn *</label>
                  <input
                    type="text"
                    required
                    value={formData.shortName || ''}
                    onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                    placeholder="VD: Đoàn Thanh niên"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-800 uppercase text-[11px]">Đại diện lãnh đạo phụ trách</label>
                  <input
                    type="text"
                    value={formData.leaderName || ''}
                    onChange={(e) => setFormData({ ...formData, leaderName: e.target.value })}
                    placeholder="VD: Nguyễn Văn Đạt"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-800 uppercase text-[11px]">Chức danh đại diện</label>
                  <input
                    type="text"
                    value={formData.leaderPosition || ''}
                    onChange={(e) => setFormData({ ...formData, leaderPosition: e.target.value })}
                    placeholder="VD: Bí thư Đoàn Phường"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-800 uppercase text-[11px]">Số lượng Đoàn viên / Hội viên</label>
                  <input
                    type="number"
                    value={formData.activeMembersCount || 0}
                    onChange={(e) => setFormData({ ...formData, activeMembersCount: parseInt(e.target.value) || 0 })}
                    placeholder="450"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-800 uppercase text-[11px]">Điện thoại liên hệ</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0274.3822.112"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-800 uppercase text-[11px]">Email liên hệ</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="doanthanhnien.chanhhiep@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-extrabold text-slate-800 uppercase text-[11px]">Mô tả nhiệm vụ &amp; chức năng</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Giới thiệu chức năng, tôn chỉ và các phong trào thi đua chính của tổ chức..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Avatar / Logo Upload */}
                <div className="space-y-2 sm:col-span-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="font-extrabold text-slate-800 uppercase text-[11px] flex items-center justify-between">
                    <span>Ảnh Logo / Avatar đại diện</span>
                    <a href={DEFAULT_DRIVE_FOLDER_URL} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-[11px]">
                      📂 Thư mục Google Drive
                    </a>
                  </label>
                  <input
                    type="text"
                    value={formData.avatarUrl || ''}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    placeholder="Link URL ảnh logo (https://...)"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && setAvatarFile(e.target.files[0])}
                      className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                    />
                    {avatarFile && (
                      <button
                        type="button"
                        onClick={handleUploadAvatar}
                        disabled={isUploadingAvatar}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer disabled:opacity-50"
                      >
                        {isUploadingAvatar ? 'Đang tải lên...' : 'Tải lên Drive'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Banner Upload */}
                <div className="space-y-2 sm:col-span-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="font-extrabold text-slate-800 uppercase text-[11px] flex items-center justify-between">
                    <span>Ảnh Banner hiển thị</span>
                  </label>
                  <input
                    type="text"
                    value={formData.bannerUrl || ''}
                    onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                    placeholder="Link URL banner (https://...)"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && setBannerFile(e.target.files[0])}
                      className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                    />
                    {bannerFile && (
                      <button
                        type="button"
                        onClick={handleUploadBanner}
                        disabled={isUploadingBanner}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer disabled:opacity-50"
                      >
                        {isUploadingBanner ? 'Đang tải lên...' : 'Tải lên Drive'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isCreating ? 'Lưu Tổ chức Mới' : 'Cập nhật Thay đổi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
