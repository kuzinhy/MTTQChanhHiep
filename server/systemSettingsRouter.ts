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

  const cleanPath = (req.path || req.url || '').split('?')[0];

  // Whitelisted path prefixes (Admin, System, Auth, Static assets, and Vite dev server internals)
  const isWhitelistedPath =
    cleanPath === '/' ||
    cleanPath === '/index.html' ||
    cleanPath.startsWith('/admin') ||
    cleanPath.startsWith('/van-phong-so') ||
    cleanPath.startsWith('/api/admin') ||
    cleanPath.startsWith('/api/system') ||
    cleanPath.startsWith('/api/auth') ||
    cleanPath.startsWith('/uploads') ||
    cleanPath.startsWith('/assets') ||
    cleanPath.startsWith('/_next') ||
    cleanPath.startsWith('/@vite') ||
    cleanPath.startsWith('/@fs') ||
    cleanPath.startsWith('/@id') ||
    cleanPath.startsWith('/__vite') ||
    cleanPath.startsWith('/src') ||
    cleanPath.startsWith('/node_modules') ||
    cleanPath === '/favicon.ico' ||
    cleanPath === '/manifest.json' ||
    cleanPath === '/sw.js' ||
    cleanPath === '/registerSW.js';

  // Static assets extensions (including dev typescript/modules/media)
  const isStaticAsset = /\.(js|mjs|jsx|ts|tsx|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|json|map|mp4|webm|wasm)$/i.test(cleanPath);

  // Admin bypass header
  const hasAdminBypass = req.headers['x-admin-bypass'] === 'true';

  // Explicit standalone SSR Maintenance page request
  if (cleanPath === '/maintenance') {
    return serveStandalone503(req, res);
  }

  // If client calls public API while in maintenance mode -> Return HTTP 503 JSON
  if (cleanPath.startsWith('/api/')) {
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

  if (isWhitelistedPath || isStaticAsset || hasAdminBypass) {
    return next();
  }

  // Fallback for any other public route
  return serveStandalone503(req, res);
}

function serveStandalone503(_req: Request, res: Response) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.status(503);

  const scheduledHtml = currentSettings.showScheduledTime && (currentSettings.maintenanceStartAt || currentSettings.maintenanceEndAt) ? `
    <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(34, 211, 238, 0.4); padding: 14px; border-radius: 16px; margin: 18px 0; text-align: left; font-size: 12px; color: #cbd5e1;">
      <strong style="display: block; margin-bottom: 8px; color: #f59e0b; font-size: 12px;">⏱️ Thời gian bảo trì dự kiến:</strong>
      ${currentSettings.maintenanceStartAt ? `<div style="display: flex; justify-content: space-between; padding: 6px 10px; background: rgba(2, 6, 23, 0.6); border-radius: 8px; margin-bottom: 6px; border: 1px solid rgba(34, 211, 238, 0.15);"><span style="color: #94a3b8;">Bắt đầu:</span><strong style="color: #ffffff;">${new Date(currentSettings.maintenanceStartAt).toLocaleString('vi-VN')}</strong></div>` : ''}
      ${currentSettings.maintenanceEndAt ? `<div style="display: flex; justify-content: space-between; padding: 6px 10px; background: rgba(2, 6, 23, 0.6); border-radius: 8px; border: 1px solid rgba(34, 211, 238, 0.15);"><span style="color: #94a3b8;">Dự kiến hoàn thành:</span><strong style="color: #34d399;">${new Date(currentSettings.maintenanceEndAt).toLocaleString('vi-VN')}</strong></div>` : ''}
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
      background: linear-gradient(180deg, #0a45d1 0%, #072db5 50%, #031568 100%);
      color: #ffffff;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      position: relative;
      overflow-x: hidden;
    }
    
    /* Radar HUD Rings */
    .radar-container {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      overflow: hidden;
      z-index: 1;
    }
    .luminescence {
      position: absolute;
      width: 45rem;
      height: 45rem;
      background: rgba(34, 211, 238, 0.2);
      border-radius: 50%;
      filter: blur(100px);
      animation: pulse 4s infinite alternate ease-in-out;
    }
    .ring-dashed {
      position: absolute;
      width: 46rem;
      height: 46rem;
      border-radius: 50%;
      border: 1px dashed rgba(103, 232, 249, 0.3);
      animation: spin 60s linear infinite;
    }
    .ring-glowing {
      position: absolute;
      width: 36rem;
      height: 36rem;
      border-radius: 50%;
      border: 2px solid rgba(34, 211, 238, 0.35);
      box-shadow: 0 0 40px rgba(34, 211, 238, 0.3);
      animation: spin-rev 40s linear infinite;
    }
    .ring-dot {
      position: absolute;
      width: 28rem;
      height: 28rem;
      border-radius: 50%;
      border: 2px dotted rgba(165, 243, 252, 0.5);
      animation: spin 25s linear infinite;
    }
    .ring-core {
      position: absolute;
      width: 18rem;
      height: 18rem;
      border-radius: 50%;
      border: 2px solid rgba(165, 243, 252, 0.6);
      background: rgba(6, 182, 212, 0.1);
      backdrop-filter: blur(4px);
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes spin-rev {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }
    @keyframes pulse {
      from { opacity: 0.5; transform: scale(0.95); }
      to { opacity: 0.9; transform: scale(1.05); }
    }

    .card {
      background: rgba(2, 6, 23, 0.45);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      color: #ffffff;
      max-width: 560px;
      width: 100%;
      border-radius: 24px;
      padding: 36px 28px;
      border: 1px solid rgba(34, 211, 238, 0.3);
      text-align: center;
      position: relative;
      z-index: 10;
      box-shadow: 0 0 50px rgba(3, 21, 104, 0.8);
    }

    .top-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(6, 182, 212, 0.2);
      border: 1px solid rgba(103, 232, 249, 0.4);
      color: #a5f3fc;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    .star-circle {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #dc2626;
      border: 1px solid #fde047;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fde047;
      font-size: 10px;
      font-weight: 900;
      line-height: 1;
    }

    .emblem-wrapper {
      width: 100px;
      height: 100px;
      margin: 0 auto 16px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .emblem-aura {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: rgba(34, 211, 238, 0.4);
      filter: blur(16px);
    }
    .emblem-border {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: linear-gradient(135deg, #22d3ee, #3b82f6, #4f46e5);
      padding: 4px;
      box-shadow: 0 0 35px rgba(34, 211, 238, 0.6);
    }
    .emblem-inner {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #020617;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      border: 2px solid rgba(103, 232, 249, 0.8);
      overflow: hidden;
    }
    .emblem-inner img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.9));
    }

    .org-title {
      font-size: 14px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .org-sub {
      font-size: 11px;
      font-weight: 800;
      color: #67e8f9;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 18px;
    }

    .maintenance-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(245, 158, 11, 0.2);
      color: #fcd34d;
      font-weight: 800;
      font-size: 11px;
      padding: 6px 16px;
      border-radius: 9999px;
      border: 1px solid rgba(245, 158, 11, 0.4);
      margin-bottom: 16px;
      text-transform: uppercase;
      box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #fbbf24;
      animation: pulse 1.5s infinite;
    }

    h1 {
      font-size: 18px;
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 10px;
      line-height: 1.35;
    }
    p.msg {
      font-size: 12.5px;
      line-height: 1.6;
      color: #e0e7ff;
      margin-bottom: 20px;
    }

    .status-steps {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-bottom: 18px;
    }
    .step-item {
      padding: 8px;
      border-radius: 12px;
      border: 1px solid rgba(34, 211, 238, 0.3);
      background: rgba(6, 182, 212, 0.1);
      color: #a5f3fc;
      font-size: 10px;
      font-weight: 700;
      text-align: center;
    }

    .footer {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid rgba(34, 211, 238, 0.2);
      font-size: 11px;
      color: #a5f3fc;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }
    .admin-btn {
      background: linear-gradient(90deg, #dc2626, #b91c1c);
      color: #ffffff;
      text-decoration: none;
      font-weight: 800;
      padding: 10px 18px;
      border-radius: 12px;
      font-size: 12px;
      border: 1px solid rgba(239, 68, 68, 0.6);
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 0 20px rgba(220, 38, 38, 0.4);
    }
    .admin-btn:hover {
      background: linear-gradient(90deg, #ef4444, #dc2626);
    }
  </style>
</head>
<body>
  <div class="radar-container">
    <div class="luminescence"></div>
    <div class="ring-dashed"></div>
    <div class="ring-glowing"></div>
    <div class="ring-dot"></div>
    <div class="ring-core"></div>
  </div>

  <div class="card">
    <div class="top-badge">
      <span class="star-circle">★</span>
      <span>CỔNG THÔNG TIN SỐ • ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP</span>
    </div>
    
    <div class="emblem-wrapper">
      <div class="emblem-aura"></div>
      <div class="emblem-border">
        <div class="emblem-inner">
          <img src="https://www.mattrancantho.vn/files/images/Logo%20-%20Icon/Logo%20MTTQ.png" alt="Logo MTTQ" />
        </div>
      </div>
    </div>

    <div class="org-title">Ủy Ban Mặt Trận Tổ Quốc Việt Nam</div>
    <div class="org-sub">Phường Chánh Hiệp • TP. Hồ Chí Minh</div>

    <div class="maintenance-badge">
      <span class="dot"></span> THÔNG BÁO BẢO TRÌ NÂNG CẤP HỆ THỐNG
    </div>

    <h1>${escapeHtml(currentSettings.maintenanceTitle)}</h1>
    <p class="msg">${escapeHtml(currentSettings.maintenanceMessage)}</p>

    <div class="status-steps">
      <div class="step-item">⚡ Nâng Cấp Lõi</div>
      <div class="step-item">💾 Tối Ưu CSDL</div>
      <div class="step-item" style="border-color: rgba(52, 211, 153, 0.4); color: #6ee7b7;">🛡️ Bảo Mật SSL</div>
    </div>

    ${scheduledHtml}

    <div class="footer">
      <div>Phường Chánh Hiệp - TP. Thủ Dầu Một</div>
      <a href="/#/admin" class="admin-btn">🔒 Đăng nhập Cán bộ (/admin)</a>
    </div>
  </div>
</body>
</html>`;

  return res.send(htmlContent);
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
