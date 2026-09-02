import React, { useState } from 'react';
import { 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  Award, 
  ChevronRight, 
  ExternalLink,
  Shield,
  Heart,
  Sparkles,
  ArrowUpRight
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
  const [selectedOrg, setSelectedOrg] = useState<MemberOrganization>(organizations[0] || INITIAL_MEMBER_ORGANIZATIONS[0]);

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
            Các Tổ Chức Thành Viên MTTQ Phường
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm font-medium leading-relaxed">
            Ủy ban MTTQ Việt Nam Phường Chánh Hiệp là cơ sở chính trị của chính quyền nhân dân, nơi tập hợp và phát huy sức mạnh khối liên minh công - nông - trí thức và các tầng lớp nhân dân.
          </p>
        </div>
      </div>

      {/* Grid of Member Organizations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {organizations.map((org) => {
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

                <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                  {org.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] font-bold text-slate-400">Đại diện lãnh đạo:</div>
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
            <div className="w-full md:w-48 h-40 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
              <img 
                src={selectedOrg.bannerUrl || selectedOrg.avatarUrl || ''} 
                alt={selectedOrg.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                <Shield className="w-3.5 h-3.5" />
                <span>Tổ chức thành viên nòng cốt</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {selectedOrg.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {selectedOrg.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Lãnh đạo phụ trách</div>
                  <div className="font-black text-slate-900 text-xs mt-0.5">{selectedOrg.leaderName}</div>
                  <div className="text-[10px] text-blue-700 font-bold">{selectedOrg.leaderPosition}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Đoàn viên / Hội viên</div>
                  <div className="font-black text-slate-900 text-xs mt-0.5">{selectedOrg.activeMembersCount || 0} hội viên</div>
                  <div className="text-[10px] text-emerald-700 font-bold">21 chi hội khu phố</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Đường dây liên hệ</div>
                  <div className="font-black text-slate-900 text-xs mt-0.5">{selectedOrg.phone}</div>
                  <div className="text-[10px] text-slate-500 font-medium truncate">{selectedOrg.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
