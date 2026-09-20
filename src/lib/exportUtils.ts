/**
 * Utility functions for exporting data to CSV/Excel with UTF-8 BOM encoding for flawless Vietnamese font rendering.
 */

import { CompetitionSubmission, PublicOpinion, Organization, MemberOrganization, StaffUser, OfficialDocument } from '../types';

/**
 * Trigger browser download for CSV content with UTF-8 BOM
 */
export function downloadCsv(filename: string, csvContent: string): void {
  // \uFEFF is the UTF-8 Byte Order Mark (BOM) ensuring Excel displays Vietnamese characters properly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Helper to escape CSV field
 */
function escapeCsvField(field: any): string {
  if (field === null || field === undefined) return '""';
  const str = String(field).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Export competition submissions to CSV / Excel
 */
export function exportCompetitionSubmissionsToCsv(
  competitionTitle: string,
  submissions: CompetitionSubmission[]
): void {
  const headers = [
    'STT',
    'Mã bài dự thi',
    'Họ và tên thí sinh',
    'Số điện thoại',
    'Khu phố / Đơn vị',
    'Thời gian nộp bài',
    'Điểm số',
    'Trạng thái chấm',
    'Thời gian làm bài',
    'Nhận xét của Ban Giám khảo',
    'Nội dung bài viết (nếu có)'
  ];

  const sorted = [...submissions].sort((a, b) => (b.score || 0) - (a.score || 0));

  const rows = sorted.map((sub, idx) => {
    return [
      idx + 1,
      escapeCsvField(sub.id),
      escapeCsvField(sub.participantName),
      escapeCsvField(sub.phone),
      escapeCsvField(sub.neighborhood),
      escapeCsvField(sub.submittedAt),
      escapeCsvField(sub.score !== undefined ? sub.score : 'Chưa chấm'),
      escapeCsvField(sub.score !== undefined ? 'Đã chấm' : 'Chờ chấm'),
      escapeCsvField(sub.adminComment || ''),
      escapeCsvField(sub.essayText ? sub.essayText.replace(/\n/g, ' ') : '')
    ].join(',');
  });

  const timestamp = new Date().toISOString().substring(0, 10);
  const safeTitle = competitionTitle.replace(/[^a-zA-Z0-9_\u00C0-\u1EF9]/g, '_').substring(0, 40);
  const filename = `Danh_sach_thi_sinh_${safeTitle}_${timestamp}.csv`;

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  downloadCsv(filename, csvContent);
}

/**
 * Export public opinions to CSV / Excel
 */
export function exportPublicOpinionsToCsv(opinions: PublicOpinion[]): void {
  const headers = [
    'STT',
    'Mã tiếp nhận',
    'Chủ đề phản ánh',
    'Địa bàn Khu phố',
    'Người gửi',
    'Số điện thoại',
    'Email',
    'Thời gian gửi',
    'Trạng thái xử lý',
    'Mức độ ưu tiên',
    'Nội dung phản ánh',
    'Kết quả xử lý của MTTQ',
    'Thời gian phản hồi'
  ];

  const rows = opinions.map((op, idx) => {
    const statusLabel = 
      op.status === 'RESOLVED' ? 'Đã giải quyết' :
      op.status === 'PROCESSING' ? 'Đang xử lý' : 'Mới tiếp nhận';

    return [
      idx + 1,
      escapeCsvField(op.receiptCode),
      escapeCsvField(op.topic),
      escapeCsvField(op.neighborhood),
      escapeCsvField(op.isAnonymous ? 'Ẩn danh' : op.fullname || 'Người dân'),
      escapeCsvField(op.isAnonymous ? 'Ẩn' : op.phone || ''),
      escapeCsvField(op.isAnonymous ? 'Ẩn' : op.email || ''),
      escapeCsvField(op.createdAt),
      escapeCsvField(statusLabel),
      escapeCsvField(op.priority || 'NORMAL'),
      escapeCsvField(op.content.replace(/\n/g, ' ')),
      escapeCsvField(op.adminResponse ? op.adminResponse.replace(/\n/g, ' ') : 'Chưa có'),
      escapeCsvField(op.updatedAt || '')
    ].join(',');
  });

  const timestamp = new Date().toISOString().substring(0, 10);
  const filename = `Bao_cao_Du_luan_Nhan_dan_Chanh_Hiep_${timestamp}.csv`;
  const csvContent = [headers.join(','), ...rows].join('\r\n');
  downloadCsv(filename, csvContent);
}

/**
 * Export member organizations to CSV
 */
export function exportOrganizationsToCsv(organizations: (Organization | MemberOrganization)[]): void {
  const headers = [
    'STT',
    'Mã tổ chức',
    'Tên tổ chức đoàn thể',
    'Tên viết tắt',
    'Cấp bậc',
    'Lãnh đạo phụ trách',
    'Chức vụ',
    'Số điện thoại',
    'Email',
    'Số lượng đoàn viên/hội viên',
    'Số chi hội trực thuộc 21 KP',
    'Tỷ lệ tập hợp'
  ];

  const rows = organizations.map((org, idx) => {
    return [
      idx + 1,
      escapeCsvField(org.code),
      escapeCsvField(org.name),
      escapeCsvField(org.shortName || org.name),
      escapeCsvField(org.level === 'WARD' ? 'Cấp Phường' : org.level),
      escapeCsvField(org.leaderName || ''),
      escapeCsvField(org.leaderPosition || ''),
      escapeCsvField(org.phone || ''),
      escapeCsvField(org.email || ''),
      escapeCsvField((org as any).membersCount || (org as any).activeMembersCount || 0),
      escapeCsvField((org as any).branchesCount || 21),
      escapeCsvField((org as any).gatheringRatio || 'N/A')
    ].join(',');
  });

  const timestamp = new Date().toISOString().substring(0, 10);
  const filename = `Danh_ba_Doan_the_Phuong_Chanh_Hiep_${timestamp}.csv`;
  const csvContent = [headers.join(','), ...rows].join('\r\n');
  downloadCsv(filename, csvContent);
}

/**
 * Export staff members directory to CSV
 */
export function exportStaffDirectoryToCsv(staffUsers: StaffUser[]): void {
  const headers = [
    'STT',
    'Họ và tên cán bộ',
    'Chức vụ Mặt trận',
    'Bộ phận / Ban',
    'Số điện thoại',
    'Email',
    'Vai trò hệ thống',
    'Trạng thái'
  ];

  const rows = staffUsers.map((staff, idx) => {
    return [
      idx + 1,
      escapeCsvField(staff.fullname),
      escapeCsvField(staff.position),
      escapeCsvField(staff.department),
      escapeCsvField(staff.phone || ''),
      escapeCsvField(staff.email),
      escapeCsvField(staff.role),
      escapeCsvField(staff.active ? 'Đang hoạt động' : 'Tạm khóa')
    ].join(',');
  });

  const timestamp = new Date().toISOString().substring(0, 10);
  const filename = `Danh_ba_Can_bo_MTTQ_Phuong_Chanh_Hiep_${timestamp}.csv`;
  const csvContent = [headers.join(','), ...rows].join('\r\n');
  downloadCsv(filename, csvContent);
}

/**
 * Export official documents registry to CSV / Excel (Nghị định 30/2020/NĐ-CP chuẩn văn thư)
 */
export function exportDocumentsToCsv(documents: OfficialDocument[], registryType: 'ALL' | 'INCOMING' | 'OUTGOING' | 'INTERNAL' = 'ALL'): void {
  const isIncoming = registryType === 'INCOMING';
  const isOutgoing = registryType === 'OUTGOING';

  let headers: string[] = [];
  if (isIncoming) {
    headers = [
      'STT',
      'Số đến',
      'Ngày đến',
      'Số / Ký hiệu gốc',
      'Ngày văn bản',
      'Cơ quan ban hành / Nơi gửi',
      'Trích yếu nội dung',
      'Loại văn bản',
      'Độ khẩn',
      'Cán bộ thụ lý',
      'Hạn xử lý',
      'Trạng thái',
      'Tiến độ (%)',
      'Ý kiến chỉ đạo'
    ];
  } else if (isOutgoing) {
    headers = [
      'STT',
      'Số / Ký hiệu',
      'Ngày ban hành',
      'Trích yếu nội dung',
      'Loại văn bản',
      'Người ký',
      'Chức vụ',
      'Lĩnh vực',
      'Nơi nhận',
      'Độ khẩn',
      'Ký số',
      'Công khai',
      'Tệp đính kèm / Link Drive'
    ];
  } else {
    headers = [
      'STT',
      'Phân luồng',
      'Số / Ký hiệu',
      'Trích yếu văn bản',
      'Loại văn bản',
      'Cơ quan ban hành',
      'Ngày ban hành / Ngày đến',
      'Người ký',
      'Lĩnh vực',
      'Độ khẩn',
      'Trạng thái',
      'Cán bộ thụ lý',
      'Hạn xử lý',
      'Công khai',
      'Tệp đính kèm'
    ];
  }

  const rows = documents.map((doc, idx) => {
    const urgencyLabel = 
      doc.urgency === 'HOA_TOC' ? 'Hỏa tốc' :
      doc.urgency === 'VERY_URGENT' ? 'Thượng khẩn' :
      doc.urgency === 'URGENT' ? 'Khẩn' : 'Thường';

    const directionLabel =
      doc.direction === 'INCOMING' ? 'Văn bản Đến' :
      doc.direction === 'INTERNAL' ? 'Nội bộ / Dự thảo' : 'Văn bản Đi / Ban hành';

    const statusLabel =
      doc.status === 'COMPLETED' ? 'Đã hoàn thành' :
      doc.status === 'PROCESSING' ? 'Đang xử lý' :
      doc.status === 'APPROVED' ? 'Đã duyệt' :
      doc.status === 'PENDING_APPROVAL' ? 'Chờ phê duyệt' :
      doc.status === 'ISSUED' ? 'Đã phát hành' :
      doc.status === 'EXPIRED' ? 'Quá hạn' : 'Dự thảo';

    if (isIncoming) {
      return [
        idx + 1,
        escapeCsvField(doc.incomingNumber || `Đ-${idx + 1}`),
        escapeCsvField(doc.incomingDate || doc.issueDate),
        escapeCsvField(doc.codeNumber),
        escapeCsvField(doc.issueDate),
        escapeCsvField(doc.issuer || 'UBND TP. Thủ Dầu Một'),
        escapeCsvField(doc.title.replace(/\n/g, ' ')),
        escapeCsvField(doc.docType),
        escapeCsvField(urgencyLabel),
        escapeCsvField(doc.assignedStaff || 'Chưa phân công'),
        escapeCsvField(doc.deadline || 'Không'),
        escapeCsvField(statusLabel),
        escapeCsvField(`${doc.processingProgress ?? 100}%`),
        escapeCsvField(doc.processingNotes || '')
      ].join(',');
    } else if (isOutgoing) {
      return [
        idx + 1,
        escapeCsvField(doc.codeNumber),
        escapeCsvField(doc.issueDate),
        escapeCsvField(doc.title.replace(/\n/g, ' ')),
        escapeCsvField(doc.docType),
        escapeCsvField(doc.signer || 'Trần Thị Hoa'),
        escapeCsvField(doc.signerPosition || 'Chủ tịch UBMTTQ'),
        escapeCsvField(doc.field),
        escapeCsvField(doc.recipientOrg || 'Các ban ngành, đoàn thể & 21 Khu phố'),
        escapeCsvField(urgencyLabel),
        escapeCsvField(doc.isDigitalSigned ? 'Đã ký số' : 'Chưa'),
        escapeCsvField(doc.isPublic ? 'Công khai' : 'Nội bộ'),
        escapeCsvField(doc.driveUrl || doc.fileUrl || doc.fileName || '')
      ].join(',');
    } else {
      return [
        idx + 1,
        escapeCsvField(directionLabel),
        escapeCsvField(doc.codeNumber),
        escapeCsvField(doc.title.replace(/\n/g, ' ')),
        escapeCsvField(doc.docType),
        escapeCsvField(doc.issuer),
        escapeCsvField(doc.issueDate),
        escapeCsvField(doc.signer),
        escapeCsvField(doc.field),
        escapeCsvField(urgencyLabel),
        escapeCsvField(statusLabel),
        escapeCsvField(doc.assignedStaff || ''),
        escapeCsvField(doc.deadline || ''),
        escapeCsvField(doc.isPublic ? 'Công khai' : 'Nội bộ'),
        escapeCsvField(doc.fileName || doc.fileUrl || '')
      ].join(',');
    }
  });

  const timestamp = new Date().toISOString().substring(0, 10);
  const prefix = isIncoming ? 'So_Van_ban_Den' : isOutgoing ? 'So_Van_ban_Di' : 'So_Quan_ly_Van_ban';
  const filename = `${prefix}_MTTQ_Phuong_Chanh_Hiep_${timestamp}.csv`;
  const csvContent = [headers.join(','), ...rows].join('\r\n');
  downloadCsv(filename, csvContent);
}

