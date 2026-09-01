import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { AppStorageEngine } from './storage';
import {
  INITIAL_ARTICLES,
  INITIAL_DOCUMENTS,
  INITIAL_COMPETITIONS,
  INITIAL_PUBLIC_OPINIONS,
  INITIAL_TASKS,
  INITIAL_EVENTS,
  INITIAL_NOTES,
  INITIAL_TEMPLATES,
  INITIAL_DRIVE_FILES,
  INITIAL_STAFF_USERS,
  INITIAL_AUDIT_LOGS
} from '../data/seedData';
import {
  Article,
  OfficialDocument,
  Competition,
  CompetitionSubmission,
  PublicOpinion,
  Task,
  WorkEvent,
  Note,
  TemplateDoc,
  DriveFileItem,
  StaffUser,
  AuditLog,
  AiChatLog,
  KnowledgeNote
} from '../types';
import {
  sortArticlesNewestFirst,
  sortDocumentsNewestFirst,
  sortCompetitionsNewestFirst,
  sortOpinionsNewestFirst,
  sortEventsNewestFirst
} from './dateUtils';

function cleanFirestoreData(data: any): any {
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(cleanFirestoreData);
  }
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      cleaned[key] = cleanFirestoreData(value);
    }
  }
  return cleaned;
}

export const FirestoreCollections = {
  ARTICLES: 'articles',
  DOCUMENTS: 'documents',
  COMPETITIONS: 'competitions',
  OPINIONS: 'publicOpinions',
  TASKS: 'tasks',
  EVENTS: 'events',
  NOTES: 'notes',
  TEMPLATES: 'templates',
  SUBMISSIONS: 'competitionSubmissions',
  DRIVE_FILES: 'driveFiles',
  STAFF_USERS: 'staffUsers',
  AUDIT_LOGS: 'auditLogs',
  SETTINGS: 'settings',
  AI_CHATS: 'aiChats',
  KNOWLEDGE_NOTES: 'knowledgeNotes'
};

class CloudSyncService {
  private isInitialized = false;
  private isConnected = false;
  private syncListeners: Array<() => void> = [];

  // Call on app startup
  async initCloudDatabase(
    callbacks: {
      onArticlesUpdate?: (articles: Article[]) => void;
      onDocumentsUpdate?: (docs: OfficialDocument[]) => void;
      onOpinionsUpdate?: (opinions: PublicOpinion[]) => void;
      onCompetitionsUpdate?: (comps: Competition[]) => void;
      onTasksUpdate?: (tasks: Task[]) => void;
      onEventsUpdate?: (events: WorkEvent[]) => void;
      onNotesUpdate?: (notes: Note[]) => void;
      onTemplatesUpdate?: (templates: TemplateDoc[]) => void;
      onStaffUsersUpdate?: (users: StaffUser[]) => void;
      onAuditLogsUpdate?: (logs: AuditLog[]) => void;
      onAiChatsUpdate?: (chats: AiChatLog[]) => void;
      onKnowledgeNotesUpdate?: (notes: KnowledgeNote[]) => void;
    }
  ) {
    if (this.isInitialized) return;
    this.isInitialized = true;

    try {
      // 1. Initial check & auto-seed if cloud database is empty, plus purge demo articles
      await this.ensureSeedData();
      await this.purgeDemoArticles();
      await this.pullCloudToLocal();
      this.isConnected = true;

      // 2. Setup Realtime Listeners with Firestore as Master Source of Truth
      
      // Articles Listener
      if (callbacks.onArticlesUpdate) {
        const unsub = onSnapshot(collection(db, FirestoreCollections.ARTICLES), (snapshot) => {
          const demoIds = new Set(['art-1', 'art-2', 'art-3', 'art-4', 'art-5', 'art-6', 'art-7', 'art-8']);
          const remoteArticles: Article[] = snapshot.docs
            .map(d => ({ ...(d.data() as Article), id: d.id }))
            .filter(a => a && a.id && !demoIds.has(a.id) && !a.slug?.startsWith('khu-pho-8-ban-giao-nha') && !a.title?.includes('Khu phố 8 bàn giao nhà Đại đoàn kết'));
          
          const sorted = sortArticlesNewestFirst(remoteArticles);
          AppStorageEngine.saveArticles(sorted);
          callbacks.onArticlesUpdate?.(sorted);
        }, (err) => {
          console.warn('[Firestore] Articles sync error:', err);
        });
        this.syncListeners.push(unsub);
      }

      // Documents Listener
      if (callbacks.onDocumentsUpdate) {
        const unsub = onSnapshot(collection(db, FirestoreCollections.DOCUMENTS), (snapshot) => {
          const demoIds = new Set(['doc-1', 'doc-2', 'doc-3', 'doc-4']);

          // Purge demo documents from Firestore Cloud if present
          snapshot.docs.forEach(d => {
            if (demoIds.has(d.id)) {
              deleteDoc(doc(db, FirestoreCollections.DOCUMENTS, d.id)).catch(console.warn);
            }
          });

          const remoteDocs: OfficialDocument[] = snapshot.docs
            .map(d => ({ ...(d.data() as OfficialDocument), id: d.id }))
            .filter(d => d && d.id && !demoIds.has(d.id));

          const sorted = sortDocumentsNewestFirst(remoteDocs);
          AppStorageEngine.saveDocuments(sorted);
          callbacks.onDocumentsUpdate?.(sorted);
        }, (err) => {
          console.warn('[Firestore] Documents sync error:', err);
        });
        this.syncListeners.push(unsub);
      }

      // Opinions Listener
      if (callbacks.onOpinionsUpdate) {
        const unsub = onSnapshot(collection(db, FirestoreCollections.OPINIONS), (snapshot) => {
          const remoteOps: PublicOpinion[] = snapshot.docs
            .map(d => ({ ...(d.data() as PublicOpinion), id: d.id }))
            .filter(o => o && o.id);
          
          const sorted = sortOpinionsNewestFirst(remoteOps);
          AppStorageEngine.saveOpinions(sorted);
          callbacks.onOpinionsUpdate?.(sorted);
        }, (err) => {
          console.warn('[Firestore] Opinions sync error:', err);
        });
        this.syncListeners.push(unsub);
      }

      // Competitions Listener
      if (callbacks.onCompetitionsUpdate) {
        const unsub = onSnapshot(collection(db, FirestoreCollections.COMPETITIONS), (snapshot) => {
          const remoteComps: Competition[] = snapshot.docs
            .map(d => ({ ...(d.data() as Competition), id: d.id }))
            .filter(c => c && c.id);
          
          const sorted = sortCompetitionsNewestFirst(remoteComps);
          AppStorageEngine.saveCompetitions(sorted);
          callbacks.onCompetitionsUpdate?.(sorted);
        }, (err) => {
          console.warn('[Firestore] Competitions sync error:', err);
        });
        this.syncListeners.push(unsub);
      }

      // Tasks Listener
      if (callbacks.onTasksUpdate) {
        const unsub = onSnapshot(collection(db, FirestoreCollections.TASKS), (snapshot) => {
          const remoteTasks: Task[] = snapshot.docs
            .map(d => ({ ...(d.data() as Task), id: d.id }))
            .filter(t => t && t.id);
          
          AppStorageEngine.saveTasks(remoteTasks);
          callbacks.onTasksUpdate?.(remoteTasks);
        }, (err) => {
          console.warn('[Firestore] Tasks sync error:', err);
        });
        this.syncListeners.push(unsub);
      }

      // Events Listener
      if (callbacks.onEventsUpdate) {
        const unsub = onSnapshot(collection(db, FirestoreCollections.EVENTS), (snapshot) => {
          const remoteEvents: WorkEvent[] = snapshot.docs
            .map(d => ({ ...(d.data() as WorkEvent), id: d.id }))
            .filter(e => e && e.id);
          
          const sorted = sortEventsNewestFirst(remoteEvents);
          AppStorageEngine.saveEvents(sorted);
          callbacks.onEventsUpdate?.(sorted);
        }, (err) => {
          console.warn('[Firestore] Events sync error:', err);
        });
        this.syncListeners.push(unsub);
      }

      // Notes Listener
      if (callbacks.onNotesUpdate) {
        const unsub = onSnapshot(collection(db, FirestoreCollections.NOTES), (snapshot) => {
          const remoteNotes: Note[] = snapshot.docs
            .map(d => ({ ...(d.data() as Note), id: d.id }))
            .filter(n => n && n.id);
          
          AppStorageEngine.saveNotes(remoteNotes);
          callbacks.onNotesUpdate?.(remoteNotes);
        }, (err) => {
          console.warn('[Firestore] Notes sync error:', err);
        });
        this.syncListeners.push(unsub);
      }

      // Staff Users Listener
      if (callbacks.onStaffUsersUpdate) {
        const unsub = onSnapshot(collection(db, FirestoreCollections.STAFF_USERS), (snapshot) => {
          try {
            const remoteStaff: StaffUser[] = snapshot.docs
              .map(d => ({ ...(d.data() as StaffUser), id: d.id }))
              .filter(u => u && u.id);

            AppStorageEngine.saveStaffUsers(remoteStaff);
            callbacks.onStaffUsersUpdate?.(remoteStaff);
          } catch (syncErr) {
            console.error('[Firestore] Error in staff users sync:', syncErr);
            const fallbackStaff = AppStorageEngine.getStaffUsers();
            callbacks.onStaffUsersUpdate?.(fallbackStaff);
          }
        }, (err) => {
          console.warn('[Firestore] Staff users sync error, using local persistence:', err);
          const fallbackStaff = AppStorageEngine.getStaffUsers();
          callbacks.onStaffUsersUpdate?.(fallbackStaff);
        });
        this.syncListeners.push(unsub);
      }

      // Audit Logs Listener
      if (callbacks.onAuditLogsUpdate) {
        const unsub = onSnapshot(collection(db, FirestoreCollections.AUDIT_LOGS), (snapshot) => {
          const remoteLogs: AuditLog[] = snapshot.docs
            .map(d => ({ ...(d.data() as AuditLog), id: d.id }))
            .filter(l => l && l.id);
          
          remoteLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          AppStorageEngine.saveAuditLogs(remoteLogs);
          callbacks.onAuditLogsUpdate?.(remoteLogs);
        }, (err) => {
          console.warn('[Firestore] Audit logs sync error:', err);
        });
        this.syncListeners.push(unsub);
      }

      // AI Chats Listener
      if (callbacks.onAiChatsUpdate) {
        const unsub = onSnapshot(collection(db, FirestoreCollections.AI_CHATS), (snapshot) => {
          const remoteChats: AiChatLog[] = snapshot.docs
            .map(d => ({ ...(d.data() as AiChatLog), id: d.id }))
            .filter(c => c && c.id);
          
          remoteChats.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          AppStorageEngine.saveAiChats(remoteChats);
          callbacks.onAiChatsUpdate?.(remoteChats);
        }, (err) => {
          console.warn('[Firestore] AI Chats sync error:', err);
        });
        this.syncListeners.push(unsub);
      }

      // Knowledge Notes Listener
      if (callbacks.onKnowledgeNotesUpdate) {
        const unsub = onSnapshot(collection(db, FirestoreCollections.KNOWLEDGE_NOTES), (snapshot) => {
          const remoteNotes: KnowledgeNote[] = snapshot.docs
            .map(d => ({ ...(d.data() as KnowledgeNote), id: d.id }))
            .filter(n => n && n.id);
          
          AppStorageEngine.saveKnowledgeNotes(remoteNotes);
          callbacks.onKnowledgeNotesUpdate?.(remoteNotes);
        }, (err) => {
          console.warn('[Firestore] Knowledge Notes sync error:', err);
        });
        this.syncListeners.push(unsub);
      }

      // 3. Database successfully initialized. Clients will listen to real-time cloud updates.
      // A manual cloud sync is still available via the UI's "Đồng bộ Cloud" button if needed.

    } catch (err) {
      console.error('[Firestore] Initialization error:', err);
      this.isConnected = false;
    }
  }

  // Purge any legacy built-in demo articles from Cloud Firestore
  public async purgeDemoArticles() {
    try {
      const demoArticleIds = ['art-1', 'art-2', 'art-3', 'art-4', 'art-5', 'art-6', 'art-7', 'art-8'];
      const demoTitles = [
        'Phường Chánh Hiệp tổ chức Ngày hội Đại đoàn kết toàn dân tộc',
        'Kế hoạch chăm lo Tết Ất Tỵ cho các hộ có hoàn cảnh khó khăn',
        'Giám sát công tác quản lý trật tự đô thị và vệ sinh môi trường',
        'Đẩy mạnh Học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh',
        'Khu phố 8 bàn giao nhà Đại đoàn kết cho hộ gia đình khó khăn về nhà ở',
        'Phát động Cuộc thi tuyến đường "Sáng - Xanh - Sạch - Đẹp - An toàn"',
        'Không gian văn hóa Hồ Chí Minh - Điểm hội tụ tình cảm Bác Hồ',
        'Nhân rộng các mô hình "Dân vận khéo" làm theo Bác trong chăm lo an sinh xã hội'
      ];

      for (const artId of demoArticleIds) {
        try {
          await deleteDoc(doc(db, FirestoreCollections.ARTICLES, artId));
        } catch (e) {
          // ignore
        }
      }

      const articlesSnap = await getDocs(collection(db, FirestoreCollections.ARTICLES));
      for (const d of articlesSnap.docs) {
        const data = d.data();
        if (
          demoArticleIds.includes(d.id) ||
          demoTitles.some(dt => data.title?.includes(dt)) ||
          data.slug?.startsWith('khu-pho-8-ban-giao-nha') ||
          data.title?.includes('Khu phố 8 bàn giao nhà Đại đoàn kết')
        ) {
          console.log('[Firestore] Purging demo article from Cloud:', d.id, data.title);
          try {
            await deleteDoc(doc(db, FirestoreCollections.ARTICLES, d.id));
          } catch (e) {
            // ignore
          }
        }
      }
    } catch (err) {
      console.warn('[Firestore] Purge demo articles error:', err);
    }
  }

  // Seed Firestore only if never initialized before or ensure all initial competitions exist
  private async ensureSeedData() {
    try {
      // Always ensure all initial competitions exist in Firestore
      const initialComps = AppStorageEngine.getCompetitions();
      for (const comp of initialComps) {
        const compDoc = doc(db, FirestoreCollections.COMPETITIONS, comp.id);
        await setDoc(compDoc, cleanFirestoreData(comp), { merge: true });
      }

      const stateDocRef = doc(db, 'settings', 'app_state');
      const stateDocSnap = await getDoc(stateDocRef);

      if (stateDocSnap.exists() && stateDocSnap.data()?.isSeeded) {
        // Already initialized and seeded before. Firestore is master source of truth.
        return;
      }

      const articlesSnap = await getDocs(collection(db, FirestoreCollections.ARTICLES));
      if (articlesSnap.empty) {
        console.log('[Firestore] Database is empty. Seeding initial data to Firebase Cloud Firestore (mttqphuongchanhhiep-279e1)...');
        
        // Batch seed articles
        const initialArticles = AppStorageEngine.getArticles();
        for (const art of initialArticles) {
          const artDoc = doc(db, FirestoreCollections.ARTICLES, art.id);
          await setDoc(artDoc, cleanFirestoreData(art), { merge: true });
        }

        // Batch seed documents
        const initialDocs = AppStorageEngine.getDocuments();
        for (const docItem of initialDocs) {
          const dDoc = doc(db, FirestoreCollections.DOCUMENTS, docItem.id);
          await setDoc(dDoc, cleanFirestoreData(docItem), { merge: true });
        }

        // Batch seed public opinions
        const initialOpinions = AppStorageEngine.getOpinions();
        for (const op of initialOpinions) {
          const opDoc = doc(db, FirestoreCollections.OPINIONS, op.id);
          await setDoc(opDoc, cleanFirestoreData(op), { merge: true });
        }

        // Batch seed competitions
        for (const comp of initialComps) {
          const compDoc = doc(db, FirestoreCollections.COMPETITIONS, comp.id);
          await setDoc(compDoc, cleanFirestoreData(comp), { merge: true });
        }

        // Batch seed staff
        const initialStaff = AppStorageEngine.getStaffUsers();
        for (const st of initialStaff) {
          const stDoc = doc(db, FirestoreCollections.STAFF_USERS, st.id);
          await setDoc(stDoc, cleanFirestoreData(st), { merge: true });
        }

        // Batch seed tasks
        const initialTasks = AppStorageEngine.getTasks();
        for (const t of initialTasks) {
          const tDoc = doc(db, FirestoreCollections.TASKS, t.id);
          await setDoc(tDoc, cleanFirestoreData(t), { merge: true });
        }

        // Batch seed events
        const initialEvents = AppStorageEngine.getEvents();
        for (const ev of initialEvents) {
          const evDoc = doc(db, FirestoreCollections.EVENTS, ev.id);
          await setDoc(evDoc, cleanFirestoreData(ev), { merge: true });
        }

        // Mark as seeded so future deletions are never resurrected
        await setDoc(stateDocRef, cleanFirestoreData({
          isSeeded: true,
          seededAt: new Date().toISOString(),
          app: 'MTTQ Phường Chánh Hiệp'
        }), { merge: true });

        console.log('[Firestore] Seed complete. Cloud database is ready and active!');
      } else {
        // Mark as seeded
        await setDoc(stateDocRef, cleanFirestoreData({
          isSeeded: true,
          seededAt: new Date().toISOString(),
          app: 'MTTQ Phường Chánh Hiệp'
        }), { merge: true });
      }
    } catch (err) {
      console.warn('[Firestore] Error during ensureSeedData:', err);
    }
  }

  // --- WRITE METHODS (Sync immediately to Cloud Firestore + LocalStorage) ---

  // Articles
  async saveArticle(article: Article): Promise<boolean> {
    try {
      const artDoc = doc(db, FirestoreCollections.ARTICLES, article.id);
      await setDoc(artDoc, cleanFirestoreData(article), { merge: true });
      return true;
    } catch (err) {
      console.error('[Firestore] Error saving article:', err);
      return false;
    }
  }

  async deleteArticle(articleId: string): Promise<boolean> {
    try {
      const artDoc = doc(db, FirestoreCollections.ARTICLES, articleId);
      await deleteDoc(artDoc);
      return true;
    } catch (err) {
      console.error('[Firestore] Error deleting article:', err);
      return false;
    }
  }

  // AI Chat Logs
  async saveAiChat(chat: AiChatLog): Promise<boolean> {
    try {
      const cDoc = doc(db, FirestoreCollections.AI_CHATS, chat.id);
      await setDoc(cDoc, cleanFirestoreData(chat), { merge: true });
      return true;
    } catch (err) {
      console.error('[Firestore] Error saving AI chat:', err);
      return false;
    }
  }

  // Knowledge Notes
  async saveKnowledgeNote(note: KnowledgeNote): Promise<boolean> {
    try {
      const nDoc = doc(db, FirestoreCollections.KNOWLEDGE_NOTES, note.id);
      await setDoc(nDoc, cleanFirestoreData(note), { merge: true });
      return true;
    } catch (err) {
      console.error('[Firestore] Error saving knowledge note:', err);
      return false;
    }
  }

  async deleteKnowledgeNote(noteId: string): Promise<boolean> {
    try {
      const nDoc = doc(db, FirestoreCollections.KNOWLEDGE_NOTES, noteId);
      await deleteDoc(nDoc);
      return true;
    } catch (err) {
      console.error('[Firestore] Error deleting knowledge note:', err);
      return false;
    }
  }

  // Documents
  async saveDocument(docItem: OfficialDocument): Promise<boolean> {
    try {
      const dDoc = doc(db, FirestoreCollections.DOCUMENTS, docItem.id);
      await setDoc(dDoc, cleanFirestoreData(docItem), { merge: true });
      return true;
    } catch (err) {
      console.error('[Firestore] Error saving document:', err);
      return false;
    }
  }

  async deleteDocument(docId: string): Promise<boolean> {
    try {
      const dDoc = doc(db, FirestoreCollections.DOCUMENTS, docId);
      await deleteDoc(dDoc);
      return true;
    } catch (err) {
      console.error('[Firestore] Error deleting document:', err);
      return false;
    }
  }

  // Public Opinions
  async saveOpinion(opinion: PublicOpinion): Promise<void> {
    try {
      const opDoc = doc(db, FirestoreCollections.OPINIONS, opinion.id);
      await setDoc(opDoc, cleanFirestoreData(opinion), { merge: true });
    } catch (err) {
      console.error('[Firestore] Error saving opinion:', err);
    }
  }

  async deleteOpinion(opinionId: string): Promise<void> {
    try {
      const opDoc = doc(db, FirestoreCollections.OPINIONS, opinionId);
      await deleteDoc(opDoc);
    } catch (err) {
      console.error('[Firestore] Error deleting opinion:', err);
    }
  }

  // Competitions
  async saveCompetition(comp: Competition): Promise<void> {
    try {
      const compDoc = doc(db, FirestoreCollections.COMPETITIONS, comp.id);
      await setDoc(compDoc, cleanFirestoreData(comp), { merge: true });
    } catch (err) {
      console.error('[Firestore] Error saving competition:', err);
    }
  }

  // Tasks
  async saveTask(task: Task): Promise<void> {
    try {
      const tDoc = doc(db, FirestoreCollections.TASKS, task.id);
      await setDoc(tDoc, cleanFirestoreData(task), { merge: true });
    } catch (err) {
      console.error('[Firestore] Error saving task:', err);
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      const tDoc = doc(db, FirestoreCollections.TASKS, taskId);
      await deleteDoc(tDoc);
    } catch (err) {
      console.error('[Firestore] Error deleting task:', err);
    }
  }

  // Events
  async saveEvent(event: WorkEvent): Promise<void> {
    try {
      const evDoc = doc(db, FirestoreCollections.EVENTS, event.id);
      await setDoc(evDoc, cleanFirestoreData(event), { merge: true });
    } catch (err) {
      console.error('[Firestore] Error saving event:', err);
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      const evDoc = doc(db, FirestoreCollections.EVENTS, eventId);
      await deleteDoc(evDoc);
    } catch (err) {
      console.error('[Firestore] Error deleting event:', err);
    }
  }

  // Notes
  async saveNote(note: Note): Promise<void> {
    try {
      const nDoc = doc(db, FirestoreCollections.NOTES, note.id);
      await setDoc(nDoc, cleanFirestoreData(note), { merge: true });
    } catch (err) {
      console.error('[Firestore] Error saving note:', err);
    }
  }

  async deleteNote(noteId: string): Promise<void> {
    try {
      const nDoc = doc(db, FirestoreCollections.NOTES, noteId);
      await deleteDoc(nDoc);
    } catch (err) {
      console.error('[Firestore] Error deleting note:', err);
    }
  }

  // Staff Users
  async saveStaffUser(user: StaffUser): Promise<void> {
    try {
      const uDoc = doc(db, FirestoreCollections.STAFF_USERS, user.id);
      await setDoc(uDoc, cleanFirestoreData(user), { merge: true });
    } catch (err) {
      console.error('[Firestore] Error saving staff user:', err);
    }
  }

  async deleteStaffUser(userId: string): Promise<void> {
    try {
      const current = AppStorageEngine.getStaffUsers();
      const updated = current.filter(u => u.id !== userId);
      AppStorageEngine.saveStaffUsers(updated);
      const uDoc = doc(db, FirestoreCollections.STAFF_USERS, userId);
      await deleteDoc(uDoc);
    } catch (err) {
      console.error('[Firestore] Error deleting staff user:', err);
    }
  }

  // Audit Logs
  async logAudit(log: AuditLog): Promise<void> {
    try {
      const lDoc = doc(db, FirestoreCollections.AUDIT_LOGS, log.id);
      await setDoc(lDoc, cleanFirestoreData(log), { merge: true });
    } catch (err) {
      console.error('[Firestore] Error saving audit log:', err);
    }
  }

  // Pull all cloud data to local storage (cross-device sync for mobile/PC)
  async pullCloudToLocal(): Promise<boolean> {
    try {
      console.log('[Firestore] Pulling all cloud data to local storage...');
      const articlesSnap = await getDocs(collection(db, FirestoreCollections.ARTICLES));
      if (!articlesSnap.empty) {
        const remoteArticles = articlesSnap.docs.map(d => ({ ...(d.data() as Article), id: d.id }));
        AppStorageEngine.saveArticles(sortArticlesNewestFirst(remoteArticles));
      }

      const docsSnap = await getDocs(collection(db, FirestoreCollections.DOCUMENTS));
      if (!docsSnap.empty) {
        const remoteDocs = docsSnap.docs.map(d => ({ ...(d.data() as OfficialDocument), id: d.id }));
        AppStorageEngine.saveDocuments(sortDocumentsNewestFirst(remoteDocs));
      }

      const opsSnap = await getDocs(collection(db, FirestoreCollections.OPINIONS));
      if (!opsSnap.empty) {
        const remoteOps = opsSnap.docs.map(d => ({ ...(d.data() as PublicOpinion), id: d.id }));
        AppStorageEngine.saveOpinions(sortOpinionsNewestFirst(remoteOps));
      }

      const staffSnap = await getDocs(collection(db, FirestoreCollections.STAFF_USERS));
      if (!staffSnap.empty) {
        const remoteStaff = staffSnap.docs.map(d => ({ ...(d.data() as StaffUser), id: d.id }));
        AppStorageEngine.saveStaffUsers(remoteStaff);

        const current = AppStorageEngine.getCurrentUser();
        if (current) {
          const matched = remoteStaff.find(u => u.id === current.id || u.email.toLowerCase() === current.email.toLowerCase());
          if (matched) {
            AppStorageEngine.saveCurrentUser(matched);
          }
        }
      }

      const tasksSnap = await getDocs(collection(db, FirestoreCollections.TASKS));
      if (!tasksSnap.empty) {
        AppStorageEngine.saveTasks(tasksSnap.docs.map(d => ({ ...(d.data() as Task), id: d.id })));
      }

      const eventsSnap = await getDocs(collection(db, FirestoreCollections.EVENTS));
      if (!eventsSnap.empty) {
        AppStorageEngine.saveEvents(sortEventsNewestFirst(eventsSnap.docs.map(d => ({ ...(d.data() as WorkEvent), id: d.id }))));
      }

      const notesSnap = await getDocs(collection(db, FirestoreCollections.NOTES));
      if (!notesSnap.empty) {
        AppStorageEngine.saveNotes(notesSnap.docs.map(d => ({ ...(d.data() as Note), id: d.id })));
      }

      const compsSnap = await getDocs(collection(db, FirestoreCollections.COMPETITIONS));
      if (!compsSnap.empty) {
        AppStorageEngine.saveCompetitions(sortCompetitionsNewestFirst(compsSnap.docs.map(d => ({ ...(d.data() as Competition), id: d.id }))));
      }

      const chatsSnap = await getDocs(collection(db, FirestoreCollections.AI_CHATS));
      if (!chatsSnap.empty) {
        const remoteChats = chatsSnap.docs.map(d => ({ ...(d.data() as AiChatLog), id: d.id }));
        remoteChats.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        AppStorageEngine.saveAiChats(remoteChats);
      }

      const knowledgeSnap = await getDocs(collection(db, FirestoreCollections.KNOWLEDGE_NOTES));
      if (!knowledgeSnap.empty) {
        AppStorageEngine.saveKnowledgeNotes(knowledgeSnap.docs.map(d => ({ ...(d.data() as KnowledgeNote), id: d.id })));
      }

      return true;
    } catch (err) {
      console.error('[Firestore] Error pulling cloud to local:', err);
      return false;
    }
  }

  // Force Full Sync: push all current local items to Firestore
  async pushAllLocalToCloud(): Promise<{ success: boolean; isPermissionError?: boolean; error?: string }> {
    try {
      console.log('[Firestore] Pushing all local data to Cloud Firestore...');
      let hasPermissionError = false;

      const pushCollection = async <T extends { id: string }>(collName: string, items: T[]) => {
        for (const item of items) {
          try {
            await setDoc(doc(db, collName, item.id), item, { merge: true });
          } catch (err: any) {
            if (err?.code === 'permission-denied' || (err?.message && err.message.includes('permission'))) {
              hasPermissionError = true;
            }
            console.warn(`[Firestore] Sync skipped for ${collName}/${item.id}:`, err?.message || err);
          }
        }
      };

      await pushCollection(FirestoreCollections.ARTICLES, AppStorageEngine.getArticles());
      await pushCollection(FirestoreCollections.DOCUMENTS, AppStorageEngine.getDocuments());
      await pushCollection(FirestoreCollections.OPINIONS, AppStorageEngine.getOpinions());
      await pushCollection(FirestoreCollections.TASKS, AppStorageEngine.getTasks());
      await pushCollection(FirestoreCollections.EVENTS, AppStorageEngine.getEvents());
      await pushCollection(FirestoreCollections.NOTES, AppStorageEngine.getNotes());
      await pushCollection(FirestoreCollections.COMPETITIONS, AppStorageEngine.getCompetitions());
      await pushCollection(FirestoreCollections.STAFF_USERS, AppStorageEngine.getStaffUsers());

      if (hasPermissionError) {
        return { 
          success: false, 
          isPermissionError: true, 
          error: 'Missing or insufficient permissions on Firebase Console' 
        };
      }

      return { success: true };
    } catch (err: any) {
      console.error('[Firestore] Error pushing all local to cloud:', err);
      const isPerm = err?.code === 'permission-denied' || (err?.message && err.message.includes('permission'));
      return { 
        success: false, 
        isPermissionError: isPerm, 
        error: err?.message || String(err) 
      };
    }
  }

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isConnected: this.isConnected,
    };
  }
}

export const CloudDatabase = new CloudSyncService();
