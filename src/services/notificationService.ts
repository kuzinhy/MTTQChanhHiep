import { db } from '../lib/firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { 
  StaffUser, 
  ArticleSubmission, 
  FeedbackItem, 
  EmailNotification, 
  EmailLog, 
  EmailNotificationSettings 
} from '../types';
import { adminCollaborationService } from '../lib/adminCollaborationService';

export const DEFAULT_APPS_SCRIPT_WEBHOOK = 'https://script.google.com/macros/s/AKfycbw_1_GJsrYGqYmmZBBfIQyB1H7s3D6eI0IeC_s5JimpNAH7WkOHXcowiUAFiqlXUbE8iA/exec';

// Default system configurations for email routing and settings
const DEFAULT_SETTINGS: EmailNotificationSettings = {
  systemWideEnabled: true,
  newUserEnabled: true,
  articleSubmittedEnabled: true,
  articleApprovedEnabled: true,
  articleRejectedEnabled: true,
  feedbackSubmittedEnabled: true,
  feedbackStatusChangedEnabled: true,
  webhookUrl: DEFAULT_APPS_SCRIPT_WEBHOOK,
  adminEmails: ['mttqvietnamphuongchanhhiep@gmail.com', 'nguyenhuy.thudaumot@gmail.com', 'buivanhuy0705@gmail.com', 'admin.chanhhiep@binhduong.gov.vn'],
  editorEmails: ['mttqvietnamphuongchanhhiep@gmail.com', 'nguyenhuy.thudaumot@gmail.com', 'buivanhuy0705@gmail.com', 'editor.chanhhiep@binhduong.gov.vn'],
  feedbackEmails: ['mttqvietnamphuongchanhhiep@gmail.com', 'nguyenhuy.thudaumot@gmail.com', 'buivanhuy0705@gmail.com', 'tiepdan.chanhhiep@binhduong.gov.vn'],
  categoryRouting: {
    'Vấn đề dân sinh': 'mttqvietnamphuongchanhhiep@gmail.com',
    'An sinh xã hội': 'ansinh.chanhhiep@binhduong.gov.vn',
    'Môi trường & Đô thị': 'dothi.chanhhiep@binhduong.gov.vn',
    'Trật tự an toàn': 'congan.chanhhiep@binhduong.gov.vn',
    'Thủ tục hành chính': 'motcua.chanhhiep@binhduong.gov.vn',
    'Văn hóa - Xã hội': 'vanhoa.chanhhiep@binhduong.gov.vn',
    'Ý kiến đóng góp khác': 'mttqvietnamphuongchanhhiep@gmail.com'
  }
};

const SETTINGS_DOC_PATH = 'system_settings/email_notifications';

export class NotificationService {
  public static lastError: string = '';
  private static cachedSettings: EmailNotificationSettings | null = null;

  /**
   * Get email settings from Firestore, fallback to defaults
   */
  static async getSettings(): Promise<EmailNotificationSettings> {
    if (this.cachedSettings) return this.cachedSettings;
    try {
      const sRef = doc(db, 'system_settings', 'email_notifications');
      const snap = await getDoc(sRef);
      if (snap.exists()) {
        this.cachedSettings = { ...DEFAULT_SETTINGS, ...snap.data() };
      } else {
        // Automatically save defaults to Firestore for first-time setup
        await setDoc(sRef, DEFAULT_SETTINGS);
        this.cachedSettings = DEFAULT_SETTINGS;
      }
    } catch (err) {
      console.warn('[NotificationService] Failed to load settings, using defaults:', err);
      return DEFAULT_SETTINGS;
    }
    return this.cachedSettings;
  }

  /**
   * Save settings to Firestore
   */
  static async saveSettings(settings: Partial<EmailNotificationSettings>): Promise<boolean> {
    try {
      const sRef = doc(db, 'system_settings', 'email_notifications');
      const current = await this.getSettings();
      const updated = { ...current, ...settings };
      await setDoc(sRef, updated, { merge: true });
      this.cachedSettings = updated;
      return true;
    } catch (err) {
      console.error('[NotificationService] Failed to save settings:', err);
      return false;
    }
  }

  /**
   * Core method to send an email notification with deduplication & logging
   */
  private static async sendEmail(
    eventType: string,
    eventKey: string,
    relatedCollection: string,
    relatedId: string,
    recipientEmail: string,
    recipientName: string,
    subject: string,
    body: string,
    extraData: any = {}
  ): Promise<boolean> {
    const settings = await this.getSettings();
    if (!settings.systemWideEnabled) return false;

    const webhookUrl = (settings.webhookUrl && settings.webhookUrl.trim().length > 10)
      ? settings.webhookUrl.trim()
      : (import.meta.env.VITE_EMAIL_WEBHOOK_URL || DEFAULT_APPS_SCRIPT_WEBHOOK);

    // 1. Check for duplicates
    try {
      const q = query(collection(db, 'notifications'), where('eventKey', '==', eventKey));
      const snap = await getDocs(q);
      if (!snap.empty) return false;
    } catch (err) {
      console.warn('[NotificationService] Duplicate check skipped:', err);
    }

    const notiId = 'noti-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const createdAt = new Date().toISOString();

    const notiRecord: EmailNotification = {
      id: notiId,
      eventType,
      eventKey,
      relatedCollection,
      relatedId,
      recipientEmail,
      recipientName,
      subject,
      status: 'pending',
      createdAt,
      retryCount: 0
    };

    try {
      await setDoc(doc(db, 'notifications', notiId), notiRecord);
    } catch (err) {
      console.error('[NotificationService] Failed to save notification:', err);
    }

    // 2. Call Apps Script Webhook (Use server-side proxy first to bypass browser CORS completely)
    try {
      const payload = {
        eventType,
        recipientEmail,
        subject,
        htmlBody: body.trim().startsWith('<') ? body : body.replace(/\n/g, '<br/>'),
        timestamp: createdAt,
        ...extraData
      };

      let sentSuccessfully = false;
      let errorDetail = '';

      // Method 1: Backend proxy (bypasses browser CORS 100%)
      try {
        const proxyRes = await fetch('/api/notifications/webhook-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ webhookUrl, payload })
        });

        if (proxyRes.ok) {
          const resJson = await proxyRes.json();
          if (resJson.success && resJson.data?.success !== false) {
            sentSuccessfully = true;
          } else {
            errorDetail = resJson.data?.error || resJson.error || 'Lỗi từ Google Apps Script';
          }
        } else {
          try {
            const errJson = await proxyRes.json();
            errorDetail = errJson.error || `Lỗi từ dịch vụ proxy (${proxyRes.status})`;
          } catch {
            const errText = await proxyRes.text().catch(() => '');
            errorDetail = `Proxy server lỗi (${proxyRes.status}): ${errText}`;
          }
        }
      } catch (proxyErr: any) {
        console.warn('[NotificationService] Proxy không khả dụng, chuyển sang gửi trực tiếp text/plain:', proxyErr);
      }

      // Method 2: Fallback to direct fetch with text/plain (avoids CORS preflight OPTIONS in browser)
      if (!sentSuccessfully) {
        try {
          const directRes = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
          });
          if (directRes.ok) {
            sentSuccessfully = true;
          }
        } catch (directErr: any) {
          if (!errorDetail) {
            errorDetail = directErr?.message || 'Lỗi kết nối Webhook trực tiếp';
          }
        }
      }

      if (!sentSuccessfully) {
        throw new Error(errorDetail || 'Không nhận được phản hồi từ Webhook');
      }

      console.log(`[NotificationService] Request sent to GAS for ${eventKey}`);
      NotificationService.lastError = '';

      await setDoc(doc(db, 'notifications', notiId), { status: 'sent', sentAt: new Date().toISOString() }, { merge: true });

      await this.saveEmailLog({
        id: 'log-' + Date.now(),
        eventType,
        recipient: recipientEmail,
        subject,
        relatedId,
        status: 'sent',
        provider: 'google_apps_script',
        createdAt,
        sentAt: new Date().toISOString()
      });

      return true;
    } catch (err: any) {
      const errMsg = err?.message || 'Unknown network error';
      console.error(`[NotificationService] Webhook call failed:`, err);
      NotificationService.lastError = errMsg;

      await setDoc(doc(db, 'notifications', notiId), { status: 'failed', failedAt: new Date().toISOString(), errorMessage: errMsg }, { merge: true });

      await this.saveEmailLog({
        id: 'log-' + Date.now(),
        eventType,
        recipient: recipientEmail,
        subject,
        relatedId,
        status: 'failed',
        provider: 'google_apps_script',
        createdAt,
        errorMessage: errMsg
      });

      return false;
    }
  }

  private static async saveEmailLog(log: EmailLog) {
    try {
      await setDoc(doc(db, 'email_logs', log.id), log);
    } catch (err) {
      console.error('[NotificationService] Failed to save email log:', err);
    }
  }

  /**
   * Send a test email to verify configuration
   */
  static async sendTestEmail(recipientEmail: string, subject: string, htmlBody: string): Promise<boolean> {
    const eventKey = `TEST_EMAIL_${Date.now()}`;
    return this.sendEmail(
      'TEST_EMAIL',
      eventKey,
      'system_settings',
      'email_notifications',
      recipientEmail,
      'Người nhận thử nghiệm',
      subject,
      htmlBody
    );
  }

  /**
   * Event 1: USER_REGISTERED
   */
  static async notifyUserRegistered(user: StaffUser): Promise<void> {
    const settings = await this.getSettings();
    if (!settings.newUserEnabled) return;

    const eventKey = `USER_REGISTERED_${user.id}`;
    const subject = `[MTTQ CHÁNH HIỆP] Tài khoản cán bộ mới đăng ký chờ phê duyệt`;
    const body = `
      Kính gửi Ban Quản trị,
      
      Hệ thống ghi nhận có tài khoản cán bộ mới vừa đăng ký và đang chờ phê duyệt kích hoạt:
      
      - Họ và tên: ${user.fullname}
      - Email: ${user.email}
      - Số điện thoại: ${user.phone || 'Chưa cung cấp'}
      - Chức vụ: ${user.position}
      - Bộ phận: ${user.department}
      - Vai trò đề xuất: ${user.role}
      - Thời gian đăng ký: ${user.createdAt}
      - ID Cán bộ: ${user.id}
      
      Vui lòng truy cập trang Quản lý Cán bộ trong Hệ thống Điều hành Văn phòng số Phường Chánh Hiệp để kiểm tra và phê duyệt kích hoạt tài khoản này.
      
      Trân trọng,
      Cổng thông tin Điện tử MTTQ Phường Chánh Hiệp
    `;

    // Send to all administrators
    for (const adminEmail of settings.adminEmails) {
      await this.sendEmail(
        'USER_REGISTERED',
        `${eventKey}_TO_${adminEmail}`,
        'staffUsers',
        user.id,
        adminEmail,
        'Ban Quản trị',
        subject,
        body,
        { staffUser: user }
      );
    }

    // In-App Admin Notification & Audit Log
    try {
      adminCollaborationService.publishActivityEvent({
        actor: { id: user.id, name: user.fullname, avatar: user.avatar },
        action: 'REGISTER',
        entity: 'user',
        entityId: user.id,
        entityTitle: user.fullname,
        details: `Cán bộ ${user.fullname} (${user.role} - ${user.department || user.position}) vừa đăng ký tài khoản mới trên hệ thống.`,
        route: 'staff_users'
      });
    } catch (err) {
      console.warn('[NotificationEngine] In-app notification error for user registered:', err);
    }
  }

  /**
   * Event 2: ARTICLE_SUBMITTED
   */
  static async notifyArticleSubmitted(submission: ArticleSubmission): Promise<void> {
    const settings = await this.getSettings();
    if (!settings.articleSubmittedEnabled) return;

    const eventKey = `ARTICLE_SUBMITTED_${submission.id}`;
    const subject = `[MTTQ CHÁNH HIỆP] Có bài viết mới chờ duyệt: "${submission.title}"`;
    const body = `
      Kính gửi Ban Biên tập,
      
      Có bài viết cộng tác mới vừa được gửi lên hệ thống và đang chờ duyệt:
      
      - Tiêu đề: ${submission.title}
      - Người gửi: ${submission.authorName}
      - Đơn vị: ${submission.unit || 'Tự do'}
      - Email người gửi: ${submission.authorEmail}
      - Thời gian gửi: ${submission.createdAt}
      - ID Bài viết: ${submission.id}
      
      Tóm tắt:
      ${submission.summary || '(Không có tóm tắt)'}
      
      Vui lòng truy cập trang Quản lý Bài viết tác giả trong Văn phòng số để xem chi tiết, chỉnh sửa và phê duyệt bài viết này.
      
      Trân trọng,
      Ban Biên tập Cổng thông tin MTTQ Phường Chánh Hiệp
    `;

    // Send to all editors
    for (const editorEmail of settings.editorEmails) {
      await this.sendEmail(
        'ARTICLE_SUBMITTED',
        `${eventKey}_TO_${editorEmail}`,
        'article_submissions',
        submission.id,
        editorEmail,
        'Ban Biên tập',
        subject,
        body,
        { submission }
      );
    }

    // In-App Admin Notification & Audit Log
    try {
      adminCollaborationService.publishActivityEvent({
        actor: { id: submission.authorId || 'contributor', name: submission.authorName || 'Cộng tác viên' },
        action: 'SUBMIT',
        entity: 'article',
        entityId: submission.id,
        entityTitle: submission.title,
        details: `Có bài viết mới chờ duyệt: "${submission.title}" từ tác giả ${submission.authorName} (${submission.unit || 'Tự do'})`,
        route: 'cms'
      });
    } catch (err) {
      console.warn('[NotificationEngine] In-app notification error for article submitted:', err);
    }
  }

  /**
   * Event 3: ARTICLE_APPROVED
   */
  static async notifyArticleApproved(submission: ArticleSubmission): Promise<void> {
    const settings = await this.getSettings();
    if (!settings.articleApprovedEnabled) return;

    const eventKey = `ARTICLE_APPROVED_${submission.id}`;
    const subject = `[MTTQ CHÁNH HIỆP] Chúc mừng! Bài viết của bạn đã được duyệt và xuất bản`;
    const body = `
      Chào ${submission.authorName},
      
      Ban Biên tập Cổng thông tin MTTQ Việt Nam Phường Chánh Hiệp trân trọng thông báo:
      
      Bài viết "${submission.title}" của bạn gửi lúc ${submission.createdAt} đã được duyệt thành công và đã xuất bản chính thức trên Cổng thông tin Phường Chánh Hiệp.
      
      - Tiêu đề: ${submission.title}
      - Thời gian duyệt: ${new Date().toLocaleString()}
      - Chuyên mục: ${submission.unit || 'Mặt trận nhân dân'}
      
      Cảm ơn sự đóng góp ý nghĩa của bạn cho phong trào và hoạt động thông tin tuyên truyền của Mặt trận Phường Chánh Hiệp. Hy vọng sẽ tiếp tục nhận được các bài viết cộng tác tiếp theo của bạn.
      
      Trân trọng,
      Ban Biên tập MTTQ Phường Chánh Hiệp
    `;

    await this.sendEmail(
      'ARTICLE_APPROVED',
      eventKey,
      'article_submissions',
      submission.id,
      submission.authorEmail,
      submission.authorName,
      subject,
      body,
      { submission }
    );

    // In-App Admin Notification & Audit Log
    try {
      adminCollaborationService.publishActivityEvent({
        actor: { id: 'editor', name: 'Ban Biên tập' },
        action: 'APPROVE',
        entity: 'article',
        entityId: submission.id,
        entityTitle: submission.title,
        details: `Bài viết "${submission.title}" đã được phê duyệt và xuất bản thành công.`,
        route: 'cms'
      });
    } catch (err) {
      console.warn('[NotificationEngine] In-app notification error for article approved:', err);
    }
  }

  /**
   * Event 4: ARTICLE_REJECTED
   */
  static async notifyArticleRejected(submission: ArticleSubmission, reason: string): Promise<void> {
    const settings = await this.getSettings();
    if (!settings.articleRejectedEnabled) return;

    const eventKey = `ARTICLE_REJECTED_${submission.id}`;
    const subject = `[MTTQ CHÁNH HIỆP] Thông báo kết quả duyệt bài viết cộng tác`;
    const body = `
      Chào ${submission.authorName},
      
      Cảm ơn bạn đã gửi bài viết cộng tác cho Cổng thông tin MTTQ Việt Nam Phường Chánh Hiệp.
      
      Ban Biên tập đã rà soát bài viết "${submission.title}" gửi lúc ${submission.createdAt} và rất tiếc phải thông báo rằng bài viết chưa phù hợp để xuất bản ở thời điểm hiện tại.
      
      - Lý do phản hồi: ${reason || 'Bài viết chưa phù hợp với định hướng tuyên truyền hiện tại hoặc cần bổ sung thông tin chi tiết.'}
      
      Bạn có thể chỉnh sửa lại bài viết và gửi lại để chúng tôi tiếp tục duyệt.
      
      Trân trọng,
      Ban Biên tập MTTQ Phường Chánh Hiệp
    `;

    await this.sendEmail(
      'ARTICLE_REJECTED',
      eventKey,
      'article_submissions',
      submission.id,
      submission.authorEmail,
      submission.authorName,
      subject,
      body,
      { submission, reason }
    );

    // In-App Admin Notification & Audit Log
    try {
      adminCollaborationService.publishActivityEvent({
        actor: { id: 'editor', name: 'Ban Biên tập' },
        action: 'REJECT',
        entity: 'article',
        entityId: submission.id,
        entityTitle: submission.title,
        details: `Bài viết "${submission.title}" bị từ chối phê duyệt. Lý do: ${reason}`,
        route: 'cms'
      });
    } catch (err) {
      console.warn('[NotificationEngine] In-app notification error for article rejected:', err);
    }
  }

  /**
   * HTML Template Generators
   */
  private static generateFeedbackReceiptHtml(feedback: FeedbackItem): string {
    const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://chanhhiep.binhduong.gov.vn';
    const trackerUrl = `${appUrl}/#lookup`;

    return `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%); padding: 24px 20px; text-align: center; color: #ffffff;">
          <img src="https://res.cloudinary.com/idt08wyp/image/upload/v1789907080/Logo-Mat-Tran-To-Quoc-Viet-Nam.png" alt="Logo MTTQ" style="width: 68px; height: 68px; margin-bottom: 8px;" referrerPolicy="no-referrer" />
          <h1 style="margin: 0; font-size: 17px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; color: #ffffff;">ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM</h1>
          <h2 style="margin: 4px 0 0 0; font-size: 14px; font-weight: 700; color: #fde047;">PHƯỜNG CHÁNH HIỆP - TP. THỦ DẦU MỘT</h2>
          <p style="margin: 6px 0 0 0; font-size: 11px; font-style: italic; color: #fef08a;">"Đoàn kết - Dân chủ - Đồng thuận - Phát triển"</p>
        </div>

        <!-- Body Content -->
        <div style="padding: 24px 22px; color: #334155;">
          <!-- Badge -->
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="display: inline-block; background-color: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; padding: 6px 16px; border-radius: 20px; font-weight: 700; font-size: 12px; text-transform: uppercase;">
              ✉️ THÔNG BÁO XÁC NHẬN TIẾP NHẬN PHẢN ÁNH
            </span>
          </div>

          <p style="font-size: 15px; font-weight: 600; color: #0f172a; margin-top: 0;">
            Kính gửi Ông/Bà: <span style="color: #1e40af;">${feedback.fullName || 'Công dân'}</span>,
          </p>
          
          <p style="font-size: 14px; line-height: 1.6; color: #334155;">
            Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp trân trọng cảm ơn tinh thần trách nhiệm và ý kiến đóng góp kịp thời của Quý Ông/Bà đối với công tác phản ánh dân sinh và phát triển địa phương.
          </p>

          <p style="font-size: 14px; line-height: 1.6; color: #334155;">
            Hệ thống Cổng thông tin điện tử đã tiếp nhận thông tin phản ánh với các chi tiết sau:
          </p>

          <!-- Feedback Details Card -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin: 18px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 140px;">Mã tra cứu:</td>
                <td style="padding: 6px 0; font-weight: 800; font-size: 15px; color: #dc2626;">${feedback.feedbackCode}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Lĩnh vực:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${feedback.category}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Tiêu đề:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${feedback.title}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Thời gian tiếp nhận:</td>
                <td style="padding: 6px 0; color: #334155;">${feedback.createdAt}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Trạng thái ban đầu:</td>
                <td style="padding: 6px 0;">
                  <span style="background-color: #dbeafe; color: #1e40af; padding: 3px 10px; border-radius: 12px; font-weight: 700; font-size: 11px;">Đã tiếp nhận</span>
                </td>
              </tr>
            </table>
          </div>

          <!-- Content Box -->
          <div style="margin: 18px 0;">
            <p style="font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px;">Nội dung phản ánh của Quý Ông/Bà:</p>
            <div style="background-color: #fff8f8; border-left: 4px solid #dc2626; padding: 14px 16px; border-radius: 0 8px 8px 0; font-size: 13px; line-height: 1.6; color: #1e293b; font-style: italic;">
              "${feedback.content}"
            </div>
          </div>

          <!-- Action & Guide -->
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px 16px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #166534; font-weight: 600;">
              📌 Quý Ông/Bà vui lòng lưu lại Mã tra cứu <strong style="color: #dc2626;">${feedback.feedbackCode}</strong> để tự theo dõi tiến độ xử lý trực tuyến.
            </p>
            <a href="${trackerUrl}" target="_blank" style="display: inline-block; background-color: #b91c1c; color: #ffffff; text-decoration: none; padding: 10px 22px; border-radius: 6px; font-weight: 700; font-size: 13px; letter-spacing: 0.3px;">
              🔍 TRA CỨU TIẾN ĐỘ XỬ LÝ
            </a>
          </div>

          <p style="font-size: 13px; line-height: 1.6; color: #475569;">
            Mặt trận Tổ quốc Phường Chánh Hiệp sẽ nhanh chóng xác minh, làm việc với các cơ quan chuyên môn liên quan để xử lý và thông báo kết quả chính thức đến Quý Ông/Bà qua email này.
          </p>

          <!-- Signature -->
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0 16px 0;" />
          <div style="font-size: 12px; color: #64748b; line-height: 1.6;">
            <p style="font-weight: 700; color: #1e293b; margin: 0 0 4px 0; font-size: 13px;">BAN THƯỜNG TRỰC UỶ BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP</p>
            <p style="margin: 0;">📍 <strong>Địa chỉ:</strong> Khu phố 1, Phường Chánh Hiệp, TP. Thủ Dầu Một, Tỉnh Bình Dương</p>
            <p style="margin: 0;">✉️ <strong>Email chính thức:</strong> <a href="mailto:mttqvietnamphuongchanhhiep@gmail.com" style="color: #2563eb; text-decoration: none;">mttqvietnamphuongchanhhiep@gmail.com</a></p>
            <p style="margin: 0;">🌐 <strong>Cổng thông tin:</strong> Phản ánh dân sinh & An sinh xã hội Chánh Hiệp</p>
          </div>
        </div>

        <!-- Footer Note -->
        <div style="background-color: #f1f5f9; padding: 12px 20px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          Thư này được gửi tự động từ Cổng thông tin điện tử Văn phòng số MTTQ Phường Chánh Hiệp.
        </div>
      </div>
    `;
  }

  private static generateFeedbackOfficerNoticeHtml(feedback: FeedbackItem): string {
    const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://chanhhiep.binhduong.gov.vn';
    const adminUrl = `${appUrl}/#office`;

    return `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); padding: 22px 20px; text-align: center; color: #ffffff;">
          <img src="https://res.cloudinary.com/idt08wyp/image/upload/v1789907080/Logo-Mat-Tran-To-Quoc-Viet-Nam.png" alt="Logo MTTQ" style="width: 60px; height: 60px; margin-bottom: 6px;" referrerPolicy="no-referrer" />
          <h1 style="margin: 0; font-size: 16px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; color: #ffffff;">VĂN PHÒNG SỐ MTTQ PHƯỜNG CHÁNH HIỆP</h1>
          <h2 style="margin: 4px 0 0 0; font-size: 13px; font-weight: 600; color: #93c5fd;">TỔ TIẾP NHẬN & PHÂN CÔNG XỬ LÝ PHẢN ÁNH DÂN NGUYỆN</h2>
        </div>

        <div style="padding: 22px; color: #334155;">
          <!-- Badge -->
          <div style="text-align: center; margin-bottom: 18px;">
            <span style="display: inline-block; background-color: #fef3c7; color: #b45309; border: 1px solid #fde68a; padding: 6px 16px; border-radius: 20px; font-weight: 800; font-size: 12px;">
              ⚡ CÓ PHẢN ÁNH MỚI CẦN XỬ LÝ: [ ${feedback.feedbackCode} ]
            </span>
          </div>

          <p style="font-size: 14px; color: #0f172a; margin-top: 0; font-weight: 600;">
            Kính gửi Cán bộ Ban Thường trực / Tổ Tiếp nhận ý kiến dân sinh,
          </p>

          <p style="font-size: 13px; line-height: 1.6; color: #334155;">
            Hệ thống vừa tiếp nhận 01 phản ánh dân nguyện mới do người dân gửi trực tuyến. Chi tiết thông tin phản ánh như sau:
          </p>

          <!-- Full Info Table -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin: 16px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 5px 0; color: #64748b; font-weight: 600; width: 140px;">Mã phản ánh:</td>
                <td style="padding: 5px 0; font-weight: 800; font-size: 14px; color: #dc2626;">${feedback.feedbackCode}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #64748b; font-weight: 600;">Họ và tên người dân:</td>
                <td style="padding: 5px 0; font-weight: 700; color: #0f172a;">${feedback.fullName || 'Người dân'}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #64748b; font-weight: 600;">Số điện thoại:</td>
                <td style="padding: 5px 0; font-weight: 700; color: #2563eb;">${feedback.phone || 'Chưa cung cấp'}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #64748b; font-weight: 600;">Địa chỉ cư trú:</td>
                <td style="padding: 5px 0; color: #0f172a;">${feedback.address || 'Chưa cung cấp'}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #64748b; font-weight: 600;">Email người gửi:</td>
                <td style="padding: 5px 0; color: #0f172a;">${feedback.email || 'Không có'}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #64748b; font-weight: 600;">Lĩnh vực & Tiêu đề:</td>
                <td style="padding: 5px 0; font-weight: 700; color: #0f172a;">[${feedback.category}] ${feedback.title}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #64748b; font-weight: 600;">Địa bàn:</td>
                <td style="padding: 5px 0; color: #334155;">${feedback.departmentId || 'Toàn phường Chánh Hiệp'}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #64748b; font-weight: 600;">Thời gian gửi:</td>
                <td style="padding: 5px 0; color: #334155;">${feedback.createdAt}</td>
              </tr>
            </table>
          </div>

          <!-- Content Box -->
          <div style="margin: 16px 0;">
            <p style="font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">Nội dung chi tiết phản ánh:</p>
            <div style="background-color: #f1f5f9; border-left: 4px solid #1e3a8a; padding: 12px 16px; border-radius: 0 6px 6px 0; font-size: 13px; line-height: 1.6; color: #0f172a;">
              "${feedback.content}"
            </div>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 24px 0 16px 0;">
            <a href="${adminUrl}" target="_blank" style="display: inline-block; background-color: #1e3a8a; color: #ffffff; text-decoration: none; padding: 11px 24px; border-radius: 6px; font-weight: 700; font-size: 13px;">
              🖥️ ĐĂNG NHẬP VĂN PHÒNG SỐ ĐỂ XỬ LÝ
            </a>
          </div>

          <p style="font-size: 12px; color: #64748b; text-align: center; margin-bottom: 0;">
            Vui lòng phân loại, xác minh và chuyển giao cơ quan thẩm quyền giải quyết theo đúng quy trình tiếp dân.
          </p>
        </div>
      </div>
    `;
  }

  private static generateFeedbackStatusChangedHtml(feedback: FeedbackItem, prevStatus: string): string {
    const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://chanhhiep.binhduong.gov.vn';
    const trackerUrl = `${appUrl}/#lookup`;

    let statusTitle = '';
    let statusBgColor = '#3b82f6';
    let statusBadgeText = '';
    let statusDescription = '';
    let badgeBg = '#eff6ff';
    let badgeColor = '#1d4ed8';
    let badgeBorder = '#bfdbfe';

    if (feedback.status === 'processing') {
      statusTitle = 'ĐANG TIẾN HÀNH XỬ LÝ';
      statusBgColor = '#2563eb';
      badgeBg = '#eff6ff';
      badgeColor = '#1d4ed8';
      badgeBorder = '#bfdbfe';
      statusBadgeText = '⏳ ĐANG TRONG TIẾN TRÌNH XỬ LÝ';
      statusDescription = 'Phản ánh của Quý Ông/Bà đã được Ủy ban MTTQ Việt Nam Phường Chánh Hiệp xác minh thông tin và chuyển giao trực tiếp cho cơ quan / bộ phận chuyên môn phối hợp kiểm tra, xử lý theo đúng thẩm quyền.';
    } else if (feedback.status === 'completed') {
      statusTitle = 'ĐÃ GIẢI QUYẾT HOÀN THÀNH';
      statusBgColor = '#16a34a';
      badgeBg = '#f0fdf4';
      badgeColor = '#15803d';
      badgeBorder = '#bbf7d0';
      statusBadgeText = '✅ ĐÃ GIẢI QUYẾT HOÀN THÀNH';
      statusDescription = 'Ủy ban MTTQ Việt Nam Phường Chánh Hiệp xin thông báo phản ánh của Quý Ông/Bà đã được đơn vị chuyên môn xử lý hoàn tất và đã được Ban Thường trực nghiệm thu kết quả.';
    } else if (feedback.status === 'rejected') {
      statusTitle = 'TỪ CHỐI / CHUYỂN CƠ QUAN KHÁC';
      statusBgColor = '#dc2626';
      badgeBg = '#fef2f2';
      badgeColor = '#b91c1c';
      badgeBorder = '#fecaca';
      statusBadgeText = 'ℹ️ THÔNG BÁO TỪ CHỐI / HƯỚNG DẪN DÂN NGUYỆN';
      statusDescription = 'Phản ánh của Quý Ông/Bà chưa đủ cơ sở giải quyết trực tiếp hoặc không thuộc thẩm quyền xử lý của Ủy ban Nhân dân Phường Chánh Hiệp. Vui lòng xem phản hồi hướng dẫn chi tiết bên dưới.';
    } else {
      statusTitle = 'CẬP NHẬT TIẾN ĐỘ PHẢN ÁNH';
      statusBgColor = '#475569';
      statusBadgeText = `TRẠNG THÁI MỚI: ${feedback.status.toUpperCase()}`;
      statusDescription = 'Hệ thống vừa cập nhật tiến độ giải quyết phản ánh dân nguyện của Quý Ông/Bà.';
    }

    const updateTime = feedback.updatedAt || new Date().toLocaleString('vi-VN');

    return `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, ${statusBgColor} 0%, #0f172a 100%); padding: 24px 20px; text-align: center; color: #ffffff;">
          <img src="https://res.cloudinary.com/idt08wyp/image/upload/v1789907080/Logo-Mat-Tran-To-Quoc-Viet-Nam.png" alt="Logo MTTQ" style="width: 66px; height: 66px; margin-bottom: 8px;" referrerPolicy="no-referrer" />
          <h1 style="margin: 0; font-size: 17px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; color: #ffffff;">ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM</h1>
          <h2 style="margin: 4px 0 0 0; font-size: 14px; font-weight: 700; color: #fde047;">PHƯỜNG CHÁNH HIỆP - TP. THỦ DẦU MỘT</h2>
          <p style="margin: 6px 0 0 0; font-size: 11px; font-style: italic; color: #fef08a;">"Đoàn kết - Dân chủ - Đồng thuận - Phát triển"</p>
        </div>

        <div style="padding: 24px 22px; color: #334155;">
          <!-- Status Badge -->
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="display: inline-block; background-color: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeBorder}; padding: 7px 18px; border-radius: 20px; font-weight: 800; font-size: 13px;">
              ${statusBadgeText}
            </span>
          </div>

          <p style="font-size: 15px; font-weight: 600; color: #0f172a; margin-top: 0;">
            Kính gửi Ông/Bà: <span style="color: #1e40af;">${feedback.fullName || 'Công dân'}</span>,
          </p>

          <p style="font-size: 14px; line-height: 1.6; color: #334155;">
            Ban Thường trực Ủy ban MTTQ Việt Nam Phường Chánh Hiệp trân trọng thông báo cập nhật tiến độ giải quyết phản ánh mã số <strong style="color: #dc2626; font-size: 15px;">[ ${feedback.feedbackCode} ]</strong> của Quý Ông/Bà:
          </p>

          <!-- Summary Table -->
          <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; margin: 18px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 140px;">Mã phản ánh:</td>
                <td style="padding: 6px 0; font-weight: 800; font-size: 15px; color: #dc2626;">${feedback.feedbackCode}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Tiêu đề:</td>
                <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${feedback.title}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Lĩnh vực:</td>
                <td style="padding: 6px 0; color: #334155;">${feedback.category}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Trạng thái cập nhật:</td>
                <td style="padding: 6px 0;">
                  <span style="background-color: ${badgeBg}; color: ${badgeColor}; padding: 4px 12px; border-radius: 12px; font-weight: 800; font-size: 12px;">
                    ${statusTitle}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Thời điểm cập nhật:</td>
                <td style="padding: 6px 0; color: #475569;">${updateTime}</td>
              </tr>
            </table>
          </div>

          <!-- Description / Response Box -->
          <div style="margin: 20px 0;">
            <p style="font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">Nội dung thông báo / Tiến độ giải quyết:</p>
            <div style="background-color: #f1f5f9; border-left: 4px solid ${statusBgColor}; padding: 14px 16px; border-radius: 0 8px 8px 0; font-size: 13px; line-height: 1.6; color: #0f172a;">
              ${statusDescription}
            </div>
          </div>

          ${feedback.adminResponse ? `
            <!-- Admin Response Box -->
            <div style="margin: 20px 0;">
              <p style="font-size: 13px; font-weight: 700; color: #15803d; margin-bottom: 8px;">📋 Kết quả trả lời / Văn bản phản hồi chính thức:</p>
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #16a34a; padding: 14px 16px; border-radius: 0 8px 8px 0; font-size: 13px; line-height: 1.6; color: #14532d; font-weight: 500;">
                ${feedback.adminResponse.replace(/\n/g, '<br/>')}
              </div>
            </div>
          ` : ''}

          <!-- CTA Button -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin: 22px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #475569;">
              Quý Ông/Bà có thể tra cứu thông tin chi tiết và đính kèm văn bản trả lời trên Cổng điện tử:
            </p>
            <a href="${trackerUrl}" target="_blank" style="display: inline-block; background-color: ${statusBgColor}; color: #ffffff; text-decoration: none; padding: 10px 22px; border-radius: 6px; font-weight: 700; font-size: 13px;">
              🔍 TRA CỨU CHI TIẾT PHẢN HỒI
            </a>
          </div>

          <!-- Signature -->
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0 16px 0;" />
          <div style="font-size: 12px; color: #64748b; line-height: 1.6;">
            <p style="font-weight: 700; color: #1e293b; margin: 0 0 4px 0; font-size: 13px;">BAN THƯỜNG TRỰC UỶ BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP</p>
            <p style="margin: 0;">📍 Khu phố 1, Phường Chánh Hiệp, TP. Thủ Dầu Một, Tỉnh Bình Dương</p>
            <p style="margin: 0;">✉️ <strong>Email chính thức:</strong> <a href="mailto:mttqvietnamphuongchanhhiep@gmail.com" style="color: #2563eb; text-decoration: none;">mttqvietnamphuongchanhhiep@gmail.com</a></p>
          </div>
        </div>

        <div style="background-color: #f1f5f9; padding: 12px 20px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          Thư này được gửi tự động từ Cổng thông tin điện tử Văn phòng số MTTQ Phường Chánh Hiệp.
        </div>
      </div>
    `;
  }

  /**
   * Event 5: FEEDBACK_SUBMITTED
   */
  static async notifyFeedbackSubmitted(feedback: FeedbackItem): Promise<void> {
    const settings = await this.getSettings();
    if (!settings.feedbackSubmittedEnabled) return;

    const eventKey = `FEEDBACK_SUBMITTED_${feedback.id}`;
    const subject = `[MTTQ CHÁNH HIỆP] Có phản ánh dân nguyện mới: ${feedback.feedbackCode}`;
    const officerHtml = this.generateFeedbackOfficerNoticeHtml(feedback);

    // Determine target emails (standard feedback officer emails + optionally category routed emails)
    const targetEmails = new Set<string>(settings.feedbackEmails);
    const routedEmail = settings.categoryRouting[feedback.category];
    if (routedEmail) {
      targetEmails.add(routedEmail);
    }

    for (const email of targetEmails) {
      await this.sendEmail(
        'FEEDBACK_SUBMITTED',
        `${eventKey}_TO_${email}`,
        'feedback',
        feedback.id,
        email,
        'Cán bộ Tiếp dân',
        subject,
        officerHtml,
        { feedback }
      );
    }

    // Send an acknowledgement receipt email to the citizen if they provided a valid email
    if (feedback.email && feedback.email.trim().includes('@')) {
      const receiptSubject = `[MTTQ CHÁNH HIỆP] Đã tiếp nhận phản ánh mã số [${feedback.feedbackCode}]`;
      const receiptHtml = this.generateFeedbackReceiptHtml(feedback);

      await this.sendEmail(
        'FEEDBACK_RECEIPT',
        `FEEDBACK_RECEIPT_${feedback.id}`,
        'feedback',
        feedback.id,
        feedback.email,
        feedback.fullName || 'Người dân',
        receiptSubject,
        receiptHtml,
        { feedback }
      );
    }

    // In-App Admin Notification & Audit Log
    try {
      adminCollaborationService.publishActivityEvent({
        actor: { id: 'citizen', name: feedback.fullName || 'Người dân' },
        action: 'CREATE',
        entity: 'feedback',
        entityId: feedback.id,
        entityTitle: feedback.feedbackCode,
        details: `Có phản ánh mới từ ${feedback.fullName || 'Người dân'} [${feedback.feedbackCode}]: "${feedback.title}"`,
        route: 'opinions'
      });
    } catch (err) {
      console.warn('[NotificationEngine] In-app notification error for feedback submitted:', err);
    }
  }

  /**
   * Event 6: FEEDBACK_STATUS_CHANGED
   */
  static async notifyFeedbackStatusChanged(feedback: FeedbackItem, prevStatus: string): Promise<void> {
    const settings = await this.getSettings();
    if (!settings.feedbackStatusChangedEnabled) return;

    // Check if the citizen provided a valid email
    if (!feedback.email || !feedback.email.trim().includes('@')) return;

    const eventKey = `FEEDBACK_STATUS_CHANGED_${feedback.id}_${feedback.status}`;
    const statusLabel = feedback.status === 'processing' ? 'Đang xử lý' : feedback.status === 'completed' ? 'Đã giải quyết hoàn thành' : feedback.status === 'rejected' ? 'Thông báo từ chối / Hướng dẫn' : feedback.status;
    const subject = `[MTTQ CHÁNH HIỆP] Tiến độ giải quyết phản ánh [${feedback.feedbackCode}] - ${statusLabel}`;
    const statusHtml = this.generateFeedbackStatusChangedHtml(feedback, prevStatus);

    await this.sendEmail(
      'FEEDBACK_STATUS_CHANGED',
      eventKey,
      'feedback',
      feedback.id,
      feedback.email,
      feedback.fullName,
      subject,
      statusHtml,
      { feedback, prevStatus }
    );

    // In-App Admin Notification & Audit Log
    try {
      adminCollaborationService.publishActivityEvent({
        actor: { id: 'staff', name: 'Ban Thường trực' },
        action: 'UPDATE',
        entity: 'feedback',
        entityId: feedback.id,
        entityTitle: feedback.feedbackCode,
        details: `Cập nhật kết quả xử lý phản ánh [${feedback.feedbackCode}] sang "${statusLabel}"`,
        route: 'opinions'
      });
    } catch (err) {
      console.warn('[NotificationEngine] In-app notification error for feedback status changed:', err);
    }
  }
}
