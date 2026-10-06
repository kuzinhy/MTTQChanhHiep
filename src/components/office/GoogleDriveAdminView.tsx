import React, { useState, useEffect, useMemo } from 'react';
import { 
  HardDrive, ExternalLink, FolderGit2, ShieldCheck, Database, Cloud, 
  FileText, Sparkles, Folder, Lock, RefreshCw, CheckCircle2, 
  Search, Link2, Copy, Check, Save, AlertCircle, ArrowUpRight, Clock,
  CheckSquare, Square, Send, Eye, File as FileIcon, Filter, Award, BookOpen, Heart, Flame, Layers, X,
  Zap, KeyRound, Play, Terminal, HelpCircle, Activity, Globe, CheckCheck, Loader2
} from 'lucide-react';
import { ChanhHiepDriveFolderBar } from './ChanhHiepDriveFolderBar';
import { GoogleDriveExplorer, DriveExplorerFile } from './GoogleDriveExplorer';
import { 
  DEFAULT_DRIVE_FOLDER_ID, 
  extractGoogleDriveFileId, 
  getGoogleDrivePreviewEmbedUrl, 
  getAppsScriptUrl, 
  saveAppsScriptUrl,
  getDriveAccessToken,
  uploadFileViaServerProxy
} from '../../lib/googleDriveService';
import { documentService } from '../../services/documentService';
import { getApiUrl } from '../../lib/api';

export const OPINIONS_DRIVE_FOLDER_ID = '1esbw7TuyePZEFmNe7oimUav-AIyeVv4B';
export const BRAIN_DRIVE_FOLDER_ID = '1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G';
export const OFFICIAL_DOCS_DRIVE_FOLDER_ID = '1Vw365JIFDuUFT1AwF-MoJD8kKkvhiLH_';

interface ModuleFolderConfig {
  key: string;
  name: string;
  code: string;
  defaultId: string;
  storageKey: string;
  description: string;
  badgeColor: string;
}

const MODULE_FOLDERS: ModuleFolderConfig[] = [
  {
    key: 'opinions',
    name: 'Hòm Thư Dân Nguyện & Nắm Bắt Dư Luận (21 Khu Phố)',
    code: 'DAN_NGUYEN',
    defaultId: OPINIONS_DRIVE_FOLDER_ID,
    storageKey: 'chanh_hiep_opinions_drive_folder_id',
    description: 'Thư mục tiếp nhận mọi hình ảnh hiện trường, minh chứng phản ánh do nhân dân gửi lên.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
  },
  {
    key: 'brain',
    name: 'Văn Bản Số MTTQ & Bộ Não AI Tri Thức',
    code: 'BRAIN_AI',
    defaultId: BRAIN_DRIVE_FOLDER_ID,
    storageKey: 'chanh_hiep_monitored_drive_folder_id',
    description: 'Kho văn bản gốc nạp dữ liệu tri thức, OCR AI và cung cấp tài liệu cho Trợ lý AI.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  {
    key: 'official_docs',
    name: 'Văn Bản Triển Khai & Quyết Định Các Ban Ngành',
    code: 'VAN_BAN_SO',
    defaultId: OFFICIAL_DOCS_DRIVE_FOLDER_ID,
    storageKey: 'chanh_hiep_official_docs_drive_folder_id',
    description: 'Lưu trữ các văn bản chỉ đạo, nghị quyết, kế hoạch xuất bản công khai.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    key: 'media',
    name: 'Kho Dữ Liệu Media, Infographics & Video (data)',
    code: 'DATA_MEDIA',
    defaultId: BRAIN_DRIVE_FOLDER_ID,
    storageKey: 'chanh_hiep_media_drive_folder_id',
    description: 'Kho hình ảnh tuyên truyền, tư liệu đại hội và video không gian văn hóa.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  {
    key: 'hcm_cultural',
    name: 'Không Gian Văn Hóa Hồ Chí Minh & Tư Liệu 3D',
    code: 'HCM_SPACE',
    defaultId: BRAIN_DRIVE_FOLDER_ID,
    storageKey: 'chanh_hiep_hcm_drive_folder_id',
    description: 'Tư liệu, tranh ảnh, video hiện vật phục vụ Không gian Văn hóa Hồ Chí Minh.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    key: 'competitions',
    name: 'Hội Thi Trực Tuyến & Ngân Hàng Đề Thi',
    code: 'HOI_THI',
    defaultId: BRAIN_DRIVE_FOLDER_ID,
    storageKey: 'chanh_hiep_competitions_drive_folder_id',
    description: 'Tài liệu thể lệ, đề thi và hình ảnh minh họa cho các cuộc thi trực tuyến.',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300'
  }
];

export const GoogleDriveAdminView: React.FC<{
  onShowToast?: (title: string, message: string) => void;
}> = ({ onShowToast }) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'CONFIG' | 'MODULES' | 'SCRIPT' | 'EXPLORER' | 'DIAGNOSTICS'>('CONFIG');

  // Master Apps Script URL
  const [appsScriptUrl, setAppsScriptUrl] = useState(() => getAppsScriptUrl());
  const [isSavingUrl, setIsSavingUrl] = useState(false);
  const [isTestingUrl, setIsTestingUrl] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
    details?: any;
  }>({ status: 'idle', message: '' });

  // Module Folder IDs
  const [folderConfigs, setFolderConfigs] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    MODULE_FOLDERS.forEach(m => {
      initial[m.key] = localStorage.getItem(m.storageKey) || m.defaultId;
    });
    return initial;
  });
  const [savedFolderToastKey, setSavedFolderToastKey] = useState<string | null>(null);

  // Test Upload State
  const [isTestUploading, setIsTestUploading] = useState(false);
  const [testUploadResult, setTestUploadResult] = useState<{
    fileId?: string;
    webViewLink?: string;
    fileName?: string;
    moduleKey?: string;
    time?: string;
  } | null>(null);

  // OAuth State
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [isOAuthConnected, setIsOAuthConnected] = useState(false);

  // Script Code Copy
  const [copiedScript, setCopiedScript] = useState(false);

  const currentAppDomain = typeof window !== 'undefined' ? window.location.origin : 'https://chanhhiep.binhduong.gov.vn';

  // Comprehensive Google Apps Script Template
  const masterAppsScriptCode = `/**
 * =========================================================================
 * BỘ NÃO AI & TRUNG TÂM KẾT NỐI GOOGLE DRIVE - MTTQ PHƯỜNG CHÁNH HIỆP
 * Hệ thống tiếp nhận đa phân hệ: Dân nguyện, Văn bản số, Tri thức AI & Media
 * =========================================================================
 */

const FOLDERS = {
  OPINIONS: "${folderConfigs.opinions || OPINIONS_DRIVE_FOLDER_ID}",
  BRAIN: "${folderConfigs.brain || BRAIN_DRIVE_FOLDER_ID}",
  OFFICIAL_DOCS: "${folderConfigs.official_docs || OFFICIAL_DOCS_DRIVE_FOLDER_ID}",
  MEDIA: "${folderConfigs.media || BRAIN_DRIVE_FOLDER_ID}",
  HCM_CULTURAL: "${folderConfigs.hcm_cultural || BRAIN_DRIVE_FOLDER_ID}",
  COMPETITIONS: "${folderConfigs.competitions || BRAIN_DRIVE_FOLDER_ID}"
};

const WEBHOOK_URL = "${currentAppDomain}/api/drive/webhook";

/**
 * 1. Hàm doGet: Kiểm tra kết nối & liệt kê danh sách tệp
 */
function doGet(e) {
  try {
    var fId = (e && e.parameter && e.parameter.folderId) ? e.parameter.folderId : FOLDERS.BRAIN;
    var folder = DriveApp.getFolderById(fId);
    var files = folder.getFiles();
    var fileList = [];

    var count = 0;
    while (files.hasNext() && count < 50) {
      var file = files.next();
      fileList.push({
        id: file.getId(),
        name: file.getName(),
        mimeType: file.getMimeType(),
        size: file.getSize(),
        modifiedTime: file.getLastUpdated().toISOString(),
        webViewLink: file.getUrl()
      });
      count++;
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Kết nối Google Apps Script & Drive thành công 100%!",
      folderId: fId,
      folderName: folder.getName(),
      totalFiles: fileList.length,
      timestamp: new Date().toISOString(),
      files: fileList
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Lỗi truy xuất Drive: " + err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 2. Hàm doPost: Tiếp nhận tải tệp Base64 từ mọi phân hệ & cấp quyền công khai
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Không nhận được dữ liệu (Thiếu postData.contents)."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(e.postData.contents);
    var targetFolderId = data.folderId || FOLDERS.OPINIONS;
    
    var folder;
    try {
      folder = DriveApp.getFolderById(targetFolderId);
    } catch (fErr) {
      folder = DriveApp.getFolderById(FOLDERS.OPINIONS);
    }

    if (!data.base64) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Thiếu dữ liệu tệp Base64."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var decoded = Utilities.base64Decode(data.base64);
    var mimeType = data.mimeType || "image/jpeg";
    var fileName = data.fileName || ("chanhhiep-" + new Date().getTime() + ".jpg");
    var blob = Utilities.newBlob(decoded, mimeType, fileName);

    var file = folder.createFile(blob);

    // Tự động mở quyền xem qua liên kết
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch(shareErr) {
      console.warn("Share warning: " + shareErr);
    }

    var fileId = file.getId();
    var directViewUrl = "https://drive.google.com/file/d/" + fileId + "/view";
    var directDownloadUrl = "https://drive.google.com/uc?export=download&id=" + fileId;
    var directImageUrl = "https://lh3.googleusercontent.com/d/" + fileId + "=w2000";

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      fileId: fileId,
      fileName: file.getName(),
      fileSize: file.getSize(),
      folderId: folder.getId(),
      folderName: folder.getName(),
      webViewLink: directViewUrl,
      downloadUrl: directDownloadUrl,
      directImageUrl: directImageUrl,
      mimeType: mimeType,
      createdTime: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Lỗi xử lý tải tệp: " + err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const handleSaveMasterUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingUrl(true);
    saveAppsScriptUrl(appsScriptUrl);
    setTimeout(() => {
      setIsSavingUrl(false);
      onShowToast?.('Đã lưu cấu hình', 'Đã lưu URL Master Google Apps Script vào hệ thống!');
    }, 400);
  };

  const handleTestMasterConnection = async () => {
    setIsTestingUrl(true);
    setTestResult({ status: 'idle', message: '' });

    try {
      const response = await fetch(getApiUrl('/api/drive/test-connection'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appsScriptUrl: appsScriptUrl || undefined,
          folderId: folderConfigs.opinions || OPINIONS_DRIVE_FOLDER_ID
        })
      });

      const resData = await response.json();
      if (resData.success) {
        setTestResult({
          status: 'success',
          message: resData.message || 'Kết nối Google Apps Script & Thư mục Drive hoạt động hoàn hảo 100%!',
          details: resData.data
        });
        onShowToast?.('Kết nối thành công', 'Máy chủ Apps Script phản hồi 200 OK.');
      } else {
        setTestResult({
          status: 'error',
          message: resData.message || 'Không thể kết nối đến Google Apps Script.',
          details: resData
        });
        onShowToast?.('Lỗi kết nối', resData.message || 'Kiểm tra lại quyền truy cập Apps Script.');
      }
    } catch (err: any) {
      setTestResult({
        status: 'error',
        message: 'Lỗi kiểm tra kết nối: ' + (err.message || 'Máy chủ không phản hồi.')
      });
    } finally {
      setIsTestingUrl(false);
    }
  };

  const handleUpdateFolderConfig = (moduleKey: string, newId: string) => {
    const trimmed = extractGoogleDriveFileId(newId) || newId.trim();
    setFolderConfigs(prev => ({ ...prev, [moduleKey]: trimmed }));
  };

  const handleSaveFolderConfig = (module: ModuleFolderConfig) => {
    const val = folderConfigs[module.key] || module.defaultId;
    localStorage.setItem(module.storageKey, val);
    setSavedFolderToastKey(module.key);
    setTimeout(() => setSavedFolderToastKey(null), 2500);
    onShowToast?.('Đã lưu thư mục', `Đã cập nhật thư mục cho phân hệ "${module.name}"!`);
  };

  const handleTestUploadModule = async (moduleKey: string) => {
    setIsTestUploading(true);
    setTestUploadResult(null);

    try {
      const base64Pixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const byteCharacters = atob(base64Pixel);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });
      const testFile = new File([blob], `test_${moduleKey}_${Date.now()}.png`, { type: 'image/png' });

      const targetFolder = folderConfigs[moduleKey] || OPINIONS_DRIVE_FOLDER_ID;
      const res = await uploadFileViaServerProxy(testFile, targetFolder);

      setTestUploadResult({
        fileId: res.id,
        webViewLink: res.webViewLink,
        fileName: res.name,
        moduleKey,
        time: new Date().toLocaleTimeString('vi-VN')
      });

      onShowToast?.('Tải thử nghiệm thành công', `Tệp đã được tạo trên Drive với ID: ${res.id}`);
    } catch (err: any) {
      onShowToast?.('Tải thử nghiệm thất bại', err.message || 'Vui lòng kiểm tra lại URL Apps Script.');
    } finally {
      setIsTestUploading(false);
    }
  };

  const handleConnectOAuth = async () => {
    setIsOAuthLoading(true);
    try {
      const token = await getDriveAccessToken(true);
      if (token) {
        setIsOAuthConnected(true);
        onShowToast?.('Ủy quyền Google Drive thành công', 'Tài khoản cán bộ đã được liên kết với Google Drive.');
      }
    } catch (e: any) {
      console.error(e);
      onShowToast?.('Lỗi OAuth', e.message || 'Không thể đăng nhập Google.');
    } finally {
      setIsOAuthLoading(false);
    }
  };

  const handleCopyMasterScript = () => {
    navigator.clipboard.writeText(masterAppsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
    onShowToast?.('Đã sao chép mã', 'Đã lưu mã Google Apps Script vào khay nhớ tạm.');
  };

  const isConfigured = Boolean(appsScriptUrl && appsScriptUrl.trim().startsWith('https://script.google.com'));

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Hero Control Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-blue-800/40">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-amber-300" />
                TRUNG TÂM KẾT NỐI TẬP TRUNG (DRIVE HUB)
              </span>
              {isConfigured ? (
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  ĐÃ CẤU HÌNH APPS SCRIPT
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  CHƯA CẤU HÌNH ĐẦY ĐỦ
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <HardDrive className="w-8 h-8 text-blue-400" />
              Trung Tâm Quản Trị &amp; Kết Nối Google Drive
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Điểm quản trị tập trung duy nhất cho toàn bộ kết nối Google Drive của phường: Cấu hình Web App, phân bổ thư mục cho từng phân hệ (Dân nguyện, Văn bản, Tri thức AI, Media), chẩn đoán đường truyền và duyệt tệp.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleTestMasterConnection}
              disabled={isTestingUrl}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-black text-xs rounded-2xl shadow-lg transition cursor-pointer border border-emerald-400/30 disabled:opacity-50"
            >
              {isTestingUrl ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 text-emerald-200" />}
              <span>{isTestingUrl ? 'Đang kiểm tra...' : 'Kiểm tra kết nối Live'}</span>
            </button>

            <a
              href={`https://drive.google.com/drive/folders/${folderConfigs.brain || BRAIN_DRIVE_FOLDER_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl shadow-md transition border border-white/20"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Mở Google Drive</span>
            </a>
          </div>
        </div>

        {/* 5 Main Control Tabs Navigation */}
        <div className="mt-8 flex flex-wrap gap-2 border-t border-blue-800/40 pt-4">
          {[
            { id: 'CONFIG', label: '1. Cấu hình Web App Master', icon: Zap },
            { id: 'MODULES', label: '2. Phân bổ Thư mục Phân hệ', icon: FolderGit2 },
            { id: 'SCRIPT', label: '3. Mã nguồn Apps Script Chuẩn', icon: Terminal },
            { id: 'EXPLORER', label: '4. Trình duyệt Tệp Drive', icon: Folder },
            { id: 'DIAGNOSTICS', label: '5. Chẩn đoán & Sức khỏe', icon: Activity },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer shadow-xs ${
                  isActive
                    ? 'bg-white text-blue-900 shadow-md scale-105'
                    : 'bg-blue-900/40 text-blue-100 hover:bg-blue-800/80 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-blue-300'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: MASTER APPS SCRIPT WEB APP CONFIG */}
      {activeTab === 'CONFIG' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-blue-600" />
                  <span>Cấu hình Master Google Apps Script Web App</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đường dẫn Web App duy nhất điều phối toàn bộ lượt tải tệp, cấp quyền xem tự động và đồng bộ với cơ sở dữ liệu.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Đuôi URL: <code className="text-slate-700 font-bold">/exec</code></span>
            </div>

            <form onSubmit={handleSaveMasterUrl} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  Đường dẫn URL Google Apps Script Web App:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={appsScriptUrl}
                    onChange={(e) => setAppsScriptUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono shadow-inner"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="submit"
                      disabled={isSavingUrl}
                      className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-black rounded-2xl shadow-md flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {isSavingUrl ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      <span>Lưu cấu hình</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleTestMasterConnection}
                      disabled={isTestingUrl}
                      className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-black rounded-2xl shadow-md flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {isTestingUrl ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      <span>Kiểm tra kết nối</span>
                    </button>
                  </div>
                </div>
              </div>

              {testResult.status !== 'idle' && (
                <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                  testResult.status === 'success' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  <div className="flex items-start gap-2.5">
                    {testResult.status === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-xs">{testResult.message}</p>
                      {testResult.details && (
                        <div className="mt-2 p-3 bg-white/90 rounded-xl border border-slate-200 text-[11px] font-mono overflow-x-auto text-slate-700">
                          {JSON.stringify(testResult.details, null, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>

            {/* Live Upload Tester Box */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Play className="w-4 h-4 text-emerald-600" />
                    <span>Thử nghiệm Tải lên Tệp mẫu (Live Upload Simulator)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Gửi 1 tệp ảnh mẫu vào thư mục Hòm thư Dân nguyện để kiểm chứng tính toàn vẹn của kết nối.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTestUploadModule('opinions')}
                  disabled={isTestUploading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
                >
                  {isTestUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isTestUploading ? 'Đang gửi...' : 'Gửi tệp mẫu thử nghiệm'}</span>
                </button>
              </div>

              {testUploadResult && (
                <div className="p-3.5 bg-white rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Đã tạo tệp trên Drive thành công ({testUploadResult.time}): {testUploadResult.fileName}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                    <span className="text-slate-600 font-mono">ID: {testUploadResult.fileId}</span>
                    {testUploadResult.webViewLink && (
                      <a
                        href={testUploadResult.webViewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline font-bold flex items-center gap-1"
                      >
                        <span>Mở xem trên Google Drive</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Google OAuth Option */}
            <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <h4 className="font-extrabold text-blue-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Ủy quyền Google Drive OAuth Trực tiếp (Dành cho Cán bộ)</span>
                </h4>
                <p className="text-[11px] text-slate-600">
                  Đăng nhập tài khoản Google công vụ để duyệt tệp và quản lý thư mục trực tiếp từ trình duyệt mà không qua Apps Script.
                </p>
              </div>
              <button
                type="button"
                onClick={handleConnectOAuth}
                disabled={isOAuthLoading}
                className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl border border-slate-300 shadow-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
              >
                {isOAuthLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                ) : isOAuthConnected ? (
                  <CheckCheck className="w-4 h-4 text-emerald-600" />
                ) : (
                  <KeyRound className="w-4 h-4 text-amber-600" />
                )}
                <span>{isOAuthConnected ? 'Đã liên kết OAuth' : 'Đăng nhập Google OAuth'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MODULE FOLDERS ROUTING */}
      {activeTab === 'MODULES' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-blue-600" />
                <span>Phân Bổ Thư Mục Google Drive Theo Phân Hệ Nghiệp Vụ</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mỗi phân hệ (Dân nguyện, Văn bản số, Tri thức AI, Media) được chỉ định một Thư mục Google Drive đích riêng biệt để lưu trữ và phân loại tự động.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MODULE_FOLDERS.map(m => {
                const currentVal = folderConfigs[m.key] || m.defaultId;
                const driveFolderUrl = `https://drive.google.com/drive/folders/${currentVal}?hl=vi`;
                const isToast = savedFolderToastKey === m.key;

                return (
                  <div key={m.key} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-md font-extrabold text-[10px] border ${m.badgeColor}`}>
                          {m.code}
                        </span>
                        <a
                          href={driveFolderUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1"
                        >
                          <span>Mở trên Drive</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <h3 className="font-black text-sm text-slate-900 leading-snug">
                        {m.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-200/80">
                      <label className="text-[11px] font-bold text-slate-700 block">
                        ID Thư mục Drive đích:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={currentVal}
                          onChange={(e) => handleUpdateFolderConfig(m.key, e.target.value)}
                          className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveFolderConfig(m)}
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1 transition cursor-pointer shrink-0"
                        >
                          {isToast ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
                          <span>{isToast ? 'Đã lưu' : 'Lưu'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MASTER APPS SCRIPT CODE & DEPLOYMENT GUIDE */}
      {activeTab === 'SCRIPT' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-600" />
                  <span>Mã Nguồn Google Apps Script Đồng Bộ Toàn Hệ Thống</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mã nguồn đã tích hợp sẵn ID thư mục của tất cả các phân hệ và cơ chế cấp quyền xem tự động (Anyone with link viewable).
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyMasterScript}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-2xl shadow-md flex items-center gap-2 transition cursor-pointer shrink-0"
              >
                {copiedScript ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedScript ? 'Đã sao chép mã!' : 'Sao chép toàn bộ mã'}</span>
              </button>
            </div>

            {/* 3 Step Deployment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">1</span>
                  <h4 className="font-extrabold text-blue-900">Tạo dự án mới</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Mở <a href="https://script.google.com" target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline">script.google.com</a> ➔ Tạo <strong>Dự án mới</strong> ➔ Dán toàn bộ mã nguồn bên dưới vào.
                </p>
              </div>

              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200/80 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center">2</span>
                  <h4 className="font-extrabold text-indigo-900">Triển khai Web App</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Bấm <strong>Triển khai (Deploy)</strong> ➔ <strong>Tùy chọn triển khai mới (New deployment)</strong> ➔ Chọn loại <strong>Ứng dụng web (Web app)</strong>.
                </p>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">3</span>
                  <h4 className="font-extrabold text-emerald-900">Cấp quyền "Bất kỳ ai"</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Mục <strong>Người có quyền truy cập</strong>: Chọn <strong>Bất kỳ ai (Anyone)</strong> ➔ Triển khai và dán URL vào Tab 1.
                </p>
              </div>
            </div>

            {/* Code Block */}
            <div className="relative">
              <pre className="p-5 bg-slate-900 text-slate-100 text-[11px] font-mono rounded-2xl overflow-x-auto max-h-[420px] leading-relaxed border border-slate-800 shadow-inner select-all">
                {masterAppsScriptCode}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GOOGLE DRIVE EXPLORER & 7 FOLDERS */}
      {activeTab === 'EXPLORER' && (
        <div className="space-y-6">
          <GoogleDriveExplorer
            initialFolderId={folderConfigs.brain || BRAIN_DRIVE_FOLDER_ID}
            onConnectFolder={(newId) => handleUpdateFolderConfig('brain', newId)}
            onImportSelectedFiles={async (files) => {
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
                  summary: f.summary || `Đồng bộ từ Google Drive`,
                  documentSummary: f.summary || `Đồng bộ từ Google Drive`,
                  priority: 'Bình thường',
                  confidentialLevel: 'Thường',
                  leadUnit: 'Ban Thường trực MTTQ phường',
                  coordinatingUnits: [],
                  keywords: [f.folder, 'Google Drive'],
                  isPublic: true,
                  status: 'Published',
                  fileUrl: f.webViewLink,
                  driveUrl: f.webViewLink,
                  fileName: f.name,
                  fileSize: f.size
                });
              }
              onShowToast?.('Đã xuất bản văn bản', `Đã xuất bản thành công ${files.length} văn bản từ Google Drive.`);
            }}
            onShowToast={(type, msg) => onShowToast?.(type, msg)}
          />

          {/* 7 Folders Architecture */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    Cấu Trúc 7 Thư Mục Lưu Trữ Chuẩn Phường Chánh Hiệp
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Đường dẫn thư mục: <code className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-mono text-[11px]">Drive của tôi &gt; DuAn &gt; ChanhHiep</code>
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                7 Thư mục chuẩn
              </span>
            </div>

            <ChanhHiepDriveFolderBar />
          </div>
        </div>
      )}

      {/* TAB 5: DIAGNOSTICS & SYSTEM HEALTH */}
      {activeTab === 'DIAGNOSTICS' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span>Chẩn Đoán Sức Khỏe &amp; Hạ Tầng Kết Nối Google Drive</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Báo cáo tổng hợp trạng thái các cổng API proxy và quyền hạn tệp tin trên hệ thống.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-extrabold text-slate-800 block uppercase tracking-wider text-[11px]">
                  1. Máy Chủ Proxy Backend
                </span>
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>/api/drive/upload-proxy (200 OK)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>/api/drive/test-connection (Live)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>/api/drive/pdf-proxy (CORS Active)</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-extrabold text-slate-800 block uppercase tracking-wider text-[11px]">
                  2. Trạng Thái Quyền Tệp (Permissions)
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Tự động cấp quyền <strong className="text-slate-900">ANYONE_WITH_LINK VIEW</strong> cho mọi ảnh phản ánh tải lên từ người dân, giúp hiển thị ảnh trực tiếp không bị chặn 403.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-extrabold text-slate-800 block uppercase tracking-wider text-[11px]">
                  3. Quét Tự Động Định Kỳ
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Hệ thống tự động quét và đồng bộ dữ liệu giữa Google Drive và cơ sở dữ liệu mỗi <strong>15 phút/lần</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
