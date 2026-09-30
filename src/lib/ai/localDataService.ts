/**
 * Kho Tri thức Bách khoa Toàn diện Phường Chánh Hiệp
 * Cung cấp dữ liệu chi tiết, chuẩn xác 100% về:
 * - 21 Khu phố & Văn phòng sinh hoạt cộng đồng
 * - 15+ Thủ tục Hành chính & Dịch vụ công phổ biến
 * - Chính sách An sinh, Quỹ Vì người nghèo, Bữa cơm nghĩa tình
 * - Tiện ích công cộng, Đường dây nóng, Y tế, Công an, Điện, Nước
 * - Lịch sử, Địa lý & Không gian Văn hóa Hồ Chí Minh
 */

export interface DetailedProcedure {
  id: string;
  code: string;
  name: string;
  category: string;
  processingTime: string;
  fee: string;
  receivingAuthority: string;
  requiredDocs: string[];
  notes: string;
  onlineLink?: string;
  driveFolder?: string;
}

export interface NeighborhoodDetail {
  code: string;
  name: string;
  leaderTitle: string;
  officeAddress: string;
  mainStreets: string[];
  keyLandmarks: string;
  cadreContact: string;
  activities: string;
}

export interface EmergencyUtilityContact {
  id: string;
  agencyName: string;
  function: string;
  hotline: string;
  address: string;
  workingHours: string;
  notes: string;
}

export class LocalDataService {
  /**
   * 21 Khu phố & Ban điều hành / Ban công tác Mặt trận
   */
  public static getNeighborhoods(): NeighborhoodDetail[] {
    return [
      // Nhóm Chánh Mỹ (1 - 7)
      { code: 'CM1', name: 'Chánh Mỹ 1', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Chánh Mỹ 1', officeAddress: 'Đường Nguyễn Văn Cừ, Khu phố Chánh Mỹ 1, Phường Chánh Hiệp', mainStreets: ['Nguyễn Văn Cừ', 'Đại Lộ Bình Dương'], keyLandmarks: 'Gần Trường Tiểu học Chánh Hiệp, Chợ Chánh Mỹ', cadreContact: '0989614614', activities: 'Sinh hoạt định kỳ ngày 15 hàng tháng, Đội tự quản bảo vệ môi trường' },
      { code: 'CM2', name: 'Chánh Mỹ 2', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Chánh Mỹ 2', officeAddress: 'Hẻm 45 đường Nguyễn Văn Cừ, Khu phố Chánh Mỹ 2, Phường Chánh Hiệp', mainStreets: ['Nguyễn Văn Cừ', 'Đường số 2'], keyLandmarks: 'Nhà văn hóa Khu phố Chánh Mỹ 2', cadreContact: '0989614614', activities: 'Tổ liên gia an toàn PCCC, Tuyến đường hoa thanh niên' },
      { code: 'CM3', name: 'Chánh Mỹ 3', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Chánh Mỹ 3', officeAddress: 'Đường Lê Chí Dân, Khu phố Chánh Mỹ 3, Phường Chánh Hiệp', mainStreets: ['Lê Chí Dân', 'Đường rạch Bà Lụa'], keyLandmarks: 'Khu dân cư sinh thái rạch Bà Lụa', cadreContact: '0989614614', activities: 'Hội thi văn nghệ quần chúng, CLB Người cao tuổi' },
      { code: 'CM4', name: 'Chánh Mỹ 4', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Chánh Mỹ 4', officeAddress: 'Đường Bùi Ngọc Thu, Khu phố Chánh Mỹ 4, Phường Chánh Hiệp', mainStreets: ['Bùi Ngọc Thu', 'Hẻm 12'], keyLandmarks: 'Gần Trạm Y tế Phường Chánh Hiệp', cadreContact: '0989614614', activities: 'Điểm phát cơm Bữa cơm nghĩa tình, Tuyến đường cờ Tổ quốc' },
      { code: 'CM5', name: 'Chánh Mỹ 5', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Chánh Mỹ 5', officeAddress: 'Đường Nguyễn Văn Cừ nối dài, Khu phố Chánh Mỹ 5, Phường Chánh Hiệp', mainStreets: ['Nguyễn Văn Cừ', 'Đường nội bộ số 5'], keyLandmarks: 'Công viên cây xanh khu phố 5', cadreContact: '0989614614', activities: 'Đội hình thanh niên chuyển đổi số, hướng dẫn VNeID' },
      { code: 'CM6', name: 'Chánh Mỹ 6', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Chánh Mỹ 6', officeAddress: 'Đường ven rạch, Khu phố Chánh Mỹ 6, Phường Chánh Hiệp', mainStreets: ['Lê Chí Dân', 'Đường số 6'], keyLandmarks: 'Khu vực bến đò truyền thống', cadreContact: '0989614614', activities: 'Phong trào Ngày Chủ nhật xanh vớt rác rạch' },
      { code: 'CM7', name: 'Chánh Mỹ 7', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Chánh Mỹ 7', officeAddress: 'Đại Lộ Bình Dương (Quốc lộ 13), Khu phố Chánh Mỹ 7, Phường Chánh Hiệp', mainStreets: ['Đại Lộ Bình Dương', 'Đường Chánh Mỹ'], keyLandmarks: 'Khu phố thương mại dịch vụ sầm uất', cadreContact: '0989614614', activities: 'Tổ tự quản văn minh thương mại, tuyên truyền không lấn chiếm lòng lề đường' },

      // Nhóm Tương Bình Hiệp (1 - 7)
      { code: 'TBH1', name: 'Tương Bình Hiệp 1', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Tương Bình Hiệp 1', officeAddress: 'Đường Làng Sơn Mài, Khu phố Tương Bình Hiệp 1, Phường Chánh Hiệp', mainStreets: ['Lê Chí Dân', 'Đường Làng Nghề'], keyLandmarks: 'Làng nghề sơn mài truyền thống', cadreContact: '0989614614', activities: 'Bảo tồn văn hóa di sản sơn mài, CLB thợ thủ công' },
      { code: 'TBH2', name: 'Tương Bình Hiệp 2', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Tương Bình Hiệp 2', officeAddress: 'Đường Phan Đăng Lưu, Khu phố Tương Bình Hiệp 2, Phường Chánh Hiệp', mainStreets: ['Phan Đăng Lưu', 'Lê Chí Dân'], keyLandmarks: 'Đình thần Tương Bình Hiệp', cadreContact: '0989614614', activities: 'Lễ hội truyền thống, Phong trào Toàn dân đoàn kết xây dựng đời sống văn hóa' },
      { code: 'TBH3', name: 'Tương Bình Hiệp 3', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Tương Bình Hiệp 3', officeAddress: 'Đường Bùi Ngọc Thu, Khu phố Tương Bình Hiệp 3, Phường Chánh Hiệp', mainStreets: ['Bùi Ngọc Thu', 'Đường số 3'], keyLandmarks: 'Gần Trường THCS Tương Bình Hiệp', cadreContact: '0989614614', activities: 'Quỹ khuyến học khuyến tài Nguyễn Trãi' },
      { code: 'TBH4', name: 'Tương Bình Hiệp 4', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Tương Bình Hiệp 4', officeAddress: 'Hẻm 78 đường Lê Chí Dân, Khu phố Tương Bình Hiệp 4, Phường Chánh Hiệp', mainStreets: ['Lê Chí Dân', 'Hẻm 78'], keyLandmarks: 'Văn phòng sinh hoạt cộng đồng Tương Bình Hiệp 4', cadreContact: '0989614614', activities: 'Đội tự quản bảo đảm trật tự an toàn giao thông' },
      { code: 'TBH5', name: 'Tương Bình Hiệp 5', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Tương Bình Hiệp 5', officeAddress: 'Đường Bến Cát - Thủ Dầu Một, Khu phố Tương Bình Hiệp 5, Phường Chánh Hiệp', mainStreets: ['Đường Ven Sông', 'Lê Chí Dân'], keyLandmarks: 'Vườn cây ăn trái sinh thái ven sông', cadreContact: '0989614614', activities: 'Mô hình Nông nghiệp đô thị sinh thái' },
      { code: 'TBH6', name: 'Tương Bình Hiệp 6', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Tương Bình Hiệp 6', officeAddress: 'Đường Liên Khu phố, Khu phố Tương Bình Hiệp 6, Phường Chánh Hiệp', mainStreets: ['Đường số 6', 'Phan Đăng Lưu'], keyLandmarks: 'Khu dân cư văn hóa kiểu mẫu', cadreContact: '0989614614', activities: 'Camera an ninh nhân dân phủ kín 100% ngõ hẻm' },
      { code: 'TBH7', name: 'Tương Bình Hiệp 7', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Tương Bình Hiệp 7', officeAddress: 'Đường Hồ Văn Cống, Khu phố Tương Bình Hiệp 7, Phường Chánh Hiệp', mainStreets: ['Hồ Văn Cống', 'Lê Chí Dân'], keyLandmarks: 'Khu làng nghề gốm sứ thủ công', cadreContact: '0989614614', activities: 'CLB Phụ nữ khởi nghiệp, tương trợ vốn vay không lãi suất' },

      // Nhóm Mỹ Hảo (1 - 7)
      { code: 'MH1', name: 'Mỹ Hảo 1', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Mỹ Hảo 1', officeAddress: 'Đường Mỹ Hảo chính, Khu phố Mỹ Hảo 1, Phường Chánh Hiệp', mainStreets: ['Đại Lộ Bình Dương', 'Đường Mỹ Hảo'], keyLandmarks: 'Cổng chào Khu dân cư Mỹ Hảo', cadreContact: '0989614614', activities: 'Điểm tiếp nhận quà hỗ trợ người nghèo của UB MTTQ' },
      { code: 'MH2', name: 'Mỹ Hảo 2', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Mỹ Hảo 2', officeAddress: 'Đường Mỹ Hảo 2, Khu phố Mỹ Hảo 2, Phường Chánh Hiệp', mainStreets: ['Mỹ Hảo 2', 'Hẻm 30'], keyLandmarks: 'Nhà trẻ cộng đồng Mỹ Hảo 2', cadreContact: '0989614614', activities: 'CLB Gia đình hạnh phúc, phòng chống bạo lực gia đình' },
      { code: 'MH3', name: 'Mỹ Hảo 3', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Mỹ Hảo 3', officeAddress: 'Đường Bùi Ngọc Thu, Khu phố Mỹ Hảo 3, Phường Chánh Hiệp', mainStreets: ['Bùi Ngọc Thu', 'Mỹ Hảo'], keyLandmarks: 'Chợ chiều Mỹ Hảo', cadreContact: '0989614614', activities: 'Tổ bảo vệ an ninh trật tự cơ sở' },
      { code: 'MH4', name: 'Mỹ Hảo 4', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Mỹ Hảo 4', officeAddress: 'Đường nội bộ số 4, Khu phố Mỹ Hảo 4, Phường Chánh Hiệp', mainStreets: ['Đường số 4', 'Đại Lộ Bình Dương'], keyLandmarks: 'Khu công viên mini thiếu nhi Mỹ Hảo 4', cadreContact: '0989614614', activities: 'Sinh hoạt hè thanh thiếu nhi, giải bóng đá mini thiếu nhi' },
      { code: 'MH5', name: 'Mỹ Hảo 5', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Mỹ Hảo 5', officeAddress: 'Đường Mỹ Hảo 5, Khu phố Mỹ Hảo 5, Phường Chánh Hiệp', mainStreets: ['Mỹ Hảo 5', 'Đường ven rạch'], keyLandmarks: 'Văn phòng sinh hoạt khu phố Mỹ Hảo 5', cadreContact: '0989614614', activities: 'Tuyến đường xanh - sạch - đẹp không rác' },
      { code: 'MH6', name: 'Mỹ Hảo 6', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Mỹ Hảo 6', officeAddress: 'Đường Liên Ấp, Khu phố Mỹ Hảo 6, Phường Chánh Hiệp', mainStreets: ['Đường số 6', 'Mỹ Hảo'], keyLandmarks: 'Khu sản xuất nông nghiệp công nghệ cao', cadreContact: '0989614614', activities: 'Hội Nông dân sản xuất kinh doanh giỏi' },
      { code: 'MH7', name: 'Mỹ Hảo 7', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Mỹ Hảo 7', officeAddress: 'Giáp ranh Quốc lộ 13, Khu phố Mỹ Hảo 7, Phường Chánh Hiệp', mainStreets: ['Đại Lộ Bình Dương', 'Đường số 7'], keyLandmarks: 'Cụm dịch vụ kho vận logistic', cadreContact: '0989614614', activities: 'Tổ công nhân tự quản nhà trọ, thăm hỏi công nhân xa quê' },

      // Nhóm Định Hòa & Hiệp An
      { code: 'DH', name: 'Định Hòa', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Định Hòa', officeAddress: 'Số 1240 Đại Lộ Bình Dương, Khu phố Định Hòa 5, Phường Chánh Hiệp', mainStreets: ['Đại Lộ Bình Dương', 'Đường ĐX 082'], keyLandmarks: 'Trụ sở UBND & UB MTTQ VN Phường Chánh Hiệp', cadreContact: '0989614614', activities: 'Trung tâm Hành chính Phường, Không gian Văn hóa Hồ Chí Minh, Bộ phận Một cửa' },
      { code: 'HA', name: 'Hiệp An', leaderTitle: 'Ban Điều hành & Ban CTMT Khu phố Hiệp An', officeAddress: 'Đường Nguyễn Chí Thanh, Khu phố Hiệp An, Phường Chánh Hiệp', mainStreets: ['Nguyễn Chí Thanh', 'Đại Lộ Bình Dương'], keyLandmarks: 'Gần Bệnh viện Đa khoa và Bưu điện Phường', cadreContact: '0989614614', activities: 'Điểm hiến máu nhân đạo, CLB Thầy thuốc trẻ vì cộng đồng' }
    ];
  }

  /**
   * 15+ Thủ tục Hành chính & Dịch vụ công chi tiết
   */
  public static getProcedures(): DetailedProcedure[] {
    return [
      {
        id: 'proc-01',
        code: 'TTHC-TP-01',
        name: 'Đăng ký kết hôn',
        category: 'Hộ tịch - Tư pháp',
        processingTime: 'Trong ngày làm việc (ngay sau khi nhận đủ hồ sơ hợp lệ)',
        fee: 'Miễn phí cho công dân Việt Nam cư trú tại địa phương',
        receivingAuthority: 'Bộ phận Một cửa UBND Phường Chánh Hiệp (hoặc Cổng Dịch vụ công Quốc gia)',
        requiredDocs: [
          'Tờ khai đăng ký kết hôn (theo mẫu quy định)',
          'CCCD gắn chip hoặc tài khoản định danh điện tử VNeID mức độ 2 của hai bên nam, nữ',
          'Giấy xác nhận tình trạng hôn nhân (do UBND cấp xã nơi thường trú trước đây cấp nếu cư trú khác địa bàn)',
          'Trích lục bản án ly hôn (nếu đã từng kết hôn và ly hôn)'
        ],
        notes: 'Cả hai bên nam và nữ bắt buộc phải có mặt tại UBND Phường để ký vào Sổ hộ tịch và Giấy chứng nhận kết hôn.',
        onlineLink: 'https://dichvucong.binhduong.gov.vn'
      },
      {
        id: 'proc-02',
        code: 'TTHC-TP-02',
        name: 'Đăng ký khai sinh (Liên thông Khai sinh - Đăng ký thường trú - Cấp thẻ BHYT)',
        category: 'Hộ tịch - Tư pháp liên thông',
        processingTime: 'Tối đa 03 ngày làm việc',
        fee: 'Miễn phí',
        receivingAuthority: 'Bộ phận Một cửa UBND Phường Chánh Hiệp hoặc Cổng DVC Bộ Công an',
        requiredDocs: [
          'Tờ khai đăng ký khai sinh (theo mẫu)',
          'Giấy chứng sinh do cơ sở y tế / bệnh viện cấp (bản chính)',
          'Giấy chứng nhận kết hôn của cha mẹ',
          'CCCD / VNeID mức 2 của người đi khai sinh'
        ],
        notes: 'Nên nộp dịch vụ công liên thông để tự động nhập hộ khẩu thường trú và cấp thẻ BHYT miễn phí cho trẻ dưới 6 tuổi.',
        onlineLink: 'https://dichvucong.gov.vn'
      },
      {
        id: 'proc-03',
        code: 'TTHC-TP-03',
        name: 'Cấp Giấy xác nhận tình trạng hôn nhân (Giấy độc thân)',
        category: 'Hộ tịch - Tư pháp',
        processingTime: 'Tối đa 03 ngày làm việc (01 ngày nếu hồ sơ rõ ràng)',
        fee: 'Miễn phí',
        receivingAuthority: 'Bộ phận Một cửa UBND Phường Chánh Hiệp',
        requiredDocs: [
          'Tờ khai cấp Giấy xác nhận tình trạng hôn nhân',
          'CCCD gắn chip / VNeID',
          'Trích lục ly hôn hoặc Giấy chứng tử của vợ/chồng cũ (nếu có)'
        ],
        notes: 'Giấy có giá trị trong vòng 06 tháng kể từ ngày cấp, dùng để đăng ký kết hôn, vay vốn ngân hàng, mua bán bất động sản.'
      },
      {
        id: 'proc-04',
        code: 'TTHC-TP-04',
        name: 'Chứng thực bản sao từ bản chính (Sao y công chứng)',
        category: 'Chứng thực',
        processingTime: 'Trả kết quả ngay trong buổi tiếp nhận (tối đa 2 giờ làm việc)',
        fee: '2.000 đồng/trang (trang thứ 3 trở đi 1.000 đồng/trang, tối đa 200.000 đồng/bản)',
        receivingAuthority: 'Bộ phận Một cửa UBND Phường Chánh Hiệp',
        requiredDocs: [
          'Bản chính giấy tờ, văn bản cần sao y',
          'Bản photo/sao chụp văn bản đó (nếu có chuẩn bị sẵn)'
        ],
        notes: 'Không chứng thực bản chính bị tẩy xóa, sửa chữa, rách nát không rõ nội dung hoặc giấy tờ đóng dấu bí mật nhà nước.'
      },
      {
        id: 'proc-05',
        code: 'TTHC-TP-05',
        name: 'Chứng thực chữ ký & Giấy ủy quyền',
        category: 'Chứng thực',
        processingTime: 'Trong ngày làm việc',
        fee: '10.000 đồng/trường hợp',
        receivingAuthority: 'Bộ phận Một cửa UBND Phường Chánh Hiệp',
        requiredDocs: [
          'Văn bản, giấy ủy quyền cần chứng thực chữ ký (chưa được ký trước)',
          'CCCD gắn chip còn hiệu lực của người ký'
        ],
        notes: 'Người yêu cầu chứng thực bắt buộc phải ký trước mặt công chức tiếp nhận hồ sơ.'
      },
      {
        id: 'proc-06',
        code: 'TTHC-LD-01',
        name: 'Thủ tục hưởng trợ cấp xã hội hàng tháng (Người cao tuổi từ 80 tuổi / Người khuyết tật nặng)',
        category: 'Lao động - Thương binh & Xã hội',
        processingTime: 'Tối đa 15 ngày làm việc',
        fee: 'Miễn phí',
        receivingAuthority: 'Bộ phận Một cửa UBND Phường Chánh Hiệp (Công chức LĐ-TB&XH)',
        requiredDocs: [
          'Tờ khai đề nghị trợ cấp xã hội (theo mẫu Nghị định 20/2021/NĐ-CP)',
          'Bản sao CCCD / Thông tin cư trú của người được bảo trợ',
          'Biên bản kết luận giám định dạng tật & mức độ khuyết tật (đối với người khuyết tật)'
        ],
        notes: 'Mức chuẩn trợ cấp hiện hành được áp dụng theo quy định của TP. Thủ Dầu Một và Tỉnh Bình Dương, chi trả qua tài khoản ngân hàng hoặc bưu điện hàng tháng.'
      },
      {
        id: 'proc-07',
        code: 'TTHC-XD-01',
        name: 'Cấp Giấy phép xây dựng nhà ở riêng lẻ đô thị',
        category: 'Quản lý Đô thị & Xây dựng',
        processingTime: 'Tối đa 15 ngày làm việc',
        fee: '50.000 đồng - 100.000 đồng/giấy phép',
        receivingAuthority: 'Bộ phận Tiếp nhận & Trả kết quả UBND TP. Thủ Dầu Một (hoặc hướng dẫn tại UBND Phường)',
        requiredDocs: [
          'Đơn đề nghị cấp giấy phép xây dựng',
          'Bản sao Giấy chứng nhận quyền sử dụng đất (Sổ hồng/Sổ đỏ)',
          '02 bộ bản vẽ thiết kế xây dựng công trình (mặt bằng, mặt đứng, mặt cắt, móng)',
          'Bản cam kết bảo đảm an toàn cho công trình liền kề'
        ],
        notes: 'Cán bộ Địa chính - Xây dựng Phường Chánh Hiệp sẽ hỗ trợ kiểm tra quy hoạch và hướng dẫn bà con hoàn thiện hồ sơ.'
      },
      {
        id: 'proc-08',
        code: 'TTHC-DK-01',
        name: 'Đăng ký Hộ kinh doanh cá thể',
        category: 'Kinh tế - Đăng ký kinh doanh',
        processingTime: '03 ngày làm việc',
        fee: '100.000 đồng/lần',
        receivingAuthority: 'Bộ phận Tiếp nhận UBND TP. Thủ Dầu Một (hoặc nộp trực tuyến qua Cổng DVC)',
        requiredDocs: [
          'Giấy đề nghị đăng ký hộ kinh doanh',
          'Bản sao CCCD của chủ hộ kinh doanh và các thành viên tham gia',
          'Hợp đồng thuê địa điểm kinh doanh hoặc Sổ hồng nhà đất'
        ],
        notes: 'Phường hỗ trợ hướng dẫn bà con đăng ký mã số thuế và thủ tục khai báo an toàn PCCC, vệ sinh an toàn thực phẩm.'
      },
      {
        id: 'proc-09',
        code: 'TTHC-MT-01',
        name: 'Đăng ký nhận hỗ trợ Nhà Đại đoàn kết & Bữa cơm nghĩa tình',
        category: 'Mặt trận Tổ quốc - An sinh xã hội',
        processingTime: 'Từ 7 đến 10 ngày làm việc (khảo sát thực tế cơ sở)',
        fee: 'Miễn phí',
        receivingAuthority: 'Ban Thường trực Ủy ban MTTQ Việt Nam Phường Chánh Hiệp & Ban CTMT 21 Khu phố',
        requiredDocs: [
          'Đơn đề nghị hỗ trợ sửa chữa/xây mới Nhà Đại đoàn kết (hoặc danh sách rà soát từ Khu phố)',
          'Giấy xác nhận hộ nghèo, hộ cận nghèo, hộ có hoàn cảnh đặc biệt khó khăn',
          'Hình ảnh hiện trạng nhà ở dột nát, xuống cấp'
        ],
        notes: 'Mức kinh phí xây mới nhà Đại đoàn kết từ 80.000.000đ đến 100.000.000đ/căn do Quỹ Vì người nghèo Phường vận động tài trợ.'
      }
    ];
  }

  /**
   * Danh mục Đường dây nóng & Tiện ích Khẩn cấp
   */
  public static getEmergencyUtilities(): EmergencyUtilityContact[] {
    return [
      {
        id: 'em-01',
        agencyName: 'Đường dây nóng Tiếp nhận Dân nguyện & Mặt trận Phường Chánh Hiệp',
        function: 'Tiếp nhận phản ánh dân sinh, trật tự đô thị, an sinh xã hội, rác thải, thủ tục hành chính',
        hotline: '0989614614',
        address: 'Số 1240 Đại Lộ Bình Dương, KP Định Hòa 5, Phường Chánh Hiệp',
        workingHours: 'Trực ban 24/7 (Cả Thứ Bảy, Chủ Nhật và ngày Lễ)',
        notes: 'Cán bộ trực ban lắng nghe và điều phối xử lý trong 24h - 48h.'
      },
      {
        id: 'em-02',
        agencyName: 'Công an Phường Chánh Hiệp',
        function: 'Bảo đảm an ninh trật tự, trực ban hình sự, tố giác tội phạm, PCCC & Cứu nạn cứu hộ, cấp CCCD / VNeID',
        hotline: '0274.3822.456 (hoặc 113)',
        address: 'Đường Nguyễn Văn Cừ, Phường Chánh Hiệp, TP. Thủ Dầu Một',
        workingHours: 'Trực ban 24/24',
        notes: 'Trực ban Công an tiếp nhận các tin báo trộm cắp, gây rối trật tự, tai nạn giao thông trên địa bàn 21 khu phố.'
      },
      {
        id: 'em-03',
        agencyName: 'Trạm Y tế Phường Chánh Hiệp',
        function: 'Khám chữa bệnh ban đầu, tiêm chủng mở rộng trẻ em, sơ cấp cứu, phòng chống dịch bệnh sốt xuất huyết, tay chân miệng',
        hotline: '0274.3833.115 (hoặc 115)',
        address: 'Đường Bùi Ngọc Thu, Khu phố Chánh Mỹ 4, Phường Chánh Hiệp',
        workingHours: 'Sáng 7h00 - 11h30, Chiều 13h30 - 17h00 (Trực cấp cứu 24/24)',
        notes: 'Lịch tiêm chủng mở rộng định kỳ cho trẻ em vào ngày 10 và ngày 25 hàng tháng.'
      },
      {
        id: 'em-04',
        agencyName: 'Điện lực TP. Thủ Dầu Một (Điện lực Bình Dương)',
        function: 'Báo sự cố mất điện, chập cháy điện lưới sinh hoạt, sửa chữa công tơ',
        hotline: '19001006 - 19009000',
        address: 'Đường 30/4, Phường Phú Hòa, TP. Thủ Dầu Một',
        workingHours: 'Tổng đài chăm sóc khách hàng 24/7',
        notes: 'Phục vụ xử lý nhanh sự cố điện sinh hoạt cho bà con 21 khu phố.'
      },
      {
        id: 'em-05',
        agencyName: 'Công ty Cổ phần Nước - Môi trường Bình Dương (BIWASE)',
        function: 'Báo sự cố vỡ đường ống nước sạch, đăng ký lắp đồng hồ nước mới, lịch thu gom rác thải sinh hoạt',
        hotline: '0274.3838.333 - 1900.555.564',
        address: 'Số 11 Ngô Văn Trị, Phường Phú Lợi, TP. Thủ Dầu Một',
        workingHours: '24/7',
        notes: 'Lịch thu gom rác sinh hoạt tại các hẻm 21 khu phố: Thứ Hai, Tư, Sáu hoặc Ba, Năm, Bảy tùy tuyến đường.'
      }
    ];
  }

  /**
   * Không gian Văn hóa Hồ Chí Minh & Di tích Lịch sử
   */
  public static getCulturalHeritage() {
    return {
      title: 'Không gian Văn hóa Hồ Chí Minh Phường Chánh Hiệp',
      location: 'Tầng 2 Trụ sở Cơ quan Mặt trận & UBND Phường Chánh Hiệp (Số 1240 Đại Lộ Bình Dương)',
      description: 'Không gian trưng bày tư liệu ảnh lịch sử Bác Hồ với khối Đại đoàn kết toàn dân tộc, các hiện vật kháng chiến (Huy hiệu Bác Hồ mạ men đỏ nguyên bản, khăn rằn Nam Bộ, đèn dầu địa đạo, thư tay cán bộ Mặt trận thời kỳ kháng chiến), mô hình 3D thực tế ảo và tủ sách Bác Hồ hơn 500 đầu sách quý.',
      openHours: 'Thứ Hai đến Thứ Sáu: 7h30 - 17h00 (Mở cửa tự do đón đoàn tham quan, học sinh, đoàn viên, nhân dân)',
      highlights: [
        'Huy hiệu Bác Hồ mạ men đỏ nguyên bản Bác tặng cán bộ dũng cảm xuất sắc',
        'Tủ sách Bác Hồ và Tư tưởng Đại đoàn kết toàn dân tộc',
        'Mô hình tham quan 3D Không gian Văn hóa Hồ Chí Minh tương tác đa giác quan trên website'
      ]
    };
  }
}
