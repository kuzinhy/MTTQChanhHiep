import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  ArrowRightLeft, 
  Award, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  Edit3, 
  Trash2, 
  Eye, 
  X, 
  Save, 
  Printer, 
  Building2, 
  UserCheck, 
  HeartHandshake, 
  CreditCard, 
  BookOpen, 
  Star,
  Check,
  AlertCircle
} from 'lucide-react';
import { 
  YouthMember, 
  BranchInfo, 
  loadStoredYouthMembers, 
  saveStoredYouthMembers, 
  loadStoredBranches 
} from '../youthUnionData';
import { VerifiedCultureImage } from '../../../cultural/VerifiedCultureImage';
import { YouthMemberDetailModal } from './YouthMemberDetailModal';
import { YouthMemberFormModal } from './YouthMemberFormModal';

interface Props {
  onNotify: (msg: string) => void;
  branchFilterId?: string; // Optional filter if accessed from Chi đoàn workspace
}

export const YouthMembersRosterTab: React.FC<Props> = ({ onNotify, branchFilterId }) => {
  const [members, setMembers] = useState<YouthMember[]>(() => loadStoredYouthMembers());
  const [branches] = useState<BranchInfo[]>(() => loadStoredBranches());

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branchFilterId || 'ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');
  const [selectedRanking, setSelectedRanking] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modal States
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<YouthMember | null>(null);
  const [viewingDigitalCard, setViewingDigitalCard] = useState<YouthMember | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferMember, setTransferMember] = useState<YouthMember | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Transfer Form State
  const [transferType, setTransferType] = useState<'IN' | 'OUT'>('OUT');
  const [transferDestination, setTransferDestination] = useState('');
  const [transferDocNumber, setTransferDocNumber] = useState('');
  const [transferReason, setTransferReason] = useState('Đi học tập / Chuyển công tác');

  // Filtered members calculation
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      // Branch filter
      if (branchFilterId && m.branchId !== branchFilterId) return false;
      if (selectedBranchId !== 'ALL' && m.branchId !== selectedBranchId) return false;

      // Status filter
      if (selectedStatus === 'COMMENDED' && m.status !== 'COMMENDED' && !m.partyTarget) return false;
      if (selectedStatus !== 'ALL' && selectedStatus !== 'COMMENDED' && m.status !== selectedStatus) return false;

      // Position filter
      if (selectedPosition !== 'ALL' && m.position !== selectedPosition) return false;

      // Ranking filter
      if (selectedRanking !== 'ALL' && m.emulationRanking !== selectedRanking) return false;

      // Search query
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = m.fullName.toLowerCase().includes(q);
        const matchCode = m.memberCode.toLowerCase().includes(q);
        const matchPhone = m.phone.toLowerCase().includes(q);
        const matchEmail = m.email.toLowerCase().includes(q);
        const matchProfession = m.profession.toLowerCase().includes(q);
        const matchBranch = m.branchName.toLowerCase().includes(q);
        const matchSkills = m.skills.some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchCode && !matchPhone && !matchEmail && !matchProfession && !matchBranch && !matchSkills) {
          return false;
        }
      }

      return true;
    });
  }, [members, branchFilterId, selectedBranchId, selectedStatus, selectedPosition, selectedRanking, searchTerm]);

  // Statistics Calculation
  const totalCount = members.length;
  const maleCount = members.filter(m => m.gender === 'Nam').length;
  const femaleCount = members.filter(m => m.gender === 'Nữ').length;
  const partyTargetCount = members.filter(m => m.partyTarget || m.status === 'COMMENDED').length;
  const duesPaidCount = members.filter(m => m.unionDuesStatus === 'PAID').length;
  const digitalVerifiedCount = members.filter(m => m.unionBookStatus === 'DIGITAL_VERIFIED').length;

  // Handlers
  const handleOpenAdd = () => {
    setEditingMember(null);
    setIsMemberModalOpen(true);
  };

  const handleOpenEdit = (m: YouthMember) => {
    setEditingMember(m);
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = (savedMember: YouthMember) => {
    const exists = members.some(m => m.id === savedMember.id);
    let nextList: YouthMember[];
    if (exists) {
      nextList = members.map(m => m.id === savedMember.id ? savedMember : m);
      onNotify(`Đã cập nhật Sổ Đoàn điện tử: ${savedMember.fullName} (${savedMember.memberCode})`);
    } else {
      nextList = [savedMember, ...members];
      onNotify(`Đã cấp Sổ Đoàn số hóa cho đoàn viên mới: ${savedMember.fullName} (${savedMember.memberCode})`);
    }

    setMembers(nextList);
    saveStoredYouthMembers(nextList);
    setIsMemberModalOpen(false);
    setEditingMember(null);

    if (viewingDigitalCard?.id === savedMember.id) {
      setViewingDigitalCard(savedMember);
    }
  };

  const handleUpdateMemberInState = (updatedMember: YouthMember) => {
    const nextList = members.map(m => m.id === updatedMember.id ? updatedMember : m);
    setMembers(nextList);
    setViewingDigitalCard(updatedMember);
  };

  const handleDeleteMember = (m: YouthMember) => {
    if (confirm(`Bạn có chắc chắn muốn xóa hồ sơ Đoàn viên "${m.fullName}" (${m.memberCode}) khỏi cơ sở dữ liệu?`)) {
      const updated = members.filter(x => x.id !== m.id);
      setMembers(updated);
      saveStoredYouthMembers(updated);
      onNotify(`Đã xóa hồ sơ đoàn viên: ${m.fullName}`);
    }
  };

  const handleOpenTransfer = (m: YouthMember) => {
    setTransferMember(m);
    setTransferType('OUT');
    setTransferDestination('');
    setTransferDocNumber(`GGT-ĐP-CH/${new Date().getFullYear()}/0${members.indexOf(m) + 1}`);
    setTransferReason('Đi học tập / Chuyển công tác / Hoàn thành nghĩa vụ');
    setIsTransferModalOpen(true);
  };

  const handleSaveTransfer = () => {
    if (!transferMember || !transferDestination.trim()) {
      alert('Vui lòng nhập nơi chuyển đến / nơi chuyển đi!');
      return;
    }

    const newStatus: YouthMember['status'] = transferType === 'OUT' ? 'TRANSFER_OUT' : 'TRANSFER_IN';
    const noteText = `[Chuyển sinh hoạt ${transferType === 'OUT' ? 'ĐI' : 'ĐẾN'}]: ${transferDestination.trim()} (Số GGT: ${transferDocNumber}) - Lý do: ${transferReason}`;

    const updated = members.map(m => {
      if (m.id === transferMember.id) {
        return {
          ...m,
          status: newStatus,
          transferNotes: noteText,
          notes: m.notes ? `${m.notes} | ${noteText}` : noteText,
          updatedAt: new Date().toLocaleDateString('vi-VN')
        };
      }
      return m;
    });

    setMembers(updated);
    saveStoredYouthMembers(updated);
    setIsTransferModalOpen(false);
    onNotify(`Đã xử lý thủ tục chuyển sinh hoạt Đoàn cho: ${transferMember.fullName}`);
  };

  // Export to Excel / CSV format (UTF-8 BOM supported)
  const handleExportCSV = () => {
    const headers = [
      'STT',
      'Mã Số Đoàn Viên',
      'Họ và Tên',
      'Giới Tính',
      'Ngày Sinh',
      'Chi Đoàn',
      'Chức Vụ',
      'Ngày Kết Nạp',
      'Nơi Kết Nạp',
      'Số Điện Thoại',
      'Email',
      'Địa Chỉ Cư Trú',
      'Trình Độ',
      'Nghề Nghiệp',
      'Đoàn Phí 2026',
      'Xếp Loại Thi Đua',
      'Đối Tượng Đảng',
      'Trạng Thái'
    ];

    const rows = filteredMembers.map((m, idx) => [
      idx + 1,
      `"${m.memberCode}"`,
      `"${m.fullName}"`,
      `"${m.gender}"`,
      `"${m.birthDate}"`,
      `"${m.branchName}"`,
      `"${m.position}"`,
      `"${m.joinedDate}"`,
      `"${m.joinedPlace}"`,
      `"${m.phone}"`,
      `"${m.email}"`,
      `"${m.address.replace(/"/g, '""')}"`,
      `"${m.educationLevel}"`,
      `"${m.profession}"`,
      `"${m.unionDuesStatus === 'PAID' ? 'Đã đóng đủ' : 'Chưa đóng'}"`,
      `"${m.emulationRanking}"`,
      `"${m.partyTarget ? 'Đoàn viên ưu tú (Cảm tình Đảng)' : 'Không'}"`,
      `"${m.status}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Danh_Sach_Doan_Vien_Phuong_Chanh_Hiep_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify('Đã xuất thành công danh sách Sổ Đoàn điện tử (CSV/Excel UTF-8)!');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Action Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden border border-blue-600/50">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-radial from-white/10 to-transparent pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-blue-100 text-xs font-bold border border-white/20 mb-3">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>SỔ ĐOÀN ĐIỆN TỬ & CƠ CẤU CHI ĐOÀN 2026</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              Quản Lý Hồ Sơ Đoàn Viên Số Hóa
            </h2>
            <p className="text-blue-100 text-xs lg:text-sm mt-1 max-w-2xl font-medium">
              Số hóa 100% hồ sơ đoàn viên, phân loại cơ cấu tổ chức Chi đoàn trực thuộc, cấp mã định danh QR và quản lý chuyển sinh hoạt Đoàn trực tuyến.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-105 text-slate-900 font-black text-xs flex items-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Đoàn Viên Mới</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-2 backdrop-blur-md border border-white/20 transition active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Xuất Excel / CSV</span>
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-2 backdrop-blur-md border border-white/20 transition active:scale-95 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Báo Cáo Đại Hội</span>
            </button>
          </div>
        </div>

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Tổng Đoàn Viên</div>
            <div className="text-2xl font-black text-white mt-0.5">{totalCount}</div>
            <div className="text-[10px] text-blue-100 font-semibold mt-0.5">
              Nam: <span className="text-amber-300">{maleCount}</span> • Nữ: <span className="text-pink-300">{femaleCount}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Sổ Đoàn Số Hóa</div>
            <div className="text-2xl font-black text-emerald-300 mt-0.5">{digitalVerifiedCount}</div>
            <div className="text-[10px] text-blue-100 font-semibold mt-0.5">
              Tỷ lệ: <span className="text-emerald-300">100%</span> xác thực QR
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Đoàn Viên Ưu Tú</div>
            <div className="text-2xl font-black text-amber-300 mt-0.5">{partyTargetCount}</div>
            <div className="text-[10px] text-blue-100 font-semibold mt-0.5">
              Giới thiệu Đảng xem xét kết nạp
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Đã Đóng Đoàn Phí</div>
            <div className="text-2xl font-black text-white mt-0.5">{duesPaidCount} <span className="text-xs font-normal text-blue-200">/ {totalCount}</span></div>
            <div className="text-[10px] text-emerald-300 font-semibold mt-0.5">
              Năm công tác 2026
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 col-span-2 sm:col-span-1">
            <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Chi Đoàn Trực Thuộc</div>
            <div className="text-2xl font-black text-white mt-0.5">{branches.length}</div>
            <div className="text-[10px] text-blue-100 font-semibold mt-0.5">
              10 Dân cư • 3 Trường • 2 LLVT
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo Tên đoàn viên, Số thẻ Đoàn, SĐT, Kỹ năng, Nghề nghiệp..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-end md:self-auto shrink-0">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${viewMode === 'cards' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Thẻ Sổ Đoàn</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${viewMode === 'table' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Bảng Danh Sách</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Chi Đoàn</label>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tất cả Chi đoàn ({members.length})</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Trạng Thái Sinh Hoạt</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang sinh hoạt</option>
              <option value="COMMENDED">Đoàn viên ưu tú (Cảm tình Đảng)</option>
              <option value="TRANSFER_IN">Chuyển sinh hoạt đến</option>
              <option value="TRANSFER_OUT">Chuyển sinh hoạt đi</option>
              <option value="DEFERRED">Tạm hoãn sinh hoạt</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Chức Vụ</label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tất cả chức vụ</option>
              <option value="Bí thư Chi đoàn">Bí thư Chi đoàn</option>
              <option value="Phó Bí thư Chi đoàn">Phó Bí thư Chi đoàn</option>
              <option value="Ủy viên BCH Chi đoàn">Ủy viên BCH Chi đoàn</option>
              <option value="Tổ trưởng Tổ thanh niên">Tổ trưởng Tổ thanh niên</option>
              <option value="Đoàn viên">Đoàn viên</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Xếp Loại Thi Đua</label>
            <select
              value={selectedRanking}
              onChange={(e) => setSelectedRanking(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tất cả xếp loại</option>
              <option value="XUẤT SẮC">Xuất sắc</option>
              <option value="KHÁ">Khá</option>
              <option value="TRUNG BÌNH">Trung bình</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Cards Grid or Table */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Không tìm thấy đoàn viên phù hợp</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc Chi đoàn / Trạng thái khác.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedBranchId('ALL'); setSelectedStatus('ALL'); setSelectedPosition('ALL'); }}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map(member => (
            <div
              key={member.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition duration-200 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Card top badges */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-black tracking-wider uppercase border border-blue-200">
                    {member.memberCode}
                  </span>
                  {member.partyTarget && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-black border border-rose-200 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-rose-600 text-rose-600" />
                      <span>Cảm tình Đảng</span>
                    </span>
                  )}
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  member.status === 'ACTIVE' || member.status === 'COMMENDED'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : member.status === 'TRANSFER_OUT'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {member.status === 'ACTIVE' && 'Đang sinh hoạt'}
                  {member.status === 'COMMENDED' && 'Đoàn viên ưu tú'}
                  {member.status === 'TRANSFER_OUT' && 'Chuyển sinh hoạt đi'}
                  {member.status === 'TRANSFER_IN' && 'Chuyển sinh hoạt đến'}
                  {member.status === 'DEFERRED' && 'Tạm hoãn'}
                </span>
              </div>

              {/* Profile Header */}
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border-2 border-blue-200 shrink-0 shadow-2xs">
                  {member.avatarUrl ? (
                    <VerifiedCultureImage
                      src={member.avatarUrl}
                      alt={member.fullName}
                      showBadge={false}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-black text-lg">
                      {member.fullName.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-black text-slate-900 truncate group-hover:text-blue-700 transition">
                    {member.fullName}
                  </h4>
                  <p className="text-[11px] font-bold text-blue-600 truncate mt-0.5">
                    {member.position}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{member.branchName}</span>
                  </p>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 mb-4 font-medium">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Ngày sinh:</span>
                  </span>
                  <span className="font-bold">{member.birthDate} ({member.gender})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-slate-400" />
                    <span>Trình độ:</span>
                  </span>
                  <span className="font-semibold truncate max-w-[160px]">{member.educationLevel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-slate-400" />
                    <span>Nghề nghiệp:</span>
                  </span>
                  <span className="font-semibold truncate max-w-[160px]">{member.profession}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-slate-400" />
                    <span>Đoàn phí 2026:</span>
                  </span>
                  <span className={`font-bold ${member.unionDuesStatus === 'PAID' ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {member.unionDuesStatus === 'PAID' ? 'Đã hoàn thành' : 'Chưa nộp'}
                  </span>
                </div>
              </div>

              {/* Skills Chips */}
              {member.skills && member.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {member.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-lg bg-blue-50/80 text-blue-800 text-[10px] font-semibold border border-blue-100">
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-semibold">
                      +{member.skills.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-1.5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setViewingDigitalCard(member)}
                  className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
                  title="Xem Sổ Đoàn điện tử"
                >
                  <QrCode className="w-3.5 h-3.5 text-blue-600" />
                  <span>Sổ Đoàn Số</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenTransfer(member)}
                    className="p-1.5 rounded-xl text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition cursor-pointer"
                    title="Chuyển sinh hoạt Đoàn"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(member)}
                    className="p-1.5 rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition cursor-pointer"
                    title="Chỉnh sửa hồ sơ"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member)}
                    className="p-1.5 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                    title="Xóa đoàn viên"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Đoàn Viên</th>
                  <th className="py-3.5 px-4">Mã Số / Thẻ</th>
                  <th className="py-3.5 px-4">Chi Đoàn</th>
                  <th className="py-3.5 px-4">Chức Vụ</th>
                  <th className="py-3.5 px-4">Ngày Sinh</th>
                  <th className="py-3.5 px-4">Nghề Nghiệp / Trình Độ</th>
                  <th className="py-3.5 px-4">Liên Hệ</th>
                  <th className="py-3.5 px-4">Đoàn Phí</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-blue-50/40 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          {m.avatarUrl ? (
                            <VerifiedCultureImage src={m.avatarUrl} alt={m.fullName} showBadge={false} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-blue-600 text-xs">
                              {m.fullName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1">
                            <span>{m.fullName}</span>
                            {m.partyTarget && <Star className="w-3 h-3 fill-rose-500 text-rose-500 shrink-0" />}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">Kết nạp: {m.joinedDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700 text-[11px]">
                      {m.memberCode}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {m.branchName}
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-600">
                      {m.position}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {m.birthDate} ({m.gender})
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 truncate max-w-[150px]">{m.profession}</div>
                      <div className="text-[10px] text-slate-500">{m.educationLevel}</div>
                    </td>
                    <td className="py-3 px-4 text-[11px] font-medium">
                      <div>{m.phone}</div>
                      <div className="text-slate-400 truncate max-w-[140px]">{m.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${m.unionDuesStatus === 'PAID' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                        {m.unionDuesStatus === 'PAID' ? 'Đã đóng' : 'Chưa'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {m.status === 'ACTIVE' && 'Sinh hoạt'}
                        {m.status === 'COMMENDED' && 'Ưu tú'}
                        {m.status === 'TRANSFER_OUT' && 'Chuyển đi'}
                        {m.status === 'TRANSFER_IN' && 'Chuyển đến'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewingDigitalCard(m)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                          title="Xem Sổ Đoàn"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                          title="Sửa"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(m)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Modal 1: Detailed Youth Member Digital Profile & Training / Emulation Records */}
      {viewingDigitalCard && (
        <YouthMemberDetailModal
          member={viewingDigitalCard}
          onClose={() => setViewingDigitalCard(null)}
          onEdit={(m) => {
            setViewingDigitalCard(null);
            handleOpenEdit(m);
          }}
          onUpdateMember={handleUpdateMemberInState}
          onNotify={onNotify}
        />
      )}

      {/* Modal 2: Add / Edit Youth Member Form */}
      {isMemberModalOpen && (
        <YouthMemberFormModal
          member={editingMember}
          branches={branches}
          defaultBranchId={branches[0]?.id}
          totalMembersCount={members.length}
          onClose={() => setIsMemberModalOpen(false)}
          onSave={handleSaveMember}
        />
      )}

      {/* Modal 3: Transfer In / Out Management */}
      {isTransferModalOpen && transferMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-r from-purple-700 to-indigo-800 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-purple-200" />
                <h3 className="text-sm font-black">Thủ Tục Chuyển Sinh Hoạt Đoàn</h3>
              </div>
              <button onClick={() => setIsTransferModalOpen(false)} className="p-1 rounded-full hover:bg-white/20 text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                <p className="font-bold">Đoàn viên: <span className="text-purple-800 font-black">{transferMember.fullName}</span></p>
                <p className="text-[11px] text-purple-700">Mã đoàn viên: {transferMember.memberCode} • {transferMember.branchName}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Loại Hình Chuyển</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransferType('OUT')}
                    className={`py-2 px-3 rounded-xl font-bold border transition text-center ${transferType === 'OUT' ? 'bg-purple-600 text-white border-purple-600 shadow-2xs' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                  >
                    Chuyển Sinh Hoạt Đi
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferType('IN')}
                    className={`py-2 px-3 rounded-xl font-bold border transition text-center ${transferType === 'IN' ? 'bg-purple-600 text-white border-purple-600 shadow-2xs' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                  >
                    Tiếp Nhận Đến
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {transferType === 'OUT' ? 'Nơi Chuyển Đến (Đoàn Cơ Sở / Trường / Đơn Vị Mới)' : 'Nơi Chuyển Đi (Đoàn Cơ Sở Cũ)'} (*)
                </label>
                <input
                  type="text"
                  value={transferDestination}
                  onChange={(e) => setTransferDestination(e.target.value)}
                  placeholder="VD: Đoàn trường ĐH Bách Khoa TP.HCM"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium focus:ring-2 focus:ring-purple-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số Giấy Giới Thiệu / Quyết Định Chuyển</label>
                <input
                  type="text"
                  value={transferDocNumber}
                  onChange={(e) => setTransferDocNumber(e.target.value)}
                  placeholder="VD: GGT-ĐP-CH/2026/015"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium focus:ring-2 focus:ring-purple-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lý Do Chuyển</label>
                <input
                  type="text"
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  placeholder="VD: Học tập, thực hiện nghĩa vụ quân sự..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium focus:ring-2 focus:ring-purple-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold transition text-xs"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleSaveTransfer}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition text-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác Nhận Chuyển</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Congress & Standard Statistics Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in my-8">
            <div className="bg-gradient-to-r from-blue-800 to-indigo-900 p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest block">BIỂU MẪU BÁO CÁO THỐNG KÊ ĐẠI HỘI</span>
                <h3 className="text-lg font-black mt-0.5">Báo Cáo Số Lượng & Cơ Cấu Đoàn Viên Phường Chánh Hiệp</h3>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="p-1.5 rounded-full hover:bg-white/20 text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs text-slate-800 max-h-[75vh] overflow-y-auto">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-blue-950 text-sm">Tổng số Đoàn viên toàn phường: <span className="text-blue-700 font-black">{totalCount} đồng chí</span></h4>
                  <p className="text-slate-600 text-[11px] mt-0.5">Theo số liệu cập nhật phần mềm Quản lý Đoàn viên 2026</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-1.5 shadow-2xs hover:bg-blue-700 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In Báo Cáo</span>
                </button>
              </div>

              {/* Table 1: Breakdown by Branch Type */}
              <div>
                <h5 className="font-bold text-slate-900 mb-2 uppercase text-[11px] tracking-wider">1. Phân loại theo loại hình Chi đoàn</h5>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Khối / Loại hình Chi đoàn</th>
                        <th className="py-2.5 px-3 text-center">Số Chi đoàn</th>
                        <th className="py-2.5 px-3 text-center">Tổng Đoàn viên</th>
                        <th className="py-2.5 px-3 text-center">Tỷ lệ %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-blue-900">Chi đoàn Khu phố (Địa bàn dân cư)</td>
                        <td className="py-2.5 px-3 text-center font-bold">10</td>
                        <td className="py-2.5 px-3 text-center font-bold">{members.filter(m => m.branchId.startsWith('kp')).length}</td>
                        <td className="py-2.5 px-3 text-center">{Math.round((members.filter(m => m.branchId.startsWith('kp')).length / totalCount) * 100)}%</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-emerald-900">Chi đoàn Khối Trường học</td>
                        <td className="py-2.5 px-3 text-center font-bold">3</td>
                        <td className="py-2.5 px-3 text-center font-bold">{members.filter(m => m.branchId === 'thcs' || m.branchId === 'th_pl' || m.branchId === 'mn_pl').length}</td>
                        <td className="py-2.5 px-3 text-center">{Math.round((members.filter(m => m.branchId === 'thcs' || m.branchId === 'th_pl' || m.branchId === 'mn_pl').length / totalCount) * 100)}%</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-purple-900">Chi đoàn Lực lượng vũ trang (Quân sự & Công an)</td>
                        <td className="py-2.5 px-3 text-center font-bold">2</td>
                        <td className="py-2.5 px-3 text-center font-bold">{members.filter(m => m.branchId === 'qs' || m.branchId === 'ca').length}</td>
                        <td className="py-2.5 px-3 text-center">{Math.round((members.filter(m => m.branchId === 'qs' || m.branchId === 'ca').length / totalCount) * 100)}%</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-amber-900">Chi đoàn Doanh nghiệp Ngoài nhà nước</td>
                        <td className="py-2.5 px-3 text-center font-bold">1</td>
                        <td className="py-2.5 px-3 text-center font-bold">{members.filter(m => m.branchId === 'dn').length}</td>
                        <td className="py-2.5 px-3 text-center">{Math.round((members.filter(m => m.branchId === 'dn').length / totalCount) * 100)}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table 2: Gender & Education breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-bold text-slate-900 mb-2 uppercase text-[11px] tracking-wider">2. Cơ cấu Giới tính</h5>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between font-medium">
                      <span>Đoàn viên Nam:</span>
                      <span className="font-bold text-slate-900">{maleCount} ({Math.round((maleCount / totalCount) * 100)}%)</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Đoàn viên Nữ:</span>
                      <span className="font-bold text-slate-900">{femaleCount} ({Math.round((femaleCount / totalCount) * 100)}%)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-slate-900 mb-2 uppercase text-[11px] tracking-wider">3. Chất lượng & Phát triển Đảng</h5>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between font-medium">
                      <span>Đoàn viên Ưu tú (Cảm tình Đảng):</span>
                      <span className="font-bold text-rose-700">{partyTargetCount} đ/c</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Xếp loại Hoàn thành Xuất sắc:</span>
                      <span className="font-bold text-emerald-700">{members.filter(m => m.emulationRanking === 'XUẤT SẮC').length} đ/c</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 transition"
              >
                Đóng Báo Cáo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
