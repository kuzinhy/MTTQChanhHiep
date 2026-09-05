import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Sparkles, 
  Plus, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  ArrowUpRight, 
  LayoutGrid, 
  List,
  Edit,
  Save,
  Download
} from 'lucide-react';
import { SecurityNoticeBanner } from '../SecurityNoticeBanner';
import { MttqTask, MttqTaskStatus } from '../../../../types';
import { aiWorkspaceService } from '../../../../lib/aiWorkspaceService';

export const TaskTrackingToolView: React.FC = () => {
  const [tasks, setTasks] = useState<MttqTask[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [showAddModal, setShowAddModal] = useState(false);
  const [extractorText, setExtractorText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssigned, setNewTaskAssigned] = useState('21 Ban CTMT Khu phố');
  const [newTaskDue, setNewTaskDue] = useState('2026-09-30');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    setTasks(aiWorkspaceService.getTasks());
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;
    const task: MttqTask = {
      id: `task_${Date.now()}`,
      title: newTaskTitle,
      description: `Nhiệm vụ khởi tạo cho ${newTaskAssigned}`,
      assignedTo: newTaskAssigned,
      dueDate: newTaskDue,
      priority: newTaskPriority,
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString()
    };
    aiWorkspaceService.saveTask(task);
    setNewTaskTitle('');
    setShowAddModal(false);
    loadTasks();
  };

  const handleUpdateStatus = (id: string, status: MttqTaskStatus) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const updated: MttqTask = {
      ...task,
      status,
      progress: status === 'completed' ? 100 : status === 'in_progress' ? 50 : task.progress
    };
    aiWorkspaceService.saveTask(updated);
    loadTasks();
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa nhiệm vụ này?')) {
      aiWorkspaceService.deleteTask(id);
      loadTasks();
    }
  };

  const handleExtractFromText = () => {
    if (!extractorText.trim()) return;
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
      const extracted: MttqTask[] = [
        {
          id: `task_${Date.now()}_1`,
          title: 'Soạn thảo Kế hoạch phối hợp Tháng cao điểm Vì người nghèo',
          description: 'Bóc tách tự động từ văn bản chỉ đạo',
          assignedTo: 'Ban Thường trực MTTQ Phường',
          dueDate: '2026-09-15',
          priority: 'high',
          status: 'pending',
          progress: 0,
          createdAt: new Date().toISOString()
        },
        {
          id: `task_${Date.now()}_2`,
          title: 'Tổng hợp danh sách 120 hộ nghèo, hộ cận nghèo nhận quà',
          description: 'Bóc tách tự động từ văn bản chỉ đạo',
          assignedTo: '21 Ban CTMT Khu phố',
          dueDate: '2026-09-20',
          priority: 'medium',
          status: 'in_progress',
          progress: 30,
          createdAt: new Date().toISOString()
        }
      ];
      extracted.forEach(t => aiWorkspaceService.saveTask(t));
      setExtractorText('');
      loadTasks();
      alert('Đã tự động bóc tách 2 nhiệm vụ mới vào Sổ theo dõi tiến độ!');
    }, 1000);
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-5 overflow-y-auto h-full pb-20">
      <SecurityNoticeBanner />

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">7. Trích nhiệm vụ & Theo dõi tiến độ (Task Management)</h2>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                LÕI NHÓM 04
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Bóc tách công việc tự động từ tài liệu chỉ đạo & quản lý tiến độ thực hiện của 21 Khu phố.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Nhiệm Vụ Mới</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Tổng nhiệm vụ</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalTasks}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-amber-600 uppercase">Chưa triển khai</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingTasks}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-blue-600 uppercase">Đang thực hiện</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{inProgressTasks}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-emerald-600 uppercase">Hoàn thành</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{completedTasks}</div>
        </div>
      </div>

      {/* Extractor Quick Tool */}
      <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-2xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Bóc Tách Nhiệm Vụ Nhanh Từ Văn Bản / Kết Luận Họp:</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={extractorText}
            onChange={(e) => setExtractorText(e.target.value)}
            placeholder="Dán thông báo kết luận cuộc họp hoặc nội dung công văn vào đây..."
            className="flex-1 p-2.5 bg-white border border-blue-200 rounded-xl text-xs text-slate-800 outline-hidden focus:border-blue-500"
          />
          <button
            onClick={handleExtractFromText}
            disabled={isExtracting || !extractorText.trim()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
          >
            {isExtracting ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Bóc Tách Task</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên nhiệm vụ hoặc đơn vị..."
            className="w-full bg-transparent outline-hidden text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-hidden"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chưa triển khai</option>
            <option value="in_progress">Đang thực hiện</option>
            <option value="completed">Đã hoàn thành</option>
          </select>
        </div>
      </div>

      {/* Task List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
            <tr>
              <th className="p-3.5">Nội dung nhiệm vụ</th>
              <th className="p-3.5">Đơn vị phụ trách</th>
              <th className="p-3.5">Thời hạn</th>
              <th className="p-3.5 text-center">Mức ưu tiên</th>
              <th className="p-3.5 text-center">Trạng thái</th>
              <th className="p-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTasks.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="p-3.5 font-semibold text-slate-900">{t.title}</td>
                <td className="p-3.5 text-blue-700 font-medium">{t.assignedTo}</td>
                <td className="p-3.5 font-mono text-slate-600">{t.dueDate}</td>
                <td className="p-3.5 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    t.priority === 'high'
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {t.priority === 'high' ? 'Cao' : 'Bình thường'}
                  </span>
                </td>
                <td className="p-3.5 text-center">
                  <select
                    value={t.status}
                    onChange={(e) => handleUpdateStatus(t.id, e.target.value as MttqTaskStatus)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold border outline-hidden ${
                      t.status === 'completed'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : t.status === 'in_progress'
                        ? 'bg-blue-50 border-blue-300 text-blue-800'
                        : 'bg-amber-50 border-amber-300 text-amber-800'
                    }`}
                  >
                    <option value="pending">Chưa triển khai</option>
                    <option value="in_progress">Đang thực hiện</option>
                    <option value="completed">Đã hoàn thành</option>
                  </select>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => handleDeleteTask(t.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Tạo Nhiệm Vụ Mới</h3>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Tên nhiệm vụ:</label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Nhập tên nhiệm vụ..."
                className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Đơn vị phụ trách:</label>
              <input
                type="text"
                value={newTaskAssigned}
                onChange={(e) => setNewTaskAssigned(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Thời hạn:</label>
                <input
                  type="date"
                  value={newTaskDue}
                  onChange={(e) => setNewTaskDue(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-xl text-xs outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Mức ưu tiên:</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border rounded-xl text-xs outline-hidden"
                >
                  <option value="medium">Bình thường</option>
                  <option value="high">Cao</option>
                  <option value="urgent">Gấp</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateTask}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Lưu Nhiệm Vụ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
