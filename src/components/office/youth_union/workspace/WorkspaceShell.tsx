import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Save, 
  Send, 
  Award, 
  FileCheck,
  Sparkles,
  ChevronDown,
  X,
  Image as ImageIcon,
  Link as LinkIcon,
  Trophy,
  Info,
  Calendar,
  Users,
  Layers,
  BookOpen
} from 'lucide-react';
import { 
  BranchInfo, 
  CriterionItem, 
  CriterionSubmissionState,
  EmulationSettings,
  loadStoredBranches,
  saveStoredBranches,
  loadStoredCriteria,
  loadStoredSubmissions,
  saveStoredSubmissions,
  loadStoredSettings,
  loadStoredArticles,
  saveStoredArticles,
  loadStoredEvents,
  saveStoredEvents,
  loadStoredCompetitions,
  saveStoredCompetitions,
  loadStoredDocuments,
  saveStoredDocuments,
  loadStoredInitiatives,
  saveStoredInitiatives,
  YouthEvent,
  YouthCompetition,
  YouthDocument,
  YouthInitiative,
  YouthArticle
} from '../youthUnionData';
import { YouthMembersRosterTab } from '../admin/YouthMembersRosterTab';
import { YouthWorkGroupsTab } from './YouthWorkGroupsTab';
import { YouthTrainingRecordsTab } from './YouthTrainingRecordsTab';

export const WorkspaceShell: React.FC = () => {
  // Dynamic state loaded from admin storage
  const [branches, setBranches] = useState<BranchInfo[]>(() => loadStoredBranches());
  const [criteria, setCriteria] = useState<CriterionItem[]>(() => loadStoredCriteria());
  const [settings, setSettings] = useState<EmulationSettings>(() => loadStoredSettings());
  const [submissions, setSubmissions] = useState<Record<string, Record<string, CriterionSubmissionState>>>(() => loadStoredSubmissions());

  // Additional Youth Union resources
  const [articles, setArticles] = useState<YouthArticle[]>(() => loadStoredArticles());
  const [events, setEvents] = useState<YouthEvent[]>(() => loadStoredEvents());
  const [competitions, setCompetitions] = useState<YouthCompetition[]>(() => loadStoredCompetitions());
  const [documents, setDocuments] = useState<YouthDocument[]>(() => loadStoredDocuments());
  const [initiatives, setInitiatives] = useState<YouthInitiative[]>(() => loadStoredInitiatives());

  // Selected branch
  const [selectedBranchId, setSelectedBranchId] = useState<string>(() => {
    const list = loadStoredBranches();
    return list[0]?.id || 'kp1';
  });

  // Active view
  const [activeView, setActiveView] = useState<'scoring' | 'ranking' | 'members' | 'workgroups' | 'training' | 'news' | 'competitions' | 'initiatives' | 'documents'>('scoring');

  // Active category tab in scoring
  const [activeCategory, setActiveCategory] = useState<'I' | 'II' | 'III' | 'IV'>('I');

  // Modal for evidence upload
  const [uploadModalCriterion, setUploadModalCriterion] = useState<CriterionItem | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'pdf' | 'image' | 'drive'>('pdf');
  const [newFileUrl, setNewFileUrl] = useState('');

  // Interactive Quiz state
  const [activeQuiz, setActiveQuiz] = useState<YouthCompetition | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Proposed Initiative form state
  const [newInitTitle, setNewInitTitle] = useState('');
  const [newInitAuthor, setNewInitAuthor] = useState('');

  // Event RSVP tracking (persisted locally)
  const [registeredEvents, setRegisteredEvents] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem('youth_union_registered_events');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync data whenever Admin makes edits in another tab or window
  useEffect(() => {
    const handleDataUpdate = () => {
      setBranches(loadStoredBranches());
      setCriteria(loadStoredCriteria());
      setSettings(loadStoredSettings());
      setSubmissions(loadStoredSubmissions());
      setArticles(loadStoredArticles());
      setEvents(loadStoredEvents());
      setCompetitions(loadStoredCompetitions());
      setDocuments(loadStoredDocuments());
      setInitiatives(loadStoredInitiatives());
    };

    window.addEventListener('youth_union_data_updated', handleDataUpdate);
    window.addEventListener('storage', handleDataUpdate);
    return () => {
      window.removeEventListener('youth_union_data_updated', handleDataUpdate);
      window.removeEventListener('storage', handleDataUpdate);
    };
  }, []);

  // Save submissions whenever updated
  useEffect(() => {
    saveStoredSubmissions(submissions);
  }, [submissions]);

  // Current branch details
  const currentBranch = useMemo(() => {
    return branches.find(b => b.id === selectedBranchId) || branches[0];
  }, [branches, selectedBranchId]);

  // Submissions for current branch
  const branchSubmissions = useMemo(() => {
    return submissions[selectedBranchId] || {};
  }, [submissions, selectedBranchId]);

  // Calculate stats for current branch
  const stats = useMemo(() => {
    let selfTotal = 0;
    let officialTotal = 0;
    let submittedCount = 0;
    let approvedCount = 0;

    criteria.forEach(c => {
      const sub = branchSubmissions[c.id];
      if (sub?.selfPoints) selfTotal += sub.selfPoints;
      if (sub?.officialPoints !== undefined) officialTotal += sub.officialPoints;
      if (sub?.status === 'APPROVED' || sub?.status === 'PENDING') submittedCount++;
      if (sub?.status === 'APPROVED') approvedCount++;
    });

    return {
      selfScore: selfTotal,
      officialScore: officialTotal,
      submittedCount,
      approvedCount,
      totalCriteria: criteria.length
    };
  }, [branchSubmissions, criteria]);

  // Handle input change for a criterion
  const handleScoreChange = (criterionId: string, maxPoints: number, valueStr: string) => {
    if (!settings.allowSelfScoring) {
      showToast('Cổng tự chấm điểm hiện đã khóa theo thời hạn quy định.');
      return;
    }
    const val = Math.min(Math.max(parseFloat(valueStr) || 0, 0), maxPoints);
    setSubmissions(prev => ({
      ...prev,
      [selectedBranchId]: {
        ...(prev[selectedBranchId] || {}),
        [criterionId]: {
          ...(prev[selectedBranchId]?.[criterionId] || {
            notes: '',
            status: 'DRAFT',
            evidenceFiles: []
          }),
          selfPoints: val
        }
      }
    }));
  };

  const handleNotesChange = (criterionId: string, notes: string) => {
    setSubmissions(prev => ({
      ...prev,
      [selectedBranchId]: {
        ...(prev[selectedBranchId] || {}),
        [criterionId]: {
          ...(prev[selectedBranchId]?.[criterionId] || {
            selfPoints: 0,
            status: 'DRAFT',
            evidenceFiles: []
          }),
          notes
        }
      }
    }));
  };

  const handleSubmitCriterion = (criterionId: string) => {
    setSubmissions(prev => ({
      ...prev,
      [selectedBranchId]: {
        ...(prev[selectedBranchId] || {}),
        [criterionId]: {
          ...(prev[selectedBranchId]?.[criterionId] || {
            selfPoints: 0,
            notes: '',
            evidenceFiles: []
          }),
          status: 'PENDING'
        }
      }
    }));

    // Update branch self-score
    const curSelf = stats.selfScore;
    const nextBranches = branches.map(b => {
      if (b.id === selectedBranchId) {
        return { ...b, selfScore: curSelf };
      }
      return b;
    });
    setBranches(nextBranches);
    saveStoredBranches(nextBranches);

    showToast('Đã lưu và gửi thẩm định tiêu chí thành công về Đoàn Phường!');
  };

  const handleAddEvidence = () => {
    if (!uploadModalCriterion || !newFileName.trim()) return;

    const newEvidence = {
      id: 'f_' + Date.now(),
      name: newFileName.trim(),
      size: newFileType === 'drive' ? 'Liên kết Drive' : '2.4 MB',
      type: newFileType,
      url: newFileUrl.trim() || '#'
    };

    setSubmissions(prev => {
      const currentSub = prev[selectedBranchId]?.[uploadModalCriterion.id] || {
        selfPoints: 0,
        notes: '',
        status: 'DRAFT',
        evidenceFiles: []
      };

      return {
        ...prev,
        [selectedBranchId]: {
          ...(prev[selectedBranchId] || {}),
          [uploadModalCriterion.id]: {
            ...currentSub,
            evidenceFiles: [...(currentSub.evidenceFiles || []), newEvidence]
          }
        }
      };
    });

    setNewFileName('');
    setNewFileUrl('');
    setUploadModalCriterion(null);
    showToast('Đã thêm tài liệu minh chứng thành công!');
  };

  const handleRemoveEvidence = (criterionId: string, fileId: string) => {
    setSubmissions(prev => {
      const currentSub = prev[selectedBranchId]?.[criterionId];
      if (!currentSub) return prev;

      return {
        ...prev,
        [selectedBranchId]: {
          ...prev[selectedBranchId],
          [criterionId]: {
            ...currentSub,
            evidenceFiles: currentSub.evidenceFiles.filter(f => f.id !== fileId)
          }
        }
      };
    });
  };

  // Handle Register Event RSVP
  const handleRegisterEvent = (eventId: string) => {
    const nextReg = { ...registeredEvents, [eventId]: !registeredEvents[eventId] };
    setRegisteredEvents(nextReg);
    localStorage.setItem('youth_union_registered_events', JSON.stringify(nextReg));
    
    const targetEvent = events.find(e => e.id === eventId);
    if (nextReg[eventId]) {
      showToast(`Đăng ký tham gia "${targetEvent?.title || ''}" thành công!`);
    } else {
      showToast(`Đã hủy đăng ký tham gia "${targetEvent?.title || ''}".`);
    }
  };

  // Handle Propose Initiative
  const handleProposeInitiative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInitTitle.trim() || !newInitAuthor.trim()) {
      showToast('Vui lòng điền đầy đủ tiêu đề và tên người hiến kế.');
      return;
    }

    const currentBranchName = currentBranch?.name || 'Chi đoàn Cơ sở';

    const newInit: YouthInitiative = {
      id: 'init_' + Date.now(),
      title: newInitTitle.trim(),
      author: newInitAuthor.trim(),
      branch: currentBranchName,
      date: new Date().toISOString().split('T')[0],
      status: 'Chờ thẩm định'
    };

    const nextInitiatives = [newInit, ...initiatives];
    setInitiatives(nextInitiatives);
    saveStoredInitiatives(nextInitiatives);

    setNewInitTitle('');
    setNewInitAuthor('');
    showToast('Đã gửi sáng kiến - hiến kế thành công lên Đoàn Phường Chánh Hiệp!');
  };

  // Filter criteria by category
  const filteredCriteria = criteria.filter(c => c.category === activeCategory);

  const categories = [
    { 
      id: 'I', 
      label: 'I. Tuyên giáo - Truyền thống', 
      points: `${criteria.filter(c => c.category === 'I').reduce((s, c) => s + c.maxPoints, 0)}đ` 
    },
    { 
      id: 'II', 
      label: 'II. Phong trào Tình nguyện', 
      points: `${criteria.filter(c => c.category === 'II').reduce((s, c) => s + c.maxPoints, 0)}đ` 
    },
    { 
      id: 'III', 
      label: 'III. Xây dựng Đoàn - Hội', 
      points: `${criteria.filter(c => c.category === 'III').reduce((s, c) => s + c.maxPoints, 0)}đ` 
    },
    { 
      id: 'IV', 
      label: 'IV. Chuyển đổi số & Sáng kiến', 
      points: `${criteria.filter(c => c.category === 'IV').reduce((s, c) => s + c.maxPoints, 0)}đ` 
    },
  ];

  // Helper for rank classification
  const getClassification = (score: number) => {
    if (score >= settings.excellentThreshold) return { label: 'Xuất sắc', color: 'bg-amber-100 text-amber-800' };
    if (score >= settings.goodThreshold) return { label: 'Tốt', color: 'bg-emerald-100 text-emerald-800' };
    if (score >= settings.fairThreshold) return { label: 'Khá', color: 'bg-blue-100 text-blue-800' };
    return { label: 'Trung bình', color: 'bg-slate-100 text-slate-700' };
  };

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-emerald-400 px-5 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-3 animate-fade-in text-sm font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Notice Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-7 text-white shadow-md mb-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-white/20 text-white rounded-full text-[10px] font-black tracking-wider uppercase border border-white/20">
                THÔNG BÁO TỪ ĐOÀN PHƯỜNG CHÁNH HIỆP
              </span>
              <span className="text-xs text-blue-200">•</span>
              <span className="text-xs text-blue-100 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Hạn chót: {settings.submissionDeadline}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {settings.noticeTitle}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-3xl">
              {settings.noticeDescription}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView(activeView === 'scoring' ? 'ranking' : 'scoring')}
              className="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              {activeView === 'scoring' ? (
                <>
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Xem Bảng Xếp Hạng Thi Đua</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span>Quay lại Tự Chấm Tiêu Chí</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Header Bar with Branch Selector */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="px-3 py-0.5 bg-blue-100 text-blue-700 text-xs font-black rounded-lg tracking-wider uppercase">
                BÀN LÀM VIỆC SỐ
              </span>
              <span className="text-xs text-slate-400 font-bold">•</span>
              <span className="text-xs text-slate-500 font-semibold">Đoàn TNCS Hồ Chí Minh Phường Chánh Hiệp</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Workspace Chi Đoàn: {currentBranch?.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
              Bí thư Chi đoàn: <strong className="text-slate-800">{currentBranch?.secretary}</strong> • SĐT: {currentBranch?.phone} • Khối: {currentBranch?.type}
            </p>
          </div>

          {/* Unit selector dropdown */}
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 shrink-0">
            <div className="flex items-center gap-2 pl-3 text-slate-500">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Đơn vị:</span>
            </div>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="bg-white border border-slate-300 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 shadow-2xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none cursor-pointer pr-8"
            >
              {branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-white rounded-3xl p-2 border border-slate-200/80 mb-6 shadow-2xs overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        {[
          { id: 'scoring', label: 'Tự chấm tiêu chí', icon: FileCheck, color: 'text-blue-600 bg-blue-50' },
          { id: 'ranking', label: 'Bảng xếp hạng', icon: Trophy, color: 'text-amber-600 bg-amber-50' },
          { id: 'members', label: 'Sổ Đoàn & Đoàn Viên', icon: Users, color: 'text-blue-600 bg-blue-50' },
          { id: 'workgroups', label: 'Nhóm công tác & Thi đua', icon: Layers, color: 'text-indigo-600 bg-indigo-50' },
          { id: 'training', label: 'Sổ rèn luyện đoàn viên', icon: BookOpen, color: 'text-emerald-600 bg-emerald-50' },
          { id: 'news', label: 'Bản tin & Sự kiện', icon: Calendar, color: 'text-emerald-600 bg-emerald-50' },
          { id: 'competitions', label: 'Hội thi trực tuyến', icon: Award, color: 'text-purple-600 bg-purple-50' },
          { id: 'initiatives', label: 'Sáng kiến - Hiến kế', icon: Sparkles, color: 'text-indigo-600 bg-indigo-50' },
          { id: 'documents', label: 'Văn bản chỉ đạo', icon: FileText, color: 'text-slate-600 bg-slate-50' },
        ].map(tab => {
          const isActive = activeView === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:bg-slate-100 font-bold'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color.split(' ')[0]}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* VIEW 1: BẢNG XẾP HẠNG THI ĐUA */}
      {activeView === 'ranking' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-100 text-amber-800">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Bảng Xếp Hạng Thi Đua Chi Đoàn Toàn Phường 2026
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Đoàn Phường Chánh Hiệp • Cập nhật tự động theo thời gian thực
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                Chính thức công bố
              </span>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-4 text-center">Hạng</th>
                    <th className="p-4">Chi Đoàn</th>
                    <th className="p-4">Khối</th>
                    <th className="p-4">Bí thư</th>
                    <th className="p-4 text-center">Điểm Tự Chấm</th>
                    <th className="p-4 text-center">Điểm Chính Thức</th>
                    <th className="p-4 text-center">Xếp Loại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {[...branches]
                    .sort((a, b) => b.officialScore - a.officialScore)
                    .map((b, idx) => {
                      const isCurrent = b.id === selectedBranchId;
                      const cls = getClassification(b.officialScore);
                      return (
                        <tr
                          key={b.id}
                          className={`transition-colors ${
                            isCurrent ? 'bg-blue-50/70 font-bold' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-black text-xs ${
                              idx === 0 ? 'bg-amber-400 text-amber-950 shadow-xs' :
                              idx === 1 ? 'bg-slate-200 text-slate-800' :
                              idx === 2 ? 'bg-amber-200 text-amber-900' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {idx + 1}
                            </span>
                          </td>
                          <td className="p-4 font-black text-slate-900">
                            <div className="flex items-center gap-2">
                              <span>{b.name}</span>
                              {isCurrent && (
                                <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] rounded-md uppercase font-black">
                                  Đơn vị bạn
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-slate-500">{b.type}</td>
                          <td className="p-4 text-slate-700">{b.secretary}</td>
                          <td className="p-4 text-center font-bold text-blue-600">
                            {b.selfScore.toFixed(1)} đ
                          </td>
                          <td className="p-4 text-center font-black text-emerald-600">
                            {b.officialScore.toFixed(1)} đ
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${cls.color}`}>
                              {cls.label}
                            </span>
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

      {/* VIEW: SỔ ĐOÀN ĐIỆN TỬ & ĐOÀN VIÊN CHI ĐOÀN */}
      {activeView === 'members' && (
        <div className="space-y-6 animate-fade-in">
          <YouthMembersRosterTab onNotify={showToast} branchFilterId={selectedBranchId} />
        </div>
      )}

      {/* VIEW: QUẢN LÝ NHÓM CÔNG TÁC & THI ĐUA NHÓM */}
      {activeView === 'workgroups' && (
        <div className="space-y-6 animate-fade-in">
          <YouthWorkGroupsTab branchId={selectedBranchId} branches={branches} onNotify={showToast} />
        </div>
      )}

      {/* VIEW: SỔ THEO DÕI RÈN LUYỆN ĐOÀN VIÊN */}
      {activeView === 'training' && (
        <div className="space-y-6 animate-fade-in">
          <YouthTrainingRecordsTab branchId={selectedBranchId} branches={branches} onNotify={showToast} />
        </div>
      )}

      {/* VIEW 2: SCORING & EVIDENCE SUBMISSIONS */}
      {activeView === 'scoring' && (
        <div className="space-y-6 animate-fade-in">
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {/* Card 1: Điểm tự chấm */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all">
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                ĐIỂM TỰ CHẤM
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">
                  {stats.selfScore.toFixed(1)}
                </span>
                <span className="text-sm font-bold text-slate-400">/ 100 đ</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Dựa trên kết quả tự chấm của Chi đoàn</p>
            </div>

            {/* Card 2: Điểm chính thức */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all">
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                ĐIỂM CHÍNH THỨC
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">
                  {stats.officialScore.toFixed(1)}
                </span>
                <span className="text-sm font-bold text-slate-400">/ 100 đ</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Đoàn Phường đã thẩm định phê duyệt</p>
            </div>

            {/* Card 3: Tiêu chí đã nộp */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-amber-300 transition-all">
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                TIÊU CHÍ ĐÃ NỘP
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-amber-500 tracking-tight">
                  {stats.submittedCount}
                </span>
                <span className="text-sm font-bold text-slate-400">/ {stats.totalCriteria} tiêu chí</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Đã gửi minh chứng về Đoàn cấp trên</p>
            </div>

            {/* Card 4: Thẩm định chuẩn */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-purple-300 transition-all">
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                TIÊU CHÍ ĐÃ DUYỆT
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-purple-600 tracking-tight">
                  {stats.approvedCount}
                </span>
                <span className="text-sm font-bold text-slate-400">đã phê duyệt</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Hồ sơ hợp lệ và ghi nhận điểm</p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2.5 mb-6 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer shadow-2xs whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-blue-500/20 shadow-md font-black'
                      : 'bg-white text-slate-700 hover:bg-slate-100/80 border border-slate-200/80 font-bold'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {cat.points}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Criteria Cards List */}
          <div className="space-y-6">
            {filteredCriteria.map((criterion) => {
              const sub = branchSubmissions[criterion.id] || {
                selfPoints: 0,
                notes: '',
                status: 'DRAFT',
                evidenceFiles: []
              };

              const isApproved = sub.status === 'APPROVED';
              const isPending = sub.status === 'PENDING';

              return (
                <div
                  key={criterion.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-black rounded-lg border border-blue-200/60 font-mono">
                          {criterion.code}
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-slate-900">
                          {criterion.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                        {criterion.description}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0 flex items-center gap-2">
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Đã duyệt: {sub.officialPoints}đ
                        </span>
                      ) : isPending ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-4 h-4 text-amber-600" />
                          Đang thẩm định
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-slate-100 text-slate-600 border border-slate-200">
                          <AlertCircle className="w-4 h-4 text-slate-400" />
                          Chưa nộp
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Form Inputs Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-slate-100">
                    {/* Self score input */}
                    <div className="lg:col-span-3">
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Điểm tự chấm (Tối đa: {criterion.maxPoints}đ)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max={criterion.maxPoints}
                          value={sub.selfPoints === 0 ? '' : sub.selfPoints}
                          onChange={(e) => handleScoreChange(criterion.id, criterion.maxPoints, e.target.value)}
                          placeholder="0"
                          className="w-24 px-3.5 py-2 text-center text-sm font-black text-blue-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        />
                        <span className="text-xs font-bold text-slate-400">/ {criterion.maxPoints} đ</span>
                      </div>
                    </div>

                    {/* Notes input */}
                    <div className="lg:col-span-9">
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Ghi chú giải trình & Minh chứng thực tế
                      </label>
                      <input
                        type="text"
                        value={sub.notes || ''}
                        onChange={(e) => handleNotesChange(criterion.id, e.target.value)}
                        placeholder="VD: Đã tổ chức 02 buổi sinh hoạt chuyên đề, 100% đoàn viên tham gia..."
                        className="w-full px-4 py-2.5 text-xs sm:text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Reviewer Feedback (if any from Admin) */}
                  {sub.reviewerFeedback && (
                    <div className="mt-3 p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                      <span className="font-bold text-emerald-800">Nhận xét từ Đoàn Phường: </span>
                      <span>{sub.reviewerFeedback}</span>
                    </div>
                  )}

                  {/* Evidence files row */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mr-1">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        Hồ sơ minh chứng ({sub.evidenceFiles?.length || 0}):
                      </span>

                      {sub.evidenceFiles && sub.evidenceFiles.length > 0 ? (
                        sub.evidenceFiles.map(file => (
                          <div
                            key={file.id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-xs font-medium text-slate-700 border border-slate-200 transition-colors"
                          >
                            {file.type === 'pdf' ? (
                              <FileText className="w-3.5 h-3.5 text-rose-500" />
                            ) : file.type === 'image' ? (
                              <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                            ) : (
                              <LinkIcon className="w-3.5 h-3.5 text-emerald-500" />
                            )}
                            <span className="max-w-[180px] truncate" title={file.name}>
                              {file.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveEvidence(criterion.id, file.id)}
                              className="text-slate-400 hover:text-red-500 p-0.5 rounded transition-colors cursor-pointer"
                              title="Xóa minh chứng"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs italic text-slate-400">Chưa có tài liệu đính kèm</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setUploadModalCriterion(criterion);
                          setNewFileName('');
                          setNewFileUrl('');
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200/60 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>+ Đính kèm minh chứng</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSubmitCriterion(criterion.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Nộp thẩm định</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: NEWS & EVENTS */}
      {activeView === 'news' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Column 1: Articles / Bản tin */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black text-slate-900">Bản tin Đoàn Phường Chánh Hiệp</h3>
              </div>
              
              <div className="mt-6 space-y-6">
                {articles.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 italic text-sm">Chưa có bài viết hay thông báo mới nào từ Đoàn Phường.</div>
                ) : (
                  articles.map(art => (
                    <div key={art.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-md">
                          {art.category}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">{art.date}</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 mb-1.5 hover:text-blue-600 cursor-pointer">{art.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{art.summary}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Events / Hoạt động */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-black text-slate-900">Lịch hoạt động & Sự kiện</h3>
              </div>

              <div className="mt-6 space-y-4">
                {events.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 italic text-sm">Chưa có sự kiện nào sắp diễn ra.</div>
                ) : (
                  events.map(evt => {
                    const isRegistered = !!registeredEvents[evt.id];
                    return (
                      <div key={evt.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-md">{evt.date}</span>
                            <span className="text-[11px] text-slate-400 font-bold">{evt.location}</span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900">{evt.title}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">{evt.description}</p>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 text-xs">
                          <span className="text-slate-400 font-semibold">Chỉ tiêu: <strong className="text-slate-700">{evt.quota} đoàn viên</strong></span>
                          <button
                            type="button"
                            onClick={() => handleRegisterEvent(evt.id)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                              isRegistered
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white border border-slate-200 text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            {isRegistered ? 'Đã đăng ký' : 'Đăng ký tham gia'}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: COMPETITIONS */}
      {activeView === 'competitions' && (
        <div className="space-y-6 animate-fade-in">
          {!activeQuiz ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <Award className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-black text-slate-900">Hội thi & Trắc nghiệm trực tuyến</h3>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {competitions.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-slate-400 italic text-sm">Hiện tại chưa có hội thi trực tuyến nào đang diễn ra.</div>
                ) : (
                  competitions.map(comp => (
                    <div key={comp.id} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:border-purple-300 transition-all flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-black rounded-md">ĐANG DIỄN RA</span>
                          <span className="text-xs text-slate-400 font-bold">Thời hạn: {comp.deadline}</span>
                        </div>
                        <h4 className="text-base font-black text-slate-900">{comp.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{comp.description}</p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-semibold">
                          Số lượt thi đoàn viên: <strong className="text-purple-600">{comp.participants} lượt</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveQuiz(comp);
                            setQuizAnswers({});
                            setQuizScore(null);
                          }}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl transition-all shadow-xs cursor-pointer"
                        >
                          Bắt đầu thi ngay
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            // Active quiz interface
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <span className="text-xs font-black text-purple-600 tracking-wider uppercase">HỘI THI TRỰC TUYẾN</span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">{activeQuiz.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveQuiz(null)}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {quizScore === null ? (
                <div className="space-y-6">
                  {/* Question 1 */}
                  <div className="p-5 bg-slate-50/70 border border-slate-200/60 rounded-2xl">
                    <p className="text-sm font-black text-slate-900 mb-3">Câu 1: Đoàn TNCS Hồ Chí Minh Phường Chánh Hiệp trực thuộc Đoàn cấp trên nào?</p>
                    <div className="space-y-2">
                      {[
                        { id: 1, text: 'A. Thành đoàn Thủ Dầu Một' },
                        { id: 2, text: 'B. Thành đoàn Dĩ An' },
                        { id: 3, text: 'C. Thành đoàn Thuận An' }
                      ].map(ans => (
                        <label key={ans.id} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer text-xs transition-colors ${
                          quizAnswers[1] === ans.id ? 'bg-purple-50 border-purple-400 text-purple-900 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}>
                          <input
                            type="radio"
                            name="question1"
                            value={ans.id}
                            checked={quizAnswers[1] === ans.id}
                            onChange={() => setQuizAnswers(prev => ({ ...prev, 1: ans.id }))}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <span>{ans.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Question 2 */}
                  <div className="p-5 bg-slate-50/70 border border-slate-200/60 rounded-2xl">
                    <p className="text-sm font-black text-slate-900 mb-3">Câu 2: Khẩu hiệu hành động hành trình số của Chi đoàn Phường Chánh Hiệp thúc đẩy việc gì?</p>
                    <div className="space-y-2">
                      {[
                        { id: 1, text: 'A. Đơn giản hóa thủ tục hành chính, đẩy mạnh số hóa minh chứng và nghiệp vụ quản lý' },
                        { id: 2, text: 'B. Hạn chế hoàn toàn các hoạt động trực tiếp ngoài xã hội' },
                        { id: 3, text: 'C. Triển khai trò chơi điện tử và công nghệ số giải trí' }
                      ].map(ans => (
                        <label key={ans.id} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer text-xs transition-colors ${
                          quizAnswers[2] === ans.id ? 'bg-purple-50 border-purple-400 text-purple-900 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}>
                          <input
                            type="radio"
                            name="question2"
                            value={ans.id}
                            checked={quizAnswers[2] === ans.id}
                            onChange={() => setQuizAnswers(prev => ({ ...prev, 2: ans.id }))}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <span>{ans.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveQuiz(null)}
                      className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!quizAnswers[1] || !quizAnswers[2]) {
                          showToast('Vui lòng chọn đầy đủ đáp án trước khi nộp bài.');
                          return;
                        }
                        // Check score: correct are 1 and 1
                        let score = 0;
                        if (quizAnswers[1] === 1) score += 5;
                        if (quizAnswers[2] === 1) score += 5;
                        setQuizScore(score);

                        // Increment participant count
                        const updated = competitions.map(c => {
                          if (c.id === activeQuiz.id) {
                            return { ...c, participants: c.participants + 1 };
                          }
                          return c;
                        });
                        setCompetitions(updated);
                        saveStoredCompetitions(updated);
                        
                        showToast(`Hoàn thành bài thi! Bạn đạt ${score}/10 điểm.`);
                      }}
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      Nộp bài thi trắc nghiệm
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-50 text-purple-600 border-2 border-purple-200">
                    <Trophy className="w-10 h-10 animate-bounce" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-slate-900">Chúc mừng bạn đã hoàn thành bài thi!</h4>
                    <p className="text-xs text-slate-400">Kết quả của bạn đã được ghi nhận và lưu trữ thành công.</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-2xl max-w-xs mx-auto border border-purple-200">
                    <span className="text-[10px] uppercase font-black text-purple-600 tracking-wider">ĐIỂM SỐ CỦA BẠN</span>
                    <p className="text-3xl font-black text-purple-700 mt-1">{quizScore} / 10 điểm</p>
                  </div>
                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveQuiz(null)}
                      className="px-5 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl cursor-pointer shadow-xs hover:bg-slate-800"
                    >
                      Quay lại danh sách hội thi
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW 5: INITIATIVES */}
      {activeView === 'initiatives' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Column 1: Submission Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-black text-slate-900">Đề xuất Sáng kiến & Hiến kế</h3>
              </div>

              <form onSubmit={handleProposeInitiative} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tên sáng kiến / Ý tưởng sáng tạo</label>
                  <input
                    type="text"
                    required
                    value={newInitTitle}
                    onChange={(e) => setNewInitTitle(e.target.value)}
                    placeholder="VD: Cổng đăng ký hoạt động trực tuyến qua mã QR..."
                    className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none placeholder:text-slate-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Người đề xuất / Tác giả</label>
                  <input
                    type="text"
                    required
                    value={newInitAuthor}
                    onChange={(e) => setNewInitAuthor(e.target.value)}
                    placeholder="VD: Nguyễn Văn A (Đoàn viên Chi đoàn)"
                    className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none placeholder:text-slate-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Chi đoàn đề xuất (Hệ thống tự động)</label>
                  <input
                    type="text"
                    disabled
                    value={currentBranch?.name || ''}
                    className="w-full px-3.5 py-2.5 text-xs text-slate-400 bg-slate-100 border border-slate-200 rounded-xl cursor-not-allowed font-medium"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Nộp đề xuất lên Đoàn Phường</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Column 2: Proposed Lists */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-black text-slate-900">Danh sách ý tưởng đã đề xuất</h3>
                </div>
                <span className="text-xs text-slate-400 font-bold">Chi đoàn: {currentBranch?.name}</span>
              </div>

              <div className="mt-6 space-y-4">
                {initiatives.filter(i => i.branch === currentBranch?.name).length === 0 ? (
                  <div className="text-center py-12 text-slate-400 italic text-sm">Chi đoàn chưa gửi sáng kiến hay giải pháp nào lên Đoàn Phường.</div>
                ) : (
                  initiatives
                    .filter(i => i.branch === currentBranch?.name)
                    .map(init => (
                      <div key={init.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400 font-bold">{init.date}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            init.status === 'Chờ thẩm định' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {init.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900">{init.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">Người đề xuất: <span className="text-slate-700 font-bold">{init.author}</span></p>
                        {init.totalScore !== undefined && (
                          <div className="pt-2.5 border-t border-slate-200/50 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400 font-semibold">Điểm ghi nhận tích lũy:</span>
                            <span className="text-xs font-black text-emerald-600">+{init.totalScore} điểm cộng</span>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 6: DOCUMENTS */}
      {activeView === 'documents' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs animate-fade-in">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-6">
            <FileText className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-black text-slate-900">Kho văn bản, kế hoạch & tài liệu Đoàn</h3>
          </div>

          <div className="space-y-4">
            {documents.length === 0 ? (
              <div className="text-center py-12 text-slate-400 italic text-sm">Chưa có văn bản hay kế hoạch chỉ đạo nào được ban hành.</div>
            ) : (
              documents.map(doc => (
                <div key={doc.id} className="p-5 bg-slate-50/70 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-300 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-black rounded-md">{doc.type}</span>
                      <span className="text-xs text-slate-400 font-bold font-mono">Ban hành: {doc.date}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900">{doc.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{doc.description}</p>
                  </div>

                  <a
                    href={doc.url}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all shadow-2xs self-start sm:self-center cursor-pointer"
                  >
                    <span>Xem văn bản</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Upload Evidence Modal */}
      {uploadModalCriterion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Đính kèm hồ sơ minh chứng</h3>
                <p className="text-xs text-slate-500 mt-0.5">{uploadModalCriterion.code} - {uploadModalCriterion.title}</p>
              </div>
              <button
                onClick={() => setUploadModalCriterion(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Loại tài liệu</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewFileType('pdf')}
                    className={`px-3 py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 ${
                      newFileType === 'pdf' ? 'bg-rose-50 border-rose-300 text-rose-700' : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" /> File PDF / Word
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewFileType('image')}
                    className={`px-3 py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 ${
                      newFileType === 'image' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Ảnh chụp
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewFileType('drive')}
                    className={`px-3 py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 ${
                      newFileType === 'drive' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" /> Link Drive
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Tên hồ sơ / Minh chứng</label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="VD: Bien_ban_sinh_hoat_chuyen_de_thang_3.pdf"
                  className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Đường dẫn (URL / Google Drive) hoặc Chọn file
                </label>
                <input
                  type="text"
                  value={newFileUrl}
                  onChange={(e) => setNewFileUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Upload Dropzone Preview */}
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-center">
                <Upload className="w-7 h-7 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-slate-700">Kéo thả tài liệu hoặc bấm để chọn tệp</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Hỗ trợ PDF, DOCX, JPG, PNG (Tối đa 25MB)</p>
                <input 
                  type="file" 
                  className="hidden" 
                  id="modal-file-input"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setNewFileName(f.name);
                    }
                  }}
                />
                <label
                  htmlFor="modal-file-input"
                  className="inline-block mt-2.5 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs"
                >
                  Chọn tệp từ máy tính
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setUploadModalCriterion(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleAddEvidence}
                disabled={!newFileName.trim()}
                className="px-5 py-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Xác nhận đính kèm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceShell;
