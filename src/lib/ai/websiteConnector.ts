import { OfficialDocument, Article, PublicOpinion } from '../../types';
import { ADMINISTRATIVE_PROCEDURES } from '../../components/portal/AdministrativeProceduresTab';
import { loadStoredAboutData } from '../aboutDataStore';
import { LocalDataService } from './localDataService';
import { ContactService } from './contactService';

export interface NormalizedWebsiteItem {
  id: string;
  title: string;
  type: 'DOCUMENT' | 'NEWS' | 'PROCEDURE' | 'OPINION' | 'MAP_OFFICE' | 'SOCIAL_SUPPORT' | 'GENERAL' | 'CONTACT' | 'UTILITY' | 'CULTURE';
  content: string;
  sourceName: string;
  sourceUrl: string;
  official: boolean;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export class WebsiteConnector {
  public static normalizeAll(params: {
    documents?: OfficialDocument[];
    articles?: Article[];
    opinions?: PublicOpinion[];
    neighborhoodNames?: string[];
  }): NormalizedWebsiteItem[] {
    const items: NormalizedWebsiteItem[] = [];

    // 1. Documents
    if (params.documents) {
      params.documents.forEach((doc) => {
        if (doc.isPublic ?? true) {
          items.push({
            id: `doc-${doc.id}`,
            title: `${doc.codeNumber}: ${doc.title}`,
            type: 'DOCUMENT',
            content: `Văn bản số ${doc.codeNumber}, ban hành ngày ${doc.issueDate}. Người ký: ${doc.signer} (${doc.signerPosition || 'Lãnh đạo'}). Lĩnh vực: ${doc.field}. Trích yếu: ${doc.summary || doc.title}`,
            sourceName: 'Kho Văn bản & Chính sách Phường Chánh Hiệp',
            sourceUrl: '/van-ban',
            official: true,
            updatedAt: doc.issueDate || new Date().toISOString(),
            metadata: { codeNumber: doc.codeNumber, signer: doc.signer, field: doc.field, driveUrl: doc.driveUrl }
          });
        }
      });
    }

    // 2. Administrative Procedures (Merged standard & detailed encyclopedia)
    const detailedProcedures = LocalDataService.getProcedures();
    detailedProcedures.forEach((proc) => {
      items.push({
        id: `proc-detail-${proc.id}`,
        title: `Thủ tục: ${proc.name} [Mã ${proc.code}]`,
        type: 'PROCEDURE',
        content: `Thủ tục hành chính "${proc.name}" (Mã: ${proc.code}). Lĩnh vực: ${proc.category}. Thời hạn giải quyết: ${proc.processingTime}. Lệ phí: ${proc.fee}. Nơi tiếp nhận: ${proc.receivingAuthority}. Thành phần hồ sơ bắt buộc gồm: ${proc.requiredDocs.join('; ')}. Lưu ý quan trọng: ${proc.notes}`,
        sourceName: 'Sơ đồ Quy trình Thủ tục Hành chính Phường Chánh Hiệp',
        sourceUrl: '/van-ban',
        official: true,
        updatedAt: '2026-09-30',
        metadata: { code: proc.code, category: proc.category, onlineLink: proc.onlineLink }
      });
    });

    ADMINISTRATIVE_PROCEDURES.forEach((proc) => {
      const stepsText = proc.steps.map(s => `Bước ${s.stepNumber}: ${s.title} (${s.responsible}) - ${s.description}`).join('; ');
      items.push({
        id: `proc-${proc.id}`,
        title: `Sơ đồ thủ tục: ${proc.title} (${proc.code})`,
        type: 'PROCEDURE',
        content: `Sơ đồ quy trình ${proc.title} [${proc.code}]. Lĩnh vực: ${proc.category}. Thời hạn: ${proc.processingTime}. Lệ phí: ${proc.fee}. Hồ sơ cần: ${proc.requiredDocuments.join(', ')}. Các bước: ${stepsText}`,
        sourceName: 'Sơ đồ Quy trình Thủ tục Hành chính Phường Chánh Hiệp',
        sourceUrl: '/van-ban',
        official: true,
        updatedAt: '2026-09-30',
        metadata: { code: proc.code, category: proc.category, portalLink: proc.portalLink }
      });
    });

    // 3. News / Articles
    if (params.articles) {
      params.articles.forEach((art) => {
        items.push({
          id: `art-${art.id}`,
          title: art.title,
          type: 'NEWS',
          content: `Tin tức ngày ${art.publishDate || art.createdAt}. Chuyên mục: ${art.category}. Tóm tắt: ${art.summary || art.content?.substring(0, 250)}`,
          sourceName: 'Cổng Thông tin Điện tử Phường Chánh Hiệp',
          sourceUrl: `/tin-tuc/${art.id}`,
          official: true,
          updatedAt: art.publishDate || art.createdAt || new Date().toISOString(),
          metadata: { category: art.category, author: art.authorName || 'Ban Biên tập' }
        });
      });
    }

    // 4. 21 Neighborhood Offices & Detailed Geographic Directory
    const detailedNeighborhoods = LocalDataService.getNeighborhoods();
    detailedNeighborhoods.forEach((nb) => {
      items.push({
        id: `nb-detail-${nb.code}`,
        title: `Văn phòng Ban Điều hành & Ban CTMT Khu phố ${nb.name}`,
        type: 'MAP_OFFICE',
        content: `Khu phố ${nb.name}, Phường Chánh Hiệp, TP. Thủ Dầu Một. Trụ sở / Địa chỉ văn phòng: ${nb.officeAddress}. Tuyến đường chính: ${nb.mainStreets.join(', ')}. Điểm mốc nhận diện: ${nb.keyLandmarks}. Đơn vị phụ trách: ${nb.leaderTitle}. Số điện thoại liên hệ trực ban: ${nb.cadreContact}. Hoạt động nổi bật: ${nb.activities}.`,
        sourceName: 'Bản đồ số 21 Khu phố Phường Chánh Hiệp',
        sourceUrl: '/ban-do',
        official: true,
        updatedAt: '2026-09-30',
        metadata: { neighborhoodName: nb.name, code: nb.code, streets: nb.mainStreets }
      });
    });

    // 5. Emergency Utilities & Public Hotlines
    const utilities = LocalDataService.getEmergencyUtilities();
    utilities.forEach((ut) => {
      items.push({
        id: `ut-${ut.id}`,
        title: `${ut.agencyName} - Hotline: ${ut.hotline}`,
        type: 'UTILITY',
        content: `Cơ quan / Tiện ích: ${ut.agencyName}. Chức năng & Nhiệm vụ: ${ut.function}. Số điện thoại đường dây nóng: ${ut.hotline}. Địa chỉ trụ sở: ${ut.address}. Thời gian làm việc: ${ut.workingHours}. Ghi chú hỗ trợ: ${ut.notes}`,
        sourceName: 'Danh bạ Tiện ích & Đường dây nóng Phường Chánh Hiệp',
        sourceUrl: '/gioi-thieu',
        official: true,
        updatedAt: '2026-09-30',
        metadata: { agencyName: ut.agencyName, hotline: ut.hotline }
      });
    });

    // 6. Ho Chi Minh Cultural Space & Historical Heritage
    const culture = LocalDataService.getCulturalHeritage();
    items.push({
      id: 'culture-hcm-space',
      title: culture.title,
      type: 'CULTURE',
      content: `${culture.title} tọa lạc tại: ${culture.location}. Giới thiệu: ${culture.description}. Thời gian mở cửa đón tiếp nhân dân, học sinh, đoàn viên: ${culture.openHours}. Các hiện vật tiêu biểu: ${culture.highlights.join('; ')}.`,
      sourceName: 'Không gian Văn hóa Hồ Chí Minh Phường Chánh Hiệp',
      sourceUrl: '/khong-gian-van-hoa-ho-chi-minh',
      official: true,
      updatedAt: '2026-09-30'
    });

    // 7. Social Support & Public Facilities
    items.push({
      id: 'support-an-sinh',
      title: 'Chính sách An sinh xã hội, Bữa cơm nghĩa tình & Quỹ Vì người nghèo Phường Chánh Hiệp',
      type: 'SOCIAL_SUPPORT',
      content: 'Ủy ban MTTQ Việt Nam Phường Chánh Hiệp triển khai chương trình "Bữa cơm nghĩa tình" phát suất ăn miễn phí hàng tuần, Quỹ "Vì người nghèo", hỗ trợ xây mới/sửa chữa Nhà Đại đoàn kết (80 - 100 triệu/căn), trao tặng Thẻ BHYT và Học bổng Khuyến học cho các hộ nghèo, cận nghèo, người già neo đơn, trẻ em có hoàn cảnh khó khăn trên 21 khu phố.',
      sourceName: 'Mặt trận Tổ quốc Phường Chánh Hiệp',
      sourceUrl: '/an-sinh',
      official: true,
      updatedAt: '2026-09-30'
    });

    // 8. Leadership, Cadres & Contact Directory
    const contacts = ContactService.getAll();
    contacts.forEach((c) => {
      items.push({
        id: `contact-${c.id}`,
        title: `Đầu mối cán bộ: ${c.name} - ${c.title}`,
        type: 'CONTACT',
        content: `Đồng chí ${c.name} giữ chức vụ ${c.title} tại ${c.department}. Trách nhiệm: ${c.responsibility}. Số điện thoại liên hệ: ${c.phone}. Email: ${c.email}. Địa chỉ cơ quan: ${c.address}. Các lĩnh vực phụ trách tiếp nhận: ${c.topics.join(', ')}.`,
        sourceName: 'Danh bạ Cán bộ Phường Chánh Hiệp',
        sourceUrl: '/gioi-thieu',
        official: true,
        updatedAt: '2026-09-30',
        metadata: { name: c.name, title: c.title, topics: c.topics, phone: c.phone }
      });
    });

    // 9. Opinions & Feedback
    if (params.opinions) {
      params.opinions.forEach((op) => {
        items.push({
          id: `op-${op.id}`,
          title: `Ý kiến phản ánh: ${op.topic || 'Dân sinh'}`,
          type: 'OPINION',
          content: `Ý kiến của người dân ngày ${op.createdAt}. Chủ đề: ${op.topic || 'Dân sinh'}. Nội dung: ${op.content}. Trạng thái xử lý: ${op.status}`,
          sourceName: 'Hệ thống Lắng nghe Dân sinh Chánh Hiệp',
          sourceUrl: '/phan-anh',
          official: false,
          updatedAt: op.createdAt || new Date().toISOString()
        });
      });
    }

    return items;
  }
}
