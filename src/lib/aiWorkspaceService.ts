import { 
  AiDocument, 
  AiDocumentVersion, 
  AiDossier, 
  AiTemplate, 
  AiAuditLog, 
  AiToolId, 
  AiToolMetadata,
  WorkspaceContextData,
  MttqTask
} from '../types';
import { getApiUrl } from './api';

// Metadata definition for the 8 core MTTQ tools across 4 main operational groups
export const AI_TOOLS_CATALOG: AiToolMetadata[] = [
  // NHÓM 01 – VĂN BẢN & HỒ SƠ
  {
    id: 'read_process_doc',
    name: '1. Đọc & Xử lý văn bản',
    shortDesc: 'Xử lý trọn gói 1 file: Tóm tắt 3 mức, nội dung cốt lõi, trích nhiệm vụ & đề xuất phiếu trình.',
    group: 'group1_docs_dossier',
    iconName: 'FileSearch',
    badge: 'HỒ SƠ PHÂN TÍCH',
    tags: ['đọc văn bản', 'tóm tắt', 'nhiệm vụ', 'trích yếu', 'phiếu trình'],
    suggestedPrompts: [
      'Đọc và phân tích Công văn/Kế hoạch cấp trên gửi về',
      'Tóm tắt nội dung cốt lõi và trích danh sách nhiệm vụ cần làm',
      'Đề xuất hướng xử lý và dự thảo Phiếu trình Lãnh đạo'
    ]
  },
  {
    id: 'draft_proofread_doc',
    name: '2. Soạn & Hoàn thiện văn bản',
    shortDesc: 'Soạn mới 12 loại văn bản hành chính, rà soát 12 lớp (chính tả, thể thức NĐ 30, căn cứ) & xuất Word.',
    group: 'group1_docs_dossier',
    iconName: 'PenTool',
    badge: 'XUẤT WORD',
    tags: ['soạn thảo', 'kiểm tra 12 lớp', 'nghị định 30', 'xuất word', 'chính tả'],
    suggestedPrompts: [
      'Soạn Kế hoạch tổ chức Ngày hội Đại đoàn kết toàn dân tộc',
      'Kiểm tra 12 lớp chính tả, thể thức Nghị định 30 cho bản thảo',
      'Soạn Tờ trình xin hỗ trợ kinh phí sửa chữa Nhà Đại đoàn kết'
    ]
  },

  // NHÓM 02 – THAM MƯU & TỔNG HỢP
  {
    id: 'advisory',
    name: '3. Trợ lý Tham mưu',
    shortDesc: 'Phân tích vấn đề 10 bước: Bối cảnh, căn cứ, phương án, rủi ro, kiến nghị & việc cần thực hiện.',
    group: 'group2_advisory_report',
    iconName: 'Compass',
    badge: 'TRỌNG TÂM',
    tags: ['tham mưu', 'chỉ đạo', 'phiếu tham mưu', 'phương án', 'phân tích rủi ro'],
    suggestedPrompts: [
      'Lập phiếu tham mưu xử lý Công văn chỉ đạo mới từ Thành phố/Quận',
      'Phân tích phương án và rủi ro khi triển khai mô hình Dân vận khéo',
      'Đề xuất hướng tham mưu cho Ban Thường trực về đơn thư phản ánh'
    ]
  },
  {
    id: 'report_plan',
    name: '4. Báo cáo – Kế hoạch – Chương trình',
    shortDesc: 'Quy trình tối đa 3 bước tổng hợp báo cáo định kỳ/chuyên đề từ dữ liệu công việc và lịch làm việc.',
    group: 'group2_advisory_report',
    iconName: 'FileBarChart2',
    badge: 'MAX 3 BƯỚC',
    tags: ['báo cáo', 'kế hoạch', 'chương trình', 'báo cáo tuần', 'số liệu thực'],
    suggestedPrompts: [
      'Lập Báo cáo công tác Mặt trận tháng 8 từ dữ liệu nhiệm vụ',
      'Soạn Báo cáo nhanh kết quả Vận động Quỹ Vì người nghèo',
      'Lập Chương trình công tác quý IV/2026 của Ủy ban MTTQ Phường'
    ]
  },

  // NHÓM 03 – HỌP – SỰ KIỆN – PHÁT BIỂU
  {
    id: 'event_workspace',
    name: '5. Trợ lý Hội họp & Sự kiện',
    shortDesc: 'Quản lý Workspace sự kiện: Giấy mời, Kịch bản, Checklist trước họp, Agenda trong họp & Kết luận sau họp.',
    group: 'group3_meeting_event',
    iconName: 'CalendarCheck',
    badge: 'WORKSPACE',
    tags: ['sự kiện', 'hội nghị', 'checklist', 'kịch bản', 'kết luận họp'],
    suggestedPrompts: [
      'Tạo Workspace chuẩn bị Ngày hội Đại đoàn kết toàn dân tộc',
      'Lập Checklist hậu cần và phân công công việc cuộc họp giao ban',
      'Soạn Thông báo Kết luận cuộc họp Ban Thường trực'
    ]
  },
  {
    id: 'speech_script',
    name: '6. Bài phát biểu – Kịch bản',
    shortDesc: 'Tạo bài phát biểu theo mốc 3p, 5p, 7p, Kịch bản MC điều hành & Dàn ý nói nhanh không cần đọc văn bản.',
    group: 'group3_meeting_event',
    iconName: 'Mic',
    badge: 'KHAI MẠC/BẾ MẠC',
    tags: ['phát biểu', 'kịch bản mc', 'dàn ý nói', '3 phút', '5 phút'],
    suggestedPrompts: [
      'Soạn bài phát biểu 5 phút của Chủ tịch MTTQ tại Ngày hội Đại đoàn kết',
      'Tạo Dàn ý phát biểu ngắn gọn cho Lãnh đạo cấp ủy',
      'Soạn Kịch bản MC điều hành Lễ phát động Tháng hành động Vì người nghèo'
    ]
  },

  // NHÓM 04 – CÔNG VIỆC & ĐIỀU HÀNH
  {
    id: 'task_tracking',
    name: '7. Trích nhiệm vụ & Theo dõi tiến độ',
    shortDesc: 'Tự động trích xuất Task từ văn bản/kết luận họp, theo dõi trạng thái, phân công và cảnh báo quá hạn.',
    group: 'group4_task_operational',
    iconName: 'CheckSquare',
    badge: 'QUẢN LÝ TASK',
    tags: ['nhiệm vụ', 'tiến độ', 'quá hạn', 'phân công', '21 khu phố'],
    suggestedPrompts: [
      'Trích xuất toàn bộ nhiệm vụ từ Kết luận cuộc họp giao ban',
      'Lập bảng theo dõi tiến độ phân công 21 Ban CTMT Khu phố',
      'Xem danh sách việc hôm nay và việc quá hạn cần xử lý'
    ]
  },
  {
    id: 'lookup_templates',
    name: '8. Tra cứu nghiệp vụ & Mẫu biểu',
    shortDesc: 'Kho mẫu văn bản chuẩn Nghị định 30, quy chế, hướng dẫn nghiệp vụ Mặt Trận có nguồn gốc kiểm chứng.',
    group: 'group4_task_operational',
    iconName: 'BookTemplate',
    badge: 'KHO MẪU NĐ 30',
    tags: ['tra cứu', 'mẫu biểu', 'nghiệp vụ', 'nghị định 30', 'quy chế'],
    suggestedPrompts: [
      'Tra cứu mẫu Kế hoạch giám sát và phản biện xã hội',
      'Tìm mẫu Giấy mời họp giao ban chuẩn thể thức',
      'Tra cứu Hướng dẫn tổ chức Ngày hội Đại đoàn kết toàn dân tộc'
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

  // 2. Real-time Draft Storage & Unfinished Session Recovery
  getToolDraft(toolId: string): any {
    try {
      const drafts = JSON.parse(localStorage.getItem('mttq_ai_active_drafts_v1') || '{}');
      return drafts[toolId] || null;
    } catch (e) {
      console.warn('Error reading tool draft:', e);
      return null;
    }
  },

  saveToolDraft(toolId: string, toolName: string, draftData: any): void {
    try {
      const drafts = JSON.parse(localStorage.getItem('mttq_ai_active_drafts_v1') || '{}');
      drafts[toolId] = {
        toolId,
        toolName,
        updatedAt: new Date().toISOString(),
        data: draftData
      };
      localStorage.setItem('mttq_ai_active_drafts_v1', JSON.stringify(drafts));
    } catch (e) {
      console.warn('Error saving tool draft:', e);
    }
  },

  clearToolDraft(toolId: string): void {
    try {
      const drafts = JSON.parse(localStorage.getItem('mttq_ai_active_drafts_v1') || '{}');
      delete drafts[toolId];
      localStorage.setItem('mttq_ai_active_drafts_v1', JSON.stringify(drafts));
    } catch (e) {
      console.warn('Error clearing tool draft:', e);
    }
  },

  getAllToolDrafts(): Array<{ toolId: string; toolName: string; updatedAt: string; data: any }> {
    try {
      const drafts = JSON.parse(localStorage.getItem('mttq_ai_active_drafts_v1') || '{}');
      return Object.values(drafts);
    } catch (e) {
      console.warn('Error reading all tool drafts:', e);
      return [];
    }
  },

  // 3. Local Storage Document Management (Autosave & Persistence)
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

  // 9. Tasks Management (Trích nhiệm vụ & Theo dõi tiến độ)
  getTasks(): MttqTask[] {
    try {
      const data = localStorage.getItem('mttq_ai_tasks_v1');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading tasks:', e);
    }
    return [
      {
        id: 'task-01',
        title: 'Nghiệm thu công trình "Góc Xanh Đại Đoàn Kết"',
        description: 'Kiểm tra 21 điểm thu gom rác nhựa tái chế tại 21 Khu phố Phường Chánh Hiệp.',
        sourceDoc: 'Kế hoạch số 12/KH-MTTQ ngày 15/08/2026',
        assignedTo: 'Ban CTMT KP 5 & Hội Phụ nữ Phường',
        dueDate: '2026-09-10',
        priority: 'high',
        status: 'in_progress',
        progress: 75,
        createdAt: new Date().toISOString()
      },
      {
        id: 'task-02',
        title: 'Gửi Giấy mời dự Họp Giao ban Ban Thường trực với 21 Trưởng ban CTMT',
        description: 'Chuẩn bị tài liệu, đính kèm chương trình họp và gửi qua Zalo Công việc.',
        sourceDoc: 'Thông báo Kết luận số 45/TB-MTTQ',
        assignedTo: 'Chuyên viên Văn phòng MTTQ',
        dueDate: '2026-09-08',
        priority: 'high',
        status: 'pending',
        progress: 20,
        createdAt: new Date().toISOString()
      },
      {
        id: 'task-03',
        title: 'Tổng hợp danh sách 85 suất học bổng Quỹ Vì người nghèo',
        description: 'Rà soát danh sách học sinh nghèo hiếu học tại 21 Khu phố trình Chủ tịch duyệt.',
        sourceDoc: 'Tờ trình số 08/TTr-MTTQ',
        assignedTo: 'Bộ phận An sinh Xã hội',
        dueDate: '2026-09-02',
        priority: 'medium',
        status: 'overdue',
        progress: 90,
        createdAt: new Date().toISOString()
      }
    ];
  },

  saveTask(task: MttqTask): void {
    try {
      const list = this.getTasks();
      const idx = list.findIndex(t => t.id === task.id);
      if (idx >= 0) {
        list[idx] = task;
      } else {
        list.unshift(task);
      }
      localStorage.setItem('mttq_ai_tasks_v1', JSON.stringify(list));
    } catch (e) {
      console.warn('Error saving task:', e);
    }
  },

  deleteTask(taskId: string): void {
    try {
      const list = this.getTasks().filter(t => t.id !== taskId);
      localStorage.setItem('mttq_ai_tasks_v1', JSON.stringify(list));
    } catch (e) {
      console.warn('Error deleting task:', e);
    }
  },
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
