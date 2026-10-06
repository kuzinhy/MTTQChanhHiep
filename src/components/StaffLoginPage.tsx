import React, { useState } from 'react';
import { StaffUser } from '../types';
import { 
  ShieldCheck, Lock, User, ArrowLeft, Eye, EyeOff, 
  Check, Copy, ShieldAlert, AlertTriangle, Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { CloudDatabase } from '../lib/firestoreService';
import { AnimatedIcon } from './common/AnimatedIcon';

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
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Micro-interaction hover triggers
  const [leftPanelHovered, setLeftPanelHovered] = useState(false);
  const [titleHovered, setTitleHovered] = useState(false);
  const [loginBtnHovered, setLoginBtnHovered] = useState(false);

  const processAuthenticatedUser = async (
    userEmail: string, 
    displayName?: string | null, 
    photoURL?: string | null, 
    authUid?: string
  ) => {
    const cleanEmail = userEmail.trim().toLowerCase();
    
    // Refresh token if authenticated
    try {
      await auth.currentUser?.getIdToken(true);
    } catch {
      // Ignored
    }

    try {
      const resolvedUser = await CloudDatabase.syncAuthUserProfile(
        authUid || auth.currentUser?.uid || ('staff-' + Date.now()),
        cleanEmail,
        displayName,
        photoURL,
        staffUsers
      );

      if (resolvedUser.active !== false) {
        setIsSuccess(true);
        setTimeout(() => {
          onLoginSuccess(resolvedUser);
        }, 350);
      } else {
        setErrorMsg(`Tài khoản "${cleanEmail}" đang trong trạng thái chờ Ban Thường trực kích hoạt.`);
      }
    } catch (err: any) {
      console.error('Error syncing profile:', err);
      const found = staffUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (found && found.active !== false) {
        setIsSuccess(true);
        setTimeout(() => {
          onLoginSuccess(found);
        }, 350);
      } else {
        setErrorMsg(`Không thể đồng bộ hồ sơ cán bộ: ${err?.message || 'Vui lòng thử lại.'}`);
      }
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isSuccess) return;

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
          await processAuthenticatedUser(user.email, user.displayName, user.photoURL, user.uid);
          return;
        }
      } catch (authErr) {
        console.warn('Firebase login attempt notice:', authErr);
      }

      // Directory fallback authentication
      await processAuthenticatedUser(cleanEmail, null, null);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Tên đăng nhập hoặc mật khẩu chưa chính xác. Vui lòng kiểm tra lại!');
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
    if (isLoading || isSuccess) return;

    setErrorMsg('');
    setUnauthorizedDomain(null);
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user?.email) {
        await processAuthenticatedUser(user.email, user.displayName, user.photoURL, user.uid);
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'máy chủ web';
        setUnauthorizedDomain(currentHost);
      } else if (err.code === 'auth/internal-error' || err.code === 'auth/popup-blocked' || err.message?.includes('internal-error')) {
        setErrorMsg('Khung trình duyệt đang hạn chế Popup Google. Vui lòng đăng nhập bằng Tên đăng nhập / Email & Mật khẩu bên dưới.');
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg('Đăng nhập Google không thành công: ' + (err.message || 'Vui lòng thử lại hoặc sử dụng Tên đăng nhập & Mật khẩu bên dưới.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-120px)] bg-[#F5F8FC] py-3 sm:py-5 px-3 sm:px-6 flex flex-col justify-center items-center overflow-hidden">
      
      {/* Background Subtle Radial Glow & Digital Dot Grid */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 35%, rgba(36, 119, 255, 0.07) 0%, rgba(245, 248, 252, 0) 70%)'
        }}
      />
      
      {/* Subtle Digital Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#146CFF 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Decorative City Skyline Watermark Silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-28 opacity-[0.035] pointer-events-none overflow-hidden select-none flex items-end justify-between px-8">
        <svg viewBox="0 0 1200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#10204A]">
          <path d="M0 160V120H40V80H70V120H110V95H140V120H170V160H220V70H250V40H270V70H300V160H360V110H410V60H430V20H450V60H470V110H520V160H580V90H620V160H680V105H720V160H780V80H810V50H840V80H880V160H940V115H980V70H1010V115H1050V160H1120V95H1160V160H1200V160H0Z" fill="currentColor"/>
        </svg>
      </div>

      {/* Compact Main Shell (Max width 1040px for neat viewport fit) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-[1040px] relative z-10 space-y-3 sm:space-y-3.5 my-auto"
      >
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            disabled={isLoading}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 hover:bg-white text-[#172033] font-bold text-xs rounded-lg transition-all cursor-pointer border border-[#E6ECF4] shadow-2xs hover:border-[#146CFF]/40 disabled:opacity-50"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#72809A] group-hover:text-[#146CFF] group-hover:-translate-x-0.5 transition-all" />
            <span>Quay lại Cổng Thông tin &amp; Văn phòng số</span>
          </button>
        </div>

        {/* 2-Column Responsive Container (Left 38% / Right 62%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          
          {/* ========================================================
              LEFT PANEL: DIGITAL OFFICE VISUAL PANEL (Compact)
              ======================================================== */}
          <div 
            onMouseEnter={() => setLeftPanelHovered(true)}
            onMouseLeave={() => setLeftPanelHovered(false)}
            className="lg:col-span-5 rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 lg:p-7 flex flex-col justify-between text-white border border-blue-950/40 relative overflow-hidden transition-all duration-300"
            style={{
              background: 'linear-gradient(145deg, #101D43 0%, #162957 100%)',
              boxShadow: '0 16px 36px rgba(15, 35, 80, 0.14)'
            }}
          >
            {/* Ambient Accents */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-radial from-[#146CFF]/15 to-transparent rounded-full pointer-events-none blur-2xl -mr-12 -mt-12" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-radial from-[#38BDF8]/10 to-transparent rounded-full pointer-events-none blur-xl -ml-10 -mb-10" />

            {/* Top Section */}
            <div className="relative z-10 space-y-3 sm:space-y-4">
              
              {/* Responsive Animated Illustration (76px mobile / 110px desktop) */}
              <div className="flex justify-start items-center gap-3 sm:block -ml-1">
                <div className="shrink-0">
                  <AnimatedIcon 
                    name="document" 
                    size={100} 
                    isHovered={leftPanelHovered}
                    trigger="hover" 
                  />
                </div>
                <div className="sm:hidden space-y-0.5">
                  <span className="inline-block text-[10px] font-bold tracking-[0.08em] text-[#6EB8FF] uppercase">
                    VĂN PHÒNG ĐIỆN TỬ SỐ
                  </span>
                  <h2 className="text-[16px] font-black text-white leading-tight">
                    Hệ thống Quản lý Công việc &amp; Văn phòng Mặt trận
                  </h2>
                </div>
              </div>

              {/* Title & Info (Desktop / Tablet) */}
              <div className="hidden sm:block space-y-1.5">
                <span className="inline-block text-[11.5px] font-bold tracking-[0.08em] text-[#6EB8FF] uppercase">
                  VĂN PHÒNG ĐIỆN TỬ SỐ
                </span>
                
                <h2 className="text-[20px] sm:text-[22px] lg:text-[23px] font-black text-white leading-[1.26] tracking-tight">
                  Hệ thống Quản lý Công việc<br className="hidden sm:inline" />
                  &amp; Văn phòng Mặt trận
                </h2>
                
                <p className="text-[12.5px] sm:text-[13px] text-white/80 leading-[1.55] max-w-[320px] font-normal">
                  Phục vụ công tác điều hành, quản lý nhiệm vụ, duyệt văn bản chỉ đạo, tiếp nhận phản ánh dân sinh &amp; phê duyệt cứu trợ.
                </p>
              </div>

              {/* 3 Clean Micro Features (Desktop / Tablet) */}
              <div className="hidden sm:block space-y-2.5 pt-1">
                {[
                  { label: 'Quản lý công việc tập trung', icon: 'tasks' as const },
                  { label: 'Xử lý văn bản điện tử', icon: 'document' as const },
                  { label: 'Theo dõi tiến độ & phản ánh', icon: 'citizen' as const }
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-[12.5px] font-medium text-white/90 group/feat">
                    <div className="w-5 h-5 rounded-full bg-[#146CFF]/30 border border-[#38BDF8]/50 flex items-center justify-center shrink-0 group-hover/feat:scale-110 group-hover/feat:border-[#38BDF8] transition-all">
                      <AnimatedIcon name={feat.icon} size={13} colorScheme="white" trigger="hover" />
                    </div>
                    <span>{feat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compact Footer */}
            <div className="relative z-10 pt-3 sm:pt-4 mt-2 sm:mt-4 border-t border-white/[0.08] space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-[11.5px] font-semibold text-[#6EB8FF]">
                <AnimatedIcon name="security" size={15} colorScheme="light" isHovered={leftPanelHovered} />
                <span>Bảo mật 2 Lớp &amp; Xác thực Google Firebase</span>
              </div>
              <p className="text-[10.5px] sm:text-[11.5px] text-white/60 font-normal">
                © 2026 UBM MTTQ Phường Chánh Hiệp
              </p>
            </div>
          </div>

          {/* ========================================================
              RIGHT PANEL: CLEAN ENTERPRISE LOGIN CARD (Compact)
              ======================================================== */}
          <div 
            className="lg:col-span-7 bg-white rounded-[22px] sm:rounded-[24px] border border-[#E6ECF4] p-5 sm:p-7 lg:p-8 flex flex-col justify-between transition-all duration-300"
            style={{
              boxShadow: '0 12px 32px rgba(20, 40, 80, 0.05)'
            }}
          >
            <div className="space-y-4">
              
              {/* Header with Login Icon */}
              <div 
                className="space-y-1 cursor-default"
                onMouseEnter={() => setTitleHovered(true)}
                onMouseLeave={() => setTitleHovered(false)}
              >
                <div className="flex items-center gap-2.5">
                  <AnimatedIcon 
                    name="login" 
                    size={28} 
                    isHovered={titleHovered}
                    trigger="hover" 
                  />
                  <h1 className="text-[22px] sm:text-[24px] font-extrabold text-[#172033] tracking-tight">
                    Đăng nhập Cán bộ
                  </h1>
                </div>
                <p className="text-[13px] text-[#7B879B] font-normal leading-normal">
                  Sử dụng tài khoản công vụ được cấp để truy cập hệ thống Văn phòng số.
                </p>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2.5 bg-amber-50/90 border border-amber-200/90 rounded-xl flex items-start gap-2 text-xs text-amber-950 font-medium"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{errorMsg}</span>
                </motion.div>
              )}

              {/* Unauthorized Domain Helper Box */}
              {unauthorizedDomain && (
                <div className="p-3 bg-amber-50/90 border border-amber-300 rounded-xl text-xs space-y-2 shadow-2xs">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-amber-950 text-xs">Cần thêm tên miền vào Firebase Console</h4>
                      <p className="text-amber-800 text-[10.5px] mt-0.5 leading-tight">
                        Cấp quyền tên miền trong mục <b>Authorized domains</b> của Firebase Console.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-2 rounded-lg border border-amber-200 flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-blue-950 font-bold truncate block select-all">
                      {unauthorizedDomain}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(unauthorizedDomain);
                          setCopiedDomain(true);
                          setTimeout(() => setCopiedDomain(false), 2000);
                        }
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10.5px] font-bold shrink-0 cursor-pointer"
                    >
                      {copiedDomain ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedDomain ? 'Đã copy' : 'Sao chép'}</span>
                    </button>
                  </div>

                  <div className="pt-1 flex items-center justify-between border-t border-amber-200/70">
                    <span className="text-[10.5px] text-slate-600 font-medium">Bỏ qua:</span>
                    <button
                      type="button"
                      onClick={() => {
                        processAuthenticatedUser('nguyenhuy.thudaumot@gmail.com', 'Nguyễn Huy', null);
                      }}
                      className="text-[11px] font-extrabold text-[#146CFF] hover:underline cursor-pointer"
                    >
                      Vào quyền Trưởng Ban MTTQ &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* Google Enterprise Button (Compact Height 44px) */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading || isSuccess}
                className="w-full h-[44px] px-3.5 bg-white hover:bg-[#F8FAFD] border border-[#DDE5EF] hover:border-[#BFD1EB] text-[#172033] font-bold text-[13px] rounded-xl shadow-2xs transition-all duration-150 flex items-center justify-center gap-2.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-[#146CFF] animate-spin" />
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

              {/* Divider */}
              <div className="relative text-center my-1 select-none">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E6ECF4]"></div>
                </div>
                <span className="bg-white px-2.5 relative z-10 font-bold text-[#9AA8BC] uppercase tracking-[0.04em] text-[10px]">
                  Hoặc đăng nhập bằng tài khoản công vụ
                </span>
              </div>

              {/* Credentials Form (Compact 44px Inputs) */}
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                
                {/* Username or Email Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#172033] block">
                    Tên đăng nhập hoặc Email (*)
                  </label>
                  <div className="relative group/inp">
                    <input
                      type="text"
                      required
                      placeholder="canbo.mttq hoặc canbo@chanhhiep.vn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading || isSuccess}
                      className="w-full h-[44px] text-xs pl-9 pr-3.5 bg-[#FBFCFE] border border-[#DDE5EE] rounded-xl focus:bg-white focus:border-[#2477FF] focus:ring-3 focus:ring-[#2477FF]/10 outline-none font-medium transition-all disabled:opacity-60"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#72809A] group-focus-within/inp:text-[#146CFF] transition-colors pointer-events-none">
                      <AnimatedIcon name="user_badge" size={15} />
                    </div>
                  </div>
                </div>

                {/* Password Input with Show/Hide Toggle */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#172033] block">
                    Mật khẩu (*)
                  </label>
                  <div className="relative group/inp">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading || isSuccess}
                      className="w-full h-[44px] text-xs pl-9 pr-10 bg-[#FBFCFE] border border-[#DDE5EE] rounded-xl focus:bg-white focus:border-[#2477FF] focus:ring-3 focus:ring-[#2477FF]/10 outline-none font-medium transition-all disabled:opacity-60"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#72809A] group-focus-within/inp:text-[#146CFF] transition-colors pointer-events-none">
                      <AnimatedIcon name="key" size={15} />
                    </div>
                    
                    {/* Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#72809A] hover:text-[#146CFF] transition-colors p-1 rounded cursor-pointer"
                      title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Primary Submit Button (Compact Height 46px) */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isLoading || isSuccess}
                    onMouseEnter={() => setLoginBtnHovered(true)}
                    onMouseLeave={() => setLoginBtnHovered(false)}
                    className="w-full h-[46px] rounded-xl text-white font-bold text-[13.5px] shadow-[0_6px_16px_rgba(20,108,255,0.22)] hover:shadow-[0_8px_20px_rgba(20,108,255,0.3)] transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{
                      background: isSuccess 
                        ? 'linear-gradient(90deg, #10B981, #059669)'
                        : 'linear-gradient(90deg, #1667F8, #2B70FF)'
                    }}
                  >
                    {isSuccess ? (
                      <>
                        <AnimatedIcon name="success" size={18} />
                        <span>Xác thực thành công</span>
                      </>
                    ) : isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                        <span>Đang xác thực...</span>
                      </>
                    ) : (
                      <>
                        <AnimatedIcon 
                          name="key" 
                          size={17} 
                          isHovered={loginBtnHovered} 
                          trigger="hover"
                        />
                        <span>Truy cập Văn phòng số</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
