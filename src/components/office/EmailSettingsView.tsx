import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Mail, 
  Send, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ToggleLeft, 
  ToggleRight, 
  Clock, 
  Database, 
  RefreshCw, 
  Search, 
  ExternalLink,
  ShieldCheck,
  FileText,
  UserCheck,
  MessageSquare,
  Sparkles,
  Link,
  Info,
  Check,
  Copy
} from 'lucide-react';
import { NotificationService, DEFAULT_APPS_SCRIPT_WEBHOOK } from '../../services/notificationService';
import { EmailNotificationSettings, EmailLog } from '../../types';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const EmailSettingsView: React.FC = () => {
  const [settings, setSettings] = useState<EmailNotificationSettings | null>(null);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Test email state
  const [testEmailRecipient, setTestEmailRecipient] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    let unsubLogs: (() => void) | null = null;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const currentSettings = await NotificationService.getSettings();
        // Ensure webhookUrl is present
        if (!currentSettings.webhookUrl) {
          currentSettings.webhookUrl = import.meta.env.VITE_EMAIL_WEBHOOK_URL || DEFAULT_APPS_SCRIPT_WEBHOOK;
        }
        setSettings(currentSettings);

        // Pre-fill test recipient with first admin email if available
        if (currentSettings.adminEmails && currentSettings.adminEmails.length > 0) {
          setTestEmailRecipient(currentSettings.adminEmails[0]);
        }

        // Listen to live email logs from Firestore
        const logsRef = collection(db, 'email_logs');
        const q = query(logsRef, orderBy('createdAt', 'desc'), limit(100));
        unsubLogs = onSnapshot(q, (snapshot) => {
          const fetchedLogs: EmailLog[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as EmailLog));
          setLogs(fetchedLogs);
          setIsLoading(false);
        }, (err) => {
          console.error('[EmailSettings] Error listening to logs:', err);
          setIsLoading(false);
        });

      } catch (err) {
        console.error('[EmailSettings] Error loading setup:', err);
        setIsLoading(false);
      }
    };

    loadData();

    return () => {
      if (unsubLogs) unsubLogs();
    };
  }, []);

  const handleToggle = (key: keyof EmailNotificationSettings) => {
    if (!settings) return;
    setSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [key]: !prev[key]
      };
    });
  };

  const handleUpdateRecipient = (key: 'adminEmails' | 'editorEmails' | 'feedbackEmails', value: string) => {
    if (!settings) return;
    const emailsArray = value.split(',').map(s => s.trim()).filter(Boolean);
    setSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [key]: emailsArray
      };
    });
  };

  const handleUpdateWebhookUrl = (value: string) => {
    if (!settings) return;
    setSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        webhookUrl: value
      };
    });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await NotificationService.saveSettings(settings);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('[EmailSettings] Error saving settings:', err);
      setIsSaving(false);
      alert('Không thể lưu cấu hình email. Vui lòng kiểm tra quyền truy cập.');
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailRecipient) return;
    setIsSendingTest(true);
    setTestResult(null);

    try {
      const activeUrl = settings?.webhookUrl || import.meta.env.VITE_EMAIL_WEBHOOK_URL || DEFAULT_APPS_SCRIPT_WEBHOOK;
      const subject = '✉️ [MTTQ Phường Chánh Hiệp] Thư Thử Nghiệm Kết Nối Webhook';
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://res.cloudinary.com/idt08wyp/image/upload/v1789907080/Logo-Mat-Tran-To-Quoc-Viet-Nam.png" alt="Logo MTTQ" style="width: 72px; height: 72px;" referrerPolicy="no-referrer" />
            <h2 style="color: #1e3a8a; margin: 12px 0 4px 0; font-size: 20px;">VĂN PHÒNG SỐ MTTQ PHƯỜNG CHÁNH HIỆP</h2>
            <p style="color: #64748b; font-size: 13px; margin: 0;">Hệ thống thông báo email tự động qua Google Apps Script</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p style="color: #334155; font-size: 14px;">Xin chào Ban Quản trị,</p>
          <p style="color: #334155; font-size: 14px; line-height: 1.6;">
            Thư này xác nhận đường truyền kết nối giữa <strong>Cổng thông tin Mặt trận Tổ quốc Phường Chánh Hiệp</strong> và <strong>Google Apps Script Web App</strong> đang hoạt động ổn định và hoàn toàn thông suốt!
          </p>
          <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 14px; border-radius: 8px; margin: 18px 0;">
            <p style="margin: 0; color: #065f46; font-weight: bold; font-size: 14px;">✔️ Kết nối Webhook thành công 100%</p>
            <p style="margin: 4px 0 0 0; color: #047857; font-size: 12px;">Thời điểm kiểm tra: ${new Date().toLocaleString('vi-VN')}</p>
            <p style="margin: 4px 0 0 0; color: #047857; font-size: 11px; word-break: break-all;">Endpoint: ${activeUrl}</p>
          </div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; text-align: center;">
            Đây là thư thử nghiệm tự động từ hệ thống Văn phòng số MTTQ Phường Chánh Hiệp. Quý vị không cần phản hồi thư này.
          </p>
        </div>
      `;

      const success = await NotificationService.sendTestEmail(testEmailRecipient, subject, htmlBody);

      if (success) {
        setTestResult({ 
          success: true, 
          message: `Đã gửi thư thử nghiệm thành công tới ${testEmailRecipient}! Vui lòng kiểm tra hộp thư đến (hoặc hòm thư Rác / Spam).` 
        });
      } else {
        const errorDetail = NotificationService.lastError;
        setTestResult({ 
          success: false, 
          message: errorDetail 
            ? `Thất bại: ${errorDetail}` 
            : 'Không nhận được phản hồi từ Webhook. Vui lòng kiểm tra lại URL Google Apps Script.' 
        });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: `Lỗi kết nối: ${err?.message || err}` });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (log.recipient && log.recipient.toLowerCase().includes(q)) ||
      (log.subject && log.subject.toLowerCase().includes(q)) ||
      (log.errorMessage && log.errorMessage.toLowerCase().includes(q)) ||
      (log.status && log.status.toLowerCase().includes(q))
    );
  });

  const activeWebhook = settings?.webhookUrl || import.meta.env.VITE_EMAIL_WEBHOOK_URL || DEFAULT_APPS_SCRIPT_WEBHOOK;
  const isWebhookActive = !!activeWebhook && activeWebhook.startsWith('https://script.google.com');

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-blue-800 font-bold mb-1">
            <Mail className="w-5 h-5 text-blue-700" />
            <span className="text-xs uppercase tracking-wider text-blue-700 font-extrabold">Cài đặt hệ thống</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
            Thông Báo Email & Webhook
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tự động gửi thông báo qua Google Apps Script & Gmail khi có phản ánh mới, bài viết cần duyệt, hoặc cán bộ đăng ký.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isWebhookActive ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Đã kết nối Webhook Apps Script
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Chưa thiết lập Webhook
            </span>
          )}

          {settings?.systemWideEnabled ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
              Hệ thống đang Bật
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              Tạm dừng
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Đang tải cấu hình thông báo...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* MAIN SETTINGS FORM (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSaveSettings} className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              
              {/* STATUS BAR & SYSTEM TOGGLE */}
              <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                    <Settings className="w-4 h-4 text-slate-600" />
                    Trạng thái hệ thống
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Bật hoặc tắt chức năng gửi email tự động toàn hệ thống</p>
                </div>
                
                <button
                  type="button"
                  onClick={() => handleToggle('systemWideEnabled')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer bg-white shadow-2xs font-semibold text-xs"
                >
                  {settings?.systemWideEnabled ? (
                    <>
                      <ToggleRight className="w-7 h-7 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">● Đang hoạt động</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-7 h-7 text-slate-400" />
                      <span className="text-slate-500">Tạm tắt</span>
                    </>
                  )}
                </button>
              </div>

              {settings && (
                <div className="p-5 sm:p-6 space-y-6">
                  
                  {/* GROUP 1: THÔNG BÁO CHO QUẢN TRỊ */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-blue-700" />
                        Thông báo cho Quản trị
                      </h4>
                      <span className="text-[10px] text-slate-400">Email Admin & Ban Biên tập</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {/* Checkbox 1: Member registered */}
                      <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={settings.newUserEnabled}
                            onChange={() => handleToggle('newUserEnabled')}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-800">Thành viên đăng ký mới</p>
                            <p className="text-[11px] text-slate-500">Gửi mail khi có cán bộ / cộng tác viên tạo tài khoản</p>
                          </div>
                        </div>
                        <UserCheck className="w-4 h-4 text-slate-400" />
                      </label>

                      {/* Checkbox 2: Article submitted */}
                      <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={settings.articleSubmittedEnabled}
                            onChange={() => handleToggle('articleSubmittedEnabled')}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-800">Có bài viết mới</p>
                            <p className="text-[11px] text-slate-500">Báo ngay cho Ban Biên tập khi có tác phẩm cộng tác gửi lên</p>
                          </div>
                        </div>
                        <FileText className="w-4 h-4 text-slate-400" />
                      </label>

                      {/* Checkbox 3: Feedback submitted */}
                      <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={settings.feedbackSubmittedEnabled}
                            onChange={() => handleToggle('feedbackSubmittedEnabled')}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-800">Có phản ánh mới</p>
                            <p className="text-[11px] text-slate-500">Báo ngay cho cán bộ tiếp dân khi người dân gửi phản ánh dân sinh</p>
                          </div>
                        </div>
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                      </label>
                    </div>
                  </div>

                  {/* GROUP 2: THÔNG BÁO CHO NGƯỜI DÙNG */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-indigo-700" />
                        Thông báo cho Người dùng & Người dân
                      </h4>
                      <span className="text-[10px] text-slate-400">Email tác giả & người phản ánh</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Sub-check 1: Article approved */}
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.articleApprovedEnabled}
                          onChange={() => handleToggle('articleApprovedEnabled')}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Bài viết được duyệt</p>
                          <p className="text-[11px] text-slate-500">Báo cho tác giả khi xuất bản</p>
                        </div>
                      </label>

                      {/* Sub-check 2: Article rejected */}
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.articleRejectedEnabled}
                          onChange={() => handleToggle('articleRejectedEnabled')}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Bài viết bị từ chối</p>
                          <p className="text-[11px] text-slate-500">Gửi kèm lý do cần chỉnh sửa</p>
                        </div>
                      </label>

                      {/* Sub-check 3: Feedback received receipt */}
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.feedbackSubmittedEnabled}
                          onChange={() => handleToggle('feedbackSubmittedEnabled')}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Đã tiếp nhận phản ánh</p>
                          <p className="text-[11px] text-slate-500">Gửi mã biên nhận PA-XXXX</p>
                        </div>
                      </label>

                      {/* Sub-check 4: Feedback status changed */}
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.feedbackStatusChangedEnabled}
                          onChange={() => handleToggle('feedbackStatusChangedEnabled')}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Cập nhật kết quả xử lý</p>
                          <p className="text-[11px] text-slate-500">Thông báo khi xử lý xong</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* GROUP 3: WEBHOOK URL & EMAIL ADDRESSES */}
                  <div className="space-y-4">
                    {/* Webhook URL Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Link className="w-3.5 h-3.5 text-blue-600" />
                          Webhook URL Google Apps Script
                        </label>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          Tự động kết nối Gmail
                        </span>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="url"
                          required
                          value={settings.webhookUrl || ''}
                          onChange={(e) => handleUpdateWebhookUrl(e.target.value)}
                          placeholder="https://script.google.com/macros/s/.../exec"
                          className="w-full px-3.5 py-2.5 pr-20 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white text-slate-800 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(settings.webhookUrl || '')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-blue-700 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          {copiedUrl ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          {copiedUrl ? 'Đã sao chép' : 'Sao chép'}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        URL triển khai dưới dạng Web App với quyền truy cập "Anyone" (Bất kỳ ai).
                      </p>
                    </div>

                    {/* Email Quản trị */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Quản trị (Admin)
                      </label>
                      <input
                        type="text"
                        required
                        value={(settings.adminEmails || []).join(', ')}
                        onChange={(e) => handleUpdateRecipient('adminEmails', e.target.value)}
                        placeholder="admin@gmail.com, nguyenhuy.thudaumot@gmail.com"
                        className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                      <p className="text-[10px] text-slate-400 mt-0.5">Nhận thông báo tài khoản mới và cảnh báo hệ thống (cách nhau dấu phẩy)</p>
                    </div>

                    {/* Email Ban Biên tập */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Ban Biên tập (Tin bài, tác phẩm)
                      </label>
                      <input
                        type="text"
                        required
                        value={(settings.editorEmails || []).join(', ')}
                        onChange={(e) => handleUpdateRecipient('editorEmails', e.target.value)}
                        placeholder="editor@gmail.com, nguyenhuy.thudaumot@gmail.com"
                        className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                      <p className="text-[10px] text-slate-400 mt-0.5">Nhận thông báo khi tác giả gửi bài viết chờ duyệt</p>
                    </div>

                    {/* Email Tiếp nhận phản ánh */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Tiếp nhận phản ánh (Dân nguyện)
                      </label>
                      <input
                        type="text"
                        required
                        value={(settings.feedbackEmails || []).join(', ')}
                        onChange={(e) => handleUpdateRecipient('feedbackEmails', e.target.value)}
                        placeholder="tiepdan@gmail.com, nguyenhuy.thudaumot@gmail.com"
                        className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                      <p className="text-[10px] text-slate-400 mt-0.5">Nhận thông báo khi người dân gửi phản ánh dân sinh</p>
                    </div>
                  </div>

                  {/* SAVE ACTION BUTTON */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 text-white font-bold text-sm py-3 px-6 rounded-xl hover:from-blue-800 hover:to-indigo-900 transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Đang lưu cấu hình vào hệ thống...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-300" />
                          Lưu Cấu Hình
                        </>
                      )}
                    </button>

                    <AnimatePresence>
                      {saveSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-2.5 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-4 h-4 text-emerald-600" />
                          Đã lưu cấu hình email và webhook thành công!
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <p className="text-center text-[11px] text-slate-400 mt-2">
                      💡 Mọi thay đổi email sẽ có hiệu lực ngay lập tức mà không cần can thiệp mã nguồn.
                    </p>
                  </div>

                </div>
              )}
            </form>
          </div>

          {/* RIGHT COLUMN: TEST CONSOLE & LOGS (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* TEST EMAIL CONSOLE */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-600" />
                  Kiểm tra kết nối gửi thư thử nghiệm
                </h3>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  Live Test
                </span>
              </div>

              <div className="p-4 sm:p-5">
                <form onSubmit={handleSendTestEmail} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Địa chỉ email nhận thử nghiệm
                    </label>
                    <input
                      type="email"
                      required
                      value={testEmailRecipient}
                      onChange={(e) => setTestEmailRecipient(e.target.value)}
                      placeholder="vd: nguyenhuy.thudaumot@gmail.com"
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingTest || !testEmailRecipient}
                    className="w-full bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-slate-900 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    {isSendingTest ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Đang gửi qua Apps Script...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-blue-300" />
                        Gửi Email Thử Nghiệm Ngay
                      </>
                    )}
                  </button>
                </form>

                {testResult && (
                  <div className={`mt-3.5 p-3 rounded-xl text-xs leading-relaxed ${
                    testResult.success 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    <div className="flex gap-2">
                      {testResult.success ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-bold">{testResult.success ? 'Kết nối thành công!' : 'Thất bại'}</p>
                        <p className="mt-0.5 text-slate-600 text-[11px]">{testResult.message}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AUDIT LOGS TABLE */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-600" />
                    Nhật ký thông báo ({filteredLogs.length})
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Lịch sử gửi email tự động</p>
                </div>

                <div className="relative w-40 sm:w-48">
                  <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm nhật ký..."
                    className="w-full pl-7 pr-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <Database className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-xs text-slate-400">Chưa có bản ghi nhật ký gửi email nào.</p>
                  </div>
                ) : (
                  filteredLogs.map(log => {
                    const isSuccess = log.status === 'sent';
                    const date = log.createdAt ? new Date(log.createdAt) : new Date();

                    return (
                      <div key={log.id} className="p-3 hover:bg-slate-50/70 transition-colors space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isSuccess 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : 'bg-red-50 text-red-700 border border-red-100'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            {isSuccess ? 'ĐÃ GỬI' : 'LỖI'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}{' '}
                            {date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                          </span>
                        </div>

                        <p className="font-semibold text-slate-800 truncate text-xs">{log.subject}</p>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span className="truncate max-w-[180px]">{log.recipient}</span>
                          <span className="font-mono text-[9px] text-slate-400">{log.eventType}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* APPS SCRIPT INFO CARD */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-700 shrink-0" />
                <h4 className="text-xs font-black text-blue-950 uppercase tracking-tight">Về Google Apps Script</h4>
              </div>
              <p className="text-xs text-blue-900 leading-relaxed">
                Khi có phản ánh hay tin bài mới, hệ thống tự động gọi Webhook Apps Script để gửi email qua Gmail hoàn toàn miễn phí. Bạn có thể sửa đổi danh sách email nhận bất kỳ lúc nào trực tiếp trên màn hình này.
              </p>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};
