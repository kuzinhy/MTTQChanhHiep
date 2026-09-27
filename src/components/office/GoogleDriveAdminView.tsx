import React from 'react';
import { HardDrive, ExternalLink, FolderGit2, ShieldCheck, Database, Cloud, FileText, Sparkles, Folder, Lock, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ChanhHiepDriveFolderBar } from './ChanhHiepDriveFolderBar';

export const GoogleDriveAdminView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-blue-800/40">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                Quản trị Hệ thống
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Google Drive Cloud Storage
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              Cơ Chế Lưu Trữ Google Drive
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Hệ thống lưu trữ điện toán đám mây với 7 thư mục số hóa chuẩn hóa thuộc cấu trúc <strong>DuAn &gt; ChanhHiep</strong> trên Google Drive. Phục vụ đính kèm, trích xuất văn bản, hình ảnh và tài liệu công tác Mặt trận Phường Chánh Hiệp.
            </p>
          </div>

          <a
            href="https://drive.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 shrink-0 border border-blue-400/30"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Mở Google Drive Tổng</span>
          </a>
        </div>
      </div>

      {/* Main Interactive Folder Selector & Quick Action Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                7 Thư Mục Chuẩn Phường Chánh Hiệp
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Cấu trúc đường dẫn: <code className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-mono text-[11px]">Drive của tôi &gt; DuAn &gt; ChanhHiep</code>
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            7 Thư mục lưu trữ
          </span>
        </div>

        {/* Render Folder Cards Bar */}
        <ChanhHiepDriveFolderBar />
      </div>

      {/* Storage Architecture & Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Cloud Sync */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Cloud className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Đồng Bộ &amp; Lưu Trữ Tự Động</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Các văn bản, quyết định, tài liệu tuyên truyền và hình ảnh khi tải lên qua Văn phòng Số sẽ được phân loại và tự động liên kết với thư mục chuẩn trên Google Drive.
          </p>
          <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            <span>Trạng thái kết nối: Hoạt động bình thường</span>
          </div>
        </div>

        {/* Card 2: Security */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Phân Quyền &amp; Bảo Mật Dữ Liệu</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mỗi thư mục được phân quyền chi tiết cho Ban Thường trực, Ban Biên tập và Cán bộ chuyên trách. Đảm bảo an toàn thông tin và quyền truy cập văn bản.
          </p>
          <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-blue-600">
            <ShieldCheck className="w-4 h-4" />
            <span>Cấp độ mã hóa: Chống sửa đổi trái phép</span>
          </div>
        </div>

        {/* Card 3: OCR AI & OCR Processing */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Thư Mục Tiếp Nhận Nhanh (uploadvb)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Thư mục <code className="bg-slate-100 text-amber-800 px-1 py-0.5 rounded text-[11px]">/uploadvb</code> đóng vai trò là hộp thư số tiếp nhận các tệp quét, văn bản scan để AI OCR hỗ trợ trích xuất số hiệu, trích yếu tự động.
          </p>
          <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-amber-600">
            <Sparkles className="w-4 h-4" />
            <span>Hỗ trợ OCR AI thông minh</span>
          </div>
        </div>
      </div>
    </div>
  );
};
