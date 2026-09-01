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
  {
    id: 'kp-tibh-1',
    name: 'Tương Bình Hiệp 1',
    chiefName: 'Trần Thị Tố Như',
    phone: '0933742769',
    opinionCount: 8,
    resolvedCount: 7,
    poorHouseholds: 2,
    nearPoorHouseholds: 4,
    unityHousesBuilt: 2,
    satisfactionRate: 98,
    status: 'GREEN',
    mttqName: 'Phan Thanh Phong',
    mttqPhone: '0944029851',
    secretaryName: 'Đoàn Thị Bích Vân',
    secretaryPhone: '0919926385',
    youthUnionSecretary: 'Nguyễn Anh Khoa',
    youthUnionPhone: '0793515812',
    youthUnionDeputy: 'Huỳnh Thị Ngọc Thùy',
    youthUnionDeputyPhone: '0816850889',
    womenAssociationChief: 'Nguyễn Thị Thu Dung'
  },
  {
    id: 'kp-tibh-2',
    name: 'Tương Bình Hiệp 2',
    chiefName: 'Nguyễn Thanh Sơn',
    phone: '0336749484',
    opinionCount: 12,
    resolvedCount: 11,
    poorHouseholds: 3,
    nearPoorHouseholds: 5,
    unityHousesBuilt: 2,
    satisfactionRate: 96,
    status: 'GREEN',
    mttqName: 'Lê Minh Trí',
    mttqPhone: '0933410441',
    secretaryName: 'Lê Thị Thanh Loan',
    secretaryPhone: '0913140999',
    youthUnionSecretary: 'Triệu Thùy Linh',
    youthUnionPhone: '0329674272',
    youthUnionDeputy: 'Võ Quang Tiến',
    youthUnionDeputyPhone: '0345605902'
  },
  {
    id: 'kp-tibh-3',
    name: 'Tương Bình Hiệp 3',
    chiefName: 'Nguyễn Việt Toàn',
    phone: '0919908008',
    opinionCount: 15,
    resolvedCount: 13,
    poorHouseholds: 4,
    nearPoorHouseholds: 6,
    unityHousesBuilt: 3,
    satisfactionRate: 94,
    status: 'YELLOW',
    mttqName: 'Lê Trần Quốc Thái',
    mttqPhone: '0363763231',
    secretaryName: 'Nguyễn Văn An',
    secretaryPhone: '0913163103',
    youthUnionSecretary: 'Trần Lê Bảo Trân',
    youthUnionPhone: '0365028774',
    youthUnionDeputy: 'Phạm Thuận Tiến',
    youthUnionDeputyPhone: '0839520139'
  },
  {
    id: 'kp-tibh-4',
    name: 'Tương Bình Hiệp 4',
    chiefName: 'Lê Duy Khang',
    phone: '0358934767',
    opinionCount: 6,
    resolvedCount: 6,
    poorHouseholds: 1,
    nearPoorHouseholds: 3,
    unityHousesBuilt: 1,
    satisfactionRate: 100,
    status: 'GREEN',
    mttqName: 'Trần Văn An',
    mttqPhone: '0948667996',
    secretaryName: 'Nguyễn Minh Hoàng',
    secretaryPhone: '0918014758',
    youthUnionSecretary: 'Nguyễn Chí Cường',
    youthUnionPhone: '0961581254',
    youthUnionDeputy: 'Hoàng Tuấn Dũng',
    youthUnionDeputyPhone: '0364422946'
  },
  {
    id: 'kp-tibh-5',
    name: 'Tương Bình Hiệp 5',
    chiefName: 'Phạm Thị Tố Mai',
    phone: '0908739555',
    opinionCount: 19,
    resolvedCount: 17,
    poorHouseholds: 5,
    nearPoorHouseholds: 7,
    unityHousesBuilt: 4,
    satisfactionRate: 92,
    status: 'YELLOW',
    mttqName: 'Tiết Tuấn',
    mttqPhone: '0987720790',
    secretaryName: 'Nguyễn Hoài Tân',
    secretaryPhone: '0969232715',
    youthUnionSecretary: 'Nguyễn Trần Văn Cường',
    youthUnionPhone: '0855189755',
    youthUnionDeputy: 'Nguyễn Huỳnh Đăng Khoa',
    youthUnionDeputyPhone: '0928371249'
  },
  {
    id: 'kp-tibh-6',
    name: 'Tương Bình Hiệp 6',
    chiefName: 'Trần Quốc Nghĩa',
    phone: '0915337788',
    opinionCount: 9,
    resolvedCount: 9,
    poorHouseholds: 2,
    nearPoorHouseholds: 3,
    unityHousesBuilt: 2,
    satisfactionRate: 99,
    status: 'GREEN',
    mttqName: 'Nguyễn Thị Ánh Tuyết',
    mttqPhone: '0706055248',
    secretaryName: 'Võ Oanh Kiều',
    secretaryPhone: '0369794592',
    youthUnionSecretary: 'Trần Thị Huế Trân',
    youthUnionPhone: '0777445753',
    youthUnionDeputy: 'Huỳnh Long Nhựt',
    youthUnionDeputyPhone: '0886378437'
  },
  {
    id: 'kp-tibh-7',
    name: 'Tương Bình Hiệp 7',
    chiefName: 'Lê Văn Chí',
    phone: '0914919646',
    opinionCount: 14,
    resolvedCount: 12,
    poorHouseholds: 4,
    nearPoorHouseholds: 6,
    unityHousesBuilt: 3,
    satisfactionRate: 95,
    status: 'GREEN',
    mttqName: 'Võ Ngọc Giàu',
    mttqPhone: '0888503448',
    secretaryName: 'Trần Minh Khải',
    secretaryPhone: '0907401441',
    youthUnionSecretary: 'Phạm Kiều Trinh',
    youthUnionPhone: '0347878735',
    youthUnionDeputy: 'Ngô Nguyễn Huyền Trân',
    youthUnionDeputyPhone: '0914107295'
  },
  {
    id: 'kp-ha-7',
    name: 'Hiệp An 7',
    chiefName: 'Nguyễn Thành Châu',
    phone: '0965052061',
    opinionCount: 7,
    resolvedCount: 7,
    poorHouseholds: 2,
    nearPoorHouseholds: 4,
    unityHousesBuilt: 1,
    satisfactionRate: 98,
    status: 'GREEN',
    mttqName: 'Dương Văn Thọ',
    mttqPhone: '0976534508',
    secretaryName: 'Nguyễn Thanh Trí',
    secretaryPhone: '0909197497',
    youthUnionSecretary: 'Nguyễn Ngọc Khánh Quỳnh',
    youthUnionPhone: '0339845828',
    youthUnionDeputy: 'Lê Thị Thảo Như',
    youthUnionDeputyPhone: '0942280700'
  },
  {
    id: 'kp-ha-8',
    name: 'Hiệp An 8',
    chiefName: 'Võ Hoàng Phương',
    phone: '0918231463',
    opinionCount: 11,
    resolvedCount: 10,
    poorHouseholds: 3,
    nearPoorHouseholds: 5,
    unityHousesBuilt: 2,
    satisfactionRate: 97,
    status: 'GREEN',
    mttqName: 'Đinh Xuân Phúc',
    mttqPhone: '0928579957',
    secretaryName: 'Phan Tấn Nhân',
    secretaryPhone: '0913107009',
    youthUnionSecretary: 'Trần Hà An',
    youthUnionPhone: '0965663443',
    youthUnionDeputy: 'Đinh Xuân Phúc',
    youthUnionDeputyPhone: '0928579957'
  },
  {
    id: 'kp-ha-9',
    name: 'Hiệp An 9',
    chiefName: 'Lê Phước Hùng',
    phone: '0828643979',
    opinionCount: 16,
    resolvedCount: 14,
    poorHouseholds: 4,
    nearPoorHouseholds: 7,
    unityHousesBuilt: 3,
    satisfactionRate: 93,
    status: 'YELLOW',
    mttqName: 'Trần Văn Lợi',
    mttqPhone: '0908758565',
    secretaryName: 'Nguyễn Nhật Hồng',
    secretaryPhone: '0919447708',
    youthUnionSecretary: 'Vũ Thị Quỳnh Hương',
    youthUnionPhone: '0925921499',
    youthUnionDeputy: 'Lê Ái Vy',
    youthUnionDeputyPhone: '0857950121'
  },
  {
    id: 'kp-dh-1',
    name: 'Định Hòa 1',
    chiefName: 'Phan Hà Như Thủy',
    phone: '0987933156',
    opinionCount: 10,
    resolvedCount: 9,
    poorHouseholds: 3,
    nearPoorHouseholds: 5,
    unityHousesBuilt: 2,
    satisfactionRate: 96,
    status: 'GREEN',
    mttqName: 'Hoàng Thị Xuân Lành',
    mttqPhone: '0977137382',
    secretaryName: 'Nguyễn Thanh Vân',
    secretaryPhone: '0946692121',
    youthUnionSecretary: 'Lê Hồ Phương Ngân',
    youthUnionPhone: '0832092523',
    youthUnionDeputy: 'Nguyễn Phan Nhựt Hùng',
    youthUnionDeputyPhone: '0369306630'
  },
  {
    id: 'kp-dh-2',
    name: 'Định Hòa 2',
    chiefName: 'Trần Văn Hoàng',
    phone: '0918598078',
    opinionCount: 13,
    resolvedCount: 11,
    poorHouseholds: 4,
    nearPoorHouseholds: 6,
    unityHousesBuilt: 3,
    satisfactionRate: 95,
    status: 'GREEN',
    mttqName: 'Nguyễn Thanh Phương',
    mttqPhone: '0961880602',
    secretaryName: 'Nguyễn Phượng Hằng',
    secretaryPhone: '0856269368',
    youthUnionSecretary: 'Trần Ngọc Khánh Vy',
    youthUnionPhone: '0946175665',
    youthUnionDeputy: 'Trần Phú Điền'
  },
  {
    id: 'kp-dh-3',
    name: 'Định Hòa 3',
    chiefName: 'Nguyễn Văn Gu',
    phone: '0785185879',
    opinionCount: 8,
    resolvedCount: 8,
    poorHouseholds: 2,
    nearPoorHouseholds: 4,
    unityHousesBuilt: 1,
    satisfactionRate: 100,
    status: 'GREEN',
    mttqName: 'Vương Thị Tuyết Mai',
    mttqPhone: '0902477692',
    secretaryName: 'Đỗ Thị Tấn',
    secretaryPhone: '0907429889',
    youthUnionSecretary: 'Dương Huỳnh Trân',
    youthUnionPhone: '0387793600',
    youthUnionDeputy: 'Hạ Thị Kiều Trúc',
    youthUnionDeputyPhone: '0969448349'
  },
  {
    id: 'kp-dh-4',
    name: 'Định Hòa 4',
    chiefName: 'Ngô Quốc Phong',
    phone: '0938377151',
    opinionCount: 12,
    resolvedCount: 11,
    poorHouseholds: 3,
    nearPoorHouseholds: 5,
    unityHousesBuilt: 2,
    satisfactionRate: 96,
    status: 'GREEN',
    mttqName: 'Nguyễn Thị Ngọc Hà',
    mttqPhone: '0988222362',
    secretaryName: 'Văn Văn Hạnh',
    secretaryPhone: '0913937075'
  },
  {
    id: 'kp-dh-5',
    name: 'Định Hòa 5',
    chiefName: 'Phạm Văn Chí',
    phone: '0938565172',
    opinionCount: 9,
    resolvedCount: 8,
    poorHouseholds: 2,
    nearPoorHouseholds: 4,
    unityHousesBuilt: 2,
    satisfactionRate: 97,
    status: 'GREEN',
    mttqName: 'Nguyễn Thị Ích',
    mttqPhone: '0786752934',
    secretaryName: 'Ngô Văn Còn',
    secretaryPhone: '0947300161'
  },
  {
    id: 'kp-dh-6',
    name: 'Định Hòa 6',
    chiefName: 'Lê Văn Hoài',
    phone: '0919042548',
    opinionCount: 14,
    resolvedCount: 13,
    poorHouseholds: 4,
    nearPoorHouseholds: 6,
    unityHousesBuilt: 3,
    satisfactionRate: 95,
    status: 'GREEN',
    mttqName: 'Đặng Thị Huyền Trang',
    mttqPhone: '0943477286',
    secretaryName: 'Nguyễn Văn Gợt',
    secretaryPhone: '0918233944'
  },
  {
    id: 'kp-dh-7',
    name: 'Định Hòa 7',
    chiefName: 'Nguyễn Văn Gấm',
    phone: '0985996979',
    opinionCount: 7,
    resolvedCount: 7,
    poorHouseholds: 1,
    nearPoorHouseholds: 3,
    unityHousesBuilt: 1,
    satisfactionRate: 99,
    status: 'GREEN',
    mttqName: 'Lê Thị Bình',
    mttqPhone: '0983688364',
    secretaryName: 'Đặng Thị Thúy Loan',
    secretaryPhone: '0978598394'
  },
  {
    id: 'kp-dh-8',
    name: 'Định Hòa 8',
    chiefName: 'Trần Quốc Dương',
    phone: '0886848586',
    opinionCount: 11,
    resolvedCount: 10,
    poorHouseholds: 3,
    nearPoorHouseholds: 5,
    unityHousesBuilt: 2,
    satisfactionRate: 97,
    status: 'GREEN',
    mttqName: 'Phan Văn Hòa',
    mttqPhone: '0928979677',
    secretaryName: 'Nguyễn Văn Phụng',
    secretaryPhone: '0918292777',
    youthUnionSecretary: 'Nguyễn Quỳnh Như',
    youthUnionPhone: '0886009795'
  },
  {
    id: 'kp-mh',
    name: 'Mỹ Hảo',
    chiefName: 'Ngô Quốc Trung',
    phone: '0901689828',
    opinionCount: 9,
    resolvedCount: 9,
    poorHouseholds: 2,
    nearPoorHouseholds: 4,
    unityHousesBuilt: 2,
    satisfactionRate: 98,
    status: 'GREEN',
    mttqName: 'Nguyễn Cường',
    mttqPhone: '0989114005',
    secretaryName: 'Nguyễn Văn Hóa',
    secretaryPhone: '0946829638',
    youthUnionSecretary: 'Ngô Thanh Danh',
    youthUnionPhone: '0797247625',
    youthUnionDeputy: 'Đinh Hoàng Quốc Thái',
    youthUnionDeputyPhone: '0704630921'
  },
  {
    id: 'kp-cm-1',
    name: 'Chánh Mỹ 1',
    chiefName: 'Đào Thanh Trung',
    phone: '0919450576',
    opinionCount: 13,
    resolvedCount: 12,
    poorHouseholds: 3,
    nearPoorHouseholds: 5,
    unityHousesBuilt: 3,
    satisfactionRate: 96,
    status: 'GREEN',
    mttqName: 'Nguyễn Thị Mỹ Linh',
    mttqPhone: '0843413153',
    secretaryName: 'Đặng Mỹ Dung',
    secretaryPhone: '0909985399',
    youthUnionSecretary: 'Tống Khánh Linh',
    youthUnionPhone: '0347411034',
    youthUnionDeputy: 'Nguyễn Trung Hiếu',
    youthUnionDeputyPhone: '0373251504'
  },
  {
    id: 'kp-cm-2',
    name: 'Chánh Mỹ 2',
    chiefName: 'Nguyễn Minh Triết',
    phone: '0907008308',
    opinionCount: 15,
    resolvedCount: 14,
    poorHouseholds: 4,
    nearPoorHouseholds: 6,
    unityHousesBuilt: 4,
    satisfactionRate: 95,
    status: 'GREEN',
    mttqName: 'Nguyễn Thị Mỹ Châu',
    mttqPhone: '0834789870',
    secretaryName: 'Bùi Thị Thu Thảo',
    secretaryPhone: '0384793839',
    youthUnionSecretary: 'Trương Hữu Thắng',
    youthUnionPhone: '0792007892',
    youthUnionDeputy: 'Bùi Lê Phúc Khang'
  }
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
              Bản đồ Số 21 Khu phố &amp; Chỉ số An sinh Xã hội
            </h1>
            <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full shadow-xs">
              Interactive Map
            </span>
          </div>
          <p className="text-xs text-blue-100 mt-1 font-medium">
            Giám sát dư luận xã hội, tiến độ xử lý ý kiến dân sinh và công tác hỗ trợ hộ nghèo theo toàn bộ 21 khu phố
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/30 shrink-0 shadow-sm">
          <div className="text-center border-r border-white/30 pr-4">
            <div className="text-xl font-black text-amber-300">21/21</div>
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
              21/21 <span className="text-xs font-bold text-blue-600">Phủ kín 100% KP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid & Selected Detail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: 21 Neighborhood Grid (2/3 width) */}
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
                Tất cả (21)
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

          {/* 21 Neighborhood Cards Grid */}
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

            {/* Executive Committee Contacts Directory */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Ban Điều hành &amp; Liên hệ Khu phố</span>
              </h4>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {/* Bí thư Chi bộ */}
                {selectedNeighborhood.secretaryName && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] font-black uppercase text-red-700 tracking-wider">Bí thư Chi bộ</div>
                      <div className="font-extrabold text-slate-900 truncate">{selectedNeighborhood.secretaryName}</div>
                      {selectedNeighborhood.secretaryPhone && (
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">{selectedNeighborhood.secretaryPhone}</div>
                      )}
                    </div>
                    {selectedNeighborhood.secretaryPhone && (
                      <a
                        href={`tel:${selectedNeighborhood.secretaryPhone}`}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors shrink-0"
                        title="Gọi điện"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}

                {/* Trưởng Ban CTMT */}
                {selectedNeighborhood.mttqName && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] font-black uppercase text-blue-700 tracking-wider">Trưởng Ban Công tác Mặt trận</div>
                      <div className="font-extrabold text-slate-900 truncate">{selectedNeighborhood.mttqName}</div>
                      {selectedNeighborhood.mttqPhone && (
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">{selectedNeighborhood.mttqPhone}</div>
                      )}
                    </div>
                    {selectedNeighborhood.mttqPhone && (
                      <a
                        href={`tel:${selectedNeighborhood.mttqPhone}`}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors shrink-0"
                        title="Gọi điện"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}

                {/* Trưởng Khu phố */}
                {selectedNeighborhood.chiefName && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] font-black uppercase text-amber-700 tracking-wider">Trưởng Khu phố</div>
                      <div className="font-extrabold text-slate-900 truncate">{selectedNeighborhood.chiefName}</div>
                      {selectedNeighborhood.phone && (
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">{selectedNeighborhood.phone}</div>
                      )}
                    </div>
                    {selectedNeighborhood.phone && (
                      <a
                        href={`tel:${selectedNeighborhood.phone}`}
                        className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors shrink-0"
                        title="Gọi điện"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}

                {/* Bí thư Chi đoàn */}
                {selectedNeighborhood.youthUnionSecretary && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] font-black uppercase text-emerald-700 tracking-wider">Bí thư Chi đoàn</div>
                      <div className="font-extrabold text-slate-900 truncate">{selectedNeighborhood.youthUnionSecretary}</div>
                      {selectedNeighborhood.youthUnionPhone && (
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">{selectedNeighborhood.youthUnionPhone}</div>
                      )}
                    </div>
                    {selectedNeighborhood.youthUnionPhone && (
                      <a
                        href={`tel:${selectedNeighborhood.youthUnionPhone}`}
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors shrink-0"
                        title="Gọi điện"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}

                {/* Phó Bí thư Chi đoàn / Chi hội phụ nữ */}
                {selectedNeighborhood.youthUnionDeputy && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] font-black uppercase text-purple-700 tracking-wider">Phó Bí thư Chi đoàn</div>
                      <div className="font-extrabold text-slate-900 truncate">{selectedNeighborhood.youthUnionDeputy}</div>
                      {selectedNeighborhood.youthUnionDeputyPhone && (
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">{selectedNeighborhood.youthUnionDeputyPhone}</div>
                      )}
                    </div>
                    {selectedNeighborhood.youthUnionDeputyPhone && (
                      <a
                        href={`tel:${selectedNeighborhood.youthUnionDeputyPhone}`}
                        className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors shrink-0"
                        title="Gọi điện"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}

                {/* Chi hội trưởng LHPN */}
                {selectedNeighborhood.womenAssociationChief && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] font-black uppercase text-pink-700 tracking-wider">Chi hội trưởng Phụ nữ</div>
                      <div className="font-extrabold text-slate-900 truncate">{selectedNeighborhood.womenAssociationChief}</div>
                    </div>
                  </div>
                )}
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
