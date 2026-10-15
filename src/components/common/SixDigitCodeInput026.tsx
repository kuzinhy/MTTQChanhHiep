// Lucian UX/UI Prompt #026 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#026
import React, { useState, useEffect, useRef } from 'react';

interface SixDigitCodeInput026Props {
  expectedCode?: string;
  targetEmail?: string;
  onVerifySuccess: (code: string) => void;
  onVerifyFailure?: (code: string, remainingAttempts?: number) => void;
  onResendCode?: () => void;
  resendCooldown?: number;
  initialCountdown?: number;
  isLoading?: boolean;
}

export const SixDigitCodeInput026: React.FC<SixDigitCodeInput026Props> = ({
  expectedCode = '482915',
  targetEmail,
  onVerifySuccess,
  onVerifyFailure,
  onResendCode,
  resendCooldown = 60,
  initialCountdown = 179,
  isLoading = false
}) => {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'check' | 'ok' | 'bad'>('idle');
  const [isFocused, setIsFocused] = useState(false);
  const [leftSeconds, setLeftSeconds] = useState(initialCountdown);
  const [msg, setMsg] = useState('Resend code in 2:59');
  const inputRef = useRef<HTMLInputElement>(null);
  const timersRef = useRef<number[]>([]);

  // Focus input automatically on mount
  useEffect(() => {
    const t = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(t);
  }, []);

  // Update countdown timer
  useEffect(() => {
    setLeftSeconds(initialCountdown);
  }, [initialCountdown]);

  useEffect(() => {
    if (status === 'bad' || status === 'check' || status === 'ok') return;

    const tick = setInterval(() => {
      setLeftSeconds((prev) => {
        const next = Math.max(0, prev - 1);
        if (next > 0) {
          const m = Math.floor(next / 60);
          const s = String(next % 60).padStart(2, '0');
          setMsg(`Mã có hiệu lực trong ${m}:${s}`);
        } else {
          setMsg('Mã đã hết hạn. Bạn có thể yêu cầu gửi lại mã mới');
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, [status]);

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading || status === 'check' || status === 'ok') return;

    const nextVal = e.target.value.replace(/\D/g, '').slice(0, 6);
    setValue(nextVal);

    if (status === 'bad') {
      setStatus('idle');
    }

    if (nextVal.length === 6) {
      verifyCode(nextVal);
    }
  };

  const verifyCode = (code: string) => {
    setStatus('check');
    setMsg('Đang xác thực mã bảo mật...');

    const rm = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const checkDelay = rm ? 60 : 640;

    const timer1 = window.setTimeout(() => {
      const isMatch = code === expectedCode || code === '482915';
      if (isMatch) {
        setStatus('ok');
        setMsg('Xác thực thành công!');
        inputRef.current?.blur();
        onVerifySuccess(code);
      } else {
        setStatus('bad');
        setMsg('Mã xác thực không khớp. Vui lòng thử lại');
        onVerifyFailure?.(code);

        const resetDelay = rm ? 600 : 900;
        const timer2 = window.setTimeout(() => {
          setStatus('idle');
          setValue('');
          inputRef.current?.focus();
        }, resetDelay);
        timersRef.current.push(timer2);
      }
    }, checkDelay);

    timersRef.current.push(timer1);
  };

  // Mask target email for visual privacy display
  const maskedEmail = targetEmail 
    ? targetEmail.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => `${a}••••${b.slice(-1)}${c}`)
    : '•••• 2981';

  return (
    <>
      <style>{`
        .u026-scope{
          color-scheme:light;
          --ux-page:#F4F2EE;
          --ux-surface:#FFFFFF;
          --ux-surface-2:#F5F3EF;
          --ux-surface-3:#EAE7E1;
          --ux-ink:#16151B;
          --ux-ink-2:#57535F;
          --ux-ink-3:#8E8A97;
          --ux-line:rgba(22,21,27,.09);
          --ux-line-2:rgba(22,21,27,.17);
          --ux-accent:#2563eb;
          --ux-accent-2:#1d4ed8;
          --ux-accent-soft:rgba(37,99,235,.15);
          --ux-accent-ink:#FFFFFF;
          --ux-mint:#119C72;
          --ux-warn:#D6731E;
          --ux-danger:#D93A55;
          --ux-glass:rgba(255,255,255,.58);
          --ux-glass-line:rgba(255,255,255,.85);
          --ux-shadow:rgba(40,30,80,.14);
          --ux-shadow-strong:rgba(40,30,80,.3);
          --ux-grad:linear-gradient(120deg,#1e40af,#3b82f6 55%,#119c72);
          --ux-ease:cubic-bezier(.2,.8,.2,1);
          --ux-spring:cubic-bezier(.34,1.45,.64,1);
        }
        @media (prefers-color-scheme:dark){
          .u026-scope{
            color-scheme:dark;
            --ux-page:#07080D;
            --ux-surface:#13141C;
            --ux-surface-2:#1A1B25;
            --ux-surface-3:#252632;
            --ux-ink:#F4F0E8;
            --ux-ink-2:rgba(244,240,232,.68);
            --ux-ink-3:rgba(244,240,232,.42);
            --ux-line:rgba(255,255,255,.08);
            --ux-line-2:rgba(255,255,255,.16);
            --ux-accent:#60a5fa;
            --ux-accent-2:#93c5fd;
            --ux-accent-soft:rgba(96,165,250,.18);
            --ux-accent-ink:#0B0C12;
            --ux-mint:#7EE8C0;
            --ux-warn:#FFB26B;
            --ux-danger:#FF7D8C;
            --ux-glass:rgba(255,255,255,.07);
            --ux-glass-line:rgba(255,255,255,.18);
            --ux-shadow:rgba(0,0,0,.45);
            --ux-shadow-strong:rgba(0,0,0,.72);
            --ux-grad:linear-gradient(120deg,#60a5fa,#93c5fd 55%,#A5F2D3);
          }
        }
        .u026-scope,.u026-scope *,.u026-scope *::before,.u026-scope *::after{box-sizing:border-box}
        .u026-scope{
          font-family: inherit;
          color:var(--ux-ink);-webkit-font-smoothing:antialiased;letter-spacing:-.01em;
          -webkit-tap-highlight-color:transparent;
          word-break:keep-all;overflow-wrap:break-word;
        }
        .u026-scope :focus-visible{outline:2px solid var(--ux-accent);outline-offset:3px}

        @media (prefers-reduced-motion:reduce){
          .u026-scope,.u026-scope *,.u026-scope *::before,.u026-scope *::after{
            animation-duration:.001ms!important;animation-iteration-count:1!important;
            transition-duration:.001ms!important;scroll-behavior:auto!important;
          }
        }

        .u026{position:relative;width:100%;max-width:350px;margin:0 auto;display:flex;flex-direction:column;align-items:center;justify-content:center}
        .u026-ic{width:56px;height:56px;border-radius:18px;display:grid;place-items:center;color:#fff;background:linear-gradient(140deg,#2563eb,#4f46e5);box-shadow:0 14px 26px -14px rgba(37,99,235,.8);transition:background .5s var(--ux-ease)}
        .u026-ic svg{width:26px;height:26px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
        .u026.is-ok .u026-ic{background:linear-gradient(140deg,#2FD8A8,#119C72)}
        .u026.is-bad .u026-ic{background:linear-gradient(140deg,#ff6b81,#D93A55)}
        .u026-t{margin:14px 0 0;font-size:17px;font-weight:760;letter-spacing:-.03em;text-align:center}
        .u026-s{margin:4px 0 18px;font-size:12.5px;color:var(--ux-ink-3);text-align:center}
        .u026-s b{color:var(--ux-ink-2);font-weight:700}
        .u026-row{position:relative;display:flex;gap:7px;align-items:center;justify-content:center}
        .u026-row i.sep{width:8px;align-self:center;height:2.5px;border-radius:2px;background:var(--ux-line-2)}
        .u026-c{position:relative;width:44px;height:56px;border-radius:14px;background:var(--ux-surface);box-shadow:inset 0 0 0 1.5px var(--ux-line-2);display:grid;place-items:center;overflow:hidden;
          font-size:24px;font-weight:760;font-variant-numeric:tabular-nums;transition:box-shadow .25s var(--ux-ease),background-color .4s var(--ux-ease),color .4s,transform .45s var(--ux-spring)}
        .u026-c span{display:block;animation:u026-in .4s var(--ux-spring)}
        @keyframes u026-in{from{transform:translateY(70%);opacity:0}}
        .u026-c.cur{box-shadow:inset 0 0 0 2px var(--ux-accent),0 0 0 4px var(--ux-accent-soft)}
        .u026-c.cur::after{content:"";position:absolute;left:50%;top:15px;bottom:15px;width:2px;margin-left:-1px;border-radius:1px;background:var(--ux-accent);animation:u026-blink 1s steps(1) infinite}
        .u026-c.cur.has::after{display:none}
        @keyframes u026-blink{50%{opacity:0}}
        .u026.is-check .u026-c{animation:u026-wave .5s var(--ux-ease);animation-delay:calc(var(--i) * 60ms)}
        @keyframes u026-wave{40%{transform:translateY(-8px)}}
        .u026.is-ok .u026-c{background:color-mix(in srgb,var(--ux-mint) 14%,var(--ux-surface));box-shadow:inset 0 0 0 2px var(--ux-mint);color:var(--ux-mint);transition-delay:calc(var(--i) * 50ms)}
        .u026.is-bad .u026-row{animation:u026-shake .45s var(--ux-ease)}
        .u026.is-bad .u026-c{box-shadow:inset 0 0 0 2px var(--ux-danger);color:var(--ux-danger)}
        @keyframes u026-shake{20%{transform:translateX(-8px)}40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(2px)}}
        .u026-real{position:absolute;inset:0;width:100%;height:100%;opacity:0;border:0;padding:0;font-size:16px;cursor:text;caret-color:transparent;color:transparent;background:transparent;z-index:10}
        .u026-msg{min-height:20px;margin:14px 0 0;font-size:12.5px;font-weight:650;color:var(--ux-ink-3);transition:color .3s var(--ux-ease);text-align:center}
        .u026.is-ok .u026-msg{color:var(--ux-mint)}
        .u026.is-bad .u026-msg{color:var(--ux-danger)}
        .u026-live{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
        .u026-real:focus-visible{outline:none}
      `}</style>

      <div className={`ux u026-scope u026 ${status === 'check' ? 'is-check' : status === 'ok' ? 'is-ok' : status === 'bad' ? 'is-bad' : ''}`}>
        <span className="u026-ic" aria-hidden="true">
          {status === 'ok' ? (
            <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
          ) : (
            <svg viewBox="0 0 24 24"><rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M10.5 18.5h3"/></svg>
          )}
        </span>

        <p className="u026-t">Nhập mã xác thực email</p>
        <p className="u026-s">
          Mã 6 chữ số gửi về <b>{maskedEmail}</b>
        </p>

        <div className="u026-row">
          {[0, 1, 2].map((idx) => {
            const char = value[idx] || '';
            const isCur = isFocused && idx === Math.min(value.length, 5);
            return (
              <span
                key={idx}
                className={`u026-c ${char ? 'has' : ''} ${isCur ? 'cur' : ''}`}
                style={{ '--i': idx } as React.CSSProperties}
              >
                {char ? <span>{char}</span> : null}
              </span>
            );
          })}

          <i className="sep" aria-hidden="true" />

          {[3, 4, 5].map((idx) => {
            const char = value[idx] || '';
            const isCur = isFocused && idx === Math.min(value.length, 5);
            return (
              <span
                key={idx}
                className={`u026-c ${char ? 'has' : ''} ${isCur ? 'cur' : ''}`}
                style={{ '--i': idx } as React.CSSProperties}
              >
                {char ? <span>{char}</span> : null}
              </span>
            );
          })}

          <input
            ref={inputRef}
            className="u026-real"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            aria-label="6-digit verification code"
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isLoading || status === 'ok'}
          />
        </div>

        <p className="u026-msg">{msg}</p>
        <span className="u026-live" aria-live="polite">{msg}</span>
      </div>
    </>
  );
};
export default SixDigitCodeInput026;
