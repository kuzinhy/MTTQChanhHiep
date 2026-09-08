import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Layers, 
  Building2, 
  Home, 
  AlertTriangle, 
  Trees, 
  Phone, 
  Navigation, 
  CheckCircle2, 
  Sparkles,
  Filter,
  Search
} from 'lucide-react';

interface WelfarePoint {
  id: string;
  type: 'office_21kp' | 'great_unity_house' | 'hotspot_opinion' | 'green_project';
  title: string;
  neighborhood: string;
  address: string;
  phone?: string;
  contactPerson?: string;
  status: 'active' | 'processing' | 'completed';
  description: string;
  lat: number;
  lng: number;
}

interface WelfareCommunityMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelfareCommunityMapModal: React.FC<WelfareCommunityMapModalProps> = ({ isOpen, onClose }) => {
  const [activeLayer, setActiveLayer] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPoint, setSelectedPoint] = useState<WelfarePoint | null>(null);

  if (!isOpen) return null;

  // Mock list of welfare & 21 KP offices data
  const mapPoints: WelfarePoint[] = [
    // 21 KP Offices
    ...Array.from({ length: 21 }, (_, i) => ({
      id: `office-kp-${i + 1}`,
      type: 'office_21kp' as const,
      title: `Văn phòng Ban Công tác Mặt trận Khu phố ${i + 1}`,
      neighborhood: `Khu phố ${i + 1}`,
      address: `Trụ sở BCTMT Khu phố ${i + 1}, Phường Chánh Hiệp, TP. Thủ Dầu Một`,
      phone: `0988 123 0${(i + 1).toString().padStart(2, '0')}`,
      contactPerson: `Trưởng ban CTMT Khu phố ${i + 1}`,
      status: 'active' as const,
      description: `Văn phòng trực tiếp tiếp nhận ý kiến phản ánh dân sinh và hỗ trợ an sinh xã hội cho bà con Khu phố ${i + 1}.`,
      lat: 11.0020 + (i * 0.0015),
      lng: 106.6500 + (i * 0.0012)
    })),
    // Great Unity Houses
    {
      id: 'house-1',
      type: 'great_unity_house',
      title: 'Nhà Đại Đoàn Kết - Hộ bà Nguyễn Thị Ba',
      neighborhood: 'Khu phố 3',
      address: 'Số 45 Đường ĐX-012, Khu phố 3',
      contactPerson: 'Cán bộ An sinh KP 3',
      status: 'completed',
      description: 'Căn nhà Đại đoàn kết trị giá 80 triệu đồng bàn giao từ nguồn Quỹ Vì người nghèo phường.',
      lat: 11.0055,
      lng: 106.6520
    },
    {
      id: 'house-2',
      type: 'great_unity_house',
      title: 'Điểm An sinh Xã hội & Cấp quà Hộ khó khăn',
      neighborhood: 'Khu phố 8',
      address: 'Đường Nguyễn Văn Lên, Khu phố 8',
      contactPerson: 'Ban CTMT KP 8',
      status: 'active',
      description: 'Điểm phát cơm từ thiện và quà Tết an sinh cho 50 hộ cận nghèo.',
      lat: 11.0080,
      lng: 106.6540
    },
    // Hotspot Public Opinions
    {
      id: 'hotspot-1',
      type: 'hotspot_opinion',
      title: 'Điểm phản ánh Mới: Sửa chữa cống thoát nước đường ĐX-045',
      neighborhood: 'Khu phố 12',
      address: 'Đầu hẻm 45 Đường ĐX-045, Khu phố 12',
      status: 'processing',
      description: 'Ý kiến phản ánh từ nhân dân về đọng nước mưa. Đã chuyển UBND phường và đang khắc phục.',
      lat: 11.0110,
      lng: 106.6580
    },
    // Green Projects
    {
      id: 'green-1',
      type: 'green_project',
      title: 'Tuyến đường Văn minh Đô thị & Không gian Xanh',
      neighborhood: 'Khu phố 5',
      address: 'Tuyến đường ĐX-028, Khu phố 5',
      contactPerson: 'Đội Tình nguyện KP 5',
      status: 'active',
      description: 'Công trình Dân vận khéo trồng 100 cây xanh và vẽ tranh tường cổ động Mặt trận.',
      lat: 11.0035,
      lng: 106.6560
    }
  ];

  const filteredPoints = mapPoints.filter(p => {
    const matchesLayer = activeLayer === 'all' || p.type === activeLayer;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLayer && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-800 via-red-700 to-amber-700 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl border border-white/20">
              <MapPin className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg tracking-tight">
                Bản Đồ An Sinh Số & Điểm Nóng Dân Sinh 21 Khu Phố
              </h2>
              <p className="text-red-100 text-xs">
                Hệ thống tra cứu số hóa vị trí Văn phòng Ban CTMT, Nhà Đại đoàn kết & Điểm phản ánh
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls & Layer Toggles */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          
          {/* Layer Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeLayer === 'all' ? 'bg-red-700 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tất cả ({mapPoints.length})</span>
            </button>

            <button
              onClick={() => setActiveLayer('office_21kp')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeLayer === 'office_21kp' ? 'bg-indigo-700 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>21 Văn Phòng KP</span>
            </button>

            <button
              onClick={() => setActiveLayer('great_unity_house')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeLayer === 'great_unity_house' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-emerald-500" />
              <span>Nhà Đại Đoàn Kết</span>
            </button>

            <button
              onClick={() => setActiveLayer('hotspot_opinion')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeLayer === 'hotspot_opinion' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Điểm Nóng Dân Sinh</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên Khu phố / Vị trí..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Content Body: Split View (List + Details) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Column: Points List */}
          <div className="md:col-span-6 border-r border-slate-200 overflow-y-auto p-4 space-y-2.5 bg-slate-50/50">
            {filteredPoints.length > 0 ? (
              filteredPoints.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPoint(p)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedPoint?.id === p.id 
                      ? 'bg-red-50/80 border-red-400 ring-2 ring-red-500/20 shadow-sm' 
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-xl ${
                        p.type === 'office_21kp' ? 'bg-indigo-100 text-indigo-700' :
                        p.type === 'great_unity_house' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {p.type === 'office_21kp' ? <Building2 className="w-4 h-4" /> :
                         p.type === 'great_unity_house' ? <Home className="w-4 h-4" /> :
                         <AlertTriangle className="w-4 h-4" />}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{p.title}</h4>
                        <p className="text-[11px] text-slate-500 font-medium">{p.neighborhood}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {p.status === 'completed' ? 'Hoàn thành' : 'Đang hoạt động'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Không tìm thấy địa điểm phù hợp với bộ lọc.
              </div>
            )}
          </div>

          {/* Right Column: Selected Point Detail Card */}
          <div className="md:col-span-6 p-6 overflow-y-auto bg-white flex flex-col justify-between">
            {selectedPoint ? (
              <div className="space-y-5">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <span className="px-2.5 py-1 bg-red-100 text-red-800 font-extrabold text-[10px] rounded-lg uppercase">
                    {selectedPoint.neighborhood}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-2">
                    {selectedPoint.title}
                  </h3>
                </div>

                <div className="space-y-3 text-xs text-slate-700">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      Địa chỉ cụ thể:
                    </p>
                    <p className="text-slate-600">{selectedPoint.address}</p>
                  </div>

                  {selectedPoint.contactPerson && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-indigo-600" />
                        Người phụ trách / Liên hệ:
                      </p>
                      <p className="text-slate-700 font-semibold">{selectedPoint.contactPerson} - {selectedPoint.phone || '0274 3822 111'}</p>
                    </div>
                  )}

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <p className="font-bold text-slate-900">Mô tả thông tin chi tiết:</p>
                    <p className="text-slate-600 leading-relaxed">{selectedPoint.description}</p>
                  </div>
                </div>

                <a
                  href={`https://maps.google.com/?q=${selectedPoint.lat},${selectedPoint.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-800 hover:to-amber-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Dẫn Đường Trực Tiếp Trên Google Maps</span>
                </a>
              </div>
            ) : (
              <div className="my-auto text-center space-y-2 py-12 text-slate-400">
                <MapPin className="w-10 h-10 mx-auto text-slate-300" />
                <p className="font-bold text-slate-700 text-sm">Chọn một địa điểm để xem chi tiết</p>
                <p className="text-xs text-slate-500">Xem địa chỉ, số điện thoại người phụ trách và dẫn đường trực tiếp.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default WelfareCommunityMapModal;
