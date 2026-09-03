import React, { useState } from 'react';
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
  Flag
} from 'lucide-react';
import { motion } from 'motion/react';
import { MemberOrganization } from '../types';
import { INITIAL_MEMBER_ORGANIZATIONS } from '../data/seedData';

export const MemberOrganizationsSection: React.FC<{
  organizations?: MemberOrganization[];
  onSelectArticleTopic?: (topic: string) => void;
}> = ({ 
  organizations = INITIAL_MEMBER_ORGANIZATIONS,
  onSelectArticleTopic 
}) => {
  // Sort by display order
  const sortedOrgs = [...organizations].sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
  const [selectedOrg, setSelectedOrg] = useState<MemberOrganization>(sortedOrgs[0] || INITIAL_MEMBER_ORGANIZATIONS[0]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-300/30 text-xs font-black uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-cyan-300" />
            <span>Khối Đại Đoàn Kết Toàn Dân Tộc</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Tổ Chức Thành Viên & Số Liệu Công Tác Mặt Trận
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm font-medium leading-relaxed">
            Ủy ban MTTQ Việt Nam Phường Chánh Hiệp phối hợp cùng các tổ chức chính trị - xã hội, tổ chức xã hội phát huy sức mạnh tổng hợp của hơn {organizations.reduce((a, b) => a + (b.activeMembersCount || 0), 0).toLocaleString('vi-VN')} đoàn viên, hội viên tại 21 khu phố.
          </p>
        </div>
      </div>

      {/* Grid of Member Organizations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedOrgs.map((org) => {
          const isSelected = selectedOrg?.id === org.id;
          return (
            <motion.div
              key={org.id}
              whileHover={{ y: -3 }}
              onClick={() => setSelectedOrg(org)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected 
                  ? 'bg-blue-50/70 border-blue-500 shadow-lg ring-2 ring-blue-500/20' 
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs">
                    <img 
                      src={org.avatarUrl || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=300'} 
                      alt={org.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
                      {org.shortName}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900 mt-1 leading-snug line-clamp-2">
                      {org.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                  {org.description}
                </p>

                {/* Quick stats badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl">
                    <Building2 className="w-3 h-3 text-blue-600" />
                    <span>{org.branchesCount || 12} chi hội/chi đoàn</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl">
                    <Users className="w-3 h-3 text-emerald-600" />
                    <span>{(org.activeMembersCount || 0).toLocaleString('vi-VN')} đoàn viên/hội viên</span>
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] font-bold text-slate-400">Đại diện phụ trách:</div>
                  <div className="font-black text-slate-800">{org.leaderName}</div>
                </div>
                <span className="p-2 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Org Detailed Focus */}
      {selectedOrg && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-56 h-48 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs">
              <img 
                src={selectedOrg.bannerUrl || selectedOrg.avatarUrl || ''} 
                alt={selectedOrg.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Tổ chức thành viên nòng cốt</span>
                </span>
                {selectedOrg.establishedYear && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>Năm thành lập: {selectedOrg.establishedYear}</span>
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {selectedOrg.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {selectedOrg.description}
              </p>

              {/* Detailed Organization Stats Dashboard */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
                  <div className="text-[10px] font-bold text-blue-600 uppercase">Mạng lưới cơ sở</div>
                  <div className="font-black text-slate-900 text-sm sm:text-base mt-0.5">
                    {selectedOrg.branchesCount || 21} <span className="text-xs font-semibold text-slate-500">chi hội/chi đoàn</span>
                  </div>
                  <div className="text-[10px] text-blue-700 font-bold mt-1">Phủ khắp {selectedOrg.neighborhoodsCoveredCount || 21}/21 khu phố</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <div className="text-[10px] font-bold text-emerald-600 uppercase">Đoàn viên / Hội viên</div>
                  <div className="font-black text-slate-900 text-sm sm:text-base mt-0.5">
                    {(selectedOrg.activeMembersCount || 0).toLocaleString('vi-VN')} <span className="text-xs font-semibold text-slate-500">người</span>
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold mt-1">
                    Tỉ lệ tập hợp: {selectedOrg.gatheringRatio || '85%'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
                  <div className="text-[10px] font-bold text-purple-600 uppercase">Hội viên Nữ / Đảng viên</div>
                  <div className="font-black text-slate-900 text-sm sm:text-base mt-0.5">
                    {selectedOrg.femaleMembersCount || 0} <span className="text-xs font-semibold text-slate-500">nữ</span>
                  </div>
                  <div className="text-[10px] text-purple-700 font-bold mt-1">
                    {selectedOrg.partyMembersCount || 0} Đảng viên tham gia
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
                  <div className="text-[10px] font-bold text-amber-600 uppercase">Lãnh đạo & BCH</div>
                  <div className="font-black text-slate-900 text-xs sm:text-sm mt-0.5 truncate">
                    {selectedOrg.leaderName}
                  </div>
                  <div className="text-[10px] text-amber-800 font-bold truncate">
                    {selectedOrg.leaderPosition} ({selectedOrg.executiveCommitteeMembersCount || 11} BCH)
                  </div>
                </div>
              </div>

              {/* Featured Achievements Tag List */}
              {selectedOrg.featuredAchievements && selectedOrg.featuredAchievements.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Mô hình tiêu biểu & Thành tích nổi bật:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrg.featuredAchievements.map((ach, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1 rounded-xl">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{ach}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact info footer */}
              <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <span className="flex items-center gap-1.5 font-bold">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>SĐT: {selectedOrg.phone}</span>
                </span>
                <span className="flex items-center gap-1.5 font-bold">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Email: {selectedOrg.email}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
