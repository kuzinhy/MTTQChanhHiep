import { NotificationService } from './notificationService';
import { StaffUser } from '../types';

export interface OtpSession {
  id: string;
  email: string;
  recipientName: string;
  otpCode: string;
  createdAt: number;
  expiresAt: number;
  resendAvailableAt: number;
  attempts: number;
  maxAttempts: number;
  userData: Partial<StaffUser>;
  verified: boolean;
}

const STORAGE_PREFIX = 'mttq_otp_session_';
const DEFAULT_TTL_MS = 180 * 1000; // 3 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const MAX_ATTEMPTS = 5;

export class EmailVerificationService {
  /**
   * Generates a cryptographically strong 6-digit numeric OTP
   */
  public static generateOtp(): string {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const code = (array[0] % 900000 + 100000).toString();
    return code;
  }

  /**
   * Starts a new verification session:
   * 1. Creates session record
   * 2. Sends official email via NotificationService
   * 3. Broadcasts in-app event for immediate testability (Sandbox / Demo)
   */
  public static async startVerification(
    email: string,
    recipientName: string,
    userData: Partial<StaffUser>
  ): Promise<{ session: OtpSession; otpCode: string; emailSent: boolean }> {
    const normalizedEmail = email.trim().toLowerCase();
    const otpCode = this.generateOtp();
    const now = Date.now();

    const session: OtpSession = {
      id: `otp_sess_${now}_${Math.random().toString(36).substring(2, 7)}`,
      email: normalizedEmail,
      recipientName: recipientName.trim(),
      otpCode,
      createdAt: now,
      expiresAt: now + DEFAULT_TTL_MS,
      resendAvailableAt: now + RESEND_COOLDOWN_MS,
      attempts: 0,
      maxAttempts: MAX_ATTEMPTS,
      userData,
      verified: false
    };

    // Save session in sessionStorage
    try {
      sessionStorage.setItem(`${STORAGE_PREFIX}${normalizedEmail}`, JSON.stringify(session));
    } catch (e) {
      console.warn('[EmailVerification] SessionStorage save failed:', e);
    }

    // Send real email in background
    let emailSent = false;
    try {
      emailSent = await NotificationService.sendRegistrationOtp(
        normalizedEmail,
        recipientName,
        otpCode,
        Math.round(DEFAULT_TTL_MS / 60000)
      );
    } catch (err) {
      console.warn('[EmailVerification] Email sending error, using sandbox fallback:', err);
    }

    // Broadcast in-app event for testing & sandbox preview
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('mttq_otp_dispatched', {
          detail: {
            email: normalizedEmail,
            recipientName,
            otpCode,
            expiresAt: session.expiresAt
          }
        })
      );
    }

    return { session, otpCode, emailSent };
  }

  /**
   * Gets current active session for an email
   */
  public static getSession(email: string): OtpSession | null {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${normalizedEmail}`);
      if (!raw) return null;
      return JSON.parse(raw) as OtpSession;
    } catch {
      return null;
    }
  }

  /**
   * Verifies an entered OTP code
   */
  public static verifyCode(
    email: string,
    enteredCode: string
  ): {
    success: boolean;
    error?: string;
    remainingAttempts?: number;
    userData?: Partial<StaffUser>;
  } {
    const normalizedEmail = email.trim().toLowerCase();
    const session = this.getSession(normalizedEmail);

    if (!session) {
      return {
        success: false,
        error: 'Phiên xác thực không tồn tại hoặc đã bị làm mới. Vui lòng nhấn gửi lại mã.'
      };
    }

    if (session.verified) {
      return {
        success: true,
        userData: session.userData
      };
    }

    const now = Date.now();
    if (now > session.expiresAt) {
      return {
        success: false,
        error: 'Mã xác thực đã hết hạn (quá 3 phút). Vui lòng nhấn gửi lại mã mới.'
      };
    }

    if (session.attempts >= session.maxAttempts) {
      return {
        success: false,
        error: 'Bạn đã nhập sai quá số lần quy định (5/5 lần). Vui lòng gửi lại mã mới.'
      };
    }

    const cleanInput = enteredCode.trim().replace(/\s+/g, '');
    if (cleanInput === session.otpCode) {
      // Verified successfully!
      session.verified = true;
      try {
        sessionStorage.setItem(`${STORAGE_PREFIX}${normalizedEmail}`, JSON.stringify(session));
      } catch {}

      return {
        success: true,
        userData: session.userData
      };
    } else {
      // Wrong code
      session.attempts += 1;
      try {
        sessionStorage.setItem(`${STORAGE_PREFIX}${normalizedEmail}`, JSON.stringify(session));
      } catch {}

      const remaining = session.maxAttempts - session.attempts;
      return {
        success: false,
        error: `Mã xác thực không đúng. Bạn còn ${remaining} lần thử!`,
        remainingAttempts: remaining
      };
    }
  }

  /**
   * Resends a fresh OTP code with cooldown check
   */
  public static async resendCode(
    email: string
  ): Promise<{
    success: boolean;
    error?: string;
    waitSeconds?: number;
    newOtp?: string;
  }> {
    const normalizedEmail = email.trim().toLowerCase();
    const currentSession = this.getSession(normalizedEmail);

    if (!currentSession) {
      return {
        success: false,
        error: 'Không tìm thấy thông tin đăng ký. Vui lòng quay lại điền thông tin.'
      };
    }

    const now = Date.now();
    if (now < currentSession.resendAvailableAt) {
      const waitSeconds = Math.ceil((currentSession.resendAvailableAt - now) / 1000);
      return {
        success: false,
        error: `Vui lòng đợi ${waitSeconds} giây trước khi yêu cầu gửi lại mã mới.`,
        waitSeconds
      };
    }

    const newOtp = this.generateOtp();
    currentSession.otpCode = newOtp;
    currentSession.createdAt = now;
    currentSession.expiresAt = now + DEFAULT_TTL_MS;
    currentSession.resendAvailableAt = now + RESEND_COOLDOWN_MS;
    currentSession.attempts = 0;
    currentSession.verified = false;

    try {
      sessionStorage.setItem(`${STORAGE_PREFIX}${normalizedEmail}`, JSON.stringify(currentSession));
    } catch {}

    // Send email
    try {
      await NotificationService.sendRegistrationOtp(
        normalizedEmail,
        currentSession.recipientName,
        newOtp,
        Math.round(DEFAULT_TTL_MS / 60000)
      );
    } catch (e) {
      console.warn('[EmailVerification] Resend email warning:', e);
    }

    // Broadcast event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('mttq_otp_dispatched', {
          detail: {
            email: normalizedEmail,
            recipientName: currentSession.recipientName,
            otpCode: newOtp,
            expiresAt: currentSession.expiresAt
          }
        })
      );
    }

    return {
      success: true,
      newOtp
    };
  }

  /**
   * Cleans up session once complete
   */
  public static clearSession(email: string): void {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      sessionStorage.removeItem(`${STORAGE_PREFIX}${normalizedEmail}`);
    } catch {}
  }
}
