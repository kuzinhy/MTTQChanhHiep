import React, { useState, useRef } from 'react';
import { StaffUser, UserRole } from '../../types';
import { 
  Users, 
  Shield, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  Phone, 
  Award, 
  UserCheck, 
  Lock, 
  Unlock, 
  Edit3, 
  Trash2, 
  Eye, 
  Building2, 
  Sparkles, 
  AlertTriangle, 
  Filter, 
  KeyRound,
  FileText,
  UserPlus,
  Upload,
  Camera,
  Globe,
  Loader2,
  Copy,
  Check,
  RotateCcw,
  Key,
  ShieldCheck,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getRoleBadgeStyle, getRoleLabel } from '../../lib/rbac';
import { auth } from '../../lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

interface StaffUsersAdminViewProps {
  staffUsers: StaffUser[];
  currentStaffUser?: StaffUser | null;
  onToggleUserActive?: (id: string) => void;
  onAddUser?: (user: StaffUser) => void;
  onUpdateUser?: (user: StaffUser) => void;
  onDeleteUser?: (id: string) => void;
  onOpenDigitalDirectory?: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
  'https://www.mattrancantho.vn/files/images/Logo%20-%20Icon/Logo%20MTTQ.png'
];


const DEPARTMENT_PRESETS = [
  'Ban Thường trực MTTQ',
  'Bộ phận Văn phòng - Giám sát',
  'Bộ phận Tuyên giáo - Dân tộc - Tôn giáo',
  'Bộ phận Phong trào - An sinh xã hội',
  'Ban Thanh tra Nhân dân Phường',
  'Ban Giám sát Đầu tư của Cộng đồng',
  ...Array.from({ length: 21 }, (_, i) => `Ban Công tác Mặt trận Khu phố Chánh Hiệp ${i + 1}`),
  ...Array.from({ length: 21 }, (_, i) => `Ban Công tác Mặt trận Chánh Hiệp ${i + 1}`)
];

export const StaffUsersAdminView: React.FC<StaffUsersAdminViewProps> = ({
  staffUsers,
  currentStaffUser,
  onToggleUserActive,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onOpenDigitalDirectory
}) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
  const [viewingUser, setViewingUser] = useState<StaffUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<StaffUser | null>(null);
  const [resettingUser, setResettingUser] = useState<StaffUser | null>(null);

  // Password reset state
  const [newPasswordInput, setNewPasswordInput] = useState('ChanhHiep@2026');
  const [resetMethod, setResetMethod] = useState<'custom' | 'email'>('custom');
  const [resetSuccessNotice, setResetSuccessNotice] = useState<string | null>(null);
  const [resetErrorNotice, setResetErrorNotice] = useState<string | null>(null);
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);
  const [copiedCredentials, setCopiedCredentials] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<{
    fullname: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    role: UserRole;
    active: boolean;
    bio: string;
    avatar: string;
    initialPassword?: string;
    tempPassword?: string;
  }>({
    fullname: '',
    email: '',
    phone: '',
    position: 'Ủy viên Ban Chấp hành MTTQ',
    department: 'Ban Thường trực MTTQ',
    role: 'STAFF',
    active: true,
    bio: '',
    avatar: AVATAR_PRESETS[0],
    initialPassword: 'ChanhHiep@2026',
    tempPassword: ''
  });

  const [formError, setFormError] = useState<string>('');
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [isFetchingGmail, setIsFetchingGmail] = useState(false);
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Avatar helper: Process file upload with canvas compression
  const processImageUpload = (file: File, callback: (base64: string) => void) => {
    if (!file.type.startsWith('image/')) {
      setFormError('Vui lòng chọn file hình ảnh hợp lệ (.jpg, .png, .webp)');
      return;
    }
    setIsProcessingUpload(true);
    setFormError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const maxSize = 400;
          const minDim = Math.min(img.width, img.height);
          const startX = (img.width - minDim) / 2;
          const startY = (img.height - minDim) / 2;
          canvas.width = maxSize;
          canvas.height = maxSize;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, maxSize, maxSize);
            const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.88);
            callback(optimizedBase64);
          } else {
            callback(e.target?.result as string);
          }
        } catch {
          if (typeof e.target?.result === 'string') {
            callback(e.target.result);
          }
        } finally {
          setIsProcessingUpload(false);
        }
      };
      img.onerror = () => {
        setIsProcessingUpload(false);
        setFormError('Không thể xử lý hình ảnh này.');
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setIsProcessingUpload(false);
      setFormError('Lỗi khi đọc file ảnh.');
    };
    reader.readAsDataURL(file);
  };

  // Avatar helper: Fetch Gmail avatar via email
  const fetchGmailAvatar = (emailInput: string, callback: (url: string) => void) => {
    const trimmed = emailInput.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setFormError('Vui lòng nhập địa chỉ email hợp lệ để lấy avatar.');
      return;
    }
    setIsFetchingGmail(true);
    setFormError('');
    const unavatarUrl = `https://unavatar.io/${encodeURIComponent(trimmed)}?fallback=false`;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      callback(unavatarUrl);
      setIsFetchingGmail(false);
    };
    img.onerror = () => {
      const googleFallback = `https://unavatar.io/google/${encodeURIComponent(trimmed)}`;
      callback(googleFallback);
      setIsFetchingGmail(false);
    };
    img.src = unavatarUrl;
  };

  // KPIs
  const totalCount = staffUsers.length;
  const activeCount = staffUsers.filter(u => u.active).length;
  const lockedCount = totalCount - activeCount;
  const adminCount = staffUsers.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN' || u.role === 'MANAGER').length;

  // Filtered Users
  const filteredUsers = staffUsers.filter(u => {
    if (search) {
      const q = search.toLowerCase();
      const matchName = u.fullname.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchPos = (u.position || '').toLowerCase().includes(q);
      const matchDept = (u.department || '').toLowerCase().includes(q);
      const matchPhone = (u.phone || '').includes(q);
      if (!matchName && !matchEmail && !matchPos && !matchDept && !matchPhone) {
        return false;
      }
    }
    if (roleFilter !== 'ALL' && u.role !== roleFilter) {
      return false;
    }
    if (statusFilter === 'ACTIVE' && !u.active) return false;
    if (statusFilter === 'INACTIVE' && u.active) return false;
    return true;
  });

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData({
      fullname: '',
      email: '',
      phone: '',
      position: 'Cán bộ Chuyên trách MTTQ',
      department: 'Ban Thường trực MTTQ',
      role: 'STAFF',
      active: true,
      bio: '',
      avatar: AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)],
      initialPassword: 'ChanhHiep@2026',
      tempPassword: ''
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (u: StaffUser) => {
    setEditingUser(u);
    setFormData({
      fullname: u.fullname,
      email: u.email,
      phone: u.phone || '',
      position: u.position || '',
      department: u.department || 'Ban Thường trực MTTQ',
      role: u.role,
      active: u.active,
      bio: u.bio || '',
      avatar: u.avatar || AVATAR_PRESETS[0],
      initialPassword: '',
      tempPassword: u.tempPassword || ''
    });
    setFormError('');
  };

  // Open Password Reset Modal
  const handleOpenResetPassword = (u: StaffUser) => {
    setResettingUser(u);
    setNewPasswordInput('ChanhHiep@' + Math.floor(1000 + Math.random() * 9000));
    setResetMethod('custom');
    setResetSuccessNotice(null);
    setResetErrorNotice(null);
    setCopiedCredentials(false);
  };

  // Execute Password Reset
  const handleExecutePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUser) return;
    setResetErrorNotice(null);
    setResetSuccessNotice(null);

    if (resetMethod === 'custom') {
      if (!newPasswordInput || newPasswordInput.trim().length < 6) {
        setResetErrorNotice('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
      }
      const updated: StaffUser = {
        ...resettingUser,
        tempPassword: newPasswordInput.trim(),
        passwordResetAt: new Date().toISOString()
      };
      if (onUpdateUser) {
        onUpdateUser(updated);
      }
      setResetSuccessNotice(`Đã đặt lại mật khẩu mới cho cán bộ "${resettingUser.fullname}" thành công! Mật khẩu hiện tại: ${newPasswordInput.trim()}`);
    } else {
      // Send Firebase password reset email
      setIsSendingResetEmail(true);
      try {
        await sendPasswordResetEmail(auth, resettingUser.email);
        const updated: StaffUser = {
          ...resettingUser,
          passwordResetAt: new Date().toISOString()
        };
        if (onUpdateUser) {
          onUpdateUser(updated);
        }
        setResetSuccessNotice(`ĐÃ GỬI EMAIL THÀNH CÔNG! Hệ thống đã gửi thư chứa liên kết đặt lại mật khẩu đến hòm thư "${resettingUser.email}".`);
      } catch (err: any) {
        console.error('Password reset email error:', err);
        setResetErrorNotice('Không thể gửi email đặt lại mật khẩu: ' + (err.message || 'Lỗi mạng hoặc phân quyền. Bạn có thể sử dụng phương thức Cấp mật khẩu trực tiếp ở trên.'));
      } finally {
        setIsSendingResetEmail(false);
      }
    }
  };

  // Copy Credentials Helper
  const handleCopyCredentials = (u: StaffUser, pass?: string) => {
    const effectivePass = pass || u.tempPassword || 'ChanhHiep@2026';
    const text = `ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP
CỔNG VĂN PHÒNG SỐ & THÔNG TIN ĐIỆN TỬ
------------------------------------------
THÔNG TIN TÀI KHOẢN ĐĂNG NHẬP CÁN BỘ:
- Họ và tên: ${u.fullname}
- Chức danh / Vị trí: ${u.position || 'Cán bộ MTTQ'}
- Bộ phận: ${u.department || 'Ban Thường trực MTTQ'}
- Email đăng nhập: ${u.email}
- Mật khẩu đăng nhập: ${effectivePass}
- Link hệ thống: ${window.location.origin}
------------------------------------------
(Lưu ý: Quý đồng chí vui lòng bảo mật thông tin và đổi mật khẩu sau khi đăng nhập thành công.)`;
    navigator.clipboard.writeText(text);
    setCopiedCredentials(true);
    setTimeout(() => setCopiedCredentials(false), 3000);
  };

  // Submit Add
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullname.trim() || !formData.email.trim()) {
      setFormError('Vui lòng điền đầy đủ Họ tên và Email ủy quyền.');
      return;
    }

    // Check email uniqueness
    const emailExists = staffUsers.some(u => u.email.toLowerCase() === formData.email.trim().toLowerCase());
    if (emailExists) {
      setFormError('Email này đã được ủy quyền cho cán bộ khác. Vui lòng nhập email khác.');
      return;
    }

    const assignedPass = formData.initialPassword?.trim() || 'ChanhHiep@2026';
    const newUser: StaffUser = {
      id: 'staff-' + Date.now(),
      fullname: formData.fullname.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      position: formData.position.trim(),
      department: formData.department.trim(),
      role: formData.role,
      permissions: formData.role === 'SUPER_ADMIN' || formData.role === 'ADMIN' ? ['all'] : ['read', 'write'],
      active: formData.active,
      bio: formData.bio.trim() || undefined,
      avatar: formData.avatar,
      tempPassword: assignedPass,
      passwordResetAt: new Date().toISOString(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (onAddUser) {
      onAddUser(newUser);
    }
    setIsAddModalOpen(false);
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!formData.fullname.trim() || !formData.email.trim()) {
      setFormError('Vui lòng điền đầy đủ Họ tên và Email.');
      return;
    }

    // Check duplicate email with others
    const emailExists = staffUsers.some(
      u => u.id !== editingUser.id && u.email.toLowerCase() === formData.email.trim().toLowerCase()
    );
    if (emailExists) {
      setFormError('Email này đã được sử dụng bởi một cán bộ khác.');
      return;
    }

    const updated: StaffUser = {
      ...editingUser,
      fullname: formData.fullname.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      position: formData.position.trim(),
      department: formData.department.trim(),
      role: formData.role,
      active: formData.active,
      bio: formData.bio.trim() || undefined,
      avatar: formData.avatar,
      tempPassword: formData.tempPassword?.trim() || editingUser.tempPassword
    };

    if (onUpdateUser) {
      onUpdateUser(updated);
    }
    setEditingUser(null);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deletingUser) return;
    if (onDeleteUser) {
      onDeleteUser(deletingUser.id);
    }
    setDeletingUser(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner - Bright Vibrant Gradient */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white p-6 sm:p-7 shadow-xl border border-blue-400/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white shadow-sm border border-white/30">
              <Users className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  QUẢN LÝ CÁN BỘ &amp; PHÂN QUYỀN HỆ THỐNG
                </h1>
                <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full shadow-xs">
                  RBAC V2.0
                </span>
              </div>
              <p className="text-xs text-blue-100 font-medium mt-0.5">
                Thêm, sửa thông tin, phân quyền chức danh, quản lý trạng thái kích hoạt cán bộ Mặt trận Phường Chánh Hiệp
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onOpenDigitalDirectory && (
            <button
              onClick={onOpenDigitalDirectory}
              className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 shrink-0 border border-white/40 cursor-pointer backdrop-blur-xs"
            >
              <Phone className="w-4 h-4 text-amber-300" />
              <span>Danh Bạ Số Cán Bộ</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-105 text-slate-900 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95 shrink-0 border border-amber-200 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-slate-950" />
            <span>Thêm Cán Bộ Mới</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tổng Cán bộ</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{totalCount}</div>
            <span className="text-[10px] text-blue-600 font-semibold">Tất cả tài khoản</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Đang hoạt động</span>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">{activeCount}</div>
            <span className="text-[10px] text-emerald-600 font-semibold">Đã duyệt truy cập</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tạm khóa / Chờ duyệt</span>
            <div className="text-2xl font-black text-amber-600 mt-0.5">{lockedCount}</div>
            <span className="text-[10px] text-amber-600 font-semibold">Chưa thể đăng nhập</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Lãnh đạo &amp; Quản trị</span>
            <div className="text-2xl font-black text-indigo-600 mt-0.5">{adminCount}</div>
            <span className="text-[10px] text-indigo-600 font-semibold">Admin / Quản lý</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tìm theo họ tên, email, chức vụ, số điện thoại, khu phố..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Role & Status */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status Select */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">✓ Đang hoạt động ({activeCount})</option>
            <option value="INACTIVE">✕ Tạm khóa ({lockedCount})</option>
          </select>

          {/* Role Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {['ALL', 'SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EDITOR', 'STAFF'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                  roleFilter === r
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r === 'ALL' ? 'Tất cả vai trò' : r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-gradient-to-r from-slate-50 to-blue-50/50 text-slate-700 font-extrabold border-b border-slate-200">
              <tr>
                <th className="p-3.5 pl-4">Họ tên &amp; Cán bộ</th>
                <th className="p-3.5">Chức vụ &amp; Đơn vị</th>
                <th className="p-3.5">Cấp vai trò</th>
                <th className="p-3.5">Email &amp; Điện thoại</th>
                <th className="p-3.5">Trạng thái</th>
                <th className="p-3.5 pr-4 text-right">Thao tác quản trị</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-sm text-slate-600">Không tìm thấy cán bộ phù hợp</p>
                    <p className="text-xs text-slate-400 mt-1">Thử thay đổi từ khóa tìm kiếm hoặc bỏ bộ lọc</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrent = currentStaffUser?.id === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-blue-50/40 transition-colors">
                      {/* Name & Avatar */}
                      <td className="p-3.5 pl-4 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-xs overflow-hidden shadow-xs border border-white">
                              {u.avatar ? (
                                <img src={u.avatar} alt={u.fullname} className="w-full h-full object-cover" />
                              ) : (
                                <span>{u.fullname.charAt(0)}</span>
                              )}
                            </div>
                            {u.active ? (
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" title="Đang hoạt động" />
                            ) : (
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-amber-500 rounded-full border-2 border-white" title="Tạm khóa" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-900 hover:text-blue-600 cursor-pointer" onClick={() => setViewingUser(u)}>
                                {u.fullname}
                              </span>
                              {isCurrent && (
                                <span className="bg-blue-100 text-blue-800 text-[9px] font-black px-1.5 py-0.2 rounded border border-blue-200">
                                  Bạn
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-normal">
                              Tạo ngày: {u.createdAt || '2026-01-01'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Position & Department */}
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{u.position || 'Chuyên viên MTTQ'}</div>
                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{u.department || 'Ban Thường trực'}</span>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="p-3.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] shadow-2xs ${getRoleBadgeStyle(u.role)}`}>
                          {getRoleLabel(u.role)}
                        </span>
                        {u.role === 'SUPER_ADMIN' && (
                          <span className="block text-[9px] font-black text-red-600 uppercase mt-0.5">
                            ★ Toàn quyền
                          </span>
                        )}
                      </td>

                      {/* Email & Phone */}
                      <td className="p-3.5">
                        <div className="font-mono text-[11px] text-slate-700 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{u.email}</span>
                        </div>
                        {u.phone && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{u.phone}</span>
                          </div>
                        )}
                        {u.tempPassword && (
                          <div className="mt-1 flex items-center gap-1">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-800 text-[9px] font-bold rounded border border-amber-200">
                              <Key className="w-2.5 h-2.5 text-amber-600" />
                              <span>Pass: {u.tempPassword}</span>
                            </span>
                            <button
                              onClick={() => handleCopyCredentials(u, u.tempPassword)}
                              title="Sao chép thông tin tài khoản & mật khẩu"
                              className="p-0.5 text-slate-400 hover:text-blue-600 cursor-pointer"
                            >
                              <Copy className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        {u.active ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold text-[10px] rounded-lg border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Hoạt động</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 font-bold text-[10px] rounded-lg border border-amber-300">
                            <Lock className="w-3.5 h-3.5 text-amber-700" />
                            <span>Tạm khóa</span>
                          </span>
                        )}
                      </td>

                      {/* Actions: View, Edit, Reset Password, Toggle Lock, Delete */}
                      <td className="p-3.5 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View button */}
                          <button
                            onClick={() => setViewingUser(u)}
                            title="Xem chi tiết hồ sơ cán bộ"
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-blue-200"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Reset Password button */}
                          <button
                            onClick={() => handleOpenResetPassword(u)}
                            title="Cấp lại & Đặt lại mật khẩu cán bộ"
                            className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-amber-200"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          {/* Edit button */}
                          <button
                            onClick={() => handleOpenEdit(u)}
                            title="Sửa thông tin cán bộ"
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-blue-200"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Toggle Active Lock */}
                          <button
                            onClick={() => onToggleUserActive && onToggleUserActive(u.id)}
                            title={u.active ? "Tạm khóa quyền truy cập" : "Mở khóa / Kích hoạt tài khoản"}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer border ${
                              u.active 
                                ? 'text-amber-700 hover:bg-amber-50 border-transparent hover:border-amber-200' 
                                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                            }`}
                          >
                            {u.active ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </button>

                          {/* Delete button (Protected from deleting yourself if logged in) */}
                          <button
                            onClick={() => setDeletingUser(u)}
                            disabled={isCurrent}
                            title={isCurrent ? "Không thể xóa chính tài khoản đang đăng nhập" : "Xóa cán bộ"}
                            className={`p-1.5 rounded-lg transition-colors border border-transparent ${
                              isCurrent 
                                ? 'text-slate-300 cursor-not-allowed' 
                                : 'text-red-600 hover:text-red-800 hover:bg-red-50 hover:border-red-200 cursor-pointer'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: THÊM CÁN BỘ MỚI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 my-8"
          >
            <div className="flex items-center justify-between border-b pb-3.5 border-slate-200">
              <div className="flex items-center gap-2 text-blue-700">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base text-slate-900">Thêm Cán Bộ Ủy Quyền Mới</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Họ và Tên Cán bộ *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Google Ủy quyền *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="cambo@chanhhiep.gov.vn"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại liên hệ</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0908.xxx.xxx"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cấp Vai trò &amp; Quyền hạn *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs font-bold text-slate-800"
                  >
                    <option value="STAFF">Cán bộ / Chuyên viên (STAFF) - Đọc & Tạo tác vụ</option>
                    <option value="EDITOR">Biên tập viên (EDITOR) - Quản trị tin tức, văn bản</option>
                    <option value="MANAGER">Trưởng/Phó Ban (MANAGER) - Duyệt nội dung, báo cáo</option>
                    <option value="ADMIN">Quản trị viên (ADMIN) - Quản trị toàn diện</option>
                    <option value="SUPER_ADMIN">Lãnh đạo Tối cao (SUPER_ADMIN) - Toàn quyền hệ thống</option>
                  </select>
                </div>
              </div>

              {/* Initial Password for New Staff */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-amber-950 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                    <span>Mật khẩu khởi tạo đăng nhập *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, initialPassword: 'ChanhHiep@' + Math.floor(1000 + Math.random() * 9000) })}
                    className="text-[10px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Tạo ngẫu nhiên</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formData.initialPassword || ''}
                  onChange={(e) => setFormData({ ...formData, initialPassword: e.target.value })}
                  placeholder="Ví dụ: ChanhHiep@2026"
                  className="w-full px-3.5 py-2 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-xs font-mono font-bold text-slate-900"
                />
                <p className="text-[10px] text-amber-800 leading-relaxed">
                  💡 Cán bộ có thể dùng mật khẩu này kết hợp cùng Email ủy quyền để đăng nhập ngay vào Văn phòng số.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chức vụ cụ thể</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="Chủ tịch, Phó Chủ tịch, Trưởng ban..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đơn vị / Ban chuyên trách</label>
                  <input
                    list="departments-list"
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Chọn hoặc nhập phòng ban..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs"
                  />
                  <datalist id="departments-list">
                    {DEPARTMENT_PRESETS.map((dept, i) => (
                      <option key={i} value={dept} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Avatar Picker with Upload & Gmail Fetch */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Ảnh đại diện cán bộ</label>
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl mb-2">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-blue-600 shadow-sm shrink-0 bg-white">
                    <img src={formData.avatar} alt="avatar preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <input 
                        type="file" 
                        ref={addFileInputRef} 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) processImageUpload(file, (b64) => setFormData({ ...formData, avatar: b64 }));
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => addFileInputRef.current?.click()}
                        disabled={isProcessingUpload}
                        className="px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg border border-blue-200 transition-all flex items-center gap-1.5 cursor-pointer text-[11px]"
                      >
                        {isProcessingUpload ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>Tải ảnh lên</span>
                      </button>

                      <button
                        type="button"
                        disabled={isFetchingGmail || !formData.email}
                        onClick={() => fetchGmailAvatar(formData.email, (url) => setFormData({ ...formData, avatar: url }))}
                        className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-lg border border-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer text-[11px] disabled:opacity-50"
                      >
                        {isFetchingGmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                        <span>Lấy từ Gmail</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-700">Chọn ảnh mẫu bên dưới hoặc tải ảnh cá nhân từ máy</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {AVATAR_PRESETS.map((av, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setFormData({ ...formData, avatar: av })}
                      className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        formData.avatar === av ? 'border-blue-600 scale-105 shadow-md ring-2 ring-blue-300' : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="avatar" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú / Giới thiệu</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Mô tả tóm tắt quá trình công tác, phân công nhiệm vụ..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="add-active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                />
                <label htmlFor="add-active" className="font-bold text-slate-700 cursor-pointer">
                  Kích hoạt tài khoản ngay sau khi tạo (Cán bộ có thể đăng nhập)
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Xác nhận thêm Cán bộ</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL 2: SỬA THÔNG TIN CÁN BỘ */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 my-8"
          >
            <div className="flex items-center justify-between border-b pb-3.5 border-slate-200">
              <div className="flex items-center gap-2 text-blue-700">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base text-slate-900">Chỉnh Sửa Thông Tin Cán Bộ</h3>
              </div>
              <button 
                onClick={() => setEditingUser(null)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Họ và Tên Cán bộ *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Google Ủy quyền *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cấp Vai trò &amp; Quyền hạn</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs font-bold text-slate-800"
                  >
                    <option value="STAFF">Cán bộ / Chuyên viên (STAFF)</option>
                    <option value="EDITOR">Biên tập viên (EDITOR)</option>
                    <option value="MANAGER">Trưởng/Phó Ban (MANAGER)</option>
                    <option value="ADMIN">Quản trị viên (ADMIN)</option>
                    <option value="SUPER_ADMIN">Lãnh đạo Tối cao (SUPER_ADMIN)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chức vụ</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đơn vị / Ban chuyên trách</label>
                  <input
                    list="departments-list-edit"
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs"
                  />
                  <datalist id="departments-list-edit">
                    {DEPARTMENT_PRESETS.map((dept, i) => (
                      <option key={i} value={dept} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Avatar Picker with Upload & Gmail Fetch */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Ảnh đại diện cán bộ</label>
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl mb-2">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-blue-600 shadow-sm shrink-0 bg-white">
                    <img src={formData.avatar} alt="avatar preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <input 
                        type="file" 
                        ref={editFileInputRef} 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) processImageUpload(file, (b64) => setFormData({ ...formData, avatar: b64 }));
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => editFileInputRef.current?.click()}
                        disabled={isProcessingUpload}
                        className="px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg border border-blue-200 transition-all flex items-center gap-1.5 cursor-pointer text-[11px]"
                      >
                        {isProcessingUpload ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>Tải ảnh lên</span>
                      </button>

                      <button
                        type="button"
                        disabled={isFetchingGmail || !formData.email}
                        onClick={() => fetchGmailAvatar(formData.email, (url) => setFormData({ ...formData, avatar: url }))}
                        className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-lg border border-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer text-[11px] disabled:opacity-50"
                      >
                        {isFetchingGmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                        <span>Lấy từ Gmail</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-700">Chọn ảnh mẫu bên dưới hoặc tải ảnh cá nhân từ máy</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {AVATAR_PRESETS.map((av, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setFormData({ ...formData, avatar: av })}
                      className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        formData.avatar === av ? 'border-blue-600 scale-105 shadow-md ring-2 ring-blue-300' : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="avatar" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Password Management for Edit Modal */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                    <span>Mật khẩu đăng nhập cán bộ</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (editingUser) {
                        const target = { ...editingUser, ...formData };
                        setEditingUser(null);
                        handleOpenResetPassword(target);
                      }
                    }}
                    className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>Mở công cụ Đặt lại Pass</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.tempPassword || ''}
                    onChange={(e) => setFormData({ ...formData, tempPassword: e.target.value })}
                    placeholder="Nhập mật khẩu mới nếu muốn thay đổi..."
                    className="flex-1 px-3 py-2 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-xs font-mono font-bold text-slate-900"
                  />
                  {formData.tempPassword && (
                    <button
                      type="button"
                      onClick={() => handleCopyCredentials(editingUser, formData.tempPassword)}
                      className="px-2.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                      title="Sao chép"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú / Giới thiệu</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="edit-active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                />
                <label htmlFor="edit-active" className="font-bold text-slate-700 cursor-pointer">
                  Tài khoản đang hoạt động (Bỏ chọn để tạm khóa truy cập)
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL 3: XEM CHI TIẾT HỒ SƠ CÁN BỘ */}
      {viewingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 relative overflow-hidden"
          >
            <div className="h-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 -mx-6 -mt-6 p-4 flex justify-end">
              <button 
                onClick={() => setViewingUser(null)} 
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-end gap-3 -mt-12 px-2">
              <div className="w-18 h-18 rounded-2xl bg-white p-1 shadow-lg border-2 border-white overflow-hidden shrink-0">
                {viewingUser.avatar ? (
                  <img src={viewingUser.avatar} alt={viewingUser.fullname} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center font-black text-xl rounded-xl">
                    {viewingUser.fullname.charAt(0)}
                  </div>
                )}
              </div>
              <div className="pb-1">
                <h3 className="text-base font-black text-slate-900">{viewingUser.fullname}</h3>
                <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] mt-0.5 ${getRoleBadgeStyle(viewingUser.role)}`}>
                  {getRoleLabel(viewingUser.role)}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Chức vụ:</span>
                  <span className="font-bold text-slate-900">{viewingUser.position}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Đơn vị / Ban:</span>
                  <span className="font-bold text-slate-900">{viewingUser.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Email Google:</span>
                  <span className="font-mono text-slate-900 font-bold">{viewingUser.email}</span>
                </div>
                {viewingUser.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Số điện thoại:</span>
                    <span className="font-bold text-slate-900">{viewingUser.phone}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Trạng thái:</span>
                  {viewingUser.active ? (
                    <span className="text-emerald-700 font-black">✓ Đang hoạt động</span>
                  ) : (
                    <span className="text-amber-700 font-black">✕ Tạm khóa</span>
                  )}
                </div>
                {viewingUser.tempPassword && (
                  <div className="flex items-center justify-between p-2 bg-amber-50 rounded-lg border border-amber-200">
                    <span className="text-amber-900 font-bold flex items-center gap-1">
                      <Key className="w-3 h-3 text-amber-600" />
                      <span>Mật khẩu:</span>
                    </span>
                    <span className="font-mono font-black text-amber-900">{viewingUser.tempPassword}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Ngày khởi tạo:</span>
                  <span className="text-slate-700">{viewingUser.createdAt || '2026-01-01'}</span>
                </div>
              </div>

              {viewingUser.bio && (
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
                  <strong>Giới thiệu:</strong> {viewingUser.bio}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleCopyCredentials(viewingUser)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCredentials ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCredentials ? 'Đã sao chép!' : 'Sao chép thông tin'}</span>
              </button>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const u = viewingUser;
                    setViewingUser(null);
                    handleOpenResetPassword(u);
                  }}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Đặt lại pass</span>
                </button>
                <button
                  onClick={() => {
                    const u = viewingUser;
                    setViewingUser(null);
                    handleOpenEdit(u);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa hồ sơ</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL 5: ĐẶT LẠI MẬT KHẨU CÁN BỘ (RESET PASSWORD) */}
      {resettingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 my-8"
          >
            <div className="flex items-center justify-between border-b pb-3.5 border-slate-200">
              <div className="flex items-center gap-2.5 text-amber-700">
                <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Đặt Lại / Cấp Lại Mật Khẩu</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Cán bộ: <strong className="text-slate-800">{resettingUser.fullname}</strong> ({resettingUser.email})</p>
                </div>
              </div>
              <button 
                onClick={() => setResettingUser(null)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {resetSuccessNotice && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-extrabold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{resetSuccessNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCredentials(resettingUser, newPasswordInput)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  {copiedCredentials ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCredentials ? '✓ Đã sao chép thông tin gửi Zalo/SMS!' : 'Sao chép thông tin tài khoản gửi cho Cán bộ'}</span>
                </button>
              </div>
            )}

            {resetErrorNotice && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{resetErrorNotice}</span>
              </div>
            )}

            <form onSubmit={handleExecutePasswordReset} className="space-y-4 text-xs">
              {/* Reset Method Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setResetMethod('custom');
                    setResetSuccessNotice(null);
                    setResetErrorNotice(null);
                  }}
                  className={`py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    resetMethod === 'custom'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Cấp mật khẩu trực tiếp</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setResetMethod('email');
                    setResetSuccessNotice(null);
                    setResetErrorNotice(null);
                  }}
                  className={`py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    resetMethod === 'email'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi link qua Email</span>
                </button>
              </div>

              {resetMethod === 'custom' ? (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-amber-950">Mật khẩu mới cho cán bộ *</label>
                    <button
                      type="button"
                      onClick={() => setNewPasswordInput('ChanhHiep@' + Math.floor(1000 + Math.random() * 9000))}
                      className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Đổi ngẫu nhiên</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="Nhập mật khẩu mới..."
                      className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    ℹ️ Sau khi bấm <strong>"Xác nhận cấp mật khẩu"</strong>, bạn có thể sao chép thông tin để gửi trực tiếp qua Zalo, SMS hoặc văn bản bàn giao cho cán bộ.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                  <div className="font-bold text-blue-950 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>Gửi liên kết khôi phục tới hòm thư:</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-blue-200 font-mono font-bold text-slate-800 text-xs">
                    {resettingUser.email}
                  </div>
                  <p className="text-[11px] text-blue-900 leading-relaxed">
                    ℹ️ Hệ thống Google Firebase Authentication sẽ tự động gửi một email chứa đường link an toàn để cán bộ tự tạo mật khẩu mới.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setResettingUser(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={isSendingResetEmail}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isSendingResetEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  <span>{resetMethod === 'custom' ? 'Xác nhận cấp Mật khẩu mới' : 'Gửi Email đặt lại Mật khẩu'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL 4: XÁC NHẬN XÓA CÁN BỘ */}
      {deletingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-black text-base text-slate-900">Xóa Cán Bộ Này?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Bạn có chắc chắn muốn xóa cán bộ <strong className="text-slate-900">{deletingUser.fullname}</strong> ({deletingUser.email}) khỏi hệ thống Văn phòng số?
              </p>
            </div>

            <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-[11px] text-red-700 text-left">
              ⚠️ Hành động này sẽ thu hồi toàn bộ quyền truy cập của cán bộ.
            </div>

            <div className="flex justify-center gap-2.5 pt-2">
              <button
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xác nhận xóa</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
