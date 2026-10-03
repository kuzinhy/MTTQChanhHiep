/**
 * Input Normalizer for Chanh Hiep AI Civic Assistant
 * Handles unaccented Vietnamese, common typos, abbreviations, colloquial speech, and maps everyday phrases to administrative terms.
 */

export interface NormalizedInput {
  raw: string;
  normalized: string;
  cleanedText: string;
  administrativeTerms: string[];
  inferredTopic?: string;
  hasDiacritics: boolean;
}

const COMMON_SYNONYMS: Record<string, { term: string; topic: string }> = {
  // Marriage & Marital Status
  'giay doc than': { term: 'Giấy xác nhận tình trạng hôn nhân', topic: 'thu_tuc_ho_tich' },
  'xac nhan doc than': { term: 'Giấy xác nhận tình trạng hôn nhân', topic: 'thu_tuc_ho_tich' },
  'xin giay doc than': { term: 'Giấy xác nhận tình trạng hôn nhân', topic: 'thu_tuc_ho_tich' },
  'lam giay doc than': { term: 'Giấy xác nhận tình trạng hôn nhân', topic: 'thu_tuc_ho_tich' },
  'lay vo': { term: 'Đăng ký kết hôn', topic: 'thu_tuc_ho_tich' },
  'lay chong': { term: 'Đăng ký kết hôn', topic: 'thu_tuc_ho_tich' },
  'ket hon': { term: 'Đăng ký kết hôn', topic: 'thu_tuc_ho_tich' },
  'dang ky ket hon': { term: 'Đăng ký kết hôn', topic: 'thu_tuc_ho_tich' },

  // Birth & Death
  'khai sinh': { term: 'Đăng ký khai sinh', topic: 'thu_tuc_ho_tich' },
  'lam khai sinh': { term: 'Đăng ký khai sinh', topic: 'thu_tuc_ho_tich' },
  'sinh con': { term: 'Đăng ký khai sinh liên thông 3 trong 1', topic: 'thu_tuc_ho_tich' },
  'khai tu': { term: 'Đăng ký khai tử', topic: 'thu_tuc_ho_tich' },
  'qua doi': { term: 'Đăng ký khai tử', topic: 'thu_tuc_ho_tich' },

  // Authentication & Copies
  'sao y': { term: 'Chứng thực bản sao từ bản chính', topic: 'chung_thuc' },
  'sao y cong chung': { term: 'Chứng thực bản sao từ bản chính', topic: 'chung_thuc' },
  'cong chung': { term: 'Chứng thực bản sao từ bản chính', topic: 'chung_thuc' },
  'chung thuc': { term: 'Chứng thực chữ ký và bản sao', topic: 'chung_thuc' },
  'ky ten': { term: 'Chứng thực chữ ký', topic: 'chung_thuc' },

  // Social Welfare & Aid
  'xin ho tro': { term: 'Hồ sơ trợ cấp an sinh xã hội', topic: 'an_sinh' },
  'tro cap': { term: 'Trợ cấp bảo trợ xã hội hàng tháng', topic: 'an_sinh' },
  'nguoi cao tuoi': { term: 'Trợ cấp người cao tuổi từ 80 tuổi', topic: 'an_sinh' },
  'khuyet tat': { term: 'Trợ cấp người khuyết tật', topic: 'an_sinh' },
  'nha dai doan ket': { term: 'Xây dựng sửa chữa nhà Đại đoàn kết', topic: 'an_sinh' },
  'quy vi nguoi ngheo': { term: 'Quỹ Vì người nghèo MTTQ Phường', topic: 'an_sinh' },

  // Socio-Political Organizations
  'mttq': { term: 'Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp', topic: 'mat_tran' },
  'mat tran': { term: 'Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp', topic: 'mat_tran' },
  'doan thanh nien': { term: 'Đoàn TNCS Hồ Chí Minh Phường Chánh Hiệp', topic: 'doan_the' },
  'doan phuong': { term: 'Đoàn TNCS Hồ Chí Minh Phường Chánh Hiệp', topic: 'doan_the' },
  'hoi phu nu': { term: 'Hội Liên hiệp Phụ nữ Phường Chánh Hiệp', topic: 'doan_the' },
  'cuu chien binh': { term: 'Hội Cựu chiến binh Phường Chánh Hiệp', topic: 'doan_the' },
  'chu thap do': { term: 'Hội Chữ thập đỏ Phường Chánh Hiệp', topic: 'doan_the' },
  'cong doan': { term: 'Công đoàn Phường Chánh Hiệp', topic: 'doan_the' },

  // Contact & Guidance
  'toi gap ai': { term: 'Đầu mối cán bộ tiếp dân và bộ phận chuyên môn', topic: 'can_bo' },
  'gap ai': { term: 'Đầu mối cán bộ phụ trách chuyên môn', topic: 'can_bo' },
  'liên hệ ai': { term: 'Đầu mối cán bộ phụ trách chuyên môn', topic: 'can_bo' },
  'so dien thoai': { term: 'Đường dây nóng và số điện thoại công vụ', topic: 'lien_he' },

  // Map & Locations
  'van phong khu pho': { term: 'Văn phòng Ban Điều hành 21 Khu phố', topic: 'ban_do' },
  'tru so': { term: 'Trụ sở HĐND - UBND - MTTQ Phường Chánh Hiệp', topic: 'ban_do' },
  'dinh hoa 5': { term: 'Khu phố Định Hòa 5 (Số 1240 Đại Lộ Bình Dương)', topic: 'ban_do' },
  'cong an': { term: 'Công an Phường Chánh Hiệp (0274.3822.456)', topic: 'an_ninh' },
  'y te': { term: 'Trạm Y tế Phường Chánh Hiệp (0274.3833.115)', topic: 'y_te' }
};

/**
 * Strips Vietnamese diacritics / accents for robust matching
 */
export function removeVietnameseAccents(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

export class InputNormalizer {
  public static normalize(rawInput: string): NormalizedInput {
    const raw = (rawInput || '').trim();
    const hasDiacritics = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(raw);
    const unaccented = removeVietnameseAccents(raw);
    
    let normalized = raw;
    let inferredTopic: string | undefined;
    const administrativeTerms: string[] = [];

    // Check against synonym dictionary
    for (const [key, value] of Object.entries(COMMON_SYNONYMS)) {
      if (unaccented.includes(key)) {
        if (!administrativeTerms.includes(value.term)) {
          administrativeTerms.push(value.term);
        }
        if (!inferredTopic) {
          inferredTopic = value.topic;
        }
      }
    }

    return {
      raw,
      normalized,
      cleanedText: unaccented,
      administrativeTerms,
      inferredTopic,
      hasDiacritics
    };
  }
}
