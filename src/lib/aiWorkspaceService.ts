import { 
  AiDocument, 
  AiDocumentVersion, 
  AiDossier, 
  AiTemplate, 
  AiAuditLog, 
  AiToolId, 
  AiToolMetadata,
  WorkspaceContextData
} from '../types';
import { getApiUrl } from './api';

// Metadata definition for all 16 professional MTTQ tools across 5 groups
export const AI_TOOLS_CATALOG: AiToolMetadata[] = [
  // NHÓM 01 – SOẠN THẢO & KIỂM TRA VĂN BẢN
  {
    id: 'proofread',
    name: 'Kiểm tra & Hoàn thiện văn bản',
    shortDesc: 'Phát hiện lỗi chính tả, thể thức 15 tiêu chí và văn phong hành chính đa lớp.',
    group: 'group1_draft_proofread',
    iconName: 'FileCheck2',
    badge: 'CHUẨN HÓA',
    tags: ['chính tả', 'văn phong', 'thể thức', 'nghị định 30', 'so sánh'],
    suggestedPrompts: [
      'Kiểm tra chính tả và lỗi câu cho bản kế hoạch này',
      'Chuẩn hóa thể thức hành chính theo Nghị định 30/2020/NĐ-CP',
      'Đề xuất cách diễn đạt trang trọng hơn cho phần kết luận'
    ]
  },
  {
    id: 'draft_doc',
    name: 'Trợ lý soạn thảo văn bản',
    shortDesc: 'Quy trình Wizard 5 bước soạn thảo Kế hoạch, Tờ trình, Công văn, Hướng dẫn chuẩn xác.',
    group: 'group1_draft_proofread',
    iconName: 'PenTool',
    badge: 'WIZARD',
    tags: ['soạn thảo', 'kế hoạch', 'tờ trình', 'công văn', 'thư mời'],
    suggestedPrompts: [
      'Soạn Kế hoạch tổ chức Ngày hội Đại đoàn kết toàn dân tộc',
      'Soạn Tờ trình xin chủ trương hỗ trợ xây dựng Nhà Đại đoàn kết',
      'Soạn Thư mời đại biểu dự Hội nghị sơ kết quý'
    ]
  },

  // NHÓM 02 – BÁO CÁO & THAM MƯU
  {
    id: 'report',
    name: 'Trợ lý soạn báo cáo',
    shortDesc: 'Tổng hợp từ ý thô, đề cương và số liệu thành báo cáo tuần, tháng, quý, năm hoàn chỉnh.',
    group: 'group2_report_advisory',
    iconName: 'FileBarChart2',
    badge: 'BÁO CÁO',
    tags: ['báo cáo', 'tuần', 'tháng', 'quý', 'năm', 'tổng kết'],
    suggestedPrompts: [
      'Soạn Báo cáo công tác Mặt trận tháng 8',
      'Tổng hợp báo cáo sơ kết 6 tháng đầu năm theo đề cương',
      'Báo cáo nhanh kết quả cuộc vận động Quỹ Vì người nghèo'
    ]
  },
  {
    id: 'advisory',
    name: 'Trợ lý tham mưu',
    shortDesc: 'Phân tích văn bản cấp trên thành 9 phần tham mưu và trích xuất bảng phân công nhiệm vụ.',
    group: 'group2_report_advisory',
    iconName: 'Compass',
    badge: 'TRỌNG TÂM',
    tags: ['tham mưu', 'chỉ đạo', 'phiếu trình', 'phân công', 'nhiệm vụ'],
    suggestedPrompts: [
      'Lập phiếu tham mưu xử lý Công văn chỉ đạo của Quận/Thành phố',
      'Phân tích trách nhiệm của MTTQ Phường trong Kế hoạch của UBND',
      'Trích xuất hướng xử lý và dự thảo ý kiến trình Ban Thường trực'
    ]
  },
  {
    id: 'summarize',
    name: 'Tóm tắt văn bản',
    shortDesc: '4 chế độ tóm tắt thông minh: 30 giây, Bản lãnh đạo, Cán bộ tham mưu và Báo cáo họp.',
    group: 'group2_report_advisory',
    iconName: 'AlignLeft',
    tags: ['tóm tắt', '30 giây', 'lãnh đạo', 'cuộc họp', 'cốt lõi'],
    suggestedPrompts: [
      'Tóm tắt 30 giây lấy 5 điểm cốt lõi nhất',
      'Tóm tắt cho Chủ tịch duyệt các quyết định cần ban hành',
      'Tóm tắt để thuyết trình báo cáo trong cuộc họp giao ban'
    ]
  },
  {
    id: 'extract_tasks',
    name: 'Đọc văn bản → Trích nhiệm vụ',
    shortDesc: 'Bóc tách danh sách đầu việc, đơn vị chủ trì, phối hợp, thời hạn và sản phẩm bàn giao.',
    group: 'group2_report_advisory',
    iconName: 'CheckSquare',
    tags: ['trích xuất', 'nhiệm vụ', 'bảng công việc', 'tiến độ'],
    suggestedPrompts: [
      'Trích xuất toàn bộ các đầu việc từ kế hoạch liên ngành',
      'Lập danh sách việc cần làm và phân công 21 Ban CTMT Khu phố'
    ]
  },

  // NHÓM 03 – HỘI NGHỊ, SỰ KIỆN & PHÁT BIỂU
  {
    id: 'speech',
    name: 'Trợ lý soạn bài phát biểu',
    shortDesc: 'Soạn bài phát biểu truyền cảm hứng theo chủ đề, người phát biểu và căn chỉnh thời lượng 3-15 phút.',
    group: 'group3_conference_event',
    iconName: 'Mic',
    badge: 'PHÁT BIỂU',
    tags: ['phát biểu', 'đại đoàn kết', 'khai mạc', 'bế mạc', 'thời lượng'],
    suggestedPrompts: [
      'Bài phát biểu của Chủ tịch MTTQ tại Ngày hội Đại đoàn kết (5 phút)',
      'Bài phát biểu phát động phong trào thi đua an sinh xã hội',
      'Lời đáp từ trong buổi lễ tiếp nhận kinh phí ủng hộ Quỹ'
    ]
  },
  {
    id: 'conference',
    name: 'Trợ lý hội nghị – sự kiện',
    shortDesc: 'Tự động tạo trọn bộ: Kế hoạch, Timeline, Kịch bản MC, Thư mời, Checklist và Phân công.',
    group: 'group3_conference_event',
    iconName: 'CalendarCheck',
    badge: 'TRỌN GÓI',
    tags: ['hội nghị', 'sự kiện', 'kịch bản mc', 'timeline', 'thư mời'],
    suggestedPrompts: [
      'Tạo trọn bộ sự kiện Ngày hội Đại đoàn kết toàn dân tộc 2026',
      'Lập kịch bản điều hành và MC cho Hội nghị tổng kết năm',
      'Checklist chuẩn bị Đại hội đại biểu MTTQ Phường'
    ]
  },
  {
    id: 'meeting_minutes',
    name: 'Trợ lý biên bản cuộc họp',
    shortDesc: 'Xử lý ghi chú thô/transcript thành Biên bản chi tiết và Thông báo Kết luận chỉ đạo.',
    group: 'group3_conference_event',
    iconName: 'FileText',
    tags: ['biên bản', 'kết luận', 'cuộc họp', 'thư ký'],
    suggestedPrompts: [
      'Lập biên bản cuộc họp giao ban Ban Thường trực với 21 Trưởng ban CTMT',
      'Tạo Thông báo kết luận cuộc họp hiệp thương bầu cử'
    ]
  },

  // NHÓM 04 – CÔNG CỤ NGHIỆP VỤ MTTQ
  {
    id: 'supervision_critique',
    name: 'Trợ lý Giám sát & Phản biện',
    shortDesc: 'Phân tích dự thảo chính sách, phát hiện mâu thuẫn, gợi ý câu hỏi chất vấn và đề cương giám sát.',
    group: 'group4_mttq_specialized',
    iconName: 'ShieldAlert',
    badge: 'NGHIỆP VỤ',
    tags: ['giám sát', 'phản biện', 'chất vấn', 'chính sách', 'đất đai'],
    suggestedPrompts: [
      'Phản biện dự thảo kế hoạch bồi thường giải tỏa tuyến đường',
      'Xây dựng đề cương giám sát việc thực hiện quy chế dân chủ cơ sở',
      'Đề xuất các câu hỏi phản biện đối với đề án thu gom rác'
    ]
  },
  {
    id: 'public_opinion',
    name: 'Trợ lý Nắm bắt ý kiến nhân dân',
    shortDesc: 'Phân loại 10 nhóm lĩnh vực, phân tích điểm nóng, mức độ bức xúc và đề xuất cơ quan giải quyết.',
    group: 'group4_mttq_specialized',
    iconName: 'Users',
    badge: 'DƯ LUẬN',
    tags: ['ý kiến', 'phản ánh', 'dân sinh', 'dư luận', 'phân loại'],
    suggestedPrompts: [
      'Tổng hợp 35 ý kiến tiếp xúc cử tri tại 21 khu phố',
      'Phân tích xu hướng phản ánh về trật tự đô thị và thoát nước'
    ]
  },
  {
    id: 'propaganda',
    name: 'Trợ lý Tuyên truyền đa kênh',
    shortDesc: 'Chuyển đổi văn bản thành bài viết Website, Facebook, thông báo Zalo, Infographic và Kịch bản phát thanh.',
    group: 'group4_mttq_specialized',
    iconName: 'Megaphone',
    tags: ['tuyên truyền', 'facebook', 'zalo', 'website', 'infographic', 'phát thanh'],
    suggestedPrompts: [
      'Viết bài đăng Fanpage và thông báo Zalo về Cuộc vận động mới',
      'Tạo nội dung Infographic 4 bước đăng ký nhận hỗ trợ an sinh',
      'Soạn kịch bản phát thanh cơ sở 3 phút tuyên truyền Luật Mặt trận'
    ]
  },

  // NHÓM 05 – CÔNG CỤ THÔNG MINH BỔ SUNG
  {
    id: 'compare_docs',
    name: 'So sánh hai văn bản',
    shortDesc: 'Đối chiếu Văn bản A và Văn bản B, chỉ rõ nội dung bổ sung, cắt giảm, thay đổi số liệu và trách nhiệm.',
    group: 'group5_smart_utilities',
    iconName: 'GitCompare',
    tags: ['so sánh', 'đối chiếu', 'dự thảo cũ mới', 'thay đổi'],
    suggestedPrompts: [
      'So sánh Dự thảo lần 1 và Dự thảo lần 2 của Kế hoạch',
      'Tìm các điểm thay đổi về quyền lợi và trách nhiệm giữa 2 bản quy chế'
    ]
  },
  {
    id: 'qa_document',
    name: 'Hỏi – Đáp trên tài liệu',
    shortDesc: 'Tra cứu tài liệu đính kèm với trích dẫn chính xác trang/mục; chống bịa đặt thông tin tuyệt đối.',
    group: 'group5_smart_utilities',
    iconName: 'HelpCircle',
    badge: 'TRÍCH NGUỒN',
    tags: ['hỏi đáp', 'tra cứu', 'tài liệu', 'trích dẫn', 'nguồn'],
    suggestedPrompts: [
      'Trong kế hoạch này MTTQ phường có những trách nhiệm cụ thể nào?',
      'Chỉ tiêu vận động kinh phí được giao là bao nhiêu triệu đồng?',
      'Thời hạn gửi báo cáo nghiệm thu là ngày mấy?'
    ]
  },
  {
    id: 'work_plan',
    name: 'Trợ lý Lập kế hoạch công tác',
    shortDesc: 'Lập bảng tiến độ công tác tuần, tháng, quý, chiến dịch theo ma trận: STT, Việc, Hạn, Chủ trì, Kết quả.',
    group: 'group5_smart_utilities',
    iconName: 'TableProperties',
    tags: ['lập kế hoạch', 'tiến độ', 'ma trận công việc', 'tuần tháng'],
    suggestedPrompts: [
      'Lập ma trận kế hoạch công tác tháng 9/2026',
      'Lập tiến độ chiến dịch 30 ngày đêm cao điểm chăm lo Tết'
    ]
  },
  {
    id: 'checklist',
    name: 'Trợ lý Checklist công việc',
    shortDesc: 'Tự động tạo bảng danh mục kiểm tra theo từng giai đoạn công việc có hộp kiểm tick hoàn thành.',
    group: 'group5_smart_utilities',
    iconName: 'ListChecks',
    tags: ['checklist', 'kiểm tra', 'hậu cần', 'tiến độ', 'đầu việc'],
    suggestedPrompts: [
      'Tạo checklist tổ chức Ngày hội Đại đoàn kết toàn dân tộc',
      'Checklist quy trình tiếp công dân và xử lý đơn thư phản ánh'
    ]
  }
];

// Initial default templates
export const DEFAULT_AI_TEMPLATES: AiTemplate[] = [
  {
    id: 'tpl-plan-mttq',
    name: 'Kế hoạch Hoạt động MTTQ Chuẩn',
    category: 'Kế hoạch',
    documentType: 'Kế hoạch',
    description: 'Mẫu Kế hoạch công tác chuẩn thể thức Nghị định 30/2020/NĐ-CP cho Mặt trận cơ sở.',
    structure: `ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP\nSố: .../KH-MTTQ\n\nKẾ HOẠCH\n[Tên kế hoạch]\n\nI. MỤC ĐÍCH, YÊU CẦU\n1. Mục đích\n2. Yêu cầu\n\nII. NỘI DUNG VÀ BIỆN PHÁP THỰC HIỆN\n1. Nội dung trọng tâm\n2. Hình thức triển khai\n\nIII. THỜI GIAN VÀ ĐỊA ĐIỂM\n\nIV. TỔ CHỨC THỰC HIỆN\n1. Ban Thường trực Ủy ban MTTQ Phường\n2. Các tổ chức chính trị - xã hội\n3. Ban Công tác Mặt trận 21 Khu phố\n\nNơi nhận:\n- Thường trực Đảng ủy (b/c);\n- Ban Thường trực UBMTTQ TDM (b/c);\n- UBND Phường (ph/h);\n- 21 Ban CTMT Khu phố;\n- Lưu: VT.`,
    defaultPrompt: 'Soạn thảo kế hoạch theo chuẩn thể thức Mặt trận Tổ quốc.',
    isDefault: true,
    isActive: true,
    createdBy: 'Hệ thống',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tpl-report-monthly',
    name: 'Báo cáo Công tác Mặt trận Tháng/Quý',
    category: 'Báo cáo',
    documentType: 'Báo cáo',
    description: 'Mẫu Báo cáo định kỳ phản ánh toàn diện 5 chương trình hành động của Mặt trận.',
    structure: `ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP\nSố: .../BC-MTTQ\n\nBÁO CÁO\nKết quả công tác Mặt trận [Tháng/Quý...]\nPhương hướng, nhiệm vụ trọng tâm thời gian tới\n\nI. KẾT QUẢ ĐẠT ĐƯỢC\n1. Tuyên truyền, vận động, tập hợp các tầng lớp nhân dân\n2. Thi đua sáng tạo, thực hiện các cuộc vận động, phong trào an sinh\n3. Giám sát và phản biện xã hội, tham gia xây dựng Đảng, chính quyền\n4. Đổi mới nội dung, phương thức hoạt động\n\nII. ĐÁNH GIÁ CHUNG VÀ TỒN TẠI\n1. Ưu điểm\n2. Khó khăn, tồn tại\n\nIII. NHIỆM VỤ TRỌNG TÂM THỜI GIAN TỚI`,
    defaultPrompt: 'Soạn báo cáo công tác Mặt trận định kỳ theo 5 chương trình hành động.',
    isDefault: true,
    isActive: true,
    createdBy: 'Hệ thống',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tpl-speech-unity-day',
    name: 'Bài phát biểu Ngày hội Đại đoàn kết',
    category: 'Bài phát biểu',
    documentType: 'Bài phát biểu',
    description: 'Mẫu phát biểu trang trọng, đầm ấm, khơi dậy tinh thần đoàn kết toàn dân tộc.',
    structure: `BÀI PHÁT BIỂU\nCỦA LÃNH ĐẠO MTTQ TẠI NGÀY HỘI ĐẠI ĐOÀN KẾT TOÀN DÂN TỘC\n\nKính thưa quý vị đại biểu, thưa toàn thể bà con cô bác!\n\n1. Lời chào và ý nghĩa Ngày hội\n2. Biểu dương kết quả nhân dân khu phố đã đạt được trong năm\n3. Những tấm gương sáng, việc làm hay trong cộng đồng\n4. Lời kêu gọi thi đua, đoàn kết xây dựng khu phố văn minh, nghĩa tình\n5. Lời chúc sức khỏe và bế mạc.`,
    defaultPrompt: 'Soạn bài phát biểu ngày hội đại đoàn kết đầm ấm, truyền cảm hứng.',
    isDefault: true,
    isActive: true,
    createdBy: 'Hệ thống',
    createdAt: new Date().toISOString()
  }
];

// Initial default dossiers (Hồ sơ công việc mẫu)
export const DEFAULT_AI_DOSSIERS: AiDossier[] = [
  {
    id: 'dossier-dai-doan-ket-2026',
    title: 'Hồ sơ: Ngày hội Đại đoàn kết toàn dân tộc năm 2026',
    description: 'Trọn bộ hồ sơ kế hoạch, dự toán, thư mời, kịch bản, bài phát biểu và báo cáo tổng kết Ngày hội tại 21 Khu phố.',
    eventDate: '2026-11-18',
    location: 'Hội trường UBND Phường & 21 Nhà Văn hóa Khu phố',
    status: 'active',
    documentsCount: 4,
    tags: ['Đại đoàn kết', 'Sự kiện lớn', '21 Khu phố'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'dossier-an-sinh-tet-2027',
    title: 'Hồ sơ: Chăm lo Tết Nguyên đán Đinh Mùi 2027',
    description: 'Hồ sơ kế hoạch vận động Quỹ Vì người nghèo, danh sách hộ khó khăn, thư ngỏ và chương trình trao quà.',
    eventDate: '2027-01-15',
    location: 'Toàn phường',
    status: 'active',
    documentsCount: 2,
    tags: ['An sinh xã hội', 'Chăm lo Tết', 'Quỹ vì người nghèo'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Service functions for AI Workspace
export const aiWorkspaceService = {
  // 1. Call Backend AI Engine
  async callAiTool(endpoint: string, payload: any): Promise<any> {
    try {
      const res = await fetch(getApiUrl(`/api/ai/workspace/${endpoint}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Lỗi máy chủ (${res.status})`);
      }

      return await res.json();
    } catch (err: any) {
      console.error(`AI Workspace Error on /api/ai/workspace/${endpoint}:`, err);
      throw err;
    }
  },

  // 2. Local Storage Document Management (Autosave & Persistence)
  getSavedDocuments(): AiDocument[] {
    try {
      const data = localStorage.getItem('mttq_ai_documents_v2');
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading saved AI documents:', e);
    }
    return [];
  },

  saveDocument(doc: AiDocument): void {
    try {
      const docs = this.getSavedDocuments();
      const existingIdx = docs.findIndex(d => d.id === doc.id);
      
      const now = new Date().toISOString();
      const updatedDoc: AiDocument = {
        ...doc,
        updatedAt: now
      };

      if (existingIdx >= 0) {
        // Update version history if content changed
        const old = docs[existingIdx];
        if (old.content !== doc.content) {
          const versions = old.versions || [];
          const newVer: AiDocumentVersion = {
            id: `v_${Date.now()}`,
            documentId: doc.id,
            versionNumber: (old.version || 1),
            label: `V${old.version || 1}`,
            title: old.title,
            content: old.content,
            savedBy: doc.ownerName || 'Cán bộ MTTQ',
            changeSummary: 'Chỉnh sửa và tự động lưu',
            createdAt: now
          };
          updatedDoc.version = (old.version || 1) + 1;
          updatedDoc.versions = [newVer, ...versions].slice(0, 10);
        }
        docs[existingIdx] = updatedDoc;
      } else {
        docs.unshift(updatedDoc);
      }

      localStorage.setItem('mttq_ai_documents_v2', JSON.stringify(docs));
    } catch (e) {
      console.warn('Error saving AI document:', e);
    }
  },

  deleteDocument(docId: string): void {
    try {
      const docs = this.getSavedDocuments().filter(d => d.id !== docId);
      localStorage.setItem('mttq_ai_documents_v2', JSON.stringify(docs));
    } catch (e) {
      console.warn('Error deleting document:', e);
    }
  },

  // 3. Dossiers (Hồ sơ công việc)
  getDossiers(): AiDossier[] {
    try {
      const data = localStorage.getItem('mttq_ai_dossiers');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading dossiers:', e);
    }
    return DEFAULT_AI_DOSSIERS;
  },

  saveDossier(dossier: AiDossier): void {
    try {
      const list = this.getDossiers();
      const idx = list.findIndex(d => d.id === dossier.id);
      if (idx >= 0) {
        list[idx] = { ...dossier, updatedAt: new Date().toISOString() };
      } else {
        list.unshift(dossier);
      }
      localStorage.setItem('mttq_ai_dossiers', JSON.stringify(list));
    } catch (e) {
      console.warn('Error saving dossier:', e);
    }
  },

  // 4. Templates (Thư viện mẫu)
  getTemplates(): AiTemplate[] {
    try {
      const data = localStorage.getItem('mttq_ai_templates');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading templates:', e);
    }
    return DEFAULT_AI_TEMPLATES;
  },

  saveTemplate(tpl: AiTemplate): void {
    try {
      const list = this.getTemplates();
      const idx = list.findIndex(t => t.id === tpl.id);
      if (idx >= 0) {
        list[idx] = tpl;
      } else {
        list.unshift(tpl);
      }
      localStorage.setItem('mttq_ai_templates', JSON.stringify(list));
    } catch (e) {
      console.warn('Error saving template:', e);
    }
  },

  // 5. Audit Log (Nhật ký tham mưu)
  getAuditLogs(): AiAuditLog[] {
    try {
      const data = localStorage.getItem('mttq_ai_audit_logs');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading audit logs:', e);
    }
    return [];
  },

  logAction(log: Omit<AiAuditLog, 'id' | 'timestamp'>): void {
    try {
      const logs = this.getAuditLogs();
      const newLog: AiAuditLog = {
        ...log,
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString()
      };
      logs.unshift(newLog);
      localStorage.setItem('mttq_ai_audit_logs', JSON.stringify(logs.slice(0, 100)));
    } catch (e) {
      console.warn('Error writing audit log:', e);
    }
  },

  // 6. Favorites (Công cụ thường dùng)
  getFavoriteToolIds(): AiToolId[] {
    try {
      const data = localStorage.getItem('mttq_ai_favorite_tools');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading favorites:', e);
    }
    return ['proofread', 'draft_doc', 'report', 'advisory', 'speech', 'summarize'];
  },

  toggleFavoriteTool(toolId: AiToolId): AiToolId[] {
    const list = this.getFavoriteToolIds();
    let updated: AiToolId[];
    if (list.includes(toolId)) {
      updated = list.filter(id => id !== toolId);
    } else {
      updated = [...list, toolId];
    }
    localStorage.setItem('mttq_ai_favorite_tools', JSON.stringify(updated));
    return updated;
  },

  // 7. Workspace Context (Tái sử dụng thông tin giữa các công cụ)
  getWorkspaceContext(): WorkspaceContextData {
    try {
      const data = localStorage.getItem('mttq_ai_workspace_context');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading workspace context:', e);
    }
    return {
      eventName: 'Ngày hội Đại đoàn kết toàn dân tộc năm 2026',
      eventTime: '08:00 ngày 18/11/2026',
      eventLocation: 'Hội trường UBND Phường Chánh Hiệp & 21 Khu phố',
      unitLeading: 'Ủy ban MTTQ Việt Nam Phường Chánh Hiệp',
      unitCoordinating: 'UBND Phường và 21 Ban Công tác Mặt trận Khu phố',
      targetAudience: 'Toàn thể bà con nhân dân và cán bộ khu phố'
    };
  },

  updateWorkspaceContext(ctx: Partial<WorkspaceContextData>): void {
    const current = this.getWorkspaceContext();
    const updated = { ...current, ...ctx };
    localStorage.setItem('mttq_ai_workspace_context', JSON.stringify(updated));
  },

  // 8. Export Utilities
  exportToWord(title: string, content: string): void {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${title}</title>
    <style>
      body { font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.5; padding: 2cm; }
      h1, h2, h3 { font-family: 'Times New Roman', serif; }
      table { border-collapse: collapse; width: 100%; margin: 15px 0; }
      table, th, td { border: 1px solid black; padding: 8px; }
      th { background-color: #f2f2f2; text-align: center; }
      .header-agency { text-align: center; font-weight: bold; }
      .header-title { text-align: center; font-size: 16pt; font-weight: bold; margin-top: 20px; }
    </style>
    </head><body>`;
    const footer = `</body></html>`;
    
    // Simple conversion of markdown newlines and bolding to basic HTML for clean Word import
    let formattedContent = content
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');

    const fullHtml = header + `<div class="header-title">${title}</div><hr/><p>` + formattedContent + `</p>` + footer;

    const blob = new Blob(['\ufeff' + fullHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9_\u00C0-\u1EF9]/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  printDocument(title: string, content: string): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; font-size: 14pt; line-height: 1.6; margin: 25mm 20mm; color: #000; }
            h1 { text-align: center; font-size: 16pt; margin-bottom: 24px; text-transform: uppercase; font-weight: bold; }
            pre { white-space: pre-wrap; font-family: inherit; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <pre>${content}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
};
