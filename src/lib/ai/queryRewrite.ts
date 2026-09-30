import { AIIntent } from './types';

export interface QueryRewriteResult {
  originalQuery: string;
  normalizedQuery: string;
  expandedKeywords: string[];
  inferredTopic?: string;
}

export class QueryRewrite {
  public static rewrite(query: string, intent?: AIIntent): QueryRewriteResult {
    const raw = (query || '').trim();
    const lower = raw.toLowerCase();
    const expandedKeywords: string[] = [lower];

    let inferredTopic: string | undefined = undefined;

    // 1. CONTACT_REQUEST
    if (/(tôi có thể liên hệ với ai|liên hệ ai|gọi cho ai|gặp ai|đầu mối nào|cho tôi xin số điện thoại|hotline ai)/i.test(lower)) {
      expandedKeywords.push(
        'Thông tin liên hệ cán bộ',
        'Đầu mối tiếp nhận hỗ trợ người dân',
        'Số điện thoại đường dây nóng trực ban',
        'Ban Thường trực Ủy ban MTTQ Phường'
      );
      inferredTopic = 'tiepdanso';
    }

    // 2. SOCIAL_SUPPORT / AN SINH
    if (/(an sinh|trợ cấp|người nghèo|khó khăn|bữa cơm|giúp đỡ|tiền hỗ trợ|người già|khuyết tật)/i.test(lower)) {
      expandedKeywords.push(
        'Chính sách An sinh xã hội',
        'Quỹ Vì người nghèo',
        'Chương trình Bữa cơm nghĩa tình',
        'Trợ cấp bảo trợ xã hội thường xuyên'
      );
      inferredTopic = 'an_sinh';
    }

    // 3. MARRIAGE / SINGLE STATUS
    if (/(kết hôn|độc thân|tình trạng hôn nhân|lấy vợ|lấy chồng|giấy độc thân)/i.test(lower)) {
      expandedKeywords.push(
        'Thủ tục Đăng ký kết hôn [TTHC-TP-01]',
        'Thủ tục Cấp Giấy xác nhận tình trạng hôn nhân [TTHC-TP-03]',
        'Hồ sơ tư pháp hộ tịch'
      );
      inferredTopic = 'van_ban';
    }

    // 4. FEEDBACK / OPINIONS
    if (/(gửi phản ánh|kiến nghị|khiếu nại|phàn nàn|báo rác|lấn chiếm|trật tự)/i.test(lower)) {
      expandedKeywords.push(
        'Quy trình tiếp nhận và xử lý phản ánh kiến nghị dân sinh',
        'Hệ thống Lắng nghe Dân sinh Chánh Hiệp'
      );
      inferredTopic = 'phan_anh';
    }

    // 5. VOLUNTEER / YOUTH UNION
    if (/(tình nguyện|hiến máu|đoàn thanh niên|bùi văn huy|hoạt động hè|áo xanh)/i.test(lower)) {
      expandedKeywords.push(
        'Đoàn TNCS Hồ Chí Minh Phường Chánh Hiệp',
        'Bí thư Đoàn Thanh niên Bùi Văn Huy',
        'Đội hình tình nguyện Chuyển đổi số cộng đồng'
      );
      inferredTopic = 'tinh_nguyen';
    }

    // 6. 21 NEIGHBORHOODS
    const neighborhoods = [
      'Chánh Mỹ 1', 'Chánh Mỹ 2', 'Chánh Mỹ 3', 'Chánh Mỹ 4', 'Chánh Mỹ 5', 'Chánh Mỹ 6', 'Chánh Mỹ 7',
      'Tương Bình Hiệp 1', 'Tương Bình Hiệp 2', 'Tương Bình Hiệp 3', 'Tương Bình Hiệp 4', 'Tương Bình Hiệp 5', 'Tương Bình Hiệp 6', 'Tương Bình Hiệp 7',
      'Mỹ Hảo 1', 'Mỹ Hảo 2', 'Mỹ Hảo 3', 'Mỹ Hảo 4', 'Mỹ Hảo 5', 'Mỹ Hảo 6', 'Mỹ Hảo 7',
      'Định Hòa', 'Hiệp An'
    ];

    for (const nb of neighborhoods) {
      if (lower.includes(nb.toLowerCase())) {
        expandedKeywords.push(
          `Văn phòng Ban Điều hành Khu phố ${nb}`,
          `Ban Công tác Mặt trận Khu phố ${nb}`,
          `Bản đồ số địa bàn Khu phố ${nb}`
        );
        inferredTopic = 'ban_do';
        break;
      }
    }

    return {
      originalQuery: raw,
      normalizedQuery: lower,
      expandedKeywords: Array.from(new Set(expandedKeywords)),
      inferredTopic
    };
  }
}
