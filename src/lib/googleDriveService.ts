import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';
import { getApiUrl } from './api';

// Google Drive Provider configured with drive.file scope
export const googleDriveProvider = new GoogleAuthProvider();
googleDriveProvider.addScope('https://www.googleapis.com/auth/drive.file');

// Target folder ID on Google Drive
export const DEFAULT_DRIVE_FOLDER_ID = '1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G';
export const DEFAULT_DRIVE_FOLDER_URL = `https://drive.google.com/drive/folders/${DEFAULT_DRIVE_FOLDER_ID}?hl=vi`;

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

/**
 * Converts a Google Drive share link, view link, or file ID into a direct embeddable image URL
 */
export function getGoogleDriveDirectImageUrl(urlOrId: string | undefined | null): string {
  if (!urlOrId) return '';
  if (urlOrId.startsWith('data:image/') || urlOrId.startsWith('blob:')) return urlOrId;

  // Extract file ID from google drive URLs if applicable
  // e.g. https://drive.google.com/file/d/1ABCXYZ/view or https://drive.google.com/uc?id=1ABCXYZ
  const fileId = extractGoogleDriveFileId(urlOrId);
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  return urlOrId;
}

