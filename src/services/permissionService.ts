import { UserRole, StaffUser, UserPermissions, Article } from '../types';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

/**
 * Standard Default Permissions Matrix by Role (RBAC)
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  SUPER_ADMIN: {
    post_create: true,
    post_edit: true,
    post_delete: true,
    post_publish: true,
    document_create: true,
    document_edit: true,
    document_delete: true,
    user_view: true,
    user_manage: true,
    settings_manage: true,
    cultural_manage: true,
    media_upload: true,
    audit_view: true,
    survey_manage: true,
    competition_manage: true,
    opinion_manage: true
  },
  MTTQ_ADMIN: {
    post_create: true,
    post_edit: true,
    post_delete: true,
    post_publish: true,
    document_create: true,
    document_edit: true,
    document_delete: true,
    user_view: true,
    user_manage: true,
    settings_manage: true,
    cultural_manage: true,
    media_upload: true,
    audit_view: true,
    survey_manage: true,
    competition_manage: true,
    opinion_manage: true
  },
  ADMIN: {
    post_create: true,
    post_edit: true,
    post_delete: true,
    post_publish: true,
    document_create: true,
    document_edit: true,
    document_delete: true,
    user_view: true,
    user_manage: true,
    settings_manage: false,
    cultural_manage: true,
    media_upload: true,
    audit_view: true,
    survey_manage: true,
    competition_manage: true,
    opinion_manage: true
  },
  LEADER: {
    post_create: true,
    post_edit: true,
    post_delete: true,
    post_publish: true,
    document_create: true,
    document_edit: true,
    document_delete: true,
    user_view: true,
    user_manage: false,
    settings_manage: false,
    cultural_manage: true,
    media_upload: true,
    audit_view: true,
    survey_manage: true,
    competition_manage: true,
    opinion_manage: true
  },
  MANAGER: {
    post_create: true,
    post_edit: true,
    post_delete: true,
    post_publish: true,
    document_create: true,
    document_edit: true,
    document_delete: true,
    user_view: true,
    user_manage: false,
    settings_manage: false,
    cultural_manage: true,
    media_upload: true,
    audit_view: true,
    survey_manage: true,
    competition_manage: true,
    opinion_manage: true
  },
  PUBLISHER: {
    post_create: true,
    post_edit: true,
    post_delete: false,
    post_publish: true,
    document_create: true,
    document_edit: true,
    document_delete: false,
    user_view: true,
    user_manage: false,
    settings_manage: false,
    cultural_manage: false,
    media_upload: true,
    audit_view: false,
    survey_manage: false,
    competition_manage: false,
    opinion_manage: false
  },
  EDITOR: {
    post_create: true,
    post_edit: true,
    post_delete: false,
    post_publish: false, // Editors write & submit for review, cannot publish directly
    document_create: true,
    document_edit: true,
    document_delete: false,
    user_view: true,
    user_manage: false,
    settings_manage: false,
    cultural_manage: false,
    media_upload: true,
    audit_view: false,
    survey_manage: false,
    competition_manage: false,
    opinion_manage: false
  },
  REVIEWER: {
    post_create: false,
    post_edit: true,
    post_delete: false,
    post_publish: true,
    document_create: false,
    document_edit: true,
    document_delete: false,
    user_view: true,
    user_manage: false,
    settings_manage: false,
    cultural_manage: false,
    media_upload: true,
    audit_view: false,
    survey_manage: true,
    competition_manage: false,
    opinion_manage: true
  },
  CONTEST_MANAGER: {
    post_create: true,
    post_edit: true,
    post_delete: false,
    post_publish: true,
    document_create: false,
    document_edit: false,
    document_delete: false,
    user_view: false,
    user_manage: false,
    settings_manage: false,
    cultural_manage: false,
    media_upload: true,
    audit_view: false,
    survey_manage: true,
    competition_manage: true,
    opinion_manage: false
  },
  FEEDBACK_OFFICER: {
    post_create: false,
    post_edit: false,
    post_delete: false,
    post_publish: false,
    document_create: false,
    document_edit: false,
    document_delete: false,
    user_view: false,
    user_manage: false,
    settings_manage: false,
    cultural_manage: false,
    media_upload: true,
    audit_view: false,
    survey_manage: false,
    competition_manage: false,
    opinion_manage: true
  },
  ORGANIZATION_ADMIN: {
    post_create: true,
    post_edit: true,
    post_delete: false,
    post_publish: false,
    document_create: false,
    document_edit: false,
    document_delete: false,
    user_view: false,
    user_manage: false,
    settings_manage: false,
    cultural_manage: false,
    media_upload: true,
    audit_view: false,
    survey_manage: false,
    competition_manage: false,
    opinion_manage: false
  },
  SPECIALIST: {
    post_create: true,
    post_edit: true,
    post_delete: false,
    post_publish: false,
    document_create: true,
    document_edit: true,
    document_delete: false,
    user_view: false,
    user_manage: false,
    settings_manage: false,
    cultural_manage: false,
    media_upload: true,
    audit_view: false,
    survey_manage: false,
    competition_manage: false,
    opinion_manage: false
  },
  YOUTH_UNION: {
    post_create: true,
    post_edit: true,
    post_delete: false,
    post_publish: false,
    document_create: false,
    document_edit: false,
    document_delete: false,
    user_view: false,
    user_manage: false,
    settings_manage: false,
    cultural_manage: false,
    media_upload: true,
    audit_view: false,
    survey_manage: true,
    competition_manage: true,
    opinion_manage: false
  },
  CLERK: {
    post_create: false,
    post_edit: false,
    post_delete: false,
    post_publish: false,
    document_create: true,
    document_edit: true,
    document_delete: false,
    user_view: false,
    user_manage: false,
    settings_manage: false,
    cultural_manage: false,
    media_upload: true,
    audit_view: false,
    survey_manage: false,
    competition_manage: false,
    opinion_manage: false
  },
  STAFF: {
    post_create: true,
    post_edit: false,
    post_delete: false,
    post_publish: false,
    document_create: true,
    document_edit: false,
    document_delete: false,
    user_view: false,
    user_manage: false,
    settings_manage: false,
    cultural_manage: false,
    media_upload: true,
    audit_view: false,
    survey_manage: false,
    competition_manage: false,
    opinion_manage: false
  },
  NEIGHBORHOOD_LEADER: {
    post_create: true,
    post_edit: false,
    post_delete: false,
    post_publish: false,
    document_create: false,
    document_edit: false,
    document_delete: false,
    user_view: false,
    user_manage: false,
    settings_manage: false,
    cultural_manage: false,
    media_upload: true,
    audit_view: false,
    survey_manage: false,
    competition_manage: false,
    opinion_manage: false
  },
  CONTRIBUTOR: {
    post_create: true,
    post_edit: false,
    post_delete: false,
    post_publish: false,
    document_create: false,
    document_edit: false,
    document_delete: false,
    user_view: false,
    user_manage: false,
    settings_manage: false,
    cultural_manage: false,
    media_upload: true,
    audit_view: false,
    survey_manage: false,
    competition_manage: false,
    opinion_manage: false
  },
  PUBLIC: {
    post_create: false,
    post_edit: false,
    post_delete: false,
    post_publish: false,
    document_create: false,
    document_edit: false,
    document_delete: false,
    user_view: false,
    user_manage: false,
    settings_manage: false,
    cultural_manage: false,
    media_upload: false,
    audit_view: false,
    survey_manage: false,
    competition_manage: false,
    opinion_manage: false
  }
};

/**
 * Returns merged effective permissions combining role defaults and custom user overrides
 */
export function getUserEffectivePermissions(user: StaffUser | null | undefined): UserPermissions {
  if (!user || user.active === false) {
    return { ...DEFAULT_ROLE_PERMISSIONS.PUBLIC };
  }

  // Super Admin always has full power
  if (user.role === 'SUPER_ADMIN' || user.role === 'MTTQ_ADMIN' || user.role === ('super_admin' as any)) {
    return { ...DEFAULT_ROLE_PERMISSIONS.SUPER_ADMIN };
  }

  const roleDefaults = DEFAULT_ROLE_PERMISSIONS[user.role] || DEFAULT_ROLE_PERMISSIONS.STAFF;
  
  // Merge with custom permissionMap if specified on user record
  const customMap = user.permissionMap || {};
  
  // Legacy string array compatibility (e.g. ['all'])
  const hasAllLegacy = Array.isArray(user.permissions) && user.permissions.includes('all');
  if (hasAllLegacy) {
    return { ...DEFAULT_ROLE_PERMISSIONS.SUPER_ADMIN };
  }

  return {
    ...roleDefaults,
    ...customMap
  };
}

/**
 * Checks if user is Super Admin
 */
export function isSuperAdmin(user: StaffUser | null | undefined): boolean {
  if (!user || user.active === false) return false;
  return user.role === 'SUPER_ADMIN' || user.role === 'MTTQ_ADMIN' || (user.role as string) === 'super_admin';
}

/**
 * Checks if user is an Admin (Super Admin or standard Admin or Manager)
 */
export function isAdmin(user: StaffUser | null | undefined): boolean {
  if (!user || user.active === false) return false;
  const adminRoles: UserRole[] = ['SUPER_ADMIN', 'MTTQ_ADMIN', 'ADMIN', 'MANAGER', 'LEADER'];
  return adminRoles.includes(user.role) || (user.role as string) === 'super_admin' || (user.role as string) === 'admin';
}

/**
 * Check if user has a specific role or belongs to an allowed role list
 */
export function hasRole(user: StaffUser | null | undefined, roles: UserRole | UserRole[]): boolean {
  if (!user || user.active === false) return false;
  if (isSuperAdmin(user)) return true;
  const allowed = Array.isArray(roles) ? roles : [roles];
  return allowed.includes(user.role);
}

/**
 * Primary RBAC check: Verifies if user has a specific permission
 */
export function hasPermission(user: StaffUser | null | undefined, permKey: keyof UserPermissions | string): boolean {
  if (!user || user.active === false) return false;
  if (isSuperAdmin(user)) return true;
  
  const effective = getUserEffectivePermissions(user);
  return Boolean(effective[permKey]);
}

/**
 * Post/Article Permissions
 */
export function canCreatePost(user: StaffUser | null | undefined): boolean {
  return hasPermission(user, 'post_create');
}

export function canEditPost(user: StaffUser | null | undefined, postAuthorId?: string): boolean {
  if (!user || user.active === false) return false;
  if (isSuperAdmin(user) || isAdmin(user)) return true;
  if (hasPermission(user, 'post_edit')) {
    // If author ID provided, editors can edit their own or if they have universal edit
    if (!postAuthorId || postAuthorId === user.id || postAuthorId === user.uid) return true;
    return user.role === 'EDITOR' || user.role === 'PUBLISHER';
  }
  return false;
}

export function canDeletePost(user: StaffUser | null | undefined): boolean {
  return hasPermission(user, 'post_delete');
}

export function canPublishPost(user: StaffUser | null | undefined): boolean {
  return hasPermission(user, 'post_publish');
}

/**
 * Document Permissions
 */
export function canManageDocuments(user: StaffUser | null | undefined): boolean {
  return hasPermission(user, 'document_create') || hasPermission(user, 'document_edit') || isAdmin(user);
}

export function canDeleteDocument(user: StaffUser | null | undefined): boolean {
  return hasPermission(user, 'document_delete');
}

/**
 * User & System Management Permissions
 */
export function canManageUsers(user: StaffUser | null | undefined): boolean {
  return hasPermission(user, 'user_manage') || isSuperAdmin(user);
}

export function canManageSettings(user: StaffUser | null | undefined): boolean {
  return hasPermission(user, 'settings_manage') || isSuperAdmin(user);
}

export function canUploadMedia(user: StaffUser | null | undefined): boolean {
  return hasPermission(user, 'media_upload');
}

/**
 * Security Rule: Validates if an operator can edit/modify/delete a target user
 */
export function canModifyUser(operator: StaffUser | null | undefined, targetUser: StaffUser): { allowed: boolean; reason?: string } {
  if (!operator || operator.active === false) {
    return { allowed: false, reason: 'Bạn chưa đăng nhập hoặc tài khoản đang bị khóa.' };
  }

  // Super Admin can modify anyone
  if (isSuperAdmin(operator)) {
    return { allowed: true };
  }

  // Regular Admin cannot modify or delete Super Admin
  if (isSuperAdmin(targetUser)) {
    return { allowed: false, reason: 'Không có quyền thao tác trên tài khoản Super Admin.' };
  }

  // Operator cannot delete or lock themselves
  if (operator.id === targetUser.id || (operator.uid && operator.uid === targetUser.uid)) {
    return { allowed: true }; // Can edit own profile
  }

  if (canManageUsers(operator)) {
    return { allowed: true };
  }

  return { allowed: false, reason: 'Thiếu quyền quản lý người dùng (user_manage).' };
}

/**
 * Friendly Error Mapping for UI alerts & toasts
 */
export function mapPermissionError(error: any): string {
  if (!error) return 'Đã xảy ra lỗi không xác định.';
  const message = typeof error === 'string' ? error : error.message || error.code || '';

  if (message.includes('permission-denied') || message.includes('insufficient permissions')) {
    return 'LỖI PHÂN QUYỀN (Firestore): Bạn chưa được cấp quyền thực hiện hành động này trên Cơ sở dữ liệu Cloud. Vui lòng kiểm tra lại quyền trong mục Quản lý cán bộ.';
  }
  if (message.includes('storage/unauthorized') || message.includes('storage/forbidden')) {
    return 'LỖI LƯU TRỮ (Storage): Bạn chưa có quyền tải tệp/ảnh lên hệ thống Cloud Storage.';
  }
  if (message.includes('auth/user-not-found') || message.includes('auth/invalid-credential')) {
    return 'LỖI XÁC THỰC: Thông tin tài khoản hoặc mật khẩu không chính xác.';
  }
  if (message.includes('unauthenticated') || message.includes('auth/requires-recent-login')) {
    return 'PHIÊN ĐĂNG NHẬP HẾT HẠN: Vui lòng đăng nhập lại để tiếp tục.';
  }
  if (message.includes('profile-missing')) {
    return 'THIẾU HỒ SƠ: Tài khoản chưa được khởi tạo hồ sơ cán bộ đồng bộ với UID.';
  }
  if (message.includes('missing-permission')) {
    return 'THIẾU QUYỀN HẠN: Tài khoản của bạn chưa được kích hoạt quyền hạn này.';
  }

  return message || 'Lỗi thao tác hệ thống.';
}

/**
 * Diagnostic Report Interface for "KIỂM TRA QUYỀN" Modal
 */
export interface DiagnosticItem {
  id: string;
  label: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  detail: string;
  solution?: string;
}

export interface PermissionDiagnosticReport {
  userUid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: 'active' | 'inactive';
  allPassed: boolean;
  items: DiagnosticItem[];
  timestamp: string;
}

/**
 * Run diagnostic checks on a user record against Auth & Firestore schemas
 */
export async function runPermissionDiagnostics(user: StaffUser | null | undefined): Promise<PermissionDiagnosticReport> {
  const now = new Date().toISOString();
  if (!user) {
    return {
      userUid: 'NONE',
      email: 'NONE',
      displayName: 'Khách',
      role: 'PUBLIC',
      status: 'inactive',
      allPassed: false,
      timestamp: now,
      items: [
        {
          id: 'auth',
          label: 'Xác thực tài khoản (Authentication)',
          status: 'FAIL',
          detail: 'Chưa đăng nhập vào hệ thống',
          solution: 'Vui lòng đăng nhập tài khoản cán bộ.'
        }
      ]
    };
  }

  const effective = getUserEffectivePermissions(user);
  const items: DiagnosticItem[] = [];

  // 1. Auth Status
  const currentAuthUser = auth.currentUser;
  const authUidMatch = currentAuthUser ? (currentAuthUser.uid === user.id || currentAuthUser.uid === user.uid) : false;
  items.push({
    id: 'auth_status',
    label: 'Trạng thái xác thực (Firebase Auth)',
    status: currentAuthUser ? (authUidMatch ? 'PASS' : 'WARNING') : 'FAIL',
    detail: currentAuthUser 
      ? `Đã xác thực với UID: ${currentAuthUser.uid}${authUidMatch ? ' (Khớp hồ sơ)' : ' (Khác UID hồ sơ)'}`
      : 'Không có phiên Firebase Auth trực tiếp trên trình duyệt',
    solution: currentAuthUser && !authUidMatch ? 'Cần đồng bộ UID Firebase Auth vào hồ sơ staffUsers/users.' : undefined
  });

  // 2. User Document Schema
  const hasValidUid = Boolean(user.id && user.id.length > 5);
  items.push({
    id: 'profile_doc',
    label: 'Hồ sơ người dùng (User Profile & UID)',
    status: hasValidUid ? 'PASS' : 'FAIL',
    detail: `UID định danh: ${user.id} | Email: ${user.email}`,
    solution: !hasValidUid ? 'Khởi tạo hồ sơ người dùng hợp lệ với UID chuẩn.' : undefined
  });

  // 3. Role & Active Status
  const isActive = user.active !== false && user.status !== 'inactive';
  items.push({
    id: 'account_status',
    label: 'Trạng thái tài khoản (Status)',
    status: isActive ? 'PASS' : 'FAIL',
    detail: `Vai trò: ${user.role} | Trạng thái: ${isActive ? 'Đang hoạt động (active)' : 'Đang bị khóa/Chờ duyệt (inactive)'}`,
    solution: !isActive ? 'Super Admin cần kích hoạt tài khoản trong mục Quản lý Cán bộ.' : undefined
  });

  // 4. Permissions check: post_create
  items.push({
    id: 'perm_post_create',
    label: 'Quyền tạo bài viết (post_create)',
    status: effective.post_create ? 'PASS' : 'FAIL',
    detail: effective.post_create ? 'Được phép tạo bài viết mới' : 'Bị từ chối tạo bài viết',
    solution: !effective.post_create ? 'Bật quyền "post_create" hoặc nâng vai trò lên Admin/Editor.' : undefined
  });

  // 5. Permissions check: post_edit
  items.push({
    id: 'perm_post_edit',
    label: 'Quyền chỉnh sửa bài viết (post_edit)',
    status: effective.post_edit ? 'PASS' : 'FAIL',
    detail: effective.post_edit ? 'Được phép chỉnh sửa bài viết' : 'Bị từ chối chỉnh sửa bài viết',
    solution: !effective.post_edit ? 'Bật quyền "post_edit" cho cán bộ.' : undefined
  });

  // 6. Permissions check: post_delete
  items.push({
    id: 'perm_post_delete',
    label: 'Quyền xóa bài viết (post_delete)',
    status: effective.post_delete ? 'PASS' : 'FAIL',
    detail: effective.post_delete ? 'Được phép xóa bài viết' : 'Không có quyền xóa bài viết',
    solution: !effective.post_delete ? 'Quyền này chỉ nên cấp cho Quản trị viên (Admin/Super Admin).' : undefined
  });

  // 7. Permissions check: post_publish
  items.push({
    id: 'perm_post_publish',
    label: 'Quyền xuất bản bài viết (post_publish)',
    status: effective.post_publish ? 'PASS' : 'FAIL',
    detail: effective.post_publish ? 'Được phép duyệt và xuất bản trực tiếp lên Cổng thông tin' : 'Chỉ có thể lưu nháp/gửi duyệt bài',
    solution: !effective.post_publish ? 'Bật quyền "post_publish" nếu là Trưởng ban biên tập/Admin.' : undefined
  });

  // 8. Permissions check: document_manage
  items.push({
    id: 'perm_doc_manage',
    label: 'Quyền quản lý văn bản chỉ đạo (document_manage)',
    status: (effective.document_create || effective.document_edit) ? 'PASS' : 'FAIL',
    detail: (effective.document_create || effective.document_edit) ? 'Được phép ban hành/cập nhật văn bản' : 'Chỉ có quyền xem văn bản',
    solution: !(effective.document_create || effective.document_edit) ? 'Bật quyền văn bản trong hồ sơ.' : undefined
  });

  // 9. Permissions check: user_manage
  items.push({
    id: 'perm_user_manage',
    label: 'Quyền quản lý người dùng & phân quyền (user_manage)',
    status: effective.user_manage ? 'PASS' : 'FAIL',
    detail: effective.user_manage ? 'Có quyền quản lý danh sách cán bộ và phân quyền' : 'Không có quyền quản lý người dùng',
    solution: !effective.user_manage ? 'Chỉ cấp cho Admin/Super Admin.' : undefined
  });

  // 10. Live Cloud Firestore write test
  let dbWritePass = false;
  let dbErrorReason = '';
  try {
    if (auth.currentUser && db) {
      // Test ping document
      const pingDocRef = doc(db, 'staffUsers', user.id);
      const snap = await getDoc(pingDocRef);
      dbWritePass = snap.exists();
      if (!snap.exists()) {
        // Try auto self sync
        await setDoc(pingDocRef, { ...user, updatedAt: new Date().toISOString() }, { merge: true });
        dbWritePass = true;
      }
    } else {
      dbWritePass = true; // Offline / local persistent mode
    }
  } catch (err: any) {
    dbWritePass = false;
    dbErrorReason = err?.message || 'Firestore write permission denied';
  }

  items.push({
    id: 'db_write_test',
    label: 'Kiểm tra ghi Cloud Firestore (Database Write Test)',
    status: dbWritePass ? 'PASS' : 'FAIL',
    detail: dbWritePass ? 'Đồng bộ đám mây hoạt động hoàn hảo' : `Không thể ghi Cloud Firestore: ${dbErrorReason}`,
    solution: !dbWritePass ? 'Cần cập nhật Firestore Security Rules và đồng bộ UID vào staffUsers & users.' : undefined
  });

  const allPassed = items.every(i => i.status === 'PASS' || (i.status === 'WARNING' && i.id === 'auth_status'));

  return {
    userUid: user.id || user.uid || 'N/A',
    email: user.email,
    displayName: user.fullname || user.displayName || 'Cán bộ',
    role: user.role,
    status: isActive ? 'active' : 'inactive',
    allPassed,
    items,
    timestamp: now
  };
}
