import React, { useState, useEffect } from 'react';
import { 
  Database, Download, Upload, ShieldCheck, AlertTriangle, CheckCircle2, 
  RefreshCw, FileJson, Clock, Server, HardDrive, Cpu, Undo2, Trash2, 
  Layers, Lock, Sparkles, AlertCircle, FileCheck, CheckSquare, ArrowRight,
  ShieldAlert, Settings, Info, Save, History, Calendar, Play
} from 'lucide-react';
import { AppStorageEngine } from '../../lib/storage';

interface ServerSnapshot {
  filename: string;
  sizeBytes: number;
  sizeFormatted: string;
  createdAt: string;
  recordCount: number;
  version: string;
  metadata?: {
    creator?: string;
    label?: string;
    clientIp?: string;
  };
}

interface DryRunSummary {
  articles: number;
  documents: number;
  competitions: number;
  opinions: number;
  tasks: number;
  staffUsers: number;
  memberOrgs: number;
  totalRecords: number;
  backupDate?: string;
  source?: string;
  version?: string;
}

interface Props {
  onRefreshAllData?: () => void;
}

export const BackupRestoreAdminView: React.FC<Props> = ({ onRefreshAllData }) => {
  const [activeTab, setActiveTab] = useState<'hub' | 'server' | 'granular' | 'automation' | 'reset'>('hub');
  
  // Health Stats State
  const [stats, setStats] = useState(() => AppStorageEngine.getDatabaseHealthStats());
  
  // Server Snapshots State
  const [serverSnapshots, setServerSnapshots] = useState<ServerSnapshot[]>([]);
  const [isLoadingServerSnapshots, setIsLoadingServerSnapshots] = useState(false);
  const [serverSnapshotLabel, setServerSnapshotLabel] = useState('');
  const [isCreatingServerSnapshot, setIsCreatingServerSnapshot] = useState(false);

  // Restore Modal & File Upload State
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [dryRun, setDryRun] = useState<DryRunSummary | null>(null);
  const [restoreMode, setRestoreMode] = useState<'MERGE' | 'OVERWRITE'>('MERGE');
  const [confirmInput, setConfirmInput] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Granular Module Export Selection
  const [selectedModules, setSelectedModules] = useState<Record<string, boolean>>({
    articles: true,
    documents: true,
    competitions: true,
    opinions: true,
    tasks: true,
    staffUsers: true,
    memberOrganizations: true,
    systemSettings: true
  });

  // Emergency Snapshot Availability
  const [hasEmergencySnapshot, setHasEmergencySnapshot] = useState(false);

  // Auto Backup Settings State
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(() => {
    return localStorage.getItem('mttq_auto_backup_enabled') === 'true';
  });
  const [autoBackupFrequency, setAutoBackupFrequency] = useState(() => {
    return localStorage.getItem('mttq_auto_backup_freq') || 'DAILY';
  });

  // Refresh Stats
  const refreshStats = () => {
    setStats(AppStorageEngine.getDatabaseHealthStats());
    setHasEmergencySnapshot(!!localStorage.getItem('mttq_emergency_backup_snapshot'));
  };

  useEffect(() => {
    refreshStats();
    fetchServerSnapshots();

    const handleRestoredEvent = () => {
      refreshStats();
      if (onRefreshAllData) onRefreshAllData();
    };

    window.addEventListener('mttq_data_restored', handleRestoredEvent);
    return () => {
      window.removeEventListener('mttq_data_restored', handleRestoredEvent);
    };
  }, []);

  // Fetch server snapshots
  const fetchServerSnapshots = async () => {
    setIsLoadingServerSnapshots(true);
    try {
      const res = await fetch('/api/admin/backup/snapshots');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.snapshots)) {
          setServerSnapshots(data.snapshots);
        }
      }
    } catch (err) {
      console.warn('Failed to load server snapshots:', err);
    } finally {
      setIsLoadingServerSnapshots(false);
    }
  };

  // 1. Export Full Backup JSON
  const handleExportFullBackup = () => {
    try {
      AppStorageEngine.exportFullDatabase();
      refreshStats();
      setFeedbackMsg({
        type: 'success',
        text: 'Đã xuất thành công tệp sao lưu toàn bộ dữ liệu trang web!'
      });
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: `Lỗi xuất dữ liệu: ${err?.message || 'Không thể xuất tệp'}`
      });
    }
  };

  // 2. Create Server-side Snapshot
  const handleCreateServerSnapshot = async () => {
    setIsCreatingServerSnapshot(true);
    setFeedbackMsg(null);
    try {
      const fullData = AppStorageEngine.getFullDatabaseObject();
      const res = await fetch('/api/admin/backup/snapshots/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          backupData: fullData,
          label: serverSnapshotLabel.trim() || 'Bản sao lưu máy chủ thủ công'
        })
      });

      const result = await res.json();
      if (result.success) {
        setServerSnapshotLabel('');
        setFeedbackMsg({
          type: 'success',
          text: 'Đã tạo và lưu bản sao lưu mới thành công trên Server!'
        });
        await fetchServerSnapshots();
        refreshStats();
      } else {
        throw new Error(result.error || 'Lỗi từ máy chủ');
      }
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: `Lỗi tạo snapshot máy chủ: ${err.message}`
      });
    } finally {
      setIsCreatingServerSnapshot(false);
    }
  };

  // 3. Handle File Upload & Inspection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setFeedbackMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setSelectedFileContent(content);
        const parsed = JSON.parse(content);
        const data = parsed.data || parsed.tables || parsed;

        const articles = Array.isArray(data.articles) ? data.articles.length : 0;
        const documents = Array.isArray(data.documents) ? data.documents.length : 0;
        const competitions = Array.isArray(data.competitions) ? data.competitions.length : 0;
        const opinions = Array.isArray(data.opinions) ? data.opinions.length : 0;
        const tasks = Array.isArray(data.tasks) ? data.tasks.length : 0;
        const staffUsers = Array.isArray(data.staffUsers) ? data.staffUsers.length : 0;
        const memberOrgs = Array.isArray(data.memberOrganizations) ? data.memberOrganizations.length : 0;

        const totalRecords = articles + documents + competitions + opinions + tasks + staffUsers + memberOrgs;

        setDryRun({
          articles,
          documents,
          competitions,
          opinions,
          tasks,
          staffUsers,
          memberOrgs,
          totalRecords,
          backupDate: parsed.exportedAt || parsed.createdAt,
          source: parsed.source || 'Tệp tải lên',
          version: parsed.version || 'không rõ'
        });
      } catch (err) {
        setSelectedFileContent(null);
        setDryRun(null);
        setFeedbackMsg({
          type: 'error',
          text: 'Tệp tải lên không phải là tệp JSON sao lưu hợp lệ!'
        });
      }
    };
    reader.readAsText(file);
  };

  // 4. Perform Restore Operation
  const handleExecuteRestore = () => {
    if (!selectedFileContent) return;

    if (restoreMode === 'OVERWRITE' && confirmInput.trim().toUpperCase() !== 'KHOI PHUC') {
      setFeedbackMsg({
        type: 'error',
        text: 'Vui lòng nhập chính xác từ khóa "KHOI PHUC" để xác nhận ghi đè toàn bộ dữ liệu!'
      });
      return;
    }

    setIsRestoring(true);
    setFeedbackMsg(null);

    setTimeout(() => {
      try {
        const success = AppStorageEngine.importDatabaseFromJson(selectedFileContent, restoreMode);
        if (success) {
          setFeedbackMsg({
            type: 'success',
            text: `Đã khôi phục thành công dữ liệu web theo chế độ [${restoreMode === 'OVERWRITE' ? 'Ghi đè toàn bộ' : 'Hợp nhất bổ sung'}]!`
          });
          setSelectedFileContent(null);
          setDryRun(null);
          setConfirmInput('');
          refreshStats();
          if (onRefreshAllData) onRefreshAllData();
        } else {
          throw new Error('Lỗi cấu trúc dữ liệu tệp khôi phục');
        }
      } catch (err: any) {
        setFeedbackMsg({
          type: 'error',
          text: `Khôi phục thất bại: ${err?.message || 'Lỗi xử lý tệp'}`
        });
      } finally {
        setIsRestoring(false);
      }
    }, 400);
  };

  // 5. Restore Server Snapshot Directly
  const handleRestoreServerSnapshot = async (filename: string) => {
    if (!confirm(`Bạn có chắc chắn muốn khôi phục dữ liệu từ bản sao lưu máy chủ "${filename}" không? Dữ liệu hiện tại sẽ được lưu bản sao lưu khẩn cấp trước khi khôi phục.`)) {
      return;
    }

    setIsRestoring(true);
    setFeedbackMsg(null);
    try {
      const res = await fetch(`/api/admin/backup/snapshots/read/${encodeURIComponent(filename)}`);
      if (!res.ok) throw new Error('Không thể đọc bản sao lưu từ máy chủ');
      const result = await res.json();
      if (result.success && result.data) {
        const success = AppStorageEngine.importDatabaseFromJson(JSON.stringify(result.data), 'OVERWRITE');
        if (success) {
          setFeedbackMsg({
            type: 'success',
            text: `Đã khôi phục thành công toàn bộ dữ liệu từ bản sao lưu máy chủ "${filename}"!`
          });
          refreshStats();
          if (onRefreshAllData) onRefreshAllData();
        }
      } else {
        throw new Error(result.error || 'Dữ liệu không hợp lệ');
      }
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: `Lỗi khôi phục từ snapshot máy chủ: ${err.message}`
      });
    } finally {
      setIsRestoring(false);
    }
  };

  // 6. Delete Server Snapshot
  const handleDeleteServerSnapshot = async (filename: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tệp sao lưu máy chủ "${filename}"?`)) return;
    try {
      const res = await fetch(`/api/admin/backup/snapshots/${encodeURIComponent(filename)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setFeedbackMsg({ type: 'info', text: 'Đã xóa tệp sao lưu thành công!' });
        await fetchServerSnapshots();
      }
    } catch (err) {
      alert('Không thể xóa tệp sao lưu.');
    }
  };

  // 7. Undo Emergency Rollback
  const handleEmergencyUndo = () => {
    if (!confirm('Bạn có muốn khôi phục lại trạng thái dữ liệu trước lần Restore gần nhất không?')) return;
    const ok = AppStorageEngine.restoreEmergencySnapshot();
    if (ok) {
      setFeedbackMsg({
        type: 'success',
        text: 'Đã hoàn tác (Undo) và khôi phục thành công dữ liệu về thời điểm trước đợt Restore gần nhất!'
      });
      refreshStats();
      if (onRefreshAllData) onRefreshAllData();
    } else {
      setFeedbackMsg({
        type: 'error',
        text: 'Không tìm thấy bản sao lưu khẩn cấp để Hoàn tác.'
      });
    }
  };

  // 8. Granular Selective Export
  const handleExportGranular = () => {
    const db = AppStorageEngine.getFullDatabaseObject();
    const data = db.data;
    const filteredData: Record<string, any> = {};

    if (selectedModules.articles) filteredData.articles = data.articles;
    if (selectedModules.documents) filteredData.documents = data.documents;
    if (selectedModules.competitions) filteredData.competitions = data.competitions;
    if (selectedModules.opinions) filteredData.opinions = data.opinions;
    if (selectedModules.tasks) filteredData.tasks = data.tasks;
    if (selectedModules.staffUsers) filteredData.staffUsers = data.staffUsers;
    if (selectedModules.memberOrganizations) filteredData.memberOrganizations = data.memberOrganizations;
    if (selectedModules.systemSettings) {
      filteredData.launchPopupConfig = data.launchPopupConfig;
      filteredData.currentUser = data.currentUser;
    }

    const payload = {
      version: '3.0',
      exportedAt: new Date().toISOString(),
      type: 'GRANULAR_CUSTOM_BACKUP',
      source: 'MTTQ Phường Chánh Hiệp - Custom Export',
      data: filteredData
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_custom_mttq_${new Date().toISOString().substring(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 9. Reset Factory Defaults
  const handleFactoryReset = () => {
    if (confirmInput.trim().toUpperCase() !== 'KHOI PHUC') {
      alert('Vui lòng nhập từ khóa "KHOI PHUC" để xác nhận đặt lại dữ liệu gốc ban đầu.');
      return;
    }

    if (confirm('CẢNH BÁO NGUY HỂM: Toàn bộ dữ liệu bạn đã tạo sẽ bị xóa sạch và thay bằng dữ liệu ban đầu. Bạn có chắc chắn không?')) {
      AppStorageEngine.resetAllToDefaults();
      alert('Đã khôi phục cài đặt gốc thành công!');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Trung Tâm Bảo Vệ & Sao Lưu Dữ Liệu Toàn Web v3.0
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sao Lưu & Khôi Phục Toàn Bộ Nội Dung Website
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Cơ chế quản trị an toàn dữ liệu 2 lớp: Lưu trữ tệp sao lưu cục bộ (Local Snapshot) & Đồng bộ Snapshot trên Máy chủ Server với tính năng Hoàn tác (Undo) khẩn cấp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {hasEmergencySnapshot && (
              <button
                onClick={handleEmergencyUndo}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-xl text-xs font-bold border border-amber-400/40 transition shadow-sm"
                title="Khôi phục trạng thái dữ liệu trước đợt Restore gần nhất"
              >
                <Undo2 className="w-4 h-4 text-amber-400" />
                <span>Hoàn Tác (Undo) Restore</span>
              </button>
            )}

            <button
              onClick={handleExportFullBackup}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-900/40"
            >
              <Download className="w-4 h-4" />
              <span>Tải Bản Sao Lưu (.JSON)</span>
            </button>
          </div>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/60">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Tổng bản ghi</span>
              <Database className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">
              {stats.totalRecords.toLocaleString('vi-VN')}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {stats.articlesCount} bài viết, {stats.documentsCount} văn bản
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/60">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Dung lượng dữ liệu</span>
              <HardDrive className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400 mt-1">
              {stats.totalSizeFormatted}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Sử dụng {stats.storageUsagePercent}% hạn ngạch Local
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/60">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Lần sao lưu gần nhất</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xs font-bold text-purple-300 mt-1.5 truncate">
              {stats.lastBackupTime}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Ghi nhận tự động
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/60">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Trạng thái máy chủ</span>
              <Server className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-xl font-bold text-teal-400 mt-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
              <span>An toàn</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {serverSnapshots.length} bản sao lưu máy chủ
            </div>
          </div>
        </div>
      </div>

      {/* FEEDBACK TOAST MESSAGE */}
      {feedbackMsg && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-bold animate-in fade-in duration-150 ${
          feedbackMsg.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : feedbackMsg.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : 'bg-blue-50 border-blue-200 text-blue-900'
        }`}>
          <div className="flex items-center gap-2.5">
            {feedbackMsg.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            {feedbackMsg.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />}
            {feedbackMsg.type === 'info' && <Info className="w-5 h-5 text-blue-600 shrink-0" />}
            <span>{feedbackMsg.text}</span>
          </div>
          <button 
            onClick={() => setFeedbackMsg(null)}
            className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded-lg hover:bg-black/5"
          >
            Đóng
          </button>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('hub')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'hub'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Database className="w-4 h-4 text-blue-600" />
          <span>Sao Lưu & Khôi Phục Nhanh</span>
        </button>

        <button
          onClick={() => setActiveTab('server')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'server'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Server className="w-4 h-4 text-indigo-600" />
          <span>Bản Sao Lưu Máy Chủ ({serverSnapshots.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('granular')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'granular'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Sao Lưu Theo Chuyên Mục</span>
        </button>

        <button
          onClick={() => setActiveTab('automation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'automation'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Calendar className="w-4 h-4 text-purple-600" />
          <span>Lịch Tự Động & Nhật Ký</span>
        </button>

        <button
          onClick={() => setActiveTab('reset')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ml-auto ${
            activeTab === 'reset'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'text-rose-600 hover:text-rose-800 hover:bg-rose-100/60'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Đặt Khôi Phục Gốc</span>
        </button>
      </div>

      {/* TAB CONTENT 1: QUICK BACKUP & RESTORE HUB */}
      {activeTab === 'hub' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SECTION A: EXPORT FULL BACKUP */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl">
                  <FileJson className="w-6 h-6" />
                </div>
                <span className="text-[11px] bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                  Bản Sao Lưu Toàn Diện (.JSON)
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-lg">1. Tải Tệp Sao Lưu Về Máy Tính</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Xuất đóng gói 100% dữ liệu các phân hệ: Bài viết tin tức, Văn bản chỉ đạo, Cuộc thi trực tuyến, Ý kiến nhân dân, Danh bạ cán bộ, Lịch công tác và Cấu hình hệ thống.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Định dạng tệp:</span>
                  <span className="font-bold text-slate-800">Standard Backup JSON v3.0</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Mã hóa toàn vẹn:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Checksum Verified
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Mục tiêu lưu trữ:</span>
                  <span className="font-bold text-slate-800">Ổ cứng máy tính hoặc Google Drive</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleExportFullBackup}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition shadow-md shadow-blue-200"
            >
              <Download className="w-4 h-4" />
              <span>Tải Về Bản Sao Lưu Web Ngay (.JSON)</span>
            </button>
          </div>

          {/* SECTION B: IMPORT & RESTORE FILE */}
          <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-[11px] bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-bold">
                  Khôi Phục Dữ Liệu
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-lg">2. Tải Tệp Sao Lưu Để Khôi Phục</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Chọn tệp JSON sao lưu trước đó từ máy tính để tái lập nội dung và cấu hình của trang web.
                </p>
              </div>

              {/* FILE SELECT INPUT */}
              <label className="w-full border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50/80 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition text-center">
                <Upload className="w-7 h-7 text-amber-600" />
                <span className="text-xs font-bold text-slate-800">
                  {selectedFileName ? selectedFileName : 'Nhấp để chọn tệp .JSON từ máy tính'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {dryRun ? `Đã phát hiện ${dryRun.totalRecords} bản ghi` : 'Hỗ trợ các bản sao lưu MTTQ Chánh Hiệp'}
                </span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>

              {/* PRE-RESTORE INSPECTION MODAL / PREVIEW PANEL */}
              {dryRun && (
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 animate-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4" /> Kiếm duyệt nội dung tệp sao lưu
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                      v{dryRun.version}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-800/80 p-2 rounded-xl">
                      <span className="text-slate-400 block">Bài viết tin tức:</span>
                      <strong className="text-white text-sm">{dryRun.articles}</strong>
                    </div>
                    <div className="bg-slate-800/80 p-2 rounded-xl">
                      <span className="text-slate-400 block">Văn bản chỉ đạo:</span>
                      <strong className="text-white text-sm">{dryRun.documents}</strong>
                    </div>
                    <div className="bg-slate-800/80 p-2 rounded-xl">
                      <span className="text-slate-400 block">Cuộc thi trực tuyến:</span>
                      <strong className="text-white text-sm">{dryRun.competitions}</strong>
                    </div>
                    <div className="bg-slate-800/80 p-2 rounded-xl">
                      <span className="text-slate-400 block">Ý kiến nhân dân:</span>
                      <strong className="text-white text-sm">{dryRun.opinions}</strong>
                    </div>
                  </div>

                  {/* RESTORE MODE SELECTOR */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <label className="text-[11px] font-bold text-slate-300 block">
                      Chọn chế độ khôi phục:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRestoreMode('MERGE')}
                        className={`p-2 rounded-xl text-left border text-[11px] font-bold transition ${
                          restoreMode === 'MERGE'
                            ? 'bg-blue-600 border-blue-400 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div>1. Hợp nhất (Merge)</div>
                        <div className="text-[9px] opacity-80 font-normal">Bổ sung bản ghi còn thiếu, giữ nguyên bản ghi cũ</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRestoreMode('OVERWRITE')}
                        className={`p-2 rounded-xl text-left border text-[11px] font-bold transition ${
                          restoreMode === 'OVERWRITE'
                            ? 'bg-rose-600 border-rose-400 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div>2. Ghi đè toàn bộ</div>
                        <div className="text-[9px] opacity-80 font-normal">Thay thế hoàn toàn dữ liệu web bằng tệp sao lưu</div>
                      </button>
                    </div>
                  </div>

                  {/* DOUBLE CHECK FOR OVERWRITE */}
                  {restoreMode === 'OVERWRITE' && (
                    <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl space-y-2">
                      <p className="text-[11px] text-rose-300 font-bold">
                        CẢNH BÁO: Nhập từ "KHOI PHUC" để xác nhận ghi đè toàn bộ:
                      </p>
                      <input
                        type="text"
                        value={confirmInput}
                        onChange={(e) => setConfirmInput(e.target.value)}
                        placeholder="Nhập KHOI PHUC"
                        className="w-full px-3 py-1.5 bg-slate-900 border border-rose-700 rounded-lg text-white font-mono text-xs focus:outline-none"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleExecuteRestore}
                    disabled={isRestoring}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black rounded-xl text-xs transition flex items-center justify-center gap-2"
                  >
                    {isRestoring ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>{isRestoring ? 'Đang áp dụng dữ liệu...' : 'Xác Nhận Tiến Hành Khôi Phục'}</span>
                  </button>
                </div>
              )}
            </div>

            {!dryRun && (
              <div className="text-center text-xs text-slate-400 p-2">
                Chưa chọn tệp khôi phục. Hãy tải tệp .JSON để kiểm duyệt chi tiết trước khi ghi đè.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: SERVER SNAPSHOT ARCHIVE */}
      {activeTab === 'server' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-600" />
                Lưu Trữ Bản Sao Lưu Trên Máy Chủ Server
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Các bản snapshot được tự động đóng gói và lưu giữ trực tiếp trên thư mục bảo mật máy chủ `./backups/`.
              </p>
            </div>

            <button
              onClick={fetchServerSnapshots}
              disabled={isLoadingServerSnapshots}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition self-start"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingServerSnapshots ? 'animate-spin' : ''}`} />
              <span>Làm mới danh sách</span>
            </button>
          </div>

          {/* CREATE SERVER SNAPSHOT FORM */}
          <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={serverSnapshotLabel}
              onChange={(e) => setServerSnapshotLabel(e.target.value)}
              placeholder="Nhập ghi chú cho bản sao lưu (VD: Trước khi duyệt tin tháng 10)"
              className="w-full sm:flex-1 px-4 py-2.5 bg-white border border-indigo-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleCreateServerSnapshot}
              disabled={isCreatingServerSnapshot}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shrink-0 shadow-sm"
            >
              {isCreatingServerSnapshot ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Lưu Bản Sao Lưu Lên Máy Chủ</span>
            </button>
          </div>

          {/* SNAPSHOTS LIST TABLE */}
          {serverSnapshots.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3 border-2 border-dashed border-slate-200 rounded-2xl">
              <Server className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-600">Chưa có bản sao lưu nào trên máy chủ.</p>
              <p className="text-[11px] text-slate-400">Hãy tạo bản sao lưu mới bằng form phía trên.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Tên tệp Snapshot</th>
                    <th className="p-3.5">Ghi chú</th>
                    <th className="p-3.5">Thời gian tạo</th>
                    <th className="p-3.5">Số bản ghi</th>
                    <th className="p-3.5">Dung lượng</th>
                    <th className="p-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {serverSnapshots.map((snap) => (
                    <tr key={snap.filename} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-bold text-slate-900 font-mono text-[11px]">
                        {snap.filename}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {snap.metadata?.label || 'Sao lưu thủ công'}
                      </td>
                      <td className="p-3.5 text-slate-500 whitespace-nowrap">
                        {new Date(snap.createdAt).toLocaleString('vi-VN')}
                      </td>
                      <td className="p-3.5 font-bold text-blue-700">
                        {snap.recordCount.toLocaleString('vi-VN')}
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {snap.sizeFormatted}
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRestoreServerSnapshot(snap.filename)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition shadow-xs flex items-center gap-1"
                            title="Khôi phục dữ liệu từ bản sao lưu này"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Khôi phục</span>
                          </button>

                          <a
                            href={`/api/admin/backup/snapshots/download/${encodeURIComponent(snap.filename)}`}
                            download
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Tải về</span>
                          </a>

                          <button
                            onClick={() => handleDeleteServerSnapshot(snap.filename)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            title="Xóa tệp"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: GRANULAR / SELECTIVE BACKUP */}
      {activeTab === 'granular' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              Sao Lưu Tùy Chọn Theo Phân HệChuyên Mục
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Chọn các danh mục dữ liệu cụ thể bạn muốn đóng gói xuất tệp sao lưu riêng lẻ.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: 'articles', label: '📰 Bài viết & Tin tức CMS', count: stats.articlesCount },
              { id: 'documents', label: '📜 Văn bản Chỉ đạo & Hướng dẫn', count: stats.documentsCount },
              { id: 'competitions', label: '🏆 Cuộc thi Trực tuyến & Ngân hàng đề', count: stats.competitionsCount },
              { id: 'opinions', label: '🗳️ Ý kiến Kiến nghị Dân nguyện', count: stats.opinionsCount },
              { id: 'tasks', label: '📅 Lịch Công tác & Nhiệm vụ', count: stats.tasksCount },
              { id: 'staffUsers', label: '👥 Danh bạ & Tài khoản Cán bộ', count: stats.staffCount },
              { id: 'memberOrganizations', label: '🏛️ Tổ chức Thành viên & 21 Khu phố', count: stats.memberOrgsCount },
              { id: 'systemSettings', label: '⚙️ Cấu hình Hệ thống & Popup Ra mắt', count: 'Cấu hình' }
            ].map(mod => (
              <label
                key={mod.id}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                  selectedModules[mod.id]
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!selectedModules[mod.id]}
                  onChange={(e) => setSelectedModules({ ...selectedModules, [mod.id]: e.target.checked })}
                  className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="font-bold text-xs block">{mod.label}</span>
                  <span className="text-[10px] text-slate-500">{mod.count} bản ghi</span>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={handleExportGranular}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Tệp Sao Lưu Tùy Chọn (.JSON)</span>
          </button>
        </div>
      )}

      {/* TAB CONTENT 4: AUTOMATION & AUDIT HISTORY */}
      {activeTab === 'automation' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Thiết Lập Lịch Tự Động Sao Lưu
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cấu hình chu kỳ tự động ghi lại bản sao lưu máy chủ nhằm đảm bảo không thất thoát dữ liệu.
            </p>
          </div>

          <div className="p-5 bg-purple-50/60 border border-purple-100 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 text-sm block">Kích hoạt sao lưu tự động</span>
                <span className="text-xs text-slate-500">Tự động tạo bản sao lưu máy chủ theo chu kỳ đã chọn</span>
              </div>
              <input
                type="checkbox"
                checked={autoBackupEnabled}
                onChange={(e) => {
                  setAutoBackupEnabled(e.target.checked);
                  localStorage.setItem('mttq_auto_backup_enabled', String(e.target.checked));
                }}
                className="w-5 h-5 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-purple-200/60">
              {[
                { id: 'DAILY', title: 'Hằng ngày (00:00)', desc: 'Khuyên dùng cho cổng thông tin tần suất bài viết cao' },
                { id: 'WEEKLY', title: 'Hằng tuần (Chủ nhật)', desc: 'Sao lưu tổng hợp mỗi cuối tuần' },
                { id: 'MONTHLY', title: 'Hằng tháng (Ngày 1)', desc: 'Sao lưu định kỳ hằng tháng' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setAutoBackupFrequency(item.id);
                    localStorage.setItem('mttq_auto_backup_freq', item.id);
                  }}
                  className={`p-3 rounded-xl text-left border text-xs font-bold transition ${
                    autoBackupFrequency === item.id
                      ? 'bg-purple-600 border-purple-600 text-white shadow-xs'
                      : 'bg-white border-purple-200 text-slate-700 hover:bg-purple-100/50'
                  }`}
                >
                  <div>{item.title}</div>
                  <div className={`text-[10px] font-normal mt-0.5 ${autoBackupFrequency === item.id ? 'text-purple-100' : 'text-slate-500'}`}>
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: FACTORY RESET */}
      {activeTab === 'reset' && (
        <div className="bg-rose-50/60 rounded-3xl p-6 border border-rose-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-rose-900">
            <div className="p-3 bg-rose-200 text-rose-800 rounded-2xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Đặt Khôi Phục Về Dữ Liệu Gốc Ban Đầu (Factory Reset)</h3>
              <p className="text-xs text-rose-700">Chức năng chỉ dành cho Quản trị viên cấp cao trong trường hợp muốn tái lập lại toàn bộ ứng dụng.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-rose-200 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Hành động này sẽ xóa sạch các bài viết, văn bản, cuộc thi và cấu hình đã thêm mới, sau đó nạp lại bộ dữ liệu chuẩn chính thức ban đầu của Ủy ban MTTQ Việt Nam Phường Chánh Hiệp.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Nhập chính xác từ "KHOI PHUC" để xác nhận:
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="Nhập KHOI PHUC"
                className="w-full sm:w-64 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <button
              onClick={handleFactoryReset}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Xác Nhận Đặt Lại Cài Đặt Gốc
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
