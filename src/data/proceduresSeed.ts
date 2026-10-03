import { ProcedureItem } from '../types/procedure';

export const INITIAL_PROCEDURES: ProcedureItem[] = [
  {
    id: 'proc-01',
    code: 'T-CT-01',
    name: 'Chứng thực bản sao từ bản chính',
    aliases: ['sao y', 'photo công chứng', 'chứng thực bản photo', 'sao y bản chính'],
    category: 'Chứng thực',
    description: 'Thủ tục chứng thực tính chính xác, đúng với bản chính của các giấy tờ, văn bản do cơ quan, tổ chức có thẩm quyền cấp.',
    authority: 'UBND Phường Chánh Hiệp',
    locationId: 'loc-mot-cua',
    counter: 'Quầy số 1 - Chứng thực & Căn cước',
    onlineAvailable: true,
    onlineUrl: 'https://dichvucong.binhduong.gov.vn',
    processingTime: 'Trong ngày (nhận kết quả ngay với số lượng dưới 10 bản)',
    fee: '2.000 VNĐ / trang (từ trang thứ 3 trở đi: 1.000 VNĐ/trang)',
    officialSourceUrl: 'https://thutuchanh chính.gov.vn',
    sourceUpdatedAt: '2026-03-01',
    active: true,
    sortOrder: 1,
    version: 'v1.0',
    updatedAt: '2026-03-01 08:30',
    updatedBy: 'Cán bộ Tư pháp - Hộ tịch',
    documents: [
      { id: 'd1-1', procedureId: 'proc-01', name: 'Bản chính giấy tờ, văn bản cần chứng thực', required: true, quantity: '01 bản' },
      { id: 'd1-2', procedureId: 'proc-01', name: 'Bản photo/bản sao cần chứng thực (số lượng tương ứng cần lấy)', required: true, quantity: 'Theo nhu cầu' },
      { id: 'd1-3', procedureId: 'proc-01', name: 'CCCD gắn chip hoặc VNeID mức 2 của người yêu cầu', required: true, quantity: '01 bản' }
    ],
    forms: [
      { id: 'f1-1', procedureId: 'proc-01', name: 'Phiếu yêu cầu chứng thực bản sao', fileUrl: '#', onlineUrl: '#' }
    ],
    steps: [
      {
        id: 's1-1',
        procedureId: 'proc-01',
        stepNumber: 1,
        title: 'Chuẩn bị hồ sơ',
        description: 'Chuẩn bị bản chính giấy tờ và bản photo cần chứng thực.',
        instruction: 'Mang theo bản chính (còn nguyên vẹn, không rách nát, tẩy xóa) và bản photo tương ứng.',
        location: 'Chuẩn bị tại nhà / cá nhân',
        requiredDocuments: ['Bản chính giấy tờ', 'CCCD / VNeID'],
        notes: 'Bản chính không thuộc các trường hợp pháp luật cấm chứng thực (như giấy tờ bị tẩy xóa, sửa chữa...).'
      },
      {
        id: 's1-2',
        procedureId: 'proc-01',
        stepNumber: 2,
        title: 'Đến Bộ phận Một cửa',
        description: 'Di chuyển đến Trụ sở UBND Phường Chánh Hiệp.',
        instruction: 'Đến trực tiếp Bộ phận Tiếp nhận và Trả kết quả (Bộ phận Một cửa).',
        location: 'Trụ sở UBND Phường Chánh Hiệp (Số 1240 Đại lộ Bình Dương)',
        counter: 'Quầy số 1 - Chứng thực',
        officerUnit: 'Bộ phận Tư pháp - Hộ tịch'
      },
      {
        id: 's1-3',
        procedureId: 'proc-01',
        stepNumber: 3,
        title: 'Nộp hồ sơ & Kiểm tra',
        description: 'Cán bộ tiếp nhận đối chiếu bản chính và bản sao.',
        instruction: 'Nộp hồ sơ tại Quầy số 1. Cán bộ đối chiếu bản chính với bản sao, kiểm tra tính hợp lệ.',
        requiredDocuments: ['Bản chính', 'Bản photo'],
        notes: 'Thời gian kiểm tra nhanh chóng, lấy số thứ tự tại quầy đón tiếp.'
      },
      {
        id: 's1-4',
        procedureId: 'proc-01',
        stepNumber: 4,
        title: 'Xử lý & Ký chứng thực',
        description: 'Cán bộ thực hiện ký, đóng dấu chứng thực.',
        instruction: 'Hệ thống Một cửa ghi sổ, ký và đóng dấu theo quy định pháp luật.',
        estimatedTime: '15 - 30 phút'
      },
      {
        id: 's1-5',
        procedureId: 'proc-01',
        stepNumber: 5,
        title: 'Nhận kết quả',
        description: 'Nhận bản sao đã chứng thực và nộp lệ phí.',
        instruction: 'Nhận lại bản chính và các bản sao đã chứng thực, nộp lệ phí theo quy định.',
        location: 'Quầy trả kết quả - Bộ phận Một cửa UBND Phường'
      }
    ]
  },
  {
    id: 'proc-02',
    code: 'T-HT-02',
    name: 'Cấp Giấy xác nhận tình trạng hôn nhân',
    aliases: ['giấy độc thân', 'xác nhận độc thân', 'giấy xác nhận tình trạng hôn nhân', 'chứng nhận độc thân'],
    category: 'Hộ tịch',
    description: 'Thủ tục cấp Giấy xác nhận tình trạng hôn nhân cho công dân Việt Nam cư trú trên địa bàn phường phục vụ mục đích kết hôn hoặc giao dịch dân sự.',
    authority: 'UBND Phường Chánh Hiệp',
    locationId: 'loc-mot-cua',
    counter: 'Quầy số 2 - Hộ tịch & Trích lục',
    onlineAvailable: true,
    onlineUrl: 'https://dichvucong.gov.vn',
    processingTime: 'Trong ngày làm việc (khi hồ sơ đầy đủ, hợp lệ)',
    fee: '15.000 VNĐ / bản',
    officialSourceUrl: 'https://dichvucong.gov.vn',
    sourceUpdatedAt: '2026-03-01',
    active: true,
    sortOrder: 2,
    version: 'v1.0',
    updatedAt: '2026-03-01 08:30',
    updatedBy: 'Cán bộ Hộ tịch',
    documents: [
      { id: 'd2-1', procedureId: 'proc-02', name: 'Tờ khai cấp Giấy xác nhận tình trạng hôn nhân (theo mẫu)', required: true, quantity: '01 bản' },
      { id: 'd2-2', procedureId: 'proc-02', name: 'CCCD hoặc VNeID mức 2 của người yêu cầu', required: true, quantity: '01 bản' },
      { id: 'd2-3', procedureId: 'proc-02', name: 'Trích lục Bản án/Quyết định ly hôn của Tòa án (nếu đã ly hôn)', required: false, quantity: '01 bản' },
      { id: 'd2-4', procedureId: 'proc-02', name: 'Giấy chứng tử của vợ/chồng (nếu vợ/chồng đã mất)', required: false, quantity: '01 bản' }
    ],
    forms: [
      { id: 'f2-1', procedureId: 'proc-02', name: 'Tờ khai cấp Giấy xác nhận tình trạng hôn nhân', fileUrl: '#', onlineUrl: '#' }
    ],
    steps: [
      {
        id: 's2-1',
        procedureId: 'proc-02',
        stepNumber: 1,
        title: 'Chuẩn bị hồ sơ',
        description: 'Điền tờ khai và chuẩn bị giấy tờ định danh, giấy tờ ly hôn (nếu có).',
        instruction: 'Tải tờ khai hoặc điền trực tiếp tại Bộ phận Một cửa.',
        formName: 'Tờ khai cấp Giấy xác nhận tình trạng hôn nhân'
      },
      {
        id: 's2-2',
        procedureId: 'proc-02',
        stepNumber: 2,
        title: 'Đến Bộ phận Một cửa',
        description: 'Nộp hồ sơ trực tiếp tại Quầy Hộ tịch.',
        location: 'Trụ sở UBND Phường Chánh Hiệp',
        counter: 'Quầy số 2 - Hộ tịch',
        officerUnit: 'Bộ phận Tư pháp - Hộ tịch'
      },
      {
        id: 's2-3',
        procedureId: 'proc-02',
        stepNumber: 3,
        title: 'Nộp hồ sơ & Kiểm tra',
        description: 'Cán bộ kiểm tra tình trạng hôn nhân trong Cơ sở dữ liệu hộ tịch.',
        instruction: 'Nộp tờ khai và xuất trình CCCD để cán bộ tra cứu dữ liệu dân cư và tình trạng hôn nhân.',
        requiredDocuments: ['Tờ khai', 'CCCD']
      },
      {
        id: 's2-4',
        procedureId: 'proc-02',
        stepNumber: 4,
        title: 'Xử lý & Ký duyệt',
        description: 'Lãnh đạo UBND phường ký xác nhận.',
        estimatedTime: 'Trong ngày làm việc'
      },
      {
        id: 's2-5',
        procedureId: 'proc-02',
        stepNumber: 5,
        title: 'Nhận kết quả',
        description: 'Nhận Giấy xác nhận tình trạng hôn nhân và nộp lệ phí.',
        location: 'Quầy trả kết quả - Bộ phận Một cửa'
      }
    ]
  },
  {
    id: 'proc-03',
    code: 'T-HT-03',
    name: 'Đăng ký khai sinh',
    aliases: ['làm giấy khai sinh', 'đăng ký khai sinh cho bé', 'làm giấy khai sinh cho con', 'khai sinh'],
    category: 'Hộ tịch',
    description: 'Thủ tục đăng ký khai sinh cho trẻ em mới sinh cư trú trên địa bàn phường.',
    authority: 'UBND Phường Chánh Hiệp',
    locationId: 'loc-mot-cua',
    counter: 'Quầy số 2 - Hộ tịch',
    onlineAvailable: true,
    onlineUrl: 'https://dichvucong.gov.vn',
    processingTime: 'Trong ngày làm việc',
    fee: 'Miễn phí đăng ký khai sinh lần đầu',
    officialSourceUrl: 'https://dichvucong.gov.vn',
    sourceUpdatedAt: '2026-03-01',
    active: true,
    sortOrder: 3,
    version: 'v1.0',
    updatedAt: '2026-03-01 08:30',
    updatedBy: 'Cán bộ Hộ tịch',
    documents: [
      { id: 'd3-1', procedureId: 'proc-03', name: 'Tờ khai đăng ký khai sinh (theo mẫu)', required: true, quantity: '01 bản' },
      { id: 'd3-2', procedureId: 'proc-03', name: 'Giấy chứng sinh do cơ sở y tế nơi trẻ sinh ra cấp', required: true, quantity: '01 bản chính' },
      { id: 'd3-3', procedureId: 'proc-03', name: 'CCCD hoặc VNeID của cha/mẹ trẻ', required: true, quantity: '01 bản' },
      { id: 'd3-4', procedureId: 'proc-03', name: 'Giấy chứng nhận kết hôn của cha mẹ (nếu đã kết hôn)', required: false, quantity: '01 bản' }
    ],
    forms: [
      { id: 'f3-1', procedureId: 'proc-03', name: 'Tờ khai đăng ký khai sinh', fileUrl: '#', onlineUrl: '#' }
    ],
    steps: [
      {
        id: 's3-1',
        procedureId: 'proc-03',
        stepNumber: 1,
        title: 'Chuẩn bị hồ sơ',
        description: 'Chuẩn bị Giấy chứng sinh bản chính và CCCD của cha/mẹ.',
        instruction: 'Điền tờ khai đăng ký khai sinh và chuẩn bị giấy chứng sinh từ bệnh viện.'
      },
      {
        id: 's3-2',
        procedureId: 'proc-03',
        stepNumber: 2,
        title: 'Đến Bộ phận Một cửa',
        description: 'Nộp hồ sơ trực tiếp tại Quầy Hộ tịch UBND Phường Chánh Hiệp.',
        counter: 'Quầy số 2 - Hộ tịch'
      },
      {
        id: 's3-3',
        procedureId: 'proc-03',
        stepNumber: 3,
        title: 'Nộp hồ sơ & Kiểm tra',
        description: 'Cán bộ hộ tịch kiểm tra thông tin khai sinh, cấp số định danh cá nhân cho trẻ.',
        requiredDocuments: ['Giấy chứng sinh', 'Tờ khai khai sinh', 'CCCD cha mẹ']
      },
      {
        id: 's3-4',
        procedureId: 'proc-03',
        stepNumber: 4,
        title: 'In Giấy khai sinh',
        description: 'Ký và đóng dấu bản chính Giấy khai sinh.',
        estimatedTime: 'Trong ngày'
      },
      {
        id: 's3-5',
        procedureId: 'proc-03',
        stepNumber: 5,
        title: 'Nhận kết quả',
        description: 'Nhận Giấy khai sinh chính thức (Miễn phí).',
        location: 'Quầy trả kết quả - Bộ phận Một cửa'
      }
    ]
  },
  {
    id: 'proc-04',
    code: 'T-HT-04',
    name: 'Đăng ký khai tử',
    aliases: ['khai tử', 'làm giấy khai tử', 'đăng ký tử tuất'],
    category: 'Hộ tịch',
    description: 'Thủ tục đăng ký khai tử cho người qua đời cư trú trên địa bàn phường.',
    authority: 'UBND Phường Chánh Hiệp',
    locationId: 'loc-mot-cua',
    counter: 'Quầy số 2 - Hộ tịch',
    onlineAvailable: true,
    onlineUrl: 'https://dichvucong.gov.vn',
    processingTime: 'Trong ngày làm việc',
    fee: 'Miễn phí',
    officialSourceUrl: 'https://dichvucong.gov.vn',
    sourceUpdatedAt: '2026-03-01',
    active: true,
    sortOrder: 4,
    version: 'v1.0',
    updatedAt: '2026-03-01 08:30',
    updatedBy: 'Cán bộ Hộ tịch',
    documents: [
      { id: 'd4-1', procedureId: 'proc-04', name: 'Tờ khai đăng ký khai tử (theo mẫu)', required: true, quantity: '01 bản' },
      { id: 'd4-2', procedureId: 'proc-04', name: 'Giấy báo tử hoặc giấy tờ thay thế giấy báo tử', required: true, quantity: '01 bản chính' },
      { id: 'd4-3', procedureId: 'proc-04', name: 'CCCD hoặc Hộ chiếu của người đi khai tử', required: true, quantity: '01 bản' }
    ],
    forms: [
      { id: 'f4-1', procedureId: 'proc-04', name: 'Tờ khai đăng ký khai tử', fileUrl: '#', onlineUrl: '#' }
    ],
    steps: [
      {
        id: 's4-1',
        procedureId: 'proc-04',
        stepNumber: 1,
        title: 'Chuẩn bị hồ sơ',
        description: 'Chuẩn bị Giấy báo tử từ cơ quan y tế hoặc UBND cấp xã nơi người đó mất.',
        instruction: 'Điền tờ khai đăng ký khai tử.'
      },
      {
        id: 's4-2',
        procedureId: 'proc-04',
        stepNumber: 2,
        title: 'Đến Bộ phận Một cửa',
        description: 'Nộp hồ sơ trực tiếp tại Quầy Hộ tịch UBND Phường Chánh Hiệp.',
        counter: 'Quầy số 2 - Hộ tịch'
      },
      {
        id: 's4-3',
        procedureId: 'proc-04',
        stepNumber: 3,
        title: 'Nộp hồ sơ & Kiểm tra',
        description: 'Cán bộ kiểm tra giấy báo tử và cập nhật dữ liệu xóa đăng ký thường trú.',
        requiredDocuments: ['Giấy báo tử', 'CCCD người đi khai']
      },
      {
        id: 's4-4',
        procedureId: 'proc-04',
        stepNumber: 4,
        title: 'Ký Trích lục khai tử',
        description: 'Ký và cấp Trích lục khai tử cho thân nhân.',
        estimatedTime: 'Trong ngày'
      },
      {
        id: 's4-5',
        procedureId: 'proc-04',
        stepNumber: 5,
        title: 'Nhận kết quả',
        description: 'Nhận Trích lục khai tử chính thức (Miễn phí).',
        location: 'Quầy trả kết quả - Bộ phận Một cửa'
      }
    ]
  },
  {
    id: 'proc-05',
    code: 'T-HT-05',
    name: 'Cấp bản sao trích lục hộ tịch',
    aliases: ['trích lục khai sinh', 'trích lục kết hôn', 'bản sao trích lục', 'trích lục hộ tịch'],
    category: 'Hộ tịch',
    description: 'Thủ tục cấp bản sao các giấy tờ hộ tịch đã đăng ký trước đây (Khai sinh, Kết hôn, Khai tử...).',
    authority: 'UBND Phường Chánh Hiệp',
    locationId: 'loc-mot-cua',
    counter: 'Quầy số 2 - Hộ tịch',
    onlineAvailable: true,
    onlineUrl: 'https://dichvucong.gov.vn',
    processingTime: 'Trong ngày làm việc (nếu lưu trữ tại phường)',
    fee: '8.000 VNĐ / bản sao',
    officialSourceUrl: 'https://dichvucong.gov.vn',
    sourceUpdatedAt: '2026-03-01',
    active: true,
    sortOrder: 5,
    version: 'v1.0',
    updatedAt: '2026-03-01 08:30',
    updatedBy: 'Cán bộ Hộ tịch',
    documents: [
      { id: 'd5-1', procedureId: 'proc-05', name: 'Tờ khai cấp bản sao trích lục hộ tịch (theo mẫu)', required: true, quantity: '01 bản' },
      { id: 'd5-2', procedureId: 'proc-05', name: 'CCCD hoặc VNeID của người yêu cầu cấp bản sao', required: true, quantity: '01 bản' }
    ],
    forms: [
      { id: 'f5-1', procedureId: 'proc-05', name: 'Tờ khai cấp bản sao trích lục hộ tịch', fileUrl: '#', onlineUrl: '#' }
    ],
    steps: [
      {
        id: 's5-1',
        procedureId: 'proc-05',
        stepNumber: 1,
        title: 'Chuẩn bị hồ sơ',
        description: 'Xác định thông tin sự kiện hộ tịch cần cấp bản sao trích lục.',
        instruction: 'Điền thông tin trong Tờ khai cấp bản sao trích lục hộ tịch.'
      },
      {
        id: 's5-2',
        procedureId: 'proc-05',
        stepNumber: 2,
        title: 'Đến Bộ phận Một cửa',
        description: 'Nộp hồ sơ trực tiếp tại Quầy Hộ tịch UBND Phường Chánh Hiệp.',
        counter: 'Quầy số 2 - Hộ tịch'
      },
      {
        id: 's5-3',
        procedureId: 'proc-05',
        stepNumber: 3,
        title: 'Nộp hồ sơ & Tra cứu',
        description: 'Cán bộ tra cứu sổ hộ tịch lưu trữ tại cơ quan đăng ký.',
        requiredDocuments: ['Tờ khai', 'CCCD']
      },
      {
        id: 's5-4',
        procedureId: 'proc-05',
        stepNumber: 4,
        title: 'In & Ký bản sao',
        description: 'Cán bộ in và ký xác nhận bản sao trích lục hộ tịch.',
        estimatedTime: '15 - 30 phút'
      },
      {
        id: 's5-5',
        procedureId: 'proc-05',
        stepNumber: 5,
        title: 'Nhận kết quả',
        description: 'Nhận bản sao trích lục và nộp lệ phí theo quy định.',
        location: 'Quầy trả kết quả - Bộ phận Một cửa'
      }
    ]
  }
];
