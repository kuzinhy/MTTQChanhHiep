import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ShieldAlert, Key, UserMinus, Eye, EyeOff, Loader2, PlayCircle, Clock } from 'lucide-react';
import { StaffUser, AuditLog } from '../../types';
import { getOfficialCadreAvatarSvg } from '../../utils/officialImages';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { CloudDatabase } from '../../lib/firestoreService';
import { AppStorageEngine } from '../../lib/storage';

// Local storage key to sync activity across tabs
const ACTIVITY_STORAGE_KEY = 'last_office_activity_timestamp';
const DEFAULT_TIMEOUT_MINUTES = 15;

interface SessionLockScreenProps {
  currentUser: StaffUser | null;
  onUnlock: () => void;
  onLogout: () => void;
  auditLogs: AuditLog[];
  setAuditLogs: React.Dispatch<React.SetStateAction<AuditLog[]>>;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
}

export const SessionLockScreen: React.FC<SessionLockScreenProps> = ({
  currentUser,
  onUnlock,
  onLogout,
  auditLogs,
  setAuditLogs,
  isLocked,
  setIsLocked,
}) => {
  // Session timeout setting (in milliseconds). Standard is 15 minutes, configurable.
  const [timeoutDuration, setTimeoutDuration] = useState<number>(() => {
    const saved = localStorage.getItem('office_session_timeout_ms');
    return saved ? Number(saved) : DEFAULT_TIMEOUT_MINUTES * 60 * 1000;
  });

  const [warningRemaining, setWarningRemaining] = useState<number | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update activity timestamp in localStorage and local state
  const resetActivityTimer = () => {
    if (!currentUser || isLocked) return;
    const nowStr = Date.now().toString();
    localStorage.setItem(ACTIVITY_STORAGE_KEY, nowStr);
    setWarningRemaining(null);
  };

  // Listen to user interaction to reset inactivity timer
  useEffect(() => {
    if (!currentUser || isLocked) return;

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    const handleEvent = () => resetActivityTimer();

    events.forEach(event => window.addEventListener(event, handleEvent));
    
    // Initial set
    resetActivityTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, handleEvent));
    };
  }, [currentUser, isLocked]);

  // Synchronize activity across multiple browser tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ACTIVITY_STORAGE_KEY && e.newValue) {
        if (!isLocked) {
          setWarningRemaining(null);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isLocked]);

  // Monitor inactivity state every second
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      if (isLocked) return;

      const lastActivity = Number(localStorage.getItem(ACTIVITY_STORAGE_KEY) || Date.now());
      const elapsed = Date.now() - lastActivity;

      // When the elapsed time gets close to the timeout limit (within 60 seconds)
      const warningThreshold = timeoutDuration - 60000;

      if (elapsed >= timeoutDuration) {
        // Complete timeout limit reached -> Lock session
        triggerLockSession();
      } else if (elapsed >= warningThreshold) {
        // Display warning modal with remaining seconds
        const secondsLeft = Math.ceil((timeoutDuration - elapsed) / 1000);
        setWarningRemaining(secondsLeft > 0 ? secondsLeft : 1);
      } else {
        setWarningRemaining(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser, isLocked, timeoutDuration]);

  // Trigger secure session lock
  const triggerLockSession = () => {
    if (isLocked) return;
    setIsLocked(true);
    setWarningRemaining(null);

    if (currentUser) {
      // Write system audit log event for security audit
      const newLog: AuditLog = {
        id: 'audit-' + Date.now(),
        userId: currentUser.id,
        userName: currentUser.fullname,
        action: 'KHOA_PHIEN',
        entity: 'Hệ thống Bảo mật',
        details: `Hệ thống tự động khóa phiên làm việc của cán bộ do không hoạt động quá ${Math.round(timeoutDuration / 60000)} phút.`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };

      setAuditLogs(prev => {
        const next = [newLog, ...prev];
        AppStorageEngine.saveAuditLogs(next);
        return next;
      });
      CloudDatabase.logAudit(newLog).catch(console.warn);
    }
  };

  // Perform Firebase Auth re-authentication to securely unlock the dashboard
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || isVerifying) return;
    
    if (!password.trim()) {
      setErrorMsg('Vui lòng nhập mật khẩu tài khoản công vụ của bạn!');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    try {
      // Re-authenticate using the exact login function
      await signInWithEmailAndPassword(auth, currentUser.email, password);
      
      // On success, reset state
      setIsLocked(false);
      setPassword('');
      setErrorMsg(null);
      resetActivityTimer();
      onUnlock();

      // Log success unlock
      const newLog: AuditLog = {
        id: 'audit-' + Date.now(),
        userId: currentUser.id,
        userName: currentUser.fullname,
        action: 'MO_KHOA_PHIEN',
        entity: 'Hệ thống Bảo mật',
        details: 'Cán bộ mở khóa phiên làm việc thành công bằng mật khẩu.',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      setAuditLogs(prev => {
        const next = [newLog, ...prev];
        AppStorageEngine.saveAuditLogs(next);
        return next;
      });
      CloudDatabase.logAudit(newLog).catch(console.warn);

    } catch (err: any) {
      console.error('Lock screen unlock error:', err);
      // Give descriptive feedback
      if (err.code === 'auth/wrong-password') {
        setErrorMsg('Mật khẩu bảo mật không chính xác. Vui lòng kiểm tra lại!');
      } else if (err.code === 'auth/network-request-failed') {
        setErrorMsg('Lỗi kết nối mạng. Hãy kiểm tra kết nối Internet!');
      } else {
        setErrorMsg('Mật khẩu không khớp hoặc tài khoản không khả dụng!');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle immediate manual logout
  const handleManualLogout = async () => {
    if (currentUser) {
      const newLog: AuditLog = {
        id: 'audit-' + Date.now(),
        userId: currentUser.id,
        userName: currentUser.fullname,
        action: 'DANG_XUAT',
        entity: 'Hệ thống Bảo mật',
        details: 'Cán bộ chủ động thoát phiên làm việc từ màn hình khóa.',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      setAuditLogs(prev => {
        const next = [newLog, ...prev];
        AppStorageEngine.saveAuditLogs(next);
        return next;
      });
      CloudDatabase.logAudit(newLog).catch(console.warn);
    }

    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Signout failed:', e);
    }

    setIsLocked(false);
    setWarningRemaining(null);
    setPassword('');
    onLogout();
  };

  // Save changes to timeout preference
  const handleSetTimeout = (minutes: number) => {
    const ms = minutes * 60 * 1000;
    setTimeoutDuration(ms);
    localStorage.setItem('office_session_timeout_ms', ms.toString());
    resetActivityTimer();
  };

  return (
    <>
      {/* 1. SEAMLESS countdown warning modal */}
      <AnimatePresence>
        {warningRemaining !== null && warningRemaining > 0 && !isLocked && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-2xl border border-stone-200 p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-700 shrink-0">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    Cảnh báo Hết hạn Phiên
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Bạn đã không thao tác trong hệ thống quản trị một thời gian. Vì lý do bảo mật và bảo vệ dữ liệu công vụ, phiên làm việc của bạn sẽ tự động khóa sau:
                  </p>
                </div>
              </div>

              {/* Graphical circular countdown layout */}
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700 animate-spin" style={{ animationDuration: '4s' }} />
                  <span className="text-xs font-bold text-amber-950">Thời gian chờ tự động:</span>
                </div>
                <div className="flex items-baseline gap-1 font-mono text-xl font-black text-amber-800">
                  <span>{warningRemaining}</span>
                  <span className="text-[10px] font-bold uppercase text-amber-600">giây</span>
                </div>
              </div>

              {/* Actions row */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleManualLogout}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <UserMinus className="w-3.5 h-3.5" />
                  <span>Đăng xuất ngay</span>
                </button>
                <button
                  type="button"
                  onClick={resetActivityTimer}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Tiếp tục làm việc</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. HIGH-SECURITY full-screen lock screen overlay */}
      <AnimatePresence>
        {isLocked && currentUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="w-full max-w-sm bg-white rounded-3xl border border-slate-200/80 p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Subtle top decoration */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-700" />

              <div className="flex flex-col items-center text-center space-y-6">
                {/* Secure Lock Icon */}
                <div className="relative">
                  <div className="w-14 h-14 bg-red-50 text-red-700 rounded-2xl flex items-center justify-center shadow-inner">
                    <Lock className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                  </div>
                </div>

                {/* Lock info */}
                <div className="space-y-1">
                  <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">
                    Phiên Làm Việc Đã Khóa
                  </h2>
                  <p className="text-[11px] font-bold text-slate-500 tracking-wider flex items-center justify-center gap-1">
                    <span>HỆ THỐNG PHÒNG THỦ &amp; AN TOÀN THÔNG TIN</span>
                  </p>
                </div>

                {/* Locked user card profile */}
                <div className="w-full p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center gap-3">
                  <img
                    src={currentUser.avatar || getOfficialCadreAvatarSvg(currentUser.fullname, currentUser.position)}
                    alt="avatar"
                    className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left overflow-hidden">
                    <div className="font-extrabold text-slate-900 text-xs truncate">{currentUser.fullname}</div>
                    <div className="text-[10px] font-bold text-slate-500 truncate">{currentUser.position}</div>
                    <div className="text-[9px] font-semibold text-red-700 uppercase tracking-wider mt-0.5">{currentUser.department}</div>
                  </div>
                </div>

                {/* Password/PIN Re-authentication Form */}
                <form onSubmit={handleUnlock} className="w-full space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block text-left">
                      Nhập Mật khẩu công vụ để mở khóa
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Key className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isVerifying}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {errorMsg && (
                    <motion.p
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] font-bold text-red-600 text-left leading-normal"
                    >
                      ⚠️ {errorMsg}
                    </motion.p>
                  )}

                  {/* Actions buttons */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Đang xác minh bảo mật...</span>
                        </>
                      ) : (
                        <>
                          <span>Mở khóa Phiên làm việc</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleManualLogout}
                      className="w-full py-2 bg-transparent text-slate-500 hover:text-red-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                      <span>Đăng xuất / Tài khoản khác</span>
                    </button>
                  </div>
                </form>

                {/* Session duration fast picker (For Demo/Testing convenience) */}
                <div className="w-full pt-4 border-t border-slate-100 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Thiết lập thời gian khóa tự động:
                  </span>
                  <div className="flex gap-1.5">
                    {[1, 5, 15, 30].map((mins) => {
                      const isActive = timeoutDuration === mins * 60 * 1000;
                      return (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => handleSetTimeout(mins)}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-md border transition-all ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {mins === 1 ? '1 phút' : `${mins}p`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
