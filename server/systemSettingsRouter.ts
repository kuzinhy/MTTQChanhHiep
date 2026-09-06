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

  // 0. Container orchestration, reverse proxy & health check endpoints
  const isHealthCheck =
    cleanPath === '/api/health' ||
    cleanPath === '/healthz' ||
    cleanPath === '/health' ||
    cleanPath === '/ping';

  if (isHealthCheck) {
    return next();
  }

  // 1. Admin & Staff bypass via cookie, query parameter, or custom header
  const cookiesHeader = req.headers.cookie || '';
  const hasAdminBypass =
    req.headers['x-admin-bypass'] === 'true' ||
    req.query.admin === '1' ||
    cookiesHeader.includes('mttq_staff_session=1') ||
    cookiesHeader.includes('mttq_admin_session=1');

  if (hasAdminBypass) {
    return next();
  }

  // 2. Explicit Admin & Management routes for staff to access login & office
  const isAdminPath =
    cleanPath === '/admin' ||
    cleanPath.startsWith('/admin/') ||
    cleanPath === '/van-phong-so' ||
    cleanPath.startsWith('/van-phong-so/') ||
    cleanPath.startsWith('/api/admin') ||
    cleanPath.startsWith('/api/auth') ||
    cleanPath.startsWith('/api/system');

  if (isAdminPath) {
    return next();
  }

  // 3. Technical assets, Vite dev middleware bundles, and scripts (needed so /admin can load)
  const isInternalAssetOrVite =
    cleanPath.startsWith('/@vite') ||
    cleanPath.startsWith('/@fs') ||
    cleanPath.startsWith('/@id') ||
    cleanPath.startsWith('/__vite') ||
    cleanPath.startsWith('/src') ||
    cleanPath.startsWith('/node_modules') ||
    cleanPath.startsWith('/assets') ||
    cleanPath.startsWith('/uploads') ||
    cleanPath.startsWith('/_next') ||
    cleanPath === '/favicon.ico' ||
    cleanPath === '/icon.svg' ||
    cleanPath === '/manifest.webmanifest' ||
    cleanPath === '/manifest.json' ||
    cleanPath === '/sw.js' ||
    cleanPath === '/registerSW.js';

  const isStaticAsset = /\.(js|mjs|jsx|ts|tsx|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|json|map|mp4|webm|wasm)$/i.test(cleanPath);

  if (isInternalAssetOrVite || isStaticAsset) {
    return next();
  }

  // 4. Standalone check status endpoint or explicit maintenance path
  if (cleanPath === '/maintenance') {
    return serveStandalone503(req, res);
  }

  // 5. If client calls any public API while in maintenance mode -> Return HTTP 503 JSON
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

  // 6. ALL OTHER PUBLIC WEB VISITS (including root '/', '/index.html', etc.)
  // -> IMMEDIATELY RETURN THE RADAR HUD 503 MAINTENANCE PAGE!
  return serveStandalone503(req, res);
}

function serveStandalone503(_req: Request, res: Response) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('X-Maintenance-Mode', 'true');
  // Return HTTP 200 OK so Cloud Run, ingress, and AI Studio dev server supervisor confirm successful start
  res.status(200);

  const scheduledHtml = currentSettings.showScheduledTime && (currentSettings.maintenanceStartAt || currentSettings.maintenanceEndAt) ? `
    <div style="background: rgba(239, 246, 255, 0.7); border: 1px solid #bfdbfe; padding: 12px; border-radius: 14px; margin: 12px 0; text-align: left; font-size: 11px; color: #334155;">
      <strong style="display: block; margin-bottom: 6px; color: #1e3a8a; font-size: 11.5px;">⏱️ Thời gian bảo trì dự kiến:</strong>
      ${currentSettings.maintenanceStartAt ? `<div style="display: flex; justify-content: space-between; padding: 5px 8px; background: #ffffff; border-radius: 8px; margin-bottom: 5px; border: 1px solid #e2e8f0;"><span style="color: #64748b;">Bắt đầu:</span><strong style="color: #0f172a;">${new Date(currentSettings.maintenanceStartAt).toLocaleString('vi-VN')}</strong></div>` : ''}
      ${currentSettings.maintenanceEndAt ? `<div style="display: flex; justify-content: space-between; padding: 5px 8px; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0;"><span style="color: #64748b;">Dự kiến hoàn thành:</span><strong style="color: #047857;">${new Date(currentSettings.maintenanceEndAt).toLocaleString('vi-VN')}</strong></div>` : ''}
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
      background: linear-gradient(180deg, #f0f7ff 0%, #e8f2fe 50%, #dbeafe 100%);
      color: #1e293b;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
      position: relative;
      overflow-x: hidden;
    }
    
    /* Radar HUD Rings (Light Blue & White Theme) */
    .radar-container {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      overflow: hidden;
      z-index: 1;
      opacity: 0.85;
    }
    .luminescence {
      position: absolute;
      width: 40rem;
      height: 40rem;
      background: rgba(56, 189, 248, 0.2);
      border-radius: 50%;
      filter: blur(100px);
      animation: pulse 4s infinite alternate ease-in-out;
    }
    .ring-dashed {
      position: absolute;
      width: 42rem;
      height: 42rem;
      border-radius: 50%;
      border: 1px dashed rgba(147, 197, 253, 0.4);
      animation: spin 60s linear infinite;
    }
    .ring-glowing {
      position: absolute;
      width: 32rem;
      height: 32rem;
      border-radius: 50%;
      border: 2px solid rgba(56, 189, 248, 0.35);
      box-shadow: 0 0 35px rgba(56, 189, 248, 0.25);
      animation: spin-rev 40s linear infinite;
    }
    .ring-dot {
      position: absolute;
      width: 24rem;
      height: 24rem;
      border-radius: 50%;
      border: 2px dotted rgba(147, 197, 253, 0.6);
      animation: spin 25s linear infinite;
    }
    .ring-core {
      position: absolute;
      width: 15rem;
      height: 15rem;
      border-radius: 50%;
      border: 2px solid rgba(147, 197, 253, 0.7);
      background: rgba(186, 230, 253, 0.2);
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
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      color: #0f172a;
      max-width: 480px;
      width: 100%;
      border-radius: 24px;
      padding: 24px 22px;
      border: 1px solid rgba(191, 219, 254, 0.9);
      text-align: center;
      position: relative;
      z-index: 10;
      box-shadow: 0 20px 60px -15px rgba(28, 57, 143, 0.12), 0 0 25px rgba(56, 189, 248, 0.08);
    }

    .top-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 9999px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1e40af;
      font-size: 9.5px;
      font-weight: 900;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .star-circle {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #dc2626;
      border: 1px solid #fde047;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fde047;
      font-size: 9px;
      font-weight: 900;
      line-height: 1;
    }

    .emblem-wrapper {
      width: 68px;
      height: 68px;
      margin: 0 auto 10px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .emblem-aura {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: rgba(56, 189, 248, 0.3);
      filter: blur(12px);
    }
    .emblem-border {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: linear-gradient(135deg, #2563eb, #38bdf8, #4f46e5);
      padding: 2.5px;
      box-shadow: 0 4px 15px rgba(37, 99, 235, 0.25);
    }
    .emblem-inner {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      border: 1.5px solid #dbeafe;
      overflow: hidden;
    }
    .emblem-inner img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .org-title {
      font-size: 13px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .org-sub {
      font-size: 11px;
      font-weight: 800;
      color: #1d4ed8;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    .maintenance-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #fffbeb;
      color: #78350f;
      font-weight: 800;
      font-size: 10.5px;
      padding: 4px 12px;
      border-radius: 9999px;
      border: 1px solid #fde68a;
      margin-bottom: 12px;
      text-transform: uppercase;
      box-shadow: 0 1px 3px rgba(245, 158, 11, 0.1);
    }
    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #f59e0b;
      animation: pulse 1.5s infinite;
    }

    h1 {
      font-size: 15px;
      font-weight: 900;
      color: #0f172a;
      margin-bottom: 6px;
      line-height: 1.35;
    }
    p.msg {
      font-size: 12px;
      line-height: 1.55;
      color: #475569;
      margin-bottom: 14px;
    }

    .status-steps {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      margin-bottom: 12px;
    }
    .step-item {
      padding: 6px 4px;
      border-radius: 10px;
      border: 1px solid #bfdbfe;
      background: #eff6ff;
      color: #1e3a8a;
      font-size: 9.5px;
      font-weight: 700;
      text-align: center;
    }

    .progress-section {
      margin: 10px 0 14px;
      text-align: left;
    }
    .progress-track {
      width: 100%;
      height: 10px;
      background: #dbeafe;
      border-radius: 9999px;
      overflow: hidden;
      border: 1px solid #bfdbfe;
      padding: 2px;
    }
    .progress-fill {
      width: 70%;
      height: 100%;
      border-radius: 9999px;
      background: linear-gradient(90deg, #2563eb, #38bdf8);
      box-shadow: 0 1px 2px rgba(37, 99, 235, 0.3);
    }
    .progress-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 6px;
      font-size: 11px;
      font-weight: 600;
      color: #1e3a8a;
    }
    .progress-badge {
      font-family: monospace;
      font-weight: bold;
      color: #1d4ed8;
      background: #e0f2fe;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #bae6fd;
    }

    .footer {
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      font-size: 11px;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }
    .admin-btn {
      background: linear-gradient(90deg, #dc2626, #b91c1c);
      color: #ffffff;
      text-decoration: none;
      font-weight: 800;
      padding: 8px 14px;
      border-radius: 10px;
      font-size: 11px;
      border: 1px solid #ef4444;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
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
      <span>CỔNG THÔNG TIN SỐ • MTTQ PHƯỜNG CHÁNH HIỆP</span>
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
      <div class="step-item" style="border-color: #a7f3d0; background: #ecfdf5; color: #065f46;">🛡️ Bảo Mật SSL</div>
    </div>

    <!-- Live Status 70% Static Progress Bar -->
    <div class="progress-section">
      <div class="progress-track">
        <div class="progress-fill"></div>
      </div>
      <div class="progress-label">
        <span style="display: flex; align-items: center; gap: 6px;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
          Đang thực hiện quy trình bảo dưỡng kỹ thuật
        </span>
        <span class="progress-badge">70%</span>
      </div>
    </div>

    ${scheduledHtml}

    <div class="footer">
      <div>Phường Chánh Hiệp - TP. Thủ Dầu Một</div>
      <a href="/admin" class="admin-btn">🔒 Đăng nhập Cán bộ (/admin)</a>
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
