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
  name: string; // e.g. "Khu phố 1"
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
  | 'group1_draft_proofread' // NHÓM 01 – SOẠN THẢO & KIỂM TRA VĂN BẢN
  | 'group2_report_advisory'  // NHÓM 02 – BÁO CÁO & THAM MƯU
  | 'group3_conference_event' // NHÓM 03 – HỘI NGHỊ, SỰ KIỆN & PHÁT BIỂU
  | 'group4_mttq_specialized' // NHÓM 04 – CÔNG CỤ NGHIỆP VỤ MTTQ
  | 'group5_smart_utilities'; // NHÓM 05 – CÔNG CỤ THÔNG MINH BỔ SUNG

export type AiToolId =
  | 'proofread'           // 1. Kiểm tra & Hoàn thiện văn bản
  | 'draft_doc'           // 2. Trợ lý soạn thảo văn bản (Wizard)
  | 'report'              // 3. Trợ lý soạn báo cáo
  | 'advisory'            // 4. Trợ lý tham mưu
  | 'summarize'           // 5. Tóm tắt văn bản (4 chế độ)
  | 'extract_tasks'       // 6. Đọc văn bản → Trích xuất nhiệm vụ
  | 'speech'              // 7. Trợ lý soạn bài phát biểu
  | 'conference'          // 8. Trợ lý hội nghị – sự kiện
  | 'meeting_minutes'     // 9. Trợ lý biên bản cuộc họp
  | 'supervision_critique'// 10. Trợ lý Giám sát & Phản biện
  | 'public_opinion'      // 11. Trợ lý Nắm bắt ý kiến nhân dân
  | 'propaganda'          // 12. Trợ lý Tuyên truyền
  | 'compare_docs'        // 13. So sánh hai văn bản
  | 'qa_document'         // 14. Hỏi – Đáp trên tài liệu
  | 'work_plan'           // 15. Trợ lý Lập kế hoạch công tác
  | 'checklist';          // 16. Trợ lý Checklist

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

export interface MemberOrganization {
  id: string;
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
  activeMembersCount?: number;
  programsCount?: number;
  createdAt: string;
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


