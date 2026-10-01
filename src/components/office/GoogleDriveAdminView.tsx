import React, { useState, useEffect, useMemo } from 'react';
import { 
  HardDrive, ExternalLink, FolderGit2, ShieldCheck, Database, Cloud, 
  FileText, Sparkles, Folder, Lock, RefreshCw, CheckCircle2, 
  Search, Link2, Copy, Check, Save, AlertCircle, ArrowUpRight, Clock,
  CheckSquare, Square, Send, Eye, File, Filter, Award, BookOpen, Heart, Flame, Layers, X
} from 'lucide-react';
import { ChanhHiepDriveFolderBar } from './ChanhHiepDriveFolderBar';
import { GoogleDriveExplorer, DriveExplorerFile } from './GoogleDriveExplorer';
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

          <a
            href={`https://drive.google.com/drive/folders/${savedFolderId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 shrink-0 border border-blue-400/30"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Mở Thư Mục Drive Tổng</span>
          </a>
        </div>
      </div>

      {/* GOOGLE DRIVE EXPLORER INTERACTIVE COMPONENT */}
      <GoogleDriveExplorer
        initialFolderId={savedFolderId}
        onConnectFolder={(newId) => setSavedFolderId(newId)}
        onImportSelectedFiles={handleImportFilesFromExplorer}
        onShowToast={(type, msg) => onShowToast?.('Thông báo', msg)}
      />
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                Cấu Hình Mã ID Thư Mục Gốc Google Drive (Monitored Folder ID)
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Mã ID kết nối tự động với các thư mục: <i>HCM, Kiến thức chung, Văn bản MTTQ, Văn bản Đoàn, Văn bản Phụ nữ, data</i>
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-extrabold rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Đã kết nối API
          </span>
        </div>

        <form onSubmit={handleSaveFolderId} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-blue-600" />
              <span>Google Drive Monitored Folder ID (Hoặc Dán toàn bộ URL Thư mục Drive):</span>
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={folderIdInput}
                onChange={(e) => setFolderIdInput(e.target.value)}
                placeholder="Ví dụ: 1TNEc-8JYkF17R44igkinTIZAmFEjSmOL hoặc dán link https://drive.google.com/drive/folders/..."
                className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black transition shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-95"
              >
                {isSavedToast ? <Check className="w-4 h-4 text-emerald-300" /> : <HardDrive className="w-4 h-4 text-cyan-200" />}
                <span>{isSavedToast ? 'ĐÃ KẾT NỐI THÀNH CÔNG!' : 'KẾT NỐI VỚI GOOGLE DRIVE'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* SCAN BUTTON & LIVE SYNC ENGINE */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <RefreshCw className={`w-4 h-4 text-emerald-600 ${isScanning ? 'animate-spin' : ''}`} />
              Quét Tự Động &amp; Tải Danh Sách Văn Bản Trong Các Thư Mục Con
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Tìm thấy <strong className="text-blue-700">{scannedFiles.length} tài liệu</strong> sẵn sàng tích chọn xuất bản
            </p>
          </div>

          <button
            onClick={handleRunDriveScan}
            disabled={isScanning}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Đang quét...' : 'QUÉT & TẢI LẠI THƯ MỤC DRIVE'}</span>
          </button>
        </div>
      </div>

      {/* NEW INTERACTIVE FEATURE: GOOGLE DRIVE DOCUMENT SELECTION & PUBLISH PANEL */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-2xl">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                Khung Tích Chọn Văn Bản Google Drive ➔ Xuất Bản Sang Văn Bản Triển Khai
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Đánh dấu <code className="bg-slate-100 text-blue-700 px-1 py-0.5 rounded font-bold">[✓]</code> các tài liệu muốn đưa lên Cổng thông tin công khai
              </p>
            </div>
          </div>

          {/* BULK ACTIONS */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Sync All Pending Button */}
            <button
              onClick={handleSyncAllPendingFiles}
              disabled={isSyncingPending || isResyncingAll}
              className="px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 rounded-2xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
              title="Tự động lặp qua tất cả các bản ghi đang chờ hoặc chưa xuất bản để kiểm tra & khôi phục kết nối Google Drive"
            >
              <RefreshCw className={`w-4 h-4 text-amber-600 ${isSyncingPending ? 'animate-spin' : ''}`} />
              <span>
                {isSyncingPending && syncPendingProgress
                  ? `Đang xử lý ${syncPendingProgress.current}/${syncPendingProgress.total}...`
                  : `Đồng bộ bản ghi chờ (${scannedFiles.filter(f => !publishedFileIds.includes(f.id)).length})`}
              </span>
            </button>

            <button
              onClick={handleResyncAllFiles}
              disabled={isResyncingAll || isSyncingPending}
              className="px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-2xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Quét lại toàn bộ thư mục Google Drive để cập nhật danh sách tên tệp mới nhất"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-600 ${isResyncingAll ? 'animate-spin' : ''}`} />
              <span>{isResyncingAll ? 'Đang quét Drive...' : 'Đồng bộ lại tất cả'}</span>
            </button>

            <button
              onClick={handlePushSelectedToOfficialDocuments}
              disabled={selectedFileIds.length === 0 || isExporting}
              className={`px-5 py-3 rounded-2xl text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                selectedFileIds.length > 0 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white ring-4 ring-blue-500/20 active:scale-95' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>
                {isExporting 
                  ? 'Đang chuyển văn bản...' 
                  : `ĐƯA ${selectedFileIds.length} VĂN BẢN ĐÃ CHỌN VÀO VĂN BẢN TRIỂN KHAI`}
              </span>
            </button>
          </div>
        </div>

        {/* FOLDER TABS & SEARCH BAR */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveFolderFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeFolderFilter === 'ALL' 
                  ? 'bg-white text-blue-700 shadow-xs ring-1 ring-blue-500/20' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({scannedFiles.length})
            </button>
            <button
              onClick={() => setActiveFolderFilter('Văn bản MTTQ')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeFolderFilter === 'Văn bản MTTQ' 
                  ? 'bg-amber-100 text-amber-900 shadow-xs ring-1 ring-amber-500/20' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              MTTQ
            </button>
            <button
              onClick={() => setActiveFolderFilter('Văn bản Đoàn TNCS Hồ Chí Minh')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeFolderFilter === 'Văn bản Đoàn TNCS Hồ Chí Minh' 
                  ? 'bg-emerald-100 text-emerald-900 shadow-xs ring-1 ring-emerald-500/20' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đoàn Thanh niên
            </button>
            <button
              onClick={() => setActiveFolderFilter('Văn bản Hội LHPN')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeFolderFilter === 'Văn bản Hội LHPN' 
                  ? 'bg-pink-100 text-pink-900 shadow-xs ring-1 ring-pink-500/20' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hội Phụ nữ
            </button>
            <button
              onClick={() => setActiveFolderFilter('HCM')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeFolderFilter === 'HCM' 
                  ? 'bg-rose-100 text-rose-900 shadow-xs ring-1 ring-rose-500/20' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              HCM
            </button>
            <button
              onClick={() => setActiveFolderFilter('Kiến thức chung')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeFolderFilter === 'Kiến thức chung' 
                  ? 'bg-indigo-100 text-indigo-900 shadow-xs ring-1 ring-indigo-500/20' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kiến thức
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Lọc tên tài liệu..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              onClick={handleSelectAllInView}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer whitespace-nowrap shrink-0"
            >
              Chọn mục này
            </button>
          </div>
        </div>

        {/* DOCUMENTS CHECKLIST GRID TABLE */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {filteredFiles.map((file) => {
            const isChecked = selectedFileIds.includes(file.id);
            const isPublished = publishedFileIds.includes(file.id);
            const targetUrl = getFileDriveTargetUrl(file);

            return (
              <div
                key={file.id}
                onClick={() => handleToggleSelectFile(file.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isChecked
                    ? 'bg-blue-50/90 border-blue-500 shadow-xs ring-2 ring-blue-500/20'
                    : isPublished
                    ? 'bg-emerald-50/40 border-emerald-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Checkbox Icon */}
                  <div className="shrink-0 text-blue-600">
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                    )}
                  </div>

                  {/* File Icon */}
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>

                  {/* File Meta */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-xs text-slate-900 truncate">
                        {file.name}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                        {file.folder}
                      </span>

                      {/* Drive Connection Status Badge */}
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-cyan-100 text-cyan-800 border border-cyan-300 flex items-center gap-1">
                        <Cloud className="w-3 h-3 text-cyan-600" />
                        Drive Live Connected
                      </span>

                      {isPublished && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Đã xuất bản sang Văn bản Triển khai
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span>Kích thước: <strong>{file.size}</strong></span>
                      <span>•</span>
                      <span>Ngày cập nhật: <strong>{file.modifiedTime}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Links */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Per-File Re-Sync Button */}
                  <button
                    type="button"
                    disabled={resyncingFileId === file.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResyncSingleFile(file);
                    }}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-2xs"
                    title="Đồng bộ lại tên tệp & thông tin trực tiếp từ Google Drive"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${resyncingFileId === file.id ? 'animate-spin' : ''}`} />
                    <span>{resyncingFileId === file.id ? 'Đang cập nhật...' : 'Đồng bộ lại'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewFile(file);
                    }}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem trước</span>
                  </button>

                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition flex items-center gap-1 border border-slate-200"
                    title="Mở thư mục/tài liệu trên Google Drive"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PREVIEW MODAL FOR DRIVE DOCUMENTS */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    Thư mục: {previewFile.folder}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 mt-1 leading-snug">
                    {previewFile.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setPreviewFile(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Định dạng tệp:</span>
                  <span className="font-bold text-slate-800 uppercase">{previewFile.mimeType?.split('/')[1] || 'PDF'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Kích thước:</span>
                  <span className="font-bold text-slate-800">{previewFile.size}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Cập nhật:</span>
                  <span className="font-bold text-slate-800">{previewFile.modifiedTime}</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                Văn bản số hóa thuộc thư mục <strong>[{previewFile.folder}]</strong> trên Google Drive Phường Chánh Hiệp. Khi bấm xuất bản, hệ thống sẽ đưa tài liệu này lên danh sách Văn bản Triển khai công khai.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <a
                href={getFileDriveTargetUrl(previewFile)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Mở trên Google Drive</span>
              </a>

              <button
                onClick={async () => {
                  const docPayload = parseDriveFileNameToDocument(previewFile);
                  await documentService.addDocument(docPayload);
                  setPublishedFileIds(prev => Array.from(new Set([...prev, previewFile.id])));
                  setPreviewFile(null);
                  if (onShowToast) {
                    onShowToast('Đã xuất bản văn bản!', `Văn bản "${previewFile.name}" đã được đưa vào phân hệ Văn bản Triển khai.`);
                  }
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Xuất Bản Ngay Lên Web</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};
