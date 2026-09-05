export type UserRole = 
  | 'PUBLIC' 
  | 'CONTRIBUTOR' 
  | 'STAFF' 
  | 'EDITOR' 
  | 'REVIEWER'
  | 'PUBLISHER'
  | 'CONTEST_MANAGER'
  | 'FEEDBACK_OFFICER'
  | 'ORGANIZATION_ADMIN'
  | 'MANAGER' 
  | 'ADMIN' 
  | 'SUPER_ADMIN'
  | 'MTTQ_ADMIN';

export interface StaffUser {
  id: string;
  uid?: string;
  email: string;
  fullname: string;
  avatar?: string;
  position: string;
  department: string;
  role: UserRole;
  permissions: string[];
  active: boolean;
  createdAt: string;
  phone?: string;
  bio?: string;
  tempPassword?: string;
  passwordResetAt?: string;
}

export type ArticleCategory = 
  | 'Hoạt động Mặt trận'
  | 'Hoạt động khu phố'
  | 'An sinh xã hội'
  | 'Đại đoàn kết'
  | 'Dân vận'
  | 'Giám sát - Phản biện'
  | 'Tuyên truyền'
  | 'Phong trào thi đua'
  | 'Học tập và làm theo Bác'
  | 'Tuyên truyền & Nghị quyết'
  | 'Dân vận khéo'
  | 'Khu phố đoàn kết';

export type ArticleStatus = 'Draft' | 'Pending Review' | 'Approved' | 'Published' | 'Archived';

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImage?: string;
  category: ArticleCategory;
  tags: string[];
  status: ArticleStatus;
  authorName: string;
  publishDate: string;
  views: number;
  isFeatured?: boolean;
  originalUrl?: string;
  sourceName?: string;
  neighborhood?: string;
  attachment?: string;
  attachmentName?: string;
  attachmentSize?: string;
  driveFolderUrl?: string;
  createdAt?: string;
}

export type DocType = 
  | 'Nghị quyết'
  | 'Kế hoạch'
  | 'Công văn'
  | 'Thông báo'
  | 'Hướng dẫn'
  | 'Quyết định'
  | 'Chương trình'
  | 'Báo cáo'
  | 'Chính sách'
  | 'Tài liệu tuyên truyền';

export interface OfficialDocument {
  id: string;
  codeNumber: string;
  title: string;
  docType: DocType;
  issuer: string;
  issueDate: string;
  effectiveDate?: string;
  signer: string;
  field: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  isPublic: boolean;
  summary?: string;
  driveFolderId?: string;
  driveFileId?: string;
  driveUrl?: string;
  driveSyncStatus?: 'SYNCED' | 'PENDING' | 'LOCAL' | 'ERROR';
  syncedAt?: string;
}

export type CompetitionType = 'TRIVIA' | 'WRITING' | 'PHOTO_VIDEO' | 'SURVEY' | 'MIXED';
export type CompetitionStatus = 'DRAFT' | 'SCHEDULED' | 'OPEN' | 'CLOSED' | 'GRADING' | 'PUBLISHED' | 'ARCHIVED' | 'UPCOMING' | 'ONGOING' | 'ENDED';

export interface ScoringCriterion {
  id: string;
  name: string;
  maxScore: number;
  description: string;
}

export interface CompetitionQuestion {
  id: string;
  competitionId: string;
  questionText: string;
  questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'ESSAY';
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  score: number;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  bannerUrl?: string;
  type: CompetitionType;
  startDate: string;
  endDate: string;
  status: CompetitionStatus;
  timeLimitMinutes?: number;
  totalQuestions?: number;
  rules?: string;
  questions?: CompetitionQuestion[];
  isYouthCompetition?: boolean;
  rubric?: ScoringCriterion[];
  judges?: { id: string; name: string; email: string; assignedCount: number }[];
  targetAudience?: string;
  submissionFields?: {
    title: boolean;
    summary: boolean;
    content: boolean;
    image: boolean;
    document: boolean;
    videoUrl: boolean;
    authorInfo: boolean;
  };
}

export interface TriviaQuestion {
  id: string;
  competitionId: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  topic?: string;
}

export interface CompetitionSubmission {
  id: string;
  competitionId: string;
  participantName: string;
  phone: string;
  email?: string;
  neighborhood: string;
  score?: number;
  timeSpentSeconds?: number;
  essayText?: string;
  attachmentUrl?: string;
  submittedAt: string;
  status?: 'PENDING_GRADING' | 'GRADED';
  adminComment?: string;
}

export type OpinionTopic = 
  | 'Vấn đề dân sinh'
  | 'An sinh xã hội'
  | 'Môi trường & Đô thị'
  | 'Trật tự an toàn'
  | 'Thủ tục hành chính'
  | 'Văn hóa - Xã hội'
  | 'Ý kiến đóng góp khác';

export type OpinionStatus = 'NEW' | 'PROCESSING' | 'FORWARDED' | 'RESOLVED' | 'CLOSED';
export type PriorityLevel = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface PublicOpinion {
  id: string;
  receiptCode: string;
  topic: OpinionTopic;
  content: string;
  neighborhood: string;
  fullname?: string;
  phone?: string;
  email?: string;
  isAnonymous: boolean;
  status: OpinionStatus;
  priority: PriorityLevel;
  assignedTo?: string;
  adminResponse?: string;
  createdAt: string;
  updatedAt?: string;
  attachments?: string[];
  tags?: string[];
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'WAITING' | 'DONE' | 'OVERDUE' | 'CANCELLED';

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId?: string;
  assigneeName?: string;
  assignerName?: string;
  priority: PriorityLevel;
  status: TaskStatus;
  deadline: string;
  createdAt: string;
  attachments?: string[];
  driveLink?: string;
}

export interface WorkEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  chair: string;
  participants: string;
  content: string;
  category?: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  tags: string[];
  updatedAt: string;
}

export interface TemplateDoc {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  fileUrl?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  details: string;
  timestamp: string;
}

export interface DriveFileItem {
  id: string;
  fileId: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  iconUrl?: string;
  folderName: string;
  owner: string;
  modifiedTime: string;
  sizeFormatted?: string;
}

export interface DriveMonitorEvent {
  id: string;
  fileId: string;
  fileName: string;
  eventType: 'CREATED' | 'UPDATED' | 'SYNCED' | 'WEBHOOK_PUSH';
  timestamp: string;
  details: string;
  folderId: string;
  driveUrl?: string;
  autoCreatedDocId?: string;
}

export interface DriveMonitorStatus {
  isMonitoring: boolean;
  folderId: string;
  folderUrl: string;
  lastScanAt: string;
  totalTracked: number;
  syncIntervalSeconds: number;
  webhookEndpoint: string;
}

export type ToastType = 'OPINION' | 'DOCUMENT_APPROVAL' | 'TASK' | 'SYSTEM' | 'DRIVE_SYNC';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  timestamp: string;
  actionLabel?: string;
  onAction?: () => void;
  priority?: PriorityLevel;
  code?: string;
  meta?: {
    neighborhood?: string;
    sender?: string;
    docType?: string;
    targetView?: string;
  };
}

export interface NeighborhoodStats {
  id: string;
  name: string; // e.g. "Tương Bình Hiệp 1"
  chiefName: string;
  phone: string;
  opinionCount: number;
  resolvedCount: number;
  poorHouseholds: number;
  nearPoorHouseholds: number;
  unityHousesBuilt: number;
  satisfactionRate: number; // e.g. 98%
  status: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  mttqName?: string;
  mttqPhone?: string;
  secretaryName?: string;
  secretaryPhone?: string;
  youthUnionSecretary?: string;
  youthUnionPhone?: string;
  youthUnionDeputy?: string;
  youthUnionDeputyPhone?: string;
  womenAssociationChief?: string;
  womenAssociationPhone?: string;
}

export interface AiChatLog {
  id: string;
  query: string;
  response: string;
  timestamp: string;
  userId?: string;
  userName?: string;
  isStaff: boolean;
  helpfulness?: 'UP' | 'DOWN' | null;
  feedbackText?: string;
  ratingScore?: number;
  category?: string;
}

export interface KnowledgeNote {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: 'DRAFT' | 'APPROVED';
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

// =========================================================================
// TRUNG TÂM TRỢ LÝ THAM MƯU MTTQ - AI WORKSPACE TYPES
// =========================================================================

export type AiToolGroup = 
  | 'group1_docs_dossier'     // NHÓM 01: VĂN BẢN & HỒ SƠ
  | 'group2_advisory_report'  // NHÓM 02: THAM MƯU & TỔNG HỢP
  | 'group3_meeting_event'    // NHÓM 03: HỌP – SỰ KIỆN – PHÁT BIỂU
  | 'group4_task_operational' // NHÓM 04: CÔNG VIỆC & ĐIỀU HÀNH
  // Legacy aliases
  | 'group1_draft_proofread' 
  | 'group2_report_advisory'  
  | 'group3_conference_event' 
  | 'group4_mttq_specialized' 
  | 'group5_smart_utilities'; 

export type AiToolId =
  // 08 CORE TOOLS
  | 'read_process_doc'    // 1. Đọc & Xử lý văn bản
  | 'draft_proofread_doc' // 2. Soạn & Hoàn thiện văn bản
  | 'advisory'            // 3. Trợ lý Tham mưu
  | 'report_plan'         // 4. Báo cáo – Kế hoạch – Chương trình
  | 'event_workspace'     // 5. Trợ lý Hội họp & Sự kiện
  | 'speech_script'       // 6. Bài phát biểu – Kịch bản
  | 'task_tracking'       // 7. Trích nhiệm vụ & Theo dõi tiến độ
  | 'lookup_templates'    // 8. Tra cứu nghiệp vụ & Mẫu biểu
  // Legacy aliases for backward compatibility
  | 'proofread' 
  | 'draft_doc' 
  | 'report' 
  | 'summarize' 
  | 'extract_tasks' 
  | 'speech' 
  | 'conference' 
  | 'meeting_minutes' 
  | 'supervision_critique'
  | 'supervision' 
  | 'public_opinion' 
  | 'propaganda' 
  | 'compare_docs' 
  | 'qa_document' 
  | 'work_plan' 
  | 'checklist';

export type MttqTaskStatus = 
  | 'pending'           // CHƯA THỰC HIỆN
  | 'in_progress'       // ĐANG THỰC HIỆN
  | 'waiting_coop'      // CHỜ PHỐI HỢP
  | 'waiting_approval'  // CHỜ DUYỆT
  | 'completed'         // HOÀN THÀNH
  | 'overdue';          // QUÁ HẠN

export interface MttqTask {
  id: string;
  title: string;
  description: string;
  sourceDoc?: string;
  assignedTo: string;
  collaborators?: string[];
  startDate?: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: MttqTaskStatus;
  progress: number; // 0..100
  attachment?: string;
  note?: string;
  createdAt: string;
}

export interface AiToolMetadata {
  id: AiToolId;
  name: string;
  shortDesc: string;
  group: AiToolGroup;
  iconName: string;
  badge?: string;
  tags: string[];
  suggestedPrompts?: string[];
}

export type AiDocumentStatus = 'draft' | 'refining' | 'pending_approval' | 'completed' | 'archived';

export interface AiDocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  label: string; // V1, V2...
  title: string;
  content: string;
  savedBy: string;
  changeSummary?: string;
  createdAt: string;
}

export interface AiDocumentSourceFile {
  id: string;
  name: string;
  size?: string;
  type?: string;
  textContent?: string;
  uploadedAt: string;
}

export interface AiCitation {
  source: string;
  snippet?: string;
  location?: string;
}

export interface AiDocument {
  id: string;
  title: string;
  toolId: AiToolId;
  group: AiToolGroup;
  content: string;
  originalContent?: string;
  ownerId: string;
  ownerName: string;
  status: AiDocumentStatus;
  version: number;
  versions?: AiDocumentVersion[];
  dossierId?: string;
  dossierName?: string;
  sourceFiles?: AiDocumentSourceFile[];
  citations?: AiCitation[];
  metadata?: Record<string, any>;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AiDossier {
  id: string;
  title: string;
  description: string;
  eventDate?: string;
  location?: string;
  status: 'active' | 'completed' | 'archived';
  documentsCount: number;
  documentIds?: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AiTemplate {
  id: string;
  name: string;
  category: string;
  documentType: string;
  description: string;
  structure: string;
  defaultPrompt: string;
  isDefault?: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface AiAuditLog {
  id: string;
  userId: string;
  userName: string;
  toolId: AiToolId;
  toolName: string;
  documentTitle: string;
  action: 'GENERATE' | 'EDIT' | 'EXPORT' | 'RESTORE_VERSION' | 'PROOFREAD' | 'ANALYZE' | 'CREATE_TASK';
  status: 'SUCCESS' | 'ERROR';
  details?: string;
  timestamp: string;
}

export interface WorkspaceContextData {
  eventName?: string;
  eventTime?: string;
  eventLocation?: string;
  targetAudience?: string;
  keyObjectives?: string;
  unitLeading?: string;
  unitCoordinating?: string;
  activeDossierId?: string;
  activeDossierTitle?: string;
  scope?: string;
}

// =========================================================================
// MÔ HÌNH DỮ LIỆU BỔ TRỢ QUY HOẠCH MTTQ SỐ (PHASE 1)
// =========================================================================

export interface BankQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  topic: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
  tags?: string[];
  status: 'ACTIVE' | 'ARCHIVED';
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface QuestionBankCollection {
  id: string;
  title: string;
  description: string;
  topic: string;
  totalQuestions: number;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type AreaType = 'WARD' | 'NEIGHBORHOOD' | 'SUB_AREA' | 'RESIDENTIAL_GROUP';

export interface Area {
  id: string;
  code: string; // Mã địa bàn (e.g., 'CHANH-HIEP', 'KP-01')
  name: string; // Tên địa bàn (e.g., 'Phường Chánh Hiệp', 'Tương Bình Hiệp 1')
  type: AreaType;
  parentId?: string | null; // Cấp cha trực tiếp (ví dụ: Khu phố thuộc Phường)
  order?: number;
  description?: string;
  population?: number; // Dân số
  householdsCount?: number; // Số hộ dân
  leaderName?: string; // Trưởng ban / Trưởng khu phố
  leaderPhone?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AreaNode extends Area {
  children: AreaNode[];
}

export type OrganizationType = 
  | 'POLITICAL_PARTY'      // Đảng bộ, Chi bộ
  | 'GOVERNMENT'           // HĐND, UBND, cơ quan công quyền
  | 'FATHERLAND_FRONT'     // Ủy ban MTTQ, Ban Công tác Mặt trận khu phố
  | 'SOCIO_POLITICAL'      // Đoàn Thanh niên, Hội Phụ nữ, Cựu chiến binh, Nông dân, Công đoàn
  | 'ASSOCIATION'          // Hội Người cao tuổi, Chữ thập đỏ, Khuyến học...
  | 'COMMITTEE'            // Ban Thanh tra nhân dân, Ban Giám sát đầu tư cộng đồng
  | 'BRANCH'               // Chi bộ, Chi đoàn, Chi hội cơ sở
  | 'CELL';                // Tổ hội, Phân đoàn

export type OrganizationLevel = 'WARD' | 'NEIGHBORHOOD' | 'SUB_AREA' | 'GROUP' | 'BRANCH' | 'TEAM';

export interface Organization {
  id: string;
  code: string;
  name: string;
  shortName: string;
  slug: string;
  type: OrganizationType;
  level: OrganizationLevel;
  parentId?: string | null; // Quan hệ phân cấp cây (Cơ quan cấp trên)
  areaId?: string | null;   // Liên kết với bảng Areas (Địa bàn hoạt động)
  areaName?: string;        // Cache tên địa bàn
  leaderName?: string;
  leaderPosition?: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  membersCount?: number;
  partyMembersCount?: number;
  displayOrder?: number;
  status: 'ACTIVE' | 'INACTIVE';
  establishedDate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrganizationNode extends Organization {
  children: OrganizationNode[];
  area?: Area;
  parent?: Organization;
}

export interface MemberOrganization {
  id: string;
  code?: string;
  slug: string;
  name: string; // e.g., 'Đoàn TNCS Hồ Chí Minh', 'Hội Liên hiệp Phụ nữ'
  shortName: string;
  description: string;
  leaderName: string;
  leaderPosition: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  bannerUrl?: string;
  displayOrder?: number;
  // Hierarchical & Geographic Relations
  parentId?: string | null; // Quan hệ phân cấp cây (ví dụ: Đoàn Phường -> Chi đoàn Tương Bình Hiệp 1)
  areaId?: string | null;   // Liên kết với bảng Areas (Địa bàn trực thuộc)
  areaName?: string;        // Cache tên khu vực
  organizationId?: string | null; // Liên kết chéo tới Organization
  level?: OrganizationLevel;
  status?: 'ACTIVE' | 'INACTIVE';
  // Detailed Organizational Stats (Số liệu công tác tổ chức)
  activeMembersCount?: number;
  branchesCount?: number; // Số chi hội / chi đoàn / tổ hội
  neighborhoodsCoveredCount?: number; // Số khu phố có tổ chức / chi hội
  femaleMembersCount?: number; // Số đoàn viên / hội viên nữ
  youthMembersCount?: number; // Số đoàn viên / hội viên trẻ
  partyMembersCount?: number; // Số đoàn viên / hội viên là Đảng viên
  executiveCommitteeMembersCount?: number; // Số ủy viên Ban Chấp hành / Ban Thường trực
  gatheringRatio?: string; // Tỉ lệ tập hợp quần chúng (ví dụ: '88%')
  programsCount?: number; // Số chương trình / công trình thanh niên, phụ nữ
  keyProjectsCount?: number; // Số mô hình / phần việc tiêu biểu
  establishedYear?: string; // Năm thành lập / ngày truyền thống
  featuredAchievements?: string[]; // Danh sách thành tích / mô hình tiêu biểu
  createdAt: string;
  updatedAt?: string;
}

export interface MemberOrganizationNode extends MemberOrganization {
  children: MemberOrganizationNode[];
  area?: Area;
  parent?: MemberOrganization;
}

export interface PublicSurvey {
  id: string;
  slug: string;
  title: string;
  description: string;
  targetAudience?: string;
  startDate: string;
  endDate: string;
  status: 'OPEN' | 'CLOSED' | 'DRAFT';
  questions: {
    id: string;
    questionText: string;
    type: 'SINGLE' | 'MULTIPLE' | 'TEXT' | 'RATING';
    options?: string[];
    required: boolean;
  }[];
  totalResponses: number;
  createdBy: string;
  createdAt: string;
}

export interface NeighborhoodMigrationResult {
  success: boolean;
  timestamp: string;
  areasProcessed: number;
  legacyAreasRemoved: number;
  memberOrgsUpdated: number;
  orphanedMemberOrgsResolved: number;
  organizationsUpdated: number;
  areas: Area[];
  memberOrganizations: MemberOrganization[];
  politicalOrganizations: Organization[];
  details: string[];
}

export type NotificationPriority = 'NORMAL' | 'IMPORTANT' | 'URGENT' | 'CRITICAL';

export type NotificationCategory = 'news' | 'event' | 'document' | 'system' | 'member' | 'personal' | 'broadcast';

export type NotificationEventType = 
  | 'CONTENT_PUBLISHED'
  | 'CONTENT_IMPORTANT_UPDATED'
  | 'ADMIN_BROADCAST'
  | 'EVENT_CREATED'
  | 'EVENT_REMINDER'
  | 'SYSTEM_ANNOUNCEMENT'
  | 'MEMBER_NOTIFICATION'
  | 'PERSONAL_NOTIFICATION';

export type NotificationStatus = 
  | 'DRAFT'
  | 'SCHEDULED'
  | 'QUEUED'
  | 'SENDING'
  | 'SENT'
  | 'CANCELLED'
  | 'FAILED';

export type NotificationVisibility = 'PUBLIC' | 'INTERNAL' | 'PRIVATE';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  summary?: string;
  type: NotificationEventType;
  category: NotificationCategory;
  priority: NotificationPriority;
  visibility: NotificationVisibility;
  image_url?: string;
  action_url?: string;
  source_type?: string;
  source_id?: string;
  source_version?: number;
  target_type: 'ALL' | 'GUEST_PUBLIC' | 'AUTHENTICATED' | 'ROLE' | 'GROUP' | 'USER';
  target_roles?: string[];
  target_user_ids?: string[];
  channels: ('IN_APP' | 'WEB_PUSH' | 'PWA_PUSH')[];
  status: NotificationStatus;
  send_at?: string;
  sent_at?: string;
  expires_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  idempotency_key?: string;
}

export interface PushSubscriptionRecord {
  id: string;
  user_id?: string | null;
  device_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  provider: 'WEB_PUSH' | 'FIREBASE' | 'NATIVE';
  platform: string;
  browser: string;
  pwa_installed: boolean;
  enabled: boolean;
  created_at: string;
  last_seen_at: string;
  last_success_at?: string;
  failed_count: number;
}

export interface NotificationRecipient {
  id: string;
  notification_id: string;
  user_id?: string | null;
  device_id?: string | null;
  status: 'QUEUED' | 'SENT_TO_PUSH_PROVIDER' | 'RECEIVED' | 'CLICKED' | 'READ' | 'FAILED';
  queued_at: string;
  sent_at?: string;
  received_at?: string;
  clicked_at?: string;
  read_at?: string;
  failed_at?: string;
  error_code?: string;
}

export interface NotificationPreference {
  user_id?: string;
  device_id?: string;
  web_push_enabled: boolean;
  in_app_enabled: boolean;
  news_enabled: boolean;
  event_enabled: boolean;
  system_enabled: boolean;
  member_enabled: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
}

export interface NotificationLog {
  id: string;
  notification_id: string;
  action: string;
  actor_id: string;
  timestamp: string;
  metadata?: Record<string, any>;
}


