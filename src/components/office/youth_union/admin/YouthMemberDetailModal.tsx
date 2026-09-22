import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Edit3, 
  Award, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  CreditCard, 
  Star, 
  QrCode, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  CheckCircle2, 
  Check,
  Flame, 
  TrendingUp, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Layers, 
  BookOpen, 
  UserCheck, 
  FileText,
  Sparkles,
  Heart
} from 'lucide-react';
import { 
  YouthMember, 
  EmulationAwardItem, 
  TrainingHistoryItem, 
  saveStoredYouthMembers, 
  loadStoredYouthMembers 
} from '../youthUnionData';
import { VerifiedCultureImage } from '../../../cultural/VerifiedCultureImage';

interface Props {
  member: YouthMember;
  onClose: () => void;
  onEdit: (member: YouthMember) => void;
  onUpdateMember: (updatedMember: YouthMember) => void;
  onNotify: (msg: string) => void;
}

export const YouthMemberDetailModal: React.FC<Props> = ({
  member,
  onClose,
  onEdit,
  onUpdateMember,
  onNotify
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'training' | 'awards'>('profile');
  
  // Real-time Award Creation Form State
  const [isAwardingModalOpen, setIsAwardingModalOpen] = useState(false);
  const [newAwardTitle, setNewAwardTitle] = useState('');
  const [newAwardCategory, setNewAwardCategory] = useState<EmulationAwardItem['category']>('DANH HIỆU');
  const [newAwardLevel, setNewAwardLevel] = useState<EmulationAwardItem['level']>('CẤP PHƯỜNG');
  const [newAwardDecision, setNewAwardDecision] = useState(`QĐ-${Math.floor(Math.random() * 90 + 10)}/QĐ-ĐTN`);
  const [newAwardDate, setNewAwardDate] = useState(new Date().toLocaleDateString('vi-VN'));
  const [newAwardBy, setNewAwardBy] = useState('BCH Đoàn Phường Chánh Hiệp');
  const [newAwardNote, setNewAwardNote] = useState('');

  // Real-time Training History Form State
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [newTrainYear, setNewTrainYear] = useState(2026);
  const [newTrainPeriod, setNewTrainPeriod] = useState('Năm 2026 (Bổ sung)');
  const [newTrainScore, setNewTrainScore] = useState(90);
  const [newTrainRanking, setNewTrainRanking] = useState<TrainingHistoryItem['ranking']>('XUẤT SẮC');
  const [newTrainEval, setNewTrainEval] = useState('Gương mẫu tham gia đầy đủ các phong trào xung kích và tình nguyện.');
  const [newTrainReviewer, setNewTrainReviewer] = useState('BCH Chi đoàn');

  // Real-time Handler: Add Emulation Award
  const handleAddAward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAwardTitle.trim()) {
      alert('Vui lòng nhập tên danh hiệu / khen thưởng!');
      return;
    }

    const awardItem: EmulationAwardItem = {
      id: 'award_' + Date.now(),
      title: newAwardTitle.trim(),
      category: newAwardCategory,
      level: newAwardLevel,
      decisionNumber: newAwardDecision.trim(),
      awardedDate: newAwardDate.trim(),
      awardedBy: newAwardBy.trim(),
      note: newAwardNote.trim() || undefined
    };

    const currentAwards = member.emulationAwards || [];
    const updatedAwards = [awardItem, ...currentAwards];

    const updatedMember: YouthMember = {
      ...member,
      emulationAwards: updatedAwards,
      updatedAt: new Date().toLocaleDateString('vi-VN')
    };

    // Update in Storage
    const allMembers = loadStoredYouthMembers();
    const nextList = allMembers.map(m => m.id === member.id ? updatedMember : m);
    saveStoredYouthMembers(nextList);

    onUpdateMember(updatedMember);
    onNotify(`✨ Đã trao tặng và cập nhật danh hiệu thi đua: "${awardItem.title}" cho đoàn viên ${member.fullName}!`);
    
    // Reset Form
    setNewAwardTitle('');
    setNewAwardNote('');
    setIsAwardingModalOpen(false);
  };

  // Real-time Handler: Delete Award
  const handleDeleteAward = (awardId: string, awardTitle: string) => {
    if (!confirm(`Bạn có chắc muốn xóa danh hiệu "${awardTitle}" khỏi hồ sơ đoàn viên?`)) return;

    const currentAwards = member.emulationAwards || [];
    const updatedAwards = currentAwards.filter(a => a.id !== awardId);

    const updatedMember: YouthMember = {
      ...member,
      emulationAwards: updatedAwards,
      updatedAt: new Date().toLocaleDateString('vi-VN')
    };

    const allMembers = loadStoredYouthMembers();
    const nextList = allMembers.map(m => m.id === member.id ? updatedMember : m);
    saveStoredYouthMembers(nextList);

    onUpdateMember(updatedMember);
    onNotify(`Đã thu hồi/xóa danh hiệu: ${awardTitle}`);
  };

  // Real-time Handler: Add Training History Period
  const handleAddTrainingRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const item: TrainingHistoryItem = {
      year: newTrainYear,
      period: newTrainPeriod.trim() || `Năm ${newTrainYear}`,
      score: Number(newTrainScore) || 85,
      ranking: newTrainRanking,
      evaluation: newTrainEval.trim(),
      reviewer: newTrainReviewer.trim(),
      reviewedAt: new Date().toLocaleDateString('vi-VN')
    };

    const currentHistory = member.trainingHistory || [];
    const updatedHistory = [item, ...currentHistory.filter(h => h.year !== item.year)].sort((a, b) => b.year - a.year);

    const updatedMember: YouthMember = {
      ...member,
      trainingHistory: updatedHistory,
      trainingScore: item.year === 2026 ? item.score : member.trainingScore,
      emulationRanking: item.year === 2026 ? item.ranking : member.emulationRanking,
      updatedAt: new Date().toLocaleDateString('vi-VN')
    };

    const allMembers = loadStoredYouthMembers();
    const nextList = allMembers.map(m => m.id === member.id ? updatedMember : m);
    saveStoredYouthMembers(nextList);

    onUpdateMember(updatedMember);
    onNotify(`Đã cập nhật kết quả rèn luyện năm ${item.year} (${item.score} điểm - ${item.ranking})!`);
    setIsTrainingModalOpen(false);
  };

  const getAwardLevelColor = (level: EmulationAwardItem['level']) => {
    switch (level) {
      case 'TRUNG ƯƠNG':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'CẤP TỈNH':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'CẤP THÀNH PHỐ':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  const awards = member.emulationAwards || [];
  const trainingHistory = member.trainingHistory || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in my-6 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-20 h-24 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white/50 shadow-md shrink-0">
              {member.avatarUrl ? (
                <VerifiedCultureImage
                  src={member.avatarUrl}
                  alt={member.fullName}
                  showBadge={false}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-black text-2xl">
                  {member.fullName.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
                  {member.memberCode}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                  <ShieldCheck className="w-3 h-3" />
                  <span>SỔ ĐOÀN ĐÃ XÁC THỰC SỐ HÓA</span>
                </span>
                {member.partyTarget && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                    <Star className="w-3 h-3 fill-white" />
                    <span>CẢM TÌNH ĐẢNG</span>
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{member.fullName}</h3>
              <p className="text-xs text-blue-100 font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                <span>{member.position}</span>
                <span>•</span>
                <span>{member.branchName}</span>
                {member.workGroupName && (
                  <>
                    <span>•</span>
                    <span className="text-amber-200 font-bold">{member.workGroupName} ({member.workGroupRole || 'Thành viên'})</span>
                  </>
                )}
              </p>
            </div>

            {/* Verification QR Badge */}
            <div className="hidden md:flex flex-col items-center bg-white/10 backdrop-blur-xs p-2.5 rounded-2xl border border-white/20 text-center shrink-0">
              <div className="w-14 h-14 bg-white rounded-xl p-1 flex items-center justify-center shadow-xs">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
              <span className="text-[9px] font-black text-blue-100 mt-1 uppercase">Xác thực số</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-5 pt-3 border-t border-white/15 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'profile' ? 'bg-white text-blue-900 shadow-xs' : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Hồ sơ & Lý lịch Đoàn</span>
            </button>

            <button
              onClick={() => setActiveTab('training')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'training' ? 'bg-white text-blue-900 shadow-xs' : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Lịch sử rèn luyện ({trainingHistory.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('awards')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'awards' ? 'bg-white text-blue-900 shadow-xs' : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Danh hiệu thi đua & Khen thưởng ({awards.length})</span>
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
          
          {/* TAB 1: PROFILE & UNION RECORD */}
          {activeTab === 'profile' && (
            <div className="space-y-5 animate-fade-in">
              {/* Union Joining & Political Milestone Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100/90 shadow-2xs">
                <div className="flex items-center gap-2 mb-2 text-blue-900 font-black text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Hồ sơ kết nạp & Lịch sử sinh hoạt Đoàn</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-blue-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Ngày vào Đoàn</span>
                    <span className="font-black text-blue-900 text-sm">{member.joinedDate}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-blue-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Nơi kết nạp</span>
                    <span className="font-bold text-slate-800 truncate block">{member.joinedPlace}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-blue-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Số Nghị quyết chuẩn y</span>
                    <span className="font-semibold text-slate-800">{member.unionResolutionNumber || 'NQ-KN/ĐP-2020-01'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-blue-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Người / Tổ chức giới thiệu</span>
                    <span className="font-semibold text-slate-800">{member.recommender || 'Ban Chấp hành Chi đoàn'}</span>
                  </div>
                </div>
              </div>

              {/* Personal Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Thông tin cá nhân & Liên hệ</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-medium flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Ngày sinh & Giới tính:</span>
                      <span className="font-bold text-slate-800">{member.birthDate} ({member.gender})</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-medium flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Số điện thoại:</span>
                      <span className="font-bold text-blue-600">{member.phone}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-medium flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Thư điện tử:</span>
                      <span className="font-semibold text-slate-800">{member.email}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-medium flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Địa chỉ cư trú:</span>
                      <span className="font-semibold text-slate-800 text-right max-w-[220px]">{member.address}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-400 font-medium">Dân tộc & Tôn giáo:</span>
                      <span className="font-bold text-slate-800">{member.ethnic} / {member.religion}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                    <span>Học vấn, Nghề nghiệp & Nhiệm vụ</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-medium flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> Trình độ học vấn:</span>
                      <span className="font-bold text-slate-800">{member.educationLevel}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-medium flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> Nghề nghiệp / Đơn vị:</span>
                      <span className="font-bold text-slate-800">{member.profession}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-medium flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> Nhóm công tác:</span>
                      <span className="font-bold text-indigo-700">{member.workGroupName || 'Tổ Công nghệ số cộng đồng'}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-medium flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> Đoàn phí năm 2026:</span>
                      <span className={`font-black ${member.unionDuesStatus === 'PAID' ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {member.unionDuesStatus === 'PAID' ? 'Đã hoàn thành 100%' : 'Chưa đóng'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-400 font-medium flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> Ngày công tình nguyện:</span>
                      <span className="font-black text-amber-700">{member.volunteerDays || 6} ngày</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills and Strengths */}
              {member.skills && member.skills.length > 0 && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Kỹ năng & Năng khiếu sở trường</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.map((s, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold border border-blue-100 flex items-center gap-1">
                        <Check className="w-3 h-3 text-blue-600" />
                        <span>{s}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {member.notes && (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900">
                  <span className="font-black block mb-1">Ghi chú & Đánh giá của Chi ủy / Ban Chấp hành Chi đoàn:</span>
                  <p className="leading-relaxed font-medium">{member.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TRAINING HISTORY */}
          {activeTab === 'training' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div>
                  <h4 className="text-sm font-black text-slate-900">Quá trình rèn luyện đoàn viên qua các năm</h4>
                  <p className="text-xs text-slate-500">Đánh giá theo 5 tiêu chuẩn rèn luyện đoàn viên của Trung ương Đoàn</p>
                </div>
                <button
                  onClick={() => setIsTrainingModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Cập nhật mốc rèn luyện mới</span>
                </button>
              </div>

              {trainingHistory.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
                  <TrendingUp className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">Chưa có dữ liệu lịch sử rèn luyện</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {trainingHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col items-center justify-center font-black shrink-0 shadow-2xs">
                          <span className="text-xs">{item.year}</span>
                          <span className="text-[10px] opacity-80">{item.score}đ</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-black text-slate-900">{item.period}</h5>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              item.ranking === 'XUẤT SẮC' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              {item.ranking}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{item.evaluation}</p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Người đánh giá: <strong className="text-slate-700">{item.reviewer}</strong> • Ngày duyệt: {item.reviewedAt}
                          </p>
                        </div>
                      </div>

                      <div className="w-full sm:w-32 shrink-0">
                        <div className="flex justify-between text-[11px] font-bold mb-1">
                          <span className="text-slate-500">Điểm rèn luyện</span>
                          <span className="text-blue-700">{item.score}/100</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EMULATION AWARDS & HONORS */}
          {activeTab === 'awards' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-amber-500 to-amber-600 p-4 rounded-2xl text-white shadow-xs">
                <div>
                  <h4 className="text-sm font-black flex items-center gap-2">
                    <Award className="w-4 h-4 text-white" />
                    <span>Bộ Sưu Tập Danh Hiệu Thi Đua & Khen Thưởng</span>
                  </h4>
                  <p className="text-xs text-amber-100 font-medium">Cập nhật và trao tặng danh hiệu theo thời gian thực</p>
                </div>
                <button
                  onClick={() => setIsAwardingModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-900 text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-700" />
                  <span>Trao tặng / Bổ sung Danh hiệu mới</span>
                </button>
              </div>

              {awards.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                  <Award className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">Chưa có danh hiệu thi đua nào được ghi nhận</p>
                  <button
                    onClick={() => setIsAwardingModalOpen(true)}
                    className="mt-3 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100"
                  >
                    + Trao danh hiệu đầu tiên
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {awards.map((award) => (
                    <div
                      key={award.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase border ${getAwardLevelColor(award.level)}`}>
                            {award.level}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {award.category}
                          </span>
                        </div>

                        <h5 className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition">
                          {award.title}
                        </h5>

                        <div className="mt-2 space-y-1 text-xs text-slate-600">
                          <p className="flex items-center gap-1 font-medium">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>Đơn vị trao: <strong className="text-slate-800">{award.awardedBy}</strong></span>
                          </p>
                          <p className="flex items-center gap-1 text-[11px] text-slate-500">
                            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>Số QĐ: {award.decisionNumber} • Ngày: {award.awardedDate}</span>
                          </p>
                          {award.note && (
                            <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-xl mt-1">
                              "{award.note}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Đã ghi nhận vào Hồ sơ Đoàn</span>
                        </span>
                        <button
                          onClick={() => handleDeleteAward(award.id, award.title)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Xóa danh hiệu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            Hồ sơ cập nhật lần cuối: <strong className="text-slate-800">{member.updatedAt || 'Hôm nay'}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In Hồ Sơ & Thẻ Đoàn</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onEdit(member);
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Edit3 className="w-4 h-4" />
              <span>Chỉnh Sửa Hồ Sơ Chi Tiết</span>
            </button>
          </div>
        </div>

      </div>

      {/* POPUP: TRAO TẶNG DANH HIỆU THI ĐUA THEO THỜI GIAN THỰC */}
      {isAwardingModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-sm">
                <Award className="w-5 h-5" />
                <span>Trao Tặng / Ghi Nhận Danh Hiệu Thi Đua</span>
              </div>
              <button onClick={() => setIsAwardingModalOpen(false)} className="p-1 text-white hover:bg-white/20 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAward} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên Danh hiệu / Khen thưởng (*)</label>
                <input
                  type="text"
                  required
                  value={newAwardTitle}
                  onChange={(e) => setNewAwardTitle(e.target.value)}
                  placeholder="VD: Thanh niên tiên tiến làm theo lời Bác"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loại khen thưởng</label>
                  <select
                    value={newAwardCategory}
                    onChange={(e) => setNewAwardCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="DANH HIỆU">Danh hiệu thi đua</option>
                    <option value="GIẤY KHEN">Giấy khen</option>
                    <option value="BẰNG KHEN">Bằng khen</option>
                    <option value="KỶ NIỆM CHƯƠNG">Kỷ niệm chương</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cấp khen thưởng</label>
                  <select
                    value={newAwardLevel}
                    onChange={(e) => setNewAwardLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="CẤP PHƯỜNG">Cấp Phường</option>
                    <option value="CẤP THÀNH PHỐ">Cấp Thành phố</option>
                    <option value="CẤP TỈNH">Cấp Tỉnh</option>
                    <option value="TRUNG ƯƠNG">Trung ương Đoàn</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số Quyết Định</label>
                  <input
                    type="text"
                    value={newAwardDecision}
                    onChange={(e) => setNewAwardDecision(e.target.value)}
                    placeholder="VD: QĐ-24/QĐ-ĐTN"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày Khen Thưởng</label>
                  <input
                    type="text"
                    value={newAwardDate}
                    onChange={(e) => setNewAwardDate(e.target.value)}
                    placeholder="VD: 26/03/2026"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đơn vị ban hành / Trao tặng</label>
                <input
                  type="text"
                  value={newAwardBy}
                  onChange={(e) => setNewAwardBy(e.target.value)}
                  placeholder="VD: Ban Chấp hành Đoàn Phường Chánh Hiệp"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú thành tích</label>
                <textarea
                  rows={2}
                  value={newAwardNote}
                  onChange={(e) => setNewAwardNote(e.target.value)}
                  placeholder="Mô tả tóm tắt thành tích xuất sắc..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAwardingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Xác nhận Trao tặng</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP: THÊM MỐC RÈN LUYỆN THEO NĂM */}
      {isTrainingModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-sm">
                <TrendingUp className="w-5 h-5" />
                <span>Cập Nhật Mốc Rèn Luyện Đoàn Viên</span>
              </div>
              <button onClick={() => setIsTrainingModalOpen(false)} className="p-1 text-white hover:bg-white/20 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTrainingRecord} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Năm đánh giá</label>
                  <input
                    type="number"
                    value={newTrainYear}
                    onChange={(e) => setNewTrainYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Điểm rèn luyện (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={newTrainScore}
                    onChange={(e) => setNewTrainScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Xếp loại rèn luyện</label>
                <select
                  value={newTrainRanking}
                  onChange={(e) => setNewTrainRanking(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                >
                  <option value="XUẤT SẮC">Xuất sắc</option>
                  <option value="KHÁ">Khá</option>
                  <option value="TRUNG BÌNH">Trung bình</option>
                  <option value="CHƯA XẾP LOẠI">Chưa xếp loại</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nhận xét của Chi đoàn</label>
                <textarea
                  rows={2}
                  value={newTrainEval}
                  onChange={(e) => setNewTrainEval(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cơ quan đánh giá</label>
                <input
                  type="text"
                  value={newTrainReviewer}
                  onChange={(e) => setNewTrainReviewer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTrainingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu Kết Quả</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
