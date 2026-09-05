import React, { useState } from 'react';
import { 
  Building, 
  Users, 
  ShieldCheck, 
  HeartHandshake, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  RotateCcw, 
  Check, 
  UserPlus, 
  MapPin, 
  Phone, 
  Mail, 
  Info,
  ArrowUp,
  ArrowDown,
  Sparkles
} from 'lucide-react';
import { 
  loadStoredAboutData, 
  saveStoredAboutData, 
  AboutPageData, 
  StandingCommitteeMember, 
  AboutPillar, 
  DEFAULT_ABOUT_DATA 
} from '../../lib/aboutDataStore';

export const AboutAdminView: React.FC<{
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}> = ({ onShowToast }) => {
  const [data, setData] = useState<AboutPageData>(() => loadStoredAboutData());
  const [isSaved, setIsSaved] = useState(false);

  // Modals / Editing States for Members
  const [editingMember, setEditingMember] = useState<StandingCommitteeMember | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  // Member Form State
  const [memName, setMemName] = useState('');
  const [memUnit, setMemUnit] = useState('Ủy ban MTTQ VN phường');
  const [memPos, setMemPos] = useState('');
  const [memSecPos, setMemSecPos] = useState('');
  const [memAvatar, setMemAvatar] = useState('');
  const [memIsMain, setMemIsMain] = useState(false);

  // Modals / Editing States for Pillars
  const [editingPillar, setEditingPillar] = useState<AboutPillar | null>(null);
  const [isPillarModalOpen, setIsPillarModalOpen] = useState(false);
  const [pilTitle, setPilTitle] = useState('');
  const [pilDesc, setPilDesc] = useState('');

  const handleSaveAll = () => {
    saveStoredAboutData(data);
    setIsSaved(true);
    if (onShowToast) onShowToast('Đã lưu thay đổi trang Giới thiệu thành công', 'success');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetDefault = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục về dữ liệu trang Giới thiệu mặc định?')) {
      setData(DEFAULT_ABOUT_DATA);
      saveStoredAboutData(DEFAULT_ABOUT_DATA);
      if (onShowToast) onShowToast('Đã khôi phục dữ liệu mặc định', 'info');
    }
  };

  // MEMBER HANDLERS
  const handleOpenMemberModal = (member?: StandingCommitteeMember) => {
    if (member) {
      setEditingMember(member);
      setMemName(member.name);
      setMemUnit(member.unit || 'Ủy ban MTTQ VN phường');
      setMemPos(member.position);
      setMemSecPos(member.secondaryPosition || '');
      setMemAvatar(member.avatarUrl || '');
      setMemIsMain(!!member.isMainLeader);
    } else {
      setEditingMember(null);
      setMemName('');
      setMemUnit('Ủy ban MTTQ VN phường');
      setMemPos('Phó Chủ tịch UB MTTQ VN phường');
      setMemSecPos('');
      setMemAvatar('');
      setMemIsMain(false);
    }
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memName.trim() || !memPos.trim()) {
      alert('Vui lòng nhập họ tên và chức vụ');
      return;
    }

    let updatedMembers = [...data.members];
    if (editingMember) {
      updatedMembers = updatedMembers.map((m) =>
        m.id === editingMember.id
          ? {
              ...m,
              name: memName.trim(),
              unit: memUnit.trim(),
              position: memPos.trim(),
              secondaryPosition: memSecPos.trim() || undefined,
              avatarUrl: memAvatar.trim() || undefined,
              isMainLeader: memIsMain
            }
          : m
      );
    } else {
      const newMem: StandingCommitteeMember = {
        id: `mem-${Date.now()}`,
        stt: updatedMembers.length + 1,
        unit: memUnit.trim(),
        name: memName.trim(),
        position: memPos.trim(),
        secondaryPosition: memSecPos.trim() || undefined,
        avatarUrl: memAvatar.trim() || undefined,
        isMainLeader: memIsMain
      };
      updatedMembers.push(newMem);
    }

    // Re-index STT
    updatedMembers = updatedMembers.map((m, idx) => ({ ...m, stt: idx + 1 }));

    const updatedData = { ...data, members: updatedMembers };
    setData(updatedData);
    saveStoredAboutData(updatedData);
    setIsMemberModalOpen(false);
    if (onShowToast) onShowToast(editingMember ? 'Đã cập nhật nhân sự' : 'Đã thêm nhân sự mới', 'success');
  };

  const handleDeleteMember = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa nhân sự này khỏi danh sách Ban Thường trực?')) {
      let updatedMembers = data.members.filter((m) => m.id !== id);
      updatedMembers = updatedMembers.map((m, idx) => ({ ...m, stt: idx + 1 }));
      const updatedData = { ...data, members: updatedMembers };
      setData(updatedData);
      saveStoredAboutData(updatedData);
      if (onShowToast) onShowToast('Đã xóa nhân sự', 'info');
    }
  };

  const handleMoveMember = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= data.members.length) return;

    const updatedMembers = [...data.members];
    const temp = updatedMembers[index];
    updatedMembers[index] = updatedMembers[newIndex];
    updatedMembers[newIndex] = temp;

    // Update STTs
    const finalMembers = updatedMembers.map((m, idx) => ({ ...m, stt: idx + 1 }));
    const updatedData = { ...data, members: finalMembers };
    setData(updatedData);
    saveStoredAboutData(updatedData);
  };

  // PILLAR HANDLERS
  const handleOpenPillarModal = (pillar?: AboutPillar) => {
    if (pillar) {
      setEditingPillar(pillar);
      setPilTitle(pillar.title);
      setPilDesc(pillar.description);
    } else {
      setEditingPillar(null);
      setPilTitle('');
      setPilDesc('');
    }
    setIsPillarModalOpen(true);
  };

  const handleSavePillar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pilTitle.trim() || !pilDesc.trim()) {
      alert('Vui lòng điền đủ tiêu đề và nội dung trụ cột');
      return;
    }

    let updatedPillars = [...data.pillars];
    if (editingPillar) {
      updatedPillars = updatedPillars.map((p) =>
        p.id === editingPillar.id ? { ...p, title: pilTitle.trim(), description: pilDesc.trim() } : p
      );
    } else {
      updatedPillars.push({
        id: `pillar-${Date.now()}`,
        title: pilTitle.trim(),
        description: pilDesc.trim()
      });
    }

    const updatedData = { ...data, pillars: updatedPillars };
    setData(updatedData);
    saveStoredAboutData(updatedData);
    setIsPillarModalOpen(false);
    if (onShowToast) onShowToast('Đã cập nhật mục hoạt động', 'success');
  };

  const handleDeletePillar = (id: string) => {
    if (window.confirm('Xóa mục hoạt động này?')) {
      const updatedPillars = data.pillars.filter((p) => p.id !== id);
      const updatedData = { ...data, pillars: updatedPillars };
      setData(updatedData);
      saveStoredAboutData(updatedData);
      if (onShowToast) onShowToast('Đã xóa mục hoạt động', 'info');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-lg border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>QUẢN TRỊ TRANG GIỚI THIỆU &amp; NHÂN SỰ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Cấu Hình Trang Giới Thiệu UB MTTQ VN Phường
          </h2>
          <p className="text-xs text-slate-300">
            Chỉnh sửa tiêu đề, phương châm, thông tin liên hệ và danh sách Ban Thường trực Khóa 1 (Nhiệm kỳ 2025 - 2030)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefault}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs flex items-center gap-2 transition cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Khôi phục mặc định</span>
          </button>
          <button
            onClick={handleSaveAll}
            className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-md transition cursor-pointer ${
              isSaved ? 'bg-emerald-500 text-white' : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Đã lưu thay đổi' : 'Lưu tất cả cấu hình'}</span>
          </button>
        </div>
      </div>

      {/* General Info Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          <span>Thông Tin Tiêu Đề Banner &amp; Liên Hệ</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên Cơ Quan / Tiêu Đề Chính</label>
            <input
              type="text"
              value={data.headerTitle}
              onChange={(e) => setData({ ...data, headerTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Khẩu Hiệu / Phương Châm Hành Động</label>
            <input
              type="text"
              value={data.motto}
              onChange={(e) => setData({ ...data, motto: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-amber-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Đoạn Mô Tả Giới Thiệu Chức Năng</label>
            <textarea
              rows={2}
              value={data.headerSubtitle}
              onChange={(e) => setData({ ...data, headerSubtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu Đề Khóa Nhiệm Kỳ Ban Thường Trực</label>
            <input
              type="text"
              value={data.termTitle}
              onChange={(e) => setData({ ...data, termTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-red-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nhãn Huy Hiệu Đơn Vị</label>
            <input
              type="text"
              value={data.termSubtitle}
              onChange={(e) => setData({ ...data, termSubtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Địa Chỉ Trụ Sở</label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => setData({ ...data, address: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Hotline Liên Hệ</label>
            <input
              type="text"
              value={data.hotline}
              onChange={(e) => setData({ ...data, hotline: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Công Thức Mặt Trận</label>
            <input
              type="text"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Standing Committee Members Manager */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-red-600" />
              <span>Quản Lý Nhân Sự Ban Thường Trực ({data.members.length} Đồng Chí)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Thêm, sửa, xóa hoặc thay đổi thứ tự cán bộ lãnh đạo Ban Thường trực UB MTTQ VN Phường
            </p>
          </div>
          <button
            onClick={() => handleOpenMemberModal()}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm Cán Bộ Mới</span>
          </button>
        </div>

        {/* Members List Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 font-black">
                <th className="py-3 px-3 text-center w-12">STT</th>
                <th className="py-3 px-3">Họ và tên</th>
                <th className="py-3 px-3">Chức vụ chính</th>
                <th className="py-3 px-3">Chức vụ kiêm nhiệm</th>
                <th className="py-3 px-3 text-center w-24">Thứ tự</th>
                <th className="py-3 px-3 text-right w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {data.members.map((m, idx) => (
                <tr key={m.id || idx} className={`hover:bg-slate-50 transition ${m.isMainLeader || idx === 0 ? 'bg-red-50/30 font-bold' : ''}`}>
                  <td className="py-3 px-3 text-center font-bold text-red-700">{m.stt || idx + 1}</td>
                  <td className="py-3 px-3">
                    <div className="font-extrabold text-slate-900 flex items-center gap-2">
                      <span>{m.name}</span>
                      {(m.isMainLeader || idx === 0) && (
                        <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[9px]">Chủ trì</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-bold text-blue-800">{m.position}</td>
                  <td className="py-3 px-3 text-slate-600">{m.secondaryPosition || '—'}</td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        disabled={idx === 0}
                        onClick={() => handleMoveMember(idx, 'up')}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 transition cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={idx === data.members.length - 1}
                        onClick={() => handleMoveMember(idx, 'down')}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 transition cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenMemberModal(m)}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold transition cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(m.id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold transition cursor-pointer"
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

      {/* Pillars / Missions Manager */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>Quản Lý Mộc Hoạt Động Trụ Cột ({data.pillars.length} Trụ Cột)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Các chức năng, nhiệm vụ chính của Mặt Trận Tổ Quốc thể hiện trên trang giới thiệu
            </p>
          </div>
          <button
            onClick={() => handleOpenPillarModal()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Mục Hoạt Động</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.pillars.map((p) => (
            <div key={p.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 relative group">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-sm text-slate-900">{p.title}</h4>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenPillarModal(p)}
                    className="p-1 rounded bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeletePillar(p.id)}
                    className="p-1 rounded bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{p.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MEMBER EDIT / ADD MODAL */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 relative animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {editingMember ? 'Sửa Thông Tin Cán Bộ' : 'Thêm Cán Bộ Thường Trực Mới'}
              </h3>
              <button
                onClick={() => setIsMemberModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 font-extrabold text-xs text-slate-700 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ và Tên cán bộ (*)</label>
                <input
                  type="text"
                  required
                  value={memName}
                  onChange={(e) => setMemName(e.target.value)}
                  placeholder="VD: Nguyễn Công Lý"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên đơn vị trực thuộc</label>
                <input
                  type="text"
                  value={memUnit}
                  onChange={(e) => setMemUnit(e.target.value)}
                  placeholder="Ủy ban MTTQ VN phường"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chức vụ chính (*)</label>
                <input
                  type="text"
                  required
                  value={memPos}
                  onChange={(e) => setMemPos(e.target.value)}
                  placeholder="VD: Chủ tịch UB MTTQ VN phường"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-red-700 focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chức vụ kiêm nhiệm (Nếu có)</label>
                <input
                  type="text"
                  value={memSecPos}
                  onChange={(e) => setMemSecPos(e.target.value)}
                  placeholder="VD: Chủ tịch Hội CCB phường"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Link Ảnh Đại Diện (Để trống sẽ dùng ảnh mặc định)</label>
                <input
                  type="text"
                  value={memAvatar}
                  onChange={(e) => setMemAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="memIsMain"
                  checked={memIsMain}
                  onChange={(e) => setMemIsMain(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                />
                <label htmlFor="memIsMain" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Cán bộ chủ trì (Chủ tịch UB MTTQ VN phường)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-md"
                >
                  {editingMember ? 'Cập nhật' : 'Thêm nhân sự'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PILLAR EDIT / ADD MODAL */}
      {isPillarModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 relative animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {editingPillar ? 'Sửa Mục Hoạt Động' : 'Thêm Mục Hoạt Động Trụ Cột Mới'}
              </h3>
              <button
                onClick={() => setIsPillarModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 font-extrabold text-xs text-slate-700 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePillar} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề trụ cột (*)</label>
                <input
                  type="text"
                  required
                  value={pilTitle}
                  onChange={(e) => setPilTitle(e.target.value)}
                  placeholder="VD: Tập hợp Khối Đại Đoàn Kết"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả nội dung (*)</label>
                <textarea
                  rows={3}
                  required
                  value={pilDesc}
                  onChange={(e) => setPilDesc(e.target.value)}
                  placeholder="Mô tả chức năng nhiệm vụ..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPillarModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md"
                >
                  {editingPillar ? 'Cập nhật' : 'Thêm mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
