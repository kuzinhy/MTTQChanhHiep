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

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'seed-art-1',
    title: 'Phường Chánh Hiệp đẩy mạnh phong trào thi đua "Toàn dân đoàn kết xây dựng đô thị văn minh"',
    slug: 'phuong-chanh-hiep-day-manh-phong-trao-thi-dua',
    summary: 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp phối hợp cùng các ban ngành đoàn thể phát động đợt thi đua cao điểm với nhiều công trình phần việc thiết thực chào mừng đại hội đảng bộ các cấp.',
    content: `Ủy ban MTTQ Việt Nam phường Chánh Hiệp vừa phối hợp với UBND phường và các tổ chức chính trị - xã hội tổ chức lễ phát động phong trào thi đua "Toàn dân đoàn kết xây dựng đô thị văn minh, sáng - xanh - sạch - đẹp - an toàn".

Trong thời gian tới, Ủy ban MTTQ phường sẽ tập trung triển khai các nhiệm vụ trọng tâm:
1. Vận động nhân dân chỉnh trang đô thị, không lấn chiếm lòng đường vỉa hè, giữ gìn vệ sinh môi trường tại các khu phố.
2. Nhân rộng các mô hình tự quản, camera an ninh phòng chống tội phạm tại các khu dân cư.
3. Thực hiện tốt công tác an sinh xã hội, chăm lo gia đình chính sách, hộ nghèo và cận nghèo trên địa bàn phường.

Phong trào đã nhận được sự hưởng ứng nồng nhiệt từ đông đảo bà con nhân dân các khu phố, khẳng định vai trò cốt lõi của khối đại đoàn kết toàn dân tộc tại cơ sở.`,
    category: 'Phong trào thi đua',
    authorName: 'Ban Tuyên giáo MTTQ',
    publishDate: '2026-08-30 08:30',
    featuredImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1200',
    views: 1250,
    tags: ['Đô thị văn minh', 'Thi đua yêu nước', 'Mặt trận Chánh Hiệp'],
    status: 'Published',
    isFeatured: true
  },
  {
    id: 'seed-art-2',
    title: 'Học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh về tinh thần đại đoàn kết',
    slug: 'hoc-tap-va-lam-theo-tu-tuong-dao-duc-ho-chi-minh',
    summary: 'Không gian văn hóa Hồ Chí Minh tại cơ quan Ủy ban MTTQ phường Chánh Hiệp tiếp tục là điểm sinh hoạt chính trị sâu rộng, lan tỏa những giá trị nhân văn sâu sắc.',
    content: `Thực hiện Chỉ thị 05-CT/TW của Bộ Chính trị, Ủy ban MTTQ Việt Nam phường Chánh Hiệp đã xây dựng và đưa vào hoạt động Không gian văn hóa Hồ Chí Minh với nhiều tư liệu quý về cuộc đời, sự nghiệp của Chủ tịch Hồ Chí Minh và lịch sử Mặt trận Dân tộc Thống nhất Việt Nam.

Không gian trưng bày các chuyên đề:
- Tư tưởng Hồ Chí Minh về đại đoàn kết toàn dân tộc.
- Các mô hình "Dân vận khéo" tiêu biểu tại cơ sở.
- Sổ vàng ghi nhận những tấm gương người tốt việc tốt trong phong trào từ thiện nhân đạo.

Đây là nơi sinh hoạt định kỳ của các ban công tác mặt trận khu phố, qua đó bồi dưỡng lý tưởng cách mạng, khơi dậy tinh thần trách nhiệm trong đội ngũ cán bộ Mặt trận và nhân dân.`,
    category: 'Học tập và làm theo Bác',
    authorName: 'Văn phòng MTTQ',
    publishDate: '2026-08-28 14:15',
    featuredImage: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?auto=format&fit=crop&q=80&w=1200',
    views: 980,
    tags: ['Học tập làm theo Bác', 'Đại đoàn kết', 'Văn hóa'],
    status: 'Published',
    isFeatured: false
  },
  {
    id: 'seed-art-3',
    title: 'Ủy ban MTTQ phường thăm hỏi và trao nhà Đại đoàn kết cho hộ gia đình khó khăn',
    slug: 'trao-nha-dai-doan-ket-cho-ho-kho-khan',
    summary: 'Hoạt động thiết thực chăm lo nhà ở cho người nghèo, giúp các hộ gia đình an cư lạc nghiệp, vươn lên ổn định cuộc sống.',
    content: `Sáng ngày 26/08, Ủy ban MTTQ Việt Nam phường Chánh Hiệp đã tổ chức lễ bàn giao nhà "Đại đoàn kết" cho gia đình có hoàn cảnh đặc biệt khó khăn về nhà ở trên địa bàn khu phố.

Đại diện Thường trực MTTQ phường chúc mừng gia đình và trao tặng những phần quà thiết thực phục vụ sinh hoạt. Căn nhà được xây dựng kiên cố với tổng kinh phí hỗ trợ từ quỹ "Vì người nghèo" và sự đóng góp của các mạnh thường quân, thể hiện tinh thần "tương thân tương ái", "không để ai bỏ lại phía sau" của cộng đồng.`,
    category: 'An sinh xã hội',
    authorName: 'Ban Phong trào',
    publishDate: '2026-08-26 10:00',
    featuredImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
    views: 1420,
    tags: ['An sinh xã hội', 'Nhà Đại đoàn kết', 'Vì người nghèo'],
    status: 'Published',
    isFeatured: true
  },
  {
    id: 'seed-art-4',
    title: 'Công tác giám sát và phản biện xã hội của Mặt trận Tổ quốc tại cơ sở năm 2026',
    slug: 'cong-tac-giam-sat-va-phan-bien-xa-hoi',
    summary: 'Phát huy quyền làm chủ của nhân dân thông qua các hoạt động giám sát đầu tư cộng hòa, giải quyết khiếu nại tố cáo và góp ý xây dựng chính quyền.',
    content: `Trong 8 tháng đầu năm 2026, Ủy ban MTTQ Việt Nam phường Chánh Hiệp đã chủ trì và phối hợp triển khai nhiều nội dung giám sát quan trọng:
- Giám sát việc thực hiện các chính sách an sinh xã hội, hỗ trợ người lao động và đối tượng chính sách.
- Giám sát công tác tiếp công dân và giải quyết thủ tục hành chính tại bộ phận một cửa UBND phường.
- Tổ chức các hội nghị phản biện xã hội đối với các đồ án quy hoạch chỉnh trang đô thị và dự án đầu tư công trình phúc lợi trên địa bàn.

Các kiến nghị sau giám sát đều được chính quyền địa phương tiếp thu và chỉ đạo giải quyết kịp thời, củng cố niềm tin vững chắc của nhân dân đối với Đảng và chính quyền.`,
    category: 'Giám sát - Phản biện',
    authorName: 'Ban Dân chủ - Pháp luật',
    publishDate: '2026-08-22 09:00',
    featuredImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1200',
    views: 890,
    tags: ['Giám sát phản biện', 'Dân chủ cơ sở', 'Xây dựng chính quyền'],
    status: 'Published',
    isFeatured: false
  }
];

export const INITIAL_DOCUMENTS: OfficialDocument[] = [
  {
    id: 'seed-doc-qd-207',
    codeNumber: '207/QĐ-MTTW-BTT',
    title: 'Quyết định Ban hành Quy định về thể loại, thẩm quyền ban hành, thể thức và kỹ thuật trình bày văn bản của Ủy ban Mặt trận Tổ quốc Việt Nam các cấp',
    docType: 'Quyết định',
    issuer: 'Ban Thường trực Ủy ban Trung ương MTTQ Việt Nam',
    issueDate: '2025-08-29',
    effectiveDate: '2025-08-29',
    signer: 'Phó Chủ tịch - Tổng Thư ký Nguyễn Thị Thu Hà',
    field: 'Thể thức văn bản Mặt trận',
    summary: 'Quyết định số 207/QĐ-MTTW-BTT ban hành Quy định chuẩn hóa về 25 thể loại văn bản chính, 5 thể loại văn bản hành chính khác, thẩm quyền ban hành của 4 cấp Mặt trận (Trung ương, Cấp tỉnh, Cấp xã, Ban Công tác Mặt trận khu dân cư) và quy định chi tiết kỹ thuật trình bày văn bản chuẩn hóa toàn hệ thống.',
    fileUrl: 'https://drive.google.com/file/d/1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G/view?usp=sharing',
    driveUrl: 'https://drive.google.com/file/d/1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G/view?usp=sharing',
    fileName: '207_QD-MTTW-BTT_TheThucVanBanMTTQ.pdf',
    fileSize: '3.2 MB',
    isPublic: true
  },
  {
    id: 'seed-doc-1',
    codeNumber: '08/KH-MTTQ',
    title: 'Kế hoạch tổ chức các hoạt động tuyên truyền và triển khai nhiệm vụ trọng tâm công tác Mặt trận năm 2026',
    docType: 'Kế hoạch',
    issuer: 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
    issueDate: '2026-01-15',
    effectiveDate: '2026-01-20',
    signer: 'Chủ tịch Nguyễn Văn An',
    field: 'Công tác Mặt trận',
    summary: 'Kế hoạch tổng thể định hướng các hoạt động tuyên truyền, vận động nhân dân và phong trào thi đua yêu nước năm 2026 của Ủy ban MTTQ phường Chánh Hiệp.',
    fileUrl: 'https://drive.google.com/file/d/1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G/view?usp=sharing',
    driveUrl: 'https://drive.google.com/file/d/1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G/view?usp=sharing',
    fileName: '08_KH-MTTQ_KeHoachCongTac2026.pdf',
    fileSize: '1.4 MB',
    isPublic: true
  },
  {
    id: 'seed-doc-2',
    codeNumber: '15/QĐ-MTTQ',
    title: 'Quyết định ban hành Quy chế hoạt động của Ban Thanh tra nhân dân phường Chánh Hiệp nhiệm kỳ 2024 - 2026',
    docType: 'Quyết định',
    issuer: 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
    issueDate: '2026-03-10',
    effectiveDate: '2026-03-15',
    signer: 'Phó Chủ tịch Trần Thị Mai',
    field: 'Thanh tra nhân dân',
    summary: 'Quy định chức năng, nhiệm vụ, quyền hạn và chế độ làm việc của Ban Thanh tra nhân dân phường trong công tác giám sát đầu tư công và thực thi pháp luật.',
    fileUrl: 'https://drive.google.com/file/d/1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G/view?usp=sharing',
    driveUrl: 'https://drive.google.com/file/d/1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G/view?usp=sharing',
    fileName: '15_QD-MTTQ_QuyCheThanhTraNhanDan.pdf',
    fileSize: '1.8 MB',
    isPublic: true
  },
  {
    id: 'seed-doc-3',
    codeNumber: '42/HD-MTTQ',
    title: 'Hướng dẫn quy trình lấy ý kiến sự hài lòng của người dân đối với kết quả xây dựng đô thị văn minh',
    docType: 'Hướng dẫn',
    issuer: 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
    issueDate: '2026-05-20',
    effectiveDate: '2026-05-25',
    signer: 'Chủ tịch Nguyễn Văn An',
    field: 'Đô thị văn minh',
    summary: 'Hướng dẫn chi tiết các bước triển khai phiếu lấy ý kiến đánh giá của hộ gia đình đối với các tiêu chí xây dựng đô thị văn minh trên địa bàn các khu phố.',
    fileUrl: 'https://drive.google.com/file/d/1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G/view?usp=sharing',
    driveUrl: 'https://drive.google.com/file/d/1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G/view?usp=sharing',
    fileName: '42_HD-MTTQ_HuongDanLayYKIenHaiLong.pdf',
    fileSize: '2.1 MB',
    isPublic: true
  },
  {
    id: 'seed-doc-4',
    codeNumber: '109/TB-UBND',
    title: 'Thông báo lịch tiếp công dân định kỳ của Thường trực HĐND - UBND - Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
    docType: 'Thông báo',
    issuer: 'UBND - Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
    issueDate: '2026-08-01',
    effectiveDate: '2026-08-01',
    signer: 'Văn phòng HĐND-UBND-MTTQ',
    field: 'Tiếp công dân',
    summary: 'Lịch tiếp dân hàng tuần và hàng tháng để lắng nghe, tiếp nhận các ý kiến phản ánh, kiến nghị chính đáng của nhân dân.',
    fileUrl: 'https://drive.google.com/file/d/1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G/view?usp=sharing',
    driveUrl: 'https://drive.google.com/file/d/1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G/view?usp=sharing',
    fileName: '109_TB-UBND_TiepCongDanDinhKy.pdf',
    fileSize: '950 KB',
    isPublic: true
  }
];

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
    neighborhood: 'Khu phố 3',
    fullname: 'Nguyễn Thanh Tùng',
    phone: '0908123456',
    email: 'tung.nguyen@gmail.com',
    isAnonymous: false,
    status: 'PROCESSING',
    priority: 'HIGH',
    assignedTo: 'Lê Văn Bình (Phó Chủ tịch)',
    adminResponse: 'Ban Thường trực MTTQ phường đã tiếp nhận và chuyển phản ánh đến UBND phường cùng Ban CTMT Khu phố 3 tổ chức ra quân dọn dẹp trong cuối tuần này.',
    createdAt: '2026-08-28 09:30',
    tags: ['Rác thải', 'Đô thị văn minh', 'Trường học']
  },
  {
    id: 'op-2',
    receiptCode: 'PA-2026-0802',
    topic: 'An sinh xã hội',
    content: 'Gia đình bà Lê Thị Bích ở hẻm 45 Khu phố 7 thuộc diện người già đơn thân, căn nhà bị dột nặng sau các trận mưa vừa qua. Đề nghị xem xét hỗ trợ kinh phí sửa chữa Nhà Đại đoàn kết.',
    neighborhood: 'Khu phố 7',
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
    neighborhood: 'Khu phố 5',
    fullname: 'Phạm Minh Hoàng',
    phone: '0912345678',
    isAnonymous: false,
    status: 'RESOLVED',
    priority: 'NORMAL',
    assignedTo: 'Ban CTMT Khu phố 5',
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
    location: 'Hội trường Văn hóa Khu phố 4',
    chair: 'Thường trực HĐND - MTTQ phường',
    participants: 'Đại biểu HĐND phường, Nhân dân Khu phố 3, 4, 5',
    content: 'Lắng nghe ý kiến và kiến nghị nhân dân liên quan đến quy hoạch và thoát nước.',
    category: 'Tiếp xúc cử tri'
  }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    userId: 'user-admin',
    title: 'Chuẩn bị nội dung làm việc với Ban CTMT Khu phố 12',
    content: `- Kiểm tra tiến độ vận động Quỹ "Vì người nghèo" tại khu phố.
- Nhắc nhở khu phố đẩy mạnh tuyên truyền Cuộc thi trắc nghiệm trực tuyến.
- Ghi nhận ý kiến về đợt phát quà trung thu cho trẻ em em nghèo.`,
    color: '#fef3c7',
    isPinned: true,
    tags: ['Khu phố 12', 'Công tác', 'Nhắc việc'],
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
    description: 'Khung chuẩn kế hoạch ban hành bởi Ban Thường trực MTTQ phường Chánh Hiệp',
    content: `ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP
BAN THƯỜNG TRỰC
Số:   /KH-MTTQ-CH

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
Chánh Hiệp, ngày   tháng   năm 2026

KẾ HOẠCH
Về việc [TÊN HOẠT ĐỘNG / PHONG TRÀO]

I. MỤC ĐÍCH, YÊU CẦU
1. Mục đích:
2. Yêu cầu:

II. NỘI DUNG VÀ HÌNH THỨC THỰC HIỆN
1. Nội dung:
2. Hình thức:

III. THỜI GIAN VÀ ĐỊA ĐIỂM
1. Thời gian:
2. Địa điểm:

IV. TỔ CHỨC THỰC HIỆN
1. Ban Thường trực MTTQ phường:
2. Các tổ chức thành viên:
3. Ban công tác Mặt trận các khu phố:

TM. BAN THƯỜNG TRỰC
CHỦ TỊCH`
  },
  {
    id: 'tpl-2',
    title: 'Mẫu Báo cáo Kết quả công tác Mặt trận tháng / quý',
    category: 'Báo cáo',
    description: 'Mẫu báo cáo định kỳ đầy đủ các mảng công tác chính',
    content: `ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP
BAN THƯỜNG TRỰC
Số:   /BC-MTTQ-CH

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc

BÁO CÁO
Kết quả công tác Mặt trận [THÁNG/QUÝ] năm 2026
Phương hướng nhiệm vụ trọng tâm thời gian tới

I. KẾT QUẢ ĐẠT ĐƯỢC
1. Công tác tuyên truyền, vận động, tập hợp các tầng lớp nhân dân
2. Thực hiện các cuộc vận động, các phong trào thi đua yêu nước
3. Công tác giám sát, phản biện xã hội, tham gia xây dựng Đảng, chính quyền
4. Củng cố tổ chức, nâng cao năng lực hoạt động của hệ thống Mặt trận

II. ĐÁNH GIÁ CHUNG, TỒN TẠI VÀ NGUYÊN NHÂN
1. Ưu điểm:
2. Hạn chế, tồn tại:

III. NHIỆM VỤ TRỌNG TÂM THỜI GIAN TỚI`
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
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
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
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
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
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
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
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
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
    name: 'Khu phố 1',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 1,
    description: 'Địa bàn Khu phố 1 (Tương Bình Hiệp 1), phường Chánh Hiệp',
    population: 3120,
    householdsCount: 780,
    leaderName: 'Trần Thị Tố Như',
    leaderPhone: '0933742769',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-2',
    code: 'KP-02',
    name: 'Khu phố 2',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 2,
    description: 'Địa bàn Khu phố 2 (Tương Bình Hiệp 2), phường Chánh Hiệp',
    population: 2950,
    householdsCount: 720,
    leaderName: 'Nguyễn Thanh Sơn',
    leaderPhone: '0336749484',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-3',
    code: 'KP-03',
    name: 'Khu phố 3',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 3,
    description: 'Địa bàn Khu phố 3 (Tương Bình Hiệp 3), phường Chánh Hiệp',
    population: 3400,
    householdsCount: 840,
    leaderName: 'Nguyễn Việt Toàn',
    leaderPhone: '0919908008',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-4',
    code: 'KP-04',
    name: 'Khu phố 4',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 4,
    description: 'Địa bàn Khu phố 4 (Tương Bình Hiệp 4), phường Chánh Hiệp',
    population: 2800,
    householdsCount: 690,
    leaderName: 'Lê Duy Khang',
    leaderPhone: '0358934767',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-5',
    code: 'KP-05',
    name: 'Khu phố 5',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 5,
    description: 'Địa bàn Khu phố 5 (Tương Bình Hiệp 5), phường Chánh Hiệp',
    population: 3600,
    householdsCount: 890,
    leaderName: 'Phạm Thị Tố Mai',
    leaderPhone: '0908739555',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-6',
    code: 'KP-06',
    name: 'Khu phố 6',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 6,
    description: 'Địa bàn Khu phố 6 (Tương Bình Hiệp 6), phường Chánh Hiệp',
    population: 3200,
    householdsCount: 760,
    leaderName: 'Trần Quốc Nghĩa',
    leaderPhone: '0915337788',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-7',
    code: 'KP-07',
    name: 'Khu phố 7',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 7,
    description: 'Địa bàn Khu phố 7 (Tương Bình Hiệp 7), phường Chánh Hiệp',
    population: 3050,
    householdsCount: 750,
    leaderName: 'Lê Văn Chí',
    leaderPhone: '0914919646',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-8',
    code: 'KP-08',
    name: 'Khu phố 8',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 8,
    description: 'Địa bàn Khu phố 8 (Hiệp An 7), phường Chánh Hiệp',
    population: 3300,
    householdsCount: 810,
    leaderName: 'Nguyễn Thành Châu',
    leaderPhone: '0965052061',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-9',
    code: 'KP-09',
    name: 'Khu phố 9',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 9,
    description: 'Địa bàn Khu phố 9 (Hiệp An 8), phường Chánh Hiệp',
    population: 3150,
    householdsCount: 770,
    leaderName: 'Võ Hoàng Phương',
    leaderPhone: '0918231463',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-10',
    code: 'KP-10',
    name: 'Khu phố 10',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 10,
    description: 'Địa bàn Khu phố 10 (Hiệp An 9), phường Chánh Hiệp',
    population: 2900,
    householdsCount: 710,
    leaderName: 'Lê Phước Hùng',
    leaderPhone: '0828643979',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-11',
    code: 'KP-11',
    name: 'Khu phố 11',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 11,
    description: 'Địa bàn Khu phố 11 (Định Hòa 1), phường Chánh Hiệp',
    population: 3350,
    householdsCount: 820,
    leaderName: 'Phan Hà Như Thủy',
    leaderPhone: '0987933156',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-12',
    code: 'KP-12',
    name: 'Khu phố 12',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 12,
    description: 'Địa bàn Khu phố 12 (Định Hòa 2), phường Chánh Hiệp',
    population: 3420,
    householdsCount: 835,
    leaderName: 'Trần Văn Hoàng',
    leaderPhone: '0918598078',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-13',
    code: 'KP-13',
    name: 'Khu phố 13',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 13,
    description: 'Địa bàn Khu phố 13 (Định Hòa 3), phường Chánh Hiệp',
    population: 3210,
    householdsCount: 785,
    leaderName: 'Nguyễn Văn Gu',
    leaderPhone: '0785185879',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-14',
    code: 'KP-14',
    name: 'Khu phố 14',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 14,
    description: 'Địa bàn Khu phố 14 (Định Hòa 4), phường Chánh Hiệp',
    population: 3180,
    householdsCount: 775,
    leaderName: 'Ngô Quốc Phong',
    leaderPhone: '0938377151',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-15',
    code: 'KP-15',
    name: 'Khu phố 15',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 15,
    description: 'Địa bàn Khu phố 15 (Định Hòa 5), phường Chánh Hiệp',
    population: 2980,
    householdsCount: 730,
    leaderName: 'Phạm Văn Chí',
    leaderPhone: '0938565172',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-16',
    code: 'KP-16',
    name: 'Khu phố 16',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 16,
    description: 'Địa bàn Khu phố 16 (Định Hòa 6), phường Chánh Hiệp',
    population: 3500,
    householdsCount: 860,
    leaderName: 'Lê Văn Hoài',
    leaderPhone: '0919042548',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-17',
    code: 'KP-17',
    name: 'Khu phố 17',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 17,
    description: 'Địa bàn Khu phố 17 (Định Hòa 7), phường Chánh Hiệp',
    population: 2890,
    householdsCount: 710,
    leaderName: 'Nguyễn Văn Gấm',
    leaderPhone: '0985996979',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-18',
    code: 'KP-18',
    name: 'Khu phố 18',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 18,
    description: 'Địa bàn Khu phố 18 (Định Hòa 8), phường Chánh Hiệp',
    population: 3260,
    householdsCount: 800,
    leaderName: 'Trần Quốc Dương',
    leaderPhone: '0886848586',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-19',
    code: 'KP-19',
    name: 'Khu phố 19',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 19,
    description: 'Địa bàn Khu phố 19 (Mỹ Hảo), phường Chánh Hiệp',
    population: 3340,
    householdsCount: 815,
    leaderName: 'Ngô Quốc Trung',
    leaderPhone: '0901689828',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-20',
    code: 'KP-20',
    name: 'Khu phố 20',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 20,
    description: 'Địa bàn Khu phố 20 (Chánh Mỹ 1), phường Chánh Hiệp',
    population: 3450,
    householdsCount: 845,
    leaderName: 'Đào Thanh Trung',
    leaderPhone: '0919450576',
    createdAt: '2026-01-01'
  },
  {
    id: 'area-kp-21',
    code: 'KP-21',
    name: 'Khu phố 21',
    type: 'NEIGHBORHOOD',
    parentId: 'area-chanh-hiep',
    order: 21,
    description: 'Địa bàn Khu phố 21 (Chánh Mỹ 2), phường Chánh Hiệp',
    population: 3600,
    householdsCount: 880,
    leaderName: 'Nguyễn Minh Triết',
    leaderPhone: '0907008308',
    createdAt: '2026-01-01'
  }
];

export const INITIAL_ORGANIZATIONS: Organization[] = [
  // Cấp Phường: Đảng bộ, Chính quyền, MTTQ
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
    leaderName: 'Trần Thị Hoa',
    leaderPosition: 'Chủ tịch Ủy ban MTTQ',
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
    address: 'Đường Nguyễn Văn Tiết, Khu phố 2, Phường Chánh Hiệp',
    description: 'Cơ quan chấp hành của HĐND, cơ quan hành chính nhà nước ở địa phương.',
    membersCount: 36,
    partyMembersCount: 32,
    displayOrder: 3,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  // Các Ban trực thuộc Ủy ban MTTQ Phường (Hierarchical Children of org-mttq-phuong)
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
    displayOrder: 4,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
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
    displayOrder: 5,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  // 21 Ban Công tác Mặt trận Khu phố (Trực thuộc MTTQ Phường, gắn với 21 Khu phố Area)
  {
    id: 'org-bctmt-kp1',
    code: 'BCTMT-KP01',
    name: 'Ban Công tác Mặt trận Khu phố 1',
    shortName: 'BCTMT Khu phố 1',
    slug: 'ban-cong-tac-mat-tran-khu-pho-1',
    type: 'FATHERLAND_FRONT',
    level: 'NEIGHBORHOOD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-kp-1',
    areaName: 'Khu phố 1',
    leaderName: 'Phan Thanh Phong',
    leaderPosition: 'Trưởng ban CTMT',
    phone: '0944029851',
    email: 'bctmt.kp1.chanhhiep@gmail.com',
    description: 'Tổ chức phối hợp hành động của MTTQ tại địa bàn Khu phố 1 (Tương Bình Hiệp 1).',
    membersCount: 7,
    partyMembersCount: 5,
    displayOrder: 10,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-bctmt-kp2',
    code: 'BCTMT-KP02',
    name: 'Ban Công tác Mặt trận Khu phố 2',
    shortName: 'BCTMT Khu phố 2',
    slug: 'ban-cong-tac-mat-tran-khu-pho-2',
    type: 'FATHERLAND_FRONT',
    level: 'NEIGHBORHOOD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-kp-2',
    areaName: 'Khu phố 2',
    leaderName: 'Lê Minh Trí',
    leaderPosition: 'Trưởng ban CTMT',
    phone: '0933410441',
    email: 'bctmt.kp2.chanhhiep@gmail.com',
    description: 'Tổ chức phối hợp hành động của MTTQ tại địa bàn Khu phố 2 (Tương Bình Hiệp 2).',
    membersCount: 8,
    partyMembersCount: 6,
    displayOrder: 11,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-bctmt-kp3',
    code: 'BCTMT-KP03',
    name: 'Ban Công tác Mặt trận Khu phố 3',
    shortName: 'BCTMT Khu phố 3',
    slug: 'ban-cong-tac-mat-tran-khu-pho-3',
    type: 'FATHERLAND_FRONT',
    level: 'NEIGHBORHOOD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-kp-3',
    areaName: 'Khu phố 3',
    leaderName: 'Lê Trần Quốc Thái',
    leaderPosition: 'Trưởng ban CTMT',
    phone: '0363763231',
    email: 'bctmt.kp3.chanhhiep@gmail.com',
    description: 'Tổ chức phối hợp hành động của MTTQ tại địa bàn Khu phố 3 (Tương Bình Hiệp 3).',
    membersCount: 7,
    partyMembersCount: 4,
    displayOrder: 12,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-bctmt-kp4',
    code: 'BCTMT-KP04',
    name: 'Ban Công tác Mặt trận Khu phố 4',
    shortName: 'BCTMT Khu phố 4',
    slug: 'ban-cong-tac-mat-tran-khu-pho-4',
    type: 'FATHERLAND_FRONT',
    level: 'NEIGHBORHOOD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-kp-4',
    areaName: 'Khu phố 4',
    leaderName: 'Trần Văn An',
    leaderPosition: 'Trưởng ban CTMT',
    phone: '0948667996',
    email: 'bctmt.kp4.chanhhiep@gmail.com',
    description: 'Tổ chức phối hợp hành động của MTTQ tại địa bàn Khu phố 4 (Tương Bình Hiệp 4).',
    membersCount: 7,
    partyMembersCount: 5,
    displayOrder: 13,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-bctmt-kp5',
    code: 'BCTMT-KP05',
    name: 'Ban Công tác Mặt trận Khu phố 5',
    shortName: 'BCTMT Khu phố 5',
    slug: 'ban-cong-tac-mat-tran-khu-pho-5',
    type: 'FATHERLAND_FRONT',
    level: 'NEIGHBORHOOD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-kp-5',
    areaName: 'Khu phố 5',
    leaderName: 'Tiết Tuấn',
    leaderPosition: 'Trưởng ban CTMT',
    phone: '0987720790',
    email: 'bctmt.kp5.chanhhiep@gmail.com',
    description: 'Tổ chức phối hợp hành động của MTTQ tại địa bàn Khu phố 5 (Tương Bình Hiệp 5).',
    membersCount: 8,
    partyMembersCount: 5,
    displayOrder: 14,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-bctmt-kp6',
    code: 'BCTMT-KP06',
    name: 'Ban Công tác Mặt trận Khu phố 6',
    shortName: 'BCTMT Khu phố 6',
    slug: 'ban-cong-tac-mat-tran-khu-pho-6',
    type: 'FATHERLAND_FRONT',
    level: 'NEIGHBORHOOD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-kp-6',
    areaName: 'Khu phố 6',
    leaderName: 'Nguyễn Thị Ánh Tuyết',
    leaderPosition: 'Trưởng ban CTMT',
    phone: '0706055248',
    email: 'bctmt.kp6.chanhhiep@gmail.com',
    description: 'Tổ chức phối hợp hành động của MTTQ tại địa bàn Khu phố 6 (Tương Bình Hiệp 6).',
    membersCount: 7,
    partyMembersCount: 4,
    displayOrder: 15,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-bctmt-kp7',
    code: 'BCTMT-KP07',
    name: 'Ban Công tác Mặt trận Khu phố 7',
    shortName: 'BCTMT Khu phố 7',
    slug: 'ban-cong-tac-mat-tran-khu-pho-7',
    type: 'FATHERLAND_FRONT',
    level: 'NEIGHBORHOOD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-kp-7',
    areaName: 'Khu phố 7',
    leaderName: 'Võ Ngọc Giàu',
    leaderPosition: 'Trưởng ban CTMT',
    phone: '0888503448',
    email: 'bctmt.kp7.chanhhiep@gmail.com',
    description: 'Tổ chức phối hợp hành động của MTTQ tại địa bàn Khu phố 7 (Tương Bình Hiệp 7).',
    membersCount: 8,
    partyMembersCount: 5,
    displayOrder: 16,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-bctmt-kp8',
    code: 'BCTMT-KP08',
    name: 'Ban Công tác Mặt trận Khu phố 8',
    shortName: 'BCTMT Khu phố 8',
    slug: 'ban-cong-tac-mat-tran-khu-pho-8',
    type: 'FATHERLAND_FRONT',
    level: 'NEIGHBORHOOD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-kp-8',
    areaName: 'Khu phố 8',
    leaderName: 'Dương Văn Thọ',
    leaderPosition: 'Trưởng ban CTMT',
    phone: '0976534508',
    email: 'bctmt.kp8.chanhhiep@gmail.com',
    description: 'Tổ chức phối hợp hành động của MTTQ tại địa bàn Khu phố 8 (Hiệp An 7).',
    membersCount: 7,
    partyMembersCount: 4,
    displayOrder: 17,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-bctmt-kp9',
    code: 'BCTMT-KP09',
    name: 'Ban Công tác Mặt trận Khu phố 9',
    shortName: 'BCTMT Khu phố 9',
    slug: 'ban-cong-tac-mat-tran-khu-pho-9',
    type: 'FATHERLAND_FRONT',
    level: 'NEIGHBORHOOD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-kp-9',
    areaName: 'Khu phố 9',
    leaderName: 'Đinh Xuân Phúc',
    leaderPosition: 'Trưởng ban CTMT',
    phone: '0928579957',
    email: 'bctmt.kp9.chanhhiep@gmail.com',
    description: 'Tổ chức phối hợp hành động của MTTQ tại địa bàn Khu phố 9 (Hiệp An 8).',
    membersCount: 8,
    partyMembersCount: 5,
    displayOrder: 18,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-bctmt-kp10',
    code: 'BCTMT-KP10',
    name: 'Ban Công tác Mặt trận Khu phố 10',
    shortName: 'BCTMT Khu phố 10',
    slug: 'ban-cong-tac-mat-tran-khu-pho-10',
    type: 'FATHERLAND_FRONT',
    level: 'NEIGHBORHOOD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-kp-10',
    areaName: 'Khu phố 10',
    leaderName: 'Trần Văn Lợi',
    leaderPosition: 'Trưởng ban CTMT',
    phone: '0908758565',
    email: 'bctmt.kp10.chanhhiep@gmail.com',
    description: 'Tổ chức phối hợp hành động của MTTQ tại địa bàn Khu phố 10 (Hiệp An 9).',
    membersCount: 7,
    partyMembersCount: 5,
    displayOrder: 19,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-bctmt-kp11',
    code: 'BCTMT-KP11',
    name: 'Ban Công tác Mặt trận Khu phố 11',
    shortName: 'BCTMT Khu phố 11',
    slug: 'ban-cong-tac-mat-tran-khu-pho-11',
    type: 'FATHERLAND_FRONT',
    level: 'NEIGHBORHOOD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-kp-11',
    areaName: 'Khu phố 11',
    leaderName: 'Hoàng Thị Xuân Lành',
    leaderPosition: 'Trưởng ban CTMT',
    phone: '0977137382',
    email: 'bctmt.kp11.chanhhiep@gmail.com',
    description: 'Tổ chức phối hợp hành động của MTTQ tại địa bàn Khu phố 11 (Định Hòa 1).',
    membersCount: 7,
    partyMembersCount: 4,
    displayOrder: 20,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-bctmt-kp12',
    code: 'BCTMT-KP12',
    name: 'Ban Công tác Mặt trận Khu phố 12',
    shortName: 'BCTMT Khu phố 12',
    slug: 'ban-cong-tac-mat-tran-khu-pho-12',
    type: 'FATHERLAND_FRONT',
    level: 'NEIGHBORHOOD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-kp-12',
    areaName: 'Khu phố 12',
    leaderName: 'Nguyễn Thanh Phương',
    leaderPosition: 'Trưởng ban CTMT',
    phone: '0961880602',
    email: 'bctmt.kp12.chanhhiep@gmail.com',
    description: 'Tổ chức phối hợp hành động của MTTQ tại địa bàn Khu phố 12 (Định Hòa 2).',
    membersCount: 7,
    partyMembersCount: 4,
    displayOrder: 21,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-bctmt-kp13',
    code: 'BCTMT-KP13',
    name: 'Ban Công tác Mặt trận Khu phố 13',
    shortName: 'BCTMT Khu phố 13',
    slug: 'ban-cong-tac-mat-tran-khu-pho-13',
    type: 'FATHERLAND_FRONT',
    level: 'NEIGHBORHOOD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-kp-13',
    areaName: 'Khu phố 13',
    leaderName: 'Vương Thị Tuyết Mai',
    leaderPosition: 'Trưởng ban CTMT',
    phone: '0902477692',
    email: 'bctmt.kp13.chanhhiep@gmail.com',
    description: 'Tổ chức phối hợp hành động của MTTQ tại địa bàn Khu phố 13 (Định Hòa 3).',
    membersCount: 7,
    partyMembersCount: 5,
    displayOrder: 22,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-bctmt-kp14',
    code: 'BCTMT-KP14',
    name: 'Ban Công tác Mặt trận Khu phố 14',
    shortName: 'BCTMT Khu phố 14',
    slug: 'ban-cong-tac-mat-tran-khu-pho-14',
    type: 'FATHERLAND_FRONT',
    level: 'NEIGHBORHOOD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-kp-14',
    areaName: 'Khu phố 14',
    leaderName: 'Nguyễn Thị Ngọc Hà',
    leaderPosition: 'Trưởng ban CTMT',
    phone: '0988222362',
    email: 'bctmt.kp14.chanhhiep@gmail.com',
    description: 'Tổ chức phối hợp hành động của MTTQ tại địa bàn Khu phố 14 (Định Hòa 4).',
    membersCount: 8,
    partyMembersCount: 6,
    displayOrder: 23,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-bctmt-kp15',
    code: 'BCTMT-KP15',
    name: 'Ban Công tác Mặt trận Khu phố 15',
    shortName: 'BCTMT Khu phố 15',
    slug: 'ban-cong-tac-mat-tran-khu-pho-15',
    type: 'FATHERLAND_FRONT',
    level: 'NEIGHBORHOOD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-kp-15',
    areaName: 'Khu phố 15',
    leaderName: 'Nguyễn Thị Ích',
    leaderPosition: 'Trưởng ban CTMT',
    phone: '0786752934',
    email: 'bctmt.kp15.chanhhiep@gmail.com',
    description: 'Tổ chức phối hợp hành động của MTTQ tại địa bàn Khu phố 15 (Định Hòa 5).',
    membersCount: 7,
    partyMembersCount: 4,
    displayOrder: 24,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-bctmt-kp16',
    code: 'BCTMT-KP16',
    name: 'Ban Công tác Mặt trận Khu phố 16',
    shortName: 'BCTMT Khu phố 16',
    slug: 'ban-cong-tac-mat-tran-khu-pho-16',
    type: 'FATHERLAND_FRONT',
    level: 'NEIGHBORHOOD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-kp-16',
    areaName: 'Khu phố 16',
    leaderName: 'Đặng Thị Huyền Trang',
    leaderPosition: 'Trưởng ban CTMT',
    phone: '0943477286',
    email: 'bctmt.kp16.chanhhiep@gmail.com',
    description: 'Tổ chức phối hợp hành động của MTTQ tại địa bàn Khu phố 16 (Định Hòa 6).',
    membersCount: 8,
    partyMembersCount: 5,
    displayOrder: 25,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-bctmt-kp17',
    code: 'BCTMT-KP17',
    name: 'Ban Công tác Mặt trận Khu phố 17',
    shortName: 'BCTMT Khu phố 17',
    slug: 'ban-cong-tac-mat-tran-khu-pho-17',
    type: 'FATHERLAND_FRONT',
    level: 'NEIGHBORHOOD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-kp-17',
    areaName: 'Khu phố 17',
    leaderName: 'Lê Thị Bình',
    leaderPosition: 'Trưởng ban CTMT',
    phone: '0983688364',
    email: 'bctmt.kp17.chanhhiep@gmail.com',
    description: 'Tổ chức phối hợp hành động của MTTQ tại địa bàn Khu phố 17 (Định Hòa 7).',
    membersCount: 7,
    partyMembersCount: 4,
    displayOrder: 26,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-bctmt-kp18',
    code: 'BCTMT-KP18',
    name: 'Ban Công tác Mặt trận Khu phố 18',
    shortName: 'BCTMT Khu phố 18',
    slug: 'ban-cong-tac-mat-tran-khu-pho-18',
    type: 'FATHERLAND_FRONT',
    level: 'NEIGHBORHOOD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-kp-18',
    areaName: 'Khu phố 18',
    leaderName: 'Phan Văn Hòa',
    leaderPosition: 'Trưởng ban CTMT',
    phone: '0928979677',
    email: 'bctmt.kp18.chanhhiep@gmail.com',
    description: 'Tổ chức phối hợp hành động của MTTQ tại địa bàn Khu phố 18 (Định Hòa 8).',
    membersCount: 8,
    partyMembersCount: 5,
    displayOrder: 27,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-bctmt-kp19',
    code: 'BCTMT-KP19',
    name: 'Ban Công tác Mặt trận Khu phố 19',
    shortName: 'BCTMT Khu phố 19',
    slug: 'ban-cong-tac-mat-tran-khu-pho-19',
    type: 'FATHERLAND_FRONT',
    level: 'NEIGHBORHOOD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-kp-19',
    areaName: 'Khu phố 19',
    leaderName: 'Nguyễn Cường',
    leaderPosition: 'Trưởng ban CTMT',
    phone: '0989114005',
    email: 'bctmt.kp19.chanhhiep@gmail.com',
    description: 'Tổ chức phối hợp hành động của MTTQ tại địa bàn Khu phố 19 (Mỹ Hảo).',
    membersCount: 7,
    partyMembersCount: 4,
    displayOrder: 28,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-bctmt-kp20',
    code: 'BCTMT-KP20',
    name: 'Ban Công tác Mặt trận Khu phố 20',
    shortName: 'BCTMT Khu phố 20',
    slug: 'ban-cong-tac-mat-tran-khu-pho-20',
    type: 'FATHERLAND_FRONT',
    level: 'NEIGHBORHOOD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-kp-20',
    areaName: 'Khu phố 20',
    leaderName: 'Nguyễn Thị Mỹ Linh',
    leaderPosition: 'Trưởng ban CTMT',
    phone: '0843413153',
    email: 'bctmt.kp20.chanhhiep@gmail.com',
    description: 'Tổ chức phối hợp hành động của MTTQ tại địa bàn Khu phố 20 (Chánh Mỹ 1).',
    membersCount: 8,
    partyMembersCount: 5,
    displayOrder: 29,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-bctmt-kp21',
    code: 'BCTMT-KP21',
    name: 'Ban Công tác Mặt trận Khu phố 21',
    shortName: 'BCTMT Khu phố 21',
    slug: 'ban-cong-tac-mat-tran-khu-pho-21',
    type: 'FATHERLAND_FRONT',
    level: 'NEIGHBORHOOD',
    parentId: 'org-mttq-phuong',
    areaId: 'area-kp-21',
    areaName: 'Khu phố 21',
    leaderName: 'Nguyễn Thị Mỹ Châu',
    leaderPosition: 'Trưởng ban CTMT',
    phone: '0834789870',
    email: 'bctmt.kp21.chanhhiep@gmail.com',
    description: 'Tổ chức phối hợp hành động của MTTQ tại địa bàn Khu phố 21 (Chánh Mỹ 2).',
    membersCount: 8,
    partyMembersCount: 5,
    displayOrder: 30,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  // Các Tổ chức Chính trị - Xã hội / Đoàn thể Thành viên
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
    membersCount: 450,
    partyMembersCount: 48,
    displayOrder: 20,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
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
    membersCount: 1280,
    partyMembersCount: 72,
    displayOrder: 21,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
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
    membersCount: 320,
    partyMembersCount: 115,
    displayOrder: 22,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
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
    membersCount: 890,
    partyMembersCount: 140,
    displayOrder: 23,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
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
    membersCount: 210,
    partyMembersCount: 28,
    displayOrder: 24,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  // Chi đoàn / Chi hội cấp cơ sở trực thuộc Đoàn thể, gắn với Khu phố 1 (Hierarchy Children)
  {
    id: 'org-chi-doan-kp1',
    code: 'CD-KP01',
    name: 'Chi đoàn TNCS Hồ Chí Minh Khu phố 1',
    shortName: 'Chi đoàn Khu phố 1',
    slug: 'chi-doan-khu-pho-1',
    type: 'BRANCH',
    level: 'NEIGHBORHOOD',
    parentId: 'org-doan-tn',
    areaId: 'area-kp-1',
    areaName: 'Khu phố 1',
    leaderName: 'Nguyễn Anh Khoa',
    leaderPosition: 'Bí thư Chi đoàn',
    phone: '0793515812',
    email: 'chidoan.kp1.chanhhiep@gmail.com',
    description: 'Chi đoàn thanh niên cơ sở sinh hoạt tại Khu phố 1.',
    membersCount: 38,
    partyMembersCount: 3,
    displayOrder: 30,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-chi-hoi-pn-kp1',
    code: 'CHPN-KP01',
    name: 'Chi hội Phụ nữ Khu phố 1',
    shortName: 'Chi hội Phụ nữ KP1',
    slug: 'chi-hoi-phu-nu-khu-pho-1',
    type: 'BRANCH',
    level: 'NEIGHBORHOOD',
    parentId: 'org-hoi-pn',
    areaId: 'area-kp-1',
    areaName: 'Khu phố 1',
    leaderName: 'Nguyễn Thị Thu Dung',
    leaderPosition: 'Chi hội trưởng Phụ nữ',
    phone: '0933742769',
    description: 'Chi hội phụ nữ cơ sở tại Khu phố 1.',
    membersCount: 110,
    partyMembersCount: 6,
    displayOrder: 31,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'org-chi-hoi-ccb-kp1',
    code: 'CHCCB-KP01',
    name: 'Chi hội Cựu chiến binh Khu phố 1',
    shortName: 'Chi hội CCB KP1',
    slug: 'chi-hoi-cuu-chien-binh-khu-pho-1',
    type: 'BRANCH',
    level: 'NEIGHBORHOOD',
    parentId: 'org-hoi-ccb',
    areaId: 'area-kp-1',
    areaName: 'Khu phố 1',
    leaderName: 'Trần Văn Hưng',
    leaderPosition: 'Chi hội trưởng CCB',
    phone: '0912345678',
    description: 'Chi hội cựu chiến binh cơ sở tại Khu phố 1.',
    membersCount: 28,
    partyMembersCount: 12,
    displayOrder: 32,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  }
];

export const INITIAL_MEMBER_ORGANIZATIONS: MemberOrganization[] = [
  {
    id: 'org-mttq',
    code: 'MTTQ-CH',
    slug: 'uy-ban-mttq-viet-nam',
    name: 'Ủy ban MTTQ Việt Nam Phường Chánh Hiệp',
    shortName: 'Ủy ban MTTQ Phường',
    description: 'Liên minh chính trị, liên hiệp tự nguyện của các tổ chức chính trị, các tổ chức chính trị - xã hội, tổ chức xã hội và các cá nhân tiêu biểu trong các tầng lớp nhân dân.',
    leaderName: 'Trần Thị Hoa',
    leaderPosition: 'Chủ tịch Ủy ban MTTQ',
    phone: '0274.3822.111',
    email: 'mttq.chanhhiep@gmail.com',
    avatarUrl: 'https://sv2.anhsieuviet.com/2026/09/02/862c92e8-1336-4885-8787-1a6702c3a178ad174eb779884713.png',
    bannerUrl: 'https://sv2.anhsieuviet.com/2026/09/02/b94eb55d-1061-4c4f-9278-a46ce8de408a9067fc5c33d6b0a2.png',
    displayOrder: 1,
    parentId: null,
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    organizationId: 'org-mttq-phuong',
    level: 'WARD',
    status: 'ACTIVE',
    activeMembersCount: 45,
    branchesCount: 21, // 21 Ban công tác Mặt trận khu phố
    neighborhoodsCoveredCount: 21,
    femaleMembersCount: 22,
    youthMembersCount: 10,
    partyMembersCount: 38,
    executiveCommitteeMembersCount: 35,
    gatheringRatio: '95%',
    programsCount: 32,
    keyProjectsCount: 21,
    establishedYear: '1930',
    featuredAchievements: [
      'Xây dựng 100% Ban công tác Mặt trận khu phố vững mạnh',
      'Mô hình "Nối vòng tay lớn - Chăm lo An sinh Xã hội"',
      'Mô hình "Khu dân cư Tự quản - Khai thác Chuyển đổi số"'
    ],
    createdAt: '2026-01-01'
  },
  {
    id: 'org-dtn',
    code: 'DTN-CH',
    slug: 'doan-thanh-nien',
    name: 'Đoàn TNCS Hồ Chí Minh Phường Chánh Hiệp',
    shortName: 'Đoàn Thanh niên',
    description: 'Tổ chức chính trị - xã hội của thanh niên Việt Nam, cánh tay đắc lực và lực lượng hậu bị tin cậy của Đảng tại địa bàn phường Chánh Hiệp.',
    leaderName: 'Nguyễn Văn Đạt',
    leaderPosition: 'Bí thư Đoàn Phường',
    phone: '0274.3822.112',
    email: 'doanthanhnien.chanhhiep@gmail.com',
    avatarUrl: 'https://sv2.anhsieuviet.com/2026/09/02/8758f2ac-9342-47db-8f7f-7a3bcd434c32b7535a4487543751.png',
    bannerUrl: 'https://sv2.anhsieuviet.com/2026/09/02/775fbdb9-40fc-4b75-979f-7ebf40ecd00fb813d9fe5f77bf4c.png',
    displayOrder: 2,
    parentId: null,
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    organizationId: 'org-doan-tn',
    level: 'WARD',
    status: 'ACTIVE',
    activeMembersCount: 520,
    branchesCount: 24, // 21 chi đoàn khu phố + 3 chi đoàn trường học
    neighborhoodsCoveredCount: 21,
    femaleMembersCount: 245,
    youthMembersCount: 520,
    partyMembersCount: 56,
    executiveCommitteeMembersCount: 11,
    gatheringRatio: '84%',
    programsCount: 22,
    keyProjectsCount: 10,
    establishedYear: '1931',
    featuredAchievements: [
      'Đội hình "Thanh niên xung kích Chuyển đổi số địa phương"',
      'Mô hình "Tuyến đường Thanh niên Tự quản Sáng - Xanh - Sạch - An ninh"',
      'Chương trình "Nâng bước em đến trường"'
    ],
    createdAt: '2026-01-01'
  },
  {
    id: 'org-lhph',
    code: 'HPN-CH',
    slug: 'hoi-lien-hiep-phu-nu',
    name: 'Hội Liên hiệp Phụ nữ Phường Chánh Hiệp',
    shortName: 'Hội Phụ nữ',
    description: 'Tổ chức đại diện cho quyền và lợi ích hợp pháp, chính đáng của các tầng lớp phụ nữ, phát động phong trào "Xây dựng gia đình 5 không, 3 sạch".',
    leaderName: 'Võ Thị Bích Loan',
    leaderPosition: 'Chủ tịch Hội Phụ nữ',
    phone: '0274.3822.113',
    email: 'hoiphunu.chanhhiep@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    bannerUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=1200',
    displayOrder: 3,
    parentId: null,
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    organizationId: 'org-hoi-pn',
    level: 'WARD',
    status: 'ACTIVE',
    activeMembersCount: 1680,
    branchesCount: 21, // 21 chi hội phụ nữ khu phố
    neighborhoodsCoveredCount: 21,
    femaleMembersCount: 1680,
    youthMembersCount: 420,
    partyMembersCount: 88,
    executiveCommitteeMembersCount: 17,
    gatheringRatio: '89%',
    programsCount: 26,
    keyProjectsCount: 12,
    establishedYear: '1930',
    featuredAchievements: [
      'Mô hình "Mẹ đỡ đầu - Kết nối yêu thương"',
      'Phong trào "Gia đình 5 không 3 sạch xây dựng Đô thị văn minh"',
      'Quỹ "Tương trợ phụ nữ khởi nghiệp và phát triển kinh tế"'
    ],
    createdAt: '2026-01-01'
  },
  {
    id: 'org-ccb',
    code: 'CCB-CH',
    slug: 'hoi-cuu-chien-binh',
    name: 'Hội Cựu chiến binh Phường Chánh Hiệp',
    shortName: 'Hội Cựu chiến binh',
    description: 'Tổ chức của các cựu chiến binh, phát huy bản chất truyền thống "Bộ đội Cụ Hồ", gương mẫu đi đầu trong các phong trào tự quản khu phố.',
    leaderName: 'Đặng Quốc Hùng',
    leaderPosition: 'Chủ tịch Hội Cựu chiến binh',
    phone: '0274.3822.114',
    email: 'cuuchienbinh.chanhhiep@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    bannerUrl: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&q=80&w=1200',
    displayOrder: 4,
    parentId: null,
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    organizationId: 'org-hoi-ccb',
    level: 'WARD',
    status: 'ACTIVE',
    activeMembersCount: 420,
    branchesCount: 21, // 21 chi hội CCB khu phố
    neighborhoodsCoveredCount: 21,
    femaleMembersCount: 52,
    youthMembersCount: 0,
    partyMembersCount: 145,
    executiveCommitteeMembersCount: 15,
    gatheringRatio: '96%',
    programsCount: 14,
    keyProjectsCount: 8,
    establishedYear: '1989',
    featuredAchievements: [
      'Mô hình "Cựu chiến binh gương mẫu bảo vệ an ninh trật tự"',
      'Tổ hòa giải cựu chiến binh giải quyết 100% mâu thuẫn cơ sở',
      'Giáo dục truyền thống cách mạng cho thế hệ trẻ'
    ],
    createdAt: '2026-01-01'
  },
  {
    id: 'org-nct',
    code: 'NCT-CH',
    slug: 'hoi-nguoi-cao-tuoi',
    name: 'Hội Người cao tuổi Phường Chánh Hiệp',
    shortName: 'Hội Người cao tuổi',
    description: 'Tổ chức tập hợp người cao tuổi địa phương, thực hiện phong trào "Tuổi cao - Gương sáng", tích cực tham gia xây dựng đời sống văn hóa khu dân cư.',
    leaderName: 'Lê Văn Chính',
    leaderPosition: 'Chủ tịch Hội NCT',
    phone: '0274.3822.115',
    email: 'nguoicaotuoi.chanhhiep@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
    bannerUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1200',
    displayOrder: 5,
    parentId: null,
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    organizationId: 'org-hoi-nct',
    level: 'WARD',
    status: 'ACTIVE',
    activeMembersCount: 1150,
    branchesCount: 21, // 21 chi hội NCT khu phố
    neighborhoodsCoveredCount: 21,
    femaleMembersCount: 620,
    youthMembersCount: 0,
    partyMembersCount: 165,
    executiveCommitteeMembersCount: 17,
    gatheringRatio: '92%',
    programsCount: 18,
    keyProjectsCount: 6,
    establishedYear: '1995',
    featuredAchievements: [
      'Phong trào "Tuổi cao - Gương sáng xây dựng khu phố văn hóa"',
      'CLB Dưỡng sinh & Câu lạc bộ Thơ ca Người cao tuổi',
      'Chương trình "Ông bà cha mẹ gương mẫu, con cháu thảo hiền"'
    ],
    createdAt: '2026-01-01'
  },
  {
    id: 'org-ctd',
    code: 'CTD-CH',
    slug: 'hoi-chu-thap-do',
    name: 'Hội Chữ thập đỏ Phường Chánh Hiệp',
    shortName: 'Hội Chữ thập đỏ',
    description: 'Tổ chức nhân đạo nòng cốt, trợ giúp nhân đạo, cứu trợ khẩn cấp, khám chữa bệnh nhân đạo và vận động hiến máu tình nguyện.',
    leaderName: 'Hoàng Thị Mai',
    leaderPosition: 'Chủ tịch Hội Chữ thập đỏ',
    phone: '0274.3822.116',
    email: 'chuthapdo.chanhhiep@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    bannerUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=1200',
    displayOrder: 6,
    parentId: null,
    areaId: 'area-chanh-hiep',
    areaName: 'Phường Chánh Hiệp',
    organizationId: 'org-hoi-ctd',
    level: 'WARD',
    status: 'ACTIVE',
    activeMembersCount: 320,
    branchesCount: 21, // 21 chi hội CTĐ khu phố
    neighborhoodsCoveredCount: 21,
    femaleMembersCount: 195,
    youthMembersCount: 85,
    partyMembersCount: 36,
    executiveCommitteeMembersCount: 13,
    gatheringRatio: '88%',
    programsCount: 34,
    keyProjectsCount: 9,
    establishedYear: '1957',
    featuredAchievements: [
      'Tổ chức "Bếp ăn từ thiện & Cháo tình thương cho bệnh nhân nghèo"',
      'Phong trào "Hiến máu nhân đạo - Giọt hồng Chánh Hiệp"',
      'Ngân hàng xe lăn & Dụng cụ y tế hỗ trợ người khuyết tật'
    ],
    createdAt: '2026-01-01'
  },
  // Chi hội / Chi đoàn trực thuộc cấp cơ sở (Hierarchical Children with parentId & areaId)
  {
    id: 'org-sub-dtn-kp1',
    code: 'CD-KP01',
    slug: 'chi-doan-khu-pho-1',
    name: 'Chi đoàn TNCS Hồ Chí Minh Khu phố 1',
    shortName: 'Chi đoàn KP1',
    description: 'Chi đoàn thanh niên phụ trách công tác đoàn và phong trào thanh thiếu nhi tại địa bàn Khu phố 1.',
    leaderName: 'Nguyễn Anh Khoa',
    leaderPosition: 'Bí thư Chi đoàn',
    phone: '0793515812',
    email: 'chidoan.kp1.chanhhiep@gmail.com',
    displayOrder: 10,
    parentId: 'org-dtn', // Trực thuộc Đoàn Phường
    areaId: 'area-kp-1', // Gắn với Khu phố 1
    areaName: 'Khu phố 1',
    organizationId: 'org-chi-doan-kp1',
    level: 'NEIGHBORHOOD',
    status: 'ACTIVE',
    activeMembersCount: 38,
    branchesCount: 3, // 3 tổ thanh niên
    neighborhoodsCoveredCount: 1,
    femaleMembersCount: 18,
    youthMembersCount: 38,
    partyMembersCount: 3,
    executiveCommitteeMembersCount: 3,
    gatheringRatio: '85%',
    programsCount: 6,
    keyProjectsCount: 2,
    establishedYear: '1976',
    featuredAchievements: [
      'Đội thanh niên chuyển đổi số hỗ trợ người dân cài đặt VNeID tại Khu phố 1',
      'Tuyến đường thanh niên tự quản sáng xanh sạch đẹp'
    ],
    createdAt: '2026-01-01'
  },
  {
    id: 'org-sub-pn-kp1',
    code: 'CHPN-KP01',
    slug: 'chi-hoi-phu-nu-khu-pho-1',
    name: 'Chi hội Phụ nữ Khu phố 1',
    shortName: 'Chi hội Phụ nữ KP1',
    description: 'Chi hội đại diện quyền lợi phụ nữ và thúc đẩy bình đẳng giới tại Khu phố 1.',
    leaderName: 'Nguyễn Thị Thu Dung',
    leaderPosition: 'Chi hội trưởng Phụ nữ',
    phone: '0933742769',
    email: 'hoiphunu.kp1@gmail.com',
    displayOrder: 11,
    parentId: 'org-lhph', // Trực thuộc Hội Phụ nữ Phường
    areaId: 'area-kp-1', // Gắn với Khu phố 1
    areaName: 'Khu phố 1',
    organizationId: 'org-chi-hoi-pn-kp1',
    level: 'NEIGHBORHOOD',
    status: 'ACTIVE',
    activeMembersCount: 110,
    branchesCount: 4, // 4 tổ phụ nữ
    neighborhoodsCoveredCount: 1,
    femaleMembersCount: 110,
    youthMembersCount: 25,
    partyMembersCount: 6,
    executiveCommitteeMembersCount: 5,
    gatheringRatio: '90%',
    programsCount: 8,
    keyProjectsCount: 3,
    establishedYear: '1976',
    featuredAchievements: [
      'Tổ phụ nữ tiết kiệm và tương trợ vốn',
      'Mô hình gia đình 5 không 3 sạch tại Khu phố 1'
    ],
    createdAt: '2026-01-01'
  },
  {
    id: 'org-sub-ccb-kp1',
    code: 'CHCCB-KP01',
    slug: 'chi-hoi-cuu-chien-binh-khu-pho-1',
    name: 'Chi hội Cựu chiến binh Khu phố 1',
    shortName: 'Chi hội CCB KP1',
    description: 'Chi hội cựu chiến binh gương mẫu và nòng cốt trong công tác an ninh trật tự tại Khu phố 1.',
    leaderName: 'Trần Văn Hưng',
    leaderPosition: 'Chi hội trưởng CCB',
    phone: '0912345678',
    email: 'cuuchienbinh.kp1@gmail.com',
    displayOrder: 12,
    parentId: 'org-ccb', // Trực thuộc Hội CCB Phường
    areaId: 'area-kp-1', // Gắn với Khu phố 1
    areaName: 'Khu phố 1',
    organizationId: 'org-chi-hoi-ccb-kp1',
    level: 'NEIGHBORHOOD',
    status: 'ACTIVE',
    activeMembersCount: 28,
    branchesCount: 2,
    neighborhoodsCoveredCount: 1,
    femaleMembersCount: 4,
    youthMembersCount: 0,
    partyMembersCount: 12,
    executiveCommitteeMembersCount: 3,
    gatheringRatio: '98%',
    programsCount: 5,
    keyProjectsCount: 2,
    establishedYear: '1989',
    featuredAchievements: [
      'Tổ hòa giải cựu chiến binh cơ sở đạt hiệu quả 100%',
      'Cựu chiến binh gương mẫu bảo vệ an ninh trật tự khu phố'
    ],
    createdAt: '2026-01-01'
  }
];

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
