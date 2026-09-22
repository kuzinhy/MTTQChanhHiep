import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Award, 
  CheckCircle2, 
  Calendar, 
  UserCheck, 
  Star, 
  Edit3, 
  Printer, 
  Save, 
  X, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Trophy, 
  TrendingUp, 
  Clock, 
  FileText, 
  Users, 
  Layers, 
  HeartHandshake, 
  GraduationCap,
  Plus,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { 
  YouthMemberTrainingRecord, 
  YouthMember, 
  BranchInfo, 
  loadStoredTrainingRecords, 
  saveStoredTrainingRecords, 
  loadStoredYouthMembers,
  loadStoredWorkGroups,
  YouthWorkGroup
} from '../youthUnionData';
import { YouthTrainingReportModal } from './YouthTrainingReportModal';

interface Props {
  branchId: string;
  branches: BranchInfo[];
  onNotify: (msg: string) => void;
}

export const YouthTrainingRecordsTab: React.FC<Props> = ({ branchId, branches, onNotify }) => {
  const [records, setRecords] = useState<YouthMemberTrainingRecord[]>(() => loadStoredTrainingRecords());
  const [members] = useState<YouthMember[]>(() => loadStoredYouthMembers());
  const [workGroups] = useState<YouthWorkGroup[]>(() => loadStoredWorkGroups());

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('ALL');

  // Modal States
  const [editingRecord, setEditingRecord] = useState<YouthMemberTrainingRecord | null>(null);
  const [viewingLedgerRecord, setViewingLedgerRecord] = useState<YouthMemberTrainingRecord | null>(null);
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Form State for Evaluation
  const [formIdeology, setFormIdeology] = useState(20);
  const [formEthics, setFormEthics] = useState(20);
  const [formStudyLabor, setFormStudyLabor] = useState(19);
  const [formPhysicalSkill, setFormPhysicalSkill] = useState(19);
  const [formDiscipline, setFormDiscipline] = useState(20);
  const [formVolunteerCount, setFormVolunteerCount] = useState(12);
  const [formDigitalSkills, setFormDigitalSkills] = useState(true);
  const [formStatus, setFormStatus] = useState<'XUẤT SẮC' | 'KHÁ' | 'TRUNG BÌNH' | 'CHƯA ĐẠT'>('XUẤT SẮC');
  const [formSelfComment, setFormSelfComment] = useState('');
  const [formBranchComment, setFormBranchComment] = useState('');
  const [formVerifiedBy, setFormVerifiedBy] = useState('Trần Thị Bích (Bí thư Chi đoàn)');

  // Form State for Add Member to Ledger
  const [selectedMemberIdForAdd, setSelectedMemberIdForAdd] = useState('');

  // Total Score live computed
  const liveTotalScore = Number(formIdeology) + Number(formEthics) + Number(formStudyLabor) + Number(formPhysicalSkill) + Number(formDiscipline);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchSearch = r.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.memberCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = selectedStatus === 'ALL' || r.trainingStatus === selectedStatus;
      const matchGroup = selectedGroupId === 'ALL' || r.workGroupId === selectedGroupId;
      return matchSearch && matchStatus && matchGroup;
    });
  }, [records, searchTerm, selectedStatus, selectedGroupId]);

  // Overall Statistics
  const stats = useMemo(() => {
    const total = records.length;
    const avgScore = total > 0 ? Math.round(records.reduce((acc, r) => acc + r.totalScore, 0) / total) : 0;
    const excellent = records.filter(r => r.trainingStatus === 'XUẤT SẮC').length;
    const totalVolunteerDays = records.reduce((acc, r) => acc + r.volunteerActivitiesCount, 0);
    const avgAttendance = total > 0 ? Math.round(records.reduce((acc, r) => acc + r.meetingAttendance, 0) / total) : 0;

    return { total, avgScore, excellent, totalVolunteerDays, avgAttendance };
  }, [records]);

  // Members not yet in records
  const unrecordedMembers = useMemo(() => {
    const existingIds = new Set(records.map(r => r.memberId));
    return members.filter(m => !existingIds.has(m.id));
  }, [members, records]);

  // Toggle monthly attendance
  const handleToggleAttendance = (recordId: string, monthIdx: number) => {
    const updated = records.map(r => {
      if (r.id !== recordId) return r;
      const nextMonthly = [...r.monthlyAttendance];
      nextMonthly[monthIdx] = !nextMonthly[monthIdx];
      const nextCount = nextMonthly.filter(Boolean).length;
      return {
        ...r,
        monthlyAttendance: nextMonthly,
        meetingAttendance: nextCount
      };
    });

    setRecords(updated);
    saveStoredTrainingRecords(updated);
    onNotify('Cập nhật điểm danh sinh hoạt chi đoàn thành công!');
  };

  // Open Edit Modal
  const handleOpenEdit = (record: YouthMemberTrainingRecord) => {
    setEditingRecord(record);
    setFormIdeology(record.ideologyScore);
    setFormEthics(record.ethicsScore);
    setFormStudyLabor(record.studyLaborScore);
    setFormPhysicalSkill(record.physicalSkillScore);
    setFormDiscipline(record.disciplineVolunteerScore);
    setFormVolunteerCount(record.volunteerActivitiesCount);
    setFormDigitalSkills(record.digitalSkillsCompleted);
    setFormStatus(record.trainingStatus);
    setFormSelfComment(record.selfEvaluationComment || '');
    setFormBranchComment(record.branchEvaluationComment || '');
    setFormVerifiedBy(record.verifiedBy || 'BCH Chi đoàn Khu phố 1');
  };

  // Save Edit Evaluation
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    const total = Number(formIdeology) + Number(formEthics) + Number(formStudyLabor) + Number(formPhysicalSkill) + Number(formDiscipline);

    const updated = records.map(r => {
      if (r.id !== editingRecord.id) return r;
      return {
        ...r,
        ideologyScore: Number(formIdeology),
        ethicsScore: Number(formEthics),
        studyLaborScore: Number(formStudyLabor),
        physicalSkillScore: Number(formPhysicalSkill),
        disciplineVolunteerScore: Number(formDiscipline),
        totalScore: total,
        volunteerActivitiesCount: Number(formVolunteerCount),
        digitalSkillsCompleted: formDigitalSkills,
        trainingStatus: formStatus,
        selfEvaluationComment: formSelfComment.trim(),
        branchEvaluationComment: formBranchComment.trim(),
        verifiedDate: new Date().toLocaleDateString('vi-VN'),
        verifiedBy: formVerifiedBy.trim()
      };
    });

    setRecords(updated);
    saveStoredTrainingRecords(updated);
    setEditingRecord(null);
    onNotify(`Đã lưu kết quả rèn luyện cho đoàn viên ${editingRecord.memberName}!`);
  };

  // Add Member to Training Ledger
  const handleAddMemberRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMember = members.find(m => m.id === selectedMemberIdForAdd);
    if (!targetMember) return;

    const newRecord: YouthMemberTrainingRecord = {
      id: 'tr_' + Date.now(),
      memberId: targetMember.id,
      memberName: targetMember.fullName,
      memberCode: targetMember.memberCode,
      branchId: targetMember.branchId,
      year: 2026,
      workGroupId: targetMember.workGroupId || 'wg_001',
      workGroupName: targetMember.workGroupName || 'Tổ Công nghệ số cộng đồng',
      ideologyScore: 18,
      ethicsScore: 18,
      studyLaborScore: 18,
      physicalSkillScore: 18,
      disciplineVolunteerScore: 18,
      totalScore: 90,
      meetingAttendance: 10,
      monthlyAttendance: [true, true, true, true, true, true, true, true, true, true, false, false],
      volunteerActivitiesCount: 8,
      digitalSkillsCompleted: true,
      trainingStatus: 'XUẤT SẮC',
      selfEvaluationComment: 'Tích cực tham gia các phong trào chi đoàn và hoàn thành tốt nhiệm vụ.',
      branchEvaluationComment: 'Đoàn viên gương mẫu, chấp hành tốt điều lệ Đoàn.',
      verifiedDate: new Date().toLocaleDateString('vi-VN'),
      verifiedBy: 'Trần Thị Bích (Bí thư Chi đoàn)'
    };

    const next = [...records, newRecord];
    setRecords(next);
    saveStoredTrainingRecords(next);
    setIsAddRecordModalOpen(false);
    onNotify(`Đã mở sổ theo dõi rèn luyện cho ${targetMember.fullName}!`);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Đoàn viên rèn luyện</span>
            <div className="text-2xl font-black text-slate-900">{stats.total} hồ sơ</div>
            <div className="text-[11px] text-blue-600 font-bold flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Năm thi đua 2026
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Điểm rèn luyện TB</span>
            <div className="text-2xl font-black text-amber-500">{stats.avgScore} / 100đ</div>
            <div className="text-[11px] text-amber-700 font-bold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> {stats.excellent} Đoàn viên Xuất sắc
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <Star className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hoạt động tình nguyện</span>
            <div className="text-2xl font-black text-emerald-600">{stats.totalVolunteerDays} lượt</div>
            <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5" /> Chủ nhật xanh & An sinh
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <HeartHandshake className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sinh hoạt định kỳ TB</span>
            <div className="text-2xl font-black text-indigo-600">{stats.avgAttendance} / 12 kỳ</div>
            <div className="text-[11px] text-indigo-600 font-bold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Đạt tỷ lệ 92% chuyên cần
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Criteria Breakdown Explainer Box */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-blue-500 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                QUY ĐỊNH ĐOÀN TNCS HỒ CHÍ MINH
              </span>
              <span className="text-xs text-blue-200">• Khung Đánh Giá Rèn Luyện 5 Tiêu Chí Chuẩn</span>
            </div>
            <h3 className="text-base sm:text-lg font-black mt-1">
              Chương trình Rèn luyện Đoàn viên số giai đoạn 2026 - 2027
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/10 rounded-xl text-xs font-bold text-blue-200 border border-white/10">
              Tổng điểm tối đa: 100 điểm
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-black text-blue-300 uppercase">Tiêu chí 1 (20đ)</span>
            <div className="font-bold text-white">Tư tưởng, Chính trị</div>
            <p className="text-[11px] text-slate-300">Nhận thức cách mạng, học tập Nghị quyết Đảng & Đoàn.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-black text-emerald-300 uppercase">Tiêu chí 2 (20đ)</span>
            <div className="font-bold text-white">Đạo đức & Lối sống</div>
            <p className="text-[11px] text-slate-300">Lối sống gương mẫu, văn hóa ứng xử, phòng chống tệ nạn.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-black text-amber-300 uppercase">Tiêu chí 3 (20đ)</span>
            <div className="font-bold text-white">Học tập & Sáng tạo</div>
            <p className="text-[11px] text-slate-300">Nâng cao chuyên môn, sáng kiến số, khởi nghiệp.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-black text-purple-300 uppercase">Tiêu chí 4 (20đ)</span>
            <div className="font-bold text-white">Thể chất & Kỹ năng</div>
            <p className="text-[11px] text-slate-300">Rèn luyện thân thể, kỹ năng mềm, công tác thanh thiếu nhi.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-black text-rose-300 uppercase">Tiêu chí 5 (20đ)</span>
            <div className="font-bold text-white">Kỷ luật & Tình nguyện</div>
            <p className="text-[11px] text-slate-300">Chấp hành điều lệ, đóng đoàn phí, tham gia phong trào xung kích.</p>
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Tìm kiếm đoàn viên, mã số đoàn viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2.5 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">Tất cả xếp loại</option>
            <option value="XUẤT SẮC">Xuất sắc (≥90đ)</option>
            <option value="KHÁ">Khá (70 - 89đ)</option>
            <option value="TRUNG BÌNH">Trung bình (50 - 69đ)</option>
          </select>

          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2.5 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">Tất cả Nhóm công tác</option>
            {workGroups.map(g => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
            title="Tạo báo cáo đánh giá rèn luyện đoàn viên theo tháng hoặc theo quý (PDF / Bảng tổng hợp)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>Tạo & Xuất Báo Cáo Định Kỳ</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
              PDF / Excel
            </span>
          </button>

          <button
            onClick={() => {
              if (unrecordedMembers.length > 0) {
                setSelectedMemberIdForAdd(unrecordedMembers[0].id);
                setIsAddRecordModalOpen(true);
              } else {
                onNotify('Tất cả đoàn viên trong chi đoàn đã có sổ rèn luyện!');
              }
            }}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Mở Sổ rèn luyện</span>
          </button>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Sổ Theo Dõi Quá Trình Rèn Luyện & Sinh Hoạt Chi Đoàn 2026 ({filteredRecords.length})
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Nhấn vào ô tháng để cập nhật điểm danh sinh hoạt định kỳ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Xuất Báo Cáo Tháng / Quý</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4">Đoàn Viên</th>
                <th className="p-4">Nhóm Công Tác</th>
                <th className="p-4 text-center">5 Tiêu Chí (Điểm)</th>
                <th className="p-4 text-center">Tổng Điểm</th>
                <th className="p-4 text-center">Điểm Danh 12 Tháng (T1 - T12)</th>
                <th className="p-4 text-center">Tình Nguyện</th>
                <th className="p-4 text-center">Xếp Loại</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredRecords.map(record => {
                const isExcellent = record.trainingStatus === 'XUẤT SẮC';

                return (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div>
                        <div className="font-bold text-slate-900">{record.memberName}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{record.memberCode}</div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold">
                        {record.workGroupName || 'Tổ Công nghệ số'}
                      </span>
                    </td>

                    {/* Breakdown Scores */}
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold">
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700" title="Tư tưởng">{record.ideologyScore}</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700" title="Đạo đức">{record.ethicsScore}</span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700" title="Học tập">{record.studyLaborScore}</span>
                        <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700" title="Thể chất">{record.physicalSkillScore}</span>
                        <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700" title="Kỷ luật">{record.disciplineVolunteerScore}</span>
                      </div>
                    </td>

                    {/* Total Score */}
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${
                        isExcellent 
                          ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {record.totalScore}đ
                      </span>
                    </td>

                    {/* 12 Month Attendance Check Matrix */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        {record.monthlyAttendance.map((attended, mIdx) => (
                          <button
                            key={mIdx}
                            onClick={() => handleToggleAttendance(record.id, mIdx)}
                            className={`w-5 h-6 rounded text-[9px] font-black flex items-center justify-center transition-all cursor-pointer ${
                              attended 
                                ? 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700' 
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            }`}
                            title={`Tháng ${mIdx + 1}: ${attended ? 'Có mặt' : 'Vắng'}`}
                          >
                            T{mIdx + 1}
                          </button>
                        ))}
                      </div>
                      <div className="text-center text-[10px] text-slate-400 font-bold mt-1">
                        {record.meetingAttendance} / 12 kỳ sinh hoạt
                      </div>
                    </td>

                    {/* Volunteer Activities */}
                    <td className="p-4 text-center">
                      <div className="font-bold text-slate-800">{record.volunteerActivitiesCount} ngày công</div>
                      {record.digitalSkillsCompleted && (
                        <span className="text-[10px] text-indigo-600 font-bold flex items-center justify-center gap-1 mt-0.5">
                          <Check className="w-3 h-3" /> Chuẩn kỹ năng số
                        </span>
                      )}
                    </td>

                    {/* Classification */}
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        record.trainingStatus === 'XUẤT SẮC' ? 'bg-amber-100 text-amber-900' :
                        record.trainingStatus === 'KHÁ' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {record.trainingStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewingLedgerRecord(record)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all cursor-pointer"
                          title="Xem Phiếu rèn luyện điện tử"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(record)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all cursor-pointer"
                          title="Đánh giá & Chấm điểm"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Edit & Evaluate Training Record */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl border border-slate-200 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Đánh giá quá trình rèn luyện đoàn viên
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đoàn viên: <strong className="text-slate-800">{editingRecord.memberName}</strong> ({editingRecord.memberCode})
                </p>
              </div>
              <button 
                onClick={() => setEditingRecord(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5 mt-5">
              {/* Score Breakdown inputs */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-700">Chấm điểm 5 tiêu chí rèn luyện</h4>
                  <div className="text-sm font-black text-amber-600">
                    Tổng điểm: {liveTotalScore} / 100đ
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">1. Tư tưởng, nhận thức chính trị (Max 20đ)</label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={formIdeology}
                      onChange={(e) => setFormIdeology(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">2. Đạo đức, lối sống, tác phong (Max 20đ)</label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={formEthics}
                      onChange={(e) => setFormEthics(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">3. Học tập, lao động & sáng tạo (Max 20đ)</label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={formStudyLabor}
                      onChange={(e) => setFormStudyLabor(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">4. Thể chất & kỹ năng thực hành (Max 20đ)</label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={formPhysicalSkill}
                      onChange={(e) => setFormPhysicalSkill(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">5. Kỷ luật & tình nguyện xung kích (Max 20đ)</label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={formDiscipline}
                      onChange={(e) => setFormDiscipline(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số ngày công hoạt động tình nguyện</label>
                    <input
                      type="number"
                      min={0}
                      value={formVolunteerCount}
                      onChange={(e) => setFormVolunteerCount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-emerald-600"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formDigitalSkills}
                      onChange={(e) => setFormDigitalSkills(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600"
                    />
                    <span>Hoàn thành bài kiểm tra Kỹ năng số & An toàn thông tin</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Xếp loại:</span>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-800"
                    >
                      <option value="XUẤT SẮC">XUẤT SẮC</option>
                      <option value="KHÁ">KHÁ</option>
                      <option value="TRUNG BÌNH">TRUNG BÌNH</option>
                      <option value="CHƯA ĐẠT">CHƯA ĐẠT</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Assessment Comments */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Đoàn viên tự nhận xét quá trình rèn luyện</label>
                  <textarea
                    rows={2}
                    value={formSelfComment}
                    onChange={(e) => setFormSelfComment(e.target.value)}
                    placeholder="Ghi nhận những nỗ lực, ưu điểm và định hướng phấn đấu..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ý kiến đánh giá & nhận xét của BCH Chi đoàn</label>
                  <textarea
                    rows={2}
                    value={formBranchComment}
                    onChange={(e) => setFormBranchComment(e.target.value)}
                    placeholder="Nhận xét tinh thần trách nhiệm, mức độ hoàn thành nhiệm vụ chi đoàn..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Người ký xác nhận / Chức vụ</label>
                  <input
                    type="text"
                    value={formVerifiedBy}
                    onChange={(e) => setFormVerifiedBy(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu kết quả rèn luyện</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Official Digital Training Record Sheet */}
      {viewingLedgerRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
              <span className="text-xs font-black uppercase text-blue-600">Sổ Rèn Luyện Đoàn Viên Điện Tử</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In Phiếu</span>
                </button>
                <button 
                  onClick={() => setViewingLedgerRecord(null)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Training Certificate Card */}
            <div className="mt-4 border border-slate-300 rounded-2xl p-6 bg-slate-50/50 space-y-5">
              <div className="text-center space-y-1 pb-4 border-b border-slate-200">
                <div className="text-[11px] font-black uppercase text-slate-500 tracking-wider">ĐOÀN TNCS HỒ CHÍ MINH TP. THỦ DẦU MỘT</div>
                <div className="text-xs font-extrabold uppercase text-blue-700">BCH ĐOÀN PHƯỜNG CHÁNH HIỆP</div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 mt-2">
                  PHIẾU THEO DÕI RÈN LUYỆN ĐOÀN VIÊN NĂM 2026
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500">Họ và tên đoàn viên:</span>
                  <div className="font-black text-slate-900 text-sm">{viewingLedgerRecord.memberName}</div>
                </div>
                <div>
                  <span className="text-slate-500">Mã số đoàn viên:</span>
                  <div className="font-black text-slate-900 text-sm">{viewingLedgerRecord.memberCode}</div>
                </div>
                <div>
                  <span className="text-slate-500">Chi đoàn sinh hoạt:</span>
                  <div className="font-bold text-slate-800">Chi đoàn Khu phố 1</div>
                </div>
                <div>
                  <span className="text-slate-500">Nhóm công tác phụ trách:</span>
                  <div className="font-bold text-slate-800">{viewingLedgerRecord.workGroupName}</div>
                </div>
              </div>

              {/* 5 Criteria Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Nội dung rèn luyện (5 Tiêu chí chuẩn)</th>
                      <th className="p-3 text-center w-24">Điểm đạt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    <tr>
                      <td className="p-3">1. Rèn luyện về lý tưởng cách mạng, nhận thức chính trị (Max 20đ)</td>
                      <td className="p-3 text-center font-bold text-blue-700">{viewingLedgerRecord.ideologyScore}</td>
                    </tr>
                    <tr>
                      <td className="p-3">2. Rèn luyện về đạo đức, lối sống, tác phong (Max 20đ)</td>
                      <td className="p-3 text-center font-bold text-emerald-700">{viewingLedgerRecord.ethicsScore}</td>
                    </tr>
                    <tr>
                      <td className="p-3">3. Rèn luyện về học tập, lao động sáng tạo & chuyên môn (Max 20đ)</td>
                      <td className="p-3 text-center font-bold text-amber-700">{viewingLedgerRecord.studyLaborScore}</td>
                    </tr>
                    <tr>
                      <td className="p-3">4. Rèn luyện về thể chất và kỹ năng thực hành xã hội (Max 20đ)</td>
                      <td className="p-3 text-center font-bold text-purple-700">{viewingLedgerRecord.physicalSkillScore}</td>
                    </tr>
                    <tr>
                      <td className="p-3">5. Rèn luyện về ý thức tổ chức kỷ luật và tình nguyện (Max 20đ)</td>
                      <td className="p-3 text-center font-bold text-rose-700">{viewingLedgerRecord.disciplineVolunteerScore}</td>
                    </tr>
                    <tr className="bg-amber-50/70 font-black text-slate-900">
                      <td className="p-3">TỔNG ĐIỂM RÈN LUYỆN NĂM 2026</td>
                      <td className="p-3 text-center text-sm text-amber-700">{viewingLedgerRecord.totalScore} / 100đ</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Assessment details */}
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-600 mb-1">Đoàn viên tự nhận xét:</div>
                  <p className="text-slate-800 italic">"{viewingLedgerRecord.selfEvaluationComment}"</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-600 mb-1">Nhận xét của Ban Chấp hành Chi đoàn:</div>
                  <p className="text-slate-800 italic">"{viewingLedgerRecord.branchEvaluationComment}"</p>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 pt-4 text-center text-xs">
                <div>
                  <div className="font-bold text-slate-600">ĐOÀN VIÊN</div>
                  <div className="mt-12 font-black text-slate-900">{viewingLedgerRecord.memberName}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Chánh Hiệp, ngày {viewingLedgerRecord.verifiedDate}</div>
                  <div className="font-bold text-slate-600">TM. BAN CHẤP HÀNH CHI ĐOÀN</div>
                  <div className="mt-10 font-black text-slate-900">{viewingLedgerRecord.verifiedBy}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Member to Training Ledger */}
      {isAddRecordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Mở Sổ rèn luyện đoàn viên mới
              </h3>
              <button 
                onClick={() => setIsAddRecordModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMemberRecord} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chọn đoàn viên *</label>
                <select
                  value={selectedMemberIdForAdd}
                  onChange={(e) => setSelectedMemberIdForAdd(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {unrecordedMembers.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} - {m.memberCode} ({m.position})
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-slate-500">
                Khi khởi tạo, sổ rèn luyện sẽ thiết lập 5 tiêu chí theo khung điểm chuẩn của Đoàn phường năm 2026.
              </p>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRecordModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Khởi tạo Sổ rèn luyện</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Creation and Export Modal */}
      <YouthTrainingReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        branchId={branchId}
        branches={branches}
        records={records}
        members={members}
        workGroups={workGroups}
        onNotify={onNotify}
      />
    </div>
  );
};
