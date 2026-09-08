import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, User, Phone, MapPin, Sparkles, Check, X, ShieldCheck, Send, 
  Award, QrCode, Copy, CheckCircle2, Server, CloudUpload, ArrowRight, Download,
  Sun, Cloud, Zap, Building2, Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OFFICIAL_NEIGHBORHOOD_NAMES } from '../data/neighborhoodsList';
import { AppStorageEngine } from '../lib/storage';
import { adminCollaborationService } from '../lib/adminCollaborationService';
import { VolunteerRegistration } from '../types';

interface VolunteerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (title: string, message: string) => void;
}

type AnimState = 'FORM' | 'FOLDING' | 'FLYING' | 'DELIVERED' | 'CERTIFICATE';

export const VolunteerRegistrationModal: React.FC<VolunteerRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState(OFFICIAL_NEIGHBORHOOD_NAMES[0]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>(['An sinh & Cứu trợ']);
  const [note, setNote] = useState('');
  
  const [animState, setAnimState] = useState<AnimState>('FORM');
  const [flightProgress, setFlightProgress] = useState(0);
  const [createdReg, setCreatedReg] = useState<VolunteerRegistration | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setAnimState('FORM');
      setFlightProgress(0);
      setCopiedCode(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const volunteerTeams = [
    { id: 'An sinh & Cứu trợ', desc: 'Hỗ trợ trao quà, hỗ trợ hộ khó khăn, cứu trợ đột xuất' },
    { id: 'Bảo vệ Môi trường & Xanh hóa', desc: 'Chủ nhật Xanh, phân loại rác thải, trồng cây xanh' },
    { id: 'Tổ Công nghệ số Cộng đồng', desc: 'Tuyên truyền, hướng dẫn người dân dùng Dịch vụ công & App số' },
    { id: 'Đội Phản ứng nhanh MTTQ', desc: 'Tham gia cứu hộ, điều tiết sự kiện đại đoàn kết địa phương' }
  ];

  const toggleTeam = (teamId: string) => {
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams(selectedTeams.filter(t => t !== teamId));
    } else {
      setSelectedTeams([...selectedTeams, teamId]);
    }
  };

  // Play Web Audio Sound Effects for Paper Airplane Flight
  const playAirplaneSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Whoosh Flight Sound
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.6);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();

      // Chime Arrive Sound after 2.4s
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6

        chimeGain.gain.setValueAtTime(0.2, ctx.currentTime);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

        osc.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      }, 2400);
    } catch {
      // Audio fallback
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      alert('Vui lòng điền đầy đủ Họ và tên cùng Số điện thoại liên hệ');
      return;
    }

    if (selectedTeams.length === 0) {
      alert('Vui lòng chọn ít nhất 01 Lĩnh vực / Đội hình tham gia');
      return;
    }

    // Generate Volunteer Code
    const randomNum = Math.floor(100 + Math.random() * 900);
    const code = `TNV-2026-CH${randomNum}`;
    const nowStr = new Date().toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const newReg: VolunteerRegistration = {
      id: 'vol-' + Date.now(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      neighborhood,
      teams: selectedTeams,
      note: note.trim(),
      submittedAt: nowStr,
      code,
      status: 'PENDING'
    };

    setCreatedReg(newReg);

    // Save to storage
    AppStorageEngine.saveVolunteer(newReg);

    // Publish Activity Event to Admin
    adminCollaborationService.publishActivityEvent({
      actor: { id: 'public-user', name: fullName.trim() },
      action: 'CREATE',
      entity: 'volunteer',
      entityId: newReg.id,
      entityTitle: `Tình nguyện viên ${fullName.trim()} (${code})`,
      details: `Đăng ký Đội hình: ${selectedTeams.join(', ')} tại ${neighborhood}`,
      route: 'volunteers'
    });

    // Start Paper Airplane Animation sequence
    playAirplaneSound();
    setAnimState('FOLDING');

    setTimeout(() => {
      setAnimState('FLYING');
      
      // Animate progress 0 -> 100%
      let p = 0;
      const interval = setInterval(() => {
        p += 5;
        setFlightProgress(Math.min(100, p));
        if (p >= 100) {
          clearInterval(interval);
          setAnimState('DELIVERED');
          setTimeout(() => {
            setAnimState('CERTIFICATE');
            if (onSuccess) {
              onSuccess('Đăng Ký Tình Nguyện Viên Thành Công!', `Mã số ${code} đã được chuyển về Hòm thư Admin MTTQ Phường Chánh Hiệp.`);
            }
          }, 800);
        }
      }, 90);
    }, 1200);
  };

  const handleCopyCode = () => {
    if (!createdReg) return;
    navigator.clipboard.writeText(createdReg.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-3 sm:p-4 overflow-hidden">
      
      {/* --------------------------------------------------------------------- */}
      {/* 1. FORM STATE & FOLDING STAGE */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence mode="wait">
        {(animState === 'FORM' || animState === 'FOLDING') && (
          <motion.div
            key="modal-form-container"
            initial={{ scale: 0.92, opacity: 0, y: 15 }}
            animate={
              animState === 'FOLDING' 
                ? {
                    scale: [1, 0.8, 0.2, 0.05],
                    rotateX: [0, 60, 120, 180],
                    rotateY: [0, -45, -90, -180],
                    opacity: [1, 0.9, 0.5, 0],
                    y: [0, -30, -100, -200]
                  }
                : { scale: 1, opacity: 1, y: 0, rotateX: 0, rotateY: 0 }
            }
            transition={
              animState === 'FOLDING'
                ? { duration: 1.2, ease: "easeInOut" }
                : { duration: 0.3 }
            }
            style={{ perspective: 1000 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] my-auto text-slate-900"
          >
            {/* Bright Luminous Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white px-4 py-3.5 sm:px-5 sm:py-4 relative shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3.5 right-3.5 p-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-3 pr-8">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-amber-300 shrink-0 shadow-xs">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 bg-white/15 px-2 py-0.5 rounded-md border border-amber-300/30">
                      KẾT NỐI SỨC MẠNH CỘNG ĐỒNG
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-white leading-tight mt-0.5">
                    Đăng Ký Tình Nguyện Viên MTTQ
                  </h2>
                  <p className="text-[11px] text-blue-100 font-medium">
                    Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
                {/* Row 1: Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 mb-1">
                      Họ và tên Tình nguyện viên <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-700 mb-1">
                      Số điện thoại / Zalo <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="0901234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Neighborhood */}
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    Khu phố sinh sống / Tác nghiệp
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <select
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    >
                      {OFFICIAL_NEIGHBORHOOD_NAMES.map((kp) => (
                        <option key={kp} value={kp}>{kp}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 3: Volunteer Teams */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-black text-slate-700">
                      Chọn Đội hình / Lĩnh vực tham gia <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Có thể chọn nhiều
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {volunteerTeams.map((team) => {
                      const isSelected = selectedTeams.includes(team.id);
                      return (
                        <div
                          key={team.id}
                          onClick={() => toggleTeam(team.id)}
                          className={`p-2.5 rounded-2xl border transition cursor-pointer flex items-start gap-2.5 ${
                            isSelected 
                              ? 'bg-blue-50/90 border-blue-500 text-blue-900 shadow-2xs' 
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition ${
                            isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold leading-tight">{team.id}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5 leading-snug line-clamp-2">{team.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Row 4: Note */}
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    Ghi chú thêm (Kỹ năng, thời gian rảnh)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ví dụ: Rảnh sáng Chủ nhật, có xe máy, có kỹ năng chụp ảnh / tin học..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-slate-50/95 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
                <span className="text-[11px] text-slate-500 hidden sm:inline-flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  Bảo mật thông tin & kết nối tức thì
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-black text-xs shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer group"
                  >
                    <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    <span>Gửi Đăng Ký Ngay</span>
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------------------- */}
      {/* 2. BRIGHT DAYLIGHT SKY CANVAS & PAPER AIRPLANE FLYING STAGE */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {(animState === 'FLYING' || animState === 'DELIVERED') && (
          <motion.div
            key="bright-sky-canvas-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gradient-to-b from-sky-400 via-sky-200 to-blue-50/90 backdrop-blur-md flex flex-col items-center justify-center p-4 overflow-hidden"
          >
            {/* Sun Rays & Golden Luminous Lighting */}
            <div className="absolute top-0 left-0 w-full h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200/60 via-sky-300/30 to-transparent pointer-events-none" />
            
            {/* Fluffy Floating White Clouds */}
            <motion.div 
              animate={{ x: [0, 40, 0] }} 
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} 
              className="absolute top-12 left-10 opacity-80 pointer-events-none"
            >
              <Cloud className="w-24 h-24 text-white fill-white drop-shadow-md" />
            </motion.div>

            <motion.div 
              animate={{ x: [0, -50, 0] }} 
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} 
              className="absolute top-24 right-1/4 opacity-75 pointer-events-none"
            >
              <Cloud className="w-32 h-32 text-white fill-white drop-shadow-md" />
            </motion.div>

            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-md text-amber-600 font-black text-xs uppercase tracking-wider">
              <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
              <span>Bầu Trời Số Phường Chánh Hiệp 4.0</span>
            </div>

            {/* Target Admin Server Building (Top Right) */}
            <div className="absolute top-8 right-8 sm:top-12 sm:right-16 flex items-center gap-3 z-10">
              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-xl ${
                  animState === 'DELIVERED' 
                    ? 'bg-emerald-500 text-white border-emerald-300 shadow-emerald-500/40 scale-110' 
                    : 'bg-white/95 text-blue-600 border-sky-300 shadow-blue-500/20'
                }`}>
                  {animState === 'DELIVERED' ? (
                    <CheckCircle2 className="w-9 h-9 text-white animate-bounce" />
                  ) : (
                    <Building2 className="w-8 h-8 text-blue-600 animate-pulse" />
                  )}
                </div>
                {/* Radar pulse rings */}
                <div className="absolute inset-0 rounded-2xl border-2 border-sky-400 animate-ping opacity-40 pointer-events-none" />
              </div>

              <div className="text-left text-slate-900 hidden sm:block bg-white/80 backdrop-blur-md border border-white/90 p-2.5 rounded-2xl shadow-md">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">
                    Trung Tâm Tiếp Nhận Admin
                  </span>
                </div>
                <div className="text-xs font-black text-slate-900">Ủy ban MTTQ Việt Nam Phường Chánh Hiệp</div>
              </div>
            </div>

            {/* FLYING PAPER AIRPLANE ANIMATION PATH */}
            <div className="relative w-full max-w-xl h-64 sm:h-80 my-auto flex items-center justify-center">
              
              {/* Flight Vector Trail (SVG Curve) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" overflow="visible">
                <defs>
                  <linearGradient id="brightPlaneTrail" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#4f46e5" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <path
                  d="M 40,240 Q 180,40 320,180 T 520,60"
                  fill="none"
                  stroke="url(#brightPlaneTrail)"
                  strokeWidth="4"
                  strokeDasharray="8 6"
                  className="opacity-90 animate-pulse"
                />
              </svg>

              {/* The Luminous Origami Paper Airplane */}
              <motion.div
                initial={{ x: -220, y: 120, rotate: -25, scale: 0.6, opacity: 0 }}
                animate={
                  animState === 'DELIVERED'
                    ? { x: 180, y: -100, rotate: 10, scale: 0.2, opacity: 0 }
                    : {
                        x: [-220, -100, 40, 180],
                        y: [120, -20, 80, -100],
                        rotate: [-25, -10, 15, -20],
                        scale: [0.6, 1.15, 0.95, 0.3],
                        opacity: [0, 1, 1, 0.8]
                      }
                }
                transition={{ duration: 2.2, ease: "easeInOut" }}
                className="absolute z-20 flex flex-col items-center justify-center cursor-pointer"
              >
                {/* Airplane Body */}
                <div className="relative group">
                  {/* Sunlit Sparkle Glow */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-amber-300 via-red-400 to-sky-400 rounded-full blur-xl opacity-80 group-hover:opacity-100 animate-pulse" />
                  
                  {/* Paper Airplane SVG Graphic */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 text-amber-400 drop-shadow-[0_12px_24px_rgba(245,158,11,0.6)]">
                    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full transform -rotate-45">
                      <path
                        d="M22 2L11 13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 2L15 22L11 13L2 9L22 2Z"
                        fill="url(#brightPaperGradient)"
                        stroke="#fef08a"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient id="brightPaperGradient" x1="2" y1="2" x2="22" y2="22">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="40%" stopColor="#fbbf24" />
                          <stop offset="100%" stopColor="#dc2626" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Emblem Badge on Airplane Wing */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-red-600 rounded-full border border-amber-300 flex items-center justify-center shadow-md">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-spin" />
                    </div>
                  </div>
                </div>

                {/* Floating Volunteer Code Tag */}
                {createdReg && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 bg-white/95 border border-amber-400/80 px-3 py-1 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1.5 text-slate-900"
                  >
                    <span className="text-[10px] font-black text-red-600 uppercase">
                      {createdReg.code}
                    </span>
                    <span className="text-[10px] text-slate-700 font-bold">
                      • {createdReg.fullName}
                    </span>
                  </motion.div>
                )}
              </motion.div>

            </div>

            {/* Bright Flight Progress Card */}
            <div className="relative z-10 w-full max-w-md bg-white/90 border border-sky-200/90 p-5 rounded-3xl backdrop-blur-xl text-center space-y-3 shadow-2xl">
              <div className="flex items-center justify-between text-xs text-slate-800 font-bold px-1">
                <span className="flex items-center gap-2 text-blue-700 font-black">
                  <CloudUpload className="w-4 h-4 text-blue-600 animate-bounce" />
                  <span>Chuyển giao hồ sơ số về Hòm thư Admin</span>
                </span>
                <span className="text-amber-600 font-black text-sm">{flightProgress}%</span>
              </div>

              {/* Progress track */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-sky-400 via-blue-600 to-amber-500 rounded-full shadow-md"
                  style={{ width: `${flightProgress}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>

              <p className="text-xs text-slate-600 font-semibold">
                {flightProgress < 40 && 'Đang gấp văn bản thành máy bay giấy Origami...'}
                {flightProgress >= 40 && flightProgress < 80 && 'Đang bay qua bầu trời số Chánh Hiệp 4.0...'}
                {flightProgress >= 80 && 'Hạ cánh trực tiếp vào Hòm thư Ban Công tác Mặt trận...'}
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------------------- */}
      {/* 3. BRIGHT & LUMINOUS DIGITAL CERTIFICATE STAGE */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {animState === 'CERTIFICATE' && createdReg && (
          <motion.div
            key="certificate-stage"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative w-full max-w-lg bg-gradient-to-b from-white via-amber-50/50 to-red-50/20 border-2 border-amber-400/90 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-900 space-y-4 my-auto overflow-hidden"
          >
            {/* Background Luminous Lighting */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Official Header */}
            <div className="text-center space-y-1 relative z-10 border-b border-amber-300/80 pb-3">
              <div className="flex items-center justify-center gap-1.5 text-red-700 font-black text-[10px] tracking-widest uppercase">
                <span>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span>
              </div>
              <div className="text-[10px] text-slate-600 font-bold">Độc lập - Tự do - Hạnh phúc</div>
              
              <div className="w-12 h-12 bg-gradient-to-tr from-amber-400 via-rose-500 to-red-600 rounded-full mx-auto my-2 p-0.5 shadow-md border border-amber-300 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-red-600 flex items-center justify-center text-amber-300">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <h2 className="text-base sm:text-lg font-black text-red-700 tracking-wide uppercase">
                THẺ CHỨNG NHẬN TÌNH NGUYỆN VIÊN MẶT TRẬN
              </h2>
              <p className="text-xs text-slate-700 font-bold">
                Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp
              </p>
            </div>

            {/* Certificate Details Card */}
            <div className="bg-white/90 border border-slate-200/90 rounded-2xl p-4 space-y-3 relative z-10 shadow-sm">
              {/* Registration Code Banner */}
              <div className="flex items-center justify-between bg-amber-500/10 border border-amber-400/60 px-3.5 py-2 rounded-xl">
                <div>
                  <div className="text-[9px] font-black uppercase text-amber-800 tracking-wider">Mã Số Xác Nhận</div>
                  <div className="text-sm font-black text-red-700 font-mono">{createdReg.code}</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-black rounded-lg shadow-xs transition cursor-pointer flex items-center gap-1"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">Họ và tên:</span>
                  <span className="font-black text-slate-900 text-sm">{createdReg.fullName}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">Số điện thoại / Zalo:</span>
                  <span className="font-bold text-slate-800">{createdReg.phone}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">Địa bàn tác nghiệp:</span>
                  <span className="font-bold text-blue-700">{createdReg.neighborhood}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">Thời gian đăng ký:</span>
                  <span className="font-semibold text-slate-700 text-[11px]">{createdReg.submittedAt}</span>
                </div>
              </div>

              {/* Teams */}
              <div>
                <span className="text-[10px] text-slate-500 font-medium block mb-1">Đội hình tham gia:</span>
                <div className="flex flex-wrap gap-1.5">
                  {createdReg.teams.map((t) => (
                    <span key={t} className="px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Official Seal Badge */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-600">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Đã ghi nhận trên hệ thống Chánh Hiệp Digital Office</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                  <QrCode className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-1 relative z-10">
              <button
                type="button"
                onClick={() => {
                  alert(`Đã lưu Thẻ Tình Nguyện Viên mã số ${createdReg.code} vào thiết bị của bạn.`);
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-600" />
                <span>Tải Thẻ Về Máy</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Hoàn Tất & Đóng</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
