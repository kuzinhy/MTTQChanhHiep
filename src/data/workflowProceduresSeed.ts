import { WorkflowProcedure } from '../types/workflow';

export const INITIAL_WORKFLOW_PROCEDURES: WorkflowProcedure[] = [
  {
    id: 'wf-proc-01',
    code: 'T-CT-01',
    name: 'Chứng thực bản sao từ bản chính',
    aliases: ['sao y', 'photo công chứng', 'chứng thực bản photo', 'sao y bản chính'],
    category: 'Chứng thực',
    description: 'Quy trình tiếp nhận và chứng thực tính chính xác, đúng đắn của bản sao so với bản chính văn bản, giấy tờ.',
    authority: 'UBND Phường Chánh Hiệp',
    locationId: 'loc-mot-cua',
    counter: 'Quầy số 1 - Chứng thực & Hộ tịch',
    onlineAvailable: true,
    onlineUrl: 'https://dichvucong.binhduong.gov.vn',
    processingTime: 'Trong ngày (nhận ngay dưới 10 bản)',
    fee: '2.000 VNĐ / trang (từ trang thứ 3: 1.000 VNĐ)',
    officialSourceUrl: 'https://dichvucong.gov.vn',
    sourceUpdatedAt: '2026-03-01',
    active: true,
    version: 'v2.0',
    updatedAt: '2026-03-01 08:00',
    updatedBy: 'Cán bộ Tư pháp - Hộ tịch',
    nodes: [
      {
        id: 'node-1',
        type: 'START',
        title: 'Bắt đầu quy trình',
        subtitle: 'Xác định nhu cầu',
        description: 'Người dân có nhu cầu sao y, chứng thực giấy tờ cá nhân hoặc văn bản pháp lý.',
        instruction: 'Kiểm tra giấy tờ gốc có nguyên vẹn, rõ chữ, không bị tẩy xóa hay rách nát.',
        status: 'DONE',
        stepNumber: 1,
        duration: '1 - 2 phút',
        location: 'Tại nhà / Trực tuyến'
      },
      {
        id: 'node-2',
        type: 'DOCUMENT',
        title: 'Chuẩn bị hồ sơ',
        subtitle: 'Bản chính & Bản sao',
        description: 'Chuẩn bị đầy đủ bản chính văn bản và số lượng bản photo cần chứng thực.',
        instruction: 'Mang theo CCCD/VNeID mức 2, bản chính văn bản và các bản photo tương ứng.',
        status: 'WAITING',
        stepNumber: 2,
        duration: '5 phút',
        location: 'Chuẩn bị cá nhân',
        requiredDocuments: [
          { id: 'doc-1', name: 'Bản chính giấy tờ, văn bản cần chứng thực', required: true, quantity: '01 bản gốc' },
          { id: 'doc-2', name: 'Bản photo / bản sao cần chứng thực', required: true, quantity: 'Theo nhu cầu' },
          { id: 'doc-3', name: 'CCCD gắn chip hoặc tài khoản VNeID mức 2', required: true, quantity: '01 bản' }
        ]
      },
      {
        id: 'node-3',
        type: 'COUNTER',
        title: 'Đến Bộ phận Một cửa',
        subtitle: 'Lấy số & Nộp tại Quầy 1',
        description: 'Đến Trụ sở UBND Phường Chánh Hiệp, bấm số thứ tự tại Kiosk đón tiếp.',
        instruction: 'Di chuyển đến Quầy số 1 - Tiếp nhận Chứng thực & Hộ tịch.',
        status: 'WAITING',
        stepNumber: 3,
        duration: '5 - 10 phút',
        counter: 'Quầy số 1 - Chứng thực',
        location: 'Trụ sở UBND Phường Chánh Hiệp (Số 1240 Đại lộ Bình Dương)',
        officerUnit: 'Bộ phận Tiếp nhận & Trả kết quả Một cửa'
      },
      {
        id: 'node-4',
        type: 'VERIFY',
        title: 'Kiểm tra & Đối chiếu',
        subtitle: 'Thẩm tra tính hợp lệ',
        description: 'Cán bộ đối chiếu bản sao với bản chính, rà soát tính nguyên vẹn của tài liệu.',
        instruction: 'Cán bộ kiểm tra con dấu, chữ ký và tính hợp pháp của bản chính theo Nghị định 23/2015/NĐ-CP.',
        status: 'WAITING',
        stepNumber: 4,
        duration: '5 - 15 phút',
        counter: 'Quầy số 1',
        decisionChoices: [
          { label: 'Hồ sơ đầy đủ, hợp lệ', targetNodeId: 'node-5', isPositive: true },
          { label: 'Hồ sơ thiếu / Bản chính tẩy xóa', targetNodeId: 'node-2', isPositive: false }
        ]
      },
      {
        id: 'node-5',
        type: 'PROCESS',
        title: 'Ký duyệt & Đóng dấu',
        subtitle: 'Xử lý nghiệp vụ',
        description: 'Cán bộ ghi sổ chứng thực, thực hiện ký chứng thực và đóng dấu giáp lai.',
        instruction: 'Hệ thống Một cửa đồng bộ mã số chứng thực vào Sổ theo dõi điện tử.',
        status: 'WAITING',
        stepNumber: 5,
        duration: '10 - 20 phút',
        counter: 'Phòng Tư pháp - Hộ tịch'
      },
      {
        id: 'node-6',
        type: 'RESULT',
        title: 'Nhận kết quả & Nộp lệ phí',
        subtitle: 'Hoàn tất thủ tục',
        description: 'Nhận lại bản chính và các bản sao đã chứng thực, thanh toán lệ phí tại quầy.',
        instruction: 'Kiểm tra lại số lượng bản sao, dấu giáp lai và nhận biên lai thu phí.',
        status: 'WAITING',
        stepNumber: 6,
        duration: '2 - 3 phút',
        counter: 'Quầy trả kết quả Một cửa',
        location: 'UBND Phường Chánh Hiệp'
      }
    ],
    edges: [
      { id: 'e1', fromNodeId: 'node-1', toNodeId: 'node-2', label: 'Bắt đầu' },
      { id: 'e2', fromNodeId: 'node-2', toNodeId: 'node-3', label: 'Đã chuẩn bị' },
      { id: 'e3', fromNodeId: 'node-3', toNodeId: 'node-4', label: 'Nộp tại quầy' },
      { id: 'e4', fromNodeId: 'node-4', toNodeId: 'node-5', condition: 'YES', label: 'Hợp lệ' },
      { id: 'e5', fromNodeId: 'node-5', toNodeId: 'node-6', label: 'Hoàn tất ký' }
    ]
  },
  {
    id: 'wf-proc-02',
    code: 'T-HT-02',
    name: 'Cấp Giấy xác nhận tình trạng hôn nhân',
    aliases: ['giấy độc thân', 'xác nhận độc thân', 'giấy xác nhận tình trạng hôn nhân', 'chứng nhận độc thân'],
    category: 'Hộ tịch',
    description: 'Quy trình xác nhận tình trạng hôn nhân cho công dân thường trú/tạm trú trên địa bàn phục vụ kết hôn hoặc giao dịch nhà đất.',
    authority: 'UBND Phường Chánh Hiệp',
    locationId: 'loc-mot-cua',
    counter: 'Quầy số 2 - Hộ tịch & Dân số',
    onlineAvailable: true,
    onlineUrl: 'https://dichvucong.gov.vn',
    processingTime: 'Trong ngày làm việc (khi có đủ thông tin xác minh)',
    fee: '15.000 VNĐ / bản',
    officialSourceUrl: 'https://dichvucong.gov.vn',
    sourceUpdatedAt: '2026-03-01',
    active: true,
    version: 'v2.0',
    updatedAt: '2026-03-01 08:00',
    updatedBy: 'Cán bộ Hộ tịch',
    nodes: [
      {
        id: 'node-201',
        type: 'START',
        title: 'Bắt đầu quy trình',
        subtitle: 'Xác định mục đích',
        description: 'Xác định mục đích cấp giấy: Để đăng ký kết hôn hay để sử dụng vào mục đích khác (mua bán đất, vay vốn...).',
        status: 'DONE',
        stepNumber: 1,
        duration: '1 phút'
      },
      {
        id: 'node-202',
        type: 'FORM',
        title: 'Điền tờ khai & Hồ sơ',
        subtitle: 'Tờ khai cấp GTTTHN',
        description: 'Điền tờ khai theo mẫu quy định và chuẩn bị giấy tờ minh chứng.',
        instruction: 'Nếu đã từng ly hôn cần mang theo Bản án/Quyết định ly hôn; nếu vợ/chồng đã mất cần mang Giấy chứng tử.',
        status: 'WAITING',
        stepNumber: 2,
        duration: '5 - 10 phút',
        formName: 'Tờ khai cấp Giấy xác nhận tình trạng hôn nhân (Mẫu số 08/HT)',
        requiredDocuments: [
          { id: 'd2-1', name: 'Tờ khai theo mẫu quy định', required: true, quantity: '01 bản chính' },
          { id: 'd2-2', name: 'CCCD hoặc tài khoản định danh điện tử VNeID', required: true, quantity: '01 bản' },
          { id: 'd2-3', name: 'Bản án ly hôn có hiệu lực (nếu đã ly hôn)', required: false, quantity: '01 bản sao/trích lục' },
          { id: 'd2-4', name: 'Giấy chứng tử của vợ/chồng (nếu vợ/chồng đã mất)', required: false, quantity: '01 bản sao/trích lục' }
        ]
      },
      {
        id: 'node-203',
        type: 'COUNTER',
        title: 'Nộp hồ sơ tại Quầy số 2',
        subtitle: 'Bộ phận Tiếp nhận',
        description: 'Nộp hồ sơ trực tiếp tại Quầy số 2 hoặc nộp trực tuyến qua Cổng Dịch vụ công Quốc gia.',
        status: 'WAITING',
        stepNumber: 3,
        duration: '5 phút',
        counter: 'Quầy số 2 - Hộ tịch',
        location: 'UBND Phường Chánh Hiệp'
      },
      {
        id: 'node-204',
        type: 'VERIFY',
        title: 'Tra cứu Cơ sở dữ liệu',
        subtitle: 'Xác minh tình trạng',
        description: 'Cán bộ tra cứu Cơ sở dữ liệu hộ tịch điện tử và Hệ thống quản lý dân cư.',
        instruction: 'Trường hợp người yêu cầu đã cư trú ở nhiều nơi, cán bộ thực hiện xác minh liên thông theo quy định.',
        status: 'WAITING',
        stepNumber: 4,
        duration: '15 - 30 phút'
      },
      {
        id: 'node-205',
        type: 'PROCESS',
        title: 'Trình Lãnh đạo ký duyệt',
        subtitle: 'Ký cấp giấy',
        description: 'Chủ tịch hoặc Phó Chủ tịch UBND Phường ký Giấy xác nhận tình trạng hôn nhân.',
        status: 'WAITING',
        stepNumber: 5,
        duration: 'Trong ngày làm việc'
      },
      {
        id: 'node-206',
        type: 'RESULT',
        title: 'Nhận kết quả & Nộp phí',
        subtitle: 'Hoàn tất',
        description: 'Người dân nhận Giấy xác nhận tình trạng hôn nhân (thời hạn 6 tháng) và nộp lệ phí 15.000 VNĐ.',
        status: 'WAITING',
        stepNumber: 6,
        duration: '2 phút',
        counter: 'Quầy số 2 - Một cửa'
      }
    ],
    edges: [
      { id: 'e201', fromNodeId: 'node-201', toNodeId: 'node-202' },
      { id: 'e202', fromNodeId: 'node-202', toNodeId: 'node-203' },
      { id: 'e203', fromNodeId: 'node-203', toNodeId: 'node-204' },
      { id: 'e204', fromNodeId: 'node-204', toNodeId: 'node-205' },
      { id: 'e205', fromNodeId: 'node-205', toNodeId: 'node-206' }
    ]
  },
  {
    id: 'wf-proc-03',
    code: 'T-HT-03',
    name: 'Đăng ký khai sinh',
    aliases: ['làm giấy khai sinh', 'đăng ký khai sinh cho bé', 'khai sinh'],
    category: 'Hộ tịch',
    description: 'Quy trình đăng ký khai sinh lần đầu cho trẻ em mới sinh cư trú trên địa bàn phường, liên thông đăng ký thường trú và cấp thẻ BHYT.',
    authority: 'UBND Phường Chánh Hiệp',
    locationId: 'loc-mot-cua',
    counter: 'Quầy số 2 - Hộ tịch',
    onlineAvailable: true,
    onlineUrl: 'https://dichvucong.gov.vn',
    processingTime: 'Trong ngày làm việc',
    fee: 'Miễn phí đăng ký khai sinh đúng hạn',
    officialSourceUrl: 'https://dichvucong.gov.vn',
    sourceUpdatedAt: '2026-03-01',
    active: true,
    version: 'v2.0',
    updatedAt: '2026-03-01 08:00',
    updatedBy: 'Cán bộ Hộ tịch',
    nodes: [
      {
        id: 'node-301',
        type: 'START',
        title: 'Bắt đầu thủ tục',
        subtitle: 'Đăng ký khai sinh',
        description: 'Thực hiện trong thời hạn 60 ngày kể từ ngày sinh con.',
        status: 'DONE',
        stepNumber: 1,
        duration: '1 phút'
      },
      {
        id: 'node-302',
        type: 'DOCUMENT',
        title: 'Chuẩn bị hồ sơ',
        subtitle: 'Giấy chứng sinh & CCCD',
        description: 'Chuẩn bị Giấy chứng sinh bản chính do bệnh viện cấp và thông tin cha/mẹ.',
        status: 'WAITING',
        stepNumber: 2,
        duration: '5 phút',
        requiredDocuments: [
          { id: 'd3-1', name: 'Giấy chứng sinh (bản gốc do bệnh viện cấp)', required: true, quantity: '01 bản gốc' },
          { id: 'd3-2', name: 'Tờ khai đăng ký khai sinh (theo mẫu)', required: true, quantity: '01 bản' },
          { id: 'd3-3', name: 'CCCD / VNeID của người đi đăng ký', required: true, quantity: '01 bản' },
          { id: 'd3-4', name: 'Giấy chứng nhận kết hôn của cha mẹ (nếu có)', required: false, quantity: '01 bản' }
        ]
      },
      {
        id: 'node-303',
        type: 'COUNTER',
        title: 'Nộp hồ sơ tại Quầy 2',
        subtitle: 'Hoặc nộp 3 trong 1',
        description: 'Nộp hồ sơ tại Một cửa hoặc chọn dịch vụ liên thông "Khai sinh - Thường trú - Cấp thẻ BHYT" trên VNeID.',
        status: 'WAITING',
        stepNumber: 3,
        counter: 'Quầy số 2 - Hộ tịch',
        location: 'UBND Phường Chánh Hiệp'
      },
      {
        id: 'node-304',
        type: 'VERIFY',
        title: 'Cấp số định danh cá nhân',
        subtitle: 'Đồng bộ Bộ Công an',
        description: 'Cán bộ nhập liệu vào Hệ thống hộ tịch điện tử để tự động nhận Số định danh cá nhân (12 số) cho trẻ.',
        status: 'WAITING',
        stepNumber: 4,
        duration: '10 - 20 phút'
      },
      {
        id: 'node-305',
        type: 'RESULT',
        title: 'Nhận Giấy khai sinh bản chính',
        subtitle: 'Hoàn tất miễn phí',
        description: 'Nhận Giấy khai sinh bản gốc và các bản sao trích lục nếu có yêu cầu.',
        status: 'WAITING',
        stepNumber: 5,
        duration: '5 phút',
        counter: 'Quầy trả kết quả Một cửa'
      }
    ],
    edges: [
      { id: 'e301', fromNodeId: 'node-301', toNodeId: 'node-302' },
      { id: 'e302', fromNodeId: 'node-302', toNodeId: 'node-303' },
      { id: 'e303', fromNodeId: 'node-303', toNodeId: 'node-304' },
      { id: 'e304', fromNodeId: 'node-304', toNodeId: 'node-305' }
    ]
  },
  {
    id: 'wf-proc-04',
    code: 'T-HT-04',
    name: 'Đăng ký khai tử',
    aliases: ['khai tử', 'làm giấy khai tử', 'đăng ký tử tuất'],
    category: 'Hộ tịch',
    description: 'Quy trình đăng ký khai tử và xóa đăng ký thường trú cho người qua đời cư trú trên địa bàn phường.',
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
    version: 'v2.0',
    updatedAt: '2026-03-01 08:00',
    updatedBy: 'Cán bộ Hộ tịch',
    nodes: [
      {
        id: 'node-401',
        type: 'START',
        title: 'Bắt đầu thủ tục',
        subtitle: 'Khai tử đúng hạn',
        description: 'Thân nhân người đã mất thực hiện đăng ký khai tử.',
        status: 'DONE',
        stepNumber: 1
      },
      {
        id: 'node-402',
        type: 'DOCUMENT',
        title: 'Chuẩn bị Giấy báo tử',
        subtitle: 'Hồ sơ pháp lý',
        description: 'Chuẩn bị Giấy báo tử từ cơ sở y tế hoặc văn bản xác nhận của chính quyền địa phương.',
        status: 'WAITING',
        stepNumber: 2,
        requiredDocuments: [
          { id: 'd4-1', name: 'Giấy báo tử hoặc văn bản thay thế giấy báo tử', required: true, quantity: '01 bản gốc' },
          { id: 'd4-2', name: 'Tờ khai đăng ký khai tử (theo mẫu)', required: true, quantity: '01 bản' },
          { id: 'd4-3', name: 'CCCD của người đi khai tử', required: true, quantity: '01 bản' }
        ]
      },
      {
        id: 'node-403',
        type: 'COUNTER',
        title: 'Nộp tại Quầy Hộ tịch',
        subtitle: 'Quầy số 2',
        description: 'Nộp hồ sơ trực tiếp tại UBND Phường Chánh Hiệp.',
        status: 'WAITING',
        stepNumber: 3,
        counter: 'Quầy số 2 - Hộ tịch'
      },
      {
        id: 'node-404',
        type: 'PROCESS',
        title: 'Ký & Cấp Trích lục',
        subtitle: 'Xử lý ngay',
        description: 'Lãnh đạo UBND phường ký và cấp Trích lục khai tử (bản chính).',
        status: 'WAITING',
        stepNumber: 4
      },
      {
        id: 'node-405',
        type: 'RESULT',
        title: 'Nhận Trích lục khai tử',
        subtitle: 'Miễn phí',
        description: 'Nhận Trích lục khai tử để hoàn tất các thủ tục mai táng và chính sách tử tuất.',
        status: 'WAITING',
        stepNumber: 5
      }
    ],
    edges: [
      { id: 'e401', fromNodeId: 'node-401', toNodeId: 'node-402' },
      { id: 'e402', fromNodeId: 'node-402', toNodeId: 'node-403' },
      { id: 'e403', fromNodeId: 'node-403', toNodeId: 'node-404' },
      { id: 'e404', fromNodeId: 'node-404', toNodeId: 'node-405' }
    ]
  },
  {
    id: 'wf-proc-05',
    code: 'T-HT-05',
    name: 'Cấp bản sao trích lục hộ tịch',
    aliases: ['trích lục khai sinh', 'trích lục kết hôn', 'bản sao trích lục', 'trích lục hộ tịch'],
    category: 'Hộ tịch',
    description: 'Quy trình trích xuất và cấp bản sao các sự kiện hộ tịch đã đăng ký trước đây trong cơ sở dữ liệu số.',
    authority: 'UBND Phường Chánh Hiệp',
    locationId: 'loc-mot-cua',
    counter: 'Quầy số 2 - Hộ tịch',
    onlineAvailable: true,
    onlineUrl: 'https://dichvucong.gov.vn',
    processingTime: 'Trong ngày làm việc (15 - 30 phút)',
    fee: '8.000 VNĐ / bản sao',
    officialSourceUrl: 'https://dichvucong.gov.vn',
    sourceUpdatedAt: '2026-03-01',
    active: true,
    version: 'v2.0',
    updatedAt: '2026-03-01 08:00',
    updatedBy: 'Cán bộ Hộ tịch',
    nodes: [
      {
        id: 'node-501',
        type: 'START',
        title: 'Xác định sự kiện hộ tịch',
        subtitle: 'Khai sinh / Kết hôn / Khai tử',
        description: 'Xác định thông tin giấy tờ cần trích lục lại bản sao.',
        status: 'DONE',
        stepNumber: 1
      },
      {
        id: 'node-502',
        type: 'FORM',
        title: 'Điền Tờ khai trích lục',
        subtitle: 'Mẫu số 03/HT',
        description: 'Điền thông tin họ tên, năm sinh, số sổ hộ tịch (nếu nhớ).',
        status: 'WAITING',
        stepNumber: 2,
        requiredDocuments: [
          { id: 'd5-1', name: 'Tờ khai cấp bản sao trích lục hộ tịch', required: true, quantity: '01 bản' },
          { id: 'd5-2', name: 'CCCD / VNeID của người yêu cầu', required: true, quantity: '01 bản' }
        ]
      },
      {
        id: 'node-503',
        type: 'COUNTER',
        title: 'Tra cứu tại Quầy 2',
        subtitle: 'Tra cứu dữ liệu số',
        description: 'Cán bộ hộ tịch tra cứu Sổ hộ tịch điện tử hoặc kho lưu trữ hồ sơ giấy.',
        status: 'WAITING',
        stepNumber: 3,
        counter: 'Quầy số 2 - Hộ tịch'
      },
      {
        id: 'node-504',
        type: 'PROCESS',
        title: 'In & Ký bản sao trích lục',
        subtitle: 'Ký chứng thực',
        description: 'In bản sao trích lục hộ tịch từ phần mềm dùng chung của Bộ Tư pháp.',
        status: 'WAITING',
        stepNumber: 4,
        duration: '15 phút'
      },
      {
        id: 'node-505',
        type: 'RESULT',
        title: 'Nhận bản sao & Nộp phí',
        subtitle: '8.000 VNĐ / bản',
        description: 'Nhận bản sao trích lục hộ tịch có giá trị pháp lý tương đương bản chính.',
        status: 'WAITING',
        stepNumber: 5,
        duration: '2 phút'
      }
    ],
    edges: [
      { id: 'e501', fromNodeId: 'node-501', toNodeId: 'node-502' },
      { id: 'e502', fromNodeId: 'node-502', toNodeId: 'node-503' },
      { id: 'e503', fromNodeId: 'node-503', toNodeId: 'node-504' },
      { id: 'e504', fromNodeId: 'node-504', toNodeId: 'node-505' }
    ]
  }
];
