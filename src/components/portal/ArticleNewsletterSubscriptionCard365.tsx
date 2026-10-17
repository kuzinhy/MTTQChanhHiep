// Lucian UX/UI Prompt #365 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#365
import React, { useState, useEffect, useRef } from 'react';
import { Mail, Sparkles, Share2, Copy, Check, Bell, Award, Users } from 'lucide-react';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface ArticleNewsletterSubscriptionCard365Props {
  onShowToast?: (title: string, message: string) => void;
  className?: string;
  isCompact?: boolean;
}

export const ArticleNewsletterSubscriptionCard365: React.FC<ArticleNewsletterSubscriptionCard365Props> = ({
  onShowToast,
  className = '',
  isCompact = false
}) => {
  const [email, setEmail] = useState<string>('');
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(1284);
  const [displayPos, setDisplayPos] = useState<number>(0);
  const [invitesCount, setInvitesCount] = useState<number>(0);
  const [floatNotice, setFloatNotice] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const startPosition = 1284;
  const isReducedMotion = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      isReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }, []);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  // Save subscription record to Firestore safely
  const saveSubscription = async (subEmail: string, initialPos: number) => {
    try {
      const cleanEmail = subEmail.trim().toLowerCase();
      const subId = 'sub-' + Date.now();
      await setDoc(doc(db, 'article_subscriptions', subId), {
        id: subId,
        email: cleanEmail,
        position: initialPos,
        subscribedAt: new Date().toISOString(),
        status: 'ACTIVE',
        source: 'PORTAL_NEWSLETTER_WIDGET_365'
      });
    } catch (e) {
      console.warn('[Subscription365] Firestore save fallback:', e);
    }
  };

  const handleJoin = () => {
    if (!isValidEmail || isBusy) return;
    setIsBusy(true);

    saveSubscription(email, position);

    const delay = isReducedMotion.current ? 0 : 650;
    setTimeout(() => {
      setIsBusy(false);
      setIsJoined(true);

      if (isReducedMotion.current) {
        setDisplayPos(position);
        return;
      }

      // Smooth count up animation from 0 to position
      const t0 = performance.now();
      const duration = 900;

      const animateNumber = (now: number) => {
        const k = Math.min(1, (now - t0) / duration);
        const easeOut = 1 - Math.pow(1 - k, 3);
        const currentVal = Math.round(position * easeOut);
        setDisplayPos(currentVal);

        if (k < 1) {
          requestAnimationFrame(animateNumber);
        }
      };

      requestAnimationFrame(animateNumber);

      if (onShowToast) {
        onShowToast(
          'Đăng ký nhận tin thành công',
          `Email "${email}" đã được đăng ký vào danh sách nhận thông báo bài viết mới nhất với Mã ưu tiên #${position.toLocaleString('vi-VN')}.`
        );
      }
    }, delay);
  };

  const handleInviteFriend = () => {
    if (position <= 100) {
      if (onShowToast) {
        onShowToast('Vị trí tối đa', 'Bạn đã đạt mã số ưu tiên nhận tin cao nhất hệ thống!');
      }
      return;
    }

    const nextPos = position - 100;
    setPosition(nextPos);
    setDisplayPos(nextPos);
    setInvitesCount((prev) => prev + 1);

    if (!isReducedMotion.current) {
      setFloatNotice(true);
      setTimeout(() => setFloatNotice(false), 1000);
    }

    if (onShowToast) {
      onShowToast(
        'Tăng thứ tự ưu tiên!',
        'Đã cộng thêm 100 lượt ưu tiên gửi tin tự động cho email của bạn.'
      );
    }
  };

  const handleCopyLink = () => {
    const inviteUrl = `https://chanhhiep.binhduong.gov.vn/tin-tuc?ref=${encodeURIComponent(email || 'mttq')}`;
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(inviteUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        if (onShowToast) {
          onShowToast('Đã sao chép liên kết', 'Đã sao chép đường dẫn mời người dân tham gia nhận tin tự động.');
        }
      }
    } catch {}
  };

  // Calculate dot percentage indicator
  const dotProgressPct = Math.max(4, Math.min(100, (position / startPosition) * 82 + 12));

  return (
    <div
      className={`ux u365 ${isJoined ? 'is-in' : ''} ${className}`}
      style={{
        ['--ux-surface' as any]: '#ffffff',
        ['--ux-surface-2' as any]: '#f8fafc',
        ['--ux-surface-3' as any]: '#e2e8f0',
        ['--ux-ink' as any]: '#0f172a',
        ['--ux-ink-2' as any]: '#334155',
        ['--ux-ink-3' as any]: '#64748b',
        ['--ux-line' as any]: 'rgba(226, 232, 240, 0.9)',
        ['--ux-line-2' as any]: 'rgba(203, 213, 225, 0.8)',
        ['--ux-accent' as any]: '#f59e0b',
        ['--ux-mint' as any]: '#059669',
        ['--ux-shadow-strong' as any]: 'rgba(0, 40, 120, 0.16)'
      }}
    >
      <style>{`
        .u365 {
          position: relative;
          width: 100%;
          max-width: ${isCompact ? '320px' : '360px'};
          height: ${isCompact ? 'auto' : '350px'};
          border-radius: ${isCompact ? '16px' : '28px'};
          overflow: hidden;
          background: ${isCompact ? '#ffffff' : 'radial-gradient(85% 65% at 50% 0%, rgba(245, 158, 11, 0.16), transparent 75%), #ffffff'};
          box-shadow: ${isCompact ? 'inset 0 0 0 1px rgba(226, 232, 240, 0.9)' : '0 0 0 1px rgba(226, 232, 240, 0.9), 0 24px 48px -18px rgba(0, 40, 120, 0.18)'};
          color: #0f172a;
          font-family: inherit;
        }
        .u365-v {
          position: ${isCompact ? 'relative' : 'absolute'};
          inset: 0;
          padding: ${isCompact ? '12px' : '26px 22px'};
          display: flex;
          flex-direction: column;
          transition: opacity 0.35s, transform 0.5s cubic-bezier(.3, 1.2, .5, 1);
        }
        .u365-v1 {
          text-align: ${isCompact ? 'left' : 'center'};
          justify-content: center;
          padding-bottom: ${isCompact ? '0' : '28px'};
        }
        .u365.is-in .u365-v1 {
          opacity: 0;
          ${isCompact ? 'display: none;' : 'transform: translateY(-14px) scale(0.97); pointer-events: none;'}
        }
        .u365-v2 {
          opacity: 0;
          transform: translateY(16px);
          pointer-events: none;
          text-align: center;
          ${isCompact ? 'padding: 12px;' : ''}
        }
        .u365.is-in .u365-v2 {
          opacity: 1;
          transform: none;
          pointer-events: auto;
          transition-delay: 0.15s;
          ${isCompact ? 'position: relative;' : ''}
        }
        .u365-ic {
          width: ${isCompact ? '32px' : '50px'};
          height: ${isCompact ? '32px' : '50px'};
          margin: ${isCompact ? '0' : '0 auto'};
          border-radius: ${isCompact ? '8px' : '16px'};
          background: linear-gradient(135deg, #fbbf24, #f97316);
          display: ${isCompact ? 'none' : 'grid'};
          place-items: center;
          box-shadow: 0 12px 24px -8px #f97316;
          color: #ffffff;
        }
        .u365 h3 {
          margin: ${isCompact ? '0' : '12px 0 0'};
          font-size: ${isCompact ? '13px' : '17px'};
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #0f172a;
          line-height: 1.25;
        }
        .u365-v1 > p {
          margin: ${isCompact ? '2px 0 0' : '6px 0 0'};
          font-size: ${isCompact ? '10px' : '11px'};
          font-weight: 600;
          color: #64748b;
          line-height: 1.4;
          display: ${isCompact ? 'none' : 'block'};
        }
        .u365-fm {
          display: flex;
          gap: 6px;
          margin-top: ${isCompact ? '8px' : '18px'};
          padding: ${isCompact ? '2px' : '5px'};
          border-radius: ${isCompact ? '10px' : '16px'};
          background: #f8fafc;
          box-shadow: inset 0 0 0 1px #e2e8f0;
          transition: box-shadow 0.2s;
        }
        .u365-fm:focus-within {
          box-shadow: inset 0 0 0 2px #f59e0b;
        }
        .u365-in {
          flex: 1;
          min-width: 0;
          height: ${isCompact ? '32px' : '38px'};
          padding: 0 10px;
          border: 0;
          background: none;
          color: #0f172a;
          font: inherit;
          font-size: ${isCompact ? '11px' : '12px'};
          font-weight: 700;
          outline: none;
        }
        .u365-in::placeholder {
          color: #94a3b8;
          font-weight: 500;
        }
        .u365-go {
          position: relative;
          flex: none;
          min-width: ${isCompact ? '76px' : '88px'};
          height: ${isCompact ? '32px' : '38px'};
          border: 0;
          border-radius: ${isCompact ? '10px' : '12px'};
          background: #0f172a;
          color: #ffffff;
          font: inherit;
          font-size: ${isCompact ? '11px' : '12px'};
          font-weight: 800;
          cursor: pointer;
          transition: opacity 0.2s, background-color 0.2s;
        }
        .u365-go:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .u365-go i {
          display: none;
          width: 15px;
          height: 15px;
          margin: 0 auto;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: #ffffff;
          animation: u365-sp 0.7s linear infinite;
        }
        .u365-go.is-busy i {
          display: block;
        }
        .u365-go.is-busy span {
          display: none;
        }
        @keyframes u365-sp {
          to { transform: rotate(360deg); }
        }

        .u365-v2 small {
          margin-top: 2px;
          font-size: 10px;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
        }
        .u365-nm {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: baseline;
          margin-top: 2px;
          font-size: ${isCompact ? '28px' : '42px'};
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #0f172a;
          font-variant-numeric: tabular-nums;
        }
        .u365-nm em {
          font-style: normal;
          font-size: ${isCompact ? '16px' : '22px'};
          color: #f59e0b;
          margin-right: 3px;
        }
        .u365-fl {
          position: absolute;
          right: 20px;
          top: 4px;
          font-size: 14px;
          font-weight: 900;
          color: #059669;
          letter-spacing: 0;
          animation: u365-fl 1s ease-out forwards;
        }
        @keyframes u365-fl {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-24px); }
        }
        .u365-q {
          position: relative;
          height: ${isCompact ? '12px' : '16px'};
          margin: ${isCompact ? '8px 6px 0' : '14px 6px 0'};
        }
        .u365-q i {
          position: absolute;
          top: 5px;
          width: 6px;
          height: 6px;
          margin-left: -3px;
          border-radius: 50%;
          background: #e2e8f0;
        }
        .u365-me {
          position: absolute;
          top: 0;
          width: ${isCompact ? '12px' : '16px'};
          height: ${isCompact ? '12px' : '16px'};
          margin-left: -8px;
          border-radius: 50%;
          background: #f59e0b;
          box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.25);
          transition: left 0.6s cubic-bezier(.3, 1.3, .5, 1);
        }
        .u365-v2 > p {
          margin: 10px 0 0;
          font-size: 10px;
          font-weight: 650;
          color: #475569;
          line-height: 1.35;
        }
        .u365-bs {
          display: flex;
          gap: 6px;
          margin-top: ${isCompact ? '12px' : 'auto'};
        }
        .u365-bs button {
          flex: 1;
          height: ${isCompact ? '34px' : '40px'};
          border: 0;
          border-radius: ${isCompact ? '10px' : '12px'};
          font: inherit;
          font-size: ${isCompact ? '10.5px' : '11.5px'};
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: transform 0.15s, background-color 0.15s;
        }
        .u365-bs button:active {
          transform: scale(0.97);
        }
        .u365-iv {
          background: #0f172a;
          color: #ffffff;
        }
        .u365-lk {
          background: #f1f5f9;
          color: #0f172a;
          box-shadow: inset 0 0 0 1px #cbd5e1;
        }
        .u365 button:focus-visible {
          outline: 2px solid #f59e0b;
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .u365-v, .u365-me { transition: none; }
          .u365-fl { display: none; }
          .u365-go i { animation: none; }
        }
      `}</style>

      {/* View 1: Email Form State */}
      <div className="u365-v u365-v1" aria-hidden={isJoined}>
        <div className="u365-ic" aria-hidden="true">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <h3>Nhận Bài Viết &amp; Thông Báo Mới</h3>
        <p>Gửi thông báo qua Email tự động ngay khi Ủy ban MTTQ công bố bài viết hoặc văn bản chỉ đạo mới</p>

        <div className="u365-fm">
          <input
            className="u365-in"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isValidEmail) handleJoin();
            }}
            placeholder="Điền địa chỉ email của bạn..."
            aria-label="Địa chỉ email nhận tin"
            autoComplete="email"
          />
          <button
            type="button"
            className={`u365-go ${isBusy ? 'is-busy' : ''}`}
            disabled={!isValidEmail || isBusy}
            onClick={handleJoin}
          >
            <i aria-hidden="true" />
            <span>Đăng ký</span>
          </button>
        </div>
      </div>

      {/* View 2: Subscribed Status & Referral Waitlist Position Card */}
      <div className="u365-v u365-v2" aria-hidden={!isJoined}>
        <small>Mã số ưu tiên nhận tin</small>
        
        <div className="u365-nm" aria-live="polite">
          <em>#</em>
          <span>{(displayPos || position).toLocaleString('vi-VN')}</span>
          {floatNotice && <span className="u365-fl">−100</span>}
        </div>

        {/* Meter queue line dots */}
        <div className="u365-q" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, i) => (
            <i key={i} style={{ left: `${(i / 17) * 100}%` }} />
          ))}
          <span className="u365-me" style={{ left: `${dotProgressPct}%` }} />
        </div>

        <p>Tăng 100 lượt ưu tiên tự động cho mỗi người dân cùng đăng ký thông qua bạn</p>

        <div className="u365-bs">
          <button type="button" className="u365-lk" onClick={handleCopyLink}>
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Đã sao chép' : 'Sao chép link'}</span>
          </button>
          <button type="button" className="u365-iv" onClick={handleInviteFriend}>
            <Share2 className="w-3.5 h-3.5" />
            <span>Mời người dân</span>
          </button>
        </div>
      </div>
    </div>
  );
};
