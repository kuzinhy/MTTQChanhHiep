import { auth } from './firebase';
import { getApiUrl } from './api';

export async function getAuthenticatedHeaders(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (!user) throw new Error('Vui lòng đăng nhập để tiếp tục.');
  return { Authorization: `Bearer ${await user.getIdToken()}` };
}

export async function authenticatedFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  const authentication = await getAuthenticatedHeaders();
  headers.set('Authorization', authentication.Authorization);
  return fetch(getApiUrl(path), { ...options, headers });
}
