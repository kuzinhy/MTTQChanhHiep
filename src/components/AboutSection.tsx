import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  FileText,
  HeartHandshake,
  Star,
  Sparkles,
  Edit3
} from 'lucide-react';
import { motion } from 'motion/react';
import { getOfficialCadreAvatarSvg } from '../utils/officialImages';
import { loadStoredAboutData, AboutPageData } from '../lib/aboutDataStore';

export const AboutSection: React.FC<{
  onGoToTab?: (tab: string) => void;
  isAdmin?: boolean;
}> = ({ onGoToTab, isAdmin = true }) => {
  const [aboutData, setAboutData] = useState<AboutPageData>(() => loadStoredAboutData());

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setAboutData(e.detail);
      } else {
        setAboutData(loadStoredAboutData());
      }
    };
    window.addEventListener('mttq_about_data_updated', handleUpdate);
    return () => window.removeEventListener('mttq_about_data_updated', handleUpdate);
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-300/30 text-xs font-black uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>{aboutData.motto || 'Đoàn Kết – Dân Chủ – Đồng Thuận – Phát Triển'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            {aboutData.headerTitle}
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm font-medium leading-relaxed">
            {aboutData.headerSubtitle}
          </p>
        </div>
      </div>

      {/* Pillars Summary */}
      {aboutData.pillars && aboutData.pillars.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {aboutData.pillars.map((pillar, idx) => (
            <div key={pillar.id || idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-black">
                {idx === 0 ? <Users className="w-6 h-6" /> : idx === 1 ? <ShieldCheck className="w-6 h-6" /> : <HeartHandshake className="w-6 h-6" />}
              </div>
              <h3 className="font-extrabold text-base text-slate-900">{pillar.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Leadership & Contact Structure */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 font-extrabold text-[11px] uppercase tracking-wider mb-1">
              <span>{aboutData.termSubtitle || 'ĐƠN VỊ CÔNG TÁC THƯỜNG TRỰC'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              {aboutData.termTitle}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
              {aboutData.members?.length || 0} Đồng chí Thường trực
            </span>
          </div>
        </div>

        {/* Personnel Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {aboutData.members.map((m, idx) => {
            const avatar = m.avatarUrl || getOfficialCadreAvatarSvg(m.name, m.position);
            const isLeader = m.isMainLeader || idx === 0;

            return (
              <div 
                key={m.id || idx} 
                className={`p-4 rounded-2xl space-y-2 shadow-xs transition ${
                  isLeader 
                    ? 'bg-gradient-to-b from-red-50/80 to-amber-50/50 border-2 border-red-200 hover:border-red-400' 
                    : 'bg-slate-50 border border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-slate-200 overflow-hidden mx-auto mb-2 border ${isLeader ? 'border-2 border-red-300' : 'border-slate-300'}`}>
                  <img src={avatar} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center space-y-1">
                  <span className={`inline-block px-2 py-0.5 rounded-md font-extrabold text-[10px] ${isLeader ? 'bg-red-700 text-white' : 'bg-slate-200 text-slate-800'}`}>
                    STT {String(m.stt || idx + 1).padStart(2, '0')}
                  </span>
                  <div className="font-black text-sm text-slate-900">{m.name}</div>
                  <div className={`text-[11px] font-extrabold leading-snug ${isLeader ? 'text-red-700' : 'text-blue-700'}`}>
                    {m.position}
                  </div>
                  {m.secondaryPosition && (
                    <div className="text-[10px] font-semibold text-slate-600">{m.secondaryPosition}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Official Personnel Table */}
        <div className="mt-6 border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="bg-slate-900 text-white px-5 py-3 font-extrabold text-xs flex items-center justify-between">
            <span>DANH SÁCH {aboutData.termTitle.toUpperCase()}</span>
            <span className="text-[10px] text-amber-300 font-bold">Cập nhật chính thức</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 font-black">
                  <th className="py-3 px-4 text-center w-16 border-r border-slate-200">STT</th>
                  <th className="py-3 px-4 border-r border-slate-200">Tên đơn vị trực thuộc</th>
                  <th className="py-3 px-4 border-r border-slate-200 font-bold text-red-700">Họ và tên</th>
                  <th className="py-3 px-4 font-bold text-red-700">Chức vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {aboutData.members.map((m, idx) => (
                  <tr key={m.id || idx} className={`transition ${m.isMainLeader || idx === 0 ? 'hover:bg-red-50/50' : 'hover:bg-slate-50'}`}>
                    <td className="py-3 px-4 text-center font-bold text-red-700 border-r border-slate-200">{m.stt || idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-red-700 border-r border-slate-200">{m.unit || 'Ủy ban MTTQ VN phường'}</td>
                    <td className="py-3 px-4 font-extrabold text-red-700 border-r border-slate-200">{m.name}</td>
                    <td className="py-3 px-4 font-semibold text-red-700">
                      {m.position}{m.secondaryPosition ? `, ${m.secondaryPosition}` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Official Address & Info */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-3 text-slate-600 font-medium">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{aboutData.address}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600 font-medium">
            <Phone className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Hotline: {aboutData.hotline}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600 font-medium">
            <Mail className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{aboutData.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
