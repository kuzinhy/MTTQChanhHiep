import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import {
  ExhibitItem,
  DEFAULT_HCM_EXHIBITS,
  STORAGE_KEY_HCM_EXHIBITS
} from '../data/hcmCulturalData';
import {
  HistoricalWork,
  HistoricalAudio,
  HistoricalVideo,
  VerifiedQuote,
  FootstepLocation,
  ChanhHiepActionModel,
  HISTORICAL_WORKS,
  HISTORICAL_AUDIOS,
  HISTORICAL_VIDEOS,
  VERIFIED_QUOTES,
  FOOTSTEP_LOCATIONS,
  CHANH_HIEP_ACTION_MODELS
} from '../data/hcmVerifiedMuseumData';
import {
  BiographyChapter,
  EventCardSchema,
  CoverConfig,
  DEFAULT_BIOGRAPHY_CHAPTERS,
  DEFAULT_VERIFIED_EVENTS,
  DEFAULT_COVER_CONFIG
} from '../data/hcmGovernanceSchema';

export const HCM_CLOUD_COLLECTIONS = {
  EXHIBITS: 'hcm_exhibits',
  WORKS: 'hcm_works',
  AUDIOS: 'hcm_audios',
  VIDEOS: 'hcm_videos',
  QUOTES: 'hcm_quotes',
  FOOTSTEPS: 'hcm_footsteps',
  ACTIONS: 'hcm_chanh_hiep_actions',
  CHAPTERS: 'hcm_chapters',
  EVENTS: 'hcm_events',
  COVER: 'hcm_cover'
} as const;

export type HcmCollectionKey = keyof typeof HCM_CLOUD_COLLECTIONS;

interface HcmCloudSyncListeners {
  onExhibitsUpdate?: (items: ExhibitItem[]) => void;
  onWorksUpdate?: (items: HistoricalWork[]) => void;
  onAudiosUpdate?: (items: HistoricalAudio[]) => void;
  onVideosUpdate?: (items: HistoricalVideo[]) => void;
  onQuotesUpdate?: (items: VerifiedQuote[]) => void;
  onFootstepsUpdate?: (items: FootstepLocation[]) => void;
  onActionsUpdate?: (items: ChanhHiepActionModel[]) => void;
  onChaptersUpdate?: (items: BiographyChapter[]) => void;
  onEventsUpdate?: (items: EventCardSchema[]) => void;
  onCoverUpdate?: (config: CoverConfig) => void;
}

class HcmCloudSyncService {
  private isInitialized = false;
  private isConnected = false;
  private unsubscribers: Array<() => void> = [];
  private listeners: HcmCloudSyncListeners = {};

  public getStatus() {
    return {
      isInitialized: this.isInitialized,
      isConnected: this.isConnected
    };
  }

  /**
   * Khởi động đồng bộ Firestore cho toàn bộ Không Gian Văn Hóa Hồ Chí Minh
   */
  public async initSync(callbacks?: HcmCloudSyncListeners) {
    if (callbacks) {
      this.listeners = { ...this.listeners, ...callbacks };
    }

    if (this.isInitialized) {
      return;
    }
    this.isInitialized = true;

    try {
      // 1. Lắng nghe thời gian thực cho từng bộ sưu tập
      this.setupRealtimeListeners();

      // 2. Chạy tác vụ kiểm tra & tự động gieo mầm dữ liệu (seed) nếu Firestore còn trống
      this.seedDefaultDataIfNeeded().catch((err) => {
        console.warn('[HcmCloudSync] Background seeding check warning:', err);
      });

      this.isConnected = true;
    } catch (err) {
      console.warn('[HcmCloudSync] Failed to initialize Firestore listeners:', err);
    }
  }

  private setupRealtimeListeners() {
    // 1. EXHIBITS (Hiện vật & Di tích 3D)
    try {
      const unsubExhibits = onSnapshot(collection(db, HCM_CLOUD_COLLECTIONS.EXHIBITS), (snapshot) => {
        this.isConnected = true;
        if (!snapshot.empty) {
          const cloudItems: ExhibitItem[] = snapshot.docs.map((d) => ({
            ...(d.data() as ExhibitItem),
            id: d.id
          }));
          localStorage.setItem(STORAGE_KEY_HCM_EXHIBITS, JSON.stringify(cloudItems));
          this.listeners.onExhibitsUpdate?.(cloudItems);
          window.dispatchEvent(new CustomEvent('hcm-exhibits-updated', { detail: cloudItems }));
        }
      }, (err) => {
        console.warn('[HcmCloudSync] Exhibits sync fallback:', err);
      });
      this.unsubscribers.push(unsubExhibits);
    } catch (e) {
      console.warn('[HcmCloudSync] Could not attach exhibits listener:', e);
    }

    // 2. WORKS (15 Tác phẩm)
    try {
      const unsubWorks = onSnapshot(collection(db, HCM_CLOUD_COLLECTIONS.WORKS), (snapshot) => {
        this.isConnected = true;
        if (!snapshot.empty) {
          const cloudWorks: HistoricalWork[] = snapshot.docs.map((d) => ({
            ...(d.data() as HistoricalWork),
            id: d.id
          }));
          // Sắp xếp theo thứ tự hoặc năm
          cloudWorks.sort((a, b) => parseInt(a.year || '0') - parseInt(b.year || '0'));
          localStorage.setItem('mttq_hcm_works_v1', JSON.stringify(cloudWorks));
          this.listeners.onWorksUpdate?.(cloudWorks);
          window.dispatchEvent(new CustomEvent('hcm-works-updated', { detail: cloudWorks }));
        }
      }, (err) => {
        console.warn('[HcmCloudSync] Works sync fallback:', err);
      });
      this.unsubscribers.push(unsubWorks);
    } catch (e) {
      console.warn('[HcmCloudSync] Could not attach works listener:', e);
    }

    // 3. AUDIOS (Tư liệu âm thanh)
    try {
      const unsubAudios = onSnapshot(collection(db, HCM_CLOUD_COLLECTIONS.AUDIOS), (snapshot) => {
        this.isConnected = true;
        if (!snapshot.empty) {
          const cloudAudios: HistoricalAudio[] = snapshot.docs.map((d) => ({
            ...(d.data() as HistoricalAudio),
            id: d.id
          }));
          cloudAudios.sort((a, b) => (a.dateStr || '').localeCompare(b.dateStr || ''));
          localStorage.setItem('mttq_hcm_audios_v1', JSON.stringify(cloudAudios));
          this.listeners.onAudiosUpdate?.(cloudAudios);
          window.dispatchEvent(new CustomEvent('hcm-audios-updated', { detail: cloudAudios }));
        }
      }, (err) => {
        console.warn('[HcmCloudSync] Audios sync fallback:', err);
      });
      this.unsubscribers.push(unsubAudios);
    } catch (e) {
      console.warn('[HcmCloudSync] Could not attach audios listener:', e);
    }

    // 4. VIDEOS (Tư liệu video)
    try {
      const unsubVideos = onSnapshot(collection(db, HCM_CLOUD_COLLECTIONS.VIDEOS), (snapshot) => {
        this.isConnected = true;
        if (!snapshot.empty) {
          const cloudVideos: HistoricalVideo[] = snapshot.docs.map((d) => ({
            ...(d.data() as HistoricalVideo),
            id: d.id
          }));
          cloudVideos.sort((a, b) => (a.dateStr || '').localeCompare(b.dateStr || ''));
          localStorage.setItem('mttq_hcm_videos_v2', JSON.stringify(cloudVideos));
          this.listeners.onVideosUpdate?.(cloudVideos);
          window.dispatchEvent(new CustomEvent('hcm-videos-updated', { detail: cloudVideos }));
        }
      }, (err) => {
        console.warn('[HcmCloudSync] Videos sync fallback:', err);
      });
      this.unsubscribers.push(unsubVideos);
    } catch (e) {
      console.warn('[HcmCloudSync] Could not attach videos listener:', e);
    }

    // 5. QUOTES (Kho lời Bác)
    try {
      const unsubQuotes = onSnapshot(collection(db, HCM_CLOUD_COLLECTIONS.QUOTES), (snapshot) => {
        this.isConnected = true;
        if (!snapshot.empty) {
          const cloudQuotes: VerifiedQuote[] = snapshot.docs.map((d) => ({
            ...(d.data() as VerifiedQuote),
            id: d.id
          }));
          localStorage.setItem('mttq_hcm_quotes_v1', JSON.stringify(cloudQuotes));
          this.listeners.onQuotesUpdate?.(cloudQuotes);
          window.dispatchEvent(new CustomEvent('hcm-quotes-updated', { detail: cloudQuotes }));
        }
      }, (err) => {
        console.warn('[HcmCloudSync] Quotes sync fallback:', err);
      });
      this.unsubscribers.push(unsubQuotes);
    } catch (e) {
      console.warn('[HcmCloudSync] Could not attach quotes listener:', e);
    }

    // 6. FOOTSTEPS (Dấu chân Người)
    try {
      const unsubFootsteps = onSnapshot(collection(db, HCM_CLOUD_COLLECTIONS.FOOTSTEPS), (snapshot) => {
        this.isConnected = true;
        if (!snapshot.empty) {
          const cloudFootsteps: FootstepLocation[] = snapshot.docs.map((d) => ({
            ...(d.data() as FootstepLocation),
            id: d.id
          }));
          localStorage.setItem('mttq_hcm_footsteps_v1', JSON.stringify(cloudFootsteps));
          this.listeners.onFootstepsUpdate?.(cloudFootsteps);
          window.dispatchEvent(new CustomEvent('hcm-footsteps-updated', { detail: cloudFootsteps }));
        }
      }, (err) => {
        console.warn('[HcmCloudSync] Footsteps sync fallback:', err);
      });
      this.unsubscribers.push(unsubFootsteps);
    } catch (e) {
      console.warn('[HcmCloudSync] Could not attach footsteps listener:', e);
    }

    // 7. CHANH HIEP ACTIONS (Mô hình hành động Chánh Hiệp)
    try {
      const unsubActions = onSnapshot(collection(db, HCM_CLOUD_COLLECTIONS.ACTIONS), (snapshot) => {
        this.isConnected = true;
        if (!snapshot.empty) {
          const cloudActions: ChanhHiepActionModel[] = snapshot.docs.map((d) => ({
            ...(d.data() as ChanhHiepActionModel),
            id: d.id
          }));
          localStorage.setItem('mttq_hcm_chanh_hiep_actions_v1', JSON.stringify(cloudActions));
          this.listeners.onActionsUpdate?.(cloudActions);
          window.dispatchEvent(new CustomEvent('hcm-actions-updated', { detail: cloudActions }));
        }
      }, (err) => {
        console.warn('[HcmCloudSync] Actions sync fallback:', err);
      });
      this.unsubscribers.push(unsubActions);
    } catch (e) {
      console.warn('[HcmCloudSync] Could not attach actions listener:', e);
    }

    // 8. CHAPTERS (06 Chương Tiểu sử)
    try {
      const unsubChapters = onSnapshot(collection(db, HCM_CLOUD_COLLECTIONS.CHAPTERS), (snapshot) => {
        this.isConnected = true;
        if (!snapshot.empty) {
          const cloudChapters: BiographyChapter[] = snapshot.docs.map((d) => ({
            ...(d.data() as BiographyChapter),
            id: d.id
          }));
          cloudChapters.sort((a, b) => a.order - b.order);
          localStorage.setItem('mttq_chanhhiep_hcm_chapters_v1', JSON.stringify(cloudChapters));
          this.listeners.onChaptersUpdate?.(cloudChapters);
          window.dispatchEvent(new CustomEvent('hcm-chapters-updated', { detail: cloudChapters }));
        }
      }, (err) => {
        console.warn('[HcmCloudSync] Chapters sync fallback:', err);
      });
      this.unsubscribers.push(unsubChapters);
    } catch (e) {
      console.warn('[HcmCloudSync] Could not attach chapters listener:', e);
    }

    // 9. EVENTS (Thẻ sự kiện lịch sử)
    try {
      const unsubEvents = onSnapshot(collection(db, HCM_CLOUD_COLLECTIONS.EVENTS), (snapshot) => {
        this.isConnected = true;
        if (!snapshot.empty) {
          const cloudEvents: EventCardSchema[] = snapshot.docs.map((d) => ({
            ...(d.data() as EventCardSchema),
            id: d.id
          }));
          localStorage.setItem('mttq_chanhhiep_hcm_events_v1', JSON.stringify(cloudEvents));
          this.listeners.onEventsUpdate?.(cloudEvents);
          window.dispatchEvent(new CustomEvent('hcm-events-updated', { detail: cloudEvents }));
        }
      }, (err) => {
        console.warn('[HcmCloudSync] Events sync fallback:', err);
      });
      this.unsubscribers.push(unsubEvents);
    } catch (e) {
      console.warn('[HcmCloudSync] Could not attach events listener:', e);
    }

    // 10. COVER CONFIG (Trang bìa & Không gian)
    try {
      const unsubCover = onSnapshot(collection(db, HCM_CLOUD_COLLECTIONS.COVER), (snapshot) => {
        this.isConnected = true;
        if (!snapshot.empty) {
          const firstDoc = snapshot.docs[0];
          if (firstDoc) {
            const config = firstDoc.data() as CoverConfig;
            localStorage.setItem('mttq_chanhhiep_hcm_cover_v1', JSON.stringify(config));
            this.listeners.onCoverUpdate?.(config);
            window.dispatchEvent(new CustomEvent('hcm-cover-updated', { detail: config }));
          }
        }
      }, (err) => {
        console.warn('[HcmCloudSync] Cover config sync fallback:', err);
      });
      this.unsubscribers.push(unsubCover);
    } catch (e) {
      console.warn('[HcmCloudSync] Could not attach cover listener:', e);
    }
  }

  /**
   * Tự động khởi tạo dữ liệu mặc định lên Firestore nếu chưa có
   */
  public async seedDefaultDataIfNeeded() {
    try {
      // Check Exhibits
      const exhibitsSnap = await getDocs(collection(db, HCM_CLOUD_COLLECTIONS.EXHIBITS));
      if (exhibitsSnap.empty) {
        console.info('[HcmCloudSync] Seeding default exhibits to Firestore Cloud...');
        const batch = writeBatch(db);
        DEFAULT_HCM_EXHIBITS.forEach((ex) => {
          batch.set(doc(db, HCM_CLOUD_COLLECTIONS.EXHIBITS, ex.id), ex);
        });
        await batch.commit();
      }

      // Check Works
      const worksSnap = await getDocs(collection(db, HCM_CLOUD_COLLECTIONS.WORKS));
      if (worksSnap.empty) {
        console.info('[HcmCloudSync] Seeding default works to Firestore Cloud...');
        const batch = writeBatch(db);
        HISTORICAL_WORKS.forEach((w) => {
          batch.set(doc(db, HCM_CLOUD_COLLECTIONS.WORKS, w.id), w);
        });
        await batch.commit();
      }

      // Check Audios
      const audiosSnap = await getDocs(collection(db, HCM_CLOUD_COLLECTIONS.AUDIOS));
      if (audiosSnap.empty) {
        console.info('[HcmCloudSync] Seeding default audios to Firestore Cloud...');
        const batch = writeBatch(db);
        HISTORICAL_AUDIOS.forEach((a) => {
          batch.set(doc(db, HCM_CLOUD_COLLECTIONS.AUDIOS, a.id), a);
        });
        await batch.commit();
      }

      // Check Videos
      const videosSnap = await getDocs(collection(db, HCM_CLOUD_COLLECTIONS.VIDEOS));
      if (videosSnap.empty) {
        console.info('[HcmCloudSync] Seeding default videos to Firestore Cloud...');
        const batch = writeBatch(db);
        HISTORICAL_VIDEOS.forEach((v) => {
          batch.set(doc(db, HCM_CLOUD_COLLECTIONS.VIDEOS, v.id), v);
        });
        await batch.commit();
      }

      // Check Quotes
      const quotesSnap = await getDocs(collection(db, HCM_CLOUD_COLLECTIONS.QUOTES));
      if (quotesSnap.empty) {
        console.info('[HcmCloudSync] Seeding default quotes to Firestore Cloud...');
        const batch = writeBatch(db);
        VERIFIED_QUOTES.forEach((q) => {
          batch.set(doc(db, HCM_CLOUD_COLLECTIONS.QUOTES, q.id), q);
        });
        await batch.commit();
      }

      // Check Footsteps
      const footstepsSnap = await getDocs(collection(db, HCM_CLOUD_COLLECTIONS.FOOTSTEPS));
      if (footstepsSnap.empty) {
        console.info('[HcmCloudSync] Seeding default footsteps to Firestore Cloud...');
        const batch = writeBatch(db);
        FOOTSTEP_LOCATIONS.forEach((f) => {
          batch.set(doc(db, HCM_CLOUD_COLLECTIONS.FOOTSTEPS, f.id), f);
        });
        await batch.commit();
      }

      // Check Actions
      const actionsSnap = await getDocs(collection(db, HCM_CLOUD_COLLECTIONS.ACTIONS));
      if (actionsSnap.empty) {
        console.info('[HcmCloudSync] Seeding default actions to Firestore Cloud...');
        const batch = writeBatch(db);
        CHANH_HIEP_ACTION_MODELS.forEach((act) => {
          batch.set(doc(db, HCM_CLOUD_COLLECTIONS.ACTIONS, act.id), act);
        });
        await batch.commit();
      }

      // Check Chapters
      const chaptersSnap = await getDocs(collection(db, HCM_CLOUD_COLLECTIONS.CHAPTERS));
      if (chaptersSnap.empty) {
        console.info('[HcmCloudSync] Seeding default chapters to Firestore Cloud...');
        const batch = writeBatch(db);
        DEFAULT_BIOGRAPHY_CHAPTERS.forEach((c) => {
          batch.set(doc(db, HCM_CLOUD_COLLECTIONS.CHAPTERS, c.id), c);
        });
        await batch.commit();
      }

      // Check Events
      const eventsSnap = await getDocs(collection(db, HCM_CLOUD_COLLECTIONS.EVENTS));
      if (eventsSnap.empty) {
        console.info('[HcmCloudSync] Seeding default events to Firestore Cloud...');
        const batch = writeBatch(db);
        DEFAULT_VERIFIED_EVENTS.forEach((e) => {
          batch.set(doc(db, HCM_CLOUD_COLLECTIONS.EVENTS, e.id), e);
        });
        await batch.commit();
      }

      // Check Cover
      const coverSnap = await getDocs(collection(db, HCM_CLOUD_COLLECTIONS.COVER));
      if (coverSnap.empty) {
        console.info('[HcmCloudSync] Seeding default cover config to Firestore Cloud...');
        await setDoc(doc(db, HCM_CLOUD_COLLECTIONS.COVER, 'main_cover'), DEFAULT_COVER_CONFIG);
      }

    } catch (err) {
      console.warn('[HcmCloudSync] Seed check warning (offline or permissions):', err);
    }
  }

  /**
   * Lưu một hiện vật / tác phẩm / tư liệu lên Firestore Cloud
   */
  public async saveItemToCloud<T extends { id: string }>(
    collectionName: string,
    item: T
  ): Promise<boolean> {
    try {
      await setDoc(doc(db, collectionName, item.id), item, { merge: true });
      this.isConnected = true;
      return true;
    } catch (err) {
      console.warn(`[HcmCloudSync] Failed to save item ${item.id} to ${collectionName}:`, err);
      return false;
    }
  }

  /**
   * Lưu toàn bộ danh sách lên Firestore Cloud theo batch
   */
  public async saveCollectionToCloud<T extends { id: string }>(
    collectionName: string,
    items: T[]
  ): Promise<boolean> {
    try {
      const batch = writeBatch(db);
      items.forEach((item) => {
        batch.set(doc(db, collectionName, item.id), item, { merge: true });
      });
      await batch.commit();
      this.isConnected = true;
      return true;
    } catch (err) {
      console.warn(`[HcmCloudSync] Failed to save batch to ${collectionName}:`, err);
      return false;
    }
  }

  /**
   * Xóa một tư liệu trên Firestore Cloud
   */
  public async deleteItemFromCloud(collectionName: string, itemId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, collectionName, itemId));
      return true;
    } catch (err) {
      console.warn(`[HcmCloudSync] Failed to delete item ${itemId} from ${collectionName}:`, err);
      return false;
    }
  }

  /**
   * Ép buộc đẩy toàn bộ dữ liệu từ trình duyệt cục bộ lên Cloud Firestore
   */
  public async forcePushAllLocalToCloud(): Promise<{ success: boolean; count: number; message: string }> {
    try {
      let count = 0;

      // Exhibits
      const rawExhibits = localStorage.getItem(STORAGE_KEY_HCM_EXHIBITS);
      if (rawExhibits) {
        const exhibits: ExhibitItem[] = JSON.parse(rawExhibits);
        await this.saveCollectionToCloud(HCM_CLOUD_COLLECTIONS.EXHIBITS, exhibits);
        count += exhibits.length;
      }

      // Works
      const rawWorks = localStorage.getItem('mttq_hcm_works_v1');
      if (rawWorks) {
        const works: HistoricalWork[] = JSON.parse(rawWorks);
        await this.saveCollectionToCloud(HCM_CLOUD_COLLECTIONS.WORKS, works);
        count += works.length;
      }

      // Audios
      const rawAudios = localStorage.getItem('mttq_hcm_audios_v1');
      if (rawAudios) {
        const audios: HistoricalAudio[] = JSON.parse(rawAudios);
        await this.saveCollectionToCloud(HCM_CLOUD_COLLECTIONS.AUDIOS, audios);
        count += audios.length;
      }

      // Videos
      const rawVideos = localStorage.getItem('mttq_hcm_videos_v2');
      if (rawVideos) {
        const videos: HistoricalVideo[] = JSON.parse(rawVideos);
        await this.saveCollectionToCloud(HCM_CLOUD_COLLECTIONS.VIDEOS, videos);
        count += videos.length;
      }

      // Quotes
      const rawQuotes = localStorage.getItem('mttq_hcm_quotes_v1');
      if (rawQuotes) {
        const quotes: VerifiedQuote[] = JSON.parse(rawQuotes);
        await this.saveCollectionToCloud(HCM_CLOUD_COLLECTIONS.QUOTES, quotes);
        count += quotes.length;
      }

      // Footsteps
      const rawFootsteps = localStorage.getItem('mttq_hcm_footsteps_v1');
      if (rawFootsteps) {
        const footsteps: FootstepLocation[] = JSON.parse(rawFootsteps);
        await this.saveCollectionToCloud(HCM_CLOUD_COLLECTIONS.FOOTSTEPS, footsteps);
        count += footsteps.length;
      }

      // Actions
      const rawActions = localStorage.getItem('mttq_hcm_chanh_hiep_actions_v1');
      if (rawActions) {
        const actions: ChanhHiepActionModel[] = JSON.parse(rawActions);
        await this.saveCollectionToCloud(HCM_CLOUD_COLLECTIONS.ACTIONS, actions);
        count += actions.length;
      }

      // Chapters
      const rawChapters = localStorage.getItem('mttq_chanhhiep_hcm_chapters_v1');
      if (rawChapters) {
        const chapters: BiographyChapter[] = JSON.parse(rawChapters);
        await this.saveCollectionToCloud(HCM_CLOUD_COLLECTIONS.CHAPTERS, chapters);
        count += chapters.length;
      }

      // Events
      const rawEvents = localStorage.getItem('mttq_chanhhiep_hcm_events_v1');
      if (rawEvents) {
        const events: EventCardSchema[] = JSON.parse(rawEvents);
        await this.saveCollectionToCloud(HCM_CLOUD_COLLECTIONS.EVENTS, events);
        count += events.length;
      }

      // Cover
      const rawCover = localStorage.getItem('mttq_chanhhiep_hcm_cover_v1');
      if (rawCover) {
        const cover: CoverConfig = JSON.parse(rawCover);
        await setDoc(doc(db, HCM_CLOUD_COLLECTIONS.COVER, 'main_cover'), cover, { merge: true });
        count += 1;
      }

      this.isConnected = true;
      return {
        success: true,
        count,
        message: `Đã đồng bộ thành công ${count} mục tư liệu Không Gian Văn Hóa Hồ Chí Minh lên Cloud Firestore!`
      };
    } catch (err: any) {
      console.error('[HcmCloudSync] Push error:', err);
      return {
        success: false,
        count: 0,
        message: `Đồng bộ thất bại: ${err?.message || err}`
      };
    }
  }

  public destroy() {
    this.unsubscribers.forEach((u) => u());
    this.unsubscribers = [];
    this.isInitialized = false;
  }
}

export const hcmCloudSync = new HcmCloudSyncService();
