/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroCarousel } from './components/HeroCarousel';
import { NewsSection } from './components/NewsSection';
import { DocumentsSection } from './components/DocumentsSection';
import { CompetitionsSection } from './components/CompetitionsSection';
import { OpinionFormSection } from './components/OpinionFormSection';
import { ArticleDetailPage } from './components/ArticleDetailPage';
import { DocumentDetailPage } from './components/DocumentDetailPage';
import { CompetitionDetailPage } from './components/CompetitionDetailPage';
import { StaffLoginPage } from './components/StaffLoginPage';
import { WorkCalendarSection } from './components/WorkCalendarSection';
import { AiAssistantWidget } from './components/AiAssistantWidget';

import { DigitalOfficeSidebar } from './components/office/DigitalOfficeSidebar';
import { DigitalOfficeHeader } from './components/office/DigitalOfficeHeader';
import { AiAssistantView } from './components/office/AiAssistantView';
import { TaskManagementView } from './components/office/TaskManagementView';
import { OpinionsAdminView } from './components/office/OpinionsAdminView';
import { CmsAdminView } from './components/office/CmsAdminView';
import { AnalyticsDashboardView } from './components/office/AnalyticsDashboardView';
import { AuditLogsView } from './components/office/AuditLogsView';
import { WorkCalendarView } from './components/office/WorkCalendarView';
import { PersonalNotesView } from './components/office/PersonalNotesView';
import { DocumentTemplatesView } from './components/office/DocumentTemplatesView';
import { CompetitionsAdminView } from './components/office/CompetitionsAdminView';
import { CompetitionAdminDetailView } from './components/office/CompetitionAdminDetailView';
import { StaffUsersAdminView } from './components/office/StaffUsersAdminView';
import { NeighborhoodMapDashboard } from './components/office/NeighborhoodMapDashboard';
import { UserProfileView } from './components/office/UserProfileView';
import { StaffLoginModal } from './components/office/StaffLoginModal';
import { SessionLockScreen } from './components/office/SessionLockScreen';
import { ToastContainer } from './components/ToastNotification';

import { 
  INITIAL_COMPETITIONS, 
  INITIAL_TRIVIA_QUESTIONS, 
  INITIAL_TEMPLATES
} from './data/seedData';

import { Article, OfficialDocument, Competition, CompetitionSubmission, PublicOpinion, Task, DriveFileItem, StaffUser, AuditLog, OpinionStatus, TaskStatus, ToastMessage, UserRole, AiChatLog, KnowledgeNote } from './types';
import { sortArticlesNewestFirst, sortDocumentsNewestFirst, sortCompetitionsNewestFirst, sortOpinionsNewestFirst } from './lib/dateUtils';
import { AppStorageEngine } from './lib/storage';
import { CloudDatabase } from './lib/firestoreService';
import { VisitorTrackerEngine } from './lib/visitorTracker';
import { canAccessView } from './lib/rbac';
import { auth } from './lib/firebase';
import { signOut } from 'firebase/auth';
import { Sparkles, MessageSquare, FileText, ShieldCheck, Lock, Cloud, CloudCheck } from 'lucide-react';
import { browserNotificationService } from './lib/browserNotifications';

export default function App() {
  // Navigation & Space State
  const [currentSpace, setCurrentSpace] = useState<'PORTAL' | 'OFFICE'>('PORTAL');
  const [portalTab, setPortalTab] = useState<string>('home');
  const [officeView, setOfficeView] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Full-page Detail & Page View States (no popups)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<OfficialDocument | null>(null);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [activeCompetitionId, setActiveCompetitionId] = useState<string | null>(null);
  const [showStaffLoginPage, setShowStaffLoginPage] = useState(false);
  const [isMobileOfficeSidebarOpen, setIsMobileOfficeSidebarOpen] = useState(false);

  const handleSelectPortalTab = (tab: string) => {
    setPortalTab(tab);
    setSelectedArticle(null);
    setSelectedDocument(null);
    setSelectedCompetition(null);
    setShowStaffLoginPage(false);
  };

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Authentication State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentStaffUser, setCurrentStaffUser] = useState<StaffUser | null>(() => AppStorageEngine.getCurrentUser());
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return localStorage.getItem('office_session_locked') === 'true';
  });

  // Keep lock state synchronized to localStorage
  useEffect(() => {
    localStorage.setItem('office_session_locked', isLocked.toString());
  }, [isLocked]);

  // Data Collections with Local Persistence Engine
  const [articles, setArticles] = useState<Article[]>(() => AppStorageEngine.getArticles());
  const [documents, setDocuments] = useState<OfficialDocument[]>(() => AppStorageEngine.getDocuments());
  const [competitions, setCompetitions] = useState<Competition[]>(() => AppStorageEngine.getCompetitions());
  const [submissions, setSubmissions] = useState<CompetitionSubmission[]>(() => AppStorageEngine.getSubmissions());
  const [opinions, setOpinions] = useState<PublicOpinion[]>(() => AppStorageEngine.getOpinions());
  const [tasks, setTasks] = useState<Task[]>(() => AppStorageEngine.getTasks());
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>(() => AppStorageEngine.getDriveFiles());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => AppStorageEngine.getAuditLogs());
  const [events, setEvents] = useState(() => AppStorageEngine.getEvents());
  const [notes, setNotes] = useState(() => AppStorageEngine.getNotes());
  const [templates] = useState(INITIAL_TEMPLATES);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>(() => AppStorageEngine.getStaffUsers());
  const [aiChats, setAiChats] = useState<AiChatLog[]>(() => AppStorageEngine.getAiChats());
  const [knowledgeNotes, setKnowledgeNotes] = useState<KnowledgeNote[]>(() => AppStorageEngine.getKnowledgeNotes());

  // Initialize real-time visitor & session tracking & Firebase Cloud Sync
  useEffect(() => {
    VisitorTrackerEngine.init();

    // Start Realtime Cloud Database Sync with Firebase Firestore
    CloudDatabase.initCloudDatabase({
      onArticlesUpdate: (arts) => setArticles(arts),
      onDocumentsUpdate: (docs) => setDocuments(docs),
      onOpinionsUpdate: (ops) => setOpinions(ops),
      onCompetitionsUpdate: (comps) => setCompetitions(comps),
      onTasksUpdate: (ts) => setTasks(ts),
      onEventsUpdate: (evs) => setEvents(evs),
      onNotesUpdate: (ns) => setNotes(ns),
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
    });
  }, []);

  // Auto-Sync state changes to Local Storage
  useEffect(() => { AppStorageEngine.saveArticles(articles); }, [articles]);
  useEffect(() => { AppStorageEngine.saveDocuments(documents); }, [documents]);
  useEffect(() => { AppStorageEngine.saveCompetitions(competitions); }, [competitions]);
  useEffect(() => { AppStorageEngine.saveOpinions(opinions); }, [opinions]);
  useEffect(() => { AppStorageEngine.saveTasks(tasks); }, [tasks]);
  useEffect(() => { AppStorageEngine.saveEvents(events); }, [events]);
  useEffect(() => { AppStorageEngine.saveNotes(notes); }, [notes]);
  useEffect(() => { AppStorageEngine.saveSubmissions(submissions); }, [submissions]);
  useEffect(() => { AppStorageEngine.saveDriveFiles(driveFiles); }, [driveFiles]);
  useEffect(() => { AppStorageEngine.saveStaffUsers(staffUsers); }, [staffUsers]);
  useEffect(() => { AppStorageEngine.saveAuditLogs(auditLogs); }, [auditLogs]);
  useEffect(() => { AppStorageEngine.saveCurrentUser(currentStaffUser); }, [currentStaffUser]);
  useEffect(() => { AppStorageEngine.saveAiChats(aiChats); }, [aiChats]);
  useEffect(() => { AppStorageEngine.saveKnowledgeNotes(knowledgeNotes); }, [knowledgeNotes]);

  // Handle Hash Routing for Public Competition Pages (e.g. #/hoi-thi/:id)
  useEffect(() => {
    const handleHashRouting = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/hoi-thi/')) {
        const compId = hash.replace('#/hoi-thi/', '');
        const targetComp = competitions.find(c => c.id === compId);
        if (targetComp) {
          setCurrentSpace('PORTAL');
          setPortalTab('competitions');
          setSelectedCompetition(targetComp);
        } else if (competitions.length > 0) {
          setCurrentSpace('PORTAL');
          setPortalTab('competitions');
          setSelectedCompetition(competitions[0]);
        }
      }
    };

    handleHashRouting();
    window.addEventListener('hashchange', handleHashRouting);
    return () => window.removeEventListener('hashchange', handleHashRouting);
  }, [competitions]);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [portalTab, officeView, currentSpace]);

  // Guard RBAC Office Views
  const userRole: UserRole = currentStaffUser?.role || 'STAFF';
  const isOfficeViewAllowed = canAccessView(userRole, officeView);

  // Toast Handlers
  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleTriggerSystemToast = (title: string, message: string) => {
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
    setTasks(AppStorageEngine.getTasks());
    setDriveFiles(AppStorageEngine.getDriveFiles());
    setAuditLogs(AppStorageEngine.getAuditLogs());
    setEvents(AppStorageEngine.getEvents());
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
    const REAL_NEIGHBORHOODS = [
      'Tương Bình Hiệp 1', 'Tương Bình Hiệp 2', 'Tương Bình Hiệp 3', 'Tương Bình Hiệp 4', 'Tương Bình Hiệp 5', 'Tương Bình Hiệp 6', 'Tương Bình Hiệp 7',
      'Hiệp An 7', 'Hiệp An 8', 'Hiệp An 9',
      'Định Hòa 1', 'Định Hòa 2', 'Định Hòa 3', 'Định Hòa 4', 'Định Hòa 5', 'Định Hòa 6', 'Định Hòa 7', 'Định Hòa 8',
      'Mỹ Hảo',
      'Chánh Mỹ 1', 'Chánh Mỹ 2'
    ];
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
  };

  const handleUpdateOpinionStatus = (id: string, status: OpinionStatus, responseText?: string) => {
    setOpinions(prev => {
      const target = prev.find(o => o.id === id);
      if (target) {
        const updated = { ...target, status, adminResponse: responseText || target.adminResponse };
        CloudDatabase.saveOpinion(updated);
      }
      const next = prev.map(o => o.id === id ? { ...o, status, adminResponse: responseText || o.adminResponse } : o);
      AppStorageEngine.saveOpinions(next);
      return next;
    });
    handleTriggerSystemToast('Cập nhật xử lý ý kiến', `Đã lưu trạng thái xử lý cho ý kiến.`);
  };

  const handleAddTask = (newTask: Task) => {
    setTasks(prev => {
      const next = [newTask, ...prev];
      AppStorageEngine.saveTasks(next);
      return next;
    });
    CloudDatabase.saveTask(newTask);

    // Log action
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      userId: currentStaffUser?.id || 'staff-1',
      userName: currentStaffUser?.fullname || 'Cán bộ MTTQ',
      action: 'TẠO NHIỆM VỤ',
      entity: 'Quản lý Công việc',
      details: `Giao nhiệm vụ: ${newTask.title}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setAuditLogs(prev => {
      const nextLogs = [newLog, ...prev];
      AppStorageEngine.saveAuditLogs(nextLogs);
      return nextLogs;
    });
    CloudDatabase.logAudit(newLog);
    handleTriggerSystemToast('Đã tạo nhiệm vụ', `Đã giao nhiệm vụ "${newTask.title}" vào hệ thống.`);
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => {
      const target = prev.find(t => t.id === taskId);
      if (target) {
        CloudDatabase.saveTask({ ...target, status });
      }
      const next = prev.map(t => t.id === taskId ? { ...t, status } : t);
      AppStorageEngine.saveTasks(next);
      return next;
    });
  };

  const handleAddArticle = async (art: Article) => {
    setArticles(prev => {
      const next = sortArticlesNewestFirst([art, ...prev.filter(a => a.id !== art.id)]);
      AppStorageEngine.saveArticles(next);
      return next;
    });

    const isCloudSaved = await CloudDatabase.saveArticle(art);

    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      userId: currentStaffUser?.id || 'staff-1',
      userName: currentStaffUser?.fullname || 'Cán bộ Tuyên giáo',
      action: 'XUẤT BẢN BÀI VIẾT',
      entity: 'Tin tức - Tuyên truyền',
      details: `Đăng bài viết mới: "${art.title}" (Chuyên mục: ${art.category})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setAuditLogs(prev => {
      const next = [newLog, ...prev];
      AppStorageEngine.saveAuditLogs(next);
      return next;
    });
    CloudDatabase.logAudit(newLog);
    
    if (isCloudSaved) {
      handleTriggerSystemToast('Đã lưu bài viết lên Cloud', `Bài viết "${art.title}" đã được đồng bộ trực tuyến lên Firebase và hiển thị trên mọi máy.`);
    } else {
      handleTriggerSystemToast('Đã lưu bài viết (Cục bộ)', `Bài viết "${art.title}" đã được lưu.`);
    }
  };

  const handleUpdateArticle = async (updatedArt: Article) => {
    setArticles(prev => {
      const next = sortArticlesNewestFirst(prev.map(a => a.id === updatedArt.id ? updatedArt : a));
      AppStorageEngine.saveArticles(next);
      return next;
    });
    const isCloudSaved = await CloudDatabase.saveArticle(updatedArt);

    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      userId: currentStaffUser?.id || 'staff-1',
      userName: currentStaffUser?.fullname || 'Cán bộ Tuyên giáo',
      action: 'CẬP NHẬT BÀI VIẾT',
      entity: 'Tin tức - Tuyên truyền',
      details: `Chỉnh sửa nội dung bài viết: "${updatedArt.title}"`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setAuditLogs(prev => {
      const next = [newLog, ...prev];
      AppStorageEngine.saveAuditLogs(next);
      return next;
    });
    CloudDatabase.logAudit(newLog);
    
    if (isCloudSaved) {
      handleTriggerSystemToast('Đã cập nhật Cloud thành công', `Nội dung bài viết "${updatedArt.title}" đã được đồng bộ trực tuyến.`);
    } else {
      handleTriggerSystemToast('Đã lưu chỉnh sửa', `Nội dung bài viết "${updatedArt.title}" đã được lưu.`);
    }
  };

  const handleDeleteArticle = async (artId: string) => {
    setArticles(prev => {
      const next = prev.filter(a => a.id !== artId);
      AppStorageEngine.saveArticles(next);
      return next;
    });
    await CloudDatabase.deleteArticle(artId);
    handleTriggerSystemToast('Đã xóa bài viết', 'Bài viết đã được xóa và đồng bộ trên tất cả thiết bị.');
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
        'Dự án Firebase mttqphuongchanhhiep-279e1 đang cấu hình giới hạn quyền ghi. Hãy vào Firebase Console > Firestore Database > Rules và chọn Publish: allow read, write: if true;'
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
    handleTriggerSystemToast('Đã ghi nhận bài thi', `Bài dự thi của ${sub.participantName} đã được nộp và lưu trữ.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      
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
              onGoToOffice={() => {
                if (currentStaffUser) {
                  setCurrentSpace('OFFICE');
                } else {
                  setShowStaffLoginPage(true);
                }
              }}
            />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-10">
              {showStaffLoginPage ? (
                <StaffLoginPage
                  staffUsers={staffUsers}
                  onLoginSuccess={(user) => {
                    setCurrentStaffUser(user);
                    setShowStaffLoginPage(false);
                    setCurrentSpace('OFFICE');
                  }}
                  onBack={() => setShowStaffLoginPage(false)}
                />
              ) : selectedArticle ? (
                <ArticleDetailPage
                  article={selectedArticle}
                  allArticles={articles}
                  articles={articles}
                  onBack={() => setSelectedArticle(null)}
                  onSelectArticle={(art) => {
                    setSelectedArticle(art);
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
                    setSelectedDocument(doc);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onBack={() => setSelectedDocument(null)}
                  onDownload={(doc) => {
                    handleTriggerSystemToast('Tải văn bản chính thức', `Hệ thống đang chuẩn bị tệp và tải xuống văn bản số ${doc.codeNumber}...`);
                  }}
                />
              ) : selectedCompetition ? (
                <CompetitionDetailPage
                  competition={selectedCompetition}
                  triviaQuestions={INITIAL_TRIVIA_QUESTIONS}
                  onAddSubmission={handleAddSubmission}
                  onBack={() => setSelectedCompetition(null)}
                />
              ) : (
                <>
                  {portalTab === 'home' && (
                    <>
                      {/* Quick Services Grid - Vibrant Colorful Modern Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <motion.div 
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectPortalTab('opinion')}
                          className="bg-gradient-to-br from-rose-50 via-white to-pink-50/50 p-5 rounded-2xl cursor-pointer hover:shadow-lg transition-all flex items-center justify-between group border border-rose-200/90 shadow-xs"
                        >
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600">Dân sinh & Trợ cấp</span>
                            </div>
                            <h3 className="font-black text-sm text-slate-900 group-hover:text-rose-600 transition-colors">Gửi Ý kiến Dân sinh</h3>
                            <p className="text-xs text-slate-500 mt-0.5 font-medium">Nắm bắt dư luận & trợ cấp</p>
                          </div>
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-600 to-red-600 text-white shadow-md shadow-rose-500/20 group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-5 h-5" />
                          </div>
                        </motion.div>

                        <motion.div 
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectPortalTab('competitions')}
                          className="bg-gradient-to-br from-amber-50 via-white to-orange-50/50 p-5 rounded-2xl cursor-pointer hover:shadow-lg transition-all flex items-center justify-between group border border-amber-200/90 shadow-xs"
                        >
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">Phong trào thi đua</span>
                            </div>
                            <h3 className="font-black text-sm text-slate-900 group-hover:text-amber-700 transition-colors">Hội thi Trực tuyến</h3>
                            <p className="text-xs text-slate-500 mt-0.5 font-medium">Thi trắc nghiệm & giải thưởng</p>
                          </div>
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-5 h-5" />
                          </div>
                        </motion.div>

                        <motion.div 
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectPortalTab('documents')}
                          className="bg-gradient-to-br from-blue-50 via-white to-sky-50/50 p-5 rounded-2xl cursor-pointer hover:shadow-lg transition-all flex items-center justify-between group border border-blue-200/90 shadow-xs"
                        >
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">Tra cứu số hóa</span>
                            </div>
                            <h3 className="font-black text-sm text-slate-900 group-hover:text-blue-700 transition-colors">Kho Văn bản Mặt trận</h3>
                            <p className="text-xs text-slate-500 mt-0.5 font-medium">Kế hoạch & quyết định mới</p>
                          </div>
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
                            <FileText className="w-5 h-5" />
                          </div>
                        </motion.div>

                        <motion.div 
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (currentStaffUser) {
                              setCurrentSpace('OFFICE');
                            } else {
                              setShowStaffLoginPage(true);
                            }
                          }}
                          className="bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 p-5 rounded-2xl cursor-pointer hover:shadow-lg transition-all flex items-center justify-between group border border-emerald-200/90 shadow-xs"
                        >
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Không gian điều hành</span>
                            </div>
                            <h3 className="font-black text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">Văn phòng Số Cán bộ</h3>
                            <p className="text-xs text-slate-500 mt-0.5 font-medium">
                              {currentStaffUser ? `Đang đăng nhập: ${currentStaffUser.fullname}` : 'Đăng nhập bảo mật & quản trị'}
                            </p>
                          </div>
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                        </motion.div>
                      </div>

                      <HeroCarousel articles={articles} onSelectArticle={(art) => setSelectedArticle(art)} />

                      <NewsSection
                        articles={articles}
                        searchQuery={searchQuery}
                        onSelectArticle={(art) => setSelectedArticle(art)}
                        onGoToOpinion={() => setPortalTab('opinion')}
                      />
                      <WorkCalendarSection events={events} />
                      <DocumentsSection
                        documents={documents}
                        onSelectDocument={(doc) => setSelectedDocument(doc)}
                      />
                    </>
                  )}

                  {portalTab === 'news' && (
                    <NewsSection
                      articles={articles}
                      searchQuery={searchQuery}
                      onSelectArticle={(art) => setSelectedArticle(art)}
                      onGoToOpinion={() => setPortalTab('opinion')}
                    />
                  )}
                  {portalTab === 'documents' && (
                    <DocumentsSection
                      documents={documents}
                      onSelectDocument={(doc) => setSelectedDocument(doc)}
                    />
                  )}
                  {portalTab === 'competitions' && (
                    <CompetitionsSection
                      competitions={competitions}
                      onSelectCompetition={(comp) => setSelectedCompetition(comp)}
                    />
                  )}
                  {portalTab === 'opinion' && (
                    <OpinionFormSection opinions={opinions} onSubmitOpinion={handleAddOpinion} />
                  )}
                </>
              )}
            </main>

            <Footer />
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
                onGoToOffice={() => setShowStaffLoginPage(true)}
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
              <Footer />
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
                  setOfficeView(view);
                  setIsMobileOfficeSidebarOpen(false);
                }}
                onGoToPortal={() => setCurrentSpace('PORTAL')}
                onLogout={() => {
                  setCurrentStaffUser(null);
                  setCurrentSpace('PORTAL');
                }}
                staffName={currentStaffUser?.fullname || ''}
                staffRole={currentStaffUser?.role || ''}
                staffAvatar={currentStaffUser?.avatar}
                isMobileOpen={isMobileOfficeSidebarOpen}
                onCloseMobile={() => setIsMobileOfficeSidebarOpen(false)}
              />

              <div className="flex-1 flex flex-col overflow-y-auto">
                <DigitalOfficeHeader
                  staffName={currentStaffUser?.fullname || ''}
                  staffPosition={currentStaffUser?.position || ''}
                  staffAvatar={currentStaffUser?.avatar}
                  staffRole={currentStaffUser?.role || 'STAFF'}
                  staffEmail={currentStaffUser?.email}
                  staffDepartment={currentStaffUser?.department}
                  onNavigate={(view) => setOfficeView(view)}
                  onOpenProfile={() => setOfficeView('profile')}
                  onOpenAi={() => setOfficeView('ai_assistant')}
                  onGoToPortal={() => setCurrentSpace('PORTAL')}
                  onForceCloudSync={handleForceCloudSync}
                  onToggleMobileSidebar={() => setIsMobileOfficeSidebarOpen(true)}
                  onLogout={async () => {
                    try {
                      await signOut(auth);
                    } catch (e) {
                      console.error('SignOut error:', e);
                    }
                    setCurrentStaffUser(null);
                    AppStorageEngine.saveCurrentUser(null);
                    setCurrentSpace('PORTAL');
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
                        tasksCount={(tasks || []).length}
                        completedTasksCount={(tasks || []).filter(t => t && t.status === 'DONE').length}
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

                    {officeView === 'neighborhood_map' && (
                      <NeighborhoodMapDashboard
                        opinions={opinions}
                        onSelectNeighborhoodOpinions={() => {
                          setOfficeView('opinions');
                        }}
                      />
                    )}

                    {officeView === 'tasks' && (
                      <TaskManagementView
                        tasks={tasks}
                        onAddTask={handleAddTask}
                        onUpdateTaskStatus={handleUpdateTaskStatus}
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
                        onOpenAiSummary={() => setOfficeView('ai_assistant')}
                      />
                    )}

                    {(officeView === 'cms' || officeView === 'cms_articles') && (
                      <CmsAdminView
                        articles={articles}
                        documents={documents}
                        competitions={competitions}
                        opinions={opinions}
                        initialTab="ARTICLES"
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

                    {officeView === 'cms_documents' && (
                      <CmsAdminView
                        articles={articles}
                        documents={documents}
                        competitions={competitions}
                        opinions={opinions}
                        initialTab="DOCUMENTS"
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

                    {officeView === 'calendar' && (
                      <WorkCalendarView
                        events={events}
                        onAddEvent={(ev) => {
                          setEvents(prev => {
                            const next = [ev, ...prev];
                            AppStorageEngine.saveEvents(next);
                            return next;
                          });
                          CloudDatabase.saveEvent(ev);
                          handleTriggerSystemToast('Đã lưu lịch công tác', `Lịch sự kiện "${ev.title}" đã được lưu trữ.`);
                        }}
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
                              const next = prev.map(s => s.id === id ? { ...s, score, adminComment: comment, status: 'GRADED' } : s);
                              AppStorageEngine.saveSubmissions(next);
                              return next;
                            });
                            handleTriggerSystemToast('Đã chấm điểm bài thi', 'Điểm và nhận xét bài thi đã được lưu trữ.');
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
                              const next = prev.map(s => s.id === id ? { ...s, score, adminComment: comment, status: 'GRADED' } : s);
                              AppStorageEngine.saveSubmissions(next);
                              return next;
                            });
                            handleTriggerSystemToast('Đã chấm điểm bài thi', 'Điểm và nhận xét bài thi đã được lưu trữ.');
                          }}
                          onSelectCompetitionDetail={(id) => setActiveCompetitionId(id)}
                          onRestoreDefaultBanners={handleRestoreDefaultBanners}
                        />
                      )
                    )}

                    {officeView === 'users' && (
                      <StaffUsersAdminView
                        staffUsers={staffUsers}
                        currentStaffUser={currentStaffUser}
                        onToggleUserActive={(id) => {
                          setStaffUsers(prev => {
                            const next = prev.map(u => {
                              if (u.id === id) {
                                const updated = { ...u, active: !u.active };
                                CloudDatabase.saveStaffUser(updated);
                                return updated;
                              }
                              return u;
                            });
                            AppStorageEngine.saveStaffUsers(next);
                            return next;
                          });
                        }}
                        onAddUser={(u) => {
                          setStaffUsers(prev => {
                            const next = [...prev, u];
                            AppStorageEngine.saveStaffUsers(next);
                            return next;
                          });
                          CloudDatabase.saveStaffUser(u);
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
                          handleTriggerSystemToast('Đã cập nhật cán bộ', `Thông tin cán bộ ${updatedUser.fullname} đã được lưu trữ.`);
                        }}
                        onDeleteUser={(id) => {
                          setStaffUsers(prev => {
                            const next = prev.filter(u => u.id !== id);
                            AppStorageEngine.saveStaffUsers(next);
                            return next;
                          });
                          CloudDatabase.deleteStaffUser(id);
                          handleTriggerSystemToast('Đã xóa cán bộ', 'Tài khoản cán bộ đã được xóa khỏi hệ thống.');
                        }}
                      />
                    )}

                    {officeView === 'analytics' && (
                      <AnalyticsDashboardView
                        articlesCount={(articles || []).length}
                        documentsCount={(documents || []).length}
                        opinionsCount={(opinions || []).length}
                        tasksCount={(tasks || []).length}
                        completedTasksCount={(tasks || []).filter(t => t && t.status === 'DONE').length}
                        opinions={opinions || []}
                        onNavigateToOpinions={() => setOfficeView('opinions')}
                        onUpdateOpinionStatus={handleUpdateOpinionStatus}
                      />
                    )}

                    {officeView === 'audit_logs' && <AuditLogsView logs={auditLogs} />}
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
        }}
        onLoginSuccess={(user) => {
          setCurrentStaffUser(user);
          AppStorageEngine.saveCurrentUser(user);
          CloudDatabase.saveStaffUser(user);
          setIsLocked(false);
          setCurrentSpace('OFFICE');
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
    </div>
  );
}

