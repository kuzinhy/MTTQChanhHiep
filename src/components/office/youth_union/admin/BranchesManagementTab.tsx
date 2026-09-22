import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  X, 
  Save, 
  Phone, 
  UserCheck, 
  Award, 
  Sparkles,
  School,
  Shield,
  Briefcase,
  FileText,
  Calendar,
  Layers,
  Printer,
  QrCode,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  Check,
  AlertCircle,
  FolderOpen,
  Send,
  Flag,
  Percent,
  DollarSign,
  Download
} from 'lucide-react';
import { 
  BranchInfo, 
  BranchMeetingMinute,
  BranchYouthProject,
  YouthMember,
  loadStoredBranches, 
  saveStoredBranches,
  loadStoredMeetingMinutes,
  saveStoredMeetingMinutes,
  loadStoredYouthProjects,
  saveStoredYouthProjects,
  loadStoredYouthMembers
} from '../youthUnionData';

interface Props {
  onNotify: (msg: string) => void;
}

type SubTab = 'directory' | 'meeting_minutes' | 'youth_projects' | 'three_initiatives';

export const BranchesManagementTab: React.FC<Props> = ({ onNotify }) => {
  const [branches, setBranches] = useState<BranchInfo[]>(() => loadStoredBranches());
  const [meetingMinutes, setMeetingMinutes] = useState<BranchMeetingMinute[]>(() => loadStoredMeetingMinutes());
  const [youthProjects, setYouthProjects] = useState<BranchYouthProject[]>(() => loadStoredYouthProjects());
  const [youthMembers, setYouthMembers] = useState<YouthMember[]>(() => loadStoredYouthMembers());

  // Sub Tab Navigation
  const [activeTab, setActiveTab] = useState<SubTab>('directory');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal States
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchInfo | null>(null);

  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [dossierBranch, setDossierBranch] = useState<BranchInfo | null>(null);

  const [isMinuteModalOpen, setIsMinuteModalOpen] = useState(false);
  const [editingMinute, setEditingMinute] = useState<BranchMeetingMinute | null>(null);
  const [viewingMinuteDossier, setViewingMinuteDossier] = useState<BranchMeetingMinute | null>(null);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<BranchYouthProject | null>(null);

  // Form State - Branch
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<BranchInfo['type']>('DÂN CƯ');
  const [formSecretary, setFormSecretary] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDeputySecretary, setFormDeputySecretary] = useState('');
  const [formExecutiveMembers, setFormExecutiveMembers] = useState('');
  const [formTerm, setFormTerm] = useState('2025 - 2027');
  const [formPartyMembers, setFormPartyMembers] = useState<number>(2);
  const [formYouthGatheringRate, setFormYouthGatheringRate] = useState<number>(75);
  const [formMeetingDay, setFormMeetingDay] = useState('Ngày 15 hàng tháng');
  const [formRating, setFormRating] = useState<BranchInfo['threeInitiativesRating']>('XUẤT SẮC');
  const [formAddress, setFormAddress] = useState('Văn phòng BĐH Khu phố, P. Chánh Hiệp');
  const [formMembersCount, setFormMembersCount] = useState<number>(30);

  // Form State - Meeting Minute
  const [formMinuteBranchId, setFormMinuteBranchId] = useState(branches[0]?.id || 'kp1');
  const [formMinuteMonth, setFormMinuteMonth] = useState('Tháng 09/2026');
  const [formMinuteDate, setFormMinuteDate] = useState('15/09/2026');
  const [formMinuteTopic, setFormMinuteTopic] = useState('');
  const [formMinuteHost, setFormMinuteHost] = useState('');
  const [formMinuteSecretary, setFormMinuteSecretary] = useState('');
  const [formMinuteAttendees, setFormMinuteAttendees] = useState<number>(30);
  const [formMinuteTotal, setFormMinuteTotal] = useState<number>(35);
  const [formMinuteAbsent, setFormMinuteAbsent] = useState<number>(5);
  const [formMinuteAbsentReasons, setFormMinuteAbsentReasons] = useState('Có đơn xin phép');
  const [formMinuteContents, setFormMinuteContents] = useState('');
  const [formMinuteResolutions, setFormMinuteResolutions] = useState('');
  const [formMinuteVotes, setFormMinuteVotes] = useState<number>(100);

  // Form State - Youth Project
  const [formProjectBranchId, setFormProjectBranchId] = useState(branches[0]?.id || 'kp1');
  const [formProjectTitle, setFormProjectTitle] = useState('');
  const [formProjectCategory, setFormProjectCategory] = useState<BranchYouthProject['category']>('CHUYỂN ĐỔI SỐ');
  const [formProjectDesc, setFormProjectDesc] = useState('');
  const [formProjectLocation, setFormProjectLocation] = useState('Phường Chánh Hiệp');
  const [formProjectBudget, setFormProjectBudget] = useState<number>(10000000);
  const [formProjectProgress, setFormProjectProgress] = useState<number>(50);
  const [formProjectStatus, setFormProjectStatus] = useState<BranchYouthProject['status']>('IN_PROGRESS');
  const [formProjectLeader, setFormProjectLeader] = useState('');
  const [formProjectVolunteers, setFormProjectVolunteers] = useState<number>(20);
  const [formProjectStartDate, setFormProjectStartDate] = useState('01/06/2026');
  const [formProjectEndDate, setFormProjectEndDate] = useState('30/11/2026');

  // Sync listener
  useEffect(() => {
    const handleUpdate = () => {
      setBranches(loadStoredBranches());
      setMeetingMinutes(loadStoredMeetingMinutes());
      setYouthProjects(loadStoredYouthProjects());
      setYouthMembers(loadStoredYouthMembers());
    };
    window.addEventListener('youth_union_data_updated', handleUpdate);
    return () => window.removeEventListener('youth_union_data_updated', handleUpdate);
  }, []);

  // Stats calculation
  const totalMembers = branches.reduce((sum, b) => sum + (b.membersCount || 0), 0);
  const residentialCount = branches.filter(b => b.type === 'DÂN CƯ').length;
  const schoolCount = branches.filter(b => b.type === 'TRƯỜNG HỌC').length;
  const militaryCount = branches.filter(b => b.type === 'LỰC LƯỢNG VŨ TRANG').length;
  const enterpriseCount = branches.filter(b => b.type === 'DOANH NGHIỆP').length;
  const totalPartyMembers = branches.reduce((sum, b) => sum + (b.partyMembersInBranch || 0), 0);
  const completedProjectsCount = youthProjects.filter(p => p.status === 'COMPLETED').length;
  const totalProjectsBudget = youthProjects.reduce((sum, p) => sum + (p.budgetVND || 0), 0);

  // Filtered branches
  const filteredBranches = useMemo(() => {
    return branches.filter(b => {
      const matchSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.secretary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (b.deputySecretary && b.deputySecretary.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchType = selectedType === 'ALL' || b.type === selectedType;
      return matchSearch && matchType;
    });
  }, [branches, searchTerm, selectedType]);

  // Handlers - Branch Add/Edit
  const handleOpenAddBranch = () => {
    setEditingBranch(null);
    setFormName('');
    setFormType('DÂN CƯ');
    setFormSecretary('');
    setFormPhone('');
    setFormDeputySecretary('');
    setFormExecutiveMembers('');
    setFormTerm('2025 - 2027');
    setFormPartyMembers(2);
    setFormYouthGatheringRate(75);
    setFormMeetingDay('Ngày 15 hàng tháng');
    setFormRating('XUẤT SẮC');
    setFormAddress('Văn phòng BĐH Khu phố, P. Chánh Hiệp');
    setFormMembersCount(30);
    setIsBranchModalOpen(true);
  };

  const handleOpenEditBranch = (branch: BranchInfo) => {
    setEditingBranch(branch);
    setFormName(branch.name);
    setFormType(branch.type);
    setFormSecretary(branch.secretary);
    setFormPhone(branch.phone);
    setFormDeputySecretary(branch.deputySecretary || '');
    setFormExecutiveMembers(branch.executiveMembers ? branch.executiveMembers.join(', ') : '');
    setFormTerm(branch.term || '2025 - 2027');
    setFormPartyMembers(branch.partyMembersInBranch || 0);
    setFormYouthGatheringRate(branch.youthGatheringRate || 70);
    setFormMeetingDay(branch.meetingDay || 'Ngày 15 hàng tháng');
    setFormRating(branch.threeInitiativesRating || 'ĐẠT CHUẨN');
    setFormAddress(branch.address || '');
    setFormMembersCount(branch.membersCount || 30);
    setIsBranchModalOpen(true);
  };

  const handleSaveBranch = () => {
    if (!formName.trim()) {
      alert('Vui lòng nhập tên Chi đoàn!');
      return;
    }

    const execArray = formExecutiveMembers
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingBranch) {
      const updated = branches.map(b => {
        if (b.id === editingBranch.id) {
          return {
            ...b,
            name: formName.trim(),
            type: formType,
            secretary: formSecretary.trim(),
            phone: formPhone.trim(),
            deputySecretary: formDeputySecretary.trim(),
            executiveMembers: execArray,
            term: formTerm.trim(),
            partyMembersInBranch: formPartyMembers,
            youthGatheringRate: formYouthGatheringRate,
            meetingDay: formMeetingDay.trim(),
            threeInitiativesRating: formRating,
            address: formAddress.trim(),
            membersCount: Math.max(1, formMembersCount)
          };
        }
        return b;
      });
      setBranches(updated);
      saveStoredBranches(updated);
      onNotify(`Đã cập nhật hồ sơ Chi đoàn: ${formName}`);
    } else {
      const newId = 'branch_' + Date.now();
      const newBranch: BranchInfo = {
        id: newId,
        name: formName.trim(),
        type: formType,
        secretary: formSecretary.trim() || 'Chưa phân công',
        phone: formPhone.trim() || 'Đang cập nhật',
        deputySecretary: formDeputySecretary.trim() || 'Chưa phân công',
        executiveMembers: execArray.length ? execArray : ['Ủy viên 1', 'Ủy viên 2'],
        term: formTerm.trim() || '2025 - 2027',
        partyMembersInBranch: formPartyMembers,
        youthGatheringRate: formYouthGatheringRate,
        meetingDay: formMeetingDay.trim() || 'Ngày 15 hàng tháng',
        threeInitiativesRating: formRating || 'ĐẠT CHUẨN',
        address: formAddress.trim() || 'Phường Chánh Hiệp',
        establishedDate: new Date().toLocaleDateString('vi-VN'),
        membersCount: Math.max(1, formMembersCount),
        selfScore: 0,
        officialScore: 0,
        submittedCount: 0,
        approvedCount: 0,
        status: 'ACTIVE'
      };
      const updated = [...branches, newBranch];
      setBranches(updated);
      saveStoredBranches(updated);
      onNotify(`Đã tạo mới hồ sơ Chi đoàn: ${formName}`);
    }

    setIsBranchModalOpen(false);
  };

  const handleToggleStatus = (branchId: string) => {
    const updated = branches.map(b => {
      if (b.id === branchId) {
        const nextStatus = b.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED';
        return { ...b, status: nextStatus as any };
      }
      return b;
    });
    setBranches(updated);
    saveStoredBranches(updated);
    onNotify('Đã cập nhật trạng thái hoạt động Workspace của Chi đoàn!');
  };

  const handleDeleteBranch = (branchId: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa Chi đoàn "${name}"? Dữ liệu tự chấm và sổ sách liên quan sẽ được cập nhật.`)) {
      const updated = branches.filter(b => b.id !== branchId);
      setBranches(updated);
      saveStoredBranches(updated);
      onNotify(`Đã xóa Chi đoàn: ${name}`);
    }
  };

  // Handlers - Meeting Minutes
  const handleOpenAddMinute = (defaultBranchId?: string) => {
    setEditingMinute(null);
    const targetBranchId = defaultBranchId || branches[0]?.id || 'kp1';
    const targetBranch = branches.find(b => b.id === targetBranchId);
    setFormMinuteBranchId(targetBranchId);
    setFormMinuteMonth('Tháng 09/2026');
    setFormMinuteDate(new Date().toLocaleDateString('vi-VN'));
    setFormMinuteTopic('Sinh hoạt Chi đoàn thường kỳ tháng ' + new Date().getMonth() + 1);
    setFormMinuteHost(targetBranch?.secretary || 'Bí thư Chi đoàn');
    setFormMinuteSecretary(targetBranch?.deputySecretary || 'Ủy viên BCH');
    setFormMinuteTotal(targetBranch?.membersCount || 30);
    setFormMinuteAttendees((targetBranch?.membersCount || 30) - 2);
    setFormMinuteAbsent(2);
    setFormMinuteAbsentReasons('Có lý do chính đáng');
    setFormMinuteContents('1. Quán triệt các chủ trương, nghị quyết của Đoàn cấp trên.\n2. Rà soát tiến độ các chỉ tiêu thi đua công tác thanh niên.\n3. Triển khai kế hoạch Ngày Thứ Bảy Tình Nguyện.');
    setFormMinuteResolutions('100% đoàn viên tham dự nhất trí với các nội dung trọng tâm tháng tới.');
    setFormMinuteVotes(100);
    setIsMinuteModalOpen(true);
  };

  const handleOpenEditMinute = (min: BranchMeetingMinute) => {
    setEditingMinute(min);
    setFormMinuteBranchId(min.branchId);
    setFormMinuteMonth(min.month);
    setFormMinuteDate(min.meetingDate);
    setFormMinuteTopic(min.topic);
    setFormMinuteHost(min.hostName);
    setFormMinuteSecretary(min.secretaryName);
    setFormMinuteTotal(min.totalMembers);
    setFormMinuteAttendees(min.attendeesCount);
    setFormMinuteAbsent(min.absentCount);
    setFormMinuteAbsentReasons(min.absentReasons || '');
    setFormMinuteContents(min.contentsSummary);
    setFormMinuteResolutions(min.resolutions);
    setFormMinuteVotes(min.votesPercent);
    setIsMinuteModalOpen(true);
  };

  const handleSaveMinute = () => {
    if (!formMinuteTopic.trim()) {
      alert('Vui lòng nhập chủ đề cuộc họp sinh hoạt Chi đoàn!');
      return;
    }

    const branch = branches.find(b => b.id === formMinuteBranchId);
    const branchName = branch ? branch.name : 'Chi đoàn';

    if (editingMinute) {
      const updated = meetingMinutes.map(m => {
        if (m.id === editingMinute.id) {
          return {
            ...m,
            branchId: formMinuteBranchId,
            branchName,
            month: formMinuteMonth,
            meetingDate: formMinuteDate,
            topic: formMinuteTopic.trim(),
            hostName: formMinuteHost.trim(),
            secretaryName: formMinuteSecretary.trim(),
            attendeesCount: formMinuteAttendees,
            totalMembers: formMinuteTotal,
            absentCount: formMinuteAbsent,
            absentReasons: formMinuteAbsentReasons.trim(),
            contentsSummary: formMinuteContents.trim(),
            resolutions: formMinuteResolutions.trim(),
            votesPercent: formMinuteVotes,
            status: 'COMPLETED' as const
          };
        }
        return m;
      });
      setMeetingMinutes(updated);
      saveStoredMeetingMinutes(updated);
      onNotify('Đã cập nhật biên bản sinh hoạt Chi đoàn!');
    } else {
      const newMinute: BranchMeetingMinute = {
        id: 'mm_' + Date.now(),
        branchId: formMinuteBranchId,
        branchName,
        month: formMinuteMonth,
        meetingDate: formMinuteDate,
        topic: formMinuteTopic.trim(),
        hostName: formMinuteHost.trim(),
        secretaryName: formMinuteSecretary.trim(),
        attendeesCount: formMinuteAttendees,
        totalMembers: formMinuteTotal,
        absentCount: formMinuteAbsent,
        absentReasons: formMinuteAbsentReasons.trim(),
        contentsSummary: formMinuteContents.trim(),
        resolutions: formMinuteResolutions.trim(),
        votesPercent: formMinuteVotes,
        status: 'COMPLETED',
        createdAt: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      const updated = [newMinute, ...meetingMinutes];
      setMeetingMinutes(updated);
      saveStoredMeetingMinutes(updated);
      onNotify(`Đã lưu biên bản sinh hoạt: ${branchName} (${formMinuteMonth})`);
    }

    setIsMinuteModalOpen(false);
  };

  const handleDeleteMinute = (id: string, topic: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa biên bản "${topic}"?`)) {
      const updated = meetingMinutes.filter(m => m.id !== id);
      setMeetingMinutes(updated);
      saveStoredMeetingMinutes(updated);
      onNotify('Đã xóa biên bản sinh hoạt!');
    }
  };

  // Handlers - Youth Project
  const handleOpenAddProject = (defaultBranchId?: string) => {
    setEditingProject(null);
    const targetBranchId = defaultBranchId || branches[0]?.id || 'kp1';
    const targetBranch = branches.find(b => b.id === targetBranchId);
    setFormProjectBranchId(targetBranchId);
    setFormProjectTitle('');
    setFormProjectCategory('CHUYỂN ĐỔI SỐ');
    setFormProjectDesc('');
    setFormProjectLocation(targetBranch?.address || 'Phường Chánh Hiệp');
    setFormProjectBudget(10000000);
    setFormProjectProgress(0);
    setFormProjectStatus('PLANNING');
    setFormProjectLeader(targetBranch?.secretary || 'Bí thư Chi đoàn');
    setFormProjectVolunteers(20);
    setFormProjectStartDate('01/06/2026');
    setFormProjectEndDate('30/11/2026');
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj: BranchYouthProject) => {
    setEditingProject(proj);
    setFormProjectBranchId(proj.branchId);
    setFormProjectTitle(proj.title);
    setFormProjectCategory(proj.category);
    setFormProjectDesc(proj.description);
    setFormProjectLocation(proj.location);
    setFormProjectBudget(proj.budgetVND);
    setFormProjectProgress(proj.completionPercent);
    setFormProjectStatus(proj.status);
    setFormProjectLeader(proj.leaderName);
    setFormProjectVolunteers(proj.volunteerCount);
    setFormProjectStartDate(proj.startDate);
    setFormProjectEndDate(proj.endDate);
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = () => {
    if (!formProjectTitle.trim()) {
      alert('Vui lòng nhập tên Công trình / Phần việc thanh niên!');
      return;
    }

    const branch = branches.find(b => b.id === formProjectBranchId);
    const branchName = branch ? branch.name : 'Chi đoàn';

    if (editingProject) {
      const updated = youthProjects.map(p => {
        if (p.id === editingProject.id) {
          return {
            ...p,
            branchId: formProjectBranchId,
            branchName,
            title: formProjectTitle.trim(),
            category: formProjectCategory,
            description: formProjectDesc.trim(),
            location: formProjectLocation.trim(),
            budgetVND: formProjectBudget,
            completionPercent: formProjectProgress,
            status: formProjectProgress >= 100 ? 'COMPLETED' : formProjectStatus,
            leaderName: formProjectLeader.trim(),
            volunteerCount: formProjectVolunteers,
            startDate: formProjectStartDate,
            endDate: formProjectEndDate
          };
        }
        return p;
      });
      setYouthProjects(updated);
      saveStoredYouthProjects(updated);
      onNotify('Đã cập nhật công trình thanh niên!');
    } else {
      const newProj: BranchYouthProject = {
        id: 'yp_' + Date.now(),
        branchId: formProjectBranchId,
        branchName,
        title: formProjectTitle.trim(),
        category: formProjectCategory,
        description: formProjectDesc.trim(),
        location: formProjectLocation.trim(),
        budgetVND: formProjectBudget,
        completionPercent: formProjectProgress,
        status: formProjectProgress >= 100 ? 'COMPLETED' : formProjectStatus,
        leaderName: formProjectLeader.trim() || 'Bí thư Chi đoàn',
        volunteerCount: formProjectVolunteers,
        startDate: formProjectStartDate,
        endDate: formProjectEndDate
      };
      const updated = [newProj, ...youthProjects];
      setYouthProjects(updated);
      saveStoredYouthProjects(updated);
      onNotify(`Đã đăng ký công trình mới: ${formProjectTitle}`);
    }

    setIsProjectModalOpen(false);
  };

  const handleDeleteProject = (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa công trình "${title}"?`)) {
      const updated = youthProjects.filter(p => p.id !== id);
      setYouthProjects(updated);
      saveStoredYouthProjects(updated);
      onNotify('Đã xóa công trình thanh niên!');
    }
  };

  // Branch Dossier Detail Members
  const branchDossierMembers = useMemo(() => {
    if (!dossierBranch) return [];
    return youthMembers.filter(m => m.branchId === dossierBranch.id);
  }, [dossierBranch, youthMembers]);

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-md uppercase tracking-wider">
                QUẢN TRỊ TỔ CHỨC CƠ SỞ ĐOÀN
              </span>
              <span className="text-xs text-slate-400 font-bold">•</span>
              <span className="text-xs text-slate-500 font-bold">Đoàn Phường Chánh Hiệp (Nhiệm kỳ 2025 - 2027)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Quản Lý Chi Đoàn & Hệ Thống Tổ Chức Trực Thuộc
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Quản lý toàn diện 16 Chi đoàn trực thuộc, hồ sơ Ban Chấp hành, sổ biên bản sinh hoạt lệ định kỳ, công trình thanh niên và đánh giá "Chi đoàn mạnh 3 chủ động" chuẩn Điều lệ Đoàn TNCS Hồ Chí Minh.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleOpenAddMinute()}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>+ Ghi Biên Bản Họp</span>
            </button>
            <button
              onClick={handleOpenAddBranch}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Chi Đoàn Mới</span>
            </button>
          </div>
        </div>

        {/* 5 Stats Block Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-6">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <Building2 className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">TỔNG ĐƠN VỊ</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{branches.length} Chi đoàn</p>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{totalMembers} Đoàn viên đăng ký</p>
          </div>

          <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-100">
            <div className="flex items-center justify-between text-blue-600 mb-1">
              <Building2 className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">ĐỊA BÀN DÂN CƯ</span>
            </div>
            <p className="text-2xl font-black text-blue-900">{residentialCount} Chi đoàn</p>
            <p className="text-[11px] text-blue-600 mt-0.5 font-medium">10 Khu phố trọng điểm</p>
          </div>

          <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-100">
            <div className="flex items-center justify-between text-emerald-600 mb-1">
              <School className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">TRƯỜNG HỌC & DN</span>
            </div>
            <p className="text-2xl font-black text-emerald-900">{schoolCount + enterpriseCount} Đơn vị</p>
            <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">{schoolCount} Trường • {enterpriseCount} Doanh nghiệp</p>
          </div>

          <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-100">
            <div className="flex items-center justify-between text-amber-600 mb-1">
              <Shield className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">LỰC LƯỢNG VŨ TRANG</span>
            </div>
            <p className="text-2xl font-black text-amber-900">{militaryCount} Chi đoàn</p>
            <p className="text-[11px] text-amber-600 mt-0.5 font-medium">Quân sự & Công an</p>
          </div>

          <div className="bg-purple-50/70 rounded-2xl p-4 border border-purple-100">
            <div className="flex items-center justify-between text-purple-600 mb-1">
              <Flag className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">ĐẢNG VIÊN SINH HOẠT</span>
            </div>
            <p className="text-2xl font-black text-purple-900">{totalPartyMembers} Đồng chí</p>
            <p className="text-[11px] text-purple-600 mt-0.5 font-medium">Nòng cốt chính trị Chi đoàn</p>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center justify-between border-t border-slate-100 mt-6 pt-4 flex-wrap gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {[
              { id: 'directory', label: '1. Danh Sách & Cơ Cấu BCH', icon: Building2, count: branches.length },
              { id: 'meeting_minutes', label: '2. Sổ Biên Bản Sinh Hoạt Lệ', icon: FileText, count: meetingMinutes.length },
              { id: 'youth_projects', label: '3. Công Trình Thanh Niên', icon: Flag, count: youthProjects.length },
              { id: 'three_initiatives', label: '4. Đánh Giá "Chi Đoàn Mạnh 3 Chủ Động"', icon: Award, count: branches.filter(b => b.threeInitiativesRating === 'XUẤT SẮC').length }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SubTab)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                    isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===================== TAB 1: DIRECTORY & LEADERSHIP ===================== */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Block types */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'ALL', label: 'Tất cả khối' },
                { id: 'DÂN CƯ', label: 'Địa bàn Dân cư (10 KP)' },
                { id: 'TRƯỜNG HỌC', label: 'Trường học' },
                { id: 'LỰC LƯỢNG VŨ TRANG', label: 'Lực lượng vũ trang' },
                { id: 'DOANH NGHIỆP', label: 'Doanh nghiệp' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedType(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedType === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* View Mode & Search */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Dạng Thẻ
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Dạng Bảng
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo tên Chi đoàn, Bí thư..."
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          {/* GRID VIEW */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBranches.map(branch => {
                const isLocked = branch.status === 'LOCKED';
                const branchMinutes = meetingMinutes.filter(m => m.branchId === branch.id);
                const branchProjects = youthProjects.filter(p => p.branchId === branch.id);

                return (
                  <div
                    key={branch.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                          branch.type === 'DÂN CƯ' ? 'bg-blue-50 text-blue-700 border border-blue-200/60' :
                          branch.type === 'TRƯỜNG HỌC' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                          branch.type === 'LỰC LƯỢNG VŨ TRANG' ? 'bg-amber-50 text-amber-700 border border-amber-200/60' :
                          'bg-purple-50 text-purple-700 border border-purple-200/60'
                        }`}>
                          {branch.type}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {branch.threeInitiativesRating === 'XUẤT SẮC' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200" title="Chi đoàn mạnh 3 chủ động Xuất sắc">
                              <Award className="w-3 h-3 text-emerald-600" />
                              3 Chủ động: Xuất sắc
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200">
                              3 Chủ động: Đạt chuẩn
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-black text-slate-900 leading-snug">
                        {branch.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{branch.address || 'Phường Chánh Hiệp, TP. Thủ Dầu Một'}</span>
                      </p>

                      {/* Key Leadership Roster */}
                      <div className="mt-4 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-bold">Bí thư Chi đoàn:</span>
                          <span className="font-black text-slate-900">{branch.secretary}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-bold">Phó Bí thư:</span>
                          <span className="font-semibold text-slate-800">{branch.deputySecretary || 'Chưa phân công'}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200/60">
                          <span className="text-slate-400">Lịch sinh hoạt lệ:</span>
                          <span className="font-bold text-blue-600">{branch.meetingDay || 'Ngày 15 hàng tháng'}</span>
                        </div>
                      </div>

                      {/* Metrics mini grid */}
                      <div className="grid grid-cols-3 gap-2 mt-3.5 text-center">
                        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400">Đoàn viên</p>
                          <p className="text-sm font-black text-slate-900 mt-0.5">{branch.membersCount} ĐV</p>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400">Đảng viên</p>
                          <p className="text-sm font-black text-purple-700 mt-0.5">{branch.partyMembersInBranch || 0} Đ/c</p>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400">Tập hợp TN</p>
                          <p className="text-sm font-black text-emerald-600 mt-0.5">{branch.youthGatheringRate || 75}%</p>
                        </div>
                      </div>

                      {/* Activity badges summary */}
                      <div className="mt-3.5 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-medium">
                          <FileText className="w-3.5 h-3.5 text-blue-500" />
                          {branchMinutes.length} biên bản sinh hoạt
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Flag className="w-3.5 h-3.5 text-emerald-500" />
                          {branchProjects.length} công trình TN
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setDossierBranch(branch);
                          setIsDossierModalOpen(true);
                        }}
                        className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Xem Hồ Sơ 360°</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleStatus(branch.id)}
                          title={isLocked ? 'Mở khóa quyền Workspace' : 'Khóa quyền Workspace'}
                          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          {isLocked ? <Lock className="w-4 h-4 text-rose-500" /> : <Unlock className="w-4 h-4 text-emerald-600" />}
                        </button>
                        <button
                          onClick={() => handleOpenEditBranch(branch)}
                          title="Chỉnh sửa thông tin"
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBranch(branch.id, branch.name)}
                          title="Xóa Chi đoàn"
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* TABLE VIEW */
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-4">STT</th>
                      <th className="p-4">Tên Chi Đoàn</th>
                      <th className="p-4">Khối Loại Hình</th>
                      <th className="p-4">Ban Chấp Hành</th>
                      <th className="p-4 text-center">Đoàn Viên</th>
                      <th className="p-4 text-center">Đảng Viên</th>
                      <th className="p-4 text-center">3 Chủ Động</th>
                      <th className="p-4 text-center">Workspace</th>
                      <th className="p-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredBranches.map((branch, idx) => (
                      <tr key={branch.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 text-slate-400 font-bold">{idx + 1}</td>
                        <td className="p-4">
                          <p className="font-black text-slate-900">{branch.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{branch.address || 'P. Chánh Hiệp'}</p>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black ${
                            branch.type === 'DÂN CƯ' ? 'bg-blue-50 text-blue-700 border border-blue-200/60' :
                            branch.type === 'TRƯỜNG HỌC' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                            branch.type === 'LỰC LƯỢNG VŨ TRANG' ? 'bg-amber-50 text-amber-700 border border-amber-200/60' :
                            'bg-purple-50 text-purple-700 border border-purple-200/60'
                          }`}>
                            {branch.type}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-slate-900">BT: {branch.secretary}</p>
                          <p className="text-[11px] text-slate-500">PBT: {branch.deputySecretary || 'Chưa phân công'}</p>
                        </td>
                        <td className="p-4 text-center font-black text-slate-900">{branch.membersCount} ĐV</td>
                        <td className="p-4 text-center font-bold text-purple-700">{branch.partyMembersInBranch || 0} Đ/c</td>
                        <td className="p-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {branch.threeInitiativesRating || 'ĐẠT CHUẨN'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {branch.status === 'LOCKED' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700">Khóa</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">Hoạt động</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setDossierBranch(branch);
                                setIsDossierModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                              title="Xem hồ sơ"
                            >
                              <FolderOpen className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEditBranch(branch)}
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                              title="Chỉnh sửa"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBranch(branch.id, branch.name)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 2: MEETING MINUTES LOG ===================== */}
      {activeTab === 'meeting_minutes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Sổ Biên Bản Sinh Hoạt Chi Đoàn Định Kỳ (Điện Tử)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Theo dõi chế độ sinh hoạt lệ định kỳ hàng tháng của 16 Chi đoàn trực thuộc, tỷ lệ tham gia sinh hoạt và lưu trữ nghị quyết cuộc họp.
              </p>
            </div>
            <button
              onClick={() => handleOpenAddMinute()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ghi Biên Bản Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {meetingMinutes.map(minute => {
              const attendPercent = Math.round((minute.attendeesCount / (minute.totalMembers || 1)) * 100);
              return (
                <div
                  key={minute.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded-md border border-blue-200/60">
                        {minute.month}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{minute.meetingDate}</span>
                    </div>

                    <h4 className="text-base font-black text-slate-900 line-clamp-2">
                      {minute.topic}
                    </h4>
                    <p className="text-xs font-bold text-blue-600 mt-1">
                      {minute.branchName}
                    </p>

                    {/* Attendance stats */}
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Chủ trì cuộc họp:</span>
                        <span className="font-bold text-slate-900">{minute.hostName}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Điểm danh:</span>
                        <span className="font-black text-emerald-600">{minute.attendeesCount}/{minute.totalMembers} ĐV ({attendPercent}%)</span>
                      </div>
                      {minute.absentCount > 0 && (
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Vắng mặt:</span>
                          <span>{minute.absentCount} ĐV ({minute.absentReasons})</span>
                        </div>
                      )}
                    </div>

                    {/* Resolutions excerpt */}
                    <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                      <span className="font-bold text-slate-800">Nghị quyết: </span>
                      {minute.resolutions}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setViewingMinuteDossier(minute)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-blue-600" />
                      <span>Xem & In Biên Bản</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditMinute(minute)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Sửa biên bản"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMinute(minute.id, minute.topic)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Xóa biên bản"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: YOUTH PROJECTS ===================== */}
      {activeTab === 'youth_projects' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Công Trình & Phần Việc Thanh Niên Chi Đoàn Năm 2026
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Theo dõi các công trình thanh niên gắn với văn minh đô thị, bảo vệ môi trường và chuyển đổi số cộng đồng tại cơ sở.
              </p>
            </div>
            <button
              onClick={() => handleOpenAddProject()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Đăng Ký Công Trình Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {youthProjects.map(proj => {
              const isCompleted = proj.status === 'COMPLETED' || proj.completionPercent >= 100;
              return (
                <div
                  key={proj.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200/60">
                        {proj.category}
                      </span>
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Đã hoàn thành
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Đang triển khai ({proj.completionPercent}%)
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-black text-slate-900 leading-snug">
                      {proj.title}
                    </h4>
                    <p className="text-xs font-bold text-blue-600 mt-1">
                      Đơn vị thực hiện: {proj.branchName}
                    </p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="text-slate-500">Tiến độ thực hiện:</span>
                        <span className="text-slate-900 font-black">{proj.completionPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-emerald-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${proj.completionPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Metadata specs */}
                    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400">Kinh phí (VNĐ)</p>
                        <p className="text-xs font-black text-slate-900 mt-0.5">{proj.budgetVND.toLocaleString('vi-VN')} đ</p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400">Đoàn viên</p>
                        <p className="text-xs font-black text-blue-700 mt-0.5">{proj.volunteerCount} ĐV</p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400">Người phụ trách</p>
                        <p className="text-xs font-black text-slate-800 mt-0.5 truncate">{proj.leaderName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Thời hạn: {proj.startDate} - {proj.endDate}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditProject(proj)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Cập nhật tiến độ"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id, proj.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Xóa công trình"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== TAB 4: 3-INITIATIVES EMULATION ===================== */}
      {activeTab === 'three_initiatives' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Bộ Tiêu Chí Đánh Giá "Chi Đoàn Mạnh 3 Chủ Động" Năm 2026
                </h3>
                <p className="text-xs text-slate-500">
                  Căn cứ Hướng dẫn của Ban Bí thư Trung ương Đoàn và Thành đoàn Thủ Dầu Một.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-5 bg-blue-50/70 rounded-2xl border border-blue-200/80">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm mb-3">
                  1
                </div>
                <h4 className="text-sm font-black text-slate-900 mb-1">
                  Chủ động Quản lý Đoàn viên & Tập hợp Thanh niên
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Nắm chắc danh sách đoàn viên trên App Thanh niên Việt Nam, quản lý sổ đoàn viên điện tử, thu nộp đoàn phí đầy đủ và tập hợp tối thiểu 70% thanh niên trên địa bàn.
                </p>
              </div>

              <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200/80">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm mb-3">
                  2
                </div>
                <h4 className="text-sm font-black text-slate-900 mb-1">
                  Chủ động Xây dựng & Thực hiện Kế hoạch
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Duy trì sinh hoạt chi đoàn lệ định kỳ hàng tháng có biên bản, đảm nhận ít nhất 01 công trình thanh niên trong năm và đổi mới hình thức sinh hoạt chuyên đề số.
                </p>
              </div>

              <div className="p-5 bg-purple-50/70 rounded-2xl border border-purple-200/80">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-sm mb-3">
                  3
                </div>
                <h4 className="text-sm font-black text-slate-900 mb-1">
                  Chủ động Tham mưu Cấp ủy & Phối hợp
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Chủ động báo cáo và xin ý kiến Chi bộ khu phố/trường học, bồi dưỡng đoàn viên ưu tú giới thiệu học Đảng, phối hợp chặt chẽ với các đoàn thể tại cơ sở.
                </p>
              </div>
            </div>
          </div>

          {/* Ranking Table of 3-Initiatives */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Bảng Tổng Hợp Đánh Giá & Xếp Hạng Chi Đoàn Mạnh 3 Chủ Động
              </h4>
              <span className="text-xs text-slate-400 font-bold">16 / 16 Đơn vị đã được thẩm định</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-4">STT</th>
                    <th className="p-4">Tên Chi Đoàn</th>
                    <th className="p-4 text-center">Tiêu chí 1 (Quản lý ĐV)</th>
                    <th className="p-4 text-center">Tiêu chí 2 (Kế hoạch/Họp)</th>
                    <th className="p-4 text-center">Tiêu chí 3 (Tham mưu Đảng)</th>
                    <th className="p-4 text-center">Kết quả xếp loại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {branches.map((b, i) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-slate-400 font-bold">{i + 1}</td>
                      <td className="p-4 font-black text-slate-900">{b.name}</td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                          <Check className="w-4 h-4" /> Đạt ({b.youthGatheringRate || 75}%)
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                          <Check className="w-4 h-4" /> Đạt (12/12 kỳ)
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                          <Check className="w-4 h-4" /> Đạt ({b.partyMembersInBranch || 2} Đ/c)
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${
                          b.threeInitiativesRating === 'XUẤT SẮC' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {b.threeInitiativesRating || 'ĐẠT CHUẨN'}
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

      {/* ===================== MODAL: DOSSIER 360° ===================== */}
      {isDossierModalOpen && dossierBranch && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl font-black text-base">
                  {dossierBranch.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{dossierBranch.name}</h3>
                  <p className="text-xs text-slate-400">Hồ sơ trích ngang & Thẻ định danh số cơ sở Đoàn</p>
                </div>
              </div>
              <button
                onClick={() => setIsDossierModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-6">
              {/* Card info summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Khối loại hình</p>
                  <p className="text-xs font-black text-blue-700 mt-1">{dossierBranch.type}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Nhiệm kỳ</p>
                  <p className="text-xs font-black text-slate-900 mt-1">{dossierBranch.term || '2025 - 2027'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Tổng số ĐV</p>
                  <p className="text-xs font-black text-emerald-700 mt-1">{dossierBranch.membersCount} Đoàn viên</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Điểm thi đua</p>
                  <p className="text-xs font-black text-purple-700 mt-1">{dossierBranch.officialScore} / 100 đ</p>
                </div>
              </div>

              {/* Leadership structure */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Ban Chấp Hành Chi Đoàn Nhiệm Kỳ {dossierBranch.term || '2025 - 2027'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div>
                    <span className="text-slate-400 font-medium">Bí thư Chi đoàn: </span>
                    <span className="font-bold text-slate-900">{dossierBranch.secretary}</span>
                    <span className="text-slate-400 text-[11px] block mt-0.5">SĐT: {dossierBranch.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Phó Bí thư: </span>
                    <span className="font-bold text-slate-900">{dossierBranch.deputySecretary || 'Đang cập nhật'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 font-medium">Ủy viên BCH: </span>
                    <span className="font-semibold text-slate-800">
                      {dossierBranch.executiveMembers && dossierBranch.executiveMembers.length > 0 
                        ? dossierBranch.executiveMembers.join(', ')
                        : 'Đang cập nhật'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Số Đảng viên sinh hoạt: </span>
                    <span className="font-bold text-purple-700">{dossierBranch.partyMembersInBranch || 0} đồng chí</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Lịch sinh hoạt định kỳ: </span>
                    <span className="font-bold text-blue-600">{dossierBranch.meetingDay || 'Ngày 15 hàng tháng'}</span>
                  </div>
                </div>
              </div>

              {/* Members roster preview */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    Danh Sách Trích Ngang Đoàn Viên Trực Thuộc ({branchDossierMembers.length})
                  </h4>
                  <button
                    onClick={() => window.print()}
                    className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    In danh sách
                  </button>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-56 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="p-3">Họ và tên</th>
                        <th className="p-3">Chức vụ</th>
                        <th className="p-3">Số điện thoại</th>
                        <th className="p-3 text-center">Xếp loại</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {branchDossierMembers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-slate-400">
                            Chưa có dữ liệu đoàn viên chi tiết trong hệ thống Sổ Đoàn Điện Tử.
                          </td>
                        </tr>
                      ) : (
                        branchDossierMembers.map(m => (
                          <tr key={m.id} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900">{m.fullName}</td>
                            <td className="p-3 text-slate-600">{m.position}</td>
                            <td className="p-3 text-slate-500">{m.phone}</td>
                            <td className="p-3 text-center font-bold text-emerald-600">{m.emulationRanking}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsDossierModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Đóng Hồ Sơ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: ADD / EDIT BRANCH ===================== */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingBranch ? 'Cập Nhật Hồ Sơ Chi Đoàn' : 'Thêm Chi Đoàn Trực Thuộc Mới'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Quản lý cơ cấu tổ chức Đoàn Phường Chánh Hiệp</p>
                </div>
              </div>
              <button
                onClick={() => setIsBranchModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tên Chi đoàn <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="VD: Chi đoàn Khu phố 11 (Chi đoàn Dân cư)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Khối loại hình
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="DÂN CƯ">DÂN CƯ</option>
                    <option value="TRƯỜNG HỌC">TRƯỜNG HỌC</option>
                    <option value="LỰC LƯỢNG VŨ TRANG">LỰC LƯỢNG VŨ TRANG</option>
                    <option value="DOANH NGHIỆP">DOANH NGHIỆP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nhiệm kỳ công tác
                  </label>
                  <input
                    type="text"
                    value={formTerm}
                    onChange={(e) => setFormTerm(e.target.value)}
                    placeholder="VD: 2025 - 2027"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Bí thư Chi đoàn <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formSecretary}
                    onChange={(e) => setFormSecretary(e.target.value)}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Số điện thoại liên hệ
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="VD: 0912.345.678"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phó Bí thư Chi đoàn
                  </label>
                  <input
                    type="text"
                    value={formDeputySecretary}
                    onChange={(e) => setFormDeputySecretary(e.target.value)}
                    placeholder="VD: Trần Thị B"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Ủy viên BCH (Cách nhau bởi dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={formExecutiveMembers}
                    onChange={(e) => setFormExecutiveMembers(e.target.value)}
                    placeholder="VD: Lê Văn C, Phạm Thị D"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Số lượng ĐV
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formMembersCount}
                    onChange={(e) => setFormMembersCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Số Đảng viên sinh hoạt
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formPartyMembers}
                    onChange={(e) => setFormPartyMembers(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Tỷ lệ tập hợp TN (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formYouthGatheringRate}
                    onChange={(e) => setFormYouthGatheringRate(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Lịch sinh hoạt định kỳ
                  </label>
                  <input
                    type="text"
                    value={formMeetingDay}
                    onChange={(e) => setFormMeetingDay(e.target.value)}
                    placeholder="VD: Ngày 15 hàng tháng"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Xếp loại 3 chủ động
                  </label>
                  <select
                    value={formRating}
                    onChange={(e) => setFormRating(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="XUẤT SẮC">XUẤT SẮC</option>
                    <option value="ĐẠT CHUẨN">ĐẠT CHUẨN</option>
                    <option value="CẦN CỐ GẮNG">CẦN CỐ GẮNG</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Địa điểm nơi sinh hoạt / Văn phòng
                </label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="VD: Văn phòng BĐH Khu phố 1, P. Chánh Hiệp"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBranchModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveBranch}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingBranch ? 'Cập Nhật Hồ Sơ' : 'Tạo Chi Đoàn Mới'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: ADD / EDIT MEETING MINUTE ===================== */}
      {isMinuteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingMinute ? 'Chỉnh Sửa Biên Bản Sinh Hoạt' : 'Ghi Biên Bản Sinh Hoạt Chi Đoàn'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Sổ điện tử sinh hoạt lệ định kỳ</p>
                </div>
              </div>
              <button
                onClick={() => setIsMinuteModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Chi đoàn sinh hoạt <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formMinuteBranchId}
                    onChange={(e) => setFormMinuteBranchId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kỳ sinh hoạt (Tháng/Năm)
                  </label>
                  <input
                    type="text"
                    value={formMinuteMonth}
                    onChange={(e) => setFormMinuteMonth(e.target.value)}
                    placeholder="VD: Tháng 09/2026"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Chủ đề / Nội dung sinh hoạt chính <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formMinuteTopic}
                  onChange={(e) => setFormMinuteTopic(e.target.value)}
                  placeholder="VD: Sinh hoạt Chi đoàn chủ điểm chào mừng ngày thành lập Đoàn..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Chủ trì cuộc họp (Bí thư/PBT)
                  </label>
                  <input
                    type="text"
                    value={formMinuteHost}
                    onChange={(e) => setFormMinuteHost(e.target.value)}
                    placeholder="Họ tên người chủ trì"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Thư ký ghi biên bản
                  </label>
                  <input
                    type="text"
                    value={formMinuteSecretary}
                    onChange={(e) => setFormMinuteSecretary(e.target.value)}
                    placeholder="Họ tên thư ký"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Tổng số ĐV
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formMinuteTotal}
                    onChange={(e) => setFormMinuteTotal(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Số ĐV có mặt
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formMinuteAttendees}
                    onChange={(e) => setFormMinuteAttendees(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Số ĐV vắng mặt
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formMinuteAbsent}
                    onChange={(e) => setFormMinuteAbsent(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tóm tắt các nội dung đã thảo luận
                </label>
                <textarea
                  rows={3}
                  value={formMinuteContents}
                  onChange={(e) => setFormMinuteContents(e.target.value)}
                  placeholder="Ghi nhận các ý kiến thảo luận, báo cáo phong trào..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nghị quyết / Kết luận cuộc họp
                </label>
                <textarea
                  rows={2}
                  value={formMinuteResolutions}
                  onChange={(e) => setFormMinuteResolutions(e.target.value)}
                  placeholder="Các công việc đã thống nhất thực hiện..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsMinuteModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveMinute}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Biên Bản</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: VIEW & PRINT MINUTE DOSSIER ===================== */}
      {viewingMinuteDossier && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-scale-up">
            {/* Formal Header */}
            <div className="text-center pb-6 border-b border-slate-200">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                ĐOÀN TNCS HỒ CHÍ MINH TP. THỦ DẦU MỘT
              </p>
              <p className="text-xs font-black uppercase tracking-wider text-blue-900 mt-0.5">
                ĐOÀN PHƯỜNG CHÁNH HIỆP - {viewingMinuteDossier.branchName.toUpperCase()}
              </p>
              <div className="w-20 h-0.5 bg-slate-300 mx-auto my-2" />
              <h3 className="text-lg font-black text-slate-900 mt-2 uppercase">
                TRÍCH LỤC BIÊN BẢN SINH HOẠT CHI ĐOÀN ĐỊNH KỲ
              </h3>
              <p className="text-xs text-slate-500 italic mt-0.5">
                Kỳ sinh hoạt: {viewingMinuteDossier.month} • Ngày tổ chức: {viewingMinuteDossier.meetingDate}
              </p>
            </div>

            <div className="py-6 space-y-4 text-xs text-slate-800 leading-relaxed">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <p><span className="font-bold">Chủ đề cuộc họp: </span>{viewingMinuteDossier.topic}</p>
                <p><span className="font-bold">Chủ trì: </span>Đồng chí {viewingMinuteDossier.hostName}</p>
                <p><span className="font-bold">Thư ký: </span>Đồng chí {viewingMinuteDossier.secretaryName}</p>
                <p><span className="font-bold">Quân số: </span>Có mặt {viewingMinuteDossier.attendeesCount} / {viewingMinuteDossier.totalMembers} ĐV (Vắng: {viewingMinuteDossier.absentCount} ĐV - {viewingMinuteDossier.absentReasons || 'Không'})</p>
              </div>

              <div>
                <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
                  I. NỘI DUNG SINH HOẠT & THẢO LUẬN
                </h4>
                <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 whitespace-pre-line text-slate-700">
                  {viewingMinuteDossier.contentsSummary}
                </div>
              </div>

              <div>
                <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
                  II. NGHỊ QUYẾT & KẾT LUẬN CUỘC HỌP
                </h4>
                <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-blue-900 font-medium">
                  {viewingMinuteDossier.resolutions}
                  <p className="mt-2 text-[11px] font-bold text-blue-700">
                    Tỷ lệ biểu quyết thông qua: {viewingMinuteDossier.votesPercent}% đoàn viên nhất trí.
                  </p>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 text-center pt-8 text-xs">
                <div>
                  <p className="font-bold uppercase text-slate-500">THƯ KÝ CUỘC HỌP</p>
                  <p className="italic text-slate-400 text-[10px]">(Ký và ghi rõ họ tên)</p>
                  <p className="font-black text-slate-900 mt-14">{viewingMinuteDossier.secretaryName}</p>
                </div>
                <div>
                  <p className="font-bold uppercase text-slate-500">CHỦ TRÌ CUỘC HỌP</p>
                  <p className="italic text-slate-400 text-[10px]">(Ký và ghi rõ họ tên)</p>
                  <p className="font-black text-slate-900 mt-14">{viewingMinuteDossier.hostName}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-blue-600" />
                <span>In Bản Trích Lục</span>
              </button>
              <button
                onClick={() => setViewingMinuteDossier(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: ADD / EDIT YOUTH PROJECT ===================== */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Flag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingProject ? 'Cập Nhật Công Trình Thanh Niên' : 'Đăng Ký Công Trình Thanh Niên Mới'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Hồ sơ công trình thanh niên gắn với văn minh đô thị & chuyển đổi số</p>
                </div>
              </div>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Đơn vị Chi đoàn thực hiện <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formProjectBranchId}
                    onChange={(e) => setFormProjectBranchId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Lĩnh vực công trình
                  </label>
                  <select
                    value={formProjectCategory}
                    onChange={(e) => setFormProjectCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="CHUYỂN ĐỔI SỐ">CHUYỂN ĐỔI SỐ</option>
                    <option value="BẢO VỆ MÔI TRƯỜNG">BẢO VỆ MÔI TRƯỜNG</option>
                    <option value="AN SINH XÃ HỘI">AN SINH XÃ HỘI</option>
                    <option value="VĂN HÓA VĂN NGHỆ">VĂN HÓA VĂN NGHỆ</option>
                    <option value="KHỞI NGHIỆP">KHỞI NGHIỆP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tên công trình / Phần việc thanh niên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formProjectTitle}
                  onChange={(e) => setFormProjectTitle(e.target.value)}
                  placeholder="VD: Tuyến hẻm văn minh không rác thải..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mô tả chi tiết & Chỉ tiêu cụ thể
                </label>
                <textarea
                  rows={2}
                  value={formProjectDesc}
                  onChange={(e) => setFormProjectDesc(e.target.value)}
                  placeholder="Mục đích, quy mô, kết quả dự kiến..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Địa điểm thực hiện
                  </label>
                  <input
                    type="text"
                    value={formProjectLocation}
                    onChange={(e) => setFormProjectLocation(e.target.value)}
                    placeholder="VD: Tổ 3, KP1, P. Chánh Hiệp"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Dự toán kinh phí (VNĐ)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000000"
                    value={formProjectBudget}
                    onChange={(e) => setFormProjectBudget(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Tiến độ hoàn thành (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formProjectProgress}
                    onChange={(e) => setFormProjectProgress(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Số lượng ĐV tham gia
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formProjectVolunteers}
                    onChange={(e) => setFormProjectVolunteers(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Người phụ trách
                  </label>
                  <input
                    type="text"
                    value={formProjectLeader}
                    onChange={(e) => setFormProjectLeader(e.target.value)}
                    placeholder="Bí thư Chi đoàn"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="text"
                    value={formProjectStartDate}
                    onChange={(e) => setFormProjectStartDate(e.target.value)}
                    placeholder="01/06/2026"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Ngày hoàn thành dự kiến
                  </label>
                  <input
                    type="text"
                    value={formProjectEndDate}
                    onChange={(e) => setFormProjectEndDate(e.target.value)}
                    placeholder="30/11/2026"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsProjectModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveProject}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Công Trình</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
