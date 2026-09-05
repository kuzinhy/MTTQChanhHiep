import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export const SecurityNoticeBanner: React.FC = () => {
  return (
    <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900 shadow-2xs">
      <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <span className="font-bold">CẢNH BÁO BẢO MẬT & AN TOÀN THÔNG TIN: </span>
        <span>
          Không nhập hoặc upload tài liệu thuộc danh mục Bí mật nhà nước (Mật, Tối mật, Tuyệt mật) vào trợ lý AI. Mọi dữ liệu thao tác được bảo mật và tự động ghi nhật ký tham mưu.
        </span>
      </div>
    </div>
  );
};
