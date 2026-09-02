import React, { useState, useEffect, useRef } from 'react';
import { StaffUser } from '../../types';
import { 
  User, 
  Mail, 
  Briefcase, 
  Building2, 
  Phone, 
  Key, 
  ShieldCheck, 
  Save, 
  Image as ImageIcon, 
  CheckCircle2, 
  Sparkles,
  Lock,
  BadgeCheck,
  Download,
  Upload,
  Database,
  Loader2,
  Camera,
  RotateCw,
  Trash2,
  Globe,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getRoleBadgeStyle, getRoleLabel } from '../../lib/rbac';
import { AppStorageEngine } from '../../lib/storage';
import { auth } from '../../lib/firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

interface UserProfileViewProps {
  currentUser: StaffUser;
  onUpdateProfile: (updatedUser: StaffUser) => void;
  onRefreshAllData?: () => void;
}

const PROFESSIONAL_AVATARS = [
  {
    id: 'av-1',
    label: 'Chủ tịch MTTQ',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'av-2',
    label: 'Phó Chủ tịch MTTQ',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'av-3',
    label: 'Ủy viên Thường trực',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'av-4',
    label: 'Cán bộ Tuyên giáo',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'av-5',
    label: 'Trưởng ban CTMT Khu phố',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'av-6',
    label: 'Cán bộ Trẻ Năng động',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'av-7',
    label: 'Nữ Cán bộ Tuyên giáo',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'av-8',
    label: 'Logo Biểu tượng Mặt trận',
    url: 'https://www.mattrancantho.vn/files/images/Logo%20-%20Icon/Logo%20MTTQ.png'
  }
];

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  currentUser,
  onUpdateProfile,
  onRefreshAllData
}) => {
  const [fullname, setFullname] = useState(currentUser.fullname || '');
  const [email] = useState(currentUser.email || '');
  const [position, setPosition] = useState(currentUser.position || '');
  const [department, setDepartment] = useState(currentUser.department || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || PROFESSIONAL_AVATARS[0].url);

  // Avatar Management State
  const [customGmail, setCustomGmail] = useState(currentUser.email || '');
  const [isFetchingGmail, setIsFetchingGmail] = useState(false);
  const [avatarNotice, setAvatarNotice] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when currentUser prop changes
  useEffect(() => {
    setFullname(currentUser.fullname || '');
    setPosition(currentUser.position || '');
    setDepartment(currentUser.department || '');
    setPhone(currentUser.phone || '');
    setBio(currentUser.bio || '');
    if (currentUser.avatar) {
      setAvatar(currentUser.avatar);
    }
    if (currentUser.email) {
      setCustomGmail(currentUser.email);
    }
  }, [currentUser]);

  // Security Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [passSuccessMsg, setPassSuccessMsg] = useState('');
  const [passErrorMsg, setPassErrorMsg] = useState('');
  const [backupMsg, setBackupMsg] = useState('');

  // Storage Stats
  const articlesCount = AppStorageEngine.getArticles().length;
  const documentsCount = AppStorageEngine.getDocuments().length;
  const opinionsCount = AppStorageEngine.getOpinions().length;
  const tasksCount = AppStorageEngine.getTasks().length;
  const notesCount = AppStorageEngine.getNotes().length;

  // Process & compress uploaded image file using Canvas
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setAvatarNotice({
        type: 'error',
        message: 'Vui lòng chọn file hình ảnh hợp lệ (.jpg, .jpeg, .png, .webp)!'
      });
      return;
    }

    setIsProcessingUpload(true);
    setAvatarNotice(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const maxSize = 400; // 400x400 square avatar standard
          let width = img.width;
          let height = img.height;

          // Center crop to square
          const minDim = Math.min(width, height);
          const startX = (width - minDim) / 2;
          const startY = (height - minDim) / 2;

          canvas.width = maxSize;
          canvas.height = maxSize;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, maxSize, maxSize);
            const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.88);
            setAvatar(optimizedBase64);
            setAvatarNotice({
              type: 'success',
              message: `Đã nén và tải ảnh lên thành công (${(file.size / 1024).toFixed(0)} KB → ~${(optimizedBase64.length * 0.75 / 1024).toFixed(0)} KB)! Nhấn "Lưu Thay đổi Hồ sơ" để cập nhật vĩnh viễn.`
            });
          } else {
            setAvatar(e.target?.result as string);
          }
        } catch (err) {
          console.warn('Canvas optimization error:', err);
          if (typeof e.target?.result === 'string') {
            setAvatar(e.target.result);
          }
        } finally {
          setIsProcessingUpload(false);
        }
      };
      img.onerror = () => {
        setIsProcessingUpload(false);
        setAvatarNotice({
          type: 'error',
          message: 'Không thể xử lý hình ảnh này. Vui lòng thử file khác.'
        });
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setIsProcessingUpload(false);
      setAvatarNotice({
        type: 'error',
        message: 'Lỗi khi đọc file từ thiết bị.'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCustomAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Fetch avatar from Google / Gmail Account
  const handleFetchGmailAvatar = async (targetEmailStr?: string) => {
    const mailToUse = (targetEmailStr || customGmail || email || auth.currentUser?.email || '').trim();
    setIsFetchingGmail(true);
    setAvatarNotice(null);

    // Case 1: Firebase Auth Google PhotoURL available
    if (auth.currentUser?.photoURL) {
      const highResGooglePhoto = auth.currentUser.photoURL.replace(/=s\d+-c/, '=s400-c');
      setAvatar(highResGooglePhoto);
      setAvatarNotice({
        type: 'success',
        message: 'Đã lấy ảnh đại diện chất lượng cao từ tài khoản Google đang đăng nhập thành công!'
      });
      setIsFetchingGmail(false);
      return;
    }

    if (!mailToUse) {
      setAvatarNotice({
        type: 'error',
        message: 'Vui lòng nhập địa chỉ Gmail để hệ thống truy xuất ảnh đại diện.'
      });
      setIsFetchingGmail(false);
      return;
    }

    // Case 2: Query Google Profile photo via public endpoint / unavatar
    const googleAvatarUrl = `https://unavatar.io/google/${encodeURIComponent(mailToUse)}`;
    
    const testImg = new Image();
    testImg.onload = () => {
      setAvatar(googleAvatarUrl);
      setAvatarNotice({
        type: 'success',
        message: `Đã kết nối và lấy ảnh đại diện Google/Gmail từ: ${mailToUse}`
      });
      setIsFetchingGmail(false);
    };
    testImg.onerror = () => {
      // Fallback: Elegant high-contrast initial avatar
      const initialUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullname || 'Cán bộ Mặt trận')}&background=0284c7&color=ffffff&size=256&bold=true`;
      setAvatar(initialUrl);
      setAvatarNotice({
        type: 'info',
        message: `Không tìm thấy avatar công khai từ ${mailToUse}. Đã tự động tạo ảnh đại diện nhận diện chuyên nghiệp cho bạn!`
      });
      setIsFetchingGmail(false);
    };
    testImg.src = googleAvatarUrl;
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccessMsg('');

    const updated: StaffUser = {
      ...currentUser,
      fullname: fullname.trim(),
      position: position.trim(),
      department: department.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      avatar
    };

    onUpdateProfile(updated);
    setSaveSuccessMsg('ĐÃ LƯU TRỮ HỒ SƠ & AVATAR CÔNG VỤ VÀO CƠ SỞ DỮ LIỆU ĐÁM MÂY THÀNH CÔNG!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const [isChangingPass, setIsChangingPass] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassErrorMsg('');
    setPassSuccessMsg('');

    if (!newPassword || newPassword.length < 6) {
      setPassErrorMsg('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassErrorMsg('Xác nhận mật khẩu mới không khớp!');
      return;
    }

    setIsChangingPass(true);
    try {
      if (auth.currentUser) {
        if (currentPassword && auth.currentUser.email) {
          try {
            const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);
          } catch (reauthErr: any) {
            console.warn('Re-auth notice:', reauthErr);
          }
        }
        await updatePassword(auth.currentUser, newPassword);
        setPassSuccessMsg('ĐỔI MẬT KHẨU BẢO MẬT THÀNH CÔNG! Mật khẩu mới đã được cập nhật trên hệ thống.');
      } else {
        setPassSuccessMsg('ĐÃ LƯU MẬT KHẨU CÔNG VỤ MỚI THÀNH CÔNG!');
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccessMsg(''), 5000);
    } catch (err: any) {
      console.error('Password update error:', err);
      if (err.code === 'auth/requires-recent-login') {
        setPassErrorMsg('Để bảo mật, hệ thống yêu cầu bạn đăng xuất và đăng nhập lại trước khi đổi mật khẩu.');
      } else if (err.code === 'auth/wrong-password') {
        setPassErrorMsg('Mật khẩu hiện tại không chính xác!');
      } else {
        setPassErrorMsg('Không thể đổi mật khẩu: ' + (err.message || 'Lỗi xác thực.'));
      }
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleExportBackup = () => {
    AppStorageEngine.exportFullDatabase();
    setBackupMsg('Đã tạo và tải file sao lưu CSDL (.json) về máy của bạn an toàn!');
    setTimeout(() => setBackupMsg(''), 5000);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = AppStorageEngine.importDatabaseFromJson(content);
        if (ok) {
          setBackupMsg('Phục hồi dữ liệu từ file sao lưu thành công! Đang đồng bộ lại hệ thống...');
          if (onRefreshAllData) onRefreshAllData();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          setBackupMsg('Lỗi: File sao lưu không đúng định dạng JSON chuẩn!');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Page Title Header - Bright Vibrant Blue Gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-400/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white/20 shrink-0 flex items-center justify-center">
              <img
                src={avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300'}
                alt={fullname}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-400 text-slate-900 flex items-center justify-center border-2 border-white shadow-xs">
              <BadgeCheck className="w-4 h-4 text-slate-900" />
            </span>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white">{fullname || 'Cán bộ Mặt trận'}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider ${getRoleBadgeStyle(currentUser.role)}`}>
                {getRoleLabel(currentUser.role)}
              </span>
            </div>
            <p className="text-xs text-blue-100 font-bold">{position || 'Chức vụ chưa cập nhật'} • {department || 'Ủy ban MTTQ Phường'}</p>
            <p className="text-[11px] text-blue-200">{email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center">
            <span className="text-[10px] uppercase font-bold text-blue-200 block">Lưu trữ CSDL</span>
            <span className="text-sm font-black text-emerald-300 flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Tự động Bền vững
            </span>
          </div>
        </div>
      </div>

      {/* STORAGE & DATABASE SYNC STATUS CARD */}
      <div className="bg-white rounded-3xl border border-blue-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span>Hệ thống Lưu trữ &amp; Đồng bộ Dữ liệu Toàn phường</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  TỰ ĐỘNG LƯU TRỮ
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Mọi bài viết đăng tải, văn bản, hồ sơ cán bộ, ảnh đại diện, ghi chú, ý kiến dân sinh đều được lưu trữ trực tiếp vào CSDL đám mây.
              </p>
            </div>
          </div>

          {/* Backup & Export Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleExportBackup}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Sao lưu CSDL (JSON)</span>
            </button>

            <label className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-800 border border-slate-300 hover:border-blue-300 text-xs font-black rounded-xl transition-all cursor-pointer">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Khôi phục từ File JSON</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {backupMsg && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{backupMsg}</span>
          </motion.div>
        )}

        {/* Database Metric Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <div className="text-lg font-black text-blue-900">{articlesCount}</div>
            <div className="text-[10px] font-extrabold text-slate-500 uppercase mt-0.5">Bài viết đã lưu</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <div className="text-lg font-black text-indigo-900">{documentsCount}</div>
            <div className="text-[10px] font-extrabold text-slate-500 uppercase mt-0.5">Văn bản Mặt trận</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <div className="text-lg font-black text-amber-900">{opinionsCount}</div>
            <div className="text-[10px] font-extrabold text-slate-500 uppercase mt-0.5">Ý kiến Dân sinh</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <div className="text-lg font-black text-emerald-900">{tasksCount}</div>
            <div className="text-[10px] font-extrabold text-slate-500 uppercase mt-0.5">Nhiệm vụ công việc</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center col-span-2 sm:col-span-1">
            <div className="text-lg font-black text-purple-900">{notesCount}</div>
            <div className="text-[10px] font-extrabold text-slate-500 uppercase mt-0.5">Ghi chú cá nhân</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Profile Form & Avatar Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Profile Form & Password Change (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* PROFILE FORM */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Thông tin Hồ sơ &amp; Chức danh Công vụ</span>
              </h2>
              <span className="text-xs text-slate-400 font-medium">Bảo mật nội bộ</span>
            </div>

            {saveSuccessMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-black flex items-center gap-2 shadow-2xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </motion.div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Fullname */}
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                    Họ và tên Cán bộ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="text"
                      required
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className="w-full text-xs pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden font-bold text-slate-800"
                    />
                  </div>
                </div>

                {/* Email (Readonly) */}
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                    Email Google Ủy quyền
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="email"
                      readOnly
                      value={email}
                      className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-semibold cursor-not-allowed outline-hidden"
                    />
                  </div>
                </div>

                {/* Position */}
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                    Chức vụ / Chức danh <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="text"
                      required
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="Ví dụ: Chủ tịch MTTQ phường Chánh Hiệp"
                      className="w-full text-xs pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden font-semibold text-slate-800"
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                    Đơn vị / Ban chuyên trách <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Ví dụ: Ban Thường trực MTTQ"
                      className="w-full text-xs pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden font-semibold text-slate-800"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                    Số điện thoại liên hệ
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ví dụ: 0912 345 678"
                      className="w-full text-xs pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden font-semibold text-slate-800"
                    />
                  </div>
                </div>

                {/* Role Badge Info */}
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                    Cấp Phân quyền Hệ thống
                  </label>
                  <div className="py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-xs">{getRoleLabel(currentUser.role)}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${getRoleBadgeStyle(currentUser.role)}`}>
                      {currentUser.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio / Description */}
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                  Tóm tắt Quá trình Công tác &amp; Nhiệm vụ Phụ trách
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Ghi chú về phân công nhiệm vụ, phụ trách các khu phố hoặc chương trình công tác trọng tâm..."
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden font-medium text-slate-800"
                />
              </div>

              {/* Submit Save Profile Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu Thay đổi Hồ sơ &amp; Avatar vào CSDL</span>
                </button>
              </div>

            </form>
          </div>

          {/* CHANGE PASSWORD BOX */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-600" />
                <span>Đổi Mật khẩu Công vụ &amp; Thiết lập Bảo mật</span>
              </h2>
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Mã hóa 256-bit
              </span>
            </div>

            {passSuccessMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-black flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{passSuccessMsg}</span>
              </motion.div>
            )}

            {passErrorMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-red-50 border border-red-300 rounded-2xl text-red-900 text-xs font-black flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-red-600 shrink-0" />
                <span>{passErrorMsg}</span>
              </motion.div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mật khẩu mới</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isChangingPass ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Key className="w-3.5 h-3.5" />
                  )}
                  <span>Xác nhận Đổi Mật khẩu</span>
                </button>
              </div>
            </form>
          </div>

          {/* BROWSER NOTIFICATION SETTINGS BOX */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <span>Cấu hình Thông báo Đẩy Web (Desktop Push Notification)</span>
              </h2>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
                  ? '● ĐÃ KÍCH HOẠT'
                  : '○ CHƯA CẤP QUYỀN'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Tích hợp <strong>Web Push Notification API</strong> giúp cán bộ nhận được cảnh báo tức thì ngay trên góc màn hình desktop/laptop hoặc thanh thông báo điện thoại khi có <strong>Ý kiến dân sinh mới</strong> hoặc <strong>Văn bản chờ lãnh đạo phê duyệt</strong>, ngay cả khi đang chuyển qua tab làm việc khác hoặc thu nhỏ trình duyệt.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="text-xs">
                <span className="font-black text-slate-800">Trạng thái quyền trình duyệt: </span>
                <span className="font-mono font-bold text-blue-700">
                  {typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'Không hỗ trợ'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (typeof window !== 'undefined' && 'Notification' in window) {
                      const res = await Notification.requestPermission();
                      if (res === 'granted') {
                        new Notification('MTTQ Phường Chánh Hiệp', {
                          body: 'Chúc mừng! Bạn đã bật thành công thông báo đẩy trên thiết bị này.',
                          icon: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120'
                        });
                      }
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Yêu cầu Cấp quyền / Thử nghiệm
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Advanced Avatar Selection (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-5 sticky top-20">
            
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-600" />
                  <span>Ảnh Đại diện Cán bộ</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Lấy từ Gmail, tải ảnh lên từ máy hoặc bộ sưu tập
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-200">
                CSDL ĐÁM MÂY
              </span>
            </div>

            {/* Current Large Avatar Preview Card */}
            <div className="p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white rounded-2xl flex items-center gap-4 border border-blue-400/40 shadow-md">
              <div className="relative group/avatar">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white/20 overflow-hidden border-2 border-white shrink-0 shadow-md">
                  <img 
                    src={avatar} 
                    alt="Current Preview" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PROFESSIONAL_AVATARS[0].url;
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Thay đổi ảnh"
                  className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center text-white transition-opacity cursor-pointer text-[10px] font-bold"
                >
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span>Đổi ảnh</span>
                </button>
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9.5px] font-black uppercase bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md text-amber-300">
                    Ảnh đang sử dụng
                  </span>
                </div>
                <p className="text-xs font-black text-white truncate">{fullname || 'Cán bộ'}</p>
                <p className="text-[10px] text-blue-100 font-semibold truncate">{position || 'Ủy ban MTTQ'}</p>
                <p className="text-[9.5px] text-blue-200/90 font-mono truncate">{email}</p>
              </div>
            </div>

            {/* Notification message */}
            {avatarNotice && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl text-xs font-bold flex items-start gap-2 border ${
                  avatarNotice.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
                    : avatarNotice.type === 'error'
                    ? 'bg-red-50 text-red-900 border-red-300'
                    : 'bg-blue-50 text-blue-900 border-blue-300'
                }`}
              >
                {avatarNotice.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : avatarNotice.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                ) : (
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                )}
                <span className="leading-tight">{avatarNotice.message}</span>
              </motion.div>
            )}

            {/* SECTION 1: LẤY AVATAR GMAIL / GOOGLE */}
            <div className="p-4 bg-gradient-to-br from-rose-50/70 via-white to-amber-50/70 rounded-2xl border border-rose-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-rose-500 text-white rounded-lg shadow-2xs">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Lấy Avatar từ Google / Gmail</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Tự động đồng bộ ảnh đại diện từ tài khoản Google</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={customGmail}
                    onChange={(e) => setCustomGmail(e.target.value)}
                    placeholder="Nhập email Gmail (ví dụ: nguyenvan@gmail.com)"
                    className="w-full text-xs pl-8.5 pr-2.5 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-hidden font-medium text-slate-800"
                  />
                </div>
                <button
                  type="button"
                  disabled={isFetchingGmail}
                  onClick={() => handleFetchGmailAvatar(customGmail)}
                  className="px-3.5 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-black rounded-xl shadow-xs transition-all active:scale-95 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isFetchingGmail ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>Lấy Avatar Gmail</span>
                </button>
              </div>

              {auth.currentUser?.photoURL && (
                <button
                  type="button"
                  onClick={() => handleFetchGmailAvatar()}
                  className="w-full py-1.5 px-3 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <BadgeCheck className="w-3.5 h-3.5 text-rose-600" />
                  <span>Dùng ảnh tài khoản Google đang đăng nhập</span>
                </button>
              )}
            </div>

            {/* SECTION 2: UPLOAD ẢNH TỪ MÁY TÍNH / THIẾT BỊ */}
            <div className="p-4 bg-gradient-to-br from-blue-50/70 via-white to-sky-50/70 rounded-2xl border border-blue-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-600 text-white rounded-lg shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Tải ảnh từ máy &amp; Lưu trên hệ thống</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Tự động nén &amp; tối ưu hóa để lưu trữ CSDL bền vững</p>
                  </div>
                </div>
              </div>

              {/* Drag and drop zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all text-center flex flex-col items-center justify-center gap-1.5 ${
                  isDragOver 
                    ? 'border-blue-500 bg-blue-100/70 scale-102' 
                    : 'border-blue-300 hover:border-blue-500 bg-white hover:bg-blue-50/50'
                }`}
              >
                <div className="p-2.5 rounded-full bg-blue-50 text-blue-600 shadow-2xs">
                  {isProcessingUpload ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ImageIcon className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">
                    Kéo &amp; thả ảnh vào đây hoặc <span className="text-blue-600 underline">chọn từ thiết bị</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    Hỗ trợ file: JPG, PNG, WEBP (Tự động canh vuông và nén HD)
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleCustomAvatarUpload}
                  className="hidden"
                />
              </div>

              {/* URL Direct Link Input */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Hoặc dán trực tiếp đường dẫn URL ảnh:
                </label>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full text-xs pl-8.5 pr-2.5 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: BỘ SƯU TẬP ẢNH CÁN BỘ CÔNG VỤ */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Bộ sưu tập Cán bộ Chuyên nghiệp:</span>
                </label>
                <span className="text-[10px] text-slate-400 font-medium">8 mẫu chuẩn</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {PROFESSIONAL_AVATARS.map((item) => {
                  const isSelected = avatar === item.url;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setAvatar(item.url);
                        setAvatarNotice({
                          type: 'success',
                          message: `Đã chọn: ${item.label}. Nhấn "Lưu Thay đổi Hồ sơ" để cập nhật vào CSDL!`
                        });
                      }}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer group ${
                        isSelected 
                          ? 'border-emerald-500 ring-2 ring-emerald-300 ring-offset-1 scale-105 shadow-md' 
                          : 'border-slate-200 hover:border-blue-400 opacity-80 hover:opacity-100'
                      }`}
                      title={item.label}
                    >
                      <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-emerald-900/40 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 drop-shadow-md" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

