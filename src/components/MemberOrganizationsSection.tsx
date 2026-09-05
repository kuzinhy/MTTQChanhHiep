import React, { useState, useMemo } from 'react';
import { getOfficialCadreAvatarSvg } from '../utils/officialImages';
import { 
  Users, 
  Phone, 
  Mail, 
  Award, 
  Shield, 
  Sparkles, 
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Calendar,
  Layers,
  Flag,
  ChevronRight,
  HeartHandshake,
  Network,
  Maximize2,
  X,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { MemberOrganization } from '../types';
import { OptimizedImage } from './common/OptimizedImage';

interface MemberOrganizationsSectionProps {
  organizations?: MemberOrganization[];
  onSelectArticleTopic?: (topic: string) => void;
  onNavigateTab?: (tab: string) => void;
}

const AI_GENERATED_SEEDS = new Set([
  'org-dtn', 'org-lhph', 'org-ccb', 'org-congdoan', 'org-nct', 'org-hkh', 'org-tnxp', 'org-luat-gia',
  'mem-org-1', 'mem-org-2', 'mem-org-3', 'mem-org-4'
]);

export const MemberOrganizationsSection: React.FC<MemberOrganizationsSectionProps> = ({ 
  organizations = [],
  onSelectArticleTopic,
  onNavigateTab
}) => {
  // Exclude MTTQ (umbrella) and filter out any AI generated seeds
  const sortedOrgs = useMemo(() => {
    return (organizations || [])
      .filter(o => o && o.id && o.id !== 'org-mttq' && !AI_GENERATED_SEEDS.has(o.id))
      .sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
  }, [organizations]);

  const [selectedOrg, setSelectedOrg] = useState<MemberOrganization | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'political' | 'social'>('all');
  const [showDiagramModal, setShowDiagramModal] = useState<boolean>(false);

  // Filter organizations based on category
  const filteredOrgs = sortedOrgs.filter(org => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'political') {
      // Đoàn TNCS, Hội LHTN, Hội Phụ nữ, Hội CCB, Công đoàn, MTTQ
      return ['org-mttq', 'org-dtn', 'org-lhtn', 'org-lhph', 'org-ccb', 'org-congdoan', 'org-tnxp', 'org-luat-gia'].includes(org.id) ||
        ['DTN-CH', 'LHTN-CH', 'HPN-CH', 'CCB-CH', 'CD-CH', 'MTTQ-CH', 'TNXP-CH', 'HLG-CH'].includes(org.code);
    }
    if (activeCategory === 'social') {
      // Hội Chữ thập đỏ, Hội Người cao tuổi, Hội Khuyến học
      return ['org-ctd', 'org-nct', 'org-hkk'].includes(org.id) ||
        ['CTD-CH', 'NCT-CH', 'HKH-CH'].includes(org.code);
    }
    return true;
  });

  const totalMembers = sortedOrgs.reduce((a, b) => a + (b.activeMembersCount || 0), 0);
  const totalBranches = sortedOrgs.reduce((a, b) => a + (b.branchesCount || 0), 0);

  // Helper styling for organization tags
  const getOrgBadgeStyle = (code: string) => {
    switch (code) {
      case 'DTN-CH':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'LHTN-CH':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'HPN-CH':
        return 'bg-pink-50 text-pink-800 border-pink-200';
      case 'CCB-CH':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'CD-CH':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'CTD-CH':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'NCT-CH':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'HKH-CH':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Banner - Rich MTTQ & Mass Organizations Portal Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-300/30 text-xs font-black uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-cyan-300" />
              <span>Khối Đại Đoàn Kết Toàn Dân Tộc</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30 text-xs font-bold">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>6 Khối Đoàn Thể Nòng Cốt & 21 Khu Phố</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Khối Đoàn Thể & Tổ Chức Thành Viên Mặt Trận
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm font-medium leading-relaxed max-w-3xl">
            Ủy ban MTTQ Việt Nam Phường Chánh Hiệp giữ vai trò chủ trì liên minh chính trị, hiệp thương và phối hợp chặt chẽ cùng các tổ chức chính trị - xã hội (Đoàn TNCS Hồ Chí Minh, Hội Phụ nữ, Hội CCB, Công đoàn, Hội LHTN, Hội Chữ thập đỏ, Hội NCT, Hội Khuyến học) tập hợp hơn {totalMembers.toLocaleString('vi-VN')} đoàn viên, hội viên tại 21 khu phố.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/15">
              <div className="text-[10px] uppercase font-bold text-blue-200">Tổng lực lượng</div>
              <div className="text-lg sm:text-xl font-black text-amber-300">
                {totalMembers.toLocaleString('vi-VN')}
              </div>
              <div className="text-[10px] text-blue-100 font-medium">Đoàn/Hội viên cơ sở</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/15">
              <div className="text-[10px] uppercase font-bold text-blue-200">Mạng lưới Chi hội</div>
              <div className="text-lg sm:text-xl font-black text-white">
                {totalBranches}
              </div>
              <div className="text-[10px] text-blue-100 font-medium">Chi đoàn & Chi hội</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/15">
              <div className="text-[10px] uppercase font-bold text-blue-200">Độ phủ địa bàn</div>
              <div className="text-lg sm:text-xl font-black text-emerald-300">
                21 / 21
              </div>
              <div className="text-[10px] text-blue-100 font-medium">100% Khu phố mới</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/15">
              <div className="text-[10px] uppercase font-bold text-blue-200">Tổ chức nòng cốt</div>
              <div className="text-lg sm:text-xl font-black text-cyan-300">
                8+ Khối
              </div>
              <div className="text-[10px] text-blue-100 font-medium">Chính trị - Xã hội</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Diagram Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Tất cả tổ chức</span>
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black">
              {sortedOrgs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('political')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeCategory === 'political'
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            <span>Đoàn Thể Chính Trị - Xã Hội</span>
          </button>

          <button
            onClick={() => setActiveCategory('social')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeCategory === 'social'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-200" />
            <span>Tổ Chức Xã Hội &amp; Nhân Đạo</span>
          </button>
        </div>

        <button
          onClick={() => setShowDiagramModal(true)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <Network className="w-4 h-4 text-white" />
          <span>Xem Sơ Đồ Cây Tổ Chức</span>
        </button>
      </div>

      {/* Empty State or Grid of Member Organizations */}
      {sortedOrgs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              Chưa có tổ chức thành viên trong hệ thống
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Các dữ liệu mẫu do AI tạo sẵn đã được xóa sạch. Cán bộ quản lý có thể sử dụng chức năng <strong>Thêm tổ chức</strong> trong Văn phòng số để cập nhật danh sách tổ chức thành viên chính thức của địa phương.
            </p>
          </div>
          {onNavigateTab && (
            <div className="pt-2">
              <button
                onClick={() => onNavigateTab('member_orgs_admin')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <span>Đến Quản lý Tổ chức Thành viên</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrgs.map((org) => {
            const badgeClass = getOrgBadgeStyle(org.code);

            return (
              <motion.div
                key={org.id}
                whileHover={{ y: -3 }}
                className="p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between bg-white border-slate-200 hover:border-slate-300 shadow-xs"
              >
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3.5">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs p-1 flex items-center justify-center">
                      <OptimizedImage 
                        src={org.avatarUrl || getOfficialCadreAvatarSvg(org.name, org.shortName)} 
                        alt={org.name} 
                        variant="avatar"
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeClass}`}>
                        {org.shortName || org.name}
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-900 mt-1 leading-snug line-clamp-2">
                        {org.name}
                      </h3>
                    </div>
                  </div>

                  {org.description && (
                    <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                      "{org.description}"
                    </p>
                  )}

                  {/* Quick stats badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {org.branchesCount ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl">
                        <Building2 className="w-3 h-3 text-blue-600" />
                        <span>{org.branchesCount} chi hội/chi đoàn</span>
                      </span>
                    ) : null}
                    {org.activeMembersCount ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl">
                        <Users className="w-3 h-3 text-emerald-600" />
                        <span>{org.activeMembersCount.toLocaleString('vi-VN')} đoàn/hội viên</span>
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400">Đại diện phụ trách:</div>
                    <div className="font-black text-slate-800 text-xs truncate max-w-[170px]">
                      {org.leaderName || 'Đang cập nhật'} {org.leaderPosition ? <span className="text-[10px] text-slate-500 font-normal">({org.leaderPosition})</span> : null}
                    </div>
                  </div>
                  <span className="p-2 rounded-xl transition-colors bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Sơ đồ Cây Tổ chức Modal Popup */}
      {showDiagramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Network className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base uppercase tracking-tight">
                    Sơ Đồ Hệ Thống MTTQ &amp; Các Tổ Chức Thành Viên
                  </h3>
                  <p className="text-xs text-amber-200">Mô hình tổ chức nòng cốt &amp; mạng lưới trực thuộc</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDiagramModal(false)}
                className="p-2 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: High Resolution Visual Tree */}
            <div className="p-6 overflow-y-auto space-y-6 bg-slate-50 flex-1">
              {/* Level 1: UB MTTQ Phường */}
              <div className="flex flex-col items-center">
                <div className="bg-gradient-to-r from-red-700 to-amber-600 text-white p-4 rounded-2xl border-2 border-amber-300 shadow-md text-center max-w-xl w-full">
                  <div className="text-[10px] font-bold text-amber-200 uppercase">Cơ quan chủ trì khối đại đoàn kết</div>
                  <h4 className="font-black text-base uppercase">Ủy Ban Mặt Trận Tổ Quốc Việt Nam Phường</h4>
                  <div className="text-xs text-white/90 font-medium mt-1">Chủ tịch: <strong>Nguyễn Công Lý</strong> • 21 Ban Công tác Mặt trận</div>
                </div>

                {sortedOrgs.length > 0 && (
                  <>
                    <div className="w-0.5 h-6 bg-slate-400" />
                    <div className="w-11/12 h-0.5 bg-slate-400" />
                  </>
                )}
              </div>

              {/* Level 2: Dynamic Pillars Grid */}
              {sortedOrgs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md mx-auto text-slate-500">
                  <Building2 className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                  <p className="font-bold text-slate-700 text-sm">Chưa có tổ chức thành viên nào</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Các tổ chức tạo sẵn đã được gỡ bỏ. Vui lòng thêm các tổ chức thành viên chính thức từ menu quản trị văn phòng số.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {sortedOrgs.map((org) => (
                    <div key={org.id} className="bg-white rounded-2xl border-2 border-slate-300 p-3 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="bg-red-600 text-white text-[11px] font-black p-2 rounded-xl text-center uppercase">
                          {org.shortName || org.name}
                        </div>
                        {org.description && (
                          <p className="text-[10px] text-slate-600 italic mt-2 text-center line-clamp-2">
                            "{org.description}"
                          </p>
                        )}
                        <div className="mt-3 space-y-1 text-[10px]">
                          <div className="bg-slate-100 p-1.5 rounded-lg font-bold text-slate-800">
                            • Phụ trách: {org.leaderName || 'Đang cập nhật'}
                          </div>
                          {org.branchesCount ? (
                            <div className="bg-slate-100 p-1.5 rounded-lg font-bold text-slate-800">
                              • {org.branchesCount} chi hội/chi đoàn
                            </div>
                          ) : null}
                        </div>
                      </div>
                      {org.activeMembersCount ? (
                        <div className="mt-3 text-center text-[10px] font-black text-red-700 pt-2 border-t border-slate-100">
                          {org.activeMembersCount.toLocaleString('vi-VN')} Đoàn/Hội viên
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}

              {/* Footer Motto */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white text-center">
                <div className="text-xs font-black uppercase text-amber-300">SỨ MỆNH CHUNG</div>
                <p className="text-xs text-blue-100 mt-1 max-w-3xl mx-auto leading-relaxed">
                  "Phát huy sức mạnh khối đại đoàn kết toàn dân tộc, vận động Nhân dân thực hiện chủ trương của Đảng, chính sách pháp luật của Nhà nước; tham gia xây dựng Đảng, chính quyền vững mạnh; xây dựng phường văn minh, giàu đẹp, nghĩa tình."
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Bản quyền số hóa: Ủy ban MTTQ Việt Nam Phường Chánh Hiệp</span>
              <button
                onClick={() => setShowDiagramModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Đóng sơ đồ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
