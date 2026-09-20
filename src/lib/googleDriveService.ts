import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';
import { getApiUrl } from './api';

// Google Drive Provider configured with drive.file scope
export const googleDriveProvider = new GoogleAuthProvider();
googleDriveProvider.addScope('https://www.googleapis.com/auth/drive.file');

// Target root folder ID on Google Drive (DuAn > ChanhHiep)
export const DEFAULT_DRIVE_FOLDER_ID = '1TNEc-8JYkF17R44igkinTIZAmFEjSmOL';
export const DEFAULT_DRIVE_FOLDER_URL = `https://drive.google.com/drive/folders/${DEFAULT_DRIVE_FOLDER_ID}?hl=vi`;

export interface DriveFolderItem {
  id: string;
  name: string;
  code: 'hcm' | 'kien-thuc-chung' | 'van-ban-lhpn' | 'van-ban-doan' | 'van-ban-mttq' | 'data' | 'uploadvb' | 'root';
  description: string;
  url: string;
  badgeColor: string;
  iconName: string;
  categoryTags?: string[];
  docTypes?: string[];
}

export const CHANH_HIEP_DRIVE_FOLDERS: DriveFolderItem[] = [
  {
    id: DEFAULT_DRIVE_FOLDER_ID,
    name: 'Văn bản MTTQ',
    code: 'van-ban-mttq',
    description: 'Nghị quyết, Kế hoạch, Báo cáo, Công văn MTTQ Việt Nam phường',
    url: DEFAULT_DRIVE_FOLDER_URL,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    iconName: 'FileText',
    categoryTags: ['Hoạt động Mặt trận', 'Đại đoàn kết', 'Giám sát - Phản biện', 'Phong trào thi đua'],
    docTypes: ['Nghị quyết', 'Kế hoạch', 'Báo cáo', 'Công văn', 'Chương trình', 'Hướng dẫn', 'Quyết định']
  },
  {
    id: DEFAULT_DRIVE_FOLDER_ID,
    name: 'HCM',
    code: 'hcm',
    description: 'Tư liệu, bài viết, học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh',
    url: DEFAULT_DRIVE_FOLDER_URL,
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    iconName: 'Award',
    categoryTags: ['Học tập và làm theo Bác']
  },
  {
    id: DEFAULT_DRIVE_FOLDER_ID,
    name: 'Kiến thức chung',
    code: 'kien-thuc-chung',
    description: 'Tài liệu tuyên truyền, cẩm nang nghiệp vụ, kiến thức pháp luật & đời sống',
    url: DEFAULT_DRIVE_FOLDER_URL,
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    iconName: 'BookOpen',
    categoryTags: ['Tuyên truyền & Nghị quyết', 'Dân vận khéo', 'Khu phố đoàn kết']
  },
  {
    id: DEFAULT_DRIVE_FOLDER_ID,
    name: 'Văn bản Hội LHPN',
    code: 'van-ban-lhpn',
    description: 'Văn bản, tài liệu hoạt động Hội Liên hiệp Phụ nữ',
    url: DEFAULT_DRIVE_FOLDER_URL,
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-300',
    iconName: 'Heart',
    docTypes: ['Kế hoạch', 'Thông báo', 'Báo cáo']
  },
  {
    id: DEFAULT_DRIVE_FOLDER_ID,
    name: 'Văn bản Đoàn TNCS Hồ Chí Minh',
    code: 'van-ban-doan',
    description: 'Chương trình hành động, phong trào thanh niên, văn bản Đoàn Phường',
    url: DEFAULT_DRIVE_FOLDER_URL,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    iconName: 'Flame',
    docTypes: ['Kế hoạch', 'Chương trình', 'Thông báo']
  },
  {
    id: DEFAULT_DRIVE_FOLDER_ID,
    name: 'data',
    code: 'data',
    description: 'Kho hình ảnh, infographics, tài nguyên media, video & dữ liệu hệ thống',
    url: DEFAULT_DRIVE_FOLDER_URL,
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    iconName: 'Database'
  },
  {
    id: DEFAULT_DRIVE_FOLDER_ID,
    name: 'uploadvb',
    code: 'uploadvb',
    description: 'Thư mục tiếp nhận nhanh, quét OCR AI và điều phối văn bản số',
    url: DEFAULT_DRIVE_FOLDER_URL,
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    iconName: 'CloudUpload'
  }
];

// Optional default or custom Apps Script Web App URL
export const APPS_SCRIPT_STORAGE_KEY = 'mttq_apps_script_url';

export function getAppsScriptUrl(): string {
  return localStorage.getItem(APPS_SCRIPT_STORAGE_KEY) || '';
}

export function saveAppsScriptUrl(url: string): void {
  localStorage.setItem(APPS_SCRIPT_STORAGE_KEY, url.trim());
}

/**
 * Uploads a file via Google Apps Script Web App Endpoint (No OAuth popup needed)
 */
export async function uploadFileViaAppsScript(
  file: File,
  scriptUrlOverride?: string
): Promise<DriveUploadResult> {
  const scriptUrl = scriptUrlOverride || getAppsScriptUrl();
  if (!scriptUrl) {
    throw new Error('Chưa cấu hình URL Google Apps Script Web App.');
  }

  // Convert File to Base64
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64 = reader.result.split(',')[1] || '';
        resolve(base64);
      } else {
        reject(new Error('Lỗi đọc tệp tin.'));
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });

  const payload = {
    fileName: file.name,
    mimeType: file.type || 'application/octet-stream',
    base64: base64Data,
    folderId: DEFAULT_DRIVE_FOLDER_ID,
  };

  const response = await fetch(scriptUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8', // Apps Script requires text/plain or no preflight for simple CORS
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Gửi tệp sang Apps Script thất bại (${response.status})`);
  }

  const result = await response.json();
  if (result.status === 'error') {
    throw new Error(result.message || 'Apps Script báo lỗi khi tạo tệp trên Drive.');
  }

  return {
    id: result.fileId || '',
    name: result.fileName || file.name,
    webViewLink: result.fileUrl || `https://drive.google.com/file/d/${result.fileId}/view`,
    webContentLink: result.downloadUrl,
  };
}

let cachedAccessToken: string | null = null;

/**
 * Gets or prompts for a Google OAuth access token with Google Drive scope.
 */
export async function getDriveAccessToken(forcePrompt = false): Promise<string> {
  if (cachedAccessToken && !forcePrompt) {
    return cachedAccessToken;
  }

  try {
    const result = await signInWithPopup(auth, googleDriveProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Không lấy được mã truy cập (Access Token) từ Google.');
    }

    cachedAccessToken = credential.accessToken;
    return cachedAccessToken;
  } catch (err: any) {
    console.error('[GoogleDriveService] Lỗi xác thực Google OAuth:', err);
    throw new Error(err?.message || 'Không thể đăng nhập tài khoản Google để tải tệp lên Drive.');
  }
}

export interface DriveUploadResult {
  id: string;
  name: string;
  webViewLink: string;
  webContentLink?: string;
}

/**
 * Uploads a file via server-side proxy endpoint (Zero popup prompt, works for all connected users)
 */
export async function uploadFileViaServerProxy(
  file: File,
  folderId: string = DEFAULT_DRIVE_FOLDER_ID
): Promise<DriveUploadResult> {
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64 = reader.result.split(',')[1] || '';
        resolve(base64);
      } else {
        reject(new Error('Lỗi đọc tệp tin.'));
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });

  const response = await fetch(getApiUrl('/api/drive/upload-proxy'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
      folderId: folderId,
      fileData: base64Data,
      appsScriptUrl: getAppsScriptUrl() || undefined
    })
  });

  if (!response.ok) {
    throw new Error('Lỗi máy chủ proxy upload Google Drive.');
  }

  const result = await response.json();
  const fileId = result.fileId || result.id || 'gdrive-' + Date.now();
  return {
    id: fileId,
    name: result.fileName || file.name,
    webViewLink: result.webViewLink || result.fileUrl || `https://drive.google.com/file/d/${fileId}/view`,
    webContentLink: result.downloadUrl || result.webContentLink
  };
}

/**
 * Uploads a file directly to Google Drive via Server Proxy / Apps Script (Zero popup) or Google Drive v3 REST API
 */
export async function uploadFileToGoogleDrive(
  file: File,
  folderId: string = DEFAULT_DRIVE_FOLDER_ID,
  tokenOverride?: string
): Promise<DriveUploadResult> {
  // 1. Try server-side proxy / Apps Script upload first to avoid browser OAuth popups
  if (!tokenOverride) {
    try {
      console.log('[GoogleDriveService] Uploading seamlessly via Server Upload Proxy...');
      return await uploadFileViaServerProxy(file, folderId);
    } catch (proxyErr: any) {
      console.warn('[GoogleDriveService] Server proxy upload failed, falling back to direct Drive API:', proxyErr);
    }
  }

  // 2. Fallback to direct OAuth token if specified or cached
  const token = tokenOverride || (await getDriveAccessToken());

  const metadata = {
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
    parents: folderId ? [folderId] : undefined,
  };

  const formData = new FormData();
  formData.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  formData.append('file', file);

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[GoogleDriveService] Upload failed:', response.status, errorText);
    
    // If token expired (401), try once more with fresh token prompt
    if (response.status === 401 && !tokenOverride) {
      console.log('[GoogleDriveService] Access token expired, prompting for re-authentication...');
      const freshToken = await getDriveAccessToken(true);
      return uploadFileToGoogleDrive(file, folderId, freshToken);
    }

    throw new Error(`Tải tệp lên Google Drive thất bại (${response.status}): ${response.statusText}`);
  }

  const data = await response.json();
  return {
    id: data.id,
    name: data.name,
    webViewLink: data.webViewLink || `https://drive.google.com/file/d/${data.id}/view`,
    webContentLink: data.webContentLink,
  };
}

/**
 * Extracts the file ID or folder ID from various Google Drive / Docs URLs
 */
export function extractGoogleDriveFileId(urlOrId: string | undefined | null): string {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();

  // If it's already just an ID (alphanumeric, dashes, underscores, length 20+)
  if (/^[a-zA-Z0-9_-]{20,50}$/.test(trimmed)) {
    return trimmed;
  }

  // Matches /file/d/{id}, /folders/{id}, /document/d/{id}, /spreadsheets/d/{id}, /presentation/d/{id}
  const pathMatch = trimmed.match(/\/(?:file\/d|folders|document\/d|spreadsheets\/d|presentation\/d)\/([a-zA-Z0-9_-]+)/);
  if (pathMatch && pathMatch[1]) {
    return pathMatch[1];
  }

  // Matches id={id} in query params (e.g. uc?id=... or open?id=...)
  const queryMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (queryMatch && queryMatch[1]) {
    return queryMatch[1];
  }

  return '';
}

/**
 * Converts any Google Drive or document link into a direct iframe embed preview URL
 */
export function getGoogleDrivePreviewEmbedUrl(urlOrId: string | undefined | null): string {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();

  // Special case: Google Docs, Sheets, Slides
  if (trimmed.includes('docs.google.com/document/d/')) {
    const fileId = extractGoogleDriveFileId(trimmed);
    return `https://docs.google.com/document/d/${fileId}/preview`;
  }
  if (trimmed.includes('docs.google.com/spreadsheets/d/')) {
    const fileId = extractGoogleDriveFileId(trimmed);
    return `https://docs.google.com/spreadsheets/d/${fileId}/preview`;
  }
  if (trimmed.includes('docs.google.com/presentation/d/')) {
    const fileId = extractGoogleDriveFileId(trimmed);
    return `https://docs.google.com/presentation/d/${fileId}/preview`;
  }

  // Standard Google Drive file
  const fileId = extractGoogleDriveFileId(trimmed);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  // If it's a generic web PDF or file URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    if (trimmed.endsWith('.pdf')) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(trimmed)}&embedded=true`;
    }
    return trimmed;
  }

  return trimmed;
}

/**
 * Returns the standard Google Drive View URL (to open in a new browser tab)
 */
export function getGoogleDriveViewUrl(urlOrId: string | undefined | null): string {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  const fileId = extractGoogleDriveFileId(trimmed);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
  }
  return trimmed;
}

/**
 * Returns the secure application proxy URL or direct source for streaming the PDF binary
 */
export function getGoogleDrivePdfProxyUrl(urlOrId: string | undefined | null): string {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }
  const fileId = extractGoogleDriveFileId(trimmed);
  if (fileId) {
    return `/api/drive/pdf-proxy?id=${encodeURIComponent(fileId)}`;
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return `/api/drive/pdf-proxy?url=${encodeURIComponent(trimmed)}`;
  }
  return '';
}

/**
 * Returns a direct download URL for the file from Google Drive
 */
export function getGoogleDriveDirectDownloadUrl(urlOrId: string | undefined | null): string {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  const fileId = extractGoogleDriveFileId(trimmed);
  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return trimmed;
}

import { CloudinaryImageMeta } from '../types';
import { ARTICLE_BANNERS } from '../utils/officialImages';

/**
 * Converts a Google Drive share link, view link, Cloudinary image meta, or file ID into a high-resolution direct image URL
 */
export function getGoogleDriveDirectImageUrl(urlOrId: string | CloudinaryImageMeta | undefined | null): string {
  if (!urlOrId) return '';
  if (typeof urlOrId === 'object') {
    return urlOrId.secureUrl || urlOrId.url || '';
  }
  const trimmed = urlOrId.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('data:image/') || trimmed.startsWith('blob:')) return trimmed;

  // Extract file ID from google drive URLs if applicable
  // e.g. https://drive.google.com/file/d/1ABCXYZ/view or https://drive.google.com/uc?id=1ABCXYZ
  const fileId = extractGoogleDriveFileId(trimmed);
  if (fileId) {
    // Adding =w2000 parameter forces Google Drive CDN to serve a sharp, high-resolution 2000px image
    return `https://lh3.googleusercontent.com/d/${fileId}=w2000`;
  }

  // Handle uc?export=view or uc?id=... Google Drive links
  if (trimmed.includes('drive.google.com/uc?')) {
    const match = trimmed.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}=w2000`;
    }
  }

  return trimmed;
}

/**
 * Universal error handler for <img> tags to handle broken links or Google Drive CDN rate limits
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackCategoryBanner?: string
): void {
  const target = e.currentTarget;
  if (target.dataset.errorHandled === 'true') return;

  const currentSrc = target.src;
  const fileId = extractGoogleDriveFileId(currentSrc);

  if (fileId && !target.dataset.triedHighResThumbnail) {
    target.dataset.triedHighResThumbnail = 'true';
    // High-resolution thumbnail fallback (sz=w2000)
    target.src = `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;
    return;
  }

  target.dataset.errorHandled = 'true';
  target.src = fallbackCategoryBanner || ARTICLE_BANNERS.default;
}

