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
  fileCount: 25,
  status: 'ACTIVE'
};

export const INITIAL_DRIVE_FILES: DriveIndexedFile[] = [
  {
    driveFileId: 'drive-01',
    name: 'To_khai_dang_ky_ket_hon_2026.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    webViewLink: 'https://drive.google.com/drive/folders/1TNEc-8JYkF17R44igkinTIZAmFEjSmOL',
    modifiedTime: '2026-09-01T08:00:00Z',
    indexedAt: '2026-09-30T00:00:00Z',
    category: 'Hộ tịch',
    snippet: 'Mẫu tờ khai đăng ký kết hôn áp dụng tại UBND Phường Chánh Hiệp, kèm bản cam đoan tình trạng hôn nhân.',
    active: true
  },
  {
    driveFileId: 'drive-02',
    name: 'Don_de_nghi_ho_tro_an_sinh_xa_hoi.pdf',
    mimeType: 'application/pdf',
    webViewLink: 'https://drive.google.com/drive/folders/1TNEc-8JYkF17R44igkinTIZAmFEjSmOL',
    modifiedTime: '2026-08-15T09:30:00Z',
    indexedAt: '2026-09-30T00:00:00Z',
    category: 'An sinh xã hội',
    snippet: 'Đơn đề nghị hỗ trợ khẩn cấp, trợ cấp bảo trợ xã hội thường xuyên cho hộ nghèo, người khuyết tật, người cao tuổi.',
    active: true
  },
  {
    driveFileId: 'drive-03',
    name: 'Quy_che_hoat_dong_Ban_CTMT_21_khu_pho.pdf',
    mimeType: 'application/pdf',
    webViewLink: 'https://drive.google.com/drive/folders/1TNEc-8JYkF17R44igkinTIZAmFEjSmOL',
    modifiedTime: '2026-07-20T10:00:00Z',
    indexedAt: '2026-09-30T00:00:00Z',
    category: 'Mặt trận - Đoàn thể',
    snippet: 'Quy chế phối hợp hoạt động giữa Ban Thường trực MTTQ Phường với Ban Công tác Mặt trận 21 khu phố.',
    active: true
  },
  {
    driveFileId: 'drive-04',
    name: 'Mau_phieu_lay_y_kien_hai_long_nguoi_dan.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    webViewLink: 'https://drive.google.com/drive/folders/1TNEc-8JYkF17R44igkinTIZAmFEjSmOL',
    modifiedTime: '2026-09-10T14:00:00Z',
    indexedAt: '2026-09-30T00:00:00Z',
    category: 'Khảo sát - Dân nguyện',
    snippet: 'Phiếu khảo sát mức độ hài lòng của công dân đối với dịch vụ hành chính công và sự phục vụ của cán bộ phường.',
    active: true
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
