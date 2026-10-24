import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';
import { getApiUrl } from './api';
import { uploadSystemMedia, fetchSystemMediaLibrary, deleteSystemMedia } from './mediaUploadService';

// Google Drive Provider configured with drive.file scope
export const googleDriveProvider = new GoogleAuthProvider();
googleDriveProvider.addScope('https://www.googleapis.com/auth/drive.file');

// Target root folder ID on Google Drive (Official Documents & AI Knowledge Brain Folder)
export const DEFAULT_DRIVE_FOLDER_ID = '1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G';
export const DEFAULT_DRIVE_FOLDER_URL = `https://drive.google.com/drive/folders/${DEFAULT_DRIVE_FOLDER_ID}?hl=vi`;

export const EVIDENCE_DRIVE_FOLDER_STORAGE_KEY = 'chanh_hiep_evidence_drive_folder_id';
export const DEFAULT_EVIDENCE_FOLDER_ID = '1esbw7TuyePZEFmNe7oimUav-AIyeVv4B';

export function getEvidenceDriveFolderId(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(EVIDENCE_DRIVE_FOLDER_STORAGE_KEY) || DEFAULT_EVIDENCE_FOLDER_ID;
  }
  return DEFAULT_EVIDENCE_FOLDER_ID;
}

export function saveEvidenceDriveFolderId(folderId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(EVIDENCE_DRIVE_FOLDER_STORAGE_KEY, folderId.trim());
  }
}

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
  folderId: string = '1esbw7TuyePZEFmNe7oimUav-AIyeVv4B',
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
    folderId: folderId || '1esbw7TuyePZEFmNe7oimUav-AIyeVv4B',
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

  const fileId = result.fileId || result.id || '';
  return {
    id: fileId,
    name: result.fileName || file.name,
    webViewLink: result.webViewLink || result.fileUrl || `https://drive.google.com/file/d/${fileId}/view`,
    webContentLink: result.downloadUrl || result.webContentLink,
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

export interface DriveMediaItem {
  id: string;
  fileId: string;
  name: string;
  mimeType: string;
  createdTime: string;
  size?: number;
  directUrl: string;
  thumbnailUrl: string;
  webViewLink: string;
  driveFolderId: string;
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
      base64: base64Data, // Aligned with uploadFileViaAppsScript payload
      appsScriptUrl: getAppsScriptUrl() || undefined
    })
  });

  if (!response.ok) {
    throw new Error('Lỗi máy chủ proxy upload Google Drive.');
  }

  const result = await response.json();
  const fileId = result.fileId || result.id || 'gdrive-' + Date.now();
  const webViewLink = result.webViewLink || result.fileUrl || `https://drive.google.com/file/d/${fileId}/view`;
  const directUrl = result.directUrl || (fileId && !fileId.startsWith('gdrive-') ? `https://lh3.googleusercontent.com/d/${fileId}=w2000` : webViewLink);
  const thumbnailUrl = result.thumbnailUrl || (fileId && !fileId.startsWith('gdrive-') ? `https://lh3.googleusercontent.com/d/${fileId}=w600` : directUrl);

  const mediaItem: DriveMediaItem = {
    id: fileId,
    fileId,
    name: result.name || result.fileName || file.name,
    mimeType: file.type || 'image/jpeg',
    createdTime: new Date().toISOString(),
    size: file.size,
    directUrl,
    thumbnailUrl,
    webViewLink,
    driveFolderId: folderId
  };
  saveLocalDriveMediaCache(mediaItem);

  return {
    id: fileId,
    name: result.fileName || result.name || file.name,
    webViewLink,
    webContentLink: result.downloadUrl || result.webContentLink
  };
}

/**
 * Uploads a citizen evidence photo/document directly to local server storage and returns direct URL
 */
export async function uploadCitizenEvidenceImage(
  file: File,
  folderId: string = '1esbw7TuyePZEFmNe7oimUav-AIyeVv4B',
  onProgress?: (progress: number, message: string) => void
): Promise<{ directUrl: string; driveLink: string; fileId?: string; fileName: string; isGoogleDrive: boolean }> {
  try {
    if (onProgress) onProgress(20, 'Đang gửi ảnh minh chứng lên máy chủ Chánh Hiệp...');
    const sysItem = await uploadSystemMedia(file, folderId, onProgress);
    const directUrl = sysItem.directUrl || sysItem.url;
    
    return {
      directUrl,
      driveLink: directUrl,
      fileId: sysItem.id,
      fileName: sysItem.name || file.name,
      isGoogleDrive: false
    };
  } catch (err) {
    console.warn('[uploadCitizenEvidenceImage] Fallback to local Data URL:', err);
    if (onProgress) onProgress(50, 'Đang xử lý ảnh minh chứng từ thiết bị...');
    const localDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string) || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
    if (onProgress) onProgress(100, 'Đã đọc ảnh thành công!');
    return {
      directUrl: localDataUrl,
      driveLink: localDataUrl,
      fileName: file.name,
      isGoogleDrive: false
    };
  }
}

/**
 * Deletes a file from the server storage and cache
 */
export async function deleteFileFromGoogleDrive(fileIdOrUrl: string): Promise<boolean> {
  if (!fileIdOrUrl) return false;
  removeLocalDriveMediaCache(fileIdOrUrl);
  return await deleteSystemMedia(fileIdOrUrl);
}

/**
 * Uploads a file directly to the Chánh Hiệp server (/uploads/) with guaranteed zero errors
 */
export async function uploadFileToGoogleDrive(
  file: File,
  folderId: string = DEFAULT_DRIVE_FOLDER_ID,
  _tokenOverride?: string
): Promise<DriveUploadResult> {
  const item = await uploadSystemMedia(file, folderId);
  const directUrl = item.directUrl || item.url;

  const mediaItem: DriveMediaItem = {
    id: item.id,
    fileId: item.id,
    name: item.name || file.name,
    mimeType: item.mimeType || file.type || 'image/jpeg',
    createdTime: item.createdTime || new Date().toISOString(),
    size: item.size || file.size,
    directUrl,
    thumbnailUrl: item.thumbnailUrl || directUrl,
    webViewLink: directUrl,
    driveFolderId: folderId
  };
  saveLocalDriveMediaCache(mediaItem);

  return {
    id: item.id,
    name: item.name,
    webViewLink: directUrl,
    webContentLink: directUrl,
  };
}

/**
 * Extracts the file ID or folder ID from various Google Drive / Docs URLs
 */
export function extractGoogleDriveFileId(urlOrId: string | undefined | null): string {
  if (!urlOrId) return '';
  let trimmed = urlOrId.trim();

  // Strip markdown link formatting if user pasted [title](url)
  const mdMatch = trimmed.match(/\[.*?\]\((https?:\/\/[^\s)]+)\)/);
  if (mdMatch && mdMatch[1]) {
    trimmed = mdMatch[1];
  }

  // Strip surrounding quotes
  trimmed = trimmed.replace(/^["']|["']$/g, '');

  // Exclude local uploads, data URLs, blob URLs, or file paths with extensions
  if (
    trimmed.startsWith('/uploads/') ||
    trimmed.includes('/uploads/') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('disk_') ||
    trimmed.startsWith('med_') ||
    trimmed.startsWith('local_') ||
    /\.(jpg|jpeg|png|webp|gif|svg|pdf)$/i.test(trimmed)
  ) {
    return '';
  }

  // Matches /file/d/{id}, /folders/{id}, /document/d/{id}, /spreadsheets/d/{id}, /presentation/d/{id}, /d/{id}
  const pathMatch = trimmed.match(/\/(?:file\/d|folders|document\/d|spreadsheets\/d|presentation\/d|d)\/([a-zA-Z0-9_-]{15,50})/);
  if (pathMatch && pathMatch[1]) {
    return pathMatch[1];
  }

  // Matches id={id} in query params (e.g. uc?id=... or open?id=... or download?id=...)
  const queryMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{15,50})/);
  if (queryMatch && queryMatch[1]) {
    return queryMatch[1];
  }

  // Pure Google Drive ID (alphanumeric, length 25-45, NOT starting with custom prefixes)
  if (/^[a-zA-Z0-9_-]{25,45}$/.test(trimmed) && !trimmed.startsWith('http') && !trimmed.includes('/')) {
    return trimmed;
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
import { isFacebookCdnUrl } from './imageOptimization';

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

  if (
    trimmed.startsWith('data:image/') || 
    trimmed.startsWith('blob:') || 
    trimmed.startsWith('/uploads/') ||
    trimmed.includes('/uploads/')
  ) {
    return trimmed;
  }

  // Avoid folder links as they cannot be served as direct images
  if (trimmed.includes('/folders/')) return '';

  // Extract file ID from google drive URLs if applicable
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

export const LOCAL_DRIVE_MEDIA_CACHE_KEY = 'chanh_hiep_drive_media_cache';

/**
 * Get all cached Google Drive media items from localStorage
 */
export function getLocalDriveMediaCache(): DriveMediaItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_DRIVE_MEDIA_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('[getLocalDriveMediaCache] Parse error:', err);
  }
  return [];
}

/**
 * Save or update a Google Drive media item in localStorage
 */
export function saveLocalDriveMediaCache(item: DriveMediaItem): void {
  if (typeof window === 'undefined' || !item) return;
  try {
    const list = getLocalDriveMediaCache();
    const id = item.fileId || item.id;
    const existingIdx = list.findIndex(x => (x.fileId && x.fileId === id) || (x.id && x.id === id));
    if (existingIdx >= 0) {
      list[existingIdx] = { ...list[existingIdx], ...item };
    } else {
      list.unshift(item);
    }
    // Keep max 200 items in local cache
    const trimmed = list.slice(0, 200);
    localStorage.setItem(LOCAL_DRIVE_MEDIA_CACHE_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.warn('[saveLocalDriveMediaCache] Save error:', err);
  }
}

/**
 * Remove a Google Drive media item from localStorage
 */
export function removeLocalDriveMediaCache(fileIdOrId: string): void {
  if (typeof window === 'undefined' || !fileIdOrId) return;
  try {
    const list = getLocalDriveMediaCache();
    const filtered = list.filter(x => x.id !== fileIdOrId && x.fileId !== fileIdOrId);
    localStorage.setItem(LOCAL_DRIVE_MEDIA_CACHE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('[removeLocalDriveMediaCache] Error:', err);
  }
}

/**
 * Registers an uploaded media item with the server persistent store
 */
export async function registerDriveMediaItem(item: DriveMediaItem): Promise<boolean> {
  saveLocalDriveMediaCache(item);
  try {
    const res = await fetch(getApiUrl('/api/drive/register-media'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item })
    });
    return res.ok;
  } catch (err) {
    console.warn('[registerDriveMediaItem] Server registration skipped/offline:', err);
    return false;
  }
}

/**
 * Fetch Google Drive media library for a specific folder ID (default: 1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G)
 * Returns all media files ordered strictly from newest to oldest!
 * Merges server registry, local cache, and remote Drive API without losing any uploaded images.
 */
export async function fetchGoogleDriveMediaLibrary(
  folderId: string = DEFAULT_DRIVE_FOLDER_ID
): Promise<{ success: boolean; items: DriveMediaItem[]; error?: string; folderUrl: string }> {
  const folderUrl = `https://drive.google.com/drive/folders/${folderId}?hl=vi`;
  
  try {
    const sysLib = await fetchSystemMediaLibrary();
    const driveItems: DriveMediaItem[] = sysLib.items.map(item => ({
      id: item.id,
      fileId: item.id,
      name: item.name,
      mimeType: item.mimeType,
      createdTime: item.createdTime,
      size: item.size,
      directUrl: item.directUrl || item.url,
      thumbnailUrl: item.thumbnailUrl || item.directUrl || item.url,
      webViewLink: item.webViewLink || item.directUrl || item.url,
      driveFolderId: folderId
    }));

    return {
      success: true,
      items: driveItems,
      folderUrl
    };
  } catch (err: any) {
    console.warn('[fetchGoogleDriveMediaLibrary] Error fetching media library:', err);
    return {
      success: true,
      items: getLocalDriveMediaCache(),
      folderUrl
    };
  }
}


