import React, { useState } from 'react';
import { WorkflowProcedure, WorkflowNode, WorkflowNodeType } from '../../types/workflow';
import { INITIAL_WORKFLOW_PROCEDURES } from '../../data/workflowProceduresSeed';
import { 
  Layers, Plus, Edit3, Trash2, ArrowUp, ArrowDown, Save, 
  Sparkles, Play, CheckCircle2, AlertCircle, Building2, MapPin, 
  Clock, FileText, X, ChevronRight, Eye
} from 'lucide-react';

interface ProcedureWorkflowBuilderAdminViewProps {
  onTriggerToast: (title: string, message?: string) => void;
}

export const ProcedureWorkflowBuilderAdminView: React.FC<ProcedureWorkflowBuilderAdminViewProps> = ({
  onTriggerToast
}) => {
  const [procedures, setProcedures] = useState<WorkflowProcedure[]>(() => {
    try {
      const saved = localStorage.getItem('chanhhiep_workflow_procedures_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_WORKFLOW_PROCEDURES;
  });

  const [selectedProcId, setSelectedProcId] = useState<string>(procedures[0]?.id || '');
  const [isEditingProc, setIsEditingProc] = useState(false);
  const [currentProcEdit, setCurrentProcEdit] = useState<WorkflowProcedure | null>(null);

  const activeProcedure = procedures.find(p => p.id === selectedProcId) || procedures[0];

  const saveToStorage = (updated: WorkflowProcedure[]) => {
    setProcedures(updated);
    try {
      localStorage.setItem('chanhhiep_workflow_procedures_v2', JSON.stringify(updated));
      window.dispatchEvent(new Event('app_storage_synced'));
    } catch (e) {}
  };

  const handleOpenEditProc = (proc?: WorkflowProcedure) => {
    if (proc) {
      setCurrentProcEdit(JSON.parse(JSON.stringify(proc)));
    } else {
      setCurrentProcEdit({
        id: `wf-proc-${Date.now()}`,
        code: `T-WF-${Math.floor(Math.random() * 900 + 100)}`,
        name: '',
        aliases: [],
        category: 'Hộ tịch',
        description: '',
        authority: 'UBND Phường Chánh Hiệp',
        locationId: 'loc-mot-cua',
        counter: 'Quầy tiếp nhận Một cửa',
        onlineAvailable: true,
        onlineUrl: 'https://dichvucong.binhduong.gov.vn',
        processingTime: 'Trong ngày làm việc',
        fee: 'Theo quy định pháp luật',
        officialSourceUrl: 'https://dichvucong.gov.vn',
        sourceUpdatedAt: new Date().toISOString().split('T')[0],
        active: true,
        version: 'v2.0',
        updatedAt: new Date().toISOString(),
        updatedBy: 'Cán bộ Quản trị',
        nodes: [
          {
            id: `node-${Date.now()}-1`,
            type: 'START',
            title: 'Bắt đầu quy trình',
            subtitle: 'Khởi tạo',
            description: 'Người dân xác định nhu cầu thực hiện thủ tục.',
            status: 'DONE',
            stepNumber: 1
          }
        ],
        edges: []
      });
    }
    setIsEditingProc(true);
  };

  const handleSaveProc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProcEdit) return;

    const exists = procedures.some(p => p.id === currentProcEdit.id);
    let updated: WorkflowProcedure[];
    if (exists) {
      updated = procedures.map(p => p.id === currentProcEdit.id ? { ...currentProcEdit, updatedAt: new Date().toISOString() } : p);
    } else {
      updated = [...procedures, currentProcEdit];
    }
    saveToStorage(updated);
    setIsEditingProc(false);
    onTriggerToast('Thành công', 'Đã lưu cấu hình luồng quy trình (Workflow)');
  };

  const handleMoveNode = (nodeIdx: number, direction: 'up' | 'down') => {
    if (!activeProcedure) return;
    const nodes = [...activeProcedure.nodes];
    const targetIdx = direction === 'up' ? nodeIdx - 1 : nodeIdx + 1;
    if (targetIdx < 0 || targetIdx >= nodes.length) return;

    const temp = nodes[nodeIdx];
    nodes[nodeIdx] = nodes[targetIdx];
    nodes[targetIdx] = temp;

    nodes.forEach((n, idx) => { n.stepNumber = idx + 1; });

    const updated = procedures.map(p => p.id === activeProcedure.id ? { ...p, nodes } : p);
    saveToStorage(updated);
  };

  const handleAddNodeToActive = () => {
    if (!activeProcedure) return;
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: 'PROCESS',
      title: 'Bước nghiệp vụ mới',
      subtitle: 'Xử lý',
      description: 'Mô tả chi tiết bước công việc.',
      instruction: 'Hướng dẫn cho công dân thao tác.',
      status: 'WAITING',
      stepNumber: activeProcedure.nodes.length + 1
    };
    const nodes = [...activeProcedure.nodes, newNode];
    const updated = procedures.map(p => p.id === activeProcedure.id ? { ...p, nodes } : p);
    saveToStorage(updated);
  };

  const handleDeleteNode = (nodeId: string) => {
    if (!activeProcedure) return;
    if (activeProcedure.nodes.length <= 1) {
      alert('Quy trình phải có ít nhất 1 node.');
      return;
    }
    const nodes = activeProcedure.nodes.filter(n => n.id !== nodeId).map((n, idx) => ({ ...n, stepNumber: idx + 1 }));
    const updated = procedures.map(p => p.id === activeProcedure.id ? { ...p, nodes } : p);
    saveToStorage(updated);
  };

  const handleUpdateNodeField = (nodeId: string, field: keyof WorkflowNode, value: any) => {
    if (!activeProcedure) return;
    const nodes = activeProcedure.nodes.map(n => n.id === nodeId ? { ...n, [field]: value } : n);
    const updated = procedures.map(p => p.id === activeProcedure.id ? { ...p, nodes } : p);
    saveToStorage(updated);
  };

  const nodeTypes: WorkflowNodeType[] = [
    'START', 'USER_ACTION', 'DOCUMENT', 'FORM', 'LOCATION', 'COUNTER', 'VERIFY', 'DECISION', 'PROCESS', 'PAYMENT', 'RESULT', 'END'
  ];

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* HEADER BAR */}
      <div className="bg-[#08111F] text-white p-6 rounded-3xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-950 text-cyan-400 rounded-2xl border border-cyan-800 shadow-md">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight">
              Trình thiết kế quy trình đồ họa (Visual Procedure Builder)
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Thiết kế sơ đồ luồng (Workflow Nodes &amp; Connectors), rẽ nhánh và cấu hình mô phỏng thời gian thực
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleOpenEditProc()}
          className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm luồng thủ tục mới</span>
        </button>
      </div>

      {/* 2-COLUMN BUILDER WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: PROCEDURES LIST (4/12) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-[#08111F] rounded-3xl border border-slate-800 p-4 shadow-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono font-bold text-slate-400">
              <span>DANH SÁCH THỦ TỤC ({procedures.length})</span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
              {procedures.map(proc => {
                const isSelected = proc.id === selectedProcId;
                return (
                  <div
                    key={proc.id}
                    onClick={() => setSelectedProcId(proc.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-sm ring-1 ring-cyan-400/40'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px] font-black border border-cyan-800">
                          {proc.code}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">
                          {proc.nodes.length} nodes
                        </span>
                      </div>
                      <h4 className="font-bold text-xs line-clamp-1 group-hover:text-cyan-300 transition-colors">
                        {proc.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleOpenEditProc(proc); }}
                        className="p-1.5 bg-slate-800 text-slate-300 hover:text-cyan-300 rounded-lg cursor-pointer"
                        title="Sửa thông tin"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: NODE SEQUENCE BUILDER (8/12) */}
        <div className="lg:col-span-8 space-y-6">
          {activeProcedure ? (
            <div className="bg-[#08111F] rounded-3xl border border-slate-800 p-6 shadow-md space-y-6 text-white">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-xs font-black border border-cyan-800">
                      {activeProcedure.code}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">
                      {activeProcedure.category} • {activeProcedure.authority}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white mt-1">
                    {activeProcedure.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleAddNodeToActive}
                  className="px-3.5 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Node mới</span>
                </button>
              </div>

              {/* NODES LIST */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                {activeProcedure.nodes.map((node, idx) => (
                  <div 
                    key={node.id}
                    className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-cyan-500 text-slate-950 font-mono font-black text-xs flex items-center justify-center shrink-0">
                          0{idx + 1}
                        </span>
                        
                        <select
                          value={node.type}
                          onChange={(e) => handleUpdateNodeField(node.id, 'type', e.target.value)}
                          className="bg-slate-950 border border-slate-700 text-cyan-300 text-xs font-mono font-bold rounded-lg px-2 py-1 outline-none"
                        >
                          {nodeTypes.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>

                        <input
                          type="text"
                          value={node.title}
                          onChange={(e) => handleUpdateNodeField(node.id, 'title', e.target.value)}
                          className="text-xs font-black text-white bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 w-60 outline-none focus:border-cyan-400"
                          placeholder="Tiêu đề Node..."
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveNode(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 rounded-lg cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveNode(idx, 'down')}
                          disabled={idx === activeProcedure.nodes.length - 1}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 rounded-lg cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNode(node.id)}
                          className="p-1.5 bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Mô tả tóm tắt</label>
                        <input
                          type="text"
                          value={node.description}
                          onChange={(e) => handleUpdateNodeField(node.id, 'description', e.target.value)}
                          className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Quầy / Địa điểm</label>
                        <input
                          type="text"
                          value={node.counter || ''}
                          onChange={(e) => handleUpdateNodeField(node.id, 'counter', e.target.value)}
                          className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 outline-none"
                          placeholder="Ví dụ: Quầy số 1..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : null}
        </div>

      </div>

      {/* EDIT MODAL */}
      {isEditingProc && currentProcEdit && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#08111F] text-white rounded-3xl p-6 border border-slate-800 max-w-xl w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-sm text-cyan-300">Cấu hình thông tin thủ tục</h3>
              <button type="button" onClick={() => setIsEditingProc(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProc} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Mã thủ tục</label>
                  <input
                    type="text"
                    required
                    value={currentProcEdit.code}
                    onChange={(e) => setCurrentProcEdit({ ...currentProcEdit, code: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-xl font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Lĩnh vực</label>
                  <select
                    value={currentProcEdit.category}
                    onChange={(e) => setCurrentProcEdit({ ...currentProcEdit, category: e.target.value as any })}
                    className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold"
                  >
                    <option value="Hộ tịch">Hộ tịch</option>
                    <option value="Chứng thực">Chứng thực</option>
                    <option value="An sinh">An sinh</option>
                    <option value="Đất đai">Đất đai</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Tên thủ tục</label>
                <input
                  type="text"
                  required
                  value={currentProcEdit.name}
                  onChange={(e) => setCurrentProcEdit({ ...currentProcEdit, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setIsEditingProc(false)} className="px-4 py-2 bg-slate-800 rounded-xl text-xs font-bold">
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 bg-cyan-500 text-slate-950 rounded-xl text-xs font-black">
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
