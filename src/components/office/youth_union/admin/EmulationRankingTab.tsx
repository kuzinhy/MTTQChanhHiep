import React, { useState } from 'react';
import { 
  Award, 
  Trophy, 
  Medal, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer, 
  Download, 
  Eye, 
  Filter, 
  TrendingUp, 
  Building2, 
  FileText, 
  X, 
  Save, 
  ExternalLink, 
  Check, 
  Sparkles,
  ChevronDown
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
  saveStoredSettings 
} from '../youthUnionData';

interface Props {
  onNotify: (msg: string) => void;
}

export const EmulationRankingTab: React.FC<Props> = ({ onNotify }) => {
  const [branches, setBranches] = useState<BranchInfo[]>(() => loadStoredBranches());
  const [criteria, setCriteria] = useState<CriterionItem[]>(() => loadStoredCriteria());
  const [submissions, setSubmissions] = useState<Record<string, Record<string, CriterionSubmissionState>>>(() => loadStoredSubmissions());
  const [settings, setSettings] = useState<EmulationSettings>(() => loadStoredSettings());

  // Filter and Sort states
  const [sortBy, setSortBy] = useState<'official' | 'self'>('official');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Review Modal state
  const [reviewBranch, setReviewBranch] = useState<BranchInfo | null>(null);
  const [reviewScores, setReviewScores] = useState<Record<string, { points: number; feedback: string }>>({});

  // Export Modal state
  const [showExportModal, setShowExportModal] = useState(false);

  // Classify helper
  const getClassification = (score: number) => {
    if (score >= settings.excellentThreshold) return { label: 'Xuất sắc', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    if (score >= settings.goodThreshold) return { label: 'Tốt', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (score >= settings.fairThreshold) return { label: 'Khá', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    return { label: 'Trung bình', color: 'bg-slate-100 text-slate-700 border-slate-300' };
  };

  // Sort and filter branches
  const sortedBranches = [...branches]
    .filter(b => {
      const matchSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.secretary.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'ALL' || b.type === filterType;
      return matchSearch && matchType;
    })
    .sort((a, b) => {
      const scoreA = sortBy === 'official' ? a.officialScore : a.selfScore;
      const scoreB = sortBy === 'official' ? b.officialScore : b.selfScore;
      return scoreB - scoreA;
    });

  // Top 3 for Golden Board
  const top1 = sortedBranches[0];
  const top2 = sortedBranches[1];
  const top3 = sortedBranches[2];

  // Stats
  const countExcellent = branches.filter(b => b.officialScore >= settings.excellentThreshold).length;
  const countGood = branches.filter(b => b.officialScore >= settings.goodThreshold && b.officialScore < settings.excellentThreshold).length;
  const countFair = branches.filter(b => b.officialScore >= settings.fairThreshold && b.officialScore < settings.goodThreshold).length;
  const countAverage = branches.filter(b => b.officialScore < settings.fairThreshold).length;

  // Toggle Publish
  const handleTogglePublish = () => {
    const nextState = !settings.isRankingPublished;
    const updated = { ...settings, isRankingPublished: nextState };
    setSettings(updated);
    saveStoredSettings(updated);
    onNotify(nextState ? 'Đã công bố Bảng xếp hạng cho toàn bộ Chi đoàn!' : 'Đã chuyển Bảng xếp hạng về chế độ nội bộ.');
  };

  // Open Review Modal for a Branch
  const handleOpenReview = (branch: BranchInfo) => {
    setReviewBranch(branch);
    const branchSubs = submissions[branch.id] || {};
    const initialReviewState: Record<string, { points: number; feedback: string }> = {};

    criteria.forEach(c => {
      const sub = branchSubs[c.id];
      initialReviewState[c.id] = {
        points: sub?.officialPoints !== undefined ? sub.officialPoints : (sub?.selfPoints || 0),
        feedback: sub?.reviewerFeedback || ''
      };
    });

    setReviewScores(initialReviewState);
  };

  // Fast approve all self points
  const handleQuickApproveAll = () => {
    if (!reviewBranch) return;
    const branchSubs = submissions[reviewBranch.id] || {};
    const updatedState: Record<string, { points: number; feedback: string }> = {};

    criteria.forEach(c => {
      const sub = branchSubs[c.id];
      const selfPts = sub?.selfPoints || 0;
      updatedState[c.id] = {
        points: selfPts,
        feedback: 'Hồ sơ minh chứng đầy đủ, đạt chuẩn tiêu chí.'
      };
    });

    setReviewScores(updatedState);
    onNotify('Đã tự động điền toàn bộ điểm tự chấm của Chi đoàn!');
  };

  // Save Review Results
  const handleSaveReview = () => {
    if (!reviewBranch) return;

    let totalOfficial = 0;
    let approvedCount = 0;
    const branchSubs = { ...(submissions[reviewBranch.id] || {}) };

    criteria.forEach(c => {
      const rev = reviewScores[c.id] || { points: 0, feedback: '' };
      totalOfficial += rev.points;
      if (rev.points > 0) approvedCount++;

      branchSubs[c.id] = {
        ...(branchSubs[c.id] || {
          selfPoints: rev.points,
          notes: '',
          evidenceFiles: []
        }),
        officialPoints: rev.points,
        reviewerFeedback: rev.feedback,
        status: 'APPROVED',
        reviewedAt: new Date().toLocaleDateString('vi-VN')
      };
    });

    // Update submissions
    const nextSubmissions = {
      ...submissions,
      [reviewBranch.id]: branchSubs
    };
    setSubmissions(nextSubmissions);
    saveStoredSubmissions(nextSubmissions);

    // Update branch scores
    const nextBranches = branches.map(b => {
      if (b.id === reviewBranch.id) {
        return {
          ...b,
          officialScore: totalOfficial,
          approvedCount: approvedCount
        };
      }
      return b;
    });
    setBranches(nextBranches);
    saveStoredBranches(nextBranches);

    setReviewBranch(null);
    onNotify(`Đã thẩm định và lưu điểm chính thức cho ${reviewBranch.name}: ${totalOfficial.toFixed(1)} điểm!`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black rounded-md uppercase">
                BẢNG VÀNG THI ĐUA
              </span>
              <span className="text-xs text-slate-400 font-bold">•</span>
              <span className="text-xs text-slate-500 font-semibold">Đoàn TNCS Hồ Chí Minh Phường Chánh Hiệp</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Bảng Xếp Hạng Thi Đua & Thẩm Định Điểm 2026
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Xếp hạng thời gian thực dựa trên kết quả tự chấm và điểm thẩm định chính thức của Ban Thường vụ Đoàn Phường Chánh Hiệp.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleTogglePublish}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                settings.isRankingPublished
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{settings.isRankingPublished ? 'Đã Công Bố Toàn Diện' : 'Đang Ẩn Nội Bộ'}</span>
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Xuất Báo Cáo Xếp Hạng</span>
            </button>
          </div>
        </div>

        {/* 4 Classification Metric Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/60">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-amber-800 uppercase">XUẤT SẮC (≥{settings.excellentThreshold}đ)</span>
              <Trophy className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-amber-900 mt-1">{countExcellent} Đơn vị</p>
            <p className="text-[11px] text-amber-700 mt-0.5 font-medium">Chi đoàn Vững mạnh tiêu biểu</p>
          </div>

          <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/60">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-emerald-800 uppercase">TỐT (≥{settings.goodThreshold}đ)</span>
              <Medal className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-900 mt-1">{countGood} Đơn vị</p>
            <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">Chi đoàn Hoàn thành tốt</p>
          </div>

          <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200/60">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-blue-800 uppercase">KHÁ (≥{settings.fairThreshold}đ)</span>
              <Award className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-blue-900 mt-1">{countFair} Đơn vị</p>
            <p className="text-[11px] text-blue-700 mt-0.5 font-medium">Chi đoàn Hoàn thành</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-600 uppercase">TRUNG BÌNH (&lt;{settings.fairThreshold}đ)</span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-2xl font-black text-slate-800 mt-1">{countAverage} Đơn vị</p>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Cần bổ sung hồ sơ</p>
          </div>
        </div>
      </div>

      {/* Top 3 Golden Podium Cards */}
      {sortedBranches.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Top 2 - Silver */}
          {top2 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs relative overflow-hidden order-2 md:order-1 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-black text-xs flex items-center gap-1 border border-slate-200">
                  <Medal className="w-3.5 h-3.5 text-slate-500" />
                  HẠNG NHÌ (BẠC)
                </span>
                <span className="text-2xl font-black text-slate-400">#2</span>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 line-clamp-2">
                  {top2.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Bí thư: {top2.secretary} • {top2.type}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-baseline justify-between">
                <span className="text-xs font-bold text-slate-400">Điểm thẩm định:</span>
                <span className="text-2xl font-black text-slate-700">{top2.officialScore.toFixed(1)} đ</span>
              </div>
            </div>
          )}

          {/* Top 1 - Gold Champion */}
          {top1 && (
            <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl p-6 sm:p-7 border-2 border-amber-300 shadow-md relative overflow-hidden order-1 md:order-2 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3.5 py-1 rounded-full bg-amber-500 text-white font-black text-xs flex items-center gap-1.5 shadow-xs">
                  <Trophy className="w-3.5 h-3.5 text-amber-200" />
                  DẪN ĐẦU THI ĐUA (VÀNG)
                </span>
                <span className="text-3xl font-black text-amber-500">🥇 #1</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {top1.name}
                </h3>
                <p className="text-xs text-amber-900/80 font-medium mt-1">
                  Bí thư: {top1.secretary} • Khối {top1.type}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-amber-200/60 flex items-baseline justify-between">
                <span className="text-xs font-black text-amber-800">Điểm xuất sắc:</span>
                <span className="text-3xl font-black text-amber-600 tracking-tight">
                  {top1.officialScore.toFixed(1)} đ
                </span>
              </div>
            </div>
          )}

          {/* Top 3 - Bronze */}
          {top3 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs relative overflow-hidden order-3 md:order-3 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-amber-100/70 text-amber-800 font-black text-xs flex items-center gap-1 border border-amber-200">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  HẠNG BA (ĐỒNG)
                </span>
                <span className="text-2xl font-black text-amber-700/60">#3</span>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 line-clamp-2">
                  {top3.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Bí thư: {top3.secretary} • {top3.type}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-baseline justify-between">
                <span className="text-xs font-bold text-slate-400">Điểm thẩm định:</span>
                <span className="text-2xl font-black text-slate-700">{top3.officialScore.toFixed(1)} đ</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Sắp xếp theo:</span>
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setSortBy('official')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                sortBy === 'official' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Điểm chính thức
            </button>
            <button
              onClick={() => setSortBy('self')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                sortBy === 'self' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Điểm tự chấm
            </button>
          </div>
        </div>

        {/* Filter type */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'DÂN CƯ', 'TRƯỜNG HỌC', 'LỰC LƯỢNG VŨ TRANG', 'DOANH NGHIỆP'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                filterType === t ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t === 'ALL' ? 'Tất cả' : t}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm tên Chi đoàn..."
            className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-56"
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4 text-center">Hạng</th>
                <th className="p-4">Chi Đoàn</th>
                <th className="p-4">Khối</th>
                <th className="p-4">Bí thư</th>
                <th className="p-4 text-center">Điểm Tự Chấm</th>
                <th className="p-4 text-center">Điểm Chính Thức</th>
                <th className="p-4 text-center">Xếp Loại Thi Đua</th>
                <th className="p-4 text-right">Thẩm Định</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sortedBranches.map((branch, idx) => {
                const rank = idx + 1;
                const cls = getClassification(branch.officialScore);

                return (
                  <tr key={branch.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-black text-xs ${
                        rank === 1 ? 'bg-amber-400 text-amber-950 shadow-xs' :
                        rank === 2 ? 'bg-slate-200 text-slate-800' :
                        rank === 3 ? 'bg-amber-200 text-amber-900' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {rank}
                      </span>
                    </td>
                    <td className="p-4 font-black text-slate-900">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{branch.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        {branch.type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 font-bold">
                      {branch.secretary}
                      <span className="block text-[10px] text-slate-400 font-normal">{branch.phone}</span>
                    </td>
                    <td className="p-4 text-center font-bold text-blue-600">
                      {branch.selfScore.toFixed(1)} đ
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                        {branch.officialScore.toFixed(1)} đ
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${cls.color}`}>
                        {cls.label}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenReview(branch)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs transition-all border border-blue-200 hover:border-blue-600 cursor-pointer"
                      >
                        Thẩm định điểm
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal: Thẩm Định Chi Tiết Hồ Sơ Minh Chứng */}
      {reviewBranch && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-scale-up">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-md uppercase">
                    HỘI ĐỒNG THẨM ĐỊNH ĐOÀN PHƯỜNG
                  </span>
                  <span className="text-xs text-slate-400 font-bold">•</span>
                  <span className="text-xs text-slate-500 font-semibold">{reviewBranch.name}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Thẩm Định Điểm & Hồ Sơ Minh Chứng Thi Đua
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleQuickApproveAll}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Duyệt nhanh toàn bộ tự chấm</span>
                </button>
                <button
                  onClick={() => setReviewBranch(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body with Criteria Submissions */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {criteria.map((crit) => {
                const sub = (submissions[reviewBranch.id] || {})[crit.id] || {
                  selfPoints: 0,
                  notes: '',
                  evidenceFiles: []
                };
                const rev = reviewScores[crit.id] || { points: 0, feedback: '' };

                return (
                  <div
                    key={crit.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-mono text-[11px] font-bold rounded-md">
                            {crit.code}
                          </span>
                          <span className="text-xs font-black text-slate-900">{crit.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">{crit.description}</p>
                      </div>
                      <span className="text-xs font-black text-slate-600 shrink-0 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        Tối đa: {crit.maxPoints}đ
                      </span>
                    </div>

                    {/* Chi doan self score & notes */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200/60 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-bold">Chi đoàn tự chấm:</span>
                        <span className="font-black text-blue-600">{sub.selfPoints || 0} / {crit.maxPoints} đ</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold">Ghi chú giải trình: </span>
                        <span className="text-slate-800">{sub.notes || 'Không có ghi chú giải trình.'}</span>
                      </div>

                      {/* Evidence files */}
                      {sub.evidenceFiles && sub.evidenceFiles.length > 0 && (
                        <div>
                          <p className="text-[11px] font-bold text-slate-500 mb-1.5">Tệp minh chứng đính kèm:</p>
                          <div className="flex flex-wrap gap-2">
                            {sub.evidenceFiles.map(file => (
                              <span
                                key={file.id}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200"
                              >
                                <FileText className="w-3.5 h-3.5 text-blue-600" />
                                <span>{file.name}</span>
                                {file.size && <span className="text-slate-400">({file.size})</span>}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Admin Scoring Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 items-center">
                      <div className="sm:col-span-4 flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-700 shrink-0">Điểm phê duyệt:</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max={crit.maxPoints}
                          value={rev.points}
                          onChange={(e) => {
                            const val = Math.min(Math.max(parseFloat(e.target.value) || 0, 0), crit.maxPoints);
                            setReviewScores({
                              ...reviewScores,
                              [crit.id]: { ...rev, points: val }
                            });
                          }}
                          className="w-20 px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-black text-center text-emerald-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <span className="text-xs font-bold text-slate-400">/ {crit.maxPoints}đ</span>
                      </div>

                      <div className="sm:col-span-8">
                        <input
                          type="text"
                          placeholder="Ý kiến nhận xét thẩm định của Đoàn Phường..."
                          value={rev.feedback}
                          onChange={(e) => {
                            setReviewScores({
                              ...reviewScores,
                              [crit.id]: { ...rev, feedback: e.target.value }
                            });
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl">
              <div>
                <span className="text-xs font-bold text-slate-500">Tổng điểm thẩm định chính thức: </span>
                <span className="text-lg font-black text-emerald-600">
                  {Object.values(reviewScores).reduce((s, r) => s + (r.points || 0), 0).toFixed(1)} / 100 điểm
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setReviewBranch(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-200 text-xs font-bold transition-all cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleSaveReview}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu & Phê Duyệt Điểm</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Report Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Báo Cáo Tổng Hợp Kết Quả Thi Đua 2026</h3>
                <p className="text-xs text-slate-400">Đoàn TNCS Hồ Chí Minh Phường Chánh Hiệp</p>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 font-mono">
                <p className="font-bold text-slate-900">ĐOÀN TNCS HỒ CHÍ MINH TP. HỒ CHÍ MINH</p>
                <p className="font-bold text-slate-900">BCH ĐOÀN PHƯỜNG CHÁNH HIỆP</p>
                <p className="text-slate-500">Số: 16-BC/ĐTN • Chánh Hiệp, ngày {new Date().toLocaleDateString('vi-VN')}</p>
                <p className="font-black text-center text-sm text-slate-900 pt-2">
                  BẢNG TỔNG HỢP VÀ XẾP HẠNG THI ĐUA CÁC CHI ĐOÀN TRỰC THUỘC NĂM 2026
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-800">Tóm tắt kết quả xếp loại:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Tổng số Chi đoàn đánh giá: {branches.length} đơn vị</li>
                  <li>Chi đoàn Vững mạnh Xuất sắc: {countExcellent} đơn vị ({((countExcellent / branches.length) * 100).toFixed(0)}%)</li>
                  <li>Chi đoàn Vững mạnh (Tốt): {countGood} đơn vị ({((countGood / branches.length) * 100).toFixed(0)}%)</li>
                  <li>Chi đoàn Khá: {countFair} đơn vị ({((countFair / branches.length) * 100).toFixed(0)}%)</li>
                  <li>Chi đoàn Trung bình: {countAverage} đơn vị</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-500/20"
              >
                <Printer className="w-4 h-4" />
                <span>In Báo Cáo / Xuất PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
