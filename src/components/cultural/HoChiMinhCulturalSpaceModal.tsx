import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  X,
  Compass,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  BookOpen,
  Sparkles,
  Info,
  ChevronRight,
  ChevronLeft,
  Search,
  Eye,
  Play,
  Pause,
  Award,
  Share2,
  HelpCircle,
  Flame,
  Star,
  MapPin,
  Move,
  RotateCw,
  Layers,
  MousePointerClick,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface HoChiMinhCulturalSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMap?: () => void;
}

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

export const HCM_EXHIBITS: ExhibitItem[] = [
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

export const HoChiMinhCulturalSpaceModal: React.FC<HoChiMinhCulturalSpaceModalProps> = ({
  isOpen,
  onClose,
  onNavigateToMap
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 3D Camera / Player State
  // Camera position in virtual room: X, Z, Height (Y)
  const [cameraPos, setCameraPos] = useState<{ x: number; z: number }>({ x: 0, z: -50 });
  const [cameraAngle, setCameraAngle] = useState<number>(0); // Yaw angle in radians (0 = looking towards +Z)
  const [pitchAngle, setPitchAngle] = useState<number>(0); // Pitch in radians (-0.5 to 0.5)

  // Interaction State
  const [selectedExhibit, setSelectedExhibit] = useState<ExhibitItem | null>(null);
  const [hoveredExhibit, setHoveredExhibit] = useState<{
    exhibit: ExhibitItem;
    screenX: number;
    screenY: number;
    distance: number;
  } | null>(null);

  // 3D Model Part Inspection State (Hotspot hover & click)
  const [selectedPart, setSelectedPart] = useState<ExhibitPart | null>(null);
  const [hoveredPartInModel, setHoveredPartInModel] = useState<ExhibitPart | null>(null);
  const [modelZoom, setModelZoom] = useState<number>(1);
  const [showAllPartPins, setShowAllPartPins] = useState<boolean>(true);

  const [isAutoTour, setIsAutoTour] = useState<boolean>(false);
  const [autoTourIndex, setAutoTourIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isControlsHelpOpen, setIsControlsHelpOpen] = useState<boolean>(false);
  const [turntableRotation, setTurntableRotation] = useState<number>(0);
  const [isDraggingTurntable, setIsDraggingTurntable] = useState<boolean>(false);
  const [speechSynthesisActive, setSpeechSynthesisActive] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingCanvasRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const keysPressedRef = useRef<{ [key: string]: boolean }>({});

  // Filtered Exhibits
  const filteredExhibits = useMemo(() => {
    return HCM_EXHIBITS.filter((item) => {
      const matchCat = activeCategoryFilter === 'ALL' || item.category === activeCategoryFilter;
      const matchSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategoryFilter, searchQuery]);

  // Handle Teleport to Exhibit
  const handleTeleportTo = useCallback((exhibit: ExhibitItem) => {
    // Position camera slightly in front of the exhibit facing it
    const targetX = exhibit.x;
    const targetZ = exhibit.z - 55;
    setCameraPos({ x: targetX, z: targetZ });
    // Face directly towards exhibit (+Z relative)
    const angle = Math.atan2(exhibit.x - targetX, exhibit.z - targetZ);
    setCameraAngle(angle);
    setSelectedExhibit(exhibit);
    setSelectedPart(null);
    setHoveredPartInModel(null);
    setModelZoom(1);
    setTurntableRotation(0);
  }, []);

  // Keyboard navigation loop
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current[e.code] = true;

      // Quick hotkeys
      if (e.code === 'Escape') {
        if (selectedExhibit) {
          setSelectedExhibit(null);
        } else {
          onClose();
        }
      }
      if (e.code === 'KeyH') {
        setIsControlsHelpOpen((prev) => !prev);
      }
      if (e.code === 'KeyT') {
        setIsAutoTour((prev) => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, selectedExhibit, onClose]);

  // Animation Loop for Walking & Smooth Movement
  useEffect(() => {
    if (!isOpen) return;

    let animFrameId: number;

    const updateLoop = () => {
      const keys = keysPressedRef.current;
      const speed = 2.4;
      const rotSpeed = 0.035;

      let dx = 0;
      let dz = 0;
      let dAngle = 0;

      // Forward / Back (W / S or ArrowUp / ArrowDown)
      if (keys['KeyW'] || keys['ArrowUp']) {
        dx += Math.sin(cameraAngle) * speed;
        dz += Math.cos(cameraAngle) * speed;
      }
      if (keys['KeyS'] || keys['ArrowDown']) {
        dx -= Math.sin(cameraAngle) * speed;
        dz -= Math.cos(cameraAngle) * speed;
      }

      // Strafe Left / Right (A / D)
      if (keys['KeyA']) {
        dx -= Math.cos(cameraAngle) * speed;
        dz += Math.sin(cameraAngle) * speed;
      }
      if (keys['KeyD']) {
        dx += Math.cos(cameraAngle) * speed;
        dz -= Math.sin(cameraAngle) * speed;
      }

      // Rotate with ArrowLeft / ArrowRight
      if (keys['ArrowLeft'] || keys['KeyQ']) {
        dAngle -= rotSpeed;
      }
      if (keys['ArrowRight'] || keys['KeyE']) {
        dAngle += rotSpeed;
      }

      if (dx !== 0 || dz !== 0) {
        setCameraPos((prev) => {
          // Boundary clamping: -190 to 190
          const nextX = Math.max(-190, Math.min(190, prev.x + dx));
          const nextZ = Math.max(-190, Math.min(190, prev.z + dz));
          return { x: nextX, z: nextZ };
        });
      }

      if (dAngle !== 0) {
        setCameraAngle((prev) => prev + dAngle);
      }

      animFrameId = requestAnimationFrame(updateLoop);
    };

    animFrameId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animFrameId);
  }, [isOpen, cameraAngle]);

  // Auto Tour Timer
  useEffect(() => {
    if (!isAutoTour || !isOpen) return;

    const timer = setInterval(() => {
      setAutoTourIndex((prev) => {
        const nextIdx = (prev + 1) % HCM_EXHIBITS.length;
        const nextExhibit = HCM_EXHIBITS[nextIdx];
        handleTeleportTo(nextExhibit);
        return nextIdx;
      });
    }, 8000);

    return () => clearInterval(timer);
  }, [isAutoTour, isOpen, handleTeleportTo]);

  // Canvas 3D Perspective Renderer
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let renderFrameId: number;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
      const height = (canvas.height = canvas.parentElement?.clientHeight || 600);

      const fov = 340; // Field of view focal length
      const centerX = width / 2;
      const centerY = height / 2 + pitchAngle * 200;

      // Background gradient representing prestigious cultural room atmosphere
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#1a0b0b'); // Dark mahogany red
      bgGrad.addColorStop(0.4, '#261111');
      bgGrad.addColorStop(0.7, '#1c1313');
      bgGrad.addColorStop(1, '#0e0909'); // Deep warm wood tone floor
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Horizon & Floor Grid
      ctx.save();

      // Ceiling Banner / Golden Cultural Arch
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(0, 0, width, 44);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('★ KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - PHƯỜNG CHÁNH HIỆP ★', width / 2, 28);

      // Floor rendering (Perspective lines)
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.12)';
      ctx.lineWidth = 1;

      // Project 3D floor tiles
      const roomSize = 220;
      const gridStep = 40;

      // Rotate point (x, z) around camera (camX, camZ) by -cameraAngle
      const project = (x3d: number, y3d: number, z3d: number) => {
        const relX = x3d - cameraPos.x;
        const relZ = z3d - cameraPos.z;

        // Apply Yaw rotation
        const rotX = relX * Math.cos(-cameraAngle) - relZ * Math.sin(-cameraAngle);
        const rotZ = relX * Math.sin(-cameraAngle) + relZ * Math.cos(-cameraAngle);

        if (rotZ <= 10) return null; // Behind camera or clipping plane

        const scale = fov / rotZ;
        const projX = centerX + rotX * scale;
        const projY = centerY - (y3d - 20) * scale;

        return { x: projX, y: projY, scale, distance: rotZ };
      };

      // Draw Floor grid lines
      for (let x = -roomSize; x <= roomSize; x += gridStep) {
        const p1 = project(x, -30, -roomSize);
        const p2 = project(x, -30, roomSize);
        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      for (let z = -roomSize; z <= roomSize; z += gridStep) {
        const p1 = project(-roomSize, -30, z);
        const p2 = project(roomSize, -30, z);
        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Draw 4 Room Walls (Decorative panels)
      // North Wall Banner: "ĐOÀN KẾT, ĐOÀN KẾT, ĐẠI ĐOÀN KẾT"
      const nw1 = project(-160, 45, 200);
      const nw2 = project(160, 45, 200);
      const nw3 = project(160, -25, 200);
      const nw4 = project(-160, -25, 200);
      if (nw1 && nw2 && nw3 && nw4) {
        ctx.fillStyle = 'rgba(185, 28, 28, 0.45)';
        ctx.beginPath();
        ctx.moveTo(nw1.x, nw1.y);
        ctx.lineTo(nw2.x, nw2.y);
        ctx.lineTo(nw3.x, nw3.y);
        ctx.lineTo(nw4.x, nw4.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.stroke();

        ctx.fillStyle = '#fef08a';
        ctx.font = `bold ${Math.max(10, Math.floor(18 * nw1.scale))}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText('“Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công!”', (nw1.x + nw2.x) / 2, (nw1.y + nw3.y) / 2);
      }

      // Render Exhibits sorted by distance (Painter's algorithm: farthest first)
      const projectedExhibits = HCM_EXHIBITS.map((item) => {
        const proj = project(item.x, 0, item.z);
        return { item, proj };
      })
        .filter((e) => e.proj !== null)
        .sort((a, b) => (b.proj?.distance || 0) - (a.proj?.distance || 0));

      projectedExhibits.forEach(({ item, proj }) => {
        if (!proj) return;
        const { x, y, scale, distance } = proj;

        // Base Pedestal (Bục trưng bày)
        const baseWidth = Math.max(26, 75 * scale);
        const baseHeight = Math.max(30, 95 * scale);

        const isSelected = selectedExhibit?.id === item.id;
        const isHovered = hoveredExhibit?.exhibit.id === item.id;

        // Glow Aura on Hover or Selection
        if (isSelected || isHovered) {
          ctx.save();
          ctx.shadowColor = isSelected ? '#fbbf24' : '#60a5fa';
          ctx.shadowBlur = Math.max(12, 28 * scale);
        }

        // Pedestal shadow
        ctx.fillStyle = isHovered ? 'rgba(96, 165, 250, 0.4)' : 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.ellipse(x, y + baseHeight / 2 + 10 * scale, baseWidth * 0.75, baseWidth * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pedestal Body (Wood / Gold trimmed pedestal)
        const pedGrad = ctx.createLinearGradient(x - baseWidth / 2, y, x + baseWidth / 2, y);
        if (isSelected) {
          pedGrad.addColorStop(0, '#d97706');
          pedGrad.addColorStop(0.5, '#fef08a');
          pedGrad.addColorStop(1, '#b45309');
        } else if (isHovered) {
          pedGrad.addColorStop(0, '#1e3a8a');
          pedGrad.addColorStop(0.5, '#93c5fd');
          pedGrad.addColorStop(1, '#1e40af');
        } else {
          pedGrad.addColorStop(0, '#5f1616');
          pedGrad.addColorStop(0.5, '#881d1d');
          pedGrad.addColorStop(1, '#450a0a');
        }

        ctx.fillStyle = pedGrad;
        ctx.beginPath();
        ctx.roundRect(x - baseWidth / 2, y - baseHeight / 2, baseWidth, baseHeight, 6 * scale);
        ctx.fill();

        if (isSelected || isHovered) {
          ctx.restore();
        }

        ctx.strokeStyle = isSelected ? '#fbbf24' : isHovered ? '#60a5fa' : '#f59e0b';
        ctx.lineWidth = isSelected || isHovered ? Math.max(2, 4 * scale) : Math.max(1, 2.5 * scale);
        ctx.stroke();

        // Exhibit Symbol / Icon Iconography
        ctx.fillStyle = isSelected ? '#ffffff' : isHovered ? '#eff6ff' : '#fef08a';
        ctx.font = `bold ${Math.max(11, Math.floor(14 * scale))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(item.year, x, y - baseHeight * 0.15);

        // Golden / Blue Hotspot Beacon Pulsing above
        const beaconY = y - baseHeight / 2 - 28 * scale;
        const pulse = Math.sin(Date.now() / 250) * 4;

        ctx.fillStyle = isSelected ? '#fbbf24' : isHovered ? '#38bdf8' : 'rgba(239, 68, 68, 0.9)';
        ctx.beginPath();
        ctx.arc(x, beaconY + pulse, isHovered ? Math.max(7, 12 * scale) : Math.max(5, 9 * scale), 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = isHovered ? 2.5 : 1.5;
        ctx.stroke();

        // Label above hotspot
        if (distance < 190 || isHovered) {
          ctx.fillStyle = isHovered ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.85)';
          const textWidth = ctx.measureText(item.title).width + 18;
          ctx.roundRect(x - textWidth / 2, beaconY - 26 * scale, textWidth, 20 * scale, 4);
          ctx.fill();
          ctx.strokeStyle = isSelected ? '#fbbf24' : isHovered ? '#60a5fa' : 'rgba(255,255,255,0.2)';
          ctx.stroke();

          ctx.fillStyle = isSelected ? '#fde047' : isHovered ? '#93c5fd' : '#ffffff';
          ctx.font = `bold ${Math.max(9, Math.floor(10 * scale))}px sans-serif`;
          ctx.fillText(item.title, x, beaconY - 12 * scale);
        }
      });

      ctx.restore();

      renderFrameId = requestAnimationFrame(render);
    };

    renderFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(renderFrameId);
  }, [isOpen, cameraPos, cameraAngle, pitchAngle, selectedExhibit, hoveredExhibit]);

  // Mouse / Touch Drag Navigation on Canvas
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingCanvasRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDraggingCanvasRef.current) {
      const deltaX = e.clientX - lastMousePosRef.current.x;
      const deltaY = e.clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      // Update Yaw and Pitch
      setCameraAngle((prev) => prev + deltaX * 0.005);
      setPitchAngle((prev) => Math.max(-0.4, Math.min(0.4, prev - deltaY * 0.002)));
      return;
    }

    // Hit testing for hover tooltip when moving mouse freely
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const fov = 340;
    const centerX = width / 2;
    const centerY = height / 2 + pitchAngle * 200;

    let closestHover: { exhibit: ExhibitItem; screenX: number; screenY: number; distance: number } | null = null;
    let minDistance = 55; // Hover tolerance radius in px

    HCM_EXHIBITS.forEach((item) => {
      const relX = item.x - cameraPos.x;
      const relZ = item.z - cameraPos.z;
      const rotX = relX * Math.cos(-cameraAngle) - relZ * Math.sin(-cameraAngle);
      const rotZ = relX * Math.sin(-cameraAngle) + relZ * Math.cos(-cameraAngle);

      if (rotZ <= 10) return;
      const scale = fov / rotZ;
      const projX = centerX + rotX * scale;
      const projY = centerY - 20 * scale;

      const dist = Math.hypot(mouseX - projX, mouseY - projY);
      if (dist < minDistance) {
        minDistance = dist;
        closestHover = {
          exhibit: item,
          screenX: projX,
          screenY: projY,
          distance: rotZ
        };
      }
    });

    setHoveredExhibit(closestHover);
  };

  const handleCanvasMouseUp = () => {
    isDraggingCanvasRef.current = false;
  };

  // Click on Canvas to select nearest Exhibit
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const fov = 340;
    const centerX = width / 2;
    const centerY = height / 2 + pitchAngle * 200;

    let closest: ExhibitItem | null = null;
    let minDistance = 60; // Click tolerance in px

    HCM_EXHIBITS.forEach((item) => {
      const relX = item.x - cameraPos.x;
      const relZ = item.z - cameraPos.z;
      const rotX = relX * Math.cos(-cameraAngle) - relZ * Math.sin(-cameraAngle);
      const rotZ = relX * Math.sin(-cameraAngle) + relZ * Math.cos(-cameraAngle);

      if (rotZ <= 10) return;
      const scale = fov / rotZ;
      const projX = centerX + rotX * scale;
      const projY = centerY - 20 * scale;

      const dist = Math.hypot(clickX - projX, clickY - projY);
      if (dist < minDistance) {
        minDistance = dist;
        closest = item;
      }
    });

    if (closest) {
      handleTeleportTo(closest);
    }
  };

  // Touch Support
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      isDraggingCanvasRef.current = true;
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDraggingCanvasRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - lastMousePosRef.current.x;
    const deltaY = e.touches[0].clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    setCameraAngle((prev) => prev + deltaX * 0.007);
    setPitchAngle((prev) => Math.max(-0.4, Math.min(0.4, prev - deltaY * 0.003)));
  };

  const handleTouchEnd = () => {
    isDraggingCanvasRef.current = false;
  };

  // Text-To-Speech (Giọng đọc thuyết minh hiện vật)
  const handleToggleSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      if (speechSynthesisActive) {
        window.speechSynthesis.cancel();
        setSpeechSynthesisActive(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN';
        utterance.rate = audioSpeed;
        utterance.onend = () => setSpeechSynthesisActive(false);
        utterance.onerror = () => setSpeechSynthesisActive(false);
        window.speechSynthesis.speak(utterance);
        setSpeechSynthesisActive(true);
      }
    }
  };

  // Stop speech synthesis on unmount / change
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedExhibit]);

  // Handle Fullscreen Toggle
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 overflow-hidden select-none">
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full h-full max-w-7xl max-h-[96vh] bg-slate-950 border-2 border-amber-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
      >
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 border-b border-amber-500/30 px-4 py-3 flex items-center justify-between gap-3 shrink-0 relative z-20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 p-1.5 flex items-center justify-center shrink-0 shadow-md border-2 border-white/40">
              <Star className="w-full h-full text-red-700 fill-red-700" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-white tracking-wide uppercase truncate">
                  Không Gian Văn Hóa Hồ Chí Minh
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 shadow-xs">
                  <Sparkles className="w-3 h-3 text-slate-950" /> BẢO TÀNG SỐ 3D
                </span>
              </div>
              <p className="text-[11px] text-amber-200/90 font-medium truncate">
                Ủy ban MTTQ Việt Nam phường Chánh Hiệp • Tự hào truyền thống học tập và làm theo Bác
              </p>
            </div>
          </div>

          {/* Quick Actions & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Auto Tour Button */}
            <button
              onClick={() => setIsAutoTour(!isAutoTour)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isAutoTour
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-400/30'
              }`}
              title="Tự động dẫn đường tham quan lần lượt 8 hiện vật"
            >
              {isAutoTour ? <Pause className="w-3.5 h-3.5 fill-slate-950" /> : <Play className="w-3.5 h-3.5 fill-amber-200" />}
              <span className="hidden md:inline">{isAutoTour ? 'Dừng Tham quan' : 'Tham quan Tự động'}</span>
            </button>

            {/* Reset Camera to Center */}
            <button
              onClick={() => {
                setCameraPos({ x: 0, z: -50 });
                setCameraAngle(0);
                setPitchAngle(0);
                setSelectedExhibit(null);
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition cursor-pointer"
              title="Đặt lại góc nhìn chính diện"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Help / Controls Guide */}
            <button
              onClick={() => setIsControlsHelpOpen(!isControlsHelpOpen)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/30 transition cursor-pointer"
              title="Hướng dẫn di chuyển và xoay"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={handleToggleFullscreen}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition cursor-pointer"
              title="Toàn màn hình"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition cursor-pointer shadow-md"
              title="Đóng Không gian Văn hóa"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main 3D Space & Side Panel Area */}
        <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col md:flex-row">
          {/* Canvas 3D Space Viewport */}
          <div className="relative flex-1 w-full h-full bg-slate-950 overflow-hidden">
            <canvas
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={() => setHoveredExhibit(null)}
              onClick={handleCanvasClick}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`w-full h-full block ${hoveredExhibit ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'}`}
            />

            {/* Hover Tooltip Overlay when mouse hovers an exhibit in the 3D room */}
            <AnimatePresence>
              {hoveredExhibit && !isDraggingCanvasRef.current && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    left: `${Math.max(16, Math.min(hoveredExhibit.screenX - 145, (canvasRef.current?.parentElement?.clientWidth || 800) - 310))}px`,
                    top: `${Math.max(65, hoveredExhibit.screenY - 170)}px`
                  }}
                  className="absolute z-40 w-76 pointer-events-auto bg-slate-900/95 backdrop-blur-xl border-2 border-amber-400/70 rounded-2xl p-3.5 shadow-2xl text-slate-100 ring-1 ring-white/10"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                      {hoveredExhibit.exhibit.category}
                    </span>
                    <span className="text-[10px] font-bold text-amber-200 bg-white/10 px-2 py-0.5 rounded">
                      {hoveredExhibit.exhibit.year}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-white leading-snug mb-1">
                    {hoveredExhibit.exhibit.title}
                  </h4>

                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-2.5">
                    {hoveredExhibit.exhibit.description}
                  </p>

                  {/* Hotspot parts teaser */}
                  {hoveredExhibit.exhibit.parts && hoveredExhibit.exhibit.parts.length > 0 && (
                    <div className="mb-2.5 pt-2 border-t border-slate-800/80">
                      <div className="text-[10px] font-bold text-amber-300/90 mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3 text-amber-400" />
                          <span>Mô hình gồm {hoveredExhibit.exhibit.parts.length} cấu phần chi tiết:</span>
                        </span>
                        <span className="text-[9px] text-cyan-400 font-normal">Tương tác 3D</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {hoveredExhibit.exhibit.parts.slice(0, 3).map((p) => (
                          <span
                            key={p.id}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/90 border border-slate-700/80 text-slate-300 truncate max-w-[200px]"
                          >
                            • {p.name}
                          </span>
                        ))}
                        {hoveredExhibit.exhibit.parts.length > 3 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                            +{hoveredExhibit.exhibit.parts.length - 3} phần khác
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleTeleportTo(hoveredExhibit.exhibit)}
                    className="w-full py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition active:scale-95"
                  >
                    <MousePointerClick className="w-3.5 h-3.5" />
                    <span>Click để mở chi tiết &amp; tương tác mô hình 3D</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Minimap Radar (Top Right) */}
            <div className="absolute top-3 right-3 z-30 bg-slate-900/85 backdrop-blur-md border border-amber-500/30 rounded-2xl p-2.5 shadow-xl">
              <div className="flex items-center justify-between text-[10px] font-black text-amber-300 mb-1.5 uppercase">
                <span className="flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" /> Sơ đồ không gian
                </span>
                <span className="text-[9px] text-slate-400">8 Vị trí</span>
              </div>
              <div className="relative w-28 h-28 bg-red-950/60 rounded-xl border border-red-800/50 flex items-center justify-center overflow-hidden">
                {/* 4 Walls labels */}
                <span className="absolute top-1 text-[8px] font-bold text-amber-400/80">BẮC (TƯỢNG BÁC)</span>
                <span className="absolute bottom-1 text-[8px] font-bold text-slate-400">NAM (CỬA VÀO)</span>

                {/* Exhibit Dots */}
                {HCM_EXHIBITS.map((item) => {
                  const mapX = 56 + (item.x / 200) * 44;
                  const mapY = 56 - (item.z / 200) * 44;
                  const isSel = selectedExhibit?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTeleportTo(item);
                      }}
                      style={{ left: `${mapX}px`, top: `${mapY}px` }}
                      className={`absolute w-2.5 h-2.5 -ml-1.25 -mt-1.25 rounded-full cursor-pointer transition-transform hover:scale-150 ${
                        isSel ? 'bg-amber-300 ring-2 ring-white scale-125' : 'bg-red-500'
                      }`}
                      title={item.title}
                    />
                  );
                })}

                {/* Player Marker with Heading Arrow */}
                <div
                  style={{
                    left: `${56 + (cameraPos.x / 200) * 44}px`,
                    top: `${56 - (cameraPos.z / 200) * 44}px`,
                    transform: `translate(-50%, -50%) rotate(${cameraAngle * (180 / Math.PI)}deg)`
                  }}
                  className="absolute w-4 h-4 pointer-events-none flex items-center justify-center"
                >
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-cyan-400 drop-shadow-md" />
                </div>
              </div>
            </div>

            {/* Virtual Direction Onscreen Controls for Mobile */}
            <div className="md:hidden absolute bottom-24 left-4 z-30 flex flex-col items-center gap-1 bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-lg">
              <button
                onMouseDown={() => { keysPressedRef.current['KeyW'] = true; }}
                onMouseUp={() => { keysPressedRef.current['KeyW'] = false; }}
                onTouchStart={() => { keysPressedRef.current['KeyW'] = true; }}
                onTouchEnd={() => { keysPressedRef.current['KeyW'] = false; }}
                className="w-10 h-10 rounded-xl bg-amber-500/20 active:bg-amber-500 text-amber-300 font-bold flex items-center justify-center text-sm"
              >
                ▲
              </button>
              <div className="flex gap-1">
                <button
                  onMouseDown={() => { keysPressedRef.current['KeyA'] = true; }}
                  onMouseUp={() => { keysPressedRef.current['KeyA'] = false; }}
                  onTouchStart={() => { keysPressedRef.current['KeyA'] = true; }}
                  onTouchEnd={() => { keysPressedRef.current['KeyA'] = false; }}
                  className="w-10 h-10 rounded-xl bg-amber-500/20 active:bg-amber-500 text-amber-300 font-bold flex items-center justify-center text-sm"
                >
                  ◄
                </button>
                <button
                  onMouseDown={() => { keysPressedRef.current['KeyS'] = true; }}
                  onMouseUp={() => { keysPressedRef.current['KeyS'] = false; }}
                  onTouchStart={() => { keysPressedRef.current['KeyS'] = true; }}
                  onTouchEnd={() => { keysPressedRef.current['KeyS'] = false; }}
                  className="w-10 h-10 rounded-xl bg-amber-500/20 active:bg-amber-500 text-amber-300 font-bold flex items-center justify-center text-sm"
                >
                  ▼
                </button>
                <button
                  onMouseDown={() => { keysPressedRef.current['KeyD'] = true; }}
                  onMouseUp={() => { keysPressedRef.current['KeyD'] = false; }}
                  onTouchStart={() => { keysPressedRef.current['KeyD'] = true; }}
                  onTouchEnd={() => { keysPressedRef.current['KeyD'] = false; }}
                  className="w-10 h-10 rounded-xl bg-amber-500/20 active:bg-amber-500 text-amber-300 font-bold flex items-center justify-center text-sm"
                >
                  ►
                </button>
              </div>
            </div>

            {/* Quick Floating Instruction Overlay */}
            <div className="hidden lg:flex absolute bottom-20 left-4 z-20 items-center gap-2 bg-slate-900/75 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-[11px] text-slate-300 shadow-lg">
              <Move className="w-3.5 h-3.5 text-amber-400" />
              <span>Phím <b>W, A, S, D</b> để di chuyển • Giữ chuột kéo để xoay góc nhìn 360°</span>
            </div>
          </div>

          {/* Detailed Exhibit Inspection Panel (Right Drawer / Modal) */}
          <AnimatePresence>
            {selectedExhibit && (
              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full md:w-96 lg:w-[420px] bg-slate-900/95 backdrop-blur-xl border-l border-amber-500/30 flex flex-col z-30 shadow-2xl overflow-hidden shrink-0 h-full max-h-[88vh] md:max-h-full"
              >
                {/* Panel Header */}
                <div className="p-4 border-b border-slate-800 bg-red-950/40 flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                      {selectedExhibit.category}
                    </span>
                    <h3 className="text-sm font-black text-white leading-snug">
                      {selectedExhibit.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => setSelectedExhibit(null)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Panel Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-300">
                  {/* Interactive 3D Model Viewer with Hotspots & Tooltips */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-white font-black uppercase tracking-wide">Mô hình 3D &amp; Cấu phần</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setShowAllPartPins((prev) => !prev)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                            showAllPartPins
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                          title="Ẩn / hiện các điểm ghim cấu phần trên mô hình"
                        >
                          <Layers className="w-3 h-3" />
                          <span>{showAllPartPins ? 'Ẩn ghim' : 'Hiện ghim'}</span>
                        </button>
                      </div>
                    </div>

                    {/* 3D Stage Box */}
                    <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-slate-950 h-56 group select-none shadow-inner">
                      <img
                        src={selectedExhibit.imageUrl}
                        alt={selectedExhibit.title}
                        className="w-full h-full object-cover transition-transform duration-500"
                        style={{
                          filter: 'contrast(1.06)',
                          transform: `scale(${modelZoom}) rotateY(${turntableRotation}deg)`
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20 pointer-events-none" />

                      {/* Hotspot Pins overlaid on 3D Model */}
                      {showAllPartPins && selectedExhibit.parts && selectedExhibit.parts.map((part, pIdx) => {
                        const isPartSelected = selectedPart?.id === part.id;
                        const isPartHovered = hoveredPartInModel?.id === part.id;

                        return (
                          <div
                            key={part.id}
                            style={{
                              left: `${part.xPercent}%`,
                              top: `${part.yPercent}%`,
                              transform: 'translate(-50%, -50%)'
                            }}
                            className="absolute z-20"
                          >
                            {/* Hotspot Pin Button */}
                            <button
                              onMouseEnter={() => setHoveredPartInModel(part)}
                              onMouseLeave={() => setHoveredPartInModel(null)}
                              onClick={() => setSelectedPart(isPartSelected ? null : part)}
                              className={`relative w-7 h-7 rounded-full flex items-center justify-center font-black text-[11px] shadow-lg cursor-pointer transition-all duration-200 ${
                                isPartSelected
                                  ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300/80 scale-125'
                                  : isPartHovered
                                  ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-300/60 scale-115'
                                  : 'bg-red-600/90 text-white hover:bg-red-500 border border-white/60'
                              }`}
                              title={`Click để xem chi tiết: ${part.name}`}
                            >
                              {/* Pulsing beacon radar */}
                              <span className={`absolute -inset-1 rounded-full animate-ping opacity-60 pointer-events-none ${
                                isPartSelected ? 'bg-amber-400' : isPartHovered ? 'bg-cyan-400' : 'bg-red-500'
                              }`} />
                              <span className="relative z-10">{pIdx + 1}</span>
                            </button>

                            {/* Floating Tooltip for Hotspot */}
                            <AnimatePresence>
                              {isPartHovered && !isPartSelected && (
                                <motion.div
                                  initial={{ opacity: 0, y: 6, scale: 0.94 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.94 }}
                                  transition={{ duration: 0.15 }}
                                  style={{
                                    bottom: part.yPercent > 50 ? '34px' : 'auto',
                                    top: part.yPercent <= 50 ? '34px' : 'auto',
                                    left: part.xPercent > 65 ? '-180px' : part.xPercent < 35 ? '0px' : '-90px'
                                  }}
                                  className="absolute z-40 w-64 p-3 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-amber-400/70 shadow-2xl text-slate-100 pointer-events-none ring-1 ring-white/10"
                                >
                                  <div className="flex items-center justify-between gap-1.5 mb-1">
                                    <span className="text-[9px] font-black uppercase text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                                      {part.typeLabel}
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-bold">Điểm #{pIdx + 1}</span>
                                  </div>

                                  <div className="text-xs font-black text-white leading-snug mb-1">
                                    {part.name}
                                  </div>

                                  <div className="text-[11px] text-slate-300 leading-relaxed mb-1.5 line-clamp-3">
                                    {part.shortSummary}
                                  </div>

                                  {part.material && (
                                    <div className="text-[10px] text-amber-200/90 font-medium mb-1">
                                      Chất liệu: <span className="text-slate-200">{part.material}</span>
                                    </div>
                                  )}

                                  <div className="text-[9px] font-bold text-cyan-300 pt-1 border-t border-slate-800 flex items-center gap-1">
                                    <MousePointerClick className="w-3 h-3 text-cyan-300" />
                                    <span>Click để mở thẻ thông tin chi tiết đầy đủ</span>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}

                      {/* Top Info Badges */}
                      <div className="absolute top-2.5 left-3 flex items-center gap-1.5 text-[10px] font-black text-amber-300 pointer-events-none">
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/20">
                          Năm {selectedExhibit.year}
                        </span>
                        {selectedExhibit.parts && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/30 text-amber-200 backdrop-blur-md border border-amber-400/30">
                            {selectedExhibit.parts.length} cấu phần tương tác
                          </span>
                        )}
                      </div>

                      {/* Top Right Tool controls: Zoom & Rotate */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/65 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-md">
                        <button
                          onClick={() => setTurntableRotation((prev) => prev - 45)}
                          className="p-1 rounded-lg hover:bg-white/20 text-amber-300 transition cursor-pointer"
                          title="Xoay trái 45°"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setTurntableRotation((prev) => prev + 45)}
                          className="p-1 rounded-lg hover:bg-white/20 text-amber-300 transition cursor-pointer"
                          title="Xoay phải 45°"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-px h-3.5 bg-white/20 mx-0.5" />
                        <button
                          onClick={() => setModelZoom((prev) => Math.min(1.8, prev + 0.2))}
                          className="p-1 rounded-lg hover:bg-white/20 text-amber-300 transition cursor-pointer"
                          title="Phóng to"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setModelZoom((prev) => Math.max(0.8, prev - 0.2))}
                          className="p-1 rounded-lg hover:bg-white/20 text-amber-300 transition cursor-pointer"
                          title="Thu nhỏ"
                        >
                          <ZoomOut className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setModelZoom(1);
                            setTurntableRotation(0);
                          }}
                          className="p-1 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
                          title="Đặt lại góc xoay và độ phóng to"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Bottom Instruction Bar */}
                      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-bold text-amber-200 pointer-events-none">
                        <span className="flex items-center gap-1">
                          <MousePointerClick className="w-3 h-3 text-amber-300" />
                          Rê chuột vào các ghim (1, 2, 3...) để xem tooltip
                        </span>
                        <span className="flex items-center gap-1 text-slate-300 text-[9px]">
                          <RotateCw className="w-3 h-3" /> Xoay 360°
                        </span>
                      </div>
                    </div>

                    {/* Part Chips Bar (Quick Selector) */}
                    {selectedExhibit.parts && selectedExhibit.parts.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                          <span>Chọn cấu phần để xem chi tiết ({selectedExhibit.parts.length}):</span>
                          {selectedPart && (
                            <button
                              onClick={() => setSelectedPart(null)}
                              className="text-amber-400 hover:underline cursor-pointer"
                            >
                              Bỏ chọn
                            </button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedExhibit.parts.map((part, pIdx) => {
                            const isPartSel = selectedPart?.id === part.id;
                            return (
                              <button
                                key={part.id}
                                onClick={() => setSelectedPart(isPartSel ? null : part)}
                                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition cursor-pointer text-left ${
                                  isPartSel
                                    ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-1 ring-white'
                                    : 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 border border-slate-700/80'
                                }`}
                              >
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${
                                  isPartSel ? 'bg-slate-950 text-amber-300' : 'bg-red-950 text-amber-300'
                                }`}>
                                  {pIdx + 1}
                                </span>
                                <span className="truncate max-w-[140px]">{part.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Expanded Detailed Part Card when clicked */}
                    <AnimatePresence>
                      {selectedPart && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="p-3.5 rounded-2xl bg-amber-500/10 border-2 border-amber-400/60 shadow-lg space-y-2.5 overflow-hidden"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/30">
                                {selectedPart.typeLabel}
                              </span>
                              <h4 className="text-xs font-black text-white leading-snug pt-1">
                                {selectedPart.name}
                              </h4>
                            </div>
                            <button
                              onClick={() => setSelectedPart(null)}
                              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
                              title="Đóng chi tiết cấu phần"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Quick specs pill grid */}
                          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                            {selectedPart.material && (
                              <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
                                <span className="text-slate-400 block text-[9px]">Chất liệu:</span>
                                <span className="text-amber-200 font-bold">{selectedPart.material}</span>
                              </div>
                            )}
                            {selectedPart.dimensions && (
                              <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
                                <span className="text-slate-400 block text-[9px]">Kích thước / Quy cách:</span>
                                <span className="text-slate-200 font-bold">{selectedPart.dimensions}</span>
                              </div>
                            )}
                          </div>

                          {/* Short summary */}
                          <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                            {selectedPart.shortSummary}
                          </p>

                          {/* Significance */}
                          <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/40 text-[11px] space-y-1">
                            <div className="text-[10px] font-black uppercase text-amber-300 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-400" />
                              <span>Ý nghĩa &amp; Giá trị lịch sử:</span>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                              {selectedPart.significance}
                            </p>
                          </div>

                          {/* Historical Note */}
                          {selectedPart.historicalNote && (
                            <div className="text-[10px] text-slate-400 italic">
                              <span className="font-bold text-amber-400/90 not-italic">Tư liệu lưu trữ: </span>
                              {selectedPart.historicalNote}
                            </div>
                          )}

                          {/* Speech narration for this part */}
                          <button
                            onClick={() => handleToggleSpeech(`${selectedPart.name}. ${selectedPart.shortSummary}. ${selectedPart.significance}`)}
                            className="w-full py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition shadow-sm"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-slate-950" />
                            <span>Nghe thuyết minh phần này</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Famous Quote Card */}
                  {selectedExhibit.quote && (
                    <div className="bg-red-950/40 border-l-4 border-amber-400 p-3 rounded-r-2xl text-amber-200 italic font-serif leading-relaxed text-xs">
                      {selectedExhibit.quote}
                    </div>
                  )}

                  {/* Audio Narration Bar */}
                  <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-white">Thuyết minh hiện vật</div>
                        <div className="text-[9px] text-slate-400">Giọng đọc số hóa truyền cảm</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleSpeech(selectedExhibit.audioText)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition ${
                        speechSynthesisActive
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black'
                      }`}
                    >
                      {speechSynthesisActive ? <Pause className="w-3 h-3 fill-white" /> : <Play className="w-3 h-3 fill-slate-950" />}
                      <span>{speechSynthesisActive ? 'Dừng đọc' : 'Nghe đọc'}</span>
                    </button>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Mô tả &amp; Ý nghĩa lịch sử</h4>
                    <p className="text-slate-300 leading-relaxed">{selectedExhibit.description}</p>
                  </div>

                  {/* Key Details List */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Giá trị đối với Mặt trận &amp; Chánh Hiệp</h4>
                    <ul className="space-y-1.5">
                      {selectedExhibit.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                          <span className="leading-snug">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Local Connection */}
                  {selectedExhibit.localConnection && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 space-y-1">
                      <div className="text-[10px] font-black uppercase text-amber-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        Gắn kết địa phương
                      </div>
                      <p className="text-[11px] text-slate-300">{selectedExhibit.localConnection}</p>
                    </div>
                  )}

                  {/* Action Link to Digital Map */}
                  {onNavigateToMap && (
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToMap();
                        }}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition"
                      >
                        <Compass className="w-4 h-4" />
                        <span>Xem vị trí di tích trên Bản đồ số 21 Khu phố</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Horizontal Exhibits Selector Dock */}
        <div className="bg-slate-900/90 border-t border-slate-800 p-2.5 z-20 shrink-0">
          <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
            {/* Category Filter Pills */}
            <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto py-0.5">
              {['ALL', 'Tư liệu lịch sử', 'Hiện vật & Di tích', 'Tủ sách Bác Hồ', 'Ảnh tư liệu', 'Mô hình 3D'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer whitespace-nowrap ${
                    activeCategoryFilter === cat
                      ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'ALL' ? 'Tất cả 8 Vị trí' : cat}
                </button>
              ))}
            </div>

            {/* Horizontal Scroll of All Exhibits */}
            <div className="flex items-center gap-2 overflow-x-auto w-full py-1">
              {filteredExhibits.map((item, idx) => {
                const isSelected = selectedExhibit?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTeleportTo(item)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer text-left ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black'
                        : 'bg-slate-800/90 hover:bg-slate-800 text-slate-200 border-slate-700/80'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                      isSelected ? 'bg-slate-950 text-amber-300' : 'bg-red-950 text-amber-400 border border-amber-500/30'
                    }`}>
                      0{idx + 1}
                    </span>
                    <div className="min-w-0 max-w-[140px] truncate">
                      <div className="text-[11px] font-bold truncate">{item.title}</div>
                      <div className={`text-[9px] truncate ${isSelected ? 'text-slate-800' : 'text-slate-400'}`}>{item.year}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Controls Help Modal */}
        <AnimatePresence>
          {isControlsHelpOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-slate-100"
              >
                <button
                  onClick={() => setIsControlsHelpOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Hướng Dẫn Khám Phá 3D</h3>
                    <p className="text-xs text-slate-400">Cách di chuyển &amp; tương tác với hiện vật</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 pt-2">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                    <span className="font-bold">Di chuyển trong phòng:</span>
                    <span className="font-mono bg-slate-900 px-2 py-1 rounded text-amber-300 border border-slate-700">W, A, S, D hoặc Mũi tên</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                    <span className="font-bold">Xoay quan sát 360°:</span>
                    <span className="text-slate-300">Giữ chuột kéo hoặc vuốt ngón tay</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                    <span className="font-bold">Xem hiện vật chi tiết:</span>
                    <span className="text-amber-300 font-medium">Click vào bục trưng bày / hotspot</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                    <span className="font-bold">Tham quan tự động:</span>
                    <span className="text-emerald-400 font-medium">Bấm nút "Tham quan Tự động"</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsControlsHelpOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer shadow-md transition"
                  >
                    Đã hiểu, bắt đầu khám phá
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
