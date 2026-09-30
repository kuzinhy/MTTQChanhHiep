export type AIIntent =
  | 'GREETING'
  | 'THANKS'
  | 'GOODBYE'
  | 'CASUAL_CHAT'
  | 'GENERAL_QA'
  | 'CONTACT_REQUEST'
  | 'LOCAL_INFO'
  | 'PUBLIC_SERVICE'
  | 'SOCIAL_SUPPORT'
  | 'FEEDBACK'
  | 'VOLUNTEER'
  | 'DOCUMENT_LOOKUP'
  | 'MAP_QUERY'
  | 'WEBSITE_DATA'
  | 'DRIVE_SEARCH'
  | 'REALTIME_DATA'
  | 'NEWS_QUERY'
  | 'WEB_RESEARCH'
  | 'FOLLOW_UP'
  | 'CORRECTION'
  | 'CHALLENGE'
  | 'CLARIFICATION'
  | 'UNKNOWN';

export type AISourceMode = 'LOCAL_FIRST' | 'BALANCED' | 'WEB_FIRST' | 'DIRECT_AI';
export type AIInternetMode = 'OFF' | 'AUTO' | 'ON';
export type AIDriveMode = 'OFF' | 'MANUAL_SYNC' | 'AUTO_SYNC';

export interface AISource {
  name: string;
  url: string;
  type?: 'WEBSITE' | 'KNOWLEDGE_BASE' | 'GOOGLE_DRIVE' | 'INTERNET' | 'DOCUMENT' | 'MAP' | 'CONTACT';
  official?: boolean;
  updatedAt?: string;
  snippet?: string;
}

export type AIActionType = 
  | 'OPEN_ROUTE'
  | 'OPEN_DOCUMENT'
  | 'OPEN_MAP'
  | 'DIRECTIONS'
  | 'OPEN_FEEDBACK'
  | 'OPEN_VOLUNTEER'
  | 'OPEN_SOCIAL_SUPPORT'
  | 'OPEN_NEWS'
  | 'OPEN_SURVEY'
  | 'DOWNLOAD_FILE'
  | 'CALL_HOTLINE'
  | 'OPEN_EXTERNAL';

export interface AIAction {
  type: AIActionType;
  label: string;
  route: string;
  url?: string;
  payload?: any;
  icon?: string;
}

export interface ContactItem {
  id: string;
  name: string;
  title: string;
  department: string;
  responsibility: string;
  phone: string;
  email?: string;
  address: string;
  topics: Array<'an_sinh' | 'phan_anh' | 'tinh_nguyen' | 'van_ban' | 'tiepdanso' | 'ban_do' | 'doan_the' | 'chuyen_doi_so'>;
  public: boolean;
  active: boolean;
  avatarUrl?: string;
}

export interface AIResponseEnvelope {
  intent: AIIntent;
  answer: string;
  sources: AISource[];
  actions: AIAction[];
  confidence: number;
  sourceMode: AISourceMode;
  usedWebsite: boolean;
  usedKnowledgeBase: boolean;
  usedDrive: boolean;
  usedInternet: boolean;
  needsVerification?: boolean;
  followUps?: string[];
}

export interface SessionMemory {
  sessionId: string;
  currentTopic?: string;
  currentIntent?: AIIntent;
  currentEntities: {
    neighborhood?: string;
    documentCode?: string;
    procedureName?: string;
    targetService?: string;
    realtimeSubject?: string;
    locationName?: string;
    cadreName?: string;
  };
  lastAnswer?: string;
  lastSources?: AISource[];
  lastAction?: AIAction;
  lastRealtimeData?: {
    subject: string;
    value: string;
    timestamp: string;
  };
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    sources?: AISource[];
    actions?: AIAction[];
  }>;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  type: 'PDF' | 'DOCX' | 'XLSX' | 'IMAGE_SCAN' | 'TEXT' | 'URL';
  category: 'CHINH_SACH' | 'AN_SINH' | 'THU_TUC' | 'KHU_PHO' | 'DOAN_THE' | 'KHAC';
  content: string;
  sourceName: string;
  sourceUrl?: string;
  driveFileId?: string;
  official: boolean;
  tags: string[];
  rolesAllowed: ('PUBLIC' | 'STAFF' | 'ADMIN')[];
  updatedAt: string;
  isActive: boolean;
  fileSize?: string;
}

export interface DriveFolderConfig {
  id: string;
  folderId: string;
  folderUrl: string;
  name: string;
  authorizedBy: string;
  autoSync: boolean;
  lastSyncAt: string;
  fileCount: number;
  status: 'ACTIVE' | 'SYNCING' | 'ERROR' | 'DISABLED';
}

export interface UnansweredQuery {
  id: string;
  question: string;
  intent: AIIntent;
  sessionId?: string;
  context?: string;
  sourcesSearched: string[];
  createdAt: string;
  status: 'PENDING' | 'RESOLVED' | 'FAQ_CREATED';
  resolvedAnswer?: string;
  assignedContactId?: string;
}

export interface AIMonitorLog {
  id: string;
  timestamp: string;
  query: string;
  intent: AIIntent;
  sourceMode: AISourceMode;
  latencyMs: number;
  usedInternet: boolean;
  usedWebsite: boolean;
  usedDrive: boolean;
  feedback?: 'like' | 'dislike';
  feedbackReason?: string;
}
