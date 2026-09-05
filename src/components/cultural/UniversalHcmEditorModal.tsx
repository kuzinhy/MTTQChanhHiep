import React, { useState, useEffect } from 'react';
import { X, Save, Edit3, ShieldCheck, Sparkles, Image as ImageIcon, Upload, Trash2, Star } from 'lucide-react';
import {
  HistoricalWork,
  VerifiedQuote,
  HistoricalAudio,
  FootstepLocation,
  ChanhHiepActionModel
} from '../../data/hcmVerifiedMuseumData';
import { BiographyChapter, EventCardSchema, CoverConfig } from '../../data/hcmGovernanceSchema';
import { OptimizedImage } from '../common/OptimizedImage';

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

const ImageInputWithPreview: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder = 'Dán đường dẫn URL ảnh (https://...) hoặc bấm Tải ảnh từ máy' }) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước tập tin ảnh vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-1.5 p-3 rounded-2xl bg-rose-50/80 border border-rose-200/90 shadow-2xs">
      <label className="block text-xs font-bold text-rose-950 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-rose-700" />
          <span>{label}</span>
        </span>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[10px] text-rose-700 hover:text-rose-900 hover:underline flex items-center gap-1 font-semibold"
          >
            <Trash2 className="w-3 h-3" />
            <span>Xóa ảnh</span>
          </button>
        )}
      </label>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-1.5 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white text-slate-800"
        />
        <label className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-105 text-rose-950 font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs">
          <Upload className="w-3.5 h-3.5" />
          <span>Tải ảnh</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {value && (
        <div className="relative h-32 w-full mt-2 rounded-xl overflow-hidden border border-rose-300/80 bg-slate-900 flex items-center justify-center group">
          <OptimizedImage
            src={value}
            alt="Preview Avatar"
            variant="card"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold">
            Xem trước ảnh đại diện
          </div>
        </div>
      )}
    </div>
  );
};

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState);
    onClose();
  };

  const renderFormFields = () => {
    switch (itemType) {
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

            <ImageInputWithPreview
              label="Ảnh đại diện / Link ảnh minh họa mô hình"
              value={formState.imageUrl || ''}
              onChange={(val) => handleChange('imageUrl', val)}
            />

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
              <label className="block text-xs font-bold text-rose-900 mb-1">Lời Bác dạy / Kim chỉ nam truyền cảm hứng</label>
              <textarea
                rows={2}
                value={formState.inspirationalQuote || ''}
                onChange={(e) => handleChange('inspirationalQuote', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white italic font-serif"
                placeholder="VD: Dân vận khéo thì việc gì cũng thành công..."
              />
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
              <label className="block text-xs font-bold text-rose-900 mb-1">Tên Sáng kiến / Bài viết Mô hình Mặt Trận</label>
              <input
                type="text"
                value={formState.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white font-bold text-slate-900"
                placeholder="VD: Mô hình 'Tổ Đoàn Kết Số 4.0' tại 21 Khu phố..."
                required
              />
            </div>

            <ImageInputWithPreview
              label="Ảnh đại diện mô hình / Hình ảnh đại diện chính thức (Link hoặc Tải ảnh)"
              value={formState.imageUrl || ''}
              onChange={(val) => handleChange('imageUrl', val)}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Đơn vị chủ trì / Thực hiện</label>
                <input
                  type="text"
                  value={formState.unit || ''}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                  placeholder="VD: Ban CTMTKP 5"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Tác giả / Người soạn thảo</label>
                <input
                  type="text"
                  value={formState.author || ''}
                  onChange={(e) => handleChange('author', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                  placeholder="VD: Ban Biên tập Mặt Trận Phường"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Ngày / Thời điểm ban hành</label>
                <input
                  type="text"
                  value={formState.date || ''}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Trạng thái xuất bản</label>
                <select
                  value={formState.status || 'PUBLISHED'}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white font-bold"
                >
                  <option value="PUBLISHED">🟢 Đã xuất bản (Công khai)</option>
                  <option value="DRAFT">🔴 Bản nháp (Nội bộ)</option>
                  <option value="ARCHIVED">📦 Lưu trữ</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <input
                type="checkbox"
                id="isFeaturedInit"
                checked={!!formState.isFeatured}
                onChange={(e) => handleChange('isFeatured', e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="isFeaturedInit" className="text-xs font-bold text-amber-950 cursor-pointer select-none">
                Ghim làm Sáng kiến Nổi bật (Hiển thị ưu tiên hàng đầu)
              </label>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50/60 to-rose-50 border-2 border-rose-300/80 shadow-2xs">
              <input
                type="checkbox"
                id="postToHcmSpace"
                checked={formState.postToHcmSpace ?? true}
                onChange={(e) => handleChange('postToHcmSpace', e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer accent-rose-600 shrink-0"
              />
              <label htmlFor="postToHcmSpace" className="text-xs font-black text-rose-950 cursor-pointer select-none leading-tight flex items-center gap-1.5 flex-wrap">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 inline shrink-0" />
                <span>Đăng vào Không gian Văn hóa Hồ Chí Minh</span>
                <span className="text-[10px] font-extrabold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">
                  Phòng: Chánh Hiệp Học Tập Và Làm Theo Bác
                </span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Chuyên đề Học Bác liên thông (Tên chủ đề)</label>
              <input
                type="text"
                value={formState.linkedHcmTopicTitle || ''}
                onChange={(e) => handleChange('linkedHcmTopicTitle', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                placeholder="VD: Dân vận khéo – Gần dân, sát việc, lo cho dân"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Mô tả tóm tắt giải pháp &amp; cách làm</label>
              <textarea
                rows={2}
                value={formState.summary || ''}
                onChange={(e) => handleChange('summary', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                placeholder="Mô tả tóm tắt nội dung giải pháp tác nghiệp và cách làm hay..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Nội dung chi tiết bài viết &amp; Quy trình triển khai</label>
              <textarea
                rows={5}
                value={formState.fullContent || ''}
                onChange={(e) => handleChange('fullContent', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                placeholder="Nhập toàn bộ nội dung chi tiết bài viết, các bước thực hiện, phân công trách nhiệm..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Kết quả &amp; Tác động nổi bật</label>
              <textarea
                rows={2}
                value={formState.impact || ''}
                onChange={(e) => handleChange('impact', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                placeholder="Hiệu quả thiết thực mang lại cho nhân dân địa phương..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Thẻ phân loại (Cách nhau bởi dấu phẩy)</label>
              <input
                type="text"
                value={Array.isArray(formState.tags) ? formState.tags.join(', ') : (formState.tags || '')}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                  handleChange('tags', arr);
                }}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                placeholder="Chuyển đổi số, Dân nguyện, Khu phố số, Làm theo Bác"
              />
            </div>
          </>
        );

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

            <ImageInputWithPreview
              label="Ảnh bìa tác phẩm / Tư liệu"
              value={formState.imageUrl || ''}
              onChange={(val) => handleChange('imageUrl', val)}
            />

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

            <ImageInputWithPreview
              label="Ảnh tư liệu / Chân dung Bác giai đoạn này"
              value={formState.imageUrl || ''}
              onChange={(val) => handleChange('imageUrl', val)}
            />

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

            <ImageInputWithPreview
              label="Ảnh minh họa / Tư liệu sự kiện"
              value={formState.imageUrl || ''}
              onChange={(val) => handleChange('imageUrl', val)}
            />

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

            <ImageInputWithPreview
              label="Ảnh tư liệu địa danh / Bác Hồ dừng chân"
              value={formState.imageUrl || ''}
              onChange={(val) => handleChange('imageUrl', val)}
            />

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

            <ImageInputWithPreview
              label="Ảnh chân dung Bác Hồ / Ảnh bìa không gian văn hóa"
              value={formState.portrait_url || formState.imageUrl || ''}
              onChange={(val) => {
                handleChange('portrait_url', val);
                handleChange('imageUrl', val);
              }}
            />

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

            <ImageInputWithPreview
              label="Ảnh minh họa / Tư liệu trích dẫn"
              value={formState.imageUrl || ''}
              onChange={(val) => handleChange('imageUrl', val)}
            />

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

            <ImageInputWithPreview
              label="Ảnh đại diện / Tư liệu bản ghi âm"
              value={formState.imageUrl || ''}
              onChange={(val) => handleChange('imageUrl', val)}
            />

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
                Chỉnh Sửa Trực Tiếp Dữ Liệu &amp; Ảnh Đại Diện
              </h3>
              <p className="text-[10px] text-amber-200">
                Quyền Admin - Cập nhật thông tin &amp; Ảnh đại diện vào Không gian Văn hóa HCM
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
