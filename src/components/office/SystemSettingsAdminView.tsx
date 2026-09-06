import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Power, 
  Save, 
  Eye, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  History, 
  Lock, 
  Server,
  RefreshCw,
  X,
  Building2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SystemSettings, StaffUser } from '../../types';
import { CloudDatabase } from '../../lib/firestoreService';
import { AppStorageEngine } from '../../lib/storage';

interface SystemSettingsAdminViewProps {
  currentUser?: StaffUser | null;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  onPreviewMaintenance?: (settings: SystemSettings) => void;
  onSettingsUpdated?: (settings: SystemSettings) => void;
}

const DEFAULT_SETTINGS: SystemSettings = {
  maintenanceMode: false,
  maintenanceTitle: 'Website đang bảo trì hệ thống',
  maintenanceMessage: 'Cổng thông tin & Văn phòng số MTTQ Việt Nam Phường Chánh Hiệp đang thực hiện nâng cấp, bảo trì định kỳ để phục vụ Quý nhân dân tốt hơn. Vui lòng quay lại sau.',
  showScheduledTime: false,
  updatedAt: new Date().toISOString(),
  updatedBy: 'system',
  updatedByName: 'Hệ thống Quản trị'
};

export const SystemSettingsAdminView: React.FC<SystemSettingsAdminViewProps> = ({
  currentUser,
  onShowToast,
  onPreviewMaintenance,
  onSettingsUpdated
}) => {
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isToggling, setIsToggling] = useState<boolean>(false);

  // Modal confirm state
  const [confirmModalType, setConfirmModalType] = useState<'ENABLE' | 'DISABLE' | null>(null);

  // Form State
  const [titleInput, setTitleInput] = useState<string>('');
  const [messageInput, setMessageInput] = useState<string>('');
  const [showScheduled, setShowScheduled] = useState<boolean>(false);
  const [startAtInput, setStartAtInput] = useState<string>('');
  const [endAtInput, setEndAtInput] = useState<string>('');

  // Fetch current system settings on mount
  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/system-settings', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          applySettingsToState(data.settings);
        }
      }
    } catch (err) {
      console.warn('[SystemSettingsView] Error fetching settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const applySettingsToState = (st: SystemSettings) => {
    setSettings(st);
    AppStorageEngine.saveSystemSettings(st);
    setTitleInput(st.maintenanceTitle || DEFAULT_SETTINGS.maintenanceTitle);
    setMessageInput(st.maintenanceMessage || DEFAULT_SETTINGS.maintenanceMessage);
    setShowScheduled(!!st.showScheduledTime);
    setStartAtInput(st.maintenanceStartAt ? st.maintenanceStartAt.substring(0, 16) : '');
    setEndAtInput(st.maintenanceEndAt ? st.maintenanceEndAt.substring(0, 16) : '');
  };

  // Submit Maintenance Mode Toggle
  const handleConfirmToggle = async () => {
    if (!confirmModalType) return;

    const targetMaintenanceMode = confirmModalType === 'ENABLE';
    setIsToggling(true);

    try {
      const parseIsoOrUndefined = (val: string) => {
        if (!val) return undefined;
        const d = new Date(val);
        return isNaN(d.getTime()) ? undefined : d.toISOString();
      };

      const payload = {
        maintenanceMode: targetMaintenanceMode,
        maintenanceTitle: titleInput.trim(),
        maintenanceMessage: messageInput.trim(),
        maintenanceStartAt: parseIsoOrUndefined(startAtInput),
        maintenanceEndAt: parseIsoOrUndefined(endAtInput),
        showScheduledTime: showScheduled,
        updatedBy: currentUser?.id || 'admin',
        updatedByName: currentUser?.fullname || 'Quản trị viên MTTQ'
      };

      const res = await fetch('/api/admin/system-settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success && data.settings) {
        applySettingsToState(data.settings);
        onSettingsUpdated?.(data.settings);
        const actionLabel = targetMaintenanceMode ? 'ĐÃ BẬT BẢO TRÌ WEBSITE' : 'ĐÃ MỞ LẠI WEBSITE';
        onShowToast?.(
          targetMaintenanceMode
            ? 'Đã bật chế độ bảo trì hệ thống thành công!'
            : 'Đã mở lại website! Người dùng công khai có thể truy cập bình thường.',
          'success'
        );

        // Audit Log
        CloudDatabase.logAudit({
          id: `audit-${Date.now()}`,
          userId: currentUser?.id || 'admin',
          userName: currentUser?.fullname || 'Quản trị viên',
          action: targetMaintenanceMode ? 'CẤU HÌNH HỆ THỐNG (BẬT BẢO TRÌ)' : 'CẤU HÌNH HỆ THỐNG (MỞ WEBSITE)',
          entity: 'Cài đặt hệ thống',
          details: `Chuyển trạng thái hoạt động website: ${actionLabel}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        });
      } else {
        onShowToast?.(data.error || 'Lỗi khi cập nhật trạng thái hệ thống', 'error');
      }
    } catch (err: any) {
      console.error('[SystemSettings] Toggle error:', err);
      onShowToast?.('Không thể kết nối đến máy chủ backend', 'error');
    } finally {
      setIsToggling(false);
      setConfirmModalType(null);
    }
  };

  // Save Text Form Content
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const parseIsoOrUndefined = (val: string) => {
        if (!val) return undefined;
        const d = new Date(val);
        return isNaN(d.getTime()) ? undefined : d.toISOString();
      };

      const payload = {
        maintenanceTitle: titleInput.trim(),
        maintenanceMessage: messageInput.trim(),
        maintenanceStartAt: parseIsoOrUndefined(startAtInput),
        maintenanceEndAt: parseIsoOrUndefined(endAtInput),
        showScheduledTime: showScheduled,
        updatedBy: currentUser?.id || 'admin',
        updatedByName: currentUser?.fullname || 'Quản trị viên MTTQ'
      };

      const res = await fetch('/api/admin/system-settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success && data.settings) {
        applySettingsToState(data.settings);
        onSettingsUpdated?.(data.settings);
        onShowToast?.('Đã lưu nội dung thông báo bảo trì thành công!', 'success');
      } else {
        onShowToast?.(data.error || 'Lỗi khi lưu cấu hình', 'error');
      }
    } catch (err) {
      console.error('[SystemSettings] Save form error:', err);
      onShowToast?.('Không thể kết nối đến máy chủ backend', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Section Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-800/80 text-blue-200 border border-blue-600/50 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Cấu hình Máy chủ &amp; Hệ thống
              </span>
              <span className="bg-emerald-800/80 text-emerald-200 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                REALTIME BACKEND GUARD
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <Server className="w-8 h-8 text-amber-400 shrink-0" />
              <span>Trạng Thái Website &amp; Chế Độ Bảo Trì</span>
            </h1>
            <p className="text-sm text-blue-200 mt-1 max-w-2xl">
              Quản lý bật/tắt toàn bộ trang web công khai, cấu hình thông điệp thông báo bảo trì và thời gian nâng cấp hệ thống.
            </p>
          </div>

          <button
            onClick={fetchSettings}
            disabled={isLoading}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-extrabold px-4 py-2.5 rounded-xl transition-all cursor-pointer text-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Làm mới trạng thái</span>
          </button>
        </div>
      </div>

      {/* Main Status Toggle Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
              TRẠNG THÁI HOẠT ĐỘNG HIỆN TẠI
            </div>

            <div className="flex items-center gap-3">
              {settings.maintenanceMode ? (
                <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-800 border border-rose-300 font-black text-sm px-4 py-1.5 rounded-2xl shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>ĐANG BẬT CHẾ ĐỘ BẢO TRÌ (MAINTENANCE MODE ON)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 border border-emerald-300 font-black text-sm px-4 py-1.5 rounded-2xl shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>WEBSITE ĐANG HOẠT ĐỘNG BÌNH THƯỜNG (NORMAL MODE)</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-2">
              {settings.maintenanceMode
                ? 'Người dùng công khai bị chặn và nhìn thấy trang bảo trì. Cán bộ vẫn có thể vào /admin.'
                : 'Mọi người dùng có thể truy cập đầy đủ các chuyên mục nội dung trên Cổng thông tin.'}
            </p>
          </div>

          {/* Switch Control */}
          <div className="flex flex-col items-start md:items-end gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 shrink-0">
            <span className="text-xs font-black text-slate-700 uppercase">Công tắc hệ thống:</span>
            
            <div className="flex items-center gap-3">
              <span className={`text-xs font-black ${!settings.maintenanceMode ? 'text-emerald-700' : 'text-slate-400'}`}>
                HOẠT ĐỘNG (OFF)
              </span>

              <button
                onClick={() => {
                  setConfirmModalType(settings.maintenanceMode ? 'DISABLE' : 'ENABLE');
                }}
                disabled={isLoading || isToggling}
                className={`relative inline-flex h-9 w-18 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.maintenanceMode ? 'bg-rose-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-8 w-8 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                    settings.maintenanceMode ? 'translate-x-9' : 'translate-x-0'
                  }`}
                >
                  <Power className={`w-4 h-4 ${settings.maintenanceMode ? 'text-rose-600' : 'text-slate-500'}`} />
                </span>
              </button>

              <span className={`text-xs font-black ${settings.maintenanceMode ? 'text-rose-700' : 'text-slate-400'}`}>
                BẢO TRÌ (ON)
              </span>
            </div>
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="pt-4 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <History className="w-3.5 h-3.5 text-blue-600" />
            <span>
              Cập nhật lần cuối:{' '}
              <strong className="text-slate-800">
                {new Date(settings.updatedAt).toLocaleString('vi-VN')}
              </strong>
            </span>
            {settings.updatedByName && (
              <span className="text-slate-600">bởi <strong>{settings.updatedByName}</strong></span>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              const currentFormData: SystemSettings = {
                ...settings,
                maintenanceTitle: titleInput,
                maintenanceMessage: messageInput,
                showScheduledTime: showScheduled,
                maintenanceStartAt: startAtInput ? new Date(startAtInput).toISOString() : undefined,
                maintenanceEndAt: endAtInput ? new Date(endAtInput).toISOString() : undefined
              };
              onPreviewMaintenance?.(currentFormData);
            }}
            className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 font-extrabold hover:underline cursor-pointer"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span>Xem trước trang bảo trì công khai (Preview)</span>
          </button>
        </div>
      </div>

      {/* Configuration Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-blue-700" />
          <h2 className="text-lg font-black text-slate-900">
            Cấu hình Nội dung Thông báo Bảo trì
          </h2>
        </div>

        <form onSubmit={handleSaveForm} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase mb-1.5">
              Tiêu đề thông báo bảo trì <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="VD: Website đang tạm dừng để bảo trì nâng cấp hệ thống..."
              className="w-full text-sm font-semibold p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase mb-1.5">
              Nội dung chi tiết gửi Nhân dân <span className="text-rose-600">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Nhập thông điệp giải thích lý do bảo trì và lời cảm ơn..."
              className="w-full text-sm font-medium p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 leading-relaxed"
            />
          </div>

          {/* Scheduled Time Section */}
          <div className="p-5 rounded-2xl border border-blue-100 bg-blue-50/40 space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showScheduled}
                  onChange={(e) => setShowScheduled(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-xs font-black text-slate-800 uppercase">
                  Hiển thị Thời gian Bảo trì Dự kiến trên giao diện công khai
                </span>
              </label>

              <Clock className="w-4 h-4 text-blue-600" />
            </div>

            {showScheduled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Thời gian bắt đầu:
                  </label>
                  <input
                    type="datetime-local"
                    value={startAtInput}
                    onChange={(e) => setStartAtInput(e.target.value)}
                    className="w-full text-xs font-bold p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Thời gian dự kiến hoàn thành:
                  </label>
                  <input
                    type="datetime-local"
                    value={endAtInput}
                    onChange={(e) => setEndAtInput(e.target.value)}
                    className="w-full text-xs font-bold p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                const currentFormData: SystemSettings = {
                  ...settings,
                  maintenanceTitle: titleInput,
                  maintenanceMessage: messageInput,
                  showScheduledTime: showScheduled,
                  maintenanceStartAt: startAtInput ? new Date(startAtInput).toISOString() : undefined,
                  maintenanceEndAt: endAtInput ? new Date(endAtInput).toISOString() : undefined
                };
                onPreviewMaintenance?.(currentFormData);
              }}
              className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 font-extrabold px-4 py-2.5 rounded-xl transition-all cursor-pointer text-xs"
            >
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Xem trước (Preview)</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-extrabold px-6 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer text-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Đang lưu...' : 'Lưu cấu hình thông báo'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setConfirmModalType(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {confirmModalType === 'ENABLE' ? (
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 mx-auto">
                    <AlertTriangle className="w-8 h-8" />
                  </div>

                  <h3 className="text-lg font-black text-slate-900 text-center mb-2">
                    XÁC NHẬN BẬT CHẾ ĐỘ BẢO TRÌ WEBSITE?
                  </h3>

                  <div className="text-xs text-slate-600 space-y-2.5 bg-rose-50/80 p-4 rounded-2xl border border-rose-200 mb-6 text-left">
                    <p className="font-bold text-rose-900">
                      ⚠️ Khi bật Maintenance Mode:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700">
                      <li>Toàn bộ người dùng công khai sẽ lập tức nhìn thấy trang thông báo bảo trì.</li>
                      <li>Cán bộ &amp; Quản trị viên vẫn truy cập được vào Cổng Văn phòng số <strong>/admin</strong>.</li>
                      <li>Hành động này sẽ được lưu lại trong Nhật ký hệ thống (Audit Log).</li>
                    </ul>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setConfirmModalType(null)}
                      disabled={isToggling}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3 rounded-xl transition-all cursor-pointer text-xs"
                    >
                      Hủy bỏ
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirmToggle}
                      disabled={isToggling}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3 rounded-xl transition-all shadow-md cursor-pointer text-xs flex items-center justify-center gap-2"
                    >
                      {isToggling ? (
                        <span>Đang bật...</span>
                      ) : (
                        <>
                          <Power className="w-4 h-4" />
                          <span>Xác nhận BẬT BẢO TRÌ</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <h3 className="text-lg font-black text-slate-900 text-center mb-2">
                    ĐƯA WEBSITE TRỞ LẠI HOẠT ĐỘNG?
                  </h3>

                  <div className="text-xs text-slate-600 space-y-2 bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 mb-6 text-left">
                    <p className="font-bold text-emerald-900">
                      ✅ Khi tắt Maintenance Mode:
                    </p>
                    <p>
                      Mọi người dùng công khai sẽ lập tức truy cập lại bình thường toàn bộ trang chủ và tất cả các chuyên mục thông tin.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setConfirmModalType(null)}
                      disabled={isToggling}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3 rounded-xl transition-all cursor-pointer text-xs"
                    >
                      Hủy bỏ
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirmToggle}
                      disabled={isToggling}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl transition-all shadow-md cursor-pointer text-xs flex items-center justify-center gap-2"
                    >
                      {isToggling ? (
                        <span>Đang mở...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Xác nhận MỞ LẠI WEBSITE</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
