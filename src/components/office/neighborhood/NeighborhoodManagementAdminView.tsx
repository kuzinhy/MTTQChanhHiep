import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Users, 
  Radio, 
  MessageSquare, 
  FileCheck, 
  Search, 
  Filter, 
  Plus, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Download, 
  ExternalLink, 
  ChevronRight, 
  X, 
  Sparkles, 
  ShieldAlert, 
  HeartHandshake, 
  Trash2, 
  Edit3, 
  Share2, 
  Bell, 
  Calendar, 
  Check, 
  Info,
  Layers,
  ArrowRight,
  TrendingUp,
  Megaphone,
  UserCheck
} from 'lucide-react';
import { OFFICIAL_21_NEIGHBORHOODS, NeighborhoodOfficialInfo } from '../../../data/neighborhoodsList';
import { 
  NeighborhoodHousehold, 
  NeighborhoodBroadcast, 
  NeighborhoodPetition, 
  NeighborhoodRegistration, 
  NeighborhoodCadre,
  INITIAL_CADRES 
} from '../../../data/neighborhoodManagementData';
import { AppStorageEngine } from '../../../lib/storage';
import { StaffUser } from '../../../types';

interface NeighborhoodManagementAdminViewProps {
  currentStaffUser?: StaffUser | null;
  onShowToast?: (title: string, message: string) => void;
  onNavigateToOpinions?: () => void;
  onNavigateToMap?: () => void;
}

export const NeighborhoodManagementAdminView: React.FC<NeighborhoodManagementAdminViewProps> = ({
  currentStaffUser,
  onShowToast,
  onNavigateToOpinions,
  onNavigateToMap
}) => {
  // Active Tab State
  const [activeTab, setActiveTab] = useState<
    'households' | 'broadcasts' | 'petitions' | 'registrations' | 'cadres' | 'analytics'
  >('households');

  // Filter States
  const isNeighborhoodLevel = currentStaffUser?.userLevel === 'NEIGHBORHOOD';
  const initialNeighborhoodId = isNeighborhoodLevel && currentStaffUser?.assignedNeighborhoodId 
    ? currentStaffUser.assignedNeighborhoodId 
    : 'ALL';

  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string>(initialNeighborhoodId);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Update selectedNeighborhoodId if staff changes (e.g. for testing)
  useEffect(() => {
    if (isNeighborhoodLevel && currentStaffUser?.assignedNeighborhoodId) {
      setSelectedNeighborhoodId(currentStaffUser.assignedNeighborhoodId);
    }
  }, [currentStaffUser, isNeighborhoodLevel]);

  // Core Data States
  const [households, setHouseholds] = useState<NeighborhoodHousehold[]>(() => 
    AppStorageEngine.getNeighborhoodHouseholds()
  );
  const [broadcasts, setBroadcasts] = useState<NeighborhoodBroadcast[]>(() => 
    AppStorageEngine.getNeighborhoodBroadcasts()
  );
  const [petitions, setPetitions] = useState<NeighborhoodPetition[]>(() => 
    AppStorageEngine.getNeighborhoodPetitions()
  );
  const [registrations, setRegistrations] = useState<NeighborhoodRegistration[]>(() => 
    AppStorageEngine.getNeighborhoodRegistrations()
  );
  const [cadres] = useState<NeighborhoodCadre[]>(INITIAL_CADRES);

  // Modals
  const [isAddHouseholdOpen, setIsAddHouseholdOpen] = useState(false);
  const [isComposeBroadcastOpen, setIsComposeBroadcastOpen] = useState(false);
  const [selectedPetitionForAction, setSelectedPetitionForAction] = useState<NeighborhoodPetition | null>(null);
  const [selectedRegForAction, setSelectedRegForAction] = useState<NeighborhoodRegistration | null>(null);
  const [selectedHouseholdDetail, setSelectedHouseholdDetail] = useState<NeighborhoodHousehold | null>(null);

  // New Household Form State
  const [newHousehold, setNewHousehold] = useState<Partial<NeighborhoodHousehold>>({
    neighborhoodId: 'area-kp-1',
    groupNumber: 'Tổ 1',
    headOfHousehold: '',
    cccd: '',
    phone: '',
    address: '',
    memberCount: 4,
    householdType: 'STANDARD',
    hasZalo: true,
    culturalFamilyStatus: 'ACHIEVED',
    notes: ''
  });

  // New Broadcast Form State
  const [newBroadcast, setNewBroadcast] = useState<{
    title: string;
    content: string;
    targetNeighborhoodId: string;
    priority: 'URGENT' | 'HIGH' | 'NORMAL';
    category: 'AN_NINH' | 'MOI_TRUONG' | 'AN_SINH' | 'SINH_HOAT' | 'THI_DUA';
    channels: ('ZALO' | 'SMS' | 'LOA_SO' | 'BANG_TIN')[];
  }>({
    title: '',
    content: '',
    targetNeighborhoodId: 'ALL',
    priority: 'NORMAL',
    category: 'SINH_HOAT',
    channels: ['ZALO', 'BANG_TIN']
  });

  // Petition Resolution Form State
  const [petitionResolutionText, setPetitionResolutionText] = useState('');
  const [petitionNewStatus, setPetitionNewStatus] = useState<NeighborhoodPetition['status']>('RESOLVED');

  // Registration Review Form State
  const [regAdminNote, setRegAdminNote] = useState('');
  const [regScheduledDate, setRegScheduledDate] = useState('');
  const [regNewStatus, setRegNewStatus] = useState<NeighborhoodRegistration['status']>('APPROVED');

  // Trigger Toast helper
  const notify = (title: string, msg: string) => {
    if (onShowToast) {
      onShowToast(title, msg);
    }
  };

  // Selected neighborhood object
  const currentNeighborhoodObj = useMemo(() => {
    if (selectedNeighborhoodId === 'ALL') return null;
    return OFFICIAL_21_NEIGHBORHOODS.find(n => n.id === selectedNeighborhoodId) || null;
  }, [selectedNeighborhoodId]);

  // Filtered Households
  const filteredHouseholds = useMemo(() => {
    return households.filter(h => {
      const matchKp = selectedNeighborhoodId === 'ALL' || h.neighborhoodId === selectedNeighborhoodId;
      const matchSearch = !searchQuery.trim() || 
        h.headOfHousehold.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.cccd.includes(searchQuery) ||
        h.phone.includes(searchQuery) ||
        h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.neighborhoodName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchKp && matchSearch;
    });
  }, [households, selectedNeighborhoodId, searchQuery]);

  // Filtered Petitions
  const filteredPetitions = useMemo(() => {
    return petitions.filter(p => {
      const matchKp = selectedNeighborhoodId === 'ALL' || p.neighborhoodId === selectedNeighborhoodId;
      const matchSearch = !searchQuery.trim() || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchKp && matchSearch;
    });
  }, [petitions, selectedNeighborhoodId, searchQuery]);

  // Filtered Registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter(r => {
      const matchKp = selectedNeighborhoodId === 'ALL' || r.neighborhoodId === selectedNeighborhoodId;
      const matchSearch = !searchQuery.trim() || 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchKp && matchSearch;
    });
  }, [registrations, selectedNeighborhoodId, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const totalHh = households.length;
    const policyHh = households.filter(h => h.householdType === 'POLICY').length;
    const poorHh = households.filter(h => h.householdType === 'POOR' || h.householdType === 'NEAR_POOR').length;
    const businessHh = households.filter(h => h.householdType === 'BUSINESS').length;
    
    const pendingPetitions = petitions.filter(p => p.status === 'RECEIVED' || p.status === 'VERIFYING' || p.status === 'RESOLVING').length;
    const resolvedPetitions = petitions.filter(p => p.status === 'RESOLVED').length;
    
    const pendingRegs = registrations.filter(r => r.status === 'PENDING').length;
    const approvedRegs = registrations.filter(r => r.status === 'APPROVED').length;

    const totalBroadcastsSent = broadcasts.length;
    const totalReach = broadcasts.reduce((acc, b) => acc + b.readCount, 0);

    return {
      totalHh,
      policyHh,
      poorHh,
      businessHh,
      pendingPetitions,
      resolvedPetitions,
      pendingRegs,
      approvedRegs,
      totalBroadcastsSent,
      totalReach
    };
  }, [households, petitions, registrations, broadcasts]);

  // Actions
  const handleSaveNewHousehold = () => {
    if (!newHousehold.headOfHousehold?.trim() || !newHousehold.phone?.trim()) {
      notify('Thiếu thông tin', 'Vui lòng nhập họ tên chủ hộ và số điện thoại liên lạc');
      return;
    }
    const neighborhood = OFFICIAL_21_NEIGHBORHOODS.find(n => n.id === newHousehold.neighborhoodId) || OFFICIAL_21_NEIGHBORHOODS[0];
    const created: NeighborhoodHousehold = {
      id: `hh-${Date.now()}`,
      neighborhoodId: neighborhood.id,
      neighborhoodName: neighborhood.name,
      groupNumber: newHousehold.groupNumber || 'Tổ 1',
      headOfHousehold: newHousehold.headOfHousehold.trim(),
      cccd: newHousehold.cccd || '',
      phone: newHousehold.phone.trim(),
      address: newHousehold.address || `Khu phố ${neighborhood.name}`,
      memberCount: Number(newHousehold.memberCount) || 3,
      householdType: newHousehold.householdType || 'STANDARD',
      hasZalo: !!newHousehold.hasZalo,
      culturalFamilyStatus: newHousehold.culturalFamilyStatus || 'ACHIEVED',
      notes: newHousehold.notes || '',
      updatedAt: new Date().toISOString().substring(0, 10)
    };

    const next = [created, ...households];
    setHouseholds(next);
    AppStorageEngine.saveNeighborhoodHouseholds(next);
    setIsAddHouseholdOpen(false);
    setNewHousehold({
      neighborhoodId: 'area-kp-1',
      groupNumber: 'Tổ 1',
      headOfHousehold: '',
      cccd: '',
      phone: '',
      address: '',
      memberCount: 4,
      householdType: 'STANDARD',
      hasZalo: true,
      culturalFamilyStatus: 'ACHIEVED',
      notes: ''
    });
    notify('Thành công', `Đã thêm hộ gia đình "${created.headOfHousehold}" thuộc ${created.neighborhoodName}`);
  };

  const handleSendBroadcast = () => {
    if (!newBroadcast.title.trim() || !newBroadcast.content.trim()) {
      notify('Thiếu thông tin', 'Vui lòng nhập tiêu đề và nội dung bản tin phát thanh');
      return;
    }
    const isAll = newBroadcast.targetNeighborhoodId === 'ALL';
    const targetKp = isAll 
      ? null 
      : OFFICIAL_21_NEIGHBORHOODS.find(n => n.id === newBroadcast.targetNeighborhoodId);

    const created: NeighborhoodBroadcast = {
      id: `bc-${Date.now()}`,
      title: newBroadcast.title.trim(),
      content: newBroadcast.content.trim(),
      targetNeighborhoodIds: isAll ? ['ALL'] : [newBroadcast.targetNeighborhoodId],
      targetNeighborhoodNames: isAll ? ['Toàn bộ 21 Khu phố Chánh Hiệp'] : [targetKp?.name || 'Khu phố'],
      priority: newBroadcast.priority,
      category: newBroadcast.category,
      channels: newBroadcast.channels.length > 0 ? newBroadcast.channels : ['ZALO', 'BANG_TIN'],
      senderName: 'Văn phòng MTTQ Phường Chánh Hiệp',
      sentAt: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
      readCount: isAll ? 11200 : 450,
      totalTargetCount: isAll ? 12850 : 620,
      status: 'SENT'
    };

    const next = [created, ...broadcasts];
    setBroadcasts(next);
    AppStorageEngine.saveNeighborhoodBroadcasts(next);
    setIsComposeBroadcastOpen(false);
    setNewBroadcast({
      title: '',
      content: '',
      targetNeighborhoodId: 'ALL',
      priority: 'NORMAL',
      category: 'SINH_HOAT',
      channels: ['ZALO', 'BANG_TIN']
    });
    notify('Đã phát thanh thông báo số', `Bản tin "${created.title}" đã được gửi tới ${created.targetNeighborhoodNames.join(', ')} qua các kênh số`);
  };

  const handleUpdatePetition = () => {
    if (!selectedPetitionForAction) return;
    const next = petitions.map(p => {
      if (p.id === selectedPetitionForAction.id) {
        return {
          ...p,
          status: petitionNewStatus,
          resolutionNote: petitionResolutionText || p.resolutionNote,
          resolutionDate: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
        };
      }
      return p;
    });
    setPetitions(next);
    AppStorageEngine.saveNeighborhoodPetitions(next);
    setSelectedPetitionForAction(null);
    notify('Đã cập nhật phản ánh', `Hồ sơ phản ánh ${selectedPetitionForAction.code} đã cập nhật sang trạng thái "${petitionNewStatus}"`);
  };

  const handleUpdateRegistration = () => {
    if (!selectedRegForAction) return;
    const next = registrations.map(r => {
      if (r.id === selectedRegForAction.id) {
        return {
          ...r,
          status: regNewStatus,
          adminNote: regAdminNote || r.adminNote,
          scheduledDate: regScheduledDate || r.scheduledDate
        };
      }
      return r;
    });
    setRegistrations(next);
    AppStorageEngine.saveNeighborhoodRegistrations(next);
    setSelectedRegForAction(null);
    notify('Đã duyệt hồ sơ đăng ký', `Hồ sơ ${selectedRegForAction.code} đã cập nhật trạng thái "${regNewStatus}"`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12 max-w-7xl mx-auto">
      
      {/* 1. TOP HEADER HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-6 sm:p-8 shadow-xl">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-amber-400/20 rounded-full blur-2xl translate-y-1/3 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-100 text-xs font-black tracking-wide uppercase shadow-xs">
              <Building2 className="w-3.5 h-3.5 text-amber-200" />
              <span>HỆ THỐNG SỐ HÓA ĐỊA BÀN 21 KHU PHỐ CHÁNH HIỆP</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-xs">
              Quản lý Khu phố Số (Khu Phố Thông Minh)
            </h1>
            <p className="text-sm text-amber-100/90 leading-relaxed font-medium">
              Trung tâm điều hành dữ liệu hộ dân, phát thanh số trực tiếp đến người dân qua Zalo/SMS/Loa số, 
              tiếp nhận xử lý phản ánh hiện trường và số hóa thủ tục đăng ký dân sinh cơ sở.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsComposeBroadcastOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white text-orange-700 hover:bg-amber-50 text-xs font-black shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Megaphone className="w-4 h-4 text-orange-600" />
              <span>Phát thanh & Gửi thông báo số</span>
            </button>

            <button
              onClick={() => setIsAddHouseholdOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-900/60 hover:bg-amber-900 text-white text-xs font-bold border border-amber-300/40 shadow-md hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Thêm Hộ dân mới</span>
            </button>
          </div>
        </div>

        {/* Selected Neighborhood Quick Stats Bar inside Banner */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="text-[11px] text-amber-200 font-semibold uppercase tracking-wider">Hộ dân được số hóa</div>
            <div className="text-2xl font-black text-white mt-0.5">12.850+</div>
            <div className="text-[10px] text-amber-200/80 mt-0.5">Phủ kín 21 khu phố</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="text-[11px] text-amber-200 font-semibold uppercase tracking-wider">Lượt tiếp cận thông báo</div>
            <div className="text-2xl font-black text-white mt-0.5">92.4%</div>
            <div className="text-[10px] text-amber-200/80 mt-0.5">Zalo Mini App & SMS</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="text-[11px] text-amber-200 font-semibold uppercase tracking-wider">Tỷ lệ giải quyết phản ánh</div>
            <div className="text-2xl font-black text-white mt-0.5">98.2%</div>
            <div className="text-[10px] text-amber-200/80 mt-0.5">Xử lý trung bình 24h</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="text-[11px] text-amber-200 font-semibold uppercase tracking-wider">Hồ sơ đăng ký dân sinh</div>
            <div className="text-2xl font-black text-white mt-0.5">100% Số hóa</div>
            <div className="text-[10px] text-amber-200/80 mt-0.5">Không cần nộp giấy</div>
          </div>
        </div>
      </div>

      {/* 2. FILTER & NEIGHBORHOOD SELECTOR BAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Neighborhood Select */}
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Chọn Khu phố trực thuộc phường Chánh Hiệp
            </label>
            <select
              value={selectedNeighborhoodId}
              onChange={(e) => setSelectedNeighborhoodId(e.target.value)}
              disabled={isNeighborhoodLevel}
              className={`w-full mt-0.5 font-bold text-slate-800 text-sm bg-transparent border-none focus:outline-none cursor-pointer ${isNeighborhoodLevel ? 'opacity-70 grayscale' : ''}`}
            >
              {!isNeighborhoodLevel && (
                <option value="ALL">🌟 Tất cả 21 Khu phố (Toàn bộ địa bàn phường Chánh Hiệp)</option>
              )}
              {OFFICIAL_21_NEIGHBORHOODS.map((nh) => {
                // If neighborhood level, only show the assigned one in the list (though select is disabled)
                if (isNeighborhoodLevel && nh.id !== currentStaffUser?.assignedNeighborhoodId) return null;
                return (
                  <option key={nh.id} value={nh.id}>
                    Khu phố {nh.name} — {nh.leaderPosition}: {nh.leaderName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full md:w-80 focus-within:bg-white focus-within:border-amber-500 transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Tìm chủ hộ, số điện thoại, CCCD, mã..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-800 focus:outline-none placeholder:text-slate-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 text-xs">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Cadre Banner if specific neighborhood selected */}
      {currentNeighborhoodObj && (
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
              {currentNeighborhoodObj.index}
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">
                Khu phố {currentNeighborhoodObj.name}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {currentNeighborhoodObj.leaderPosition}: <span className="font-bold text-amber-900">{currentNeighborhoodObj.leaderName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href={`tel:${currentNeighborhoodObj.phone}`}
              className="px-3 py-1.5 rounded-xl bg-white text-amber-800 hover:bg-amber-100 text-xs font-bold border border-amber-200 flex items-center gap-1.5 shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>Hotline: {currentNeighborhoodObj.phone}</span>
            </a>
            <button
              onClick={() => {
                setNewBroadcast(prev => ({
                  ...prev,
                  targetNeighborhoodId: currentNeighborhoodObj.id
                }));
                setIsComposeBroadcastOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi thông báo riêng</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('households')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 cursor-pointer ${
            activeTab === 'households'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Danh bạ Hộ dân ({filteredHouseholds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('broadcasts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 cursor-pointer ${
            activeTab === 'broadcasts'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Phát thanh & Thông báo số ({broadcasts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('petitions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 cursor-pointer ${
            activeTab === 'petitions'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Tiếp nhận Phản ánh của Dân ({filteredPetitions.length})</span>
          {stats.pendingPetitions > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
              {stats.pendingPetitions}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('registrations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 cursor-pointer ${
            activeTab === 'registrations'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Người dân Đăng ký ({filteredRegistrations.length})</span>
          {stats.pendingRegs > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center">
              {stats.pendingRegs}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('cadres')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 cursor-pointer ${
            activeTab === 'cadres'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>21 Ban điều hành Khu phố</span>
        </button>
      </div>

      {/* 4. TAB CONTENTS */}
      
      {/* 4.1 TAB: HOUSEHOLDS */}
      {activeTab === 'households' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Sổ bộ Quản lý Hộ dân ({filteredHouseholds.length} hộ hiển thị)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dữ liệu phân loại nhân khẩu, hộ chính sách, hộ kinh doanh và liên kết số điện thoại Zalo người dân
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const csvContent = "data:text/csv;charset=utf-8," + 
                    "Khu phố,Tổ,Chủ hộ,CCCD,Điện thoại,Địa chỉ,Số nhân khẩu,Diện đối tượng\n" +
                    filteredHouseholds.map(h => `"${h.neighborhoodName}","${h.groupNumber}","${h.headOfHousehold}","${h.cccd}","${h.phone}","${h.address}",${h.memberCount},"${h.householdType}"`).join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", `danh_sach_ho_dan_${selectedNeighborhoodId}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  notify('Xuất danh sách', 'Đã tải xuống file danh sách hộ dân');
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất Excel/CSV</span>
              </button>
              <button
                onClick={() => setIsAddHouseholdOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm hộ dân</span>
              </button>
            </div>
          </div>

          {/* Household Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHouseholds.map((hh) => {
              const typeColor = 
                hh.householdType === 'POLICY' ? 'bg-red-50 text-red-700 border-red-200' :
                hh.householdType === 'BUSINESS' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                hh.householdType === 'POOR' || hh.householdType === 'NEAR_POOR' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-blue-50 text-blue-700 border-blue-200';

              const typeLabel = 
                hh.householdType === 'POLICY' ? 'Gia đình Chính sách' :
                hh.householdType === 'BUSINESS' ? 'Hộ Kinh doanh' :
                hh.householdType === 'POOR' ? 'Hộ Nghèo' :
                hh.householdType === 'NEAR_POOR' ? 'Hộ Cận nghèo' :
                hh.householdType === 'TEMPORARY' ? 'Tạm trú' : 'Hộ Thường trú';

              return (
                <div
                  key={hh.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900 group-hover:text-amber-800 transition-colors">
                            {hh.headOfHousehold}
                          </h4>
                          {hh.hasZalo && (
                            <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[9px] font-black tracking-tight" title="Đã kết nối Zalo Mini App">
                              ZALO
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {hh.groupNumber} • Khu phố {hh.neighborhoodName}
                        </p>
                      </div>

                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border uppercase tracking-wider ${typeColor}`}>
                        {typeLabel}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">CCCD/Định danh:</span>
                        <span className="font-mono font-semibold text-slate-800">{hh.cccd || 'Đang cập nhật'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Điện thoại:</span>
                        <a href={`tel:${hh.phone}`} className="font-bold text-amber-700 hover:underline">
                          {hh.phone}
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Nhân khẩu:</span>
                        <span className="font-bold text-slate-800">{hh.memberCount} người</span>
                      </div>
                      <div className="pt-1 text-[11px] text-slate-500 truncate" title={hh.address}>
                        <MapPin className="w-3 h-3 inline mr-1 text-slate-400" />
                        {hh.address}
                      </div>
                    </div>

                    {hh.notes && (
                      <p className="text-xs text-amber-900 bg-amber-50/50 p-2 rounded-lg border border-amber-100/60 leading-relaxed italic">
                        "{hh.notes}"
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">
                      Gia đình VH: <span className="font-bold text-emerald-600">{hh.culturalFamilyStatus === 'ACHIEVED' ? 'Đã đạt' : 'Đăng ký'}</span>
                    </span>
                    <button
                      onClick={() => setSelectedHouseholdDetail(hh)}
                      className="font-bold text-amber-700 hover:text-amber-900 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Chi tiết hồ sơ</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4.2 TAB: BROADCASTS & NOTICES */}
      {activeTab === 'broadcasts' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Trung tâm Phát thanh & Thông báo số Khu phố ({broadcasts.length} bản tin)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Phát thanh số đa phương tiện: Kênh Zalo Mini App, tin nhắn SMS, Loa phát thanh thông minh và Bảng tin điện tử tổ dân phố
              </p>
            </div>
            <button
              onClick={() => setIsComposeBroadcastOpen(true)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Megaphone className="w-4 h-4" />
              <span>Soạn bản tin phát thanh mới</span>
            </button>
          </div>

          {/* Broadcast list */}
          <div className="space-y-3">
            {broadcasts.map((bc) => {
              const priorityBadge = 
                bc.priority === 'URGENT' ? 'bg-red-500 text-white' :
                bc.priority === 'HIGH' ? 'bg-orange-500 text-white' :
                'bg-slate-200 text-slate-700';

              const reachRate = Math.round((bc.readCount / bc.totalTargetCount) * 100);

              return (
                <div 
                  key={bc.id} 
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${priorityBadge}`}>
                        {bc.priority === 'URGENT' ? '🚨 KHẨN CẤP' : bc.priority === 'HIGH' ? '⚡ QUAN TRỌNG' : 'THÔNG THƯỜNG'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {bc.category === 'AN_NINH' ? 'An ninh & Trật tự' : 
                         bc.category === 'MOI_TRUONG' ? 'Môi trường & Y tế' : 
                         bc.category === 'AN_SINH' ? 'An sinh xã hội' : 'Sinh hoạt tổ dân phố'}
                      </span>
                      <span className="text-xs text-slate-400">
                        • Gửi lúc {bc.sentAt} bởi <strong className="text-slate-700">{bc.senderName}</strong>
                      </span>
                    </div>

                    {/* Channel Badges */}
                    <div className="flex items-center gap-1.5">
                      {bc.channels.map(c => (
                        <span key={c} className="px-2 py-0.5 rounded-md text-[9px] font-black bg-blue-50 text-blue-700 border border-blue-100">
                          {c === 'ZALO' ? 'Zalo OA' : c === 'SMS' ? 'SMS' : c === 'LOA_SO' ? 'Loa số' : 'Bảng tin'}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-slate-900">
                      {bc.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {bc.content}
                    </p>
                  </div>

                  {bc.attachmentName && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                      <FileCheck className="w-3.5 h-3.5 text-amber-600" />
                      <span>{bc.attachmentName}</span>
                    </div>
                  )}

                  {/* Reach analytics footer */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-slate-400">Phạm vi: </span>
                        <span className="font-bold text-slate-800">{bc.targetNeighborhoodNames.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Tiếp cận: </span>
                        <span className="font-bold text-emerald-700">{bc.readCount.toLocaleString()} / {bc.totalTargetCount.toLocaleString()} hộ ({reachRate}%)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => notify('Đã gửi nhắc nhở', `Hệ thống đã gửi nhắc nhở tới các hộ chưa đọc bản tin "${bc.title}"`)}
                        className="px-3 py-1 rounded-lg text-amber-800 hover:bg-amber-50 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Gửi nhắc lại
                      </button>
                      <button 
                        onClick={() => notify('Đã sao chép link', 'Link bản tin điện tử đã được sao chép vào bộ nhớ tạm')}
                        className="px-3 py-1 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Chia sẻ Zalo</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4.3 TAB: PETITIONS */}
      {activeTab === 'petitions' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Tiếp nhận & Xử lý Phản ánh Hiện trường từ Người dân ({filteredPetitions.length} phản ánh)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Luồng tiếp nhận trực tiếp từ 21 khu phố: Môi trường, trật tự đô thị, an ninh, điện chiếu sáng và tranh chấp hòa giải cơ sở
              </p>
            </div>
            {onNavigateToOpinions && (
              <button
                onClick={onNavigateToOpinions}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>Xem Trung tâm Dân nguyện toàn phường</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Petitions List */}
          <div className="space-y-3">
            {filteredPetitions.map((pet) => {
              const statusBadge = 
                pet.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                pet.status === 'RESOLVING' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                pet.status === 'VERIFYING' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                'bg-amber-100 text-amber-800 border-amber-200';

              const statusText = 
                pet.status === 'RESOLVED' ? 'Đã giải quyết xong' :
                pet.status === 'RESOLVING' ? 'Đang xử lý tại hiện trường' :
                pet.status === 'VERIFYING' ? 'Khu phố đang xác minh' : 'Mới tiếp nhận';

              return (
                <div
                  key={pet.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {pet.code}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {pet.residentName} ({pet.groupNumber} • KP {pet.neighborhoodName})
                      </span>
                      <span className="text-xs text-slate-400">• {pet.submittedAt}</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${statusBadge}`}>
                      {statusText}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      {pet.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {pet.content}
                    </p>
                  </div>

                  {/* Resolution note if exists */}
                  {pet.resolutionNote && (
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-emerald-900">
                        <span>Tiến độ xử lý & Phản hồi:</span>
                        {pet.resolutionDate && <span className="text-[10px] font-normal text-slate-500">{pet.resolutionDate}</span>}
                      </div>
                      <p className="text-emerald-800 leading-relaxed">
                        {pet.resolutionNote}
                      </p>
                      <p className="text-[11px] text-slate-500 pt-1">
                        Cán bộ phụ trách: <strong className="text-slate-700">{pet.assignedOfficer}</strong>
                      </p>
                    </div>
                  )}

                  {/* Actions footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{pet.residentAddress}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${pet.residentPhone}`}
                        className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors flex items-center gap-1 text-xs"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Gọi người dân</span>
                      </a>
                      <button
                        onClick={() => {
                          setSelectedPetitionForAction(pet);
                          setPetitionNewStatus(pet.status);
                          setPetitionResolutionText(pet.resolutionNote || '');
                        }}
                        className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors flex items-center gap-1 text-xs cursor-pointer shadow-2xs"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Cập nhật xử lý</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4.4 TAB: REGISTRATIONS */}
      {activeTab === 'registrations' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Tiếp nhận & Thẩm định Hồ sơ Đăng ký Dân sinh ({filteredRegistrations.length} hồ sơ)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Người dân đăng ký Gia đình văn hóa, trợ cấp an sinh xã hội, cấp đổi thùng rác hợp chuẩn, tạm trú và hiến đất mở hẻm
              </p>
            </div>
            <div className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              Đã duyệt: <strong className="text-emerald-700">{stats.approvedRegs}</strong> • Chờ duyệt: <strong className="text-amber-700">{stats.pendingRegs}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRegistrations.map((reg) => {
              const statusBadge = 
                reg.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                reg.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                reg.status === 'SUPPLEMENTARY' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                'bg-red-100 text-red-800 border-red-200';

              const statusText = 
                reg.status === 'APPROVED' ? 'ĐÃ PHÊ DUYỆT' :
                reg.status === 'PENDING' ? 'CHỜ XÉT DUYỆT' :
                reg.status === 'SUPPLEMENTARY' ? 'CẦN BỔ SUNG' : 'TỪ CHỐI';

              const formTypeLabel = 
                reg.formType === 'GIA_DINH_VAN_HOA' ? 'Gia đình văn hóa' :
                reg.formType === 'HIEN_DAT_DONG_GOP' ? 'Hiến đất & Đóng góp' :
                reg.formType === 'CAP_THUNG_RAC' ? 'Cấp đổi thùng rác' :
                reg.formType === 'TAM_TRU_TAM_VANG' ? 'Tạm trú lao động' : 'Trợ cấp an sinh';

              return (
                <div
                  key={reg.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-bold text-[10px] uppercase">
                        {formTypeLabel}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${statusBadge}`}>
                        {statusText}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900">
                      {reg.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {reg.details}
                    </p>

                    <div className="text-xs text-slate-500 space-y-1 pt-1">
                      <div>
                        Người đăng ký: <strong className="text-slate-800">{reg.residentName}</strong> ({reg.residentPhone})
                      </div>
                      <div>
                        Địa chỉ: {reg.address}
                      </div>
                      {reg.scheduledDate && (
                        <div className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Lịch hẹn / Dự kiến: {reg.scheduledDate}</span>
                        </div>
                      )}
                      {reg.adminNote && (
                        <div className="text-slate-600 bg-amber-50/50 p-2 rounded-lg border border-amber-100 text-[11px]">
                          <strong>Ghi chú duyệt:</strong> {reg.adminNote}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Nộp lúc: {reg.submittedAt}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedRegForAction(reg);
                        setRegNewStatus(reg.status);
                        setRegAdminNote(reg.adminNote || '');
                        setRegScheduledDate(reg.scheduledDate || '');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Thẩm định hồ sơ</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4.5 TAB: CADRES & LEADERSHIP */}
      {activeTab === 'cadres' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-black text-slate-900">
              Danh bạ 21 Ban điều hành & Ban công tác Mặt trận Khu phố
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hệ thống lãnh đạo cơ sở phụ trách các khu phố phường Chánh Hiệp - Nhiệm kỳ 2024 - 2029
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cadres.map((c) => (
              <div 
                key={c.id} 
                className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-amber-400 hover:shadow-md transition-all flex items-start gap-3.5"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                  {c.neighborhoodName.split(' ').pop()}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                    Khu phố {c.neighborhoodName}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 truncate">
                    {c.fullName}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {c.positionLabel}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={`tel:${c.phone}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:underline"
                    >
                      <Phone className="w-3 h-3 text-amber-600" />
                      <span>{c.phone}</span>
                    </a>
                    <span className="text-[10px] font-bold text-slate-400">
                      {c.term}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: THÊM HỘ DÂN MỚI */}
      {/* ========================================================================= */}
      {isAddHouseholdOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Thêm Hộ Dân Mới</h3>
                  <p className="text-xs text-slate-500">Số hóa hồ sơ nhân khẩu vào địa bàn khu phố</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddHouseholdOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Chọn Khu phố & Tổ dân phố *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newHousehold.neighborhoodId}
                    onChange={(e) => setNewHousehold(prev => ({ ...prev, neighborhoodId: e.target.value }))}
                    className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    {OFFICIAL_21_NEIGHBORHOODS.map(nh => (
                      <option key={nh.id} value={nh.id}>{nh.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Tổ dân phố (e.g. Tổ 1)"
                    value={newHousehold.groupNumber}
                    onChange={(e) => setNewHousehold(prev => ({ ...prev, groupNumber: e.target.value }))}
                    className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Họ và tên chủ hộ *
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={newHousehold.headOfHousehold}
                  onChange={(e) => setNewHousehold(prev => ({ ...prev, headOfHousehold: e.target.value }))}
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Số điện thoại *</label>
                  <input
                    type="text"
                    placeholder="09xx..."
                    value={newHousehold.phone}
                    onChange={(e) => setNewHousehold(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Số CCCD / Định danh</label>
                  <input
                    type="text"
                    placeholder="12 chữ số..."
                    value={newHousehold.cccd}
                    onChange={(e) => setNewHousehold(prev => ({ ...prev, cccd: e.target.value }))}
                    className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Địa chỉ cư trú</label>
                <input
                  type="text"
                  placeholder="Số nhà, tên đường DX, hẻm..."
                  value={newHousehold.address}
                  onChange={(e) => setNewHousehold(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Diện đối tượng</label>
                  <select
                    value={newHousehold.householdType}
                    onChange={(e) => setNewHousehold(prev => ({ ...prev, householdType: e.target.value as any }))}
                    className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="STANDARD">Hộ thường trú</option>
                    <option value="POLICY">Gia đình chính sách / Liệt sĩ</option>
                    <option value="BUSINESS">Hộ kinh doanh làng nghề</option>
                    <option value="NEAR_POOR">Hộ cận nghèo</option>
                    <option value="POOR">Hộ nghèo</option>
                    <option value="TEMPORARY">Hộ tạm trú</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Số nhân khẩu</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newHousehold.memberCount}
                    onChange={(e) => setNewHousehold(prev => ({ ...prev, memberCount: Number(e.target.value) }))}
                    className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ghi chú theo dõi</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú về hoàn cảnh, tâm tư nguyện vọng hoặc thành tích..."
                  value={newHousehold.notes}
                  onChange={(e) => setNewHousehold(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsAddHouseholdOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveNewHousehold}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md"
              >
                Lưu vào Sổ bộ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PHÁT THANH & GỬI THÔNG BÁO SỐ */}
      {/* ========================================================================= */}
      {isComposeBroadcastOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Phát Thanh & Gửi Thông Báo Số</h3>
                  <p className="text-xs text-slate-500">Gửi tức thì tới Zalo, SMS và Bảng tin số khu phố</p>
                </div>
              </div>
              <button 
                onClick={() => setIsComposeBroadcastOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Khu phố nhận thông báo *
                </label>
                <select
                  value={newBroadcast.targetNeighborhoodId}
                  onChange={(e) => setNewBroadcast(prev => ({ ...prev, targetNeighborhoodId: e.target.value }))}
                  className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="ALL">Toàn bộ 21 Khu phố Chánh Hiệp (12.850 hộ dân)</option>
                  {OFFICIAL_21_NEIGHBORHOODS.map(nh => (
                    <option key={nh.id} value={nh.id}>Khu phố {nh.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mức độ khẩn</label>
                  <select
                    value={newBroadcast.priority}
                    onChange={(e) => setNewBroadcast(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="NORMAL">Thông thường</option>
                    <option value="HIGH">Quan trọng</option>
                    <option value="URGENT">🚨 Khẩn cấp (Mưa bão, PCCC, Dịch bệnh)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Chủ đề</label>
                  <select
                    value={newBroadcast.category}
                    onChange={(e) => setNewBroadcast(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="SINH_HOAT">Sinh hoạt tổ dân phố</option>
                    <option value="AN_NINH">An ninh trật tự & PCCC</option>
                    <option value="MOI_TRUONG">Môi trường & Y tế</option>
                    <option value="AN_SINH">An sinh xã hội & Quà tặng</option>
                    <option value="THI_DUA">Phong trào thi đua</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tiêu đề thông báo *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Lịch cắt điện bảo trì hoặc Lịch sinh hoạt định kỳ..."
                  value={newBroadcast.title}
                  onChange={(e) => setNewBroadcast(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:border-orange-500 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nội dung chi tiết *</label>
                <textarea
                  rows={4}
                  placeholder="Nhập nội dung thông báo gửi đến các hộ dân..."
                  value={newBroadcast.content}
                  onChange={(e) => setNewBroadcast(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kênh phân phối số</label>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'ZALO', label: 'Zalo Mini App' },
                    { id: 'SMS', label: 'Tin nhắn SMS' },
                    { id: 'LOA_SO', label: 'Loa số thông minh' },
                    { id: 'BANG_TIN', label: 'Bảng tin tổ dân phố' }
                  ].map(ch => (
                    <label key={ch.id} className="flex items-center gap-1.5 text-xs text-slate-700 font-medium bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newBroadcast.channels.includes(ch.id as any)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewBroadcast(prev => ({ ...prev, channels: [...prev.channels, ch.id as any] }));
                          } else {
                            setNewBroadcast(prev => ({ ...prev, channels: prev.channels.filter(c => c !== ch.id) }));
                          }
                        }}
                        className="rounded text-orange-600"
                      />
                      <span>{ch.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsComposeBroadcastOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSendBroadcast}
                className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Phát thanh ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CẬP NHẬT TIẾN ĐỘ PHẢN ÁNH CỦA NGƯỜI DÂN */}
      {/* ========================================================================= */}
      {selectedPetitionForAction && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Cập Nhật Tiến Độ Phản Ánh: {selectedPetitionForAction.code}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedPetitionForAction.residentName} • KP {selectedPetitionForAction.neighborhoodName}
                </p>
              </div>
              <button 
                onClick={() => setSelectedPetitionForAction(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-800">Nội dung phản ánh:</span>
                <p className="text-slate-600 mt-1 italic">"{selectedPetitionForAction.content}"</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Trạng thái giải quyết *</label>
                <select
                  value={petitionNewStatus}
                  onChange={(e) => setPetitionNewStatus(e.target.value as any)}
                  className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="RECEIVED">Mới tiếp nhận</option>
                  <option value="VERIFYING">Ban cán sự khu phố đang xác minh</option>
                  <option value="RESOLVING">Đang điều phối xử lý hiện trường</option>
                  <option value="RESOLVED">Đã giải quyết xong (Hoàn tất)</option>
                  <option value="REJECTED">Không thuộc thẩm quyền / Từ chối</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Biện pháp xử lý & Phản hồi cho người dân
                </label>
                <textarea
                  rows={4}
                  placeholder="Ghi rõ kết quả kiểm tra, thời gian hoàn thành và phản hồi gửi đến công dân..."
                  value={petitionResolutionText}
                  onChange={(e) => setPetitionResolutionText(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedPetitionForAction(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                Đóng
              </button>
              <button
                onClick={handleUpdatePetition}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md"
              >
                Lưu kết quả & Gửi phản hồi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: THẨM ĐỊNH HỒ SƠ ĐĂNG KÝ CỦA DÂN */}
      {/* ========================================================================= */}
      {selectedRegForAction && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Thẩm Định Hồ Sơ Đăng Ký: {selectedRegForAction.code}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedRegForAction.residentName} • KP {selectedRegForAction.neighborhoodName}
                </p>
              </div>
              <button 
                onClick={() => setSelectedRegForAction(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-800">Thủ tục / Phong trào:</span>
                <p className="font-semibold text-amber-900 mt-0.5">{selectedRegForAction.title}</p>
                <p className="text-slate-600 mt-1 italic">"{selectedRegForAction.details}"</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kết quả thẩm định *</label>
                <select
                  value={regNewStatus}
                  onChange={(e) => setRegNewStatus(e.target.value as any)}
                  className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="PENDING">Chờ xét duyệt</option>
                  <option value="APPROVED">Phê duyệt đủ điều kiện</option>
                  <option value="SUPPLEMENTARY">Yêu cầu bổ sung thêm thông tin</option>
                  <option value="REJECTED">Không đủ điều kiện</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Lịch hẹn / Ngày trả kết quả</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Ngày 18/11/2026 hoặc Thứ Bảy tuần này..."
                  value={regScheduledDate}
                  onChange={(e) => setRegScheduledDate(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ghi chú phê duyệt</label>
                <textarea
                  rows={3}
                  placeholder="Nhập nhận xét của Ban cán sự khu phố..."
                  value={regAdminNote}
                  onChange={(e) => setRegAdminNote(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedRegForAction(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                Đóng
              </button>
              <button
                onClick={handleUpdateRegistration}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md"
              >
                Xác nhận phê duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: CHI TIẾT HỒ SƠ HỘ DÂN */}
      {/* ========================================================================= */}
      {selectedHouseholdDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  {selectedHouseholdDetail.headOfHousehold.split(' ').pop()?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedHouseholdDetail.headOfHousehold}</h3>
                  <p className="text-xs text-slate-500">Hộ dân thuộc Khu phố {selectedHouseholdDetail.neighborhoodName}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedHouseholdDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block">Số điện thoại:</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedHouseholdDetail.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Số định danh CCCD:</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">{selectedHouseholdDetail.cccd || 'Chưa cập nhật'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Tổ dân phố:</span>
                  <span className="font-bold text-slate-800">{selectedHouseholdDetail.groupNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Số nhân khẩu:</span>
                  <span className="font-bold text-slate-800">{selectedHouseholdDetail.memberCount} thành viên</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block">Địa chỉ thường trú:</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedHouseholdDetail.address}</p>
              </div>

              {selectedHouseholdDetail.notes && (
                <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/70">
                  <span className="text-amber-900 font-bold block mb-1">Ghi chú cán bộ:</span>
                  <p className="text-amber-800 italic">{selectedHouseholdDetail.notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <a
                href={`tel:${selectedHouseholdDetail.phone}`}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi chủ hộ</span>
              </a>
              <button
                onClick={() => setSelectedHouseholdDetail(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NeighborhoodManagementAdminView;
