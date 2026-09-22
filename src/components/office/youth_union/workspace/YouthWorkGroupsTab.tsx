import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Award, 
  Star, 
  Trophy, 
  Sparkles, 
  ChevronRight, 
  Calendar, 
  CheckSquare, 
  Edit3, 
  Trash2, 
  UserCheck, 
  Phone, 
  Filter, 
  Search, 
  Layers, 
  Activity, 
  ShieldCheck, 
  ArrowUpRight,
  TrendingUp,
  X,
  Save,
  FileCheck
} from 'lucide-react';
import { 
  YouthWorkGroup, 
  YouthWorkGroupTask, 
  YouthMember, 
  BranchInfo, 
  loadStoredWorkGroups, 
  saveStoredWorkGroups, 
  loadStoredYouthMembers,
  saveStoredYouthMembers
} from '../youthUnionData';

interface Props {
  branchId: string;
  branches: BranchInfo[];
  onNotify: (msg: string) => void;
}

export const YouthWorkGroupsTab: React.FC<Props> = ({ branchId, branches, onNotify }) => {
  const [workGroups, setWorkGroups] = useState<YouthWorkGroup[]>(() => loadStoredWorkGroups());
  const [members, setMembers] = useState<YouthMember[]>(() => loadStoredYouthMembers());
  const [selectedGroup, setSelectedGroup] = useState<YouthWorkGroup | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('ALL');

  // Modal States
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<YouthWorkGroup | null>(null);

  // Form State for Work Group
  const [groupName, setGroupName] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [groupLeaderId, setGroupLeaderId] = useState('');
  const [groupTheme, setGroupTheme] = useState<'blue' | 'emerald' | 'purple' | 'amber' | 'indigo' | 'rose'>('blue');
  const [groupQuarter, setGroupQuarter] = useState('Quý III/2026');

  // Form State for Task
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('30/09/2026');
  const [taskPoints, setTaskPoints] = useState(20);
  const [taskMembers, setTaskMembers] = useState('');

  // Form State for Evaluation
  const [evalScore, setEvalScore] = useState(90);
  const [evalRanking, setEvalRanking] = useState<'XUẤT SẮC' | 'TỐT' | 'KHÁ' | 'TRUNG BÌNH'>('XUẤT SẮC');
  const [evalNotes, setEvalNotes] = useState('');

  // Filter groups
  const filteredGroups = useMemo(() => {
    return workGroups.filter(g => {
      const matchSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          g.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          g.leaderName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchQuarter = selectedQuarter === 'ALL' || g.quarter === selectedQuarter;
      return matchSearch && matchQuarter;
    });
  }, [workGroups, searchTerm, selectedQuarter]);

  // Active group or first
  const activeGroup = useMemo(() => {
    if (selectedGroup) {
      const found = workGroups.find(g => g.id === selectedGroup.id);
      if (found) return found;
    }
    return filteredGroups[0] || workGroups[0] || null;
  }, [selectedGroup, workGroups, filteredGroups]);

  // Available members for leader selection or task assign
  const branchMembers = useMemo(() => {
    return members.filter(m => m.branchId === branchId);
  }, [members, branchId]);

  // Overall Statistics
  const stats = useMemo(() => {
    const totalGroups = workGroups.length;
    const totalTasks = workGroups.reduce((acc, g) => acc + g.tasks.length, 0);
    const completedTasks = workGroups.reduce((acc, g) => acc + g.tasks.filter(t => t.status === 'COMPLETED').length, 0);
    const avgScore = totalGroups > 0 ? Math.round(workGroups.reduce((acc, g) => acc + g.emulationScore, 0) / totalGroups) : 0;
    const excellentCount = workGroups.filter(g => g.ranking === 'XUẤT SẮC').length;

    return { totalGroups, totalTasks, completedTasks, avgScore, excellentCount };
  }, [workGroups]);

  // Handler: Toggle Task Status
  const handleToggleTaskStatus = (groupId: string, taskId: string) => {
    const updatedGroups = workGroups.map(group => {
      if (group.id !== groupId) return group;
      const updatedTasks = group.tasks.map(t => {
        if (t.id !== taskId) return t;
        const newStatus: YouthWorkGroupTask['status'] = t.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
        return { ...t, status: newStatus };
      });
      const completedCount = updatedTasks.filter(t => t.status === 'COMPLETED').length;
      return {
        ...group,
        tasks: updatedTasks,
        completedTasksCount: completedCount
      };
    });

    setWorkGroups(updatedGroups);
    saveStoredWorkGroups(updatedGroups);
    onNotify('Cập nhật trạng thái nhiệm vụ nhóm thành công!');
  };

  // Handler: Open Add Task Modal
  const handleOpenAddTask = (group: YouthWorkGroup) => {
    setSelectedGroup(group);
    setTaskTitle('');
    setTaskDeadline('30/09/2026');
    setTaskPoints(20);
    setTaskMembers(group.leaderName);
    setIsNewTaskModalOpen(true);
  };

  // Handler: Save Task
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGroup || !taskTitle.trim()) return;

    const newTask: YouthWorkGroupTask = {
      id: 'ts_' + Date.now(),
      title: taskTitle.trim(),
      assignedDate: new Date().toLocaleDateString('vi-VN'),
      deadline: taskDeadline,
      status: 'IN_PROGRESS',
      points: Number(taskPoints) || 20,
      assignedMemberNames: taskMembers ? taskMembers.split(',').map(s => s.trim()) : [activeGroup.leaderName]
    };

    const updatedGroups = workGroups.map(group => {
      if (group.id !== activeGroup.id) return group;
      const tasks = [newTask, ...group.tasks];
      return {
        ...group,
        tasks,
        targetTasksCount: tasks.length,
        completedTasksCount: tasks.filter(t => t.status === 'COMPLETED').length
      };
    });

    setWorkGroups(updatedGroups);
    saveStoredWorkGroups(updatedGroups);
    setIsNewTaskModalOpen(false);
    onNotify(`Đã giao nhiệm vụ mới cho ${activeGroup.name}!`);
  };

  // Handler: Delete Task
  const handleDeleteTask = (groupId: string, taskId: string) => {
    const updatedGroups = workGroups.map(group => {
      if (group.id !== groupId) return group;
      const tasks = group.tasks.filter(t => t.id !== taskId);
      return {
        ...group,
        tasks,
        targetTasksCount: tasks.length,
        completedTasksCount: tasks.filter(t => t.status === 'COMPLETED').length
      };
    });

    setWorkGroups(updatedGroups);
    saveStoredWorkGroups(updatedGroups);
    onNotify('Đã xóa nhiệm vụ công tác.');
  };

  // Handler: Open Group Form for Create or Edit
  const handleOpenGroupModal = (group?: YouthWorkGroup) => {
    if (group) {
      setEditingGroup(group);
      setGroupName(group.name);
      setGroupCode(group.code);
      setGroupDesc(group.description);
      setGroupLeaderId(group.leaderId);
      setGroupTheme(group.colorTheme);
      setGroupQuarter(group.quarter);
    } else {
      setEditingGroup(null);
      setGroupName('');
      setGroupCode(`TỔ-CT-${workGroups.length + 1 < 10 ? '0' : ''}${workGroups.length + 1}`);
      setGroupDesc('');
      setGroupLeaderId(branchMembers[0]?.id || 'ym_001');
      setGroupTheme('blue');
      setGroupQuarter('Quý III/2026');
    }
    setIsNewGroupModalOpen(true);
  };

  // Handler: Save Group
  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || !groupCode.trim()) {
      onNotify('Vui lòng nhập tên nhóm và mã định danh.');
      return;
    }

    const leader = members.find(m => m.id === groupLeaderId) || branchMembers[0] || {
      id: 'ym_001',
      fullName: 'Trần Thị Bích',
      phone: '0912.345.678'
    };

    if (editingGroup) {
      const updatedGroups = workGroups.map(g => {
        if (g.id !== editingGroup.id) return g;
        return {
          ...g,
          name: groupName.trim(),
          code: groupCode.trim().toUpperCase(),
          description: groupDesc.trim(),
          leaderId: leader.id,
          leaderName: leader.fullName,
          leaderPhone: leader.phone,
          colorTheme: groupTheme,
          quarter: groupQuarter
        };
      });
      setWorkGroups(updatedGroups);
      saveStoredWorkGroups(updatedGroups);
      onNotify('Đã cập nhật thông tin nhóm công tác!');
    } else {
      const newGroup: YouthWorkGroup = {
        id: 'wg_' + Date.now(),
        branchId: branchId,
        name: groupName.trim(),
        code: groupCode.trim().toUpperCase(),
        description: groupDesc.trim(),
        leaderId: leader.id,
        leaderName: leader.fullName,
        leaderPhone: leader.phone,
        memberIds: [leader.id],
        colorTheme: groupTheme,
        targetTasksCount: 0,
        completedTasksCount: 0,
        emulationScore: 85,
        ranking: 'TỐT',
        quarter: groupQuarter,
        tasks: [],
        evaluationNotes: 'Nhóm công tác mới được thành lập.'
      };
      const next = [...workGroups, newGroup];
      setWorkGroups(next);
      saveStoredWorkGroups(next);
      setSelectedGroup(newGroup);
      onNotify(`Đã thành lập "${newGroup.name}" thành công!`);
    }

    setIsNewGroupModalOpen(false);
  };

  // Handler: Open Evaluation Modal
  const handleOpenEvaluationModal = (group: YouthWorkGroup) => {
    setSelectedGroup(group);
    setEvalScore(group.emulationScore);
    setEvalRanking(group.ranking);
    setEvalNotes(group.evaluationNotes || '');
    setIsEvaluationModalOpen(true);
  };

  // Handler: Save Evaluation
  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;

    const updatedGroups = workGroups.map(g => {
      if (g.id !== selectedGroup.id) return g;
      return {
        ...g,
        emulationScore: Number(evalScore),
        ranking: evalRanking,
        evaluationNotes: evalNotes.trim()
      };
    });

    setWorkGroups(updatedGroups);
    saveStoredWorkGroups(updatedGroups);
    setIsEvaluationModalOpen(false);
    onNotify(`Đã lưu kết quả đánh giá thi đua cho ${selectedGroup.name}!`);
  };

  const getThemeColorClasses = (theme: YouthWorkGroup['colorTheme']) => {
    switch (theme) {
      case 'emerald':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-500', bar: 'bg-emerald-500' };
      case 'purple':
        return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-500', bar: 'bg-purple-500' };
      case 'rose':
        return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', badge: 'bg-rose-500', bar: 'bg-rose-500' };
      case 'amber':
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-500', bar: 'bg-amber-500' };
      case 'blue':
      default:
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-600', bar: 'bg-blue-600' };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tổng số nhóm công tác</span>
            <div className="text-2xl font-black text-slate-900">{stats.totalGroups}</div>
            <div className="text-[11px] text-blue-600 font-bold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Phân chia theo chuyên môn
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tiến độ nhiệm vụ</span>
            <div className="text-2xl font-black text-emerald-600">
              {stats.completedTasks} <span className="text-sm font-semibold text-slate-400">/ {stats.totalTasks}</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}% hoàn thành
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Điểm thi đua TB</span>
            <div className="text-2xl font-black text-amber-500">{stats.avgScore}đ</div>
            <div className="text-[11px] text-amber-700 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> {stats.excellentCount} nhóm Xuất sắc
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Chuyển đổi số & Xung kích</span>
            <div className="text-2xl font-black text-indigo-600">100%</div>
            <div className="text-[11px] text-indigo-600 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Đạt chuẩn thi đua 2026
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Tìm kiếm nhóm, mã tổ, trưởng nhóm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Kỳ đánh giá:</span>
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2.5 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">Tất cả kỳ thi đua</option>
              <option value="Quý III/2026">Quý III/2026</option>
              <option value="Quý II/2026">Quý II/2026</option>
              <option value="Quý I/2026">Quý I/2026</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => handleOpenGroupModal()}
          className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thành lập Nhóm công tác mới</span>
        </button>
      </div>

      {/* Main Content Layout: Group List + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Work Group Cards List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Danh sách nhóm công tác ({filteredGroups.length})
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">Nhấn để xem & điều hành</span>
          </div>

          {filteredGroups.map(group => {
            const isSelected = activeGroup?.id === group.id;
            const themeStyles = getThemeColorClasses(group.colorTheme);
            const progress = group.tasks.length > 0 ? Math.round((group.tasks.filter(t => t.status === 'COMPLETED').length / group.tasks.length) * 100) : 0;

            return (
              <div
                key={group.id}
                onClick={() => setSelectedGroup(group)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected 
                    ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/10' 
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${themeStyles.bg} ${themeStyles.text} border ${themeStyles.border}`}>
                        {group.code}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">{group.quarter}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 leading-snug">
                      {group.name}
                    </h4>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                      group.ranking === 'XUẤT SẮC' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                      group.ranking === 'TỐT' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      <Trophy className="w-3 h-3 text-amber-500" />
                      {group.emulationScore}đ • {group.ranking}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {group.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-500">Nhiệm vụ hoàn thành</span>
                    <span className="text-slate-800 font-extrabold">{group.completedTasksCount}/{group.tasks.length} ({progress}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${themeStyles.bar}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Leader & Member count */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-[10px] text-slate-700">
                      {group.leaderName.charAt(0)}
                    </div>
                    <span className="font-bold">{group.leaderName}</span>
                    <span className="text-[10px] text-slate-400 font-medium">(Trưởng nhóm)</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{group.memberIds.length} đoàn viên</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Group Operations & Tasks Console */}
        <div className="lg:col-span-7">
          {activeGroup ? (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
              {/* Group Header info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-black tracking-wider uppercase">
                      {activeGroup.code}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">•</span>
                    <span className="text-xs text-slate-500 font-semibold">{activeGroup.quarter}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    {activeGroup.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                    {activeGroup.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenEvaluationModal(activeGroup)}
                    className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Đánh giá thi đua</span>
                  </button>
                  <button
                    onClick={() => handleOpenGroupModal(activeGroup)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
                    title="Chỉnh sửa nhóm"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Group Officers & Member Roster in Group */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    {activeGroup.leaderName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trưởng nhóm công tác</div>
                    <div className="text-xs font-black text-slate-900">{activeGroup.leaderName}</div>
                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" /> {activeGroup.leaderPhone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:border-l sm:border-slate-200 sm:pl-4">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Điểm thi đua nhóm</div>
                    <div className="text-sm font-black text-amber-600 flex items-center sm:justify-end gap-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      {activeGroup.emulationScore} / 100 điểm
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Xếp loại: {activeGroup.ranking}</div>
                  </div>
                </div>
              </div>

              {/* Evaluation Note Banner if exists */}
              {activeGroup.evaluationNotes && (
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Đánh giá của Ban Chấp hành:</strong> {activeGroup.evaluationNotes}
                  </div>
                </div>
              )}

              {/* Action Plan & Task Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                      Danh mục công việc & Chỉ tiêu rèn luyện ({activeGroup.tasks.length})
                    </h4>
                    <p className="text-[11px] text-slate-500">Phân công nhiệm vụ cụ thể cho từng thành viên trong nhóm</p>
                  </div>

                  <button
                    onClick={() => handleOpenAddTask(activeGroup)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Giao việc mới</span>
                  </button>
                </div>

                {/* Tasks List */}
                <div className="space-y-3">
                  {activeGroup.tasks.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <CheckSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-600">Chưa có nhiệm vụ nào được giao cho nhóm này.</p>
                      <button
                        onClick={() => handleOpenAddTask(activeGroup)}
                        className="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 cursor-pointer"
                      >
                        Tạo công việc đầu tiên
                      </button>
                    </div>
                  ) : (
                    activeGroup.tasks.map(task => {
                      const isDone = task.status === 'COMPLETED';

                      return (
                        <div
                          key={task.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            isDone 
                              ? 'bg-emerald-50/40 border-emerald-200/80' 
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => handleToggleTaskStatus(activeGroup.id, task.id)}
                                className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                                  isDone 
                                    ? 'bg-emerald-600 border-emerald-600 text-white' 
                                    : 'border-slate-300 hover:border-blue-500 bg-white'
                                }`}
                              >
                                {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                              </button>

                              <div className="space-y-1">
                                <h5 className={`text-xs font-bold leading-snug ${isDone ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                                  {task.title}
                                </h5>

                                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-slate-400" /> Hạn chót: <strong className="text-slate-700">{task.deadline}</strong>
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1 font-semibold text-blue-700">
                                    <UserCheck className="w-3 h-3 text-blue-500" /> Phụ trách: {task.assignedMemberNames.join(', ')}
                                  </span>
                                  <span>•</span>
                                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px]">
                                    +{task.points} điểm thi đua
                                  </span>
                                </div>

                                {task.resultNote && (
                                  <div className="text-[11px] text-emerald-800 font-medium bg-emerald-100/60 p-2 rounded-xl mt-2 border border-emerald-200/50">
                                    <strong>Kết quả ghi nhận:</strong> {task.resultNote}
                                  </div>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => handleDeleteTask(activeGroup.id, task.id)}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                              title="Xóa nhiệm vụ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
              Chưa chọn nhóm công tác nào.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add or Edit Work Group */}
      {isNewGroupModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                {editingGroup ? 'Chỉnh sửa Nhóm công tác' : 'Thành lập Nhóm công tác mới'}
              </h3>
              <button 
                onClick={() => setIsNewGroupModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGroup} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên Nhóm / Tổ công tác *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Tổ Công nghệ số cộng đồng & Dịch vụ công"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã định danh *</label>
                  <input
                    type="text"
                    required
                    placeholder="TỔ-CNS-01"
                    value={groupCode}
                    onChange={(e) => setGroupCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kỳ thi đua</label>
                  <input
                    type="text"
                    value={groupQuarter}
                    onChange={(e) => setGroupQuarter(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Trưởng nhóm phụ trách *</label>
                <select
                  value={groupLeaderId}
                  onChange={(e) => setGroupLeaderId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {branchMembers.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} - {m.position} ({m.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả chức năng & nhiệm vụ</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả chi tiết mục tiêu, phạm vi hoạt động của nhóm..."
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Màu sắc nhận diện</label>
                <div className="flex items-center gap-3">
                  {[
                    { id: 'blue', label: 'Xanh dương' },
                    { id: 'emerald', label: 'Xanh lá' },
                    { id: 'purple', label: 'Tím' },
                    { id: 'amber', label: 'Vàng cam' },
                    { id: 'rose', label: 'Hồng đỏ' }
                  ].map(c => (
                    <label key={c.id} className="flex items-center gap-1.5 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        checked={groupTheme === c.id}
                        onChange={() => setGroupTheme(c.id as any)}
                      />
                      <span>{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewGroupModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingGroup ? 'Lưu thay đổi' : 'Thành lập nhóm'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Task */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Giao nhiệm vụ mới cho nhóm
              </h3>
              <button 
                onClick={() => setIsNewTaskModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề nhiệm vụ *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ra quân hướng dẫn người dân tạo tài khoản VNeID"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hạn hoàn thành</label>
                  <input
                    type="text"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    placeholder="30/09/2026"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Điểm cộng thi đua</label>
                  <input
                    type="number"
                    min={5}
                    max={50}
                    value={taskPoints}
                    onChange={(e) => setTaskPoints(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Đoàn viên được phân công</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Thành Nam, Trần Thị Bích"
                  value={taskMembers}
                  onChange={(e) => setTaskMembers(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Xác nhận giao việc</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Group Emulation Evaluation */}
      {isEvaluationModalOpen && selectedGroup && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Đánh giá thi đua Nhóm công tác
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedGroup.name}</p>
              </div>
              <button 
                onClick={() => setIsEvaluationModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvaluation} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Điểm thi đua (0 - 100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={evalScore}
                    onChange={(e) => setEvalScore(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-amber-600 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Xếp loại thi đua</label>
                  <select
                    value={evalRanking}
                    onChange={(e) => setEvalRanking(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="XUẤT SẮC">XUẤT SẮC</option>
                    <option value="TỐT">TỐT</option>
                    <option value="KHÁ">KHÁ</option>
                    <option value="TRUNG BÌNH">TRUNG BÌNH</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nhận xét đánh giá của Ban Chấp hành</label>
                <textarea
                  rows={4}
                  placeholder="Ghi nhận các kết quả nổi bật, mô hình sáng tạo và hạn chế cần khắc phục..."
                  value={evalNotes}
                  onChange={(e) => setEvalNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEvaluationModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Lưu kết quả đánh giá</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
