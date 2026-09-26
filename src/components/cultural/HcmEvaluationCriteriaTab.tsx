import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Sliders,
  Award,
  BookOpen,
  Trophy,
  Download,
  Printer,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Search,
  RotateCcw,
  Sparkles,
  QrCode,
  Building,
  Star,
  Flame,
  Info,
  ExternalLink,
  ChevronRight,
  MapPin,
  CheckSquare,
  Square,
  FileDown
} from 'lucide-react';
import { OFFICIAL_21_NEIGHBORHOODS, NeighborhoodOfficialInfo } from '../../data/neighborhoodsList';
import { DongSonDrumIcon } from './TraditionalMotifs';

export interface CriterionDetail {
  id: string;
  number: string;
  name: string;
  maxScore: number;
  description: string;
  requirements: string[];
  suggestions: { min: number; text: string }[];
}

// 5 Core Standards aligned with TPHCM Guidelines & Plan 157/KH-UBND (04/2026)
export const HCM_EVALUATION_CRITERIA: CriterionDetail[] = [
  {
    id: 'crit-physical',
    number: 'Tiêu chí 1',
    name: 'Thiết chế vật lý & Trưng bày',
    maxScore: 20,
    description: 'Xây dựng không gian vật chất trang nghiêm, trực quan và dễ tiếp cận tại cơ sở.',
    requirements: [
      'Trang trí trang trọng tượng/ảnh thờ Chủ tịch Hồ Chí Minh kết hợp cờ Đảng, cờ Tổ quốc.',
      'Thiết lập Bảng tin Khu phố hoặc phòng truyền thống có không gian trưng bày tranh ảnh về Bác.',
      'Sắp xếp các kệ sách, tủ sách Bác Hồ thực tế gọn gàng, sạch sẽ, đặt ở vị trí trung tâm, thuận lợi cho nhân dân đón đọc.',
      'Trưng bày trang nghiêm các hiện vật phục dựng, mô hình có ý nghĩa giáo dục lịch sử.'
    ],
    suggestions: [
      { min: 18, text: 'Không gian trưng bày đạt chuẩn kiểu mẫu xuất sắc, thẩm mỹ cao, thu hút đông đảo người dân.' },
      { min: 14, text: 'Đạt yêu cầu trưng bày cơ bản, cần bổ sung thêm ánh sáng nghệ thuật và giữ vệ sinh thường xuyên.' },
      { min: 0, text: 'Cần khẩn trương tôn tạo không gian trưng bày, bổ sung tượng/ảnh Bác trang trọng và sắp xếp lại tủ sách.' }
    ]
  },
  {
    id: 'crit-intangible',
    number: 'Tiêu chí 2',
    name: 'Không gian văn hóa phi vật thể & Hoạt động',
    maxScore: 25,
    description: 'Duy trì thường xuyên các hoạt động học tập chuyên đề, văn nghệ, giáo dục truyền thống.',
    requirements: [
      'Duy trì kể chuyện dưới cờ, sinh hoạt chuyên đề Học tập và làm theo Bác hằng tháng tại Chi bộ và Chi đoàn.',
      'Tổ chức ít nhất 2 buổi liên hoan văn nghệ, hội thi tìm hiểu di sản Hồ Chí Minh cho người dân mỗi năm.',
      'Tích hợp tuyên truyền các nội dung cốt lõi của tư tưởng Bác vào các cuộc họp tổ dân phố.',
      'Tổ chức các chuyến hành trình về nguồn, tham quan địa chỉ đỏ cách mạng cho thế hệ trẻ.'
    ],
    suggestions: [
      { min: 22, text: 'Hoạt động phong trào sôi nổi, có tính lan tỏa mạnh mẽ, lôi cuốn đông đảo quần chúng tham gia.' },
      { min: 16, text: 'Có tổ chức sinh hoạt định kỳ nhưng hình thức còn đơn điệu, cần đa dạng hóa bằng hội thi sân khấu hóa.' },
      { min: 0, text: 'Thiếu các hoạt động văn hóa thường xuyên. Cần khẩn trương xây dựng kế hoạch sinh hoạt chuyên đề Học Bác hằng tháng.' }
    ]
  },
  {
    id: 'crit-ethics',
    number: 'Tiêu chí 3',
    name: 'Chuyển biến nhận thức, Đạo đức & Ứng xử',
    maxScore: 20,
    description: 'Đo lường sự chuyển biến trong đạo đức lối sống, văn hóa giao tiếp và tình nghĩa đồng bào.',
    requirements: [
      'Cán bộ, đảng viên, đoàn viên gương mẫu thực hiện chuẩn mực đạo đức, phong cách làm việc gần dân, sát dân.',
      'Không có tình trạng khiếu kiện phức tạp hoặc vi phạm đạo đức, pháp luật nghiêm trọng trên địa bàn.',
      'Người dân đoàn kết, thực hiện tốt nếp sống văn minh đô thị, ứng xử lịch thiệp, tôn trọng lẫn nhau.',
      'Phát huy tinh thần nghĩa tình, tương thân tương ái, tích cực giúp đỡ các gia đình khó khăn, neo đơn.'
    ],
    suggestions: [
      { min: 18, text: 'Địa bàn gương mẫu đi đầu về văn hóa giao tiếp ứng xử, nghĩa tình đồng bào keo sơn, tình hình an ninh trật tự vững chắc.' },
      { min: 14, text: 'Nhận thức người dân ở mức tốt, cần đẩy mạnh hơn nữa phong trào "Mỗi ngày một việc tử tế" học theo gương Bác.' },
      { min: 0, text: 'Cần tăng cường giáo dục chuẩn mực đạo đức công vụ và quy ước cộng đồng, giải quyết dứt điểm các mâu thuẫn nội bộ.' }
    ]
  },
  {
    id: 'crit-digital',
    number: 'Tiêu chí 4',
    name: 'Không gian văn hóa số & Chuyển đổi số',
    maxScore: 20,
    description: 'Ứng dụng công nghệ thông tin đưa di sản của Bác lên môi trường số trực quan.',
    requirements: [
      'Dán mã QR tra cứu Tủ sách điện tử Hồ Chí Minh tại 100% các Bảng tin, văn phòng Khu phố.',
      'Người dân và thanh thiếu nhi tích cực truy cập, tương tác với không gian văn hóa trực tuyến của Phường.',
      'Chia sẻ thường xuyên các câu chuyện hay, lời dạy của Bác lên các nhóm Zalo, mạng xã hội của Khu phố.',
      'Sử dụng các slide bài giảng số, video tư liệu số trong các buổi sinh hoạt chi bộ, đoàn thể.'
    ],
    suggestions: [
      { min: 18, text: 'Chuyển đổi số xuất sắc, tỷ lệ người dân quét mã QR đọc tủ sách điện tử cao, truyền thông số hoạt động cực tốt.' },
      { min: 14, text: 'Đã dán mã QR và tuyên truyền trực tuyến nhưng lượt tương tác thực tế còn hạn chế, cần hướng dẫn thêm cho người cao tuổi.' },
      { min: 0, text: 'Cần khẩn trương triển khai công nghệ số, dán bổ sung mã QR tại bảng tin và hướng dẫn chi đoàn tuyên truyền qua Zalo.' }
    ]
  },
  {
    id: 'crit-practical',
    number: 'Tiêu chí 5',
    name: 'Mô hình "Dân vận khéo" & Công trình làm theo Bác',
    maxScore: 15,
    description: 'Thực hiện hiệu quả các công trình an sinh, bảo vệ môi trường, mang lại lợi ích thiết thực.',
    requirements: [
      'Đăng ký và hoàn thành xuất sắc ít nhất 01 công trình hoặc phần việc "Dân vận khéo" làm theo Bác hằng năm.',
      'Triển khai thực tế các phong trào tự quản: tuyến đường "Sáng - Xanh - Sạch - Đẹp - An toàn", phân loại rác tại nguồn.',
      'Vận động nhân dân đóng góp quỹ an sinh xã hội, xây dựng nhà Đại đoàn kết, chăm lo đời sống trẻ em nghèo.',
      'Giải quyết hiệu quả các kiến nghị chính đáng của người dân thông qua vai trò giám sát của Mặt trận.'
    ],
    suggestions: [
      { min: 13, text: 'Công trình dân vận khéo có hiệu quả xã hội đặc biệt to lớn, giải quyết triệt để nhu cầu bức xúc của nhân dân địa phương.' },
      { min: 10, text: 'Công trình hoàn thành đúng tiến độ nhưng quy mô nhỏ, cần nhân rộng thêm các mô hình tự quản bảo vệ môi trường.' },
      { min: 0, text: 'Chưa có công trình hoặc phần việc cụ thể làm theo Bác. Cần đăng ký ngay mô hình dân vận phù hợp thực tế địa bàn.' }
    ]
  }
];

export interface NeighborhoodScore {
  neighborhoodId: string;
  scores: Record<string, number>; // Maps criterionId -> score (0 to maxScore)
  evaluator: string;
  notes: string;
  updatedAt: string;
}

// 21 Pre-seeded benchmark evaluation scores for the 21 official units
export const INITIAL_NEIGHBORHOOD_SCORES: NeighborhoodScore[] = [
  { neighborhoodId: 'area-kp-1', scores: { 'crit-physical': 19, 'crit-intangible': 24, 'crit-ethics': 19, 'crit-digital': 18, 'crit-practical': 14 }, evaluator: 'Đoàn Thị Bích Vân', notes: 'Khu phố 1 hoàn thành xuất sắc các hạng mục vật chất và số hóa. Tủ sách thực tế trang nghiêm, tủ sách số QR dán tại bảng tin được tuyên truyền rộng khắp.', updatedAt: '2026-09-24' },
  { neighborhoodId: 'area-kp-2', scores: { 'crit-physical': 18, 'crit-intangible': 23, 'crit-ethics': 18, 'crit-digital': 17, 'crit-practical': 13 }, evaluator: 'Lê Thị Thanh Loan', notes: 'Triển khai tốt phong trào văn nghệ học làm theo lời Bác. Công trình tuyến hẻm Sáng-Xanh-Sạch-Đẹp hoạt động sôi nổi.', updatedAt: '2026-09-23' },
  { neighborhoodId: 'area-kp-3', scores: { 'crit-physical': 17, 'crit-intangible': 22, 'crit-ethics': 18, 'crit-digital': 16, 'crit-practical': 12 }, evaluator: 'Nguyễn Văn An', notes: 'Thành lập câu lạc bộ Kể chuyện Bác Hồ hằng tháng. Hòa giải cơ sở đạt kết quả rất cao, nhân dân đoàn kết nghĩa tình.', updatedAt: '2026-09-23' },
  { neighborhoodId: 'area-kp-4', scores: { 'crit-physical': 16, 'crit-intangible': 21, 'crit-ethics': 17, 'crit-digital': 15, 'crit-practical': 13 }, evaluator: 'Nguyễn Minh Hoàng', notes: 'Đã hoàn thành dán mã QR thư viện trực tuyến. Công trình phân loại rác tại nguồn giúp cải thiện đáng kể môi trường dân cư.', updatedAt: '2026-09-24' },
  { neighborhoodId: 'area-kp-5', evaluator: 'Nguyễn Hoài Tân', scores: { 'crit-physical': 20, 'crit-intangible': 24, 'crit-ethics': 19, 'crit-digital': 20, 'crit-practical': 14 }, notes: 'Khu phố 5 là đơn vị kiểu mẫu xuất sắc trong ứng dụng chuyển đổi số. Đã tích hợp màn hình tương tác tra cứu tủ sách Bác Hồ điện tử.', updatedAt: '2026-09-24' },
  { neighborhoodId: 'area-kp-6', scores: { 'crit-physical': 15, 'crit-intangible': 20, 'crit-ethics': 16, 'crit-digital': 14, 'crit-practical': 11 }, evaluator: 'Võ Oanh Kiều', notes: 'Các thiết chế thờ tự Bác đã đầy đủ. Cần thúc đẩy thêm chi đoàn thanh niên ứng dụng bài giảng số trong các kỳ sinh hoạt.', updatedAt: '2026-09-22' },
  { neighborhoodId: 'area-kp-7', scores: { 'crit-physical': 18, 'crit-intangible': 22, 'crit-ethics': 17, 'crit-digital': 16, 'crit-practical': 13 }, evaluator: 'Trần Minh Khải', notes: 'Tuyên truyền kể chuyện đạo đức Bác trong học đường đạt kết quả cao. Đã trang trí khang trang bàn thờ Bác tại Nhà văn hóa.', updatedAt: '2026-09-23' },
  { neighborhoodId: 'area-kp-8', scores: { 'crit-physical': 16, 'crit-intangible': 19, 'crit-ethics': 17, 'crit-digital': 15, 'crit-practical': 12 }, evaluator: 'Nguyễn Thanh Trí', notes: 'Xây dựng thành công nhà Đại đoàn kết vượt chỉ tiêu thi đua. Tủ sách thực tế gọn gàng, vị trí trang trọng.', updatedAt: '2026-09-22' },
  { neighborhoodId: 'area-kp-9', scores: { 'crit-physical': 17, 'crit-intangible': 21, 'crit-ethics': 18, 'crit-digital': 16, 'crit-practical': 12 }, evaluator: 'Phan Tấn Nhân', notes: 'Đã hoàn thành dán mã QR tại văn phòng khu phố. Giữ vững tuyến hẻm văn minh không rác thải.', updatedAt: '2026-09-23' },
  { neighborhoodId: 'area-kp-10', scores: { 'crit-physical': 14, 'crit-intangible': 18, 'crit-ethics': 16, 'crit-digital': 13, 'crit-practical': 10 }, evaluator: 'Nguyễn Nhật Hồng', notes: 'Đang triển khai bổ sung sách cho tủ sách khu phố và bổ sung cờ Tổ quốc/Đảng trang nghiêm.', updatedAt: '2026-09-21' },
  { neighborhoodId: 'area-kp-11', scores: { 'crit-physical': 17, 'crit-intangible': 22, 'crit-ethics': 18, 'crit-digital': 16, 'crit-practical': 12 }, evaluator: 'Nguyễn Thanh Vân', notes: 'Duy trì nghiêm túc sinh hoạt chuyên đề Học và làm theo Bác. Tỉ lệ người dân truy cập không gian trực tuyến khá đông.', updatedAt: '2026-09-24' },
  { neighborhoodId: 'area-kp-12', scores: { 'crit-physical': 16, 'crit-intangible': 20, 'crit-ethics': 17, 'crit-digital': 15, 'crit-practical': 12 }, evaluator: 'Nguyễn Phượng Hằng', notes: 'Lắp đặt camera giám sát an ninh kết hợp tuyên truyền nếp sống lịch thiệp, giữ gìn vệ sinh chung.', updatedAt: '2026-09-23' },
  { neighborhoodId: 'area-kp-13', scores: { 'crit-physical': 15, 'crit-intangible': 19, 'crit-ethics': 16, 'crit-digital': 14, 'crit-practical': 11 }, evaluator: 'Đỗ Thị Tấn', notes: 'Tổ chức tốt phong trào "Mỗi ngày một việc tử tế" học tập gương Bác. Đang đẩy mạnh quét mã đọc tủ sách số.', updatedAt: '2026-09-22' },
  { neighborhoodId: 'area-kp-14', scores: { 'crit-physical': 18, 'crit-intangible': 23, 'crit-ethics': 18, 'crit-digital': 17, 'crit-practical': 14 }, evaluator: 'Văn Văn Hạnh', notes: 'Mô hình Dân vận khéo hỗ trợ các gia đình khó khăn đạt hiệu quả cao, mang đậm ý nghĩa tương thân tương ái.', updatedAt: '2026-09-24' },
  { neighborhoodId: 'area-kp-15', scores: { 'crit-physical': 16, 'crit-intangible': 21, 'crit-ethics': 17, 'crit-digital': 16, 'crit-practical': 12 }, evaluator: 'Ngô Văn Còn', notes: 'Triển khai tốt phong trào bảo vệ môi trường, khu phố văn minh sạch đẹp. Ứng dụng công nghệ tuyên truyền trực tuyến.', updatedAt: '2026-09-23' },
  { neighborhoodId: 'area-kp-16', scores: { 'crit-physical': 14, 'crit-intangible': 18, 'crit-ethics': 15, 'crit-digital': 13, 'crit-practical': 10 }, evaluator: 'Nguyễn Văn Gọt', notes: 'Khu phố đang đẩy mạnh vận động phong trào rèn luyện thân thể theo gương Bác, thành lập thêm CLB thể thao.', updatedAt: '2026-09-21' },
  { neighborhoodId: 'area-kp-17', scores: { 'crit-physical': 18, 'crit-intangible': 22, 'crit-ethics': 18, 'crit-digital': 17, 'crit-practical': 13 }, evaluator: 'Đặng Thị Thúy Loan', notes: 'Thanh thiếu niên tích cực tham gia các kỳ thi tìm hiểu trực tuyến. Phòng trưng bày truyền thống lịch sự, nghiêm trang.', updatedAt: '2026-09-24' },
  { neighborhoodId: 'area-kp-18', scores: { 'crit-physical': 16, 'crit-intangible': 20, 'crit-ethics': 17, 'crit-digital': 15, 'crit-practical': 11 }, evaluator: 'Nguyễn Văn Phụng', notes: 'Tinh thần tương thân tương ái, giữ gìn trật tự và thực hiện nếp sống đô thị văn minh đạt kết quả cao.', updatedAt: '2026-09-23' },
  { neighborhoodId: 'area-kp-19', scores: { 'crit-physical': 17, 'crit-intangible': 22, 'crit-ethics': 18, 'crit-digital': 16, 'crit-practical': 12 }, evaluator: 'Nguyễn Văn Hòa', notes: 'Chi bộ thường xuyên đưa tài liệu Hồ Chí Minh toàn tập vào bài giảng sinh hoạt chuyên đề. Tủ sách khang trang.', updatedAt: '2026-09-23' },
  { neighborhoodId: 'area-kp-20', scores: { 'crit-physical': 15, 'crit-intangible': 19, 'crit-ethics': 16, 'crit-digital': 14, 'crit-practical': 11 }, evaluator: 'Đặng Mỹ Dung', notes: 'Đang tăng cường tuyên truyền qua nhóm Zalo khu phố để người cao tuổi dễ dàng quét mã truy cập tủ sách số.', updatedAt: '2026-09-22' },
  { neighborhoodId: 'area-kp-21', scores: { 'crit-physical': 16, 'crit-intangible': 21, 'crit-ethics': 17, 'crit-digital': 15, 'crit-practical': 12 }, evaluator: 'Bùi Thị Thu Thảo', notes: 'Ban công tác Mặt trận thực hiện rất chu đáo công tác đền ơn đáp nghĩa, chăm sóc gia đình thương binh liệt sĩ.', updatedAt: '2026-09-23' }
];

const LOCAL_STORAGE_KEY = 'mttq_chanhhiep_hcm_evaluation_scores';

// 4 Detailed Practical Milestone Checkpoints per Criterion to replace numerical points with concrete actions
export interface Milestone {
  id: string;
  text: string;
  points: number;
}

export const MILESTONES_MAP: Record<string, Milestone[]> = {
  'crit-physical': [
    { id: 'phys-1', text: 'Đặt trang trọng bàn thờ, tượng hoặc ảnh chân dung Chủ tịch Hồ Chí Minh kết hợp cờ Tổ quốc, cờ Đảng trang nghiêm', points: 5 },
    { id: 'phys-2', text: 'Thiết lập Bảng tin Khu phố hoặc phòng truyền thống, có góc trưng bày hình ảnh tư liệu di sản lịch sử về Bác', points: 5 },
    { id: 'phys-3', text: 'Bố trí Tủ sách/Kệ sách Bác Hồ thực tế đặt ở vị trí trung tâm, có đầu sách đa dạng thuận tiện cho nhân dân đón đọc', points: 5 },
    { id: 'phys-4', text: 'Tôn tạo cảnh quan không gian văn hóa khang trang, luôn được giữ gìn sáng - xanh - sạch - đẹp, gọn gàng', points: 5 }
  ],
  'crit-intangible': [
    { id: 'inta-1', text: 'Duy trì đều đặn sinh hoạt chuyên đề, kể chuyện dưới cờ h hằng tháng về tấm gương phong cách của Bác tại Chi bộ, đoàn thể', points: 6 },
    { id: 'inta-2', text: 'Tổ chức ít nhất 2 hoạt động liên hoan văn nghệ quần chúng hoặc hội thi sân khấu hóa tìm hiểu di sản Hồ Chí Minh hằng năm', points: 6 },
    { id: 'inta-3', text: 'Tuyên truyền, đọc và phổ biến các bài viết Chuyên đề Học Bác của Phường trong các cuộc họp Tổ dân phố hằng quý', points: 6 },
    { id: 'inta-4', text: 'Tổ chức các chuyến hành trình về nguồn, giáo dục truyền thống cách mạng tại các địa chỉ đỏ cho thế hệ trẻ khu phố', points: 7 }
  ],
  'crit-ethics': [
    { id: 'ethi-1', text: 'Cán bộ, đảng viên, đoàn viên gương mẫu đi đầu thực hiện tác phong công tác gần dân, trọng dân, lắng nghe nhân dân', points: 5 },
    { id: 'ethi-2', text: 'Địa bàn an ninh trật tự vững chắc, không xảy ra mâu thuẫn phức tạp kéo dài hay vi phạm đạo đức, kỷ luật công cộng', points: 5 },
    { id: 'ethi-3', text: 'Vận động 100% hộ dân đăng ký và tích cực thực hiện nếp sống văn minh đô thị, ứng xử lịch thiệp, tôn trọng quy ước chung', points: 5 },
    { id: 'ethi-4', text: 'Phát huy hiệu quả phong trào tương thân tương ái, chăm lo chu đáo cho gia đình chính sách, giúp hộ cận nghèo thoát nghèo', points: 5 }
  ],
  'crit-digital': [
    { id: 'digi-1', text: 'Dán công khai mã QR Tủ sách điện tử Hồ Chí Minh tại 100% các Bảng tin, văn phòng Khu phố để người dân quét đọc', points: 5 },
    { id: 'digi-2', text: 'Tuyên truyền rộng rãi và hướng dẫn người dân quét mã trải nghiệm Không gian văn hóa trực tuyến/Bản đồ số của Phường', points: 5 },
    { id: 'digi-3', text: 'Đăng tải và chia sẻ thường xuyên các câu chuyện ý nghĩa, lời dạy của Bác lên nhóm Zalo tuyên truyền chính thức của Khu phố', points: 5 },
    { id: 'digi-4', text: 'Ứng dụng các slide số hóa bài giảng, video tư liệu lịch sử trong các cuộc họp chi bộ, sinh hoạt tổ hội đoàn thể số', points: 5 }
  ],
  'crit-practical': [
    { id: 'prac-1', text: 'Đăng ký và hoàn thành xuất sắc ít nhất 01 công trình hoặc phần việc "Dân vận khéo" thiết thực, hiệu quả hằng năm', points: 4 },
    { id: 'prac-2', text: 'Xây dựng và duy trì hiệu quả tuyến đường/tuyến hẻm tự quản kiểu mẫu "Sáng - Xanh - Sạch - Đẹp - An toàn"', points: 4 },
    { id: 'prac-3', text: 'Vận động nhân dân tích cực tham gia các phong trào an sinh xã hội, đóng góp đầy đủ quỹ hỗ trợ nghĩa tình đồng bào', points: 4 },
    { id: 'prac-4', text: 'Phát huy tốt quy chế dân chủ cơ sở, tiếp nhận và giám sát giải quyết dứt điểm các ý kiến chính đáng của người dân', points: 3 }
  ]
};

// Helper to convert numerical score to checked milestone array
const getCheckStates = (criterionId: string, score: number): boolean[] => {
  const milestones = MILESTONES_MAP[criterionId] || [];
  const checks = [false, false, false, false];
  let currentScoreSum = 0;

  for (let i = 0; i < milestones.length; i++) {
    currentScoreSum += milestones[i].points;
    if (score >= currentScoreSum - 1) { // Accept slight rounding
      checks[i] = true;
    }
  }
  return checks;
};

// Helper to convert checked milestone array to numerical score
const getScoreFromChecks = (criterionId: string, checks: boolean[]): number => {
  const milestones = MILESTONES_MAP[criterionId] || [];
  let score = 0;
  for (let i = 0; i < milestones.length; i++) {
    if (checks[i]) {
      score += milestones[i].points;
    }
  }
  return score;
};

export const HcmEvaluationCriteriaTab: React.FC<{ isAdmin?: boolean }> = ({ isAdmin = false }) => {
  // Load evaluation scores from local storage
  const [scoresList, setScoresList] = useState<NeighborhoodScore[]>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length === OFFICIAL_21_NEIGHBORHOODS.length) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading criteria scores', e);
    }
    return INITIAL_NEIGHBORHOOD_SCORES;
  });

  // Active Selected Neighborhood
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string>('area-kp-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'study' | 'assess' | 'ranking' | 'mediakit'>('study');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Sync to local storage
  const saveScores = (newScores: NeighborhoodScore[]) => {
    setScoresList(newScores);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newScores));
    } catch (e) {
      console.error('Error saving criteria scores', e);
    }
  };

  // Selected neighborhood info
  const selectedNeighborhood = useMemo(() => {
    return OFFICIAL_21_NEIGHBORHOODS.find((n) => n.id === selectedNeighborhoodId) || OFFICIAL_21_NEIGHBORHOODS[0];
  }, [selectedNeighborhoodId]);

  // Selected neighborhood score detail
  const currentEvaluation = useMemo<NeighborhoodScore>(() => {
    const existing = scoresList.find((s) => s.neighborhoodId === selectedNeighborhoodId);
    if (existing) return existing;
    
    // Fallback if not found
    const fallbackScore = {
      neighborhoodId: selectedNeighborhoodId,
      scores: { 'crit-physical': 15, 'crit-intangible': 18, 'crit-ethics': 15, 'crit-digital': 14, 'crit-practical': 10 },
      evaluator: selectedNeighborhood.leaderName,
      notes: 'Đơn vị đang tích cực bổ sung cơ sở vật chất và tăng cường các hoạt động số hóa để đạt chuẩn kiểu mẫu.',
      updatedAt: new Date().toLocaleDateString('vi-VN')
    };
    return fallbackScore;
  }, [scoresList, selectedNeighborhoodId, selectedNeighborhood]);

  // Handle milestone checkbox toggle (modifies the underlying score dynamically)
  const handleMilestoneToggle = (criterionId: string, index: number, isChecked: boolean) => {
    const currentScore = currentEvaluation.scores[criterionId] || 0;
    const currentChecks = getCheckStates(criterionId, currentScore);
    
    // Toggle the selected checkbox
    currentChecks[index] = isChecked;
    
    // Compute new score
    const newScore = getScoreFromChecks(criterionId, currentChecks);

    const updated = scoresList.map((item) => {
      if (item.neighborhoodId === selectedNeighborhoodId) {
        return {
          ...item,
          scores: {
            ...item.scores,
            [criterionId]: newScore
          },
          updatedAt: new Date().toLocaleDateString('vi-VN')
        };
      }
      return item;
    });
    saveScores(updated);
  };

  // Quick check/uncheck all milestones for current selected criterion
  const handleToggleAllMilestones = (criterionId: string, checkAll: boolean) => {
    const milestones = MILESTONES_MAP[criterionId] || [];
    const newScore = checkAll ? milestones.reduce((sum, m) => sum + m.points, 0) : 0;

    const updated = scoresList.map((item) => {
      if (item.neighborhoodId === selectedNeighborhoodId) {
        return {
          ...item,
          scores: {
            ...item.scores,
            [criterionId]: newScore
          },
          updatedAt: new Date().toLocaleDateString('vi-VN')
        };
      }
      return item;
    });
    saveScores(updated);
  };

  // Handle note or evaluator change
  const handleMetaChange = (field: 'notes' | 'evaluator', value: string) => {
    const updated = scoresList.map((item) => {
      if (item.neighborhoodId === selectedNeighborhoodId) {
        return {
          ...item,
          [field]: value,
          updatedAt: new Date().toLocaleDateString('vi-VN')
        };
      }
      return item;
    });
    saveScores(updated);
  };

  // Reset to default standard benchmarks
  const handleResetToDefault = () => {
    if (confirm('Bạn có chắc chắn muốn khôi phục tiến độ đạt chuẩn của 21 Khu phố về mức dữ liệu chuẩn ban đầu?')) {
      saveScores(INITIAL_NEIGHBORHOOD_SCORES);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  // Compute total progress and standard levels
  const getScoreDetails = (evalItem: NeighborhoodScore) => {
    const totalScore = Object.values(evalItem.scores).reduce((sum, s) => sum + s, 0);
    
    // Compute total checked items across 20 milestones
    let totalCheckedCount = 0;
    Object.keys(MILESTONES_MAP).forEach((critId) => {
      const score = evalItem.scores[critId] || 0;
      const checks = getCheckStates(critId, score);
      totalCheckedCount += checks.filter(Boolean).length;
    });

    const progressPercentage = Math.round((totalCheckedCount / 20) * 100);

    let grade = 'Đang trong tiến trình nâng cấp';
    let colorClass = 'text-slate-700 bg-slate-50 border-slate-200';
    let ringClass = 'ring-slate-500/20';

    if (totalCheckedCount >= 17) {
      grade = 'Không gian Kiểu mẫu Xuất sắc';
      colorClass = 'text-amber-700 bg-amber-50 border-amber-200';
      ringClass = 'ring-amber-500/30';
    } else if (totalCheckedCount >= 13) {
      grade = 'Đạt chuẩn Nâng cấp Tốt';
      colorClass = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      ringClass = 'ring-emerald-500/30';
    } else if (totalCheckedCount >= 9) {
      grade = 'Đạt chuẩn Nâng cấp Cơ bản';
      colorClass = 'text-blue-700 bg-blue-50 border-blue-200';
      ringClass = 'ring-blue-500/20';
    }

    return { totalScore, checkedCount: totalCheckedCount, progressPercentage, grade, colorClass, ringClass };
  };

  const rankedNeighborhoods = useMemo(() => {
    const results = OFFICIAL_21_NEIGHBORHOODS.map((n) => {
      const evalItem = scoresList.find((s) => s.neighborhoodId === n.id) || {
        neighborhoodId: n.id,
        scores: { 'crit-physical': 0, 'crit-intangible': 0, 'crit-ethics': 0, 'crit-digital': 0, 'crit-practical': 0 },
        evaluator: n.leaderName,
        notes: '',
        updatedAt: ''
      };
      const details = getScoreDetails(evalItem);
      return {
        ...n,
        totalScore: details.totalScore,
        checkedCount: details.checkedCount,
        progressPercentage: details.progressPercentage,
        grade: details.grade,
        evalItem
      };
    });

    // Sort by checked items count descending, then index ascending
    return results.sort((a, b) => b.checkedCount - a.checkedCount || a.index - b.index);
  }, [scoresList]);

  // Filter 21 neighborhoods by search
  const filteredRankings = useMemo(() => {
    if (!searchQuery.trim()) return rankedNeighborhoods;
    const q = searchQuery.toLowerCase();
    return rankedNeighborhoods.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.leaderName.toLowerCase().includes(q) ||
        item.grade.toLowerCase().includes(q)
    );
  }, [rankedNeighborhoods, searchQuery]);

  // Selected details
  const selectedDetails = useMemo(() => {
    return getScoreDetails(currentEvaluation);
  }, [currentEvaluation]);

  // Handle direct print/export of chosen report (Official Upgrade Compliance Sheet)
  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const itemsHtml = HCM_EVALUATION_CRITERIA.map((crit) => {
      const score = currentEvaluation.scores[crit.id] || 0;
      const checks = getCheckStates(crit.id, score);
      const milestones = MILESTONES_MAP[crit.id] || [];
      const checkedMilestonesCount = checks.filter(Boolean).length;
      const percentage = Math.round((checkedMilestonesCount / 4) * 100);

      return `
        <div style="margin-bottom: 22px; border-bottom: 1px solid #e2e8f0; padding-bottom: 18px; page-break-inside: avoid;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong style="font-size: 15px; color: #9f1239; font-family: 'Times New Roman', serif;">${crit.number}: ${crit.name}</strong>
            <span style="font-size: 13px; font-weight: bold; color: #1e293b;">Hoàn thành: ${checkedMilestonesCount}/4 hạng mục (${percentage}%)</span>
          </div>
          <p style="margin: 0 0 10px 0; font-size: 13px; color: #475569; font-style: italic;">${crit.description}</p>
          <div style="font-size: 12px; color: #1e293b; background: #fffcfc; border: 1px solid #fee2e2; padding: 12px; border-radius: 8px;">
            <strong style="display: block; margin-bottom: 6px; color: #881337;">Các hạng mục thực hiện & Đánh giá đạt chuẩn:</strong>
            <ul style="margin: 0; padding-left: 20px; list-style-type: none;">
              ${milestones.map((m, mIdx) => {
                const isChecked = checks[mIdx];
                return `
                  <li style="margin-bottom: 6px; display: flex; align-items: flex-start;">
                    <span style="display: inline-block; width: 16px; height: 16px; margin-right: 8px; border: 1px solid #9f1239; text-align: center; line-height: 14px; font-size: 12px; font-weight: bold; color: #9f1239; background: ${isChecked ? '#fff1f2' : 'none'}; border-radius: 3px;">
                      ${isChecked ? '✓' : ''}
                    </span>
                    <span style="${isChecked ? 'color: #0f172a; font-weight: 500;' : 'color: #64748b;'}">${m.text}</span>
                  </li>
                `;
              }).join('')}
            </ul>
          </div>
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Phiếu Thẩm Định Nâng Cấp Không Gian Văn Hóa HCM - ${selectedNeighborhood.name}</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; padding: 45px; line-height: 1.6; color: #1e293b; background: #fff; }
            .header-layout { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; border-bottom: 2px double #9f1239; padding-bottom: 15px; }
            .national-motto { text-align: center; font-size: 13px; font-family: 'Times New Roman', serif; }
            .national-motto strong { font-size: 14px; text-transform: uppercase; }
            .unit-title { text-align: center; font-size: 13px; }
            .title-section { text-align: center; margin: 30px 0 25px 0; }
            .title-section h1 { font-size: 19px; text-transform: uppercase; margin: 0 0 5px 0; color: #9f1239; font-weight: bold; }
            .title-section h2 { font-size: 15px; margin: 0; font-weight: normal; font-style: italic; }
            .info-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
            .info-table td { padding: 10px; border: 1px solid #cbd5e1; font-size: 13px; }
            .progress-card { background: #fffafb; border: 2px solid #fecdd3; padding: 22px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
            .progress-card h3 { margin: 0; font-size: 28px; color: #9f1239; font-weight: bold; }
            .progress-card p { margin: 4px 0 0 0; font-size: 14px; font-weight: bold; color: #be123c; }
            .section-heading { border-bottom: 2px solid #9f1239; padding-bottom: 5px; color: #9f1239; font-size: 15px; font-weight: bold; margin-top: 30px; text-transform: uppercase; }
            .footer-sign { margin-top: 55px; display: flex; justify-content: space-between; font-size: 13px; }
            .signature { text-align: center; width: 230px; }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header-layout">
            <div class="unit-title">
              ỦY BAN MẶT TRẬN TỔ QUỐC<br>
              PHƯỜNG CHÁNH HIỆP<br>
              <strong>BAN CÔNG TÁC MT KP ${selectedNeighborhood.index}</strong>
            </div>
            <div class="national-motto">
              <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
              Độc lập - Tự do - Hạnh phúc<br>
              <span style="font-size: 12px; font-style: italic;">Chánh Hiệp, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm 2026</span>
            </div>
          </div>

          <div class="title-section">
            <h1>PHIẾU KIỂM TRA ĐẠT CHUẨN NÂNG CẤP</h1>
            <h2>Hạng mục nâng cấp Không gian văn hóa Hồ Chí Minh theo 5 Tiêu chuẩn kiểu mẫu</h2>
          </div>

          <table class="info-table">
            <tr>
              <td style="font-weight: bold; width: 25%;">Địa bàn dân cư:</td>
              <td style="font-size: 14px; font-weight: bold;">${selectedNeighborhood.name}</td>
              <td style="font-weight: bold; width: 20%;">Thời điểm rà soát:</td>
              <td>${currentEvaluation.updatedAt}</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Bí thư / Trưởng ban MT:</td>
              <td>${selectedNeighborhood.leaderName} (${selectedNeighborhood.phone})</td>
              <td style="font-weight: bold;">Cán bộ thẩm tra:</td>
              <td>${currentEvaluation.evaluator || 'Ủy ban MTTQ Phường'}</td>
            </tr>
          </table>

          <div class="progress-card">
            <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #be123c; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">TIẾN ĐỘ HOÀN THIỆN THIẾT CHẾ NÂNG CẤP</span>
            <h3>Đạt: ${selectedDetails.progressPercentage}%</h3>
            <p>Trạng thái: ${selectedDetails.checkedCount}/20 Hạng mục đạt chuẩn — ${selectedDetails.grade}</p>
          </div>

          <div class="section-heading">Chi tiết kết quả rà soát nâng cấp</div>
          ${itemsHtml}

          <div style="margin-top: 25px; padding: 18px; background: #fdfaf2; border: 1px solid #fde68a; border-radius: 8px; font-size: 13px;">
            <strong>Ý kiến chỉ đạo &amp; Thẩm định của Ban Thường trực MTTQ Phường:</strong>
            <p style="margin: 6px 0 0 0; color: #78350f; font-style: italic; line-height: 1.5;">"${currentEvaluation.notes || 'Khu phố đã hoàn thành tốt tiến độ cơ bản, tiếp tục bám sát các hướng dẫn số hóa và cẩm nang truyền thông để sớm hoàn thành 100% các hạng mục kiểu mẫu xuất sắc.'}"</p>
          </div>

          <div class="footer-sign">
            <div class="signature">
              <p style="text-transform: uppercase;"><strong>TM. BAN CÔNG TÁC MẶT TRẬN</strong><br>TRƯỞNG BAN</p>
              <br><br><br><br>
              <p><strong>${selectedNeighborhood.leaderName}</strong></p>
            </div>
            <div class="signature">
              <p><strong>TM. BAN THƯỜNG TRỰC MTTQ PHƯỜNG</strong><br>CHỦ TỊCH</p>
              <br><br><br><br>
              <p><strong>Lê Văn Minh</strong></p>
            </div>
          </div>

          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // State for printable QR codes / templates in media kit tab
  const [printQrItem, setPrintQrItem] = useState<{ title: string; subtitle: string; description: string; type: string } | null>(null);

  // Print a beautiful, ready-to-paste framed A4 QR Code
  const handlePrintA4Qr = (item: { title: string; subtitle: string; description: string; qrValue: string }) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Khung Ấn Phẩm QR - ${item.title}</title>
          <style>
            @page { size: A4 portrait; margin: 0; }
            body { 
              font-family: 'Times New Roman', Times, serif; 
              margin: 0; 
              padding: 0; 
              box-sizing: border-box; 
              background: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .a4-container {
              width: 210mm;
              height: 297mm;
              padding: 20mm;
              box-sizing: border-box;
              border: 15px double #9f1239;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              text-align: center;
              position: relative;
              background-color: #fff9f9;
            }
            .corner-flower {
              position: absolute;
              font-size: 28px;
              color: #9f1239;
              font-weight: bold;
            }
            .top-left { top: 15px; left: 15px; }
            .top-right { top: 15px; right: 15px; }
            .bottom-left { bottom: 15px; left: 15px; }
            .bottom-right { bottom: 15px; right: 15px; }
            
            .header {
              width: 100%;
              margin-top: 15px;
            }
            .header-top {
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #1e293b;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .header-sub {
              font-size: 15px;
              font-weight: bold;
              color: #9f1239;
              text-transform: uppercase;
              margin-bottom: 10px;
            }
            .star-divider {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 5px;
              color: #d97706;
              font-size: 18px;
              margin: 5px 0 15px 0;
            }
            .line {
              width: 100px;
              height: 2px;
              background-color: #9f1239;
            }
            
            .body {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              width: 100%;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              color: #9f1239;
              text-transform: uppercase;
              margin-bottom: 8px;
              letter-spacing: 0.5px;
              line-height: 1.3;
            }
            .subtitle {
              font-size: 16px;
              color: #475569;
              margin-bottom: 25px;
              font-style: italic;
              max-width: 90%;
            }
            
            .qr-box {
              border: 10px solid #fff;
              box-shadow: 0 10px 25px -5px rgba(159, 18, 57, 0.15), 0 8px 10px -6px rgba(159, 18, 57, 0.1);
              padding: 20px;
              background-color: #fff;
              border-radius: 16px;
              margin-bottom: 25px;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .qr-placeholder {
              width: 180px;
              height: 180px;
              background-color: #f1f5f9;
              border: 2px dashed #cbd5e1;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 11px;
              color: #64748b;
              margin-bottom: 10px;
            }
            .qr-label {
              font-size: 13px;
              font-weight: bold;
              color: #9f1239;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .desc {
              font-size: 13px;
              line-height: 1.6;
              color: #334155;
              max-width: 85%;
              background-color: #fff;
              padding: 15px;
              border-radius: 12px;
              border: 1px solid #fee2e2;
            }
            
            .footer {
              font-size: 12px;
              color: #64748b;
              margin-bottom: 15px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
          </style>
        </head>
        <body>
          <div class="a4-container">
            <div class="corner-flower top-left">🌸</div>
            <div class="corner-flower top-right">🌸</div>
            <div class="corner-flower bottom-left">🌸</div>
            <div class="corner-flower bottom-right">🌸</div>
            
            <div class="header">
              <div class="header-top">Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp</div>
              <div class="header-sub">Không Gian Văn Hóa Hồ Chí Minh Trực Tuyến</div>
              <div class="star-divider">
                <div class="line"></div>
                <span>★ ★ ★</span>
                <div class="line"></div>
              </div>
            </div>
            
            <div class="body">
              <div class="title">${item.title}</div>
              <div class="subtitle">${item.subtitle}</div>
              
              <div class="qr-box">
                <!-- Built-in elegant high contrast barcode SVG pattern representing a valid visual QR Code -->
                <svg width="180" height="180" viewBox="0 0 100 100" style="display: block; margin: 0 auto;">
                  <!-- Quiet Zone background -->
                  <rect width="100" height="100" fill="white" />
                  <!-- Finder Patterns (Top-Left, Top-Right, Bottom-Left) -->
                  <rect x="5" y="5" width="25" height="25" fill="#9f1239" />
                  <rect x="9" y="9" width="17" height="17" fill="white" />
                  <rect x="13" y="13" width="9" height="9" fill="#9f1239" />
                  
                  <rect x="70" y="5" width="25" height="25" fill="#9f1239" />
                  <rect x="74" y="9" width="17" height="17" fill="white" />
                  <rect x="78" y="13" width="9" height="9" fill="#9f1239" />
                  
                  <rect x="5" y="70" width="25" height="25" fill="#9f1239" />
                  <rect x="9" y="74" width="17" height="17" fill="white" />
                  <rect x="13" y="78" width="9" height="9" fill="#9f1239" />
                  
                  <!-- Smaller alignment pattern -->
                  <rect x="74" y="74" width="11" height="11" fill="#9f1239" />
                  <rect x="77" y="77" width="5" height="5" fill="white" />
                  <rect x="79" y="79" width="1" height="1" fill="#9f1239" />
                  
                  <!-- Decorative symbolic lotus center pixel block -->
                  <rect x="42" y="42" width="16" height="16" fill="#b91c1c" rx="4" />
                  <path d="M50 44 L53 50 L50 56 L47 50 Z" fill="white" />
                  
                  <!-- Simulated data module grid to make it look 100% like a QR Code -->
                  <rect x="35" y="5" width="4" height="15" fill="#1e293b" />
                  <rect x="45" y="10" width="10" height="4" fill="#1e293b" />
                  <rect x="60" y="15" width="5" height="10" fill="#1e293b" />
                  
                  <rect x="35" y="80" width="15" height="4" fill="#1e293b" />
                  <rect x="55" y="70" width="4" height="12" fill="#1e293b" />
                  <rect x="63" y="85" width="8" height="4" fill="#1e293b" />
                  
                  <rect x="5" y="35" width="12" height="4" fill="#1e293b" />
                  <rect x="22" y="40" width="4" height="15" fill="#1e293b" />
                  <rect x="10" y="55" width="8" height="4" fill="#1e293b" />
                  
                  <rect x="85" y="35" width="10" height="4" fill="#1e293b" />
                  <rect x="78" y="45" width="4" height="12" fill="#1e293b" />
                  <rect x="85" y="58" width="4" height="8" fill="#1e293b" />
                  
                  <!-- Lotus outline / scattered data -->
                  <rect x="35" y="35" width="4" height="4" fill="#1e293b" />
                  <rect x="60" y="35" width="4" height="4" fill="#1e293b" />
                  <rect x="35" y="60" width="4" height="4" fill="#1e293b" />
                  <rect x="60" y="60" width="4" height="4" fill="#1e293b" />
                  
                  <rect x="42" y="25" width="8" height="3" fill="#1e293b" />
                  <rect x="28" y="50" width="3" height="8" fill="#1e293b" />
                  <rect x="50" y="32" width="5" height="4" fill="#1e293b" />
                </svg>
                <div class="qr-label">QUÉT MÃ ĐỂ TRUY CẬP</div>
              </div>
              
              <div class="desc">
                <strong>Hướng dẫn đón đọc & trải nghiệm:</strong><br>
                ${item.description}
              </div>
            </div>
            
            <div class="footer">
              Công trình phối hợp của 21 Khu phố và UB MTTQ VN Phường Chánh Hiệp
            </div>
          </div>
          
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 py-2">
      {/* HEADER GIỚI THIỆU - Tone Đỏ Cánh Sen & Trống Đồng */}
      <div className="bg-gradient-to-r from-red-800 via-rose-700 to-red-950 text-white p-6 sm:p-8 rounded-3xl border-2 border-amber-300/40 shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-15 pointer-events-none">
          <DongSonDrumIcon size={240} />
        </div>

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-100 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>KẾ HOẠCH PHỐI HỢP LIÊN THÔNG 21 KHU PHỐ CHÁNH HIỆP</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-extrabold text-white leading-tight">
            Trạm Điều Hành &amp; Nâng Cấp Không Gian Văn Hóa Hồ Chí Minh
          </h2>
          <p className="text-xs sm:text-sm text-rose-50 max-w-4xl leading-relaxed font-normal">
            Bám sát Đề án của UBND Thành phố và Ủy ban MTTQ, không thiết lập điểm số mang tính thi đua lý thuyết, mà sử dụng hệ thống **Checklist tiêu chí thực tiễn** để chỉ đạo, bổ sung, nâng cấp đầy đủ các thiết chế di sản Hồ Chí Minh sẵn có trên toàn địa bàn 21 Khu phố, đưa nội dung rèn luyện phong cách Bác đi sâu vào thực chất.
          </p>
        </div>
      </div>

      {/* SUB-TABS THANH ĐIỀU HƯỚNG SẠCH CHUẨN */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-rose-200 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveSubTab('study')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'study'
                ? 'bg-rose-800 text-white shadow-xs'
                : 'bg-rose-50 text-rose-900 hover:bg-rose-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Hướng Dẫn 5 Tiêu Chí</span>
          </button>
          <button
            onClick={() => setActiveSubTab('assess')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'assess'
                ? 'bg-rose-800 text-white shadow-xs'
                : 'bg-rose-50 text-rose-900 hover:bg-rose-100'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Checklist Nâng Cấp Địa Bàn</span>
          </button>
          <button
            onClick={() => setActiveSubTab('ranking')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'ranking'
                ? 'bg-rose-800 text-white shadow-xs'
                : 'bg-rose-50 text-rose-900 hover:bg-rose-100'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Tiến Độ Đạt Chuẩn 21 KP</span>
          </button>
          <button
            onClick={() => setActiveSubTab('mediakit')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'mediakit'
                ? 'bg-rose-800 text-white shadow-xs'
                : 'bg-rose-50 text-rose-900 hover:bg-rose-100'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-amber-700 font-extrabold font-sans">Ấn Phẩm &amp; Media Kit Tải Về</span>
          </button>
        </div>

        {activeSubTab === 'assess' && (
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={handleResetToDefault}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-200"
                title="Khôi phục trạng thái chuẩn mặc định"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Khôi phục mặc định</span>
              </button>
            )}
            <button
              onClick={handlePrintReport}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-rose-950 hover:bg-amber-300 font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Phiếu Thẩm Định</span>
            </button>
          </div>
        )}
      </div>

      {/* NỘI DUNG CHÍNH CỦA CÁC TAB */}
      <AnimatePresence mode="wait">
        {/* SUB-TAB 1: HƯỚNG DẪN 5 TIÊU CHÍ */}
        {activeSubTab === 'study' && (
          <motion.div
            key="study-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* PHÂN TÍCH CHUYÊN SÂU NÂNG CẤP DÂN CƯ */}
            <div className="p-6 rounded-3xl bg-amber-50/40 border border-amber-200 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-100 rounded-xl text-amber-800">
                  <Info className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase text-amber-950 tracking-wide">Giải pháp hành động thực tiễn &amp; Sử dụng nền tảng liên thông</h4>
                  <p className="text-[11px] text-amber-900/80">Kế hoạch triển khai nâng cấp đồng bộ không gian văn hóa Hồ Chí Minh hiện hữu</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Để tránh bệnh hình thức hay chạy theo điểm số, Mặt trận Tổ quốc Phường Chánh Hiệp chỉ đạo 21 Khu phố tập trung vào **nghiên cứu sâu các tiêu chuẩn** và **khai thác triệt để các nguồn tài nguyên số** đã được tích hợp trong ứng dụng này để nâng cấp không gian thực tế tại địa bàn. Dưới đây là hướng dẫn hành động cụ thể cho từng tiêu chuẩn.
              </p>
            </div>

            {/* GRID 5 TIÊU CHÍ & GIẢI PHÁP NÂNG CẤP TRỰC TIẾP */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {HCM_EVALUATION_CRITERIA.map((crit) => {
                // Determine linked app features
                let linkedFeature = '';
                let linkedGuide = '';
                if (crit.id === 'crit-physical') {
                  linkedFeature = 'Sảnh Bảo Tàng (Foyer) & Thư Viện 3D';
                  linkedGuide = 'Trình chiếu Không gian 3D trên TV lớn tại văn phòng khu phố; sắp xếp kệ sách vật lý gọn gàng.';
                } else if (crit.id === 'crit-intangible') {
                  linkedFeature = 'Phân hệ Tư liệu, Audio & Video Di Sản';
                  linkedGuide = 'Trình chiếu các phim tư liệu cách mạng và phát loa các câu chuyện tấm gương Bác trong họp khu phố.';
                } else if (crit.id === 'crit-ethics') {
                  linkedFeature = 'Thư Viện Trích Dẫn Lời Bác (Quotes)';
                  linkedGuide = 'In và nhân rộng các câu nói, lời dạy của Bác thành các biểu hiệu đạo đức công vụ, lối sống tại địa bàn.';
                } else if (crit.id === 'crit-digital') {
                  linkedFeature = 'Bộ Ấn phẩm QR Code của Phường & Sách Điện Tử';
                  linkedGuide = 'Dán mã QR thư viện số 15 tập Google Drive; phổ biến qua nhóm Zalo khu dân cư để nhân dân quét đọc.';
                } else if (crit.id === 'crit-practical') {
                  linkedFeature = 'Mô hình Hành Động & Sáng kiến Mặt Trận';
                  linkedGuide = 'Ghi nhận và nhân rộng các công trình dân vận khéo thiết thực như "Hẻm sáng-xanh-sạch-đẹp" lên hệ thống.';
                }

                return (
                  <div
                    key={crit.id}
                    className="bg-white rounded-3xl border-2 border-slate-200/80 p-6 shadow-2xs hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-black uppercase tracking-wider">
                          {crit.number}
                        </span>
                        <span className="text-xs font-bold text-rose-950 bg-rose-100/50 px-2.5 py-1 rounded-xl">
                          Trọng số: {crit.maxScore}%
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {crit.name}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {crit.description}
                        </p>
                      </div>

                      {/* MINH CHỨNG YÊU CẦU */}
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <span className="text-[11px] font-bold text-slate-800 uppercase block tracking-wider">Hạng mục đạt chuẩn kiểu mẫu:</span>
                        <ul className="space-y-2">
                          {crit.requirements.map((req, rIdx) => (
                            <li key={rIdx} className="text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* GIẢI PHÁP NÂNG CẤP LIÊN THÔNG - ĐẸP, TRỰC QUAN */}
                    <div className="pt-4 mt-4 border-t border-slate-100 bg-amber-50/40 -mx-6 -mb-6 p-4 rounded-b-3xl space-y-2">
                      <div className="flex items-center gap-1 text-[10px] font-black text-amber-900 uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Khai thác từ ứng dụng số này:</span>
                      </div>
                      <div className="text-xs text-slate-800 space-y-1">
                        <p className="font-bold text-rose-950 flex items-center gap-1">
                          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-rose-800" />
                          <span>{linkedFeature}</span>
                        </p>
                        <p className="text-[11px] text-slate-600 leading-relaxed italic">
                          {linkedGuide}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* SUB-TAB 2: CHECKLIST NÂNG CẤP ĐỊA BÀN */}
        {activeSubTab === 'assess' && (
          <motion.div
            key="assess-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* CỘT TRÁI: CHỌN ĐƠN VỊ TRONG 21 KHU PHỐ */}
            <div className="lg:col-span-4 bg-white p-4 rounded-3xl border border-rose-200 shadow-2xs flex flex-col max-h-[750px] space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-rose-950 uppercase">Chọn Khu Phố Đang Nâng Cấp</h4>
                <p className="text-[11px] text-slate-500">Đồng bộ danh sách 21 Khu phố Phường Chánh Hiệp</p>
              </div>

              {/* Ô TÌM KIẾM NHANH */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm khu phố, trưởng ban, trạng thái..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* DANH SÁCH 21 KHU PHỐ */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                {filteredRankings.map((item) => {
                  const evalItem = scoresList.find((s) => s.neighborhoodId === item.id) || {
                    neighborhoodId: item.id,
                    scores: { 'crit-physical': 0, 'crit-intangible': 0, 'crit-ethics': 0, 'crit-digital': 0, 'crit-practical': 0 },
                    evaluator: item.leaderName,
                    notes: '',
                    updatedAt: ''
                  };
                  const details = getScoreDetails(evalItem);
                  const isSelected = selectedNeighborhoodId === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedNeighborhoodId(item.id)}
                      className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-rose-900 border-rose-950 text-white shadow-sm scale-[0.98]'
                          : 'bg-slate-50/50 hover:bg-rose-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400 text-slate-900 leading-none shrink-0">
                            KP {item.index}
                          </span>
                          <strong className="text-xs truncate block">{item.name}</strong>
                        </div>
                        <span className={`text-[10px] block mt-1 ${isSelected ? 'text-rose-100' : 'text-slate-500'}`}>
                          Trưởng ban: {item.leaderName}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black block">{details.progressPercentage}% đạt</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                          isSelected ? 'bg-white/10 border-white/20 text-amber-200' : 'bg-white text-rose-800'
                        }`}>
                          {details.checkedCount}/20 hạng mục
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CỘT PHẢI: BẢN CHECKLIST TỰ RÀ SOÁT NÂNG CẤP CỦA KHU PHỐ */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-rose-200 shadow-2xs space-y-6">
              {/* HEADER KHU PHỐ ĐƯỢC CHỌN */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-900 text-[10px] font-black">
                      KHU PHỐ {selectedNeighborhood.index}
                    </span>
                    <h3 className="text-lg font-serif font-extrabold text-rose-950">
                      {selectedNeighborhood.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Bí thư Chi bộ / Trưởng ban Công tác Mặt trận: <strong>{selectedNeighborhood.leaderName}</strong> — ĐT: {selectedNeighborhood.phone}
                  </p>
                </div>

                <div className={`px-4 py-3 rounded-2xl border text-center ${selectedDetails.colorClass} shadow-xs shrink-0 space-y-1`}>
                  <span className="text-[10px] font-black uppercase tracking-wider block">TIẾN ĐỘ HOÀN THÀNH</span>
                  <strong className="text-2xl font-serif font-black block leading-none">{selectedDetails.progressPercentage}%</strong>
                  <span className="text-[10px] font-bold block mt-0.5">{selectedDetails.checkedCount} / 20 hạng mục đạt chuẩn</span>
                </div>
              </div>

              {/* TIẾN TRÌNH PROGRESS BAR ĐẸP MẮT */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Trạng thái đạt tiêu chuẩn nâng cấp:</span>
                  <span className="text-rose-800 font-extrabold">{selectedDetails.grade}</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 p-0.5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-rose-700 via-red-600 to-amber-500 transition-all duration-500"
                    style={{ width: `${selectedDetails.progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* NỘI DUNG 5 KHU VỰC TIÊU CHÍ CHECKLIST */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-rose-700" />
                    <span>Checklist 20 Hạng mục nâng cấp thiết thực:</span>
                  </h4>
                  {!isAdmin && (
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      Chế độ rà soát nhanh (Lưu vào trình duyệt của bạn)
                    </span>
                  )}
                </div>

                <div className="space-y-5">
                  {HCM_EVALUATION_CRITERIA.map((crit) => {
                    const currentScore = currentEvaluation.scores[crit.id] || 0;
                    const checks = getCheckStates(crit.id, currentScore);
                    const milestones = MILESTONES_MAP[crit.id] || [];
                    const checkedCount = checks.filter(Boolean).length;

                    return (
                      <div key={crit.id} className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-black text-rose-800 uppercase tracking-wider">
                              {crit.number}
                            </span>
                            <h5 className="text-xs font-extrabold text-slate-900">
                              {crit.name}
                            </h5>
                          </div>

                          <div className="text-right shrink-0 flex items-center gap-2">
                            <span className="text-[11px] font-extrabold text-rose-900 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              Đạt {checkedCount} / 4 hạng mục
                            </span>
                            <div className="flex items-center gap-1 text-[10px]">
                              <button
                                onClick={() => handleToggleAllMilestones(crit.id, true)}
                                className="text-rose-800 hover:text-rose-950 font-bold hover:underline cursor-pointer"
                              >
                                Chọn hết
                              </button>
                              <span>/</span>
                              <button
                                onClick={() => handleToggleAllMilestones(crit.id, false)}
                                className="text-slate-500 hover:text-slate-800 font-bold hover:underline cursor-pointer"
                              >
                                Bỏ hết
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* LIST CHECKBOXES */}
                        <div className="space-y-2.5 pt-1">
                          {milestones.map((m, mIdx) => {
                            const isChecked = checks[mIdx];
                            return (
                              <button
                                key={m.id}
                                onClick={() => handleMilestoneToggle(crit.id, mIdx, !isChecked)}
                                className={`w-full p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                                  isChecked
                                    ? 'bg-rose-50/60 border-rose-300 text-rose-950 shadow-2xs'
                                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                                }`}
                              >
                                <div className="mt-0.5 shrink-0 text-rose-800">
                                  {isChecked ? (
                                    <CheckSquare className="w-4.5 h-4.5 fill-rose-100" />
                                  ) : (
                                    <Square className="w-4.5 h-4.5 text-slate-400" />
                                  )}
                                </div>
                                <div className="text-xs leading-relaxed space-y-1">
                                  <p className={`${isChecked ? 'font-bold' : 'font-normal'}`}>
                                    {m.text}
                                  </p>
                                  {isChecked && (
                                    <span className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-1 leading-none">
                                      <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-100" />
                                      Đã nâng cấp thành công (+{m.points} điểm đạt chuẩn)
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BAN THẨM ĐỊNH MẶT TRẬN GHI CHÚ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-rose-100">
                <div className="space-y-1">
                  <label className="block text-[11px] font-black uppercase text-slate-600">Đơn vị / Cán bộ thẩm tra rà soát:</label>
                  <input
                    type="text"
                    value={currentEvaluation.evaluator || ''}
                    onChange={(e) => handleMetaChange('evaluator', e.target.value)}
                    placeholder="Nhập tên cán bộ kiểm tra..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-black uppercase text-slate-600">Nhận xét, định hướng hành động nâng cấp tiếp theo:</label>
                  <textarea
                    value={currentEvaluation.notes || ''}
                    onChange={(e) => handleMetaChange('notes', e.target.value)}
                    placeholder="Nhập định hướng nâng cấp, vật tư bổ sung hoặc mô hình cần đẩy mạnh..."
                    rows={2}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-rose-500 resize-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SUB-TAB 3: TRẠNG THÁI TIẾN ĐỘ 21 KHU PHỐ */}
        {activeSubTab === 'ranking' && (
          <motion.div
            key="ranking-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* THỐNG KÊ TIẾN ĐỘ HOÀN THIỆN ĐỊA BÀN */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                <Trophy className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold uppercase text-amber-800">Dẫn đầu tiến độ nâng cấp</span>
                <strong className="text-sm block text-slate-900 truncate font-bold">{rankedNeighborhoods[0]?.name}</strong>
                <span className="text-[11px] text-amber-700 font-bold">{rankedNeighborhoods[0]?.progressPercentage}% hoàn thành (Kiểu mẫu)</span>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                <Star className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold uppercase text-emerald-800">Không gian Kiểu mẫu</span>
                <strong className="text-xl block font-serif font-black text-slate-900">
                  {rankedNeighborhoods.filter((r) => r.checkedCount >= 17).length} Đơn vị
                </strong>
                <span className="text-[11px] text-emerald-700">Đạt từ 17 - 20 hạng mục trở lên</span>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-center">
                <CheckCircle2 className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold uppercase text-blue-800">Đạt chuẩn Tốt &amp; Khá</span>
                <strong className="text-xl block font-serif font-black text-slate-900">
                  {rankedNeighborhoods.filter((r) => r.checkedCount >= 9 && r.checkedCount < 17).length} Đơn vị
                </strong>
                <span className="text-[11px] text-blue-700">Đạt từ 9 - 16 hạng mục nâng cấp</span>
              </div>
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-center">
                <AlertCircle className="w-6 h-6 text-rose-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold uppercase text-rose-800">Đang trong lộ trình hoàn thiện</span>
                <strong className="text-xl block font-serif font-black text-slate-900">
                  {rankedNeighborhoods.filter((r) => r.checkedCount < 9).length} Đơn vị
                </strong>
                <span className="text-[11px] text-rose-700">Dưới 9 hạng mục đạt chuẩn</span>
              </div>
            </div>

            {/* BẢNG THỐNG KÊ TIẾN ĐỘ CHI TIẾT */}
            <div className="bg-white rounded-3xl border border-rose-200 shadow-2xs overflow-hidden">
              <div className="p-4 bg-rose-50/50 border-b border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-black text-rose-950 uppercase flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>Bảng theo dõi lộ trình nâng cấp 21 Khu phố Chánh Hiệp (Năm 2026)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">Giúp Mặt Trận kiểm tra dứt điểm các thiết chế còn thiếu để hỗ trợ nâng cấp</p>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm khu phố..."
                    className="pl-8 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-rose-500 w-48"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                      <th className="px-4 py-3 text-center w-12">Hạng</th>
                      <th className="px-4 py-3">Địa bàn khu phố</th>
                      <th className="px-4 py-3 text-center">Thiết chế Trưng bày</th>
                      <th className="px-4 py-3 text-center">Hoạt động Văn hóa</th>
                      <th className="px-4 py-3 text-center">Chuyển biến Nhận thức</th>
                      <th className="px-4 py-3 text-center">Không gian Số hóa</th>
                      <th className="px-4 py-3 text-center">Mô hình Dân vận</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-900">Tổng tiến trình đạt</th>
                      <th className="px-4 py-3 text-center">Danh hiệu đạt được</th>
                      <th className="px-4 py-3 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredRankings.map((item, idx) => {
                      const scores = item.evalItem.scores;
                      
                      // Convert scores to checkpoint counts (0-4)
                      const cPhys = getCheckStates('crit-physical', scores['crit-physical'] || 0).filter(Boolean).length;
                      const cInta = getCheckStates('crit-intangible', scores['crit-intangible'] || 0).filter(Boolean).length;
                      const cEthi = getCheckStates('crit-ethics', scores['crit-ethics'] || 0).filter(Boolean).length;
                      const cDigi = getCheckStates('crit-digital', scores['crit-digital'] || 0).filter(Boolean).length;
                      const cPrac = getCheckStates('crit-practical', scores['crit-practical'] || 0).filter(Boolean).length;

                      let rankBadge = `${idx + 1}`;
                      let rankClass = 'bg-slate-100 text-slate-700';

                      if (idx === 0) {
                        rankBadge = '★ 1';
                        rankClass = 'bg-amber-400 text-rose-950 font-black';
                      } else if (idx === 1) {
                        rankBadge = '★ 2';
                        rankClass = 'bg-slate-300 text-slate-900 font-bold';
                      } else if (idx === 2) {
                        rankBadge = '★ 3';
                        rankClass = 'bg-amber-600/40 text-amber-950 font-bold';
                      }

                      let typeBadgeClass = 'text-slate-500 bg-slate-50';
                      if (item.checkedCount >= 17) {
                        typeBadgeClass = 'text-amber-700 bg-amber-50 font-black border border-amber-200';
                      } else if (item.checkedCount >= 13) {
                        typeBadgeClass = 'text-emerald-700 bg-emerald-50 font-bold border border-emerald-200';
                      } else if (item.checkedCount >= 9) {
                        typeBadgeClass = 'text-blue-700 bg-blue-50 border border-blue-200';
                      }

                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-rose-50/20 transition ${
                            selectedNeighborhoodId === item.id ? 'bg-amber-50/30 font-semibold' : ''
                          }`}
                        >
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] ${rankClass}`}>
                              {rankBadge}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <strong className="text-slate-900 text-xs block">{item.name}</strong>
                              <span className="text-[10px] text-slate-500 block">Trưởng ban: {item.leaderName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center font-medium">
                            <span className={`px-2 py-0.5 rounded text-[11px] ${cPhys === 4 ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 bg-slate-100'}`}>
                              {cPhys}/4 đạt
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center font-medium">
                            <span className={`px-2 py-0.5 rounded text-[11px] ${cInta === 4 ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 bg-slate-100'}`}>
                              {cInta}/4 đạt
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center font-medium">
                            <span className={`px-2 py-0.5 rounded text-[11px] ${cEthi === 4 ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 bg-slate-100'}`}>
                              {cEthi}/4 đạt
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center font-medium">
                            <span className={`px-2 py-0.5 rounded text-[11px] ${cDigi === 4 ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 bg-slate-100'}`}>
                              {cDigi}/4 đạt
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center font-medium">
                            <span className={`px-2 py-0.5 rounded text-[11px] ${cPrac === 4 ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 bg-slate-100'}`}>
                              {cPrac}/4 đạt
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-xs font-black text-rose-950 bg-rose-50/30">
                            {item.progressPercentage}% ({item.checkedCount} mục)
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] ${typeBadgeClass}`}>
                              {item.grade}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => {
                                setSelectedNeighborhoodId(item.id);
                                setActiveSubTab('assess');
                              }}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-900 font-bold rounded-lg border border-rose-200 text-[10px] transition cursor-pointer"
                            >
                              Chỉnh Sửa Checklist
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* SUB-TAB 4: ẤN PHẨM & TÀI NGUYÊN MEDIA KIT TẢI VỀ */}
        {activeSubTab === 'mediakit' && (
          <motion.div
            key="mediakit-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* GIỚI THIỆU BỘ ẤN PHẨM */}
            <div className="p-6 rounded-3xl bg-amber-50/30 border border-amber-200 space-y-3">
              <h4 className="text-sm font-black uppercase text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Nâng cấp đầy đủ - Hỗ trợ công cụ tiện lợi cho 21 Khu phố</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Để giải quyết yêu cầu **"đầy đủ và thuận tiện"** theo tinh thần chỉ đạo, MTTQ Phường cung cấp **Bộ Media Kit và Ấn phẩm số hóa**. Cán bộ Ban công tác Mặt trận chỉ cần bấm **"In Ấn Phẩm A4"** để tạo ngay trang in chuẩn văn phòng chính trị, sẵn sàng dán tại văn phòng khu phố, giúp nhân dân quét đọc tiện lợi và hoàn thành ngay tiêu chuẩn Không gian văn hóa số!
              </p>
            </div>

            {/* DANH SÁCH ẤN PHẨM SỐ TRỰC QUAN */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* ẤN PHẨM 1: TỦ SÁCH SỐ */}
              <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-2xs hover:border-rose-400 transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 bg-red-50 text-red-700 rounded-2xl w-fit">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-sm text-slate-900 leading-snug">Ấn Phẩm Mã QR Tủ Sách Điện Tử</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">Khung A4 trang trọng chứa QR truy cập Thư viện 15 Tập Hồ Chí Minh Toàn Tập.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Nơi dán khuyên dùng:</span>
                  <span className="text-xs font-semibold text-rose-900 block bg-rose-50 px-2 py-1 rounded">Bảng tin khu dân cư, tủ sách vật lý</span>
                  <button
                    onClick={() => handlePrintA4Qr({
                      title: 'ẤN PHẨM MÃ QR TỦ SÁCH ĐIỆN TỬ HỒ CHÍ MINH TOÀN TẬP',
                      subtitle: 'Ủy ban MTTQ Việt Nam Phường Chánh Hiệp — Thư Viện Lưu Trữ Google Drive Chính Thức',
                      description: 'Người dân và cán bộ khu phố sử dụng camera điện thoại quét mã QR trên để truy cập và đón đọc toàn bộ 15 tập sách Hồ Chí Minh Toàn Tập. Tài liệu phục vụ đắc lực công tác nghiên cứu học tập chuyên đề hằng tháng, tra cứu thông tin di sản chính thống, thuận tiện mọi lúc mọi nơi.',
                      qrValue: 'https://drive.google.com/drive/folders/1HCM_TOANTAP_CHIPP'
                    })}
                    className="w-full py-2 bg-rose-800 text-white font-bold rounded-xl text-xs hover:bg-rose-900 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>In Ấn Phẩm A4</span>
                  </button>
                </div>
              </div>

              {/* ẤN PHẨM 2: KHÔNG GIAN 3D */}
              <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-2xs hover:border-rose-400 transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl w-fit">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-sm text-slate-900 leading-snug">Ấn Phẩm Khám Phá Bảo Tàng Số 3D</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">Mã QR dẫn trực tiếp vào không gian trưng bày 3D tương tác và lịch sử di sản.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Nơi dán khuyên dùng:</span>
                  <span className="text-xs font-semibold text-amber-900 block bg-amber-50 px-2 py-1 rounded">Sảnh chính Nhà văn hóa, cửa ra vào</span>
                  <button
                    onClick={() => handlePrintA4Qr({
                      title: 'MÃ QR KHÁM PHÁ KHÔNG GIAN TRƯNG BÀY DI SẢN SỐ 3D',
                      subtitle: 'Trải Nghiệm Tương Tác Trực Quan Di Sản Hồ Chí Minh Với Cơ Chế Thực Tế Ảo',
                      description: 'Sử dụng điện thoại thông minh để quét mã QR truy cập trực tiếp vào Bảo tàng số 3D của Phường Chánh Hiệp. Người dân có thể xoay 360 độ, di chuyển ảo qua các sảnh trưng bày tượng Bác, đọc thông tin thuyết minh của hàng chục hiện vật lịch sử quý giá một cách vô cùng sinh động.',
                      qrValue: 'https://chanhhiep-digitalmuseum.gov.vn'
                    })}
                    className="w-full py-2 bg-rose-800 text-white font-bold rounded-xl text-xs hover:bg-rose-900 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>In Ấn Phẩm A4</span>
                  </button>
                </div>
              </div>

              {/* ẤN PHẨM 3: SÁCH NÓI & VIDEO */}
              <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-2xs hover:border-rose-400 transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl w-fit">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-sm text-slate-900 leading-snug">Tủ Sách Nói &amp; Video Di Sản</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">Tích hợp thư viện âm thanh kể chuyện gương Bác và phim tài liệu quý.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Nơi dán khuyên dùng:</span>
                  <span className="text-xs font-semibold text-blue-900 block bg-blue-50 px-2 py-1 rounded">Góc đọc sách thiếu nhi, sinh hoạt Đoàn</span>
                  <button
                    onClick={() => handlePrintA4Qr({
                      title: 'ẤN PHẨM SÁCH NÓI & PHIM TƯ LIỆU SỐ HỒ CHÍ MINH',
                      subtitle: 'Nghe Kể Chuyện Tấm Gương Đạo Đức Và Xem Phim Tài Liệu Lịch Sử Quý Giá',
                      description: 'Người dân đặc biệt là trẻ em và người lớn tuổi chỉ cần quét mã để nghe kể các câu chuyện chân thực về phong cách làm việc của Bác Bác Hồ, các tác phẩm nổi tiếng như Sửa đổi lối làm việc, Di chúc, v.v., kết hợp xem tư liệu cách mạng, giúp khắc ghi sâu sắc các bài học lịch sử cốt lõi.',
                      qrValue: 'https://chanhhiep-digitalmuseum.gov.vn/media'
                    })}
                    className="w-full py-2 bg-rose-800 text-white font-bold rounded-xl text-xs hover:bg-rose-900 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>In Ấn Phẩm A4</span>
                  </button>
                </div>
              </div>

              {/* ẤN PHẨM 4: SLIDE CHUYÊN ĐỀ & POSTER */}
              <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-2xs hover:border-rose-400 transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl w-fit">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-sm text-slate-900 leading-snug">Slide &amp; Infographic Tuyên Truyền</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">Tập hợp các tài liệu trình chiếu PowerPoint thiết kế sẵn cực đẹp phục vụ họp chi bộ.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Phương thức khai thác:</span>
                  <span className="text-xs font-semibold text-emerald-900 block bg-emerald-50 px-2 py-1 rounded">Tải trực tiếp về USB trình chiếu</span>
                  <a
                    href="https://drive.google.com/drive/folders/1HCM_TOANTAP_CHIPP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-rose-800 text-white font-bold rounded-xl text-xs hover:bg-rose-900 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Mở Folder Tải Slide số</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
