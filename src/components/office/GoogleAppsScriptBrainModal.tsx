import React, { useState } from 'react';
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
  Cpu, 
  Zap,
  HelpCircle,
  Clock
} from 'lucide-react';
import { getAppsScriptUrl, saveAppsScriptUrl } from '../../lib/googleDriveService';

interface GoogleAppsScriptBrainModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderId?: string;
  folderUrl?: string;
  onSuccessToast?: (title: string, message: string) => void;
}

export const GoogleAppsScriptBrainModal: React.FC<GoogleAppsScriptBrainModalProps> = ({
  isOpen,
  onClose,
  folderId = '1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G',
  folderUrl = 'https://drive.google.com/drive/folders/1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G?hl=vi',
  onSuccessToast
}) => {
  const [copied, setCopied] = useState(false);
  const [scriptUrlInput, setScriptUrlInput] = useState(() => getAppsScriptUrl());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentAppDomain = typeof window !== 'undefined' ? window.location.origin : 'https://chanhhiep.binhduong.gov.vn';

  // Customized, production-ready Google Apps Script template for folder 1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G
  const scriptCode = `/**
 * =========================================================================
 * BỘ NÃO AI & HỆ THỐNG TẢI LÊN GOOGLE DRIVE - MTTQ PHƯỜNG CHÁNH HIỆP
 * Thư mục tiếp nhận: \${folderId}
 * Tự động tiếp nhận ảnh dân sinh, quét file, cấp quyền xem công khai & đồng bộ
 * =========================================================================
 */

const TARGET_FOLDER_ID = "\${folderId}";
const AI_WEBHOOK_URL = "\${currentAppDomain}/api/drive/webhook";

/**
 * 1. Hàm doGet - Cho phép kiểm tra trạng thái hoặc truy vấn danh sách tệp
 */
function doGet(e) {
  try {
    var fId = (e && e.parameter && e.parameter.folderId) ? e.parameter.folderId : TARGET_FOLDER_ID;
    var folder = DriveApp.getFolderById(fId);
    var files = folder.getFiles();
    var fileList = [];

    while (files.hasNext()) {
      var file = files.next();
      fileList.push({
        id: file.getId(),
        name: file.getName(),
        mimeType: file.getMimeType(),
        size: file.getSize(),
        sizeFormatted: formatBytes(file.getSize()),
        modifiedTime: file.getLastUpdated().toISOString(),
        webViewLink: file.getUrl(),
        downloadUrl: file.getDownloadUrl()
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      folderId: fId,
      folderName: folder.getName(),
      totalFiles: fileList.length,
      timestamp: new Date().toISOString(),
      files: fileList
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 2. Hàm doPost - Tiếp nhận tải ảnh/tệp Base64 từ hệ thống vào Google Drive
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Không nhận được nội dung tải lên (Thiếu postData.contents)."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(e.postData.contents);
    var fId = data.folderId || TARGET_FOLDER_ID;
    var folder;
    try {
      folder = DriveApp.getFolderById(fId);
    } catch (fErr) {
      folder = DriveApp.getFolderById(TARGET_FOLDER_ID);
    }

    if (data.action === "scan_now") {
      return ContentService.createTextOutput(JSON.stringify(syncBrainDriveFolder(fId)))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var base64Data = data.base64 || data.fileData || "";
    if (!base64Data) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Dữ liệu Base64 rỗng."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Tạo tệp từ Base64
    var blob = Utilities.newBlob(
      Utilities.base64Decode(base64Data),
      data.mimeType || "image/jpeg",
      data.fileName || ("anh_minh_chung_" + Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd_HHmmss") + ".jpg")
    );

    var createdFile = folder.createFile(blob);

    // Cấp quyền: Bất kỳ ai có liên kết đều xem được (Để Cán bộ xem được ảnh)
    try {
      createdFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (permErr) {
      console.warn("Lưu ý về quyền chia sẻ: " + permErr.toString());
    }

    var fileId = createdFile.getId();
    var fileUrl = createdFile.getUrl();

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      fileId: fileId,
      fileName: createdFile.getName(),
      fileUrl: fileUrl,
      webViewLink: fileUrl,
      directImageUrl: "https://lh3.googleusercontent.com/d/" + fileId + "=w2000",
      downloadUrl: "https://drive.google.com/uc?export=download&id=" + fileId,
      message: "Đã lưu ảnh thành công vào Google Drive Phường Chánh Hiệp!"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 3. Tự động quét toàn bộ tệp trong Drive và đẩy Webhook về Bộ não AI
 */
function syncBrainDriveFolder(fId) {
  var folder = DriveApp.getFolderById(fId || TARGET_FOLDER_ID);
  var files = folder.getFiles();
  var syncedCount = 0;

  while (files.hasNext()) {
    var file = files.next();
    var payload = {
      fileId: file.getId(),
      fileName: file.getName(),
      mimeType: file.getMimeType(),
      folderId: TARGET_FOLDER_ID,
      fileUrl: file.getUrl(),
      lastUpdated: file.getLastUpdated().toISOString()
    };

    try {
      UrlFetchApp.fetch(AI_WEBHOOK_URL, {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      });
      syncedCount++;
    } catch (e) {
      Logger.log("Lỗi gửi Webhook tệp " + file.getName() + ": " + e);
    }
  }

  return { status: "success", syncedCount: syncedCount };
}

/**
 * 4. Tạo Lịch tự động (Trigger) quét 15 phút/lần
 */
function setupAutoSyncTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }

  ScriptApp.newTrigger("syncBrainDriveFolder")
    .timeBased()
    .everyMinutes(15)
    .create();

  Logger.log("Đã bật tự động quét Google Drive 15 phút/lần cho Trợ lý AI Phường Chánh Hiệp!");
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  var k = 1024;
  var sizes = ['B', 'KB', 'MB', 'GB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    if (onSuccessToast) {
      onSuccessToast('Đã sao chép Script!', 'Đã chép mã Google Apps Script Bộ não AI vào khay nhớ tạm.');
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveAppsScriptUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scriptUrlInput.trim()) return;
    saveAppsScriptUrl(scriptUrlInput.trim());
    setSavedSuccess(true);
    if (onSuccessToast) {
      onSuccessToast('Thành công!', 'Đã lưu URL Web App Google Apps Script kết nối Bộ não AI!');
    }
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-4 text-white flex items-center justify-between border-b border-blue-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 backdrop-blur-md rounded-2xl border border-blue-400/30">
              <Cpu className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-300">
                <Sparkles className="w-3 h-3" />
                <span>BỘ NÃO AI TRỢ LÝ PHƯỜNG CHÁNH HIỆP</span>
              </div>
              <h3 className="text-base font-black text-white leading-tight">
                Mã Google Apps Script Tự Động Quét Drive
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-slate-800 text-xs sm:text-sm">
          
          {/* Target Folder Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Folder className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-amber-800 block">Thư mục Drive Bộ não AI đang kết nối:</span>
                <span className="font-mono text-xs font-black text-slate-900">{folderId}</span>
              </div>
            </div>

            <a
              href={folderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 self-start sm:self-auto shadow-xs"
            >
              <span>Xem Thư mục Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Code Viewer with 1-Click Copy */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
                <Terminal className="w-4 h-4 text-blue-600" />
                Mã nguồn Apps Script (Sẵn sàng triển khai):
              </span>

              <button
                type="button"
                onClick={handleCopyCode}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã chép mã!' : 'Sao chép mã Apps Script'}</span>
              </button>
            </div>

            <pre className="bg-slate-900 text-emerald-300 p-4 rounded-2xl font-mono text-[11px] sm:text-xs leading-relaxed overflow-x-auto max-h-60 border border-slate-800 shadow-inner">
              <code>{scriptCode}</code>
            </pre>
          </div>

          {/* 3 Step Instructions */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wide">
              <Zap className="w-4 h-4 text-amber-500" />
              Hướng dẫn 3 bước triển khai siêu tốc (1 phút):
            </h4>

            <ol className="space-y-2 text-xs text-slate-700 list-decimal pl-4 font-medium leading-relaxed">
              <li>
                Mở <a href="https://script.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline">script.google.com</a> ➔ Tạo <strong>Dự án mới (New Project)</strong> ➔ Dán toàn bộ mã ở trên vào.
              </li>
              <li>
                Bấm <strong>Triển khai (Deploy)</strong> ➔ <strong>Xử lý triển khai mới (New Deployment)</strong> ➔ Chọn kiểu <strong>Ứng dụng web (Web App)</strong>.
              </li>
              <li>
                Ở mục <em>Ai có quyền truy cập (Who has access)</em> ➔ Chọn <strong>Mọi người (Anyone)</strong> ➔ Bấm <strong>Triển khai</strong> và chép URL Web App thu được dán vào ô bên dưới.
              </li>
            </ol>
          </div>

          {/* Input WebApp URL */}
          <form onSubmit={handleSaveAppsScriptUrl} className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-3">
            <label className="font-extrabold text-blue-950 text-xs block">
              Dán URL Web App Google Apps Script đã tạo tại đây:
            </label>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={scriptUrlInput}
                onChange={(e) => setScriptUrlInput(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 px-3.5 py-2.5 bg-white rounded-xl border border-blue-300 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shrink-0"
              >
                {savedSuccess ? <CheckCircle2 className="w-4 h-4 text-amber-200" /> : <Save className="w-4 h-4" />}
                <span>{savedSuccess ? 'Đã kết nối!' : 'Lưu URL WebApp'}</span>
              </button>
            </div>
          </form>

        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Tự động quét & đồng bộ dữ liệu mỗi 15 phút</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-900 rounded-xl font-bold text-xs transition cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>

      </div>
    </div>
  );
};
