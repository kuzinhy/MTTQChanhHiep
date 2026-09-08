import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  TrendingUp, 
  Medal, 
  Star, 
  Building2, 
  CheckCircle2, 
  Users, 
  Sparkles, 
  Download, 
  Printer, 
  Filter,
  Search
} from 'lucide-react';

interface NeighborhoodScore {
  id: string;
  name: string;
  totalScore: number;
  opinionsScore: number; // Max 30
  competitionsScore: number; // Max 25
  welfareScore: number; // Max 25
  greenProjectScore: number; // Max 20
  rank: number;
  badge: 'XUẤT SẮC' | 'TỐT' | 'KHÁ';
  trend: 'up' | 'down' | 'same';
  leaderName: string;
}

export const NeighborhoodEmulationDashboard: React.FC = () => {
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Quý I/2026');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodScore | null>(null);

  // Pre-calculated emulation ranking for 21 neighborhoods
  const rawNeighborhoods: NeighborhoodScore[] = Array.from({ length: 21 }, (_, i) => {
    const kpNum = i + 1;
    // Calculate realistic scores
    const opinionsScore = Math.min(30, 26 + ((kpNum * 7) % 5));
    const competitionsScore = Math.min(25, 20 + ((kpNum * 3) % 6));
    const welfareScore = Math.min(25, 21 + ((kpNum * 11) % 5));
    const greenProjectScore = Math.min(20, 16 + ((kpNum * 13) % 5));
    const totalScore = opinionsScore + competitionsScore + welfareScore + greenProjectScore;

    return {
      id: `kp-${kpNum}`,
      name: `Khu phố ${kpNum}`,
      opinionsScore,
      competitionsScore,
      welfareScore,
      greenProjectScore,
      totalScore,
      rank: 0, // Will sort
      badge: totalScore >= 90 ? 'XUẤT SẮC' : totalScore >= 80 ? 'TỐT' : 'KHÁ',
      trend: kpNum % 3 === 0 ? 'up' : kpNum % 5 === 0 ? 'down' : 'same',
      leaderName: `Trưởng Ban CTMT KP ${kpNum}`
    };
  });

  // Sort by score
  const sortedNeighborhoods = [...rawNeighborhoods]
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  const top3 = sortedNeighborhoods.slice(0, 3);

  const filteredNeighborhoods = sortedNeighborhoods.filter(n =>
    n.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 text-slate-800 antialiased">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-red-700 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-amber-500/30">
        <div>
          <div className="flex items-center gap-2 text-amber-200 font-bold text-xs uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4 text-amber-300" />
            Thi Đua Chuyển Đổi Số & Hoạt Động Mặt Trận 2026
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bảng Điểm Thi Đua & Bảng Vàng Vinh Danh 21 Khu Phố
          </h1>
          <p className="text-amber-100 text-sm mt-1 max-w-2xl">
            Đánh giá xếp hạng Realtime dựa trên Tỷ lệ xử lý ý kiến dân sinh, Thành tích hội thi trực tuyến, Phong trào An sinh xã hội và Công trình Dân vận khéo.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-xl border border-white/20 backdrop-blur-md">
          <select
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
            className="bg-transparent text-white font-bold text-sm px-3 py-1.5 focus:outline-none"
          >
            <option value="Quý I/2026" className="text-slate-800">Quý I / 2026</option>
            <option value="Quý II/2026" className="text-slate-800">Quý II / 2026</option>
            <option value="Cả Năm 2026" className="text-slate-800">Cả Năm 2026</option>
          </select>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Silver Rank 2 */}
        <div className="bg-gradient-to-b from-slate-50 to-slate-100 rounded-2xl p-5 border border-slate-300 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-slate-300/30 rounded-full blur-xl" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 bg-slate-200 text-slate-800 font-extrabold text-xs rounded-full flex items-center gap-1">
                <Medal className="w-3.5 h-3.5 text-slate-600" />
                HẠNG 2 (GIẢI NHÌ)
              </span>
              <span className="text-2xl font-black text-slate-800">{top3[1]?.totalScore} đ</span>
            </div>

            <h3 className="text-xl font-black text-slate-900">{top3[1]?.name}</h3>
            <p className="text-xs text-slate-600 mt-1">{top3[1]?.leaderName}</p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
            <div>Dân sinh: <span className="font-bold text-indigo-700">{top3[1]?.opinionsScore}/30</span></div>
            <div>Hội thi số: <span className="font-bold text-indigo-700">{top3[1]?.competitionsScore}/25</span></div>
          </div>
        </div>

        {/* Gold Rank 1 (Center Highlight) */}
        <div className="bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between border-2 border-amber-300 transform md:-translate-y-2">
          <div className="absolute right-0 top-0 p-4">
            <Sparkles className="w-8 h-8 text-amber-200 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 bg-amber-300 text-amber-950 font-black text-xs rounded-full flex items-center gap-1 shadow-sm">
                <Trophy className="w-3.5 h-3.5 text-amber-800" />
                QUÁN QUÂN - HẠNG 1
              </span>
              <span className="text-3xl font-black text-amber-100">{top3[0]?.totalScore} đ</span>
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight">{top3[0]?.name}</h3>
            <p className="text-xs text-amber-100 mt-1">{top3[0]?.leaderName}</p>
          </div>

          <div className="mt-6 pt-3 border-t border-amber-400/40 grid grid-cols-2 gap-2 text-xs font-bold text-amber-100">
            <div>Ý kiến DS: <span className="text-white">{top3[0]?.opinionsScore}/30</span></div>
            <div>Hội thi số: <span className="text-white">{top3[0]?.competitionsScore}/25</span></div>
            <div>An sinh: <span className="text-white">{top3[0]?.welfareScore}/25</span></div>
            <div>CT Xanh: <span className="text-white">{top3[0]?.greenProjectScore}/20</span></div>
          </div>
        </div>

        {/* Bronze Rank 3 */}
        <div className="bg-gradient-to-b from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 bg-amber-100 text-amber-800 font-extrabold text-xs rounded-full flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-700" />
                HẠNG 3 (GIẢI BA)
              </span>
              <span className="text-2xl font-black text-amber-900">{top3[2]?.totalScore} đ</span>
            </div>

            <h3 className="text-xl font-black text-slate-900">{top3[2]?.name}</h3>
            <p className="text-xs text-slate-600 mt-1">{top3[2]?.leaderName}</p>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-200 grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
            <div>Dân sinh: <span className="font-bold text-amber-800">{top3[2]?.opinionsScore}/30</span></div>
            <div>Hội thi số: <span className="font-bold text-amber-800">{top3[2]?.competitionsScore}/25</span></div>
          </div>
        </div>
      </div>

      {/* Full 21 Neighborhood Ranking Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-600" />
            <h2 className="font-extrabold text-slate-900 text-base">
              Bảng Xếp Hạng Chi Tiết Thi Đua 21 Ban Công Tác Mặt Trận Khu Phố
            </h2>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên Khu phố..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
              <tr>
                <th className="px-3 py-2.5 text-center w-12">Hạng</th>
                <th className="px-3 py-2.5">Đơn vị Khu phố</th>
                <th className="px-3 py-2.5 text-center">Xử lý Ý kiến DS (30đ)</th>
                <th className="px-3 py-2.5 text-center">Hội thi Số (25đ)</th>
                <th className="px-3 py-2.5 text-center">An sinh XH (25đ)</th>
                <th className="px-3 py-2.5 text-center">CT Xanh (20đ)</th>
                <th className="px-3 py-2.5 text-center font-black">Tổng Điểm</th>
                <th className="px-3 py-2.5 text-center">Xếp Loại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredNeighborhoods.map((item) => (
                <tr key={item.id} className="hover:bg-amber-50/40 transition-all font-medium">
                  <td className="px-3 py-3 text-center font-bold">
                    {item.rank <= 3 ? (
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-white text-xs ${
                        item.rank === 1 ? 'bg-amber-500' : item.rank === 2 ? 'bg-slate-400' : 'bg-amber-700'
                      }`}>
                        {item.rank}
                      </span>
                    ) : (
                      <span className="text-slate-500">{item.rank}</span>
                    )}
                  </td>
                  <td className="px-3 py-3 font-bold text-slate-900">
                    {item.name}
                  </td>
                  <td className="px-3 py-3 text-center font-mono text-indigo-700 font-bold">{item.opinionsScore}</td>
                  <td className="px-3 py-3 text-center font-mono text-blue-700 font-bold">{item.competitionsScore}</td>
                  <td className="px-3 py-3 text-center font-mono text-emerald-700 font-bold">{item.welfareScore}</td>
                  <td className="px-3 py-3 text-center font-mono text-teal-700 font-bold">{item.greenProjectScore}</td>
                  <td className="px-3 py-3 text-center font-black text-amber-900 text-sm">{item.totalScore}</td>
                  <td className="px-3 py-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      item.badge === 'XUẤT SẮC'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default NeighborhoodEmulationDashboard;
