import React, { useState, useRef } from 'react';
import { StaffUser, UserRole, UserPermissions } from '../../types';
import { getOfficialCadreAvatarSvg } from '../../utils/officialImages';
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
  Send,
  Wrench,
  Layers,
  Database,
  RefreshCw,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getRoleBadgeStyle, 
  getRoleLabel,
  DEFAULT_ROLE_PERMISSIONS,
  getUserEffectivePermissions,
  canModifyUser,
  runPermissionDiagnostics,
  PermissionDiagnosticReport,
  isSuperAdmin,
  isAdmin
} from '../../lib/rbac';
import { auth } from '../../lib/firebase';
import { CloudDatabase } from '../../lib/firestoreService';
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
  getOfficialCadreAvatarSvg('Chủ tịch', 'MTTQ'),
  getOfficialCadreAvatarSvg('Phó Chủ tịch', 'MTTQ'),
  getOfficialCadreAvatarSvg('Ủy viên', 'Thường trực'),
  getOfficialCadreAvatarSvg('Cán bộ', 'Tuyên giáo'),
  getOfficialCadreAvatarSvg('Trưởng ban', 'Khu phố'),
  getOfficialCadreAvatarSvg('Chuyên viên', 'Văn phòng'),
  'https://res.cloudinary.com/idt08wyp/image/upload/v1789907080/Logo-Mat-Tran-To-Quoc-Viet-Nam.png'
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

  // Diagnostic Modal state
  const [diagnosingUser, setDiagnosingUser] = useState<StaffUser | null>(null);
  const [diagnosticReport, setDiagnosticReport] = useState<PermissionDiagnosticReport | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);
  const [repairSuccessNotice, setRepairSuccessNotice] = useState<string | null>(null);

  // Password reset state
  const [newPasswordInput, setNewPasswordInput] = useState('ChanhHiep@2026');
  const [resetMethod, setResetMethod] = useState<'custom' | 'email'>('custom');
  const [resetSuccessNotice, setResetSuccessNotice] = useState<string | null>(null);
  const [resetErrorNotice, setResetErrorNotice] = useState<string | null>(null);
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);
  const [copiedCredentials, setCopiedCredentials] = useState(false);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

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
    permissionMap: UserPermissions;
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
    tempPassword: '',
    permissionMap: { ...DEFAULT_ROLE_PERMISSIONS.STAFF }
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
  const activeCount = staffUsers.filter(u => u.active !== false && u.status !== 'inactive').length;
  const lockedCount = totalCount - activeCount;
  const adminCount = staffUsers.filter(u => ['SUPER_ADMIN', 'MTTQ_ADMIN', 'ADMIN', 'MANAGER', 'LEADER'].includes(u.role)).length;

  // Filtered Users
  const filteredUsers = staffUsers.filter(u => {
    if (search) {
      const q = search.toLowerCase();
      const matchName = (u.fullname || '').toLowerCase().includes(q);
      const matchEmail = (u.email || '').toLowerCase().includes(q);
      const matchPos = (u.position || '').toLowerCase().includes(q);
      const matchDept = (u.department || '').toLowerCase().includes(q);
      const matchPhone = (u.phone || '').includes(q);
      const matchId = (u.id || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPos && !matchDept && !matchPhone && !matchId) {
        return false;
      }
    }
    if (roleFilter !== 'ALL' && u.role !== roleFilter) {
      return false;
    }
    const isActive = u.active !== false && u.status !== 'inactive';
    if (statusFilter === 'ACTIVE' && !isActive) return false;
    if (statusFilter === 'INACTIVE' && isActive) return false;
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
      role: 'ADMIN',
      active: true,
      bio: '',
      avatar: AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)],
      initialPassword: 'ChanhHiep@2026',
      tempPassword: '',
      permissionMap: { ...DEFAULT_ROLE_PERMISSIONS.ADMIN }
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (u: StaffUser) => {
    const modCheck = canModifyUser(currentStaffUser, u);
    if (!modCheck.allowed) {
      alert(modCheck.reason || 'Bạn không có quyền chỉnh sửa tài khoản này.');
      return;
    }

    const effective = getUserEffectivePermissions(u);
    setEditingUser(u);
    setFormData({
      fullname: u.fullname || '',
      email: u.email || '',
      phone: u.phone || '',
      position: u.position || '',
      department: u.department || 'Ban Thường trực MTTQ',
      role: u.role,
      active: u.active !== false && u.status !== 'inactive',
      bio: u.bio || '',
      avatar: u.avatar || AVATAR_PRESETS[0],
      initialPassword: '',
      tempPassword: u.tempPassword || '',
      permissionMap: effective
    });
    setFormError('');
  };

  // Role Change in Modal - Auto updates default permissions
  const handleRoleChange = (newRole: UserRole) => {
    const defaultPerms = DEFAULT_ROLE_PERMISSIONS[newRole] || DEFAULT_ROLE_PERMISSIONS.STAFF;
    setFormData(prev => ({
      ...prev,
      role: newRole,
      permissionMap: { ...defaultPerms }
    }));
  };

  // Toggle individual permission checkbox
  const handleTogglePermission = (key: keyof UserPermissions) => {
    setFormData(prev => ({
      ...prev,
      permissionMap: {
        ...prev.permissionMap,
        [key]: !prev.permissionMap[key]
      }
    }));
  };

  // Open Diagnostic Modal
  const handleOpenDiagnostics = async (u: StaffUser) => {
    setDiagnosingUser(u);
    setDiagnosticReport(null);
    setRepairSuccessNotice(null);
    setIsDiagnosing(true);
    try {
      const report = await runPermissionDiagnostics(u);
      setDiagnosticReport(report);
    } catch (err: any) {
      console.error('Diagnostics error:', err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  // Auto-Repair & Sync Cloud Profile
  const handleAutoRepairUser = async () => {
    if (!diagnosingUser) return;
    setIsRepairing(true);
    setRepairSuccessNotice(null);
    try {
      const perms = getUserEffectivePermissions(diagnosingUser);
      const repaired: StaffUser = {
        ...diagnosingUser,
        permissionMap: perms,
        status: 'active',
        active: true,
        organizationId: diagnosingUser.organizationId || 'mttq-chanhhiep',
        updatedAt: new Date().toISOString()
      };

      await CloudDatabase.saveStaffUser(repaired);
      if (onUpdateUser) {
        onUpdateUser(repaired);
      }
      
      // Re-run diagnostic
      const newReport = await runPermissionDiagnostics(repaired);
      setDiagnosticReport(newReport);
      setRepairSuccessNotice('ĐÃ TỰ ĐỘNG ĐỒNG BỘ THÀNH CÔNG! Hồ sơ cán bộ đã được cập nhật và liên kết đầy đủ quyền lên Cloud Firestore.');
    } catch (err: any) {
      console.error('Repair error:', err);
    } finally {
      setIsRepairing(false);
    }
  };

  // Open Password Reset Modal
  const handleOpenResetPassword = (u: StaffUser) => {
    const modCheck = canModifyUser(currentStaffUser, u);
    if (!modCheck.allowed) {
      alert(modCheck.reason || 'Bạn không có quyền đặt lại mật khẩu cho tài khoản này.');
      return;
    }

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
- Vai trò: ${getRoleLabel(u.role)} (${u.role})
- Email đăng nhập: ${u.email}
- Mật khẩu đăng nhập: ${effectivePass}
- Link hệ thống: ${window.location.origin}
------------------------------------------
(Lưu ý: Quý đồng chí vui lòng bảo mật thông tin và đổi mật khẩu sau khi đăng nhập thành công.)`;
    navigator.clipboard.writeText(text);
    setCopiedCredentials(true);
    setTimeout(() => setCopiedCredentials(false), 3000);
  };

  const handleCopyUid = (uid: string) => {
    navigator.clipboard.writeText(uid);
    setCopiedUid(uid);
    setTimeout(() => setCopiedUid(null), 2000);
  };

  // Submit Add
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullname.trim() || !formData.email.trim()) {
      setFormError('Vui lòng điền đầy đủ Họ tên và Email ủy quyền.');
      return;
    }

    const emailExists = staffUsers.some(u => u.email.toLowerCase() === formData.email.trim().toLowerCase());
    if (emailExists) {
      setFormError('Email này đã được ủy quyền cho cán bộ khác. Vui lòng nhập email khác.');
      return;
    }

    const assignedPass = formData.initialPassword?.trim() || 'ChanhHiep@2026';
    const now = new Date().toISOString();
    const newUser: StaffUser = {
      id: 'staff-' + Date.now(),
      fullname: formData.fullname.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim() || undefined,
      position: formData.position.trim(),
      department: formData.department.trim(),
      role: formData.role,
      permissions: ['all'],
      permissionMap: formData.permissionMap,
      status: formData.active ? 'active' : 'inactive',
      organizationId: 'mttq-chanhhiep',
      active: formData.active,
      bio: formData.bio.trim() || undefined,
      avatar: formData.avatar,
      tempPassword: assignedPass,
      passwordResetAt: now,
      createdAt: now.split('T')[0],
      updatedAt: now
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

    const emailExists = staffUsers.some(
      u => u.id !== editingUser.id && u.email.toLowerCase() === formData.email.trim().toLowerCase()
    );
    if (emailExists) {
      setFormError('Email này đã được sử dụng bởi một cán bộ khác.');
      return;
    }

    const now = new Date().toISOString();
    const updated: StaffUser = {
      ...editingUser,
      fullname: formData.fullname.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim() || undefined,
      position: formData.position.trim(),
      department: formData.department.trim(),
      role: formData.role,
      permissionMap: formData.permissionMap,
      status: formData.active ? 'active' : 'inactive',
      organizationId: editingUser.organizationId || 'mttq-chanhhiep',
      active: formData.active,
      bio: formData.bio.trim() || undefined,
      avatar: formData.avatar,
      tempPassword: formData.tempPassword?.trim() || editingUser.tempPassword,
      updatedAt: now
    };

    if (onUpdateUser) {
      onUpdateUser(updated);
    }
    setEditingUser(null);
  };

  // Open Delete Modal
  const handleOpenDelete = (u: StaffUser) => {
    const modCheck = canModifyUser(currentStaffUser, u);
    if (!modCheck.allowed) {
      alert(modCheck.reason || 'Bạn không có quyền xóa tài khoản này.');
      return;
    }
    if (u.id === currentStaffUser?.id) {
      alert('Bạn không thể tự xóa tài khoản của chính mình.');
      return;
    }
    setDeletingUser(u);
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
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white p-6 sm:p-7 shadow-xl border border-blue-400/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white shadow-sm border border-white/30">
              <Users className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  QUẢN LÝ CÁN BỘ &amp; PHÂN QUYỀN HỆ THỐNG (RBAC)
                </h1>
                <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full shadow-xs">
                  RBAC V2.0 MULTI-ADMIN
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-1 font-medium">
                Cơ chế phân quyền theo vai trò và UID độc lập, hỗ trợ không giới hạn Admin và phân quyền bài viết, văn bản chi tiết.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {currentStaffUser && (
            <button
              onClick={() => handleOpenDiagnostics(currentStaffUser)}
              className="px-3.5 py-2.5 bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-100 font-extrabold text-xs rounded-2xl border border-emerald-300/40 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
              title="Kiểm tra trạng thái quyền của tài khoản bạn"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Kiểm Tra Quyền Của Bạn</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs rounded-2xl transition-all shadow-lg flex items-center gap-2 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4 text-slate-900" />
            <span>Thêm Cán Bộ &amp; Cấp Quyền</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tổng số cán bộ</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{totalCount}</div>
            <span className="text-[10px] text-slate-400 font-medium">Toàn hệ thống</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Đang hoạt động</span>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">{activeCount}</div>
            <span className="text-[10px] text-emerald-600 font-semibold">Được phép đăng nhập</span>
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
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quản trị &amp; Lãnh đạo</span>
            <div className="text-2xl font-black text-indigo-600 mt-0.5">{adminCount}</div>
            <span className="text-[10px] text-indigo-600 font-semibold">Admin / Super Admin</span>
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
            placeholder="Tìm theo họ tên, email, UID, chức vụ, số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Role & Status */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">✓ Đang hoạt động ({activeCount})</option>
            <option value="INACTIVE">✕ Tạm khóa ({lockedCount})</option>
          </select>

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
                {r === 'ALL' ? 'Tất cả vai trò' : getRoleLabel(r as UserRole)}
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
                <th className="p-3.5 pl-4">Họ tên &amp; Hồ sơ Cán bộ</th>
                <th className="p-3.5">Chức vụ &amp; Đơn vị</th>
                <th className="p-3.5">Vai trò &amp; Quyền hạn</th>
                <th className="p-3.5">Email &amp; UID Định Danh</th>
                <th className="p-3.5">Trạng thái</th>
                <th className="p-3.5 pr-4 text-right">Thao tác &amp; Kiểm tra</th>
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
                  const isSuper = isSuperAdmin(u);
                  const effectivePerms = getUserEffectivePermissions(u);
                  const isActive = u.active !== false && u.status !== 'inactive';

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
                                <span>{u.fullname ? u.fullname.charAt(0) : 'U'}</span>
                              )}
                            </div>
                            {isActive ? (
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
                              {isSuper && (
                                <span className="bg-amber-100 text-amber-900 text-[9px] font-black px-1.5 py-0.2 rounded border border-amber-300">
                                  Gốc
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
                        <div className="font-bold text-slate-900">{u.position || 'Cán bộ MTTQ'}</div>
                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{u.department || 'Ban Thường trực'}</span>
                        </div>
                      </td>

                      {/* Role & Permissions */}
                      <td className="p-3.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${getRoleBadgeStyle(u.role)}`}>
                          {getRoleLabel(u.role)}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1 text-[9px]">
                          {effectivePerms.post_publish && (
                            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-semibold">Xuất bản</span>
                          )}
                          {effectivePerms.post_create && (
                            <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-semibold">Đăng bài</span>
                          )}
                          {effectivePerms.document_create && (
                            <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded font-semibold">Văn bản</span>
                          )}
                          {effectivePerms.user_manage && (
                            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-semibold">Quản trị user</span>
                          )}
                        </div>
                      </td>

                      {/* Email & UID */}
                      <td className="p-3.5 font-mono text-[11px] text-slate-700">
                        <div className="flex items-center gap-1 font-bold text-slate-900">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{u.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                          <Key className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[130px]" title={u.id}>UID: {u.id}</span>
                          <button
                            onClick={() => handleCopyUid(u.id)}
                            className="text-slate-400 hover:text-blue-600 ml-1 cursor-pointer"
                            title="Sao chép UID"
                          >
                            {copiedUid === u.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Hoạt động</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full text-[10px] font-bold border border-amber-200">
                            <Lock className="w-3 h-3" />
                            <span>Tạm khóa</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* KIỂM TRA QUYỀN BUTTON */}
                          <button
                            onClick={() => handleOpenDiagnostics(u)}
                            className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer border border-emerald-200"
                            title="Kiểm tra quyền & Chẩn đoán Cloud Firestore"
                          >
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          </button>

                          {/* Reset Password */}
                          <button
                            onClick={() => handleOpenResetPassword(u)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Đặt lại mật khẩu"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          {/* Toggle Active */}
                          {onToggleUserActive && (
                            <button
                              onClick={() => onToggleUserActive(u.id)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                isActive 
                                  ? 'text-amber-600 hover:bg-amber-50' 
                                  : 'text-emerald-600 hover:bg-emerald-50'
                              }`}
                              title={isActive ? 'Khóa tài khoản' : 'Kích hoạt tài khoản'}
                            >
                              {isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                            </button>
                          )}

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Chỉnh sửa hồ sơ & Phân quyền"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleOpenDelete(u)}
                            disabled={isSuper}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            title={isSuper ? 'Không thể xóa Super Admin' : 'Xóa cán bộ'}
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

      {/* =========================================================
          MODAL 1: CÔNG CỤ "KIỂM TRA QUYỀN" (PERMISSION DIAGNOSTICS)
          ========================================================= */}
      {diagnosingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 rounded-2xl text-emerald-800">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    CÔNG CỤ KIỂM TRA QUYỀN &amp; ĐỒNG BỘ CLOUD
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Chẩn đoán chi tiết cho cán bộ: <strong className="text-slate-800">{diagnosingUser.fullname}</strong> ({diagnosingUser.email})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setDiagnosingUser(null)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Diagnostic Content */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
              {isDiagnosing ? (
                <div className="p-8 text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                  <p className="font-bold text-slate-700">Đang quét Firebase Auth, Firestore Rules và Schema RBAC...</p>
                </div>
              ) : diagnosticReport ? (
                <div className="space-y-3">
                  {/* Summary Status Box */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    diagnosticReport.allPassed 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 font-black text-sm">
                        {diagnosticReport.allPassed ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>TẤT CẢ CÁC KIỂM TRA ĐÃ ĐẠT (PASS)</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            <span>PHÁT HIỆN ĐIỂM CẦN ĐỒNG BỘ / TỐI ƯU</span>
                          </>
                        )}
                      </div>
                      <p className="text-[11px] opacity-85">
                        Vai trò: <strong>{getRoleLabel(diagnosticReport.role)}</strong> • Trạng thái: <strong>{diagnosticReport.status}</strong> • UID: <code className="font-mono bg-white/60 px-1 py-0.5 rounded">{diagnosticReport.userUid}</code>
                      </p>
                    </div>

                    <button
                      onClick={handleAutoRepairUser}
                      disabled={isRepairing}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {isRepairing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      <span>Đồng Bộ Cloud Ngay</span>
                    </button>
                  </div>

                  {repairSuccessNotice && (
                    <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{repairSuccessNotice}</span>
                    </div>
                  )}

                  {/* Checklist Table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="p-3 pl-4">Hạng mục kiểm tra</th>
                          <th className="p-3 text-center">Kết quả</th>
                          <th className="p-3 pr-4">Chi tiết &amp; Hướng dẫn</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {diagnosticReport.items.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 pl-4 font-bold text-slate-900">
                              {item.label}
                            </td>
                            <td className="p-3 text-center">
                              {item.status === 'PASS' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                                  ✓ PASS
                                </span>
                              ) : item.status === 'WARNING' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                                  ⚠️ CẢNH BÁO
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-800">
                                  ✕ FAIL
                                </span>
                              )}
                            </td>
                            <td className="p-3 pr-4 text-slate-600">
                              <div>{item.detail}</div>
                              {item.solution && (
                                <div className="text-[10px] text-amber-700 font-bold mt-0.5">
                                  💡 {item.solution}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
              <span className="text-slate-400 font-medium">
                MTTQ Phường Chánh Hiệp Security Diagnostic Tool
              </span>
              <button
                type="button"
                onClick={() => setDiagnosingUser(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-all cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: THÊM / CẤP QUYỀN CÁN BỘ MỚI (ADD USER & RBAC)
          ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <div className="flex items-center gap-2.5 text-blue-700">
                <div className="p-2 bg-blue-100 rounded-xl text-blue-700">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Thêm Cán Bộ &amp; Thiết Lập Quyền (RBAC)</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Khởi tạo tài khoản và phân quyền chi tiết cho cán bộ</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold cursor-pointer"
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

            <form onSubmit={handleAddSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Họ và tên cán bộ *</label>
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
                  <label className="block font-bold text-slate-700 mb-1">Email ủy quyền / Google *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="canbo@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs"
                  />
                </div>
              </div>

              {/* Role Select */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cấp bậc Vai trò (Role) *</label>
                <select
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs font-bold text-slate-900"
                >
                  <option value="ADMIN">Quản Trị Viên (ADMIN - Đăng/sửa/xóa bài, văn bản)</option>
                  <option value="SUPER_ADMIN">Admin Hệ Thống Gốc (SUPER_ADMIN - Toàn quyền)</option>
                  <option value="MANAGER">Quản Lý Ban Ngành (MANAGER)</option>
                  <option value="LEADER">Lãnh Đạo MTTQ (LEADER)</option>
                  <option value="PUBLISHER">Người Xuất Bản (PUBLISHER - Duyệt và xuất bản bài)</option>
                  <option value="EDITOR">Biên Tập Viên (EDITOR - Soạn và gửi duyệt bài)</option>
                  <option value="REVIEWER">Người Kiểm Duyệt (REVIEWER)</option>
                  <option value="CONTEST_MANAGER">Quản Lý Hội Thi (CONTEST_MANAGER)</option>
                  <option value="FEEDBACK_OFFICER">Cán Bộ Xử Lý Dân Nguyện (FEEDBACK_OFFICER)</option>
                  <option value="SPECIALIST">Cán Bộ Chuyên Trách (SPECIALIST)</option>
                  <option value="STAFF">Cán Bộ MTTQ (STAFF)</option>
                  <option value="NEIGHBORHOOD_LEADER">Trưởng Ban CTMT Khu Phố</option>
                  <option value="CONTRIBUTOR">Cộng Tác Viên (CONTRIBUTOR)</option>
                </select>
              </div>

              {/* Granular Permission Matrix */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>CẤP QUYỀN HẠN CHI TIẾT (RBAC PERMISSIONS)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Tự động điền theo vai trò đã chọn</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  {/* Nhóm Bài viết */}
                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200">
                    <div className="font-bold text-blue-900 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>Tin bài &amp; Tuyên truyền</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input type="checkbox" checked={formData.permissionMap.post_create} onChange={() => handleTogglePermission('post_create')} className="rounded text-blue-600" />
                      <span>Tạo bài viết mới (post_create)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input type="checkbox" checked={formData.permissionMap.post_edit} onChange={() => handleTogglePermission('post_edit')} className="rounded text-blue-600" />
                      <span>Chỉnh sửa bài viết (post_edit)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input type="checkbox" checked={formData.permissionMap.post_delete} onChange={() => handleTogglePermission('post_delete')} className="rounded text-blue-600" />
                      <span>Xóa bài viết (post_delete)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input type="checkbox" checked={formData.permissionMap.post_publish} onChange={() => handleTogglePermission('post_publish')} className="rounded text-blue-600" />
                      <span className="font-bold text-emerald-800">Xuất bản bài viết (post_publish)</span>
                    </label>
                  </div>

                  {/* Nhóm Văn bản & Quản trị */}
                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200">
                    <div className="font-bold text-indigo-900 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Văn bản &amp; Quản trị</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input type="checkbox" checked={formData.permissionMap.document_create} onChange={() => handleTogglePermission('document_create')} className="rounded text-blue-600" />
                      <span>Ban hành văn bản (document_create)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input type="checkbox" checked={formData.permissionMap.document_edit} onChange={() => handleTogglePermission('document_edit')} className="rounded text-blue-600" />
                      <span>Chỉnh sửa văn bản (document_edit)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input type="checkbox" checked={formData.permissionMap.user_manage} onChange={() => handleTogglePermission('user_manage')} className="rounded text-blue-600" />
                      <span className="font-bold text-amber-800">Quản lý cán bộ &amp; phân quyền (user_manage)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input type="checkbox" checked={formData.permissionMap.media_upload} onChange={() => handleTogglePermission('media_upload')} className="rounded text-blue-600" />
                      <span>Tải ảnh &amp; tệp lên Cloud (media_upload)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Initial Password */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-amber-950 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-amber-600" />
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
                  className="w-full px-3.5 py-2 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-xs font-mono font-bold text-slate-900"
                />
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
                  Kích hoạt tài khoản ngay (Cán bộ có thể đăng nhập ngay)
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
                  <UserPlus className="w-4 h-4" />
                  <span>Tạo Cán Bộ &amp; Lưu Cloud</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: CHỈNH SỬA HỒ SƠ & PHÂN QUYỀN (EDIT USER)
          ========================================================= */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <div className="flex items-center gap-2.5 text-blue-700">
                <div className="p-2 bg-blue-100 rounded-xl text-blue-700">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Cập Nhật Hồ Sơ &amp; Phân Quyền</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Cán bộ: <strong className="text-slate-800">{editingUser.fullname}</strong> ({editingUser.email})</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingUser(null)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold cursor-pointer"
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

            <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Họ và tên cán bộ *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email ủy quyền / Google *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs"
                  />
                </div>
              </div>

              {/* Role Select */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cấp bậc Vai trò (Role) *</label>
                <select
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs font-bold text-slate-900"
                >
                  <option value="ADMIN">Quản Trị Viên (ADMIN - Đăng/sửa/xóa bài, văn bản)</option>
                  <option value="SUPER_ADMIN">Admin Hệ Thống Gốc (SUPER_ADMIN - Toàn quyền)</option>
                  <option value="MANAGER">Quản Lý Ban Ngành (MANAGER)</option>
                  <option value="LEADER">Lãnh Đạo MTTQ (LEADER)</option>
                  <option value="PUBLISHER">Người Xuất Bản (PUBLISHER - Duyệt và xuất bản bài)</option>
                  <option value="EDITOR">Biên Tập Viên (EDITOR - Soạn và gửi duyệt bài)</option>
                  <option value="REVIEWER">Người Kiểm Duyệt (REVIEWER)</option>
                  <option value="CONTEST_MANAGER">Quản Lý Hội Thi (CONTEST_MANAGER)</option>
                  <option value="FEEDBACK_OFFICER">Cán Bộ Xử Lý Dân Nguyện (FEEDBACK_OFFICER)</option>
                  <option value="SPECIALIST">Cán Bộ Chuyên Trách (SPECIALIST)</option>
                  <option value="STAFF">Cán Bộ MTTQ (STAFF)</option>
                  <option value="NEIGHBORHOOD_LEADER">Trưởng Ban CTMT Khu Phố</option>
                  <option value="CONTRIBUTOR">Cộng Tác Viên (CONTRIBUTOR)</option>
                </select>
              </div>

              {/* Granular Permission Matrix */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>CẤP QUYỀN HẠN CHI TIẾT (RBAC PERMISSIONS)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Tùy chỉnh linh hoạt từng quyền</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  {/* Nhóm Bài viết */}
                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200">
                    <div className="font-bold text-blue-900 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>Tin bài &amp; Tuyên truyền</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input type="checkbox" checked={formData.permissionMap.post_create} onChange={() => handleTogglePermission('post_create')} className="rounded text-blue-600" />
                      <span>Tạo bài viết mới (post_create)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input type="checkbox" checked={formData.permissionMap.post_edit} onChange={() => handleTogglePermission('post_edit')} className="rounded text-blue-600" />
                      <span>Chỉnh sửa bài viết (post_edit)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input type="checkbox" checked={formData.permissionMap.post_delete} onChange={() => handleTogglePermission('post_delete')} className="rounded text-blue-600" />
                      <span>Xóa bài viết (post_delete)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input type="checkbox" checked={formData.permissionMap.post_publish} onChange={() => handleTogglePermission('post_publish')} className="rounded text-blue-600" />
                      <span className="font-bold text-emerald-800">Xuất bản bài viết (post_publish)</span>
                    </label>
                  </div>

                  {/* Nhóm Văn bản & Quản trị */}
                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200">
                    <div className="font-bold text-indigo-900 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Văn bản &amp; Quản trị</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input type="checkbox" checked={formData.permissionMap.document_create} onChange={() => handleTogglePermission('document_create')} className="rounded text-blue-600" />
                      <span>Ban hành văn bản (document_create)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input type="checkbox" checked={formData.permissionMap.document_edit} onChange={() => handleTogglePermission('document_edit')} className="rounded text-blue-600" />
                      <span>Chỉnh sửa văn bản (document_edit)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input type="checkbox" checked={formData.permissionMap.user_manage} onChange={() => handleTogglePermission('user_manage')} className="rounded text-blue-600" />
                      <span className="font-bold text-amber-800">Quản lý cán bộ &amp; phân quyền (user_manage)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input type="checkbox" checked={formData.permissionMap.media_upload} onChange={() => handleTogglePermission('media_upload')} className="rounded text-blue-600" />
                      <span>Tải ảnh &amp; tệp lên Cloud (media_upload)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chức vụ cụ thể</label>
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
                    list="departments-list"
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs"
                  />
                </div>
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
                  <span>Lưu Phân Quyền &amp; Đồng Bộ Cloud</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* =========================================================
          MODAL 4: XEM CHI TIẾT HỒ SƠ CÁN BỘ (VIEW PROFILE)
          ========================================================= */}
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
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold cursor-pointer"
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
                    {viewingUser.fullname?.charAt(0) || 'U'}
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
                  <span className="text-slate-500 font-medium">UID Định danh:</span>
                  <span className="font-mono text-slate-900 font-bold flex items-center gap-1">
                    <span>{viewingUser.id}</span>
                    <button onClick={() => handleCopyUid(viewingUser.id)} className="text-slate-400 hover:text-blue-600 cursor-pointer">
                      {copiedUid === viewingUser.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Chức vụ:</span>
                  <span className="font-bold text-slate-900">{viewingUser.position}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Đơn vị / Ban:</span>
                  <span className="font-bold text-slate-900">{viewingUser.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Email:</span>
                  <span className="font-mono text-slate-900 font-bold">{viewingUser.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Trạng thái:</span>
                  {viewingUser.active !== false && viewingUser.status !== 'inactive' ? (
                    <span className="text-emerald-700 font-black">✓ Đang hoạt động</span>
                  ) : (
                    <span className="text-amber-700 font-black">✕ Tạm khóa</span>
                  )}
                </div>
              </div>
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
                    handleOpenDiagnostics(u);
                  }}
                  className="px-3 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Kiểm tra quyền</span>
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

      {/* =========================================================
          MODAL 5: ĐẶT LẠI MẬT KHẨU (PASSWORD RESET)
          ========================================================= */}
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
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold cursor-pointer"
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
                  <input
                    type="text"
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-xs font-mono font-bold text-slate-900"
                  />
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

      {/* =========================================================
          MODAL 6: XÁC NHẬN XÓA CÁN BỘ (DELETE USER)
          ========================================================= */}
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
              ⚠️ Hành động này sẽ thu hồi toàn bộ quyền truy cập và xóa hồ sơ người dùng trên Cloud.
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
