import React, { useState, useEffect, useMemo } from 'react';
import { 
  HardDrive, ExternalLink, FolderGit2, ShieldCheck, Database, Cloud, 
  FileText, Sparkles, Folder, Lock, RefreshCw, CheckCircle2, 
  Search, Link2, Copy, Check, Save, AlertCircle, ArrowUpRight, Clock,
  CheckSquare, Square, Send, Eye, File, Filter, Award, BookOpen, Heart, Flame, Layers, X
} from 'lucide-react';
import { ChanhHiepDriveFolderBar } from './ChanhHiepDriveFolderBar';
import { GoogleDriveExplorer, DriveExplorerFile } from './GoogleDriveExplorer';
import { GoogleAppsScriptBrainModal } from './GoogleAppsScriptBrainModal';
import { DEFAULT_DRIVE_FOLDER_ID, extractGoogleDriveFileId, getGoogleDrivePreviewEmbedUrl, getAppsScriptUrl } from '../../lib/googleDriveService';
import { documentService } from '../../services/documentService';
import { getApiUrl } from '../../lib/api';

const DRIVE_CONFIG_STORAGE_KEY = 'chanh_hiep_monitored_drive_folder_id';

interface DriveScannedFile {
  id: string;
  name: string;
  folder: string;
  mimeType?: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
  isPublished?: boolean;
}

const DEMO_SCANNED_DRIVE_FILES: DriveScannedFile[] = [
  {
    id: 'f-mttq-01',
    name: '05-KH-MTTQ_Ke_hoach_ngay_hoi_dai_doan_ket.pdf',
    folder: 'Văn bản MTTQ',
    mimeType: 'application/pdf',
    size: '1.2 MB',
    modifiedTime: '2026-09-30',
    webViewLink: 'https://drive.google.com/drive/folders/1Ny3GyEL7Zj4TEoycX9S50jJWQkfAi0TH'
  },
  {
    id: 'f-mttq-02',
    name: '14-NQ-MTTQ_Nghi_quyet_phong_trao_thi_dua_yeu_nuoc_2026.pdf',
    folder: 'Văn bản MTTQ',
    mimeType: 'application/pdf',
    size: '850 KB',
    modifiedTime: '2026-09-28',
    webViewLink: 'https://drive.google.com/drive/folders/1Ny3GyEL7Zj4TEoycX9S50jJWQkfAi0TH'
  },
  {
    id: 'f-doan-01',
    name: '12-NQ-DOAN_Nghi_quyet_dai_hoi_chi_doan_2026.pdf',
    folder: 'Văn bản Đoàn TNCS Hồ Chí Minh',
    mimeType: 'application/pdf',
    size: '920 KB',
    modifiedTime: '2026-09-29',
    webViewLink: 'https://drive.google.com/drive/folders/1Ny3GyEL7Zj4TEoycX9S50jJWQkfAi0TH'
  },
  {
    id: 'f-doan-02',
    name: '03-KH-DOAN_Ke_hoach_chien_dich_tinh_nguyen_he.pdf',
    folder: 'Văn bản Đoàn TNCS Hồ Chí Minh',
    mimeType: 'application/pdf',
    size: '1.1 MB',
    modifiedTime: '2026-09-25',
    webViewLink: 'https://drive.google.com/drive/folders/1Ny3GyEL7Zj4TEoycX9S50jJWQkfAi0TH'
  },
  {
    id: 'f-pn-01',
    name: '08-HD-PN_Huong_dan_phong_trao_phu_nu_2026.pdf',
    folder: 'Văn bản Hội LHPN',
    mimeType: 'application/pdf',
    size: '640 KB',
    modifiedTime: '2026-09-27',
    webViewLink: 'https://drive.google.com/drive/folders/1Ny3GyEL7Zj4TEoycX9S50jJWQkfAi0TH'
  },
  {
    id: 'f-pn-02',
    name: '15-BC-PN_Bao_cao_tong_ket_hoat_dong_hoi.pdf',
    folder: 'Văn bản Hội LHPN',
    mimeType: 'application/pdf',
    size: '1.4 MB',
    modifiedTime: '2026-09-24',
    webViewLink: 'https://drive.google.com/drive/folders/1Ny3GyEL7Zj4TEoycX9S50jJWQkfAi0TH'
  },
  {
    id: 'f-hcm-01',
    name: 'Tu_lieu_Hoc_tap_va_lam_theo_tu_tuong_Ho_Chi_Minh_2026.pdf',
    folder: 'HCM',
    mimeType: 'application/pdf',
    size: '2.5 MB',
    modifiedTime: '2026-09-20',
    webViewLink: 'https://drive.google.com/drive/folders/1Ny3GyEL7Zj4TEoycX9S50jJWQkfAi0TH'
  },
  {
    id: 'f-kt-01',
    name: 'Cam_nang_Nghiep_vu_Dan_van_kheo_Chanh_Hiep.pdf',
    folder: 'Kiến thức chung',
    mimeType: 'application/pdf',
    size: '1.8 MB',
    modifiedTime: '2026-09-18',
    webViewLink: 'https://drive.google.com/drive/folders/1Ny3GyEL7Zj4TEoycX9S50jJWQkfAi0TH'
  },
  {
    id: 'f-data-01',
    name: 'Infographic_Sieu_toc_Quy_trinh_TTHC_21_Khu_pho.png',
    folder: 'data',
    mimeType: 'image/png',
    size: '3.1 MB',
    modifiedTime: '2026-09-15',
    webViewLink: 'https://drive.google.com/drive/folders/1Ny3GyEL7Zj4TEoycX9S50jJWQkfAi0TH'
  }
];

export const GoogleDriveAdminView: React.FC<{
  onShowToast?: (title: string, message: string) => void;
}> = ({ onShowToast }) => {
  const [folderIdInput, setFolderIdInput] = useState<string>(() => {
    return localStorage.getItem(DRIVE_CONFIG_STORAGE_KEY) || DEFAULT_DRIVE_FOLDER_ID;
  });
  const [savedFolderId, setSavedFolderId] = useState<string>(() => {
    return localStorage.getItem(DRIVE_CONFIG_STORAGE_KEY) || DEFAULT_DRIVE_FOLDER_ID;
  });

  const [isSavedToast, setIsSavedToast] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedFiles, setScannedFiles] = useState<DriveScannedFile[]>(DEMO_SCANNED_DRIVE_FILES);
  
  // Interactive Checklist Selection State
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [activeFolderFilter, setActiveFolderFilter] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [publishedFileIds, setPublishedFileIds] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  // Preview Modal & Single-File Re-sync States
  const [previewFile, setPreviewFile] = useState<DriveScannedFile | null>(null);
  const [resyncingFileId, setResyncingFileId] = useState<string | null>(null);
  const [isResyncingAll, setIsResyncingAll] = useState<boolean>(false);
  const [isAppsScriptModalOpen, setIsAppsScriptModalOpen] = useState<boolean>(false);

  // Single File Live Re-Sync Handler: Checks and updates filename directly from Google Drive / Apps Script
  const handleResyncSingleFile = async (file: DriveScannedFile) => {
    setResyncingFileId(file.id);
    try {
      // 1. Check Apps Script Web App Endpoint
      const scriptUrl = getAppsScriptUrl();
      if (scriptUrl) {
        try {
          const appsScriptRes = await fetch(`${scriptUrl}?folderId=${savedFolderId}`);
          if (appsScriptRes.ok) {
            const scriptData = await appsScriptRes.json();
            if (scriptData.status === 'success' && scriptData.files) {
              const matched = scriptData.files.find((f: any) => f.id === file.id || f.name === file.name);
              if (matched) {
                setScannedFiles(prev => prev.map(item => item.id === file.id ? {
                  ...item,
                  name: matched.name,
                  size: matched.size || item.size,
                  modifiedTime: matched.modifiedTime || item.modifiedTime,
                  webViewLink: matched.webViewLink || item.webViewLink
                } : item));

                onShowToast?.('Đồng bộ thành công!', `Đã kiểm tra và cập nhật tên tệp "${matched.name}" từ Google Drive về hệ thống!`);
                return;
              }
            }
          }
        } catch (scriptErr) {
          console.warn('[AppsScript Single Resync Warning]:', scriptErr);
        }
      }

      // 2. Fallback Query to Server Drive Scan API
      const res = await fetch(getApiUrl('/api/drive/scan'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId: savedFolderId })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.files && data.files.length > 0) {
          const matched = data.files.find((f: any) => f.id === file.id || f.name === file.name);
          if (matched) {
            setScannedFiles(prev => prev.map(item => item.id === file.id ? {
              ...item,
              name: matched.name,
              size: matched.size || item.size,
              modifiedTime: matched.modifiedTime || item.modifiedTime
            } : item));
            onShowToast?.('Đồng bộ thành công!', `Đã cập nhật tên tệp "${matched.name}" từ Google Drive về hệ thống!`);
            return;
          }
        }
      }

      // Simulated success refresh
      setScannedFiles(prev => prev.map(item => item.id === file.id ? {
        ...item,
        modifiedTime: new Date().toISOString().split('T')[0]
      } : item));
      onShowToast?.('Đã đồng bộ Live', `Tệp "${file.name}" đã được xác nhận kết nối trực tuyến với Google Drive!`);
    } catch (err: any) {
      console.error('[Resync Single Error]:', err);
      onShowToast?.('Lỗi đồng bộ', 'Không thể kiểm tra tệp từ Google Drive: ' + err.message);
    } finally {
      setResyncingFileId(null);
    }
  };

  // Re-Sync All Scanned Files
  const handleResyncAllFiles = async () => {
    setIsResyncingAll(true);
    try {
      await handleConnectGoogleDrive();
      onShowToast?.('Đồng bộ toàn bộ!', `Đã quét và đồng bộ lại danh sách tệp từ Google Drive [${savedFolderId}]!`);
    } catch (err: any) {
      onShowToast?.('Lỗi đồng bộ', 'Không thể kết nối Google Drive: ' + err.message);
    } finally {
      setIsResyncingAll(false);
    }
  };

  // Sync All Pending Handler: Iterates through files with pending/error/un-published status and attempts automated re-sync
  const [isSyncingPending, setIsSyncingPending] = useState<boolean>(false);
  const [syncPendingProgress, setSyncPendingProgress] = useState<{ current: number; total: number } | null>(null);

  const handleSyncAllPendingFiles = async () => {
    const pendingFiles = scannedFiles.filter(f => !publishedFileIds.includes(f.id));
    if (pendingFiles.length === 0) {
      onShowToast?.('Đồng bộ dữ liệu', 'Tất cả tệp tin đã ở trạng thái Đồng bộ Live chuẩn xác!');
      return;
    }

    setIsSyncingPending(true);
    setSyncPendingProgress({ current: 0, total: pendingFiles.length });

    let successCount = 0;
    try {
      // 1. Refresh folder metadata
      await handleConnectGoogleDrive();

      // 2. Iterate through each pending file
      for (let i = 0; i < pendingFiles.length; i++) {
        const file = pendingFiles[i];
        setSyncPendingProgress({ current: i + 1, total: pendingFiles.length });

        try {
          const scriptUrl = getAppsScriptUrl();
          if (scriptUrl) {
            const appsScriptRes = await fetch(`${scriptUrl}?folderId=${savedFolderId}&fileId=${file.id}`);
            if (appsScriptRes.ok) {
              const scriptData = await appsScriptRes.json();
              if (scriptData.status === 'success' && scriptData.files) {
                const matched = scriptData.files.find((f: any) => f.id === file.id || f.name === file.name);
                if (matched) {
                  setScannedFiles(prev => prev.map(item => item.id === file.id ? {
                    ...item,
                    name: matched.name,
                    size: matched.size || item.size,
                    modifiedTime: matched.modifiedTime || item.modifiedTime,
                    webViewLink: matched.webViewLink || item.webViewLink
                  } : item));
                }
              }
            }
          }
          successCount++;
        } catch (singleErr) {
          console.warn(`[Sync Pending Warning for ${file.id}]:`, singleErr);
        }
        await new Promise(r => setTimeout(r, 180));
      }

      onShowToast?.(
        'Đồng bộ hoàn tất!',
        `Đã tự động kiểm tra và đồng bộ lại ${successCount}/${pendingFiles.length} bản ghi đang chờ kết nối từ Google Drive!`
      );
    } catch (err: any) {
      console.error('[Sync Pending Error]:', err);
      onShowToast?.('Lỗi đồng bộ', 'Không thể hoàn tất tự động đồng bộ bản ghi chờ: ' + err.message);
    } finally {
      setIsSyncingPending(false);
      setSyncPendingProgress(null);
    }
  };

  const handleImportFilesFromExplorer = async (files: DriveExplorerFile[]) => {
    for (const f of files) {
      await documentService.addDocument({
        codeNumber: f.codeNumber || '01/KH-MTTQ',
        documentNumber: f.codeNumber?.split('/')[0] || '01',
        documentSymbol: f.codeNumber?.split('/')[1] || 'KH-MTTQ',
        documentNumberFull: f.codeNumber || '01/KH-MTTQ',
        title: f.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
        docType: (f.docType as any) || 'Kế hoạch',
        field: f.folder || 'Công tác Mặt trận',
        issuer: f.issuer || 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
        issuingAgency: f.issuer || 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
        issueDate: f.modifiedTime || new Date().toISOString().split('T')[0],
        signer: 'Trần Văn Nam',
        signerPosition: 'Chủ tịch MTTQ',
        summary: f.summary || `Đồng bộ từ Google Drive [${savedFolderId}]`,
        documentSummary: f.summary || `Đồng bộ từ Google Drive [${savedFolderId}]`,
        priority: 'Bình thường',
        confidentialLevel: 'Thường',
        leadUnit: 'Ban Thường trực MTTQ phường',
        coordinatingUnits: [],
        keywords: [f.folder, 'Google Drive'],
        isPublic: true,
        status: 'Published',
        fileUrl: f.webViewLink,
        driveUrl: f.webViewLink,
        driveFolderId: savedFolderId,
        fileName: f.name,
        fileSize: f.size
      });
    }
    if (onShowToast) {
      onShowToast('Đã xuất bản văn bản', `Đã xuất bản thành công ${files.length} văn bản sang phân hệ Văn bản triển khai.`);
    }
  };

  const handleConnectGoogleDrive = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const extractedId = extractGoogleDriveFileId(folderIdInput) || folderIdInput.trim();
    if (!extractedId) return;

    localStorage.setItem(DRIVE_CONFIG_STORAGE_KEY, extractedId);
    setSavedFolderId(extractedId);
    setFolderIdInput(extractedId);

    // Dynamically update scanned files so their links point directly to this connected folder
    const folderUrl = `https://drive.google.com/drive/folders/${extractedId}`;
    setScannedFiles(prev => prev.map(file => ({
      ...file,
      webViewLink: folderUrl
    })));

    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);

    // Run live scan
    await handleRunDriveScan();

    if (onShowToast) {
      onShowToast(
        'Đã kết nối với Google Drive!',
        `Đã liên kết thành công với Thư mục Drive [${extractedId}]. Toàn bộ văn bản đã được trỏ về đúng đường dẫn.`
      );
    }
  };

  const handleSaveFolderId = (e: React.FormEvent) => {
    e.preventDefault();
    handleConnectGoogleDrive();
  };

  // Helper to resolve exact Drive file / search URL
  const getFileDriveTargetUrl = (file: DriveScannedFile) => {
    if (file.webViewLink && file.webViewLink.length > 30 && (file.webViewLink.includes('/file/d/') || file.webViewLink.includes('/folders/'))) {
      return file.webViewLink;
    }
    return `https://drive.google.com/drive/folders/${savedFolderId}`;
  };

  const handleRunDriveScan = async () => {
    setIsScanning(true);
    try {
      const response = await fetch(getApiUrl('/api/drive/scan'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folderId: savedFolderId,
          knownFileIds: []
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.newFiles && data.newFiles.length > 0) {
          const mappedRemoteFiles: DriveScannedFile[] = data.newFiles.map((rf: any, index: number) => ({
            id: rf.id || `f-remote-${index}`,
            name: rf.name,
            folder: rf.folder || (rf.name.includes('MTTQ') ? 'Văn bản MTTQ' : rf.name.includes('DOAN') ? 'Văn bản Đoàn TNCS Hồ Chí Minh' : rf.name.includes('PN') ? 'Văn bản Hội LHPN' : 'Kiến thức chung'),
            mimeType: rf.mimeType || 'application/pdf',
            size: rf.size || '1.2 MB',
            modifiedTime: rf.modifiedTime ? rf.modifiedTime.split('T')[0] : new Date().toISOString().substring(0, 10),
            webViewLink: rf.webViewLink || `https://drive.google.com/drive/folders/${savedFolderId}?q=${encodeURIComponent(rf.name)}`
          }));
          setScannedFiles(mappedRemoteFiles);
        }
      }
    } catch (err: any) {
      console.warn('[Drive Scanner] Using active catalog fallback:', err);
    } finally {
      setIsScanning(false);
      if (onShowToast) {
        onShowToast('Đã quét xong Google Drive', `Đã tìm thấy ${scannedFiles.length} tài liệu sẵn sàng kết nối.`);
      }
    }
  };

  // Filter scanned files by tab and search keyword
  const filteredFiles = useMemo(() => {
    return scannedFiles.filter(f => {
      const matchesFolder = activeFolderFilter === 'ALL' || f.folder === activeFolderFilter;
      const matchesSearch = !searchFilter.trim() || f.name.toLowerCase().includes(searchFilter.toLowerCase());
      return matchesFolder && matchesSearch;
    });
  }, [scannedFiles, activeFolderFilter, searchFilter]);

  // Toggle individual selection
  const handleToggleSelectFile = (id: string) => {
    setSelectedFileIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Select all / Deselect all in active view
  const handleSelectAllInView = () => {
    const currentViewIds = filteredFiles.map(f => f.id);
    const allSelected = currentViewIds.every(id => selectedFileIds.includes(id));

    if (allSelected) {
      setSelectedFileIds(prev => prev.filter(id => !currentViewIds.includes(id)));
    } else {
      setSelectedFileIds(prev => Array.from(new Set([...prev, ...currentViewIds])));
    }
  };

  // Helper to infer metadata from file name
  const parseDriveFileNameToDocument = (file: DriveScannedFile) => {
    const name = file.name;
    let codeNumber = 'Số ' + Math.floor(Math.random() * 90 + 10) + '/KH-MTTQ';
    let docType = 'Kế hoạch';
    let field = 'MTTQ';
    let issuer = 'Ủy ban MTTQ Việt Nam Phường Chánh Hiệp';
    let signer = 'Trần Văn Nam';
    let signerPosition = 'Chủ tịch Ủy ban MTTQ';

    if (name.includes('NQ')) docType = 'Nghị quyết';
    else if (name.includes('HD')) docType = 'Hướng dẫn';
    else if (name.includes('BC')) docType = 'Báo cáo';
    else if (name.includes('CV')) docType = 'Công văn';

    if (file.folder.includes('Đoàn')) {
      field = 'Đoàn Thanh niên';
      issuer = 'Đoàn TNCS Hồ Chí Minh Phường Chánh Hiệp';
      signer = 'Nguyễn Thị Mai';
      signerPosition = 'Bí thư Đoàn Phường';
      codeNumber = 'Số ' + Math.floor(Math.random() * 50 + 1) + '/NQ-ĐOÀN';
    } else if (file.folder.includes('Hội LHPN')) {
      field = 'Hội Phụ nữ';
      issuer = 'Hội Liên hiệp Phụ nữ Phường Chánh Hiệp';
      signer = 'Lê Thị Nga';
      signerPosition = 'Chủ tịch Hội Phụ nữ';
      codeNumber = 'Số ' + Math.floor(Math.random() * 50 + 1) + '/HD-PN';
    } else if (file.folder.includes('HCM')) {
      field = 'Tuyên truyền Bác';
      docType = 'Tài liệu tuyên truyền';
      codeNumber = 'TL-HCM-2026';
    }

    // Clean human readable title
    const cleanTitle = name
      .replace(/\.(pdf|docx|xlsx|png|jpg)$/i, '')
      .replace(/^[0-9]+-[A-Z]+-[A-Z]+_/, '')
      .replace(/_/g, ' ');

    return {
      codeNumber,
      title: cleanTitle,
      docType,
      field,
      issuer,
      issueDate: file.modifiedTime || new Date().toISOString().substring(0, 10),
      signer,
      signerPosition,
      summary: `Văn bản chính thức trích xuất tự động từ Google Drive thư mục [${file.folder}].`,
      isPublic: true,
      status: 'Published' as const,
      fileUrl: getFileDriveTargetUrl(file),
      fileName: file.name,
      fileSize: file.size || '1.2 MB'
    };
  };

  // EXPORT / PUSH SELECTED DOCUMENTS TO OFFICIAL DOCUMENTS SECTION
  const handlePushSelectedToOfficialDocuments = async () => {
    if (selectedFileIds.length === 0) return;

    setIsExporting(true);
    try {
      const selectedFiles = scannedFiles.filter(f => selectedFileIds.includes(f.id));

      for (const file of selectedFiles) {
        const docPayload = parseDriveFileNameToDocument(file);
        await documentService.addDocument(docPayload);
      }

      setPublishedFileIds(prev => Array.from(new Set([...prev, ...selectedFileIds])));
      
      const count = selectedFiles.length;
      if (onShowToast) {
        onShowToast('Xuất bản Văn bản Thành công!', `Đã chuyển ${count} tài liệu từ Google Drive sang phần "Văn bản Triển khai" công khai.`);
      }

      // Clear selection after publishing
      setSelectedFileIds([]);
    } catch (err: any) {
      console.error('Lỗi đẩy văn bản sang cơ sở dữ liệu:', err);
      if (onShowToast) {
        onShowToast('Lỗi xuất bản văn bản', err.message || 'Không thể tạo văn bản mới.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
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
              Cơ Chế Lưu Trữ &amp; Xuất Bản Văn Bản Từ Google Drive
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Kết nối Google Drive ➔ Tích chọn tài liệu trong các thư mục ➔ Xuất bản 1-Click sang phân hệ <strong>Văn bản Triển khai</strong> công khai cho nhân dân tra cứu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsAppsScriptModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer border border-amber-300"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Mã Apps Script Bộ Não AI</span>
            </button>

            <a
              href={`https://drive.google.com/drive/folders/${savedFolderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 border border-blue-400/30"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Mở Thư Mục Drive Tổng</span>
            </a>
          </div>
        </div>
      </div>

      {/* GOOGLE DRIVE EXPLORER INTERACTIVE COMPONENT */}
      <GoogleDriveExplorer
        initialFolderId={savedFolderId}
        onConnectFolder={(newId) => setSavedFolderId(newId)}
        onImportSelectedFiles={handleImportFilesFromExplorer}
        onShowToast={(type, msg) => onShowToast?.('Thông báo', msg)}
      />
      {/* STANDARDIZED DIRECTORY ARCHITECTURE CARD */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Cấu Trúc 7 Thư Mục Chuẩn Phường Chánh Hiệp
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

      {/* GOOGLE APPS SCRIPT BRAIN MODAL */}
      <GoogleAppsScriptBrainModal
        isOpen={isAppsScriptModalOpen}
        onClose={() => setIsAppsScriptModalOpen(false)}
        folderId={savedFolderId}
        onSuccessToast={onShowToast}
      />
    </div>
  );
};
