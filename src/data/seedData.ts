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
  AuditLog
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
    bannerUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
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
    bannerUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200',
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
    bannerUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
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
    bannerUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
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
    description: 'Phối hợp với 12 Trưởng Ban công tác Mặt trận khu phố lập danh sách, xác minh thông tin từng hoàn cảnh để thẩm định xét duyệt.',
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
