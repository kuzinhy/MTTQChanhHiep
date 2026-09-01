import React from 'react';
import { AuditLog } from '../../types';
import { ShieldAlert, Search, User, Clock, FileText } from 'lucide-react';

interface AuditLogsViewProps {
  logs: AuditLog[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-800" />
            <span>NHẬT KÝ HOẠT ĐỘNG HỆ THỐNG (AUDIT LOGS)</span>
          </h1>
          <p className="text-xs text-stone-500">Ghi vết các thao tác đăng nhập, biên tập nội dung và cập nhật dữ liệu cán bộ</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-100 border-b border-stone-200 text-[11px] font-bold text-stone-700 uppercase">
              <th className="p-3.5">Thời Gian</th>
              <th className="p-3.5">Cán Bộ Thực Hiện</th>
              <th className="p-3.5">Hành Động</th>
              <th className="p-3.5">Đối Tượng</th>
              <th className="p-3.5">Chi Tiết Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-800">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-amber-50/30">
                <td className="p-3.5 font-mono text-[11px] text-stone-500">{log.timestamp}</td>
                <td className="p-3.5 font-bold text-stone-900">{log.userName}</td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 bg-red-100 text-red-900 font-bold text-[10px] rounded-md">
                    {log.action}
                  </span>
                </td>
                <td className="p-3.5 font-semibold text-stone-700">{log.entity}</td>
                <td className="p-3.5 text-stone-600 max-w-md truncate">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
