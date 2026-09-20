import React, { useState } from 'react';
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
  Briefcase
} from 'lucide-react';
import { 
  BranchInfo, 
  loadStoredBranches, 
  saveStoredBranches 
} from '../youthUnionData';

interface Props {
  onNotify: (msg: string) => void;
}

export const BranchesManagementTab: React.FC<Props> = ({ onNotify }) => {
  const [branches, setBranches] = useState<BranchInfo[]>(() => loadStoredBranches());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchInfo | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<BranchInfo['type']>('DÂN CƯ');
  const [formSecretary, setFormSecretary] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formMembersCount, setFormMembersCount] = useState<number>(30);

  // Stats calculation
  const totalMembers = branches.reduce((sum, b) => sum + (b.membersCount || 0), 0);
  const residentialCount = branches.filter(b => b.type === 'DÂN CƯ').length;
  const schoolCount = branches.filter(b => b.type === 'TRƯỜNG HỌC').length;
  const militaryCount = branches.filter(b => b.type === 'LỰC LƯỢNG VŨ TRANG').length;
  const enterpriseCount = branches.filter(b => b.type === 'DOANH NGHIỆP').length;

  const handleOpenAddModal = () => {
    setEditingBranch(null);
    setFormName('');
    setFormType('DÂN CƯ');
    setFormSecretary('');
    setFormPhone('');
    setFormMembersCount(30);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (branch: BranchInfo) => {
    setEditingBranch(branch);
    setFormName(branch.name);
    setFormType(branch.type);
    setFormSecretary(branch.secretary);
    setFormPhone(branch.phone);
    setFormMembersCount(branch.membersCount);
    setIsModalOpen(true);
  };

  const handleSaveBranch = () => {
    if (!formName.trim()) {
      alert('Vui lòng nhập tên Chi đoàn!');
      return;
    }

    if (editingBranch) {
      // Update existing
      const updated = branches.map(b => {
        if (b.id === editingBranch.id) {
          return {
            ...b,
            name: formName.trim(),
            type: formType,
            secretary: formSecretary.trim(),
            phone: formPhone.trim(),
            membersCount: Math.max(1, formMembersCount)
          };
        }
        return b;
      });
      setBranches(updated);
      saveStoredBranches(updated);
      onNotify(`Đã cập nhật thông tin Chi đoàn: ${formName}`);
    } else {
      // Create new
      const newId = 'branch_' + Date.now();
      const newBranch: BranchInfo = {
        id: newId,
        name: formName.trim(),
        type: formType,
        secretary: formSecretary.trim() || 'Chưa phân công',
        phone: formPhone.trim() || 'Đang cập nhật',
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
      onNotify(`Đã thêm mới Chi đoàn: ${formName}`);
    }

    setIsModalOpen(false);
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
    onNotify('Đã thay đổi trạng thái hoạt động của Chi đoàn!');
  };

  const handleDeleteBranch = (branchId: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa Chi đoàn "${name}" khỏi hệ thống? Dữ liệu tự chấm liên quan sẽ bị gỡ bỏ.`)) {
      const updated = branches.filter(b => b.id !== branchId);
      setBranches(updated);
      saveStoredBranches(updated);
      onNotify(`Đã xóa Chi đoàn: ${name}`);
    }
  };

  // Filtered branches
  const filteredBranches = branches.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.secretary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedType === 'ALL' || b.type === selectedType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-md uppercase">
                DANH SÁCH TỔ CHỨC
              </span>
              <span className="text-xs text-slate-400 font-bold">•</span>
              <span className="text-xs text-slate-500 font-semibold">Cơ cấu Đoàn Phường Chánh Hiệp</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Cài Đặt Số Lượng & Quản Lý Chi Đoàn Trực Thuộc
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Cài đặt số lượng đơn vị, số lượng đoàn viên, thông tin Bí thư và quyền truy cập Workspace cho từng Chi đoàn trên địa bàn Phường Chánh Hiệp.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-500/20 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Chi Đoàn Mới</span>
          </button>
        </div>

        {/* 4 Block Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-6">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Tổng Chi Đoàn</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{branches.length}</p>
            <p className="text-[11px] text-slate-500 mt-1">{totalMembers} Đoàn viên</p>
          </div>

          <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-100">
            <div className="flex items-center justify-between text-blue-600 mb-1">
              <Building2 className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">DÂN CƯ</span>
            </div>
            <p className="text-2xl font-black text-blue-900">{residentialCount}</p>
            <p className="text-[11px] text-blue-600 mt-0.5 font-medium">10 Khu phố</p>
          </div>

          <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-100">
            <div className="flex items-center justify-between text-emerald-600 mb-1">
              <School className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">TRƯỜNG HỌC</span>
            </div>
            <p className="text-2xl font-black text-emerald-900">{schoolCount}</p>
            <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">THCS, Tiểu học, MN</p>
          </div>

          <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-100">
            <div className="flex items-center justify-between text-amber-600 mb-1">
              <Shield className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">LỰC LƯỢNG VŨ TRANG</span>
            </div>
            <p className="text-2xl font-black text-amber-900">{militaryCount}</p>
            <p className="text-[11px] text-amber-600 mt-0.5 font-medium">Quân sự & Công an</p>
          </div>

          <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100">
            <div className="flex items-center justify-between text-purple-600 mb-1">
              <Briefcase className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">DOANH NGHIỆP</span>
            </div>
            <p className="text-2xl font-black text-purple-900">{enterpriseCount}</p>
            <p className="text-[11px] text-purple-600 mt-0.5 font-medium">Ngoài nhà nước</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Block Types Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'DÂN CƯ', label: 'Địa bàn Dân cư' },
            { id: 'TRƯỜNG HỌC', label: 'Trường học' },
            { id: 'LỰC LƯỢNG VŨ TRANG', label: 'LLVT' },
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

        {/* Search Field */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên Chi đoàn hoặc Bí thư..."
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-72"
          />
        </div>
      </div>

      {/* Branches Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4">STT</th>
                <th className="p-4">Tên Chi Đoàn</th>
                <th className="p-4">Khối / Loại hình</th>
                <th className="p-4">Bí thư phụ trách</th>
                <th className="p-4 text-center">Số lượng ĐV</th>
                <th className="p-4 text-center">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredBranches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Không tìm thấy Chi đoàn nào phù hợp với từ khóa tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredBranches.map((branch, index) => {
                  const isLocked = branch.status === 'LOCKED';
                  return (
                    <tr key={branch.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 text-slate-400 font-bold">
                        {index + 1}
                      </td>
                      <td className="p-4 font-black text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-black text-xs shrink-0">
                            {branch.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span>{branch.name}</span>
                            <span className="block text-[10px] font-mono text-slate-400 font-normal">Mã: {branch.id}</span>
                          </div>
                        </div>
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
                        <div className="text-slate-900 font-bold">{branch.secretary}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{branch.phone}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-black rounded-lg">
                          {branch.membersCount} ĐV
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {isLocked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                            <Lock className="w-3 h-3 text-rose-600" />
                            Đã khóa
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Hoạt động
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleStatus(branch.id)}
                            title={isLocked ? 'Mở khóa Chi đoàn' : 'Tạm khóa Chi đoàn'}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                          >
                            {isLocked ? <Unlock className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-slate-400" />}
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(branch)}
                            title="Chỉnh sửa thông tin"
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBranch(branch.id, branch.name)}
                            title="Xóa Chi đoàn"
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Branch */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingBranch ? 'Chỉnh Sửa Thông Tin Chi Đoàn' : 'Thêm Chi Đoàn Mới'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Hệ thống quản lý cơ cấu tổ chức Đoàn Phường Chánh Hiệp</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
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
                    Số lượng đoàn viên
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formMembersCount}
                    onChange={(e) => setFormMembersCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Họ và tên Bí thư Chi đoàn
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

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveBranch}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-500/20"
              >
                <Save className="w-4 h-4" />
                <span>{editingBranch ? 'Cập Nhật' : 'Tạo Chi Đoàn'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
