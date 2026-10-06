import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink, 
  Terminal, 
  Save, 
  CheckCircle2, 
  Folder, 
  Zap,
  HelpCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
  Loader2,
  HardDrive,
  RefreshCw,
  UploadCloud,
  FileCheck,
  KeyRound,
  Play
} from 'lucide-react';
import { 
  getAppsScriptUrl, 
  saveAppsScriptUrl, 
  getDriveAccessToken, 
  uploadFileViaServerProxy 
} from '../../lib/googleDriveService';
import { getApiUrl } from '../../lib/api';

interface GoogleDriveOpinionConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderId?: string;
  folderUrl?: string;
  onSuccessToast?: (title: string, message: string) => void;
}

export const GoogleDriveOpinionConnectionModal: React.FC<GoogleDriveOpinionConnectionModalProps> = ({
  isOpen,
  onClose,
  folderId = '1esbw7TuyePZEFmNe7oimUav-AIyeVv4B',
  folderUrl = 'https://drive.google.com/drive/folders/1esbw7TuyePZEFmNe7oimUav-AIyeVv4B?hl=vi',
  onSuccessToast
}) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedFolderId, setCopiedFolderId] = useState(false);
  const [scriptUrlInput, setScriptUrlInput] = useState(() => getAppsScriptUrl());
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
    details?: any;
  }>({ status: 'idle', message: '' });

  const [isTestUploading, setIsTestUploading] = useState(false);
  const [testUploadResult, setTestUploadResult] = useState<{
    fileId?: string;
    webViewLink?: string;
    fileName?: string;
    time?: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'SETUP' | 'SCRIPT_CODE' | 'GUIDE'>('SETUP');
  const [isOAuthConnecting, setIsOAuthConnecting] = useState(false);
  const [oAuthConnected, setOAuthConnected] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setScriptUrlInput(getAppsScriptUrl());
      setTestResult({ status: 'idle', message: '' });
      setTestUploadResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentAppDomain = typeof window !== 'undefined' ? window.location.origin : 'https://chanhhiep.binhduong.gov.vn';

  // Production-ready Google Apps Script specifically optimized for Citizen Opinion folder
  const opinionAppsScriptCode = `/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - TIẾP NHẬN ẢNH PHẢN ÁNH DÂN NGUYỆN (21 KHU PHỐ)
 * Uỷ ban MTTQ Việt Nam Phường Chánh Hiệp
 * Thư mục tiếp nhận mặc định: ${folderId}
 * =========================================================================
 */

const OPINION_FOLDER_ID = "${folderId}";

/**
 * 1. Hàm doGet: Kiểm tra trạng thái máy chủ & kết nối thư mục Drive
 */
function doGet(e) {
  try {
    var fId = (e && e.parameter && e.parameter.folderId) ? e.parameter.folderId : OPINION_FOLDER_ID;
    var folder = DriveApp.getFolderById(fId);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      service: "Google Drive Opinion Upload Bridge",
      folderId: fId,
      folderName: folder.getName(),
      connected: true,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Lỗi kiểm tra thư mục: " + err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 2. Hàm doPost: Tiếp nhận Base64 ảnh tải lên từ người dân, tự động lưu vào Drive và cấp quyền xem
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
    var targetFolderId = data.folderId || OPINION_FOLDER_ID;
    
    var folder;
    try {
      folder = DriveApp.getFolderById(targetFolderId);
    } catch (fErr) {
      folder = DriveApp.getFolderById(OPINION_FOLDER_ID);
    }

    if (!data.base64) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Thiếu dữ liệu tệp Base64."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Giải mã Base64 thành Blob
    var decoded = Utilities.base64Decode(data.base64);
    var mimeType = data.mimeType || "image/jpeg";
    var fileName = data.fileName || ("phan-anh-mttq-" + new Date().getTime() + ".jpg");
    var blob = Utilities.newBlob(decoded, mimeType, fileName);

    // Lưu tệp vào Google Drive
    var file = folder.createFile(blob);
    
    // Tự động mở quyền xem qua link để cán bộ & hệ thống xem ngay lập tức
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

  const handleCopyScript = () => {
    navigator.clipboard.writeText(opinionAppsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
    if (onSuccessToast) {
      onSuccessToast('Đã sao chép mã Apps Script', 'Bạn có thể dán vào script.google.com để triển khai.');
    }
  };

  const handleCopyFolderId = () => {
    navigator.clipboard.writeText(folderId);
    setCopiedFolderId(true);
    setTimeout(() => setCopiedFolderId(false), 2500);
  };

  const handleSaveUrl = () => {
    setIsSaving(true);
    saveAppsScriptUrl(scriptUrlInput);
    setTimeout(() => {
      setIsSaving(false);
      setTestResult({
        status: 'success',
        message: 'Đã lưu cấu hình Google Apps Script URL vào hệ thống!'
      });
      if (onSuccessToast) {
        onSuccessToast('Lưu cấu hình thành công', 'Đã lưu đường dẫn kết nối Google Drive.');
      }
    }, 400);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult({ status: 'idle', message: '' });

    try {
      const response = await fetch(getApiUrl('/api/drive/test-connection'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appsScriptUrl: scriptUrlInput || undefined,
          folderId: folderId
        })
      });

      const resData = await response.json();
      if (resData.success) {
        setTestResult({
          status: 'success',
          message: resData.message || 'Kết nối Google Apps Script & Thư mục Drive hoạt động hoàn hảo!',
          details: resData.data
        });
        if (onSuccessToast) {
          onSuccessToast('Kết nối thành công', 'Máy chủ Apps Script phản hồi 200 OK.');
        }
      } else {
        setTestResult({
          status: 'error',
          message: resData.message || 'Không thể kết nối đến Google Apps Script.',
          details: resData
        });
      }
    } catch (err: any) {
      setTestResult({
        status: 'error',
        message: 'Lỗi kiểm tra kết nối: ' + (err.message || 'Máy chủ không phản hồi.')
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestUpload = async () => {
    setIsTestUploading(true);
    setTestUploadResult(null);

    try {
      // Create a small 1x1 png test file
      const base64Pixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const byteCharacters = atob(base64Pixel);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });
      const testFile = new File([blob], `test_kiem_tra_ket_noi_${Date.now()}.png`, { type: 'image/png' });

      const uploadResult = await uploadFileViaServerProxy(testFile, folderId);

      setTestUploadResult({
        fileId: uploadResult.id,
        webViewLink: uploadResult.webViewLink,
        fileName: uploadResult.name,
        time: new Date().toLocaleTimeString('vi-VN')
      });

      setTestResult({
        status: 'success',
        message: 'Tải tệp mẫu lên Google Drive thành công 100%!'
      });

      if (onSuccessToast) {
        onSuccessToast('Tải thử nghiệm thành công', `Tệp đã được ghi lên thư mục Drive với ID: ${uploadResult.id}`);
      }
    } catch (err: any) {
      setTestResult({
        status: 'error',
        message: 'Tải thử nghiệm thất bại: ' + (err.message || 'Vui lòng kiểm tra lại URL Apps Script.')
      });
    } finally {
      setIsTestUploading(false);
    }
  };

  const handleConnectOAuth = async () => {
    setIsOAuthConnecting(true);
    try {
      const token = await getDriveAccessToken(true);
      if (token) {
        setOAuthConnected(true);
        if (onSuccessToast) {
          onSuccessToast('Ủy quyền OAuth thành công', 'Tài khoản Google Cán bộ đã được kết nối với Google Drive.');
        }
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsOAuthConnecting(false);
    }
  };

  const isConfigured = Boolean(scriptUrlInput && scriptUrlInput.trim().startsWith('https://script.google.com'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
              <HardDrive className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-500/30 text-amber-200 border border-blue-400/30 rounded-full text-[10px] font-black uppercase tracking-wider">
                  KÍCH HOẠT KẾT NỐI DRIVE
                </span>
                {isConfigured ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 rounded-full text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                    Đã cấu hình
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-200 border border-amber-400/30 rounded-full text-[10px] font-bold">
                    <Clock className="w-3 h-3 text-amber-300" />
                    Chưa kích hoạt
                  </span>
                )}
              </div>
              <h3 className="text-lg font-black text-white flex items-center gap-2 mt-0.5">
                Cấu hình Kết nối Google Drive - Hòm Thư Dân Nguyện
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 shrink-0">
          <button
            onClick={() => setActiveTab('SETUP')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'SETUP'
                ? 'border-blue-600 text-blue-700 bg-white font-extrabold shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>1. Cấu hình & Kiểm tra Kết nối</span>
          </button>
          <button
            onClick={() => setActiveTab('SCRIPT_CODE')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'SCRIPT_CODE'
                ? 'border-blue-600 text-blue-700 bg-white font-extrabold shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4 text-indigo-500" />
            <span>2. Mã nguồn Apps Script (Sẵn sàng)</span>
          </button>
          <button
            onClick={() => setActiveTab('GUIDE')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'GUIDE'
                ? 'border-blue-600 text-blue-700 bg-white font-extrabold shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <span>3. Hướng dẫn Triển khai 3 Bước</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Target Folder Banner */}
          <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 rounded-2xl border border-blue-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs mt-0.5 shrink-0">
                <Folder className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-black text-blue-700 uppercase tracking-wider">
                  THƯ MỤC LƯU TRỮ GOOGLE DRIVE ĐÍCH (21 KHU PHỐ)
                </span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">
                  Thư mục: <code className="px-2 py-0.5 bg-white border border-blue-200 rounded font-mono text-blue-700 text-[11px]">{folderId}</code>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mọi ảnh phản ánh, đính kèm từ form dân nguyện sẽ tự động lưu và cấp quyền xem tại đây.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyFolderId}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 shadow-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedFolderId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFolderId ? 'Đã chép ID' : 'Sao chép ID'}</span>
              </button>
              <a
                href={folderUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Mở thư mục Drive</span>
              </a>
            </div>
          </div>

          {activeTab === 'SETUP' && (
            <div className="space-y-4">
              {/* Web App URL Input Card */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-blue-600" />
                    <span>Đường dẫn Web App Google Apps Script (URL):</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Kết thúc bằng <code className="text-slate-600 font-mono">/exec</code></span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={scriptUrlInput}
                    onChange={(e) => setScriptUrlInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveUrl}
                      disabled={isSaving}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
                    >
                      {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>Lưu URL</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={isTesting}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
                    >
                      {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      <span>Kiểm tra kết nối</span>
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  URL này dùng để tiếp nhận các tệp ảnh do người dân tải lên thông qua máy chủ đệm (Proxy) an toàn, tránh hoàn toàn yêu cầu đăng nhập OAuth cho công dân.
                </p>
              </div>

              {/* Realtime Diagnostics & Live Test Feedback */}
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
                        <div className="mt-2 p-2.5 bg-white/80 rounded-xl border border-slate-200 text-[11px] font-mono overflow-x-auto text-slate-700">
                          {JSON.stringify(testResult.details, null, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Box: Test Upload 1-Pixel */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-emerald-600" />
                      <span>Thử nghiệm tải lên tệp mẫu vào Google Drive</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Hệ thống sẽ gửi một tệp kiểm tra để xác thực rằng quyền ghi và link xem ảnh hoạt động chính xác.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTestUpload}
                    disabled={isTestUploading}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
                  >
                    {isTestUploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    <span>{isTestUploading ? 'Đang tải thử...' : 'Tải tệp mẫu ngay'}</span>
                  </button>
                </div>

                {testUploadResult && (
                  <div className="p-3.5 bg-white rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1.5 mt-2">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <FileCheck className="w-4 h-4" />
                      <span>Đã tải thành công tệp: {testUploadResult.fileName}</span>
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
                          <span>Xem tệp trên Google Drive</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* OAuth Fallback Option for Admin Staff */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Ủy quyền Google Drive OAuth Trực tiếp (Dành cho Cán bộ)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Cán bộ có thể đăng nhập tài khoản Google công vụ để duyệt danh sách tệp trực tiếp trong bảng quản trị.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleConnectOAuth}
                  disabled={isOAuthConnecting}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-300 shadow-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
                >
                  {isOAuthConnecting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  ) : oAuthConnected ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  <span>{oAuthConnected ? 'Đã ủy quyền OAuth' : 'Đăng nhập Google OAuth'}</span>
                </button>
              </div>

            </div>
          )}

          {activeTab === 'SCRIPT_CODE' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Mã nguồn Google Apps Script (Sẵn sàng triển khai)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Mã đã được cấu hình sẵn thư mục ID: <code className="font-mono text-blue-600 font-bold">{folderId}</code> và xử lý Base64, cấp quyền xem công khai.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Đã sao chép!' : 'Sao chép toàn bộ mã'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 bg-slate-900 text-slate-100 text-[11px] font-mono rounded-2xl overflow-x-auto max-h-[380px] leading-relaxed border border-slate-800 shadow-inner select-all">
                  {opinionAppsScriptCode}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'GUIDE' && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                
                {/* Step 1 */}
                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                      1
                    </span>
                    <h5 className="font-extrabold text-blue-900">Tạo Apps Script mới</h5>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Truy cập <a href="https://script.google.com" target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">script.google.com</a>, bấm <strong>Dự án mới (New project)</strong>.
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Xóa toàn bộ mã mặc định và dán mã ở Tab <strong>"2. Mã nguồn Apps Script"</strong>.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                      2
                    </span>
                    <h5 className="font-extrabold text-indigo-900">Triển khai Web App</h5>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Bấm nút <strong>Triển khai (Deploy)</strong> &gt; <strong>Tùy chọn triển khai mới (New deployment)</strong>.
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Chọn loại: <strong>Ứng dụng web (Web app)</strong>.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                      3
                    </span>
                    <h5 className="font-extrabold text-emerald-900">Cấp quyền "Bất kỳ ai"</h5>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Mục <strong>Người có quyền truy cập (Who has access)</strong>: Chọn <strong>Bất kỳ ai (Anyone)</strong>.
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Bấm <strong>Triển khai</strong>, sao chép URL ứng dụng web và dán vào Tab 1 rồi bấm <strong>Lưu URL</strong>.
                  </p>
                </div>

              </div>

              {/* Note callout */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-900 space-y-1">
                  <p className="font-bold">Lưu ý quan trọng về quyền truy cập (Tránh lỗi 403):</p>
                  <p className="leading-relaxed">
                    Cần đảm bảo mục "Who has access" là <strong>"Anyone" (Bất kỳ ai)</strong> để người dân khi gửi phản ánh hiện trường không bị yêu cầu đăng nhập tài khoản Google.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Tích hợp lưu trữ Google Drive MTTQ Phường Chánh Hiệp</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
