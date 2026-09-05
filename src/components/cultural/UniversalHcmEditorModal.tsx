import React, { useState, useEffect } from 'react';
import { X, Save, Edit3, ShieldCheck, Sparkles } from 'lucide-react';
import {
  HistoricalWork,
  VerifiedQuote,
  HistoricalAudio,
  FootstepLocation,
  ChanhHiepActionModel
} from '../../data/hcmVerifiedMuseumData';
import { BiographyChapter, EventCardSchema, CoverConfig } from '../../data/hcmGovernanceSchema';

export type EditableHcmItemType =
  | 'work'
  | 'quote'
  | 'audio'
  | 'footstep'
  | 'chanh_hiep_action'
  | 'front_initiative'
  | 'chapter'
  | 'event'
  | 'cover';

export interface UniversalHcmEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: EditableHcmItemType;
  itemData: any; // The initial item object
  onSave: (updatedItem: any) => void;
}

export const UniversalHcmEditorModal: React.FC<UniversalHcmEditorModalProps> = ({
  isOpen,
  onClose,
  itemType,
  itemData,
  onSave
}) => {
  const [formState, setFormState] = useState<any>({});

  useEffect(() => {
    if (itemData) {
      setFormState({ ...itemData });
    }
  }, [itemData, itemType]);

  if (!isOpen || !itemData) return null;

  const handleChange = (field: string, value: any) => {
    setFormState((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormState((prev: any) => {
      const arr = Array.isArray(prev[field]) ? [...prev[field]] : [];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const handleAddArrayItem = (field: string) => {
    setFormState((prev: any) => {
      const arr = Array.isArray(prev[field]) ? [...prev[field]] : [];
      arr.push('');
      return { ...prev, [field]: arr };
    });
  };

  const handleRemoveArrayItem = (field: string, index: number) => {
    setFormState((prev: any) => {
      const arr = Array.isArray(prev[field]) ? [...prev[field]] : [];
      arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState);
    onClose();
  };

  const renderFormFields = () => {
    switch (itemType) {
      case 'work':
        return (
          <>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tên tác phẩm</label>
              <input
                type="text"
                value={formState.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Năm ra đời / Thời gian</label>
                <input
                  type="text"
                  value={formState.year || ''}
                  onChange={(e) => handleChange('year', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Tập (Hồ Chí Minh Toàn tập)</label>
                <input
                  type="number"
                  value={formState.volume || 1}
                  onChange={(e) => handleChange('volume', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tóm tắt tác phẩm</label>
              <textarea
                rows={3}
                value={formState.summary || ''}
                onChange={(e) => handleChange('summary', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Hoàn cảnh ra đời</label>
              <textarea
                rows={2}
                value={formState.historicalContext || ''}
                onChange={(e) => handleChange('historicalContext', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
          </>
        );

      case 'quote':
        return (
          <>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Nội dung trích dẫn / Lời dạy của Bác</label>
              <textarea
                rows={4}
                value={formState.quoteText || ''}
                onChange={(e) => handleChange('quoteText', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white font-serif italic text-rose-950"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Bối cảnh / Sự kiện</label>
                <input
                  type="text"
                  value={formState.context || ''}
                  onChange={(e) => handleChange('context', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Năm</label>
                <input
                  type="text"
                  value={formState.year || ''}
                  onChange={(e) => handleChange('year', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Ý nghĩa lý luận &amp; thực tiễn</label>
              <textarea
                rows={2}
                value={formState.significance || ''}
                onChange={(e) => handleChange('significance', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
          </>
        );

      case 'audio':
        return (
          <>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tiêu đề bản ghi âm</label>
              <input
                type="text"
                value={formState.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Thời điểm / Ngày</label>
                <input
                  type="text"
                  value={formState.dateStr || ''}
                  onChange={(e) => handleChange('dateStr', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Thời lượng</label>
                <input
                  type="text"
                  value={formState.duration || ''}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Lời thoại ghi âm (Transcript)</label>
              <textarea
                rows={4}
                value={formState.transcript || ''}
                onChange={(e) => handleChange('transcript', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
          </>
        );

      case 'chanh_hiep_action':
        return (
          <>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tên mô hình / Hoạt động Chánh Hiệp</label>
              <input
                type="text"
                value={formState.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Đối tượng / Lực lượng</label>
                <input
                  type="text"
                  value={formState.targetGroup || ''}
                  onChange={(e) => handleChange('targetGroup', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Địa bàn / Khu phố</label>
                <input
                  type="text"
                  value={formState.neighborhood || ''}
                  onChange={(e) => handleChange('neighborhood', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Mô tả cách làm &amp; nội dung thực hiện</label>
              <textarea
                rows={3}
                value={formState.summary || ''}
                onChange={(e) => handleChange('summary', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Kết quả thực tiễn đạt được</label>
              <textarea
                rows={2}
                value={formState.practicalResult || ''}
                onChange={(e) => handleChange('practicalResult', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
          </>
        );

      case 'front_initiative':
        return (
          <>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tên Sáng kiến / Mô hình Tác nghiệp Mặt Trận</label>
              <input
                type="text"
                value={formState.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Đơn vị chủ trì / Thực hiện</label>
                <input
                  type="text"
                  value={formState.unit || ''}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Ngày / Thời điểm ban hành</label>
                <input
                  type="text"
                  value={formState.date || ''}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Chuyên đề Học Bác liên thông (Tên chủ đề hoặc ID)</label>
              <input
                type="text"
                value={formState.linkedHcmTopicTitle || ''}
                onChange={(e) => handleChange('linkedHcmTopicTitle', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                placeholder="VD: Dân vận khéo – Gần dân, sát việc, lo cho dân"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Mô tả tóm tắt giải pháp & cách làm</label>
              <textarea
                rows={3}
                value={formState.summary || ''}
                onChange={(e) => handleChange('summary', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Kết quả &amp; Tác động nổi bật</label>
              <textarea
                rows={2}
                value={formState.impact || ''}
                onChange={(e) => handleChange('impact', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
          </>
        );

      case 'chapter':
        return (
          <>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tên chương tiểu sử</label>
              <input
                type="text"
                value={formState.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Giai đoạn thời gian</label>
              <input
                type="text"
                value={formState.timeRange || ''}
                onChange={(e) => handleChange('timeRange', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tóm tắt chương</label>
              <textarea
                rows={3}
                value={formState.summary || ''}
                onChange={(e) => handleChange('summary', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Nội dung chi tiết chương</label>
              <textarea
                rows={5}
                value={formState.full_text || ''}
                onChange={(e) => handleChange('full_text', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
          </>
        );

      case 'event':
        return (
          <>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tên sự kiện lịch sử</label>
              <input
                type="text"
                value={formState.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Thời gian hiển thị</label>
                <input
                  type="text"
                  value={formState.date_display || ''}
                  onChange={(e) => handleChange('date_display', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Địa điểm</label>
                <input
                  type="text"
                  value={formState.location || ''}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tóm tắt sự kiện</label>
              <textarea
                rows={3}
                value={formState.summary || ''}
                onChange={(e) => handleChange('summary', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Nội dung đầy đủ</label>
              <textarea
                rows={4}
                value={formState.full_content || ''}
                onChange={(e) => handleChange('full_content', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
          </>
        );

      case 'footstep':
        return (
          <>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tên địa danh / Điểm dừng chân</label>
              <input
                type="text"
                value={formState.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Quốc gia / Lãnh thổ</label>
                <input
                  type="text"
                  value={formState.country || ''}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Thời gian (Năm)</label>
                <input
                  type="text"
                  value={formState.periodYears || ''}
                  onChange={(e) => handleChange('periodYears', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Bút danh / Tên gọi sử dụng</label>
              <input
                type="text"
                value={formState.aliasUsed || ''}
                onChange={(e) => handleChange('aliasUsed', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Hoạt động lịch sử chính</label>
              <textarea
                rows={3}
                value={formState.historicalAction || ''}
                onChange={(e) => handleChange('historicalAction', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
          </>
        );

      case 'cover':
        return (
          <>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tiêu đề chính không gian</label>
              <input
                type="text"
                value={formState.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tiêu đề phụ</label>
              <input
                type="text"
                value={formState.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Mô tả tổng quan</label>
              <textarea
                rows={3}
                value={formState.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Link Ảnh chân dung Bác Hồ</label>
              <input
                type="text"
                value={formState.portrait_url || ''}
                onChange={(e) => handleChange('portrait_url', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-rose-950/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-white via-rose-50/50 to-amber-50/30 rounded-3xl border-2 border-rose-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-800 via-pink-700 to-rose-900 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="text-sm font-bold tracking-wide">
                Chỉnh Sửa Trực Tiếp Dữ Liệu
              </h3>
              <p className="text-[10px] text-amber-200">
                Quyền Admin - Lưu thông tin tức thì vào Không gian Văn hóa Hồ Chí Minh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {renderFormFields()}

          {/* Buttons */}
          <div className="pt-4 border-t border-rose-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-rose-800 bg-rose-100 hover:bg-rose-200 transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-700 via-pink-600 to-rose-800 hover:brightness-110 shadow-md flex items-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Thông Tin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
