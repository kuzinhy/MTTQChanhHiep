import React, { useState, useMemo } from 'react';
import { ARTICLE_BANNERS, getOfficialCadreAvatarSvg } from '../../utils/officialImages';
import { 
  MemberOrganization, 
  MemberOrganizationNode, 
  Organization, 
  Area, 
  OrganizationLevel 
} from '../../types';
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  Building2, 
  Sparkles, 
  Award, 
  ChevronRight, 
  ChevronDown, 
  X, 
  Save, 
  ArrowUp, 
  ArrowDown, 
  Layers, 
  Flag, 
  BarChart3, 
  ListOrdered,
  Network,
  GitBranch,
  MapPin,
  CornerDownRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { uploadFileToGoogleDrive } from '../../lib/googleDriveService';
import { INITIAL_MEMBER_ORGANIZATIONS, INITIAL_ORGANIZATIONS, INITIAL_AREAS } from '../../data/seedData';
import { CloudDatabase } from '../../lib/firestoreService';
import { AppStorageEngine } from '../../lib/storage';
import { exportOrganizationsToCsv } from '../../lib/exportUtils';
import { Download, LayoutGrid } from 'lucide-react';
import { OrgDiagramChart } from './OrgDiagramChart';

interface MemberOrganizationsAdminViewProps {
  organizations: MemberOrganization[];
  onSaveOrganizations: (orgs: MemberOrganization[]) => void;
  politicalOrganizations?: Organization[];
  onSavePoliticalOrganizations?: (orgs: Organization[]) => void;
  areas?: Area[];
  onSaveAreas?: (areas: Area[]) => void;
  onShowToast?: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const MemberOrganizationsAdminView: React.FC<MemberOrganizationsAdminViewProps> = ({
  organizations,
  onSaveOrganizations,
  politicalOrganizations: propPoliticalOrganizations,
  onSavePoliticalOrganizations: propOnSavePoliticalOrganizations,
  areas: propAreas,
  onSaveAreas: propOnSaveAreas,
  onShowToast
}) => {
  // Active Main Tab: 'member_orgs' (Khối MTTQ & Đoàn thể) | 'political_system' (Hệ thống chính trị) | 'areas' (Địa bàn hành chính)
  const [mainTab, setMainTab] = useState<'member_orgs' | 'political_system' | 'areas'>('member_orgs');

  // View modes for Member Organizations: 'diagram' | 'tree' | 'grid' | 'table' | 'analytics'
  const [viewMode, setViewMode] = useState<'diagram' | 'tree' | 'grid' | 'table' | 'analytics'>('diagram');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>('all');
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set(['mem-org-1', 'mem-org-2', 'mem-org-3', 'mem-org-4', 'org-dang-uy', 'org-mttq']));

  // Internal storage states for Areas & Political Organizations if not provided as props
  const [internalAreas, setInternalAreas] = useState<Area[]>(() => propAreas || AppStorageEngine.getAreas());
  const areas = propAreas || internalAreas;
  const saveAreas = (newAreas: Area[]) => {
    if (propOnSaveAreas) {
      propOnSaveAreas(newAreas);
    } else {
      setInternalAreas(newAreas);
      AppStorageEngine.saveAreas(newAreas);
      CloudDatabase.saveAllAreas(newAreas);
    }
  };

  const [internalPoliticalOrgs, setInternalPoliticalOrgs] = useState<Organization[]>(() => propPoliticalOrganizations || AppStorageEngine.getOrganizations());
  const politicalOrgs = propPoliticalOrganizations || internalPoliticalOrgs;
  const savePoliticalOrgs = (newOrgs: Organization[]) => {
    if (propOnSavePoliticalOrganizations) {
      propOnSavePoliticalOrganizations(newOrgs);
    } else {
      setInternalPoliticalOrgs(newOrgs);
      AppStorageEngine.saveOrganizations(newOrgs);
      CloudDatabase.saveAllOrganizations(newOrgs);
    }
  };

  // Modal State for MemberOrganization
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [modalTab, setModalTab] = useState<'info' | 'hierarchy' | 'stats' | 'media'>('info');
  const [formData, setFormData] = useState<Partial<MemberOrganization>>({});
  const [newAchievement, setNewAchievement] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  // Modal State for Area
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [areaFormData, setAreaFormData] = useState<Partial<Area>>({});

  // Sort member organizations by displayOrder ascending
  const sortedOrgs = useMemo(() => {
    return [...organizations].sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
  }, [organizations]);

  // Filter organizations by search term & area filter
  const filteredOrgs = useMemo(() => {
    return sortedOrgs.filter(org => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        org.name.toLowerCase().includes(term) ||
        org.shortName.toLowerCase().includes(term) ||
        (org.leaderName && org.leaderName.toLowerCase().includes(term)) ||
        (org.description && org.description.toLowerCase().includes(term)) ||
        (org.areaName && org.areaName.toLowerCase().includes(term));
      
      const matchesArea = selectedAreaFilter === 'all' || org.areaId === selectedAreaFilter;
      return matchesSearch && matchesArea;
    });
  }, [sortedOrgs, searchTerm, selectedAreaFilter]);

  // Build hierarchical tree for Member Organizations
  const memberOrgTree = useMemo(() => {
    const nodeMap = new Map<string, MemberOrganizationNode>();
    const areaMap = new Map<string, Area>(areas.map(a => [a.id, a]));

    filteredOrgs.forEach(o => {
      nodeMap.set(o.id, {
        ...o,
        children: [],
        area: o.areaId ? areaMap.get(o.areaId) : undefined
      });
    });

    const roots: MemberOrganizationNode[] = [];
    filteredOrgs.forEach(o => {
      const node = nodeMap.get(o.id);
      if (node) {
        if (o.parentId && nodeMap.has(o.parentId)) {
          const parentNode = nodeMap.get(o.parentId)!;
          node.parent = parentNode;
          parentNode.children.push(node);
        } else {
          roots.push(node);
        }
      }
    });

    return roots;
  }, [filteredOrgs, areas]);

  // Build hierarchical tree for Political Organizations
  const politicalOrgTree = useMemo(() => {
    const nodeMap = new Map<string, any>();
    const areaMap = new Map<string, Area>(areas.map(a => [a.id, a]));

    politicalOrgs.forEach(o => {
      nodeMap.set(o.id, {
        ...o,
        children: [],
        area: o.areaId ? areaMap.get(o.areaId) : undefined
      });
    });

    const roots: any[] = [];
    politicalOrgs.forEach(o => {
      const node = nodeMap.get(o.id);
      if (node) {
        if (o.parentId && nodeMap.has(o.parentId)) {
          const parentNode = nodeMap.get(o.parentId)!;
          parentNode.children.push(node);
        } else {
          roots.push(node);
        }
      }
    });

    return roots;
  }, [politicalOrgs, areas]);

  // Aggregated Organizational Work Metrics
  const totalOrgs = organizations.length;
  const totalBranches = organizations.reduce((acc, curr) => acc + (curr.branchesCount || 21), 0);
  const totalMembers = organizations.reduce((acc, curr) => acc + (curr.activeMembersCount || 0), 0);
  const totalFemaleMembers = organizations.reduce((acc, curr) => acc + (curr.femaleMembersCount || 0), 0);
  const totalYouthMembers = organizations.reduce((acc, curr) => acc + (curr.youthMembersCount || 0), 0);
  const totalPartyMembers = organizations.reduce((acc, curr) => acc + (curr.partyMembersCount || 0), 0);
  const totalProjects = organizations.reduce((acc, curr) => acc + (curr.keyProjectsCount || 0), 0);

  // Toggle tree node expansion
  const toggleNodeExpansion = (nodeId: string) => {
    setExpandedNodeIds(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // Expand all / Collapse all
  const handleExpandAll = () => {
    const allIds = new Set<string>();
    organizations.forEach(o => allIds.add(o.id));
    politicalOrgs.forEach(o => allIds.add(o.id));
    setExpandedNodeIds(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedNodeIds(new Set());
  };

  // Reordering handlers (Thay đổi thứ tự hiển thị)
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const list = [...sortedOrgs];
    const temp = list[index];
    list[index] = list[index - 1];
    list[index - 1] = temp;

    const reordered = list.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1
    }));

    onSaveOrganizations(reordered);
    CloudDatabase.saveAllMemberOrganizations(reordered);
    if (onShowToast) onShowToast(`Đã di chuyển "${temp.shortName}" lên vị trí ${index}`, 'success');
  };

  const handleMoveDown = (index: number) => {
    if (index >= sortedOrgs.length - 1) return;
    const list = [...sortedOrgs];
    const temp = list[index];
    list[index] = list[index + 1];
    list[index + 1] = temp;

    const reordered = list.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1
    }));

    onSaveOrganizations(reordered);
    CloudDatabase.saveAllMemberOrganizations(reordered);
    if (onShowToast) onShowToast(`Đã di chuyển "${temp.shortName}" xuống vị trí ${index + 2}`, 'success');
  };

  // Open Create Modal (with optional pre-selected parent)
  const handleOpenCreateModal = (prefilledParentId?: string) => {
    const parentOrg = prefilledParentId ? organizations.find(o => o.id === prefilledParentId) : null;
    setFormData({
      id: `mem-org-${Date.now()}`,
      slug: `to-chuc-${Date.now()}`,
      name: '',
      shortName: '',
      description: '',
      leaderName: '',
      leaderPosition: '',
      phone: '0274.3822.111',
      email: 'mttq.chanhhiep@gmail.com',
      displayOrder: sortedOrgs.length + 1,
      parentId: prefilledParentId || null,
      areaId: parentOrg?.areaId || 'area-chanh-hiep',
      level: prefilledParentId ? 'BRANCH' : 'WARD',
      status: 'ACTIVE',
      avatarUrl: getOfficialCadreAvatarSvg('MTTQ', 'Hội viên'),
      bannerUrl: ARTICLE_BANNERS.default,
      activeMembersCount: prefilledParentId ? 45 : 150,
      branchesCount: prefilledParentId ? 1 : 21,
      neighborhoodsCoveredCount: prefilledParentId ? 1 : 21,
      femaleMembersCount: prefilledParentId ? 25 : 80,
      youthMembersCount: prefilledParentId ? 20 : 50,
      partyMembersCount: prefilledParentId ? 5 : 20,
      executiveCommitteeMembersCount: prefilledParentId ? 5 : 11,
      gatheringRatio: '85%',
      programsCount: 5,
      keyProjectsCount: 2,
      establishedYear: new Date().getFullYear().toString(),
      featuredAchievements: ['Tổ chức sinh hoạt định kỳ vững mạnh xuất sắc'],
      createdAt: new Date().toISOString().split('T')[0]
    });
    setNewAchievement('');
    setAvatarFile(null);
    setBannerFile(null);
    setModalTab('info');
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleOpenEditModal = (org: MemberOrganization) => {
    setFormData({ 
      ...org,
      featuredAchievements: org.featuredAchievements || []
    });
    setNewAchievement('');
    setAvatarFile(null);
    setBannerFile(null);
    setModalTab('info');
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleDeleteOrg = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tổ chức "${name}" khỏi hệ thống?`)) {
      const updated = organizations.filter(o => o.id !== id);
      onSaveOrganizations(updated);
      CloudDatabase.deleteMemberOrganization(id);
      if (onShowToast) onShowToast(`Đã xóa tổ chức "${name}"`, 'success');
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Khôi phục danh sách tổ chức thành viên về dữ liệu chuẩn? Các cập nhật tùy chỉnh sẽ được làm mới.')) {
      onSaveOrganizations(INITIAL_MEMBER_ORGANIZATIONS);
      CloudDatabase.saveAllMemberOrganizations(INITIAL_MEMBER_ORGANIZATIONS);
      saveAreas(INITIAL_AREAS);
      savePoliticalOrgs(INITIAL_ORGANIZATIONS);
      if (onShowToast) onShowToast('Đã khôi phục dữ liệu cây tổ chức và địa bàn mặc định!', 'success');
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    setIsUploadingAvatar(true);
    try {
      const result = await uploadFileToGoogleDrive(avatarFile);
      const url = result.webViewLink || result.webContentLink || '';
      if (url) {
        setFormData(prev => ({ ...prev, avatarUrl: url }));
        if (onShowToast) onShowToast('Tải logo lên Google Drive thành công!', 'success');
      } else {
        throw new Error('Tải ảnh lên thất bại');
      }
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
          if (onShowToast) onShowToast('Đã lưu ảnh đại diện cục bộ!', 'info');
        }
      };
      reader.readAsDataURL(avatarFile);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleUploadBanner = async () => {
    if (!bannerFile) return;
    setIsUploadingBanner(true);
    try {
      const result = await uploadFileToGoogleDrive(bannerFile);
      const url = result.webViewLink || result.webContentLink || '';
      if (url) {
        setFormData(prev => ({ ...prev, bannerUrl: url }));
        if (onShowToast) onShowToast('Tải banner lên Google Drive thành công!', 'success');
      } else {
        throw new Error('Tải ảnh lên thất bại');
      }
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, bannerUrl: reader.result as string }));
          if (onShowToast) onShowToast('Đã lưu banner cục bộ!', 'info');
        }
      };
      reader.readAsDataURL(bannerFile);
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handleAddAchievement = () => {
    if (!newAchievement.trim()) return;
    const current = formData.featuredAchievements || [];
    setFormData(prev => ({
      ...prev,
      featuredAchievements: [...current, newAchievement.trim()]
    }));
    setNewAchievement('');
  };

  const handleRemoveAchievement = (idx: number) => {
    const current = formData.featuredAchievements || [];
    setFormData(prev => ({
      ...prev,
      featuredAchievements: current.filter((_, i) => i !== idx)
    }));
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.shortName) {
      if (onShowToast) onShowToast('Vui lòng nhập đầy đủ Tên tổ chức và Tên viết tắt!', 'warning');
      return;
    }

    // Resolve areaName if areaId provided
    let areaName = formData.areaName;
    if (formData.areaId) {
      const selectedArea = areas.find(a => a.id === formData.areaId);
      if (selectedArea) areaName = selectedArea.name;
    }

    const newOrg: MemberOrganization = {
      id: formData.id || `mem-org-${Date.now()}`,
      slug: formData.slug || formData.shortName.toLowerCase().replace(/\s+/g, '-'),
      name: formData.name,
      shortName: formData.shortName,
      description: formData.description || '',
      leaderName: formData.leaderName || 'Đang cập nhật',
      leaderPosition: formData.leaderPosition || 'Đại diện',
      phone: formData.phone || '0274.3822.111',
      email: formData.email || 'mttq.chanhhiep@gmail.com',
      displayOrder: Number(formData.displayOrder) || (sortedOrgs.length + 1),
      parentId: formData.parentId || null,
      areaId: formData.areaId || null,
      areaName,
      level: formData.level || 'WARD',
      status: formData.status || 'ACTIVE',
      avatarUrl: formData.avatarUrl || getOfficialCadreAvatarSvg(formData.name || 'MTTQ', formData.shortName || 'Tổ chức'),
      bannerUrl: formData.bannerUrl || ARTICLE_BANNERS.default,
      activeMembersCount: Number(formData.activeMembersCount) || 0,
      branchesCount: Number(formData.branchesCount) || 21,
      neighborhoodsCoveredCount: Number(formData.neighborhoodsCoveredCount) || 21,
      femaleMembersCount: Number(formData.femaleMembersCount) || 0,
      youthMembersCount: Number(formData.youthMembersCount) || 0,
      partyMembersCount: Number(formData.partyMembersCount) || 0,
      executiveCommitteeMembersCount: Number(formData.executiveCommitteeMembersCount) || 11,
      gatheringRatio: formData.gatheringRatio || '85%',
      programsCount: Number(formData.programsCount) || 0,
      keyProjectsCount: Number(formData.keyProjectsCount) || 0,
      establishedYear: formData.establishedYear || '1930',
      featuredAchievements: formData.featuredAchievements || [],
      createdAt: formData.createdAt || new Date().toISOString().split('T')[0]
    };

    let updatedList: MemberOrganization[];
    if (isEditing) {
      updatedList = organizations.map(o => o.id === newOrg.id ? newOrg : o);
      if (onShowToast) onShowToast(`Đã cập nhật thông tin và số liệu tổ chức "${newOrg.shortName}"!`, 'success');
    } else {
      updatedList = [newOrg, ...organizations];
      if (onShowToast) onShowToast(`Thêm mới tổ chức "${newOrg.shortName}" thành công!`, 'success');
    }

    updatedList.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));

    onSaveOrganizations(updatedList);
    CloudDatabase.saveMemberOrganization(newOrg);

    setIsEditing(false);
    setIsCreating(false);
  };

  // Recursive Tree Node Renderer for Member Organizations
  const renderMemberTreeNode = (node: MemberOrganizationNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodeIds.has(node.id);

    return (
      <div key={node.id} className="relative">
        <div 
          className={`group flex items-center justify-between p-3 rounded-2xl border transition-all ${
            depth === 0 
              ? 'bg-white border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md' 
              : 'bg-slate-50/70 border-slate-200/60 ml-6 sm:ml-10 hover:bg-white hover:border-blue-300'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Collapse / Expand Button */}
            {hasChildren ? (
              <button 
                onClick={() => toggleNodeExpansion(node.id)}
                className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all shrink-0 font-bold"
                title={isExpanded ? 'Thu gọn nhánh' : 'Mở rộng nhánh'}
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <div className="w-7 h-7 flex items-center justify-center shrink-0 text-slate-300">
                {depth > 0 ? <CornerDownRight className="w-4 h-4 text-slate-400" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
              </div>
            )}

            {/* Avatar / Logo */}
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-2xs">
              <img 
                src={node.avatarUrl || getOfficialCadreAvatarSvg(node.name, node.shortName)} 
                alt={node.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Organization Meta */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900 truncate">
                  {node.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black uppercase">
                  {node.shortName}
                </span>
                {node.areaName && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>{node.areaName}</span>
                  </span>
                )}
                {node.level && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                    {node.level === 'WARD' ? 'Cấp Phường' : node.level === 'NEIGHBORHOOD' ? 'Khu phố' : 'Chi hội / Chi đoàn'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                <span>Lãnh đạo: <strong className="text-slate-700 font-semibold">{node.leaderName}</strong> ({node.leaderPosition})</span>
                <span className="hidden sm:inline-block text-slate-300">•</span>
                <span className="hidden sm:inline-block">Hotline: <strong className="text-slate-700 font-semibold">{node.phone}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 pl-3">
            <div className="hidden md:flex items-center gap-3 text-right">
              <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Chi hội/Chi đoàn</div>
                <div className="text-xs font-black text-blue-700">{node.branchesCount || 0} cơ sở</div>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Đoàn/Hội viên</div>
                <div className="text-xs font-black text-emerald-700">{(node.activeMembersCount || 0).toLocaleString('vi-VN')}</div>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Đảng viên</div>
                <div className="text-xs font-black text-red-700">{node.partyMembersCount || 0}</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleOpenCreateModal(node.id)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors font-bold text-xs flex items-center gap-1"
                title="Thêm chi hội / chi đoàn con trực thuộc"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden lg:inline">Thêm nhánh</span>
              </button>
              <button
                onClick={() => handleOpenEditModal(node)}
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                title="Chỉnh sửa thông tin"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteOrg(node.id, node.shortName)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Xóa tổ chức"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Children Sub-Tree */}
        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-2 relative before:absolute before:left-3 sm:before:left-5 before:top-0 before:bottom-3 before:w-0.5 before:bg-blue-200">
            {node.children.map(child => renderMemberTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner - Electric Blue Zalo / zBusiness styling */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-blue-300/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-blue-100 border border-white/20 text-xs font-black uppercase tracking-wider backdrop-blur-xs">
              <Network className="w-3.5 h-3.5 text-cyan-300" />
              <span>Hệ Thống Phân Cấp & Quản Trị Khối Đại Đoàn Kết</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Quản Lý Cây Tổ Chức, Địa Bàn & Số Liệu Công Tác
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
              Thiết kế mô hình quan hệ phân cấp cây (Cấp trên - Đơn vị trực thuộc), liên kết với 21 Khu phố địa bàn, quản lý chi tiết số lượng chi hội/chi đoàn, lực lượng đoàn viên, hội viên và Đảng viên nòng cốt.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => {
                exportOrganizationsToCsv(organizations);
                if (onShowToast) onShowToast('Đã tải xuống danh bạ tổ chức và số liệu chi hội định dạng Excel/CSV!', 'success');
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 backdrop-blur-xs cursor-pointer"
              title="Xuất danh bạ và số liệu khối đoàn thể ra Excel/CSV"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Xuất Excel Danh bạ</span>
            </button>
            <button
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 backdrop-blur-xs cursor-pointer"
              title="Khôi phục cấu trúc chuẩn mặc định"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Khôi phục mặc định</span>
            </button>
            <button
              onClick={() => handleOpenCreateModal()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-blue-950 text-xs font-black shadow-lg shadow-cyan-400/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Tổ Chức / Chi Hội</span>
            </button>
          </div>
        </div>

        {/* Main Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-white/15 overflow-x-auto pb-1">
          <button
            onClick={() => setMainTab('member_orgs')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all shrink-0 ${
              mainTab === 'member_orgs'
                ? 'bg-white text-blue-900 shadow-md'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>MTTQ & Các Đoàn Thể ({organizations.length})</span>
          </button>

          <button
            onClick={() => setMainTab('political_system')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all shrink-0 ${
              mainTab === 'political_system'
                ? 'bg-white text-blue-900 shadow-md'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Hệ Thống Chính Trị & Cơ Quan ({politicalOrgs.length})</span>
          </button>

          <button
            onClick={() => setMainTab('areas')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all shrink-0 ${
              mainTab === 'areas'
                ? 'bg-white text-blue-900 shadow-md'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>21 Khu Phố & Địa Bàn ({areas.length})</span>
          </button>
        </div>
      </div>

      {/* Aggregate Statistics Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Tổ chức</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-slate-900">{totalOrgs}</div>
            <div className="text-[10px] text-blue-600 font-bold mt-0.5">Khối Đại đoàn kết</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Mạng lưới</span>
            <Layers className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-slate-900">{totalBranches}</div>
            <div className="text-[10px] text-cyan-700 font-bold mt-0.5">Chi hội / Chi đoàn</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Đoàn/Hội viên</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-slate-900">{totalMembers.toLocaleString('vi-VN')}</div>
            <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Lực lượng nòng cốt</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Hội viên Nữ</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-slate-900">{totalFemaleMembers.toLocaleString('vi-VN')}</div>
            <div className="text-[10px] text-purple-700 font-bold mt-0.5">
              {totalMembers > 0 ? `${Math.round((totalFemaleMembers / totalMembers) * 100)}% tổng số` : '0%'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Đảng viên</span>
            <Flag className="w-4 h-4 text-red-600" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-slate-900">{totalPartyMembers}</div>
            <div className="text-[10px] text-red-700 font-bold mt-0.5">Sinh hoạt đoàn thể</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Mô hình</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-slate-900">{totalProjects}</div>
            <div className="text-[10px] text-amber-700 font-bold mt-0.5">Công trình tiêu biểu</div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Area Filter & View Modes */}
      {mainTab === 'member_orgs' && (
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm tổ chức, chức vụ, lãnh đạo, chi hội..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Area Filter */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <select
                value={selectedAreaFilter}
                onChange={(e) => setSelectedAreaFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">Tất cả địa bàn</option>
                {areas.map(area => (
                  <option key={area.id} value={area.id}>{area.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 self-end lg:self-auto shrink-0 overflow-x-auto pb-1">
            <button
              onClick={() => setViewMode('diagram')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                viewMode === 'diagram' 
                  ? 'bg-red-700 text-white shadow-xs font-black' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Network className="w-3.5 h-3.5 text-amber-300" />
              <span>Sơ Đồ Tổ Chức</span>
            </button>

            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                viewMode === 'tree' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Cây Phân Cấp</span>
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Thẻ Card</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Bảng Thứ Tự</span>
            </button>

            <button
              onClick={() => setViewMode('analytics')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                viewMode === 'analytics' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Báo Cáo Số Liệu</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: MEMBER ORGANIZATIONS VIEWS (DIAGRAM / TREE / GRID / TABLE / ANALYTICS) */}
      {/* ========================================================================= */}
      {mainTab === 'member_orgs' && (
        <>
          {/* VIEW 0: INTERACTIVE VISUAL DIAGRAM VIEW */}
          {viewMode === 'diagram' && (
            <OrgDiagramChart
              organizations={organizations}
              areas={areas}
              onOpenEditModal={handleOpenEditModal}
              onShowToast={onShowToast}
            />
          )}

          {/* VIEW 1: HIERARCHICAL TREE VIEW */}
          {viewMode === 'tree' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-blue-600" />
                    <span>Cây Phân Cấp Khối Đại Đoàn Kết Phường Chánh Hiệp</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Hiển thị mối quan hệ phụ thuộc cấp trên - cấp dưới, đơn vị chủ quản và các chi hội trực thuộc 21 khu phố.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExpandAll}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    Mở rộng tất cả
                  </button>
                  <button
                    onClick={handleCollapseAll}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    Thu gọn
                  </button>
                </div>
              </div>

              {/* Tree Container */}
              <div className="space-y-3 pt-2">
                {memberOrgTree.length > 0 ? (
                  memberOrgTree.map(rootNode => renderMemberTreeNode(rootNode, 0))
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-bold">Không tìm thấy tổ chức nào phù hợp điều kiện lọc.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW 2: GRID VIEW */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredOrgs.map((org, index) => (
                <div 
                  key={org.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group"
                >
                  <div className="space-y-4">
                    {/* Header with Avatar & Actions */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-2xs">
                          <img 
                            src={org.avatarUrl || getOfficialCadreAvatarSvg(org.name, org.shortName)} 
                            alt={org.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                              Thứ tự #{org.displayOrder || (index + 1)}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">
                              {org.shortName}
                            </span>
                          </div>
                          <h3 className="font-extrabold text-sm text-slate-900 mt-0.5 line-clamp-1">
                            {org.name}
                          </h3>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEditModal(org)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa thông tin & số liệu"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrg(org.id, org.shortName)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa tổ chức"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {org.description}
                    </p>

                    {/* Key Metrics Pill Badges */}
                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Mạng lưới</div>
                        <div className="font-extrabold text-slate-800 text-xs mt-0.5">
                          {org.branchesCount || 21} <span className="text-[10px] text-slate-500 font-normal">chi hội/chi đoàn</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Đoàn viên/Hội viên</div>
                        <div className="font-extrabold text-slate-800 text-xs mt-0.5">
                          {(org.activeMembersCount || 0).toLocaleString('vi-VN')} <span className="text-[10px] text-slate-500 font-normal">người</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Leadership & Reorder buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400">Đại diện phụ trách:</div>
                      <div className="font-bold text-slate-800 text-xs truncate max-w-[140px]">{org.leaderName}</div>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1 hover:bg-white text-slate-600 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Di chuyển lên trên"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === filteredOrgs.length - 1}
                        className="p-1 hover:bg-white text-slate-600 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Di chuyển xuống dưới"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW 3: TABLE & REORDERING VIEW */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-black tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5 text-center w-20">Thứ tự</th>
                      <th className="px-4 py-3.5">Tổ chức thành viên</th>
                      <th className="px-4 py-3.5">Địa bàn</th>
                      <th className="px-4 py-3.5">Lãnh đạo phụ trách</th>
                      <th className="px-4 py-3.5 text-center">Chi hội/Chi đoàn</th>
                      <th className="px-4 py-3.5 text-center">Hội viên</th>
                      <th className="px-4 py-3.5 text-center">Đảng viên</th>
                      <th className="px-4 py-3.5 text-center">Mô hình</th>
                      <th className="px-4 py-3.5 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {filteredOrgs.map((org, index) => (
                      <tr key={org.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center">
                              {org.displayOrder || (index + 1)}
                            </span>
                            <div className="flex flex-col gap-0.5">
                              <button
                                onClick={() => handleMoveUp(index)}
                                disabled={index === 0}
                                className="p-0.5 hover:bg-slate-200 text-slate-600 rounded disabled:opacity-20"
                                title="Lên"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleMoveDown(index)}
                                disabled={index === filteredOrgs.length - 1}
                                className="p-0.5 hover:bg-slate-200 text-slate-600 rounded disabled:opacity-20"
                                title="Xuống"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img 
                              src={org.avatarUrl || getOfficialCadreAvatarSvg(org.name, org.shortName)} 
                              alt={org.name} 
                              className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="font-extrabold text-slate-900">{org.name}</div>
                              <div className="text-[10px] text-blue-700 font-bold">{org.shortName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                            <MapPin className="w-2.5 h-2.5" />
                            <span>{org.areaName || 'Toàn phường'}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{org.leaderName}</div>
                          <div className="text-[10px] text-slate-500">{org.leaderPosition}</div>
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-slate-900">
                          {org.branchesCount || 21}
                        </td>
                        <td className="px-4 py-3 text-center font-extrabold text-emerald-700">
                          {(org.activeMembersCount || 0).toLocaleString('vi-VN')}
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-red-700">
                          {org.partyMembersCount || 0}
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-amber-700">
                          {org.keyProjectsCount || 0}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEditModal(org)}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center gap-1 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Sửa</span>
                            </button>
                            <button
                              onClick={() => handleDeleteOrg(org.id, org.shortName)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 4: ANALYTICS / DETAILED REPORT VIEW */}
          {viewMode === 'analytics' && (
            <div className="space-y-6">
              {/* Detailed Breakdown Cards */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span>Bảng Tổng Hợp Số Liệu Công Tác Tổ Chức Chi Tiết</span>
                  </h3>
                  <div className="text-xs font-bold text-slate-500">
                    Cập nhật thời gian thực từ cơ sở
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1">
                    <span className="text-[11px] font-black text-blue-700 uppercase">Tổng đoàn viên thanh niên</span>
                    <div className="text-2xl font-black text-blue-900">{totalYouthMembers.toLocaleString('vi-VN')}</div>
                    <p className="text-[10px] text-blue-600 font-semibold">Đoàn TNCS Hồ Chí Minh & Hội LHTN</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                    <span className="text-[11px] font-black text-purple-700 uppercase">Tổng hội viên phụ nữ</span>
                    <div className="text-2xl font-black text-purple-900">{totalFemaleMembers.toLocaleString('vi-VN')}</div>
                    <p className="text-[10px] text-purple-600 font-semibold">Tỷ lệ {totalMembers > 0 ? Math.round((totalFemaleMembers / totalMembers) * 100) : 0}% tổng lực lượng</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 space-y-1">
                    <span className="text-[11px] font-black text-red-700 uppercase">Đảng viên trong đoàn thể</span>
                    <div className="text-2xl font-black text-red-900">{totalPartyMembers.toLocaleString('vi-VN')}</div>
                    <p className="text-[10px] text-red-600 font-semibold">Lực lượng nòng cốt chính trị</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                    <span className="text-[11px] font-black text-emerald-700 uppercase">Tỷ lệ tập hợp trung bình</span>
                    <div className="text-2xl font-black text-emerald-900">86.5%</div>
                    <p className="text-[10px] text-emerald-600 font-semibold">Đạt và vượt chỉ tiêu Nghị quyết</p>
                  </div>
                </div>

                {/* Grid Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredOrgs.map(org => (
                    <div key={org.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={org.avatarUrl || ''} 
                          alt={org.name} 
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" 
                        />
                        <div>
                          <div className="font-black text-slate-900 text-sm">{org.shortName}</div>
                          <div className="text-[10px] text-slate-500 font-medium">Lãnh đạo: {org.leaderName}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Chi hội/Chi đoàn</span>
                          <span className="font-extrabold text-blue-700 text-sm">{org.branchesCount || 21} cơ sở</span>
                        </div>

                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Đoàn/Hội viên</span>
                          <span className="font-extrabold text-emerald-700 text-sm">{(org.activeMembersCount || 0).toLocaleString('vi-VN')}</span>
                        </div>

                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Đoàn/Hội viên Nữ</span>
                          <span className="font-extrabold text-purple-700 text-sm">{org.femaleMembersCount || 0} người</span>
                        </div>

                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Là Đảng viên</span>
                          <span className="font-extrabold text-red-700 text-sm">{org.partyMembersCount || 0} người</span>
                        </div>
                      </div>

                      {org.featuredAchievements && org.featuredAchievements.length > 0 && (
                        <div className="pt-2 border-t border-slate-200/80">
                          <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Mô hình tiêu biểu:</div>
                          <ul className="text-xs space-y-1 text-slate-700">
                            {org.featuredAchievements.map((ach, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="line-clamp-1 font-medium">{ach}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Matrix of 21 Neighborhoods */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>Ma Trận Mạng Lưới Tổ Chức & Chi Hội Tại 21 Khu Phố</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-black">
                      <tr>
                        <th className="px-4 py-3">Địa bàn Khu phố</th>
                        <th className="px-4 py-3 text-center">Ban CT Mặt trận</th>
                        <th className="px-4 py-3 text-center">Chi hội Phụ nữ</th>
                        <th className="px-4 py-3 text-center">Chi đoàn Thanh niên</th>
                        <th className="px-4 py-3 text-center">Chi hội CCB</th>
                        <th className="px-4 py-3 text-center">Chi hội Nông dân</th>
                        <th className="px-4 py-3 text-center">Chữ thập đỏ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                      {areas.filter(a => a.type === 'NEIGHBORHOOD').map(area => (
                        <tr key={area.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                            <span>{area.name}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                              <Check className="w-3.5 h-3.5" /> Có
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                              <Check className="w-3.5 h-3.5" /> Có
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                              <Check className="w-3.5 h-3.5" /> Có
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                              <Check className="w-3.5 h-3.5" /> Có
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                              <Check className="w-3.5 h-3.5" /> Có
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                              <Check className="w-3.5 h-3.5" /> Có
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: POLITICAL ORGANIZATIONS (HỆ THỐNG CHÍNH TRỊ & NHÀ NƯỚC) */}
      {/* ========================================================================= */}
      {mainTab === 'political_system' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>Cây Hệ Thống Chính Trị & Cơ Quan Nhà Nước Phường Chánh Hiệp</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Cơ cấu Đảng bộ, Hội đồng Nhân dân, Ủy ban Nhân dân, Ủy ban MTTQ và các lực lượng vũ trang địa phương.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {politicalOrgTree.map((node: any) => (
              <div key={node.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-black flex items-center justify-center text-sm">
                      {node.shortName?.substring(0, 3) || 'CQ'}
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">{node.name}</div>
                      <div className="text-xs text-slate-500 font-medium">{node.leaderPosition}: <strong className="text-slate-700">{node.leaderName}</strong></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                      {node.type || 'Hành chính'}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                      {node.membersCount || 0} Cán bộ/Đảng viên
                    </span>
                  </div>
                </div>

                {node.children && node.children.length > 0 && (
                  <div className="pl-6 pt-2 border-l-2 border-blue-200 space-y-2">
                    {node.children.map((child: any) => (
                      <div key={child.id} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs text-slate-900">{child.name} ({child.shortName})</div>
                          <div className="text-[11px] text-slate-500">Phụ trách: {child.leaderName}</div>
                        </div>
                        <div className="text-xs font-bold text-slate-600">
                          {child.membersCount || 0} thành viên
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: AREAS MANAGEMENT (21 KHU PHỐ & ĐỊA BÀN HÀNH CHÍNH) */}
      {/* ========================================================================= */}
      {mainTab === 'areas' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>Danh Mục 21 Khu Phố & Địa Bàn Hành Chính Phường Chánh Hiệp</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Quản lý phân cấp địa bàn hành chính, liên kết các tổ chức, ban công tác mặt trận và chi đoàn/chi hội.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (window.confirm('Chạy script chuẩn hóa: Cập nhật 21 Khu phố mới của phường Chánh Hiệp, loại bỏ triệt để 12 mã cũ và tái liên kết toàn vẹn dữ liệu với các Tổ chức thành viên?')) {
                    const result = AppStorageEngine.migrateChanhHiep21Neighborhoods({ forceReset: true });
                    saveAreas(result.areas);
                    onSaveOrganizations(result.memberOrganizations);
                    if (propOnSavePoliticalOrganizations && result.politicalOrganizations) {
                      propOnSavePoliticalOrganizations(result.politicalOrganizations);
                    }
                    CloudDatabase.purgeLegacyAreas().catch(() => {});
                    if (onShowToast) {
                      onShowToast(
                        `Đã chuẩn hóa 21 Khu phố mới! Đã xử lý ${result.areasProcessed} địa bàn, cập nhật toàn vẹn ${result.memberOrgsUpdated} tổ chức thành viên.`,
                        'success'
                      );
                    }
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                title="Cập nhật 21 khu phố mới, loại bỏ 12 mã cũ và đảm bảo tính toàn vẹn dữ liệu liên kết tổ chức"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                <span>Chuẩn hóa 21 Khu phố</span>
              </button>

              <button
                onClick={() => {
                  setAreaFormData({
                    id: `area-kp-${Date.now()}`,
                    name: '',
                    code: '',
                    type: 'NEIGHBORHOOD',
                    parentId: 'area-chanh-hiep',
                    order: areas.length + 1
                  });
                  setIsAreaModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Địa Bàn Mới</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {areas.map(area => (
              <div key={area.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-emerald-300 transition-all space-y-2 relative group">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                    {area.order || 0}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                      Mã: {area.code}
                    </span>
                    {area.id !== 'area-chanh-hiep' && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Xác nhận xóa địa bàn "${area.name}"?`)) {
                            const updated = areas.filter(a => a.id !== area.id);
                            saveAreas(updated);
                            CloudDatabase.deleteArea(area.id);
                            if (onShowToast) onShowToast(`Đã xóa địa bàn "${area.name}"`, 'info');
                          }
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        title="Xóa địa bàn này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">{area.name}</h4>
                <div className="text-xs text-slate-500">
                  Cấp: <strong className="text-slate-700">{area.type === 'WARD' ? 'Cấp Phường' : 'Khu phố'}</strong>
                </div>
                {area.population && (
                  <div className="text-[11px] text-slate-500">
                    Dân số: {area.population.toLocaleString('vi-VN')} người ({area.householdsCount || 0} hộ)
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT / CREATE MODAL (FOR MEMBER ORGANIZATION) */}
      {/* ========================================================================= */}
      {(isCreating || isEditing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-800 to-indigo-800 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-cyan-300" />
                </div>
                <div>
                  <h3 className="font-black text-base">
                    {isEditing ? `Cập Nhật: ${formData.shortName}` : 'Thêm Tổ Chức / Chi Hội Mới'}
                  </h3>
                  <p className="text-[11px] text-blue-200 font-medium">
                    Hệ thống quan hệ phân cấp cây và số liệu công tác tổ chức
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setIsEditing(false); setIsCreating(false); }}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
              <button
                type="button"
                onClick={() => setModalTab('info')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition-all shrink-0 ${
                  modalTab === 'info' 
                    ? 'border-blue-600 text-blue-600 bg-white shadow-2xs' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Thông tin chung & Liên hệ
              </button>
              <button
                type="button"
                onClick={() => setModalTab('hierarchy')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition-all shrink-0 ${
                  modalTab === 'hierarchy' 
                    ? 'border-blue-600 text-blue-600 bg-white shadow-2xs' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                2. Phân cấp Cây & Địa bàn
              </button>
              <button
                type="button"
                onClick={() => setModalTab('stats')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition-all shrink-0 ${
                  modalTab === 'stats' 
                    ? 'border-blue-600 text-blue-600 bg-white shadow-2xs' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                3. Số liệu công tác tổ chức
              </button>
              <button
                type="button"
                onClick={() => setModalTab('media')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition-all shrink-0 ${
                  modalTab === 'media' 
                    ? 'border-blue-600 text-blue-600 bg-white shadow-2xs' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                4. Thành tích & Hình ảnh
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveForm} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* TAB 1: THÔNG TIN CHUNG */}
              {modalTab === 'info' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-700">Tên đầy đủ tổ chức (*)</label>
                      <input
                        type="text"
                        required
                        placeholder="VD: Đoàn Thanh niên Cộng sản Hồ Chí Minh phường Chánh Hiệp"
                        value={formData.name || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Tên viết tắt (*)</label>
                      <input
                        type="text"
                        required
                        placeholder="VD: Đoàn Thanh niên"
                        value={formData.shortName || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, shortName: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Thứ tự hiển thị</label>
                      <input
                        type="number"
                        min={1}
                        value={formData.displayOrder || 1}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 1 }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Đại diện lãnh đạo</label>
                      <input
                        type="text"
                        placeholder="VD: Nguyễn Văn Đạt"
                        value={formData.leaderName || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, leaderName: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Chức danh đại diện</label>
                      <input
                        type="text"
                        placeholder="VD: Bí thư Đoàn Phường"
                        value={formData.leaderPosition || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, leaderPosition: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Số điện thoại hotline</label>
                      <input
                        type="text"
                        placeholder="VD: 0274.3822.112"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Email liên hệ</label>
                      <input
                        type="email"
                        placeholder="doanthanhnien.chanhhiep@gmail.com"
                        value={formData.email || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Năm thành lập / Truyền thống</label>
                      <input
                        type="text"
                        placeholder="VD: 1931"
                        value={formData.establishedYear || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, establishedYear: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Mô tả giới thiệu chức năng, nhiệm vụ</label>
                    <textarea
                      rows={3}
                      placeholder="Giới thiệu vai trò, vị trí và nhiệm vụ nòng cốt của tổ chức..."
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PHÂN CẤP CÂY & ĐỊA BÀN */}
              {modalTab === 'hierarchy' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                    <GitBranch className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-900 leading-relaxed">
                      <strong>Cấu trúc cây tổ chức:</strong> Chọn cơ quan / đơn vị cấp trên (Parent ID) để thiết lập quan hệ phân cấp. Nếu để trống, tổ chức sẽ được hiển thị ở cấp cao nhất của phường.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Parent Selection */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Đơn vị / Tổ chức Cấp trên (Parent)</label>
                      <select
                        value={formData.parentId || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value || null }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                      >
                        <option value="">(Cấp cao nhất - Không có cấp trên)</option>
                        {organizations
                          .filter(o => o.id !== formData.id)
                          .map(o => (
                            <option key={o.id} value={o.id}>
                              {o.name} ({o.shortName})
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Area Selection */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Địa bàn hành chính trực thuộc</label>
                      <select
                        value={formData.areaId || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, areaId: e.target.value || null }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                      >
                        <option value="">Toàn phường Chánh Hiệp</option>
                        {areas.map(area => (
                          <option key={area.id} value={area.id}>
                            {area.name} ({area.type === 'WARD' ? 'Phường' : 'Khu phố'})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">Cấp bậc tổ chức</label>
                        <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">Quy chuẩn: Cấp Phường</span>
                      </div>
                      <select
                        value={formData.level || 'WARD'}
                        onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value as OrganizationLevel }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                      >
                        <option value="WARD">Cấp Phường (Đoàn thể Phường Chánh Hiệp)</option>
                        <option value="BRANCH">Chi hội / Chi đoàn trực thuộc</option>
                        <option value="TEAM">Tổ nòng cốt / Ban chuyên đề</option>
                      </select>
                      <p className="text-[10px] text-slate-500 mt-0.5 italic">
                        * Quy định hệ thống: Đoàn thể chính trị - xã hội được thành lập ở cấp phường, quản lý mạng lưới 21 chi hội/chi đoàn tại 21 khu phố.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Trạng thái hoạt động</label>
                      <select
                        value={formData.status || 'ACTIVE'}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'ACTIVE' | 'INACTIVE' }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                      >
                        <option value="ACTIVE">Đang hoạt động</option>
                        <option value="INACTIVE">Tạm ngưng</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SỐ LIỆU CÔNG TÁC TỔ CHỨC */}
              {modalTab === 'stats' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Chi hội / Chi đoàn (*)</label>
                      <input
                        type="number"
                        min={0}
                        placeholder="21"
                        value={formData.branchesCount ?? 21}
                        onChange={(e) => setFormData(prev => ({ ...prev, branchesCount: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-extrabold text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Số khu phố phủ sóng</label>
                      <input
                        type="number"
                        min={0}
                        max={21}
                        placeholder="21"
                        value={formData.neighborhoodsCoveredCount ?? 21}
                        onChange={(e) => setFormData(prev => ({ ...prev, neighborhoodsCoveredCount: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-extrabold text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Tổng Đoàn/Hội viên (*)</label>
                      <input
                        type="number"
                        min={0}
                        placeholder="450"
                        value={formData.activeMembersCount ?? 0}
                        onChange={(e) => setFormData(prev => ({ ...prev, activeMembersCount: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-extrabold text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Số Hội viên Nữ</label>
                      <input
                        type="number"
                        min={0}
                        placeholder="210"
                        value={formData.femaleMembersCount ?? 0}
                        onChange={(e) => setFormData(prev => ({ ...prev, femaleMembersCount: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-extrabold text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Đoàn/Hội viên trẻ</label>
                      <input
                        type="number"
                        min={0}
                        placeholder="150"
                        value={formData.youthMembersCount ?? 0}
                        onChange={(e) => setFormData(prev => ({ ...prev, youthMembersCount: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Đảng viên trong đoàn thể</label>
                      <input
                        type="number"
                        min={0}
                        placeholder="35"
                        value={formData.partyMembersCount ?? 0}
                        onChange={(e) => setFormData(prev => ({ ...prev, partyMembersCount: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:bg-white outline-none font-bold text-red-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Tỷ lệ tập hợp (%)</label>
                      <input
                        type="text"
                        placeholder="VD: 88%"
                        value={formData.gatheringRatio || '85%'}
                        onChange={(e) => setFormData(prev => ({ ...prev, gatheringRatio: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Ủy viên BCH / Thường trực</label>
                      <input
                        type="number"
                        min={1}
                        placeholder="11"
                        value={formData.executiveCommitteeMembersCount ?? 11}
                        onChange={(e) => setFormData(prev => ({ ...prev, executiveCommitteeMembersCount: parseInt(e.target.value) || 11 }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Số chương trình / hoạt động năm</label>
                      <input
                        type="number"
                        min={0}
                        placeholder="10"
                        value={formData.programsCount ?? 5}
                        onChange={(e) => setFormData(prev => ({ ...prev, programsCount: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Số mô hình / phần việc tiêu biểu</label>
                      <input
                        type="number"
                        min={0}
                        placeholder="3"
                        value={formData.keyProjectsCount ?? 2}
                        onChange={(e) => setFormData(prev => ({ ...prev, keyProjectsCount: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: THÀNH TÍCH & HÌNH ẢNH */}
              {modalTab === 'media' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Avatar Upload */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <label className="text-xs font-bold text-slate-700 block">Logo / Ảnh đại diện tổ chức</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-slate-200 shrink-0 shadow-xs">
                        <img 
                          src={formData.avatarUrl || getOfficialCadreAvatarSvg(formData.name || 'MTTQ', formData.shortName || 'Tổ chức')} 
                          alt="Avatar preview" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                            className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          {avatarFile && (
                            <button
                              type="button"
                              onClick={handleUploadAvatar}
                              disabled={isUploadingAvatar}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs disabled:opacity-50 shrink-0 flex items-center gap-1"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>{isUploadingAvatar ? 'Đang tải...' : 'Lưu ảnh'}</span>
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="Hoặc dán URL ảnh trực tiếp..."
                          value={formData.avatarUrl || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Banner Upload */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <label className="text-xs font-bold text-slate-700 block">Ảnh bìa Banner hoạt động</label>
                    <div className="h-24 w-full rounded-xl overflow-hidden bg-slate-200 border border-slate-200 relative">
                      <img 
                        src={formData.bannerUrl || ARTICLE_BANNERS.default} 
                        alt="Banner preview" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                        className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {bannerFile && (
                        <button
                          type="button"
                          onClick={handleUploadBanner}
                          disabled={isUploadingBanner}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs disabled:opacity-50 shrink-0 flex items-center gap-1"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingBanner ? 'Đang tải...' : 'Lưu banner'}</span>
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Hoặc dán URL banner trực tiếp..."
                      value={formData.bannerUrl || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, bannerUrl: e.target.value }))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none"
                    />
                  </div>

                  {/* Featured Achievements & Models */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">Mô hình, phong trào tiêu biểu ("Dân vận khéo")</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="VD: Tuyến hẻm Sáng - Xanh - Sạch - Đẹp - An toàn"
                        value={newAchievement}
                        onChange={(e) => setNewAchievement(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddAchievement(); } }}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium"
                      />
                      <button
                        type="button"
                        onClick={handleAddAchievement}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shrink-0 hover:bg-blue-700 transition-colors"
                      >
                        Thêm
                      </button>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      {(formData.featuredAchievements || []).map((ach, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <span className="font-medium text-slate-800">{ach}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAchievement(idx)}
                            className="p-1 text-slate-400 hover:text-red-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  {modalTab === 'info' && 'Bước 1/4: Điền thông tin cơ bản'}
                  {modalTab === 'hierarchy' && 'Bước 2/4: Thiết lập phân cấp cây'}
                  {modalTab === 'stats' && 'Bước 3/4: Cập nhật số liệu tổ chức'}
                  {modalTab === 'media' && 'Bước 4/4: Tải hình ảnh & mô hình'}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setIsCreating(false); }}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isEditing ? 'Lưu Cập Nhật' : 'Tạo Tổ Chức'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AREA MODAL (THÊM ĐỊA BÀN HÀNH CHÍNH) */}
      {/* ========================================================================= */}
      {isAreaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-800 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-black text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-300" />
                <span>Thêm Địa Bàn Hành Chính Mới</span>
              </h3>
              <button 
                onClick={() => setIsAreaModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!areaFormData.name) return;
                const newArea: Area = {
                  id: areaFormData.id || `area-${Date.now()}`,
                  name: areaFormData.name,
                  code: areaFormData.code || areaFormData.name.toLowerCase().replace(/\s+/g, '-'),
                  type: areaFormData.type || 'NEIGHBORHOOD',
                  parentId: areaFormData.parentId || 'area-chanh-hiep',
                  order: areaFormData.order || (areas.length + 1),
                  createdAt: new Date().toISOString()
                };
                const updated = [...areas, newArea];
                saveAreas(updated);
                CloudDatabase.saveArea(newArea);
                setIsAreaModalOpen(false);
                if (onShowToast) onShowToast(`Đã thêm địa bàn "${newArea.name}"`, 'success');
              }}
              className="p-6 space-y-4"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tên địa bàn (*)</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Định Hòa 3"
                  value={areaFormData.name || ''}
                  onChange={(e) => setAreaFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Mã định danh</label>
                  <input
                    type="text"
                    placeholder="VD: KP13"
                    value={areaFormData.code || ''}
                    onChange={(e) => setAreaFormData(prev => ({ ...prev, code: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Thứ tự sắp xếp</label>
                  <input
                    type="number"
                    min={1}
                    value={areaFormData.order || areas.length + 1}
                    onChange={(e) => setAreaFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Cấp quản lý</label>
                <select
                  value={areaFormData.type || 'NEIGHBORHOOD'}
                  onChange={(e) => setAreaFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                >
                  <option value="NEIGHBORHOOD">Khu phố</option>
                  <option value="WARD">Cấp Phường</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAreaModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-500"
                >
                  Thêm Địa Bàn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
