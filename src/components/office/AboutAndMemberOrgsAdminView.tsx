import React, { useState } from 'react';
import { 
  Building, 
  Users, 
  ShieldCheck, 
  Info, 
  Sparkles, 
  Layers, 
  Network, 
  GitBranch, 
  Building2,
  Flag,
  Share2
} from 'lucide-react';
import { AboutAdminView } from './AboutAdminView';
import { MemberOrganizationsAdminView } from './MemberOrganizationsAdminView';
import { MemberOrganization, Organization, Area } from '../../types';
import { AppStorageEngine } from '../../lib/storage';
import { CloudDatabase } from '../../lib/firestoreService';

interface AboutAndMemberOrgsAdminViewProps {
  initialSubTab?: 'ABOUT_MTTQ' | 'MEMBER_ORGS' | 'POLITICAL_SYSTEM' | 'ORG_DIAGRAM';
  organizations?: MemberOrganization[];
  onSaveOrganizations?: (orgs: MemberOrganization[]) => void;
  politicalOrganizations?: Organization[];
  onSavePoliticalOrganizations?: (orgs: Organization[]) => void;
  areas?: Area[];
  onSaveAreas?: (areas: Area[]) => void;
  onShowToast?: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  onNavigateTab?: (tab: string) => void;
}

export const AboutAndMemberOrgsAdminView: React.FC<AboutAndMemberOrgsAdminViewProps> = ({
  initialSubTab = 'ABOUT_MTTQ',
  organizations: propOrganizations,
  onSaveOrganizations: propOnSaveOrganizations,
  politicalOrganizations: propPoliticalOrganizations,
  onSavePoliticalOrganizations: propOnSavePoliticalOrganizations,
  areas: propAreas,
  onSaveAreas: propOnSaveAreas,
  onShowToast,
  onNavigateTab
}) => {
  const [activeTab, setActiveTab] = useState<'ABOUT_MTTQ' | 'MEMBER_ORGS' | 'POLITICAL_SYSTEM' | 'ORG_DIAGRAM'>(initialSubTab);

  // Storage states if not provided as props
  const [internalOrgs, setInternalOrgs] = useState<MemberOrganization[]>(() => propOrganizations || AppStorageEngine.getMemberOrganizations());
  const organizations = propOrganizations || internalOrgs;
  const handleSaveOrganizations = (orgs: MemberOrganization[]) => {
    if (propOnSaveOrganizations) {
      propOnSaveOrganizations(orgs);
    } else {
      setInternalOrgs(orgs);
      AppStorageEngine.saveMemberOrganizations(orgs);
      CloudDatabase.saveAllMemberOrganizations(orgs);
    }
  };

  const [internalPoliticalOrgs, setInternalPoliticalOrgs] = useState<Organization[]>(() => propPoliticalOrganizations || AppStorageEngine.getOrganizations());
  const politicalOrgs = propPoliticalOrganizations || internalPoliticalOrgs;
  const handleSavePoliticalOrgs = (orgs: Organization[]) => {
    if (propOnSavePoliticalOrganizations) {
      propOnSavePoliticalOrganizations(orgs);
    } else {
      setInternalPoliticalOrgs(orgs);
      AppStorageEngine.saveOrganizations(orgs);
      CloudDatabase.saveAllOrganizations(orgs);
    }
  };

  const [internalAreas, setInternalAreas] = useState<Area[]>(() => propAreas || AppStorageEngine.getAreas());
  const areas = propAreas || internalAreas;
  const handleSaveAreas = (newAreas: Area[]) => {
    if (propOnSaveAreas) {
      propOnSaveAreas(newAreas);
    } else {
      setInternalAreas(newAreas);
      AppStorageEngine.saveAreas(newAreas);
      CloudDatabase.saveAllAreas(newAreas);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Main Unified Navigation Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl shadow-md">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold text-[10px] uppercase tracking-wider">
                  CƠ CẤU TỔ CHỨC &amp; GIỚI THIỆU
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                  HỢP NHẤT
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Giới Thiệu MTTQ &amp; Quản Lý Tổ Chức Thành Viên
              </h1>
              <p className="text-xs text-slate-500">
                Quản lý toàn diện thông tin Ủy ban MTTQ Việt Nam phường, 5 tổ chức đoàn thể chính trị - xã hội và Hệ thống chính trị địa phương.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Unified Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('ABOUT_MTTQ')}
            className={`px-4 py-2.5 rounded-2xl font-extrabold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'ABOUT_MTTQ'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>1. Giới thiệu MTTQ &amp; Ban Thường trực</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MEMBER_ORGS')}
            className={`px-4 py-2.5 rounded-2xl font-extrabold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'MEMBER_ORGS'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. Các Tổ chức Thành viên ({organizations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('POLITICAL_SYSTEM')}
            className={`px-4 py-2.5 rounded-2xl font-extrabold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'POLITICAL_SYSTEM'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>3. Hệ thống Chính trị Phường</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ORG_DIAGRAM')}
            className={`px-4 py-2.5 rounded-2xl font-extrabold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'ORG_DIAGRAM'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>4. Sơ đồ Tổ chức &amp; Cây Đoàn thể</span>
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {activeTab === 'ABOUT_MTTQ' && (
        <AboutAdminView onShowToast={onShowToast} />
      )}

      {activeTab === 'MEMBER_ORGS' && (
        <MemberOrganizationsAdminView
          key="tab_member_orgs"
          initialMainTab="member_orgs"
          initialViewMode="table"
          organizations={organizations}
          onSaveOrganizations={handleSaveOrganizations}
          politicalOrganizations={politicalOrgs}
          onSavePoliticalOrganizations={handleSavePoliticalOrgs}
          areas={areas}
          onSaveAreas={handleSaveAreas}
          onShowToast={onShowToast}
          onNavigateTab={onNavigateTab}
        />
      )}

      {activeTab === 'POLITICAL_SYSTEM' && (
        <MemberOrganizationsAdminView
          key="tab_political_system"
          initialMainTab="political_system"
          organizations={organizations}
          onSaveOrganizations={handleSaveOrganizations}
          politicalOrganizations={politicalOrgs}
          onSavePoliticalOrganizations={handleSavePoliticalOrgs}
          areas={areas}
          onSaveAreas={handleSaveAreas}
          onShowToast={onShowToast}
          onNavigateTab={onNavigateTab}
        />
      )}

      {activeTab === 'ORG_DIAGRAM' && (
        <MemberOrganizationsAdminView
          key="tab_org_diagram"
          initialMainTab="member_orgs"
          initialViewMode="diagram"
          organizations={organizations}
          onSaveOrganizations={handleSaveOrganizations}
          politicalOrganizations={politicalOrgs}
          onSavePoliticalOrganizations={handleSavePoliticalOrgs}
          areas={areas}
          onSaveAreas={handleSaveAreas}
          onShowToast={onShowToast}
          onNavigateTab={onNavigateTab}
        />
      )}
    </div>
  );
};
