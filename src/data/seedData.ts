import { 
  Article, 
  OfficialDocument, 
  Competition, 
  TriviaQuestion, 
  PublicOpinion, 
  Task, 
  WorkEvent, 
  Note, 
  TemplateDoc, 
  DriveFileItem, 
  StaffUser,
  AuditLog,
  Area,
  Organization,
  MemberOrganization
} from '../types';
import { ARTICLE_BANNERS, getOfficialCadreAvatarSvg } from '../utils/officialImages';

export const INITIAL_ARTICLES: Article[] = [];

export const INITIAL_DOCUMENTS: OfficialDocument[] = [];

export const INITIAL_COMPETITIONS: Competition[] = [
  {
    id: 'comp-1',
    title: 'Hội thi trực tuyến "Tìm hiểu Lịch sử Mặt trận Dân tộc Thống nhất Việt Nam & Luật MTTQ"',
    description: 'Hội thi trắc nghiệm trực tuyến dành cho toàn thể cán bộ, công chức, đoàn viên hội viên và nhân dân trên địa bàn phường Chánh Hiệp tìm hiểu về truyền thống lịch sử vẻ vang của Mặt trận.',
    bannerUrl: 'https://sv2.anhsieuviet.com/2026/09/02/862c92e8-1336-4885-8787-1a6702c3a178ad174eb779884713.png',
    type: 'TRIVIA',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    status: 'OPEN',
    timeLimitMinutes: 15,
    totalQuestions: 10,
    rules: `THỂ LỆ HỘI THI TRỰC TUYẾN
1. Đối tượng tham gia: Áp dụng rộng rãi cho toàn thể nhân dân, cán bộ công chức, đoàn viên hội viên trên địa bàn phường Chánh Hiệp.
2. Nội dung: Tìm hiểu về chặng đường lịch sử vẻ vang của Mặt trận Dân tộc Thống nhất Việt Nam (18/11/1930 - nay) và Luật Mặt trận Tổ quốc Việt Nam.
3. Thời gian: Từ ngày 01/09/2026 đến hết ngày 30/09/2026.
4. Cơ cấu giải thưởng: 1 Giải Nhất, 2 Giải Nhì, 3 Giải Ba và nhiều giải khuyến khích cho các khu phố tham gia tích cực.`,
    questions: [
      {
        id: 'q-mttq-1',
        competitionId: 'comp-1',
        questionText: 'Ngày truyền thống của Mặt trận Dân tộc Thống nhất Việt Nam là ngày tháng năm nào?',
        questionType: 'SINGLE_CHOICE',
        category: 'Lịch sử',
        difficulty: 'EASY',
        score: 10,
        options: [
          { id: 'o1', text: '18/11/1930', isCorrect: true },
          { id: 'o2', text: '03/02/1930', isCorrect: false },
          { id: 'o3', text: '19/05/1941', isCorrect: false },
          { id: 'o4', text: '02/09/1945', isCorrect: false }
        ],
        explanation: 'Ngày 18/11/1930, Ban Thường vụ Trung ương Đảng ra Chỉ thị thành lập Hội Phản đế Đồng minh.',
        status: 'ACTIVE'
      },
      {
        id: 'q-mttq-2',
        competitionId: 'comp-1',
        questionText: 'Luật Mặt trận Tổ quốc Việt Nam hiện hành được Quốc hội nước CHXHCN Việt Nam khóa XIV thông qua năm nào?',
        questionType: 'SINGLE_CHOICE',
        category: 'Pháp luật',
        difficulty: 'MEDIUM',
        score: 10,
        options: [
          { id: 'o1', text: 'Năm 1999', isCorrect: false },
          { id: 'o2', text: 'Năm 2015', isCorrect: true },
          { id: 'o3', text: 'Năm 2013', isCorrect: false },
          { id: 'o4', text: 'Năm 2020', isCorrect: false }
        ],
        explanation: 'Luật MTTQ Việt Nam năm 2015 được thông qua ngày 09/06/2015 tại kỳ họp thứ 9 Quốc hội khóa XIII.',
        status: 'ACTIVE'
      },
      {
        id: 'q-mttq-3',
        competitionId: 'comp-1',
        questionText: 'Tổ chức chính trị - xã hội nào là thành viên của Mặt trận Tổ quốc Việt Nam?',
        questionType: 'SINGLE_CHOICE',
        category: 'Tổ chức',
        difficulty: 'EASY',
        score: 10,
        options: [
          { id: 'o1', text: 'Công đoàn Việt Nam, Hội Nông dân, Đoàn TNCS Hồ Chí Minh, Hội Liên hiệp Phụ nữ, Hội Cựu chiến binh', isCorrect: true },
          { id: 'o2', text: 'Chỉ có Đoàn Thanh niên', isCorrect: false },
          { id: 'o3', text: 'Chỉ có Công đoàn', isCorrect: false },
          { id: 'o4', text: 'Các doanh nghiệp tư nhân trên địa bàn', isCorrect: false }
        ],
        explanation: 'Các tổ chức chính trị - xã hội là thành viên nòng cốt của MTTQ Việt Nam.',
        status: 'ACTIVE'
      },
      {
        id: 'q-mttq-4',
        competitionId: 'comp-1',
        questionText: 'Chức năng giám sát và phản biện xã hội của Mặt trận Tổ quốc Việt Nam mang ý nghĩa gì?',
        questionType: 'SINGLE_CHOICE',
        category: 'Giám sát',
        difficulty: 'MEDIUM',
        score: 10,
        options: [
          { id: 'o1', text: 'Phát huy quyền làm chủ của nhân dân, tham gia xây dựng Đảng và chính quyền trong sạch, vững mạnh', isCorrect: true },
          { id: 'o2', text: 'Xử lý kỷ luật cán bộ vi phạm', isCorrect: false },
          { id: 'o3', text: 'Thanh tra tài chính doanh nghiệp', isCorrect: false },
          { id: 'o4', text: 'Ban hành văn bản quy phạm pháp luật', isCorrect: false }
        ],
        explanation: 'Giám sát và phản biện xã hội là chức năng hiến định quan trọng của MTTQ.',
        status: 'ACTIVE'
      },
      {
        id: 'q-mttq-5',
        competitionId: 'comp-1',
        questionText: 'Cuộc vận động "Toàn dân đoàn kết xây dựng nông thôn mới, đô thị văn minh" gồm bao nhiêu nội dung lớn?',
        questionType: 'SINGLE_CHOICE',
        category: 'Phong trào',
        difficulty: 'HARD',
        score: 10,
        options: [
          { id: 'o1', text: '3 nội dung', isCorrect: false },
          { id: 'o2', text: '5 nội dung', isCorrect: true },
          { id: 'o3', text: '4 nội dung', isCorrect: false },
          { id: 'o4', text: '6 nội dung', isCorrect: false }
        ],
        explanation: 'Cuộc vận động gồm 5 nội dung toàn diện phát triển kinh tế, văn hóa, xã hội, môi trường và an ninh trật tự.',
        status: 'ACTIVE'
      }
    ]
  },
  {
    id: 'comp-2',
    title: 'Cuộc thi viết "Gương sáng Mặt trận - Hành động vì cộng đồng Phường Chánh Hiệp"',
    description: 'Cuộc thi viết cảm nhận, tôn vinh các tập thể, cá nhân, Trưởng Ban công tác Mặt trận khu phố tận tụy, sáng tạo trong công tác vận động quần chúng.',
    bannerUrl: 'https://sv2.anhsieuviet.com/2026/09/02/b94eb55d-1061-4c4f-9278-a46ce8de408a9067fc5c33d6b0a2.png',
    type: 'WRITING',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    status: 'OPEN',
    rules: `THỂ LỆ CỘC THI VIẾT CẢM NHẬN
1. Đối tượng: Áp dụng rộng rãi cho toàn thể nhân dân và cán bộ trên địa bàn phường.
2. Thời gian: Từ 01/09/2026 đến 30/09/2026.
3. Hình thức nộp bài: 
   - Thí sinh có thể soạn trực tiếp văn bản hoặc tải file bài viết (.docx, .pdf, .zip) lên Google Drive cá nhân / hệ thống và đính kèm đường dẫn trực tiếp vào biểu mẫu nộp bài.
   - Bài viết phản ánh chân thực các gương người tốt việc tốt, mô hình dân vận khéo tại khu phố.`
  },
  {
    id: 'comp-3',
    title: 'Hội thi Đoàn thanh niên: "Nâng cao ý thức bảo vệ môi trường, xây dựng khu phố xanh - sạch - đẹp"',
    description: 'Cuộc thi thiết kế mô hình, sáng kiến và viết bài tuyên truyền bảo vệ môi trường, chống rác thải nhựa dành riêng cho Đoàn viên thanh niên.',
    bannerUrl: 'https://sv2.anhsieuviet.com/2026/09/02/8758f2ac-9342-47db-8f7f-7a3bcd434c32b7535a4487543751.png',
    type: 'WRITING',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    status: 'OPEN',
    isYouthCompetition: true,
    rules: `THỂ LỆ HỘI THI ĐOÀN THANH NIÊN - BẢO VỆ MÔI TRƯỜNG
1. Đối tượng: Chỉ dành riêng cho Đoàn viên thanh niên từ 10 đến 40 tuổi đang sinh học, học tập và làm việc trên địa bàn phường Chánh Hiệp.
2. Thời gian: Từ 01/09/2026 đến 30/09/2026.
3. Hướng dẫn nộp bài: Đính kèm file tài liệu, hình ảnh mô hình hoặc link Google Drive chứa video/bài viết dự thi.`
  },
  {
    id: 'comp-4',
    title: 'Hội thi Đoàn thanh niên: "Vai trò của thanh niên trong thời đại chuyển đổi số và đô thị thông minh"',
    description: 'Hội thi trực tuyến tìm hiểu kiến thức về chuyển đổi số, dịch vụ công trực tuyến và ứng dụng công nghệ thông số trong cộng đồng.',
    bannerUrl: 'https://sv2.anhsieuviet.com/2026/09/02/775fbdb9-40fc-4b75-979f-7ebf40ecd00fb813d9fe5f77bf4c.png',
    type: 'TRIVIA',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    status: 'OPEN',
    timeLimitMinutes: 15,
    totalQuestions: 5,
    isYouthCompetition: true,
    rules: `THỂ LỆ HỘI THI CHUYỂN ĐỔI SỐ
1. Đối tượng: Dành riêng cho đoàn viên thanh niên từ 10 đến 40 tuổi trên địa bàn phường.
2. Thời gian: Từ 01/09/2026 đến 30/09/2026.
3. Nội dung: Kiến thức cơ bản về chuyển đổi số quốc gia, dịch vụ công trực tuyến, an toàn thông tin và kỹ năng số cộng đồng.`,
    questions: [
      {
        id: 'q-cds-1',
        competitionId: 'comp-4',
        questionText: 'Chuyển đổi số bao gồm những yếu tố cốt lõi nào đối với cộng đồng địa phương?',
        questionType: 'SINGLE_CHOICE',
        category: 'Chuyển đổi số',
        difficulty: 'EASY',
        score: 20,
        options: [
          { id: '1', text: 'Số hóa dữ liệu, thay đổi quy trình và nâng cao tư duy số cho người dân', isCorrect: true },
          { id: '2', text: 'Chỉ cần mua máy tính mới cho cơ quan', isCorrect: false },
          { id: '3', text: 'Chỉ sử dụng mạng xã hội giải trí', isCorrect: false },
          { id: '4', text: 'Ngừng sử dụng giấy tờ hoàn toàn ngay lập tức', isCorrect: false }
        ],
        explanation: 'Chuyển đổi số là quá trình thay đổi toàn diện phương thức sống, làm việc dựa trên công nghệ số.',
        status: 'ACTIVE'
      },
      {
        id: 'q-cds-2',
        competitionId: 'comp-4',
        questionText: 'Dịch vụ công trực tuyến mức độ toàn trình đem lại lợi ích gì lớn nhất cho người dân?',
        questionType: 'SINGLE_CHOICE',
        category: 'Dịch vụ công',
        difficulty: 'MEDIUM',
        score: 20,
        options: [
          { id: '1', text: 'Nộp hồ sơ và nhận kết quả mọi lúc mọi nơi qua Internet mà không cần đến trực tiếp cơ quan nhà nước', isCorrect: true },
          { id: '2', text: 'Miễn phí 100% mọi loại phí lệ phí', isCorrect: false },
          { id: '3', text: 'Được giải quyết hồ sơ nhanh gấp 10 lần mà không cần giấy tờ tùy thân', isCorrect: false },
          { id: '4', text: 'Chỉ áp dụng cho doanh nghiệp lớn', isCorrect: false }
        ],
        explanation: 'Dịch vụ công trực tuyến toàn trình cho phép thực hiện từ nộp đến thanh toán và nhận kết quả trực tuyến.',
        status: 'ACTIVE'
      },
      {
        id: 'q-cds-3',
        competitionId: 'comp-4',
        questionText: 'Vai trò xung kích của thanh niên trong Tổ công nghệ số cộng đồng tại các khu phố là gì?',
        questionType: 'SINGLE_CHOICE',
        category: 'Xung kích',
        difficulty: 'EASY',
        score: 20,
        options: [
          { id: '1', text: 'Hướng dẫn, hỗ trợ người dân sử dụng smartphone, dịch vụ công, thanh toán không dùng tiền mặt', isCorrect: true },
          { id: '2', text: 'Kiểm tra xử phạt vi phạm hành chính', isCorrect: false },
          { id: '3', text: 'Sửa chữa điện lưới gia đình', isCorrect: false },
          { id: '4', text: 'Phát tờ rơi thủ công tại chợ', isCorrect: false }
        ],
        explanation: 'Tổ công nghệ số cộng đồng do thanh niên làm nòng cốt hướng dẫn từng hộ dân tiếp cận công nghệ số.',
        status: 'ACTIVE'
      },
      {
        id: 'q-cds-4',
        competitionId: 'comp-4',
        questionText: 'Ứng dụng VNeID (Ứng dụng định danh điện tử quốc gia) do lực lượng nào phát triển và quản lý?',
        questionType: 'SINGLE_CHOICE',
        category: 'An ninh mạng',
        difficulty: 'MEDIUM',
        score: 20,
        options: [
          { id: '1', text: 'Bộ Công an (Cục Cảnh sát Quản lý hành chính về trật tự xã hội)', isCorrect: true },
          { id: '2', text: 'Các tập đoàn viễn thông tư nhân', isCorrect: false },
          { id: '3', text: 'Ngân hàng Nhà nước', isCorrect: false },
          { id: '4', text: 'Tập đoàn công nghệ nước ngoài', isCorrect: false }
        ],
        explanation: 'VNeID là ứng dụng định danh điện tử chính thức của Bộ Công an.',
        status: 'ACTIVE'
      },
      {
        id: 'q-cds-5',
        competitionId: 'comp-4',
        questionText: 'Đâu là nguyên tắc quan trọng nhất khi tham gia môi trường mạng và không gian số?',
        questionType: 'SINGLE_CHOICE',
        category: 'An toàn thông tin',
        difficulty: 'EASY',
        score: 20,
        options: [
          { id: '1', text: 'Bảo mật thông tin cá nhân, không chia sẻ tin giả (fake news), ứng xử văn minh', isCorrect: true },
          { id: '2', text: 'Chia sẻ mọi thông tin nhận được ngay lập tức', isCorrect: false },
          { id: '3', text: 'Sử dụng tài khoản ẩn danh để bình luận thoải mái', isCorrect: false },
          { id: '4', text: 'Không bao giờ đổi mật khẩu', isCorrect: false }
        ],
        explanation: 'Văn hóa mạng và an toàn thông tin là tiêu chí hàng đầu của công dân số.',
        status: 'ACTIVE'
      }
    ]
  }
];

export const INITIAL_TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: 'q-1',
    competitionId: 'comp-1',
    question: 'Ngày truyền thống của Mặt trận Dân tộc Thống nhất Việt Nam là ngày tháng năm nào?',
    options: [
      '18/11/1930',
      '03/02/1930',
      '19/05/1941',
      '02/09/1945'
    ],
    correctAnswerIndex: 0,
    explanation: 'Ngày 18/11/1930, Ban Thường vụ Trung ương Đảng Cộng sản Đông Dương ra Chỉ thị thành lập Hội Phản đế Đồng minh - hình thức tổ chức đầu tiên của Mặt trận Dân tộc Thống nhất Việt Nam.',
    topic: 'Lịch sử Mặt trận'
  },
  {
    id: 'q-2',
    competitionId: 'comp-1',
    question: 'Theo Luật Mặt trận Tổ quốc Việt Nam 2015, Mặt trận Tổ quốc Việt Nam là gì?',
    options: [
      'Là bộ phận cấu thành của hệ thống chính trị nước Cộng hòa XHCN Việt Nam',
      'Là tổ chức liên minh chính trị, liên minh tự nguyện của các tổ chức chính trị, chính trị - xã hội',
      'Là cơ sở chính trị của chính quyền nhân dân',
      'Tất cả các phương án trên'
    ],
    correctAnswerIndex: 3,
    explanation: 'Điều 1 Luật MTTQ Việt Nam quy định đầy đủ vị trí, vai trò, tính chất của Mặt trận Tổ quốc Việt Nam.',
    topic: 'Luật MTTQ'
  },
  {
    id: 'q-3',
    competitionId: 'comp-1',
    question: 'Mục tiêu chính của Cuộc vận động "Toàn dân đoàn kết xây dựng nông thôn mới, đô thị văn minh" là gì?',
    options: [
      'Phát triển kinh tế, nâng cao đời sống vật chất và tinh thần của nhân dân',
      'Xây dựng môi trường cảnh quan xanh - sạch - đẹp, đảm bảo an ninh trật tự',
      'Phát huy tinh thần tự quản của nhân dân ở khu dân cư',
      'Cả 3 phương án trên'
    ],
    correctAnswerIndex: 3,
    explanation: 'Cuộc vận động hướng tới nâng cao toàn diện chất lượng sống tại các khu dân cư.',
    topic: 'Phong trào thi đua'
  }
];

export const INITIAL_PUBLIC_OPINIONS: PublicOpinion[] = [
  {
    id: 'op-1',
    receiptCode: 'PA-2026-0801',
    topic: 'Môi trường & Đô thị',
    content: 'Tuyến đường Chánh Hiệp 08 gần trường tiểu học xuất hiện điểm tập kết rác tự phát gây mất mỹ quan và hôi hám trong giờ tan học. Đề nghị Mặt trận phường vận động khu phố dọn dẹp và gắn biển cấm đổ rác.',
    neighborhood: 'Tương Bình Hiệp 3',
    fullname: 'Nguyễn Thanh Tùng',
    phone: '0908123456',
    email: 'tung.nguyen@gmail.com',
    isAnonymous: false,
    status: 'PROCESSING',
    priority: 'HIGH',
    assignedTo: 'Lê Văn Bình (Phó Chủ tịch)',
    adminResponse: 'Ban Thường trực MTTQ phường đã tiếp nhận và chuyển phản ánh đến UBND phường cùng Ban CTMT Tương Bình Hiệp 3 tổ chức ra quân dọn dẹp trong cuối tuần này.',
    createdAt: '2026-08-28 09:30',
    tags: ['Rác thải', 'Đô thị văn minh', 'Trường học']
  },
  {
    id: 'op-2',
    receiptCode: 'PA-2026-0802',
    topic: 'An sinh xã hội',
    content: 'Gia đình bà Lê Thị Bích ở hẻm 45 Tương Bình Hiệp 7 thuộc diện người già đơn thân, căn nhà bị dột nặng sau các trận mưa vừa qua. Đề nghị xem xét hỗ trợ kinh phí sửa chữa Nhà Đại đoàn kết.',
    neighborhood: 'Tương Bình Hiệp 7',
    fullname: '',
    phone: '',
    email: '',
    isAnonymous: true,
    status: 'NEW',
    priority: 'URGENT',
    assignedTo: 'Trần Thị Hoa (Chủ tịch)',
    createdAt: '2026-08-29 14:15',
    tags: ['Nhà Đại đoàn kết', 'Hộ khó khăn', 'An sinh']
  },
  {
    id: 'op-3',
    receiptCode: 'PA-2026-0803',
    topic: 'Vấn đề dân sinh',
    content: 'Hệ thống đèn chiếu sáng công cộng tại đường Chánh Hiệp 22 bị hư hỏng 3 bóng liên tiếp hơn một tuần nay gây nguy hiểm cho người tham gia giao thông ban đêm.',
    neighborhood: 'Tương Bình Hiệp 5',
    fullname: 'Phạm Minh Hoàng',
    phone: '0912345678',
    isAnonymous: false,
    status: 'RESOLVED',
    priority: 'NORMAL',
    assignedTo: 'Ban CTMT Tương Bình Hiệp 5',
    adminResponse: 'Đã phối hợp Bộ phận Đô thị UBND phường khắc phục thay mới các bóng đèn hỏng ngày 27/08/2026.',
    createdAt: '2026-08-24 16:45',
    tags: ['Đèn chiếu sáng', 'An toàn giao thông']
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Rà soát danh sách hộ khó khăn nhận quà Tết Ất Tỵ',
    description: 'Phối hợp với 21 Trưởng Ban công tác Mặt trận khu phố lập danh sách, xác minh thông tin từng hoàn cảnh để thẩm định xét duyệt.',
    assigneeId: 'staff-2',
    assigneeName: 'Lê Văn Bình',
    assignerName: 'Trần Thị Hoa',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    deadline: '2026-09-10',
    createdAt: '2026-08-26'
  },
  {
    id: 'task-2',
    title: 'Soạn thảo Báo cáo sơ kết 5 năm thực hiện Nghị quyết giám sát phản biện',
    description: 'Tổng hợp số liệu từ các đoàn giám sát, các buổi tiếp xúc cử tri và đánh giá việc giải quyết kiến nghị của UBND.',
    assigneeId: 'staff-3',
    assigneeName: 'Trần Văn Nam',
    assignerName: 'Trần Thị Hoa',
    priority: 'NORMAL',
    status: 'TODO',
    deadline: '2026-09-15',
    createdAt: '2026-08-28'
  },
  {
    id: 'task-3',
    title: 'Tổng hợp bài dự thi cuộc thi viết "Gương sáng Mặt trận"',
    description: 'Phân loại bài dự thi gửi về qua cổng trực tuyến và bản giấy, lập danh sách chuyển Hội đồng chấm thi.',
    assigneeId: 'staff-4',
    assigneeName: 'Lê Thị Thu Thảo',
    assignerName: 'Lê Văn Bình',
    priority: 'NORMAL',
    status: 'IN_PROGRESS',
    deadline: '2026-10-20',
    createdAt: '2026-08-20'
  }
];

export const INITIAL_EVENTS: WorkEvent[] = [
  {
    id: 'evt-1',
    title: 'Họp Giao ban Ban Thường trực MTTQ phường tháng 9',
    startTime: '2026-09-02T08:00',
    endTime: '2026-09-02T10:30',
    location: 'Phòng họp số 2 - UBND phường Chánh Hiệp',
    chair: 'Đ/c Trần Thị Hoa - Chủ tịch MTTQ phường',
    participants: 'BTT MTTQ phường, Đại diện các đoàn thể chính trị - xã hội',
    content: 'Đánh giá công tác tháng 8 và triển khai kế hoạch trọng tâm tháng 9/2026.',
    category: 'Giao ban'
  },
  {
    id: 'evt-2',
    title: 'Tiếp xúc cử tri chuyên đề về Công tác Quản lý Đô thị',
    startTime: '2026-09-05T14:00',
    endTime: '2026-09-05T17:00',
    location: 'Hội trường Văn hóa Tương Bình Hiệp 4',
    chair: 'Thường trực HĐND - MTTQ phường',
    participants: 'Đại biểu HĐND phường, Nhân dân Tương Bình Hiệp 3, 4, 5',
    content: 'Lắng nghe ý kiến và kiến nghị nhân dân liên quan đến quy hoạch và thoát nước.',
    category: 'Tiếp xúc cử tri'
  }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    userId: 'user-admin',
    title: 'Chuẩn bị nội dung làm việc với Ban CTMT Định Hòa 2',
    content: `- Kiểm tra tiến độ vận động Quỹ "Vì người nghèo" tại khu phố.
- Nhắc nhở khu phố đẩy mạnh tuyên truyền Cuộc thi trắc nghiệm trực tuyến.
- Ghi nhận ý kiến về đợt phát quà trung thu cho trẻ em em nghèo.`,
    color: '#fef3c7',
    isPinned: true,
    tags: ['Định Hòa 2', 'Công tác', 'Nhắc việc'],
    updatedAt: '2026-08-29 10:20'
  },
  {
    id: 'note-2',
    userId: 'user-admin',
    title: 'Số điện thoại liên hệ khẩn cấp lực lượng an sinh khu phố',
    content: `KP1: A. Tuấn 0903xxx
KP2: C. Mai 0918xxx
KP3: A. Dũng 0989xxx`,
    color: '#e0f2fe',
    isPinned: false,
    tags: ['Danh bạ', 'Liên hệ'],
    updatedAt: '2026-08-25 15:40'
  }
];

export const INITIAL_TEMPLATES: TemplateDoc[] = [
  {
    id: 'tpl-1',
    title: 'Mẫu Kế hoạch tổ chức Hoạt động phong trào Mặt trận',
    category: 'Kế hoạch',
    description: 'Khung chuẩn kế hoạch phong trào ban hành bởi Ban Thường trực MTTQ phường Chánh Hiệp theo Nghị định 30/2020/NĐ-CP và Quyết định 207/QĐ-MTTW-BTT.',
    content: `ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP
BAN THƯỜNG TRỰC
Số:   /KH-MTTQ-BTT

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
Chánh Hiệp, ngày   tháng   năm 2026

KẾ HOẠCH
Tổ chức [TÊN PHONG TRÀO / HOẠT ĐỘNG TRỌNG TÂM]
Năm 2026

Thực hiện Chương trình phối hợp và thống nhất hành động năm 2026 của Ủy ban MTTQ Việt Nam phường Chánh Hiệp; Ban Thường trực Ủy ban MTTQ Việt Nam phường xây dựng Kế hoạch tổ chức [Tên hoạt động] với các nội dung cụ thể như sau:

I. MỤC ĐÍCH, YÊU CẦU
1. Mục đích:
- Tuyên truyền sâu rộng trong các tầng lớp nhân dân, đoàn viên, hội viên về ý nghĩa và tầm quan trọng của phong trào.
- Phát huy sức mạnh khối đại đoàn kết toàn dân tộc, khơi dậy tinh thần thi đua yêu nước, sáng tạo tại 21 khu dân cư.
2. Yêu cầu:
- Tổ chức đồng bộ, thiết thực, hiệu quả, tiết kiệm, tránh hình thức.
- Huy động sự tham gia tích cực, tự giác của nhân dân và sự phối hợp chặt chẽ của các tổ chức thành viên.

II. NỘI DUNG VÀ HÌNH THỨC THỰC HIỆN
1. Nội dung trọng tâm:
- [Nội dung 1: Công tác tuyên truyền, quán triệt]
- [Nội dung 2: Triển khai các công trình, phần việc cụ thể tại địa bàn khu phố]
- [Nội dung 3: Vận động nguồn lực xã hội hóa và chăm lo an sinh xã hội]
2. Hình thức triển khai:
- Tổ chức lễ phát động, sinh hoạt chuyên đề tại Ban Công tác Mặt trận 21 khu phố.
- Tuyên truyền qua Cổng thông tin điện tử, nhóm Zalo cộng đồng và hệ thống loa phát thanh.

III. THỜI GIAN, ĐỊA ĐIỂM VÀ ĐỐI TƯỢNG
1. Thời gian: Từ ngày .../.../2026 đến ngày .../.../2026.
2. Địa điểm: Tại Hội trường UBND phường và 21 Nhà Văn hóa Khu phố.
3. Đối tượng tham gia: Cán bộ, công chức, đoàn viên, hội viên và toàn thể nhân dân trên địa bàn.

IV. KINH PHÍ THỰC HIỆN
- Trích từ nguồn kinh phí hoạt động công tác Mặt trận năm 2026 và nguồn vận động xã hội hóa hợp pháp.

V. TỔ CHỨC THỰC HIỆN
1. Ban Thường trực Ủy ban MTTQ Việt Nam phường:
- Chủ trì phối hợp với UBND phường và các đoàn thể chính trị - xã hội hướng dẫn, đôn đốc triển khai.
- Tổng hợp báo cáo kết quả định kỳ lên Thường trực Đảng ủy và Ủy ban MTTQ cấp trên.
2. Các tổ chức chính trị - xã hội thành viên:
- Xây dựng kế hoạch phối hợp, chỉ đạo các chi đoàn, chi hội cơ sở tích cực hưởng ứng tham gia.
3. Ban Công tác Mặt trận 21 Khu phố:
- Báo cáo Chi ủy Chi bộ khu phố, chủ trì họp Ban CTMT và các đoàn thể khu phố triển khai sâu rộng đến từng tổ dân cư và hộ gia đình.

Nơi nhận:
- TT. Đảng ủy, HĐND, UBND phường (để b/c);
- Ban Thường trực MTTQ TP (để b/c);
- Các đoàn thể thành viên;
- 21 Ban CTMT Khu phố;
- Lưu: VT, MTTQ.

TM. BAN THƯỜNG TRỰC
CHỦ TỊCH
(Ký, ghi rõ họ tên và đóng dấu)`
  },
  {
    id: 'tpl-2',
    title: 'Mẫu Báo cáo Kết quả công tác Mặt trận tháng / quý / 6 tháng / năm',
    category: 'Báo cáo',
    description: 'Mẫu báo cáo toàn diện 5 chương trình hành động của Ủy ban MTTQ cấp cơ sở.',
    content: `ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP
BAN THƯỜNG TRỰC
Số:   /BC-MTTQ-BTT

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
Chánh Hiệp, ngày   tháng   năm 2026

BÁO CÁO
Kết quả công tác Mặt trận [THÁNG / QUÝ / NĂM 2026]
Phương hướng, nhiệm vụ trọng tâm thời gian tới

I. TÌNH HÌNH CÁC TẦNG LỚP NHÂN DÂN VÀ KHỐI ĐẠI ĐOÀN KẾT TOÀN DÂN TỘC
- Tư tưởng, tâm trạng các tầng lớp nhân dân trên địa bàn 21 khu phố ổn định, tin tưởng vào sự lãnh đạo của Đảng và quản lý của Nhà nước.
- Các vấn đề dân sinh phát sinh được ghi nhận và giải quyết kịp thời qua Cổng tiếp nhận dư luận xã hội.

II. KẾT QUẢ THỰC HIỆN CÁC CHƯƠNG TRÌNH HÀNH ĐỘNG
1. Nâng cao hiệu quả tuyên truyền, vận động, tập hợp các tầng lớp nhân dân, củng cố và phát huy sức mạnh đại đoàn kết toàn dân tộc:
- Tổ chức ... buổi sinh hoạt tuyên truyền với ... lượt người tham dự.
- Vận hành hiệu quả Cổng thông tin điện tử & Không gian văn hóa Hồ Chí Minh trực tuyến.
2. Động viên các tầng lớp nhân dân thi đua sáng tạo, thực hiện hiệu quả các cuộc vận động, phong trào thi đua:
- Cuộc vận động "Toàn dân đoàn kết xây dựng nông thôn mới, đô thị văn minh": Đạt ...% hộ gia đình văn hóa.
- Quỹ "Vì người nghèo": Vận động được ... triệu đồng, chăm lo ... suất quà và sửa chữa ... căn nhà Đại đoàn kết.
3. Thực hiện dân chủ, đại diện, bảo vệ quyền và lợi ích hợp pháp, chính đáng của nhân dân; giám sát và phản biện xã hội; tham gia xây dựng Đảng và chính quyền vững mạnh:
- Tổ chức ... hội nghị đối thoại trực tiếp giữa người đứng đầu cấp ủy, chính quyền với nhân dân.
- Ban Thanh tra nhân dân và Ban Giám sát đầu tư của cộng đồng tiến hành ... cuộc giám sát các công trình dân sinh.
4. Tăng cường đoàn kết quốc tế, mở rộng hoạt động đối ngoại nhân dân.
5. Tăng cường củng cố tổ chức, đổi mới nội dung, phương thức, nâng cao hiệu quả hoạt động của MTTQ Việt Nam:
- Kiện toàn và nâng cao chất lượng hoạt động của 21 Ban Công tác Mặt trận khu phố.

III. ĐÁNH GIÁ CHUNG VÀ TỒN TẠI HẠN CHẾ
1. Ưu điểm nổi bật:
2. Tồn tại, hạn chế và nguyên nhân:

IV. NHIỆM VỤ TRỌNG TÂM THỜI GIAN TỚI
1. [Nhiệm vụ 1]
2. [Nhiệm vụ 2]
3. [Nhiệm vụ 3]

TM. BAN THƯỜNG TRỰC
CHỦ TỊCH
(Ký, ghi rõ họ tên và đóng dấu)`
  },
  {
    id: 'tpl-3',
    title: 'Mẫu Biên bản họp Ban Công tác Mặt trận 21 Khu phố định kỳ',
    category: 'Biên bản',
    description: 'Mẫu biên bản họp triển khai nhiệm vụ tháng/quý của Ban Công tác Mặt trận và các chi hội đoàn thể khu phố.',
    content: `BAN CÔNG TÁC MẶT TRẬN
KHU PHỐ [TÊN KHU PHỐ]
---
Số:   /BB-BCTMT

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
Chánh Hiệp, ngày   tháng   năm 2026

BIÊN BẢN
Cuộc họp định kỳ Ban Công tác Mặt trận Khu phố [Tên KP]
Tháng ... Năm 2026

I. THỜI GIAN VÀ ĐỊA ĐIỂM
- Thời gian: Vào lúc ... giờ ... phút, ngày ... tháng ... năm 2026.
- Địa điểm: Văn phòng / Nhà sinh hoạt cộng đồng Khu phố [Tên KP].

II. THÀNH PHẦN THAM DỰ
1. Chủ trì: Ông/Bà [Họ tên] - Trưởng Ban Công tác Mặt trận khu phố.
2. Thư ký: Ông/Bà [Họ tên] - Thành viên Ban CTMT (Chi hội trưởng ...).
3. Thành phần tham dự:
- Đại diện Chi ủy Chi bộ khu phố: Đ/c [Họ tên] - Bí thư/Phó Bí thư Chi bộ.
- Trưởng Ban điều hành khu phố: Ông/Bà [Họ tên].
- Các thành viên Ban CTMT (Bí thư Chi đoàn, Chi hội trưởng Phụ nữ, CCB, Nông dân, Người cao tuổi, Khuyến học, Chữ thập đỏ...).
- Vắng mặt: ... đ/c (Lý do: ...).

III. NỘI DUNG CUỘC HỌP
1. Trưởng Ban Công tác Mặt trận đánh giá tình hình hoạt động tháng qua:
- Tình hình tư tưởng, an ninh trật tự và đời sống nhân dân trong khu phố.
- Kết quả thực hiện các phong trào thi đua và các cuộc vận động tại khu phố.
- Tình hình thu - nộp các loại quỹ an sinh (Quỹ "Vì người nghèo", "Đền ơn đáp nghĩa"...).
2. Triển khai nhiệm vụ trọng tâm tháng tới của Ủy ban MTTQ phường:
- [Triển khai nhiệm vụ 1: Vận động nhân dân giữ gìn vệ sinh môi trường, tuyến hẻm văn minh]
- [Triển khai nhiệm vụ 2: Rà soát hộ nghèo, hộ khó khăn cần hỗ trợ]
- [Triển khai nhiệm vụ 3: Nắm bắt tâm tư, nguyện vọng và ý kiến phản ánh của nhân dân]
3. Ý kiến thảo luận của các thành viên:
- Ý kiến Chi hội Phụ nữ: ...
- Ý kiến Chi hội Cựu chiến binh: ...
- Ý kiến Chi đoàn Thanh niên: ...
- Ý kiến của Ban điều hành khu phố: ...
4. Phát biểu chỉ đạo của Đại diện Chi ủy Chi bộ:
- Nhất trí với dự thảo đánh giá và phương hướng nhiệm vụ. Đề nghị Ban CTMT tập trung vận động nhân dân giải quyết dứt điểm các vướng mắc tại tổ tự quản số ...

IV. KẾT LUẬN CUỘC HỌP
- Chủ trì cuộc họp tổng hợp và kết luận các nội dung thống nhất thực hiện:
+ Phân công đ/c ... phụ trách theo dõi tổ dân phố ...
+ Thời gian hoàn thành rà soát: trước ngày .../.../2026.

Biên bản kết thúc vào lúc ... giờ ... cùng ngày, đã được thông qua và toàn thể thành viên dự họp nhất trí 100%.

THƯ KÝ CUỘC HỌP
(Ký, ghi rõ họ tên)

TM. BAN CÔNG TÁC MẶT TRẬN
TRƯỞNG BAN
(Ký, ghi rõ họ tên)`
  },
  {
    id: 'tpl-4',
    title: 'Mẫu Tờ trình đề nghị hỗ trợ xây dựng / sửa chữa "Nhà Đại đoàn kết"',
    category: 'Tờ trình',
    description: 'Tờ trình thẩm định và đề xuất trích Quỹ "Vì người nghèo" hỗ trợ nhà ở cho hộ nghèo, khó khăn.',
    content: `ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP
BAN VẬN ĐỘNG QUỸ "VÌ NGƯỜI NGHÈO"
Số:   /TTr-BVĐ

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
Chánh Hiệp, ngày   tháng   năm 2026

TỜ TRÌNH
Về việc đề nghị phê duyệt kinh phí hỗ trợ [XÂY MỚI / SỬA CHỮA]
Nhà "Đại đoàn kết" cho hộ nghèo năm 2026

Kính gửi:
- Ban Thường trực Ủy ban MTTQ Việt Nam Thành phố;
- Ban Quản lý Quỹ "Vì người nghèo" cấp trên;
- Thường trực Đảng ủy phường Chánh Hiệp.

Căn cứ Quy chế quản lý và sử dụng Quỹ "Vì người nghèo";
Căn cứ kết quả khảo sát thực tế và biên bản họp xét duyệt của Ban Công tác Mặt trận Khu phố [Tên KP] ngày .../.../2026;

Ban Thường trực Ủy ban MTTQ Việt Nam - Ban Vận động Quỹ "Vì người nghèo" phường Chánh Hiệp kính trình Ban Thường trực cấp trên xem xét, phê duyệt hỗ trợ kinh phí xây dựng/sửa chữa Nhà "Đại đoàn kết" cho đối tượng sau:

1. THÔNG TIN HỘ GIA ĐÌNH ĐƯỢC ĐỀ NGHỊ HỖ TRỢ
- Họ và tên chủ hộ: [Họ và tên]      Năm sinh: ...
- Địa chỉ: Số nhà ..., Tổ ..., Khu phố [Tên KP], phường Chánh Hiệp.
- Thuộc diện: Hộ nghèo / Hộ cận nghèo / Hộ có hoàn cảnh đặc biệt khó khăn.
- Tình trạng nhà ở hiện nay: Nhà cấp 4 tường mục nát, mái tôn dột nát, nền trũng thấp ngập úng mùa mưa, có nguy cơ đổ sập mất an toàn.

2. PHƯƠNG ÁN XÂY DỰNG / SỬA CHỮA VÀ KINH PHÍ DỰ KIẾN
- Quy mô xây dựng/sửa chữa: Nhà cấp 4, diện tích ... m2, tường gạch quét vôi/sơn nước, mái tôn, nền lát gạch men, cửa sắt.
- Tổng dự toán kinh phí: ... đồng (Bằng chữ: ...).
Trong đó:
+ Đề nghị Quỹ "Vì người nghèo" hỗ trợ: ... đồng.
+ Nguồn xã hội hóa và mạnh thường quân hỗ trợ: ... đồng.
+ Gia đình, dòng họ đóng góp: ... đồng.

3. THỜI GIAN THỰC HIỆN
- Dự kiến khởi công: Ngày .../.../2026.
- Dự kiến bàn giao: Ngày .../.../2026 (Nhân dịp Ngày hội Đại đoàn kết 18/11).

Kính đề nghị Ban Thường trực cấp trên quan tâm xem xét, phê duyệt để địa phương kịp thời triển khai thi công giúp gia đình sớm ổn định cuộc sống.

Nơi nhận:
- Như trên;
- Chi bộ & Ban CTMT Khu phố;
- Lưu: VT, BTT MTTQ.

TM. BAN THƯỜNG TRỰC
CHỦ TỊCH / TRƯỞNG BAN VẬN ĐỘNG
(Ký, ghi rõ họ tên và đóng dấu)`
  },
  {
    id: 'tpl-5',
    title: 'Mẫu Báo cáo Kết quả Giám sát của Ban Thanh tra nhân dân / Ban GSĐTCCĐ',
    category: 'Báo cáo',
    description: 'Mẫu báo cáo giám sát công trình công cộng, chính sách an sinh hoặc giải quyết TTHC tại địa bàn.',
    content: `ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP
BAN THANH TRA NHÂN DÂN
Số:   /BC-BTTND

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
Chánh Hiệp, ngày   tháng   năm 2026

BÁO CÁO KẾT QUẢ GIÁM SÁT
Về việc: [TÊN NỘI DUNG HOẶC CÔNG TRÌNH GIÁM SÁT]
Tại địa bàn Khu phố [Tên KP], phường Chánh Hiệp

Thực hiện Kế hoạch giám sát số .../KH-BTTND ngày .../.../2026 của Ban Thanh tra nhân dân phường Chánh Hiệp;
Từ ngày .../.../2026 đến ngày .../.../2026, Đoàn giám sát của Ban TTND đã tiến hành giám sát thực tế tại [Địa điểm giám sát]. Nay Ban TTND báo cáo kết quả như sau:

I. ĐỐI TƯỢNG VÀ PHẠM VI GIÁM SÁT
1. Đối tượng giám sát: [Đơn vị thi công / Bộ phận chuyên môn / Ban điều hành khu phố].
2. Nội dung giám sát: [Tiến độ, chất lượng thi công công trình nâng cấp hẻm / Thực hiện chính sách hỗ trợ chi trả an sinh xã hội...].

II. KẾT QUẢ GIÁM SÁT THỰC TẾ
1. Những mặt đạt được:
- Đơn vị thực hiện cơ bản chấp thuận đúng quy trình, tiến độ và thiết kế đã được phê duyệt.
- Công khai, minh bạch thông tin tại Nhà văn hóa khu phố để nhân dân cùng giám sát.
2. Những tồn tại, hạn chế hoặc sai phạm phát hiện (nếu có):
- [Vấn đề 1: Đơn vị thi công tập kết vật liệu cản trở giao thông sinh hoạt của người dân tại hẻm ...]
- [Vấn đề 2: Chất lượng đầm nén nền hạ một số đoạn chưa đạt yêu cầu theo phản ánh của nhân dân ...]

III. KIẾN NGHỊ VÀ ĐỀ XUẤT
Ban Thanh tra nhân dân phường kiến nghị:
1. Đối với UBND phường: Chỉ đạo bộ phận Địa chính - Đô thị kiểm tra, yêu cầu đơn vị thi công khắc phục ngay các tồn tại nêu trên.
2. Đối với Đơn vị thực hiện / Ban quản lý dự án: Đẩy nhanh tiến độ hoàn trả mặt bằng, vệ sinh môi trường sau thi công.
3. Đề nghị Ban Thường trực Ủy ban MTTQ phường theo dõi, đôn đốc việc xử lý kiến nghị sau giám sát.

Nơi nhận:
- Ban Thường trực MTTQ phường (để b/c);
- UBND phường Chánh Hiệp (để giải quyết);
- Ban CTMT Khu phố;
- Lưu: Hồ sơ giám sát.

TM. BAN THANH TRA NHÂN DÂN
TRƯỞNG BAN
(Ký, ghi rõ họ tên)`
  },
  {
    id: 'tpl-6',
    title: 'Mẫu Kế hoạch tổ chức "Ngày hội Đại đoàn kết toàn dân tộc" 18/11 ở Khu dân cư',
    category: 'Kế hoạch',
    description: 'Kế hoạch tổ chức ngày hội 18/11 tại 21 khu dân cư theo hướng dẫn của Ủy ban Trung ương MTTQ Việt Nam.',
    content: `BAN CÔNG TÁC MẶT TRẬN
KHU PHỐ [TÊN KHU PHỐ]
Số:   /KH-BCTMT

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
Chánh Hiệp, ngày   tháng 10 năm 2026

KẾ HOẠCH
Tổ chức "Ngày hội Đại đoàn kết toàn dân tộc" ở Khu dân cư
Kỷ niệm 96 năm Ngày truyền thống MTTQ Việt Nam (18/11/1930 - 18/11/2026)

Thực hiện Hướng dẫn của Ban Thường trực Ủy ban MTTQ Việt Nam phường Chánh Hiệp về việc tổ chức Ngày hội Đại đoàn kết toàn dân tộc năm 2026;
Được sự chỉ đạo của Chi ủy Chi bộ Khu phố; Ban Công tác Mặt trận phối hợp với Ban Điều hành và các chi hội đoàn thể Khu phố [Tên KP] xây dựng Kế hoạch tổ chức Ngày hội như sau:

I. MỤC ĐÍCH, Ý NGHĨA
1. Ôn lại truyền thống vẻ vang 96 năm của Mặt trận Tổ quốc Việt Nam và khối đại đoàn kết toàn dân tộc.
2. Đánh giá kết quả 1 năm thực hiện Cuộc vận động "Toàn dân đoàn kết xây dựng nông thôn mới, đô thị văn minh"; biểu dương các tập thể, hộ gia đình văn hóa tiêu biểu, "Gương sáng Mặt trận".
3. Tạo không khí vui tươi, đoàn kết, thắt chặt tình làng nghĩa xóm thông qua các hoạt động văn hóa, trò chơi dân gian và Bữa cơm Đại đoàn kết.

II. NỘI DUNG VÀ HÌNH THỨC TỔ CHỨC
Ngày hội gồm 2 phần chính:
1. Phần Lễ (Thời lượng khoảng 60 phút):
- Văn nghệ chào mừng.
- Chào cờ, tuyên bố lý do, giới thiệu đại biểu.
- Ôn lại lịch sử và truyền thống Ngày truyền thống MTTQ Việt Nam.
- Báo cáo kết quả xây dựng khối đại đoàn kết và phong trào thi đua năm 2026 của khu phố.
- Tọa đàm, phát biểu đóng góp ý kiến của nhân dân xây dựng khu dân cư văn minh.
- Phát biểu của lãnh đạo cấp trên (Đảng ủy / UBND / MTTQ phường).
- Biểu dương, khen thưởng các gia đình văn hóa tiêu biểu, cá nhân có thành tích xuất sắc.
- Phát động đợt thi đua mới và ký kết giao ước thi đua giữa các tổ tự quản.
2. Phần Hội (Thời lượng 60 - 90 phút):
- Tổ chức các trò chơi dân gian (kéo co, cờ tướng, đập niêu, bịt mắt bắt vịt...).
- Gian hàng ẩm thực dân gian / Trưng bày sản phẩm "Dân vận khéo".
- Tổ chức "Bữa cơm Đại đoàn kết" ấm cúng tại khu dân cư.

III. THỜI GIAN VÀ ĐỊA ĐIỂM
1. Thời gian: Từ ... giờ ngày ... tháng 11 năm 2026.
2. Địa điểm: Nhà Văn hóa / Sân thể thao cộng đồng Khu phố [Tên KP].

IV. PHÂN CÔNG NHIỆM VỤ
1. Trưởng Ban CTMT: Phụ trách chung, xây dựng báo cáo và điều hành phần Lễ.
2. Ban Điều hành Khu phố: Rà soát danh sách khen thưởng gia đình văn hóa tiêu biểu.
3. Chi đoàn Thanh niên: Chuẩn bị âm thanh, ánh sáng, dẫn chương trình và điều hành trò chơi phần Hội.
4. Chi hội Phụ nữ: Phụ trách khánh tiết, tiếp tân và hậu cần Bữa cơm Đại đoàn kết.
5. Chi hội Cựu chiến binh: Đảm bảo công tác an ninh trật tự, trông giữ xe.

TM. BAN CÔNG TÁC MẶT TRẬN
TRƯỞNG BAN
(Ký, ghi rõ họ tên)`
  },
  {
    id: 'tpl-7',
    title: 'Mẫu Bản Đăng ký Công trình / Mô hình "Dân vận khéo" cấp cơ sở',
    category: 'Kế hoạch',
    description: 'Mẫu bản đăng ký mô hình, công trình tự quản vì cộng đồng tại các khu dân cư.',
    content: `ĐẢNG BỘ PHƯỜNG CHÁNH HIỆP
KHỐI DÂN VẬN - MẶT TRẬN TỔ QUỐC
---

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
Chánh Hiệp, ngày   tháng   năm 2026

BẢN ĐĂNG KÝ
Mô hình / Công trình "Dân vận khéo" năm 2026

Kính gửi: Khối Dân vận Đảng ủy - Ban Thường trực Ủy ban MTTQ phường Chánh Hiệp.

1. TÊN ĐƠN VỊ ĐĂNG KÝ: Ban Công tác Mặt trận Khu phố [Tên KP]
2. TÊN MÔ HÌNH / CÔNG TRÌNH: "Tuyến hẻm tự quản Xanh - Sạch - Văn minh - An toàn PCCC"
3. LĨNH VỰC ĐĂNG KÝ: Xây dựng Đô thị văn minh & Bảo vệ Môi trường.

4. MỤC TIÊU VÀ NỘI DUNG THỰC HIỆN
a) Mục tiêu:
- Vận động 100% hộ dân trên tuyến hẻm số ... tự nguyện đóng góp kinh phí và ngày công bê tông hóa/tráng nhựa tuyến hẻm dài ...m.
- Lắp đặt hệ thống camera an ninh, 10 bình chữa cháy công cộng và trồng 50 chậu hoa cây cảnh trước cửa nhà.
b) Nội dung và giải pháp:
- "Khéo tuyên truyền, vận động": Họp từng tổ dân phố lấy ý kiến đồng thuận "Dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, dân thụ hưởng".
- "Khéo huy động nguồn lực": Xã hội hóa 100% kinh phí thực hiện ước tính ... triệu đồng, không dùng ngân sách nhà nước.
- "Khéo duy trì": Thành lập Tổ tự quản hẻm phụ trách tưới cây, kiểm tra PCCC và vệ sinh hàng tuần.

5. TIẾN ĐỘ THỰC HIỆN
- Tháng .../2026: Khảo sát, họp dân và thông qua phương án.
- Tháng .../2026: Triển khai thi công và lắp đặt trang thiết bị.
- Tháng .../2026: Nghiệm thu, gắn biển công trình chào mừng Ngày hội Đại đoàn kết.

XÁC NHẬN CỦA CHI ỦY CHI BỘ
BÍ THƯ
(Ký, ghi rõ họ tên)

ĐẠI DIỆN ĐƠN VỊ ĐĂNG KÝ
TRƯỞNG BAN CTMT
(Ký, ghi rõ họ tên)`
  },
  {
    id: 'tpl-8',
    title: 'Mẫu Quyết định công nhận / kiện toàn Ban Công tác Mặt trận Khu phố',
    category: 'Quyết định',
    description: 'Quyết định chuẩn y danh sách Trưởng ban, Phó ban và các thành viên Ban Công tác Mặt trận.',
    content: `ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP
BAN THƯỜNG TRỰC
Số:   /QĐ-MTTQ-BTT

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
Chánh Hiệp, ngày   tháng   năm 2026

QUYẾT ĐỊNH
Về việc kiện toàn / công nhận thành viên Ban Công tác Mặt trận
Khu phố [Tên KP], phường Chánh Hiệp nhiệm kỳ 2024 - 2029

BAN THƯỜNG TRỰC ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP

Căn cứ Điều lệ Mặt trận Tổ quốc Việt Nam;
Căn cứ Thông tri số 25/TT-MTTW-BTT của Ban Thường trực Ủy ban Trung ương MTTQ Việt Nam;
Xét đề nghị của Chi ủy Chi bộ và Biên bản hiệp thương của Ban Công tác Mặt trận Khu phố [Tên KP] ngày .../.../2026;

QUYẾT ĐỊNH:

Điều 1. Công nhận / Kiện toàn Ban Công tác Mặt trận Khu phố [Tên KP], phường Chánh Hiệp nhiệm kỳ 2024 - 2029 gồm các ông/bà có tên sau:
1. Ông/Bà: [Họ và tên] - Trưởng ban.
2. Ông/Bà: [Họ và tên] - Phó Trưởng ban.
3. Ông/Bà: [Họ và tên] - Thành viên (Chi hội trưởng Phụ nữ).
4. Ông/Bà: [Họ và tên] - Thành viên (Bí thư Chi đoàn).
5. Ông/Bà: [Họ và tên] - Thành viên (Chi hội trưởng CCB).
6. Ông/Bà: [Họ và tên] - Thành viên (Chi hội trưởng Người cao tuổi).
7. Ông/Bà: [Họ và tên] - Thành viên (Đại diện người có uy tín / tôn giáo).

Điều 2. Ban Công tác Mặt trận Khu phố [Tên KP] có trách nhiệm thực hiện nhiệm vụ, quyền hạn theo đúng quy định của Điều lệ MTTQ Việt Nam và Quy chế hoạt động của Ủy ban MTTQ phường.

Điều 3. Ban Thường trực Ủy ban MTTQ phường, Chi bộ Khu phố, các ban ngành đoàn thể liên quan và các ông/bà có tên tại Điều 1 chịu trách nhiệm thi hành Quyết định này kể từ ngày ký.

Nơi nhận:
- Thường trực Đảng ủy phường;
- Chi ủy Chi bộ Khu phố;
- Như Điều 3;
- Lưu: VT, MTTQ.

TM. BAN THƯỜNG TRỰC
CHỦ TỊCH
(Ký, ghi rõ họ tên và đóng dấu)`
  },
  {
    id: 'tpl-9',
    title: 'Mẫu Thông báo phân công nhiệm vụ thành viên Ban Công tác Mặt trận khu phố',
    category: 'Thông báo',
    description: 'Bản phân công nhiệm vụ cụ thể từng mảng công tác cho các thành viên trong Ban CTMT.',
    content: `BAN CÔNG TÁC MẶT TRẬN
KHU PHỐ [TÊN KHU PHỐ]
Số:   /TB-BCTMT

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
Chánh Hiệp, ngày   tháng   năm 2026

THÔNG BÁO
Về việc phân công nhiệm vụ các thành viên Ban Công tác Mặt trận
Khu phố [Tên KP] năm 2026

Căn cứ Quyết định số .../QĐ-MTTQ-BTT của Ban Thường trực Ủy ban MTTQ Việt Nam phường Chánh Hiệp;
Để đảm bảo thực hiện thắng lợi các chỉ tiêu công tác Mặt trận tại địa bàn khu dân cư, Ban Công tác Mặt trận Khu phố [Tên KP] phân công nhiệm vụ cụ thể như sau:

1. Ông/Bà [Họ tên] - Trưởng Ban CTMT:
- Phụ trách chung toàn bộ hoạt động của Ban Công tác Mặt trận.
- Trực tiếp chỉ đạo công tác tuyên truyền, xây dựng khối đại đoàn kết, chủ trì các cuộc họp định kỳ và tiếp xúc cử tri.
- Phụ trách địa bàn các tổ dân phố: Tổ 1, Tổ 2, Tổ 3.

2. Ông/Bà [Họ tên] - Phó Trưởng Ban CTMT:
- Giúp Trưởng ban điều hành các công việc khi Trưởng ban vắng mặt.
- Phụ trách theo dõi công tác an sinh xã hội, vận động Quỹ "Vì người nghèo", quản lý hồ sơ sổ sách.
- Phụ trách địa bàn các tổ dân phố: Tổ 4, Tổ 5, Tổ 6.

3. Ông/Bà [Họ tên] - Chi hội trưởng Phụ nữ (Thành viên):
- Phụ trách vận động phong trào "Xây dựng gia đình 5 không 3 sạch", phân loại rác tại nguồn và tổ tiết kiệm vay vốn phụ nữ.

4. Ông/Bà [Họ tên] - Bí thư Chi đoàn (Thành viên):
- Phụ trách công tác thanh niên xung kích, Chuyển đổi số cộng đồng, hướng dẫn người dân dịch vụ công trực tuyến và phong trào văn hóa thể thao.

5. Ông/Bà [Họ tên] - Chi hội trưởng CCB (Thành viên):
- Phụ trách công tác tự quản an ninh trật tự, tham gia hòa giải mâu thuẫn cơ sở và giáo dục truyền thống cách mạng cho thế hệ trẻ.

Yêu cầu các thành viên chủ động phối hợp chặt chẽ, định kỳ báo cáo kết quả thực hiện trong cuộc họp giao ban hàng tháng của Ban Công tác Mặt trận.

TM. BAN CÔNG TÁC MẶT TRẬN
TRƯỞNG BAN
(Ký, ghi rõ họ tên)`
  }
];

export const INITIAL_DRIVE_FILES: DriveFileItem[] = [
  {
    id: 'df-1',
    fileId: 'drive-101',
    name: 'Danh_sach_Ho_ngheo_Nhan_Qua_Tet_2026.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    webViewLink: 'https://docs.google.com/spreadsheets',
    folderName: 'An sinh xã hội & Tết 2026',
    owner: 'Trần Thị Hoa',
    modifiedTime: '2026-08-28 11:30',
    sizeFormatted: '1.2 MB'
  },
  {
    id: 'df-2',
    fileId: 'drive-102',
    name: 'Ke_hoach_Ngay_hoi_Dai_doan_ket_2026_Final.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    webViewLink: 'https://docs.google.com/document',
    folderName: 'Kế hoạch & Văn bản 2026',
    owner: 'Lê Văn Bình',
    modifiedTime: '2026-08-20 09:15',
    sizeFormatted: '450 KB'
  },
  {
    id: 'df-3',
    fileId: 'drive-103',
    name: 'Hinh_anh_Ngay_hoi_Dai_doan_ket_KP4.zip',
    mimeType: 'application/zip',
    webViewLink: 'https://drive.google.com',
    folderName: 'Hình ảnh Hoạt động',
    owner: 'Lê Thị Thu Thảo',
    modifiedTime: '2026-08-28 17:00',
    sizeFormatted: '28.4 MB'
  }
];

export const INITIAL_STAFF_USERS: StaffUser[] = [
  {
    id: 'staff-1',
    email: 'nguyenhuy.thudaumot@gmail.com',
    fullname: 'Nguyễn Huy',
    position: 'Trưởng Ban Thường trực MTTQ',
    department: 'Ban Thường trực',
    avatar: getOfficialCadreAvatarSvg('Nguyễn Huy', 'Trưởng Ban Thường trực'),
    phone: '0908.681.988',
    bio: 'Chủ tịch / Trưởng Ban Thường trực Ủy ban Mặt trận Tổ quốc Việt Nam phường Chánh Hiệp - Chỉ đạo điều hành toàn bộ công tác Mặt trận và Văn phòng số.',
    role: 'SUPER_ADMIN',
    permissions: ['all'],
    active: true,
    createdAt: '2026-01-01'
  },
  {
    id: 'staff-2',
    email: 'buivanhuy0705@gmail.com',
    fullname: 'Bùi Văn Huy',
    position: 'Phó Chủ tịch MTTQ',
    department: 'Ban Thường trực',
    avatar: getOfficialCadreAvatarSvg('Bùi Văn Huy', 'Phó Chủ tịch'),
    phone: '0907.123.456',
    bio: 'Phó Chủ tịch Ủy ban MTTQ Việt Nam Phường Chánh Hiệp.',
    role: 'ADMIN',
    permissions: ['all'],
    active: true,
    createdAt: '2026-01-01'
  },
  {
    id: 'staff-3',
    email: 'vannam.mttq@chanhhiep.gov.vn',
    fullname: 'Trần Văn Nam',
    position: 'Ủy viên Thường trực',
    department: 'Bộ phận Văn phòng - Giám sát',
    avatar: getOfficialCadreAvatarSvg('Trần Văn Nam', 'Ủy viên Thường trực'),
    role: 'MANAGER',
    permissions: ['manage_tasks', 'manage_cms', 'manage_opinions'],
    active: true,
    createdAt: '2026-01-01'
  },
  {
    id: 'staff-4',
    email: 'thuthao.mttq@chanhhiep.gov.vn',
    fullname: 'Lê Thị Thu Thảo',
    position: 'Cán bộ Tuyên giáo - Thi đua',
    department: 'Bộ phận Tuyên giáo',
    avatar: getOfficialCadreAvatarSvg('Lê Thị Thu Thảo', 'Cán bộ Tuyên giáo'),
    role: 'EDITOR',
    permissions: ['write_articles', 'manage_competitions'],
    active: true,
    createdAt: '2026-01-01'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'staff-1',
    userName: 'Trần Thị Hoa',
    action: 'ĐĂNG NHẬP',
    entity: 'Xác thực Hệ thống',
    details: 'Cán bộ đăng nhập vào Văn phòng số qua Google OAuth',
    timestamp: '2026-08-30 19:35'
  },
  {
    id: 'log-2',
    userId: 'staff-4',
    userName: 'Lê Thị Thu Thảo',
    action: 'DUYỆT BÀI VIẾT',
    entity: 'Tin tức',
    details: 'Đã xuất bản bài viết: Phường Chánh Hiệp tổ chức Ngày hội Đại đoàn kết',
    timestamp: '2026-08-28 10:12'
  }
];

export const INITIAL_AREAS: Area[] = [
  {
    id: 'area-chanh-hiep',
    code: 'CHANH-HIEP',
    name: 'Phường Chánh Hiệp',
    type: 'WARD',
    parentId: null,
    order: 0,
    description: 'Địa bàn hành chính Phường Chánh Hiệp, TP. Hồ Chí Minh',
    population: 68500,
    householdsCount: 16800,
    leaderName: 'Nguyễn Văn Nam',
    leaderPhone: '0274.3822.111',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-1',
    code: 'KP-01',
    name: 'Tương Bình Hiệp 1',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 1,
    description: 'Địa bàn Khu phố Tương Bình Hiệp 1, phường Chánh Hiệp',
    population: 3120,
    householdsCount: 780,
    leaderName: 'Đoàn Thị Bích Vân',
    leaderPhone: '0933742769',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-2',
    code: 'KP-02',
    name: 'Tương Bình Hiệp 2',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 2,
    description: 'Địa bàn Khu phố Tương Bình Hiệp 2, phường Chánh Hiệp',
    population: 2950,
    householdsCount: 720,
    leaderName: 'Lê Thị Thanh Loan',
    leaderPhone: '0336749484',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-3',
    code: 'KP-03',
    name: 'Tương Bình Hiệp 3',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 3,
    description: 'Địa bàn Khu phố Tương Bình Hiệp 3, phường Chánh Hiệp',
    population: 3400,
    householdsCount: 840,
    leaderName: 'Nguyễn Văn An',
    leaderPhone: '0919908008',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-4',
    code: 'KP-04',
    name: 'Tương Bình Hiệp 4',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 4,
    description: 'Địa bàn Khu phố Tương Bình Hiệp 4, phường Chánh Hiệp',
    population: 2800,
    householdsCount: 690,
    leaderName: 'Nguyễn Minh Hoàng',
    leaderPhone: '0358934767',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-5',
    code: 'KP-05',
    name: 'Tương Bình Hiệp 5',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 5,
    description: 'Địa bàn Khu phố Tương Bình Hiệp 5, phường Chánh Hiệp',
    population: 3600,
    householdsCount: 890,
    leaderName: 'Nguyễn Hoài Tân',
    leaderPhone: '0908739555',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-6',
    code: 'KP-06',
    name: 'Tương Bình Hiệp 6',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 6,
    description: 'Địa bàn Khu phố Tương Bình Hiệp 6, phường Chánh Hiệp',
    population: 3200,
    householdsCount: 760,
    leaderName: 'Võ Oanh Kiều',
    leaderPhone: '0915337788',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-7',
    code: 'KP-07',
    name: 'Tương Bình Hiệp 7',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 7,
    description: 'Địa bàn Khu phố Tương Bình Hiệp 7, phường Chánh Hiệp',
    population: 3050,
    householdsCount: 750,
    leaderName: 'Trần Minh Khải',
    leaderPhone: '0914919646',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-8',
    code: 'KP-08',
    name: 'Hiệp An 7',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 8,
    description: 'Địa bàn Khu phố Hiệp An 7, phường Chánh Hiệp',
    population: 3300,
    householdsCount: 810,
    leaderName: 'Nguyễn Thanh Trí',
    leaderPhone: '0965052061',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-9',
    code: 'KP-09',
    name: 'Hiệp An 8',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 9,
    description: 'Địa bàn Khu phố Hiệp An 8, phường Chánh Hiệp',
    population: 3150,
    householdsCount: 770,
    leaderName: 'Phan Tấn Nhân',
    leaderPhone: '0918231463',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-10',
    code: 'KP-10',
    name: 'Hiệp An 9',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 10,
    description: 'Địa bàn Khu phố Hiệp An 9, phường Chánh Hiệp',
    population: 2900,
    householdsCount: 710,
    leaderName: 'Nguyễn Nhật Hồng',
    leaderPhone: '0828643979',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-11',
    code: 'KP-11',
    name: 'Định Hòa 1',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 11,
    description: 'Địa bàn Khu phố Định Hòa 1, phường Chánh Hiệp',
    population: 3350,
    householdsCount: 820,
    leaderName: 'Nguyễn Thanh Vân',
    leaderPhone: '0987933156',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-12',
    code: 'KP-12',
    name: 'Định Hòa 2',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 12,
    description: 'Địa bàn Khu phố Định Hòa 2, phường Chánh Hiệp',
    population: 3420,
    householdsCount: 835,
    leaderName: 'Nguyễn Phượng Hằng',
    leaderPhone: '0918598078',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-13',
    code: 'KP-13',
    name: 'Định Hòa 3',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 13,
    description: 'Địa bàn Khu phố Định Hòa 3, phường Chánh Hiệp',
    population: 3210,
    householdsCount: 785,
    leaderName: 'Đỗ Thị Tấn',
    leaderPhone: '0785185879',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-14',
    code: 'KP-14',
    name: 'Định Hòa 4',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 14,
    description: 'Địa bàn Khu phố Định Hòa 4, phường Chánh Hiệp',
    population: 3180,
    householdsCount: 775,
    leaderName: 'Văn Văn Hạnh',
    leaderPhone: '0938377151',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-15',
    code: 'KP-15',
    name: 'Định Hòa 5',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 15,
    description: 'Địa bàn Khu phố Định Hòa 5, phường Chánh Hiệp',
    population: 2980,
    householdsCount: 730,
    leaderName: 'Ngô Văn Còn',
    leaderPhone: '0938565172',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-16',
    code: 'KP-16',
    name: 'Định Hòa 6',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 16,
    description: 'Địa bàn Khu phố Định Hòa 6, phường Chánh Hiệp',
    population: 3500,
    householdsCount: 860,
    leaderName: 'Nguyễn Văn Gọt',
    leaderPhone: '0919042548',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-17',
    code: 'KP-17',
    name: 'Định Hòa 7',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 17,
    description: 'Địa bàn Khu phố Định Hòa 7, phường Chánh Hiệp',
    population: 2890,
    householdsCount: 710,
    leaderName: 'Đặng Thị Thúy Loan',
    leaderPhone: '0985996979',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-18',
    code: 'KP-18',
    name: 'Định Hòa 8',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 18,
    description: 'Địa bàn Khu phố Định Hòa 8, phường Chánh Hiệp',
    population: 3260,
    householdsCount: 800,
    leaderName: 'Nguyễn Văn Phụng',
    leaderPhone: '0886848586',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-19',
    code: 'KP-19',
    name: 'Mỹ Hảo',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 19,
    description: 'Địa bàn Khu phố Mỹ Hảo, phường Chánh Hiệp',
    population: 3340,
    householdsCount: 815,
    leaderName: 'Nguyễn Văn Hòa',
    leaderPhone: '0901689828',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-20',
    code: 'KP-20',
    name: 'Chánh Mỹ 1',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 20,
    description: 'Địa bàn Khu phố Chánh Mỹ 1, phường Chánh Hiệp',
    population: 3450,
    householdsCount: 845,
    leaderName: 'Đặng Mỹ Dung',
    leaderPhone: '0919450576',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-21',
    code: 'KP-21',
    name: 'Chánh Mỹ 2',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 21,
    description: 'Địa bàn Khu phố Chánh Mỹ 2, phường Chánh Hiệp',
    population: 3600,
    householdsCount: 880,
    leaderName: 'Bùi Thị Thu Thảo',
    leaderPhone: '0907008308',
    createdAt: '2026-01-01'
  }
];

export const INITIAL_ORGANIZATIONS: Organization[] = [
  // 1. Đảng ủy Phường
  {
    id: 'org-dang-uy',
    code: 'DU-CH',
    name: 'Đảng ủy Phường Chánh Hiệp',
    shortName: 'Đảng ủy Phường',
    slug: 'dang-uy-phuong-chanh-hiep',
    type: 'POLITICAL_PARTY',
    level: 'WARD',
    parentId: null,
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    leaderName: 'Nguyễn Văn Minh',
    leaderPosition: 'Bí thư Đảng ủy',
    phone: '0274.3822.100',
    email: 'danguy.chanhhiep@tphcm.gov.vn',
    address: 'Trụ sở Đảng ủy - HĐND - UBND Phường Chánh Hiệp',
    description: 'Cơ quan lãnh đạo toàn diện hệ thống chính trị tại địa phương.',
    membersCount: 420,
    partyMembersCount: 420,
    displayOrder: 1,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  // 2. Ủy ban MTTQ Việt Nam Phường
  {
    id: 'org-mttq-phuong',
    code: 'MTTQ-CH',
    name: 'Ủy ban MTTQ Việt Nam Phường Chánh Hiệp',
    shortName: 'Ủy ban MTTQ Phường',
    slug: 'uy-ban-mttq-viet-nam-phuong-chanh-hiep',
    type: 'FATHERLAND_FRONT',
    level: 'WARD',
    parentId: null,
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    leaderName: 'Nguyễn Công Lý',
    leaderPosition: 'Chủ tịch UB MTTQ VN phường',
    phone: '0274.3822.111',
    email: 'mttq.chanhhiep@gmail.com',
    address: 'Trụ sở Cơ quan Khối Vận MTTQ & Đoàn thể Phường Chánh Hiệp',
    description: 'Liên minh chính trị, liên hiệp tự nguyện tập hợp khối đại đoàn kết toàn dân tộc.',
    avatarUrl: 'https://sv2.anhsieuviet.com/2026/09/02/862c92e8-1336-4885-8787-1a6702c3a178ad174eb779884713.png',
    bannerUrl: 'https://sv2.anhsieuviet.com/2026/09/02/b94eb55d-1061-4c4f-9278-a46ce8de408a9067fc5c33d6b0a2.png',
    membersCount: 45,
    partyMembersCount: 38,
    displayOrder: 2,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  // 3. Ủy ban Nhân dân Phường
  {
    id: 'org-hdnd-ubnd',
    code: 'UBND-CH',
    name: 'Ủy ban Nhân dân Phường Chánh Hiệp',
    shortName: 'UBND Phường',
    slug: 'ubnd-phuong-chanh-hiep',
    type: 'GOVERNMENT',
    level: 'WARD',
    parentId: null,
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    leaderName: 'Trần Văn Nam',
    leaderPosition: 'Chủ tịch UBND',
    phone: '0274.3822.102',
    email: 'ubnd.chanhhiep@tphcm.gov.vn',
    address: 'Đường Nguyễn Văn Tiết, Phường Chánh Hiệp',
    description: 'Cơ quan chấp hành của HĐND, cơ quan hành chính nhà nước ở địa phương.',
    membersCount: 36,
    partyMembersCount: 32,
    displayOrder: 3,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  // 4. Công an Phường
  {
    id: 'org-cong-an',
    code: 'CA-CH',
    name: 'Công an Phường Chánh Hiệp',
    shortName: 'Công an Phường',
    slug: 'cong-an-phuong-chanh-hiep',
    type: 'GOVERNMENT',
    level: 'WARD',
    parentId: null,
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    leaderName: 'Trung tá Lê Hoàng Tuấn',
    leaderPosition: 'Trưởng Công an Phường',
    phone: '0274.3822.113',
    email: 'congan.chanhhiep@tphcm.gov.vn',
    address: 'Trụ sở Công an Phường Chánh Hiệp',
    description: 'Lực lượng nòng cốt giữ gìn an ninh chính trị và trật tự an toàn xã hội trên địa bàn.',
    membersCount: 48,
    partyMembersCount: 45,
    displayOrder: 4,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  // 5. Ban Chỉ huy Quân sự Phường
  {
    id: 'org-quan-su',
    code: 'QS-CH',
    name: 'Ban Chỉ huy Quân sự Phường Chánh Hiệp',
    shortName: 'Ban CHQS Phường',
    slug: 'ban-chi-huy-quan-su-phuong-chanh-hiep',
    type: 'GOVERNMENT',
    level: 'WARD',
    parentId: null,
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    leaderName: 'Đồng chí Huỳnh Văn Dũng',
    leaderPosition: 'Chỉ huy trưởng Quân sự',
    phone: '0274.3822.114',
    email: 'quansu.chanhhiep@tphcm.gov.vn',
    address: 'Trụ sở Ban CHQS Phường Chánh Hiệp',
    description: 'Cơ quan tham mưu và tổ chức thực hiện nhiệm vụ quốc phòng, quân sự địa phương.',
    membersCount: 32,
    partyMembersCount: 28,
    displayOrder: 5,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  // 6. Đoàn TNCS Hồ Chí Minh Phường
  {
    id: 'org-doan-tn',
    code: 'DTN-CH',
    name: 'Đoàn TNCS Hồ Chí Minh Phường Chánh Hiệp',
    shortName: 'Đoàn Thanh niên Phường',
    slug: 'doan-tncs-ho-chi-minh-phuong-chanh-hiep',
    type: 'SOCIO_POLITICAL',
    level: 'WARD',
    parentId: null,
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    leaderName: 'Nguyễn Văn Đạt',
    leaderPosition: 'Bí thư Đoàn Phường',
    phone: '0274.3822.112',
    email: 'doanthanhnien.chanhhiep@gmail.com',
    avatarUrl: 'https://sv2.anhsieuviet.com/2026/09/02/8758f2ac-9342-47db-8f7f-7a3bcd434c32b7535a4487543751.png',
    bannerUrl: 'https://sv2.anhsieuviet.com/2026/09/02/775fbdb9-40fc-4b75-979f-7ebf40ecd00fb813d9fe5f77bf4c.png',
    membersCount: 520,
    partyMembersCount: 56,
    displayOrder: 6,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  // 7. Hội Liên hiệp Phụ nữ Phường
  {
    id: 'org-hoi-pn',
    code: 'HPN-CH',
    name: 'Hội Liên hiệp Phụ nữ Phường Chánh Hiệp',
    shortName: 'Hội Phụ nữ Phường',
    slug: 'hoi-lien-hiep-phu-nu-phuong-chanh-hiep',
    type: 'SOCIO_POLITICAL',
    level: 'WARD',
    parentId: null,
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    leaderName: 'Võ Thị Bích Loan',
    leaderPosition: 'Chủ tịch Hội LHPN',
    phone: '0274.3822.113',
    email: 'hoiphunu.chanhhiep@gmail.com',
    membersCount: 1680,
    partyMembersCount: 88,
    displayOrder: 7,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  // 8. Hội Cựu chiến binh Phường
  {
    id: 'org-hoi-ccb',
    code: 'CCB-CH',
    name: 'Hội Cựu chiến binh Phường Chánh Hiệp',
    shortName: 'Hội Cựu chiến binh Phường',
    slug: 'hoi-cuu-chien-binh-phuong-chanh-hiep',
    type: 'SOCIO_POLITICAL',
    level: 'WARD',
    parentId: null,
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    leaderName: 'Đặng Quốc Hùng',
    leaderPosition: 'Chủ tịch Hội CCB',
    phone: '0274.3822.114',
    email: 'cuuchienbinh.chanhhiep@gmail.com',
    membersCount: 420,
    partyMembersCount: 145,
    displayOrder: 8,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  // 9. Công đoàn Cơ sở Phường
  {
    id: 'org-cong-doan',
    code: 'CD-CH',
    name: 'Công đoàn Cơ sở Khối Phường Chánh Hiệp',
    shortName: 'Công đoàn Phường',
    slug: 'cong-doan-co-so-phuong-chanh-hiep',
    type: 'SOCIO_POLITICAL',
    level: 'WARD',
    parentId: null,
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    leaderName: 'Huỳnh Văn Nghĩa',
    leaderPosition: 'Chủ tịch Công đoàn',
    phone: '0274.3822.117',
    email: 'congdoan.chanhhiep@gmail.com',
    membersCount: 85,
    partyMembersCount: 42,
    displayOrder: 9,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  // 10. Hội Người cao tuổi Phường
  {
    id: 'org-hoi-nct',
    code: 'NCT-CH',
    name: 'Hội Người cao tuổi Phường Chánh Hiệp',
    shortName: 'Hội Người cao tuổi Phường',
    slug: 'hoi-nguoi-cao-tuoi-phuong-chanh-hiep',
    type: 'ASSOCIATION',
    level: 'WARD',
    parentId: null,
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    leaderName: 'Lê Văn Chính',
    leaderPosition: 'Chủ tịch Hội NCT',
    phone: '0274.3822.115',
    email: 'nguoicaotuoi.chanhhiep@gmail.com',
    membersCount: 1150,
    partyMembersCount: 165,
    displayOrder: 10,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  // 11. Hội Chữ thập đỏ Phường
  {
    id: 'org-hoi-ctd',
    code: 'CTD-CH',
    name: 'Hội Chữ thập đỏ Phường Chánh Hiệp',
    shortName: 'Hội Chữ thập đỏ Phường',
    slug: 'hoi-chu-thap-do-phuong-chanh-hiep',
    type: 'ASSOCIATION',
    level: 'WARD',
    parentId: null,
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    leaderName: 'Hoàng Thị Mai',
    leaderPosition: 'Chủ tịch Hội CTĐ',
    phone: '0274.3822.116',
    email: 'chuthapdo.chanhhiep@gmail.com',
    membersCount: 320,
    partyMembersCount: 36,
    displayOrder: 11,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  // 12. Hội Khuyến học Phường
  {
    id: 'org-hoi-kh',
    code: 'HKH-CH',
    name: 'Hội Khuyến học Phường Chánh Hiệp',
    shortName: 'Hội Khuyến học Phường',
    slug: 'hoi-khuyen-hoc-phuong-chanh-hiep',
    type: 'ASSOCIATION',
    level: 'WARD',
    parentId: null,
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    leaderName: 'Phạm Văn Hưởng',
    leaderPosition: 'Chủ tịch Hội Khuyến học',
    phone: '0274.3822.118',
    email: 'khuyenhoc.chanhhiep@gmail.com',
    membersCount: 640,
    partyMembersCount: 78,
    displayOrder: 12,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  // 13. Hội Cựu Thanh niên xung phong Phường
  {
    id: 'org-hoi-tnxp',
    code: 'TNXP-CH',
    name: 'Hội Cựu Thanh niên xung phong Phường Chánh Hiệp',
    shortName: 'Hội Cựu TNXP Phường',
    slug: 'hoi-cuu-thanh-nien-xung-phong-phuong-chanh-hiep',
    type: 'ASSOCIATION',
    level: 'WARD',
    parentId: null,
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    leaderName: 'Nguyễn Văn Tài',
    leaderPosition: 'Chủ tịch Hội Cựu TNXP',
    phone: '0274.3822.119',
    email: 'cuutnxp.chanhhiep@gmail.com',
    membersCount: 96,
    partyMembersCount: 28,
    displayOrder: 13,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  // 14. Chi hội Luật gia Phường
  {
    id: 'org-hoi-lg',
    code: 'HLG-CH',
    name: 'Chi hội Luật gia Phường Chánh Hiệp',
    shortName: 'Chi hội Luật gia Phường',
    slug: 'chi-hoi-luat-gia-phuong-chanh-hiep',
    type: 'ASSOCIATION',
    level: 'WARD',
    parentId: null,
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    leaderName: 'ThS. Luật sư Trần Đình Long',
    leaderPosition: 'Chi hội trưởng',
    phone: '0274.3822.120',
    email: 'luatgia.chanhhiep@gmail.com',
    membersCount: 28,
    partyMembersCount: 18,
    displayOrder: 14,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  // 15. Ban Thanh tra Nhân dân
  {
    id: 'org-btt-nd',
    code: 'BTT-ND',
    name: 'Ban Thanh tra Nhân dân Phường Chánh Hiệp',
    shortName: 'Ban Thanh tra Nhân dân',
    slug: 'ban-thanh-tra-nhan-dan',
    type: 'COMMITTEE',
    level: 'WARD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    leaderName: 'Lê Văn Chính',
    leaderPosition: 'Trưởng ban Thanh tra nhân dân',
    phone: '0274.3822.115',
    email: 'thanhtranhandan.chanhhiep@gmail.com',
    description: 'Giám sát việc thực hiện chính sách, pháp luật và quy chế dân chủ cơ sở.',
    membersCount: 11,
    partyMembersCount: 8,
    displayOrder: 15,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  // 16. Ban Giám sát Đầu tư của Cộng đồng
  {
    id: 'org-gs-dtcd',
    code: 'GS-DTCD',
    name: 'Ban Giám sát Đầu tư của Cộng đồng Phường',
    shortName: 'Ban Giám sát ĐT CĐ',
    slug: 'ban-giam-sat-dau-tu-cong-dong',
    type: 'COMMITTEE',
    level: 'WARD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    leaderName: 'Đặng Quốc Hùng',
    leaderPosition: 'Trưởng ban Giám sát ĐTCĐ',
    phone: '0274.3822.114',
    email: 'giamstatdautu.chanhhiep@gmail.com',
    description: 'Giám sát các chương trình, dự án đầu tư công trên địa bàn phường.',
    membersCount: 9,
    partyMembersCount: 6,
    displayOrder: 16,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  }
];

export const INITIAL_MEMBER_ORGANIZATIONS: MemberOrganization[] = [];

export const INITIAL_QUESTION_BANKS: import('../types').QuestionBankCollection[] = [
  {
    id: 'qb-1',
    title: 'Ngân hàng câu hỏi Lịch sử Mặt trận Dân tộc Thống nhất Việt Nam',
    description: 'Tổng hợp 120 câu hỏi trắc nghiệm về truyền thống 96 năm vẻ vang của MTTQ Việt Nam (1930 - 2026).',
    topic: 'Truyền thống MTTQ',
    totalQuestions: 120,
    status: 'ACTIVE',
    createdBy: 'Trần Thị Hoa',
    createdAt: '2026-08-01',
    updatedAt: '2026-08-25'
  },
  {
    id: 'qb-2',
    title: 'Ngân hàng câu hỏi Luật MTTQ Việt Nam & Quy chế Dân chủ cơ sở',
    description: '80 câu hỏi trọng tâm về quyền và nghĩa vụ công dân, công tác giám sát phản biện xã hội theo Luật Thực hiện dân chủ ở cơ sở 2022.',
    topic: 'Pháp luật & Dân chủ',
    totalQuestions: 80,
    status: 'ACTIVE',
    createdBy: 'Trần Văn Nam',
    createdAt: '2026-08-10',
    updatedAt: '2026-08-28'
  }
];

export const INITIAL_SURVEYS: import('../types').PublicSurvey[] = [
  {
    id: 'survey-1',
    slug: 'khao-sat-su-hai-long-dich-vu-cong-2026',
    title: 'Khảo sát sự hài lòng của người dân đối với dịch vụ hành chính công Phường Chánh Hiệp năm 2026',
    description: 'Nhằm nâng cao chất lượng phục vụ và mức độ hài lòng của công dân tại bộ phận Tiếp nhận và Trả kết quả UBND Phường Chánh Hiệp.',
    targetAudience: 'Toàn thể nhân dân trên địa bàn 21 khu phố phường Chánh Hiệp',
    startDate: '2026-08-01',
    endDate: '2026-09-30',
    status: 'OPEN',
    totalResponses: 384,
    createdBy: 'Ban Giám sát MTTQ',
    createdAt: '2026-08-01',
    questions: [
      {
        id: 'sq-1',
        questionText: 'Thái độ phục vụ và tinh thần trách nhiệm của cán bộ, công chức khi tiếp nhận hồ sơ:',
        type: 'RATING',
        required: true
      },
      {
        id: 'sq-2',
        questionText: 'Thời gian giải quyết thủ tục hành chính so với giấy hẹn:',
        type: 'SINGLE',
        options: ['Trước hẹn', 'Đúng hẹn', 'Trễ hẹn có thông báo', 'Trễ hẹn không thông báo'],
        required: true
      },
      {
        id: 'sq-3',
        questionText: 'Đóng góp ý kiến hoặc phản ánh cụ thể để nâng cao chất lượng phục vụ của chính quyền:',
        type: 'TEXT',
        required: false
      }
    ]
  }
];
