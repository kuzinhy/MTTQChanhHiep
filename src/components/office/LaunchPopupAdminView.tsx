import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PartyPopper, 
  Sparkles, 
  Save, 
  Eye, 
  RotateCcw, 
  CheckCircle2, 
  Heart, 
  Calendar, 
  FileText, 
  Check, 
  Settings2,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { LaunchPopupConfig } from '../../types';
import { DEFAULT_LAUNCH_POPUP_CONFIG } from '../../data/launchPopupSeed';
import { AppStorageEngine } from '../../lib/storage';
import { CloudDatabase } from '../../lib/firestoreService';
import { LaunchCelebrationModal } from '../common/LaunchCelebrationModal';

interface LaunchPopupAdminViewProps {
  onTriggerToast: (title: string, message: string) => void;
}

export const LaunchPopupAdminView: React.FC<LaunchPopupAdminViewProps> = ({
  onTriggerToast
}) => {
  const [config, setConfig] = useState<LaunchPopupConfig>(() => {
    return AppStorageEngine.getLaunchPopupConfig();
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedConfig: LaunchPopupConfig = {
        ...config,
        updatedAt: new Date().toISOString()
      };

      // 1. Save to LocalStorage
      AppStorageEngine.saveLaunchPopupConfig(updatedConfig);

      // 2. Save to Firebase Firestore Cloud Database
      await CloudDatabase.saveLaunchPopupConfig(updatedConfig);

      setConfig(updatedConfig);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);

      onTriggerToast(
        'Đã lưu cấu hình Popup Ra Mắt',
        'Nội dung và trạng thái popup chúc mừng đã được đồng bộ hóa toàn hệ thống.'
      );
    } catch (err: any) {
      console.error('Save popup config error:', err);
      onTriggerToast('Lỗi lưu trữ', 'Không thể lưu cấu hình lên máy chủ đám mây.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Bạn có chắc chắn muốn nạp lại mẫu thư chúc mừng ra mắt chuẩn mặc định không?')) {
      setConfig({
        ...DEFAULT_LAUNCH_POPUP_CONFIG,
        congratulationsCount: config.congratulationsCount
      });
      onTriggerToast('Đã nạp mẫu chuẩn', 'Nội dung thư chúc mừng đã được điền lại theo mẫu chính thức.');
    }
  };

  const handleClearDismissCache = () => {
    AppStorageEngine.clearDismissLaunchPopup();
    onTriggerToast('Đã xóa bộ nhớ đệm', 'Popup sẽ tự động hiển thị lại khi người dùng vào Cổng thông tin.');
  };

  const handleAdjustCount = (delta: number) => {
    const newCount = Math.max(0, (config.congratulationsCount || 0) + delta);
    setConfig(prev => ({ ...prev, congratulationsCount: newCount }));
  };

  const insertSnippet = (snippet: string) => {
    setConfig(prev => ({
      ...prev,
      messageHtml: prev.messageHtml ? `${prev.messageHtml}\n\n${snippet}` : snippet
    }));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-700 via-rose-700 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <PartyPopper className="w-64 h-64" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/25 border border-amber-300/40 text-amber-200 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sự Kiện Lễ Ra Mắt Chính Thức</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Quản Trị Popup Chúc Mừng Ra Mắt
            </h1>
            <p className="text-xs sm:text-sm text-red-100 max-w-2xl leading-relaxed">
              Thiết lập thông điệp chào mừng trang trọng, bật/tắt hiển thị tự động và theo dõi lượt người dân gửi lời chúc mừng khi truy cập Cổng Thông Tin Điện Tử.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all flex items-center gap-2 border border-white/20 cursor-pointer shadow-sm"
            >
              <Eye className="w-4 h-4 text-amber-300" />
              <span>Xem Trước Popup (Live Preview)</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all flex items-center gap-2 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-800" />
                  <span>Đã Lưu Xong!</span>
                </>
              ) : isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang Lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-slate-900" />
                  <span>Lưu Cấu Hình Toàn Hệ Thống</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Trạng Thái Hiển Thị</p>
            <p className="text-lg font-black text-slate-900">
              {config.enabled ? 'Đang Bật Hiển Thị' : 'Đang Tắt'}
            </p>
            <p className="text-[11px] text-slate-500">
              {config.enabled ? 'Tự động mở khi truy cập' : 'Ẩn khỏi người dùng'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              config.enabled ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                config.enabled ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Card 2: Congratulations Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Lượt Chúc Mừng</p>
            <p className="text-lg font-black text-rose-600 flex items-center gap-1.5">
              <Heart className="w-5 h-5 fill-rose-600" />
              <span>{config.congratulationsCount || 0}</span>
            </p>
            <div className="flex items-center gap-1 pt-1">
              <button
                type="button"
                onClick={() => handleAdjustCount(-10)}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                -10
              </button>
              <button
                type="button"
                onClick={() => handleAdjustCount(10)}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                +10
              </button>
              <button
                type="button"
                onClick={() => handleAdjustCount(50)}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer"
              >
                +50
              </button>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 fill-rose-500" />
          </div>
        </div>

        {/* Card 3: Launch Date */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Thời Khắc Ra Mắt</p>
            <p className="text-base font-black text-slate-900 truncate">
              {config.launchDate || 'Tháng 10/2026'}
            </p>
            <p className="text-[11px] text-slate-500">
              {config.showConfetti ? 'Có pháo hoa chúc mừng' : 'Tắt hiệu ứng pháo hoa'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Last Updated */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Lần Cập Nhật Cuối</p>
            <p className="text-xs font-black text-slate-900">
              {config.updatedAt ? new Date(config.updatedAt).toLocaleString('vi-VN') : 'Mặc định ban đầu'}
            </p>
            <button
              type="button"
              onClick={handleClearDismissCache}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
            >
              Xóa cache đã đóng trên máy này
            </button>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Configuration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Controls (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                <span>Nội Dung Thư Chúc Mừng & Thông Điệp</span>
              </h2>

              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nạp Mẫu Chuẩn MTTQ</span>
              </button>
            </div>

            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tiêu đề chính của Popup *</label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  placeholder="Ví dụ: THƯ CHÀO MỪNG RA MẮT CỔNG THÔNG TIN ĐIỆN TỬ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Đơn vị ban hành (Tiêu đề phụ)</label>
                <input
                  type="text"
                  value={config.subtitle}
                  onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                  placeholder="Ví dụ: ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Slogan & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Khẩu hiệu hành động (Slogan)</label>
                <input
                  type="text"
                  value={config.slogan}
                  onChange={(e) => setConfig({ ...config, slogan: e.target.value })}
                  placeholder="Ví dụ: ĐOÀN KẾT - DÂN CHỦ - ĐỔI MỚI - SÁNG TẠO - PHÁT TRIỂN"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Huy hiệu trên cùng (Badge)</label>
                <input
                  type="text"
                  value={config.badgeText || ''}
                  onChange={(e) => setConfig({ ...config, badgeText: e.target.value })}
                  placeholder="Ví dụ: CHÍNH THỨC VẬN HÀNH • PHỤC VỤ NHÂN DÂN"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Full Letter Body Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Toàn văn Nội dung Thư Chúc Mừng & Lời Kêu Gọi *
                </label>
                <span className="text-[11px] text-slate-400">
                  Các đoạn cách nhau bằng một dòng trống; dòng bắt đầu bằng "1.", "-", "*" sẽ tự thành gạch đầu dòng.
                </span>
              </div>

              {/* Quick Snippet Insert Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-500 font-bold">Chèn nhanh:</span>
                <button
                  type="button"
                  onClick={() => insertSnippet('Kính gửi: Toàn thể đồng bào, cán bộ, đảng viên, đoàn viên, hội viên và nhân dân Phường Chánh Hiệp thân mến!')}
                  className="px-2 py-0.5 rounded text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
                >
                  + Lời kính gửi
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('1. Tiếp cận nhanh chóng tin tức, phong trào thi đua tại 21 khu phố.\n2. Gửi phản ánh, kiến nghị, hiến kế dân sinh 24/7.\n3. Tra cứu văn bản và thủ tục hành chính một cửa trực tuyến.\n4. Trải nghiệm Không gian Văn hóa Hồ Chí Minh 3D.')}
                  className="px-2 py-0.5 rounded text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
                >
                  + 4 Tiện ích trọng tâm
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('Kính chúc toàn thể bà con và gia đình luôn dồi dào sức khỏe, hạnh phúc, chung sức đồng lòng xây dựng Phường Chánh Hiệp ngày càng văn minh, giàu đẹp, nghĩa tình!')}
                  className="px-2 py-0.5 rounded text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
                >
                  + Lời chúc kết thư
                </button>
              </div>

              <textarea
                rows={11}
                value={config.messageHtml}
                onChange={(e) => setConfig({ ...config, messageHtml: e.target.value })}
                className="w-full p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-sans leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                placeholder="Nhập toàn văn thư chúc mừng..."
              />
            </div>

            {/* Signature & Signer Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Đơn vị ký tên</label>
                <input
                  type="text"
                  value={config.senderTitle}
                  onChange={(e) => setConfig({ ...config, senderTitle: e.target.value })}
                  placeholder="TM. BAN THƯỜNG TRỰC ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Chức danh / Người ký</label>
                <input
                  type="text"
                  value={config.senderName}
                  onChange={(e) => setConfig({ ...config, senderName: e.target.value })}
                  placeholder="Chủ tịch Ủy ban MTTQ Việt Nam Phường"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings & CTA Controls (1 col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Settings2 className="w-5 h-5 text-amber-600" />
              <span>Thiết Lập Tương Tác & Giao Diện</span>
            </h2>

            {/* Master Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Bật Popup Tự Động</p>
                <p className="text-[11px] text-slate-500">Hiển thị khi người dân vào Cổng TT</p>
              </div>
              <button
                type="button"
                onClick={() => setConfig({ ...config, enabled: !config.enabled })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  config.enabled ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    config.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Confetti & Fireworks Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Hiệu Ứng Pháo Hoa / Confetti</p>
                <p className="text-[11px] text-slate-500">Bắn hoa rực rỡ khi mở popup & thả tim</p>
              </div>
              <button
                type="button"
                onClick={() => setConfig({ ...config, showConfetti: !config.showConfetti })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  config.showConfetti ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    config.showConfetti ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Launch Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Mốc thời gian ra mắt</label>
              <input
                type="text"
                value={config.launchDate}
                onChange={(e) => setConfig({ ...config, launchDate: e.target.value })}
                placeholder="Ví dụ: Tháng 10/2026 hoặc 10/10/2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Primary Action Button Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Chữ trên nút hành động chính</label>
              <input
                type="text"
                value={config.primaryButtonText}
                onChange={(e) => setConfig({ ...config, primaryButtonText: e.target.value })}
                placeholder="Ví dụ: Khám Phá Cổng Thông Tin Ngay"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
              />
            </div>

            {/* Action behavior */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Hành vi khi bấm nút</label>
              <select
                value={config.primaryButtonAction}
                onChange={(e: any) => setConfig({ ...config, primaryButtonAction: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              >
                <option value="EXPLORE">Khám phá tổng quan (Đóng & xem trang chủ)</option>
                <option value="OPEN_ABOUT">Chuyển sang trang Giới thiệu & Cơ cấu</option>
                <option value="SCROLL_NEWS">Chuyển sang chuyên mục Tin tức & Hoạt động</option>
              </select>
            </div>

            {/* Banner Logo Image */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Logo / Huy hiệu đại diện</label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl border border-slate-200 p-1 flex items-center justify-center bg-slate-50 shrink-0">
                  <img
                    src={config.bannerImageUrl || DEFAULT_LAUNCH_POPUP_CONFIG.bannerImageUrl}
                    alt="Logo"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <input
                  type="text"
                  value={config.bannerImageUrl || ''}
                  onChange={(e) => setConfig({ ...config, bannerImageUrl: e.target.value })}
                  placeholder="URL ảnh Logo Mặt trận..."
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Save Buttons */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Đã Lưu Xong Thành Công!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Lưu Cấu Hình Toàn Hệ Thống</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="w-full py-2.5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-blue-600" />
                <span>Xem Trước Giao Diện Thực Tế</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      <LaunchCelebrationModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        config={config}
        onCongratulate={() => {
          handleAdjustCount(1);
          onTriggerToast('Thả tim thành công!', 'Đã tăng lượt chúc mừng trong bản xem trước.');
        }}
        hasCongratulated={false}
        onNavigateAction={(action) => {
          onTriggerToast('Hành động chuyển tiếp', `Nút chính được cấu hình điều hướng tới: ${action}`);
        }}
      />
    </div>
  );
};
