import { WorkflowProcedure } from '../types/workflow';

export const INITIAL_WORKFLOW_PROCEDURES: WorkflowProcedure[] = [
  {
    "id": "wf-proc-01",
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
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "nodes": [
      {
        "id": "node-proc-01-1",
        "type": "START",
        "title": "Bắt đầu quy trình",
        "subtitle": "Xác định nhu cầu",
        "description": "Người dân có nhu cầu thực hiện thủ tục \"Cấp bản sao từ sổ gốc\".",
        "instruction": "Kiểm tra tính pháp lý ban đầu của tài liệu, giấy tờ cá nhân trước khi di chuyển.",
        "status": "DONE",
        "stepNumber": 1,
        "duration": "1 - 2 phút",
        "location": "Tại nhà / Trực tuyến"
      },
      {
        "id": "node-proc-01-2",
        "type": "DOCUMENT",
        "title": "Chuẩn bị hồ sơ",
        "subtitle": "Checklist giấy tờ",
        "description": "Chuẩn bị đầy đủ các thành phần hồ sơ theo Checklist quy định.",
        "instruction": "Đảm bảo các bản sao rõ ràng, không tẩy xóa, mang kèm bản chính đối chiếu.",
        "status": "WAITING",
        "stepNumber": 2,
        "duration": "10 phút",
        "location": "Chuẩn bị cá nhân",
        "requiredDocuments": [
          {
            "id": "wf-doc-proc-01-0",
            "name": "Tờ khai cấp bản sao từ sổ gốc (theo mẫu)",
            "required": true,
            "quantity": "01 bản"
          },
          {
            "id": "wf-doc-proc-01-1",
            "name": "Xuất trình CCCD gắn chip hoặc tài khoản VNeID mức 2",
            "required": true,
            "quantity": "01 bản"
          },
          {
            "id": "wf-doc-proc-01-2",
            "name": "Giấy tờ chứng minh quan hệ gia đình/ủy quyền (nếu yêu cầu cho người khác)",
            "required": false,
            "quantity": "01 bản"
          }
        ]
      },
      {
        "id": "node-proc-01-3",
        "type": "COUNTER",
        "title": "Đến Bộ phận Một cửa",
        "subtitle": "Nộp tại Quầy 1",
        "description": "Đến trực tiếp Bộ phận Tiếp nhận & Trả kết quả (Một cửa) UBND Phường Chánh Hiệp.",
        "instruction": "Lấy số thứ tự tại Kiosk đón tiếp, di chuyển đến Quầy số 1 để nộp hồ sơ.",
        "status": "WAITING",
        "stepNumber": 3,
        "duration": "5 - 10 phút",
        "counter": "Quầy số 1 - Chứng thực",
        "location": "UBND Phường Chánh Hiệp (1240 Đại lộ Bình Dương)"
      },
      {
        "id": "node-proc-01-4",
        "type": "VERIFY",
        "title": "Thẩm định đối chiếu",
        "subtitle": "Thẩm tra tính hợp lệ",
        "description": "Cán bộ Một cửa rà soát thành phần hồ sơ, đối chiếu bản gốc và bản chụp.",
        "instruction": "Cán bộ ghi sổ theo dõi, nhập mã hồ sơ điện tử và đưa phiếu hẹn trả kết quả.",
        "status": "WAITING",
        "stepNumber": 4,
        "duration": "10 - 20 phút",
        "counter": "Quầy số 1",
        "decisionChoices": [
          {
            "label": "Hồ sơ hợp lệ, tiếp nhận",
            "targetNodeId": "node-proc-01-5",
            "isPositive": true
          },
          {
            "label": "Thiếu thành phần, trả lại",
            "targetNodeId": "node-proc-01-2",
            "isPositive": false
          }
        ]
      },
      {
        "id": "node-proc-01-5",
        "type": "PROCESS",
        "title": "Ký duyệt & Đóng dấu",
        "subtitle": "Phê duyệt lãnh đạo",
        "description": "Trình Lãnh đạo UBND Phường xem xét, ký xác nhận vào Sổ chứng thực và văn bản.",
        "instruction": "Đóng dấu cơ quan, đóng dấu giáp lai đối với văn bản nhiều trang.",
        "status": "WAITING",
        "stepNumber": 5,
        "duration": "15 - 45 phút",
        "counter": "Phòng Tư pháp & Lãnh đạo UBND Phường"
      },
      {
        "id": "node-proc-01-6",
        "type": "RESULT",
        "title": "Nhận kết quả",
        "subtitle": "Hoàn tất thủ tục",
        "description": "Nhận lại hồ sơ gốc, các bản chứng thực và thanh toán lệ phí (mức phí: Miễn lệ phí).",
        "instruction": "Kiểm tra kỹ thông tin trong con dấu chứng thực, chữ ký lãnh đạo trước khi rời quầy.",
        "status": "WAITING",
        "stepNumber": 6,
        "duration": "2 - 3 phút",
        "counter": "Quầy trả kết quả Một cửa"
      }
    ],
    "edges": [
      {
        "id": "e-proc-01-1",
        "fromNodeId": "node-proc-01-1",
        "toNodeId": "node-proc-01-2",
        "label": "Bắt đầu"
      },
      {
        "id": "e-proc-01-2",
        "fromNodeId": "node-proc-01-2",
        "toNodeId": "node-proc-01-3",
        "label": "Đã chuẩn bị"
      },
      {
        "id": "e-proc-01-3",
        "fromNodeId": "node-proc-01-3",
        "toNodeId": "node-proc-01-4",
        "label": "Nộp tại quầy"
      },
      {
        "id": "e-proc-01-4",
        "fromNodeId": "node-proc-01-4",
        "toNodeId": "node-proc-01-5",
        "condition": "YES",
        "label": "Tiếp nhận"
      },
      {
        "id": "e-proc-01-5",
        "fromNodeId": "node-proc-01-5",
        "toNodeId": "node-proc-01-6",
        "label": "Ký duyệt xong"
      }
    ]
  },
  {
    "id": "wf-proc-02",
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
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "nodes": [
      {
        "id": "node-proc-02-1",
        "type": "START",
        "title": "Bắt đầu quy trình",
        "subtitle": "Xác định nhu cầu",
        "description": "Người dân có nhu cầu thực hiện thủ tục \"Chứng thực bản sao từ bản chính\".",
        "instruction": "Kiểm tra tính pháp lý ban đầu của tài liệu, giấy tờ cá nhân trước khi di chuyển.",
        "status": "DONE",
        "stepNumber": 1,
        "duration": "1 - 2 phút",
        "location": "Tại nhà / Trực tuyến"
      },
      {
        "id": "node-proc-02-2",
        "type": "DOCUMENT",
        "title": "Chuẩn bị hồ sơ",
        "subtitle": "Checklist giấy tờ",
        "description": "Chuẩn bị đầy đủ các thành phần hồ sơ theo Checklist quy định.",
        "instruction": "Đảm bảo các bản sao rõ ràng, không tẩy xóa, mang kèm bản chính đối chiếu.",
        "status": "WAITING",
        "stepNumber": 2,
        "duration": "10 phút",
        "location": "Chuẩn bị cá nhân",
        "requiredDocuments": [
          {
            "id": "wf-doc-proc-02-0",
            "name": "Bản chính giấy tờ, văn bản cần chứng thực",
            "required": true,
            "quantity": "01 bản gốc"
          },
          {
            "id": "wf-doc-proc-02-1",
            "name": "Bản sao (bản photo) tương ứng cần chứng thực",
            "required": true,
            "quantity": "Theo nhu cầu"
          },
          {
            "id": "wf-doc-proc-02-2",
            "name": "CCCD gắn chip hoặc tài khoản VNeID mức 2",
            "required": true,
            "quantity": "01 bản"
          }
        ]
      },
      {
        "id": "node-proc-02-3",
        "type": "COUNTER",
        "title": "Đến Bộ phận Một cửa",
        "subtitle": "Nộp tại Quầy 1",
        "description": "Đến trực tiếp Bộ phận Tiếp nhận & Trả kết quả (Một cửa) UBND Phường Chánh Hiệp.",
        "instruction": "Lấy số thứ tự tại Kiosk đón tiếp, di chuyển đến Quầy số 1 để nộp hồ sơ.",
        "status": "WAITING",
        "stepNumber": 3,
        "duration": "5 - 10 phút",
        "counter": "Quầy số 1 - Chứng thực",
        "location": "UBND Phường Chánh Hiệp (1240 Đại lộ Bình Dương)"
      },
      {
        "id": "node-proc-02-4",
        "type": "VERIFY",
        "title": "Thẩm định đối chiếu",
        "subtitle": "Thẩm tra tính hợp lệ",
        "description": "Cán bộ Một cửa rà soát thành phần hồ sơ, đối chiếu bản gốc và bản chụp.",
        "instruction": "Cán bộ ghi sổ theo dõi, nhập mã hồ sơ điện tử và đưa phiếu hẹn trả kết quả.",
        "status": "WAITING",
        "stepNumber": 4,
        "duration": "10 - 20 phút",
        "counter": "Quầy số 1",
        "decisionChoices": [
          {
            "label": "Hồ sơ hợp lệ, tiếp nhận",
            "targetNodeId": "node-proc-02-5",
            "isPositive": true
          },
          {
            "label": "Thiếu thành phần, trả lại",
            "targetNodeId": "node-proc-02-2",
            "isPositive": false
          }
        ]
      },
      {
        "id": "node-proc-02-5",
        "type": "PROCESS",
        "title": "Ký duyệt & Đóng dấu",
        "subtitle": "Phê duyệt lãnh đạo",
        "description": "Trình Lãnh đạo UBND Phường xem xét, ký xác nhận vào Sổ chứng thực và văn bản.",
        "instruction": "Đóng dấu cơ quan, đóng dấu giáp lai đối với văn bản nhiều trang.",
        "status": "WAITING",
        "stepNumber": 5,
        "duration": "15 - 45 phút",
        "counter": "Phòng Tư pháp & Lãnh đạo UBND Phường"
      },
      {
        "id": "node-proc-02-6",
        "type": "RESULT",
        "title": "Nhận kết quả",
        "subtitle": "Hoàn tất thủ tục",
        "description": "Nhận lại hồ sơ gốc, các bản chứng thực và thanh toán lệ phí (mức phí: 2.000 đồng/trang; từ trang thứ 3 trở lên thu 1.000 đồng/trang, tối đa 200.000 đồng/bản).",
        "instruction": "Kiểm tra kỹ thông tin trong con dấu chứng thực, chữ ký lãnh đạo trước khi rời quầy.",
        "status": "WAITING",
        "stepNumber": 6,
        "duration": "2 - 3 phút",
        "counter": "Quầy trả kết quả Một cửa"
      }
    ],
    "edges": [
      {
        "id": "e-proc-02-1",
        "fromNodeId": "node-proc-02-1",
        "toNodeId": "node-proc-02-2",
        "label": "Bắt đầu"
      },
      {
        "id": "e-proc-02-2",
        "fromNodeId": "node-proc-02-2",
        "toNodeId": "node-proc-02-3",
        "label": "Đã chuẩn bị"
      },
      {
        "id": "e-proc-02-3",
        "fromNodeId": "node-proc-02-3",
        "toNodeId": "node-proc-02-4",
        "label": "Nộp tại quầy"
      },
      {
        "id": "e-proc-02-4",
        "fromNodeId": "node-proc-02-4",
        "toNodeId": "node-proc-02-5",
        "condition": "YES",
        "label": "Tiếp nhận"
      },
      {
        "id": "e-proc-02-5",
        "fromNodeId": "node-proc-02-5",
        "toNodeId": "node-proc-02-6",
        "label": "Ký duyệt xong"
      }
    ]
  },
  {
    "id": "wf-proc-03",
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
    "onlineUrl": "",
    "processingTime": "Ngay trong ngày làm việc",
    "fee": "10.000 đồng/trường hợp",
    "officialSourceUrl": "https://dichvucong.gov.vn",
    "sourceUpdatedAt": "2025-11-13",
    "active": true,
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "nodes": [
      {
        "id": "node-proc-03-1",
        "type": "START",
        "title": "Bắt đầu quy trình",
        "subtitle": "Xác định nhu cầu",
        "description": "Người dân có nhu cầu thực hiện thủ tục \"Chứng thực chữ ký\".",
        "instruction": "Kiểm tra tính pháp lý ban đầu của tài liệu, giấy tờ cá nhân trước khi di chuyển.",
        "status": "DONE",
        "stepNumber": 1,
        "duration": "1 - 2 phút",
        "location": "Tại nhà / Trực tuyến"
      },
      {
        "id": "node-proc-03-2",
        "type": "DOCUMENT",
        "title": "Chuẩn bị hồ sơ",
        "subtitle": "Checklist giấy tờ",
        "description": "Chuẩn bị đầy đủ các thành phần hồ sơ theo Checklist quy định.",
        "instruction": "Đảm bảo các bản sao rõ ràng, không tẩy xóa, mang kèm bản chính đối chiếu.",
        "status": "WAITING",
        "stepNumber": 2,
        "duration": "10 phút",
        "location": "Chuẩn bị cá nhân",
        "requiredDocuments": [
          {
            "id": "wf-doc-proc-03-0",
            "name": "Giấy tờ, văn bản cần chứng thực chữ ký",
            "required": true,
            "quantity": "Theo nhu cầu"
          },
          {
            "id": "wf-doc-proc-03-1",
            "name": "Bản chính CCCD gắn chip hoặc VNeID mức 2",
            "required": true,
            "quantity": "01 bản"
          }
        ]
      },
      {
        "id": "node-proc-03-3",
        "type": "COUNTER",
        "title": "Đến Bộ phận Một cửa",
        "subtitle": "Nộp tại Quầy 1",
        "description": "Đến trực tiếp Bộ phận Tiếp nhận & Trả kết quả (Một cửa) UBND Phường Chánh Hiệp.",
        "instruction": "Lấy số thứ tự tại Kiosk đón tiếp, di chuyển đến Quầy số 1 để nộp hồ sơ.",
        "status": "WAITING",
        "stepNumber": 3,
        "duration": "5 - 10 phút",
        "counter": "Quầy số 1 - Chứng thực",
        "location": "UBND Phường Chánh Hiệp (1240 Đại lộ Bình Dương)"
      },
      {
        "id": "node-proc-03-4",
        "type": "VERIFY",
        "title": "Thẩm định đối chiếu",
        "subtitle": "Thẩm tra tính hợp lệ",
        "description": "Cán bộ Một cửa rà soát thành phần hồ sơ, đối chiếu bản gốc và bản chụp.",
        "instruction": "Cán bộ ghi sổ theo dõi, nhập mã hồ sơ điện tử và đưa phiếu hẹn trả kết quả.",
        "status": "WAITING",
        "stepNumber": 4,
        "duration": "10 - 20 phút",
        "counter": "Quầy số 1",
        "decisionChoices": [
          {
            "label": "Hồ sơ hợp lệ, tiếp nhận",
            "targetNodeId": "node-proc-03-5",
            "isPositive": true
          },
          {
            "label": "Thiếu thành phần, trả lại",
            "targetNodeId": "node-proc-03-2",
            "isPositive": false
          }
        ]
      },
      {
        "id": "node-proc-03-5",
        "type": "PROCESS",
        "title": "Ký duyệt & Đóng dấu",
        "subtitle": "Phê duyệt lãnh đạo",
        "description": "Trình Lãnh đạo UBND Phường xem xét, ký xác nhận vào Sổ chứng thực và văn bản.",
        "instruction": "Đóng dấu cơ quan, đóng dấu giáp lai đối với văn bản nhiều trang.",
        "status": "WAITING",
        "stepNumber": 5,
        "duration": "15 - 45 phút",
        "counter": "Phòng Tư pháp & Lãnh đạo UBND Phường"
      },
      {
        "id": "node-proc-03-6",
        "type": "RESULT",
        "title": "Nhận kết quả",
        "subtitle": "Hoàn tất thủ tục",
        "description": "Nhận lại hồ sơ gốc, các bản chứng thực và thanh toán lệ phí (mức phí: 10.000 đồng/trường hợp).",
        "instruction": "Kiểm tra kỹ thông tin trong con dấu chứng thực, chữ ký lãnh đạo trước khi rời quầy.",
        "status": "WAITING",
        "stepNumber": 6,
        "duration": "2 - 3 phút",
        "counter": "Quầy trả kết quả Một cửa"
      }
    ],
    "edges": [
      {
        "id": "e-proc-03-1",
        "fromNodeId": "node-proc-03-1",
        "toNodeId": "node-proc-03-2",
        "label": "Bắt đầu"
      },
      {
        "id": "e-proc-03-2",
        "fromNodeId": "node-proc-03-2",
        "toNodeId": "node-proc-03-3",
        "label": "Đã chuẩn bị"
      },
      {
        "id": "e-proc-03-3",
        "fromNodeId": "node-proc-03-3",
        "toNodeId": "node-proc-03-4",
        "label": "Nộp tại quầy"
      },
      {
        "id": "e-proc-03-4",
        "fromNodeId": "node-proc-03-4",
        "toNodeId": "node-proc-03-5",
        "condition": "YES",
        "label": "Tiếp nhận"
      },
      {
        "id": "e-proc-03-5",
        "fromNodeId": "node-proc-03-5",
        "toNodeId": "node-proc-03-6",
        "label": "Ký duyệt xong"
      }
    ]
  },
  {
    "id": "wf-proc-04",
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
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "nodes": [
      {
        "id": "node-proc-04-1",
        "type": "START",
        "title": "Bắt đầu quy trình",
        "subtitle": "Xác định nhu cầu",
        "description": "Người dân có nhu cầu thực hiện thủ tục \"Chứng thực chữ ký người dịch (Cộng tác viên)\".",
        "instruction": "Kiểm tra tính pháp lý ban đầu của tài liệu, giấy tờ cá nhân trước khi di chuyển.",
        "status": "DONE",
        "stepNumber": 1,
        "duration": "1 - 2 phút",
        "location": "Tại nhà / Trực tuyến"
      },
      {
        "id": "node-proc-04-2",
        "type": "DOCUMENT",
        "title": "Chuẩn bị hồ sơ",
        "subtitle": "Checklist giấy tờ",
        "description": "Chuẩn bị đầy đủ các thành phần hồ sơ theo Checklist quy định.",
        "instruction": "Đảm bảo các bản sao rõ ràng, không tẩy xóa, mang kèm bản chính đối chiếu.",
        "status": "WAITING",
        "stepNumber": 2,
        "duration": "10 phút",
        "location": "Chuẩn bị cá nhân",
        "requiredDocuments": [
          {
            "id": "wf-doc-proc-04-0",
            "name": "Bản chính văn bản, giấy tờ cần dịch",
            "required": true,
            "quantity": "01 bản gốc"
          },
          {
            "id": "wf-doc-proc-04-1",
            "name": "Bản dịch hoàn chỉnh (do CTV thực hiện)",
            "required": true,
            "quantity": "Theo nhu cầu"
          },
          {
            "id": "wf-doc-proc-04-2",
            "name": "CCCD và Giấy tờ chứng minh là CTV dịch thuật của Phường",
            "required": true,
            "quantity": "01 bản"
          }
        ]
      },
      {
        "id": "node-proc-04-3",
        "type": "COUNTER",
        "title": "Đến Bộ phận Một cửa",
        "subtitle": "Nộp tại Quầy 1",
        "description": "Đến trực tiếp Bộ phận Tiếp nhận & Trả kết quả (Một cửa) UBND Phường Chánh Hiệp.",
        "instruction": "Lấy số thứ tự tại Kiosk đón tiếp, di chuyển đến Quầy số 1 để nộp hồ sơ.",
        "status": "WAITING",
        "stepNumber": 3,
        "duration": "5 - 10 phút",
        "counter": "Quầy số 1 - Chứng thực",
        "location": "UBND Phường Chánh Hiệp (1240 Đại lộ Bình Dương)"
      },
      {
        "id": "node-proc-04-4",
        "type": "VERIFY",
        "title": "Thẩm định đối chiếu",
        "subtitle": "Thẩm tra tính hợp lệ",
        "description": "Cán bộ Một cửa rà soát thành phần hồ sơ, đối chiếu bản gốc và bản chụp.",
        "instruction": "Cán bộ ghi sổ theo dõi, nhập mã hồ sơ điện tử và đưa phiếu hẹn trả kết quả.",
        "status": "WAITING",
        "stepNumber": 4,
        "duration": "10 - 20 phút",
        "counter": "Quầy số 1",
        "decisionChoices": [
          {
            "label": "Hồ sơ hợp lệ, tiếp nhận",
            "targetNodeId": "node-proc-04-5",
            "isPositive": true
          },
          {
            "label": "Thiếu thành phần, trả lại",
            "targetNodeId": "node-proc-04-2",
            "isPositive": false
          }
        ]
      },
      {
        "id": "node-proc-04-5",
        "type": "PROCESS",
        "title": "Ký duyệt & Đóng dấu",
        "subtitle": "Phê duyệt lãnh đạo",
        "description": "Trình Lãnh đạo UBND Phường xem xét, ký xác nhận vào Sổ chứng thực và văn bản.",
        "instruction": "Đóng dấu cơ quan, đóng dấu giáp lai đối với văn bản nhiều trang.",
        "status": "WAITING",
        "stepNumber": 5,
        "duration": "15 - 45 phút",
        "counter": "Phòng Tư pháp & Lãnh đạo UBND Phường"
      },
      {
        "id": "node-proc-04-6",
        "type": "RESULT",
        "title": "Nhận kết quả",
        "subtitle": "Hoàn tất thủ tục",
        "description": "Nhận lại hồ sơ gốc, các bản chứng thực và thanh toán lệ phí (mức phí: 10.000 đồng/trường hợp).",
        "instruction": "Kiểm tra kỹ thông tin trong con dấu chứng thực, chữ ký lãnh đạo trước khi rời quầy.",
        "status": "WAITING",
        "stepNumber": 6,
        "duration": "2 - 3 phút",
        "counter": "Quầy trả kết quả Một cửa"
      }
    ],
    "edges": [
      {
        "id": "e-proc-04-1",
        "fromNodeId": "node-proc-04-1",
        "toNodeId": "node-proc-04-2",
        "label": "Bắt đầu"
      },
      {
        "id": "e-proc-04-2",
        "fromNodeId": "node-proc-04-2",
        "toNodeId": "node-proc-04-3",
        "label": "Đã chuẩn bị"
      },
      {
        "id": "e-proc-04-3",
        "fromNodeId": "node-proc-04-3",
        "toNodeId": "node-proc-04-4",
        "label": "Nộp tại quầy"
      },
      {
        "id": "e-proc-04-4",
        "fromNodeId": "node-proc-04-4",
        "toNodeId": "node-proc-04-5",
        "condition": "YES",
        "label": "Tiếp nhận"
      },
      {
        "id": "e-proc-04-5",
        "fromNodeId": "node-proc-04-5",
        "toNodeId": "node-proc-04-6",
        "label": "Ký duyệt xong"
      }
    ]
  },
  {
    "id": "wf-proc-05",
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
    "onlineUrl": "",
    "processingTime": "Ngay trong ngày làm việc",
    "fee": "10.000 đồng/trường hợp",
    "officialSourceUrl": "https://dichvucong.gov.vn",
    "sourceUpdatedAt": "2025-11-13",
    "active": true,
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "nodes": [
      {
        "id": "node-proc-05-1",
        "type": "START",
        "title": "Bắt đầu quy trình",
        "subtitle": "Xác định nhu cầu",
        "description": "Người dân có nhu cầu thực hiện thủ tục \"Chứng thực chữ ký người dịch (Không phải CTV)\".",
        "instruction": "Kiểm tra tính pháp lý ban đầu của tài liệu, giấy tờ cá nhân trước khi di chuyển.",
        "status": "DONE",
        "stepNumber": 1,
        "duration": "1 - 2 phút",
        "location": "Tại nhà / Trực tuyến"
      },
      {
        "id": "node-proc-05-2",
        "type": "DOCUMENT",
        "title": "Chuẩn bị hồ sơ",
        "subtitle": "Checklist giấy tờ",
        "description": "Chuẩn bị đầy đủ các thành phần hồ sơ theo Checklist quy định.",
        "instruction": "Đảm bảo các bản sao rõ ràng, không tẩy xóa, mang kèm bản chính đối chiếu.",
        "status": "WAITING",
        "stepNumber": 2,
        "duration": "10 phút",
        "location": "Chuẩn bị cá nhân",
        "requiredDocuments": [
          {
            "id": "wf-doc-proc-05-0",
            "name": "Bản gốc giấy tờ cần dịch",
            "required": true,
            "quantity": "01 bản gốc"
          },
          {
            "id": "wf-doc-proc-05-1",
            "name": "Bản dịch kèm theo",
            "required": true,
            "quantity": "Theo nhu cầu"
          },
          {
            "id": "wf-doc-proc-05-2",
            "name": "Bằng tốt nghiệp Đại học chuyên ngành ngoại ngữ tương ứng (hoặc tương đương)",
            "required": true,
            "quantity": "01 bản gốc và 01 bản photo đối chiếu"
          },
          {
            "id": "wf-doc-proc-05-3",
            "name": "CCCD gắn chip của người dịch",
            "required": true,
            "quantity": "01 bản"
          }
        ]
      },
      {
        "id": "node-proc-05-3",
        "type": "COUNTER",
        "title": "Đến Bộ phận Một cửa",
        "subtitle": "Nộp tại Quầy 1",
        "description": "Đến trực tiếp Bộ phận Tiếp nhận & Trả kết quả (Một cửa) UBND Phường Chánh Hiệp.",
        "instruction": "Lấy số thứ tự tại Kiosk đón tiếp, di chuyển đến Quầy số 1 để nộp hồ sơ.",
        "status": "WAITING",
        "stepNumber": 3,
        "duration": "5 - 10 phút",
        "counter": "Quầy số 1 - Chứng thực",
        "location": "UBND Phường Chánh Hiệp (1240 Đại lộ Bình Dương)"
      },
      {
        "id": "node-proc-05-4",
        "type": "VERIFY",
        "title": "Thẩm định đối chiếu",
        "subtitle": "Thẩm tra tính hợp lệ",
        "description": "Cán bộ Một cửa rà soát thành phần hồ sơ, đối chiếu bản gốc và bản chụp.",
        "instruction": "Cán bộ ghi sổ theo dõi, nhập mã hồ sơ điện tử và đưa phiếu hẹn trả kết quả.",
        "status": "WAITING",
        "stepNumber": 4,
        "duration": "10 - 20 phút",
        "counter": "Quầy số 1",
        "decisionChoices": [
          {
            "label": "Hồ sơ hợp lệ, tiếp nhận",
            "targetNodeId": "node-proc-05-5",
            "isPositive": true
          },
          {
            "label": "Thiếu thành phần, trả lại",
            "targetNodeId": "node-proc-05-2",
            "isPositive": false
          }
        ]
      },
      {
        "id": "node-proc-05-5",
        "type": "PROCESS",
        "title": "Ký duyệt & Đóng dấu",
        "subtitle": "Phê duyệt lãnh đạo",
        "description": "Trình Lãnh đạo UBND Phường xem xét, ký xác nhận vào Sổ chứng thực và văn bản.",
        "instruction": "Đóng dấu cơ quan, đóng dấu giáp lai đối với văn bản nhiều trang.",
        "status": "WAITING",
        "stepNumber": 5,
        "duration": "15 - 45 phút",
        "counter": "Phòng Tư pháp & Lãnh đạo UBND Phường"
      },
      {
        "id": "node-proc-05-6",
        "type": "RESULT",
        "title": "Nhận kết quả",
        "subtitle": "Hoàn tất thủ tục",
        "description": "Nhận lại hồ sơ gốc, các bản chứng thực và thanh toán lệ phí (mức phí: 10.000 đồng/trường hợp).",
        "instruction": "Kiểm tra kỹ thông tin trong con dấu chứng thực, chữ ký lãnh đạo trước khi rời quầy.",
        "status": "WAITING",
        "stepNumber": 6,
        "duration": "2 - 3 phút",
        "counter": "Quầy trả kết quả Một cửa"
      }
    ],
    "edges": [
      {
        "id": "e-proc-05-1",
        "fromNodeId": "node-proc-05-1",
        "toNodeId": "node-proc-05-2",
        "label": "Bắt đầu"
      },
      {
        "id": "e-proc-05-2",
        "fromNodeId": "node-proc-05-2",
        "toNodeId": "node-proc-05-3",
        "label": "Đã chuẩn bị"
      },
      {
        "id": "e-proc-05-3",
        "fromNodeId": "node-proc-05-3",
        "toNodeId": "node-proc-05-4",
        "label": "Nộp tại quầy"
      },
      {
        "id": "e-proc-05-4",
        "fromNodeId": "node-proc-05-4",
        "toNodeId": "node-proc-05-5",
        "condition": "YES",
        "label": "Tiếp nhận"
      },
      {
        "id": "e-proc-05-5",
        "fromNodeId": "node-proc-05-5",
        "toNodeId": "node-proc-05-6",
        "label": "Ký duyệt xong"
      }
    ]
  },
  {
    "id": "wf-proc-06",
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
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "nodes": [
      {
        "id": "node-proc-06-1",
        "type": "START",
        "title": "Bắt đầu quy trình",
        "subtitle": "Xác định nhu cầu",
        "description": "Người dân có nhu cầu thực hiện thủ tục \"Chứng thực hợp đồng, giao dịch tài sản\".",
        "instruction": "Kiểm tra tính pháp lý ban đầu của tài liệu, giấy tờ cá nhân trước khi di chuyển.",
        "status": "DONE",
        "stepNumber": 1,
        "duration": "1 - 2 phút",
        "location": "Tại nhà / Trực tuyến"
      },
      {
        "id": "node-proc-06-2",
        "type": "DOCUMENT",
        "title": "Chuẩn bị hồ sơ",
        "subtitle": "Checklist giấy tờ",
        "description": "Chuẩn bị đầy đủ các thành phần hồ sơ theo Checklist quy định.",
        "instruction": "Đảm bảo các bản sao rõ ràng, không tẩy xóa, mang kèm bản chính đối chiếu.",
        "status": "WAITING",
        "stepNumber": 2,
        "duration": "10 phút",
        "location": "Chuẩn bị cá nhân",
        "requiredDocuments": [
          {
            "id": "wf-doc-proc-06-0",
            "name": "Dự thảo Hợp đồng, Giao dịch (mua bán, tặng cho, thế chấp...)",
            "required": true,
            "quantity": "03 bản gốc"
          },
          {
            "id": "wf-doc-proc-06-1",
            "name": "Giấy chứng nhận quyền sở hữu tài sản (Sổ đỏ, Đăng ký xe gốc...)",
            "required": true,
            "quantity": "01 bản gốc kèm bản photo đối chiếu"
          },
          {
            "id": "wf-doc-proc-06-2",
            "name": "CCCD gắn chip của các bên tham gia giao dịch",
            "required": true,
            "quantity": "Các bản gốc đối chiếu"
          },
          {
            "id": "wf-doc-proc-06-3",
            "name": "Giấy tờ chứng minh tình trạng hôn nhân (Độc thân / Đăng ký kết hôn)",
            "required": true,
            "quantity": "01 bản"
          }
        ]
      },
      {
        "id": "node-proc-06-3",
        "type": "COUNTER",
        "title": "Đến Bộ phận Một cửa",
        "subtitle": "Nộp tại Quầy 1",
        "description": "Đến trực tiếp Bộ phận Tiếp nhận & Trả kết quả (Một cửa) UBND Phường Chánh Hiệp.",
        "instruction": "Lấy số thứ tự tại Kiosk đón tiếp, di chuyển đến Quầy số 1 để nộp hồ sơ.",
        "status": "WAITING",
        "stepNumber": 3,
        "duration": "5 - 10 phút",
        "counter": "Quầy số 1 - Chứng thực",
        "location": "UBND Phường Chánh Hiệp (1240 Đại lộ Bình Dương)"
      },
      {
        "id": "node-proc-06-4",
        "type": "VERIFY",
        "title": "Thẩm định đối chiếu",
        "subtitle": "Thẩm tra tính hợp lệ",
        "description": "Cán bộ Một cửa rà soát thành phần hồ sơ, đối chiếu bản gốc và bản chụp.",
        "instruction": "Cán bộ ghi sổ theo dõi, nhập mã hồ sơ điện tử và đưa phiếu hẹn trả kết quả.",
        "status": "WAITING",
        "stepNumber": 4,
        "duration": "10 - 20 phút",
        "counter": "Quầy số 1",
        "decisionChoices": [
          {
            "label": "Hồ sơ hợp lệ, tiếp nhận",
            "targetNodeId": "node-proc-06-5",
            "isPositive": true
          },
          {
            "label": "Thiếu thành phần, trả lại",
            "targetNodeId": "node-proc-06-2",
            "isPositive": false
          }
        ]
      },
      {
        "id": "node-proc-06-5",
        "type": "PROCESS",
        "title": "Ký duyệt & Đóng dấu",
        "subtitle": "Phê duyệt lãnh đạo",
        "description": "Trình Lãnh đạo UBND Phường xem xét, ký xác nhận vào Sổ chứng thực và văn bản.",
        "instruction": "Đóng dấu cơ quan, đóng dấu giáp lai đối với văn bản nhiều trang.",
        "status": "WAITING",
        "stepNumber": 5,
        "duration": "1 - 2 ngày",
        "counter": "Phòng Tư pháp & Lãnh đạo UBND Phường"
      },
      {
        "id": "node-proc-06-6",
        "type": "RESULT",
        "title": "Nhận kết quả",
        "subtitle": "Hoàn tất thủ tục",
        "description": "Nhận lại hồ sơ gốc, các bản chứng thực và thanh toán lệ phí (mức phí: 50.000 đồng/giao dịch).",
        "instruction": "Kiểm tra kỹ thông tin trong con dấu chứng thực, chữ ký lãnh đạo trước khi rời quầy.",
        "status": "WAITING",
        "stepNumber": 6,
        "duration": "2 - 3 phút",
        "counter": "Quầy trả kết quả Một cửa"
      }
    ],
    "edges": [
      {
        "id": "e-proc-06-1",
        "fromNodeId": "node-proc-06-1",
        "toNodeId": "node-proc-06-2",
        "label": "Bắt đầu"
      },
      {
        "id": "e-proc-06-2",
        "fromNodeId": "node-proc-06-2",
        "toNodeId": "node-proc-06-3",
        "label": "Đã chuẩn bị"
      },
      {
        "id": "e-proc-06-3",
        "fromNodeId": "node-proc-06-3",
        "toNodeId": "node-proc-06-4",
        "label": "Nộp tại quầy"
      },
      {
        "id": "e-proc-06-4",
        "fromNodeId": "node-proc-06-4",
        "toNodeId": "node-proc-06-5",
        "condition": "YES",
        "label": "Tiếp nhận"
      },
      {
        "id": "e-proc-06-5",
        "fromNodeId": "node-proc-06-5",
        "toNodeId": "node-proc-06-6",
        "label": "Ký duyệt xong"
      }
    ]
  },
  {
    "id": "wf-proc-07",
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
    "onlineUrl": "",
    "processingTime": "Không quá 02 ngày làm việc",
    "fee": "50.000 đồng/di chúc",
    "officialSourceUrl": "https://dichvucong.gov.vn",
    "sourceUpdatedAt": "2025-11-13",
    "active": true,
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "nodes": [
      {
        "id": "node-proc-07-1",
        "type": "START",
        "title": "Bắt đầu quy trình",
        "subtitle": "Xác định nhu cầu",
        "description": "Người dân có nhu cầu thực hiện thủ tục \"Chứng thực di chúc\".",
        "instruction": "Kiểm tra tính pháp lý ban đầu của tài liệu, giấy tờ cá nhân trước khi di chuyển.",
        "status": "DONE",
        "stepNumber": 1,
        "duration": "1 - 2 phút",
        "location": "Tại nhà / Trực tuyến"
      },
      {
        "id": "node-proc-07-2",
        "type": "DOCUMENT",
        "title": "Chuẩn bị hồ sơ",
        "subtitle": "Checklist giấy tờ",
        "description": "Chuẩn bị đầy đủ các thành phần hồ sơ theo Checklist quy định.",
        "instruction": "Đảm bảo các bản sao rõ ràng, không tẩy xóa, mang kèm bản chính đối chiếu.",
        "status": "WAITING",
        "stepNumber": 2,
        "duration": "10 phút",
        "location": "Chuẩn bị cá nhân",
        "requiredDocuments": [
          {
            "id": "wf-doc-proc-07-0",
            "name": "Dự thảo di chúc (nếu lập sẵn)",
            "required": false,
            "quantity": "03 bản"
          },
          {
            "id": "wf-doc-proc-07-1",
            "name": "Giấy khám sức khỏe xác nhận tinh thần minh mẫn (bắt buộc, cấp trong 30 ngày)",
            "required": true,
            "quantity": "01 bản gốc"
          },
          {
            "id": "wf-doc-proc-07-2",
            "name": "Giấy tờ sở hữu tài sản (Sổ đỏ, Sổ tiết kiệm gốc...)",
            "required": true,
            "quantity": "01 bản gốc kèm photo"
          },
          {
            "id": "wf-doc-proc-07-3",
            "name": "CCCD gắn chip của người lập di chúc",
            "required": true,
            "quantity": "01 bản chính"
          }
        ]
      },
      {
        "id": "node-proc-07-3",
        "type": "COUNTER",
        "title": "Đến Bộ phận Một cửa",
        "subtitle": "Nộp tại Quầy 1",
        "description": "Đến trực tiếp Bộ phận Tiếp nhận & Trả kết quả (Một cửa) UBND Phường Chánh Hiệp.",
        "instruction": "Lấy số thứ tự tại Kiosk đón tiếp, di chuyển đến Quầy số 1 để nộp hồ sơ.",
        "status": "WAITING",
        "stepNumber": 3,
        "duration": "5 - 10 phút",
        "counter": "Quầy số 1 - Chứng thực",
        "location": "UBND Phường Chánh Hiệp (1240 Đại lộ Bình Dương)"
      },
      {
        "id": "node-proc-07-4",
        "type": "VERIFY",
        "title": "Thẩm định đối chiếu",
        "subtitle": "Thẩm tra tính hợp lệ",
        "description": "Cán bộ Một cửa rà soát thành phần hồ sơ, đối chiếu bản gốc và bản chụp.",
        "instruction": "Cán bộ ghi sổ theo dõi, nhập mã hồ sơ điện tử và đưa phiếu hẹn trả kết quả.",
        "status": "WAITING",
        "stepNumber": 4,
        "duration": "10 - 20 phút",
        "counter": "Quầy số 1",
        "decisionChoices": [
          {
            "label": "Hồ sơ hợp lệ, tiếp nhận",
            "targetNodeId": "node-proc-07-5",
            "isPositive": true
          },
          {
            "label": "Thiếu thành phần, trả lại",
            "targetNodeId": "node-proc-07-2",
            "isPositive": false
          }
        ]
      },
      {
        "id": "node-proc-07-5",
        "type": "PROCESS",
        "title": "Ký duyệt & Đóng dấu",
        "subtitle": "Phê duyệt lãnh đạo",
        "description": "Trình Lãnh đạo UBND Phường xem xét, ký xác nhận vào Sổ chứng thực và văn bản.",
        "instruction": "Đóng dấu cơ quan, đóng dấu giáp lai đối với văn bản nhiều trang.",
        "status": "WAITING",
        "stepNumber": 5,
        "duration": "1 - 2 ngày",
        "counter": "Phòng Tư pháp & Lãnh đạo UBND Phường"
      },
      {
        "id": "node-proc-07-6",
        "type": "RESULT",
        "title": "Nhận kết quả",
        "subtitle": "Hoàn tất thủ tục",
        "description": "Nhận lại hồ sơ gốc, các bản chứng thực và thanh toán lệ phí (mức phí: 50.000 đồng/di chúc).",
        "instruction": "Kiểm tra kỹ thông tin trong con dấu chứng thực, chữ ký lãnh đạo trước khi rời quầy.",
        "status": "WAITING",
        "stepNumber": 6,
        "duration": "2 - 3 phút",
        "counter": "Quầy trả kết quả Một cửa"
      }
    ],
    "edges": [
      {
        "id": "e-proc-07-1",
        "fromNodeId": "node-proc-07-1",
        "toNodeId": "node-proc-07-2",
        "label": "Bắt đầu"
      },
      {
        "id": "e-proc-07-2",
        "fromNodeId": "node-proc-07-2",
        "toNodeId": "node-proc-07-3",
        "label": "Đã chuẩn bị"
      },
      {
        "id": "e-proc-07-3",
        "fromNodeId": "node-proc-07-3",
        "toNodeId": "node-proc-07-4",
        "label": "Nộp tại quầy"
      },
      {
        "id": "e-proc-07-4",
        "fromNodeId": "node-proc-07-4",
        "toNodeId": "node-proc-07-5",
        "condition": "YES",
        "label": "Tiếp nhận"
      },
      {
        "id": "e-proc-07-5",
        "fromNodeId": "node-proc-07-5",
        "toNodeId": "node-proc-07-6",
        "label": "Ký duyệt xong"
      }
    ]
  },
  {
    "id": "wf-proc-08",
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
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "nodes": [
      {
        "id": "node-proc-08-1",
        "type": "START",
        "title": "Bắt đầu quy trình",
        "subtitle": "Xác định nhu cầu",
        "description": "Người dân có nhu cầu thực hiện thủ tục \"Chứng thực văn bản từ chối nhận di sản\".",
        "instruction": "Kiểm tra tính pháp lý ban đầu của tài liệu, giấy tờ cá nhân trước khi di chuyển.",
        "status": "DONE",
        "stepNumber": 1,
        "duration": "1 - 2 phút",
        "location": "Tại nhà / Trực tuyến"
      },
      {
        "id": "node-proc-08-2",
        "type": "DOCUMENT",
        "title": "Chuẩn bị hồ sơ",
        "subtitle": "Checklist giấy tờ",
        "description": "Chuẩn bị đầy đủ các thành phần hồ sơ theo Checklist quy định.",
        "instruction": "Đảm bảo các bản sao rõ ràng, không tẩy xóa, mang kèm bản chính đối chiếu.",
        "status": "WAITING",
        "stepNumber": 2,
        "duration": "10 phút",
        "location": "Chuẩn bị cá nhân",
        "requiredDocuments": [
          {
            "id": "wf-doc-proc-08-0",
            "name": "Dự thảo văn bản từ chối nhận di sản thừa kế",
            "required": true,
            "quantity": "03 bản gốc"
          },
          {
            "id": "wf-doc-proc-08-1",
            "name": "Giấy chứng tử của người để lại di sản",
            "required": true,
            "quantity": "01 bản chính hoặc trích lục"
          },
          {
            "id": "wf-doc-proc-08-2",
            "name": "Giấy tờ chứng minh quan hệ thừa kế (Khai sinh, Đăng ký kết hôn, Hộ khẩu cũ...)",
            "required": true,
            "quantity": "01 bản"
          },
          {
            "id": "wf-doc-proc-08-3",
            "name": "Giấy tờ sở hữu di sản của người quá cố (Sổ đỏ, đăng ký xe...)",
            "required": true,
            "quantity": "01 bản gốc"
          }
        ]
      },
      {
        "id": "node-proc-08-3",
        "type": "COUNTER",
        "title": "Đến Bộ phận Một cửa",
        "subtitle": "Nộp tại Quầy 1",
        "description": "Đến trực tiếp Bộ phận Tiếp nhận & Trả kết quả (Một cửa) UBND Phường Chánh Hiệp.",
        "instruction": "Lấy số thứ tự tại Kiosk đón tiếp, di chuyển đến Quầy số 1 để nộp hồ sơ.",
        "status": "WAITING",
        "stepNumber": 3,
        "duration": "5 - 10 phút",
        "counter": "Quầy số 1 - Chứng thực",
        "location": "UBND Phường Chánh Hiệp (1240 Đại lộ Bình Dương)"
      },
      {
        "id": "node-proc-08-4",
        "type": "VERIFY",
        "title": "Thẩm định đối chiếu",
        "subtitle": "Thẩm tra tính hợp lệ",
        "description": "Cán bộ Một cửa rà soát thành phần hồ sơ, đối chiếu bản gốc và bản chụp.",
        "instruction": "Cán bộ ghi sổ theo dõi, nhập mã hồ sơ điện tử và đưa phiếu hẹn trả kết quả.",
        "status": "WAITING",
        "stepNumber": 4,
        "duration": "10 - 20 phút",
        "counter": "Quầy số 1",
        "decisionChoices": [
          {
            "label": "Hồ sơ hợp lệ, tiếp nhận",
            "targetNodeId": "node-proc-08-5",
            "isPositive": true
          },
          {
            "label": "Thiếu thành phần, trả lại",
            "targetNodeId": "node-proc-08-2",
            "isPositive": false
          }
        ]
      },
      {
        "id": "node-proc-08-5",
        "type": "PROCESS",
        "title": "Ký duyệt & Đóng dấu",
        "subtitle": "Phê duyệt lãnh đạo",
        "description": "Trình Lãnh đạo UBND Phường xem xét, ký xác nhận vào Sổ chứng thực và văn bản.",
        "instruction": "Đóng dấu cơ quan, đóng dấu giáp lai đối với văn bản nhiều trang.",
        "status": "WAITING",
        "stepNumber": 5,
        "duration": "1 - 2 ngày",
        "counter": "Phòng Tư pháp & Lãnh đạo UBND Phường"
      },
      {
        "id": "node-proc-08-6",
        "type": "RESULT",
        "title": "Nhận kết quả",
        "subtitle": "Hoàn tất thủ tục",
        "description": "Nhận lại hồ sơ gốc, các bản chứng thực và thanh toán lệ phí (mức phí: 50.000 đồng/văn bản).",
        "instruction": "Kiểm tra kỹ thông tin trong con dấu chứng thực, chữ ký lãnh đạo trước khi rời quầy.",
        "status": "WAITING",
        "stepNumber": 6,
        "duration": "2 - 3 phút",
        "counter": "Quầy trả kết quả Một cửa"
      }
    ],
    "edges": [
      {
        "id": "e-proc-08-1",
        "fromNodeId": "node-proc-08-1",
        "toNodeId": "node-proc-08-2",
        "label": "Bắt đầu"
      },
      {
        "id": "e-proc-08-2",
        "fromNodeId": "node-proc-08-2",
        "toNodeId": "node-proc-08-3",
        "label": "Đã chuẩn bị"
      },
      {
        "id": "e-proc-08-3",
        "fromNodeId": "node-proc-08-3",
        "toNodeId": "node-proc-08-4",
        "label": "Nộp tại quầy"
      },
      {
        "id": "e-proc-08-4",
        "fromNodeId": "node-proc-08-4",
        "toNodeId": "node-proc-08-5",
        "condition": "YES",
        "label": "Tiếp nhận"
      },
      {
        "id": "e-proc-08-5",
        "fromNodeId": "node-proc-08-5",
        "toNodeId": "node-proc-08-6",
        "label": "Ký duyệt xong"
      }
    ]
  },
  {
    "id": "wf-proc-09",
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
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "nodes": [
      {
        "id": "node-proc-09-1",
        "type": "START",
        "title": "Bắt đầu quy trình",
        "subtitle": "Xác định nhu cầu",
        "description": "Người dân có nhu cầu thực hiện thủ tục \"Chứng thực văn bản phân chia di sản\".",
        "instruction": "Kiểm tra tính pháp lý ban đầu của tài liệu, giấy tờ cá nhân trước khi di chuyển.",
        "status": "DONE",
        "stepNumber": 1,
        "duration": "1 - 2 phút",
        "location": "Tại nhà / Trực tuyến"
      },
      {
        "id": "node-proc-09-2",
        "type": "DOCUMENT",
        "title": "Chuẩn bị hồ sơ",
        "subtitle": "Checklist giấy tờ",
        "description": "Chuẩn bị đầy đủ các thành phần hồ sơ theo Checklist quy định.",
        "instruction": "Đảm bảo các bản sao rõ ràng, không tẩy xóa, mang kèm bản chính đối chiếu.",
        "status": "WAITING",
        "stepNumber": 2,
        "duration": "10 phút",
        "location": "Chuẩn bị cá nhân",
        "requiredDocuments": [
          {
            "id": "wf-doc-proc-09-0",
            "name": "Dự thảo văn bản thỏa thuận phân chia di sản thừa kế",
            "required": true,
            "quantity": "04 bản gốc"
          },
          {
            "id": "wf-doc-proc-09-1",
            "name": "Giấy chứng tử của người để lại di sản",
            "required": true,
            "quantity": "01 bản chính"
          },
          {
            "id": "wf-doc-proc-09-2",
            "name": "Giấy tờ chứng minh quan hệ thừa kế của tất cả các đồng thừa kế",
            "required": true,
            "quantity": "Các bản gốc đối chiếu"
          },
          {
            "id": "wf-doc-proc-09-3",
            "name": "Giấy tờ tài sản thừa kế gốc (Sổ đỏ, giấy tờ xe...)",
            "required": true,
            "quantity": "01 bản gốc"
          }
        ]
      },
      {
        "id": "node-proc-09-3",
        "type": "COUNTER",
        "title": "Đến Bộ phận Một cửa",
        "subtitle": "Nộp tại Quầy 1",
        "description": "Đến trực tiếp Bộ phận Tiếp nhận & Trả kết quả (Một cửa) UBND Phường Chánh Hiệp.",
        "instruction": "Lấy số thứ tự tại Kiosk đón tiếp, di chuyển đến Quầy số 1 để nộp hồ sơ.",
        "status": "WAITING",
        "stepNumber": 3,
        "duration": "5 - 10 phút",
        "counter": "Quầy số 1 - Chứng thực",
        "location": "UBND Phường Chánh Hiệp (1240 Đại lộ Bình Dương)"
      },
      {
        "id": "node-proc-09-4",
        "type": "VERIFY",
        "title": "Thẩm định đối chiếu",
        "subtitle": "Thẩm tra tính hợp lệ",
        "description": "Cán bộ Một cửa rà soát thành phần hồ sơ, đối chiếu bản gốc và bản chụp.",
        "instruction": "Cán bộ ghi sổ theo dõi, nhập mã hồ sơ điện tử và đưa phiếu hẹn trả kết quả.",
        "status": "WAITING",
        "stepNumber": 4,
        "duration": "10 - 20 phút",
        "counter": "Quầy số 1",
        "decisionChoices": [
          {
            "label": "Hồ sơ hợp lệ, tiếp nhận",
            "targetNodeId": "node-proc-09-5",
            "isPositive": true
          },
          {
            "label": "Thiếu thành phần, trả lại",
            "targetNodeId": "node-proc-09-2",
            "isPositive": false
          }
        ]
      },
      {
        "id": "node-proc-09-5",
        "type": "PROCESS",
        "title": "Ký duyệt & Đóng dấu",
        "subtitle": "Phê duyệt lãnh đạo",
        "description": "Trình Lãnh đạo UBND Phường xem xét, ký xác nhận vào Sổ chứng thực và văn bản.",
        "instruction": "Đóng dấu cơ quan, đóng dấu giáp lai đối với văn bản nhiều trang.",
        "status": "WAITING",
        "stepNumber": 5,
        "duration": "1 - 2 ngày",
        "counter": "Phòng Tư pháp & Lãnh đạo UBND Phường"
      },
      {
        "id": "node-proc-09-6",
        "type": "RESULT",
        "title": "Nhận kết quả",
        "subtitle": "Hoàn tất thủ tục",
        "description": "Nhận lại hồ sơ gốc, các bản chứng thực và thanh toán lệ phí (mức phí: 50.000 đồng/văn bản).",
        "instruction": "Kiểm tra kỹ thông tin trong con dấu chứng thực, chữ ký lãnh đạo trước khi rời quầy.",
        "status": "WAITING",
        "stepNumber": 6,
        "duration": "2 - 3 phút",
        "counter": "Quầy trả kết quả Một cửa"
      }
    ],
    "edges": [
      {
        "id": "e-proc-09-1",
        "fromNodeId": "node-proc-09-1",
        "toNodeId": "node-proc-09-2",
        "label": "Bắt đầu"
      },
      {
        "id": "e-proc-09-2",
        "fromNodeId": "node-proc-09-2",
        "toNodeId": "node-proc-09-3",
        "label": "Đã chuẩn bị"
      },
      {
        "id": "e-proc-09-3",
        "fromNodeId": "node-proc-09-3",
        "toNodeId": "node-proc-09-4",
        "label": "Nộp tại quầy"
      },
      {
        "id": "e-proc-09-4",
        "fromNodeId": "node-proc-09-4",
        "toNodeId": "node-proc-09-5",
        "condition": "YES",
        "label": "Tiếp nhận"
      },
      {
        "id": "e-proc-09-5",
        "fromNodeId": "node-proc-09-5",
        "toNodeId": "node-proc-09-6",
        "label": "Ký duyệt xong"
      }
    ]
  },
  {
    "id": "wf-proc-10",
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
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "nodes": [
      {
        "id": "node-proc-10-1",
        "type": "START",
        "title": "Bắt đầu quy trình",
        "subtitle": "Xác định nhu cầu",
        "description": "Người dân có nhu cầu thực hiện thủ tục \"Sửa đổi, bổ sung, hủy bỏ giao dịch\".",
        "instruction": "Kiểm tra tính pháp lý ban đầu của tài liệu, giấy tờ cá nhân trước khi di chuyển.",
        "status": "DONE",
        "stepNumber": 1,
        "duration": "1 - 2 phút",
        "location": "Tại nhà / Trực tuyến"
      },
      {
        "id": "node-proc-10-2",
        "type": "DOCUMENT",
        "title": "Chuẩn bị hồ sơ",
        "subtitle": "Checklist giấy tờ",
        "description": "Chuẩn bị đầy đủ các thành phần hồ sơ theo Checklist quy định.",
        "instruction": "Đảm bảo các bản sao rõ ràng, không tẩy xóa, mang kèm bản chính đối chiếu.",
        "status": "WAITING",
        "stepNumber": 2,
        "duration": "10 phút",
        "location": "Chuẩn bị cá nhân",
        "requiredDocuments": [
          {
            "id": "wf-doc-proc-10-0",
            "name": "Hợp đồng, giao dịch gốc đã được chứng thực trước đây",
            "required": true,
            "quantity": "01 bản gốc"
          },
          {
            "id": "wf-doc-proc-10-1",
            "name": "Dự thảo Văn bản thỏa thuận sửa đổi, bổ sung hoặc hủy bỏ",
            "required": true,
            "quantity": "03 bản gốc"
          },
          {
            "id": "wf-doc-proc-10-2",
            "name": "CCCD gắn chip của các bên tham gia giao dịch gốc",
            "required": true,
            "quantity": "Bản chính đối chiếu"
          }
        ]
      },
      {
        "id": "node-proc-10-3",
        "type": "COUNTER",
        "title": "Đến Bộ phận Một cửa",
        "subtitle": "Nộp tại Quầy 1",
        "description": "Đến trực tiếp Bộ phận Tiếp nhận & Trả kết quả (Một cửa) UBND Phường Chánh Hiệp.",
        "instruction": "Lấy số thứ tự tại Kiosk đón tiếp, di chuyển đến Quầy số 1 để nộp hồ sơ.",
        "status": "WAITING",
        "stepNumber": 3,
        "duration": "5 - 10 phút",
        "counter": "Quầy số 1 - Chứng thực",
        "location": "UBND Phường Chánh Hiệp (1240 Đại lộ Bình Dương)"
      },
      {
        "id": "node-proc-10-4",
        "type": "VERIFY",
        "title": "Thẩm định đối chiếu",
        "subtitle": "Thẩm tra tính hợp lệ",
        "description": "Cán bộ Một cửa rà soát thành phần hồ sơ, đối chiếu bản gốc và bản chụp.",
        "instruction": "Cán bộ ghi sổ theo dõi, nhập mã hồ sơ điện tử và đưa phiếu hẹn trả kết quả.",
        "status": "WAITING",
        "stepNumber": 4,
        "duration": "10 - 20 phút",
        "counter": "Quầy số 1",
        "decisionChoices": [
          {
            "label": "Hồ sơ hợp lệ, tiếp nhận",
            "targetNodeId": "node-proc-10-5",
            "isPositive": true
          },
          {
            "label": "Thiếu thành phần, trả lại",
            "targetNodeId": "node-proc-10-2",
            "isPositive": false
          }
        ]
      },
      {
        "id": "node-proc-10-5",
        "type": "PROCESS",
        "title": "Ký duyệt & Đóng dấu",
        "subtitle": "Phê duyệt lãnh đạo",
        "description": "Trình Lãnh đạo UBND Phường xem xét, ký xác nhận vào Sổ chứng thực và văn bản.",
        "instruction": "Đóng dấu cơ quan, đóng dấu giáp lai đối với văn bản nhiều trang.",
        "status": "WAITING",
        "stepNumber": 5,
        "duration": "15 - 45 phút",
        "counter": "Phòng Tư pháp & Lãnh đạo UBND Phường"
      },
      {
        "id": "node-proc-10-6",
        "type": "RESULT",
        "title": "Nhận kết quả",
        "subtitle": "Hoàn tất thủ tục",
        "description": "Nhận lại hồ sơ gốc, các bản chứng thực và thanh toán lệ phí (mức phí: 30.000 đồng/giao dịch).",
        "instruction": "Kiểm tra kỹ thông tin trong con dấu chứng thực, chữ ký lãnh đạo trước khi rời quầy.",
        "status": "WAITING",
        "stepNumber": 6,
        "duration": "2 - 3 phút",
        "counter": "Quầy trả kết quả Một cửa"
      }
    ],
    "edges": [
      {
        "id": "e-proc-10-1",
        "fromNodeId": "node-proc-10-1",
        "toNodeId": "node-proc-10-2",
        "label": "Bắt đầu"
      },
      {
        "id": "e-proc-10-2",
        "fromNodeId": "node-proc-10-2",
        "toNodeId": "node-proc-10-3",
        "label": "Đã chuẩn bị"
      },
      {
        "id": "e-proc-10-3",
        "fromNodeId": "node-proc-10-3",
        "toNodeId": "node-proc-10-4",
        "label": "Nộp tại quầy"
      },
      {
        "id": "e-proc-10-4",
        "fromNodeId": "node-proc-10-4",
        "toNodeId": "node-proc-10-5",
        "condition": "YES",
        "label": "Tiếp nhận"
      },
      {
        "id": "e-proc-10-5",
        "fromNodeId": "node-proc-10-5",
        "toNodeId": "node-proc-10-6",
        "label": "Ký duyệt xong"
      }
    ]
  },
  {
    "id": "wf-proc-11",
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
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "nodes": [
      {
        "id": "node-proc-11-1",
        "type": "START",
        "title": "Bắt đầu quy trình",
        "subtitle": "Xác định nhu cầu",
        "description": "Người dân có nhu cầu thực hiện thủ tục \"Sửa lỗi sai sót trong giao dịch\".",
        "instruction": "Kiểm tra tính pháp lý ban đầu của tài liệu, giấy tờ cá nhân trước khi di chuyển.",
        "status": "DONE",
        "stepNumber": 1,
        "duration": "1 - 2 phút",
        "location": "Tại nhà / Trực tuyến"
      },
      {
        "id": "node-proc-11-2",
        "type": "DOCUMENT",
        "title": "Chuẩn bị hồ sơ",
        "subtitle": "Checklist giấy tờ",
        "description": "Chuẩn bị đầy đủ các thành phần hồ sơ theo Checklist quy định.",
        "instruction": "Đảm bảo các bản sao rõ ràng, không tẩy xóa, mang kèm bản chính đối chiếu.",
        "status": "WAITING",
        "stepNumber": 2,
        "duration": "10 phút",
        "location": "Chuẩn bị cá nhân",
        "requiredDocuments": [
          {
            "id": "wf-doc-proc-11-0",
            "name": "Hợp đồng, giao dịch gốc đã chứng thực có lỗi sai sót",
            "required": true,
            "quantity": "01 bản gốc"
          },
          {
            "id": "wf-doc-proc-11-1",
            "name": "Giấy tờ tài liệu làm căn cứ chứng minh lỗi sai sót (như CCCD đúng, Sổ đỏ đúng đối chiếu)",
            "required": true,
            "quantity": "Bản chính đối chiếu"
          },
          {
            "id": "wf-doc-proc-11-2",
            "name": "Văn bản đề nghị đính chính / sửa lỗi sai sót của các bên",
            "required": true,
            "quantity": "01 bản"
          }
        ]
      },
      {
        "id": "node-proc-11-3",
        "type": "COUNTER",
        "title": "Đến Bộ phận Một cửa",
        "subtitle": "Nộp tại Quầy 1",
        "description": "Đến trực tiếp Bộ phận Tiếp nhận & Trả kết quả (Một cửa) UBND Phường Chánh Hiệp.",
        "instruction": "Lấy số thứ tự tại Kiosk đón tiếp, di chuyển đến Quầy số 1 để nộp hồ sơ.",
        "status": "WAITING",
        "stepNumber": 3,
        "duration": "5 - 10 phút",
        "counter": "Quầy số 1 - Chứng thực",
        "location": "UBND Phường Chánh Hiệp (1240 Đại lộ Bình Dương)"
      },
      {
        "id": "node-proc-11-4",
        "type": "VERIFY",
        "title": "Thẩm định đối chiếu",
        "subtitle": "Thẩm tra tính hợp lệ",
        "description": "Cán bộ Một cửa rà soát thành phần hồ sơ, đối chiếu bản gốc và bản chụp.",
        "instruction": "Cán bộ ghi sổ theo dõi, nhập mã hồ sơ điện tử và đưa phiếu hẹn trả kết quả.",
        "status": "WAITING",
        "stepNumber": 4,
        "duration": "10 - 20 phút",
        "counter": "Quầy số 1",
        "decisionChoices": [
          {
            "label": "Hồ sơ hợp lệ, tiếp nhận",
            "targetNodeId": "node-proc-11-5",
            "isPositive": true
          },
          {
            "label": "Thiếu thành phần, trả lại",
            "targetNodeId": "node-proc-11-2",
            "isPositive": false
          }
        ]
      },
      {
        "id": "node-proc-11-5",
        "type": "PROCESS",
        "title": "Ký duyệt & Đóng dấu",
        "subtitle": "Phê duyệt lãnh đạo",
        "description": "Trình Lãnh đạo UBND Phường xem xét, ký xác nhận vào Sổ chứng thực và văn bản.",
        "instruction": "Đóng dấu cơ quan, đóng dấu giáp lai đối với văn bản nhiều trang.",
        "status": "WAITING",
        "stepNumber": 5,
        "duration": "15 - 45 phút",
        "counter": "Phòng Tư pháp & Lãnh đạo UBND Phường"
      },
      {
        "id": "node-proc-11-6",
        "type": "RESULT",
        "title": "Nhận kết quả",
        "subtitle": "Hoàn tất thủ tục",
        "description": "Nhận lại hồ sơ gốc, các bản chứng thực và thanh toán lệ phí (mức phí: 25.000 đồng/giao dịch).",
        "instruction": "Kiểm tra kỹ thông tin trong con dấu chứng thực, chữ ký lãnh đạo trước khi rời quầy.",
        "status": "WAITING",
        "stepNumber": 6,
        "duration": "2 - 3 phút",
        "counter": "Quầy trả kết quả Một cửa"
      }
    ],
    "edges": [
      {
        "id": "e-proc-11-1",
        "fromNodeId": "node-proc-11-1",
        "toNodeId": "node-proc-11-2",
        "label": "Bắt đầu"
      },
      {
        "id": "e-proc-11-2",
        "fromNodeId": "node-proc-11-2",
        "toNodeId": "node-proc-11-3",
        "label": "Đã chuẩn bị"
      },
      {
        "id": "e-proc-11-3",
        "fromNodeId": "node-proc-11-3",
        "toNodeId": "node-proc-11-4",
        "label": "Nộp tại quầy"
      },
      {
        "id": "e-proc-11-4",
        "fromNodeId": "node-proc-11-4",
        "toNodeId": "node-proc-11-5",
        "condition": "YES",
        "label": "Tiếp nhận"
      },
      {
        "id": "e-proc-11-5",
        "fromNodeId": "node-proc-11-5",
        "toNodeId": "node-proc-11-6",
        "label": "Ký duyệt xong"
      }
    ]
  },
  {
    "id": "wf-proc-12",
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
    "version": "v1.0",
    "updatedAt": "2026-10-04T04:15:36.226Z",
    "updatedBy": "Cán bộ Tư pháp - Hộ tịch",
    "nodes": [
      {
        "id": "node-proc-12-1",
        "type": "START",
        "title": "Bắt đầu quy trình",
        "subtitle": "Xác định nhu cầu",
        "description": "Người dân có nhu cầu thực hiện thủ tục \"Cấp bản sao giao dịch đã chứng thực\".",
        "instruction": "Kiểm tra tính pháp lý ban đầu của tài liệu, giấy tờ cá nhân trước khi di chuyển.",
        "status": "DONE",
        "stepNumber": 1,
        "duration": "1 - 2 phút",
        "location": "Tại nhà / Trực tuyến"
      },
      {
        "id": "node-proc-12-2",
        "type": "DOCUMENT",
        "title": "Chuẩn bị hồ sơ",
        "subtitle": "Checklist giấy tờ",
        "description": "Chuẩn bị đầy đủ các thành phần hồ sơ theo Checklist quy định.",
        "instruction": "Đảm bảo các bản sao rõ ràng, không tẩy xóa, mang kèm bản chính đối chiếu.",
        "status": "WAITING",
        "stepNumber": 2,
        "duration": "10 phút",
        "location": "Chuẩn bị cá nhân",
        "requiredDocuments": [
          {
            "id": "wf-doc-proc-12-0",
            "name": "Phiếu yêu cầu cấp bản sao hợp đồng, giao dịch đã chứng thực",
            "required": true,
            "quantity": "01 bản"
          },
          {
            "id": "wf-doc-proc-12-1",
            "name": "CCCD gắn chip của người có quyền/nghĩa vụ liên quan trong giao dịch gốc",
            "required": true,
            "quantity": "01 bản chính"
          },
          {
            "id": "wf-doc-proc-12-2",
            "name": "Văn bản chứng minh là người thừa kế / được ủy quyền hợp pháp (nếu không phải là chủ thể gốc)",
            "required": false,
            "quantity": "01 bản gốc"
          }
        ]
      },
      {
        "id": "node-proc-12-3",
        "type": "COUNTER",
        "title": "Đến Bộ phận Một cửa",
        "subtitle": "Nộp tại Quầy 1",
        "description": "Đến trực tiếp Bộ phận Tiếp nhận & Trả kết quả (Một cửa) UBND Phường Chánh Hiệp.",
        "instruction": "Lấy số thứ tự tại Kiosk đón tiếp, di chuyển đến Quầy số 1 để nộp hồ sơ.",
        "status": "WAITING",
        "stepNumber": 3,
        "duration": "5 - 10 phút",
        "counter": "Quầy số 1 - Chứng thực",
        "location": "UBND Phường Chánh Hiệp (1240 Đại lộ Bình Dương)"
      },
      {
        "id": "node-proc-12-4",
        "type": "VERIFY",
        "title": "Thẩm định đối chiếu",
        "subtitle": "Thẩm tra tính hợp lệ",
        "description": "Cán bộ Một cửa rà soát thành phần hồ sơ, đối chiếu bản gốc và bản chụp.",
        "instruction": "Cán bộ ghi sổ theo dõi, nhập mã hồ sơ điện tử và đưa phiếu hẹn trả kết quả.",
        "status": "WAITING",
        "stepNumber": 4,
        "duration": "10 - 20 phút",
        "counter": "Quầy số 1",
        "decisionChoices": [
          {
            "label": "Hồ sơ hợp lệ, tiếp nhận",
            "targetNodeId": "node-proc-12-5",
            "isPositive": true
          },
          {
            "label": "Thiếu thành phần, trả lại",
            "targetNodeId": "node-proc-12-2",
            "isPositive": false
          }
        ]
      },
      {
        "id": "node-proc-12-5",
        "type": "PROCESS",
        "title": "Ký duyệt & Đóng dấu",
        "subtitle": "Phê duyệt lãnh đạo",
        "description": "Trình Lãnh đạo UBND Phường xem xét, ký xác nhận vào Sổ chứng thực và văn bản.",
        "instruction": "Đóng dấu cơ quan, đóng dấu giáp lai đối với văn bản nhiều trang.",
        "status": "WAITING",
        "stepNumber": 5,
        "duration": "15 - 45 phút",
        "counter": "Phòng Tư pháp & Lãnh đạo UBND Phường"
      },
      {
        "id": "node-proc-12-6",
        "type": "RESULT",
        "title": "Nhận kết quả",
        "subtitle": "Hoàn tất thủ tục",
        "description": "Nhận lại hồ sơ gốc, các bản chứng thực và thanh toán lệ phí (mức phí: 2.000 đồng/trang; từ trang thứ 3 trở lên thu 1.000 đồng/trang, tối đa 200.000 đồng/bản).",
        "instruction": "Kiểm tra kỹ thông tin trong con dấu chứng thực, chữ ký lãnh đạo trước khi rời quầy.",
        "status": "WAITING",
        "stepNumber": 6,
        "duration": "2 - 3 phút",
        "counter": "Quầy trả kết quả Một cửa"
      }
    ],
    "edges": [
      {
        "id": "e-proc-12-1",
        "fromNodeId": "node-proc-12-1",
        "toNodeId": "node-proc-12-2",
        "label": "Bắt đầu"
      },
      {
        "id": "e-proc-12-2",
        "fromNodeId": "node-proc-12-2",
        "toNodeId": "node-proc-12-3",
        "label": "Đã chuẩn bị"
      },
      {
        "id": "e-proc-12-3",
        "fromNodeId": "node-proc-12-3",
        "toNodeId": "node-proc-12-4",
        "label": "Nộp tại quầy"
      },
      {
        "id": "e-proc-12-4",
        "fromNodeId": "node-proc-12-4",
        "toNodeId": "node-proc-12-5",
        "condition": "YES",
        "label": "Tiếp nhận"
      },
      {
        "id": "e-proc-12-5",
        "fromNodeId": "node-proc-12-5",
        "toNodeId": "node-proc-12-6",
        "label": "Ký duyệt xong"
      }
    ]
  }
];
