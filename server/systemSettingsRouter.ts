import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

export interface SystemSettings {
  maintenanceMode: boolean;
  maintenanceTitle: string;
  maintenanceMessage: string;
  maintenanceStartAt?: string;
  maintenanceEndAt?: string;
  showScheduledTime?: boolean;
  updatedAt: string;
  updatedBy?: string;
  updatedByName?: string;
}

const SETTINGS_FILE_PATH = path.join(process.cwd(), 'data', 'system_settings.json');

const DEFAULT_SETTINGS: SystemSettings = {
  maintenanceMode: false,
  maintenanceTitle: 'Website đang bảo trì hệ thống',
  maintenanceMessage: 'Cổng thông tin & Văn phòng số MTTQ Việt Nam Phường Chánh Hiệp đang thực hiện nâng cấp, bảo trì định kỳ để phục vụ Nhân dân tốt hơn. Vui lòng quay lại sau.',
  showScheduledTime: false,
  updatedAt: new Date().toISOString(),
  updatedBy: 'system',
  updatedByName: 'Hệ thống Quản trị'
};

let currentSettings: SystemSettings = { ...DEFAULT_SETTINGS };

// Ensure data folder and file exist
function loadSettingsFromDisk(): SystemSettings {
  try {
    const dir = path.dirname(SETTINGS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const fileData = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(fileData);
      return { ...DEFAULT_SETTINGS, ...parsed };
    } else {
      fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[SystemSettings] Read error, using default settings:', err);
  }
  return { ...DEFAULT_SETTINGS };
}

function saveSettingsToDisk(settings: SystemSettings): boolean {
  try {
    const dir = path.dirname(SETTINGS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[SystemSettings] Save error:', err);
    return false;
  }
}

// Initial load
currentSettings = loadSettingsFromDisk();

export function getSystemSettings(): SystemSettings {
  return currentSettings;
}

export function isMaintenanceActive(): boolean {
  return currentSettings.maintenanceMode === true;
}

export const systemSettingsRouter = express.Router();

// 1. PUBLIC ENDPOINT: Get system status (No Cache!)
systemSettingsRouter.get('/status', (_req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  return res.json({
    success: true,
    settings: currentSettings
  });
});

// 2. ADMIN ENDPOINT: Get full settings
systemSettingsRouter.get('/admin/system-settings', (_req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  return res.json({
    success: true,
    settings: currentSettings
  });
});

// 3. ADMIN ENDPOINT: Toggle / Update System Settings
systemSettingsRouter.patch('/admin/system-settings', (req: Request, res: Response) => {
  try {
    const {
      maintenanceMode,
      maintenanceTitle,
      maintenanceMessage,
      maintenanceStartAt,
      maintenanceEndAt,
      showScheduledTime,
      updatedBy,
      updatedByName
    } = req.body;

    const previousMode = currentSettings.maintenanceMode;

    const newSettings: SystemSettings = {
      ...currentSettings,
      maintenanceMode: typeof maintenanceMode === 'boolean' ? maintenanceMode : currentSettings.maintenanceMode,
      maintenanceTitle: typeof maintenanceTitle === 'string' && maintenanceTitle.trim() ? maintenanceTitle.trim() : currentSettings.maintenanceTitle,
      maintenanceMessage: typeof maintenanceMessage === 'string' && maintenanceMessage.trim() ? maintenanceMessage.trim() : currentSettings.maintenanceMessage,
      maintenanceStartAt: maintenanceStartAt !== undefined ? maintenanceStartAt : currentSettings.maintenanceStartAt,
      maintenanceEndAt: maintenanceEndAt !== undefined ? maintenanceEndAt : currentSettings.maintenanceEndAt,
      showScheduledTime: typeof showScheduledTime === 'boolean' ? showScheduledTime : currentSettings.showScheduledTime,
      updatedAt: new Date().toISOString(),
      updatedBy: updatedBy || currentSettings.updatedBy || 'admin',
      updatedByName: updatedByName || currentSettings.updatedByName || 'Quản trị viên'
    };

    currentSettings = newSettings;
    saveSettingsToDisk(newSettings);

    console.log(`[SystemSettings] Maintenance mode changed: ${previousMode} -> ${newSettings.maintenanceMode} by ${newSettings.updatedByName}`);

    return res.json({
      success: true,
      settings: currentSettings,
      modeChanged: previousMode !== newSettings.maintenanceMode,
      message: newSettings.maintenanceMode
        ? 'Đã bật chế độ bảo trì hệ thống thành công'
        : 'Đã tắt chế độ bảo trì, website đã hoạt động bình thường'
    });
  } catch (err: any) {
    console.error('[SystemSettings] Patch error:', err);
    return res.status(500).json({
      success: false,
      error: 'Không thể cập nhật cấu hình hệ thống'
    });
  }
});

// 4. Express Maintenance Guard Middleware
export function maintenanceMiddleware(req: Request, res: Response, next: NextFunction) {
  // If maintenance mode is OFF, proceed normally
  if (!currentSettings.maintenanceMode) {
    return next();
  }

  const urlPath = req.path || req.url;

  // Whitelisted path prefixes
  const isWhitelistedPath =
    urlPath.startsWith('/admin') ||
    urlPath.startsWith('/api/admin') ||
    urlPath.startsWith('/api/system') ||
    urlPath.startsWith('/api/auth') ||
    urlPath.startsWith('/maintenance') ||
    urlPath.startsWith('/uploads') ||
    urlPath.startsWith('/assets') ||
    urlPath.startsWith('/_next') ||
    urlPath === '/favicon.ico' ||
    urlPath === '/manifest.json' ||
    urlPath === '/sw.js' ||
    urlPath === '/registerSW.js';

  // Static assets extensions
  const isStaticAsset = /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|json|map|mp4|webm)$/i.test(urlPath);

  // Admin bypass header
  const hasAdminBypass = req.headers['x-admin-bypass'] === 'true';

  if (isWhitelistedPath || isStaticAsset || hasAdminBypass) {
    return next();
  }

  // If client calls public API while in maintenance mode -> Return HTTP 503 JSON
  if (urlPath.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    return res.status(503).json({
      success: false,
      maintenanceMode: true,
      error: 'Hệ thống đang bảo trì định kỳ',
      settings: {
        title: currentSettings.maintenanceTitle,
        message: currentSettings.maintenanceMessage,
        startAt: currentSettings.maintenanceStartAt,
        endAt: currentSettings.maintenanceEndAt,
        showScheduledTime: currentSettings.showScheduledTime
      }
    });
  }

  // For public web page requests (Accept text/html), render standalone 503 Maintenance HTML page
  const acceptHeader = req.headers['accept'] || '';
  if (acceptHeader.includes('text/html') || req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.status(503);

    const scheduledHtml = currentSettings.showScheduledTime && (currentSettings.maintenanceStartAt || currentSettings.maintenanceEndAt) ? `
      <div style="background: rgba(254,243,199,0.8); border: 1px solid #f59e0b; padding: 14px 20px; borderRadius: 12px; margin: 20px 0; text-align: left; font-size: 14px; color: #78350f;">
        <strong style="display: block; margin-bottom: 6px; color: #92400e;">⏱️ Thời gian bảo trì dự kiến:</strong>
        ${currentSettings.maintenanceStartAt ? `<div>• Bắt đầu: <b>${new Date(currentSettings.maintenanceStartAt).toLocaleString('vi-VN')}</b></div>` : ''}
        ${currentSettings.maintenanceEndAt ? `<div>• Hoàn thành: <b>${new Date(currentSettings.maintenanceEndAt).toLocaleString('vi-VN')}</b></div>` : ''}
      </div>
    ` : '';

    const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(currentSettings.maintenanceTitle)} - MTTQ Phường Chánh Hiệp</title>

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0284c7 100%);
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: rgba(255, 255, 255, 0.96);
      color: #0f172a;
      max-width: 640px;
      width: 100%;
      border-radius: 24px;
      padding: 40px 32px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .top-bar {
      height: 6px;
      background: linear-gradient(90deg, #dc2626, #f59e0b, #2563eb);
      position: absolute;
      top: 0; left: 0; right: 0;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #fef3c7;
      color: #b45309;
      font-weight: 800;
      font-size: 12px;
      padding: 6px 16px;
      border-radius: 9999px;
      border: 1px solid #fde68a;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .icon-box {
      width: 72px;
      height: 72px;
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      color: #d97706;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      font-size: 32px;
      box-shadow: 0 10px 15px -3px rgba(217, 119, 6, 0.2);
    }
    h1 {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 12px;
      line-height: 1.3;
    }
    p.msg {
      font-size: 15px;
      line-height: 1.6;
      color: #475569;
      margin-bottom: 24px;
    }
    .footer {
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #64748b;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .admin-link {
      color: #0284c7;
      text-decoration: none;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .admin-link:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <div class="top-bar"></div>
    
    <div class="badge">
      <span>⚙️</span> TRẠNG THÁI BẢO TRÌ
    </div>

    <div class="icon-box">🛠️</div>

    <h1>${escapeHtml(currentSettings.maintenanceTitle)}</h1>
    <p class="msg">${escapeHtml(currentSettings.maintenanceMessage)}</p>

    ${scheduledHtml}

    <div class="footer">
      <div><b>Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp</b></div>
      <div>Trân trọng cảm ơn sự thông cảm và đồng hành của Quý nhân dân!</div>
      <div style="margin-top: 12px;">
        <a href="/admin" class="admin-link">🔒 Cổng Đăng nhập Cán bộ & Quản trị viên (/admin)</a>
      </div>
    </div>
  </div>
</body>
</html>`;

    return res.send(htmlContent);
  }

  return next();
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
