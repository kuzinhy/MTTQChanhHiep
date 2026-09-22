import { 
  LayoutDashboard, Users, Sparkles, Building2, Newspaper, Lightbulb, FileText, 
  Info, MessageSquare, BarChart3, Award, Bell, Settings, FolderTree, ShieldCheck
} from 'lucide-react';

export interface AdminFeature {
  id: string;
  title: string;
  description: string;
  group: 'overview' | 'operations' | 'system';
  icon: any;
  path: string;
  permission?: string;
  badge?: string;
  enabled: boolean;
  order: number;
}

export const FUNCTION_REGISTRY: AdminFeature[] = [
  // Group: overview
  { id: 'dashboard', title: 'Trang Tổng quan', description: 'Bảng điều khiển chỉ số KPI', group: 'overview', icon: LayoutDashboard, path: '/admin/dashboard', enabled: true, order: 1 },
  { id: 'youth_union_admin', title: 'Quản trị Đoàn', description: 'Cơ cấu tổ chức Đoàn thanh niên', group: 'overview', icon: Users, path: '/admin/youth_union_admin', badge: 'ADMIN', enabled: true, order: 2 },
  { id: 'youth_union_workspace', title: 'Workspace Chi đoàn', description: 'Không gian số tác nghiệp 21 Chi đoàn', group: 'overview', icon: Sparkles, path: '/admin/youth_union_workspace', badge: 'WS', enabled: true, order: 3 },
  { id: 'neighborhood_map', title: 'Bản đồ 21 Khu phố', description: 'Bản đồ số an sinh xã hội', group: 'overview', icon: Building2, path: '/admin/neighborhood_map', badge: '21 KP', enabled: true, order: 4 },
  { id: 'ai_assistant', title: 'Trợ lý AI Tổng hợp', description: 'Tra cứu, soạn thảo văn bản', group: 'overview', icon: Sparkles, path: '/admin/ai_assistant', badge: 'AI', enabled: true, order: 5 },
  
  // Group: operations
  { id: 'cms', title: 'Tin tức & Bài viết', description: 'Biên tập, duyệt bài', group: 'operations', icon: Newspaper, path: '/admin/cms', badge: 'TIN BÀI', enabled: true, order: 1 },
  { id: 'cms_initiatives', title: 'Mô hình & Sáng kiến', description: 'Kho sáng kiến tiêu biểu', group: 'operations', icon: Lightbulb, path: '/admin/cms_initiatives', badge: 'MÔ HÌNH', enabled: true, order: 2 },
  { id: 'cms_documents', title: 'Văn bản & Chỉ đạo', description: 'Lưu trữ chỉ đạo, công văn', group: 'operations', icon: FileText, path: '/admin/cms_documents', badge: 'VĂN BẢN', enabled: true, order: 3 },
  { id: 'cms_about', title: 'Giới thiệu MTTQ', description: 'Bộ máy tổ chức', group: 'operations', icon: Info, path: '/admin/cms_about', badge: 'GIỚI THIỆU', enabled: true, order: 4 },
  { id: 'opinions', title: 'Xử lý Dân nguyện', description: 'Tiếp nhận phản ánh', group: 'operations', icon: MessageSquare, path: '/admin/opinions', badge: 'DÂN NGUYỆN', enabled: true, order: 5 },
  { id: 'surveys_admin', title: 'Khảo sát & Dư luận', description: 'Thăm dò dư luận xã hội', group: 'operations', icon: BarChart3, path: '/admin/surveys_admin', badge: 'KHẢO SÁT', enabled: true, order: 6 },
  { id: 'competitions_admin', title: 'Hội thi & Ngân hàng đề', description: 'Tổ chức hội thi trực tuyến', group: 'operations', icon: Award, path: '/admin/competitions_admin', badge: 'HỘI THI', enabled: true, order: 7 },
  { id: 'member_orgs_admin', title: 'Tổ chức Thành viên', description: 'Quản trị các tổ chức đoàn thể', group: 'operations', icon: Users, path: '/admin/member_orgs_admin', badge: 'THÀNH VIÊN', enabled: true, order: 8 },
  { id: 'cultural_space_admin', title: 'Không gian Văn hóa 3D', description: 'Bảo tàng ảo', group: 'operations', icon: Building2, path: '/admin/cultural_space_admin', badge: '3D VIRTUAL', enabled: true, order: 9 },

  // Group: system
  { id: 'notifications', title: 'Trung tâm Thông báo', description: 'Phát thanh số, cảnh báo', group: 'system', icon: Bell, path: '/admin/notifications', badge: 'REALTIME', enabled: true, order: 1 },
  { id: 'users', title: 'Quản trị Cán bộ', description: 'Danh sách và phân quyền', group: 'system', icon: Users, path: '/admin/users', badge: 'CÁN BỘ', enabled: true, order: 2 },
  { id: 'analytics', title: 'Thống kê Tổng hợp', description: 'Báo cáo và phân tích', group: 'system', icon: BarChart3, path: '/admin/analytics', badge: 'THỐNG KÊ', enabled: true, order: 3 },
  { id: 'audit_logs', title: 'Nhật ký Hệ thống', description: 'Audit logs hoạt động', group: 'system', icon: ShieldCheck, path: '/admin/audit_logs', badge: 'AUDIT', enabled: true, order: 4 },
  { id: 'email_settings', title: 'Cấu hình Email', description: 'Cài đặt hệ thống mail', group: 'system', icon: Settings, path: '/admin/email_settings', enabled: true, order: 5 },
];

export const getFeatureById = (id: string) => FUNCTION_REGISTRY.find(f => f.id === id);
export const getFeaturesByGroup = (group: AdminFeature['group']) => FUNCTION_REGISTRY.filter(f => f.group === group).sort((a, b) => a.order - b.order);
