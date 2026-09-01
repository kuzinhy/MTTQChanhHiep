import React, { useState } from 'react';
import { Task, TaskStatus, PriorityLevel } from '../../types';
import { CheckSquare, Plus, Calendar, User, Clock, AlertCircle, CheckCircle2, Filter, Search, LayoutList, Columns, X } from 'lucide-react';

interface TaskManagementViewProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
}

export const TaskManagementView: React.FC<TaskManagementViewProps> = ({
  tasks,
  onAddTask,
  onUpdateTaskStatus
}) => {
  const [viewMode, setViewMode] = useState<'LIST' | 'KANBAN'>('LIST');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeName, setAssigneeName] = useState('Lê Văn Bình');
  const [priority, setPriority] = useState<PriorityLevel>('NORMAL');
  const [deadline, setDeadline] = useState('2026-09-15');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: 'task-' + Date.now(),
      title,
      description,
      assigneeName,
      assignerName: 'Trần Thị Hoa',
      priority,
      status: 'TODO',
      deadline,
      createdAt: new Date().toISOString().substring(0, 10)
    };

    onAddTask(newTask);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const filteredTasks = tasks.filter(t => filterStatus === 'ALL' || t.status === filterStatus);

  const getPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'URGENT': return <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold text-[10px] rounded-md">KHẨN</span>;
      case 'HIGH': return <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded-md">CAO</span>;
      default: return <span className="px-2 py-0.5 bg-stone-100 text-stone-700 font-bold text-[10px] rounded-md">BÌNH THƯỜNG</span>;
    }
  };

  const getStatusBadge = (s: TaskStatus) => {
    switch (s) {
      case 'DONE': return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-md">HOÀN THÀNH</span>;
      case 'IN_PROGRESS': return <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-bold text-[10px] rounded-md">ĐANG THỰC HIỆN</span>;
      case 'OVERDUE': return <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold text-[10px] rounded-md">QUÁ HẠN</span>;
      default: return <span className="px-2 py-0.5 bg-stone-100 text-stone-700 font-bold text-[10px] rounded-md">CHƯA THỰC HIỆN</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-blue-600" />
            <span>QUẢN LÝ &amp; GIAO CÔNG VIỆC NỘI BỘ</span>
          </h1>
          <p className="text-xs text-stone-500">Theo dõi tiến độ nhiệm vụ tham mưu, an sinh và phong trào thi đua</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-stone-100 p-1 rounded-xl flex items-center gap-1 border border-stone-200">
            <button
              onClick={() => setViewMode('LIST')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'LIST' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Danh sách</span>
            </button>
            <button
              onClick={() => setViewMode('KANBAN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'KANBAN' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Giao việc mới</span>
          </button>
        </div>
      </div>

      {/* LIST VIEW */}
      {viewMode === 'LIST' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between text-xs">
            <span className="font-bold text-stone-700">Danh sách công việc ({filteredTasks.length})</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs px-3 py-1.5 border border-stone-300 rounded-lg outline-hidden"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="TODO">Chưa thực hiện</option>
              <option value="IN_PROGRESS">Đang thực hiện</option>
              <option value="DONE">Hoàn thành</option>
            </select>
          </div>

          <div className="divide-y divide-stone-100">
            {filteredTasks.map((t) => (
              <div key={t.id} className="p-4 hover:bg-amber-50/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(t.priority)}
                    {getStatusBadge(t.status)}
                    <span className="font-bold text-stone-900 text-sm">{t.title}</span>
                  </div>
                  <p className="text-stone-600 line-clamp-2">{t.description}</p>
                  <div className="flex items-center gap-4 text-stone-400 text-[11px] pt-1">
                    <span>Người thực hiện: <strong className="text-stone-700">{t.assigneeName}</strong></span>
                    <span>Hạn chót: <strong className="text-red-700">{t.deadline}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {t.status !== 'DONE' && (
                    <button
                      onClick={() => onUpdateTaskStatus(t.id, 'DONE')}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đánh dấu hoàn thành</span>
                    </button>
                  )}
                  {t.status === 'TODO' && (
                    <button
                      onClick={() => onUpdateTaskStatus(t.id, 'IN_PROGRESS')}
                      className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white font-bold text-[11px] rounded-lg transition-colors"
                    >
                      Bắt đầu làm
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KANBAN VIEW */}
      {viewMode === 'KANBAN' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TODO Col */}
          <div className="bg-stone-100 p-4 rounded-2xl space-y-3 border border-stone-200">
            <h3 className="font-bold text-stone-700 text-xs uppercase tracking-wider flex items-center justify-between">
              <span>Chưa thực hiện</span>
              <span className="bg-stone-200 px-2 py-0.5 rounded-full text-stone-800">
                {tasks.filter(t => t.status === 'TODO').length}
              </span>
            </h3>
            <div className="space-y-3">
              {tasks.filter(t => t.status === 'TODO').map(t => (
                <div key={t.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    {getPriorityBadge(t.priority)}
                    <span className="text-[10px] text-stone-400">{t.deadline}</span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-xs">{t.title}</h4>
                  <p className="text-[11px] text-stone-500 line-clamp-2">{t.description}</p>
                  <button
                    onClick={() => onUpdateTaskStatus(t.id, 'IN_PROGRESS')}
                    className="w-full mt-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-[11px] rounded-md"
                  >
                    Chuyển sang Đang làm
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* IN_PROGRESS Col */}
          <div className="bg-sky-50/60 p-4 rounded-2xl space-y-3 border border-sky-200">
            <h3 className="font-bold text-sky-900 text-xs uppercase tracking-wider flex items-center justify-between">
              <span>Đang thực hiện</span>
              <span className="bg-sky-200 px-2 py-0.5 rounded-full text-sky-900">
                {tasks.filter(t => t.status === 'IN_PROGRESS').length}
              </span>
            </h3>
            <div className="space-y-3">
              {tasks.filter(t => t.status === 'IN_PROGRESS').map(t => (
                <div key={t.id} className="bg-white p-4 rounded-xl border border-sky-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    {getPriorityBadge(t.priority)}
                    <span className="text-[10px] text-red-700 font-bold">{t.deadline}</span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-xs">{t.title}</h4>
                  <p className="text-[11px] text-stone-500 line-clamp-2">{t.description}</p>
                  <button
                    onClick={() => onUpdateTaskStatus(t.id, 'DONE')}
                    className="w-full mt-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] rounded-md"
                  >
                    Hoàn thành
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* DONE Col */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl space-y-3 border border-emerald-200">
            <h3 className="font-bold text-emerald-900 text-xs uppercase tracking-wider flex items-center justify-between">
              <span>Đã hoàn thành</span>
              <span className="bg-emerald-200 px-2 py-0.5 rounded-full text-emerald-900">
                {tasks.filter(t => t.status === 'DONE').length}
              </span>
            </h3>
            <div className="space-y-3">
              {tasks.filter(t => t.status === 'DONE').map(t => (
                <div key={t.id} className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs space-y-2 opacity-90">
                  <h4 className="font-bold text-stone-900 text-xs line-through">{t.title}</h4>
                  <p className="text-[11px] text-emerald-800 font-semibold">✓ Đã xong đúng hạn</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">Giao Công Việc Nhiệm Vụ Mới</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Tên nhiệm vụ (*)</label>
                <input
                  type="text"
                  placeholder="Nhập tên công việc..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-800 outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Nội dung yêu cầu</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả công việc..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-800 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Cán bộ giao việc</label>
                  <select
                    value={assigneeName}
                    onChange={(e) => setAssigneeName(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-800 outline-hidden"
                  >
                    <option value="Lê Văn Bình">Lê Văn Bình (Phó Chủ tịch)</option>
                    <option value="Trần Văn Nam">Trần Văn Nam (Ủy viên TT)</option>
                    <option value="Lê Thị Thu Thảo">Lê Thị Thu Thảo (Tuyên giáo)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Mức độ ưu tiên</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-800 outline-hidden"
                  >
                    <option value="NORMAL">Bình thường</option>
                    <option value="HIGH">Cao</option>
                    <option value="URGENT">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Hạn chót hoàn thành</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-800 outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-800 hover:bg-red-900 text-amber-200 font-bold rounded-xl shadow-xs"
                >
                  Tạo nhiệm vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
