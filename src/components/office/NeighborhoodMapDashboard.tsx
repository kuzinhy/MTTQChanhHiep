import React, { useState } from 'react';
import { 
  MapPin, 
  Users, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Home, 
  Heart, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  Filter, 
  Building2, 
  Sparkles,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { PublicOpinion, NeighborhoodStats } from '../../types';

interface NeighborhoodMapDashboardProps {
  opinions: PublicOpinion[];
  onSelectNeighborhoodOpinions?: (neighborhoodName: string) => void;
}

export const INITIAL_NEIGHBORHOODS: NeighborhoodStats[] = [
  { id: 'kp-1', name: 'Khu phố 1', chiefName: 'Ông Lê Văn Nam', phone: '0908.111.001', opinionCount: 8, resolvedCount: 7, poorHouseholds: 3, nearPoorHouseholds: 5, unityHousesBuilt: 2, satisfactionRate: 98, status: 'GREEN' },
  { id: 'kp-2', name: 'Khu phố 2', chiefName: 'Bà Nguyễn Thị Mai', phone: '0908.111.002', opinionCount: 12, resolvedCount: 11, poorHouseholds: 5, nearPoorHouseholds: 7, unityHousesBuilt: 3, satisfactionRate: 96, status: 'GREEN' },
  { id: 'kp-3', name: 'Khu phố 3', chiefName: 'Ông Phạm Văn Bình', phone: '0908.111.003', opinionCount: 15, resolvedCount: 13, poorHouseholds: 4, nearPoorHouseholds: 6, unityHousesBuilt: 4, satisfactionRate: 94, status: 'YELLOW' },
  { id: 'kp-4', name: 'Khu phố 4', chiefName: 'Bà Trần Thị Loan', phone: '0908.111.004', opinionCount: 6, resolvedCount: 6, poorHouseholds: 2, nearPoorHouseholds: 4, unityHousesBuilt: 1, satisfactionRate: 100, status: 'GREEN' },
  { id: 'kp-5', name: 'Khu phố 5', chiefName: 'Ông Hoàng Kim Định', phone: '0908.111.005', opinionCount: 19, resolvedCount: 17, poorHouseholds: 7, nearPoorHouseholds: 9, unityHousesBuilt: 5, satisfactionRate: 92, status: 'YELLOW' },
  { id: 'kp-6', name: 'Khu phố 6', chiefName: 'Bà Vũ Thị Cúc', phone: '0908.111.006', opinionCount: 9, resolvedCount: 9, poorHouseholds: 1, nearPoorHouseholds: 3, unityHousesBuilt: 2, satisfactionRate: 99, status: 'GREEN' },
  { id: 'kp-7', name: 'Khu phố 7', chiefName: 'Ông Đỗ Minh Tuấn', phone: '0908.111.007', opinionCount: 14, resolvedCount: 12, poorHouseholds: 6, nearPoorHouseholds: 8, unityHousesBuilt: 3, satisfactionRate: 95, status: 'GREEN' },
  { id: 'kp-8', name: 'Khu phố 8', chiefName: 'Bà Ngô Thị Hạnh', phone: '0908.111.008', opinionCount: 7, resolvedCount: 7, poorHouseholds: 2, nearPoorHouseholds: 4, unityHousesBuilt: 1, satisfactionRate: 98, status: 'GREEN' },
  { id: 'kp-9', name: 'Khu phố 9', chiefName: 'Ông Bùi Quang Huy', phone: '0908.111.009', opinionCount: 11, resolvedCount: 10, poorHouseholds: 3, nearPoorHouseholds: 5, unityHousesBuilt: 2, satisfactionRate: 97, status: 'GREEN' },
  { id: 'kp-10', name: 'Khu phố 10', chiefName: 'Bà Dương Thị Tuyết', phone: '0908.111.010', opinionCount: 16, resolvedCount: 14, poorHouseholds: 5, nearPoorHouseholds: 8, unityHousesBuilt: 3, satisfactionRate: 93, status: 'YELLOW' },
  { id: 'kp-11', name: 'Khu phố 11', chiefName: 'Ông Lý Minh Châu', phone: '0908.111.011', opinionCount: 10, resolvedCount: 9, poorHouseholds: 3, nearPoorHouseholds: 6, unityHousesBuilt: 2, satisfactionRate: 96, status: 'GREEN' },
  { id: 'kp-12', name: 'Khu phố 12', chiefName: 'Bà Đặng Thị Yến', phone: '0908.111.012', opinionCount: 13, resolvedCount: 11, poorHouseholds: 4, nearPoorHouseholds: 7, unityHousesBuilt: 3, satisfactionRate: 95, status: 'GREEN' },
];

export const NeighborhoodMapDashboard: React.FC<NeighborhoodMapDashboardProps> = ({
  opinions,
  onSelectNeighborhoodOpinions
}) => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodStats | null>(INITIAL_NEIGHBORHOODS[2]); // default KP3
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Filtered list
  const filteredList = INITIAL_NEIGHBORHOODS.filter(kp => {
    const matchesSearch = kp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          kp.chiefName.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === 'ALL') return matchesSearch;
    return matchesSearch && kp.status === filterStatus;
  });

  // Calculate ward totals
  const totalOpinions = INITIAL_NEIGHBORHOODS.reduce((acc, curr) => acc + curr.opinionCount, 0);
  const totalResolved = INITIAL_NEIGHBORHOODS.reduce((acc, curr) => acc + curr.resolvedCount, 0);
  const totalPoor = INITIAL_NEIGHBORHOODS.reduce((acc, curr) => acc + curr.poorHouseholds, 0);
  const totalNearPoor = INITIAL_NEIGHBORHOODS.reduce((acc, curr) => acc + curr.nearPoorHouseholds, 0);
  const totalUnityHouses = INITIAL_NEIGHBORHOODS.reduce((acc, curr) => acc + curr.unityHousesBuilt, 0);
  const avgSatisfaction = Math.round(
    INITIAL_NEIGHBORHOODS.reduce((acc, curr) => acc + curr.satisfactionRate, 0) / INITIAL_NEIGHBORHOODS.length
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Title Header - Bright Vibrant Blue Gradient */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white p-6 sm:p-7 shadow-xl border border-blue-400/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-300 font-black text-xs uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4 text-amber-300" />
            <span>ĐỊA BÀN DÂN CƯ PHƯỜNG CHÁNH HIỆP</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Bản đồ Số 12 Khu phố &amp; Chỉ số An sinh Xã hội
            </h1>
            <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full shadow-xs">
              Interactive Map
            </span>
          </div>
          <p className="text-xs text-blue-100 mt-1 font-medium">
            Giám sát dư luận xã hội, tiến độ xử lý ý kiến dân sinh và công tác hỗ trợ hộ nghèo theo từng khu phố
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/30 shrink-0 shadow-sm">
          <div className="text-center border-r border-white/30 pr-4">
            <div className="text-xl font-black text-amber-300">12/12</div>
            <div className="text-[10px] uppercase font-black text-blue-100">Khu phố Số</div>
          </div>
          <div className="text-center pl-1">
            <div className="text-xl font-black text-white">{avgSatisfaction}%</div>
            <div className="text-[10px] uppercase font-black text-blue-100">Hài lòng Dân sinh</div>
          </div>
        </div>
      </div>

      {/* Ward-wide Executive Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
            <MessageSquare className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Tổng Ý kiến Dân sinh</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {totalOpinions} <span className="text-xs font-bold text-blue-600">({Math.round((totalResolved/totalOpinions)*100)}% đã xong)</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 bg-blue-100 text-blue-800 rounded-xl">
            <Users className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Hộ Nghèo &amp; Cận Nghèo</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {totalPoor + totalNearPoor} <span className="text-xs font-normal text-slate-500">({totalPoor} nghèo / {totalNearPoor} cận nghèo)</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 bg-sky-100 text-sky-800 rounded-xl">
            <Home className="w-5 h-5 text-sky-700" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Nhà Đại đoàn kết</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {totalUnityHouses} căn <span className="text-xs font-bold text-blue-600">(Đạt 100% Kế hoạch)</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 bg-purple-100 text-purple-800 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Trưởng Ban CTMT</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              12/12 <span className="text-xs font-bold text-blue-600">Phủ kín 100% KP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid & Selected Detail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: 12 Neighborhood Grid (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm khu phố hoặc Trưởng ban..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-slate-500 font-semibold whitespace-nowrap">Trạng thái:</span>
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  filterStatus === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả (12)
              </button>
              <button
                onClick={() => setFilterStatus('GREEN')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  filterStatus === 'GREEN' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                Tốt (Tích cực)
              </button>
              <button
                onClick={() => setFilterStatus('YELLOW')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  filterStatus === 'YELLOW' ? 'bg-amber-500 text-slate-950' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                Cần lưu ý
              </button>
            </div>
          </div>

          {/* 12 Neighborhood Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {filteredList.map((kp) => {
              const isSelected = selectedNeighborhood?.id === kp.id;
              const isGreen = kp.status === 'GREEN';

              return (
                <div
                  key={kp.id}
                  onClick={() => setSelectedNeighborhood(kp)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider bg-blue-100/80 px-2 py-0.5 rounded-md">
                        {kp.name}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1.5 group-hover:text-blue-700 transition-colors">
                        {kp.chiefName}
                      </h4>
                    </div>

                    <span className={`w-3 h-3 rounded-full shrink-0 shadow-2xs ${
                      isGreen ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-amber-500 ring-4 ring-amber-100'
                    }`} />
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100/80 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Ý kiến phản ánh:</span>
                      <span className="font-bold text-slate-900">{kp.opinionCount} ({kp.resolvedCount} xong)</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span>Hộ nghèo &amp; Cận nghèo:</span>
                      <span className="font-bold text-slate-900">{kp.poorHouseholds + kp.nearPoorHouseholds} hộ</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span>Mức độ hài lòng:</span>
                      <span className="font-extrabold text-emerald-600">{kp.satisfactionRate}%</span>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] font-bold text-blue-600 flex items-center justify-end gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Xem chi tiết</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Neighborhood Inspector (1/3 width) */}
        {selectedNeighborhood && (
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-5 h-fit sticky top-20">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  HỒ SƠ ĐỊA BÀN
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {selectedNeighborhood.name}
                </h3>
              </div>

              <span className={`px-2.5 py-1 text-xs font-bold rounded-xl ${
                selectedNeighborhood.status === 'GREEN'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {selectedNeighborhood.status === 'GREEN' ? 'Đánh giá: Tốt' : 'Đánh giá: Cần lưu ý'}
              </span>
            </div>

            {/* Front Chief Info Card */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                {selectedNeighborhood.chiefName.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Trưởng Ban Công tác Mặt trận</div>
                <div className="font-extrabold text-slate-900 text-xs truncate">{selectedNeighborhood.chiefName}</div>
                <div className="text-[11px] font-medium text-blue-700 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>Hotline: {selectedNeighborhood.phone}</span>
                </div>
              </div>
            </div>

            {/* Detailed Stats Cards */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Thống kê Dân sinh &amp; An sinh
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-0.5">
                  <span className="text-slate-500 text-[10px]">Phản ánh dân sinh</span>
                  <div className="text-base font-black text-blue-900">{selectedNeighborhood.opinionCount} ý kiến</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Đã xử lý {selectedNeighborhood.resolvedCount}</div>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl space-y-0.5">
                  <span className="text-slate-500 text-[10px]">Nhà Đại đoàn kết</span>
                  <div className="text-base font-black text-amber-900">{selectedNeighborhood.unityHousesBuilt} căn</div>
                  <div className="text-[10px] text-amber-700 font-bold">Đã hoàn thành bàn giao</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-0.5">
                  <span className="text-slate-500 text-[10px]">Hộ nghèo chính thức</span>
                  <div className="text-base font-black text-slate-900">{selectedNeighborhood.poorHouseholds} hộ</div>
                  <div className="text-[10px] text-slate-500">Đang nhận trợ cấp hàng tháng</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-0.5">
                  <span className="text-slate-500 text-[10px]">Hộ cận nghèo</span>
                  <div className="text-base font-black text-slate-900">{selectedNeighborhood.nearPoorHouseholds} hộ</div>
                  <div className="text-[10px] text-slate-500">Hỗ trợ bảo hiểm y tế</div>
                </div>
              </div>
            </div>

            {/* Actions for this neighborhood */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  if (onSelectNeighborhoodOpinions) {
                    onSelectNeighborhoodOpinions(selectedNeighborhood.name);
                  }
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
              >
                <MessageSquare className="w-4 h-4 text-amber-300" />
                <span>Xem danh sách Ý kiến của {selectedNeighborhood.name}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
