import { CloudinaryImageMeta } from '../types';

export interface UploadMediaResponse {
  success: boolean;
  image?: CloudinaryImageMeta;
  error?: string;
  isFallback?: boolean;
  warning?: string;
}

export interface MediaListResponse {
  success: boolean;
  resources?: CloudinaryImageMeta[];
  error?: string;
  message?: string;
}

export interface DeleteMediaResponse {
  success: boolean;
  inUse?: boolean;
  message?: string;
  error?: string;
}

// Helper to convert File to Base64 Data URL for local fallback
async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Get auth headers from stored session
function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'x-admin-token': 'admin-session-active',
    'x-staff-role': 'ADMIN',
    'x-staff-email': 'admin@chanhhiep.gov.vn'
  };

  try {
    const rawUser = localStorage.getItem('mttq_chanhhiep_current_user');
    if (rawUser) {
      const user = JSON.parse(rawUser);
      if (user.role) headers['x-staff-role'] = user.role;
      if (user.email) headers['x-staff-email'] = user.email;
    }
  } catch (err) {
    console.warn('Could not read current user session from localStorage:', err);
  }

  return headers;
}

/**
 * Upload an image file to Cloudinary via server-side Node.js proxy endpoint
 * Falls back seamlessly to Data URL if Cloudinary is unconfigured or unavailable
 */
export async function uploadMediaToCloudinary(
  file: File, 
  folder: string = 'articles'
): Promise<UploadMediaResponse> {
  // Client-side file validation before sending
  if (!file) {
    return { success: false, error: 'Vui lòng chọn tệp tin ảnh.' };
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: 'Định dạng tệp không hợp lệ. Hệ thống chỉ hỗ trợ tệp ảnh JPG, PNG, WEBP.'
    };
  }

  const maxSizeBytes = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSizeBytes) {
    return {
      success: false,
      error: 'Kích thước ảnh vượt quá giới hạn 10MB. Vui lòng nén bớt hoặc chọn tệp nhỏ hơn.'
    };
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const headers = getAuthHeaders();

    const response = await fetch('/api/admin/media/upload', {
      method: 'POST',
      headers,
      body: formData
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      const serverErr = data?.error || data?.message || `Lỗi tải lên (${response.status})`;
      console.warn('Cloudinary upload warning, engaging local Data URL fallback:', serverErr);

      // Create seamless Data URL fallback image object
      const base64Url = await fileToDataUrl(file);
      const format = file.type.split('/')[1] || 'jpeg';

      return {
        success: true,
        image: {
          url: base64Url,
          secureUrl: base64Url,
          publicId: `fallback-img-${Date.now()}`,
          format,
          bytes: file.size
        },
        isFallback: true,
        warning: `Ảnh đã được lưu dưới dạng Data URL dự phòng. (${serverErr})`
      };
    }

    return {
      success: true,
      image: data.image,
      isFallback: false
    };
  } catch (error: any) {
    console.warn('Network or server connection failed for Cloudinary, engaging Data URL fallback:', error);

    try {
      const base64Url = await fileToDataUrl(file);
      const format = file.type.split('/')[1] || 'jpeg';

      return {
        success: true,
        image: {
          url: base64Url,
          secureUrl: base64Url,
          publicId: `fallback-img-${Date.now()}`,
          format,
          bytes: file.size
        },
        isFallback: true,
        warning: 'Ảnh đã được lưu dưới dạng Data URL dự phòng (Do không kết nối được dịch vụ Cloudinary).'
      };
    } catch (fallbackErr: any) {
      return {
        success: false,
        error: error.message || 'Không thể đọc tệp tin ảnh. Vui lòng thử lại.'
      };
    }
  }
}

/**
 * Fetch media library list from Cloudinary
 */
export async function fetchMediaLibrary(folder?: string): Promise<MediaListResponse> {
  try {
    const headers = getAuthHeaders();
    const query = folder ? `?folder=${encodeURIComponent(folder)}` : '';
    const response = await fetch(`/api/admin/media${query}`, {
      method: 'GET',
      headers
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Lỗi không thể tải thư viện ảnh.'
      };
    }

    return {
      success: true,
      resources: data.resources || []
    };
  } catch (error: any) {
    console.error('fetchMediaLibrary error:', error);
    return {
      success: false,
      error: error.message || 'Lỗi kết nối máy chủ khi lấy thư viện ảnh.'
    };
  }
}

/**
 * Delete media from Cloudinary
 */
export async function deleteMediaFromCloudinary(
  publicId: string, 
  isUsedInArticles?: boolean
): Promise<DeleteMediaResponse> {
  if (!publicId) {
    return { success: false, error: 'Thiếu mã nhận diện publicId của hình ảnh.' };
  }

  try {
    const headers = {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    };

    const response = await fetch(`/api/admin/media?publicId=${encodeURIComponent(publicId)}`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ publicId, isUsed: isUsedInArticles })
    });

    const data = await response.json();

    if (response.status === 409 || data.inUse) {
      return {
        success: false,
        inUse: true,
        message: data.error || data.message || 'Ảnh đang được sử dụng trong bài viết. Vui lòng gỡ khỏi bài viết trước khi xóa.'
      };
    }

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || data.message || 'Không thể xóa hình ảnh khỏi Cloudinary.'
      };
    }

    return {
      success: true,
      message: data.message || 'Đã xóa hình ảnh thành công khỏi Cloudinary.'
    };
  } catch (error: any) {
    console.error('deleteMediaFromCloudinary error:', error);
    return {
      success: false,
      error: error.message || 'Lỗi kết nối máy chủ khi xóa hình ảnh.'
    };
  }
}

/**
 * Report used publicIds to server
 */
export async function syncImageUsageWithServer(usedPublicIds: string[]): Promise<boolean> {
  try {
    const headers = {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    };
    const response = await fetch('/api/admin/media/sync-usage', {
      method: 'POST',
      headers,
      body: JSON.stringify({ usedPublicIds })
    });
    return response.ok;
  } catch {
    return false;
  }
}
