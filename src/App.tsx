/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChanhHiepPortalHome } from './components/portal/ChanhHiepPortalHome';
import { HeroCarousel } from './components/HeroCarousel';
import { NewsSection } from './components/NewsSection';
import { DocumentsSection } from './components/DocumentsSection';
import { CompetitionsSection } from './components/CompetitionsSection';
import { OpinionFormSection } from './components/OpinionFormSection';
import { ArticleDetailPage } from './components/ArticleDetailPage';
import { DocumentDetailPage } from './components/DocumentDetailPage';
import { CompetitionDetailPage } from './components/CompetitionDetailPage';
import { StaffLoginPage } from './components/StaffLoginPage';
import { AiAssistantWidget } from './components/AiAssistantWidget';
import { SupervisionSection } from './components/SupervisionSection';
import { MemberOrganizationsSection } from './components/MemberOrganizationsSection';
import { SurveysSection } from './components/SurveysSection';
import { AboutSection } from './components/AboutSection';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { InitiativesSection } from './components/InitiativesSection';
import { DigitalCommunityMap } from './components/map/DigitalCommunityMap';
import { DigitalMapSection } from './components/map/DigitalMapSection';
import { VolunteerRegistrationModal } from './components/VolunteerRegistrationModal';
import { DigitalDirectoryModal } from './components/DigitalDirectoryModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { HoChiMinhCulturalSpaceModal } from './components/cultural/HoChiMinhCulturalSpaceModal';
import { NotFoundPage } from './components/NotFoundPage';
import { OFFICIAL_NEIGHBORHOOD_NAMES } from './data/neighborhoodsList';

import { DigitalOfficeSidebar } from './components/office/DigitalOfficeSidebar';
import { AdminDashboard } from './components/office/youth_union/admin/AdminDashboard';
import { WorkspaceShell } from './components/office/youth_union/workspace/WorkspaceShell';
import { DigitalOfficeHeader } from './components/office/DigitalOfficeHeader';
import { AiAssistantView } from './components/office/AiAssistantView';
import { OpinionsAdminView } from './components/office/OpinionsAdminView';
import { CmsAdminView } from './components/office/CmsAdminView';
import { DocumentsAdminView } from './components/office/DocumentsAdminView';
import { AnalyticsDashboardView } from './components/office/AnalyticsDashboardView';
import { AuditLogsView } from './components/office/AuditLogsView';
import { PersonalNotesView } from './components/office/PersonalNotesView';
import { DocumentTemplatesView } from './components/office/DocumentTemplatesView';
import { CompetitionsAdminView } from './components/office/CompetitionsAdminView';
import { CompetitionAdminDetailView } from './components/office/CompetitionAdminDetailView';
import { QuestionBankAdminView } from './components/office/QuestionBankAdminView';
import { SurveysAdminView } from './components/office/SurveysAdminView';
import { StaffUsersAdminView } from './components/office/StaffUsersAdminView';
import { MemberOrganizationsAdminView } from './components/office/MemberOrganizationsAdminView';
import { CulturalSpaceAdminView } from './components/cultural/CulturalSpaceAdminView';
import { NeighborhoodMapDashboard } from './components/office/NeighborhoodMapDashboard';
import { NeighborhoodManagementAdminView } from './components/office/neighborhood/NeighborhoodManagementAdminView';
import { AdministrativeReportExporter } from './components/office/AdministrativeReportExporter';
import { DocumentAiPlanGenerator } from './components/office/DocumentAiPlanGenerator';
import { NeighborhoodEmulationDashboard } from './components/office/NeighborhoodEmulationDashboard';
import { WelfareCommunityMapModal } from './components/map/WelfareCommunityMapModal';
import { ShareQrPosterModal } from './components/common/ShareQrPosterModal';
import { NotificationAdminView } from './components/office/NotificationAdminView';
import { EmailSettingsView } from './components/office/EmailSettingsView';
import { UserProfileView } from './components/office/UserProfileView';
import { StaffLoginModal } from './components/office/StaffLoginModal';
import { SessionLockScreen } from './components/office/SessionLockScreen';
import { ToastContainer } from './components/ToastNotification';
import { RealtimeActivityToastContainer } from './components/office/RealtimeActivityToastContainer';
import { LoginSummaryModal } from './components/office/LoginSummaryModal';
import { adminCollaborationService } from './lib/adminCollaborationService';
import { PageLoader } from './components/PageLoader';
import { notificationMasterService } from './lib/notificationMasterService';
import { OptimizedImage } from './components/common/OptimizedImage';
import { HcmQuoteRotator } from './components/common/HcmQuoteRotator';
import { NewInterfacePage } from './components/NewInterfacePage';

import { 
  INITIAL_COMPETITIONS, 
  INITIAL_TRIVIA_QUESTIONS, 
  INITIAL_TEMPLATES
} from './data/seedData';

import { Article, OfficialDocument, Competition, CompetitionSubmission, PublicOpinion, DriveFileItem, StaffUser, AuditLog, OpinionStatus, ToastMessage, UserRole, AiChatLog, KnowledgeNote, MemberOrganization, Area, Organization, FeedbackItem, ArticleSubmission } from './types';
import { sortArticlesNewestFirst, sortDocumentsNewestFirst, sortCompetitionsNewestFirst, sortOpinionsNewestFirst } from './lib/dateUtils';
import { AppStorageEngine } from './lib/storage';
import { CloudDatabase } from './lib/firestoreService';
import { NotificationService } from './services/notificationService';
import { canCreatePost, canEditPost, canDeletePost, canPublishPost, mapPermissionError, getUserEffectivePermissions } from './services/permissionService';
import { VisitorTrackerEngine } from './lib/visitorTracker';
import { canAccessView } from './lib/rbac';
import { auth } from './lib/firebase';
import { signOut } from 'firebase/auth';
import { Sparkles, MessageSquare, FileText, ShieldCheck, Lock, Cloud, CloudCheck, AlertTriangle, Landmark, Star, Move, Newspaper, Lightbulb, Info, BarChart3, Award, Users, Building2, Layers, Bell, Settings, PieChart, FolderTree, ShieldAlert } from 'lucide-react';
import { browserNotificationService } from './lib/browserNotifications';

export const VALID_PORTAL_TABS = [
  'home',
  'map',
  'about',
  'news',
  'documents',
  'supervision',
  'competitions',
  'initiatives',
  'surveys',
  'opinion',
  'organizations',
  'privacy',
  'new_interface'
];

export const VALID_OFFICE_VIEWS = [
  'dashboard',
  'profile',
  'neighborhood_management',
  'neighborhood_map',
  'neighborhood_emulation',
  'youth_union_admin',
  'youth_union_workspace',
  'ai_assistant',
  'administrative_report_exporter',
  'document_ai_plan_generator',
  'cms',
  'cms_articles',
  'cms_initiatives',
  'cms_documents',
  'cms_about',
  'documents',
  'competitions_admin',
  'question_banks',
  'opinions',
  'surveys_admin',
  'member_orgs_admin',
  'cultural_space_admin',
  'cultural_space',
  'templates',
  'notes',
  'users',
  'analytics',
  'audit_logs',
  'notifications',
  'email_settings'
];

export const PORTAL_HASH_TO_TAB: Record<string, string> = {
  '': 'home',
  '/': 'home',
  '/trang-chu': 'home',
  '/ban-do-so': 'map',
  '/bando': 'map',
  '/gioi-thieu': 'about',
  '/tin-tuc': 'news',
  '/van-ban': 'documents',
  '/giam-sat': 'supervision',
  '/hoi-thi': 'competitions',
  '/mo-hinh-hay': 'initiatives',
  '/khao-sat': 'surveys',
  '/y-kien-dan-nguyen': 'opinion',
  '/to-chuc-thanh-vien': 'organizations',
  '/chinh-sach-bao-mat': 'privacy',
  '/privacy': 'privacy',
  '/giao-dien-moi': 'new_interface',
  '/khong-gian-van-hoa-ho-chi-minh': 'hcm_space',
  '/kgvh-ho-chi-minh': 'hcm_space'
};

export const TAB_TO_HASH: Record<string, string> = {
  home: '#/trang-chu',
  map: '#/ban-do-so',
  about: '#/gioi-thieu',
  news: '#/tin-tuc',
  documents: '#/van-ban',
  supervision: '#/giam-sat',
  competitions: '#/hoi-thi',
  initiatives: '#/mo-hinh-hay',
  surveys: '#/khao-sat',
  opinion: '#/y-kien-dan-nguyen',
  organizations: '#/to-chuc-thanh-vien',
  privacy: '#/chinh-sach-bao-mat',
  new_interface: '#/giao-dien-moi'
};

export default function App() {
  // App Initial Loading State
  const [isAppLoading, setIsAppLoading] = useState(true);


  // Navigation & Space State
  const [currentSpace, setCurrentSpace] = useState<'PORTAL' | 'OFFICE'>('PORTAL');
  const [portalTab, setPortalTab] = useState<string>('home');
  const [officeView, setOfficeView] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // 404 & Invalid Route State
  const [notFoundRoute, setNotFoundRoute] = useState<{ isNotFound: boolean; attemptedPath?: string; message?: string } | null>(null);

  // Full-page Detail & Page View States (no popups)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<OfficialDocument | null>(null);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [activeCompetitionId, setActiveCompetitionId] = useState<string | null>(null);
  const [showStaffLoginPage, setShowStaffLoginPage] = useState(false);
  const [isMobileOfficeSidebarOpen, setIsMobileOfficeSidebarOpen] = useState(false);

  // New Modal States for Extended Features
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [isDirectoryModalOpen, setIsDirectoryModalOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isHcmSpaceModalOpen, setIsHcmSpaceModalOpen] = useState(false);
  const [isWelfareMapOpen, setIsWelfareMapOpen] = useState(false);
  const [sharePosterData, setSharePosterData] = useState<{ isOpen: boolean; title: string; url?: string } | null>(null);

  const handleSelectPortalTab = (tab: string) => {
    setNotFoundRoute(null);
    setPortalTab(tab);
    setSelectedArticle(null);
    setSelectedDocument(null);
    setSelectedCompetition(null);
    setShowStaffLoginPage(false);
    const targetHash = TAB_TO_HASH[tab] || '#/trang-chu';
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
  };

  const handleSelectArticle = (art: Article) => {
    setNotFoundRoute(null);
    setSelectedArticle(art);
    setSelectedDocument(null);
    setSelectedCompetition(null);
    window.location.hash = `#/tin-tuc/${encodeURIComponent(art.id)}`;
  };

  const handleSelectDocument = (doc: OfficialDocument) => {
    setNotFoundRoute(null);
    setSelectedDocument(doc);
    setSelectedArticle(null);
    setSelectedCompetition(null);
    window.location.hash = `#/van-ban/${encodeURIComponent(doc.id)}`;
  };

  const handleSelectCompetition = (comp: Competition) => {
    setNotFoundRoute(null);
    setSelectedCompetition(comp);
    setSelectedArticle(null);
    setSelectedDocument(null);
    window.location.hash = `#/hoi-thi/${encodeURIComponent(comp.id)}`;
  };

  const handleNavigateOfficeView = (view: string) => {
    let resolvedView = view;
    // Deduplicate aliased routes
    if (view === 'cms_articles') resolvedView = 'cms';
    
    setNotFoundRoute(null);
    setOfficeView(resolvedView);
    const targetHash = `#/van-phong-so/${resolvedView}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
  };

  const handleBackToPortalList = () => {
    setSelectedArticle(null);
    setSelectedDocument(null);
    setSelectedCompetition(null);
    setNotFoundRoute(null);
    window.location.hash = TAB_TO_HASH[portalTab] || '#/trang-chu';
  };

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Authentication State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentStaffUser, setCurrentStaffUser] = useState<StaffUser | null>(() => AppStorageEngine.getCurrentUser());
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    try {
      return typeof window !== 'undefined' && localStorage.getItem('office_session_locked') === 'true';
    } catch {
      return false;
    }
  });

  // Realtime Admin Presence Heartbeat Effect
  useEffect(() => {
    if (!currentStaffUser?.id || currentSpace !== 'OFFICE') return;

    adminCollaborationService.updateAdminPresence({
      admin: currentStaffUser,
      status: 'online',
      currentRoute: officeView
    });

    const interval = setInterval(() => {
      adminCollaborationService.updateAdminPresence({
        admin: currentStaffUser,
        status: 'online',
        currentRoute: officeView
      });
    }, 25000);

    return () => {
      clearInterval(interval);
      adminCollaborationService.updateAdminPresence({
        admin: currentStaffUser,
        status: 'offline',
        currentRoute: officeView
      });
    };
  }, [currentStaffUser, currentSpace, officeView]);

  // Keep lock state synchronized to localStorage safely
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('office_session_locked', isLocked.toString());
      }
    } catch {}
  }, [isLocked]);

  // Data Collections with Local Persistence Engine
  const [articles, setArticles] = useState<Article[]>(() => AppStorageEngine.getArticles());
  const [documents, setDocuments] = useState<OfficialDocument[]>(() => AppStorageEngine.getDocuments());
  const [competitions, setCompetitions] = useState<Competition[]>(() => AppStorageEngine.getCompetitions());
  const [submissions, setSubmissions] = useState<CompetitionSubmission[]>(() => AppStorageEngine.getSubmissions());
  const [opinions, setOpinions] = useState<PublicOpinion[]>(() => AppStorageEngine.getOpinions());
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>(() => AppStorageEngine.getDriveFiles());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => AppStorageEngine.getAuditLogs());
  const [notes, setNotes] = useState(() => AppStorageEngine.getNotes());
  const [templates] = useState(INITIAL_TEMPLATES);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>(() => AppStorageEngine.getStaffUsers());
  const [memberOrganizations, setMemberOrganizations] = useState<MemberOrganization[]>(() => AppStorageEngine.getMemberOrganizations());
  const [areas, setAreas] = useState<Area[]>(() => AppStorageEngine.getAreas());
  const [politicalOrganizations, setPoliticalOrganizations] = useState<Organization[]>(() => AppStorageEngine.getOrganizations());
  const [aiChats, setAiChats] = useState<AiChatLog[]>(() => AppStorageEngine.getAiChats());
  const [knowledgeNotes, setKnowledgeNotes] = useState<KnowledgeNote[]>(() => AppStorageEngine.getKnowledgeNotes());
  const [articleSubmissions, setArticleSubmissions] = useState<ArticleSubmission[]>(() => AppStorageEngine.getArticleSubmissions());
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>(() => AppStorageEngine.getFeedback());
  const [isDataSyncing, setIsDataSyncing] = useState<boolean>(true);

  // Initialize real-time visitor & session tracking, Offline Sync & Firebase Cloud Sync
  useEffect(() => {
    VisitorTrackerEngine.init();
    const cleanupOfflineSync = AppStorageEngine.initOfflineSyncEngine();

    // Start Realtime Cloud Database Sync with Firebase Firestore
    CloudDatabase.initCloudDatabase({
      onArticlesUpdate: (arts) => {
        setArticles(arts);
        setIsDataSyncing(false);
      },
      onDocumentsUpdate: (docs) => {
        setDocuments(docs);
        setIsDataSyncing(false);
      },
      onOpinionsUpdate: (ops) => setOpinions(ops),
      onCompetitionsUpdate: (comps) => setCompetitions(comps),
      onStaffUsersUpdate: (users) => {
        setStaffUsers(users);
        // If current staff user is logged in, sync their state from cloud updates
        const currentSaved = AppStorageEngine.getCurrentUser();
        if (currentSaved) {
          const matched = users.find(u => u.id === currentSaved.id || u.email.toLowerCase() === currentSaved.email.toLowerCase());
          if (matched) {
            setCurrentStaffUser(matched);
            AppStorageEngine.saveCurrentUser(matched);
          }
        }
      },
      onAuditLogsUpdate: (logs) => setAuditLogs(logs),
      onAiChatsUpdate: (chats) => setAiChats(chats),
      onKnowledgeNotesUpdate: (notes) => setKnowledgeNotes(notes),
      onMemberOrganizationsUpdate: (orgs) => setMemberOrganizations(orgs),
      onAreasUpdate: (ar) => setAreas(ar),
      onOrganizationsUpdate: (orgs) => setPoliticalOrganizations(orgs),
      onSubmissionsUpdate: (subs) => setSubmissions(subs),
      onDriveFilesUpdate: (files) => setDriveFiles(files),
      onArticleSubmissionsUpdate: (subs) => setArticleSubmissions(subs),
      onFeedbackUpdate: (feedbacks) => setFeedbackItems(feedbacks),
    });

    const timer = setTimeout(() => {
      setIsDataSyncing(false);
    }, 1500);

    return () => {
      cleanupOfflineSync();
      clearTimeout(timer);
    };
  }, []);

  // Auto-Sync current user to Local Storage (Keep this as it's not synced via collection listener)
  useEffect(() => { AppStorageEngine.saveCurrentUser(currentStaffUser); }, [currentStaffUser]);
  
  // NOTE: Redundant useEffect hooks for articles, documents, etc. have been removed.
  // Synchronization to LocalStorage is now handled directly within the CloudDatabase listeners 
  // in firestoreService.ts, preventing race conditions and double-writes.

  // Unified Hash-based Router with 404 & Deep Linking
  useEffect(() => {
    const handleHashRouting = () => {
      const rawHash = window.location.hash || '';

      // 1. Digital Office route: #/van-phong-so or #/van-phong-so/:view
      if (rawHash === '#/van-phong-so' || rawHash === '#/van-phong-so/' || rawHash === '#/van-phong-so/dashboard') {
        setNotFoundRoute(null);
        setCurrentSpace('OFFICE');
        setOfficeView(prev => prev || 'dashboard');
        return;
      }

      if (rawHash.startsWith('#/van-phong-so/')) {
        const viewPart = rawHash.replace('#/van-phong-so/', '').trim();
        setCurrentSpace('OFFICE');
        setNotFoundRoute(null);
        setOfficeView(viewPart || 'dashboard');
        return;
      }

      // If user is currently in OFFICE space and hash is empty, "#", or "#/", keep user in OFFICE space!
      if (currentSpace === 'OFFICE' && (!rawHash || rawHash === '#' || rawHash === '#/')) {
        return;
      }

      // 2. Default empty or root routes
      if (!rawHash || rawHash === '#' || rawHash === '#/' || rawHash === '#/trang-chu') {
        setNotFoundRoute(null);
        setCurrentSpace('PORTAL');
        setPortalTab('home');
        setSelectedArticle(null);
        setSelectedDocument(null);
        setSelectedCompetition(null);
        setShowStaffLoginPage(false);
        return;
      }

      // 3. Article detail deep link: #/tin-tuc/:id
      if (rawHash.startsWith('#/tin-tuc/')) {
        const artId = decodeURIComponent(rawHash.replace('#/tin-tuc/', '').trim());
        const targetArt = articles.find(a => a && a.id === artId);
        setCurrentSpace('PORTAL');
        setPortalTab('news');
        setSelectedDocument(null);
        setSelectedCompetition(null);
        setShowStaffLoginPage(false);
        if (targetArt) {
          setNotFoundRoute(null);
          setSelectedArticle(targetArt);
        }
        return;
      }

      // 4. Document detail deep link: #/van-ban/:id
      if (rawHash.startsWith('#/van-ban/')) {
        const docId = decodeURIComponent(rawHash.replace('#/van-ban/', '').trim());
        const targetDoc = documents.find(d => d && d.id === docId);
        setCurrentSpace('PORTAL');
        setPortalTab('documents');
        setSelectedArticle(null);
        setSelectedCompetition(null);
        setShowStaffLoginPage(false);
        if (targetDoc) {
          setNotFoundRoute(null);
          setSelectedDocument(targetDoc);
        }
        return;
      }

      // 5. Competition detail deep link: #/hoi-thi/:id
      if (rawHash.startsWith('#/hoi-thi/')) {
        const compId = decodeURIComponent(rawHash.replace('#/hoi-thi/', '').trim());
        const targetComp = competitions.find(c => c && c.id === compId);
        setCurrentSpace('PORTAL');
        setPortalTab('competitions');
        setSelectedArticle(null);
        setSelectedDocument(null);
        setShowStaffLoginPage(false);
        if (targetComp) {
          setNotFoundRoute(null);
          setSelectedCompetition(targetComp);
        }
        return;
      }

      // 6. Staff Login route: #/dang-nhap or #/dang-nhap-can-bo
      if (rawHash === '#/khong-gian-van-hoa-ho-chi-minh' || rawHash === '#/kgvh-ho-chi-minh') {
        setNotFoundRoute(null);
        setCurrentSpace('PORTAL');
        setIsHcmSpaceModalOpen(true);
        setSelectedArticle(null);
        setSelectedDocument(null);
        setSelectedCompetition(null);
        return;
      }

      if (rawHash === '#/dang-nhap' || rawHash === '#/dang-nhap-can-bo') {
        setNotFoundRoute(null);
        setCurrentSpace('PORTAL');
        setShowStaffLoginPage(true);
        setSelectedArticle(null);
        setSelectedDocument(null);
        setSelectedCompetition(null);
        return;
      }

      // 7. Standard Portal Tab routes
      const normalizedPath = rawHash.replace(/^#/, '');
      if (PORTAL_HASH_TO_TAB[normalizedPath]) {
        setNotFoundRoute(null);
        setCurrentSpace('PORTAL');
        setPortalTab(PORTAL_HASH_TO_TAB[normalizedPath]);
        setSelectedArticle(null);
        setSelectedDocument(null);
        setSelectedCompetition(null);
        setShowStaffLoginPage(false);
        return;
      }

      // 8. Unknown hash -> Show 404 only if not in office
      if (currentSpace !== 'OFFICE') {
        setCurrentSpace('PORTAL');
        setSelectedArticle(null);
        setSelectedDocument(null);
        setSelectedCompetition(null);
        setShowStaffLoginPage(false);
        setNotFoundRoute({
          isNotFound: true,
          attemptedPath: rawHash,
          message: `Đường dẫn "${rawHash}" không tồn tại hoặc đã thay đổi cấu trúc trên hệ thống.`
        });
      }
    };

    handleHashRouting();
    window.addEventListener('hashchange', handleHashRouting);
    return () => window.removeEventListener('hashchange', handleHashRouting);
  }, []);

  // Sync deep linked entities when collections update without resetting spaces
  useEffect(() => {
    const rawHash = window.location.hash || '';
    if (rawHash.startsWith('#/tin-tuc/')) {
      const artId = decodeURIComponent(rawHash.replace('#/tin-tuc/', '').trim());
      const targetArt = articles.find(a => a && a.id === artId);
      if (targetArt) setSelectedArticle(targetArt);
    }
  }, [articles]);

  useEffect(() => {
    const rawHash = window.location.hash || '';
    if (rawHash.startsWith('#/van-ban/')) {
      const docId = decodeURIComponent(rawHash.replace('#/van-ban/', '').trim());
      const targetDoc = documents.find(d => d && d.id === docId);
      if (targetDoc) setSelectedDocument(targetDoc);
    }
  }, [documents]);

  useEffect(() => {
    const rawHash = window.location.hash || '';
    if (rawHash.startsWith('#/hoi-thi/')) {
      const compId = decodeURIComponent(rawHash.replace('#/hoi-thi/', '').trim());
      const targetComp = competitions.find(c => c && c.id === compId);
      if (targetComp) setSelectedCompetition(targetComp);
    }
  }, [competitions]);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [portalTab, officeView, currentSpace]);

  // Real-time notification subscriber for cross-device & multi-tab alerts
  useEffect(() => {
    const userId = currentStaffUser?.id;
    const roles = currentStaffUser?.role ? [currentStaffUser.role] : ['GUEST', 'PUBLIC'];

    const unsubscribe = notificationMasterService.subscribeToNotifications(
      (list) => {
        if (list && list.length > 0) {
          const latest = list[0];
          const createdAtTime = new Date(latest.created_at).getTime();
          const now = Date.now();
          if (now - createdAtTime < 20000) {
            const toastKey = `notif_toast_${latest.id}`;
            if (!sessionStorage.getItem(toastKey)) {
              sessionStorage.setItem(toastKey, 'true');
              handleTriggerSystemToast(`📢 [${latest.category.toUpperCase()}] ${latest.title}`, latest.body);
            }
          }
        }
      },
      userId,
      roles
    );

    const unsubBroadcast = notificationMasterService.onBroadcastMessage((notif) => {
      handleTriggerSystemToast(`📢 [Thông báo mới] ${notif.title}`, notif.body);
    });

    return () => {
      unsubscribe();
      unsubBroadcast();
    };
  }, [currentStaffUser]);

  // Guard RBAC Office Views
  const userRole: UserRole = currentStaffUser?.role || 'STAFF';
  const isOfficeViewAllowed = canAccessView(userRole, officeView);

  // Toast Handlers
  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

// Helper for notification chime using Web Audio API
  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      // Audio autoplay restrictions or unsupported
    }
  };

  const handleTriggerSystemToast = (title: string, message: string) => {
    playNotificationSound();
    setToasts(prev => {
      // Prevent duplicate notifications with the same message or related content within active toasts
      const isDuplicate = prev.some(t => {
        if (t.title === title && t.message === message) return true;
        if (t.message && message && (t.message.includes(message) || message.includes(t.message))) return true;
        return false;
      });
      if (isDuplicate) return prev;

      const newToast: ToastMessage = {
        id: 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        type: 'SYSTEM',
        title,
        message,
        timestamp: 'Vừa xong'
      };
      return [newToast, ...prev].slice(0, 4);
    });
  };

  const handleRefreshAllData = () => {
    setArticles(AppStorageEngine.getArticles());
    setDocuments(AppStorageEngine.getDocuments());
    setCompetitions(AppStorageEngine.getCompetitions());
    setSubmissions(AppStorageEngine.getSubmissions());
    setOpinions(AppStorageEngine.getOpinions());
    setDriveFiles(AppStorageEngine.getDriveFiles());
    setAuditLogs(AppStorageEngine.getAuditLogs());
    setNotes(AppStorageEngine.getNotes());
    setStaffUsers(AppStorageEngine.getStaffUsers());
    setCurrentStaffUser(AppStorageEngine.getCurrentUser());
    handleTriggerSystemToast('Đã đồng bộ CSDL', 'Toàn bộ dữ liệu đã được tải lại thành công từ bộ nhớ lưu trữ.');
  };

  const handleTriggerOpinionToast = (opinion: PublicOpinion) => {
    const newToast: ToastMessage = {
      id: 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      type: 'OPINION',
      title: `Ý kiến dân sinh mới: ${opinion.topic}`,
      message: opinion.content.length > 110 ? opinion.content.substring(0, 110) + '...' : opinion.content,
      timestamp: 'Vừa xong',
      code: opinion.receiptCode,
      actionLabel: 'Xử lý ý kiến',
      meta: {
        neighborhood: opinion.neighborhood,
        sender: opinion.isAnonymous ? 'Người dân ẩn danh' : (opinion.fullname || 'Người dân'),
        targetView: 'opinions'
      }
    };
    setToasts(prev => [newToast, ...prev].slice(0, 4));

    // Browser Native Web Push Notification (works when tab is hidden/in background)
    browserNotificationService.sendNotification({
      title: `[MTTQ CHÁNH HIỆP] Ý kiến dân sinh mới: ${opinion.topic}`,
      body: `Địa bàn: ${opinion.neighborhood || 'Toàn phường'} - "${opinion.content.substring(0, 100)}..."`,
      tag: `opinion-${opinion.id}`,
      onClick: () => {
        handleNavigateFromToast('opinions');
      }
    });
  };

  const handleTriggerDocApprovalToast = (doc: OfficialDocument | { codeNumber: string; title: string; docType: string; signer?: string }) => {
    const newToast: ToastMessage = {
      id: 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      type: 'DOCUMENT_APPROVAL',
      title: `Yêu cầu phê duyệt văn bản mới`,
      message: `Văn bản "${doc.title}" (${doc.codeNumber}) đã được khởi tạo và chờ Lãnh đạo phê duyệt.`,
      timestamp: 'Vừa xong',
      code: doc.codeNumber,
      actionLabel: 'Phê duyệt ngay',
      meta: {
        docType: doc.docType,
        sender: doc.signer || 'Cán bộ Tuyên giáo',
        targetView: 'cms'
      }
    };
    setToasts(prev => [newToast, ...prev].slice(0, 4));

    // Browser Native Web Push Notification (works when tab is hidden/in background)
    browserNotificationService.sendNotification({
      title: `[MTTQ CHÁNH HIỆP] Cần phê duyệt văn bản: ${doc.codeNumber}`,
      body: `"${doc.title}" - Trình duyệt bởi ${doc.signer || 'Cán bộ cơ quan'}`,
      tag: `doc-${doc.codeNumber}`,
      onClick: () => {
        handleNavigateFromToast('cms');
      }
    });
  };

  const handleNavigateFromToast = (targetView: string) => {
    if (targetView === 'opinions') {
      setCurrentSpace('OFFICE');
      setOfficeView('opinions');
    } else if (targetView === 'cms') {
      setCurrentSpace('OFFICE');
      setOfficeView('cms');
    } else if (targetView === 'portal_opinion') {
      setCurrentSpace('PORTAL');
      setPortalTab('opinion');
    }
  };

  // Simulation Triggers for Testing
  const handleTriggerSimulatedOpinion = () => {
    const REAL_NEIGHBORHOODS = OFFICIAL_NEIGHBORHOOD_NAMES;
    const randomNb = REAL_NEIGHBORHOODS[Math.floor(Math.random() * REAL_NEIGHBORHOODS.length)];
    const randomTopics: any[] = ['Vấn đề dân sinh', 'Môi trường & Đô thị', 'An sinh xã hội', 'Trật tự an toàn'];
    const selectedTopic = randomTopics[Math.floor(Math.random() * randomTopics.length)];
    const code = 'PA-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    
    const simOp: PublicOpinion = {
      id: 'sim-op-' + Date.now(),
      receiptCode: code,
      topic: selectedTopic,
      content: `Đề nghị Ban Thường trực MTTQ kiểm tra, khắc phục tình trạng đọng nước và chiếu sáng công cộng tại hẻm thuộc địa bàn ${randomNb}.`,
      neighborhood: randomNb,
      fullname: `Nguyễn Văn Dân (${randomNb})`,
      phone: '0908123xxx',
      isAnonymous: false,
      status: 'NEW',
      priority: 'NORMAL',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setOpinions(prev => [simOp, ...prev]);
    handleTriggerOpinionToast(simOp);
  };

  const handleTriggerSimulatedDocApproval = () => {
    const codeNum = `${Math.floor(10 + Math.random() * 90)}/KH-MTTQ`;
    const simDoc: OfficialDocument = {
      id: 'sim-doc-' + Date.now(),
      codeNumber: codeNum,
      title: 'Kế hoạch triển khai Tháng hành động vì người nghèo & An sinh xã hội năm 2026',
      docType: 'Kế hoạch',
      issuer: 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
      issueDate: new Date().toISOString().substring(0, 10),
      signer: 'Chủ tịch Trần Thị Hoa',
      field: 'An sinh xã hội',
      isPublic: true
    };

    setDocuments(prev => [simDoc, ...prev]);
    handleTriggerDocApprovalToast(simDoc);
  };

  // Data Handlers
  const handleAddOpinion = (newOp: PublicOpinion) => {
    setOpinions(prev => {
      const next = [newOp, ...prev];
      AppStorageEngine.saveOpinions(next);
      return next;
    });
    CloudDatabase.saveOpinion(newOp);
    handleTriggerOpinionToast(newOp);

    // Trigger email notification for new feedback
    const feedback: FeedbackItem = {
      id: newOp.id,
      feedbackCode: newOp.receiptCode || newOp.id.replace('op-', '#CH-'),
      fullName: newOp.fullname || 'Người dân',
      email: newOp.email || 'nguoidan@chanhhiep.vn',
      phone: newOp.phone || 'Chưa cung cấp',
      address: newOp.address || 'Chưa cung cấp',
      category: newOp.neighborhood || 'Dân sinh',
      title: String(newOp.topic || 'Ý kiến phản ánh dân sinh'),
      content: newOp.content || '',
      attachments: newOp.attachments || [],
      departmentId: newOp.assignedTo || 'mttq',
      status: 'received',
      priority: newOp.priority || 'NORMAL',
      createdAt: newOp.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    NotificationService.notifyFeedbackSubmitted(feedback).catch(err => {
      console.error('Failed to trigger email notification for new opinion:', err);
    });
  };

  const handleUpdateOpinionStatus = (id: string, status: OpinionStatus, responseText?: string) => {
    setOpinions(prev => {
      const target = prev.find(o => o.id === id);
      if (target) {
        const updated = { ...target, status, adminResponse: responseText || target.adminResponse };
        CloudDatabase.saveOpinion(updated);

        // Map status to FeedbackItem status
        let mappedStatus: 'received' | 'processing' | 'completed' | 'rejected' = 'processing';
        if (status === 'RESOLVED' || status === 'CLOSED') {
          mappedStatus = 'completed';
        } else if (status === 'NEW') {
          mappedStatus = 'received';
        }

        // Trigger email notification for feedback status change
        const feedback: FeedbackItem = {
          id: updated.id,
          feedbackCode: updated.receiptCode || updated.id.replace('op-', '#CH-'),
          fullName: updated.isAnonymous ? 'Người dân ẩn danh' : (updated.fullname || 'Người dân'),
          email: updated.email || 'nguoidan@chanhhiep.vn',
          phone: updated.phone || 'N/A',
          category: updated.neighborhood || 'Dân sinh',
          title: String(updated.topic || 'Ý kiến phản ánh dân sinh'),
          content: updated.content || '',
          attachments: updated.attachments || [],
          departmentId: updated.assignedTo || 'mttq',
          status: mappedStatus,
          priority: updated.priority || 'NORMAL',
          createdAt: updated.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          adminResponse: responseText || updated.adminResponse
        };
        NotificationService.notifyFeedbackStatusChanged(feedback, target.status).catch(err => {
          console.error('Failed to trigger email notification for opinion status update:', err);
        });
      }
      const next = prev.map(o => o.id === id ? { ...o, status, adminResponse: responseText || o.adminResponse } : o);
      AppStorageEngine.saveOpinions(next);
      return next;
    });
    handleTriggerSystemToast('Cập nhật xử lý ý kiến', `Đã lưu trạng thái xử lý cho ý kiến.`);
  };

  const handleDeleteOpinion = async (id: string) => {
    setOpinions(prev => {
      const next = prev.filter(o => o.id !== id);
      AppStorageEngine.saveOpinions(next);
      return next;
    });
    try {
      await CloudDatabase.deleteOpinion(id);
      handleTriggerSystemToast('Đã xóa phản ánh', 'Dữ liệu phản ánh dư luận đã được xóa thành công khỏi hệ thống.');
    } catch (err) {
      console.error('Failed to delete opinion from cloud:', err);
    }
  };




  const handleAddArticle = async (art: Article) => {
    const currentUid = currentStaffUser?.id || currentStaffUser?.uid || 'staff-1';
    const currentName = currentStaffUser?.fullname || 'Cán bộ MTTQ';
    const currentEmail = currentStaffUser?.email || '';

    // Standardize article payload with dynamic author & organization IDs
    const standardizedArt: Article = {
      ...art,
      authorId: art.authorId || currentUid,
      authorName: art.authorName || currentName,
      createdBy: art.createdBy || currentUid,
      organizationId: art.organizationId || 'mttq-chanhhiep',
      createdAt: art.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save locally for immediate responsive UI
    AppStorageEngine.saveArticles(sortArticlesNewestFirst([standardizedArt, ...articles.filter(a => a.id !== standardizedArt.id)]));
    
    // Save to Cloud Firestore
    const isCloudSaved = await CloudDatabase.saveArticle(standardizedArt);

    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      userId: currentUid,
      userName: currentName,
      email: currentEmail,
      action: 'XUẤT BẢN BÀI VIẾT',
      entity: 'Tin tức - Tuyên truyền',
      entityId: standardizedArt.id,
      entityTitle: standardizedArt.title,
      resource: 'articles',
      resourceId: standardizedArt.id,
      result: isCloudSaved ? 'SUCCESS' : 'FAILED',
      details: `Đăng bài viết mới: "${standardizedArt.title}" (Chuyên mục: ${standardizedArt.category})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setAuditLogs(prev => {
      const next = [newLog, ...prev];
      AppStorageEngine.saveAuditLogs(next);
      return next;
    });
    CloudDatabase.logAudit(newLog);
    
    if (isCloudSaved) {
      handleTriggerSystemToast('Đã lưu bài viết lên Cloud', `Bài viết "${standardizedArt.title}" đã được đồng bộ trực tuyến lên Firebase và hiển thị trên mọi máy.`);
    } else {
      handleTriggerSystemToast('Đã lưu bài viết (Cục bộ)', `Bài viết "${standardizedArt.title}" đã được lưu cục bộ.`);
    }
  };

  const handleUpdateArticle = async (updatedArt: Article) => {
    const currentUid = currentStaffUser?.id || currentStaffUser?.uid || 'staff-1';
    const currentName = currentStaffUser?.fullname || 'Cán bộ MTTQ';
    const currentEmail = currentStaffUser?.email || '';

    const standardizedArt: Article = {
      ...updatedArt,
      updatedBy: currentUid,
      updatedAt: new Date().toISOString(),
      organizationId: updatedArt.organizationId || 'mttq-chanhhiep'
    };

    setArticles(prev => {
      const next = sortArticlesNewestFirst(prev.map(a => a.id === standardizedArt.id ? standardizedArt : a));
      AppStorageEngine.saveArticles(next);
      return next;
    });
    const isCloudSaved = await CloudDatabase.saveArticle(standardizedArt);

    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      userId: currentUid,
      userName: currentName,
      email: currentEmail,
      action: 'CẬP NHẬT BÀI VIẾT',
      entity: 'Tin tức - Tuyên truyền',
      entityId: standardizedArt.id,
      entityTitle: standardizedArt.title,
      resource: 'articles',
      resourceId: standardizedArt.id,
      result: isCloudSaved ? 'SUCCESS' : 'FAILED',
      details: `Chỉnh sửa nội dung bài viết: "${standardizedArt.title}"`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setAuditLogs(prev => {
      const next = [newLog, ...prev];
      AppStorageEngine.saveAuditLogs(next);
      return next;
    });
    CloudDatabase.logAudit(newLog);
    
    if (isCloudSaved) {
      handleTriggerSystemToast('Đã cập nhật Cloud thành công', `Nội dung bài viết "${standardizedArt.title}" đã được đồng bộ trực tuyến.`);
    } else {
      handleTriggerSystemToast('Đã lưu chỉnh sửa', `Nội dung bài viết "${standardizedArt.title}" đã được lưu.`);
    }
  };

  const handleDeleteArticle = async (artId: string) => {
    const currentUid = currentStaffUser?.id || currentStaffUser?.uid || 'staff-1';
    const currentName = currentStaffUser?.fullname || 'Cán bộ MTTQ';
    const currentEmail = currentStaffUser?.email || '';
    const targetArt = articles.find(a => a.id === artId);

    setArticles(prev => {
      const next = prev.filter(a => a.id !== artId);
      AppStorageEngine.saveArticles(next);
      return next;
    });
    const isDeleted = await CloudDatabase.deleteArticle(artId);

    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      userId: currentUid,
      userName: currentName,
      email: currentEmail,
      action: 'XÓA BÀI VIẾT',
      entity: 'Tin tức - Tuyên truyền',
      entityId: artId,
      entityTitle: targetArt?.title || artId,
      resource: 'articles',
      resourceId: artId,
      result: isDeleted ? 'SUCCESS' : 'FAILED',
      details: `Đã xóa bài viết: "${targetArt?.title || artId}"`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setAuditLogs(prev => {
      const next = [newLog, ...prev];
      AppStorageEngine.saveAuditLogs(next);
      return next;
    });
    CloudDatabase.logAudit(newLog);

    handleTriggerSystemToast('Đã xóa bài viết', 'Bài viết đã được xóa và đồng bộ trên tất cả thiết bị.');
  };

  const handleUpdateArticleSubmission = async (sub: ArticleSubmission) => {
    setArticleSubmissions(prev => {
      const next = prev.map(s => s.id === sub.id ? sub : s);
      AppStorageEngine.saveArticleSubmissions(next);
      return next;
    });
    await CloudDatabase.saveArticleSubmission(sub);
  };

  const handleDeleteArticleSubmission = async (subId: string) => {
    setArticleSubmissions(prev => {
      const next = prev.filter(s => s.id !== subId);
      AppStorageEngine.saveArticleSubmissions(next);
      return next;
    });
    await CloudDatabase.deleteArticleSubmission(subId);
  };

  const handleAddDocument = async (doc: OfficialDocument) => {
    setDocuments(prev => {
      const next = sortDocumentsNewestFirst([doc, ...prev.filter(d => d.id !== doc.id)]);
      AppStorageEngine.saveDocuments(next);
      return next;
    });
    setDriveFiles(AppStorageEngine.getDriveFiles());
    await CloudDatabase.saveDocument(doc);

    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      userId: currentStaffUser?.id || 'staff-1',
      userName: currentStaffUser?.fullname || 'Cán bộ Văn thư',
      action: 'BAN HÀNH VĂN BẢN',
      entity: 'Văn bản Mặt trận',
      details: `Ban hành văn bản: "${doc.title}" (Số: ${doc.codeNumber})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setAuditLogs(prev => {
      const next = [newLog, ...prev];
      AppStorageEngine.saveAuditLogs(next);
      return next;
    });
    CloudDatabase.logAudit(newLog);
    handleTriggerDocApprovalToast(doc);
  };

  const handleUpdateDocument = async (updatedDoc: OfficialDocument) => {
    setDocuments(prev => {
      const next = sortDocumentsNewestFirst(prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
      AppStorageEngine.saveDocuments(next);
      return next;
    });
    setDriveFiles(AppStorageEngine.getDriveFiles());
    await CloudDatabase.saveDocument(updatedDoc);
    handleTriggerSystemToast('Đã lưu văn bản lên Cloud', `Cập nhật thành công văn bản ${updatedDoc.codeNumber}.`);
  };

  const handleDeleteDocument = async (docId: string) => {
    AppStorageEngine.recordDeletedDocId(docId);
    setDocuments(prev => {
      const next = prev.filter(d => d.id !== docId);
      AppStorageEngine.saveDocuments(next);
      return next;
    });
    await CloudDatabase.deleteDocument(docId);
    handleTriggerSystemToast('Đã xóa văn bản', 'Văn bản đã được xóa khỏi cơ sở dữ liệu.');
  };

  const handleAddCompetition = (comp: Competition) => {
    setCompetitions(prev => {
      const next = sortCompetitionsNewestFirst([comp, ...prev]);
      AppStorageEngine.saveCompetitions(next);
      return next;
    });
    CloudDatabase.saveCompetition(comp);
    handleTriggerSystemToast('Đã tạo cuộc thi', `Cuộc thi "${comp.title}" đã được lưu trữ và công bố.`);
  };

  const handleUpdateCompetition = (updatedComp: Competition) => {
    setCompetitions(prev => {
      const next = sortCompetitionsNewestFirst(prev.map(c => c.id === updatedComp.id ? updatedComp : c));
      AppStorageEngine.saveCompetitions(next);
      return next;
    });
    CloudDatabase.saveCompetition(updatedComp);
  };

  const handleRestoreDefaultCompetitions = () => {
    const defaultComps = AppStorageEngine.restoreDefaultCompetitions();
    setCompetitions(defaultComps);
    defaultComps.forEach(comp => {
      CloudDatabase.saveCompetition(comp);
    });
    handleTriggerSystemToast('Khôi phục 4 Cuộc Thi', 'Đã nạp lại thành công 4 cuộc thi mặc định trên hệ thống.');
  };

  const handleRestoreDefaultBanners = () => {
    const seedMap = new Map<string, string>();
    INITIAL_COMPETITIONS.forEach(c => {
      if (c && c.id && c.bannerUrl) {
        seedMap.set(c.id, c.bannerUrl);
      }
    });

    setCompetitions(prev => {
      const next = prev.map(c => {
        if (seedMap.has(c.id)) {
          const defaultBanner = seedMap.get(c.id)!;
          const updated = { ...c, bannerUrl: defaultBanner };
          CloudDatabase.saveCompetition(updated);
          return updated;
        }
        return c;
      });
      AppStorageEngine.saveCompetitions(next);
      return next;
    });

    handleTriggerSystemToast('Đã khôi phục 4 banner', 'Đã khôi phục thành công hình ảnh banner gốc của 4 hội thi chính thức.');
  };

  const handleDeleteCompetition = (compId: string) => {
    setCompetitions(prev => {
      const next = prev.filter(c => c.id !== compId);
      AppStorageEngine.saveCompetitions(next);
      return next;
    });
    CloudDatabase.deleteCompetition(compId);
    handleTriggerSystemToast('Đã xóa cuộc thi', 'Đã xóa hội thi khỏi hệ thống và đồng bộ trực tuyến.');
  };



  const handleForceCloudSync = async () => {
    handleTriggerSystemToast('Đang đồng bộ...', 'Đang tải và đồng bộ dữ liệu hai chiều với Cloud Firestore...');
    const pullSuccess = await CloudDatabase.pullCloudToLocal();
    const res = await CloudDatabase.pushAllLocalToCloud();
    if (res.success || pullSuccess) {
      handleRefreshAllData();
      handleTriggerSystemToast('Đồng bộ Cloud thành công', 'Toàn bộ tài khoản, avatar, tin bài và văn bản đã được đồng bộ giữa điện thoại và máy tính.');
    } else if (res.isPermissionError) {
      handleTriggerSystemToast(
        'Cần mở quyền Firestore', 
        'Dự án Firebase đang cấu hình giới hạn quyền ghi. Hãy vào Firebase Console > Firestore Database > Rules và chọn Publish: allow read, write: if true;'
      );
    } else {
      handleTriggerSystemToast('Lỗi đồng bộ', 'Không thể hoàn tất kết nối với Firebase. Vui lòng kiểm tra lại kết nối mạng.');
    }
  };

  const handleAddSubmission = (sub: CompetitionSubmission) => {
    setSubmissions(prev => {
      const next = [sub, ...prev];
      AppStorageEngine.saveSubmissions(next);
      return next;
    });
    CloudDatabase.saveSubmission(sub);
    handleTriggerSystemToast('Đã ghi nhận bài thi', `Bài dự thi của ${sub.participantName} đã được nộp và lưu trữ trực tuyến.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* Full Page Initial Loader Screen */}
      <AnimatePresence mode="wait">
        {isAppLoading && (
          <PageLoader key="initial-app-loader" onLoaded={() => setIsAppLoading(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* PUBLIC PORTAL SPACE */}
        {currentSpace === 'PORTAL' ? (
          <motion.div 
            key="portal-space"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="flex flex-col min-h-screen"
          >
            <Navbar
              activeTab={portalTab}
              setActiveTab={handleSelectPortalTab}
              onOpenLoginModal={() => setShowStaffLoginPage(true)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isStaffLoggedIn={!!currentStaffUser}
              currentUser={currentStaffUser}
              onGoToOffice={() => {
                handleSelectPortalTab('new_interface');
              }}
              onOpenNotificationCenter={() => setIsNotificationCenterOpen(true)}
              onOpenDigitalDirectory={() => setIsDirectoryModalOpen(true)}
              onOpenVolunteerModal={() => setIsVolunteerModalOpen(true)}
              onOpenHcmSpaceModal={() => setIsHcmSpaceModalOpen(true)}
            />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-10">
              {notFoundRoute ? (
                <NotFoundPage
                  attemptedPath={notFoundRoute.attemptedPath || window.location.hash}
                  errorMessage={notFoundRoute.message}
                  onGoHome={() => handleSelectPortalTab('home')}
                  onNavigateTab={(tab) => handleSelectPortalTab(tab)}
                  onSearch={(q) => {
                    setSearchQuery(q);
                    handleSelectPortalTab('news');
                  }}
                  onGoToOffice={() => {
                    handleSelectPortalTab('new_interface');
                  }}
                />
              ) : showStaffLoginPage ? (
                <StaffLoginPage
                  staffUsers={staffUsers}
                  onLoginSuccess={(user) => {
                    setCurrentStaffUser(user);
                    setShowStaffLoginPage(false);
                    setCurrentSpace('OFFICE');
                  }}
                  onBack={() => {
                    setShowStaffLoginPage(false);
                    window.location.hash = TAB_TO_HASH[portalTab] || '#/trang-chu';
                  }}
                />
              ) : selectedArticle ? (
                <ArticleDetailPage
                  article={selectedArticle}
                  allArticles={articles}
                  articles={articles}
                  onBack={handleBackToPortalList}
                  onSelectArticle={(art) => {
                    handleSelectArticle(art);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onGoToOpinion={() => handleSelectPortalTab('opinion')}
                  onSelectDocumentTab={() => handleSelectPortalTab('documents')}
                />
              ) : selectedDocument ? (
                <DocumentDetailPage
                  document={selectedDocument}
                  allDocuments={documents}
                  onSelectDocument={(doc) => {
                    handleSelectDocument(doc);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onBack={handleBackToPortalList}
                  onDownload={(doc) => {
                    handleTriggerSystemToast('Tải văn bản chính thức', `Hệ thống đang chuẩn bị tệp và tải xuống văn bản số ${doc.codeNumber}...`);
                  }}
                />
              ) : selectedCompetition ? (
                <CompetitionDetailPage
                  competition={selectedCompetition}
                  triviaQuestions={INITIAL_TRIVIA_QUESTIONS}
                  onAddSubmission={handleAddSubmission}
                  onBack={handleBackToPortalList}
                />
              ) : (
                <>
                  {portalTab === 'home' && (
                    <ChanhHiepPortalHome
                      articles={articles}
                      documents={documents}
                      opinions={opinions}
                      onSelectArticle={(art) => handleSelectArticle(art)}
                      onSelectTab={(tab) => handleSelectPortalTab(tab)}
                      onOpenHcmSpaceModal={() => setIsHcmSpaceModalOpen(true)}
                      onOpenVolunteerModal={() => setIsVolunteerModalOpen(true)}
                      onOpenDirectory={() => setIsDirectoryModalOpen(true)}
                      onGoToOffice={(view) => {
                        if (view) setOfficeView(view);
                        handleSelectPortalTab('new_interface');
                      }}
                      currentStaffUser={currentStaffUser}
                    />
                  )}

                  {portalTab === 'map' && (
                    <DigitalCommunityMap currentStaffUser={currentStaffUser} />
                  )}

                  {portalTab === 'about' && (
                    <AboutSection onGoToTab={(tab) => handleSelectPortalTab(tab)} />
                  )}
                  {portalTab === 'news' && (
                    <NewsSection
                      articles={articles}
                      searchQuery={searchQuery}
                      onSelectArticle={(art) => handleSelectArticle(art)}
                      onGoToOpinion={() => handleSelectPortalTab('opinion')}
                      onOpenHcmSpaceModal={() => setIsHcmSpaceModalOpen(true)}
                      isLoading={isDataSyncing && articles.length === 0}
                    />
                  )}
                  {portalTab === 'documents' && (
                    <DocumentsSection
                      documents={documents}
                      onSelectDocument={(doc) => handleSelectDocument(doc)}
                      isLoading={isDataSyncing && documents.length === 0}
                    />
                  )}
                  {portalTab === 'supervision' && (
                    <SupervisionSection onSelectDocument={(doc) => handleSelectDocument(doc)} />
                  )}
                  {portalTab === 'competitions' && (
                    <CompetitionsSection
                      competitions={competitions}
                      onSelectCompetition={(comp) => handleSelectCompetition(comp)}
                    />
                  )}
                  {portalTab === 'initiatives' && (
                    <InitiativesSection />
                  )}
                  {portalTab === 'new_interface' && (
                    <NewInterfacePage 
                      backgroundImage="https://res.cloudinary.com/idt08wyp/image/upload/v1790008873/4ac22e99-9030-410f-b63f-ec0754836e6a_1.png"
                      currentStaffUser={currentStaffUser}
                      articles={articles}
                      documents={documents}
                      opinions={opinions}
                      onNavigatePortalTab={(tab) => handleSelectPortalTab(tab)}
                      onGoToOffice={(view) => {
                        if (view) {
                          setOfficeView(view);
                          setCurrentSpace('OFFICE');
                        }
                      }}
                      onOpenStaffLogin={() => setShowStaffLoginPage(true)}
                    />
                  )}
                  {portalTab === 'surveys' && (
                    <SurveysSection
                      onSurveySubmitted={() => {
                        handleTriggerSystemToast('Đã gửi phiếu khảo sát', 'Cảm ơn Ông/Bà đã tham gia đóng góp ý kiến xây dựng chính quyền phường.');
                      }}
                    />
                  )}
                  {portalTab === 'opinion' && (
                    <OpinionFormSection opinions={opinions} onSubmitOpinion={handleAddOpinion} />
                  )}
                  {portalTab === 'organizations' && (
                    <MemberOrganizationsSection 
                      organizations={memberOrganizations} 
                      onSelectArticleTopic={() => handleSelectPortalTab('news')} 
                      onNavigateTab={(tab) => handleSelectPortalTab(tab)}
                    />
                  )}
                  {portalTab === 'privacy' && (
                    <PrivacyPolicyPage onBack={() => handleSelectPortalTab('home')} />
                  )}

                  {/* Fallback 404 for unknown portal tabs */}
                  {!VALID_PORTAL_TABS.includes(portalTab) && (
                    <NotFoundPage
                      attemptedPath={window.location.hash || portalTab}
                      errorMessage={`Chuyên mục "${portalTab}" không tồn tại trên Cổng thông tin Mặt trận.`}
                      onGoHome={() => handleSelectPortalTab('home')}
                      onNavigateTab={(tab) => handleSelectPortalTab(tab)}
                      onSearch={(q) => {
                        setSearchQuery(q);
                        handleSelectPortalTab('news');
                      }}
                    />
                  )}
                </>
              )}
            </main>

            {portalTab !== 'new_interface' && (
              <Footer onSelectTab={(tab) => handleSelectPortalTab(tab)} />
            )}
            <AiAssistantWidget />
          </motion.div>
        ) : (
          /* DIGITAL OFFICE SPACE */
          !currentStaffUser ? (
            <motion.div 
              key="office-login-space"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="min-h-screen bg-slate-50 flex flex-col justify-between"
            >
              <Navbar
                activeTab={portalTab}
                setActiveTab={(tab) => {
                  setCurrentSpace('PORTAL');
                  handleSelectPortalTab(tab);
                }}
                onOpenLoginModal={() => setShowStaffLoginPage(true)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isStaffLoggedIn={false}
                currentUser={null}
                onGoToOffice={() => handleSelectPortalTab('new_interface')}
                onOpenHcmSpaceModal={() => setIsHcmSpaceModalOpen(true)}
              />
              <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 flex items-center justify-center">
                <div className="w-full">
                  <StaffLoginPage
                    staffUsers={staffUsers}
                    onLoginSuccess={(user) => {
                      setCurrentStaffUser(user);
                      AppStorageEngine.saveCurrentUser(user);
                      setIsLocked(false);
                      setCurrentSpace('OFFICE');
                    }}
                    onBack={() => setCurrentSpace('PORTAL')}
                  />
                </div>
              </div>
              <Footer onSelectTab={(tab) => {
                setCurrentSpace('PORTAL');
                handleSelectPortalTab(tab);
              }} />
            </motion.div>
          ) : officeView === 'ai_assistant' ? (
            <motion.div
              key="ai-assistant-fullscreen-space"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="h-screen w-screen overflow-hidden bg-slate-950"
            >
              <AiAssistantView
                documentsContext={documents.map(d => `${d.codeNumber}: ${d.title} [Người ký: ${d.signer || 'Không rõ'}, Lĩnh vực: ${d.field || 'Không rõ'}]`).join('\n')}
                opinionsContext={opinions}
                aiChats={aiChats}
                knowledgeNotes={knowledgeNotes}
                currentStaffUser={currentStaffUser}
                onBackToOffice={() => setOfficeView('dashboard')}
                onSaveAiChat={async (chat) => {
                  setAiChats(prev => [chat, ...prev]);
                  CloudDatabase.saveAiChat(chat);
                }}
                onSaveKnowledgeNote={async (note) => {
                  setKnowledgeNotes(prev => [note, ...prev]);
                  CloudDatabase.saveKnowledgeNote(note);
                }}
                onDeleteKnowledgeNote={async (id) => {
                  setKnowledgeNotes(prev => prev.filter(n => n.id !== id));
                  CloudDatabase.deleteKnowledgeNote(id);
                }}
                onShowToast={handleTriggerSystemToast}
              />
            </motion.div>
          ) : (
            <motion.div 
              key="office-dashboard-space"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="flex h-screen overflow-hidden bg-slate-100"
            >
              <DigitalOfficeSidebar
                currentView={officeView}
                setCurrentView={(view) => {
                  handleNavigateOfficeView(view);
                  setIsMobileOfficeSidebarOpen(false);
                }}
                onGoToPortal={() => {
                  setCurrentSpace('PORTAL');
                  window.location.hash = TAB_TO_HASH[portalTab] || '#/trang-chu';
                }}
                onLogout={() => {
                  setCurrentStaffUser(null);
                  setCurrentSpace('PORTAL');
                  window.location.hash = '#/trang-chu';
                }}
                staffName={currentStaffUser?.fullname || ''}
                staffRole={currentStaffUser?.role || ''}
                staffAvatar={currentStaffUser?.avatar}
                isMobileOpen={isMobileOfficeSidebarOpen}
                onCloseMobile={() => setIsMobileOfficeSidebarOpen(false)}
              />

              <div className="flex-1 flex flex-col overflow-y-auto relative">
                {/* Realtime Admin Collaboration Toast Notifications & Login Summary */}
                <RealtimeActivityToastContainer 
                  currentAdmin={currentStaffUser} 
                  onNavigateToEntity={(entityType, entityId, route) => {
                    if (route) {
                      handleNavigateOfficeView(route);
                    } else if (entityType === 'article') {
                      handleNavigateOfficeView('cms');
                    } else if (entityType === 'document') {
                      handleNavigateOfficeView('documents');
                    } else if (entityType === 'cultural_media') {
                      handleNavigateOfficeView('cultural_space');
                    }
                  }}
                />

                <LoginSummaryModal
                  currentAdmin={currentStaffUser}
                  onNavigateToEntity={(entityType, entityId, route) => {
                    if (route) {
                      handleNavigateOfficeView(route);
                    } else if (entityType === 'article') {
                      handleNavigateOfficeView('cms');
                    } else if (entityType === 'document') {
                      handleNavigateOfficeView('documents');
                    }
                  }}
                />

                <DigitalOfficeHeader
                  staffName={currentStaffUser?.fullname || ''}
                  staffPosition={currentStaffUser?.position || ''}
                  staffAvatar={currentStaffUser?.avatar}
                  staffRole={currentStaffUser?.role || 'STAFF'}
                  staffEmail={currentStaffUser?.email}
                  staffDepartment={currentStaffUser?.department}
                  currentUser={currentStaffUser}
                  onNavigate={(view) => handleNavigateOfficeView(view)}
                  onNavigateToEntity={(entityType, entityId, route) => {
                    if (route) {
                      handleNavigateOfficeView(route);
                    } else if (entityType === 'article') {
                      handleNavigateOfficeView('cms');
                    } else if (entityType === 'document') {
                      handleNavigateOfficeView('documents');
                    } else if (entityType === 'cultural_media') {
                      handleNavigateOfficeView('cultural_space');
                    }
                  }}
                  onOpenProfile={() => handleNavigateOfficeView('profile')}
                  onOpenAi={() => handleNavigateOfficeView('ai_assistant')}
                  onGoToPortal={() => {
                    setCurrentSpace('PORTAL');
                    window.location.hash = TAB_TO_HASH[portalTab] || '#/trang-chu';
                  }}
                  onForceCloudSync={handleForceCloudSync}
                  onToggleMobileSidebar={() => setIsMobileOfficeSidebarOpen(true)}
                  onOpenDigitalDirectory={() => setIsDirectoryModalOpen(true)}
                  onLogout={async () => {
                    try {
                      await signOut(auth);
                    } catch (e) {
                      console.error('SignOut error:', e);
                    }
                    setCurrentStaffUser(null);
                    AppStorageEngine.saveCurrentUser(null);
                    setCurrentSpace('PORTAL');
                    window.location.hash = '#/trang-chu';
                  }}
                  onTriggerSimulatedOpinion={handleTriggerSimulatedOpinion}
                  onTriggerSimulatedDocApproval={handleTriggerSimulatedDocApproval}
                />

                <main className="flex-1 pb-12 p-2 sm:p-4">
                  {!isOfficeViewAllowed ? (
                    <div className="p-8 max-w-lg mx-auto my-12 bg-white rounded-3xl border border-red-200 shadow-xl text-center space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-700 mx-auto flex items-center justify-center">
                        <Lock className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-black text-slate-900">Giới hạn Quyền Truy cập</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Tài khoản của bạn ({currentStaffUser?.fullname} - <span className="font-extrabold text-red-800">{userRole}</span>) không đủ phân quyền để xem chức năng này.
                      </p>
                      <button
                        onClick={() => setOfficeView('dashboard')}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold rounded-xl transition-colors"
                      >
                        Về Trang Tổng quan
                      </button>
                    </div>
                  ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={officeView}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    {officeView === 'dashboard' && (
                      <AnalyticsDashboardView
                        articlesCount={(articles || []).length}
                        documentsCount={(documents || []).length}
                        opinionsCount={(opinions || []).length}
                        opinions={opinions || []}
                        onNavigateToOpinions={() => setOfficeView('opinions')}
                        onUpdateOpinionStatus={handleUpdateOpinionStatus}
                      />
                    )}

                    {officeView === 'profile' && currentStaffUser && (
                      <UserProfileView
                        currentUser={currentStaffUser}
                        onRefreshAllData={handleRefreshAllData}
                        onUpdateProfile={(updatedUser) => {
                          setCurrentStaffUser(updatedUser);
                          setStaffUsers(prev => {
                            const next = prev.map(u => u.id === updatedUser.id ? updatedUser : u);
                            AppStorageEngine.saveStaffUsers(next);
                            return next;
                          });
                          AppStorageEngine.saveCurrentUser(updatedUser);
                          // Sync to Firebase Cloud Firestore
                          CloudDatabase.saveStaffUser(updatedUser);
                          
                          const log: AuditLog = {
                            id: 'log-' + Date.now(),
                            userId: updatedUser.id,
                            userName: updatedUser.fullname,
                            action: 'CẬP NHẬT HỒ SƠ',
                            entity: 'Tài khoản Cán bộ',
                            details: `Cập nhật thông tin cán bộ: "${updatedUser.fullname}" (${updatedUser.position})`,
                            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
                          };
                          setAuditLogs(prev => {
                            const nextLogs = [log, ...prev];
                            AppStorageEngine.saveAuditLogs(nextLogs);
                            return nextLogs;
                          });
                          CloudDatabase.logAudit(log);
                          handleTriggerSystemToast('Đã lưu hồ sơ cán bộ', `Thông tin cán bộ ${updatedUser.fullname} đã được lưu trữ vào CSDL đám mây.`);
                        }}
                      />
                    )}

                    {officeView === 'neighborhood_management' && (
                      <NeighborhoodManagementAdminView
                        currentStaffUser={currentStaffUser}
                        onShowToast={(title, msg) => handleTriggerSystemToast(title, msg)}
                        onNavigateToOpinions={() => handleNavigateOfficeView('opinions')}
                        onNavigateToMap={() => handleNavigateOfficeView('neighborhood_map')}
                      />
                    )}

                    {officeView === 'neighborhood_map' && (
                      <NeighborhoodMapDashboard
                        opinions={opinions}
                        onSelectNeighborhoodOpinions={() => {
                          setOfficeView('opinions');
                        }}
                      />
                    )}

                    {officeView === 'ai_assistant' && (
                      <AiAssistantView
                        documentsContext={documents.map(d => `${d.codeNumber}: ${d.title} [Người ký: ${d.signer || 'Không rõ'}, Lĩnh vực: ${d.field || 'Không rõ'}]`).join('\n')}
                        opinionsContext={opinions}
                        aiChats={aiChats}
                        knowledgeNotes={knowledgeNotes}
                        currentStaffUser={currentStaffUser}
                        onSaveAiChat={async (chat) => {
                          setAiChats(prev => [chat, ...prev]);
                          CloudDatabase.saveAiChat(chat);
                        }}
                        onSaveKnowledgeNote={async (note) => {
                          setKnowledgeNotes(prev => [note, ...prev]);
                          CloudDatabase.saveKnowledgeNote(note);
                        }}
                        onDeleteKnowledgeNote={async (id) => {
                          setKnowledgeNotes(prev => prev.filter(n => n.id !== id));
                          CloudDatabase.deleteKnowledgeNote(id);
                        }}
                        onShowToast={handleTriggerSystemToast}
                      />
                    )}

                    {officeView === 'opinions' && (
                      <OpinionsAdminView
                        opinions={opinions}
                        onUpdateOpinionStatus={handleUpdateOpinionStatus}
                        onDeleteOpinion={handleDeleteOpinion}
                        onOpenAiSummary={() => setOfficeView('ai_assistant')}
                      />
                    )}

                    {officeView === 'administrative_report_exporter' && (
                      <AdministrativeReportExporter />
                    )}

                    {officeView === 'document_ai_plan_generator' && (
                      <DocumentAiPlanGenerator />
                    )}

                    {officeView === 'neighborhood_emulation' && (
                      <NeighborhoodEmulationDashboard />
                    )}

                    {officeView === 'youth_union_admin' && (
                      <AdminDashboard currentUserName={currentStaffUser?.fullname} />
                    )}

                    {officeView === 'youth_union_workspace' && (
                      <WorkspaceShell currentUser={currentStaffUser} />
                    )}

                    {(officeView === 'cms' || officeView === 'cms_articles') && (
                      <CmsAdminView
                        articles={articles}
                        articleSubmissions={articleSubmissions}
                        documents={documents}
                        competitions={competitions}
                        opinions={opinions}
                        initialTab="ARTICLES"
                        onAddArticle={handleAddArticle}
                        onUpdateArticle={handleUpdateArticle}
                        onDeleteArticle={handleDeleteArticle}
                        onUpdateArticleSubmission={handleUpdateArticleSubmission}
                        onDeleteArticleSubmission={handleDeleteArticleSubmission}
                        onAddDocument={handleAddDocument}
                        onUpdateDocument={handleUpdateDocument}
                        onDeleteDocument={handleDeleteDocument}
                        onAddCompetition={handleAddCompetition}
                        onUpdateCompetition={handleUpdateCompetition}
                        onDeleteCompetition={handleDeleteCompetition}
                        onUpdateOpinionStatus={handleUpdateOpinionStatus}
                        onRequestDocApproval={handleTriggerDocApprovalToast}
                        onForceCloudSync={handleForceCloudSync}
                        onShowToast={handleTriggerSystemToast}
                      />
                    )}

                    {officeView === 'cms_initiatives' && (
                      <CmsAdminView
                        articles={articles}
                        documents={documents}
                        competitions={competitions}
                        opinions={opinions}
                        initialTab="INITIATIVES"
                        onAddArticle={handleAddArticle}
                        onUpdateArticle={handleUpdateArticle}
                        onDeleteArticle={handleDeleteArticle}
                        onAddDocument={handleAddDocument}
                        onUpdateDocument={handleUpdateDocument}
                        onDeleteDocument={handleDeleteDocument}
                        onAddCompetition={handleAddCompetition}
                        onUpdateCompetition={handleUpdateCompetition}
                        onDeleteCompetition={handleDeleteCompetition}
                        onUpdateOpinionStatus={handleUpdateOpinionStatus}
                        onRequestDocApproval={handleTriggerDocApprovalToast}
                        onForceCloudSync={handleForceCloudSync}
                        onShowToast={handleTriggerSystemToast}
                      />
                    )}

                    {officeView === 'cms_about' && (
                      <CmsAdminView
                        articles={articles}
                        documents={documents}
                        competitions={competitions}
                        opinions={opinions}
                        initialTab="ABOUT"
                        onAddArticle={handleAddArticle}
                        onUpdateArticle={handleUpdateArticle}
                        onDeleteArticle={handleDeleteArticle}
                        onAddDocument={handleAddDocument}
                        onUpdateDocument={handleUpdateDocument}
                        onDeleteDocument={handleDeleteDocument}
                        onAddCompetition={handleAddCompetition}
                        onUpdateCompetition={handleUpdateCompetition}
                        onDeleteCompetition={handleDeleteCompetition}
                        onUpdateOpinionStatus={handleUpdateOpinionStatus}
                        onRequestDocApproval={handleTriggerDocApprovalToast}
                        onForceCloudSync={handleForceCloudSync}
                        onShowToast={handleTriggerSystemToast}
                      />
                    )}

                    {(officeView === 'cms_documents' || officeView === 'documents') && (
                      <DocumentsAdminView
                        documents={documents}
                        onAddDocument={handleAddDocument}
                        onUpdateDocument={handleUpdateDocument}
                        onDeleteDocument={handleDeleteDocument}
                        onRequestDocApproval={handleTriggerDocApprovalToast}
                        onShowToast={(msg, type) => handleTriggerSystemToast(type === 'error' ? 'Lỗi' : 'Thông báo', msg)}
                      />
                    )}

                    {officeView === 'notes' && (
                      <PersonalNotesView
                        notes={notes}
                        onAddNote={(n) => {
                          setNotes(prev => {
                            const next = [n, ...prev];
                            AppStorageEngine.saveNotes(next);
                            return next;
                          });
                          CloudDatabase.saveNote(n);
                          handleTriggerSystemToast('Đã lưu ghi chú', `Ghi chú "${n.title}" đã được lưu trữ vào sổ tay.`);
                        }}
                        onDeleteNote={(id) => {
                          setNotes(prev => {
                            const next = prev.filter(n => n.id !== id);
                            AppStorageEngine.saveNotes(next);
                            return next;
                          });
                          CloudDatabase.deleteNote(id);
                        }}
                        onTogglePin={(id) => {
                          setNotes(prev => {
                            const target = prev.find(n => n.id === id);
                            if (target) {
                              CloudDatabase.saveNote({ ...target, isPinned: !target.isPinned });
                            }
                            const next = prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n);
                            AppStorageEngine.saveNotes(next);
                            return next;
                          });
                        }}
                      />
                    )}

                    {officeView === 'templates' && (
                      <DocumentTemplatesView
                        templates={templates}
                        onOpenAiPlanner={() => setOfficeView('ai_assistant')}
                      />
                    )}

                    {officeView === 'competitions_admin' && (
                      activeCompetitionId ? (
                        <CompetitionAdminDetailView
                          competition={competitions.find(c => c.id === activeCompetitionId) || competitions[0]}
                          onBack={() => setActiveCompetitionId(null)}
                          onUpdateCompetition={handleUpdateCompetition}
                          submissions={submissions}
                          onGradeSubmission={(id, score, comment) => {
                            setSubmissions(prev => {
                              const target = prev.find(s => s.id === id);
                              if (target) {
                                CloudDatabase.saveSubmission({ ...target, score, adminComment: comment, status: 'GRADED' as const });
                              }
                              const next: CompetitionSubmission[] = prev.map(s => s.id === id ? { ...s, score, adminComment: comment, status: 'GRADED' as const } : s);
                              AppStorageEngine.saveSubmissions(next);
                              return next;
                            });
                            handleTriggerSystemToast('Đã chấm điểm bài thi', 'Điểm và nhận xét bài thi đã được lưu trữ trực tuyến.');
                          }}
                          onShowToast={handleTriggerSystemToast}
                        />
                      ) : (
                        <CompetitionsAdminView
                          competitions={competitions}
                          submissions={submissions}
                          onAddCompetition={handleAddCompetition}
                          onUpdateCompetition={handleUpdateCompetition}
                          onDeleteCompetition={handleDeleteCompetition}
                          onGradeSubmission={(id, score, comment) => {
                            setSubmissions(prev => {
                              const target = prev.find(s => s.id === id);
                              if (target) {
                                CloudDatabase.saveSubmission({ ...target, score, adminComment: comment, status: 'GRADED' as const });
                              }
                              const next: CompetitionSubmission[] = prev.map(s => s.id === id ? { ...s, score, adminComment: comment, status: 'GRADED' as const } : s);
                              AppStorageEngine.saveSubmissions(next);
                              return next;
                            });
                            handleTriggerSystemToast('Đã chấm điểm bài thi', 'Điểm và nhận xét bài thi đã được lưu trữ trực tuyến.');
                          }}
                          onSelectCompetitionDetail={(id) => setActiveCompetitionId(id)}
                          onRestoreDefaultBanners={handleRestoreDefaultBanners}
                          onRestoreDefaultCompetitions={handleRestoreDefaultCompetitions}
                        />
                      )
                    )}

                    {officeView === 'question_banks' && (
                      <QuestionBankAdminView
                        onTriggerToast={handleTriggerSystemToast}
                      />
                    )}

                    {officeView === 'surveys_admin' && (
                      <SurveysAdminView
                        onTriggerToast={handleTriggerSystemToast}
                      />
                    )}

                    {officeView === 'member_orgs_admin' && (
                      <MemberOrganizationsAdminView
                        organizations={memberOrganizations}
                        politicalOrganizations={politicalOrganizations}
                        areas={areas}
                        onSaveOrganizations={(orgs) => {
                          setMemberOrganizations(orgs);
                          AppStorageEngine.saveMemberOrganizations(orgs);
                          CloudDatabase.saveAllMemberOrganizations(orgs);
                        }}
                        onSavePoliticalOrganizations={(orgs) => {
                          setPoliticalOrganizations(orgs);
                          AppStorageEngine.saveOrganizations(orgs);
                          CloudDatabase.saveAllOrganizations(orgs);
                        }}
                        onSaveAreas={(ar) => {
                          setAreas(ar);
                          AppStorageEngine.saveAreas(ar);
                          CloudDatabase.saveAllAreas(ar);
                        }}
                        onShowToast={(msg, type) => handleTriggerSystemToast(type === 'error' ? 'Thất bại' : 'Thông báo', msg)}
                        onNavigateTab={(tab) => {
                          setCurrentSpace('PORTAL');
                          handleSelectPortalTab(tab);
                        }}
                      />
                    )}

                    {(officeView === 'cultural_space_admin' || officeView === 'cultural_space') && (
                      <CulturalSpaceAdminView />
                    )}

                    {officeView === 'users' && (
                      <StaffUsersAdminView
                        staffUsers={staffUsers}
                        currentStaffUser={currentStaffUser}
                        onToggleUserActive={(id) => {
                          const target = staffUsers.find(u => u.id === id);
                          const nextActive = target ? (target.active === false ? true : false) : true;
                          setStaffUsers(prev => {
                            const next = prev.map(u => {
                              if (u.id === id) {
                                const updated = { ...u, active: nextActive, status: nextActive ? ('active' as const) : ('inactive' as const) };
                                CloudDatabase.saveStaffUser(updated);
                                return updated;
                              }
                              return u;
                            });
                            AppStorageEngine.saveStaffUsers(next);
                            return next;
                          });

                          const log: AuditLog = {
                            id: 'log-' + Date.now(),
                            userId: currentStaffUser?.id || 'admin',
                            userName: currentStaffUser?.fullname || 'Quản trị viên',
                            email: currentStaffUser?.email,
                            action: nextActive ? 'KÍCH HOẠT TÀI KHOẢN' : 'KHÓA TÀI KHOẢN',
                            entity: 'Quản trị cán bộ',
                            entityId: id,
                            entityTitle: target?.fullname || id,
                            resource: 'users',
                            resourceId: id,
                            result: 'SUCCESS',
                            details: `${nextActive ? 'Kích hoạt' : 'Khóa'} tài khoản cán bộ: ${target?.fullname || id} (${target?.email || ''})`,
                            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
                          };
                          setAuditLogs(prev => {
                            const next = [log, ...prev];
                            AppStorageEngine.saveAuditLogs(next);
                            return next;
                          });
                          CloudDatabase.logAudit(log);
                        }}
                        onAddUser={(u) => {
                          setStaffUsers(prev => {
                            const next = [...prev, u];
                            AppStorageEngine.saveStaffUsers(next);
                            return next;
                          });
                          CloudDatabase.saveStaffUser(u);

                          const log: AuditLog = {
                            id: 'log-' + Date.now(),
                            userId: currentStaffUser?.id || 'admin',
                            userName: currentStaffUser?.fullname || 'Quản trị viên',
                            email: currentStaffUser?.email,
                            action: 'TẠO CÁN BỘ & CẤP QUYỀN',
                            entity: 'Quản trị cán bộ',
                            entityId: u.id,
                            entityTitle: u.fullname,
                            resource: 'users',
                            resourceId: u.id,
                            result: 'SUCCESS',
                            details: `Tạo tài khoản mới và cấp vai trò [${u.role}] cho cán bộ: ${u.fullname} (${u.email})`,
                            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
                          };
                          setAuditLogs(prev => {
                            const next = [log, ...prev];
                            AppStorageEngine.saveAuditLogs(next);
                            return next;
                          });
                          CloudDatabase.logAudit(log);

                          handleTriggerSystemToast('Đã thêm cán bộ', `Tài khoản cán bộ ${u.fullname} đã được tạo và lưu trữ.`);
                        }}
                        onUpdateUser={(updatedUser) => {
                          setStaffUsers(prev => {
                            const next = prev.map(u => u.id === updatedUser.id ? updatedUser : u);
                            AppStorageEngine.saveStaffUsers(next);
                            return next;
                          });
                          CloudDatabase.saveStaffUser(updatedUser);
                          if (currentStaffUser?.id === updatedUser.id) {
                            setCurrentStaffUser(updatedUser);
                            AppStorageEngine.saveCurrentUser(updatedUser);
                          }

                          const log: AuditLog = {
                            id: 'log-' + Date.now(),
                            userId: currentStaffUser?.id || 'admin',
                            userName: currentStaffUser?.fullname || 'Quản trị viên',
                            email: currentStaffUser?.email,
                            action: 'CẬP NHẬT PHÂN QUYỀN CÁN BỘ',
                            entity: 'Quản trị cán bộ',
                            entityId: updatedUser.id,
                            entityTitle: updatedUser.fullname,
                            resource: 'users',
                            resourceId: updatedUser.id,
                            result: 'SUCCESS',
                            details: `Cập nhật hồ sơ & quyền hạn cho cán bộ: ${updatedUser.fullname} [Vai trò: ${updatedUser.role}]`,
                            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
                          };
                          setAuditLogs(prev => {
                            const next = [log, ...prev];
                            AppStorageEngine.saveAuditLogs(next);
                            return next;
                          });
                          CloudDatabase.logAudit(log);

                          handleTriggerSystemToast('Đã cập nhật cán bộ', `Thông tin cán bộ ${updatedUser.fullname} đã được lưu trữ.`);
                        }}
                        onDeleteUser={(id) => {
                          const target = staffUsers.find(u => u.id === id);
                          setStaffUsers(prev => {
                            const next = prev.filter(u => u.id !== id);
                            AppStorageEngine.saveStaffUsers(next);
                            return next;
                          });
                          CloudDatabase.deleteStaffUser(id);

                          const log: AuditLog = {
                            id: 'log-' + Date.now(),
                            userId: currentStaffUser?.id || 'admin',
                            userName: currentStaffUser?.fullname || 'Quản trị viên',
                            email: currentStaffUser?.email,
                            action: 'XÓA CÁN BỘ',
                            entity: 'Quản trị cán bộ',
                            entityId: id,
                            entityTitle: target?.fullname || id,
                            resource: 'users',
                            resourceId: id,
                            result: 'SUCCESS',
                            details: `Xóa tài khoản cán bộ: ${target?.fullname || id} (${target?.email || ''})`,
                            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
                          };
                          setAuditLogs(prev => {
                            const next = [log, ...prev];
                            AppStorageEngine.saveAuditLogs(next);
                            return next;
                          });
                          CloudDatabase.logAudit(log);

                          handleTriggerSystemToast('Đã xóa cán bộ', 'Tài khoản cán bộ đã được xóa khỏi hệ thống.');
                        }}
                        onOpenDigitalDirectory={() => setIsDirectoryModalOpen(true)}
                      />
                    )}

                    {officeView === 'analytics' && (
                      <AnalyticsDashboardView
                        articlesCount={(articles || []).length}
                        documentsCount={(documents || []).length}
                        opinionsCount={(opinions || []).length}
                        opinions={opinions || []}
                        onNavigateToOpinions={() => handleNavigateOfficeView('opinions')}
                        onUpdateOpinionStatus={handleUpdateOpinionStatus}
                      />
                    )}

                    {officeView === 'audit_logs' && <AuditLogsView logs={auditLogs} />}

                    {officeView === 'notifications' && (
                      <NotificationAdminView
                        currentUserId={currentStaffUser?.id || 'admin'}
                        onTriggerToast={(title, msg) => handleTriggerSystemToast(title, msg)}
                      />
                    )}

                    {officeView === 'email_settings' && (
                      <EmailSettingsView />
                    )}

                    {/* Office 404 Fallback when view is not recognized */}
                    {!VALID_OFFICE_VIEWS.includes(officeView) && (
                      <div className="p-8 max-w-lg mx-auto my-12 bg-white rounded-3xl border border-amber-200 shadow-xl text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
                          <AlertTriangle className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900">Phân Hệ Không Tồn Tại (404)</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Phân hệ làm việc <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{officeView}</span> không tồn tại hoặc đã được gộp phân hệ.
                        </p>
                        <div className="flex justify-center gap-3 pt-2">
                          <button
                            onClick={() => handleNavigateOfficeView('dashboard')}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                          >
                            Về Trang Tổng quan
                          </button>
                          <button
                            onClick={() => {
                              setCurrentSpace('PORTAL');
                              handleSelectPortalTab('home');
                            }}
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                          >
                            Về Cổng Người dân
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </main>
          </div>
        </motion.div>
          )
        )}
      </AnimatePresence>

      {/* STAFF LOGIN MODAL */}
      <StaffLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        staffUsers={staffUsers}
        onRegisterUser={(newUser) => {
          setStaffUsers(prev => [...prev, newUser]);
          CloudDatabase.saveStaffUser(newUser);
          NotificationService.notifyUserRegistered(newUser).catch(err => {
            console.error('Failed to send registration email notification:', err);
          });
        }}
        onLoginSuccess={(user) => {
          setCurrentStaffUser(user);
          AppStorageEngine.saveCurrentUser(user);
          CloudDatabase.saveStaffUser(user);
          setIsLocked(false);
          setCurrentSpace('OFFICE');
          
          // Check if it's a Chi đoàn user (role or department identifier)
          if (user.role === 'STAFF' && (user.department.includes('Chi đoàn') || user.position.includes('Chi đoàn'))) {
            setOfficeView('youth_union_workspace');
          } else {
            setOfficeView('dashboard');
          }
        }}
      />

      {/* SESSION LOCK & WARNING SCREEN */}
      <SessionLockScreen
        currentUser={currentStaffUser}
        onUnlock={() => {
          handleTriggerSystemToast('Đã mở khóa', 'Phiên làm việc của bạn đã được khôi phục an toàn.');
        }}
        onLogout={async () => {
          try {
            await signOut(auth);
          } catch (e) {
            console.error('SignOut error:', e);
          }
          setCurrentStaffUser(null);
          AppStorageEngine.saveCurrentUser(null);
          setCurrentSpace('PORTAL');
          handleTriggerSystemToast('Đã đăng xuất', 'Phiên làm việc đã kết thúc.');
        }}
        auditLogs={auditLogs}
        setAuditLogs={setAuditLogs}
        isLocked={isLocked}
        setIsLocked={setIsLocked}
      />

      {/* REAL-TIME TOAST NOTIFICATION CONTAINER */}
      <ToastContainer
        toasts={toasts}
        onDismiss={handleDismissToast}
        onNavigateToView={handleNavigateFromToast}
      />

      {/* EXTENDED FEATURE MODALS */}
      <VolunteerRegistrationModal
        isOpen={isVolunteerModalOpen}
        onClose={() => setIsVolunteerModalOpen(false)}
        onSuccess={(title, msg) => handleTriggerSystemToast(title, msg)}
      />

      <DigitalDirectoryModal
        isOpen={isDirectoryModalOpen}
        onClose={() => setIsDirectoryModalOpen(false)}
      />

      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        userId={currentStaffUser?.id}
        userRoles={currentStaffUser?.role ? [currentStaffUser.role] : ['GUEST', 'PUBLIC']}
        onNavigate={(v) => {
          setIsNotificationCenterOpen(false);
          if (v === 'opinions') {
            setCurrentSpace('OFFICE');
            setOfficeView('opinions');
          } else {
            setCurrentSpace('PORTAL');
            setPortalTab(v);
          }
        }}
      />

      {/* 3D HO CHI MINH CULTURAL SPACE POPUP MODAL */}
      <HoChiMinhCulturalSpaceModal
        isOpen={isHcmSpaceModalOpen}
        onClose={() => setIsHcmSpaceModalOpen(false)}
        onNavigateToMap={() => {
          setIsHcmSpaceModalOpen(false);
          handleSelectPortalTab('map');
        }}
        currentStaffUser={currentStaffUser}
        onTriggerToast={handleTriggerSystemToast}
      />

      {/* WELFARE & 21 KP COMMUNITY MAP MODAL */}
      <WelfareCommunityMapModal
        isOpen={isWelfareMapOpen}
        onClose={() => setIsWelfareMapOpen(false)}
      />

      {/* SHARE QR POSTER MODAL */}
      {sharePosterData && (
        <ShareQrPosterModal
          isOpen={sharePosterData.isOpen}
          onClose={() => setSharePosterData(null)}
          title={sharePosterData.title}
          shareUrl={sharePosterData.url}
        />
      )}
    </div>
  );
}

