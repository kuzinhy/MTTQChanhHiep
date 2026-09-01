export type UserRole = 
  | 'PUBLIC' 
  | 'CONTRIBUTOR' 
  | 'STAFF' 
  | 'EDITOR' 
  | 'MANAGER' 
  | 'ADMIN' 
  | 'SUPER_ADMIN';

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

export type CompetitionType = 'TRIVIA' | 'WRITING';
export type CompetitionStatus = 'UPCOMING' | 'ONGOING' | 'ENDED';

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
  status: 'GREEN' | 'YELLOW' | 'ORANGE';
}

