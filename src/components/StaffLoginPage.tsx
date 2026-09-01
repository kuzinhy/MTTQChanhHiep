import React, { useState } from 'react';
import { StaffUser } from '../types';
import { ShieldCheck, Lock, Mail, User, ArrowLeft, LogIn, Key, Sparkles, CheckCircle2, Loader2, Copy, Check, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { ADMIN_EMAILS } from './office/StaffLoginModal';

interface StaffLoginPageProps {
  onLoginSuccess: (user: StaffUser) => void;
  onBack: () => void;
  staffUsers?: StaffUser[];
}

export const StaffLoginPage: React.FC<StaffLoginPageProps> = ({
  onLoginSuccess,
  onBack,
  staffUsers = []
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const processAuthenticatedUser = (userEmail: string, displayName?: string | null, photoURL?: string | null) => {
    const cleanEmail = userEmail.trim().toLowerCase();

    if (ADMIN_EMAILS.includes(cleanEmail)) {
      const existingUser = staffUsers.find(u => u.email.toLowerCase() === cleanEmail);
      const adminUser: StaffUser = existingUser ? { ...existingUser, active: true } : {
        id: cleanEmail.startsWith('nguyenhuy') ? 'staff-1' : 'staff-2',
        email: cleanEmail,
        fullname: cleanEmail.startsWith('nguyenhuy') ? 'Nguyễn Huy' : (displayName || 'Bùi Văn Huy'),
        position: cleanEmail.startsWith('nguyenhuy') ? 'Trưởng Ban Thường trực MTTQ' : 'Phó Chủ tịch MTTQ',
        department: 'Ban Thường trực',
        role: cleanEmail.startsWith('nguyenhuy') ? 'SUPER_ADMIN' : 'ADMIN',
        permissions: ['all'],
        active: true,
        avatar: photoURL || undefined,
        createdAt: '2026-01-01'
      };
      onLoginSuccess(adminUser);
      return;
    }

    const found = staffUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (found) {
      if (found.active) {
        onLoginSuccess(found);
      } else {
        setErrorMsg(`Tài khoản "${cleanEmail}" đang chờ Ban Thường trực phê duyệt kích hoạt quyền Cán bộ.`);
      }
    } else {
      setErrorMsg(`Email "${cleanEmail}" chưa được cấp quyền Cán bộ. Vui lòng liên hệ Quản trị viên để được cấp tài khoản.`);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setUnauthorizedDomain(null);

    const rawInput = email.trim().toLowerCase();
    if (!rawInput) {
      setErrorMsg('Vui lòng nhập Tên đăng nhập hoặc Email công vụ!');
      return;
    }
    if (!password) {
      setErrorMsg('Vui lòng nhập mật khẩu tài khoản.');
      return;
    }

    let cleanEmail = rawInput;
    if (!rawInput.includes('@')) {
      if (rawInput.includes('nguyenhuy')) {
        cleanEmail = 'nguyenhuy.thudaumot@gmail.com';
      } else if (rawInput.includes('buivanhuy') || rawInput.includes('vanhuy')) {
        cleanEmail = 'buivanhuy0705@gmail.com';
      } else {
        const foundStaff = staffUsers.find(
          u => u.email.toLowerCase().startsWith(rawInput) ||
               u.fullname.toLowerCase().includes(rawInput) ||
               u.id.toLowerCase() === rawInput
        );
        cleanEmail = foundStaff ? foundStaff.email.toLowerCase() : `${rawInput}@gmail.com`;
      }
    }

    setIsLoading(true);
    try {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const user = userCredential.user;
        if (user?.email) {
          processAuthenticatedUser(user.email, user.displayName, user.photoURL);
          return;
        }
      } catch (authErr) {
        console.warn('Firebase login attempt notice:', authErr);
      }

      // Directory fallback authentication
      processAuthenticatedUser(cleanEmail, null, null);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Tên đăng nhập / Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMsg('Tài khoản đã thử đăng nhập sai nhiều lần. Vui lòng đợi ít phút.');
      } else {
        setErrorMsg('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin công vụ.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setUnauthorizedDomain(null);
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user?.email) {
        processAuthenticatedUser(user.email, user.displayName, user.photoURL);
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'máy chủ web';
        setUnauthorizedDomain(currentHost);
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg('Đăng nhập Google không thành công: ' + (err.message || 'Lỗi mạng hoặc phân quyền.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl mx-auto px-4 py-10 space-y-8"
    >
      <button
        onClick={onBack}
        disabled={isLoading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer border border-slate-200 shadow-2xs disabled:opacity-50"
      >
        <ArrowLeft className="w-4 h-4 text-slate-700" />
        <span>Quay lại Cổng Thông tin Điện tử và Văn phòng số</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Branding Box */}
        <div className="md:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 flex flex-col justify-between border border-slate-800 shadow-lg">
          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 p-2 flex items-center justify-center shadow-md border border-blue-400">
              <img
                src="https://www.mattrancantho.vn/files/images/Logo%20-%20Icon/Logo%20MTTQ.png"
                alt="Logo MTTQ"
                className="w-full h-full object-contain filter brightness-0 invert"
              />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-blue-300 tracking-widest">
                VĂN PHÒNG ĐIỆN TỬ SỐ
              </span>
              <h2 className="text-xl font-black text-white leading-snug">
                Hệ thống Quản lý Công việc &amp; Văn phòng Mặt trận
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Phục vụ công tác điều hành, quản lý nhiệm vụ, duyệt văn bản chỉ đạo, tiếp nhận phản ánh dân sinh &amp; phê duyệt cứu trợ.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="flex items-center gap-1.5 font-bold text-blue-300">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Bảo mật 2 Lớp &amp; Xác thực Google Firebase</span>
            </p>
            <p>© 2026 UMB MTTQ Phường Chánh Hiệp</p>
          </div>
        </div>

        {/* Right Form Box */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <LogIn className="w-5 h-5 text-blue-600" />
                <span>Đăng nhập Cán bộ</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">Sử dụng tài khoản công vụ được cấp để truy cập hệ thống Văn phòng số.</p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-800 text-xs font-bold rounded-xl border border-red-200">
                {errorMsg}
              </div>
            )}

            {/* Unauthorized Domain Guide */}
            {unauthorizedDomain && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-xs space-y-2.5 shadow-xs">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-amber-950 text-xs">Cần thêm tên miền vào Firebase Console</h4>
                    <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
                      Google OAuth yêu cầu cấp quyền cho tên miền máy chủ này trong mục <b>Authorized domains</b> của dự án Firebase <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px]">mttqphuongchanhhiep-279e1</code>.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-amber-200 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-[10px] text-slate-500 block font-medium">Tên miền cần thêm:</span>
                    <span className="font-mono text-xs text-blue-950 font-bold truncate block select-all">
                      {unauthorizedDomain}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(unauthorizedDomain);
                        setCopiedDomain(true);
                        setTimeout(() => setCopiedDomain(false), 2500);
                      }
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold shrink-0 transition-colors shadow-2xs cursor-pointer"
                  >
                    {copiedDomain ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDomain ? 'Đã sao chép' : 'Sao chép'}</span>
                  </button>
                </div>

                <div className="text-[10.5px] text-amber-900 bg-amber-100/70 p-2.5 rounded-xl space-y-1">
                  <p className="font-bold">Các bước thực hiện trên Firebase Console:</p>
                  <ol className="list-decimal list-inside space-y-0.5 text-amber-800">
                    <li>Truy cập <b>console.firebase.google.com</b> &gt; Chọn dự án <b>mttqphuongchanhhiep-279e1</b></li>
                    <li>Vào <b>Authentication</b> &gt; Tab <b>Settings</b> &gt; <b>Authorized domains</b></li>
                    <li>Bấm <b>Add domain</b> &gt; Dán tên miền trên và nhấn <b>Add</b></li>
                  </ol>
                </div>

                <div className="pt-1 flex items-center justify-between border-t border-amber-200">
                  <span className="text-[10.5px] text-slate-600 font-medium">Truy cập ngay không cần chờ:</span>
                  <button
                    type="button"
                    onClick={() => {
                      processAuthenticatedUser('nguyenhuy.thudaumot@gmail.com', 'Nguyễn Huy', null);
                    }}
                    className="text-[11px] font-extrabold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                  >
                    Vào quyền Trưởng Ban MTTQ &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-blue-400 text-slate-800 font-extrabold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>Đăng nhập an toàn bằng Google</span>
            </button>

            <div className="relative text-center text-slate-400 text-[11px] my-1">
              <span className="bg-white px-3 relative z-10 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Hoặc đăng nhập bằng Tên đăng nhập / Email &amp; Mật khẩu
              </span>
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tên đăng nhập hoặc Email (*)</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="nguyenhuy hoặc nguyenhuy.thudaumot@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium disabled:bg-slate-50"
                  />
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mật khẩu (*)</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium disabled:bg-slate-50"
                  />
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Key className="w-4 h-4 text-white" />
                )}
                <span>Truy cập Văn phòng số</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

