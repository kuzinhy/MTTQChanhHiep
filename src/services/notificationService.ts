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
  adminEmails: ['nguyenhuy.thudaumot@gmail.com', 'admin.chanhhiep@binhduong.gov.vn', 'mttq.chanhhiep@gmail.com'],
  editorEmails: ['nguyenhuy.thudaumot@gmail.com', 'editor.chanhhiep@binhduong.gov.vn', 'mttq.chanhhiep@gmail.com'],
  feedbackEmails: ['nguyenhuy.thudaumot@gmail.com', 'tiepdan.chanhhiep@binhduong.gov.vn', 'mttq.chanhhiep@gmail.com'],
  categoryRouting: {
    'Vấn đề dân sinh': 'nguyenhuy.thudaumot@gmail.com',
    'An sinh xã hội': 'ansinh.chanhhiep@binhduong.gov.vn',
    'Môi trường & Đô thị': 'dothi.chanhhiep@binhduong.gov.vn',
    'Trật tự an toàn': 'congan.chanhhiep@binhduong.gov.vn',
    'Thủ tục hành chính': 'motcua.chanhhiep@binhduong.gov.vn',
    'Văn hóa - Xã hội': 'vanhoa.chanhhiep@binhduong.gov.vn',
    'Ý kiến đóng góp khác': 'nguyenhuy.thudaumot@gmail.com'
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
        htmlBody: body.replace(/\n/g, '<br/>'),
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
   * Event 5: FEEDBACK_SUBMITTED
   */
  static async notifyFeedbackSubmitted(feedback: FeedbackItem): Promise<void> {
    const settings = await this.getSettings();
    if (!settings.feedbackSubmittedEnabled) return;

    const eventKey = `FEEDBACK_SUBMITTED_${feedback.id}`;
    const subject = `[MTTQ CHÁNH HIỆP] Có phản ánh dân nguyện mới: ${feedback.feedbackCode}`;
    const body = `
      Kính gửi Tổ Tiếp nhận Ý kiến Dân sinh,
      
      Hệ thống vừa tiếp nhận phản ánh mới từ người dân trên địa bàn:
      
      - Mã tiếp nhận: ${feedback.feedbackCode}
      - Lĩnh vực: ${feedback.category}
      - Tiêu đề: ${feedback.title}
      - Địa bàn: ${feedback.departmentId || 'Toàn phường'}
      - Người phản ánh: ${feedback.fullName || 'Người dân ẩn danh'}
      - Điện thoại: ${feedback.phone || 'Ẩn danh'}
      - Email: ${feedback.email || 'Không có'}
      - Thời gian gửi: ${feedback.createdAt}
      
      Nội dung phản ánh:
      "${feedback.content}"
      
      Vui lòng kiểm tra, phân loại và chuyển đơn vị có thẩm quyền để kịp thời giải quyết cho nhân dân.
      
      Trân trọng,
      Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp
    `;

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
        body,
        { feedback }
      );
    }

    // Send an acknowledgement receipt email to the citizen if they provided a valid email
    if (feedback.email && feedback.email.trim().includes('@')) {
      const receiptSubject = `Đã tiếp nhận phản ánh ${feedback.feedbackCode}`;
      const receiptBody = `
Kính gửi Quý Ông/Bà ${feedback.fullName || 'Công dân'},

Hệ thống Cổng thông tin Mặt trận Tổ quốc Phường Chánh Hiệp đã tiếp nhận phản ánh của Quý Ông/Bà.

- Mã phản ánh: ${feedback.feedbackCode}
- Nội dung: ${feedback.content}
- Trạng thái: Đã tiếp nhận

Vui lòng lưu mã phản ánh để theo dõi tiến độ xử lý trên Cổng thông tin Mặt trận Tổ quốc Phường Chánh Hiệp.

Trân trọng,
Ban Thường trực Ủy ban MTTQ Việt Nam Phường Chánh Hiệp
      `;

      await this.sendEmail(
        'FEEDBACK_RECEIPT',
        `FEEDBACK_RECEIPT_${feedback.id}`,
        'feedback',
        feedback.id,
        feedback.email,
        feedback.fullName || 'Người dân',
        receiptSubject,
        receiptBody,
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
    const subject = `[MTTQ CHÁNH HIỆP] Cập nhật tiến độ xử lý phản ánh [${feedback.feedbackCode}]`;

    let statusLabel: string = feedback.status;
    let description = '';

    if (feedback.status === 'processing') {
      statusLabel = 'Đang xử lý (processing)';
      description = 'Phản ánh của bạn đã được xác minh và chuyển đến bộ phận chuyên môn của Ủy ban Nhân dân Phường Chánh Hiệp để trực tiếp giải quyết.';
    } else if (feedback.status === 'completed') {
      statusLabel = 'Đã hoàn thành (completed)';
      description = 'Yêu cầu/Phản ánh của bạn đã được giải quyết triệt để. Ban Thường trực Mặt trận Tổ quốc đã nghiệm thu kết quả xử lý của các bên liên quan.';
    } else if (feedback.status === 'rejected') {
      statusLabel = 'Từ chối giải quyết (rejected)';
      description = 'Rất tiếc, phản ánh của bạn chưa đủ cơ sở giải quyết hoặc không thuộc thẩm quyền xử lý của UBND Phường Chánh Hiệp.';
    } else {
      return; // No need to notify on other state transitions
    }

    const body = `
      Chào ${feedback.fullName},
      
      Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp xin thông báo tiến độ giải quyết phản ánh mã số [ ${feedback.feedbackCode} ] của bạn:
      
      - Tiêu đề phản ánh: ${feedback.title}
      - Trạng thái mới: ${statusLabel}
      - Thời gian cập nhật: ${new Date().toLocaleString()}
      
      Chi tiết nội dung cập nhật:
      ${description}
      
      Bạn có thể truy cập Cổng thông tin MTTQ Phường Chánh Hiệp và sử dụng mã tra cứu [ ${feedback.feedbackCode} ] để xem phản hồi chính thức đầy đủ và kết quả nghiệm thu từ cơ quan chức năng.
      
      Trân trọng cảm ơn ý kiến đóng góp kịp thời của bạn.
      
      Trân trọng,
      Ban Thường trực MTTQ Phường Chánh Hiệp
    `;

    await this.sendEmail(
      'FEEDBACK_STATUS_CHANGED',
      eventKey,
      'feedback',
      feedback.id,
      feedback.email,
      feedback.fullName,
      subject,
      body,
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
