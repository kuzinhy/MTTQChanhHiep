# Kế hoạch triển khai Module Văn bản mới (V2)

Để xây dựng một module "Văn bản triển khai" chuyên nghiệp, hiện đại, tôi sẽ thực hiện theo các bước sau:

## 1. Định nghĩa lại dữ liệu (Data Structure)
Xây dựng interface `NewDocument` tập trung vào tính năng:
- Thông tin hành chính (Số hiệu, trích yếu, người ký, ngày ban hành).
- Metadata phân loại (Lĩnh vực, Loại văn bản).
- Liên kết tệp tin (Google Drive Integration cho việc Upload/Quản lý).
- Trạng thái (Draft/Published/Hidden).

## 2. Giao diện Quản trị (Admin CMS)
- Bảng dữ liệu (Table) hiện đại với các cột: STT, Số hiệu, Trích yếu, Phân loại, Trạng thái, Thao tác.
- Modal tạo/sửa mới:
  - Tích hợp **Google Drive Picker/Uploader** để đẩy tệp lên thư mục của phường.
  - Tự động hóa trích xuất thông tin bằng AI (tùy chọn) khi người dùng chọn tệp.
- Hỗ trợ bộ lọc nâng cao (Search theo trích yếu, Lọc theo loại văn bản).

## 3. Giao diện Người dân (Portal View)
- Component hiển thị văn bản chuyên biệt (`DocumentsPublicView`).
- Hiển thị theo dạng danh sách có phân trang.
- Cho phép người dân tìm kiếm và lọc văn bản nhanh.
- Xem trực tiếp nội dung (nếu là PDF) hoặc mở tệp từ Drive.

## 4. Các bước kỹ thuật
1. Định nghĩa `NewDocument` type trong `src/types.ts`.
2. Tạo Service mới `src/services/documentService.ts` để quản lý logic Firestore + Drive.
3. Tạo Component giao diện quản trị `src/components/admin/DocumentManager.tsx`.
4. Tạo Component giao diện người dân `src/components/portal/DocumentsPublicView.tsx`.
5. Tích hợp vào `App.tsx` và `Navbar.tsx`.

Tôi sẽ bắt đầu xây dựng từ bước 1.
