import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { 
  LogIn, FileText, Key, ShieldCheck, CheckCircle2, AlertTriangle, 
  CloudUpload, ClipboardList, Bell, Heart, Sparkles, UserCheck 
} from 'lucide-react';
import { AnimatedIconName } from '../../lib/animatedIcons';

export interface AnimatedIconProps {
  name: AnimatedIconName;
  size?: number;
  trigger?: 'load' | 'hover' | 'click' | 'loop';
  colorScheme?: 'default' | 'light' | 'primary' | 'white';
  className?: string;
  isHovered?: boolean;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  name,
  size,
  trigger = 'hover',
  colorScheme = 'default',
  className = '',
  isHovered: externalHovered
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [internalHover, setInternalHover] = useState(false);
  const [animCycle, setAnimCycle] = useState(0);

  const isTriggered = externalHovered || internalHover;

  // Re-trigger micro-interaction on hover or state change
  useEffect(() => {
    if (isTriggered) {
      setAnimCycle((prev) => prev + 1);
    }
  }, [isTriggered]);

  // Accessibility Fallback for prefers-reduced-motion
  if (shouldReduceMotion) {
    const s = size || 24;
    switch (name) {
      case 'document':
        return <FileText className={className} style={{ width: s, height: s }} />;
      case 'login':
        return <LogIn className={className} style={{ width: s, height: s }} />;
      case 'key':
        return <Key className={className} style={{ width: s, height: s }} />;
      case 'security':
        return <ShieldCheck className={className} style={{ width: s, height: s }} />;
      case 'cloud_upload':
        return <CloudUpload className={className} style={{ width: s, height: s }} />;
      case 'tasks':
        return <ClipboardList className={className} style={{ width: s, height: s }} />;
      case 'bell':
        return <Bell className={className} style={{ width: s, height: s }} />;
      case 'citizen':
        return <Heart className={className} style={{ width: s, height: s }} />;
      case 'ai_brain':
        return <Sparkles className={className} style={{ width: s, height: s }} />;
      case 'user_badge':
        return <UserCheck className={className} style={{ width: s, height: s }} />;
      case 'success':
        return <CheckCircle2 className={className} style={{ width: s, height: s }} />;
      case 'warning':
        return <AlertTriangle className={className} style={{ width: s, height: s }} />;
    }
  }

  /* ==========================================================================
     1. DOCUMENT & DIGITAL WORKSPACE (LORDICON-INSPIRED MULTI-LAYER PAPER & SCAN)
     ========================================================================== */
  if (name === 'document') {
    const s = size || 110;
    const isLightOnDark = colorScheme === 'light' || colorScheme === 'white';

    return (
      <div 
        className={`relative flex items-center justify-center select-none cursor-pointer group ${className}`}
        style={{ width: s, height: s }}
        onMouseEnter={() => setInternalHover(true)}
        onMouseLeave={() => setInternalHover(false)}
      >
        {/* Soft Digital Orbit Glow */}
        <motion.div 
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{
            scale: isTriggered ? [1, 1.22, 1.12] : [1, 1.06, 1],
            opacity: isTriggered ? [0.45, 0.75, 0.5] : [0.25, 0.4, 0.25]
          }}
          transition={{
            duration: isTriggered ? 1.2 : 3.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            background: isLightOnDark 
              ? 'radial-gradient(circle, rgba(56, 189, 248, 0.45) 0%, rgba(20, 108, 255, 0.22) 42%, transparent 72%)'
              : 'radial-gradient(circle, rgba(20, 108, 255, 0.3) 0%, rgba(56, 189, 248, 0.15) 45%, transparent 70%)',
            filter: 'blur(8px)'
          }}
        />

        <svg 
          key={animCycle}
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 overflow-visible"
        >
          <defs>
            <linearGradient id="docGrad_main" x1="60" y1="30" x2="140" y2="160" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.8" stopColor="#F8FAFC" />
              <stop offset="1" stopColor="#E2E8F0" />
            </linearGradient>

            <linearGradient id="docGrad_back" x1="40" y1="40" x2="130" y2="150" gradientUnits="userSpaceOnUse">
              <stop stopColor="#93C5FD" />
              <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>

            <linearGradient id="laserGrad" x1="0" y1="0" x2="1" y2="0">
              <stop stopColor="transparent" />
              <stop offset="0.25" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="0.5" stopColor="#60A5FA" />
              <stop offset="0.75" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="1" stopColor="transparent" />
            </linearGradient>

            <linearGradient id="orbitRingGrad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="0.5" stopColor="#146CFF" stopOpacity="0.3" />
              <stop offset="1" stopColor="#38BDF8" stopOpacity="0.7" />
            </linearGradient>

            <filter id="docShadow3D" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#0F2B66" floodOpacity="0.32" />
            </filter>
            
            <filter id="laserGlowFx" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKGROUND CONCENTRIC DIGITAL ORBIT RING */}
          <motion.circle 
            cx="100" 
            cy="100" 
            r="82" 
            stroke="url(#orbitRingGrad)" 
            strokeWidth="1.2" 
            strokeDasharray="4 6" 
            animate={{ rotate: 360 }}
            transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '100px 100px' }}
          />

          {/* SATELLITE DIGITAL NODES */}
          {/* Node 1: Left Commune Office */}
          <motion.g
            animate={{
              y: isTriggered ? [-3, 3, -3] : [0, 0, 0]
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx="28" cy="100" r="13" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
            <path d="M23 105V99L28 95L33 99V105H23Z" fill="#38BDF8" />
            <rect x="26" y="101" width="4" height="4" fill="#0F172A" />
          </motion.g>

          {/* Node 2: Right Citizen Portal */}
          <motion.g
            animate={{
              y: isTriggered ? [3, -3, 3] : [0, 0, 0]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          >
            <circle cx="172" cy="98" r="13" fill="#0F172A" stroke="#60A5FA" strokeWidth="1.5" />
            <circle cx="172" cy="95" r="3.5" fill="#60A5FA" />
            <path d="M166 104 C166 100, 169 98, 172 98 C175 98, 178 100, 178 104" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
          </motion.g>

          {/* FLOATING LEVITATING DOCUMENT STACK */}
          <motion.g
            animate={{
              y: isTriggered ? [-7, 3, -7] : [-3, 3, -3],
              rotate: isTriggered ? [-1.2, 1.2, -1.2] : [-0.5, 0.5, -0.5]
            }}
            transition={{
              duration: isTriggered ? 2 : 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{ transformOrigin: '100px 100px' }}
            filter="url(#docShadow3D)"
          >
            {/* Background Sheet 2 (Underlying angled document) */}
            <rect 
              x="58" 
              y="42" 
              width="78" 
              height="108" 
              rx="9" 
              fill="url(#docGrad_back)" 
              opacity="0.7" 
              transform="rotate(-4 100 100)" 
            />

            {/* Background Sheet 1 (Middle document) */}
            <rect 
              x="62" 
              y="38" 
              width="80" 
              height="112" 
              rx="9" 
              fill="#CBD5E1" 
              opacity="0.85" 
              transform="rotate(-1.5 100 100)" 
            />

            {/* FOREGROUND MAIN DOCUMENT CARD */}
            <rect 
              x="58" 
              y="34" 
              width="84" 
              height="118" 
              rx="10" 
              fill="url(#docGrad_main)" 
              stroke="#38BDF8" 
              strokeWidth="1.8" 
            />

            {/* Folded Top-Right Corner */}
            <path 
              d="M124 34 L142 52 H128 C125.791 52 124 50.2091 124 48 V34 Z" 
              fill="#94A3B8" 
              opacity="0.75" 
            />

            {/* Document Header Bar (Royal Blue) */}
            <rect x="68" y="46" width="38" height="6" rx="3" fill="#146CFF" />
            <circle cx="114" cy="49" r="3" fill="#38BDF8" />

            {/* Body Text Lines */}
            <rect x="68" y="60" width="62" height="3.5" rx="1.75" fill="#64748B" />
            <rect x="68" y="68" width="54" height="3" rx="1.5" fill="#94A3B8" />
            <rect x="68" y="75" width="58" height="3" rx="1.5" fill="#CBD5E1" />
            <rect x="68" y="82" width="46" height="3" rx="1.5" fill="#CBD5E1" />
            <rect x="68" y="89" width="52" height="3" rx="1.5" fill="#CBD5E1" />

            {/* AI LASER SCANNING BEAM (SWEEPS ACCROSS TEXT) */}
            <motion.line 
              x1="60" 
              y1="56" 
              x2="140" 
              y2="56" 
              stroke="url(#laserGrad)" 
              strokeWidth="3.2" 
              filter="url(#laserGlowFx)"
              animate={{
                y: [0, 50, 0],
                opacity: [0.35, 1, 0.35]
              }}
              transition={{
                duration: isTriggered ? 1.6 : 3.2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />

            {/* OFFICIAL RED SEAL STAMP WITH ELASTIC BOUNCE */}
            <motion.g
              initial={{ scale: 0.9 }}
              animate={{
                scale: isTriggered ? [0.95, 1.25, 1] : 1,
                rotate: isTriggered ? [0, -12, 0] : 0
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ transformOrigin: '122px 126px' }}
            >
              <circle cx="122" cy="126" r="12" fill="#DC2626" />
              <circle cx="122" cy="126" r="9.5" stroke="#FEE2E2" strokeWidth="1.2" strokeDasharray="3 2" fill="none" />
              {/* Gold Official Star in Center */}
              <polygon 
                points="122,120.5 123.6,124.5 127.8,124.7 124.5,127.2 125.8,131.2 122,128.8 118.2,131.2 119.5,127.2 116.2,124.7 120.4,124.5" 
                fill="#FEF08A" 
              />
            </motion.g>

            {/* Signature Ribbon Line */}
            <path 
              d="M70 126 Q 80 121, 90 128 T 104 124" 
              stroke="#2563EB" 
              strokeWidth="1.8" 
              strokeLinecap="round" 
              fill="none" 
            />
          </motion.g>

          {/* SPARKLE PARTICLES (TWINKLE NODES) */}
          <motion.circle 
            cx="52" 
            cy="46" 
            r="2" 
            fill="#38BDF8" 
            animate={{ scale: [0.5, 1.5, 0.5], opacity: [0.2, 0.9, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle 
            cx="150" 
            cy="68" 
            r="2.5" 
            fill="#60A5FA" 
            animate={{ scale: [0.8, 1.6, 0.8], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          />
        </svg>
      </div>
    );
  }

  /* ==========================================================================
     2. LOGIN PORTAL (LORDICON HIGH-VELOCITY ARROW & LUMINOUS GATEWAY)
     ========================================================================== */
  if (name === 'login') {
    const s = size || 32;
    return (
      <div 
        className={`relative inline-flex items-center justify-center select-none cursor-pointer ${className}`}
        style={{ width: s, height: s }}
        onMouseEnter={() => setInternalHover(true)}
        onMouseLeave={() => setInternalHover(false)}
      >
        <svg 
          key={animCycle}
          viewBox="0 0 36 36" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="portalFrameGrad" x1="16" y1="6" x2="30" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#146CFF" />
              <stop offset="1" stopColor="#38BDF8" />
            </linearGradient>
            <filter id="loginGlowFilter" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#146CFF" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Portal Energy Ripple Rings */}
          <motion.circle
            cx="24"
            cy="18"
            r="11"
            fill="#146CFF"
            opacity={isTriggered ? 0.16 : 0.08}
            animate={{
              scale: isTriggered ? [1, 1.3, 1.1] : [1, 1.08, 1]
            }}
            transition={{ duration: 0.6, repeat: isTriggered ? 1 : Infinity }}
          />

          {/* 3D Portal Gateway Door */}
          <motion.path 
            d="M18 7H24C26.7614 7 29 9.23858 29 12V24C29 26.7614 26.7614 29 24 29H18" 
            stroke="url(#portalFrameGrad)" 
            strokeWidth="2.8" 
            strokeLinecap="round"
            filter="url(#loginGlowFilter)"
            animate={{ 
              strokeWidth: isTriggered ? 3.2 : 2.8
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Threshold Light Beam */}
          <line x1="29" y1="12" x2="29" y2="24" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

          {/* High-Velocity Arrow Speeding Through */}
          <motion.g
            animate={{
              x: isTriggered ? [0, -3, 6, 2] : [0, 2, 0]
            }}
            transition={{
              duration: isTriggered ? 0.55 : 2.2,
              repeat: isTriggered ? 1 : Infinity,
              ease: 'easeOut'
            }}
          >
            {/* Speed Streak Lines */}
            <motion.line 
              x1="4" y1="18" x2="9" y2="18" 
              stroke="#93C5FD" 
              strokeWidth="1.5" 
              strokeLinecap="round"
              animate={{ opacity: isTriggered ? [0, 1, 0] : 0.4 }}
              transition={{ duration: 0.35 }}
            />
            {/* Arrow Stem */}
            <line x1="8" y1="18" x2="22" y2="18" stroke="#146CFF" strokeWidth="2.8" strokeLinecap="round" />
            {/* Arrow Tip */}
            <path 
              d="M16 12L22.5 18L16 24" 
              stroke="#146CFF" 
              strokeWidth="2.8" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            {/* Luminous Core Tip */}
            <circle cx="22.5" cy="18" r="1.5" fill="#38BDF8" />
          </motion.g>
        </svg>
      </div>
    );
  }

  /* ==========================================================================
     3. KEY / SECURITY ACCESS (ROTATING 3D CYPHER KEY & UNLOCK FLARE)
     ========================================================================== */
  if (name === 'key') {
    const s = size || 20;
    return (
      <div 
        className={`inline-flex items-center justify-center select-none ${className}`} 
        style={{ width: s, height: s }}
        onMouseEnter={() => setInternalHover(true)}
        onMouseLeave={() => setInternalHover(false)}
      >
        <motion.div
          className="w-full h-full flex items-center justify-center"
          animate={{
            rotate: isTriggered ? [0, -32, 14, -4, 0] : 0,
            scale: isTriggered ? [1, 1.25, 1.1] : 1
          }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-current">
            <circle cx="7.5" cy="12" r="5" stroke="currentColor" strokeWidth="2.2" />
            <circle cx="7.5" cy="12" r="2" fill="currentColor" opacity="0.6" />
            <path d="M12.5 12H21.5M18 12V15M21 12V15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            
            {/* Sparkle on Key Tip */}
            {isTriggered && (
              <motion.circle 
                cx="21.5" 
                cy="10" 
                r="2" 
                fill="#FBBF24" 
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.8, 0] }}
                transition={{ duration: 0.45 }}
              />
            )}
          </svg>
        </motion.div>
      </div>
    );
  }

  /* ==========================================================================
     4. CYBER SECURITY DEFENSE SHIELD (RADAR GRID & CHECK VALIDATION)
     ========================================================================== */
  if (name === 'security') {
    const s = size || 22;
    return (
      <div 
        className={`inline-flex items-center justify-center select-none ${className}`} 
        style={{ width: s, height: s }}
        onMouseEnter={() => setInternalHover(true)}
        onMouseLeave={() => setInternalHover(false)}
      >
        <motion.div
          className="w-full h-full flex items-center justify-center"
          animate={{
            scale: isTriggered ? [1, 1.18, 1.05] : [1, 1.04, 1]
          }}
          transition={{ duration: isTriggered ? 0.4 : 2.5, repeat: isTriggered ? 1 : Infinity }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-current">
            <defs>
              <linearGradient id="shieldGrad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" />
                <stop offset="1" stopColor="#146CFF" />
              </linearGradient>
            </defs>
            {/* Outer Shield Frame */}
            <path 
              d="M12 22S20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" 
              stroke="currentColor" 
              strokeWidth="2.1" 
              strokeLinejoin="round"
            />
            {/* Center Verified Checkmark */}
            <motion.path 
              d="M9 12L11 14L15 10" 
              stroke="#10B981" 
              strokeWidth="2.4" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              animate={{ pathLength: isTriggered ? [0, 1] : 1 }}
              transition={{ duration: 0.35 }}
            />
          </svg>
        </motion.div>
      </div>
    );
  }

  /* ==========================================================================
     5. GOOGLE DRIVE & DATA CLOUD UPLOAD (BUOYANT CLOUD & ASCENDING DATA STREAM)
     ========================================================================== */
  if (name === 'cloud_upload') {
    const s = size || 28;
    return (
      <div 
        className={`relative inline-flex items-center justify-center select-none cursor-pointer ${className}`}
        style={{ width: s, height: s }}
        onMouseEnter={() => setInternalHover(true)}
        onMouseLeave={() => setInternalHover(false)}
      >
        <svg 
          key={animCycle}
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="cloudMainGrad" x1="6" y1="8" x2="26" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="1" stopColor="#146CFF" />
            </linearGradient>
          </defs>

          {/* Floating Cloud Body */}
          <motion.path
            d="M9 20 C6.24 20, 4 17.76, 4 15 C4 12.5, 5.85 10.45, 8.3 10.08 C9.2 6.5, 12.3 4, 16 4 C20.14 4, 23.56 7.1, 23.95 11.18 C26.25 11.6, 28 13.6, 28 16 C28 18.76, 25.76 21, 23 21 H9 Z"
            stroke="url(#cloudMainGrad)"
            strokeWidth="2.2"
            fill="#E0F2FE"
            fillOpacity="0.4"
            animate={{
              y: isTriggered ? [-2, 1, -2] : [0, -1.5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Ascending Arrow with Light Trail */}
          <motion.g
            animate={{
              y: isTriggered ? [4, -4, 4] : [2, -2, 2]
            }}
            transition={{
              duration: isTriggered ? 1 : 1.8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            {/* Arrow Stem */}
            <line x1="16" y1="25" x2="16" y2="13" stroke="#146CFF" strokeWidth="2.4" strokeLinecap="round" />
            {/* Arrow Head */}
            <path d="M12 17L16 13L20 17" stroke="#146CFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            {/* Glowing Arrow Tip */}
            <circle cx="16" cy="13" r="1.4" fill="#38BDF8" />
          </motion.g>

          {/* Google Drive Tri-color Badge Dot */}
          <circle cx="23" cy="19" r="2.2" fill="#10B981" />
          <circle cx="21" cy="20.5" r="1.5" fill="#F59E0B" />
        </svg>
      </div>
    );
  }

  /* ==========================================================================
     6. TASKS & WORKSPACE CHECKLIST (DYNAMIC TICKING OF ROWS)
     ========================================================================== */
  if (name === 'tasks') {
    const s = size || 24;
    return (
      <div 
        className={`inline-flex items-center justify-center select-none ${className}`} 
        style={{ width: s, height: s }}
        onMouseEnter={() => setInternalHover(true)}
        onMouseLeave={() => setInternalHover(false)}
      >
        <motion.div
          className="w-full h-full flex items-center justify-center"
          animate={{ scale: isTriggered ? [1, 1.15, 1.05] : 1 }}
          transition={{ duration: 0.35 }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-current">
            {/* Clipboard Body */}
            <rect x="4" y="4" width="16" height="17" rx="3" stroke="currentColor" strokeWidth="2" />
            <rect x="8" y="2" width="8" height="3" rx="1.5" fill="currentColor" />
            {/* Task Row 1 Checked */}
            <path d="M8 10L9.5 11.5L12 9" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="14" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
            {/* Task Row 2 Active Check */}
            <motion.path 
              d="M8 15L9.5 16.5L12 14" 
              stroke="#146CFF" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              animate={{ pathLength: isTriggered ? [0, 1] : 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />
            <line x1="14" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
          </svg>
        </motion.div>
      </div>
    );
  }

  /* ==========================================================================
     7. RESONANT NOTIFICATION BELL (PENDULUM SWING & ACOUSTIC SOUND RIPPLES)
     ========================================================================== */
  if (name === 'bell') {
    const s = size || 24;
    return (
      <div 
        className={`inline-flex items-center justify-center select-none cursor-pointer ${className}`} 
        style={{ width: s, height: s }}
        onMouseEnter={() => setInternalHover(true)}
        onMouseLeave={() => setInternalHover(false)}
      >
        <motion.div
          className="w-full h-full flex items-center justify-center relative"
          animate={{
            rotate: isTriggered ? [0, -20, 18, -12, 6, 0] : [0, -6, 6, 0]
          }}
          transition={{
            duration: isTriggered ? 0.6 : 3,
            repeat: isTriggered ? 1 : Infinity,
            ease: 'easeInOut'
          }}
          style={{ transformOrigin: 'top center' }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-current">
            <path 
              d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            <path 
              d="M13.73 21A2 2 0 0 1 10.27 21" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
          {/* Vibrant Red Notification Ping */}
          <motion.span 
            className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-600 border border-white"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </div>
    );
  }

  /* ==========================================================================
     8. CITIZEN & WELFARE HEART (RHYTHMIC HEARTBEAT & SUPPORTING HANDS)
     ========================================================================== */
  if (name === 'citizen') {
    const s = size || 26;
    return (
      <div 
        className={`inline-flex items-center justify-center select-none ${className}`} 
        style={{ width: s, height: s }}
        onMouseEnter={() => setInternalHover(true)}
        onMouseLeave={() => setInternalHover(false)}
      >
        <motion.div
          className="w-full h-full flex items-center justify-center"
          animate={{
            scale: isTriggered ? [1, 1.22, 1, 1.15, 1] : [1, 1.08, 1]
          }}
          transition={{ duration: isTriggered ? 0.8 : 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-rose-500">
            <path 
              d="M19 14C20.49 12.54 22 10.79 22 8.5C22 5.42 19.58 3 16.5 3C14.74 3 13.14 3.81 12 5.09C10.86 3.81 9.26 3 7.5 3C4.42 3 2 5.42 2 8.5C2 10.79 3.51 12.54 5 14L12 21L19 14Z" 
              fill="currentColor" 
              fillOpacity="0.85" 
              stroke="#E11D48" 
              strokeWidth="1.8" 
              strokeLinejoin="round" 
            />
          </svg>
        </motion.div>
      </div>
    );
  }

  /* ==========================================================================
     9. AI BRAIN & NEURAL SPARK (ORBITING INTELLIGENCE ELECTRONS)
     ========================================================================== */
  if (name === 'ai_brain') {
    const s = size || 26;
    return (
      <div 
        className={`inline-flex items-center justify-center select-none ${className}`} 
        style={{ width: s, height: s }}
        onMouseEnter={() => setInternalHover(true)}
        onMouseLeave={() => setInternalHover(false)}
      >
        <div className="w-full h-full relative flex items-center justify-center">
          {/* Rotating Elliptical Orbital Ring */}
          <motion.div 
            className="absolute inset-0 rounded-full border border-sky-400/40 border-dashed"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
          {/* Pulsing Core Spark */}
          <motion.div
            animate={{
              scale: isTriggered ? [1, 1.35, 1] : [1, 1.1, 1],
              rotate: isTriggered ? [0, 45, 0] : 0
            }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5 text-sky-500" />
          </motion.div>
        </div>
      </div>
    );
  }

  /* ==========================================================================
     10. CADRE IDENTITY BADGE (OFFICIAL CREDENTIAL CARD & HOLOGRAPHIC SHEEN)
     ========================================================================== */
  if (name === 'user_badge') {
    const s = size || 22;
    return (
      <div 
        className={`inline-flex items-center justify-center select-none ${className}`} 
        style={{ width: s, height: s }}
        onMouseEnter={() => setInternalHover(true)}
        onMouseLeave={() => setInternalHover(false)}
      >
        <motion.div
          className="w-full h-full flex items-center justify-center"
          animate={{ scale: isTriggered ? [1, 1.18, 1.05] : 1 }}
          transition={{ duration: 0.3 }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-current">
            <rect x="4" y="3" width="16" height="18" rx="2.5" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="9" r="3.2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M7 17C7 14.8 9.2 13.5 12 13.5C14.8 13.5 17 14.8 17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            {/* Lanyard Top Notch */}
            <line x1="10" y1="3" x2="14" y2="3" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      </div>
    );
  }

  /* ==========================================================================
     11. SUCCESS CHECKMARK (ELASTIC DRAW & CONCENTRIC RIPPLE)
     ========================================================================== */
  if (name === 'success') {
    const s = size || 24;
    return (
      <div className={`inline-flex items-center justify-center ${className}`} style={{ width: s, height: s }}>
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <motion.circle 
            cx="12" 
            cy="12" 
            r="10" 
            fill="#10B981" 
            fillOpacity="0.22" 
            stroke="#10B981" 
            strokeWidth="2"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.path 
            d="M7.5 12.5L10.5 15.5L16.5 9.5" 
            stroke="#10B981" 
            strokeWidth="2.4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </svg>
      </div>
    );
  }

  /* ==========================================================================
     12. WARNING ALERT (SONAR PULSE & EMPHASIZED EXCLAMATION)
     ========================================================================== */
  if (name === 'warning') {
    const s = size || 20;
    return (
      <motion.div
        className={`inline-flex items-center justify-center ${className}`}
        style={{ width: s, height: s }}
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, -6, 6, 0]
        }}
        transition={{ duration: 0.6 }}
      >
        <AlertTriangle className="w-full h-full text-amber-500" />
      </motion.div>
    );
  }

  return <LogIn className={className} style={{ width: size || 20, height: size || 20 }} />;
};
