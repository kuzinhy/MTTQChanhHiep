import type { Request, Response, NextFunction } from 'express';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const adminRoles = new Set(['SUPER_ADMIN', 'MTTQ_ADMIN', 'ADMIN', 'MANAGER', 'LEADER']);

export async function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const match = req.headers.authorization?.match(/^Bearer (\S+)$/i);
  if (!match) return res.status(401).json({ success: false, error: 'Vui lòng đăng nhập để tiếp tục.' });
  if (!getApps().length) initializeApp({ projectId: firebaseConfig.projectId });
  let uid: string;
  try {
    uid = (await getAuth().verifyIdToken(match[1], true)).uid;
  } catch {
    return res.status(401).json({ success: false, error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' });
  }
  try {
    const db = getFirestore();
    const user = await db.collection('users').doc(uid).get();
    const profile = user.exists ? user.data() : (await db.collection('staffUsers').doc(uid).get()).data();
    const status = String(profile?.status || '').toLowerCase();
    if (!profile || profile.active === false || ['locked', 'disabled', 'suspended', 'inactive', 'blocked'].includes(status) || !adminRoles.has(String(profile.role).toUpperCase())) {
      return res.status(403).json({ success: false, error: 'Tài khoản không có quyền quản trị hoặc đã bị khóa.' });
    }
    // Audit identity must come from the verified server-side profile.
    req.headers['x-staff-email'] = String(profile.email || uid);
    next();
  } catch (error) {
    console.error('[Admin authorization]', error);
    return res.status(503).json({ success: false, error: 'Chưa thể kiểm tra quyền truy cập. Vui lòng thử lại sau.' });
  }
}
