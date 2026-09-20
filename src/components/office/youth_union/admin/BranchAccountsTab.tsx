import React, { useState } from 'react';
import { 
  Users, 
  Key, 
  Plus, 
  Search, 
  Lock, 
  Unlock, 
  Copy, 
  Check, 
  Trash2, 
  RefreshCw, 
  ShieldCheck, 
  X, 
  Save, 
  Phone, 
  UserPlus, 
  Eye, 
  EyeOff,
  Building2,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { 
  BranchAccount, 
  loadStoredAccounts, 
  saveStoredAccounts, 
  loadStoredBranches 
} from '../youthUnionData';

interface Props {
  onNotify: (msg: string) => void;
}

export const BranchAccountsTab: React.FC<Props> = ({ onNotify }) => {
  const [accounts, setAccounts] = useState<BranchAccount[]>(() => loadStoredAccounts());
  const branches = loadStoredBranches();
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0]?.id || 'kp1');
  const [formUsername, setFormUsername] = useState('chidoan_kp1');
  const [formPassword, setFormPassword] = useState('Doan@2026');
  const [formFullName, setFormFullName] = useState('');
  const [formPosition, setFormPosition] = useState<BranchAccount['position']>('Bí thư Chi đoàn');
  const [formPhone, setFormPhone] = useState('');

  // Copy feedback tracking
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Auto-generate suggested username when branch changes
  const handleBranchSelectChange = (branchId: string) => {
    setSelectedBranchId(branchId);
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setFormUsername(`chidoan_${branch.id.replace(/-/g, '_')}`);
      setFormFullName(branch.secretary || '');
      setFormPhone(branch.phone || '');
    }
  };

  const handleOpenCreateModal = () => {
    const firstBranch = branches[0];
    if (firstBranch) {
      setSelectedBranchId(firstBranch.id);
      setFormUsername(`chidoan_${firstBranch.id}`);
      setFormFullName(firstBranch.secretary || '');
      setFormPhone(firstBranch.phone || '');
    }
    setFormPassword('Doan@' + Math.floor(1000 + Math.random() * 9000));
    setFormPosition('Bí thư Chi đoàn');
    setIsModalOpen(true);
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = 'CD@';
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormPassword(pass);
  };

  const handleCreateAccount = () => {
    if (!formUsername.trim()) {
      alert('Vui lòng nhập Tên đăng nhập!');
      return;
    }
    if (!formPassword.trim()) {
      alert('Vui lòng nhập Mật khẩu!');
      return;
    }

    const branch = branches.find(b => b.id === selectedBranchId);
    const newAccount: BranchAccount = {
      id: 'acc_' + Date.now(),
      branchId: selectedBranchId,
      branchName: branch ? branch.name : 'Chi đoàn trực thuộc',
      username: formUsername.trim().toLowerCase(),
      passwordMasked: formPassword,
      fullName: formFullName.trim() || (branch?.secretary || 'Cán bộ Đoàn'),
      position: formPosition,
      phone: formPhone.trim() || (branch?.phone || '0900.000.000'),
      status: 'ACTIVE',
      createdAt: new Date().toLocaleDateString('vi-VN'),
      lastLogin: 'Chưa đăng nhập'
    };

    const updated = [newAccount, ...accounts];
    setAccounts(updated);
    saveStoredAccounts(updated);
    setIsModalOpen(false);
    onNotify(`Đã cấp tài khoản "${newAccount.username}" cho ${newAccount.branchName}!`);
  };

  const handleToggleStatus = (accId: string) => {
    const updated = accounts.map(a => {
      if (a.id === accId) {
        return {
          ...a,
          status: (a.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED') as any
        };
      }
      return a;
    });
    setAccounts(updated);
    saveStoredAccounts(updated);
    onNotify('Đã thay đổi trạng thái tài khoản!');
  };

  const handleResetPassword = (acc: BranchAccount) => {
    const newPass = 'Doan@' + Math.floor(1000 + Math.random() * 9000);
    const updated = accounts.map(a => {
      if (a.id === acc.id) {
        return { ...a, passwordMasked: newPass };
      }
      return a;
    });
    setAccounts(updated);
    saveStoredAccounts(updated);
    
    // Copy new credentials
    const text = `Tài khoản Workspace Chi đoàn ${acc.branchName}:\n- Tên đăng nhập: ${acc.username}\n- Mật khẩu mới: ${newPass}\n- Link Bàn làm việc số Đoàn Phường Chánh Hiệp`;
    navigator.clipboard?.writeText(text);
    onNotify(`Đã đặt lại mật khẩu mới cho ${acc.username}: ${newPass} (Đã sao chép)`);
  };

  const handleCopyCredentials = (acc: BranchAccount) => {
    const text = `[HỆ THỐNG WORKSPACE ĐOÀN PHƯỜNG CHÁNH HIỆP]\nCấp tài khoản Bàn làm việc số Chi đoàn:\n- Đơn vị: ${acc.branchName}\n- Họ tên: ${acc.fullName} (${acc.position})\n- Tên đăng nhập: ${acc.username}\n- Mật khẩu khởi tạo: ${acc.passwordMasked}\n- Cổng đăng nhập: Workspace Chi đoàn 2026`;
    navigator.clipboard?.writeText(text);
    setCopiedId(acc.id);
    setTimeout(() => setCopiedId(null), 2500);
    onNotify(`Đã sao chép thông tin tài khoản ${acc.username} để gửi cho Chi đoàn!`);
  };

  const handleDeleteAccount = (accId: string, username: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${username}"?`)) {
      const updated = accounts.filter(a => a.id !== accId);
      setAccounts(updated);
      saveStoredAccounts(updated);
      onNotify(`Đã xóa tài khoản: ${username}`);
    }
  };

  // Filtered accounts
  const filteredAccounts = accounts.filter(a => {
    const q = searchTerm.toLowerCase();
    return a.username.toLowerCase().includes(q) ||
           a.branchName.toLowerCase().includes(q) ||
           a.fullName.toLowerCase().includes(q) ||
           a.phone.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-md uppercase">
                QUẢN TRỊ TÀI KHOẢN
              </span>
              <span className="text-xs text-slate-400 font-bold">•</span>
              <span className="text-xs text-slate-500 font-semibold">Workspace Phường Chánh Hiệp</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Tạo & Cấp Tài Khoản Workspace Cho Chi Đoàn
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Cấp tài khoản đăng nhập cho Bí thư, Phó Bí thư các Chi đoàn để truy cập Bàn làm việc số, tự chấm điểm tiêu chí và nộp hồ sơ minh chứng trực tuyến.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-500/20 shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cấp Tài Khoản Mới</span>
          </button>
        </div>

        {/* 3 Quick Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Tổng tài khoản đã cấp</p>
              <p className="text-xl font-black text-slate-900">{accounts.length} Tài khoản</p>
            </div>
          </div>

          <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Đang kích hoạt</p>
              <p className="text-xl font-black text-emerald-900">
                {accounts.filter(a => a.status === 'ACTIVE').length} Tài khoản
              </p>
            </div>
          </div>

          <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Tạm khóa / Bảo lưu</p>
              <p className="text-xl font-black text-amber-900">
                {accounts.filter(a => a.status === 'LOCKED').length} Tài khoản
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo Username, Chi đoàn hoặc Họ tên Bí thư..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <p className="text-xs text-slate-400">
          Hiển thị {filteredAccounts.length} / {accounts.length} tài khoản
        </p>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4">Chi Đoàn Quản Lý</th>
                <th className="p-4">Tên Đăng Nhập</th>
                <th className="p-4">Mật Khẩu Khởi Tạo</th>
                <th className="p-4">Người Đại Diện</th>
                <th className="p-4">Chức Vụ</th>
                <th className="p-4 text-center">Trạng Thái</th>
                <th className="p-4 text-center">Đăng Nhập Cuối</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Chưa có tài khoản nào phù hợp với tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map(acc => {
                  const isLocked = acc.status === 'LOCKED';
                  const isCopied = copiedId === acc.id;
                  return (
                    <tr key={acc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{acc.branchName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold text-xs border border-blue-200/60">
                          {acc.username}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-600">
                        <span className="px-2 py-0.5 bg-slate-100 rounded-md font-bold text-xs">
                          {acc.passwordMasked}
                        </span>
                      </td>
                      <td className="p-4 text-slate-900 font-bold">
                        {acc.fullName}
                        <span className="block text-[10px] font-normal text-slate-400">{acc.phone}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                          {acc.position}
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
                      <td className="p-4 text-center text-[11px] text-slate-400 font-mono">
                        {acc.lastLogin || 'Chưa đăng nhập'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Copy credentials button */}
                          <button
                            onClick={() => handleCopyCredentials(acc)}
                            title="Sao chép thông tin tài khoản gửi cho Chi đoàn"
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isCopied 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                          >
                            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>

                          {/* Reset Password */}
                          <button
                            onClick={() => handleResetPassword(acc)}
                            title="Đặt lại mật khẩu mới"
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-amber-50 hover:text-amber-600 transition-colors cursor-pointer"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>

                          {/* Toggle Lock */}
                          <button
                            onClick={() => handleToggleStatus(acc.id)}
                            title={isLocked ? 'Mở khóa tài khoản' : 'Tạm khóa tài khoản'}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                          >
                            {isLocked ? <Unlock className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-slate-400" />}
                          </button>

                          {/* Delete Account */}
                          <button
                            onClick={() => handleDeleteAccount(acc.id, acc.username)}
                            title="Xóa tài khoản"
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
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

      {/* Modal: Cấp Tài Khoản Mới */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Cấp Tài Khoản Workspace Chi Đoàn</h3>
                  <p className="text-[11px] text-slate-400">Tạo tài khoản quản lý tự chấm minh chứng cho Chi đoàn</p>
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
                  Đơn vị Chi đoàn trực thuộc <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedBranchId}
                  onChange={(e) => handleBranchSelectChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tên đăng nhập (Username) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  placeholder="VD: chidoan_kp1"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Mật khẩu khởi tạo <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Sinh mật khẩu ngẫu nhiên</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="Mật khẩu..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Họ và tên người nhận
                  </label>
                  <input
                    type="text"
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    placeholder="VD: Trần Thị Bích"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Chức vụ công tác
                  </label>
                  <select
                    value={formPosition}
                    onChange={(e) => setFormPosition(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Bí thư Chi đoàn">Bí thư Chi đoàn</option>
                    <option value="Phó Bí thư">Phó Bí thư</option>
                    <option value="Ủy viên BCH">Ủy viên BCH</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Số điện thoại
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
                onClick={handleCreateAccount}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-500/20"
              >
                <Save className="w-4 h-4" />
                <span>Hoàn Tất & Cấp Tài Khoản</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
