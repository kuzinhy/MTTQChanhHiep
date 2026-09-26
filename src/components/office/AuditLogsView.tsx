import React, { useState, useMemo } from 'react';
import { AuditLog } from '../../types';
import { ShieldAlert, Search, User, Clock, FileText, Filter, ListFilter, X } from 'lucide-react';

interface AuditLogsViewProps {
  logs: AuditLog[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');

  // Extract unique actions for dynamic filtering suggestions
  const uniqueActions = useMemo(() => {
    const actions = new Set<string>();
    logs.forEach(log => {
      if (log.action) actions.add(log.action.toUpperCase());
    });
    return Array.from(actions);
  }, [logs]);

  // Filter logs based on search term and selected action
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAction = 
        selectedAction === 'ALL' || 
        log.action?.toUpperCase() === selectedAction.toUpperCase();

      return matchesSearch && matchesAction;
    });
  }, [logs, searchTerm, selectedAction]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-emerald-600 animate-pulse" />
            <span>NHẬT KÝ HOẠT ĐỘNG HỆ THỐNG (AUDIT LOGS)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Ghi vết các thao tác đăng nhập, biên tập nội dung và cập nhật dữ liệu cán bộ</p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
            Tổng số: {logs.length} bản ghi
          </span>
          {filteredLogs.length !== logs.length && (
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 animate-fade-in">
              Tìm thấy: {filteredLogs.length} kết quả
            </span>
          )}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên cán bộ, hành động, đối tượng hoặc nội dung chi tiết..."
              className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-500/80 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Lọc nhanh hành động:
            </span>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/15 cursor-pointer text-slate-700"
            >
              <option value="ALL">Tất cả hành động</option>
              {uniqueActions.map(act => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mr-1">Hành động mẫu:</span>
          <button
            onClick={() => { setSelectedAction('ALL'); setSearchTerm(''); }}
            className={`px-3 py-1 rounded-lg text-xs font-black border transition-all cursor-pointer ${
              selectedAction === 'ALL' && !searchTerm
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            TẤT CẢ
          </button>
          {['CẬP NHẬT', 'XUẤT BẢN', 'ĐĂNG NHẬP', 'PHÊ DUYỆT', 'THAO TÁC'].map((act) => {
            const isChipSelected = selectedAction.toUpperCase() === act;
            return (
              <button
                key={act}
                onClick={() => setSelectedAction(act)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  isChipSelected
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                }`}
              >
                {act}
              </button>
            );
          })}
        </div>
      </div>

      {/* Logs Table Area */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center border border-slate-200">
              <ListFilter className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-slate-800">Không tìm thấy kết quả phù hợp</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Hãy kiểm tra lại từ khóa tìm kiếm hoặc chọn lọc bộ lọc hành động khác.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedAction('ALL'); }}
              className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
            >
              Thiết lập lại bộ lọc
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase">
                  <th className="p-3.5">Thời Gian</th>
                  <th className="p-3.5">Cán Bộ Thực Hiện</th>
                  <th className="p-3.5">Hành Động</th>
                  <th className="p-3.5">Trạng Thái</th>
                  <th className="p-3.5">Đối Tượng</th>
                  <th className="p-3.5">Chi Tiết Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-emerald-50/10 transition-colors">
                    <td className="p-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{log.timestamp}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-black text-[10px] border border-slate-200 shrink-0">
                          {log.userName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div>{log.userName}</div>
                          {log.email && <div className="text-[10px] text-slate-400 font-mono font-normal">{log.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 font-bold text-[10px] rounded-md border border-blue-200 whitespace-nowrap">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      {log.result === 'FAILED' || log.result === 'DENIED' ? (
                        <span className="px-2 py-0.5 bg-red-50 text-red-700 font-black text-[10px] rounded border border-red-200">
                          ✕ THẤT BẠI
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-black text-[10px] rounded border border-emerald-200">
                          ✓ THÀNH CÔNG
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-700 whitespace-nowrap">{log.entity}</td>
                    <td className="p-3.5 text-slate-600 max-w-md truncate" title={log.details}>
                      {log.details}
                      {log.reason && <div className="text-[10px] text-red-600 font-bold mt-0.5">Lý do: {log.reason}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
