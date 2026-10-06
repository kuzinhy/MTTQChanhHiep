/**
 * Animated Icons Definition and Registry
 * Central registry for animated vector & Lordicon/Lottie-style micro-interaction icons
 */

export type AnimatedIconName = 
  | 'document' 
  | 'login' 
  | 'key' 
  | 'security' 
  | 'cloud_upload' 
  | 'tasks' 
  | 'bell' 
  | 'citizen' 
  | 'ai_brain' 
  | 'user_badge' 
  | 'success' 
  | 'warning';

export interface AnimatedIconConfig {
  name: AnimatedIconName;
  label: string;
  defaultSize: number;
  description: string;
  category: 'office' | 'auth' | 'cloud' | 'feedback' | 'system';
}

export const animatedIcons: Record<AnimatedIconName, AnimatedIconConfig> = {
  document: {
    name: 'document',
    label: 'Văn phòng số & Văn bản điện tử',
    defaultSize: 120,
    description: 'Minh họa tài liệu đa lớp, con dấu đỏ số hóa, tia quét laser AI và quỹ đạo kỹ thuật số',
    category: 'office'
  },
  login: {
    name: 'login',
    label: 'Cổng đăng nhập an toàn',
    defaultSize: 32,
    description: 'Cổng không gian ánh sáng với mũi tên vận tốc đàn hồi lướt qua ngưỡng cửa',
    category: 'auth'
  },
  key: {
    name: 'key',
    label: 'Chìa khóa truy cập công vụ',
    defaultSize: 20,
    description: 'Chìa khóa bảo mật xoay góc 90 độ phát tia sáng mở khóa cơ học',
    category: 'auth'
  },
  security: {
    name: 'security',
    label: 'Bảo mật 2 lớp & An ninh mạng',
    defaultSize: 22,
    description: 'Khiên phòng thủ đa lớp với lưới vi mạch radar và lõi kiểm định an toàn',
    category: 'auth'
  },
  cloud_upload: {
    name: 'cloud_upload',
    label: 'Tải lên Google Drive & Data Lake',
    defaultSize: 28,
    description: 'Đám mây bồng bềnh với luồng hạt dữ liệu bay lên và vòng đồng bộ Google Drive',
    category: 'cloud'
  },
  tasks: {
    name: 'tasks',
    label: 'Quản lý công việc & Quy trình',
    defaultSize: 24,
    description: 'Bảng theo dõi tiến độ với các dấu tích kiểm định tự động hoàn thành',
    category: 'office'
  },
  bell: {
    name: 'bell',
    label: 'Chuông thông báo điều hành',
    defaultSize: 24,
    description: 'Chuông lắc đàn hồi với sóng âm lan tỏa và chấm đỏ báo tin tức thời',
    category: 'system'
  },
  citizen: {
    name: 'citizen',
    label: 'Lắng nghe Nhân dân & An sinh',
    defaultSize: 26,
    description: 'Trái tim nhịp đập được nâng đỡ bởi bàn tay vì cộng đồng Chánh Hiệp',
    category: 'feedback'
  },
  ai_brain: {
    name: 'ai_brain',
    label: 'Trợ lý AI & Trí tuệ nhân tạo',
    defaultSize: 26,
    description: 'Lõi nơ-ron phát sáng với các vệ tinh quỹ đạo xoay quanh',
    category: 'system'
  },
  user_badge: {
    name: 'user_badge',
    label: 'Thẻ định danh Cán bộ',
    defaultSize: 22,
    description: 'Thẻ công vụ điện tử với ngôi sao vàng và vệt quét holographic',
    category: 'auth'
  },
  success: {
    name: 'success',
    label: 'Xác thực thành công',
    defaultSize: 24,
    description: 'Dấu tích xanh bật nảy đàn hồi với vòng sóng lan tỏa và sao hoa',
    category: 'system'
  },
  warning: {
    name: 'warning',
    label: 'Cảnh báo thông tin',
    defaultSize: 20,
    description: 'Tam giác cảnh báo phát sóng sonar radar cảnh báo',
    category: 'system'
  }
};
