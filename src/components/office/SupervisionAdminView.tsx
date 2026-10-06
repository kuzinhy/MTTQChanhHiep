import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scale, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Building2, 
  Users, 
  FileText, 
  Download, 
  ExternalLink, 
  X, 
  Check, 
  AlertTriangle, 
  Sliders, 
  ShieldCheck, 
  BarChart3, 
  RefreshCw,
  FileCheck,
  Send,
  HardDrive,
  FolderTree,
  Tag,
  Layers,
  Sparkles,
  Bot,
  Copy,
  ChevronRight,
  ArrowRight,
  ToggleLeft,
  ToggleRight,
  Briefcase,
  Heart,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { 
  SupervisionPlan, 
  SupervisionStatus, 
  SupervisionOverviewStats,
  SupervisionCategory 
} from '../../types';
import { 
  AppStorageEngine, 
  INITIAL_SUPERVISION_CATEGORIES 
} from '../../lib/storage';
import { SmartMediaDriveUploader } from './SmartMediaDriveUploader';
import { AnimatedIcon } from '../common/AnimatedIcon';

interface SupervisionAdminViewProps {
  onShowToast?: (title: string, message: string) => void;
  onNavigateToPortalTab?: (tab: string) => void;
}

type ActiveTab = 'PLANS' | 'CATEGORIES' | 'STATS' | 'AI_CONSULTANT';

const COLOR_PRESETS = [
  { id: 'blue', label: 'Xanh dương', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800' },
  { id: 'emerald', label: 'Xanh lá ngọc', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-800' },
  { id: 'amber', label: 'Hổ phách', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-800' },
  { id: 'purple', label: 'Tím đậm', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-800' },
  { id: 'rose', label: 'Đỏ hoa hồng', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-800' },
  { id: 'indigo', label: 'Chàm', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-800' },
  { id: 'cyan', label: 'Xanh cyan', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', badge: 'bg-cyan-100 text-cyan-800' }
];

const RESPONSIBLE_UNIT_PRESETS = [
  'Ban Thường trực Ủy ban MTTQ',
  'Ban Thanh tra Nhân dân Phường Chánh Hiệp',
  'Ban Giám sát Đầu tư của Cộng đồng',
  'Ban Thường trực MTTQ & Ban CTMT 21 Khu phố',
  'Ban Thường trực MTTQ & Cấp ủy chi bộ 21 Khu phố',
  'Ban Thanh tra Nhân dân & Ban Giám sát ĐTCĐ'
];

export const SupervisionAdminView: React.FC<SupervisionAdminViewProps> = ({
  onShowToast,
  onNavigateToPortalTab
}) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<ActiveTab>('PLANS');

  // Storage States
  const [plans, setPlans] = useState<SupervisionPlan[]>(() => AppStorageEngine.getSupervisionPlans());
  const [stats, setStats] = useState<SupervisionOverviewStats>(() => AppStorageEngine.getSupervisionStats());
  const [categories, setCategories] = useState<SupervisionCategory[]>(() => AppStorageEngine.getSupervisionCategories());

  // Filter States for Plans
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Filter States for Categories
  const [catSearchQuery, setCatSearchQuery] = useState('');
  const [catFilterActive, setCatFilterActive] = useState<string>('ALL');

  // Plan Modals State
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SupervisionPlan | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [viewingPlan, setViewingPlan] = useState<SupervisionPlan | null>(null);
  const [deleteConfirmPlan, setDeleteConfirmPlan] = useState<SupervisionPlan | null>(null);

  // Category Modals State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SupervisionCategory | null>(null);
  const [deleteConfirmCat, setDeleteConfirmCat] = useState<SupervisionCategory | null>(null);

  // Plan Form State
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formTargetUnit, setFormTargetUnit] = useState('');
  const [formField, setFormField] = useState('An sinh xã hội & Chính sách');
  const [formTimeframe, setFormTimeframe] = useState('');
  const [formStatus, setFormStatus] = useState<SupervisionStatus>('IN_PROGRESS');
  const [formLeader, setFormLeader] = useState('Đ/c Chủ tịch Ủy ban MTTQ');
  const [formParticipatingUnits, setFormParticipatingUnits] = useState('Ban Thanh tra Nhân dân & Trưởng Ban CTMT 21 Khu phố');
  const [formRecommendationsCount, setFormRecommendationsCount] = useState<number>(0);
  const [formResultsSummary, setFormResultsSummary] = useState('');
  const [formIssuedDate, setFormIssuedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formCompletedDate, setFormCompletedDate] = useState('');
  const [formDocumentUrl, setFormDocumentUrl] = useState('');
  const [formFeedbackRate, setFormFeedbackRate] = useState<number>(100);
  const [formNotes, setFormNotes] = useState('');

  // Category Form State
  const [catName, setCatName] = useState('');
  const [catCode, setCatCode] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catUnit, setCatUnit] = useState('Ban Thường trực Ủy ban MTTQ');
  const [catColor, setCatColor] = useState('blue');
  const [catOrder, setCatOrder] = useState<number>(1);
  const [catActive, setCatActive] = useState<boolean>(true);

  // Stats Form State
  const [statsPrograms, setStatsPrograms] = useState<number>(8);
  const [statsAcceptance, setStatsAcceptance] = useState<number>(100);
  const [statsInspectorates, setStatsInspectorates] = useState('21/21');

  // AI Assistant Tab State
  const [aiTopic, setAiTopic] = useState('Giám sát công tác tiếp nhận và chi trả trợ cấp người có công, đối tượng bảo trợ xã hội dịp Lễ, Tết năm 2026');
  const [aiSelectedCat, setAiSelectedCat] = useState(categories[0]?.name || 'An sinh xã hội & Chính sách');
  const [aiTargetAgency, setAiTargetAgency] = useState('Bộ phận Lao động - Thương binh & Xã hội UBND Phường Chánh Hiệp');
  const [aiGeneratedText, setAiGeneratedText] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Sync from storage
  useEffect(() => {
    const handleSyncPlans = () => {
      setPlans(AppStorageEngine.getSupervisionPlans());
    };
    const handleSyncStats = () => {
      setStats(AppStorageEngine.getSupervisionStats());
    };
    const handleSyncCats = () => {
      setCategories(AppStorageEngine.getSupervisionCategories());
    };

    window.addEventListener('mttq_supervision_updated', handleSyncPlans);
    window.addEventListener('mttq_supervision_stats_updated', handleSyncStats);
    window.addEventListener('mttq_supervision_categories_updated', handleSyncCats);

    return () => {
      window.removeEventListener('mttq_supervision_updated', handleSyncPlans);
      window.removeEventListener('mttq_supervision_stats_updated', handleSyncStats);
      window.removeEventListener('mttq_supervision_categories_updated', handleSyncCats);
    };
  }, []);

  // Filtered plans
  const filteredPlans = useMemo(() => {
    return plans.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        p.title.toLowerCase().includes(q) || 
        p.code.toLowerCase().includes(q) || 
        p.targetUnit.toLowerCase().includes(q) || 
        (p.field && p.field.toLowerCase().includes(q)) ||
        p.leader.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'ALL' || p.status === filterStatus;
      const matchCategory = filterCategory === 'ALL' || p.field === filterCategory;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [plans, searchQuery, filterStatus, filterCategory]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter(c => {
      const q = catSearchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.responsibleUnit && c.responsibleUnit.toLowerCase().includes(q));
      const matchActive = catFilterActive === 'ALL' || 
        (catFilterActive === 'ACTIVE' && c.active) || 
        (catFilterActive === 'INACTIVE' && !c.active);
      return matchSearch && matchActive;
    }).sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [categories, catSearchQuery, catFilterActive]);

  // Aggregate metrics
  const completedCount = plans.filter(p => p.status === 'COMPLETED').length;
  const inProgressCount = plans.filter(p => p.status === 'IN_PROGRESS').length;
  const plannedCount = plans.filter(p => p.status === 'PLANNED').length;
  const totalRecommendations = plans.reduce((acc, p) => acc + (p.recommendationsCount || 0), 0);

  // Helper: Count plans by category name
  const getPlansCountByCategory = (categoryName: string) => {
    return plans.filter(p => p.field === categoryName || (p.field && p.field.includes(categoryName))).length;
  };

  // Helper: Color style by color key
  const getColorStyle = (colorKey?: string) => {
    return COLOR_PRESETS.find(c => c.id === colorKey) || COLOR_PRESETS[0];
  };

  // ==========================================
  // PLAN HANDLERS
  // ==========================================
  const handleOpenCreatePlanModal = () => {
    setEditingPlan(null);
    setFormCode(`KH-${String(plans.length + 1).padStart(2, '0')}/KH-MTTQ`);
    setFormTitle('');
    setFormTargetUnit('UBND Phường Chánh Hiệp');
    setFormField(categories[0]?.name || 'An sinh xã hội & Chính sách');
    setFormTimeframe(`Quý ${Math.ceil((new Date().getMonth() + 1) / 3)}/${new Date().getFullYear()}`);
    setFormStatus('IN_PROGRESS');
    setFormLeader('Ban Thường trực Ủy ban MTTQ');
    setFormParticipatingUnits('Ban Thanh tra Nhân dân & Trưởng Ban CTMT 21 Khu phố');
    setFormRecommendationsCount(0);
    setFormResultsSummary('');
    setFormIssuedDate(new Date().toISOString().split('T')[0]);
    setFormCompletedDate('');
    setFormDocumentUrl('');
    setFormFeedbackRate(100);
    setFormNotes('');
    setIsPlanModalOpen(true);
  };

  const handleOpenEditPlanModal = (plan: SupervisionPlan) => {
    setEditingPlan(plan);
    setFormCode(plan.code);
    setFormTitle(plan.title);
    setFormTargetUnit(plan.targetUnit);
    setFormField(plan.field);
    setFormTimeframe(plan.timeframe);
    setFormStatus(plan.status);
    setFormLeader(plan.leader);
    setFormParticipatingUnits(plan.participatingUnits || '');
    setFormRecommendationsCount(plan.recommendationsCount || 0);
    setFormResultsSummary(plan.resultsSummary || '');
    setFormIssuedDate(plan.issuedDate || new Date().toISOString().split('T')[0]);
    setFormCompletedDate(plan.completedDate || '');
    setFormDocumentUrl(plan.documentUrl || '');
    setFormFeedbackRate(plan.feedbackResolutionRate || 100);
    setFormNotes(plan.notes || '');
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim() || !formTitle.trim() || !formTargetUnit.trim()) {
      alert('Vui lòng điền đầy đủ Mã hiệu văn bản, Tiêu đề chương trình và Đơn vị chịu sự giám sát.');
      return;
    }

    const payload: SupervisionPlan = {
      id: editingPlan ? editingPlan.id : ('sp-' + Date.now()),
      code: formCode.trim(),
      title: formTitle.trim(),
      targetUnit: formTargetUnit.trim(),
      field: formField.trim(),
      timeframe: formTimeframe.trim(),
      status: formStatus,
      leader: formLeader.trim(),
      participatingUnits: formParticipatingUnits.trim() || undefined,
      recommendationsCount: Number(formRecommendationsCount) || 0,
      resultsSummary: formResultsSummary.trim(),
      issuedDate: formIssuedDate,
      completedDate: formStatus === 'COMPLETED' ? (formCompletedDate || new Date().toISOString().split('T')[0]) : undefined,
      documentUrl: formDocumentUrl.trim() || undefined,
      feedbackResolutionRate: Number(formFeedbackRate) || 100,
      notes: formNotes.trim() || undefined,
      createdAt: editingPlan ? editingPlan.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingPlan) {
      AppStorageEngine.updateSupervisionPlan(payload);
      onShowToast?.('Thành công', `Đã cập nhật kế hoạch giám sát "${payload.code}"`);
    } else {
      AppStorageEngine.addSupervisionPlan(payload);
      onShowToast?.('Thành công', `Đã thêm kế hoạch giám sát mới "${payload.code}"`);
    }

    setPlans(AppStorageEngine.getSupervisionPlans());
    setIsPlanModalOpen(false);
  };

  const handleDeletePlan = (plan: SupervisionPlan) => {
    AppStorageEngine.deleteSupervisionPlan(plan.id);
    setPlans(AppStorageEngine.getSupervisionPlans());
    setDeleteConfirmPlan(null);
    onShowToast?.('Đã xóa', `Đã xóa kế hoạch giám sát "${plan.code}"`);
  };

  // ==========================================
  // CATEGORY HANDLERS
  // ==========================================
  const handleOpenCreateCategoryModal = () => {
    setEditingCategory(null);
    setCatName('');
    setCatCode(`CM-${(categories.length + 1).toString().padStart(2, '0')}`);
    setCatDesc('');
    setCatUnit('Ban Thường trực Ủy ban MTTQ');
    setCatColor('blue');
    setCatOrder(categories.length + 1);
    setCatActive(true);
    setIsCatModalOpen(true);
  };

  const handleOpenEditCategoryModal = (cat: SupervisionCategory) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatCode(cat.code);
    setCatDesc(cat.description || '');
    setCatUnit(cat.responsibleUnit || 'Ban Thường trực Ủy ban MTTQ');
    setCatColor(cat.color || 'blue');
    setCatOrder(cat.order || 1);
    setCatActive(cat.active !== false);
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      alert('Vui lòng nhập tên chuyên mục giám sát.');
      return;
    }

    const generatedCode = catCode.trim() || `CM-${catName.substring(0, 4).toUpperCase().replace(/\s+/g, '')}`;

    const payload: SupervisionCategory = {
      id: editingCategory ? editingCategory.id : ('cat-' + Date.now()),
      name: catName.trim(),
      code: generatedCode,
      description: catDesc.trim() || undefined,
      responsibleUnit: catUnit.trim() || undefined,
      color: catColor,
      order: Number(catOrder) || (categories.length + 1),
      active: catActive,
      createdAt: editingCategory ? editingCategory.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingCategory) {
      AppStorageEngine.updateSupervisionCategory(payload);
      onShowToast?.('Thành công', `Đã cập nhật chuyên mục "${payload.name}"`);
    } else {
      AppStorageEngine.addSupervisionCategory(payload);
      onShowToast?.('Thành công', `Đã tạo chuyên mục giám sát mới "${payload.name}"`);
    }

    setCategories(AppStorageEngine.getSupervisionCategories());
    setIsCatModalOpen(false);
  };

  const handleToggleCategoryActive = (cat: SupervisionCategory) => {
    const updated = { ...cat, active: !cat.active };
    AppStorageEngine.updateSupervisionCategory(updated);
    setCategories(AppStorageEngine.getSupervisionCategories());
    onShowToast?.('Cập nhật', `Đã ${updated.active ? 'kích hoạt' : 'tạm dừng'} chuyên mục "${cat.name}"`);
  };

  const handleDeleteCategory = (cat: SupervisionCategory) => {
    AppStorageEngine.deleteSupervisionCategory(cat.id);
    setCategories(AppStorageEngine.getSupervisionCategories());
    setDeleteConfirmCat(null);
    onShowToast?.('Đã xóa', `Đã xóa chuyên mục "${cat.name}"`);
  };

  const handleResetDefaultCategories = () => {
    if (confirm('Khôi phục danh sách chuyên mục giám sát - phản biện mặc định theo quy định của MTTQ? Các chuyên mục tùy chỉnh thêm mới sẽ được giữ lại.')) {
      const current = AppStorageEngine.getSupervisionCategories();
      const existingNames = new Set(current.map(c => c.name));
      const toAdd = INITIAL_SUPERVISION_CATEGORIES.filter(c => !existingNames.has(c.name));
      const merged = [...current, ...toAdd];
      AppStorageEngine.saveSupervisionCategories(merged);
      setCategories(merged);
      onShowToast?.('Khôi phục thành công', 'Đã bổ sung các chuyên mục giám sát chuẩn theo quy chế MTTQ');
    }
  };

  const handleFilterBySpecificCategory = (categoryName: string) => {
    setFilterCategory(categoryName);
    setActiveTab('PLANS');
  };

  // ==========================================
  // STATS HANDLERS
  // ==========================================
  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedStats: SupervisionOverviewStats = {
      totalProgramsYear: Number(statsPrograms) || plans.length,
      acceptanceRate: Number(statsAcceptance) || 100,
      cooperatingInspectorates: statsInspectorates.trim() || '21/21'
    };
    AppStorageEngine.saveSupervisionStats(updatedStats);
    setStats(updatedStats);
    setIsStatsModalOpen(false);
    onShowToast?.('Thành công', 'Đã cập nhật chỉ số tổng quan giám sát năm 2026');
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['Mã kế hoạch', 'Tiêu đề giám sát', 'Đơn vị chịu giám sát', 'Chuyên mục/Lĩnh vực', 'Thời gian', 'Trạng thái', 'Trưởng đoàn', 'Số kiến nghị', 'Tóm tắt kết quả', 'Ngày ban hành'];
    const rows = plans.map(p => [
      `"${p.code}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.targetUnit.replace(/"/g, '""')}"`,
      `"${p.field}"`,
      `"${p.timeframe}"`,
      `"${p.status === 'COMPLETED' ? 'Đã hoàn tất' : p.status === 'IN_PROGRESS' ? 'Đang triển khai' : 'Theo kế hoạch'}"`,
      `"${p.leader}"`,
      p.recommendationsCount,
      `"${(p.resultsSummary || '').replace(/"/g, '""')}"`,
      `"${p.issuedDate || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `danh_sach_giam_sat_mttq_chanh_hiep_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast?.('Thành công', 'Đã tải xuống danh sách kế hoạch giám sát dạng CSV');
  };

  // AI Assistant Draft Generator
  const handleGenerateAiOutline = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      const outline = `ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP
BAN THƯỜNG TRỰC - BAN THANH TRA NHÂN DÂN
Số: .../KH-MTTQ-GS                              Chánh Hiệp, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}

KẾ HOẠCH GIÁM SÁT CHUYÊN ĐỀ
Chuyên mục: ${aiSelectedCat}
Nội dung: ${aiTopic}

I. MỤC ĐÍCH, YÊU CẦU
1. Mục đích:
- Phát huy quyền làm chủ của nhân dân theo quy định của Luật Mặt trận Tổ quốc Việt Nam số 75/2015/QH13 và Luật Thực hiện dân chủ ở cơ sở số 10/2022/QH15.
- Đánh giá khách quan, trung thực tình hình thực hiện tại ${aiTargetAgency}; kịp thời phát hiện những vướng mắc, bất cập để kiến nghị chính quyền giải quyết.
2. Yêu cầu:
- Quá trình giám sát bảo đảm dân chủ, công khai, khách quan, đúng thẩm quyền và không làm cản trở hoạt động bình thường của đơn vị được giám sát.

II. ĐỐI TƯỢNG VÀ THỜI GIAN GIÁM SÁT
- Đơn vị chịu sự giám sát: ${aiTargetAgency}.
- Địa bàn giám sát: 21 Khu phố thuộc Phường Chánh Hiệp.
- Thời gian thực hiện: Quý ${Math.ceil((new Date().getMonth() + 1) / 3)} năm ${new Date().getFullYear()}.

III. THÀNH PHẦN ĐOÀN GIÁM SÁT
1. Trưởng đoàn: Đ/c Đại diện Ban Thường trực Ủy ban MTTQ Việt Nam Phường Chánh Hiệp.
2. Phó trưởng đoàn: Đ/c Trưởng Ban Thanh tra Nhân dân Phường.
3. Thành viên:
- Đại diện các đoàn thể chính trị - xã hội Phường.
- Trưởng Ban Công tác Mặt trận và Trưởng Ban Giám sát ĐTCĐ của các khu phố liên quan.

IV. NỘI DUNG VÀ BỘ CÂU HỎI TRỌNG TÂM
1. Công tác công khai, minh bạch thông tin:
- Đơn vị đã niêm yết công khai danh sách, đối tượng, tiêu chuẩn và mức hỗ trợ tại trụ sở và 21 khu phố như thế nào?
- Kênh tiếp nhận ý kiến phản ánh của người dân (Zalo OA, hòm thư góp ý, trực tiếp) hoạt động ra sao?
2. Trình tự, thủ tục và tiến độ giải quyết:
- Thời gian thụ lý và trả kết quả có đúng thời hạn quy định không? Tỷ lệ hồ sơ giải quyết trước hạn, đúng hạn, trễ hạn?
- Nguyên nhân các hồ sơ giải quyết trễ hạn (nếu có) và trách nhiệm của cá nhân, bộ phận liên quan?
3. Khảo sát thực tế lấy ý kiến nhân dân:
- Tổ chức phát phiếu khảo sát độc lập đối với tối thiểu 100 hộ dân / người thụ hưởng trên địa bàn 21 khu phố.

V. DỰ THẢO KẾT LUẬN & KIẾN NGHỊ
- Tổng hợp biên bản làm việc và kết quả khảo sát thực địa.
- Ban hành văn bản kiến nghị chính thức gửi Thường trực Đảng ủy và Chủ tịch UBND Phường Chánh Hiệp trong thời hạn 10 ngày sau khi kết thúc đợt giám sát.`;

      setAiGeneratedText(outline);
      setIsGeneratingAi(false);
      onShowToast?.('Đã tạo đề cương', 'Trợ lý AI đã soạn xong Đề cương Kế hoạch Giám sát');
    }, 800);
  };

  const handleCopyAiText = () => {
    if (!aiGeneratedText) return;
    navigator.clipboard.writeText(aiGeneratedText);
    onShowToast?.('Đã sao chép', 'Đã sao chép nội dung đề cương vào Clipboard');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-cyan-400/15 to-transparent rounded-full pointer-events-none blur-3xl -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-400/30 text-xs font-bold">
              <Scale className="w-3.5 h-3.5 text-cyan-300" />
              <span>Phân hệ Nghiệp vụ Công tác Mặt trận Cơ sở</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>QUẢN TRỊ GIÁM SÁT &amp; PHẢN BIỆN XÃ HỘI</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
              Quản lý các chuyên mục giám sát chuyên đề, kế hoạch giám sát cán bộ, công chức, các công trình đầu tư công và an sinh xã hội trên địa bàn Phường Chánh Hiệp theo Luật MTTQ Việt Nam và Luật Thực hiện dân chủ ở cơ sở. Dữ liệu tự động đồng bộ realtime lên Cổng Dân sinh.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="shrink-0 flex flex-wrap items-center gap-2.5">
            {activeTab === 'PLANS' ? (
              <button
                onClick={handleOpenCreatePlanModal}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Kế hoạch Giám sát</span>
              </button>
            ) : activeTab === 'CATEGORIES' ? (
              <button
                onClick={handleOpenCreateCategoryModal}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Chuyên mục Mới</span>
              </button>
            ) : null}

            <button
              onClick={() => {
                setStatsPrograms(stats.totalProgramsYear || 8);
                setStatsAcceptance(stats.acceptanceRate || 100);
                setStatsInspectorates(stats.cooperatingInspectorates || '21/21');
                setIsStatsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all cursor-pointer"
              title="Cập nhật các số liệu tổng quan trên banner dân sinh"
            >
              <Sliders className="w-4 h-4 text-amber-300" />
              <span>Chỉ số Banner</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all cursor-pointer"
              title="Xuất file CSV"
            >
              <Download className="w-4 h-4 text-cyan-300" />
              <span className="hidden sm:inline">Xuất CSV</span>
            </button>

            {onNavigateToPortalTab && (
              <button
                onClick={() => onNavigateToPortalTab('supervision')}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-200 font-bold text-xs rounded-xl border border-cyan-400/30 transition-all cursor-pointer"
                title="Xem giao diện người dân"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Xem Cổng Dân Sinh</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('PLANS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'PLANS'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Chương trình &amp; Kế hoạch</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'PLANS' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {plans.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('CATEGORIES')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'CATEGORIES'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Quản trị Chuyên mục Giám sát</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'CATEGORIES' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {categories.length} Chuyên mục
            </span>
          </button>

          <button
            onClick={() => setActiveTab('STATS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'STATS'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Chỉ số &amp; Báo cáo</span>
          </button>

          <button
            onClick={() => setActiveTab('AI_CONSULTANT')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'AI_CONSULTANT'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bot className="w-4 h-4 text-amber-300" />
            <span>Trợ lý AI Tham mưu Giám sát</span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-amber-400 text-amber-950 font-black">
              AI SMART
            </span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 font-medium px-2 hidden lg:block">
          Đồng bộ realtime với Cổng thông tin Mặt trận Phường Chánh Hiệp
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Tổng chương trình</span>
            <span className="text-2xl font-black text-slate-900">{plans.length}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Năm 2026: {stats.totalProgramsYear || 8} CT</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Đã hoàn tất</span>
            <span className="text-2xl font-black text-emerald-600">{completedCount}</span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Có kết luận &amp; kiến nghị</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Đang triển khai</span>
            <span className="text-2xl font-black text-amber-600">{inProgressCount}</span>
            <span className="text-[10px] text-amber-600 font-bold block mt-0.5">Đang lấy ý kiến/hiện trường</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Chuyên mục giám sát</span>
            <span className="text-2xl font-black text-indigo-700">{categories.length}</span>
            <span className="text-[10px] text-indigo-600 font-bold block mt-0.5">{categories.filter(c => c.active).length} đang áp dụng</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <FolderTree className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: KẾ HOẠCH & CHƯƠNG TRÌNH GIÁM SÁT */}
      {/* ========================================================================= */}
      {activeTab === 'PLANS' && (
        <div className="space-y-4">
          
          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative w-full md:w-80">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo mã hiệu, tiêu đề, đơn vị, chuyên mục..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 font-medium"
                />
              </div>

              {/* Filter Dropdowns */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-bold text-slate-700 cursor-pointer"
                >
                  <option value="ALL">Mọi trạng thái ({plans.length})</option>
                  <option value="COMPLETED">Đã hoàn tất ({completedCount})</option>
                  <option value="IN_PROGRESS">Đang triển khai ({inProgressCount})</option>
                  <option value="PLANNED">Theo kế hoạch ({plannedCount})</option>
                </select>

                {/* Category Filter */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-bold text-slate-700 cursor-pointer max-w-[220px] truncate"
                >
                  <option value="ALL">Mọi chuyên mục ({categories.length})</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {(searchQuery || filterStatus !== 'ALL' || filterCategory !== 'ALL') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterStatus('ALL');
                      setFilterCategory('ALL');
                    }}
                    className="text-xs font-bold text-red-600 hover:text-red-700 px-2 py-1 cursor-pointer"
                  >
                    Xóa lọc
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Plans Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {filteredPlans.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Scale className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">Chưa có kế hoạch giám sát nào phù hợp</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Không tìm thấy kế hoạch nào với bộ lọc hiện tại. Bấm nút "+ Thêm Kế hoạch Giám sát" để tạo mới chương trình giám sát của MTTQ Phường Chánh Hiệp.
                </p>
                <button
                  onClick={handleOpenCreatePlanModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  + Tạo Kế hoạch Mới
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Mã số &amp; Ngày ban hành</th>
                      <th className="py-3 px-4">Chương trình / Đơn vị giám sát</th>
                      <th className="py-3 px-4">Chuyên mục</th>
                      <th className="py-3 px-4">Tiến độ</th>
                      <th className="py-3 px-4 text-center">Kiến nghị</th>
                      <th className="py-3 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredPlans.map(plan => {
                      const matchedCat = categories.find(c => c.name === plan.field || (plan.field && plan.field.includes(c.name)));
                      const colorStyle = getColorStyle(matchedCat?.color);

                      return (
                        <tr key={plan.id} className="hover:bg-blue-50/40 transition-colors">
                          {/* Code & Issued Date */}
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                            <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px]">
                              {plan.code}
                            </span>
                            <span className="text-[10.5px] text-slate-400 block font-sans font-medium mt-1">
                              {plan.issuedDate || 'Chưa cập nhật'}
                            </span>
                          </td>

                          {/* Title & Target Unit */}
                          <td className="py-3.5 px-4 max-w-md">
                            <div className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">
                              {plan.title}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                              <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{plan.targetUnit}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10.5px] text-slate-400 mt-0.5">
                              <span>Trưởng đoàn: <b>{plan.leader}</b></span>
                              <span>•</span>
                              <span>Thời gian: {plan.timeframe}</span>
                            </div>
                          </td>

                          {/* Category Badge */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <button
                              onClick={() => setFilterCategory(plan.field)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition hover:opacity-80 cursor-pointer ${colorStyle.badge} ${colorStyle.border}`}
                              title="Lọc theo chuyên mục này"
                            >
                              <Tag className="w-3 h-3" />
                              <span>{plan.field}</span>
                            </button>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {plan.status === 'COMPLETED' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Đã hoàn tất</span>
                              </span>
                            ) : plan.status === 'IN_PROGRESS' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock className="w-3 h-3" />
                                <span>Đang thực hiện</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                <Calendar className="w-3 h-3" />
                                <span>Theo kế hoạch</span>
                              </span>
                            )}
                          </td>

                          {/* Recommendations count */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className="font-extrabold text-blue-700 text-xs">
                              {plan.recommendationsCount || 0}
                            </span>
                            <span className="text-[10px] text-slate-400 block">kiến nghị</span>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setViewingPlan(plan)}
                                className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleOpenEditPlanModal(plan)}
                                className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                                title="Chỉnh sửa"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setDeleteConfirmPlan(plan)}
                                className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                title="Xóa kế hoạch"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: QUẢN TRỊ CHUYÊN MỤC GIÁM SÁT - PHẢN BIỆN (TRỌNG TÂM YÊU CẦU) */}
      {/* ========================================================================= */}
      {activeTab === 'CATEGORIES' && (
        <div className="space-y-4">
          
          {/* Header Banner for Categories */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-[11px] font-bold">
                  <FolderTree className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Cấu hình Danh mục Chuyên đề</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  QUẢN TRỊ CHUYÊN MỤC GIÁM SÁT &amp; PHẢN BIỆN XÃ HỘI
                </h2>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  Thiết lập các lĩnh vực trọng tâm cần giám sát (An sinh xã hội, Cải cách hành chính, Đầu tư công hạ tầng, Quản lý đất đai...), phân công cơ quan/ban chủ trì (Ban Thanh tra Nhân dân, Ban Giám sát ĐTCĐ, MTTQ) và đồng bộ với phân loại văn bản.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleOpenCreateCategoryModal}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Thêm Chuyên Mục Mới</span>
                </button>

                <button
                  onClick={handleResetDefaultCategories}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Bổ sung các chuyên mục chuẩn theo hướng dẫn MTTQ nếu bị thiếu"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                  <span>Khôi phục Mặc định</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search & Filter for Categories */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm chuyên mục theo tên, mã hiệu, ban phụ trách..."
                value={catSearchQuery}
                onChange={(e) => setCatSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={catFilterActive}
                onChange={(e) => setCatFilterActive(e.target.value)}
                className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-bold text-slate-700 cursor-pointer"
              >
                <option value="ALL">Tất cả trạng thái ({categories.length})</option>
                <option value="ACTIVE">Đang kích hoạt ({categories.filter(c => c.active).length})</option>
                <option value="INACTIVE">Tạm dừng ({categories.filter(c => !c.active).length})</option>
              </select>

              {(catSearchQuery || catFilterActive !== 'ALL') && (
                <button
                  onClick={() => {
                    setCatSearchQuery('');
                    setCatFilterActive('ALL');
                  }}
                  className="text-xs font-bold text-red-600 hover:text-red-700 px-2 py-1 cursor-pointer"
                >
                  Xóa lọc
                </button>
              )}
            </div>
          </div>

          {/* Categories Grid / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map(cat => {
              const plansCount = getPlansCountByCategory(cat.name);
              const colorStyle = getColorStyle(cat.color);

              return (
                <div
                  key={cat.id}
                  className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-xs flex flex-col justify-between ${
                    cat.active ? 'border-slate-200 hover:border-slate-300' : 'border-slate-200/60 bg-slate-50/50 opacity-75'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Code Badge, Color Dot, and Active Switch */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${colorStyle.badge}`}>
                          {cat.code}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          #Thứ tự: {cat.order || 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleCategoryActive(cat)}
                          className={`text-xs font-bold px-2 py-0.5 rounded-full transition cursor-pointer flex items-center gap-1 ${
                            cat.active 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                              : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                          }`}
                          title="Bấm để bật / tắt chuyên mục"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cat.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          <span>{cat.active ? 'Kích hoạt' : 'Tạm dừng'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Category Title */}
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                      )}
                    </div>

                    {/* Responsible Unit */}
                    {cat.responsibleUnit && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Đơn vị chủ trì giám sát:
                        </span>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{cat.responsibleUnit}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Stats & Actions */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleFilterBySpecificCategory(cat.name)}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
                      title="Xem các kế hoạch thuộc chuyên mục này"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{plansCount} kế hoạch</span>
                      <ChevronRight className="w-3 h-3 text-blue-500" />
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditCategoryModal(cat)}
                        className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                        title="Chỉnh sửa chuyên mục"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmCat(cat)}
                        className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Xóa chuyên mục"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CHỈ SỐ & BÁO CÁO GIÁM SÁT */}
      {/* ========================================================================= */}
      {activeTab === 'STATS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Banner Overview Stats Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <span>Chỉ số Banner Dân sinh</span>
                </h3>
                <button
                  onClick={() => setIsStatsModalOpen(true)}
                  className="text-xs text-blue-600 hover:underline font-bold cursor-pointer"
                >
                  Chỉnh sửa
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-blue-50/60 rounded-xl flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Chỉ tiêu CT năm 2026:</span>
                  <span className="font-black text-blue-700 text-sm">{stats.totalProgramsYear || 8} CT</span>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-xl flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Tỷ lệ kiến nghị tiếp thu:</span>
                  <span className="font-black text-emerald-700 text-sm">{stats.acceptanceRate || 100}%</span>
                </div>
                <div className="p-3 bg-indigo-50/60 rounded-xl flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Ban TTND Khu phố phối hợp:</span>
                  <span className="font-black text-indigo-700 text-sm">{stats.cooperatingInspectorates || '21/21'}</span>
                </div>
              </div>
            </div>

            {/* Program Breakdown by Status */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Tiến độ thực hiện</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Đã hoàn tất ({completedCount})</span>
                    <span>{plans.length ? Math.round((completedCount / plans.length) * 100) : 0}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${plans.length ? (completedCount / plans.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Đang triển khai ({inProgressCount})</span>
                    <span>{plans.length ? Math.round((inProgressCount / plans.length) * 100) : 0}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${plans.length ? (inProgressCount / plans.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Theo kế hoạch ({plannedCount})</span>
                    <span>{plans.length ? Math.round((plannedCount / plans.length) * 100) : 0}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-400 rounded-full"
                      style={{ width: `${plans.length ? (plannedCount / plans.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Export & Actions Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Download className="w-4 h-4 text-cyan-600" />
                  <span>Xuất báo cáo định kỳ</span>
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Xuất dữ liệu toàn bộ các chương trình giám sát ra tệp Excel/CSV phục vụ báo cáo định kỳ hàng quý lên Thường trực Đảng ủy và Ủy ban MTTQ Thành phố Thủ Dầu Một.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleExportCsv}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Báo cáo Tổng hợp (CSV)</span>
                </button>
              </div>
            </div>

          </div>

          {/* Table: Breakdown by Category */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-emerald-600" />
              <span>Phân bổ Kế hoạch Giám sát theo Từng Chuyên mục</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px] font-bold">
                    <th className="py-2.5 px-3">Mã</th>
                    <th className="py-2.5 px-3">Tên Chuyên mục</th>
                    <th className="py-2.5 px-3">Đơn vị chủ trì</th>
                    <th className="py-2.5 px-3 text-center">Số Kế hoạch</th>
                    <th className="py-2.5 px-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map(c => {
                    const count = getPlansCountByCategory(c.name);
                    const colorStyle = getColorStyle(c.color);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                          <span className={`px-2 py-0.5 rounded text-[10.5px] ${colorStyle.badge}`}>
                            {c.code}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{c.name}</td>
                        <td className="py-2.5 px-3 text-slate-600">{c.responsibleUnit || 'Ban Thường trực MTTQ'}</td>
                        <td className="py-2.5 px-3 text-center font-extrabold text-blue-700">{count}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleFilterBySpecificCategory(c.name)}
                            className="text-xs text-blue-600 hover:underline font-bold cursor-pointer"
                          >
                            Xem kế hoạch →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TRỢ LÝ AI THAM MƯU GIÁM SÁT */}
      {/* ========================================================================= */}
      {activeTab === 'AI_CONSULTANT' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 text-base">
                TRỢ LÝ AI SOẠN ĐỀ CƯƠNG &amp; BỘ CÂU HỎI GIÁM SÁT XÃ HỘI
              </h2>
              <p className="text-xs text-slate-500">
                Tự động lập khung kế hoạch giám sát chuyên đề và bộ câu hỏi chất vấn, khảo sát nhân dân dựa trên Luật MTTQ Việt Nam và Luật Thực hiện dân chủ ở cơ sở.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Controls */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Chọn Chuyên mục Giám sát (*):
                </label>
                <select
                  value={aiSelectedCat}
                  onChange={(e) => setAiSelectedCat(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 cursor-pointer focus:bg-white focus:ring-2 focus:ring-purple-600 outline-hidden"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Đơn vị chịu sự giám sát (*):
                </label>
                <input
                  type="text"
                  value={aiTargetAgency}
                  onChange={(e) => setAiTargetAgency(e.target.value)}
                  placeholder="VD: Bộ phận Địa chính - Xây dựng UBND Phường Chánh Hiệp"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-purple-600 outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Nội dung trọng tâm cần giám sát (*):
                </label>
                <textarea
                  rows={3}
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Nhập nội dung hoặc sự việc cần giám sát..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-purple-600 outline-hidden"
                />
              </div>

              <button
                onClick={handleGenerateAiOutline}
                disabled={isGeneratingAi}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingAi ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang tổng hợp thể thức &amp; quy chuẩn MTTQ...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Soạn Đề Cương Giám Sát Bằng AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Output Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Dự thảo Đề cương &amp; Bộ câu hỏi gợi ý:</span>
                {aiGeneratedText && (
                  <button
                    onClick={handleCopyAiText}
                    className="flex items-center gap-1 text-purple-700 font-bold hover:underline cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép</span>
                  </button>
                )}
              </div>

              <textarea
                rows={14}
                readOnly
                value={aiGeneratedText || 'Bấm nút "Soạn Đề Cương Giám Sát Bằng AI" để trợ lý AI tạo bản thảo chuẩn thể thức văn bản Mặt trận...'}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] leading-relaxed text-slate-800 focus:outline-hidden resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT SUPERVISION PLAN */}
      {/* ========================================================================= */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-xl text-sky-400 border border-sky-400/30">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    {editingPlan ? 'CHỈNH SỬA KẾ HOẠCH GIÁM SÁT' : 'THÊM KẾ HOẠCH GIÁM SÁT MỚI'}
                  </h3>
                  <p className="text-[11px] text-blue-200/80">
                    Cập nhật vào hệ thống giám sát &amp; công khai trên Cổng dân sinh Phường Chánh Hiệp
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSavePlan} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Mã hiệu văn bản (*)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: KH-04/KH-MTTQ"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Chuyên mục giám sát (*)
                  </label>
                  <select
                    value={formField}
                    onChange={(e) => setFormField(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden cursor-pointer"
                  >
                    {categories.filter(c => c.active).map(c => (
                      <option key={c.id} value={c.name}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Tiêu đề / Nội dung chương trình giám sát (*)
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Giám sát việc thực hiện các chính sách an sinh xã hội và trợ cấp năm 2026"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Đơn vị chịu sự giám sát (*)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Bộ phận Lao động - TB&XH UBND Phường"
                    value={formTargetUnit}
                    onChange={(e) => setFormTargetUnit(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Thời gian thực hiện (*)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Quý II/2026 hoặc Tháng 8/2026"
                    value={formTimeframe}
                    onChange={(e) => setFormTimeframe(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Trưởng đoàn giám sát / Chủ trì
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Đ/c Trần Thị Hoa - Chủ tịch MTTQ"
                    value={formLeader}
                    onChange={(e) => setFormLeader(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Trạng thái tiến độ (*)
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as SupervisionStatus)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden cursor-pointer"
                  >
                    <option value="PLANNED">Theo kế hoạch (Chưa thực hiện)</option>
                    <option value="IN_PROGRESS">Đang triển khai (Thu thập/Khảo sát)</option>
                    <option value="COMPLETED">Đã hoàn tất (Có kết luận)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Thành phần phối hợp tham gia giám sát
                </label>
                <input
                  type="text"
                  placeholder="VD: Ban Thanh tra Nhân dân & Trưởng Ban CTMT 21 Khu phố"
                  value={formParticipatingUnits}
                  onChange={(e) => setFormParticipatingUnits(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Số kiến nghị chuyển giao
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formRecommendationsCount}
                    onChange={(e) => setFormRecommendationsCount(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-700 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Ngày ban hành
                  </label>
                  <input
                    type="date"
                    value={formIssuedDate}
                    onChange={(e) => setFormIssuedDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Ngày hoàn tất (nếu có)
                  </label>
                  <input
                    type="date"
                    value={formCompletedDate}
                    onChange={(e) => setFormCompletedDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Tóm tắt Kết quả &amp; Kiến nghị sau giám sát (*)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ghi rõ kết quả phát hiện, số liệu đối chiếu, các kiến nghị gửi UBND hoặc các bộ phận liên quan để giải quyết..."
                  value={formResultsSummary}
                  onChange={(e) => setFormResultsSummary(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              {/* Document upload via SmartMediaDriveUploader */}
              <div className="space-y-1.5 p-3.5 bg-blue-50/50 rounded-2xl border border-blue-200/80">
                <label className="font-bold text-blue-950 flex items-center justify-between">
                  <span>Văn bản Kế hoạch / Kết luận giám sát đính kèm:</span>
                  {formDocumentUrl && (
                    <a
                      href={formDocumentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-700 hover:underline flex items-center gap-1"
                    >
                      <span>Xem link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </label>

                <SmartMediaDriveUploader
                  label="Tải lên Google Drive hoặc chọn tệp văn bản"
                  currentValue={formDocumentUrl}
                  modeType="all"
                  defaultFolderCode="van-ban-mttq"
                  onMediaSelected={(res) => {
                    setFormDocumentUrl(res.url);
                    onShowToast?.('Đã đính kèm tệp', `Đã chọn tệp: ${res.name || 'Văn bản giám sát'}`);
                  }}
                  onClear={() => setFormDocumentUrl('')}
                />

                <div className="pt-1">
                  <input
                    type="url"
                    placeholder="Hoặc dán trực tiếp đường dẫn Google Drive / Cloud URL..."
                    value={formDocumentUrl}
                    onChange={(e) => setFormDocumentUrl(e.target.value)}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-xl font-mono text-slate-700"
                  />
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Ghi chú nội bộ (Cán bộ xem)
                </label>
                <input
                  type="text"
                  placeholder="Ghi chú phân công theo dõi tiến độ giải quyết kiến nghị..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md transition active:scale-95 cursor-pointer"
                >
                  {editingPlan ? 'Lưu Thay Đổi' : 'Thêm Kế Hoạch'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD / EDIT SUPERVISION CATEGORY (CHUYÊN MỤC GIÁM SÁT) */}
      {/* ========================================================================= */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400 border border-emerald-400/30">
                  <FolderTree className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    {editingCategory ? 'CHỈNH SỬA CHUYÊN MỤC GIÁM SÁT' : 'THÊM CHUYÊN MỤC GIÁM SÁT MỚI'}
                  </h3>
                  <p className="text-[11px] text-emerald-200/80">
                    Phân loại lĩnh vực và phân công đơn vị chủ trì giám sát - phản biện
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveCategory} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Mã chuyên mục (*)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: CM-ANSINH"
                    value={catCode}
                    onChange={(e) => setCatCode(e.target.value.toUpperCase())}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Thứ tự hiển thị
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={catOrder}
                    onChange={(e) => setCatOrder(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Tên Chuyên mục Giám sát (*)
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: An sinh xã hội & Chính sách người có công"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Đơn vị / Ban chủ trì phụ trách (*)
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Ban Thanh tra Nhân dân Phường Chánh Hiệp"
                  value={catUnit}
                  onChange={(e) => setCatUnit(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-hidden"
                />
                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {RESPONSIBLE_UNIT_PRESETS.slice(0, 4).map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setCatUnit(u)}
                      className="text-[10.5px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Mô tả phạm vi &amp; mục tiêu giám sát
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả các nội dung kiểm tra, giám sát chính thuộc chuyên đề này..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-hidden"
                />
              </div>

              {/* Color Theme Selector */}
              <div>
                <label className="font-bold text-slate-800 block mb-2">
                  Màu sắc nhận diện huy hiệu
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {COLOR_PRESETS.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCatColor(c.id)}
                      className={`p-2 rounded-xl text-center text-[10.5px] font-bold border transition-all cursor-pointer ${
                        catColor === c.id 
                          ? `${c.bg} ${c.text} ${c.border} ring-2 ring-emerald-500 font-black` 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Kích hoạt chuyên mục</span>
                  <span className="text-[11px] text-slate-500">Hiển thị chuyên mục này trên Cổng dân sinh và trong bộ chọn</span>
                </div>
                <input
                  type="checkbox"
                  checked={catActive}
                  onChange={(e) => setCatActive(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md transition active:scale-95 cursor-pointer"
                >
                  {editingCategory ? 'Lưu Thay Đổi' : 'Thêm Chuyên Mục'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: UPDATE BANNER OVERVIEW STATS */}
      {/* ========================================================================= */}
      {isStatsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-sm sm:text-base">
                  CẬP NHẬT CHỈ SỐ BANNER GIÁM SÁT
                </h3>
              </div>
              <button
                onClick={() => setIsStatsModalOpen(false)}
                className="p-1 text-white/70 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStats} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  1. Số chương trình giám sát năm 2026 (Chỉ tiêu)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={statsPrograms}
                  onChange={(e) => setStatsPrograms(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-blue-700 text-sm"
                />
                <span className="text-[10.5px] text-slate-500 mt-0.5 block">
                  Hiện tại có <b>{plans.length}</b> kế hoạch đã nhập vào hệ thống.
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  2. Tỷ lệ kiến nghị được tiếp thu (%)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={statsAcceptance}
                  onChange={(e) => setStatsAcceptance(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-emerald-600 text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  3. Ban TTND Khu phố phối hợp
                </label>
                <input
                  type="text"
                  required
                  placeholder="21/21"
                  value={statsInspectorates}
                  onChange={(e) => setStatsInspectorates(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-indigo-700 text-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStatsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md cursor-pointer"
                >
                  Lưu Chỉ Số
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: VIEW PLAN DETAIL */}
      {/* ========================================================================= */}
      {viewingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold bg-blue-600 px-2 py-0.5 rounded text-white">
                  {viewingPlan.code}
                </span>
                <span className="font-bold text-xs text-slate-300">Chi tiết Kế hoạch Giám sát</span>
              </div>
              <button
                onClick={() => setViewingPlan(null)}
                className="p-1 text-white/70 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <h3 className="font-black text-slate-900 text-base leading-snug">
                {viewingPlan.title}
              </h3>

              <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-slate-500 font-medium">Đơn vị chịu giám sát:</span>
                  <span className="font-bold text-slate-900 text-right">{viewingPlan.targetUnit}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-slate-500 font-medium">Chuyên mục:</span>
                  <span className="font-bold text-blue-700">{viewingPlan.field}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-slate-500 font-medium">Thời gian thực hiện:</span>
                  <span className="font-bold text-slate-900">{viewingPlan.timeframe}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-slate-500 font-medium">Trưởng đoàn giám sát:</span>
                  <span className="font-bold text-slate-900">{viewingPlan.leader}</span>
                </div>
                {viewingPlan.participatingUnits && (
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500 font-medium">Thành phần tham gia:</span>
                    <span className="font-bold text-slate-900 text-right">{viewingPlan.participatingUnits}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-slate-500 font-medium">Trạng thái:</span>
                  <span className={`font-black uppercase ${
                    viewingPlan.status === 'COMPLETED' ? 'text-emerald-700' :
                    viewingPlan.status === 'IN_PROGRESS' ? 'text-amber-700' : 'text-slate-700'
                  }`}>
                    {viewingPlan.status === 'COMPLETED' ? 'Đã hoàn tất' :
                     viewingPlan.status === 'IN_PROGRESS' ? 'Đang thực hiện' : 'Theo kế hoạch'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Số kiến nghị chuyển giao:</span>
                  <span className="font-bold text-blue-700">{viewingPlan.recommendationsCount} kiến nghị</span>
                </div>
              </div>

              <div className="p-4 bg-cyan-50/70 rounded-2xl border border-cyan-200 space-y-1.5">
                <span className="font-black text-cyan-950 block flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-cyan-700" />
                  <span>Kết quả &amp; Kiến nghị sau giám sát:</span>
                </span>
                <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                  {viewingPlan.resultsSummary || 'Chưa cập nhật kết quả.'}
                </p>
              </div>

              {viewingPlan.documentUrl && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Tệp văn bản kết luận:</span>
                  </span>
                  <a
                    href={viewingPlan.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1 text-[11px]"
                  >
                    <span>Mở tệp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {viewingPlan.notes && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                  <b>Ghi chú nội bộ:</b> {viewingPlan.notes}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
              <button
                onClick={() => {
                  const p = viewingPlan;
                  setViewingPlan(null);
                  handleOpenEditPlanModal(p);
                }}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl cursor-pointer"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => setViewingPlan(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: DELETE PLAN CONFIRMATION */}
      {/* ========================================================================= */}
      {deleteConfirmPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-slate-900 text-sm">Xác nhận xóa kế hoạch giám sát?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bạn có chắc chắn muốn xóa kế hoạch <b className="text-red-600">{deleteConfirmPlan.code}</b> ({deleteConfirmPlan.title})? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmPlan(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => handleDeletePlan(deleteConfirmPlan)}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-xs cursor-pointer"
              >
                Xóa Vĩnh Viễn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: DELETE CATEGORY CONFIRMATION */}
      {/* ========================================================================= */}
      {deleteConfirmCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-slate-900 text-sm">Xác nhận xóa chuyên mục giám sát?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bạn có chắc chắn muốn xóa chuyên mục <b className="text-red-600">{deleteConfirmCat.name}</b> ({deleteConfirmCat.code})?
                {getPlansCountByCategory(deleteConfirmCat.name) > 0 && (
                  <span className="block mt-1 font-bold text-amber-700">
                    Lưu ý: Hiện có {getPlansCountByCategory(deleteConfirmCat.name)} kế hoạch đang thuộc chuyên mục này.
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmCat(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => handleDeleteCategory(deleteConfirmCat)}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-xs cursor-pointer"
              >
                Xóa Chuyên Mục
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SupervisionAdminView;
