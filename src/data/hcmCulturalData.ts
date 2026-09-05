export interface ExhibitPart {
  id: string;
  name: string;
  type: 'di_tich' | 'san_pham' | 'chi_tiet' | 'tu_lieu';
  typeLabel: string;
  xPercent: number; // 10 to 90 percentage across 3D model
  yPercent: number; // 10 to 90 percentage across 3D model
  shortSummary: string;
  significance: string;
  material?: string;
  dimensions?: string;
  historicalNote?: string;
}

export interface ExhibitItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Tư liệu lịch sử' | 'Hiện vật & Di tích' | 'Tủ sách Bác Hồ' | 'Ảnh tư liệu' | 'Mô hình 3D';
  x: number; // 3D coordinates in room (-200 to 200)
  z: number; // 3D coordinates in room (-200 to 200)
  imageUrl: string;
  year: string;
  quote?: string;
  description: string;
  details: string[];
  audioText: string;
  localConnection?: string;
  parts: ExhibitPart[];
}

export const STORAGE_KEY_HCM_EXHIBITS = 'mttq_chanhhiep_hcm_exhibits_v2';

export const DEFAULT_HCM_EXHIBITS: ExhibitItem[] = [
  {
    id: 'ex-1',
    title: 'Tượng Bác Hồ & Tuyên ngôn Độc lập (1945)',
    subtitle: 'Bảo vật Quốc gia - Mốc son khai sinh nước Việt Nam Dân chủ Cộng hòa',
    category: 'Hiện vật & Di tích',
    x: 0,
    z: 140,
    year: '1945',
    quote: '“Nước Việt Nam có quyền hưởng tự do và độc lập, và sự thật đã thành một nước tự do, độc lập.”',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    description: 'Trưng bày trang trọng tượng Chủ tịch Hồ Chí Minh trong tư thế đọc Bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình lịch sử ngày 2/9/1945, cùng cờ Tổ quốc và các văn bản tái hiện.',
    details: [
      'Bản Tuyên ngôn Độc lập khẳng định quyền bình đẳng, quyền sống, quyền tự do và quyền mưu cầu hạnh phúc của dân tộc Việt Nam.',
      'Là ngọn cờ tập hợp và đoàn kết triệu triệu đồng bào không phân biệt tôn giáo, giai cấp đứng lên bảo vệ độc lập non sông.',
      'Tại phường Chánh Hiệp, tinh thần Cách mạng Tháng Tám luôn được truyền lửa qua các thế hệ cán bộ, hội viên và nhân dân.'
    ],
    audioText: 'Tuyên ngôn Độc lập năm 1945 do Chủ tịch Hồ Chí Minh soạn thảo và công bố là văn kiện lịch sử bất hủ, khai sinh ra nước Việt Nam Dân chủ Cộng hòa, khẳng định ý chí quật cường của khối đại đoàn kết toàn dân tộc.',
    localConnection: 'Được tôn kính tại Nhà văn hóa và Phòng truyền thống Phường Chánh Hiệp.',
    parts: [
      {
        id: 'ex1-p1',
        name: 'Tượng Chủ tịch Hồ Chí Minh đọc Tuyên ngôn',
        type: 'di_tich',
        typeLabel: 'Di tích & Tượng đài',
        xPercent: 50,
        yPercent: 32,
        shortSummary: 'Khắc họa thần thái uy nghiêm, nhân hậu của Người trên lễ đài Ba Đình ngày 2/9/1945.',
        material: 'Đồng đúc nguyên khối mạ ánh kim bảo tồn kỹ thuật số',
        dimensions: 'Tỷ lệ phục dựng 1:1, cao 185cm',
        significance: 'Biểu tượng thiêng liêng của độc lập, tự do và sức mạnh khối đại đoàn kết toàn dân tộc. Vầng trán cao và ánh mắt sáng của Người hướng về tương lai non sông.',
        historicalNote: 'Phục dựng theo hình ảnh tư liệu của các nhà nhiếp ảnh và họa sĩ cách mạng quốc gia.'
      },
      {
        id: 'ex1-p2',
        name: 'Lễ đài Ba Đình & Bục Micro lịch sử',
        type: 'chi_tiet',
        typeLabel: 'Cấu phần Di tích',
        xPercent: 32,
        yPercent: 68,
        shortSummary: 'Nơi phát đi thanh âm lịch sử: "Tôi nói đồng bào nghe rõ không?" đi vào lòng triệu con tim.',
        material: 'Gỗ sồi mộc cổ truyền, bọc vải nỉ đỏ Ba Đình, viền đồng',
        dimensions: 'Bục phát biểu cao 110cm, bệ đỡ 2 tầng',
        significance: 'Lời hỏi ân cần xóa tan mọi khoảng cách giữa vị nguyên thủ quốc gia và nhân dân, khẳng định bản chất chính quyền thực sự của nhân dân.',
        historicalNote: 'Chiếc micro cổ do các kỹ thuật viên Sở Bưu điện truyền thanh Hà Nội chuẩn bị khẩn trương phục vụ ngày Lễ Độc lập.'
      },
      {
        id: 'ex1-p3',
        name: 'Bản Tuyên ngôn Độc lập chữ vàng',
        type: 'tu_lieu',
        typeLabel: 'Bảo vật Quốc gia',
        xPercent: 68,
        yPercent: 64,
        shortSummary: 'Văn kiện lịch sử bất hủ mở ra kỷ nguyên độc lập tự do cho dân tộc Việt Nam.',
        material: 'Đá hoa cương đen thếp vàng 24K nguyên bản',
        dimensions: 'Khổ bia 80cm x 120cm',
        significance: 'Khẳng định tất cả các dân tộc trên thế giới đều sinh ra bình đẳng; dân tộc nào cũng có quyền sống, quyền sung sướng và quyền tự do.',
        historicalNote: 'Chủ tịch Hồ Chí Minh khởi thảo tại căn gác số 48 phố Hàng Ngang, Hà Nội vào những ngày cuối tháng 8/1945.'
      },
      {
        id: 'ex1-p4',
        name: 'Quốc kỳ Cờ đỏ Sao vàng thiêng liêng',
        type: 'san_pham',
        typeLabel: 'Sản phẩm Văn hóa',
        xPercent: 78,
        yPercent: 24,
        shortSummary: 'Lá cờ đỏ sao vàng năm cánh tung bay trong gió mùa thu Ba Đình lịch sử.',
        material: 'Lụa đỏ truyền thống dệt tay, thêu ngôi sao vàng sợi kim tuyến',
        dimensions: 'Tỷ lệ chuẩn Quốc kỳ 2:3',
        significance: 'Màu đỏ là máu của các anh hùng liệt sĩ, màu vàng là màu da của người Việt Nam, năm cánh sao tượng trưng cho khối đại đoàn kết sĩ, nông, công, thương, binh.',
        historicalNote: 'Xuất hiện trong Khởi nghĩa Nam Kỳ (1940) và chính thức được Quốc dân Đại hội Tân Trào công nhận là Quốc kỳ Việt Nam.'
      }
    ]
  },
  {
    id: 'ex-2',
    title: 'Bản Di chúc thiêng liêng của Bác (1969)',
    subtitle: 'Di sản vô giá chứa đựng muôn vàn tình thương yêu cho toàn Đảng, toàn dân',
    category: 'Tư liệu lịch sử',
    x: -120,
    z: 80,
    year: '1969',
    quote: '“Đoàn kết là một truyền thống cực kỳ quý báu của Đảng và của dân ta... Phải giữ gìn sự đoàn kết nhất trí như giữ gìn con ngươi của mắt mình.”',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
    description: 'Bản phục dựng bút tích Di chúc của Bác Hồ, đặc biệt là những lời dặn dò tâm huyết về việc chăm lo đời sống nhân dân, tinh thần đoàn kết trong Đảng và Mặt trận Tổ quốc.',
    details: [
      'Được Bác khởi thảo từ tháng 5/1965 và hoàn thiện qua các năm cho đến khi Người đi xa.',
      'Nhấn mạnh vai trò nòng cốt của MTTQ trong việc củng cố khối liên minh công nông trí thức và đại đoàn kết các tầng lớp nhân dân.',
      'Phường Chánh Hiệp cụ thể hóa Di chúc bằng các phong trào chăm lo an sinh xã hội, xây dựng nhà Đại đoàn kết và phụng dưỡng Mẹ VNAH.'
    ],
    audioText: 'Di chúc thiêng liêng của Chủ tịch Hồ Chí Minh căn dặn: Đoàn kết là một truyền thống cực kỳ quý báu. Toàn thể đồng bào và cán bộ phường Chánh Hiệp nguyện đời đời noi gương và thực hiện lời dạy của Người.',
    localConnection: 'Kim chỉ nam cho mọi hoạt động công tác Mặt trận và phong trào thi đua 21 khu phố.',
    parts: [
      {
        id: 'ex2-p1',
        name: 'Bút tích mực lam nguyên bản',
        type: 'tu_lieu',
        typeLabel: 'Bút tích Bảo vật',
        xPercent: 42,
        yPercent: 40,
        shortSummary: 'Những dòng chữ viết tay mộc mạc, chan chứa tình yêu thương bao la của Bác gửi lại non sông.',
        material: 'Giấy pơ-luya bảo quản chân không và mực bút máy Parker màu lam',
        dimensions: 'Tập tài liệu gốc khổ A4 lưu giữ tại Cục Lưu trữ Văn phòng Trung ương Đảng',
        significance: 'Minh chứng chân thực về phong cách làm việc cẩn trọng, tỉ mỉ, luôn suy nghĩ cho tương lai đất nước cho đến phút cuối đời.',
        historicalNote: 'Bác khởi thảo vào dịp sinh nhật lần thứ 75 (tháng 5/1965), mỗi năm Người dành một khoảng thời gian tĩnh lặng để xem lại và bổ sung.'
      },
      {
        id: 'ex2-p2',
        name: 'Lời dặn dò về Đoàn kết & Mặt trận',
        type: 'di_tich',
        typeLabel: 'Tư tưởng Cốt lõi',
        xPercent: 58,
        yPercent: 72,
        shortSummary: 'Khắc ghi lời dặn: Đoàn kết trong Đảng, đoàn kết trong Mặt trận, đoàn kết toàn dân tộc.',
        material: 'Bản khắc đồng dát vàng kỹ thuật cao',
        significance: 'Kim chỉ nam sống còn cho sự vững mạnh của Đảng và sức mạnh vô địch của khối đại đoàn kết toàn dân tộc dưới mái nhà Mặt trận.',
        historicalNote: 'Ủy ban MTTQ phường Chánh Hiệp đã lấy lời dạy này làm phương châm xây dựng 21 Ban Công tác Mặt trận khu phố vững mạnh.'
      },
      {
        id: 'ex2-p3',
        name: 'Hộp lưu trữ nhung đỏ trang trọng',
        type: 'san_pham',
        typeLabel: 'Kỷ vật Lưu trữ',
        xPercent: 24,
        yPercent: 62,
        shortSummary: 'Mô hình hộp bảo vật lưu trữ bản sao Di chúc trưng bày phục vụ đồng bào chiêm bái.',
        material: 'Gỗ gụ nguyên khối bọc nhung lụa đỏ huyết dụ, nẹp đồng hoa văn Trống đồng Đông Sơn',
        dimensions: '35cm x 28cm x 8cm',
        significance: 'Thể hiện lòng tôn kính tuyệt đối của thế hệ hôm nay đối với di sản tư tưởng thiêng liêng của Vị Cha già kính yêu.'
      }
    ]
  },
  {
    id: 'ex-3',
    title: 'Bác Hồ với Khối Đại đoàn kết toàn dân tộc',
    subtitle: 'Bộ sưu tập tranh tư liệu & Lời dạy bất hủ về Mặt trận Dân tộc Thống nhất',
    category: 'Ảnh tư liệu',
    x: 120,
    z: 80,
    year: '1930 - 1969',
    quote: '“Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công!”',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    description: 'Bộ sưu tập hình ảnh Bác Hồ gặp gỡ các nhân sĩ, trí thức, chức sắc tôn giáo, đồng bào các dân tộc thiểu số và chiến sĩ miền Nam, khẳng định sức mạnh vô địch của lòng dân.',
    details: [
      'Tư tưởng Hồ Chí Minh coi Mặt trận Tổ quốc là ngôi nhà chung của toàn thể người Việt Nam yêu nước.',
      'Tập hợp không phân biệt tôn giáo, già trẻ, gái trai, cùng chung một mục đích xây dựng một nước Việt Nam hòa bình, thống nhất, độc lập, dân chủ và giàu mạnh.',
      'Ủy ban MTTQ Việt Nam phường Chánh Hiệp đã phát huy bài học đoàn kết để nhân rộng 45 mô hình tự quản hiệu quả.'
    ],
    audioText: 'Chủ tịch Hồ Chí Minh luôn khẳng định: Trong bầu trời không gì quý bằng nhân dân. Trong thế giới không gì mạnh bằng lực lượng đoàn kết của toàn dân.',
    localConnection: 'Trưng bày tại sảnh Trung tâm Ủy ban MTTQ Việt Nam phường Chánh Hiệp.',
    parts: [
      {
        id: 'ex3-p1',
        name: 'Bức ảnh Bác bắt tay đồng bào các dân tộc',
        type: 'tu_lieu',
        typeLabel: 'Ảnh tư liệu lịch sử',
        xPercent: 48,
        yPercent: 36,
        shortSummary: 'Hình ảnh Người ân cần nắm chặt tay đồng bào các dân tộc, chức sắc tôn giáo và nhân sĩ trí thức.',
        material: 'Tranh ảnh tư liệu phục chế kỹ thuật số độ phân giải cao',
        significance: 'Khẳng định Mặt trận Dân tộc Thống nhất là tập hợp rộng rãi của mọi người Việt Nam yêu nước không phân biệt niềm tin tôn giáo, dân tộc.',
        historicalNote: 'Chụp tại Đại hội Thống nhất Mặt trận Việt Minh và Hội Liên Việt tháng 3/1951.'
      },
      {
        id: 'ex3-p2',
        name: 'Biểu trưng Mặt trận Tổ quốc Việt Nam',
        type: 'san_pham',
        typeLabel: 'Biểu tượng Chính trị - Văn hóa',
        xPercent: 72,
        yPercent: 65,
        shortSummary: 'Biểu tượng hoa sen thanh cao bao bọc cờ đỏ sao vàng, nền xanh của hòa bình và đại đoàn kết.',
        material: 'Đồng dập nổi mạ men ngũ sắc cao cấp',
        dimensions: 'Đường kính 60cm',
        significance: 'Hình ảnh ngọn cờ quy tụ sức mạnh lòng dân tại 21 khu phố phường Chánh Hiệp chung tay xây dựng đô thị văn minh, giàu đẹp.',
        historicalNote: 'Biểu trưng chính thức của Mặt trận Tổ quốc Việt Nam được sử dụng từ Đại hội lần thứ nhất (1977).'
      },
      {
        id: 'ex3-p3',
        name: 'Khẩu hiệu chữ vàng Bác căn dặn Mặt trận',
        type: 'chi_tiet',
        typeLabel: 'Chân lý Cách mạng',
        xPercent: 26,
        yPercent: 75,
        shortSummary: '“Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công!”',
        material: 'Bảng đồng thếp vàng chữ nổi 3D cách điệu',
        significance: 'Đúc kết chân lý lịch sử của Bác Hồ: Khi toàn dân chung một lòng thì không trở ngại nào không thể vượt qua.',
        historicalNote: 'Được Bác phát biểu tại lớp bồi dưỡng cán bộ Mặt trận khóa 2 năm 1962.'
      }
    ]
  },
  {
    id: 'ex-4',
    title: 'Tủ sách điện tử: Di sản Tư tưởng Hồ Chí Minh',
    subtitle: 'Số hóa hơn 20 tác phẩm kinh điển & Các câu chuyện về Bác',
    category: 'Tủ sách Bác Hồ',
    x: -140,
    z: -40,
    year: 'Xuất bản & Số hóa 2026',
    quote: '“Học để làm việc, làm người, làm cán bộ. Học để phụng sự đoàn thể, phụng sự giai cấp và nhân dân, phụng sự Tổ quốc và nhân loại.”',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    description: 'Tủ sách trực tuyến lưu trữ các tác phẩm: Đường Kách mệnh (1927), Sửa đổi lối làm việc (1947), Nâng cao đạo đức cách mạng, quét sạch chủ nghĩa cá nhân (1969), Dân vận (1949).',
    details: [
      'Cung cấp bản đọc số hóa tương tác cho cán bộ, đảng viên, đoàn viên thanh niên và người dân tra cứu phục vụ sinh hoạt chuyên đề.',
      'Chuyên mục "Mỗi tuần một câu chuyện về Bác" được các chi bộ 21 khu phố phường Chánh Hiệp duy trì thường xuyên.',
      'Tích hợp công nghệ tra cứu nhanh trích dẫn tư tưởng của Bác về dân chủ và giám sát nhân dân.'
    ],
    audioText: 'Tủ sách điện tử Hồ Chí Minh tại phường Chánh Hiệp mở ra nguồn tư liệu phong phú cho các tầng lớp nhân dân nghiên cứu, học tập và noi theo tác phong giản dị, liêm khiết của Người.',
    localConnection: 'Liên thông với Thư viện Văn phòng số và Phòng Đọc khu phố.',
    parts: [
      {
        id: 'ex4-p1',
        name: 'Tác phẩm "Đường Kách mệnh" (1927)',
        type: 'tu_lieu',
        typeLabel: 'Tác phẩm Kinh điển',
        xPercent: 30,
        yPercent: 44,
        shortSummary: 'Tác phẩm lý luận đặt nền móng tư tưởng cách mạng giải phóng dân tộc Việt Nam.',
        material: 'Số hóa ấn bản bìa nguyên gốc 1927 in thạch từ Quảng Châu',
        significance: 'Nêu bật tư cách của người cách mệnh: Cần kiệm, hòa nhã, hy sinh tính mạng cũng không tiếc, giữ nghiêm kỷ luật.',
        historicalNote: 'In thạch tại Quảng Châu (Trung Quốc) bí mật chuyển về nước qua đường thủy để truyền bá cho thanh niên yêu nước.'
      },
      {
        id: 'ex4-p2',
        name: 'Tác phẩm "Sửa đổi lối làm việc" (1947)',
        type: 'tu_lieu',
        typeLabel: 'Cẩm nang Đạo đức',
        xPercent: 52,
        yPercent: 50,
        shortSummary: 'Tác phẩm hướng dẫn cán bộ cách mạng rèn luyện tác phong dân vận, gần dân, lắng nghe nhân dân.',
        material: 'Bản in sắc nét kèm chú giải thực tiễn công tác cơ sở',
        significance: 'Tài liệu bồi dưỡng nòng cốt cho đội ngũ cán bộ Mặt trận 21 khu phố Chánh Hiệp trong lắng nghe và giải quyết tâm tư người dân.',
        historicalNote: 'Được Bác viết tại chiến khu Việt Bắc với bút danh X.Y.Z vào tháng 10/1947.'
      },
      {
        id: 'ex4-p3',
        name: 'Màn hình cảm ứng tra cứu số & Mã QR',
        type: 'san_pham',
        typeLabel: 'Sản phẩm Chuyển đổi số',
        xPercent: 74,
        yPercent: 62,
        shortSummary: 'Thiết bị đầu cuối cho phép người dân quét mã QR đọc trọn vẹn hơn 20 bộ sách điện tử về Bác Hồ trên điện thoại.',
        material: 'Kính cường lực quang học tích hợp cảm ứng đa điểm 4K',
        dimensions: 'Màn hình 43 inch cảm ứng điện dung, kết nối máy chủ dữ liệu đám mây',
        significance: 'Đưa di sản tư tưởng của Bác đến gần hơn với đoàn viên thanh niên và người dân một cách trực quan, sinh động.'
      }
    ]
  },
  {
    id: 'ex-5',
    title: 'Bác Hồ với Miền Nam & Tấm lòng Đồng bào Miền Nam',
    subtitle: 'Tình cảm sắt son thiêng liêng của Vị Cha già kính yêu đối với Nam Bộ',
    category: 'Ảnh tư liệu',
    x: 140,
    z: -40,
    year: '1946 - 1969',
    quote: '“Nam Bộ là máu của máu Việt Nam, là thịt của thịt Việt Nam. Sông có thể cạn, núi có thể mòn, song chân lý ấy không bao giờ thay đổi!”',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    description: 'Hình ảnh Bác đón tiếp các đoàn dũng sĩ miền Nam ra thăm miền Bắc, cùng chiếc huy hiệu và những bức thư động viên quân và dân miền Nam vượt qua bão lửa kháng chiến.',
    details: [
      'Khắc họa lời hứa sắt son của Người: Khi miền Nam chưa được giải phóng, Bác ăn không ngon, ngủ không yên.',
      'Nhân dân vùng Đất Thủ - Bình Dương và Chánh Hiệp kiên cường bám trụ theo ngọn cờ dẫn đường của Bác.',
      'Không gian trưng bày các kỷ vật do các Mẹ Việt Nam Anh hùng và cựu chiến binh phường Chánh Hiệp trân quý lưu giữ.'
    ],
    audioText: 'Miền Nam luôn ở trong trái tim Bác Hồ. Trải qua bao gian lao, đồng bào miền Nam nói chung và nhân dân Chánh Hiệp nói riêng luôn son sắt niềm tin theo Đảng và Bác.',
    localConnection: 'Bộ ảnh gốc được trích lục từ Bảo tàng Hồ Chí Minh - Chi nhánh TP. Hồ Chí Minh.',
    parts: [
      {
        id: 'ex5-p1',
        name: 'Tranh khắc Bác Hồ đón dũng sĩ miền Nam',
        type: 'tu_lieu',
        typeLabel: 'Tác phẩm Mỹ thuật Lịch sử',
        xPercent: 40,
        yPercent: 36,
        shortSummary: 'Khoảnh khắc xúc động khi Bác ôm hôn và gắn huy hiệu cho những người con dũng cảm từ tiền tuyến miền Nam ra thăm.',
        material: 'Tranh gỗ sơn khắc bóng truyền thống',
        significance: 'Biểu tượng cho tình cảm Bắc Nam một nhà, ruột thịt keo sơn không gì chia cắt được.',
        historicalNote: 'Tái hiện các đoàn đại biểu miền Nam vượt dãy Trường Sơn ra miền Bắc báo công với Bác vào các năm 1962, 1965, 1969.'
      },
      {
        id: 'ex5-p2',
        name: 'Chiếc khăn rằn Nam Bộ dâng Bác',
        type: 'di_tich',
        typeLabel: 'Kỷ vật Kháng chiến',
        xPercent: 68,
        yPercent: 60,
        shortSummary: 'Chiếc khăn rằn mộc mạc gửi gắm tấm lòng son sắt của đồng bào Nam Bộ gửi ra kính dâng Bác Hồ.',
        material: 'Vải bông dệt caro trắng đen truyền thống miền Tây Nam Bộ',
        dimensions: '120cm x 60cm',
        significance: 'Vật biểu trưng cho đức tính kiên cường, bất khuất, cần cù và nghĩa tình của con người phương Nam.',
        historicalNote: 'Kỷ vật của chiến sĩ giao liên chuyển ra Hà Nội năm 1968.'
      },
      {
        id: 'ex5-p3',
        name: 'Bức thư gửi đồng bào Nam Bộ (31/5/1946)',
        type: 'chi_tiet',
        typeLabel: 'Lời dạy Lịch sử',
        xPercent: 32,
        yPercent: 74,
        shortSummary: '“Nam Bộ là máu của máu Việt Nam, là thịt của thịt Việt Nam. Sông có thể cạn, núi có thể mòn, song chân lý ấy không bao giờ thay đổi!”',
        material: 'Bản đồng khắc chữ mạ bạc cổ',
        significance: 'Nguồn động viên tinh thần to lớn cho quân dân Nam Bộ và Thủ Dầu Một giữ vững ngọn cờ độc lập.',
        historicalNote: 'Bác viết trước lúc lên đường sang Pháp đàm phán bảo vệ nền hòa bình non trẻ của nước Việt Nam Dân chủ Cộng hòa.'
      }
    ]
  },
  {
    id: 'ex-6',
    title: 'Địa chỉ đỏ & Di tích Lịch sử Cách mạng Chánh Hiệp',
    subtitle: 'Vùng đất kiên cường với các căn cứ và điểm son kháng chiến',
    category: 'Hiện vật & Di tích',
    x: -80,
    z: -130,
    year: '1930 - 1975',
    quote: '“Uống nước nhớ nguồn - Ăn quả nhớ kẻ trồng cây.”',
    imageUrl: 'https://images.unsplash.com/photo-1590402494587-44b71d7772f6?auto=format&fit=crop&w=1200&q=80',
    description: 'Bản đồ di tích và các căn cứ kháng chiến xưa trên địa bàn phường Chánh Hiệp, tôn vinh những gia đình cơ sở cách mạng nuôi giấu cán bộ Mặt trận Giải phóng.',
    details: [
      'Gắn kết 21 khu phố thông qua các hoạt động về nguồn, thắp nến tri ân tại Nghĩa trang liệt sĩ và Nhà bia tưởng niệm.',
      'Giới thiệu hệ thống di tích văn hóa, đình chùa tín ngưỡng dân gian đã đồng hành cùng cuộc kháng chiến vệ quốc.',
      'Có mã liên kết trực tiếp tới Bản đồ số 21 khu phố để người dân tham quan thực tế.'
    ],
    audioText: 'Phường Chánh Hiệp tự hào với truyền thống cách mạng kiên cường, nơi mỗi tấc đất đều ghi dấu sự hy sinh và lòng kiên trung của các thế hệ cha anh vì độc lập tự do.',
    localConnection: 'Liên thông dữ liệu với Bản đồ số 21 Khu phố phường Chánh Hiệp.',
    parts: [
      {
        id: 'ex6-p1',
        name: 'Bia đá hoa cương Di tích Địa chỉ đỏ',
        type: 'di_tich',
        typeLabel: 'Di tích Lịch sử Địa phương',
        xPercent: 35,
        yPercent: 42,
        shortSummary: 'Bia tưởng niệm ghi nhận công lao của các cơ sở nuôi giấu cán bộ Mặt trận Giải phóng tại Chánh Hiệp.',
        material: 'Đá hoa cương nguyên khối mài bóng, chữ đục chìm sơn nhũ vàng',
        dimensions: 'Cao 160cm, rộng 90cm, dày 25cm',
        significance: 'Điểm son giáo dục truyền thống yêu nước và lòng biết ơn sâu sắc cho các thế hệ trẻ tại 21 khu phố.',
        historicalNote: 'Được khánh thành và tôn tạo nhằm gìn giữ các địa chỉ cách mạng hào hùng của địa phương.'
      },
      {
        id: 'ex6-p2',
        name: 'Mô hình Hầm bí mật nuôi giấu cán bộ',
        type: 'chi_tiet',
        typeLabel: 'Mô hình Di tích Kháng chiến',
        xPercent: 66,
        yPercent: 55,
        shortSummary: 'Phục dựng miệng hầm bí mật ngụy trang dưới bụi tre hoặc chuồng gia súc nơi các chiến sĩ Mặt trận ẩn náu.',
        material: 'Đất nén, khung gỗ sao chịu lực và nắp ngụy trang lu nước',
        dimensions: 'Kích thước phục dựng 1.8m x 1.2m x 1.5m',
        significance: 'Biểu tượng cho lòng dân kiên trung - "Lòng dân là hầm bí mật kiên cố nhất" chở che cách mạng qua mưa bom bão đạn.'
      },
      {
        id: 'ex6-p3',
        name: 'Mã định danh Bản đồ số 21 Khu phố',
        type: 'san_pham',
        typeLabel: 'Sản phẩm Số hóa Di tích',
        xPercent: 48,
        yPercent: 78,
        shortSummary: 'Liên kết trực tiếp tới tọa độ GPS thực tế của di tích trên hệ thống Bản đồ số MTTQ Phường Chánh Hiệp.',
        material: 'Bảng thép sơn tĩnh điện chống nước kèm chip NFC & QR Code',
        significance: 'Giúp người dân, học sinh tra cứu hành trình di chuyển và thông tin di tích trực tiếp trên điện thoại.',
        historicalNote: 'Sản phẩm tiên phong của công trình chuyển đổi số Mặt trận Chánh Hiệp năm 2026.'
      }
    ]
  },
  {
    id: 'ex-7',
    title: 'Huy hiệu Bác Hồ & Kỷ vật Kháng chiến của Cán bộ Mặt trận',
    subtitle: 'Những hiện vật vô giá được trao tặng cho người có công với nước',
    category: 'Hiện vật & Di tích',
    x: 80,
    z: -130,
    year: '1960 - 1975',
    quote: '“Thi đua là yêu nước, yêu nước thì phải thi đua, những người thi đua là những người yêu nước nhất.”',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    description: 'Tủ kính 3D phục dựng các kỷ vật thiêng liêng: Huy hiệu Bác Hồ, Huân chương Độc lập, khăn rằn Nam Bộ, đèn dầu thấu sáng địa đạo và thư tay của cán bộ Mặt trận thời kỳ kháng chiến.',
    details: [
      'Mỗi hiện vật là một chứng tích sống động về đức tính tiết kiệm, giản dị và tinh thần cống hiến quên mình vì dân tộc.',
      'Được lưu giữ từ sự đóng góp của các gia đình có công với cách mạng tại các khu phố 1, khu phố 5, khu phố 12 phường Chánh Hiệp.',
      'Phục vụ công tác giáo dục lý tưởng cách mạng cho đoàn viên, học sinh trên địa bàn phường.'
    ],
    audioText: 'Chiếc Huy hiệu Bác Hồ và các kỷ vật kháng chiến là minh chứng sáng ngời cho tinh thần yêu nước, trung thành vô hạn với lý tưởng độc lập dân tộc và chủ nghĩa xã hội.',
    localConnection: 'Phòng trưng bày hiện vật cựu chiến binh phường Chánh Hiệp.',
    parts: [
      {
        id: 'ex7-p1',
        name: 'Huy hiệu Bác Hồ mạ men đỏ nguyên bản',
        type: 'san_pham',
        typeLabel: 'Hiện vật Quý hiếm',
        xPercent: 38,
        yPercent: 40,
        shortSummary: 'Huy hiệu chân dung Bác Hồ do chính Người gửi tặng đồng chí cán bộ có thành tích dũng cảm xuất sắc.',
        material: 'Đồng dập nổi phủ men đỏ và lớp tráng bóng bảo vệ',
        dimensions: 'Đường kính 2.8cm, mặt sau có kim gài truyền thống',
        significance: 'Phần thưởng tinh thần vô giá mà mỗi chiến sĩ cách mạng trân trọng đeo trước ngực suốt những năm tháng bão lửa.',
        historicalNote: 'Được gia đình lão thành cách mạng tại khu phố 5 phường Chánh Hiệp trao tặng cho không gian trưng bày.'
      },
      {
        id: 'ex7-p2',
        name: 'Huân chương Kháng chiến chống Mỹ hạng Nhất',
        type: 'di_tich',
        typeLabel: 'Huân chương Vinh danh',
        xPercent: 68,
        yPercent: 45,
        shortSummary: 'Ghi nhận công lao đóng góp to lớn của cán bộ Mặt trận giải phóng địa phương cho sự nghiệp thống nhất non sông.',
        material: 'Hợp kim mạ vàng 18K, dải ruy băng lụa dệt màu đỏ viền vàng',
        dimensions: 'Chiều dài huân chương kèm cuống 8.5cm',
        significance: 'Tôn vinh tinh thần hy sinh thầm lặng nhưng oanh liệt của quân và dân Chánh Hiệp.'
      },
      {
        id: 'ex7-p3',
        name: 'Chiếc đèn bão thấu sáng hầm căn cứ',
        type: 'chi_tiet',
        typeLabel: 'Hiện vật Kháng chiến',
        xPercent: 52,
        yPercent: 72,
        shortSummary: 'Ngọn đèn đồng hành trong những đêm hội ý chi bộ, soạn thảo tài liệu truyền đơn vận động quần chúng.',
        material: 'Sắt tây dập gò thủ công, bầu chứa dầu hỏa và bóng thủy tinh chịu nhiệt',
        significance: 'Ánh sáng của niềm tin cách mạng trong đêm đen của chế độ cũ, thắp sáng con đường tiến tới độc lập.',
        historicalNote: 'Kỷ vật của lão thành cách mạng Chánh Hiệp sử dụng từ năm 1968 đến mùa xuân đại thắng 1975.'
      }
    ]
  },
  {
    id: 'ex-8',
    title: 'Sa bàn 3D: Hành trình Tìm đường cứu nước (1911 - 1941)',
    subtitle: '30 năm bôn ba qua 3 đại dương, 4 châu lục tìm ánh sáng tự do cho dân tộc',
    category: 'Mô hình 3D',
    x: 0,
    z: -60,
    year: '1911 - 1941',
    quote: '“Tôi muốn đi ra ngoài, xem nước Pháp và các nước khác. Sau khi xem xét họ làm như thế nào, tôi sẽ trở về giúp đồng bào chúng ta.”',
    imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
    description: 'Sa bàn tương tác 3D mô phỏng tuyến đường từ Bến Nhà Rồng đến Pháp, Anh, Mỹ, Liên Xô, Trung Quốc rồi trở về Pác Bó (Cao Bằng) trực tiếp lãnh đạo cách mạng Việt Nam.',
    details: [
      'Hiển thị trực quan từng mốc thời gian: Ngày 5/6/1911 người thanh niên Nguyễn Tất Thành rời Tổ quốc trên con tàu Amiral Latouche-Tréville.',
      'Năm 1920 đọc Sơ thảo Luận cương của Lênin, tìm thấy con đường giải phóng cho dân tộc Việt Nam.',
      'Năm 1941 trở về nước, sáng lập Mặt trận Việt Minh, cội nguồn của Mặt trận Tổ quốc Việt Nam ngày nay.'
    ],
    audioText: 'Hành trình ba mươi năm bôn ba tìm đường cứu nước của Bác là bài học vĩ đại về lòng yêu nước nồng nàn, ý chí sắt đá và tầm nhìn thời đại sâu sắc.',
    localConnection: 'Tích hợp mô hình sa bàn đa chiều trực tiếp trong không gian 3D.',
    parts: [
      {
        id: 'ex8-p1',
        name: 'Mô hình Tàu Amiral Latouche-Tréville',
        type: 'san_pham',
        typeLabel: 'Mô hình Lịch sử',
        xPercent: 34,
        yPercent: 42,
        shortSummary: 'Con tàu chở người phụ bếp Văn Ba rời Bến Nhà Rồng ngày 5/6/1911 bắt đầu hành trình cứu nước vĩ đại.',
        material: 'Gỗ tếch gọt thủ công, sơn bóng phục chế theo bản vẽ con tàu hơi nước thế kỷ 20',
        dimensions: 'Tỷ lệ 1:200, chiều dài mô hình 65cm',
        significance: 'Điểm khởi đầu cho một hành trình vĩ đại làm thay đổi vận mệnh của cả một dân tộc.',
        historicalNote: 'Tàu buôn trọng tải 5.595 tấn của hãng Hàng hải Chargeurs Réunis (Pháp).'
      },
      {
        id: 'ex8-p2',
        name: 'Cột mốc Paris 1920 & Luận cương Lênin',
        type: 'tu_lieu',
        typeLabel: 'Mốc son Thời đại',
        xPercent: 55,
        yPercent: 52,
        shortSummary: 'Điểm mốc Bác đọc Sơ thảo Luận cương của Lênin, tìm ra con đường giải phóng cho dân tộc.',
        material: 'Đá ngọc bích nhân tạo gắn đèn LED dẫn đường',
        significance: '“Luận cương của Lênin làm cho tôi rất cảm động, phấn khởi, sáng tỏ, tin tưởng biết bao! Đây là cái cần thiết cho chúng ta, đây là con đường giải phóng chúng ta”.',
        historicalNote: 'Được đăng trên báo L\'Humanité (Nhân đạo) số ra ngày 16 và 17/7/1920.'
      },
      {
        id: 'ex8-p3',
        name: 'Cột mốc 108 & Hang Pác Bó (Cao Bằng, 1941)',
        type: 'di_tich',
        typeLabel: 'Di tích Lịch sử Đặc biệt',
        xPercent: 72,
        yPercent: 34,
        shortSummary: 'Cột mốc biên giới nơi Bác đặt chân trở về đất mẹ Tổ quốc sau 30 năm bôn ba hải ngoại.',
        material: 'Đá cẩm thạch xám tái hiện vách đá Pác Bó lịch sử',
        dimensions: 'Cao 40cm trên sa bàn',
        significance: 'Tại đây Bác đã trực tiếp lãnh đạo phong trào cách mạng, triệu tập Hội nghị Trung ương 8 và thành lập Mặt trận Việt Minh.',
        historicalNote: 'Ngày 28/1/1941, Bác vượt qua cột mốc 108 về nước, thắp lên ngọn lửa chuẩn bị cho Cách mạng Tháng Tám.'
      }
    ]
  }
];

export function loadStoredHcmExhibits(): ExhibitItem[] {
  if (typeof window === 'undefined') return DEFAULT_HCM_EXHIBITS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HCM_EXHIBITS);
    if (!raw) return DEFAULT_HCM_EXHIBITS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.title) {
      return parsed;
    }
    return DEFAULT_HCM_EXHIBITS;
  } catch (err) {
    console.error('Error loading stored HCM exhibits:', err);
    return DEFAULT_HCM_EXHIBITS;
  }
}

export function saveStoredHcmExhibits(exhibits: ExhibitItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_HCM_EXHIBITS, JSON.stringify(exhibits));
  } catch (err) {
    console.error('Error saving stored HCM exhibits:', err);
  }
}

export function resetStoredHcmExhibits(): ExhibitItem[] {
  if (typeof window === 'undefined') return DEFAULT_HCM_EXHIBITS;
  try {
    localStorage.removeItem(STORAGE_KEY_HCM_EXHIBITS);
  } catch (err) {
    console.error('Error resetting stored HCM exhibits:', err);
  }
  return DEFAULT_HCM_EXHIBITS;
}
