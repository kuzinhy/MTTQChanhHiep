import { ProcedureItem } from '../types/procedure';

export const INITIAL_PROCEDURES: ProcedureItem[] = [
  {
    "id": "proc-01",
    "code": "2.000908",
    "name": "Cấp bản sao từ sổ gốc",
    "aliases": [
      "sao lục sổ gốc",
      "bản sao hộ tịch từ sổ gốc",
      "trích lục sổ gốc"
    ],
    "category": "Chứng thực",
    "description": "Thủ tục cấp bản sao các quyết định hành chính, hộ tịch hoặc văn bản lưu trữ chính thức từ sổ gốc lưu tại UBND Phường Chánh Hiệp.",
    "authority": "UBND Phường Chánh Hiệp",
    "locationId": "loc-mot-cua",
    "counter": "Quầy số 1 - Chứng thực & Hộ tịch",
    "onlineAvailable": true,
    "onlineUrl": "https://dichvucong.gov.vn",
    "processingTime": "Ngay trong ngày làm việc (nộp sau 15h giải quyết trong ngày làm việc tiếp theo)",
    "fee": "Miễn lệ phí",
    "officialSourceUrl": "https://dichvucong.gov.vn",
    "sourceUpdatedAt": "2025-11-13",
    "active": true,
    "sortOrder": 1,
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "documents": [
      {
        "id": "d1-1",
        "procedureId": "proc-01",
        "name": "Tờ khai cấp bản sao từ sổ gốc (theo mẫu)",
        "required": true,
        "quantity": "01 bản"
      },
      {
        "id": "d1-2",
        "procedureId": "proc-01",
        "name": "Xuất trình CCCD gắn chip hoặc tài khoản VNeID mức 2",
        "required": true,
        "quantity": "01 bản"
      },
      {
        "id": "d1-3",
        "procedureId": "proc-01",
        "name": "Giấy tờ chứng minh quan hệ gia đình/ủy quyền (nếu yêu cầu cho người khác)",
        "required": false,
        "quantity": "01 bản"
      }
    ],
    "forms": [
      {
        "id": "f1-1",
        "procedureId": "proc-01",
        "name": "Tờ khai cấp bản sao từ sổ gốc",
        "fileUrl": "#",
        "onlineUrl": "https://dichvucong.gov.vn"
      }
    ],
    "steps": [
      {
        "id": "s1-1",
        "procedureId": "proc-01",
        "stepNumber": 1,
        "title": "Nộp hồ sơ",
        "description": "Người dân nộp tờ khai và xuất trình giấy tờ cá nhân tại Quầy Một cửa hoặc trực tuyến.",
        "location": "Bộ phận Một cửa UBND Phường Chánh Hiệp",
        "counter": "Quầy số 1",
        "estimatedTime": "15 phút"
      },
      {
        "id": "s1-2",
        "procedureId": "proc-01",
        "stepNumber": 2,
        "title": "Kiểm tra đối chiếu",
        "description": "Cán bộ tiếp nhận kiểm tra tính hợp lệ của hồ sơ, đối chiếu dữ liệu sổ gốc điện tử/giấy.",
        "location": "Phòng Tư pháp - Hộ tịch Phường",
        "estimatedTime": "1 giờ"
      },
      {
        "id": "s1-3",
        "procedureId": "proc-01",
        "stepNumber": 3,
        "title": "Trình ký phê duyệt",
        "description": "Trình Lãnh đạo UBND Phường ký duyệt quyết định cấp bản sao.",
        "location": "Phòng Lãnh đạo UBND Phường",
        "estimatedTime": "1 giờ"
      },
      {
        "id": "s1-4",
        "procedureId": "proc-01",
        "stepNumber": 4,
        "title": "Trả kết quả",
        "description": "Nhận bản sao có chứng thực từ sổ gốc chính thức, nhận kết quả tại quầy Một cửa.",
        "location": "Quầy trả kết quả Một cửa Phường",
        "estimatedTime": "15 phút"
      }
    ]
  },
  {
    "id": "proc-02",
    "code": "2.000907",
    "name": "Chứng thực bản sao từ bản chính",
    "aliases": [
      "sao y bản chính",
      "photo công chứng",
      "chứng thực sao y"
    ],
    "category": "Chứng thực",
    "description": "Chứng thực tính chính xác của bản sao so với bản chính văn bản, giấy tờ do cơ quan, tổ chức có thẩm quyền của Việt Nam hoặc nước ngoài cấp.",
    "authority": "UBND Phường Chánh Hiệp",
    "locationId": "loc-mot-cua",
    "counter": "Quầy số 1 - Chứng thực & Hộ tịch",
    "onlineAvailable": true,
    "onlineUrl": "https://dichvucong.gov.vn",
    "processingTime": "Ngay trong ngày làm việc (nộp sau 15h giải quyết trong ngày làm việc tiếp theo)",
    "fee": "2.000 đồng/trang; từ trang thứ 3 trở lên thu 1.000 đồng/trang, tối đa 200.000 đồng/bản",
    "officialSourceUrl": "https://dichvucong.gov.vn",
    "sourceUpdatedAt": "2025-11-13",
    "active": true,
    "sortOrder": 2,
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "documents": [
      {
        "id": "d2-1",
        "procedureId": "proc-02",
        "name": "Bản chính giấy tờ, văn bản cần chứng thực",
        "required": true,
        "quantity": "01 bản gốc"
      },
      {
        "id": "d2-2",
        "procedureId": "proc-02",
        "name": "Bản sao (bản photo) tương ứng cần chứng thực",
        "required": true,
        "quantity": "Theo nhu cầu"
      },
      {
        "id": "d2-3",
        "procedureId": "proc-02",
        "name": "CCCD gắn chip hoặc tài khoản VNeID mức 2",
        "required": true,
        "quantity": "01 bản"
      }
    ],
    "forms": [],
    "steps": [
      {
        "id": "s2-1",
        "procedureId": "proc-02",
        "stepNumber": 1,
        "title": "Chuẩn bị bản chính & bản sao",
        "description": "Mang bản chính nguyên vẹn (không rách nát, sửa xóa trái phép) và các bản chụp sao cần chứng thực.",
        "location": "Tại nhà / Cá nhân"
      },
      {
        "id": "s2-2",
        "procedureId": "proc-02",
        "stepNumber": 2,
        "title": "Nộp tại Quầy Một cửa",
        "description": "Cán bộ Một cửa kiểm tra, số hóa hồ sơ và chuyển ngay phòng Tư pháp.",
        "location": "Bộ phận Một cửa UBND Phường Chánh Hiệp",
        "counter": "Quầy số 1",
        "estimatedTime": "15 phút"
      },
      {
        "id": "s2-3",
        "procedureId": "proc-02",
        "stepNumber": 3,
        "title": "Ký đóng dấu lời chứng",
        "description": "Cán bộ đối chiếu, ghi lời chứng chứng thực bản sao và đóng dấu giáp lai.",
        "location": "Phòng Tư pháp - Hộ tịch",
        "estimatedTime": "30 phút"
      },
      {
        "id": "s2-4",
        "procedureId": "proc-02",
        "stepNumber": 4,
        "title": "Nhận bản sao & Nộp lệ phí",
        "description": "Nhận lại bản chính, các bản sao chứng thực và thanh toán lệ phí theo trang.",
        "location": "Quầy trả kết quả Một cửa Phường",
        "estimatedTime": "15 phút"
      }
    ]
  },
  {
    "id": "proc-03",
    "code": "2.000906",
    "name": "Chứng thực chữ ký",
    "aliases": [
      "công chứng chữ ký",
      "chứng thực điểm chỉ",
      "chứng thực ký thay"
    ],
    "category": "Chứng thực",
    "description": "Chứng thực chữ ký hoặc dấu điểm chỉ của cá nhân trong các giấy tờ, văn bản tự lập (như cam kết, đơn từ, di chúc tự viết...).",
    "authority": "UBND Phường Chánh Hiệp",
    "locationId": "loc-mot-cua",
    "counter": "Quầy số 1 - Chứng thực & Hộ tịch",
    "onlineAvailable": false,
    "processingTime": "Ngay trong ngày làm việc",
    "fee": "10.000 đồng/trường hợp",
    "officialSourceUrl": "https://dichvucong.gov.vn",
    "sourceUpdatedAt": "2025-11-13",
    "active": true,
    "sortOrder": 3,
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "documents": [
      {
        "id": "d3-1",
        "procedureId": "proc-03",
        "name": "Giấy tờ, văn bản cần chứng thực chữ ký",
        "required": true,
        "quantity": "Theo nhu cầu"
      },
      {
        "id": "d3-2",
        "procedureId": "proc-03",
        "name": "Bản chính CCCD gắn chip hoặc VNeID mức 2",
        "required": true,
        "quantity": "01 bản"
      }
    ],
    "forms": [],
    "steps": [
      {
        "id": "s3-1",
        "procedureId": "proc-03",
        "stepNumber": 1,
        "title": "Nộp hồ sơ trực tiếp",
        "description": "Người dân trực tiếp xuất trình CCCD và văn bản cần chứng thực tại quầy. KHÔNG KÝ TRƯỚC VĂN BẢN.",
        "location": "Bộ phận Một cửa UBND Phường Chánh Hiệp",
        "counter": "Quầy số 1",
        "estimatedTime": "10 phút"
      },
      {
        "id": "s3-2",
        "procedureId": "proc-03",
        "stepNumber": 2,
        "title": "Ký trước mặt Cán bộ",
        "description": "Người yêu cầu trực tiếp ký hoặc điểm chỉ vào văn bản trước mặt cán bộ tiếp nhận.",
        "location": "Quầy số 1 - Một cửa",
        "estimatedTime": "5 phút"
      },
      {
        "id": "s3-3",
        "procedureId": "proc-03",
        "stepNumber": 3,
        "title": "Lời chứng & Đóng dấu",
        "description": "Cán bộ Tư pháp viết lời chứng chứng thực chữ ký và đóng dấu cơ quan.",
        "location": "Phòng Tư pháp - Hộ tịch",
        "estimatedTime": "20 phút"
      },
      {
        "id": "s3-4",
        "procedureId": "proc-03",
        "stepNumber": 4,
        "title": "Nhận kết quả và nộp lệ phí",
        "description": "Người dân thanh toán lệ phí 10.000đ/trường hợp và nhận lại văn bản đã chứng thực.",
        "location": "Quầy trả kết quả Một cửa Phường",
        "estimatedTime": "10 phút"
      }
    ]
  },
  {
    "id": "proc-04",
    "code": "2.000905",
    "name": "Chứng thực chữ ký người dịch (Cộng tác viên)",
    "aliases": [
      "công chứng bản dịch",
      "chứng thực bản dịch CTV",
      "dịch thuật công chứng"
    ],
    "category": "Chứng thực",
    "description": "Chứng thực chữ ký của người dịch là cộng tác viên dịch thuật đã đăng ký danh sách cơ hữu tại UBND Phường Chánh Hiệp.",
    "authority": "UBND Phường Chánh Hiệp",
    "locationId": "loc-mot-cua",
    "counter": "Quầy số 1 - Chứng thực & Hộ tịch",
    "onlineAvailable": true,
    "onlineUrl": "https://dichvucong.gov.vn",
    "processingTime": "Ngay trong ngày làm việc (nộp sau 15h giải quyết trong ngày làm việc tiếp theo, hoặc có thể gia hạn nếu hồ sơ dài)",
    "fee": "10.000 đồng/trường hợp",
    "officialSourceUrl": "https://dichvucong.gov.vn",
    "sourceUpdatedAt": "2025-11-13",
    "active": true,
    "sortOrder": 4,
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "documents": [
      {
        "id": "d4-1",
        "procedureId": "proc-04",
        "name": "Bản chính văn bản, giấy tờ cần dịch",
        "required": true,
        "quantity": "01 bản gốc"
      },
      {
        "id": "d4-2",
        "procedureId": "proc-04",
        "name": "Bản dịch hoàn chỉnh (do CTV thực hiện)",
        "required": true,
        "quantity": "Theo nhu cầu"
      },
      {
        "id": "d4-3",
        "procedureId": "proc-04",
        "name": "CCCD và Giấy tờ chứng minh là CTV dịch thuật của Phường",
        "required": true,
        "quantity": "01 bản"
      }
    ],
    "forms": [],
    "steps": [
      {
        "id": "s4-1",
        "procedureId": "proc-04",
        "stepNumber": 1,
        "title": "Nộp hồ sơ bản gốc & bản dịch",
        "description": "Cộng tác viên nộp bản gốc và bản dịch tương ứng tại Một cửa.",
        "location": "Bộ phận Một cửa UBND Phường Chánh Hiệp",
        "counter": "Quầy số 1",
        "estimatedTime": "15 phút"
      },
      {
        "id": "s4-2",
        "procedureId": "proc-04",
        "stepNumber": 2,
        "title": "Ký trước mặt cán bộ",
        "description": "CTV ký tên vào bản dịch trực tiếp trước mặt cán bộ Một cửa kiểm tra đối chiếu.",
        "location": "Quầy Một cửa",
        "estimatedTime": "5 phút"
      },
      {
        "id": "s4-3",
        "procedureId": "proc-04",
        "stepNumber": 3,
        "title": "Đóng dấu xác nhận",
        "description": "Cán bộ kiểm tra văn bằng chứng chỉ CTV, đóng dấu chứng thực chữ ký người dịch.",
        "location": "Phòng Tư pháp - Hộ tịch",
        "estimatedTime": "1 giờ"
      },
      {
        "id": "s4-4",
        "procedureId": "proc-04",
        "stepNumber": 4,
        "title": "Trả kết quả",
        "description": "Nhận bản dịch đã được đóng dấu công chứng chữ ký người dịch.",
        "location": "Quầy trả kết quả Một cửa",
        "estimatedTime": "10 phút"
      }
    ]
  },
  {
    "id": "proc-05",
    "code": "2.000904",
    "name": "Chứng thực chữ ký người dịch (Không phải CTV)",
    "aliases": [
      "chứng thực chữ ký người dịch tự do",
      "công chứng bản dịch tự dịch",
      "chứng thực bản dịch lẻ"
    ],
    "category": "Chứng thực",
    "description": "Chứng thực chữ ký của người dịch không có trong danh sách cộng tác viên của UBND Phường, yêu cầu người dịch có bằng đại học ngoại ngữ phù hợp.",
    "authority": "UBND Phường Chánh Hiệp",
    "locationId": "loc-mot-cua",
    "counter": "Quầy số 1 - Chứng thực & Hộ tịch",
    "onlineAvailable": false,
    "processingTime": "Ngay trong ngày làm việc",
    "fee": "10.000 đồng/trường hợp",
    "officialSourceUrl": "https://dichvucong.gov.vn",
    "sourceUpdatedAt": "2025-11-13",
    "active": true,
    "sortOrder": 5,
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "documents": [
      {
        "id": "d5-1",
        "procedureId": "proc-05",
        "name": "Bản gốc giấy tờ cần dịch",
        "required": true,
        "quantity": "01 bản gốc"
      },
      {
        "id": "d5-2",
        "procedureId": "proc-05",
        "name": "Bản dịch kèm theo",
        "required": true,
        "quantity": "Theo nhu cầu"
      },
      {
        "id": "d5-3",
        "procedureId": "proc-05",
        "name": "Bằng tốt nghiệp Đại học chuyên ngành ngoại ngữ tương ứng (hoặc tương đương)",
        "required": true,
        "quantity": "01 bản gốc và 01 bản photo đối chiếu"
      },
      {
        "id": "d5-4",
        "procedureId": "proc-05",
        "name": "CCCD gắn chip của người dịch",
        "required": true,
        "quantity": "01 bản"
      }
    ],
    "forms": [],
    "steps": [
      {
        "id": "s5-1",
        "procedureId": "proc-05",
        "stepNumber": 1,
        "title": "Nộp hồ sơ và văn bằng ngoại ngữ",
        "description": "Người dịch trực tiếp mang theo bằng đại học ngoại ngữ gốc và bản dịch đến quầy Một cửa.",
        "location": "Bộ phận Một cửa UBND Phường Chánh Hiệp",
        "counter": "Quầy số 1",
        "estimatedTime": "20 phút"
      },
      {
        "id": "s5-2",
        "procedureId": "proc-05",
        "stepNumber": 2,
        "title": "Ký cam kết dịch đúng",
        "description": "Người dịch tự ký tên vào bản dịch trực tiếp trước mặt cán bộ và chịu trách nhiệm pháp lý.",
        "location": "Quầy Một cửa",
        "estimatedTime": "10 phút"
      },
      {
        "id": "s5-3",
        "procedureId": "proc-05",
        "stepNumber": 3,
        "title": "Kiểm tra bằng cấp & Đóng dấu",
        "description": "Cán bộ đối chiếu bằng đại học ngoại ngữ gốc, đóng dấu giáp lai và ký lời chứng.",
        "location": "Phòng Tư pháp - Hộ tịch",
        "estimatedTime": "1 giờ"
      },
      {
        "id": "s5-4",
        "procedureId": "proc-05",
        "stepNumber": 4,
        "title": "Nhận bản dịch chứng thực",
        "description": "Nhận lại bản gốc giấy tờ, bằng cấp và bản dịch đã chứng thực chữ ký người dịch.",
        "location": "Quầy trả kết quả Một cửa",
        "estimatedTime": "10 phút"
      }
    ]
  },
  {
    "id": "proc-06",
    "code": "2.000911",
    "name": "Chứng thực hợp đồng, giao dịch tài sản",
    "aliases": [
      "công chứng hợp đồng mua bán xe",
      "chứng thực mua bán đất",
      "chứng thực giao dịch động sản",
      "chuyển nhượng nhà đất"
    ],
    "category": "Chứng thực",
    "description": "Thủ tục chứng thực hợp đồng, giao dịch dân sự liên quan đến động sản, quyền sử dụng đất, nhà ở trên địa bàn phường.",
    "authority": "UBND Phường Chánh Hiệp",
    "locationId": "loc-mot-cua",
    "counter": "Quầy số 1 - Chứng thực & Hộ tịch",
    "onlineAvailable": true,
    "onlineUrl": "https://dichvucong.gov.vn",
    "processingTime": "Không quá 02 ngày làm việc (trong ngày đối với các giao dịch đơn giản)",
    "fee": "50.000 đồng/giao dịch",
    "officialSourceUrl": "https://dichvucong.gov.vn",
    "sourceUpdatedAt": "2025-11-13",
    "active": true,
    "sortOrder": 6,
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "documents": [
      {
        "id": "d6-1",
        "procedureId": "proc-06",
        "name": "Dự thảo Hợp đồng, Giao dịch (mua bán, tặng cho, thế chấp...)",
        "required": true,
        "quantity": "03 bản gốc"
      },
      {
        "id": "d6-2",
        "procedureId": "proc-06",
        "name": "Giấy chứng nhận quyền sở hữu tài sản (Sổ đỏ, Đăng ký xe gốc...)",
        "required": true,
        "quantity": "01 bản gốc kèm bản photo đối chiếu"
      },
      {
        "id": "d6-3",
        "procedureId": "proc-06",
        "name": "CCCD gắn chip của các bên tham gia giao dịch",
        "required": true,
        "quantity": "Các bản gốc đối chiếu"
      },
      {
        "id": "d6-4",
        "procedureId": "proc-06",
        "name": "Giấy tờ chứng minh tình trạng hôn nhân (Độc thân / Đăng ký kết hôn)",
        "required": true,
        "quantity": "01 bản"
      }
    ],
    "forms": [],
    "steps": [
      {
        "id": "s6-1",
        "procedureId": "proc-06",
        "stepNumber": 1,
        "title": "Chuẩn bị hồ sơ đầy đủ",
        "description": "Các bên lập sẵn dự thảo hợp đồng, chuẩn bị sổ hồng/đăng ký xe gốc và các giấy tờ tùy thân.",
        "location": "Tại nhà / Cá nhân"
      },
      {
        "id": "s6-2",
        "procedureId": "proc-06",
        "stepNumber": 2,
        "title": "Các bên cùng có mặt nộp hồ sơ",
        "description": "Tất cả các bên tham gia giao dịch cùng ký tên, điểm chỉ vào hợp đồng trực tiếp trước mặt cán bộ.",
        "location": "Bộ phận Một cửa UBND Phường Chánh Hiệp",
        "counter": "Quầy số 1",
        "estimatedTime": "30 phút"
      },
      {
        "id": "s6-3",
        "procedureId": "proc-06",
        "stepNumber": 3,
        "title": "Thẩm định hồ sơ & Trình ký",
        "description": "Cán bộ Tư pháp kiểm tra hiện trạng ngăn chặn tài sản, lập lời chứng và trình Chủ tịch UBND Phường ký.",
        "location": "Phòng Tư pháp & Lãnh đạo Phường",
        "estimatedTime": "1.5 ngày"
      },
      {
        "id": "s6-4",
        "procedureId": "proc-06",
        "stepNumber": 4,
        "title": "Nhận hợp đồng chứng thực",
        "description": "Các bên nộp lệ phí 50.000đ và nhận lại các bản hợp đồng đã đóng dấu chứng thực.",
        "location": "Quầy trả kết quả Một cửa",
        "estimatedTime": "15 phút"
      }
    ]
  },
  {
    "id": "proc-07",
    "code": "2.001019",
    "name": "Chứng thực di chúc",
    "aliases": [
      "lập di chúc thừa kế",
      "công chứng di chúc",
      "chứng thực di chúc tại phường"
    ],
    "category": "Chứng thực",
    "description": "Thủ tục lập và chứng thực di chúc của cá nhân nhằm định đoạt tài sản sau khi qua đời, yêu cầu người lập hoàn toàn minh mẫn.",
    "authority": "UBND Phường Chánh Hiệp",
    "locationId": "loc-mot-cua",
    "counter": "Quầy số 1 - Chứng thực & Hộ tịch",
    "onlineAvailable": false,
    "processingTime": "Không quá 02 ngày làm việc",
    "fee": "50.000 đồng/di chúc",
    "officialSourceUrl": "https://dichvucong.gov.vn",
    "sourceUpdatedAt": "2025-11-13",
    "active": true,
    "sortOrder": 7,
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "documents": [
      {
        "id": "d7-1",
        "procedureId": "proc-07",
        "name": "Dự thảo di chúc (nếu lập sẵn)",
        "required": false,
        "quantity": "03 bản"
      },
      {
        "id": "d7-2",
        "procedureId": "proc-07",
        "name": "Giấy khám sức khỏe xác nhận tinh thần minh mẫn (bắt buộc, cấp trong 30 ngày)",
        "required": true,
        "quantity": "01 bản gốc"
      },
      {
        "id": "d7-3",
        "procedureId": "proc-07",
        "name": "Giấy tờ sở hữu tài sản (Sổ đỏ, Sổ tiết kiệm gốc...)",
        "required": true,
        "quantity": "01 bản gốc kèm photo"
      },
      {
        "id": "d7-4",
        "procedureId": "proc-07",
        "name": "CCCD gắn chip của người lập di chúc",
        "required": true,
        "quantity": "01 bản chính"
      }
    ],
    "forms": [],
    "steps": [
      {
        "id": "s7-1",
        "procedureId": "proc-07",
        "stepNumber": 1,
        "title": "Khám sức khỏe minh mẫn",
        "description": "Người lập di chúc bắt buộc đi khám sức khỏe tại Bệnh viện đa khoa cấp huyện trở lên để có chứng nhận sức khỏe tâm thần.",
        "location": "Các cơ sở y tế có thẩm quyền"
      },
      {
        "id": "s7-2",
        "procedureId": "proc-07",
        "stepNumber": 2,
        "title": "Nộp hồ sơ tại Một cửa",
        "description": "Trực tiếp nộp hồ sơ, xuất trình các giấy tờ tài sản và sức khỏe.",
        "location": "Bộ phận Một cửa UBND Phường Chánh Hiệp",
        "counter": "Quầy số 1",
        "estimatedTime": "30 phút"
      },
      {
        "id": "s7-3",
        "procedureId": "proc-07",
        "stepNumber": 3,
        "title": "Ký di chúc trước mặt cán bộ",
        "description": "Người lập di chúc tự đọc/viết và ký vào di chúc trực tiếp trước sự chứng kiến của cán bộ Tư pháp.",
        "location": "Quầy Một cửa",
        "estimatedTime": "20 phút"
      },
      {
        "id": "s7-4",
        "procedureId": "proc-07",
        "stepNumber": 4,
        "title": "Lời chứng & Đóng dấu bảo mật",
        "description": "Lập lời chứng di chúc, trình ký đóng dấu niêm phong bảo quản di chúc.",
        "location": "Phòng Tư pháp & Lãnh đạo Phường",
        "estimatedTime": "1 ngày"
      },
      {
        "id": "s7-5",
        "procedureId": "proc-07",
        "stepNumber": 5,
        "title": "Nhận di chúc chứng thực",
        "description": "Nộp lệ phí 50.000đ và nhận lại bản di chúc đã chứng thực pháp lý.",
        "location": "Quầy trả kết quả Một cửa Phường",
        "estimatedTime": "15 phút"
      }
    ]
  },
  {
    "id": "proc-08",
    "code": "2.001016",
    "name": "Chứng thực văn bản từ chối nhận di sản",
    "aliases": [
      "từ chối nhận đất thừa kế",
      "từ chối di sản thừa kế",
      "khước từ di sản"
    ],
    "category": "Chứng thực",
    "description": "Chứng thực văn bản của người thừa kế bày tỏ ý chí từ chối nhận di sản thừa kế theo pháp luật hoặc theo di chúc.",
    "authority": "UBND Phường Chánh Hiệp",
    "locationId": "loc-mot-cua",
    "counter": "Quầy số 1 - Chứng thực & Hộ tịch",
    "onlineAvailable": true,
    "onlineUrl": "https://dichvucong.gov.vn",
    "processingTime": "Không quá 02 ngày làm việc",
    "fee": "50.000 đồng/văn bản",
    "officialSourceUrl": "https://dichvucong.gov.vn",
    "sourceUpdatedAt": "2025-11-13",
    "active": true,
    "sortOrder": 8,
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "documents": [
      {
        "id": "d8-1",
        "procedureId": "proc-08",
        "name": "Dự thảo văn bản từ chối nhận di sản thừa kế",
        "required": true,
        "quantity": "03 bản gốc"
      },
      {
        "id": "d8-2",
        "procedureId": "proc-08",
        "name": "Giấy chứng tử của người để lại di sản",
        "required": true,
        "quantity": "01 bản chính hoặc trích lục"
      },
      {
        "id": "d8-3",
        "procedureId": "proc-08",
        "name": "Giấy tờ chứng minh quan hệ thừa kế (Khai sinh, Đăng ký kết hôn, Hộ khẩu cũ...)",
        "required": true,
        "quantity": "01 bản"
      },
      {
        "id": "d8-4",
        "procedureId": "proc-08",
        "name": "Giấy tờ sở hữu di sản của người quá cố (Sổ đỏ, đăng ký xe...)",
        "required": true,
        "quantity": "01 bản gốc"
      }
    ],
    "forms": [],
    "steps": [
      {
        "id": "s8-1",
        "procedureId": "proc-08",
        "stepNumber": 1,
        "title": "Chuẩn bị hồ sơ di sản",
        "description": "Người từ chối chuẩn bị văn bản từ chối nộp kèm các chứng nhận khai tử và quan hệ thừa kế.",
        "location": "Tại nhà / Cá nhân"
      },
      {
        "id": "s8-2",
        "procedureId": "proc-08",
        "stepNumber": 2,
        "title": "Ký từ chối trước mặt cán bộ",
        "description": "Trực tiếp có mặt tại quầy để ký văn bản từ chối trước sự giám sát của cán bộ Tư pháp.",
        "location": "Bộ phận Một cửa UBND Phường Chánh Hiệp",
        "counter": "Quầy số 1",
        "estimatedTime": "20 phút"
      },
      {
        "id": "s8-3",
        "procedureId": "proc-08",
        "stepNumber": 3,
        "title": "Thẩm tra & Ký đóng dấu",
        "description": "Cán bộ Một cửa thụ lý hồ sơ, kiểm tra di chúc/diện thừa kế và trình phê duyệt.",
        "location": "Phòng Tư pháp & Lãnh đạo Phường",
        "estimatedTime": "1 ngày"
      },
      {
        "id": "s8-4",
        "procedureId": "proc-08",
        "stepNumber": 4,
        "title": "Nhận văn bản đã chứng thực",
        "description": "Nhận lại văn bản từ chối di sản đã được chứng thực hợp pháp để làm thủ tục sang tên thừa kế.",
        "location": "Quầy trả kết quả Một cửa",
        "estimatedTime": "10 phút"
      }
    ]
  },
  {
    "id": "proc-09",
    "code": "2.001015",
    "name": "Chứng thực văn bản phân chia di sản",
    "aliases": [
      "văn bản thỏa thuận phân chia di sản",
      "chia đất thừa kế",
      "thỏa thuận thừa kế"
    ],
    "category": "Chứng thực",
    "description": "Chứng thực văn bản thỏa thuận phân chia quyền sở hữu di sản thừa kế của tất cả các đồng thừa kế theo pháp luật hoặc di chúc.",
    "authority": "UBND Phường Chánh Hiệp",
    "locationId": "loc-mot-cua",
    "counter": "Quầy số 1 - Chứng thực & Hộ tịch",
    "onlineAvailable": true,
    "onlineUrl": "https://dichvucong.gov.vn",
    "processingTime": "Không quá 02 ngày làm việc (kéo dài tối đa nếu có tranh chấp)",
    "fee": "50.000 đồng/văn bản",
    "officialSourceUrl": "https://dichvucong.gov.vn",
    "sourceUpdatedAt": "2025-11-13",
    "active": true,
    "sortOrder": 9,
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "documents": [
      {
        "id": "d9-1",
        "procedureId": "proc-09",
        "name": "Dự thảo văn bản thỏa thuận phân chia di sản thừa kế",
        "required": true,
        "quantity": "04 bản gốc"
      },
      {
        "id": "d9-2",
        "procedureId": "proc-09",
        "name": "Giấy chứng tử của người để lại di sản",
        "required": true,
        "quantity": "01 bản chính"
      },
      {
        "id": "d9-3",
        "procedureId": "proc-09",
        "name": "Giấy tờ chứng minh quan hệ thừa kế của tất cả các đồng thừa kế",
        "required": true,
        "quantity": "Các bản gốc đối chiếu"
      },
      {
        "id": "d9-4",
        "procedureId": "proc-09",
        "name": "Giấy tờ tài sản thừa kế gốc (Sổ đỏ, giấy tờ xe...)",
        "required": true,
        "quantity": "01 bản gốc"
      }
    ],
    "forms": [],
    "steps": [
      {
        "id": "s9-1",
        "procedureId": "proc-09",
        "stepNumber": 1,
        "title": "Tất cả đồng thừa kế tập hợp",
        "description": "Các đồng thừa kế chuẩn bị đầy đủ giấy tờ chứng minh diện thừa kế và thỏa thuận phân chia.",
        "location": "Tại nhà / Cá nhân"
      },
      {
        "id": "s9-2",
        "procedureId": "proc-09",
        "stepNumber": 2,
        "title": "Đồng ký tên tại Một cửa",
        "description": "Tất cả các đồng thừa kế phải cùng có mặt trực tiếp tại Một cửa để ký tên, điểm chỉ vào văn bản.",
        "location": "Bộ phận Một cửa UBND Phường Chánh Hiệp",
        "counter": "Quầy số 1",
        "estimatedTime": "40 phút"
      },
      {
        "id": "s9-3",
        "procedureId": "proc-09",
        "stepNumber": 3,
        "title": "Ghi lời chứng & Phê duyệt",
        "description": "Cán bộ Tư pháp rà soát thông tin diện thừa kế kỹ lưỡng, lập lời chứng phân chia di sản.",
        "location": "Phòng Tư pháp & Lãnh đạo Phường",
        "estimatedTime": "1.5 ngày"
      },
      {
        "id": "s9-4",
        "procedureId": "proc-09",
        "stepNumber": 4,
        "title": "Nhận kết quả thỏa thuận",
        "description": "Đóng lệ phí và nhận lại văn bản phân chia di sản đã được chứng thực để làm căn cứ sang tên tài sản.",
        "location": "Quầy trả kết quả Một cửa",
        "estimatedTime": "15 phút"
      }
    ]
  },
  {
    "id": "proc-10",
    "code": "2.000913",
    "name": "Sửa đổi, bổ sung, hủy bỏ giao dịch",
    "aliases": [
      "hủy hợp đồng mua bán xe",
      "sửa đổi hợp đồng đất",
      "bổ sung giao dịch đã ký"
    ],
    "category": "Chứng thực",
    "description": "Chứng thực việc các bên ký thỏa thuận sửa đổi, bổ sung một phần nội dung hoặc hủy bỏ hoàn toàn hợp đồng, giao dịch đã được chứng thực trước đó.",
    "authority": "UBND Phường Chánh Hiệp",
    "locationId": "loc-mot-cua",
    "counter": "Quầy số 1 - Chứng thực & Hộ tịch",
    "onlineAvailable": true,
    "onlineUrl": "https://dichvucong.gov.vn",
    "processingTime": "Ngay trong ngày làm việc (nộp sau 15h giải quyết trong ngày làm việc tiếp theo)",
    "fee": "30.000 đồng/giao dịch",
    "officialSourceUrl": "https://dichvucong.gov.vn",
    "sourceUpdatedAt": "2025-11-13",
    "active": true,
    "sortOrder": 10,
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "documents": [
      {
        "id": "d10-1",
        "procedureId": "proc-10",
        "name": "Hợp đồng, giao dịch gốc đã được chứng thực trước đây",
        "required": true,
        "quantity": "01 bản gốc"
      },
      {
        "id": "d10-2",
        "procedureId": "proc-10",
        "name": "Dự thảo Văn bản thỏa thuận sửa đổi, bổ sung hoặc hủy bỏ",
        "required": true,
        "quantity": "03 bản gốc"
      },
      {
        "id": "d10-3",
        "procedureId": "proc-10",
        "name": "CCCD gắn chip của các bên tham gia giao dịch gốc",
        "required": true,
        "quantity": "Bản chính đối chiếu"
      }
    ],
    "forms": [],
    "steps": [
      {
        "id": "s10-1",
        "procedureId": "proc-10",
        "stepNumber": 1,
        "title": "Nộp hợp đồng gốc & văn bản mới",
        "description": "Các bên mang hợp đồng gốc đã công chứng trước đây đến quầy nộp hồ sơ.",
        "location": "Bộ phận Một cửa UBND Phường Chánh Hiệp",
        "counter": "Quầy số 1",
        "estimatedTime": "20 phút"
      },
      {
        "id": "s10-2",
        "procedureId": "proc-10",
        "stepNumber": 2,
        "title": "Ký thỏa thuận mới tại quầy",
        "description": "Các bên cùng có mặt ký tên vào văn bản sửa đổi/bổ sung/hủy bỏ hợp đồng gốc.",
        "location": "Bộ phận Một cửa",
        "estimatedTime": "15 phút"
      },
      {
        "id": "s10-3",
        "procedureId": "proc-10",
        "stepNumber": 3,
        "title": "Xử lý nghiệp vụ lời chứng",
        "description": "Cán bộ lập lời chứng ghi nhận sự thay đổi giao dịch gốc, đồng thời ghi chú vào sổ lưu trữ.",
        "location": "Phòng Tư pháp - Hộ tịch",
        "estimatedTime": "1 giờ"
      },
      {
        "id": "s10-4",
        "procedureId": "proc-10",
        "stepNumber": 4,
        "title": "Nhận kết quả thỏa thuận mới",
        "description": "Nộp lệ phí 30.000đ và nhận văn bản chứng thực thay đổi hợp đồng gốc.",
        "location": "Quầy trả kết quả Một cửa",
        "estimatedTime": "10 phút"
      }
    ]
  },
  {
    "id": "proc-11",
    "code": "2.000927",
    "name": "Sửa lỗi sai sót trong giao dịch",
    "aliases": [
      "đính chính hợp đồng",
      "sửa lỗi kỹ thuật hợp đồng",
      "sửa thông tin sai trong văn bản ký"
    ],
    "category": "Chứng thực",
    "description": "Sửa lỗi sai sót về mặt kỹ thuật, ghi chép, tính toán trong hợp đồng, giao dịch đã chứng thực mà không làm thay đổi bản chất thỏa thuận.",
    "authority": "UBND Phường Chánh Hiệp",
    "locationId": "loc-mot-cua",
    "counter": "Quầy số 1 - Chứng thực & Hộ tịch",
    "onlineAvailable": true,
    "onlineUrl": "https://dichvucong.gov.vn",
    "processingTime": "Ngay trong ngày làm việc (hoặc trong ngày làm việc tiếp theo)",
    "fee": "25.000 đồng/giao dịch",
    "officialSourceUrl": "https://dichvucong.gov.vn",
    "sourceUpdatedAt": "2025-11-13",
    "active": true,
    "sortOrder": 11,
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "documents": [
      {
        "id": "d11-1",
        "procedureId": "proc-11",
        "name": "Hợp đồng, giao dịch gốc đã chứng thực có lỗi sai sót",
        "required": true,
        "quantity": "01 bản gốc"
      },
      {
        "id": "d11-2",
        "procedureId": "proc-11",
        "name": "Giấy tờ tài liệu làm căn cứ chứng minh lỗi sai sót (như CCCD đúng, Sổ đỏ đúng đối chiếu)",
        "required": true,
        "quantity": "Bản chính đối chiếu"
      },
      {
        "id": "d11-3",
        "procedureId": "proc-11",
        "name": "Văn bản đề nghị đính chính / sửa lỗi sai sót của các bên",
        "required": true,
        "quantity": "01 bản"
      }
    ],
    "forms": [],
    "steps": [
      {
        "id": "s11-1",
        "procedureId": "proc-11",
        "stepNumber": 1,
        "title": "Nộp hồ sơ đính chính",
        "description": "Người dân nộp hợp đồng gốc bị lỗi cùng tài liệu chứng minh thông tin đúng.",
        "location": "Bộ phận Một cửa UBND Phường Chánh Hiệp",
        "counter": "Quầy số 1",
        "estimatedTime": "15 phút"
      },
      {
        "id": "s11-2",
        "procedureId": "proc-11",
        "stepNumber": 2,
        "title": "Kiểm tra lỗi kỹ thuật",
        "description": "Cán bộ Tư pháp rà soát thông tin sai lệch, gạch chân lỗi sai và ghi chú nội dung đính chính vào bên lề văn bản gốc.",
        "location": "Phòng Tư pháp - Hộ tịch",
        "estimatedTime": "1 giờ"
      },
      {
        "id": "s11-3",
        "procedureId": "proc-11",
        "stepNumber": 3,
        "title": "Vào sổ lưu trữ",
        "description": "Cán bộ lưu thông tin đính chính vào sổ chứng thực giao dịch gốc của phường.",
        "location": "Phòng Tư pháp",
        "estimatedTime": "30 phút"
      },
      {
        "id": "s11-4",
        "procedureId": "proc-11",
        "stepNumber": 4,
        "title": "Nhận hợp đồng đính chính",
        "description": "Nhận lại hợp đồng đã có chữ ký, đóng dấu đính chính lỗi sai của Lãnh đạo Phường.",
        "location": "Quầy trả kết quả Một cửa",
        "estimatedTime": "10"
      }
    ]
  },
  {
    "id": "proc-12",
    "code": "2.000942",
    "name": "Cấp bản sao giao dịch đã chứng thực",
    "aliases": [
      "sao lục hợp đồng đất",
      "xin cấp lại hợp đồng mua xe",
      "bản sao hợp đồng cũ"
    ],
    "category": "Chứng thực",
    "description": "Cấp bản sao có chứng thực từ bản chính hợp đồng, giao dịch đang được lưu trữ tại kho lưu trữ của UBND Phường Chánh Hiệp.",
    "authority": "UBND Phường Chánh Hiệp",
    "locationId": "loc-mot-cua",
    "counter": "Quầy số 1 - Chứng thực & Hộ tịch",
    "onlineAvailable": true,
    "onlineUrl": "https://dichvucong.gov.vn",
    "processingTime": "Ngay trong ngày làm việc (nộp sau 15h giải quyết trong ngày làm việc tiếp theo)",
    "fee": "2.000 đồng/trang; từ trang thứ 3 trở lên thu 1.000 đồng/trang, tối đa 200.000 đồng/bản",
    "officialSourceUrl": "https://dichvucong.gov.vn",
    "sourceUpdatedAt": "2025-11-13",
    "active": true,
    "sortOrder": 12,
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "documents": [
      {
        "id": "d12-1",
        "procedureId": "proc-12",
        "name": "Phiếu yêu cầu cấp bản sao hợp đồng, giao dịch đã chứng thực",
        "required": true,
        "quantity": "01 bản"
      },
      {
        "id": "d12-2",
        "procedureId": "proc-12",
        "name": "CCCD gắn chip của người có quyền/nghĩa vụ liên quan trong giao dịch gốc",
        "required": true,
        "quantity": "01 bản chính"
      },
      {
        "id": "d12-3",
        "procedureId": "proc-12",
        "name": "Văn bản chứng minh là người thừa kế / được ủy quyền hợp pháp (nếu không phải là chủ thể gốc)",
        "required": false,
        "quantity": "01 bản gốc"
      }
    ],
    "forms": [
      {
        "id": "f12-1",
        "procedureId": "proc-12",
        "name": "Phiếu yêu cầu cấp bản sao hợp đồng giao dịch",
        "fileUrl": "#",
        "onlineUrl": "https://dichvucong.gov.vn"
      }
    ],
    "steps": [
      {
        "id": "s12-1",
        "procedureId": "proc-12",
        "stepNumber": 1,
        "title": "Nộp phiếu yêu cầu sao lục",
        "description": "Người dân điền phiếu yêu cầu, nộp kèm CCCD gắn chip tại quầy Một cửa.",
        "location": "Bộ phận Một cửa UBND Phường Chánh Hiệp",
        "counter": "Quầy số 1",
        "estimatedTime": "15 phút"
      },
      {
        "id": "s12-2",
        "procedureId": "proc-12",
        "stepNumber": 2,
        "title": "Tra cứu lục tìm hồ sơ gốc",
        "description": "Cán bộ vào kho lưu trữ hoặc Hệ thống Một cửa điện tử tra số hợp đồng, in lục lại bản chính gốc.",
        "location": "Phòng Lưu trữ UBND Phường",
        "estimatedTime": "1 giờ"
      },
      {
        "id": "s12-3",
        "procedureId": "proc-12",
        "stepNumber": 3,
        "title": "Ghi lời chứng sao lục",
        "description": "Cán bộ ghi lời chứng cấp bản sao từ bản chính giao dịch đã lưu trữ, đóng dấu xác nhận.",
        "location": "Phòng Tư pháp - Hộ tịch",
        "estimatedTime": "30 phút"
      },
      {
        "id": "s12-4",
        "procedureId": "proc-12",
        "stepNumber": 4,
        "title": "Trả kết quả & đóng lệ phí",
        "description": "Nộp lệ phí theo số lượng trang và nhận lại các bản sao giao dịch có giá trị pháp lý.",
        "location": "Quầy trả kết quả Một cửa",
        "estimatedTime": "10 phút"
      }
    ]
  }
];
