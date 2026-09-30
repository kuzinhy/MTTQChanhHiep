import { AIIntent, AIAction, SessionMemory } from './types';

export interface IntentAnalysisResult {
  intent: AIIntent;
  confidence: number;
  extractedEntities: {
    neighborhood?: string;
    documentCode?: string;
    procedureName?: string;
    realtimeSubject?: string;
    locationName?: string;
    cadreName?: string;
  };
  directResponse?: {
    answer: string;
    actions?: AIAction[];
    followUps?: string[];
  };
}

export class IntentRouter {
  /**
   * Ultra-Fast Multi-tier Classifier (0ms latency, zero API token cost)
   */
  public static classify(query: string, memory?: SessionMemory): IntentAnalysisResult {
    const raw = (query || '').trim();
    const lower = raw.toLowerCase();

    // 1. GREETING
    if (/^(xin chào|chào bạn|chào cán bộ|chào trợ lý|chào|hi|hello|hey|alo)/i.test(lower) && lower.length < 30) {
      return {
        intent: 'GREETING',
        confidence: 1.0,
        extractedEntities: {},
        directResponse: {
          answer: 'Trợ lý AI Phường Chánh Hiệp xin chào bạn 👋 Bạn cần tôi hỗ trợ gì?',
          actions: [
            { type: 'OPEN_ROUTE', label: 'Gửi phản ánh', route: '/phan-anh' },
            { type: 'OPEN_ROUTE', label: 'Tra cứu văn bản', route: '/van-ban' },
            { type: 'OPEN_ROUTE', label: 'Bản đồ 21 khu phố', route: '/ban-do' }
          ],
          followUps: ['Tra cứu văn bản chỉ đạo mới', 'Xem bản đồ 21 khu phố', 'Hướng dẫn thủ tục hành chính']
        }
      };
    }

    // 2. THANKS
    if (/^(cảm ơn|cám ơn|thank you|thanks|cảm ơn bạn|cảm ơn cán bộ)/i.test(lower) && lower.length < 30) {
      return {
        intent: 'THANKS',
        confidence: 1.0,
        extractedEntities: {},
        directResponse: {
          answer: 'Rất vui được hỗ trợ bạn 😊 Khi cần thêm thông tin, bạn cứ nhắn tôi nhé!',
          actions: []
        }
      };
    }

    // 3. GOODBYE
    if (/^(tạm biệt|bye|chào tạm biệt|hẹn gặp lại)/i.test(lower) && lower.length < 30) {
      return {
        intent: 'GOODBYE',
        confidence: 1.0,
        extractedEntities: {},
        directResponse: {
          answer: 'Chào bạn! Chúc bạn một ngày làm việc hiệu quả và nhiều niềm vui 👋',
          actions: []
        }
      };
    }

    // 4. CASUAL_CHAT (What can you do?)
    if (/^(bạn làm được gì|trợ lý làm được gì|hướng dẫn sử dụng|bạn là ai|giới thiệu)/i.test(lower)) {
      return {
        intent: 'CASUAL_CHAT',
        confidence: 0.98,
        extractedEntities: {},
        directResponse: {
          answer: 'Tôi là Trợ lý AI Phường Chánh Hiệp, có thể hỗ trợ bạn tra cứu văn bản, thủ tục hành chính, gửi phản ánh – kiến nghị, an sinh xã hội, bản đồ 21 khu phố, tin tức thời sự và thông tin cán bộ trực tuyến.',
          actions: [
            { type: 'OPEN_ROUTE', label: 'Tra cứu văn bản', route: '/van-ban' },
            { type: 'OPEN_ROUTE', label: 'Sơ đồ thủ tục', route: '/van-ban' },
            { type: 'OPEN_ROUTE', label: 'Gửi phản ánh', route: '/phan-anh' }
          ],
          followUps: ['Sơ đồ thủ tục kết hôn', 'Địa chỉ văn phòng 21 khu phố', 'Tra cứu chính sách an sinh']
        }
      };
    }

    // 5. CADRES & LEADERSHIP DIRECT LOOKUP (Bùi Văn Huy, Nguyễn Công Lý, v.v.)
    if (/(bùi văn huy|bui van huy|bí thư đoàn|bi thu doan|đoàn thanh niên)/i.test(lower)) {
      return {
        intent: 'LOCAL_INFO',
        confidence: 1.0,
        extractedEntities: { cadreName: 'Bùi Văn Huy' },
        directResponse: {
          answer: 'Đồng chí **Bùi Văn Huy** hiện giữ chức vụ **Bí thư Đoàn Thanh niên Phường Chánh Hiệp**, đồng thời là Ủy viên Ban Thường trực Ủy ban MTTQ Việt Nam Phường Chánh Hiệp (Nhiệm kỳ 2025 - 2030). Đồng chí phụ trách phong trào thanh thiếu nhi, các hoạt động tình nguyện, an sinh xã hội và chuyển đổi số cộng đồng tại 21 khu phố.',
          actions: [
            { type: 'OPEN_ROUTE', label: 'Xem giới thiệu nhân sự', route: '/gioi-thieu' },
            { type: 'OPEN_ROUTE', label: 'Đăng ký tình nguyện', route: '/tinh-nguyen' }
          ],
          followUps: ['Cơ cấu Ban Thường trực MTTQ', 'Các hoạt động tình nguyện thanh niên']
        }
      };
    }

    if (/(nguyễn công lý|nguyen cong ly|chủ tịch mặt trận|chu tich mat tran)/i.test(lower)) {
      return {
        intent: 'LOCAL_INFO',
        confidence: 1.0,
        extractedEntities: { cadreName: 'Nguyễn Công Lý' },
        directResponse: {
          answer: 'Đồng chí **Nguyễn Công Lý** hiện là **Chủ tịch Ủy ban MTTQ Việt Nam Phường Chánh Hiệp** khóa 1 (Nhiệm kỳ 2025 - 2030), phụ trách chung công tác Mặt trận, tập hợp khối đại đoàn kết toàn dân tộc và giám sát - phản biện xã hội trên địa bàn phường.',
          actions: [
            { type: 'OPEN_ROUTE', label: 'Xem giới thiệu cơ cấu tổ chức', route: '/gioi-thieu' },
            { type: 'OPEN_ROUTE', label: 'Gửi phản ánh - kiến nghị', route: '/phan-anh' }
          ]
        }
      };
    }

    if (/(địa chỉ trụ sở|trụ sở phường|ở đâu|số điện thoại phường|hotline|đường dây nóng)/i.test(lower) && !lower.includes('khu phố')) {
      return {
        intent: 'LOCAL_INFO',
        confidence: 1.0,
        extractedEntities: {},
        directResponse: {
          answer: 'Trụ sở Ủy ban MTTQ Việt Nam và UBND Phường Chánh Hiệp tọa lạc tại: **Số 1240 Đại Lộ Bình Dương, Khu phố Định Hòa 5, Phường Chánh Hiệp, TP. Thủ Dầu Một**. Đường dây nóng tiếp nhận phản ánh dân sinh: **0989614614**.',
          actions: [
            { type: 'OPEN_ROUTE', label: 'Mở Bản đồ số', route: '/ban-do' },
            { type: 'OPEN_ROUTE', label: 'Gửi phản ánh', route: '/phan-anh' }
          ]
        }
      };
    }

    // 6. ADMINISTRATIVE PROCEDURES FAST-LOOKUP
    if (/(thủ tục kết hôn|đăng ký kết hôn|kết hôn cần gì)/i.test(lower)) {
      return {
        intent: 'PUBLIC_SERVICE',
        confidence: 1.0,
        extractedEntities: { procedureName: 'Đăng ký kết hôn' },
        directResponse: {
          answer: 'Thủ tục **Đăng ký kết hôn** tại UBND Phường Chánh Hiệp [Mã: TTHC-TP-01]: Thời hạn giải quyết trong 01 ngày làm việc (ngay trong ngày tiếp nhận hồ sơ). Lệ phí: Miễn phí. Hồ sơ gồm: Tờ khai đăng ký kết hôn theo mẫu, CCCD gắn chip (hoặc VNeID mức 2), Giấy xác nhận tình trạng hôn nhân (nếu cư trú khác địa bàn).',
          actions: [
            { type: 'OPEN_ROUTE', label: 'Xem sơ đồ quy trình', route: '/van-ban' },
            { type: 'OPEN_EXTERNAL', label: 'Tải biểu mẫu từ Drive', route: 'https://drive.google.com/drive/folders/1TNEc-8JYkF17R44igkinTIZAmFEjSmOL' }
          ],
          followUps: ['Thủ tục xác nhận tình trạng hôn nhân', 'Thủ tục chứng thực bản sao']
        }
      };
    }

    if (/(xác nhận độc thân|tình trạng hôn nhân|giấy độc thân)/i.test(lower)) {
      return {
        intent: 'PUBLIC_SERVICE',
        confidence: 1.0,
        extractedEntities: { procedureName: 'Xác nhận tình trạng hôn nhân' },
        directResponse: {
          answer: 'Thủ tục **Cấp Giấy xác nhận tình trạng hôn nhân** [Mã: TTHC-TP-03]: Thời hạn giải quyết tối đa 03 ngày làm việc. Lệ phí: Miễn phí cho công dân Việt Nam cư trú tại địa phương. Hồ sơ nộp trực tiếp tại Bộ phận Một cửa UBND Phường hoặc trực tuyến qua Cổng Dịch vụ công.',
          actions: [
            { type: 'OPEN_ROUTE', label: 'Xem sơ đồ thủ tục', route: '/van-ban' },
            { type: 'OPEN_ROUTE', label: 'Gửi phản ánh', route: '/phan-anh' }
          ]
        }
      };
    }

    // Extract Entities
    const extractedEntities: IntentAnalysisResult['extractedEntities'] = {};

    // Check 21 neighborhoods
    const neighborhoods = [
      'Chánh Mỹ 1', 'Chánh Mỹ 2', 'Chánh Mỹ 3', 'Chánh Mỹ 4', 'Chánh Mỹ 5', 'Chánh Mỹ 6', 'Chánh Mỹ 7',
      'Tương Bình Hiệp 1', 'Tương Bình Hiệp 2', 'Tương Bình Hiệp 3', 'Tương Bình Hiệp 4', 'Tương Bình Hiệp 5', 'Tương Bình Hiệp 6', 'Tương Bình Hiệp 7',
      'Mỹ Hảo 1', 'Mỹ Hảo 2', 'Mỹ Hảo 3', 'Mỹ Hảo 4', 'Mỹ Hảo 5', 'Mỹ Hảo 6', 'Mỹ Hảo 7',
      'Định Hòa', 'Hiệp An'
    ];
    for (const nb of neighborhoods) {
      if (lower.includes(nb.toLowerCase())) {
        extractedEntities.neighborhood = nb;
        extractedEntities.locationName = `Văn phòng Khu phố ${nb}`;
        break;
      }
    }

    // Context inheritance from memory
    const lastTopic = memory?.currentTopic?.toLowerCase() || '';
    const isTopicRealtime = lastTopic.includes('vàng') || lastTopic.includes('giá') || lastTopic.includes('thời tiết') || lastTopic.includes('tỷ giá');
    const isTopicLocation = !!memory?.currentEntities?.neighborhood;

    // 7. CORRECTION / CHALLENGE
    if (/(không đúng|sai rồi|giá tăng rồi|mới tăng|cập nhật lại|thay đổi rồi|không phải đâu|chưa đúng)/i.test(lower)) {
      return {
        intent: 'CORRECTION',
        confidence: 0.95,
        extractedEntities
      };
    }

    // 8. REALTIME_DATA
    if (/(giá vàng|sjc|pnj|doji|tỷ giá|usd|bitcoin|btc|thời tiết|giá xăng|hôm nay bao nhiêu|bây giờ bao nhiêu|giá hiện tại)/i.test(lower) || 
        (isTopicRealtime && /(cho tôi giá cụ thể|còn pnj|còn sjc|thế bao nhiêu|cụ thể là mấy|tăng hay giảm)/i.test(lower))) {
      return {
        intent: 'REALTIME_DATA',
        confidence: 0.95,
        extractedEntities: {
          ...extractedEntities,
          realtimeSubject: lower.includes('vàng') ? 'giá vàng' : lower.includes('thời tiết') ? 'thời tiết' : lower.includes('xăng') ? 'giá xăng' : 'tỷ giá'
        }
      };
    }

    // 9. MAP_QUERY & DIRECTIONS
    if (/(văn phòng khu phố|trụ sở khu phố|ở đâu|địa chỉ|bản đồ|chỉ đường|đường đi|nằm ở đâu)/i.test(lower) || 
        (isTopicLocation && /(chỉ đường|ở đâu|đi thế nào|tọa độ|vị trí)/i.test(lower))) {
      const targetNb = extractedEntities.neighborhood || memory?.currentEntities?.neighborhood;
      return {
        intent: 'MAP_QUERY',
        confidence: 0.95,
        extractedEntities: {
          ...extractedEntities,
          neighborhood: targetNb
        },
        directResponse: targetNb ? {
          answer: `Văn phòng Ban Điều hành & Ban Công tác Mặt trận **Khu phố ${targetNb}** đã được đồng bộ trên Bản đồ số Phường Chánh Hiệp. Cán bộ trực ban luôn sẵn sàng hỗ trợ tiếp nhận ý kiến của bà con.`,
          actions: [
            { type: 'OPEN_ROUTE', label: `Xem Khu phố ${targetNb} trên Bản đồ`, route: '/ban-do' },
            { type: 'OPEN_ROUTE', label: 'Gửi phản ánh khu phố', route: '/phan-anh' }
          ]
        } : undefined
      };
    }

    // 10. PUBLIC_SERVICE & PROCEDURES
    if (/(thủ tục|hồ sơ|quy trình|kết hôn|chứng thực|giấy độc thân|xác nhận tình trạng hôn nhân|khai sinh|bản sao|dịch vụ công|nộp hồ sơ)/i.test(lower)) {
      return {
        intent: 'PUBLIC_SERVICE',
        confidence: 0.95,
        extractedEntities
      };
    }

    // 11. FEEDBACK
    if (/(gửi phản ánh|phản ánh|kiến nghị|khiếu nại|báo cáo vi phạm|rác thải|lấn chiếm|trật tự đô thị)/i.test(lower)) {
      return {
        intent: 'FEEDBACK',
        confidence: 0.95,
        extractedEntities,
        directResponse: {
          answer: 'Bạn có thể gửi phản ánh – kiến nghị trực tuyến kèm hình ảnh và vị trí trực tiếp tại cổng thông tin. Ban Thường trực Mặt trận và UBND Phường sẽ tiếp nhận và phản hồi xử lý trong vòng 24–48h.',
          actions: [
            { type: 'OPEN_ROUTE', label: 'Gửi phản ánh trực tuyến', route: '/phan-anh' }
          ]
        }
      };
    }

    // 12. SOCIAL_SUPPORT & AN SINH
    if (/(an sinh|trợ cấp|bảo trợ xã hội|người cao tuổi|người khuyết tật|bữa cơm nghĩa tình|hộ nghèo|khó khăn|quỹ vì người nghèo)/i.test(lower)) {
      return {
        intent: 'SOCIAL_SUPPORT',
        confidence: 0.95,
        extractedEntities,
        directResponse: {
          answer: 'Chương trình **Bữa cơm nghĩa tình** và **Quỹ Vì người nghèo** Phường Chánh Hiệp được triển khai thường xuyên để hỗ trợ các hộ nghèo, người già neo đơn và lao động khó khăn. Người dân có thể xem danh sách các điểm an sinh trên địa bàn phường.',
          actions: [
            { type: 'OPEN_ROUTE', label: 'Xem Điểm An sinh Xã hội', route: '/an-sinh' },
            { type: 'OPEN_ROUTE', label: 'Sơ đồ bảo trợ xã hội', route: '/van-ban' }
          ]
        }
      };
    }

    // 13. VOLUNTEER
    if (/(tình nguyện|hiến máu|đoàn thanh niên|đăng ký tham gia|hoạt động hè)/i.test(lower)) {
      return {
        intent: 'VOLUNTEER',
        confidence: 0.95,
        extractedEntities,
        directResponse: {
          answer: 'Đoàn Thanh niên Phường Chánh Hiệp thường xuyên tổ chức các đội hình tình nguyện: Đội hình Chuyển đổi số cộng đồng, Hiến máu nhân đạo, Ngày Chủ nhật xanh và Sinh hoạt hè cho thiếu nhi 21 khu phố.',
          actions: [
            { type: 'OPEN_ROUTE', label: 'Đăng ký Tình nguyện viên', route: '/tinh-nguyen' }
          ]
        }
      };
    }

    // 14. DOCUMENT_LOOKUP
    if (/(văn bản|chỉ thị|nghị quyết|kế hoạch|thông tư|quyết định|hướng dẫn|công văn|quy chế)/i.test(lower)) {
      return {
        intent: 'DOCUMENT_LOOKUP',
        confidence: 0.95,
        extractedEntities
      };
    }

    // 15. GOOGLE_DRIVE_SEARCH
    if (/(drive|google drive|tải file|biểu mẫu drive|thư mục drive|tài liệu drive|1tnec)/i.test(lower)) {
      return {
        intent: 'GOOGLE_DRIVE_SEARCH',
        confidence: 0.95,
        extractedEntities,
        directResponse: {
          answer: 'Toàn bộ biểu mẫu hồ sơ, văn bản hướng dẫn và tài liệu chỉ đạo của Phường Chánh Hiệp được lưu trữ tại Thư mục Google Drive chính thức.',
          actions: [
            { type: 'OPEN_EXTERNAL', label: 'Mở Thư mục Google Drive', route: 'https://drive.google.com/drive/folders/1TNEc-8JYkF17R44igkinTIZAmFEjSmOL' }
          ]
        }
      };
    }

    // 16. NEWS_LOCAL
    if (/(tin mới|tin tức|hoạt động|sự kiện|hôm nay có tin gì|đại hội)/i.test(lower)) {
      return {
        intent: 'NEWS_LOCAL',
        confidence: 0.90,
        extractedEntities
      };
    }

    return {
      intent: 'GENERAL_QA',
      confidence: 0.85,
      extractedEntities
    };
  }
}
