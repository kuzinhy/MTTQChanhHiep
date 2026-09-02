import React from 'react';
import { AuditLog } from '../../types';
import { ShieldAlert, Search, User, Clock, FileText } from 'lucide-react';

interface AuditLogsViewProps {
  logs: AuditLog[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-blue-600" />
            <span>NHẬT KÝ HOẠT ĐỘNG HỆ THỐNG (AUDIT LOGS)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Ghi vết các thao tác đăng nhập, biên tập nội dung và cập nhật dữ liệu cán bộ</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase">
              <th className="p-3.5">Thời Gian</th>
              <th className="p-3.5">Cán Bộ Thực Hiện</th>
              <th className="p-3.5">Hành Động</th>
              <th className="p-3.5">Đối Tượng</th>
              <th className="p-3.5">Chi Tiết Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="p-3.5 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                <td className="p-3.5 font-bold text-slate-900">{log.userName}</td>
                <td className="p-3.5">
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 font-bold text-[10px] rounded-md border border-blue-200">
                    {log.action}
                  </span>
                </td>
                <td className="p-3.5 font-semibold text-slate-700">{log.entity}</td>
                <td className="p-3.5 text-slate-600 max-w-md truncate">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
