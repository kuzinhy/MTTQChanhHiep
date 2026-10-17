import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export const securityRouter = express.Router();

// Initialize Firebase Admin if not already initialized
if (getApps().length === 0) {
  initializeApp({
    projectId: 'mttqphuongchanhhiep-279e1'
  });
}

const db = getFirestore();

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Chưa cấu hình GEMINI_API_KEY trong môi trường.');
  }
  return new GoogleGenAI({ apiKey });
}

// Function to lock the system
async function lockSystem(reason: string, details: string, source: string, userEmail?: string, userId?: string) {
  try {
    console.log(`[SECURITY] LOCKING SYSTEM: ${reason}`);
    
    // 1. Update system status
    await db.collection('system_status').doc('lock_state').set({
      isLocked: true,
      lockedAt: new Date().toISOString(),
      lockReason: reason,
      lockedBy: 'SECURITY_BOT'
    }, { merge: true });

    // 2. Create security alert
    const alertId = `alert-${Date.now()}`;
    await db.collection('security_alerts').doc(alertId).set({
      id: alertId,
      type: source === 'INTRUSION_DETECTION' ? 'INTRUSION' : 'SENSITIVE_CONTENT',
      severity: 'CRITICAL',
      details: details,
      source: source,
      userId: userId || 'anonymous',
      userEmail: userEmail || 'unknown',
      timestamp: new Date().toISOString()
    });

    return true;
  } catch (err) {
    console.error('[SECURITY] Failed to lock system:', err);
    return false;
  }
}

// Endpoint to scan content for sensitive information
securityRouter.post('/scan-content', async (req: Request, res: Response) => {
  try {
    const { content, title, contentType, userEmail, userId } = req.body;
    
    if (!content || !content.trim()) {
      return res.json({ success: true, isSafe: true });
    }

    const ai = getGeminiClient();
    const prompt = `Bạn là Chuyên gia Kiểm duyệt Nội dung Số của Ủy ban MTTQ Việt Nam Phường Chánh Hiệp.
Nhiệm vụ: Phân tích nội dung sau đây để phát hiện các yếu tố nhạy cảm, từ ngữ lạ, nội dung xâm nhập hệ thống, hoặc các nội dung không phù hợp với thuần phong mỹ tục, chính trị, pháp luật Việt Nam.

--- NỘI DUNG CẦN KIỂM TRA (${contentType || 'BÀI VIẾT'}) ---
Tiêu đề: ${title || 'Không có'}
Nội dung:
"""
${content}
"""

Hãy trả về DUY NHẤT một đối tượng JSON hợp lệ:
{
  "isSafe": true | false,
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "reason": "Lý do nếu không an toàn (tiếng Việt)",
  "detectedWords": ["danh sách các từ ngữ nhạy cảm/lạ phát hiện được"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json' }
    });

    const result = JSON.parse(response.text || '{}');
    
    // If not safe and risk is high or critical, lock the system
    if (result.isSafe === false && (result.riskLevel === 'HIGH' || result.riskLevel === 'CRITICAL')) {
      await lockSystem(
        `Phát hiện nội dung nhạy cảm: ${result.reason}`,
        JSON.stringify(result),
        contentType || 'CONTENT_SCAN',
        userEmail,
        userId
      );
    }

    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error('Error in /api/security/scan-content:', err);
    res.status(500).json({ error: err.message || 'Lỗi kiểm duyệt nội dung.' });
  }
});

// Endpoint to report intrusion (e.g. many failed login attempts)
securityRouter.post('/report-intrusion', async (req: Request, res: Response) => {
  try {
    const { details, userEmail, userId, severity = 'HIGH' } = req.body;
    
    await lockSystem(
      `Phát hiện xâm nhập: ${details}`,
      details,
      'INTRUSION_DETECTION',
      userEmail,
      userId
    );

    res.json({ success: true, message: 'Hệ thống đã được khóa để bảo mật.' });
  } catch (err: any) {
    console.error('Error in /api/security/report-intrusion:', err);
    res.status(500).json({ error: 'Lỗi báo cáo xâm nhập.' });
  }
});

// Endpoint to check if system is locked (for fast frontend check)
securityRouter.get('/status', async (_req: Request, res: Response) => {
  try {
    const doc = await db.collection('system_status').doc('lock_state').get();
    if (!doc.exists) {
      return res.json({ isLocked: false });
    }
    res.json(doc.data());
  } catch (err) {
    res.status(500).json({ error: 'Lỗi kiểm tra trạng thái hệ thống.' });
  }
});
