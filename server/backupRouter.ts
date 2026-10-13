import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const backupRouter = express.Router();

const BACKUP_DIR = path.join(process.cwd(), 'backups');

// Ensure backups directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  try {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create backups directory:', err);
  }
}

// 1. GET /api/admin/backup/snapshots - List all server-side snapshots
backupRouter.get('/snapshots', (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      return res.json({ success: true, snapshots: [] });
    }

    const files = fs.readdirSync(BACKUP_DIR);
    const snapshots = files
      .filter(f => f.endsWith('.json'))
      .map(filename => {
        const filePath = path.join(BACKUP_DIR, filename);
        const stats = fs.statSync(filePath);
        let recordCount = 0;
        let version = '3.0';
        let metadata: any = null;

        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const parsed = JSON.parse(content);
          version = parsed.version || '3.0';
          metadata = parsed.metadata || null;
          
          const tables = parsed.tables || parsed.data || {};
          if (tables) {
            Object.values(tables).forEach((val: any) => {
              if (Array.isArray(val)) {
                recordCount += val.length;
              } else if (val && typeof val === 'object') {
                recordCount += Object.keys(val).length;
              }
            });
          }
        } catch {
          // ignore parsing error for snapshot stats preview
        }

        return {
          filename,
          sizeBytes: stats.size,
          sizeFormatted: (stats.size / 1024).toFixed(1) + ' KB',
          createdAt: stats.mtime.toISOString(),
          recordCount,
          version,
          metadata
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      count: snapshots.length,
      snapshots
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Lỗi đọc danh sách bản sao lưu' });
  }
});

// 2. POST /api/admin/backup/snapshots/create - Create a server snapshot
backupRouter.post('/snapshots/create', (req: Request, res: Response) => {
  try {
    const { backupData, label } = req.body;
    if (!backupData || typeof backupData !== 'object') {
      return res.status(400).json({ success: false, error: 'Dữ liệu sao lưu không hợp lệ' });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeLabel = label ? `_${label.replace(/[^a-zA-Z0-9_-]/g, '_')}` : '';
    const filename = `snapshot_mttq_chanhhiep_${timestamp}${safeLabel}.json`;
    const filePath = path.join(BACKUP_DIR, filename);

    const snapshotPayload = {
      version: '3.0',
      exportedAt: new Date().toISOString(),
      source: 'MTTQ Phường Chánh Hiệp - Server Automated Snapshot',
      metadata: {
        creator: req.headers['x-staff-email'] || 'Hệ thống Server',
        label: label || 'Sao lưu tự động máy chủ',
        clientIp: req.ip
      },
      ...backupData
    };

    fs.writeFileSync(filePath, JSON.stringify(snapshotPayload, null, 2), 'utf-8');

    // Clean up old snapshots if exceeds 30
    const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json'));
    if (files.length > 30) {
      const sorted = files.map(f => ({
        name: f,
        mtime: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime()
      })).sort((a, b) => a.mtime - b.mtime);

      // delete oldest
      while (sorted.length > 30) {
        const oldest = sorted.shift();
        if (oldest) {
          try { fs.unlinkSync(path.join(BACKUP_DIR, oldest.name)); } catch {}
        }
      }
    }

    res.json({
      success: true,
      message: 'Đã lưu bản sao lưu thành công trên máy chủ!',
      snapshot: {
        filename,
        createdAt: snapshotPayload.exportedAt,
        sizeBytes: fs.statSync(filePath).size
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Không thể tạo bản sao lưu máy chủ' });
  }
});

// 3. GET /api/admin/backup/snapshots/download/:filename - Download snapshot
backupRouter.get('/snapshots/download/:filename', (req: Request, res: Response) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(BACKUP_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy tệp sao lưu trên máy chủ' });
    }

    res.download(filePath, filename);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Lỗi tải tệp sao lưu' });
  }
});

// 4. GET /api/admin/backup/snapshots/read/:filename - Read JSON content directly
backupRouter.get('/snapshots/read/:filename', (req: Request, res: Response) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(BACKUP_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy tệp sao lưu trên máy chủ' });
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);

    res.json({
      success: true,
      data: parsed
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Lỗi đọc nội dung bản sao lưu' });
  }
});

// 5. DELETE /api/admin/backup/snapshots/:filename - Delete snapshot
backupRouter.delete('/snapshots/:filename', (req: Request, res: Response) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(BACKUP_DIR, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ success: true, message: 'Đã xóa bản sao lưu thành công' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Lỗi xóa tệp sao lưu' });
  }
});

// 6. GET /api/admin/backup/latest - Get latest snapshot JSON
backupRouter.get('/latest', (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      return res.status(404).json({ success: false, error: 'Chưa có bản sao lưu nào trên máy chủ' });
    }

    const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json'));
    if (files.length === 0) {
      return res.status(404).json({ success: false, error: 'Chưa có bản sao lưu nào' });
    }

    const sorted = files.map(f => ({
      name: f,
      mtime: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime()
    })).sort((a, b) => b.mtime - a.mtime);

    const latestFile = sorted[0].name;
    const content = fs.readFileSync(path.join(BACKUP_DIR, latestFile), 'utf-8');
    res.json({
      success: true,
      filename: latestFile,
      data: JSON.parse(content)
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Lỗi đọc bản sao lưu mới nhất' });
  }
});

