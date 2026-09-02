import { UserRole, StaffUser } from '../types';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  PUBLIC: 0,
  CONTRIBUTOR: 1,
  STAFF: 2,
  EDITOR: 3,
  REVIEWER: 4,
  FEEDBACK_OFFICER: 4,
  CONTEST_MANAGER: 4,
  ORGANIZATION_ADMIN: 4,
  PUBLISHER: 5,
  MANAGER: 6,
  ADMIN: 7,
  MTTQ_ADMIN: 8,
  SUPER_ADMIN: 9
};

// Map office view IDs to minimum required roles
export const VIEW_ROLE_REQUIREMENTS: Record<string, UserRole> = {
  dashboard: 'STAFF',
  profile: 'STAFF',
  neighborhood_map: 'STAFF',
  opinions: 'FEEDBACK_OFFICER',
  tasks: 'STAFF',
  ai_assistant: 'STAFF',
  calendar: 'STAFF',
  notes: 'STAFF',
  drive: 'STAFF',
  templates: 'STAFF',
  cms: 'CONTRIBUTOR',
  cms_articles: 'CONTRIBUTOR',
  cms_documents: 'EDITOR',
  competitions_admin: 'CONTEST_MANAGER',
  question_banks: 'CONTEST_MANAGER',
  surveys_admin: 'REVIEWER',
  analytics: 'MANAGER',
  users: 'ADMIN',
  audit_logs: 'SUPER_ADMIN'
};

export function hasMinRole(userRole: UserRole | undefined, requiredRole: UserRole): boolean {
  if (!userRole) return false;
  const currentLevel = ROLE_HIERARCHY[userRole] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0;
  return currentLevel >= requiredLevel;
}

export function canAccessView(userRole: UserRole | undefined, viewId: string): boolean {
  const minRole = VIEW_ROLE_REQUIREMENTS[viewId] || 'STAFF';
  return hasMinRole(userRole, minRole);
}

export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'SUPER_ADMIN': return 'Admin Hệ Thống Gốc';
    case 'MTTQ_ADMIN': return 'Quản Trị MTTQ';
    case 'ADMIN': return 'Quản Trị Viên';
    case 'MANAGER': return 'Lãnh Đạo MTTQ';
    case 'PUBLISHER': return 'Người Xuất Bản';
    case 'REVIEWER': return 'Người Kiểm Duyệt';
    case 'CONTEST_MANAGER': return 'Quản Lý Hội Thi';
    case 'FEEDBACK_OFFICER': return 'Cán Bộ Xử Lý Dân Nguyện';
    case 'ORGANIZATION_ADMIN': return 'Quản Trị Tổ Chức Thành Viên';
    case 'EDITOR': return 'Biên Tập Viên';
    case 'STAFF': return 'Cán Bộ MTTQ';
    case 'CONTRIBUTOR': return 'Cộng Tác Viên';
    case 'PUBLIC': return 'Người Dân';
    default: return role;
  }
}

export function getRoleBadgeStyle(role: UserRole): string {
  switch (role) {
    case 'SUPER_ADMIN':
    case 'MTTQ_ADMIN':
      return 'bg-red-800 text-amber-200 border border-amber-400/40 font-black';
    case 'ADMIN':
    case 'PUBLISHER':
      return 'bg-red-700 text-white font-bold';
    case 'MANAGER':
      return 'bg-blue-700 text-white font-bold';
    case 'REVIEWER':
    case 'CONTEST_MANAGER':
    case 'FEEDBACK_OFFICER':
    case 'ORGANIZATION_ADMIN':
      return 'bg-amber-700 text-white font-bold';
    case 'EDITOR':
      return 'bg-purple-700 text-white font-semibold';
    case 'STAFF':
      return 'bg-emerald-700 text-white font-semibold';
    case 'CONTRIBUTOR':
      return 'bg-stone-600 text-white font-medium';
    default:
      return 'bg-slate-100 text-slate-700 font-medium';
  }
}
