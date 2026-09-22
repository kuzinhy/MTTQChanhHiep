import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Save, 
  BookOpen, 
  Calendar, 
  Award, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Check, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  Star, 
  Layers 
} from 'lucide-react';
import { 
  YouthMember, 
  BranchInfo, 
  TrainingHistoryItem, 
  EmulationAwardItem,
  getDefaultTrainingHistory,
  getDefaultEmulationAwards
} from '../youthUnionData';

interface Props {
  member: YouthMember | null; // null if creating new
  branches: BranchInfo[];
  defaultBranchId?: string;
  totalMembersCount: number;
  onClose: () => void;
  onSave: (member: YouthMember) => void;
}

export const YouthMemberFormModal: React.FC<Props> = ({
  member,
  branches,
  defaultBranchId,
  totalMembersCount,
  onClose,
  onSave
}) => {
  const [formActiveTab, setFormActiveTab] = useState<'basic' | 'union' | 'workgroup' | 'awards'>('basic');

  // Basic Info State
  const [fullName, setFullName] = useState(member?.fullName || '');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>(member?.gender || 'Nam');
  const [birthDate, setBirthDate] = useState(member?.birthDate || '15/05/2004');
  const [branchId, setBranchId] = useState(member?.branchId || defaultBranchId || branches[0]?.id || 'kp1');
  const [position, setPosition] = useState<YouthMember['position']>(member?.position || 'Đoàn viên');
  const [phone, setPhone] = useState(member?.phone || '');
  const [email, setEmail] = useState(member?.email || '');
  const [address, setAddress] = useState(member?.address || 'Phường Chánh Hiệp, TP. Thủ Dầu Một, Bình Dương');
  const [educationLevel, setEducationLevel] = useState(member?.educationLevel || 'Đại học');
  const [profession, setProfession] = useState(member?.profession || 'Sinh viên');
  const [ethnic, setEthnic] = useState(member?.ethnic || 'Kinh');
  const [religion, setReligion] = useState(member?.religion || 'Không');
  const [avatarUrl, setAvatarUrl] = useState(member?.avatarUrl || '');
  const [skillsText, setSkillsText] = useState(member?.skills?.join(', ') || 'Chuyển đổi số, Tình nguyện cơ sở');

  // Union Joining & Political State
  const [joinedDate, setJoinedDate] = useState(member?.joinedDate || '26/03/2020');
  const [joinedPlace, setJoinedPlace] = useState(member?.joinedPlace || 'Đoàn trường THCS Chánh Hiệp');
  const [unionResolutionNumber, setUnionResolutionNumber] = useState(member?.unionResolutionNumber || `NQ-KN/2020-0${totalMembersCount + 1}`);
  const [recommender, setRecommender] = useState(member?.recommender || 'Ban Chấp hành Chi đoàn');
  const [status, setStatus] = useState<YouthMember['status']>(member?.status || 'ACTIVE');
  const [unionDuesStatus, setUnionDuesStatus] = useState<YouthMember['unionDuesStatus']>(member?.unionDuesStatus || 'PAID');
  const [emulationRanking, setEmulationRanking] = useState<YouthMember['emulationRanking']>(member?.emulationRanking || 'XUẤT SẮC');
  const [partyTarget, setPartyTarget] = useState(member?.partyTarget || false);
  const [partyTargetDate, setPartyTargetDate] = useState(member?.partyTargetDate || (member?.partyTarget ? '19/05/2025' : ''));
  const [notes, setNotes] = useState(member?.notes || '');

  // Work Group State
  const [workGroupId, setWorkGroupId] = useState(member?.workGroupId || 'wg_001');
  const [workGroupName, setWorkGroupName] = useState(member?.workGroupName || 'Tổ Công nghệ số cộng đồng');
  const [workGroupRole, setWorkGroupRole] = useState<YouthMember['workGroupRole']>(member?.workGroupRole || 'THÀNH VIÊN');
  const [trainingScore, setTrainingScore] = useState<number>(member?.trainingScore ?? 88);
  const [volunteerDays, setVolunteerDays] = useState<number>(member?.volunteerDays ?? 6);
  const [meetingAttendance, setMeetingAttendance] = useState<number>(member?.meetingAttendance ?? 11);

  // Dynamic Awards & Training History State
  const [emulationAwards, setEmulationAwards] = useState<EmulationAwardItem[]>(() => {
    if (member?.emulationAwards && member.emulationAwards.length > 0) return member.emulationAwards;
    return member ? getDefaultEmulationAwards(member) : [];
  });

  const [trainingHistory, setTrainingHistory] = useState<TrainingHistoryItem[]>(() => {
    if (member?.trainingHistory && member.trainingHistory.length > 0) return member.trainingHistory;
    return member ? getDefaultTrainingHistory(member) : [
      {
        year: 2026,
        period: 'Năm 2026',
        score: 88,
        ranking: 'XUẤT SẮC',
        evaluation: 'Tích cực tham gia các phong trào thanh niên tình nguyện.',
        reviewer: 'BCH Chi đoàn',
        reviewedAt: new Date().toLocaleDateString('vi-VN')
      }
    ];
  });

  // Quick form state to append award
  const [tempAwardTitle, setTempAwardTitle] = useState('');
  const [tempAwardCategory, setTempAwardCategory] = useState<EmulationAwardItem['category']>('DANH HIỆU');
  const [tempAwardLevel, setTempAwardLevel] = useState<EmulationAwardItem['level']>('CẤP PHƯỜNG');
  const [tempAwardDecision, setTempAwardDecision] = useState(`QĐ-26/QĐ-ĐTN`);
  const [tempAwardDate, setTempAwardDate] = useState(new Date().toLocaleDateString('vi-VN'));
  const [tempAwardBy, setTempAwardBy] = useState('BCH Đoàn Phường Chánh Hiệp');

  const handleAddTempAward = () => {
    if (!tempAwardTitle.trim()) {
      alert('Vui lòng nhập tên danh hiệu thi đua!');
      return;
    }
    const item: EmulationAwardItem = {
      id: 'aw_' + Date.now(),
      title: tempAwardTitle.trim(),
      category: tempAwardCategory,
      level: tempAwardLevel,
      decisionNumber: tempAwardDecision.trim(),
      awardedDate: tempAwardDate.trim(),
      awardedBy: tempAwardBy.trim()
    };
    setEmulationAwards([item, ...emulationAwards]);
    setTempAwardTitle('');
  };

  const handleRemoveAward = (id: string) => {
    setEmulationAwards(emulationAwards.filter(a => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert('Vui lòng nhập họ và tên đoàn viên!');
      return;
    }

    const branchObj = branches.find(b => b.id === branchId);
    const branchName = branchObj ? branchObj.name : 'Chi đoàn Cơ sở';
    const skills = skillsText.split(',').map(s => s.trim()).filter(Boolean);

    const savedRecord: YouthMember = {
      id: member?.id || ('ym_' + Date.now()),
      memberCode: member?.memberCode || `ĐV-CH-2026-${String(totalMembersCount + 1).padStart(3, '0')}`,
      fullName: fullName.trim(),
      gender,
      birthDate: birthDate.trim(),
      branchId,
      branchName,
      position,
      joinedDate: joinedDate.trim(),
      joinedPlace: joinedPlace.trim(),
      unionResolutionNumber: unionResolutionNumber.trim(),
      recommender: recommender.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      educationLevel: educationLevel.trim(),
      profession: profession.trim(),
      ethnic: ethnic.trim(),
      religion: religion.trim(),
      status,
      unionDuesStatus,
      unionBookStatus: 'DIGITAL_VERIFIED',
      avatarUrl: avatarUrl.trim() || undefined,
      skills,
      emulationRanking,
      partyTarget,
      partyTargetDate: partyTarget ? partyTargetDate.trim() : undefined,
      partyStatus: partyTarget ? 'CẢM TÌNH ĐẢNG' : 'CHƯA',
      workGroupId,
      workGroupName,
      workGroupRole,
      trainingScore: Number(trainingScore) || 85,
      volunteerDays: Number(volunteerDays) || 6,
      meetingAttendance: Number(meetingAttendance) || 10,
      trainingHistory,
      emulationAwards,
      notes: notes.trim() || undefined,
      updatedAt: new Date().toLocaleDateString('vi-VN')
    };

    onSave(savedRecord);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in my-6 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                {member ? 'Cập Nhật Hồ Sơ Đoàn Viên Chi Tiết' : 'Tạo Hồ Sơ Đoàn Viên Mới & Cấp Sổ Đoàn Số'}
              </h3>
              <p className="text-[11px] text-blue-100 font-medium">Hệ thống cơ sở dữ liệu số hóa Đoàn TNCS Hồ Chí Minh Phường Chánh Hiệp</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 text-white transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-100 px-5 py-2 border-b border-slate-200/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          {[
            { id: 'basic', label: '1. Cá nhân & Liên hệ', icon: Users },
            { id: 'union', label: '2. Vào Đoàn & Chính trị', icon: BookOpen },
            { id: 'workgroup', label: '3. Nhóm công tác & Rèn luyện', icon: Layers },
            { id: 'awards', label: `4. Danh hiệu thi đua (${emulationAwards.length})`, icon: Award },
          ].map(tab => {
            const isActive = formActiveTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFormActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  isActive ? 'bg-white text-blue-700 shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs text-slate-700">
          
          {/* TAB 1: BASIC & CONTACT */}
          {formActiveTab === 'basic' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-800 mb-1">Họ và Tên Đoàn Viên (*)</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="VD: Nguyễn Văn Hùng"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giới Tính</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày Sinh (dd/mm/yyyy)</label>
                  <input
                    type="text"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    placeholder="VD: 15/05/2004"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chi Đoàn Sinh Hoạt (*)</label>
                  <select
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chức Vụ Trong Đoàn</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="Đoàn viên">Đoàn viên</option>
                    <option value="Bí thư Chi đoàn">Bí thư Chi đoàn</option>
                    <option value="Phó Bí thư Chi đoàn">Phó Bí thư Chi đoàn</option>
                    <option value="Ủy viên BCH Chi đoàn">Ủy viên BCH Chi đoàn</option>
                    <option value="Tổ trưởng Tổ thanh niên">Tổ trưởng Tổ thanh niên</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số Điện Thoại</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="VD: 0912.345.678"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thư Điện Tử (Email)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="VD: doanvien@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trình Độ Học Vấn</label>
                  <input
                    type="text"
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    placeholder="VD: Đại học, Cao đẳng, 12/12..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nghề Nghiệp / Đơn Vị Công Tác</label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="VD: Sinh viên ĐH Thủ Dầu Một"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Địa Chỉ Thường Trú / Tạm Trú</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="VD: Số 12, đường Lê Chí Dân, KP1, P. Chánh Hiệp"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dân Tộc</label>
                  <input
                    type="text"
                    value={ethnic}
                    onChange={(e) => setEthnic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tôn Giáo</label>
                  <input
                    type="text"
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Ảnh Đại Diện (URL Hình Thẻ Đoàn)</label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Kỹ Năng / Sở Trường (cách nhau bằng dấu phẩy)</label>
                  <input
                    type="text"
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    placeholder="VD: Chuyển đổi số, Tình nguyện, MC, Nhiếp ảnh"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UNION JOINING & POLITICAL RECORD */}
          {formActiveTab === 'union' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100">
                <h4 className="font-black text-blue-900 text-xs mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Hồ sơ kết nạp Đoàn TNCS Hồ Chí Minh</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ngày Vào Đoàn (dd/mm/yyyy) (*)</label>
                    <input
                      type="text"
                      required
                      value={joinedDate}
                      onChange={(e) => setJoinedDate(e.target.value)}
                      placeholder="VD: 26/03/2020"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-blue-200 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nơi Kết Nạp Đoàn (*)</label>
                    <input
                      type="text"
                      required
                      value={joinedPlace}
                      onChange={(e) => setJoinedPlace(e.target.value)}
                      placeholder="VD: Đoàn trường THCS Chánh Hiệp"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-blue-200 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số Nghị Quyết Chuẩn Y Kết Nạp</label>
                    <input
                      type="text"
                      value={unionResolutionNumber}
                      onChange={(e) => setUnionResolutionNumber(e.target.value)}
                      placeholder="VD: NQ-08/QĐ-ĐTN"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-blue-200 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Người / Tổ Chức Giới Thiệu</label>
                    <input
                      type="text"
                      value={recommender}
                      onChange={(e) => setRecommender(e.target.value)}
                      placeholder="VD: Ban Chấp hành Chi đoàn"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-blue-200 font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trạng Thái Sinh Hoạt</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="ACTIVE">Đang sinh hoạt</option>
                    <option value="COMMENDED">Đoàn viên ưu tú</option>
                    <option value="TRANSFER_IN">Chuyển đến</option>
                    <option value="TRANSFER_OUT">Chuyển đi</option>
                    <option value="DEFERRED">Tạm hoãn sinh hoạt</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đoàn Phí Năm 2026</label>
                  <select
                    value={unionDuesStatus}
                    onChange={(e) => setUnionDuesStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="PAID">Đã hoàn thành 100%</option>
                    <option value="UNPAID">Chưa nộp</option>
                    <option value="EXEMPT">Miễn giảm</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Xếp Loại Thi Đua 2026</label>
                  <select
                    value={emulationRanking}
                    onChange={(e) => setEmulationRanking(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="XUẤT SẮC">Xuất sắc</option>
                    <option value="KHÁ">Khá</option>
                    <option value="TRUNG BÌNH">Trung bình</option>
                    <option value="CHƯA XẾP LOẠI">Chưa xếp loại</option>
                  </select>
                </div>
              </div>

              {/* Party Target Checkbox */}
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-rose-900">
                  <input
                    type="checkbox"
                    checked={partyTarget}
                    onChange={(e) => setPartyTarget(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span>Đoàn viên ưu tú / Đối tượng bồi dưỡng kết nạp Đảng</span>
                </label>
                {partyTarget && (
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-rose-200">
                    <div>
                      <label className="block font-bold text-rose-800 mb-1">Ngày Công Nhận Cảm Tình Đảng</label>
                      <input
                        type="text"
                        value={partyTargetDate}
                        onChange={(e) => setPartyTargetDate(e.target.value)}
                        placeholder="VD: 19/05/2025"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 font-semibold"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi Chú & Nhận Xét Của Chi Đoàn</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ghi chú đánh giá về phẩm chất, kỷ luật, đóng góp..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                />
              </div>
            </div>
          )}

          {/* TAB 3: WORK GROUP & TRAINING */}
          {formActiveTab === 'workgroup' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tổ / Nhóm Công Tác Phụ Trách</label>
                  <select
                    value={workGroupName}
                    onChange={(e) => {
                      setWorkGroupName(e.target.value);
                      if (e.target.value.includes('Công nghệ')) setWorkGroupId('wg_001');
                      else if (e.target.value.includes('Tình nguyện')) setWorkGroupId('wg_002');
                      else if (e.target.value.includes('Văn hóa')) setWorkGroupId('wg_003');
                      else if (e.target.value.includes('Kinh tế')) setWorkGroupId('wg_004');
                      else setWorkGroupId('wg_005');
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="Tổ Công nghệ số cộng đồng">Tổ Công nghệ số cộng đồng</option>
                    <option value="Tổ Xung kích Tình nguyện vì Cộng đồng">Tổ Xung kích Tình nguyện vì Cộng đồng</option>
                    <option value="Tổ Văn hóa - Văn nghệ - Thể dục Thể thao">Tổ Văn hóa - Văn nghệ - Thể dục Thể thao</option>
                    <option value="Tổ Thanh niên Phát triển Kinh tế">Tổ Thanh niên Phát triển Kinh tế</option>
                    <option value="Tổ Tuyên truyền & Nắm bắt Dư luận Xã hội">Tổ Tuyên truyền & Nắm bắt Dư luận Xã hội</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vai Trò Trong Tổ / Nhóm</label>
                  <select
                    value={workGroupRole}
                    onChange={(e) => setWorkGroupRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="TRƯỞNG NHÓM">Tổ trưởng / Trưởng nhóm</option>
                    <option value="PHÓ NHÓM">Tổ phó / Phó nhóm</option>
                    <option value="THÀNH VIÊN">Thành viên nòng cốt</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Điểm Rèn Luyện Năm 2026 (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={trainingScore}
                    onChange={(e) => setTrainingScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số Ngày Tình Nguyện Đã Tham Gia</label>
                  <input
                    type="number"
                    min={0}
                    value={volunteerDays}
                    onChange={(e) => setVolunteerDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số Buổi Sinh Hoạt Chi Đoàn (trên 12)</label>
                  <input
                    type="number"
                    min={0}
                    max={12}
                    value={meetingAttendance}
                    onChange={(e) => setMeetingAttendance(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REAL-TIME EMULATION AWARDS */}
          {formActiveTab === 'awards' && (
            <div className="space-y-4 animate-fade-in">
              {/* Quick Append Form */}
              <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200">
                <h4 className="font-black text-amber-900 text-xs mb-2 flex items-center gap-1.5 uppercase">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Bổ sung danh hiệu thi đua / Khen thưởng mới</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={tempAwardTitle}
                      onChange={(e) => setTempAwardTitle(e.target.value)}
                      placeholder="Nhập tên danh hiệu (VD: Gương mặt trẻ tiêu biểu 2026)"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 font-semibold"
                    />
                  </div>

                  <div>
                    <select
                      value={tempAwardLevel}
                      onChange={(e) => setTempAwardLevel(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 font-semibold"
                    >
                      <option value="CẤP PHƯỜNG">Cấp Phường</option>
                      <option value="CẤP THÀNH PHỐ">Cấp Thành phố</option>
                      <option value="CẤP TỈNH">Cấp Tỉnh</option>
                      <option value="TRUNG ƯƠNG">Trung ương</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={tempAwardCategory}
                      onChange={(e) => setTempAwardCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 font-semibold"
                    >
                      <option value="DANH HIỆU">Danh hiệu</option>
                      <option value="GIẤY KHEN">Giấy khen</option>
                      <option value="BẰNG KHEN">Bằng khen</option>
                      <option value="KỶ NIỆM CHƯƠNG">Kỷ niệm chương</option>
                    </select>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={tempAwardDecision}
                      onChange={(e) => setTempAwardDecision(e.target.value)}
                      placeholder="Số QĐ (VD: QĐ-12/QĐ-ĐTN)"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 font-semibold"
                    />
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tempAwardDate}
                      onChange={(e) => setTempAwardDate(e.target.value)}
                      placeholder="Ngày khen"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 font-semibold"
                    />
                    <button
                      type="button"
                      onClick={handleAddTempAward}
                      className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl whitespace-nowrap cursor-pointer shadow-xs"
                    >
                      + Thêm
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Awards List */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-800 text-xs">Danh sách khen thưởng đã ghi nhận ({emulationAwards.length})</h5>
                {emulationAwards.length === 0 ? (
                  <p className="text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl">Chưa có danh hiệu nào được thêm</p>
                ) : (
                  emulationAwards.map((award) => (
                    <div
                      key={award.id}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900">{award.title}</span>
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-black">{award.level}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">{award.category}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Số QĐ: {award.decisionNumber} • Ngày trao: {award.awardedDate} • Đơn vị: {award.awardedBy}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAward(award.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition cursor-pointer"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{member ? 'Lưu & Cập Nhật Hồ Sơ' : 'Cấp Sổ Đoàn & Tạo Hồ Sơ'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
