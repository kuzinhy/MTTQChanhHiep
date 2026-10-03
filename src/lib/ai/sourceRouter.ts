import { AIIntent, AISourceMode, AIAction } from './types';

export interface SourceRoutingPlan {
  primaryLayer: 'WEBSITE' | 'KNOWLEDGE_BASE' | 'GOOGLE_DRIVE' | 'INTERNET' | 'GENERAL_AI' | 'DIRECT_AI';
  enableInternet: boolean;
  enableWebsite: boolean;
  enableDrive: boolean;
  enableKnowledgeBase: boolean;
  sourceMode: AISourceMode;
  targetActions: AIAction[];
}

export class SourceRouter {
  public static plan(intent: AIIntent, userConfigMode: AISourceMode = 'LOCAL_FIRST'): SourceRoutingPlan {
    switch (intent) {
      case 'GREETING':
      case 'THANKS':
      case 'GOODBYE':
      case 'CASUAL_CHAT':
        return {
          primaryLayer: 'DIRECT_AI',
          enableInternet: false,
          enableWebsite: false,
          enableDrive: false,
          enableKnowledgeBase: false,
          sourceMode: 'DIRECT_AI',
          targetActions: []
        };

      case 'REALTIME_DATA':
      case 'NEWS_EXTERNAL':
      case 'CORRECTION':
      case 'CHALLENGE':
        return {
          primaryLayer: 'INTERNET',
          enableInternet: true,
          enableWebsite: true,
          enableDrive: false,
          enableKnowledgeBase: true,
          sourceMode: 'WEB_FIRST',
          targetActions: []
        };

      case 'DOCUMENT_LOOKUP':
      case 'PUBLIC_SERVICE':
        return {
          primaryLayer: 'KNOWLEDGE_BASE',
          enableInternet: false,
          enableWebsite: true,
          enableDrive: true,
          enableKnowledgeBase: true,
          sourceMode: userConfigMode,
          targetActions: [
            { type: 'OPEN_ROUTE' as const, label: 'Xem văn bản', route: '/van-ban' },
            { type: 'OPEN_ROUTE' as const, label: 'Xem sơ đồ thủ tục', route: '/van-ban' }
          ]
        };

      case 'MAP_QUERY':
        return {
          primaryLayer: 'WEBSITE',
          enableInternet: false,
          enableWebsite: true,
          enableDrive: false,
          enableKnowledgeBase: true,
          sourceMode: 'LOCAL_FIRST',
          targetActions: [
            { type: 'OPEN_ROUTE' as const, label: 'Mở Bản đồ số', route: '/ban-do' },
            { type: 'OPEN_ROUTE' as const, label: 'Xem 21 khu phố', route: '/ban-do' }
          ]
        };

      case 'FEEDBACK':
        return {
          primaryLayer: 'WEBSITE',
          enableInternet: false,
          enableWebsite: true,
          enableDrive: false,
          enableKnowledgeBase: true,
          sourceMode: 'LOCAL_FIRST',
          targetActions: [
            { type: 'OPEN_ROUTE' as const, label: 'Gửi phản ánh trực tuyến', route: '/phan-anh' }
          ]
        };

      case 'SOCIAL_SUPPORT':
        return {
          primaryLayer: 'WEBSITE',
          enableInternet: false,
          enableWebsite: true,
          enableDrive: true,
          enableKnowledgeBase: true,
          sourceMode: 'LOCAL_FIRST',
          targetActions: [
            { type: 'OPEN_ROUTE' as const, label: 'Điểm an sinh', route: '/an-sinh' },
            { type: 'OPEN_ROUTE' as const, label: 'Sơ đồ bảo trợ xã hội', route: '/van-ban' }
          ]
        };

      case 'VOLUNTEER':
        return {
          primaryLayer: 'WEBSITE',
          enableInternet: false,
          enableWebsite: true,
          enableDrive: false,
          enableKnowledgeBase: true,
          sourceMode: 'LOCAL_FIRST',
          targetActions: [
            { type: 'OPEN_ROUTE' as const, label: 'Đăng ký tình nguyện', route: '/tinh-nguyen' }
          ]
        };

      case 'NEWS_LOCAL':
        return {
          primaryLayer: 'WEBSITE',
          enableInternet: false,
          enableWebsite: true,
          enableDrive: false,
          enableKnowledgeBase: true,
          sourceMode: 'LOCAL_FIRST',
          targetActions: [
            { type: 'OPEN_ROUTE' as const, label: 'Xem tin tức mới', route: '/tin-tuc' }
          ]
        };

      case 'GOOGLE_DRIVE_SEARCH':
        return {
          primaryLayer: 'GOOGLE_DRIVE',
          enableInternet: false,
          enableWebsite: true,
          enableDrive: true,
          enableKnowledgeBase: true,
          sourceMode: 'LOCAL_FIRST',
          targetActions: [
            { type: 'OPEN_EXTERNAL' as const, label: 'Mở Thư mục Drive Bộ não AI', route: 'https://drive.google.com/drive/folders/1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G?hl=vi' }
          ]
        };

      case 'GENERAL_QA':
      default:
        return {
          primaryLayer: 'GENERAL_AI',
          enableInternet: userConfigMode === 'WEB_FIRST',
          enableWebsite: true,
          enableDrive: false,
          enableKnowledgeBase: true,
          sourceMode: userConfigMode,
          targetActions: []
        };
    }
  }
}
