import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertTriangle, Cloud, CloudOff, HardDrive, ArrowUpRight, X } from 'lucide-react';
import { AppStorageEngine, StorageSyncStatus } from '../../lib/storage';

export const OfflineSyncStatusWidget: React.FC = () => {
  const [status, setStatus] = useState<StorageSyncStatus>(() => AppStorageEngine.getSyncStatus());
  const [isOpen, setIsOpen] = useState(false);
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  useEffect(() => {
    // Initialize offline sync engine listeners
    const cleanupEngine = AppStorageEngine.initOfflineSyncEngine();
    const cleanupSubscribe = AppStorageEngine.subscribeToSyncStatus((newStatus) => {
      setStatus(newStatus);
    });

    return () => {
      cleanupSubscribe();
      cleanupEngine();
    };
  }, []);

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    await AppStorageEngine.processPendingQueue();
    setIsManualSyncing(false);
  };

  const formattedLastSync = status.lastSyncedTime
    ? new Date(status.lastSyncedTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Chưa đồng bộ';

  return (
    <>
      {/* Compact Status Pill Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 border cursor-pointer ${
          !status.isOnline
            ? 'bg-amber-500/10 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 hover:bg-amber-500/20 shadow-sm'
            : status.syncState === 'SYNCING' || isManualSyncing
            ? 'bg-blue-500/10 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
            : status.pendingCount > 0
            ? 'bg-amber-500/10 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
            : 'bg-emerald-500/10 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 hover:bg-emerald-500/20'
        }`}
        title={!status.isOnline ? 'Đang ngoại tuyến. Bấm để xem chi tiết hàng chờ.' : 'Hệ thống lưu trữ & đồng bộ thông minh.'}
      >
        {!status.isOnline ? (
          <>
            <WifiOff className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span className="hidden sm:inline">Ngoại tuyến</span>
            {status.pendingCount > 0 && (
              <span className="bg-amber-600 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                {status.pendingCount}
              </span>
            )}
          </>
        ) : status.syncState === 'SYNCING' || isManualSyncing ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            <span className="hidden sm:inline">Đang đẩy dữ liệu...</span>
          </>
        ) : status.pendingCount > 0 ? (
          <>
            <Cloud className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
            <span className="hidden sm:inline">Chờ đồng bộ ({status.pendingCount})</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline font-semibold">Đã đồng bộ</span>
          </>
        )}
      </button>

      {/* Detailed Offline Sync Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden transform transition-all">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${!status.isOnline ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {!status.isOnline ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Đồng Bộ Dữ Liệu Thông Minh
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {status.isOnline ? 'Đã kết nối Internet' : 'Đang hoạt động Ngoại tuyến (Offline)'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Connection Banner */}
              {!status.isOnline ? (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block mb-0.5">Đã bật chế độ lưu cục bộ an toàn:</strong>
                    Mọi thao tác thay đổi dữ liệu của bạn sẽ được lưu tức thì vào bộ nhớ máy và tự động đẩy lên hệ thống ngay khi thiết bị có mạng trở lại.
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs leading-relaxed dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block mb-0.5">Kết nối thông suốt:</strong>
                    Dữ liệu được cập nhật thời gian thực và đồng bộ hai chiều tự động với hệ thống lưu trữ Cloud.
                  </div>
                </div>
              )}

              {/* Pending Queue List */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                    Hàng chờ thao tác ngoại tuyến
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                    {status.pendingCount} thay đổi
                  </span>
                </div>

                {status.pendingSummary.length > 0 ? (
                  <div className="space-y-1.5 mt-2.5">
                    {status.pendingSummary.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{item.entityName}</span>
                        <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-900/40 px-2 py-0.5 rounded">
                          {item.count} bản ghi
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic py-2 text-center">
                    Không có thao tác nào đang chờ đồng bộ.
                  </p>
                )}
              </div>

              {/* Sync Metadata */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 pt-1">
                <span>Lần đồng bộ cuối:</span>
                <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                  {formattedLastSync}
                </span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              {status.pendingCount > 0 && (
                <button
                  onClick={() => AppStorageEngine.clearOfflineQueue()}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition cursor-pointer"
                >
                  Xóa hàng chờ
                </button>
              )}
              <button
                onClick={handleManualSync}
                disabled={!status.isOnline || isManualSyncing}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer shadow-sm ${
                  !status.isOnline
                    ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isManualSyncing ? 'animate-spin' : ''}`} />
                {isManualSyncing ? 'Đang đẩy dữ liệu...' : 'Đồng bộ ngay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
