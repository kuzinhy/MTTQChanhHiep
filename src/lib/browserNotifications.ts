// Browser Native Web Notification Service for Fatherland Front Platform
// Enables background desktop/mobile push notifications even when the app tab is in background

export type NotificationPermissionStatus = 'default' | 'granted' | 'denied' | 'unsupported';

class BrowserNotificationManager {
  private isSupported: boolean;

  private sentHistory: Map<string, number> = new Map();

  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'Notification' in window;
  }

  // Check if Web Notifications are supported in current browser
  public getSupported(): boolean {
    return this.isSupported;
  }

  // Get current permission status
  public getPermissionStatus(): NotificationPermissionStatus {
    if (!this.isSupported) return 'unsupported';
    return Notification.permission as NotificationPermissionStatus;
  }

  // Request user permission for Browser Web Notifications
  public async requestPermission(): Promise<NotificationPermissionStatus> {
    if (!this.isSupported) {
      console.warn('[BrowserNotification] Notification API is not supported in this browser.');
      return 'unsupported';
    }

    try {
      const permission = await Notification.requestPermission();
      console.log(`[BrowserNotification] Notification permission result: ${permission}`);
      return permission as NotificationPermissionStatus;
    } catch (error) {
      console.error('[BrowserNotification] Failed to request notification permission:', error);
      return 'denied';
    }
  }

  // Send a system native desktop notification (strictly 1 notification per unique content)
  public sendNotification(options: {
    title: string;
    body: string;
    icon?: string;
    tag?: string;
    data?: any;
    onClick?: () => void;
  }): Notification | null {
    if (!this.isSupported) {
      return null;
    }

    if (Notification.permission !== 'granted') {
      return null;
    }

    // 1. Strict Content Signature & Debounce Check
    const cleanTitle = (options.title || '').trim();
    const cleanBody = (options.body || '').trim();
    const signature = `${cleanTitle}:::${cleanBody}`.toLowerCase();
    const now = Date.now();

    const lastSentTime = this.sentHistory.get(signature);
    if (lastSentTime && (now - lastSentTime) < 30000) {
      // Discard duplicate notification within 30 seconds
      return null;
    }
    this.sentHistory.set(signature, now);

    // Prune entries older than 1 minute
    for (const [sig, t] of this.sentHistory.entries()) {
      if (now - t > 60000) {
        this.sentHistory.delete(sig);
      }
    }

    try {
      const defaultIcon = 'https://res.cloudinary.com/idt08wyp/image/upload/v1789907080/Logo-Mat-Tran-To-Quoc-Viet-Nam.png';
      
      // Calculate stable tag based on content signature so OS also coalesces
      let hash = 0;
      for (let i = 0; i < signature.length; i++) {
        hash = ((hash << 5) - hash) + signature.charCodeAt(i);
        hash |= 0;
      }
      const stableTag = options.tag || `mttq_notif_${Math.abs(hash)}`;

      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || defaultIcon,
        badge: defaultIcon,
        tag: stableTag,
        requireInteraction: false, // Disappears automatically after system timeout
        silent: false,
        data: options.data
      });

      notification.onclick = (event) => {
        event.preventDefault();
        try {
          window.focus();
        } catch (e) {
          // Window focus may be limited in some iframe environments
        }

        if (options.onClick) {
          options.onClick();
        }

        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('[BrowserNotification] Error creating native notification:', error);
      return null;
    }
  }
}

export const browserNotificationService = new BrowserNotificationManager();
