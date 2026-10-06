import { DriveFolderConfig } from './types';

const DRIVE_CONFIG_KEY = 'chanh_hiep_ai_drive_config_v2';
const DRIVE_INDEXED_FILES_KEY = 'chanh_hiep_ai_drive_files_v2';

export interface DriveIndexedFile {
  driveFileId: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  modifiedTime: string;
  indexedAt: string;
  category: string;
  snippet: string;
  active: boolean;
}

export const DEFAULT_DRIVE_FOLDER_CONFIG: DriveFolderConfig = {
  id: 'cfg-default-folder',
  folderId: '1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G',
  folderUrl: 'https://drive.google.com/drive/folders/1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G?hl=vi',
  name: 'Bộ não Tri thức & Văn bản Google Drive Phường Chánh Hiệp',
  authorizedBy: 'UBND & MTTQ Phường Chánh Hiệp',
  autoSync: true,
  lastSyncAt: new Date().toISOString(),
  fileCount: 13,
  status: 'ACTIVE'
};

export const INITIAL_DRIVE_FILES: DriveIndexedFile[] = [
  {
    "driveFileId": "1vf7R4rHMziuXPQZrGhmFpr4P2s_jHJyA",
    "name": "DANH SÁCH SỐ ĐIỆN THOẠI 21 KHU PHỐ (1).xlsx",
    "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "webViewLink": "https://drive.google.com/open?id=1vf7R4rHMziuXPQZrGhmFpr4P2s_jHJyA",
    "modifiedTime": "2025-11-13T08:00:00Z",
    "indexedAt": "2026-10-04T04:15:36.213Z",
    "category": "Liên hệ - Quy chế",
    "snippet": "Danh bạ số điện thoại liên lạc của Ban Điều hành và Ban Công tác Mặt trận tại 21 Khu phố Phường Chánh Hiệp.",
    "active": true
  },
  {
    "driveFileId": "1iD0MitNBNLf6zL2e4rpwNgONa_MjpREd",
    "name": "QT01. Cấp bản sao từ sổ gốc.docx",
    "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "webViewLink": "https://drive.google.com/open?id=1iD0MitNBNLf6zL2e4rpwNgONa_MjpREd",
    "modifiedTime": "2025-11-13T08:00:00Z",
    "indexedAt": "2026-10-04T04:15:36.213Z",
    "category": "Chứng thực",
    "snippet": "Quy trình nội bộ giải quyết thủ tục cấp bản sao từ sổ gốc hộ tịch lưu trữ tại UBND Phường Chánh Hiệp.",
    "active": true
  },
  {
    "driveFileId": "1sxPTtPmZiE4Z7uHwcUH2ssWu-G-PT4vd",
    "name": "QT02. Chứng thực bản sao.docx",
    "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "webViewLink": "https://drive.google.com/open?id=1sxPTtPmZiE4Z7uHwcUH2ssWu-G-PT4vd",
    "modifiedTime": "2025-11-13T08:00:00Z",
    "indexedAt": "2026-10-04T04:15:36.213Z",
    "category": "Chứng thực",
    "snippet": "Quy trình chứng thực bản sao từ bản chính giấy tờ, văn bản do Việt Nam hoặc nước ngoài cấp, áp dụng tại Một cửa Phường Chánh Hiệp.",
    "active": true
  },
  {
    "driveFileId": "1tpI7lMSWIKcNJGfNJzHk3JyioFA28qkV",
    "name": "QT03. Chứng thực chữ ký.docx",
    "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "webViewLink": "https://drive.google.com/open?id=1tpI7lMSWIKcNJGfNJzHk3JyioFA28qkV",
    "modifiedTime": "2025-11-13T08:00:00Z",
    "indexedAt": "2026-10-04T04:15:36.213Z",
    "category": "Chứng thực",
    "snippet": "Quy trình chứng thực chữ ký trong các giấy tờ, văn bản (bao gồm cả điểm chỉ hoặc nhờ người ký thay) tại UBND Phường Chánh Hiệp.",
    "active": true
  },
  {
    "driveFileId": "1THaxgmfpV643lATzUDIxVWliGLcAmgO3",
    "name": "QT04. Chứng thực chữ ký người dịch (CTV).docx",
    "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "webViewLink": "https://drive.google.com/open?id=1THaxgmfpV643lATzUDIxVWliGLcAmgO3",
    "modifiedTime": "2025-11-13T08:00:00Z",
    "indexedAt": "2026-10-04T04:15:36.213Z",
    "category": "Chứng thực",
    "snippet": "Quy trình chứng thực chữ ký người dịch là cộng tác viên dịch thuật đã ký hợp đồng với UBND Phường.",
    "active": true
  },
  {
    "driveFileId": "1VSik8C3YuWN9hIHdCBV-ma-T0k0_ANzX",
    "name": "QT05. Chứng thực chữ ký người dịch (Ko phải CTV).docx",
    "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "webViewLink": "https://drive.google.com/open?id=1VSik8C3YuWN9hIHdCBV-ma-T0k0_ANzX",
    "modifiedTime": "2025-11-13T08:00:00Z",
    "indexedAt": "2026-10-04T04:15:36.213Z",
    "category": "Chứng thực",
    "snippet": "Quy trình chứng thực chữ ký người dịch tự do (không phải cộng tác viên dịch thuật cơ hữu của phường).",
    "active": true
  },
  {
    "driveFileId": "1Tv1mS_UUv0wydEhfSx4MWpy_1MFNqAYN",
    "name": "QT06. Chứng thực giao dịch.docx",
    "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "webViewLink": "https://drive.google.com/open?id=1Tv1mS_UUv0wydEhfSx4MWpy_1MFNqAYN",
    "modifiedTime": "2025-11-13T08:00:00Z",
    "indexedAt": "2026-10-04T04:15:36.213Z",
    "category": "Chứng thực - Giao dịch",
    "snippet": "Quy trình chứng thực giao dịch liên quan đến tài sản là động sản, quyền sử dụng đất và nhà ở tại Phường Chánh Hiệp.",
    "active": true
  },
  {
    "driveFileId": "12d1e4NiyCZ5n9-Z_s1BVkPT1tb3d7gjr",
    "name": "QT07. Chứng thực di chúc.docx",
    "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "webViewLink": "https://drive.google.com/open?id=12d1e4NiyCZ5n9-Z_s1BVkPT1tb3d7gjr",
    "modifiedTime": "2025-11-13T08:00:00Z",
    "indexedAt": "2026-10-04T04:15:36.213Z",
    "category": "Chứng thực - Di chúc",
    "snippet": "Quy trình lập và chứng thực di chúc hợp pháp, bao gồm cả yêu cầu về sức khỏe tâm thần và người làm chứng.",
    "active": true
  },
  {
    "driveFileId": "1SX6Qmu8V5jgnBqPOz2l5gTmCHxTd_8-b",
    "name": "QT08. Chứng thực VB từ chối nhận di sản.docx",
    "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "webViewLink": "https://drive.google.com/open?id=1SX6Qmu8V5jgnBqPOz2l5gTmCHxTd_8-b",
    "modifiedTime": "2025-11-13T08:00:00Z",
    "indexedAt": "2026-10-04T04:15:36.213Z",
    "category": "Chứng thực - Di sản",
    "snippet": "Quy trình chứng thực văn bản từ chối nhận di sản thừa kế (đất đai, nhà ở, xe cộ, tiền gửi...) tại phường Chánh Hiệp.",
    "active": true
  },
  {
    "driveFileId": "1tJd-VAV7iaRmXrdi0qNc-iQ0FQ-9Cc6X",
    "name": "QT09. Chứng thực VB phân chia di sản.docx",
    "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "webViewLink": "https://drive.google.com/open?id=1tJd-VAV7iaRmXrdi0qNc-iQ0FQ-9Cc6X",
    "modifiedTime": "2025-11-13T08:00:00Z",
    "indexedAt": "2026-10-04T04:15:36.213Z",
    "category": "Chứng thực - Di sản",
    "snippet": "Quy trình chứng thực văn bản thỏa thuận phân chia di sản thừa kế theo pháp luật hoặc theo di chúc giữa các đồng thừa kế.",
    "active": true
  },
  {
    "driveFileId": "1GJqK4yAPhcaX2ZUfmu_E6VdOiP3Jlua5",
    "name": "QT10. Sửa đổi, bổ sung, hủy bỏ giao dịch.docx",
    "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "webViewLink": "https://drive.google.com/open?id=1GJqK4yAPhcaX2ZUfmu_E6VdOiP3Jlua5",
    "modifiedTime": "2025-11-13T08:00:00Z",
    "indexedAt": "2026-10-04T04:15:36.213Z",
    "category": "Chứng thực - Giao dịch",
    "snippet": "Quy trình chứng thực việc sửa đổi, bổ sung hoặc hủy bỏ một hợp đồng, giao dịch đã được chứng thực trước đây tại Phường.",
    "active": true
  },
  {
    "driveFileId": "1oVT4w-kNlWX41iIzBvZhjhjKQgOTOZIQ",
    "name": "QT11. Sửa lỗi sai sót trong giao dịch.docx",
    "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "webViewLink": "https://drive.google.com/open?id=1oVT4w-kNlWX41iIzBvZhjhjKQgOTOZIQ",
    "modifiedTime": "2025-11-13T08:00:00Z",
    "indexedAt": "2026-10-04T04:15:36.213Z",
    "category": "Chứng thực - Giao dịch",
    "snippet": "Quy trình sửa lỗi sai sót về mặt kỹ thuật, chữ viết, số liệu trong hợp đồng, giao dịch đã chứng thực mà không làm thay đổi bản chất nội dung.",
    "active": true
  },
  {
    "driveFileId": "17y7vKMyE4k-2wJnJq1LZQSHIY4kEbGVo",
    "name": "QT12. Cấp bản sao giao dịch.docx",
    "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "webViewLink": "https://drive.google.com/open?id=17y7vKMyE4k-2wJnJq1LZQSHIY4kEbGVo",
    "modifiedTime": "2025-11-13T08:00:00Z",
    "indexedAt": "2026-10-04T04:15:36.213Z",
    "category": "Chứng thực",
    "snippet": "Quy trình cấp bản sao có chứng thực từ bản chính hợp đồng, giao dịch đang lưu trữ tại Phòng Lưu trữ UBND Phường Chánh Hiệp.",
    "active": true
  }
];

export class DriveConnector {
  public static getConfig(): DriveFolderConfig {
    try {
      const raw = localStorage.getItem(DRIVE_CONFIG_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to load drive config:', e);
    }
    return DEFAULT_DRIVE_FOLDER_CONFIG;
  }

  public static saveConfig(cfg: DriveFolderConfig): void {
    try {
      localStorage.setItem(DRIVE_CONFIG_KEY, JSON.stringify(cfg));
    } catch (e) {
      console.warn('Failed to save drive config:', e);
    }
  }

  public static getIndexedFiles(): DriveIndexedFile[] {
    try {
      const raw = localStorage.getItem(DRIVE_INDEXED_FILES_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to load drive files:', e);
    }
    return INITIAL_DRIVE_FILES;
  }

  public static saveIndexedFiles(files: DriveIndexedFile[]): void {
    try {
      localStorage.setItem(DRIVE_INDEXED_FILES_KEY, JSON.stringify(files));
    } catch (e) {
      console.warn('Failed to save drive files:', e);
    }
  }

  public static syncNow(): { syncedCount: number; lastSyncAt: string } {
    const config = DriveConnector.getConfig();
    const files = DriveConnector.getIndexedFiles();
    const now = new Date().toISOString();

    config.lastSyncAt = now;
    config.fileCount = files.length;
    config.status = 'ACTIVE';
    DriveConnector.saveConfig(config);

    return { syncedCount: files.length, lastSyncAt: now };
  }
}
