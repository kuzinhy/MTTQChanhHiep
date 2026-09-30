import React, { useState } from 'react';
import { 
  Download, Upload, ShieldCheck, AlertTriangle, CheckCircle2, 
  RefreshCw, Database, FileJson, X, Clock, FileCheck
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRefreshAllData: () => void;
}

export const SystemBackupRestoreModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onRefreshAllData
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportBackup = () => {
    setIsExporting(true);
    try {
      // Collect all critical localStorage tables
      const backupData: Record<string, any> = {
        exportedAt: new Date().toISOString(),
        version: '3.0',
        system: 'MTTQ_PHUONG_CHANH_HIEP',
        tables: {}
      };

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('chanh_hiep_') || key.startsWith('app_') || key.includes('documents') || key.includes('articles') || key.includes('opinions'))) {
          try {
            backupData.tables[key] = JSON.parse(localStorage.getItem(key) || '');
          } catch {
            backupData.tables[key] = localStorage.getItem(key);
          }
        }
      }

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `backup_mttq_chanh_hiep_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      alert('Có lỗi xảy ra trong quá trình xuất bản sao lưu.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        setIsImporting(true);
        const content = event.target?.result as string;
        const backupData = JSON.parse(content);

        if (!backupData || !backupData.tables) {
          throw new Error('Định dạng tệp sao lưu không hợp lệ.');
        }

        const tableKeys = Object.keys(backupData.tables);
        tableKeys.forEach(k => {
          const val = backupData.tables[k];
          localStorage.setItem(k, typeof val === 'object' ? JSON.stringify(val) : String(val));
        });

        setImportStatus(`Đã khôi phục thành công ${tableKeys.length} bảng dữ liệu!`);
        onRefreshAllData();
      } catch (err: any) {
        alert(`Lỗi khôi phục: ${err.message || 'Tệp không đúng cấu trúc'}`);
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Trung Tâm Sao Lưu & Khôi Phục Dữ Liệu</h3>
              <p className="text-xs text-slate-500">Bảo vệ và khôi phục toàn vẹn dữ liệu hệ thống Phường Chánh Hiệp</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {importStatus && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs font-bold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{importStatus}</span>
            </div>
          )}

          {/* 1. Export Section */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-800 text-sm">Xuất Bản Sao Lưu Hệ Thống (.JSON)</span>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                1-Click Export
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tải toàn bộ văn bản chỉ đạo, tin tức, cấu hình 21 khu phố, danh bạ cán bộ và sổ tay tri thức AI thành 1 file JSON lưu trữ an toàn trên máy tính.
            </p>
            <button
              onClick={handleExportBackup}
              disabled={isExporting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>{isExporting ? 'Đang xuất tệp sao lưu...' : 'Tải Về Bản Sao Lưu Ngay'}</span>
            </button>
          </div>

          {/* 2. Import Section */}
          <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-slate-800 text-sm">Khôi Phục Từ Tệp Sao Lưu</span>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                Restore
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nhập tệp JSON sao lưu trước đó để khôi phục lại trạng thái hệ thống khi cần thiết.
            </p>
            <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm">
              <Upload className="w-4 h-4" />
              <span>{isImporting ? 'Đang đọc và khôi phục...' : 'Chọn Tệp Sao Lưu Để Khôi Phục'}</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                disabled={isImporting}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Bảo mật & Chuẩn hóa dữ liệu
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
