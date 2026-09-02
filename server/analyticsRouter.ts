import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const analyticsRouter = Router();

// Path for durable analytics data persistence
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'analytics_store.json');

interface AnalyticsData {
  totalVisits: number;
  todayVisits: number;
  monthVisits: number;
  lastDate: string; // YYYY-MM-DD
  lastMonth: string; // YYYY-MM
  hourlyTraffic: Record<string, number>; // "00", "01", ..., "23"
  firstRecordDate: string;
}

// Default initial baseline data (Accurate organic counter starting from app creation)
const DEFAULT_DATA: AnalyticsData = {
  totalVisits: 1,
  todayVisits: 1,
  monthVisits: 1,
  lastDate: new Date().toISOString().split('T')[0],
  lastMonth: new Date().toISOString().substring(0, 7),
  hourlyTraffic: {},
  firstRecordDate: new Date().toISOString().split('T')[0],
};

// In-memory active presence session map: sessionId -> { lastSeen: timestamp, ip?: string, userAgent?: string }
const activeSessions = new Map<string, { lastSeen: number; page?: string }>();

// Ensure data directory exists and load persistent stats
function loadAnalyticsData(): AnalyticsData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const data: AnalyticsData = JSON.parse(raw);
      
      // Auto-reset today's / month's counter if date rolled over
      const today = new Date().toISOString().split('T')[0];
      const currentMonth = today.substring(0, 7);

      let modified = false;
      if (data.lastDate !== today) {
        data.todayVisits = 0;
        data.lastDate = today;
        modified = true;
      }
      if (data.lastMonth !== currentMonth) {
        data.monthVisits = 0;
        data.lastMonth = currentMonth;
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      }

      return data;
    } else {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DATA, null, 2), 'utf-8');
      return DEFAULT_DATA;
    }
  } catch (err) {
    console.error('[Analytics] Error reading DB file:', err);
    return { ...DEFAULT_DATA };
  }
}

function saveAnalyticsData(data: AnalyticsData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Analytics] Error saving DB file:', err);
  }
}

// Clean stale sessions inactive for more than 15 seconds
function getCleanOnlineCount(): number {
  const now = Date.now();
  const TIMEOUT_MS = 15000; // 15 seconds cutoff

  for (const [sessionId, session] of activeSessions.entries()) {
    if (now - session.lastSeen > TIMEOUT_MS) {
      activeSessions.delete(sessionId);
    }
  }

  // Minimum 1 active online count (the current user)
  return Math.max(1, activeSessions.size);
}

// 1. GET /api/analytics/stats - Return current traffic and presence statistics
analyticsRouter.get('/stats', (_req: Request, res: Response) => {
  const data = loadAnalyticsData();
  const onlineCount = getCleanOnlineCount();

  res.json({
    success: true,
    onlineCount,
    totalVisits: data.totalVisits,
    todayVisits: data.todayVisits,
    monthVisits: data.monthVisits,
    lastDate: data.lastDate,
    hourlyTraffic: data.hourlyTraffic,
    serverTime: new Date().toISOString(),
  });
});

// 2. POST /api/analytics/visit - Register new session visit
analyticsRouter.post('/visit', (req: Request, res: Response) => {
  try {
    const { sessionId, isNewSession = true, currentPage = 'HOME' } = req.body;
    const now = Date.now();
    const data = loadAnalyticsData();

    if (sessionId) {
      activeSessions.set(sessionId, { lastSeen: now, page: currentPage });
    }

    if (isNewSession) {
      const today = new Date().toISOString().split('T')[0];
      const currentMonth = today.substring(0, 7);
      const currentHour = new Date().getHours().toString().padStart(2, '0');

      if (data.lastDate !== today) {
        data.todayVisits = 0;
        data.lastDate = today;
      }
      if (data.lastMonth !== currentMonth) {
        data.monthVisits = 0;
        data.lastMonth = currentMonth;
      }

      data.totalVisits += 1;
      data.todayVisits += 1;
      data.monthVisits += 1;

      if (!data.hourlyTraffic) data.hourlyTraffic = {};
      data.hourlyTraffic[currentHour] = (data.hourlyTraffic[currentHour] || 0) + 1;

      saveAnalyticsData(data);
    }

    const onlineCount = getCleanOnlineCount();

    res.json({
      success: true,
      onlineCount,
      totalVisits: data.totalVisits,
      todayVisits: data.todayVisits,
      monthVisits: data.monthVisits,
    });
  } catch (err: any) {
    console.error('[Analytics] Error recording visit:', err);
    res.status(500).json({ error: 'Failed to record visit' });
  }
});

// 3. POST /api/analytics/heartbeat - Keep-alive signal for presence
analyticsRouter.post('/heartbeat', (req: Request, res: Response) => {
  try {
    const { sessionId, currentPage } = req.body;

    if (sessionId) {
      activeSessions.set(sessionId, { lastSeen: Date.now(), page: currentPage });
    }

    const onlineCount = getCleanOnlineCount();
    const data = loadAnalyticsData();

    res.json({
      success: true,
      onlineCount,
      totalVisits: data.totalVisits,
      todayVisits: data.todayVisits,
      monthVisits: data.monthVisits,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Heartbeat error' });
  }
});

// 4. DELETE /api/analytics/heartbeat - Tab unload cleanup
analyticsRouter.delete('/heartbeat', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    if (sessionId) {
      activeSessions.delete(sessionId);
    }
    res.json({ success: true, onlineCount: getCleanOnlineCount() });
  } catch (err: any) {
    res.status(500).json({ error: 'Unload error' });
  }
});
