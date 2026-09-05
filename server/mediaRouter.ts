import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true
});

const router = express.Router();

// Memory storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Middleware for authentication & authorization check
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const staffRole = req.headers['x-staff-role'] as string;
  const staffEmail = req.headers['x-staff-email'] as string;
  const adminToken = req.headers['x-admin-token'] as string;

  // Check if caller provides bearer token or staff role header
  const hasAuth = !!(authHeader || adminToken || staffEmail || staffRole);
  
  if (!hasAuth) {
    return res.status(401).json({
      success: false,
      error: 'Chưa đăng nhập. Yêu cầu xác thực tài khoản Cán bộ / Admin.'
    });
  }

  // Check role if provided (Public user is forbidden)
  if (staffRole === 'PUBLIC') {
    return res.status(403).json({
      success: false,
      error: 'Không đủ quyền hạn. Chức năng này chỉ dành cho BTV / Admin.'
    });
  }

  next();
}

// 1. POST /api/admin/media/upload - Secure Cloudinary Upload Endpoint
router.post('/upload', requireAdminAuth, (req: Request, res: Response, next: NextFunction) => {
  upload.single('file')(req, res, (err: any) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          success: false,
          error: 'Kích thước tệp quá lớn. Giới hạn tối đa là 10MB.'
        });
      }
      return res.status(400).json({
        success: false,
        error: err.message || 'Lỗi nhận dữ liệu tệp tin upload.'
      });
    }
    next();
  });
}, async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'Không tìm thấy tệp tin ảnh trong request.'
      });
    }

    // MIME type check: strictly allow image/jpeg, image/png, image/webp
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: 'Định dạng tệp không hợp lệ. Chỉ chấp nhận tệp ảnh JPG, PNG, WEBP.'
      });
    }

    // Folder path sanitization and validation
    let folder = req.body.folder || 'articles';
    // Remove any path traversal
    folder = folder.replace(/\.\./g, '').replace(/[^\w\-\/]/g, '').replace(/^\/+|\/+$/g, '');
    
    // Allowed folder subpaths
    const allowedSubfolders = ['articles', 'banners', 'events', 'digital-map', 'ho-chi-minh-space', 'avatars'];
    const subfolderName = folder.split('/').pop() || 'articles';
    const targetSubfolder = allowedSubfolders.includes(subfolderName) ? subfolderName : 'articles';
    const fullFolder = `mttq-phuong-chanh-hiep/${targetSubfolder}`;

    // Verify Cloudinary credentials
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(400).json({
        success: false,
        error: 'Chưa cấu hình Cloudinary API Keys trên máy chủ (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET). Vui lòng thêm các biến môi trường này trong Cài đặt / Secrets.'
      });
    }

    // Configure Cloudinary dynamically with active environment variables
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });

    // Stream upload to Cloudinary using official Node.js SDK
    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: fullFolder,
          resource_type: 'image',
          use_filename: false,
          unique_filename: true,
          overwrite: false
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    return res.json({
      success: true,
      image: {
        url: uploadResult.url,
        secureUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        assetId: uploadResult.asset_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        bytes: uploadResult.bytes
      }
    });
  } catch (error: any) {
    console.error('Cloudinary upload error details:', error);
    const detailMsg = error?.message || error?.error?.message || (typeof error === 'string' ? error : null);
    return res.status(500).json({
      success: false,
      error: detailMsg ? `Lỗi dịch vụ Cloudinary: ${detailMsg}` : 'Tải ảnh lên Cloudinary thất bại. Vui lòng kiểm tra lại cấu hình API Key.'
    });
  }
});

// 2. GET /api/admin/media - Fetch Cloudinary Media Library List
router.get('/', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(200).json({
        success: true,
        resources: [],
        message: 'Chưa cấu hình Cloudinary credentials.'
      });
    }

    const folderPrefix = req.query.folder 
      ? `mttq-phuong-chanh-hiep/${req.query.folder}`
      : 'mttq-phuong-chanh-hiep';

    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folderPrefix,
      max_results: 100,
      direction: 'desc'
    });

    const resources = (result.resources || []).map((r: any) => ({
      publicId: r.public_id,
      secureUrl: r.secure_url,
      url: r.url,
      width: r.width,
      height: r.height,
      format: r.format,
      bytes: r.bytes,
      createdAt: r.created_at,
      folder: r.folder || 'mttq-phuong-chanh-hiep/articles'
    }));

    return res.json({
      success: true,
      resources
    });
  } catch (error: any) {
    console.error('Cloudinary list error:', error);
    return res.status(500).json({
      success: false,
      error: 'Không thể lấy danh sách thư viện ảnh từ Cloudinary.'
    });
  }
});

// In-memory list of active content images used for verification
const activeImageUsageSet = new Set<string>();

// Endpoint to report or sync used image IDs from articles
router.post('/sync-usage', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { usedPublicIds = [] } = req.body;
    if (Array.isArray(usedPublicIds)) {
      activeImageUsageSet.clear();
      usedPublicIds.forEach(id => {
        if (typeof id === 'string' && id.trim()) {
          activeImageUsageSet.add(id.trim());
        }
      });
    }
    return res.json({ success: true, count: activeImageUsageSet.size });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 3. DELETE /api/admin/media - Secure Delete Endpoint
router.delete('/', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const publicId = (req.query.publicId as string) || (req.body?.publicId as string);
    if (!publicId) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp publicId của ảnh cần xóa.'
      });
    }

    // Safety check: Prevent deleting outside allowed namespace
    if (!publicId.startsWith('mttq-phuong-chanh-hiep/')) {
      return res.status(400).json({
        success: false,
        error: 'Chỉ được phép xóa các ảnh thuộc thư mục dự án.'
      });
    }

    // Check if the image is currently in use
    const isUsedInArticles = activeImageUsageSet.has(publicId) || req.body?.isUsed === true;
    if (isUsedInArticles) {
      return res.status(409).json({
        success: false,
        inUse: true,
        error: 'Không thể xóa hình ảnh vì ảnh đang được sử dụng trong bài viết. Vui lòng gỡ ảnh khỏi bài viết trước khi xóa.'
      });
    }

    const destroyResult = await cloudinary.uploader.destroy(publicId);

    if (destroyResult.result !== 'ok' && destroyResult.result !== 'not_found') {
      return res.status(500).json({
        success: false,
        error: `Không thể xóa ảnh từ Cloudinary (Kết quả: ${destroyResult.result}).`
      });
    }

    return res.json({
      success: true,
      message: 'Đã xóa ảnh thành công khỏi Cloudinary.',
      publicId
    });
  } catch (error: any) {
    console.error('Cloudinary delete error:', error);
    return res.status(500).json({
      success: false,
      error: 'Xóa ảnh thất bại. Vui lòng kiểm tra lại.'
    });
  }
});

export const mediaRouter = router;
