import { SessionMemory, AISource, AIAction, AIIntent } from './types';

const STORAGE_KEY = 'chanh_hiep_ai_session_memory_v2';

export class MemoryService {
  public static getSession(sessionId?: string): SessionMemory {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const session: SessionMemory = JSON.parse(raw);
        if (!sessionId || session.sessionId === sessionId) {
          return session;
        }
      }
    } catch (e) {
      console.warn('Failed to load session memory, creating new:', e);
    }

    const newSession: SessionMemory = {
      sessionId: sessionId || 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      currentEntities: {},
      messages: []
    };
    MemoryService.saveSession(newSession);
    return newSession;
  }

  public static saveSession(session: SessionMemory): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn('Failed to save session memory:', e);
    }
  }

  public static addMessage(
    session: SessionMemory,
    role: 'user' | 'assistant',
    content: string,
    meta?: {
      intent?: AIIntent;
      topic?: string;
      entities?: Partial<SessionMemory['currentEntities']>;
      sources?: AISource[];
      actions?: AIAction[];
      realtimeData?: { subject: string; value: string };
    }
  ): SessionMemory {
    const timestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    session.messages.push({
      role,
      content,
      timestamp,
      sources: meta?.sources,
      actions: meta?.actions
    });

    // Limit to last 20 messages
    if (session.messages.length > 20) {
      session.messages = session.messages.slice(-20);
    }

    if (role === 'assistant') {
      session.lastAnswer = content;
      if (meta?.sources) session.lastSources = meta.sources;
      if (meta?.actions && meta.actions.length > 0) session.lastAction = meta.actions[0];
    }

    if (meta?.intent) session.currentIntent = meta.intent;
    if (meta?.topic) session.currentTopic = meta.topic;
    if (meta?.entities) {
      session.currentEntities = {
        ...session.currentEntities,
        ...meta.entities
      };
    }
    if (meta?.realtimeData) {
      session.lastRealtimeData = {
        ...meta.realtimeData,
        timestamp: new Date().toISOString()
      };
    }

    MemoryService.saveSession(session);
    return session;
  }

  public static clearSession(): SessionMemory {
    const newSession: SessionMemory = {
      sessionId: 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      currentEntities: {},
      messages: []
    };
    MemoryService.saveSession(newSession);
    return newSession;
  }
}
