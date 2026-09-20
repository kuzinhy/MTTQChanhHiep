import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Bell, 
  Award, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Layers, 
  Users, 
  FileCheck 
} from 'lucide-react';
import { 
  EmulationSettings, 
  loadStoredSettings, 
  saveStoredSettings, 
  loadStoredBranches, 
  loadStoredCriteria, 
  loadStoredAccounts 
} from '../youthUnionData';

interface Props {
  onNotify: (msg: string) => void;
}

export const WorkspaceConfigTab: React.FC<Props> = ({ onNotify }) => {
  const [config, setConfig] = useState<EmulationSettings>(() => loadStoredSettings());
  const branches = loadStoredBranches();
  const criteria = loadStoredCriteria();
  const accounts = loadStoredAccounts();

  const totalMaxPoints = criteria.reduce((sum, c) => sum + c.maxPoints, 0);

  const handleSave = () => {
    saveStoredSettings(config);
    onNotify('Đã lưu cấu hình hệ thống Workspace Chi đoàn thành công!');
  };

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn đặt lại cấu hình mặc định?')) {
      const def: EmulationSettings = {
        year: 2026,
        isOpenSubmission: true,
        isRankingPublished: true,
        submissionDeadline: '30/11/2026',
        excellentThreshold: 85,
        goodThreshold: 70,
        fairThreshold: 50,
        noticeTitle: 'Thực hiện đánh giá, phân loại và bình xét thi đua các Chi đoàn năm công tác 2026'
      };
      setConfig(def);
      saveStoredSettings(def);
      onNotify('Đã khôi phục cấu hình mặc định!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-md uppercase">
                TRUNG TÂM ĐIỀU HÀNH
              </span>
              <span className="text-xs text-slate-400 font-bold">•</span>
              <span className="text-xs text-slate-500 font-semibold">Workspace Chi đoàn 2026</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Cài Đặt & Cấu Hình Workspace Chi Đoàn
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Quản trị viên cấu hình cơ chế tiếp nhận minh chứng tự chấm, niên độ thi đua, hạn chót và quy chuẩn phân loại cho các Chi đoàn Phường Chánh Hiệp.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục chuẩn</span>
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu Cấu Hình</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Chi đoàn quản lý</p>
                <p className="text-lg font-black text-slate-900">{branches.length} Đơn vị</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Tiêu chí thi đua</p>
                <p className="text-lg font-black text-slate-900">{criteria.length} Tiêu chí ({totalMaxPoints}đ)</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Tài khoản cấp</p>
                <p className="text-lg font-black text-slate-900">{accounts.length} Tài khoản</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                config.isOpenSubmission ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {config.isOpenSubmission ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Cổng nhận nộp</p>
                <p className={`text-sm font-black ${config.isOpenSubmission ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {config.isOpenSubmission ? 'Đang Mở Nhận' : 'Đã Khóa Nhận'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: Cấu hình niên độ & Cổng nộp bài */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Niên Độ Thi Đua & Thời Hạn</h3>
              <p className="text-xs text-slate-400">Kiểm soát tiến trình nộp hồ sơ minh chứng</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Năm công tác thi đua
              </label>
              <input
                type="number"
                value={config.year}
                onChange={(e) => setConfig({ ...config, year: parseInt(e.target.value) || 2026 })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Hạn chót nộp minh chứng tự chấm
              </label>
              <input
                type="text"
                value={config.submissionDeadline}
                onChange={(e) => setConfig({ ...config, submissionDeadline: e.target.value })}
                placeholder="VD: 30/11/2026"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Chi đoàn sẽ thấy đồng hồ đếm ngược và hạn chót này trên Bàn làm việc số.</p>
            </div>

            {/* Switch 1: Cổng nộp bài */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-900">Cổng tiếp nhận tự chấm & minh chứng</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {config.isOpenSubmission 
                    ? 'Cho phép Chi đoàn nhập điểm và tải lên tệp minh chứng' 
                    : 'Chi đoàn chỉ có thể xem, không thể sửa hay gửi bài mới'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConfig({ ...config, isOpenSubmission: !config.isOpenSubmission })}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                  config.isOpenSubmission ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform" />
              </button>
            </div>

            {/* Switch 2: Công bố Bảng xếp hạng */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-900">Công bố Bảng xếp hạng cho Chi đoàn</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {config.isRankingPublished 
                    ? 'Công khai bảng vàng và thứ tự xếp hạng trên toàn bộ Workspace' 
                    : 'Chỉ BTV Đoàn Phường nhìn thấy, tạm ẩn với Chi đoàn'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConfig({ ...config, isRankingPublished: !config.isRankingPublished })}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                  config.isRankingPublished ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Box 2: Cấu hình Mốc điểm xếp loại thi đua */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Quy Chuẩn Xếp Loại Thi Đua</h3>
              <p className="text-xs text-slate-400">Mốc điểm danh hiệu thi đua Chi đoàn chuẩn Thành đoàn</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-black rounded-md">
                    DANH HIỆU XUẤT SẮC
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-1">Chi đoàn Vững mạnh Xuất sắc</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-600">≥</span>
                  <input
                    type="number"
                    value={config.excellentThreshold}
                    onChange={(e) => setConfig({ ...config, excellentThreshold: parseFloat(e.target.value) || 85 })}
                    className="w-16 px-2 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-black text-center text-amber-700 outline-none"
                  />
                  <span className="text-xs font-bold text-slate-500">điểm</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 text-[10px] font-black rounded-md">
                    DANH HIỆU TỐT
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-1">Chi đoàn Vững mạnh (Tốt)</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-600">≥</span>
                  <input
                    type="number"
                    value={config.goodThreshold}
                    onChange={(e) => setConfig({ ...config, goodThreshold: parseFloat(e.target.value) || 70 })}
                    className="w-16 px-2 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-black text-center text-emerald-700 outline-none"
                  />
                  <span className="text-xs font-bold text-slate-500">điểm</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/70 border border-blue-200/70 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 bg-blue-200 text-blue-900 text-[10px] font-black rounded-md">
                    DANH HIỆU KHÁ
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-1">Chi đoàn Khá</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-600">≥</span>
                  <input
                    type="number"
                    value={config.fairThreshold}
                    onChange={(e) => setConfig({ ...config, fairThreshold: parseFloat(e.target.value) || 50 })}
                    className="w-16 px-2 py-1.5 bg-white border border-blue-300 rounded-lg text-xs font-black text-center text-blue-700 outline-none"
                  />
                  <span className="text-xs font-bold text-slate-500">điểm</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-black rounded-md">
                    TRUNG BÌNH / CHƯA ĐẠT
                  </span>
                  <p className="text-xs font-bold text-slate-700 mt-1">Chi đoàn Trung bình hoặc chưa hoàn thành</p>
                </div>
                <span className="text-xs font-black text-slate-500">&lt; {config.fairThreshold} điểm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Box 3: Thông báo chỉ đạo từ Đoàn Phường gửi Workspace */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">Thông Điệp & Chỉ Đạo Tới Workspace Chi Đoàn</h3>
            <p className="text-xs text-slate-400">Hiển thị nổi bật ở thanh đầu trang của tất cả Bí thư Chi đoàn khi truy cập</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Nội dung thông báo chỉ đạo
          </label>
          <textarea
            rows={3}
            value={config.noticeTitle}
            onChange={(e) => setConfig({ ...config, noticeTitle: e.target.value })}
            placeholder="Nhập thông điệp chỉ đạo, hướng dẫn minh chứng của Đoàn Phường..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none leading-relaxed"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Lưu & Đồng Bộ Ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
