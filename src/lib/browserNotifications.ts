// Browser Native Web Notification Service for Fatherland Front Platform
// Enables background desktop/mobile push notifications even when the app tab is in background

export type NotificationPermissionStatus = 'default' | 'granted' | 'denied' | 'unsupported';

class BrowserNotificationManager {
  private isSupported: boolean;

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

  // Send a system native desktop notification
  public sendNotification(options: {
    title: string;
    body: string;
    icon?: string;
    tag?: string;
    data?: any;
    onClick?: () => void;
  }): Notification | null {
    if (!this.isSupported) {
      console.warn('[BrowserNotification] Notification not supported.');
      return null;
    }

    if (Notification.permission !== 'granted') {
      console.info('[BrowserNotification] Notification permission is not granted. Status:', Notification.permission);
      return null;
    }

    try {
      const defaultIcon = 'https://www.mattrancantho.vn/files/images/Logo%20-%20Icon/Logo%20MTTQ.png';
      
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || defaultIcon,
        badge: defaultIcon,
        tag: options.tag || `mttq-chanhhiep-${Date.now()}`,
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
