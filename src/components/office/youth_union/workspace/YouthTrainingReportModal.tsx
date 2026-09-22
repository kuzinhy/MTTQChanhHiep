import React, { useState, useMemo } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Award, 
  Star, 
  Users, 
  Check, 
  Copy, 
  Sparkles, 
  Filter, 
  Layers, 
  Search, 
  HeartHandshake,
  TrendingUp,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { 
  YouthMemberTrainingRecord, 
  YouthMember, 
  BranchInfo, 
  YouthWorkGroup 
} from '../youthUnionData';
import { downloadCsv } from '../../../../lib/exportUtils';

export type ReportPeriodType = 'MONTHLY' | 'QUARTERLY' | 'HALF_YEAR' | 'ANNUAL';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  branchId: string;
  branches: BranchInfo[];
  records: YouthMemberTrainingRecord[];
  members: YouthMember[];
  workGroups: YouthWorkGroup[];
  onNotify: (msg: string) => void;
}

export const YouthTrainingReportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  branchId,
  branches,
  records,
  members,
  workGroups,
  onNotify
}) => {
  // Current branch
  const currentBranch = useMemo(() => {
    return branches.find(b => b.id === branchId) || branches[0] || {
      id: 'kp1',
      name: 'Chi đoàn Khu phố 1',
      type: 'DÂN CƯ',
      secretary: 'Trần Thị Bích',
      phone: '0912.345.678',
      email: 'chidoankp1@chanhhiep.vn',
      membersCount: 42,
      maleCount: 22,
      femaleCount: 20,
      selfScore: 92,
      officialScore: 90,
      ranking: 1,
      targetPartyCount: 3,
      assignedWardStaff: 'Nguyễn Văn Hùng'
    };
  }, [branches, branchId]);

  // Selected Scope
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branchId || 'kp1');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('ALL');

  // Report Period Settings
  const [periodType, setPeriodType] = useState<ReportPeriodType>('QUARTERLY');
  const [reportMonth, setReportMonth] = useState<number>(3); // Tháng 3
  const [reportQuarter, setReportQuarter] = useState<number>(1); // Quý 1
  const [reportHalfYear, setReportHalfYear] = useState<number>(1); // 6 tháng đầu năm
  const [reportYear, setReportYear] = useState<number>(2026);

  // Administrative Metadata
  const [reportNumber, setReportNumber] = useState('03/BC-ĐTN');
  const [reportSignerName, setReportSignerName] = useState(currentBranch?.secretary || 'Trần Thị Bích');
  const [reportSignerRole, setReportSignerRole] = useState('Bí thư Chi đoàn');
  const [customReportNote, setCustomReportNote] = useState(
    'Đa số đoàn viên có ý thức rèn luyện tốt, tích cực tham gia các hoạt động Ngày Thứ bảy tình nguyện, Chủ nhật xanh và chuyển đổi số tại địa bàn.'
  );

  // Active View Tab inside Modal: 'PREVIEW_PDF' | 'SUMMARY_TABLE' | 'CONFIG'
  const [modalTab, setModalTab] = useState<'PREVIEW_PDF' | 'SUMMARY_TABLE' | 'CONFIG'>('PREVIEW_PDF');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!isOpen) return null;

  // Compute label for selected period
  const periodLabel = useMemo(() => {
    if (periodType === 'MONTHLY') {
      return `Tháng ${reportMonth} năm ${reportYear}`;
    }
    if (periodType === 'QUARTERLY') {
      return `Quý ${reportQuarter === 1 ? 'I' : reportQuarter === 2 ? 'II' : reportQuarter === 3 ? 'III' : 'IV'} năm ${reportYear}`;
    }
    if (periodType === 'HALF_YEAR') {
      return `6 tháng ${reportHalfYear === 1 ? 'đầu năm' : 'cuối năm'} ${reportYear}`;
    }
    return `Năm ${reportYear}`;
  }, [periodType, reportMonth, reportQuarter, reportHalfYear, reportYear]);

  // Which months (0-11 index) are in the selected period?
  const relevantMonthIndices = useMemo(() => {
    if (periodType === 'MONTHLY') {
      return [reportMonth - 1];
    }
    if (periodType === 'QUARTERLY') {
      if (reportQuarter === 1) return [0, 1, 2];
      if (reportQuarter === 2) return [3, 4, 5];
      if (reportQuarter === 3) return [6, 7, 8];
      return [9, 10, 11];
    }
    if (periodType === 'HALF_YEAR') {
      return reportHalfYear === 1 ? [0, 1, 2, 3, 4, 5] : [6, 7, 8, 9, 10, 11];
    }
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  }, [periodType, reportMonth, reportQuarter, reportHalfYear]);

  // Filter records by unit / branch / group
  const scopedRecords = useMemo(() => {
    return records.filter(r => {
      const matchBranch = selectedBranchId === 'ALL' || r.branchId === selectedBranchId || (!r.branchId && selectedBranchId === 'kp1');
      const matchGroup = selectedGroupId === 'ALL' || r.workGroupId === selectedGroupId;
      return matchBranch && matchGroup;
    });
  }, [records, selectedBranchId, selectedGroupId]);

  // Process scoped records with period attendance calculation
  const processedRecords = useMemo(() => {
    return scopedRecords.map(r => {
      // Calculate attendance in this period
      const totalPossibleInPeriod = relevantMonthIndices.length;
      const attendedInPeriod = relevantMonthIndices.filter(mIdx => r.monthlyAttendance?.[mIdx]).length;
      const periodAttendanceRate = totalPossibleInPeriod > 0 
        ? Math.round((attendedInPeriod / totalPossibleInPeriod) * 100) 
        : 100;

      return {
        ...r,
        attendedInPeriod,
        totalPossibleInPeriod,
        periodAttendanceRate
      };
    });
  }, [scopedRecords, relevantMonthIndices]);

  // Filtered by search & status for display
  const displayRecords = useMemo(() => {
    return processedRecords.filter(r => {
      const matchSearch = r.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.memberCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || r.trainingStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [processedRecords, searchTerm, statusFilter]);

  // Statistical calculations for the report
  const reportStats = useMemo(() => {
    const total = processedRecords.length;
    if (total === 0) {
      return {
        total: 0,
        avgScore: 0,
        avgIdeology: 0,
        avgEthics: 0,
        avgStudyLabor: 0,
        avgPhysicalSkill: 0,
        avgDiscipline: 0,
        excellentCount: 0,
        goodCount: 0,
        fairCount: 0,
        poorCount: 0,
        excellentPercent: 0,
        goodPercent: 0,
        fairPercent: 0,
        poorPercent: 0,
        avgAttendanceRate: 0,
        totalVolunteers: 0,
        digitalCount: 0,
        digitalPercent: 0,
        partyTargetCount: 0
      };
    }

    const avgScore = Math.round(processedRecords.reduce((acc, r) => acc + r.totalScore, 0) / total);
    const avgIdeology = (processedRecords.reduce((acc, r) => acc + r.ideologyScore, 0) / total).toFixed(1);
    const avgEthics = (processedRecords.reduce((acc, r) => acc + r.ethicsScore, 0) / total).toFixed(1);
    const avgStudyLabor = (processedRecords.reduce((acc, r) => acc + r.studyLaborScore, 0) / total).toFixed(1);
    const avgPhysicalSkill = (processedRecords.reduce((acc, r) => acc + r.physicalSkillScore, 0) / total).toFixed(1);
    const avgDiscipline = (processedRecords.reduce((acc, r) => acc + r.disciplineVolunteerScore, 0) / total).toFixed(1);

    const excellentCount = processedRecords.filter(r => r.trainingStatus === 'XUẤT SẮC').length;
    const goodCount = processedRecords.filter(r => r.trainingStatus === 'KHÁ').length;
    const fairCount = processedRecords.filter(r => r.trainingStatus === 'TRUNG BÌNH').length;
    const poorCount = processedRecords.filter(r => r.trainingStatus === 'CHƯA ĐẠT').length;

    const excellentPercent = Math.round((excellentCount / total) * 100);
    const goodPercent = Math.round((goodCount / total) * 100);
    const fairPercent = Math.round((fairCount / total) * 100);
    const poorPercent = Math.round((poorCount / total) * 100);

    const avgAttendanceRate = Math.round(
      processedRecords.reduce((acc, r) => acc + r.periodAttendanceRate, 0) / total
    );
    const totalVolunteers = processedRecords.reduce((acc, r) => acc + r.volunteerActivitiesCount, 0);
    const digitalCount = processedRecords.filter(r => r.digitalSkillsCompleted).length;
    const digitalPercent = Math.round((digitalCount / total) * 100);

    // Party targets from members roster
    const currentMemberIds = new Set(processedRecords.map(r => r.memberId));
    const partyTargetCount = members.filter(m => currentMemberIds.has(m.id) && m.partyTarget).length;

    return {
      total,
      avgScore,
      avgIdeology,
      avgEthics,
      avgStudyLabor,
      avgPhysicalSkill,
      avgDiscipline,
      excellentCount,
      goodCount,
      fairCount,
      poorCount,
      excellentPercent,
      goodPercent,
      fairPercent,
      poorPercent,
      avgAttendanceRate,
      totalVolunteers,
      digitalCount,
      digitalPercent,
      partyTargetCount
    };
  }, [processedRecords, members]);

  // Export to CSV / Excel
  const handleExportCsv = () => {
    const headers = [
      'STT',
      'Mã Đoàn Viên',
      'Họ Và Tên',
      'Chi Đoàn',
      'Nhóm Công Tác',
      'Tư Tưởng (Max 20)',
      'Đạo Đức (Max 20)',
      'Học Tập (Max 20)',
      'Thể Chất (Max 20)',
      'Kỷ Luật (Max 20)',
      'Tổng Điểm Rèn Luyện (Max 100)',
      `Chuyên Cần (${periodLabel})`,
      'Tỷ Lệ Tham Gia Sinh Hoạt (%)',
      'Số Lượt Tình Nguyện',
      'Kỹ Năng Số',
      'Xếp Loại Rèn Luyện',
      'Đoàn Viên Ưu Tú (Cảm Tình Đảng)',
      'Đoàn Viên Tự Nhận Xét',
      'Chi Đoàn Thẩm Định & Nhận Xét'
    ];

    const branchName = selectedBranchId === 'ALL' ? 'Toan_Phuong' : (currentBranch?.name || 'Chi_doan');

    const rows = processedRecords.map((r, idx) => {
      const isParty = members.find(m => m.id === r.memberId)?.partyTarget ? 'Có' : 'Không';
      return [
        idx + 1,
        `"${r.memberCode}"`,
        `"${r.memberName}"`,
        `"${currentBranch?.name || 'Chi đoàn Khu phố 1'}"`,
        `"${r.workGroupName || 'Tổ thanh niên'}"`,
        r.ideologyScore,
        r.ethicsScore,
        r.studyLaborScore,
        r.physicalSkillScore,
        r.disciplineVolunteerScore,
        r.totalScore,
        `"${r.attendedInPeriod}/${r.totalPossibleInPeriod} buổi"`,
        `${r.periodAttendanceRate}%`,
        r.volunteerActivitiesCount,
        r.digitalSkillsCompleted ? 'Đạt' : 'Chưa đạt',
        `"${r.trainingStatus}"`,
        `"${isParty}"`,
        `"${(r.selfEvaluationComment || '').replace(/"/g, '""')}"`,
        `"${(r.branchEvaluationComment || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = [
      `"BẢNG TỔNG HỢP KẾT QUẢ RÈN LUYỆN ĐOÀN VIÊN ${periodLabel.toUpperCase()}"`,
      `"Đơn vị: ${currentBranch?.name || 'Đoàn Phường Chánh Hiệp'}"`,
      `"Thời điểm xuất: ${new Date().toLocaleDateString('vi-VN')} - Tổng số: ${processedRecords.length} đoàn viên"`,
      '',
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const cleanFilename = `Bao_Cao_Ren_Luyen_Doan_Vien_${periodType}_${periodLabel.replace(/\s+/g, '_')}_${branchName.substring(0, 15)}`;
    downloadCsv(cleanFilename, csvContent);
    onNotify('Đã xuất file bảng tổng hợp Excel/CSV thành công!');
  };

  // Copy Summary text to Clipboard
  const handleCopySummary = () => {
    const text = `📋 BÁO CÁO KẾT QUẢ RÈN LUYỆN ĐOÀN VIÊN - ${periodLabel.toUpperCase()}
🏛️ Đơn vị: ${currentBranch?.name || 'Chi đoàn Khu phố 1'}
━━━━━━━━━━━━━━━━━━━━
1. Tổng số đoàn viên đánh giá: ${reportStats.total} đồng chí
2. Điểm rèn luyện trung bình: ${reportStats.avgScore}/100 điểm
3. Tỷ lệ chuyên cần sinh hoạt: ${reportStats.avgAttendanceRate}% (${relevantMonthIndices.length} kỳ sinh hoạt)
4. Kết quả xếp loại thi đua:
  - Xuất sắc: ${reportStats.excellentCount} ĐV (${reportStats.excellentPercent}%)
  - Khá: ${reportStats.goodCount} ĐV (${reportStats.goodPercent}%)
  - Trung bình: ${reportStats.fairCount} ĐV (${reportStats.fairPercent}%)
  - Chưa đạt: ${reportStats.poorCount} ĐV (${reportStats.poorPercent}%)
5. Hoạt động phong trào:
  - Tổng số lượt tình nguyện: ${reportStats.totalVolunteers} lượt
  - Chuẩn kỹ năng số: ${reportStats.digitalCount}/${reportStats.total} ĐV (${reportStats.digitalPercent}%)
  - Đoàn viên ưu tú (đối tượng Đảng): ${reportStats.partyTargetCount} đồng chí
━━━━━━━━━━━━━━━━━━━━
✍️ Người lập: ${reportSignerName} (${reportSignerRole})`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
    onNotify('Đã sao chép nội dung tóm tắt báo cáo vào bộ nhớ tạm!');
  };

  // Trigger Print for PDF Export
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in my-auto max-h-[94vh] flex flex-col print:max-w-none print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Header (Hidden on Print) */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 p-4 sm:p-5 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-sm shrink-0">
              <FileSpreadsheet className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight">
                  Tạo & Xuất Báo Cáo Rèn Luyện Đoàn Viên
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-wider">
                  Định Kỳ
                </span>
              </div>
              <p className="text-xs text-blue-100 font-medium">
                {currentBranch?.name} • Kỳ báo cáo: <strong className="text-white">{periodLabel}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Sao chép tóm tắt gửi Zalo / Báo cáo nhanh"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedSummary ? 'Đã sao chép' : 'Sao chép tóm tắt'}</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              title="Xuất file bảng tổng hợp Excel (CSV UTF-8)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất Excel</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              title="In hoặc Lưu dưới dạng PDF chuẩn văn bản"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In / Xuất PDF</span>
            </button>

            <button 
              onClick={onClose} 
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Period Selector & Mode Tabs (Hidden on Print) */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 shrink-0 space-y-3 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Mode selection tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
              <button
                onClick={() => setModalTab('PREVIEW_PDF')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                  modalTab === 'PREVIEW_PDF'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Văn Bản Báo Cáo (PDF/In)</span>
              </button>
              <button
                onClick={() => setModalTab('SUMMARY_TABLE')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                  modalTab === 'SUMMARY_TABLE'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Bảng Tổng Hợp Chi Tiết</span>
              </button>
              <button
                onClick={() => setModalTab('CONFIG')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                  modalTab === 'CONFIG'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Thiết Lập Kỳ Báo Cáo</span>
              </button>
            </div>

            {/* Quick Period Badges */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-500 hidden sm:inline">Loại kỳ:</span>
              <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl">
                <button
                  onClick={() => setPeriodType('MONTHLY')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    periodType === 'MONTHLY' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Hàng tháng
                </button>
                <button
                  onClick={() => setPeriodType('QUARTERLY')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    periodType === 'QUARTERLY' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Hàng quý
                </button>
                <button
                  onClick={() => setPeriodType('HALF_YEAR')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    periodType === 'HALF_YEAR' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  6 tháng
                </button>
                <button
                  onClick={() => setPeriodType('ANNUAL')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    periodType === 'ANNUAL' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Cả năm
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Period Selectors */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {periodType === 'MONTHLY' && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600">Chọn tháng:</span>
                <select
                  value={reportMonth}
                  onChange={(e) => setReportMonth(Number(e.target.value))}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-blue-500/20"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>Tháng {m}</option>
                  ))}
                </select>
              </div>
            )}

            {periodType === 'QUARTERLY' && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600">Chọn quý:</span>
                <select
                  value={reportQuarter}
                  onChange={(e) => setReportQuarter(Number(e.target.value))}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value={1}>Quý I (Tháng 1 - Tháng 3)</option>
                  <option value={2}>Quý II (Tháng 4 - Tháng 6)</option>
                  <option value={3}>Quý III (Tháng 7 - Tháng 9)</option>
                  <option value={4}>Quý IV (Tháng 10 - Tháng 12)</option>
                </select>
              </div>
            )}

            {periodType === 'HALF_YEAR' && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600">Giai đoạn:</span>
                <select
                  value={reportHalfYear}
                  onChange={(e) => setReportHalfYear(Number(e.target.value))}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value={1}>6 tháng đầu năm (Tháng 1 - Tháng 6)</option>
                  <option value={2}>6 tháng cuối năm (Tháng 7 - Tháng 12)</option>
                </select>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-600">Năm:</span>
              <select
                value={reportYear}
                onChange={(e) => setReportYear(Number(e.target.value))}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-blue-500/20"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-xs font-bold text-slate-600">Đơn vị:</span>
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-blue-500/20 max-w-[200px] truncate"
              >
                <option value="ALL">Tất cả chi đoàn</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 print:overflow-visible print:p-0">

          {/* TAB 1: PREVIEW OFFICIAL PDF / PRINT DOCUMENT */}
          {modalTab === 'PREVIEW_PDF' && (
            <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-10 text-slate-900 font-serif max-w-4xl mx-auto shadow-xs print:border-none print:p-0 print:shadow-none print:max-w-none">
              
              {/* Official Header */}
              <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-300 text-xs font-sans">
                <div className="text-center space-y-0.5">
                  <div className="font-bold uppercase text-[11px] text-slate-700">ĐOÀN TNCS HỒ CHÍ MINH</div>
                  <div className="font-black uppercase text-xs text-blue-900">BCH ĐOÀN PHƯỜNG CHÁNH HIỆP</div>
                  <div className="font-extrabold uppercase text-xs text-slate-900 underline underline-offset-4 decoration-1">
                    {currentBranch?.name?.toUpperCase() || 'CHI ĐOÀN KHU PHỐ 1'}
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1">Số: {reportNumber}</div>
                </div>

                <div className="text-center space-y-0.5">
                  <div className="font-black uppercase text-xs text-slate-900">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div className="font-bold text-xs text-slate-800 underline underline-offset-4 decoration-1">
                    Độc lập - Tự do - Hạnh phúc
                  </div>
                  <div className="text-[11px] text-slate-600 italic pt-2">
                    Chánh Hiệp, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="text-center my-6 space-y-1.5 font-sans">
                <h2 className="text-lg sm:text-xl font-black text-slate-950 uppercase tracking-tight">
                  BÁO CÁO KẾT QUẢ ĐÁNH GIÁ RÈN LUYỆN ĐOÀN VIÊN
                </h2>
                <div className="text-sm font-extrabold text-blue-800 uppercase tracking-wider">
                  KỲ ĐÁNH GIÁ: {periodLabel.toUpperCase()}
                </div>
                <p className="text-xs text-slate-600 italic font-serif">
                  (Căn cứ Hướng dẫn thực hiện Chương trình Rèn luyện Đoàn viên số giai đoạn 2026 - 2027)
                </p>
              </div>

              {/* Section I: Overview & General Statistics */}
              <div className="space-y-4 text-xs font-sans">
                <div>
                  <h4 className="text-xs font-black uppercase text-blue-950 flex items-center gap-1.5 border-b border-slate-200 pb-1 mb-2">
                    <span>I. TÌNH HÌNH CHUNG VÀ TỔNG HỢP SỐ LIỆU ĐOÀN VIÊN</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Tổng số đoàn viên</span>
                      <span className="text-lg font-black text-slate-900">{reportStats.total} đồng chí</span>
                    </div>
                    <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-center">
                      <span className="text-[10px] font-bold text-blue-700 uppercase block">Điểm rèn luyện TB</span>
                      <span className="text-lg font-black text-blue-800">{reportStats.avgScore} / 100đ</span>
                    </div>
                    <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-center">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase block">Chuyên cần kỳ này</span>
                      <span className="text-lg font-black text-emerald-800">{reportStats.avgAttendanceRate}%</span>
                    </div>
                    <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-center">
                      <span className="text-[10px] font-bold text-amber-700 uppercase block">Đoàn viên Xuất sắc</span>
                      <span className="text-lg font-black text-amber-800">{reportStats.excellentCount} ({reportStats.excellentPercent}%)</span>
                    </div>
                  </div>
                </div>

                {/* Section II: 5 Criteria Breakdown Table */}
                <div>
                  <h4 className="text-xs font-black uppercase text-blue-950 flex items-center gap-1.5 border-b border-slate-200 pb-1 mb-2">
                    <span>II. KẾT QUẢ ĐẠT ĐƯỢC THEO 5 TIÊU CHÍ RÈN LUYỆN TRỌNG TÂM</span>
                  </h4>
                  <div className="border border-slate-300 rounded-xl overflow-hidden mb-3">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 font-bold text-slate-800 border-b border-slate-300">
                        <tr>
                          <th className="p-2.5 text-center w-12">STT</th>
                          <th className="p-2.5">Tiêu chí rèn luyện chuẩn</th>
                          <th className="p-2.5 text-center w-28">Thang điểm</th>
                          <th className="p-2.5 text-center w-28">Điểm TB Chi đoàn</th>
                          <th className="p-2.5 text-center w-28">Tỷ lệ hoàn thành</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                        <tr>
                          <td className="p-2.5 text-center font-bold">1</td>
                          <td className="p-2.5">Lý tưởng cách mạng, nhận thức chính trị & học tập theo Bác</td>
                          <td className="p-2.5 text-center font-semibold">20 điểm</td>
                          <td className="p-2.5 text-center font-bold text-blue-700">{reportStats.avgIdeology}</td>
                          <td className="p-2.5 text-center text-emerald-700 font-bold">
                            {Math.round((Number(reportStats.avgIdeology) / 20) * 100)}%
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-center font-bold">2</td>
                          <td className="p-2.5">Đạo đức, lối sống, tác phong & tính gương mẫu</td>
                          <td className="p-2.5 text-center font-semibold">20 điểm</td>
                          <td className="p-2.5 text-center font-bold text-blue-700">{reportStats.avgEthics}</td>
                          <td className="p-2.5 text-center text-emerald-700 font-bold">
                            {Math.round((Number(reportStats.avgEthics) / 20) * 100)}%
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-center font-bold">3</td>
                          <td className="p-2.5">Chuyên môn nghiệp vụ, học tập, lao động sáng tạo & Kỹ năng số</td>
                          <td className="p-2.5 text-center font-semibold">20 điểm</td>
                          <td className="p-2.5 text-center font-bold text-blue-700">{reportStats.avgStudyLabor}</td>
                          <td className="p-2.5 text-center text-emerald-700 font-bold">
                            {Math.round((Number(reportStats.avgStudyLabor) / 20) * 100)}%
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-center font-bold">4</td>
                          <td className="p-2.5">Thể chất, văn hóa nghệ thuật & kỹ năng thực hành xã hội</td>
                          <td className="p-2.5 text-center font-semibold">20 điểm</td>
                          <td className="p-2.5 text-center font-bold text-blue-700">{reportStats.avgPhysicalSkill}</td>
                          <td className="p-2.5 text-center text-emerald-700 font-bold">
                            {Math.round((Number(reportStats.avgPhysicalSkill) / 20) * 100)}%
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-center font-bold">5</td>
                          <td className="p-2.5">Ý thức tổ chức kỷ luật, sinh hoạt chi đoàn & tình nguyện xung kích</td>
                          <td className="p-2.5 text-center font-semibold">20 điểm</td>
                          <td className="p-2.5 text-center font-bold text-blue-700">{reportStats.avgDiscipline}</td>
                          <td className="p-2.5 text-center text-emerald-700 font-bold">
                            {Math.round((Number(reportStats.avgDiscipline) / 20) * 100)}%
                          </td>
                        </tr>
                        <tr className="bg-slate-100 font-black text-slate-950">
                          <td className="p-2.5 text-center font-black" colSpan={2}>TỔNG ĐIỂM ĐÁNH GIÁ TRUNG BÌNH TOÀN CHI ĐOÀN</td>
                          <td className="p-2.5 text-center">100 điểm</td>
                          <td className="p-2.5 text-center text-blue-800 text-sm">{reportStats.avgScore}</td>
                          <td className="p-2.5 text-center text-emerald-700 text-sm">{reportStats.avgScore}%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section III: Classification Breakdown */}
                <div>
                  <h4 className="text-xs font-black uppercase text-blue-950 flex items-center gap-1.5 border-b border-slate-200 pb-1 mb-2">
                    <span>III. KẾT QUẢ XẾP LOẠI CHẤT LƯỢNG ĐOÀN VIÊN</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3">
                    <div className="p-2.5 rounded-xl border border-amber-300 bg-amber-50/50">
                      <div className="font-bold text-amber-900">Loại Xuất sắc (≥90đ):</div>
                      <div className="text-base font-black text-amber-700 mt-0.5">
                        {reportStats.excellentCount} ĐV ({reportStats.excellentPercent}%)
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/50">
                      <div className="font-bold text-emerald-900">Loại Khá (70 - 89đ):</div>
                      <div className="text-base font-black text-emerald-700 mt-0.5">
                        {reportStats.goodCount} ĐV ({reportStats.goodPercent}%)
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl border border-blue-300 bg-blue-50/50">
                      <div className="font-bold text-blue-900">Loại Trung bình (50 - 69đ):</div>
                      <div className="text-base font-black text-blue-700 mt-0.5">
                        {reportStats.fairCount} ĐV ({reportStats.fairPercent}%)
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl border border-rose-300 bg-rose-50/50">
                      <div className="font-bold text-rose-900">Chưa đạt (&lt;50đ):</div>
                      <div className="text-base font-black text-rose-700 mt-0.5">
                        {reportStats.poorCount} ĐV ({reportStats.poorPercent}%)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section IV: Detailed Roster Matrix */}
                <div>
                  <h4 className="text-xs font-black uppercase text-blue-950 flex items-center gap-1.5 border-b border-slate-200 pb-1 mb-2">
                    <span>IV. BẢNG TỔNG HỢP CHI TIẾT TỪNG ĐOÀN VIÊN TRONG KỲ ({processedRecords.length} ĐOÀN VIÊN)</span>
                  </h4>
                  <div className="border border-slate-300 rounded-xl overflow-hidden mb-3">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 font-bold text-slate-800 border-b border-slate-300">
                        <tr>
                          <th className="p-2 text-center w-8">STT</th>
                          <th className="p-2">Họ và tên</th>
                          <th className="p-2">Mã ĐV</th>
                          <th className="p-2">Nhóm công tác</th>
                          <th className="p-2 text-center">5 Tiêu chí</th>
                          <th className="p-2 text-center">Tổng</th>
                          <th className="p-2 text-center">Chuyên cần</th>
                          <th className="p-2 text-center">Xếp loại</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                        {processedRecords.map((r, idx) => (
                          <tr key={r.id} className="hover:bg-slate-50">
                            <td className="p-2 text-center font-bold text-slate-500">{idx + 1}</td>
                            <td className="p-2 font-bold text-slate-900">{r.memberName}</td>
                            <td className="p-2 text-slate-500 font-mono text-[10px]">{r.memberCode}</td>
                            <td className="p-2 text-slate-700">{r.workGroupName || 'Tổ CN số'}</td>
                            <td className="p-2 text-center font-semibold text-slate-600">
                              {r.ideologyScore}-{r.ethicsScore}-{r.studyLaborScore}-{r.physicalSkillScore}-{r.disciplineVolunteerScore}
                            </td>
                            <td className="p-2 text-center font-black text-blue-900">{r.totalScore}đ</td>
                            <td className="p-2 text-center font-bold text-slate-700">
                              {r.attendedInPeriod}/{r.totalPossibleInPeriod} ({r.periodAttendanceRate}%)
                            </td>
                            <td className="p-2 text-center">
                              <span className={`px-1.5 py-0.5 rounded font-black text-[9px] uppercase ${
                                r.trainingStatus === 'XUẤT SẮC' ? 'bg-amber-100 text-amber-900' :
                                r.trainingStatus === 'KHÁ' ? 'bg-emerald-100 text-emerald-900' :
                                'bg-slate-100 text-slate-800'
                              }`}>
                                {r.trainingStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section V: General Comments & Evaluation */}
                <div>
                  <h4 className="text-xs font-black uppercase text-blue-950 flex items-center gap-1.5 border-b border-slate-200 pb-1 mb-2">
                    <span>V. ĐÁNH GIÁ CHUNG VÀ PHƯƠNG HƯỚNG KỲ TIẾP THEO</span>
                  </h4>
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 font-serif italic text-slate-800">
                    <p>• {customReportNote}</p>
                    <p>• Chi đoàn tiếp tục duy trì sinh hoạt định kỳ, nâng cao hiệu quả các nhóm công tác thanh niên và bồi dưỡng đoàn viên ưu tú giới thiệu cho Đảng xem xét kết nạp.</p>
                  </div>
                </div>

                {/* Signatures Block */}
                <div className="grid grid-cols-2 pt-8 text-center text-xs font-sans">
                  <div>
                    <div className="font-black uppercase text-slate-800">NGƯỜI LẬP BÁO CÁO</div>
                    <div className="text-[11px] text-slate-400 italic mb-16">(Ký và ghi rõ họ tên)</div>
                    <div className="font-black text-slate-900 text-sm">{reportSignerName}</div>
                    <div className="text-[11px] text-slate-500 font-bold">{reportSignerRole}</div>
                  </div>

                  <div>
                    <div className="font-black uppercase text-slate-800">TM. BAN CHẤP HÀNH CHI ĐOÀN</div>
                    <div className="text-[11px] text-slate-400 italic mb-16">BÍ THƯ CHI ĐOÀN</div>
                    <div className="font-black text-slate-900 text-sm">{currentBranch?.secretary || 'Trần Thị Bích'}</div>
                    <div className="text-[11px] text-slate-500 font-bold">Bí thư Chi đoàn {currentBranch?.name?.replace(/Chi đoàn\s*/i, '')}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED SUMMARY TABLE & MATRIX */}
          {modalTab === 'SUMMARY_TABLE' && (
            <div className="space-y-5">
              {/* Stat Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Tổng hồ sơ rèn luyện</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{reportStats.total}</div>
                  <p className="text-[11px] text-blue-600 font-semibold mt-1">
                    {periodLabel}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Điểm trung bình</span>
                  <div className="text-2xl font-black text-blue-600 mt-1">{reportStats.avgScore} <span className="text-xs text-slate-400 font-normal">/ 100đ</span></div>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    {reportStats.excellentCount} ĐV Xuất sắc
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Chuyên cần kỳ này</span>
                  <div className="text-2xl font-black text-emerald-600 mt-1">{reportStats.avgAttendanceRate}%</div>
                  <p className="text-[11px] text-slate-500 font-semibold mt-1">
                    {relevantMonthIndices.length} kỳ sinh hoạt chi đoàn
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Kỹ năng số & Tình nguyện</span>
                  <div className="text-2xl font-black text-purple-600 mt-1">{reportStats.digitalPercent}%</div>
                  <p className="text-[11px] text-purple-700 font-semibold mt-1">
                    {reportStats.totalVolunteers} lượt công tác tình nguyện
                  </p>
                </div>
              </div>

              {/* Classification Bars */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Phân bổ xếp loại thi đua đoàn viên</span>
                  <span className="text-blue-600">{reportStats.total} đoàn viên được đánh giá</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                  <div style={{ width: `${reportStats.excellentPercent}%` }} className="bg-amber-400 h-full" title={`Xuất sắc: ${reportStats.excellentPercent}%`} />
                  <div style={{ width: `${reportStats.goodPercent}%` }} className="bg-emerald-500 h-full" title={`Khá: ${reportStats.goodPercent}%`} />
                  <div style={{ width: `${reportStats.fairPercent}%` }} className="bg-blue-400 h-full" title={`Trung bình: ${reportStats.fairPercent}%`} />
                  <div style={{ width: `${reportStats.poorPercent}%` }} className="bg-rose-400 h-full" title={`Chưa đạt: ${reportStats.poorPercent}%`} />
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span>Xuất sắc: {reportStats.excellentCount} ({reportStats.excellentPercent}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Khá: {reportStats.goodCount} ({reportStats.goodPercent}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                    <span>Trung bình: {reportStats.fairCount} ({reportStats.fairPercent}%)</span>
                  </div>
                  {reportStats.poorCount > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <span>Chưa đạt: {reportStats.poorCount} ({reportStats.poorPercent}%)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Filter controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  <div className="relative flex-1 min-w-[200px] max-w-xs">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm đoàn viên, mã số..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                  >
                    <option value="ALL">Tất cả xếp loại</option>
                    <option value="XUẤT SẮC">Xuất sắc</option>
                    <option value="KHÁ">Khá</option>
                    <option value="TRUNG BÌNH">Trung bình</option>
                  </select>

                  <select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                  >
                    <option value="ALL">Tất cả nhóm công tác</option>
                    {workGroups.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                <div className="text-xs text-slate-500 font-semibold">
                  Hiển thị <strong className="text-slate-900">{displayRecords.length}</strong> / {processedRecords.length} đoàn viên
                </div>
              </div>

              {/* Data Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-3">Đoàn Viên</th>
                        <th className="p-3">Nhóm Công Tác</th>
                        <th className="p-3 text-center">Tư tưởng (20)</th>
                        <th className="p-3 text-center">Đạo đức (20)</th>
                        <th className="p-3 text-center">Học tập (20)</th>
                        <th className="p-3 text-center">Thể chất (20)</th>
                        <th className="p-3 text-center">Kỷ luật (20)</th>
                        <th className="p-3 text-center">Tổng Điểm</th>
                        <th className="p-3 text-center">Chuyên cần ({periodLabel})</th>
                        <th className="p-3 text-center">Xếp Loại</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {displayRecords.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{r.memberName}</div>
                            <div className="text-[10px] text-slate-400">{r.memberCode}</div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                              {r.workGroupName || 'Tổ thanh niên'}
                            </span>
                          </td>
                          <td className="p-3 text-center font-bold text-blue-700">{r.ideologyScore}</td>
                          <td className="p-3 text-center font-bold text-emerald-700">{r.ethicsScore}</td>
                          <td className="p-3 text-center font-bold text-amber-700">{r.studyLaborScore}</td>
                          <td className="p-3 text-center font-bold text-purple-700">{r.physicalSkillScore}</td>
                          <td className="p-3 text-center font-bold text-rose-700">{r.disciplineVolunteerScore}</td>
                          <td className="p-3 text-center">
                            <span className="font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                              {r.totalScore}đ
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="font-bold text-slate-800">
                              {r.attendedInPeriod}/{r.totalPossibleInPeriod} buổi
                            </div>
                            <div className="text-[10px] text-emerald-600 font-semibold">
                              {r.periodAttendanceRate}%
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              r.trainingStatus === 'XUẤT SẮC' ? 'bg-amber-100 text-amber-900' :
                              r.trainingStatus === 'KHÁ' ? 'bg-emerald-100 text-emerald-900' :
                              'bg-slate-100 text-slate-800'
                            }`}>
                              {r.trainingStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONFIGURATION FORM */}
          {modalTab === 'CONFIG' && (
            <div className="max-w-2xl mx-auto bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                <Sliders className="w-5 h-5 text-blue-600" />
                <h4 className="text-sm font-black text-slate-900 uppercase">
                  Cấu hình tham số và tiêu đề báo cáo hành chính
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số hiệu văn bản báo cáo</label>
                  <input
                    type="text"
                    value={reportNumber}
                    onChange={(e) => setReportNumber(e.target.value)}
                    placeholder="VD: 03/BC-ĐTN"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Người lập biểu / ký tên</label>
                  <input
                    type="text"
                    value={reportSignerName}
                    onChange={(e) => setReportSignerName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chức vụ người lập biểu</label>
                  <input
                    type="text"
                    value={reportSignerRole}
                    onChange={(e) => setReportSignerRole(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chi đoàn báo cáo</label>
                  <input
                    type="text"
                    readOnly
                    value={currentBranch?.name || 'Chi đoàn Khu phố 1'}
                    className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Ghi chú & Nhận xét đánh giá chung của Chi đoàn</label>
                  <textarea
                    rows={3}
                    value={customReportNote}
                    onChange={(e) => setCustomReportNote(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalTab('PREVIEW_PDF')}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Áp dụng & Xem Báo Cáo</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer actions (Hidden on Print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 print:hidden">
          <div className="text-xs text-slate-500 font-medium">
            Phân hệ Quản lý & Báo cáo Rèn luyện Đoàn viên số • Đoàn Phường Chánh Hiệp
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              Đóng
            </button>
            <button
              onClick={handleExportCsv}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải Bảng Excel (.csv)</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In / Xuất PDF Ngay</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
